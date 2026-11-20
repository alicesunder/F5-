import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';

interface BppMissionHeroProps {
  selectedMonth: string;
  onSelectMonth?: (month: string) => void;
}

export const BppMissionHero: React.FC<BppMissionHeroProps> = ({
  selectedMonth,
}) => {
  return (
    <div
      className="relative overflow-hidden rounded-3xl text-white p-5 sm:p-7 shadow-xl border border-white/15"
      style={{
        background: 'linear-gradient(135deg, #1E1035 0%, #4C1D95 45%, #1D4ED8 82%, #0EA5E9 100%)',
      }}
    >
      {/* 4-Color Spectrum Top Ribbon */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8B46C8] via-[#2583D8] via-[#E89B22] to-[#42A77A]" />

      {/* Ambient Glows */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-purple-400/20 blur-3xl pointer-events-none" />

      {/* Main Content Layout */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Left Side: Logo + Titles */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Emblem Roundel */}
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white p-1.5 shadow-lg ring-1 ring-white/40 flex-shrink-0 flex items-center justify-center">
            <img
              src="/assets/fo5-logo.png"
              alt="ตราสัญลักษณ์ ฝอ.5"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                ฝอ.5 บก.อก.บช.ตชด.
              </h2>
              <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-white/15 text-amber-300 border border-white/20 inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                MISSION COMMAND STUDIO
              </span>
            </div>
            <div className="text-sm sm:text-base font-bold text-purple-100 mt-0.5 tracking-tight">
              ตารางภารกิจประจำเดือนและตารางเวรปฏิบัติการ ฝ่ายอำนวยการ 5
            </div>
            <div className="text-xs text-purple-200 font-medium flex flex-wrap items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1.5 font-bold text-white bg-white/15 px-2.5 py-0.5 rounded-lg border border-white/20 backdrop-blur-md">
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                <span>ประจำเดือน{selectedMonth}</span>
              </span>
              <span className="text-purple-300">•</span>
              <span>ระบบบริหารจัดการและติดตามภารกิจทางราชการแบบบูรณาการ</span>
            </div>
          </div>
        </div>

        {/* Right Side: Four Department Colors Accent Bar */}
        <div className="md:text-right max-w-md bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
          <div className="text-xs font-extrabold text-amber-300 tracking-wide">
            “ รวมพลัง 4 สายงาน เพื่อภารกิจเดียวกัน ”
          </div>
          <div className="text-[11px] text-white font-semibold mt-2 flex flex-wrap items-center md:justify-end gap-x-3 gap-y-1.5">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7] shadow-xs" />
              งานอำนวยการ
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] shadow-xs" />
              ประชาสัมพันธ์
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24] shadow-xs" />
              พัฒนาช่วยเหลือประชาชน
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] shadow-xs" />
              จิตอาสา
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BppMissionHero;
