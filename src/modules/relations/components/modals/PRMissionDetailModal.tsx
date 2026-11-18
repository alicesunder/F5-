import React, { useState } from 'react';
import {
  X,
  Camera,
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Plus,
  Image as ImageIcon,
} from 'lucide-react';
import { usePRIntel } from '../../context/PRIntelContext';
import { MissionStatus } from '../../types/bppTypes';

export const PRMissionDetailModal: React.FC = () => {
  const {
    selectedMission,
    setSelectedMission,
    updateMissionStatus,
    updateMissionDeliverables,
  } = usePRIntel();

  const [currentStatus, setCurrentStatus] = useState<MissionStatus>(
    selectedMission?.status || 'pending'
  );
  const [deliveredCount, setDeliveredCount] = useState<number>(
    selectedMission?.deliverablesDelivered || 0
  );

  if (!selectedMission) return null;

  const progress =
    selectedMission.deliverablesRequired > 0
      ? Math.round((deliveredCount / selectedMission.deliverablesRequired) * 100)
      : 0;

  const handleSave = () => {
    updateMissionStatus(selectedMission.id, currentStatus);
    updateMissionDeliverables(selectedMission.id, deliveredCount);
    setSelectedMission(null);
  };

  const handleQuickAddDeliverables = (add: number) => {
    const updated = Math.min(
      selectedMission.deliverablesRequired,
      deliveredCount + add
    );
    setDeliveredCount(updated);
    if (updated >= selectedMission.deliverablesRequired) {
      setCurrentStatus('completed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#27265B] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {selectedMission.id}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-pink-50 text-pink-700 border border-pink-200">
              {selectedMission.category}
            </span>
          </div>

          <button
            onClick={() => setSelectedMission(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Title & Priority */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base sm:text-lg font-black text-[#1E1B4B]">
                {selectedMission.title}
              </h2>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold shrink-0 ${
                  selectedMission.priority === 'urgent'
                    ? 'bg-rose-100 text-rose-700'
                    : selectedMission.priority === 'high'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {selectedMission.priority === 'urgent'
                  ? 'ด่วนที่สุด'
                  : selectedMission.priority === 'high'
                  ? 'ด่วน'
                  : 'ปกติ'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {selectedMission.description}
            </p>
          </div>

          {/* Location, Date & Responsible Officer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4 text-pink-600 shrink-0" />
                <span>วันที่: {selectedMission.displayDate}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-pink-600 shrink-0" />
                <span>เวลา: {selectedMission.startTime} - {selectedMission.endTime} น.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-pink-600 shrink-0" />
                <span>สถานที่: {selectedMission.location} ({selectedMission.province})</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-600">
                <User className="w-4 h-4 text-[#27265B] shrink-0" />
                <span>
                  ผู้ควบคุม: {selectedMission.personnelRank} {selectedMission.personnelName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Camera className="w-4 h-4 text-[#27265B] shrink-0" />
                <span>ขนาดชุดปฏิบัติการ: {selectedMission.teamCount} นาย</span>
              </div>
              {selectedMission.gpsCoordinates && (
                <div className="text-[11px] text-slate-400 font-mono">
                  GPS: {selectedMission.gpsCoordinates}
                </div>
              )}
            </div>
          </div>

          {/* Status Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              สถานะการปฏิบัติงาน:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'pending', label: 'รอดำเนินการ', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                { id: 'in_progress', label: 'กำลังดำเนินการ', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                { id: 'completed', label: 'เสร็จสิ้นสมบูรณ์', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                { id: 'postponed', label: 'เลื่อนภารกิจ', color: 'bg-slate-50 text-slate-700 border-slate-200' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentStatus(s.id as MissionStatus)}
                  className={`p-2 rounded-xl text-xs font-semibold border transition text-center ${
                    currentStatus === s.id
                      ? `${s.color} ring-2 ring-pink-500 font-bold shadow-xs`
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Deliverables Progress and Fast Add */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                การส่งมอบภาพถ่าย (Deliverables):
              </span>
              <span className="font-mono text-xs font-bold text-[#27265B]">
                {deliveredCount} / {selectedMission.deliverablesRequired} ภาพ ({progress}%)
              </span>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  progress >= 100 ? 'bg-emerald-500' : 'bg-pink-600'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[11px] text-slate-500 font-medium">บันทึกรูปภาพส่งมอบ:</span>
              <button
                type="button"
                onClick={() => handleQuickAddDeliverables(5)}
                className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 text-xs hover:bg-slate-100"
              >
                +5 รูป
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddDeliverables(10)}
                className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 text-xs hover:bg-slate-100"
              >
                +10 รูป
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeliveredCount(selectedMission.deliverablesRequired);
                  setCurrentStatus('completed');
                }}
                className="px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold hover:bg-emerald-100"
              >
                ส่งมอบครบ 100%
              </button>
            </div>
          </div>

          {/* Deliverables Photos Preview */}
          {selectedMission.deliverablesPhotos && selectedMission.deliverablesPhotos.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">
                ตัวอย่างภาพถ่ายส่งมอบ:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(selectedMission.deliverablesPhotos || []).map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-24 rounded-xl object-cover border border-slate-200 shadow-2xs"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Timeline Steps */}
          {selectedMission.timeline && selectedMission.timeline.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">
                กำหนดการและขั้นตอนปฏิบัติงาน:
              </span>
              <div className="space-y-1.5">
                {(selectedMission.timeline || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        item.completed ? 'text-emerald-600' : 'text-slate-300'
                      }`}
                    />
                    <span className="font-mono text-slate-500">{item.time} น.</span>
                    <span className="text-slate-700">{item.activity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
          <button
            onClick={() => setSelectedMission(null)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
          >
            ยกเลิก
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 bg-[#27265B] hover:bg-[#1E1B4B] text-white rounded-xl text-xs font-semibold shadow-xs transition"
          >
            บันทึกการเปลี่ยนแปลง
          </button>
        </div>
      </div>
    </div>
  );
};
