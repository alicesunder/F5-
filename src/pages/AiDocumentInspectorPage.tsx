import React, { useState, useMemo } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { DocumentInspection } from '../types';
import {
  FileCheck2,
  Sparkles,
  Upload,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  BookOpen,
  ChevronRight,
  Trash2,
  Eye,
  ShieldCheck,
  ArrowUpRight,
  Copy,
  Layers,
} from 'lucide-react';
import { formatThaiDate } from '../utils/formatters';
import { InspectionDetailModal } from '../components/inspection/InspectionDetailModal';
import { NewInspectionModal } from '../components/inspection/NewInspectionModal';

export const AiDocumentInspectorPage: React.FC = () => {
  const { inspections, deleteInspection, showToast } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeInspection, setActiveInspection] = useState<DocumentInspection | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Statistics
  const stats = useMemo(() => {
    const total = inspections.length;
    if (total === 0) return { total: 0, avgScore: 0, passed: 0, needsRevision: 0, totalErrors: 0 };

    const sumScore = inspections.reduce((acc, item) => acc + item.score, 0);
    const avgScore = Math.round(sumScore / total);
    const passed = inspections.filter(item => item.score >= 80).length;
    const needsRevision = total - passed;
    const totalErrors = inspections.reduce((acc, item) => {
      const errCount = item.spellingErrors?.length ?? (item as any).spelling_errors?.length ?? 0;
      return acc + errCount;
    }, 0);

    return { total, avgScore, passed, needsRevision, totalErrors };
  }, [inspections]);

  // Filtered Inspections
  const filteredInspections = useMemo(() => {
    return inspections.filter(item => {
      const matchesSearch =
        item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedType === 'all' || item.documentType === selectedType;
      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'passed' && item.score >= 80) ||
        (selectedStatus === 'needs_revision' && item.score < 80);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [inspections, searchTerm, selectedType, selectedStatus]);

  const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (window.confirm(`ยืนยันการลบผลการตรวจสอบ "${name}" หรือไม่?`)) {
      deleteInspection(id);
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: 'ดีเยี่ยม', text: 'text-[#42695B]', bg: 'bg-[#42695B]/10 border-[#42695B]/20' };
    if (score >= 80) return { label: 'ผ่านเกณฑ์', text: 'text-[#234A78]', bg: 'bg-[#234A78]/10 border-[#234A78]/20' };
    if (score >= 70) return { label: 'พอใช้', text: 'text-[#A77A35]', bg: 'bg-[#A77A35]/10 border-[#A77A35]/20' };
    return { label: 'ต้องปรับปรุง', text: 'text-[#A84E4E]', bg: 'bg-[#A84E4E]/10 border-[#A84E4E]/20' };
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 01 — HERO / OPENING (Editorial Intelligence Command) */}
      <section className="glass rounded-[28px] p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-mono tracking-widest text-[rgba(17,19,21,0.5)] mb-2 uppercase">
              <span className="text-[#234A78] font-bold">INSPECTION / 02</span>
              <span>—</span>
              <span>SARABAN COMPLIANCE ENGINE</span>
              <span>—</span>
              <span>16 ELEMENTS</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#111315] leading-tight">
              ระบบ AI ตรวจสอบเอกสารราชการ
            </h2>
            <p className="text-xs sm:text-sm text-[rgba(17,19,21,0.62)] mt-2 font-normal leading-relaxed max-w-2xl">
              ตรวจความถูกต้องตามระเบียบงานสารบรรณ พ.ศ. ๒๕๒๖ (และแก้ไขเพิ่มเติม) ตรวจคำผิดตามพจนานุกรมราชบัณฑิตยสถาน คำราชาศัพท์ ตรวจชั้นความลับ และความปลอดภัยข้อมูลส่วนบุคคล (PDPA)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowGuideModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white/80 hover:bg-white border border-[rgba(17,19,21,0.12)] text-[#111315] text-xs font-medium transition shadow-2xs flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#234A78] stroke-[1.5]" />
              <span>เกณฑ์ ๑๖ องค์ประกอบ</span>
            </button>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#17324F] hover:bg-[#234A78] text-white text-xs font-medium transition shadow-2xs flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4 stroke-[1.5]" />
              <span>อัปโหลดตรวจเอกสารใหม่</span>
            </button>
          </div>
        </div>
      </section>

      {/* 02 — QUICK DROP / TEMPLATE TESTING ZONE */}
      <section className="glass rounded-[24px] p-6 border-dashed border-2 border-[rgba(17,19,21,0.12)] hover:border-[#234A78]/40 transition text-center cursor-pointer" onClick={() => setIsUploadModalOpen(true)}>
        <div className="max-w-md mx-auto space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-white/80 border border-[rgba(17,19,21,0.08)] flex items-center justify-center mx-auto text-[#234A78] shadow-2xs">
            <Sparkles className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="text-sm font-medium text-[#111315]">
            ลากและวางไฟล์เอกสาร (.docx, .pdf, .txt) หรือคลิกเพื่ออัปโหลด
          </h3>
          <p className="text-xs text-[rgba(17,19,21,0.5)] font-mono">
            // SUPPORTS THAI OFFICIAL CORRESPONDENCE STANDARDS
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono">
            <span className="text-[rgba(17,19,21,0.4)]">หรือทดสอบด้วยชุดเอกสารตัวอย่าง:</span>
            <span className="px-2 py-0.5 rounded-lg bg-white/70 border border-[rgba(17,19,21,0.08)] text-[#234A78]">
              บันทึกข้อความ
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-white/70 border border-[rgba(17,19,21,0.08)] text-[#234A78]">
              หนังสือภายนอก
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-white/70 border border-[rgba(17,19,21,0.08)] text-[#234A78]">
              คำสั่งฝ่าย
            </span>
          </div>
        </div>
      </section>

      {/* 03 — ASYMMETRIC INSPECTION METRICS */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              TOTAL INSPECTED
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">เอกสารที่ตรวจแล้ว</div>
            <div className="text-3xl font-light font-mono text-[#111315] mt-1">{stats.total}</div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">ฉบับในคลังข้อมูล</div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              AVG COMPLIANCE
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">คะแนนเฉลี่ยรวม</div>
            <div className="text-3xl font-light font-mono text-[#234A78] mt-1">{stats.avgScore}%</div>
          </div>
          <div className="text-[10px] font-mono text-[#42695B] mt-3 font-medium">เกณฑ์มาตรฐานสารบรรณ</div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              PASSED CODES
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">ผ่านเกณฑ์สมบูรณ์</div>
            <div className="text-3xl font-light font-mono text-[#42695B] mt-1">{stats.passed}</div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">คะแนน 80% ขึ้นไป</div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              REVISION REQUIRED
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">ต้องปรับปรุงแก้ไข</div>
            <div className="text-3xl font-light font-mono text-[#A84E4E] mt-1">{stats.needsRevision}</div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">คะแนนต่ำกว่า 80%</div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between col-span-2 lg:col-span-1">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              AI CORRECTIONS
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">คำผิดและจุดสังเกต</div>
            <div className="text-3xl font-light font-mono text-[#A77A35] mt-1">{stats.totalErrors}</div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">จุดที่ AI แนะนำแก้ไข</div>
        </div>
      </section>

      {/* 04 — SEARCH & FILTER BAR */}
      <section className="glass rounded-[22px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[rgba(17,19,21,0.4)] absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.5]" />
          <input
            type="text"
            placeholder="ค้นหาชื่อเอกสาร, รหัสผลตรวจ, หรือประเภทหนังสือราชการ..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/70 border border-[rgba(17,19,21,0.08)] text-xs text-[#111315] placeholder:text-[rgba(17,19,21,0.4)] focus:outline-hidden focus:border-[#234A78]/50 transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="text-xs rounded-xl border border-[rgba(17,19,21,0.08)] px-3 py-2 bg-white/80 text-[#111315] focus:outline-hidden"
          >
            <option value="all">ทุกประเภทเอกสาร</option>
            <option value="หนังสือภายใน">หนังสือภายใน</option>
            <option value="หนังสือภายนอก">หนังสือภายนอก</option>
            <option value="คำสั่ง">คำสั่ง</option>
            <option value="ประกาศ">ประกาศ</option>
            <option value="รายงานการประชุม">รายงานการประชุม</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="text-xs rounded-xl border border-[rgba(17,19,21,0.08)] px-3 py-2 bg-white/80 text-[#111315] focus:outline-hidden"
          >
            <option value="all">ทุกสถานะผลตรวจ</option>
            <option value="passed">ผ่านเกณฑ์ (≥ 80%)</option>
            <option value="needs_revision">ต้องแก้ไข (&lt; 80%)</option>
          </select>
        </div>
      </section>

      {/* 05 — INSPECTION RECORDS LIST */}
      <section className="space-y-3">
        {filteredInspections.length === 0 ? (
          <div className="glass rounded-[24px] p-12 text-center">
            <FileCheck2 className="w-10 h-10 text-[rgba(17,19,21,0.3)] mx-auto mb-2 stroke-[1.5]" />
            <h4 className="text-sm font-medium text-[#111315]">ไม่พบข้อมูลเอกสารที่ตรงกับเงื่อนไขการค้นหา</h4>
            <p className="text-xs text-[rgba(17,19,21,0.45)] mt-1 font-mono">// ZERO INSPECTION RESULTS MATCHED</p>
          </div>
        ) : (
          filteredInspections.map(item => {
            const badge = getScoreBadge(item.score);
            const checklist = item.checklistItems || (item as any).checklist || [];
            const passedCount = checklist.filter((c: any) => c.passed ?? (c.status === 'found')).length;
            const totalCount = checklist.length || 16;
            const spellingErrorsCount = item.spellingErrors?.length ?? (item as any).spelling_errors?.length ?? 0;
            const summaryString = typeof item.aiSummary === 'string'
              ? item.aiSummary
              : (item.aiSummary as any)?.executiveBrief || item.suggestions?.[0] || 'การตรวจสอบตามระเบียบงานสารบรรณเสร็จสิ้น';

            return (
              <div
                key={item.id}
                onClick={() => setActiveInspection(item)}
                className="glass rounded-[24px] p-4 sm:p-5 hover:border-[#234A78]/30 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Document details */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-[#17324F]/5 text-[#17324F] flex items-center justify-center shrink-0 group-hover:bg-[#17324F]/10 transition-colors">
                      <FileText className="w-5 h-5 stroke-[1.5]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-[#111315] line-clamp-1 group-hover:text-[#234A78] transition-colors">
                          {item.fileName}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-lg bg-white/80 border border-[rgba(17,19,21,0.06)] font-mono text-[rgba(17,19,21,0.6)]">
                          {item.documentType}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-[rgba(17,19,21,0.45)]">
                        <span>ID: {item.id}</span>
                        <span>•</span>
                        <span>ตรวจเมื่อ: {formatThaiDate(item.uploadedAt)}</span>
                        <span>•</span>
                        <span>ขนาด: {item.fileSize}</span>
                        {spellingErrorsCount > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-[#A84E4E] font-medium">คำผิด {spellingErrorsCount} แห่ง</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-[rgba(17,19,21,0.6)] line-clamp-1 mt-1.5 leading-relaxed font-normal">
                        {summaryString}
                      </p>
                    </div>
                  </div>

                  {/* Right: Score & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[rgba(17,19,21,0.06)]">
                    {/* Checklist progress bar */}
                    <div className="text-right hidden md:block">
                      <div className="text-xs font-mono text-[rgba(17,19,21,0.5)] mb-1">
                        องค์ประกอบ <span className="font-semibold text-[#111315]">{passedCount}/{totalCount}</span>
                      </div>
                      <div className="w-24 h-1.5 bg-[rgba(17,19,21,0.06)] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            passedCount >= 14 ? 'bg-[#42695B]' : passedCount >= 11 ? 'bg-[#234A78]' : 'bg-[#A77A35]'
                          }`}
                          style={{ width: `${(passedCount / totalCount) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Score Badge */}
                    <div className="flex items-center gap-2.5">
                      <div className={`px-3 py-1.5 rounded-xl border text-center ${badge.bg}`}>
                        <div className={`text-base font-bold font-mono leading-none ${badge.text}`}>{item.score}</div>
                        <div className={`text-[9px] font-mono tracking-wider mt-0.5 ${badge.text}`}>{badge.label}</div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            setActiveInspection(item);
                          }}
                          title="ดูผลการวิเคราะห์ฉบับเต็ม"
                          className="p-2 text-[rgba(17,19,21,0.4)] hover:text-[#234A78] hover:bg-white rounded-xl transition"
                        >
                          <Eye className="w-4 h-4 stroke-[1.5]" />
                        </button>
                        <button
                          type="button"
                          onClick={e => handleDelete(e, item.id, item.fileName)}
                          title="ลบรายการตรวจ"
                          className="p-2 text-[rgba(17,19,21,0.4)] hover:text-[#A84E4E] hover:bg-white rounded-xl transition"
                        >
                          <Trash2 className="w-4 h-4 stroke-[1.5]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* 06 — DETAIL MODAL */}
      {activeInspection && (
        <InspectionDetailModal
          inspection={activeInspection}
          onClose={() => setActiveInspection(null)}
        />
      )}

      {/* 07 — NEW INSPECTION UPLOAD MODAL */}
      <NewInspectionModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={newInspection => {
          setActiveInspection(newInspection);
        }}
      />

      {/* 08 — 16 ELEMENTS GUIDE MODAL */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-[#111315]/40 backdrop-blur-[12px] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white/95 backdrop-blur-[24px] rounded-[28px] shadow-[0_30px_80px_rgba(18,23,27,0.15)] border border-[rgba(17,19,21,0.1)] w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden text-[#111315]">
            <div className="px-6 py-4 border-b border-[rgba(17,19,21,0.08)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#234A78] stroke-[1.5]" />
                <h3 className="text-sm font-medium text-[#111315]">
                  เกณฑ์มาตรฐาน ๑๖ องค์ประกอบหนังสือราชการไทย (ระเบียบสำนักนายกรัฐมนตรีฯ)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="text-[rgba(17,19,21,0.4)] hover:text-[#111315] p-1.5 rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { no: 1, title: 'ชั้นความลับ', desc: 'ลับที่สุด, ลับมาก, ลับ หรือทั่วไป (ประทับสีแดงกึ่งกลางหน้า)' },
                  { no: 2, title: 'ชั้นความเร็ว', desc: 'ด่วนที่สุด, ด่วนมาก, ด่วน (ตัวอักษรสีแดงเหนือเลขที่หนังสือ)' },
                  { no: 3, title: 'ที่ / เลขที่หนังสือ', desc: 'รหัสพยัญชนะประจำกระทรวง/กรม ตามด้วยเลขทะเบียนคุม เช่น กห ๐๔๐๑/....' },
                  { no: 4, title: 'ส่วนราชการเจ้าของเรื่อง', desc: 'ระบุชื่อหน่วยงานเจ้าของเรื่องให้ชัดเจนพร้อมเบอร์โทร' },
                  { no: 5, title: 'วัน เดือน ปี', desc: 'ตัวเลขไทย ระบุเดือนเต็ม ไม่มีคำว่า "วันที่" หรือ "พ.ศ."' },
                  { no: 6, title: 'เรื่อง', desc: 'สรุปใจความสั้น กะทัดรัด ชัดเจน รู้ว่าเป็นเรื่องอะไร' },
                  { no: 7, title: 'คำขึ้นต้น', desc: 'ใช้ให้ถูกต้องตามฐานะ เช่น "กราบเรียน" หรือ "เรียน"' },
                  { no: 8, title: 'อ้างถึง', desc: 'ระบุหนังสือที่เคยมีติดต่อกัน (ถ้ามี) ให้ถูกต้อง' },
                  { no: 9, title: 'สิ่งที่ส่งมาด้วย', desc: 'ระบุเอกสารหรือสิ่งของที่ส่งไปพร้อมกัน พร้อมจำนวน' },
                  { no: 10, title: 'ข้อความภาคเหตุ', desc: 'ย่อหน้าแรก อ้างถึงเหตุผล ความเป็นมา หรือคำสั่งเดิม' },
                  { no: 11, title: 'ข้อความภาคความประสงค์', desc: 'ย่อหน้าที่สอง ระบุความต้องการ หรือสิ่งที่ขอให้ดำเนินการ' },
                  { no: 12, title: 'ข้อความภาคสรุป', desc: 'ย่อหน้าสุดท้าย ระบุวัตถุประสงค์ เช่น เพื่อโปรดพิจารณา' },
                  { no: 13, title: 'คำลงท้าย', desc: 'สอดคล้องกับคำขึ้นต้น เช่น "ขอแสดงความนับถือ"' },
                  { no: 14, title: 'การลงชื่อและตำแหน่ง', desc: 'พิมพ์ชื่อเต็มและยศในวงเล็บใต้ลายมือชื่อ พร้อมตำแหน่ง' },
                  { no: 15, title: 'ส่วนราชการ/โทร/อีเมล', desc: 'มุมซ้ายล่าง ระบุฝ่ายงาน ผู้ประสานงาน เบอร์โทรศัพท์' },
                  { no: 16, title: 'ตราครุฑ / เครื่องหมาย', desc: 'ตราครุฑมาตรฐานสูง ๓ ซม. หรือ ๑.๕ ซม. จัดวางกึ่งกลาง' },
                ].map(item => (
                  <div key={item.no} className="p-3.5 rounded-2xl bg-[rgba(17,19,21,0.03)] border border-[rgba(17,19,21,0.06)]">
                    <div className="font-semibold text-[#111315] text-xs mb-1 font-mono">
                      {item.no}. {item.title}
                    </div>
                    <div className="text-[rgba(17,19,21,0.6)] text-[11px] leading-relaxed">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-3.5 border-t border-[rgba(17,19,21,0.08)] flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-1.5 bg-[#17324F] hover:bg-[#234A78] text-white rounded-xl text-xs font-medium cursor-pointer"
              >
                เข้าใจแล้ว
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
