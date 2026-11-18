// รับข้อมูลจากบอท LINE (Cloudflare Worker v5) แล้วบันทึกลงฐานข้อมูล/ที่เก็บรูป ด้วยสิทธิ์ service_role ที่อยู่ในฟังก์ชันนี้เท่านั้น
// บอทยืนยันตัวด้วย header x-ingest-secret (ค่าเก็บในตาราง public.app_secrets key = 'line_ingest_secret')
// action=group  : {group_id, name}             -> {dept, name}   (ลงทะเบียนกลุ่มใหม่อัตโนมัติ)
// action=media  : ?path=YYYY-MM/<id>.<ext> body = ไฟล์รูป -> {path}
// action=report : แถวของ line_reports (JSON)  -> {ok:true}      (ข้อความซ้ำถูกข้าม)
import { createClient } from 'npm:@supabase/supabase-js@2.49.4';

const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const DEPTS = new Set(['relations', 'volunteer', 'disaster', 'admin', 'unassigned']);
const MAX_MEDIA = 8 * 1024 * 1024;
let cachedSecret: { value: string; at: number } | null = null;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

async function secret(): Promise<string | null> {
  if (cachedSecret && Date.now() - cachedSecret.at < 60_000) return cachedSecret.value;
  const { data } = await db.from('app_secrets').select('value').eq('key', 'line_ingest_secret').maybeSingle();
  if (!data?.value) return null;
  cachedSecret = { value: data.value, at: Date.now() };
  return data.value;
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : null);

Deno.serve(async req => {
  if (req.method !== 'POST') return json({ error: 'method' }, 405);
  const expected = await secret();
  const given = req.headers.get('x-ingest-secret') || '';
  if (!expected || !safeEqual(given, expected)) return json({ error: 'unauthorized' }, 401);

  const url = new URL(req.url);
  const action = url.searchParams.get('action');

  try {
    if (action === 'group') {
      const b = await req.json();
      const groupId = str(b.group_id, 100);
      if (!groupId) return json({ error: 'group_id' }, 400);
      const { data } = await db.from('line_groups').select('dept,name').eq('group_id', groupId).maybeSingle();
      if (data) return json({ dept: data.dept || null, name: data.name || str(b.name, 200) });
      await db.from('line_groups').upsert({ group_id: groupId, name: str(b.name, 200) }, { onConflict: 'group_id', ignoreDuplicates: true });
      return json({ dept: null, name: str(b.name, 200) });
    }

    if (action === 'media') {
      const path = url.searchParams.get('path') || '';
      if (!/^\d{4}-\d{2}\/[A-Za-z0-9_-]{1,64}\.(jpg|png|gif)$/.test(path)) return json({ error: 'path' }, 400);
      const type = req.headers.get('content-type') || 'image/jpeg';
      if (!/^image\/(jpeg|png|gif)$/.test(type)) return json({ error: 'type' }, 400);
      const buf = new Uint8Array(await req.arrayBuffer());
      if (!buf.length || buf.length > MAX_MEDIA) return json({ error: 'size' }, 400);
      const { error } = await db.storage.from('line-media').upload(path, buf, { contentType: type, upsert: true });
      if (error) return json({ error: error.message }, 500);
      return json({ path });
    }

    if (action === 'report') {
      const b = await req.json();
      const row = {
        line_message_id: str(b.line_message_id, 100),
        group_id: str(b.group_id, 100),
        group_name: str(b.group_name, 200),
        sender_user_id: str(b.sender_user_id, 100),
        sender_name: str(b.sender_name, 120) || 'สมาชิก LINE',
        unit: str(b.unit, 60),
        message_type: str(b.message_type, 30) || 'text',
        text: str(b.text, 4000) || '',
        media_paths: Array.isArray(b.media_paths)
          ? b.media_paths.filter((p: unknown) => typeof p === 'string' && /^\d{4}-\d{2}\/[A-Za-z0-9_-]{1,64}\.(jpg|png|gif)$/.test(p)).slice(0, 10)
          : [],
        dept: DEPTS.has(b.dept) ? b.dept : 'unassigned',
        matched_keyword: str(b.matched_keyword, 100),
        received_at: str(b.received_at, 40) || new Date().toISOString(),
      };
      if (!row.line_message_id || !row.group_id) return json({ error: 'missing ids' }, 400);
      const { error } = await db.from('line_reports').upsert(row, { onConflict: 'line_message_id', ignoreDuplicates: true });
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    return json({ error: 'action' }, 400);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
