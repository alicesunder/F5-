import React from 'react';
import {
  Search,
  Filter,
  Users,
  Calendar,
  Table as TableIcon,
  Printer,
  Download,
  ArrowLeftRight,
  Sparkles,
  X,
} from 'lucide-react';
import { DutyViewMode } from '../dutyTypes';
import { DUTY_OFFICERS_LIST } from '../data/bppDutyRosterData';

interface BppDutyFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedOfficer: string;
  onOfficerChange: (officer: string) => void;
  dayTypeFilter: 'all' | 'weekday' | 'weekend';
  onDayTypeFilterChange: (filter: 'all' | 'weekday' | 'weekend') => void;
  viewMode: DutyViewMode;
  onViewModeChange: (mode: DutyViewMode) => void;
  onOpenSwapModal: () => void;
  onExportCsv: () => void;
  onPrintOfficial: () => void;
  totalFiltered: number;
}

export const BppDutyFilters: React.FC<BppDutyFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedOfficer,
  onOfficerChange,
  dayTypeFilter,
  onDayTypeFilterChange,
  viewMode,
  onViewModeChange,
  onOpenSwapModal,
  onExportCsv,
  onPrintOfficial,
  totalFiltered,
}) => {
  return (
    <div className="liquid-glass-card iridescent-edge rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
      {/* Top Row: Search & Dropdowns & Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search & Selects */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8792]" />
            <input
              type="text"
              placeholder="ค้นหาชื่อเจ้าหน้าที่ / ยศ / บันทึก..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 h-9.5 rounded-xl text-xs border border-[rgba(40,35,50,0.07)] bg-white/90 text-[#2D2A32] placeholder:text-[#8A8792] shadow-[inset_1px_1px_2px_rgba(40,35,50,0.03)] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5B2A86] transition"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A8792] hover:text-[#2D2A32] p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Select Officer */}
          <div className="relative">
            <select
              value={selectedOfficer}
              onChange={(e) => onOfficerChange(e.target.value)}
              aria-label="เลือกนายตำรวจสิบเวร"
              className="pl-3 pr-8 h-9.5 rounded-xl text-xs border border-[rgba(40,35,50,0.08)] bg-white/90 text-[#2D2A32] shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#5B2A86] cursor-pointer font-semibold appearance-none"
            >
              <option value="all">กำลังพลทั้งหมด (9 นาย)</option>
              {DUTY_OFFICERS_LIST.map((officer) => (
                <option key={officer.name} value={officer.name}>
                  {officer.name} ({officer.totalActualDuties} ผลัด)
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-[#8A8792] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Day Type Filter */}
          <div className="flex items-center rounded-xl bg-white/80 p-0.5 border border-[rgba(40,35,50,0.07)] text-xs font-medium">
            <button
              onClick={() => onDayTypeFilterChange('all')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                dayTypeFilter === 'all'
                  ? 'bg-white text-[#2D2A32] shadow-2xs font-bold'
                  : 'text-[#5A5764] hover:text-[#2D2A32]'
              }`}
            >
              ทุกวัน
            </button>
            <button
              onClick={() => onDayTypeFilterChange('weekday')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                dayTypeFilter === 'weekday'
                  ? 'bg-white text-[#2D2A32] shadow-2xs font-bold'
                  : 'text-[#5A5764] hover:text-[#2D2A32]'
              }`}
            >
              จ.-ศ. (วันทำการ)
            </button>
            <button
              onClick={() => onDayTypeFilterChange('weekend')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                dayTypeFilter === 'weekend'
                  ? 'bg-white text-rose-700 shadow-2xs font-bold'
                  : 'text-[#5A5764] hover:text-[#2D2A32]'
              }`}
            >
              ส.-อา. (วันหยุด)
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Shift Swap Button */}
          <button
            onClick={onOpenSwapModal}
            className="h-9.5 px-3 rounded-xl bg-[#EDE4F7] text-[#5B2A86] hover:bg-[#e4d8f2] border border-[#5B2A86]/20 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>ขอสับเปลี่ยนเวร</span>
          </button>

          {/* Official Document Print */}
          <button
            onClick={onPrintOfficial}
            className="h-9.5 px-3 rounded-xl bg-white text-[#4A4852] hover:bg-[#F7F7F9] border border-[rgba(40,35,50,0.08)] text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#8A8792]" />
            <span>พิมพ์ ผนวก ข</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={onExportCsv}
            className="h-9.5 px-3 rounded-xl bg-white text-[#4A4852] hover:bg-[#F7F7F9] border border-[rgba(40,35,50,0.08)] text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="ดาวน์โหลดข้อมูล CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#8A8792]" />
            <span className="hidden sm:inline">Excel/CSV</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: View Mode Tabs & Filter summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[rgba(40,35,50,0.06)]">
        <div className="flex items-center gap-1 rounded-xl bg-[#F7F7F9] p-1 border border-[rgba(40,35,50,0.07)] text-xs font-semibold w-fit">
          <button
            onClick={() => onViewModeChange('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-[#5B2A86] shadow-2xs font-bold'
                : 'text-[#5A5764] hover:text-[#2D2A32]'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>ตารางคำสั่งปฏิบัติหน้าที่</span>
          </button>

          <button
            onClick={() => onViewModeChange('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              viewMode === 'calendar'
                ? 'bg-white text-[#5B2A86] shadow-2xs font-bold'
                : 'text-[#5A5764] hover:text-[#2D2A32]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>ปฏิทินเวรรายเดือน</span>
          </button>

          <button
            onClick={() => onViewModeChange('officers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              viewMode === 'officers'
                ? 'bg-white text-[#5B2A86] shadow-2xs font-bold'
                : 'text-[#5A5764] hover:text-[#2D2A32]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>สรุปตามรายบุคคล (9 นาย)</span>
          </button>

          <button
            onClick={() => onViewModeChange('official-print')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              viewMode === 'official-print'
                ? 'bg-[#5B2A86] text-white shadow-2xs font-bold'
                : 'text-[#5A5764] hover:text-[#2D2A32]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>แบบฟอร์มทางการ (ผนวก ข)</span>
          </button>
        </div>

        <div className="text-xs text-[#8A8792] font-medium">
          แสดง <strong className="text-[#2D2A32]">{totalFiltered}</strong> จาก 30 ผลัด
          {selectedOfficer !== 'all' && (
            <span className="ml-1 text-[#5B2A86] font-semibold">
              (กรอง: {selectedOfficer})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BppDutyFilters;
