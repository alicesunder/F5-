import React, { useState } from 'react';
import {
  Printer,
  ArrowLeft,
} from 'lucide-react';
import { BPP_DUTY_HEADER_INFO } from '../data/bppDutyRosterData';
import { DutyRosterItem } from '../dutyTypes';

interface BppDutyPrintOfficialViewProps {
  duties: DutyRosterItem[];
  onBackToTable: () => void;
}

export const BppDutyPrintOfficialView: React.FC<BppDutyPrintOfficialViewProps> = ({
  duties,
  onBackToTable,
}) => {
  const [showSubstituteBadges, setShowSubstituteBadges] = useState(true);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Print Control Toolbar (hidden on print) */}
      <div className="print:hidden bg-white rounded-2xl p-4 sm:p-5 border border-[rgba(40,35,50,0.07)] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToTable}
            className="px-3.5 py-2 rounded-xl bg-[#F7F7F9] hover:bg-white text-[#2D2A32] border border-[rgba(40,35,50,0.08)] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>กลับหน้าหลักตารางเวร</span>
          </button>
          <div>
            <h3 className="text-sm font-extrabold text-[#2D2A32]">
              แบบพิมพ์เอกสารราชการ: ผนวก ข ตารางการปฏิบัติหน้าที่ (สิบเวร)
            </h3>
            <p className="text-xs text-[#5A5764]">
              จัดรูปแบบตามเอกสารทางราชการ บก.อก.บช.ตชด. พร้อมลายมือชื่อผู้ตรวจรับรอง
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <label className="flex items-center gap-2 text-xs font-semibold text-[#2D2A32] cursor-pointer select-none bg-[#F7F7F9] px-3 py-2 rounded-xl border border-[rgba(40,35,50,0.08)]">
            <input
              type="checkbox"
              checked={showSubstituteBadges}
              onChange={(e) => setShowSubstituteBadges(e.target.checked)}
              className="rounded accent-[#5B2A86]"
            />
            <span>แสดงไฮไลท์การเข้าเวรแทน</span>
          </label>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-[#5B2A86] hover:bg-[#4a226d] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์เอกสาร (Print / PDF)</span>
          </button>
        </div>
      </div>

      {/* Official Sheet Container (Styled like standard Thai Government A4 Document) */}
      <div className="bg-white rounded-2xl shadow-sm border border-[rgba(40,35,50,0.1)] p-8 sm:p-14 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0 text-[#2D2A32] font-serif">
        {/* Top Right: Annex Reference */}
        <div className="flex justify-end text-sm sm:text-base font-bold pb-2">
          <span>{BPP_DUTY_HEADER_INFO.documentRef}</span>
        </div>

        {/* Center Official Document Title */}
        <div className="text-center space-y-1 my-4">
          <h1 className="text-lg sm:text-xl font-bold tracking-tight">
            ตารางการปฏิบัติหน้าที่ (สิบเวร) ปฏิบัติหน้าที่ประจำ สง.ฝอ.๕ บก.อก.บช.ตชด.
          </h1>
          <div className="text-base font-semibold">
            {BPP_DUTY_HEADER_INFO.periodText}
          </div>
          <div className="text-sm">
            {BPP_DUTY_HEADER_INFO.shiftTime}
          </div>
        </div>

        {/* Official 3-Column Table matching the image exactly */}
        <div className="mt-6 overflow-hidden border border-black">
          <table className="w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-black text-center font-bold bg-[#F7F7F9] print:bg-transparent">
                <th className="border-r border-black py-2.5 px-3 w-1/3">วัน เดือน ปี</th>
                <th className="border-r border-black py-2.5 px-3 w-1/3">เวรปฏิบัติจริง</th>
                <th className="py-2.5 px-3 w-1/3">เวรเซ็นต์ชื่อ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {duties.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b border-black ${
                    showSubstituteBadges && item.isSubstitute
                      ? 'bg-amber-50/40 print:bg-transparent'
                      : ''
                  }`}
                >
                  {/* Date Column */}
                  <td className="border-r border-black py-2 px-3 align-middle">
                    <span className="font-semibold">{item.dateThai}</span>
                  </td>

                  {/* Actual Duty Officer */}
                  <td className="border-r border-black py-2 px-3 align-middle">
                    <div className="flex items-center justify-between">
                      <span>{item.actualOfficer}</span>
                      {showSubstituteBadges && item.isSubstitute && (
                        <span className="print:hidden text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                          แทน
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Signed Officer */}
                  <td className="py-2 px-3 align-middle">
                    <div className="flex items-center justify-between">
                      <span>{item.signedOfficer}</span>
                      {showSubstituteBadges && item.isSubstitute && (
                        <span className="print:hidden text-[10px] font-sans text-slate-500 italic">
                          (คำสั่ง)
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Official Approval Footer Signature Section */}
        <div className="mt-10 pt-4 flex justify-end">
          <div className="text-center space-y-4 min-w-[280px]">
            <div className="text-sm font-bold">ตรวจแล้วถูกต้อง</div>
            <div className="h-10 flex items-center justify-center">
              {/* Stylized official signature representation */}
              <span className="italic font-serif text-slate-400 select-none text-base border-b border-dotted border-slate-500 w-48 pb-1">
                ( ลายมือชื่อ )
              </span>
            </div>
            <div className="text-sm font-bold leading-snug">
              <div>{BPP_DUTY_HEADER_INFO.verifiedBy}</div>
              <div className="text-xs font-normal text-slate-700">
                {BPP_DUTY_HEADER_INFO.verifierPosition}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BppDutyPrintOfficialView;
