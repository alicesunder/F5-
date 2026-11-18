import React, { useMemo, useState } from 'react';
import { NewsItem, MediaItem, RelationsStats, NewsCategory } from '../types';
import { initialMonitoredPages } from '../data/relationsMockData';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Newspaper,
  Send,
  CheckCircle2,
  Eye,
  Heart,
  Sparkles,
  Facebook,
  Plus,
  Upload,
  FolderOpen,
  FileBarChart2,
  Settings,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Bookmark,
} from 'lucide-react';

interface RelationsDashboardProps {
  newsList: NewsItem[];
  stats: RelationsStats;
  onSelectNews: (n: NewsItem) => void;
  onOpenCreateNews: () => void;
  onOpenUploadMedia: () => void;
  onGoToMedia: () => void;
  onGoToFacebook: () => void;
  onGoToAiNews: () => void;
}

const CATEGORY_COLORS: Record<NewsCategory, string> = {
  ข่าวสารทั่วไป: '#6366F1',
  กิจกรรมและโครงการ: '#EC4899',
  ประชาสัมพันธ์: '#14B8A6',
  ประกาศทางการ: '#F59E0B',
  ภารกิจผู้บริหาร: '#8B5CF6',
  'อื่น ๆ': '#94A3B8',
};

/** Simple, honestly-labeled heuristic (not real NLP sentiment) used only for the AI insight card. */
const heuristicTone = (category: NewsCategory): 'positive' | 'neutral' =>
  ['ประชาสัมพันธ์', 'กิจกรรมและโครงการ', 'ภารกิจผู้บริหาร'].includes(category) ? 'positive' : 'neutral';

