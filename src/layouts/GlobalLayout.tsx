import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useAdmin } from '../contexts/AdminContext';
import { GlobalHeader } from '../components/layout/GlobalHeader';
import { GlobalSidebar } from '../components/layout/GlobalSidebar';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { UserProfileModal } from '../components/layout/UserProfileModal';
import { SystemSettingsModal } from '../components/layout/SystemSettingsModal';
import { ToastContainer } from '../components/common/Toast';
import { NotificationPopover } from '../components/common/NotificationPopover';
import { pageVariants } from '../utils/motion';

const DEPT_GLOW = {
  admin: '#8B46C8',
  relations: '#38BDF8',
  disaster: '#F59E0B',
  volunteer: '#34D399',
} as const;

interface GlobalLayoutProps {
  children: React.ReactNode;
}

export const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  const { activeModule } = useAdmin();
  // สีของฝ่ายที่เปิดอยู่: ใช้กับเส้นเชื่อมจากเมนูข้างเข้าหน้าเนื้อหา แถบโหลดด้านบน และแสงพื้นหลัง
  const deptColor = DEPT_GLOW[activeModule as keyof typeof DEPT_GLOW];
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F6FB] dark:bg-[#0B0D13] iridescent-ambient flex font-sans text-slate-900 dark:text-[#F5F7FA] antialiased selection:bg-[#5B2A86] selection:text-white relative overflow-x-clip">
      {/* Dynamic Multi-Color Ambient Aurora Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* ทรงกลมแก้วแสงรุ้ง (liquid glass) อยู่หลังเนื้อหา */}
        <div className="lg-prism w-[460px] h-[460px] -top-24 right-[6%]" />
        <div className="lg-prism lg-prism-sm w-[340px] h-[340px] bottom-[6%] left-[22%]" style={{ animationDirection: 'reverse' }} />
        <div
          className="absolute -top-36 left-[12%] w-[540px] h-[540px] rounded-full opacity-35 dark:opacity-20 blur-[110px] transition-all duration-700"
          style={{
            background:
              'radial-gradient(circle, rgba(91,42,134,0.45) 0%, rgba(139,108,207,0.18) 55%, transparent 75%)',
          }}
        />
        {/* แสงสีประจำฝ่ายที่ไหลออกมาจากเมนูข้าง เปลี่ยนสีนุ่ม ๆ ตามฝ่ายที่เปิด */}
        <motion.div
          className="absolute top-[18%] -left-40 w-[640px] h-[640px] rounded-full blur-[120px]"
          initial={false}
          animate={{ opacity: deptColor ? 0.38 : 0, backgroundColor: deptColor ?? '#8B46C8' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
        <div
          className="absolute top-[15%] -right-24 w-[500px] h-[500px] rounded-full opacity-35 dark:opacity-20 blur-[110px] transition-all duration-700"
          style={{
            background:
              'radial-gradient(circle, rgba(37,131,216,0.42) 0%, rgba(56,189,248,0.16) 55%, transparent 75%)',
          }}
        />
        <div
          className="absolute bottom-[5%] left-[28%] w-[480px] h-[480px] rounded-full opacity-30 dark:opacity-15 blur-[120px] transition-all duration-700"
          style={{
            background:
              'radial-gradient(circle, rgba(232,155,34,0.35) 0%, rgba(66,167,122,0.22) 55%, transparent 75%)',
          }}
        />
      </div>

      {/* แถบโหลดด้านบนเมื่อเปลี่ยนหน้า */}
      <motion.div
        key={`bar-${activeModule}`}
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[3px] z-[70] origin-left pointer-events-none"
        style={{ background: deptColor ? `linear-gradient(90deg, transparent, ${deptColor}, #fff, ${deptColor})` : 'linear-gradient(90deg,#5B2A86,#2583D8,#E89B22,#42A77A)' }}
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{ scaleX: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.35, delay: 0.5 } }}
      />

      {/* เส้นเชื่อม: ต่อจากแถบฝ่ายในเมนูข้างเข้าสู่หน้าเนื้อหา */}
      <motion.div
        aria-hidden="true"
        className="hidden lg:block fixed inset-y-0 left-[260px] w-[3px] z-40 pointer-events-none origin-center"
        initial={false}
        animate={{ opacity: deptColor ? 1 : 0, scaleY: deptColor ? 1 : 0.3 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${deptColor ?? '#8B46C8'} 28%, ${deptColor ?? '#8B46C8'} 72%, transparent 100%)`,
          boxShadow: `0 0 22px 3px ${deptColor ?? '#8B46C8'}66`,
        }}
      />

      {/* Global Unified Sidebar (Left) */}
      <GlobalSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Right Column: Top Header + Breadcrumb + Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[260px] min-h-screen transition-all duration-200 relative z-10 iridescent-ambient">
        {/* Global Unified Header */}
        <GlobalHeader
          onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* Content Area with Breadcrumb */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-clip">
          {/* Global Breadcrumb */}
          <Breadcrumb />

          {/* Module Content with Smooth Page Transitions */}
          <main className="flex-1 w-full relative sac-page-stage iridescent-ambient">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeModule}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* System Modals */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <SystemSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {isNotificationsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
            <NotificationPopover onClose={() => setIsNotificationsModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Global Toast Container */}
      <ToastContainer />
    </div>
  );
};
