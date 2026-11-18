import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { Dashboard } from '../../pages/Dashboard';
import { BudgetPage } from '../../pages/BudgetPage';
import { TravelPage } from '../../pages/TravelPage';
import { IncomingDocsPage } from '../../pages/IncomingDocsPage';
import { OutgoingDocsPage } from '../../pages/OutgoingDocsPage';
import { UnitsPage } from '../../pages/UnitsPage';
import { ArchivalDocsPage } from '../../pages/ArchivalDocsPage';
import { LogsPage } from '../../pages/LogsPage';
import { SettingsPage } from '../../pages/SettingsPage';
import { AiDocumentInspectorPage } from '../../pages/AiDocumentInspectorPage';
import { MonthlyMeetingsPage } from '../../pages/MonthlyMeetingsPage';
import { PersonnelMissionsPage } from '../../pages/PersonnelMissionsPage';
import { OfficialDocumentsHub } from '../documents/OfficialDocumentsHub';
import {
  FolderKanban,
  LayoutDashboard,
  Inbox,
  Send,
  Archive,
  DollarSign,
  Compass,
  Calendar,
  Briefcase,
  Building2,
  Sparkles,
  FileText,
  Settings,
  Printer,
  ShieldCheck,
  Wand2,
  MessageSquareText,
  ArrowLeft,
  CheckCircle2,
  Activity,
} from 'lucide-react';
import { DEPARTMENT_COLORS } from '../../types';
import { SmartOpsWorkspace } from '../../components/smart/SmartOpsWorkspace';
import { LineReportsView } from '../../components/line/LineReportsView';
import { DutyRosterEditor } from '../../components/duty/DutyRosterEditor';
import { DepartmentHeader, DeptAction, DeptTab, QuickStartGrid } from '../../components/layout/DepartmentShell';

export const AdminModule: React.FC = () => {
  const { activeMenu, navigate, navigateModule, incomingDocs = [], outgoingDocs = [], missions = [] } = useAdmin();
  const themeColor = DEPARTMENT_COLORS.admin; // #5B2A86

  const subNavItems: DeptTab[] = [
    { id: 'dashboard', label: 'ภาพรวม', icon: LayoutDashboard, desc: 'สรุปงานของฝ่ายอำนวยการ' },
    { id: 'duty-officers', label: 'ตารางเวร', icon: ShieldCheck, desc: 'กรอกร้อยเวร/สิบเวรประจำเดือน' },
    { id: 'incoming', label: 'หนังสือรับ', icon: Inbox, badge: incomingDocs.length, desc: 'ลงรับและติดตามหนังสือเข้า' },
    { id: 'outgoing', label: 'หนังสือส่ง', icon: Send, badge: outgoingDocs.length, desc: 'ออกเลขและส่งหนังสือ' },
    { id: 'archive', label: 'คลังเอกสาร', icon: Archive, desc: 'ค้นหาเอกสารที่จัดเก็บแล้ว' },
    { id: 'dla-drafting', label: 'ร่างหนังสือด้วย AI', icon: Sparkles, desc: 'แบบฟอร์มและร่างหนังสือราชการ' },
    { id: 'budget', label: 'งบประมาณ', icon: DollarSign, desc: 'จัดสรรและติดตามการเบิกจ่าย' },
    { id: 'travel', label: 'ไปราชการ', icon: Compass, desc: 'บันทึกการเดินทางไปราชการ' },
    { id: 'meetings', label: 'การประชุม', icon: Calendar, desc: 'วาระ มติ และรายงานการประชุม' },
    { id: 'missions', label: 'ภารกิจกำลังพล', icon: Briefcase, badge: missions.length, desc: 'มอบหมายภารกิจและตรวจเวลาทับซ้อน' },
    { id: 'units', label: 'หน่วยงาน/กำลังพล', icon: Building2, desc: 'ทะเบียนหน่วยและรายชื่อกำลังพล' },
    { id: 'line-reports', label: 'รายงานจาก LINE', icon: MessageSquareText, desc: 'ข้อความจากกลุ่ม LINE ของฝ่าย' },
    { id: 'ai-inspection', label: 'AI ตรวจเอกสาร', icon: CheckCircle2, desc: 'ตรวจความถูกต้องของหนังสือ' },
    { id: 'smart-ops', label: 'ผู้ช่วย AI', icon: Wand2, desc: 'ถาม สรุป และจัดการงานค้าง' },
    { id: 'logs', label: 'บันทึกระบบ', icon: FileText, desc: 'ประวัติการใช้งาน' },
    { id: 'settings', label: 'ตั้งค่าฝ่าย', icon: Settings, desc: 'ตั้งค่าการทำงานของฝ่าย' },
  ];

  const renderSubPage = () => {
    switch (activeMenu) {
      case 'duty-officers':
        return <DutyRosterEditor />;
      case 'line-reports':
        return <LineReportsView dept="admin" />;
      case 'ai-inspection':
        return <AiDocumentInspectorPage />;
      case 'meetings':
        return <MonthlyMeetingsPage />;
      case 'missions':
        return <PersonnelMissionsPage />;
      case 'budget':
        return <BudgetPage />;
      case 'travel':
        return <TravelPage />;
      case 'incoming':
        return <IncomingDocsPage />;
      case 'outgoing':
        return <OutgoingDocsPage />;
      case 'units':
        return <UnitsPage />;
      case 'archive':
      case 'documents':
        return <ArchivalDocsPage />;
      case 'dla-drafting':
        return <OfficialDocumentsHub />;
      case 'analytics':
        return <Dashboard />;
      case 'logs':
        return <LogsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'smart-ops':
        return (
          <SmartOpsWorkspace
            department="admin"
            title="AI & Workflow Center"
            subtitle="ผู้ช่วยอัจฉริยะสำหรับสารบรรณ งานธุรการ งบประมาณ การประชุม ภารกิจ และการติดตามงานค้าง"
            accent={themeColor}
          />
        );
      default:
        return (
          <div className="space-y-6">
            <QuickStartGrid dept="admin" tabs={subNavItems.filter(t => t.id !== 'dashboard')} onSelect={navigate} />
            <Dashboard />
          </div>
        );
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const activeId = activeMenu === 'documents' ? 'archive' : activeMenu === 'analytics' ? 'dashboard' : activeMenu;

  return (
    <div className="flex flex-col min-h-screen pb-12">
      <DepartmentHeader
        dept="admin"
        icon={FolderKanban}
        title="งานอำนวยการ"
        description="สารบรรณ งบประมาณ การประชุม ภารกิจกำลังพล และตารางเวร"
        tabs={subNavItems}
        activeTab={subNavItems.some(t => t.id === activeId) ? activeId : 'dashboard'}
        onSelectTab={navigate}
        actions={
          <>
            <DeptAction dept="admin" icon={Inbox} label="ลงรับหนังสือ" onClick={() => navigate('incoming')} />
            <DeptAction dept="admin" icon={Sparkles} label="ร่างหนังสือด้วย AI" variant="primary" onClick={() => navigate('dla-drafting')} />
          </>
        }
      />

      <div className="flex-1 px-4 sm:px-6 lg:px-8 pt-4 max-w-7xl w-full mx-auto">
        {renderSubPage()}
      </div>
    </div>
  );
};
