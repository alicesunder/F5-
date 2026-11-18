import React from 'react';
import {
  History,
  Award,
  Calendar,
  Building2,
  TrendingUp,
  FileBadge,
  ShieldCheck,
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import {
  PERSONAL_CAREER_TIMELINE,
  POSITION_HISTORY,
  RANK_HISTORY,
  CHAIROT_POLICE_RECORD,
} from '../../../data/personalData';

export const PersonalHistoryTimeline: React.FC = () => {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'เลื่อนยศ':
        return 'bg-blue-500 text-white';
      case 'ดำรงตำแหน่ง':
        return 'bg-purple-500 text-white';
      case 'เลื่อนขั้นเงินเดือน':
        return 'bg-emerald-500 text-white';
      case 'เอกสารสำคัญ':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="rounded-3xl p-5 sm:p-7 bg-white/90 dark:bg-[#151A22]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              เส้นทางรับราชการตำรวจ
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            ประวัติราชการของฉัน (Personal Service Timeline)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            บันทึกประวัติการดำรงตำแหน่ง ยศ และการเลื่อนขั้นเงินเดือนตามเอกสาร POLIS ฉบับทางการ
          </p>
        </div>

        {/* Tenure Summary Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-xs font-bold text-purple-700 dark:text-purple-300">
          <Award className="w-4 h-4 text-purple-500" />
          <span>อายุราชการรวม 2 ปี (เกษียณ พ.ศ. {CHAIROT_POLICE_RECORD.retirementYear})</span>
        </div>
      </div>

      {/* Official Position & Rank Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Position History */}
        <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-200/60 dark:border-white/5">
            <Briefcase className="w-4 h-4 text-blue-500" />
            <span>ประวัติการดำรงตำแหน่ง (Official Position History)</span>
          </div>
          <div className="space-y-2.5">
            {POSITION_HISTORY.map((p, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white dark:bg-[#1A1F29]/80 border border-slate-200/60 dark:border-white/5 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>{p.date}</span>
                  <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">เลข {p.positionNumber}</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white">
                  {p.position}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  หน่วย: {p.unit}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rank History */}
        <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-200/60 dark:border-white/5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>ประวัติยศตำรวจ (Official Rank History)</span>
          </div>
          <div className="space-y-2.5">
            {RANK_HISTORY.map((r, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white dark:bg-[#1A1F29]/80 border border-slate-200/60 dark:border-white/5 text-xs space-y-1">
                <div className="text-slate-400 text-[11px]">
                  {r.date}
                </div>
                <div className="font-bold text-slate-900 dark:text-white">
                  {r.rank}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {idx === 0 ? 'ชั้นประทวน (แต่งตั้งครั้งล่าสุด)' : 'ชั้นพลตำรวจ (แรกบรรจุรับราชการ)'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chronological Timeline */}
      <div className="space-y-4 pt-2">
        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
          ลำดับเหตุการณ์สำคัญในชีวิตราชการ
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-white/10">
          {PERSONAL_CAREER_TIMELINE.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline Bullet Dot */}
              <div className="absolute -left-6 sm:-left-8 top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-[#151A22] bg-[#2583D8] shadow-xs group-hover:scale-125 transition" />

              <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1F29]/60 border border-slate-200/80 dark:border-white/10 hover:border-blue-400/40 transition space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      {item.date}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${getCategoryColor(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </span>
                  </div>
                  {item.reference && (
                    <span className="text-[10px] font-mono text-slate-400">
                      {item.reference}
                    </span>
                  )}
                </div>

                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {item.title}
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
