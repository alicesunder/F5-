import React, { useState } from 'react';
import { MediaType, MediaCategory } from '../types';
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Video,
  FileText,
  FileSpreadsheet,
  Check,
} from 'lucide-react';

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: any) => void;
}

export const MediaUploadModal: React.FC<MediaUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const primaryColor = '#EE7E9E';

  const [name, setName] = useState('');
  const [type, setType] = useState<MediaType>('image');
  const [category, setCategory] = useState<MediaCategory>('ประชาสัมพันธ์');
  const [uploadedBy, setUploadedBy] = useState('ฝ่ายประชาสัมพันธ์และสื่อสารดิจิทัล');
  const [url, setUrl] = useState('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpload({
      name: name || `ไฟล์สื่อประชาสัมพันธ์_${Date.now().toString().slice(-4)}`,
      type,
      category,
      url,
      thumbnail: type === 'image' ? url : undefined,
      size: type === 'video' ? '35.4 MB' : type === 'image' ? '2.8 MB' : '1.2 MB',
      duration: type === 'video' ? '03:15 นาที' : undefined,
      uploadedBy,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden text-[#1F2937]">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-rose-50/40">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">อัปโหลดไฟล์สื่อประชาสัมพันธ์</h3>
              <p className="text-[11px] text-slate-500 font-mono">UPLOAD MEDIA ASSET</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* File Type Selection */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">ประเภทไฟล์</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'image', label: 'รูปภาพ', icon: ImageIcon },
                { id: 'video', label: 'วิดีโอ', icon: Video },
                { id: 'pdf', label: 'PDF', icon: FileText },
                { id: 'document', label: 'เอกสาร', icon: FileSpreadsheet },
              ].map(t => {
                const Icon = t.icon;
                const isSelected = type === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id as MediaType)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50 text-rose-800 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px]">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">ชื่อไฟล์สื่อ</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="เช่น ภาพภารกิจแจกถุงยังชีพ_แม่สาย.jpg"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">หมวดหมู่สื่อ</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as MediaCategory)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
            >
              <option value="ข่าว">ข่าว</option>
              <option value="กิจกรรม">กิจกรรม</option>
              <option value="ประชาสัมพันธ์">ประชาสัมพันธ์</option>
              <option value="ประกาศ">ประกาศ</option>
              <option value="ภารกิจ">ภารกิจ</option>
              <option value="อื่น ๆ">อื่น ๆ</option>
            </select>
          </div>

          {/* Mock URL */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">URL หรือไฟล์จำลอง</label>
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-[11px]"
            />
          </div>

          {/* Uploaded By */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">ผู้บันทึก/สังกัด</label>
            <input
              type="text"
              value={uploadedBy}
              onChange={e => setUploadedBy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-white font-semibold shadow-xs transition hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              บันทึกเข้าคลังสื่อ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
