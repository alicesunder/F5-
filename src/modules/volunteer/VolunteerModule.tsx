import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VolunteerProvider, useVolunteer, VolunteerTab } from './context/VolunteerContext';
import { VolunteerHeader, useVolunteerTabs } from './components/VolunteerHeader';
import { QuickStartGrid } from '../../components/layout/DepartmentShell';
import { VolunteerAttentionBanner } from './components/VolunteerAttentionBanner';
import { VolunteerHeroStats } from './components/VolunteerHeroStats';
import { VolunteerSignatureFlow } from './components/VolunteerSignatureFlow';
import { LineReportsView } from '../../components/line/LineReportsView';
import { VolunteerMissionsSection } from './components/missions/VolunteerMissionsSection';
import { VolunteerMissionDetailDrawer } from './components/missions/VolunteerMissionDetailDrawer';
import { VolunteerAddMissionModal } from './components/missions/VolunteerAddMissionModal';
import { VolunteerReportsSection } from './components/reports/VolunteerReportsSection';
import { VolunteerReportReviewModal } from './components/reports/VolunteerReportReviewModal';
import { VolunteerSubmitReportModal } from './components/reports/VolunteerSubmitReportModal';
import { VolunteerPersonnelSection } from './components/personnel/VolunteerPersonnelSection';

const VolunteerModuleContent: React.FC = () => {
  const { activeTab, setActiveTab } = useVolunteer();
  const tabs = useVolunteerTabs();

  return (
    <div className="min-h-screen iridescent-ambient text-[#25202B] dark:text-[#F5F7FA] font-sans antialiased pb-14">
      {/* Top Studio Hero Header */}
      <VolunteerHeader />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
        {/* Global Attention Banner (Urgent reviews & warnings) */}
        <VolunteerAttentionBanner />

        {/* Tab View Routing (4 Core Views) */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <QuickStartGrid dept="volunteer" tabs={tabs.filter(t => t.id !== 'overview')} onSelect={id => setActiveTab(id as VolunteerTab)} />
              <VolunteerHeroStats />

              <div className="liquid-glass-card iridescent-edge rounded-3xl p-4 sm:p-6">
                <VolunteerSignatureFlow />
              </div>

              <div className="liquid-glass-card iridescent-edge rounded-3xl p-4 sm:p-6">
                <VolunteerMissionsSection />
              </div>
            </motion.div>
          )}

          {activeTab === 'missions' && (
            <motion.div
              key="missions"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="liquid-glass-card iridescent-edge rounded-3xl p-4 sm:p-6"
            >
              <VolunteerMissionsSection />
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="liquid-glass-card iridescent-edge rounded-3xl p-4 sm:p-6"
            >
              <VolunteerReportsSection />
            </motion.div>
          )}

          {activeTab === 'line-reports' && (
            <motion.div
              key="line-reports"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="liquid-glass-card iridescent-edge rounded-3xl p-4 sm:p-6"
            >
              <LineReportsView dept="volunteer" />
            </motion.div>
          )}

          {(activeTab === 'personnel' || activeTab === 'units') && (
            <motion.div
              key="personnel"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="liquid-glass-card iridescent-edge rounded-3xl p-4 sm:p-6"
            >
              <VolunteerPersonnelSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Drawers & Modals */}
      <VolunteerMissionDetailDrawer />
      <VolunteerAddMissionModal />
      <VolunteerReportReviewModal />
      <VolunteerSubmitReportModal />
    </div>
  );
};

export const VolunteerModule: React.FC = () => {
  return (
    <VolunteerProvider>
      <VolunteerModuleContent />
    </VolunteerProvider>
  );
};

export default VolunteerModule;
