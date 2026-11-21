import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles, UserRound } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';

/** เหตุการณ์ที่ปุ่ม "ฉัน (MY SPACE)" ส่งมา เพื่อให้เกิดการเปลี่ยนฉากแบบ "พอร์ทัล" */
export const MY_SPACE_PORTAL_EVENT = 'fo5:myspace-portal';
export const openMySpacePortal = (x: number, y: number) =>
  window.dispatchEvent(new CustomEvent(MY_SPACE_PORTAL_EVENT, { detail: { x, y } }));

const PARTICLES = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2;
  return { dx: Math.cos(a) * (150 + (i % 3) * 40), dy: Math.sin(a) * (150 + (i % 3) * 40), d: 0.05 * i, s: 4 + (i % 4) * 2 };
});

/**
 * วงกลมแสงขยายออกจากปุ่มจนเต็มจอ → โลโก้บุคคลเด้งพร้อมวงคลื่นและประกาย → หน้าใหม่เผยออกมาตอนวงกลมหดหาย
 * ไม่ทำงานเมื่อผู้ใช้ตั้ง "ลดการเคลื่อนไหว"
 */
export const MySpacePortal: React.FC = () => {
  const { navigateModule, currentUser } = useAdmin();
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const clear = () => timers.current.forEach(clearTimeout);
    const onOpen = (e: Event) => {
      const { x, y } = (e as CustomEvent<{ x: number; y: number }>).detail;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        navigateModule('my-space');
        return;
      }
      clear();
      setOrigin({ x, y });
      timers.current = [window.setTimeout(() => navigateModule('my-space'), 480), window.setTimeout(() => setOrigin(null), 1500)];
    };
    window.addEventListener(MY_SPACE_PORTAL_EVENT, onOpen);
    return () => {
      window.removeEventListener(MY_SPACE_PORTAL_EVENT, onOpen);
      clear();
    };
  }, [navigateModule]);

  const name = [currentUser.rank, currentUser.name].filter(Boolean).join(' ');
  const R = typeof window === 'undefined' ? 1600 : Math.hypot(window.innerWidth, window.innerHeight) * 1.1;

  return createPortal(
    <AnimatePresence>
      {origin && (
        <motion.div
          key="portal"
          aria-hidden="true"
          className="fixed inset-0 z-[120] overflow-hidden pointer-events-none"
          initial={{ clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` }}
          animate={{
            clipPath: [
              `circle(0px at ${origin.x}px ${origin.y}px)`,
              `circle(${R}px at ${origin.x}px ${origin.y}px)`,
              `circle(${R}px at ${origin.x}px ${origin.y}px)`,
            ],
          }}
          exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
          transition={{ duration: 0.95, times: [0, 0.5, 1], ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 20%, #38BDF8 0%, #6366F1 45%, #7C3AED 75%, #4C1D95 100%)' }} />
          <motion.div
            className="absolute inset-0 opacity-50 mix-blend-overlay"
            style={{ background: 'conic-gradient(from 0deg at 50% 50%, #fff0, #fff8, #fff0, #fde68a99, #fff0, #67e8f999, #fff0)' }}
            initial={{ rotate: 0 }}
            animate={{ rotate: 180 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                className="absolute rounded-full border border-white/50"
                style={{ width: 120, height: 120 }}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: [0.4, 3.2], opacity: [0.7, 0] }}
                transition={{ duration: 1.1, delay: 0.25 + i * 0.16, ease: 'easeOut' }}
              />
            ))}
            {PARTICLES.map((p, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full bg-white"
                style={{ width: p.s, height: p.s }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{ x: p.dx, y: p.dy, opacity: [0, 1, 0], scale: [0, 1, 0.4] }}
                transition={{ duration: 0.95, delay: 0.3 + p.d, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
            <motion.div
              className="relative w-24 h-24 rounded-[28px] bg-white/20 backdrop-blur-md border border-white/60 flex items-center justify-center shadow-[0_20px_60px_-10px_rgba(0,0,0,0.4)]"
              initial={{ scale: 0, rotate: -90, opacity: 0 }}
              animate={{ scale: [0, 1.15, 1], rotate: [-90, 8, 0], opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <UserRound className="w-12 h-12" strokeWidth={1.6} />
              <motion.span className="absolute -top-2 -right-2" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.7, type: 'spring', stiffness: 300, damping: 14 }}>
                <Sparkles className="w-7 h-7 text-amber-200" />
              </motion.span>
            </motion.div>
            <motion.div
              className="mt-5 text-center"
              initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.5, delay: 0.55 }}
            >
              <div className="text-2xl font-black tracking-[0.25em]">MY SPACE</div>
              {name && <div className="mt-1 text-sm font-semibold text-white/85">{name}</div>}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
