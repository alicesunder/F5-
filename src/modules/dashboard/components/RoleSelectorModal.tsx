import React, { useState } from 'react';
import { useAdmin } from '../../../contexts/AdminContext';
import { Role } from '../../../types';
import { ROLE_LABELS } from '../../../data/departmentsData';
import {
  Shield,
  CheckCircle2,
  X,
  UserCheck,
  FolderKanban,
  Megaphone,
  ShieldAlert,
  HeartHandshake,
  Eye,
  KeyRound,
} from 'lucide-react';

interface RoleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDepartmentName?: string;
}

interface RoleOption {
  role: Role;
  name: string;
  rank: string;
  title: string;
  department: string;
  color: string;
  allowed: string[];
}

export const RoleSelectorModal: React.FC<RoleSelectorModalProps> = ({
  isOpen,
  onClose,
  targetDepartmentName,
}) => {
  const { currentRole, setRole, login, showToast } = useAdmin();
  const [selectedRole, setSelectedRole] = useState<Role>(currentRole);

  if (!isOpen) return null;

  const roleOptions: RoleOption[] = [
    {
      role: 'SUPER_ADMIN',
      name: 'ส.ต.อ.ชัยโรจน์ สหัสภูริพัฒน์',
      rank: 'ส.ต.อ.',
      title: 'ผู้ดูแลระบบสูงสุด (Super Admin)',
      department: 'ฝอ.๕ บช.ตชด. (งานประชาสัมพันธ์)',
      color: '#1E293B',
      allowed: ['เข้าถึงทุกระบบ (ทุกฝ่ายงานและระบบกลางทั้งหมด)'],
    },
    {
      role: 'ADMIN',
      name: 'ส.ต.อ.ชัยโรจน์ สหัสภูริพัฒน์',
      rank: 'ส.ต.อ.',
      title: 'จัดการระบบกลาง (Central Admin)',
      department: 'ฝอ.๕ บช.ตชด. (งานประชาสัมพันธ์)',
      color: '#3B82F6',
      allowed: ['จัดการระบบกลาง และภาพรวมศูนย์'],
    },
    {
      role: 'ADMIN_DEPARTMENT',
      name: 'ส.ต.อ.ชัยโรจน์ สหัสภูริพัฒน์',
      rank: 'ส.ต.อ.',
      title: 'เจ้าหน้าที่ฝ่ายอำนวยการ',
      department: 'ฝ่ายอำนวยการ ๕',
      color: '#7F9B83',
      allowed: ['/dashboard, /admin (งานสารบรรณ, งบประมาณ, การประชุม, ภารกิจ)'],
    },
    {
      role: 'RELATIONS',
      name: 'ส.ต.อ.ชัยโรจน์ สหัสภูริพัฒน์',
      rank: 'ส.ต.อ.',
      title: 'เจ้าหน้าที่งานประชาสัมพันธ์ (ภารกิจหลัก)',
      department: 'ฝ่ายอำนวยการ ๕ (งานประชาสัมพันธ์)',
      color: '#EE7E9E',
      allowed: ['/dashboard, /relations (งานประชาสัมพันธ์, ข่าวสาร, สื่อมวลชน)'],
    },
    {
      role: 'DISASTER',
      name: 'ส.ต.อ.ชัยโรจน์ สหัสภูริพัฒน์',
      rank: 'ส.ต.อ.',
      title: 'เจ้าหน้าที่ฝ่ายสาธารณภัย',
      department: 'ฝ่ายสาธารณภัย',
      color: '#8191BA',
      allowed: ['/dashboard, /disaster (เฝ้าระวังสาธารณภัย, แผนที่ภัยพิบัติ, เหตุฉุกเฉิน)'],
    },
    {
      role: 'VOLUNTEER',
      name: 'ส.ต.อ.ชัยโรจน์ สหัสภูริพัฒน์',
      rank: 'ส.ต.อ.',
      title: 'เจ้าหน้าที่ฝ่ายจิตอาสา',
      department: 'ฝ่ายจิตอาสา',
      color: '#EFBB4B',
      allowed: ['/dashboard, /volunteer (ระบบกิจกรรมจิตอาสา)'],
    },
    {
      role: 'VIEWER',
      name: 'ส.ต.อ.ชัยโรจน์ สหัสภูริพัฒน์',
      rank: 'ส.ต.อ.',
      title: 'โหมดผู้ตรวจการณ์ (Viewer Mode)',
      department: 'ส่วนตรวจการณ์',
      color: '#6B7280',
      allowed: ['/dashboard (ดูภาพรวมศูนย์บริหารงานเท่านั้น)'],
    },
  ];

  const handleConfirm = () => {
    setRole(selectedRole);
    const chosen = roleOptions.find(r => r.role === selectedRole);
    if (chosen) {
      login('chairot', undefined, selectedRole, true);
      showToast(`สลับโหมดการทำงาน: ${chosen.title}`, 'success');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-left p-6 sm:p-7 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-mono text-slate-600 mb-2">
            <KeyRound className="w-3.5 h-3.5 text-slate-500" />
            <span>AUTHENTICATION & RBAC CONTROL</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            เข้าสู่ระบบและกำหนดสิทธิ์ผู้ใช้งาน
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            เลือกบทบาทและฝ่ายงานเพื่อทดสอบสิทธิ์การเข้าถึงระบบเฉพาะของแต่ละฝ่าย
            {targetDepartmentName && (
              <span className="block text-sky-700 font-medium mt-1">
                เป้าหมาย: {targetDepartmentName}
              </span>
            )}
          </p>
        </div>

        {/* Role Options List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 py-1">
          {roleOptions.map(opt => {
            const isSelected = selectedRole === opt.role;
            return (
              <button
                key={opt.role}
                type="button"
                onClick={() => setSelectedRole(opt.role)}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-50/90 border-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-2xs mt-0.5"
                    style={{ backgroundColor: opt.color }}
                  >
                    {opt.role === 'SUPER_ADMIN' && <KeyRound className="w-5 h-5 text-amber-300" />}
                    {opt.role === 'ADMIN' && <Shield className="w-5 h-5" />}
                    {opt.role === 'ADMIN_DEPARTMENT' && <FolderKanban className="w-5 h-5" />}
                    {opt.role === 'RELATIONS' && <Megaphone className="w-5 h-5" />}
                    {opt.role === 'DISASTER' && <ShieldAlert className="w-5 h-5" />}
                    {opt.role === 'VOLUNTEER' && <HeartHandshake className="w-5 h-5" />}
                    {opt.role === 'VIEWER' && <Eye className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{opt.title}</span>
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium"
                        style={{
                          backgroundColor: `${opt.color}15`,
                          color: opt.color,
                        }}
                      >
                        {opt.role}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-0.5 font-medium">
                      {opt.name} ({opt.rank})
                    </p>

                    <div className="text-[11px] text-slate-500 mt-1 flex items-start gap-1">
                      <span className="text-slate-400 font-mono">สิทธิ์:</span>
                      <span className="truncate">{opt.allowed.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 pt-1">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>ยืนยันการเข้าสู่ระบบ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
