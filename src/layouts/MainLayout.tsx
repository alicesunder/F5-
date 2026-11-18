import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { ToastContainer } from '../components/common/Toast';
import { useAdmin } from '../contexts/AdminContext';
import { ChevronRight, Printer } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const menuTitles: Record<
  string,
  { code: string; title: string; enTitle: string; subtitle: string }
> = {
  dashboard: {
    code: 'OVERVIEW / 01',
    title: 'ภาพรวมผู้บริหาร',
    enTitle: 'Executive Intelligence Dashboard',
    subtitle: 'ศูนย์ประมวลผลข้อมูลและตัวชี้วัดสำคัญของฝ่ายอำนวยการแบบเรียลไทม์',
  },
  'ai-inspection': {
    code: 'INSPECTION / 02',
    title: 'ระบบ AI ตรวจสอบเอกสารราชการ',
    enTitle: 'AI Document Inspector',
    subtitle: 'ตรวจความถูกต้องตามระเบียบงานสารบรรณ คำผิด ฟอร์แมต ชั้นความลับ และความปลอดภัยของข้อมูล',
  },
  meetings: {
    code: 'MEETINGS / 03',
    title: 'ระบบบริหารการประชุมรายเดือน',
    enTitle: 'Monthly Meeting System',
    subtitle: 'ระเบียบวาระการประชุม ๕ วาระ การติดตามมติที่ประชุม และสรุปข้อสั่งการผู้บังคับบัญชา',
  },
  missions: {
    code: 'OPERATIONS / 04',
    title: 'ระบบบริหารภารกิจและกำลังพล',
    enTitle: 'Personnel Mission Management',
    subtitle: 'จัดสรรกำลังพล ตรวจสอบเวลาทับซ้อน (Conflict Detection) ควบคุมงบประมาณ และติดตามภารกิจ',
  },
  budget: {
    code: 'BUDGET / 05',
    title: 'ระบบบริหารงานงบประมาณ',
    enTitle: 'Budget Management & Utilization',
    subtitle: 'การจัดสรร ติดตาม และวิเคราะห์การใช้จ่ายงบประมาณจำแนกตามหมวดรายจ่ายและกลุ่มงาน',
  },
  travel: {
    code: 'TRAVEL / 06',
    title: 'ระบบบริหารงานไปราชการ',
    enTitle: 'Official Travel Records',
    subtitle: 'บันทึกคำสั่ง การอนุมัติการเดินทาง ค่ายานพาหนะ และการติดตามภารกิจราชการ',
  },
  incoming: {
    code: 'INCOMING / 07',
    title: 'ระบบสารบรรณ: หนังสือรับ',
    enTitle: 'Incoming Documents Registry',
    subtitle: 'ทะเบียนคุมหนังสือรับเข้า การกำหนดผู้รับผิดชอบ และการติดตามสถานะการปฏิบัติราชการ',
  },
  outgoing: {
    code: 'OUTGOING / 08',
    title: 'ระบบสารบรรณ: หนังสือส่ง',
    enTitle: 'Outgoing Documents Registry',
    subtitle: 'ทะเบียนคุมหนังสือส่งออก คำสั่ง ประกาศ และสถานะการลงนามส่งถึงหน่วยงานภายนอก',
  },
  units: {
    code: 'PERSONNEL / 09',
    title: 'ระบบข้อมูลหน่วยงานและทำเนียบกำลังพล',
    enTitle: 'Units & Personnel Directory',
    subtitle: 'โครงสร้างการจัดหน่วย อัตรากำลังพล ข้อมูลผู้บังคับบัญชา และช่องทางการติดต่อ',
  },
  documents: {
    code: 'ARCHIVE / 10',
    title: 'ระบบศูนย์คลังเอกสารกลางดิจิทัล',
    enTitle: 'Digital Archival Center',
    subtitle: 'จัดเก็บ ค้นหา และสืบค้นเอกสารราชการ ไฟล์แนบ คำสั่ง ประกาศ และรายงานย้อนหลัง',
  },
  analytics: {
    code: 'ANALYTICS / 11',
    title: 'ศูนย์วิเคราะห์ข้อมูลและรายงานสถิติ',
    enTitle: 'Reports & Analytics Intelligence',
    subtitle: 'สรุปผลสัมฤทธิ์ตัวชี้วัดสำคัญ การเปรียบเทียบข้อมูลย้อนหลัง และส่งออกรายงานราชการ',
  },
  logs: {
    code: 'AUDIT / 12',
    title: 'บันทึกประวัติกิจกรรมและตรวจสอบระบบ',
    enTitle: 'Activity & Telemetry Logs',
    subtitle: 'การบันทึกการกระทำของผู้ใช้งาน การเพิ่ม แก้ไข ลบ และการเปลี่ยนแปลงสถานะข้อมูล',
  },
  settings: {
    code: 'CONFIG / 13',
    title: 'ตั้งค่าระบบและกำหนดสิทธิ์',
    enTitle: 'System Configurations',
    subtitle: 'การจัดการข้อมูลผู้ใช้งาน สิทธิ์การเข้าถึง และการสำรองข้อมูลจำลอง',
  },
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { activeMenu, navigate } = useAdmin();

  const currentInfo = menuTitles[activeMenu] || {
    code: 'OPERATIONS',
    title: 'ระบบฝ่ายอำนวยการ',
    enTitle: 'Directorate Platform',
    subtitle: 'SMART ADMINISTRATION CENTER',
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#EEF2F4] text-[#111315] flex flex-col font-sans editorial-grid-bg">
      {/* Top Header */}
      <Header onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} />

      {/* Body Area */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar Command Rail */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(prev => !prev)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 flex flex-col overflow-x-hidden">
          {/* Editorial Page Header Bar */}
          <div className="px-4 sm:px-8 py-4 sm:py-5 border-b border-[rgba(17,19,21,0.08)] bg-white/40 backdrop-blur-[16px] flex flex-col sm:flex-row sm:items-end justify-between gap-4 no-print">
            <div>
              {/* Micro Metadata Tag & Breadcrumb */}
              <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[rgba(17,19,21,0.45)] mb-1">
                <button
                  type="button"
                  onClick={() => navigate('dashboard')}
                  className="hover:text-[#17324F] transition text-[rgba(17,19,21,0.6)]"
                >
                  SAC
                </button>
                <ChevronRight className="w-2.5 h-2.5 text-[rgba(17,19,21,0.25)]" />
                <span className="text-[#234A78] font-semibold">{currentInfo.code}</span>
              </div>

              {/* Editorial Title and Subtitle */}
              <h1 className="text-lg sm:text-2xl font-medium tracking-tight text-[#111315] leading-tight">
                {currentInfo.title}
              </h1>
              <p className="text-xs text-[rgba(17,19,21,0.58)] mt-1 hidden sm:block max-w-2xl font-normal">
                {currentInfo.subtitle}
              </p>
            </div>

            {/* Action Tools & Status Indicator */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden md:block text-right">
                <div className="text-[9px] font-mono tracking-widest text-[rgba(17,19,21,0.38)] uppercase">
                  LAST TELEMETRY
                </div>
                <div className="text-[11px] font-mono text-[rgba(17,19,21,0.7)] font-medium">
                  {new Date().toISOString().slice(0, 10)} / LIVE
                </div>
              </div>

              <div className="h-6 w-px bg-[rgba(17,19,21,0.1)] hidden md:block" />

              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-[rgba(17,19,21,0.1)] text-xs font-medium hover:border-[rgba(17,19,21,0.2)] text-[#111315] flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                title="พิมพ์หน้านี้ / บันทึกรายงาน PDF"
              >
                <Printer className="w-3.5 h-3.5 text-[rgba(17,19,21,0.55)] stroke-[1.5]" />
                <span>พิมพ์หน้านี้ / PDF</span>
              </button>
            </div>
          </div>

          {/* Dynamic Page Content with Entrance Transition */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto animate-in fade-in duration-300">
            {children}
          </div>

          {/* Minimal Editorial Footer */}
          <footer className="py-3 px-6 sm:px-8 border-t border-[rgba(17,19,21,0.07)] bg-white/30 backdrop-blur-[12px] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[rgba(17,19,21,0.45)] no-print gap-2">
            <div className="flex items-center gap-2 font-mono text-[10px]">
              <span className="font-semibold text-[rgba(17,19,21,0.7)]">SMART ADMINISTRATION CENTER</span>
              <span>—</span>
              <span>DIRECTORATE INTELLIGENCE PLATFORM</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <div className="flex items-center gap-1.5 text-[#42695B]">
                <span className="w-1.5 h-1.5 bg-[#557C67] rounded-full" />
                <span>SYSTEM OPERATIONAL</span>
              </div>
              <span>/</span>
              <span>SECURE ARCHIVE ENCRYPTED</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};
