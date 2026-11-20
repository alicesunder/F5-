import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Pencil, Image as ImageIcon, X, Download, Trash2, Loader2, Users, Truck, Ship } from 'lucide-react';
import { useAdmin } from '../../../contexts/AdminContext';
import { DEPT_THEME } from '../../../components/layout/DepartmentShell';
import { useCollection } from '../../../lib/collections';
import { AidData, StatusData, drawAidInfographic, drawStatusInfographic, downloadBlob } from '../utils/aidInfographic';

export interface StatusRec extends StatusData {
  id: string;
  updatedAt: string;
}
export interface AidRec extends AidData {
  id: string;
  start: string;
  end: string;
  createdAt: string;
}

const t = DEPT_THEME.disaster;
const field = 'w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-white';
const lbl = 'block text-xs font-semibold text-slate-600 dark:text-slate-300';
const num = (v: string) => Math.max(0, Math.floor(Number(v) || 0));
const nf = (v: number) => v.toLocaleString('en-US');
const newId = () => `aid-${Date.now().toString(36)}`;

export const Modal: React.FC<{ title: string; onClose: () => void; wide?: boolean; children: React.ReactNode }> = ({ title, onClose, wide, children }) =>
  createPortal(
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-label={title}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0 }} className="bg-slate-950/50 backdrop-blur-sm" />
      <div className={`relative w-full ${wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'} max-h-[94vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#11141D] shadow-2xl p-5`}>
        <div style={{ position: 'absolute', right: 12, top: 12 }}>
          <button type="button" onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer" aria-label="ปิด"><X className="w-5 h-5" /></button>
        </div>
        <h2 className="text-lg font-black text-slate-900 dark:text-white mb-3 pr-8">{title}</h2>
        {children}
      </div>
    </div>,
    document.body,
  );

