export type DepartmentRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'ADMIN_DEPARTMENT'
  | 'RELATIONS'
  | 'DISASTER'
  | 'VOLUNTEER'
  | 'VIEWER';

export type Role =
  | DepartmentRole
  | 'admin'
  | 'executive'
  | 'officer'
  | 'viewer';

export type UserRole = Role;

export type AppModule =
  | 'home'
  | 'login'
  | 'my-space'
  | 'dashboard'
  | 'admin'
  | 'relations'
  | 'disaster'
  | 'volunteer'
  | 'reports'
  | 'calendar'
  | 'duty-roster'
  | 'documents'
  | 'slides'
  | 'news'
  | 'settings'
  | 'workspace'
  | 'maps'
  | 'bpp-tracker'
  | 'task-center'
  | 'strategic'
  | 'communication-groups'
  | 'executive-view'
  | 'ai-intelligence'
  | 'history-audit'
  | 'knowledge-center'
  | 'smart-systems';

export type DepartmentId = 'admin' | 'relations' | 'disaster' | 'volunteer';

export interface UserSession {
  token: string;
  user: {
    id: string;
    username: string;
    name: string;
    rank: string;
    position: string;
    department: string;
    email: string;
    role: DepartmentRole;
  };
  loginAt: string;
  rememberMe: boolean;
  expiresAt: number;
}

export interface DepartmentConfig {
  id: DepartmentId;
  name: string;
  enName: string;
  primaryColor: string; // e.g. #7F9B83
  description: string;
  status: 'พร้อมใช้งาน' | 'กำลังพัฒนา';
  buttonText: string;
  isAvailable: boolean;
  route: string;
  allowedRoles: Role[];
}

export interface Unit {
  unit_id: string;
  unit_name: string;
  unit_code: string;
  parent_unit?: string;
  address?: string;
  province?: string;
  district?: string;
  phone: string;
  contact_phone?: string;
  email: string;
  contact_email?: string;
  commander: string;
  head_of_unit?: string;
  commander_rank?: string;
  description: string;
  location?: string;
  responsibilities?: string[];
  status?: 'active' | 'inactive';
  level?: 'division' | 'subdivision' | 'section';
}

export type PersonnelStatus =
  | 'active'
  | 'leave'
  | 'transferred'
  | 'ปฏิบัติหน้าที่ปกติ'
  | 'ไปราชการ'
  | 'ลาพักผ่อน'
  | 'อบรม';

export interface Personnel {
  person_id: string;
  name: string;
  rank: string;
  position: string;
  department: string;
  unit_id?: string;
  responsibility?: string;
  phone: string;
  email: string;
  status: PersonnelStatus;
  avatar?: string;
  education?: string;
}

export type BudgetCategory = 'งบดำเนินงาน' | 'งบบุคลากร' | 'งบลงทุน' | 'งบอุดหนุน' | 'งบรายจ่ายอื่น';
export type BudgetStatus =
  | 'กำลังดำเนินการ'
  | 'ผูกพันงบประมาณ'
  | 'เบิกจ่ายครบถ้วน'
  | 'ระงับชั่วคราว'
  | 'อนุมัติแล้ว'
  | 'อยู่ระหว่างเบิกจ่าย'
  | 'เบิกจ่ายครบแล้ว'
  | 'ชะลอการใช้จ่าย';

