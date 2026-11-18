import React from 'react';
import {
  X,
  ExternalLink,
  Camera,
  Heart,
  MessageSquare,
  Share2,
  Calendar,
  Clock,
  Shield,
} from 'lucide-react';
import { usePRIntel } from '../../context/PRIntelContext';
import {
  formatRelativeTime,
  formatNumber,
  getSentimentBadge,
  getCategoryBadge,
} from '../../utils/formatters';

export const PRPostDetailModal: React.FC = () => {
  const {
    selectedPost,
    setSelectedPost,
    setIsAddMissionOpen,
    setPrefilledMissionData,
  } = usePRIntel();

  if (!selectedPost) return null;

  const sentiment = getSentimentBadge(selectedPost.sentiment);
  const categoryClass = getCategoryBadge(selectedPost.category);

  const handleCreateMission = () => {
    setPrefilledMissionData({
      title: `บันทึกภาพข่าว: ${selectedPost.content.slice(0, 45)}...`,
      description: `สร้างชุดภาพเพื่อตอบโต้/สนับสนุนประเด็นจากเพจ "${selectedPost.pageName}"\nเนื้อหา: "${selectedPost.content}"`,
      location: selectedPost.category === 'การศึกษา/ครู ตชด.' ? 'โรงเรียน ตชด.' : 'พื้นที่ปฏิบัติการ ตชด.',
      province: 'กรุงเทพมหานคร',
      category:
        selectedPost.category === 'ภัยพิบัติ' || selectedPost.category === 'จิตอาสา/ช่วยเหลือ'
          ? 'ช่วยเหลือผู้ประสบภัย'
          : selectedPost.category === 'การศึกษา/ครู ตชด.'
          ? 'กิจกรรมโรงเรียน ตชด.'
          : 'แถลงข่าวและประชาสัมพันธ์',
      priority: selectedPost.sentiment === 'negative' ? 'urgent' : 'high',
      relatedPostId: selectedPost.id,
      relatedPostTitle: selectedPost.content.slice(0, 50),
    });
    setSelectedPost(null);
    setIsAddMissionOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <img
              src={selectedPost.pageAvatar}
              alt={selectedPost.pageName}
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-slate-900">{selectedPost.pageName}</h3>
                {selectedPost.isVerified && (
                  <span className="text-xs text-blue-600 font-bold">✓</span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono">{selectedPost.pageHandle}</p>
            </div>
          </div>

          <button
            onClick={() => setSelectedPost(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Metadata & Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${sentiment.bg} ${sentiment.text}`}>
                {sentiment.label}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${categoryClass}`}>
                {selectedPost.category}
              </span>
              {selectedPost.bppRelated && (
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-pink-50 text-pink-800 border border-pink-200">
                  เกี่ยวข้องกับ ตชด.
                </span>
              )}
            </div>

            <span className="text-xs text-slate-400 font-mono">
              {formatRelativeTime(selectedPost.minutesAgo)} • {selectedPost.timestamp}
            </span>
          </div>

          {/* Post Content */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
            <p className="text-slate-800 leading-relaxed whitespace-pre-line text-sm">
              {selectedPost.content}
            </p>
          </div>

          {/* Matched Keywords */}
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-1.5">
              คำค้นที่ตรวจพบ (Matched Keywords):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(selectedPost.matchedKeywords || selectedPost.keywords || []).map((k, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-pink-50 text-pink-800 font-mono text-xs border border-pink-200"
                >
                  #{k}
                </span>
              ))}
            </div>
          </div>

          {/* Engagement Numbers */}
          <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 text-center font-mono">
            <div>
              <span className="text-slate-400 text-xs">ยอดถูกใจ (Likes)</span>
              <p className="text-base font-bold text-slate-800">
                {formatNumber(selectedPost.engagement.likes)}
              </p>
            </div>
            <div>
              <span className="text-slate-400 text-xs">ความคิดเห็น (Comments)</span>
              <p className="text-base font-bold text-slate-800">
                {formatNumber(selectedPost.engagement.comments)}
              </p>
            </div>
            <div>
              <span className="text-slate-400 text-xs">แชร์ (Shares)</span>
              <p className="text-base font-bold text-slate-800">
                {formatNumber(selectedPost.engagement.shares)}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => setSelectedPost(null)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
          >
            ปิดหน้าต่าง
          </button>

          <button
            onClick={handleCreateMission}
            className="w-full sm:w-auto px-4 py-2 bg-[#27265B] hover:bg-[#1E1B4B] text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4 text-pink-300" />
            <span>สร้างภารกิจภาพถ่ายจากข่าวนี้</span>
          </button>
        </div>
      </div>
    </div>
  );
};
