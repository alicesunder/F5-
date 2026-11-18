import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Search,
  Plus,
  Bell,
  BellOff,
  Flame,
  Radio,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { usePRIntel } from '../../context/PRIntelContext';
import { formatNumber } from '../../utils/formatters';

export const PRKeywordsView: React.FC = () => {
  const { keywords, setIsAddKeywordOpen, setActivePRView } = usePRIntel();
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredKeywords = useMemo(() => {
    return keywords.filter((kw) => {
      if (priorityFilter !== 'all' && kw.priority !== priorityFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          kw.keyword.toLowerCase().includes(q) ||
          kw.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [keywords, priorityFilter, searchQuery]);

  const totalMentions = keywords.reduce((sum, k) => sum + k.mentionCount, 0);
  const urgentCount = keywords.filter((k) => k.priority === 'urgent' || k.priority === 'high').length;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-pink-50 text-pink-700 border border-pink-200">
                <TrendingUp className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-black text-[#1E1B4B] tracking-tight">
                  คำค้นเฝ้าระวัง & แฮชแท็ก (Keywords Monitoring)
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  ดักจับประเด็นข่าวด่วน ข่าวลือ และกิจกรรมสำคัญของ บช.ตชด. ({keywords.length} คำค้น)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddKeywordOpen(true)}
              className="px-3.5 py-2 bg-[#27265B] hover:bg-[#1E1B4B] text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มคำค้นติดตาม</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium">คำค้นทั้งหมด</span>
            <div className="text-xl font-black text-[#1E1B4B]">{keywords.length} คำ</div>
          </div>
          <div className="bg-pink-50/60 p-3 rounded-xl border border-pink-100">
            <span className="text-[11px] text-pink-700 font-medium">จำนวนการกล่าวถึงวันนี้</span>
            <div className="text-xl font-black text-pink-800">
              {formatNumber(totalMentions)} ครั้ง
            </div>
          </div>
          <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100">
            <span className="text-[11px] text-amber-700 font-medium">คำค้นความสำคัญสูง</span>
            <div className="text-xl font-black text-amber-800">{urgentCount} คำ</div>
          </div>
          <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
            <span className="text-[11px] text-emerald-700 font-medium">เปิดแจ้งเตือนด่วน</span>
            <div className="text-xl font-black text-emerald-700">
              {keywords.filter((k) => k.notificationEnabled).length} คำ
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/80 p-3 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาคำค้น เช่น ครู ตชด., กู้ภัยสังขละบุรี..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-pink-500 focus:bg-white"
          />
        </div>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 w-full sm:w-auto"
        >
          <option value="all">ทุกระดับความสำคัญ</option>
          <option value="urgent">เร่งด่วน (Urgent)</option>
          <option value="high">สูง (High)</option>
          <option value="medium">ปานกลาง (Medium)</option>
          <option value="low">ปกติ (Low)</option>
        </select>
      </div>

      {/* Keywords Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredKeywords.map((kw) => (
          <div
            key={kw.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-4 hover:border-pink-400 hover:shadow-xs transition flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: kw.color }}
                  />
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                    #{kw.keyword}
                  </h3>
                </div>
                {kw.notificationEnabled ? (
                  <Bell className="w-3.5 h-3.5 text-pink-600 shrink-0" title="เปิดแจ้งเตือน" />
                ) : (
                  <BellOff className="w-3.5 h-3.5 text-slate-300 shrink-0" title="ปิดแจ้งเตือน" />
                )}
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                {kw.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">การกล่าวถึง</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-[#1E1B4B]">
                  <span>{kw.mentionCount} ครั้ง</span>
                  <span className="text-[10px] text-emerald-600 flex items-center">
                    <ArrowUpRight className="w-3 h-3" />
                    +{kw.trendPercentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (kw.mentionCount / 350) * 100)}%`,
                    backgroundColor: kw.color,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>ตรวจพบใน {kw.pagesCount} เพจ</span>
                <span>ล่าสุด: {kw.latestPostTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
