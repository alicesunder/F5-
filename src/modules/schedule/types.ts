export type BppMissionStatus =
  | 'ดำเนินการแล้ว'
  | 'อยู่ระหว่างดำเนินการ'
  | 'รอดำเนินการ'
  | 'ยังไม่กำหนด';

export type BppMissionCategory =
  | 'จิตอาสา'
  | 'อำนวยการ'
  | 'มวลชนสัมพันธ์'
  | 'สาธารณภัย'
  | 'ตรวจราชการ'
  | 'พิธีการ'
  | 'ทั่วไป';

export interface BppMissionItem {
  id: string;
  date: string; // e.g. "17 ก.ค. 69" or "18 - 19 ก.ค. 69"
  rawDate: string; // ISO format for calendar sorting "2026-07-17"
  rawEndDate?: string; // For multi-day "2026-07-19"
  dayNumber: number; // 17
  monthYear: string; // "กรกฎาคม 2569"
  time: string; // "07.00-21.00 น.", "ยังไม่ทราบ", etc.
  title: string;
  location: string;
  attendees: string;
  uniform: string;
  responsible: string; // "จอส.", "อก.", "มชส.", "สว.บอล", etc.
  category: BppMissionCategory;
  status: BppMissionStatus;
  remarks: string;
  notes?: string;
  createdAt?: string;
}

export type BppScheduleViewMode = 'table' | 'calendar' | 'timeline';
