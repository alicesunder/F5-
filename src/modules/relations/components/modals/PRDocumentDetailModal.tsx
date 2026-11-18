import React from 'react';
import {
  X,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Download,
  Calendar,
  User,
  Building,
  Check,
} from 'lucide-react';
import { usePRIntel } from '../../context/PRIntelContext';
import { DocStatus } from '../../types/bppTypes';

export const PRDocumentDetailModal: React.FC = () => {
  const {
    selectedDocument,
    setSelectedDocument,
    updateDocumentStatus,
  } = usePRIntel();

  if (!selectedDocument) return null;

  const handleStatusChange = (status: DocStatus) => {
    updateDocumentStatus(selectedDocument.id, status);
    setSelectedDocument({
      ...selectedDocument,
      status,
    });
  };

  const isPassed = selectedDocument.status === 'passed';
  const isReview = selectedDocument.status === 'review_required';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#151821] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-4xl shadow-xl overflow-hidden flex flex-col max-h-[92vh] text-slate-900 dark:text-white">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/60 dark:bg-white/5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#27265B] dark:text-[#B3A0E8] bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded border border-slate-200 dark:border-white/10">
              {selectedDocument.docNumber}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-pink-50 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/40">
              {selectedDocument.type}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                isPassed
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40'
                  : isReview
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40'
                  : 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40'
              }`}
            >
              {isPassed ? 'ผ่านเกณฑ์สมบูรณ์' : isReview ? 'ต้องตรวจทาน' : 'รอการตรวจ'}
            </span>
          </div>

          <button
            onClick={() => setSelectedDocument(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two-column layout */}
        <div className="p-5 sm:p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
          {/* Left Column: Document Content & OCR Text (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <h2 className="text-base font-black text-[#1E1B4B] dark:text-white">
                {selectedDocument.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                จาก: {selectedDocument.sender} • ผู้ลงนาม: {selectedDocument.signatory}
              </p>
            </div>

            {/* Extracted Entities Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                ข้อมูลที่สกัดได้จาก OCR (Extracted Metadata):
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                <div>
                  <span className="text-slate-400">เลขที่หนังสือ:</span>
                  <p className="font-bold text-slate-800 dark:text-white font-mono">{selectedDocument.docNumber}</p>
                </div>
                <div>
                  <span className="text-slate-400">วันที่:</span>
                  <p className="font-bold text-slate-800 dark:text-white">{selectedDocument.displayDate}</p>
                </div>
                <div>
                  <span className="text-slate-400">ชั้นความเร็ว:</span>
                  <p className="font-bold text-slate-800 dark:text-white">{selectedDocument.speedClass || 'ปกติ'}</p>
                </div>
                <div>
                  <span className="text-slate-400">ผู้ลงนาม:</span>
                  <p className="font-bold text-slate-800 dark:text-white truncate">{selectedDocument.signatory}</p>
                </div>
              </div>
            </div>

            {/* Raw OCR Text Box */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  ข้อความดิบจาก OCR (Full OCR Transcript):
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  ความแม่นยำ {selectedDocument.scoreBreakdown?.ocrAccuracy || 96}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 dark:bg-[#0B0F19] text-slate-100 font-mono text-[11px] leading-relaxed max-h-[260px] overflow-y-auto whitespace-pre-wrap border border-slate-800 dark:border-white/10">
                {selectedDocument.ocrRawText || selectedDocument.ocrText}
              </div>
            </div>
          </div>

          {/* Right Column: AI Compliance & Checklist (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Score Banner */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  AI Compliance Score
                </span>
                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                  {selectedDocument.aiScore}/100
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-300 font-semibold">
                  {selectedDocument.aiVerdict}
                </p>
              </div>
              <Sparkles className="w-8 h-8 text-emerald-500 opacity-80" />
            </div>

            {/* AI Summary */}
            <div className="p-3.5 rounded-xl bg-pink-50/50 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-800/30">
              <span className="text-xs font-bold text-[#27265B] dark:text-[#B3A0E8] block mb-1">
                บทสรุปสาระสำคัญโดย AI:
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedDocument.aiSummary || selectedDocument.summary}
              </p>
            </div>

            {/* Checklist items */}
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-2">
                รายการตรวจความถูกต้อง (12 จุดระเบียบสารบรรณ):
              </span>
              <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1">
                {selectedDocument.checklist?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-between"
                  >
                    <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ถูกต้อง</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Validation Issues / Suggestions */}
            {selectedDocument.validationIssues && selectedDocument.validationIssues.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 space-y-1">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  ข้อสังเกตและคำแนะนำจาก AI:
                </span>
                {(selectedDocument.validationIssues || []).map((iss, idx) => (
                  <p key={idx} className="text-[11px] text-slate-700 dark:text-slate-300 pl-4">
                    • <strong className="text-slate-800 dark:text-slate-100">{iss.field}:</strong> {iss.message}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => setSelectedDocument(null)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {selectedDocument.status !== 'passed' && (
              <button
                onClick={() => handleStatusChange('passed')}
                className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>อนุมัติผ่านเกณฑ์</span>
              </button>
            )}
            {selectedDocument.status !== 'review_required' && (
              <button
                onClick={() => handleStatusChange('review_required')}
                className="flex-1 sm:flex-none px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                ส่งกลับแก้ไข
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
