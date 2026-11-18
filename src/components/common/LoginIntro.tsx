import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';

interface Props {
  name?: string;
  onDone: () => void;
}

// ลำดับฉาก: 0 บูตระบบ → 1 AI → 2 ไปสู่เทคโนโลยี → 3 โลโก้
const STEP_MS = [700, 1600, 1000, 1300] as const; // รวมประมาณ 4.6 วินาที
const TOTAL_MS = STEP_MS.reduce((a, b) => a + b, 0);
const BOOT_LINES = ['INITIALIZING FO5 CORE', 'LOADING AI MODELS', 'SECURE CHANNEL  ●  ONLINE'];

const GRAD = 'linear-gradient(100deg,#7DF9FF 0%,#B388FF 45%,#FF7EB6 80%,#FFD36E 100%)';
const clipText: React.CSSProperties = {
  backgroundImage: GRAD,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};
const ease = [0.2, 0.8, 0.2, 1] as const;
// สีเข้มสดเฉพาะคำว่า AI ให้เด่นกว่าส่วนอื่น
const AI_TEXT: React.CSSProperties = {
  backgroundImage: 'linear-gradient(115deg,#00F0FF 0%,#4D7CFF 35%,#A44DFF 60%,#FF2E93 85%,#FFB347 100%)',
  backgroundSize: '200% 100%',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};

const reduced = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// แยกเป็นกลุ่มตัวอักษร (grapheme) เพื่อไม่ให้สระและวรรณยุกต์ไทยหลุดจากพยัญชนะ
const graphemes = (t: string): string[] =>
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? Array.from(new Intl.Segmenter('th', { granularity: 'grapheme' }).segment(t), x => x.segment)
    : [t];

/** พื้นหลังเครือข่ายอนุภาคเรืองแสง: ฉาก AI ดึงอนุภาคเข้าหาศูนย์กลาง ฉากโลโก้ผลักออก */
const NeuralField: React.FC<{ step: number }> = ({ step }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const stepRef = useRef(step);
  stepRef.current = step;

  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    let w = 0;
    let h = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const n = Math.round(Math.min(110, Math.max(50, (w * h) / 16000)));
    const hues = [190, 265, 330, 45];
    const pts = Array.from({ length: n }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: 1 + Math.random() * 1.8,
      hue: hues[i % hues.length],
    }));

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      const s = stepRef.current;
      const pull = s === 1 ? 0.0005 : s >= 2 ? -0.0006 : 0; // ฉาก AI ดึงเข้าเบาๆ แล้วกระจายออก
      const cx = w / 2;
      const cy = h / 2;
      for (const p of pts) {
        // ไม่ดึงเข้าใกล้กว่า 140px เพื่อไม่ให้กองทับตัวอักษรกลางจอ
        const k = Math.hypot(cx - p.x, cy - p.y) < 140 && pull > 0 ? -pull : pull;
        p.vx = Math.max(-2.5, Math.min(2.5, (p.vx + (cx - p.x) * k) * 0.97));
        p.vy = Math.max(-2.5, Math.min(2.5, (p.vy + (cy - p.y) * k) * 0.97));
        p.x += p.vx + (Math.random() - 0.5) * 0.15;
        p.y += p.vy + (Math.random() - 0.5) * 0.15;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }
      const maxD = s === 1 ? 150 : 120;
      ctx.lineWidth = 0.8;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < maxD) {
            ctx.strokeStyle = `hsla(${a.hue},90%,70%,${(1 - d / maxD) * 0.35})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.shadowBlur = 10;
      for (const p of pts) {
        ctx.fillStyle = `hsla(${p.hue},95%,75%,0.95)`;
        ctx.shadowColor = `hsla(${p.hue},95%,65%,1)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full" aria-hidden />;
};

const spin = (seconds: number, dir: 1 | -1) => ({
  style: { transformOrigin: '50% 50%', transformBox: 'fill-box' as const },
  animate: { rotate: 360 * dir },
  transition: { duration: seconds, repeat: Infinity, ease: 'linear' as const },
});

