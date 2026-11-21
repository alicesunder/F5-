import React, { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Search, MessageSquareText, Image as ImageIcon, CheckCircle2, ChevronLeft, AlertTriangle, RefreshCw, Users, Inbox, Clock3,
  Sparkles, FileText, Paperclip, X,
} from 'lucide-react';
import { LineGroupsPanel } from './LineGroupsPanel';
import { lineReportService, LineReportsLoadState } from '../../services/lineReportService';
import { isWorkMessage } from '../../lib/lineChatFilter';
import {
  LINE_DEPT_META,
  LINE_STATUS_META,
  LineDept,
  LineReport,
  LineReportDept,
  LineReportStatus,
} from '../../data/lineReportsData';

interface Props {
  /** ล็อกให้เห็นเฉพาะแผนกนี้ (ใช้ในเมนูย่อยของแต่ละสายงาน) ถ้าไม่ส่งมาคือมุมมองกลาง */
  dept?: LineDept;
}

const LINE_GREEN = '#06C755';
const DEPT_ORDER: LineReportDept[] = ['admin', 'relations', 'disaster', 'volunteer', 'unassigned'];
const STATUS_ORDER: LineReportStatus[] = ['new', 'acknowledged', 'in_progress', 'done'];
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const NO_GROUP = 'ไม่ทราบชื่อกลุ่ม';

const formatWhen = (iso: string) => {
  const d = new Date(iso);
  const sameDay = d.toDateString() === new Date().toDateString();
  const time = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  return sameDay ? `วันนี้ ${time} น.` : `${d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} ${time} น.`;
};

