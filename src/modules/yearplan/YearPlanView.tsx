import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Plus, CalendarRange, ListChecks, X, Pencil, Trash2, Copy, ChevronDown, Loader2, AlertTriangle } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { DEPT_THEME } from '../../components/layout/DepartmentShell';
import {
  PlanDept,
  PlanItem,
  PlanDone,
  Occurrence,
  FY_MONTHS,
  WEEKDAYS,
  DEPT_LABEL,
  usePlanItems,
  usePlanDone,
  useOccurrences,
  describeSchedule,
  thaiDate,
  daysUntil,
  fyOf,
  fyMonthOf,
  parseIso,
  sortItems,
  isTracked,
} from './yearPlan';

type Mode = 'month' | 'year';

/** ใช้ร่วมกับการ์ดหน้าหลัก: ติ๊ก/ยกเลิกติ๊กงวดหนึ่ง */
export function useToggleDone() {
  const { currentUser } = useAdmin();
  const [done, setDone] = usePlanDone();
  const doneMap = useMemo(() => new Map(done.map(d => [d.id, d])), [done]);
  const toggle = (o: Occurrence) =>
    setDone(prev =>
      prev.some(d => d.id === o.key)
        ? prev.filter(d => d.id !== o.key)
        : [
            ...prev,
            {
              id: o.key,
              item: o.item.id,
              due: o.due,
              by: [currentUser.rank, currentUser.name].filter(Boolean).join(' ') || 'ไม่ระบุชื่อ',
              at: new Date().toISOString(),
            } satisfies PlanDone,
          ],
    );
  return { doneMap, toggle };
}

