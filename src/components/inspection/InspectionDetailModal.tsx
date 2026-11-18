import React, { useState } from 'react';
import { DocumentInspection, ChecklistItem, SpellingError, InspectionRecommendation } from '../../types';
import {
  X,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  Award,
  BookOpen,
  HelpCircle,
  FileText
} from 'lucide-react';
import { formatThaiDate } from '../../utils/formatters';

interface InspectionDetailModalProps {
  inspection: DocumentInspection | null;
  onClose: () => void;
  onReinspect?: (id: string) => void;
}

export const InspectionDetailModal: React.FC<InspectionDetailModalProps> = ({
  inspection,
  onClose,
  onReinspect,
}) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'errors' | 'recommendations' | 'rawText'>('checklist');

  if (!inspection) return null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: 'ยอดเยี่ยม (พร้อมลงนาม)', color: 'bg-emerald-500' };
    if (score >= 80) return { label: 'ดี (แก้ไขเล็กน้อย)', color: 'bg-blue-500' };
    if (score >= 70) return { label: 'พอใช้ (มีข้อผิดพลาดสำคัญ)', color: 'bg-amber-500' };
    return { label: 'ต้องแก้ไขปรับปรุง (ไม่ผ่านเกณฑ์)', color: 'bg-rose-500' };
  };

  const scoreBadge = getScoreBadge(inspection.score);

  const items: ChecklistItem[] = inspection.checklistItems || (inspection.checklist?.map((c, idx) => ({
    id: `CHK-${idx + 1}`,
    orderNumber: idx + 1,
    title: c.label?.replace(/^\d+\.\s*/, '') || c.key || `ข้อ ${idx + 1}`,
    description: c.details || c.label || '',
    passed: c.status === 'found',
    foundValue: c.details,
    suggestedFix: c.suggestion,
  })) || []);

  const errors: SpellingError[] = inspection.spellingErrors || (inspection.issues?.map((issue, idx) => ({
    word: issue,
    suggestedWord: 'ตรวจสอบความถูกต้อง',
    line: idx + 1,
    explanation: issue,
  })) || []);

  const recs: InspectionRecommendation[] = inspection.recommendations || (typeof inspection.aiSummary === 'object' && Array.isArray(inspection.aiSummary?.recommendations) ? inspection.aiSummary.recommendations.map((r, i) => ({
    title: `ข้อเสนอแนะที่ ${i + 1}`,
    suggestion: r,
  })) : (Array.isArray(inspection.suggestions) ? inspection.suggestions.map((s, i) => ({
    title: `ข้อเสนอแนะที่ ${i + 1}`,
    suggestion: s,
  })) : []));

  const summaryText = typeof inspection.aiSummary === 'string'
    ? inspection.aiSummary
    : inspection.aiSummary?.executiveBrief || inspection.aiSummary?.pointsFound?.join(' • ') || 'เอกสารได้รับการตรวจสอบตามเกณฑ์สารบรรณเรียบร้อย';

  const passedItemsCount = items.filter(item => item.passed).length;
  const totalItemsCount = items.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-sky-600 flex items-center justify-center text-white shadow-sm">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-800 line-clamp-1">{inspection.fileName}</h3>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700 font-mono">
                  {inspection.documentType}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                รหัสตรวจ: <span className="font-mono text-slate-700">{inspection.id}</span> • วันที่ตรวจ:{' '}
                {formatThaiDate(inspection.uploadedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              title="พิมพ์รายงาน"
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Score & Executive Summary Card */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-sky-50/30">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Score Ring / Metric */}
            <div className="md:col-span-4 flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-2 ${getScoreColor(inspection.score)}`}>
                <span className="text-3xl font-black leading-none">{inspection.score}</span>
                <span className="text-[10px] font-medium opacity-80 mt-0.5">เต็ม 100</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`w-2 h-2 rounded-full ${scoreBadge.color}`}></span>
                  <span className="text-xs font-semibold text-slate-800">{scoreBadge.label}</span>
                </div>
                <p className="text-xs text-slate-500">
                  ผ่านเกณฑ์สารบรรณ <span className="font-bold text-slate-700">{passedItemsCount}</span> จาก {totalItemsCount} จุด
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[11px]">
                    คำผิด {errors.length} แห่ง
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[11px]">
                    ข้อแนะนำ {recs.length} ข้อ
                  </span>
                </div>
              </div>
            </div>

            {/* AI Summary Text */}
            <div className="md:col-span-8">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-indigo-700">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>ผลวิเคราะห์และสรุปภาพรวมจากระบบ AI สารบรรณ</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-white/80 p-3.5 rounded-xl border border-slate-200/60">
                {summaryText}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-slate-200 bg-white gap-2 text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'checklist'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>16 องค์ประกอบระเบียบสารบรรณ ({passedItemsCount}/{totalItemsCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('errors')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'errors'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>คำผิดและสำนวนภาษา ({errors.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'recommendations'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>ข้อเสนอแนะเชิงลึก ({recs.length})</span>
          </button>
          {inspection.extractedText && (
            <button
              onClick={() => setActiveTab('rawText')}
              className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === 'rawText'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>เนื้อหาที่สกัดได้</span>
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'checklist' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200/80 flex items-center justify-between">
                <span>
                  เกณฑ์ตรวจสอบตาม <strong>ระเบียบสำนักนายกรัฐมนตรี ว่าด้วยงานสารบรรณ พ.ศ. ๒๕๒๖ และที่แก้ไขเพิ่มเติม</strong>
                </span>
                <span className="font-semibold text-indigo-600">
                  ความถูกต้อง: {Math.round((passedItemsCount / totalItemsCount) * 100)}%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map(item => (
                  <div
                    key={item.id || item.key || item.orderNumber}
                    className={`p-3.5 rounded-xl border transition-all ${
                      item.passed
                        ? 'bg-emerald-50/30 border-emerald-200/80 hover:bg-emerald-50/50'
                        : 'bg-rose-50/30 border-rose-200 hover:bg-rose-50/50 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5">
                          {item.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-800">
                              {item.orderNumber ? `${item.orderNumber}. ` : ''}{item.title || item.label}
                            </span>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                item.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {item.passed ? 'ถูกต้อง' : 'ไม่ผ่าน'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-normal">{item.description || item.details}</p>

                          {/* Found Value or Issue */}
                          {item.foundValue && (
                            <div className="mt-2 text-[11px] bg-white/80 px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-700">
                              <span className="text-slate-400">ค่าที่ตรวจพบ: </span>
                              <span className="font-mono">{item.foundValue}</span>
                            </div>
                          )}

                          {!item.passed && item.suggestedFix && (
                            <div className="mt-2 text-[11px] bg-amber-50/80 px-2.5 py-1.5 rounded-md border border-amber-200 text-amber-900">
                              <span className="font-semibold text-amber-700">วิธีแก้ไขที่ถูกต้อง: </span>
                              {item.suggestedFix}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'errors' && (
            <div className="space-y-4">
              {errors.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-700">ไม่พบคำผิดหรือสำนวนภาษาที่ไม่ถูกต้อง</p>
                  <p className="text-xs text-slate-400 mt-1">
                    การสะกดคำและไวยากรณ์สอดคล้องกับพจนานุกรมฉบับราชบัณฑิตยสถานเรียบร้อย
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs text-slate-500 mb-2">
                    พบคำที่พิมพ์ผิด คำทับศัพท์ไม่ถูกต้อง หรือสำนวนที่ไม่เป็นทางการตามระเบียบงานสารบรรณทั้งหมด{' '}
                    <span className="font-semibold text-rose-600">{errors.length} จุด</span>
                  </div>
                  {errors.map((err, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 line-through text-xs font-semibold font-mono">
                            {err.word || err.original}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold font-mono">
                            {err.suggestedWord || err.correction}
                          </span>
                          {err.line && (
                            <span className="text-[11px] text-slate-400 ml-2">บรรทัดที่ {err.line}</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{err.explanation || err.reason}</p>
                      </div>
                      <div className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 shrink-0 self-start sm:self-auto">
                        ราชบัณฑิตยสถาน
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 mb-2">
                ข้อเสนอแนะเชิงลึกเพื่อยกระดับความถูกต้อง ความกระชับ และความเป็นมืออาชีพของเอกสารราชการ:
              </div>
              {recs.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/40 via-white to-transparent shadow-2xs flex items-start gap-3.5"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-slate-800">{rec.title}</h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rec.suggestion}</p>
                    {rec.standardRef && (
                      <span className="inline-block mt-2 text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded">
                        อ้างอิง: {rec.standardRef}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'rawText' && inspection.extractedText && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>ข้อความที่สกัดได้จากไฟล์ (OCR / Document Parser)</span>
                <span>{inspection.extractedText.length} ตัวอักษร</span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed max-h-96 overflow-y-auto">
                {inspection.extractedText}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            ระบบตรวจสอบด้วยเทคโนโลยี AI Smart Administrative Parser v2.4
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
