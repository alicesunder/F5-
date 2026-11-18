import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Eye,
  FileText,
  Sparkles,
  Shield,
  Users,
} from 'lucide-react';
import { useVolunteer } from '../../context/VolunteerContext';
import { VolunteerReportItem, VolunteerReportStatus } from '../../types/volunteerTypes';

export const VolunteerReportsSection: React.FC = () => {
  const {
    reports,
    setSelectedReport,
    setIsReviewReportModalOpen,
    setIsSubmitReportModalOpen,
    setIsAiSummaryModalOpen,
  } = useVolunteer();

  const [statusFilter, setStatusFilter] = useState<'ALL' | VolunteerReportStatus>('ALL');
  const [reportSearch, setReportSearch] = useState('');

  const filteredReports = reports.filter(r => {
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchSearch =
      !reportSearch.trim() ||
      r.missionTitle.toLowerCase().includes(reportSearch.toLowerCase()) ||
      r.missionCode.toLowerCase().includes(reportSearch.toLowerCase()) ||
      r.unitName.toLowerCase().includes(reportSearch.toLowerCase()) ||
      r.reporterName.toLowerCase().includes(reportSearch.toLowerCase());

    return matchStatus && matchSearch;
  });

  const countPending = reports.filter(r => r.status === 'PENDING_REVIEW').length;
  const countApproved = reports.filter(r => r.status === 'APPROVED').length;
  const countRevision = reports.filter(r => r.status === 'REVISION_REQUESTED').length;

  const getStatusBadge = (status: VolunteerReportStatus) => {
    switch (status) {
      case 'PENDING_REVIEW':
        return { label: 'รอตรวจ (Pending Review)', bg: 'bg-[#FFFBEB]', text: 'text-[#D97706]', border: 'border-amber-300', dot: 'bg-amber-500' };
      case 'APPROVED':
        return { label: 'ผ่าน (Approved)', bg: 'bg-[#EAF7F0]', text: 'text-[#2F8A63]', border: 'border-emerald-300', dot: 'bg-[#42A77A]' };
      case 'REVISION_REQUESTED':
        return { label: 'ขอแก้ไข (Revision Needed)', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-300', dot: 'bg-rose-500' };
      default:
        return { label: 'ส่งแล้ว', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' };
    }
  };

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[rgba(66,167,122,0.25)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#25202B]">
              ระบบตรวจสอบและรับรองรายงานผลการปฏิบัติการจิตอาสา (แบบ จอ.๐๑)
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#EAF7F0] text-[#2F8A63] text-xs font-bold font-mono">
              {reports.length} ฉบับ
            </span>
          </div>
          <p className="text-xs text-[#6B6973] mt-0.5">
            กระบวนการกลั่นกรอง ตรวจสอบผลสัมฤทธิ์ และให้ความเห็นชอบโดย ฝอ.๕ บช.ตชด.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitReportModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2583D8] text-white text-xs font-semibold hover:bg-blue-600 transition-all shadow-sm cursor-pointer whitespace-nowrap self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>บันทึกรายงาน จอ.๐๑</span>
        </button>
      </div>

      {/* KPI Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'ALL'
              ? 'bg-[#EAF7F0] border-[#42A77A] shadow-xs'
              : 'bg-white/80 border-gray-200 hover:border-gray-300'
          }`}
        >
          <span className="text-[#6B6973]">รายงานทั้งหมด</span>
          <p className="text-xl font-bold font-mono text-[#25202B] mt-0.5">{reports.length}</p>
        </button>

        <button
          onClick={() => setStatusFilter('PENDING_REVIEW')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'PENDING_REVIEW'
              ? 'bg-amber-100/70 border-amber-500 shadow-xs'
              : 'bg-amber-50/60 border-amber-200 hover:bg-amber-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-amber-800 font-semibold">รอตรวจ (Pending)</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <p className="text-xl font-bold font-mono text-[#D97706] mt-0.5">{countPending}</p>
        </button>

        <button
          onClick={() => setStatusFilter('APPROVED')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'APPROVED'
              ? 'bg-[#EAF7F0] border-[#42A77A] shadow-xs'
              : 'bg-emerald-50/60 border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          <span className="text-emerald-800 font-semibold">ผ่านการตรวจ (Approved)</span>
          <p className="text-xl font-bold font-mono text-[#059669] mt-0.5">{countApproved}</p>
        </button>

        <button
          onClick={() => setStatusFilter('REVISION_REQUESTED')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'REVISION_REQUESTED'
              ? 'bg-rose-100/70 border-rose-500 shadow-xs'
              : 'bg-rose-50/60 border-rose-200 hover:bg-rose-50'
          }`}
        >
          <span className="text-rose-800 font-semibold">ขอแก้ไข (Revision)</span>
          <p className="text-xl font-bold font-mono text-rose-700 mt-0.5">{countRevision}</p>
        </button>
      </div>

      {/* Search toolbar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#6B6973] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="ค้นหาตามชื่อภารกิจ, รหัสภารกิจ, หน่วยที่ส่ง หรือชื่อผู้รายงาน..."
          value={reportSearch}
          onChange={e => setReportSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white/90 border border-[rgba(66,167,122,0.25)] focus:outline-none focus:ring-2 focus:ring-[#42A77A]/30"
        />
      </div>

      {/* Reports Cards List */}
      <div className="space-y-3">
        {filteredReports.map(report => {
          const badge = getStatusBadge(report.status);

          return (
            <motion.div
              key={report.id}
              whileHover={{ y: -2 }}
              className={`p-4 rounded-2xl bg-white/95 border transition-all duration-200 shadow-xs hover:shadow-md ${
                report.status === 'PENDING_REVIEW'
                  ? 'border-amber-300 ring-1 ring-amber-200'
                  : 'border-[rgba(66,167,122,0.2)] hover:border-[#42A77A]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[rgba(66,167,122,0.12)]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#2F8A63] bg-[#EAF7F0] px-2.5 py-0.5 rounded-md border border-[rgba(66,167,122,0.2)]">
                    {report.missionCode}
                  </span>
                  <span className="text-xs font-semibold text-[#25202B]">
                    {report.unitName}
                  </span>
                  <span className="text-[11px] text-[#8A8894]">
                    • ส่งเมื่อ {report.submittedAt}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.bg} ${badge.text} border ${badge.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    {badge.label}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <h4 className="text-sm font-bold text-[#25202B] leading-snug">
                    {report.missionTitle}
                  </h4>
                  <p className="text-xs text-[#6B6973] line-clamp-2 leading-relaxed">
                    {report.outcomeSummary}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#6B6973]">
                    <span className="flex items-center gap-1 font-mono font-medium text-[#25202B]">
                      <Users className="w-3.5 h-3.5 text-[#42A77A]" />
                      กำลังพล {report.actualPersonnelCount} นาย
                    </span>
                    <span>•</span>
                    <span className="text-[#2583D8] font-medium">
                      ผู้รับประโยชน์ {report.participantBeneficiariesCount.toLocaleString()} คน
                    </span>
                    <span>•</span>
                    <span>ผู้รายงาน: {report.reporterRank} {report.reporterName} ({report.reporterPhone})</span>
                  </div>

                  {/* If revision requested, show note */}
                  {report.status === 'REVISION_REQUESTED' && report.revisionReason && (
                    <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                      <span className="font-bold">ข้อความส่งคืนแก้ไข: </span>
                      <span>{report.revisionReason}</span>
                    </div>
                  )}

                  {/* If approved, show reviewer note */}
                  {report.status === 'APPROVED' && report.reviewNote && (
                    <div className="mt-2 p-2 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-800 text-xs">
                      <span className="font-bold">การพิจารณา ฝอ.๕: </span>
                      <span>{report.reviewNote} ({report.reviewedBy})</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setSelectedReport(report);
                      setIsReviewReportModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#42A77A] text-white text-xs font-semibold hover:bg-[#389169] transition-all shadow-xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{report.status === 'PENDING_REVIEW' ? 'ตรวจรายงาน (Review)' : 'ดูรายละเอียดรายงาน'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedReport(report);
                      setIsAiSummaryModalOpen(true);
                    }}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#2F8A63] hover:underline cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-[#42A77A]" />
                    <span>สรุปรายงานด้วย AI</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
