import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Layers } from 'lucide-react';
import { DEPARTMENT_COLORS } from '../../../types';

export type DepartmentFilterOption = 'all' | 'admin' | 'relations' | 'disaster' | 'volunteer';
export type TimeFilterOption = 'today' | '7days' | '30days' | 'all';

interface CentralDashboardFiltersProps {
  selectedDepartment: DepartmentFilterOption;
  onSelectDepartment: (dept: DepartmentFilterOption) => void;
  selectedTime: TimeFilterOption;
  onSelectTime: (time: TimeFilterOption) => void;
}

export const CentralDashboardFilters: React.FC<CentralDashboardFiltersProps> = ({
  selectedDepartment,
  onSelectDepartment,
  selectedTime,
  onSelectTime,
}) => {
  const departmentOptions: { id: DepartmentFilterOption; label: string; color?: string }[] = [
    { id: 'all', label: 'ทุกฝ่ายงาน (ทั้งหมด)' },
    { id: 'admin', label: 'ฝ่ายอำนวยการ', color: DEPARTMENT_COLORS.admin },
    { id: 'relations', label: 'ฝ่ายมวลชนสัมพันธ์', color: DEPARTMENT_COLORS.relations },
    { id: 'disaster', label: 'ฝ่ายสาธารณภัย', color: DEPARTMENT_COLORS.disaster },
    { id: 'volunteer', label: 'ฝ่ายจิตอาสา', color: DEPARTMENT_COLORS.volunteer },
  ];

  const timeOptions: { id: TimeFilterOption; label: string }[] = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'today', label: 'วันนี้' },
    { id: '7days', label: '7 วันล่าสุด' },
    { id: '30days', label: '30 วันล่าสุด' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Department Filter Tabs (Item 7: Sliding indicator, gentle scale, crossfade) */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>ฝ่ายงาน:</span>
          </span>
          {departmentOptions.map(opt => {
            const isSelected = selectedDepartment === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectDepartment(opt.id)}
                className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'text-white'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/70'
                }`}
              >
                {/* Sliding indicator */}
                {isSelected && (
                  <motion.span
                    layoutId="activeDeptFilter"
                    className="absolute inset-0 rounded-xl bg-slate-900 shadow-xs z-0"
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 32,
                    }}
                  />
                )}

                {opt.color && (
                  <motion.span
                    animate={{ scale: isSelected ? 1.2 : 1 }}
                    transition={{ duration: 0.2 }}
                    className="w-2 h-2 rounded-full flex-shrink-0 z-10"
                    style={{ backgroundColor: opt.color }}
                  />
                )}
                <span className="z-10">{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Time Filter Tabs */}
        <div className="flex items-center gap-1.5 self-start lg:self-center">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>ช่วงเวลา:</span>
          </span>
          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/70">
            {timeOptions.map(opt => {
              const isSelected = selectedTime === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectTime(opt.id)}
                  className={`relative px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? 'text-slate-900 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="activeTimeFilter"
                      className="absolute inset-0 rounded-lg bg-white shadow-2xs z-0"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 32,
                      }}
                    />
                  )}
                  <span className="relative z-10">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
