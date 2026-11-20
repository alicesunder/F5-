import React from 'react';
import { HeartHandshake, Search, Plus, Calendar, FileCheck, Layers, MessageSquareText, CalendarRange } from 'lucide-react';
import { useVolunteer, VolunteerTab } from '../context/VolunteerContext';
import { DepartmentHeader, DeptAction, DeptTab } from '../../../components/layout/DepartmentShell';

export const useVolunteerTabs = (): DeptTab[] => {
  const { stats } = useVolunteer();
  return [
    { id: 'overview', label: 'ภาพรวม', icon: Layers, desc: 'สรุปงานจิตอาสา' },
    { id: 'missions', label: 'ภารกิจ', icon: Calendar, badge: stats.pendingReportMissions, desc: 'วางแผนและมอบหมายภารกิจจิตอาสา' },
    { id: 'reports', label: 'รายงานผล (จอ.01)', icon: FileCheck, badge: stats.pendingReviewReports, desc: 'ส่งและตรวจรับรองรายงานผล' },
    { id: 'year-plan', label: 'งานรอบปี & วงรอบรายงาน', icon: CalendarRange, desc: 'กำหนดส่งรายงานและกิจกรรมสำคัญ' },
    { id: 'personnel', label: 'หน่วยและกำลังพล', icon: HeartHandshake, desc: 'เครือข่ายหน่วยและรายชื่อกำลังพล' },
    { id: 'line-reports', label: 'รายงานจาก LINE', icon: MessageSquareText, desc: 'ข้อความจากกลุ่ม LINE ของงาน' },
  ];
};

export const VolunteerHeader: React.FC = () => {
  const { activeTab, setActiveTab, searchQuery, setSearchQuery, setIsAddMissionModalOpen } = useVolunteer();
  const tabs = useVolunteerTabs();

  return (
    <>
      <DepartmentHeader
        dept="volunteer"
        icon={HeartHandshake}
        title="งานจิตอาสา"
        description="จิตอาสาพระราชทาน 904 และโครงการอันเนื่องมาจากพระราชดำริ: วางแผน มอบหมาย ติดตาม และตรวจรับรองรายงาน (จอ.01)"
        tabs={tabs}
        activeTab={activeTab}
        onSelectTab={id => setActiveTab(id as VolunteerTab)}
        actions={
          <>
            <label className="relative">
              <span className="sr-only">ค้นหาภารกิจหรือหน่วย</span>
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                placeholder="ค้นหาภารกิจ, หน่วย"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-48 pl-9 pr-3 py-2.5 text-[13px] rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </label>
            <DeptAction dept="volunteer" icon={Plus} label="สร้างภารกิจใหม่" variant="primary" onClick={() => setIsAddMissionModalOpen(true)} />
          </>
        }
      />
    </>
  );
};
