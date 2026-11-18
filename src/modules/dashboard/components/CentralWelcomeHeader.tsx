import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

export const CentralWelcomeHeader: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date in Thai Buddhist Era e.g. "10 กันยายน 2569"
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  const day = currentTime.getDate();
  const month = thaiMonths[currentTime.getMonth()];
  const year = currentTime.getFullYear() + 543; // BE
  const formattedDate = `${day} ${month} ${year}`;

  const formattedTime = currentTime.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="relative w-full bg-gradient-to-r from-white via-[#FAF9FD] to-[#F3F0FA] rounded-3xl border border-purple-100/80 shadow-xs p-6 sm:p-8 overflow-hidden">
      {/* Cinematic Video Panel on the Right */}
      <div className="absolute inset-y-0 right-0 w-full sm:w-[58%] lg:w-[52%] overflow-hidden pointer-events-none">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/assets/landing-hero.mp4" type="video/mp4" />
        </video>

        {/* Fade the video into the clean white hero on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-white/5" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#27265B]/10 via-transparent to-transparent" />
      </div>

      {/* Top Bar: Date & Time in Top Right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        {/* Welcome Sub-heading */}
        <div className="text-sm font-semibold text-slate-500 tracking-wide">
          ยินดีต้อนรับสู่
        </div>

        {/* Real-time Date and Time */}
        <div className="flex items-center gap-4 text-xs sm:text-sm font-medium text-slate-700 bg-white/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-purple-100 shadow-2xs self-start sm:self-auto">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#51439A]" />
            <span>{formattedDate}</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#51439A]" />
            <span className="font-mono font-bold text-[#27265B]">{formattedTime} น.</span>
          </div>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="mt-3 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left: Big Logo & Title */}
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 shadow-md flex items-center justify-center flex-shrink-0 transition hover:scale-105 duration-200">
              <img
                src="/assets/fo5-logo.png"
                alt="ฝอ 5 Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-3xl sm:text-5xl font-black text-[#27265B] tracking-tight leading-tight">
                ฝอ 5
              </h2>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <p className="text-sm sm:text-base font-semibold text-slate-700">
              “ร่วมคิด ร่วมทำ เพื่อความก้าวหน้า อย่างยั่งยืน”
            </p>
            {/* 4 Colors Underline */}
            <div className="w-20 h-1 rounded-full bg-gradient-to-r from-[#7F9B83] via-[#EE7E9E] via-[#8191BA] to-[#EFBB4B]" />
          </div>
        </div>

        {/* Right Quote Card matching reference */}
        <div className="lg:max-w-xs w-full">
          <div className="p-4 sm:p-5 rounded-2xl bg-white/85 backdrop-blur-md border border-purple-100/90 shadow-sm text-center">
            <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
              “ข้อมูลที่ดี นำไปสู่การตัดสินใจที่ดีกว่า”
            </p>
            <div className="w-12 h-0.5 rounded-full bg-gradient-to-r from-[#7F9B83] via-[#EE7E9E] via-[#8191BA] to-[#EFBB4B] mx-auto mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CentralWelcomeHeader;
