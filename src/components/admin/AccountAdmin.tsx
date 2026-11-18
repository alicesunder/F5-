import React, { useCallback, useEffect, useState } from 'react';
import { KeyRound, UserPlus, Users, Download, Loader2, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAdmin } from '../../contexts/AdminContext';
import { ROLE_LABELS } from '../../data/departmentsData';

const ROLES = ['SUPER_ADMIN', 'ADMIN', 'ADMIN_DEPARTMENT', 'RELATIONS', 'DISASTER', 'VOLUNTEER', 'VIEWER'] as const;
type StaffRole = (typeof ROLES)[number];

interface StaffRow {
  user_id: string;
  email: string | null;
  name: string | null;
  rank: string;
  position: string;
  department: string;
  phone: string;
  role: StaffRole;
  active: boolean;
}

const input =
  'w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151A22] text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#5B2A86]/30';
const label = 'text-xs font-bold text-slate-700 dark:text-slate-200';
const btn =
  'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5B2A86] hover:bg-[#7B3FC6] text-white text-xs font-semibold transition disabled:opacity-50 cursor-pointer';
const card = 'rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5 space-y-4';

const roleLabel = (r: string) => ROLE_LABELS[r]?.title || r;

async function callStaffAdmin(body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke('staff-admin', { body });
  if (error) {
    // ข้อความจากฟังก์ชันอยู่ใน response body
    const ctx = (error as { context?: Response }).context;
    const msg = ctx ? ((await ctx.json().catch(() => null)) as { error?: string } | null)?.error : null;
    throw new Error(msg || error.message);
  }
  return data as { ok?: boolean; error?: string };
}

