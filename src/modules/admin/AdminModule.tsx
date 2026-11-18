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

export const AdminModule: React.FC = () => {
  const { activeMenu, navigate, navigateModule, incomingDocs = [], outgoingDocs = [], missions = [] } = useAdmin();
  const themeColor = DEPARTMENT_COLORS.admin; // #5B2A86

  const subNavItems = [
    { id: 'dashboard', label: 'ภาพรวมระบบ', icon: LayoutDashboard },
    { id: 'line-reports', label: 'รายงานจาก LINE', icon: MessageSquareText },
    { id: 'incoming', label: 'หนังสือรับ', icon: Inbox, badge: incomingDocs.length },
    { id: 'outgoing', label: 'หนังสือส่ง', icon: Send, badge: outgoingDocs.length },
    { id: 'archive', label: 'คลังเอกสาร', icon: Archive },
    { id: 'dla-drafting', label: 'แบบฟอร์ม สถ. & ร่างด้วย AI', icon: Sparkles },
    { id: 'budget', label: 'งบประมาณ', icon: DollarSign },
    { id: 'travel', label: 'ไปราชการ', icon: Compass },
    { id: 'meetings', label: 'การประชุม', icon: Calendar },
    { id: 'missions', label: 'ภารกิจกำลังพล', icon: Briefcase, badge: missions.length },
    { id: 'units', label: 'หน่วยงาน/กำลังพล', icon: Building2 },
    { id: 'ai-inspection', label: 'AI ตรวจสอบ', icon: Sparkles },
    { id: 'logs', label: 'บันทึกระบบ', icon: FileText },
    { id: 'settings', label: 'ตั้งค่าฝ่าย', icon: Settings },
    { id: 'smart-ops', label: 'AI & Workflow', icon: Wand2 },
  ];

  const renderSubPage = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard />;
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
        return <Dashboard />;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col min-h-screen iridescent-ambient pb-12">
      {/* Studio Hero Header Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-4">
        <div
          className="relative rounded-3xl overflow-hidden text-white shadow-xl border border-white/15"
          style={{
            background: 'linear-gradient(135deg, #1E1035 0%, #4C1D95 45%, #6D28D9 78%, #8B5CF6 100%)',
          }}
        >
          {/* 4-Color Spectrum Top Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#8B46C8] via-[#2583D8] via-[#E89B22] to-[#42A77A]" />

          {/* Ambient Decorative Glows & Architectural Grid */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-fuchsia-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-indigo-400/20 blur-3xl pointer-events-none" />
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 p-5 sm:p-7 space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              {/* Left: Back Button + Studio Title */}
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigateModule('dashboard')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition cursor-pointer backdrop-blur-md"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>กลับศูนย์บัญชาการหลัก</span>
                  </button>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-400/20 border border-purple-300/30 text-[11px] font-mono font-bold text-purple-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ADMINISTRATION STUDIO • /admin
                  </span>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-lg shrink-0">
                    <FolderKanban className="w-6 h-6 sm:w-7 sm:h-7 text-purple-200" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
                      สายงานอำนวยการและสารบรรณกลาง
                    </h1>
                    <p className="text-xs sm:text-sm text-purple-100/85 mt-0.5">
                      บริหารจัดการงานสารบรรณอิเล็กทรอนิกส์ งบประมาณ การประชุม ภารกิจกำลังพล และระบบตรวจสอบเอกสาร AI
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Live Mini KPI Glass Tiles + Print Action */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div
                  onClick={() => navigate('incoming')}
                  className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md cursor-pointer transition min-w-[105px]"
                >
                  <div className="text-[10px] font-semibold text-purple-200 uppercase">หนังสือรับ-ส่ง</div>
                  <div className="text-lg font-black font-mono tabular-nums text-white mt-0.5">
                    {incomingDocs.length + outgoingDocs.length} <span className="text-[11px] font-normal text-purple-200">เรื่อง</span>
                  </div>
                </div>

                <div
                  onClick={() => navigate('missions')}
                  className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md cursor-pointer transition min-w-[105px]"
                >
                  <div className="text-[10px] font-semibold text-purple-200 uppercase">ภารกิจกำลังพล</div>
                  <div className="text-lg font-black font-mono tabular-nums text-emerald-300 mt-0.5">
                    {missions.length} <span className="text-[11px] font-normal text-purple-200">รายการ</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('dla-drafting')}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>ร่างหนังสือด้วย AI</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer backdrop-blur-md"
                >
                  <Printer className="w-4 h-4 text-purple-200" />
                  <span className="hidden sm:inline">พิมพ์ / PDF</span>
                </button>
              </div>
            </div>

            {/* Interactive Glass Sub-Navigation Dock */}
            <div className="pt-3 border-t border-white/15 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {subNavItems.map(item => {
                const IconComponent = item.icon;
                const isActive =
                  activeMenu === item.id ||
                  (item.id === 'archive' && activeMenu === 'documents') ||
                  (item.id === 'dashboard' && activeMenu === 'analytics');

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-[#5B2A86] shadow-md scale-[1.02]'
                        : 'text-purple-100 hover:text-white hover:bg-white/10 bg-transparent'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#5B2A86]' : 'text-purple-200'}`} />
                    <span>{item.label}</span>
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span
                        className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono font-black ${
                          isActive ? 'bg-[#5B2A86]/15 text-[#5B2A86]' : 'bg-white/15 text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Subpage Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
        <div className="liquid-glass-card iridescent-edge rounded-3xl p-4 sm:p-6">
          {renderSubPage()}
        </div>
      </div>
    </div>
  );
};
