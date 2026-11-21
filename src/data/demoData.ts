/**
 * ข้อมูลจำลองสำหรับ "โหมดข้อมูลจำลอง" (ตั้งค่าระบบ → เปิดโดยแอดมิน)
 * ทุกชื่อ/เลขที่/เหตุการณ์เป็นของสมมติ ใส่คำว่า "ตัวอย่าง" กำกับ เพื่อไม่ให้ปนกับข้อมูลจริง
 * ใช้เฉพาะในหน่วยความจำของหน้าเว็บ ไม่เขียนลงฐานข้อมูล
 */
import type { LineReport } from './lineReportsData';

const pad = (n: number) => String(n).padStart(2, '0');
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const day = (offset: number) => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d;
};
const TH_M = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const thai = (d: Date) => `${d.getDate()} ${TH_M[d.getMonth()]} ${d.getFullYear() + 543}`;
const stamp = () => new Date().toISOString();
const pick = <T,>(a: readonly T[], i: number) => a[i % a.length];

const UNITS = ['กก.ตชด.11', 'กก.ตชด.12', 'กก.ตชด.21', 'กก.ตชด.24', 'กก.ตชด.31', 'กก.ตชด.33', 'กก.ตชด.42', 'กก.ตชด.44', 'กก.1 บก.กฝ.', 'กก.2 บก.กฝ.', 'ศฝส.บก.กฝ.', 'บก.ตชด.ภาค 1', 'บก.ตชด.ภาค 3', 'บก.สอ.บช.ตชด.'];
const PROVINCES = ['เชียงราย', 'น่าน', 'ตาก', 'กาญจนบุรี', 'สระแก้ว', 'ยะลา', 'นราธิวาส', 'อุดรธานี', 'พังงา', 'ตราด'];

// ---------- หนังสือรับ ----------
const incoming = () => {
  const subjects = ['ส่งสำเนาคำสั่งปฏิบัติราชการ', 'ขอเชิญประชุมคณะกรรมการ', 'ส่งรายชื่อกิจกรรมบริจาคโลหิต', 'สรุปรายงานผลการปฏิบัติงานประจำเดือน', 'แนวทางการแต่งกายของข้าราชการในสังกัด', 'ขอความอนุเคราะห์ข้อมูลสำรวจ', 'กำหนดประชุมบริหาร ครั้งที่ 11/2569', 'รวบรวมรายชื่อผู้ปฏิบัติงานด้านจิตอาสา'];
  const froms = ['ฝอ.1', 'ฝอ.3', 'ฝอ.4', 'ฝอ.6', 'บก.กฝ.บช.ตชด.', 'ศอพ.', 'บช.ตชด.'];
  const acts = [['อก.'], ['จอส.'], ['พชช.'], ['อก.', 'พชช.'], ['จอส.', 'อก.']];
  return Array.from({ length: 28 }, (_, i) => {
    const rec = day(-Math.floor(i / 2));
    const sign = day(-Math.floor(i / 2) - (i % 3));
    return {
      id: `demo-in-${i}`,
      regNo: 800 - i,
      docNo: `0030.${100 + (i % 9) * 11}/${1000 + i * 7}`,
      signedDate: iso(sign),
      receivedDate: iso(rec),
      from: pick(froms, i),
      to: 'ฝอ.5',
      subject: `${pick(subjects, i)} (ตัวอย่าง)`,
      actions: pick(acts, i),
      receiver: 'ผู้ลงรับ ตัวอย่าง',
      note: pick(['ฝอ.1', 'รับส่ง', 'ด่วนที่สุด', '', 'ฝสสน.1'], i),
      createdAt: stamp(),
    };
  });
};

// ---------- เวร ----------
const duties = () =>
  Array.from({ length: 31 }, (_, i) => {
    const d = day(i - 15);
    return { id: iso(d), officer: `ร้อยเวร ตัวอย่าง ${pad((i % 9) + 1)}`, officerPhone: '08 0000 0000', nco: `สิบเวร ตัวอย่าง ${pad((i % 7) + 1)}`, ncoPhone: '08 1111 1111' };
  });

