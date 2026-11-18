import React, { useState } from 'react';
import { OfficialDraftResult } from '../../services/aiDraftingService';
import { GarudaEmblem } from './GarudaEmblem';
import {
  Printer,
  Copy,
  Download,
  Edit3,
  Check,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

interface A4OfficialLetterPreviewProps {
  draft: OfficialDraftResult;
  onUpdateDraft?: (updated: OfficialDraftResult) => void;
  onSendToInspection?: (draft: OfficialDraftResult) => void;
}

export const A4OfficialLetterPreview: React.FC<A4OfficialLetterPreviewProps> = ({
  draft,
  onUpdateDraft,
  onSendToInspection,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentDraft, setCurrentDraft] = useState<OfficialDraftResult>(draft);

  // Sync state if draft prop changes
  React.useEffect(() => {
    setCurrentDraft(draft);
  }, [draft]);

  const handleCopyText = () => {
    const textToCopy = assembleFullText(currentDraft);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadDoc = () => {
    const fullText = assembleFullText(currentDraft);
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentDraft.subject.replace(/[\/\s]/g, '_') || 'ร่างหนังสือราชการ'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFieldChange = (field: keyof OfficialDraftResult, value: any) => {
    const updated = { ...currentDraft, [field]: value };
    setCurrentDraft(updated);
    onUpdateDraft?.(updated);
  };

  const handleParagraphChange = (key: 'intro' | 'body' | 'conclusion', val: string) => {
    const updated = {
      ...currentDraft,
      paragraphs: {
        ...currentDraft.paragraphs,
        [key]: val,
      },
    };
    setCurrentDraft(updated);
    onUpdateDraft?.(updated);
  };

  const assembleFullText = (d: OfficialDraftResult): string => {
    if (d.documentType === 'หนังสือภายใน') {
      return `บันทึกข้อความ\nส่วนราชการ: ${d.issuedAt}\nที่: ${d.bookNumber}   วันที่: ${d.date}\nเรื่อง: ${d.subject}\nเรียน: ${d.recipient}\n\n       ${d.paragraphs.intro}\n\n       ${d.paragraphs.body}\n\n       ${d.paragraphs.conclusion}\n\n${d.closing}\n\n${d.signerName}\n${d.signerPosition}`;
    }
    if (d.documentType === 'คำสั่ง') {
      return `${d.bookNumber}\nเรื่อง ${d.subject}\n\n       ${d.paragraphs.intro}\n\n       ${d.paragraphs.body}\n\n       ${d.paragraphs.conclusion}\n\n${d.closing} ${d.date}\n\n${d.signerName}\n${d.signerPosition}`;
    }
    return `[ตราครุฑ]\nที่ ${d.bookNumber}                                   ${d.issuedAt}\n                                                 ${d.date}\nเรื่อง  ${d.subject}\nเรียน  ${d.recipient}\n${d.reference ? `อ้างถึง ${d.reference}\n` : ''}${d.attachments ? `สิ่งที่ส่งมาด้วย ${d.attachments}\n` : ''}\n       ${d.paragraphs.intro}\n\n       ${d.paragraphs.body}\n\n       ${d.paragraphs.conclusion}\n\n                                                 ${d.closing}\n\n                                                 ${d.signerName}\n                                                 ${d.signerPosition}\n\n${d.departmentContact.office}\nโทร. ${d.departmentContact.tel}\nอีเมล: ${d.departmentContact.email}`;
  };

  return (
    <div className="space-y-4">
      {/* Control Action Toolbar (Hidden in Print) */}
      <div className="print:hidden bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#51439A]/10 text-[#51439A]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ร่างเอกสาร: {currentDraft.documentType}</span>
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ความสมบูรณ์ระเบียบสารบรรณ ~{currentDraft.complianceScoreEstimate}%</span>
          </span>

          {currentDraft.matchedDlaTemplate && (
            <span className="hidden md:inline-flex items-center gap-1 text-xs text-slate-500">
              <BookOpen className="w-3 h-3 text-slate-400" />
              <span>อ้างอิง: {currentDraft.matchedDlaTemplate.code}</span>
            </span>
          )}

          <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <span>ตราครุฑพ่าห์ราชการมาตรฐาน</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
              isEditing
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'เสร็จสิ้นการแก้ไข' : 'แก้ไขเนื้อหา'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1.5 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>คัดลอกข้อความ</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadDoc}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลด (.txt)</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#27265B] text-white hover:bg-[#1f1e4a] flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์เอกสาร (A4)</span>
          </button>

          {onSendToInspection && (
            <button
              type="button"
              onClick={() => onSendToInspection(currentDraft)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              title="ส่งเอกสารนี้ไปยังระบบ AI Document Inspector เพื่อตรวจมาตรฐานสารบรรณ 16 จุด"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ส่งตรวจระเบียบสารบรรณ</span>
            </button>
          )}
        </div>
      </div>

      {/* A4 Sheet Container */}
      <div className="flex justify-center bg-slate-100/80 p-2 sm:p-6 rounded-2xl border border-slate-200/80 overflow-x-auto">
        <div
          id="official-a4-document"
          className="bg-white text-slate-900 shadow-xl print:shadow-none w-full max-w-[794px] min-h-[1050px] p-8 sm:p-12 md:p-14 relative font-serif text-[15px] sm:text-[16px] leading-relaxed transition-all"
          style={{
            fontFamily: '"Sarabun", "TH Sarabun PSK", "TH Sarabun New", Tahoma, sans-serif',
          }}
        >
          {/* Top Left Margin Guides for Official Saraban Notice (Non-print) */}
          <div className="print:hidden absolute top-2 right-3 text-[11px] text-slate-400 font-mono select-none">
            รูปแบบมาตรฐานระเบียบสารบรรณ ๒๕๒๖ • กั้นหน้า ๓ ซม.
          </div>

          {/* ========================================================= */}
          {/* FORMAT 1: หนังสือภายใน / บันทึกข้อความ */}
          {/* ========================================================= */}
          {currentDraft.documentType === 'หนังสือภายใน' && (
            <div className="space-y-5">
              {/* Header with Garuda at left and bold title centered */}
              <div className="relative pt-2 pb-4 border-b border-slate-800">
                <div className="absolute left-0 top-0">
                  <GarudaEmblem size="sm" />
                </div>
                <div className="text-center">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-wide text-slate-950">
                    บันทึกข้อความ
                  </h1>
                </div>
              </div>

              {/* Department & Ref Rows */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-800 text-[15px]">
                <div>
                  <span className="font-bold">ส่วนราชการ:</span>{' '}
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full mt-1 px-2 py-1 border border-slate-300 rounded text-sm"
                      value={currentDraft.issuedAt}
                      onChange={(e) => handleFieldChange('issuedAt', e.target.value)}
                    />
                  ) : (
                    <span>{currentDraft.issuedAt}</span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <span className="font-bold">ที่:</span>{' '}
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full mt-1 px-2 py-1 border border-slate-300 rounded text-sm"
                        value={currentDraft.bookNumber}
                        onChange={(e) => handleFieldChange('bookNumber', e.target.value)}
                      />
                    ) : (
                      <span>{currentDraft.bookNumber}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="font-bold">วันที่:</span>{' '}
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full mt-1 px-2 py-1 border border-slate-300 rounded text-sm"
                        value={currentDraft.date}
                        onChange={(e) => handleFieldChange('date', e.target.value)}
                      />
                    ) : (
                      <span>{currentDraft.date}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="text-[15px] pt-1">
                <span className="font-bold">เรื่อง:</span>{' '}
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full mt-1 px-2 py-1 font-semibold border border-slate-300 rounded text-sm"
                    value={currentDraft.subject}
                    onChange={(e) => handleFieldChange('subject', e.target.value)}
                  />
                ) : (
                  <span className="font-semibold">{currentDraft.subject}</span>
                )}
              </div>

              {/* Recipient */}
              <div className="text-[15px] pb-2 border-b border-slate-200">
                <span className="font-bold">เรียน:</span>{' '}
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full mt-1 px-2 py-1 border border-slate-300 rounded text-sm"
                    value={currentDraft.recipient}
                    onChange={(e) => handleFieldChange('recipient', e.target.value)}
                  />
                ) : (
                  <span>{currentDraft.recipient}</span>
                )}
              </div>

              {/* Body Paragraphs */}
              <div className="space-y-4 pt-3 text-justify leading-relaxed">
                {/* Paragraph 1: ภาคเหตุ */}
                <div>
                  {isEditing ? (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">ภาคเหตุ (ที่มาของเรื่อง):</label>
                      <textarea
                        rows={3}
                        className="w-full p-2 border border-slate-300 rounded text-sm"
                        value={currentDraft.paragraphs.intro}
                        onChange={(e) => handleParagraphChange('intro', e.target.value)}
                      />
                    </div>
                  ) : (
                    <p className="indent-12 text-slate-900 leading-relaxed">
                      {currentDraft.paragraphs.intro}
                    </p>
                  )}
                </div>

                {/* Paragraph 2: ภาคความประสงค์ */}
                <div>
                  {isEditing ? (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">ภาคความประสงค์ (รายละเอียดที่ขอ):</label>
                      <textarea
                        rows={4}
                        className="w-full p-2 border border-slate-300 rounded text-sm"
                        value={currentDraft.paragraphs.body}
                        onChange={(e) => handleParagraphChange('body', e.target.value)}
                      />
                    </div>
                  ) : (
                    <p className="indent-12 text-slate-900 leading-relaxed">
                      {currentDraft.paragraphs.body}
                    </p>
                  )}
                </div>

                {/* Paragraph 3: ภาคสรุป */}
                <div>
                  {isEditing ? (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">ภาคสรุป (ข้อพิจารณา):</label>
                      <textarea
                        rows={2}
                        className="w-full p-2 border border-slate-300 rounded text-sm"
                        value={currentDraft.paragraphs.conclusion}
                        onChange={(e) => handleParagraphChange('conclusion', e.target.value)}
                      />
                    </div>
                  ) : (
                    <p className="indent-12 text-slate-900 leading-relaxed">
                      {currentDraft.paragraphs.conclusion}
                    </p>
                  )}
                </div>
              </div>

              {/* Signer Block */}
              <div className="pt-10 pb-6 flex justify-end">
                <div className="w-64 text-center space-y-2">
                  <div className="h-10 border-b border-dashed border-slate-300 mx-auto w-44" />
                  <div className="font-medium text-slate-900">{currentDraft.signerName}</div>
                  <div className="text-xs text-slate-700">{currentDraft.signerPosition}</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* FORMAT 2: คำสั่ง */}
          {/* ========================================================= */}
          {currentDraft.documentType === 'คำสั่ง' && (
            <div className="space-y-5">
              <div className="text-center space-y-2 pt-2 pb-4">
                <div className="flex justify-center mb-3">
                  <GarudaEmblem size="md" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-950">
                  {currentDraft.bookNumber}
                </h1>
                <h2 className="text-lg font-semibold text-slate-800">
                  เรื่อง {currentDraft.subject}
                </h2>
              </div>

              <div className="space-y-4 pt-2 text-justify leading-relaxed">
                <div>
                  {isEditing ? (
                    <textarea
                      rows={3}
                      className="w-full p-2 border border-slate-300 rounded text-sm"
                      value={currentDraft.paragraphs.intro}
                      onChange={(e) => handleParagraphChange('intro', e.target.value)}
                    />
                  ) : (
                    <p className="indent-12 text-slate-900 leading-relaxed">
                      {currentDraft.paragraphs.intro}
                    </p>
                  )}
                </div>

                <div>
                  {isEditing ? (
                    <textarea
                      rows={4}
                      className="w-full p-2 border border-slate-300 rounded text-sm"
                      value={currentDraft.paragraphs.body}
                      onChange={(e) => handleParagraphChange('body', e.target.value)}
                    />
                  ) : (
                    <p className="indent-12 text-slate-900 leading-relaxed">
                      {currentDraft.paragraphs.body}
                    </p>
                  )}
                </div>

                <div>
                  {isEditing ? (
                    <textarea
                      rows={2}
                      className="w-full p-2 border border-slate-300 rounded text-sm"
                      value={currentDraft.paragraphs.conclusion}
                      onChange={(e) => handleParagraphChange('conclusion', e.target.value)}
                    />
                  ) : (
                    <p className="indent-12 text-slate-900 leading-relaxed">
                      {currentDraft.paragraphs.conclusion}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-8 text-center">
                <p className="text-slate-800">สั่ง ณ วันที่ {currentDraft.date}</p>
              </div>

              <div className="pt-6 flex justify-end">
                <div className="w-72 text-center space-y-2">
                  <div className="h-10 border-b border-dashed border-slate-300 mx-auto w-48" />
                  <div className="font-medium text-slate-900">{currentDraft.signerName}</div>
                  <div className="text-xs text-slate-700">{currentDraft.signerPosition}</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* FORMAT 3: หนังสือภายนอก (แบบพิธีมาตรฐาน ตราครุฑกลาง 3 ซม.) */}
          {/* ========================================================= */}
          {currentDraft.documentType !== 'หนังสือภายใน' && currentDraft.documentType !== 'คำสั่ง' && (
            <div className="space-y-5">
              {/* Garuda Center 3 cm */}
              <div className="flex justify-center pt-2 pb-2">
                <GarudaEmblem size="md" />
              </div>

              {/* Number and Issuer Two-Column Top Row */}
              <div className="flex justify-between items-start text-[15px] pt-1">
                <div className="w-1/2">
                  <span className="font-bold">ที่:</span>{' '}
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-48 px-2 py-0.5 border border-slate-300 rounded text-sm"
                      value={currentDraft.bookNumber}
                      onChange={(e) => handleFieldChange('bookNumber', e.target.value)}
                    />
                  ) : (
                    <span>{currentDraft.bookNumber}</span>
                  )}
                </div>

                <div className="w-1/2 text-right whitespace-pre-line text-slate-800">
                  {currentDraft.issuedAt}
                </div>
              </div>

              {/* Date (Indented to center-right) */}
              <div className="flex justify-end pt-1">
                <div className="w-1/2 text-left pl-6">
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full px-2 py-0.5 border border-slate-300 rounded text-sm"
                      value={currentDraft.date}
                      onChange={(e) => handleFieldChange('date', e.target.value)}
                    />
                  ) : (
                    <span className="text-slate-900 font-medium">{currentDraft.date}</span>
                  )}
                </div>
              </div>

              {/* Subject, Recipient, Ref, Attachments */}
              <div className="space-y-1.5 text-[15px] pt-2">
                <div>
                  <span className="font-bold">เรื่อง:</span>{' '}
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full mt-1 px-2 py-1 font-semibold border border-slate-300 rounded text-sm"
                      value={currentDraft.subject}
                      onChange={(e) => handleFieldChange('subject', e.target.value)}
                    />
                  ) : (
                    <span className="font-semibold">{currentDraft.subject}</span>
                  )}
                </div>

                <div>
                  <span className="font-bold">เรียน:</span>{' '}
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full mt-1 px-2 py-1 border border-slate-300 rounded text-sm"
                      value={currentDraft.recipient}
                      onChange={(e) => handleFieldChange('recipient', e.target.value)}
                    />
                  ) : (
                    <span>{currentDraft.recipient}</span>
                  )}
                </div>

                {currentDraft.reference && (
                  <div>
                    <span className="font-bold">อ้างถึง:</span> <span>{currentDraft.reference}</span>
                  </div>
                )}

                {currentDraft.attachments && (
                  <div>
                    <span className="font-bold">สิ่งที่ส่งมาด้วย:</span>{' '}
                    <span>{currentDraft.attachments}</span>
                  </div>
                )}
              </div>

              {/* 3-Part Body Paragraphs */}
              <div className="space-y-4 pt-3 text-justify leading-relaxed">
                <div>
                  {isEditing ? (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">ภาคเหตุ:</label>
                      <textarea
                        rows={3}
                        className="w-full p-2 border border-slate-300 rounded text-sm"
                        value={currentDraft.paragraphs.intro}
                        onChange={(e) => handleParagraphChange('intro', e.target.value)}
                      />
                    </div>
                  ) : (
                    <p className="indent-12 text-slate-900 leading-relaxed">
                      {currentDraft.paragraphs.intro}
                    </p>
                  )}
                </div>

                <div>
                  {isEditing ? (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">ภาคความประสงค์:</label>
                      <textarea
                        rows={4}
                        className="w-full p-2 border border-slate-300 rounded text-sm"
                        value={currentDraft.paragraphs.body}
                        onChange={(e) => handleParagraphChange('body', e.target.value)}
                      />
                    </div>
                  ) : (
                    <p className="indent-12 text-slate-900 leading-relaxed">
                      {currentDraft.paragraphs.body}
                    </p>
                  )}
                </div>

                <div>
                  {isEditing ? (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">ภาคสรุป:</label>
                      <textarea
                        rows={2}
                        className="w-full p-2 border border-slate-300 rounded text-sm"
                        value={currentDraft.paragraphs.conclusion}
                        onChange={(e) => handleParagraphChange('conclusion', e.target.value)}
                      />
                    </div>
                  ) : (
                    <p className="indent-12 text-slate-900 leading-relaxed">
                      {currentDraft.paragraphs.conclusion}
                    </p>
                  )}
                </div>
              </div>

              {/* Closing & Signer (Right aligned) */}
              <div className="pt-6 flex justify-end">
                <div className="w-72 text-center space-y-3">
                  <div className="text-slate-900 font-medium">{currentDraft.closing}</div>
                  <div className="h-10 border-b border-dashed border-slate-300 mx-auto w-48" />
                  <div className="font-medium text-slate-900">{currentDraft.signerName}</div>
                  <div className="text-xs text-slate-700">{currentDraft.signerPosition}</div>
                </div>
              </div>

              {/* Bottom Department Contact Footer */}
              <div className="pt-8 border-t border-slate-200/60 text-xs text-slate-600 space-y-0.5">
                <p className="font-semibold text-slate-700">{currentDraft.departmentContact.office}</p>
                <p>โทร. {currentDraft.departmentContact.tel}</p>
                <p>ไปรษณีย์อิเล็กทรอนิกส์: {currentDraft.departmentContact.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
