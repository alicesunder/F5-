import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../../../contexts/AdminContext';
import { AnimatedCounter } from '../../../components/common/AnimatedCounter';
import { EnvironmentalHeroBackdrop } from './EnvironmentalHeroBackdrop';
import {
  FO5_DEPARTMENTS_META,
  DepartmentKey,
  UnifiedMission,
  UnifiedReport,
  CentralTaskItem,
  FO5_STRATEGIC_PROJECTS,
} from '../../../data/commandCenterData';
import {
  Clock,
  Radio,
  Building2,
  MapPin,
  Users,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Calendar,
  FileCheck,
  TrendingUp,
  Megaphone,
  ShieldAlert,
  HeartHandshake,
  Settings,
  Download,
  CalendarDays,
  FileSignature,
  User,
  Flame,
  Eye,
  LayoutGrid,
  ListOrdered,
  Zap,
} from 'lucide-react';
import { formatThaiDate } from '../../../utils/formatters';
import { TodayDutyCard } from '../../../components/duty/TodayDutyCard';
import { DueSoonCard } from '../../yearplan/DueSoonCard';

interface OperationalCommandHomeProps {
  missions: UnifiedMission[];
  reports: UnifiedReport[];
  tasks: CentralTaskItem[];
  onSelectMission: (mission: UnifiedMission) => void;
  onSelectReport: (report: UnifiedReport) => void;
}

type WorkspaceTabKey = 'missions' | 'documents' | 'kpi';

const DEPT_VISUAL_THEMES: Record<
  DepartmentKey,
  {
    headerGradient: string;
    cardTint: string;
    borderHover: string;
    glowShadow: string;
    tagline: string;
  }
> = {
  admin: {
    headerGradient: 'linear-gradient(135deg, #5B2A86 0%, #8B46C8 55%, #A855F7 100%)',
    cardTint: 'linear-gradient(180deg, rgba(91,42,134,0.06) 0%, rgba(255,255,255,0.96) 100%)',
    borderHover: 'rgba(91,42,134,0.45)',
    glowShadow: '0 16px 36px -10px rgba(91, 42, 134, 0.25)',
    tagline: 'ศูนย์กลางสารบรรณ งบประมาณ & กำลังพล',
  },
  relations: {
    headerGradient: 'linear-gradient(135deg, #1D68B0 0%, #2583D8 55%, #38BDF8 100%)',
    cardTint: 'linear-gradient(180deg, rgba(37,131,216,0.06) 0%, rgba(255,255,255,0.96) 100%)',
    borderHover: 'rgba(37,131,216,0.45)',
    glowShadow: '0 16px 36px -10px rgba(37, 131, 216, 0.25)',
    tagline: 'สื่อสารภาพลักษณ์ ข่าวสาร & มวลชนสัมพันธ์',
  },
  disaster: {
    headerGradient: 'linear-gradient(135deg, #B45309 0%, #E89B22 55%, #FBBF24 100%)',
    cardTint: 'linear-gradient(180deg, rgba(232,155,34,0.07) 0%, rgba(255,255,255,0.96) 100%)',
    borderHover: 'rgba(232,155,34,0.48)',
    glowShadow: '0 16px 36px -10px rgba(232, 155, 34, 0.25)',
    tagline: 'เฝ้าระวังภัยพิบัติ ฟื้นฟู & พัฒนาชุมชน',
  },
  volunteer: {
    headerGradient: 'linear-gradient(135deg, #047857 0%, #42A77A 55%, #34D399 100%)',
    cardTint: 'linear-gradient(180deg, rgba(66,167,122,0.07) 0%, rgba(255,255,255,0.96) 100%)',
    borderHover: 'rgba(66,167,122,0.48)',
    glowShadow: '0 16px 36px -10px rgba(66, 167, 122, 0.25)',
    tagline: 'จิตอาสาพระราชทาน 904 & บำเพ็ญประโยชน์',
  },
};

const NO_MISSION: UnifiedMission = {
  id: '',
  missionCode: '-',
  title: 'ยังไม่มีภารกิจที่กำลังปฏิบัติการ',
  primaryDepartment: 'admin',
  supportingDepartments: [],
  date: '',
  time: '-',
  location: '-',
  province: '-',
  responsibleOfficer: '',
  targetUnit: '-',
  participantsCount: 0,
  attire: '-',
  status: 'สร้าง',
  description: 'เมื่อมีการสร้างภารกิจในระบบ ภารกิจที่กำลังดำเนินการจะแสดงที่นี่',
  deadlineDate: '',
  hasReport: false,
  imagesCount: 0,
  documentsCount: 0,
};

const isoDay = (d: Date) => {
  const z = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
};
const TODAY_ISO = isoDay(new Date());
const DAY_NAMES = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
const WEEK_STRIP = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - 3 + i);
  return { date: isoDay(d), dayNum: String(d.getDate()), dayName: DAY_NAMES[d.getDay()], isToday: i === 3 };
});

