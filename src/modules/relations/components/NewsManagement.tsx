import React, { useState, useMemo } from 'react';
import {
  NewsItem,
  NewsStatus,
  NewsCategory,
} from '../types';
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  FileEdit,
  Archive,
  Calendar,
  User,
  Tag,
  LayoutGrid,
  Table as TableIcon,
  Globe,
  Share2,
  Sparkles,
  ArrowUpRight,
  MoreVertical,
} from 'lucide-react';

interface NewsManagementProps {
  newsList: NewsItem[];
  onOpenCreate: () => void;
  onSelectNews: (news: NewsItem) => void;
  onEditNews: (news: NewsItem) => void;
  onDeleteNews: (id: string) => void;
  onPublishNews: (id: string) => void;
  onUnpublishNews: (id: string) => void;
  onStatusChange: (id: string, status: NewsStatus) => void;
  selectedStatusFilter?: NewsStatus | 'all';
  onClearStatusFilter?: () => void;
}

export const NewsManagement: React.FC<NewsManagementProps> = ({
  newsList,
  onOpenCreate,
  onSelectNews,
  onEditNews,
  onDeleteNews,
  onPublishNews,
  onUnpublishNews,
  onStatusChange,
  selectedStatusFilter = 'all',
  onClearStatusFilter,
}) => {
  const primaryColor = '#EE7E9E';

  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<NewsStatus | 'all'>(selectedStatusFilter);
  const [categoryFilter, setCategoryFilter] = useState<NewsCategory | 'all'>('all');
  const [authorFilter, setAuthorFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Update internal filter if prop changes
  React.useEffect(() => {
    if (selectedStatusFilter) {
      setStatusFilter(selectedStatusFilter);
    }
  }, [selectedStatusFilter]);

  // Unique Authors list
  const authors = useMemo(() => {
    const set = new Set<string>();
    newsList.forEach(n => set.add(n.author));
    return Array.from(set);
  }, [newsList]);

  // Categories list
  const categories: { id: NewsCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'ทุกหมวดหมู่' },
    { id: 'ข่าวสารทั่วไป', label: 'ข่าวสารทั่วไป' },
    { id: 'กิจกรรมและโครงการ', label: 'กิจกรรมและโครงการ' },
    { id: 'ประชาสัมพันธ์', label: 'ประชาสัมพันธ์' },
    { id: 'ประกาศทางการ', label: 'ประกาศทางการ' },
    { id: 'ภารกิจผู้บริหาร', label: 'ภารกิจผู้บริหาร' },
    { id: 'อื่น ๆ', label: 'อื่น ๆ' },
  ];

  const statuses: { id: NewsStatus | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'ทั้งหมด', count: newsList.length },
    { id: 'Published', label: 'เผยแพร่แล้ว', count: newsList.filter(n => n.status === 'Published').length },
    { id: 'Draft', label: 'ฉบับร่าง', count: newsList.filter(n => n.status === 'Draft').length },
    { id: 'Pending', label: 'รออนุมัติ', count: newsList.filter(n => n.status === 'Pending').length },
    { id: 'Archived', label: 'เก็บถาวร', count: newsList.filter(n => n.status === 'Archived').length },
  ];

  // Filtering Logic
  const filteredNews = useMemo(() => {
    return newsList.filter(item => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (authorFilter !== 'all' && item.author !== authorFilter) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const match =
          item.title.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) ||
          item.author.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.tags.some(t => t.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [newsList, statusFilter, categoryFilter, authorFilter, searchTerm]);

  return (
    <div className="bg-white rounded-3xl border border-rose-100/80 shadow-sm overflow-hidden text-[#1F2937]">
      {/* Top Toolbar */}
      <div className="p-5 sm:p-6 border-b border-slate-100 bg-rose-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />
              <h3 className="text-base font-bold text-slate-900">
                ระบบจัดการและเรียบเรียงข่าวสาร (News Content CMS)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              เขียนข่าว บันทึกฉบับร่าง ส่งตรวจสอบ และเผยแพร่สู่ช่องทางสื่อสารภาครัฐ
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 text-slate-600">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
                }`}
                title="มุมมองการ์ดข่าว"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
                }`}
                title="มุมมองตาราง"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Create News Button */}
            <button
              type="button"
              onClick={onOpenCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition hover:opacity-90 active:scale-95 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>สร้างข่าวประชาสัมพันธ์</span>
            </button>
          </div>
        </div>

        {/* Status Filter Pills Row */}
        <div className="mt-5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {statuses.map(s => {
            const isSelected = statusFilter === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStatusFilter(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
                style={{
                  backgroundColor: isSelected ? primaryColor : undefined,
                }}
              >
                <span>{s.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {s.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search and Secondary Filter Row */}
        <div className="mt-3.5 pt-3.5 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อข่าว รหัส หรือแท็ก..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value as any)}
              className="w-full py-2 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 focus:outline-none"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Author Filter */}
          <div>
            <select
              value={authorFilter}
              onChange={e => setAuthorFilter(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 focus:outline-none truncate"
            >
              <option value="all">ผู้เขียนทั้งหมด</option>
              {authors.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setCategoryFilter('all');
                setAuthorFilter('all');
                onClearStatusFilter?.();
              }}
              className="text-xs text-slate-500 hover:text-slate-800 hover:underline px-2 py-1"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredNews.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-xs space-y-2">
          <p>ไม่พบข่าวสารที่ตรงกับเงื่อนไขการค้นหา</p>
          <button
            type="button"
            onClick={onOpenCreate}
            className="text-xs text-rose-600 font-semibold hover:underline"
          >
            + เริ่มต้นสร้างข่าวสารใหม่
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* Modern Cards Grid View */
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNews.map(item => {
            return (
              <div
                key={item.id}
                className="group relative bg-white rounded-3xl border border-slate-200/90 overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:border-rose-200 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Cover */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                    {/* Category Pill on Image */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span
                        className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold text-white shadow-xs backdrop-blur-md"
                        style={{ backgroundColor: `${primaryColor}EE` }}
                      >
                        {item.category}
                      </span>
                      {item.isFeatured && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-400 text-slate-900 shadow-xs flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>ข่าวเด่น</span>
                        </span>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-semibold backdrop-blur-md shadow-xs ${
                          item.status === 'Published'
                            ? 'bg-emerald-500/90 text-white'
                            : item.status === 'Draft'
                            ? 'bg-slate-700/90 text-white'
                            : item.status === 'Pending'
                            ? 'bg-amber-500/90 text-white'
                            : 'bg-slate-500/90 text-white'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {/* Views on bottom right of cover */}
                    <div className="absolute bottom-2 right-3 text-[11px] text-white/90 font-mono flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{item.views.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="font-mono">{item.id}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{item.date}</span>
                      </span>
                    </div>

                    <h4
                      onClick={() => onSelectNews(item)}
                      className="text-sm font-bold text-slate-900 line-clamp-2 hover:text-rose-600 cursor-pointer transition leading-snug"
                    >
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 truncate max-w-[170px]">
                    <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate text-[11px]">{item.author}</span>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onSelectNews(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 transition"
                      title="อ่านและดูตัวอย่าง"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditNews(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 transition"
                      title="แก้ไขข่าว"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    {item.status === 'Published' ? (
                      <button
                        type="button"
                        onClick={() => onUnpublishNews(item.id)}
                        className="px-2 py-1 rounded-lg text-[10px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition"
                        title="ยกเลิกการเผยแพร่กลับเป็นฉบับร่าง"
                      >
                        ยกเลิกเผยแพร่
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onPublishNews(item.id)}
                        className="px-2 py-1 rounded-lg text-[10px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
                        title="เผยแพร่ข่าวสู่สาธารณะ"
                      >
                        เผยแพร่
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`คุณต้องการลบข่าว "${item.title}" ใช่หรือไม่?`)) {
                          onDeleteNews(item.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="ลบข่าว"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table List View */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-mono text-[11px] bg-slate-50/60">
                <th className="py-3 px-5 font-semibold">รหัส / หัวข้อข่าว</th>
                <th className="py-3 px-3 font-semibold">หมวดหมู่</th>
                <th className="py-3 px-3 font-semibold">ผู้เขียน</th>
                <th className="py-3 px-3 font-semibold">วันที่</th>
                <th className="py-3 px-3 font-semibold text-right">ยอดเข้าชม</th>
                <th className="py-3 px-3 font-semibold text-center">สถานะ</th>
                <th className="py-3 px-5 font-semibold text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNews.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-5">
                    <div className="flex items-start gap-3">
                      <img
                        src={item.coverImage}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-slate-100 border border-slate-200"
                      />
                      <div>
                        <div className="font-mono text-[10px] text-slate-400 font-bold">{item.id}</div>
                        <div
                          onClick={() => onSelectNews(item)}
                          className="font-semibold text-slate-900 hover:text-rose-600 cursor-pointer line-clamp-1 max-w-sm"
                        >
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {item.summary}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                      {item.category}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-600 truncate max-w-[150px]">
                    {item.author}
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                    {item.date}
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-semibold text-slate-700">
                    {item.views.toLocaleString()}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <select
                      value={item.status}
                      onChange={e => onStatusChange(item.id, e.target.value as NewsStatus)}
                      className={`py-1 px-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                        item.status === 'Published'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : item.status === 'Draft'
                          ? 'bg-slate-100 text-slate-700 border-slate-200'
                          : item.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                      <option value="Pending">Pending</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </td>

                  <td className="py-3 px-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onSelectNews(item)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                        title="ดูรายละเอียด"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditNews(item)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                        title="แก้ไขข่าว"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`คุณต้องการลบข่าว "${item.title}" ใช่หรือไม่?`)) {
                            onDeleteNews(item.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="ลบข่าว"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
