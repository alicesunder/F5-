import { useCollection } from '../../lib/collections';

/** หนึ่งแถวในทะเบียนหนังสือรับ (คอลัมน์ตรงกับไฟล์ ทะเบียนหนังสือรับ.xlsx) */
export interface IncomingRecord {
  id: string;
  /** เลขทะเบียนรับ */
  regNo: number;
  /** ที่ (เลขที่หนังสือ) เช่น 0030.112/1988 */
  docNo: string;
  /** ลงวันที่ (ลงนาม) YYYY-MM-DD */
  signedDate: string;
  /** ลงวันที่ (รับหนังสือ) YYYY-MM-DD */
  receivedDate: string;
  from: string;
  to: string;
  subject: string;
  /** การปฏิบัติ: งานที่ส่งต่อ เช่น อก., จอส., พชช. (ได้หลายงาน) */
  actions: string[];
  /** ผู้ลงรับ */
  receiver: string;
  /** หมายเหตุ เช่น ฝอ.1, รับส่ง, ด่วนที่สุด/ฝอ.1 */
  note: string;
  createdAt: string;
}

export const INCOMING_COLLECTION = 'admin.incoming_register';
export const useIncomingRegister = () => useCollection<IncomingRecord>(INCOMING_COLLECTION, 'id');

/** รหัสงานที่พบในทะเบียนจริง -> ฝ่ายในเว็บ */
export const ACTION_DEPT: Record<string, 'admin' | 'relations' | 'disaster' | 'volunteer'> = {
  'อก.': 'admin',
  'จอส.': 'volunteer',
  'พชช.': 'disaster',
  'มชส.': 'relations',
};
export const DEFAULT_ACTIONS = ['อก.', 'จอส.', 'พชช.', 'มชส.'];

/** หาฝ่ายจากรหัสการปฏิบัติ (รหัสที่ไม่รู้จัก แต่มีคำว่า ปชส/มวลชน/ประชาสัมพันธ์ ถือเป็นงานประชาสัมพันธ์) */
export function deptOfAction(code: string) {
  const c = code.trim();
  if (ACTION_DEPT[c]) return ACTION_DEPT[c];
  if (/ปชส|มชส|มวลชน|ประชาสัมพันธ์/.test(c)) return 'relations';
  return undefined;
}

/** แยกข้อความ "อก.,พชช." เป็นรายการ */
export const splitActions = (s: string) =>
  s
    .split(/[,，/、\s]+/)
    .map(x => x.trim())
    .filter(Boolean);

export const newId = () => `in-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const TH_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
export const thaiShort = (iso: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso || '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${TH_MONTHS[m - 1]} ${String(y + 543).slice(2)}`;
};

/** วันที่ดูผิดปกติ (เช่นพิมพ์ปีผิด) */
export const suspiciousDate = (iso: string) => {
  if (!iso) return false;
  const y = Number(iso.slice(0, 4));
  const now = new Date().getFullYear();
  return !(y >= now - 5 && y <= now + 1);
};

export const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Excel serial -> YYYY-MM-DD (ระบบวันที่ 1900 ของ Excel) */
export function excelSerialToIso(n: number) {
  const ms = Math.round((n - 25569) * 86400 * 1000);
  const d = new Date(ms);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

const HEADERS = ['เลขทะเบียนรับ', 'ที่', 'ลงวันที่(ลงนาม)', 'ลงวันที่(รับหนังสือ)', 'จาก', 'ถึง', 'เรื่อง', 'การปฏิบัติ', 'ผู้ลงรับ', 'หมายเหตุ'];
const WIDTHS = [14.88, 17.88, 17, 17.63, 12.63, 11.5, 50.75, 11.38, 21.5, 18.5];

const toDate = (iso: string) => (/^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10))) : iso || null);

