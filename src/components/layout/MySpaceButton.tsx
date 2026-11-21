import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { User } from 'lucide-react';

const BURST = Array.from({ length: 7 }, (_, i) => {
  const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
  return { x: Math.cos(a) * 26, y: Math.sin(a) * 26, s: 3 + (i % 3) };
});

/** ปุ่ม "ฉัน (MY SPACE)" ในเมนูข้าง: มีชีวิตชีวาเมื่อว่าง/ชี้เมาส์/กด/เปิดอยู่ (อนิเมชั่นอยู่ที่ตัวปุ่มเท่านั้น) */
export const MySpaceButton: React.FC<{ active: boolean; onOpen: () => void }> = ({ active, onOpen }) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [burst, setBurst] = useState(0);

  const click = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples(list => [...list, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setBurst(b => b + 1);
    window.setTimeout(() => setRipples(list => list.filter(x => x.id !== id)), 900);
    onOpen();
  };

  return (
    <motion.button
      type="button"
      onClick={click}
      whileHover={{ y: -2, scale: 1.015 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 420, damping: 22 }}
      aria-current={active ? 'page' : undefined}
      className={`w-full group relative overflow-hidden p-2.5 rounded-2xl text-xs cursor-pointer text-left border transition-shadow duration-300 hover:shadow-lg hover:shadow-sky-500/25 ${
        active
          ? 'text-white border-transparent shadow-md shadow-sky-900/20'
          : 'bg-gradient-to-br from-sky-50/90 via-indigo-50/50 to-white dark:from-sky-950/30 dark:via-slate-900 dark:to-slate-900 border-sky-200/70 dark:border-sky-500/20 hover:border-sky-400 text-slate-800 dark:text-slate-100'
      }`}
    >
      {/* พื้นไล่สีที่ไหลช้า ๆ เมื่อเปิดอยู่ */}
      {active && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: 'linear-gradient(110deg, #1D68B0, #2583D8, #6366F1, #2583D8, #1D68B0)', backgroundSize: '260% 100%' }}
          animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      {/* แสงวิ่งผ่านเป็นระยะ */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none"
        animate={{ x: ['0%', '480%'] }}
        transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 4.5, ease: 'easeInOut' }}
      />
      {/* คลื่นขยายจากจุดที่กด */}
      <AnimatePresence>
        {ripples.map(r => (
          <motion.span
            key={r.id}
            aria-hidden="true"
            className={`absolute rounded-full pointer-events-none ${active ? 'bg-white/45' : 'bg-sky-400/40'}`}
            style={{ left: r.x, top: r.y, width: 20, height: 20, marginLeft: -10, marginTop: -10 }}
            initial={{ scale: 0, opacity: 0.9 }}
            animate={{ scale: 18, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </AnimatePresence>

      <div className="relative flex items-center gap-2.5 min-w-0">
        <div className="relative shrink-0">
          {/* วงเรืองรอบไอคอนตอนเปิดอยู่ */}
          {active && (
            <motion.span
              aria-hidden="true"
              className="absolute -inset-1 rounded-[14px] border-2 border-white/70"
              animate={{ scale: [1, 1.3], opacity: [0.7, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
          <motion.div
            key={burst}
            className={`relative w-8 h-8 rounded-xl flex items-center justify-center shadow-xs ${
              active ? 'bg-white text-[#1D68B0]' : 'bg-gradient-to-br from-[#2583D8] to-[#5B2A86] text-white'
            }`}
            animate={burst ? { scale: [1, 1.35, 0.9, 1], rotate: [0, -14, 8, 0] } : { y: [0, -2, 0] }}
            transition={burst ? { duration: 0.55, ease: 'easeOut' } : { duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ rotate: -10, scale: 1.12 }}
          >
            <User className="w-4 h-4" />
          </motion.div>
          {/* ประกายกระจายตอนกด */}
          {burst > 0 &&
            BURST.map((p, i) => (
              <motion.span
                key={`${burst}-${i}`}
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 rounded-full bg-amber-300 pointer-events-none"
                style={{ width: p.s, height: p.s, marginLeft: -p.s / 2, marginTop: -p.s / 2 }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            ))}
          {/* จุดสถานะออนไลน์ */}
          <span className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
        </div>
        <div className="min-w-0">
          <div className="font-bpp text-[13px] font-extrabold truncate leading-tight">ฉัน (MY SPACE)</div>
          <div className={`text-[10px] truncate mt-0.5 ${active ? 'text-sky-100' : 'text-sky-700 dark:text-sky-300 font-medium'}`}>
            ข้อมูลส่วนตัว · เงินเดือน · งาน
          </div>
        </div>
      </div>
    </motion.button>
  );
};
