export type NewsStatus = 'Draft' | 'Pending' | 'Published' | 'Archived';

export type NewsCategory =
  | 'ข่าวสารทั่วไป'
  | 'กิจกรรมและโครงการ'
  | 'ประชาสัมพันธ์'
  | 'ประกาศทางการ'
  | 'ภารกิจผู้บริหาร'
  | 'อื่น ๆ';

export interface NewsAttachment {
  id: string;
  name: string;
  url: string;
  size: string;
  type: 'pdf' | 'document' | 'image' | 'sheet';
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string; // e.g. '10 ก.ย. 2569'
  createdAt: string;
  updatedAt: string;
  author: string;
  category: NewsCategory;
  coverImage: string;
  gallery: string[];
  attachments: NewsAttachment[];
  status: NewsStatus;
  isFeatured: boolean;
  views: number;
  likes: number;
  tags: string[];
}

export type MediaType = 'image' | 'video' | 'pdf' | 'document';

export type MediaCategory =
  | 'ข่าว'
  | 'กิจกรรม'
  | 'ประชาสัมพันธ์'
  | 'ประกาศ'
  | 'ภารกิจ'
  | 'อื่น ๆ';

export interface MediaItem {
  id: string;
  name: string;
  type: MediaType;
  category: MediaCategory;
  url: string;
  thumbnail?: string;
  size: string;
  dimensions?: string;
  duration?: string;
  uploadedAt: string;
  uploadedBy: string;
  downloadCount: number;
}

export interface RelationsStats {
  totalNews: number;
  publishedCount: number;
  draftCount: number;
  pendingCount: number;
  totalMedia: number;
  announcementsCount: number;
  totalViews: number;
}

export type RelationsActiveTab = 'operations' | 'year-plan' | 'management' | 'media' | 'public';
