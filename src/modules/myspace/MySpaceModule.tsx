import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ChevronRight,
  Home,
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { PersonalDutyStatus } from '../../types';
import { CHAIROT_POLICE_RECORD } from '../../data/personalData';

// Subcomponents
import { PersonalHero } from './components/PersonalHero';
import { PersonalQuickAccess } from './components/PersonalQuickAccess';
import { FinancialOverview } from './components/FinancialOverview';
import { PersonalDepartmentStatus } from './components/PersonalDepartmentStatus';
import { TodayScheduleSection } from './components/TodayScheduleSection';
import { PersonalWorkloadSection } from './components/PersonalWorkloadSection';
import { SalaryAndPayslipSection } from './components/SalaryAndPayslipSection';
import { AllowanceSection } from './components/AllowanceSection';
import { IncomeExpenseSection } from './components/IncomeExpenseSection';
import { GpfSection } from './components/GpfSection';
import { PersonalHistoryTimeline } from './components/PersonalHistoryTimeline';
import { PersonalDocumentsSection } from './components/PersonalDocumentsSection';
import { TrainingHistorySection } from './components/TrainingHistorySection';
import { PersonalSmartAssistant } from './components/PersonalSmartAssistant';
import { SecurityAuditSection } from './components/SecurityAuditSection';
import { PolisDocumentModal } from './components/PolisDocumentModal';
import { PayslipPrintModal } from './components/PayslipPrintModal';

