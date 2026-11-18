import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { BppMissionItem, BppMissionStatus } from '../types';

interface BppMissionCalendarViewProps {
  missions: BppMissionItem[];
  onSelectMission: (mission: BppMissionItem) => void;
}

export const BppMissionCalendarView: React.FC<BppMissionCalendarViewProps> = ({
  missions,
  onSelectMission,
}) => {
  // Calendar month state: default to July 2026 (กรกฎาคม 2569)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // 0-indexed: 6 = July

  const monthNamesThai = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม',
  ];

  const daysOfWeek = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Days calculations
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const getStatusColor = (status: BppMissionStatus) => {
    switch (status) {
      case 'ดำเนินการแล้ว':
        return 'bg-emerald-50 text-[#059669] border-emerald-200/80 hover:bg-emerald-100/60';
      case 'อยู่ระหว่างดำเนินการ':
        return 'bg-amber-50 text-[#D97706] border-amber-200/80 hover:bg-amber-100/60';
      case 'รอดำเนินการ':
        return 'bg-[#EDE4F7] text-[#5B2A86] border-[#5B2A86]/20 hover:bg-[#E5D7F5]';
      case 'ยังไม่กำหนด':
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200/80 hover:bg-rose-100/60';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[rgba(40,35,50,0.07)] shadow-xs overflow-hidden">
      {/* Calendar Header Navigation */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[rgba(40,35,50,0.07)] bg-[#F7F7F9]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#EDE4F7] text-[#5B2A86] border border-[#5B2A86]/20 flex items-center justify-center">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#2D2A32] tracking-tight">
              ปฏิทินภารกิจประจำเดือน {monthNamesThai[currentMonth]} {currentYear + 543}
            </h3>
            <p className="text-[11px] text-[#5A5764]">
              ฝ่ายอำนวยการ 5 กองบังคับการอำนวยการ กองบัญชาการตำรวจตระเวนชายแดน
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg border border-[rgba(40,35,50,0.1)] bg-white hover:bg-[#F7F7F9] text-[#4A4852] transition cursor-pointer shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setCurrentYear(2026);
              setCurrentMonth(6);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[rgba(40,35,50,0.1)] text-[#2D2A32] hover:bg-[#F7F7F9] transition cursor-pointer shadow-2xs"
          >
            เดือนปัจจุบัน (ก.ค. 69)
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg border border-[rgba(40,35,50,0.1)] bg-white hover:bg-[#F7F7F9] text-[#4A4852] transition cursor-pointer shadow-2xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekdays Header */}
      <div className="grid grid-cols-7 border-b border-[rgba(40,35,50,0.07)] bg-[#F7F7F9] text-center text-xs font-bold text-[#4A4852] py-2">
        {daysOfWeek.map((day, idx) => (
          <div
            key={day}
            className={idx === 0 ? 'text-rose-700' : idx === 6 ? 'text-[#5B2A86]' : ''}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid Cells */}
      <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[rgba(40,35,50,0.05)] min-h-[480px]">
        {/* Previous Month Padding */}
        {Array.from({ length: firstDayIndex }).map((_, i) => {
          const prevDate = daysInPrevMonth - firstDayIndex + i + 1;
          return (
            <div
              key={`prev-${i}`}
              className="p-2 bg-[#F7F7F9]/50 text-[#8A8792]/40 min-h-[95px]"
            >
              <span className="text-xs font-medium pl-1">{prevDate}</span>
            </div>
          );
        })}

        {/* Current Month Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dayMissions = missions.filter((m) => {
            if (m.dayNumber === dayNum) return true;
            if (m.rawEndDate) {
              const startDay = parseInt(m.rawDate.split('-')[2], 10);
              const endDay = parseInt(m.rawEndDate.split('-')[2], 10);
              return dayNum >= startDay && dayNum <= endDay;
            }
            return false;
          });

          const isToday = currentYear === 2026 && currentMonth === 6 && dayNum === 17;

          return (
            <div
              key={`day-${dayNum}`}
              className={`p-2 min-h-[105px] flex flex-col justify-between transition hover:bg-[#F7F7F9] group ${
                isToday ? 'bg-[#EDE4F7]/30 ring-1 ring-[#5B2A86] ring-inset' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-xs w-5.5 h-5.5 flex items-center justify-center rounded-full ${
                    isToday
                      ? 'bg-[#5B2A86] text-white font-extrabold'
                      : 'text-[#2D2A32] font-semibold'
                  }`}
                >
                  {dayNum}
                </span>
                {dayMissions.length > 0 && (
                  <span className="text-[10px] text-[#5B2A86] font-bold bg-[#EDE4F7] px-1.5 py-0.2 rounded-full">
                    {dayMissions.length}
                  </span>
                )}
              </div>

              {/* Day Mission Badges */}
              <div className="space-y-1 flex-1 overflow-hidden">
                {dayMissions.slice(0, 3).map((mission) => (
                  <button
                    key={mission.id}
                    onClick={() => onSelectMission(mission)}
                    className={`w-full text-left p-1 rounded-md border text-[10px] font-medium leading-tight truncate block transition cursor-pointer ${getStatusColor(
                      mission.status
                    )}`}
                    title={`${mission.time} - ${mission.title}`}
                  >
                    <span className="font-bold mr-1">{mission.time}</span>
                    {mission.title}
                  </button>
                ))}

                {dayMissions.length > 3 && (
                  <div className="text-[10px] text-[#8A8792] pl-1 font-medium">
                    +{dayMissions.length - 3} รายการเพิ่มเติม
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BppMissionCalendarView;
