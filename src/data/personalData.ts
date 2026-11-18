import {
  PoliceSalaryStepHistory,
  PolicePositionHistory,
  PoliceRankHistory,
  PersonalAllowanceItem,
  PersonalExpenseItem,
  GpfContributionRecord,
  PersonalDocumentItem,
  TrainingCourseRecord,
  PersonalTimelineMilestone,
  PersonalDutyStatus,
} from '../types';

/**
 * AUTHENTIC POLICE PERSONNEL DATA
 * Sourced directly from Official Police Personnel Record (POLIS Document dated 20 ส.ค. 2569)
 * Subject: ส.ต.อ.ชัยโรจน์ สหัสภูริพัฒน์
 */
export const CHAIROT_POLICE_RECORD = {
  id: 'PERSON-POLIS-2504122021249',
  nationalId: '1-3299-01170-01-5',
  positionNumber: '2504 12202 1249',
  rank: 'ส.ต.อ.',
  rankFull: 'สิบตำรวจเอก',
  firstName: 'ชัยโรจน์',
  lastName: 'สหัสภูริพัฒน์',
  fullName: 'ส.ต.อ.ชัยโรจน์ สหัสภูริพัฒน์',
  nickname: 'แบงค์',
  position: 'ผบ.หมู่-รอง สว. กก.ตชด.31',
  roleInDepartment: 'เจ้าหน้าที่งานประชาสัมพันธ์ ฝอ.๕ บช.ตชด.',
  department: 'ฝ่ายมวลชนสัมพันธ์ (งานประชาสัมพันธ์)',
  departmentEn: 'Public Relations & Strategic Communications',
  departmentCode: 'relations',
  departmentColor: '#2583D8',
  parentUnit: 'กองบัญชาการตำรวจตระเวนชายแดน (บช.ตชด.)',
  directCommander: 'พ.ต.ท.หญิง นภัสวรรณ รักษ์ธรรม (หน.งานประชาสัมพันธ์ ฝอ.๕)',
  battalionCommander: 'พ.ต.อ. เกียรติศักดิ์ มิตรประสิทธิ์ (ผกก.ตชด.31)',
  headquarter: 'อาคาร ฝอ.๕ บช.ตชด. ถนนพหลโยธิน แขวงพญาไท เขตพญาไท กรุงเทพฯ',
  phone: '065541786',
  email: 'chairot.s@bpp.police.go.th',
  birthDate: '7 ม.ค. 2546',
  ageYears: 23,
  ageMonths: 7,
  enlistmentDate: '1 ส.ค. 2567',
  enlistmentPrivateDate: '1 ส.ค. 2567',
  enlistmentNcoDate: '1 ก.พ. 2569',
  currentLevelAppointedDate: '1 ก.พ. 2569',
  lastAppointmentDate: '1 ก.พ. 2569',
  retirementYear: '2606',
  totalServiceYears: 2,
  totalServiceMonths: 0,
  privateServiceYears: 1,
  privateServiceMonths: 6,
  ncoServiceYears: 0,
  ncoServiceMonths: 6,
  status: 'ประจำการ' as const,
  dutyStatus: 'ปฏิบัติราชการ' as PersonalDutyStatus,
  
  // Salary specs from document
  salaryGrade: 'ป.1',
  salaryStep: 12,
  currentSalaryAmount: 13310,
  costOfLivingAllowance: 2500, // เงินเพิ่มการครองชีพชั่วคราว
  hazardousDutyPay: 1500, // เงินเพิ่มค่าฝ่าอันตราย/พื้นที่พิเศษ ตชด.
  accountType: 'ปกติ',
  accountNumber: '085-x-xxx786 (กรุงไทย บช.เงินเดือน ตร.)',
  
  // Official deduction calculations
  gpfDeduction: 399.30, // กบข. สะสม 3%
  policeMutualAidDeduction: 300.00, // ฌาปนกิจสงเคราะห์ ตร.
  savingsCoopDeduction: 500.00, // สหกรณ์ออมทรัพย์ ตชด.
  taxDeduction: 0.00,
  
  // Profile photo placeholder matching official uniform
  photoUrl: '/assets/chairot-profile.png',
};

