import React from 'react';
import {
  Phone,
  Calendar,
  RefreshCw,
  UserCheck,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { DUTY_OFFICERS_LIST } from '../data/bppDutyRosterData';
import { DutyRosterItem } from '../dutyTypes';

interface BppDutyPersonnelSummaryViewProps {
  duties: DutyRosterItem[];
  onSelectOfficerFilter: (officerName: string) => void;
  onOpenLogModal: (duty: DutyRosterItem) => void;
}

export const BppDutyPersonnelSummaryView: React.FC<BppDutyPersonnelSummaryViewProps> = ({
  duties,
  onSelectOfficerFilter,
  onOpenLogModal,
}) => {
  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[rgba(40,35,50,0.07)] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm sm:text-base font-extrabold text-[#2D2A32] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#5B2A86]" />
            <span>สรุปภาระงานสิบเวรรายบุคคล — ประจำเดือนกันยายน ๒๕๖๙</span>
          </h3>
          <p className="text-xs text-[#5A5764] mt-0.5">
            กำลังพลข้าราชการตำรวจ สง.ฝอ.๕ บก.อก.บช.ตชด. รวมทั้งสิ้น ๙ นาย
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1 rounded-xl bg-[#EDE4F7] text-[#5B2A86] border border-[#5B2A86]/20">
          เกณฑ์เฉลี่ย ๓ - ๔ ผลัด / นาย
        </div>
      </div>

      {/* Grid of 9 Officers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {DUTY_OFFICERS_LIST.map((officer) => {
          // Find actual duty items for this officer
          const actualDutyItems = duties.filter(
            (d) => d.actualOfficer === officer.name
          );

          return (
            <div
              key={officer.name}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[rgba(40,35,50,0.07)] shadow-xs hover:border-[rgba(40,35,50,0.15)] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header: Rank + Name */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#EDE4F7] text-[#5B2A86] border border-[#5B2A86]/20 flex items-center justify-center font-bold text-xs">
                      {officer.shortRank}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#2D2A32] group-hover:text-[#5B2A86] transition leading-tight">
                        {officer.name}
                      </h4>
                      <div className="text-[11px] text-[#8A8792] flex items-center gap-1 mt-0.5 font-mono">
                        <Phone className="w-3 h-3 text-[#8A8792]" />
                        <span>{officer.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-2 gap-2 mt-3.5 text-center">
                  <div className="p-2.5 rounded-xl bg-[#EDE4F7]/40 border border-[#5B2A86]/10">
                    <div className="text-[11px] font-semibold text-[#5B2A86]">เข้าปฏิบัติจริง</div>
                    <div className="text-lg font-black text-[#2D2A32] mt-0.5 font-mono">
                      {officer.totalActualDuties}
                      <span className="text-xs font-normal text-[#5A5764] ml-1">ผลัด</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F7F7F9] border border-[rgba(40,35,50,0.06)]">
                    <div className="text-[11px] font-semibold text-[#5A5764]">คำสั่งเซ็นต์ชื่อ</div>
                    <div className="text-lg font-black text-[#2D2A32] mt-0.5 font-mono">
                      {officer.totalSignedDuties}
                      <span className="text-xs font-normal text-[#5A5764] ml-1">ผลัด</span>
                    </div>
                  </div>
                </div>

                {/* Substitution Details */}
                <div className="mt-2.5 space-y-1 text-xs">
                  {officer.substitutedForOthers > 0 && (
                    <div className="flex items-center justify-between text-amber-900 bg-amber-50/80 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-amber-200/60">
                      <span className="flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 text-[#D97706]" />
                        เข้าเวรแทนผู้อื่น
                      </span>
                      <strong className="font-mono">{officer.substitutedForOthers} ครั้ง</strong>
                    </div>
                  )}

                  {officer.replacedByOthers > 0 && (
                    <div className="flex items-center justify-between text-[#2D2A32] bg-[#F7F7F9] px-2.5 py-1 rounded-lg text-[11px] font-medium border border-[rgba(40,35,50,0.06)]">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-[#059669]" />
                        มีผู้อื่นเข้าเวรแทน
                      </span>
                      <strong className="font-mono">{officer.replacedByOthers} ครั้ง</strong>
                    </div>
                  )}
                </div>

                {/* Duty Days Pills */}
                <div className="mt-3.5 pt-2.5 border-t border-[rgba(40,35,50,0.06)]">
                  <div className="text-[11px] font-semibold text-[#5A5764] mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#8A8792]" />
                    <span>วันที่เข้าเวรจริง (ก.ย. 69):</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {actualDutyItems.map((duty) => (
                      <button
                        key={duty.id}
                        onClick={() => onOpenLogModal(duty)}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer ${
                          duty.status === 'on-duty'
                            ? 'bg-[#5B2A86] text-white shadow-2xs'
                            : duty.isSubstitute
                            ? 'bg-amber-50 text-amber-900 border border-amber-200'
                            : 'bg-[#F7F7F9] text-[#2D2A32] border border-[rgba(40,35,50,0.06)] hover:bg-[#EDE4F7]'
                        }`}
                        title={duty.dateThai}
                      >
                        <span>วันที่ {duty.dayNumber}</span>
                        {duty.isSubstitute && <span className="text-[9px] text-[#D97706]">(แทน)</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="mt-3.5 pt-2.5 border-t border-[rgba(40,35,50,0.06)]">
                <button
                  onClick={() => onSelectOfficerFilter(officer.name)}
                  className="w-full py-1.5 rounded-xl bg-[#F7F7F9] text-[#2D2A32] hover:bg-[#EDE4F7] hover:text-[#5B2A86] border border-[rgba(40,35,50,0.06)] transition font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer group/btn"
                >
                  <span>ดูกำหนดการเฉพาะนายนี้</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BppDutyPersonnelSummaryView;
