/** วาดอินโฟกราฟิก PNG (1080×1350) สำหรับโพสต์/ส่งในไลน์ — ธีมมืด-ส้มเหมือนรายงานเดิมของ ตชด. */

export interface StatusData {
  label: string;
  crews: number;
  people: number;
  vehicles: { group: string; name: string; count: number; unit: string }[];
}

export interface AidData {
  label: string;
  households: number;
  people: number;
  teams: number;
  personnel: number;
  missions: string;
  areas: string;
  vehicles: string;
  damage: string;
  injured: number | null;
}

const W = 1080;
const H = 1350;
const GOLD = '#F5A623';
const BG = '#2A2D30';
const PANEL = '#202326';
const FONT = `'Mitr','Sarabun','Noto Sans Thai','Tahoma',sans-serif`;
const n = (v: number) => v.toLocaleString('en-US');

function base(title: string, sub: string) {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;
  g.fillStyle = BG;
  g.fillRect(0, 0, W, H);
  g.fillStyle = '#3A3E42';
  g.fillRect(0, 0, W, 150);
  g.fillStyle = '#fff';
  g.font = `700 54px ${FONT}`;
  g.textBaseline = 'middle';
  g.fillText('ตชด.', 48, 62);
  g.font = `400 24px ${FONT}`;
  g.fillText('กองบัญชาการตำรวจตระเวนชายแดน', 48, 112);
  g.fillStyle = GOLD;
  g.font = `700 44px ${FONT}`;
  g.textAlign = 'right';
  g.fillText(sub, W - 48, 75);
  g.textAlign = 'left';
  g.fillStyle = PANEL;
  g.fillRect(0, 150, W, 90);
  g.fillStyle = '#fff';
  g.font = `600 40px ${FONT}`;
  g.textAlign = 'center';
  g.fillText(title, W / 2, 196);
  g.textAlign = 'left';
  // footer
  g.fillStyle = '#3A3E42';
  g.fillRect(0, H - 90, W, 90);
  g.fillStyle = '#fff';
  g.font = `400 26px ${FONT}`;
  g.fillText('"ทุ่มเท เสียสละ กล้าหาญ อดทน ดำรงตนอย่างมีเกียรติ"', 48, H - 45);
  g.fillStyle = GOLD;
  g.beginPath();
  g.moveTo(W - 220, H);
  g.lineTo(W - 120, H - 90);
  g.lineTo(W, H - 90);
  g.lineTo(W, H);
  g.fill();
  return { c, g };
}

function panel(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  g.fillStyle = PANEL;
  g.beginPath();
  g.roundRect(x, y, w, h, 26);
  g.fill();
}

function statBox(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, value: string, unit: string, size = 76) {
  g.strokeStyle = GOLD;
  g.lineWidth = 4;
  g.beginPath();
  g.roundRect(x, y, w, h, 22);
  g.stroke();
  g.textBaseline = 'middle';
  g.font = `700 ${size}px ${FONT}`;
  const vw = g.measureText(value).width;
  g.font = `500 32px ${FONT}`;
  const uw = g.measureText(unit).width;
  const sx = x + (w - vw - uw - 14) / 2;
  g.fillStyle = GOLD;
  g.font = `700 ${size}px ${FONT}`;
  g.fillText(value, sx, y + h / 2 + 4);
  g.fillStyle = '#fff';
  g.font = `500 32px ${FONT}`;
  g.fillText(unit, sx + vw + 14, y + h / 2 + 18);
}

function heading(g: CanvasRenderingContext2D, text: string, cx: number, y: number, size = 40) {
  g.fillStyle = '#fff';
  g.font = `600 ${size}px ${FONT}`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(text, cx, y);
  const w = g.measureText(text).width;
  g.fillRect(cx - w / 2, y + size / 2 + 2, w, 3);
  g.textAlign = 'left';
}

/** ตัดบรรทัดตามความกว้าง (ภาษาไทยใช้ Intl.Segmenter) */
function wrap(g: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const seg = new Intl.Segmenter('th', { granularity: 'word' });
  const out: string[] = [];
  for (const para of text.split('\n')) {
    let line = '';
    for (const { segment } of seg.segment(para)) {
      if (g.measureText(line + segment).width > maxW && line) {
        out.push(line.trimEnd());
        line = segment.trimStart();
      } else line += segment;
    }
    out.push(line.trimEnd());
  }
  return out;
}

function lines(g: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, size: number, color = '#F5A623', maxLines = 99, lh = 1.45) {
  g.font = `400 ${size}px ${FONT}`;
  g.fillStyle = color;
  g.textBaseline = 'top';
  const ls = wrap(g, text, maxW).slice(0, maxLines);
  ls.forEach((l, i) => g.fillText(l, x, y + i * size * lh));
  return y + ls.length * size * lh;
}

async function ready() {
  try {
    await document.fonts?.ready;
  } catch {
    /* ใช้ฟอนต์สำรอง */
  }
}

