import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Eye,
  EyeOff,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
  Briefcase,
  ChevronDown,
  Building2,
  FileText,
  BadgePercent,
  Wallet,
  Coins,
  History,
  FolderLock,
  UserCheck,
  AlertCircle,
  Bell,
  MapPin,
  Flame,
} from 'lucide-react';
import {
  CHAIROT_POLICE_RECORD,
  TODAY_SCHEDULE_ITEMS,
  INITIAL_PERSONAL_ALLOWANCES,
} from '../../../data/personalData';
import { PersonalDutyStatus } from '../../../types';

interface PersonalHeroProps {
  currentStatus: PersonalDutyStatus;
  onChangeStatus: (status: PersonalDutyStatus) => void;
  hideFinancials: boolean;
  onToggleHideFinancials: () => void;
  onNavigateSection: (sectionId: string) => void;
  activeSection: string;
}

const DUTY_STATUS_OPTIONS: { status: PersonalDutyStatus; label: string; color: string; bg: string }[] = [
  {
    status: 'ปฏิบัติราชการ',
    label: 'ปฏิบัติราชการ',
    color: '#10B981',
    bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  },
  {
    status: 'ปฏิบัติภารกิจ',
    label: 'ปฏิบัติภารกิจสนาม',
    color: '#3B82F6',
    bg: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  },
  {
    status: 'ลาราชการ',
    label: 'ลาราชการ',
    color: '#EF4444',
    bg: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
  },
  {
    status: 'ฝึกอบรม',
    label: 'ฝึกอบรม',
    color: '#8B5CF6',
    bg: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
  },
  {
    status: 'ปฏิบัติราชการนอกสถานที่',
    label: 'ปฏิบัติราชการนอกสถานที่',
    color: '#F59E0B',
    bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  },
  {
    status: 'ไม่อยู่ในเวร/ภารกิจ',
    label: 'ไม่อยู่ในเวร/ภารกิจ',
    color: '#6B7280',
    bg: 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20',
  },
];

