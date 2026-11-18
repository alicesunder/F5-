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
    color: '#5B2A86',
    lightColor: '#EDE4F7',
    borderColor: 'rgba(91,42,134,0.2)',
    iconName: 'Settings',
    leadOfficer: 'พ.ต.ท.หญิง นภาวรรณ จันทรักษ์',
    missionCount: 24,
    activeCount: 5,
    pendingReports: 2,
    progressPercent: 88,
  },
  relations: {
    key: 'relations',
    name: 'งานประชาสัมพันธ์',
    shortName: 'ปชส./โฆษก ตชด.',
    color: '#2583D8',
    lightColor: '#E6F1FC',
    borderColor: 'rgba(37,131,216,0.2)',
    iconName: 'Megaphone',
    leadOfficer: 'ร.ต.อ. ปริญญา เมฆากุล',
    missionCount: 18,
    activeCount: 4,
    pendingReports: 1,
    progressPercent: 92,
  },
  disaster: {
    key: 'disaster',
    name: 'งานพัฒนาช่วยเหลือประชาชน',
    shortName: 'ช่วยเหลือ ปชช./บรรเทาภัย ตชด.',
    color: '#E89B22',
    lightColor: '#FEF4E6',
    borderColor: 'rgba(232,155,34,0.25)',
    iconName: 'ShieldAlert',
    leadOfficer: 'พ.ต.ต. ณัฐวุฒิ สิทธิชัย',
    missionCount: 16,
    activeCount: 6,
    pendingReports: 3,
    progressPercent: 78,
  },
  volunteer: {
    key: 'volunteer',
    name: 'งานจิตอาสา',
    shortName: 'จิตอาสา ๙๐๔/พระราชทาน',
    color: '#42A77A',
    lightColor: '#EAF7F0',
    borderColor: 'rgba(66,167,122,0.25)',
    iconName: 'HeartHandshake',
    leadOfficer: 'พ.ต.ท. สุรศักดิ์ วงศ์สวรรค์',
    missionCount: 28,
    activeCount: 7,
    pendingReports: 2,
    progressPercent: 94,
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

export const FO5_STRATEGIC_PROJECTS: StrategicProject[] = [
  {
    id: 'PRJ-2569-01',
    code: 'ยศ.1-01',
    name: 'โครงการจิตอาสาพระราชทาน "เราทำความ ดี ด้วยหัวใจ" พัฒนาค่าย ตชด. และพื้นที่ชายแดน',
    departmentKey: 'volunteer',
    targetKpi: 'จำนวนประชาชนและกำลังพลเข้าร่วมกิจกรรม',
    targetNumber: 3600,
    currentNumber: 2798,
    unit: 'คน',
    achievementRate: 77.7,
    allocatedBudget: 450000,
    spentBudget: 348000,
    status: 'กำลังดำเนินการ',
    quarter: 'Q4',
    deadlineDate: '2026-09-25',
    responsibleOfficer: 'พ.ต.ท. สุรศักดิ์ วงศ์สวรรค์ (ฝอ.๕ จิตอาสา)',
  },
  {
    id: 'PRJ-2569-02',
    code: 'ยศ.2-03',
    name: 'โครงการเฝ้าระวังและเตรียมความพร้อมเผชิญเหตุน้ำท่วมฉับพลัน ดินโคลนถล่ม แนวชายแดน',
    departmentKey: 'disaster',
    targetKpi: 'ความพร้อมของชุดเผชิญเหตุและเครื่องมือสื่อสารฉุกเฉิน',
    targetNumber: 16,
    currentNumber: 12,
    unit: 'กองร้อย/ชุด',
    achievementRate: 75.0,
    allocatedBudget: 820000,
    spentBudget: 690000,
    status: 'มีความเสี่ยง',
    quarter: 'Q4',
    deadlineDate: '2026-09-18',
    responsibleOfficer: 'พ.ต.ต. ณัฐวุฒิ สิทธิชัย (ฝอ.๕ สาธารณภัย)',
    riskReason: 'การส่งรายงานตรวจสภาพเครื่องมือสื่อสารจาก กก.ตชด. 33 ยังไม่ครบถ้วน',
  },
  {
    id: 'PRJ-2569-03',
    code: 'ยศ.3-02',
    name: 'โครงการยกระดับการประชาสัมพันธ์เชิงรุกและสื่อสารภารกิจพิทักษ์แนวชายแดนสู่ประชาชน',
    departmentKey: 'relations',
    targetKpi: 'ยอดการเข้าถึงและผลิตสื่อสารสนเทศสร้างสรรค์เชิงบวก',
    targetNumber: 500000,
    currentNumber: 489200,
    unit: 'การเข้าถึง',
    achievementRate: 97.8,
    allocatedBudget: 320000,
    spentBudget: 305000,
    status: 'บรรลุเป้าหมาย',
    quarter: 'Q4',
    deadlineDate: '2026-09-30',
    responsibleOfficer: 'ร.ต.อ. ปริญญา เมฆากุล (ทีมโฆษก ตชด.)',
  },
  {
    id: 'PRJ-2569-04',
    code: 'ยศ.4-01',
    name: 'โครงการพัฒนาระบบสารบรรณอิเล็กทรอนิกส์และการตรวจร่างเอกสารราชการ AI สถ.',
    departmentKey: 'admin',
    targetKpi: 'ลดระยะเวลาหมุนเวียนหนังสือราชการและข้อผิดพลาดในระเบียบงานสารบรรณ',
    targetNumber: 100,
    currentNumber: 92,
    unit: '% ประสิทธิภาพ',
    achievementRate: 92.0,
    allocatedBudget: 280000,
    spentBudget: 245000,
    status: 'กำลังดำเนินการ',
    quarter: 'Q4',
    deadlineDate: '2026-09-28',
    responsibleOfficer: 'พ.ต.ท.หญิง นภาวรรณ จันทรักษ์ (ฝอ.๕ อำนวยการ)',
  },
];

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

export const INITIAL_UNIFIED_MISSIONS: UnifiedMission[] = [
  {
    id: 'MS-2569-001',
    missionCode: 'ฝอ.5-ภก.69-041',
    title: 'กิจกรรมจิตอาสาพัฒนาปรับปรุงภูมิทัศน์และมอบสิ่งของพระราชทาน โรงเรียน ตชด. เฉลิมพระเกียรติ',
    primaryDepartment: 'volunteer',
    supportingDepartments: ['relations', 'admin'],
    date: '2026-09-13',
    time: '08:30 - 16:30 น.',
    location: 'รร.ตชด.บ้านนายาว ต.ท่ากระดาน',
    province: 'ฉะเชิงเทรา',
    responsibleOfficer: 'พ.ต.ท. สุรศักดิ์ วงศ์สวรรค์',
    targetUnit: 'กก.ตชด.12',
    participantsCount: 145,
    attire: 'ชุดจิตอาสาพระราชทาน (เสื้อเหลือง/หมวกสีฟ้า/ผ้าพันคอพระราชทาน)',
    status: 'ดำเนินการ',
    description: 'พัฒนาปรับภูมิทัศน์ ซ่อมแซมอาคารเรียนเด็กประถม และจัดตั้งหน่วยแพทย์ปฐมพยาบาล',
    deadlineDate: '2026-09-14',
    hasReport: true,
    reportStatus: 'รอตรวจ',
    reportId: 'REP-69-014',
    imagesCount: 8,
    documentsCount: 2,
  },
  {
    id: 'MS-2569-002',
    missionCode: 'ฝอ.5-ภก.69-042',
    title: 'จัดตั้งศูนย์บัญชาการเหตุการณ์ช่วยเหลือน้ำป่าไหลหลากริมลำน้ำมูล และสนับสนุนเรือท้องแบน',
    primaryDepartment: 'disaster',
    supportingDepartments: ['relations', 'volunteer'],
    date: '2026-09-13',
    time: '06:00 - 20:00 น.',
    location: 'ศูนย์พักพิงชั่วคราว อ.วารินชำราบ',
    province: 'อุบลราชธานี',
    responsibleOfficer: 'พ.ต.ต. ณัฐวุฒิ สิทธิชัย',
    targetUnit: 'กก.ตชด.22',
    participantsCount: 42,
    attire: 'เครื่องแบบชุดปฏิบัติการทางน้ำ/ชุดช่วยเหลือผู้ประสบภัย',
    status: 'ดำเนินการ',
    description: 'สนับสนุนเรือท้องแบน ๔ ลำ พร้อมอาหารปรุงสุกพระราชทานและเวชภัณฑ์ฉุกเฉิน',
    deadlineDate: '2026-09-15',
    hasReport: false,
    reportStatus: 'ยังไม่ส่ง',
    imagesCount: 14,
    documentsCount: 3,
  },
  {
    id: 'MS-2569-003',
    missionCode: 'ฝอ.5-ภก.69-043',
    title: 'แถลงข่าวและจัดทำสื่ออินโฟกราฟิกผลการสกัดกั้นภัยคุกคามแนวชายแดนและกิจกรรมช่วยเหลือประชาชน',
    primaryDepartment: 'relations',
    supportingDepartments: ['admin'],
    date: '2026-09-14',
    time: '10:00 - 12:00 น.',
    location: 'ห้องประชุมชัยจินดา บช.ตชด.',
    province: 'กรุงเทพมหานคร',
    responsibleOfficer: 'ร.ต.อ. ปริญญา เมฆากุล',
    targetUnit: 'บก.อก.บช.ตชด. (ทีมโฆษก ตชด.)',
    participantsCount: 28,
    attire: 'เครื่องแบบปกติกากีคอพับแขนยาว',
    status: 'รับทราบ',
    description: 'ประสานสื่อมวลชนสายความมั่นคง เผยแพร่ภาพภารกิจ ตชด. สู่สาธารณชนผ่านสื่อดิจิทัล',
    deadlineDate: '2026-09-14',
    hasReport: false,
    reportStatus: 'ยังไม่ส่ง',
    imagesCount: 6,
    documentsCount: 4,
  },
  {
    id: 'MS-2569-004',
    missionCode: 'ฝอ.5-ภก.69-044',
    title: 'ตรวจการปฏิบัติและติดตามการใช้งบประมาณไตรมาส ๔ ประจำปีงบประมาณ ๒๕๖๙',
    primaryDepartment: 'admin',
    supportingDepartments: [],
    date: '2026-09-15',
    time: '09:00 - 16:30 น.',
    location: 'บก.ตชด.ภาค ๓ อ.แม่ริม',
    province: 'เชียงใหม่',
    responsibleOfficer: 'พ.ต.ท.หญิง นภาวรรณ จันทรักษ์',
    targetUnit: 'บก.ตชด.ภาค 3',
    participantsCount: 18,
    attire: 'เครื่องแบบสนามสีกากี',
    status: 'มอบหมาย',
    description: 'ตรวจสอบเอกสารการเบิกจ่ายโครงการตามแผนปฏิบัติราชการและระบบตรวจร่างเอกสารราชการ',
    deadlineDate: '2026-09-18',
    hasReport: false,
    reportStatus: 'ยังไม่ส่ง',
    imagesCount: 2,
    documentsCount: 5,
  },
  {
    id: 'MS-2569-005',
    missionCode: 'ฝอ.5-ภก.69-045',
    title: 'โครงการปลูกหญ้าแฝกเพื่ออนุรักษ์ดินและน้ำตามแนวพระราชดำริ ประจำปี ๒๕๖๙',
    primaryDepartment: 'volunteer',
    supportingDepartments: ['relations'],
    date: '2026-09-11',
    time: '09:00 - 15:00 น.',
    location: 'แปลงสาธิต กก.ตชด.42 อ.ทุ่งสง',
    province: 'นครศรีธรรมราช',
    responsibleOfficer: 'ร.ต.ท. ประสิทธิ์ ใจมั่น',
    targetUnit: 'กก.ตชด.42',
    participantsCount: 95,
    attire: 'ชุดจิตอาสาพระราชทานพร้อมหมวกและผ้าพันคอ',
    status: 'ตรวจ',
    description: 'ปลูกหญ้าแฝกรวม ๑๒,๐๐๐ ต้น ป้องกันการชะล้างพังทลายของหน้าดินลาดชัน',
    deadlineDate: '2026-09-12',
    hasReport: true,
    reportStatus: 'ผ่าน',
    reportId: 'REP-69-012',
    imagesCount: 12,
    documentsCount: 2,
  },
  {
    id: 'MS-2569-006',
    missionCode: 'ฝอ.5-ภก.69-046',
    title: 'ลาดตระเวนสำรวจจุดเสี่ยงดินโคลนถล่มและระบบแจ้งเตือนภัยล่วงหน้าแนวเทือกเขาถนนธงชัย',
    primaryDepartment: 'disaster',
    supportingDepartments: ['admin'],
    date: '2026-09-10',
    time: '08:00 - 17:00 น.',
    location: 'ช่องทางธรรมชาติ ต.แม่ต้าน อ.ท่าสองยาง',
    province: 'ตาก',
    responsibleOfficer: 'ร.ต.อ. เอกชัย มณีเนตร',
    targetUnit: 'กก.ตชด.34',
    participantsCount: 14,
    attire: 'เครื่องแบบสนาม ตชด. พร้อมวิทยุสื่อสาร VHF/FM',
    status: 'ส่งผล',
    description: 'ตรวจวัดปริมาณน้ำฝนสะสมและทดสอบระบบเตือนภัยชุมชนชายแดน',
    deadlineDate: '2026-09-11',
    hasReport: true,
    reportStatus: 'ขอแก้ไข',
    reportId: 'REP-69-013',
    revisionReason: 'ขาดภาพถ่ายเชิงประจักษ์จุดติดตั้งระบบแจ้งเตือนระดับน้ำและพิกัด GPS ที่ชัดเจน',
    imagesCount: 4,
    documentsCount: 1,
  },
];

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

export const INITIAL_UNIFIED_REPORTS: UnifiedReport[] = [
  {
    id: 'REP-69-014',
    reportCode: 'รายงาน จอ.๐๑-69/041',
    missionId: 'MS-2569-001',
    missionTitle: 'กิจกรรมจิตอาสาพัฒนาปรับปรุงภูมิทัศน์และมอบสิ่งของพระราชทาน โรงเรียน ตชด. เฉลิมพระเกียรติ',
    departmentKey: 'volunteer',
    submittingUnit: 'กก.ตชด.12',
    submittedBy: 'พ.ต.ท. วีระศักดิ์ ศรีจันทร์ (รอง ผกก.ตชด.12)',
    submittedDate: '2026-09-13 11:20 น.',
    operationalResult: 'ดำเนินการปรับปรุงภูมิทัศน์ ทาสีรั้วโรงเรียน และมอบชุดอุปกรณ์การเรียนพระราชทานแก่นักเรียนจำนวน 145 ชุด ปฏิบัติการเป็นไปด้วยความเรียบร้อย',
    personnelCount: 35,
    beneficiariesCount: 145,
    locationDetails: 'รร.ตชด.บ้านนายาว ต.ท่ากระดาน อ.สนามชัยเขต จ.ฉะเชิงเทรา พิกัด 13.5932, 101.5284',
    problemsObstacles: 'ช่วงบ่ายมีฝนตกประปราย ทำให้การทาสีผนังภายนอกบางส่วนต้องเลื่อนเวลาแห้ง',
    solutionsDone: 'ย้ายกำลังพลไปปรับปรุงห้องสมุดภายในอาคารเรียนก่อนตามแผนสำรอง',
    status: 'รอตรวจ',
    images: [
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'
    ],
    attachedDocs: [
      { name: 'บัญชีรายชื่อผู้เข้าร่วม_จอ01_ฉะเชิงเทรา.pdf', size: '1.4 MB' },
      { name: 'หนังสือส่งมอบอุปกรณ์พระราชทาน.pdf', size: '890 KB' }
    ]
  },
  {
    id: 'REP-69-012',
    reportCode: 'รายงาน จอ.๐๒-69/038',
    missionId: 'MS-2569-005',
    missionTitle: 'โครงการปลูกหญ้าแฝกเพื่ออนุรักษ์ดินและน้ำตามแนวพระราชดำริ ประจำปี ๒๕๖๙',
    departmentKey: 'volunteer',
    submittingUnit: 'กก.ตชด.42',
    submittedBy: 'ร.ต.อ. ธนกฤต ทรัพย์สิน (สว.ฝอ.กก.ตชด.42)',
    submittedDate: '2026-09-11 16:45 น.',
    operationalResult: 'ปลูกหญ้าแฝกตามแนวระดับรวม ๑๒,๐๐๐ ต้น ครอบคลุมพื้นที่ลาดเอียง ๒๕ ไร่ ร่วมกับประชาชนและเยาวชนในพื้นที่',
    personnelCount: 28,
    beneficiariesCount: 240,
    locationDetails: 'แปลงสาธิต กก.ตชด.42 ต.ที่วัง อ.ทุ่งสง จ.นครศรีธรรมราช',
    problemsObstacles: 'ไม่มีปัญหาอุปสรรค ดินมีความชื้นเหมาะสมต่อการลงกล้าแฝก',
    solutionsDone: 'จัดเวรชุดรดน้ำและติดตามการเจริญเติบโตสัปดาห์ละ ๒ ครั้ง',
    status: 'ผ่าน',
    reviewerName: 'พ.ต.ท. สุรศักดิ์ วงศ์สวรรค์ (ฝอ.๕)',
    reviewedDate: '2026-09-12 09:15 น.',
    images: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80'
    ],
    attachedDocs: [
      { name: 'สรุปผลโครงการหญ้าแฝก_กก42.pdf', size: '2.1 MB' }
    ]
  },
  {
    id: 'REP-69-013',
    reportCode: 'รายงาน สภ.๐๑-69/022',
    missionId: 'MS-2569-006',
    missionTitle: 'ลาดตระเวนสำรวจจุดเสี่ยงดินโคลนถล่มและระบบแจ้งเตือนภัยล่วงหน้าแนวเทือกเขาถนนธงชัย',
    departmentKey: 'disaster',
    submittingUnit: 'กก.ตชด.34',
    submittedBy: 'ร.ต.อ. เอกชัย มณีเนตร',
    submittedDate: '2026-09-11 18:00 น.',
    operationalResult: 'สำรวจจุดเสี่ยงดินสไลด์จำนวน ๔ จุด พบรอยแยกระดับ ๒ ซม. บนไหล่ทางหลวงชนบท',
    personnelCount: 14,
    beneficiariesCount: 180,
    locationDetails: 'ช่องทางธรรมชาติ ต.แม่ต้าน อ.ท่าสองยาง จ.ตาก',
    problemsObstacles: 'ระบบแจ้งเตือนสัญญาณโทรศัพท์เคลื่อนที่บางช่วงขาดหาย พิกัดดาวเทียมคลาดเคลื่อน',
    solutionsDone: 'ใช้วิทยุสื่อสารข่าย ตชด. และประสานหมวดทางหลวงท่าสองยางเข้าตรวจสอบแนวรอยแยก',
    status: 'ขอแก้ไข',
    reviewerName: 'พ.ต.ต. ณัฐวุฒิ สิทธิชัย (ฝอ.๕ สาธารณภัย)',
    reviewedDate: '2026-09-12 14:30 น.',
    revisionReason: 'ขาดภาพถ่ายเชิงประจักษ์จุดติดตั้งระบบแจ้งเตือนระดับน้ำและพิกัด GPS ที่ชัดเจน ขอให้แนบภาพเพิ่มเติม ๓ มุมมอง',
    images: [
      'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&auto=format&fit=crop&q=80'
    ],
    attachedDocs: [
      { name: 'บันทึกตรวจจุดเสี่ยง_กก34.pdf', size: '920 KB' }
    ]
  }
];

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

