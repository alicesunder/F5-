import React from 'react';
import {
  UserCheck,
  RefreshCw,
  Phone,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { DutyRosterItem } from '../dutyTypes';

interface BppDutyTableViewProps {
  duties: DutyRosterItem[];
  onOpenLogModal: (duty: DutyRosterItem) => void;
  onOpenSwapForDuty: (duty: DutyRosterItem) => void;
  onOfficerClick: (officerName: string) => void;
}

export const BppDutyTableView: React.FC<BppDutyTableViewProps> = ({
  duties,
  onOpenLogModal,
  onOpenSwapForDuty,
  onOfficerClick,
}) => {
  if (duties.length === 0) {
    return (
      <div className="bg-white rounded-xl p-10 text-center border border-[rgba(40,35,50,0.07)] shadow-xs">
        <AlertCircle className="w-10 h-10 text-[#8A8792]/50 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-[#2D2A32]">ไม่พบผลัดเวรที่ตรงกับเงื่อนไข</h3>
        <p className="text-xs text-[#8A8792] mt-1">
          กรุณาลองปรับเปลี่ยนคำค้นหาหรือตัวกรองด้านบน
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[rgba(40,35,50,0.07)] shadow-2xs overflow-hidden">
      {/* Table Header Description Bar */}
      <div className="px-4 py-3 bg-[#F7F7F9] border-b border-[rgba(40,35,50,0.07)] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-[#2D2A32]">
          <span className="w-2 h-2 rounded-full bg-[#5B2A86]" />
          <span>ตารางการปฏิบัติหน้าที่ (สิบเวร) ประจำ สง.ฝอ.๕ บก.อก.บช.ตชด.</span>
        </div>
        <div className="flex items-center gap-4 text-[#5A5764]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#059669] inline-block" />
            ตรงคำสั่งปกติ
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D97706] inline-block" />
            มีการเข้าเวรแทน (สลับเวร)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
            วันหยุด เสาร์-อาทิตย์
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F7F7F9] border-b border-[rgba(40,35,50,0.08)] text-[11px] font-bold uppercase tracking-wider text-[#4A4852]">
              <th className="py-3 px-4 w-14 text-center">ลำดับ</th>
              <th className="py-3 px-4 min-w-[190px]">วัน เดือน ปี</th>
              <th className="py-3 px-4 min-w-[240px]">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#059669]" />
                  <span>เวรปฏิบัติจริง</span>
                </div>
              </th>
              <th className="py-3 px-4 min-w-[240px]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#5B2A86]" />
                  <span>เวรเซ็นต์ชื่อ (ตามคำสั่ง)</span>
                </div>
              </th>
              <th className="py-3 px-4 min-w-[160px]">เวลา / ผลัด</th>
              <th className="py-3 px-4 w-28 text-center">สถานะ</th>
              <th className="py-3 px-4 w-28 text-right">บันทึก / จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(40,35,50,0.05)] text-xs text-[#2D2A32]">
            {duties.map((item) => {
              const isToday = item.status === 'on-duty';

              return (
                <tr
                  key={item.id}
                  className={`transition-colors group bg-white ${
                    isToday
                      ? 'bg-[#EDE4F7]/40 hover:bg-[#EDE4F7]/60'
                      : item.isSubstitute
                      ? 'bg-amber-50/20 hover:bg-amber-50/40'
                      : 'hover:bg-[#F7F7F9]'
                  }`}
                >
                  {/* Day Number */}
                  <td className="py-3 px-4 text-center font-mono font-bold text-[#8A8792]">
                    {isToday ? (
                      <span className="w-6 h-6 mx-auto rounded-full bg-[#5B2A86] text-white flex items-center justify-center text-xs">
                        {item.dayNumber}
                      </span>
                    ) : (
                      <span className={item.isWeekend ? 'text-rose-600 font-bold' : ''}>
                        {item.dayNumber}
                      </span>
                    )}
                  </td>

                  {/* Date Thai */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-semibold ${
                            isToday
                              ? 'text-[#5B2A86] font-bold'
                              : item.isWeekend
                              ? 'text-rose-700'
                              : 'text-[#2D2A32]'
                          }`}
                        >
                          {item.dateThai}
                        </span>
                        {item.isWeekend && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            วันหยุด
                          </span>
                        )}
                        {isToday && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#EDE4F7] text-[#5B2A86] border border-[#5B2A86]/20">
                            วันนี้
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#8A8792] font-mono mt-0.5">
                        {item.rawDate}
                      </span>
                    </div>
                  </td>

                  {/* Actual Officer */}
                  <td className="py-3 px-4">
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                          item.isSubstitute
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-[#059669]'
                        }`}
                      >
                        {item.isSubstitute ? 'แทน' : 'จริง'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => onOfficerClick(item.actualOfficer)}
                          className="font-bold text-[#2D2A32] hover:text-[#5B2A86] hover:underline text-left block truncate transition"
                        >
                          {item.actualOfficer}
                        </button>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#5A5764]">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#8A8792]" />
                            {item.phone}
                          </span>
                          {item.isSigned && (
                            <span className="text-[#059669] font-semibold flex items-center gap-0.5">
                              • ลงชื่อแล้ว
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Signed Officer */}
                  <td className="py-3 px-4">
                    {item.isSubstitute ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4A4852]">
                          <button
                            onClick={() => onOfficerClick(item.signedOfficer)}
                            className="hover:text-[#5B2A86] hover:underline text-left"
                          >
                            {item.signedOfficer}
                          </button>
                        </div>
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 text-[10px] font-bold border border-amber-200">
                          <RefreshCw className="w-3 h-3 text-[#D97706]" />
                          <span>ปฏิบัติหน้าที่แทน</span>
                          <ArrowRight className="w-2.5 h-2.5 text-[#D97706]" />
                          <span className="font-bold">{item.actualOfficer.split(' ')[0]}</span>
                        </div>
                        {item.substituteReason && (
                          <div className="text-[10px] text-[#8A8792] italic truncate max-w-xs">
                            {item.substituteReason}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#2D2A32]">
                          {item.signedOfficer}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#ECFDF5] text-[#059669] border border-emerald-200">
                          ตรงคำสั่ง
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Shift Time & Station */}
                  <td className="py-3 px-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 font-mono text-[#4A4852] font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#8A8792]" />
                        <span>{item.timeRange}</span>
                      </div>
                      <div className="text-[11px] text-[#8A8792]">{item.location}</div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4 text-center">
                    {item.status === 'on-duty' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-[#059669] border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-ping" />
                        กำลังปฏิบัติหน้าที่
                      </span>
                    ) : item.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F7F7F9] text-[#5A5764] border border-[rgba(40,35,50,0.08)]">
                        เรียบร้อยแล้ว
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#EDE4F7] text-[#5B2A86] border border-[#5B2A86]/20">
                        รอเข้าเวร
                      </span>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenLogModal(item)}
                        className="p-1.5 rounded-lg bg-white border border-[rgba(40,35,50,0.08)] hover:bg-[#EDE4F7] hover:text-[#5B2A86] text-[#5A5764] transition cursor-pointer shadow-2xs"
                        title="ดู/บันทึกเหตุการณ์สิบเวร"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onOpenSwapForDuty(item)}
                        className="p-1.5 rounded-lg bg-white border border-[rgba(40,35,50,0.08)] hover:bg-amber-50 hover:text-[#D97706] text-[#5A5764] transition cursor-pointer shadow-2xs"
                        title="ขอสับเปลี่ยนเวร / แทนเวร"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BppDutyTableView;
