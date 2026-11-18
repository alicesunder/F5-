import React from 'react';
import { useAdmin } from '../../../contexts/AdminContext';
import { RelationsActiveTab } from '../types';
import { UserHeaderBadge } from '../../../components/common/UserHeaderBadge';
import {
  ArrowLeft,
  Megaphone,
  Plus,
  Upload,
  Globe,
  FileText,
  Image as ImageIcon,
  Radio,
  Sparkles,
} from 'lucide-react';

interface RelationsHeaderProps {
  activeTab: RelationsActiveTab;
  onSelectTab: (tab: RelationsActiveTab) => void;
  onOpenCreateNews: () => void;
  onOpenUploadMedia: () => void;
}

export const RelationsHeader: React.FC<RelationsHeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenCreateNews,
  onOpenUploadMedia,
}) => {
  const { navigateModule } = useAdmin();

  const tabs: { id: RelationsActiveTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'operations', label: 'ศูนย์ปฏิบัติการ PR (Operations Studio)', icon: Radio, badge: 'LIVE' },
    { id: 'management', label: 'ระบบจัดการข่าว (News CMS)', icon: FileText },
    { id: 'media', label: 'คลังสื่อดิจิทัล (Media Library)', icon: ImageIcon },
    { id: 'public', label: 'พอร์ทัลข่าวประชาชน (Public Portal)', icon: Globe },
  ];

  return (
    <header className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      <div
        className="relative rounded-3xl overflow-hidden text-white shadow-xl border border-white/15"
        style={{
          background: 'linear-gradient(135deg, #082F49 0%, #0369A1 42%, #2583D8 75%, #38BDF8 100%)',
        }}
      >
        {/* 4-Color Spectrum Top Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#2583D8] via-[#38BDF8] via-[#EC4899] to-[#8B46C8]" />

        {/* Ambient Broadcast Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-cyan-400/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.45) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 p-5 sm:p-7 space-y-5">
          {/* Top Identity & Actions Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigateModule('dashboard')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition cursor-pointer backdrop-blur-md"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>กลับศูนย์บัญชาการหลัก</span>
                </button>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-sky-400/20 border border-sky-300/30 text-[11px] font-mono font-bold text-sky-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  PR & MEDIA BROADCAST STUDIO • /relations
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-lg shrink-0">
                  <Megaphone className="w-6 h-6 sm:w-7 sm:h-7 text-sky-200" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
                    สายงานประชาสัมพันธ์และสื่อสารองค์กร
                  </h1>
                  <p className="text-xs sm:text-sm text-sky-100/85 mt-0.5">
                    ศูนย์ปฏิบัติการข่าวสาร ผลิตสื่อดิจิทัล คลังภาพกิจกรรม และเผยแพร่ภารกิจ ตชด. สู่ประชาชน
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={onOpenUploadMedia}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition cursor-pointer backdrop-blur-md"
              >
                <Upload className="w-4 h-4 text-sky-200" />
                <span>อัปโหลดสื่อใหม่</span>
              </button>

              <button
                type="button"
                onClick={onOpenCreateNews}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 text-xs font-black shadow-lg transition active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>สร้างข่าวประชาสัมพันธ์</span>
              </button>

              <div className="hidden sm:block pl-1">
                <UserHeaderBadge />
              </div>
            </div>
          </div>

          {/* Sub-Navigation Studio Dock */}
          <div className="pt-3 border-t border-white/15 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-[#0369A1] shadow-md scale-[1.02]'
                      : 'text-sky-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#2583D8]' : 'text-sky-200'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`px-1.5 py-0.2 rounded-md text-[9px] font-black font-mono ${
                        isActive ? 'bg-rose-500 text-white' : 'bg-pink-500/80 text-white'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
