import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Download,
  Users,
  Calendar,
  Clock,
  MapPin,
  Shield,
  FileText,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { useVolunteer } from '../../context/VolunteerContext';
import { VolunteerReportItem } from '../../types/volunteerTypes';

export const VolunteerReportReviewModal: React.FC = () => {
  const {
    selectedReport,
    setSelectedReport,
    isReviewReportModalOpen,
    setIsReviewReportModalOpen,
    reviewReport,
    setIsAiSummaryModalOpen,
  } = useVolunteer();

  const [reviewNote, setReviewNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  if (!isReviewReportModalOpen || !selectedReport) return null;

  const handleApprove = () => {
    reviewReport(
      selectedReport.id,
      'APPROVED',
      reviewNote.trim() || 'ข้อมูลครบถ้วน ถูกต้องตามระเบียบ อนุมัติบันทึกสถิติ'
    );
    setIsReviewReportModalOpen(false);
  };

  const handleRequestRevision = () => {
    if (!rejectReason.trim()) return;
    reviewReport(selectedReport.id, 'REVISION_REQUESTED', rejectReason.trim());
    setIsReviewReportModalOpen(false);
    setIsRejecting(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsReviewReportModalOpen(false)}
          className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[rgba(66,167,122,0.3)] overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#EAF7F0] via-white to-[#EAF7F0] border-b border-[rgba(66,167,122,0.2)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#42A77A] text-white flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-[#2F8A63] bg-white px-2 py-0.5 rounded border border-[rgba(66,167,122,0.2)]">
                    {selectedReport.missionCode}
                  </span>
                  <span className="text-xs font-bold text-[#25202B]">
                    ตรวจรายงานผลการปฏิบัติงานจิตอาสา (แบบ จอ.๐๑)
                  </span>
                </div>
                <p className="text-[11px] text-[#6B6973]">
                  หน่วยรายงาน: {selectedReport.unitName} • ส่งเมื่อ {selectedReport.submittedAt}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAiSummaryModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF7F0] border border-[rgba(66,167,122,0.25)] text-[#2F8A63] text-xs font-semibold hover:bg-[#42A77A] hover:text-white transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#42A77A]" />
                <span>สรุปด้วย AI</span>
              </button>

              <button
                onClick={() => setIsReviewReportModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-[#6B6973] hover:text-[#25202B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Report Inspection Body */}
          <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
            {/* Mission Title Card */}
            <div className="p-3 rounded-xl bg-[#F9FBF9] border border-[rgba(66,167,122,0.18)]">
              <span className="text-[10px] text-[#8A8894] uppercase font-bold tracking-wider">ภารกิจที่มอบหมาย</span>
              <h3 className="text-sm font-bold text-[#25202B] mt-0.5">{selectedReport.missionTitle}</h3>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-[#6B6973]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#42A77A]" />
                  {selectedReport.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#42A77A]" />
                  {selectedReport.executionTime}
                </span>
              </div>
            </div>

            {/* Impact Metric Counts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-white border border-[rgba(66,167,122,0.2)]">
                <span className="text-[11px] text-[#6B6973]">กำลังพลร่วมปฏิบัติ</span>
                <p className="text-xl font-bold font-mono text-[#2F8A63] mt-0.5">
                  {selectedReport.actualPersonnelCount} <span className="text-xs font-normal text-[#6B6973]">นาย</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[rgba(66,167,122,0.2)]">
                <span className="text-[11px] text-[#6B6973]">ประชาชนที่ได้รับบริการ</span>
                <p className="text-xl font-bold font-mono text-[#2583D8] mt-0.5">
                  {selectedReport.participantBeneficiariesCount.toLocaleString()} <span className="text-xs font-normal text-[#6B6973]">คน</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[rgba(66,167,122,0.2)]">
                <span className="text-[11px] text-[#6B6973]">ผู้รายงานข้อมูล</span>
                <p className="text-xs font-bold text-[#25202B] mt-1 truncate">
                  {selectedReport.reporterRank} {selectedReport.reporterName}
                </p>
                <p className="text-[10px] text-[#8A8894] truncate">{selectedReport.reporterPosition}</p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[rgba(66,167,122,0.2)]">
                <span className="text-[11px] text-[#6B6973]">เบอร์ติดต่อผู้รายงาน</span>
                <p className="text-xs font-mono font-bold text-[#2F8A63] mt-1">
                  {selectedReport.reporterPhone}
                </p>
              </div>
            </div>

            {/* Outcome Summary */}
            <div className="p-3.5 rounded-xl bg-white border border-[rgba(66,167,122,0.2)] space-y-1.5">
              <span className="font-bold text-[#25202B] block">สรุปผลการปฏิบัติงานตามแบบ จอ.๐๑:</span>
              <p className="text-[#6B6973] leading-relaxed">{selectedReport.outcomeSummary}</p>
            </div>

            {/* Key Achievements & Problems */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#EAF7F0]/50 border border-[rgba(66,167,122,0.2)]">
                <span className="font-bold text-[#2F8A63] flex items-center gap-1.5 mb-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#42A77A]" />
                  ผลสัมฤทธิ์สำคัญที่ได้รับ:
                </span>
                <ul className="list-disc list-inside space-y-1 text-[#25202B]">
                  {selectedReport.keyAchievements.map((ach, i) => (
                    <li key={i}>{ach}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200">
                <span className="font-bold text-amber-800 flex items-center gap-1.5 mb-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  ปัญหาและอุปสรรค / ข้อเสนอแนะ:
                </span>
                <ul className="list-disc list-inside space-y-1 text-[#25202B]">
                  {selectedReport.problemsAndObstacles.map((prob, i) => (
                    <li key={i}>{prob}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Photo Gallery with Captions */}
            {selectedReport.photos && selectedReport.photos.length > 0 && (
              <div className="p-3.5 rounded-xl bg-white border border-[rgba(66,167,122,0.2)] space-y-2">
                <span className="font-bold text-[#25202B] block">ภาพถ่ายเชิงประจักษ์การปฏิบัติงาน:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedReport.photos.map(p => (
                    <div key={p.id} className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                      <img
                        src={p.url}
                        alt={p.caption}
                        className="w-full h-36 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="p-2 text-[11px] text-[#25202B] flex items-center justify-between bg-white">
                        <span className="truncate">{p.caption}</span>
                        <span className="text-[10px] text-[#8A8894] font-mono flex-shrink-0">{p.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attached Documents */}
            {selectedReport.documents && selectedReport.documents.length > 0 && (
              <div className="p-3.5 rounded-xl bg-white border border-[rgba(66,167,122,0.2)] space-y-2">
                <span className="font-bold text-[#25202B] block">เอกสารหลักฐานแนบ:</span>
                <div className="space-y-1.5">
                  {selectedReport.documents.map(d => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#F9FBF9] border border-gray-200 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-[#42A77A] flex-shrink-0" />
                        <span className="font-medium text-[#25202B] truncate">{d.name}</span>
                        <span className="text-[10px] text-[#8A8894]">({d.size})</span>
                      </div>
                      <button
                        onClick={() => alert(`จำลองการดาวน์โหลดไฟล์ ${d.name}`)}
                        className="flex items-center gap-1 text-[11px] text-[#42A77A] font-semibold hover:underline flex-shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>ดาวน์โหลด</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Revision Reason Form if Toggled */}
            {isRejecting ? (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                <span className="font-bold text-rose-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  ระบุเหตุผลในการขอแก้ไข (Revision Feedback):
                </span>
                <textarea
                  rows={3}
                  required
                  placeholder="ระบุสิ่งที่ต้องแก้ไขอย่างชัดเจน เช่น ขาดภาพถ่ายก่อน-หลังการทำความสะอาด, ยอดผู้เข้าร่วมไม่ตรงกับเอกสารแนบ..."
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-rose-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsRejecting(false)}
                    className="px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-200"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleRequestRevision}
                    className="px-4 py-1.5 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700"
                  >
                    ยืนยันส่งคืนเพื่อขอแก้ไข (🔴)
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#F5FBF7] border border-[rgba(66,167,122,0.25)] space-y-2">
                <span className="font-bold text-[#25202B] block">
                  บันทึกการพิจารณาของ ฝอ.๕ (ความเห็นการอนุมัติ):
                </span>
                <input
                  type="text"
                  placeholder="เช่น ข้อมูลครบถ้วน ถูกต้องตามระเบียบ อนุมัติบันทึกสถิติภาพรวม"
                  value={reviewNote}
                  onChange={e => setReviewNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(66,167,122,0.25)] bg-white focus:outline-none focus:ring-2 focus:ring-[#42A77A]/30 text-xs"
                />
              </div>
            )}
          </div>

          {/* Footer Decision Buttons */}
          <div className="p-4 border-t border-[rgba(66,167,122,0.18)] bg-[#F9FBF9] flex items-center justify-between gap-2">
            <button
              onClick={() => setIsReviewReportModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#6B6973] hover:bg-gray-100"
            >
              ปิดหน้าต่าง
            </button>

            {!isRejecting && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRejecting(true)}
                  className="px-4 py-2 rounded-xl border border-rose-300 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-semibold transition-colors cursor-pointer"
                >
                  ขอแก้ไขรายงาน (🔴)
                </button>

                <button
                  onClick={handleApprove}
                  className="px-5 py-2 rounded-xl bg-[#42A77A] text-white text-xs font-bold hover:bg-[#389169] transition-all shadow-md shadow-[#42A77A]/20 cursor-pointer"
                >
                  อนุมัติรายงาน (ผ่าน 🟢)
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
