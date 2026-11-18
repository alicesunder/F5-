export interface HeavyRainZone {
  id: string;
  province: string;
  region: 'เหนือ' | 'ตะวันออกเฉียงเหนือ' | 'กลาง' | 'ตะวันออก' | 'ใต้';
  rainfall24h: number; // mm in 24 hours
  rainfall1h: number; // mm/hour current rate
  severity: 'extreme' | 'heavy' | 'moderate'; // extreme >90mm (แดง), heavy 35-90mm (ส้ม), moderate 10-35mm (เหลือง)
  alertType: 'น้ำท่วมฉับพลัน & ดินโคลนถล่ม' | 'น้ำป่าไหลหลาก' | 'น้ำล้นตลิ่ง' | 'เฝ้าระวังมรสุม';
  affectedDistricts: string[];
  lat: number;
  lng: number;
  bppUnitId: string; // e.g. 'กก.ตชด.32'
  bppUnitName: string;
  bppCamp: string;
  officerInCharge: string;
  officerPhone: string;
  bppStatus: 'ส่งชุดช่วยเหลือแล้ว' | 'จัดกำลังพลพร้อมเผชิญเหตุ' | 'เฝ้าระวังและตรวจการณ์';
  waterLevelTrend: 'rising' | 'stable' | 'decreasing';
  lastUpdated: string;
}

export const HEAVY_RAIN_ZONES: HeavyRainZone[] = [];
