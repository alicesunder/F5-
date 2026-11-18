import React, { useState, useMemo } from 'react';
import { downloadFile } from '../../../utils/fileDownloader';
import {
  NewsItem,
  NewsCategory,
  MediaItem,
} from '../types';
import {
  Search,
  Calendar,
  User,
  Eye,
  Heart,
  Share2,
  Sparkles,
  ArrowRight,
  Bell,
  Image as ImageIcon,
  Download,
  Paperclip,
  CheckCircle2,
  X,
  ChevronRight,
  ShieldCheck,
  Megaphone,
} from 'lucide-react';

interface PublicNewsPortalProps {
  newsList: NewsItem[];
  mediaList: MediaItem[];
  onLikeNews?: (id: string) => void;
}

export const PublicNewsPortal: React.FC<PublicNewsPortalProps> = ({
  newsList,
  mediaList,
  onLikeNews,
}) => {
  const primaryColor = '#EE7E9E';

  // State
  const [activeSection, setActiveSection] = useState<'all' | 'featured' | 'events' | 'announcements' | 'gallery'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'all'>('all');
  const [readingNews, setReadingNews] = useState<NewsItem | null>(null);

  // Filter only Published news for citizens!
  const publishedNews = useMemo(() => {
    return newsList.filter(n => n.status === 'Published');
  }, [newsList]);

  // Featured News (Hero)
  const featuredNews = useMemo(() => {
    return publishedNews.filter(n => n.isFeatured);
  }, [publishedNews]);

  const heroItem = featuredNews[0] || publishedNews[0];

  // Filtered List
  const filteredList = useMemo(() => {
    return publishedNews.filter(item => {
      if (activeSection === 'featured' && !item.isFeatured) return false;
      if (activeSection === 'events' && item.category !== 'กิจกรรมและโครงการ') return false;
      if (activeSection === 'announcements' && item.category !== 'ประกาศทางการ') return false;

      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const match =
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.tags.some(t => t.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [publishedNews, activeSection, selectedCategory, searchTerm]);

  // Announcements specific list
  const announcements = useMemo(() => {
    return publishedNews.filter(n => n.category === 'ประกาศทางการ');
  }, [publishedNews]);

  // Events specific list
  const events = useMemo(() => {
    return publishedNews.filter(n => n.category === 'กิจกรรมและโครงการ');
  }, [publishedNews]);

  // Photos Gallery
  const photoGallery = useMemo(() => {
    return mediaList.filter(m => m.type === 'image');
  }, [mediaList]);

  return (
    <div className="space-y-8 text-slate-900 dark:text-white font-sans pb-16">
      {/* Public Citizen Badge Notice */}
      <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-800/40 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5 text-xs text-rose-900 dark:text-rose-200 font-medium">
          <ShieldCheck className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
          <span>
            <strong>โหมดมุมมองประชาชน (Citizen Public View):</strong> แสดงเฉพาะข่าวสารที่ได้รับการอนุมัติเผยแพร่แล้ว ประชาชนสามารถอ่าน ค้นหา และดาวน์โหลดเอกสารได้โดยไม่ต้องเข้าสู่ระบบ
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-[#1A1F29] text-rose-700 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-800/40">
          READ ONLY
        </span>
      </div>

      {/* Public Portal Navigation Header */}
      <div className="bg-white dark:bg-[#151821] rounded-3xl p-6 border border-rose-100/70 dark:border-white/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-rose-500 uppercase">
            PUBLIC INFORMATION PORTAL
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
            ศูนย์ข้อมูลข่าวสารและประชาสัมพันธ์ภาครัฐ
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ติดตามข่าวสารฉับไว กิจกรรมเพื่อสังคม และประกาศคำสั่งทางการที่เชื่อถือได้
          </p>
        </div>

        {/* Public Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ค้นหาข่าว กิจกรรม หรือประกาศ..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
        </div>
      </div>

      {/* Public Navigation Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          type="button"
          onClick={() => setActiveSection('all')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeSection === 'all'
              ? 'text-white shadow-xs'
              : 'bg-white dark:bg-[#151821] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
          }`}
          style={{ backgroundColor: activeSection === 'all' ? primaryColor : undefined }}
        >
          ข่าวสารทั้งหมด ({publishedNews.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('featured')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === 'featured'
              ? 'text-white shadow-xs'
              : 'bg-white dark:bg-[#151821] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
          }`}
          style={{ backgroundColor: activeSection === 'featured' ? primaryColor : undefined }}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>ข่าวเด่นน่าสนใจ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('events')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeSection === 'events'
              ? 'text-white shadow-xs'
              : 'bg-white dark:bg-[#151821] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
          }`}
          style={{ backgroundColor: activeSection === 'events' ? primaryColor : undefined }}
        >
          กิจกรรมและโครงการ ({events.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('announcements')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === 'announcements'
              ? 'text-white shadow-xs'
              : 'bg-white dark:bg-[#151821] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
          }`}
          style={{ backgroundColor: activeSection === 'announcements' ? primaryColor : undefined }}
        >
          <Bell className="w-3.5 h-3.5 text-rose-500" />
          <span>ประกาศทางการ ({announcements.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('gallery')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === 'gallery'
              ? 'text-white shadow-xs'
              : 'bg-white dark:bg-[#151821] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
          }`}
          style={{ backgroundColor: activeSection === 'gallery' ? primaryColor : undefined }}
        >
          <ImageIcon className="w-3.5 h-3.5 text-sky-500" />
          <span>แกลเลอรีภาพ ({photoGallery.length})</span>
        </button>
      </div>

      {/* 1. HERO FEATURED NEWS (Only on 'all' or 'featured' tabs and no active search) */}
      {(activeSection === 'all' || activeSection === 'featured') && !searchTerm && heroItem && (
        <div
          onClick={() => setReadingNews(heroItem)}
          className="group relative bg-white dark:bg-[#151821] rounded-3xl border border-rose-100/80 dark:border-white/10 shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12"
        >
          {/* Image 7 Cols */}
          <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto min-h-[300px] overflow-hidden bg-slate-900">
            <img
              src={heroItem.coverImage}
              alt={heroItem.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent lg:hidden" />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-400 text-slate-900 shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 fill-slate-900" />
                <span>ข่าวเด่นประจำวัน</span>
              </span>
              <span
                className="px-3 py-1 rounded-xl text-xs font-bold text-white shadow-md backdrop-blur-md"
                style={{ backgroundColor: primaryColor }}
              >
                {heroItem.category}
              </span>
            </div>
          </div>

          {/* Details 5 Cols */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{heroItem.date}</span>
                <span>•</span>
                <span className="font-mono">{heroItem.views.toLocaleString()} อ่าน</span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-rose-600 transition leading-snug">
                {heroItem.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4">
                {heroItem.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">{heroItem.author}</span>
              <span
                className="font-bold flex items-center gap-1 transition group-hover:translate-x-1"
                style={{ color: primaryColor }}
              >
                <span>อ่านเนื้อหาฉบับเต็ม</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. GALLERY TAB CONTENT */}
      {activeSection === 'gallery' ? (
        <div className="bg-white dark:bg-[#151821] rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              คลังภาพถ่ายกิจกรรมและภารกิจเพื่อประชาชน
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {photoGallery.map(photo => (
              <div
                key={photo.id}
                className="group relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 h-48 cursor-pointer hover:shadow-lg transition"
              >
                <img
                  src={photo.thumbnail || photo.url}
                  alt={photo.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition p-3 flex flex-col justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white bg-rose-500 self-start">
                    {photo.category}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-white line-clamp-2">{photo.name}</p>
                    <p className="text-[10px] text-white/80 font-mono mt-0.5">{photo.uploadedAt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 3. LATEST NEWS CARDS GRID */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>ข่าวล่าสุดและรายงานความคืบหน้า</span>
              <span className="text-xs font-mono text-slate-400 font-normal">
                ({filteredList.length} รายการ)
              </span>
            </h3>
          </div>

          {filteredList.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#151821] rounded-3xl border border-slate-200 dark:border-white/10 text-slate-400 text-xs">
              ไม่พบข่าวสารในหมวดหมู่นี้
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredList.map(item => (
                <div
                  key={item.id}
                  onClick={() => setReadingNews(item)}
                  className="group bg-white dark:bg-[#151821] rounded-3xl border border-rose-100/80 dark:border-white/10 overflow-hidden shadow-2xs hover:-translate-y-1 hover:shadow-lg hover:border-rose-200 dark:hover:border-white/20 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative h-48 w-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span
                          className="px-2.5 py-1 rounded-xl text-[10px] font-bold text-white shadow-xs backdrop-blur-md"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {item.category}
                        </span>
                      </div>
                      {item.isFeatured && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-400 text-slate-900 shadow-xs flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>เด่น</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span>{item.date}</span>
                        <span>•</span>
                        <span className="font-mono">{item.views.toLocaleString()} เข้าชม</span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition line-clamp-2 leading-snug">
                        {item.title}
                      </h4>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 py-3 border-t border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 truncate max-w-[170px] text-[11px]">
                      {item.author}
                    </span>
                    <span
                      className="font-bold flex items-center gap-1 group-hover:underline text-[11px]"
                      style={{ color: primaryColor }}
                    >
                      <span>อ่านต่อ</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. OFFICIAL ANNOUNCEMENTS NOTICE TICKER BOARD */}
      {announcements.length > 0 && activeSection !== 'gallery' && (
        <div className="bg-white dark:bg-[#151821] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  กระดานประกาศทางการและคำสั่งราชการ (Official Notices Board)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  ตรวจสอบและดาวน์โหลดเอกสารประกาศฉบับจริงพร้อมตราครุฑ
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {announcements.map(ann => (
              <div
                key={ann.id}
                onClick={() => setReadingNews(ann)}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-white/5 px-2 rounded-xl cursor-pointer transition"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-mono border border-purple-200 dark:border-purple-800/40">
                    {ann.id}
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition">
                      {ann.title}
                    </h5>
                    <span className="text-[10px] text-slate-400 font-mono">
                      เผยแพร่: {ann.date} โดย {ann.author}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {ann.attachments && ann.attachments.length > 0 && (
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-mono flex items-center gap-1 border border-slate-200 dark:border-white/10">
                      <Paperclip className="w-3 h-3 text-rose-500" />
                      <span>{ann.attachments.length} ไฟล์</span>
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* READ ARTICLE MODAL FOR CITIZENS (Read-Only) */}
      {readingNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#151821] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl max-w-3xl w-full my-8 overflow-hidden text-slate-900 dark:text-white flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#151821]">
              <span
                className="px-3 py-1 rounded-xl text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: primaryColor }}
              >
                {readingNews.category}
              </span>
              <button
                type="button"
                onClick={() => setReadingNews(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                {readingNews.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pb-3 border-b border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{readingNews.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{readingNews.date}</span>
                </div>
                <div className="flex items-center gap-1 font-mono">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>{readingNews.views.toLocaleString()} เข้าชม</span>
                </div>
                {onLikeNews && (
                  <button
                    type="button"
                    onClick={() => onLikeNews(readingNews.id)}
                    className="flex items-center gap-1 text-rose-500 hover:text-rose-700 font-bold ml-auto cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    <span>{readingNews.likes} ถูกใจ</span>
                  </button>
                )}
              </div>

              <div className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5 max-h-80">
                <img
                  src={readingNews.coverImage}
                  alt={readingNews.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line space-y-4">
                {readingNews.content}
              </div>

              {/* Gallery */}
              {readingNews.gallery && readingNews.gallery.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">รูปภาพประกอบข่าว</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {readingNews.gallery.map((img, i) => (
                      <div key={i} className="h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attachments */}
              {readingNews.attachments && readingNews.attachments.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">เอกสารดาวน์โหลด</h4>
                  {readingNews.attachments.map(att => (
                    <div
                      key={att.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Paperclip className="w-4 h-4 text-rose-500 flex-shrink-0" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{att.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({att.size})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => downloadFile(att.name)}
                        className="px-3 py-1 rounded-lg bg-white dark:bg-[#151821] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 shadow-2xs flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>ดาวน์โหลด</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setReadingNews(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-xs cursor-pointer"
                style={{ backgroundColor: primaryColor }}
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
