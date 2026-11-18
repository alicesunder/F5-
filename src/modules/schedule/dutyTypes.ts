export type DutyStatus = 'completed' | 'on-duty' | 'upcoming';

export interface DutyRosterItem {
  id: string;
  dayNumber: number; // 1 to 30
  dayOfWeek: string; // e.g. "วันอังคาร"
  dateThai: string; // e.g. "วันอังคารที่ ๑ ก.ย.๖๙"
  dateDisplay: string; // e.g. "1 ก.ย. 69"
  rawDate: string; // "2026-09-01"
  actualOfficer: string; // เวรปฏิบัติจริง
  signedOfficer: string; // เวรเซ็นต์ชื่อ
  isSubstitute: boolean; // actualOfficer !== signedOfficer
  substituteReason?: string; // e.g. "ติดภารกิจราชการเร่งด่วน / สับเปลี่ยนเวรตามข้อตกลง"
  status: DutyStatus;
  timeRange: string; // "08.30 - 08.30 น. (วันถัดไป)"
  location: string; // "สง.ฝอ.๕ บก.อก.บช.ตชด."
  phone?: string;
  isSigned: boolean;
  signedAt?: string;
  logReport?: string; // บันทึกเหตุการณ์ระหว่างปฏิบัติหน้าที่
  isWeekend: boolean; // วันเสาร์-อาทิตย์
}

export interface DutyOfficerSummary {
  name: string;
  rank: string;
  shortRank: string;
  totalActualDuties: number;
  totalSignedDuties: number;
  substitutedForOthers: number; // เข้าแทนผู้อื่น
  replacedByOthers: number; // ให้ผู้อื่นเข้าแทน
  dutyDays: number[]; // e.g. [1, 10, 19, 28]
  phone: string;
}

export type DutyViewMode = 'table' | 'calendar' | 'officers' | 'official-print';
