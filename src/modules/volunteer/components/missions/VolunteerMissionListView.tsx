import React from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  Shield,
  Users,
  Eye,
  FileCheck,
  FileEdit,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useVolunteer } from '../../context/VolunteerContext';
import { VolunteerMissionItem, VolunteerMissionStatus, VolunteerReportStatus } from '../../types/volunteerTypes';

export const VolunteerMissionListView: React.FC = () => {
  const {
    filteredMissions,
    setSelectedMission,
    setSelectedReport,
    reports,
    setIsReviewReportModalOpen,
    setIsSubmitReportModalOpen,
    clearFilters,
  } = useVolunteer();

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
        return { label: 'รอตรวจ', bg: 'bg-[#FFFBEB]', text: 'text-[#D97706]', dot: 'bg-[#F59E0B]' };
      case 'COMPLETED':
      case 'CLOSED':
        return { label: 'เสร็จสิ้น', bg: 'bg-[#EAF7F0]', text: 'text-[#2F8A63]', dot: 'bg-[#42A77A]' };
      default:
        return { label: status, bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' };
    }
  };

  const getReportBadge = (reportStatus?: VolunteerReportStatus) => {
    switch (reportStatus) {
      case 'NOT_SUBMITTED':
        return { label: 'ยังไม่ส่ง', icon: '⚪', bg: 'bg-gray-100', text: 'text-gray-600' };
      case 'SUBMITTED':
        return { label: 'ส่งแล้ว', icon: '🔵', bg: 'bg-blue-50', text: 'text-blue-700' };
      case 'PENDING_REVIEW':
        return { label: 'รอตรวจ', icon: '🟠', bg: 'bg-amber-50', text: 'text-amber-800 font-bold animate-pulse' };
      case 'APPROVED':
        return { label: 'ผ่าน', icon: '🟢', bg: 'bg-emerald-50', text: 'text-emerald-700 font-bold' };
      case 'REVISION_REQUESTED':
        return { label: 'ขอแก้ไข', icon: '🔴', bg: 'bg-rose-50', text: 'text-rose-700 font-bold' };
      default:
        return { label: 'ยังไม่ส่ง', icon: '⚪', bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  if (filteredMissions.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white/70 border border-[rgba(66,167,122,0.2)]">
        <p className="text-sm font-semibold text-[#25202B]">ไม่พบภารกิจตามเงื่อนไขการค้นหาหรือตัวกรอง</p>
        <p className="text-xs text-[#6B6973] mt-1">ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองทั้งหมด</p>
        <button
          onClick={clearFilters}
          className="mt-4 px-4 py-1.5 rounded-xl bg-[#EAF7F0] text-[#2F8A63] text-xs font-semibold hover:bg-[#42A77A] hover:text-white transition-colors cursor-pointer"
        >
          ล้างตัวกรองทั้งหมด
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[rgba(66,167,122,0.2)] bg-white/90 shadow-sm">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-[rgba(66,167,122,0.18)] bg-[#F5FBF7]/90 text-[#25202B]">
            <th className="py-3 px-3.5 font-bold">รหัสภารกิจ</th>
            <th className="py-3 px-3.5 font-bold">ชื่อภารกิจ & ประเภท</th>
            <th className="py-3 px-3.5 font-bold">วันและเวลา</th>
            <th className="py-3 px-3.5 font-bold">หน่วยปฏิบัติ</th>
            <th className="py-3 px-3.5 font-bold">สถานที่</th>
            <th className="py-3 px-3.5 font-bold text-center">กำลังพล</th>
            <th className="py-3 px-3.5 font-bold text-center">สถานะ</th>
            <th className="py-3 px-3.5 font-bold text-center">รายงาน จอ.01</th>
            <th className="py-3 px-3.5 font-bold text-right">การจัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filteredMissions.map(m => {
            const statusBadge = getStatusBadge(m.status);
            const reportBadge = getReportBadge(m.reportStatus);
            const matchingReport = reports.find(r => r.missionId === m.id || r.id === m.reportId);

            return (
              <motion.tr
                key={m.id}
                whileHover={{ backgroundColor: 'rgba(234, 247, 240, 0.45)' }}
                className="transition-colors group cursor-pointer"
                onClick={() => setSelectedMission(m)}
              >
                {/* Code */}
                <td className="py-3 px-3.5 font-mono font-bold text-[#2F8A63] whitespace-nowrap">
                  {m.code}
                </td>

                {/* Title & Category */}
                <td className="py-3 px-3.5 max-w-xs">
                  <p className="font-semibold text-[#25202B] line-clamp-1 group-hover:text-[#42A77A] transition-colors">
                    {m.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] px-2 py-0.2 rounded-md bg-[#EAF7F0] text-[#2F8A63] font-medium border border-[rgba(66,167,122,0.2)]">
                      {m.category}
                    </span>
                    <span className="text-[10px] text-[#8A8894]">ขั้นที่ {m.workflowStep}/7</span>
                  </div>
                </td>

                {/* Date & Time */}
                <td className="py-3 px-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-[#25202B] font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#42A77A]" />
                    <span>{m.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#6B6973] mt-0.5">
                    <Clock className="w-3 h-3 text-[#A29FA8]" />
                    <span>{m.startTime} - {m.endTime} น.</span>
                  </div>
                </td>

                {/* Unit */}
                <td className="py-3 px-3.5 whitespace-nowrap font-medium text-[#25202B]">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#42A77A]" />
                    <span>{m.unitName}</span>
                  </div>
                </td>

                {/* Location */}
                <td className="py-3 px-3.5 text-[#6B6973] max-w-44 truncate">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#42A77A] flex-shrink-0" />
                    <span className="truncate">{m.district}, {m.province}</span>
                  </div>
                </td>

                {/* Personnel count */}
                <td className="py-3 px-3.5 text-center font-mono font-bold text-[#25202B] whitespace-nowrap">
                  {m.assignedPersonnelCount} <span className="text-[10px] font-normal text-[#6B6973]">นาย</span>
                </td>

                {/* Status Badge */}
                <td className="py-3 px-3.5 text-center whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                    {statusBadge.label}
                  </span>
                </td>

                {/* Report Status */}
                <td className="py-3 px-3.5 text-center whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${reportBadge.bg} ${reportBadge.text}`}>
                    <span>{reportBadge.icon}</span>
                    <span>{reportBadge.label}</span>
                  </span>
                </td>

                {/* Action buttons */}
                <td className="py-3 px-3.5 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedMission(m)}
                      className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#EAF7F0] text-[#25202B] hover:text-[#2F8A63] transition-colors cursor-pointer"
                      title="ดูรายละเอียดภารกิจ"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {m.reportStatus === 'PENDING_REVIEW' && matchingReport && (
                      <button
                        onClick={() => {
                          setSelectedReport(matchingReport);
                          setIsReviewReportModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#F59E0B] text-white font-semibold text-[11px] hover:bg-[#D97706] transition-colors cursor-pointer flex items-center gap-1"
                        title="ตรวจรายงานผล"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>ตรวจ</span>
                      </button>
                    )}

                    {(!m.reportStatus || m.reportStatus === 'NOT_SUBMITTED' || m.status === 'PENDING_REPORT') && (
                      <button
                        onClick={() => {
                          setSelectedMission(m);
                          setIsSubmitReportModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#2583D8] text-white font-semibold text-[11px] hover:bg-blue-600 transition-colors cursor-pointer flex items-center gap-1"
                        title="ส่งรายงาน จอ.01"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                        <span>รายงาน</span>
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
