import React from 'react';
import { ShieldCheck, Phone, ArrowRight } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { dutyDateFor, thaiDayLabel, useDutyOfficers } from './dutyOfficers';

const Person: React.FC<{ role: string; name?: string; signed?: string; phone?: string; tone: string }> = ({ role, name, signed, phone, tone }) => (
  <div className="flex-1 min-w-[12rem] rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 p-4">
    <div className={`text-[11px] font-black tracking-wide ${tone}`}>{role}</div>
    <div className="mt-1 text-lg font-black text-slate-900 dark:text-white leading-tight">
      {name || <span className="text-slate-400 font-semibold text-sm">ยังไม่ได้กรอกตารางเวร</span>}
    </div>
    {signed && signed !== name && <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">เซ็นชื่อ: {signed}</div>}
    {phone && (
      <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:underline" onClick={e => e.stopPropagation()}>
        <Phone className="w-3.5 h-3.5" /> {phone}
      </a>
    )}
  </div>
);

/** แสดงร้อยเวร/สิบเวรของวันนี้ (และพรุ่งนี้) บนหน้าหลักภาพรวม */
export const TodayDutyCard: React.FC = () => {
  const { navigateModule, navigate } = useAdmin();
  const [items, , state] = useDutyOfficers();
  const todayId = dutyDateFor();
  const t = new Date(`${todayId}T12:00:00`);
  t.setDate(t.getDate() + 1);
  const tomorrowId = dutyDateFor(new Date(t.getFullYear(), t.getMonth(), t.getDate(), 12));
  const today = items.find(i => i.id === todayId);
  const tomorrow = items.find(i => i.id === tomorrowId);

  const openEditor = () => {
    navigateModule('admin');
    navigate('duty-officers');
  };

  return (
    <section
      aria-label="เวรประจำวันนี้"
      className="rounded-3xl border border-purple-200/70 dark:border-white/10 bg-gradient-to-r from-purple-50 via-sky-50 to-amber-50 dark:from-white/5 dark:via-white/[0.03] dark:to-white/5 p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="w-8 h-8 rounded-xl bg-[#5B2A86] text-white flex items-center justify-center">
          <ShieldCheck className="w-4 h-4" />
        </span>
        <div className="flex-1 min-w-[10rem]">
          <h2 className="text-base font-black text-slate-900 dark:text-white">เวรประจำวันนี้</h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {thaiDayLabel(todayId)} · 08.30 น. ถึง 08.30 น. วันถัดไป
          </p>
        </div>
        <button
          type="button"
          onClick={openEditor}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 text-xs font-extrabold text-[#5B2A86] dark:text-white shadow-2xs cursor-pointer"
        >
          ตารางเวรเดือนนี้ <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {state.status === 'loading' && items.length === 0 ? (
        <p className="text-xs text-slate-500" role="status">กำลังโหลด...</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-3">
            <Person role="ร้อยเวร" name={today?.officer} signed={today?.officerSigned} phone={today?.officerPhone} tone="text-[#5B2A86] dark:text-purple-300" />
            <Person role="สิบเวร" name={today?.nco} signed={today?.ncoSigned} phone={today?.ncoPhone} tone="text-sky-700 dark:text-sky-300" />
          </div>
          {today?.note && <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">หมายเหตุ: {today.note}</p>}
          <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
            พรุ่งนี้: ร้อยเวร {tomorrow?.officer || '—'} · สิบเวร {tomorrow?.nco || '—'}
          </p>
        </>
      )}
    </section>
  );
};
