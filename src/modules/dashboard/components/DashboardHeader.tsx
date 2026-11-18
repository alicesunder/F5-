import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../../contexts/AdminContext';
import { ROLE_LABELS } from '../../../data/departmentsData';
import { UserHeaderBadge } from '../../../components/common/UserHeaderBadge';
import {
  Shield,
  Bell,
  User,
  LogOut,
  ChevronDown,
  ArrowLeft,
  CheckCircle2,
  Lock,
  ExternalLink,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

interface DashboardHeaderProps {
  onOpenLoginModal: () => void;
  showBackToHub?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onOpenLoginModal,
  showBackToHub = false,
}) => {
  const {
    isAuthenticated,
    currentUser,
    currentRole,
    logout,
    navigateModule,
    notifications,
    markAllNotificationsRead,
  } = useAdmin();

  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' น.'
      );
      setDateStr(
        now.toLocaleDateString('th-TH', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      );
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const roleInfo = ROLE_LABELS[currentRole] || {
    title: 'เจ้าหน้าที่ผู้ปฏิบัติงาน',
    dept: 'ส่วนกลาง',
    color: '#6B7280',
    badge: String(currentRole).toUpperCase(),
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-4">
          {/* Left: Organization Crest & System Titles */}
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            {showBackToHub && (
              <button
                type="button"
                onClick={() => navigateModule('dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                title="กลับหน้าศูนย์บริหารงาน"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">หน้าหลัก</span>
              </button>
            )}

            {/* Logo Link to /dashboard */}
            <button
              type="button"
              onClick={() => navigateModule('dashboard')}
              className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/40 rounded-xl p-1 -m-1"
            >
              {/* Emblem Crest SVG */}
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#1F2937] via-[#2F3E46] to-[#1E3A8A] flex items-center justify-center shadow-md shadow-slate-900/10 border border-slate-700/30 group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
                <div className="w-8 h-8 rounded-xl border border-amber-300/40 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-amber-300" strokeWidth={2.2} />
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
                </span>
              </div>

              {/* Title & Subtitle */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-semibold text-[#1F2937] tracking-tight truncate group-hover:text-slate-900">
                    ระบบศูนย์กลางบริหารงานหน่วยงาน
                  </h1>
                  <span className="hidden md:inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    ระบบกลาง
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] truncate font-normal">
                  ระบบสารสนเทศเพื่อการบริหารงานและประสานงาน
                </p>
                <p className="hidden lg:block text-[10px] text-slate-400 font-mono">
                  สำนักงานอำนวยการและประสานงานกลาง
                </p>
              </div>
            </button>
          </div>

          {/* Right: Date/Time, Notifications, Profile / Login */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* System Clock (Desktop) */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-mono text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{dateStr}</span>
              <span className="text-slate-300">•</span>
              <span className="font-semibold text-slate-700">{timeStr}</span>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(prev => !prev)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                title="การแจ้งเตือนระบบ"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
                )}
              </button>

              {/* Notification Popover */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">การแจ้งเตือนงาน</h3>
                      <p className="text-[11px] text-slate-500">ข้อมูลอัปเดตจากแต่ละฝ่าย</p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-sky-600 hover:underline cursor-pointer"
                      >
                        อ่านทั้งหมด
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 px-2">
                    {notifications.slice(0, 5).map(item => (
                      <div key={item.id} className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-medium text-slate-800 line-clamp-1">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                          {item.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile & Logout via UserHeaderBadge */}
            <UserHeaderBadge />
          </div>
        </div>
      </div>
    </header>
  );
};
