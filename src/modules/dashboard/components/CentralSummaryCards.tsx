import React, { useState } from 'react';
import { useAdmin } from '../../../contexts/AdminContext';
import { CentralDashboardStats, DEPARTMENT_COLORS } from '../../../types';
import { AnimatedCounter } from '../../../components/common/AnimatedCounter';
import {
  FileText,
  Clock,
  Megaphone,
  AlertTriangle,
  MapPin,
  BellRing,
  ArrowUpRight,
} from 'lucide-react';

interface CentralSummaryCardsProps {
  stats: CentralDashboardStats;
}

export const CentralSummaryCards: React.FC<CentralSummaryCardsProps> = ({ stats }) => {
  const { navigateModule } = useAdmin();
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setHoveredCardId(cardId);
  };

  const cards = [
    {
      id: 'total-tasks',
      title: 'งานทั้งหมด',
      count: stats.totalTasks,
      unit: 'รายการ',
      subtitle: 'เอกสารและภารกิจราชการ',
      color: DEPARTMENT_COLORS.admin,
      icon: FileText,
      targetModule: 'admin' as const,
      badgeText: 'ฝ่ายอำนวยการ',
    },
    {
      id: 'in-progress',
      title: 'งานที่กำลังดำเนินการ',
      count: stats.inProgressTasks,
      unit: 'เรื่อง',
      subtitle: 'อยู่ระหว่างดำเนินการตามขั้นตอน',
      color: '#0284C7', // Sky
      icon: Clock,
      targetModule: 'admin' as const,
      badgeText: 'ติดตามผล',
    },
    {
      id: 'pr-news',
      title: 'ข่าวประชาสัมพันธ์',
      count: stats.totalNews,
      unit: 'ข่าว',
      subtitle: 'ข่าวสารและสื่อเผยแพร่สาธารณะ',
      color: DEPARTMENT_COLORS.relations,
      icon: Megaphone,
      targetModule: 'relations' as const,
      badgeText: 'ฝ่ายมวลชนฯ',
    },
    {
      id: 'disasters',
      title: 'เหตุการณ์สาธารณภัย',
      count: stats.activeDisasters,
      unit: 'เหตุ',
      subtitle: 'เหตุภัยพิบัติและการเฝ้าระวัง',
      color: DEPARTMENT_COLORS.disaster,
      icon: AlertTriangle,
      targetModule: 'disaster' as const,
      badgeText: 'สาธารณภัย',
    },
    {
      id: 'watch-zones',
      title: 'พื้นที่เฝ้าระวัง',
      count: stats.watchZones,
      unit: 'สถานี',
      subtitle: 'สถานีโทรมาตรและจุดเสี่ยงภัย',
      color: '#D97706', // Amber
      icon: MapPin,
      targetModule: 'disaster' as const,
      badgeText: 'โทรมาตร',
    },
    {
      id: 'announcements',
      title: 'ประกาศล่าสุด',
      count: stats.latestAnnouncements,
      unit: 'ฉบับ',
      subtitle: 'ข้อสั่งการและประกาศราชการ',
      color: '#8B5CF6', // Purple
      icon: BellRing,
      targetModule: 'relations' as const,
      badgeText: 'ข่าวสาร',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      {cards.map(card => {
        const IconComponent = card.icon;
        const isHovered = hoveredCardId === card.id;

        return (
          <div
            key={card.id}
            onClick={() => navigateModule(card.targetModule)}
            onMouseMove={e => handleMouseMove(e, card.id)}
            onMouseLeave={() => setHoveredCardId(null)}
            className="group liquid-glass-card liquid-glass-sheen bpp-card-interactive iridescent-edge rounded-2xl p-4 cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            {/* Item 23: Cursor-Following Hover Light Spotlight */}
            {isHovered && (
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  background: `radial-gradient(180px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.35), transparent 75%)`,
                }}
              />
            )}

            {/* Top Row: Icon & Tag */}
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                  style={{
                    backgroundColor: `${card.color}15`,
                    color: card.color,
                  }}
                >
                  <IconComponent className="w-5 h-5" />
                </div>

                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors"
                  style={{
                    backgroundColor: `${card.color}12`,
                    color: card.color,
                  }}
                >
                  {card.badgeText}
                </span>
              </div>

              {/* Title & Count (Item 12: Smooth count-up 600-900ms) */}
              <div className="text-xs font-semibold text-slate-600 line-clamp-1">
                {card.title}
              </div>
              <div className="flex items-baseline gap-1.5 mt-1 font-mono">
                <span className="text-2xl font-bold text-slate-900 tracking-tight">
                  <AnimatedCounter value={card.count} duration={750} />
                </span>
                <span className="text-xs font-medium text-slate-400 font-sans">
                  {card.unit}
                </span>
              </div>
            </div>

            {/* Bottom Row: Subtitle & Navigate Indicator */}
            <div className="relative z-10 pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate">{card.subtitle}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
