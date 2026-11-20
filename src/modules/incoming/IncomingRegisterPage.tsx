import React, { useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Inbox, Plus, Search, Download, Upload, X, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { DEPT_THEME } from '../../components/layout/DepartmentShell';
import {
  IncomingRecord,
  useIncomingRegister,
  DEFAULT_ACTIONS,
  deptOfAction,
  splitActions,
  newId,
  thaiShort,
  suspiciousDate,
  todayIso,
  exportRegister,
  importRegister,
} from './incomingRegister';

type Dept = 'admin' | 'relations' | 'disaster' | 'volunteer';

const field = 'w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-white';
const label = 'block text-xs font-semibold text-slate-600 dark:text-slate-300';

const ActionChip: React.FC<{ code: string }> = ({ code }) => {
  const d = deptOfAction(code);
  const c = d ? DEPT_THEME[d] : null;
  return (
    <span className="inline-block rounded-full px-2 py-0.5 text-[11px] font-bold mr-1" style={c ? { background: c.soft, color: c.text } : { background: '#F1F5F9', color: '#475569' }}>
      {code}
    </span>
  );
};

const DateCell: React.FC<{ iso: string }> = ({ iso }) =>
  suspiciousDate(iso) ? (
    <span className="text-rose-600 font-bold" title="วันที่ดูผิดปกติ (อาจพิมพ์ปีผิด)">
      <AlertTriangle className="w-3.5 h-3.5 inline mr-0.5" />
      {thaiShort(iso)}
    </span>
  ) : (
    <>{thaiShort(iso)}</>
  );

// ---------- ฟอร์มลงรับ / แก้ไข ----------

const RecordDialog: React.FC<{
  rec: IncomingRecord;
  isNew: boolean;
  all: IncomingRecord[];
  actionOptions: string[];
  onClose: () => void;
  onSave: (r: IncomingRecord, again: boolean) => Promise<boolean>;
  onDelete: (r: IncomingRecord) => Promise<void>;
}> = ({ rec, isNew, all, actionOptions, onClose, onSave, onDelete }) => {
  const [f, setF] = useState(rec);
  const [busy, setBusy] = useState(false);
  const [extra, setExtra] = useState('');
  const set = <K extends keyof IncomingRecord>(k: K, v: IncomingRecord[K]) => setF(o => ({ ...o, [k]: v }));
  const dup = all.some(x => x.id !== f.id && x.regNo === f.regNo && f.regNo > 0);
  const uniq = (k: 'from' | 'to' | 'note' | 'receiver') => [...new Set(all.map(x => x[k]).filter(Boolean))].slice(0, 50);
  const options = [...new Set([...actionOptions, ...f.actions])];

  const submit = async (again: boolean) => {
    if (!f.subject.trim()) return;
    setBusy(true);
    const ok = await onSave({ ...f, subject: f.subject.trim(), docNo: f.docNo.trim() }, again);
    setBusy(false);
    if (ok && !again) onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-label={isNew ? 'ลงรับหนังสือ' : 'แก้ไขหนังสือรับ'}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0 }} className="bg-slate-950/50 backdrop-blur-sm" />
      <form
        className="relative w-full sm:max-w-2xl max-h-[94vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#11141D] shadow-2xl p-5 sm:p-6 space-y-3"
        onSubmit={e => {
          e.preventDefault();
          void submit(false);
        }}
      >
        <div style={{ position: 'absolute', right: 12, top: 12 }}>
          <button type="button" onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer" aria-label="ปิด">
            <X className="w-5 h-5" />
          </button>
        </div>
        <h2 className="text-lg font-black text-slate-900 dark:text-white">{isNew ? 'ลงรับหนังสือ' : `แก้ไขหนังสือรับ เลข ${rec.regNo}`}</h2>

        <datalist id="in-from">{uniq('from').map(v => <option key={v} value={v} />)}</datalist>
        <datalist id="in-to">{uniq('to').map(v => <option key={v} value={v} />)}</datalist>
        <datalist id="in-note">{uniq('note').map(v => <option key={v} value={v} />)}</datalist>
        <datalist id="in-recv">{uniq('receiver').map(v => <option key={v} value={v} />)}</datalist>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <label className={label}>เลขทะเบียนรับ
            <input className={field} type="number" value={f.regNo || ''} onChange={e => set('regNo', Number(e.target.value) || 0)} required />
          </label>
          <label className={`${label} sm:col-span-3`}>ที่ (เลขที่หนังสือ)
            <input className={field} value={f.docNo} onChange={e => set('docNo', e.target.value)} placeholder="0030.112/1988" autoFocus={isNew} />
          </label>
        </div>
        {dup && <div className="text-xs font-semibold text-amber-700">เลขทะเบียนรับ {f.regNo} มีอยู่แล้ว</div>}
        <div className="grid grid-cols-2 gap-2">
          <label className={label}>ลงวันที่ (ลงนาม)
            <input className={field} type="date" value={f.signedDate} onChange={e => set('signedDate', e.target.value)} />
          </label>
          <label className={label}>ลงวันที่ (รับหนังสือ)
            <input className={field} type="date" value={f.receivedDate} onChange={e => set('receivedDate', e.target.value)} required />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <label className={label}>จาก
            <input className={field} list="in-from" value={f.from} onChange={e => set('from', e.target.value)} />
          </label>
          <label className={label}>ถึง
            <input className={field} list="in-to" value={f.to} onChange={e => set('to', e.target.value)} />
          </label>
        </div>
        <label className={label}>เรื่อง *
          <textarea className={field} rows={2} value={f.subject} onChange={e => set('subject', e.target.value)} required />
        </label>
        <fieldset>
          <legend className={label}>การปฏิบัติ (ส่งให้งาน — เลือกได้หลายงาน)</legend>
          <div className="mt-1 flex flex-wrap gap-1.5 items-center">
            {options.map(code => {
              const on = f.actions.includes(code);
              const d = deptOfAction(code);
              const color = d ? DEPT_THEME[d].color : '#475569';
              return (
                <button
                  key={code}
                  type="button"
                  aria-pressed={on}
                  onClick={() => set('actions', on ? f.actions.filter(x => x !== code) : [...f.actions, code])}
                  className="rounded-xl border-2 px-3 py-1.5 text-sm font-bold cursor-pointer"
                  style={on ? { background: color, borderColor: color, color: '#fff' } : { borderColor: '#CBD5E1', color }}
                >
                  {code}
                </button>
              );
            })}
            <input
              className="w-28 rounded-xl border border-dashed border-slate-300 dark:border-white/15 bg-transparent px-2 py-1.5 text-sm"
              placeholder="+ งานอื่น"
              value={extra}
              onChange={e => setExtra(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && extra.trim()) {
                  e.preventDefault();
                  set('actions', [...new Set([...f.actions, ...splitActions(extra)])]);
                  setExtra('');
                }
              }}
              aria-label="เพิ่มรหัสงานอื่น แล้วกด Enter"
            />
          </div>
        </fieldset>
        <div className="grid grid-cols-2 gap-2">
          <label className={label}>ผู้ลงรับ
            <input className={field} list="in-recv" value={f.receiver} onChange={e => set('receiver', e.target.value)} />
          </label>
          <label className={label}>หมายเหตุ
            <input className={field} list="in-note" value={f.note} onChange={e => set('note', e.target.value)} placeholder="ฝอ.1 / รับส่ง / ด่วนที่สุด" />
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          {!isNew ? (
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                if (!window.confirm(`ลบหนังสือรับเลข ${rec.regNo} ออกจากทะเบียน?`)) return;
                setBusy(true);
                await onDelete(rec);
                setBusy(false);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> ลบ
            </button>
          ) : <span />}
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer">ยกเลิก</button>
            {isNew && (
              <button type="button" disabled={busy || !f.subject.trim()} onClick={() => void submit(true)} className="rounded-xl border-2 border-[#6D28D9] px-4 py-2 text-sm font-bold text-[#6D28D9] disabled:opacity-50 cursor-pointer">
                บันทึกและลงรับเล่มต่อไป
              </button>
            )}
            <button type="submit" disabled={busy || !f.subject.trim()} className="inline-flex items-center gap-1.5 rounded-xl bg-[#6D28D9] px-4 py-2 text-sm font-bold text-white disabled:opacity-50 cursor-pointer">
              {busy && <Loader2 className="w-4 h-4 animate-spin" />} บันทึก
            </button>
          </div>
        </div>
      </form>
    </div>,
    document.body,
  );
};

