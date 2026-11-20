import React from 'react';
import { HIDDEN_MENUS } from '../../../lib/menuVisibility';
import { RelationsActiveTab } from '../types';
import { Megaphone, Plus, Upload, Globe, FileText, Image as ImageIcon, Radio, CalendarRange } from 'lucide-react';
import { DepartmentHeader, DeptAction, DeptTab } from '../../../components/layout/DepartmentShell';

export const RELATIONS_TABS: DeptTab[] = [
  { id: 'operations', label: 'ศูนย์ปฏิบัติการ PR', icon: Radio, desc: 'ติดตามข่าว ภารกิจภาพถ่าย และรายงาน LINE' },
  { id: 'year-plan', label: 'งานรอบปี', icon: CalendarRange, desc: 'แผนรอบปี D.A.R.E. สร้างจิตสำนึก และโฆษก' },
  { id: 'management', label: 'จัดการข่าว', icon: FileText, desc: 'เขียน แก้ไข และเผยแพร่ข่าว' },
  { id: 'media', label: 'คลังสื่อ', icon: ImageIcon, desc: 'เก็บภาพ วิดีโอ และไฟล์สื่อ' },
  { id: 'public', label: 'หน้าข่าวประชาชน', icon: Globe, desc: 'ดูข่าวที่เผยแพร่แล้วแบบที่ประชาชนเห็น' },
];

interface RelationsHeaderProps {
  activeTab: RelationsActiveTab;
  onSelectTab: (tab: RelationsActiveTab) => void;
  onOpenCreateNews: () => void;
  onOpenUploadMedia: () => void;
}

export const RelationsHeader: React.FC<RelationsHeaderProps> = ({ activeTab, onSelectTab, onOpenCreateNews, onOpenUploadMedia }) => (
  <DepartmentHeader
    dept="relations"
    icon={Megaphone}
    title="งานประชาสัมพันธ์"
    description="สื่อสารองค์กร ผลิตข่าวและสื่อดิจิทัล ติดตามการรับรู้ และเผยแพร่ภารกิจ ตชด. สู่ประชาชน"
    tabs={RELATIONS_TABS}
    hiddenTabs={HIDDEN_MENUS.relationsTabs}
    activeTab={activeTab}
    onSelectTab={id => onSelectTab(id as RelationsActiveTab)}
    actions={
      <>
        <DeptAction dept="relations" icon={Upload} label="อัปโหลดสื่อ" onClick={onOpenUploadMedia} />
        <DeptAction dept="relations" icon={Plus} label="สร้างข่าวใหม่" variant="primary" onClick={onOpenCreateNews} />
      </>
    }
  />
);
