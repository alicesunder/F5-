import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Network, LayoutGrid, Search, Phone, X, Pencil, Plus, Trash2, Camera, Users, UserRound, Loader2 } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import {
  OrgPerson,
  OrgSection,
  SECTION_META,
  WORK_SECTIONS,
  EDITOR_ROLES,
  useOrgStaff,
  usePhotoUrls,
  byOrder,
  fullName,
  isAttached,
  uploadPhoto,
  removePhoto,
} from './orgStaff';

type View = 'tree' | 'sections';

// ---------- ชิ้นส่วนแสดงผล ----------

const Avatar: React.FC<{ p: OrgPerson; url?: string; className?: string }> = ({ p, url, className = '' }) => {
  const m = SECTION_META[p.section] ?? SECTION_META.command;
  return url ? (
    <img src={url} alt={fullName(p)} loading="lazy" className={`object-cover object-top bg-white ${className}`} />
  ) : (
    <div className={`flex items-center justify-center ${className}`} style={{ background: m.soft, color: m.color }} aria-hidden="true">
      <UserRound className="w-1/2 h-1/2 opacity-70" />
    </div>
  );
};

const AttachedBadge: React.FC<{ p: OrgPerson }> = ({ p }) =>
  isAttached(p) ? (
    <span className="inline-block mt-1 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 px-2 py-0.5 text-[10px] font-bold">
      {p.note}
    </span>
  ) : null;

/** การ์ดใหญ่ (หัวหน้า): รูปแนวตั้ง */
const LeadCard: React.FC<{ p: OrgPerson; url?: string; onOpen: (p: OrgPerson) => void; size?: 'lg' | 'md' }> = ({ p, url, onOpen, size = 'md' }) => {
  const m = SECTION_META[p.section] ?? SECTION_META.command;
  return (
    <button
      type="button"
      onClick={() => onOpen(p)}
      className={`group w-full ${size === 'lg' ? 'max-w-[15rem]' : 'max-w-[13rem]'} mx-auto flex flex-col items-center text-center rounded-3xl bg-white dark:bg-[#161B26] border border-slate-200/80 dark:border-white/10 p-3 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition cursor-pointer`}
      style={{ borderTop: `4px solid ${m.color}` }}
    >
      <Avatar p={p} url={url} className={`${size === 'lg' ? 'w-32 h-40' : 'w-24 h-[7.5rem]'} rounded-2xl ring-1 ring-slate-200 dark:ring-white/10`} />
      <div className="mt-2 text-[11px] font-bold" style={{ color: m.color }}>{p.rank}</div>
      <div className="text-sm font-black text-slate-900 dark:text-white leading-tight">{p.name}</div>
      <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">{p.position}</div>
      <AttachedBadge p={p} />
    </button>
  );
};

/** การ์ดเล็ก (ลูกทีม): รูปซ้าย ข้อความขวา */
const MemberCard: React.FC<{ p: OrgPerson; url?: string; onOpen: (p: OrgPerson) => void }> = ({ p, url, onOpen }) => (
  <button
    type="button"
    onClick={() => onOpen(p)}
    className="w-full flex items-center gap-3 rounded-2xl bg-white dark:bg-[#161B26] border border-slate-200/80 dark:border-white/10 p-2 pr-3 text-left hover:shadow-md hover:border-slate-300 dark:hover:border-white/20 transition cursor-pointer"
  >
    <Avatar p={p} url={url} className="w-12 h-14 shrink-0 rounded-xl ring-1 ring-slate-200 dark:ring-white/10" />
    <div className="min-w-0">
      <div className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight">
        <span className="text-slate-500 dark:text-slate-400 font-semibold">{p.rank}</span> {p.name}
      </div>
      <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug truncate">{p.position}</div>
      <AttachedBadge p={p} />
    </div>
  </button>
);

