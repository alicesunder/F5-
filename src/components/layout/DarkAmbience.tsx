import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { THEME_FX_EASE, THEME_FX_EVENT, THEME_FX_MS } from '../../contexts/ThemeContext';

type Fx = { id: number; x: number; y: number; r: number; to: 'light' | 'dark' };
const SEC = THEME_FX_MS / 1000;
const EASE = [0.65, 0, 0.35, 1] as [number, number, number, number];

/**
 * ค่ำคืนคลุมจอ: วงแสงนำหน้าขอบความมืดที่ขยายออกจากปุ่ม · จันทร์เสี้ยวเรืองแสงที่ปุ่ม
 * ดาวแต่ละดวงสว่างวาบเมื่อขอบความมืดไปถึง · แสงขอบจอ (vignette) ค่อย ๆ ปิดลง
 * (กลับเป็นสว่าง: ตะวันขึ้นด้วยวงแสงสีทอง) · โหมดมืดมีดาวระยิบทั้งคืน
 */
export const DarkAmbience: React.FC = () => {
  const stars = useMemo(
    () =>
      Array.from({ length: 56 }, (_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const r = (n: number) => ((seed * (n + 3)) % 1000) / 1000;
        return { x: r(1) * 100, y: r(2) * 100, s: 1 + r(3) * 2.2, d: r(4) * 4, o: 0.5 + r(5) * 0.5 };
      }),
    [],
  );
  const [fx, setFx] = useState<Fx | null>(null);
  const [revealing, setRevealing] = useState(false);
  const origin = useRef<Fx | null>(null);

  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<Omit<Fx, 'id'>>).detail;
      const next = { id: Date.now(), ...d };
      origin.current = next;
      setFx(next);
      setRevealing(d.to === 'dark');
      window.setTimeout(() => setRevealing(false), THEME_FX_MS + 900);
      window.setTimeout(() => setFx(cur => (cur?.id === next.id ? null : cur)), THEME_FX_MS + 400);
    };
    window.addEventListener(THEME_FX_EVENT, on);
    return () => window.removeEventListener(THEME_FX_EVENT, on);
  }, []);

  // ดาวสว่างวาบเมื่อขอบความมืดมาถึง: หน่วงตามระยะจากปุ่ม
  const starDelay = (s: { x: number; y: number }) => {
    const o = origin.current;
    if (!o || typeof window === 'undefined') return 0;
    const dist = Math.hypot((s.x / 100) * window.innerWidth - o.x, (s.y / 100) * window.innerHeight - o.y);
    return (dist / o.r) * SEC;
  };

  return (
    <>
      <div className={`fo5-stars ${revealing ? 'revealing' : ''}`} aria-hidden="true">
        {stars.map((s, i) => (
          <i key={`${i}-${revealing ? fx?.id : 0}`} style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: revealing ? `${starDelay(s)}s` : `${s.d}s`, opacity: s.o }} />
        ))}
      </div>
      {createPortal(
        <AnimatePresence>
          {fx && (
            <motion.div key={fx.id} aria-hidden="true" className="fixed inset-0 z-[130] pointer-events-none overflow-hidden" exit={{ opacity: 0, transition: { duration: 0.4 } }}>
              {/* วงแสงนำหน้า: วงแหวนบางที่ขยายตามขอบหน้ากาก (ใช้ไล่สีวงแหวน ไม่ใช้เงา เพราะเงาจะขยายตามจนเต็มจอ) */}
              <motion.span
                className="absolute rounded-full"
                style={{
                  left: fx.x,
                  top: fx.y,
                  width: 200,
                  height: 200,
                  marginLeft: -100,
                  marginTop: -100,
                  background:
                    fx.to === 'dark'
                      ? 'radial-gradient(circle, transparent 0%, transparent 44%, rgba(129,140,248,0.0) 45%, rgba(129,140,248,0.28) 47.5%, rgba(224,231,255,0.95) 49.4%, rgba(129,140,248,0.28) 50.6%, transparent 53%, transparent 100%)'
                      : 'radial-gradient(circle, transparent 0%, transparent 44%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.35) 47.5%, rgba(255,255,255,0.95) 49.4%, rgba(255,255,255,0.35) 50.6%, transparent 53%, transparent 100%)',
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: (fx.r * 2) / 200, opacity: [1, 1, 0.9, 0] }}
                transition={{ scale: { duration: SEC, ease: EASE }, opacity: { duration: SEC, times: [0, 0.6, 0.85, 1] } }}
              />
              {/* จันทร์เสี้ยว/ตะวัน ที่ปุ่ม */}
              <motion.div
                className="absolute flex items-center justify-center rounded-full"
                style={{
                  left: fx.x,
                  top: fx.y,
                  width: 64,
                  height: 64,
                  marginLeft: -32,
                  marginTop: -32,
                  background: fx.to === 'dark' ? 'radial-gradient(circle, rgba(165,180,252,0.9), rgba(99,102,241,0.15) 70%)' : 'radial-gradient(circle, rgba(255,255,255,0.95), rgba(196,181,253,0.2) 70%)',
                  color: fx.to === 'dark' ? '#EEF2FF' : '#6D28D9',
                  boxShadow: fx.to === 'dark' ? '0 0 50px 14px rgba(129,140,248,0.55)' : '0 0 40px 10px rgba(167,139,250,0.4)',
                }}
                initial={{ scale: 0.2, opacity: 0, rotate: fx.to === 'dark' ? -40 : 40 }}
                animate={{ scale: [0.2, 1.25, 1, 1.9], opacity: [0, 1, 1, 0], rotate: 0 }}
                transition={{ duration: SEC * 0.9, times: [0, 0.25, 0.6, 1], ease: 'easeOut' }}
              >
                {fx.to === 'dark' ? <Moon className="w-8 h-8" fill="currentColor" strokeWidth={1.4} /> : <Sun className="w-8 h-8" strokeWidth={2} />}
              </motion.div>
              {/* ขอบจอมืดลงแล้วจาง (เฉพาะเข้าโหมดมืด) */}
              {fx.to === 'dark' && (
                <motion.div
                  className="absolute inset-0"
                  style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(11,13,19,0.65) 100%)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: SEC * 1.2, times: [0, 0.45, 1], ease: 'easeInOut' }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
};

// ให้ TS ไม่เตือน import ที่ใช้ในคอมเมนต์เท่านั้น
void THEME_FX_EASE;
