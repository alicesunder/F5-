import React, { useMemo, useState } from 'react';
import { Trophy, Leaf, Sprout, Plus, Trash2, Loader2, MessageSquareText } from 'lucide-react';
import { useAdmin } from '../../../contexts/AdminContext';
import { DEPT_THEME } from '../../../components/layout/DepartmentShell';
import { useCollection } from '../../../lib/collections';
import { useLineReports } from '../../../components/line/LineReportsView';
import { toRegisterUnit } from '../../relations/components/intel/SpokesDailyView';
import { Modal } from './AidSummaryView';

const t = DEPT_THEME.disaster;

/** ผลการประกวดผลงานตามหลักปรัชญาของเศรษฐกิจพอเพียง */
export interface Award {
  id: string;
  year: number;
  rank: string;
  category: string;
  title: string;
  winner: string;
}

/** โครงการที่ฝ่ายติดตาม: จัดจากข้อความรายงานใน LINE (คำในข้อความ) */
const PROJECTS = [
  { id: 'aphs', label: 'อพ.สธ.', full: 'โครงการอนุรักษ์พันธุกรรมพืชอันเนื่องมาจากพระราชดำริ', re: /อพ\.?\s*สธ|อนุรักษ์พันธุกรรมพืช/, icon: Leaf },
  { id: 'vetiver', label: 'หญ้าแฝก', full: 'โครงการรณรงค์การใช้หญ้าแฝกอันเนื่องมาจากพระราชดำริ', re: /หญ้า\s*แ?เ?ฝก|หญ้าแฝก|หญ้าเเฝก/, icon: Sprout },
  { id: 'sufficiency', label: 'เศรษฐกิจพอเพียง', full: 'การประกวดผลงานตามหลักปรัชญาของเศรษฐกิจพอเพียง', re: /เศรษฐกิจพอเพียง|เศรฐกิจพอเพียง/, icon: Trophy },
] as const;

const field = 'w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-white';
const lbl = 'block text-xs font-semibold text-slate-600 dark:text-slate-300';

