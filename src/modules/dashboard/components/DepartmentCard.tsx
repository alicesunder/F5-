import React from 'react';
import { DepartmentConfig, DepartmentId } from '../../../types';
import {
  Settings,
  Megaphone,
  Shield,
  Users,
  ArrowRight,
  TrendingUp,
  Lock,
  Hammer,
} from 'lucide-react';

interface DepartmentCardProps {
  department: DepartmentConfig;
  onSelect: (dept: DepartmentConfig) => void;
  hasAccess?: boolean;
  count?: number;
  trend?: string;
  sparkline?: number[];
}

/** Darken/lighten a #rrggbb color by a -100..100 percentage. */
const shade = (hex: string, percent: number) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.min(255, Math.max(0, (num >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

/**
 * Each department gets its own hand-drawn motif rooted in what that division
 * actually does, instead of a generic decorative pattern reused with a new
 * fill color. Every motif is deterministic (no randomness) and sits low in
 * the card's corner so it never competes with the number and trend.
 */
const DeptMotif: React.FC<{ id: DepartmentId }> = ({ id }) => {
  const common = { className: 'absolute right-0 bottom-0 pointer-events-none', style: { opacity: 0.9 } };

  if (id === 'admin') {
    // Administration & Operations: a fanned stack of paper/ledger sheets,
    // each with a ruled line, echoing document processing and filing.
    return (
      <svg {...common} width="130" height="130" viewBox="0 0 130 130" fill="none">
        <g transform="translate(38 8) rotate(-9 46 50)">
          <rect x="0" y="0" width="92" height="100" rx="10" fill="#fff" fillOpacity="0.14" />
        </g>
        <g transform="translate(46 18) rotate(4 46 50)">
          <rect x="0" y="0" width="92" height="100" rx="10" fill="#fff" fillOpacity="0.18" />
        </g>
        <g transform="translate(52 26)">
          <rect x="0" y="0" width="92" height="100" rx="10" fill="#fff" fillOpacity="0.95" />
          <rect x="14" y="20" width="64" height="5" rx="2.5" fill="currentColor" />
          <rect x="14" y="34" width="64" height="5" rx="2.5" fill="currentColor" opacity="0.55" />
          <rect x="14" y="48" width="40" height="5" rx="2.5" fill="currentColor" opacity="0.55" />
          <circle cx="66" cy="74" r="14" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.4" />
          <path d="M60 74l4 4 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
        </g>
      </svg>
    );
  }

  if (id === 'relations') {
    // Public Relations & Communications: a broadcast source sending
    // concentric signal arcs outward, standing in for reach and outreach.
    return (
      <svg {...common} width="130" height="130" viewBox="0 0 130 130" fill="none">
        <circle cx="30" cy="96" r="52" stroke="#fff" strokeOpacity="0.16" strokeWidth="10" />
        <circle cx="30" cy="96" r="34" stroke="#fff" strokeOpacity="0.22" strokeWidth="9" />
        <circle cx="30" cy="96" r="17" stroke="#fff" strokeOpacity="0.3" strokeWidth="8" />
        <circle cx="30" cy="96" r="7" fill="#fff" />
        <circle cx="88" cy="34" r="5" fill="#fff" fillOpacity="0.85" />
        <circle cx="104" cy="52" r="3.5" fill="#fff" fillOpacity="0.6" />
        <circle cx="72" cy="20" r="3" fill="#fff" fillOpacity="0.5" />
      </svg>
    );
  }

  if (id === 'disaster') {
    // Disaster Surveillance: a radar/sonar sweep with fixed contact blips,
    // reflecting continuous situational monitoring.
    return (
      <svg {...common} width="140" height="130" viewBox="0 0 140 130" fill="none">
        <circle cx="94" cy="68" r="46" stroke="#fff" strokeOpacity="0.16" strokeWidth="2" />
        <circle cx="94" cy="68" r="30" stroke="#fff" strokeOpacity="0.2" strokeWidth="2" />
        <circle cx="94" cy="68" r="14" stroke="#fff" strokeOpacity="0.26" strokeWidth="2" />
        <path d="M94 68 L94 22 A46 46 0 0 1 132 86 Z" fill="#fff" fillOpacity="0.14" />
        <line x1="94" y1="22" x2="94" y2="114" stroke="#fff" strokeOpacity="0.14" />
        <line x1="48" y1="68" x2="140" y2="68" stroke="#fff" strokeOpacity="0.14" />
        <circle cx="108" cy="50" r="3.5" fill="#fff" />
        <circle cx="80" cy="80" r="2.5" fill="#fff" fillOpacity="0.7" />
        <circle cx="112" cy="84" r="2.5" fill="#fff" fillOpacity="0.7" />
      </svg>
    );
  }

  // Volunteer & Community Services: overlapping figures forming a small
  // gathered circle, with a heart at the centre.
  return (
    <svg {...common} width="130" height="130" viewBox="0 0 130 130" fill="none">
      {[
        [40, 98],
        [70, 84],
        [96, 98],
        [55, 114],
        [85, 114],
      ].map(([cx, cy], i) => (
        <g key={i} opacity={0.85 - i * 0.08}>
          <circle cx={cx} cy={cy - 16} r="8" fill="#fff" />
          <path d={`M${cx - 13} ${cy + 10} a13 13 0 0 1 26 0 Z`} fill="#fff" />
        </g>
      ))}
      <path
        d="M70 46c-4-6-13-6-16 1-3 8 6 16 16 22 10-6 19-14 16-22-3-7-12-7-16-1z"
        fill="#fff"
        opacity="0.95"
      />
    </svg>
  );
};

const DEPT_META: Record<
  DepartmentId,
  { icon: React.ElementType; label: string; sparkline: number[] }
> = {
  admin: { icon: Settings, label: 'งานอำนวยการ', sparkline: [20, 35, 50, 40, 75, 90] },
  relations: { icon: Megaphone, label: 'งานประชาสัมพันธ์', sparkline: [15, 25, 40, 55, 65, 80] },
  disaster: { icon: Shield, label: 'เหตุการณ์เฝ้าระวัง', sparkline: [30, 20, 45, 35, 50, 70] },
  volunteer: { icon: Users, label: 'กิจกรรมจิตอาสา', sparkline: [10, 20, 30, 40, 60, 100] },
};

const FALLBACK_COUNT: Record<DepartmentId, { count: number; trend: string }> = {
  admin: { count: 24, trend: '+12%' },
  relations: { count: 12, trend: '+8%' },
  disaster: { count: 8, trend: '+5%' },
  volunteer: { count: 4, trend: '+20%' },
};

export const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  onSelect,
  hasAccess = true,
  count,
  trend,
  sparkline,
}) => {
  const { id, name, primaryColor, isAvailable, status } = department;
  const meta = DEPT_META[id] ?? DEPT_META.admin;
  const fallback = FALLBACK_COUNT[id] ?? FALLBACK_COUNT.admin;
  const IconComponent = meta.icon;
  const bars = sparkline ?? meta.sparkline;
  const displayCount = count ?? fallback.count;
  const displayTrend = trend ?? fallback.trend;
  const clickable = isAvailable !== false && hasAccess;

  return (
    <div
      onClick={() => clickable && onSelect(department)}
      role="button"
      aria-disabled={!clickable}
      className={`dept-card group relative rounded-[20px] text-white h-[168px] select-none overflow-hidden transition-all duration-300 ${
        clickable ? 'cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-0.5' : 'cursor-not-allowed'
      }`}
      style={{
        background: `linear-gradient(150deg, ${shade(primaryColor, 12)} 0%, ${primaryColor} 45%, ${shade(
          primaryColor,
          -16
        )} 100%)`,
        color: primaryColor,
      }}
    >
      {/* Department-specific motif, unique per division, not just recolored */}
      <div className="absolute inset-0 text-white">
        <DeptMotif id={id} />
      </div>

      {!clickable && <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-[1px]" />}

      <div className="relative p-5 flex flex-col justify-between h-full">
        {/* Top row: icon badge + name + status/arrow */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-xs flex-shrink-0">
              <IconComponent className="w-5 h-5" style={{ color: primaryColor }} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white tracking-tight leading-tight truncate">{name}</h3>
              <p className="text-[10px] text-white/80 font-light mt-0.5">{meta.label}</p>
            </div>
          </div>

          {clickable ? (
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-2xs flex-shrink-0 transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="w-3.5 h-3.5" style={{ color: primaryColor }} />
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold flex-shrink-0">
              {hasAccess ? <Hammer className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              {hasAccess ? status : 'ไม่มีสิทธิ์เข้าถึง'}
            </div>
          )}
        </div>

        {/* Bottom row: count, trend, sparkline */}
        <div className="flex items-end justify-between gap-2 pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white tracking-tight">{displayCount}</span>
            <span className="text-[11px] font-semibold text-white/95 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>{displayTrend}</span>
            </span>
          </div>

          <div className="flex items-end gap-1 h-7 pb-0.5">
            {bars.map((val, idx) => (
              <div
                key={idx}
                className="w-1.5 rounded-full bg-white/40 transition-all duration-300 group-hover:bg-white/90"
                style={{ height: `${val}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
