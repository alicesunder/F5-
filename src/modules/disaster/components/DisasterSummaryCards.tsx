import React from 'react';
import { DisasterStats, DisasterIncident } from '../types';
import {
  AlertTriangle,
  Activity,
  MapPin,
  Users,
  ArrowUpRight,
  Clock,
} from 'lucide-react';

interface DisasterSummaryCardsProps {
  stats: DisasterStats;
  latestIncident?: DisasterIncident;
  onSelectIncident?: (incident: DisasterIncident) => void;
  onFilterStatus?: (status: string) => void;
}

export const DisasterSummaryCards: React.FC<DisasterSummaryCardsProps> = ({
  stats,
  latestIncident,
  onSelectIncident,
  onFilterStatus,
}) => {
  const primaryColor = '#E89B22';

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. เหตุการณ์ทั้งหมด */}
      <div
        onClick={() => onFilterStatus?.('all')}
        className="p-5 rounded-2xl liquid-glass-card iridescent-edge hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#E89B22]" />
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 text-xs font-bold">
          <span>1. เหตุการณ์ทั้งหมด</span>
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-[#E89B22] flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
              {stats.totalIncidents}
            </span>
            <span className="text-xs text-slate-500 font-medium">เหตุการณ์</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-[11px] font-mono">
            <span className="text-rose-600 font-bold">{stats.criticalCount} วิกฤต</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-600 font-bold">{stats.resolvedCount} เสร็จสิ้น</span>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 text-[11px] text-slate-500 flex items-center justify-between">
          <span>บันทึกในระบบปี 2569</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* 2. เหตุการณ์กำลังดำเนินการ */}
      <div
        onClick={() => onFilterStatus?.('กำลังดำเนินการ')}
        className="p-5 rounded-2xl liquid-glass-card iridescent-edge hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 text-xs font-bold">
          <span>2. กำลังดำเนินการ</span>
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
        </div>
        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 font-mono tabular-nums tracking-tight">
              {stats.inProgressIncidents}
            </span>
            <span className="text-xs text-slate-500 font-medium">พื้นที่</span>
          </div>
          <p className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold mt-1.5 line-clamp-1">
            กำลังระดมกำลังพลและเครื่องจักร
          </p>
        </div>
        <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="text-amber-600 font-bold">ชุดปฏิบัติการเข้าพื้นที่แล้ว</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* 3. พื้นที่เฝ้าระวัง */}
      <div className="p-5 rounded-2xl liquid-glass-card iridescent-edge hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 text-xs font-bold">
          <span>3. พื้นที่เฝ้าระวัง</span>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <MapPin className="w-4 h-4" />
          </div>
        </div>
        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
              {stats.watchAreasCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">จุดวิกฤต</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-1">
            จุดเฝ้าระวังและพื้นที่เสี่ยงที่บันทึกไว้
          </p>
        </div>
        <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 text-[11px] text-slate-500 flex items-center justify-between font-mono">
          <span>จุดเฝ้าระวังบนแผนที่</span>
          <span />
        </div>
      </div>

      {/* 4. พื้นที่ได้รับผลกระทบ */}
      <div className="p-5 rounded-2xl liquid-glass-card iridescent-edge hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-sky-500" />
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 text-xs font-bold">
          <span>4. พื้นที่ได้รับผลกระทบ</span>
          <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
              {stats.affectedHouseholdsTotal.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-medium">ครัวเรือน</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            ประชาชน {stats.affectedPeopleTotal.toLocaleString()} ราย
          </p>
        </div>
        <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 text-[11px] text-slate-500 flex items-center justify-between">
          <span>รวมจากเหตุที่บันทึก</span>
          <span />
        </div>
      </div>

      {/* 5. รายงานล่าสุด */}
      <div
        onClick={() => latestIncident && onSelectIncident?.(latestIncident)}
        className={`p-5 rounded-2xl liquid-glass-card iridescent-edge hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${latestIncident ? 'cursor-pointer' : ''}`}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-amber-500" />
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 text-xs font-bold">
          <span className="inline-flex items-center gap-1.5">
            <span className="relative flex w-2 h-2">
              {latestIncident && <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-60" />}
              <span className={`relative w-2 h-2 rounded-full ${latestIncident ? 'bg-rose-500' : 'bg-slate-300'}`} />
            </span>
            5. รายงานล่าสุด
          </span>
          <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="my-3">
          {latestIncident ? (
            <>
              <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">{latestIncident.title}</p>
              <p className="text-[11px] text-slate-500 mt-1">จ.{latestIncident.province} • อ.{latestIncident.district}</p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-slate-400">ยังไม่มีรายงานเหตุใหม่</p>
              <p className="text-[11px] text-slate-400 mt-1">เหตุที่บันทึกจะแสดงที่นี่</p>
            </>
          )}
        </div>
        <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 text-[11px] text-slate-500 flex items-center justify-between">
          <span className={latestIncident ? 'text-rose-600 font-bold' : ''}>{latestIncident ? 'กดเพื่อดูรายละเอียด' : 'รอรายงาน'}</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>
    </section>
  );
};