export interface BudgetItem {
  budget_id: string;
  fiscal_year: number; // e.g. 2569
  budget_category: BudgetCategory | string;
  project_name: string;
  budget_type: 'งบประมาณตามแผน' | 'งบประมาณจัดสรรเพิ่มเติม' | 'งบประมาณฉุกเฉิน/เร่งด่วน' | 'งบโครงการพิเศษ' | string;
  allocated_amount: number;
  committed_amount: number;
  spent_amount: number;
  remaining_amount: number;
  status: BudgetStatus | string;
  responsible_unit: string;
  responsible_person?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type VehicleType =
  | 'รถยนต์ส่วนกลาง'
  | 'รถตู้ส่วนกลาง'
  | 'รถตู้ราชการ'
  | 'เครื่องบิน'
  | 'เครื่องบินโดยสาร'
  | 'รถไฟ'
  | 'ยานพาหนะส่วนตัว'
  | string;

export type TravelStatus =
  | 'รออนุมัติ'
  | 'อนุมัติแล้ว'
  | 'กำหนดการ'
  | 'กำลังดำเนินการ'
  | 'อยู่ระหว่างปฏิบัติงาน'
  | 'เสร็จสิ้น'
  | 'ยกเลิก';

export interface TravelRecord {
  travel_id: string;
  order_number: string;
  traveler_name: string;
  position: string;
  department?: string;
  unit?: string;
  destination: string;
  province: string;
  purpose: string;
  departure_date: string; // YYYY-MM-DD
  return_date: string;    // YYYY-MM-DD
  vehicle?: VehicleType;
  vehicle_type?: VehicleType;
  vehicle_plate?: string;
  driver?: string;
  driver_name?: string;
  accommodation?: string;
  accommodation_cost?: number;
  allowance_amount?: number;
  transport_cost?: number;
  status: TravelStatus;
  budget_allocated?: number;
  notes?: string;
  created_at?: string;
}

export type UrgencyLevel = 'ปกติ' | 'ด่วน' | 'ด่วนมาก' | 'ด่วนที่สุด';
export type DocumentUrgency = UrgencyLevel;

export type IncomingStatus =
  | 'รับแล้ว'
  | 'รอดำเนินการ'
  | 'กำลังดำเนินการ'
  | 'เสนอผู้บังคับบัญชา'
  | 'ดำเนินการแล้ว'
  | 'เสร็จสิ้น'
  | 'ส่งต่อ'
  | 'เก็บเอกสาร';

export interface IncomingDocument {
  incoming_id: string;
  book_number: string;
  received_date: string; // YYYY-MM-DD
  document_date?: string; // YYYY-MM-DD
  sender: string;
  recipient?: string;
  subject: string;
  document_type?: 'หนังสือภายนอก' | 'หนังสือภายใน' | 'หนังสือสั่งการ' | 'หนังสือประชาสัมพันธ์' | 'บันทึกข้อความ' | string;
  urgency: DocumentUrgency;
  action_taken?: string;
  responsible_person: string;
  responsible_unit: string;
  deadline?: string;     // YYYY-MM-DD
  due_date?: string;     // YYYY-MM-DD
  status: IncomingStatus;
  attachment?: string;
  attachment_size?: string;
  notes?: string;
  created_at?: string;
}

export type OutgoingStatus =
  | 'ร่าง'
  | 'รอตรวจ'
  | 'รอลงนาม'
  | 'ส่งแล้ว'
  | 'จัดเก็บแล้ว';

export interface OutgoingDocument {
  outgoing_id: string;
  book_number: string;
  send_date: string;     // YYYY-MM-DD
  recipient: string;
  subject: string;
  document_type: 'หนังสือภายนอก' | 'หนังสือภายใน' | 'คำสั่ง' | 'ประกาศ' | 'รายงาน' | 'บันทึกข้อความ' | string;
  responsible_person: string;
  responsible_unit: string;
  status: OutgoingStatus;
  urgency: DocumentUrgency;
  attachment?: string;
  attachment_size?: string;
  notes?: string;
  created_at?: string;
}

export type DocumentCategory =
  | 'หนังสือรับ'
  | 'หนังสือส่ง'
  | 'คำสั่ง'
  | 'ประกาศ'
  | 'บันทึกข้อความ'
  | 'รายงาน'
  | 'โครงการ'
  | 'งบประมาณ'
  | 'ไปราชการ'
  | 'เอกสารบุคลากร'
  | 'เอกสารทั่วไป';

export type ArchivalCategory =
  | 'ระเบียบและคำสั่ง'
  | 'แผนงานและโครงการ'
  | 'รายงานการประชุม'
  | 'คู่มือการปฏิบัติงาน'
  | 'เอกสารสำคัญทางประวัติศาสตร์'
  | DocumentCategory
  | string;

export type SecurityLevel = 'เปิดเผยทั่วไป' | 'ปกปิด' | 'ลับ' | 'ลับมาก';

export interface ArchivalDocument {
  doc_id?: string;
  document_id?: string;
  document_number: string;
  title?: string;
  document_name?: string;
  document_type?: string;
  category: ArchivalCategory;
  year: number; // พ.ศ. เช่น 2569
  department?: string;
  owner?: string;
  archived_by?: string;
  file_name?: string;
  file_type: string;
  file_size: string;
  upload_date?: string;
  archived_date?: string;
  document_date?: string;
  storage_location?: string;
  security_level?: SecurityLevel;
  status?: 'ปกติ' | 'จัดเก็บถาวร' | 'เอกสารลับ' | 'รอทำลาย' | string;
  tags: string[];
  description?: string;
}

export interface ActivityLog {
  id: string;
  time: string; // HH:mm or ISO
  date: string;
  actor: string;
  action: string;
  module: 'งบประมาณ' | 'ไปราชการ' | 'หนังสือรับ' | 'หนังสือส่ง' | 'เอกสาร' | 'หน่วยงาน' | 'ระบบ' | string;
  details: string;
  type: 'create' | 'update' | 'delete' | 'upload' | 'status' | string;
  timestamp?: string;
  user_name?: string;
  log_id?: string;
  ip_address?: string;
}

export type SystemLog = ActivityLog;

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  module: 'budget' | 'travel' | 'incoming' | 'outgoing' | 'document' | 'mission' | 'meeting' | 'ai-inspection' | 'personnel' | string;
  targetId?: string;
  time: string;
  isRead: boolean;
}

