// รับข้อมูลจากบอท LINE (Cloudflare Worker v5) แล้วบันทึกลงฐานข้อมูล/ที่เก็บรูป ด้วยสิทธิ์ service_role ที่อยู่ในฟังก์ชันนี้เท่านั้น
// บอทยืนยันตัวด้วย header x-ingest-secret (ค่าเก็บในตาราง public.app_secrets key = 'line_ingest_secret')
// action=group  : {group_id, name}             -> {dept, name}   (ลงทะเบียนกลุ่มใหม่ และจับคู่แผนกจากชื่อกลุ่ม)
// action=media  : ?path=YYYY-MM/<id>.<ext> body = ไฟล์รูป -> {path}
// action=report : แถวของ line_reports (JSON)  -> {ok:true}      (ข้อความซ้ำถูกข้าม)
//
// กติกาจัดแผนกและอ่านชื่อหน่วยอยู่ที่นี่ (แก้ที่นี่ที่เดียว ไม่ต้องวางโค้ดบอทใหม่)
// อ้างอิง: โครงสร้างกลุ่มการสื่อสาร ฝอ.5 (12 กลุ่ม, บช. > บก. 7 > กก. 26 > ร้อย 64)
import { createClient } from 'npm:@supabase/supabase-js@2.49.4';

const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type Dept = 'relations' | 'volunteer' | 'disaster' | 'admin';
const DEPTS = new Set(['relations', 'volunteer', 'disaster', 'admin', 'unassigned']);
const MAX_MEDIA = 8 * 1024 * 1024;
let cachedSecret: { value: string; at: number } | null = null;

// ชื่อกลุ่ม LINE -> แผนก (ตรวจตามลำดับ)
const GROUP_RULES: { dept: Dept; words: string[] }[] = [
  { dept: 'disaster', words: ['อพ.สธ', 'อพสธ', 'เศรษฐกิจพอเพียง', 'บรรเทาภัย', 'หญ้าแฝก', 'หญ้าเเฝก'] },
  { dept: 'relations', words: ['สร้างจิตสำนึก', 'แดร์', 'เเดร์', 'd.a.r.e', 'dare', 'โฆษก', 'ประชาสัมพันธ์'] },
  { dept: 'volunteer', words: ['จิตอาสา'] },
  { dept: 'admin', words: ['ขับเคลื่อนงานกร', 'กร.ตชด', 'ฝอ.5บก.อก', 'อำนวยการ'] },
];

// เนื้อหาข้อความ -> แผนก (ใช้เมื่อกลุ่มยังไม่ได้ผูกแผนก) ดูเฉพาะช่วงต้นข้อความ
const TEXT_RULES: { dept: Dept; words: string[] }[] = [
  { dept: 'relations', words: ['ตารางช่างภาพ', 'ตำรวจทำดี', 'ตรวจสอบข่าว', 'เสริมสร้างภาพลักษณ์', 'ข่าวประจำวัน', 'สรุปข่าว', 'ประชาสัมพันธ์', 'สร้างจิตสำนึก', 'แดร์', 'd.a.r.e', 'โฆษก'] },
  { dept: 'disaster', words: ['อพ.สธ', 'เศรษฐกิจพอเพียง', 'หญ้าแฝก', 'บรรเทาภัย', 'น้ำท่วม', 'น้ำป่า', 'อุทกภัย', 'ภัยพิบัติ', 'ดินโคลน', 'บรรเทาสาธารณภัย', 'ช่วยเหลือประชาชน', 'ระดับน้ำ'] },
  { dept: 'volunteer', words: ['จิตอาสา', 'จอ.01', 'จอ.๐๑', 'พระราชทาน'] },
  { dept: 'admin', words: ['หนังสือ', 'งบประมาณ', 'ประชุม', 'สารบรรณ', 'กำลังพล', 'ไปราชการ', 'กิจการพลเรือน'] },
];

const norm = (t: string) => t.toLowerCase().replace(/\s+/g, '').replace(/\.{2,}/g, '.').replace(/เเ/g, 'แ');
const match = (text: string, rules: { dept: Dept; words: string[] }[]) => {
  const t = norm(text);
  for (const r of rules) {
    const w = r.words.find(x => t.includes(norm(x)));
    if (w) return { dept: r.dept, word: w };
  }
  return null;
};

