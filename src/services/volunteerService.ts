import { DEPARTMENT_COLORS } from '../types';

export interface VolunteerActivity {
  id: string;
  title: string;
  category: string;
  location: string;
  targetVolunteers: number;
  registeredVolunteers: number;
  status: 'กำลังรับสมัคร' | 'กำลังดำเนินการ' | 'เสร็จสิ้น' | 'เตรียมการ';
  date: string;
}

export interface VolunteerStats {
  totalInitiatives: number;
  activeProjects: number;
  totalVolunteersRegistered: number;
  status: 'กำลังพัฒนา';
}

class VolunteerService {
  private activities: VolunteerActivity[] = [
    {
      id: 'VOL-001',
      title: 'จิตอาสาพระราชทาน พัฒนาสิ่งแวดล้อมและปรับปรุงภูมิทัศน์ริมคลองเปรมประชากร',
      category: 'จิตอาสาพัฒนา',
      location: 'เขตจตุจักร กรุงเทพฯ',
      targetVolunteers: 150,
      registeredVolunteers: 142,
      status: 'กำลังรับสมัคร',
      date: '2026-09-18',
    },
    {
      id: 'VOL-002',
      title: 'กิจกรรมจิตอาสาบริการ ช่วยเหลืออำนวยความสะดวกผู้สูงอายุรับบริการทางการแพทย์',
      category: 'จิตอาสาบริการ',
      location: 'โรงพยาบาลพระมงกุฎเกล้า',
      targetVolunteers: 50,
      registeredVolunteers: 50,
      status: 'กำลังดำเนินการ',
      date: '2026-09-15',
    },
    {
      id: 'VOL-003',
      title: 'จิตอาสาภัยพิบัติ ฝึกซ้อมแผนเผชิญเหตุน้ำท่วมฉับพลันและช่วยเหลือผู้ประสบภัย',
      category: 'จิตอาสาภัยพิบัติ',
      location: 'ศูนย์บรรเทาสาธารณภัย กองทัพภาคที่ 1',
      targetVolunteers: 80,
      registeredVolunteers: 76,
      status: 'เตรียมการ',
      date: '2026-09-25',
    },
  ];

  public getStats(): VolunteerStats {
    return {
      totalInitiatives: this.activities.length,
      activeProjects: this.activities.filter(a => a.status === 'กำลังดำเนินการ' || a.status === 'กำลังรับสมัคร').length,
      totalVolunteersRegistered: this.activities.reduce((sum, a) => sum + a.registeredVolunteers, 0),
      status: 'กำลังพัฒนา',
    };
  }

  public getActivities(): VolunteerActivity[] {
    return this.activities;
  }

  public getDepartmentColor(): string {
    return DEPARTMENT_COLORS.volunteer;
  }
}

export const volunteerService = new VolunteerService();
