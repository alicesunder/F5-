import { adminService } from './adminService';
import { relationsService } from './relationsService';
import { disasterService } from './disasterService';
import { volunteerService } from './volunteerService';
import { CentralActivityItem, CentralDashboardStats, DEPARTMENT_COLORS, DepartmentId } from '../types';

export interface GlobalSearchResult {
  id: string;
  title: string;
  subtitle: string;
  departmentId: DepartmentId;
  departmentName: string;
  color: string;
  category: string;
  date?: string;
  route: string;
}

class DashboardService {
  /**
   * Aggregates real-time stats across all 4 departments
   */
  public getCentralStats(): CentralDashboardStats {
    const adminStats = adminService.getStats();
    const relStats = relationsService.getStats();
    const disStats = disasterService.getStats();

    const totalTasks = adminStats.totalDocuments + disStats.totalIncidents + relStats.totalNews;
    const inProgressTasks = adminStats.pendingIncoming + disStats.inProgressIncidents + relStats.publishedCount;

    return {
      totalTasks,
      inProgressTasks,
      totalNews: relStats.totalNews,
      activeDisasters: disStats.inProgressIncidents,
      watchZones: disStats.watchAreasCount,
      latestAnnouncements: relStats.publishedCount,
    };
  }

  /**
   * Central Activity stream from all departments
   */
  public getCentralActivities(
    departmentFilter: string = 'all',
    timeRange: string = 'all'
  ): CentralActivityItem[] {
    const rawActivities: CentralActivityItem[] = [
      {
        id: 'ACT-001',
        time: '10:30',
        date: new Date().toISOString().slice(0, 10),
        departmentId: 'relations',
        departmentName: 'ฝ่ายมวลชนสัมพันธ์',
        color: DEPARTMENT_COLORS.relations,
        category: 'ข่าวประชาสัมพันธ์',
        action: 'เผยแพร่ข่าวสาร',
        detail: 'เผยแพร่ข่าวประชาสัมพันธ์: สรุปผลการปฏิบัติการบรรเทาสาธารณภัยและการจัดตั้งโรงครัวพระราชทานช่วยเหลือประชาชน',
        status: 'ประกาศแล้ว',
        route: '/relations',
        actor: 'ร.อ.หญิง ปิยะดา วงศ์สุวรรณ',
      },
      {
        id: 'ACT-002',
        time: '09:45',
        date: new Date().toISOString().slice(0, 10),
        departmentId: 'disaster',
        departmentName: 'ฝ่ายสาธารณภัย',
        color: DEPARTMENT_COLORS.disaster,
        category: 'สาธารณภัย',
        action: 'เพิ่มรายงานสถานการณ์',
        detail: 'เพิ่มรายงานสถานการณ์น้ำท่วมฉับพลันและน้ำป่าไหลหลาก พื้นที่ อ.แม่สาย จ.เชียงราย ยกระดับการเฝ้าระวังระดับ 3',
        status: 'เร่งด่วน',
        route: '/disaster',
        actor: 'พ.ท. ธนากร ภักดีชน',
      },
      {
        id: 'ACT-003',
        time: '09:15',
        date: new Date().toISOString().slice(0, 10),
        departmentId: 'admin',
        departmentName: 'ฝ่ายอำนวยการ',
        color: DEPARTMENT_COLORS.admin,
        category: 'งานสารบรรณ',
        action: 'เพิ่มเอกสารใหม่',
        detail: 'ลงทะเบียนรับหนังสือเข้า กห 0204/1892 เรื่อง แผนการจัดสรรงบประมาณยุทธศาสตร์ความมั่นคงประจำไตรมาส 1',
        status: 'กำลังดำเนินการ',
        route: '/admin',
        actor: 'พ.อ. วรพงษ์ ทรัพย์อนันต์',
      },
      {
        id: 'ACT-004',
        time: '08:30',
        date: new Date().toISOString().slice(0, 10),
        departmentId: 'volunteer',
        departmentName: 'ฝ่ายจิตอาสา',
        color: DEPARTMENT_COLORS.volunteer,
        category: 'จิตอาสา',
        action: 'เตรียมการโครงการ',
        detail: 'อัปเดตข้อมูลผู้ลงทะเบียนโครงการจิตอาสาพัฒนาสิ่งแวดล้อมริมคลองเปรมประชากร ยอดลงทะเบียน 142 นาย',
        status: 'ดำเนินการแล้ว',
        route: '/volunteer',
        actor: 'พ.ต. รัฐพงษ์ กิตติสาร',
      },
      {
        id: 'ACT-005',
        time: '16:45',
        date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
        departmentId: 'disaster',
        departmentName: 'ฝ่ายสาธารณภัย',
        color: DEPARTMENT_COLORS.disaster,
        category: 'ระบบโทรมาตร',
        action: 'ตรวจวัดระดับน้ำ',
        detail: 'สถานีตรวจวัดแม่น้ำเจ้าพระยา (C.2 นครสวรรค์) รายงานอัตราการไหล 1,850 ลบ.ม./วินาที อยู่ในเกณฑ์เฝ้าระวัง',
        status: 'เฝ้าระวัง',
        route: '/disaster',
        actor: 'ระบบตรวจวัดอัตโนมัติ',
      },
      {
        id: 'ACT-006',
        time: '14:20',
        date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
        departmentId: 'admin',
        departmentName: 'ฝ่ายอำนวยการ',
        color: DEPARTMENT_COLORS.admin,
        category: 'งานประชุม',
        action: 'บันทึกมติการประชุม',
        detail: 'บันทึกสรุปข้อสั่งการและมติการประชุมผู้บริหารประจำเดือน วาระเตรียมความพร้อมกำลังพลและเครื่องมือช่าง',
        status: 'ดำเนินการแล้ว',
        route: '/admin',
        actor: 'ฝ่ายอำนวยการ ฝอ.5',
      },
      {
        id: 'ACT-007',
        time: '11:10',
        date: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10),
        departmentId: 'relations',
        departmentName: 'ฝ่ายมวลชนสัมพันธ์',
        color: DEPARTMENT_COLORS.relations,
        category: 'คลังสื่อมีเดีย',
        action: 'อัปโหลดสื่อ',
        detail: 'อัปโหลดชุดภาพถ่ายและวิดีโอประชาสัมพันธ์โครงการฝึกอบรมวิชาชีพชุมชนรอบค่ายทหารประจำปี 2569',
        status: 'ดำเนินการแล้ว',
        route: '/relations',
        actor: 'ทีมงานประชาสัมพันธ์',
      },
    ];

