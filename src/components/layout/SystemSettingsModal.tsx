import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { useTheme } from '../../contexts/ThemeContext';
import { PRESET_USERS } from '../../data/usersData';
import { ROLE_LABELS } from '../../data/departmentsData';
import { Role } from '../../types';
import { X, Settings, ShieldCheck, Database, HardDrive, BellRing, Sun, Moon, ExternalLink } from 'lucide-react';

interface SystemSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemSettingsModal: React.FC<SystemSettingsModalProps> = ({ isOpen, onClose }) => {
  const { currentRole, setRole, showToast, navigateModule } = useAdmin();
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  const handleRoleChange = (role: Role) => {
    setRole(role);
    showToast(`สลับบทบาทเป็น "${ROLE_LABELS[role]?.title || role}" เรียบร้อย`, 'success');
  };

  const handleGoToFullSettings = () => {
    onClose();
    navigateModule('settings');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl liquid-glass-modal rounded-3xl border border-white/70 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 sm:p-6 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#5B2A86]/10 dark:bg-[#8B6CCF]/20 flex items-center justify-center text-[#5B2A86] dark:text-[#B3A0E8]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">ตั้งค่าระบบและการเข้าถึง</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">การกำหนดค่าระบบสารสนเทศและการจำลองสิทธิ์ ฝอ.5</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs sm:text-sm">
          {/* Theme Quick Switcher */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-800 dark:text-slate-200">โหมดธีมการแสดงผล (Quick Theme)</span>
              <span className="text-[11px] font-mono text-slate-400">Dark / Light / System</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition flex items-center justify-center gap-2 ${
                  theme === 'light'
                    ? 'border-[#5B2A86] bg-[#EDE4F7] dark:bg-[#8B6CCF]/20 text-[#5B2A86] dark:text-[#B3A0E8]'
                    : 'border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/5 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>สว่าง (Light)</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition flex items-center justify-center gap-2 ${
                  theme === 'dark'
                    ? 'border-[#B3A0E8] bg-[#1A1F29] text-[#B3A0E8]'
                    : 'border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/5 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Moon className="w-4 h-4 text-[#B3A0E8]" />
                <span>มืด (Dark)</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition flex items-center justify-center gap-2 ${
                  theme === 'system'
                    ? 'border-[#5B2A86] bg-[#EDE4F7] dark:bg-[#8B6CCF]/20 text-[#5B2A86] dark:text-[#B3A0E8]'
                    : 'border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/5 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span>ตามเครื่อง (OS)</span>
              </button>
            </div>
          </div>

          {/* Quick Role Simulator */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-800 dark:text-slate-200">สลับบทบาทผู้ใช้งาน (Role Switcher)</span>
              <span className="text-[11px] font-mono text-slate-400">สำหรับทดสอบระบบ</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              ระบบศูนย์กลางอนุญาตให้ผู้ใช้ที่ Login สำเร็จเข้าถึงได้ทุกฝ่าย คุณสามารถสลับบทบาทเพื่อดูการระบุตำแหน่งที่แตกต่างกันได้
            </p>

            <div className="grid grid-cols-1 gap-2">
              {PRESET_USERS.map(u => {
                const isCurrent = currentRole === u.role;
                const meta = ROLE_LABELS[u.role];
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleRoleChange(u.role)}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
                      isCurrent
                        ? 'border-[#5B2A86] dark:border-[#B3A0E8] bg-[#EDE4F7]/40 dark:bg-[#8B6CCF]/20 ring-2 ring-[#5B2A86]/20'
                        : 'border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                        {u.rank} {u.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {meta?.title || u.position || u.role}
                      </div>
                    </div>
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: meta?.color || '#3B82F6' }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Link to Full Settings Center */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#EDE4F7]/60 to-white/60 dark:from-[#8B6CCF]/15 dark:to-[#1A1F29]/60 border border-[#5B2A86]/20 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-xs text-[#5B2A86] dark:text-[#B3A0E8]">
                ศูนย์ตั้งค่าระบบเต็มรูปแบบ (System Settings Center)
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                เข้าถึงการตั้งค่าทั่วไป การแจ้งเตือน ความปลอดภัย บันทึก Audit Log และการสำรองข้อมูล
              </div>
            </div>
            <button
              type="button"
              onClick={handleGoToFullSettings}
              className="px-3.5 py-2 rounded-xl bg-[#5B2A86] hover:bg-[#7B3FC6] text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
            >
              <span>เปิดหน้าตั้งค่า</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-4 bg-black/5 dark:bg-white/5 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">ข้อมูลบันทึกในฐานข้อมูลกลางอัตโนมัติ</span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#5B2A86] hover:bg-[#7B3FC6] text-white text-xs font-semibold transition cursor-pointer"
          >
            เรียบร้อย
          </button>
        </div>
      </div>
    </div>
  );
};
