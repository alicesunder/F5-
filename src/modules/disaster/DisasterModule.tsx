import React, { useState, useEffect } from 'react';
import { SmartOpsWorkspace } from '../../components/smart/SmartOpsWorkspace';
import { LineReportsView } from '../../components/line/LineReportsView';
import { IncomingRegisterPage } from '../incoming/IncomingRegisterPage';
import { AidSummaryView } from './components/AidSummaryView';
import { RoyalProjectsView } from './components/RoyalProjectsView';
import { YearPlanView } from '../yearplan/YearPlanView';
import { consumeYearPlanTab } from '../yearplan/yearPlan';
import { useAdmin } from '../../contexts/AdminContext';
import {
  DisasterActiveTab,
  DisasterHeader,
} from './components/DisasterHeader';
import { DisasterSummaryCards } from './components/DisasterSummaryCards';
import { InteractiveDisasterMap } from './components/InteractiveDisasterMap';
import { FloodMonitoringDashboard } from './components/FloodMonitoringDashboard';
import { IncidentManagement } from './components/IncidentManagement';
import { DisasterReports } from './components/DisasterReports';
import { IncidentFormModal } from './components/IncidentFormModal';
import { IncidentDetailModal } from './components/IncidentDetailModal';
import { EmergencyAlertModal } from './components/EmergencyAlertModal';
import { ExportModal } from './components/ExportModal';
import { StationExplorer } from './components/StationExplorer';
import { DailyBulletin } from './components/DailyBulletin';
import { HeavyRainRadarMap } from './components/HeavyRainRadarMap';
import { BppReportTracker } from '../../components/bpp/BppReportTracker';

import { disasterService } from './services/disasterService';
import {
  DisasterIncident,
  IncidentStatus,
  MapPoint,
  HydrologicalStation,
  RainfallTelemetry,
  DisasterStats,
} from './types';
import {
  ShieldAlert,
  ArrowRight,
  MapPin,
  Waves,
  CloudRain,
} from 'lucide-react';