const SectionBlock: React.FC<{
  head: OrgPerson;
  members: OrgPerson[];
  urls: Record<string, string>;
  onOpen: (p: OrgPerson) => void;
}> = ({ head, members, urls, onOpen }) => {
  const m = SECTION_META[head.section] ?? SECTION_META.command;
  return (
    <section className="rounded-3xl border p-3 sm:p-4" style={{ background: m.soft, borderColor: `${m.color}33` }} aria-label={m.label}>
      <h3 className="mb-3 flex items-center justify-between gap-2 text-sm font-black" style={{ color: m.color }}>
        <span>{m.label}</span>
        <span className="shrink-0 rounded-full bg-white/80 dark:bg-white/10 px-2 py-0.5 text-[11px]">{members.length + 1} นาย</span>
      </h3>
      <LeadCard p={head} url={urls[head.photo]} onOpen={onOpen} />
      {members.length > 0 && (
        <div className="mt-3 grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1">
          {members.map(c => (
            <MemberCard key={c.id} p={c} url={urls[c.photo]} onOpen={onOpen} />
          ))}
        </div>
      )}
    </section>
  );
};

// ---------- หน้าต่างรายละเอียด / แก้ไข ----------

const empty = (section: OrgSection, parent: string | null, order: number): OrgPerson => ({
  id: `p${Date.now().toString(36)}`,
  rank: '',
  name: '',
  position: '',
  note: '',
  section,
  parent,
  phone: '',
  photo: '',
  order,
});

