import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  BudgetItem,
  TravelRecord,
  IncomingDocument,
  OutgoingDocument,
  ArchivalDocument,
  Unit,
  Personnel,
  ActivityLog,
  SystemNotification,
  Role,
  AppModule,
  UserSession,
  DepartmentRole,
  DocumentInspection,
  Meeting,
  MeetingResolution,
  Mission,
} from '../types';
import { initialBudgets } from '../data/budgetData';
import { initialTravelRecords } from '../data/travelData';
import { initialIncomingDocs } from '../data/incomingDocsData';
import { initialOutgoingDocs } from '../data/outgoingDocsData';
import { initialArchivalDocs } from '../data/archivalDocsData';
import { initialUnits, initialPersonnel } from '../data/unitsAndPersonnel';
import { initialNotifications, initialActivityLogs } from '../data/notificationsAndLogs';
import { initialInspections } from '../data/inspectionsData';
import { initialMeetings } from '../data/meetingsData';
import { initialMissions } from '../data/missionsData';
import { findUserByCredentials, findUserById, SystemUser } from '../data/usersData';

// Sessions created before the password check existed used a different prefix and are rejected.
const SESSION_TOKEN_PREFIX = 'FO5-AUTH-V2-';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface MissionConflictResult {
  personId: string;
  personName: string;
  conflictingMission: Mission;
}

