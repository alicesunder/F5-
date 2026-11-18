// Vercel Function: ตัวกลางเรียก Gemini ให้ผู้ช่วย AI ของเว็บ
// - ต้องล็อกอินและอยู่ในรายชื่อบุคลากร (ตรวจด้วย token ของผู้ใช้กับตาราง staff ผ่าน RLS) ไม่ให้คนนอกใช้โควตา
// - ต้องตั้ง GEMINI_API_KEY ใน Vercel (ไม่ตั้ง = ตอบ configured:false และเว็บใช้โหมดออฟไลน์)
// - GET คืนสถานะ {configured}

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

function send(res: any, status: number, body: unknown) {
  res.status(status).setHeader('Cache-Control', 'no-store').json(body);
}

async function isStaff(token: string): Promise<boolean> {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key || !token) return false;
  const r = await fetch(`${url}/rest/v1/staff?select=user_id&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${token}` },
  });
  if (!r.ok) return false;
  const rows = (await r.json()) as unknown[];
  return rows.length > 0;
}

export default async function handler(req: any, res: any) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (req.method === 'GET') return send(res, 200, { configured: !!apiKey });
  if (req.method !== 'POST') return send(res, 405, { error: 'method' });

  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!(await isStaff(token))) return send(res, 401, { error: 'unauthorized' });
  if (!apiKey) return send(res, 503, { error: 'ยังไม่ได้ตั้งค่า GEMINI_API_KEY' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const prompt = String(body.prompt || '').slice(0, 20000);
  if (!prompt.trim()) return send(res, 400, { error: 'prompt' });
  const department = String(body.department || 'ฝ่ายอำนวยการ ๕ บช.ตชด.').slice(0, 200);
  const context = body.context ? JSON.stringify(body.context).slice(0, 20000) : '';

  const system =
    `คุณคือผู้ช่วยงานราชการของ ${department} ตอบเป็นภาษาไทยสุภาพ กระชับ ใช้ข้อมูลที่ได้รับเท่านั้น ` +
    `ห้ามแต่งข้อเท็จจริง ตัวเลข ชื่อบุคคล หรือเลขที่หนังสือที่ไม่มีในข้อมูล ถ้าข้อมูลไม่พอให้บอกว่าต้องตรวจสอบเพิ่ม`;

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: 'user', parts: [{ text: context ? `${prompt}\n\nข้อมูลประกอบ:\n${context}` : prompt }] }],
        }),
      }
    );
    if (!r.ok) return send(res, 502, { error: `gemini ${r.status}` });
    const j: any = await r.json();
    const text = (j.candidates?.[0]?.content?.parts || []).map((p: any) => p.text || '').join('').trim();
    if (!text) return send(res, 502, { error: 'empty' });
    return send(res, 200, { text, provider: 'gemini' });
  } catch (e) {
    return send(res, 502, { error: e instanceof Error ? e.message : 'upstream' });
  }
}
