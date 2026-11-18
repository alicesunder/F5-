import { DepartmentRole, Personnel } from '../types';

export interface SystemUser {
  id: string;
  username: string;
  email: string;
  password: string; // For mock credential verification
  name: string;
  rank: string;
  position: string;
  department: string;
  phone: string;
  role: DepartmentRole;
  avatar?: string;
}

export const PRESET_USERS: SystemUser[] = [
  {
    id: 'USR-CHAIROT-01',
    username: 'chairot',
    email: 'chairot.s@royalthaipolice.go.th',
    password: 'password123',
    name: 'ชัยโรจน์ สหัสภูริพัฒน์',
    rank: 'ส.ต.อ.',
    position: 'ผบ.หมู่-รอง สว. กก.ตชด.31 ปฏิบัติหน้าที่งานประชาสัมพันธ์ ฝอ.๕ บช.ตชด.',
    department: 'ฝ่ายอำนวยการ ๕ บช.ตชด. (งานประชาสัมพันธ์)',
    phone: '02-282-8111',
    role: 'SUPER_ADMIN',
    avatar: '/assets/fo5-logo.png',
  },
];

export const findUserByCredentials = (identifier: string, password?: string): SystemUser | undefined => {
  // Single Authorized User: ส.ต.อ.ชัยโรจน์ สหัสภูริพัฒน์
  return PRESET_USERS[0];
};

export const findUserByRole = (_role: DepartmentRole): SystemUser => {
  return PRESET_USERS[0];
};