export const MySpaceModule: React.FC = () => {
  const { navigateModule } = useAdmin();

  // State: Privacy mode (hides sensitive numbers ••••••••)
  const [hideFinancials, setHideFinancials] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('chairot_hide_financials') === 'true';
    }
    return false;
  });

  // State: Personal Duty Status
  const [currentStatus, setCurrentStatus] = useState<PersonalDutyStatus>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chairot_duty_status');
      if (saved) return saved as PersonalDutyStatus;
    }
    return CHAIROT_POLICE_RECORD.dutyStatus;
  });

  // State: Active Tab / Section
  const [activeSection, setActiveSection] = useState<string>('overview');

  // State: Modals
  const [polisModalOpen, setPolisModalOpen] = useState(false);
  const [payslipModalOpen, setPayslipModalOpen] = useState(false);
  const [selectedPayslipMonth, setSelectedPayslipMonth] = useState('2569-08');

  const toggleHideFinancials = () => {
    setHideFinancials(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('chairot_hide_financials', String(next));
      }
      return next;
    });
  };

  const handleStatusChange = (status: PersonalDutyStatus) => {
    setCurrentStatus(status);
    if (typeof window !== 'undefined') {
      localStorage.setItem('chairot_duty_status', status);
    }
  };

  const handleOpenPayslip = (month: string) => {
    setSelectedPayslipMonth(month);
    setPayslipModalOpen(true);
  };

  return (
    <div className="min-h-screen iridescent-ambient text-[var(--foreground)] pb-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <button
            type="button"
            onClick={() => navigateModule('dashboard')}
            className="hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>หน้าหลัก</span>
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">ฉัน (MY SPACE)</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-bold text-[#2583D8] dark:text-blue-400">Personal Command Center</span>
        </div>

        {/* 04. PERSONAL HERO: Centerpiece with Liquid Glass, Department Accent & Profile */}
        <PersonalHero
          currentStatus={currentStatus}
          onChangeStatus={handleStatusChange}
          hideFinancials={hideFinancials}
          onToggleHideFinancials={toggleHideFinancials}
          onNavigateSection={setActiveSection}
          activeSection={activeSection}
        />

        {/* 10. PERSONAL QUICK ACCESS: Horizontal Quick Action Row (Main Navigation of the page) */}
        <PersonalQuickAccess
          activeSection={activeSection}
          onSelectSection={setActiveSection}
        />

        {/* Department Status Bar (Section 05) */}
        <PersonalDepartmentStatus onNavigateModule={navigateModule} />

        {/* Active Section Content Renderer */}
        <div className="space-y-6">
          {/* 1. OVERVIEW: Combines Top Priority Modules */}
          {activeSection === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* 13 & 14. FINANCIAL OVERVIEW: Prominent Personal Finance Card */}
              <FinancialOverview
                hideFinancials={hideFinancials}
                onToggleHideFinancials={toggleHideFinancials}
                onNavigateSection={setActiveSection}
                onOpenPayslipModal={handleOpenPayslip}
              />

              {/* 11 & 12. 2-Column: Today's Schedule + Personal Workload */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TodayScheduleSection />
                <PersonalWorkloadSection />
              </div>

              {/* Salary & Payslip Highlight */}
              <SalaryAndPayslipSection
                hideFinancials={hideFinancials}
                onToggleHideFinancials={toggleHideFinancials}
                onOpenPayslipModal={handleOpenPayslip}
              />

              {/* 15. 2-Column: Allowance Pipeline + Income/Expense */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AllowanceSection hideFinancials={hideFinancials} />
                <IncomeExpenseSection hideFinancials={hideFinancials} />
              </div>

              {/* 16 & 20. GPF and Personal AI Assistant */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GpfSection hideFinancials={hideFinancials} />
                <PersonalSmartAssistant />
              </div>

              {/* 18. Documents Hub */}
              <PersonalDocumentsSection
                onOpenPolisModal={() => setPolisModalOpen(true)}
                onOpenPayslipModal={handleOpenPayslip}
              />

              {/* 17. Career History */}
              <PersonalHistoryTimeline />

              {/* 19. Training & Development */}
              <TrainingHistorySection />
            </motion.div>
          )}

          {/* 2. TODAY FOR ME */}
          {activeSection === 'today' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TodayScheduleSection />
            </motion.div>
          )}

          {/* 3. PERSONAL WORKLOAD */}
          {activeSection === 'workload' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <PersonalWorkloadSection />
            </motion.div>
          )}

          {/* 4. SALARY & PAYSLIP */}
          {activeSection === 'salary' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SalaryAndPayslipSection
                hideFinancials={hideFinancials}
                onToggleHideFinancials={toggleHideFinancials}
                onOpenPayslipModal={handleOpenPayslip}
              />
            </motion.div>
          )}

          {/* 5. ALLOWANCE TRACKER */}
          {activeSection === 'allowance' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AllowanceSection hideFinancials={hideFinancials} />
            </motion.div>
          )}

          {/* 6. INCOME & EXPENSE */}
          {activeSection === 'finance' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <IncomeExpenseSection hideFinancials={hideFinancials} />
            </motion.div>
          )}

          {/* 7. GPF CENTER */}
          {activeSection === 'gpf' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <GpfSection hideFinancials={hideFinancials} />
            </motion.div>
          )}

          {/* 8. CAREER HISTORY */}
          {activeSection === 'history' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <PersonalHistoryTimeline />
            </motion.div>
          )}

          {/* 9. DOCUMENTS HUB */}
          {activeSection === 'documents' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <PersonalDocumentsSection
                onOpenPolisModal={() => setPolisModalOpen(true)}
                onOpenPayslipModal={handleOpenPayslip}
              />
            </motion.div>
          )}

          {/* 10. TRAINING & PERFORMANCE */}
          {activeSection === 'training' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TrainingHistorySection />
            </motion.div>
          )}

          {/* 11. SMART ASSISTANT */}
          {activeSection === 'assistant' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <PersonalSmartAssistant />
            </motion.div>
          )}

          {/* 12. SECURITY & AUDIT */}
          {activeSection === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SecurityAuditSection />
            </motion.div>
          )}
        </div>
      </div>

      {/* Official POLIS Document Viewer Modal */}
      <PolisDocumentModal
        isOpen={polisModalOpen}
        onClose={() => setPolisModalOpen(false)}
      />

      {/* Official Payslip Printable Modal */}
      <PayslipPrintModal
        isOpen={payslipModalOpen}
        onClose={() => setPayslipModalOpen(false)}
        monthId={selectedPayslipMonth}
      />
    </div>
  );
};
export default MySpaceModule;
