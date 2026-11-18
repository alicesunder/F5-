import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { Menu, ArrowRight, Shield, User, LogOut, ChevronDown } from 'lucide-react';

interface LandingNavbarProps {
  onOpenMenu: () => void;
  onOpenLogin: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onOpenMenu,
  onOpenLogin,
}) => {
  const { isAuthenticated, currentUser, currentRole, logout, navigate } = useAdmin();
  const [timeStr, setTimeStr] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative z-30 w-full px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between border-b border-slate-200/70 bg-white/75 backdrop-blur-2xl shadow-[0_2px_15px_rgba(15,23,42,0.03)]">
      {/* Left: Hamburger + Brand "ฝอ.5" / "งานอำนวยการ" */}
      <div className="flex items-center gap-3.5 sm:gap-5">
        <button
          id="btn-landing-hamburger"
          type="button"
          onClick={onOpenMenu}
          className="group p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 transition-all cursor-pointer shadow-xs active:scale-95"
          aria-label="เปิดเมนูนำทาง"
          title="เปิดเมนูงานอำนวยการ ฝอ.5"
        >
          <Menu className="w-5 h-5 text-slate-700 group-hover:text-sky-600 transition-colors" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-sans">
                ฝอ.5
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-mono tracking-wider font-semibold hidden sm:inline-block">
                DIRECTORATE 5
              </span>
            </div>
            <span className="text-xs sm:text-sm text-slate-500 tracking-wide font-normal">
              งานอำนวยการ
            </span>
          </div>
        </div>
      </div>

      {/* Right: Operational Status + Login/Dashboard Button */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* System Online Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 border border-slate-200/80 text-xs font-mono text-slate-700 shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-sans font-medium text-emerald-700">ระบบพร้อมใช้งาน</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 tracking-wider">{timeStr || '12:45:00'} น.</span>
        </div>

        {/* Auth CTA */}
        {isAuthenticated ? (
          <div className="relative">
            <div className="flex items-center gap-2">
              <button
                id="btn-landing-go-dashboard"
                type="button"
                onClick={() => navigate('dashboard')}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-medium transition-all shadow-sm shadow-sky-600/20 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>เข้าสู่ระบบงาน</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                type="button"
                onClick={() => setShowUserDropdown(prev => !prev)}
                className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                title={currentUser?.name}
              >
                <div className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs flex items-center justify-center font-bold font-mono">
                  {currentUser?.rank?.slice(0, 2) || 'จน.'}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* User Dropdown */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white/95 backdrop-blur-2xl border border-slate-200/80 shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-2 py-1.5 border-b border-slate-100">
                  <div className="text-xs font-semibold text-slate-800">{currentUser?.name}</div>
                  <div className="text-[11px] text-sky-600 font-medium">{currentUser?.position}</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5 uppercase">
                    บทบาท: {currentRole}
                  </div>
                </div>

                <div className="mt-2 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      navigate('dashboard');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-xs text-slate-700 flex items-center gap-2 transition"
                  >
                    <Shield className="w-3.5 h-3.5 text-sky-600" />
                    <span>ภาพรวมผู้บริหาร (Dashboard)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      navigate('settings');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-xs text-slate-700 flex items-center gap-2 transition"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>โปรไฟล์และการตั้งค่า</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 text-xs text-red-600 flex items-center gap-2 transition"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    <span>ออกจากระบบ</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            id="btn-landing-login-trigger"
            type="button"
            onClick={onOpenLogin}
            className="px-4 sm:px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-medium transition-all shadow-sm shadow-sky-600/20 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>เข้าสู่ระบบ</span>
          </button>
        )}
      </div>
    </header>
  );
};