const formatCompact = (n: number) => new Intl.NumberFormat('th-TH', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

export const RelationsDashboard: React.FC<RelationsDashboardProps> = ({
  newsList,
  stats,
  onSelectNews,
  onOpenCreateNews,
  onOpenUploadMedia,
  onGoToMedia,
  onGoToFacebook,
  onGoToAiNews,
}) => {
  const [range, setRange] = useState<7 | 30 | 90>(7);
  const [feedFilter, setFeedFilter] = useState<NewsCategory | 'all'>('all');

  const totalLikes = useMemo(() => newsList.reduce((sum, n) => sum + (n.likes || 0), 0), [newsList]);

  // Week-over-week volume change — the one delta we can honestly derive from real dates.
  const newsTrend = useMemo(() => {
    const now = new Date('2026-09-10T12:00:00Z'); // dashboard's fictional "today", matches mock data range
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const thisWeek = newsList.filter(n => now.getTime() - new Date(n.createdAt).getTime() <= weekMs).length;
    const lastWeek = newsList.filter(n => {
      const diff = now.getTime() - new Date(n.createdAt).getTime();
      return diff > weekMs && diff <= weekMs * 2;
    }).length;
    if (lastWeek === 0) return null;
    return Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
  }, [newsList]);

  // Category breakdown for the donut — grounded in the real `category` field.
  const categoryBreakdown = useMemo(() => {
    const map = new Map<NewsCategory, { count: number; views: number }>();
    newsList.forEach(n => {
      const cur = map.get(n.category) || { count: 0, views: 0 };
      cur.count += 1;
      cur.views += n.views || 0;
      map.set(n.category, cur);
    });
    const total = newsList.length || 1;
    return Array.from(map.entries())
      .map(([category, v]) => ({ category, ...v, pct: Math.round((v.count / total) * 1000) / 10 }))
      .sort((a, b) => b.count - a.count);
  }, [newsList]);

  const topCategoriesByViews = useMemo(() => {
    const totalViews = newsList.reduce((s, n) => s + (n.views || 0), 0) || 1;
    return [...categoryBreakdown]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map(c => ({ ...c, sharePct: Math.round((c.views / totalViews) * 1000) / 10 }));
  }, [categoryBreakdown, newsList]);

  const toneBreakdown = useMemo(() => {
    const positive = newsList.filter(n => heuristicTone(n.category) === 'positive').length;
    const neutral = newsList.length - positive;
    const total = newsList.length || 1;
    return {
      positive,
      neutral,
      positivePct: Math.round((positive / total) * 1000) / 10,
      neutralPct: Math.round((neutral / total) * 1000) / 10,
    };
  }, [newsList]);

  // Trend chart: bucket real news items by day (7/30) or by week (90) within the range.
  const chartData = useMemo(() => {
    const now = new Date('2026-09-10T12:00:00Z');
    const buckets: { label: string; start: Date; end: Date }[] = [];
    if (range === 90) {
      for (let i = 12; i >= 0; i--) {
        const end = new Date(now.getTime() - i * 7 * 86400000);
        const start = new Date(end.getTime() - 7 * 86400000);
        buckets.push({ label: `สัปดาห์ที่ ${13 - i}`, start, end });
      }
    } else {
      for (let i = range - 1; i >= 0; i--) {
        const day = new Date(now.getTime() - i * 86400000);
        const start = new Date(day.getFullYear(), day.getMonth(), day.getDate());
        const end = new Date(start.getTime() + 86400000);
        buckets.push({ label: `${start.getDate()}/${start.getMonth() + 1}`, start, end });
      }
    }
    return buckets.map(b => {
      const items = newsList.filter(n => {
        const t = new Date(n.createdAt).getTime();
        return t >= b.start.getTime() && t < b.end.getTime();
      });
      return {
        label: b.label,
        newsCount: items.length,
        views: items.reduce((s, n) => s + (n.views || 0), 0),
      };
    });
  }, [newsList, range]);

  const filteredFeed = useMemo(
    () => (feedFilter === 'all' ? newsList : newsList.filter(n => n.category === feedFilter)).slice(0, 6),
    [newsList, feedFilter]
  );

  const categories = Object.keys(CATEGORY_COLORS) as NewsCategory[];

  const kpis = [
    {
      label: 'ข่าวทั้งหมด',
      value: stats.totalNews,
      icon: Newspaper,
      accent: 'from-violet-500 to-violet-600',
      caption: newsTrend === null ? 'จากทุกหมวดหมู่' : `${newsTrend >= 0 ? '+' : ''}${newsTrend}% จากสัปดาห์ก่อน`,
      trendUp: newsTrend !== null ? newsTrend >= 0 : undefined,
    },
    {
      label: 'รอเผยแพร่',
      value: stats.pendingCount,
      icon: Send,
      accent: 'from-rose-500 to-pink-500',
      caption: 'รอการอนุมัติ',
    },
    {
      label: 'เผยแพร่แล้ว',
      value: stats.publishedCount,
      icon: CheckCircle2,
      accent: 'from-emerald-500 to-teal-500',
      caption: 'เผยแพร่สู่สาธารณะแล้ว',
    },
    {
      label: 'ยอดเข้าชมรวม',
      value: stats.totalViews,
      icon: Eye,
      accent: 'from-blue-500 to-indigo-500',
      caption: 'ทุกช่องทาง',
      compact: true,
    },
    {
      label: 'ยอดถูกใจรวม',
      value: totalLikes,
      icon: Heart,
      accent: 'from-fuchsia-500 to-purple-600',
      caption: 'จากข่าวที่เผยแพร่แล้ว',
      compact: true,
    },
  ];

  return (
    <div className="space-y-5">
      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        {kpis.map(kpi => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className={`relative overflow-hidden rounded-2xl p-4 text-white shadow-sm bg-gradient-to-br ${kpi.accent}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white/90">{kpi.label}</span>
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl font-black tracking-tight mt-2">
                {kpi.compact ? formatCompact(kpi.value) : kpi.value.toLocaleString()}
              </div>
              <p className="text-[11px] text-white/85 font-medium mt-1 flex items-center gap-1">
                {kpi.trendUp !== undefined &&
                  (kpi.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />)}
                {kpi.caption}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Main column */}
        <div className="lg:col-span-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {/* Trend line chart */}
            <div className="md:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">แนวโน้มข่าวและยอดเข้าถึง</h4>
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                  {([7, 30, 90] as const).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRange(r)}
                      className={`px-2 py-1 rounded-md text-[11px] font-semibold transition ${
                        range === r ? 'bg-white text-violet-700 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {r} วัน
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-52 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94A3B8' }} interval={range === 90 ? 1 : Math.max(0, Math.floor(chartData.length / 7))} />
                    <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#94A3B8' }} width={28} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#94A3B8' }} width={36} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 11 }} />
                    <Line yAxisId="left" type="monotone" dataKey="newsCount" name="จำนวนข่าว" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3 }} />
                    <Line yAxisId="right" type="monotone" dataKey="views" name="ยอดเข้าชม" stroke="#EC4899" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-slate-500 mt-1">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500 inline-block" />จำนวนข่าว</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-500 inline-block" />ยอดเข้าชม</span>
              </div>
            </div>

            {/* Category donut */}
            <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
              <h4 className="text-sm font-bold text-slate-900">หมวดหมู่ข่าว</h4>
              <div className="h-32 mt-1 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      dataKey="count"
                      nameKey="category"
                      innerRadius={38}
                      outerRadius={56}
                      paddingAngle={2}
                    >
                      {categoryBreakdown.map(c => (
                        <Cell key={c.category} fill={CATEGORY_COLORS[c.category]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-slate-900">{stats.totalNews}</span>
                  <span className="text-[9px] text-slate-400">ข่าวทั้งหมด</span>
                </div>
              </div>
              <div className="mt-2 space-y-1">
                {categoryBreakdown.map(c => (
                  <div key={c.category} className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 text-slate-600 truncate">
                      <span className="w-2 h-2 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[c.category] }} />
                      <span className="truncate">{c.category}</span>
                    </span>
                    <span className="font-semibold text-slate-800 flex-shrink-0 ml-2">{c.count} ({c.pct}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI insight card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-violet-600" />
              </span>
              <h4 className="text-sm font-bold text-slate-900">ภาพรวมโทนข่าวเบื้องต้น</h4>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                <span className="text-[11px] font-semibold text-emerald-700">ข่าวเชิงบวก/กิจกรรม</span>
                <div className="text-lg font-black text-emerald-800 mt-1">{toneBreakdown.positive} <span className="text-xs font-semibold">({toneBreakdown.positivePct}%)</span></div>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <span className="text-[11px] font-semibold text-slate-600">ข่าวทั่วไป/เป็นกลาง</span>
                <div className="text-lg font-black text-slate-800 mt-1">{toneBreakdown.neutral} <span className="text-xs font-semibold">({toneBreakdown.neutralPct}%)</span></div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              จัดกลุ่มเบื้องต้นจากหมวดหมู่ข่าว — ยังไม่ใช่การวิเคราะห์ภาษาธรรมชาติแบบเต็มรูปแบบ
            </p>
            <button
              type="button"
              onClick={onGoToAiNews}
              className="mt-3 w-full py-2 rounded-xl text-xs font-semibold bg-violet-600 text-white hover:bg-violet-700 transition flex items-center justify-center gap-1.5"
            >
              ดูบทวิเคราะห์ทั้งหมด
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Latest news feed */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-slate-900">ข่าวล่าสุด</h4>
              <div className="flex items-center gap-1 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setFeedFilter('all')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition ${
                    feedFilter === 'all' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  ทั้งหมด
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFeedFilter(cat)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition ${
                      feedFilter === cat ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {filteredFeed.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectNews(item)}
                  className="text-left rounded-xl border border-slate-200 hover:border-violet-300 hover:shadow-sm transition overflow-hidden group"
                >
                  <div className="h-24 bg-slate-100 overflow-hidden">
                    <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded font-semibold"
                        style={{ backgroundColor: `${CATEGORY_COLORS[item.category]}1A`, color: CATEGORY_COLORS[item.category] }}
                      >
                        {item.category}
                      </span>
                      {item.status === 'Published' && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> เผยแพร่แล้ว
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-800 mt-1.5 line-clamp-2 leading-snug group-hover:text-violet-700">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatCompact(item.views)}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{formatCompact(item.likes)}</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </button>
              ))}
              {filteredFeed.length === 0 && (
                <div className="col-span-full text-center py-8 text-xs text-slate-400">ไม่มีข่าวในหมวดหมู่นี้</div>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-4 space-y-5">
          {/* Facebook page tracking */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Facebook className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">การติดตามเพจ Facebook</h4>
              </div>
              <button type="button" onClick={onGoToFacebook} className="text-[11px] font-semibold text-violet-600 hover:underline">
                ดูทั้งหมด
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {initialMonitoredPages.map(page => (
                <div key={page.id} className="p-3 flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                    <Facebook className="w-4 h-4 text-blue-600" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">{page.name}</p>
                    <p className="text-[10px] text-slate-400">ผู้ติดตาม {formatCompact(page.followers)} คน</p>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 flex-shrink-0">{page.postsToday} โพสต์วันนี้</span>
                </div>
              ))}
            </div>
            <div className="p-3">
              <button
                type="button"
                onClick={onGoToFacebook}
                className="w-full py-2 rounded-xl text-xs font-semibold bg-violet-600 text-white hover:bg-violet-700 transition"
              >
                ติดตามเพิ่มเติม +
              </button>
            </div>
          </div>

          {/* Top categories by reach */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bookmark className="w-4 h-4 text-amber-500" />
              <h4 className="text-sm font-bold text-slate-900">หมวดหมู่ยอดนิยม (ตามยอดเข้าชม)</h4>
            </div>
            <div className="space-y-2">
              {topCategoriesByViews.map((c, idx) => (
                <div key={c.category} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="truncate font-semibold text-slate-700">{c.category}</span>
                  </div>
                  <span className="text-slate-400 flex-shrink-0">{formatCompact(c.views)} ({c.sharePct}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick tools */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <h4 className="text-sm font-bold text-slate-900 mb-3">เครื่องมือด่วน</h4>
            <div className="space-y-2">
              <button
                type="button"
                onClick={onOpenCreateNews}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition"
              >
                <Plus className="w-4 h-4" /> สร้างข่าวประชาสัมพันธ์
              </button>
              <button
                type="button"
                onClick={onOpenUploadMedia}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
              >
                <Upload className="w-4 h-4 text-slate-500" /> อัปโหลดสื่อ
              </button>
              <button
                type="button"
                onClick={onGoToMedia}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
              >
                <FolderOpen className="w-4 h-4 text-slate-500" /> จัดการคลังสื่อ (Media Library)
              </button>
              <button
                type="button"
                onClick={onGoToAiNews}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
              >
                <FileBarChart2 className="w-4 h-4 text-slate-500" /> สร้างรายงานสรุป
              </button>
              <button
                type="button"
                onClick={onGoToFacebook}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
              >
                <Settings className="w-4 h-4 text-slate-500" /> ตั้งค่าการติดตาม
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