export const OperationalCommandHome: React.FC<OperationalCommandHomeProps> = ({
  missions,
  reports,
  tasks,
  onSelectMission,
  onSelectReport,
}) => {
  const { navigateModule, incomingDocs, currentUser } = useAdmin();

  const [focusedRadarDept, setFocusedRadarDept] = useState<DepartmentKey>('admin');
  const [quickPeekDept, setQuickPeekDept] = useState<DepartmentKey | null>(null);
  const [timelineDeptFilter, setTimelineDeptFilter] = useState<DepartmentKey | 'all'>('all');
  const [missionViewMode, setMissionViewMode] = useState<'timeline' | 'bento'>('bento');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(TODAY_ISO);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<WorkspaceTabKey>('missions');
  const [selectedActiveMissionId, setSelectedActiveMissionId] = useState<string | null>(null);

  // Filtered missions for the timeline section
  const filteredMissions = useMemo(() => {
    if (timelineDeptFilter === 'all') return missions;
    return missions.filter(
      m =>
        m.primaryDepartment === timelineDeptFilter ||
        m.supportingDepartments.includes(timelineDeptFilter)
    );
  }, [missions, timelineDeptFilter]);

  // Active missions list ("ดำเนินการ")
  const runningMissions = useMemo(
    () => missions.filter(m => m.status === 'ดำเนินการ'),
    [missions]
  );

  // Current highlighted active mission
  const activeMission = useMemo(() => {
    if (selectedActiveMissionId) {
      const found = missions.find(m => m.id === selectedActiveMissionId);
      if (found) return found;
    }
    return runningMissions[0] || missions[0] || NO_MISSION;
  }, [missions, runningMissions, selectedActiveMissionId]);

  const nowDeptMeta = FO5_DEPARTMENTS_META[activeMission.primaryDepartment];
  const radarDeptMeta = FO5_DEPARTMENTS_META[focusedRadarDept];

  // Resilient news items
  const newsItems = useMemo(
    () => [] as Array<{ id: string; title: string; date: string; category: string; departmentKey: DepartmentKey; summary: string }>,
    []
  );

  // Official documents list
  const documentItems = useMemo(() => {
    if (incomingDocs && incomingDocs.length > 0) {
      return incomingDocs.slice(0, 4).map(d => ({
        id: d.incoming_id,
        code: d.book_number,
        title: d.subject,
        type: d.document_type || 'PDF',
        date: d.received_date,
        size: d.attachment_size || '',
        publisher: d.sender,
        urgency: d.urgency,
      }));
    }
    return [];
  }, [incomingDocs]);

  // Urgent Action Items
  const attentionItems = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      departmentKey: DepartmentKey;
      statusText: string;
      statusColor: string;
      description: string;
      unit: string;
      actionLabel: string;
      onClick: () => void;
    }> = [];

    const pendingReport = reports.find(r => r.status === 'รอตรวจ');
    if (pendingReport) {
      list.push({
        id: 'att-1',
        title: 'รายงานผล จอ.01 รอการตรวจรับรอง',
        departmentKey: pendingReport.departmentKey,
        statusText: 'รอตรวจรับรอง',
        statusColor: '#F59E0B',
        description: pendingReport.missionTitle,
        unit: pendingReport.submittingUnit,
        actionLabel: 'ตรวจรับรอง',
        onClick: () => onSelectReport(pendingReport),
      });
    }

    const revisionReport = reports.find(r => r.status === 'ขอแก้ไข');
    if (revisionReport) {
      list.push({
        id: 'att-2',
        title: 'รายงานขอแก้ไขเพิ่มเติม (หลักฐานยังไม่ครบ)',
        departmentKey: revisionReport.departmentKey,
        statusText: 'ขอแก้ไขด่วน',
        statusColor: '#EF4444',
        description: revisionReport.revisionReason || 'ขาดภาพถ่ายเชิงประจักษ์',
        unit: revisionReport.submittingUnit,
        actionLabel: 'เปิดดูรายงาน',
        onClick: () => onSelectReport(revisionReport),
      });
    }

    const urgentTask = tasks.find(t => t.urgency === 'เกินกำหนด' || t.urgency === 'เร่งด่วน');
    if (urgentTask) {
      list.push({
        id: 'att-3',
        title: urgentTask.title,
        departmentKey: urgentTask.departmentKey,
        statusText: urgentTask.urgency === 'เกินกำหนด' ? 'เกินกำหนด' : 'เร่งด่วน 24 ชม.',
        statusColor: urgentTask.urgency === 'เกินกำหนด' ? '#EF4444' : '#F59E0B',
        description: `กำหนดส่ง: ${urgentTask.deadlineDate} · ${urgentTask.responsibleOfficer}`,
        unit: urgentTask.targetUnit,
        actionLabel: 'จัดการงานด่วน',
        onClick: () => navigateModule('task-center'),
      });
    }


    return list.slice(0, 4);
  }, [reports, tasks, onSelectReport, navigateModule]);

  const todayMissionsCount = missions.filter(m => m.date === TODAY_ISO).length;
  const totalParticipants = missions.reduce((a, m) => a + m.participantsCount, 0);

  return (
    <div className="w-full pb-16 space-y-8 select-none iridescent-ambient liquid-glass-card rounded-3xl p-0 sm:p-6 max-sm:!bg-transparent max-sm:!border-0 max-sm:!shadow-none max-sm:!backdrop-filter-none">
      {/* ========================================================================= */}
      {/* ROW 1: PANORAMIC COMMAND STUDIO HERO & RADIAL ENERGY DIAL                 */}
      {/* ========================================================================= */}
      <section
        aria-label="ศูนย์บัญชาการอัจฉริยะ ฝอ.5"
        className="relative rounded-3xl overflow-hidden border border-white/25 dark:border-white/10 shadow-[0_20px_50px_rgba(91,42,134,0.16)] text-white"
      >
        {/* Panoramic SVG Environmental Art Backdrop */}
        <EnvironmentalHeroBackdrop className="opacity-95" />

        {/* Clean Royal Aurora Gradient Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(125deg, rgba(91,42,134,0.88) 0%, rgba(45,38,107,0.80) 48%, rgba(37,131,216,0.72) 100%)',
          }}
        />

        {/* Subtle Glowing Orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 left-1/3 w-80 h-80 rounded-full bg-sky-400/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 p-4 sm:p-8 space-y-5 sm:space-y-6">
          {/* Top Bar inside Hero: Live Status + Date */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/15">
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/15 backdrop-blur-md font-bold text-white border border-white/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>FO5 COMMAND STUDIO</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/20 backdrop-blur-md font-mono text-white/90">
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                {formatThaiDate(new Date().toISOString().slice(0, 10))}
              </span>
            </div>

            <span className="text-xs font-semibold text-white/85">
              กองบังคับการอำนวยการ กองบัญชาการตำรวจตระเวนชายแดน
            </span>
          </div>

          {/* Main Asymmetric Split: Left Greeting & Quick Launch / Right Interactive 4-Dept Radial Energy Dial */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
            {/* Left 7 Cols */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 tracking-wide">
                  <Sparkles className="w-4 h-4" />
                  <span>ศูนย์ปฏิบัติการดิจิทัล ฝ่ายอำนวยการ 5 (บก.อก.บช.ตชด.)</span>
                </div>
                <h1 className="text-xl sm:text-4xl font-black tracking-tight text-white leading-tight drop-shadow-sm break-words">
                  สวัสดี, {currentUser?.rank} {currentUser?.name}
                </h1>
                <p className="text-xs sm:text-sm text-white/85 max-w-2xl leading-relaxed">
                  ศูนย์กลางเชื่อมโยงข้อมูล 4 สายงานหลักและ หน่วย ตชด. คลิกเลือกสายงานด้านล่างเพื่อเข้าสู่ระบบปฏิบัติงาน หรือตรวจสอบงานด่วนประจำวันได้ทันที
                </p>
              </div>

              {/* Focused Core Action Bar */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigateModule('my-space')}
                  className="px-4 py-2.5 rounded-2xl bg-white text-[#5B2A86] hover:bg-purple-50 text-xs font-extrabold transition cursor-pointer flex items-center gap-2 shadow-lg shadow-black/15"
                >
                  <User className="w-4 h-4 text-[#2583D8]" />
                  <span>พื้นที่ส่วนตัว (MY SPACE)</span>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigateModule('task-center')}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-xs font-extrabold transition cursor-pointer flex items-center gap-2 shadow-lg shadow-amber-950/20"
                >
                  <Flame className="w-4 h-4 text-slate-950" />
                  <span>ศูนย์งานด่วน & ติดตาม หน่วย ตชด. ({tasks.length})</span>
                </motion.button>
              </div>
            </div>

            {/* Right 5 Cols: Interactive 4-Department Radial Energy Studio */}
            <div className="lg:col-span-5 bg-black/25 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-white/20 shadow-inner">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>ภาพรวมความก้าวหน้า 4 สายงาน</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-300/90 text-slate-900">
                  ข้อมูลตัวอย่าง
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Interactive Concentric SVG Rings */}
                <div className="sm:col-span-5 flex items-center justify-center relative">
                  <svg className="w-36 h-36 -rotate-90 overflow-visible" viewBox="0 0 140 140">
                    {(
                      [
                        { key: 'admin' as DepartmentKey, r: 58, color: '#C084FC' },
                        { key: 'relations' as DepartmentKey, r: 46, color: '#38BDF8' },
                        { key: 'disaster' as DepartmentKey, r: 34, color: '#FBBF24' },
                        { key: 'volunteer' as DepartmentKey, r: 22, color: '#34D399' },
                      ] as const
                    ).map(ring => {
                      const dept = FO5_DEPARTMENTS_META[ring.key];
                      const circumference = 2 * Math.PI * ring.r;
                      const dashOffset =
                        circumference - (dept.progressPercent / 100) * circumference;
                      const isFocused = focusedRadarDept === ring.key;

                      return (
                        <g
                          key={ring.key}
                          onClick={() => setFocusedRadarDept(ring.key)}
                          className="cursor-pointer transition-opacity"
                        >
                          <circle
                            cx="70"
                            cy="70"
                            r={ring.r}
                            fill="none"
                            stroke="rgba(255,255,255,0.14)"
                            strokeWidth={isFocused ? 8 : 6}
                          />
                          <circle
                            cx="70"
                            cy="70"
                            r={ring.r}
                            fill="none"
                            stroke={ring.color}
                            strokeWidth={isFocused ? 8 : 6}
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                            className="transition-all duration-700"
                          />
                        </g>
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-base font-black font-mono tabular-nums text-white">
                      {radarDeptMeta.progressPercent}%
                    </span>
                    <span className="text-[9px] text-white/80 font-bold">
                      ความสำเร็จ
                    </span>
                  </div>
                </div>

                {/* Department Selector Pills + Direct Launch */}
                <div className="sm:col-span-7 space-y-2">
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['admin', 'relations', 'disaster', 'volunteer'] as DepartmentKey[]).map(
                      deptKey => {
                        const d = FO5_DEPARTMENTS_META[deptKey];
                        const isSelected = focusedRadarDept === deptKey;
                        return (
                          <button
                            key={deptKey}
                            type="button"
                            onMouseEnter={() => setFocusedRadarDept(deptKey)}
                            onClick={() => setFocusedRadarDept(deptKey)}
                            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-left transition cursor-pointer flex items-center gap-1.5 truncate border ${
                              isSelected
                                ? 'bg-white text-slate-900 border-white shadow-sm'
                                : 'bg-white/10 text-white/85 border-white/10 hover:bg-white/20'
                            }`}
                          >
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: d.color }}
                            />
                            <span className="truncate">{d.name.replace('งาน', '')}</span>
                          </button>
                        );
                      }
                    )}
                  </div>

                  {/* Active Radar Info Box */}
                  <div className="p-3 rounded-2xl bg-white/12 border border-white/15 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-white truncate">
                        {radarDeptMeta.name}
                      </span>
                      <span className="text-[11px] font-mono tabular-nums text-amber-300 font-bold">
                        {radarDeptMeta.activeCount} งานสด
                      </span>
                    </div>
                    <p className="text-[11px] text-white/80 truncate">
                      หัวหน้าสายงาน: {radarDeptMeta.leadOfficer || 'ยังไม่ได้ระบุ'}
                    </p>
                    <button
                      type="button"
                      onClick={() => navigateModule(focusedRadarDept)}
                      className="w-full mt-1 py-1.5 px-3 rounded-xl bg-white text-slate-900 hover:bg-amber-300 text-[11px] font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>เข้าสู่ {radarDeptMeta.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 4 Colorful Glass KPI Tiles inside Hero */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              onClick={() => navigateModule('calendar')}
              className="p-4 rounded-2xl bg-white/14 hover:bg-white/22 backdrop-blur-md border border-white/20 text-left transition cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs text-purple-200 font-bold">
                <span>ภารกิจวันนี้</span>
                <CalendarDays className="w-4 h-4 text-purple-200 group-hover:scale-110 transition-transform" />
              </div>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-white">
                  <AnimatedCounter value={todayMissionsCount} />
                </span>
                <span className="text-xs text-white/80">ภารกิจ</span>
              </div>
              <div className="mt-1 text-[11px] text-white/75 font-mono tabular-nums">
                กำลังพลรวม {totalParticipants.toLocaleString()} นาย
              </div>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              onClick={() => {
                setActiveWorkspaceTab('missions');
                const el = document.getElementById('workspace-tabs-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-4 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 backdrop-blur-md border border-emerald-300/30 text-left transition cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs text-emerald-200 font-bold">
                <span>กำลังปฏิบัติการสด</span>
                <Radio className="w-4 h-4 text-emerald-300 animate-pulse" />
              </div>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-emerald-300">
                  <AnimatedCounter value={runningMissions.length} />
                </span>
                <span className="text-xs text-emerald-100">รายการสด</span>
              </div>
              <div className="mt-1 text-[11px] text-emerald-100/85 truncate">
                จากภารกิจทั้งหมด {missions.length} รายการ
              </div>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              onClick={() => navigateModule('task-center')}
              className="p-4 rounded-2xl bg-amber-500/25 hover:bg-amber-500/35 backdrop-blur-md border border-amber-300/35 text-left transition cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs text-amber-200 font-bold">
                <span>งานด่วน / รอตรวจรับรอง</span>
                <Flame className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
              </div>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-amber-300">
                  <AnimatedCounter value={attentionItems.length} />
                </span>
                <span className="text-xs text-amber-100">เรื่องเร่งด่วน</span>
              </div>
              <div className="mt-1 text-[11px] text-amber-100/90 truncate">
                คลิกเพื่อตรวจรับรองและสั่งการทันที
              </div>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              onClick={() => navigateModule('documents')}
              className="p-4 rounded-2xl bg-sky-500/20 hover:bg-sky-500/30 backdrop-blur-md border border-sky-300/30 text-left transition cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs text-sky-200 font-bold">
                <span>คลังเอกสารราชการ</span>
                <FileSignature className="w-4 h-4 text-sky-300 group-hover:scale-110 transition-transform" />
              </div>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-sky-200">
                  <AnimatedCounter value={documentItems.length} />
                </span>
                <span className="text-xs text-sky-100">ฉบับล่าสุด</span>
              </div>
              <div className="mt-1 text-[11px] text-sky-100/85 truncate">
                หนังสือรับ-ส่ง & แบบฟอร์ม สถ.
              </div>
            </motion.button>
          </div>
        </div>
      </section>

      <TodayDutyCard />

      <DueSoonCard />

      {/* ========================================================================= */}
      {/* ROW 2: 4 COLORFUL DEPARTMENT PORTAL CARDS WITH QUICK-PEEK & DIRECT LAUNCH */}
      {/* ========================================================================= */}
      <section aria-label="ทางเข้าสู่ระบบ 4 สายงานหลัก" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#5B2A86] dark:text-purple-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PORTAL GATEWAY · 4 สายงานหลัก</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              เลือกสายงานเพื่อเข้าสู่ระบบปฏิบัติการ
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            กดที่การ์ดเพื่อเข้าสู่หน้าระบบทันที หรือกดปุ่ม <strong className="text-slate-700 dark:text-slate-200">"ส่องงาน"</strong> เพื่อดูตัวอย่างงานสด
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {(['admin', 'relations', 'disaster', 'volunteer'] as DepartmentKey[]).map(key => {
            const dept = FO5_DEPARTMENTS_META[key];
            const theme = DEPT_VISUAL_THEMES[key];
            const deptMissions = missions.filter(m => m.primaryDepartment === key);
            const activeCount = deptMissions.filter(m => m.status === 'ดำเนินการ').length;
            const isPeeking = quickPeekDept === key;

            const iconMap = {
              admin: Settings,
              relations: Megaphone,
              disaster: ShieldAlert,
              volunteer: HeartHandshake,
            };
            const DeptIcon = iconMap[key];

            const radius = 22;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset =
              circumference - (dept.progressPercent / 100) * circumference;

            return (
              <motion.div
                key={key}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="group relative rounded-3xl overflow-hidden liquid-glass-card iridescent-edge flex flex-col justify-between transition-all"
                style={{
                  boxShadow: theme.glowShadow,
                }}
              >
                {/* Colorful Gradient Top Header Banner (Clickable to enter department) */}
                <div
                  onClick={() => navigateModule(key)}
                  className="relative p-5 text-white cursor-pointer overflow-hidden"
                  style={{ background: theme.headerGradient }}
                >
                  <DeptIcon className="absolute -right-4 -bottom-4 w-28 h-28 text-white/15 rotate-12 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 pointer-events-none" />

                  <div className="relative z-10 flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      <DeptIcon className="w-6 h-6 text-white" />
                    </div>

                    <div className="relative w-14 h-14 flex items-center justify-center">
                      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                        <circle
                          cx="28"
                          cy="28"
                          r={radius}
                          fill="none"
                          stroke="rgba(255,255,255,0.25)"
                          strokeWidth="4.5"
                        />
                        <circle
                          cx="28"
                          cy="28"
                          r={radius}
                          fill="none"
                          stroke="#FFFFFF"
                          strokeWidth="4.5"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                        />
                      </svg>
                      <span className="absolute text-[11px] font-mono tabular-nums font-black text-white">
                        {dept.progressPercent}%
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 mt-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/80 block">
                      {dept.shortName}
                    </span>
                    <h3 className="text-lg font-black text-white leading-snug mt-0.5">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-white/90 mt-1 line-clamp-1">
                      {theme.tagline}
                    </p>
                  </div>
                </div>

                {/* Card Body: Stats + Interactive Quick Peek */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div
                      onClick={() => navigateModule(key)}
                      className="grid grid-cols-2 gap-2.5 cursor-pointer"
                    >
                      <div
                        className="p-3 rounded-2xl border transition-colors"
                        style={{
                          backgroundColor: `${dept.color}0D`,
                          borderColor: `${dept.color}25`,
                        }}
                      >
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">
                          ภารกิจทั้งหมด
                        </span>
                        <strong
                          className="dept-ink text-base font-mono tabular-nums font-black"
                          style={{ '--c': dept.color } as React.CSSProperties}
                        >
                          {dept.missionCount} งาน
                        </strong>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/70 dark:border-white/10">
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">
                          ทำอยู่ / รอตรวจ
                        </span>
                        <strong className="text-base font-mono tabular-nums font-black text-slate-900 dark:text-white">
                          {activeCount} / {dept.pendingReports}
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-0.5">
                      <span>ผู้รับผิดชอบหลัก:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {dept.leadOfficer || 'ยังไม่ได้ระบุ'}
                      </span>
                    </div>

                    <AnimatePresence initial={false}>
                      {isPeeking && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div
                            className="p-3 rounded-2xl space-y-2 border text-xs"
                            style={{
                              backgroundColor: `${dept.color}0A`,
                              borderColor: `${dept.color}30`,
                            }}
                          >
                            <div className="font-extrabold text-slate-800 dark:text-white flex items-center justify-between">
                              <span>ตัวอย่างภารกิจล่าสุด</span>
                              <span
                                className="font-mono text-[10px]"
                                style={{ color: dept.color }}
                              >
                                คลิกเพื่อดู
                              </span>
                            </div>
                            {deptMissions.slice(0, 2).map(m => (
                              <button
                                key={m.id}
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  onSelectMission(m);
                                }}
                                className="w-full text-left p-2 rounded-xl bg-white dark:bg-[#1B202E] hover:shadow-xs border border-slate-200/70 dark:border-white/10 transition cursor-pointer block"
                              >
                                <div className="font-bold text-slate-800 dark:text-slate-100 truncate text-[11px]">
                                  {m.title}
                                </div>
                                <div className="text-[10px] text-slate-500 flex items-center justify-between mt-0.5">
                                  <span>{m.targetUnit}</span>
                                  <span style={{ color: dept.color }}>{m.status}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Card Footer: Quick Peek Toggle + Primary Launch Button */}
                  <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setQuickPeekDept(prev => (prev === key ? null : key));
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200/80 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition cursor-pointer flex items-center gap-1 shrink-0"
                      title="ส่องตัวอย่างภารกิจของสายงานนี้"
                    >
                      <Eye className="w-3.5 h-3.5" style={{ color: dept.color }} />
                      <span>{isPeeking ? 'ซ่อน' : 'ส่องงาน'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateModule(key)}
                      className="flex-1 py-2 px-3 rounded-xl text-xs font-extrabold text-white shadow-sm hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-1.5"
                      style={{ background: theme.headerGradient }}
                    >
                      <span>เข้าสู่ระบบสายงาน</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ROW 3: LIVE MISSION SPOTLIGHT & URGENT ACTION RADAR                       */}
      {/* ========================================================================= */}
      <section
        aria-label="ภารกิจสดและงานด่วนวันนี้"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
      >
        {/* Left 7 Cols: Live Field Mission Spotlight */}
        <div className="lg:col-span-7 liquid-glass-card iridescent-edge rounded-3xl p-4 sm:p-6 flex flex-col justify-between space-y-5 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{ backgroundColor: nowDeptMeta.color }}
          />

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Radio className="w-4 h-4 animate-pulse" />
                </span>
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                    ภารกิจภาคสนามที่กำลังปฏิบัติการสด (LIVE NOW)
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    ติดตามขั้นตอนและสถานะการปฏิบัติงานของหน่วยในพื้นที่
                  </p>
                </div>
              </div>

              {runningMissions.length > 1 && (
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                  {runningMissions.map((rm, idx) => {
                    const isSelected = rm.id === activeMission.id;
                    const rmMeta = FO5_DEPARTMENTS_META[rm.primaryDepartment];
                    return (
                      <button
                        key={rm.id}
                        type="button"
                        onClick={() => setSelectedActiveMissionId(rm.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                          isSelected
                            ? 'bg-white dark:bg-[#222838] text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: rmMeta.color }}
                        />
                        <span>ภารกิจสด #{idx + 1}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span
                  className="px-2.5 py-0.5 rounded-lg font-extrabold text-white"
                  style={{ backgroundColor: nowDeptMeta.color }}
                >
                  {nowDeptMeta.name}
                </span>
                <span className="font-mono tabular-nums font-bold text-slate-500 dark:text-slate-400">
                  รหัส {activeMission.missionCode}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-bold">
                  กำลังปฏิบัติการในพื้นที่
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                {activeMission.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeMission.description}
              </p>
            </div>

            {/* 4-Step Mission Progress Visualizer */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 via-purple-50/40 to-sky-50/40 dark:from-white/[0.03] dark:to-white/[0.05] border border-slate-200/70 dark:border-white/10">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-2">
                <span>สถานะการขับเคลื่อนภารกิจ 4 ขั้นตอน</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  ขั้นตอนที่ 3 / 4 (75%)
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { step: '1. เตรียมกำลังพล', done: true },
                  { step: '2. ลงพื้นที่จริง', done: true },
                  { step: '3. ปฏิบัติการสด', active: true },
                  { step: '4. สรุปผลรับรอง', done: false },
                ].map((st, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-xl text-center border text-[11px] font-bold transition-all ${
                      st.active
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                        : st.done
                        ? 'bg-white dark:bg-white/10 text-slate-800 dark:text-slate-200 border-emerald-300 dark:border-emerald-500/30'
                        : 'bg-white/50 dark:bg-white/[0.02] text-slate-400 border-slate-200/60 dark:border-white/5'
                    }`}
                  >
                    <span className="truncate block">{st.step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4 Key Operational Facts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-semibold">
                  <Clock className="w-3 h-3 text-[#5B2A86]" />
                  <span>เวลาปฏิบัติการ</span>
                </span>
                <strong className="text-xs font-mono tabular-nums font-extrabold text-slate-900 dark:text-white block mt-1 truncate">
                  {activeMission.time}
                </strong>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-semibold">
                  <MapPin className="w-3 h-3 text-rose-500" />
                  <span>พิกัดพื้นที่</span>
                </span>
                <strong className="text-xs font-extrabold text-slate-900 dark:text-white block mt-1 truncate">
                  {activeMission.location}, {activeMission.province}
                </strong>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-semibold">
                  <Building2 className="w-3 h-3 text-[#2583D8]" />
                  <span>หน่วยรับผิดชอบ</span>
                </span>
                <strong className="text-xs font-extrabold text-slate-900 dark:text-white block mt-1 truncate">
                  {activeMission.targetUnit}
                </strong>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-semibold">
                  <Users className="w-3 h-3 text-emerald-600" />
                  <span>กำลังพล</span>
                </span>
                <strong className="text-xs font-mono tabular-nums font-extrabold text-slate-900 dark:text-white block mt-1">
                  {activeMission.participantsCount} นาย
                </strong>
              </div>
            </div>
          </div>

          {/* Clean Operational Action Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              การแต่งกาย: <strong className="text-slate-700 dark:text-slate-200">{activeMission.attire}</strong>
            </span>

            <div className="flex items-center gap-2">
              {activeMission.hasReport && (
                <button
                  type="button"
                  onClick={() => {
                    const rep = reports.find(r => r.id === activeMission.reportId);
                    if (rep) onSelectReport(rep);
                  }}
                  className="px-3.5 py-2 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                >
                  <FileCheck className="w-3.5 h-3.5 text-[#5B2A86] dark:text-[#B3A0E8]" />
                  <span>ตรวจรายงานผล</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => activeMission.id && onSelectMission(activeMission)}
                className="px-4 py-2 rounded-2xl text-xs font-extrabold text-white transition cursor-pointer flex items-center gap-1.5 shadow-md hover:opacity-95 whitespace-nowrap"
                style={{ backgroundColor: nowDeptMeta.color }}
              >
                <span>เปิดดูภารกิจฉบับเต็ม</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Urgent Action Radar */}
        <div className="lg:col-span-5 liquid-glass-card iridescent-edge rounded-3xl p-4 sm:p-6 flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-[#5B2A86]" />

          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                    เรดาร์งานด่วน & รอตรวจรับรอง
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    คลิกที่การ์ดเพื่อสั่งการหรือรับรองผลทันที
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigateModule('task-center')}
                className="text-xs font-extrabold text-[#5B2A86] dark:text-[#B3A0E8] hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <span>ดูทั้งหมด</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {attentionItems.map(item => {
                const dept = FO5_DEPARTMENTS_META[item.departmentKey];
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ x: 4 }}
                    onClick={item.onClick}
                    className="p-3.5 rounded-2xl bg-slate-50/90 hover:bg-white dark:bg-white/[0.03] dark:hover:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/40 shadow-2xs transition-all cursor-pointer group flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 text-[11px]">
                        <span
                          className="font-extrabold"
                          style={{ color: dept.color }}
                        >
                          {dept.name}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span
                          className="font-extrabold"
                          style={{ color: item.statusColor }}
                        >
                          {item.statusText}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-[#5B2A86] dark:group-hover:text-[#B3A0E8] transition-colors truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {item.description} ({item.unit})
                      </p>
                    </div>

                    <span
                      className="px-3 py-1.5 rounded-xl text-[11px] font-extrabold text-white shrink-0 flex items-center gap-1 shadow-2xs group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: dept.color }}
                    >
                      <span>{item.actionLabel}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-500">
            <span>อัปเดตสถานะจาก หน่วย ตชด.</span>
            <button
              type="button"
              onClick={() => navigateModule('bpp-tracker')}
              className="font-extrabold text-[#5B2A86] dark:text-[#B3A0E8] hover:underline cursor-pointer whitespace-nowrap"
            >
              ติดตามการส่งงาน หน่วย ตชด. →
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ROW 4: WORKSPACE STUDIO TABS (TIMELINE / BENTO / DOCS / KPI)              */}
      {/* ========================================================================= */}
      <section
        id="workspace-tabs-section"
        aria-label="สตูดิโอข้อมูลปฏิบัติการและสถิติเชิงลึก"
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 liquid-glass-card p-2.5 rounded-3xl">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              {
                id: 'missions' as WorkspaceTabKey,
                label: 'ตารางภารกิจ & ปฏิทิน',
                icon: CalendarDays,
                badge: `${missions.length} งาน`,
                gradient: 'linear-gradient(135deg, #5B2A86 0%, #7C3AED 100%)',
              },
              {
                id: 'documents' as WorkspaceTabKey,
                label: 'คลังเอกสาร & ข่าวประชาสัมพันธ์',
                icon: FileSignature,
                badge: `${documentItems.length + newsItems.length} รายการ`,
                gradient: 'linear-gradient(135deg, #1D68B0 0%, #38BDF8 100%)',
              },
              {
                id: 'kpi' as WorkspaceTabKey,
                label: 'ความก้าวหน้าแผนงานประจำปี',
                icon: TrendingUp,
                badge: 'ไตรมาส 4',
                gradient: 'linear-gradient(135deg, #059669 0%, #34D399 100%)',
              },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeWorkspaceTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveWorkspaceTab(tab.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'text-white shadow-md scale-[1.01]'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                  style={isActive ? { background: tab.gradient } : undefined}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-mono tabular-nums px-2 py-0.5 rounded-lg ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeWorkspaceTab === 'missions' && (
            <motion.div
              key="tab-missions"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left 7 Cols: Interactive Mission Explorer */}
              <div className="lg:col-span-7 liquid-glass-card rounded-3xl p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/10">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                      สำรวจภารกิจบูรณาการ 4 สายงาน
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      เลือกกรองตามสายงาน หรือสลับมุมมองการ์ด / ไทม์ไลน์
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setMissionViewMode('bento')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                        missionViewMode === 'bento'
                          ? 'bg-white dark:bg-[#23293A] text-[#5B2A86] dark:text-white shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>การ์ดสีสัน</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMissionViewMode('timeline')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                        missionViewMode === 'timeline'
                          ? 'bg-white dark:bg-[#23293A] text-[#5B2A86] dark:text-white shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                      <span>ไทม์ไลน์</span>
                    </button>
                  </div>
                </div>

                {/* Department Filter Bar */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTimelineDeptFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      timelineDeptFilter === 'all'
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70'
                    }`}
                  >
                    ทุกสายงาน ({missions.length})
                  </button>
                  {(['admin', 'relations', 'disaster', 'volunteer'] as DepartmentKey[]).map(
                    key => {
                      const d = FO5_DEPARTMENTS_META[key];
                      const active = timelineDeptFilter === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setTimelineDeptFilter(key)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                            active
                              ? 'text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200/70'
                          }`}
                          style={active ? { backgroundColor: d.color } : undefined}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: active ? '#FFFFFF' : d.color }}
                          />
                          <span>{d.name}</span>
                        </button>
                      );
                    }
                  )}
                </div>

                {/* Mission Items View */}
                {missionViewMode === 'bento' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {filteredMissions.slice(0, 6).map(mission => {
                      const primaryMeta = FO5_DEPARTMENTS_META[mission.primaryDepartment];
                      const isRunning = mission.status === 'ดำเนินการ';
                      return (
                        <motion.div
                          key={mission.id}
                          whileHover={{ y: -3 }}
                          onClick={() => onSelectMission(mission)}
                          className="p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 group"
                          style={{
                            background: `linear-gradient(145deg, ${primaryMeta.color}0D 0%, rgba(255,255,255,0.95) 100%)`,
                          }}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span
                                className="font-extrabold"
                                style={{ color: primaryMeta.color }}
                              >
                                {primaryMeta.name}
                              </span>
                              <span
                                className={`font-mono font-bold px-2 py-0.5 rounded-md text-[10px] ${
                                  isRunning
                                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-slate-200/70 text-slate-600'
                                }`}
                              >
                                {mission.status}
                              </span>
                            </div>
                            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-[#5B2A86] transition-colors line-clamp-2">
                              {mission.title}
                            </h4>
                          </div>

                          <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500">
                            <span className="truncate">{mission.targetUnit}</span>
                            <span className="font-mono tabular-nums font-bold text-slate-700 dark:text-slate-300">
                              {mission.time}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-white/10">
                    {filteredMissions.slice(0, 6).map(mission => {
                      const primaryMeta = FO5_DEPARTMENTS_META[mission.primaryDepartment];
                      const isDone = mission.status === 'เสร็จสิ้น';
                      const isRunning = mission.status === 'ดำเนินการ';
                      return (
                        <div
                          key={mission.id}
                          onClick={() => onSelectMission(mission)}
                          className="py-3.5 first:pt-1 last:pb-1 hover:bg-slate-50/80 dark:hover:bg-white/[0.03] -mx-2 px-2 rounded-xl transition cursor-pointer group flex items-start justify-between gap-4"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div
                              className="w-2.5 h-10 rounded-full shrink-0 mt-0.5"
                              style={{ backgroundColor: primaryMeta.color }}
                            />
                            <div className="space-y-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                                <span
                                  className="font-extrabold"
                                  style={{ color: primaryMeta.color }}
                                >
                                  {primaryMeta.name}
                                </span>
                                <span aria-hidden="true" className="text-slate-300">·</span>
                                <span className="font-mono tabular-nums text-slate-500">
                                  {mission.date} ({mission.time})
                                </span>
                                <span aria-hidden="true" className="text-slate-300">·</span>
                                <span
                                  className={`font-bold ${
                                    isDone
                                      ? 'text-slate-500'
                                      : isRunning
                                      ? 'text-emerald-600'
                                      : 'text-amber-600'
                                  }`}
                                >
                                  {mission.status}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#5B2A86] transition-colors truncate">
                                {mission.title}
                              </h4>
                              <p className="text-xs text-slate-500 truncate">
                                {mission.location}, {mission.province} · {mission.targetUnit}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#5B2A86] shrink-0 self-center" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right 5 Cols: Weekly Calendar & Duty Roster */}
              <div className="lg:col-span-5 liquid-glass-card rounded-3xl p-4 sm:p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                        ปฏิทินภารกิจรายสัปดาห์
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        คลิกเลือกวันที่เพื่อดูภารกิจและตารางเวรประจำวัน
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigateModule('calendar')}
                      className="text-xs font-extrabold text-[#5B2A86] dark:text-[#B3A0E8] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>ปฏิทินเต็ม</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 7-Day Interactive Strip */}
                  <div className="grid grid-cols-7 gap-1.5">
                    {WEEK_STRIP.map(d => {
                      const dayMissions = missions.filter(m => m.date === d.date);
                      const isSelected = selectedCalendarDate === d.date;
                      return (
                        <button
                          key={d.date}
                          type="button"
                          onClick={() => setSelectedCalendarDate(d.date)}
                          className={`py-2.5 px-1 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-gradient-to-b from-[#5B2A86] to-[#7C3AED] text-white border-transparent shadow-md scale-105'
                              : d.isToday
                              ? 'bg-purple-50 dark:bg-purple-950/30 text-[#5B2A86] dark:text-purple-300 border-purple-200'
                              : 'bg-slate-50 dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-white/5 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-[10px] opacity-80 font-bold">{d.dayName}</span>
                          <span className="text-sm font-black font-mono tabular-nums mt-0.5">
                            {d.dayNum}
                          </span>
                          <div className="flex items-center gap-0.5 mt-1 h-1.5">
                            {dayMissions.slice(0, 3).map((m, idx) => (
                              <span
                                key={idx}
                                className="w-1.5 h-1.5 rounded-full"
                                style={{
                                  backgroundColor: isSelected
                                    ? '#FFFFFF'
                                    : FO5_DEPARTMENTS_META[m.primaryDepartment].color,
                                }}
                              />
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Date Missions */}
                  <div className="space-y-2 pt-1">
                    {missions
                      .filter(m => m.date === selectedCalendarDate)
                      .map(m => {
                        const dept = FO5_DEPARTMENTS_META[m.primaryDepartment];
                        return (
                          <div
                            key={m.id}
                            onClick={() => onSelectMission(m)}
                            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] hover:bg-purple-50/50 border border-slate-200/70 dark:border-white/10 transition cursor-pointer flex items-center justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 text-[11px]">
                                <span className="font-mono font-bold text-slate-600 dark:text-slate-300">
                                  {m.time}
                                </span>
                                <span
                                  className="font-extrabold"
                                  style={{ color: dept.color }}
                                >
                                  {dept.name}
                                </span>
                              </div>
                              <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
                                {m.title}
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                          </div>
                        );
                      })}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {activeWorkspaceTab === 'documents' && (
            <motion.div
              key="tab-documents"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left 6 Cols: Official Documents */}
              <div className="lg:col-span-6 liquid-glass-card rounded-3xl p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      คลังเอกสารราชการ & หนังสือเวียนล่าสุด
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      คลิกเพื่อเปิดอ่านหรือดาวน์โหลดเอกสารราชการ
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateModule('documents')}
                    className="text-xs font-extrabold text-[#2583D8] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>เปิดคลังเอกสาร</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {documentItems.map(doc => (
                    <div
                      key={doc.id}
                      onClick={() => navigateModule('documents')}
                      className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-sky-50/50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/10 transition cursor-pointer group flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="font-mono font-extrabold text-[#2583D8]">
                            {doc.code}
                          </span>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="font-bold text-rose-600">{doc.urgency}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {doc.title}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {doc.publisher} · {doc.size}
                        </p>
                      </div>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-[#2583D8] shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 6 Cols: PR News Highlights */}
              <div className="lg:col-span-6 liquid-glass-card rounded-3xl p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      ข่าวสารและผลการปฏิบัติงานเด่น
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      รายงานกิจกรรมเด่นจาก 4 สายงานหลัก ฝอ.5
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateModule('relations')}
                    className="text-xs font-extrabold text-[#5B2A86] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>ระบบประชาสัมพันธ์</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {newsItems.map(news => {
                    const dept = FO5_DEPARTMENTS_META[news.departmentKey];
                    return (
                      <div
                        key={news.id}
                        onClick={() => navigateModule('relations')}
                        className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-purple-50/40 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/10 transition cursor-pointer space-y-1"
                      >
                        <div className="flex items-center gap-2 text-[11px]">
                          <span
                            className="font-extrabold"
                            style={{ color: dept.color }}
                          >
                            {news.category}
                          </span>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="font-mono text-slate-400">{news.date}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {news.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1">{news.summary}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeWorkspaceTab === 'kpi' && (
            <motion.div
              key="tab-kpi"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="liquid-glass-card rounded-3xl p-4 sm:p-6 space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/10">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    ความก้าวหน้าแผนปฏิบัติราชการประจำปี 2569
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    เปรียบเทียบผลการดำเนินงานจริงเทียบเป้าหมายของทั้ง 4 สายงานหลัก
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigateModule('bpp-tracker')}
                  className="px-3.5 py-2 rounded-xl bg-[#5B2A86] text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>ติดตามการส่งงาน หน่วย ตชด.</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FO5_STRATEGIC_PROJECTS.slice(0, 4).map(proj => {
                  const dept = FO5_DEPARTMENTS_META[proj.departmentKey];
                  return (
                    <div
                      key={proj.id}
                      onClick={() => navigateModule(proj.departmentKey)}
                      className="p-4 rounded-2xl bg-slate-50/90 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 hover:border-slate-300 transition cursor-pointer space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold" style={{ color: dept.color }}>
                          {dept.name} · {proj.code}
                        </span>
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                          {proj.achievementRate}% ({proj.currentNumber}/{proj.targetNumber} {proj.unit})
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {proj.name}
                      </h4>
                      <div className="w-full h-2.5 rounded-full bg-slate-200/80 dark:bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${proj.achievementRate}%`,
                            backgroundColor: dept.color,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>ผู้รับผิดชอบ: {proj.responsibleOfficer}</span>
                        <span>สถานะ: {proj.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};