// ---------- หน้าทะเบียน ----------

/** dept = แสดงเฉพาะหนังสือที่ส่งให้งานนั้น (อ่านอย่างเดียว ใช้ในฝ่ายอื่น) */
export const IncomingRegisterPage: React.FC<{ dept?: Dept }> = ({ dept }) => {
  const { currentUser, showToast } = useAdmin();
  const [rows, setRows, state] = useIncomingRegister();
  const [q, setQ] = useState('');
  const [action, setAction] = useState('all');
  const [month, setMonth] = useState('all');
  const [limit, setLimit] = useState(50);
  const [edit, setEdit] = useState<{ rec: IncomingRecord; isNew: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const readOnly = !!dept && dept !== 'admin';

  const me = useMemo(() => {
    const first = (currentUser.name || '').split(' ')[0];
    if (!first) return '';
    return /หญิง$/.test(currentUser.rank) ? `${currentUser.rank} ${first}` : `${currentUser.rank}${first}`;
  }, [currentUser]);

  const scoped = useMemo(() => (readOnly ? rows.filter(r => r.actions.some(a => deptOfAction(a) === dept)) : rows), [rows, readOnly, dept]);
  const actionOptions = useMemo(() => [...new Set([...DEFAULT_ACTIONS, ...rows.flatMap(r => r.actions)])], [rows]);
  const months = useMemo(() => [...new Set(scoped.map(r => r.receivedDate.slice(0, 7)).filter(m => /^\d{4}-\d{2}$/.test(m)))].sort().reverse(), [scoped]);
  const maxNo = rows.reduce((m, r) => Math.max(m, r.regNo || 0), 0);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return scoped
      .filter(r => action === 'all' || r.actions.includes(action))
      .filter(r => month === 'all' || r.receivedDate.startsWith(month))
      .filter(r => !s || `${r.regNo} ${r.docNo} ${r.from} ${r.to} ${r.subject} ${r.actions.join(' ')} ${r.receiver} ${r.note}`.toLowerCase().includes(s))
      .sort((a, b) => b.regNo - a.regNo || b.receivedDate.localeCompare(a.receivedDate));
  }, [scoped, q, action, month]);

  const today = todayIso();
  const todayCount = scoped.filter(r => r.receivedDate === today).length;
  const monthCount = scoped.filter(r => r.receivedDate.startsWith(today.slice(0, 7))).length;

  const blank = (base?: IncomingRecord): IncomingRecord => ({
    id: newId(),
    regNo: Math.max(maxNo, base?.regNo ?? 0) + 1,
    docNo: '',
    signedDate: '',
    receivedDate: base?.receivedDate || today,
    from: '',
    to: base?.to || 'ฝอ.5',
    subject: '',
    actions: [],
    receiver: base?.receiver || me,
    note: '',
    createdAt: new Date().toISOString(),
  });

  const save = async (r: IncomingRecord, again: boolean) => {
    const ok = await setRows(prev => (prev.some(x => x.id === r.id) ? prev.map(x => (x.id === r.id ? r : x)) : [r, ...prev]));
    if (ok) {
      showToast(`บันทึกเลขรับ ${r.regNo} แล้ว`, 'success');
      if (again) setEdit({ rec: blank(r), isNew: true });
    }
    return ok;
  };
  const remove = async (r: IncomingRecord) => {
    if (await setRows(prev => prev.filter(x => x.id !== r.id))) showToast('ลบแล้ว', 'success');
  };

  const onImport = async (file: File) => {
    setBusy(true);
    try {
      const got = await importRegister(file, me);
      const key = (r: IncomingRecord) => `${r.regNo}|${r.docNo}`;
      const have = new Set(rows.map(key));
      const fresh = got.filter(r => !have.has(key(r)));
      const bad = fresh.filter(r => suspiciousDate(r.receivedDate) || suspiciousDate(r.signedDate)).length;
      if (!fresh.length) {
        showToast(`ไม่มีรายการใหม่ (พบ ${got.length} รายการ ซ้ำกับที่มีอยู่ทั้งหมด)`, 'info');
      } else if (window.confirm(`นำเข้า ${fresh.length} รายการ${got.length - fresh.length ? ` (ข้ามที่ซ้ำ ${got.length - fresh.length})` : ''}${bad ? `\nมี ${bad} รายการที่วันที่ดูผิดปกติ จะทำเครื่องหมายสีแดงไว้ให้ตรวจ` : ''}`)) {
        if (await setRows(prev => [...fresh, ...prev])) showToast(`นำเข้า ${fresh.length} รายการแล้ว`, 'success');
      }
    } catch (e) {
      showToast(`อ่านไฟล์ไม่สำเร็จ: ${(e as Error).message}`, 'error');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const doExport = async () => {
    setBusy(true);
    try {
      await exportRegister(filtered, `ทะเบียนหนังสือรับ${month !== 'all' ? `-${month}` : ''}.xlsx`);
    } catch (e) {
      showToast(`ส่งออกไม่สำเร็จ: ${(e as Error).message}`, 'error');
    } finally {
      setBusy(false);
    }
  };

  const monthLabel = (m: string) => thaiShort(`${m}-01`).replace(/^1 /, '');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Inbox className="w-5 h-5 text-[#6D28D9]" /> {readOnly ? 'หนังสือที่ส่งมาให้งานนี้' : 'ทะเบียนหนังสือรับ'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {readOnly ? 'จากทะเบียนหนังสือรับของงานอำนวยการ ตามช่อง "การปฏิบัติ"' : `ทั้งหมด ${rows.length} เรื่อง · วันนี้ ${todayCount} · เดือนนี้ ${monthCount}${maxNo ? ` · เลขรับล่าสุด ${maxNo}` : ''}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!readOnly && (
            <>
              <input ref={fileRef} type="file" accept=".xlsx" className="sr-only" onChange={e => e.target.files?.[0] && void onImport(e.target.files[0])} />
              <button type="button" disabled={busy} onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-white/15 px-3 py-2 text-sm font-semibold cursor-pointer disabled:opacity-50">
                <Upload className="w-4 h-4" /> นำเข้า Excel
              </button>
            </>
          )}
          <button type="button" disabled={busy || !filtered.length} onClick={() => void doExport()} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-white/15 px-3 py-2 text-sm font-semibold cursor-pointer disabled:opacity-50">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} ส่งออก Excel
          </button>
          {!readOnly && (
            <button type="button" onClick={() => setEdit({ rec: blank(), isNew: true })} className="inline-flex items-center gap-1.5 rounded-xl bg-[#6D28D9] px-4 py-2 text-sm font-bold text-white cursor-pointer">
              <Plus className="w-4 h-4" /> ลงรับหนังสือ
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <label className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="ค้นหาเลขรับ ที่ เรื่อง จาก หรือผู้ลงรับ" aria-label="ค้นหาหนังสือรับ" className={`${field} pl-9`} />
        </label>
        <select value={month} onChange={e => setMonth(e.target.value)} aria-label="เดือนที่รับ" className={`${field} sm:w-40`}>
          <option value="all">ทุกเดือน</option>
          {months.map(m => <option key={m} value={m}>{monthLabel(m)}</option>)}
        </select>
      </div>
      {!readOnly && (
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar" role="tablist" aria-label="กรองตามการปฏิบัติ">
          {['all', ...actionOptions].map(a => {
            const on = action === a;
            const d = a === 'all' ? undefined : deptOfAction(a);
            const color = d ? DEPT_THEME[d].color : '#334155';
            const n = a === 'all' ? rows.length : rows.filter(r => r.actions.includes(a)).length;
            return (
              <button key={a} type="button" role="tab" aria-selected={on} onClick={() => setAction(a)} className="shrink-0 rounded-full border px-3 py-1 text-xs font-bold cursor-pointer" style={on ? { background: color, color: '#fff', borderColor: color } : { borderColor: '#E2E8F0', color }}>
                {a === 'all' ? 'ทั้งหมด' : a} {n}
              </button>
            );
          })}
        </div>
      )}

      {state.status === 'loading' && rows.length === 0 && <div role="status" className="py-10 text-center text-sm text-slate-500"><Loader2 className="w-5 h-5 animate-spin inline mr-2" />กำลังโหลด...</div>}
      {state.status === 'ready' && filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/15 p-8 text-center text-sm text-slate-500">
          {scoped.length === 0 ? (readOnly ? 'ยังไม่มีหนังสือที่ส่งมาให้งานนี้' : 'ยังไม่มีหนังสือรับ กด "ลงรับหนังสือ" หรือ "นำเข้า Excel"') : 'ไม่พบตามเงื่อนไขที่เลือก'}
        </div>
      )}

      {filtered.length > 0 && (
        <>
          {/* PC: ตารางเหมือนทะเบียน */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-white/5 text-xs text-slate-600 dark:text-slate-300">
                <tr>
                  {['เลขรับ', 'ที่', 'ลงวันที่', 'วันที่รับ', 'จาก', 'ถึง', 'เรื่อง', 'การปฏิบัติ', 'ผู้ลงรับ', 'หมายเหตุ'].map(h => (
                    <th key={h} className="px-2.5 py-2 text-left font-black whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, limit).map(r => (
                  <tr
                    key={r.id}
                    onClick={() => !readOnly && setEdit({ rec: r, isNew: false })}
                    className={`border-t border-slate-100 dark:border-white/5 ${readOnly ? '' : 'cursor-pointer hover:bg-purple-50/60 dark:hover:bg-white/5'}`}
                  >
                    <td className="px-2.5 py-2 font-black text-[#6D28D9]">{r.regNo}</td>
                    <td className="px-2.5 py-2 whitespace-nowrap text-slate-600 dark:text-slate-300">{r.docNo}</td>
                    <td className="px-2.5 py-2 whitespace-nowrap"><DateCell iso={r.signedDate} /></td>
                    <td className="px-2.5 py-2 whitespace-nowrap"><DateCell iso={r.receivedDate} /></td>
                    <td className="px-2.5 py-2 whitespace-nowrap">{r.from}</td>
                    <td className="px-2.5 py-2 whitespace-nowrap">{r.to}</td>
                    <td className="px-2.5 py-2 min-w-[16rem] font-semibold text-slate-900 dark:text-white">{r.subject}</td>
                    <td className="px-2.5 py-2 whitespace-nowrap">{r.actions.map(a => <ActionChip key={a} code={a} />)}</td>
                    <td className="px-2.5 py-2 whitespace-nowrap text-slate-600 dark:text-slate-300">{r.receiver}</td>
                    <td className="px-2.5 py-2 whitespace-nowrap text-slate-600 dark:text-slate-300">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* มือถือ: การ์ด */}
          <ul className="md:hidden space-y-2">
            {filtered.slice(0, limit).map(r => (
              <li key={r.id}>
                <button type="button" disabled={readOnly} onClick={() => setEdit({ rec: r, isNew: false })} className="w-full text-left rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#161B26] p-3 cursor-pointer disabled:cursor-default">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-black text-[#6D28D9]">เลขรับ {r.regNo}</span>
                    <span className="text-slate-500"><DateCell iso={r.receivedDate} /></span>
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white leading-snug">{r.subject}</div>
                  <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    ที่ {r.docNo || '-'} · จาก {r.from || '-'} ถึง {r.to || '-'}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1">
                    {r.actions.map(a => <ActionChip key={a} code={a} />)}
                    <span className="text-[11px] text-slate-500">{r.receiver}{r.note ? ` · ${r.note}` : ''}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          {filtered.length > limit && (
            <button type="button" onClick={() => setLimit(l => l + 50)} className="w-full rounded-xl border border-slate-200 dark:border-white/10 py-2 text-sm font-semibold text-slate-600 cursor-pointer">
              แสดงเพิ่ม ({filtered.length - limit} เรื่อง)
            </button>
          )}
        </>
      )}

      {edit && (
        <RecordDialog key={edit.rec.id} rec={edit.rec} isNew={edit.isNew} all={rows} actionOptions={actionOptions} onClose={() => setEdit(null)} onSave={save} onDelete={remove} />
      )}
    </div>
  );
};