export const DueBadge: React.FC<{ due: string; done?: PlanDone }> = ({ due, done }) => {
  if (done)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 text-[11px] font-bold">
        <Check className="w-3 h-3" /> ทำแล้ว · {done.by}
      </span>
    );
  const n = daysUntil(due);
  if (n < 0 && !isTracked(due)) return <span className="rounded-full px-2 py-0.5 text-[11px] font-bold bg-slate-100 dark:bg-white/10 text-slate-400">{thaiDate(due)} · ก่อนเริ่มใช้ระบบ</span>;
  const cls =
    n < 0
      ? 'bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300'
      : n <= 7
        ? 'bg-amber-100 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300'
        : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300';
  const txt = n < 0 ? `เลยกำหนด ${-n} วัน` : n === 0 ? 'ครบกำหนดวันนี้' : n === 1 ? 'ครบกำหนดพรุ่งนี้' : `อีก ${n} วัน`;
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${cls}`}>{thaiDate(due)} · {txt}</span>;
};

export const CheckButton: React.FC<{ checked: boolean; color: string; onClick: () => void; label: string }> = ({ checked, color, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={checked}
    aria-label={label}
    className="shrink-0 w-8 h-8 rounded-xl border-2 flex items-center justify-center cursor-pointer transition"
    style={checked ? { background: color, borderColor: color, color: '#fff' } : { borderColor: '#CBD5E1' }}
  >
    {checked && <Check className="w-5 h-5" strokeWidth={3} />}
  </button>
);

// ---------- แบบฟอร์มรายการ ----------

const ItemDialog: React.FC<{
  item: PlanItem;
  isNew: boolean;
  color: string;
  onClose: () => void;
  onSave: (i: PlanItem) => Promise<boolean>;
  onDelete: (i: PlanItem) => Promise<void>;
}> = ({ item, isNew, color, onClose, onSave, onDelete }) => {
  const [f, setF] = useState<PlanItem>(item);
  const [busy, setBusy] = useState(false);
  const kind = f.weekday !== undefined && f.weekday !== null ? 'weekly' : f.due ? 'date' : 'months';
  const set = <K extends keyof PlanItem>(k: K, v: PlanItem[K]) => setF(o => ({ ...o, [k]: v }));
  const field = 'w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-white';
  const setKind = (k: string) =>
    setF(o => {
      const { weekday: _w, due: _d, ...rest } = o;
      if (k === 'weekly') return { ...rest, weekday: 2, months: [] };
      if (k === 'date') return { ...rest, due: '' };
      return rest as PlanItem;
    });

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-label={isNew ? 'เพิ่มงาน' : 'แก้ไขงาน'}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0 }} className="bg-slate-950/50 backdrop-blur-sm" />
      <form
        className="relative w-full sm:max-w-xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#11141D] shadow-2xl p-5 sm:p-6 space-y-3"
        onSubmit={async e => {
          e.preventDefault();
          if (!f.title.trim()) return;
          setBusy(true);
          const ok = await onSave({ ...f, title: f.title.trim() });
          setBusy(false);
          if (ok) onClose();
        }}
      >
        <div style={{ position: 'absolute', right: 12, top: 12 }}>
          <button type="button" onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer" aria-label="ปิด">
            <X className="w-5 h-5" />
          </button>
        </div>
        <h2 className="text-lg font-black text-slate-900 dark:text-white">{isNew ? 'เพิ่มงานในแผนรอบปี' : 'แก้ไขงาน'}</h2>
        <div className="grid grid-cols-4 gap-2">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">ลำดับ
            <input className={field} value={f.no ?? ''} onChange={e => set('no', e.target.value)} />
          </label>
          <label className="col-span-3 text-xs font-semibold text-slate-600 dark:text-slate-300">หัวข้อกลุ่ม (ถ้ามี)
            <input className={field} value={f.group ?? ''} onChange={e => set('group', e.target.value)} />
          </label>
        </div>
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">กิจกรรม *
          <textarea className={field} rows={2} value={f.title} onChange={e => set('title', e.target.value)} required />
        </label>
        <fieldset>
          <legend className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">ทำเมื่อไร</legend>
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-white/5 p-1 text-sm">
            {([['months', 'ตามเดือน'], ['weekly', 'ทุกสัปดาห์'], ['date', 'วันที่แน่นอน']] as const).map(([k, l]) => (
              <button key={k} type="button" onClick={() => setKind(k)} className={`rounded-lg px-3 py-1.5 font-semibold cursor-pointer ${kind === k ? 'bg-white dark:bg-[#1E2433] shadow-sm' : 'text-slate-500'}`}>{l}</button>
            ))}
          </div>
        </fieldset>
        {kind !== 'weekly' && (
          <div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">{kind === 'date' ? 'ช่วงเดือนที่แสดงในตาราง (ไม่บังคับ)' : 'เดือน'}</div>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1">
              {FY_MONTHS.map((m, i) => {
                const on = f.months.includes(i + 1);
                return (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={on}
                    onClick={() => set('months', on ? f.months.filter(x => x !== i + 1) : [...f.months, i + 1].sort((a, b) => a - b))}
                    className="rounded-lg border px-1 py-1.5 text-xs font-bold cursor-pointer"
                    style={on ? { background: color, color: '#fff', borderColor: color } : { borderColor: '#CBD5E1' }}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {kind === 'months' && (
          <div className="grid grid-cols-2 gap-2 items-end">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">ครบกำหนดวันที่ (เว้นว่าง = สิ้นเดือน)
              <input className={field} type="number" min={1} max={31} value={f.day ?? ''} onChange={e => set('day', e.target.value ? Number(e.target.value) : undefined)} />
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 pb-2">
              <input type="checkbox" checked={!!f.monthly || !!f.day} disabled={!!f.day} onChange={e => set('monthly', e.target.checked)} />
              ทำแยกทุกเดือน (ติ๊กรายเดือน)
            </label>
          </div>
        )}
        {kind === 'weekly' && (
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">ทุกวัน
            <select className={field} value={f.weekday} onChange={e => set('weekday', Number(e.target.value))}>
              {WEEKDAYS.map((w, i) => <option key={w} value={i}>{w}</option>)}
            </select>
          </label>
        )}
        {kind === 'date' && (
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">กำหนดส่ง
            <input className={field} type="date" value={f.due ?? ''} onChange={e => set('due', e.target.value)} required />
          </label>
        )}
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">รายละเอียด / รายการย่อย (บรรทัดละข้อ)
          <textarea className={field} rows={3} value={f.detail ?? ''} onChange={e => set('detail', e.target.value)} />
        </label>
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">หมายเหตุ
          <input className={field} value={f.note ?? ''} onChange={e => set('note', e.target.value)} />
        </label>
        <div className="flex items-center justify-between pt-2">
          {!isNew ? (
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                if (!window.confirm('ลบงานนี้ออกจากแผนรอบปี?')) return;
                setBusy(true);
                await onDelete(item);
                setBusy(false);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> ลบ
            </button>
          ) : <span />}
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer">ยกเลิก</button>
            <button type="submit" disabled={busy || !f.title.trim() || (kind === 'months' && !f.months.length)} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-50 cursor-pointer" style={{ background: color }}>
              {busy && <Loader2 className="w-4 h-4 animate-spin" />} บันทึก
            </button>
          </div>
        </div>
      </form>
    </div>,
    document.body,
  );
};

// ---------- แถวงานในมุมมองรายเดือน ----------

const OccRow: React.FC<{ o: Occurrence; done?: PlanDone; color: string; onToggle: () => void; onEdit: () => void }> = ({ o, done, color, onToggle, onEdit }) => {
  const [open, setOpen] = useState(false);
  const lines = (o.item.detail ?? '').split('\n').filter(Boolean);
  return (
    <li className={`flex gap-3 rounded-2xl border p-3 ${done ? 'bg-slate-50/70 dark:bg-white/[0.02] border-slate-200/60 dark:border-white/5' : 'bg-white dark:bg-[#161B26] border-slate-200/80 dark:border-white/10'}`}>
      <CheckButton checked={!!done} color={color} onClick={onToggle} label={done ? 'ยกเลิกว่าทำแล้ว' : 'ทำแล้ว'} />
      <div className="min-w-0 flex-1">
        <div className={`text-sm font-bold leading-snug ${done ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>
          {o.item.no && <span className="text-slate-400 font-semibold mr-1">{o.item.no}.</span>}
          {o.item.title}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <DueBadge due={o.due} done={done} />
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{describeSchedule(o.item)}</span>
          {o.item.note && <span className="text-[11px] text-slate-500 dark:text-slate-400">· {o.item.note}</span>}
        </div>
        {lines.length > 0 && (
          <>
            <button type="button" onClick={() => setOpen(v => !v)} className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold cursor-pointer" style={{ color }}>
              <ChevronDown className={`w-3.5 h-3.5 transition ${open ? 'rotate-180' : ''}`} /> รายการย่อย {lines.length} ข้อ
            </button>
            {open && (
              <ul className="mt-1 list-disc pl-5 text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
                {lines.map((l, i) => <li key={i}>{l}</li>)}
              </ul>
            )}
          </>
        )}
      </div>
      <button type="button" onClick={onEdit} className="self-start p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer" aria-label="แก้ไขงาน">
        <Pencil className="w-4 h-4" />
      </button>
    </li>
  );
};

