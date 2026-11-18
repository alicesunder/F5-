import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  MapPin,
  FileCheck,
  Calendar,
  Send,
  Plus,
} from 'lucide-react';
import { useMyCollection } from '../../../lib/collections';

export const TodayScheduleSection: React.FC = () => {
  const [items, setItems] = useMyCollection<{ id: string; completed?: boolean; [k: string]: any }>('schedule');

  const toggleComplete = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedCount = items.filter(i => i.completed).length;
  const progressPercent = (items.length ? Math.round((completedCount / items.length) * 100) : 0);

  return (
    <div className="rounded-3xl p-5 sm:p-7 bg-white/90 dark:bg-[#151A22]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-md space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              ภารกิจประจำวัน
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            วันนี้ของฉัน (Today for Me)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            กำหนดการ ภารกิจ นัดหมาย และกำหนดส่งรายงานประจำวัน (จัดเรียงตามลำดับเวลา)
          </p>
        </div>

        {/* Completion Progress Metric */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 px-3.5 py-2 rounded-2xl border border-slate-200/60 dark:border-white/5">
          <div className="text-right">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              ความคืบหน้าวันนี้
            </div>
            <div className="text-xs font-black text-slate-800 dark:text-slate-200">
              สำเร็จ {completedCount} จาก {items.length} ภารกิจ ({progressPercent}%)
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center font-black text-xs text-blue-600 dark:text-blue-400 border border-blue-500/20">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-3">
        {items.map((item, index) => {
          const isUrgent = item.urgency === 'เร่งด่วน';
          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                item.completed
                  ? 'bg-slate-50/60 dark:bg-white/[0.02] border-slate-200/50 dark:border-white/5 opacity-70'
                  : isUrgent
                  ? 'bg-amber-50/70 dark:bg-amber-500/10 border-amber-300/80 dark:border-amber-500/30'
                  : 'bg-white dark:bg-[#1A1F29]/60 border-slate-200/80 dark:border-white/10 hover:border-blue-400/40'
              }`}
            >
              {/* Time & Title Info */}
              <div className="flex items-start sm:items-center gap-3.5">
                {/* Checkbox Trigger */}
                <button
                  type="button"
                  onClick={() => toggleComplete(item.id)}
                  className="mt-0.5 sm:mt-0 p-1 rounded-lg text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                  title={item.completed ? 'ทำเครื่องหมายว่ายังไม่เสร็จ' : 'ทำเครื่องหมายว่าเสร็จแล้ว'}
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                  )}
                </button>

                {/* Time Badge */}
                <div className="flex-shrink-0 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{item.time}</span>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold ${
                        item.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {item.title}
                    </span>
                    {isUrgent && (
                      <span className="px-2 py-0.2 rounded-md bg-amber-500 text-white font-black text-[10px] uppercase">
                        เร่งด่วน
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {item.location}
                    </span>
                    {item.deadline && (
                      <span className="text-amber-600 dark:text-amber-400 font-bold">
                        (กำหนดส่ง: {item.deadline} น.)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tag / Category Badge */}
              <div className="flex items-center gap-2 self-end sm:self-center pl-10 sm:pl-0">
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                  {item.type}
                </span>
                {item.completed ? (
                  <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    เสร็จสิ้น
                  </span>
                ) : (
                  <span className="text-blue-600 dark:text-blue-400 text-xs font-semibold">
                    รอทำ
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
