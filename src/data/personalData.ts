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
 * ข้อมูลทะเบียนประวัติส่วนบุคคล — เว้นว่างไว้ ห้ามฝังข้อมูลส่วนบุคคลจริง (เลขบัตร เลขบัญชี ฯลฯ)
 * ในโค้ด เพราะไฟล์ JS ของเว็บดาวน์โหลดได้สาธารณะ
 */
export const CHAIROT_POLICE_RECORD = {
  id: '',
  nationalId: '',
  positionNumber: '',
  rank: '',
  rankFull: '',
  firstName: '',
  lastName: '',
  fullName: '',
  nickname: '',
  position: '',
  roleInDepartment: '',
  department: '',
  departmentEn: '',
  departmentCode: '',
  departmentColor: '',
  parentUnit: '',
  directCommander: '',
  battalionCommander: '',
  headquarter: '',
  phone: '',
  email: '',
  birthDate: '',
  ageYears: 0,
  ageMonths: 0,
  enlistmentDate: '',
  enlistmentPrivateDate: '',
  enlistmentNcoDate: '',
  currentLevelAppointedDate: '',
  lastAppointmentDate: '',
  retirementYear: '',
  totalServiceYears: 0,
  totalServiceMonths: 0,
  privateServiceYears: 0,
  privateServiceMonths: 0,
  ncoServiceYears: 0,
  ncoServiceMonths: 0,
  status: 'ประจำการ' as const,
  dutyStatus: 'ปฏิบัติราชการ' as PersonalDutyStatus,
  
  salaryGrade: '',
  salaryStep: 0,
  currentSalaryAmount: 0,
  costOfLivingAllowance: 0,
  hazardousDutyPay: 0,
  accountType: '',
  accountNumber: '',
  
  gpfDeduction: 0,
  policeMutualAidDeduction: 0,
  savingsCoopDeduction: 0,
  taxDeduction: 0,
  
  photoUrl: '/assets/fo5-logo.png',
};

// Official 4-period salary history from POLIS
export const SALARY_STEP_HISTORY: PoliceSalaryStepHistory[] = [];

// Past 3 Years Step Evaluation (ขั้นย้อนหลัง 3 ปี จากเอกสาร)
export const THREE_YEARS_STEPS: any[] = [];

// Position History from Document
export const POSITION_HISTORY: PolicePositionHistory[] = [];

// Rank History from Document
export const RANK_HISTORY: PoliceRankHistory[] = [];

// Real Allowances for BPP and PR Field Duties
export const INITIAL_PERSONAL_ALLOWANCES: PersonalAllowanceItem[] = [];

// Personal Expenses with LocalStorage Persistence
export const DEFAULT_PERSONAL_EXPENSES: PersonalExpenseItem[] = [];

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
export const GPF_MONTHLY_HISTORY: GpfContributionRecord[] = [];

export const GPF_TOTAL_ACCUMULATED = {
  memberAccumulated: 0,
  govContribution: 0,
  govCompensation: 0,
  investmentReturn: 0,
  grandTotal: 0,
  planType: '',
  memberNumber: '',
  officialApiStatus: '',
};

// Personal Official Documents (ก.พ.7, สลิป, คำสั่ง)
export const PERSONAL_DOCUMENTS: PersonalDocumentItem[] = [];

// Training Courses Completed / In Progress
export const TRAINING_COURSES: TrainingCourseRecord[] = [];

// Today's Scheduled Tasks & Missions for Сhairot
export const TODAY_SCHEDULE_ITEMS: any[] = [];

// Personal Career & Service Timeline (จากเอกสารทางการ)
export const PERSONAL_CAREER_TIMELINE: PersonalTimelineMilestone[] = [];
