import React from 'react';
import {
  Shield,
  Clock,
  MapPin,
  Radio,
  FileCheck2,
  Calendar,
  AlertCircle,
  PhoneCall,
  UserCheck,
} from 'lucide-react';
import { BPP_DUTY_HEADER_INFO } from '../data/bppDutyRosterData';
import { DutyRosterItem } from '../dutyTypes';

interface BppDutyHeroProps {
  currentDuty: DutyRosterItem | undefined;
  onViewOfficialDoc: () => void;
  onOpenLogModal: (duty: DutyRosterItem) => void;
}

export const BppDutyHero: React.FC<BppDutyHeroProps> = ({
  currentDuty,
  onViewOfficialDoc,
  onOpenLogModal,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-[rgba(40,35,50,0.07)] text-[#2D2A32] p-5 sm:p-6 shadow-xs">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side: Official Document Header & Details */}
        <div className="space-y-2.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#EDE4F7] text-[#5B2A86] border border-[#5B2A86]/20 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#5B2A86]" />
              {BPP_DUTY_HEADER_INFO.documentRef}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#F7F7F9] text-[#4A4852] border border-[rgba(40,35,50,0.07)]">
              คำสั่งเวรประจำเดือน {BPP_DUTY_HEADER_INFO.monthYear}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-[#F7F7F9] text-[#8A8792] border border-[rgba(40,35,50,0.07)]">
              ผลัด 24 ชม.
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#2D2A32] leading-tight">
            {BPP_DUTY_HEADER_INFO.title}
          </h2>

          <div className="text-sm font-semibold text-[#5A5764]">
            {BPP_DUTY_HEADER_INFO.station}
          </div>

          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-[#5A5764] pt-0.5">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#5B2A86]" />
              <span>{BPP_DUTY_HEADER_INFO.periodText}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#8A8792]" />
              <span>{BPP_DUTY_HEADER_INFO.shiftTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#8A8792]" />
              <span>ห้องสำนักงาน ฝอ.5 บช.ตชด.</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F7F7F9] border border-[rgba(40,35,50,0.06)] text-xs text-[#4A4852]">
              <FileCheck2 className="w-3.5 h-3.5 text-[#059669]" />
              <span>
                ตรวจแล้วถูกต้อง: <strong className="text-[#2D2A32]">{BPP_DUTY_HEADER_INFO.verifiedBy}</strong> ({BPP_DUTY_HEADER_INFO.verifierPosition})
              </span>
            </div>
            <button
              onClick={onViewOfficialDoc}
              className="px-3 py-1.5 rounded-xl bg-white border border-[rgba(40,35,50,0.12)] text-[#2D2A32] hover:bg-[#F7F7F9] font-semibold text-xs transition cursor-pointer shadow-2xs flex items-center gap-1"
            >
              <span>ดูเอกสารฉบับทางการ</span>
            </button>
          </div>
        </div>

        {/* Right Side: Active Duty Card (สิบเวรปฏิบัติหน้าที่ขณะนี้) */}
        {currentDuty && (
          <div className="w-full lg:w-80 rounded-xl bg-[#FBFAFD] p-4 border border-[rgba(40,35,50,0.08)] shadow-xs space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(40,35,50,0.06)]">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#059669]" />
                </span>
                <span className="text-xs font-bold text-[#059669]">
                  สิบเวรปฏิบัติหน้าที่ขณะนี้
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white border border-[rgba(40,35,50,0.07)] text-[#4A4852]">
                {currentDuty.dateDisplay}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-base font-extrabold text-[#2D2A32] leading-snug flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#5B2A86] flex-shrink-0" />
                <span>{currentDuty.actualOfficer}</span>
              </div>

              {currentDuty.isSubstitute && (
                <div className="px-2 py-1 rounded-lg bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-1.5 leading-tight">
                  <AlertCircle className="w-3.5 h-3.5 text-[#D97706] flex-shrink-0 mt-0.5" />
                  <div>
                    <span>ปฏิบัติหน้าที่แทน: </span>
                    <strong className="text-[#2D2A32]">{currentDuty.signedOfficer}</strong>
                    <div className="text-[10px] text-amber-700 mt-0.5">
                      ({currentDuty.substituteReason || 'ตามบันทึกสับเปลี่ยนเวร'})
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2 rounded-lg bg-white border border-[rgba(40,35,50,0.06)] flex flex-col">
                <span className="text-[10px] text-[#8A8792] font-medium">เวลาผลัดเวร</span>
                <span className="text-xs font-bold text-[#2D2A32] mt-0.5">{currentDuty.timeRange}</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[rgba(40,35,50,0.06)] flex flex-col">
                <span className="text-[10px] text-[#8A8792] font-medium">โทรศัพท์โต๊ะเวร</span>
                <span className="text-xs font-bold text-[#2D2A32] mt-0.5 flex items-center gap-1">
                  <PhoneCall className="w-3 h-3 text-[#059669]" />
                  {currentDuty.phone}
                </span>
              </div>
            </div>

            <button
              onClick={() => onOpenLogModal(currentDuty)}
              className="w-full py-2 rounded-xl bg-[#5B2A86] text-white hover:bg-[#471f69] transition font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>บันทึกสมุดรายงานสิบเวร</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BppDutyHero;
