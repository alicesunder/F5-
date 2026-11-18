import React from 'react';
import { RelationsStats, NewsStatus } from '../types';
import {
  FileText,
  CheckCircle2,
  FileEdit,
  Clock,
  Image as ImageIcon,
  BellRing,
} from 'lucide-react';

interface RelationsSummaryCardsProps {
  stats: RelationsStats;
  onFilterStatus?: (status: NewsStatus | 'all') => void;
  onGoToMedia?: () => void;
  onGoToAnnouncements?: () => void;
}

export const RelationsSummaryCards: React.FC<RelationsSummaryCardsProps> = ({
  stats,
  onFilterStatus,
  onGoToMedia,
  onGoToAnnouncements,
}) => {
  const primaryColor = '#2583D8';

  const cards = [
    {
      id: 'total',
      label: 'ข่าวทั้งหมด',
      value: stats.totalNews,
      subtext: `ยอดวิวรวม ${stats.totalViews.toLocaleString()} ครั้ง`,
      icon: FileText,
      color: primaryColor,
      bgColor: 'bg-sky-500/15',
      badge: 'ALL NEWS',
      onClick: () => onFilterStatus?.('all'),
    },
    {
      id: 'published',
      label: 'ข่าวเผยแพร่แล้ว',
      value: stats.publishedCount,
      subtext: 'ออนไลน์บนพอร์ทัลประชาชน',
      icon: CheckCircle2,
      color: '#10B981',
      bgColor: 'bg-emerald-500/15',
      badge: 'PUBLISHED',
      onClick: () => onFilterStatus?.('Published'),
    },
    {
      id: 'draft',
      label: 'ข่าวร่าง',
      value: stats.draftCount,
      subtext: 'ฉบับร่างอยู่ระหว่างเรียบเรียง',
      icon: FileEdit,
      color: '#6366F1',
      bgColor: 'bg-indigo-500/15',
      badge: 'DRAFT',
      onClick: () => onFilterStatus?.('Draft'),
    },
    {
      id: 'pending',
      label: 'ข่าวรออนุมัติ',
      value: stats.pendingCount,
      subtext: 'รอหัวหน้าฝ่ายตรวจสอบเนื้อหา',
      icon: Clock,
      color: '#F59E0B',
      bgColor: 'bg-amber-500/15',
      badge: 'PENDING',
      onClick: () => onFilterStatus?.('Pending'),
    },
    {
      id: 'media',
      label: 'สื่อประชาสัมพันธ์',
      value: stats.totalMedia,
      subtext: 'ภาพ, วิดีโอ และเอกสาร PDF',
      icon: ImageIcon,
      color: '#0284C7',
      bgColor: 'bg-cyan-500/15',
      badge: 'MEDIA',
      onClick: onGoToMedia,
    },
    {
      id: 'announcements',
      label: 'จำนวนประกาศ',
      value: stats.announcementsCount,
      subtext: 'ประกาศคำสั่งและข้อบังคับ',
      icon: BellRing,
      color: '#8B5CF6',
      bgColor: 'bg-purple-500/15',
      badge: 'NOTICES',
      onClick: onGoToAnnouncements,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={card.onClick}
            className="p-4 rounded-2xl liquid-glass-card iridescent-edge hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden group"
          >
            <div
              className="absolute top-0 left-0 right-0 h-1 opacity-80 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: card.color }}
            />
            <div>
              <div className="flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.bgColor}`}
                >
                  <Icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 font-mono">
                  {card.badge}
                </span>
              </div>

              <div className="mt-3">
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
                  {card.value}
                </div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-0.5 truncate">
                  {card.label}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-1">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
};
