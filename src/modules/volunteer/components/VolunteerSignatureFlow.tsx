import React from 'react';
import { motion } from 'motion/react';
import {
  FilePlus,
  Send,
  CheckCircle,
  Activity,
  FileText,
  FileCheck2,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useVolunteer } from '../context/VolunteerContext';

export const VolunteerSignatureFlow: React.FC = () => {
  const { missions, setActiveTab, setFilterStatus } = useVolunteer();

  const flowSteps = [
    {
      step: 1,
      title: 'สร้างภารกิจ',
      subtitle: 'วางแผน/ออกคำสั่ง',
      icon: FilePlus,
      statusKey: 'PLANNING',
      count: missions.filter(m => m.workflowStep === 1 || m.status === 'PLANNING').length,
    },
    {
      step: 2,
      title: 'มอบหมาย',
      subtitle: 'ส่งมอบหน่วยปฏิบัติ',
      icon: Send,
      statusKey: 'PENDING_ASSIGNMENT',
      count: missions.filter(m => m.workflowStep === 2 || m.status === 'PENDING_ASSIGNMENT').length,
    },
    {
      step: 3,
      title: 'หน่วยรับทราบ',
      subtitle: 'ยืนยันความพร้อม',
      icon: CheckCircle,
      statusKey: 'PENDING_ASSIGNMENT',
      count: 1,
    },
    {
      step: 4,
      title: 'ปฏิบัติภารกิจ',
      subtitle: 'กำลังพลลงพื้นที่',
      icon: Activity,
      statusKey: 'IN_PROGRESS',
      count: missions.filter(m => m.status === 'IN_PROGRESS').length,
    },
    {
      step: 5,
      title: 'ส่งรายงาน',
      subtitle: 'แนบภาพ/ผล จอ.01',
      icon: FileText,
      statusKey: 'PENDING_REPORT',
      count: missions.filter(m => m.status === 'PENDING_REPORT').length,
    },
    {
      step: 6,
      title: 'ฝอ.5 ตรวจสอบ',
      subtitle: 'พิจารณาอนุมัติ/แก้ไข',
      icon: FileCheck2,
      statusKey: 'PENDING_REVIEW',
      count: missions.filter(m => m.status === 'PENDING_REVIEW').length,
    },
    {
      step: 7,
      title: 'ปิดภารกิจ',
      subtitle: 'บันทึกประวัติ/สถิติ',
      icon: ShieldCheck,
      statusKey: 'COMPLETED',
      count: missions.filter(m => m.status === 'COMPLETED' || m.status === 'CLOSED').length,
    },
  ];

  const handleStepClick = (statusKey: string) => {
    setActiveTab('missions');
    setFilterStatus(statusKey);
  };

  return (
    <div className="mb-6 p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-[rgba(66,167,122,0.25)] shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-[rgba(66,167,122,0.15)]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#42A77A] animate-pulse" />
          <h2 className="text-xs font-bold text-[#25202B] uppercase tracking-wider">
            Volunteer Mission Flow (วงจรการบริหารภารกิจจิตอาสามาตรฐาน ตชด.)
          </h2>
        </div>
        <p className="text-[11px] text-[#6B6973]">
          คลิกขั้นตอนเพื่อกรองภารกิจในกระบวนการทำงาน
        </p>
      </div>

      {/* Interactive 7-Step Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 relative">
        {flowSteps.map((item, index) => {
          const Icon = item.icon;
          const isCompletedStep = item.count > 0;
          const isPending = item.step === 5 || item.step === 6;

          return (
            <motion.div
              key={item.step}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              onClick={() => handleStepClick(item.statusKey)}
              className={`relative p-3 rounded-xl border transition-all duration-200 cursor-pointer text-left ${
                isPending && item.count > 0
                  ? 'bg-[#EAF7F0] border-[#42A77A] shadow-sm'
                  : 'bg-[#F9FBF9] hover:bg-[#EAF7F0]/60 border-[rgba(66,167,122,0.18)] hover:border-[#42A77A]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="w-5 h-5 rounded-full bg-[#42A77A]/15 text-[#2F8A63] text-[10px] font-mono font-bold flex items-center justify-center">
                  0{item.step}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    item.count > 0
                      ? 'bg-[#42A77A] text-white'
                      : 'bg-black/5 text-[#8A8894]'
                  }`}
                >
                  {item.count}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white border border-[rgba(66,167,122,0.2)] flex items-center justify-center text-[#2F8A63] flex-shrink-0 shadow-xs">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#25202B] truncate">{item.title}</p>
                  <p className="text-[10px] text-[#6B6973] truncate">{item.subtitle}</p>
                </div>
              </div>

              {index < flowSteps.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-[#42A77A]/40 pointer-events-none">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
