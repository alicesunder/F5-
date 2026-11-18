import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Shield } from 'lucide-react';
import { useVolunteer } from '../../context/VolunteerContext';
import { VolunteerMissionItem } from '../../types/volunteerTypes';

export const VolunteerMissionCalendarView: React.FC = () => {
  const { filteredMissions, setSelectedMission } = useVolunteer();
  const [calendarMode, setCalendarMode] = useState<'month' | 'week' | 'day'>('month');
  const [currentMonth, setCurrentMonth] = useState('กรกฎาคม ๒๕๖๙');

  // Days of July 2026 calendar (July 1, 2026 starts on Wednesday = day index 3)
  const daysInJuly = 31;
  const startDayOffset = 3; // Wednesday (0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed...)

  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const dayNumber = i - startDayOffset + 1;
    const isCurrentMonth = dayNumber >= 1 && dayNumber <= daysInJuly;
    const rawDateStr = isCurrentMonth
      ? `2026-07-${String(dayNumber).padStart(2, '0')}`
      : '';

    const dayMissions = isCurrentMonth
      ? filteredMissions.filter(m => m.rawDate === rawDateStr || (m.date && m.date.includes(`${dayNumber} ก.ค.`)))
      : [];

    return {
      dayNumber: isCurrentMonth ? dayNumber : (dayNumber < 1 ? 30 + dayNumber : dayNumber - daysInJuly),
      isCurrentMonth,
      rawDateStr,
      missions: dayMissions,
    };
  });

  const weekHeaders = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

  return (
    <div className="rounded-2xl border border-[rgba(66,167,122,0.2)] bg-white/95 shadow-sm p-4">
      {/* Calendar Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-[rgba(66,167,122,0.15)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-[#6B6973] hover:text-[#25202B]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-bold text-[#25202B] px-2 font-mono">
              {currentMonth}
            </h3>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-[#6B6973] hover:text-[#25202B]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs text-[#2F8A63] font-medium bg-[#EAF7F0] px-2.5 py-0.5 rounded-full">
            {filteredMissions.length} ภารกิจในตาราง
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => setCalendarMode('month')}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              calendarMode === 'month'
                ? 'bg-white text-[#2F8A63] font-bold shadow-xs'
                : 'text-[#6B6973] hover:text-[#25202B]'
            }`}
          >
            รายเดือน (Month)
          </button>
          <button
            onClick={() => setCalendarMode('week')}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              calendarMode === 'week'
                ? 'bg-white text-[#2F8A63] font-bold shadow-xs'
                : 'text-[#6B6973] hover:text-[#25202B]'
            }`}
          >
            รายสัปดาห์ (Week)
          </button>
          <button
            onClick={() => setCalendarMode('day')}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              calendarMode === 'day'
                ? 'bg-white text-[#2F8A63] font-bold shadow-xs'
                : 'text-[#6B6973] hover:text-[#25202B]'
            }`}
          >
            รายวัน (Day)
          </button>
        </div>
      </div>

      {/* Week Headers */}
      <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-[#6B6973] mb-1">
        {weekHeaders.map((w, idx) => (
          <div
            key={w}
            className={`py-1.5 rounded-lg ${
              idx === 0 ? 'text-red-500 bg-red-50/50' : idx === 6 ? 'text-blue-500 bg-blue-50/50' : 'bg-gray-50'
            }`}
          >
            {w}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((cell, idx) => {
          const isToday = cell.dayNumber === 17 && cell.isCurrentMonth;

          return (
            <div
              key={idx}
              className={`min-h-[105px] sm:min-h-[120px] p-1.5 rounded-xl border transition-all flex flex-col justify-between ${
                !cell.isCurrentMonth
                  ? 'bg-gray-50/40 border-gray-100 text-gray-300 opacity-60'
                  : isToday
                  ? 'bg-[#EAF7F0]/50 border-[#42A77A] shadow-xs'
                  : 'bg-white border-gray-100 hover:border-[#42A77A]/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-mono font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                    isToday
                      ? 'bg-[#42A77A] text-white'
                      : cell.isCurrentMonth
                      ? 'text-[#25202B]'
                      : 'text-gray-400'
                  }`}
                >
                  {cell.dayNumber}
                </span>

                {cell.missions.length > 0 && (
                  <span className="text-[10px] font-mono text-[#2F8A63] font-bold">
                    {cell.missions.length} งาน
                  </span>
                )}
              </div>

              {/* Mission Chips */}
              <div className="space-y-1 mt-1 flex-1 overflow-y-auto max-h-20 scrollbar-none">
                {cell.missions.map(m => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMission(m)}
                    className="p-1 rounded-md bg-[#EAF7F0] hover:bg-[#42A77A] text-[#2F8A63] hover:text-white text-[10px] font-medium leading-tight truncate cursor-pointer transition-colors border border-[rgba(66,167,122,0.3)] shadow-2xs"
                    title={`${m.code}: ${m.title} (${m.unitName})`}
                  >
                    <span className="font-mono font-bold mr-1">{m.code.split('-')[2]}</span>
                    <span>{m.title}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