/** วงแหวน HUD หมุนซ้อนกันรอบคำว่า AI */
const Rings: React.FC = () => (
  <motion.svg
    viewBox="0 0 400 400"
    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] sm:w-[44rem] sm:h-[44rem] pointer-events-none"
    initial={{ opacity: 0, scale: 0.4 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease }}
    aria-hidden
  >
    <defs>
      <linearGradient id="fo5-ring" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#7DF9FF" />
        <stop offset="0.5" stopColor="#B388FF" />
        <stop offset="1" stopColor="#FF7EB6" />
      </linearGradient>
    </defs>
    <motion.g {...spin(14, 1)}>
      <circle cx="200" cy="200" r="190" fill="none" stroke="url(#fo5-ring)" strokeWidth="1.5" strokeDasharray="2 10" opacity="0.8" />
      <circle cx="200" cy="10" r="5" fill="#7DF9FF" />
      <circle cx="390" cy="200" r="3.5" fill="#FF7EB6" />
    </motion.g>
    <motion.g {...spin(9, -1)}>
      <circle cx="200" cy="200" r="160" fill="none" stroke="url(#fo5-ring)" strokeWidth="2" strokeDasharray="90 40 20 40" opacity="0.9" />
    </motion.g>
    <motion.g {...spin(5.5, 1)}>
      <circle cx="200" cy="200" r="128" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="4 6" opacity="0.5" />
      <path d="M200 72 A128 128 0 0 1 328 200" fill="none" stroke="#7DF9FF" strokeWidth="3" strokeLinecap="round" />
    </motion.g>
    {Array.from({ length: 36 }, (_, i) => {
      const a = (i * 10 * Math.PI) / 180;
      const r2 = i % 3 === 0 ? 184 : 180;
      return (
        <line
          key={i}
          x1={200 + Math.cos(a) * 176}
          y1={200 + Math.sin(a) * 176}
          x2={200 + Math.cos(a) * r2}
          y2={200 + Math.sin(a) * r2}
          stroke="#fff"
          strokeOpacity={i % 3 === 0 ? 0.7 : 0.3}
        />
      );
    })}
  </motion.svg>
);

