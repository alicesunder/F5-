import React, { useState, useRef, useEffect } from 'react';
import { useTheme, ThemeMode } from '../../contexts/ThemeContext';
import { Sun, Moon, Laptop, Check } from 'lucide-react';

export const HeaderThemeSwitcher: React.FC = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const options: { mode: ThemeMode; label: string; sub: string; icon: typeof Sun }[] = [
    { mode: 'light', label: 'Light Theme', sub: 'สว่าง สะอาด คมชัด', icon: Sun },
    { mode: 'dark', label: 'Dark Theme', sub: 'มืด นุ่มตา สบายสายตา', icon: Moon },
    { mode: 'system', label: 'System (ตามเครื่อง)', sub: 'ปรับตาม OS อัตโนมัติ', icon: Laptop },
  ];

  const currentIcon = resolvedTheme === 'dark' ? Moon : Sun;
  const ActiveIcon = theme === 'system' ? Laptop : currentIcon;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="relative p-2 rounded-xl text-[#4A4852] dark:text-[#A9AFBB] hover:text-[#2D2A32] dark:hover:text-[#F5F7FA] hover:bg-white/70 dark:hover:bg-white/10 transition cursor-pointer flex items-center justify-center border border-transparent hover:border-black/5 dark:hover:border-white/10"
        title={`โหมดการแสดงผล: ${theme === 'light' ? 'สว่าง' : theme === 'dark' ? 'มืด' : 'ตามเครื่อง'}`}
        aria-label="เปลี่ยนโหมดการแสดงผล"
      >
        <ActiveIcon className="w-4 h-4 transition-transform duration-200 hover:rotate-12 text-[#5B2A86] dark:text-[#B3A0E8]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl liquid-glass-modal border border-white/70 dark:border-white/10 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3.5 py-1.5 border-b border-black/5 dark:border-white/10">
            <span className="text-[10px] font-mono font-bold tracking-wider text-[#5B2A86] dark:text-[#B3A0E8] uppercase">
              ธีมการแสดงผล
            </span>
          </div>

          <div className="p-1 space-y-0.5">
            {options.map(opt => {
              const isSelected = theme === opt.mode;
              const OptIcon = opt.icon;
              return (
                <button
                  key={opt.mode}
                  type="button"
                  onClick={() => {
                    setTheme(opt.mode);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#EDE4F7] dark:bg-[#8B6CCF]/25 text-[#5B2A86] dark:text-[#B3A0E8] font-bold'
                      : 'text-[#2D2A32] dark:text-[#A9AFBB] hover:bg-white/80 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/80 dark:bg-white/10' : 'bg-black/5 dark:bg-white/5'}`}>
                      <OptIcon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs">{opt.label}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">{opt.sub}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#5B2A86] dark:text-[#B3A0E8]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
