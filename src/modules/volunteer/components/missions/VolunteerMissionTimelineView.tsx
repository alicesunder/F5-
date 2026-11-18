import React from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  Shield,
  Users,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  ChevronRight,
} from 'lucide-react';
import { useVolunteer } from '../../context/VolunteerContext';
import { VolunteerMissionItem } from '../../types/volunteerTypes';

export const VolunteerMissionTimelineView: React.FC = () => {
  const { filteredMissions, setSelectedMission } = useVolunteer();

  // Sort missions by raw date
  const sortedMissions = [...filteredMissions].sort((a, b) => (a.rawDate > b.rawDate ? 1 : -1));

  return (
    <div className="relative pl-6 sm:pl-10 space-y-6 before:absolute before:left-3 sm:before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-[#42A77A] before:via-[#42A77A]/40 before:to-transparent">
      {sortedMissions.map((mission, index) => {
        const isCompleted = mission.status === 'COMPLETED' || mission.status === 'CLOSED';
        const isPendingReview = mission.status === 'PENDING_REVIEW';
        const isInProgress = mission.status === 'IN_PROGRESS';

        return (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.04 }}
            className="relative group cursor-pointer"
            onClick={() => setSelectedMission(mission)}
          >
            {/* Timeline Node */}
            <div
              className={`absolute -left-6 sm:-left-10 top-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 z-10 ${
                isCompleted
                  ? 'bg-[#42A77A] border-white text-white shadow-md shadow-[#42A77A]/30'
                  : isInProgress
                  ? 'bg-[#2583D8] border-white text-white shadow-md shadow-blue-400/30 animate-pulse'
                  : isPendingReview
                  ? 'bg-[#F59E0B] border-white text-white shadow-md shadow-amber-400/30'
                  : 'bg-white border-[#42A77A] text-[#42A77A]'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>

            {/* Mission Card */}
            <div className="p-4 rounded-2xl bg-white/90 hover:bg-[#EAF7F0]/60 border border-[rgba(66,167,122,0.2)] hover:border-[#42A77A] shadow-xs hover:shadow-md transition-all duration-200">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-[rgba(66,167,122,0.12)]">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-[#2F8A63] bg-[#EAF7F0] px-2 py-0.5 rounded-md">
                    {mission.code}
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white border border-gray-200 text-[#25202B]">
                    {mission.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#6B6973]">
                  <span className="flex items-center gap-1 font-semibold text-[#25202B]">
                    <Calendar className="w-3.5 h-3.5 text-[#42A77A]" />
                    {mission.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#A29FA8]" />
                    {mission.startTime} - {mission.endTime} น.
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <h4 className="text-sm font-bold text-[#25202B] group-hover:text-[#42A77A] transition-colors leading-snug">
                    {mission.title}
                  </h4>
                  <p className="text-xs text-[#6B6973] line-clamp-2 leading-relaxed">
                    {mission.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#6B6973]">
                    <span className="flex items-center gap-1 font-medium text-[#25202B]">
                      <Shield className="w-3.5 h-3.5 text-[#42A77A]" />
                      {mission.unitName}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#42A77A]" />
                      {mission.location} ({mission.district}, {mission.province})
                    </span>
                    <span className="flex items-center gap-1 font-mono font-bold text-[#2F8A63]">
                      <Users className="w-3.5 h-3.5 text-[#42A77A]" />
                      {mission.assignedPersonnelCount} นาย
                    </span>
                  </div>
                </div>

                {/* Right badges & quick link */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                      isCompleted
                        ? 'bg-[#EAF7F0] text-[#2F8A63]'
                        : isInProgress
                        ? 'bg-blue-50 text-blue-700'
                        : isPendingReview
                        ? 'bg-amber-50 text-amber-800 font-bold'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {mission.status === 'COMPLETED'
                      ? 'เสร็จสิ้น'
                      : mission.status === 'IN_PROGRESS'
                      ? 'กำลังปฏิบัติหน้าที่'
                      : mission.status === 'PENDING_REVIEW'
                      ? 'รายงานรอตรวจ'
                      : mission.status === 'PENDING_REPORT'
                      ? 'รอส่งรายงาน'
                      : 'วางแผน'}
                  </span>

                  <span className="text-xs font-semibold text-[#42A77A] flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    <span>ดูรายละเอียด</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
