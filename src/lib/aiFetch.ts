import { supabase, isSupabaseConfigured } from './supabase';

/** เรียก /api/ai พร้อม token ของผู้ใช้ (เซิร์ฟเวอร์ตรวจว่าเป็นบุคลากรก่อนใช้โควตา Gemini) */
export async function aiFetch(body: unknown): Promise<Response> {
  let token = '';
  if (isSupabaseConfigured) {
    const { data } = await supabase.auth.getSession();
    token = data.session?.access_token ?? '';
  }
  return fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
}