/** อ่านชื่อหน่วยจากข้อความ ครอบคลุม ร้อย ตชด. / กก.ตชด. / กก.1-9 บก.กฝ. / ศฝส. / บก.ตชด.ภาค / บก.สอ. / บก.กฝ. / ศอพ. */
export function extractUnit(text: string): string | null {
  const t = (text || '').slice(0, 600);
  let m = t.match(/ร้อย\s*\.?\s*(?:ตชด\.?\s*)?([1-4][1-4][4-7])(?!\d)/);
  if (m) return `ร้อย ตชด.${m[1]}`;
  m = t.match(/กก\.?\s*([1-9])\s*บก\.?\s*กฝ/);
  if (m) return `กก.${m[1]} บก.กฝ.`;
  if (/ศฝส/.test(t)) return 'ศฝส.บก.กฝ.';
  m = t.match(/กก\.?\s*ตชด\.?\s*([1-4][1-7])(?!\d)/);
  if (m) return `กก.ตชด.${m[1]}`;
  m = t.match(/บก\.?\s*ตชด\.?\s*ภาค\s*([1-4])/);
  if (m) return `บก.ตชด.ภาค ${m[1]}`;
  if (/บก\.?\s*สอ/.test(t)) return 'บก.สอ.บช.ตชด.';
  if (/บก\.?\s*กฝ/.test(t)) return 'บก.กฝ.บช.ตชด.';
  if (/ศอพ/.test(t)) return 'ศอพ.บช.ตชด.';
  return null;
}


// ---- ตัวคัดกรองข้อความคุยเล่น (ต้องตรงกับ src/lib/lineChatFilter.ts) ----
interface ChatCheckInput {
  text: string;
  messageType: string;
  /** แผนกที่ระบบจัดให้แล้ว ('unassigned' = ยังไม่จัด) */
  dept: string;
  unit?: string | null;
}

/** คำที่บอกว่าเป็นเรื่องงาน */
const WORK_CUES = [
  'รายงาน', 'ผลการ', 'กำหนดการ', 'ภารกิจ', 'กิจกรรม', 'โครงการ', 'หนังสือ', 'คำสั่ง', 'ประชุม', 'อบรม', 'ลงพื้นที่',
  'มอบ', 'แจก', 'ช่วยเหลือ', 'น้ำท่วม', 'อุทกภัย', 'ภัยพิบัติ', 'จิตอาสา', 'ขอเชิญ', 'ขอความร่วมมือ', 'แจ้งให้', 'เรียน',
  'ด่วน', 'ที่สุด', 'วันที่', 'สถานที่', 'จำนวน', 'กำหนดส่ง', 'ตรวจสอบข่าว', 'ประชาสัมพันธ์', 'ข่าว', 'ตารางช่างภาพ',
  'สรุป', 'ยอด', 'กก.', 'บก.', 'ตชด', 'ร้อย', 'งบประมาณ', 'สารบรรณ', 'ไปราชการ', 'พระราชทาน', 'อพ.สธ', 'หญ้าแฝก',
];

/** ข้อความที่เป็นแค่ทักทาย/รับคำ/หัวเราะ */
const CHATTER_ONLY = /^(?:[\s​]*(?:555+|5555+|ฮ่า+|ฮา+|ครับ|ค่ะ|คะ|จ้า|จ๊ะ|จ้ะ|นะ|เด้อ|เนอะ|ๆ|รับทราบ|ทราบ|โอเค|ok|okay|ได้|ได้เลย|ขอบคุณ|ขอบคุณครับ|ขอบคุณค่ะ|สวัสดี|สวัสดีครับ|สวัสดีค่ะ|หวัดดี|ดี|ใช่|ไม่|เออ|อืม|อ๋อ|โอ้|เฮ้ย|เย้|555\+)[\s!.?~\-]*)+$/i;

const hasCue = (t: string) => WORK_CUES.some(w => t.includes(w));

/** ชนิดไฟล์ที่เป็นเอกสารงาน */
const DOC_EXT = /\.(pdf|docx?|xlsx?|pptx?|csv)\b/i;

