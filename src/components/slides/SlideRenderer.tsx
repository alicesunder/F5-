import React from 'react';
import { SlideDeck, SlideItem } from '../../types/slides';
import { SLIDE_THEMES } from '../../data/slideThemesData';
import {
  Shield,
  Target,
  Users,
  CheckCircle2,
  TrendingUp,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
} from 'lucide-react';

interface SlideRendererProps {
  slide: SlideItem;
  deck: SlideDeck;
  slideIndex: number;
  totalSlides: number;
  className?: string;
  isThumbnail?: boolean;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({
  slide,
  deck,
  slideIndex,
  totalSlides,
  className = '',
  isThumbnail = false,
}) => {
  const theme = SLIDE_THEMES[deck.theme] || SLIDE_THEMES.navy;

  // Resolve image if specified
  let imageUrl: string | null = null;
  if (slide.customImageUrl) {
    imageUrl = slide.customImageUrl;
  } else if (
    slide.imageIndex !== null &&
    slide.imageIndex !== undefined &&
    deck.images &&
    deck.images[slide.imageIndex]
  ) {
    imageUrl = deck.images[slide.imageIndex].dataUrl;
  }

  // Icons map
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'target':
        return <Target className="w-4 h-4" />;
      case 'users':
        return <Users className="w-4 h-4" />;
      case 'check':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'clock':
        return <Clock className="w-4 h-4" />;
      case 'award':
        return <Award className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  // COVER / TITLE SLIDE
  if (slide.layout === 'title') {
    return (
      <div
        className={`w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl relative select-none flex flex-col justify-between text-white p-6 sm:p-10 md:p-14 ${theme.coverBg} ${className}`}
      >
        {/* Top Accent Line */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5 sm:h-2"
          style={{ backgroundColor: theme.accent }}
        />

        {/* Top Header & Badge */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide uppercase border border-white/20 bg-white/10 backdrop-blur-xs">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: theme.accent }}
            />
            <span style={{ color: theme.accent }}>
              {slide.badge || deck.department || 'ฝ่ายอำนวยการ ๕ บช.ตชด.'}
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight drop-shadow-xs max-w-4xl">
            {slide.title || deck.deckTitle}
          </h1>

          {(slide.subtitle || deck.deckSubtitle) && (
            <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed pt-1">
              {slide.subtitle || deck.deckSubtitle}
            </p>
          )}
        </div>

        {/* Optional Cover Image */}
        {imageUrl && !isThumbnail && (
          <div className="absolute right-6 sm:right-12 bottom-20 w-32 sm:w-48 md:w-60 aspect-video rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 bg-black/40 backdrop-blur-xs">
            <img
              src={imageUrl}
              alt="Slide visual"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Cover Footer / Metadata */}
        <div className="border-t border-white/15 pt-3 sm:pt-4 flex items-center justify-between text-[10px] sm:text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
            <span>
              <strong className="text-slate-200">ผู้นำเสนอ:</strong>{' '}
              {deck.presenter || 'เจ้าหน้าที่ฝ่ายอำนวยการ'}
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span>
              <strong className="text-slate-200">หน่วยงาน:</strong>{' '}
              {deck.department || 'ฝอ.๕ บก.อก.บช.ตชด.'}
            </span>
          </div>
          <div className="text-right">
            <span>{deck.date || 'พุทธศักราช ๒๕๖๙'}</span>
          </div>
        </div>
      </div>
    );
  }

  // CONTENT SLIDES (Split, Cards, Stats, Bullets, Timeline, Conclusion)
  return (
    <div
      className={`w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl relative select-none flex flex-col bg-white border border-slate-200/80 text-slate-900 ${className}`}
    >
      {/* Slide Top Banner */}
      <div
        className="px-5 sm:px-8 py-3 sm:py-4 flex items-center justify-between text-white border-b-2"
        style={{
          backgroundColor: theme.primary,
          borderBottomColor: theme.accent,
        }}
      >
        <div className="min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-[9px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                color: theme.accent,
              }}
            >
              {slide.badge || 'สรุปผลการปฏิบัติราชการ'}
            </span>
          </div>
          <h2 className="text-sm sm:text-lg md:text-xl font-bold text-white truncate leading-snug">
            {slide.title}
          </h2>
        </div>

        <div className="flex-shrink-0 text-right">
          <span className="text-[10px] sm:text-xs text-slate-300 font-mono">
            {slideIndex + 1} / {totalSlides}
          </span>
        </div>
      </div>

      {/* Slide Main Content Area */}
      <div className={`flex-1 p-4 sm:p-7 md:p-8 overflow-hidden flex flex-col justify-between ${theme.contentBg}`}>
        {/* Subtitle / Key statement */}
        {slide.subtitle && (
          <div className="text-xs sm:text-sm font-semibold text-slate-700 pb-2">
            {slide.subtitle}
          </div>
        )}

        {/* Layout 1: Split Image (2-Column) */}
        {slide.layout === 'split-image' && (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center min-h-0">
            {/* Left Column: Bullets */}
            <div className={`${imageUrl ? 'md:col-span-7' : 'md:col-span-12'} space-y-2.5 sm:space-y-3.5`}>
              {slide.bullets?.map((b, bIdx) => (
                <div key={bIdx} className="flex items-start gap-2.5 sm:gap-3 bg-white/80 p-2.5 sm:p-3 rounded-xl border border-slate-200/60 shadow-xs">
                  <div
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-2xs mt-0.5"
                    style={{ backgroundColor: theme.primary }}
                  >
                    {getIcon(b.icon)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                      {b.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed mt-0.5">
                      {b.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Image */}
            {imageUrl && (
              <div className="md:col-span-5 h-full max-h-52 sm:max-h-64 rounded-xl overflow-hidden shadow-md border border-slate-200 relative group bg-slate-100 flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt="Slide Visual"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
          </div>
        )}

        {/* Layout 2: Cards Grid */}
        {slide.layout === 'cards' && (
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-stretch min-h-0">
            {slide.bullets?.map((c, cIdx) => (
              <div
                key={cIdx}
                className="bg-white rounded-xl border border-slate-200/80 p-3 sm:p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: theme.accent }}
                />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: theme.primary }}
                    >
                      {cIdx + 1}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {c.title}
                    </h4>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                    {c.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Layout 3: Stats & Metrics */}
        {slide.layout === 'stats' && (
          <div className="flex-1 flex flex-col justify-center space-y-4 min-h-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
              {slide.stats?.map((s, sIdx) => (
                <div
                  key={sIdx}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 text-center shadow-xs flex flex-col items-center justify-center hover:shadow-md transition-shadow"
                >
                  <span
                    className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-none mb-2"
                    style={{ color: theme.primary }}
                  >
                    {s.value}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-700">
                    {s.label}
                  </span>
                  {s.change && (
                    <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <TrendingUp className="w-3 h-3" />
                      {s.change}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {slide.highlightText && (
              <div
                className="p-3 sm:p-3.5 rounded-xl border flex items-center gap-3 bg-white shadow-2xs"
                style={{ borderColor: theme.accent }}
              >
                <Sparkles
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  style={{ color: theme.accent }}
                />
                <span className="text-xs sm:text-sm text-slate-800 font-medium">
                  <strong>ข้อพิจารณาสำคัญ:</strong> {slide.highlightText}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Layout 4: Bullets / Timeline / Conclusion */}
        {(slide.layout === 'bullets' ||
          slide.layout === 'timeline' ||
          slide.layout === 'conclusion') && (
          <div className="flex-1 flex flex-col justify-center space-y-2.5 sm:space-y-3 min-h-0">
            {slide.bullets?.map((b, bIdx) => (
              <div
                key={bIdx}
                className="bg-white rounded-xl border border-slate-200/80 p-3 sm:p-4 shadow-xs flex items-start gap-3 hover:border-slate-300 transition-colors"
              >
                <div
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5 text-[10px] sm:text-xs font-bold shadow-2xs"
                  style={{ backgroundColor: theme.primary }}
                >
                  {bIdx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {b.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed mt-0.5">
                    {b.description}
                  </p>
                </div>
              </div>
            ))}

            {imageUrl && !isThumbnail && (
              <div className="h-28 sm:h-32 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                <img
                  src={imageUrl}
                  alt="Slide Attached"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        )}

        {/* Slide Footer */}
        <div className="border-t border-slate-200/60 pt-2 sm:pt-3 flex items-center justify-between text-[10px] sm:text-xs text-slate-500">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-slate-700">
              {deck.department || 'ฝ่ายอำนวยการ ๕ บช.ตชด.'}
            </span>
            <span>•</span>
            <span className="truncate">{deck.deckTitle}</span>
          </div>
          <div className="font-mono text-slate-400">
            สไลด์ {slideIndex + 1}
          </div>
        </div>
      </div>
    </div>
  );
};
