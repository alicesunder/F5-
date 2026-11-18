import React, { useCallback, useEffect, useState } from 'react';
import { Settings2, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { LINE_DEPT_META, LineDept } from '../../data/lineReportsData';

interface GroupRow {
  group_id: string;
  name: string | null;
  dept: LineDept | null;
}

const DEPTS = Object.keys(LINE_DEPT_META).filter(k => k !== 'unassigned') as LineDept[];

/** ผูกกลุ่ม LINE ที่บอทเข้าไปอยู่กับแผนก กลุ่มที่ผูกแล้ว ข้อความทุกข้อความจะเข้าแผนกนั้นเสมอ */
export const LineGroupsPanel: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<GroupRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: e } = await supabase.from('line_groups').select('group_id, name, dept').order('created_at');
    setLoading(false);
    if (e) return setError(e.message);
    setError('');
    setRows((data ?? []) as GroupRow[]);
  }, []);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  const save = async (id: string, patch: Partial<GroupRow>) => {
    setSavingId(id);
    const { error: e } = await supabase.from('line_groups').update(patch).eq('group_id', id);
    setSavingId('');
    if (e) return setError(`บันทึกไม่สำเร็จ: ${e.message}`);
    setError('');
    setRows(prev => prev.map(r => (r.group_id === id ? { ...r, ...patch } : r)));
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
      >
        <Settings2 className="w-4 h-4" /> ตั้งค่ากลุ่ม LINE → แผนก
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2">
          {loading && (
            <p role="status" className="text-xs text-slate-500 flex items-center gap-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> กำลังโหลด...
            </p>
          )}
          {error && <p role="alert" className="text-xs text-rose-600">{error}</p>}
          {!loading && rows.length === 0 && !error && (
            <p className="text-xs text-slate-500">
              ยังไม่มีกลุ่ม: เมื่อดึงบอทเข้ากลุ่ม LINE และมีคนพิมพ์ข้อความครั้งแรก กลุ่มจะปรากฏที่นี่เอง
            </p>
          )}
          {rows.map(r => (
            <div key={r.group_id} className="flex flex-wrap items-center gap-2 text-xs">
              <span className="flex-1 min-w-[10rem] font-semibold text-slate-800 dark:text-slate-100 break-words">
                {r.name || r.group_id}
              </span>
              <label className="sr-only" htmlFor={`g-${r.group_id}`}>แผนกของกลุ่ม {r.name || r.group_id}</label>
              <select
                id={`g-${r.group_id}`}
                disabled={savingId === r.group_id}
                value={r.dept ?? ''}
                onChange={e => void save(r.group_id, { dept: (e.target.value || null) as LineDept | null })}
                className="px-2 py-1 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151A22] text-xs"
              >
                <option value="">ให้ระบบเดาจากคำสำคัญ</option>
                {DEPTS.map(d => (
                  <option key={d} value={d}>{LINE_DEPT_META[d].label}</option>
                ))}
              </select>
            </div>
          ))}
          <p className="text-[11px] text-slate-500">การผูกมีผลกับข้อความใหม่ ข้อความเก่าย้ายแผนกได้ที่ปุ่ม "ย้ายแผนก" ในรายละเอียด</p>
        </div>
      )}
    </div>
  );
};
