import React from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  MapPin,
  Users,
  Shirt,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { BppMissionItem, BppMissionStatus } from '../types';

interface BppMissionTimelineViewProps {
  missions: BppMissionItem[];
  onSelectMission: (mission: BppMissionItem) => void;
}

export const BppMissionTimelineView: React.FC<BppMissionTimelineViewProps> = ({
  missions,
  onSelectMission,
}) => {
  const getStatusBadge = (status: BppMissionStatus) => {
    switch (status) {
      case 'ดำเนินการแล้ว':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#059669] border border-emerald-200/80 bpp-status-completed shadow-2xs">
            <CheckCircle2 className="w-3 h-3 text-[#059669]" />
            ดำเนินการแล้ว
          </span>
        );
      case 'อยู่ระหว่างดำเนินการ':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-[#D97706] border border-amber-200/80 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
            อยู่ระหว่างดำเนินการ
          </span>
        );
      case 'รอดำเนินการ':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EDE4F7] text-[#5B2A86] border border-[#5B2A86]/20 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B2A86]" />
            รอดำเนินการ
          </span>
        );
      case 'ยังไม่กำหนด':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            ยังไม่กำหนด
          </span>
        );
    }
  };

  return (
    <div className="liquid-glass-card liquid-glass-sheen iridescent-edge rounded-2xl p-5 sm:p-6 relative overflow-hidden">
      {/* Item 14: Mission Timeline Signature Animation */}
      <div className="relative ml-3 sm:ml-5 space-y-4 sm:space-y-5">
        {/* Animated progressive line draw (500ms) */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-3 bottom-4 w-[2px] bg-gradient-to-b from-[#5B2A86] via-[#2583D8] to-[rgba(40,35,50,0.12)] origin-top pointer-events-none"
        />

        {missions.map((item, index) => {
          const deptColor =
            item.responsible?.includes('จิตอาสา') || item.responsible === 'จอส.'
              ? '#42A77A'
              : item.responsible?.includes('ประชาสัมพันธ์') || item.responsible === 'มชส.'
              ? '#2583D8'
              : item.responsible?.includes('สาธารณภัย') || item.responsible === 'สภ.'
              ? '#E89B22'
              : '#5B2A86';

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.38,
                delay: index * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={() => onSelectMission(item)}
              className="relative pl-6 sm:pl-7 group cursor-pointer"
            >
              {/* Timeline node (scale 0.7 -> 1) */}
              <motion.div
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.09 + 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute -left-[6px] top-2.5 w-3.5 h-3.5 rounded-full bg-white border-2 shadow-2xs group-hover:scale-125 transition-transform duration-200"
                style={{ borderColor: deptColor }}
              />

              <div className="p-4 rounded-xl liquid-glass-card bpp-card-interactive border border-[rgba(255,255,255,0.7)] group-hover:bg-white group-hover:shadow-xs transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-md border"
                      style={{
                        backgroundColor: `${deptColor}15`,
                        color: deptColor,
                        borderColor: `${deptColor}30`,
                      }}
                    >
                      {item.date}
                    </span>
                    <span className="text-xs text-[#5A5764] font-medium flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-[#8A8792]" />
                      {item.time}
                    </span>
                  </div>
                  <div>{getStatusBadge(item.status)}</div>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-[#2D2A32] group-hover:text-[#5B2A86] transition-colors leading-snug">
                  {item.title}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2.5 text-xs text-[#5A5764]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8A8792] flex-shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#8A8792] flex-shrink-0" />
                    <span className="truncate">{item.attendees}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Shirt className="w-3.5 h-3.5 text-[#8A8792] flex-shrink-0" />
                    <span className="truncate">{item.uniform}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[rgba(40,35,50,0.06)] flex items-center justify-between text-xs text-[#5A5764]">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" style={{ color: deptColor }} />
                    <span>
                      ผู้รับผิดชอบ:{' '}
                      <strong className="text-[#2D2A32] font-semibold">{item.responsible}</strong>
                    </span>
                  </div>
                  <span className="text-[#5B2A86] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    ดูรายละเอียด <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BppMissionTimelineView;
