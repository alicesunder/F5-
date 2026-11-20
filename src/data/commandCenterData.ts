import React from 'react';
import {
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building2,
  Users,
  Send,
  ArrowRight,
  TrendingUp,
  Target,
  BarChart2,
  DollarSign,
  Briefcase,
  AlertCircle
} from 'lucide-react';

export const FO5_COLORS = {
  admin: '#5B2A86',     // งานอำนวยการ
  relations: '#2583D8', // งานประชาสัมพันธ์
  disaster: '#E89B22',  // งานสาธารณภัย
  volunteer: '#42A77A', // งานจิตอาสา
  base: '#F7F7F9',
  surface: '#FFFFFF',
  softSurface: '#FBFAFD',
  text: '#25202B',
  secondary: '#6B6973',
  border: 'rgba(37,32,43,0.07)',
  brandPurple: '#5B2A86',
  lightPurple: '#EDE4F7',
};

export type DepartmentKey = 'admin' | 'relations' | 'disaster' | 'volunteer';

export interface DepartmentMeta {
  key: DepartmentKey;
  name: string;
  shortName: string;
  color: string;
  lightColor: string;
  borderColor: string;
  iconName: string;
  leadOfficer: string;
  missionCount: number;
  activeCount: number;
  pendingReports: number;
  progressPercent: number;
}

export const FO5_DEPARTMENTS_META: Record<DepartmentKey, DepartmentMeta> = {
  admin: {
    key: 'admin',
    name: 'งานอำนวยการ',
    shortName: 'ฝอ.๑-๕/ธุรการ',
    color: '#6D28D9',
    lightColor: '#F3EEFF',
    borderColor: 'rgba(91,42,134,0.2)',
    iconName: 'Settings',
    leadOfficer: '',
    missionCount: 0,
    activeCount: 0,
    pendingReports: 0,
    progressPercent: 0,
  },
  relations: {
    key: 'relations',
    name: 'งานประชาสัมพันธ์',
    shortName: 'ปชส./โฆษก ตชด.',
    color: '#2563EB',
    lightColor: '#EAF2FF',
    borderColor: 'rgba(37,131,216,0.2)',
    iconName: 'Megaphone',
    leadOfficer: '',
    missionCount: 0,
    activeCount: 0,
    pendingReports: 0,
    progressPercent: 0,
  },
  disaster: {
    key: 'disaster',
    name: 'งานพัฒนาช่วยเหลือประชาชน',
    shortName: 'ช่วยเหลือ ปชช./บรรเทาภัย ตชด.',
    color: '#EA580C',
    lightColor: '#FFF1E6',
    borderColor: 'rgba(232,155,34,0.25)',
    iconName: 'ShieldAlert',
    leadOfficer: '',
    missionCount: 0,
    activeCount: 0,
    pendingReports: 0,
    progressPercent: 0,
  },
  volunteer: {
    key: 'volunteer',
    name: 'งานจิตอาสา',
    shortName: 'จิตอาสา ๙๐๔/พระราชทาน',
    color: '#059669',
    lightColor: '#E8F8F1',
    borderColor: 'rgba(66,167,122,0.25)',
    iconName: 'HeartHandshake',
    leadOfficer: '',
    missionCount: 0,
    activeCount: 0,
    pendingReports: 0,
    progressPercent: 0,
  },
};

// Strategic Projects Structure
export interface StrategicProject {
  id: string;
  code: string;
  name: string;
  departmentKey: DepartmentKey;
  targetKpi: string;
  targetNumber: number;
  currentNumber: number;
  unit: string;
  achievementRate: number; // percentage
  allocatedBudget: number;
  spentBudget: number;
  status: 'ยังไม่เริ่ม' | 'กำลังดำเนินการ' | 'บรรลุเป้าหมาย' | 'เสร็จสิ้น' | 'มีความเสี่ยง';
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  deadlineDate: string;
  responsibleOfficer: string;
  riskReason?: string;
}

