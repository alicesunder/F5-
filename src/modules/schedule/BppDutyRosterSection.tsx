import React, { useState, useMemo } from 'react';
import {
  DutyRosterItem,
  DutyViewMode,
} from './dutyTypes';
import {
  INITIAL_DUTY_ROSTER,
  DUTY_OFFICERS_LIST,
  BPP_DUTY_HEADER_INFO,
} from './data/bppDutyRosterData';
import { BppDutyHero } from './components/BppDutyHero';
import { BppDutyStatsCards } from './components/BppDutyStatsCards';
import { BppDutyFilters } from './components/BppDutyFilters';
import { BppDutyTableView } from './components/BppDutyTableView';
import { BppDutyCalendarView } from './components/BppDutyCalendarView';
import { BppDutyPersonnelSummaryView } from './components/BppDutyPersonnelSummaryView';
import { BppDutyPrintOfficialView } from './components/BppDutyPrintOfficialView';
import { BppDutySwapModal } from './components/BppDutySwapModal';
import { BppDutyLogModal } from './components/BppDutyLogModal';

export const BppDutyRosterSection: React.FC = () => {
  // State
  const [duties, setDuties] = useState<DutyRosterItem[]>(INITIAL_DUTY_ROSTER);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState('all');
  const [dayTypeFilter, setDayTypeFilter] = useState<'all' | 'weekday' | 'weekend'>('all');
  const [substituteFilter, setSubstituteFilter] = useState<'all' | 'substitute_only' | 'normal_only'>('all');
  const [viewMode, setViewMode] = useState<DutyViewMode>('table');

  // Modals
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [selectedDutyForSwap, setSelectedDutyForSwap] = useState<DutyRosterItem | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedDutyForLog, setSelectedDutyForLog] = useState<DutyRosterItem | null>(null);

  // Active duty officer right now (12 Sep 2026 is on-duty)
  const currentDuty = useMemo(() => {
    return duties.find((d) => d.status === 'on-duty') || duties[11];
  }, [duties]);

  // Filtered Duties
  const filteredDuties = useMemo(() => {
    return duties.filter((d) => {
      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName =
          d.actualOfficer.toLowerCase().includes(term) ||
          d.signedOfficer.toLowerCase().includes(term) ||
          d.dateThai.toLowerCase().includes(term) ||
          d.timeRange.toLowerCase().includes(term) ||
          (d.substituteReason && d.substituteReason.toLowerCase().includes(term)) ||
          (d.logReport && d.logReport.toLowerCase().includes(term));
        if (!matchesName) return false;
      }

      // Selected Officer
      if (selectedOfficer !== 'all') {
        if (d.actualOfficer !== selectedOfficer && d.signedOfficer !== selectedOfficer) {
          return false;
        }
      }

      // Day Type
      if (dayTypeFilter === 'weekday' && d.isWeekend) return false;
      if (dayTypeFilter === 'weekend' && !d.isWeekend) return false;

      // Substitute Filter
      if (substituteFilter === 'substitute_only' && !d.isSubstitute) return false;
      if (substituteFilter === 'normal_only' && d.isSubstitute) return false;

      return true;
    });
  }, [duties, searchTerm, selectedOfficer, dayTypeFilter, substituteFilter]);

  // Handlers
  const handleOpenSwapForDuty = (duty: DutyRosterItem) => {
    setSelectedDutyForSwap(duty);
    setIsSwapModalOpen(true);
  };

  const handleOpenLogModal = (duty: DutyRosterItem) => {
    setSelectedDutyForLog(duty);
    setIsLogModalOpen(true);
  };

  const handleConfirmSwap = (
    dutyId: string,
    newActualOfficer: string,
    reason: string
  ) => {
    setDuties((prev) =>
      prev.map((d) => {
        if (d.id === dutyId) {
          return {
            ...d,
            actualOfficer: newActualOfficer,
            isSubstitute: newActualOfficer !== d.signedOfficer,
            substituteReason: reason,
          };
        }
        return d;
      })
    );
  };

  const handleSaveLog = (dutyId: string, logText: string, isSigned: boolean) => {
    setDuties((prev) =>
      prev.map((d) => {
        if (d.id === dutyId) {
          return {
            ...d,
            logReport: logText,
            isSigned,
            signedAt: isSigned ? '08.30 น.' : undefined,
          };
        }
        return d;
      })
    );
  };

  const handleOfficerClick = (officerName: string) => {
    setSelectedOfficer(officerName);
    setSearchTerm('');
  };

  const handleExportCsv = () => {
    const headers = [
      'ลำดับ',
      'วัน เดือน ปี',
      'วันที่',
      'เวรปฏิบัติจริง',
      'เวรเซ็นต์ชื่อ',
      'การสลับเวร',
      'เหตุผลการแทนเวร',
      'เวลาปฏิบัติหน้าที่',
      'สถานะ',
      'โทรศัพท์',
    ];

    const rows = duties.map((d) => [
      d.dayNumber,
      `"${d.dateThai}"`,
      d.rawDate,
      `"${d.actualOfficer}"`,
      `"${d.signedOfficer}"`,
      d.isSubstitute ? 'มีการเข้าเวรแทน' : 'ตรงคำสั่ง',
      `"${d.substituteReason || '-'}"`,
      `"${d.timeRange}"`,
      d.status === 'on-duty' ? 'กำลังปฏิบัติหน้าที่' : d.status === 'completed' ? 'แล้วเสร็จ' : 'รอเข้าเวร',
      d.phone || '-',
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ตารางการปฏิบัติหน้าที่สิบเวร_ผนวก_ข_กย2569.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <BppDutyHero
        currentDuty={currentDuty}
        onViewOfficialDoc={() => setViewMode('official-print')}
        onOpenLogModal={handleOpenLogModal}
      />

      {/* KPI Stats Cards */}
      <BppDutyStatsCards
        duties={duties}
        substituteFilter={substituteFilter}
        onSelectSubstituteFilter={setSubstituteFilter}
        onSelectOfficer={handleOfficerClick}
      />

      {/* Filter Toolbar (shown unless in official-print view) */}
      {viewMode !== 'official-print' && (
        <BppDutyFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedOfficer={selectedOfficer}
          onOfficerChange={setSelectedOfficer}
          dayTypeFilter={dayTypeFilter}
          onDayTypeFilterChange={setDayTypeFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenSwapModal={() => {
            setSelectedDutyForSwap(null);
            setIsSwapModalOpen(true);
          }}
          onExportCsv={handleExportCsv}
          onPrintOfficial={() => setViewMode('official-print')}
          totalFiltered={filteredDuties.length}
        />
      )}

      {/* View Content */}
      {viewMode === 'table' && (
        <BppDutyTableView
          duties={filteredDuties}
          onOpenLogModal={handleOpenLogModal}
          onOpenSwapForDuty={handleOpenSwapForDuty}
          onOfficerClick={handleOfficerClick}
        />
      )}

      {viewMode === 'calendar' && (
        <BppDutyCalendarView
          duties={duties}
          onOpenLogModal={handleOpenLogModal}
          onOfficerClick={handleOfficerClick}
        />
      )}

      {viewMode === 'officers' && (
        <BppDutyPersonnelSummaryView
          duties={duties}
          onSelectOfficerFilter={(officer) => {
            setSelectedOfficer(officer);
            setViewMode('table');
          }}
          onOpenLogModal={handleOpenLogModal}
        />
      )}

      {viewMode === 'official-print' && (
        <BppDutyPrintOfficialView
          duties={duties}
          onBackToTable={() => setViewMode('table')}
        />
      )}

      {/* Swap Modal */}
      <BppDutySwapModal
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
        duties={duties}
        preselectedDuty={selectedDutyForSwap}
        onConfirmSwap={handleConfirmSwap}
      />

      {/* Log Modal */}
      <BppDutyLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        duty={selectedDutyForLog}
        onSaveLog={handleSaveLog}
      />
    </div>
  );
};
