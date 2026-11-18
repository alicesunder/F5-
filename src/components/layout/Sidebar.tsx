import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import {
  Home,
  LayoutDashboard,
  DollarSign,
  Briefcase,
  Inbox,
  Send,
  Building2,
  FolderArchive,
  BarChart3,
  History,
  Settings,
  X,
  FileCheck2,
  CalendarCheck,
  Compass,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { activeMenu, navigate, kpis } = useAdmin();

  const menuItems = [
    {
      num: '00',
      id: 'home',
      label: 'หน้าหลัก ฝอ.5',
      enLabel: 'Landing Page',
      icon: Home,
      badge: 'NEW',
      badgeTone: 'blue',
    },
    {
      num: '01',
      id: 'dashboard',
      label: 'ภาพรวมผู้บริหาร',
      enLabel: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      num: '02',
      id: 'ai-inspection',
      label: 'AI ตรวจสอบเอกสาร',
      enLabel: 'AI Inspector',
      icon: FileCheck2,
      badge: `${kpis.inspectedDocuments}`,
      badgeTone: 'green',
    },
    {
      num: '03',
      id: 'meetings',
      label: 'การประชุมรายเดือน',
      enLabel: 'Monthly Meetings',
      icon: CalendarCheck,
      badge: `${kpis.totalMeetings}`,
      badgeTone: 'blue',
    },
    {
      num: '04',
      id: 'missions',
      label: 'ภารกิจและกำลังพล',
      enLabel: 'Missions & Conflict',
      icon: Compass,
      badge: kpis.activeMissions > 0 ? `${kpis.activeMissions}` : null,
      badgeTone: 'green',
    },
    {
      num: '05',
      id: 'budget',
      label: 'งานงบประมาณ',
      enLabel: 'Budget Operations',
      icon: DollarSign,
      badge: null,
    },
    {
      num: '06',
      id: 'travel',
      label: 'งานไปราชการ',
      enLabel: 'Official Travel',
      icon: Briefcase,
      badge: kpis.travelThisMonth > 0 ? `${kpis.travelThisMonth}` : null,
      badgeTone: 'amber',
    },
    {
      num: '07',
      id: 'incoming',
      label: 'หนังสือรับ',
      enLabel: 'Incoming Docs',
      icon: Inbox,
      badge: kpis.pendingIncoming > 0 ? `${kpis.pendingIncoming}` : null,
      badgeTone: 'red',
    },
    {
      num: '08',
      id: 'outgoing',
      label: 'หนังสือส่ง',
      enLabel: 'Outgoing Docs',
      icon: Send,
      badge: null,
    },
    {
      num: '09',
      id: 'units',
      label: 'ข้อมูลหน่วยงานและกำลังพล',
      enLabel: 'Personnel Directory',
      icon: Building2,
      badge: `${kpis.totalPersonnel}`,
      badgeTone: 'neutral',
    },
    {
      num: '10',
      id: 'documents',
      label: 'ระบบคลังเอกสารกลาง',
      enLabel: 'Archival Center',
      icon: FolderArchive,
      badge: `${kpis.totalDocuments}`,
      badgeTone: 'neutral',
    },
    {
      num: '11',
      id: 'analytics',
      label: 'รายงานและการวิเคราะห์',
      enLabel: 'Analytics & BI',
      icon: BarChart3,
      badge: null,
    },
    {
      num: '12',
      id: 'logs',
      label: 'บันทึกประวัติการทำงาน',
      enLabel: 'Audit & Telemetry',
      icon: History,
      badge: null,
    },
    {
      num: '13',
      id: 'settings',
      label: 'ตั้งค่าระบบ',
      enLabel: 'Configurations',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop with Subtle Blur */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-[#111315]/40 backdrop-blur-[6px] z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Command Navigation Rail */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 h-screen lg:h-[calc(100vh-4rem)] z-40 bg-[rgba(245,247,248,0.85)] backdrop-blur-[24px] text-[#111315] border-r border-[rgba(17,19,21,0.08)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col no-print ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-[76px]' : 'w-[280px]'}`}
      >
        {/* Top Identification Header */}
        <div className="p-4 border-b border-[rgba(17,19,21,0.08)] flex items-center justify-between">
          <div
            onClick={() => navigate('home')}
            className="flex items-center gap-3 cursor-pointer group/brand"
            title="กลับสู่หน้าหลัก ฝอ.5"
          >
            <div className="w-9 h-9 rounded-xl bg-[#17324F] group-hover/brand:bg-[#234A78] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-xs select-none transition-colors">
              ฝอ.5
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono tracking-widest text-[#42695B] font-semibold uppercase">
                    // COMMAND RAIL
                  </span>
                </div>
                <h2 className="text-xs font-semibold tracking-tight text-[#111315] group-hover/brand:text-[#234A78] truncate leading-tight transition-colors">
                  งานอำนวยการ ฝอ.5
                </h2>
                <p className="text-[10px] text-[rgba(17,19,21,0.48)] truncate">
                  SMART ADMIN CENTER
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Collapse toggle on desktop */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-[rgba(17,19,21,0.45)] hover:text-[#111315] hover:bg-white/60 transition"
              title={isCollapsed ? 'ขยายแถบเมนู' : 'ย่อแถบเมนู'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[rgba(17,19,21,0.45)] hover:text-[#111315] hover:bg-white/60 transition lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {!isCollapsed && (
            <div className="px-3 pt-1 pb-2 flex items-center justify-between text-[10px] font-mono tracking-widest text-[rgba(17,19,21,0.38)] uppercase">
              <span>// DIRECTORY</span>
              <span>13 MODULES</span>
            </div>
          )}

          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.id);
                  onClose();
                }}
                title={isCollapsed ? item.label : undefined}
                className={`w-full group relative flex items-center transition-all duration-200 cursor-pointer rounded-xl ${
                  isCollapsed ? 'justify-center p-2.5 my-1' : 'px-3 py-2 text-left'
                } ${
                  isActive
                    ? 'bg-white/80 border border-white/90 shadow-[0_4px_16px_rgba(20,30,35,0.06)] text-[#111315] font-medium'
                    : 'text-[rgba(17,19,21,0.68)] hover:text-[#111315] hover:bg-white/45'
                }`}
              >
                {/* Active Indicator Accent Line */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#17324F] rounded-r" />
                )}

                {/* Editorial Micro Numeral */}
                {!isCollapsed && (
                  <span
                    className={`font-mono text-[10px] tracking-wider shrink-0 w-5 transition-colors ${
                      isActive ? 'text-[#17324F] font-semibold' : 'text-[rgba(17,19,21,0.35)] group-hover:text-[rgba(17,19,21,0.55)]'
                    }`}
                  >
                    {item.num}
                  </span>
                )}

                {/* Icon */}
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? 'text-[#17324F]'
                      : 'text-[rgba(17,19,21,0.48)] group-hover:text-[#111315]'
                  } ${!isCollapsed ? 'ml-1' : ''}`}
                />

                {/* Text Labels */}
                {!isCollapsed && (
                  <div className="ml-2.5 flex-1 min-w-0 flex items-center justify-between">
                    <div className="truncate">
                      <span className="text-xs truncate block font-normal tracking-tight">
                        {item.label}
                      </span>
                    </div>

                    {item.badge && (
                      <span
                        className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-medium tracking-tight whitespace-nowrap ${
                          item.badgeTone === 'green'
                            ? 'bg-[#42695B]/10 text-[#42695B]'
                            : item.badgeTone === 'blue'
                            ? 'bg-[#234A78]/10 text-[#234A78]'
                            : item.badgeTone === 'amber'
                            ? 'bg-[#A77A35]/12 text-[#A77A35]'
                            : item.badgeTone === 'red'
                            ? 'bg-[#A84E4E]/12 text-[#A84E4E]'
                            : 'bg-[rgba(17,19,21,0.06)] text-[rgba(17,19,21,0.65)]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* System Telemetry Minimal Footer */}
        {!isCollapsed && (
          <div className="p-3 border-t border-[rgba(17,19,21,0.08)] bg-white/40">
            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5 text-[#42695B] font-medium font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#557C67] animate-pulse" />
                <span>TELEMETRY ONLINE</span>
              </div>
              <span className="font-mono text-[9px] text-[rgba(17,19,21,0.40)]">v2.8.0-INTEL</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
