import React, { useState, useMemo } from 'react';
import { DocumentInspection } from '../../types';
import {
  ShieldCheck,
  Search,
  Sparkles,
  FileCheck2,
  Calendar,
  UserCheck,
  ChevronRight,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { formatThaiDate } from '../../utils/formatters';

interface VettedInspectionsCatalogProps {
  inspections: DocumentInspection[];
  onSelectVettedForDraft: (doc: DocumentInspection) => void;
  onViewInspectionDetail?: (doc: DocumentInspection) => void;
}

export const VettedInspectionsCatalog: React.FC<VettedInspectionsCatalogProps> = ({
  inspections,
  onSelectVettedForDraft,
  onViewInspectionDetail,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'high' | 'passed'>('all');
  const [activeDocPreview, setActiveDocPreview] = useState<DocumentInspection | null>(null);

  // Available document types
  const docTypes = useMemo(() => {
    const types = new Set<string>();
    inspections.forEach((i) => {
      if (i.documentType) types.add(i.documentType);
    });
    return Array.from(types);
  }, [inspections]);

  const filteredDocs = useMemo(() => {
    return inspections.filter((doc) => {
      const matchType = selectedType === 'all' || doc.documentType === selectedType;
      const matchScore =
        scoreFilter === 'all' ||
        (scoreFilter === 'high' && doc.score >= 90) ||
        (scoreFilter === 'passed' && doc.score >= 80);

      const q = searchTerm.toLowerCase();
      const matchSearch =
        doc.fileName.toLowerCase().includes(q) ||
        (doc.subject && doc.subject.toLowerCase().includes(q)) ||
        (doc.documentNumber && doc.documentNumber.toLowerCase().includes(q)) ||
        (doc.sender && doc.sender.toLowerCase().includes(q));

      return matchType && matchScore && matchSearch;
    });
  }, [inspections, selectedType, scoreFilter, searchTerm]);

  const getScoreBadge = (score: number) => {
    if (score >= 90) {
      return {
        label: 'สมบูรณ์ (ดีเยี่ยม)',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
      };
    }
    if (score >= 80) {
      return {
        label: 'ผ่านเกณฑ์มาตรฐาน',
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
      };
    }
    return {
      label: 'มีจุดควรแก้ไข',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
    };
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-emerald-900/10 via-teal-900/5 to-slate-50 border border-emerald-200/60 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                คลังเอกสารที่ผ่านการตรวจรับรองด้วย AI (Vetted Documents)
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                {inspections.length} ฉบับในคลัง
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              เอกสารราชการจริงที่ผ่านการวิเคราะห์ ๑๖ องค์ประกอบระเบียบงานสารบรรณด้วยระบบ AI Document Inspector มีคะแนนความสมบูรณ์สูง สามารถใช้เป็นเอกสารอ้างอิงและต้นแบบในการร่างหนังสือฉบับใหม่ได้ทันที
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาเอกสารเก่าที่ผ่านการตรวจ เช่น เลขที่หนังสือ, เรื่อง, หน่วยงาน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Type filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
          >
            <option value="all">ชนิดเอกสาร: ทั้งหมด</option>
            {docTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Score filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setScoreFilter('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition cursor-pointer ${
                scoreFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              type="button"
              onClick={() => setScoreFilter('high')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition cursor-pointer ${
                scoreFilter === 'high'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ดีเยี่ยม (90+)
            </button>
            <button
              type="button"
              onClick={() => setScoreFilter('passed')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition cursor-pointer ${
                scoreFilter === 'passed'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ผ่านเกณฑ์ (80+)
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Inspected Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => {
          const badge = getScoreBadge(doc.score);
          const executiveBrief =
            typeof doc.aiSummary === 'object' && doc.aiSummary !== null
              ? doc.aiSummary.executiveBrief
              : typeof doc.aiSummary === 'string'
              ? doc.aiSummary
              : 'ผ่านการตรวจสอบความถูกต้องตามระเบียบงานสารบรรณ';

          return (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-emerald-500/40 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {doc.documentNumber || doc.id}
                  </span>
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.bg}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    <span>{doc.score}/100</span>
                  </div>
                </div>

                <div className="text-[11px] font-medium text-slate-500 mb-1">
                  {doc.documentType} • {doc.sender || 'ฝ่ายอำนวยการ ๕'}
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                  {doc.subject || doc.fileName}
                </h3>

                <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                  "{executiveBrief}"
                </p>

                {doc.reference && doc.reference !== '-' && (
                  <p className="text-[11px] text-slate-500 mt-2 truncate">
                    <span className="font-semibold">อ้างถึง:</span> {doc.reference}
                  </p>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActiveDocPreview(doc)}
                  className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer transition"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>ดูผลตรวจ</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectVettedForDraft(doc)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ใช้เป็นต้นแบบร่างใหม่</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
          <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">ไม่พบเอกสารที่ตรงกับเงื่อนไข</p>
          <p className="text-xs text-slate-400 mt-1">ลองล้างตัวกรองหรือเปลี่ยนคำค้นหา</p>
        </div>
      )}

      {/* Inspection Quick Preview Modal */}
      {activeDocPreview && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setActiveDocPreview(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-emerald-700">
                    {activeDocPreview.documentNumber || activeDocPreview.id}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                    คะแนนสารบรรณ {activeDocPreview.score}/100
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {activeDocPreview.subject || activeDocPreview.fileName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveDocPreview(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="font-semibold text-slate-500">ชนิดเอกสาร:</span>{' '}
                  <span className="font-bold text-slate-900">{activeDocPreview.documentType}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">วันที่:</span>{' '}
                  <span>{activeDocPreview.documentDate || activeDocPreview.uploadedAt}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">ผู้ส่ง:</span>{' '}
                  <span>{activeDocPreview.sender || '-'}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">ผู้รับ:</span>{' '}
                  <span>{activeDocPreview.recipient || '-'}</span>
                </div>
              </div>

              {activeDocPreview.checklist && activeDocPreview.checklist.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">
                    ผลตรวจ ๑๖ องค์ประกอบระเบียบสารบรรณ:
                  </h4>
                  <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    {activeDocPreview.checklist.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-[11px] p-1.5 bg-white rounded-lg border border-slate-100"
                      >
                        <span className="font-medium text-slate-800">{item.label}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            item.status === 'found'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {item.status === 'found' ? 'ถูกต้อง' : 'ควรปรับปรุง'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveDocPreview(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                ปิด
              </button>
              <button
                type="button"
                onClick={() => {
                  const d = activeDocPreview;
                  setActiveDocPreview(null);
                  onSelectVettedForDraft(d);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>ใช้เป็นต้นแบบร่างใหม่</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