export const OFFICIAL_COMMUNICATION_GROUPS: OfficialCommunicationGroup[] = [
  {
    id: 'GRP-01',
    name: 'กลุ่มขับเคลื่อนงาน ฝอ.๕ บช.ตชด.',
    departmentKey: 'admin',
    coordinator: 'พ.ต.ท.หญิง นภาวรรณ จันทรักษ์',
    memberCount: 48,
    activeMissionCount: 4,
    pendingReportsCount: 2,
    recentTopic: 'การเร่งรัดปิดงวดงบประมาณประจำปี ๒๕๖๙ และสรุปการประเมิน กพร.',
    lastActive: '10 นาทีที่แล้ว',
    units: ['บช.ตชด.', 'บก.อก.บช.ตชด.', 'บก.ตชด.ภาค 1-4'],
  },
  {
    id: 'GRP-02',
    name: 'กลุ่มรายงาน อพ.สธ. (โครงการอนุรักษ์พันธุกรรมพืชฯ)',
    departmentKey: 'volunteer',
    coordinator: 'พ.ต.ท. สุรศักดิ์ วงศ์สวรรค์',
    memberCount: 32,
    activeMissionCount: 3,
    pendingReportsCount: 1,
    recentTopic: 'รวบรวมตัวอย่างพันธุ์ไม้ท้องถิ่นและรายงานความก้าวหน้าแปลงวิจัย กก.ตชด.13',
    lastActive: '35 นาทีที่แล้ว',
    units: ['กก.ตชด.13', 'กก.ตชด.23', 'กก.ตชด.33', 'กก.ตชด.43'],
  },
  {
    id: 'GRP-03',
    name: 'กลุ่มรายงานเศรษฐกิจพอเพียง ตชด.',
    departmentKey: 'volunteer',
    coordinator: 'ร.ต.อ. ธนกฤต ทรัพย์สิน',
    memberCount: 44,
    activeMissionCount: 5,
    pendingReportsCount: 2,
    recentTopic: 'ส่งแผนการผลิตเมล็ดพันธุ์พระราชทานและแปลงสาธิตประจำเดือนกันยายน',
    lastActive: '1 ชั่วโมงที่แล้ว',
    units: ['รร.ตชด. ทุกภาค', 'กก.ตชด. 11-44'],
  },
  {
    id: 'GRP-04',
    name: 'กลุ่ม ตชด.บรรเทาภัย (ศูนย์เตือนภัยสาธารณภัย)',
    departmentKey: 'disaster',
    coordinator: 'พ.ต.ต. ณัฐวุฒิ สิทธิชัย',
    memberCount: 65,
    activeMissionCount: 6,
    pendingReportsCount: 3,
    recentTopic: 'เฝ้าระวังระดับน้ำแม่น้ำโขง-แม่น้ำมูล และเตรียมเรือท้องแบนช่วยเหลือ 24 ชม.',
    lastActive: '5 นาทีที่แล้ว',
    units: ['กก.ตชด.21-24', 'กก.ตชด.31-34', 'บก.ตชด.ภาค 2'],
  },
  {
    id: 'GRP-05',
    name: 'กลุ่มรายงานหญ้าแฝกเฉลิมพระเกียรติ',
    departmentKey: 'volunteer',
    coordinator: 'ร.ต.ท. ประสิทธิ์ ใจมั่น',
    memberCount: 28,
    activeMissionCount: 2,
    pendingReportsCount: 0,
    recentTopic: 'รายงานผลการปลูกแฝกอนุรักษ์ดินและน้ำพื้นที่ลาดชันภาคใต้เสร็จสมบูรณ์',
    lastActive: '3 ชั่วโมงที่แล้ว',
    units: ['กก.ตชด.41-44'],
  },
  {
    id: 'GRP-06',
    name: 'กลุ่มโครงการสร้างจิตสำนึกต่อสถาบันพระมหากษัตริย์',
    departmentKey: 'volunteer',
    coordinator: 'พ.ต.ท. สุรศักดิ์ วงศ์สวรรค์',
    memberCount: 52,
    activeMissionCount: 4,
    pendingReportsCount: 1,
    recentTopic: 'ตารางการจัดอบรมเยาวชนและนักเรียนในพื้นที่ชายแดนไตรมาส ๔',
    lastActive: '2 ชั่วโมงที่แล้ว',
    units: ['บก.ตชด.ภาค 1-4'],
  },
  {
    id: 'GRP-07',
    name: 'กลุ่มประสานงานครูแดร์ (D.A.R.E. ตชด.)',
    departmentKey: 'relations',
    coordinator: 'ร.ต.อ. ปริญญา เมฆากุล',
    memberCount: 76,
    activeMissionCount: 5,
    pendingReportsCount: 1,
    recentTopic: 'สรุปสถิตินักเรียนผ่านการอบรมหลักสูตรต้านภัยยาเสพติดประจำภาคเรียนที่ ๑',
    lastActive: '45 นาทีที่แล้ว',
    units: ['กก.ตชด. ทุกกองกำกับการ'],
  },
  {
    id: 'GRP-08',
    name: 'กลุ่มทีมโฆษกและประชาสัมพันธ์ ตชด.',
    departmentKey: 'relations',
    coordinator: 'พ.ต.อ.หญิง สุภาพร รัตนวิชัย',
    memberCount: 38,
    activeMissionCount: 4,
    pendingReportsCount: 1,
    recentTopic: 'การจัดทำคลิปสั้นภารกิจ ตชด. ช่วยเหลือประชาชนเพื่อลง TikTok และ Facebook',
    lastActive: '15 นาทีที่แล้ว',
    units: ['บก.อก.บช.ตชด.', 'บก.ตชด.ภาค 1-4'],
  },
  {
    id: 'GRP-09',
    name: 'กลุ่มงานจิตอาสาและรายงานจิตอาสา (จอ.๐๑/๐๒)',
    departmentKey: 'volunteer',
    coordinator: 'พ.ต.ท. สุรศักดิ์ วงศ์สวรรค์',
    memberCount: 64,
    activeMissionCount: 7,
    pendingReportsCount: 2,
    recentTopic: 'ติดตามการส่งแบบรายงาน จอ.๐๑ กิจกรรมจิตอาสาพัฒนา รร.ตชด. ทั่วประเทศ',
    lastActive: '8 นาทีที่แล้ว',
    units: ['กก.ตชด. 11-44'],
  }
];

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

