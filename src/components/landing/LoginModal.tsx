import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { X, Lock, Mail, Eye, EyeOff, ShieldCheck, Key, HelpCircle, Check } from 'lucide-react';
import { Role } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessNavigateTo?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccessNavigateTo = 'dashboard',
}) => {
  const { login, navigate, showToast } = useAdmin();

  const [email, setEmail] = useState('chairot.s@royalthaipolice.go.th');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('SUPER_ADMIN');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      login(email || 'chairot.s@royalthaipolice.go.th', selectedRole);
      onClose();
      if (onSuccessNavigateTo) {
        navigate(onSuccessNavigateTo);
      }
    }, 500);
  };

  const handleQuickSelectAccount = (userAccount: {
    name: string;
    email: string;
    role: Role;
    rank?: string;
  }) => {
    setEmail(userAccount.email);
    setSelectedRole(userAccount.role);
    setPassword('••••••••');
  };

  const presetAccounts = [
    {
      role: 'SUPER_ADMIN' as Role,
      title: 'ผบ.หมู่-รอง สว. กก.ตชด.31 ปฏิบัติหน้าที่งานประชาสัมพันธ์ ฝอ.๕ บช.ตชด.',
      name: 'ส.ต.อ.ชัยโรจน์ สหัสภูริพัฒน์',
      email: 'chairot.s@royalthaipolice.go.th',
      badge: 'ผู้ใช้งานระบบ',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/45 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        id="modal-government-login"
        className="relative z-10 w-full max-w-lg rounded-3xl bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_25px_70px_rgba(15,23,42,0.18)] text-slate-800 p-6 sm:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Specular Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-sky-100/50 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="flex items-start justify-between border-b border-slate-200/80 pb-5 mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              ฝอ.5
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 font-semibold uppercase">
                  GOVERNMENT PORTAL
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 mt-1">
                งานอำนวยการ ฝอ.5
              </h2>
              <p className="text-xs text-slate-500">
                เข้าสู่ระบบศูนย์ปฏิบัติการและบริหารงานอำนวยการ
              </p>
            </div>
          </div>

          <button
            id="btn-close-login"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            aria-label="ปิดหน้าต่างเข้าสู่ระบบ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5 font-sans">
              อีเมลผู้ใช้งาน (Email)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="input-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="กรอกอีเมล เช่น officer@gov.th"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 text-slate-800 placeholder-slate-400 text-sm transition font-sans outline-none"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5 font-sans">
              รหัสผ่าน (Password)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="input-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่าน"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 text-slate-800 placeholder-slate-400 text-sm transition font-sans outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <span>จดจำการเข้าสู่ระบบในอุปกรณ์นี้</span>
            </label>

            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-sky-600 hover:text-sky-700 transition"
            >
              ลืมรหัสผ่าน?
            </button>
          </div>

          {/* Submit Button */}
          <button
            id="btn-submit-login"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm transition-all shadow-md shadow-sky-600/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>กำลังยืนยันตัวตน...</span>
              </span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>เข้าสู่ระบบงานอำนวยการ</span>
              </>
            )}
          </button>
        </form>

        {/* Authorized User Account Card */}
        <div className="mt-5 pt-4 border-t border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-500 uppercase font-bold tracking-wider">
              บัญชีผู้มีสิทธิ์เข้าใช้งาน (AUTHORIZED ACCOUNT)
            </span>
            <span className="text-[10px] text-slate-400">คลิกเพื่อระบุข้อมูลอัตโนมัติ</span>
          </div>

          <div className="space-y-1.5">
            {presetAccounts.map(acc => {
              const isSelected = selectedRole === acc.role;
              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleQuickSelectAccount(acc)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition text-xs cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50 border-sky-300 text-sky-900 shadow-xs'
                      : 'bg-slate-50/80 hover:bg-slate-100/80 border-slate-200/70 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[11px] ${
                        isSelected ? 'bg-[#5B2A86] text-white shadow-sm' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      ส.ต.อ.
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{acc.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{acc.title}</div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-purple-700 font-semibold">
                    {acc.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Forgot Password Helper Popover */}
        {showForgotModal && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-xl p-6 flex flex-col justify-between z-20 animate-in fade-in">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                  <Key className="w-4 h-4 text-sky-600" />
                  <span>การขอคืนรหัสผ่าน / บัญชีเจ้าหน้าที่</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed space-y-2">
                เนื่องจากระบบงานอำนวยการ ฝอ.5
                เป็นระบบสารสนเทศภายในหน่วยงานราชการที่มีชั้นความลับ
                การขอรีเซ็ตรหัสผ่านต้องดำเนินการผ่านผู้ดูแลระบบสารสนเทศ (Admin IT)
                ประจำฝ่ายอำนวยการเท่านั้น
              </p>

              <div className="mt-4 p-3 rounded-xl bg-sky-50 border border-sky-100 text-xs text-sky-800 space-y-1">
                <div className="font-semibold">ช่องทางติดต่อเจ้าหน้าที่สารสนเทศ ฝอ.5:</div>
                <div>• โทรศัพท์ภายใน: 5401 - 5405</div>
                <div>• อีเมล: sac5.support@internal.gov</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
            >
              รับทราบและกลับสู่หน้าล็อกอิน
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