/** อินโทรหลังล็อกอิน: บูตระบบ → AI → เทคโนโลยี → โลโก้ กดที่ใดก็ได้หรือ Esc เพื่อข้าม */
export const LoginIntro: React.FC<Props> = ({ name, onDone }) => {
  const [step, setStep] = useState(0);
  const [bootLine, setBootLine] = useState(0);
  const calm = reduced();
  const last = STEP_MS.length - 1;

  useEffect(() => {
    if (calm) {
      const t = setTimeout(onDone, 1000);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => (step < last ? setStep(step + 1) : onDone()), STEP_MS[step]);
    return () => clearTimeout(t);
  }, [step, last, calm, onDone]);

  useEffect(() => {
    if (step !== 0) return;
    const t = setInterval(() => setBootLine(l => Math.min(l + 1, BOOT_LINES.length - 1)), 200);
    return () => clearInterval(t);
  }, [step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') onDone();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDone]);

  return createPortal(
    <motion.div
      role="dialog"
      aria-label="ยินดีต้อนรับสู่ ฝอ.5"
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden text-white cursor-pointer select-none"
      style={{ background: 'radial-gradient(110% 80% at 50% 45%, #1A1050 0%, #0B0724 55%, #04030F 100%)' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.35 } }}
      onClick={onDone}
    >
      {!calm && <NeuralField step={step} />}

      {/* ตารางพื้นมุมมอง 3 มิติ */}
      {!calm && (
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(125,249,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(125,249,255,.35) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            transform: 'perspective(500px) rotateX(62deg)',
            transformOrigin: 'bottom',
            maskImage: 'linear-gradient(to top, #000 0%, transparent 85%)',
            WebkitMaskImage: 'linear-gradient(to top, #000 0%, transparent 85%)',
          }}
        />
      )}

      {/* เส้นสแกนวิ่งลง */}
      {!calm && (
        <motion.div
          className="absolute inset-x-0 top-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(125,249,255,.10), transparent)' }}
          initial={{ y: '-20vh' }}
          animate={{ y: '120vh' }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
        />
      )}

      <div className="relative z-10 w-full px-6 flex items-center justify-center min-h-[22rem]">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="boot"
              className="font-mono text-left text-xs sm:text-sm text-cyan-200/90 space-y-2"
              exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
            >
              {name && <div className="text-white/70 mb-3 font-sans text-sm">สวัสดี {name}</div>}
              {BOOT_LINES.slice(0, bootLine + 1).map((l, i) => (
                <motion.div key={l} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15 }}>
                  <span className="text-fuchsia-300">&gt;</span> {l}
                  {i === bootLine && <span className="inline-block w-2 h-3.5 bg-cyan-200 ml-1 align-middle animate-pulse" />}
                </motion.div>
              ))}
              <div className="w-56 h-1 bg-white/10 rounded overflow-hidden mt-3">
                <motion.div
                  className="h-full"
                  style={{ backgroundImage: GRAD }}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: STEP_MS[0] / 1000, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="ai"
              className="relative flex flex-col items-center justify-center"
              exit={{ opacity: 0, scale: 1.25, filter: 'blur(14px)', transition: { duration: 0.25 } }}
            >
              <Rings />
              <motion.span
                aria-hidden
                className="absolute left-1/2 top-1/2 -ml-20 -mt-20 w-40 h-40 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(179,136,255,.7), transparent 70%)' }}
                initial={{ scale: 0.2, opacity: 1 }}
                animate={{ scale: [0.2, 5, 4.6], opacity: [1, 0.35, 0.2] }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
              <motion.p
                initial={{ opacity: 0, y: -14, letterSpacing: '0.6em' }}
                animate={{ opacity: 1, y: 0, letterSpacing: '0.28em' }}
                transition={{ delay: 0.05, duration: 0.45, ease }}
                className="relative text-sm sm:text-xl font-bold text-white/85 mb-1"
              >
                ฝอ.5 ใช้
              </motion.p>
              <div className="relative" style={{ filter: 'drop-shadow(0 0 28px rgba(179,136,255,.85)) drop-shadow(0 0 70px rgba(125,249,255,.5))' }}>
                {/* ชั้นเหลื่อมสีแบบกลิตช์ */}
                {[
                  { c: '#00E5FF', x: [-8, 6, -3, 0] },
                  { c: '#FF3D9A', x: [8, -6, 3, 0] },
                ].map(g => (
                  <motion.span
                    key={g.c}
                    aria-hidden
                    className="absolute inset-0 text-[8rem] sm:text-[15rem] font-black leading-none tracking-tighter mix-blend-screen"
                    style={{ color: g.c }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.9, 0, 0.7, 0], x: g.x }}
                    transition={{ delay: 0.3, duration: 0.5, times: [0, 0.2, 0.45, 0.7, 1] }}
                  >
                    AI
                  </motion.span>
                ))}
                <motion.h1
                  className="relative text-[8rem] sm:text-[15rem] font-black leading-none tracking-tighter"
                  style={AI_TEXT}
                  initial={{ opacity: 0, scale: 2.2, filter: 'blur(30px)', backgroundPosition: '0% 50%' }}
                  animate={{ opacity: 1, scale: [2.2, 1, 1.04, 1], filter: 'blur(0px)', backgroundPosition: '100% 50%' }}
                  transition={{
                    default: { duration: 0.45, ease },
                    scale: { duration: 1.3, times: [0, 0.36, 0.7, 1], ease },
                    backgroundPosition: { duration: 1.6, ease: 'easeInOut' },
                  }}
                >
                  AI
                </motion.h1>
              </div>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.35 }}
                className="relative mt-2 text-sm sm:text-lg text-cyan-100/90 tracking-wide"
              >
                ช่วยคิด · ช่วยสรุป · ช่วยตัดสินใจ
              </motion.p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="tech" className="relative text-center space-y-3" exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.3 } }}>
              <div className="overflow-hidden">
                <motion.p
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.35, ease }}
                  className="text-2xl sm:text-4xl font-light tracking-[0.35em] text-white/80"
                >
                  ไปสู่
                </motion.p>
              </div>
              <h1
                className="text-6xl sm:text-9xl font-black tracking-tight leading-tight"
                style={{ filter: 'drop-shadow(0 0 30px rgba(125,249,255,.45))', perspective: 600 }}
              >
                {graphemes('เทคโนโลยี').map((ch, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    style={clipText}
                    initial={{ opacity: 0, y: 60, rotateX: -80, filter: 'blur(12px)' }}
                    animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                    transition={{ delay: 0.1 + i * 0.035, duration: 0.35, ease }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </h1>
              <motion.div
                className="mx-auto h-[3px] rounded-full"
                style={{ backgroundImage: GRAD }}
                initial={{ width: 0 }}
                animate={{ width: '16rem' }}
                transition={{ delay: 0.45, duration: 0.4, ease }}
              />
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="text-sm sm:text-lg text-white/75">
                ข้อมูล · การสื่อสาร · ร่วมคิด ร่วมทำ
              </motion.p>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="logo" className="relative flex flex-col items-center gap-6">
              <motion.div
                className="relative"
                initial={{ scale: 0.1, rotate: -270, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* คลื่นกระแทก */}
                {[0, 0.3, 0.6].map(d => (
                  <motion.span
                    key={d}
                    aria-hidden
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: 'rgba(179,136,255,.7)' }}
                    initial={{ scale: 1, opacity: 0.9 }}
                    animate={{ scale: 3, opacity: 0 }}
                    transition={{ delay: 0.3 + d / 2, duration: 1, ease: 'easeOut', repeat: Infinity, repeatDelay: 0.2 }}
                  />
                ))}
                <div className="absolute -inset-6 rounded-full blur-2xl" style={{ background: GRAD, opacity: 0.55 }} />
                <img
                  src="/assets/fo5-logo.png"
                  alt="โลโก้ ฝอ 5"
                  className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-white p-1.5 object-contain ring-4 ring-white/25 shadow-2xl"
                />
                {/* แสงกวาดผ่านโลโก้ */}
                <span className="absolute inset-0 rounded-full overflow-hidden pointer-events-none" aria-hidden>
                  <motion.span
                    className="absolute top-0 bottom-0 w-1/3"
                    style={{ background: 'linear-gradient(100deg, transparent, rgba(255,255,255,.75), transparent)' }}
                    initial={{ left: '-40%' }}
                    animate={{ left: '140%' }}
                    transition={{ delay: 0.5, duration: 0.55, ease: 'easeInOut' }}
                  />
                </span>
              </motion.div>
              <div className="text-center space-y-1.5">
                <div className="text-4xl sm:text-6xl font-black flex justify-center gap-[0.15em]" style={{ filter: 'drop-shadow(0 0 20px rgba(179,136,255,.6))' }}>
                  {graphemes('ฝอ 5').map((ch, i) => (
                    <motion.span
                      key={i}
                      style={clipText}
                      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ delay: 0.35 + i * 0.06, duration: 0.3, ease }}
                    >
                      {ch === ' ' ? ' ' : ch}
                    </motion.span>
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0, letterSpacing: '0.5em' }}
                  animate={{ opacity: 1, letterSpacing: '0.12em' }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="text-xs sm:text-sm text-white/70"
                >
                  ร่วมคิด ร่วมทำ เพื่อความก้าวหน้า อย่างยั่งยืน
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-5 inset-x-0 text-center text-[11px] text-white/40">แตะที่ใดก็ได้เพื่อข้าม</div>

      {!calm && (
        <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10">
          <motion.div
            className="h-full"
            style={{ backgroundImage: GRAD }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: TOTAL_MS / 1000, ease: 'linear' }}
          />
        </div>
      )}
    </motion.div>,
    document.body
  );
};
