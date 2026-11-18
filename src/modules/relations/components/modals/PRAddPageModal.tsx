import React, { useState } from 'react';
import { X, Users, Plus } from 'lucide-react';
import { usePRIntel } from '../../context/PRIntelContext';

export const PRAddPageModal: React.FC = () => {
  const { isAddPageOpen, setIsAddPageOpen, addPage } = usePRIntel();

  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [category, setCategory] = useState('');
  const [followers, setFollowers] = useState(150000);

  if (!isAddPageOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addPage({
      name: name.trim(),
      handle: handle.startsWith('@') ? handle : `@${handle.trim()}`,
      category,
      followers: Number(followers),
      avatar: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=120&auto=format&fit=crop&q=80',
      verified: true,
    });

    setName('');
    setHandle('');
    setIsAddPageOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-pink-50 text-pink-700">
              <Users className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-[#1E1B4B]">เพิ่มเพจสื่อหรือเพจติดตามใหม่</h2>
          </div>
          <button
            onClick={() => setIsAddPageOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              ชื่อเพจ / สื่อ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น ข่าวสด, ไทยรัฐนิวส์..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500 text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Handle / Page URL</label>
            <input
              type="text"
              required
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="เช่น @khaosod, @thairath..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">หมวดหมู่</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500 text-xs bg-white"
              >
                <option value="สำนักข่าวหลัก">สำนักข่าวหลัก</option>
                <option value="ความมั่นคงชายแดน">ความมั่นคงชายแดน</option>
                <option value="จิตอาสาและสังคม">จิตอาสาและสังคม</option>
                <option value="ชุมชนและท้องถิ่น">ชุมชนและท้องถิ่น</option>
                <option value="หน่วยงานตำรวจ">หน่วยงานตำรวจ</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">จำนวนผู้ติดตาม</label>
              <input
                type="number"
                value={followers}
                onChange={(e) => setFollowers(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500 text-xs"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddPageOpen(false)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#27265B] hover:bg-[#1E1B4B] text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              บันทึกเพจ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