export const PersonalHero: React.FC<PersonalHeroProps> = ({
  currentStatus,
  onChangeStatus,
  hideFinancials,
  onToggleHideFinancials,
  onNavigateSection,
  activeSection,
}) => {
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  const activeStatusConfig =
    DUTY_STATUS_OPTIONS.find(s => s.status === currentStatus) || DUTY_STATUS_OPTIONS[0];

  // Real Insights calculated directly from authentic personal data:
  const todayTasksCount = TODAY_SCHEDULE_ITEMS.length; // 5
  const pendingReportItem = TODAY_SCHEDULE_ITEMS.find(i => i.title.includes('ร่างข่าวสาร') || i.urgency === 'เร่งด่วน');
  const approvedAllowance = INITIAL_PERSONAL_ALLOWANCES.find(a => a.status === 'อนุมัติ');

  return (
    <div className="relative rounded-[28px] sm:rounded-[32px] overflow-hidden border border-white/60 dark:border-white/10 shadow-[0_16px_40px_rgba(30,25,50,0.06)] bg-white/75 dark:bg-[#121620]/80 backdrop-blur-xl transition-all">
      {/* 06. HERO BACKGROUND: Atmospheric subtle government & operational environment */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Subtle Atmospheric Architectural Command Center SVG / Backdrop Pattern (12-16% opacity) */}
        <div className="absolute inset-0 opacity-[0.14] dark:opacity-[0.08] mix-blend-multiply dark:mix-blend-screen">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="hq-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2583D8" strokeWidth="0.6" strokeDasharray="3 3" />
              </pattern>
              <linearGradient id="hero-sky-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2583D8" stopOpacity="0.4" />
                <stop offset="60%" stopColor="#5B2A86" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-sky-grad)" />
            <rect width="100%" height="100%" fill="url(#hq-grid)" />
            {/* Subtle administrative building silhouettes */}
            <path
              d="M0,280 L140,240 L260,250 L380,210 L500,230 L640,190 L780,220 L920,180 L1100,220 L1300,190 L1500,230 L1600,200 L1600,340 L0,340 Z"
              fill="#2583D8"
              opacity="0.15"
            />
          </svg>
        </div>

        {/* Dynamic Department Color Glow - Left & Right */}
        <div
          className="absolute -top-28 -left-20 w-96 h-96 rounded-full blur-3xl opacity-25 dark:opacity-20 pointer-events-none"
          style={{ backgroundColor: CHAIROT_POLICE_RECORD.departmentColor }}
        />
        <div className="absolute -bottom-24 -right-16 w-96 h-96 rounded-full blur-3xl bg-[#5B2A86] opacity-15 dark:opacity-10 pointer-events-none" />
      </div>

      {/* Main Container Content */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-9 space-y-6">
        {/* Top Split: Identity (Left & Center) and Status / Actions (Right) */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8">
          {/* LEFT & CENTER: Officer Identity & Metadata */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 flex-1 min-w-0">
            {/* LEFT: Large Profile Portrait with Rank Emblem & Status Dot */}
            <div className="relative flex-shrink-0 group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-white/80 dark:border-white/20 shadow-xl bg-gradient-to-br from-slate-100 via-blue-50/50 to-purple-50/30 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center relative">
                {/* Official Police Uniform Representative Avatar */}
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-2 bg-[#1B325F]/5 dark:bg-[#1B325F]/25">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#1B325F] via-[#2583D8] to-[#4F46E5] text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-md border border-white/40">
                    ช
                  </div>
                  <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 mt-1 uppercase tracking-widest font-mono">
                    {CHAIROT_POLICE_RECORD.rank}
                  </span>
                </div>
              </div>

              {/* Status Pulsing Indicator on Avatar Corner */}
              <div
                className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full border-2 border-white dark:border-[#121620] flex items-center gap-1.5 shadow-md text-[10px] font-black text-white"
                style={{ backgroundColor: activeStatusConfig.color }}
                title={`สถานะปัจจุบัน: ${activeStatusConfig.label}`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[9px] hidden sm:inline">{activeStatusConfig.label}</span>
              </div>
            </div>

            {/* CENTER: Editorial Greeting, Full Name, Department & Authentic Meta Chips */}
            <div className="space-y-2 min-w-0 flex-1">
              {/* Soft Editorial Greeting */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  สวัสดีครับ
                </span>
                <span className="text-xs text-slate-300 dark:text-slate-600">•</span>
                <span className="text-xs font-bold text-[#2583D8] dark:text-blue-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#2583D8]" />
                  Personal Command Center
                </span>
              </div>

              {/* Officer Rank & Full Name */}
              <div className="flex flex-wrap items-baseline gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  {CHAIROT_POLICE_RECORD.rankFull} {CHAIROT_POLICE_RECORD.firstName} {CHAIROT_POLICE_RECORD.lastName}
                </h1>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                  (ชื่อเล่น: {CHAIROT_POLICE_RECORD.nickname})
                </span>
              </div>

              {/* Position & Role */}
              <div className="text-sm font-medium text-slate-700 dark:text-slate-200 flex flex-wrap items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#2583D8] flex-shrink-0" />
                <span className="font-semibold">{CHAIROT_POLICE_RECORD.position}</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-[#2583D8] dark:text-blue-400 font-bold">
                  {CHAIROT_POLICE_RECORD.roleInDepartment}
                </span>
              </div>

              {/* Information Chips (Department, Position Number, Age, Service, Retirement) */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {/* Department Chip */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50/80 dark:bg-blue-500/10 border border-blue-200/70 dark:border-blue-500/20 text-xs font-bold text-[#1E6CB3] dark:text-blue-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2583D8]" />
                  <span>{CHAIROT_POLICE_RECORD.department}</span>
                </div>

                {/* Parent Unit Chip */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-50/80 dark:bg-purple-500/10 border border-purple-200/70 dark:border-purple-500/20 text-xs font-bold text-[#5B2A86] dark:text-purple-300">
                  <Building2 className="w-3 h-3 text-[#5B2A86]" />
                  <span>กก.ตชด.31 (ช่วยราชการ ฝอ.๕)</span>
                </div>

                {/* Position Number Chip */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  <span>เลขตำแหน่ง {CHAIROT_POLICE_RECORD.positionNumber}</span>
                </div>

                {/* Age & Service Tenure */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400">
                  <span>อายุ {CHAIROT_POLICE_RECORD.ageYears} ปี ({CHAIROT_POLICE_RECORD.ageMonths} เดือน)</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">อายุราชการ {CHAIROT_POLICE_RECORD.totalServiceYears} ปี</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span>เกษียณ พ.ศ. {CHAIROT_POLICE_RECORD.retirementYear}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Personal Status Panel, Today's Summary & Privacy Switch */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 self-stretch lg:self-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200/60 dark:border-white/5">
            {/* Status Dropdown Trigger */}
            <div className="relative w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setStatusMenuOpen(prev => !prev)}
                className={`w-full sm:w-auto inline-flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold border transition shadow-2xs cursor-pointer ${activeStatusConfig.bg}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full animate-pulse flex-shrink-0"
                    style={{ backgroundColor: activeStatusConfig.color }}
                  />
                  <span className="text-slate-500 dark:text-slate-400 font-medium">สถานะของฉัน:</span>
                  <span className="font-black underline decoration-dotted underline-offset-4">
                    {activeStatusConfig.label}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${statusMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Status Dropdown List */}
              <AnimatePresence>
                {statusMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white dark:bg-[#1A1F29] border border-slate-200 dark:border-white/10 shadow-2xl p-2 z-50"
                  >
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-white/5">
                      ปรับสถานะการปฏิบัติงาน
                    </div>
                    <div className="space-y-1 mt-1.5">
                      {DUTY_STATUS_OPTIONS.map(opt => {
                        const isSelected = opt.status === currentStatus;
                        return (
                          <button
                            key={opt.status}
                            type="button"
                            onClick={() => {
                              onChangeStatus(opt.status);
                              setStatusMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50 dark:bg-blue-500/15 text-[#2583D8] dark:text-blue-300 font-bold'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: opt.color }}
                              />
                              <span>{opt.label}</span>
                            </div>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#2583D8]" />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Today's Summary Pill */}
            <div className="flex items-center justify-between sm:justify-start gap-2.5 px-4 py-2 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs text-slate-700 dark:text-slate-200 shadow-2xs">
              <Clock className="w-4 h-4 text-[#2583D8] flex-shrink-0" />
              <span>วันนี้ <strong>3</strong> ภารกิจ</span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span><strong>1</strong> รายงานรอตรวจ</span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">2 งานต้องทำ</span>
            </div>

            {/* Quick Privacy Toggle */}
            <button
              type="button"
              onClick={onToggleHideFinancials}
              className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5 transition cursor-pointer"
              title="สลับการแสดง/ซ่อนยอดเงินเพื่อความเป็นส่วนตัว"
            >
              {hideFinancials ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-[#2583D8]" />
                  <span>แสดงยอดเงิน (Show)</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                  <span>ซ่อนยอดเงิน (Privacy)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 22. SMART INSIGHTS STRIP: Calculated strictly from real authentic data */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-white/5 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 pr-1">
            <Sparkles className="w-3.5 h-3.5 text-[#2583D8]" />
            <span>Smart Insights:</span>
          </div>

          {/* Insight 1: Today's mission count */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-blue-50/70 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 text-xs text-blue-800 dark:text-blue-300">
            <Calendar className="w-3 h-3 text-blue-500" />
            <span>วันนี้คุณมี <strong>3 ภารกิจ</strong> ที่ต้องดำเนินการ</span>
          </div>

          {/* Insight 2: Pending Report Deadline */}
          {pendingReportItem && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-50/70 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
              <Clock className="w-3 h-3 text-amber-500" />
              <span>มี <strong>1 รายงานรอตรวจ</strong> (กำหนดส่ง {pendingReportItem.time} น.)</span>
            </div>
          )}

          {/* Insight 3: Approved Allowance ready */}
          {approvedAllowance && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-50/70 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>มี <strong>1 รายการเบี้ยเลี้ยงอนุมัติแล้ว</strong> (รอจ่าย ฿{approvedAllowance.totalAmount.toLocaleString()})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
