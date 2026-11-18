import { NewsItem, MediaItem, RelationsStats, NewsStatus } from '../types';
import { getCollectionStore } from '../../../lib/collections';

const newsStore = getCollectionStore<NewsItem>('relations.news');
const mediaStore = getCollectionStore<MediaItem>('relations.media');


type Listener = () => void;

class RelationsService {
  private news: NewsItem[] = [];
  private media: MediaItem[] = [];
  private listeners: Listener[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const sync = () => {
      this.news = structuredClone(newsStore.items);
      this.media = structuredClone(mediaStore.items);
      this.listeners.forEach(l => l());
    };
    newsStore.subscribe(sync);
    mediaStore.subscribe(sync);
    newsStore.ensureLoaded();
    mediaStore.ensureLoaded();
    sync();
  }

  private saveToStorage(): void {
    void newsStore.set(structuredClone(this.news));
    void mediaStore.set(structuredClone(this.media));
  }

  private notify(): void {
    this.saveToStorage();
    this.listeners.forEach(l => l());
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // --- News Methods ---
  public getNews(): NewsItem[] {
    return [...this.news];
  }

  public getPublishedNews(): NewsItem[] {
    return this.news.filter(n => n.status === 'Published');
  }

  public getFeaturedNews(): NewsItem[] {
    return this.news.filter(n => n.status === 'Published' && n.isFeatured);
  }

  public getNewsById(id: string): NewsItem | undefined {
    return this.news.find(n => n.id === id);
  }

  public createNews(item: Omit<NewsItem, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>): NewsItem {
    const nextNum = Date.now() % 1000000;
    const year = 2569;
    const padded = String(nextNum).padStart(6, '0');
    const newId = `NEWS-${year}-${padded}`;

    const nowIso = new Date().toISOString();
    const newItem: NewsItem = {
      ...item,
      id: newId,
      createdAt: nowIso,
      updatedAt: nowIso,
      views: 0,
      likes: 0,
    };

    this.news.unshift(newItem);
    this.notify();
    return newItem;
  }

  public updateNews(id: string, updates: Partial<NewsItem>): NewsItem | undefined {
    const idx = this.news.findIndex(n => n.id === id);
    if (idx === -1) return undefined;

    this.news[idx] = {
      ...this.news[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.notify();
    return this.news[idx];
  }

  public deleteNews(id: string): boolean {
    const initialLen = this.news.length;
    this.news = this.news.filter(n => n.id !== id);
    if (this.news.length !== initialLen) {
      this.notify();
      return true;
    }
    return false;
  }

  public publishNews(id: string): boolean {
    return !!this.updateNews(id, { status: 'Published' });
  }

  public unpublishNews(id: string): boolean {
    return !!this.updateNews(id, { status: 'Draft' });
  }

  public setStatus(id: string, status: NewsStatus): boolean {
    return !!this.updateNews(id, { status });
  }

  public incrementViews(id: string): void {
    const item = this.news.find(n => n.id === id);
    if (item) {
      item.views += 1;
      this.notify();
    }
  }

  public toggleLike(id: string): void {
    const item = this.news.find(n => n.id === id);
    if (item) {
      item.likes += 1;
      this.notify();
    }
  }

  // --- Media Methods ---
  public getMedia(): MediaItem[] {
    return [...this.media];
  }

  public addMedia(item: Omit<MediaItem, 'id' | 'downloadCount' | 'uploadedAt'>): MediaItem {
    const nextNum = Date.now() % 1000000;
    const padded = String(nextNum).padStart(6, '0');
    const newId = `MED-${padded}`;

    const newMedia: MediaItem = {
      ...item,
      id: newId,
      uploadedAt: new Date().toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      downloadCount: 0,
    };

    this.media.unshift(newMedia);
    this.notify();
    return newMedia;
  }

  public deleteMedia(id: string): boolean {
    const initialLen = this.media.length;
    this.media = this.media.filter(m => m.id !== id);
    if (this.media.length !== initialLen) {
      this.notify();
      return true;
    }
    return false;
  }

  // --- Stats Calculation ---
  public getStats(): RelationsStats {
    const totalNews = this.news.length;
    const publishedCount = this.news.filter(n => n.status === 'Published').length;
    const draftCount = this.news.filter(n => n.status === 'Draft').length;
    const pendingCount = this.news.filter(n => n.status === 'Pending').length;
    const totalMedia = this.media.length;
    const announcementsCount = this.news.filter(
      n => n.category === 'ประกาศทางการ' && n.status === 'Published'
    ).length;
    const totalViews = this.news.reduce((acc, n) => acc + (n.views || 0), 0);

    return {
      totalNews,
      publishedCount,
      draftCount,
      pendingCount,
      totalMedia,
      announcementsCount,
      totalViews,
    };
  }
}

export const relationsService = new RelationsService();
