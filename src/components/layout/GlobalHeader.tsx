import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../../contexts/AdminContext';
import {
  Search,
  Bell,
  User,
  LogOut,
  Menu,
  ChevronDown,
  Settings,
  Sparkles,
} from 'lucide-react';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { NotificationPopover } from '../common/NotificationPopover';
import { HeaderThemeSwitcher } from './HeaderThemeSwitcher';

interface GlobalHeaderProps {
  onToggleSidebar: () => void;
  onOpenProfile: () => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  onToggleSidebar,
  onOpenProfile,
}) => {
  const {
    currentUser,
    notifications,
    logout,
    navigateModule,
  } = useAdmin();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length || 3;

  return (
    <>
      <header className="sticky top-0 z-30 lg-glass-strong border-b border-slate-200/80 dark:border-white/10 h-16 flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 select-none shadow-[0_4px_20px_rgba(91,42,134,0.04)]">
        {/* Zone 1: Mobile Menu Trigger & Vibrant Brand Identity */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-600 hover:text-[#5B2A86] dark:text-slate-300 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-white/10 transition lg:hidden cursor-pointer shrink-0"
            aria-label="เปิดเมนูนำทาง"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => navigateModule('dashboard')}
            className="flex items-center gap-2.5 text-left cursor-pointer min-w-0 group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-100 via-sky-50 to-amber-50 dark:from-purple-900/40 dark:to-sky-900/40 p-1 flex items-center justify-center border border-purple-200/70 dark:border-white/15 shrink-0 group-hover:scale-105 transition-transform">
              <img
                src="/assets/fo5-logo.png"
                alt="ฝอ.5"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <span className="font-bpp text-sm sm:text-base font-extrabold bg-gradient-to-r from-[#5B2A86] via-[#1D68B0] to-[#267853] dark:from-purple-200 dark:via-sky-200 dark:to-emerald-200 bg-clip-text text-transparent tracking-tight truncate block">
                ศูนย์บริหารและประมวลผลข้อมูล ฝ่ายอำนวยการ 5 (ฝอ.5 บก.อก.บช.ตชด.)
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Interactive Spotlight Command Search Bar */}
        <div className="hidden md:flex items-center justify-center flex-1 max-w-md">
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-purple-50/70 via-sky-50/60 to-emerald-50/60 hover:from-purple-100/70 hover:to-sky-100/70 dark:from-white/5 dark:to-white/10 border border-purple-200/70 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 transition-all cursor-pointer shadow-2xs"
          >
            <span className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-[#5B2A86] dark:text-purple-400 shrink-0" />
              <span className="truncate font-medium">
                ค้นหาสายงาน ภารกิจ เอกสาร หรือสั่งการด่วน...
              </span>
            </span>
            <kbd className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white dark:bg-white/10 border border-purple-200/80 dark:border-white/15 text-[#5B2A86] dark:text-purple-300 shrink-0 font-bold shadow-2xs">
              ⌘K
            </kbd>
          </motion.button>
        </div>

        {/* Zone 3: Quick Actions & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-white/10 transition cursor-pointer"
            title="ค้นหา"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsNotifOpen(prev => !prev)}
              className="relative p-2 rounded-xl bg-slate-100/80 dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-purple-100/70 hover:text-[#5B2A86] dark:hover:bg-white/10 transition cursor-pointer"
              title="การแจ้งเตือน"
              aria-label="การแจ้งเตือน"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[9px] font-bold font-mono tabular-nums flex items-center justify-center ring-2 ring-white dark:ring-[#151821]">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            {isNotifOpen && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <NotificationPopover onClose={() => setIsNotifOpen(false)} />
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          <HeaderThemeSwitcher />

          <div className="h-5 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileDropdownOpen(prev => !prev)}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-2xl bg-gradient-to-r from-purple-50/80 to-sky-50/80 dark:from-white/5 dark:to-white/10 hover:from-purple-100/80 hover:to-sky-100/80 border border-purple-200/60 dark:border-white/10 transition cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5B2A86] via-[#2583D8] to-[#42A77A] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-xs">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden sm:block min-w-0">
                <div className="text-xs font-extrabold text-slate-900 dark:text-[#F5F7FA] leading-tight truncate">
                  {currentUser.rank} {currentUser.name}
                </div>
                <div className="text-[10px] text-[#5B2A86] dark:text-purple-300 font-semibold truncate">
                  เจ้าหน้าที่ ฝอ.5 · ออนไลน์
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            <AnimatePresence>
              {isProfileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.96 }}
                  transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#181C24] rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl py-1.5 z-50 origin-top-right"
                >
                  <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-white/10 bg-gradient-to-r from-purple-50/60 to-sky-50/60 dark:from-purple-950/30 dark:to-sky-950/30">
                    <div className="text-xs font-extrabold text-slate-900 dark:text-[#F5F7FA]">
                      {currentUser.rank} {currentUser.name}
                    </div>
                    <div className="text-[10px] text-[#5B2A86] dark:text-purple-300 font-medium">
                      งานประชาสัมพันธ์ ฝอ.5
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      navigateModule('my-space');
                    }}
                    className="w-full px-3.5 py-2 text-xs text-[#5B2A86] dark:text-[#B3A0E8] hover:bg-[#F3EDF9] dark:hover:bg-purple-500/20 flex items-center gap-2 transition cursor-pointer text-left font-bold"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#5B2A86] dark:text-[#B3A0E8]" />
                    <span>ฉัน (MY SPACE ข้อมูลส่วนตัว)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onOpenProfile();
                    }}
                    className="w-full px-3.5 py-2 text-xs text-slate-700 dark:text-[#A9AFBB] hover:bg-slate-50 dark:hover:bg-white/10 flex items-center gap-2 transition cursor-pointer text-left font-medium"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>ข้อมูลบัญชีผู้ใช้</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      navigateModule('settings');
                    }}
                    className="w-full px-3.5 py-2 text-xs text-slate-700 dark:text-[#A9AFBB] hover:bg-slate-50 dark:hover:bg-white/10 flex items-center gap-2 transition cursor-pointer text-left font-medium"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>ตั้งค่าระบบ</span>
                  </button>

                  <div className="border-t border-slate-100 dark:border-white/10 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      logout();
                    }}
                    className="w-full px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50/80 dark:hover:bg-rose-950/30 flex items-center gap-2 transition cursor-pointer text-left font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>ออกจากระบบ</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isSearchOpen && (
          <GlobalSearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalHeader;
