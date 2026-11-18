import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  ListFilter,
  Layers,
  CalendarDays,
  Search,
  Bell,
  User,
  ChevronDown,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { BppMissionHero } from './components/BppMissionHero';
import { BppMissionKpiCards } from './components/BppMissionKpiCards';
import { BppMissionFilters } from './components/BppMissionFilters';
import { BppMissionTableView } from './components/BppMissionTableView';
import { BppMissionCalendarView } from './components/BppMissionCalendarView';
import { BppMissionTimelineView } from './components/BppMissionTimelineView';
import { BppMissionDetailModal } from './components/BppMissionDetailModal';
import { BppAddMissionModal } from './components/BppAddMissionModal';
import { BppDutyRosterSection } from './BppDutyRosterSection';
import { BppMissionAnalyticsSection } from './components/BppMissionAnalyticsSection';
import { INITIAL_BPP_MISSIONS } from './data/bppMissionData';
import {
  BppMissionItem,
  BppMissionStatus,
  BppMissionCategory,
  BppScheduleViewMode,
} from './types';
import { useCollection } from '../../lib/collections';

interface BppMissionSchedulePageProps {
  initialTab?: 'missions' | 'duty';
}

export const BppMissionSchedulePage: React.FC<BppMissionSchedulePageProps> = ({
  initialTab = 'missions',
}) => {
  const { currentUser } = useAdmin();
  const [activeTab, setActiveTab] = useState<'missions' | 'duty'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [missions, setMissions] = useCollection<BppMissionItem>('schedule.missions');
  const [viewMode, setViewMode] = useState<BppScheduleViewMode>('table');

  // Filter States
  const [selectedMonth, setSelectedMonth] = useState('กรกฎาคม 2569');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedResponsible, setSelectedResponsible] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedMission, setSelectedMission] = useState<BppMissionItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Filter Logic
  const filteredMissions = useMemo(() => {
    return missions.filter((item) => {
      // Month filter
      if (selectedMonth !== 'ทุกช่วงเวลา' && item.monthYear !== selectedMonth) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Responsible filter
      if (selectedResponsible !== 'all' && item.responsible !== selectedResponsible) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchLocation = item.location.toLowerCase().includes(q);
        const matchAttendees = item.attendees.toLowerCase().includes(q);
        const matchResponsible = item.responsible.toLowerCase().includes(q);
        const matchUniform = item.uniform.toLowerCase().includes(q);
        const matchDate = item.date.toLowerCase().includes(q);
        if (!matchTitle && !matchLocation && !matchAttendees && !matchResponsible && !matchUniform && !matchDate) {
          return false;
        }
      }

      return true;
    });
  }, [missions, selectedMonth, selectedStatus, selectedCategory, selectedResponsible, searchQuery]);

  // Dynamic KPI counts based on the current month's full mission set
  const monthBaseMissions = useMemo(() => {
    if (selectedMonth === 'ทุกช่วงเวลา') return missions;
    return missions.filter((m) => m.monthYear === selectedMonth);
  }, [missions, selectedMonth]);

  const totalCount = monthBaseMissions.length;
  const completedCount = monthBaseMissions.filter((m) => m.status === 'ดำเนินการแล้ว').length;
  const inProgressCount = monthBaseMissions.filter((m) => m.status === 'อยู่ระหว่างดำเนินการ').length;
  const pendingCount = monthBaseMissions.filter((m) => m.status === 'ยังไม่กำหนด' || m.status === 'รอดำเนินการ').length;

  // Handlers
  const handleSelectMission = (mission: BppMissionItem) => {
    setSelectedMission(mission);
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = (id: string, newStatus: BppMissionStatus) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
    );
    if (selectedMission && selectedMission.id === id) {
      setSelectedMission((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleDeleteMission = (id: string) => {
    setMissions((prev) => prev.filter((m) => m.id !== id));
    if (selectedMission?.id === id) {
      setIsDetailOpen(false);
    }
  };

  const handleAddMission = (newMission: BppMissionItem) => {
    setMissions((prev) => [newMission, ...prev]);
  };

  const handleExportCsv = () => {
    const headers = [
      'วันที่',
      'เวลา',
      'รายละเอียดภารกิจ',
      'สถานที่',
      'ผู้เข้าร่วมภารกิจ',
      'การแต่งกาย',
      'ผู้รับผิดชอบ',
      'สถานะ',
      'หมายเหตุ',
    ];
    const rows = filteredMissions.map((m) => [
      `"${m.date}"`,
      `"${m.time}"`,
      `"${m.title.replace(/"/g, '""')}"`,
      `"${m.location.replace(/"/g, '""')}"`,
      `"${m.attendees.replace(/"/g, '""')}"`,
      `"${m.uniform.replace(/"/g, '""')}"`,
      `"${m.responsible}"`,
      `"${m.status}"`,
      `"${m.remarks}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ตารางภารกิจ_ฝอ5_${selectedMonth.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen iridescent-ambient p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Studio Header Bar */}
      <div className="liquid-glass-card iridescent-edge rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-[#2D2A32] dark:text-white tracking-tight">
              {activeTab === 'duty' ? 'ตารางการปฏิบัติหน้าที่ (สิบเวร)' : 'ตารางภารกิจ ฝอ.5'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#EDE4F7] text-[#5B2A86] border border-[#5B2A86]/20">
              {activeTab === 'duty' ? 'ผนวก ข • สง.ฝอ.๕' : 'MISSION STUDIO'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#5A5764] dark:text-slate-300 mt-0.5 font-medium">
            {activeTab === 'duty'
              ? 'กำกับดูแลและติดตามการปฏิบัติหน้าที่สิบเวรประจำ สง.ฝอ.๕ บก.อก.บช.ตชด.'
              : 'ติดตามทุกภารกิจ ขับเคลื่อนงาน 4 สายงานหลักอย่างมีประสิทธิภาพ'}
          </p>
        </div>

        {/* Right Actions: Tab Switcher & User Greeting */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Main Top Navigation Segmented Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/80 dark:bg-white/10 border border-[rgba(40,35,50,0.08)] text-xs font-semibold select-none shadow-2xs">
            <button
              onClick={() => setActiveTab('missions')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'missions'
                  ? 'bg-gradient-to-r from-[#5B2A86] to-[#7C3AED] text-white shadow-xs font-bold'
                  : 'text-[#4A4852] dark:text-slate-300 hover:text-[#2D2A32]'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>ตารางภารกิจ ฝอ.5</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                activeTab === 'missions' ? 'bg-white/20 text-white' : 'bg-white text-[#4A4852] border border-[rgba(40,35,50,0.08)]'
              }`}>
                {missions.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('duty')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'duty'
                  ? 'bg-gradient-to-r from-[#5B2A86] to-[#7C3AED] text-white shadow-xs font-bold'
                  : 'text-[#4A4852] dark:text-slate-300 hover:text-[#2D2A32]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ตารางเวร (สิบเวร)</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono flex items-center gap-1 ${
                activeTab === 'duty' ? 'bg-white/20 text-white' : 'bg-white text-[#4A4852] border border-[rgba(40,35,50,0.08)]'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                ผนวก ข
              </span>
            </button>
          </div>

          {/* User Badge */}
          <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-white/80 dark:bg-white/10 border border-[rgba(40,35,50,0.08)] shadow-2xs">
            <div className="w-6 h-6 rounded-lg bg-[#EDE4F7] text-[#5B2A86] flex items-center justify-center font-bold text-xs">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-[#2D2A32] dark:text-white leading-tight">
                {currentUser?.name || 'เจ้าหน้าที่ ฝอ.5'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render Active Tab Content */}
      {activeTab === 'duty' ? (
        <BppDutyRosterSection />
      ) : (
        <>
          {/* 1. Hero Card */}
          <BppMissionHero selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth} />

          {/* 2. 4 KPI Stat Cards */}
          <BppMissionKpiCards
            totalCount={totalCount}
            completedCount={completedCount}
            inProgressCount={inProgressCount}
            pendingCount={pendingCount}
            activeStatusFilter={selectedStatus}
            onSelectStatusFilter={setSelectedStatus}
          />

          {/* 3. Section 23: Data Visualization Analytics Section */}
          <BppMissionAnalyticsSection
            missions={filteredMissions}
            selectedMonth={selectedMonth}
          />

          {/* 4. Toolbar & Filters */}
          <BppMissionFilters
            selectedMonth={selectedMonth}
            onSelectMonth={setSelectedMonth}
            selectedStatus={selectedStatus}
            onSelectStatus={setSelectedStatus}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onExportCsv={handleExportCsv}
            onPrint={handlePrint}
            onOpenAddModal={() => setIsAddOpen(true)}
            selectedResponsible={selectedResponsible}
            onSelectResponsible={setSelectedResponsible}
          />

          {/* 5. Main Mission Schedule Container */}
          <div className="liquid-glass-card liquid-glass-sheen iridescent-edge rounded-2xl p-5 sm:p-6 space-y-4">
            {/* Section Header with View Switchers */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(40,35,50,0.06)]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EDE4F7] text-[#5B2A86] flex items-center justify-center border border-[#5B2A86]/20 shadow-2xs">
                  <Calendar className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-[#2D2A32] tracking-tight">
                      รายการภารกิจ
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#EDE4F7] text-[#5B2A86]">
                      {filteredMissions.length} ภารกิจ
                    </span>
                  </div>
                  <p className="text-xs text-[#5A5764]">
                    {selectedMonth !== 'ทุกช่วงเวลา' ? `ประจำเดือน${selectedMonth}` : 'ทุกช่วงเวลา'}
                  </p>
                </div>
              </div>

              {/* View Switcher Tabs: [รายการ] [ปฏิทิน] [ไทม์ไลน์] with sliding indicator */}
              <div className="flex items-center gap-1 bg-white/70 backdrop-blur-md p-1 rounded-xl self-start sm:self-auto select-none border border-[rgba(40,35,50,0.08)] shadow-2xs relative">
                {[
                  { mode: 'table' as const, label: 'รายการ', icon: ListFilter },
                  { mode: 'calendar' as const, label: 'ปฏิทิน', icon: CalendarDays },
                  { mode: 'timeline' as const, label: 'ไทม์ไลน์', icon: Layers },
                ].map(({ mode, label, icon: Icon }) => {
                  const isActive = viewMode === mode;
                  return (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors duration-180 cursor-pointer ${
                        isActive
                          ? 'text-[#5B2A86] font-bold'
                          : 'text-[#5A5764] hover:text-[#2D2A32]'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeScheduleViewMode"
                          className="absolute inset-0 bg-white rounded-lg shadow-xs border border-[rgba(40,35,50,0.06)]"
                          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{label}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* View Mode Component Rendering with Smooth Transition (Item 12 / 13) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {viewMode === 'table' && (
                  <BppMissionTableView
                    missions={filteredMissions}
                    onSelectMission={handleSelectMission}
                    onUpdateStatus={handleUpdateStatus}
                    onDeleteMission={handleDeleteMission}
                  />
                )}

                {viewMode === 'calendar' && (
                  <BppMissionCalendarView
                    missions={filteredMissions}
                    onSelectMission={handleSelectMission}
                  />
                )}

                {viewMode === 'timeline' && (
                  <BppMissionTimelineView
                    missions={filteredMissions}
                    onSelectMission={handleSelectMission}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Detail Modal */}
          <BppMissionDetailModal
            isOpen={isDetailOpen}
            mission={selectedMission}
            onClose={() => setIsDetailOpen(false)}
            onUpdateStatus={handleUpdateStatus}
          />

          {/* Add Mission Modal */}
          <BppAddMissionModal
            isOpen={isAddOpen}
            onClose={() => setIsAddOpen(false)}
            onAddMission={handleAddMission}
          />
        </>
      )}
    </div>
  );
};
export default BppMissionSchedulePage;