// ---------- งบ/ไปราชการ/หนังสือส่ง ----------
const budgets = () =>
  [['โครงการสร้างจิตสำนึก บช.ตชด.', 12260000, 6130000, 4200000], ['จัดซื้อวัสดุสำนักงาน', 480000, 300000, 210000], ['ค่าใช้จ่ายในการเดินทางไปราชการ', 650000, 410000, 380000], ['โครงการจิตอาสาพัฒนา', 900000, 520000, 300000], ['ซ่อมบำรุงยานพาหนะ', 1200000, 880000, 840000]].map(([name, alloc, commit, spent], i) => ({
    budget_id: `demo-bud-${i}`,
    fiscal_year: 2570,
    budget_category: i === 0 ? 'งบอุดหนุน' : 'งบดำเนินงาน',
    project_name: `${name} (ตัวอย่าง)`,
    budget_type: 'งบประมาณตามแผน',
    allocated_amount: alloc as number,
    committed_amount: commit as number,
    spent_amount: spent as number,
    remaining_amount: (alloc as number) - (spent as number),
    status: pick(['กำลังดำเนินการ', 'อยู่ระหว่างเบิกจ่าย', 'ผูกพันงบประมาณ'], i),
    responsible_unit: 'ฝอ.5 บก.อก.บช.ตชด.',
    created_at: stamp(),
    updated_at: stamp(),
  }));

const travel = () =>
  Array.from({ length: 5 }, (_, i) => ({
    travel_id: `demo-trv-${i}`,
    order_number: `ตัวอย่าง ${100 + i}/2569`,
    traveler_name: `ผู้เดินทาง ตัวอย่าง ${i + 1}`,
    position: 'เจ้าหน้าที่ ฝอ.5',
    destination: `กก.ตชด.${pick(['11', '24', '33', '42'], i)}`,
    province: pick(PROVINCES, i),
    purpose: 'ตรวจเยี่ยมและติดตามการดำเนินโครงการ (ตัวอย่าง)',
    departure_date: iso(day(i * 3 - 6)),
    return_date: iso(day(i * 3 - 4)),
    vehicle: 'รถยนต์ส่วนกลาง',
    status: pick(['อนุมัติแล้ว', 'รออนุมัติ', 'เสร็จสิ้น', 'กำลังดำเนินการ'], i),
    created_at: stamp(),
  }));

const outgoing = () =>
  Array.from({ length: 8 }, (_, i) => ({
    outgoing_id: `demo-out-${i}`,
    book_number: `ตัวอย่าง ${200 + i}/2569`,
    send_date: iso(day(-i)),
    recipient: pick(UNITS, i),
    subject: `${pick(['แจ้งแนวทางปฏิบัติ', 'ขอข้อมูลรายงาน', 'เชิญประชุม', 'ส่งผลการดำเนินงาน'], i)} (ตัวอย่าง)`,
    document_type: 'หนังสือภายนอก',
    responsible_person: 'ผู้รับผิดชอบ ตัวอย่าง',
    responsible_unit: 'ฝอ.5',
    status: pick(['ส่งแล้ว', 'รอลงนาม', 'ร่าง', 'ส่งแล้ว'], i),
    urgency: pick(['ปกติ', 'ด่วน', 'ปกติ'], i),
    created_at: stamp(),
  }));

// ---------- งานพัฒนาฯ ----------
const incidents = () =>
  Array.from({ length: 6 }, (_, i) => ({
    id: `demo-inc-${i}`,
    title: `${pick(['น้ำป่าไหลหลาก', 'น้ำท่วมขัง', 'ดินโคลนถล่ม', 'วาตภัย'], i)} ${pick(PROVINCES, i)} (ตัวอย่าง)`,
    type: pick(['น้ำป่าไหลหลาก/น้ำท่วมฉับพลัน', 'น้ำท่วมขัง/น้ำรอการระบาย', 'ตลิ่งทรุด/ดินโคลนถล่ม', 'วาตภัย/ลมกรรโชกแรง'], i),
    severity: pick(['วิกฤต', 'เฝ้าระวังสูง', 'เฝ้าระวัง'], i),
    status: pick(['กำลังดำเนินการ', 'ควบคุมสถานการณ์', 'รอตรวจสอบ', 'เสร็จสิ้น'], i),
    province: pick(PROVINCES, i),
    district: 'อำเภอตัวอย่าง',
    subdistrict: 'ตำบลตัวอย่าง',
    coordinates: { lat: 13 + (i % 5) * 1.6 + 2, lng: 99 + (i % 4) * 1.3 },
    reportedAt: day(-i).toISOString(),
    updatedAt: day(-i).toISOString(),
    affectedHouseholds: 40 + i * 35,
    affectedPeople: 150 + i * 120,
    casualties: { injured: 0, deceased: 0, missing: 0 },
    assignedUnit: pick(UNITS, i),
    officerInCharge: 'ผู้รับผิดชอบ ตัวอย่าง',
    officerPhone: '08 0000 0000',
    equipmentDeployed: ['เรือท้องแบน', 'รถบรรทุก 6 ล้อ'],
    description: 'ข้อมูลตัวอย่างเพื่อแสดงตัวอย่างหน้าจอ ไม่ใช่เหตุการณ์จริง',
    attachments: [],
    timeline: [],
  }));

