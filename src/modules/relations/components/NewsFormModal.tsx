import React, { useState, useEffect } from 'react';
import {
  NewsItem,
  NewsStatus,
  NewsCategory,
  NewsAttachment,
} from '../types';
import {
  X,
  Save,
  Send,
  FileText,
  Image as ImageIcon,
  Paperclip,
  Calendar,
  User,
  Tag,
  Sparkles,
  UploadCloud,
  Check,
} from 'lucide-react';

interface NewsFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newsData: any) => void;
  initialData?: NewsItem | null;
}

const defaultCovers = [
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
];

export const NewsFormModal: React.FC<NewsFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const primaryColor = '#EE7E9E';

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<NewsCategory>('ข่าวสารทั่วไป');
  const [coverImage, setCoverImage] = useState(defaultCovers[0]);
  const [gallery, setGallery] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<NewsAttachment[]>([]);
  const [status, setStatus] = useState<NewsStatus>('Draft');
  const [isFeatured, setIsFeatured] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setSummary(initialData.summary);
      setContent(initialData.content);
      setDate(initialData.date);
      setAuthor(initialData.author);
      setCategory(initialData.category);
      setCoverImage(initialData.coverImage);
      setGallery(initialData.gallery || []);
      setAttachments(initialData.attachments || []);
      setStatus(initialData.status);
      setIsFeatured(initialData.isFeatured);
      setTagsInput(initialData.tags?.join(', ') || '');
    } else {
      // Default reset
      setTitle('');
      setSummary('');
      setContent('');
      setDate('');
      setAuthor('');
      setCategory('ข่าวสารทั่วไป');
      setCoverImage(defaultCovers[0]);
      setGallery([]);
      setAttachments([]);
      setStatus('Draft');
      setIsFeatured(false);
      setTagsInput('ประชาสัมพันธ์, กิจกรรม');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddGalleryMock = () => {
    const randomImgs = [
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    ];
    const picked = randomImgs[gallery.length % randomImgs.length];
    setGallery(prev => [...prev, picked]);
  };

  const handleAddAttachmentMock = (type: 'pdf' | 'document') => {
    const newAtt: NewsAttachment = {
      id: `att-${Date.now()}`,
      name:
        type === 'pdf'
          ? `เอกสารแถลงข่าวและกำหนดการ_${Date.now().toString().slice(-4)}.pdf`
          : `แบบฟอร์มลงทะเบียน_${Date.now().toString().slice(-4)}.docx`,
      url: '#',
      size: type === 'pdf' ? '2.1 MB' : '450 KB',
      type,
    };
    setAttachments(prev => [...prev, newAtt]);
  };

  const handleSave = (targetStatus?: NewsStatus) => {
    const finalStatus = targetStatus || status;
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      summary: summary || title.slice(0, 120),
      content,
      date,
      author,
      category,
      coverImage,
      gallery,
      attachments,
      status: finalStatus,
      isFeatured,
      tags,
    };

    onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full my-8 overflow-hidden text-[#1F2937]">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-rose-50/40">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialData ? 'แก้ไขเนื้อหาข่าวประชาสัมพันธ์' : 'เขียนข่าวประชาสัมพันธ์ใหม่'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                NEWS ARTICLE & PUBLIC BROADCAST EDITOR
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
          {/* Title */}
          <div>
            <label className="block font-bold text-slate-800 mb-1.5">
              หัวข้อข่าว <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="พาดหัวข่าวประชาสัมพันธ์ เช่น สรุปผลการปฏิบัติการช่วยเหลือผู้ประสบภัย..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 font-medium"
            />
          </div>

          {/* Category, Author, Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">หมวดหมู่ข่าว</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as NewsCategory)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="ข่าวสารทั่วไป">ข่าวสารทั่วไป</option>
                <option value="กิจกรรมและโครงการ">กิจกรรมและโครงการ</option>
                <option value="ประชาสัมพันธ์">ประชาสัมพันธ์</option>
                <option value="ประกาศทางการ">ประกาศทางการ</option>
                <option value="ภารกิจผู้บริหาร">ภารกิจผู้บริหาร</option>
                <option value="อื่น ๆ">อื่น ๆ</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">ผู้เผยแพร่ / ผู้เขียน</label>
              <input
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">วันที่ระบุในข่าว</label>
              <input
                type="text"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
              />
            </div>
          </div>

          {/* Cover Image Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              รูปภาพหน้าปก (Cover Image)
            </label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {defaultCovers.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setCoverImage(img)}
                  className={`relative h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition ${
                    coverImage === img ? 'border-rose-500 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  {coverImage === img && (
                    <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center text-rose-600 font-bold">
                      <Check className="w-4 h-4 text-white drop-shadow-sm" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <input
              type="text"
              value={coverImage}
              onChange={e => setCoverImage(e.target.value)}
              placeholder="หรือใส่ URL รูปภาพหน้าปกที่ต้องการ..."
              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] font-mono"
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              บทสรุปย่อ (Lead / Summary)
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="คำโปรยย่อสำหรับแสดงบนการ์ดข่าวและฟีดโซเชียล..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>

          {/* Content Body */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              เนื้อหาข่าวฉบับเต็ม (Full Article Content) <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={6}
              required
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="พิมพ์เนื้อหาข่าวประชาสัมพันธ์ ข้อเท็จจริง แถลงการณ์ หรือรายละเอียดกิจกรรม..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-300 leading-relaxed font-sans"
            />
          </div>

          {/* Gallery Images Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800">
                รูปภาพประกอบข่าว ({gallery.length} ภาพ)
              </span>
              <button
                type="button"
                onClick={handleAddGalleryMock}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
                <span>+ เพิ่มภาพประกอบ</span>
              </button>
            </div>

            {gallery.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {gallery.map((img, i) => (
                  <div key={i} className="relative group h-20 rounded-xl overflow-hidden bg-slate-200">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setGallery(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 p-1 rounded bg-black/60 text-white hover:bg-rose-600 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-[11px]">ยังไม่มีรูปภาพประกอบเพิ่มเติม</p>
            )}
          </div>

          {/* Documents Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800">
                เอกสารแนบสำหรับดาวน์โหลด ({attachments.length} รายการ)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAddAttachmentMock('pdf')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
                >
                  <Paperclip className="w-3.5 h-3.5 text-rose-500" />
                  <span>+ แนบ PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddAttachmentMock('document')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  <span>+ แนบ Word</span>
                </button>
              </div>
            </div>

            {attachments.length > 0 ? (
              <div className="space-y-1.5">
                {attachments.map(att => (
                  <div
                    key={att.id}
                    className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Paperclip className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      <span className="font-semibold text-slate-700 truncate">{att.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({att.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachments(prev => prev.filter(a => a.id !== att.id))}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-[11px]">ไม่มีเอกสารดาวน์โหลดแนบ</p>
            )}
          </div>

          {/* Meta & Status Settings Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">แท็กคำค้นหา (คั่นด้วยจุลภาค)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="เช่น ผู้ว่าฯ, น้ำท่วม, ช่วยเหลือ"
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="flex items-center gap-4 pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-800 font-semibold">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={e => setIsFeatured(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-0 w-4 h-4"
                />
                <span>ตั้งเป็น "ข่าวเด่น" (Featured News)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-200 transition cursor-pointer"
          >
            ยกเลิก
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSave('Draft')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-slate-500" />
              <span>บันทึกฉบับร่าง</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave('Published')}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              <Send className="w-3.5 h-3.5" />
              <span>เผยแพร่ทันที</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
