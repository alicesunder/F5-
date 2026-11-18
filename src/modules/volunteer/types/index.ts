/**
 * Module Architecture: ฝ่ายจิตอาสา (Volunteer & Community Services)
 * Route: /volunteer
 * 
 * Note: Clean architectural types prepared for future phase implementation.
 * No database or CRUD logic is instantiated in this placeholder phase.
 */

export type VolunteerStatus = 'Active' | 'Pending' | 'Inactive';

export type ActivityStatus = 'Draft' | 'Open' | 'InProgress' | 'Completed' | 'Cancelled';

export interface VolunteerMember {
  id: string;
  nationalId?: string;
  fullName: string;
  affiliation: string;
  phoneNumber: string;
  volunteerType: 'จิตอาสาพระราชทาน' | 'จิตอาสาทั่วไป' | 'อาสาสมัครภาคประชาชน';
  registeredDate: string;
  accumulatedHours: number;
  status: VolunteerStatus;
}

export interface VolunteerActivity {
  id: string;
  title: string;
  description: string;
  location: string;
  district: string;
  startDate: string;
  endDate: string;
  requiredVolunteers: number;
  registeredCount: number;
  category: 'พัฒนาพื้นที่และคูคลอง' | 'บรรเทาสาธารณภัย' | 'ปลูกป่าและอนุรักษ์' | 'บริการประชาชน';
  status: ActivityStatus;
}

export interface VolunteerInventoryItem {
  id: string;
  itemName: string;
  category: 'หมวกและผ้าพันคอพระราชทาน' | 'อุปกรณ์ช่างและทำความสะอาด' | 'เวชภัณฑ์เบื้องต้น';
  totalStock: number;
  disbursedStock: number;
  remainingStock: number;
  unit: string;
}

export interface VolunteerModuleStats {
  totalRegisteredVolunteers: number;
  activeProjects: number;
  totalServiceHours: number;
  certificatesIssued: number;
}