    // Filter by department
    let filtered = rawActivities;
    if (departmentFilter && departmentFilter !== 'all') {
      filtered = filtered.filter(a => a.departmentId === departmentFilter);
    }

    // Filter by time range
    const todayStr = new Date().toISOString().slice(0, 10);
    if (timeRange === 'today') {
      filtered = filtered.filter(a => a.date === todayStr);
    } else if (timeRange === '7days') {
      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
      filtered = filtered.filter(a => a.date >= sevenDaysAgo);
    } else if (timeRange === '30days') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
      filtered = filtered.filter(a => a.date >= thirtyDaysAgo);
    }

    return filtered;
  }

  /**
   * Cross-department Search Engine
   */
  public searchCrossDepartment(query: string): GlobalSearchResult[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: GlobalSearchResult[] = [];

    // 1. Search Admin (Docs, budgets, travel)
    const incoming = adminService.getIncomingDocs();
    for (const doc of incoming) {
      if (
        doc.book_number.toLowerCase().includes(q) ||
        doc.subject.toLowerCase().includes(q) ||
        doc.sender.toLowerCase().includes(q)
      ) {
        results.push({
          id: doc.incoming_id,
          title: doc.subject,
          subtitle: `เลขที่: ${doc.book_number} • จาก: ${doc.sender}`,
          departmentId: 'admin',
          departmentName: 'ฝ่ายอำนวยการ',
          color: DEPARTMENT_COLORS.admin,
          category: 'หนังสือรับ',
          date: doc.received_date,
          route: '/admin',
        });
      }
    }

    const budgets = adminService.getBudgets();
    for (const b of budgets) {
      if (
        b.project_name.toLowerCase().includes(q) ||
        b.budget_id.toLowerCase().includes(q) ||
        b.budget_category.toLowerCase().includes(q)
      ) {
        results.push({
          id: b.budget_id,
          title: b.project_name,
          subtitle: `หมวด: ${b.budget_category} • หน่วย: ${b.responsible_unit}`,
          departmentId: 'admin',
          departmentName: 'ฝ่ายอำนวยการ',
          color: DEPARTMENT_COLORS.admin,
          category: 'งบประมาณ',
          route: '/admin',
        });
      }
    }

    // 2. Search Relations (News, media)
    const news = relationsService.getNews();
    for (const item of news) {
      if (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      ) {
        results.push({
          id: item.id,
          title: item.title,
          subtitle: `หมวด: ${item.category} • สถานะ: ${item.status}`,
          departmentId: 'relations',
          departmentName: 'ฝ่ายมวลชนสัมพันธ์',
          color: DEPARTMENT_COLORS.relations,
          category: 'ข่าวประชาสัมพันธ์',
          date: item.createdAt || item.date,
          route: '/relations',
        });
      }
    }

    // 3. Search Disaster (Incidents, stations)
    const incidents = disasterService.getIncidents();
    for (const inc of incidents) {
      if (
        inc.title.toLowerCase().includes(q) ||
        inc.district.toLowerCase().includes(q) ||
        inc.province.toLowerCase().includes(q) ||
        inc.type.toLowerCase().includes(q)
      ) {
        results.push({
          id: inc.id,
          title: inc.title,
          subtitle: `พื้นที่: อ.${inc.district}, จ.${inc.province} • ระดับ: ${inc.severity}`,
          departmentId: 'disaster',
          departmentName: 'ฝ่ายสาธารณภัย',
          color: DEPARTMENT_COLORS.disaster,
          category: 'เหตุสาธารณภัย',
          date: inc.reportedAt,
          route: '/disaster',
        });
      }
    }

    // 4. Search Volunteer
    const volunteers = volunteerService.getActivities();
    for (const v of volunteers) {
      if (
        v.title.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q)
      ) {
        results.push({
          id: v.id,
          title: v.title,
          subtitle: `สถานที่: ${v.location} • หมวด: ${v.category}`,
          departmentId: 'volunteer',
          departmentName: 'ฝ่ายจิตอาสา',
          color: DEPARTMENT_COLORS.volunteer,
          category: 'กิจกรรมจิตอาสา',
          date: v.date,
          route: '/volunteer',
        });
      }
    }

    return results.slice(0, 15);
  }
}

export const dashboardService = new DashboardService();
