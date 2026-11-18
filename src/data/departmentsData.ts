import { DepartmentConfig, DepartmentId, Role, AppModule } from '../types';

export const DEPARTMENTS: DepartmentConfig[] = [
  {
    id: 'admin',
    name: 'งานอำนวยการ',
    enName: 'Administration & Operations Division',
    primaryColor: '#5B2A86',
    description: 'บริหารจัดการงานธุรการ สารบรรณ งบประมาณ และสนับสนุนภารกิจกลาง',
    status: 'พร้อมใช้งาน',
    buttonText: 'เข้าสู่ระบบสายงาน',
    isAvailable: true,
    route: '/admin',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'ADMIN_DEPARTMENT', 'RELATIONS', 'DISASTER', 'VOLUNTEER', 'VIEWER', 'admin', 'executive', 'officer'],
  },
  {
    id: 'relations',
    name: 'งานประชาสัมพันธ์',
    enName: 'Public Relations & Communications',
    primaryColor: '#2583D8',
    description: 'สื่อสารองค์กร เผยแพร่ข่าวสาร และสร้างความเข้าใจเชื่อมโยงทุกภาคส่วน',
    status: 'พร้อมใช้งาน',
    buttonText: 'เข้าสู่ระบบสายงาน',
    isAvailable: true,
    route: '/relations',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'ADMIN_DEPARTMENT', 'RELATIONS', 'DISASTER', 'VOLUNTEER', 'VIEWER', 'admin', 'executive', 'officer'],
  },
  {
    id: 'disaster',
    name: 'งานพัฒนาช่วยเหลือประชาชน',
    enName: 'Public Development & Disaster Relief',
    primaryColor: '#E89B22',
    description: 'เฝ้าระวัง ป้องกัน บรรเทาสาธารณภัย และพัฒนาช่วยเหลือประชาชน',
    status: 'พร้อมใช้งาน',
    buttonText: 'เข้าสู่ระบบสายงาน',
    isAvailable: true,
    route: '/disaster',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'ADMIN_DEPARTMENT', 'RELATIONS', 'DISASTER', 'VOLUNTEER', 'VIEWER', 'admin', 'executive', 'officer'],
  },
  {
    id: 'volunteer',
    name: 'งานจิตอาสา',
    enName: 'Volunteer Operations Center',
    primaryColor: '#42A77A',
    description: 'ศูนย์บริหารงานจิตอาสาพระราชทาน พัฒนาชุมชน และช่วยเหลือสังคมอย่างยั่งยืน',
    status: 'พร้อมใช้งาน',
    buttonText: 'เข้าสู่ระบบสายงาน',
    isAvailable: true,
    route: '/volunteer',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'ADMIN_DEPARTMENT', 'RELATIONS', 'DISASTER', 'VOLUNTEER', 'VIEWER', 'admin', 'executive', 'officer'],
  },
];