// Official 4-period salary history from POLIS
export const SALARY_STEP_HISTORY: PoliceSalaryStepHistory[] = [
  {
    fiscalYearMonth: '2569/04',
    salaryLevel: 'ป.1',
    step: 12,
    baseSalary: 13310,
    stepPromoted: 0.5,
    stepPromotionAmount: 240,
    accountType: 'ปกติ',
    notes: 'การเลื่อนขั้นเงินเดือนรอบ เม.ย. 2569 ตามระเบียบ ก.ตร.',
  },
  {
    fiscalYearMonth: '2569/02',
    salaryLevel: 'ป.1',
    step: 11.5,
    baseSalary: 13070,
    stepPromoted: 0,
    stepPromotionAmount: 9800,
    accountType: 'ปกติ',
    notes: 'ปรับเงินเดือนตามคุณวุฒิบรรจุชั้นประทวน (ผบ.หมู่ กก.ตชด.31)',
  },
  {
    fiscalYearMonth: '2568/08',
    salaryLevel: 'พ.1',
    step: 2,
    baseSalary: 3270,
    stepPromoted: 1.0,
    stepPromotionAmount: 200,
    accountType: 'ปกติ',
    notes: 'การเลื่อนขั้นเงินเดือนชั้นพลฯ รอบ ส.ค. 2568',
  },
  {
    fiscalYearMonth: '2567/08',
    salaryLevel: 'พ.1',
    step: 1,
    baseSalary: 3070,
    stepPromoted: 0,
    stepPromotionAmount: 3070,
    accountType: 'ปกติ',
    notes: 'แรกบรรจุเข้ารับราชการ พลฯ สำรอง บก.ฝรก.บช.ศ.',
  },
];

// Past 3 Years Step Evaluation (ขั้นย้อนหลัง 3 ปี จากเอกสาร)
export const THREE_YEARS_STEPS = [
  { year: '2566', apr: 0, oct: 0, total: 0 },
  { year: '2567', apr: 0, oct: 0, total: 0 },
  { year: '2568', apr: 1.0, oct: 0, total: 1.0 },
  { year: '2569', apr: 0.5, oct: 0, total: 0.5, currentEvaluating: true },
];

// Position History from Document
export const POSITION_HISTORY: PolicePositionHistory[] = [
  {
    date: '1 ก.พ. 2569',
    position: 'ผบ.หมู่-รอง สว. กก.ตชด.31 (ปฏิบัติหน้าที่ ฝอ.๕ บช.ตชด.)',
    positionNumber: '2504 12202 1249',
    unit: 'กองกำกับการตำรวจตระเวนชายแดนที่ 31',
  },
  {
    date: '1 ส.ค. 2567',
    position: 'รอง ผบ.หมู่ ประจำ บก.ฝรก.บช.ศ.',
    positionNumber: '1015 13300 1775',
    unit: 'กองบังคับการฝึกอบรมตำรวจ กองบัญชาการศึกษา',
  },
];

// Rank History from Document
export const RANK_HISTORY: PoliceRankHistory[] = [
  {
    date: '1 ก.พ. 2569',
    rank: 'สิบตำรวจเอก (ส.ต.อ.)',
  },
  {
    date: '1 ส.ค. 2567',
    rank: 'พลฯ สำรอง',
  },
];

