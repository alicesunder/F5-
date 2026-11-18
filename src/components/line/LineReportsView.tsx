import React, { useMemo, useState, useSyncExternalStore } from 'react';
import { Search, MessageSquareText, Image as ImageIcon, CheckCircle2, ChevronLeft, FlaskConical, RotateCcw } from 'lucide-react';
import { lineReportService } from '../../services/lineReportService';
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

const formatWhen = (iso: string) => {
  const d = new Date(iso);
  const sameDay = d.toDateString() === new Date().toDateString();
  const time = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  return sameDay ? `วันนี้ ${time} น.` : `${d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} ${time} น.`;
};

const useReports = (): LineReport[] => {
  const snap = useSyncExternalStore(
    cb => lineReportService.subscribe(cb),
    () => JSON.stringify(lineReportService.getAll())
  );
  return useMemo(() => JSON.parse(snap) as LineReport[], [snap]);
};

const DeptBadge: React.FC<{ dept: LineReportDept }> = ({ dept }) => (
  <span
    className="text-[10px] font-bold px-2 py-0.5 rounded-md text-white whitespace-nowrap"
    style={{ backgroundColor: LINE_DEPT_META[dept].color }}
  >
    {LINE_DEPT_META[dept].label}
  </span>
);

export const LineReportsView: React.FC<Props> = ({ dept }) => {
  const all = useReports();
  const [deptFilter, setDeptFilter] = useState<LineReportDept | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<LineReportStatus | 'all'>('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const scoped = useMemo(() => (dept ? all.filter(r => r.dept === dept) : all), [all, dept]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scoped.filter(r => {
      if (!dept && deptFilter !== 'all' && r.dept !== deptFilter) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (!q) return true;
      return [r.text, r.senderName, r.unit, r.groupName].some(v => v?.toLowerCase().includes(q));
    });
  }, [scoped, deptFilter, statusFilter, query, dept]);

  const selected = visible.find(r => r.id === selectedId) || null;
  const hasSamples = all.some(r => r.isSample);
  const countBy = <K extends string>(key: (r: LineReport) => K, value: K) => scoped.filter(r => key(r) === value).length;

  const chip = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
      active
        ? 'bg-[#5B2A86] border-[#5B2A86] text-white'
        : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-[#5B2A86]'
    }`;

  return (
    <section className="space-y-4" aria-label="รายงานจาก LINE">
      <header className="flex flex-wrap items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
          style={{ backgroundColor: LINE_GREEN }}
        >
          <MessageSquareText className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
            รายงานจาก LINE{dept ? ` · ${LINE_DEPT_META[dept].label}` : ''}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ข้อความที่บอทดึงจากกลุ่ม LINE และจัดเข้าแผนกให้อัตโนมัติ
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="ค้นหาข้อความ ผู้ส่ง หน่วย"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#5B2A86]/25 focus:border-[#5B2A86]"
          />
        </div>
      </header>

      {hasSamples && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-300/60 bg-amber-50 dark:bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
          <FlaskConical className="w-4 h-4 shrink-0" />
          <span className="flex-1 min-w-[12rem]">
            ข้อมูลตัวอย่าง: ยังไม่ได้เชื่อมบอท LINE รายการด้านล่างเป็นข้อความสมมติสำหรับทดสอบหน้าจอ
          </span>
          <button
            type="button"
            onClick={() => lineReportService.resetSamples()}
            className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            รีเซ็ตตัวอย่าง
          </button>
        </div>
      )}

      {!dept && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="กรองตามแผนก">
          <button type="button" className={chip(deptFilter === 'all')} onClick={() => setDeptFilter('all')}>
            ทั้งหมด {scoped.length}
          </button>
          {DEPT_ORDER.map(d => (
            <button key={d} type="button" className={chip(deptFilter === d)} onClick={() => setDeptFilter(d)}>
              {LINE_DEPT_META[d].label} {countBy(r => r.dept, d)}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2" role="group" aria-label="กรองตามสถานะ">
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
        <ul className={`space-y-2 ${selected ? 'hidden lg:block' : ''}`}>
          {visible.length === 0 && (
            <li className="rounded-2xl border border-dashed border-slate-300 dark:border-white/15 p-8 text-center text-sm text-slate-500">
              ไม่พบรายงานตามตัวกรองนี้
            </li>
          )}
          {visible.map(r => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => setSelectedId(r.id)}
                className={`w-full text-left rounded-2xl border p-3 transition cursor-pointer bg-white dark:bg-white/5 ${
                  selectedId === r.id
                    ? 'border-[#5B2A86] ring-2 ring-[#5B2A86]/20'
                    : 'border-slate-200 dark:border-white/10 hover:border-[#5B2A86]/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {r.status === 'new' && <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" aria-label="ใหม่" />}
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{formatWhen(r.receivedAt)}</span>
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 truncate">{r.unit}</span>
                  <span className="ml-auto">
                    <DeptBadge dept={r.dept} />
                  </span>
                </div>
                <p className="text-sm text-slate-900 dark:text-slate-100 line-clamp-2">{r.text}</p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className={`px-2 py-0.5 rounded-md font-semibold ${LINE_STATUS_META[r.status].tone}`}>
                    {LINE_STATUS_META[r.status].label}
                  </span>
                  <span className="truncate">{r.senderName}</span>
                  {r.imageCount > 0 && (
                    <span className="inline-flex items-center gap-1 ml-auto shrink-0">
                      <ImageIcon className="w-3 h-3" />
                      {r.imageCount}
                    </span>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>

        <div className={`${selected ? '' : 'hidden lg:block'} lg:sticky lg:top-4`}>
          {selected ? (
            <article className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 sm:p-5 space-y-4">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="lg:hidden inline-flex items-center gap-1 text-xs font-semibold text-[#5B2A86] dark:text-purple-300 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                กลับไปรายการ
              </button>
              <div className="flex flex-wrap items-center gap-2">
                <DeptBadge dept={selected.dept} />
                <span className={`text-[11px] px-2 py-0.5 rounded-md font-semibold ${LINE_STATUS_META[selected.status].tone}`}>
                  {LINE_STATUS_META[selected.status].label}
                </span>
                {selected.isSample && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                    ข้อมูลตัวอย่าง
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base text-slate-900 dark:text-slate-100 whitespace-pre-wrap leading-relaxed">
                {selected.text}
              </p>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                <dt className="font-semibold">ผู้ส่ง</dt>
                <dd>{selected.senderName}</dd>
                <dt className="font-semibold">หน่วย</dt>
                <dd>{selected.unit || '-'}</dd>
                <dt className="font-semibold">กลุ่ม LINE</dt>
                <dd>{selected.groupName}</dd>
                <dt className="font-semibold">เวลา</dt>
                <dd>{formatWhen(selected.receivedAt)}</dd>
                <dt className="font-semibold">รูปที่แนบ</dt>
                <dd>{selected.imageCount > 0 ? `${selected.imageCount} รูป (จะแสดงเมื่อเชื่อมบอท)` : 'ไม่มี'}</dd>
                <dt className="font-semibold">จัดแผนกโดย</dt>
                <dd>{selected.matchedKeyword ? `คำสำคัญ "${selected.matchedKeyword}"` : 'ผู้ใช้ระบุเอง / ไม่พบคำสำคัญ'}</dd>
              </dl>

              <div className="flex flex-wrap gap-2">
                {selected.status === 'new' && (
                  <button
                    type="button"
                    onClick={() => lineReportService.setStatus(selected.id, 'acknowledged')}
                    className="px-3 py-2 rounded-xl bg-[#5B2A86] text-white text-xs font-bold cursor-pointer hover:bg-[#7B3FC6]"
                  >
                    รับทราบ
                  </button>
                )}
                {(selected.status === 'new' || selected.status === 'acknowledged') && (
                  <button
                    type="button"
                    onClick={() => lineReportService.setStatus(selected.id, 'in_progress')}
                    className="px-3 py-2 rounded-xl border border-[#5B2A86] text-[#5B2A86] dark:text-purple-300 text-xs font-bold cursor-pointer"
                  >
                    เริ่มดำเนินการ
                  </button>
                )}
                {selected.status !== 'done' && (
                  <button
                    type="button"
                    onClick={() => lineReportService.setStatus(selected.id, 'done')}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-emerald-500 text-emerald-700 dark:text-emerald-300 text-xs font-bold cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    เสร็จสิ้น
                  </button>
                )}
                {selected.status === 'done' && (
                  <button
                    type="button"
                    onClick={() => lineReportService.setStatus(selected.id, 'in_progress')}
                    className="px-3 py-2 rounded-xl border border-slate-300 dark:border-white/20 text-xs font-bold cursor-pointer"
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

              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
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
            </article>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/15 p-10 text-center text-sm text-slate-500">
              เลือกรายงานจากรายการเพื่อดูรายละเอียด
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