const PersonDialog: React.FC<{
  person: OrgPerson;
  isNew: boolean;
  all: OrgPerson[];
  url?: string;
  canEdit: boolean;
  onClose: () => void;
  onSave: (p: OrgPerson, file: File | null) => Promise<boolean>;
  onDelete: (p: OrgPerson) => Promise<void>;
}> = ({ person, isNew, all, url, canEdit, onClose, onSave, onDelete }) => {
  const [editing, setEditing] = useState(isNew);
  const [f, setF] = useState<OrgPerson>(person);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(url);
  const [busy, setBusy] = useState(false);
  const m = SECTION_META[f.section] ?? SECTION_META.command;
  const children = all.filter(x => x.parent === person.id);
  const set = <K extends keyof OrgPerson>(k: K, v: OrgPerson[K]) => setF(o => ({ ...o, [k]: v }));
  const field = 'w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-white';

  const save = async () => {
    if (!f.name.trim()) return;
    setBusy(true);
    const ok = await onSave({ ...f, name: f.name.trim(), rank: f.rank.trim() }, file);
    setBusy(false);
    if (ok) onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-label={fullName(person) || 'เพิ่มบุคลากร'}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0 }} className="bg-slate-950/50 backdrop-blur-sm" />
      <div className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#11141D] shadow-2xl">
        <div className="h-1.5 rounded-t-3xl" style={{ background: m.color }} />
        <div style={{ position: 'absolute', right: 12, top: 16, zIndex: 1 }}>
          <button type="button" onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer" aria-label="ปิด">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!editing ? (
          <div className="p-5 sm:p-6 flex flex-col items-center text-center">
            <Avatar p={person} url={url} className="w-40 h-52 rounded-3xl ring-1 ring-slate-200 dark:ring-white/10 shadow" />
            <div className="mt-4 text-xs font-bold" style={{ color: m.color }}>{m.label}</div>
            <div className="mt-1 text-xl font-black text-slate-900 dark:text-white">{fullName(person)}</div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{person.position}</div>
            <AttachedBadge p={person} />
            {person.phone ? (
              <a href={`tel:${person.phone.replace(/[^\d+]/g, '')}`} className="mt-5 inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-white font-bold shadow" style={{ background: m.color }}>
                <Phone className="w-4 h-4" /> โทร {person.phone}
              </a>
            ) : (
              <div className="mt-5 text-xs text-slate-400">ยังไม่มีเบอร์โทร</div>
            )}
            {canEdit && (
              <button type="button" onClick={() => setEditing(true)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:underline cursor-pointer">
                <Pencil className="w-4 h-4" /> แก้ไขข้อมูล
              </button>
            )}
          </div>
        ) : (
          <form
            className="p-5 sm:p-6 space-y-3"
            onSubmit={e => {
              e.preventDefault();
              void save();
            }}
          >
            <h2 className="text-lg font-black text-slate-900 dark:text-white">{isNew ? 'เพิ่มบุคลากร' : 'แก้ไขข้อมูล'}</h2>
            <div className="flex items-center gap-4">
              <Avatar p={f} url={preview} className="w-20 h-24 rounded-2xl ring-1 ring-slate-200 dark:ring-white/10" />
              <label className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-white/15 px-3 py-2 text-sm font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5">
                <Camera className="w-4 h-4" /> {preview ? 'เปลี่ยนรูป' : 'ใส่รูป'}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={e => {
                    const x = e.target.files?.[0];
                    if (!x) return;
                    setFile(x);
                    setPreview(URL.createObjectURL(x));
                  }}
                />
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <label className="col-span-1 text-xs font-semibold text-slate-600 dark:text-slate-300">ยศ
                <input className={field} value={f.rank} onChange={e => set('rank', e.target.value)} placeholder="พ.ต.ต." />
              </label>
              <label className="col-span-2 text-xs font-semibold text-slate-600 dark:text-slate-300">ชื่อ-นามสกุล *
                <input className={field} value={f.name} onChange={e => set('name', e.target.value)} required />
              </label>
            </div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">ตำแหน่ง
              <input className={field} value={f.position} onChange={e => set('position', e.target.value)} />
            </label>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">ช่วยราชการ/ปฏิบัติหน้าที่ (เว้นว่างถ้าสังกัด ฝอ.5)
              <input className={field} value={f.note} onChange={e => set('note', e.target.value)} placeholder="ช่วยราชการ ฝอ.5ฯ" />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">งาน
                <select className={field} value={f.section} onChange={e => set('section', e.target.value as OrgSection)}>
                  {(['command', ...WORK_SECTIONS] as OrgSection[]).map(s => (
                    <option key={s} value={s}>{SECTION_META[s].short}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">ขึ้นตรงกับ
                <select className={field} value={f.parent ?? ''} onChange={e => set('parent', e.target.value || null)}>
                  <option value="">— หัวหน้าสูงสุด —</option>
                  {all.filter(x => x.id !== f.id).sort(byOrder).map(x => (
                    <option key={x.id} value={x.id}>{fullName(x)}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">เบอร์โทร
                <input className={field} value={f.phone} onChange={e => set('phone', e.target.value)} inputMode="tel" />
              </label>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">ลำดับการแสดง
                <input className={field} type="number" value={f.order} onChange={e => set('order', Number(e.target.value) || 0)} />
              </label>
            </div>
            <div className="flex items-center justify-between gap-2 pt-2">
              {!isNew ? (
                <button
                  type="button"
                  disabled={busy || children.length > 0}
                  title={children.length ? 'ย้ายผู้ใต้บังคับบัญชาไปขึ้นกับคนอื่นก่อน' : undefined}
                  onClick={async () => {
                    if (!window.confirm(`ลบ ${fullName(person)} ออกจากผังโครงสร้าง?`)) return;
                    setBusy(true);
                    await onDelete(person);
                    setBusy(false);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 disabled:opacity-40 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> ลบ
                </button>
              ) : <span />}
              <div className="flex gap-2">
                <button type="button" onClick={() => (isNew ? onClose() : setEditing(false))} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer">ยกเลิก</button>
                <button type="submit" disabled={busy || !f.name.trim()} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-50 cursor-pointer" style={{ background: m.color }}>
                  {busy && <Loader2 className="w-4 h-4 animate-spin" />} บันทึก
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
};

// ---------- หน้าหลัก ----------

export const OrgStructureModule: React.FC = () => {
  const { currentRole, showToast } = useAdmin();
  const [staff, setStaff, state] = useOrgStaff();
  const [view, setView] = useState<View>('tree');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<{ p: OrgPerson; isNew: boolean } | null>(null);
  const canEdit = EDITOR_ROLES.includes(String(currentRole));
  const urls = usePhotoUrls(staff.map(s => s.photo));

  const sorted = useMemo(() => [...staff].sort(byOrder), [staff]);
  const kids = useMemo(() => {
    const m = new Map<string | null, OrgPerson[]>();
    for (const p of sorted) {
      const k = p.parent && staff.some(s => s.id === p.parent) ? p.parent : null;
      m.set(k, [...(m.get(k) ?? []), p]);
    }
    return m;
  }, [sorted, staff]);
  const descendants = (id: string): OrgPerson[] => (kids.get(id) ?? []).flatMap(c => [c, ...descendants(c.id)]);

  const roots = kids.get(null) ?? [];
  const top = roots[0];
  const deputies = top ? (kids.get(top.id) ?? []).filter(p => p.section === 'command') : [];
  const attached = staff.filter(isAttached).length;

  const save = async (p: OrgPerson, file: File | null) => {
    let next = p;
    try {
      if (file) {
        const path = await uploadPhoto(p.id, file);
        const old = staff.find(s => s.id === p.id)?.photo;
        next = { ...p, photo: path };
        if (old && old !== path) void removePhoto(old);
      }
    } catch (e) {
      showToast(`อัปโหลดรูปไม่สำเร็จ: ${(e as Error).message}`, 'error');
      return false;
    }
    const ok = await setStaff(prev => (prev.some(s => s.id === next.id) ? prev.map(s => (s.id === next.id ? next : s)) : [...prev, next]));
    if (ok) showToast('บันทึกแล้ว', 'success');
    return ok;
  };

  const remove = async (p: OrgPerson) => {
    const ok = await setStaff(prev => prev.filter(s => s.id !== p.id));
    if (ok) {
      void removePhoto(p.photo);
      showToast('ลบแล้ว', 'success');
    }
  };

  const openNew = () => {
    const parent = top?.id ?? null;
    setOpen({ p: { ...emptyPerson(parent, staff.length) }, isNew: true });
  };

  const results = q.trim()
    ? sorted.filter(p => `${p.rank} ${p.name} ${p.position} ${p.phone} ${SECTION_META[p.section]?.label}`.toLowerCase().includes(q.trim().toLowerCase()))
    : null;

  const onOpen = (p: OrgPerson) => setOpen({ p, isNew: false });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 sm:py-6 space-y-5">
      {/* หัวเรื่อง */}
      <header className="rounded-3xl bg-gradient-to-r from-[#4C1D95] via-[#5B21B6] to-[#1D4ED8] text-white p-5 sm:p-6 shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow shrink-0">
              <img src="/assets/fo5-logo.png" alt="" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black leading-tight" style={{ color: '#fff' }}>โครงสร้าง ฝอ.5 บก.อก.บช.ตชด.</h1>
              <p className="text-sm" style={{ color: '#EDE9FE' }}>ผังการบังคับบัญชาและกำลังพลตามสายงาน · กดที่ชื่อเพื่อดูเบอร์โทร</p>
            </div>
          </div>
          {canEdit && (
            <button type="button" onClick={openNew} className="inline-flex items-center gap-1.5 rounded-2xl bg-white text-[#4C1D95] px-4 py-2 text-sm font-bold shadow hover:bg-purple-50 cursor-pointer">
              <Plus className="w-4 h-4" /> เพิ่มบุคลากร
            </button>
          )}
        </div>
        {staff.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-full bg-white/20 px-3 py-1 inline-flex items-center gap-1"><Users className="w-3.5 h-3.5" /> รวม {staff.length} นาย</span>
            <span className="rounded-full bg-white/15 px-3 py-1">สังกัด ฝอ.5 {staff.length - attached} นาย</span>
            <span className="rounded-full bg-white/15 px-3 py-1">ช่วยราชการ/ปฏิบัติหน้าที่ {attached} นาย</span>
            {WORK_SECTIONS.map(s => (
              <span key={s} className="rounded-full bg-white/10 px-3 py-1">{SECTION_META[s].short} {staff.filter(p => p.section === s).length}</span>
            ))}
          </div>
        )}
      </header>

      {/* แถบเครื่องมือ */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div className="inline-flex rounded-2xl bg-slate-100 dark:bg-white/5 p-1 self-start" role="tablist">
          {([
            ['tree', 'ผังบังคับบัญชา', Network],
            ['sections', 'ตามงาน', LayoutGrid],
          ] as const).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={view === id}
              onClick={() => setView(id)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold cursor-pointer transition ${view === id ? 'bg-white dark:bg-[#1E2433] text-[#4C1D95] dark:text-purple-200 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
        <label className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="ค้นหาชื่อ ตำแหน่ง หรือเบอร์"
            aria-label="ค้นหาบุคลากร"
            className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white"
          />
        </label>
      </div>

      {state.status === 'loading' && staff.length === 0 && (
        <div role="status" className="py-16 text-center text-sm text-slate-500"><Loader2 className="w-5 h-5 animate-spin inline mr-2" />กำลังโหลดผังโครงสร้าง...</div>
      )}
      {state.status === 'error' && <div role="alert" className="rounded-2xl bg-rose-50 text-rose-700 p-4 text-sm">โหลดข้อมูลไม่สำเร็จ: {state.error}</div>}
      {state.status === 'ready' && staff.length === 0 && (
        <div className="py-16 text-center text-sm text-slate-500">ยังไม่มีข้อมูลโครงสร้าง{canEdit ? ' กด "เพิ่มบุคลากร" เพื่อเริ่ม' : ''}</div>
      )}

      {results ? (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {results.length === 0 && <div className="text-sm text-slate-500 py-8">ไม่พบ "{q}"</div>}
          {results.map(p => <MemberCard key={p.id} p={p} url={urls[p.photo]} onOpen={onOpen} />)}
        </div>
      ) : view === 'tree' && top ? (
        <div className="space-y-5">
          <LeadCard p={top} url={urls[top.photo]} onOpen={onOpen} size="lg" />
          {deputies.length > 0 && (
            <>
              <div className="hidden md:block mx-auto h-5 w-px bg-slate-300 dark:bg-white/15" aria-hidden="true" />
              <div className={`grid gap-5 ${deputies.length >= 3 ? 'md:grid-cols-3' : deputies.length === 2 ? 'md:grid-cols-2' : ''} items-start`}>
                {deputies.map(d => (
                  <div key={d.id} className="space-y-4">
                    <LeadCard p={d} url={urls[d.photo]} onOpen={onOpen} />
                    {(kids.get(d.id) ?? []).map(head => (
                      <SectionBlock key={head.id} head={head} members={descendants(head.id)} urls={urls} onOpen={onOpen} />
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}
          {/* คนที่ไม่ได้อยู่ใต้ผัง (เช่น เพิ่มใหม่ยังไม่ได้ระบุผู้บังคับบัญชา) */}
          {roots.length > 1 && (
            <section className="rounded-3xl border border-dashed border-slate-300 dark:border-white/15 p-4">
              <h3 className="mb-3 text-sm font-black text-slate-500">ยังไม่ได้ระบุผู้บังคับบัญชา</h3>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {roots.slice(1).map(p => <MemberCard key={p.id} p={p} url={urls[p.photo]} onOpen={onOpen} />)}
              </div>
            </section>
          )}
        </div>
      ) : staff.length > 0 ? (
        <div className="space-y-5">
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            {sorted.filter(p => p.section === 'command').map(p => (
              <LeadCard key={p.id} p={p} url={urls[p.photo]} onOpen={onOpen} />
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 items-start">
            {WORK_SECTIONS.map(s => {
              const people = sorted.filter(p => p.section === s);
              const head = people.find(p => !people.some(o => o.id === p.parent)) ?? people[0];
              if (!head) return null;
              return <SectionBlock key={s} head={head} members={people.filter(p => p !== head)} urls={urls} onOpen={onOpen} />;
            })}
          </div>
        </div>
      ) : null}

      {open && (
        <PersonDialog
          key={open.p.id}
          person={open.p}
          isNew={open.isNew}
          all={staff}
          url={urls[open.p.photo]}
          canEdit={canEdit}
          onClose={() => setOpen(null)}
          onSave={save}
          onDelete={remove}
        />
      )}
    </div>
  );
};

function emptyPerson(parent: string | null, order: number) {
  return empty('admin', parent, order + 1);
}
