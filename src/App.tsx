import React from 'react';
import { AdminProvider, useAdmin } from './contexts/AdminContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { GoogleWorkspaceProvider } from './contexts/GoogleWorkspaceContext';
import { LandingPage } from './pages/LandingPage';
import { DashboardModule } from './modules/dashboard/DashboardModule';
import { SettingsModule } from './modules/settings/SettingsModule';
import { AdminModule } from './modules/admin/AdminModule';
import { RelationsModule } from './modules/relations/RelationsModule';
import { DisasterModule } from './modules/disaster/DisasterModule';
import { VolunteerModule } from './modules/volunteer/VolunteerModule';
import { WorkspaceModule } from './modules/workspace/WorkspaceModule';
import { OperationsMapModule } from './modules/maps/OperationsMapModule';
import { BppMissionSchedulePage } from './modules/schedule/BppMissionSchedulePage';
import { OfficialDocumentsHub } from './modules/documents/OfficialDocumentsHub';
import { MySpaceModule } from './modules/myspace/MySpaceModule';
import { LineReportsModule } from './modules/line/LineReportsModule';
import { AccessDeniedPage } from './components/common/AccessDeniedPage';
import { ToastContainer } from './components/common/Toast';
import { checkModuleAccess } from './data/departmentsData';
import { GlobalLayout } from './layouts/GlobalLayout';

const AppContent: React.FC = () => {
  const { activeModule, currentRole, isAuthenticated, authReady } = useAdmin();

  if (!authReady) {
    return (
      <div role="status" className="min-h-screen flex items-center justify-center text-sm text-slate-500">
        กำลังตรวจสอบการเข้าสู่ระบบ...
      </div>
    );
  }

  const renderModule = () => {
    if (activeModule === 'home' || activeModule === 'login' || !isAuthenticated) {
      return <LandingPage />;
    }

    const accessCheck = checkModuleAccess(currentRole, activeModule);
    if (!accessCheck.allowed) {
      return <AccessDeniedPage targetModule={activeModule} />;
    }

    switch (activeModule) {
      case 'my-space':
        return <MySpaceModule />;

      case 'admin':
        return <AdminModule />;

      case 'relations':
      case 'news':
        return <RelationsModule />;

      case 'disaster':
        return <DisasterModule />;

      case 'volunteer':
        return <VolunteerModule />;

      case 'workspace':
        return <WorkspaceModule />;

      case 'maps':
        return <OperationsMapModule />;

      case 'documents':
        return <OfficialDocumentsHub />;

      case 'calendar':
      case 'duty-roster':
        return (
          <BppMissionSchedulePage
            initialTab={activeModule === 'duty-roster' ? 'duty' : 'missions'}
          />
        );

      case 'task-center':
      case 'bpp-tracker':
        return (
          <DashboardModule
            viewMode="task-center"
            initialTaskSubTab={activeModule === 'bpp-tracker' ? 'bpp-units' : 'tasks'}
          />
        );

      case 'line-reports':
        return <LineReportsModule />;

      case 'settings':
        return <SettingsModule />;

      case 'dashboard':
      default:
        return <DashboardModule viewMode="overview" />;
    }
  };

  if (!isAuthenticated || activeModule === 'home' || activeModule === 'login') {
    return (
      <>
        <LandingPage />
        <ToastContainer />
      </>
    );
  }

  return (
    <GlobalLayout>
      {renderModule()}
    </GlobalLayout>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AdminProvider>
        <GoogleWorkspaceProvider>
          <AppContent />
        </GoogleWorkspaceProvider>
      </AdminProvider>
    </ThemeProvider>
  );
}
