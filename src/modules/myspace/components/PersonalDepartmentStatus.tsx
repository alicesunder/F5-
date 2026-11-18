import React from 'react';
import {
  Building2,
  Users2,
  ShieldCheck,
  Award,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { CHAIROT_POLICE_RECORD } from '../../../data/personalData';

interface PersonalDepartmentStatusProps {
  onNavigateModule?: (module: string) => void;
}

export const PersonalDepartmentStatus: React.FC<PersonalDepartmentStatusProps> = ({
  onNavigateModule,
}) => {
  return (
    <div className="rounded-3xl p-5 sm:p-6 bg-white/90 dark:bg-[#151A22]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2583D8] animate-pulse" />
            <span className="text-xs font-bold text-[#2583D8] uppercase tracking-wider">
              สังกัดและการบังคับบัญชา
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            คุณสังกัด: {CHAIROT_POLICE_RECORD.department}
          </h2>
        </div>

        {/* Department Badge Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 text-xs font-bold text-blue-700 dark:text-blue-300">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span>บช.ตชด. • ฝอ.๕ (มวลชนสัมพันธ์และการสื่อสาร)</span>
        </div>
      </div>

      {/* Grid of Department and Chain of Command Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {/* Unit */}
        <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-500" />
            <span>หน่วยงานต้นสังกัด</span>
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
            กก.ตชด.31 (ค่ายเจ้าพระยาจักรี)
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            ช่วยราชการ ฝอ.๕ บช.ตชด. (ส่วนกลาง)
          </div>
        </div>

        {/* Division / Department */}
        <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Users2 className="w-3.5 h-3.5 text-purple-500" />
            <span>ฝ่ายปฏิบัติงาน</span>
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
            กลุ่มงานมวลชนสัมพันธ์และสื่อสาร
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            ฝ่ายอำนวยการ ๕ (ฝอ.๕ บช.ตชด.)
          </div>
        </div>

        {/* Direct Supervisor */}
        <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>ผู้บังคับบัญชาชั้นต้น</span>
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
            พ.ต.ท.หญิง นภัสวรรณ รักษ์ธรรม
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            หัวหน้างานประชาสัมพันธ์ ฝอ.๕
          </div>
        </div>

        {/* Location & Contact */}
        <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>สถานที่ปฏิบัติการ & ติดต่อ</span>
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
            อาคาร ฝอ.๕ บช.ตชด. พหลโยธิน
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span>โทร: {CHAIROT_POLICE_RECORD.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