/** เปลี่ยนรหัสผ่านของตัวเอง */
export const ChangePasswordCard: React.FC = () => {
  const { showToast, currentUser } = useAdmin();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (next.length < 10) return setError('รหัสผ่านใหม่ต้องยาวอย่างน้อย 10 ตัวอักษร');
    if (next !== confirm) return setError('ยืนยันรหัสผ่านไม่ตรงกัน');
    setBusy(true);
    try {
      // ตรวจรหัสเดิมก่อน กันคนอื่นที่ใช้เครื่องค้างไว้เปลี่ยนรหัส
      const { error: e1 } = await supabase.auth.signInWithPassword({ email: currentUser.email, password: current });
      if (e1) throw new Error('รหัสผ่านปัจจุบันไม่ถูกต้อง');
      const { error: e2 } = await supabase.auth.updateUser({ password: next });
      if (e2) throw e2;
      setCurrent('');
      setNext('');
      setConfirm('');
      showToast('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว', 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className={card}>
      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <KeyRound className="w-4 h-4 text-[#5B2A86]" /> เปลี่ยนรหัสผ่าน
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className={label} htmlFor="pw-current">รหัสผ่านปัจจุบัน</label>
          <input id="pw-current" type="password" autoComplete="current-password" className={input} value={current} onChange={e => setCurrent(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <label className={label} htmlFor="pw-new">รหัสผ่านใหม่ (10 ตัวขึ้นไป)</label>
          <input id="pw-new" type="password" autoComplete="new-password" className={input} value={next} onChange={e => setNext(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <label className={label} htmlFor="pw-confirm">ยืนยันรหัสผ่านใหม่</label>
          <input id="pw-confirm" type="password" autoComplete="new-password" className={input} value={confirm} onChange={e => setConfirm(e.target.value)} required />
        </div>
      </div>
      {error && <p role="alert" className="text-xs text-rose-600">{error}</p>}
      <button type="submit" className={btn} disabled={busy}>
        {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />} บันทึกรหัสผ่านใหม่
      </button>
    </form>
  );
};

const emptyForm = { email: '', password: '', rank: '', name: '', position: '', department: '', phone: '', role: 'VIEWER' as StaffRole };

/** รายชื่อบุคลากรและการเพิ่ม/แก้สิทธิ์ (เฉพาะ SUPER_ADMIN / ADMIN) */
export const StaffManager: React.FC = () => {
  const { currentRole, userSession, showToast } = useAdmin();
  const canManage = currentRole === 'SUPER_ADMIN' || currentRole === 'ADMIN';
  const [rows, setRows] = useState<StaffRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: e } = await supabase
      .from('staff')
      .select('user_id, email, name, rank, position, department, phone, role, active')
      .order('created_at', { ascending: true });
    setLoading(false);
    if (e) return setError(e.message);
    setError('');
    setRows((data ?? []) as StaffRow[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await callStaffAdmin({ action: 'create', ...form });
      showToast(`เพิ่มผู้ใช้ ${form.email} แล้ว`, 'success');
      setForm(emptyForm);
      await load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : String(err), 'error');
    } finally {
      setBusy(false);
    }
  };

  const update = async (row: StaffRow, patch: Partial<StaffRow>) => {
    try {
      await callStaffAdmin({ action: 'update', user_id: row.user_id, ...patch });
      setRows(prev => prev.map(r => (r.user_id === row.user_id ? { ...r, ...patch } : r)));
      showToast('บันทึกแล้ว', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : String(err), 'error');
    }
  };

  const resetPassword = async (row: StaffRow) => {
    const pw = window.prompt(`ตั้งรหัสผ่านใหม่ให้ ${row.email} (อย่างน้อย 10 ตัวอักษร)`);
    if (!pw) return;
    try {
      await callStaffAdmin({ action: 'password', user_id: row.user_id, password: pw });
      showToast('ตั้งรหัสผ่านใหม่แล้ว แจ้งผู้ใช้ทางช่องทางที่ปลอดภัย', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : String(err), 'error');
    }
  };

  const set = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="space-y-4">
      <div className={card}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#5B2A86]" /> ผู้ใช้งานระบบ ({rows.length})
          </h3>
          <button type="button" onClick={() => void load()} className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" /> โหลดใหม่
          </button>
        </div>
        {loading ? (
          <p className="text-xs text-slate-500" role="status">กำลังโหลด...</p>
        ) : error ? (
          <p className="text-xs text-rose-600" role="alert">{error}</p>
        ) : rows.length === 0 ? (
          <p className="text-xs text-slate-500">ยังไม่มีผู้ใช้</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200 dark:border-white/10">
                  <th className="py-2 pr-3">ชื่อ</th>
                  <th className="py-2 pr-3">อีเมล</th>
                  <th className="py-2 pr-3">สิทธิ์</th>
                  <th className="py-2 pr-3">สถานะ</th>
                  {canManage && <th className="py-2">จัดการ</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map(r => {
                  const self = r.user_id === userSession?.user.id;
                  return (
                    <tr key={r.user_id} className="border-b border-slate-100 dark:border-white/5 align-top">
                      <td className="py-2 pr-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-100">{[r.rank, r.name].filter(Boolean).join(' ') || '—'}</div>
                        <div className="text-slate-500">{r.position}</div>
                      </td>
                      <td className="py-2 pr-3 break-all">{r.email}</td>
                      <td className="py-2 pr-3">
                        {canManage && !self ? (
                          <select
                            className={input + ' !py-1 !text-xs'}
                            value={r.role}
                            onChange={e => void update(r, { role: e.target.value as StaffRole })}
                            aria-label={`สิทธิ์ของ ${r.email}`}
                          >
                            {ROLES.map(x => (
                              <option key={x} value={x}>{roleLabel(x)}</option>
                            ))}
                          </select>
                        ) : (
                          roleLabel(r.role)
                        )}
                      </td>
                      <td className="py-2 pr-3">
                        {r.active ? <span className="text-emerald-600">ใช้งาน</span> : <span className="text-slate-400">ปิดแล้ว</span>}
                      </td>
                      {canManage && (
                        <td className="py-2 space-x-2 whitespace-nowrap">
                          <button type="button" className="text-[#5B2A86] hover:underline cursor-pointer" onClick={() => void resetPassword(r)}>
                            ตั้งรหัสใหม่
                          </button>
                          {!self && (
                            <button
                              type="button"
                              className={(r.active ? 'text-rose-600' : 'text-emerald-600') + ' hover:underline cursor-pointer'}
                              onClick={() => {
                                if (r.active && !window.confirm(`ปิดการใช้งาน ${r.email}? ผู้ใช้จะเข้าดูข้อมูลไม่ได้ทันที`)) return;
                                void update(r, { active: !r.active });
                              }}
                            >
                              {r.active ? 'ปิดบัญชี' : 'เปิดบัญชี'}
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {canManage ? (
        <form onSubmit={create} className={card}>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[#5B2A86]" /> เพิ่มผู้ใช้ใหม่
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className={label} htmlFor="nu-email">อีเมล (ใช้ล็อกอิน)</label>
              <input id="nu-email" type="email" className={input} value={form.email} onChange={set('email')} required />
            </div>
            <div className="space-y-1">
              <label className={label} htmlFor="nu-pw">รหัสผ่านเริ่มต้น (10 ตัวขึ้นไป)</label>
              <input id="nu-pw" type="text" autoComplete="off" className={input} value={form.password} onChange={set('password')} minLength={10} required />
            </div>
            <div className="space-y-1">
              <label className={label} htmlFor="nu-rank">ยศ</label>
              <input id="nu-rank" className={input} value={form.rank} onChange={set('rank')} />
            </div>
            <div className="space-y-1">
              <label className={label} htmlFor="nu-name">ชื่อ-นามสกุล</label>
              <input id="nu-name" className={input} value={form.name} onChange={set('name')} required />
            </div>
            <div className="space-y-1">
              <label className={label} htmlFor="nu-pos">ตำแหน่ง</label>
              <input id="nu-pos" className={input} value={form.position} onChange={set('position')} />
            </div>
            <div className="space-y-1">
              <label className={label} htmlFor="nu-dept">สังกัด/ฝ่าย</label>
              <input id="nu-dept" className={input} value={form.department} onChange={set('department')} />
            </div>
            <div className="space-y-1">
              <label className={label} htmlFor="nu-phone">โทรศัพท์</label>
              <input id="nu-phone" className={input} value={form.phone} onChange={set('phone')} />
            </div>
            <div className="space-y-1">
              <label className={label} htmlFor="nu-role">สิทธิ์</label>
              <select id="nu-role" className={input} value={form.role} onChange={set('role')}>
                {ROLES.filter(r => r !== 'SUPER_ADMIN' || currentRole === 'SUPER_ADMIN').map(r => (
                  <option key={r} value={r}>{roleLabel(r)}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">แจ้งรหัสผ่านเริ่มต้นให้ผู้ใช้ทางช่องทางที่ปลอดภัย และให้เปลี่ยนรหัสเองหลังเข้าสู่ระบบครั้งแรก</p>
          <button type="submit" className={btn} disabled={busy}>
            {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />} เพิ่มผู้ใช้
          </button>
        </form>
      ) : (
        <p className="text-xs text-slate-500">เฉพาะผู้ดูแลระบบเท่านั้นที่เพิ่มหรือแก้สิทธิ์ผู้ใช้ได้</p>
      )}
    </div>
  );
};

/** ดาวน์โหลดข้อมูลทั้งหมดเป็นไฟล์ JSON (สำรองข้อมูลจริง) */
export const DataExportCard: React.FC = () => {
  const { showToast } = useAdmin();
  const [busy, setBusy] = useState(false);

  const fetchAll = async (table: string, columns: string) => {
    const out: unknown[] = [];
    for (let from = 0; ; from += 1000) {
      const { data, error } = await supabase.from(table).select(columns).range(from, from + 999);
      if (error) throw error;
      out.push(...(data ?? []));
      if (!data || data.length < 1000) break;
    }
    return out;
  };

  const run = async () => {
    setBusy(true);
    try {
      const [records, reports, groups] = await Promise.all([
        fetchAll('app_records', 'collection, id, data, created_at, updated_at'),
        fetchAll('line_reports', '*'),
        fetchAll('line_groups', '*'),
      ]);
      const payload = { exportedAt: new Date().toISOString(), app_records: records, line_reports: reports, line_groups: groups };
      const blob = new Blob([JSON.stringify(payload, null, 1)], { type: 'application/json;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `fo5-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
      showToast(`ส่งออกข้อมูลแล้ว (${records.length + reports.length} รายการ)`, 'success');
    } catch (err) {
      showToast(`ส่งออกไม่สำเร็จ: ${err instanceof Error ? err.message : String(err)}`, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={card}>
      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <Download className="w-4 h-4 text-[#5B2A86]" /> สำรองข้อมูล
      </h3>
      <p className="text-xs text-slate-600 dark:text-slate-300">
        ข้อมูลทุกโมดูลบันทึกในฐานข้อมูลกลางอัตโนมัติทุกครั้งที่แก้ไข ปุ่มนี้ดาวน์โหลดสำเนาทั้งหมด (ยกเว้นไฟล์รูป) เป็นไฟล์ JSON เก็บไว้เอง
        ข้อมูลส่วนตัวของผู้อื่นจะไม่ถูกรวม
      </p>
      <button type="button" className={btn} onClick={() => void run()} disabled={busy}>
        {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} ดาวน์โหลดข้อมูลทั้งหมด
      </button>
    </div>
  );
};

/** สถานะการเชื่อมต่อจริง (ไม่ใช่การจำลอง) */
export const IntegrationStatusCard: React.FC = () => {
  const [db, setDb] = useState<'checking' | 'ok' | 'fail'>('checking');
  const [ai, setAi] = useState<'checking' | 'ok' | 'off'>('checking');
  const [lastLine, setLastLine] = useState<string | null>(null);

  useEffect(() => {
    void supabase
      .from('line_reports')
      .select('received_at')
      .order('received_at', { ascending: false })
      .limit(1)
      .then(({ data, error }) => {
        setDb(error ? 'fail' : 'ok');
        setLastLine(data?.[0]?.received_at ?? null);
      });
    void fetch('/api/ai', { method: 'GET' })
      .then(r => r.json().catch(() => ({})))
      .then((j: { configured?: boolean }) => setAi(j.configured ? 'ok' : 'off'))
      .catch(() => setAi('off'));
  }, []);

  const Row: React.FC<{ ok: boolean | null; title: string; detail: string }> = ({ ok, title, detail }) => (
    <li className="flex items-start gap-2 text-xs">
      {ok === null ? (
        <Loader2 className="w-4 h-4 animate-spin text-slate-400 shrink-0" />
      ) : ok ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
      ) : (
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
      )}
      <div>
        <div className="font-semibold text-slate-800 dark:text-slate-100">{title}</div>
        <div className="text-slate-500">{detail}</div>
      </div>
    </li>
  );

  return (
    <div className={card}>
      <ul className="space-y-3">
        <Row
          ok={db === 'checking' ? null : db === 'ok'}
          title="ฐานข้อมูล Supabase"
          detail={db === 'fail' ? 'เชื่อมต่อไม่ได้ ตรวจอินเทอร์เน็ตหรือสิทธิ์บัญชี' : 'เชื่อมต่อแล้ว ข้อมูลซิงก์ทุกเครื่องแบบสด'}
        />
        <Row
          ok={db === 'checking' ? null : !!lastLine}
          title="บอท LINE → เว็บ"
          detail={lastLine ? `รับรายงานล่าสุด ${new Date(lastLine).toLocaleString('th-TH')}` : 'ยังไม่มีรายงานจากกลุ่ม LINE เข้ามา'}
        />
        <Row
          ok={ai === 'checking' ? null : ai === 'ok'}
          title="ผู้ช่วย AI (Gemini)"
          detail={ai === 'ok' ? 'พร้อมใช้งาน' : 'ยังไม่ได้ตั้งค่า GEMINI_API_KEY ใน Vercel (ระบบตอบแบบออฟไลน์แทน)'}
        />
      </ul>
    </div>
  );
};
