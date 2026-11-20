import React, { useMemo, useState } from 'react';
import { Megaphone, Copy, Printer, Check, Clock, Settings2, ChevronLeft, ChevronRight, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { useAdmin } from '../../../../contexts/AdminContext';
import { useLineReports } from '../../../../components/line/LineReportsView';
import { INITIAL_BPP_UNITS } from '../../../../data/bppUnitsData';
import { useCollection } from '../../../../lib/collections';
import type { LineReport } from '../../../../data/lineReportsData';

/** หน่วยที่ยกเว้นไม่ต้องส่งรายงานโฆษก (ค่าเริ่มต้น: ทุกหน่วยในทะเบียนต้องส่ง) */
interface Exempt { id: string }

const UNITS = INITIAL_BPP_UNITS.map(u => u.id);

/** แปลงหน่วยที่บอทอ่านได้ -> หน่วยในทะเบียน (ร้อย ตชด.abc อยู่ใน กก.ตชด.ab) */
export function toRegisterUnit(unit?: string): string | null {
  if (!unit) return null;
  const m = unit.match(/^ร้อย ตชด\.(\d)(\d)\d$/);
  if (m) return `กก.ตชด.${m[1]}${m[2]}`;
  return UNITS.includes(unit) ? unit : null;
}

const pad = (n: number) => String(n).padStart(2, '0');
const dayKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const thaiLong = (key: string) => new Date(`${key}T12:00:00`).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
const hhmm = (iso: string) => new Date(iso).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));