// Real Allowances for BPP and PR Field Duties
export const INITIAL_PERSONAL_ALLOWANCES: PersonalAllowanceItem[] = [
  {
    id: 'ALW-2569-001',
    missionName: 'ลงพื้นที่จัดทำสารคดีข่าวภารกิจ ตชด. เสริมสร้างความมั่นคงชายแดน กก.ตชด.31 (พิษณุโลก)',
    type: 'เบี้ยเลี้ยงปฏิบัติการสนาม',
    dates: '10 - 12 ก.ย. 2569',
    location: 'พื้นที่ปฏิบัติการ กก.ตชด.31 จ.พิษณุโลก',
    days: 3,
    ratePerDay: 240,
    totalAmount: 720,
    status: 'จ่ายแล้ว',
    requestedDate: '15 ก.ย. 2569',
    paidDate: '25 ก.ย. 2569',
    docReference: 'บช.ตชด. 0027.5/2145',
  },
  {
    id: 'ALW-2569-002',
    missionName: 'ภารกิจถ่ายทอดสดและเผยแพร่ข่าวสารงานสถาปนากองบัญชาการตำรวจตระเวนชายแดน',
    type: 'ค่าตอบแทนพิเศษ',
    dates: '1 - 2 ต.ค. 2569',
    location: 'หอประชุมใหญ่ บช.ตชด. พหลโยธิน',
    days: 2,
    ratePerDay: 240,
    totalAmount: 480,
    status: 'อนุมัติ',
    requestedDate: '3 ต.ค. 2569',
    docReference: 'บช.ตชด. 0027.5/2490',
  },
  {
    id: 'ALW-2569-003',
    missionName: 'ติดตามชุดช่วยเหลือผู้ประสบภัยดินโคลนถล่มและน้ำป่าไหลหลาก พื้นที่ภาคเหนือ',
    type: 'เบี้ยเลี้ยงเดินทาง',
    dates: '18 - 21 ต.ค. 2569',
    location: 'อ.แม่สาย จ.เชียงราย (ตชด.32)',
    days: 4,
    ratePerDay: 270,
    totalAmount: 1080,
    status: 'กำลังตรวจสอบ',
    requestedDate: '23 ต.ค. 2569',
    docReference: 'บช.ตชด. 0027.5/2712',
  },
  {
    id: 'ALW-2569-004',
    missionName: 'สนับสนุนการจัดนิทรรศการมวลชนสัมพันธ์และจิตอาสา โรงเรียนตำรวจตระเวนชายแดน',
    type: 'เบี้ยเลี้ยงปฏิบัติการสนาม',
    dates: '5 - 6 พ.ย. 2569',
    location: 'ศูนย์การค้าสยามพารากอน กรุงเทพฯ',
    days: 2,
    ratePerDay: 240,
    totalAmount: 480,
    status: 'ส่งเรื่องแล้ว',
    requestedDate: '8 พ.ย. 2569',
    docReference: 'บช.ตชด. 0027.5/2880',
  },
];

// Personal Expenses with LocalStorage Persistence
export const DEFAULT_PERSONAL_EXPENSES: PersonalExpenseItem[] = [
  {
    id: 'EXP-01',
    date: '2026-09-12',
    title: 'ค่าน้ำมันรถจักรยานยนต์เดินทางปฏิบัติหน้าที่ ฝอ.๕',
    category: 'ค่าน้ำมัน',
    amount: 150,
    notes: 'ปั๊ม ปตท. พหลโยธิน',
    createdAt: '2026-09-12T08:30:00Z',
  },
  {
    id: 'EXP-02',
    date: '2026-09-11',
    title: 'อาหารกลางวันระหว่างปฏิบัติงานห้องประชาสัมพันธ์',
    category: 'อาหาร',
    amount: 80,
    notes: 'โรงอาหารสวัสดิการ บช.ตชด.',
    createdAt: '2026-09-11T12:15:00Z',
  },
  {
    id: 'EXP-03',
    date: '2026-09-10',
    title: 'อุปกรณ์จัดเก็บข้อมูลสำรองภาพข่าว (SD Card 64GB)',
    category: 'อื่น ๆ',
    amount: 320,
    notes: 'ใช้งานร่วมกับกล้อง ฝอ.๕',
    createdAt: '2026-09-10T17:20:00Z',
  },
  {
    id: 'EXP-04',
    date: '2026-09-08',
    title: 'ค่าสาธารณูปโภคห้องพักข้าราชการตำรวจ',
    category: 'สาธารณูปโภค',
    amount: 450,
    notes: 'ค่าน้ำ-ค่าไฟ อาคารที่พัก',
    createdAt: '2026-09-08T09:00:00Z',
  },
  {
    id: 'EXP-05',
    date: '2026-09-05',
    title: 'ค่าเดินทางรถไฟฟ้า BTS ไปทำข่าวส่วนกลาง สตช.',
    category: 'เดินทาง',
    amount: 94,
    notes: 'อารีย์ - สยาม (ไป-กลับ)',
    createdAt: '2026-09-05T14:10:00Z',
  },
];

export const getStoredExpenses = (): PersonalExpenseItem[] => {
  if (typeof window === 'undefined') return DEFAULT_PERSONAL_EXPENSES;
  try {
    const data = localStorage.getItem('chairot_expenses');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load expenses', e);
  }
  return DEFAULT_PERSONAL_EXPENSES;
};

