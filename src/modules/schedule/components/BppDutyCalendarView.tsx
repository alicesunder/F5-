import React from 'react';
import {
  RefreshCw,
  Calendar,
} from 'lucide-react';
import { DutyRosterItem } from '../dutyTypes';

interface BppDutyCalendarViewProps {
  duties: DutyRosterItem[];
  onOpenLogModal: (duty: DutyRosterItem) => void;
  onOfficerClick: (officerName: string) => void;
}

export const BppDutyCalendarView: React.FC<BppDutyCalendarViewProps> = ({
  duties,
  onOpenLogModal,
}) => {
  // Days of the week header: Sun to Sat
  const dayNames = [
    { label: 'อาทิตย์', isWeekend: true },
    { label: 'จันทร์', isWeekend: false },
    { label: 'อังคาร', isWeekend: false },
    { label: 'พุธ', isWeekend: false },
    { label: 'พฤหัสบดี', isWeekend: false },
    { label: 'ศุกร์', isWeekend: false },
    { label: 'เสาร์', isWeekend: true },
  ];

  // 1 Sep 2026 is Tuesday -> index 2 in Sun..Sat (Sun=0, Mon=1, Tue=2)
  const leadingBlanks = 2;
  const totalDays = 30;
  const trailingBlanks = (7 - ((leadingBlanks + totalDays) % 7)) % 7;

  return (
    <div className="bg-white rounded-2xl border border-[rgba(40,35,50,0.07)] shadow-xs overflow-hidden">
      {/* Calendar Header Title Bar */}
      <div className="px-5 py-3.5 bg-[#F7F7F9] border-b border-[rgba(40,35,50,0.07)] flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-extrabold text-[#2D2A32] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#5B2A86]" />
            <span>ปฏิทินผลัดเวรปฏิบัติหน้าที่ (สิบเวร) — กันยายน ๒๕๖๙</span>
          </div>
          <p className="text-xs text-[#5A5764] mt-0.5">
            เวลาผลัดเวร ๐๘.๓๐ - ๐๘.๓๐ น. ของวันถัดไป (ผลัด 24 ชม. ประจำ สง.ฝอ.๕ บก.อก.บช.ตชด.)
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-[#4A4852]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5B2A86] inline-block" />
            กำลังปฏิบัติหน้าที่
          </span>
          <span className="flex items-center gap-1.5 font-medium text-[#4A4852]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] inline-block" />
            มีการเข้าเวรแทน
          </span>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 border-b border-[rgba(40,35,50,0.07)] bg-[#F7F7F9] text-center text-xs font-bold py-2 text-[#4A4852]">
        {dayNames.map((d, i) => (
          <div
            key={i}
            className={d.isWeekend ? 'text-rose-700' : 'text-[#2D2A32]'}
          >
            {d.label}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-[rgba(40,35,50,0.05)] bg-[#F7F7F9]/30">
        {/* Leading blanks for Aug 30, 31 */}
        {Array.from({ length: leadingBlanks }).map((_, idx) => (
          <div
            key={`blank-${idx}`}
            className="min-h-[105px] p-2 bg-[#F7F7F9]/70 text-[#8A8792]/50 text-xs font-mono select-none"
          >
            {31 - leadingBlanks + 1 + idx} ส.ค.
          </div>
        ))}

        {/* Sep 1 to Sep 30 */}
        {duties.map((duty) => {
          const isToday = duty.status === 'on-duty';

          return (
            <div
              key={duty.id}
              onClick={() => onOpenLogModal(duty)}
              className={`min-h-[105px] sm:min-h-[120px] p-2 sm:p-2.5 flex flex-col justify-between transition-all cursor-pointer group hover:bg-[#F7F7F9] relative ${
                isToday
                  ? 'bg-[#EDE4F7]/40 ring-1.5 ring-[#5B2A86] ring-inset z-10'
                  : duty.isSubstitute
                  ? 'bg-amber-50/30'
                  : duty.isWeekend
                  ? 'bg-[#F7F7F9]/50'
                  : 'bg-white'
              }`}
            >
              {/* Day Number Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs sm:text-sm font-bold font-mono ${
                    isToday
                      ? 'w-5.5 h-5.5 rounded-full bg-[#5B2A86] text-white flex items-center justify-center text-xs'
                      : duty.isWeekend
                      ? 'text-rose-700'
                      : 'text-[#2D2A32]'
                  }`}
                >
                  {duty.dayNumber}
                </span>

                {isToday && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#5B2A86] text-white">
                    วันนี้
                  </span>
                )}

                {duty.isSubstitute && !isToday && (
                  <span
                    className="p-0.5 rounded text-[#D97706]"
                    title={`เข้าเวรแทน ${duty.signedOfficer}`}
                  >
                    <RefreshCw className="w-3 h-3" />
                  </span>
                )}
              </div>

              {/* Officer Card In Day */}
              <div className="my-1 space-y-0.5">
                <div className="text-[11px] font-bold text-[#2D2A32] group-hover:text-[#5B2A86] leading-tight line-clamp-2">
                  {duty.actualOfficer}
                </div>

                {duty.isSubstitute ? (
                  <div className="text-[10px] text-amber-900 font-medium bg-amber-50 border border-amber-200/60 rounded px-1 py-0.2 leading-tight flex items-center gap-1">
                    <span className="text-[9px] text-[#D97706] font-bold">แทน:</span>
                    <span className="truncate">{duty.signedOfficer.split(' ')[0]}</span>
                  </div>
                ) : (
                  <div className="text-[10px] text-[#8A8792] font-mono">
                    ตรงคำสั่ง
                  </div>
                )}
              </div>

              {/* Footer Shift Time / Phone */}
              <div className="flex items-center justify-between text-[10px] text-[#8A8792] font-mono pt-1 border-t border-[rgba(40,35,50,0.05)]">
                <span className="truncate">08.30 น.</span>
                {duty.isSigned ? (
                  <span className="text-[#059669] font-semibold">✓ เซ็นแล้ว</span>
                ) : (
                  <span className="text-[#8A8792]">รอผลัด</span>
                )}
              </div>
            </div>
          );
        })}

        {/* Trailing blanks to end of week */}
        {Array.from({ length: trailingBlanks }).map((_, idx) => (
          <div
            key={`trailing-${idx}`}
            className="min-h-[105px] p-2 bg-[#F7F7F9]/70 text-[#8A8792]/50 text-xs font-mono select-none"
          >
            {idx + 1} ต.ค.
          </div>
        ))}
      </div>
    </div>
  );
};

export default BppDutyCalendarView;
