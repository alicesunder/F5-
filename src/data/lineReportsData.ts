export type LineDept = 'admin' | 'relations' | 'disaster' | 'volunteer';
export type LineReportDept = LineDept | 'unassigned';
export type LineReportStatus = 'new' | 'acknowledged' | 'in_progress' | 'done';

export interface LineReport {
  id: string;
  receivedAt: string; // ISO
  groupName: string;
  senderName: string;
  unit?: string;
  text: string;
  imageCount: number;
  dept: LineReportDept;
  matchedKeyword?: string;
  status: LineReportStatus;
  note?: string;
  /** รายการตัวอย่างสำหรับทดสอบหน้าจอ จะถูกแทนที่ด้วยข้อมูลจริงเมื่อต่อบอท LINE */
  isSample: boolean;
}

export const LINE_DEPT_META: Record<LineReportDept, { label: string; color: string }> = {
  admin: { label: 'งานอำนวยการ', color: '#5B2A86' },
  relations: { label: 'งานประชาสัมพันธ์', color: '#2583D8' },
  disaster: { label: 'งานพัฒนาช่วยเหลือประชาชน', color: '#E89B22' },
  volunteer: { label: 'งานจิตอาสา', color: '#42A77A' },
  unassigned: { label: 'ยังไม่จัดหมวด', color: '#64748B' },
};

export const LINE_STATUS_META: Record<LineReportStatus, { label: string; tone: string }> = {
  new: { label: 'ใหม่', tone: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300' },
  acknowledged: { label: 'รับทราบ', tone: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' },
  in_progress: { label: 'กำลังดำเนินการ', tone: 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300' },
  done: { label: 'เสร็จสิ้น', tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' },
};

/**
 * กติกาจัดแผนกจากคำสำคัญ ลำดับก่อนหลังมีผล (กติกาที่อยู่ก่อนถูกตรวจก่อน)
 * ตรวจเฉพาะ HEAD_LENGTH ตัวอักษรแรกของข้อความ เหมือน line-to-discord-worker-v4.js
 */
export const LINE_HEAD_LENGTH = 150;

export const LINE_ROUTES: { dept: LineDept; keywords: string[] }[] = [
  { dept: 'relations', keywords: ['ตารางช่างภาพ', 'ตารางงานช่างภาพ', 'ตำรวจทำดี', 'ผลการตรวจสอบข่าว', 'ตรวจสอบข่าว', 'เสริมสร้างภาพลักษณ์', 'ข่าวประจำวัน', 'สรุปข่าว', 'ข่าวเช้า', 'ประชาสัมพันธ์'] },
  { dept: 'volunteer', keywords: ['จิตอาสา', 'จอ.01', 'จอ.๐๑', 'พระราชทาน'] },
  { dept: 'disaster', keywords: ['น้ำท่วม', 'น้ำป่า', 'ภัยพิบัติ', 'ดินโคลน', 'บรรเทาสาธารณภัย', 'ช่วยเหลือประชาชน', 'ระดับน้ำ'] },
  { dept: 'admin', keywords: ['หนังสือ', 'งบประมาณ', 'ประชุม', 'สารบรรณ', 'กำลังพล', 'ไปราชการ'] },
];

export const classifyLineReport = (
  text: string,
  groupDept?: LineDept
): { dept: LineReportDept; matchedKeyword?: string } => {
  if (groupDept) return { dept: groupDept };
  const head = text.slice(0, LINE_HEAD_LENGTH);
  for (const route of LINE_ROUTES) {
    const hit = route.keywords.find(k => head.includes(k));
    if (hit) return { dept: route.dept, matchedKeyword: hit };
  }
  return { dept: 'unassigned' };
};

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

const sample = (
  id: string,
  ago: number,
  groupName: string,
  senderName: string,
  unit: string,
  text: string,
  imageCount: number,
  status: LineReportStatus
): LineReport => ({
  id,
  receivedAt: minutesAgo(ago),
  groupName,
  senderName,
  unit,
  text,
  imageCount,
  status,
  isSample: true,
  ...classifyLineReport(text),
});

export const INITIAL_LINE_REPORTS: LineReport[] = [
  sample('LR-S01', 12, 'ฝอ5-รายงานรวม', 'ด.ต.ตัวอย่าง หนึ่ง', 'กก.ตชด.12',
    'รายงานผล จอ.01 กิจกรรมจิตอาสาพัฒนา รร.ตชด.บ้านตัวอย่าง กำลังพล 145 นาย ปฏิบัติแล้วเสร็จร้อยละ 75', 3, 'new'),
  sample('LR-S02', 47, 'ฝอ5-รายงานรวม', 'ส.ต.อ.ตัวอย่าง สอง', 'กก.ตชด.34',
    'แจ้งระดับน้ำลำห้วยเพิ่มสูงขึ้น 30 ซม. ภายใน 2 ชม. ได้แจ้งเตือนหมู่บ้านเสี่ยงดินโคลนแล้ว', 2, 'new'),
  sample('LR-S03', 95, 'ฝอ5-รายงานรวม', 'ร.ต.ต.ตัวอย่าง สาม', 'บก.อก.บช.ตชด.',
    'ตารางช่างภาพ วันพรุ่งนี้ ภารกิจแถลงข่าวเวลา 10.00 น.', 0, 'acknowledged'),
  sample('LR-S04', 180, 'ฝอ5-รายงานรวม', 'พ.ต.ต.ตัวอย่าง สี่', 'บก.ตชด.ภาค 3',
    'ส่งหนังสือขอเบิกงบประมาณไตรมาส 4 เรียบร้อยแล้ว รอตรวจรับ', 1, 'in_progress'),
  sample('LR-S05', 240, 'ฝอ5-รายงานรวม', 'ส.ต.ท.ตัวอย่าง ห้า', 'กก.ตชด.42',
    'ตรวจสอบข่าว: ไม่พบข้อมูลเท็จที่เกี่ยวข้องกับหน่วย ตรวจแล้ว 12 ช่องทาง', 0, 'done'),
  sample('LR-S06', 330, 'ฝอ5-รายงานรวม', 'จ.ส.ต.ตัวอย่าง หก', 'กก.ตชด.21',
    'วันนี้ฝนตกหนักในพื้นที่ ถนนบางช่วงลื่น ขอให้ระวังการเดินทาง', 1, 'new'),
];