// ==========================================
// PART 1: AI DOCUMENT INSPECTION MODELS
// ==========================================
export type InspectionCheckStatus = 'found' | 'warning' | 'missing';

export interface InspectionChecklistItem {
  key?: string;
  label?: string;
  status?: InspectionCheckStatus; // 'found' | 'warning' | 'missing'
  details?: string;
  suggestion?: string;
  id?: string;
  orderNumber?: number;
  title?: string;
  description?: string;
  passed?: boolean;
  foundValue?: string;
  suggestedFix?: string;
}

export type ChecklistItem = InspectionChecklistItem;

export interface SpellingError {
  word?: string;
  suggestedWord?: string;
  original?: string;
  correction?: string;
  line?: number;
  explanation?: string;
  reason?: string;
}

export interface InspectionRecommendation {
  type?: 'urgent' | 'warning' | 'info' | string;
  category?: string;
  title?: string;
  description?: string;
  suggestion?: string;
  standardRef?: string;
}

export interface DocumentInspectionHistoryItem {
  id: string;
  action: 'อัปโหลด' | 'ตรวจสอบ' | 'แก้ไข' | 'ตรวจสอบซ้ำ' | 'จัดเก็บ' | string;
  timestamp: string;
  actor: string;
  notes?: string;
}

export interface DocumentInspection {
  id: string;
  fileName: string;
  fileType?: 'PDF' | 'DOCX' | 'XLSX' | 'JPG' | 'PNG' | string;
  fileSize: string;
  uploadedAt: string; // ISO date or formatted
  documentType: string; // e.g. "หนังสือภายนอก", "คำสั่ง", "บันทึกข้อความ"
  documentNumber?: string;
  documentDate?: string; // YYYY-MM-DD
  subject?: string;
  sender?: string;
  recipient?: string;
  reference?: string;
  attachmentInfo?: string;
  signer?: string;
  signerPosition?: string;
  pageCount?: number;
  score: number; // 0 - 100
  status: 'รอตรวจ' | 'ตรวจแล้ว' | 'พบข้อสังเกต' | 'สมบูรณ์' | 'ผ่านเกณฑ์' | 'ต้องแก้ไข' | string;
  issues?: string[];
  suggestions?: string[];
  aiSummary: {
    pointsFound?: string[];
    pointsToVerify?: string[];
    potentialMissing?: string[];
    recommendations?: string[];
    executiveBrief?: string;
  } | string;
  checklist?: InspectionChecklistItem[];
  checklistItems?: ChecklistItem[];
  spellingErrors?: SpellingError[];
  recommendations?: InspectionRecommendation[];
  extractedText?: string;
  checkedAt?: string;
  checkedBy?: string;
  version?: number;
  history?: DocumentInspectionHistoryItem[];
}

// ==========================================
// PART 2: MONTHLY MEETING MANAGEMENT MODELS
// ==========================================
export type MeetingResolutionStatus =
  | 'ยังไม่ดำเนินการ'
  | 'กำลังดำเนินการ'
  | 'เสร็จแล้ว'
  | 'เสร็จสิ้น'
  | 'ล่าช้า'
  | 'ยกเลิก';

