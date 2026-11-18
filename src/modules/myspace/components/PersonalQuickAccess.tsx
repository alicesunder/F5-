import React from 'react';
import {
  Sparkles,
  Wallet,
  Coins,
  BadgePercent,
  Shield,
  History,
  FolderLock,
  GraduationCap,
  Calendar,
  Briefcase,
  Bot,
  Lock,
} from 'lucide-react';

interface PersonalQuickAccessProps {
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
}

export const PersonalQuickAccess: React.FC<PersonalQuickAccessProps> = ({
  activeSection,
  onSelectSection,
}) => {
  const items = [
    {
      id: 'overview',
      title: 'ภาพรวมของฉัน',
      subtitle: 'Dashboard รวมทุกมิติ',
      icon: Sparkles,
      color: '#2583D8',
      bgLight: 'hover:bg-blue-50/70',
    },
    {
      id: 'today',
      title: 'วันนี้ของฉัน',
      subtitle: 'กำหนดการ & ภารกิจวัน',
      icon: Calendar,
      color: '#3B82F6',
      bgLight: 'hover:bg-blue-50/70',
    },
    {
      id: 'workload',
      title: 'งานของฉัน',
      subtitle: '5 งานที่ได้รับมอบหมาย',
      icon: Briefcase,
      color: '#6366F1',
      bgLight: 'hover:bg-indigo-50/70',
    },
    {
      id: 'salary',
      title: 'เงินเดือน',
      subtitle: 'ดูสลิป & รายการหัก',
      icon: Wallet,
      color: '#10B981',
      bgLight: 'hover:bg-emerald-50/70',
    },
    {
      id: 'allowance',
      title: 'เบี้ยเลี้ยง',
      subtitle: 'สถานะ & ประวัติเบิก',
      icon: Coins,
      color: '#F59E0B',
      bgLight: 'hover:bg-amber-50/70',
    },
    {
      id: 'finance',
      title: 'รายรับ-รายจ่าย',
      subtitle: 'บันทึก & สรุปส่วนบุคคล',
      icon: BadgePercent,
      color: '#EC4899',
      bgLight: 'hover:bg-pink-50/70',
    },
    {
      id: 'gpf',
      title: 'กบข.',
      subtitle: 'ยอดสะสม ฿7,142',
      icon: Shield,
      color: '#8B5CF6',
      bgLight: 'hover:bg-purple-50/70',
    },
    {
      id: 'history',
      title: 'ประวัติของฉัน',
      subtitle: 'ไทม์ไลน์ราชการ POLIS',
      icon: History,
      color: '#06B6D4',
      bgLight: 'hover:bg-cyan-50/70',
    },
    {
      id: 'documents',
      title: 'เอกสารของฉัน',
      subtitle: 'ก.พ.7 / ทบ.1 / คำสั่ง',
      icon: FolderLock,
      color: '#2583D8',
      bgLight: 'hover:bg-blue-50/70',
    },
    {
      id: 'training',
      title: 'การฝึกอบรม',
      subtitle: 'หลักสูตร & วุฒิบัตร',
      icon: GraduationCap,
      color: '#7C3AED',
      bgLight: 'hover:bg-violet-50/70',
    },
    {
      id: 'assistant',
      title: 'ผู้ช่วยของฉัน AI',
      subtitle: 'ถาม-ตอบข้อมูลส่วนบุคคล',
      icon: Bot,
      color: '#5B2A86',
      bgLight: 'hover:bg-purple-50/70',
    },
    {
      id: 'security',
      title: 'ความปลอดภัย & Audit',
      subtitle: 'บันทึกการเข้าถึง & สิทธิ์',
      icon: Lock,
      color: '#475569',
      bgLight: 'hover:bg-slate-50/70',
    },
  ];

  return (
    <div className="rounded-2xl p-2 sm:p-2.5 bg-white/80 dark:bg-[#151A22]/80 border border-slate-200/80 dark:border-white/10 shadow-[0_4px_20px_rgba(30,25,50,0.04)] backdrop-blur-md">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 px-0.5">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSection(item.id)}
              className={`flex-shrink-0 group flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-200 cursor-pointer border ${
                isActive
                  ? 'bg-white dark:bg-[#1E2532] border-[#2583D8] dark:border-blue-400 shadow-sm ring-1 ring-[#2583D8]/30 text-slate-900 dark:text-white'
                  : 'bg-white/40 dark:bg-white/[0.02] border-transparent hover:border-slate-200 dark:hover:border-white/10 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                  isActive ? 'text-white shadow-2xs' : 'text-slate-600 dark:text-slate-300'
                }`}
                style={{
                  backgroundColor: isActive ? item.color : `${item.color}15`,
                  color: isActive ? '#FFFFFF' : item.color,
                }}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="min-w-0 pr-1">
                <div
                  className={`text-xs font-bold leading-tight truncate ${
                    isActive
                      ? 'text-[#2583D8] dark:text-blue-400'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {item.title}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {item.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
