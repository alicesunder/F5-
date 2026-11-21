import React, { useState, useEffect } from 'react';
import { IncomingRegisterPage } from '../incoming/IncomingRegisterPage';
import { YearPlanView } from '../yearplan/YearPlanView';
import { consumeYearPlanTab } from '../yearplan/yearPlan';
import { useAdmin } from '../../contexts/AdminContext';
import {
  NewsItem,
  MediaItem,
  RelationsStats,
  RelationsActiveTab,
  NewsStatus,
} from './types';
import { relationsService } from './services/relationsService';
import { RelationsHeader } from './components/RelationsHeader';
import { RelationsSummaryCards } from './components/RelationsSummaryCards';
import { NewsManagement } from './components/NewsManagement';
import { NewsFormModal } from './components/NewsFormModal';
import { NewsDetailModal } from './components/NewsDetailModal';
import { MediaLibrary } from './components/MediaLibrary';
import { MediaUploadModal } from './components/MediaUploadModal';
import { PublicNewsPortal } from './components/PublicNewsPortal';
import { PRMonitoringSidebar } from './components/PRMonitoringSidebar';
import { PRWorkspaceView } from './components/PRWorkspaceView';
import { PRIntelProvider, usePRIntel } from './context/PRIntelContext';

const RelationsContent: React.FC = () => {
  const { showToast } = useAdmin();
  const { activePRView, setActivePRView } = usePRIntel();

  // Navigation tab in Relations Module - default to operations center!
  const [activeTab, setActiveTab] = useState<RelationsActiveTab>(() => (consumeYearPlanTab('relations') ? 'year-plan' : 'operations'));

  // Data from Service
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [stats, setStats] = useState<RelationsStats>(relationsService.getStats());

  // Filter pass-through from Summary cards
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<NewsStatus | 'all'>('all');

  // Modals state
  const [isCreateNewsOpen, setIsCreateNewsOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [detailNews, setDetailNews] = useState<NewsItem | null>(null);
  const [isUploadMediaOpen, setIsUploadMediaOpen] = useState(false);

  // กลับมาจากหน้าอนุญาตของ Facebook: เปิดหน้าเพจ Facebook
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('fb')) {
      setActiveTab('operations');
      setActivePRView('facebook');
    }
  }, [setActivePRView]);

  // Subscribe to service changes
  useEffect(() => {
    const syncData = () => {
      setNewsList(relationsService.getNews());
      setMediaList(relationsService.getMedia());
      setStats(relationsService.getStats());
    };

    syncData();
    const unsubscribe = relationsService.subscribe(syncData);
    return () => unsubscribe();
  }, []);

  // Handlers for News
  const handleCreateOrUpdateNews = (newsData: any) => {
    if (editingNews) {
      relationsService.updateNews(editingNews.id, newsData);
      showToast(`แก้ไขข่าว "${newsData.title}" สำเร็จ`, 'success');
      setEditingNews(null);
    } else {
      const created = relationsService.createNews(newsData);
      showToast(`สร้างข่าวประชาสัมพันธ์ "${created.title}" เรียบร้อยแล้ว`, 'success');
    }
  };

  const handleDeleteNews = (id: string) => {
    const item = relationsService.getNewsById(id);
    if (relationsService.deleteNews(id)) {
      showToast(`ลบข่าว "${item?.title || id}" เรียบร้อยแล้ว`, 'info');
      if (detailNews?.id === id) {
        setDetailNews(null);
      }
    }
  };

  const handlePublishNews = (id: string) => {
    relationsService.publishNews(id);
    showToast('เผยแพร่ข่าวสู่สาธารณะแล้ว', 'success');
  };

  const handleUnpublishNews = (id: string) => {
    relationsService.unpublishNews(id);
    showToast('ยกเลิกการเผยแพร่ข่าวแล้ว (เปลี่ยนเป็นฉบับร่าง)', 'info');
  };

  const handleStatusChange = (id: string, status: NewsStatus) => {
    relationsService.setStatus(id, status);
    showToast(`อัปเดตสถานะข่าวเป็น ${status} แล้ว`, 'success');
  };

  const handleSelectNews = (news: NewsItem) => {
    relationsService.incrementViews(news.id);
    setDetailNews(news);
  };

  const handleLikeNews = (id: string) => {
    relationsService.toggleLike(id);
    if (detailNews?.id === id) {
      setDetailNews((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : null));
    }
  };

  // Handlers for Media
  const handleUploadMedia = (mediaData: any) => {
    const created = relationsService.addMedia(mediaData);
    showToast(`เพิ่มไฟล์สื่อ "${created.name}" เรียบร้อยแล้ว`, 'success');
  };

  const handleDeleteMedia = (id: string) => {
    if (relationsService.deleteMedia(id)) {
      showToast('ลบไฟล์สื่อออกจากคลังแล้ว', 'info');
    }
  };

  return (
    <div className="min-h-screen iridescent-ambient text-[#1F2937] dark:text-[#F5F7FA] flex flex-col font-sans pb-14">
      {/* Studio Hero Header */}
      <RelationsHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCreateNews={() => {
          setEditingNews(null);
          setIsCreateNewsOpen(true);
        }}
        onOpenUploadMedia={() => setIsUploadMediaOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'operations' ? (
          /* Primary PR Operations Center View */
          <div className="liquid-glass-card iridescent-edge rounded-3xl p-4 sm:p-6 flex flex-col lg:flex-row gap-5 items-start">
            <PRMonitoringSidebar activeView={activePRView} onChange={setActivePRView} />
            <div className="min-w-0 flex-1 space-y-6">
              <PRWorkspaceView
                view={activePRView}
                newsList={newsList}
                mediaList={mediaList}
                stats={stats}
                onSelectNews={handleSelectNews}
              />
            </div>
          </div>
        ) : (
          /* Traditional CMS / Media Library / Public Portal */
          <div className="space-y-6">
            <RelationsSummaryCards
              stats={stats}
              onFilterStatus={(status) => {
                setActiveTab('management');
                setSelectedStatusFilter(status);
              }}
              onGoToMedia={() => setActiveTab('media')}
              onGoToAnnouncements={() => {
                setActiveTab('public');
              }}
            />

            <div className="liquid-glass-card iridescent-edge rounded-3xl p-4 sm:p-6">
              {activeTab === 'year-plan' && <YearPlanView dept="relations" />}
              {activeTab === 'incoming' && <IncomingRegisterPage dept="relations" />}

              {/* Tab 1: News Management CMS */}
              {activeTab === 'management' && (
                <NewsManagement
                  newsList={newsList}
                  onOpenCreate={() => {
                    setEditingNews(null);
                    setIsCreateNewsOpen(true);
                  }}
                  onSelectNews={handleSelectNews}
                  onEditNews={(item) => {
                    setEditingNews(item);
                    setIsCreateNewsOpen(true);
                  }}
                  onDeleteNews={handleDeleteNews}
                  onPublishNews={handlePublishNews}
                  onUnpublishNews={handleUnpublishNews}
                  onStatusChange={handleStatusChange}
                  selectedStatusFilter={selectedStatusFilter}
                  onClearStatusFilter={() => setSelectedStatusFilter('all')}
                />
              )}

              {/* Tab 2: Digital Media Library */}
              {activeTab === 'media' && (
                <MediaLibrary
                  mediaList={mediaList}
                  onOpenUpload={() => setIsUploadMediaOpen(true)}
                  onDeleteMedia={handleDeleteMedia}
                />
              )}

              {/* Tab 3: Public Website View */}
              {activeTab === 'public' && (
                <PublicNewsPortal
                  newsList={newsList}
                  mediaList={mediaList}
                  onLikeNews={handleLikeNews}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Create / Edit News Modal */}
      <NewsFormModal
        isOpen={isCreateNewsOpen}
        onClose={() => {
          setIsCreateNewsOpen(false);
          setEditingNews(null);
        }}
        onSubmit={handleCreateOrUpdateNews}
        initialData={editingNews}
      />

      {/* View News Article Detail Modal */}
      <NewsDetailModal
        news={detailNews}
        isOpen={!!detailNews}
        onClose={() => setDetailNews(null)}
        onEdit={(item) => {
          setDetailNews(null);
          setEditingNews(item);
          setIsCreateNewsOpen(true);
        }}
        onDelete={handleDeleteNews}
        onPublish={handlePublishNews}
        onUnpublish={handleUnpublishNews}
        onLike={handleLikeNews}
      />

      {/* Upload Media Asset Modal */}
      <MediaUploadModal
        isOpen={isUploadMediaOpen}
        onClose={() => setIsUploadMediaOpen(false)}
        onUpload={handleUploadMedia}
      />
    </div>
  );
};

export const RelationsModule: React.FC = () => {
  return (
    <PRIntelProvider>
      <RelationsContent />
    </PRIntelProvider>
  );
};
