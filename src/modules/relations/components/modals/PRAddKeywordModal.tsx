import React, { useState } from 'react';
import { X, TrendingUp, Plus } from 'lucide-react';
import { usePRIntel } from '../../context/PRIntelContext';
import { KeywordPriority } from '../../types/bppTypes';

export const PRAddKeywordModal: React.FC = () => {
  const { isAddKeywordOpen, setIsAddKeywordOpen, addKeyword } = usePRIntel();

  const [keyword, setKeyword] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<KeywordPriority>('high');
  const [color, setColor] = useState('#2563EB');

  if (!isAddKeywordOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    addKeyword({
      keyword: keyword.replace(/^#/, '').trim(),
      description,
      priority,
      color,
      notificationEnabled: true,
    });

    setKeyword('');
    setDescription('');
    setIsAddKeywordOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-pink-50 text-pink-700">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-[#1E1B4B]">เพิ่มคำค้นเฝ้าระวังใหม่</h2>
          </div>
          <button
            onClick={() => setIsAddKeywordOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              คำค้น / แฮชแท็ก <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="เช่น การช่วยเหลือผู้ประสบภัย, ชายแดนแม่สอด..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500 text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">รายละเอียดและวัตถุประสงค์</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ติดตามประเด็นข่าวด่วนหรือสถานการณ์เฉพาะกิจ..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">ระดับความสำคัญ</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as KeywordPriority)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500 text-xs bg-white"
              >
                <option value="urgent">เร่งด่วน (Urgent)</option>
                <option value="high">สูง (High)</option>
                <option value="medium">ปานกลาง (Medium)</option>
                <option value="low">ปกติ (Low)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">รหัสสีระบุหมวด</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-9 p-1 rounded-xl border border-slate-200 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddKeywordOpen(false)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#27265B] hover:bg-[#1E1B4B] text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              บันทึกคำค้น
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
