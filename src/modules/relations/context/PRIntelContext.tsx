import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MonitoredPage,
  PostItem,
  MonitoredKeyword,
  AlertItem,
  PhotoMission,
  Personnel,
  MissionLocation,
  GovDocument,
  MissionStatus,
  DocStatus,
} from '../types/bppTypes';
import {
  INITIAL_PAGES,
  INITIAL_KEYWORDS,
  INITIAL_POSTS,
  INITIAL_ALERTS,
} from '../data/bppIntelData';
import {
  ALL_INITIAL_MISSIONS,
  INITIAL_PERSONNEL,
  INITIAL_LOCATIONS,
} from '../data/missionsData';
import { INITIAL_DOCUMENTS } from '../data/documentsData';
import { PRViewId } from '../components/PRMonitoringSidebar';
import { useAdmin } from '../../../contexts/AdminContext';

interface PRIntelContextType {
  // Navigation
  activePRView: PRViewId;
  setActivePRView: (view: PRViewId) => void;

  // Data
  pages: MonitoredPage[];
  posts: PostItem[];
  keywords: MonitoredKeyword[];
  alerts: AlertItem[];
  missions: PhotoMission[];
  personnel: Personnel[];
  locations: MissionLocation[];
  documents: GovDocument[];

  // Selected Entities
  selectedPageId: string | null;
  setSelectedPageId: (id: string | null) => void;
  selectedPost: PostItem | null;
  setSelectedPost: (post: PostItem | null) => void;
  selectedMission: PhotoMission | null;
  setSelectedMission: (m: PhotoMission | null) => void;
  selectedDocument: GovDocument | null;
  setSelectedDocument: (doc: GovDocument | null) => void;

  // Search & Simulation
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
  isSimulating: boolean;
  toggleSimulation: () => void;

  // Modals
  isAddMissionOpen: boolean;
  setIsAddMissionOpen: (open: boolean) => void;
  prefilledMissionData: Partial<PhotoMission> | null;
  setPrefilledMissionData: (data: Partial<PhotoMission> | null) => void;
  isAddKeywordOpen: boolean;
  setIsAddKeywordOpen: (open: boolean) => void;
  isAddPageOpen: boolean;
  setIsAddPageOpen: (open: boolean) => void;

  // Actions
  unreadAlertsCount: number;
  markAlertAsRead: (id: string) => void;
  markAllAlertsAsRead: () => void;
  addKeyword: (kw: Partial<MonitoredKeyword>) => void;
  addPage: (pg: Partial<MonitoredPage>) => void;
  addMission: (mission: Omit<PhotoMission, 'id'>) => void;
  updateMissionStatus: (id: string, status: MissionStatus) => void;
  updateMissionDeliverables: (id: string, count: number) => void;
  addDocument: (doc: GovDocument) => void;
  updateDocumentStatus: (id: string, status: DocStatus) => void;
}

const PRIntelContext = createContext<PRIntelContextType | undefined>(undefined);

