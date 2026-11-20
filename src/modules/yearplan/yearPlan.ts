import { useMemo } from 'react';
import { useCollection } from '../../lib/collections';

/**
 * งานรอบปี (Year Plan) ของ ฝอ.5 — ถอดจากแผนการปฏิบัติงานรอบปีจริง
 * เดือนใช้ "ลำดับเดือนปีงบประมาณ": 1 = ต.ค. ... 12 = ก.ย.
 */
export type PlanDept = 'admin' | 'relations' | 'disaster' | 'volunteer';

export interface PlanItem {
  id: string;
  /** ปีงบประมาณ พ.ศ. เช่น 2570 */
  fy: number;
  dept: PlanDept;
  /** ลำดับตามเอกสาร เช่น "1", "30.4" */
  no?: string;
  /** หัวข้อกลุ่ม เช่น "นโยบายการบริหารราชการ ผบ.ตร." */
  group?: string;
  title: string;
  /** เดือนที่ทำ (1=ต.ค. ... 12=ก.ย.) */
  months: number[];
  /** true = ทำซ้ำทุกเดือนที่เลือก (แยกติ๊กรายเดือน); false = เดือนที่ติดกันนับเป็นงานเดียว ครบกำหนดสิ้นเดือนสุดท้าย */
  monthly?: boolean;
  /** วันที่ครบกำหนดในเดือน (เช่น 22) ถ้าไม่ระบุ = สิ้นเดือน */
  day?: number;
  /** กำหนดส่งแน่นอน YYYY-MM-DD (ค.ศ.) */
  due?: string;
  /** ทำทุกสัปดาห์ วันในสัปดาห์ 0=อาทิตย์ ... 2=อังคาร */
  weekday?: number;
  /** รายละเอียด/รายการย่อย (บรรทัดละข้อ) */
  detail?: string;
  /** หมายเหตุ เช่น "ตามที่ ตร.กำหนด" */
  note?: string;
  /** true = รายการย่อย (detail) ติ๊กทีละข้อ และงานครบเมื่อติ๊กครบทุกข้อ */
  checklist?: boolean;
  /** ช่วงข้อมูลที่ต้องรวบรวมของรอบรายงาน: week = พุธก่อนหน้า–วันครบกำหนด, d15 = 21 เดือนก่อน–20 เดือนนี้, prevmonth = ทั้งเดือนก่อน */
  window?: 'week' | 'd15' | 'prevmonth';
  order: number;
}

export interface PlanDone {
  /** `${itemId}@${due}` */
  id: string;
  item: string;
  due: string;
  by: string;
  at: string;
}

export interface Occurrence {
  key: string;
  item: PlanItem;
  /** YYYY-MM-DD */
  due: string;
  /** ช่วงเดือนที่งานนี้ครอบคลุม (ลำดับเดือนปีงบ) */
  months: number[];
}

export const PLAN_COLLECTION = 'plan.items';
export const DONE_COLLECTION = 'plan.done';

export const FY_MONTHS = ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'];
export const WEEKDAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

export const DEPT_LABEL: Record<PlanDept, string> = {
  admin: 'งานอำนวยการ',
  relations: 'งานมวลชนสัมพันธ์และประชาสัมพันธ์',
  disaster: 'งานพัฒนาและช่วยเหลือประชาชน',
  volunteer: 'งานจิตอาสาพระราชทาน',
};

export const usePlanItems = () => useCollection<PlanItem>(PLAN_COLLECTION, 'id');
export const usePlanDone = () => useCollection<PlanDone>(DONE_COLLECTION, 'id');

const pad = (n: number) => String(n).padStart(2, '0');
export const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseIso = (s: string) => new Date(`${s}T12:00:00`);

/** ปีงบประมาณ (พ.ศ.) ของวันที่ */
export const fyOf = (d: Date) => d.getFullYear() + 543 + (d.getMonth() >= 9 ? 1 : 0);

/** ลำดับเดือนปีงบ -> [ปี ค.ศ., เดือน 0-11] */
export function calMonth(fy: number, m: number): [number, number] {
  const month = (m + 8) % 12; // 1->9 (ต.ค.), 4->0 (ม.ค.)
  const year = fy - 543 - (m <= 3 ? 1 : 0);
  return [year, month];
}

export const fyMonthOf = (d: Date) => ((d.getMonth() + 3) % 12) + 1;

function dueInMonth(fy: number, m: number, day?: number) {
  const [y, mo] = calMonth(fy, m);
  const last = new Date(y, mo + 1, 0).getDate();
  return iso(new Date(y, mo, Math.min(day ?? last, last), 12));
}

/** กลุ่มเดือนที่ติดกัน เช่น [1,2,5,6,7] -> [[1,2],[5,6,7]] */
function runs(months: number[]) {
  const s = [...new Set(months)].filter(m => m >= 1 && m <= 12).sort((a, b) => a - b);
  const out: number[][] = [];
  for (const m of s) {
    const last = out[out.length - 1];
    if (last && last[last.length - 1] === m - 1) last.push(m);
    else out.push([m]);
  }
  return out;
}

