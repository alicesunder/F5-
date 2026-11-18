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
} from 'lucide-react';
import { usePRIntel } from '../context/PRIntelContext';

export type PRViewId =
  | 'dashboard'
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
  blue: 'bg-blue-600 text-white',
  slate: 'bg-slate-700 text-white',
  red: 'bg-rose-600 text-white',
  purple: 'bg-indigo-600 text-white',
  amber: 'bg-amber-500 text-slate-900',
};

const Group: React.FC<{ title: string; items: Item[]; activeView: PRViewId; onChange: (view: PRViewId) => void }> = ({
  title,
  items,
  activeView,
  onChange,
}) => (
  <section className="space-y-1">
    <div className="px-3 text-[10px] font-black tracking-wider text-slate-400 uppercase">{title}</div>
    {items.map(item => {
      const Icon = item.icon;
      const active = activeView === item.id;
      return (
        <button
          key={item.id}
          type="button"
          title={item.label}
          onClick={() => onChange(item.id)}
          className={`w-full group flex items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold transition-all duration-150 ${
            active
              ? 'bg-[#193779] text-white shadow-xs'
              : 'text-slate-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-pink-300' : 'text-slate-400 group-hover:text-slate-200'}`} />
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
    { id: 'line-reports', label: 'รายงานจาก LINE', icon: MessageSquareText, tone: 'blue' },
  ];

  const monitoring: Item[] = [
    { id: 'latest', label: 'ข่าวล่าสุด (Live Feed)', icon: Newspaper, badge: String(posts.length), tone: 'blue' },
    { id: 'facebook', label: 'Facebook Monitoring', icon: Radio },
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

  return (
    <aside className="w-full lg:w-[280px] shrink-0 rounded-2xl bg-[#081733] text-white p-3.5 shadow-xl border border-slate-800/70 sticky top-4 h-fit max-h-[calc(100vh-7rem)] overflow-y-auto">
      <div className="px-2.5 pb-3 mb-3 border-b border-white/10">
        <div className="text-[10px] uppercase tracking-[0.2em] text-pink-300 font-bold">บช.ตชด. • ฝอ.5</div>
        <div className="text-base font-black text-white mt-0.5">PR OPERATIONS CENTER</div>
        <div className="text-[10px] text-slate-400 mt-0.5">Media Monitor • Photo Ops • AI OCR</div>
      </div>

      <div className="space-y-4">
        <Group title="COMMAND CENTER" items={commandCenter} activeView={activeView} onChange={onChange} />
        <Group title="MEDIA MONITORING" items={monitoring} activeView={activeView} onChange={onChange} />
        <Group title="PR PHOTO OPERATIONS" items={operations} activeView={activeView} onChange={onChange} />
        <Group title="DOCUMENT INTELLIGENCE" items={docsGroup} activeView={activeView} onChange={onChange} />
        <Group title="SMART OPERATIONS" items={smart} activeView={activeView} onChange={onChange} />
        <Group title="REPORTS & ANALYTICS" items={reports} activeView={activeView} onChange={onChange} />
      </div>
    </aside>
  );
};
