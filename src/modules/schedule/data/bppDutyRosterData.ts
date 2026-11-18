import { DutyRosterItem, DutyOfficerSummary } from '../dutyTypes';

export const BPP_DUTY_HEADER_INFO = {
  documentRef: 'ผนวก ข',
  title: 'ตารางการปฏิบัติหน้าที่ (สิบเวร)',
  station: 'ปฏิบัติหน้าที่ประจำ สง.ฝอ.๕ บก.อก.บช.ตชด.',
  periodText: 'ตั้งแต่ ๑ - ๓๐ ก.ย.๒๕๖๙',
  monthYear: 'กันยายน 2569',
  shiftTime: 'ปฏิบัติหน้าที่แต่ ๐๘.๓๐ - ๐๘.๓๐ น. ของวันถัดไป',
  verifiedBy: 'พ.ต.ต.หญิง (อาภิชา อินทยา)',
  verifierPosition: 'สว.ฝอ.๕ บก.อก.บช.ตชด.',
  department: 'ฝ่ายอำนวยการ 5 กองบังคับการอำนวยการ กองบัญชาการตำรวจตระเวนชายแดน',
  hotline: '02-279-9999 ต่อ ฝอ.5 (วิทยุสื่อสาร: ข่ายสายธาร 1)',
};

export const INITIAL_DUTY_ROSTER: DutyRosterItem[] = [];

export const DUTY_OFFICERS_LIST: DutyOfficerSummary[] = [];
