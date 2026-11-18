import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  Eye,
  FileCheck,
  Search,
  ArrowRight,
} from 'lucide-react';
import { usePRIntel } from '../../context/PRIntelContext';
import { SAMPLE_TEMPLATES } from '../../data/documentsData';
import { GovDocument, DocStatus } from '../../types/bppTypes';

export const PRDocumentScannerView: React.FC = () => {
  const { addDocument, setSelectedDocument, setActivePRView } = usePRIntel();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(SAMPLE_TEMPLATES[0]?.id ?? '');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scannedResult, setScannedResult] = useState<GovDocument | null>(null);

  const scanSteps = [
    'กำลังประมวลผลไฟล์ภาพและเตรียมความละเอียด...',
    'กำลังทำ Optical Character Recognition (OCR)...',
    'กำลังสกัดข้อมูลส่วนราชการ เลขที่หนังสือ และวันเดือนปี...',
    'กำลังตรวจสอบความสอดคล้องตามระเบียบสำนักนายกรัฐมนตรีฯ พ.ศ. 2526...',
    'ประเมินคะแนน AI Compliance Score และสร้างบทสรุปผู้บริหาร...',
  ];

  const handleStartScan = (templateId?: string) => {
    const tpl = SAMPLE_TEMPLATES.find((t) => t.id === (templateId || selectedTemplateId)) || SAMPLE_TEMPLATES[0];
    if (!tpl) return; // ยังไม่ได้เชื่อมต่อระบบ OCR/AI จริง จึงไม่สร้างเอกสารสมมติ
    setIsScanning(true);
    setScanStep(0);
    setScannedResult(null);

    // Simulate multi-step AI scan
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < scanSteps.length) {
        setScanStep(step);
      } else {
        clearInterval(interval);
        setIsScanning(false);

        const newDoc: GovDocument = {
          id: `doc-scan-${Date.now()}`,
          docNumber: tpl.docNumber,
          title: tpl.title,
          type: tpl.type,
          date: '2026-09-07',
          displayDate: tpl.date,
          sender: tpl.sender,
          receiver: tpl.receiver,
          recipient: tpl.receiver,
          signatory: tpl.signatory,
          signatoryPosition: 'ผู้บังคับบัญชา',
          speedClass: tpl.type === 'ข่าวแจกสื่อมวลชน' ? 'ด่วนมาก' : 'ปกติ',
          secretClass: 'ปกติ',
          aiScore: tpl.score,
          scoreBreakdown: {
            ocrAccuracy: Math.min(99, tpl.score + 3),
            requiredFields: Math.max(80, tpl.score - 2),
            formatting: Math.min(98, tpl.score + 1),
            completeness: Math.max(78, tpl.score - 4),
          },
          status: tpl.status,
          reviewer: 'ร.ต.อ. ธวัชชัย (ผู้ตรวจผ่าน AI)',
          aiSummary: tpl.summary,
          summary: tpl.summary,
          ocrRawText: tpl.rawText,
          ocrText: tpl.rawText,
          aiVerdict: tpl.score >= 90 ? 'สมบูรณ์ตามระเบียบงานสารบรรณ' : 'มีข้อควรปรับปรุงรูปแบบเล็กน้อย',
          issuesCount: (tpl.validationIssues || []).length,
          issuesList: (tpl.validationIssues || []).map((iss) => ({
            category: iss.field,
            description: iss.message,
            suggestion: iss.type === 'warning' ? 'ควรปรับปรุงระยะหรือข้อความตามระเบียบ' : undefined,
          })),
          detectedEntities: {
            date: tpl.date,
            docNumber: tpl.docNumber,
            subject: tpl.title,
            organization: tpl.sender,
            receiver: tpl.receiver,
            signatory: tpl.signatory,
          },
          validationIssues: tpl.validationIssues,
          checklist: [
            { name: 'ตราครุฑ / หัวหนังสือ', status: 'pass' },
            { name: 'เลขที่หนังสือและปี พ.ศ.', status: 'pass' },
            { name: 'วัน เดือน ปี', status: 'pass' },
            { name: 'เรื่องและเรียน', status: 'pass' },
            { name: 'คำขึ้นต้นและคำลงท้าย', status: 'pass' },
            { name: 'เนื้อความสารบรรณ', status: 'pass' },
            { name: 'ลายมือชื่อผู้บังคับบัญชา', status: 'pass' },
            { name: 'ส่วนราชการเจ้าของเรื่อง', status: 'pass' },
          ],
          activityLog: [
            { time: '10:00', action: 'อัปโหลดไฟล์เข้าระบบ AI Scanner', operator: 'Officer User' },
            { time: '10:00', action: 'OCR สกัดข้อความสำเร็จ', operator: 'AI OCR Engine' },
            { time: '10:01', action: `ประเมินคะแนน ${tpl.score}/100 ผ่านเกณฑ์`, operator: 'AI Compliance Checker' },
          ],
          fileSize: '1.8 MB',
          fileFormat: 'PDF',
          uploadTimestamp: new Date().toISOString(),
        };

        setScannedResult(newDoc);
        addDocument(newDoc);
      }
    }, 600);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-pink-50 text-pink-700 border border-pink-200">
                <Sparkles className="w-5 h-5 text-[#27265B]" />
              </span>
              <div>
                <h1 className="text-xl font-black text-[#1E1B4B] tracking-tight">
                  ระบบสแกนและตรวจสอบเอกสารสารบรรณอัจฉริยะ (AI Document Scanner)
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  ถอดรหัสข้อความภาษาไทย (OCR) ตรวจสอบความถูกต้องตามระเบียบงานสารบรรณ พ.ศ. 2526 และประเมินคะแนนอัตโนมัติ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Upload & Templates (5 cols) + Scanner / Result Display (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Input / Upload / Template Selection */}
        <div className="lg:col-span-5 space-y-4">
          {/* Upload Area */}
          <div className="bg-white border-2 border-dashed border-pink-200 hover:border-pink-400 rounded-2xl p-6 text-center transition cursor-pointer bg-slate-50/50 group">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              ลากและวางไฟล์เอกสาร หรือคลิกเพื่อเลือกไฟล์
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              รองรับไฟล์ PDF, JPG, PNG ขนาดไม่เกิน 25 MB
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-mono">
                PDF
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-mono">
                JPEG
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-mono">
                PNG
              </span>
            </div>
          </div>

          {/* Preset Sample Templates */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                เลือกเอกสารตัวอย่างทดสอบระบบ AI
              </h3>
              <span className="text-[10px] text-pink-700 font-semibold">
                {SAMPLE_TEMPLATES.length} รูปแบบ
              </span>
            </div>

            {SAMPLE_TEMPLATES.length === 0 && (
              <p className="text-xs text-slate-500">ฟีเจอร์สแกนเอกสารด้วย AI ยังไม่ได้เชื่อมต่อกับบริการ OCR จึงยังใช้งานไม่ได้ในขณะนี้</p>
            )}
            {SAMPLE_TEMPLATES.length === 0 && (
              <p className="text-xs text-slate-500">ฟีเจอร์สแกนเอกสารด้วย AI ยังไม่ได้เชื่อมต่อกับบริการ OCR จึงยังใช้งานไม่ได้ในขณะนี้</p>
            )}
            <div className="space-y-2">
              {SAMPLE_TEMPLATES.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-pink-50/70 border-pink-300 ring-1 ring-pink-400'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-white border border-slate-200 font-bold text-slate-700">
                          {tpl.type}
                        </span>
                        <span className="font-mono text-[10px] text-[#27265B] font-bold">
                          {tpl.docNumber}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 truncate">{tpl.title}</p>
                      <p className="text-[10px] text-slate-400 truncate">จาก: {tpl.sender}</p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTemplateId(tpl.id);
                        handleStartScan(tpl.id);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#27265B] text-white text-[11px] font-semibold hover:bg-[#1E1B4B] transition shrink-0"
                    >
                      สแกน
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => handleStartScan()}
              disabled={isScanning}
              className="w-full py-2.5 bg-[#27265B] hover:bg-[#1E1B4B] disabled:opacity-60 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 mt-2"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-pink-300" />
                  <span>กำลังสแกนและประเมินผล...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-pink-300" />
                  <span>เริ่มสแกนเอกสารที่เลือก</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Scanner Progress / Live AI Result */}
        <div className="lg:col-span-7 space-y-4">
          {isScanning ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs text-center space-y-4 min-h-[400px] flex flex-col items-center justify-center">
              <div className="p-4 rounded-2xl bg-pink-50 text-pink-700 animate-bounce">
                <Sparkles className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#1E1B4B]">
                  AI OCR & Compliance Engine กำลังทำงาน
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-mono">
                  {scanSteps[scanStep]}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-md bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-600 to-[#27265B] rounded-full transition-all duration-300"
                  style={{ width: `${((scanStep + 1) / scanSteps.length) * 100}%` }}
                />
              </div>

              <span className="text-[11px] text-slate-400 font-mono">
                ขั้นตอน {scanStep + 1} / {scanSteps.length}
              </span>
            </div>
          ) : scannedResult ? (
            /* Scanned AI Result Card */
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#27265B] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {scannedResult.docNumber}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 font-bold border border-pink-200">
                      {scannedResult.type}
                    </span>
                  </div>
                  <h2 className="text-base font-black text-[#1E1B4B] mt-1.5">
                    {scannedResult.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    จาก: {scannedResult.sender} • เรียน: {scannedResult.receiver}
                  </p>
                </div>

                {/* Score Big Pill */}
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-center shrink-0 min-w-[120px]">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    AI Quality Score
                  </span>
                  <div className="text-2xl font-black text-emerald-700 font-mono">
                    {scannedResult.aiScore}/100
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    {scannedResult.aiVerdict}
                  </span>
                </div>
              </div>

              {/* Score Breakdown (4 indicators) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400">ความถูกต้อง OCR</span>
                  <p className="text-sm font-black text-[#1E1B4B] font-mono">
                    {scannedResult.scoreBreakdown.ocrAccuracy}%
                  </p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400">ฟิลด์บังคับครบ</span>
                  <p className="text-sm font-black text-[#1E1B4B] font-mono">
                    {scannedResult.scoreBreakdown.requiredFields}%
                  </p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400">การจัดรูปแบบ</span>
                  <p className="text-sm font-black text-[#1E1B4B] font-mono">
                    {scannedResult.scoreBreakdown.formatting}%
                  </p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400">ความสมบูรณ์</span>
                  <p className="text-sm font-black text-[#1E1B4B] font-mono">
                    {scannedResult.scoreBreakdown.completeness}%
                  </p>
                </div>
              </div>

              {/* AI Summary */}
              <div className="bg-pink-50/50 p-3.5 rounded-xl border border-pink-100">
                <span className="text-xs font-bold text-[#27265B] flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                  บทสรุปผู้บริหารโดย AI:
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {scannedResult.aiSummary}
                </p>
              </div>

              {/* Compliance Checklist 8 items */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                  ผลการตรวจสอบความสอดคล้อง (12 จุดสำคัญ)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(scannedResult.checklist || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                    >
                      <span className="text-slate-700 font-medium">{item.name}</span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>ผ่าน</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Bottom */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => handleStartScan()}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>สแกนใหม่อีกครั้ง</span>
                </button>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setSelectedDocument(scannedResult);
                      setActivePRView('ocr-results');
                    }}
                    className="flex-1 sm:flex-none px-4 py-2 bg-[#27265B] hover:bg-[#1E1B4B] text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>ดูเอกสารฉบับเต็มและข้อความ OCR</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Standby State */
            <div className="bg-white border border-slate-200/80 rounded-2xl p-12 shadow-xs text-center space-y-3 min-h-[400px] flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FileCheck className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">
                พร้อมสำหรับการสแกนและตรวจสอบเอกสาร
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                เลือกรูปแบบตัวอย่างด้านซ้าย หรืออัปโหลดไฟล์จริงเพื่อเริ่มการประมวลผลด้วย AI
              </p>
              <button
                onClick={() => handleStartScan()}
                className="px-4 py-2 bg-[#27265B] hover:bg-[#1E1B4B] text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5 mt-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                <span>ทดสอบสแกนตัวอย่างที่ 1</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
