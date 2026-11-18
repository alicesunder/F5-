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
    avatar: '/assets/fo5-logo.png',
  },
];

// ไม่เก็บรหัสผ่านไว้ในโค้ด เก็บเฉพาะค่า SHA-256 ผ่านตัวแปร VITE_FO5_ADMIN_PASSWORD_SHA256
// (ตั้งใน Vercel หรือ .env.local) การตรวจนี้ยังทำในเบราว์เซอร์ จะปลอดภัยจริงเมื่อย้ายไป Supabase Auth
const ADMIN_PASSWORD_SHA256 = String(import.meta.env.VITE_FO5_ADMIN_PASSWORD_SHA256 || '')
  .trim()
  .toLowerCase();

export const isLoginConfigured = (): boolean => /^[0-9a-f]{64}$/.test(ADMIN_PASSWORD_SHA256);

const sha256Hex = async (text: string): Promise<string> => {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(bytes))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export const findUserByCredentials = async (
  identifier: string,
  password: string
): Promise<SystemUser | undefined> => {
  if (!isLoginConfigured() || !password) return undefined;
  const id = identifier.trim().toLowerCase();
  const user = PRESET_USERS.find(u => u.email.toLowerCase() === id || u.username.toLowerCase() === id);
  if (!user) return undefined;
  const hash = await sha256Hex(password);
  return hash === ADMIN_PASSWORD_SHA256 ? user : undefined;
};

export const findUserById = (id: string): SystemUser | undefined => PRESET_USERS.find(u => u.id === id);
