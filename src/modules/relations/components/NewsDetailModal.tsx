import React, { useState } from 'react';
import { NewsItem, NewsStatus } from '../types';
import { downloadFile } from '../../../utils/fileDownloader';
import {
  X,
  Calendar,
  User,
  Eye,
  Heart,
  Share2,
  Edit,
  Trash2,
  Paperclip,
  Download,
  CheckCircle2,
  Clock,
  ExternalLink,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface NewsDetailModalProps {
  news: NewsItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (news: NewsItem) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
  onLike?: (id: string) => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({
  news,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  onLike,
}) => {
  const primaryColor = '#EE7E9E';
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState<number | null>(null);

  if (!isOpen || !news) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full my-8 overflow-hidden text-[#1F2937] flex flex-col max-h-[90vh]">
        {/* Top Header bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-lg text-xs font-bold text-white shadow-2xs"
              style={{ backgroundColor: primaryColor }}
            >
              {news.category}
            </span>
            {news.isFeatured && (
              <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-900 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>ข่าวเด่น</span>
              </span>
            )}
            <span
              className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${
                news.status === 'Published'
                  ? 'bg-emerald-100 text-emerald-800'
                  : news.status === 'Draft'
                  ? 'bg-slate-100 text-slate-700'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {news.status}
            </span>
            <span className="font-mono text-xs text-slate-400 font-bold ml-1">{news.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Article Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
            {news.title}
          </h2>

          {/* Meta Info Bar */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-800">{news.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{news.date}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>{news.views.toLocaleString()} เข้าชม</span>
            </div>
            {onLike && (
              <button
                type="button"
                onClick={() => onLike(news.id)}
                className="flex items-center gap-1.5 text-rose-500 hover:text-rose-700 font-semibold cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 fill-rose-500" />
                <span>{news.likes} ถูกใจ</span>
              </button>
            )}
          </div>

          {/* Cover Hero Image */}
          <div className="rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 max-h-[380px]">
            <img
              src={news.coverImage}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Summary Quote Box */}
          {news.summary && (
            <div
              className="p-4 rounded-2xl border-l-4 bg-rose-50/40 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed italic"
              style={{ borderColor: primaryColor }}
            >
              "{news.summary}"
            </div>
          )}

          {/* Main Article Content */}
          <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-4 whitespace-pre-line font-sans">
            {news.content}
          </div>

          {/* Photo Gallery Grid */}
          {news.gallery && news.gallery.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                ประมวลภาพกิจกรรม ({news.gallery.length} ภาพ)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {news.gallery.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedGalleryIdx(idx)}
                    className="h-32 sm:h-40 rounded-2xl overflow-hidden border border-slate-200 cursor-pointer hover:opacity-90 hover:scale-[1.02] transition"
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Downloadable Attachments */}
          {news.attachments && news.attachments.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                เอกสารดาวน์โหลดที่เกี่ยวข้อง
              </h4>
              <div className="space-y-2">
                {news.attachments.map(att => (
                  <div
                    key={att.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-rose-500 font-bold">
                        <Paperclip className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{att.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{att.size}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        downloadFile(att.name);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>ดาวน์โหลด</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {news.tags && news.tags.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-1.5">
              {news.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-medium"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (confirm(`คุณต้องการลบข่าว "${news.title}" ใช่หรือไม่?`)) {
                onDelete(news.id);
                onClose();
              }
            }}
            className="flex items-center gap-1 text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>ลบข่าวนี้</span>
          </button>

          <div className="flex items-center gap-2">
            {news.status === 'Published' ? (
              <button
                type="button"
                onClick={() => {
                  onUnpublish(news.id);
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-700 hover:bg-amber-50 text-xs font-semibold transition cursor-pointer"
              >
                ยกเลิกเผยแพร่
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onPublish(news.id);
                  onClose();
                }}
                className="px-4 py-1.5 rounded-xl text-white text-xs font-semibold shadow-xs transition hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: primaryColor }}
              >
                เผยแพร่ออนไลน์ทันที
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(news);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 shadow-2xs transition cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5 text-slate-500" />
              <span>แก้ไขข่าว</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-200 transition cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
