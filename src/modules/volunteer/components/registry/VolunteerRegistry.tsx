import React, { useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { UserPlus, Upload, Download, Search, X, Trash2, Loader2, GraduationCap, HandHeart } from 'lucide-react';
import { useAdmin } from '../../../../contexts/AdminContext';
import { DEPT_THEME } from '../../../../components/layout/DepartmentShell';
import { useCollection } from '../../../../lib/collections';

/**
 * ทะเบียนสำหรับรายงานวงรอบ 4 เดือน (2 บัญชี)
 *  1) ข้าราชการตำรวจที่สมัครเป็นประชาชนจิตอาสา
 *  2) ข้าราชการตำรวจที่ผ่านการอบรมหลักสูตรจิตอาสา 904
 */
type Kind = 'applicant' | 'course904';
interface Member {
  id: string;
  kind: Kind;
  rank: string;
  name: string;
  /** หน่วย/ตำแหน่ง */
  unit: string;
  /** รุ่น/หลักสูตร (ใช้กับ 904) */
  course: string;
  /** วันที่สมัคร/ผ่านการอบรม YYYY-MM-DD */
  date: string;
  note: string;
  createdAt: string;
}

const KINDS: Record<Kind, { label: string; list: string; icon: React.ElementType }> = {
  applicant: { label: 'สมัครเป็นประชาชนจิตอาสา', list: 'บัญชีรายชื่อข้าราชการตำรวจที่สมัครเป็นประชาชนจิตอาสา', icon: HandHeart },
  course904: { label: 'ผ่านหลักสูตร 904', list: 'บัญชีข้าราชการตำรวจที่ผ่านการอบรมหลักสูตรจิตอาสา 904', icon: GraduationCap },
};

const field = 'w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-white';
const lbl = 'block text-xs font-semibold text-slate-600 dark:text-slate-300';
const newId = () => `vm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
const HEAD = ['ลำดับ', 'ยศ', 'ชื่อ-สกุล', 'หน่วย/ตำแหน่ง', 'รุ่น/หลักสูตร', 'วันที่', 'หมายเหตุ'];

const cellText = (v: unknown): string => {
  if (v == null) return '';
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === 'object') {
    const o = v as { text?: string; richText?: { text: string }[]; result?: unknown };
    return o.richText ? o.richText.map(x => x.text).join('') : String(o.text ?? o.result ?? '');
  }
  return String(v).trim();
};

/** ยศที่ขึ้นต้นชื่อ (กรณีไฟล์รวมยศไว้ในช่องชื่อ) */
const RANK_RE = /^((?:พล\.ต\.[อทต]\.|พ\.ต\.[อทต]\.|ร\.ต\.[อทต]\.|ด\.ต\.|จ\.ส\.ต\.|ส\.ต\.[อทต]\.|ส\.ต\.|ว่าที่ ?[^\s]+)(?:หญิง)?)\s*/;

async function readExcel(file: File, kind: Kind): Promise<Member[]> {
  const ExcelJS = (await import('exceljs')).default;
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(await file.arrayBuffer());
  // ไฟล์ที่ส่งออกจากหน้านี้มี 2 ชีต: เลือกชีตตามบัญชีที่เปิดอยู่ ถ้าไม่พบชื่อตรงให้ใช้ชีตแรก
  const ws = wb.worksheets.find(w => w.name === KINDS[kind].label.slice(0, 31)) ?? wb.worksheets[0];
  const col: Record<string, number> = {};
  let headRow = 0;
  ws.eachRow((row, n) => {
    if (headRow) return;
    const found: Record<string, number> = {};
    row.eachCell((c, i) => {
      const t = cellText(c.value).replace(/\s/g, '');
      if (/^ยศ$/.test(t)) found.rank = i;
      else if (/^(ชื่อ|ชื่อ-?สกุล|ชื่อ-?นามสกุล|ชื่อสกุล)$/.test(t)) found.name = i;
      else if (/หน่วย|สังกัด|ตำแหน่ง/.test(t)) found.unit = found.unit ?? i;
      else if (/รุ่น|หลักสูตร/.test(t)) found.course = i;
      else if (/วันที่|วัน/.test(t)) found.date = i;
      else if (/หมายเหตุ/.test(t)) found.note = i;
    });
    if (found.name) {
      headRow = n;
      Object.assign(col, found);
    }
  });
  if (!headRow) throw new Error('ไม่พบหัวตารางที่มีคอลัมน์ "ชื่อ-สกุล" ในแถวใดเลย');
  const out: Member[] = [];
  ws.eachRow((row, n) => {
    if (n <= headRow) return;
    let name = cellText(row.getCell(col.name).value);
    if (!name) return;
    let rank = col.rank ? cellText(row.getCell(col.rank).value) : '';
    if (!rank) {
      const m = name.match(RANK_RE);
      if (m) {
        rank = m[1];
        name = name.slice(m[0].length);
      }
    }
    const d = col.date ? row.getCell(col.date).value : null;
    out.push({
      id: newId(),
      kind,
      rank,
      name,
      unit: col.unit ? cellText(row.getCell(col.unit).value) : '',
      course: col.course ? cellText(row.getCell(col.course).value) : '',
      date: d instanceof Date ? d.toISOString().slice(0, 10) : typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : '',
      note: col.note ? cellText(row.getCell(col.note).value) : '',
      createdAt: new Date().toISOString(),
    });
  });
  return out;
}

async function writeExcel(rows: Member[]) {
  const ExcelJS = (await import('exceljs')).default;
  const wb = new ExcelJS.Workbook();
  (['applicant', 'course904'] as Kind[]).forEach(k => {
    const ws = wb.addWorksheet(KINDS[k].label.slice(0, 31));
    ws.columns = [8, 16, 28, 34, 16, 14, 24].map(width => ({ width }));
    ws.mergeCells('A1:G1');
    ws.getCell('A1').value = KINDS[k].list;
    ws.getCell('A1').font = { bold: true, size: 14 };
    ws.getCell('A1').alignment = { horizontal: 'center' };
    const head = ws.getRow(3);
    head.values = HEAD;
    head.font = { bold: true };
    rows
      .filter(r => r.kind === k)
      .forEach((r, i) => {
        ws.getRow(4 + i).values = [i + 1, r.rank, r.name, r.unit, r.course, r.date ? new Date(`${r.date}T00:00:00Z`) : '', r.note];
        ws.getRow(4 + i).getCell(6).numFmt = 'd/m/yyyy';
      });
  });
  const buf = await wb.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ทะเบียนจิตอาสา-รายงาน4เดือน.xlsx';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

const Dialog: React.FC<{ m: Member; isNew: boolean; onClose: () => void; onSave: (m: Member) => Promise<boolean>; onDelete: (m: Member) => Promise<void> }> = ({ m, isNew, onClose, onSave, onDelete }) => {
  const [f, setF] = useState(m);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Member>(k: K, v: Member[K]) => setF(o => ({ ...o, [k]: v }));
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-label={isNew ? 'เพิ่มรายชื่อ' : 'แก้ไขรายชื่อ'}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0 }} className="bg-slate-950/50 backdrop-blur-sm" />
      <form
        className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#11141D] shadow-2xl p-5 space-y-3"
        onSubmit={async e => {
          e.preventDefault();
          setBusy(true);
          const ok = await onSave({ ...f, name: f.name.trim() });
          setBusy(false);
          if (ok) onClose();
        }}
      >
        <div style={{ position: 'absolute', right: 12, top: 12 }}>
          <button type="button" onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer" aria-label="ปิด"><X className="w-5 h-5" /></button>
        </div>
        <h2 className="text-lg font-black text-slate-900 dark:text-white">{isNew ? 'เพิ่มรายชื่อ' : 'แก้ไขรายชื่อ'} · {KINDS[f.kind].label}</h2>
        <div className="grid grid-cols-3 gap-2">
          <label className={lbl}>ยศ<input className={field} value={f.rank} onChange={e => set('rank', e.target.value)} /></label>
          <label className={`${lbl} col-span-2`}>ชื่อ-สกุล *<input className={field} value={f.name} onChange={e => set('name', e.target.value)} required autoFocus={isNew} /></label>
        </div>
        <label className={lbl}>หน่วย/ตำแหน่ง<input className={field} value={f.unit} onChange={e => set('unit', e.target.value)} /></label>
        <div className="grid grid-cols-2 gap-2">
          <label className={lbl}>{f.kind === 'course904' ? 'รุ่น/หลักสูตร' : 'หมายเหตุสมัคร'}<input className={field} value={f.course} onChange={e => set('course', e.target.value)} /></label>
          <label className={lbl}>{f.kind === 'course904' ? 'วันที่ผ่านการอบรม' : 'วันที่สมัคร'}<input className={field} type="date" value={f.date} onChange={e => set('date', e.target.value)} /></label>
        </div>
        <label className={lbl}>หมายเหตุ<input className={field} value={f.note} onChange={e => set('note', e.target.value)} /></label>
        <div className="flex items-center justify-between pt-1">
          {!isNew ? (
            <button type="button" disabled={busy} onClick={async () => { if (!window.confirm('ลบรายชื่อนี้?')) return; setBusy(true); await onDelete(m); setBusy(false); onClose(); }} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"><Trash2 className="w-4 h-4" /> ลบ</button>
          ) : <span />}
          <button type="submit" disabled={busy || !f.name.trim()} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-50 cursor-pointer" style={{ background: DEPT_THEME.volunteer.color }}>
            {busy && <Loader2 className="w-4 h-4 animate-spin" />} บันทึก
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
};

export const VolunteerRegistry: React.FC = () => {
  const { showToast } = useAdmin();
  const t = DEPT_THEME.volunteer;
  const [rows, setRows, state] = useCollection<Member>('vol.registry', 'id');
  const [kind, setKind] = useState<Kind>('course904');
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState<{ m: Member; isNew: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter(r => r.kind === kind && (!s || `${r.rank} ${r.name} ${r.unit} ${r.course} ${r.note}`.toLowerCase().includes(s))).sort((a, b) => a.name.localeCompare(b.name, 'th'));
  }, [rows, kind, q]);
  const count = (k: Kind) => rows.filter(r => r.kind === k).length;

  const blank = (): Member => ({ id: newId(), kind, rank: '', name: '', unit: '', course: '', date: '', note: '', createdAt: new Date().toISOString() });
  const save = async (m: Member) => {
    const ok = await setRows(prev => (prev.some(x => x.id === m.id) ? prev.map(x => (x.id === m.id ? m : x)) : [m, ...prev]));
    if (ok) showToast('บันทึกแล้ว', 'success');
    return ok;
  };
  const remove = async (m: Member) => {
    if (await setRows(prev => prev.filter(x => x.id !== m.id))) showToast('ลบแล้ว', 'success');
  };
  const onImport = async (file: File) => {
    setBusy(true);
    try {
      const got = await readExcel(file, kind);
      const key = (r: Member) => `${r.kind}|${r.rank}|${r.name}`;
      const have = new Set(rows.map(key));
      const fresh = got.filter(r => !have.has(key(r)));
      if (!fresh.length) showToast(`ไม่มีรายชื่อใหม่ (พบ ${got.length} รายชื่อ ซ้ำกับที่มีอยู่ทั้งหมด)`, 'info');
      else if (window.confirm(`นำเข้า ${fresh.length} รายชื่อเข้าบัญชี "${KINDS[kind].label}"${got.length - fresh.length ? ` (ข้ามที่ซ้ำ ${got.length - fresh.length})` : ''}`)) {
        if (await setRows(prev => [...fresh, ...prev])) showToast(`นำเข้า ${fresh.length} รายชื่อแล้ว`, 'success');
      }
    } catch (e) {
      showToast(`อ่านไฟล์ไม่สำเร็จ: ${(e as Error).message}`, 'error');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">ทะเบียนจิตอาสาและผู้ผ่านหลักสูตร 904</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">ใช้ออกบัญชีส่งในรายงานวงรอบ 4 เดือน · กดส่งออก Excel แล้วได้ทั้ง 2 บัญชี</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input ref={fileRef} type="file" accept=".xlsx" className="sr-only" onChange={e => e.target.files?.[0] && void onImport(e.target.files[0])} />
          <button type="button" disabled={busy} onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-white/15 px-3 py-2 text-sm font-semibold cursor-pointer disabled:opacity-50"><Upload className="w-4 h-4" /> นำเข้า Excel</button>
          <button type="button" disabled={busy || !rows.length} onClick={async () => { setBusy(true); try { await writeExcel(rows); } finally { setBusy(false); } }} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-white/15 px-3 py-2 text-sm font-semibold cursor-pointer disabled:opacity-50"><Download className="w-4 h-4" /> ส่งออก Excel</button>
          <button type="button" onClick={() => setEdit({ m: blank(), isNew: true })} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white cursor-pointer" style={{ background: t.gradient }}><UserPlus className="w-4 h-4" /> เพิ่มรายชื่อ</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2" role="tablist">
        {(Object.keys(KINDS) as Kind[]).map(k => {
          const on = kind === k;
          const Icon = KINDS[k].icon;
          return (
            <button key={k} type="button" role="tab" aria-selected={on} onClick={() => setKind(k)} className="rounded-2xl border-2 p-3 text-left cursor-pointer" style={on ? { borderColor: t.color, background: t.soft } : { borderColor: '#E2E8F0' }}>
              <div className="flex items-center gap-2 text-sm font-black" style={{ color: on ? t.text : '#475569' }}><Icon className="w-4 h-4" /> {KINDS[k].label}</div>
              <div className="text-2xl font-black" style={{ color: t.color }}>{count(k)} <span className="text-xs font-semibold text-slate-500">นาย</span></div>
            </button>
          );
        })}
      </div>

      <label className="relative block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="ค้นหาชื่อ หน่วย หรือรุ่น" aria-label="ค้นหารายชื่อ" className={`${field} pl-9`} />
      </label>

      {state.status === 'loading' && rows.length === 0 && <div role="status" className="py-6 text-center text-sm text-slate-500"><Loader2 className="w-5 h-5 animate-spin inline mr-2" />กำลังโหลด...</div>}
      {state.status === 'ready' && list.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/15 p-8 text-center text-sm text-slate-500">
          {rows.some(r => r.kind === kind) ? 'ไม่พบตามคำค้น' : `ยังไม่มีรายชื่อใน "${KINDS[kind].label}" กด "เพิ่มรายชื่อ" หรือ "นำเข้า Excel" (ไฟล์ต้องมีหัวตารางคอลัมน์ "ชื่อ-สกุล" และถ้ามี ยศ / หน่วย / รุ่น / วันที่ จะอ่านให้ด้วย)`}
        </div>
      )}
      {list.length > 0 && (
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {list.map(m => (
            <li key={m.id}>
              <button type="button" onClick={() => setEdit({ m, isNew: false })} className="w-full text-left rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#161B26] p-3 cursor-pointer hover:shadow-md">
                <div className="text-sm font-bold text-slate-900 dark:text-white"><span className="text-slate-500 font-semibold">{m.rank}</span> {m.name}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">{[m.unit, m.course, m.date].filter(Boolean).join(' · ') || '—'}</div>
              </button>
            </li>
          ))}
        </ul>
      )}
      {edit && <Dialog key={edit.m.id} m={edit.m} isNew={edit.isNew} onClose={() => setEdit(null)} onSave={save} onDelete={remove} />}
    </div>
  );
};