/** true = เป็นเรื่องงาน (เก็บ) · false = คุยเล่น (ไม่เอา) */
function isWorkMessage(m: ChatCheckInput): boolean {
  const type = (m.messageType || 'text').toLowerCase();
  const text = (m.text || '').trim();
  const assigned = !!m.dept && m.dept !== 'unassigned';

  // สติกเกอร์ เสียง วิดีโอ ตำแหน่ง: ไม่ใช่รายงาน
  if (['sticker', 'audio', 'video', 'location'].includes(type)) return false;

  if (type === 'file') return DOC_EXT.test(text) || assigned;

  // รูปภาพล้วน ๆ จากกลุ่มที่ยังไม่ผูกแผนก: ไม่มีบริบทว่าเป็นงาน
  if (type === 'image') return assigned || !!m.unit;

  // ข้อความ
  if (m.unit) return true;
  if (CHATTER_ONLY.test(text)) return false;
  if (text.length >= 400) return true;
  if (hasCue(text) && text.length >= 20) return true;
  if (assigned && text.length >= 50) return true;
  return false;
}

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
      const name = str(b.name, 200);
      if (!groupId) return json({ error: 'group_id' }, 400);
      const { data } = await db.from('line_groups').select('dept,name').eq('group_id', groupId).maybeSingle();
      if (data) {
        // เติมชื่อกลุ่มถ้าเดิมยังไม่มี
        if (!data.name && name) await db.from('line_groups').update({ name }).eq('group_id', groupId);
        return json({ dept: data.dept || null, name: data.name || name });
      }
      // กลุ่มใหม่: จับคู่แผนกจากชื่อกลุ่มตามโครงสร้างกลุ่มการสื่อสาร ฝอ.5
      const guess = name ? match(name, GROUP_RULES) : null;
      await db
        .from('line_groups')
        .upsert({ group_id: groupId, name, dept: guess?.dept ?? null }, { onConflict: 'group_id', ignoreDuplicates: true });
      return json({ dept: guess?.dept ?? null, name });
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
      const text = str(b.text, 4000) || '';
      const row = {
        line_message_id: str(b.line_message_id, 100),
        group_id: str(b.group_id, 100),
        group_name: str(b.group_name, 200),
        sender_user_id: str(b.sender_user_id, 100),
        sender_name: str(b.sender_name, 120) || 'สมาชิก LINE',
        unit: extractUnit(text) || str(b.unit, 60),
        message_type: str(b.message_type, 30) || 'text',
        text,
        media_paths: Array.isArray(b.media_paths)
          ? b.media_paths.filter((p: unknown) => typeof p === 'string' && /^\d{4}-\d{2}\/[A-Za-z0-9_-]{1,64}\.(jpg|png|gif)$/.test(p)).slice(0, 10)
          : [],
        dept: DEPTS.has(b.dept) ? b.dept : 'unassigned',
        matched_keyword: str(b.matched_keyword, 100),
        received_at: str(b.received_at, 40) || new Date().toISOString(),
      };
      if (!row.line_message_id || !row.group_id) return json({ error: 'missing ids' }, 400);

      // แผนกที่ผูกกับกลุ่มสำคัญที่สุด แล้วจึงดูชื่อกลุ่ม แล้วจึงดูเนื้อหาข้อความ
      const { data: g } = await db.from('line_groups').select('dept,name').eq('group_id', row.group_id).maybeSingle();
      if (g?.dept) {
        row.dept = g.dept;
        row.matched_keyword = null;
      } else {
        // ชื่อกลุ่มบอกงานได้ชัดกว่าคำในข้อความ
        const byName = match(row.group_name || g?.name || '', GROUP_RULES);
        const hit = byName || (row.dept === 'unassigned' ? match(text.slice(0, 200), TEXT_RULES) : null);
        if (hit) {
          row.dept = hit.dept;
          row.matched_keyword = hit.word;
        }
      }

      // ข้อความคุยเล่น: ไม่เก็บลงฐานข้อมูล ไม่ให้เข้าเว็บ
      if (!isWorkMessage({ text, messageType: row.message_type, dept: row.dept, unit: row.unit })) {
        return json({ ok: true, skipped: 'chat' });
      }

      const { error } = await db.from('line_reports').upsert(row, { onConflict: 'line_message_id', ignoreDuplicates: true });
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true, dept: row.dept, unit: row.unit });
    }

    return json({ error: 'action' }, 400);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
