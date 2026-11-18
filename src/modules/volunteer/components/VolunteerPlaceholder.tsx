import React from 'react';
import { useAdmin } from '../../../contexts/AdminContext';
import { UserHeaderBadge } from '../../../components/common/UserHeaderBadge';
import {
  Heart,
  HandHeart,
  Users,
  Building2,
  Clock,
  ArrowLeft,
  Home,
  Sparkles,
  ShieldCheck,
  Calendar,
  Award,
  Package,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

export const VolunteerPlaceholder: React.FC = () => {
  const { navigateModule } = useAdmin();
  const themeColor = '#EFBB4B';

  const iconsShowcase = [
    {
      id: 'volunteer',
      title: 'Volunteer',
      subtitle: 'กำลังพลจิตอาสา',
      description: 'รวบรวมและบริหารจัดการฐานข้อมูลกำลังพลจิตอาสาพระราชทานและจิตอาสาภาคประชาชน',
      icon: Users,
      badge: 'เครือข่ายกำลังพล',
    },
    {
      id: 'community',
      title: 'Community',
      subtitle: 'พลังมวลชนและชุมชน',
      description: 'ประสานงานชุมชน ท้องถิ่น และองค์กรภาคีเครือข่ายเพื่อการพัฒนาอย่างยั่งยืน',
      icon: Building2,
      badge: 'การมีส่วนร่วม',
    },
    {
      id: 'helping-hand',
      title: 'Helping Hand',
      subtitle: 'มือประสานช่วยเหลือ',
      description: 'ปฏิบัติการลงพื้นที่บรรเทาทุกข์ ฟื้นฟูสาธารณูปโภค และงานบำเพ็ญสาธารณประโยชน์',
      icon: HandHeart,
      badge: 'การช่วยเหลือ',
    },
    {
      id: 'heart',
      title: 'Heart',
      subtitle: 'จิตใจแห่งการเสียสละ',
      description: 'ส่งเสริมการทำความดีด้วยหัวใจ เสียสละเพื่อประโยชน์สุขของส่วนรวมและประเทศชาติ',
      icon: Heart,
      badge: 'จิตสาธารณะ',
    },
  ];

  const architecturePillars = [
    {
      title: '1. ระบบทะเบียนกำลังพลจิตอาสา',
      enTitle: 'Volunteer Registry & Verification',
      desc: 'เตรียมโครงสร้างข้อมูลประวัติ ทักษะเฉพาะทาง และสังกัดพื้นที่ปฏิบัติงาน',
      icon: Users,
    },
    {
      title: '2. ระบบบริหารโครงการและกิจกรรม',
      enTitle: 'Activity & Mission Dispatching',
      desc: 'เตรียมผังกำหนดการ แผนที่ลงพื้นที่ และจุดรวมพลปฏิบัติการจิตอาสา',
      icon: Calendar,
    },
    {
      title: '3. บันทึกชั่วโมงและออกเกียรติบัตร',
      enTitle: 'Service Hours & E-Certification',
      desc: 'เตรียมกลไกนับสะสมเวลาความดีและพิมพ์เกียรติบัตรรับรองอิเล็กทรอนิกส์',
      icon: Award,
    },
    {
      title: '4. ระบบคลังสิ่งของพระราชทาน',
      enTitle: 'Royal Supplies & Equipment Ledger',
      desc: 'เตรียมผังการควบคุม เบิกจ่าย หมวก ผ้าพันคอ และอุปกรณ์สนับสนุนงานบำเพ็ญประโยชน์',
      icon: Package,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#1F2937] flex flex-col font-sans">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => navigateModule('dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>กลับหน้าหลัก</span>
              </button>

              <div className="h-5 w-px bg-slate-200 hidden sm:block" />

              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-900 shadow-xs"
                  style={{ backgroundColor: themeColor }}
                >
                  <HandHeart className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                    ฝ่ายจิตอาสา
                  </h1>
                  <p className="text-[11px] text-slate-500 font-medium">
                    ระบบบริหารกิจกรรมและงานจิตอาสา • /volunteer
                  </p>
                </div>
              </div>
            </div>

            {/* Prominent Status Pill & User Session */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin" style={{ animationDuration: '6s' }} />
                <span>สถานะ: กำลังพัฒนา</span>
              </span>

              <div className="h-5 w-px bg-slate-200 hidden sm:block mx-0.5" />

              <UserHeaderBadge />
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col items-center justify-center space-y-10">
        {/* Core Hero Placeholder Card */}
        <div className="w-full bg-white rounded-3xl border border-amber-200/80 shadow-md p-8 sm:p-12 text-center relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ backgroundColor: themeColor }}
          />

          {/* Status Badge in Center */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-6 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>กำลังพัฒนา</span>
          </div>

          {/* Central Composite Illustration (Volunteer, Community, Helping Hand, Heart) */}
          <div className="relative mx-auto w-32 h-32 sm:w-36 sm:h-36 mb-6 flex items-center justify-center">
            {/* Soft backdrop circle */}
            <div
              className="absolute inset-0 rounded-full opacity-15"
              style={{ backgroundColor: themeColor }}
            />
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-amber-50 border-2 border-amber-300/80 flex items-center justify-center shadow-inner relative">
              <HandHeart className="w-12 h-12 text-amber-600" />
              {/* Floating Heart Icon */}
              <div
                className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-white border border-amber-300 flex items-center justify-center text-rose-500 shadow-sm"
              >
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-pulse" />
              </div>
              {/* Floating Community Icon */}
              <div
                className="absolute -bottom-2 -left-2 w-9 h-9 rounded-full bg-white border border-amber-300 flex items-center justify-center text-amber-700 shadow-sm"
              >
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Titles & Message from User Specification */}
          <div className="max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              ฝ่ายจิตอาสา
            </h2>
            <p className="text-sm sm:text-base font-semibold text-amber-800">
              ระบบบริหารกิจกรรมและงานจิตอาสา
            </p>

            {/* Required Message Box */}
            <div className="mt-4 p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-slate-700 text-xs sm:text-sm leading-relaxed space-y-1">
              <p className="font-semibold text-slate-900">
                ระบบฝ่ายจิตอาสากำลังอยู่ระหว่างการพัฒนา
              </p>
              <p className="text-slate-600">
                โปรดติดตามการเปิดใช้งานในเร็ว ๆ นี้
              </p>
            </div>
          </div>

          {/* Primary Action Button: "กลับหน้าหลัก" */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigateModule('dashboard')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 shadow-sm hover:shadow-md transition active:scale-98 cursor-pointer"
              style={{ backgroundColor: themeColor }}
            >
              <Home className="w-4 h-4" />
              <span>กลับหน้าหลัก</span>
            </button>
          </div>
        </div>

        {/* 4 Foundation Pillars (Volunteer, Community, Helping Hand, Heart) */}
        <div className="w-full space-y-4">
          <div className="text-center">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-700">
              CORE PHILOSOPHY & CAPABILITIES
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              เสาหลักพันธกิจงานจิตอาสา
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {iconsShowcase.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-white border border-amber-100 shadow-2xs hover:shadow-md transition duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-900 shadow-2xs"
                        style={{ backgroundColor: `${themeColor}40` }}
                      >
                        <Icon className="w-5 h-5 text-amber-800" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80">
                        {item.badge}
                      </span>
                    </div>

                    <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">
                      {item.title}
                    </h4>
                    <h5 className="text-sm font-bold text-slate-900 mt-0.5">
                      {item.subtitle}
                    </h5>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Module Architecture Roadmap Box (Prepared for future development without DB or CRUD) */}
        <div className="w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  โครงสร้างสถาปัตยกรรมระบบที่จัดเตรียมไว้สำหรับพัฒนาต่อในอนาคต
                </h4>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Module Architecture Framework (Type Definitions & Extension Hooks Ready)
              </p>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-semibold self-start sm:self-auto">
              PHASE 2 ROADMAP
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {architecturePillars.map((p, idx) => {
              const PillarIcon = p.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-amber-50/30 border border-amber-100/80 flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <PillarIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{p.title}</h5>
                    <span className="text-[10px] font-mono text-slate-400 block">{p.enTitle}</span>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