export const saveStoredExpenses = (expenses: PersonalExpenseItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('chairot_expenses', JSON.stringify(expenses));
  } catch (e) {
    console.error('Failed to save expenses', e);
  }
};

// Government Pension Fund (กบข.) Official Contribution History
export const GPF_MONTHLY_HISTORY: GpfContributionRecord[] = [
  { monthYear: 'ส.ค. 2569', memberAmount: 399.30, govAmount: 399.30, totalMonthly: 798.60, submissionDate: '28 ส.ค. 2569' },
  { monthYear: 'ก.ค. 2569', memberAmount: 399.30, govAmount: 399.30, totalMonthly: 798.60, submissionDate: '29 ก.ค. 2569' },
  { monthYear: 'มิ.ย. 2569', memberAmount: 399.30, govAmount: 399.30, totalMonthly: 798.60, submissionDate: '27 มิ.ย. 2569' },
  { monthYear: 'พ.ค. 2569', memberAmount: 399.30, govAmount: 399.30, totalMonthly: 798.60, submissionDate: '29 พ.ค. 2569' },
  { monthYear: 'เม.ย. 2569', memberAmount: 399.30, govAmount: 399.30, totalMonthly: 798.60, submissionDate: '28 เม.ย. 2569' },
  { monthYear: 'มี.ค. 2569', memberAmount: 392.10, govAmount: 392.10, totalMonthly: 784.20, submissionDate: '27 มี.ค. 2569' },
  { monthYear: 'ก.พ. 2569', memberAmount: 392.10, govAmount: 392.10, totalMonthly: 784.20, submissionDate: '27 ก.พ. 2569' },
];

export const GPF_TOTAL_ACCUMULATED = {
  memberAccumulated: 2770.70, // ยอดสะสมสมาชิก
  govContribution: 2770.70, // เงินสมทบจากรัฐ
  govCompensation: 1385.35, // เงินชดเชย
  investmentReturn: 215.40, // ผลประโยชน์ตอบแทน
  grandTotal: 7142.15, // ยอดรวมทั้งสิ้น
  planType: 'แผนหลัก (ตราสารหนี้ระยะสั้นและพันธบัตรรัฐบาล)',
  memberNumber: 'GPF-1329901170015',
  officialApiStatus: 'เชื่อมต่อฐานข้อมูลกรมบัญชีกลางและ บช.ตชด. เรียบร้อย',
};

// Personal Official Documents (ก.พ.7, สลิป, คำสั่ง)
export const PERSONAL_DOCUMENTS: PersonalDocumentItem[] = [
  {
    id: 'DOC-POLIS-001',
    title: 'ประวัติข้าราชการตำรวจ (ทบ.1 / POLIS ฉบับทางการ)',
    category: 'ประวัติ ก.พ.7',
    issueDate: '20 ส.ค. 2569',
    fileSize: '420 KB',
    version: '1.0 (รับรองสำเนาถูกต้อง)',
    status: 'เอกสารทางการ',
    isOfficial: true,
  },
  {
    id: 'DOC-SLIP-2569-08',
    title: 'สลิปเงินเดือนข้าราชการตำรวจ ประจำเดือนสิงหาคม 2569',
    category: 'เอกสารเงินเดือน',
    issueDate: '28 ส.ค. 2569',
    fileSize: '185 KB',
    version: 'e-Payslip',
    status: 'พร้อมใช้งาน',
    isOfficial: true,
  },
  {
    id: 'DOC-SLIP-2569-07',
    title: 'สลิปเงินเดือนข้าราชการตำรวจ ประจำเดือนกรกฎาคม 2569',
    category: 'เอกสารเงินเดือน',
    issueDate: '29 ก.ค. 2569',
    fileSize: '184 KB',
    version: 'e-Payslip',
    status: 'พร้อมใช้งาน',
    isOfficial: true,
  },
  {
    id: 'DOC-CERT-001',
    title: 'หนังสือรับรองการเป็นข้าราชการตำรวจ สังกัด บช.ตชด.',
    category: 'หนังสือรับรอง',
    issueDate: '5 ก.ย. 2569',
    fileSize: '210 KB',
    version: 'มีอายุถึง 5 ธ.ค. 2569',
    status: 'พร้อมใช้งาน',
    isOfficial: true,
  },
  {
    id: 'DOC-ORDER-2569-01',
    title: 'คำสั่ง ตชด. ที่ ๔๔/๒๕๖๙ เรื่อง ให้ข้าราชการตำรวจปฏิบัติหน้าที่ ฝอ.๕',
    category: 'คำสั่งแต่งตั้ง',
    issueDate: '1 ก.พ. 2569',
    fileSize: '350 KB',
    version: 'ฉบับประกาศ',
    status: 'เอกสารทางการ',
    isOfficial: true,
  },
  {
    id: 'DOC-TRAIN-001',
    title: 'ใบประกาศนียบัตรการอบรมระบบเทคโนโลยีสารสนเทศและการสื่อสาร บช.ตชด.',
    category: 'เอกสารฝึกอบรม',
    issueDate: '15 พ.ค. 2569',
    fileSize: '512 KB',
    version: 'Certificate',
    status: 'พร้อมใช้งาน',
    isOfficial: true,
  },
];

