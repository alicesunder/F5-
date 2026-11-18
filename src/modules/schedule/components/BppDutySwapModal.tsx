import React, { useState } from 'react';
import {
  X,
  ArrowLeftRight,
  Calendar,
  User,
  AlertCircle,
  Check,
} from 'lucide-react';
import { DutyRosterItem } from '../dutyTypes';
import { DUTY_OFFICERS_LIST } from '../data/bppDutyRosterData';

interface BppDutySwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  duties: DutyRosterItem[];
  preselectedDuty?: DutyRosterItem | null;
  onConfirmSwap: (dutyId: string, newActualOfficer: string, reason: string) => void;
}

export const BppDutySwapModal: React.FC<BppDutySwapModalProps> = ({
  isOpen,
  onClose,
  duties,
  preselectedDuty,
  onConfirmSwap,
}) => {
  const [selectedDutyId, setSelectedDutyId] = useState<string>(
    preselectedDuty?.id || (duties[0]?.id ?? '')
  );
  const currentSelectedDuty = duties.find((d) => d.id === selectedDutyId) || preselectedDuty || duties[0];

  const [newActualOfficer, setNewActualOfficer] = useState<string>(
    DUTY_OFFICERS_LIST[0]?.name ?? ''
  );
  const [reason, setReason] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDutyId || !newActualOfficer) return;
    onConfirmSwap(selectedDutyId, newActualOfficer, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-[14px] animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg liquid-glass-modal iridescent-edge rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-white/40 border-b border-[rgba(40,35,50,0.07)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EDE4F7] text-[#5B2A86] border border-[#5B2A86]/20 flex items-center justify-center shadow-2xs">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#2D2A32] leading-tight">
                บันทึกการขอสับเปลี่ยนเวร / เข้าเวรแทน
              </h3>
              <p className="text-xs text-[#5A5764] mt-0.5">
                ตารางการปฏิบัติหน้าที่ (สิบเวร) สง.ฝอ.๕ บก.อก.บช.ตชด.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8A8792] hover:text-[#2D2A32] hover:bg-white/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {/* Shift Select */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#2D2A32] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#5B2A86]" />
              <span>เลือกวัน / ผลัดที่ต้องการสลับเวร</span>
            </label>
            <select
              value={selectedDutyId}
              onChange={(e) => setSelectedDutyId(e.target.value)}
              className="w-full h-9.5 px-3 rounded-xl border border-[rgba(40,35,50,0.08)] bg-white text-[#2D2A32] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#5B2A86]"
            >
              {duties.map((d) => (
                <option key={d.id} value={d.id}>
                  วันที่ {d.dayNumber} ก.ย. ({d.dateThai}) — เดิม: {d.signedOfficer}
                  {d.isSubstitute ? ' (มีการแทนอยู่แล้ว)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Current Signed Officer Display */}
          {currentSelectedDuty && (
            <div className="p-3 rounded-xl bg-[#F7F7F9] border border-[rgba(40,35,50,0.07)] text-xs flex items-center justify-between">
              <div>
                <span className="text-[#8A8792] block">เวรตามคำสั่งเดิม (เวรเซ็นต์ชื่อ):</span>
                <strong className="text-[#2D2A32] text-xs font-bold">
                  {currentSelectedDuty.signedOfficer}
                </strong>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-white border border-[rgba(40,35,50,0.07)] text-[#4A4852] text-[11px] font-mono">
                {currentSelectedDuty.timeRange}
              </span>
            </div>
          )}

          {/* New Actual Officer Select */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#2D2A32] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#059669]" />
              <span>ผู้ปฏิบัติหน้าที่จริงแทน (เวรปฏิบัติจริง)</span>
            </label>
            <select
              value={newActualOfficer}
              onChange={(e) => setNewActualOfficer(e.target.value)}
              className="w-full h-9.5 px-3 rounded-xl border border-[rgba(40,35,50,0.08)] bg-white text-[#2D2A32] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#059669]"
            >
              {DUTY_OFFICERS_LIST.map((officer) => (
                <option key={officer.name} value={officer.name}>
                  {officer.name} ({officer.shortRank})
                </option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#2D2A32] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-[#D97706]" />
              <span>เหตุผลความจำเป็นในการขอเข้าเวรแทน</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="ระบุเหตุผล เช่น ติดภารกิจราชการเร่งด่วน / ลากิจจำเป็น..."
              className="w-full p-2.5 rounded-xl border border-[rgba(40,35,50,0.08)] bg-[#F7F7F9] text-[#2D2A32] text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5B2A86]"
            />
          </div>

          {/* Notice info */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-[#D97706] flex-shrink-0 mt-0.5" />
            <span>
              การสับเปลี่ยนเวรจะแสดงสถานะในระบบและบันทึกลงในเอกสารสรุปผลัดเวรของ ฝอ.๕ บก.อก.บช.ตชด. โดยอัตโนมัติ
            </span>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-[rgba(40,35,50,0.07)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#4A4852] hover:bg-[#F7F7F9] transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#5B2A86] hover:bg-[#4a226d] text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>บันทึกการสับเปลี่ยนเวร</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BppDutySwapModal;
