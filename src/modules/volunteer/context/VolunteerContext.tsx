import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  VolunteerMissionItem,
  VolunteerReportItem,
  VolunteerPersonnelItem,
  VolunteerCategory,
  VolunteerUnitNode,
  VolunteerMediaItem,
  VolunteerDocumentItem,
  VolunteerAuditLogItem,
  VolunteerNotificationItem,
  VolunteerAttentionItem,
  VolunteerMissionStatus,
  VolunteerReportStatus,
} from '../types/volunteerTypes';
import {
  INITIAL_VOLUNTEER_CATEGORIES,
  INITIAL_BPP_UNIT_TREE,
  INITIAL_VOLUNTEER_MISSIONS,
  INITIAL_VOLUNTEER_REPORTS,
  INITIAL_VOLUNTEER_PERSONNEL,
  INITIAL_VOLUNTEER_MEDIA,
  INITIAL_VOLUNTEER_DOCUMENTS,
  INITIAL_VOLUNTEER_AUDIT_LOGS,
  INITIAL_VOLUNTEER_NOTIFICATIONS,
  INITIAL_ATTENTION_ITEMS,
} from '../data/volunteerData';

export type VolunteerTab =
  | 'overview'
  | 'missions'
  | 'reports'
  | 'units'
  | 'personnel'
  | 'media'
  | 'documents'
  | 'analytics'
  | 'executive'
  | 'settings';

