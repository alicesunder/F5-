import React, { useState } from 'react';
import { SlideDeck, SlideItem, SlideLayout } from '../../types/slides';
import { X, Check, Trash2, Plus, Image as ImageIcon } from 'lucide-react';

interface SlideEditorModalProps {
  isOpen: boolean;
  slide: SlideItem | null;
  deck: SlideDeck;
  onClose: () => void;
  onSave: (updatedSlide: SlideItem) => void;
  onDelete?: (slideId: string) => void;
}

export const SlideEditorModal: React.FC<SlideEditorModalProps> = ({
  isOpen,
  slide,
  deck,
  onClose,
  onSave,
  onDelete,
}) => {
  if (!isOpen || !slide) return null;

  const [title, setTitle] = useState(slide.title);
  const [subtitle, setSubtitle] = useState(slide.subtitle || '');
  const [badge, setBadge] = useState(slide.badge || '');
  const [layout, setLayout] = useState<SlideLayout>(slide.layout);
  const [bullets, setBullets] = useState(slide.bullets || []);
  const [speakerNotes, setSpeakerNotes] = useState(slide.speakerNotes || '');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    slide.imageIndex ?? null
  );

  const handleAddBullet = () => {
    setBullets([
      ...bullets,
      {
        title: 'หัวข้อย่อยใหม่',
        description: 'รายละเอียดเนื้อหาที่ต้องการนำเสนอ',
      },
    ]);
  };

  const handleUpdateBullet = (index: number, field: 'title' | 'description', val: string) => {
    const next = [...bullets];
    next[index] = { ...next[index], [field]: val };
    setBullets(next);
  };

  const handleRemoveBullet = (index: number) => {
    setBullets(bullets.filter((_, idx) => idx !== index));
  };

  const handleSave = () => {
    onSave({
      ...slide,
      title,
      subtitle,
      badge,
      layout,
      bullets,
      speakerNotes,
      imageIndex: selectedImageIndex,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">
              แก้ไขสไลด์
            </h3>
            <p className="text-xs text-slate-500">
              ปรับเปลี่ยนหัวข้อ เนื้อหา เลย์เอาต์ และรูปภาพประกอบสไลด์นี้
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Layout Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              รูปแบบเลย์เอาต์ (Slide Layout)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'title', label: 'หน้าปก (Cover)' },
                { id: 'split-image', label: 'แยกคอลัมน์ + ภาพ' },
                { id: 'cards', label: 'การ์ด 3 กล่อง' },
                { id: 'bullets', label: 'รายการประเด็น' },
                { id: 'stats', label: 'สถิติ / KPIs' },
                { id: 'timeline', label: 'ไทม์ไลน์' },
                { id: 'conclusion', label: 'สรุป / ปิดท้าย' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLayout(opt.id as SlideLayout)}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition ${
                    layout === opt.id
                      ? 'bg-[#27265B] text-white border-[#27265B] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ป้ายกำกับ / หมวดหมู่
              </label>
              <input
                type="text"
                value={badge}
                onChange={e => setBadge(e.target.value)}
                placeholder="เช่น ภารกิจเร่งด่วน"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#27265B] outline-hidden"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                หัวข้อสไลด์ *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="ระบุหัวข้อสไลด์"
                className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#27265B] outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              คำอธิบายเสริม / ประโยคสรุป
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              placeholder="คำบรรยายสั้นใต้หัวข้อ"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#27265B] outline-hidden"
            />
          </div>

          {/* Image Selection for this slide */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#27265B]" />
              <span>เลือกรูปภาพสำหรับสไลด์นี้</span>
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedImageIndex(null)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition ${
                  selectedImageIndex === null
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                ไม่ใส่รูปภาพ
              </button>

              {deck.images.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl border transition ${
                    selectedImageIndex === idx
                      ? 'border-[#27265B] bg-[#27265B]/10 ring-2 ring-[#27265B]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <img
                    src={img.dataUrl}
                    alt={img.name}
                    className="w-8 h-8 rounded object-cover"
                  />
                  <span className="text-xs font-medium text-slate-800 max-w-[120px] truncate">
                    รูป #{idx + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bullets List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                เนื้อหาและประเด็นย่อย ({bullets.length})
              </label>
              <button
                type="button"
                onClick={handleAddBullet}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#27265B] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่มประเด็น</span>
              </button>
            </div>

            <div className="space-y-2">
              {bullets.map((b, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={b.title}
                      onChange={e => handleUpdateBullet(idx, 'title', e.target.value)}
                      placeholder="หัวข้อย่อย"
                      className="w-3/4 px-2 py-1 text-xs font-bold bg-white border border-slate-300 rounded focus:ring-1 focus:ring-[#27265B] outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveBullet(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                      title="ลบรายการนี้"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    value={b.description}
                    onChange={e => handleUpdateBullet(idx, 'description', e.target.value)}
                    rows={2}
                    placeholder="คำอธิบายรายละเอียด"
                    className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded focus:ring-1 focus:ring-[#27265B] outline-hidden"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Speaker Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              บทพูดสำหรับผู้นำเสนอ (Speaker Notes)
            </label>
            <textarea
              value={speakerNotes}
              onChange={e => setSpeakerNotes(e.target.value)}
              rows={2}
              placeholder="บันทึกช่วยจำสำหรับพูดในสไลด์นี้ (จะปรากฏในเอกสาร PowerPoint และโหมดการนำเสนอ)"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#27265B] outline-hidden text-slate-700"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('คุณต้องการลบสไลด์นี้ใช่หรือไม่?')) {
                    onDelete(slide.id);
                    onClose();
                  }
                }}
                className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition inline-flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบสไลด์นี้</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-[#27265B] hover:bg-[#1E1D4A] rounded-xl shadow-xs transition inline-flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>บันทึกการแก้ไข</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
