import React from 'react';
import { motion } from 'motion/react';
import {
  ListFilter,
  Calendar,
  Clock,
  Plus,
  RotateCcw,
  Search,
  Filter,
  Layers,
} from 'lucide-react';
import { useVolunteer } from '../../context/VolunteerContext';
import { VolunteerMissionListView } from './VolunteerMissionListView';
import { VolunteerMissionCalendarView } from './VolunteerMissionCalendarView';
import { VolunteerMissionTimelineView } from './VolunteerMissionTimelineView';

export const VolunteerMissionsSection: React.FC = () => {
  const {
    activeViewMode,
    setActiveViewMode,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    filterUnit,
    setFilterUnit,
    clearFilters,
    categories,
    units,
    filteredMissions,
    setIsAddMissionModalOpen,
  } = useVolunteer();

  return (
    <section className="space-y-4">
      {/* Section Header & View Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[rgba(66,167,122,0.25)] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#25202B]">
              ศูนย์บริหารและติดตามภารกิจ (Mission Operations Center)
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#EAF7F0] text-[#2F8A63] text-xs font-bold font-mono">
              {filteredMissions.length} ภารกิจ
            </span>
          </div>
          <p className="text-xs text-[#6B6973] mt-0.5">
            ติดตามสถานะ มอบหมายหน่วย กำกับเวลา และตรวจสอบการรายงานผล จอ.01
          </p>
        </div>

        {/* View Mode Switcher: List / Calendar / Timeline */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100/90 p-1 rounded-xl text-xs border border-gray-200">
            <button
              onClick={() => setActiveViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeViewMode === 'list'
                  ? 'bg-white text-[#2F8A63] shadow-xs'
                  : 'text-[#6B6973] hover:text-[#25202B]'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>ตาราง (List)</span>
            </button>

            <button
              onClick={() => setActiveViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeViewMode === 'calendar'
                  ? 'bg-white text-[#2F8A63] shadow-xs'
                  : 'text-[#6B6973] hover:text-[#25202B]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>ปฏิทิน (Calendar)</span>
            </button>

            <button
              onClick={() => setActiveViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeViewMode === 'timeline'
                  ? 'bg-white text-[#2F8A63] shadow-xs'
                  : 'text-[#6B6973] hover:text-[#25202B]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>ไทม์ไลน์ (Timeline)</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddMissionModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#42A77A] text-white text-xs font-semibold hover:bg-[#389169] transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">สร้างภารกิจ</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-3.5 rounded-2xl bg-white/75 backdrop-blur-md border border-[rgba(66,167,122,0.18)] shadow-xs flex flex-wrap items-center gap-2.5 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-[#6B6973] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="ค้นหาชื่อภารกิจ, รหัส, สถานที่, ผู้ประสาน..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[rgba(66,167,122,0.25)] bg-white focus:outline-none focus:ring-2 focus:ring-[#42A77A]/30 text-xs"
          />
        </div>

        {/* Category Filter */}
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-[rgba(66,167,122,0.25)] bg-white text-[#25202B] focus:outline-none focus:ring-2 focus:ring-[#42A77A]/30"
        >
          <option value="ALL">ทุกหมวดกิจกรรม</option>
          {categories.map(c => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-[rgba(66,167,122,0.25)] bg-white text-[#25202B] focus:outline-none focus:ring-2 focus:ring-[#42A77A]/30"
        >
          <option value="ALL">ทุกสถานะภารกิจ</option>
          <option value="PLANNING">วางแผน (Planning)</option>
          <option value="PENDING_ASSIGNMENT">รอดำเนินการ (Pending Assignment)</option>
          <option value="IN_PROGRESS">กำลังดำเนินการ (In Progress)</option>
          <option value="PENDING_REPORT">รอส่งรายงาน (Pending Report)</option>
          <option value="PENDING_REVIEW">รายงานรอตรวจ (Pending Review)</option>
          <option value="COMPLETED">เสร็จสิ้น (Completed)</option>
        </select>

        {/* Unit Filter */}
        <select
          value={filterUnit}
          onChange={e => setFilterUnit(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-[rgba(66,167,122,0.25)] bg-white text-[#25202B] focus:outline-none focus:ring-2 focus:ring-[#42A77A]/30"
        >
          <option value="ALL">ทุกหน่วย บช.ตชด.</option>
          <option value="unit-bok-ok">บก.อก.บช.ตชด.</option>
          <option value="unit-bok-1">บก.ตชด.ภาค 1</option>
          <option value="unit-kok-13">กก.ตชด.13 (กาญจนบุรี)</option>
          <option value="unit-bok-2">บก.ตชด.ภาค 2</option>
          <option value="unit-bok-3">บก.ตชด.ภาค 3</option>
          <option value="unit-bok-4">บก.ตชด.ภาค 4</option>
        </select>

        {/* Reset Filter Button */}
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-[#6B6973] hover:text-[#25202B] hover:bg-gray-100 transition-colors cursor-pointer"
          title="ล้างค่าตัวกรองทั้งหมด"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">รีเซ็ต</span>
        </button>
      </div>

      {/* Main View Render */}
      <div>
        {activeViewMode === 'list' && <VolunteerMissionListView />}
        {activeViewMode === 'calendar' && <VolunteerMissionCalendarView />}
        {activeViewMode === 'timeline' && <VolunteerMissionTimelineView />}
      </div>
    </section>
  );
};
