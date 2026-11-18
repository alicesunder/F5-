import {
  INITIAL_LINE_REPORTS,
  LineReport,
  LineReportDept,
  LineReportStatus,
} from '../data/lineReportsData';

// เก็บในเบราว์เซอร์ไปก่อน (ระยะที่ 1) ระยะที่ 2 จะสลับเป็น Supabase โดยคง interface นี้ไว้
const STORAGE_KEY = 'fo5_line_reports_v1';

class LineReportService {
  private reports: LineReport[] = [];
  private listeners = new Set<() => void>();

  constructor() {
    this.load();
  }

  private load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.reports = parsed;
          return;
        }
      }
    } catch {
      // ใช้ข้อมูลตัวอย่างแทน
    }
    this.reports = [...INITIAL_LINE_REPORTS];
  }

  private commit() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.reports));
    } catch {
      // ไม่มีที่เก็บก็ใช้ในหน่วยความจำต่อได้
    }
    this.listeners.forEach(l => l());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getAll(): LineReport[] {
    return [...this.reports].sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
  }

  setStatus(id: string, status: LineReportStatus) {
    this.reports = this.reports.map(r => (r.id === id ? { ...r, status } : r));
    this.commit();
  }

  moveToDept(id: string, dept: LineReportDept) {
    this.reports = this.reports.map(r =>
      r.id === id ? { ...r, dept, matchedKeyword: undefined } : r
    );
    this.commit();
  }

  setNote(id: string, note: string) {
    this.reports = this.reports.map(r => (r.id === id ? { ...r, note: note.trim() || undefined } : r));
    this.commit();
  }

  resetSamples() {
    this.reports = [...INITIAL_LINE_REPORTS];
    this.commit();
  }
}

export const lineReportService = new LineReportService();
