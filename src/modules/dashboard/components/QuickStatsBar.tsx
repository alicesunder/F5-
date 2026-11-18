import React from 'react';
import { ShieldCheck, Activity, Users, Server } from 'lucide-react';

export const QuickStatsBar: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16">
      <div className="rounded-2xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="flex items-center gap-3.5 pt-4 md:pt-0">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">โครงสร้างระบบ</p>
              <p className="text-base font-bold text-slate-900 mt-0.5">4 ฝ่ายงานหลัก</p>
              <p className="text-[10px] text-slate-400 font-mono">แยกพื้นที่ระบบอิสระ</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 pt-4 md:pt-0 md:pl-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">สถานะโครงข่าย</p>
              <p className="text-base font-bold text-slate-900 mt-0.5">พร้อมใช้งาน 100%</p>
              <p className="text-[10px] text-emerald-600 font-mono">ONLINE & SECURED</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 pt-4 md:pt-0 md:pl-6">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">สิทธิ์การใช้งาน</p>
              <p className="text-base font-bold text-slate-900 mt-0.5">RBAC ชั้นความลับ</p>
              <p className="text-[10px] text-slate-400 font-mono">Role-Based Access</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 pt-4 md:pt-0 md:pl-6">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">มาตรฐานความมั่นคง</p>
              <p className="text-base font-bold text-slate-900 mt-0.5">Gov Security Tier 3</p>
              <p className="text-[10px] text-slate-400 font-mono">PDPA & Cyber Resilience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
