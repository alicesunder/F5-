export type SentimentType = 'positive' | 'neutral' | 'negative';
export type PriorityLevel = 'high' | 'medium' | 'low';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'info';

export type CategoryType =
  | 'ความมั่นคงชายแดน'
  | 'ยาเสพติด'
  | 'จิตอาสา/ช่วยเหลือ'
  | 'การศึกษา/ครู ตชด.'
  | 'ภัยพิบัติ'
  | 'กิจกรรมองค์กร'
  | 'ทั่วไป';

export type PostCategory = CategoryType;
export type KeywordPriority = 'urgent' | 'high' | 'medium' | 'normal' | 'low';

export interface PostItem {
  id: string;
  pageId: string;
  pageName: string;
  pageAvatar: string;
  isVerified: boolean;
  timestamp: string;
  minutesAgo: number;
  content: string;
  imageUrl?: string;
  keywords: string[];
  matchedKeywords?: string[];
  category: CategoryType;
  sentiment: SentimentType;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  isImportant: boolean;
  bppRelated: boolean;
  sourceUrl: string;
  aiSummary?: string;
  reachEstimate?: number;
  relatedMissionId?: string;
  relatedMissionCode?: string;
  relatedOfficer?: string;
}

export type MissionStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
export type MissionPriority = 'urgent' | 'high' | 'medium' | 'low';
export type MissionCategory =
  | 'พิธีการและต้อนรับ'
  | 'ตรวจเยี่ยมหน่วย'
  | 'จิตอาสาพระราชทาน'
  | 'ช่วยเหลือผู้ประสบภัย'
  | 'กิจกรรมโรงเรียน ตชด.'
  | 'ลาดตระเวนชายแดน'
  | 'แถลงข่าวและประชาสัมพันธ์'
  | 'ฝึกอบรมและสัมมนา';

export interface PhotoMission {
  id: string; // e.g. "PH-001"
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  displayDate: string; // e.g. "7 ก.ย. 69"
  startTime: string; // e.g. "09:00"
  endTime: string; // e.g. "11:30"
  location: string;
  province: string;
  gpsCoordinates?: string;
  personnelId: string;
  personnelName: string;
  personnelRank: string;
  teamCount: number;
  category: MissionCategory;
  priority: MissionPriority;
  status: MissionStatus;
  notes?: string;
  deliverablesRequired: number;
  deliverablesDelivered: number;
  deliverablesPhotos: string[];
  timeline: {
    time: string;
    activity: string;
    completed: boolean;
  }[];
  relatedPostId?: string;
  relatedPostTitle?: string;
}

export interface Personnel {
  id: string;
  name: string;
  rank: string;
  position: string;
  unit: string;
  avatar: string;
  phone: string;
  email?: string;
  totalMissions: number;
  completedMissions: number;
  inProgressMissions?: number;
  activeMissions?: number;
  pendingMissions: number;
  specialty: string;
}

export interface MissionLocation {
  id: string;
  name: string;
  province: string;
  region: string;
  unit?: string;
  gpsCoordinates?: string;
  totalMissions: number;
  latestMission: string;
  assignedOfficer: string;
  coordinates: { x: number; y: number };
}

export type DocType =
  | 'หนังสือภายนอก'
  | 'หนังสือภายใน'
  | 'คำสั่ง'
  | 'ระเบียบ/ข้อบังคับ'
  | 'ประกาศ'
  | 'บันทึกข้อความ'
  | 'รายงานการประชุม'
  | 'ข่าวแจกสื่อมวลชน'
  | 'เอกสารเผยแพร่'
  | 'แบบฟอร์มขออนุมัติ'
  | 'รายงานสถานการณ์'
  | 'แผนปฏิบัติการ';

export type DocStatus =
  | 'pending'
  | 'scanning'
  | 'passed'
  | 'approved'
  | 'review_required'
  | 'rejected'
  | 'error';

export interface GovDocument {
  id: string;
  docNumber: string;
  title: string;
  type: DocType;
  date: string;
  displayDate: string;
  sender: string;
  receiver: string;
  recipient?: string;
  signatory: string;
  signatoryPosition?: string;
  speedClass?: string;
  secretClass?: string;
  aiScore: number;
  scoreBreakdown?: {
    ocrAccuracy: number;
    requiredFields: number;
    formatting: number;
    completeness: number;
  };
  status: DocStatus;
  reviewer?: string;
  aiSummary?: string;
  summary?: string;
  ocrRawText?: string;
  ocrText?: string;
  aiVerdict?: string;
  issuesCount?: number;
  issuesList?: { category: string; description: string; suggestion?: string }[];
  detectedEntities?: {
    date: string;
    docNumber: string;
    subject: string;
    organization: string;
    receiver: string;
    signatory: string;
    urgency?: string;
    attachments?: string;
  };
  validationIssues?: {
    type: 'pass' | 'warning' | 'error';
    message: string;
    field: string;
  }[];
  checklist?: {
    name: string;
    status: 'pass' | 'warning' | 'missing';
    note?: string;
  }[];
  activityLog?: {
    time: string;
    action: string;
    operator: string;
  }[];
  fileSize?: string;
  fileFormat?: string;
  previewImageUrl?: string;
  uploadTimestamp?: string;
}

export interface MonitoredPage {
  id: string;
  name: string;
  handle: string;
  category: string;
  avatar: string;
  followers: number;
  postsToday: number;
  bppPostsToday: number;
  latestPostMinutesAgo: number;
  engagement: number;
  averageEngagement: number;
  status: 'monitoring' | 'watch_list' | 'paused';
  verified: boolean;
  history7Days: {
    day: string;
    totalPosts: number;
    bppPosts: number;
    engagement: number;
  }[];
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface MonitoredKeyword {
  id: string;
  keyword: string;
  description: string;
  mentionCount: number;
  trendPercentage: number;
  latestPostTime: string;
  pagesCount: number;
  priority: 'urgent' | 'high' | 'medium' | 'normal';
  color: string;
  notificationEnabled: boolean;
}

export interface AlertItem {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  pageName?: string;
  postId?: string;
  timestamp: string;
  minutesAgo: number;
  keyword?: string;
  read: boolean;
}
