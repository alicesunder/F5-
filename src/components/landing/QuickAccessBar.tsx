import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import {
  Users,
  FolderArchive,
  Inbox,
  FileText,
  Megaphone,
  BarChart3,
  FileSpreadsheet,
  Calendar,
  CalendarDays,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';

interface QuickAccessBarProps {
  onOpenPrModal?: () => void;
}

export const QuickAccessBar: React.FC<QuickAccessBarProps> = ({ onOpenPrModal }) => {
  const { navigate } = useAdmin();

  const quickItems = [
    {
      id: 'qa-personnel',
      label: 'งานบุคคล',
      enLabel: 'Personnel',
      icon: Users,
      action: () => navigate('units'),
      iconBg: 'group-hover:bg-blue-50 group-hover:text-blue-600',
    },
    {
      id: 'qa-docs',
      label: 'เอกสาร',
      enLabel: 'Archives',
      icon: FolderArchive,
      action: () => navigate('documents'),
      iconBg: 'group-hover:bg-sky-50 group-hover:text-sky-600',
    },
    {
      id: 'qa-incoming',
      label: 'หนังสือราชการ',
      enLabel: 'Official Docs',
      icon: Inbox,
      action: () => navigate('incoming'),
      iconBg: 'group-hover:bg-cyan-50 group-hover:text-cyan-600',
    },
    {
      id: 'qa-orders',
      label: 'คำสั่ง',
      enLabel: 'Directives',
      icon: FileText,
      action: () => navigate('outgoing'),
      iconBg: 'group-hover:bg-indigo-50 group-hover:text-indigo-600',
    },
    {
      id: 'qa-pr',
      label: 'ประชาสัมพันธ์',
      enLabel: 'Public Relations',
      icon: Megaphone,
      action: () => {
        if (onOpenPrModal) onOpenPrModal();
        else navigate('documents');
      },
      iconBg: 'group-hover:bg-amber-50 group-hover:text-amber-600',
    },
    {
      id: 'qa-stats',
      label: 'สถิติ',
      enLabel: 'Statistics',
      icon: BarChart3,
      action: () => navigate('dashboard'),
      iconBg: 'group-hover:bg-emerald-50 group-hover:text-emerald-600',
    },
    {
      id: 'qa-reports',
      label: 'รายงาน',
      enLabel: 'Reports',
      icon: FileSpreadsheet,
      action: () => navigate('dashboard'),
      iconBg: 'group-hover:bg-teal-50 group-hover:text-teal-600',
    },
    {
      id: 'qa-calendar',
      label: 'ตารางภารกิจ ฝอ.5',
      enLabel: 'BPP 5 Missions',
      icon: CalendarDays,
      action: () => navigate('calendar'),
      iconBg: 'group-hover:bg-purple-50 group-hover:text-purple-600',
    },
    {
      id: 'qa-duty',
      label: 'ตารางเวร (สิบเวร)',
      enLabel: 'Duty Roster',
      icon: ShieldCheck,
      action: () => navigate('duty-roster'),
      iconBg: 'group-hover:bg-purple-50 group-hover:text-[#51439A]',
    },
  ];

  return (
    <div className="relative z-20 w-full">
      {/* Micro Section Label */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-slate-500 uppercase font-semibold">
          <span className="w-2 h-2 rounded-full bg-sky-500" />
          <span>QUICK ACCESS // ศูนย์บริการระบบงานสำคัญ</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
          คลิกเพื่อเข้าถึงโมดูลทันที
        </span>
      </div>

      {/* Grid of Clean Minimal Glass Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-2.5">
        {quickItems.map(item => {
          const IconComp = item.icon;
          return (
            <button
              key={item.id}
              id={item.id}
              type="button"
              onClick={item.action}
              className="group relative flex flex-col items-start justify-between p-3 sm:p-3.5 rounded-2xl bg-white/75 hover:bg-white border border-white/90 hover:border-sky-300 backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(15,23,42,0.03)] hover:shadow-md cursor-pointer text-left active:scale-95"
            >
              {/* Header Icon + Arrow */}
              <div className="w-full flex items-center justify-between">
                <div
                  className={`w-7 h-7 rounded-xl bg-slate-100/90 ${item.iconBg} flex items-center justify-center text-slate-600 transition-all`}
                >
                  <IconComp className="w-4 h-4 stroke-[1.75]" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-sky-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-0 group-hover:opacity-100" />
              </div>

              {/* Label */}
              <div className="mt-2.5">
                <div className="text-xs sm:text-[13px] font-semibold tracking-tight text-slate-800 group-hover:text-sky-700 transition-colors">
                  {item.label}
                </div>
                <div className="text-[10px] font-mono text-slate-400 group-hover:text-slate-600 transition-colors uppercase">
                  {item.enLabel}
                </div>
              </div>

              {/* Bottom Subtle Accent Glow */}
              <div className="absolute inset-x-3 bottom-0 h-0.5 bg-transparent group-hover:bg-sky-500/80 rounded-full transition-all" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
