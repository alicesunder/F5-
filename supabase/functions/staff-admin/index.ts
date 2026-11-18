// จัดการบัญชีบุคลากร (เฉพาะ SUPER_ADMIN / ADMIN ที่ยังใช้งานอยู่)
// POST {action:'create', email, password, name, rank, position, department, phone, role}
// POST {action:'update', user_id, name?, rank?, position?, department?, phone?, role?, active?}
// POST {action:'password', user_id, password}
import { createClient } from 'npm:@supabase/supabase-js@2.49.4';

const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const ROLES = new Set(['SUPER_ADMIN', 'ADMIN', 'ADMIN_DEPARTMENT', 'RELATIONS', 'DISASTER', 'VOLUNTEER', 'VIEWER']);
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : undefined);

function profile(b: Record<string, unknown>) {
  const p: Record<string, unknown> = {};
  for (const k of ['name', 'rank', 'position', 'department', 'phone'] as const) {
    const v = str(b[k], 300);
    if (v !== undefined) p[k] = v;
  }
  if (b.role !== undefined) {
    if (typeof b.role !== 'string' || !ROLES.has(b.role)) throw new Error('สิทธิ์ไม่ถูกต้อง');
    p.role = b.role;
  }
  if (b.active !== undefined) p.active = b.active === true;
  return p;
}

function checkPassword(pw: unknown) {
  if (typeof pw !== 'string' || pw.length < 10) throw new Error('รหัสผ่านต้องยาวอย่างน้อย 10 ตัวอักษร');
  return pw;
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'method' }, 405);

  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const { data: who } = await admin.auth.getUser(token);
  if (!who?.user) return json({ error: 'ยังไม่ได้เข้าสู่ระบบ' }, 401);
  const { data: me } = await admin.from('staff').select('role, active').eq('user_id', who.user.id).maybeSingle();
  if (!me?.active || !['SUPER_ADMIN', 'ADMIN'].includes(me.role)) return json({ error: 'ไม่มีสิทธิ์จัดการผู้ใช้' }, 403);

  try {
    const b = await req.json();
    if (b.action === 'create') {
      const email = str(b.email, 200)?.toLowerCase();
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: 'อีเมลไม่ถูกต้อง' }, 400);
      const p = profile(b);
      if (p.role === 'SUPER_ADMIN' && me.role !== 'SUPER_ADMIN') return json({ error: 'ไม่มีสิทธิ์สร้าง SUPER_ADMIN' }, 403);
      const { data, error } = await admin.auth.admin.createUser({ email, password: checkPassword(b.password), email_confirm: true });
      if (error || !data.user) return json({ error: error?.message || 'สร้างบัญชีไม่สำเร็จ' }, 400);
      const { error: e2 } = await admin.from('staff').insert({ user_id: data.user.id, email, role: 'VIEWER', ...p });
      if (e2) {
        await admin.auth.admin.deleteUser(data.user.id);
        return json({ error: e2.message }, 400);
      }
      return json({ ok: true, user_id: data.user.id });
    }

    const userId = str(b.user_id, 64);
    if (!userId) return json({ error: 'user_id' }, 400);
    const { data: target } = await admin.from('staff').select('role').eq('user_id', userId).maybeSingle();
    if (!target) return json({ error: 'ไม่พบผู้ใช้' }, 404);
    if (target.role === 'SUPER_ADMIN' && me.role !== 'SUPER_ADMIN') return json({ error: 'ไม่มีสิทธิ์แก้ SUPER_ADMIN' }, 403);

    if (b.action === 'update') {
      const p = profile(b);
      if (p.role === 'SUPER_ADMIN' && me.role !== 'SUPER_ADMIN') return json({ error: 'ไม่มีสิทธิ์ตั้ง SUPER_ADMIN' }, 403);
      if (userId === who.user.id && (p.active === false || (p.role && p.role !== me.role))) {
        return json({ error: 'แก้สิทธิ์หรือปิดบัญชีของตัวเองไม่ได้' }, 400);
      }
      const { error } = await admin.from('staff').update(p).eq('user_id', userId);
      // ปิดบัญชีแล้วมีผลทันที: RLS ตรวจ staff.active ทุกคำขอ
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (b.action === 'password') {
      const { error } = await admin.auth.admin.updateUserById(userId, { password: checkPassword(b.password) });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: 'action' }, 400);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 400);
  }
});