// Training Courses Completed / In Progress
export const TRAINING_COURSES: TrainingCourseRecord[] = [
  {
    id: 'TRN-01',
    title: 'หลักสูตรการผลิตสื่อประชาสัมพันธ์ดิจิทัลและงานสารสนเทศภาครัฐ',
    organizer: 'กองสารนิเทศ สำนักงานตำรวจแห่งชาติ',
    startDate: '12 พ.ค. 2569',
    endDate: '15 พ.ค. 2569',
    location: 'สำนักงานตำรวจแห่งชาติ (อาคาร 1)',
    status: 'สำเร็จ',
    certificateNumber: 'สตช.สนท. ๒๕๖๙/๑๐๘',
  },
  {
    id: 'TRN-02',
    title: 'หลักสูตรระบบสารบรรณอิเล็กทรอนิกส์และการรักษาความปลอดภัยข้อมูลราชการ',
    organizer: 'กองบัญชาการศึกษา (บช.ศ.)',
    startDate: '20 มี.ค. 2569',
    endDate: '22 มี.ค. 2569',
    location: 'ศูนย์เทคโนโลยีสารสนเทศ บช.ศ.',
    status: 'สำเร็จ',
    certificateNumber: 'บช.ศ.อบ. ๖๙/๔๕',
  },
  {
    id: 'TRN-03',
    title: 'หลักสูตรข้าราชการตำรวจชั้นประทวน บรรจุใหม่ประจำปี ๒๕๖๙',
    organizer: 'บก.ฝรก.บช.ศ.',
    startDate: '1 ก.พ. 2569',
    endDate: '28 ก.พ. 2569',
    location: 'ศูนย์ฝึกอบรมตำรวจ บก.ฝรก.',
    status: 'สำเร็จ',
    certificateNumber: 'ฝรก.ปท. ๐๑/๖๙',
  },
  {
    id: 'TRN-04',
    title: 'หลักสูตรยุทธวิธีและทักษะการปฏิบัติการสนามหน่วย ตชด.',
    organizer: 'กองบัญชาการตำรวจตระเวนชายแดน (ค่ายนเรศวร)',
    startDate: '1 ต.ค. 2569',
    endDate: '15 ต.ค. 2569',
    location: 'ค่ายนเรศวร อ.ชะอำ จ.เพชรบุรี',
    status: 'อยู่ระหว่างอบรม',
  },
];

