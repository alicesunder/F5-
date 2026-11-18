import React from 'react';
import { DepartmentConfig } from '../../../types';
import { DepartmentCard } from './DepartmentCard';
import { DEPARTMENTS, canAccessDepartment } from '../../../data/departmentsData';
import { useAdmin } from '../../../contexts/AdminContext';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface DepartmentGridProps {
  onSelectDepartment: (dept: DepartmentConfig) => void;
}

export const DepartmentGrid: React.FC<DepartmentGridProps> = ({ onSelectDepartment }) => {
  const { currentRole } = useAdmin();

  return (
    <section id="department-cards" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span className="text-xs font-mono font-semibold tracking-wider text-slate-500 uppercase">
              DEPARTMENT HUBS
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#1F2937] tracking-tight">
            ระบบงานของแต่ละฝ่าย
          </h3>
          <p className="text-sm text-[#6B7280] mt-1">
            เข้าถึงพื้นที่และระบบงานของแต่ละฝ่ายอย่างเป็นสัดส่วน ปลอดภัย และมีประสิทธิภาพ
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
            4 ฝ่ายงานหลัก
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
            3 ระบบพร้อมใช้งาน
          </span>
        </div>
      </div>

      {/* Responsive Grid: 4 cols on Desktop, 2x2 on Tablet, 1 col on Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-6">
        {DEPARTMENTS.map(dept => {
          const hasAccess = canAccessDepartment(currentRole, dept.id);
          return (
            <DepartmentCard
              key={dept.id}
              department={dept}
              onSelect={onSelectDepartment}
              hasAccess={hasAccess}
            />
          );
        })}
      </div>
    </section>
  );
};