/** สีประจำกลุ่ม (คงที่ตามชื่อ) ใช้แยกกลุ่มด้วยตา */
const GROUP_COLORS = ['#06C755', '#2583D8', '#E89B22', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1'];
const groupColor = (name: string) => {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return GROUP_COLORS[h % GROUP_COLORS.length];
};
/** อักษรย่อของกลุ่ม: ตัวอักษรไทย/อังกฤษตัวแรกที่ไม่ใช่อีโมจิ */
const groupInitial = (name: string) => {
  const m = name.match(/[\p{L}\p{N}]/u);
  return m ? m[0].toUpperCase() : '#';
};

const GroupAvatar: React.FC<{ name: string; size?: number }> = ({ name, size = 28 }) => (
  <span
    aria-hidden="true"
    className="inline-flex items-center justify-center rounded-full font-black text-white shrink-0"
    style={{ width: size, height: size, fontSize: size * 0.42, background: `linear-gradient(135deg, ${groupColor(name)}, ${groupColor(name)}aa)` }}
  >
    {groupInitial(name)}
  </span>
);

export const useLineReports = (): { reports: LineReport[]; state: LineReportsLoadState; error: string } => {
  const version = useSyncExternalStore(
    cb => lineReportService.subscribe(cb),
    () => lineReportService.getVersion()
  );
  return useMemo(
    () => ({ reports: lineReportService.getAll(), ...lineReportService.getState() }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version]
  );
};

const useSignedUrls = (paths: string[]): string[] => {
  const key = paths.join('|');
  const [urls, setUrls] = useState<string[]>([]);
  useEffect(() => {
    let alive = true;
    setUrls([]);
    if (paths.length) {
      lineReportService.getMediaUrls(paths).then(u => alive && setUrls(u));
    }
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return urls;
};

const DeptBadge: React.FC<{ dept: LineReportDept }> = ({ dept }) => (
  <span
    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white whitespace-nowrap"
    style={{ backgroundColor: LINE_DEPT_META[dept].color }}
  >
    {LINE_DEPT_META[dept].label}
  </span>
);

const TypeIcon: React.FC<{ r: LineReport }> = ({ r }) =>
  r.messageType === 'file' ? <FileText className="w-3.5 h-3.5" /> : r.imageCount > 0 ? <ImageIcon className="w-3.5 h-3.5" /> : null;

export const LineReportsView: React.FC<Props> = ({ dept }) => {
  const { reports: allRaw, state, error } = useLineReports();
  const [deptFilter, setDeptFilter] = useState<LineReportDept | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<LineReportStatus | 'all'>('all');
  const [query, setQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ตัดข้อความคุยเล่นออก (ข้อความใหม่ถูกกรองที่ฝั่งรับอยู่แล้ว ตรงนี้ซ่อนของเก่าที่เคยเข้ามา)
  const all = useMemo(
    () => allRaw.filter(r => isWorkMessage({ text: r.text, messageType: r.messageType, dept: r.dept, unit: r.unit })),
    [allRaw]
  );
  const scoped = useMemo(() => (dept ? all.filter(r => r.dept === dept) : all), [all, dept]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scoped.filter(r => {
      if (!dept && deptFilter !== 'all' && r.dept !== deptFilter) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (groupFilter !== 'all' && (r.groupName || NO_GROUP) !== groupFilter) return false;
      if (!q) return true;
      return [r.text, r.senderName, r.unit, r.groupName].some(v => v?.toLowerCase().includes(q));
    });
  }, [scoped, deptFilter, statusFilter, groupFilter, query, dept]);

  // กลุ่ม LINE ที่มีรายงานเข้ามา พร้อมจำนวน
  const groups = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of scoped) m.set(r.groupName || NO_GROUP, (m.get(r.groupName || NO_GROUP) || 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [scoped]);

  const selected = visible.find(r => r.id === selectedId) || null;
  const detailRef = React.useRef<HTMLDivElement>(null);
  // มือถือ: แตะรายการแล้วเลื่อนไปที่รายละเอียดทันที
  useEffect(() => {
    if (selectedId && window.innerWidth < 1024) detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selectedId]);
  const imageUrls = useSignedUrls(selected?.mediaPaths ?? []);
  const countBy = <K extends string>(key: (r: LineReport) => K, value: K) => scoped.filter(r => key(r) === value).length;

  const today = scoped.filter(r => new Date(r.receivedAt).toDateString() === new Date().toDateString()).length;
  const fresh = countBy(r => r.status, 'new' as LineReportStatus);
  const hiddenChat = allRaw.length - all.length;

  const chip = (active: boolean) =>
    `shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
      active
        ? 'bg-[#5B2A86] border-[#5B2A86] text-white shadow-md shadow-violet-500/25'
        : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-[#5B2A86]'
    }`;

  const stats = [
    { icon: Inbox, label: 'ทั้งหมด', n: scoped.length, c: '#5B2A86' },
    { icon: Sparkles, label: 'ใหม่ ยังไม่รับทราบ', n: fresh, c: '#E11D48' },
    { icon: Clock3, label: 'เข้ามาวันนี้', n: today, c: '#2583D8' },
    { icon: Users, label: 'กลุ่ม LINE', n: groups.length, c: LINE_GREEN },
  ];

  return (
    <section className="space-y-4" aria-label="รายงานจาก LINE">
      {/* ฮีโร่ */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="relative overflow-hidden rounded-3xl p-4 sm:p-5 text-white"
        style={{ background: 'linear-gradient(135deg, #064E3B 0%, #065F46 40%, #0F766E 100%)' }}
      >
        <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(6,199,85,0.55), transparent 65%)' }} />
        <span aria-hidden="true" className="pointer-events-none absolute -left-10 -bottom-24 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.4), transparent 65%)' }} />
        <div className="relative flex flex-wrap items-center gap-3">
          <motion.div
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 14, delay: 0.1 }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ring-4 ring-white/20"
            style={{ backgroundColor: LINE_GREEN }}
          >
            <MessageSquareText className="w-6 h-6 text-white" />
          </motion.div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-black leading-tight" style={{ color: '#fff' }}>
              รายงานจาก LINE{dept ? ` · ${LINE_DEPT_META[dept].label}` : ''}
            </h2>
            <p className="text-xs sm:text-sm" style={{ color: '#D1FAE5' }}>
              เฉพาะข้อความที่เป็นเรื่องงาน · ระบบกรองข้อความคุยเล่นออกให้อัตโนมัติ และจัดเข้าแผนกให้
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="ค้นหาข้อความ ผู้ส่ง หน่วย กลุ่ม"
              className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-white/20 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-white/30"
            />
          </div>
        </div>
        <div className="relative mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE, delay: 0.2 + i * 0.06 }}
              className="rounded-2xl px-3 py-2.5 flex items-center gap-3"
              style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)' }}
            >
              <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.c}`, boxShadow: `0 0 18px ${s.c}88` }}>
                <s.icon className="w-4.5 h-4.5 text-white" />
              </span>
              <div className="min-w-0">
                <div className="text-2xl font-black leading-none tabular-nums" style={{ color: '#fff' }}>{s.n}</div>
                <div className="text-[11px] font-semibold truncate" style={{ color: '#D1FAE5' }}>{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.header>

      {!dept && <LineGroupsPanel />}

      {state === 'loading' && all.length === 0 && (
        <div role="status" className="rounded-xl border border-slate-200 dark:border-white/10 px-3 py-2 text-xs text-slate-500">
          กำลังโหลดรายงาน...
        </div>
      )}

      {state === 'error' && (
        <div role="alert" className="flex flex-wrap items-center gap-2 rounded-xl border border-rose-300/60 bg-rose-50 dark:bg-rose-500/10 px-3 py-2 text-xs text-rose-800 dark:text-rose-200">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="flex-1 min-w-[12rem]">โหลดหรือบันทึกรายงานไม่สำเร็จ: {error}</span>
          <button
            type="button"
            onClick={() => void lineReportService.reload()}
            className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            ลองใหม่
          </button>
        </div>
      )}

      {/* กลุ่ม LINE: แถบเลือกกลุ่มที่เห็นชื่อชัด */}
      {groups.length > 0 && (
        <div role="group" aria-label="กรองตามกลุ่ม LINE">
          <div className="mb-1.5 text-[11px] font-bold tracking-wide text-slate-500 dark:text-slate-400">มาจากกลุ่ม</div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => setGroupFilter('all')}
              aria-pressed={groupFilter === 'all'}
              className={`shrink-0 inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-bold cursor-pointer transition ${
                groupFilter === 'all'
                  ? 'border-[#06C755] bg-[#06C755]/10 text-slate-900 dark:text-white ring-2 ring-[#06C755]/30'
                  : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:border-[#06C755]'
              }`}
            >
              ทุกกลุ่ม <span className="rounded-full bg-slate-100 dark:bg-white/10 px-1.5 text-[11px]">{scoped.length}</span>
            </button>
            {groups.map(([g, n]) => {
              const on = groupFilter === g;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGroupFilter(on ? 'all' : g)}
                  aria-pressed={on}
                  title={g}
                  className={`shrink-0 max-w-[16rem] inline-flex items-center gap-2 rounded-2xl border px-2.5 py-1.5 text-xs font-bold cursor-pointer transition ${
                    on
                      ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white ring-2'
                      : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:-translate-y-0.5'
                  }`}
                  style={on ? { borderColor: groupColor(g), boxShadow: `0 0 0 2px ${groupColor(g)}55` } : undefined}
                >
                  <GroupAvatar name={g} size={24} />
                  <span className="truncate">{g}</span>
                  <span className="rounded-full bg-slate-100 dark:bg-white/10 px-1.5 text-[11px] shrink-0">{n}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto no-scrollbar sm:flex-wrap -mx-1 px-1 pb-1" role="group" aria-label="กรองตามแผนกและสถานะ">
        {!dept && (
          <>
            <button type="button" className={chip(deptFilter === 'all')} onClick={() => setDeptFilter('all')}>
              ทุกแผนก {scoped.length}
            </button>
            {DEPT_ORDER.map(d => (
              <button key={d} type="button" className={chip(deptFilter === d)} onClick={() => setDeptFilter(d)}>
                {LINE_DEPT_META[d].label} {countBy(r => r.dept, d)}
              </button>
            ))}
            <span className="w-px shrink-0 bg-slate-200 dark:bg-white/10 mx-1" aria-hidden="true" />
          </>
        )}
        <button type="button" className={chip(statusFilter === 'all')} onClick={() => setStatusFilter('all')}>
          ทุกสถานะ
        </button>
        {STATUS_ORDER.map(s => (
          <button key={s} type="button" className={chip(statusFilter === s)} onClick={() => setStatusFilter(s)}>
            {LINE_STATUS_META[s].label} {countBy(r => r.status, s)}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 items-start">
        <ul className={`space-y-2.5 ${selected ? 'hidden lg:block' : ''}`}>
          {visible.length === 0 && state !== 'loading' && (
            <li className="rounded-2xl border border-dashed border-slate-300 dark:border-white/15 p-8 text-center text-sm text-slate-500">
              {all.length === 0 ? 'ยังไม่มีรายงานจาก LINE' : 'ไม่พบรายงานตามตัวกรองนี้'}
            </li>
          )}
          <AnimatePresence initial={false}>
            {visible.map((r, i) => {
              const g = r.groupName || NO_GROUP;
              const gc = groupColor(g);
              const on = selectedId === r.id;
              return (
                <motion.li
                  key={r.id}
                  layout="position"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.4, ease: EASE, delay: Math.min(i, 10) * 0.035 }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(r.id)}
                    className={`group relative w-full text-left rounded-2xl border p-3 pl-4 transition cursor-pointer bg-white dark:bg-white/5 overflow-hidden hover:-translate-y-0.5 hover:shadow-lg ${
                      on ? 'border-[#5B2A86] ring-2 ring-[#5B2A86]/25 shadow-lg' : 'border-slate-200 dark:border-white/10'
                    }`}
                  >
                    <span aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: gc }} />
                    {/* ป้ายกลุ่มที่มา */}
                    <div className="flex items-center gap-2 mb-2">
                      <GroupAvatar name={g} size={22} />
                      <span className="text-[12px] font-black text-slate-800 dark:text-slate-100 truncate" title={g}>{g}</span>
                      {r.status === 'new' && <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 animate-pulse" aria-label="ใหม่" />}
                      <span className="ml-auto shrink-0"><DeptBadge dept={r.dept} /></span>
                    </div>
                    <p className="text-sm text-slate-900 dark:text-slate-100 line-clamp-2">{r.text}</p>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className={`px-2 py-0.5 rounded-full font-bold ${LINE_STATUS_META[r.status].tone}`}>
                        {LINE_STATUS_META[r.status].label}
                      </span>
                      <span className="truncate font-semibold">{r.senderName}</span>
                      {r.unit && <span className="truncate text-slate-400">· {r.unit}</span>}
                      <span className="ml-auto shrink-0 inline-flex items-center gap-1.5">
                        <TypeIcon r={r} />
                        {r.imageCount > 0 && r.messageType !== 'file' && r.imageCount}
                        {formatWhen(r.receivedAt)}
                      </span>
                    </div>
                  </button>
                </motion.li>
              );
            })}
          </AnimatePresence>
          {hiddenChat > 0 && (
            <li className="text-center text-[11px] text-slate-400 pt-1">
              ซ่อนข้อความคุยเล่นที่เคยเข้ามาแล้ว {hiddenChat} รายการ
            </li>
          )}
        </ul>

        <div ref={detailRef} className={`${selected ? '' : 'hidden lg:block'} lg:sticky lg:top-4 scroll-mt-16`}>
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.article
                key={selected.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden"
              >
                {/* แบนเนอร์ชื่อกลุ่ม */}
                <div className="px-4 sm:px-5 py-3 flex items-center gap-3 text-white" style={{ background: `linear-gradient(120deg, ${groupColor(selected.groupName || NO_GROUP)}, ${groupColor(selected.groupName || NO_GROUP)}99)` }}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    className="lg:hidden inline-flex items-center gap-1 text-xs font-bold cursor-pointer"
                    style={{ color: '#fff' }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    กลับ
                  </button>
                  <span className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center font-black shrink-0" style={{ color: '#fff' }}>
                    {groupInitial(selected.groupName || NO_GROUP)}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold tracking-widest uppercase opacity-80" style={{ color: '#fff' }}>ข้อความนี้มาจากกลุ่ม</div>
                    <div className="text-sm sm:text-base font-black truncate" style={{ color: '#fff' }}>{selected.groupName || NO_GROUP}</div>
                  </div>
                  <button type="button" onClick={() => setSelectedId(null)} className="hidden lg:inline-flex ml-auto p-1.5 rounded-full hover:bg-white/20 cursor-pointer" aria-label="ปิด" style={{ color: '#fff' }}>
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 sm:p-5 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <DeptBadge dept={selected.dept} />
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${LINE_STATUS_META[selected.status].tone}`}>
                      {LINE_STATUS_META[selected.status].label}
                    </span>
                    {selected.unit && <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200">{selected.unit}</span>}
                  </div>

                  {/* ข้อความแบบฟองแชต */}
                  <div className="flex items-start gap-2.5">
                    <span className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black shrink-0" style={{ background: LINE_GREEN }}>
                      {(selected.senderName || '?').slice(0, 1)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-200">{selected.senderName} <span className="font-medium text-slate-400">· {formatWhen(selected.receivedAt)}</span></div>
                      <div className="mt-1 rounded-2xl rounded-tl-sm bg-slate-100 dark:bg-white/10 px-3.5 py-3 text-sm sm:text-[15px] text-slate-900 dark:text-slate-100 whitespace-pre-wrap leading-relaxed break-words">
                        {selected.text}
                      </div>
                    </div>
                  </div>

                  {imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {imageUrls.map(u => (
                        <a key={u} href={u} target="_blank" rel="noreferrer">
                          <img src={u} alt="รูปที่แนบจาก LINE" loading="lazy" className="w-full rounded-2xl border border-slate-200 dark:border-white/10 object-cover max-h-64 hover:scale-[1.02] transition" />
                        </a>
                      ))}
                    </div>
                  )}

                  <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <dt className="font-bold">รูปที่แนบ</dt>
                    <dd className="inline-flex items-center gap-1">{selected.imageCount > 0 ? <><Paperclip className="w-3 h-3" />{selected.imageCount} รูป</> : 'ไม่มี'}</dd>
                    <dt className="font-bold">จัดแผนกโดย</dt>
                    <dd>{selected.matchedKeyword ? `คำสำคัญ "${selected.matchedKeyword}"` : 'ตามกลุ่ม / ผู้ใช้ระบุเอง'}</dd>
                  </dl>

                  <div className="flex flex-wrap gap-2">
                    {selected.status === 'new' && (
                      <button
                        type="button"
                        onClick={() => lineReportService.setStatus(selected.id, 'acknowledged')}
                        className="px-3.5 py-2 rounded-xl bg-[#5B2A86] text-white text-xs font-bold cursor-pointer hover:bg-[#7B3FC6] active:scale-95 transition"
                      >
                        รับทราบ
                      </button>
                    )}
                    {(selected.status === 'new' || selected.status === 'acknowledged') && (
                      <button
                        type="button"
                        onClick={() => lineReportService.setStatus(selected.id, 'in_progress')}
                        className="px-3.5 py-2 rounded-xl border border-[#5B2A86] text-[#5B2A86] dark:text-purple-300 text-xs font-bold cursor-pointer active:scale-95 transition"
                      >
                        เริ่มดำเนินการ
                      </button>
                    )}
                    {selected.status !== 'done' && (
                      <button
                        type="button"
                        onClick={() => lineReportService.setStatus(selected.id, 'done')}
                        className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-emerald-500 text-emerald-700 dark:text-emerald-300 text-xs font-bold cursor-pointer active:scale-95 transition"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        เสร็จสิ้น
                      </button>
                    )}
                    {selected.status === 'done' && (
                      <button
                        type="button"
                        onClick={() => lineReportService.setStatus(selected.id, 'in_progress')}
                        className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-white/20 text-xs font-bold cursor-pointer"
                      >
                        เปิดงานอีกครั้ง
                      </button>
                    )}
                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 ml-auto">
                      ย้ายแผนก
                      <select
                        value={selected.dept}
                        onChange={e => lineReportService.moveToDept(selected.id, e.target.value as LineReportDept)}
                        className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151821] px-2 py-1.5 text-xs"
                      >
                        {DEPT_ORDER.map(d => (
                          <option key={d} value={d}>
                            {LINE_DEPT_META[d].label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                    บันทึกการดำเนินการ
                    <textarea
                      key={selected.id}
                      defaultValue={selected.note || ''}
                      onBlur={e => lineReportService.setNote(selected.id, e.target.value)}
                      rows={3}
                      placeholder="เช่น ประสานหน่วยแล้ว รอผลภายในวันนี้"
                      className="mt-1 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-2 text-sm font-normal text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#5B2A86]/25"
                    />
                  </label>
                </div>
              </motion.article>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl border border-dashed border-slate-300 dark:border-white/15 p-10 text-center text-sm text-slate-500"
              >
                <MessageSquareText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                เลือกรายงานจากรายการเพื่อดูรายละเอียด
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