export interface MeetingResolution {
  resolution_id: string;
  meeting_id: string;
  agenda_index?: number;
  agenda_order?: number;
  agenda_title?: string;
  title?: string;
  description?: string;
  resolution?: string;
  responsible_person_id?: string;
  responsible_person: string;
  responsible_unit?: string;
  department?: string;
  deadline: string; // YYYY-MM-DD
  status: MeetingResolutionStatus;
  progress?: number;
  notes?: string;
  completed_at?: string;
}

export interface MeetingAgenda {
  id?: string;
  agenda_number?: number;
  order?: number;
  title: string;
  description?: string;
  presenter?: string;
  details?: string;
  discussion?: string;
  conclusion?: string;
  resolution?: string;
}

export interface MeetingAttendee {
  person_id?: string;
  name: string;
  position?: string;
  unit?: string;
  attended?: boolean;
}

export interface Meeting {
  id: string;
  title: string;
  meeting_number: string; // e.g. "9/2569"
  month_label?: string;
  fiscal_year?: number;
  date?: string; // YYYY-MM-DD
  meeting_date?: string;
  start_time?: string; // HH:mm
  end_time?: string; // HH:mm
  meeting_time?: string;
  location: string;
  chairman_id?: string;
  chairman_name?: string;
  chairperson?: string;
  secretary_id?: string;
  secretary_name?: string;
  secretary?: string;
  total_attendees?: number;
  attendee_ids?: string[]; // references Personnel IDs
  absentee_ids?: string[]; // references Personnel IDs
  attendees?: MeetingAttendee[];
  notes?: string;
  report_status?: 'ร่าง' | 'รอตรวจ' | 'รับรองแล้ว' | 'จัดเก็บแล้ว';
  status?: 'นัดหมายแล้ว' | 'กำลังประชุม' | 'เสร็จสิ้น' | string;
  agendas: MeetingAgenda[];
  resolutions: MeetingResolution[];
  ai_summary?: {
    main_summary: string;
    key_points: string[];
    resolutions_summary: string[];
    action_items: {
      task: string;
      owner: string;
      due_date: string;
    }[];
    follow_up_points: string[];
    generated_at: string;
    is_mock: boolean;
  };
  aiSummary?: string;
  created_at?: string;
  updated_at?: string;
}

// ==========================================
// PART 3: PERSONNEL MISSION MANAGEMENT MODELS
// ==========================================
export type MissionStatus =
  | 'วางแผน'
  | 'รอดำเนินการ'
  | 'กำลังดำเนินการ'
  | 'เสร็จสิ้น'
  | 'ยกเลิก'
  | 'เลื่อนกำหนด';

export type MissionType =
  | 'ตรวจราชการ'
  | 'ประสานงานยุทธศาสตร์'
  | 'บรรเทาภัยพิบัติ/ช่วยเหลือประชาชน'
  | 'ประชุมวิชาการ/สัมมนา'
  | 'ตรวจสอบและประเมินผล'
  | 'สนับสนุนภารกิจพิเศษ'
  | 'ฝึกอบรมพัฒนาบุคลากร';