export const INITIAL_CENTRAL_TASKS: CentralTaskItem[] = [
  {
    id: 'TSK-01',
    title: 'ตรวจสอบและลงนามรับรองรายงาน จอ.๐๑ กิจกรรม รร.ตชด.บ้านนายาว',
    sourceModule: 'report',
    departmentKey: 'volunteer',
    urgency: 'เร่งด่วน',
    responsibleOfficer: 'พ.ต.ท. สุรศักดิ์ วงศ์สวรรค์',
    targetUnit: 'กก.ตชด.12',
    deadlineDate: '2026-09-14',
    status: 'รอตรวจ',
    actionUrlModule: 'volunteer',
  },
  {
    id: 'TSK-02',
    title: 'ติดตามรายงานตรวจสภาพเครื่องมือสื่อสารฉุกเฉิน กก.ตชด.33 ที่ค้างส่ง',
    sourceModule: 'coordination',
    departmentKey: 'disaster',
    urgency: 'เกินกำหนด',
    responsibleOfficer: 'พ.ต.ต. ณัฐวุฒิ สิทธิชัย',
    targetUnit: 'กก.ตชด.33',
    deadlineDate: '2026-09-12',
    status: 'กำลังดำเนินการ',
    actionUrlModule: 'disaster',
  },
  {
    id: 'TSK-03',
    title: 'ตรวจร่างหนังสือราชการขออนุมัติโครงการพัฒนาบุคลากรด้าน AI สถ.',
    sourceModule: 'document',
    departmentKey: 'admin',
    urgency: 'ภายใน 7 วัน',
    responsibleOfficer: 'พ.ต.ท.หญิง นภาวรรณ จันทรักษ์',
    targetUnit: 'บก.อก.บช.ตชด.',
    deadlineDate: '2026-09-18',
    status: 'รอดำเนินการ',
    actionUrlModule: 'documents',
  },
  {
    id: 'TSK-04',
    title: 'อนุมัติสื่อประชาสัมพันธ์ภารกิจช่วยเหลือน้ำป่าไหลหลากลุ่มน้ำมูล',
    sourceModule: 'approval',
    departmentKey: 'relations',
    urgency: 'เร่งด่วน',
    responsibleOfficer: 'ร.ต.อ. ปริญญา เมฆากุล',
    targetUnit: 'ทีมโฆษก ตชด.',
    deadlineDate: '2026-09-14',
    status: 'รอดำเนินการ',
    actionUrlModule: 'relations',
  },
  {
    id: 'TSK-05',
    title: 'จัดทำสรุปผลการดำเนินงานโครงการอนุรักษ์ดินและน้ำหญ้าแฝก ๔ ภาค',
    sourceModule: 'kpi',
    departmentKey: 'volunteer',
    urgency: 'ภายใน 7 วัน',
    responsibleOfficer: 'ร.ต.ท. ประสิทธิ์ ใจมั่น',
    targetUnit: 'กก.ตชด. 41-44',
    deadlineDate: '2026-09-20',
    status: 'กำลังดำเนินการ',
    actionUrlModule: 'volunteer',
  },
  {
    id: 'TSK-06',
    title: 'ประสานกำลังพลสนับสนุนภารกิจส่งกำลังบำรุงทางอากาศร่วม ตชด.ภาค ๓',
    sourceModule: 'mission',
    departmentKey: 'admin',
    urgency: 'ปกติ',
    responsibleOfficer: 'พ.ต.ท.หญิง นภาวรรณ จันทรักษ์',
    targetUnit: 'บก.ตชด.ภาค 3',
    deadlineDate: '2026-09-25',
    status: 'รอดำเนินการ',
    actionUrlModule: 'admin',
  }
];

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

