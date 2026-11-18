import React, { useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import {
  X,
  Home,
  Users,
  Briefcase,
  Inbox,
  Compass,
  Megaphone,
  FolderArchive,
  FileSpreadsheet,
  BarChart3,
  Settings,
  LogOut,
  LogIn,
  ChevronRight,
  Shield,
  UserCheck,
} from 'lucide-react';
import { Role } from '../../types';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
  onOpenPrModal: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
  onOpenPrModal,
}) => {
  const {
    activeMenu,
    navigate,
    isAuthenticated,
    currentUser,
    currentRole,
    setRole,
    logout,
  } = useAdmin();

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    {
      num: '01',
      id: 'home',
      label: 'หน้าหลัก',
      enLabel: 'Landing / Home',
      icon: Home,
      action: () => {
        navigate('home');
        onClose();
      },
    },
    {
      num: '02',
      id: 'units',
      label: 'งานบุคคล',
      enLabel: 'Personnel Directory',
      icon: Users,
      action: () => {
        navigate('units');
        onClose();
      },
    },
    {
      num: '03',
      id: 'travel',
      label: 'งานธุรการ',
      enLabel: 'General Admin & Travel',
      icon: Briefcase,
      action: () => {
        navigate('travel');
        onClose();
      },
    },
    {
      num: '04',
      id: 'incoming',
      label: 'งานสารบรรณ',
      enLabel: 'Correspondence & Registry',
      icon: Inbox,
      action: () => {
        navigate('incoming');
        onClose();
      },
    },
    {
      num: '05',
      id: 'missions',
      label: 'งานกำลังพล',
      enLabel: 'Missions & Operations',
      icon: Compass,
      action: () => {
        navigate('missions');
        onClose();
      },
    },
    {
      num: '06',
      id: 'pr',
      label: 'งานประชาสัมพันธ์',
      enLabel: 'Public Relations',
      icon: Megaphone,
      action: () => {
        onClose();
        onOpenPrModal();
      },
    },
    {
      num: '07',
      id: 'documents',
      label: 'เอกสารและคำสั่ง',
      enLabel: 'Orders & Archival Repository',
      icon: FolderArchive,
      action: () => {
        navigate('documents');
        onClose();
      },
    },
    {
      num: '08',
      id: 'reports',
      label: 'รายงาน',
      enLabel: 'Executive Reports',
      icon: FileSpreadsheet,
      action: () => {
        navigate('dashboard');
        onClose();
      },
    },
    {
      num: '09',
      id: 'analytics',
      label: 'สถิติ',
      enLabel: 'Intelligence & Analytics',
      icon: BarChart3,
      action: () => {
        navigate('dashboard');
        onClose();
      },
    },
    {
      num: '10',
      id: 'settings',
      label: 'ตั้งค่าระบบ',
      enLabel: 'System Configurations',
      icon: Settings,
      action: () => {
        navigate('settings');
        onClose();
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-in Drawer Container */}
      <div
        id="landing-menu-drawer"
        className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-2xl border-r border-slate-200/80 shadow-2xl flex flex-col h-full overflow-hidden text-slate-800 animate-in slide-in-from-left duration-300"
      >
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              ฝอ.5
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>งานอำนวยการ ฝอ.5</span>
              </div>
              <p className="text-[10px] font-mono text-sky-700 tracking-wider uppercase font-semibold">
                DIRECTORATE COMMAND SYSTEM
              </p>
            </div>
          </div>

          <button
            id="btn-close-drawer"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            aria-label="ปิดเมนู"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 10 Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 custom-scrollbar">
          <div className="px-3 py-1 text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
            // MAIN DIRECTORY (10 SECTIONS)
          </div>

          {menuItems.map((item, idx) => {
            const IconComp = item.icon;
            const isCurrent = activeMenu === item.id;
            return (
              <button
                key={item.id}
                id={`drawer-item-${item.id}`}
                type="button"
                onClick={item.action}
                style={{ animationDelay: `${idx * 25}ms` }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all duration-150 text-left group cursor-pointer ${
                  isCurrent
                    ? 'bg-sky-50 border border-sky-200 text-sky-800 shadow-xs font-semibold'
                    : 'hover:bg-slate-100/80 border border-transparent hover:border-slate-200/60 text-slate-700 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-slate-400 group-hover:text-sky-600 transition-colors w-5">
                    {item.num}
                  </span>
                  <div
                    className={`p-2 rounded-xl ${
                      isCurrent
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-500 group-hover:text-sky-600 group-hover:bg-sky-50'
                    } transition-all`}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm tracking-tight">{item.label}</div>
                    <div className="text-[10px] font-mono text-slate-400 group-hover:text-slate-500">
                      {item.enLabel}
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            );
          })}
        </div>

        {/* Drawer Bottom Panel: User Profile + Online Status + Logout/Login */}
        <div className="p-4 sm:p-5 border-t border-slate-200/80 bg-slate-50/90">
          {isAuthenticated ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {currentUser?.rank?.slice(0, 2) || 'จน.'}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {currentUser?.name}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      {currentUser?.position}
                    </div>
                  </div>
                </div>

                {/* Online Indicator */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-mono text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Online</span>
                </div>
              </div>

              {/* Quick Role Toggle Bar */}
              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono">สิทธิ์ผู้ใช้:</span>
                <div className="flex items-center gap-1">
                  {(['admin', 'executive', 'officer'] as Role[]).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition uppercase ${
                        currentRole === r
                          ? 'bg-sky-600 text-white font-bold'
                          : 'bg-slate-200/80 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logout Button */}
              <button
                id="btn-drawer-logout"
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 text-center">
                ยังไม่ได้เข้าสู่ระบบงานอำนวยการ
              </div>
              <button
                id="btn-drawer-login"
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium flex items-center justify-center gap-2 transition shadow-sm cursor-pointer active:scale-95"
              >
                <LogIn className="w-4 h-4 text-white" />
                <span>เข้าสู่ระบบงาน</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
