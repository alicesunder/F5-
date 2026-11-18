import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  Clock,
  Calendar,
  Shield,
  UserCheck,
  Check,
} from 'lucide-react';
import { formatThaiDate } from '../../utils/formatters';
import { NotificationPopover } from '../common/NotificationPopover';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { UserHeaderBadge } from '../common/UserHeaderBadge';
import { HeaderThemeSwitcher } from './HeaderThemeSwitcher';
import { Role } from '../../types';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { currentRole, setRole, currentUser, notifications } = useAdmin();
  const [timeString, setTimeString] = useState('');
  const [dateString, setDateString] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
      );
      setDateString(formatThaiDate(now.toISOString().slice(0, 10)));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut Ctrl+K or /
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const roleLabels: Record<Role, { title: string; badge: string; en: string }> = {
    SUPER_ADMIN: { title: 'ผู้ดูแลระบบสูงสุด', badge: 'SUPER ADMIN', en: 'Super Administrator' },
    admin: { title: 'ผู้ดูแลระบบ', badge: 'ADMIN', en: 'System Administrator' },
    executive: { title: 'ผู้บริหารระดับสูง', badge: 'EXECUTIVE', en: 'Executive Officer' },
    officer: { title: 'เจ้าหน้าที่ฝ่ายอำนวยการ', badge: 'STAFF', en: 'Directorate Staff' },
    viewer: { title: 'ผู้ดูข้อมูลทั่วไป', badge: 'VIEWER', en: 'Standard Observer' },
    ADMIN: { title: 'ผู้ดูแลระบบส่วนกลาง', badge: 'SUPER ADMIN', en: 'Central Administrator' },
    ADMIN_DEPARTMENT: { title: 'ฝ่ายอำนวยการ', badge: 'ADMIN DEPT', en: 'Administration Division' },
    RELATIONS: { title: 'ฝ่ายมวลชนสัมพันธ์', badge: 'RELATIONS', en: 'Public Relations' },
    DISASTER: { title: 'ฝ่ายสาธารณภัย', badge: 'DISASTER', en: 'Disaster Division' },
    VOLUNTEER: { title: 'ฝ่ายจิตอาสา', badge: 'VOLUNTEER', en: 'Volunteer Corps' },
    VIEWER: { title: 'ผู้สังเกตการณ์ทั่วไป', badge: 'VIEWER', en: 'Standard Observer' },
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-[20px] text-[#111315] border-b border-[rgba(17,19,21,0.07)] flex items-center justify-between px-4 sm:px-7 no-print shadow-2xs">
        {/* Left: Mobile menu toggle and Institutional brand */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-[rgba(17,19,21,0.65)] hover:text-[#111315] hover:bg-[#F7F7F9] transition focus:outline-hidden lg:hidden cursor-pointer"
            aria-label="Toggle Navigation Rail"
          >
            <Menu className="w-5 h-5 stroke-[1.5]" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white border border-[rgba(91,42,134,0.15)] p-0.5 shadow-2xs flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src="/assets/fo5-logo.svg"
                alt="ตราสัญลักษณ์ ฝอ.5"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#5B2A86] uppercase">
                  OPERATIONAL INTELLIGENCE
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-emerald-50 text-[9px] font-mono font-bold text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE
                </span>
              </div>
              <h1 className="text-xs sm:text-sm font-bold tracking-tight text-[#25202B] leading-none mt-0.5">
                ศูนย์บริหารและประมวลผลข้อมูล ฝ่ายอำนวยการ ฝอ.5
              </h1>
            </div>
          </div>
        </div>

        {/* Right: Command Bar, Clock, Notifications, User/Role */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Command Search Trigger */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/60 hover:bg-white/90 border border-[rgba(17,19,21,0.09)] text-xs text-[rgba(17,19,21,0.55)] hover:text-[#111315] transition shadow-2xs group w-48 lg:w-60"
          >
            <Search className="w-3.5 h-3.5 text-[rgba(17,19,21,0.45)] group-hover:text-[#111315] stroke-[1.5]" />
            <span className="flex-1 text-left text-[11px] truncate">ค้นหาในระบบ (Command)...</span>
            <kbd className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-white border border-[rgba(17,19,21,0.12)] text-[rgba(17,19,21,0.5)]">
              ⌘K
            </kbd>
          </button>

          {/* Mobile Search Icon */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-xl text-[rgba(17,19,21,0.6)] hover:text-[#111315] hover:bg-white/60 transition md:hidden"
            title="ค้นหา"
          >
            <Search className="w-4 h-4 stroke-[1.5]" />
          </button>

          {/* Date & Monospace Clock (Editorial) */}
          <div className="hidden xl:flex items-center gap-3 px-3 py-1 rounded-xl bg-white/40 border border-[rgba(17,19,21,0.06)] text-[11px]">
            <div className="flex items-center gap-1.5 text-[rgba(17,19,21,0.7)]">
              <Calendar className="w-3.5 h-3.5 text-[rgba(17,19,21,0.45)] stroke-[1.5]" />
              <span>{dateString}</span>
            </div>
            <span className="text-[rgba(17,19,21,0.2)]">/</span>
            <div className="flex items-center gap-1.5 font-mono text-[rgba(17,19,21,0.85)]">
              <Clock className="w-3.5 h-3.5 text-[#234A78] stroke-[1.5]" />
              <span>{timeString}</span>
            </div>
          </div>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(prev => !prev)}
              className="relative p-2 rounded-xl text-[rgba(17,19,21,0.65)] hover:text-[#111315] hover:bg-white/70 transition focus:outline-hidden border border-transparent hover:border-[rgba(17,19,21,0.08)]"
              aria-label="แจ้งเตือน"
              title="การแจ้งเตือน"
            >
              <Bell className="w-4 h-4 stroke-[1.5]" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#A84E4E] ring-2 ring-[#EEF2F4]" />
              )}
            </button>

            {isNotifOpen && (
              <NotificationPopover onClose={() => setIsNotifOpen(false)} />
            )}
          </div>

          <HeaderThemeSwitcher />

          <div className="h-5 w-px bg-[rgba(17,19,21,0.12)] dark:bg-white/10 hidden sm:block" />

          {/* Role & User Session */}
          <UserHeaderBadge />
        </div>
      </header>

      {/* Global Command Search Overlay */}
      {isSearchOpen && (
        <GlobalSearchModal onClose={() => setIsSearchOpen(false)} />
      )}
    </>
  );
};
