import { DocumentInspection, InspectionChecklistItem } from '../types';

export const standard16ChecklistTemplate: { key: string; label: string }[] = [
  { key: 'org_name', label: '1. ชื่อหน่วยงาน' },
  { key: 'doc_number', label: '2. เลขที่หนังสือ' },
  { key: 'doc_date', label: '3. วันที่' },
  { key: 'subject', label: '4. เรื่อง' },
  { key: 'recipient', label: '5. เรียน' },
  { key: 'enclosures', label: '6. สิ่งที่ส่งมาด้วย' },
  { key: 'content', label: '7. เนื้อหา' },
  { key: 'reference', label: '8. ข้อความอ้างถึง' },
  { key: 'signer', label: '9. ผู้ลงนาม' },
  { key: 'signer_position', label: '10. ตำแหน่งผู้ลงนาม' },
  { key: 'department', label: '11. ส่วนราชการเจ้าของเรื่อง' },
  { key: 'contact_phone', label: '12. เบอร์ติดต่อ' },
  { key: 'page_count', label: '13. จำนวนหน้า' },
  { key: 'attachments', label: '14. เอกสารแนบ' },
  { key: 'doc_format', label: '15. รูปแบบเอกสาร' },
  { key: 'data_completeness', label: '16. ความครบถ้วนของข้อมูล' },
];

