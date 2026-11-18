import React, { useState, useEffect, useMemo } from 'react';
import {
  BppUnit,
  ReportDepartment,
  SubmissionStatus,
  BppRegion,
} from '../../data/bppUnitsData';
import { bppReportService } from '../../services/bppReportService';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Phone,
  Radio,
  FileText,
  Send,
  Download,
  Printer,
  ChevronRight,
  UserCheck,
  Building2,
  MapPin,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Info,
  Check,
  Copy,
} from 'lucide-react';

interface BppReportTrackerProps {
  defaultDepartment?: ReportDepartment;
  onSelectUnit?: (unit: BppUnit) => void;
  standalone?: boolean;
}

export const BppReportTracker: React.FC<BppReportTrackerProps> = ({
  defaultDepartment,
  onSelectUnit,
  standalone = true,
}) => {
  const [units, setUnits] = useState<BppUnit[]>([]);
  const [selectedDept, setSelectedDept] = useState<ReportDepartment | 'all'>(
    defaultDepartment || 'all'
  );
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'submitted'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<BppUnit | null>(null);

  // Follow-up Reminder Modal
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderTargetUnit, setReminderTargetUnit] = useState<BppUnit | null>(null);
  const [reminderChannel, setReminderChannel] = useState<'phone' | 'radio' | 'line'>('phone');
  const [reminderMessage, setReminderMessage] = useState('');

  // Mark Submitted Modal
  const [isMarkSubmitModalOpen, setIsMarkSubmitModalOpen] = useState(false);
  const [submitTargetUnit, setSubmitTargetUnit] = useState<BppUnit | null>(null);
  const [submitTargetDept, setSubmitTargetDept] = useState<ReportDepartment>('disaster');
  const [docNumber, setDocNumber] = useState('');
  const [submitRemarks, setSubmitRemarks] = useState('');

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  useEffect(() => {
    setUnits(bppReportService.getAllUnits());
    const unsub = bppReportService.subscribe(() => {
      setUnits(bppReportService.getAllUnits());
    });
    return unsub;
  }, []);

  const stats = useMemo(() => {
    return bppReportService.getStats(selectedDept === 'all' ? undefined : selectedDept);
  }, [units, selectedDept]);

  // Filtered list
  const filteredUnits = useMemo(() => {
    return units.filter(unit => {
      // Region
      if (regionFilter !== 'all' && unit.regionShort !== regionFilter) return false;

      // Status
      if (statusFilter === 'pending') {
        if (selectedDept === 'all') {
          // Has at least one pending
          const hasPending = (['admin', 'relations', 'disaster', 'volunteer'] as ReportDepartment[]).some(
            d => unit.reports[d].status === 'pending'
          );
          if (!hasPending) return false;
        } else {
          if (unit.reports[selectedDept].status !== 'pending') return false;
        }
      } else if (statusFilter === 'submitted') {
        if (selectedDept === 'all') {
          const allDone = (['admin', 'relations', 'disaster', 'volunteer'] as ReportDepartment[]).every(
            d => unit.reports[d].status === 'submitted'
          );
          if (!allDone) return false;
        } else {
          if (unit.reports[selectedDept].status !== 'submitted') return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inId = unit.id.toLowerCase().includes(q);
        const inCamp = unit.campName.toLowerCase().includes(q);
        const inOfficer = unit.officerName.toLowerCase().includes(q);
        const inPhone = unit.officerPhone.toLowerCase().includes(q);
        const inProvinces = unit.responsibleProvinces.some(p => p.toLowerCase().includes(q));
        if (!inId && !inCamp && !inOfficer && !inPhone && !inProvinces) return false;
      }

      return true;
    });
  }, [units, selectedDept, regionFilter, statusFilter, searchQuery]);

  // Handle reminder submit
  const handleSendReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTargetUnit) return;

    bppReportService.addFollowUpLog(
      reminderTargetUnit.id,
      reminderChannel,
      'เจ้าหน้าที่ส่วนกลาง ฝอ.๕',
      reminderMessage || `แจ้งเตือนเร่งรัดส่งรายงานทาง ${reminderChannel}`
    );

    showNotice(`บันทึกการเร่งรัด ${reminderTargetUnit.id} สำเร็จ`);
    setIsReminderModalOpen(false);
  };

  // Handle Mark Submitted
  const handleMarkSubmitted = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitTargetUnit) return;

    bppReportService.markReportSubmitted(
      submitTargetUnit.id,
      submitTargetDept,
      docNumber || undefined,
      submitRemarks || undefined
    );

    showNotice(`บันทึกการรับรายงานของ ${submitTargetUnit.id} เรียบร้อยแล้ว`);
    setIsMarkSubmitModalOpen(false);
  };

  // Export CSV
  const handleExportCsv = () => {
    const csv = bppReportService.exportCsv(selectedDept === 'all' ? undefined : selectedDept);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bpp_report_submission_${selectedDept}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showNotice('ส่งออกไฟล์ข้อมูลสรุปรายงานเรียบร้อยแล้ว');
  };

  const handleCopyPhone = (phone: string, id: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const departmentTabs: { id: ReportDepartment | 'all'; label: string }[] = [
    { id: 'all', label: 'ทุกแผนก (ภาพรวม)' },
    { id: 'admin', label: 'ฝ่ายอำนวยการ' },
    { id: 'relations', label: 'ฝ่ายมวลชนสัมพันธ์' },
    { id: 'disaster', label: 'ฝ่ายสาธารณภัย' },
    { id: 'volunteer', label: 'ฝ่ายจิตอาสา' },
  ];

  return (
    <div className={standalone ? 'min-h-screen iridescent-ambient p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-16' : 'space-y-6'}>
      {/* Success Toast */}
      {successToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">{successToast}</span>
        </div>
      )}

      {/* Studio Hero Header Banner */}
      <div
        className="rounded-3xl p-5 sm:p-7 text-white border border-white/15 shadow-xl space-y-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 42%, #1D4ED8 78%, #0284C7 100%)',
        }}
      >
        {/* 4-Color Spectrum Top Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8B46C8] via-[#2583D8] via-[#E89B22] to-[#42A77A]" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-bold bg-white/15 text-sky-200 border border-white/20 backdrop-blur-md">
              <Building2 className="w-3.5 h-3.5 text-amber-300" />
              <span>16 BPP UNITS TRACKER • กก.ตชด. 11-14, 21-24, 31-34, 41-44</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              ตรวจเช็คการส่งรายงานและผู้รับผิดชอบแต่ละ กก.ตชด.
            </h2>
            <p className="text-xs sm:text-sm text-sky-100/85">
              ติดตามสถานะการส่งรายงานของทุกแผนก (อำนวยการ, ประชาสัมพันธ์, พัฒนาช่วยเหลือประชาชน, จิตอาสา)
              พร้อมเบอร์โทรสายตรงและระบบแจ้งเตือนเร่งรัดทันที
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center gap-1.5 backdrop-blur-md cursor-pointer"
            >
              <Download className="w-4 h-4 text-sky-200" />
              <span>ส่งออก CSV / Excel</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 transition flex items-center gap-1.5 shadow-lg cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์สรุปเสนอผู้บังคับบัญชา</span>
            </button>
          </div>
        </div>

        {/* 4 Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 relative z-10">
          {/* Total Units */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
            <span className="text-xs text-sky-200 font-semibold block mb-0.5">
              จำนวน กก.ตชด. ทั้งหมด
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono tabular-nums text-white">{stats.total}</span>
              <span className="text-xs text-sky-200">หน่วย (4 ภาค)</span>
            </div>
            <span className="text-[11px] text-sky-200/75 mt-1 block font-mono">
              11-14, 21-24, 31-34, 41-44
            </span>
          </div>

          {/* Pending (Missing) Reports - HIGHLIGHTED RED */}
          <div
            onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
            className={`rounded-2xl p-4 border cursor-pointer transition backdrop-blur-md ${
              statusFilter === 'pending'
                ? 'bg-rose-500/35 border-rose-300 ring-2 ring-rose-300'
                : 'bg-rose-500/20 border-rose-400/40 hover:bg-rose-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs text-rose-100 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />
                <span>ยังไม่ส่งรายงาน</span>
              </span>
              {statusFilter === 'pending' && (
                <span className="text-[10px] font-bold bg-rose-500 text-white px-1.5 py-0.2 rounded">
                  กำลังกรอง
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono tabular-nums text-white">{stats.pending}</span>
              <span className="text-xs text-rose-200">หน่วยที่ค้างส่ง</span>
            </div>
            <span className="text-[11px] text-amber-300 font-semibold mt-1 block underline">
              คลิกเพื่อดูเฉพาะหน่วยที่ยังไม่ส่ง
            </span>
          </div>

          {/* Submitted On-time */}
          <div
            onClick={() => setStatusFilter(statusFilter === 'submitted' ? 'all' : 'submitted')}
            className={`rounded-2xl p-4 border cursor-pointer transition backdrop-blur-md ${
              statusFilter === 'submitted'
                ? 'bg-emerald-500/35 border-emerald-300 ring-2 ring-emerald-300'
                : 'bg-emerald-500/20 border-emerald-400/40 hover:bg-emerald-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs text-emerald-100 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>ส่งรายงานเรียบร้อย</span>
              </span>
              {statusFilter === 'submitted' && (
                <span className="text-[10px] font-bold bg-emerald-500 text-white px-1.5 py-0.2 rounded">
                  กำลังกรอง
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono tabular-nums text-white">{stats.submitted}</span>
              <span className="text-xs text-emerald-200">หน่วย</span>
            </div>
            <span className="text-[11px] text-emerald-200 font-semibold mt-1 block font-mono">
              คิดเป็น {stats.completionRate}%
            </span>
          </div>

          {/* Completion Rate Progress */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-col justify-between">
            <div>
              <span className="text-xs text-sky-200 font-semibold block mb-0.5">
                อัตราการส่งรายงานรวม
              </span>
              <span className="text-2xl font-black font-mono tabular-nums text-emerald-300">{stats.completionRate}%</span>
            </div>
            <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden mt-2">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Department Tabs Bar */}
        <div className="border-t border-white/15 pt-3 flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="flex flex-wrap items-center gap-1.5 bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/15">
            {departmentTabs.map(dept => (
              <button
                key={dept.id}
                type="button"
                onClick={() => setSelectedDept(dept.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedDept === dept.id
                    ? 'bg-white text-[#1E1B4B] shadow-md'
                    : 'text-sky-100 hover:text-white hover:bg-white/10'
                }`}
              >
                {dept.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-sky-200 font-medium">
            เกณฑ์ส่งรายงานประจำวัน: ภายในเวลา 17:00 น.
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="liquid-glass-card iridescent-edge rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Region Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            {[
              { id: 'all', label: 'ทุกภาค (1-4)' },
              { id: 'ภาค 1', label: 'ภาค 1 (11-14)' },
              { id: 'ภาค 2', label: 'ภาค 2 (21-24)' },
              { id: 'ภาค 3', label: 'ภาค 3 (31-34)' },
              { id: 'ภาค 4', label: 'ภาค 4 (41-44)' },
            ].map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRegionFilter(r.id)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  regionFilter === r.id
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Status Quick Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-hidden"
          >
            <option value="all">สถานะรายงานทั้งหมด</option>
            <option value="pending">เฉพาะหน่วยที่ "ยังไม่ส่งรายงาน" (ค้างส่ง)</option>
            <option value="submitted">เฉพาะหน่วยที่ "ส่งรายงานแล้ว"</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px] max-w-sm w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="ค้นหา กก.ตชด., ผู้รับผิดชอบ, จังหวัด, เบอร์โทร..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
          />
        </div>
      </div>

      {/* Main Units Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-bold text-slate-900">
              รายชื่อกองกำกับการตำรวจตระเวนชายแดน (พบ {filteredUnits.length} หน่วย)
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            แสดงข้อมูลผู้รับผิดชอบ นามเรียกขาน และสถานะการส่งรายงาน
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">รหัสหน่วย & ค่าย</th>
                <th className="py-3 px-4">จังหวัดรับผิดชอบ</th>
                <th className="py-3 px-4">ผู้รับผิดชอบโดยตรง (Contact)</th>
                <th className="py-3 px-4">
                  {selectedDept === 'all'
                    ? 'สถานะ 4 แผนก'
                    : `สถานะ ${departmentTabs.find(d => d.id === selectedDept)?.label}`}
                </th>
                <th className="py-3 px-4 text-right">ดำเนินการติดตาม</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    ไม่พบข้อมูล กก.ตชด. ที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                filteredUnits.map(unit => {
                  // Check if this unit is missing any report in the current filter
                  const isMissing =
                    selectedDept === 'all'
                      ? (['admin', 'relations', 'disaster', 'volunteer'] as ReportDepartment[]).some(
                          d => unit.reports[d].status === 'pending'
                        )
                      : unit.reports[selectedDept].status === 'pending';

                  return (
                    <tr
                      key={unit.id}
                      className={`hover:bg-slate-50/80 transition ${
                        isMissing ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      {/* Unit ID & Camp */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                              isMissing
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-slate-800 text-white'
                            }`}
                          >
                            {unit.unitNumber}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                              <span>{unit.id}</span>
                              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                                {unit.regionShort}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500">{unit.campName}</div>
                            <div className="text-[10px] text-slate-400">
                              บก.ที่ตั้ง: จ.{unit.provinceLocation}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Responsible Provinces */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {unit.responsibleProvinces.map((prov, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]"
                            >
                              {prov}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Responsible Officer Info */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="text-blue-700 font-semibold">{unit.officerRank}</span>
                            <span>{unit.officerName}</span>
                          </div>
                          <div className="text-[11px] text-slate-500">{unit.officerPosition}</div>
                          <div className="flex items-center gap-3 pt-0.5 text-[11px]">
                            {/* Phone with copy */}
                            <button
                              type="button"
                              onClick={() => handleCopyPhone(unit.officerPhone, unit.id)}
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                              title="คลิกเพื่อคัดลอกเบอร์โทร"
                            >
                              <Phone className="w-3 h-3 text-blue-500" />
                              <span>{unit.officerPhone}</span>
                              {copiedId === unit.id ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-2.5 h-2.5 text-slate-400" />
                              )}
                            </button>

                            {/* Radio Call Sign */}
                            <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                              <Radio className="w-3 h-3 text-amber-500" />
                              <span>{unit.radioCallSign}</span>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Department Report Submission Status */}
                      <td className="py-3.5 px-4">
                        {selectedDept === 'all' ? (
                          /* 4 badges for 4 departments */
                          <div className="grid grid-cols-2 gap-1.5 max-w-[260px]">
                            {(['admin', 'relations', 'disaster', 'volunteer'] as ReportDepartment[]).map(
                              d => {
                                const rep = unit.reports[d];
                                const isPending = rep.status === 'pending';
                                return (
                                  <div
                                    key={d}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border flex items-center justify-between ${
                                      isPending
                                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    }`}
                                  >
                                    <span className="truncate max-w-[70px]">
                                      {d === 'admin'
                                        ? 'อำนวยการ'
                                        : d === 'relations'
                                        ? 'มวลชน'
                                        : d === 'disaster'
                                        ? 'สาธารณภัย'
                                        : 'จิตอาสา'}
                                    </span>
                                    {isPending ? (
                                      <span className="text-rose-600 shrink-0 font-extrabold">
                                        ยังไม่ส่ง!
                                      </span>
                                    ) : (
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                    )}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        ) : (
                          /* Single Department Detailed Status */
                          <div>
                            {unit.reports[selectedDept].status === 'pending' ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-rose-100 text-rose-700 border border-rose-300 animate-pulse">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  <span>ยังไม่ส่งรายงาน (ค้างส่ง)</span>
                                </span>
                                <div className="text-[10px] text-slate-500">
                                  กำหนดส่ง: {unit.reports[selectedDept].deadline}
                                </div>
                                {unit.reports[selectedDept].remarks && (
                                  <div className="text-[10px] text-rose-600 font-semibold italic">
                                    {unit.reports[selectedDept].remarks}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-0.5">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>ส่งแล้ว</span>
                                </span>
                                <div className="text-[10px] text-slate-500">
                                  ส่งเมื่อ: {unit.reports[selectedDept].submittedAt}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  เลขที่: {unit.reports[selectedDept].documentNo}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Quick Call */}
                          <a
                            href={`tel:${unit.officerPhone}`}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition border border-blue-200"
                            title={`โทรสายตรง ${unit.officerPhone}`}
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          {/* Quick Reminder */}
                          <button
                            type="button"
                            onClick={() => {
                              setReminderTargetUnit(unit);
                              setReminderMessage(
                                `เรียน ${unit.officerRank}${unit.officerName} (${unit.id}) ขอความร่วมมือเร่งรัดส่งรายงานประจำวันของ ${
                                  selectedDept === 'all'
                                    ? 'ทุกแผนก'
                                    : departmentTabs.find(d => d.id === selectedDept)?.label
                                } ด่วน`
                              );
                              setIsReminderModalOpen(true);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] border border-rose-200 transition flex items-center gap-1 cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>เร่งรัด</span>
                          </button>

                          {/* Mark as Submitted */}
                          <button
                            type="button"
                            onClick={() => {
                              setSubmitTargetUnit(unit);
                              setSubmitTargetDept(
                                selectedDept === 'all' ? 'disaster' : selectedDept
                              );
                              setDocNumber(`ตช ${unit.unitNumber}/`);
                              setSubmitRemarks('');
                              setIsMarkSubmitModalOpen(true);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] border border-emerald-200 transition flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>ลงรับ</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reminder Action Modal */}
      {isReminderModalOpen && reminderTargetUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  ส่งข้อความเร่งรัดรายงาน {reminderTargetUnit.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReminderModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendReminder} className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">
                  ผู้รับ: {reminderTargetUnit.officerRank} {reminderTargetUnit.officerName}
                </div>
                <div className="text-slate-500">
                  {reminderTargetUnit.officerPosition} • {reminderTargetUnit.campName}
                </div>
                <div className="text-blue-600 font-bold">
                  โทร: {reminderTargetUnit.officerPhone} • ว. {reminderTargetUnit.radioCallSign}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ช่องทางการเร่งรัด:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'phone', label: 'โทรสายตรง' },
                    { id: 'radio', label: 'วิทยุสื่อสาร ว.' },
                    { id: 'line', label: 'ข้อความ LINE' },
                  ].map(ch => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setReminderChannel(ch.id as any)}
                      className={`py-2 rounded-xl border font-bold text-xs transition ${
                        reminderChannel === ch.id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ข้อความบันทึกการติดตาม:
                </label>
                <textarea
                  rows={3}
                  value={reminderMessage}
                  onChange={e => setReminderMessage(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                  placeholder="ระบุข้อความเร่งรัดและรายละเอียด..."
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsReminderModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-700 font-bold hover:bg-slate-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-xs"
                >
                  บันทึกการเร่งรัด
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mark As Submitted Modal */}
      {isMarkSubmitModalOpen && submitTargetUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  บันทึกรับรายงาน {submitTargetUnit.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMarkSubmitModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleMarkSubmitted} className="space-y-3.5 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-0.5">
                <div className="font-bold">หน่วย: {submitTargetUnit.id} ({submitTargetUnit.campName})</div>
                <div className="text-[11px] text-emerald-700">
                  ผู้รับผิดชอบ: {submitTargetUnit.officerRank} {submitTargetUnit.officerName} ({submitTargetUnit.officerPhone})
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">เลือกแผนกที่ส่งรายงาน:</label>
                <select
                  value={submitTargetDept}
                  onChange={e => setSubmitTargetDept(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-hidden"
                >
                  <option value="admin">ฝ่ายอำนวยการ</option>
                  <option value="relations">ฝ่ายมวลชนสัมพันธ์</option>
                  <option value="disaster">ฝ่ายสาธารณภัย</option>
                  <option value="volunteer">ฝ่ายจิตอาสา</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">เลขที่หนังสือราชการ:</label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={e => setDocNumber(e.target.value)}
                  placeholder="เช่น ตช 0053.32/890"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">บันทึกเพิ่มเติม / ผลการตรวจสอบ:</label>
                <input
                  type="text"
                  value={submitRemarks}
                  onChange={e => setSubmitRemarks(e.target.value)}
                  placeholder="เช่น เอกสารครบถ้วนสมบูรณ์ รับเข้าสารบรรณอิเล็กทรอนิกส์แล้ว"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsMarkSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-700 font-bold hover:bg-slate-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-xs"
                >
                  ยืนยันบันทึกรับรายงาน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
