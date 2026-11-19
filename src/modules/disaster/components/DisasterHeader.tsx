import React from 'react';
import {
  ShieldAlert,
  Radio,
  Plus,
  FileSpreadsheet,
  Layers,
  MapPin,
  Waves,
  ClipboardList,
  FileText,
  Sparkles,
  Navigation,
  CloudRain,
  MessageSquareText,
} from 'lucide-react';
import { DepartmentHeader, DeptAction, DeptTab } from '../../../components/layout/DepartmentShell';

export type DisasterActiveTab =
  | 'overview'
  | 'line-reports'
  | 'heavy-rain'
  | 'map'
  | 'flood'
  | 'stations'
  | 'bpp-tracker'
  | 'incidents'
  | 'reports'
  | 'smart-ops';

export const DISASTER_TABS: DeptTab[] = [
  { id: 'overview', label: 'ภาพรวม', icon: Layers, desc: 'สรุปสถานการณ์' },
  { id: 'incidents', label: 'จัดการเหตุการณ์', icon: ClipboardList, desc: 'บันทึกและติดตามเหตุที่เกิดขึ้น' },
  { id: 'line-reports', label: 'รายงานจาก LINE', icon: MessageSquareText, desc: 'ข้อความจากกลุ่ม LINE ของงาน' },
  { id: 'map', label: 'แผนที่สถานการณ์', icon: MapPin, desc: 'ดูจุดเกิดเหตุบนแผนที่' },
  { id: 'heavy-rain', label: 'ฝนตกหนัก & เรดาร์', icon: CloudRain, desc: 'พื้นที่เสี่ยงฝนตกหนัก' },
  { id: 'flood', label: 'เฝ้าระวังน้ำท่วม', icon: Waves, desc: 'ระดับน้ำและพื้นที่เสี่ยง' },
  { id: 'stations', label: 'สถานีน้ำ', icon: Navigation, desc: 'ข้อมูลสถานีวัดน้ำและลุ่มน้ำ' },
  { id: 'bpp-tracker', label: 'ติดตามรายงาน กก.ตชด.', icon: ShieldAlert, desc: 'เช็กว่าหน่วยใดส่งรายงานแล้ว' },
  { id: 'reports', label: 'รายงานและส่งออก', icon: FileText, desc: 'สรุปรายงานและดาวน์โหลด' },
  { id: 'smart-ops', label: 'ผู้ช่วย AI', icon: Sparkles, desc: 'ถาม สรุป และจัดการงานค้าง' },
];

interface DisasterHeaderProps {
  activeTab: DisasterActiveTab;
  onSelectTab: (tab: DisasterActiveTab) => void;
  onOpenNewIncidentModal: () => void;
  onOpenAlertModal: () => void;
  onOpenExportModal: () => void;
}

export const DisasterHeader: React.FC<DisasterHeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenNewIncidentModal,
  onOpenAlertModal,
  onOpenExportModal,
}) => (
  <DepartmentHeader
    dept="disaster"
    icon={ShieldAlert}
    title="งานพัฒนาและช่วยเหลือประชาชน"
    description="บรรเทาสาธารณภัย เฝ้าระวังน้ำท่วม ดินโคลนถล่ม และช่วยเหลือประชาชนในพื้นที่รับผิดชอบของ ตชด."
    tabs={DISASTER_TABS}
    activeTab={activeTab}
    onSelectTab={id => onSelectTab(id as DisasterActiveTab)}
    actions={
      <>
        <DeptAction dept="disaster" icon={Radio} label="แจ้งเตือนด่วน" variant="danger" onClick={onOpenAlertModal} />
        <DeptAction dept="disaster" icon={FileSpreadsheet} label="ส่งออก" onClick={onOpenExportModal} />
        <DeptAction dept="disaster" icon={Plus} label="รายงานเหตุใหม่" variant="primary" onClick={onOpenNewIncidentModal} />
      </>
    }
  />
);
