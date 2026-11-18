import React from 'react';
import { useAdmin } from '../contexts/AdminContext';
import {
  DollarSign,
  Briefcase,
  Inbox,
  Send,
  Sparkles,
  CalendarCheck,
  Compass,
  FileCheck2,
  ChevronRight,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
} from 'lucide-react';
import { formatCurrency, formatThaiDate } from '../utils/formatters';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const {
    kpis,
    budgets,
    travelRecords,
    incomingDocs,
    outgoingDocs,
    activityLogs,
    currentUser,
    navigate,
  } = useAdmin();

  // Monthly document trend (Jan - Sep 2569)
  const monthlyDocTrend = [
    { month: 'ม.ค.', incoming: 38, outgoing: 32 },
    { month: 'ก.พ.', incoming: 42, outgoing: 35 },
    { month: 'มี.ค.', incoming: 55, outgoing: 48 },
    { month: 'เม.ย.', incoming: 46, outgoing: 40 },
    { month: 'พ.ค.', incoming: 50, outgoing: 44 },
    { month: 'มิ.ย.', incoming: 62, outgoing: 51 },
    { month: 'ก.ค.', incoming: 58, outgoing: 49 },
    { month: 'ส.ค.', incoming: 74, outgoing: 63 },
    { month: 'ก.ย.', incoming: Math.max(incomingDocs.length * 4, 30), outgoing: Math.max(outgoingDocs.length * 4, 25) },
  ];

  // Budget quarterly performance
  const quarterlySpending = [
    { quarter: 'Q1 ต.ค.-ธ.ค.', amount: 2.89, target: 3.12 },
    { quarter: 'Q2 ม.ค.-มี.ค.', amount: 2.95, target: 3.12 },
    { quarter: 'Q3 เม.ย.-มิ.ย.', amount: 2.71, target: 3.12 },
    { quarter: 'Q4 ก.ค.-ก.ย.', amount: 2.43, target: 3.12 },
  ];

  // Urgent pending incoming docs
  const urgentIncoming = incomingDocs
    .filter(d => d.urgency === 'ด่วนที่สุด' || d.urgency === 'ด่วนมาก' || d.status === 'รอดำเนินการ')
    .slice(0, 5);

  // Active / Upcoming travel
  const upcomingTravel = travelRecords
    .filter(t => t.status === 'อนุมัติแล้ว' || t.status === 'อยู่ระหว่างปฏิบัติงาน')
    .slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-8 iridescent-ambient liquid-glass-card rounded-3xl p-4 sm:p-6">
      {/* 01 — HERO / OPENING (Editorial Intelligence Command) */}
      <section className="liquid-glass-card iridescent-edge rounded-[28px] p-6 sm:p-8 relative overflow-hidden">
        {/* Fine grid accent inside hero */}
        <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_top_right,rgba(35,74,120,0.12),transparent_70%)]" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-mono tracking-widest text-[rgba(17,19,21,0.5)] mb-2 uppercase">
              <span className="text-[#234A78] font-bold">ฝอ.5 · งานอำนวยการ</span>
              <span>—</span>
              <span>SMART ADMINISTRATION CENTER</span>
              <span>—</span>
              <span>ปีงบประมาณ 2569</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#111315] leading-tight">
                สวัสดี, {currentUser?.name || ''}
              </h2>
            </div>
            <div className="text-sm sm:text-base font-semibold text-[#234A78] mt-1">
              งานอำนวยการ ฝอ.5
            </div>
            <p className="text-xs sm:text-sm text-[rgba(17,19,21,0.62)] mt-1.5 font-normal leading-relaxed max-w-2xl">
              ศูนย์กลางการบริหารจัดการข้อมูล ภารกิจ และงานอำนวยการ รายงานและประมวลผลข้อมูล 5 กลุ่มงานหลักแบบเรียลไทม์
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            {/* Status Telemetry Badge */}
            <div className="px-4 py-2.5 rounded-2xl bg-white/80 border border-white/90 shadow-2xs">
              <div className="text-[9px] font-mono tracking-widest text-[rgba(17,19,21,0.4)] uppercase">
                สถานะระบบงาน
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-700 font-sans">
                  ระบบออนไลน์
                </span>
              </div>
            </div>

            {/* Direct Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('home')}
                className="px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white border border-[rgba(17,19,21,0.12)] text-[#111315] text-xs font-medium transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                title="กลับสู่หน้าหลัก ฝอ.5"
              >
                <span>หน้าหลัก ฝอ.5</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('incoming')}
                className="px-3.5 py-2 rounded-xl bg-[#17324F] hover:bg-[#234A78] text-white text-xs font-medium transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Inbox className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>ลงรับหนังสือ</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('ai-inspection')}
                className="px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white border border-[rgba(17,19,21,0.12)] text-[#111315] text-xs font-medium transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#234A78] stroke-[1.5]" />
                <span>AI ตรวจเอกสาร</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 01.5 — EXECUTIVE STATISTICS CARDS (Requirement 10) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-[rgba(17,19,21,0.55)] uppercase">
          <span>สถิติและสถานะภารกิจรวม</span>
          <span className="text-[10px] font-mono text-[rgba(17,19,21,0.4)]">ข้อมูลอัปเดตอัตโนมัติ</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {/* Card 1: ภารกิจทั้งหมด 24 */}
          <div
            onClick={() => navigate('missions')}
            className="p-5 rounded-2xl bg-white/70 border border-white/90 hover:border-[#234A78]/30 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-[rgba(17,19,21,0.6)] font-sans">
              <span>ภารกิจทั้งหมด</span>
              <ArrowUpRight className="w-4 h-4 text-[rgba(17,19,21,0.3)] group-hover:text-[#234A78] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-[#17324F]">
                24
              </span>
              <span className="text-xs text-[rgba(17,19,21,0.45)]">รายการ</span>
            </div>
            <div className="mt-2 text-[11px] text-[rgba(17,19,21,0.5)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#17324F]" />
              <span>ภาพรวมภารกิจ ฝอ.5 ทั้งหมด</span>
            </div>
          </div>

          {/* Card 2: กำลังดำเนินการ 12 */}
          <div
            onClick={() => navigate('missions')}
            className="p-5 rounded-2xl bg-white/70 border border-white/90 hover:border-amber-500/30 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-[rgba(17,19,21,0.6)] font-sans">
              <span>กำลังดำเนินการ</span>
              <ArrowUpRight className="w-4 h-4 text-[rgba(17,19,21,0.3)] group-hover:text-amber-600 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-amber-700">
                12
              </span>
              <span className="text-xs text-[rgba(17,19,21,0.45)]">รายการ</span>
            </div>
            <div className="mt-2 text-[11px] text-[rgba(17,19,21,0.5)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>อยู่ระหว่างการปฏิบัติหน้าที่</span>
            </div>
          </div>

          {/* Card 3: รอดำเนินการ 08 */}
          <div
            onClick={() => navigate('incoming')}
            className="p-5 rounded-2xl bg-white/70 border border-white/90 hover:border-[#234A78]/30 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-[rgba(17,19,21,0.6)] font-sans">
              <span>รอดำเนินการ</span>
              <ArrowUpRight className="w-4 h-4 text-[rgba(17,19,21,0.3)] group-hover:text-[#234A78] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-[#234A78]">
                08
              </span>
              <span className="text-xs text-[rgba(17,19,21,0.45)]">รายการ</span>
            </div>
            <div className="mt-2 text-[11px] text-[rgba(17,19,21,0.5)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#234A78]" />
              <span>รอการสั่งการ/มอบหมาย</span>
            </div>
          </div>

          {/* Card 4: เสร็จสิ้น 04 */}
          <div
            onClick={() => navigate('meetings')}
            className="p-5 rounded-2xl bg-white/70 border border-white/90 hover:border-emerald-600/30 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-[rgba(17,19,21,0.6)] font-sans">
              <span>เสร็จสิ้น</span>
              <ArrowUpRight className="w-4 h-4 text-[rgba(17,19,21,0.3)] group-hover:text-emerald-600 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-[#42695B]">
                04
              </span>
              <span className="text-xs text-[rgba(17,19,21,0.45)]">รายการ</span>
            </div>
            <div className="mt-2 text-[11px] text-[rgba(17,19,21,0.5)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#557C67]" />
              <span>ปิดภารกิจเรียบร้อยแล้ว</span>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — ASYMMETRICAL EDITORIAL KPI TILES */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-[rgba(17,19,21,0.55)] uppercase">
          <span>ตัวชี้วัดงานอำนวยการหลัก</span>
          <span className="font-mono text-[10px]">ข้อมูลปัจจุบัน</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          {/* KPI 1: Budget Overview (Span 4 cols, Primary financial card) */}
          <div
            onClick={() => navigate('budget')}
            className="lg:col-span-4 glass rounded-[24px] p-6 hover:border-[#234A78]/30 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.45)] uppercase mb-1">
                <span>01. งบประมาณประจำปี</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[rgba(17,19,21,0.3)] group-hover:text-[#17324F] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <div className="text-[13px] text-[rgba(17,19,21,0.6)] font-normal">
                งบประมาณคงเหลือสุทธิ
              </div>
              <div className="text-3xl sm:text-4xl font-light tracking-tight text-[#111315] font-mono mt-1">
                ฿{(kpis.remainingBudget / 1000000).toFixed(2)}M
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[rgba(17,19,21,0.06)]">
              <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                <span className="text-[rgba(17,19,21,0.6)]">เบิกจ่ายแล้ว {kpis.spentPercentage.toFixed(1)}%</span>
                <span className="text-[#42695B] font-medium">รวม ฿12.50M</span>
              </div>
              <div className="w-full bg-[rgba(17,19,21,0.06)] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#234A78] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(kpis.spentPercentage, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* KPI 2: Incoming Documents (Span 3 cols) */}
          <div
            onClick={() => navigate('incoming')}
            className="lg:col-span-3 glass rounded-[24px] p-6 hover:border-[#234A78]/30 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.45)] uppercase mb-1">
                <span>02. สารบรรณหนังสือรับ</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[rgba(17,19,21,0.3)] group-hover:text-[#17324F] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <div className="text-[13px] text-[rgba(17,19,21,0.6)] font-normal">
                หนังสือรับรอดำเนินการ
              </div>
              <div className="text-3xl sm:text-4xl font-light tracking-tight text-[#111315] font-mono mt-1">
                {kpis.pendingIncoming} <span className="text-sm text-[rgba(17,19,21,0.45)] font-normal">ฉบับ</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[rgba(17,19,21,0.06)] flex items-center justify-between text-[11px]">
              <span className="text-[#A84E4E] font-medium flex items-center gap-1 font-mono">
                ด่วนที่สุด {incomingDocs.filter(d => d.urgency === 'ด่วนที่สุด').length} ฉบับ
              </span>
              <span className="text-[rgba(17,19,21,0.45)] font-mono">รวม {incomingDocs.length}</span>
            </div>
          </div>

          {/* KPI 3: Outgoing Documents (Span 2 cols) */}
          <div
            onClick={() => navigate('outgoing')}
            className="lg:col-span-2 glass rounded-[24px] p-6 hover:border-[#234A78]/30 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.45)] uppercase mb-1">
                <span>03. หนังสือส่ง</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[rgba(17,19,21,0.3)] group-hover:text-[#17324F] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <div className="text-[13px] text-[rgba(17,19,21,0.6)] font-normal">
                หนังสือส่งออก
              </div>
              <div className="text-3xl sm:text-4xl font-light tracking-tight text-[#111315] font-mono mt-1">
                {outgoingDocs.length} <span className="text-sm text-[rgba(17,19,21,0.45)] font-normal">ฉบับ</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[rgba(17,19,21,0.06)] text-[11px] text-[rgba(17,19,21,0.55)] font-mono">
              ร่าง/เสนอ {outgoingDocs.filter(d => d.status === 'ร่าง' || d.status === 'เสนอลงนาม').length} รายการ
            </div>
          </div>

          {/* KPI 4: Official Travel & Personnel (Span 3 cols) */}
          <div
            onClick={() => navigate('travel')}
            className="lg:col-span-3 glass rounded-[24px] p-6 hover:border-[#234A78]/30 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.45)] uppercase mb-1">
                <span>04. ภารกิจและเดินทาง</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[rgba(17,19,21,0.3)] group-hover:text-[#17324F] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <div className="text-[13px] text-[rgba(17,19,21,0.6)] font-normal">
                ไปราชการเดือนนี้
              </div>
              <div className="text-3xl sm:text-4xl font-light tracking-tight text-[#111315] font-mono mt-1">
                {kpis.travelThisMonth} <span className="text-sm text-[rgba(17,19,21,0.45)] font-normal">รายการ</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[rgba(17,19,21,0.06)] flex items-center justify-between text-[11px]">
              <span className="text-[#42695B] font-medium font-mono">
                ● ปฏิบัติการ {travelRecords.filter(t => t.status === 'อยู่ระหว่างปฏิบัติงาน').length} งาน
              </span>
              <span className="text-[rgba(17,19,21,0.45)] font-mono">{kpis.totalPersonnel} กำลังพล</span>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — DATA VISUALIZATION (Minimalist Editorial Charts) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Document Volumes Area Chart (8 cols) */}
        <div className="lg:col-span-8 glass rounded-[24px] p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[rgba(17,19,21,0.06)] gap-2">
            <div>
              <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase">
                สถิติงานสารบรรณ · ปีงบประมาณ 2569
              </div>
              <h3 className="text-base font-medium text-[#111315] tracking-tight mt-0.5">
                สถิติการรับ-ส่งหนังสือราชการรายเดือน
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#17324F]" />
                <span className="text-[rgba(17,19,21,0.7)]">หนังสือรับ</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#42695B]" />
                <span className="text-[rgba(17,19,21,0.7)]">หนังสือส่ง</span>
              </div>
            </div>
          </div>

          <div className="h-64 sm:h-72 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyDocTrend} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: 'rgba(17,19,21,0.45)', fontFamily: 'Inter' }}
                  axisLine={{ stroke: 'rgba(17,19,21,0.08)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'rgba(17,19,21,0.45)', fontFamily: 'Inter' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.4)' }}
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(17,19,21,0.08)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 8px 24px rgba(20,30,35,0.08)',
                  }}
                  formatter={(val: number | string | undefined, name: string | undefined) => [
                    `${val ?? 0} ฉบับ`,
                    name === 'incoming' ? 'หนังสือรับ' : 'หนังสือส่ง',
                  ]}
                />
                <Bar dataKey="incoming" fill="#17324F" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="outgoing" fill="#42695B" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quarterly Budget Utilization (4 cols) */}
        <div className="lg:col-span-4 glass rounded-[24px] p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase">
              BUDGET TRAJECTORY
            </div>
            <h3 className="text-base font-medium text-[#111315] tracking-tight mt-0.5">
              การเบิกจ่ายงบประมาณรายไตรมาส
            </h3>
            <p className="text-xs text-[rgba(17,19,21,0.55)] mt-1">
              เปรียบเทียบวงเงินเป้าหมายและยอดเบิกจ่ายจริง (ล้านบาท)
            </p>
          </div>

          <div className="space-y-3.5 my-4">
            {quarterlySpending.map((q, idx) => {
              const pct = (q.amount / q.target) * 100;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[rgba(17,19,21,0.7)]">{q.quarter}</span>
                    <span className="font-semibold text-[#111315]">
                      ฿{q.amount.toFixed(2)}M <span className="text-[rgba(17,19,21,0.4)] font-normal">/ {q.target}M</span>
                    </span>
                  </div>
                  <div className="w-full bg-[rgba(17,19,21,0.06)] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#234A78] h-full rounded-full transition-all"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[rgba(17,19,21,0.06)] flex items-center justify-between text-xs">
            <span className="text-[rgba(17,19,21,0.5)] font-mono">เป้าหมายทั้งปี 100%</span>
            <button
              type="button"
              onClick={() => navigate('budget')}
              className="text-[#234A78] font-medium hover:underline flex items-center gap-1"
            >
              <span>ดูงบประมาณทั้งหมด</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 04 — STRATEGIC COMMAND MODULES (AI Inspector, Monthly Meetings, Missions) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-[rgba(17,19,21,0.55)] uppercase">
          <span>ระบบงานย่อยฝ่ายอำนวยการ</span>
          <span className="font-mono text-[10px]">คลิกเพื่อเข้าใช้งาน</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* Card 1: AI Document Inspector */}
          <div
            onClick={() => navigate('ai-inspection')}
            className="glass rounded-[24px] p-6 hover:border-[#234A78]/40 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#234A78]/10 text-[#234A78] flex items-center justify-center">
                  <FileCheck2 className="w-5 h-5 stroke-[1.5]" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#42695B]/10 text-[#42695B] font-medium">
                  ● AI INTELLIGENCE
                </span>
              </div>
              <h4 className="text-base font-medium text-[#111315] group-hover:text-[#234A78] transition-colors">
                AI ตรวจสอบเอกสารราชการ
              </h4>
              <p className="text-xs text-[rgba(17,19,21,0.6)] mt-1.5 leading-relaxed font-normal">
                ตรวจระเบียบงานสารบรรณ คำผิด ฟอร์แมต ชั้นความลับ และความปลอดภัยข้อมูลอัตโนมัติ
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-[rgba(17,19,21,0.06)] flex items-center justify-between text-xs font-mono">
              <span className="text-[rgba(17,19,21,0.6)]">
                ตรวจแล้ว <strong className="text-[#111315]">{kpis.inspectedDocuments} ฉบับ</strong>
              </span>
              <span className="text-[#234A78] font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                เข้าใช้งาน <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 2: Monthly Meetings System */}
          <div
            onClick={() => navigate('meetings')}
            className="glass rounded-[24px] p-6 hover:border-[#234A78]/40 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#17324F]/10 text-[#17324F] flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5 stroke-[1.5]" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#234A78]/10 text-[#234A78] font-medium">
                  12 MONTHS
                </span>
              </div>
              <h4 className="text-base font-medium text-[#111315] group-hover:text-[#234A78] transition-colors">
                ระบบบริหารการประชุมรายเดือน
              </h4>
              <p className="text-xs text-[rgba(17,19,21,0.6)] mt-1.5 leading-relaxed font-normal">
                จัดเก็บ ๕ ระเบียบวาระมาตรฐาน ติดตามมติที่ประชุม และสรุปข้อสั่งการผู้บังคับบัญชา
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-[rgba(17,19,21,0.06)] flex items-center justify-between text-xs font-mono">
              <span className="text-[rgba(17,19,21,0.6)]">
                การประชุม <strong className="text-[#111315]">{kpis.totalMeetings} ครั้ง</strong>
              </span>
              <span className="text-[#234A78] font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                เข้าใช้งาน <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 3: Personnel Missions & Conflict Check */}
          <div
            onClick={() => navigate('missions')}
            className="glass rounded-[24px] p-6 hover:border-[#234A78]/40 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#42695B]/10 text-[#42695B] flex items-center justify-center">
                  <Compass className="w-5 h-5 stroke-[1.5]" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#42695B]/10 text-[#42695B] font-medium">
                  CONFLICT GUARD
                </span>
              </div>
              <h4 className="text-base font-medium text-[#111315] group-hover:text-[#42695B] transition-colors">
                ระบบบริหารภารกิจและกำลังพล
              </h4>
              <p className="text-xs text-[rgba(17,19,21,0.6)] mt-1.5 leading-relaxed font-normal">
                จัดสรรกำลังพล ตรวจสอบเวลาทับซ้อน (Conflict Check) และควบคุมงบประมาณปฏิบัติงาน
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-[rgba(17,19,21,0.06)] flex items-center justify-between text-xs font-mono">
              <span className="text-[rgba(17,19,21,0.6)]">
                ภารกิจ <strong className="text-[#111315]">{kpis.totalMissions} รายการ</strong>
              </span>
              <span className="text-[#42695B] font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                เข้าใช้งาน <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — EDITORIAL ACTIVITY LOG FEED */}
      <section className="glass rounded-[28px] p-6 sm:p-7">
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(17,19,21,0.08)] mb-4">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase">
              บันทึกการปฏิบัติงานล่าสุด
            </div>
            <h3 className="text-base font-medium text-[#111315] tracking-tight mt-0.5">
              บันทึกกิจกรรมล่าสุดในระบบฝ่ายอำนวยการ
            </h3>
          </div>
          <button
            type="button"
            onClick={() => navigate('logs')}
            className="text-xs font-mono text-[#234A78] hover:underline flex items-center gap-1"
          >
            <span>ดูประวัติทั้งหมด</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {activityLogs.slice(0, 4).map(log => (
            <div
              key={log.id}
              className="p-4 rounded-2xl bg-white/60 border border-white/80 hover:bg-white/90 transition shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-[rgba(17,19,21,0.45)] mb-1.5">
                  <span className="font-semibold text-[#234A78] uppercase">{log.module}</span>
                  <span>{log.time} น.</span>
                </div>
                <h5 className="text-xs font-medium text-[#111315] line-clamp-1">{log.action}</h5>
                <p className="text-[11px] text-[rgba(17,19,21,0.6)] line-clamp-2 mt-1 leading-relaxed">
                  {log.details}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[rgba(17,19,21,0.06)] flex items-center justify-between text-[10px] font-mono text-[rgba(17,19,21,0.5)]">
                <span className="truncate">{log.actor}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#557C67]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export const Dashboard = DashboardPage;
