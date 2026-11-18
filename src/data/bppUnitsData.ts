export type BppRegion = 'บก.ตชด.ภาค 1' | 'บก.ตชด.ภาค 2' | 'บก.ตชด.ภาค 3' | 'บก.ตชด.ภาค 4';

export type ReportDepartment = 'admin' | 'relations' | 'disaster' | 'volunteer';

export type SubmissionStatus = 'submitted' | 'late' | 'pending' | 'under_review';

export interface DepartmentReportItem {
  department: ReportDepartment;
  departmentName: string;
  reportTitle: string;
  deadline: string;
  submittedAt?: string;
  status: SubmissionStatus;
  documentNo?: string;
  fileAttachment?: string;
  remarks?: string;
}

export interface BppUnit {
  id: string; // e.g. 'กก.ตชด.11'
  unitNumber: number; // 11
  region: BppRegion;
  regionShort: 'ภาค 1' | 'ภาค 2' | 'ภาค 3' | 'ภาค 4';
  campName: string;
  provinceLocation: string; // HQ province
  responsibleProvinces: string[]; // provinces under jurisdiction
  
  // Responsible Officer info
  officerRank: string;
  officerName: string;
  officerPosition: string;
  officerPhone: string;
  radioCallSign: string;
  lineId: string;
  email: string;

  // Central FO.5 Coordinator
  centralCoordinatorName: string;
  centralCoordinatorPhone: string;

  // Department Reports
  reports: Record<ReportDepartment, DepartmentReportItem>;

  // Follow-up history
  followUpHistory: {
    id: string;
    timestamp: string;
    type: 'phone' | 'radio' | 'line' | 'official_letter';
    officer: string;
    message: string;
  }[];

  lastContactTimestamp: string;
}

