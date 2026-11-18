import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { pageVariants, modalVariants } from '../../utils/motion';
import {
  UnifiedMission,
  UnifiedReport,
  CentralTaskItem,
  FO5_DEPARTMENTS_META,
} from '../../data/commandCenterData';
import { OperationalCommandHome } from './components/OperationalCommandHome';
import { UnifiedTaskCenterModule } from './components/UnifiedTaskCenterModule';
import {
  X,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useCollection } from '../../lib/collections';

interface DashboardModuleProps {
  viewMode?: 'overview' | 'task-center';
  initialTaskSubTab?: 'tasks' | 'bpp-units';
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  viewMode = 'overview',
  initialTaskSubTab = 'tasks',
}) => {
  const [missions, setMissions] = useCollection<UnifiedMission>('dashboard.missions');
  const [reports, setReports] = useCollection<UnifiedReport>('dashboard.reports');
  const [tasks] = useCollection<CentralTaskItem>('dashboard.tasks');

  // Modal inspection states
  const [inspectedMission, setInspectedMission] = useState<UnifiedMission | null>(null);
  const [inspectedReport, setInspectedReport] = useState<UnifiedReport | null>(null);

  // Approve or request revision of a report
  const handleApproveReport = (reportId: string) => {
    setReports(prev =>
      prev.map(r => (r.id === reportId ? { ...r, status: 'ผ่าน', reviewedDate: 'วันนี้' } : r))
    );
    setMissions(prev =>
      prev.map(m => (m.reportId === reportId ? { ...m, reportStatus: 'ผ่าน', status: 'ปิดภารกิจ' } : m))
    );
    if (inspectedReport && inspectedReport.id === reportId) {
      setInspectedReport(prev => (prev ? { ...prev, status: 'ผ่าน' } : null));
    }
  };

  const handleReviseReport = (reportId: string, reason: string) => {
    setReports(prev =>
      prev.map(r =>
        r.id === reportId ? { ...r, status: 'ขอแก้ไข', revisionReason: reason } : r
      )
    );
    setMissions(prev =>
      prev.map(m =>
        m.reportId === reportId ? { ...m, reportStatus: 'ขอแก้ไข', status: 'ส่งผล' } : m
      )
    );
    if (inspectedReport && inspectedReport.id === reportId) {
      setInspectedReport(prev => (prev ? { ...prev, status: 'ขอแก้ไข', revisionReason: reason } : null));
    }
  };

  return (
    <div className="w-full pb-16 space-y-6 iridescent-ambient min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="liquid-glass-card rounded-3xl p-4 sm:p-6 iridescent-ambient"
          >
            {viewMode === 'task-center' ? (
              <UnifiedTaskCenterModule
                tasks={tasks}
                initialSubTab={initialTaskSubTab}
              />
            ) : (
              <OperationalCommandHome
                missions={missions}
                reports={reports}
                tasks={tasks}
                onSelectMission={setInspectedMission}
                onSelectReport={setInspectedReport}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* INSPECT MISSION MODAL */}
      <AnimatePresence>
        {inspectedMission && (
          <motion.div
            variants={modalVariants.backdrop}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <motion.div
              variants={modalVariants.panel}
              initial="initial"
              animate="animate"
              exit="exit"
              className="liquid-glass-modal rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-[rgba(37,32,43,0.1)] space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between pb-3 border-b border-[rgba(37,32,43,0.07)]">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded text-[10px] font-bold"
                      style={{
                        backgroundColor: FO5_DEPARTMENTS_META[inspectedMission.primaryDepartment].lightColor,
                        color: FO5_DEPARTMENTS_META[inspectedMission.primaryDepartment].color,
                      }}
                    >
                      {FO5_DEPARTMENTS_META[inspectedMission.primaryDepartment].name}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#6B6973]">
                      {inspectedMission.missionCode}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#25202B] mt-1">
                    {inspectedMission.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectedMission(null)}
                  className="p-1 rounded-lg text-[#8A8792] hover:text-[#25202B] hover:bg-[#F7F7F9]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-[#45424C]">
                <div className="p-3 bg-[#FBFAFD] rounded-xl border border-[rgba(37,32,43,0.06)] leading-relaxed">
                  <span className="font-bold text-[#25202B] block mb-1">วัตถุประสงค์และรายละเอียดภารกิจ:</span>
                  {inspectedMission.description}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-lg bg-[#F7F7F9]">
                    <span className="text-[#8A8792] block text-[10px]">วัน-เวลาปฏิบัติการ:</span>
                    <strong className="text-[#25202B]">{inspectedMission.date} ({inspectedMission.time})</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F7F7F9]">
                    <span className="text-[#8A8792] block text-[10px]">สถานที่และพิกัด:</span>
                    <strong className="text-[#25202B]">{inspectedMission.location}, {inspectedMission.province}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F7F7F9]">
                    <span className="text-[#8A8792] block text-[10px]">หน่วยรับผิดชอบ / เป้าหมาย:</span>
                    <strong className="text-[#25202B]">{inspectedMission.targetUnit} (กำลังพล {inspectedMission.participantsCount} นาย)</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F7F7F9]">
                    <span className="text-[#8A8792] block text-[10px]">การแต่งกาย / อุปกรณ์:</span>
                    <strong className="text-[#25202B]">{inspectedMission.attire}</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#EDE4F7]/40 border border-[#5B2A86]/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#5B2A86] font-bold block">ขั้นตอนการดำเนินงาน (Mission Workflow):</span>
                    <div className="text-xs font-bold text-[#25202B] mt-0.5">
                      สถานะปัจจุบัน: <strong className="text-[#5B2A86]">{inspectedMission.status}</strong>
                    </div>
                  </div>
                  {inspectedMission.hasReport && (
                    <button
                      type="button"
                      onClick={() => {
                        const rep = reports.find(r => r.id === inspectedMission.reportId);
                        if (rep) {
                          setInspectedMission(null);
                          setInspectedReport(rep);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#5B2A86] text-white font-bold hover:bg-[#4E2472] transition-colors"
                    >
                      ดูรายงานผลการปฏิบัติ
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[rgba(37,32,43,0.06)] flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setInspectedMission(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6B6973] hover:bg-[#F7F7F9]"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INSPECT REPORT MODAL */}
      <AnimatePresence>
        {inspectedReport && (
          <motion.div
            variants={modalVariants.backdrop}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <motion.div
              variants={modalVariants.panel}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-[rgba(37,32,43,0.1)] space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between pb-3 border-b border-[rgba(37,32,43,0.07)]">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded text-[10px] font-bold"
                      style={{
                        backgroundColor: FO5_DEPARTMENTS_META[inspectedReport.departmentKey].lightColor,
                        color: FO5_DEPARTMENTS_META[inspectedReport.departmentKey].color,
                      }}
                    >
                      {FO5_DEPARTMENTS_META[inspectedReport.departmentKey].name}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#6B6973]">
                      {inspectedReport.reportCode}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                        inspectedReport.status === 'ผ่าน'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inspectedReport.status === 'ขอแก้ไข'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inspectedReport.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#25202B] mt-1">
                    {inspectedReport.missionTitle}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectedReport(null)}
                  className="p-1 rounded-lg text-[#8A8792] hover:text-[#25202B] hover:bg-[#F7F7F9]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-[#45424C]">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#F7F7F9]">
                    <span className="text-[#8A8792] block text-[10px]">หน่วยรายงาน:</span>
                    <strong className="text-[#25202B]">{inspectedReport.submittingUnit}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F7F7F9]">
                    <span className="text-[#8A8792] block text-[10px]">ผู้ส่งรายงาน:</span>
                    <strong className="text-[#25202B]">{inspectedReport.submittedBy}</strong>
                  </div>
                </div>

                <div className="p-3.5 bg-[#FBFAFD] rounded-xl border border-[rgba(37,32,43,0.06)] space-y-1.5">
                  <div className="font-bold text-[#25202B]">ผลการปฏิบัติงานเชิงประจักษ์:</div>
                  <p className="leading-relaxed text-[#45424C]">{inspectedReport.operationalResult}</p>
                  <div className="pt-2 text-[11px] text-[#6B6973] flex gap-4">
                    <span>กำลังพลปฏิบัติการ: <strong>{inspectedReport.personnelCount} นาย</strong></span>
                    <span>ประชาชน/เยาวชนที่ได้รับประโยชน์: <strong>{inspectedReport.beneficiariesCount} คน</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60">
                    <div className="font-bold text-amber-900 mb-0.5">ปัญหา/อุปสรรค:</div>
                    <div className="text-amber-800 text-[11px]">{inspectedReport.problemsObstacles}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60">
                    <div className="font-bold text-emerald-900 mb-0.5">การแก้ไข/ข้อเสนอแนะ:</div>
                    <div className="text-emerald-800 text-[11px]">{inspectedReport.solutionsDone}</div>
                  </div>
                </div>

                {inspectedReport.images && inspectedReport.images.length > 0 && (
                  <div>
                    <div className="font-bold text-[#25202B] mb-1.5">ภาพถ่ายเชิงประจักษ์:</div>
                    <div className="grid grid-cols-2 gap-2">
                      {inspectedReport.images.map((img, idx) => (
                        <div key={idx} className="h-32 rounded-xl overflow-hidden border border-[rgba(37,32,43,0.1)]">
                          <img
                            src={img}
                            alt={`ภาพภารกิจ ${idx + 1}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {inspectedReport.attachedDocs && inspectedReport.attachedDocs.length > 0 && (
                  <div>
                    <div className="font-bold text-[#25202B] mb-1.5">เอกสารแนบท้าย:</div>
                    <div className="space-y-1">
                      {inspectedReport.attachedDocs.map((doc, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-[#F7F7F9] border border-[rgba(37,32,43,0.06)] flex items-center justify-between">
                          <span className="font-medium text-[#25202B]">{doc.name}</span>
                          <span className="text-[10px] text-[#8A8792] font-mono">{doc.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[rgba(37,32,43,0.07)] flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] text-[#8A8792]">
                  วันที่ส่ง: {inspectedReport.submittedDate}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const reason = prompt('ระบุเหตุผลและสิ่งที่ต้องการให้แก้ไขเพิ่มเติม:', inspectedReport.revisionReason || '');
                      if (reason !== null) {
                        handleReviseReport(inspectedReport.id, reason || 'ขอให้แนบข้อมูลเพิ่มเติม');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold text-xs transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>ส่งคืนขอแก้ไข</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApproveReport(inspectedReport.id)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>ตรวจรับรองรายงาน (ผ่าน)</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardModule;