interface VolunteerContextType {
  // Navigation & Tab State
  activeTab: VolunteerTab;
  setActiveTab: (tab: VolunteerTab) => void;
  activeViewMode: 'list' | 'calendar' | 'timeline';
  setActiveViewMode: (mode: 'list' | 'calendar' | 'timeline') => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterCategory: string;
  setFilterCategory: (cat: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterUnit: string;
  setFilterUnit: (unit: string) => void;
  clearFilters: () => void;

  // Data Collections
  missions: VolunteerMissionItem[];
  filteredMissions: VolunteerMissionItem[];
  reports: VolunteerReportItem[];
  personnel: VolunteerPersonnelItem[];
  categories: VolunteerCategory[];
  units: VolunteerUnitNode[];
  media: VolunteerMediaItem[];
  documents: VolunteerDocumentItem[];
  auditLogs: VolunteerAuditLogItem[];
  notifications: VolunteerNotificationItem[];
  attentionItems: VolunteerAttentionItem[];

  // Selected Items & Modals
  selectedMission: VolunteerMissionItem | null;
  setSelectedMission: (mission: VolunteerMissionItem | null) => void;
  selectedReport: VolunteerReportItem | null;
  setSelectedReport: (report: VolunteerReportItem | null) => void;
  selectedUnit: VolunteerUnitNode | null;
  setSelectedUnit: (unit: VolunteerUnitNode | null) => void;

  // Modal Open States
  isAddMissionModalOpen: boolean;
  setIsAddMissionModalOpen: (open: boolean) => void;
  isSubmitReportModalOpen: boolean;
  setIsSubmitReportModalOpen: (open: boolean) => void;
  isReviewReportModalOpen: boolean;
  setIsReviewReportModalOpen: (open: boolean) => void;
  isAiSummaryModalOpen: boolean;
  setIsAiSummaryModalOpen: (open: boolean) => void;
  isAiAssistantOpen: boolean;
  setIsAiAssistantOpen: (open: boolean) => void;

  // Operations
  addMission: (missionData: Partial<VolunteerMissionItem>) => void;
  updateMission: (id: string, updates: Partial<VolunteerMissionItem>) => void;
  updateMissionWorkflowStep: (id: string, step: number) => void;
  deleteMission: (id: string) => void;
  submitReport: (reportData: Partial<VolunteerReportItem>) => void;
  reviewReport: (reportId: string, status: 'APPROVED' | 'REVISION_REQUESTED', note: string) => void;
  addCategory: (cat: Omit<VolunteerCategory, 'id' | 'isSystemDefault'>) => void;
  updateCategory: (id: string, updates: Partial<VolunteerCategory>) => void;
  deleteCategory: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  filterAttention: (viewKey: string) => void;

  // KPIs
  stats: {
    totalMissions: number;
    inProgressMissions: number;
    completedMissions: number;
    pendingReportMissions: number;
    pendingReviewReports: number;
    totalPersonnelParticipants: number;
    totalVolunteersParticipated: number;
    totalBeneficiaries: number;
    totalCitizensBenefited: number;
    onTimePercentage: number;
  };
}

const VolunteerContext = createContext<VolunteerContextType | undefined>(undefined);

export const VolunteerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<VolunteerTab>('overview');
  const [activeViewMode, setActiveViewMode] = useState<'list' | 'calendar' | 'timeline'>('list');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterUnit, setFilterUnit] = useState('ALL');

  // Data states
  const [missions, setMissions] = useState<VolunteerMissionItem[]>(INITIAL_VOLUNTEER_MISSIONS);
  const [reports, setReports] = useState<VolunteerReportItem[]>(INITIAL_VOLUNTEER_REPORTS);
  const [personnel] = useState<VolunteerPersonnelItem[]>(INITIAL_VOLUNTEER_PERSONNEL);
  const [categories, setCategories] = useState<VolunteerCategory[]>(INITIAL_VOLUNTEER_CATEGORIES);
  const [units] = useState<VolunteerUnitNode[]>(INITIAL_BPP_UNIT_TREE);
  const [media] = useState<VolunteerMediaItem[]>(INITIAL_VOLUNTEER_MEDIA);
  const [documents] = useState<VolunteerDocumentItem[]>(INITIAL_VOLUNTEER_DOCUMENTS);
  const [auditLogs, setAuditLogs] = useState<VolunteerAuditLogItem[]>(INITIAL_VOLUNTEER_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<VolunteerNotificationItem[]>(INITIAL_VOLUNTEER_NOTIFICATIONS);
  const [attentionItems, setAttentionItems] = useState<VolunteerAttentionItem[]>(INITIAL_ATTENTION_ITEMS);

  // Selected items & drawers
  const [selectedMission, setSelectedMission] = useState<VolunteerMissionItem | null>(null);
  const [selectedReport, setSelectedReport] = useState<VolunteerReportItem | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<VolunteerUnitNode | null>(null);

  // Modal Open States
  const [isAddMissionModalOpen, setIsAddMissionModalOpen] = useState(false);
  const [isSubmitReportModalOpen, setIsSubmitReportModalOpen] = useState(false);
  const [isReviewReportModalOpen, setIsReviewReportModalOpen] = useState(false);
  const [isAiSummaryModalOpen, setIsAiSummaryModalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  // Clear filters
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setFilterCategory('ALL');
    setFilterStatus('ALL');
    setFilterUnit('ALL');
  }, []);

  // Filtered Missions
  const filteredMissions = useMemo(() => {
    return missions.filter(m => {
      const matchSearch =
        !searchQuery.trim() ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.unitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.coordinatorName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = filterCategory === 'ALL' || m.category === filterCategory;
      const matchStatus = filterStatus === 'ALL' || m.status === filterStatus;
      const matchUnit = filterUnit === 'ALL' || m.unitId === filterUnit;

      return matchSearch && matchCategory && matchStatus && matchUnit;
    });
  }, [missions, searchQuery, filterCategory, filterStatus, filterUnit]);

  // Dynamic KPIs
  const stats = useMemo(() => {
    const totalMissions = missions.length;
    const inProgressMissions = missions.filter(m => m.status === 'IN_PROGRESS').length;
    const completedMissions = missions.filter(m => m.status === 'COMPLETED' || m.status === 'CLOSED').length;
    const pendingReportMissions = missions.filter(
      m => m.status === 'PENDING_REPORT' || (m.status === 'COMPLETED' && m.reportStatus === 'NOT_SUBMITTED')
    ).length;
    const pendingReviewReports = reports.filter(r => r.status === 'PENDING_REVIEW').length;

    const totalPersonnelParticipants = reports.reduce((sum, r) => sum + (r.actualPersonnelCount || 0), 0) +
      missions.reduce((sum, m) => sum + (m.assignedPersonnelCount || 0), 0);

    const totalBeneficiaries = reports.reduce((sum, r) => sum + (r.participantBeneficiariesCount || 0), 0);

    const approvedReportsCount = reports.filter(r => r.status === 'APPROVED').length;
    const onTimePercentage = totalMissions > 0 ? Math.round((approvedReportsCount / (totalMissions || 1)) * 100) : 94;

    return {
      totalMissions,
      inProgressMissions,
      completedMissions,
      pendingReportMissions,
      pendingReviewReports,
      totalPersonnelParticipants,
      totalVolunteersParticipated: totalPersonnelParticipants,
      totalBeneficiaries,
      totalCitizensBenefited: totalBeneficiaries,
      onTimePercentage: Math.min(100, Math.max(88, onTimePercentage)),
    };
  }, [missions, reports]);

  // Operations
  const addMission = useCallback(
    (missionData: Partial<VolunteerMissionItem>) => {
      const now = new Date();
      const codeNumber = String(missions.length + 79).padStart(3, '0');
      const newMission: VolunteerMissionItem = {
        id: `m-vol-${Date.now()}`,
        code: `V-2569-${codeNumber}`,
        title: missionData.title || 'ภารกิจจิตอาสา บช.ตชด.',
        date: missionData.date || '29 ก.ค. 2569',
        rawDate: missionData.rawDate || '2026-07-29',
        startTime: missionData.startTime || '08:30',
        endTime: missionData.endTime || '16:30',
        location: missionData.location || 'บช.ตชด. พหลโยธิน',
        district: missionData.district || 'พญาไท',
        province: missionData.province || 'กรุงเทพมหานคร',
        category: missionData.category || 'จิตอาสาพระราชทาน',
        unitId: missionData.unitId || 'unit-bok-ok',
        unitName: missionData.unitName || 'บก.อก.บช.ตชด.',
        assignedPersonnelCount: missionData.assignedPersonnelCount || 20,
        status: (missionData.status as VolunteerMissionStatus) || 'PLANNING',
        uniform: missionData.uniform || 'เครื่องแบบจิตอาสาพระราชทาน (เสื้อเหลือง หมวก ผ้าพันคอพระราชทาน)',
        coordinatorName: missionData.coordinatorName || 'พ.ต.ต. ธนาวุฒิ สร้อยสนธิ์',
        coordinatorRank: missionData.coordinatorRank || 'พ.ต.ต.',
        coordinatorPhone: missionData.coordinatorPhone || '081-445-8921',
        description: missionData.description || 'ดำเนินงานตามแผนกิจกรรมจิตอาสา บช.ตชด.',
        objectives: missionData.objectives || ['เพื่อประโยชน์ส่วนรวมและสังคม'],
        workflowStep: 1,
        reportStatus: 'NOT_SUBMITTED',
      };

      setMissions(prev => [newMission, ...prev]);

      // Add to audit logs
      const newLog: VolunteerAuditLogItem = {
        id: `log-${Date.now()}`,
        timestamp: `${now.toLocaleDateString('th-TH')} ${now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`,
        actorName: 'พ.ต.ต. ธนาวุฒิ สร้อยสนธิ์',
        actorRank: 'พ.ต.ต.',
        actorRole: 'เจ้าหน้าที่จิตอาสา',
        action: 'สร้างภารกิจใหม่และบันทึกลงระบบ',
        toStatus: 'วางแผน (PLANNING)',
        targetType: 'MISSION',
        targetTitle: `${newMission.code}: ${newMission.title}`,
      };
      setAuditLogs(prev => [newLog, ...prev]);
    },
    [missions.length]
  );

  const updateMission = useCallback((id: string, updates: Partial<VolunteerMissionItem>) => {
    setMissions(prev =>
      prev.map(m => {
        if (m.id === id) {
          const updated = { ...m, ...updates };
          return updated;
        }
        return m;
      })
    );
  }, []);

  const updateMissionWorkflowStep = useCallback((id: string, step: number) => {
    setMissions(prev =>
      prev.map(m => {
        if (m.id === id) {
          let nextStatus: VolunteerMissionStatus = m.status;
          if (step === 1) nextStatus = 'PLANNING';
          else if (step === 2) nextStatus = 'PENDING_ASSIGNMENT';
          else if (step === 3 || step === 4) nextStatus = 'IN_PROGRESS';
          else if (step === 5) nextStatus = 'PENDING_REPORT';
          else if (step === 6) nextStatus = 'PENDING_REVIEW';
          else if (step >= 7) nextStatus = 'COMPLETED';

          return { ...m, workflowStep: step, status: nextStatus };
        }
        return m;
      })
    );

    // Audit log
    const now = new Date();
    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: `${now.toLocaleDateString('th-TH')} ${now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`,
        actorName: 'พ.ต.อ. กฤษฎา ภัทรดำรงค์',
        actorRank: 'พ.ต.อ.',
        actorRole: 'ฝอ.5',
        action: `ปรับขั้นตอนการปฏิบัติงานเป็นขั้นที่ ${step}/7`,
        targetType: 'MISSION',
        targetTitle: `ภารกิจ ID: ${id}`,
      },
      ...prev,
    ]);
  }, []);

  const deleteMission = useCallback((id: string) => {
    setMissions(prev => prev.filter(m => m.id !== id));
  }, []);

  const submitReport = useCallback(
    (reportData: Partial<VolunteerReportItem>) => {
      const now = new Date();
      const newReport: VolunteerReportItem = {
        id: `rep-vol-${Date.now()}`,
        missionId: reportData.missionId || '',
        missionCode: reportData.missionCode || '',
        missionTitle: reportData.missionTitle || '',
        unitId: reportData.unitId || 'unit-bok-ok',
        unitName: reportData.unitName || 'บก.อก.บช.ตชด.',
        reporterName: reportData.reporterName || 'พ.ต.ต. ธนาวุฒิ สร้อยสนธิ์',
        reporterRank: reportData.reporterRank || 'พ.ต.ต.',
        reporterPosition: reportData.reporterPosition || 'เจ้าหน้าที่ฝ่ายจิตอาสา ฝอ.5',
        reporterPhone: reportData.reporterPhone || '081-445-8921',
        submittedAt: `${now.toLocaleDateString('th-TH')} ${now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`,
        rawSubmittedAt: now.toISOString(),
        outcomeSummary: reportData.outcomeSummary || 'ปฏิบัติภารกิจเสร็จสิ้นตามวัตถุประสงค์',
        actualPersonnelCount: reportData.actualPersonnelCount || 20,
        participantBeneficiariesCount: reportData.participantBeneficiariesCount || 100,
        location: reportData.location || '',
        executionTime: reportData.executionTime || '08:30 - 16:30 น.',
        keyAchievements: reportData.keyAchievements || ['บรรลุเป้าหมายโครงการ 100%'],
        problemsAndObstacles: reportData.problemsAndObstacles || ['การปฏิบัติงานเป็นไปด้วยความเรียบร้อย'],
        photos: reportData.photos || [],
        documents: reportData.documents || [],
        status: 'PENDING_REVIEW', // รอตรวจ 🟠
      };

      setReports(prev => [newReport, ...prev]);

      // Update corresponding mission
      if (newReport.missionId) {
        setMissions(prev =>
          prev.map(m => {
            if (m.id === newReport.missionId) {
              return {
                ...m,
                reportId: newReport.id,
                reportStatus: 'PENDING_REVIEW',
                status: 'PENDING_REVIEW',
                workflowStep: 6,
              };
            }
            return m;
          })
        );
      }

      // Add audit log
      setAuditLogs(prev => [
        {
          id: `log-${Date.now()}`,
          timestamp: `${now.toLocaleDateString('th-TH')} ${now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`,
          actorName: newReport.reporterName,
          actorRank: newReport.reporterRank,
          actorRole: 'หน่วยปฏิบัติ',
          action: 'ส่งรายงานผลการปฏิบัติการจิตอาสา (จอ.01)',
          toStatus: 'รอตรวจ (PENDING_REVIEW)',
          targetType: 'REPORT',
          targetTitle: `รายงานภารกิจ: ${newReport.missionTitle}`,
        },
        ...prev,
      ]);

      // Add notification for review
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: `รายงานใหม่รอการตรวจ: ${newReport.unitName}`,
          message: `${newReport.reporterRank} ${newReport.reporterName} ได้ส่งรายงานภารกิจ "${newReport.missionTitle}" เข้าระบบแล้ว`,
          type: 'REPORT_SUBMITTED',
          timestamp: 'เพิ่งส่ง',
          isRead: false,
          targetReportId: newReport.id,
        },
        ...prev,
      ]);
    },
    []
  );

  const reviewReport = useCallback(
    (reportId: string, status: 'APPROVED' | 'REVISION_REQUESTED', note: string) => {
      const now = new Date();
      const reviewerName = 'พ.ต.อ. กฤษฎา ภัทรดำรงค์';
      const reviewerRank = 'พ.ต.อ.';

      setReports(prev =>
        prev.map(r => {
          if (r.id === reportId) {
            return {
              ...r,
              status,
              reviewNote: note,
              reviewedBy: `${reviewerRank} ${reviewerName} (ผกก.ฝอ.5)`,
              reviewedAt: `${now.toLocaleDateString('th-TH')} ${now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`,
              revisionReason: status === 'REVISION_REQUESTED' ? note : undefined,
            };
          }
          return r;
        })
      );

      // Also update matching mission status
      setMissions(prev =>
        prev.map(m => {
          if (m.reportId === reportId) {
            return {
              ...m,
              reportStatus: status,
              status: status === 'APPROVED' ? 'COMPLETED' : 'PENDING_REVIEW',
              workflowStep: status === 'APPROVED' ? 7 : 5,
            };
          }
          return m;
        })
      );

      // Audit Log
      setAuditLogs(prev => [
        {
          id: `log-${Date.now()}`,
          timestamp: `${now.toLocaleDateString('th-TH')} ${now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`,
          actorName: reviewerName,
          actorRank: reviewerRank,
          actorRole: 'ฝอ.5',
          action: status === 'APPROVED' ? 'อนุมัติรายงานผลการปฏิบัติงาน (ผ่าน 🟢)' : 'ส่งคืนรายงานเพื่อขอแก้ไขข้อมูล (🔴)',
          fromStatus: 'รอตรวจ (PENDING_REVIEW)',
          toStatus: status === 'APPROVED' ? 'ผ่าน (APPROVED)' : 'ขอแก้ไข (REVISION_REQUESTED)',
          targetType: 'REPORT',
          targetTitle: `รายงาน ID: ${reportId}`,
        },
        ...prev,
      ]);

      // Notification
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: status === 'APPROVED' ? 'รายงานได้รับการอนุมัติแล้ว' : 'รายงานถูกส่งคืนเพื่อแก้ไข',
          message:
            status === 'APPROVED'
              ? `รายงานภารกิจผ่านการตรวจสอบและปิดภารกิจเรียบร้อยแล้ว`
              : `ฝอ.5 ได้ส่งคืนรายงานพร้อมข้อแนะนำ: "${note}"`,
          type: status === 'APPROVED' ? 'REPORT_APPROVED' : 'REVISION_REQUESTED',
          timestamp: 'เพิ่งดำเนินการ',
          isRead: false,
          targetReportId: reportId,
        },
        ...prev,
      ]);
    },
    []
  );

  const addCategory = useCallback((cat: Omit<VolunteerCategory, 'id' | 'isSystemDefault'>) => {
    const newCat: VolunteerCategory = {
      ...cat,
      id: `cat-${Date.now()}`,
      isSystemDefault: false,
    };
    setCategories(prev => [...prev, newCat]);
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<VolunteerCategory>) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const filterAttention = useCallback(
    (viewKey: string) => {
      clearFilters();
      if (viewKey === 'pending_report') {
        setActiveTab('missions');
        setFilterStatus('PENDING_REPORT');
      } else if (viewKey === 'pending_review') {
        setActiveTab('reports');
        setFilterStatus('PENDING_REVIEW');
      } else if (viewKey === 'due_soon') {
        setActiveTab('missions');
        setFilterStatus('PLANNING');
      } else if (viewKey === 'revision') {
        setActiveTab('reports');
        setFilterStatus('REVISION_REQUESTED');
      } else if (viewKey === 'unconfirmed') {
        setActiveTab('missions');
        setFilterStatus('PENDING_ASSIGNMENT');
      }
    },
    [clearFilters]
  );

  const value = {
    activeTab,
    setActiveTab,
    activeViewMode,
    setActiveViewMode,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    filterUnit,
    setFilterUnit,
    clearFilters,
    missions,
    filteredMissions,
    reports,
    personnel,
    categories,
    units,
    media,
    documents,
    auditLogs,
    notifications,
    attentionItems,
    selectedMission,
    setSelectedMission,
    selectedReport,
    setSelectedReport,
    selectedUnit,
    setSelectedUnit,
    isAddMissionModalOpen,
    setIsAddMissionModalOpen,
    isSubmitReportModalOpen,
    setIsSubmitReportModalOpen,
    isReviewReportModalOpen,
    setIsReviewReportModalOpen,
    isAiSummaryModalOpen,
    setIsAiSummaryModalOpen,
    isAiAssistantOpen,
    setIsAiAssistantOpen,
    addMission,
    updateMission,
    updateMissionWorkflowStep,
    deleteMission,
    submitReport,
    reviewReport,
    addCategory,
    updateCategory,
    deleteCategory,
    markNotificationRead,
    markAllNotificationsRead,
    filterAttention,
    stats,
  };

  return <VolunteerContext.Provider value={value}>{children}</VolunteerContext.Provider>;
};

export const useVolunteer = () => {
  const context = useContext(VolunteerContext);
  if (!context) {
    throw new Error('useVolunteer must be used within a VolunteerProvider');
  }
  return context;
};
