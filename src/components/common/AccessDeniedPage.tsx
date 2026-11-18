import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { AppModule, DepartmentId, Role } from '../../types';
import { checkModuleAccess, ROLE_LABELS, DEPARTMENTS } from '../../data/departmentsData';
import {
  ShieldAlert,
  ArrowLeft,
  Lock,
  UserCheck,
  LogOut,
  AlertOctagon,
  KeyRound,
  FileCheck2,
} from 'lucide-react';

interface AccessDeniedPageProps {
  targetModule: AppModule;
}

export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({ targetModule }) => {
  const { currentRole, currentUser, navigateModule, logout } = useAdmin();

  const accessCheck = checkModuleAccess(currentRole, targetModule);
  const currentRoleInfo = ROLE_LABELS[currentRole] || {
    title: String(currentRole),
    dept: 'ส่วนกลาง',
    color: '#6B7280',
    badge: String(currentRole),
    description: '',
  };

  // Find department config if it's a department
  const deptConfig = DEPARTMENTS.find(d => d.id === targetModule);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex flex-col justify-between font-sans">
      {/* Top Government Security Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#151821]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 shadow-2xs px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#17324F] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            SAC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                ระบบรักษาความปลอดภัยและควบคุมการเข้าถึง
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40">
                ACCESS CONTROL
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              ศูนย์ปฏิบัติการร่วมและบริหารงานกลาง • การควบคุมสิทธิ์ตามบทบาท (RBAC)
            </p>
          </div>
        </div>

        {/* User Status in Header */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">
              {currentUser.rank} {currentUser.name}
            </div>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: currentRoleInfo.color }}
              />
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">
                {currentRoleInfo.badge}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-medium transition cursor-pointer"
            title="ออกจากระบบ"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ออกจากระบบ</span>
          </button>
        </div>
      </header>

      {/* Main Security Denial Notice */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-xl w-full bg-white dark:bg-[#151821] rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Top Banner Alert Strip */}
          <div className="bg-rose-600 h-2 w-full" />

          <div className="p-6 sm:p-9 text-center">
            {/* Shield Icon Badge */}
            <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-800/40 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-inner mb-5">
              <ShieldAlert className="w-10 h-10 stroke-[1.75]" />
            </div>

            {/* Main Header */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/40 mb-3">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>รหัสความปลอดภัย: 403 FORBIDDEN</span>
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              ไม่มีสิทธิ์เข้าถึงระบบนี้
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
              {accessCheck.reason ||
                'ท่านไม่ได้รับอนุญาตให้เข้าถึงพื้นที่ปฏิบัติงานของระบบนี้ตามนโยบายควบคุมการเข้าถึงสารสนเทศ'}
            </p>

            {/* Diagnostic Information Card */}
            <div className="mt-6 text-left bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                <span>// รายละเอียดสิทธิ์การเข้าใช้งาน</span>
                <span>SEC-POLICY-ENFORCED</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">ระบบที่พยายามเข้าถึง:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {accessCheck.targetTitle}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
                    /{targetModule}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">บทบาทของผู้ใช้ขณะนี้:</span>
                  <div className="inline-flex items-center gap-1.5 mt-0.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: currentRoleInfo.color }}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {currentRoleInfo.badge}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    {currentRoleInfo.title}
                  </span>
                </div>
              </div>

              {deptConfig && (
                <div className="pt-2 border-t border-slate-200/70 dark:border-white/10 text-xs">
                  <span className="text-slate-400 block text-[11px]">สิทธิ์ที่อนุญาตให้เข้าถึงระบบนี้:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {(deptConfig.allowedRoles || []).map(r => (
                      <span
                        key={r}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => navigateModule('dashboard')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white text-sm font-semibold shadow-sm transition hover:shadow-md cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>กลับ Dashboard</span>
              </button>

              <button
                type="button"
                onClick={logout}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-200 text-sm font-semibold transition cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>สลับบัญชีผู้ใช้ / เข้าสู่ระบบใหม่</span>
              </button>
            </div>

            {/* Security notice footer */}
            <p className="text-[11px] text-slate-400 mt-6">
              การพยายามเข้าถึงระบบที่ไม่ได้รับอนุญาตจะถูกบันทึกประวัติการตรวจสอบความปลอดภัย (Security Audit Log) ตาม พ.ร.บ. ไซเบอร์ฯ
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-white/10">
        ศูนย์ปฏิบัติการร่วมและบริหารงานกลาง • พระราชบัญญัติการรักษาความมั่นคงปลอดภัยไซเบอร์ พ.ศ. ๒๕๖๒
      </footer>
    </div>
  );
};
