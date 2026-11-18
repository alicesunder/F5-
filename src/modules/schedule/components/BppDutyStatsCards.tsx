import React from 'react';
import {
  CalendarDays,
  UserCheck,
  RefreshCw,
  Users2,
  CheckCircle2,
} from 'lucide-react';
import { DutyRosterItem } from '../dutyTypes';

interface BppDutyStatsCardsProps {
  duties: DutyRosterItem[];
  substituteFilter: 'all' | 'substitute_only' | 'normal_only';
  onSelectSubstituteFilter: (filter: 'all' | 'substitute_only' | 'normal_only') => void;
  onSelectOfficer: (officerName: string) => void;
}

export const BppDutyStatsCards: React.FC<BppDutyStatsCardsProps> = ({
  duties,
  substituteFilter,
  onSelectSubstituteFilter,
}) => {
  const totalShifts = duties.length;
  const substitutesCount = duties.filter((d) => d.isSubstitute).length;
  const normalCount = totalShifts - substitutesCount;
  const completedCount = duties.filter((d) => d.status === 'completed').length;
  const upcomingCount = duties.filter((d) => d.status === 'upcoming').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Total Shifts */}
      <div
        onClick={() => onSelectSubstituteFilter('all')}
        className={`p-4 sm:p-5 rounded-2xl liquid-glass-card liquid-glass-hover iridescent-edge cursor-pointer ${
          substituteFilter === 'all'
            ? 'ring-2 ring-[#5B2A86]/30 shadow-[0_4px_16px_rgba(91,42,134,0.10)] bg-white/85'
            : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#5A5764]">ผลัดเวรทั้งหมด</span>
          <div className="w-8 h-8 rounded-xl bg-[#EDE4F7] text-[#5B2A86] flex items-center justify-center border border-[#5B2A86]/20 shadow-2xs">
            <CalendarDays className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#2D2A32]">{totalShifts}</span>
          <span className="text-xs font-semibold text-[#8A8792]">ผลัด (1 - 30 ก.ย.)</span>
        </div>
        <div className="mt-2 text-[11px] text-[#8A8792] flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
          <span>แล้วเสร็จ {completedCount} • รอเข้าเวร {upcomingCount} ผลัด</span>
        </div>
      </div>

      {/* 2. Normal On-Schedule */}
      <div
        onClick={() => onSelectSubstituteFilter('normal_only')}
        className={`p-4 sm:p-5 rounded-2xl liquid-glass-card liquid-glass-hover iridescent-edge cursor-pointer ${
          substituteFilter === 'normal_only'
            ? 'ring-2 ring-[#059669]/30 shadow-[0_4px_16px_rgba(5,150,105,0.10)] bg-white/85'
            : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#5A5764]">ตรงตามคำสั่งปกติ</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center border border-emerald-200/60 shadow-2xs">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#059669]">{normalCount}</span>
          <span className="text-xs font-bold text-[#059669]">
            ({Math.round((normalCount / totalShifts) * 100)}%)
          </span>
        </div>
        <div className="mt-2 text-[11px] text-[#5A5764]">
          เวรปฏิบัติจริงตรงกับเวรเซ็นต์ชื่อ
        </div>
      </div>

      {/* 3. Substitutions (สลับเวร / แทนเวร) */}
      <div
        onClick={() => onSelectSubstituteFilter('substitute_only')}
        className={`p-4 sm:p-5 rounded-2xl liquid-glass-card liquid-glass-hover iridescent-edge cursor-pointer ${
          substituteFilter === 'substitute_only'
            ? 'ring-2 ring-[#D97706]/30 shadow-[0_4px_16px_rgba(217,119,6,0.10)] bg-white/85'
            : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#5A5764]">มีการเข้าเวรแทน (สลับเวร)</span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center border border-amber-200/60 shadow-2xs">
            <RefreshCw className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#D97706]">{substitutesCount}</span>
          <span className="text-xs font-bold text-[#D97706]">
            ({Math.round((substitutesCount / totalShifts) * 100)}%)
          </span>
        </div>
        <div className="mt-2 text-[11px] text-[#8A8792]">
          คลิกเพื่อกรองดูเฉพาะวันที่มีการแทนเวร
        </div>
      </div>

      {/* 4. Active Personnel Rotation */}
      <div className="p-4 sm:p-5 rounded-2xl liquid-glass-card liquid-glass-hover iridescent-edge">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#5A5764]">กำลังพลสิบเวรหมุนเวียน</span>
          <div className="w-8 h-8 rounded-xl bg-white/80 text-[#4A4852] flex items-center justify-center border border-[rgba(40,35,50,0.08)] shadow-2xs">
            <Users2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#2D2A32]">9</span>
          <span className="text-xs font-semibold text-[#8A8792]">นาย (เฉลี่ย 3-4 ผลัด/นาย)</span>
        </div>
        <div className="mt-2 text-[11px] text-[#8A8792]">
          ข้าราชการตำรวจประจำ สง.ฝอ.๕
        </div>
      </div>
    </div>
  );
};

export default BppDutyStatsCards;
