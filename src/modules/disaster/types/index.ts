export type IncidentType =
  | 'น้ำท่วมขัง/น้ำรอการระบาย'
  | 'น้ำป่าไหลหลาก/น้ำท่วมฉับพลัน'
  | 'ตลิ่งทรุด/ดินโคลนถล่ม'
  | 'วาตภัย/ลมกรรโชกแรง'
  | 'อัคคีภัย/หมอกควัน'
  | 'ภัยแล้ง/ขาดแคลนน้ำ';

export type IncidentSeverity =
  | 'วิกฤต'
  | 'เฝ้าระวังสูง'
  | 'เฝ้าระวัง'
  | 'ปกติ';

export type IncidentStatus =
  | 'รอตรวจสอบ'
  | 'กำลังดำเนินการ'
  | 'ควบคุมสถานการณ์'
  | 'เสร็จสิ้น';

export interface IncidentAttachment {
  id: string;
  name: string;
  url: string;
  size: string;
  type: 'image' | 'pdf' | 'doc';
  uploadedAt: string;
}

export interface IncidentTimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  actor: string;
  statusChange?: IncidentStatus;
}

export interface DisasterIncident {
  id: string;
  title: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  province: string;
  district: string;
  subdistrict: string;
  village?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  reportedAt: string;
  updatedAt: string;
  affectedHouseholds: number;
  affectedPeople: number;
  casualties: {
    injured: number;
    deceased: number;
    missing: number;
  };
  waterLevelCm?: number;
  rainfallMm?: number;
  assignedUnit: string;
  officerInCharge: string;
  officerPhone: string;
  equipmentDeployed: string[];
  description: string;
  shelterLocation?: string;
  shelterCapacity?: number;
  shelterOccupants?: number;
  attachments: IncidentAttachment[];
  timeline: IncidentTimelineEvent[];
}

export type MapLayerType =
  | 'floods'
  | 'watchpoints'
  | 'incidents'
  | 'shelters'
  | 'routes'
  | 'risk_zones'
  | 'stations';

export interface MapPoint {
  id: string;
  name: string;
  category: MapLayerType;
  lat: number;
  lng: number;
  province: string;
  district: string;
  severity: IncidentSeverity;
  statusText: string;
  details: string;
  incidentId?: string;
}

export interface HydrologicalStation {
  id: string;
  code: string;
  name: string;
  basin: string;
  province: string;
  riverName: string;
  currentWaterLevel: number; // meters MSL
  bankfullLevel: number; // meters MSL
  warningLevel: number; // meters MSL
  flowRate: number; // m3/s
  capacityPercent: number;
  trend: 'rising' | 'steady' | 'falling';
  updatedAt: string;
  status: 'normal' | 'warning' | 'critical';
}

export interface RainfallTelemetry {
  station: string;
  province: string;
  basin: string;
  rain1h: number;
  rain24h: number;
  rainAccumulated7d: number;
  forecast12h: string;
  riskLevel: IncidentSeverity;
}

export interface DisasterStats {
  totalIncidents: number;
  inProgressIncidents: number;
  watchAreasCount: number;
  affectedHouseholdsTotal: number;
  affectedPeopleTotal: number;
  latestReportTime: string;
  latestIncidentTitle: string;
  criticalCount: number;
  controlledCount: number;
  resolvedCount: number;
}
