import React from 'react';
import { useAdmin } from '../../../contexts/AdminContext';
import { ArrowRight, Grid3X3, LogIn, ShieldCheck, Layers } from 'lucide-react';

interface DashboardHeroProps {
  onOpenLoginModal: () => void;
  onScrollToCards: () => void;
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({
  onOpenLoginModal,
  onScrollToCards,
}) => {
  const { isAuthenticated } = useAdmin();

  return (
    <section className="relative pt-10 pb-8 sm:pt-14 sm:pb-12 text-center max-w-4xl mx-auto px-4 sm:px-6">
      {/* Subtle Government Administrative Classification Tag */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/90 text-[11px] font-medium text-slate-600 shadow-xs mb-5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
        <span className="font-semibold text-slate-800">ศูนย์กลางระบบงาน</span>
        <span className="text-slate-300">•</span>
        <span className="font-mono text-slate-500">CENTRAL MANAGEMENT PORTAL</span>
      </div>

      {/* Main Hero Headline as explicitly requested */}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1F2937] leading-[1.2] sm:leading-[1.25]">
        ระบบศูนย์กลางบริหารงานหน่วยงาน
      </h2>

      {/* Hero Description as explicitly requested */}
      <p className="mt-4 sm:mt-5 text-base sm:text-lg text-[#6B7280] font-normal max-w-2xl mx-auto leading-relaxed">
        ศูนย์กลางสำหรับบริหาร จัดการ และติดตามภารกิจของแต่ละฝ่ายอย่างเป็นระบบ
      </p>

      {/* Action Buttons as explicitly requested */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
        {/* เข้าสู่ระบบ Button */}
        <button
          type="button"
          onClick={onOpenLoginModal}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm sm:text-base shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95"
        >
          <LogIn className="w-4 h-4 text-slate-200" />
          <span>{isAuthenticated ? 'สลับสิทธิ์ / ผู้ใช้งาน' : 'เข้าสู่ระบบ'}</span>
        </button>

        {/* ดูระบบทั้งหมด Button */}
        <button
          type="button"
          onClick={onScrollToCards}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 font-medium text-sm sm:text-base shadow-xs hover:shadow-sm transition-all cursor-pointer active:scale-95"
        >
          <Grid3X3 className="w-4 h-4 text-slate-500" />
          <span>ดูระบบทั้งหมด</span>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Trust & Architecture Note */}
      <div className="mt-8 flex items-center justify-center gap-6 text-[11px] text-slate-400 font-mono">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          ระบบแยกส่วนอิสระ (Modular Architecture)
        </span>
        <span className="hidden sm:inline-block">•</span>
        <span className="hidden sm:flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          สิทธิ์การเข้าถึง 4 ฝ่ายงานหลัก (RBAC)
        </span>
      </div>
    </section>
  );
};
