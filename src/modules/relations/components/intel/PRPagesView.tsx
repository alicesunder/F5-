import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  ExternalLink,
  Shield,
  TrendingUp,
  Radio,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { usePRIntel } from '../../context/PRIntelContext';
import { formatNumber, formatRelativeTime } from '../../utils/formatters';

export const PRPagesView: React.FC = () => {
  const { pages, setIsAddPageOpen, setActivePRView, setSelectedPageId } = usePRIntel();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = Array.from(new Set(pages.map((p) => p.category)));

  const filteredPages = useMemo(() => {
    return pages.filter((page) => {
      if (selectedCategory !== 'all' && page.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          page.name.toLowerCase().includes(q) ||
          page.handle.toLowerCase().includes(q) ||
          page.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [pages, selectedCategory, searchQuery]);

  const totalFollowers = pages.reduce((acc, p) => acc + p.followers, 0);
  const totalBppPosts = pages.reduce((acc, p) => acc + p.bppPostsToday, 0);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-pink-50 text-pink-700 border border-pink-200">
                <Users className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-black text-[#1E1B4B] tracking-tight">
                  ระบบติดตามเพจและสื่อออนไลน์ (Monitored Pages)
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  เฝ้าระวังและวิเคราะห์การนำเสนอข่าวจากสำนักข่าว เพจความมั่นคง และเครือข่ายภาคประชาชน ({pages.length} เพจ)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddPageOpen(true)}
              className="px-3.5 py-2 bg-[#27265B] hover:bg-[#1E1B4B] text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มเพจติดตาม</span>
            </button>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium">จำนวนเพจที่ติดตาม</span>
            <div className="text-xl font-black text-[#1E1B4B]">{pages.length} เพจ</div>
          </div>
          <div className="bg-pink-50/60 p-3 rounded-xl border border-pink-100">
            <span className="text-[11px] text-pink-700 font-medium">โพสต์ถึง ตชด. วันนี้</span>
            <div className="text-xl font-black text-pink-800">{totalBppPosts} โพสต์</div>
          </div>
          <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100">
            <span className="text-[11px] text-blue-700 font-medium">ฐานผู้ติดตามรวม</span>
            <div className="text-xl font-black text-blue-800">
              {formatNumber(totalFollowers)} คน
            </div>
          </div>
          <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
            <span className="text-[11px] text-emerald-700 font-medium">สถานะการเชื่อมต่อ</span>
            <div className="text-xl font-black text-emerald-700 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>ปกติ 100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white border border-slate-200/80 p-3 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อเพจ หรือ handle เช่น @mgronline, @thairath..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-pink-500 focus:bg-white"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 w-full sm:w-auto"
        >
          <option value="all">ทุกหมวดหมู่ ({pages.length})</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPages.map((page) => (
          <div
            key={page.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 hover:border-pink-400 hover:shadow-xs transition space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={page.avatar}
                    alt={page.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {page.name}
                      </h3>
                      {page.verified && (
                        <span className="text-xs text-blue-600 font-bold" title="ยืนยันตัวตนแล้ว">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{page.handle}</span>
                    <div className="mt-0.5">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {page.category}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold shrink-0">
                  กำลังเฝ้าระวัง
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                <div className="bg-slate-50/70 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400">ผู้ติดตาม</span>
                  <p className="text-xs font-bold text-slate-800 font-mono">
                    {formatNumber(page.followers)}
                  </p>
                </div>
                <div className="bg-slate-50/70 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400">โพสต์รวมวันนี้</span>
                  <p className="text-xs font-bold text-slate-800 font-mono">{page.postsToday}</p>
                </div>
                <div className="bg-pink-50/70 p-2 rounded-lg border border-pink-100">
                  <span className="text-[10px] text-pink-700 font-semibold">ข่าว ตชด.</span>
                  <p className="text-xs font-black text-pink-800 font-mono">
                    {page.bppPostsToday}
                  </p>
                </div>
              </div>

              {/* Sentiment breakdown mini-bar */}
              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>แนวโน้มความรู้สึก (7 วัน)</span>
                  <span className="text-emerald-700 font-bold">
                    บวก {page.sentimentBreakdown.positive}% / ลบ {page.sentimentBreakdown.negative}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full flex overflow-hidden">
                  <div
                    style={{ width: `${page.sentimentBreakdown.positive}%` }}
                    className="bg-emerald-500 h-full"
                    title={`บวก ${page.sentimentBreakdown.positive}%`}
                  />
                  <div
                    style={{ width: `${page.sentimentBreakdown.neutral}%` }}
                    className="bg-slate-300 h-full"
                    title={`กลาง ${page.sentimentBreakdown.neutral}%`}
                  />
                  <div
                    style={{ width: `${page.sentimentBreakdown.negative}%` }}
                    className="bg-rose-500 h-full"
                    title={`ลบ ${page.sentimentBreakdown.negative}%`}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">
                อัปเดต {formatRelativeTime(page.latestPostMinutesAgo)}
              </span>
              <button
                onClick={() => {
                  setSelectedPageId(page.id);
                  setActivePRView('latest');
                }}
                className="text-pink-700 hover:text-pink-800 font-semibold flex items-center gap-1"
              >
                <span>ดูกระแสข่าวของเพจนี้</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
