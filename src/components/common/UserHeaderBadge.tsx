import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { ROLE_LABELS } from '../../data/departmentsData';
import { LogOut, User, ChevronDown, Shield, Check, KeyRound } from 'lucide-react';
import { DepartmentRole, Role } from '../../types';

interface UserHeaderBadgeProps {
  compact?: boolean;
  variant?: 'light' | 'dark' | 'transparent';
}

export const UserHeaderBadge: React.FC<UserHeaderBadgeProps> = ({
  compact = false,
  variant = 'light',
}) => {
  const { currentUser, currentRole, logout, setRole, isAuthenticated, navigateModule } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        onClick={() => navigateModule('login')}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
      >
        <User className="w-3.5 h-3.5" />
        <span>เข้าสู่ระบบ</span>
      </button>
    );
  }

  const roleInfo = ROLE_LABELS[currentRole] || {
    title: String(currentRole),
    dept: 'ส่วนกลาง',
    color: '#3B82F6',
    badge: String(currentRole),
    description: '',
  };

  const handleSwitchRole = (newRole: Role) => {
    setRole(newRole);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      {/* User & Role Badge pill */}
      <div
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition ${
          variant === 'dark'
            ? 'bg-slate-800/80 border-slate-700 text-white'
            : 'bg-white border-slate-200/90 text-slate-800 shadow-2xs'
        }`}
      >
        {/* Avatar / Rank Icon */}
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-2xs flex-shrink-0"
          style={{ backgroundColor: roleInfo.color }}
        >
          {currentUser?.name?.slice(0, 1) || 'ผ'}
        </div>

        {/* Name and Role text */}
        <div className="text-left leading-tight pr-1">
          <div className="text-xs font-semibold text-slate-800 truncate max-w-[140px] sm:max-w-[170px]">
            {currentUser?.rank} {currentUser?.name}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: roleInfo.color }}
            />
            <span
              className="text-[10px] font-mono font-semibold uppercase tracking-wider"
              style={{ color: roleInfo.color }}
            >
              {roleInfo.badge}
            </span>
          </div>
        </div>

        {/* Dropdown trigger for testing / fast switching */}
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          title="สลับสิทธิ์การใช้งาน / ดูรายละเอียด"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Logout Button (Always directly accessible in header as specified) */}
      <button
        type="button"
        onClick={logout}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-600 text-xs font-medium transition cursor-pointer active:scale-95 shadow-2xs"
        title="ออกจากระบบ และล้าง Session (Redirect: /login)"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span className="hidden md:inline">ออกจากระบบ</span>
      </button>

      {/* Dropdown Menu for Role Switching / Profile Info */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 pb-2.5 border-b border-slate-100">
            <p className="text-[11px] text-slate-400 uppercase font-mono">ข้อมูลผู้ใช้งานที่เข้าสู่ระบบ</p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {currentUser?.rank} {currentUser?.name}
            </p>
            <p className="text-xs text-slate-500 truncate">{currentUser?.position}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-800">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: roleInfo.color }} />
              <span>{roleInfo.title}</span>
            </div>
          </div>

          {/* Quick RBAC Role Tester */}
          <div className="p-2">
            <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between">
              <span>สลับบทบาทเพื่อทดสอบสิทธิ์</span>
              <span>RBAC TEST</span>
            </div>
            <div className="space-y-1 mt-1">
              {(
                [
                  'SUPER_ADMIN',
                  'ADMIN',
                  'ADMIN_DEPARTMENT',
                  'RELATIONS',
                  'DISASTER',
                  'VOLUNTEER',
                  'VIEWER',
                ] as DepartmentRole[]
              ).map(r => {
                const isSelected = currentRole === r;
                const rData = ROLE_LABELS[r];
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleSwitchRole(r)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white font-medium shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: rData?.color || '#9CA3AF' }}
                      />
                      <div>
                        <div className="font-semibold text-[11px] leading-tight font-mono">{r}</div>
                        <div
                          className={`text-[10px] leading-none ${
                            isSelected ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          {rData?.title?.split(' ')[0] || r}
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logout in Dropdown as well */}
          <div className="pt-2 px-2 border-t border-slate-100">
            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>ออกจากระบบ (Clear Session & Redirect)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
