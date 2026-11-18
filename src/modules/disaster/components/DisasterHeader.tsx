import React from 'react';
import { useAdmin } from '../../../contexts/AdminContext';
import { UserHeaderBadge } from '../../../components/common/UserHeaderBadge';
import {
  ArrowLeft,
  ShieldAlert,
  Radio,
  Plus,
  FileSpreadsheet,
  Layers,
  MapPin,
  Waves,
  ClipboardList,
  FileText,
  Sparkles,
  Navigation,
  CloudRain,
} from 'lucide-react';

export type DisasterActiveTab =
  | 'overview'
  | 'heavy-rain'
  | 'map'
  | 'flood'
  | 'stations'
  | 'bpp-tracker'
  | 'incidents'
  | 'reports'
  | 'smart-ops';

interface DisasterHeaderProps {
  activeTab: DisasterActiveTab;
  onSelectTab: (tab: DisasterActiveTab) => void;
  onOpenNewIncidentModal: () => void;
  onOpenAlertModal: () => void;
  onOpenExportModal: () => void;
}

export const DisasterHeader: React.FC<DisasterHeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenNewIncidentModal,
  onOpenAlertModal,
  onOpenExportModal,
}) => {
  const { navigateModule } = useAdmin();

  const tabItems: { id: DisasterActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'ภาพรวมระบบ', icon: <Layers className="w-4 h-4" /> },
    { id: 'heavy-rain', label: 'แผนที่ฝนตกหนัก & เรดาร์', icon: <CloudRain className="w-4 h-4" /> },
    { id: 'map', label: 'แผนที่สถานการณ์ GIS', icon: <MapPin className="w-4 h-4" /> },
    { id: 'flood', label: 'เฝ้าระวังน้ำท่วม', icon: <Waves className="w-4 h-4" /> },
    { id: 'stations', label: 'สถานีน้ำ & ลุ่มน้ำ', icon: <Navigation className="w-4 h-4" /> },
    { id: 'bpp-tracker', label: 'ตรวจเช็ครายงาน 16 กก.ตชด.', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'incidents', label: 'จัดการเหตุการณ์', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'reports', label: 'รายงานและส่งออก', icon: <FileText className="w-4 h-4" /> },
    { id: 'smart-ops', label: 'AI & Workflow', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <header className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      <div
        className="relative rounded-3xl overflow-hidden text-white shadow-xl border border-white/15"
        style={{
          background: 'linear-gradient(135deg, #451A03 0%, #92400E 40%, #D97706 75%, #F59E0B 100%)',
        }}
      >
        {/* 4-Color Spectrum Top Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#E89B22] via-[#F59E0B] via-[#2583D8] to-[#42A77A]" />

        {/* Ambient Radar Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-300/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.45) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 p-5 sm:p-7 space-y-5">
          {/* Top Operational Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Left: Back Button & Department Title */}
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
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-400/20 border border-amber-300/30 text-[11px] font-mono font-bold text-amber-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                  DISASTER & RELIEF COMMAND STUDIO • /disaster
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-lg shrink-0">
                  <ShieldAlert className="w-6 h-6 sm:w-7 sm:h-7 text-amber-200" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
                    สายงานพัฒนาและช่วยเหลือประชาชน (บรรเทาสาธารณภัย)
                  </h1>
                  <p className="text-xs sm:text-sm text-amber-100/85 mt-0.5">
                    เฝ้าระวังสถานการณ์อุทกภัย ดินโคลนถล่ม พิกัดเรดาร์ฝนตกหนัก และการปฏิบัติการช่วยเหลือประชาชน 16 กก.ตชด.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Quick Emergency Broadcast Alert */}
              <button
                type="button"
                onClick={onOpenAlertModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-rose-600/90 hover:bg-rose-500 text-white border border-rose-300/40 shadow-lg transition cursor-pointer"
              >
                <Radio className="w-4 h-4 text-rose-100 animate-pulse" />
                <span>ส่งแจ้งเตือนด่วน</span>
              </button>

              {/* Export Trigger */}
              <button
                type="button"
                onClick={onOpenExportModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition cursor-pointer backdrop-blur-md"
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-200" />
                <span>ส่งออกรายงาน</span>
              </button>

              {/* Add New Incident Button */}
              <button
                type="button"
                onClick={onOpenNewIncidentModal}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-black bg-white text-amber-950 hover:bg-amber-50 shadow-lg transition active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5] text-amber-700" />
                <span>รายงานเหตุใหม่</span>
              </button>

              <div className="hidden sm:block pl-1">
                <UserHeaderBadge />
              </div>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="pt-3 border-t border-white/15 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
            {tabItems.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white text-amber-900 shadow-md scale-[1.02]'
                      : 'text-amber-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className={isActive ? 'text-[#E89B22]' : 'text-amber-200'}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
