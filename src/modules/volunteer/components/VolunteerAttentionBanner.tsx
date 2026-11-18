import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, ArrowRight, Clock, FileWarning, CheckCircle2, ChevronRight } from 'lucide-react';
import { useVolunteer } from '../context/VolunteerContext';

export const VolunteerAttentionBanner: React.FC = () => {
  const { attentionItems, filterAttention } = useVolunteer();

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E11D48] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E11D48]" />
          </span>
          <h3 className="text-xs font-bold text-[#25202B] uppercase tracking-wider">
            สิ่งที่ต้องติดตามเร่งด่วน (Action Items)
          </h3>
        </div>
        <span className="text-[11px] text-[#6B6973]">
          ระบบคัดกรองอัตโนมัติตามข้อกำหนด ฝอ.๕
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {attentionItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.04 }}
            onClick={() => filterAttention(item.filterView)}
            className="group relative p-3 rounded-xl bg-white/80 hover:bg-[#EAF7F0]/70 border border-[rgba(66,167,122,0.2)] hover:border-[#42A77A] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
          >
            {/* Top color indicator bar */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ backgroundColor: item.badgeColor }}
            />

            <div className="flex items-center justify-between mt-0.5">
              <span className="text-xl font-bold font-mono text-[#25202B]">
                {item.count}
              </span>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: `${item.badgeColor}15`,
                  color: item.badgeColor,
                }}
              >
                ต้องจัดการ
              </span>
            </div>

            <p className="text-xs font-semibold text-[#25202B] mt-1 line-clamp-1">
              {item.label}
            </p>

            <div className="flex items-center gap-1 text-[11px] text-[#2F8A63] font-medium mt-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
              <span>{item.actionLabel}</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
