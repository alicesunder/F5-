import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { ArrowUpRight, Activity, Clock, CheckCircle2, FileText } from 'lucide-react';

interface GlassStatusCardProps {
  onSelectMetric?: (metricKey: string) => void;
}

export const GlassStatusCard: React.FC<GlassStatusCardProps> = ({ onSelectMetric }) => {
  const { navigate } = useAdmin();
  const [displayCount, setDisplayCount] = useState({
    missionsToday: 0,
    pendingDocs: 0,
    inProgress: 0,
    completed: 0,
  });
  const [lastUpdateTime, setLastUpdateTime] = useState('');

  // Target values as specified in user requirements
  const targetMissionsToday = 24;
  const targetPendingDocs = 8;
  const targetInProgress = 12;
  const targetCompleted = 4;

  // Counter animation on mount
  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const stepTime = 25;
    const steps = duration / stepTime;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      const progress = Math.min(stepCount / steps, 1);
      // Ease out quad
      const eased = progress * (2 - progress);

      setDisplayCount({
        missionsToday: Math.round(eased * targetMissionsToday),
        pendingDocs: Math.round(eased * targetPendingDocs),
        inProgress: Math.round(eased * targetInProgress),
        completed: Math.round(eased * targetCompleted),
      });

      if (progress >= 1) {
        clearInterval(timer);
      }
    }, stepTime);

    // Set real-time Thai hour:minute
    const updateTime = () => {
      const now = new Date();
      setLastUpdateTime(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} น.`
      );
    };
    updateTime();

    return () => clearInterval(timer);
  }, []);

  const metrics = [
    {
      id: 'metric-missions-today',
      label: 'ภารกิจวันนี้',
      enLabel: 'Missions Today',
      value: String(displayCount.missionsToday).padStart(2, '0'),
      actionMenu: 'missions',
      color: 'text-slate-900',
      badge: 'เป้าหมาย 100%',
      icon: Activity,
      borderColor: 'group-hover/item:border-slate-300',
      badgeBg: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'metric-pending-docs',
      label: 'เอกสารรอดำเนินการ',
      enLabel: 'Pending Documents',
      value: String(displayCount.pendingDocs).padStart(2, '0'),
      actionMenu: 'incoming',
      color: 'text-sky-600',
      badge: 'เร่งด่วน 3 รายการ',
      icon: FileText,
      borderColor: 'group-hover/item:border-sky-300',
      badgeBg: 'bg-sky-50 text-sky-700',
    },
    {
      id: 'metric-in-progress',
      label: 'งานที่กำลังดำเนินการ',
      enLabel: 'Tasks In Progress',
      value: String(displayCount.inProgress).padStart(2, '0'),
      actionMenu: 'missions',
      color: 'text-amber-600',
      badge: 'ตามกรอบเวลา',
      icon: Clock,
      borderColor: 'group-hover/item:border-amber-300',
      badgeBg: 'bg-amber-50 text-amber-700',
    },
    {
      id: 'metric-completed',
      label: 'งานเสร็จสิ้น',
      enLabel: 'Completed Tasks',
      value: String(displayCount.completed).padStart(2, '0'),
      actionMenu: 'meetings',
      color: 'text-emerald-600',
      badge: 'ปิดวาระแล้ว',
      icon: CheckCircle2,
      borderColor: 'group-hover/item:border-emerald-300',
      badgeBg: 'bg-emerald-50 text-emerald-700',
    },
  ];

  const handleMetricClick = (menuTarget: string) => {
    if (onSelectMetric) {
      onSelectMetric(menuTarget);
    } else {
      navigate(menuTarget);
    }
  };

  return (
    <div
      id="card-operational-status"
      className="relative w-full rounded-3xl p-5 sm:p-6 backdrop-blur-2xl bg-white/75 border border-white/85 shadow-[0_20px_50px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.03)] text-slate-800 overflow-hidden transition-all duration-300 hover:border-white hover:shadow-[0_25px_60px_rgba(15,23,42,0.11)] group"
    >
      {/* Top Glass Specular Highlight */}
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-sky-200/30 blur-2xl pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

      {/* Card Header: Title + Corner "//01" */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-200/70 pb-3.5 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.6)]" />
          <div>
            <h3 className="text-base font-semibold tracking-tight text-slate-900 font-sans">
              ภาพรวมการปฏิบัติงาน
            </h3>
            <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
              OPERATIONAL STATUS TELEMETRY
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold tracking-widest text-sky-700 px-2.5 py-1 rounded-xl bg-sky-50 border border-sky-200/80">
            // 01
          </span>
        </div>
      </div>

      {/* 4 Status Metric Cells */}
      <div className="grid grid-cols-2 gap-3 relative z-10">
        {metrics.map(m => {
          return (
            <div
              key={m.id}
              id={m.id}
              onClick={() => handleMetricClick(m.actionMenu)}
              className={`group/item p-3.5 rounded-2xl bg-white/65 hover:bg-white border border-slate-200/60 ${m.borderColor} hover:shadow-md transition-all duration-200 cursor-pointer relative overflow-hidden`}
              title={`คลิกเพื่อดูรายละเอียดในระบบ ${m.label}`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xs text-slate-600 font-sans font-medium tracking-wide">
                  {m.label}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-sky-600 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-all" />
              </div>

              {/* Number with Subtle Count-up and Monospace Elegance */}
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span
                  className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${m.color}`}
                >
                  {m.value}
                </span>
                <span className="text-[11px] font-sans text-slate-400">รายการ</span>
              </div>

              {/* Micro Status Chip */}
              <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover/item:bg-sky-500" />
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-medium ${m.badgeBg}`}>
                  {m.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Card Footer: Ready Status + Last Update Time */}
      <div className="relative z-10 mt-4 pt-3.5 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-600 font-sans">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-medium text-emerald-700">ระบบพร้อมใช้งาน</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
          <span>อัปเดตล่าสุด:</span>
          <span className="text-slate-700 font-medium">{lastUpdateTime || '12:45 น.'}</span>
        </div>
      </div>
    </div>
  );
};