export const ROLE_LABELS: Record<string, { title: string; dept: string; color: string; badge: string; description: string }> = {
  SUPER_ADMIN: {
    title: 'ผู้ดูแลระบบสูงสุด (Super Admin)',
    dept: 'ศูนย์ปฏิบัติการร่วมและบริหารงานกลาง',
    color: '#5B2A86',
    badge: 'SUPER_ADMIN',
    description: 'เข้าถึงได้ทุกระบบงานและสายงานปฏิบัติการ',
  },
  ADMIN: {
    title: 'ผู้ดูแลระบบกลาง (Admin)',
    dept: 'ศูนย์บริหารงานกลาง',
    color: '#0284C7',
    badge: 'ADMIN',
    description: 'จัดการระบบกลางและภาพรวมศูนย์ปฏิบัติการ',
  },
  ADMIN_DEPARTMENT: {
    title: 'เจ้าหน้าที่งานอำนวยการ',
    dept: 'งานอำนวยการ',
    color: '#5B2A86',
    badge: 'ADMIN_DEPARTMENT',
    description: 'เข้าถึงและบริหารงานอำนวยการ',
  },
  RELATIONS: {
    title: 'เจ้าหน้าที่งานประชาสัมพันธ์',
    dept: 'งานประชาสัมพันธ์',
    color: '#2583D8',
    badge: 'RELATIONS',
    description: 'เข้าถึงและจัดการงานประชาสัมพันธ์',
  },
  DISASTER: {
    title: 'เจ้าหน้าที่งานพัฒนาช่วยเหลือประชาชน',
    dept: 'งานพัฒนาช่วยเหลือประชาชน',
    color: '#E89B22',
    badge: 'DISASTER',
    description: 'เข้าถึงและปฏิบัติการงานพัฒนาช่วยเหลือประชาชนและบรรเทาภัย',
  },
  VOLUNTEER: {
    title: 'เจ้าหน้าที่งานจิตอาสา',
    dept: 'งานจิตอาสา',
    color: '#42A77A',
    badge: 'VOLUNTEER',
    description: 'เข้าถึงและประสานงานจิตอาสา',
  },
  VIEWER: {
    title: 'ผู้เข้าชมทั่วไป (Viewer)',
    dept: 'ส่วนสังเกตการณ์',
    color: '#6B7280',
    badge: 'VIEWER',
    description: 'ดูข้อมูลภาพรวมที่ได้รับอนุญาตเท่านั้น',
  },
  admin: {
    title: 'ผู้ดูแลระบบ ฝอ.5',
    dept: 'งานอำนวยการ',
    color: '#5B2A86',
    badge: 'งานอำนวยการ',
    description: 'เข้าถึงงานอำนวยการ',
  },
  executive: {
    title: 'ผู้บังคับบัญชา',
    dept: 'งานอำนวยการ',
    color: '#5B2A86',
    badge: 'ผู้บริหาร',
    description: 'เข้าถึงงานอำนวยการ',
  },
  officer: {
    title: 'เจ้าหน้าที่ปฏิบัติการ',
    dept: 'งานอำนวยการ',
    color: '#5B2A86',
    badge: 'เจ้าหน้าที่',
    description: 'เข้าถึงงานอำนวยการ',
  },
  viewer: {
    title: 'ผู้สังเกตการณ์',
    dept: 'ส่วนกลาง',
    color: '#6B7280',
    badge: 'ดูได้อย่างเดียว',
    description: 'ดูข้อมูลภาพรวม',
  },
};

/**
 * Standard RBAC Authorization Engine
 */
export const checkModuleAccess = (
  role: Role | string,
  targetModule: AppModule
): { allowed: boolean; targetTitle: string; reason?: string } => {
  const moduleNames: Record<AppModule, string> = {
    home: 'หน้าหลักสาธารณะ',
    login: 'หน้าเข้าสู่ระบบ',
    'my-space': 'ฉัน (Personal Command Center)',
    dashboard: 'หน้าหลักภาพรวม (Command Overview)',
    admin: 'งานอำนวยการ',
    relations: 'งานประชาสัมพันธ์',
    disaster: 'งานพัฒนาช่วยเหลือประชาชน',
    volunteer: 'งานจิตอาสา',
    reports: 'รายงานสรุปภาพรวม',
    calendar: 'ตารางภารกิจ ฝอ.5',
    'duty-roster': 'ตารางการปฏิบัติหน้าที่สิบเวร (ผนวก ข)',
    documents: 'คลังเอกสารราชการ & ร่างหนังสือ AI',
    slides: 'ระบบสไลด์นำเสนอ AI',
    news: 'ข่าวสารและประกาศ',
    settings: 'ตั้งค่าระบบ',
    workspace: 'ศูนย์เชื่อมต่อ Google Workspace',
    maps: 'Google Maps ศูนย์แผนที่ปฏิบัติการ',
    'bpp-tracker': 'ระบบตรวจเช็คการส่งรายงาน 16 กก.ตชด.',
    'task-center': 'ศูนย์งานกลาง (Unified Task Center)',
    'line-reports': 'รายงานจาก LINE',
    'strategic': 'แผนปฏิบัติราชการและตัวชี้วัด (KPI)',
    'communication-groups': 'กลุ่มการสื่อสารและเครือข่ายหน่วย',
    'executive-view': 'สรุปสำหรับผู้บริหาร (Executive Briefing)',
    'ai-intelligence': 'ระบบวิเคราะห์ข้อมูลอัจฉริยะ (AI Intelligence)',
    'history-audit': 'ประวัติการดำเนินงานและบันทึกตรวจสอบ',
    'knowledge-center': 'คลังความรู้ ฝอ.5',
    'smart-systems': 'ศูนย์รวม 10 ระบบปฏิบัติการอัจฉริยะ ฝอ.5',
  };

  const targetTitle = moduleNames[targetModule] || targetModule;

  // Single Sign-On Access Model:
  // "LOGIN = ACCESS TO ALL DEPARTMENTS"
  // All authenticated users have full access across all 4 departments and the central dashboard.
  return {
    allowed: true,
    targetTitle,
  };
};

export const canAccessDepartment = (_role: Role | string, _departmentId: DepartmentId): boolean => {
  // All departments accessible post-login
  return true;
};