interface AdminContextType {
  // State
  budgets: BudgetItem[];
  travelRecords: TravelRecord[];
  incomingDocs: IncomingDocument[];
  outgoingDocs: OutgoingDocument[];
  archivalDocs: ArchivalDocument[];
  units: Unit[];
  personnel: Personnel[];
  activityLogs: ActivityLog[];
  logs: ActivityLog[];
  notifications: SystemNotification[];
  inspections: DocumentInspection[];
  meetings: Meeting[];
  missions: Mission[];
  currentRole: Role;
  currentUser: Personnel;
  isAuthenticated: boolean;
  userSession: UserSession | null;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  login: (username: string, password: string, role?: Role, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  activeMenu: string;
  activeSubMenu?: string;
  activeModule: AppModule;
  navigateModule: (module: AppModule, subMenu?: string) => void;
  toasts: ToastState[];

  // Navigation
  navigate: (menu: string, subMenu?: string) => void;
  setRole: (role: Role) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  clearLogs: () => void;

  // KPIs
  kpis: {
    totalBudget: number;
    spentBudget: number;
    remainingBudget: number;
    committedBudget: number;
    spentPercentage: number;
    incomingThisMonth: number;
    outgoingThisMonth: number;
    pendingIncoming: number;
    travelThisMonth: number;
    totalDocuments: number;
    totalPersonnel: number;
    totalUnits: number;
    totalMissions: number;
    activeMissions: number;
    totalMeetings: number;
    pendingResolutions: number;
    inspectedDocuments: number;
    averageInspectionScore: number;
  };

  // CRUD Operations
  addBudget: (item: Omit<BudgetItem, 'budget_id' | 'created_at' | 'updated_at'>) => void;
  updateBudget: (item: BudgetItem) => void;
  deleteBudget: (id: string) => void;

  addTravel: (item: Omit<TravelRecord, 'travel_id' | 'created_at'>) => void;
  updateTravel: (item: TravelRecord) => void;
  deleteTravel: (id: string) => void;

  addIncomingDoc: (item: Omit<IncomingDocument, 'incoming_id' | 'created_at'>) => void;
  updateIncomingDoc: (item: IncomingDocument) => void;
  deleteIncomingDoc: (id: string) => void;

  addOutgoingDoc: (item: Omit<OutgoingDocument, 'outgoing_id' | 'created_at'>) => void;
  updateOutgoingDoc: (item: OutgoingDocument) => void;
  deleteOutgoingDoc: (id: string) => void;

  addArchivalDoc: (item: Omit<ArchivalDocument, 'document_id' | 'upload_date'>) => void;
  updateArchivalDoc: (item: ArchivalDocument) => void;
  deleteArchivalDoc: (id: string) => void;

  addUnit: (item: Unit) => void;
  updateUnit: (item: Unit) => void;
  deleteUnit: (id: string) => void;

  addPersonnel: (item: Personnel) => void;
  updatePersonnel: (item: Personnel) => void;
  deletePersonnel: (id: string) => void;

  // Inspection Operations
  addInspection: (item: DocumentInspection) => void;
  updateInspection: (item: DocumentInspection) => void;
  deleteInspection: (id: string) => void;

  // Meeting Operations
  addMeeting: (item: Omit<Meeting, 'id' | 'created_at' | 'updated_at'>) => void;
  updateMeeting: (item: Meeting) => void;
  deleteMeeting: (id: string) => void;
  addMeetingResolution: (meetingId: string, resolution: Omit<MeetingResolution, 'resolution_id'>) => void;
  updateMeetingResolution: (resolution: MeetingResolution) => void;
  deleteMeetingResolution: (meetingId: string, resolutionId: string) => void;

  // Mission Operations
  addMission: (item: Omit<Mission, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMission: (item: Mission) => void;
  deleteMission: (id: string) => void;
  checkMissionConflicts: (personnelIds: string[], startDate: string, endDate: string, excludeMissionId?: string) => MissionConflictResult[];

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetAllData: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [budgets, setBudgets] = useState<BudgetItem[]>(initialBudgets);
  const [travelRecords, setTravelRecords] = useState<TravelRecord[]>(initialTravelRecords);
  const [incomingDocs, setIncomingDocs] = useState<IncomingDocument[]>(initialIncomingDocs);
  const [outgoingDocs, setOutgoingDocs] = useState<OutgoingDocument[]>(initialOutgoingDocs);
  const [archivalDocs, setArchivalDocs] = useState<ArchivalDocument[]>(initialArchivalDocs);
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [personnel, setPersonnel] = useState<Personnel[]>(initialPersonnel);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);
  const [notifications, setNotifications] = useState<SystemNotification[]>(initialNotifications);
  const [inspections, setInspections] = useState<DocumentInspection[]>(initialInspections);
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [missions, setMissions] = useState<Mission[]>(initialMissions);
  // Retrieve stored session if exists
  const getStoredSession = (): UserSession | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem('sac_session') || sessionStorage.getItem('sac_session');
      if (!raw) return null;
      const parsed = JSON.parse(raw) as UserSession;
      const valid =
        typeof parsed?.token === 'string' &&
        parsed.token.startsWith(SESSION_TOKEN_PREFIX) &&
        typeof parsed.expiresAt === 'number' &&
        parsed.expiresAt > Date.now() &&
        !!findUserById(parsed.user?.id);
      if (valid) return parsed;
      localStorage.removeItem('sac_session');
      localStorage.removeItem('sac_auth');
      sessionStorage.removeItem('sac_session');
    } catch {
      return null;
    }
    return null;
  };

  const initialStoredSession = getStoredSession();

  const [userSession, setUserSession] = useState<UserSession | null>(initialStoredSession);
  const [currentRole, setRoleState] = useState<Role>(() => {
    if (initialStoredSession?.user?.role) return initialStoredSession.user.role;
    return 'SUPER_ADMIN';
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!initialStoredSession);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const getInitialModule = (): AppModule => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      if (p === '/' || p === '/home') return 'home';
      if (p.startsWith('/login')) return 'login';
      if (p.startsWith('/my-space') || p.startsWith('/profile') || p.startsWith('/me')) return 'my-space';
      if (p.startsWith('/dashboard')) return 'dashboard';
      if (p.startsWith('/admin')) return 'admin';
      if (p.startsWith('/relations')) return 'relations';
      if (p.startsWith('/disaster')) return 'disaster';
      if (p.startsWith('/volunteer')) return 'volunteer';
      if (p.startsWith('/reports')) return 'reports';
      if (p.startsWith('/line-reports')) return 'line-reports';
      if (p.startsWith('/calendar')) return 'calendar';
      if (p.startsWith('/documents')) return 'documents';
      if (p.startsWith('/news')) return 'news';
      if (p.startsWith('/settings')) return 'settings';
      if (p.startsWith('/workspace')) return 'workspace';
      if (p.startsWith('/maps')) return 'maps';
    }
    return 'home';
  };

  const [activeModule, setActiveModule] = useState<AppModule>(getInitialModule);
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [activeSubMenu, setActiveSubMenu] = useState<string | undefined>(undefined);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Listen to browser popstate (back/forward button)
  React.useEffect(() => {
    const handlePopState = () => {
      const mod = getInitialModule();
      setActiveModule(mod);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateModule = useCallback((module: AppModule, subMenu?: string) => {
    setActiveModule(module);
    if (subMenu) {
      setActiveSubMenu(subMenu);
    }
    if (typeof window !== 'undefined') {
      const targetPath = module === 'home' ? '/' : module === 'login' ? '/login' : module === 'dashboard' ? '/dashboard' : `/${module}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const currentUser = useMemo(() => {
    if (userSession?.user) {
      return {
        person_id: userSession.user.id || 'USR-CHAIROT-01',
        name: userSession.user.name || 'ชัยโรจน์ สหัสภูริพัฒน์',
        rank: userSession.user.rank || 'ส.ต.อ.',
        position: userSession.user.position || 'ผบ.หมู่-รอง สว. กก.ตชด.31 ปฏิบัติหน้าที่งานประชาสัมพันธ์ ฝอ.๕ บช.ตชด.',
        department: userSession.user.department || 'ฝ่ายอำนวยการ ๕ บช.ตชด. (งานประชาสัมพันธ์)',
        phone: '02-282-8111',
        email: userSession.user.email || 'chairot.s@royalthaipolice.go.th',
        status: 'ปฏิบัติหน้าที่ปกติ',
        status_text: 'ปฏิบัติหน้าที่ปกติ',
      } as Personnel;
    }

    return {
      person_id: 'USR-CHAIROT-01',
      name: 'ชัยโรจน์ สหัสภูริพัฒน์',
      rank: 'ส.ต.อ.',
      position: 'ผบ.หมู่-รอง สว. กก.ตชด.31 ปฏิบัติหน้าที่งานประชาสัมพันธ์ ฝอ.๕ บช.ตชด.',
      department: 'ฝ่ายอำนวยการ ๕ บช.ตชด. (งานประชาสัมพันธ์)',
      phone: '02-282-8111',
      email: 'chairot.s@royalthaipolice.go.th',
      status: 'ปฏิบัติหน้าที่ปกติ',
      status_text: 'ปฏิบัติหน้าที่ปกติ',
    } as Personnel;
  }, [userSession]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const navigate = useCallback((menu: string, subMenu?: string) => {
    setActiveMenu(menu);
    setActiveSubMenu(subMenu);
    if (menu === 'documents') {
      navigateModule('documents', subMenu);
    } else if (menu === 'calendar') {
      navigateModule('calendar', subMenu);
    } else if (menu === 'duty-roster') {
      navigateModule('duty-roster', subMenu);
    } else if (menu === 'workspace') {
      navigateModule('workspace', subMenu);
    } else if (menu === 'maps') {
      navigateModule('maps', subMenu);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigateModule]);

  const logActivity = useCallback((
    action: string,
    module: ActivityLog['module'],
    details: string,
    type: ActivityLog['type']
  ) => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const date = now.toISOString().slice(0, 10);
    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      time,
      date,
      actor: currentUser.name,
      action,
      module,
      details,
      type,
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 40)]);
  }, [currentUser]);

  const login = useCallback(async (identifier: string, password: string, overrideRole?: Role, rememberMe: boolean = true) => {
    const matchedUser: SystemUser | undefined = await findUserByCredentials(identifier, password);
    if (!matchedUser) {
      return false;
    }

    const assignedRole: DepartmentRole = (overrideRole as DepartmentRole) || matchedUser.role;

    const newSession: UserSession = {
      token: `${SESSION_TOKEN_PREFIX}${Date.now().toString(36).toUpperCase()}`,
      user: {
        id: matchedUser.id,
        username: matchedUser.username,
        name: matchedUser.name,
        rank: matchedUser.rank,
        position: matchedUser.position,
        department: matchedUser.department,
        email: matchedUser.email,
        role: assignedRole,
      },
      loginAt: new Date().toISOString(),
      rememberMe,
      expiresAt: Date.now() + (rememberMe ? 7 * 24 * 60 * 60 * 1000 : 12 * 60 * 60 * 1000),
    };

    setUserSession(newSession);
    setRoleState(assignedRole);
    setIsAuthenticated(true);

    if (rememberMe) {
      localStorage.setItem('sac_session', JSON.stringify(newSession));
      localStorage.setItem('sac_auth', 'true');
      sessionStorage.removeItem('sac_session');
    } else {
      sessionStorage.setItem('sac_session', JSON.stringify(newSession));
      localStorage.setItem('sac_auth', 'true');
      localStorage.removeItem('sac_session');
    }

    logActivity(
      'เข้าสู่ระบบสำเร็จ',
      'ระบบ',
      `ผู้ใช้งาน ${matchedUser.rank} ${matchedUser.name} (${assignedRole}) เข้าสู่ระบบสำเร็จ`,
      'status'
    );

    showToast(`ยินดีต้อนรับ ${matchedUser.rank} ${matchedUser.name}`, 'success');

    // Requirement: Always redirect to central /dashboard after login
    // "สร้างระบบศูนย์กลางที่ใช้ Login เพียงครั้งเดียว และหลัง Login แล้ว ผู้ใช้สามารถเข้าถึงและใช้งานทุกฝ่าย ผ่าน Dashboard เดียวได้ทั้งหมด"
    navigateModule('dashboard');

    return true;
  }, [logActivity, showToast, navigateModule]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUserSession(null);
    localStorage.removeItem('sac_auth');
    localStorage.removeItem('sac_session');
    sessionStorage.removeItem('sac_session');

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '/');
    }

    logActivity('ออกจากระบบ', 'ระบบ', 'ผู้ใช้งานออกจากระบบ', 'status');
    showToast('ออกจากระบบเรียบร้อยแล้ว', 'info');

    // After logout, always return to the public landing page.
    navigateModule('home');
  }, [logActivity, showToast, navigateModule]);

  // Calculate Real-time KPIs
  const kpis = useMemo(() => {
    const totalBudget = budgets.reduce((sum, b) => sum + (b.allocated_amount || 0), 0);
    const spentBudget = budgets.reduce((sum, b) => sum + (b.spent_amount || 0), 0);
    const remainingBudget = budgets.reduce((sum, b) => sum + (b.remaining_amount || 0), 0);
    const committedBudget = budgets.reduce((sum, b) => sum + (b.committed_amount || 0), 0);
    const spentPercentage = totalBudget > 0 ? (spentBudget / totalBudget) * 100 : 0;

    // Current month is 2026-09
    const currentYearMonth = '2026-09';
    const incomingThisMonth = incomingDocs.filter(d => (d.received_date || '').startsWith(currentYearMonth)).length;
    const outgoingThisMonth = outgoingDocs.filter(d => (d.send_date || '').startsWith(currentYearMonth)).length;
    const pendingIncoming = incomingDocs.filter(d => d.status === 'รอดำเนินการ' || d.status === 'รับแล้ว').length;
    const travelThisMonth = travelRecords.filter(t => (t.departure_date || '').startsWith(currentYearMonth)).length;

    const totalMissions = missions.length;
    const activeMissions = missions.filter(m => m.status === 'กำลังดำเนินการ').length;
    const totalMeetings = meetings.length;
    const pendingResolutions = meetings.reduce(
      (acc, m) =>
        acc +
        (m.resolutions?.filter(
          r => r.status === 'ยังไม่ดำเนินการ' || r.status === 'กำลังดำเนินการ' || r.status === 'ล่าช้า'
        ).length || 0),
      0
    );
    const inspectedDocuments = inspections.length;
    const averageInspectionScore = Math.round(
      inspections.reduce((acc, i) => acc + (i.score || 0), 0) / (inspections.length || 1)
    );

    return {
      totalBudget,
      spentBudget,
      remainingBudget,
      committedBudget,
      spentPercentage,
      incomingThisMonth,
      outgoingThisMonth,
      pendingIncoming,
      travelThisMonth,
      totalDocuments: archivalDocs.length,
      totalPersonnel: personnel.length,
      totalUnits: units.length,
      totalMissions,
      activeMissions,
      totalMeetings,
      pendingResolutions,
      inspectedDocuments,
      averageInspectionScore,
    };
  }, [budgets, incomingDocs, outgoingDocs, travelRecords, archivalDocs, personnel, units, missions, meetings, inspections]);

  // Budget CRUD
  const addBudget = useCallback((item: Omit<BudgetItem, 'budget_id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString().slice(0, 10);
    const newId = `BG-${item.fiscal_year}-${String(budgets.length + 1).padStart(3, '0')}`;
    const calculatedRemaining = item.allocated_amount - item.spent_amount;
    const newItem: BudgetItem = {
      ...item,
      budget_id: newId,
      remaining_amount: calculatedRemaining,
      created_at: now,
      updated_at: now,
    };
    setBudgets(prev => [newItem, ...prev]);
    logActivity('เพิ่มรายการงบประมาณ', 'งบประมาณ', `โครงการ: ${item.project_name} วงเงิน ฿${item.allocated_amount.toLocaleString()}`, 'create');
    showToast('บันทึกรายการงบประมาณเรียบร้อยแล้ว');
  }, [budgets.length, logActivity, showToast]);

  const updateBudget = useCallback((item: BudgetItem) => {
    const now = new Date().toISOString().slice(0, 10);
    const calculatedRemaining = item.allocated_amount - item.spent_amount;
    const updated = { ...item, remaining_amount: calculatedRemaining, updated_at: now };
    setBudgets(prev => prev.map(b => (b.budget_id === item.budget_id ? updated : b)));
    logActivity('แก้ไขรายการงบประมาณ', 'งบประมาณ', `ปรับปรุงโครงการ: ${item.project_name}`, 'update');
    showToast('แก้ไขข้อมูลงบประมาณเรียบร้อยแล้ว');
  }, [logActivity, showToast]);

  const deleteBudget = useCallback((id: string) => {
    const target = budgets.find(b => b.budget_id === id);
    setBudgets(prev => prev.filter(b => b.budget_id !== id));
    logActivity('ลบรายการงบประมาณ', 'งบประมาณ', `ลบโครงการรหัส: ${id} (${target?.project_name || ''})`, 'delete');
    showToast('ลบรายการงบประมาณเรียบร้อยแล้ว', 'info');
  }, [budgets, logActivity, showToast]);

  // Travel CRUD
  const addTravel = useCallback((item: Omit<TravelRecord, 'travel_id' | 'created_at'>) => {
    const now = new Date().toISOString().slice(0, 10);
    const newId = `TRV-2569-${String(travelRecords.length + 1).padStart(3, '0')}`;
    const newItem: TravelRecord = {
      ...item,
      travel_id: newId,
      created_at: now,
    };
    setTravelRecords(prev => [newItem, ...prev]);
    logActivity('เพิ่มรายการไปราชการ', 'ไปราชการ', `${item.traveler_name} เดินทางไป ${item.province} (${item.purpose})`, 'create');
    showToast('บันทึกข้อมูลการไปราชการเรียบร้อยแล้ว');
  }, [travelRecords.length, logActivity, showToast]);

  const updateTravel = useCallback((item: TravelRecord) => {
    setTravelRecords(prev => prev.map(t => (t.travel_id === item.travel_id ? item : t)));
    logActivity('แก้ไขข้อมูลไปราชการ', 'ไปราชการ', `อัปเดตรายการเดินทาง: ${item.traveler_name} (${item.province})`, 'update');
    showToast('แก้ไขข้อมูลการไปราชการเรียบร้อยแล้ว');
  }, [logActivity, showToast]);

  const deleteTravel = useCallback((id: string) => {
    const target = travelRecords.find(t => t.travel_id === id);
    setTravelRecords(prev => prev.filter(t => t.travel_id !== id));
    logActivity('ลบรายการไปราชการ', 'ไปราชการ', `ลบรายการเดินทาง: ${target?.traveler_name || id}`, 'delete');
    showToast('ลบรายการไปราชการเรียบร้อยแล้ว', 'info');
  }, [travelRecords, logActivity, showToast]);

  // Incoming Docs CRUD
  const addIncomingDoc = useCallback((item: Omit<IncomingDocument, 'incoming_id' | 'created_at'>) => {
    const now = new Date().toISOString().slice(0, 10);
    const newId = `INC-2569-${String(incomingDocs.length + 1).padStart(3, '0')}`;
    const newItem: IncomingDocument = {
      ...item,
      incoming_id: newId,
      created_at: now,
    };
    setIncomingDocs(prev => [newItem, ...prev]);
    logActivity('ลงทะเบียนหนังสือรับ', 'หนังสือรับ', `เลขที่ ${item.book_number}: ${item.subject}`, 'create');
    showToast('บันทึกหนังสือรับเข้าสู่ระบบเรียบร้อยแล้ว');
  }, [incomingDocs.length, logActivity, showToast]);

  const updateIncomingDoc = useCallback((item: IncomingDocument) => {
    setIncomingDocs(prev => prev.map(d => (d.incoming_id === item.incoming_id ? item : d)));
    logActivity('แก้ไขหนังสือรับ', 'หนังสือรับ', `ปรับปรุงข้อมูลหนังสือเลขที่ ${item.book_number}`, 'update');
    showToast('แก้ไขข้อมูลหนังสือรับเรียบร้อยแล้ว');
  }, [logActivity, showToast]);

  const deleteIncomingDoc = useCallback((id: string) => {
    const target = incomingDocs.find(d => d.incoming_id === id);
    setIncomingDocs(prev => prev.filter(d => d.incoming_id !== id));
    logActivity('ลบหนังสือรับ', 'หนังสือรับ', `ลบหนังสือเลขที่: ${target?.book_number || id}`, 'delete');
    showToast('ลบหนังสือรับเรียบร้อยแล้ว', 'info');
  }, [incomingDocs, logActivity, showToast]);

  // Outgoing Docs CRUD
  const addOutgoingDoc = useCallback((item: Omit<OutgoingDocument, 'outgoing_id' | 'created_at'>) => {
    const now = new Date().toISOString().slice(0, 10);
    const newId = `OUT-2569-${String(outgoingDocs.length + 1).padStart(3, '0')}`;
    const newItem: OutgoingDocument = {
      ...item,
      outgoing_id: newId,
      created_at: now,
    };
    setOutgoingDocs(prev => [newItem, ...prev]);
    logActivity('สร้างหนังสือส่ง', 'หนังสือส่ง', `เลขที่ ${item.book_number}: ${item.subject}`, 'create');
    showToast('บันทึกหนังสือส่งเรียบร้อยแล้ว');
  }, [outgoingDocs.length, logActivity, showToast]);

  const updateOutgoingDoc = useCallback((item: OutgoingDocument) => {
    setOutgoingDocs(prev => prev.map(d => (d.outgoing_id === item.outgoing_id ? item : d)));
    logActivity('แก้ไขหนังสือส่ง', 'หนังสือส่ง', `ปรับปรุงหนังสือส่งเลขที่ ${item.book_number}`, 'update');
    showToast('แก้ไขข้อมูลหนังสือส่งเรียบร้อยแล้ว');
  }, [logActivity, showToast]);

  const deleteOutgoingDoc = useCallback((id: string) => {
    const target = outgoingDocs.find(d => d.outgoing_id === id);
    setOutgoingDocs(prev => prev.filter(d => d.outgoing_id !== id));
    logActivity('ลบหนังสือส่ง', 'หนังสือส่ง', `ลบหนังสือส่งเลขที่: ${target?.book_number || id}`, 'delete');
    showToast('ลบหนังสือส่งเรียบร้อยแล้ว', 'info');
  }, [outgoingDocs, logActivity, showToast]);

  // Archival Documents CRUD
  const addArchivalDoc = useCallback((item: Omit<ArchivalDocument, 'document_id' | 'upload_date'>) => {
    const now = new Date().toISOString().slice(0, 10);
    const safeList = Array.isArray(archivalDocs) ? archivalDocs : [];
    const newId = `DOC-2569-${String(safeList.length + 1).padStart(3, '0')}`;
    const docTitle = item.document_name || item.title || item.document_number;
    const newItem: ArchivalDocument = {
      ...item,
      document_id: newId,
      doc_id: newId,
      title: docTitle,
      document_name: docTitle,
      upload_date: now,
      tags: Array.isArray(item.tags) ? item.tags : [],
    };
    setArchivalDocs(prev => [newItem, ...prev]);
    logActivity('อัปโหลดเอกสารราชการ', 'เอกสาร', `เอกสาร: ${docTitle} (${item.file_name || item.document_number})`, 'upload');
    showToast('อัปโหลดและจัดเก็บเอกสารเรียบร้อยแล้ว');
  }, [archivalDocs, logActivity, showToast]);

  const updateArchivalDoc = useCallback((item: ArchivalDocument) => {
    const targetId = item.document_id || item.doc_id;
    setArchivalDocs(prev => prev.map(d => ((d.document_id || d.doc_id) === targetId ? item : d)));
    const docTitle = item.document_name || item.title || item.document_number;
    logActivity('แก้ไขข้อมูลเอกสาร', 'เอกสาร', `ปรับปรุงเอกสาร: ${docTitle}`, 'update');
    showToast('แก้ไขข้อมูลเอกสารเรียบร้อยแล้ว');
  }, [logActivity, showToast]);

  const deleteArchivalDoc = useCallback((id: string) => {
    const target = archivalDocs.find(d => (d.document_id === id || d.doc_id === id || d.document_number === id));
    setArchivalDocs(prev => prev.filter(d => (d.document_id !== id && d.doc_id !== id && d.document_number !== id)));
    logActivity('ลบเอกสารราชการ', 'เอกสาร', `ลบเอกสาร: ${target?.document_name || target?.title || id}`, 'delete');
    showToast('ลบเอกสารออกจากระบบเรียบร้อยแล้ว', 'info');
  }, [archivalDocs, logActivity, showToast]);

  // Units CRUD
  const addUnit = useCallback((item: Unit) => {
    setUnits(prev => [...prev, item]);
    logActivity('เพิ่มหน่วยงาน', 'หน่วยงาน', `เพิ่มหน่วยงาน: ${item.unit_name} (${item.unit_code})`, 'create');
    showToast('เพิ่มข้อมูลหน่วยงานเรียบร้อยแล้ว');
  }, [logActivity, showToast]);

  const updateUnit = useCallback((item: Unit) => {
    setUnits(prev => prev.map(u => (u.unit_id === item.unit_id ? item : u)));
    logActivity('แก้ไขหน่วยงาน', 'หน่วยงาน', `ปรับปรุงข้อมูลหน่วยงาน: ${item.unit_name}`, 'update');
    showToast('แก้ไขข้อมูลหน่วยงานเรียบร้อยแล้ว');
  }, [logActivity, showToast]);

  const deleteUnit = useCallback((id: string) => {
    setUnits(prev => prev.filter(u => u.unit_id !== id));
    showToast('ลบหน่วยงานเรียบร้อยแล้ว', 'info');
  }, [showToast]);

  // Personnel CRUD
  const addPersonnel = useCallback((item: Personnel) => {
    setPersonnel(prev => [...prev, item]);
    logActivity('เพิ่มข้อมูลบุคลากร', 'หน่วยงาน', `เพิ่ม ${item.rank} ${item.name} (${item.position})`, 'create');
    showToast('เพิ่มข้อมูลบุคลากรเรียบร้อยแล้ว');
  }, [logActivity, showToast]);

  const updatePersonnel = useCallback((item: Personnel) => {
    setPersonnel(prev => prev.map(p => (p.person_id === item.person_id ? item : p)));
    logActivity('แก้ไขข้อมูลบุคลากร', 'หน่วยงาน', `ปรับปรุงข้อมูล ${item.name}`, 'update');
    showToast('แก้ไขข้อมูลบุคลากรเรียบร้อยแล้ว');
  }, [logActivity, showToast]);

  const deletePersonnel = useCallback((id: string) => {
    setPersonnel(prev => prev.filter(p => p.person_id !== id));
    showToast('ลบข้อมูลบุคลากรเรียบร้อยแล้ว', 'info');
  }, [showToast]);

  // Inspections CRUD
  const addInspection = useCallback((item: DocumentInspection) => {
    setInspections(prev => [item, ...prev]);
    logActivity('ตรวจสอบเอกสารด้วย AI', 'เอกสาร', `ตรวจสอบไฟล์: ${item.fileName} คะแนน ${item.score}/100`, 'create');
    showToast(`ตรวจสอบเอกสาร "${item.fileName}" เรียบร้อยแล้ว (คะแนน ${item.score}%)`);
  }, [logActivity, showToast]);

  const updateInspection = useCallback((item: DocumentInspection) => {
    setInspections(prev => prev.map(i => (i.id === item.id ? item : i)));
    logActivity('อัปเดตผลตรวจเอกสาร', 'เอกสาร', `อัปเดตไฟล์: ${item.fileName}`, 'update');
    showToast('ปรับปรุงข้อมูลการตรวจสอบเอกสารเรียบร้อยแล้ว');
  }, [logActivity, showToast]);

  const deleteInspection = useCallback((id: string) => {
    setInspections(prev => prev.filter(i => i.id !== id));
    showToast('ลบรายการตรวจเอกสารเรียบร้อยแล้ว', 'info');
  }, [showToast]);

  // Meetings CRUD
  const addMeeting = useCallback((item: Omit<Meeting, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString().slice(0, 10);
    const newId = `MTG-2569-${String(meetings.length + 1).padStart(2, '0')}`;
    const newMeeting: Meeting = {
      ...item,
      id: newId,
      created_at: now,
      updated_at: now,
    };
    setMeetings(prev => [newMeeting, ...prev]);
    logActivity('บันทึกการประชุมใหม่', 'สารบรรณ', `การประชุม: ${item.title} ครั้งที่ ${item.meeting_number}`, 'create');
    showToast(`บันทึกการประชุม "${item.title}" เรียบร้อยแล้ว`);
  }, [meetings.length, logActivity, showToast]);

  const updateMeeting = useCallback((item: Meeting) => {
    const now = new Date().toISOString().slice(0, 10);
    const updated = { ...item, updated_at: now };
    setMeetings(prev => prev.map(m => (m.id === item.id ? updated : m)));
    logActivity('แก้ไขบันทึกการประชุม', 'สารบรรณ', `อัปเดต: ${item.title}`, 'update');
    showToast('แก้ไขข้อมูลการประชุมเรียบร้อยแล้ว');
  }, [logActivity, showToast]);

  const deleteMeeting = useCallback((id: string) => {
    setMeetings(prev => prev.filter(m => m.id !== id));
    showToast('ลบรายการประชุมเรียบร้อยแล้ว', 'info');
  }, [showToast]);

  const addMeetingResolution = useCallback((meetingId: string, res: Omit<MeetingResolution, 'resolution_id'>) => {
    const resId = `RES-2569-${Date.now().toString().slice(-4)}`;
    const newResolution: MeetingResolution = {
      ...res,
      resolution_id: resId,
    };
    setMeetings(prev =>
      prev.map(m => {
        if (m.id === meetingId) {
          return {
            ...m,
            resolutions: [...(m.resolutions || []), newResolution],
            updated_at: new Date().toISOString().slice(0, 10),
          };
        }
        return m;
      })
    );
    showToast('เพิ่มมติที่ประชุมใหม่เรียบร้อยแล้ว');
  }, [showToast]);

  const updateMeetingResolution = useCallback((resolution: MeetingResolution) => {
    setMeetings(prev =>
      prev.map(m => {
        if (m.id === resolution.meeting_id) {
          return {
            ...m,
            resolutions: (m.resolutions || []).map(r =>
              r.resolution_id === resolution.resolution_id ? resolution : r
            ),
            updated_at: new Date().toISOString().slice(0, 10),
          };
        }
        return m;
      })
    );
    showToast('อัปเดตสถานะมติที่ประชุมเรียบร้อยแล้ว');
  }, [showToast]);

  const deleteMeetingResolution = useCallback((meetingId: string, resolutionId: string) => {
    setMeetings(prev =>
      prev.map(m => {
        if (m.id === meetingId) {
          return {
            ...m,
            resolutions: (m.resolutions || []).filter(r => r.resolution_id !== resolutionId),
            updated_at: new Date().toISOString().slice(0, 10),
          };
        }
        return m;
      })
    );
    showToast('ลบมติที่ประชุมเรียบร้อยแล้ว', 'info');
  }, [showToast]);

  // Mission Conflicts Checker
  const checkMissionConflicts = useCallback((
    personnelIds: string[],
    startDate: string,
    endDate: string,
    excludeMissionId?: string
  ): MissionConflictResult[] => {
    const conflicts: MissionConflictResult[] = [];
    if (!startDate || !endDate || !personnelIds || personnelIds.length === 0) return conflicts;

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    missions.forEach(mission => {
      if (excludeMissionId && mission.id === excludeMissionId) return;
      if (mission.status === 'ยกเลิก') return;

      const mStart = new Date(mission.startDate).getTime();
      const mEnd = new Date(mission.endDate).getTime();

      // Check date range overlap: start <= mEnd && end >= mStart
      const overlaps = start <= mEnd && end >= mStart;
      if (overlaps) {
        personnelIds.forEach(pId => {
          const isCommander = mission.commanderId === pId;
          const isMember = mission.personnelIds?.includes(pId);
          if (isCommander || isMember) {
            const pObj = personnel.find(p => p.person_id === pId);
            conflicts.push({
              personId: pId,
              personName: pObj?.name || pId,
              conflictingMission: mission,
            });
          }
        });
      }
    });

    return conflicts;
  }, [missions, personnel]);

  // Missions CRUD
  const addMission = useCallback((item: Omit<Mission, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString().slice(0, 10);
    const newId = `MS-2569-${String(missions.length + 1).padStart(3, '0')}`;
    const unit = units.find(u => u.unit_id === item.unitId);
    const newMission: Mission = {
      ...item,
      id: newId,
      missionCode: item.missionCode || newId,
      unitName: item.unitName || unit?.name || 'ฝ่ายอำนวยการ',
      createdAt: now,
      updatedAt: now,
    };
    setMissions(prev => [newMission, ...prev]);
    logActivity('มอบหมายภารกิจราชการ', 'ไปราชการ', `ภารกิจ: ${item.missionName} ณ จ.${item.province} (${item.personnelIds.length} นาย)`, 'create');
    showToast(`สร้างภารกิจ "${item.missionName}" เรียบร้อยแล้ว`);
  }, [missions.length, units, logActivity, showToast]);

  const updateMission = useCallback((item: Mission) => {
    const now = new Date().toISOString().slice(0, 10);
    const updated = { ...item, updatedAt: now };
    setMissions(prev => prev.map(m => (m.id === item.id ? updated : m)));
    logActivity('ปรับปรุงข้อมูลภารกิจ', 'ไปราชการ', `อัปเดตภารกิจ: ${item.missionName} (สถานะ: ${item.status})`, 'update');
    showToast('ปรับปรุงข้อมูลภารกิจเรียบร้อยแล้ว');
  }, [logActivity, showToast]);

  const deleteMission = useCallback((id: string) => {
    setMissions(prev => prev.filter(m => m.id !== id));
    showToast('ลบรายการภารกิจเรียบร้อยแล้ว', 'info');
  }, [showToast]);

  // Notifications
  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('ทำเครื่องหมายว่าอ่านทั้งหมดแล้ว');
  }, [showToast]);

  const resetAllData = useCallback(() => {
    setBudgets(initialBudgets);
    setTravelRecords(initialTravelRecords);
    setIncomingDocs(initialIncomingDocs);
    setOutgoingDocs(initialOutgoingDocs);
    setArchivalDocs(initialArchivalDocs);
    setUnits(initialUnits);
    setPersonnel(initialPersonnel);
    setNotifications(initialNotifications);
    setActivityLogs(initialActivityLogs);
    setInspections(initialInspections);
    setMeetings(initialMeetings);
    setMissions(initialMissions);
    showToast('รีเซ็ตข้อมูลตัวอย่างกลับเป็นค่าเริ่มต้นแล้ว', 'info');
  }, [showToast]);

  const clearLogs = useCallback(() => {
    setActivityLogs([]);
    showToast('ล้างประวัติการใช้งานทั้งหมดเรียบร้อยแล้ว', 'info');
  }, [showToast]);

  return (
    <AdminContext.Provider
      value={{
        budgets,
        travelRecords,
        incomingDocs,
        outgoingDocs,
        archivalDocs,
        units,
        personnel,
        activityLogs,
        logs: activityLogs,
        clearLogs,
        notifications,
        inspections,
        meetings,
        missions,
        currentRole,
        currentUser,
        isAuthenticated,
        userSession,
        isLoginModalOpen,
        setIsLoginModalOpen,
        login,
        logout,
        activeMenu,
        activeSubMenu,
        activeModule,
        navigateModule,
        toasts,
        navigate,
        setRole: setRoleState,
        showToast,
        removeToast,
        kpis,
        addBudget,
        updateBudget,
        deleteBudget,
        addTravel,
        updateTravel,
        deleteTravel,
        addIncomingDoc,
        updateIncomingDoc,
        deleteIncomingDoc,
        addOutgoingDoc,
        updateOutgoingDoc,
        deleteOutgoingDoc,
        addArchivalDoc,
        updateArchivalDoc,
        deleteArchivalDoc,
        addUnit,
        updateUnit,
        deleteUnit,
        addPersonnel,
        updatePersonnel,
        deletePersonnel,
        addInspection,
        updateInspection,
        deleteInspection,
        addMeeting,
        updateMeeting,
        deleteMeeting,
        addMeetingResolution,
        updateMeetingResolution,
        deleteMeetingResolution,
        addMission,
        updateMission,
        deleteMission,
        checkMissionConflicts,
        markNotificationRead,
        markAllNotificationsRead,
        resetAllData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