/** แสดงตัวอย่างอินโฟกราฟิกก่อนดาวน์โหลด */
const Preview: React.FC<{ make: () => Promise<Blob>; name: string; onClose: () => void }> = ({ make, name, onClose }) => {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [url, setUrl] = useState('');
  const [err, setErr] = useState('');
  useEffect(() => {
    let u = '';
    make().then(b => { setBlob(b); u = URL.createObjectURL(b); setUrl(u); }).catch(e => setErr(String(e.message || e)));
    return () => { if (u) URL.revokeObjectURL(u); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Modal title="อินโฟกราฟิก" onClose={onClose}>
      {err ? <div className="text-sm text-rose-600">{err}</div> : !url ? <div className="py-10 text-center text-sm text-slate-500"><Loader2 className="w-5 h-5 animate-spin inline mr-2" />กำลังสร้างภาพ...</div> : (
        <>
          <img src={url} alt="อินโฟกราฟิก" className="w-full rounded-2xl border border-slate-200" />
          <button type="button" onClick={() => blob && downloadBlob(blob, name)} className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white cursor-pointer" style={{ background: t.gradient }}><Download className="w-4 h-4" /> ดาวน์โหลด PNG (ส่งไลน์/โพสต์ได้เลย)</button>
        </>
      )}
    </Modal>
  );
};

const Stat: React.FC<{ v: number | null; unit: string; label: string }> = ({ v, unit, label }) => (
  <div className="rounded-2xl p-3" style={{ background: t.soft }}>
    <div className="text-2xl font-black" style={{ color: t.color }}>{v === null ? '-' : nf(v)} <span className="text-xs font-semibold text-slate-500">{unit}</span></div>
    <div className="text-[11px] font-semibold" style={{ color: t.text }}>{label}</div>
  </div>
);

// ---------- สถานภาพกำลังพล/ยานพาหนะ ----------

const StatusForm: React.FC<{ rec: StatusRec; onClose: () => void; onSave: (r: StatusRec) => Promise<boolean> }> = ({ rec, onClose, onSave }) => {
  const [f, setF] = useState(rec);
  const [busy, setBusy] = useState(false);
  const setV = (i: number, p: Partial<StatusRec['vehicles'][number]>) => setF(o => ({ ...o, vehicles: o.vehicles.map((v, k) => (k === i ? { ...v, ...p } : v)) }));
  return (
    <Modal title="แก้ไขสถานภาพกำลังพล ยานพาหนะ" onClose={onClose} wide>
      <form className="space-y-3" onSubmit={async e => { e.preventDefault(); setBusy(true); const ok = await onSave({ ...f, updatedAt: new Date().toISOString() }); setBusy(false); if (ok) onClose(); }}>
        <div className="grid grid-cols-3 gap-2">
          <label className={lbl}>ป้ายกำกับ (เช่น 2569)<input className={field} value={f.label} onChange={e => setF({ ...f, label: e.target.value })} /></label>
          <label className={lbl}>ชุดเผชิญเหตุ<input className={field} type="number" min={0} value={f.crews} onChange={e => setF({ ...f, crews: num(e.target.value) })} /></label>
          <label className={lbl}>จำนวนคน<input className={field} type="number" min={0} value={f.people} onChange={e => setF({ ...f, people: num(e.target.value) })} /></label>
        </div>
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">ยานพาหนะ</div>
          {f.vehicles.map((v, i) => (
            <div key={i} className="grid grid-cols-[6rem_1fr_5rem_4rem_2rem] gap-1.5 items-center">
              <input className={field} aria-label="กลุ่ม" value={v.group} onChange={e => setV(i, { group: e.target.value })} />
              <input className={field} aria-label="ชนิด" value={v.name} onChange={e => setV(i, { name: e.target.value })} />
              <input className={field} aria-label="จำนวน" type="number" min={0} value={v.count} onChange={e => setV(i, { count: num(e.target.value) })} />
              <input className={field} aria-label="หน่วยนับ" value={v.unit} onChange={e => setV(i, { unit: e.target.value })} />
              <button type="button" aria-label="ลบแถว" onClick={() => setF(o => ({ ...o, vehicles: o.vehicles.filter((_, k) => k !== i) }))} className="text-rose-500 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <button type="button" onClick={() => setF(o => ({ ...o, vehicles: [...o.vehicles, { group: o.vehicles[o.vehicles.length - 1]?.group ?? 'รถยนต์', name: '', count: 0, unit: 'คัน' }] }))} className="text-sm font-semibold cursor-pointer" style={{ color: t.color }}>+ เพิ่มชนิดยานพาหนะ</button>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer">ยกเลิก</button>
          <button type="submit" disabled={busy} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-50 cursor-pointer" style={{ background: t.gradient }}>{busy && <Loader2 className="w-4 h-4 animate-spin" />} บันทึก</button>
        </div>
      </form>
    </Modal>
  );
};

// ---------- ผลการช่วยเหลือ ----------

const AidForm: React.FC<{ rec: AidRec; isNew: boolean; onClose: () => void; onSave: (r: AidRec) => Promise<boolean>; onDelete: (r: AidRec) => Promise<void> }> = ({ rec, isNew, onClose, onSave, onDelete }) => {
  const [f, setF] = useState(rec);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof AidRec>(k: K, v: AidRec[K]) => setF(o => ({ ...o, [k]: v }));
  return (
    <Modal title={isNew ? 'เพิ่มผลการช่วยเหลือประชาชน' : 'แก้ไขผลการช่วยเหลือ'} onClose={onClose} wide>
      <form className="space-y-3" onSubmit={async e => { e.preventDefault(); setBusy(true); const ok = await onSave(f); setBusy(false); if (ok) onClose(); }}>
        <label className={lbl}>ช่วงเวลา/ชื่อเหตุการณ์ (แสดงบนภาพ เช่น 23 ก.ย.-29 ต.ค.69) *<input className={field} value={f.label} onChange={e => set('label', e.target.value)} required /></label>
        <div className="grid grid-cols-2 gap-2">
          <label className={lbl}>ครัวเรือนที่ช่วยเหลือ<input className={field} type="number" min={0} value={f.households} onChange={e => set('households', num(e.target.value))} /></label>
          <label className={lbl}>ประชาชน (คน)<input className={field} type="number" min={0} value={f.people} onChange={e => set('people', num(e.target.value))} /></label>
          <label className={lbl}>ชุดที่ปฏิบัติ<input className={field} type="number" min={0} value={f.teams} onChange={e => set('teams', num(e.target.value))} /></label>
          <label className={lbl}>กำลังพล (นาย)<input className={field} type="number" min={0} value={f.personnel} onChange={e => set('personnel', num(e.target.value))} /></label>
        </div>
        <label className={lbl}>ภารกิจ (บรรทัดละข้อ)<textarea className={field} rows={4} value={f.missions} onChange={e => set('missions', e.target.value)} /></label>
        <label className={lbl}>พื้นที่ที่ได้รับการช่วยเหลือ<textarea className={field} rows={2} value={f.areas} onChange={e => set('areas', e.target.value)} /></label>
        <label className={lbl}>ยานพาหนะที่ใช้<input className={field} value={f.vehicles} onChange={e => set('vehicles', e.target.value)} placeholder="รถยนต์สี่ล้อ, รถบรรทุก 6 ล้อ, เรือท้องแบน" /></label>
        <label className={lbl}>ความเสียหายของหน่วย<input className={field} value={f.damage} onChange={e => set('damage', e.target.value)} /></label>
        <label className={lbl}>กำลังพลบาดเจ็บ (นาย) — เว้นว่างถ้ายังไม่มีข้อมูล<input className={field} type="number" min={0} value={f.injured ?? ''} onChange={e => set('injured', e.target.value === '' ? null : num(e.target.value))} /></label>
        <div className="flex items-center justify-between pt-2">
          {!isNew ? <button type="button" disabled={busy} onClick={async () => { if (!window.confirm('ลบรายการนี้?')) return; setBusy(true); await onDelete(rec); setBusy(false); onClose(); }} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"><Trash2 className="w-4 h-4" /> ลบ</button> : <span />}
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer">ยกเลิก</button>
            <button type="submit" disabled={busy || !f.label.trim()} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-50 cursor-pointer" style={{ background: t.gradient }}>{busy && <Loader2 className="w-4 h-4 animate-spin" />} บันทึก</button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export const AidSummaryView: React.FC = () => {
  const { showToast } = useAdmin();
  const [status, setStatus, sState] = useCollection<StatusRec>('dev.status', 'id');
  const [aids, setAids, aState] = useCollection<AidRec>('dev.aid', 'id');
  const [editStatus, setEditStatus] = useState(false);
  const [editAid, setEditAid] = useState<{ rec: AidRec; isNew: boolean } | null>(null);
  const [preview, setPreview] = useState<{ make: () => Promise<Blob>; name: string } | null>(null);
  const cur = status[0];
  const sortedAids = [...aids].sort((a, b) => (b.end || b.createdAt).localeCompare(a.end || a.createdAt));
  const totalPeople = aids.reduce((s, a) => s + a.people, 0);
  const totalHouse = aids.reduce((s, a) => s + a.households, 0);

  const saveStatus = async (r: StatusRec) => {
    const ok = await setStatus(prev => (prev.some(x => x.id === r.id) ? prev.map(x => (x.id === r.id ? r : x)) : [r, ...prev]));
    if (ok) showToast('บันทึกแล้ว', 'success');
    return ok;
  };
  const saveAid = async (r: AidRec) => {
    const ok = await setAids(prev => (prev.some(x => x.id === r.id) ? prev.map(x => (x.id === r.id ? r : x)) : [r, ...prev]));
    if (ok) showToast('บันทึกแล้ว', 'success');
    return ok;
  };
  const delAid = async (r: AidRec) => {
    if (await setAids(prev => prev.filter(x => x.id !== r.id))) showToast('ลบแล้ว', 'success');
  };
  const blankStatus = (): StatusRec => ({ id: 'main', label: String(new Date().getFullYear() + 543), crews: 0, people: 0, vehicles: [{ group: 'รถยนต์', name: '', count: 0, unit: 'คัน' }], updatedAt: new Date().toISOString() });
  const blankAid = (): AidRec => ({ id: newId(), label: '', start: '', end: '', households: 0, people: 0, teams: 0, personnel: 0, missions: '', areas: '', vehicles: '', damage: '', injured: null, createdAt: new Date().toISOString() });

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2"><Users className="w-5 h-5" style={{ color: t.color }} /> สถานภาพกำลังพลและยานพาหนะ</h2>
          <div className="flex gap-2">
            <button type="button" onClick={() => setEditStatus(true)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-white/15 px-3 py-2 text-sm font-semibold cursor-pointer"><Pencil className="w-4 h-4" /> {cur ? 'แก้ไข' : 'กรอกข้อมูล'}</button>
            {cur && <button type="button" onClick={() => setPreview({ make: () => drawStatusInfographic(cur), name: `สถานภาพกำลังพล-ยานพาหนะ-${cur.label}.png` })} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold text-white cursor-pointer" style={{ background: t.gradient }}><ImageIcon className="w-4 h-4" /> สร้างอินโฟกราฟิก</button>}
          </div>
        </div>
        {sState.status === 'ready' && !cur && <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/15 p-6 text-center text-sm text-slate-500">ยังไม่มีข้อมูล กด "กรอกข้อมูล" เพื่อเริ่ม</div>}
        {cur && (
          <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#161B26] p-4 space-y-3">
            <div className="grid grid-cols-2 gap-2"><Stat v={cur.crews} unit="ชุด" label={`ชุดเผชิญเหตุสาธารณภัย (${cur.label})`} /><Stat v={cur.people} unit="คน" label="กำลังพลในชุดเผชิญเหตุ" /></div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[...new Set<string>(cur.vehicles.map(v => v.group))].map(g => (
                <div key={g}>
                  <div className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">{/เรือ/.test(g) ? <Ship className="w-4 h-4" /> : <Truck className="w-4 h-4" />} {g}</div>
                  <ul className="mt-1 text-sm divide-y divide-slate-100 dark:divide-white/5">
                    {cur.vehicles.filter(v => v.group === g).map((v, i) => <li key={i} className="flex justify-between py-1"><span className="text-slate-600 dark:text-slate-300">{v.name}</span><b>{nf(v.count)} {v.unit}</b></li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">ผลการช่วยเหลือประชาชน</h2>
            {aids.length > 1 && <p className="text-xs text-slate-500">รวมทุกช่วง {nf(totalHouse)} ครัวเรือน · {nf(totalPeople)} คน</p>}
          </div>
          <button type="button" onClick={() => setEditAid({ rec: blankAid(), isNew: true })} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white cursor-pointer" style={{ background: t.gradient }}><Plus className="w-4 h-4" /> เพิ่มผลการช่วยเหลือ</button>
        </div>
        {aState.status === 'ready' && aids.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/15 p-6 text-center text-sm text-slate-500">ยังไม่มีข้อมูล</div>}
        <div className="grid gap-3 lg:grid-cols-2">
          {sortedAids.map(a => (
            <article key={a.id} className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#161B26] p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">{a.label}</h3>
                <div className="flex gap-1 shrink-0">
                  <button type="button" onClick={() => setEditAid({ rec: a, isNew: false })} aria-label="แก้ไข" className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"><Pencil className="w-4 h-4" /></button>
                  <button type="button" onClick={() => setPreview({ make: () => drawAidInfographic(a), name: `ผลการช่วยเหลือประชาชน-${a.label}.png` })} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white cursor-pointer" style={{ background: t.color }}><ImageIcon className="w-3.5 h-3.5" /> อินโฟกราฟิก</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2"><Stat v={a.households} unit="ครัวเรือน" label="ช่วยเหลือสะสม" /><Stat v={a.people} unit="คน" label="ประชาชน" /><Stat v={a.teams} unit="ชุด" label="ที่ปฏิบัติ" /><Stat v={a.personnel} unit="นาย" label="กำลังพล" /></div>
              {a.areas && <p className="text-xs text-slate-600 dark:text-slate-300"><b>พื้นที่:</b> {a.areas}</p>}
              {a.damage && <p className="text-xs text-slate-600 dark:text-slate-300"><b>ความเสียหายของหน่วย:</b> {a.damage}{a.injured !== null ? ` · บาดเจ็บ ${a.injured} นาย` : ''}</p>}
            </article>
          ))}
        </div>
      </section>

      {editStatus && <StatusForm rec={cur ?? blankStatus()} onClose={() => setEditStatus(false)} onSave={saveStatus} />}
      {editAid && <AidForm key={editAid.rec.id} rec={editAid.rec} isNew={editAid.isNew} onClose={() => setEditAid(null)} onSave={saveAid} onDelete={delAid} />}
      {preview && <Preview make={preview.make} name={preview.name} onClose={() => setPreview(null)} />}
    </div>
  );
};