// โครงสร้างหน่วยเท่านั้น (ไม่มีชื่อบุคคล/สถานะรายงานตัวอย่าง) ข้อมูลผู้ประสานงานและการส่งรายงานบันทึกในฐานข้อมูล
const UNIT_SKELETON: Pick<BppUnit, 'id' | 'unitNumber' | 'region' | 'regionShort' | 'provinceLocation' | 'responsibleProvinces'>[] = [
  {"id": "กก.ตชด.11", "unitNumber": 11, "region": "บก.ตชด.ภาค 1", "regionShort": "ภาค 1", "provinceLocation": "จันทบุรี", "responsibleProvinces": ["จันทบุรี", "ตราด"]},
  {"id": "กก.ตชด.12", "unitNumber": 12, "region": "บก.ตชด.ภาค 1", "regionShort": "ภาค 1", "provinceLocation": "สระแก้ว", "responsibleProvinces": ["สระแก้ว", "ปราจีนบุรี"]},
  {"id": "กก.ตชด.13", "unitNumber": 13, "region": "บก.ตชด.ภาค 1", "regionShort": "ภาค 1", "provinceLocation": "กาญจนบุรี", "responsibleProvinces": ["กาญจนบุรี", "ราชบุรี", "สุพรรณบุรี"]},
  {"id": "กก.ตชด.14", "unitNumber": 14, "region": "บก.ตชด.ภาค 1", "regionShort": "ภาค 1", "provinceLocation": "ประจวบคีรีขันธ์", "responsibleProvinces": ["ประจวบคีรีขันธ์", "เพชรบุรี"]},
  {"id": "กก.ตชด.21", "unitNumber": 21, "region": "บก.ตชด.ภาค 2", "regionShort": "ภาค 2", "provinceLocation": "สุรินทร์", "responsibleProvinces": ["สุรินทร์", "บุรีรัมย์"]},
  {"id": "กก.ตชด.22", "unitNumber": 22, "region": "บก.ตชด.ภาค 2", "regionShort": "ภาค 2", "provinceLocation": "อุบลราชธานี", "responsibleProvinces": ["อุบลราชธานี", "อำนาจเจริญ", "ยโสธร"]},
  {"id": "กก.ตชด.23", "unitNumber": 23, "region": "บก.ตชด.ภาค 2", "regionShort": "ภาค 2", "provinceLocation": "สกลนคร", "responsibleProvinces": ["สกลนคร", "นครพนม", "มุกดาหาร"]},
  {"id": "กก.ตชด.24", "unitNumber": 24, "region": "บก.ตชด.ภาค 2", "regionShort": "ภาค 2", "provinceLocation": "อุดรธานี", "responsibleProvinces": ["อุดรธานี", "หนองคาย", "บึงกาฬ", "เลย", "หนองบัวลำภู"]},
  {"id": "กก.ตชด.31", "unitNumber": 31, "region": "บก.ตชด.ภาค 3", "regionShort": "ภาค 3", "provinceLocation": "พิษณุโลก", "responsibleProvinces": ["พิษณุโลก", "อุตรดิตถ์", "เพชรบูรณ์"]},
  {"id": "กก.ตชด.32", "unitNumber": 32, "region": "บก.ตชด.ภาค 3", "regionShort": "ภาค 3", "provinceLocation": "พะเยา", "responsibleProvinces": ["พะเยา", "เชียงราย", "น่าน", "แพร่"]},
  {"id": "กก.ตชด.33", "unitNumber": 33, "region": "บก.ตชด.ภาค 3", "regionShort": "ภาค 3", "provinceLocation": "เชียงใหม่", "responsibleProvinces": ["เชียงใหม่", "ลำพูน", "แม่ฮ่องสอน", "ลำปาง"]},
  {"id": "กก.ตชด.34", "unitNumber": 34, "region": "บก.ตชด.ภาค 3", "regionShort": "ภาค 3", "provinceLocation": "ตาก", "responsibleProvinces": ["ตาก", "กำแพงเพชร", "สุโขทัย"]},
  {"id": "กก.ตชด.41", "unitNumber": 41, "region": "บก.ตชด.ภาค 4", "regionShort": "ภาค 4", "provinceLocation": "ชุมพร", "responsibleProvinces": ["ชุมพร", "ระนอง"]},
  {"id": "กก.ตชด.42", "unitNumber": 42, "region": "บก.ตชด.ภาค 4", "regionShort": "ภาค 4", "provinceLocation": "นครศรีธรรมราช", "responsibleProvinces": ["นครศรีธรรมราช", "สุราษฎร์ธานี", "กระบี่", "พังงา", "ภูเก็ต"]},
  {"id": "กก.ตชด.43", "unitNumber": 43, "region": "บก.ตชด.ภาค 4", "regionShort": "ภาค 4", "provinceLocation": "สงขลา", "responsibleProvinces": ["สงขลา", "สตูล", "พัทลุง", "ตรัง"]},
  {"id": "กก.ตชด.44", "unitNumber": 44, "region": "บก.ตชด.ภาค 4", "regionShort": "ภาค 4", "provinceLocation": "ยะลา", "responsibleProvinces": ["ยะลา", "ปัตตานี", "นราธิวาส"]},
];

const REPORT_DEPT_NAMES: Record<ReportDepartment, string> = {"admin": "ฝ่ายอำนวยการ", "relations": "ฝ่ายมวลชนสัมพันธ์", "disaster": "ฝ่ายสาธารณภัย", "volunteer": "ฝ่ายจิตอาสา"};

export const blankBppUnit = (u: (typeof UNIT_SKELETON)[number]): BppUnit => ({
  ...u,
  campName: '',
  officerRank: '',
  officerName: '',
  officerPosition: '',
  officerPhone: '',
  radioCallSign: '',
  lineId: '',
  email: '',
  centralCoordinatorName: '',
  centralCoordinatorPhone: '',
  reports: Object.fromEntries(
    (Object.keys(REPORT_DEPT_NAMES) as ReportDepartment[]).map(d => [
      d,
      { department: d, departmentName: REPORT_DEPT_NAMES[d], reportTitle: '', deadline: '', status: 'pending' as SubmissionStatus },
    ])
  ) as Record<ReportDepartment, DepartmentReportItem>,
  followUpHistory: [],
  lastContactTimestamp: '',
});

export const INITIAL_BPP_UNITS: BppUnit[] = UNIT_SKELETON.map(blankBppUnit);
