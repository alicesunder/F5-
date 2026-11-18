import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { LineReport, LineReportDept, LineReportStatus } from '../data/lineReportsData';

export type LineReportsLoadState = 'idle' | 'loading' | 'ready' | 'error';

interface Row {
  id: string;
  received_at: string;
  group_name: string | null;
  sender_name: string;
  unit: string | null;
  message_type: string;
  text: string;
  media_paths: string[] | null;
  dept: LineReportDept;
  matched_keyword: string | null;
  status: LineReportStatus;
  note: string | null;
}

const toReport = (r: Row): LineReport => ({
  id: r.id,
  receivedAt: r.received_at,
  groupName: r.group_name || 'กลุ่ม LINE',
  senderName: r.sender_name,
  unit: r.unit || undefined,
  text: r.text,
  messageType: r.message_type,
  mediaPaths: r.media_paths || [],
  imageCount: (r.media_paths || []).length || (r.message_type === 'image' ? 1 : 0),
  dept: r.dept,
  matchedKeyword: r.matched_keyword || undefined,
  status: r.status,
  note: r.note || undefined,
});

const COLUMNS =
  'id,received_at,group_name,sender_name,unit,message_type,text,media_paths,dept,matched_keyword,status,note';

/**
 * อ่าน/อัปเดตรายงานจาก Supabase และรับรายงานใหม่แบบสด (Realtime)
 * เริ่มทำงานเมื่อมี session และล้างข้อมูลเมื่อออกจากระบบ (RLS ให้เฉพาะผู้ล็อกอินอ่านได้)
 */
class LineReportService {
  private reports: LineReport[] = [];
  private state: LineReportsLoadState = 'idle';
  private errorMessage = '';
  private version = 0;
  private listeners = new Set<() => void>();
  private channel: RealtimeChannel | null = null;
  private started = false;

  constructor() {
    if (!isSupabaseConfigured) return;
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) void this.start();
      else this.stop();
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void this.start();
    });
  }

  private emit() {
    this.version += 1;
    this.listeners.forEach(l => l());
  }

  private async start() {
    if (this.started) return;
    this.started = true;
    await this.reload();
    this.channel = supabase
      .channel('line_reports_live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'line_reports' }, payload => {
        if (payload.eventType === 'DELETE') {
          const id = (payload.old as { id?: string }).id;
          this.reports = this.reports.filter(r => r.id !== id);
        } else {
          const next = toReport(payload.new as Row);
          this.reports = [next, ...this.reports.filter(r => r.id !== next.id)];
        }
        this.emit();
      })
      .subscribe();
  }

  private stop() {
    this.started = false;
    if (this.channel) {
      void supabase.removeChannel(this.channel);
      this.channel = null;
    }
    this.reports = [];
    this.state = 'idle';
    this.emit();
  }

  async reload() {
    this.state = 'loading';
    this.emit();
    const { data, error } = await supabase
      .from('line_reports')
      .select(COLUMNS)
      .order('received_at', { ascending: false })
      .limit(500);
    if (error) {
      this.state = 'error';
      this.errorMessage = error.message;
    } else {
      this.state = 'ready';
      this.errorMessage = '';
      this.reports = (data as Row[]).map(toReport);
    }
    this.emit();
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /** เพิ่มทุกครั้งที่ข้อมูลเปลี่ยน ใช้เป็น snapshot ของ useSyncExternalStore */
  getVersion() {
    return this.version;
  }

  getAll(): LineReport[] {
    return [...this.reports].sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
  }

  getState(): { state: LineReportsLoadState; error: string } {
    return { state: this.state, error: this.errorMessage };
  }

  private async patch(id: string, changes: Partial<LineReport>, db: Record<string, unknown>) {
    const before = this.reports;
    this.reports = this.reports.map(r => (r.id === id ? { ...r, ...changes } : r));
    this.emit();
    const { error } = await supabase.from('line_reports').update(db).eq('id', id);
    if (error) {
      this.reports = before; // ย้อนกลับเมื่อบันทึกไม่สำเร็จ
      this.errorMessage = `บันทึกไม่สำเร็จ: ${error.message}`;
      this.state = 'error';
      this.emit();
    }
  }

  setStatus(id: string, status: LineReportStatus) {
    return this.patch(id, { status }, { status });
  }

  moveToDept(id: string, dept: LineReportDept) {
    return this.patch(id, { dept, matchedKeyword: undefined }, { dept, matched_keyword: null });
  }

  setNote(id: string, note: string) {
    const clean = note.trim();
    return this.patch(id, { note: clean || undefined }, { note: clean || null });
  }

  async getMediaUrls(paths: string[]): Promise<string[]> {
    if (!paths.length) return [];
    const { data } = await supabase.storage.from('line-media').createSignedUrls(paths, 3600);
    return (data || []).map(d => d.signedUrl).filter((u): u is string => Boolean(u));
  }
}

export const lineReportService = new LineReportService();
