import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Radio,
  ExternalLink,
  MessageSquare,
  Share2,
  Heart,
  TrendingUp,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
} from 'lucide-react';
import { usePRIntel } from '../../context/PRIntelContext';
import { PostItem, SentimentType, PostCategory } from '../../types/bppTypes';
import {
  formatRelativeTime,
  formatNumber,
  getSentimentBadge,
  getCategoryBadge,
} from '../../utils/formatters';

interface PRLatestPostsViewProps {
  bppOnlyDefault?: boolean;
}

export const PRLatestPostsView: React.FC<PRLatestPostsViewProps> = ({
  bppOnlyDefault = false,
}) => {
  const {
    posts,
    setSelectedPost,
    setIsAddMissionOpen,
    setPrefilledMissionData,
  } = usePRIntel();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [bppOnly, setBppOnly] = useState<boolean>(bppOnlyDefault);

  const categories: PostCategory[] = [
    'ความมั่นคงชายแดน',
    'ยาเสพติด',
    'จิตอาสา/ช่วยเหลือ',
    'การศึกษา/ครู ตชด.',
    'ภัยพิบัติ',
    'กิจกรรมองค์กร',
    'ทั่วไป',
  ];

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (bppOnly && !post.bppRelated) return false;
      if (selectedSentiment !== 'all' && post.sentiment !== selectedSentiment) return false;
      if (selectedCategory !== 'all' && post.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesContent = post.content.toLowerCase().includes(query);
        const matchesPage = post.pageName.toLowerCase().includes(query);
        const postKeywords = post.matchedKeywords || post.keywords || [];
        const matchesKeywords = postKeywords.some((k) =>
          k.toLowerCase().includes(query)
        );
        if (!matchesContent && !matchesPage && !matchesKeywords) return false;
      }
      return true;
    });
  }, [posts, bppOnly, selectedSentiment, selectedCategory, searchQuery]);

  // Statistics
  const totalCount = posts.length;
  const bppCount = posts.filter((p) => p.bppRelated).length;
  const posCount = posts.filter((p) => p.sentiment === 'positive').length;
  const negCount = posts.filter((p) => p.sentiment === 'negative').length;
  const neuCount = posts.filter((p) => p.sentiment === 'neutral').length;

  const handleCreateMissionFromPost = (post: PostItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setPrefilledMissionData({
      title: `บันทึกภาพประกอบข่าว: ${post.content.slice(0, 40)}...`,
      description: `ภารกิจบันทึกภาพสนับสนุนข้อมูลจากโพสต์ของเพจ "${post.pageName}"\nเนื้อหา: "${post.content}"`,
      location: post.category === 'การศึกษา/ครู ตชด.' ? 'โรงเรียน ตชด.' : 'พื้นที่ปฏิบัติการ ตชด.',
      province: 'กรุงเทพมหานคร',
      category:
        post.category === 'ภัยพิบัติ' || post.category === 'จิตอาสา/ช่วยเหลือ'
          ? 'ช่วยเหลือผู้ประสบภัย'
          : post.category === 'การศึกษา/ครู ตชด.'
          ? 'กิจกรรมโรงเรียน ตชด.'
          : 'แถลงข่าวและประชาสัมพันธ์',
      priority: post.sentiment === 'negative' ? 'urgent' : 'high',
      relatedPostId: post.id,
      relatedPostTitle: post.content.slice(0, 50),
    });
    setIsAddMissionOpen(true);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header & Metric Banner */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-pink-50 text-pink-700 border border-pink-200">
                <Radio className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-black text-[#1E1B4B] tracking-tight">
                  {bppOnly ? 'กระแสข่าวที่เกี่ยวข้องกับ ตชด.' : 'กระแสข่าวและสื่อสังคมออนไลน์ล่าสุด'}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  ระบบวิเคราะห์ความรู้สึก (Sentiment Analysis) และดักจับคำค้นจากเพจสื่อและเพจสาธารณะ
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setBppOnly(!bppOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                bppOnly
                  ? 'bg-pink-700 text-white border-pink-700 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>เฉพาะข่าว ตชด. ({bppCount})</span>
            </button>
          </div>
        </div>

        {/* Sentiment Overview Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium">โพสต์ที่ตรวจพบ</span>
            <div className="text-lg font-black text-[#1E1B4B]">{totalCount} รายการ</div>
          </div>
          <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
            <span className="text-[11px] text-emerald-700 font-medium">ความรู้สึกเชิงบวก</span>
            <div className="text-lg font-black text-emerald-700">
              {posCount} <span className="text-xs font-normal">({Math.round((posCount / totalCount) * 100)}%)</span>
            </div>
          </div>
          <div className="bg-slate-100/70 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-600 font-medium">ความรู้สึกเป็นกลาง</span>
            <div className="text-lg font-black text-slate-700">
              {neuCount} <span className="text-xs font-normal">({Math.round((neuCount / totalCount) * 100)}%)</span>
            </div>
          </div>
          <div className="bg-rose-50/60 p-2.5 rounded-xl border border-rose-100">
            <span className="text-[11px] text-rose-700 font-medium">ประเด็นลบ/เฝ้าระวัง</span>
            <div className="text-lg font-black text-rose-700">
              {negCount} <span className="text-xs font-normal">({Math.round((negCount / totalCount) * 100)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200/80 p-3 rounded-2xl shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาข้อความ, ชื่อเพจ, หรือคำค้น (เช่น ครู ตชด., ยาเสพติด, สังขละบุรี)..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-pink-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          {/* Sentiment Filter */}
          <select
            value={selectedSentiment}
            onChange={(e) => setSelectedSentiment(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-pink-500"
          >
            <option value="all">ทุกความรู้สึก (Sentiment)</option>
            <option value="positive">เชิงบวก (Positive)</option>
            <option value="neutral">เป็นกลาง (Neutral)</option>
            <option value="negative">เชิงลบ (Negative)</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-pink-500"
          >
            <option value="all">ทุกหมวดหมู่เนื้อหา</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {(searchQuery || selectedSentiment !== 'all' || selectedCategory !== 'all' || bppOnly !== bppOnlyDefault) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSentiment('all');
                setSelectedCategory('all');
                setBppOnly(bppOnlyDefault);
              }}
              className="text-xs text-rose-600 hover:text-rose-700 px-2 py-1 font-semibold"
            >
              ล้างตัวกรอง
            </button>
          )}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center">
            <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">ไม่พบโพสต์ข่าวสารที่ตรงกับเงื่อนไข</p>
            <p className="text-xs text-slate-400 mt-1">
              ลองปรับเปลี่ยนคำค้นหรือล้างตัวกรองความรู้สึก
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const sentiment = getSentimentBadge(post.sentiment);
            const categoryClass = getCategoryBadge(post.category);

            return (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 hover:border-pink-400 hover:shadow-xs transition cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* Page & Time info */}
                  <div className="flex items-center gap-3">
                    <img
                      src={post.pageAvatar}
                      alt={post.pageName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-pink-900 transition">
                          {post.pageName}
                        </span>
                        {post.isVerified && (
                          <span className="text-xs text-blue-600 font-bold">✓</span>
                        )}
                        <span className="text-xs text-slate-400 font-mono">
                          {post.pageHandle}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                        <span>{formatRelativeTime(post.minutesAgo)}</span>
                        <span>•</span>
                        <span>{post.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges & Actions */}
                  <div className="flex items-center gap-2 flex-wrap sm:shrink-0">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${sentiment.bg} ${sentiment.text}`}
                    >
                      {sentiment.label}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${categoryClass}`}
                    >
                      {post.category}
                    </span>
                    {post.bppRelated && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-pink-50 text-pink-800 border border-pink-200">
                        ตชด.เกี่ยวข้อง
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="mt-3">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed group-hover:text-slate-900">
                    {post.content}
                  </p>
                </div>

                {/* Matched Keywords & Metrics & Quick Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Keywords */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-400 font-medium">คำค้นที่พบ:</span>
                    {(post.matchedKeywords || post.keywords || []).map((k, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 bg-slate-100 text-[#27265B] rounded font-mono font-medium"
                      >
                        #{k}
                      </span>
                    ))}
                  </div>

                  {/* Engagement & Action */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        {formatNumber(post.engagement.likes)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                        {formatNumber(post.engagement.comments)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                        {formatNumber(post.engagement.shares)}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleCreateMissionFromPost(post, e)}
                      className="px-2.5 py-1 bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                      title="ส่งต่อข้อมูลให้ทีมช่างภาพลงพื้นที่ทำข่าว"
                    >
                      <Camera className="w-3.5 h-3.5 text-pink-700" />
                      <span>มอบงานภาพถ่าย</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