export async function drawStatusInfographic(d: StatusData): Promise<Blob> {
  await ready();
  const { c, g } = base('สถานภาพกำลังพล ยานพาหนะ', d.label);
  panel(g, 36, 260, W - 72, 240);
  heading(g, 'สถานภาพกำลังพลชุดเผชิญเหตุสาธารณภัย', W / 2, 305, 36);
  statBox(g, 80, 355, 410, 120, n(d.crews), 'ชุด');
  statBox(g, 590, 355, 410, 120, n(d.people), 'คน');
  panel(g, 36, 520, W - 72, 700);
  heading(g, 'สถานภาพยานพาหนะ', W / 2, 565, 38);
  const groups = [...new Set(d.vehicles.map(v => v.group))];
  const colW = (W - 72 - 60) / Math.max(1, Math.min(2, groups.length));
  groups.slice(0, 2).forEach((gr, gi) => {
    const x = 80 + gi * (colW + 20);
    g.fillStyle = '#fff';
    g.font = `600 36px ${FONT}`;
    g.textBaseline = 'top';
    g.fillText(gr, x, 625);
    d.vehicles.filter(v => v.group === gr).slice(0, 9).forEach((v, i) => {
      const y = 690 + i * 56;
      g.font = `400 31px ${FONT}`;
      g.fillStyle = '#fff';
      g.fillText(`• ${v.name}`, x, y);
      g.textAlign = 'right';
      g.fillText(`${n(v.count)} ${v.unit}`, x + colW - 10, y);
      g.textAlign = 'left';
    });
  });
  return toBlob(c);
}

export async function drawAidInfographic(d: AidData): Promise<Blob> {
  await ready();
  const { c, g } = base('รายงานผลการปฏิบัติการช่วยเหลือประชาชน', d.label);
  panel(g, 36, 260, W - 72, 215);
  heading(g, 'ยอดช่วยเหลือสะสม', W / 2, 295, 38);
  statBox(g, 60, 335, 460, 115, n(d.households), 'ครัวเรือน', 72);
  statBox(g, 560, 335, 460, 115, n(d.people), 'คน', 72);
  panel(g, 36, 495, W - 72, 190);
  heading(g, 'ยอดกำลังพลที่ปฏิบัติหน้าที่สะสม', W / 2, 530, 36);
  g.font = `700 84px ${FONT}`;
  const a = n(d.teams);
  const b = n(d.personnel);
  g.font = `700 84px ${FONT}`;
  const wa = g.measureText(a).width;
  const wb = g.measureText(b).width;
  g.font = `500 34px ${FONT}`;
  const wu = g.measureText('ชุด').width + g.measureText('นาย').width;
  const total = wa + wb + wu + 90;
  let x = (W - total) / 2;
  g.textBaseline = 'middle';
  g.fillStyle = GOLD;
  g.font = `700 84px ${FONT}`;
  g.fillText(a, x, 625);
  x += wa + 12;
  g.fillStyle = '#fff';
  g.font = `500 34px ${FONT}`;
  g.fillText('ชุด', x, 642);
  x += g.measureText('ชุด').width + 50;
  g.fillStyle = GOLD;
  g.font = `700 84px ${FONT}`;
  g.fillText(b, x, 625);
  x += wb + 12;
  g.fillStyle = '#fff';
  g.font = `500 34px ${FONT}`;
  g.fillText('นาย', x, 642);

  panel(g, 36, 720, 520, 340);
  heading(g, 'ภารกิจ', 296, 752, 34);
  lines(g, d.missions || '-', 60, 790, 470, 21, GOLD, 10, 1.35);
  panel(g, 576, 720, 468, 220);
  heading(g, 'พื้นที่ที่ได้รับการช่วยเหลือ', 810, 750, 28);
  lines(g, d.areas || '-', 596, 785, 430, 19, '#fff', 6, 1.3);
  panel(g, 576, 955, 468, 105);
  heading(g, 'ยานพาหนะ', 810, 978, 26);
  lines(g, d.vehicles || '-', 596, 1005, 430, 20, '#fff', 2, 1.25);

  panel(g, 36, 1070, W - 72, 175);
  heading(g, 'ความเสียหายของหน่วย', W / 2, 1100, 32);
  const y2 = lines(g, d.damage || '-', 64, 1135, W - 130, 24, GOLD, 2);
  g.fillStyle = '#fff';
  g.font = `600 26px ${FONT}`;
  g.fillText(`กำลังพลบาดเจ็บ ${d.injured === null ? '-' : n(d.injured)} นาย`, 64, Math.min(y2 + 4, 1205));
  return toBlob(c);
}

function toBlob(c: HTMLCanvasElement) {
  return new Promise<Blob>((res, rej) => c.toBlob(b => (b ? res(b) : rej(new Error('สร้างภาพไม่สำเร็จ'))), 'image/png'));
}

export function downloadBlob(b: Blob, name: string) {
  const url = URL.createObjectURL(b);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
