import React, { useMemo, useState } from 'react';
import { CalendarClock, ArrowRight } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { DEPT_THEME } from '../../components/layout/DepartmentShell';
import { PlanDept, DEPT_LABEL, usePlanItems, useOccurrences, daysUntil, fyOf, describeSchedule, requestYearPlanTab, YEAR_PLAN_TAB, isTracked } from './yearPlan';
import { useToggleDone, DueBadge, CheckButton } from './YearPlanView';

const DEPTS: PlanDept[] = ['admin', 'relations', 'disaster', 'volunteer'];
const SHORT: Record<PlanDept, string> = { admin: 'อำนวยการ', relations: 'มวลชนฯ/ปชส.', disaster: 'พัฒนาฯ', volunteer: 'จิตอาสา' };

/** หน้าหลัก: งานตามแผนรอบปีที่เลยกำหนด (ไม่เกิน 60 วัน) และครบกำหนดใน 7 วัน ที่ยังไม่ได้ติ๊ก */
export const DueSoonCard: React.FC = () => {
  const { navigateModule, navigate } = useAdmin();
  const [items, , state] = usePlanItems();
  const { doneMap, toggle } = useToggleDone();
  const [dept, setDept] = useState<PlanDept | 'all'>('all');
  const fy = fyOf(new Date());
  const current = useMemo(() => items.filter(i => i.fy === fy || i.fy === fy - 1), [items, fy]);
  const occ = useOccurrences(current);
  const pending = occ.filter(o => {
    const n = daysUntil(o.due);
    return n >= -60 && n <= 7 && isTracked(o.due) && !doneMap.has(o.key);
  });
  const shown = pending.filter(o => dept === 'all' || o.item.dept === dept);

  if (state.status !== 'ready' || items.length === 0) return null;

  const open = (d: PlanDept) => {
    requestYearPlanTab(d);
    navigateModule(d);
    if (d === 'admin') navigate(YEAR_PLAN_TAB);
  };

  return (
    <section aria-label="งานครบกำหนด" className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-base font-black text-slate-900 dark:text-white">
          <CalendarClock className="w-5 h-5 text-rose-500" /> งานตามแผนรอบปี ที่ต้องทำ
          <span className="rounded-full bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 px-2 py-0.5 text-xs">{pending.length}</span>
        </h2>
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {(['all', ...DEPTS] as const).map(d => {
            const on = dept === d;
            const c = d === 'all' ? '#334155' : DEPT_THEME[d].color;
            const n = d === 'all' ? pending.length : pending.filter(o => o.item.dept === d).length;
            return (
              <button key={d} type="button" onClick={() => setDept(d)} aria-pressed={on} className="shrink-0 rounded-full px-3 py-1 text-xs font-bold cursor-pointer border" style={on ? { background: c, color: '#fff', borderColor: c } : { borderColor: '#E2E8F0', color: c }}>
                {d === 'all' ? 'ทั้งหมด' : SHORT[d]} {n}
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">เลยกำหนดและครบกำหนดภายใน 7 วัน · ติ๊กเมื่อทำเสร็จแล้ว</p>
      {shown.length === 0 ? (
        <div className="py-6 text-center text-sm text-emerald-600 font-semibold">ไม่มีงานค้าง 🎉</div>
      ) : (
        <ul className="mt-3 space-y-2">
          {shown.slice(0, 8).map(o => {
            const t = DEPT_THEME[o.item.dept];
            return (
              <li key={o.key} className="flex items-start gap-3 rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white dark:bg-[#161B26] p-2.5">
                <CheckButton checked={false} color={t.color} onClick={() => toggle(o)} label="ทำแล้ว" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{o.item.title}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <DueBadge due={o.due} />
                    <button type="button" onClick={() => open(o.item.dept)} className="text-[11px] font-bold hover:underline cursor-pointer" style={{ color: t.color }} title={DEPT_LABEL[o.item.dept]}>{SHORT[o.item.dept]}</button>
                    <span className="text-[11px] text-slate-400">{describeSchedule(o.item)}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {shown.length > 8 && (
        <div className="mt-2 text-xs text-slate-500">และอีก {shown.length - 8} งาน</div>
      )}
      {dept !== 'all' && (
        <button type="button" onClick={() => open(dept)} className="mt-3 inline-flex items-center gap-1 text-sm font-bold cursor-pointer" style={{ color: DEPT_THEME[dept].color }}>
          ดูแผนรอบปีทั้งหมดของ{DEPT_LABEL[dept]} <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </section>
  );
};
