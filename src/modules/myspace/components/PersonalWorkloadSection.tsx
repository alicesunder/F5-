import React, { useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Filter,
  ArrowUpRight,
  Shield,
  FileText,
} from 'lucide-react';
import { useMyCollection } from '../../../lib/collections';

interface WorkloadTask {
  id: string;
  title: string;
  category: 'มวลชนสัมพันธ์' | 'งานสารบรรณ' | 'งานภาพนิ่ง/วิดีโอ' | 'รายงานสถานการณ์' | 'ประสานงาน';
  status: 'กำลังทำ' | 'เสร็จแล้ว' | 'งานค้าง' | 'ใกล้ครบกำหนด';
  deadline: string;
  assigner: string;
  priority: 'สูง' | 'ปานกลาง' | 'ปกติ';
}


export const PersonalWorkloadSection: React.FC = () => {
  const [tasks, setTasks] = useMyCollection<WorkloadTask>('workload');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const totalCount = tasks.length;
  const inProgressCount = tasks.filter(t => t.status === 'กำลังทำ').length;
  const completedCount = tasks.filter(t => t.status === 'เสร็จแล้ว').length;
  const pendingCount = tasks.filter(t => t.status === 'งานค้าง').length;
  const dueSoonCount = tasks.filter(t => t.status === 'ใกล้ครบกำหนด').length;

  const filteredTasks = tasks.filter(t => {
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  return (
    <div className="rounded-3xl p-5 sm:p-7 bg-white/90 dark:bg-[#151A22]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              งานที่ได้รับมอบหมาย
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            ภารกิจและงานของฉัน (Personal Workload)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ติดตามสถานะงานที่ได้รับมอบหมายจากผู้บังคับบัญชา และกำหนดเวลาส่งมอบ
          </p>
        </div>
      </div>

      {/* KPI Workload Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* All */}
        <button
          type="button"
          onClick={() => setFilterStatus('all')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            filterStatus === 'all'
              ? 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-400 dark:border-blue-500'
              : 'bg-slate-50/80 dark:bg-white/5 border-slate-200/80 dark:border-white/10'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">งานทั้งหมด</div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{totalCount}</div>
        </button>

        {/* In Progress */}
        <button
          type="button"
          onClick={() => setFilterStatus('กำลังทำ')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            filterStatus === 'กำลังทำ'
              ? 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-400 dark:border-blue-500'
              : 'bg-slate-50/80 dark:bg-white/5 border-slate-200/80 dark:border-white/10'
          }`}
        >
          <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">กำลังทำ</div>
          <div className="text-xl font-black text-blue-700 dark:text-blue-300 mt-0.5">{inProgressCount}</div>
        </button>

        {/* Completed */}
        <button
          type="button"
          onClick={() => setFilterStatus('เสร็จแล้ว')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            filterStatus === 'เสร็จแล้ว'
              ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-500'
              : 'bg-slate-50/80 dark:bg-white/5 border-slate-200/80 dark:border-white/10'
          }`}
        >
          <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">เสร็จแล้ว</div>
          <div className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-0.5">{completedCount}</div>
        </button>

        {/* Due Soon */}
        <button
          type="button"
          onClick={() => setFilterStatus('ใกล้ครบกำหนด')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            filterStatus === 'ใกล้ครบกำหนด'
              ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-400 dark:border-amber-500'
              : 'bg-slate-50/80 dark:bg-white/5 border-slate-200/80 dark:border-white/10'
          }`}
        >
          <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">ใกล้ครบกำหนด</div>
          <div className="text-xl font-black text-amber-700 dark:text-amber-300 mt-0.5">{dueSoonCount}</div>
        </button>

        {/* Overdue */}
        <button
          type="button"
          onClick={() => setFilterStatus('งานค้าง')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            filterStatus === 'งานค้าง'
              ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-400 dark:border-rose-500'
              : 'bg-slate-50/80 dark:bg-white/5 border-slate-200/80 dark:border-white/10'
          }`}
        >
          <div className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">งานค้าง</div>
          <div className="text-xl font-black text-rose-700 dark:text-rose-300 mt-0.5">{pendingCount}</div>
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map(task => {
          const isCompleted = task.status === 'เสร็จแล้ว';
          const isDueSoon = task.status === 'ใกล้ครบกำหนด';

          return (
            <div
              key={task.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#1A1F29]/60 border border-slate-200/80 dark:border-white/10 hover:border-blue-400/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                    {task.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {task.id}
                  </span>
                  {task.priority === 'สูง' && (
                    <span className="px-1.5 py-0.2 rounded bg-rose-500 text-white text-[10px] font-bold">
                      สำคัญมาก
                    </span>
                  )}
                </div>

                <h3
                  className={`text-sm font-bold ${
                    isCompleted ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {task.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>ผู้มอบหมาย: {task.assigner}</span>
                  <span>•</span>
                  <span className={`flex items-center gap-1 ${isDueSoon ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}`}>
                    <Clock className="w-3 h-3" />
                    กำหนดส่ง: {task.deadline}
                  </span>
                </div>
              </div>

              <div className="self-end sm:self-center flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-xl text-xs font-bold ${
                    isCompleted
                      ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                      : isDueSoon
                      ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
                      : 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'
                  }`}
                >
                  {task.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
