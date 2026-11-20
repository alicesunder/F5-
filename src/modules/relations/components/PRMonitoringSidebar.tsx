import React from 'react';
import {
  LayoutDashboard,
  Newspaper,
  Radio,
  UsersRound,
  Hash,
  Scale,
  Sparkles,
  BellRing,
  Camera,
  CalendarDays,
  UserCog,
  MapPin,
  CircleCheck,
  ScanLine,
  FileCheck2,
  Clock3,
  Archive,
  FileBarChart2,
  ImageIcon,
  FileSearch2,
  BarChart3,
  Workflow,
  MessageSquareText,
  Megaphone,
  HeartHandshake,
} from 'lucide-react';
import { usePRIntel } from '../context/PRIntelContext';

export type PRViewId =
  | 'dashboard'
  | 'page-monitor'
  | 'spokes-daily'
  | 'conscience'
  | 'line-reports'
  | 'latest'
  | 'facebook'
  | 'pages'
  | 'keywords'
  | 'compare'
  | 'ai-news'
  | 'alerts'
  | 'photo-missions'
  | 'calendar'
  | 'staff'
  | 'locations'
  | 'completed'
  | 'scanner'
  | 'ocr-results'
  | 'pending-docs'
  | 'doc-history'
  | 'news-report'
  | 'photo-report'
  | 'doc-report'
  | 'analytics'
  | 'smart-ops';

interface PRMonitoringSidebarProps {
  activeView: PRViewId;
  onChange: (view: PRViewId) => void;
}

type Item = {
  id: PRViewId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  tone?: 'blue' | 'slate' | 'red' | 'purple' | 'amber';
};

const toneClass: Record<NonNullable<Item['tone']>, string> = {
  blue: 'bg-blue-100 text-blue-700',
  slate: 'bg-slate-100 text-slate-600',
  red: 'bg-rose-600 text-white',
  purple: 'bg-indigo-100 text-indigo-700',
  amber: 'bg-amber-100 text-amber-800',
};

const Group: React.FC<{ title: string; items: Item[]; activeView: PRViewId; onChange: (view: PRViewId) => void }> = ({
  title,
  items,
  activeView,
  onChange,
}) => (
  <section className="space-y-1">
    <div className="px-3 pt-1 text-[11px] font-bold text-slate-400">{title}</div>
    {items.map(item => {
      const Icon = item.icon;
      const active = activeView === item.id;
      return (
        <button
          key={item.id}
          type="button"
          title={item.label}
          onClick={() => onChange(item.id)}
          className={`w-full group flex items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-semibold cursor-pointer transition-all duration-150 ${
            active
              ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-blue-600'}`} />
            <span className="truncate">{item.label}</span>
          </div>
          {item.badge && (
            <span className={`min-w-6 px-1.5 py-0.2 rounded-full text-[10px] font-black text-center shrink-0 ${item.tone ? toneClass[item.tone] : 'bg-slate-700 text-white'}`}>
              {item.badge}
            </span>
          )}
        </button>
      );
    })}
  </section>
);