export const initialInspections: DocumentInspection[] = [
  {
    id: 'INS-2569-001',
    fileName: 'หนังสือขออนุมัติจัดสรรงบประมาณไตรมาส4.pdf',
    fileType: 'PDF',
    fileSize: '1.8 MB',
    uploadedAt: '2026-09-06 09:30',
    documentType: 'หนังสือภายนอก',
    documentNumber: 'กห 0401/1892',
    documentDate: '2026-09-04',
    subject: 'ขอรับการจัดสรรงบประมาณรายจ่ายเพิ่มเติม โครงการศูนย์ปฏิบัติการดิจิทัล',
    sender: 'กรมเทคโนโลยีสารสนเทศและอวกาศกลาโหม',
    recipient: 'ผู้อำนวยการฝ่ายอำนวยการกลาง (ศอ.01)',
    reference: 'หนังสือ กห 0401/1205 ลงวันที่ 15 กรกฎาคม 2569',
    attachmentInfo: 'โครงการและตารางประมาณการราคา จำนวน 1 ชุด (12 แผ่น)',
    signer: 'พล.ท. ชัยรัตน์ พงษ์ไพบูลย์',
    signerPosition: 'เจ้ากรมเทคโนโลยีสารสนเทศฯ',
    pageCount: 14,
    score: 95,
    status: 'สมบูรณ์',
    issues: [],
    suggestions: [
      'เอกสารมีองค์ประกอบตามระเบียบสารบรรณครบถ้วน สามารถเสนอผู้บังคับบัญชาเพื่อพิจารณาได้',
      'ควรตรวจสอบตารางคำนวณงบประมาณในเอกสารแนบแผ่นที่ 7 ให้ตรงกับยอดเงินที่ระบุในเนื้อหา'
    ],
    aiSummary: {
      pointsFound: [
        'พบตราครุฑและหัวหนังสือถูกต้องตามระเบียบงานสารบรรณ พ.ศ. 2526 และที่แก้ไขเพิ่มเติม',
        'เลขที่หนังสือ วันที่ เรื่อง และคำขึ้นต้น "เรียน" มีความสมบูรณ์ชัดเจน',
        'ผู้ลงนามระบุยศ ชื่อ นามสกุล และตำแหน่งถูกต้องตรงตามฐานข้อมูลส่วนราชการ',
        'มีส่วนราชการเจ้าของเรื่องและหมายเลขโทรศัพท์ติดต่อประสานงานครบถ้วน'
      ],
      pointsToVerify: [
        'ตรวจสอบความสอดคล้องของตัวเลขวงเงินระหว่างเนื้อความหลักและตารางแนบท้าย'
      ],
      potentialMissing: [],
      recommendations: [
        'จัดทำใบนำเสนอบันทึกความเห็นเสนอ ผอ.ศอ.01 เพื่อลงนามเห็นชอบ',
        'ส่งสำเนาให้กลุ่มงานแผนงานและงบประมาณ (UNIT-002) ทำการบันทึกผูกพันงบประมาณ'
      ],
      executiveBrief: 'หนังสือราชการภายนอกมีความครบถ้วนสมบูรณ์ในระดับสูงมาก (95/100) โครงสร้างระเบียบงานสารบรรณถูกต้องครบทุกมิติ'
    },
    checklist: [
      { key: 'org_name', label: '1. ชื่อหน่วยงาน', status: 'found', details: 'กรมเทคโนโลยีสารสนเทศและอวกาศกลาโหม', suggestion: 'ข้อมูลถูกต้องตรงตามทำเนียบส่วนราชการ' },
      { key: 'doc_number', label: '2. เลขที่หนังสือ', status: 'found', details: 'กห 0401/1892', suggestion: 'รูปแบบรหัสพยัญชนะและเลขทะเบียนถูกต้อง' },
      { key: 'doc_date', label: '3. วันที่', status: 'found', details: '4 กันยายน 2569', suggestion: 'การระบุวัน เดือน ปี ครบถ้วนตามมาตรฐาน' },
      { key: 'subject', label: '4. เรื่อง', status: 'found', details: 'ขอรับการจัดสรรงบประมาณรายจ่ายเพิ่มเติมฯ', suggestion: 'กระชับและสื่อใจความชัดเจน' },
      { key: 'recipient', label: '5. เรียน', status: 'found', details: 'ผู้อำนวยการฝ่ายอำนวยการกลาง (ศอ.01)', suggestion: 'ระบุตำแหน่งผู้รับถูกต้อง' },
      { key: 'enclosures', label: '6. สิ่งที่ส่งมาด้วย', status: 'found', details: 'เอกสารโครงการและประมาณการราคา 1 ชุด (12 แผ่น)', suggestion: 'ระบุจำนวนและรายละเอียดชัดเจน' },
      { key: 'content', label: '7. เนื้อหา', status: 'found', details: 'มี 3 ย่อหน้า ประกอบด้วยเหตุผล ความประสงค์ และข้อพิจารณา', suggestion: 'โครงสร้างใจความตามระเบียบงานสารบรรณครบถ้วน' },
      { key: 'reference', label: '8. ข้อความอ้างถึง', status: 'found', details: 'หนังสือ กห 0401/1205 ลงวันที่ 15 ก.ค. 2569', suggestion: 'มีหนังสืออ้างอิงชัดเจน' },
      { key: 'signer', label: '9. ผู้ลงนาม', status: 'found', details: 'พล.ท. ชัยรัตน์ พงษ์ไพบูลย์', suggestion: 'ลายมือชื่อและพิมพ์ชื่อเต็มใต้ลายมือชื่อ' },
      { key: 'signer_position', label: '10. ตำแหน่งผู้ลงนาม', status: 'found', details: 'เจ้ากรมเทคโนโลยีสารสนเทศและอวกาศกลาโหม', suggestion: 'ระบุตำแหน่งบริหารตรงตามฐานข้อมูล' },
      { key: 'department', label: '11. ส่วนราชการเจ้าของเรื่อง', status: 'found', details: 'กองนโยบายและแผนเทคโนโลยีสารสนเทศ', suggestion: 'ระบุส่วนราชการระดับกองถูกต้อง' },
      { key: 'contact_phone', label: '12. เบอร์ติดต่อ', status: 'found', details: 'โทร. 0 2225 1900 ต่อ 4321', suggestion: 'มีเบอร์โทรศัพท์และเบอร์ต่อภายในชัดเจน' },
      { key: 'page_count', label: '13. จำนวนหน้า', status: 'found', details: '14 หน้า (หนังสือหลัก 2 หน้า, ภาคผนวก 12 หน้า)', suggestion: 'เลขหน้าตรงกับสารบัญ' },
      { key: 'attachments', label: '14. เอกสารแนบ', status: 'found', details: 'ไฟล์แนบสมบูรณ์ ไม่ชำรุดเสียหาย', suggestion: 'เอกสารแนบสแกนความละเอียดสูงอ่านง่าย' },
      { key: 'doc_format', label: '15. รูปแบบเอกสาร', status: 'found', details: 'ฟอนต์ TH Sarabun PSK 16pt กั้นหน้า 3 ซม. กั้นหลัง 2 ซม.', suggestion: 'ขนาดตัวอักษรและระยะขอบถูกต้องตามมาตรฐาน' },
      { key: 'data_completeness', label: '16. ความครบถ้วนของข้อมูล', status: 'found', details: 'ข้อมูลหลักและข้อมูลประกอบครบ 100%', suggestion: 'พร้อมรับเข้าสู่ระบบงานสารบรรณ' },
    ],
    checkedAt: '2026-09-06 09:32',
    checkedBy: 'AI Document Inspector v2.4 (เจ้าหน้าที่: พ.อ.หญิง สุชาดา วิชิตกุล)',
    version: 1,
    history: [
      { id: 'H1', action: 'อัปโหลด', timestamp: '2026-09-06 09:30', actor: 'ส.อ. พงษ์เพชร เมฆินทร์', notes: 'อัปโหลดไฟล์เข้าระบบผ่านหน้าจอรับหนังสือ' },
      { id: 'H2', action: 'ตรวจสอบ', timestamp: '2026-09-06 09:32', actor: 'AI Document Inspector', notes: 'วิเคราะห์โครงสร้าง 16 องค์ประกอบ คะแนน 95/100' },
      { id: 'H3', action: 'จัดเก็บ', timestamp: '2026-09-06 09:35', actor: 'พ.อ.หญิง สุชาดา วิชิตกุล', notes: 'ส่งต่อฝ่ายงบประมาณดำเนินการ' }
    ]
  },
  {
    id: 'INS-2569-002',
    fileName: 'คำสั่งแต่งตั้งคณะทำงานขับเคลื่อนองค์กรดิจิทัล.docx',
    fileType: 'DOCX',
    fileSize: '420 KB',
    uploadedAt: '2026-09-05 14:15',
    documentType: 'คำสั่ง',
    documentNumber: 'คำสั่ง ศอ. ที่ 88/2569',
    documentDate: '2026-09-05',
    subject: 'แต่งตั้งคณะทำงานขับเคลื่อนการพัฒนาระบบราชการดิจิทัล ประจำปี 2569',
    sender: 'ฝ่ายอำนวยการกลาง (ศอ.01)',
    recipient: 'กำลังพลและกลุ่มงานในสังกัด ศอ.',
    reference: '-',
    attachmentInfo: 'บัญชีรายชื่อคณะทำงานแนบท้ายคำสั่ง (3 แผ่น)',
    signer: 'พล.ต. สมชาย เกียรติเกรียงไกร',
    signerPosition: 'ผู้อำนวยการฝ่ายอำนวยการ',
    pageCount: 5,
    score: 92,
    status: 'สมบูรณ์',
    issues: [],
    suggestions: [
      'ตรวจสอบการระบุอำนาจหน้าที่ของคณะทำงานในข้อ 4 ให้ครอบคลุมการประสานงานภายนอก'
    ],
    aiSummary: {
      pointsFound: [
        'โครงสร้างคำสั่งราชการถูกต้อง มีคำปรารภ ข้อกำหนดรายชื่อ และข้อสั่งการบังคับใช้',
        'การจัดลำดับคณะทำงานประกอบด้วย ประธาน รองประธาน กรรมการ และเลขานุการ ครบถ้วน'
      ],
      pointsToVerify: ['ตรวจสอบลำดับอาวุโสของรายชื่อกรรมการในบัญชีแนบท้าย'],
      potentialMissing: [],
      recommendations: ['จัดพิมพ์เป็นเอกสารต้นฉบับเพื่อให้ ผอ.ศอ. ลงนามฉบับจริง'],
      executiveBrief: 'เอกสารคำสั่งมีโครงสร้างที่ถูกต้องตามระเบียบสำนักนายกรัฐมนตรี คะแนน 92/100'
    },
    checklist: [
      { key: 'org_name', label: '1. ชื่อหน่วยงาน', status: 'found', details: 'สำนักงานฝ่ายอำนวยการกลาง', suggestion: 'ถูกต้อง' },
      { key: 'doc_number', label: '2. เลขที่หนังสือ', status: 'found', details: 'คำสั่ง ศอ. ที่ 88/2569', suggestion: 'ถูกต้อง' },
      { key: 'doc_date', label: '3. วันที่', status: 'found', details: '5 กันยายน 2569', suggestion: 'ระบุ "สั่ง ณ วันที่..." ถูกต้อง' },
      { key: 'subject', label: '4. เรื่อง', status: 'found', details: 'แต่งตั้งคณะทำงานขับเคลื่อนฯ', suggestion: 'ถูกต้อง' },
      { key: 'recipient', label: '5. เรียน', status: 'found', details: 'ไม่ได้ระบุเนื่องจากเป็นคำสั่งภายใน (ตามระเบียบ)', suggestion: 'ถูกต้องตามแบบคำสั่ง' },
      { key: 'enclosures', label: '6. สิ่งที่ส่งมาด้วย', status: 'found', details: 'บัญชีแนบท้าย 3 แผ่น', suggestion: 'ระบุถูกต้อง' },
      { key: 'content', label: '7. เนื้อหา', status: 'found', details: 'ใจความสมบูรณ์ระบุอำนาจหน้าที่ 5 ข้อ', suggestion: 'ครบถ้วน' },
      { key: 'reference', label: '8. ข้อความอ้างถึง', status: 'found', details: 'อ้างพระราชกฤษฎีกาการบริหารกิจการบ้านเมืองที่ดี', suggestion: 'ระบุฐานกฎหมายชัดเจน' },
      { key: 'signer', label: '9. ผู้ลงนาม', status: 'found', details: 'พล.ต. สมชาย เกียรติเกรียงไกร', suggestion: 'ถูกต้อง' },
      { key: 'signer_position', label: '10. ตำแหน่งผู้ลงนาม', status: 'found', details: 'ผู้อำนวยการฝ่ายอำนวยการ', suggestion: 'ถูกต้อง' },
      { key: 'department', label: '11. ส่วนราชการเจ้าของเรื่อง', status: 'found', details: 'กลุ่มงานสารบรรณและเอกสารกลาง', suggestion: 'ถูกต้อง' },
      { key: 'contact_phone', label: '12. เบอร์ติดต่อ', status: 'found', details: 'โทร. 02-555-0103', suggestion: 'ถูกต้อง' },
      { key: 'page_count', label: '13. จำนวนหน้า', status: 'found', details: '5 หน้า', suggestion: 'ครบถ้วน' },
      { key: 'attachments', label: '14. เอกสารแนบ', status: 'found', details: 'มีบัญชีรายชื่อครบทั้ง 15 นาย', suggestion: 'ถูกต้อง' },
      { key: 'doc_format', label: '15. รูปแบบเอกสาร', status: 'found', details: 'รูปแบบคำสั่งราชการมาตรฐาน', suggestion: 'ถูกต้อง' },
      { key: 'data_completeness', label: '16. ความครบถ้วนของข้อมูล', status: 'found', details: 'ข้อมูลครบถ้วน', suggestion: 'สมบูรณ์' }
    ],
    checkedAt: '2026-09-05 14:18',
    checkedBy: 'AI Document Inspector v2.4 (พ.ต. กฤษดา ธนวัฒน์)',
    version: 1,
    history: [
      { id: 'H4', action: 'อัปโหลด', timestamp: '2026-09-05 14:15', actor: 'พ.ต. กฤษดา ธนวัฒน์' },
      { id: 'H5', action: 'ตรวจสอบ', timestamp: '2026-09-05 14:18', actor: 'AI Inspector', notes: 'คะแนน 92/100' }
    ]
  },
  {
    id: 'INS-2569-003',
    fileName: 'แบบขออนุมัติเดินทางไปราชการฝึกอบรมเชียงใหม่.pdf',
    fileType: 'PDF',
    fileSize: '890 KB',
    uploadedAt: '2026-09-04 11:20',
    documentType: 'บันทึกข้อความ',
    documentNumber: 'ศอ 0404/ว 312',
    documentDate: '2026-09-03',
    subject: 'ขออนุมัติเดินทางไปปฏิบัติราชการและเข้าร่วมการฝึกอบรมระบบความปลอดภัยไซเบอร์',
    sender: 'ศูนย์เทคโนโลยีสารสนเทศและการสื่อสาร',
    recipient: 'ผู้อำนวยการฝ่ายอำนวยการ',
    reference: 'หนังสือเชิญ สกอ. ที่ 021/2569',
    attachmentInfo: 'กำหนดการฝึกอบรม 1 ฉบับ',
    signer: 'พ.ต. กฤษดา ธนวัฒน์',
    signerPosition: 'หัวหน้าศูนย์เทคโนโลยีสารสนเทศและการสื่อสาร',
    pageCount: 3,
    score: 84,
    status: 'ควรตรวจสอบบางรายการ',
    issues: [
      'ไม่พบการระบุหมายเลขทะเบียนรถยนต์ส่วนกลางที่ขอใช้ในการเดินทาง',
      'ประมาณการค่าใช้จ่ายค้างการรับรองจากเจ้าหน้าที่การเงิน'
    ],
    suggestions: [
      'ควรเพิ่มหมายเลขทะเบียนรถยนต์ และผู้ควบคุมยานพาหนะตามระเบียบการใช้รถยนต์ส่วนกลาง',
      'ให้ น.ส. ศศิธร บุญญาภิวัฒน์ เจ้าหน้าที่การเงินลงนามรับรองงบประมาณก่อนเสนอ ผอ.'
    ],
    aiSummary: {
      pointsFound: [
        'หัวบันทึกข้อความ ส่วนราชการ วันที่ เรื่อง และเรียน ถูกต้องครบถ้วน',
        'ระบุวัตถุประสงค์และกำหนดการเดินทางระหว่าง 15-18 กันยายน 2569 ชัดเจน'
      ],
      pointsToVerify: [
        'ตรวจสอบความพร้อมของยานพาหนะและคนขับรถยนต์ส่วนกลาง',
        'ตรวจสอบยอดเบิกจ่ายเบี้ยเลี้ยงและที่พักให้ตรงตามพระราชกฤษฎีกาค่าใช้จ่ายในการเดินทางไปราชการ'
      ],
      potentialMissing: [
        'ยังไม่มีลายเซ็นหรือตราประทับตรวจงบประมาณของกลุ่มงานงบประมาณ'
      ],
      recommendations: [
        'ประสานกลุ่มงานส่งกำลังบำรุง (UNIT-005) เพื่อระบุหมายเลขทะเบียนรถ',
        'ส่งแบบคำขอให้งานการเงินตรวจงบก่อนเสนอลงนาม'
      ],
      executiveBrief: 'เอกสารมีเนื้อหาหลักครบถ้วน แต่ควรตรวจสอบและเติมเต็มข้อมูลยานพาหนะและการรับรองงบประมาณ (84/100)'
    },
    checklist: [
      { key: 'org_name', label: '1. ชื่อหน่วยงาน', status: 'found', details: 'ศูนย์เทคโนโลยีสารสนเทศและการสื่อสาร', suggestion: 'ถูกต้อง' },
      { key: 'doc_number', label: '2. เลขที่หนังสือ', status: 'found', details: 'ศอ 0404/ว 312', suggestion: 'ถูกต้อง' },
      { key: 'doc_date', label: '3. วันที่', status: 'found', details: '3 กันยายน 2569', suggestion: 'ถูกต้อง' },
      { key: 'subject', label: '4. เรื่อง', status: 'found', details: 'ขออนุมัติเดินทางไปปฏิบัติราชการฯ', suggestion: 'ถูกต้อง' },
      { key: 'recipient', label: '5. เรียน', status: 'found', details: 'ผู้อำนวยการฝ่ายอำนวยการ', suggestion: 'ถูกต้อง' },
      { key: 'enclosures', label: '6. สิ่งที่ส่งมาด้วย', status: 'found', details: 'กำหนดการฝึกอบรม 1 ฉบับ', suggestion: 'ถูกต้อง' },
      { key: 'content', label: '7. เนื้อหา', status: 'found', details: 'ระบุภารกิจและกำหนดการครบถ้วน', suggestion: 'ถูกต้อง' },
      { key: 'reference', label: '8. ข้อความอ้างถึง', status: 'found', details: 'หนังสือเชิญ สกอ. ที่ 021/2569', suggestion: 'ถูกต้อง' },
      { key: 'signer', label: '9. ผู้ลงนาม', status: 'found', details: 'พ.ต. กฤษดา ธนวัฒน์', suggestion: 'ถูกต้อง' },
      { key: 'signer_position', label: '10. ตำแหน่งผู้ลงนาม', status: 'found', details: 'หัวหน้าศูนย์เทคโนโลยีสารสนเทศฯ', suggestion: 'ถูกต้อง' },
      { key: 'department', label: '11. ส่วนราชการเจ้าของเรื่อง', status: 'found', details: 'ศูนย์เทคโนโลยีสารสนเทศฯ', suggestion: 'ถูกต้อง' },
      { key: 'contact_phone', label: '12. เบอร์ติดต่อ', status: 'found', details: '02-555-0106', suggestion: 'ถูกต้อง' },
      { key: 'page_count', label: '13. จำนวนหน้า', status: 'found', details: '3 หน้า', suggestion: 'ถูกต้อง' },
      { key: 'attachments', label: '14. เอกสารแนบ', status: 'warning', details: 'พบกำหนดการ แต่ขาดใบเสนอประมาณการค่าใช้จ่ายฉบับจริง', suggestion: 'แนบใบประมาณการค่าใช้จ่าย' },
      { key: 'doc_format', label: '15. รูปแบบเอกสาร', status: 'found', details: 'แบบฟอร์มบันทึกข้อความราชการ', suggestion: 'ถูกต้อง' },
      { key: 'data_completeness', label: '16. ความครบถ้วนของข้อมูล', status: 'warning', details: 'ขาดข้อมูลทะเบียนยานพาหนะ', suggestion: 'ควรระบุข้อมูลยานพาหนะให้ครบถ้วน' }
    ],
    checkedAt: '2026-09-04 11:22',
    checkedBy: 'AI Document Inspector v2.4 (ส.อ. สุรชัย เมธาสิทธิ์)',
    version: 1,
    history: [
      { id: 'H6', action: 'อัปโหลด', timestamp: '2026-09-04 11:20', actor: 'ส.อ. สุรชัย เมธาสิทธิ์' },
      { id: 'H7', action: 'ตรวจสอบ', timestamp: '2026-09-04 11:22', actor: 'AI Inspector', notes: 'พบข้อสังเกต 2 รายการ คะแนน 84/100' }
    ]
  },
  {
    id: 'INS-2569-004',
    fileName: 'สัญญาจ้างปรับปรุงเครือข่ายความเร็วสูง.docx',
    fileType: 'DOCX',
    fileSize: '1.2 MB',
    uploadedAt: '2026-09-03 16:40',
    documentType: 'สัญญา/ข้อตกลง',
    documentNumber: 'สัญญาจ้างเลขที่ 45/2569',
    documentDate: '2026-09-01',
    subject: 'สัญญาจ้างปรับปรุงระบบโครงข่ายใยแก้วนำแสงภายในอาคารสำนักงาน',
    sender: 'ห้างหุ้นส่วนจำกัด สยามเทเลคอมแอนด์เน็ตเวิร์ก',
    recipient: 'สำนักงานฝ่ายอำนวยการกลาง',
    reference: 'ประกาศผู้ชนะการเสนอราคา ลงวันที่ 20 สิงหาคม 2569',
    attachmentInfo: 'ข้อกำหนดคุณลักษณะเฉพาะ (TOR) และใบเสนอราคา',
    signer: 'นาย ธนัท นิมิตวิชัย (ผู้ตรวจร่าง)',
    signerPosition: 'นิติกรปฏิบัติการ',
    pageCount: 18,
    score: 88,
    status: 'ควรตรวจสอบบางรายการ',
    issues: [
      'ข้อความในข้อ 7 วรรคสอง มีการเว้นวรรคและระบุหลักประกันสัญญาไม่ตรงกับยอดเงิน 5%',
      'ยังไม่ได้แนบสำเนาหนังสือรับรองนิติบุคคลของผู้รับจ้างที่มีอายุไม่เกิน 3 เดือน'
    ],
    suggestions: [
      'แก้ไขยอดหลักประกันสัญญาจาก 72,500 บาท เป็น 75,000 บาท (ให้คิดเป็น 5% ของมูลค่าสัญญา 1,500,000 บาท)',
      'ขอสำเนาหนังสือรับรองนิติบุคคลฉบับล่าสุดจากคู่สัญญา'
    ],
    aiSummary: {
      pointsFound: [
        'คู่สัญญา วัตถุประสงค์แห่งสัญญา กำหนดเวลาส่งมอบ และการจ่ายเงินระบุชัดเจน',
        'เงื่อนไขค่าปรับและเหตุสุดวิสัยเป็นไปตามพระราชบัญญัติการจัดซื้อจัดจ้างฯ พ.ศ. 2560'
      ],
      pointsToVerify: ['คำนวณยอดเงินหลักประกันสัญญาและระยะเวลาการรับประกันผลงาน (2 ปี)'],
      potentialMissing: ['สำเนาหนังสือรับรองนิติบุคคลและบัตรประจำตัวประชาชนผู้มีอำนาจลงนาม'],
      recommendations: ['ส่งให้นิติกรชำนาญการ (นาย ธนพล ศิริโรจน์) ตรวจสอบความถูกต้องของวรรคสัญญา'],
      executiveBrief: 'ร่างสัญญาถูกต้องตามมาตรฐานกรมบัญชีกลาง แต่มีจุดคำนวณวงเงินค้ำประกันที่ต้องปรับแก้ (88/100)'
    },
    checklist: [
      { key: 'org_name', label: '1. ชื่อหน่วยงาน', status: 'found', details: 'สำนักงานฝ่ายอำนวยการกลาง', suggestion: 'ถูกต้อง' },
      { key: 'doc_number', label: '2. เลขที่หนังสือ', status: 'found', details: 'สัญญาจ้างเลขที่ 45/2569', suggestion: 'ถูกต้อง' },
      { key: 'doc_date', label: '3. วันที่', status: 'found', details: '1 กันยายน 2569', suggestion: 'ถูกต้อง' },
      { key: 'subject', label: '4. เรื่อง', status: 'found', details: 'สัญญาจ้างปรับปรุงระบบโครงข่ายฯ', suggestion: 'ถูกต้อง' },
      { key: 'recipient', label: '5. เรียน', status: 'found', details: 'คู่สัญญาและส่วนราชการคู่สัญญา', suggestion: 'ถูกต้อง' },
      { key: 'enclosures', label: '6. สิ่งที่ส่งมาด้วย', status: 'found', details: 'TOR และใบเสนอราคา', suggestion: 'ถูกต้อง' },
      { key: 'content', label: '7. เนื้อหา', status: 'warning', details: 'มีจุดพิมพ์ยอดหลักประกันสัญญาคลาดเคลื่อนในข้อ 7', suggestion: 'แก้ไขตัวเลขให้ตรงกับสูตร 5%' },
      { key: 'reference', label: '8. ข้อความอ้างถึง', status: 'found', details: 'ประกาศผู้ชนะการเสนอราคา', suggestion: 'ถูกต้อง' },
      { key: 'signer', label: '9. ผู้ลงนาม', status: 'found', details: 'ช่องลงนามผู้ว่าจ้างและผู้รับจ้าง', suggestion: 'รอลงนามจริง' },
      { key: 'signer_position', label: '10. ตำแหน่งผู้ลงนาม', status: 'found', details: 'ระบุตำแหน่งถูกต้อง', suggestion: 'ถูกต้อง' },
      { key: 'department', label: '11. ส่วนราชการเจ้าของเรื่อง', status: 'found', details: 'กลุ่มงานส่งกำลังบำรุงฯ', suggestion: 'ถูกต้อง' },
      { key: 'contact_phone', label: '12. เบอร์ติดต่อ', status: 'found', details: 'โทร. 02-555-0105', suggestion: 'ถูกต้อง' },
      { key: 'page_count', label: '13. จำนวนหน้า', status: 'found', details: '18 หน้า', suggestion: 'ถูกต้อง' },
      { key: 'attachments', label: '14. เอกสารแนบ', status: 'warning', details: 'ขาดหนังสือรับรองนิติบุคคลคู่สัญญา', suggestion: 'เรียกขอเอกสารเพิ่มเติม' },
      { key: 'doc_format', label: '15. รูปแบบเอกสาร', status: 'found', details: 'แบบสัญญาจ้างมาตรฐานของกระทรวงการคลัง', suggestion: 'ถูกต้อง' },
      { key: 'data_completeness', label: '16. ความครบถ้วนของข้อมูล', status: 'found', details: 'มีใจความสำคัญครบถ้วน', suggestion: 'แก้ไขจุดที่แจ้งก่อนลงนาม' }
    ],
    checkedAt: '2026-09-03 16:45',
    checkedBy: 'AI Document Inspector v2.4 (นาย ธนพล ศิริโรจน์)',
    version: 1,
    history: [
      { id: 'H8', action: 'อัปโหลด', timestamp: '2026-09-03 16:40', actor: 'นาย ธนัท นิมิตวิชัย' },
      { id: 'H9', action: 'ตรวจสอบ', timestamp: '2026-09-03 16:45', actor: 'AI Inspector', notes: 'พบจุดผิดในข้อ 7' }
    ]
  },
  {
    id: 'INS-2569-005',
    fileName: 'ใบเสร็จและใบสำคัญรับเงินค่าเดินทางราชการ_สิงหาคม.xlsx',
    fileType: 'XLSX',
    fileSize: '650 KB',
    uploadedAt: '2026-09-02 10:10',
    documentType: 'ใบสำคัญทางการเงิน',
    documentNumber: 'วบ 89/2569',
    documentDate: '2026-08-31',
    subject: 'สรุปใบสำคัญรับเงินค่าเบี้ยเลี้ยงและค่าพาหนะ ประจำเดือนสิงหาคม 2569',
    sender: 'กลุ่มงานส่งกำลังบำรุงและยานพาหนะ',
    recipient: 'กลุ่มงานแผนงานและงบประมาณ',
    reference: 'คำสั่งไปราชการ ที่ 112/2569 - 128/2569',
    attachmentInfo: 'ใบเสร็จค่าน้ำมันเชื้อเพลิงและตั๋วโดยสาร 24 ใบ',
    signer: 'พ.ท. ประเสริฐ ยอดสิงห์',
    signerPosition: 'หัวหน้ากลุ่มงานส่งกำลังบำรุง',
    pageCount: 6,
    score: 91,
    status: 'สมบูรณ์',
    issues: [],
    suggestions: [
      'ยอดรวมตรงกับสลิปแนบทั้งหมด พร้อมผ่านเข้าสู่ระบบเบิกจ่ายอิเล็กทรอนิกส์'
    ],
    aiSummary: {
      pointsFound: [
        'สูตรการคำนวณในชีท Excel มีความถูกต้องสัมพันธ์กัน ไม่พบสูตร #REF! หรือ #VALUE!',
        'การจับคู่รหัสคำสั่งไปราชการกับใบเสร็จครบทั้ง 24 ฉบับ'
      ],
      pointsToVerify: ['ตรวจสอบลายมือชื่อผู้รับเงินในใบสำคัญรับเงิน (บก.111) ให้ครบทุกราย'],
      potentialMissing: [],
      recommendations: ['ส่งข้อมูลต่อให้เจ้าหน้าที่การเงินทำเรื่องขอเบิกเงินจากคลังจังหวัด'],
      executiveBrief: 'เอกสารรายงานการเงินและตารางคำนวณมีความถูกต้องครบถ้วน คะแนน 91/100'
    },
    checklist: standard16ChecklistTemplate.map(c => ({
      key: c.key,
      label: c.label,
      status: 'found' as const,
      details: `ตรวจสอบข้อมูล ${c.label} ถูกต้องตามระเบียบการเบิกจ่าย`,
      suggestion: 'ข้อมูลสมบูรณ์'
    })),
    checkedAt: '2026-09-02 10:15',
    checkedBy: 'AI Document Inspector v2.4 (น.ส. ศศิธร บุญญาภิวัฒน์)',
    version: 1,
    history: [
      { id: 'H10', action: 'อัปโหลด', timestamp: '2026-09-02 10:10', actor: 'น.ส. ศศิธร บุญญาภิวัฒน์' },
      { id: 'H11', action: 'ตรวจสอบ', timestamp: '2026-09-02 10:15', actor: 'AI Inspector', notes: 'ผ่านการตรวจสอบความสมบูรณ์' }
    ]
  },
  {
    id: 'INS-2569-006',
    fileName: 'หนังสือร้องเรียนเรื่องถนนทางเข้าหน่วยงานชำรุด.jpg',
    fileType: 'JPG',
    fileSize: '3.4 MB',
    uploadedAt: '2026-09-01 13:00',
    documentType: 'หนังสือภายนอก/คำร้อง',
    documentNumber: 'ที่ ชุมชน 08/2569',
    documentDate: '2026-08-28',
    subject: 'ขอความอนุเคราะห์ซ่อมแซมผิวจราจรและระบบระบายน้ำบริเวณทางเข้าหลัก',
    sender: 'ประธานคณะกรรมการชุมชนพหลโยธินร่วมใจ',
    recipient: 'ผู้อำนวยการฝ่ายอำนวยการกลาง',
    reference: '-',
    attachmentInfo: 'ภาพถ่ายความเสียหาย 4 ภาพ',
    signer: 'นาย สมเกียรติ สว่างวงศ์',
    signerPosition: 'ประธานชุมชน',
    pageCount: 2,
    score: 68,
    status: 'ควรตรวจสอบหลายรายการ',
    issues: [
      'ภาพถ่ายเอกสารมีความเอียงเล็กน้อยและความคมชัดปานกลาง OCR อ่านตัวเลขบัตรประจำตัวผู้ร้องเรียนไม่ชัด',
      'ไม่พบการระบุหมายเลขโทรศัพท์ติดต่อกลับของผู้ร้องเรียน',
      'ไม่มีการประทับตราหรือหนังสือรับรองสถานะประธานชุมชน'
    ],
    suggestions: [
      'ให้เจ้าหน้าที่สารบรรณโทรศัพท์สอบถามหรือบันทึกหมายเลขติดต่อของผู้ประสานงานชุมชนเพิ่มเติม',
      'ควรสแกนภาพเอกสารด้วยเครื่องสแกนความละเอียด 300 DPI แทนการถ่ายภาพด้วยมือถือ'
    ],
    aiSummary: {
      pointsFound: ['ระบุสถานที่ จุดเกิดเหตุ และความเดือดร้อนของประชาชนชัดเจน'],
      pointsToVerify: ['ตรวจสอบเขตความรับผิดชอบของถนนว่าเป็นของสำนักงานเขตหรือของหน่วยงาน'],
      potentialMissing: ['หมายเลขโทรศัพท์ติดต่อ และเอกสารรับรองตัวตน'],
      recommendations: ['ส่งเรื่องให้กลุ่มงานประชาสัมพันธ์ (UNIT-008) ประสานผู้นำชุมชนเพื่อขอข้อมูลติดต่อ'],
      executiveBrief: 'เป็นเอกสารคำร้องจากภายนอก มีความไม่สมบูรณ์ของข้อมูลติดต่อและคุณภาพไฟล์ภาพ ควรตรวจสอบข้อมูลเพิ่มเติม (68/100)'
    },
    checklist: [
      { key: 'org_name', label: '1. ชื่อหน่วยงาน', status: 'found', details: 'ชุมชนพหลโยธินร่วมใจ', suggestion: 'เป็นองค์กรภาคประชาชน' },
      { key: 'doc_number', label: '2. เลขที่หนังสือ', status: 'found', details: 'ที่ ชุมชน 08/2569', suggestion: 'มีเลขที่หนังสือ' },
      { key: 'doc_date', label: '3. วันที่', status: 'found', details: '28 สิงหาคม 2569', suggestion: 'มีวันที่ชัดเจน' },
      { key: 'subject', label: '4. เรื่อง', status: 'found', details: 'ขอความอนุเคราะห์ซ่อมแซมผิวจราจร', suggestion: 'ชัดเจน' },
      { key: 'recipient', label: '5. เรียน', status: 'found', details: 'ผู้อำนวยการฝ่ายอำนวยการกลาง', suggestion: 'ถูกต้อง' },
      { key: 'enclosures', label: '6. สิ่งที่ส่งมาด้วย', status: 'found', details: 'ภาพถ่ายความเสียหาย 4 ภาพ', suggestion: 'ภาพแนบติดมาในเอกสาร' },
      { key: 'content', label: '7. เนื้อหา', status: 'found', details: 'ระบุจุดถนนชำรุด', suggestion: 'ครบถ้วน' },
      { key: 'reference', label: '8. ข้อความอ้างถึง', status: 'missing', details: 'ไม่มีข้อความอ้างถึง', suggestion: 'เป็นเรื่องใหม่ ไม่จำเป็นต้องมี' },
      { key: 'signer', label: '9. ผู้ลงนาม', status: 'found', details: 'นาย สมเกียรติ สว่างวงศ์', suggestion: 'มีลายมือชื่อ' },
      { key: 'signer_position', label: '10. ตำแหน่งผู้ลงนาม', status: 'found', details: 'ประธานชุมชน', suggestion: 'มีตำแหน่ง' },
      { key: 'department', label: '11. ส่วนราชการเจ้าของเรื่อง', status: 'warning', details: 'ชุมชนภายนอก', suggestion: 'ควรระบุที่อยู่ให้ชัด' },
      { key: 'contact_phone', label: '12. เบอร์ติดต่อ', status: 'missing', details: 'ไม่พบหมายเลขโทรศัพท์ในเอกสาร', suggestion: 'ต้องประสานขอเบอร์ติดต่อกลับ' },
      { key: 'page_count', label: '13. จำนวนหน้า', status: 'found', details: '2 หน้า', suggestion: 'ตรงตามไฟล์' },
      { key: 'attachments', label: '14. เอกสารแนบ', status: 'warning', details: 'ภาพถ่ายขาวดำความละเอียดต่ำ', suggestion: 'ขอไฟล์ภาพสีเพิ่มเติม' },
      { key: 'doc_format', label: '15. รูปแบบเอกสาร', status: 'warning', details: 'หนังสือประเภทหนังสือภายนอกของภาคเอกชน/ประชาชน', suggestion: 'รูปแบบไม่เป็นทางการแต่รับพิจารณาได้' },
      { key: 'data_completeness', label: '16. ความครบถ้วนของข้อมูล', status: 'warning', details: 'ขาดข้อมูลติดต่อและพิกัดแผนที่แน่ชัด', suggestion: 'สอบถามข้อมูลเพิ่มเติม' }
    ],
    checkedAt: '2026-09-01 13:05',
    checkedBy: 'AI Document Inspector v2.4 (ส.อ. พงษ์เพชร เมฆินทร์)',
    version: 1,
    history: [
      { id: 'H12', action: 'อัปโหลด', timestamp: '2026-09-01 13:00', actor: 'ส.อ. พงษ์เพชร เมฆินทร์' },
      { id: 'H13', action: 'ตรวจสอบ', timestamp: '2026-09-01 13:05', actor: 'AI Inspector', notes: 'พบข้อสังเกตเบอร์ติดต่อ' }
    ]
  },
  {
    id: 'INS-2569-007',
    fileName: 'ร่างประกาศจัดซื้อระบบรักษาความปลอดภัยอัจฉริยะ.pdf',
    fileType: 'PDF',
    fileSize: '1.5 MB',
    uploadedAt: '2026-08-30 15:30',
    documentType: 'ประกาศ',
    documentNumber: 'ประกาศ ศอ. ที่ 12/2569',
    documentDate: '2026-08-30',
    subject: 'ประกวดราคาซื้อระบบรักษาความปลอดภัยและกล้องตรวจจับใบหน้า ด้วยวิธี e-bidding',
    sender: 'กลุ่มงานส่งกำลังบำรุงและยานพาหนะ',
    recipient: 'สาธารณชนและผู้ประกอบการ',
    reference: 'แผนการจัดซื้อจัดจ้าง ประจำปีงบประมาณ พ.ศ. 2569',
    attachmentInfo: 'เอกสารประกวดราคาซื้อด้วยวิธี e-bidding (32 หน้า)',
    signer: 'พล.ต. สมชาย เกียรติเกรียงไกร',
    signerPosition: 'ผู้อำนวยการฝ่ายอำนวยการ',
    pageCount: 35,
    score: 94,
    status: 'สมบูรณ์',
    issues: [],
    suggestions: [
      'ตรวจสอบวันและเวลาสิ้นสุดการยื่นข้อเสนอทางระบบ e-GP ให้ตรงกับวันทำการของธนาคาร'
    ],
    aiSummary: {
      pointsFound: [
        'ใช้แบบร่างประกาศประกวดราคาซื้อด้วยวิธี e-bidding ตามแบบมาตรฐานของกรมบัญชีกลาง',
        'ระบุคุณสมบัติของผู้ยื่นข้อเสนอ เงื่อนไขหลักประกันซอง และกำหนดเวลาชี้แจงครบถ้วน'
      ],
      pointsToVerify: ['ยืนยันรหัสโครงการในระบบ e-GP ว่าตรงกับเลขที่ประกาศ'],
      potentialMissing: [],
      recommendations: ['นำประกาศขึ้นเผยแพร่บนเว็บไซต์ของหน่วยงานและระบบ e-GP พร้อมกัน'],
      executiveBrief: 'ร่างประกาศจัดซื้อจัดจ้างสมบูรณ์สูงมาก (94/100) สอดคล้องกับระเบียบกระทรวงการคลัง'
    },
    checklist: standard16ChecklistTemplate.map((c, i) => ({
      key: c.key,
      label: c.label,
      status: i === 11 ? 'warning' as const : 'found' as const,
      details: i === 11 ? 'ระบุเบอร์กลางกองส่งกำลังบำรุง แต่ควรระบุเบอร์เจ้าหน้าที่พัสดุโดยตรง' : `ข้อมูล ${c.label} ถูกต้อง`,
      suggestion: i === 11 ? 'เพิ่มเบอร์ตรงผู้ดูแลโครงการ' : 'สมบูรณ์'
    })),
    checkedAt: '2026-08-30 15:35',
    checkedBy: 'AI Document Inspector v2.4 (พ.ท. ประเสริฐ ยอดสิงห์)',
    version: 1
  },
  {
    id: 'INS-2569-008',
    fileName: 'บันทึกแจ้งซ่อมแซมระบบปรับอากาศห้องเซิร์ฟเวอร์.png',
    fileType: 'PNG',
    fileSize: '1.9 MB',
    uploadedAt: '2026-08-28 09:15',
    documentType: 'บันทึกข้อความ',
    documentNumber: 'ศอ 0406/เร่งด่วน 01',
    documentDate: '2026-08-28',
    subject: 'ขออนุมัติจัดจ้างซ่อมแซมระบบปรับอากาศห้องแม่ข่ายคอมพิวเตอร์เป็นการเร่งด่วน',
    sender: 'ศูนย์เทคโนโลยีสารสนเทศและการสื่อสาร',
    recipient: 'หัวหน้ากลุ่มงานส่งกำลังบำรุงและยานพาหนะ',
    reference: '-',
    attachmentInfo: 'ใบประเมินอาการและความเสียหายจากช่าง 1 แผ่น',
    signer: 'พ.ต. กฤษดา ธนวัฒน์',
    signerPosition: 'หัวหน้าศูนย์เทคโนโลยีสารสนเทศฯ',
    pageCount: 2,
    score: 87,
    status: 'ควรตรวจสอบบางรายการ',
    issues: [
      'ระบุเหตุผลความจำเป็นเร่งด่วนชัดเจนเนื่องจากอุณหภูมิห้องเซิร์ฟเวอร์สูงเกิน 32 องศาเซลเซียส',
      'ยังขาดการอ้างอิงวงเงินงบประมาณหมวดค่าใช้จ่ายดำเนินงานที่เตรียมไว้รองรับ'
    ],
    suggestions: [
      'ประสานกลุ่มงานงบประมาณเพื่อตัดยอดจากงบดำเนินงานเร่งด่วน',
      'ขอใบเสนอราคาจากช่างซ่อมอย่างน้อย 2 รายการเพื่อเปรียบเทียบราคา'
    ],
    aiSummary: {
      pointsFound: ['ระบุปัญหา ความเสี่ยงต่อระบบข้อมูล และมาตรการแก้ไขชั่วคราวชัดเจน'],
      pointsToVerify: ['ตรวจสอบการรับประกันของเครื่องปรับอากาศว่ายังอยู่ในสัญญาประกันหรือไม่'],
      potentialMissing: ['รหัสงบประมาณที่รองรับการเบิกจ่าย'],
      recommendations: ['ดำเนินการตามขั้นตอนพัสดุกรณีจำเป็นเร่งด่วนตามมาตรา 56 วรรคหนึ่ง (2) (ง)'],
      executiveBrief: 'บันทึกข้อความมีเหตุผลความจำเป็นชัดเจน แต่ต้องเพิ่มการอ้างอิงรหัสงบประมาณ (87/100)'
    },
    checklist: standard16ChecklistTemplate.map(c => ({
      key: c.key,
      label: c.label,
      status: c.key === 'data_completeness' || c.key === 'attachments' ? 'warning' as const : 'found' as const,
      details: `การตรวจสอบ ${c.label}`,
      suggestion: 'ดำเนินการตามระเบียบ'
    })),
    checkedAt: '2026-08-28 09:20',
    checkedBy: 'AI Document Inspector v2.4 (ส.อ. สุรชัย เมธาสิทธิ์)',
    version: 1
  },
  {
    id: 'INS-2569-009',
    fileName: 'สรุปการประชุมคณะกรรมการบริหารงบประมาณ_สค69.pdf',
    fileType: 'PDF',
    fileSize: '2.1 MB',
    uploadedAt: '2026-08-25 16:00',
    documentType: 'รายงานการประชุม',
    documentNumber: 'รายงานการประชุม ศอ. ครั้งที่ 8/2569',
    documentDate: '2026-08-24',
    subject: 'รายงานการประชุมคณะกรรมการบริหารงบประมาณและติดตามผลการดำเนินงาน',
    sender: 'กลุ่มงานแผนงานและงบประมาณ',
    recipient: 'หัวหน้ากลุ่มงานทุกกลุ่มงานในสังกัด ศอ.',
    reference: '-',
    attachmentInfo: 'ตารางสรุปผลการเบิกจ่ายงบประมาณจำแนกตามโครงการ 1 ชุด',
    signer: 'พ.อ. วรพงษ์ ทรัพย์อนันต์',
    signerPosition: 'ประธานกรรมการ / หัวหน้ากลุ่มงานงบประมาณ',
    pageCount: 11,
    score: 96,
    status: 'สมบูรณ์',
    issues: [],
    suggestions: [
      'รายงานการประชุมจัดทำตามรูปแบบมาตรฐานและมีมติที่ประชุมในแต่ละวาระชัดเจน'
    ],
    aiSummary: {
      pointsFound: [
        'มีรายชื่อผู้มาประชุม 18 นาย ผู้ไม่มาประชุม 2 นาย พร้อมเหตุผลครบถ้วน',
        'ระเบียบวาระครบ 5 วาระ มีการลงมติรับรองรายงานการประชุมครั้งที่ผ่านมาเรียบร้อย'
      ],
      pointsToVerify: ['ติดตามความคืบหน้าของมติในวาระที่ 4 ข้อ 2 ภายในวันที่ 15 กันยายน 2569'],
      potentialMissing: [],
      recommendations: ['จัดเก็บรายงานเข้าสู่ระบบคลังเอกสารกลางดิจิทัล (Archival Center)'],
      executiveBrief: 'รายงานการประชุมมีความสมบูรณ์สูงมาก (96/100) ทุกวาระมีข้อสรุปและมติชัดเจน'
    },
    checklist: standard16ChecklistTemplate.map(c => ({
      key: c.key,
      label: c.label,
      status: 'found' as const,
      details: `${c.label} สมบูรณ์ถูกต้อง`,
      suggestion: 'เรียบร้อย'
    })),
    checkedAt: '2026-08-25 16:10',
    checkedBy: 'AI Document Inspector v2.4 (น.ส. ศศิธร บุญญาภิวัฒน์)',
    version: 1
  },
  {
    id: 'INS-2569-010',
    fileName: 'เอกสารขออนุมัติจัดกิจกรรมสัมพันธ์ชุมชนรอบหน่วย.docx',
    fileType: 'DOCX',
    fileSize: '310 KB',
    uploadedAt: '2026-08-20 11:45',
    documentType: 'บันทึกข้อความ',
    documentNumber: 'ศอ 0408/55',
    documentDate: '2026-08-19',
    subject: 'ขออนุมัติแผนการจัดกิจกรรมจิตอาสาและมวลชนสัมพันธ์เฉลิมพระเกียรติ',
    sender: 'กลุ่มงานประชาสัมพันธ์และประสานความร่วมมือ',
    recipient: 'ผู้อำนวยการฝ่ายอำนวยการ',
    reference: 'แผนยุทธศาสตร์มวลชนสัมพันธ์ ประจำปี 2569',
    attachmentInfo: 'กำหนดการและรายชื่อชุมชนเป้าหมาย 2 แผ่น',
    signer: 'ร.อ. ชลิต ปานเจริญ',
    signerPosition: 'หัวหน้ากลุ่มงานประชาสัมพันธ์',
    pageCount: 4,
    score: 90,
    status: 'สมบูรณ์',
    issues: [],
    suggestions: [
      'ตรวจสอบแผนการประสานเจ้าหน้าที่พยาบาลและรถพยาบาลฉุกเฉินกรณีมีกิจกรรมกลางแจ้ง'
    ],
    aiSummary: {
      pointsFound: [
        'โครงสร้างบันทึกข้อความเรียบร้อย มีการจัดทำกำหนดการและกลุ่มเป้าหมายชัดเจน',
        'มีการขออนุมัติกำลังพลและยานพาหนะสนับสนุนอย่างสอดคล้อง'
      ],
      pointsToVerify: ['ประสานโรงพยาบาลหรือหน่วยแพทย์ในพื้นที่เพื่อสนับสนุนหน่วยปฐมพยาบาล'],
      potentialMissing: [],
      recommendations: ['ส่งเรื่องให้กลุ่มงานกำลังพล (UNIT-004) สำรวจรายชื่อกำลังพลจิตอาสาเข้าร่วม'],
      executiveBrief: 'เอกสารขออนุมัติโครงการมีความสมบูรณ์ตามระเบียบสารบรรณ (90/100)'
    },
    checklist: standard16ChecklistTemplate.map(c => ({
      key: c.key,
      label: c.label,
      status: 'found' as const,
      details: `ตรวจพบข้อมูล ${c.label} ครบถ้วน`,
      suggestion: 'ผ่านเกณฑ์'
    })),
    checkedAt: '2026-08-20 11:50',
    checkedBy: 'AI Document Inspector v2.4 (น.ส. กานดา รัตนมณี)',
    version: 1
  }
];
