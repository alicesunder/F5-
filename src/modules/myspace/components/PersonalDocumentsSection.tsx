import React, { useState } from 'react';
import {
  FolderLock,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  Building,
  Calendar,
  AlertCircle,
  ExternalLink,
  Printer,
  FileSpreadsheet,
} from 'lucide-react';
import { PERSONAL_DOCUMENTS } from '../../../data/personalData';
import { PersonalDocumentItem } from '../../../types';

interface PersonalDocumentsSectionProps {
  onOpenPolisModal: () => void;
  onOpenPayslipModal: (month: string) => void;
}

export const PersonalDocumentsSection: React.FC<PersonalDocumentsSectionProps> = ({
  onOpenPolisModal,
  onOpenPayslipModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  const categories = [
    'all',
    'ประวัติ ก.พ.7',
    'เอกสารเงินเดือน',
    'หนังสือรับรอง',
    'คำสั่งแต่งตั้ง',
    'เอกสารฝึกอบรม',
  ];

  const filtered = PERSONAL_DOCUMENTS.filter(doc => {
    if (activeCategory === 'all') return true;
    return doc.category === activeCategory;
  });

  const handleDocumentAction = (doc: PersonalDocumentItem) => {
    if (doc.category === 'ประวัติ ก.พ.7') {
      onOpenPolisModal();
      return;
    }
    if (doc.category === 'เอกสารเงินเดือน') {
      onOpenPayslipModal('2569-08');
      return;
    }
    // For other documents simulate official download
    setDownloadSuccessToast(`กำลังดาวน์โหลดเอกสารทางการ "${doc.title}"`);
    setTimeout(() => setDownloadSuccessToast(null), 3000);
  };

  const getDocTypeBadge = (doc: PersonalDocumentItem) => {
    if (doc.category === 'ประวัติ ก.พ.7' || doc.category === 'คำสั่งแต่งตั้ง') {
      return { type: 'PDF', bg: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20' };
    }
    if (doc.category === 'เอกสารเงินเดือน') {
      return { type: 'PDF', bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' };
    }
    if (doc.category === 'หนังสือรับรอง') {
      return { type: 'DOC', bg: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20' };
    }
    return { type: 'PDF', bg: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20' };
  };

  return (
    <div className="rounded-3xl p-5 sm:p-7 bg-white/90 dark:bg-[#151A22]/90 border border-slate-200/80 dark:border-white/10 shadow-[0_10px_30px_rgba(30,25,50,0.06)] backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <FolderLock className="w-4 h-4 text-[#2583D8]" />
            <span className="text-xs font-bold text-[#2583D8] dark:text-blue-400 uppercase tracking-wider">
              ศูนย์จัดเก็บเอกสารราชการส่วนบุคคล
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            เอกสารของฉัน (Personal Documents Hub)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            สลิปเงินเดือน หนังสือรับรอง ทะเบียนประวัติ ทบ.1/ก.พ.7 และคำสั่งแต่งตั้งทางการ
          </p>
        </div>

        {/* Highlight Action: View Official POLIS Document */}
        <button
          type="button"
          onClick={onOpenPolisModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2583D8] hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-500/20 cursor-pointer self-start sm:self-auto"
        >
          <FileText className="w-4 h-4" />
          <span>เปิดดูทะเบียนประวัติ POLIS (ทบ.1)</span>
        </button>
      </div>

      {/* Success Toast */}
      {downloadSuccessToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>{downloadSuccessToast}</span>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex-shrink-0 ${
              activeCategory === cat
                ? 'bg-[#2583D8] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            {cat === 'all' ? 'เอกสารทั้งหมด' : cat}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(doc => {
          const isPolis = doc.category === 'ประวัติ ก.พ.7';
          const isSlip = doc.category === 'เอกสารเงินเดือน';
          const badge = getDocTypeBadge(doc);

          return (
            <div
              key={doc.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                isPolis
                  ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/80 dark:border-blue-500/30 shadow-xs'
                  : 'bg-white dark:bg-[#1A1F29]/60 border-slate-200/80 dark:border-white/10 hover:border-blue-400/40'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* File Format Badge (PDF/DOC) */}
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black border font-mono ${badge.bg}`}>
                      {badge.type}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                      {doc.category}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {doc.fileSize}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {doc.title}
                </h3>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>ออกเมื่อ: {doc.issueDate}</span>
                  <span>•</span>
                  <span>{doc.version}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {doc.status}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDocumentAction(doc)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-blue-50 dark:hover:bg-blue-500/20 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-300 text-xs font-semibold transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isPolis ? 'เปิดดู ทบ.1' : isSlip ? 'เปิดดูสลิป' : 'ดูตัวอย่าง'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDocumentAction(doc)}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                    title="ดาวน์โหลดไฟล์"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