export const INITIAL_FO5_AUDIT_LOGS: Fo5AuditLog[] = [
  {
    id: 'LOG-69-091',
    timestamp: '2026-09-13 11:25 น.',
    actorRank: 'พ.ต.ท.',
    actorName: 'วีระศักดิ์ ศรีจันทร์',
    actionType: 'report_approved',
    targetType: 'รายงาน',
    targetCode: 'REP-69-014',
    detail: 'ส่งรายงานผลการปฏิบัติงาน จอ.๐๑ เข้าสู่ระบบเพื่อรอการตรวจรับรอง',
    previousValue: 'ยังไม่ส่ง',
    newValue: 'รอตรวจ',
    departmentKey: 'volunteer',
  },
  {
    id: 'LOG-69-090',
    timestamp: '2026-09-12 14:30 น.',
    actorRank: 'พ.ต.ต.',
    actorName: 'ณัฐวุฒิ สิทธิชัย',
    actionType: 'report_revised',
    targetType: 'รายงาน',
    targetCode: 'REP-69-013',
    detail: 'ส่งคืนรายงาน สภ.๐๑ ให้ กก.ตชด.34 แนบภาพถ่ายเชิงประจักษ์เพิ่มเติม',
    previousValue: 'รอตรวจ',
    newValue: 'ขอแก้ไข',
    departmentKey: 'disaster',
  },
  {
    id: 'LOG-69-089',
    timestamp: '2026-09-12 09:15 น.',
    actorRank: 'พ.ต.ท.',
    actorName: 'สุรศักดิ์ วงศ์สวรรค์',
    actionType: 'report_approved',
    targetType: 'รายงาน',
    targetCode: 'REP-69-012',
    detail: 'ตรวจรับรองรายงานผลโครงการปลูกหญ้าแฝก กก.ตชด.42 ผ่านเกณฑ์มาตรฐาน',
    previousValue: 'รอตรวจ',
    newValue: 'ผ่าน',
    departmentKey: 'volunteer',
  },
  {
    id: 'LOG-69-088',
    timestamp: '2026-09-11 16:00 น.',
    actorRank: 'พ.ต.ท.หญิง',
    actorName: 'นภาวรรณ จันทรักษ์',
    actionType: 'mission_assigned',
    targetType: 'ภารกิจ',
    targetCode: 'MS-2569-004',
    detail: 'มอบหมายภารกิจตรวจราชการติดตามการใช้งบประมาณไตรมาส ๔ ให้ บก.ตชด.ภาค ๓',
    previousValue: 'สร้าง',
    newValue: 'มอบหมาย',
    departmentKey: 'admin',
  },
];
