import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Save, Loader2, Copy, Printer } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { DutyOfficerDay, dutyDateFor, isoDate, thaiDayLabel, useDutyOfficers } from './dutyOfficers';

type Row = Omit<DutyOfficerDay, 'id'>;
const EMPTY: Row = { officer: '', officerSigned: '', officerPhone: '', nco: '', ncoSigned: '', ncoPhone: '', note: '' };

const monthDays = (year: number, month: number) => {
  const n = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: n }, (_, i) => isoDate(new Date(year, month, i + 1)));
};

const cell =
  'w-full min-w-[9rem] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151A22] text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#5B2A86]/30';

/** ตารางเวรประจำเดือน: กรอกร้อยเวร/สิบเวรรายวัน แล้วกดบันทึกทั้งเดือน */
export const DutyRosterEditor: React.FC = () => {
  const { showToast } = useAdmin();
  const [items, setItems, state] = useDutyOfficers();
  const now = new Date();
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const days = useMemo(() => monthDays(ym.y, ym.m), [ym]);
  const today = dutyDateFor();

  const saved = useMemo(() => new Map(items.map(i => [i.id, i])), [items]);
  const [draft, setDraft] = useState<Record<string, Row>>({});
  const [saving, setSaving] = useState(false);

  // โหลดค่าที่บันทึกไว้ของเดือนที่เลือกมาเป็นฉบับร่าง
  useEffect(() => {
    const d: Record<string, Row> = {};
    for (const day of days) {
      const s = saved.get(day);
      d[day] = s ? { ...EMPTY, ...s } : { ...EMPTY };
    }
    setDraft(d);
  }, [days, saved]);

  const names = useMemo(() => {
    const set = new Set<string>();
    for (const i of items) {
      if (i.officer) set.add(i.officer);
      if (i.nco) set.add(i.nco);
    }
    return [...set].sort((a, b) => a.localeCompare(b, 'th'));
  }, [items]);

  const dirty = days.some(day => {
    const a = draft[day];
    const b = saved.get(day);
    if (!a) return false;
    const norm = (r?: Partial<Row>) =>
      JSON.stringify(
        [r?.officer, r?.officerSigned, r?.officerPhone, r?.nco, r?.ncoSigned, r?.ncoPhone, r?.note].map(x => (x || '').trim())
      );
    return norm(a) !== norm(b);
  });

  const set = (day: string, k: keyof Row, v: string) => setDraft(d => ({ ...d, [day]: { ...d[day], [k]: v } }));

  const shift = (delta: number) => {
    if (dirty && !window.confirm('มีการแก้ไขที่ยังไม่บันทึก ต้องการเปลี่ยนเดือนโดยไม่บันทึกใช่ไหม?')) return;
    setYm(({ y, m }) => {
      const d = new Date(y, m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  };

  const save = async () => {
    setSaving(true);
    const monthSet = new Set(days);
    const next: DutyOfficerDay[] = items.filter(i => !monthSet.has(i.id));
    for (const day of days) {
      const r = draft[day];
      const clean = {
        officer: r.officer.trim(),
        officerSigned: (r.officerSigned || '').trim(),
        officerPhone: (r.officerPhone || '').trim(),
        nco: r.nco.trim(),
        ncoSigned: (r.ncoSigned || '').trim(),
        ncoPhone: (r.ncoPhone || '').trim(),
        note: (r.note || '').trim(),
      };
      // วันที่ว่างทั้งหมดไม่ต้องเก็บ
      if (clean.officer || clean.nco || clean.note) next.push({ id: day, ...clean });
    }
    const ok = await setItems(next);
    setSaving(false);
    if (ok) showToast('บันทึกตารางเวรเรียบร้อยแล้ว', 'success');
  };

  const copyPrevMonth = () => {
    // คัดลอกรายชื่อตามลำดับวันจากเดือนก่อน (วันที่ 1 → วันที่ 1)
    const prev = monthDays(ym.m === 0 ? ym.y - 1 : ym.y, ym.m === 0 ? 11 : ym.m - 1);
    setDraft(d => {
      const out = { ...d };
      days.forEach((day, i) => {
        const s = prev[i] ? saved.get(prev[i]) : undefined;
        if (s) out[day] = { ...EMPTY, ...s, note: '' };
      });
      return out;
    });
  };

  const filled = days.filter(d => draft[d]?.officer || draft[d]?.nco).length;
  const monthLabel = new Date(ym.y, ym.m, 1).toLocaleDateString('th-TH', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#5B2A86] text-white flex items-center justify-center shrink-0">
          <CalendarDays className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-[12rem]">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">ตารางเวรประจำเดือน (ร้อยเวร / สิบเวร)</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            กรอกชื่อผู้เข้าเวรรายวัน แล้วกดบันทึก หน้าหลักภาพรวมจะแสดงเวรของวันนี้อัตโนมัติ (เปลี่ยนเวรเวลา 08.30 น.)
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-1">
          <button type="button" onClick={() => shift(-1)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer" aria-label="เดือนก่อน">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 text-sm font-bold min-w-[9rem] text-center">{monthLabel}</span>
          <button type="button" onClick={() => shift(1)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer" aria-label="เดือนถัดไป">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500">กรอกแล้ว {filled}/{days.length} วัน</span>
        {state.status === 'loading' && (
          <span className="text-slate-500 inline-flex items-center gap-1" role="status">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> กำลังโหลด...
          </span>
        )}
        {state.error && <span className="text-rose-600" role="alert">{state.error}</span>}
        <div className="flex-1" />
        <button type="button" onClick={copyPrevMonth} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 font-semibold hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer">
          <Copy className="w-3.5 h-3.5" /> คัดลอกจากเดือนก่อน
        </button>
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 font-semibold hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer">
          <Printer className="w-3.5 h-3.5" /> พิมพ์
        </button>
        <button
          type="button"
          onClick={() => void save()}
          disabled={!dirty || saving}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5B2A86] hover:bg-[#7B3FC6] text-white font-bold disabled:opacity-40 cursor-pointer"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          {dirty ? 'บันทึกตารางเวร' : 'บันทึกแล้ว'}
        </button>
      </div>

      <datalist id="duty-names">
        {names.map(n => (
          <option key={n} value={n} />
        ))}
      </datalist>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-slate-200 dark:border-white/10">
              <th className="py-2.5 px-3 w-40">วันที่</th>
              <th className="py-2.5 px-2">ร้อยเวร (ปฏิบัติจริง)</th>
              <th className="py-2.5 px-2">ร้อยเวร (เซ็นชื่อ)</th>
              <th className="py-2.5 px-2 w-32">โทร</th>
              <th className="py-2.5 px-2">สิบเวร (ปฏิบัติจริง)</th>
              <th className="py-2.5 px-2">สิบเวร (เซ็นชื่อ)</th>
              <th className="py-2.5 px-2 w-32">โทร</th>
              <th className="py-2.5 px-2">หมายเหตุ</th>
            </tr>
          </thead>
          <tbody>
            {days.map(day => {
              const r = draft[day] || EMPTY;
              const dow = new Date(`${day}T12:00:00`).getDay();
              const weekend = dow === 0 || dow === 6;
              const isToday = day === today;
              return (
                <tr
                  key={day}
                  className={`border-b border-slate-100 dark:border-white/5 ${isToday ? 'bg-amber-50 dark:bg-amber-400/10' : weekend ? 'bg-rose-50/50 dark:bg-white/[0.02]' : ''}`}
                >
                  <td className="py-1.5 px-3 whitespace-nowrap">
                    <div className={`font-semibold ${weekend ? 'text-rose-600' : 'text-slate-800 dark:text-slate-100'}`}>
                      {thaiDayLabel(day, { weekday: 'short', day: 'numeric', month: 'short' })}
                    </div>
                    {isToday && <div className="text-[10px] font-bold text-amber-600">เวรวันนี้</div>}
                  </td>
                  <td className="py-1.5 px-2">
                    <input className={cell} list="duty-names" value={r.officer} onChange={e => set(day, 'officer', e.target.value)} placeholder="ยศ ชื่อ" aria-label={`ร้อยเวร ${day}`} />
                  </td>
                  <td className="py-1.5 px-2">
                    <input className={cell} list="duty-names" value={r.officerSigned || ''} onChange={e => set(day, 'officerSigned', e.target.value)} placeholder="ถ้าต่างจากผู้ปฏิบัติ" aria-label={`ร้อยเวรเซ็นชื่อ ${day}`} />
                  </td>
                  <td className="py-1.5 px-2">
                    <input className={cell + ' !min-w-[7rem]'} inputMode="tel" value={r.officerPhone || ''} onChange={e => set(day, 'officerPhone', e.target.value)} aria-label={`โทรร้อยเวร ${day}`} />
                  </td>
                  <td className="py-1.5 px-2">
                    <input className={cell} list="duty-names" value={r.nco} onChange={e => set(day, 'nco', e.target.value)} placeholder="ยศ ชื่อ" aria-label={`สิบเวร ${day}`} />
                  </td>
                  <td className="py-1.5 px-2">
                    <input className={cell} list="duty-names" value={r.ncoSigned || ''} onChange={e => set(day, 'ncoSigned', e.target.value)} placeholder="ถ้าต่างจากผู้ปฏิบัติ" aria-label={`สิบเวรเซ็นชื่อ ${day}`} />
                  </td>
                  <td className="py-1.5 px-2">
                    <input className={cell + ' !min-w-[7rem]'} inputMode="tel" value={r.ncoPhone || ''} onChange={e => set(day, 'ncoPhone', e.target.value)} aria-label={`โทรสิบเวร ${day}`} />
                  </td>
                  <td className="py-1.5 px-2">
                    <input className={cell} value={r.note || ''} onChange={e => set(day, 'note', e.target.value)} aria-label={`หมายเหตุ ${day}`} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
