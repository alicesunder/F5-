import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Shield,
  Users,
  Phone,
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  ChevronRight,
  Share2,
  Printer,
  Sparkles,
  Shirt,
} from 'lucide-react';
import { useVolunteer } from '../../context/VolunteerContext';
import { VolunteerMissionStatus, VolunteerReportStatus } from '../../types/volunteerTypes';
import { useAdmin } from '../../../../contexts/AdminContext';

export const VolunteerMissionDetailDrawer: React.FC = () => {
  const {
    selectedMission,
    setSelectedMission,
    reports,
    setSelectedReport,
    setIsReviewReportModalOpen,
    setIsSubmitReportModalOpen,
    updateMissionWorkflowStep,
  } = useVolunteer();

  const { navigateModule } = useAdmin();

  if (!selectedMission) return null;

  const associatedReport = reports.find(r => r.missionId === selectedMission.id || r.id === selectedMission.reportId);

  const getStatusBadge = (status: VolunteerMissionStatus) => {
    switch (status) {
      case 'PLANNING':
        return { label: 'วางแผน', bg: 'bg-[#F4F4F5]', text: 'text-[#52525B]', dot: 'bg-[#71717A]' };
      case 'PENDING_ASSIGNMENT':
        return { label: 'รอดำเนินการ', bg: 'bg-[#EFF6FF]', text: 'text-[#1D4ED8]', dot: 'bg-[#2563EB]' };
      case 'IN_PROGRESS':
        return { label: 'กำลังดำเนินการ', bg: 'bg-[#EBF5FF]', text: 'text-[#0284C7]', dot: 'bg-[#0EA5E9]' };
      case 'PENDING_REPORT':
        return { label: 'รอรายงาน', bg: 'bg-[#FEF2F2]', text: 'text-[#DC2626]', dot: 'bg-[#EF4444]' };
      case 'PENDING_REVIEW':
        return { label: 'รายงานรอตรวจ', bg: 'bg-[#FFFBEB]', text: 'text-[#D97706]', dot: 'bg-[#F59E0B]' };
      case 'COMPLETED':
      case 'CLOSED':
        return { label: 'เสร็จสิ้น / ผ่าน', bg: 'bg-[#EAF7F0]', text: 'text-[#2F8A63]', dot: 'bg-[#42A77A]' };
      default:
        return { label: status, bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' };
    }
  };

  const getReportStatusBadge = (status?: VolunteerReportStatus) => {
    switch (status) {
      case 'NOT_SUBMITTED':
        return { label: 'ยังไม่ส่ง', color: 'text-gray-500', bg: 'bg-gray-100', icon: '⚪' };
      case 'SUBMITTED':
        return { label: 'ส่งแล้ว', color: 'text-blue-600', bg: 'bg-blue-50', icon: '🔵' };
      case 'PENDING_REVIEW':
        return { label: 'รอตรวจ', color: 'text-amber-600', bg: 'bg-amber-50', icon: '🟠' };
      case 'APPROVED':
        return { label: 'ผ่าน (อนุมัติแล้ว)', color: 'text-emerald-700', bg: 'bg-emerald-50', icon: '🟢' };
      case 'REVISION_REQUESTED':
        return { label: 'ขอแก้ไข', color: 'text-rose-600', bg: 'bg-rose-50', icon: '🔴' };
      default:
        return { label: 'ยังไม่ส่ง', color: 'text-gray-500', bg: 'bg-gray-100', icon: '⚪' };
    }
  };

  const statusBadge = getStatusBadge(selectedMission.status);
  const reportBadge = getReportStatusBadge(selectedMission.reportStatus || (associatedReport ? associatedReport.status : 'NOT_SUBMITTED'));

  const workflowLabels = [
    '1. สร้างภารกิจ',
    '2. มอบหมาย',
    '3. รับทราบ',
    '4. ปฏิบัติหน้าที่',
    '5. ส่งรายงาน',
    '6. ฝอ.5 ตรวจสอบ',
    '7. ปิดภารกิจ',
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedMission(null)}
          className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
        />

        {/* Sliding Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl border-l border-[rgba(66,167,122,0.25)] shadow-2xl flex flex-col h-full z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-[rgba(66,167,122,0.18)] bg-gradient-to-r from-white via-[#F5FBF7] to-white flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-md bg-[#EAF7F0] border border-[rgba(66,167,122,0.25)] text-[#2F8A63] text-xs font-mono font-bold">
                  {selectedMission.code}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {selectedMission.category}
                </span>
                <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                  {statusBadge.label}
                </span>
              </div>
              <h2 className="text-base font-bold text-[#25202B] leading-snug">
                {selectedMission.title}
              </h2>
            </div>

            <button
              onClick={() => setSelectedMission(null)}
              className="p-1.5 rounded-xl hover:bg-gray-100 text-[#6B6973] hover:text-[#25202B] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* 7-Step Visual Workflow Stepper */}
            <div className="p-3.5 rounded-xl bg-[#F9FBF9] border border-[rgba(66,167,122,0.2)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#25202B]">
                  ความคืบหน้าตามขั้นตอน (Workflow Status)
                </span>
                <span className="text-xs font-semibold text-[#42A77A]">
                  ขั้นที่ {selectedMission.workflowStep || 1} จาก 7
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-[#42A77A] to-[#2F8A63] transition-all duration-300"
                  style={{ width: `${((selectedMission.workflowStep || 1) / 7) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {workflowLabels.map((lbl, idx) => {
                  const stepNum = idx + 1;
                  const isCurrent = (selectedMission.workflowStep || 1) === stepNum;
                  const isDone = (selectedMission.workflowStep || 1) > stepNum;

                  return (
                    <button
                      key={lbl}
                      onClick={() => updateMissionWorkflowStep(selectedMission.id, stepNum)}
                      title={`คลิกเพื่อตั้งเป็น ${lbl}`}
                      className={`text-[9px] p-1 rounded transition-colors text-left sm:text-center truncate cursor-pointer ${
                        isCurrent
                          ? 'bg-[#42A77A] text-white font-bold'
                          : isDone
                          ? 'text-[#2F8A63] font-medium bg-[#EAF7F0]'
                          : 'text-[#8A8894] hover:bg-gray-100'
                      }`}
                    >
                      {stepNum}. {lbl.split('. ')[1]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Core Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-[rgba(66,167,122,0.18)] space-y-2">
                <div className="flex items-center gap-2 text-[#6B6973]">
                  <Calendar className="w-4 h-4 text-[#42A77A]" />
                  <span className="font-medium">วันและเวลาปฏิบัติหน้าที่:</span>
                </div>
                <p className="font-semibold text-[#25202B] pl-6">
                  {selectedMission.date} ({selectedMission.startTime} - {selectedMission.endTime} น.)
                </p>

                <div className="flex items-center gap-2 text-[#6B6973] pt-1">
                  <MapPin className="w-4 h-4 text-[#42A77A]" />
                  <span className="font-medium">สถานที่:</span>
                </div>
                <p className="font-semibold text-[#25202B] pl-6">
                  {selectedMission.location}, {selectedMission.district}, {selectedMission.province}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[rgba(66,167,122,0.18)] space-y-2">
                <div className="flex items-center gap-2 text-[#6B6973]">
                  <Shield className="w-4 h-4 text-[#42A77A]" />
                  <span className="font-medium">หน่วยปฏิบัติที่รับผิดชอบ:</span>
                </div>
                <p className="font-semibold text-[#25202B] pl-6">
                  {selectedMission.unitName}
                </p>

                <div className="flex items-center gap-2 text-[#6B6973] pt-1">
                  <Users className="w-4 h-4 text-[#42A77A]" />
                  <span className="font-medium">กำลังพลจัดส่ง:</span>
                </div>
                <p className="font-semibold text-[#25202B] pl-6">
                  {selectedMission.assignedPersonnelCount} นาย
                </p>
              </div>
            </div>

            {/* Uniform & Dress Code */}
            <div className="p-3.5 rounded-xl bg-white border border-[rgba(66,167,122,0.18)]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#25202B] mb-1">
                <Shirt className="w-4 h-4 text-[#42A77A]" />
                <span>การแต่งกายและเครื่องแบบ:</span>
              </div>
              <p className="text-xs text-[#2F8A63] font-medium bg-[#EAF7F0] p-2.5 rounded-lg border border-[rgba(66,167,122,0.2)]">
                {selectedMission.uniform}
              </p>
            </div>

            {/* Coordinator Info */}
            <div className="p-3.5 rounded-xl bg-white border border-[rgba(66,167,122,0.18)]">
              <span className="text-xs font-bold text-[#25202B] block mb-2">
                นายตำรวจผู้ประสานงานและรับผิดชอบ:
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#25202B]">
                    {selectedMission.coordinatorRank} {selectedMission.coordinatorName}
                  </p>
                  <p className="text-[11px] text-[#6B6973]">ผู้ประสานงานฝ่ายจิตอาสา</p>
                </div>
                <a
                  href={`tel:${selectedMission.coordinatorPhone}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF7F0] hover:bg-[#42A77A] hover:text-white text-[#2F8A63] text-xs font-semibold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{selectedMission.coordinatorPhone}</span>
                </a>
              </div>
            </div>

            {/* Description & Objectives */}
            <div className="p-3.5 rounded-xl bg-white border border-[rgba(66,167,122,0.18)] space-y-2">
              <span className="text-xs font-bold text-[#25202B] block">
                รายละเอียดและวัตถุประสงค์โครงการ:
              </span>
              <p className="text-xs text-[#6B6973] leading-relaxed">
                {selectedMission.description}
              </p>
              {selectedMission.objectives && selectedMission.objectives.length > 0 && (
                <div className="pt-2 space-y-1">
                  <span className="text-[11px] font-semibold text-[#25202B]">เป้าหมายสำคัญ:</span>
                  <ul className="list-disc list-inside text-xs text-[#6B6973] space-y-0.5">
                    {selectedMission.objectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Reporting Status Card */}
            <div className="p-3.5 rounded-xl bg-[#F5FBF7] border border-[rgba(66,167,122,0.25)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#25202B] flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-[#42A77A]" />
                  สถานะรายงานผลการปฏิบัติ (จอ.01)
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${reportBadge.bg} ${reportBadge.color}`}>
                  {reportBadge.icon} {reportBadge.label}
                </span>
              </div>

              {associatedReport ? (
                <div className="space-y-2 text-xs">
                  <p className="text-[#6B6973] leading-relaxed">
                    <span className="font-medium text-[#25202B]">สรุปผล:</span> {associatedReport.outcomeSummary}
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-[#6B6973]">
                    <span>ผู้รายงาน: {associatedReport.reporterRank} {associatedReport.reporterName}</span>
                    <span>ส่งเมื่อ: {associatedReport.submittedAt}</span>
                  </div>

                  {associatedReport.status === 'REVISION_REQUESTED' && (
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] space-y-1">
                      <span className="font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        ข้อความทักท้วงจาก ฝอ.5 (ขอแก้ไข):
                      </span>
                      <p>{associatedReport.revisionReason}</p>
                    </div>
                  )}

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedReport(associatedReport);
                        setIsReviewReportModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#42A77A] text-white text-xs font-semibold hover:bg-[#389169] transition-colors"
                    >
                      เปิดตรวจรายงานแบบเต็ม
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs text-[#6B6973]">
                  <span>ยังไม่มีการส่งรายงานสำหรับภารกิจนี้</span>
                  <button
                    onClick={() => {
                      setIsSubmitReportModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#2583D8] text-white text-xs font-semibold hover:bg-blue-600 transition-colors"
                  >
                    กรอกรายงาน จอ.01
                  </button>
                </div>
              )}
            </div>

            {/* Cross-Department Links */}
            {selectedMission.crossDepartmentLinks && selectedMission.crossDepartmentLinks.length > 0 && (
              <div className="p-3.5 rounded-xl bg-white border border-[rgba(66,167,122,0.18)]">
                <span className="text-xs font-bold text-[#25202B] block mb-2">
                  การบูรณาการข้ามฝ่าย (Cross-Department Collaboration):
                </span>
                <div className="space-y-1.5">
                  {selectedMission.crossDepartmentLinks.map((link, idx) => (
                    <div
                      key={idx}
                      onClick={() => navigateModule(link.department)}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#F9FBF9] hover:bg-[#EAF7F0] border border-[rgba(66,167,122,0.15)] text-xs cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white font-bold border border-gray-200">
                          {link.department === 'relations' ? 'งานประชาสัมพันธ์' : link.department === 'disaster' ? 'งานสาธารณภัย' : 'งานอำนวยการ'}
                        </span>
                        <span className="text-[#25202B] font-medium truncate">{link.title}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-[#42A77A] flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Buttons */}
          <div className="p-4 border-t border-[rgba(66,167,122,0.18)] bg-[#F9FBF9] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white border border-[rgba(66,167,122,0.2)] text-[#25202B] hover:bg-[#EAF7F0] transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-[#42A77A]" />
                <span className="hidden sm:inline">พิมพ์คำสั่ง</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedMission(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#6B6973] hover:bg-gray-100 transition-colors"
              >
                ปิดหน้าต่าง
              </button>
              <button
                onClick={() => {
                  if (associatedReport) {
                    setSelectedReport(associatedReport);
                    setIsReviewReportModalOpen(true);
                  } else {
                    setIsSubmitReportModalOpen(true);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-[#42A77A] text-white text-xs font-semibold hover:bg-[#389169] transition-all shadow-sm"
              >
                {associatedReport ? 'ตรวจสอบรายงาน (Review)' : 'บันทึกรายงาน จอ.01'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
