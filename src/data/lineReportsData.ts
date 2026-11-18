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
  messageType: string;
  dept: LineReportDept;
  matchedKeyword?: string;
  status: LineReportStatus;
  note?: string;
  /** path ในที่เก็บไฟล์ line-media ของ Supabase (ขอ signed URL ตอนแสดง) */
  mediaPaths: string[];
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