export const PRIntelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useAdmin();

  const [activePRView, setActivePRView] = useState<PRViewId>('dashboard');
  const [pages, setPages] = useState<MonitoredPage[]>(INITIAL_PAGES);
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);
  const [keywords, setKeywords] = useState<MonitoredKeyword[]>(INITIAL_KEYWORDS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [missions, setMissions] = useState<PhotoMission[]>(ALL_INITIAL_MISSIONS);
  const [personnel, setPersonnel] = useState<Personnel[]>(INITIAL_PERSONNEL);
  const [locations, setLocations] = useState<MissionLocation[]>(INITIAL_LOCATIONS);
  const [documents, setDocuments] = useState<GovDocument[]>(INITIAL_DOCUMENTS);

  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [selectedMission, setSelectedMission] = useState<PhotoMission | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<GovDocument | null>(null);

  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState(true);

  const [isAddMissionOpen, setIsAddMissionOpen] = useState(false);
  const [prefilledMissionData, setPrefilledMissionData] = useState<Partial<PhotoMission> | null>(null);
  const [isAddKeywordOpen, setIsAddKeywordOpen] = useState(false);
  const [isAddPageOpen, setIsAddPageOpen] = useState(false);

  // Live timer simulation
  useEffect(() => {
    if (!isSimulating) return;
    const timer = setInterval(() => {
      setPosts((prev) =>
        prev.map((p) => ({
          ...p,
          minutesAgo: p.minutesAgo + 0.2,
        }))
      );
      setAlerts((prev) =>
        prev.map((a) => ({
          ...a,
          minutesAgo: a.minutesAgo + 0.2,
        }))
      );
    }, 15000);
    return () => clearInterval(timer);
  }, [isSimulating]);

  const toggleSimulation = () => {
    setIsSimulating((prev) => {
      const next = !prev;
      showToast(next ? 'เปิดระบบ Real-time Stream ข่าวสาร' : 'หยุดสัญญาณ Real-time ชั่วคราว', 'info');
      return next;
    });
  };

  const markAlertAsRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const markAllAlertsAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
    showToast('อ่านการแจ้งเตือนทั้งหมดแล้ว', 'success');
  };

  const addKeyword = (kw: Partial<MonitoredKeyword>) => {
    const newKw: MonitoredKeyword = {
      id: `k-${Date.now()}`,
      keyword: kw.keyword || 'คำค้นใหม่',
      description: kw.description || 'คำค้นติดตามโดยเจ้าหน้าที่ ฝอ.5',
      mentionCount: Math.floor(Math.random() * 20) + 5,
      trendPercentage: Math.floor(Math.random() * 30) + 10,
      latestPostTime: 'เมื่อสักครู่',
      pagesCount: Math.floor(Math.random() * 8) + 2,
      priority: kw.priority || 'medium',
      color: kw.color || '#2563EB',
      notificationEnabled: kw.notificationEnabled ?? true,
    };
    setKeywords((prev) => [newKw, ...prev]);
    showToast(`เพิ่ม Keyword "${newKw.keyword}" เรียบร้อยแล้ว`, 'success');
  };

  const addPage = (pg: Partial<MonitoredPage>) => {
    const newPg: MonitoredPage = {
      id: `p-${Date.now()}`,
      name: pg.name || 'เพจติดตามใหม่',
      handle: pg.handle || '@newpage',
      category: pg.category || 'ความมั่นคงชายแดน',
      avatar: pg.avatar || 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=120&auto=format&fit=crop&q=80',
      followers: pg.followers || 50000,
      postsToday: 5,
      bppPostsToday: 2,
      latestPostMinutesAgo: 1,
      engagement: 1200,
      averageEngagement: 300,
      status: 'monitoring',
      verified: pg.verified ?? false,
      history7Days: [
        { day: 'จันทร์', totalPosts: 4, bppPosts: 1, engagement: 900 },
        { day: 'อังคาร', totalPosts: 5, bppPosts: 2, engagement: 1100 },
        { day: 'พุธ', totalPosts: 4, bppPosts: 1, engagement: 950 },
        { day: 'พฤหัส', totalPosts: 6, bppPosts: 2, engagement: 1300 },
        { day: 'ศุกร์', totalPosts: 7, bppPosts: 3, engagement: 1500 },
        { day: 'เสาร์', totalPosts: 5, bppPosts: 2, engagement: 1050 },
        { day: 'อาทิตย์', totalPosts: 5, bppPosts: 2, engagement: 1200 },
      ],
      sentimentBreakdown: { positive: 60, neutral: 30, negative: 10 },
    };
    setPages((prev) => [newPg, ...prev]);
    showToast(`เพิ่มเพจ "${newPg.name}" เข้าระบบติดตามแล้ว`, 'success');
  };

  const addMission = (m: Omit<PhotoMission, 'id'>) => {
    const nextNum = missions.length + 1;
    const newId = `PH-${nextNum < 10 ? '00' : nextNum < 100 ? '0' : ''}${nextNum}`;
    const newMission: PhotoMission = {
      ...m,
      id: newId,
      deliverablesDelivered: m.deliverablesDelivered ?? 0,
      deliverablesPhotos: m.deliverablesPhotos ?? [],
      timeline: m.timeline?.length
        ? m.timeline
        : [
            { time: m.startTime || '09:00', activity: 'เริ่มปฏิบัติภารกิจ', completed: false },
            { time: m.endTime || '12:00', activity: 'สรุปส่งไฟล์ภาพ', completed: false },
          ],
    };
    setMissions((prev) => [newMission, ...prev]);
    showToast(`ลงทะเบียนภารกิจ [${newId}] "${newMission.title}" เรียบร้อยแล้ว`, 'success');
  };

  const updateMissionStatus = (id: string, status: MissionStatus) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const isComp = status === 'completed';
          return {
            ...m,
            status,
            deliverablesDelivered: isComp ? m.deliverablesRequired : m.deliverablesDelivered,
          };
        }
        return m;
      })
    );
    showToast(`อัปเดตสถานะภารกิจ ${id} เรียบร้อยแล้ว`, 'success');
  };

  const updateMissionDeliverables = (id: string, count: number) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = Math.min(m.deliverablesRequired, count);
          const isComp = updated >= m.deliverablesRequired;
          return {
            ...m,
            deliverablesDelivered: updated,
            status: isComp ? 'completed' : m.status,
          };
        }
        return m;
      })
    );
    showToast(`อัปเดตไฟล์ส่งมอบภารกิจ ${id} สำเร็จ`, 'success');
  };

  const addDocument = (doc: GovDocument) => {
    setDocuments((prev) => [doc, ...prev]);
    showToast(`สแกนเอกสาร ${doc.docNumber} บันทึกสำเร็จ`, 'success');
  };

  const updateDocumentStatus = (id: string, status: DocStatus) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
    showToast(`เปลี่ยนสถานะเอกสารเป็น "${status}" เรียบร้อยแล้ว`, 'success');
  };

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  return (
    <PRIntelContext.Provider
      value={{
        activePRView,
        setActivePRView,
        pages,
        posts,
        keywords,
        alerts,
        missions,
        personnel,
        locations,
        documents,
        selectedPageId,
        setSelectedPageId,
        selectedPost,
        setSelectedPost,
        selectedMission,
        setSelectedMission,
        selectedDocument,
        setSelectedDocument,
        globalSearchQuery,
        setGlobalSearchQuery,
        isSimulating,
        toggleSimulation,
        isAddMissionOpen,
        setIsAddMissionOpen,
        prefilledMissionData,
        setPrefilledMissionData,
        isAddKeywordOpen,
        setIsAddKeywordOpen,
        isAddPageOpen,
        setIsAddPageOpen,
        unreadAlertsCount,
        markAlertAsRead,
        markAllAlertsAsRead,
        addKeyword,
        addPage,
        addMission,
        updateMissionStatus,
        updateMissionDeliverables,
        addDocument,
        updateDocumentStatus,
      }}
    >
      {children}
    </PRIntelContext.Provider>
  );
};

export const usePRIntel = () => {
  const context = useContext(PRIntelContext);
  if (!context) {
    throw new Error('usePRIntel must be used within a PRIntelProvider');
  }
  return context;
};
