export type VolunteerMissionStatus =
  | 'PLANNING'            // วางแผน
  | 'PENDING_ASSIGNMENT' // รอดำเนินการ
  | 'IN_PROGRESS'        // กำลังดำเนินการ
  | 'COMPLETED'          // เสร็จสิ้น
  | 'PENDING_REPORT'     // รอรายงาน
  | 'PENDING_REVIEW'     // รอตรวจ
  | 'CLOSED';            // ปิดภารกิจ

export type VolunteerReportStatus =
  | 'NOT_SUBMITTED'       // ยังไม่ส่ง ⚪
  | 'SUBMITTED'           // ส่งแล้ว 🔵
  | 'PENDING_REVIEW'      // รอตรวจ 🟠
  | 'APPROVED'            // ผ่าน 🟢
  | 'REVISION_REQUESTED'; // ขอแก้ไข 🔴

export type VolunteerRole =
  | 'SUPER_ADMIN'
  | 'EXECUTIVE'          // ผู้บริหาร
  | 'FO5_OFFICER'        // ฝอ.5
  | 'VOLUNTEER_OFFICER'  // เจ้าหน้าที่จิตอาสา
  | 'UNIT_COORDINATOR'   // ผู้ประสานหน่วย
  | 'FIELD_UNIT'         // หน่วยปฏิบัติ
  | 'VIEWER';            // ผู้ดูข้อมูล

export interface VolunteerCategory {
  id: string;
  name: string;
  icon?: string;
  color: string;
  description: string;
  isSystemDefault: boolean;
}

export interface VolunteerUnitNode {
  id: string;
  name: string;
  shortName: string;
  code: string;
  level: 'HQ' | 'BOK' | 'KOK' | 'COMPANY';
  parentId?: string;
  commander: string;
  contactPhone: string;
  totalMissions: number;
  completedMissions: number;
  pendingReports: number;
  overdueReports: number;
  onTimeRate: number; // 0 - 100
  activePersonnel: number;
  children?: VolunteerUnitNode[];
}

export interface CrossDepartmentLink {
  department: 'admin' | 'relations' | 'disaster';
  title: string;
  refId: string;
  route: string;
  actionNote?: string;
}

export interface VolunteerMissionItem {
  id: string;
  code: string; // e.g. V-2569-082
  title: string;
  date: string; // display e.g. "17 ก.ค. 2569"
  rawDate: string; // "2026-07-17"
  startTime: string; // "08:30"
  endTime: string;   // "16:30"
  location: string;
  district: string;
  province: string;
  category: string;
  unitId: string;
  unitName: string;
  assignedPersonnelCount: number;
  status: VolunteerMissionStatus;
  uniform: string; // เช่น "เครื่องแบบจิตอาสาพระราชทาน (เสื้อเหลือง หมวก ผ้าพันคอพระราชทาน)"
  coordinatorName: string;
  coordinatorRank: string;
  coordinatorPhone: string;
  description: string;
  objectives: string[];
  workflowStep: number; // 1 to 7: 1.สร้าง 2.มอบหมาย 3.รับทราบ 4.ปฏิบัติ 5.ส่งรายงาน 6.ตรวจสอบ 7.ปิดภารกิจ
  reportId?: string;
  reportStatus?: VolunteerReportStatus;
  documents?: { id: string; name: string; size: string; url: string }[];
  photos?: { id: string; url: string; caption: string }[];
  crossDepartmentLinks?: CrossDepartmentLink[];
}

export interface VolunteerReportItem {
  id: string;
  missionId: string;
  missionCode: string;
  missionTitle: string;
  unitId: string;
  unitName: string;
  reporterName: string;
  reporterRank: string;
  reporterPosition: string;
  reporterPhone: string;
  submittedAt: string; // "17 ก.ค. 2569 16:45 น."
  rawSubmittedAt: string;
  outcomeSummary: string;
  actualPersonnelCount: number;
  participantBeneficiariesCount: number; // ประชาชนที่ได้รับประโยชน์
  location: string;
  executionTime: string;
  keyAchievements: string[];
  problemsAndObstacles: string[];
  photos: { id: string; url: string; caption: string; timestamp: string }[];
  documents: { id: string; name: string; size: string; type: string; url: string }[];
  status: VolunteerReportStatus;
  reviewNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  revisionReason?: string;
  aiSummaryDraft?: string;
}

export interface VolunteerPersonnelItem {
  id: string;
  code: string; // เช่น จอ.ตชด. 904-0321
  rank: string;
  fullName: string;
  affiliationUnit: string;
  unitId: string;
  phoneNumber: string;
  volunteerType: 'จิตอาสา 904' | 'จิตอาสาพระราชทาน' | 'จิตอาสาทั่วไป' | 'อาสาสมัครเครือข่าย';
  skills: string[];
  accumulatedHours: number;
  completedMissionsCount: number;
  status: 'พร้อมปฏิบัติ' | 'อยู่ระหว่างภารกิจ' | 'ติดราชการ' | 'สำรอง';
  badgeNumber?: string;
}

export interface VolunteerMediaItem {
  id: string;
  missionId: string;
  missionTitle: string;
  url: string;
  caption: string;
  unitName: string;
  date: string;
  category: string;
  tags: string[];
}

export interface VolunteerDocumentItem {
  id: string;
  title: string;
  documentNumber: string;
  date: string;
  category: 'คำสั่ง' | 'หนังสือสั่งการ' | 'แบบฟอร์ม' | 'รายงานสรุป' | 'คู่มือปฏิบัติงาน';
  size: string;
  authorUnit: string;
  version: string;
  url: string;
}

export interface VolunteerAuditLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRank: string;
  actorRole: string;
  action: string;
  fromStatus?: string;
  toStatus?: string;
  targetType: 'MISSION' | 'REPORT' | 'UNIT' | 'CATEGORY';
  targetTitle: string;
}

export interface VolunteerNotificationItem {
  id: string;
  title: string;
  message: string;
  type:
    | 'NEW_MISSION'
    | 'ASSIGNED'
    | 'DUE_SOON'
    | 'REPORT_PENDING'
    | 'REPORT_SUBMITTED'
    | 'REVISION_REQUESTED'
    | 'REPORT_APPROVED';
  timestamp: string;
  isRead: boolean;
  targetMissionId?: string;
  targetReportId?: string;
}

export interface VolunteerAttentionItem {
  id: string;
  type: 'UNSUBMITTED_REPORT' | 'PENDING_REVIEW_REPORT' | 'DUE_SOON_MISSION' | 'UNCONFIRMED_UNIT' | 'REVISION_NEEDED';
  count: number;
  label: string;
  actionLabel: string;
  filterView: string;
  badgeColor: string;
}