// ---------- งานจิตอาสา ----------
const volMissions = () =>
  Array.from({ length: 6 }, (_, i) => ({
    id: `demo-vm-${i}`,
    code: `V-2570-${900 + i}`,
    title: `${pick(['จิตอาสาพัฒนาชุมชน', 'บริจาคโลหิต', 'ปลูกป่าหญ้าแฝก', 'ล้างทำความสะอาดวัด', 'ช่วยเหลือผู้ประสบภัย', 'ปรับปรุงภูมิทัศน์'], i)} (ตัวอย่าง)`,
    date: thai(day(i * 4 - 8)),
    rawDate: iso(day(i * 4 - 8)),
    startTime: '08:30',
    endTime: '16:30',
    location: 'สถานที่ตัวอย่าง',
    district: 'อำเภอตัวอย่าง',
    province: pick(PROVINCES, i),
    category: pick(['จิตอาสาพัฒนา', 'ภัยพิบัติและเฉพาะกิจ', 'จิตอาสาพัฒนา'], i),
    unitId: pick(UNITS, i),
    unitName: pick(UNITS, i),
    assignedPersonnelCount: 20 + i * 8,
    status: pick(['IN_PROGRESS', 'PLANNING', 'COMPLETED', 'PENDING_REPORT', 'PENDING_REVIEW', 'CLOSED'], i),
    uniform: 'เครื่องแบบจิตอาสาพระราชทาน',
    coordinatorName: 'ผู้ประสาน ตัวอย่าง',
    coordinatorRank: 'ร.ต.อ.',
    coordinatorPhone: '08 0000 0000',
    description: 'ภารกิจตัวอย่างเพื่อแสดงหน้าจอ',
    objectives: ['วัตถุประสงค์ตัวอย่าง'],
    workflowStep: (i % 7) + 1,
  }));

const volPersonnel = () =>
  Array.from({ length: 12 }, (_, i) => ({
    id: `demo-vp-${i}`,
    code: `จอ.ตชด. 904-${String(9000 + i)}`,
    rank: pick(['ด.ต.', 'ร.ต.ท.', 'ส.ต.อ.', 'ร.ต.อ.'], i),
    fullName: `บุคลากร ตัวอย่าง ${pad(i + 1)}`,
    affiliationUnit: pick(UNITS, i),
    unitId: pick(UNITS, i),
    phoneNumber: '08 0000 0000',
    volunteerType: pick(['จิตอาสา 904', 'จิตอาสาพระราชทาน'], i),
    skills: ['ปฐมพยาบาล'],
    accumulatedHours: 20 + i * 6,
    completedMissionsCount: 2 + i,
    status: pick(['พร้อมปฏิบัติ', 'อยู่ระหว่างภารกิจ', 'สำรอง'], i),
  }));

// ---------- dev.* / pr.* / vol.registry ----------
const devStatus = () => [
  { id: 'main', label: 'ตัวอย่าง', crews: 120, people: 640, updatedAt: stamp(), vehicles: [
    { group: 'รถยนต์', name: 'รถบรรทุก 6 ล้อ', count: 28, unit: 'คัน' }, { group: 'รถยนต์', name: 'รถพยาบาล', count: 9, unit: 'คัน' }, { group: 'รถยนต์', name: 'รถบรรทุกน้ำ', count: 12, unit: 'คัน' },
    { group: 'เรือ', name: 'เรือท้องแบน', count: 24, unit: 'ลำ' }, { group: 'เรือ', name: 'เรือยาง', count: 8, unit: 'ลำ' },
  ] },
];
const devAid = () => [
  { id: 'demo-aid-1', label: 'เหตุอุทกภัยตัวอย่าง', start: iso(day(-30)), end: iso(day(-2)), households: 1280, people: 5120, teams: 96, personnel: 480, missions: 'อพยพประชาชน\nแจกอาหารและน้ำดื่ม\nบรรจุกระสอบทราย', areas: 'จว.เชียงราย, จว.น่าน, จว.ตาก', vehicles: 'รถบรรทุก 6 ล้อ, เรือท้องแบน', damage: 'ข้อมูลตัวอย่าง', injured: 0, createdAt: stamp() },
];
const devAwards = () => [
  { id: 'demo-aw-1', year: 2569, rank: 'ชนะเลิศ', category: 'หน่วยงานต้นแบบ (ตัวอย่าง)', title: 'ผลงานตัวอย่าง', winner: 'หน่วยตัวอย่าง' },
  { id: 'demo-aw-2', year: 2569, rank: 'ชมเชย', category: 'ศูนย์การเรียนรู้ (ตัวอย่าง)', title: 'ผลงานตัวอย่าง', winner: 'หน่วยตัวอย่าง' },
];
const conscience = () => ['กก.ตชด.11', 'กก.ตชด.12', 'กก.ตชด.13', 'กก.ตชด.14', 'กก.ตชด.21', 'กก.ตชด.22', 'กก.ตชด.31', 'กก.ตชด.42'].map((id, i) => ({ id, term1: 14 - (i % 5) * 2, term2: i % 4 === 0 ? 6 : 0 }));
const volRegistry = () =>
  Array.from({ length: 10 }, (_, i) => ({ id: `demo-vr-${i}`, kind: i % 2 ? 'course904' : 'applicant', rank: pick(['ด.ต.', 'ส.ต.อ.', 'ร.ต.ท.'], i), name: `รายชื่อ ตัวอย่าง ${pad(i + 1)}`, unit: pick(UNITS, i), course: i % 2 ? `รุ่นตัวอย่าง ${i}` : '', date: iso(day(-i * 9)), note: '', createdAt: stamp() }));