export interface Mission {
  id: string;
  missionCode: string; // e.g. "MS-2569-042"
  missionName: string;
  missionType?: MissionType | string;
  unitId: string; // references Unit unit_id
  unitName?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  location: string;
  province: string;
  district?: string;
  subdistrict?: string;
  objective: string;
  description?: string;
  vehicle?: VehicleType | string;
  transportation?: string;
  budget?: number;
  vehiclePlate?: string;
  commanderId: string; // references Personnel person_id
  personnelIds: string[]; // references Personnel person_id[]
  status: MissionStatus | string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const DEPARTMENT_COLORS = {
  admin: '#5B2A86',
  relations: '#2583D8',
  disaster: '#E89B22',
  volunteer: '#42A77A',
} as const;

export interface CentralActivityItem {
  id: string;
  time: string; // e.g. "10:30" or "09:45"
  date: string; // YYYY-MM-DD
  departmentId: DepartmentId;
  departmentName: string;
  color: string;
  category: string; // e.g. "งานสารบรรณ", "ข่าวประชาสัมพันธ์", "สาธารณภัย", "จิตอาสา"
  action: string;
  detail: string;
  status: 'ดำเนินการแล้ว' | 'กำลังดำเนินการ' | 'เร่งด่วน' | 'เฝ้าระวัง' | 'ประกาศแล้ว';
  route: string; // destination route e.g. "/admin", "/relations"
  actor?: string;
}

export interface CentralDashboardStats {
  totalTasks: number;
  inProgressTasks: number;
  totalNews: number;
  activeDisasters: number;
  watchZones: number;
  latestAnnouncements: number;
}

// ==========================================
// PERSONAL COMMAND CENTER ("ฉัน") TYPES
// ==========================================

export type PersonalDutyStatus =
  | 'ปฏิบัติราชการ'
  | 'ปฏิบัติภารกิจ'
  | 'ลาราชการ'
  | 'ฝึกอบรม'
  | 'ปฏิบัติราชการนอกสถานที่'
  | 'ไม่อยู่ในเวร/ภารกิจ';

export interface PoliceSalaryStepHistory {
  fiscalYearMonth: string; // e.g. "2569/04"
  salaryLevel: string; // e.g. "ป.1"
  step: number; // e.g. 12 or 11.5
  baseSalary: number; // e.g. 13310
  stepPromoted: number; // e.g. 0.5
  stepPromotionAmount: number; // e.g. 240
  accountType: string; // e.g. "ปกติ"
  notes?: string;
}

export interface PolicePositionHistory {
  date: string;
  position: string;
  positionNumber: string;
  unit: string;
}

export interface PoliceRankHistory {
  date: string;
  rank: string;
}

export interface PersonalAllowanceItem {
  id: string;
  missionName: string;
  type: 'เบี้ยเลี้ยงเดินทาง' | 'เบี้ยเลี้ยงปฏิบัติการสนาม' | 'ค่าตอบแทนพิเศษ' | 'ค่าที่พัก' | 'ค่ายานพาหนะ';
  dates: string;
  location: string;
  days: number;
  ratePerDay: number;
  totalAmount: number;
  status: 'รอเบิก' | 'ส่งเรื่องแล้ว' | 'กำลังตรวจสอบ' | 'อนุมัติ' | 'จ่ายแล้ว' | 'ตีกลับ';
  requestedDate: string;
  paidDate?: string;
  docReference?: string;
}

export interface PersonalExpenseItem {
  id: string;
  date: string;
  title: string;
  category: 'อาหาร' | 'เดินทาง' | 'ที่พัก' | 'ค่าน้ำมัน' | 'สาธารณูปโภค' | 'ภาระผ่อนชำระ' | 'อื่น ๆ';
  amount: number;
  notes?: string;
  receiptAttachment?: string;
  createdAt: string;
}

export interface GpfContributionRecord {
  monthYear: string; // e.g. "ส.ค. 2569"
  memberAmount: number; // ยอดสะสมของสมาชิก
  govAmount: number; // เงินสมทบ
  totalMonthly: number;
  submissionDate: string;
}

export interface PersonalDocumentItem {
  id: string;
  title: string;
  category: 'เอกสารเงินเดือน' | 'หนังสือรับรอง' | 'ประวัติ ก.พ.7' | 'คำสั่งแต่งตั้ง' | 'เอกสารฝึกอบรม' | 'เอกสารส่วนบุคคล';
  issueDate: string;
  fileSize: string;
  version: string;
  status: 'พร้อมใช้งาน' | 'รออนุมัติ' | 'เอกสารทางการ';
  previewUrl?: string;
  isOfficial?: boolean;
}

export interface TrainingCourseRecord {
  id: string;
  title: string;
  organizer: string;
  startDate: string;
  endDate: string;
  location: string;
  status: 'สำเร็จ' | 'อยู่ระหว่างอบรม' | 'เข้าร่วม';
  certificateNumber?: string;
}

export interface PersonalTimelineMilestone {
  year: string;
  date: string;
  title: string;
  category: 'ดำรงตำแหน่ง' | 'เลื่อนยศ' | 'เลื่อนขั้นเงินเดือน' | 'ภารกิจสำคัญ' | 'ฝึกอบรม' | 'เอกสารสำคัญ';
  description: string;
  reference?: string;
}

