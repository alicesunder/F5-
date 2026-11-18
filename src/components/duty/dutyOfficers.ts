import { useCollection } from '../../lib/collections';

/** เวรประจำวันของฝ่ายอำนวยการ 1 แถวต่อ 1 วัน (id = วันที่ YYYY-MM-DD) */
export interface DutyOfficerDay {
  id: string;
  /** ร้อยเวร (นายตำรวจเวร) ผู้ปฏิบัติจริง */
  officer: string;
  /** ร้อยเวรผู้เซ็นชื่อ (ถ้าต่างจากผู้ปฏิบัติจริง) */
  officerSigned?: string;
  officerPhone?: string;
  /** สิบเวร (นายสิบเวร) ผู้ปฏิบัติจริง */
  nco: string;
  /** สิบเวรผู้เซ็นชื่อ (ถ้าต่างจากผู้ปฏิบัติจริง) */
  ncoSigned?: string;
  ncoPhone?: string;
  note?: string;
}

export const DUTY_COLLECTION = 'admin.duty_officers';

export const useDutyOfficers = () => useCollection<DutyOfficerDay>(DUTY_COLLECTION);

const pad = (n: number) => String(n).padStart(2, '0');
export const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** วันที่เวรวันนี้ เวรเปลี่ยนตอน 08.30 น. ก่อนเวลานั้นยังนับเป็นเวรของเมื่อวาน */
export const dutyDateFor = (now = new Date()) => {
  const d = new Date(now);
  if (d.getHours() * 60 + d.getMinutes() < 8 * 60 + 30) d.setDate(d.getDate() - 1);
  return isoDate(d);
};

export const thaiDayLabel = (iso: string, opts: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'short', year: '2-digit' }) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('th-TH', opts);