export const FO5_STRATEGIC_PROJECTS: StrategicProject[] = [];

// Unified Mission Model with cross-department collaboration
export interface UnifiedMission {
  id: string;
  missionCode: string;
  title: string;
  primaryDepartment: DepartmentKey;
  supportingDepartments: DepartmentKey[];
  date: string;
  time: string;
  location: string;
  province: string;
  responsibleOfficer: string;
  targetUnit: string;
  participantsCount: number;
  attire: string; // การแต่งกาย เช่น ชุดจิตอาสาพระราชทาน (เสื้อเหลือง/หมวก/ผ้าพันคอ), เครื่องแบบสนาม, เครื่องแบบ ค.
  status: 'สร้าง' | 'มอบหมาย' | 'รับทราบ' | 'ดำเนินการ' | 'ส่งผล' | 'ตรวจ' | 'ปิดภารกิจ';
  description: string;
  deadlineDate: string;
  hasReport: boolean;
  reportStatus?: 'ยังไม่ส่ง' | 'ส่งแล้ว' | 'รอตรวจ' | 'ผ่าน' | 'ขอแก้ไข';
  reportId?: string;
  revisionReason?: string;
  imagesCount: number;
  documentsCount: number;
}

export const INITIAL_UNIFIED_MISSIONS: UnifiedMission[] = [];

// Unified Operational Reports
export interface UnifiedReport {
  id: string;
  reportCode: string;
  missionId: string;
  missionTitle: string;
  departmentKey: DepartmentKey;
  submittingUnit: string;
  submittedBy: string;
  submittedDate: string;
  operationalResult: string;
  personnelCount: number;
  beneficiariesCount: number;
  locationDetails: string;
  problemsObstacles: string;
  solutionsDone: string;
  status: 'ยังไม่ส่ง' | 'ส่งแล้ว' | 'รอตรวจ' | 'ผ่าน' | 'ขอแก้ไข';
  reviewerName?: string;
  reviewedDate?: string;
  revisionReason?: string;
  images: string[];
  attachedDocs: { name: string; size: string }[];
}

export const INITIAL_UNIFIED_REPORTS: UnifiedReport[] = [];

// Official Communication Groups
export interface OfficialCommunicationGroup {
  id: string;
  name: string;
  departmentKey: DepartmentKey;
  coordinator: string;
  memberCount: number;
  activeMissionCount: number;
  pendingReportsCount: number;
  recentTopic: string;
  lastActive: string;
  units: string[];
}

export const OFFICIAL_COMMUNICATION_GROUPS: OfficialCommunicationGroup[] = [];

// Central Tasks for Unified Task Center
export interface CentralTaskItem {
  id: string;
  title: string;
  sourceModule: 'mission' | 'report' | 'document' | 'approval' | 'coordination' | 'kpi';
  departmentKey: DepartmentKey;
  urgency: 'ปกติ' | 'ภายใน 7 วัน' | 'เร่งด่วน' | 'เกินกำหนด';
  responsibleOfficer: string;
  targetUnit: string;
  deadlineDate: string;
  status: 'รอดำเนินการ' | 'กำลังดำเนินการ' | 'รอตรวจ' | 'เสร็จสิ้น';
  actionUrlModule: string;
}

export const INITIAL_CENTRAL_TASKS: CentralTaskItem[] = [];

// Audit Log Structure for FO5
export interface Fo5AuditLog {
  id: string;
  timestamp: string;
  actorRank: string;
  actorName: string;
  actionType: 'status_changed' | 'report_approved' | 'report_revised' | 'mission_assigned' | 'document_created' | 'kpi_updated';
  targetType: 'ภารกิจ' | 'รายงาน' | 'เอกสาร' | 'โครงการ' | 'หน่วย';
  targetCode: string;
  detail: string;
  previousValue?: string;
  newValue?: string;
  departmentKey: DepartmentKey;
}

export const INITIAL_FO5_AUDIT_LOGS: Fo5AuditLog[] = [];
