import { NewsItem, MediaItem } from '../types';

export const initialNewsList: NewsItem[] = [];

export const initialMediaList: MediaItem[] = [];

export interface MonitoredPage {
  id: string;
  name: string;
  followers: number;
  postsToday: number;
}

/** Lightweight mock list for the "การติดตามเพจ Facebook" dashboard widget. */
export const initialMonitoredPages: MonitoredPage[] = [];