export const RoyalProjectsView: React.FC = () => {
  const { showToast } = useAdmin();
  const { reports, state } = useLineReports();
  const [awards, setAwards, aState] = useCollection<Award>('dev.awards', 'id');
  const [open, setOpen] = useState<string | null>(null);
  const [adding, setAdding] = useState<Award | null>(null);
  const [busy, setBusy] = useState(false);

  const mine = useMemo(() => reports.filter(r => r.dept === 'disaster'), [reports]);
  const byProject = useMemo(
    () => PROJECTS.map(p => {
      const rs = mine.filter(r => p.re.test(r.text));
      const units = new Map<string, number>();
      for (const r of rs) {
        const u = toRegisterUnit(r.unit) ?? r.unit ?? 'ไม่ระบุหน่วย';
        units.set(u, (units.get(u) ?? 0) + 1);
      }
      return { ...p, rs, units: [...units.entries()].sort((a, b) => b[1] - a[1]) };
    }),
    [mine],
  );

  const years: number[] = [...new Set<number>(awards.map(a => a.year))].sort((a, b) => b - a);
  const save = async () => {
    if (!adding) return;
    setBusy(true);
    const ok = await setAwards(prev => [...prev, adding]);
    setBusy(false);
    if (ok) {
      showToast('บันทึกแล้ว', 'success');
      setAdding(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">โครงการตามพระราชดำริที่รับผิดชอบ</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">นับจากข้อความรายงาน LINE ของงานพัฒนาฯ ที่มีชื่อโครงการ ไม่ต้องกรอกซ้ำ</p>
        </div>
        {state === 'ready' && mine.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/15 p-6 text-center text-sm text-slate-500">ยังไม่มีรายงานจาก LINE ของงานนี้</div>}
        <div className="grid gap-3 md:grid-cols-3">
          {byProject.map(p => {
            const Icon = p.icon;
            const on = open === p.id;
            return (
              <div key={p.id} className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#161B26] p-4">
                <div className="flex items-center gap-2 text-sm font-black" style={{ color: t.text }}><Icon className="w-4 h-4" /> {p.label}</div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{p.full}</p>
                <div className="mt-2 text-3xl font-black" style={{ color: t.color }}>{p.rs.length} <span className="text-xs font-semibold text-slate-500">รายงาน</span></div>
                {p.units.length > 0 && <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{p.units.slice(0, 4).map(([u, n]) => `${u} (${n})`).join(' · ')}{p.units.length > 4 ? ` +${p.units.length - 4}` : ''}</p>}
                {p.rs.length > 0 && (
                  <button type="button" onClick={() => setOpen(on ? null : p.id)} aria-expanded={on} className="mt-2 inline-flex items-center gap-1 text-xs font-bold cursor-pointer" style={{ color: t.color }}><MessageSquareText className="w-3.5 h-3.5" /> {on ? 'ซ่อนรายการ' : 'ดูรายงาน'}</button>
                )}
                {on && (
                  <ul className="mt-2 space-y-1.5 max-h-72 overflow-y-auto">
                    {p.rs.slice(0, 30).map(r => (
                      <li key={r.id} className="rounded-lg bg-slate-50 dark:bg-white/5 p-2 text-xs"><b>{toRegisterUnit(r.unit) ?? r.unit ?? r.senderName}</b> · {new Date(r.receivedAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}<div className="text-slate-600 dark:text-slate-300 line-clamp-2 whitespace-pre-line">{r.text}</div></li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2"><Trophy className="w-5 h-5" style={{ color: t.color }} /> ผลการประกวดเศรษฐกิจพอเพียง ของ บช.ตชด.</h2>
          <button type="button" onClick={() => setAdding({ id: `aw-${Date.now().toString(36)}`, year: new Date().getFullYear() + 543, rank: 'ชนะเลิศ', category: '', title: '', winner: '' })} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold text-white cursor-pointer" style={{ background: t.gradient }}><Plus className="w-4 h-4" /> เพิ่มผลรางวัล</button>
        </div>
        {aState.status === 'loading' && awards.length === 0 && <div role="status" className="py-4 text-center text-sm text-slate-500"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />กำลังโหลด...</div>}
        {years.map(y => (
          <div key={y} className="rounded-2xl border border-slate-200/80 dark:border-white/10 overflow-hidden">
            <div className="px-4 py-2 text-sm font-black" style={{ background: t.soft, color: t.text }}>ผลการประกวดปี {y} · {awards.filter(a => a.year === y).length} รางวัล</div>
            <ul className="divide-y divide-slate-100 dark:divide-white/5">
              {awards.filter(a => a.year === y).map(a => (
                <li key={a.id} className="flex items-start gap-3 px-4 py-3">
                  <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-black text-white" style={{ background: a.rank.startsWith('ชนะเลิศ') ? '#D97706' : a.rank.startsWith('รอง') ? '#64748B' : '#0D9488' }}>{a.rank}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{a.category}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">{a.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{a.winner}</div>
                  </div>
                  <button type="button" aria-label="ลบ" onClick={() => window.confirm('ลบรางวัลนี้?') && void setAwards(prev => prev.filter(x => x.id !== a.id))} className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {adding && (
        <Modal title="เพิ่มผลรางวัล" onClose={() => setAdding(null)}>
          <form className="space-y-3" onSubmit={e => { e.preventDefault(); void save(); }}>
            <div className="grid grid-cols-2 gap-2">
              <label className={lbl}>ปี พ.ศ.<input className={field} type="number" value={adding.year} onChange={e => setAdding({ ...adding, year: Number(e.target.value) || adding.year })} /></label>
              <label className={lbl}>รางวัล<input className={field} list="aw-rank" value={adding.rank} onChange={e => setAdding({ ...adding, rank: e.target.value })} /></label>
            </div>
            <datalist id="aw-rank">{['ชนะเลิศ', 'รองชนะเลิศอันดับ 1', 'รองชนะเลิศอันดับ 2', 'ชมเชย'].map(v => <option key={v} value={v} />)}</datalist>
            <label className={lbl}>ประเภท<input className={field} value={adding.category} onChange={e => setAdding({ ...adding, category: e.target.value })} required /></label>
            <label className={lbl}>ชื่อผลงาน<input className={field} value={adding.title} onChange={e => setAdding({ ...adding, title: e.target.value })} /></label>
            <label className={lbl}>ผู้รับรางวัล / หน่วย / สถานที่<input className={field} value={adding.winner} onChange={e => setAdding({ ...adding, winner: e.target.value })} /></label>
            <div className="flex justify-end gap-2"><button type="button" onClick={() => setAdding(null)} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer">ยกเลิก</button><button type="submit" disabled={busy || !adding.category.trim()} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-50 cursor-pointer" style={{ background: t.gradient }}>{busy && <Loader2 className="w-4 h-4 animate-spin" />} บันทึก</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
};
