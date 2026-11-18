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
}[] = [
  {
    id: 'tpl-1',
    type: 'หนังสือภายนอก',
    title: 'ขอความอนุเคราะห์กำลังพลสนับสนุนการจัดกิจกรรมวันเด็กแห่งชาติ',
    docNumber: 'ตช 0032/1456',
    sender: 'กองบัญชาการตำรวจตระเวนชายแดน',
    receiver: 'เลขาธิการคณะกรรมการการศึกษาขั้นพื้นฐาน',
    signatory: 'พล.ต.ท. บรรเจิด เจริญผล',
    date: '5 ก.ย. 2569',
    rawText: `(ตราครุฑ)
ที่ ตช 0032/1456
กองบัญชาการตำรวจตระเวนชายแดน
ถนนพหลโยธิน แขวงสามเสนใน
เขตพญาไท กรุงเทพฯ 10400
5 กันยายน 2569
เรื่อง ขอความอนุเคราะห์กำลังพลสนับสนุนการจัดกิจกรรมวันเด็กแห่งชาติ
เรียน เลขาธิการคณะกรรมการการศึกษาขั้นพื้นฐาน
อ้างถึง หนังสือ สพฐ. ที่ ศธ 04001/892 ลงวันที่ 20 สิงหาคม 2569
สิ่งที่ส่งมาด้วย 1. แผนการจัดกิจกรรมและตารางเวลา จำนวน 1 ชุด
              2. รายชื่อวิทยากรและกำลังพล ตชด. จำนวน 50 นาย
ตามหนังสือที่อ้างถึง สพฐ. ได้ขอรับการสนับสนุนกำลังพลครู ตชด. และอุปกรณ์สาธิตการเอาชีวิตรอดในป่า เพื่อจัดฐานการเรียนรู้ในงานวันเด็กแห่งชาติ ประจำปี 2569 นั้น
กองบัญชาการตำรวจตระเวนชายแดน พิจารณาแล้ว ยินดีให้การสนับสนุนกำลังพลดังกล่าว โดยมอบหมายให้ ฝอ.5 บช.ตชด. เป็นหน่วยประสานงานหลักในการดำเนินงาน
จึงเรียนมาเพื่อโปรดพิจารณาและประสานงานต่อไป

(ลงชื่อ) พลตำรวจโท บรรเจิด เจริญผล
(บรรเจิด เจริญผล)
ผู้บัญชาการตำรวจตระเวนชายแดน

ฝ่ายอำนวยการ 5 (งานประชาสัมพันธ์)
โทร. 0 2279 9001 ต่อ 112
โทรสาร 0 2279 9002`,
    summary: 'หนังสือขอความอนุเคราะห์กำลังพล ตชด. สนับสนุนการจัดกิจกรรมวันเด็กแห่งชาติ ร่วมกับ สพฐ. ตรวจสอบแล้วมีโครงสร้างถูกต้องตามระเบียบสารบรรณ พ.ศ. 2526',
    score: 94,
    status: 'passed',
    validationIssues: [
      { type: 'pass', field: 'ตราครุฑ', message: 'ขนาดและตำแหน่งถูกต้องตามมาตรฐาน' },
      { type: 'pass', field: 'เลขที่หนังสือ', message: 'มีรหัสตัวพยัญชนะและเลขประจำของส่วนราชการ' },
      { type: 'pass', field: 'วันที่', message: 'รูปแบบวันเดือนปีถูกต้องตามระเบียบ' },
      { type: 'pass', field: 'คำขึ้นต้นและคำลงท้าย', message: 'ใช้คำถูกต้องตามฐานันดรศักดิ์' },
      { type: 'pass', field: 'ลายมือชื่อ', message: 'มีชื่อเต็มและตำแหน่งชัดเจน' },
      { type: 'pass', field: 'ส่วนราชการเจ้าของเรื่อง', message: 'ระบุหน่วยงานและหมายเลขติดต่อครบถ้วน' },
      { type: 'warning', field: 'การย่อหน้า', message: 'ระยะเคาะย่อหน้าควรเว้นวรรค 2.5 ซม. สม่ำเสมอ' },
    ],
  },
  {
    id: 'tpl-2',
    type: 'คำสั่ง',
    title: 'แต่งตั้งคณะทำงานขับเคลื่อนงานประชาสัมพันธ์ดิจิทัล ฝอ.5 บช.ตชด.',
    docNumber: 'คำสั่ง บช.ตชด. ที่ 428/2569',
    sender: 'กองบัญชาการตำรวจตระเวนชายแดน',
    receiver: 'หน่วยขึ้นตรง บช.ตชด.',
    signatory: 'พล.ต.ท. บรรเจิด เจริญผล',
    date: '3 ก.ย. 2569',
    rawText: `(ตราครุฑ)
คำสั่ง กองบัญชาการตำรวจตระเวนชายแดน
ที่ 428/2569
เรื่อง แต่งตั้งคณะทำงานขับเคลื่อนงานประชาสัมพันธ์ดิจิทัล ฝอ.5 บช.ตชด.
เพื่อให้การเผยแพร่ข้อมูลข่าวสารและการสร้างการรับรู้แก่ประชาชนเป็นไปอย่างถูกต้อง รวดเร็ว ทันต่อสถานการณ์ในยุคสังคมดิจิทัล
อาศัยอำนาจตามมาตรา 25 แห่งพระราชบัญญัติตำรวจแห่งชาติ พ.ศ. 2565 จึงแต่งตั้งคณะทำงานดังนี้...`,
    summary: 'คำสั่งแต่งตั้งคณะทำงานขับเคลื่อนงานประชาสัมพันธ์ดิจิทัล เพื่อยกระดับการสื่อสารเชิงรุกของ ฝอ.5',
    score: 96,
    status: 'passed',
    validationIssues: [
      { type: 'pass', field: 'โครงสร้างคำสั่ง', message: 'ถูกต้องครบถ้วนตามแบบฟอร์มคำสั่งราชการ' },
      { type: 'pass', field: 'การอ้างอำนาจทางกฎหมาย', message: 'ระบุบทบัญญัติอำนาจหน้าที่ชัดเจน' },
      { type: 'pass', field: 'รายนามคณะทำงาน', message: 'ระบุชื่อ ตำแหน่ง และภารกิจครบถ้วน' },
      { type: 'pass', field: 'วันที่มีผลบังคับใช้', message: 'ระบุ "ทั้งนี้ ตั้งแต่บัดนี้เป็นต้นไป" ชัดเจน' },
    ],
  },
  {
    id: 'tpl-3',
    type: 'บันทึกข้อความ',
    title: 'รายงานผลการติดตามกระแสข่าวสารในสื่อสังคมออนไลน์ ประจำสัปดาห์',
    docNumber: 'ตช 0032.(ฝอ.5)/389',
    sender: 'ฝ่ายอำนวยการ 5 บช.ตชด.',
    receiver: 'ผบช.ตชด. (ผ่าน รอง ผบช.ตชด.(บร))',
    signatory: 'พ.ต.อ. ธนกฤต มณีรัตน์',
    date: '6 ก.ย. 2569',
    rawText: `(ตราครุฑ)
บันทึกข้อความ
ส่วนราชการ ฝ่ายอำนวยการ 5 บช.ตชด. โทร. 0 2279 9001
ที่ ตช 0032.(ฝอ.5)/389 วันที่ 6 กันยายน 2569
เรื่อง รายงานผลการติดตามกระแสข่าวสารในสื่อสังคมออนไลน์ ประจำสัปดาห์
เรียน ผบช.ตชด. (ผ่าน รอง ผบช.ตชด.(บร))
ตามที่ ฝอ.5 ได้ดำเนินการเฝ้าฟังและวิเคราะห์ข่าวสารในแพลตฟอร์ม Facebook, TikTok และ X (Social Listening & Media Monitoring) ประจำสัปดาห์ที่ 1 เดือนกันยายน 2569 นั้น
ขอรายงานสรุปสถานการณ์ดังนี้:
1. การกล่าวถึงภาพรวม มีกระแสตอบรับเชิงบวก (Positive Sentiment) คิดเป็นร้อยละ 68
2. ประเด็นที่ได้รับความสนใจสูงสุด คือ ข่าวครู ตชด. เดินเท้าลุยน้ำช่วยเหลือเด็กนักเรียน
3. ข้อสังเกตและแนวทางป้องกัน: ตรวจพบข่าวลือ (Fake News) เรื่องการปิดด่านตรวจ จึงเสนอแนะให้ออกแถลงการณ์ชี้แจงข้อเท็จจริงโดยเร็ว`,
    summary: 'บันทึกข้อความรายงานสรุปกระแสสื่อสังคมออนไลน์ประจำสัปดาห์ของ ฝอ.5 เสนอแนะให้ออกข่าวชี้แจงข่าวลือ',
    score: 92,
    status: 'passed',
    validationIssues: [
      { type: 'pass', field: 'ส่วนหัวบันทึกข้อความ', message: 'ฟอร์มบันทึกข้อความถูกต้องตามระเบียบ' },
      { type: 'pass', field: 'เนื้อหาและข้อเสนอ', message: 'แยกข้อเท็จจริงและข้อพิจารณาเป็นระเบียบชัดเจน' },
      { type: 'warning', field: 'การเสนอผ่านสายการบังคับบัญชา', message: 'ควรเพิ่มช่องเซ็นรับทราบของผู้บังคับบัญชาตามลำดับชั้น' },
    ],
  },
  {
    id: 'tpl-4',
    type: 'ข่าวแจกสื่อมวลชน',
    title: 'แถลงการณ์ชี้แจงข้อเท็จจริง กรณีข่าวลือปิดด่านตรวจชายแดนไทย-เมียนมา',
    docNumber: 'ข่าวแจกที่ 15/2569',
    sender: 'ฝ่ายประชาสัมพันธ์ ฝอ.5 บช.ตชด.',
    receiver: 'สื่อมวลชนทุกสำนัก',
    signatory: 'โฆษกกองบัญชาการตำรวจตระเวนชายแดน',
    date: '4 ก.ย. 2569',
    rawText: `(ตราสัญลักษณ์ บช.ตชด.)
PRESS RELEASE / ข่าวประชาสัมพันธ์
ฝ่ายอำนวยการ 5 กองบัญชาการตำรวจตระเวนชายแดน
ฉบับที่ 15/2569 ประจำวันที่ 4 กันยายน 2569
เรื่อง ชี้แจงข้อเท็จจริงกรณีข่าวลือการปิดด่านตรวจชายแดนไทย-เมียนมา
ตามที่มีการส่งต่อข้อความในสื่อสังคมออนไลน์ว่า มีการปิดด่านตรวจถาวรและช่องทางธรรมชาติบริเวณชายแดนจังหวัดตากนั้น
กองบัญชาการตำรวจตระเวนชายแดน ขอชี้แจงว่า ข่าวดังกล่าวเป็น "ข้อมูลเท็จ" เจ้าหน้าที่ ตชด. ยังคงปฏิบัติหน้าที่ตามปกติ และเปิดจุดตรวจเพื่ออำนวยความสะดวกและรักษาความปลอดภัยอย่างเข้มงวด
จึงขอความร่วมมือประชาชนอย่าส่งต่อข้อมูลที่เป็นเท็จ
ช่องทางติดตามข่าวสารทางการ:
Facebook: กองบัญชาการตำรวจตระเวนชายแดน
เว็บไซต์: www.bpp.police.go.th
โทรศัพท์: 0 2279 9001`,
    summary: 'ข่าวแจกชี้แจงข่าวปลอมเรื่องการปิดด่านตรวจชายแดน เพื่อยุติความตื่นตระหนกของประชาชน',
    score: 90,
    status: 'passed',
    validationIssues: [
      { type: 'pass', field: 'หัวข่าวประชาสัมพันธ์', message: 'มีสัญลักษณ์และเลขฉบับชัดเจน' },
      { type: 'pass', field: 'การระบุข้อเท็จจริง', message: 'ภาษาเข้าใจง่าย ชัดเจน ตรงประเด็น' },
      { type: 'warning', field: 'ช่องทางติดต่อ', message: 'ควรเพิ่ม QR Code สำหรับสแกนเข้าสู่หน้าเว็บชี้แจง' },
    ],
  },
  {
    id: 'tpl-5',
    type: 'แผนปฏิบัติการ',
    title: 'แผนปฏิบัติการประชาสัมพันธ์เชิงรุก ประจำปีงบประมาณ พ.ศ. 2570',
    docNumber: 'แผนปฏิบัติการ ฝอ.5 ที่ 02/2569',
    sender: 'ฝ่ายอำนวยการ 5 บช.ตชด.',
    receiver: 'หน่วยในสังกัด บช.ตชด.',
    signatory: 'พ.ต.อ. ธนกฤต มณีรัตน์',
    date: '7 ก.ย. 2569',
    rawText: `แผนปฏิบัติการประชาสัมพันธ์เชิงรุก ฝอ.5 บช.ตชด.
ประจำปีงบประมาณ พ.ศ. 2570
ยุทธศาสตร์ที่ 1: การยกระดับการผลิตสื่อดิจิทัลคุณภาพสูง
ยุทธศาสตร์ที่ 2: การพัฒนาเครือข่ายช่างภาพจิตอาสาและผู้ควบคุมโดรน
ยุทธศาสตร์ที่ 3: ระบบตรวจจับและตอบโต้ข่าวลวงด้วยระบบ "BPP PR Intelligence AI"
เป้าหมายเชิงผลผลิต: สารคดี 12 ตอน, ข่าวแจก 150 ฉบับ, อบรมกำลังพล 4 รุ่น...`,
    summary: 'แผนปฏิบัติการประชาสัมพันธ์เชิงรุก มีการนำระบบ AI และโดรนมาใช้ในการสนับสนุนงานข่าวสาร',
    score: 95,
    status: 'passed',
    validationIssues: [
      { type: 'pass', field: 'ความสอดคล้องยุทธศาสตร์', message: 'สอดคล้องกับแผนแม่บท ตชด. พ.ศ. 2566-2570' },
      { type: 'pass', field: 'ตัวชี้วัดความสำเร็จ', message: 'กำหนด KPI และงบประมาณชัดเจน' },
      { type: 'pass', field: 'การประเมินความเสี่ยง', message: 'มีแผนรองรับกรณีเกิดวิกฤติตอบโต้ข่าวสาร' },
    ],
  }
];

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

export const INITIAL_DOCUMENTS: GovDocument[] = generateInitialDocuments();
