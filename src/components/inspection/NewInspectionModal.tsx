import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { DocumentInspection, ChecklistItem, SpellingError, InspectionRecommendation } from '../../types';
import {
  X,
  Upload,
  FileCheck2,
  FileText,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Paperclip,
  BookOpen
} from 'lucide-react';

interface NewInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newInspection: DocumentInspection) => void;
}

const SAMPLE_DOCS = [
  {
    title: 'บันทึกข้อความขออนุมัติเดินทางไปตรวจราชการ จ.ลพบุรี',
    type: 'หนังสือภายใน' as const,
    fileName: 'บันทึกข้อความ_ขออนุมัติเดินทางไปราชการ_ลพบุรี.docx',
    text: `บันทึกข้อความ
ส่วนราชการ: แผนกธุรการและกำลังพล ฝ่ายอำนวยการ โทร. ๐๒-๑๒๓๔๕๖๗
ที่: กห ๐๔๐๑/๒๕๖๙                    วันที่: ๑๔ มีนาคม ๒๕๖๙
เรื่อง: ขออนุมัติเดินทางไปตรวจราชการและประสานงาน ณ จังหวัดลพบุรี
เรียน: หัวหน้าฝ่ายอำนวยการ

๑. ความเป็นมา
ตามที่ฝ่ายอำนวยการมีแผนการตรวจสอบความพร้อมด้านการส่งกำลังบำรุงและงานสารบรรณ ประจำปีงบประมาณ ๒๕๖๙ นั้น
๒. ข้อเท็จจริง
เพื่อไห้การปฏิบัติงานเปนไปด้วยความเรียบร้อย จึงใคร่ขออนุมัติกำลังพลจำนวน ๔ นาย เดินทางไปราชการ ณ ค่ายสมเด็จพระนารายณ์มหาราช จ.ลพบุรี ระหว่างวันที่ ๑๘-๒๐ มีนาคม ๒๕๖๙ โดยใช้รถยนต์ส่วนกลาง หมายเลขทะเบียน ทบ-๑๒๓๔
๓. ข้อพิจารณาและข้อเสนอ
เห็นควรอนุมัติการเดินทางและเบิกจ่ายงบประมาณหมวดค่าใช้สอยจำนวน ๑๒,๐๐๐ บาท

จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติ`,
    score: 84,
    errors: [
      { word: 'ไห้', suggestedWord: 'ให้', line: 7, explanation: 'สะกดคำผิดตามพจนานุกรมฉบับราชบัณฑิตยสถาน' },
      { word: 'เปน', suggestedWord: 'เป็น', line: 7, explanation: 'พิมพ์ตกเครื่องหมายไม้ไต่คู้' },
    ],
    missingItems: [
      { order: 14, title: 'การลงชื่อและตำแหน่ง', suggested: 'ควรระบุชื่อเต็มและยศใต้ลายมือชื่อในวงเล็บให้ชัดเจน' },
      { order: 15, title: 'ส่วนราชการเจ้าของเรื่อง/โทร/อีเมล', suggested: 'ควรระบุเบอร์โทรศัพท์ภายในและอีเมลทางการให้ครบถ้วน' },
    ]
  },
  {
    title: 'หนังสือขอความอนุเคราะห์วิทยากรโครงการสัมมนาสารบรรณดิจิทัล',
    type: 'หนังสือภายนอก' as const,
    fileName: 'หนังสือขอความอนุเคราะห์วิทยากร_กห0402_125.pdf',
    text: `ที่ กห ๐๔๐๒/๑๒๕
สำนักงานฝ่ายอำนวยการ
ถนนราชดำเนินนอก กรุงเทพฯ ๑๐๒๐๐
๑๙ มีนาคม ๒๕๖๙
เรื่อง ขอความอนุเคราะห์วิทยากรบรรยาย
เรียน อธิบดีกรมสารบรรณทหารบก
สิ่งที่ส่งมาด้วย กำหนดการสัมมนา จำนวน ๑ ฉบับ

ด้วย ฝ่ายอำนวยการ จะจัดโครงการสัมมนาเชิงปฏิบัติการ "ระบบสารบรรณอิเล็กทรอนิกส์และความมั่นคงปลอดภัยดิจิทัล" ให้แก่กำลังพลฝ่ายอำนวยการ ในวันพฤหัสบดีที่ ๒๗ มีนาคม ๒๕๖๙ ณ ห้องประชุมสัมมนา ๑

ในการนี้ ฝ่ายอำนวยการ พิจารณาเห็นว่าหน่วยงานของท่านมีความเชี่ยวชาญ จึงใคร่ขอความอนุเคราะห์ พันเอก สมบัติ ปรีชากุล มาเป็นวิทยากรบรรยายตามวันและเวลาดังกล่าว

จึงเรียนมาเพื่อโปรดพิจารณาให้ความอนุเคราะห์

ขอแสดงความนับถือ

(พลตรี สมชาย ศรีสวัสดิ์)
หัวหน้าฝ่ายอำนวยการ`,
    score: 96,
    errors: [],
    missingItems: []
  }
];

