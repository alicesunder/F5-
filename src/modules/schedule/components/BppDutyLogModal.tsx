import React, { useState } from 'react';
import {
  X,
  FileText,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  Save,
  Radio,
  UserCheck,
  AlertTriangle,
} from 'lucide-react';
import { DutyRosterItem } from '../dutyTypes';
import { BPP_DUTY_HEADER_INFO } from '../data/bppDutyRosterData';

interface BppDutyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  duty: DutyRosterItem | null;
  onSaveLog: (dutyId: string, logText: string, isSigned: boolean) => void;
}

export const BppDutyLogModal: React.FC<BppDutyLogModalProps> = ({
  isOpen,
  onClose,
  duty,
  onSaveLog,
}) => {
  if (!isOpen || !duty) return null;

  const [logText, setLogText] = useState(
    duty.logReport ||
      'รับมอบหน้าที่สิบเวร ตรวจสอบความเรียบร้อยของห้อง สง.ฝอ.๕ เอกสารราชการ วิทยุสื่อสาร และอุปกรณ์ดับเพลิงเรียบร้อย เหตุการณ์ทั่วไปปกติ ไม่มีเหตุร้าย'
  );
  const [isSigned, setIsSigned] = useState(duty.isSigned);

  const handleSave = () => {
    onSaveLog(duty.id, logText, isSigned);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-[rgba(40,35,50,0.1)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-[rgba(40,35,50,0.07)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EDE4F7] text-[#5B2A86] border border-[#5B2A86]/20 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#2D2A32] leading-tight">
                สมุดรายงานเหตุการณ์สิบเวรประจำผลัด
              </h3>
              <p className="text-xs text-[#5A5764] mt-0.5">
                {duty.dateThai} ({duty.rawDate})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8A8792] hover:text-[#2D2A32] hover:bg-[#F7F7F9] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3.5 overflow-y-auto">
          {/* Officer Details Card */}
          <div className="p-4 rounded-xl bg-[#F7F7F9] border border-[rgba(40,35,50,0.07)] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8A8792] uppercase tracking-wider">
                ข้อมูลผลัดเวรปฏิบัติหน้าที่
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  duty.status === 'on-duty'
                    ? 'bg-emerald-50 text-[#059669] border border-emerald-200'
                    : 'bg-white text-[#4A4852] border border-[rgba(40,35,50,0.08)]'
                }`}
              >
                {duty.status === 'on-duty' ? 'กำลังปฏิบัติหน้าที่' : 'ผลัดเวร 24 ชม.'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#8A8792]">เวรปฏิบัติจริง:</span>
                <div className="font-bold text-[#2D2A32] text-sm mt-0.5 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#059669]" />
                  <span>{duty.actualOfficer}</span>
                </div>
              </div>

              <div>
                <span className="text-[#8A8792]">เวรเซ็นต์ชื่อตามคำสั่ง:</span>
                <div className="font-semibold text-[#4A4852] text-sm mt-0.5">
                  {duty.signedOfficer}
                </div>
              </div>
            </div>

            {duty.isSubstitute && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
                <div>
                  <strong>บันทึกการเข้าเวรแทน: </strong>
                  <span>{duty.substituteReason || 'สับเปลี่ยนผลัดเวรตามข้อตกลง'}</span>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#5A5764] pt-0.5">
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-[#8A8792]" />
                {duty.timeRange}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#8A8792]" />
                {duty.location}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3.5 h-3.5 text-[#8A8792]" />
                {duty.phone}
              </span>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2D2A32] block">
              การตรวจตราจุดสำคัญประจำผลัด (สง.ฝอ.๕ บช.ตชด.)
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-[rgba(40,35,50,0.07)] flex items-center gap-2 text-[#2D2A32]">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span>ห้องสำนักงาน & ประตูล็อค</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-[rgba(40,35,50,0.07)] flex items-center gap-2 text-[#2D2A32]">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span>ตู้เอกสารลับ & แฟ้มคำสั่ง</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-[rgba(40,35,50,0.07)] flex items-center gap-2 text-[#2D2A32]">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span>วิทยุสื่อสาร ว. ประจำจุด</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-[rgba(40,35,50,0.07)] flex items-center gap-2 text-[#2D2A32]">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span>ระบบดับเพลิง & ไฟส่องสว่าง</span>
              </div>
            </div>
          </div>

          {/* Duty Log Entry */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#2D2A32] flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[#5B2A86]" />
              <span>บันทึกรายงานเหตุการณ์ประจำผลัด 24 ชม.</span>
            </label>
            <textarea
              rows={4}
              value={logText}
              onChange={(e) => setLogText(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[rgba(40,35,50,0.08)] bg-[#F7F7F9] text-[#2D2A32] text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5B2A86]"
              placeholder="กรอกบันทึกเหตุการณ์ เช่น การตรวจรับหนังสือ การส่งมอบเวร หรือเหตุการณ์ปกติ..."
            />
          </div>

          {/* Signature checkbox */}
          <label className="flex items-center gap-2.5 text-xs text-[#2D2A32] font-medium cursor-pointer select-none bg-[#F7F7F9] p-3 rounded-xl border border-[rgba(40,35,50,0.07)]">
            <input
              type="checkbox"
              checked={isSigned}
              onChange={(e) => setIsSigned(e.target.checked)}
              className="rounded accent-[#5B2A86] w-4 h-4"
            />
            <span>ลงลายมือชื่ออิเล็กทรอนิกส์ยืนยันการปฏิบัติหน้าที่ ({duty.actualOfficer})</span>
          </label>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#F7F7F9] border-t border-[rgba(40,35,50,0.07)] flex items-center justify-between">
          <div className="text-[11px] text-[#8A8792]">
            ตรวจรับรอง: {BPP_DUTY_HEADER_INFO.verifiedBy}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#4A4852] hover:bg-white transition cursor-pointer"
            >
              ปิด
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#5B2A86] hover:bg-[#4a226d] text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกรายงาน</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BppDutyLogModal;
