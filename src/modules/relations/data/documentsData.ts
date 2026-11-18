import { GovDocument, DocType, DocStatus } from '../types/bppTypes';

export const SAMPLE_TEMPLATES: {
  id: string;
  type: DocType;
  title: string;
  docNumber: string;
  sender: string;
  receiver: string;
  signatory: string;
  date: string;
  rawText: string;
  summary: string;
  score: number;
  status: DocStatus;
  validationIssues: { type: 'pass' | 'warning' | 'error'; message: string; field: string }[];
}[] = [];

export const generateInitialDocuments = (): GovDocument[] => {
  const docs: GovDocument[] = [];
  const types: DocType[] = [
    'หนังสือภายนอก',
    'หนังสือภายใน',
    'คำสั่ง',
    'บันทึกข้อความ',
    'ประกาศ',
    'ข่าวแจกสื่อมวลชน',
    'แผนปฏิบัติการ'
  ];

  SAMPLE_TEMPLATES.forEach((tpl, idx) => {
    docs.push({
      id: `doc-${idx + 1}`,
      docNumber: tpl.docNumber,
      title: tpl.title,
      type: tpl.type,
      date: `2026-09-0${Math.max(1, 7 - idx)}`,
      displayDate: tpl.date,
      sender: tpl.sender,
      receiver: tpl.receiver,
      recipient: tpl.receiver,
      signatory: tpl.signatory,
      signatoryPosition: 'ผู้บังคับบัญชา',
      speedClass: idx === 0 ? 'ด่วนที่สุด' : idx === 3 ? 'ด่วนมาก' : 'ปกติ',
      secretClass: 'ปกติ',
      aiScore: tpl.score,
      scoreBreakdown: {
        ocrAccuracy: Math.min(99, tpl.score + 2),
        requiredFields: Math.max(82, tpl.score - 2),
        formatting: Math.min(98, tpl.score + 1),
        completeness: Math.max(80, tpl.score - 4),
      },
      status: tpl.status,
      reviewer: idx % 2 === 0 ? 'ร.ต.อ. ธวัชชัย' : 'พ.ต.ท. ประเสริฐ',
      aiSummary: tpl.summary,
      summary: tpl.summary,
      ocrRawText: tpl.rawText,
      ocrText: tpl.rawText,
      aiVerdict: tpl.score >= 90 ? 'สมบูรณ์ตามระเบียบสารบรรณ' : 'มีข้อควรปรับปรุงเล็กน้อย',
      issuesCount: (tpl.validationIssues || []).length,
      issuesList: (tpl.validationIssues || []).map(iss => ({
        category: iss.field,
        description: iss.message,
        suggestion: iss.type === 'warning' ? 'ปรับแก้ไขตามคำแนะนำ' : undefined,
      })),
      detectedEntities: {
        date: tpl.date,
        docNumber: tpl.docNumber,
        subject: tpl.title,
        organization: tpl.sender,
        receiver: tpl.receiver,
        signatory: tpl.signatory,
        urgency: idx === 0 ? 'ด่วนที่สุด' : 'ปกติ',
        attachments: idx === 0 ? 'เอกสาร 2 ชุด' : undefined,
      },
      validationIssues: tpl.validationIssues,
      checklist: [
        { name: 'ตราครุฑและหัวหนังสือ', status: 'pass', note: 'ถูกต้องตามระเบียบ' },
        { name: 'เลขที่หนังสือและปี พ.ศ.', status: 'pass', note: 'ถูกต้อง' },
        { name: 'วันที่เดือนปี', status: tpl.score > 90 ? 'pass' : 'warning', note: 'ตรวจสอบความถูกต้อง' },
        { name: 'เรื่องและเรียน', status: 'pass' },
        { name: 'คำขึ้นต้นและคำลงท้าย', status: 'pass', note: 'ถูกต้องตามลำดับชั้น' },
        { name: 'เนื้อความสารบรรณ', status: 'pass' },
        { name: 'ลายมือชื่อผู้มีอำนาจ', status: 'pass' },
        { name: 'หน่วยงานเจ้าของเรื่อง', status: tpl.score > 85 ? 'pass' : 'warning' },
        { name: 'หมายเลขโทรศัพท์ติดต่อ', status: 'pass' },
      ],
      activityLog: [
        { time: '09:42', action: 'สแกนเอกสารและส่งเข้าโมเดล AI', operator: 'Officer User' },
        { time: '09:42', action: 'สกัดตัวอักษร OCR สำเร็จ (ความแม่นยำ 96.4%)', operator: 'AI OCR Engine' },
        { time: '09:43', action: 'ตรวจสอบความถูกต้อง 12 จุดสำคัญ', operator: 'AI Compliance Checker' },
        { time: '09:44', action: 'สร้างบทสรุปผู้บริหารสำเร็จ', operator: 'AI Assistant' },
      ],
      fileSize: '1.4 MB',
      fileFormat: 'PDF',
      uploadTimestamp: '2026-09-07T09:42:00Z',
    });
  });

  const senders = [
    'กองบัญชาการตำรวจตระเวนชายแดน',
    'บก.ตชด.ภาค 1',
    'บก.ตชด.ภาค 2',
    'บก.ตชด.ภาค 3',
    'บก.ตชด.ภาค 4',
    'กก.ตชด. 11',
    'กก.ตชด. 14',
    'กก.ตชด. 24',
    'ฝ่ายอำนวยการ 5 บช.ตชด.'
  ];

  const signatories = [
    'พล.ต.ท. บรรเจิด เจริญผล',
    'พล.ต.ต. สุวิทย์ พูลทรัพย์',
    'พ.ต.อ. ธนกฤต มณีรัตน์',
    'พ.ต.อ. กิตติศักดิ์ ชัยชนะ'
  ];

  const titles = [
    'ขออนุมัติจัดซื้ออุปกรณ์กล้องและเลนส์เพื่องานประชาสัมพันธ์',
    'รายงานผลการดำเนินโครงการครู ตชด. สอนเสริมทักษะอาชีพ',
    'แผนเตรียมความพร้อมรับมือสถานการณ์อุทกภัยและวาตภัย',
    'ขอส่งบุคลากรเข้ารับการฝึกอบรมการผลิตสารคดีสั้น',
    'ประกาศผลการประกวดภาพถ่ายปฏิบัติการ ตชด. ยอดเยี่ยม',
    'รายงานความพึงพอใจของประชาชนต่อการบริการของ ตชด.'
  ];

  for (let i = 6; i <= 42; i++) {
    const type = types[i % types.length];
    const status: DocStatus = i <= 24 ? 'passed' : i <= 36 ? 'review_required' : 'pending';
    const score = status === 'passed' ? 88 + (i % 10) : status === 'review_required' ? 76 + (i % 8) : 65 + (i % 10);
    const day = (i % 25) + 1;
    const docNum = `ตช 0032/${1400 + i * 17}`;
    const title = titles[i % titles.length];
    const sender = senders[i % senders.length];
    const signatory = signatories[i % signatories.length];

    docs.push({
      id: `doc-${i}`,
      docNumber: docNum,
      title: `${title} (ชุดที่ ${((i % 4) + 1)})`,
      type,
      date: `2026-09-${day < 10 ? '0' + day : day}`,
      displayDate: `${day} ก.ย. 69`,
      sender,
      receiver: 'กองบัญชาการตำรวจตระเวนชายแดน',
      recipient: 'ผบช.ตชด.',
      signatory,
      signatoryPosition: 'ผู้กำกับการ / หัวหน้าส่วนราชการ',
      speedClass: i % 3 === 0 ? 'ด่วนที่สุด' : i % 2 === 0 ? 'ด่วนมาก' : 'ปกติ',
      secretClass: 'ปกติ',
      aiScore: score,
      scoreBreakdown: {
        ocrAccuracy: Math.min(99, score + 4),
        requiredFields: Math.max(75, score - 3),
        formatting: Math.min(96, score + 1),
        completeness: Math.max(72, score - 5),
      },
      status,
      reviewer: i % 2 === 0 ? 'ร.ต.อ. ธวัชชัย' : 'พ.ต.ท. ประเสริฐ',
      aiSummary: `เอกสารประเภท ${type} จาก ${sender} เรื่อง ${title} ผ่านการตรวจสอบโครงสร้างด้วย AI ความสมบูรณ์ ${score}%`,
      summary: `เอกสารประเภท ${type} จาก ${sender} เรื่อง ${title} ผ่านการตรวจสอบโครงสร้างด้วย AI ความสมบูรณ์ ${score}%`,
      ocrRawText: `ที่ ${docNum}\n${sender}\nวันที่ ${day} ก.ย. 69\nเรื่อง ${title}\nเรียน ผบช.ตชด.`,
      ocrText: `ที่ ${docNum}\n${sender}\nวันที่ ${day} ก.ย. 69\nเรื่อง ${title}\nเรียน ผบช.ตชด.`,
      aiVerdict: score >= 85 ? 'ผ่านเกณฑ์มาตรฐานสารบรรณ' : 'ต้องแก้ไขข้อผิดพลาดเล็กน้อย',
      issuesCount: status === 'passed' ? 1 : 3,
      issuesList:
        status === 'passed'
          ? [{ category: 'การจัดหน้า', description: 'เว้นวรรคถูกต้องสมบูรณ์' }]
          : [
              { category: 'รหัสหนังสือ', description: 'ควรตรวจสอบปี พ.ศ. ให้เป็นปัจจุบัน' },
              { category: 'การเคาะย่อหน้า', description: 'ย่อหน้าแรกเคาะเว้นวรรคไม่ตรงตำแหน่ง' }
            ],
      detectedEntities: {
        date: `${day} ก.ย. 69`,
        docNumber: docNum,
        subject: title,
        organization: sender,
        receiver: 'กองบัญชาการตำรวจตระเวนชายแดน',
        signatory,
      },
      validationIssues:
        status === 'passed'
          ? [{ type: 'pass', field: 'ความสมบูรณ์', message: 'ผ่านเกณฑ์ตรวจสอบ' }]
          : [{ type: 'warning', field: 'รูปแบบ', message: 'ข้อความย่อหน้าควรปรับระยะให้สม่ำเสมอ' }],
      checklist: [
        { name: 'ตราครุฑ', status: 'pass' },
        { name: 'เลขที่หนังสือ', status: 'pass' },
        { name: 'วันที่', status: 'pass' },
        { name: 'เรื่อง', status: 'pass' },
        { name: 'คำขึ้นต้น/ลงท้าย', status: 'pass' },
        { name: 'ลายมือชื่อ', status: 'pass' },
      ],
      activityLog: [
        { time: '10:15', action: 'บันทึกเข้าระบบ AI Document Scanner', operator: 'Officer User' },
        { time: '10:15', action: 'OCR ตรวจจับข้อความอัตโนมัติ', operator: 'AI Engine' },
        { time: '10:16', action: `ประเมินคะแนนคุณภาพ AI Quality Score: ${score}/100`, operator: 'AI Engine' },
      ],
      fileSize: `${1.2 + (i % 5) * 0.4} MB`,
      fileFormat: i % 3 === 0 ? 'JPG' : 'PDF',
      uploadTimestamp: `2026-09-${day < 10 ? '0' + day : day}T10:15:00Z`,
    });
  }

  return docs;
};

export const INITIAL_DOCUMENTS: GovDocument[] = [];
