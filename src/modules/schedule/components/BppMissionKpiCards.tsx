import React from 'react';
import { Calendar, CheckCircle2, Clock, CalendarDays, TrendingUp } from 'lucide-react';

interface BppMissionKpiCardsProps {
  totalCount: number;
  completedCount: number;
  inProgressCount: number;
  pendingCount: number;
  activeStatusFilter: string;
  onSelectStatusFilter: (status: string) => void;
}

export const BppMissionKpiCards: React.FC<BppMissionKpiCardsProps> = ({
  totalCount,
  completedCount,
  inProgressCount,
  pendingCount,
  activeStatusFilter,
  onSelectStatusFilter,
}) => {
  const completedPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const inProgressPct = totalCount > 0 ? Math.round((inProgressCount / totalCount) * 100) : 0;
  const pendingPct = totalCount > 0 ? Math.round((pendingCount / totalCount) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Missions Card */}
      <div
        onClick={() => onSelectStatusFilter('all')}
        className={`rounded-2xl p-5 liquid-glass-card liquid-glass-hover iridescent-edge cursor-pointer ${
          activeStatusFilter === 'all'
            ? 'ring-2 ring-[#5B2A86]/30 shadow-[0_4px_16px_rgba(91,42,134,0.10)] bg-white/85'
            : ''
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#EDE4F7] text-[#5B2A86] flex items-center justify-center border border-[#5B2A86]/20 shadow-2xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#2D2A32] leading-none">
                {totalCount}
              </div>
              <div className="text-xs font-semibold text-[#5A5764] mt-1">
                ภารกิจทั้งหมด
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#5B2A86] bg-[#EDE4F7] px-2 py-0.5 rounded-full border border-[#5B2A86]/15">
            <TrendingUp className="w-3 h-3" />
            <span>ครบถ้วน</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[rgba(40,35,50,0.06)] flex items-center justify-between text-[11px] text-[#8A8792]">
          <span>สถานะภาพรวม</span>
          <span className="font-semibold text-[#5B2A86]">คลิกเพื่อกรอง →</span>
        </div>
      </div>

      {/* 2. Completed Card */}
      <div
        onClick={() => onSelectStatusFilter('ดำเนินการแล้ว')}
        className={`rounded-2xl p-5 liquid-glass-card liquid-glass-hover iridescent-edge cursor-pointer ${
          activeStatusFilter === 'ดำเนินการแล้ว'
            ? 'ring-2 ring-[#059669]/30 shadow-[0_4px_16px_rgba(5,150,105,0.10)] bg-white/85'
            : ''
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center border border-emerald-200/70 shadow-2xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#2D2A32] leading-none">
                {completedCount}
              </div>
              <div className="text-xs font-semibold text-[#5A5764] mt-1">
                ดำเนินการแล้ว
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-[#059669] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
            {completedPct}%
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[rgba(40,35,50,0.06)]">
          <div className="w-full h-1.5 bg-[#F2F2F5] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#059669] rounded-full transition-all duration-300"
              style={{ width: `${completedPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. In Progress Card */}
      <div
        onClick={() => onSelectStatusFilter('อยู่ระหว่างดำเนินการ')}
        className={`rounded-2xl p-5 liquid-glass-card liquid-glass-hover iridescent-edge cursor-pointer ${
          activeStatusFilter === 'อยู่ระหว่างดำเนินการ'
            ? 'ring-2 ring-[#D97706]/30 shadow-[0_4px_16px_rgba(217,119,6,0.10)] bg-white/85'
            : ''
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center border border-amber-200/70 shadow-2xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#2D2A32] leading-none">
                {inProgressCount}
              </div>
              <div className="text-xs font-semibold text-[#5A5764] mt-1">
                อยู่ระหว่างดำเนินการ
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-[#D97706] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80">
            {inProgressPct}%
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[rgba(40,35,50,0.06)]">
          <div className="w-full h-1.5 bg-[#F2F2F5] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D97706] rounded-full transition-all duration-300"
              style={{ width: `${inProgressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. Pending Card */}
      <div
        onClick={() => onSelectStatusFilter('ยังไม่กำหนด')}
        className={`rounded-2xl p-5 liquid-glass-card liquid-glass-hover iridescent-edge cursor-pointer ${
          activeStatusFilter === 'ยังไม่กำหนด'
            ? 'ring-2 ring-[#E11D48]/30 shadow-[0_4px_16px_rgba(225,29,72,0.10)] bg-white/85'
            : ''
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-[#E11D48] flex items-center justify-center border border-rose-200/70 shadow-2xs">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#2D2A32] leading-none">
                {pendingCount}
              </div>
              <div className="text-xs font-semibold text-[#5A5764] mt-1">
                รอดำเนินการ / ยังไม่กำหนด
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-[#E11D48] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/80">
            {pendingPct}%
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[rgba(40,35,50,0.06)]">
          <div className="w-full h-1.5 bg-[#F2F2F5] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E11D48] rounded-full transition-all duration-300"
              style={{ width: `${pendingPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BppMissionKpiCards;
