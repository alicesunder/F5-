import React, { useState, useMemo } from 'react';
import { downloadFile } from '../../../utils/fileDownloader';
import {
  MediaItem,
  MediaType,
  MediaCategory,
} from '../types';
import {
  Search,
  Upload,
  Image as ImageIcon,
  Video,
  FileText,
  FileSpreadsheet,
  Download,
  Copy,
  Trash2,
  Check,
  Filter,
  Eye,
  FolderOpen,
} from 'lucide-react';

interface MediaLibraryProps {
  mediaList: MediaItem[];
  onOpenUpload: () => void;
  onDeleteMedia: (id: string) => void;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  mediaList,
  onOpenUpload,
  onDeleteMedia,
}) => {
  const primaryColor = '#EE7E9E';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<MediaType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const mediaTypes: { id: MediaType | 'all'; label: string; icon: any }[] = [
    { id: 'all', label: 'ไฟล์ทุกประเภท', icon: FolderOpen },
    { id: 'image', label: 'รูปภาพ', icon: ImageIcon },
    { id: 'video', label: 'วิดีโอ', icon: Video },
    { id: 'pdf', label: 'PDF', icon: FileText },
    { id: 'document', label: 'เอกสาร Word/Excel', icon: FileSpreadsheet },
  ];

  const categories: (MediaCategory | 'all')[] = [
    'all',
    'ข่าว',
    'กิจกรรม',
    'ประชาสัมพันธ์',
    'ประกาศ',
    'ภารกิจ',
    'อื่น ๆ',
  ];

  const filteredMedia = useMemo(() => {
    return mediaList.filter(item => {
      if (selectedType !== 'all' && item.type !== selectedType) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const match =
          item.name.toLowerCase().includes(q) ||
          item.uploadedBy.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [mediaList, selectedType, selectedCategory, searchTerm]);

  const handleCopyLink = (item: MediaItem) => {
    navigator.clipboard?.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-rose-100/80 shadow-sm overflow-hidden text-[#1F2937]">
      {/* Header Toolbar */}
      <div className="p-5 sm:p-6 border-b border-slate-100 bg-rose-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />
              <h3 className="text-base font-bold text-slate-900">
                คลังสื่อประชาสัมพันธ์ดิจิทัล (Digital Media Assets & Repository)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              ศูนย์จัดเก็บภาพถ่ายความละเอียดสูง คลิปวิดีโอภารกิจ เอกสารแถลงข่าว และอินโฟกราฟิก
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenUpload}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition hover:opacity-90 active:scale-95 cursor-pointer self-start sm:self-auto"
            style={{ backgroundColor: primaryColor }}
          >
            <Upload className="w-4 h-4" />
            <span>อัปโหลดไฟล์สื่อใหม่</span>
          </button>
        </div>

        {/* Media Types Filter Tabs */}
        <div className="mt-5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {mediaTypes.map(t => {
            const Icon = t.icon;
            const isSelected = selectedType === t.id;
            const count =
              t.id === 'all'
                ? mediaList.length
                : mediaList.filter(m => m.type === t.id).length;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedType(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
                style={{
                  backgroundColor: isSelected ? primaryColor : undefined,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Pills & Search Row */}
        <div className="mt-3.5 pt-3.5 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Categories */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap mr-1">
              หมวดหมู่:
            </span>
            {categories.map(c => {
              const isSelected = selectedCategory === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCategory(c)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {c === 'all' ? 'ทุกหมวด' : c}
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อไฟล์ หรือผู้บันทึก..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-xs space-y-2">
          <p>ไม่พบไฟล์สื่อที่ตรงกับเงื่อนไข</p>
          <button
            type="button"
            onClick={onOpenUpload}
            className="text-xs text-rose-600 font-semibold hover:underline"
          >
            + อัปโหลดไฟล์ใหม่เข้าสู่คลังสื่อ
          </button>
        </div>
      ) : (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map(item => {
            return (
              <div
                key={item.id}
                className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Container */}
                  <div className="relative h-36 w-full bg-slate-100 overflow-hidden flex items-center justify-center">
                    {item.type === 'image' ? (
                      <img
                        src={item.thumbnail || item.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : item.type === 'video' ? (
                      <div className="relative w-full h-full">
                        <img
                          src={item.thumbnail || item.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-rose-600 shadow-md">
                            <Video className="w-5 h-5 ml-0.5" />
                          </div>
                        </div>
                        {item.duration && (
                          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-white font-mono text-[10px]">
                            {item.duration}
                          </span>
                        )}
                      </div>
                    ) : item.type === 'pdf' ? (
                      <div className="flex flex-col items-center gap-1 text-rose-600">
                        <FileText className="w-12 h-12" />
                        <span className="text-[10px] font-bold font-mono uppercase bg-rose-50 text-rose-700 px-2 py-0.5 rounded">
                          PDF Document
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-blue-600">
                        <FileSpreadsheet className="w-12 h-12" />
                        <span className="text-[10px] font-bold font-mono uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                          Office File
                        </span>
                      </div>
                    )}

                    {/* Category badge */}
                    <div className="absolute top-2 left-2">
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-xs backdrop-blur-md"
                        style={{ backgroundColor: `${primaryColor}F0` }}
                      >
                        {item.category}
                      </span>
                    </div>

                    {/* Size badge */}
                    <div className="absolute bottom-2 left-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-900/70 text-white font-mono text-[9px]">
                        {item.size}
                      </span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="p-3">
                    <h5 className="text-xs font-bold text-slate-900 truncate" title={item.name}>
                      {item.name}
                    </h5>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>{item.uploadedBy}</span>
                      <span className="font-mono">{item.uploadedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="px-3 py-2 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-mono">
                    ดาวน์โหลด: {item.downloadCount}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(item)}
                      className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition"
                      title="คัดลอกลิงก์ไฟล์"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadFile(item.name)}
                      className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition cursor-pointer"
                      title="ดาวน์โหลดไฟล์"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`คุณต้องการลบไฟล์ "${item.name}" ออกจากคลังสื่อใช่หรือไม่?`)) {
                          onDeleteMedia(item.id);
                        }
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="ลบไฟล์"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
