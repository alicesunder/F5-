import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** false เมื่อยังไม่ได้ตั้งค่า VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (หน้าเข้าสู่ระบบจะแจ้งผู้ใช้) */
export const isSupabaseConfigured = Boolean(url && key);

// คีย์ที่ใช้ในเว็บเป็นคีย์สาธารณะ (publishable) ความปลอดภัยมาจาก RLS ใน Supabase ไม่ใช่การซ่อนคีย์
export const supabase = createClient(url || 'http://localhost:54321', key || 'missing-key', {
  auth: { persistSession: true, autoRefreshToken: true },
});