export const PRMonitoringSidebar: React.FC<PRMonitoringSidebarProps> = ({ activeView, onChange }) => {
  const {
    posts,
    pages,
    keywords: kwList,
    alerts,
    missions,
    personnel,
    documents,
  } = usePRIntel();

  const unreadAlerts = alerts.filter(a => !a.acknowledged).length;
  const activeMissionsCount = missions.filter(m => m.status !== 'completed').length;
  const completedMissionsCount = missions.filter(m => m.status === 'completed').length;
  const reviewDocsCount = documents.filter(d => d.status === 'review_required' || d.status === 'pending').length;

  const commandCenter: Item[] = [
    { id: 'dashboard', label: 'ศูนย์บัญชาการ PR', icon: LayoutDashboard, badge: 'LIVE', tone: 'purple' },
    { id: 'spokes-daily', label: 'รายงานโฆษกวันนี้', icon: Megaphone, badge: 'ใหม่', tone: 'blue' },
    { id: 'conscience', label: 'โครงการสร้างจิตสำนึก', icon: HeartHandshake, tone: 'blue' },
    { id: 'page-monitor', label: 'มอนิเตอร์เพจ ตชด.', icon: BarChart3, badge: 'ใหม่', tone: 'blue' },
    { id: 'line-reports', label: 'รายงานจาก LINE', icon: MessageSquareText, tone: 'blue' },
  ];

  const monitoring: Item[] = [
    { id: 'latest', label: 'ข่าวล่าสุด (Live Feed)', icon: Newspaper, badge: String(posts.length), tone: 'blue' },
    { id: 'facebook', label: 'เพจ Facebook ของหน่วย', icon: Radio },
    { id: 'pages', label: 'เพจที่ติดตาม', icon: UsersRound, badge: String(pages.length), tone: 'slate' },
    { id: 'keywords', label: 'Keyword Trends', icon: Hash, badge: String(kwList.length), tone: 'slate' },
    { id: 'compare', label: 'เปรียบเทียบเพจ', icon: Scale },
    { id: 'ai-news', label: 'AI วิเคราะห์ข่าว', icon: Sparkles, badge: 'AI', tone: 'purple' },
    { id: 'alerts', label: 'ศูนย์แจ้งเตือนและวิกฤต', icon: BellRing, badge: unreadAlerts > 0 ? String(unreadAlerts) : undefined, tone: 'red' },
  ];

  const operations: Item[] = [
    { id: 'photo-missions', label: 'ตารางภารกิจภาพถ่าย', icon: Camera, badge: String(activeMissionsCount), tone: 'blue' },
    { id: 'calendar', label: 'ปฏิทินภารกิจ', icon: CalendarDays },
    { id: 'staff', label: 'กำลังพลและช่างภาพ', icon: UserCog, badge: String(personnel.length), tone: 'slate' },
    { id: 'locations', label: 'แผนที่พื้นที่ปฏิบัติการ', icon: MapPin },
    { id: 'completed', label: 'ภารกิจที่เสร็จสิ้นแล้ว', icon: CircleCheck, badge: String(completedMissionsCount), tone: 'slate' },
  ];

  const docsGroup: Item[] = [
    { id: 'scanner', label: 'AI Document Scanner', icon: ScanLine, badge: 'OCR', tone: 'amber' },
    { id: 'ocr-results', label: 'ผลการตรวจ & OCR', icon: FileCheck2 },
    { id: 'pending-docs', label: 'เอกสารรอตรวจสอบ', icon: Clock3, badge: reviewDocsCount > 0 ? String(reviewDocsCount) : undefined, tone: 'amber' },
    { id: 'doc-history', label: 'ทะเบียนเอกสารทั้งหมด', icon: Archive, badge: String(documents.length), tone: 'slate' },
  ];

  const smart: Item[] = [
    { id: 'smart-ops', label: 'AI & Workflow Center', icon: Workflow, badge: 'NEW', tone: 'purple' },
  ];

  const reports: Item[] = [
    { id: 'news-report', label: 'รายงานข่าวสาร', icon: FileBarChart2 },
    { id: 'photo-report', label: 'รายงานภารกิจภาพถ่าย', icon: ImageIcon },
    { id: 'doc-report', label: 'รายงานตรวจสอบเอกสาร', icon: FileSearch2 },
    { id: 'analytics', label: 'PR Analytics', icon: BarChart3 },
  ];

  const groups: { title: string; items: Item[] }[] = [
    { title: 'ภาพรวม', items: commandCenter },
    { title: 'ติดตามสื่อออนไลน์', items: monitoring },
    { title: 'ภารกิจภาพถ่าย', items: operations },
    { title: 'ตรวจเอกสาร', items: docsGroup },
    { title: 'รายงานและสถิติ', items: reports },
    { title: 'ผู้ช่วย AI', items: smart },
  ];

  return (
    <>
      {/* มือถือ/แท็บเล็ต: เลือกหน้าจากรายการเดียว */}
      <label className="lg:hidden w-full block">
        <span className="block text-xs font-bold text-slate-500 mb-1">เลือกหน้าในศูนย์ปฏิบัติการ PR</span>
        <select
          value={activeView}
          onChange={e => onChange(e.target.value as PRViewId)}
          className="w-full px-3 py-3 rounded-xl border border-blue-200 bg-white dark:bg-[#151A24] dark:border-white/10 text-[15px] font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          {groups.map(g => (
            <optgroup key={g.title} label={g.title}>
              {g.items.map(it => (
                <option key={it.id} value={it.id}>
                  {it.label}
                  {it.badge && /^\d+$/.test(it.badge) ? ` (${it.badge})` : ''}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      <aside className="hidden lg:block w-[260px] shrink-0 rounded-2xl bg-white dark:bg-[#151A24] p-3 border border-slate-200/80 dark:border-white/10 sticky top-36 h-fit max-h-[calc(100vh-10rem)] overflow-y-auto">
        <div className="space-y-3">
          {groups.map(g => (
            <Group key={g.title} title={g.title} items={g.items} activeView={activeView} onChange={onChange} />
          ))}
        </div>
      </aside>
    </>
  );
};
