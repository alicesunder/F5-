import { BppUnit, INITIAL_BPP_UNITS, ReportDepartment, SubmissionStatus } from '../data/bppUnitsData';

const STORAGE_KEY = 'bpp_subdivisions_reports_v1';

class BppReportService {
  private units: BppUnit[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.units = parsed;
          return;
        }
      }
    } catch {
      // fallback
    }
    this.units = [...INITIAL_BPP_UNITS];
    this.saveToStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.units));
    } catch {
      // ignore
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  public getAllUnits(): BppUnit[] {
    return [...this.units];
  }

  public getUnitById(id: string): BppUnit | undefined {
    return this.units.find(u => u.id === id);
  }

  public getStats(dept?: ReportDepartment) {
    const units = this.units;
    let total = units.length;
    let submitted = 0;
    let late = 0;
    let pending = 0;
    let unsubmittedUnits: { unit: BppUnit; missingDepts: ReportDepartment[] }[] = [];

    units.forEach(u => {
      let hasMissing = false;
      let missingDepts: ReportDepartment[] = [];

      if (dept) {
        const rep = u.reports[dept];
        if (rep.status === 'submitted') submitted++;
        else if (rep.status === 'late') late++;
        else if (rep.status === 'pending') {
          pending++;
          hasMissing = true;
          missingDepts.push(dept);
        }
      } else {
        // Across all 4 departments
        const depts: ReportDepartment[] = ['admin', 'relations', 'disaster', 'volunteer'];
        let unitAllSubmitted = true;
        depts.forEach(d => {
          if (u.reports[d].status === 'pending') {
            unitAllSubmitted = false;
            missingDepts.push(d);
          }
        });

        if (unitAllSubmitted) {
          submitted++;
        } else {
          pending++;
          hasMissing = true;
        }
      }

      if (hasMissing) {
        unsubmittedUnits.push({ unit: u, missingDepts });
      }
    });

    const completionRate = Math.round((submitted / total) * 100);

    return {
      total,
      submitted,
      late,
      pending,
      completionRate,
      unsubmittedUnits,
    };
  }

  public markReportSubmitted(
    unitId: string,
    dept: ReportDepartment,
    docNo?: string,
    remarks?: string
  ) {
    const idx = this.units.findIndex(u => u.id === unitId);
    if (idx === -1) return;

    const unit = { ...this.units[idx] };
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('th-TH')} ${now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`;

    unit.reports = {
      ...unit.reports,
      [dept]: {
        ...unit.reports[dept],
        status: 'submitted',
        submittedAt: formattedDate,
        documentNo: docNo || unit.reports[dept].documentNo || `ตช ${unitId.replace(/[^0-9]/g, '')}/manual`,
        remarks: remarks || 'บันทึกรับรายงานผ่านระบบส่วนกลาง',
      },
    };

    unit.lastContactTimestamp = formattedDate;

    this.units[idx] = unit;
    this.saveToStorage();
  }

  public addFollowUpLog(
    unitId: string,
    type: 'phone' | 'radio' | 'line' | 'official_letter',
    officer: string,
    message: string
  ) {
    const idx = this.units.findIndex(u => u.id === unitId);
    if (idx === -1) return;

    const unit = { ...this.units[idx] };
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('th-TH')} ${now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`;

    const newLog = {
      id: `fl-${Date.now()}`,
      timestamp: formattedDate,
      type,
      officer,
      message,
    };

    unit.followUpHistory = [newLog, ...unit.followUpHistory];
    unit.lastContactTimestamp = formattedDate;

    this.units[idx] = unit;
    this.saveToStorage();
  }

  public updateOfficer(
    unitId: string,
    officerData: {
      officerRank: string;
      officerName: string;
      officerPosition: string;
      officerPhone: string;
      radioCallSign: string;
      lineId?: string;
    }
  ) {
    const idx = this.units.findIndex(u => u.id === unitId);
    if (idx === -1) return;

    this.units[idx] = {
      ...this.units[idx],
      ...officerData,
    };
    this.saveToStorage();
  }

  public resetToDefault() {
    this.units = [...INITIAL_BPP_UNITS];
    this.saveToStorage();
  }

  public exportCsv(dept?: ReportDepartment): string {
    const headers = [
      'ลำดับ',
      'รหัสหน่วย',
      'กองบังคับการ',
      'ค่าย',
      'จังหวัดที่ตั้ง',
      'จังหวัดรับผิดชอบ',
      'ผู้รับผิดชอบ (ยศ ชื่อ-สกุล)',
      'ตำแหน่ง',
      'เบอร์โทรศัพท์',
      'นามเรียกขาน',
      'แผนกรายงาน',
      'สถานะการส่ง',
      'วันที่ส่ง',
      'เลขที่หนังสือ',
      'หมายเหตุ',
    ];

    const rows: string[][] = [];

    this.units.forEach((u, i) => {
      const deptsToExport: ReportDepartment[] = dept
        ? [dept]
        : ['admin', 'relations', 'disaster', 'volunteer'];

      deptsToExport.forEach(d => {
        const rep = u.reports[d];
        const statusThai =
          rep.status === 'submitted'
            ? 'ส่งแล้ว'
            : rep.status === 'late'
            ? 'ส่งล่าช้า'
            : 'ยังไม่ส่ง';

        rows.push([
          String(i + 1),
          u.id,
          u.region,
          u.campName,
          u.provinceLocation,
          u.responsibleProvinces.join(', '),
          `${u.officerRank} ${u.officerName}`,
          u.officerPosition,
          u.officerPhone,
          u.radioCallSign,
          rep.departmentName,
          statusThai,
          rep.submittedAt || '-',
          rep.documentNo || '-',
          rep.remarks || '',
        ]);
      });
    });

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map(r => r.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))].join(
        '\n'
      );

    return csvContent;
  }
}

export const bppReportService = new BppReportService();
