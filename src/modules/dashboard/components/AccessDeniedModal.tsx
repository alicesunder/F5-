import React from 'react';
import { DepartmentConfig, Role } from '../../../types';
import { ROLE_LABELS } from '../../../data/departmentsData';
import { ShieldAlert, Lock, ArrowRight, X, AlertCircle } from 'lucide-react';

interface AccessDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: DepartmentConfig | null;
  currentRole: Role;
  onOpenRoleSwitcher: () => void;
}

export const AccessDeniedModal: React.FC<AccessDeniedModalProps> = ({
  isOpen,
  onClose,
  department,
  currentRole,
  onOpenRoleSwitcher,
}) => {
  if (!isOpen || !department) return null;

  const roleInfo = ROLE_LABELS[currentRole] || {
    title: 'บทบาททั่วไป',
    dept: 'ส่วนกลาง',
    color: '#6B7280',
    badge: String(currentRole),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-left p-6 sm:p-7">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Security Crest Icon */}
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mb-5">
          <ShieldAlert className="w-7 h-7" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          ไม่มีสิทธิ์เข้าถึงระบบงานนี้
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          ระบบรักษาความปลอดภัยตามมาตรฐานการควบคุมการเข้าถึง (RBAC)
        </p>

        {/* Context Details Box */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase">ระบบที่ต้องการเข้าถึง:</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: department.primaryColor }}
              />
              <span className="text-sm font-semibold text-slate-800">{department.name}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/60">
            <span className="text-[11px] font-mono text-slate-400 uppercase">บทบาทของคุณปัจจุบัน:</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-white border border-slate-200 text-slate-700">
                {roleInfo.title} ({String(currentRole)})
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              บทบาท <strong>{String(currentRole)}</strong> ได้รับสิทธิ์เฉพาะระบบงานของฝ่ายตนเองและหน้าศูนย์บริหารงานเท่านั้น
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenRoleSwitcher();
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>สลับบทบาท / สิทธิ์ผู้ใช้งาน</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            รับทราบ
          </button>
        </div>
      </div>
    </div>
  );
};
