import React from 'react';
import {
  CalendarCheck2,
  Clock,
  CheckCircle2,
  FileClock,
  Award,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { useVolunteer } from '../context/VolunteerContext';

export const VolunteerHeroStats: React.FC = () => {
  const { stats, setActiveTab, setFilterStatus } = useVolunteer();

  return (
    <div className="mb-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Editorial Liquid Glass Card: Left 8 cols */}
      <div className="lg:col-span-8 p-6 rounded-3xl liquid-glass-card iridescent-edge relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#42A77A]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[rgba(66,167,122,0.18)]">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#047857] text-white text-[11px] font-bold tracking-wide">
                กองบัญชาการตำรวจตระเวนชายแดน
              </span>
              <span className="text-xs font-bold text-[#047857] dark:text-emerald-300">
                ปีงบประมาณ {new Date().getMonth() >= 9 ? new Date().getFullYear() + 544 : new Date().getFullYear() + 543}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#6B6973] dark:text-slate-300">
              <TrendingUp className="w-3.5 h-3.5 text-[#42A77A]" />
              <span>ประสิทธิภาพการส่งรายงานตรงเวลา</span>
              <span className="font-bold text-[#047857] dark:text-emerald-300 font-mono tabular-nums">{stats.onTimePercentage}%</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* 01 ภารกิจทั้งหมด */}
            <div
              onClick={() => {
                setActiveTab('missions');
                setFilterStatus('ALL');
              }}
              className="p-3.5 rounded-2xl bg-white/80 dark:bg-white/5 hover:bg-white border border-[rgba(66,167,122,0.22)] hover:border-[#42A77A] hover:-translate-y-0.5 transition-all cursor-pointer shadow-xs"
            >
              <div className="flex items-center justify-between text-[#6B6973] dark:text-slate-300">
                <span className="text-[11px] font-bold">ภารกิจทั้งหมด</span>
                <CalendarCheck2 className="w-4 h-4 text-[#42A77A]" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-black font-mono tabular-nums text-[#25202B] dark:text-white">
                  {stats.totalMissions}
                </span>
                <span className="text-[11px] text-[#6B6973]">ภารกิจ</span>
              </div>
              <p className="text-[10px] text-[#047857] dark:text-emerald-300 mt-1 font-bold flex items-center gap-0.5">
                <span>ทุกหน่วย</span>
                <ArrowUpRight className="w-2.5 h-2.5" />
              </p>
            </div>

            {/* 02 กำลังดำเนินการ */}
            <div
              onClick={() => {
                setActiveTab('missions');
                setFilterStatus('IN_PROGRESS');
              }}
              className="p-3.5 rounded-2xl bg-white/80 dark:bg-white/5 hover:bg-white border border-[rgba(66,167,122,0.22)] hover:border-[#2583D8] hover:-translate-y-0.5 transition-all cursor-pointer shadow-xs"
            >
              <div className="flex items-center justify-between text-[#6B6973] dark:text-slate-300">
                <span className="text-[11px] font-bold">กำลังดำเนินการ</span>
                <Clock className="w-4 h-4 text-[#2583D8]" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-black font-mono tabular-nums text-[#2583D8]">
                  {stats.inProgressMissions}
                </span>
                <span className="text-[11px] text-[#6B6973]">ภารกิจ</span>
              </div>
              <p className="text-[10px] text-[#2583D8] mt-1 font-bold">
                ปฏิบัติการในพื้นที่
              </p>
            </div>

            {/* 03 เสร็จสิ้น */}
            <div
              onClick={() => {
                setActiveTab('missions');
                setFilterStatus('COMPLETED');
              }}
              className="p-3.5 rounded-2xl bg-white/80 dark:bg-white/5 hover:bg-white border border-[rgba(66,167,122,0.22)] hover:border-[#059669] hover:-translate-y-0.5 transition-all cursor-pointer shadow-xs"
            >
              <div className="flex items-center justify-between text-[#6B6973] dark:text-slate-300">
                <span className="text-[11px] font-bold">เสร็จสิ้นแล้ว</span>
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-black font-mono tabular-nums text-[#059669]">
                  {stats.completedMissions}
                </span>
                <span className="text-[11px] text-[#6B6973]">ภารกิจ</span>
              </div>
              <p className="text-[10px] text-[#059669] mt-1 font-bold">
                ปิดภารกิจแล้ว
              </p>
            </div>

            {/* 04 รายงานรอตรวจ (ฝอ.5) */}
            <div
              onClick={() => {
                setActiveTab('reports');
                setFilterStatus('PENDING_REVIEW');
              }}
              className="p-3.5 rounded-2xl bg-[#FFFBEB] hover:bg-[#FEF3C7] border border-[#FDE68A] hover:-translate-y-0.5 transition-all cursor-pointer shadow-xs"
            >
              <div className="flex items-center justify-between text-[#92400E]">
                <span className="text-[11px] font-bold">รายงานรอตรวจ</span>
                <FileClock className="w-4 h-4 text-[#D97706]" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-black font-mono tabular-nums text-[#D97706]">
                  {stats.pendingReviewReports}
                </span>
                <span className="text-[11px] text-[#92400E]">ฉบับ</span>
              </div>
              <p className="text-[10px] text-[#B45309] mt-1 font-bold">
                รอ ฝอ.๕ ลงนาม
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right 4 cols: Combined Impact Highlight */}
      <div className="lg:col-span-4 p-6 rounded-3xl bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#10B981] text-white shadow-lg flex flex-col justify-between relative overflow-hidden border border-white/15">
        <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none">
          <Award className="w-40 h-40 text-white" />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-lg bg-white/15 text-white">
              ผลสัมฤทธิ์สะสม (Accumulated Impact)
            </span>
            <Sparkles className="w-4 h-4 text-emerald-200" />
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs text-emerald-100 font-medium">กำลังพลจิตอาสาร่วมปฏิบัติหน้าที่</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black font-mono tabular-nums tracking-tight text-white">
                  {(stats.totalVolunteersParticipated ?? stats.totalPersonnelParticipants ?? 0).toLocaleString()}
                </span>
                <span className="text-xs text-emerald-100">นาย</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/15">
              <p className="text-xs text-emerald-100 font-medium">ประชาชนที่ได้รับประโยชน์โดยตรง</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black font-mono tabular-nums tracking-tight text-emerald-200">
                  {(stats.totalCitizensBenefited ?? stats.totalBeneficiaries ?? 0).toLocaleString()}
                </span>
                <span className="text-xs text-emerald-100">คน (ทั่วประเทศ)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
