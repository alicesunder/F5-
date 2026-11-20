import React, { useMemo } from 'react';
import { HeartHandshake, Loader2 } from 'lucide-react';
import { INITIAL_BPP_UNITS } from '../../../../data/bppUnitsData';
import { useCollection } from '../../../../lib/collections';

/**
 * โครงการสร้างจิตสำนึก บช.ตชด. ปีงบ 2570 (ตัวเลขกรอบจากงานนำเสนอ ผบก.อก.)
 * กก.ตชด. 16 กก. × 14 หมู่บ้านต่องวด = 224 หมู่บ้าน งบ 12,260,000 บาท แบ่ง 2 งวด งวดละ 6,130,000 บาท
 */
interface Row {
  /** `${unit}` */
  id: string;
  term1: number;
  term2: number;
  note?: string;
}

const PER_UNIT = 14;
const UNITS = INITIAL_BPP_UNITS.filter(u => /^กก\.ตชด\./.test(u.id)).map(u => u.id);
const TERMS = [
  { key: 'term1', label: 'ไตรมาส 1-2', span: 'ต.ค.69 – เม.ย.70', budget: '6,130,000' },
  { key: 'term2', label: 'ไตรมาส 3-4', span: 'พ.ค. – ก.ย.70', budget: '6,130,000' },
] as const;

const Bar: React.FC<{ n: number; max: number; color: string }> = ({ n, max, color }) => (
  <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden" role="progressbar" aria-valuenow={n} aria-valuemin={0} aria-valuemax={max}>
    <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (n / max) * 100)}%`, background: color }} />
  </div>
);

export const ConscienceProjectView: React.FC = () => {
  const [rows, setRows, state] = useCollection<Row>('pr.conscience_2570', 'id');
  const byId = useMemo(() => new Map(rows.map(r => [r.id, r])), [rows]);
  const get = (u: string): Row => byId.get(u) ?? { id: u, term1: 0, term2: 0 };

  const set = (u: string, patch: Partial<Row>) => {
    const next = { ...get(u), ...patch };
    void setRows(prev => (prev.some(r => r.id === u) ? prev.map(r => (r.id === u ? next : r)) : [...prev, next]));
  };
  const total = (k: 'term1' | 'term2') => UNITS.reduce((s, u) => s + get(u)[k], 0);
  const target = UNITS.length * PER_UNIT;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2"><HeartHandshake className="w-5 h-5 text-blue-600" /> โครงการสร้างจิตสำนึก บช.ตชด. ปีงบ 2570</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">งบทั้งปี 12,260,000 บาท (งวดละ 6,130,000) · เป้าหมาย {target} หมู่บ้านต่องวด (กก.ละ {PER_UNIT} หมู่บ้าน) · กรอกจำนวนหมู่บ้านที่ดำเนินการแล้วของแต่ละ กก.</p>
      </div>
      {state.status === 'loading' && rows.length === 0 && <div role="status" className="py-6 text-center text-sm text-slate-500"><Loader2 className="w-5 h-5 animate-spin inline mr-2" />กำลังโหลด...</div>}

      <div className="grid gap-3 sm:grid-cols-2">
        {TERMS.map(t => {
          const n = total(t.key);
          return (
            <div key={t.key} className="rounded-2xl border border-blue-200 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5 p-4">
              <div className="flex items-baseline justify-between"><span className="text-sm font-black text-blue-800 dark:text-blue-200">{t.label}</span><span className="text-[11px] text-slate-500">{t.span} · งบ {t.budget} บาท</span></div>
              <div className="mt-1 text-2xl font-black text-blue-700 dark:text-blue-300">{n}<span className="text-sm font-semibold text-slate-500"> / {target} หมู่บ้าน</span></div>
              <Bar n={n} max={target} color="#2563EB" />
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-white/10 divide-y divide-slate-100 dark:divide-white/5">
        {UNITS.map(u => {
          const r = get(u);
          return (
            <div key={u} className="grid grid-cols-[5.5rem_1fr_1fr] sm:grid-cols-[7rem_1fr_1fr_1.2fr] items-center gap-3 px-3 py-2">
              <div className="text-sm font-black text-slate-900 dark:text-white">{u}</div>
              {TERMS.map(t => (
                <label key={t.key} className="text-[11px] font-semibold text-slate-500">
                  <span>{t.label}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={PER_UNIT}
                      value={r[t.key] || ''}
                      placeholder="0"
                      aria-label={`${u} ${t.label}`}
                      onChange={e => set(u, { [t.key]: Math.max(0, Math.min(PER_UNIT, Number(e.target.value) || 0)) })}
                      className="w-14 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 px-2 py-1 text-sm text-slate-900 dark:text-white"
                    />
                    <span>/ {PER_UNIT}</span>
                  </div>
                  <Bar n={r[t.key]} max={PER_UNIT} color={r[t.key] >= PER_UNIT ? '#10B981' : '#2563EB'} />
                </label>
              ))}
              <input
                aria-label={`หมายเหตุ ${u}`}
                key={`${u}-${r.note ?? ''}`}
                defaultValue={r.note ?? ''}
                placeholder="หมายเหตุ"
                onBlur={e => e.target.value !== (r.note ?? '') && set(u, { note: e.target.value })}
                className="hidden sm:block rounded-lg border border-slate-200 dark:border-white/10 bg-transparent px-2 py-1 text-xs"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