export const NewInspectionModal: React.FC<NewInspectionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { addInspection } = useAdmin();

  const [documentType, setDocumentType] = useState<DocumentInspection['documentType']>('หนังสือภายใน');
  const [fileName, setFileName] = useState('');
  const [originUnit, setOriginUnit] = useState('แผนกธุรการและกำลังพล');
  const [rawText, setRawText] = useState('');
  const [fileObject, setFileObject] = useState<File | null>(null);

  // Scanning State Animation
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  if (!isOpen) return null;

  const scanSteps = [
    'กำลังวิเคราะห์โครงสร้างไฟล์และดึงข้อความ (OCR & Text Extraction)...',
    'กำลังตรวจสอบ 16 องค์ประกอบตามระเบียบสำนักนายกรัฐมนตรี...',
    'กำลังตรวจทานตัวสะกด ไวยากรณ์ และคำทับศัพท์ (Royal Society Lexicon)...',
    'กำลังประมวลผลข้อเสนอแนะเชิงลึกและคำนวณคะแนนมาตรฐาน (AI Synthesis)...',
  ];

  const handleSelectSample = (sample: typeof SAMPLE_DOCS[0]) => {
    setFileName(sample.fileName);
    setDocumentType(sample.type);
    setRawText(sample.text);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileObject(file);
      setFileName(file.name);
      if (!rawText) {
        setRawText(`เอกสาร: ${file.name}\nขนาดไฟล์: ${(file.size / 1024).toFixed(1)} KB\nประเภท: ${file.type}\nกำลังเตรียมตรวจสอบองค์ประกอบสารบรรณ...`);
      }
    }
  };

  const handleRunInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    setIsScanning(true);
    setScanStep(0);

    // Simulated multi-step AI scan
    await new Promise(r => setTimeout(r, 600));
    setScanStep(1);
    await new Promise(r => setTimeout(r, 700));
    setScanStep(2);
    await new Promise(r => setTimeout(r, 600));
    setScanStep(3);
    await new Promise(r => setTimeout(r, 600));

    // Determine inspection results based on sample or realistic heuristic
    const matchingSample = SAMPLE_DOCS.find(s => s.fileName === fileName || fileName.includes(s.type));
    const finalScore = matchingSample ? matchingSample.score : Math.floor(Math.random() * 16) + 82; // 82-98

    // Generate 16 items
    const checklistItems: ChecklistItem[] = [
      { id: 'CHK-01', orderNumber: 1, title: 'ชั้นความลับ', description: 'การประทับหรือระบุชั้นความลับ (ถ้ามี) กึ่งกลางหน้ากระดาษหัว-ท้าย', passed: true, foundValue: 'เอกสารเปิดเผยทั่วไป' },
      { id: 'CHK-02', orderNumber: 2, title: 'ชั้นความเร็ว', description: 'การระบุชั้นความเร็ว (ด่วนที่สุด, ด่วนมาก, ด่วน) ด้วยอักษรสีแดงเหนือกึ่งกลางเลขที่หนังสือ', passed: true, foundValue: 'ปกติ' },
      { id: 'CHK-03', orderNumber: 3, title: 'ที่/เลขที่หนังสือ', description: 'รหัสพยัญชนะประจำหน่วยงานตามด้วยเลขทะเบียนคุม เช่น กห ๐๔๐๑/....', passed: true, foundValue: 'กห ๐๔๐๑/๒๕๖๙' },
      { id: 'CHK-04', orderNumber: 4, title: 'ส่วนราชการเจ้าของเรื่อง', description: 'ระบุชื่อหน่วยงานเจ้าของเรื่องและหมายเลขโทรศัพท์ติดต่อ', passed: true, foundValue: originUnit },
      { id: 'CHK-05', orderNumber: 5, title: 'วัน เดือน ปี', description: 'วันที่ออกหนังสือ ตัวเลขไทยและระบุเดือนเต็ม ไม่มีคำว่า "วันที่"', passed: true, foundValue: '๑๘ มีนาคม ๒๕๖๙' },
      { id: 'CHK-06', orderNumber: 6, title: 'เรื่อง', description: 'ชื่อเรื่องกระชับ ชัดเจน สื่อความหมายถึงเจตนารมณ์ของหนังสือ', passed: true, foundValue: fileName.replace(/\.[^/.]+$/, '') },
      { id: 'CHK-07', orderNumber: 7, title: 'คำขึ้นต้น', description: 'ใช้คำขึ้นต้นถูกต้องตามฐานะของผู้รับหนังสือ เช่น "กราบเรียน" หรือ "เรียน"', passed: true, foundValue: 'เรียน หัวหน้าฝ่ายอำนวยการ' },
      { id: 'CHK-08', orderNumber: 8, title: 'อ้างถึง', description: 'ระบุหนังสือที่เคยมีติดต่อกัน (ถ้ามี) ด้วยการระบุชื่อส่วนราชการ เลขที่ และวันที่', passed: true },
      { id: 'CHK-09', orderNumber: 9, title: 'สิ่งที่ส่งมาด้วย', description: 'ระบุเอกสารที่ส่งไปพร้อมกับหนังสือนั้น มีชื่อและจำนวนฉบับชัดเจน', passed: true },
      { id: 'CHK-10', orderNumber: 10, title: 'ข้อความภาคเหตุ', description: 'ย่อหน้าแรกระบุสาเหตุหรือความเป็นมาที่ต้องมีหนังสือฉบับนี้', passed: true },
      { id: 'CHK-11', orderNumber: 11, title: 'ข้อความภาคความประสงค์', description: 'ระบุความต้องการหรือสิ่งที่ขอให้ผู้รับหนังสือปฏิบัติอย่างชัดแจ้ง', passed: true },
      { id: 'CHK-12', orderNumber: 12, title: 'ข้อความภาคสรุป', description: 'ย่อหน้าสุดท้ายระบุความประสงค์ เช่น "จึงเรียนมาเพื่อโปรดพิจารณา"', passed: true, foundValue: 'จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติ' },
      { id: 'CHK-13', orderNumber: 13, title: 'คำลงท้าย', description: 'คำลงท้ายสอดคล้องกับคำขึ้นต้น เช่น "ขอแสดงความนับถือ"', passed: documentType !== 'หนังสือภายใน' },
      { id: 'CHK-14', orderNumber: 14, title: 'การลงชื่อและตำแหน่ง', description: 'มีพิมพ์ชื่อเต็มในวงเล็บใต้ลายมือชื่อ พร้อมระบุตำแหน่งทางราชการ', passed: finalScore > 85, suggestedFix: 'ควรพิมพ์ชื่อเต็มและยศในวงเล็บใต้ลายมือชื่อให้ชัดเจน' },
      { id: 'CHK-15', orderNumber: 15, title: 'ส่วนราชการเจ้าของเรื่อง/โทร/อีเมล', description: 'ระบุชื่อหน่วยงานย่อยและหมายเลขโทรศัพท์ที่ด้านล่างซ้ายของหนังสือ', passed: true, foundValue: 'โทร. ๐๒-๑๒๓๔๕๖๗ ต่อ ๑๐๑' },
      { id: 'CHK-16', orderNumber: 16, title: 'ตราครุฑ / เครื่องหมายราชการ', description: 'ขนาดตราครุฑมาตรฐาน (๓ ซม. หรือ ๑.๕ ซม.) และระยะห่างจากขอบกระดาษ', passed: true, foundValue: 'ขนาด ๓ ซม. กึ่งกลางหน้า' },
    ];

    const spellingErrors: SpellingError[] = matchingSample?.errors || [
      { word: 'ไห้', suggestedWord: 'ให้', line: 8, explanation: 'สะกดผิดตามพจนานุกรมราชบัณฑิตยสถาน' }
    ];

    const recommendations: InspectionRecommendation[] = [
      {
        category: 'formatting',
        title: 'ระยะกั้นหน้าและย่อหน้า',
        suggestion: 'ควรเว้นระยะกั้นหน้า ๓ ซม. กั้นหลัง ๒ ซม. และระยะย่อหน้า ๒.๕ ซม. ให้ตรงตามระเบียบงานสารบรรณ',
        standardRef: 'ระเบียบสำนักนายกรัฐมนตรีฯ ข้อ ๒๓',
      },
      {
        category: 'clarity',
        title: 'ความกระชับของภาคความประสงค์',
        suggestion: 'ระบุรายละเอียดกรอบเวลาและงบประมาณให้ชัดเจนในตารางแนบท้ายเพื่อความสะดวกในการตรวจสอบ',
      },
    ];

    const newInspection: DocumentInspection = {
      id: `INS-${Date.now().toString().slice(-6)}`,
      fileName: fileName.trim(),
      documentType,
      uploadedAt: new Date().toISOString().slice(0, 10),
      fileSize: fileObject ? `${(fileObject.size / 1024).toFixed(1)} KB` : '142.5 KB',
      score: finalScore,
      status: finalScore >= 80 ? 'ผ่านเกณฑ์' : 'ต้องแก้ไข',
      aiSummary: `เอกสารนี้มีโครงสร้างถูกต้องตามมาตรฐานหนังสือราชการไทย (${documentType}) ความสมบูรณ์ขององค์ประกอบ ${checklistItems.filter(c => c.passed).length}/16 จุด พบจุดที่ต้องระมัดระวังเกี่ยวกับวรรคตอนและการระบุตำแหน่งผู้มีอำนาจลงนาม`,
      checklistItems,
      spellingErrors,
      recommendations,
      extractedText: rawText || 'ตรวจพบข้อความจากเอกสารเรียบร้อยแล้ว',
    };

    addInspection(newInspection);
    setIsScanning(false);
    onSuccess(newInspection);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-800">อัปโหลดเอกสารเพื่อตรวจสอบด้วย AI</h3>
              <p className="text-xs text-slate-500">วิเคราะห์ 16 องค์ประกอบตามระเบียบงานสารบรรณ พ.ศ. ๒๕๒๖</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isScanning}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isScanning ? (
          /* Animated Scanning View */
          <div className="p-10 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100 animate-ping opacity-75"></div>
              <div className="relative w-20 h-20 rounded-full bg-indigo-50 border-2 border-indigo-600 flex items-center justify-center text-indigo-600">
                <Loader2 className="w-9 h-9 animate-spin" />
              </div>
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-800">ระบบ AI กำลังตรวจสอบเอกสาร...</h4>
              <p className="text-xs text-slate-500 mt-1 font-mono">{fileName}</p>
            </div>

            {/* Steps Progress */}
            <div className="max-w-md mx-auto space-y-2.5 text-left bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              {scanSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 transition-all ${
                    idx < scanStep
                      ? 'text-emerald-700 font-medium'
                      : idx === scanStep
                      ? 'text-indigo-600 font-bold'
                      : 'text-slate-400 opacity-60'
                  }`}
                >
                  {idx < scanStep ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : idx === scanStep ? (
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                  )}
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Input Form */
          <form onSubmit={handleRunInspection} className="p-6 space-y-5">
            {/* Quick Test Preset Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>หรือเลือกเอกสารตัวอย่างเพื่อทดสอบระบบทันที:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SAMPLE_DOCS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-indigo-700 font-mono">
                        {sample.type}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-800">
                        คะแนนทดสอบ {sample.score}%
                      </span>
                    </div>
                    <div className="text-xs text-slate-700 line-clamp-1 font-medium">{sample.title}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Drag & Drop Upload Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                เลือกไฟล์เอกสารราชการ (PDF, Word, ภาพสแกน)
              </label>
              <label className="border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/20 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-600 transition-colors mb-2" />
                <span className="text-xs font-medium text-slate-700">
                  {fileName ? (
                    <span className="text-indigo-600 font-semibold">{fileName}</span>
                  ) : (
                    'คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่'
                  )}
                </span>
                <span className="text-[11px] text-slate-400 mt-1">
                  รองรับไฟล์ .pdf, .docx, .doc, .png, .jpg (สูงสุด 25MB)
                </span>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Document Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ประเภทเอกสารราชการ <span className="text-rose-500">*</span>
                </label>
                <select
                  value={documentType}
                  onChange={e => setDocumentType(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="หนังสือภายใน">หนังสือภายใน (บันทึกข้อความ)</option>
                  <option value="หนังสือภายนอก">หนังสือภายนอก (มีตราครุฑ)</option>
                  <option value="คำสั่ง">คำสั่งราชการ</option>
                  <option value="ประกาศ">ประกาศราชการ</option>
                  <option value="รายงานการประชุม">รายงานการประชุม</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  หน่วยงานเจ้าของเรื่อง
                </label>
                <input
                  type="text"
                  value={originUnit}
                  onChange={e => setOriginUnit(e.target.value)}
                  placeholder="เช่น แผนกส่งกำลังบำรุง"
                  className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                ชื่อไฟล์ / ชื่อเรื่องเอกสาร <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fileName}
                onChange={e => setFileName(e.target.value)}
                placeholder="เช่น บันทึกข้อความ_ขออนุมัติจัดซื้อวัสดุ_กห0401.docx"
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Optional raw text input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                เนื้อหาข้อความในเอกสาร (พิมพ์หรือวางข้อความเพื่อการตรวจอย่างละเอียด)
              </label>
              <textarea
                rows={4}
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                placeholder="วางข้อความในหนังสือราชการที่นี่..."
                className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={!fileName.trim()}
                className="px-5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-xs flex items-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>เริ่มตรวจสอบด้วย AI ทันที</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
