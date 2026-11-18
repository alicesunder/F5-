import { DepartmentRole } from '../types';

export interface SystemUser {
  id: string;
  username: string;
  email: string;
  name: string;
  rank: string;
  position: string;
  department: string;
  phone: string;
  role: DepartmentRole;
  avatar?: string;
}

// ข้อมูลโปรไฟล์สำหรับแสดงผลเท่านั้น การยืนยันตัวตนทำโดย Supabase Auth (ไม่มีรหัสผ่านหรือแฮชในโค้ด)
export const PRESET_USERS: SystemUser[] = [
  {
    id: 'USR-CHAIROT-01',
    username: 'chairot',
    email: 'chairot.s@royalthaipolice.go.th',
    name: 'ชัยโรจน์ สหัสภูริพัฒน์',
    rank: 'ส.ต.อ.',
    position: 'ผบ.หมู่-รอง สว. กก.ตชด.31 ปฏิบัติหน้าที่งานประชาสัมพันธ์ ฝอ.๕ บช.ตชด.',
    department: 'ฝ่ายอำนวยการ ๕ บช.ตชด. (งานประชาสัมพันธ์)',
    phone: '02-282-8111',
    role: 'SUPER_ADMIN',
    avatar: '/assets/fo5-logo.svg',
  },
];

/** โปรไฟล์ของอีเมลที่ล็อกอิน ถ้าไม่มีในรายการจะใช้โปรไฟล์กลางที่ไม่ระบุตัวบุคคล และสิทธิ์ผู้ตรวจการณ์ */
export const profileForEmail = (email: string): SystemUser => {
  const found = PRESET_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (found) return found;
  return {
    id: `USR-${email}`,
    username: email.split('@')[0],
    email,
    name: email,
    rank: '',
    position: 'ผู้ใช้งานระบบ',
    department: 'ฝ่ายอำนวยการ ๕ บช.ตชด.',
    phone: '',
    role: 'VIEWER',
  };
};