/** ชื่อ collection -> ตัวสร้างข้อมูลจำลอง (collection ที่ไม่อยู่ในรายการนี้ใช้ข้อมูลจริงแบบอ่านอย่างเดียว) */
export const DEMO: Record<string, () => object[]> = {
  'admin.incoming_register': incoming,
  'admin.duty_officers': duties,
  'admin.budgets': budgets,
  'admin.travel': travel,
  'admin.outgoing_docs': outgoing,
  'disaster.incidents': incidents,
  'volunteer.missions': volMissions,
  'volunteer.personnel': volPersonnel,
  'dev.status': devStatus,
  'dev.aid': devAid,
  'dev.awards': devAwards,
  'pr.conscience_2570': conscience,
  'vol.registry': volRegistry,
};

// ---------- รายงานจาก LINE ----------
export function demoLineReports(): LineReport[] {
  const out: LineReport[] = [];
  const now = Date.now();
  const mk = (i: number, group: string, sender: string, unit: string | undefined, text: string, dept: LineReport['dept'], minsAgo: number, images = 0): LineReport => ({
    id: `demo-line-${i}`,
    receivedAt: new Date(now - minsAgo * 60_000).toISOString(),
    groupName: group,
    senderName: sender,
    unit,
    text,
    imageCount: images,
    messageType: images ? 'image' : 'text',
    dept,
    status: pick(['new', 'acknowledged', 'in_progress', 'done'] as const, i),
    mediaPaths: [],
  });
  const spokes = 'ทีมโฆษก ตชด. 2026 (ตัวอย่าง)';
  UNITS.slice(0, 9).forEach((u, i) => out.push(mk(i, spokes, `โฆษก ตัวอย่าง ${i + 1}`, u, `รายงานประจำวัน ${u} กิจกรรมตัวอย่าง: ออกให้บริการประชาชน ตรวจเยี่ยมโรงเรียน และประชาสัมพันธ์โครงการ (ข้อความตัวอย่าง)`, 'relations', 20 + i * 7, i % 3 === 0 ? 2 : 0)));
  out.push(mk(20, 'ขับเคลื่อนงานจิตอาสา (ตัวอย่าง)', 'จนท.จิตอาสา ตัวอย่าง', 'กก.ตชด.24', 'รายงานผลกิจกรรมจิตอาสาพัฒนา ปลูกหญ้าแฝก ณ พื้นที่ตัวอย่าง (ข้อความตัวอย่าง)', 'volunteer', 300, 1));
  out.push(mk(21, 'ศปก.ปภ.ตชด. (ตัวอย่าง)', 'จนท.บรรเทาภัย ตัวอย่าง', 'กก.ตชด.33', 'รายงานสถานการณ์น้ำท่วม ช่วยเหลือประชาชน 120 ครัวเรือน (ข้อความตัวอย่าง)', 'disaster', 180, 3));
  out.push(mk(22, 'ศปก.ปภ.ตชด. (ตัวอย่าง)', 'จนท.บรรเทาภัย ตัวอย่าง', 'กก.ตชด.12', 'โครงการ อพ.สธ. กิจกรรมสำรวจทรัพยากรพืชพรรณ (ข้อความตัวอย่าง)', 'disaster', 600, 0));
  out.push(mk(23, 'ฝอ.5 งานอำนวยการ (ตัวอย่าง)', 'จนท.อำนวยการ ตัวอย่าง', undefined, 'ส่งรายงานผลการปฏิบัติงานประจำเดือน (ข้อความตัวอย่าง)', 'admin', 90, 0));
  return out;
}
