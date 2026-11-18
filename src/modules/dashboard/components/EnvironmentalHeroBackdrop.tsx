import React from 'react';

interface EnvironmentalHeroBackdropProps {
  className?: string;
}

export const EnvironmentalHeroBackdrop: React.FC<EnvironmentalHeroBackdropProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}>
      {/* 1. Base Natural Sky & Atmospheric Horizon Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#6497D8]/35 via-[#91C1ED]/25 to-[#F7F7F9] dark:from-[#131B2E]/90 dark:via-[#111726]/80 dark:to-[#0E1014]" />

      {/* 2. Panoramic Environmental Illustration (SVG Vector Layer) */}
      <svg
        className="absolute inset-0 w-full h-full object-cover dark:opacity-40 transition-opacity duration-300"
        viewBox="0 0 1600 700"
        preserveAspectRatio="xMidYMin slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Sky Gradient */}
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4A84CA" stopOpacity="0.45" />
            <stop offset="45%" stopColor="#87B9E8" stopOpacity="0.30" />
            <stop offset="85%" stopColor="#D5E8F8" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#F7F7F9" stopOpacity="1" />
          </linearGradient>

          {/* Golden Sunrise Glow in Valley */}
          <radialGradient id="sunGlow" cx="68%" cy="40%" r="45%">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.65" />
            <stop offset="35%" stopColor="#FBBF24" stopOpacity="0.25" />
            <stop offset="70%" stopColor="#FDE68A" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
          </radialGradient>

          {/* Distant Mountains Gradient (Soft Blue-Lavender) */}
          <linearGradient id="farMountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5B6B92" stopOpacity="0.40" />
            <stop offset="100%" stopColor="#A4B8D5" stopOpacity="0.15" />
          </linearGradient>

          {/* Mid Ridge Mountains (Rich Navy-Blue Ridge) */}
          <linearGradient id="midMountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3F537E" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#768CAE" stopOpacity="0.20" />
          </linearGradient>

          {/* River Basin Gradient (Serene Turquoise-Blue) */}
          <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#0284C7" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.25" />
          </linearGradient>

          {/* Green Valley Hills */}
          <linearGradient id="valleyHills" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#15803D" stopOpacity="0.45" />
          </linearGradient>

          {/* Government Building Silhouette Gradient */}
          <linearGradient id="buildingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Sky Fill */}
        <rect width="1600" height="700" fill="url(#skyGrad)" />

        {/* Sun in Mountains */}
        <circle cx="1080" cy="270" r="160" fill="url(#sunGlow)" />
        <circle cx="1080" cy="270" r="42" fill="#FEF08A" fillOpacity="0.85" />

        {/* Cumulus Clouds (Stylized, Editorial) */}
        <g fill="#FFFFFF" fillOpacity="0.45">
          <ellipse cx="280" cy="140" rx="140" ry="48" />
          <ellipse cx="360" cy="120" rx="90" ry="55" />
          <ellipse cx="220" cy="130" rx="80" ry="42" />

          <ellipse cx="880" cy="180" rx="190" ry="55" />
          <ellipse cx="980" cy="155" rx="110" ry="60" />
          <ellipse cx="790" cy="170" rx="100" ry="46" />

          <ellipse cx="1420" cy="130" rx="130" ry="42" />
          <ellipse cx="1340" cy="115" rx="80" ry="50" />
        </g>

        {/* Far Distant Layer Mountain Ridges */}
        <path
          d="M0,360 Q180,240 380,310 T780,260 T1180,310 T1600,280 L1600,700 L0,700 Z"
          fill="url(#farMountainGrad)"
        />

        {/* Mid Mountain Ridges */}
        <path
          d="M0,410 Q220,310 460,370 T920,330 T1360,360 T1600,340 L1600,700 L0,700 Z"
          fill="url(#midMountainGrad)"
        />

        {/* Rolling Green Hills (Frontiers & Foothills) */}
        <path
          d="M0,470 Q240,400 520,450 T1040,420 T1600,430 L1600,700 L0,700 Z"
          fill="url(#valleyHills)"
        />

        {/* River Basin meandering from valley on right side to center */}
        <path
          d="M960,430 C1080,440 1200,470 1260,520 C1320,570 1440,590 1600,600 L1600,680 C1400,670 1260,630 1180,570 C1100,510 980,490 920,470 Z"
          fill="url(#riverGrad)"
        />

        {/* Distant Bridge across River */}
        <g stroke="#94A3B8" strokeWidth="2.5" strokeOpacity="0.6">
          <line x1="1170" y1="465" x2="1240" y2="475" />
          <line x1="1185" y1="467" x2="1185" y2="480" />
          <line x1="1205" y1="470" x2="1205" y2="483" />
          <line x1="1225" y1="473" x2="1225" y2="486" />
        </g>

        {/* Modern Government Headquarters Complex Silhouette in Center */}
        <g transform="translate(680, 390)">
          {/* Central Main Building */}
          <rect x="0" y="30" width="160" height="90" rx="3" fill="url(#buildingGrad)" stroke="#CBD5E1" strokeWidth="1.5" />
          {/* Left Wing */}
          <rect x="-80" y="55" width="85" height="65" rx="2" fill="url(#buildingGrad)" stroke="#CBD5E1" strokeWidth="1.5" />
          {/* Right Wing */}
          <rect x="155" y="55" width="85" height="65" rx="2" fill="url(#buildingGrad)" stroke="#CBD5E1" strokeWidth="1.5" />
          {/* Glass Atrium Center Columns */}
          <rect x="50" y="30" width="60" height="90" fill="#38BDF8" fillOpacity="0.25" />
          <line x1="65" y1="30" x2="65" y2="120" stroke="#93C5FD" strokeWidth="1.5" />
          <line x1="80" y1="30" x2="80" y2="120" stroke="#93C5FD" strokeWidth="1.5" />
          <line x1="95" y1="30" x2="95" y2="120" stroke="#93C5FD" strokeWidth="1.5" />
          {/* Flagpole & Thai Flag */}
          <line x1="80" y1="0" x2="80" y2="30" stroke="#64748B" strokeWidth="2" />
          <polygon points="80,0 102,6 80,12" fill="#EF4444" />
          <polygon points="80,2 96,6 80,10" fill="#1E3A8A" />
          {/* Circular Roundabout Garden */}
          <ellipse cx="80" cy="135" rx="120" ry="24" fill="#22C55E" fillOpacity="0.3" stroke="#86EFAC" strokeWidth="1.5" />
          <ellipse cx="80" cy="135" rx="60" ry="12" fill="#E2E8F0" fillOpacity="0.7" />
        </g>

        {/* Left Side: Communication Mast & Antenna Tower */}
        <g transform="translate(130, 220)">
          {/* Lattice Mast */}
          <line x1="30" y1="0" x2="0" y2="280" stroke="#475569" strokeWidth="2" strokeOpacity="0.7" />
          <line x1="30" y1="0" x2="60" y2="280" stroke="#475569" strokeWidth="2" strokeOpacity="0.7" />
          <line x1="10" y1="70" x2="50" y2="70" stroke="#475569" strokeWidth="1.5" strokeOpacity="0.6" />
          <line x1="16" y1="140" x2="44" y2="140" stroke="#475569" strokeWidth="1.5" strokeOpacity="0.6" />
          <line x1="22" y1="210" x2="38" y2="210" stroke="#475569" strokeWidth="1.5" strokeOpacity="0.6" />
          {/* Bracing diagonals */}
          <line x1="10" y1="70" x2="44" y2="140" stroke="#64748B" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="50" y1="70" x2="16" y2="140" stroke="#64748B" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="16" y1="140" x2="38" y2="210" stroke="#64748B" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="44" y1="140" x2="22" y2="210" stroke="#64748B" strokeWidth="1" strokeOpacity="0.5" />
          {/* Flashing Top Beacon */}
          <circle cx="30" cy="0" r="4" fill="#EF4444" className="animate-pulse" />
          {/* Microwave Satellite Dish */}
          <ellipse cx="48" cy="85" rx="14" ry="14" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
          <line x1="48" y1="85" x2="62" y2="78" stroke="#334155" strokeWidth="1.5" />
        </g>

        {/* Right Skies: Distant Patrol Helicopter & Drone */}
        <g transform="translate(1320, 240)">
          {/* Drone */}
          <ellipse cx="0" cy="0" rx="14" ry="5" fill="#1E293B" fillOpacity="0.8" />
          <line x1="-20" y1="-3" x2="20" y2="-3" stroke="#0284C7" strokeWidth="1.5" />
          <circle cx="-16" cy="-3" r="3" fill="#38BDF8" />
          <circle cx="16" cy="-3" r="3" fill="#38BDF8" />
        </g>
        <g transform="translate(1440, 200)">
          {/* Distance Patrol Helicopter */}
          <ellipse cx="0" cy="0" rx="18" ry="7" fill="#334155" fillOpacity="0.75" />
          <line x1="-22" y1="-8" x2="22" y2="-8" stroke="#475569" strokeWidth="1.5" />
          <line x1="16" y1="0" x2="30" y2="-4" stroke="#475569" strokeWidth="1.5" />
          <line x1="28" y1="-7" x2="32" y2="-1" stroke="#475569" strokeWidth="1.2" />
        </g>

        {/* Forefront Lush Green Canopy Borders (Botanical Frame) */}
        <path
          d="M-50,0 Q60,100 0,260 Q-40,160 -50,0 Z"
          fill="#15803D"
          fillOpacity="0.3"
        />
        <path
          d="M0,0 Q120,40 220,0 Q140,80 0,0 Z"
          fill="#166534"
          fillOpacity="0.25"
        />
        <path
          d="M1420,0 Q1500,80 1650,20 Q1620,140 1480,0 Z"
          fill="#15803D"
          fillOpacity="0.2"
        />
      </svg>

      {/* 3. Editorial Atmospheric Light Overlays & Subtle Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#F7F7F9] via-[#F7F7F9]/85 to-transparent dark:from-[#0E1014] dark:via-[#0E1014]/85 h-full" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#F7F7F9]/70 via-transparent to-[#F7F7F9]/70 dark:from-[#0E1014]/80 dark:to-[#0E1014]/80" />

      {/* 4. Pearlescent Refraction Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#FEF08A]/15 dark:bg-[#FEF08A]/5 blur-3xl" />
      <div className="absolute top-10 left-1/3 w-80 h-80 rounded-full bg-[#EDE4F7]/25 dark:bg-[#8B6CCF]/10 blur-3xl" />
    </div>
  );
};
export default EnvironmentalHeroBackdrop;