export const SpokesDailyView: React.FC = () => {
  const { showToast } = useAdmin();
  const { reports, state } = useLineReports();
  const [exempt, setExempt] = useCollection<Exempt>('pr.spokes_exempt', 'id');
  const [day, setDay] = useState(dayKey(new Date()));
  const [group, setGroup] = useState<string>('auto');
  const [setup, setSetup] = useState(false);

  const groups = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of reports) m.set(r.groupName, (m.get(r.groupName) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [reports]);
  const spokesGroups = groups.filter(([g]) => /โฆษก/.test(g)).map(([g]) => g);
  const active = group === 'auto' ? spokesGroups : [group];

  const exemptIds = useMemo(() => new Set(exempt.map(e => e.id)), [exempt]);
  const expected = UNITS.filter(u => !exemptIds.has(u));

  const dayReports = useMemo(
    () => reports.filter(r => active.includes(r.groupName) && dayKey(new Date(r.receivedAt)) === day && r.messageType !== 'sticker').sort((a, b) => a.receivedAt.localeCompare(b.receivedAt)),
    [reports, active, day],
  );

  const byUnit = useMemo(() => {
    const m = new Map<string, LineReport[]>();
    const unknown: LineReport[] = [];
    for (const r of dayReports) {
      const u = toRegisterUnit(r.unit);
      if (u) m.set(u, [...(m.get(u) ?? []), r]);
      else unknown.push(r);
    }
    return { m, unknown };
  }, [dayReports]);

  const sent = expected.filter(u => byUnit.m.has(u));
  const missing = expected.filter(u => !byUnit.m.has(u));
  const extraSent = [...byUnit.m.keys()].filter(u => exemptIds.has(u));

  const shift = (n: number) => {
    const d = new Date(`${day}T12:00:00`);
    d.setDate(d.getDate() + n);
    setDay(dayKey(d));
  };

  const summaryText = (withContent: boolean) => {
    const lines = [
      `สรุปรายงานโฆษก ตชด. ประจำวันที่ ${thaiLong(day)}`,
      `ส่งรายงานแล้ว ${sent.length}/${expected.length} หน่วย`,
      '',
      `✅ ส่งแล้ว (${sent.length})`,
      ...sent.map(u => `- ${u} (${hhmm(byUnit.m.get(u)![0].receivedAt)} น.)`),
      '',
      `⏳ ยังไม่ส่ง (${missing.length})`,
      ...(missing.length ? missing.map(u => `- ${u}`) : ['- ไม่มี']),
    ];
    if (withContent) {
      lines.push('', '--- เนื้อหารายงาน ---');
      for (const r of dayReports) lines.push('', `[${toRegisterUnit(r.unit) ?? r.unit ?? 'ไม่ระบุหน่วย'}] ${r.senderName} ${hhmm(r.receivedAt)} น.`, r.text || `(${r.messageType === 'image' ? 'รูปภาพ' : r.messageType})`);
    }
    return lines.join('\n');
  };

  const copy = async (withContent: boolean) => {
    try {
      await navigator.clipboard.writeText(summaryText(withContent));
      showToast('คัดลอกสรุปแล้ว วางในไลน์ได้เลย', 'success');
    } catch {
      showToast('คัดลอกไม่สำเร็จ', 'error');
    }
  };

  const print = () => {
    const w = window.open('', '_blank');
    if (!w) return showToast('เบราว์เซอร์บล็อกหน้าต่างพิมพ์', 'error');
    const row = (u: string) => {
      const r = byUnit.m.get(u);
      return `<tr><td>${esc(u)}</td><td>${r ? 'ส่งแล้ว' : 'ยังไม่ส่ง'}</td><td>${r ? hhmm(r[0].receivedAt) + ' น.' : ''}</td><td>${r ? esc(r[0].senderName) : ''}</td></tr>`;
    };
    w.document.write(`<!doctype html><meta charset="utf-8"><title>รายงานโฆษก ${day}</title><style>body{font-family:'Sarabun','Tahoma',sans-serif;padding:24px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #444;padding:4px 8px;font-size:14px;text-align:left}h2{margin:0 0 4px}</style><h2>รายงานโฆษก ตชด. ประจำวันที่ ${thaiLong(day)}</h2><p>ส่งแล้ว ${sent.length}/${expected.length} หน่วย</p><table><tr><th>หน่วย</th><th>สถานะ</th><th>เวลา</th><th>ผู้ส่ง</th></tr>${expected.map(row).join('')}</table>`);
    w.document.close();
    w.print();
  };

  const toggleExempt = (u: string) => setExempt(prev => (prev.some(e => e.id === u) ? prev.filter(e => e.id !== u) : [...prev, { id: u }]));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2"><Megaphone className="w-5 h-5 text-blue-600" /> รายงานโฆษกประจำวัน</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">โฆษกแต่ละหน่วยรายงานทุกวัน 20.00 น. ในกลุ่ม LINE "ทีมโฆษก ตชด. 2026" · ระบบดึงจากบอทให้เอง</p>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => shift(-1)} aria-label="วันก่อนหน้า" className="p-2 rounded-xl border border-slate-300 dark:border-white/15 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
          <input type="date" value={day} onChange={e => e.target.value && setDay(e.target.value)} aria-label="วันที่" className="rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 px-3 py-2 text-sm font-semibold" />
          <button type="button" onClick={() => shift(1)} aria-label="วันถัดไป" className="p-2 rounded-xl border border-slate-300 dark:border-white/15 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      {state === 'ready' && active.length === 0 && (
        <div className="rounded-2xl border border-dashed border-blue-300 bg-blue-50/60 dark:bg-blue-500/10 p-5 text-sm text-slate-700 dark:text-slate-200 space-y-2">
          <div className="font-black flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> ยังไม่มีกลุ่ม "ทีมโฆษก" ส่งรายงานเข้ามา</div>
          <p>ให้แอดมินกลุ่ม LINE เชิญบอทเข้ากลุ่ม "ทีมโฆษก ตชด. 2026" ข้อความที่โฆษกส่งจะเข้าหน้านี้เอง (ชื่อกลุ่มมีคำว่า "โฆษก" ระบบจัดเข้างานประชาสัมพันธ์ให้อัตโนมัติ)</p>
          {groups.length > 0 && (
            <label className="block text-xs font-semibold">หรือเลือกกลุ่มที่มีอยู่แล้ว
              <select value={group} onChange={e => setGroup(e.target.value)} className="mt-1 w-full sm:w-80 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
                <option value="auto">— ยังไม่เลือก —</option>
                {groups.map(([g, n]) => <option key={g} value={g}>{g} ({n})</option>)}
              </select>
            </label>
          )}
        </div>
      )}

      {active.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 p-3"><div className="text-2xl font-black text-emerald-600">{sent.length}</div><div className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">ส่งแล้ว</div></div>
            <div className="rounded-2xl bg-amber-50 dark:bg-amber-500/10 p-3"><div className="text-2xl font-black text-amber-600">{missing.length}</div><div className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">ยังไม่ส่ง</div></div>
            <div className="rounded-2xl bg-slate-100 dark:bg-white/5 p-3"><div className="text-2xl font-black text-slate-700 dark:text-white">{expected.length}</div><div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">หน่วยที่ต้องส่ง</div></div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void copy(false)} className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white cursor-pointer"><Copy className="w-4 h-4" /> คัดลอกสรุป</button>
            <button type="button" onClick={() => void copy(true)} className="inline-flex items-center gap-1.5 rounded-xl border border-blue-600 px-4 py-2 text-sm font-bold text-blue-600 cursor-pointer"><Copy className="w-4 h-4" /> คัดลอกพร้อมเนื้อหา</button>
            <button type="button" onClick={print} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-white/15 px-4 py-2 text-sm font-semibold cursor-pointer"><Printer className="w-4 h-4" /> พิมพ์</button>
            <button type="button" onClick={() => setSetup(v => !v)} aria-expanded={setup} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"><Settings2 className="w-4 h-4" /> ตั้งค่าหน่วยที่ต้องส่ง</button>
          </div>

          {setup && (
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-3">
              <p className="text-xs text-slate-500 mb-2">ติ๊กหน่วยที่ต้องส่งรายงานโฆษก (เอาติ๊กออกถ้าหน่วยนั้นไม่มีโฆษก)</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
                {UNITS.map(u => (
                  <label key={u} className="flex items-center gap-2 text-xs rounded-lg px-2 py-1 hover:bg-slate-50 dark:hover:bg-white/5">
                    <input type="checkbox" checked={!exemptIds.has(u)} onChange={() => toggleExempt(u)} /> {u}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-3 lg:grid-cols-2">
            <section className="rounded-2xl border border-emerald-200 dark:border-emerald-500/20 p-3">
              <h3 className="mb-2 text-sm font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5"><Check className="w-4 h-4" /> ส่งแล้ว ({sent.length})</h3>
              {sent.length === 0 ? <div className="text-sm text-slate-400 py-4 text-center">ยังไม่มีหน่วยส่ง</div> : (
                <ul className="space-y-2">
                  {sent.map(u => {
                    const rs = byUnit.m.get(u)!;
                    return (
                      <li key={u} className="rounded-xl bg-white dark:bg-[#161B26] border border-slate-200/70 dark:border-white/10 p-2.5">
                        <div className="flex items-center justify-between gap-2 text-sm"><span className="font-black text-slate-900 dark:text-white">{u}</span><span className="text-[11px] text-slate-500">{hhmm(rs[0].receivedAt)} น. · {rs[0].senderName}</span></div>
                        {rs.map(r => (
                          <p key={r.id} className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-3 whitespace-pre-line">
                            {r.text || (r.imageCount ? <span className="inline-flex items-center gap-1"><ImageIcon className="w-3 h-3" /> รูปภาพ {r.imageCount}</span> : '')}
                          </p>
                        ))}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
            <section className="rounded-2xl border border-amber-200 dark:border-amber-500/20 p-3">
              <h3 className="mb-2 text-sm font-black text-amber-700 dark:text-amber-300 flex items-center gap-1.5"><Clock className="w-4 h-4" /> ยังไม่ส่ง ({missing.length})</h3>
              {missing.length === 0 ? <div className="text-sm text-emerald-600 py-4 text-center font-semibold">ส่งครบทุกหน่วยแล้ว 🎉</div> : (
                <div className="flex flex-wrap gap-1.5">{missing.map(u => <span key={u} className="rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-900 dark:text-amber-200 px-3 py-1 text-xs font-bold">{u}</span>)}</div>
              )}
              {extraSent.length > 0 && <p className="mt-3 text-[11px] text-slate-500">หน่วยที่ยกเว้นแต่ส่งมา: {extraSent.join(', ')}</p>}
            </section>
          </div>

          {byUnit.unknown.length > 0 && (
            <section className="rounded-2xl border border-slate-200 dark:border-white/10 p-3">
              <h3 className="mb-1 text-sm font-black text-slate-700 dark:text-slate-200">ข้อความที่ระบุหน่วยไม่ได้ ({byUnit.unknown.length})</h3>
              <p className="text-[11px] text-slate-500 mb-2">ระบบไม่พบชื่อหน่วยในข้อความ ตรวจดูและนับให้ด้วยตัวเอง</p>
              <ul className="space-y-1.5">
                {byUnit.unknown.map(r => (
                  <li key={r.id} className="text-xs rounded-lg bg-slate-50 dark:bg-white/5 p-2"><b>{r.senderName}</b> · {hhmm(r.receivedAt)} น.<div className="text-slate-600 dark:text-slate-300 line-clamp-2 whitespace-pre-line">{r.text}</div></li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
};
