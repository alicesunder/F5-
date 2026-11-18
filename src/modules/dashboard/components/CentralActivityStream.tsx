import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../../../contexts/AdminContext';
import { CentralActivityItem, AppModule } from '../../../types';
import {
  Activity,
  ArrowRight,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Radio,
} from 'lucide-react';

interface CentralActivityStreamProps {
  activities: CentralActivityItem[];
}

export const CentralActivityStream: React.FC<CentralActivityStreamProps> = ({ activities }) => {
  const { navigateModule } = useAdmin();

  const getStatusBadge = (status: CentralActivityItem['status']) => {
    switch (status) {
      case 'เร่งด่วน':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-2.5 h-2.5" />
            <span>เร่งด่วน</span>
          </span>
        );
      case 'เฝ้าระวัง':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Radio className="w-2.5 h-2.5 text-amber-600 animate-pulse" />
            <span>เฝ้าระวัง</span>
          </span>
        );
      case 'ประกาศแล้ว':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span>ประกาศแล้ว</span>
          </span>
        );
      case 'กำลังดำเนินการ':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <Clock className="w-2.5 h-2.5" />
            <span>กำลังดำเนินการ</span>
          </span>
        );
      case 'ดำเนินการแล้ว':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
            <span>ดำเนินการแล้ว</span>
          </span>
        );
    }
  };

  return (
    <div className="liquid-glass-card liquid-glass-sheen bpp-card-interactive iridescent-edge rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Activity className="w-5 h-5 text-[#17324F]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              กิจกรรมล่าสุด
            </h2>
            <p className="text-xs text-slate-500">
              การอัปเดตและรายการปฏิบัติราชการจากทุกฝ่ายงานแบบรวมศูนย์
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400">
          แสดง {activities.length} รายการ
        </span>
      </div>

      {/* Activity Timeline List (Item 12: Mission / Activity list smoothly refreshes) */}
      <div className="divide-y divide-slate-100">
        {activities.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            ไม่พบกิจกรรมตามเงื่อนไขตัวกรองที่เลือก
          </div>
        ) : (
          activities.map((item, index) => {
            const targetModule = item.route.replace('/', '') as AppModule;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(index * 0.04, 0.2),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4 group cursor-pointer"
                onClick={() => navigateModule(targetModule)}
              >
                {/* Left: Department Color Indicator, Time, Content */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  {/* Department Color Bar */}
                  <div
                    className="w-1.5 self-stretch rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />

                  <div className="min-w-0 flex-1">
                    {/* Meta Row: Dept badge, Category, Time, Status */}
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className="px-2.5 py-0.5 rounded-lg text-xs font-bold"
                        style={{
                          backgroundColor: `${item.color}18`,
                          color: item.color,
                        }}
                      >
                        {item.departmentName}
                      </span>

                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>

                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>
                          {item.date === new Date().toISOString().slice(0, 10)
                            ? `วันนี้ ${item.time} น.`
                            : `${item.date} ${item.time} น.`}
                        </span>
                      </span>

                      {getStatusBadge(item.status)}
                    </div>

                    {/* Detail & Action Text */}
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">
                      {item.detail}
                    </p>

                    {item.actor && (
                      <p className="text-[11px] text-slate-400 mt-1">
                        ผู้ปฏิบัติงาน: {item.actor}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Navigate button */}
                <div className="flex items-center sm:self-center">
                  <button
                    type="button"
                    onClick={() => navigateModule(targetModule)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 group-hover:text-white transition-all duration-200 cursor-pointer border border-slate-200 group-hover:border-transparent shadow-2xs"
                    style={{
                      backgroundColor: undefined,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = item.color;
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '';
                    }}
                  >
                    <span>เปิดหน้างาน</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
