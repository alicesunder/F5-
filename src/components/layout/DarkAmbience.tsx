import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { THEME_FX_EVENT } from '../../contexts/ThemeContext';

/**
 * บรรยากาศโหมดมืด: ดาวระยิบระยับทั้งหน้า + ตอนสลับเป็นมืดมีวงแสงจันทร์แผ่ออกจากปุ่มและดาวตกพาดผ่านจอ
 */
export const DarkAmbience: React.FC = () => {
  const stars = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const r = (n: number) => ((seed * (n + 3)) % 1000) / 1000;
        return { x: r(1) * 100, y: r(2) * 100, s: 1 + r(3) * 2, d: r(4) * 4, o: 0.5 + r(5) * 0.5 };
      }),
    [],
  );
  const [fx, setFx] = useState<{ id: number; x: number; y: number; to: 'light' | 'dark' } | null>(null);

  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<{ to: 'light' | 'dark'; x: number; y: number }>).detail;
      const id = Date.now();
      setFx({ id, ...d });
      window.setTimeout(() => setFx(cur => (cur?.id === id ? null : cur)), 1800);
    };
    window.addEventListener(THEME_FX_EVENT, on);
    return () => window.removeEventListener(THEME_FX_EVENT, on);
  }, []);

  return (
    <>
      <div className="fo5-stars" aria-hidden="true">
        {stars.map((s, i) => (
          <i key={i} style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${s.d}s`, opacity: s.o }} />
        ))}
      </div>
      {createPortal(
        <AnimatePresence>
          {fx && (
            <motion.div key={fx.id} aria-hidden="true" className="fixed inset-0 z-[130] pointer-events-none overflow-hidden" exit={{ opacity: 0 }}>
              {/* วงแสงแผ่ออกจากปุ่ม */}
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: fx.x,
                    top: fx.y,
                    width: 80,
                    height: 80,
                    marginLeft: -40,
                    marginTop: -40,
                    border: `2px solid ${fx.to === 'dark' ? 'rgba(165,180,252,0.8)' : 'rgba(251,191,36,0.85)'}`,
                    boxShadow: `0 0 40px 6px ${fx.to === 'dark' ? 'rgba(129,140,248,0.5)' : 'rgba(251,191,36,0.55)'}`,
                  }}
                  initial={{ scale: 0.3, opacity: 0.9 }}
                  animate={{ scale: 14, opacity: 0 }}
                  transition={{ duration: 1.1, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                />
              ))}
              {/* ดาวตก (เฉพาะเปลี่ยนเป็นมืด) */}
              {fx.to === 'dark' &&
                [0, 1, 2].map(i => (
                  <motion.span
                    key={`m${i}`}
                    className="absolute h-[2px] w-40 rounded-full"
                    style={{ top: `${10 + i * 16}%`, left: '-12%', background: 'linear-gradient(90deg, transparent, #fff 70%, #c7d2fe)', rotate: 18 }}
                    initial={{ x: 0, opacity: 0 }}
                    animate={{ x: '125vw', y: 220, opacity: [0, 1, 0] }}
                    transition={{ duration: 1.1, delay: 0.25 + i * 0.28, ease: 'easeIn' }}
                  />
                ))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
};