export const DisasterModule: React.FC = () => {
  const { showToast } = useAdmin();
  const primaryColor = '#E89B22';

  // Navigation Tabs state
  const [activeTab, setActiveTab] = useState<DisasterActiveTab>(() => (consumeYearPlanTab('disaster') ? 'year-plan' : 'overview'));
  const [focusStationId, setFocusStationId] = useState<string | null>(null);

  const handleSelectStationById = (id: string) => {
    setFocusStationId(id);
    setActiveTab('stations');
  };

  // Core Service Data State
  const [incidents, setIncidents] = useState<DisasterIncident[]>([]);
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [stations, setStations] = useState<HydrologicalStation[]>([]);
  const [rainfallData, setRainfallData] = useState<RainfallTelemetry[]>([]);
  const [stats, setStats] = useState<DisasterStats>(disasterService.getStats());

  // Modal Dialog States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<DisasterIncident | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<DisasterIncident | null>(null);

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Sync state from service
  const refreshData = () => {
    setIncidents(disasterService.getIncidents());
    setMapPoints(disasterService.getMapPoints());
    setStations(disasterService.getHydrologicalStations());
    setRainfallData(disasterService.getRainfallData());
    setStats(disasterService.getStats());
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = disasterService.subscribe(() => {
      refreshData();
    });
    return unsubscribe;
  }, []);

  // Handlers
  const handleOpenNewIncident = () => {
    setEditingIncident(null);
    setIsFormModalOpen(true);
  };

  const handleEditIncident = (incident: DisasterIncident) => {
    setEditingIncident(incident);
    setIsDetailModalOpen(false);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (editingIncident) {
      disasterService.updateIncident(editingIncident.id, data);
      showToast(`อัปเดตข้อมูลเหตุการณ์ ${editingIncident.id} เรียบร้อยแล้ว`, 'success');
    } else {
      const created = disasterService.createIncident(data);
      showToast(`บันทึกเหตุการณ์ใหม่รหัส ${created.id} เรียบร้อยแล้ว`, 'success');
    }
  };

  const handleSelectIncident = (incident: DisasterIncident) => {
    setSelectedIncident(incident);
    setIsDetailModalOpen(true);
  };

  const handleSelectIncidentById = (id: string) => {
    const found = disasterService.getIncidentById(id);
    if (found) {
      setSelectedIncident(found);
      setIsDetailModalOpen(true);
    }
  };

  const handleDeleteIncident = (id: string) => {
    disasterService.deleteIncident(id);
    showToast(`ลบเหตุการณ์ ${id} ออกจากระบบแล้ว`, 'info');
  };

  const handleStatusChange = (id: string, newStatus: IncidentStatus, note?: string) => {
    disasterService.updateIncidentStatus(id, newStatus, 'ศูนย์สั่งการ ศปภ.', note);
    showToast(`ปรับสถานะเหตุการณ์เป็น "${newStatus}" เรียบร้อยแล้ว`, 'success');
    if (selectedIncident && selectedIncident.id === id) {
      const updated = disasterService.getIncidentById(id);
      if (updated) setSelectedIncident(updated);
    }
  };

  const handleBroadcastAlert = (alertData: any) => {
    showToast(`ส่งกระจายสัญญาณ ${alertData.level} สู่พื้นที่ ${alertData.targetProvinces} สำเร็จ`, 'warning');
  };

  return (
    <div className="min-h-screen iridescent-ambient text-[#1F2937] dark:text-[#F5F7FA] flex flex-col font-sans pb-14">
      {/* 1. Studio Hero Department Header */}
      <DisasterHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenNewIncidentModal={handleOpenNewIncident}
        onOpenAlertModal={() => setIsAlertModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 2. Top Summary 5 Cards (Visible in Overview and Incidents tabs) */}
        {(activeTab === 'overview' || activeTab === 'incidents') && (
          <DisasterSummaryCards
            stats={stats}
            latestIncident={incidents[0]}
            onSelectIncident={handleSelectIncident}
            onFilterStatus={() => setActiveTab('incidents')}
          />
        )}

        {/* 3. Tab Views */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Strategic Banners for Heavy Rain Map & BPP Report Tracker */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ทางลัด: เรดาร์ฝน */}
              <button
                type="button"
                onClick={() => setActiveTab('heavy-rain')}
                className="liquid-glass-card iridescent-edge p-5 rounded-3xl text-left cursor-pointer hover:-translate-y-0.5 transition-all group flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md" style={{ background: 'linear-gradient(135deg,#0EA5E9,#2563EB)' }}>
                  <CloudRain className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: '#E0F2FE', color: '#0369A1' }}>เรดาร์ฝน</span>
                  <p className="text-[15px] font-extrabold text-slate-900 dark:text-white leading-snug">แผนที่ฝนตกหนัก & เรดาร์สภาพอากาศสด</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">ตรวจเช็คพื้นที่ฝนตกหนักรายจังหวัด และจุดเสี่ยงภัยดินโคลนถล่ม</p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition group-hover:translate-x-1" style={{ background: '#E0F2FE', color: '#0369A1' }}>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>

              {/* ทางลัด: ติดตามรายงานหน่วย */}
              <button
                type="button"
                onClick={() => setActiveTab('bpp-tracker')}
                className="liquid-glass-card iridescent-edge p-5 rounded-3xl text-left cursor-pointer hover:-translate-y-0.5 transition-all group flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md" style={{ background: 'linear-gradient(135deg,#F59E0B,#EA580C)' }}>
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: '#FFEDD5', color: '#C2410C' }}>ติดตามรายงานหน่วย</span>
                  <p className="text-[15px] font-extrabold text-slate-900 dark:text-white leading-snug">ตรวจเช็คการส่งรายงาน บก. 7 หน่วย และ กก. 26 หน่วย</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">ดูหน่วยที่ยังไม่ส่งรายงาน ผู้รับผิดชอบ และกดเร่งรัด/โทรได้ทันที</p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition group-hover:translate-x-1" style={{ background: '#FFEDD5', color: '#C2410C' }}>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            </div>

            {/* Quick Interactive Map Preview */}
            <div className="liquid-glass-card iridescent-edge rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-[#E89B22] flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    แผนที่สถานการณ์สาธารณภัย (GIS Real-time Overview)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('map')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-xs text-amber-700 dark:text-amber-300 font-bold flex items-center gap-1 cursor-pointer transition"
                >
                  <span>เปิดแผนที่เต็มรูปแบบ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <InteractiveDisasterMap
                points={mapPoints}
                incidents={incidents}
                onSelectIncidentById={handleSelectIncidentById}
                stations={stations}
                onSelectStationById={handleSelectStationById}
              />
            </div>

            {/* Quick Flood Telemetry Spotlight & Active Incidents Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Telemetry Spotlight Card */}
              <div className="liquid-glass-card iridescent-edge rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <Waves className="w-5 h-5 text-blue-600" />
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">สถานการณ์น้ำ 6 ลุ่มน้ำ</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-blue-500/15 text-blue-700 dark:text-blue-300 font-bold">
                      LIVE TELEMETRY
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {stations.slice(0, 4).map(st => (
                      <div
                        key={st.id}
                        className="p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-100">{st.basin} ({st.code})</div>
                          <div className="text-[11px] text-slate-500">{st.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                            {st.currentWaterLevel.toFixed(2)} ม.
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md font-mono tabular-nums ${
                              st.status === 'critical'
                                ? 'bg-rose-100 text-rose-800 animate-pulse'
                                : st.status === 'warning'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {st.capacityPercent}% ความจุ
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/60 dark:border-white/10 mt-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('flood')}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition hover:opacity-95 cursor-pointer flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#B45309] to-[#E89B22]"
                  >
                    <Waves className="w-4 h-4" />
                    <span>เข้าสู่ศูนย์เฝ้าระวังน้ำท่วมและกราฟวิเคราะห์</span>
                  </button>
                </div>
              </div>

              {/* Incidents Quick Action Registry (2 Cols) */}
              <div className="lg:col-span-2 liquid-glass-card iridescent-edge rounded-3xl p-4 sm:p-5">
                <IncidentManagement
                  incidents={incidents}
                  onOpenNewModal={handleOpenNewIncident}
                  onSelectIncident={handleSelectIncident}
                  onEditIncident={handleEditIncident}
                  onDeleteIncident={handleDeleteIncident}
                  onStatusChange={(id, newStatus) => handleStatusChange(id, newStatus)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab: Heavy Rain & Weather Radar Map */}
        {activeTab === 'heavy-rain' && (
          <div className="liquid-glass-card iridescent-edge rounded-3xl p-4 sm:p-6">
            <HeavyRainRadarMap
              onNavigateToUnitReport={() => setActiveTab('bpp-tracker')}
            />
          </div>
        )}

        {/* Tab 2: Full Map View */}
        {activeTab === 'map' && (
          <div className="liquid-glass-card iridescent-edge rounded-3xl p-4 sm:p-6">
            <InteractiveDisasterMap
              points={mapPoints}
              incidents={incidents}
              onSelectIncidentById={handleSelectIncidentById}
              stations={stations}
              onSelectStationById={handleSelectStationById}
            />
          </div>
        )}

        {/* Tab 3: Dedicated Flood Monitoring Dashboard */}
        {activeTab === 'flood' && (
          <div className="liquid-glass-card iridescent-edge rounded-3xl p-4 sm:p-6">
            <FloodMonitoringDashboard
              stations={stations}
              rainfallData={rainfallData}
            />
          </div>
        )}

        {/* Tab: Station Directory, Gauge/Chart Deep-dive, River Chain & Nearby Station */}
        {activeTab === 'stations' && (
          <div className="liquid-glass-card iridescent-edge rounded-3xl p-4 sm:p-6">
            <StationExplorer stations={stations} focusId={focusStationId} />
          </div>
        )}

        {/* Tab: BPP Report Submission Tracker (16 Units) */}
        {activeTab === 'bpp-tracker' && (
          <BppReportTracker defaultDepartment="disaster" standalone={false} />
        )}

        {/* Tab 4: Full Incident Management */}
        {activeTab === 'incidents' && (
          <div className="liquid-glass-card iridescent-edge rounded-3xl p-4 sm:p-6">
            <IncidentManagement
              incidents={incidents}
              onOpenNewModal={handleOpenNewIncident}
              onSelectIncident={handleSelectIncident}
              onEditIncident={handleEditIncident}
              onDeleteIncident={handleDeleteIncident}
              onStatusChange={(id, newStatus) => handleStatusChange(id, newStatus)}
            />
          </div>
        )}

        {/* Tab 5: Reports and Formal Exports */}
        {activeTab === 'smart-ops' && (
          <div className="liquid-glass-card iridescent-edge rounded-3xl p-4 sm:p-6">
            <SmartOpsWorkspace
              department="disaster"
              title="AI & Workflow Center"
              subtitle="ช่วยคัดกรองเหตุการณ์ จัดลำดับความเร่งด่วน ร่างข้อความแจ้งเตือน และทำรายงานหลังเหตุการณ์"
              accent={primaryColor}
            />
          </div>
        )}

        {activeTab === 'aid' && (
          <div className="liquid-glass-card iridescent-edge rounded-3xl p-4 sm:p-6">
            <AidSummaryView />
          </div>
        )}

        {activeTab === 'royal' && (
          <div className="liquid-glass-card iridescent-edge rounded-3xl p-4 sm:p-6">
            <RoyalProjectsView />
          </div>
        )}

        {activeTab === 'incoming' && (
          <div className="liquid-glass-card iridescent-edge rounded-3xl p-4 sm:p-6">
            <IncomingRegisterPage dept="disaster" />
          </div>
        )}

        {activeTab === 'year-plan' && (
          <div className="liquid-glass-card iridescent-edge rounded-3xl p-4 sm:p-6">
            <YearPlanView dept="disaster" />
          </div>
        )}

        {activeTab === 'line-reports' && (
          <div className="liquid-glass-card iridescent-edge rounded-3xl p-4 sm:p-6">
            <LineReportsView dept="disaster" />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <DailyBulletin incidents={incidents} stations={stations} stats={stats} />
            <DisasterReports
              incidents={incidents}
              stats={stats}
            />
          </div>
        )}
      </main>

      {/* Form Modal (Create / Edit) */}
      <IncidentFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingIncident}
      />

      {/* Detail Inspection Modal */}
      <IncidentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        incident={selectedIncident}
        onEdit={handleEditIncident}
        onDelete={handleDeleteIncident}
        onStatusChange={handleStatusChange}
      />

      {/* Emergency Alert Broadcast Modal */}
      <EmergencyAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onSendAlert={handleBroadcastAlert}
      />

      {/* Export Options Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        incidents={incidents}
      />
    </div>
  );
};
