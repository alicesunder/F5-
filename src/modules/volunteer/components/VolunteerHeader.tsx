import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HeartHandshake,
  Search,
  Bell,
  Plus,
  Bot,
  Calendar,
  Clock,
  Sparkles,
  FileCheck,
  ChevronRight,
  Shield,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import { useVolunteer, VolunteerTab } from '../context/VolunteerContext';
import { useAdmin } from '../../../contexts/AdminContext';

export const VolunteerHeader: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setIsAddMissionModalOpen,
    setIsAiAssistantOpen,
    stats,
  } = useVolunteer();

  const { navigateModule } = useAdmin();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadNotifCount = notifications.filter(n => !n.isRead).length;

  const tabs: { id: VolunteerTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'ภาพรวมระบบ', icon: Layers },
    { id: 'missions', label: 'ศูนย์ภารกิจ', icon: Calendar },
    { id: 'reports', label: 'รายงานผล (จอ.01)', icon: FileCheck },
    { id: 'personnel', label: 'เครือข่ายหน่วย & กำลังพล', icon: HeartHandshake },
  ];

  const formattedTime = currentTime.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <header className="relative z-30 mb-4">
      <div
        className="relative rounded-3xl overflow-hidden text-white shadow-xl border border-white/15"
        style={{
          background: 'linear-gradient(135deg, #064E3B 0%, #047857 42%, #42A77A 76%, #10B981 100%)',
        }}
      >
        {/* 4-Color Spectrum Top Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#42A77A] via-[#34D399] via-[#E89B22] to-[#2583D8]" />

        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-300/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.45) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 p-5 sm:p-7 space-y-5">
          {/* Top Bar: Title, Live Clock, Global Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigateModule('dashboard')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition cursor-pointer backdrop-blur-md"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>กลับศูนย์บัญชาการหลัก</span>
                </button>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-400/20 border border-emerald-300/30 text-[11px] font-mono font-bold text-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  ROYAL VOLUNTEER COMMAND STUDIO • /volunteer
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-lg shrink-0">
                  <HeartHandshake className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-200" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
                    สายงานจิตอาสาพระราชทาน ๙๐๔ และโครงการอันเนื่องมาจากพระราชดำริ
                  </h1>
                  <p className="text-xs sm:text-sm text-emerald-100/85 mt-0.5">
                    วางแผน มอบหมาย ติดตาม และตรวจรับรองรายงานผลการปฏิบัติงานจิตอาสา (จอ.01) อย่างเป็นระบบ
                  </p>
                </div>
              </div>
            </div>

            {/* Right Info: Live Time, Search, Notif, New Mission */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Live Time badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs">
                <Clock className="w-3.5 h-3.5 text-emerald-200" />
                <span className="font-mono font-bold tabular-nums">{formattedTime} น.</span>
              </div>

              {/* Quick Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-emerald-200 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="ค้นหาภารกิจ, หน่วย..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-44 sm:w-52 pl-9 pr-3 py-2 text-xs rounded-2xl bg-white/15 border border-white/20 text-white placeholder-emerald-100/70 focus:outline-none focus:bg-white/25 transition-all backdrop-blur-md"
                />
              </div>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(prev => !prev)}
                  className="relative p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition cursor-pointer backdrop-blur-md"
                  title="การแจ้งเตือน"
                >
                  <Bell className="w-4 h-4 text-emerald-200" />
                  {unreadNotifCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm animate-pulse">
                      {unreadNotifCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {isNotifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white/95 backdrop-blur-xl border border-emerald-200 shadow-2xl p-3.5 z-50 text-slate-900"
                    >
                      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-emerald-100">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-[#42A77A]" />
                          <span className="text-xs font-bold text-[#25202B]">การแจ้งเตือนข้อสั่งการ & รายงาน</span>
                        </div>
                        {unreadNotifCount > 0 && (
                          <button
                            onClick={markAllNotificationsRead}
                            className="text-[11px] text-[#42A77A] hover:underline font-medium"
                          >
                            อ่านทั้งหมด
                          </button>
                        )}
                      </div>

                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer border ${
                              n.isRead
                                ? 'bg-[#F9FBF9] border-transparent text-[#6B6973]'
                                : 'bg-[#EAF7F0]/60 border-emerald-200 text-[#25202B]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-semibold text-[12px] text-[#25202B]">{n.title}</p>
                              <span className="text-[10px] text-[#A29FA8] whitespace-nowrap">{n.timestamp}</span>
                            </div>
                            <p className="text-[11px] text-[#6B6973] mt-1 leading-relaxed">{n.message}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Create New Mission Button */}
              <button
                onClick={() => setIsAddMissionModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white text-emerald-950 text-xs font-black hover:bg-emerald-50 transition-all shadow-lg cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 text-[#047857]" />
                <span>สร้างภารกิจใหม่</span>
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="pt-3 border-t border-white/15 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs whitespace-nowrap font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#047857] shadow-md scale-[1.02]'
                      : 'text-emerald-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#047857]' : 'text-emerald-200'}`} />
                  <span>{tab.label}</span>
                  {tab.id === 'reports' && stats.pendingReviewReports > 0 && (
                    <span className="px-1.5 py-0.2 bg-amber-500 text-white text-[10px] font-bold font-mono rounded-md">
                      {stats.pendingReviewReports}
                    </span>
                  )}
                  {tab.id === 'missions' && stats.pendingReportMissions > 0 && (
                    <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-bold font-mono rounded-md">
                      {stats.pendingReportMissions}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
