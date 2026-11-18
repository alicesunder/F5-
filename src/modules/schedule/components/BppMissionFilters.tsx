import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Download,
  Plus,
  Filter,
  Printer,
  FileSpreadsheet,
  X,
  RotateCcw,
  Building2,
  Users2,
  Megaphone,
  Flame,
  HeartHandshake,
} from 'lucide-react';

interface BppMissionFiltersProps {
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onExportCsv: () => void;
  onPrint: () => void;
  onOpenAddModal: () => void;
  selectedResponsible: string;
  onSelectResponsible: (resp: string) => void;
}

export const BppMissionFilters: React.FC<BppMissionFiltersProps> = ({
  selectedMonth,
  onSelectMonth,
  selectedStatus,
  onSelectStatus,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onExportCsv,
  onPrint,
  onOpenAddModal,
  selectedResponsible,
  onSelectResponsible,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const months = [
    'กรกฎาคม 2569',
    'สิงหาคม 2569',
    'กันยายน 2569',
    'ทุกช่วงเวลา',
  ];

  const statuses: { label: string; value: string }[] = [
    { label: 'ทุกสถานะ', value: 'all' },
    { label: 'ดำเนินการแล้ว', value: 'ดำเนินการแล้ว' },
    { label: 'อยู่ระหว่างดำเนินการ', value: 'อยู่ระหว่างดำเนินการ' },
    { label: 'รอดำเนินการ', value: 'รอดำเนินการ' },
    { label: 'ยังไม่กำหนด', value: 'ยังไม่กำหนด' },
  ];

  const responsibles = ['ทั้งหมด', 'จอส.', 'อก.', 'มชส.', 'สว.บอล', 'ผกก.'];

  // 4 Core Government Department Colors Priority
  const departmentFilters = [
    { id: 'all', label: 'ทุกสายงาน', icon: Building2, color: '#4A4852' },
    { id: 'อำนวยการ', label: 'งานอำนวยการ', icon: Users2, color: '#5B2A86' },
    { id: 'มวลชนสัมพันธ์', label: 'งานประชาสัมพันธ์', icon: Megaphone, color: '#2583D8' },
    { id: 'สาธารณภัย', label: 'งานสาธารณภัย', icon: Flame, color: '#E89B22' },
    { id: 'จิตอาสา', label: 'งานจิตอาสา', icon: HeartHandshake, color: '#42A77A' },
  ];

  const hasActiveFilters =
    selectedStatus !== 'all' ||
    selectedCategory !== 'all' ||
    selectedResponsible !== 'all' ||
    searchQuery.trim() !== '';

  const handleResetFilters = () => {
    onSelectStatus('all');
    onSelectCategory('all');
    onSelectResponsible('all');
    onSearchChange('');
  };

  return (
    <div className="space-y-3">
      {/* Quick Filter Chips with 4 Department Colors */}
      <div className="flex flex-wrap items-center gap-2 select-none">
        <span className="text-xs font-semibold text-[#8A8792] mr-1 hidden sm:inline-block">
          สายงาน:
        </span>
        {departmentFilters.map((dep) => {
          const isSelected = selectedCategory === dep.id;
          const Icon = dep.icon;
          return (
            <button
              key={dep.id}
              onClick={() => onSelectCategory(dep.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-[#2D2A32] text-white shadow-xs'
                  : 'bg-white text-[#4A4852] border border-[rgba(40,35,50,0.07)] hover:bg-[#F7F4FA] shadow-xs'
              }`}
            >
              {dep.id !== 'all' && (
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: dep.color }}
                />
              )}
              <Icon
                className="w-3.5 h-3.5"
                style={{ color: isSelected ? '#FFFFFF' : dep.color }}
              />
              <span>{dep.label}</span>
            </button>
          );
        })}
      </div>

      {/* Primary Clean Toolbar */}
      <div className="liquid-glass-card iridescent-edge rounded-2xl p-2.5 sm:p-3 shadow-xs flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* Month Selector */}
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={(e) => onSelectMonth(e.target.value)}
            className="h-9.5 pl-3 pr-8 rounded-xl bg-white/90 border border-[rgba(40,35,50,0.08)] text-xs font-semibold text-[#2D2A32] shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#5B2A86] cursor-pointer appearance-none"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A8792]">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => onSelectStatus(e.target.value)}
            className="h-9.5 pl-3 pr-8 rounded-xl bg-white/90 border border-[rgba(40,35,50,0.08)] text-xs font-semibold text-[#2D2A32] shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#5B2A86] cursor-pointer appearance-none"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A8792]">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>

        {/* Search Input: Clean Neutral Inset */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8792]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ค้นหาภารกิจ สถานที่ หรือผู้รับผิดชอบ..."
            className="w-full h-9.5 pl-9 pr-8 rounded-xl bg-white/90 border border-[rgba(40,35,50,0.07)] text-xs text-[#2D2A32] placeholder:text-[#8A8792] shadow-[inset_1px_1px_2px_rgba(40,35,50,0.04)] focus:outline-none focus:ring-1 focus:ring-[#5B2A86]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A8792] hover:text-[#2D2A32] p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Additional Filters Button */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`h-9.5 px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            showAdvanced || selectedResponsible !== 'all'
              ? 'bg-[#EDE4F7] text-[#5B2A86] border-[#5B2A86]/30'
              : 'bg-white/90 text-[#4A4852] border-[rgba(40,35,50,0.08)] hover:bg-white shadow-2xs'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>ตัวกรอง</span>
        </button>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="h-9.5 px-3 rounded-xl border border-rose-200 bg-rose-50/90 text-rose-700 hover:bg-rose-100 transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            title="ล้างตัวกรอง"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>รีเซ็ต</span>
          </button>
        )}

        {/* Download / Export Button */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="h-9.5 px-3.5 rounded-xl bg-white/90 border border-[rgba(40,35,50,0.08)] text-[#4A4852] hover:text-[#2D2A32] hover:bg-white transition text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#8A8792]" />
            <span>ส่งออก</span>
          </button>

          {showExportMenu && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowExportMenu(false)}
              />
              <div className="absolute right-0 top-11 z-30 w-52 liquid-glass-modal iridescent-edge rounded-xl shadow-lg py-1.5 overflow-hidden">
                <button
                  onClick={() => {
                    onExportCsv();
                    setShowExportMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium text-[#2D2A32] hover:bg-white/80 flex items-center gap-2.5 transition cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#059669]" />
                  <span>ส่งออก Excel / CSV</span>
                </button>
                <button
                  onClick={() => {
                    onPrint();
                    setShowExportMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium text-[#2D2A32] hover:bg-white/80 flex items-center gap-2.5 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#5B2A86]" />
                  <span>พิมพ์เอกสารภารกิจ</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Add New Mission Button (Brand Accent #5B2A86) */}
        <button
          onClick={onOpenAddModal}
          className="h-9.5 px-4 rounded-xl bg-[#5B2A86] hover:bg-[#471f69] text-white transition text-xs font-semibold flex items-center gap-1.5 shadow-[0_2px_6px_rgba(91,42,134,0.25)] cursor-pointer ml-auto sm:ml-0"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มภารกิจ</span>
        </button>
      </div>

      {/* Advanced Filter Collapsible Bar */}
      {showAdvanced && (
        <div className="p-3.5 bg-[#FBFAFD] rounded-xl border border-[rgba(40,35,50,0.07)] flex flex-wrap items-center gap-3 text-xs">
          <span className="text-[#2D2A32] font-bold flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#5B2A86]" />
            ฝ่ายผู้รับผิดชอบ:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {responsibles.map((resp) => {
              const value = resp === 'ทั้งหมด' ? 'all' : resp;
              const isSelected = selectedResponsible === value;
              return (
                <button
                  key={resp}
                  onClick={() => onSelectResponsible(value)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#5B2A86] text-white shadow-xs'
                      : 'bg-white text-[#4A4852] border border-[rgba(40,35,50,0.07)] hover:bg-[#EDE4F7]'
                  }`}
                >
                  {resp}
                </button>
              );
            })}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="ml-auto text-xs text-rose-600 hover:text-rose-700 font-semibold underline cursor-pointer"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BppMissionFilters;
