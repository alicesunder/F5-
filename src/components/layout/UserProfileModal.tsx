import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { ROLE_LABELS } from '../../data/departmentsData';
import {
  X,
  User,
  Shield,
  Building2,
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  LogOut,
  Settings,
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, currentRole, userSession, logout, navigateModule } = useAdmin();

  if (!isOpen) return null;

  const roleMeta = ROLE_LABELS[currentRole] || {
    title: currentRole,
    dept: currentUser.department,
    color: '#3B82F6',
    description: 'ผู้ปฏิบัติงานในระบบสารสนเทศ',
  };

  const handleGoToSettings = () => {
    onClose();
    navigateModule('settings');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg liquid-glass-modal rounded-3xl border border-white/70 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header with Brand Gradient Tone */}
        <div className="bg-gradient-to-r from-[#24145C] to-[#5B2A86] text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300">
              <User className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                  {currentRole}
                </span>
                <span className="text-[10px] text-emerald-300 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ออนไลน์พร้อมปฏิบัติหน้าที่
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                {currentUser.rank} {currentUser.name}
              </h3>
              <p className="text-xs text-white/80">
                {currentUser.position}
              </p>
            </div>
          </div>
        </div>

        {/* Body Info */}
        <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10">
              <div className="text-[10px] font-mono text-slate-400 uppercase">สังกัด / ฝ่ายงาน</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#5B2A86] dark:text-[#B3A0E8]" />
                <span className="truncate">{currentUser.department}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10">
              <div className="text-[10px] font-mono text-slate-400 uppercase">สิทธิ์การเข้าถึง</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>เข้าถึงได้ทุกฝ่าย (Full Hub)</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10">
              <div className="text-[10px] font-mono text-slate-400 uppercase">อีเมลราชการ</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{currentUser.email || 'user@gov.th'}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10">
              <div className="text-[10px] font-mono text-slate-400 uppercase">เบอร์ติดต่อภายใน</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentUser.phone || '02-555-0999'}</span>
              </div>
            </div>
          </div>

          {/* Session Details */}
          <div className="p-4 rounded-2xl bg-[#EDE4F7]/40 dark:bg-[#8B6CCF]/10 border border-[#5B2A86]/20 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 font-mono text-[11px]">
              <span>โทเคนการเข้าใช้งาน:</span>
              <span className="text-[#5B2A86] dark:text-[#B3A0E8] font-semibold">{userSession?.token || 'GOV-ACTIVE-SESSION'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 font-mono text-[11px]">
              <span>เวลาเข้าสู่ระบบ:</span>
              <span>{userSession?.loginAt ? new Date(userSession.loginAt).toLocaleTimeString('th-TH') : 'เข้าสู่ระบบแล้ว'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 font-mono text-[11px]">
              <span>สถานะการยืนยันตัวตน:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">ผ่านการตรวจสอบความปลอดภัยเรียบร้อย</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-black/5 dark:bg-white/5 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={handleGoToSettings}
            className="px-3.5 py-2 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-white/5 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>ตั้งค่าระบบ</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10 transition cursor-pointer"
            >
              ปิด
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (window.confirm('คุณต้องการออกจากระบบหรือไม่?')) {
                  logout();
                }
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
