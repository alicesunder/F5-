import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Home, Layers, Flame, MessageSquareText, Menu, Settings2, Megaphone, ShieldAlert, HeartHandshake, X } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { AppModule } from '../../types';

const DEPTS: { id: AppModule; label: string; sub: string; color: string; Icon: React.ElementType }[] = [
  { id: 'admin', label: 'งานอำนวยการ', sub: 'สารบรรณ · งบประมาณ', color: '#8B46C8', Icon: Settings2 },
  { id: 'relations', label: 'งานประชาสัมพันธ์', sub: 'ข่าว · สื่อ · โฆษก', color: '#2583D8', Icon: Megaphone },
  { id: 'disaster', label: 'งานพัฒนาช่วยเหลือประชาชน', sub: 'บรรเทาภัย · อพ.สธ.', color: '#E89B22', Icon: ShieldAlert },
  { id: 'volunteer', label: 'งานจิตอาสา', sub: 'จิตอาสา 904 · พระราชทาน', color: '#42A77A', Icon: HeartHandshake },
];
const DEPT_IDS = DEPTS.map(d => d.id as string);

/**
 * แถบนำทางด้านล่างสำหรับมือถือ: แตะด้วยนิ้วโป้งได้สบาย 5 ปุ่ม
 * หน้าหลัก · สายงาน (แผ่นเลือก 4 สายงาน) · งานด่วน · LINE · เมนู (เปิดเมนูเต็ม)
 */
export const MobileBottomNav: React.FC<{ onOpenMenu: () => void }> = ({ onOpenMenu }) => {
  const { activeModule, navigateModule } = useAdmin();
  const [sheet, setSheet] = useState(false);
  const active = String(activeModule);
  const inDept = DEPT_IDS.includes(active);

  useEffect(() => {
    setSheet(false);
  }, [active]);

  const items: { key: string; label: string; Icon: React.ElementType; on: boolean; run: () => void; color?: string }[] = [
    { key: 'home', label: 'หน้าหลัก', Icon: Home, on: active === 'dashboard', run: () => navigateModule('dashboard') },
    { key: 'dept', label: 'สายงาน', Icon: Layers, on: inDept || sheet, run: () => setSheet(s => !s) },
    { key: 'urgent', label: 'งานด่วน', Icon: Flame, on: active === 'task-center', run: () => navigateModule('task-center'), color: '#F97316' },
    { key: 'line', label: 'LINE', Icon: MessageSquareText, on: active === 'line-reports', run: () => navigateModule('line-reports'), color: '#06C755' },
    { key: 'menu', label: 'เมนู', Icon: Menu, on: false, run: onOpenMenu },
  ];

  return (
    <>
      <nav
        aria-label="เมนูหลักมือถือ"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 lg-glass-strong border-t border-slate-200/80 dark:border-white/10 shadow-[0_-8px_30px_rgba(60,30,110,0.12)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <ul className="grid grid-cols-5 px-1.5 pt-1.5 pb-1">
          {items.map(it => (
            <li key={it.key}>
              <button
                type="button"
                onClick={it.run}
                aria-current={it.on ? 'page' : undefined}
                className="relative w-full flex flex-col items-center gap-0.5 py-1.5 rounded-2xl cursor-pointer select-none active:scale-90 transition-transform"
              >
                {it.on && (
                  <motion.span
                    layoutId="mnav-pill"
                    className="absolute inset-x-2 inset-y-0.5 rounded-2xl bg-[#5B2A86]/10 dark:bg-white/10"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
                <it.Icon
                  className={`relative w-[22px] h-[22px] transition-colors ${it.on ? 'text-[#5B2A86] dark:text-violet-200' : 'text-slate-500 dark:text-slate-400'}`}
                  strokeWidth={it.on ? 2.4 : 2}
                  style={it.on && it.color ? { color: it.color } : undefined}
                />
                <span className={`relative text-[10.5px] leading-none font-bold ${it.on ? 'text-[#5B2A86] dark:text-violet-200' : 'text-slate-500 dark:text-slate-400'}`}>
                  {it.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {createPortal(
        <AnimatePresence>
          {sheet && (
            <motion.div className="lg:hidden fixed inset-0 z-[60]" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
              <motion.div
                className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSheet(false)}
              />
              <motion.div
                role="dialog"
                aria-label="เลือกสายงาน"
                className="absolute inset-x-0 bottom-0 rounded-t-[1.75rem] bg-white dark:bg-[#12151E] border-t border-white/20 shadow-2xl px-4 pt-3"
                style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.6 }}
                onDragEnd={(_, i) => i.offset.y > 80 && setSheet(false)}
              >
                <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-300 dark:bg-white/20" aria-hidden="true" />
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-bpp text-lg font-black text-slate-900 dark:text-white">เลือกสายงาน</h2>
                  <button type="button" onClick={() => setSheet(false)} aria-label="ปิด" className="p-2 -mr-2 rounded-full text-slate-500 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {DEPTS.map((d, i) => (
                    <motion.button
                      key={d.id}
                      type="button"
                      onClick={() => navigateModule(d.id)}
                      initial={{ opacity: 0, y: 16, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.05 + i * 0.05, type: 'spring', stiffness: 380, damping: 28 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative overflow-hidden text-left rounded-2xl p-3.5 min-h-[7.5rem] flex flex-col justify-between cursor-pointer border"
                      style={{ background: `linear-gradient(145deg, ${d.color}26, ${d.color}0d)`, borderColor: `${d.color}${active === d.id ? 'cc' : '40'}`, boxShadow: active === d.id ? `0 0 0 2px ${d.color}66` : undefined }}
                    >
                      <span className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md" style={{ background: d.color }}>
                        <d.Icon className="w-5 h-5 text-white" />
                      </span>
                      <span>
                        <span className="block text-[13px] font-black leading-snug text-slate-900 dark:text-white">{d.label}</span>
                        <span className="block text-[11px] leading-snug text-slate-500 dark:text-slate-400 mt-0.5">{d.sub}</span>
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
};
