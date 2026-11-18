import React, { useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

interface BackgroundBackdropProps {
  showControls?: boolean;
}

export const BackgroundBackdrop: React.FC<BackgroundBackdropProps> = ({ showControls = true }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden select-none z-0">
      {/* Background Video - Exact Fluent 3D Loop */}
      <video
        ref={videoRef}
        src="/assets/fluent-hero-loop.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover object-center pointer-events-none"
      />

      {/* Luminous Frosted Translucent Overlay:
          Allows the 3D shapes, smooth pastel motions, sticky notes, and paper animations
          to remain clearly visible, while keeping all text and cards readable and clean.
      */}
      <div className="absolute inset-0 bg-[#F4F6FA]/55 sm:bg-[#F4F6FA]/45 backdrop-blur-[1px] pointer-events-none" />

      {/* Directional Soft Light Gradients for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#F4F6FA]/80 via-[#F4F6FA]/45 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#F4F6FA]/70 via-transparent to-[#F4F6FA]/50 pointer-events-none" />

      {/* Modern High-Precision Engineering Grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15, 23, 42, 0.7) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.7) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
        }}
      />

      {/* Micro-Dot Subgrid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(15, 23, 42, 0.9) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Subtle crosshair and datum line */}
      <svg
        className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="3%" y1="36%" x2="97%" y2="36%" stroke="#0284C7" strokeWidth="1" strokeDasharray="5 7" />
        <g stroke="rgba(15,23,42,0.18)" strokeWidth="1">
          <line x1="32" y1="44" x2="48" y2="44" />
          <line x1="40" y1="36" x2="40" y2="52" />
        </g>
      </svg>

      {/* Small subtle background motion indicator / toggle */}
      {showControls && (
        <div className="absolute bottom-20 right-4 sm:right-8 z-30 pointer-events-auto">
          <button
            type="button"
            onClick={togglePlay}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 hover:bg-white backdrop-blur-md border border-white/80 shadow-[0_2px_10px_rgba(15,23,42,0.06)] text-[11px] font-mono text-slate-600 hover:text-sky-700 transition-all cursor-pointer active:scale-95"
            title={isPlaying ? 'หยุดภาพเคลื่อนไหวพื้นหลังชั่วคราว' : 'เล่นภาพเคลื่อนไหวพื้นหลัง'}
          >
            {isPlaying ? (
              <Pause className="w-3 h-3 text-sky-600" />
            ) : (
              <Play className="w-3 h-3 text-sky-600 fill-current" />
            )}
            <span className="font-sans font-medium text-[11px]">
              {isPlaying ? 'ภาพพื้นหลังเคลื่อนไหว' : 'หยุดภาพพื้นหลัง'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
