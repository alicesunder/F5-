import React, { useEffect, useRef, useState } from 'react';
import { useVisible } from '../../lib/menuVisibility';
import { createPortal } from 'react-dom';
import { LayoutGrid, X, ChevronRight } from 'lucide-react';

export type DeptKey = 'admin' | 'relations' | 'disaster' | 'volunteer';

/** สีประจำแผนก: ใช้ซ้ำทุกจุดเพื่อให้จำได้ว่าอยู่แผนกไหน */
export const DEPT_THEME: Record<DeptKey, { color: string; soft: string; ring: string; gradient: string; text: string }> = {
  admin: { color: '#6D28D9', soft: '#F3EEFF', ring: 'rgba(109,40,217,.25)', gradient: 'linear-gradient(135deg,#7C3AED,#5B21B6)', text: '#5B21B6' },
  relations: { color: '#2563EB', soft: '#EAF2FF', ring: 'rgba(37,99,235,.25)', gradient: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', text: '#1D4ED8' },
  disaster: { color: '#EA580C', soft: '#FFF1E6', ring: 'rgba(234,88,12,.25)', gradient: 'linear-gradient(135deg,#F97316,#C2410C)', text: '#C2410C' },
  volunteer: { color: '#059669', soft: '#E8F8F1', ring: 'rgba(5,150,105,.25)', gradient: 'linear-gradient(135deg,#10B981,#047857)', text: '#047857' },
};

export interface DeptTab {
  id: string;
  label: string;
  icon: React.ElementType;
  /** คำอธิบายสั้นบนการ์ดทางลัดในหน้าภาพรวม */
  desc?: string;
  badge?: number | string;
}

interface HeaderProps {
  dept: DeptKey;
  icon: React.ElementType;
  title: string;
  description: string;
  tabs: DeptTab[];
  /** เมนูที่ซ่อนไว้ (เปิดคืนได้ที่ ตั้งค่า → การแสดงผล); เมนูที่กำลังเปิดอยู่จะไม่ถูกซ่อน */
  hiddenTabs?: readonly string[];
  activeTab: string;
  onSelectTab: (id: string) => void;
  /** ปุ่มงานหลัก (ไม่เกิน 2-3 ปุ่ม) */
  actions?: React.ReactNode;
}

const Badge: React.FC<{ value?: number | string; active?: boolean; color: string }> = ({ value, active, color }) =>
  value === undefined || value === 0 || value === '' ? null : (
    <span
      className="min-w-[1.25rem] h-5 px-1.5 rounded-full text-[11px] font-bold leading-5 text-center"
      style={active ? { background: 'rgba(255,255,255,.25)', color: '#fff' } : { background: color, color: '#fff' }}
    >
      {value}
    </span>
  );

/** หัวหน้าแผนกแบบกะทัดรัด + แถบเมนูที่ติดอยู่ด้านบนเมื่อเลื่อนจอ ใช้เหมือนกันทั้ง 4 แผนก */
export const DepartmentHeader: React.FC<HeaderProps> = ({ dept, icon: Icon, title, description, tabs: allTabs, hiddenTabs = [], activeTab, onSelectTab, actions }) => {
  const t = DEPT_THEME[dept];
  const tabs = useVisible<DeptTab>(allTabs, hiddenTabs.filter(h => h !== activeTab));
  const [sheet, setSheet] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const active = tabs.find(x => x.id === activeTab);

  // เลื่อนเมนูที่เลือกให้อยู่ในจอเสมอ (มือถือ)
  useEffect(() => {
    const el = stripRef.current?.querySelector<HTMLElement>('[aria-current="page"]');
    el?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [activeTab]);

  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSheet(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sheet]);

  const choose = (id: string) => {
    onSelectTab(id);
    setSheet(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative overflow-hidden rounded-[28px] lg-glass">
          <div className="h-1.5 w-full" style={{ background: t.gradient }} />
          <div className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0" style={{ background: t.gradient }}>
                <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">{title}</h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{description}</p>
              </div>
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2 md:justify-end">{actions}</div>}
          </div>
        </div>
      </div>

      {/* แถบเมนู: ติดด้านบนเมื่อเลื่อน */}
      <nav aria-label={`เมนู${title}`} className="sticky top-16 z-20 mt-3">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 rounded-2xl lg-glass-strong border border-white/70 dark:border-white/10 p-1.5">
            <div ref={stripRef} className="flex-1 min-w-0 flex items-center gap-1 overflow-x-auto no-scrollbar lg:flex-wrap">
              {tabs.map(tab => {
                const TabIcon = tab.icon;
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => choose(tab.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      isActive ? 'text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                    style={isActive ? { background: t.gradient, outlineColor: t.color } : { outlineColor: t.color }}
                  >
                    <TabIcon className="w-4 h-4 shrink-0" style={isActive ? undefined : { color: t.color }} />
                    <span>{tab.label}</span>
                    <Badge value={tab.badge} active={isActive} color={t.color} />
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setSheet(true)}
              className="lg:hidden shrink-0 inline-flex items-center gap-1 px-3 py-2 rounded-xl text-[13px] font-bold cursor-pointer"
              style={{ background: t.soft, color: t.text }}
              aria-haspopup="dialog"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>เมนู</span>
            </button>
          </div>
        </div>
      </nav>

      {/* มือถือ: แผ่นเมนูทั้งหมดแบบปุ่มใหญ่ */}
      {sheet &&
        createPortal(
          <div className="fixed inset-0 z-[120] lg:hidden" role="dialog" aria-modal="true" aria-label={`เมนูทั้งหมด ${title}`}>
            <div aria-hidden className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" style={{ position: 'absolute' }} onClick={() => setSheet(false)} />
            <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white dark:bg-[#151A24] p-4 pb-8 shadow-2xl animate-in slide-in-from-bottom duration-200">
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200 dark:bg-white/15" />
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs text-slate-500">{title}</div>
                  <div className="text-base font-black text-slate-900 dark:text-white">เลือกเมนู</div>
                </div>
                <button type="button" onClick={() => setSheet(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer" aria-label="ปิด">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {tabs.map(tab => {
                  const TabIcon = tab.icon;
                  const isActive = tab.id === active?.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => choose(tab.id)}
                      className="text-left rounded-2xl p-3.5 border transition-colors cursor-pointer min-h-[5.5rem]"
                      style={isActive ? { background: t.gradient, borderColor: 'transparent', color: '#fff' } : { background: t.soft, borderColor: 'transparent' }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <TabIcon className="w-5 h-5" style={isActive ? undefined : { color: t.color }} />
                        <Badge value={tab.badge} active={isActive} color={t.color} />
                      </div>
                      <div className={`mt-2 text-sm font-bold leading-snug ${isActive ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>{tab.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

/** การ์ดทางลัดใหญ่ในหน้าภาพรวม: กดแล้วไปเมนูนั้นทันที */
export const QuickStartGrid: React.FC<{ dept: DeptKey; tabs: DeptTab[]; onSelect: (id: string) => void; title?: string }> = ({
  dept,
  tabs,
  onSelect,
  title = 'เริ่มใช้งาน: ต้องการทำอะไร?',
}) => {
  const t = DEPT_THEME[dept];
  return (
    <section aria-label={title} className="space-y-3">
      <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {tabs.map(tab => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                onSelect(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group text-left rounded-2xl p-4 bg-white dark:bg-[#151A24] border border-slate-200/80 dark:border-white/10 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ outlineColor: t.color }}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: t.soft, color: t.color }}>
                  <TabIcon className="w-5 h-5" />
                </span>
                <Badge value={tab.badge} color={t.color} />
              </div>
              <div className="mt-3 text-sm sm:text-[15px] font-bold text-slate-900 dark:text-white leading-snug">{tab.label}</div>
              {tab.desc && <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{tab.desc}</div>}
              <div className="mt-2 inline-flex items-center gap-0.5 text-xs font-semibold opacity-80 group-hover:opacity-100" style={{ color: t.text }}>
                เปิด <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

/** ปุ่มงานหลักบนหัวแผนก */
export const DeptAction: React.FC<{
  dept: DeptKey;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}> = ({ dept, icon: Icon, label, onClick, variant = 'secondary' }) => {
  const t = DEPT_THEME[dept];
  const style: React.CSSProperties =
    variant === 'primary'
      ? { background: t.gradient, color: '#fff' }
      : variant === 'danger'
      ? { background: '#DC2626', color: '#fff' }
      : { background: t.soft, color: t.text };
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[13px] font-bold shadow-sm hover:opacity-90 active:scale-[.98] transition cursor-pointer"
      style={style}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
};
