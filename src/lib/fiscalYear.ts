// ปีงบประมาณ (พ.ศ.): เริ่ม 1 ตุลาคม เช่น พ.ย. 2569 อยู่ในปีงบประมาณ 2570
export const fiscalYearBE = (d: Date = new Date()) => d.getFullYear() + 543 + (d.getMonth() >= 9 ? 1 : 0);

const THAI_DIGITS = '๐๑๒๓๔๕๖๗๘๙';
export const toThaiDigits = (v: number | string) => String(v).replace(/\d/g, d => THAI_DIGITS[Number(d)]);
