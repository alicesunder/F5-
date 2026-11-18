import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';

interface Props {
  name?: string;
  onDone: () => void;
}

// แต่ละช่วง: ข้อความใหญ่ + ข้อความรอง (ช่วงสุดท้ายแสดงโลโก้)
const BEATS = [
  { big: 'ฝอ.5', small: 'ศูนย์บริหารและประมวลผลข้อมูล' },
  { big: 'ใช้ AI', small: 'ช่วยคิด ช่วยสรุป ช่วยตัดสินใจ' },
  { big: 'ไปสู่', small: 'การทำงานที่เร็วขึ้น แม่นยำขึ้น' },
  { big: 'เทคโนโลยี', small: 'ข้อมูล · การสื่อสาร · ร่วมคิด ร่วมทำ' },
] as const;

const BEAT_MS = 1100;

// แยกเป็นกลุ่มตัวอักษร (grapheme) เพื่อไม่ให้สระและวรรณยุกต์ไทยหลุดจากพยัญชนะ
const graphemes = (t: string): string[] =>
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? Array.from(new Intl.Segmenter('th', { granularity: 'grapheme' }).segment(t), x => x.segment)
    : [t];
const LOGO_MS = 2100;

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** อินโทรหลังล็อกอิน: ข้อความเคลื่อนไหวต่อเนื่องแล้วปิดท้ายด้วยโลโก้ กดที่ใดก็ได้หรือกด Esc เพื่อข้าม */
export const LoginIntro: React.FC<Props> = ({ name, onDone }) => {
  const [step, setStep] = useState(0); // 0..BEATS.length-1 = ข้อความ, BEATS.length = โลโก้
  const calm = reduced();
  const last = BEATS.length;

  useEffect(() => {
    if (calm) {
      const t = setTimeout(onDone, 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => (step < last ? setStep(step + 1) : onDone()),
      step < last ? BEAT_MS : LOGO_MS
    );
    return () => clearTimeout(t);
  }, [step, last, calm, onDone]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') onDone();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDone]);

  const beat = BEATS[Math.min(step, last - 1)];

  return createPortal(
    <motion.div
      role="dialog"
      aria-label="ยินดีต้อนรับสู่ ฝอ.5"
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden text-white cursor-pointer select-none"
      style={{ background: 'radial-gradient(120% 90% at 50% 20%, #3A1C66 0%, #1B0E3D 55%, #0B0620 100%)' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      onClick={onDone}
    >
      {/* ลำแสงสีพื้นหลัง */}
      {!calm && (
        <>
          <motion.div
            className="absolute -top-40 -left-32 w-[32rem] h-[32rem] rounded-full blur-3xl"
            style={{ background: 'rgba(239,187,75,0.22)' }}
            animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-40 -right-24 w-[34rem] h-[34rem] rounded-full blur-3xl"
            style={{ background: 'rgba(238,126,158,0.22)' }}
            animate={{ x: [0, -50, 0], y: [0, -50, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl"
            style={{ background: 'rgba(129,145,186,0.2)' }}
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      <div className="relative z-10 px-6 text-center w-full max-w-3xl">
        {name && step === 0 && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 0.85, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-sm sm:text-base mb-3 text-white/80"
          >
            สวัสดี {name}
          </motion.p>
        )}

        <AnimatePresence mode="wait">
          {step < last ? (
            <motion.div key={step} className="space-y-4">
              <h1 className="text-6xl sm:text-8xl font-black tracking-tight leading-none" aria-live="polite">
                {graphemes(beat.big).map((ch, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ opacity: 0, y: 36, filter: 'blur(14px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -28, filter: 'blur(10px)', transition: { duration: 0.28 } }}
                    transition={{ delay: calm ? 0 : i * 0.06, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                    style={{
                      backgroundImage: 'linear-gradient(90deg,#fff 0%,#F6D98C 55%,#F5A6BE 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    {ch === ' ' ? ' ' : ch}
                  </motion.span>
                ))}
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ delay: calm ? 0 : 0.35, duration: 0.5 }}
                className="text-sm sm:text-lg text-white/75"
              >
                {beat.small}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="logo"
              className="flex flex-col items-center gap-5"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 140, damping: 16 }}
            >
              <div className="relative">
                {!calm && (
                  <motion.span
                    className="absolute inset-0 rounded-full border-2 border-white/40"
                    initial={{ scale: 1, opacity: 0.7 }}
                    animate={{ scale: 1.9, opacity: 0 }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}
                <motion.img
                  src="/assets/fo5-logo.svg"
                  alt="โลโก้ ฝอ 5"
                  className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-full shadow-2xl ring-4 ring-white/20"
                  initial={{ rotate: -90 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-1"
              >
                <div className="text-3xl sm:text-4xl font-black tracking-tight">ฝอ 5</div>
                <div className="text-xs sm:text-sm text-white/70">ร่วมคิด ร่วมทำ เพื่อความก้าวหน้า อย่างยั่งยืน</div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-6 inset-x-0 text-center text-[11px] text-white/45">แตะที่ใดก็ได้เพื่อข้าม</div>

      {/* แถบความคืบหน้า */}
      {!calm && (
        <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-[#7F9B83] via-[#EE7E9E] via-[#8191BA] to-[#EFBB4B]"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: (BEATS.length * BEAT_MS + LOGO_MS) / 1000, ease: 'linear' }}
          />
        </div>
      )}
    </motion.div>,
    document.body
  );
};