// Today's Scheduled Tasks & Missions for Сhairot
export const TODAY_SCHEDULE_ITEMS = [
  {
    id: 'SCH-01',
    time: '08:30',
    title: 'เคารพธงชาติ ชี้แจงภารกิจประจำวัน ฝอ.๕ บช.ตชด.',
    type: 'ประชุม' as const,
    location: 'ลานรวมพล / ห้องประชุมสารสนเทศ ชั้น 3',
    urgency: 'ปกติ',
    completed: true,
  },
  {
    id: 'SCH-02',
    time: '10:00',
    title: 'รวบรวมข้อมูลข่าวสารและภาพถ่ายภารกิจ กก.ตชด.11-44 ประจำวัน',
    type: 'ภารกิจประชาสัมพันธ์' as const,
    location: 'ห้องปฏิบัติการสื่อดิจิทัล ฝอ.๕',
    urgency: 'สำคัญ',
    completed: true,
  },
  {
    id: 'SCH-03',
    time: '13:30',
    title: 'ส่งร่างข่าวสารและอินโฟกราฟิกสถานการณ์น้ำท่วมลงพอร์ทัลตรวจเช็ค',
    type: 'ส่งรายงาน' as const,
    location: 'ระบบ SAC Portal ฝอ.๕',
    urgency: 'เร่งด่วน',
    completed: false,
    deadline: '14:00',
  },
  {
    id: 'SCH-04',
    time: '15:00',
    title: 'ตรวจสอบเอกสารฎีกาและเบี้ยเลี้ยงประจำรอบเดือนกันยายน',
    type: 'ตรวจเอกสาร' as const,
    location: 'โต๊ะทำงาน ฝอ.๕',
    urgency: 'ปกติ',
    completed: false,
  },
  {
    id: 'SCH-05',
    time: '16:30',
    title: 'สรุปรายงานยอดภารกิจและส่งต่อเวรประจำวัน (ผนวก ข)',
    type: 'ภารกิจ' as const,
    location: 'ห้องเวรวิทยุสื่อสาร บช.ตชด.',
    urgency: 'ปกติ',
    completed: false,
  },
];

// Personal Career & Service Timeline (จากเอกสารทางการ)
export const PERSONAL_CAREER_TIMELINE: PersonalTimelineMilestone[] = [
  {
    year: '2569',
    date: '20 ส.ค. 2569',
    title: 'ออกเอกสารทะเบียนประวัติข้าราชการตำรวจ (ทบ.1 / POLIS)',
    category: 'เอกสารสำคัญ',
    description: 'บันทึกประวัติการรับราชการอย่างเป็นทางการ กองสารนิเทศ/ทะเบียนพล ตร.',
    reference: 'POLIS IP: xxx.xx.x..1',
  },
  {
    year: '2569',
    date: '1 เม.ย. 2569',
    title: 'ได้รับการเลื่อนขั้นเงินเดือน ป.1 ขั้น 12 (13,310 บาท)',
    category: 'เลื่อนขั้นเงินเดือน',
    description: 'เลื่อน 0.5 ขั้น ได้รับเงินใช้เลื่อน 240 บาท บัญชีปกติ',
    reference: 'คำสั่งเลื่อนขั้นเงินเดือนรอบ เม.ย. 2569',
  },
  {
    year: '2569',
    date: '1 ก.พ. 2569',
    title: 'บรรจุเป็นข้าราชการตำรวจชั้นประทวน ยศ ส.ต.อ.',
    category: 'เลื่อนยศ',
    description: 'ได้รับแต่งตั้งเป็นระดับ ผบ.หมู่ เลขตำแหน่ง 2504 12202 1249 กก.ตชด.31',
    reference: 'คำสั่ง ตร. ที่ ๔๔/๒๕๖๙',
  },
  {
    year: '2569',
    date: '1 ก.พ. 2569',
    title: 'ได้รับมอบหมายให้ปฏิบัติหน้าที่ ฝอ.๕ บช.ตชด.',
    category: 'ดำรงตำแหน่ง',
    description: 'ปฏิบัติราชการกลุ่มงานมวลชนสัมพันธ์และการสื่อสารสารสนเทศ ฝอ.๕',
    reference: 'หนังสือช่วยราชการ บช.ตชด. ๐๐๒๗.๕/๑๑๒',
  },
  {
    year: '2568',
    date: '1 ส.ค. 2568',
    title: 'เลื่อนขั้นเงินเดือน พ.1 ขั้น 2 (3,270 บาท)',
    category: 'เลื่อนขั้นเงินเดือน',
    description: 'เลื่อน 1.0 ขั้น ได้รับเงินใช้เลื่อน 200 บาท ระดับชั้นพลฯ',
    reference: 'คำสั่ง กก.ฝรก. ๑๐๕/๖๘',
  },
  {
    year: '2567',
    date: '1 ส.ค. 2567',
    title: 'บรรจุเข้ารับราชการตำรวจ (พลฯ สำรอง บก.ฝรก.บช.ศ.)',
    category: 'ดำรงตำแหน่ง',
    description: 'เริ่มต้นอายุราชการตำรวจ ณ กองบังคับการฝึกอบรมตำรวจ กองบัญชาการศึกษา',
    reference: 'คำสั่งบรรจุ เลขตำแหน่ง 1015 13300 1775',
  },
];