/** ส่งออกเป็น .xlsx รูปแบบเดียวกับทะเบียนเดิม */
export async function exportRegister(rows: IncomingRecord[], filename = 'ทะเบียนหนังสือรับ.xlsx') {
  const ExcelJS = (await import('exceljs')).default;
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('ทะเบียนหนังสือรับ');
  ws.columns = WIDTHS.map(width => ({ width }));
  ws.mergeCells('A1:I1');
  ws.getCell('A1').value = 'ทะเบียนหนังสือรับ';
  ws.getCell('A1').font = { bold: true, size: 16 };
  ws.getCell('A1').alignment = { horizontal: 'center' };
  const head = ws.getRow(3);
  head.values = HEADERS;
  head.font = { bold: true };
  head.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  [...rows]
    .sort((a, b) => a.regNo - b.regNo)
    .forEach((r, i) => {
      const row = ws.getRow(4 + i);
      row.values = [r.regNo, r.docNo, toDate(r.signedDate), toDate(r.receivedDate), r.from, r.to, r.subject, r.actions.join(','), r.receiver, r.note];
      row.getCell(3).numFmt = 'd/m/yyyy';
      row.getCell(4).numFmt = 'd/m/yyyy';
    });
  for (let r = 3; r < 4 + rows.length; r++)
    for (let c = 1; c <= HEADERS.length; c++)
      ws.getRow(r).getCell(c).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  const buf = await wb.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

const cellText = (v: unknown): string => {
  if (v === null || v === undefined) return '';
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === 'object') {
    const o = v as { text?: string; richText?: { text: string }[]; result?: unknown };
    if (o.richText) return o.richText.map(x => x.text).join('');
    if (o.text) return String(o.text);
    if (o.result !== undefined) return cellText(o.result);
  }
  return String(v).trim();
};
/** Excel อ่านปี พ.ศ. 2 หลัก (เช่น 69) เป็น ค.ศ. 1969 → บวก 57 ให้เป็น 2026 (หนังสือราชการก่อนปี 2000 ไม่มีในระบบนี้) */
const fixTwoDigitBuddhistYear = (iso: string) => {
  const m = iso.match(/^(\d{4})-(\d{2}-\d{2})$/);
  if (!m) return iso;
  const y = Number(m[1]);
  return y >= 1930 && y <= 1999 ? `${y + 57}-${m[2]}` : iso;
};
const cellDate = (v: unknown): string => {
  if (v instanceof Date) return fixTwoDigitBuddhistYear(v.toISOString().slice(0, 10));
  if (typeof v === 'number') return fixTwoDigitBuddhistYear(excelSerialToIso(v));
  const s = cellText(v);
  const two = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
  if (two) return `${2500 + Number(two[3]) - 543}-${two[2].padStart(2, '0')}-${two[1].padStart(2, '0')}`;
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    let y = Number(m[3]);
    if (y > 2400) y -= 543;
    return `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  }
  return s;
};

/** อ่านไฟล์ทะเบียน .xlsx (หาแถวหัวตารางที่มีคำว่า "เลขทะเบียนรับ") — คืนเฉพาะแถวที่มีเรื่อง */
export async function importRegister(file: File, receiverFallback = ''): Promise<IncomingRecord[]> {
  const ExcelJS = (await import('exceljs')).default;
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(await file.arrayBuffer());
  const ws = wb.worksheets[0];
  let headRow = 0;
  const col: Record<string, number> = {};
  ws.eachRow((row, n) => {
    if (headRow) return;
    row.eachCell((c, i) => {
      const t = cellText(c.value).replace(/\s/g, '');
      if (t === 'เลขทะเบียนรับ') headRow = n;
      if (t) col[t] = i;
    });
    if (!headRow) for (const k of Object.keys(col)) delete col[k];
  });
  if (!headRow) throw new Error('ไม่พบหัวตาราง "เลขทะเบียนรับ" ในไฟล์');
  const get = (row: { getCell: (i: number) => { value: unknown } }, key: string) => (col[key] ? row.getCell(col[key]).value : undefined);
  const out: IncomingRecord[] = [];
  const stamp = new Date().toISOString();
  ws.eachRow((row, n) => {
    if (n <= headRow) return;
    const subject = cellText(get(row, 'เรื่อง'));
    if (!subject) return;
    out.push({
      id: newId(),
      regNo: Number(cellText(get(row, 'เลขทะเบียนรับ'))) || 0,
      docNo: cellText(get(row, 'ที่')),
      signedDate: cellDate(get(row, 'ลงวันที่(ลงนาม)')),
      receivedDate: cellDate(get(row, 'ลงวันที่(รับหนังสือ)')),
      from: cellText(get(row, 'จาก')),
      to: cellText(get(row, 'ถึง')),
      subject,
      actions: splitActions(cellText(get(row, 'การปฏิบัติ'))),
      receiver: cellText(get(row, 'ผู้ลงรับ')) || receiverFallback,
      note: cellText(get(row, 'หมายเหตุ')),
      createdAt: stamp,
    });
  });
  return out;
}
