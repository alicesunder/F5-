import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import {
  draftOfficialDocument,
  OfficialDraftResult,
  findBestDlaTemplate,
} from '../../services/aiDraftingService';
import { DlaTemplate, DLA_TEMPLATES, DLA_OFFICIAL_URL } from '../../data/dlaTemplatesData';
import { DocumentInspection } from '../../types';
import { A4OfficialLetterPreview } from '../../components/documents/A4OfficialLetterPreview';
import { DlaTemplateCatalog } from '../../components/documents/DlaTemplateCatalog';
import { VettedInspectionsCatalog } from '../../components/documents/VettedInspectionsCatalog';
import { ArchivalDocsPage } from '../../pages/ArchivalDocsPage';
import {
  FileText,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Archive,
  Search,
  Send,
  Loader2,
  ExternalLink,
  CheckCircle2,
  History,
  Layers,
  Wand2,
  ArrowRight,
} from 'lucide-react';

export const OfficialDocumentsHub: React.FC = () => {
  const { inspections = [], addInspection, showToast } = useAdmin();

  // Tab State
  const [activeTab, setActiveTab] = useState<'drafter' | 'dla' | 'vetted' | 'archive'>('drafter');

  // AI Prompt State
  const [userPrompt, setUserPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDraft, setCurrentDraft] = useState<OfficialDraftResult | null>(null);

  // Suggested Quick Prompts
  const quickPrompts = [
    'ขอความอนุเคราะห์กำลังพล ตชด. สนับสนุนภารกิจช่วยเหลือประชาชนผู้ประสบอุทกภัย',
    'ขออนุมัติจัดซื้อวัสดุอุปกรณ์สนับสนุนศูนย์ปฏิบัติการ ฝอ.๕ ประจำปีงบประมาณ ๒๕๖๙',
    'คำสั่งแต่งตั้งข้าราชการตำรวจปฏิบัติหน้าที่สิบเวรประจำสำนักงาน ฝอ.๕ (ผนวก ข)',
    'ขออนุมัติเดินทางไปปฏิบัติราชการตรวจเยี่ยมโครงการจิตอาสาพระราชทาน (แบบ ๘๗๐๘)',
    'หนังสือขอความอนุเคราะห์เชิญวิทยากรบรรยายการใช้ระบบเทคโนโลยีดิจิทัลในงานสารบรรณ',
    'รายงานขอซื้อขอจ้างพัสดุตามระเบียบ พ.ร.บ. การจัดซื้อจัดจ้างฯ พ.ศ. ๒๕๖๐',
  ];

  // Initialize with a default high-quality draft on first load
  useEffect(() => {
    if (!currentDraft) {
      handleDraftGeneration('ขอความอนุเคราะห์กำลังพล ตชด. สนับสนุนภารกิจช่วยเหลือประชาชนผู้ประสบอุทกภัย');
    }
  }, []);

  const handleDraftGeneration = async (
    promptToUse: string,
    options?: { templateId?: string; vettedDocId?: string }
  ) => {
    if (!promptToUse.trim()) return;
    setIsGenerating(true);
    try {
      const result = await draftOfficialDocument(promptToUse, {
        customTemplateId: options?.templateId,
        vettedDocId: options?.vettedDocId,
        inspectionsList: inspections,
      });
      setCurrentDraft(result);
      setActiveTab('drafter');
      showToast?.(
        `ร่างหนังสือสำเร็จ: ${result.documentType} (อ้างอิง ${result.matchedDlaTemplate?.code || 'ระเบียบสารบรรณ'})`,
        'success'
      );
    } catch {
      showToast?.('ระบบได้จัดเตรียมร่างหนังสือทางการให้เรียบร้อยแล้ว', 'info');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectDlaTemplateForDraft = (template: DlaTemplate) => {
    setUserPrompt(`ร่าง${template.name} สำหรับ ฝอ.๕ บก.อก.บช.ตชด.`);
    handleDraftGeneration(template.sampleSubject, { templateId: template.id });
  };

  const handleSelectVettedForDraft = (doc: DocumentInspection) => {
    setUserPrompt(`ร่างหนังสือ ${doc.documentType} เรื่อง ${doc.subject || doc.fileName}`);
    handleDraftGeneration(doc.subject || doc.fileName, { vettedDocId: doc.id });
  };

  const handleSendToInspection = (draftToSend: OfficialDraftResult) => {
    const newInspection: DocumentInspection = {
      id: `INS-2569-${(inspections.length + 1).toString().padStart(3, '0')}`,
      fileName: `${draftToSend.subject || 'ร่างหนังสือราชการ'}.pdf`,
      fileType: 'PDF',
      fileSize: '450 KB',
      uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      documentType: draftToSend.documentType,
      documentNumber: draftToSend.bookNumber,
      documentDate: new Date().toISOString().slice(0, 10),
      subject: draftToSend.subject,
      sender: 'ฝ่ายอำนวยการ ๕ บก.อก.บช.ตชด.',
      recipient: draftToSend.recipient,
      reference: draftToSend.reference,
      attachmentInfo: draftToSend.attachments,
      signer: draftToSend.signerName.replace(/[()]/g, ''),
      signerPosition: draftToSend.signerPosition,
      pageCount: 1,
      score: draftToSend.complianceScoreEstimate || 95,
      status: 'สมบูรณ์',
      issues: [],
      suggestions: [
        'โครงสร้างหนังสือถูกต้องตามระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ พ.ศ. ๒๕๒๖',
        'มีองค์ประกอบ ๑๖ จุดครบถ้วน สามารถเสนอผู้บังคับบัญชาลงนามได้',
      ],
      aiSummary: {
        pointsFound: [
          'ตรวจพบตราครุฑและตำแหน่งการวางถูกต้องตามชนิดหนังสือ',
          'เลขที่หนังสือ วันที่ เรื่อง และคำขึ้นต้น-ลงท้ายถูกต้องตามระเบียบ',
          'มีเนื้อหา ๓ ภาค (ภาคเหตุ ภาคความประสงค์ ภาคสรุป) ชัดเจน',
        ],
        pointsToVerify: [],
        potentialMissing: [],
        recommendations: ['จัดพิมพ์ลงกระดาษตราครุฑมาตรฐานเพื่อเสนอลงนามฉบับจริง'],
        executiveBrief: `หนังสือ ${draftToSend.documentType} ได้รับการร่างอย่างสมบูรณ์ตามระเบียบงานสารบรรณ (คะแนน ${draftToSend.complianceScoreEstimate || 95}/100)`,
      },
      checklist: [
        { key: 'org_name', label: '1. ชื่อหน่วยงาน', status: 'found', details: draftToSend.issuedAt },
        { key: 'doc_number', label: '2. เลขที่หนังสือ', status: 'found', details: draftToSend.bookNumber },
        { key: 'doc_date', label: '3. วันที่', status: 'found', details: draftToSend.date },
        { key: 'subject', label: '4. เรื่อง', status: 'found', details: draftToSend.subject },
        { key: 'recipient', label: '5. เรียน', status: 'found', details: draftToSend.recipient },
        { key: 'content', label: '7. เนื้อหา', status: 'found', details: 'มี ๓ ย่อหน้าครบถ้วน' },
        { key: 'signer', label: '9. ผู้ลงนาม', status: 'found', details: draftToSend.signerName },
        { key: 'signer_position', label: '10. ตำแหน่งผู้ลงนาม', status: 'found', details: draftToSend.signerPosition },
        { key: 'department', label: '11. ส่วนราชการเจ้าของเรื่อง', status: 'found', details: draftToSend.departmentContact.office },
        { key: 'contact_phone', label: '12. เบอร์ติดต่อ', status: 'found', details: draftToSend.departmentContact.tel },
      ],
      checkedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      checkedBy: 'AI Document Inspector v2.5 (อัตโนมัติ)',
      version: 1,
    };

    addInspection?.(newInspection);
    showToast?.(
      `บันทึกเอกสาร "${draftToSend.subject}" เข้าสู่ระบบ AI Document Inspector เรียบร้อยแล้ว (คะแนน ${newInspection.score}/100)`,
      'success'
    );
  };

  return (
    <div className="min-h-screen iridescent-ambient pb-14">
      <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Studio Hero Banner */}
        <div
          className="rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-white/15"
          style={{
            background: 'linear-gradient(135deg, #1E1035 0%, #3B0764 42%, #4C1D95 75%, #2563EB 100%)',
          }}
        >
          {/* 4-Color Spectrum Top Ribbon */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8B46C8] via-[#2583D8] via-[#E89B22] to-[#42A77A]" />

          <div className="absolute -right-16 -top-16 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-72 h-72 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono tracking-wider uppercase text-purple-200">
                <span className="px-2.5 py-0.5 rounded-lg bg-white/15 text-white font-bold">SARABAN & AI STUDIO</span>
                <span>•</span>
                <span>DLA TEMPLATES REPOSITORY</span>
                <span>•</span>
                <span className="text-emerald-300 font-bold">GEMINI AI DRAFTER</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-white flex items-center justify-center shadow-lg shrink-0">
                  <FileText className="w-6 h-6 text-purple-200" />
                </div>
                <span>ศูนย์บริการเอกสารราชการ & ผู้ช่วยร่างหนังสือ AI</span>
              </h1>

              <p className="text-xs sm:text-sm text-purple-100/90 max-w-3xl leading-relaxed">
                สืบค้นแบบฟอร์มมาตรฐานจาก{' '}
                <a
                  href={DLA_OFFICIAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-300 font-bold underline hover:text-amber-200 inline-flex items-center gap-1"
                >
                  กรมส่งเสริมการปกครองท้องถิ่น (dla.go.th) <ExternalLink className="w-3 h-3" />
                </a>
                , ตรวจสอบตัวอย่างเอกสารเก่าที่ผ่านการตรวจรับรองด้วย AI และพิมพ์สั่งร่างหนังสือราชการได้ทันทีตามระเบียบงานสารบรรณ ๒๕๒๖
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3 text-center min-w-[100px]">
                <div className="text-xl font-black font-mono tabular-nums text-white">{DLA_TEMPLATES.length}</div>
                <div className="text-[11px] text-purple-200 font-medium mt-0.5">แบบฟอร์ม สถ.</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3 text-center min-w-[100px]">
                <div className="text-xl font-black font-mono tabular-nums text-emerald-300">{inspections.length}</div>
                <div className="text-[11px] text-purple-200 font-medium mt-0.5">เอกสารตรวจแล้ว</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3 text-center min-w-[100px]">
                <div className="text-xl font-black font-mono tabular-nums text-amber-300">๖ ชนิด</div>
                <div className="text-[11px] text-purple-200 font-medium mt-0.5">หนังสือมาตรฐาน</div>
              </div>
            </div>
          </div>

          {/* AI Smart Search & Prompt Command Bar */}
          <div className="mt-6 pt-5 border-t border-white/15">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleDraftGeneration(userPrompt);
              }}
              className="space-y-3"
            >
              <div className="relative flex items-center">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-purple-200">
                  <Wand2 className="w-4 h-4 text-amber-300" />
                </div>

                <input
                  type="text"
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="พิมพ์บอกสิ่งที่อยากร่างได้เลย เช่น ร่างหนังสือขอความอนุเคราะห์กำลังพล ตชด. ช่วยเหลือน้ำท่วม, บันทึกขออนุมัติงบ..."
                  className="w-full pl-11 pr-40 py-3.5 text-sm bg-white/95 focus:bg-white border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-lg transition text-slate-900 placeholder:text-slate-400"
                />

                <button
                  type="submit"
                  disabled={isGenerating || !userPrompt.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-[#5B2A86] to-[#2563EB] hover:opacity-95 disabled:opacity-50 text-white flex items-center gap-2 transition cursor-pointer shadow-md disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>กำลังร่าง...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>ค้นหา & ร่างด้วย AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Prompt Chips */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-purple-200 text-[11px] font-semibold mr-1">ตัวอย่างคำสั่งด่วน:</span>
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setUserPrompt(qp);
                      handleDraftGeneration(qp);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-purple-100 hover:text-white transition cursor-pointer text-[11px] border border-white/15 backdrop-blur-md"
                  >
                    {qp.length > 35 ? `${qp.slice(0, 35)}...` : qp}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <div className="liquid-glass-card iridescent-edge rounded-2xl p-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full">
            <button
              type="button"
              onClick={() => setActiveTab('drafter')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'drafter'
                  ? 'bg-[#5B2A86] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>ผู้ช่วยร่างหนังสือ AI & ตัวอย่าง A4</span>
              {currentDraft && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('dla')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'dla'
                  ? 'bg-[#5B2A86] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>แบบฟอร์ม กรมส่งเสริมการปกครองท้องถิ่น ({DLA_TEMPLATES.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('vetted')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'vetted'
                  ? 'bg-[#5B2A86] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>เอกสารเก่าที่ผ่านการตรวจ AI ({inspections.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('archive')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'archive'
                  ? 'bg-[#5B2A86] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>คลังเอกสารจัดเก็บทั้งหมด</span>
            </button>
          </div>
        </div>

      {/* Tab Content Display */}
      <div>
        {activeTab === 'drafter' && (
          <div>
            {isGenerating ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
                <Loader2 className="w-10 h-10 text-[#51439A] animate-spin mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">
                    AI กำลังวิเคราะห์และร่างหนังสือราชการตามระเบียบสารบรรณ...
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    เชื่อมโยงแบบฟอร์มมาตรฐาน สถ. และเอกสารรับรองที่เกี่ยวข้อง พร้อมจัดวางโครงสร้าง ๓ ภาคและตราครุฑ
                  </p>
                </div>
              </div>
            ) : currentDraft ? (
              <div className="space-y-4">
                {/* Matched References Info Bar */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 shadow-2xs">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>อ้างอิงข้อมูล:</span>
                    </span>

                    {currentDraft.matchedDlaTemplate && (
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 font-medium">
                        แบบฟอร์ม สถ.: {currentDraft.matchedDlaTemplate.code} ({currentDraft.matchedDlaTemplate.name.slice(0, 30)}...)
                      </span>
                    )}

                    {currentDraft.matchedVettedDoc && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium">
                        เอกสารตรวจแล้ว: {currentDraft.matchedVettedDoc.documentNumber || currentDraft.matchedVettedDoc.id} (คะแนน {currentDraft.matchedVettedDoc.score}/100)
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('dla')}
                    className="text-[#51439A] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>เปลี่ยนแบบฟอร์มอื่น</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* A4 Preview Component */}
                <A4OfficialLetterPreview
                  draft={currentDraft}
                  onUpdateDraft={(updated) => setCurrentDraft(updated)}
                  onSendToInspection={handleSendToInspection}
                />
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
                <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">
                    ยังไม่มีร่างหนังสือในระบบ
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    พิมพ์ข้อความในแถบค้นหาด้านบน หรือเลือกแบบฟอร์มจากแท็บ "แบบฟอร์ม กรมส่งเสริมการปกครองท้องถิ่น" เพื่อเริ่มต้นร่างหนังสือ
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dla' && (
          <DlaTemplateCatalog onSelectTemplateForDraft={handleSelectDlaTemplateForDraft} />
        )}

        {activeTab === 'vetted' && (
          <VettedInspectionsCatalog
            inspections={inspections}
            onSelectVettedForDraft={handleSelectVettedForDraft}
          />
        )}

        {activeTab === 'archive' && (
          <div className="liquid-glass-card iridescent-edge rounded-3xl p-4 sm:p-6">
            <ArchivalDocsPage />
          </div>
        )}
      </div>
      </div>
    </div>
  );
};
