import React from 'react';
import { motion } from 'motion/react';
import { useAdmin } from '../../contexts/AdminContext';
import { AppModule } from '../../types';
import { FO5_DEPARTMENTS_META } from '../../data/commandCenterData';
import {
  Home,
  CheckSquare,
  CalendarDays,
  Settings,
  Megaphone,
  ShieldAlert,
  LogOut,
  X,
  FileSignature,
  HeartHandshake,
  User,
  Zap,
  MessageSquareText,
  Network,
} from 'lucide-react';

interface GlobalSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenNotifications?: () => void;
  onOpenReports?: () => void;
  onOpenSettings?: () => void;
}

export const GlobalSidebar: React.FC<GlobalSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    activeModule,
    navigateModule,
    logout,
  } = useAdmin();

  const departmentItems = [
    {
      id: 'admin' as AppModule,
      label: 'งานอำนวยการ',
      sub: 'สารบรรณ · งบประมาณ',
      icon: Settings,
      color: '#5B2A86',
      gradient: 'linear-gradient(135deg, #5B2A86 0%, #8B46C8 100%)',
      softBg: 'rgba(91, 42, 134, 0.08)',
      activeBorder: 'rgba(91, 42, 134, 0.35)',
      count: FO5_DEPARTMENTS_META.admin.activeCount,
      progress: FO5_DEPARTMENTS_META.admin.progressPercent,
    },
    {
      id: 'relations' as AppModule,
      label: 'งานประชาสัมพันธ์',
      sub: 'สื่อสารองค์กร · ข่าวสาร',
      icon: Megaphone,
      color: '#2583D8',
      gradient: 'linear-gradient(135deg, #1E6BB8 0%, #38BDF8 100%)',
      softBg: 'rgba(37, 131, 216, 0.08)',
      activeBorder: 'rgba(37, 131, 216, 0.35)',
      count: FO5_DEPARTMENTS_META.relations.activeCount,
      progress: FO5_DEPARTMENTS_META.relations.progressPercent,
    },
    {
      id: 'disaster' as AppModule,
      label: 'งานพัฒนาช่วยเหลือประชาชน',
      sub: 'บรรเทาสาธารณภัย · ชุมชน',
      icon: ShieldAlert,
      color: '#E89B22',
      gradient: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
      softBg: 'rgba(232, 155, 34, 0.10)',
      activeBorder: 'rgba(232, 155, 34, 0.40)',
      count: FO5_DEPARTMENTS_META.disaster.activeCount,
      progress: FO5_DEPARTMENTS_META.disaster.progressPercent,
    },
    {
      id: 'volunteer' as AppModule,
      label: 'งานจิตอาสา',
      sub: 'จิตอาสา 904 · พระราชทาน',
      icon: HeartHandshake,
      color: '#42A77A',
      gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
      softBg: 'rgba(66, 167, 122, 0.10)',
      activeBorder: 'rgba(66, 167, 122, 0.38)',
      count: FO5_DEPARTMENTS_META.volunteer.activeCount,
      progress: FO5_DEPARTMENTS_META.volunteer.progressPercent,
    },
  ];

  const coreOperationalItems = [
    {
      id: 'org-structure' as AppModule,
      label: 'โครงสร้าง ฝอ.5',
      icon: Network,
      accent: '#4C1D95',
      matchIds: ['org-structure'] as AppModule[],
    },
    {
      id: 'task-center' as AppModule,
      label: 'ศูนย์งานด่วน & ติดตาม หน่วย ตชด.',
      icon: CheckSquare,
      accent: '#E11D48',
      matchIds: ['task-center', 'bpp-tracker'] as AppModule[],
    },
    {
      id: 'line-reports' as AppModule,
      label: 'รายงานจาก LINE',
      icon: MessageSquareText,
      accent: '#06C755',
      matchIds: ['line-reports'] as AppModule[],
    },
    {
      id: 'calendar' as AppModule,
      label: 'ปฏิทินภารกิจ & ตารางเวร',
      icon: CalendarDays,
      accent: '#7C3AED',
      matchIds: ['calendar', 'duty-roster'] as AppModule[],
    },
    {
      id: 'documents' as AppModule,
      label: 'คลังเอกสารราชการ',
      icon: FileSignature,
      accent: '#2583D8',
      matchIds: ['documents'] as AppModule[],
    },
    {
      id: 'settings' as AppModule,
      label: 'ตั้งค่าระบบ',
      icon: Settings,
      accent: '#64748B',
      matchIds: ['settings'] as AppModule[],
    },
  ];

  const handleSelectMenu = (moduleName: AppModule) => {
    navigateModule(moduleName);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] lg-glass-strong text-slate-700 dark:text-[#C8CDD5] flex flex-col justify-between select-none border-r border-slate-200/80 dark:border-white/10 shadow-[4px_0_24px_rgba(91,42,134,0.05)] transition-transform duration-200 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top 4-Color Spectrum Accent Ribbon */}
        <div className="h-1 w-full bg-gradient-to-r from-[#5B2A86] via-[#2583D8] via-[#E89B22] to-[#42A77A] shrink-0" />

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Brand Header */}
          <div className="px-4 py-3.5 flex items-center justify-between border-b border-slate-100 dark:border-white/10">
            <button
              type="button"
              onClick={() => handleSelectMenu('dashboard')}
              className="flex items-center gap-3 cursor-pointer group text-left"
            >
              <div className="relative w-10 h-10 rounded-2xl p-0.5 bg-gradient-to-tr from-[#5B2A86] via-[#2583D8] to-[#E89B22] shadow-sm group-hover:scale-105 transition-transform shrink-0">
                <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#161B26] p-1 flex items-center justify-center">
                  <img
                    src="/assets/fo5-logo.png"
                    alt="ฝอ.5 Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-extrabold tracking-tight bg-gradient-to-r from-[#5B2A86] via-[#2583D8] to-[#42A77A] bg-clip-text text-transparent dark:from-purple-300 dark:via-sky-300 dark:to-emerald-300 leading-tight">
                  ฝอ.5 COMMAND STUDIO
                </div>
                <div className="text-[11px] text-slate-500 dark:text-[#8E96A4] font-medium mt-0.5 truncate">
                  บก.อก.บช.ตชด. · ยุคใหม่
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-white/5 lg:hidden cursor-pointer"
              aria-label="ปิดเมนู"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="p-3 space-y-5">
            {/* หมวดที่ 1: พื้นที่หลักและส่วนตัว */}
            <div className="space-y-2">
              <div className="px-2 flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500">
                <span>1. พื้นที่หลัก & ส่วนตัว</span>
                <Zap className="w-3 h-3 text-amber-500" />
              </div>

              {/* หน้าหลักภาพรวม */}
              <motion.button
                type="button"
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectMenu('dashboard')}
                className={`w-full group relative flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-2xl text-xs cursor-pointer text-left transition-all ${
                  activeModule === 'dashboard'
                    ? 'bg-gradient-to-r from-[#5B2A86] to-[#7C3AED] text-white font-bold shadow-md shadow-purple-900/20'
                    : 'text-slate-700 dark:text-[#C8CDD5] hover:bg-purple-50/70 dark:hover:bg-white/5 font-semibold'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                      activeModule === 'dashboard'
                        ? 'bg-white/20 text-white'
                        : 'bg-purple-100 dark:bg-purple-500/15 text-[#5B2A86] dark:text-purple-300 group-hover:bg-[#5B2A86] group-hover:text-white'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="truncate block">หน้าหลักภาพรวม</span>
                    <span
                      className={`text-[10px] block truncate ${
                        activeModule === 'dashboard'
                          ? 'text-purple-100'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      Command Center Hub
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-lg ${
                    activeModule === 'dashboard'
                      ? 'bg-white/20 text-white font-bold'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-500'
                  }`}
                >
                  HOME
                </span>
              </motion.button>

              {/* ฉัน (MY SPACE) Interactive Profile Card */}
              <motion.button
                type="button"
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectMenu('my-space')}
                className={`w-full group relative p-2.5 rounded-2xl text-xs cursor-pointer text-left transition-all border ${
                  activeModule === 'my-space'
                    ? 'bg-gradient-to-r from-[#1D68B0] to-[#2583D8] text-white border-transparent shadow-md shadow-sky-900/20'
                    : 'bg-gradient-to-br from-sky-50/90 via-indigo-50/50 to-white dark:from-sky-950/30 dark:via-slate-900 dark:to-slate-900 border-sky-200/70 dark:border-sky-500/20 hover:border-sky-400 text-slate-800 dark:text-slate-100'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-[11px] shrink-0 shadow-xs ${
                        activeModule === 'my-space'
                          ? 'bg-white text-[#1D68B0]'
                          : 'bg-gradient-to-br from-[#2583D8] to-[#5B2A86] text-white'
                      }`}
                    >
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-extrabold truncate leading-tight">
                        ฉัน (MY SPACE)
                      </div>
                      <div
                        className={`text-[10px] truncate mt-0.5 ${
                          activeModule === 'my-space'
                            ? 'text-sky-100'
                            : 'text-sky-700 dark:text-sky-300 font-medium'
                        }`}
                      >
                        ข้อมูลส่วนตัว · เงินเดือน · งาน
                      </div>
                    </div>
                  </div>
                </div>
              </motion.button>
            </div>

            {/* หมวดที่ 2: ระบบ 4 สายงานหลัก (Colorful Tactile Cards) */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
              <div className="px-2 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                  2. ระบบ 4 สายงานหลัก
                </span>
                <span className="text-[10px] font-semibold text-[#5B2A86] dark:text-purple-300">
                  คลิกเข้าทันที
                </span>
              </div>

              <div className="space-y-1.5">
                {departmentItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectMenu(item.id)}
                      title={item.label}
                      className={`w-full group relative p-2.5 rounded-2xl text-xs cursor-pointer text-left transition-all border ${
                        isActive
                          ? 'text-white shadow-md border-transparent'
                          : 'bg-white dark:bg-white/[0.03] hover:shadow-xs border-slate-200/75 dark:border-white/10'
                      }`}
                      style={
                        isActive
                          ? { background: item.gradient }
                          : { backgroundColor: item.softBg, borderColor: item.activeBorder }
                      }
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105"
                            style={
                              isActive
                                ? { backgroundColor: 'rgba(255,255,255,0.22)', color: '#FFFFFF' }
                                : { background: item.gradient, color: '#FFFFFF' }
                            }
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <span
                              className={`block truncate leading-tight ${
                                isActive
                                  ? 'font-extrabold text-white'
                                  : 'font-bold text-slate-800 dark:text-slate-100'
                              }`}
                            >
                              {item.label}
                            </span>
                            <span
                              className={`block text-[10px] truncate mt-0.5 ${
                                isActive
                                  ? 'text-white/85'
                                  : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {item.sub}
                            </span>
                          </div>
                        </div>

                        {item.count > 0 && <span
                          className={`text-[10px] font-mono tabular-nums font-extrabold px-1.5 py-0.5 rounded-lg shrink-0 ${
                            isActive ? 'bg-white/25 text-white' : 'bg-white/90 dark:bg-black/30'
                          }`}
                          style={!isActive ? { color: item.color } : undefined}
                        >
                          {item.count} งาน
                        </span>}
                      </div>

                      {/* Mini Progress Bar inside Department Button */}
                      <div
                        className={`mt-2 w-full h-1 rounded-full overflow-hidden ${
                          isActive ? 'bg-white/25' : 'bg-white/80 dark:bg-white/10'
                        }`}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${item.progress}%`,
                            backgroundColor: isActive ? '#FFFFFF' : item.color,
                          }}
                        />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* หมวดที่ 3: เครื่องมือปฏิบัติการกลาง (จำเป็นจริง 4 รายการ) */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-white/5">
              <div className="px-2 pb-0.5 text-[11px] font-bold text-slate-400 dark:text-slate-500">
                3. เครื่องมือปฏิบัติการกลาง
              </div>

              {coreOperationalItems.map(item => {
                const Icon = item.icon;
                const isActive = item.matchIds.includes(activeModule);

                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectMenu(item.id)}
                    className={`w-full group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs cursor-pointer text-left transition-all ${
                      isActive
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-xs'
                        : 'text-slate-700 dark:text-[#C8CDD5] hover:bg-slate-100/90 dark:hover:bg-white/5 font-medium'
                    }`}
                  >
                    <span
                      className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: isActive ? 'rgba(255,255,255,0.18)' : `${item.accent}18`,
                        color: isActive ? 'currentColor' : item.accent,
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span className="truncate">{item.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Bottom Section: Logout */}
        <div className="p-3 border-t border-slate-200/80 dark:border-white/10 bg-gradient-to-r from-purple-50/50 via-sky-50/40 to-emerald-50/50 dark:from-[#151821] dark:to-[#151821]">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 dark:hover:bg-rose-600 transition-all cursor-pointer text-left group"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5 flex-shrink-0 text-rose-500 group-hover:text-white transition-colors" />
              <span>ออกจากระบบ</span>
            </span>
            <span className="text-[10px] text-slate-400 group-hover:text-rose-100 font-mono">
              FO5 v3.0
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default GlobalSidebar;