// ---------- หน้าหลักของแท็บ ----------

export const YearPlanView: React.FC<{ dept: PlanDept }> = ({ dept }) => {
  const { showToast } = useAdmin();
  const t = DEPT_THEME[dept];
  const [items, setItems, state] = usePlanItems();
  const { doneMap, toggle } = useToggleDone();
  const today = new Date();
  const [fy, setFy] = useState(fyOf(today));
  const [mode, setMode] = useState<Mode>('month');
  const [month, setMonth] = useState(fyMonthOf(today));
  const [edit, setEdit] = useState<{ item: PlanItem; isNew: boolean } | null>(null);

  const mine = useMemo(() => items.filter(i => i.dept === dept), [items, dept]);
  const fyItems = useMemo(() => mine.filter(i => i.fy === fy).sort(sortItems), [mine, fy]);
  const occ = useOccurrences(fyItems);
  const years = [...new Set([fyOf(today), fyOf(today) + 1, ...mine.map(i => i.fy)])].sort();
  const prevItems = mine.filter(i => i.fy === fy - 1);

  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const overdue = occ.filter(o => o.due < todayIso && isTracked(o.due) && !doneMap.has(o.key));
  const soon = occ.filter(o => o.due >= todayIso && daysUntil(o.due) <= 7 && !doneMap.has(o.key));
  // งานที่ต้องทำขึ้นก่อน ตามด้วยที่ทำแล้ว และงวดก่อนเริ่มใช้ระบบไว้ท้าย
  const rank = (o: Occurrence) => (o.due < todayIso && !isTracked(o.due) && !doneMap.has(o.key) ? 2 : doneMap.has(o.key) ? 1 : 0);
  const inMonth = occ.filter(o => fyMonthOf(parseIso(o.due)) === month).sort((a, b) => rank(a) - rank(b) || a.due.localeCompare(b.due));
  const carried = overdue.filter(o => fyMonthOf(parseIso(o.due)) !== month);
  const monthDone = inMonth.filter(o => doneMap.has(o.key)).length;

  const save = async (i: PlanItem) => {
    const ok = await setItems(prev => (prev.some(x => x.id === i.id) ? prev.map(x => (x.id === i.id ? i : x)) : [...prev, i]));
    if (ok) showToast('บันทึกแล้ว', 'success');
    return ok;
  };
  const remove = async (i: PlanItem) => {
    if (await setItems(prev => prev.filter(x => x.id !== i.id))) showToast('ลบแล้ว', 'success');
  };
  const newItem = (): PlanItem => ({
    id: `${dept}-${fy}-${Date.now().toString(36)}`,
    fy,
    dept,
    title: '',
    months: [month],
    order: (fyItems[fyItems.length - 1]?.order ?? 0) + 1,
  });
  const copyPrev = async () => {
    const stamp = Date.now().toString(36);
    const copies = prevItems.map(i => {
      const { due: _d, ...rest } = i;
      // วันที่แน่นอนเลื่อนไป 1 ปี
      const due = i.due ? `${Number(i.due.slice(0, 4)) + 1}${i.due.slice(4)}` : undefined;
      return { ...rest, ...(due ? { due } : {}), id: `${i.id.replace(/-\d{4}-.*$/, '')}-${fy}-${stamp}-${i.order}`, fy };
    });
    if (await setItems(prev => [...prev, ...copies])) showToast(`คัดลอก ${copies.length} งานจากปีงบ ${fy - 1} แล้ว`, 'success');
  };

  const grouped = useMemo(() => {
    const out: { group?: string; items: PlanItem[] }[] = [];
    for (const i of fyItems) {
      const last = out[out.length - 1];
      if (last && last.group === i.group) last.items.push(i);
      else out.push({ group: i.group, items: [i] });
    }
    return out;
  }, [fyItems]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarRange className="w-5 h-5" style={{ color: t.color }} /> แผนการปฏิบัติงานรอบปี (Year Plan)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{DEPT_LABEL[dept]} · ปีงบประมาณ {fy} (ต.ค.{String(fy - 1).slice(2)} – ก.ย.{String(fy).slice(2)}) · ติ๊กเมื่อทำเสร็จ ทุกคนในฝ่ายเห็นตรงกัน</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={fy} onChange={e => setFy(Number(e.target.value))} aria-label="ปีงบประมาณ" className="rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 px-3 py-2 text-sm font-semibold">
            {years.map(y => <option key={y} value={y}>ปีงบ {y}</option>)}
          </select>
          <button type="button" onClick={() => setEdit({ item: newItem(), isNew: true })} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold text-white cursor-pointer" style={{ background: t.gradient }}>
            <Plus className="w-4 h-4" /> เพิ่มงาน
          </button>
        </div>
      </div>

      {fyItems.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-rose-50 dark:bg-rose-500/10 p-3"><div className="text-2xl font-black text-rose-600">{overdue.length}</div><div className="text-[11px] font-semibold text-rose-700 dark:text-rose-300">เลยกำหนด ยังไม่ติ๊ก</div></div>
          <div className="rounded-2xl bg-amber-50 dark:bg-amber-500/10 p-3"><div className="text-2xl font-black text-amber-600">{soon.length}</div><div className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">ครบกำหนดใน 7 วัน</div></div>
          <div className="rounded-2xl p-3" style={{ background: t.soft }}><div className="text-2xl font-black" style={{ color: t.color }}>{monthDone}/{inMonth.length}</div><div className="text-[11px] font-semibold" style={{ color: t.text }}>ทำแล้วเดือน{FY_MONTHS[month - 1]}</div></div>
        </div>
      )}

      {state.status === 'loading' && items.length === 0 && <div role="status" className="py-10 text-center text-sm text-slate-500"><Loader2 className="w-5 h-5 animate-spin inline mr-2" />กำลังโหลด...</div>}
      {state.status === 'ready' && fyItems.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/15 p-8 text-center text-sm text-slate-500 space-y-3">
          <div>ยังไม่มีงานในแผนรอบปีงบ {fy}</div>
          {prevItems.length > 0 && (
            <button type="button" onClick={copyPrev} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white cursor-pointer" style={{ background: t.gradient }}>
              <Copy className="w-4 h-4" /> คัดลอก {prevItems.length} งานจากปีงบ {fy - 1}
            </button>
          )}
        </div>
      )}

      {fyItems.length > 0 && (
        <>
          <div className="inline-flex rounded-2xl bg-slate-100 dark:bg-white/5 p-1" role="tablist">
            {([['month', 'รายเดือน (ติ๊กงาน)', ListChecks], ['year', 'ตารางทั้งปี', CalendarRange]] as const).map(([id, label, Icon]) => (
              <button key={id} type="button" role="tab" aria-selected={mode === id} onClick={() => setMode(id)} className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold cursor-pointer ${mode === id ? 'bg-white dark:bg-[#1E2433] shadow-sm' : 'text-slate-500 dark:text-slate-400'}`} style={mode === id ? { color: t.color } : undefined}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          {mode === 'month' ? (
            <div className="space-y-3">
              <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1" role="tablist" aria-label="เลือกเดือน">
                {FY_MONTHS.map((m, i) => {
                  const n = occ.filter(o => fyMonthOf(parseIso(o.due)) === i + 1 && isTracked(o.due) && !doneMap.has(o.key)).length;
                  const on = month === i + 1;
                  return (
                    <button key={m} type="button" role="tab" aria-selected={on} onClick={() => setMonth(i + 1)} className="shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer border" style={on ? { background: t.color, color: '#fff', borderColor: t.color } : { borderColor: 'transparent' }}>
                      {m}{n > 0 && <span className={`ml-1 ${on ? 'text-white/80' : 'text-slate-400'}`}>{n}</span>}
                    </button>
                  );
                })}
              </div>
              {carried.length > 0 && (
                <section>
                  <h3 className="mb-2 flex items-center gap-1.5 text-sm font-black text-rose-600"><AlertTriangle className="w-4 h-4" /> ค้างจากเดือนก่อน ({carried.length})</h3>
                  <ul className="space-y-2">
                    {carried.map(o => <OccRow key={o.key} o={o} done={doneMap.get(o.key)} color={t.color} onToggle={() => toggle(o)} onEdit={() => setEdit({ item: o.item, isNew: false })} />)}
                  </ul>
                </section>
              )}
              <section>
                <h3 className="mb-2 text-sm font-black text-slate-700 dark:text-slate-200">ครบกำหนดเดือน{FY_MONTHS[month - 1]} ({inMonth.length})</h3>
                {inMonth.length === 0 ? (
                  <div className="text-sm text-slate-500 py-6 text-center">ไม่มีงานครบกำหนดเดือนนี้</div>
                ) : (
                  <ul className="space-y-2">
                    {inMonth.map(o => <OccRow key={o.key} o={o} done={doneMap.get(o.key)} color={t.color} onToggle={() => toggle(o)} onEdit={() => setEdit({ item: o.item, isNew: false })} />)}
                  </ul>
                )}
              </section>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
              <table className="w-full min-w-[900px] text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-white/5">
                    <th className="sticky left-0 z-[1] bg-slate-50 dark:bg-[#161B26] text-left px-3 py-2 font-black text-slate-700 dark:text-slate-200 w-[320px]">กิจกรรม</th>
                    {FY_MONTHS.map((m, i) => (
                      <th key={m} className={`px-1 py-2 font-bold text-center ${i + 1 === fyMonthOf(today) && fy === fyOf(today) ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`} style={i + 1 === fyMonthOf(today) && fy === fyOf(today) ? { background: t.color } : undefined}>{m}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {grouped.map((g, gi) => (
                    <React.Fragment key={gi}>
                      {g.group && (
                        <tr><td colSpan={13} className="sticky left-0 px-3 py-1.5 font-black text-[11px]" style={{ background: t.soft, color: t.text }}>{g.group}</td></tr>
                      )}
                      {g.items.map(i => {
                        const os = occ.filter(o => o.item.id === i.id);
                        return (
                          <tr key={i.id} className="border-t border-slate-100 dark:border-white/5">
                            <td className="sticky left-0 z-[1] bg-white dark:bg-[#11141D] px-3 py-1.5 align-top">
                              <button type="button" onClick={() => setEdit({ item: i, isNew: false })} className="text-left hover:underline cursor-pointer text-slate-800 dark:text-slate-100">
                                {i.no && <span className="text-slate-400 mr-1">{i.no}</span>}{i.title}
                              </button>
                              <div className="text-[10px] text-slate-400">{describeSchedule(i)}</div>
                            </td>
                            {FY_MONTHS.map((_, mi) => {
                              const m = mi + 1;
                              const covering = os.filter(o => o.months.includes(m));
                              const dueHere = os.filter(o => fyMonthOf(parseIso(o.due)) === m);
                              if (!covering.length && !dueHere.length) return <td key={m} className="border-l border-slate-100 dark:border-white/5" />;
                              const allDone = dueHere.length > 0 && dueHere.every(o => doneMap.has(o.key));
                              const late = dueHere.some(o => o.due < todayIso && isTracked(o.due) && !doneMap.has(o.key));
                              const doneCount = dueHere.filter(o => doneMap.has(o.key)).length;
                              const before = !allDone && dueHere.length > 0 && dueHere.every(o => !isTracked(o.due) && !doneMap.has(o.key));
                              return (
                                <td key={m} className="border-l border-slate-100 dark:border-white/5 p-0.5">
                                  {dueHere.length > 0 ? (
                                    <button
                                      type="button"
                                      onClick={() => dueHere.length === 1 ? toggle(dueHere[0]) : (setMode('month'), setMonth(m))}
                                      title={dueHere.length === 1 ? `ครบกำหนด ${thaiDate(dueHere[0].due)} — กดเพื่อติ๊ก` : 'ดูรายสัปดาห์'}
                                      className="w-full h-7 rounded-md flex items-center justify-center font-bold cursor-pointer"
                                      style={allDone ? { background: '#10B981', color: '#fff' } : before ? { background: '#E2E8F0', color: '#94A3B8' } : late ? { background: '#FFE4E6', color: '#E11D48', outline: '2px solid #FB7185' } : { background: t.color, color: '#fff', opacity: 0.85 }}
                                    >
                                      {dueHere.length > 1 ? `${doneCount}/${dueHere.length}` : allDone ? <Check className="w-4 h-4" strokeWidth={3} /> : late ? '!' : ''}
                                    </button>
                                  ) : (
                                    <div className="w-full h-7 rounded-md" style={{ background: t.color, opacity: 0.3 }} />
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              <div className="flex flex-wrap gap-3 px-3 py-2 text-[11px] text-slate-500 border-t border-slate-100 dark:border-white/5">
                <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: t.color }} /> เดือนครบกำหนด (กดเพื่อติ๊ก)</span>
                <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: t.color, opacity: 0.3 }} /> ช่วงดำเนินการ</span>
                <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500" /> ทำแล้ว</span>
                <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-100 ring-2 ring-rose-400" /> เลยกำหนด</span>
                <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-200" /> ก่อนเริ่มใช้ระบบ (20 พ.ย.69)</span>
              </div>
            </div>
          )}
        </>
      )}

      {edit && <ItemDialog key={edit.item.id} item={edit.item} isNew={edit.isNew} color={t.color} onClose={() => setEdit(null)} onSave={save} onDelete={remove} />}
    </div>
  );
};