/** แตกงานหนึ่งรายการเป็นงวดที่ต้องทำ/ติ๊ก ภายในปีงบของงานนั้น */
export function occurrences(item: PlanItem): Occurrence[] {
  const mk = (due: string, months: number[]): Occurrence => ({ key: `${item.id}@${due}`, item, due, months });
  if (item.weekday !== undefined && item.weekday !== null) {
    const out: Occurrence[] = [];
    const [y0, m0] = calMonth(item.fy, 1);
    const d = new Date(y0, m0, 1, 12);
    const end = new Date(item.fy - 543, 9, 0, 12); // 30 ก.ย.
    while (d.getDay() !== item.weekday) d.setDate(d.getDate() + 1);
    for (; d <= end; d.setDate(d.getDate() + 7)) out.push(mk(iso(d), [fyMonthOf(d)]));
    return out;
  }
  if (item.due) return [mk(item.due, item.months.length ? item.months : [fyMonthOf(parseIso(item.due))])];
  if (item.monthly || item.day) {
    return [...new Set(item.months)].sort((a, b) => a - b).map(m => mk(dueInMonth(item.fy, m, item.day), [m]));
  }
  return runs(item.months).map(r => mk(dueInMonth(item.fy, r[r.length - 1]), r));
}

export function describeSchedule(item: PlanItem) {
  if (item.weekday !== undefined && item.weekday !== null) return `ทุกวัน${WEEKDAYS[item.weekday]}`;
  if (item.due) {
    const d = parseIso(item.due);
    return `ภายใน ${d.getDate()} ${FY_MONTHS[fyMonthOf(d) - 1]}${String(d.getFullYear() + 543).slice(2)}`;
  }
  if (item.day) return item.months.length === 12 ? `ทุกวันที่ ${item.day} ของเดือน` : `วันที่ ${item.day} ของเดือนที่กำหนด`;
  if (item.monthly && item.months.length === 12) return 'ทุกเดือน';
  return runs(item.months)
    .map(r => (r.length === 1 ? FY_MONTHS[r[0] - 1] : `${FY_MONTHS[r[0] - 1]}–${FY_MONTHS[r[r.length - 1] - 1]}`))
    .join(', ');
}

/** ช่วงวันของข้อมูลในรอบรายงาน (YYYY-MM-DD เริ่ม/สิ้นสุด) */
export function reportWindow(kind: NonNullable<PlanItem['window']>, due: string): [string, string] {
  const d = parseIso(due);
  if (kind === 'week') {
    const s = new Date(d);
    s.setDate(s.getDate() - 6);
    return [iso(s), iso(d)];
  }
  if (kind === 'd15') return [iso(new Date(d.getFullYear(), d.getMonth() - 1, 21, 12)), iso(new Date(d.getFullYear(), d.getMonth(), 20, 12))];
  return [iso(new Date(d.getFullYear(), d.getMonth() - 1, 1, 12)), iso(new Date(d.getFullYear(), d.getMonth(), 0, 12))];
}

export const thaiDate = (s: string) => {
  const d = parseIso(s);
  return `${d.getDate()} ${FY_MONTHS[fyMonthOf(d) - 1]} ${String(d.getFullYear() + 543).slice(2)}`;
};

export const daysUntil = (s: string, today = new Date()) => {
  const a = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12).getTime();
  return Math.round((parseIso(s).getTime() - a) / 86_400_000);
};

/** งวดทั้งหมดของรายการชุดหนึ่ง พร้อมสถานะติ๊กแล้ว */
export function useOccurrences(items: PlanItem[]) {
  return useMemo(() => items.flatMap(occurrences).sort((a, b) => a.due.localeCompare(b.due) || a.item.order - b.item.order), [items]);
}

export const sortItems = (a: PlanItem, b: PlanItem) => a.order - b.order;

/** วันที่เริ่มใช้ระบบติดตาม: งวดที่ครบกำหนดก่อนวันนี้ไม่นับว่า "เลยกำหนด" (ไม่มีใครติ๊กได้ย้อนหลังตอนยังไม่มีระบบ) */
export const TRACK_FROM = '2026-11-20';
export const isTracked = (due: string) => due >= TRACK_FROM;

/** แท็บ id ของงานรอบปีในทุกฝ่าย */
export const YEAR_PLAN_TAB = 'year-plan';

// ให้การ์ดหน้าหลักสั่ง "เปิดฝ่ายนี้ที่แท็บงานรอบปี" ได้ (โมดูลฝ่ายอ่านค่าตอนเปิด)
let pendingTab: PlanDept | null = null;
export const requestYearPlanTab = (dept: PlanDept) => {
  pendingTab = dept;
};
export const consumeYearPlanTab = (dept: PlanDept) => {
  if (pendingTab !== dept) return false;
  pendingTab = null;
  return true;
};
