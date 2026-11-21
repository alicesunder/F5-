// ตัวคัดกรอง "ข้อความคุยเล่น" ออกจากรายงาน LINE
// ใช้กติกาเดียวกันสองที่: ที่นี่ (ซ่อนข้อความเก่าที่เคยเข้ามาแล้ว) และใน supabase/functions/line-ingest/index.ts (ไม่รับเข้าฐานข้อมูลตั้งแต่ต้น)
// ถ้าแก้กติกา ให้แก้ให้ตรงกันทั้งสองไฟล์
// หลักคิด: ตัดเฉพาะที่ "ชัดว่าไม่ใช่งาน" เพื่อไม่ให้รายงานจริงหาย — ข้อความยาวหรือมีคำเกี่ยวกับงานจะผ่านเสมอ

export interface ChatCheckInput {
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
export function isWorkMessage(m: ChatCheckInput): boolean {
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
