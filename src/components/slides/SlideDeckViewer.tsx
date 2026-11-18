import React, { useState, useEffect, useRef } from 'react';
import { SlideDeck, SlideItem, SlideThemeId } from '../../types/slides';
import { SLIDE_THEMES } from '../../data/slideThemesData';
import { SlideRenderer } from './SlideRenderer';
import { SlideEditorModal } from './SlideEditorModal';
import { exportDeckToPptx } from '../../utils/pptxExport';
import { exportDeckToHtml } from '../../utils/htmlPresentationExport';
import { useAdmin } from '../../contexts/AdminContext';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FileDown,
  Printer,
  Edit3,
  Plus,
  Palette,
  Sparkles,
  MessageSquareText,
  Copy,
  Check,
  Share2,
} from 'lucide-react';

interface SlideDeckViewerProps {
  deck: SlideDeck;
  onUpdateDeck: (updatedDeck: SlideDeck) => void;
  onRegenerateRequest?: () => void;
}

export const SlideDeckViewer: React.FC<SlideDeckViewerProps> = ({
  deck,
  onUpdateDeck,
  onRegenerateRequest,
}) => {
  const { showToast } = useAdmin();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isExportingPptx, setIsExportingPptx] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [isEditingSlide, setIsEditingSlide] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const presentationContainerRef = useRef<HTMLDivElement>(null);

  const currentSlide = deck.slides[currentSlideIndex] || deck.slides[0];

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditingSlide) return; // Ignore while modal is open

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, deck.slides.length, isFullscreen, isEditingSlide]);

  const nextSlide = () => {
    if (currentSlideIndex < deck.slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      presentationContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Export to PPTX
  const handleDownloadPptx = async () => {
    try {
      setIsExportingPptx(true);
      await exportDeckToPptx(deck);
      showToast('ส่งออกไฟล์ PowerPoint (.pptx) สำเร็จ');
    } catch {
      showToast('เกิดข้อผิดพลาดในการสร้างไฟล์ PowerPoint กรุณาลองใหม่อีกครั้ง', 'error');
    } finally {
      setIsExportingPptx(false);
    }
  };

  // Change Theme
  const handleChangeTheme = (newTheme: SlideThemeId) => {
    onUpdateDeck({
      ...deck,
      theme: newTheme,
      updatedAt: new Date().toISOString(),
    });
  };

  // Save edited slide
  const handleSaveSlide = (updatedSlide: SlideItem) => {
    const newSlides = [...deck.slides];
    newSlides[currentSlideIndex] = updatedSlide;
    onUpdateDeck({
      ...deck,
      slides: newSlides,
      updatedAt: new Date().toISOString(),
    });
  };

  // Delete current slide
  const handleDeleteSlide = (slideId: string) => {
    if (deck.slides.length <= 1) {
      showToast('ไม่สามารถลบสไลด์สุดท้ายได้', 'info');
      return;
    }
    const newSlides = deck.slides.filter(s => s.id !== slideId);
    onUpdateDeck({
      ...deck,
      slides: newSlides,
      updatedAt: new Date().toISOString(),
    });
    if (currentSlideIndex >= newSlides.length) {
      setCurrentSlideIndex(newSlides.length - 1);
    }
  };

  // Add new blank slide
  const handleAddSlide = () => {
    const newSlide: SlideItem = {
      id: `slide-${Date.now()}`,
      layout: 'split-image',
      badge: 'ประเด็นเพิ่มเติม',
      title: 'หัวข้อสไลด์ใหม่',
      subtitle: 'คำอธิบายสรุปสาระสำคัญ',
      bullets: [
        {
          title: 'ประเด็นที่ ๑',
          description: 'รายละเอียดข้อมูลและการวิเคราะห์',
        },
        {
          title: 'ประเด็นที่ ๒',
          description: 'ข้อเสนอแนะและขั้นตอนการปฏิบัติงาน',
        },
      ],
      speakerNotes: 'บันทึกช่วยจำสำหรับสไลด์นี้',
      imageIndex: deck.images.length > 0 ? 0 : null,
    };

    const newSlides = [...deck.slides];
    newSlides.splice(currentSlideIndex + 1, 0, newSlide);
    onUpdateDeck({
      ...deck,
      slides: newSlides,
      updatedAt: new Date().toISOString(),
    });
    setCurrentSlideIndex(currentSlideIndex + 1);
  };

  // Copy outline text
  const handleCopyOutline = () => {
    const outline = deck.slides
      .map((s, idx) => {
        let text = `[สไลด์ ${idx + 1}] ${s.title}\n`;
        if (s.subtitle) text += `  ${s.subtitle}\n`;
        s.bullets?.forEach(b => {
          text += `  • ${b.title}: ${b.description}\n`;
        });
        return text;
      })
      .join('\n');

    navigator.clipboard.writeText(outline);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Export Bar */}
      <div className="bg-white dark:bg-[#151821] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Deck Title & Stats */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#27265B]/10 dark:bg-indigo-950/60 text-[#27265B] dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40">
              สไลด์ AI สำเร็จแล้ว
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {deck.slides.length} สไลด์ • รูปภาพ {deck.images.length} รูป
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">
            {deck.deckTitle}
          </h2>
        </div>

        {/* Right: Theme Selector & Instant Download Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Theme Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
            <Palette className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 ml-1.5 mr-0.5" />
            {(['navy', 'emerald', 'indigo', 'crimson', 'slate'] as SlideThemeId[]).map(t => {
              const cfg = SLIDE_THEMES[t];
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleChangeTheme(t)}
                  className={`w-6 h-6 rounded-lg transition-transform ${
                    deck.theme === t
                      ? 'ring-2 ring-offset-1 ring-slate-800 dark:ring-white scale-110'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: cfg.primary }}
                  title={`เปลี่ยนเป็นธีม ${cfg.name}`}
                />
              );
            })}
          </div>

          {/* HTML Standalone Download */}
          <button
            type="button"
            onClick={() => exportDeckToHtml(deck)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 transition inline-flex items-center gap-1.5 cursor-pointer"
            title="ดาวน์โหลดไฟล์เว็บสไลด์เปิดได้ทุกที่โดยไม่ต้องต่อเน็ต"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            <span>เว็บสไลด์ (.html)</span>
          </button>

          {/* Print / Save as PDF */}
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 transition inline-flex items-center gap-1.5 cursor-pointer"
            title="สั่งพิมพ์สไลด์หรือบันทึกเป็น PDF ทางการ"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            <span>พิมพ์ / PDF</span>
          </button>

          {/* Download PowerPoint (.pptx) - Main Primary Button */}
          <button
            type="button"
            onClick={handleDownloadPptx}
            disabled={isExportingPptx}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#27265B] hover:bg-[#1C1A45] transition inline-flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
            title="ดาวน์โหลดไฟล์ Microsoft PowerPoint (.pptx) นำไปเปิดแก้ไขได้ทันที"
          >
            <FileDown className="w-4 h-4 text-amber-400" />
            <span>
              {isExportingPptx ? 'กำลังสร้าง PowerPoint...' : 'โหลด PowerPoint (.pptx)'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Presentation Stage */}
      <div
        ref={presentationContainerRef}
        className={`relative flex flex-col items-center ${
          isFullscreen
            ? 'bg-slate-950 p-6 sm:p-10 justify-center h-screen'
            : 'bg-slate-900/90 p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl'
        }`}
      >
        {/* Floating Controls Bar */}
        <div className="w-full max-w-5xl flex items-center justify-between text-slate-300 pb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">
              สไลด์ {currentSlideIndex + 1} / {deck.slides.length}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 truncate max-w-[200px] sm:max-w-xs">
              {currentSlide?.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowNotes(!showNotes)}
              className={`px-2.5 py-1 rounded-lg transition inline-flex items-center gap-1 text-xs ${
                showNotes
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                  : 'bg-white/10 hover:bg-white/20 text-slate-300'
              }`}
              title="เปิด/ปิด บันทึกช่วยจำสำหรับผู้นำเสนอ"
            >
              <MessageSquareText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">โน้ตผู้บรรยาย</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEditingSlide(true)}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition inline-flex items-center gap-1 text-xs"
              title="แก้ไขข้อความ รูปภาพ หรือเลย์เอาต์สไลด์นี้"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">แก้ไขสไลด์นี้</span>
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition"
              title="โหมดเต็มหน้าจอ (กด F)"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Stage Wrapper */}
        <div className="relative w-full max-w-5xl group flex items-center justify-center">
          {/* Previous Button */}
          <button
            type="button"
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-white/20 shadow-xl flex items-center justify-center transition disabled:opacity-20 disabled:pointer-events-none"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Current Slide Display */}
          {currentSlide && (
            <SlideRenderer
              slide={currentSlide}
              deck={deck}
              slideIndex={currentSlideIndex}
              totalSlides={deck.slides.length}
            />
          )}

          {/* Next Button */}
          <button
            type="button"
            onClick={nextSlide}
            disabled={currentSlideIndex === deck.slides.length - 1}
            className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-white/20 shadow-xl flex items-center justify-center transition disabled:opacity-20 disabled:pointer-events-none"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Speaker Notes Drawer */}
        {showNotes && currentSlide?.speakerNotes && (
          <div className="w-full max-w-5xl mt-3 p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-200">
            <span className="font-bold text-amber-400 block mb-1">
              บทพูดสำหรับผู้นำเสนอ (Speaker Notes):
            </span>
            <p className="leading-relaxed">
              {currentSlide.speakerNotes}
            </p>
          </div>
        )}
      </div>

      {/* Slide Thumbnails Strip & Controls */}
      <div className="bg-white dark:bg-[#151821] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
              แผงลำดับสไลด์ทั้งหมด ({deck.slides.length})
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              (คลิกเพื่อสลับไปยังสไลด์ที่ต้องการ)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyOutline}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              {copiedNotification ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-300">คัดลอกโครงร่างแล้ว</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>คัดลอกโครงร่างสไลด์</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleAddSlide}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#27265B]/10 dark:bg-[#27265B]/40 hover:bg-[#27265B]/20 dark:hover:bg-[#27265B]/60 text-[#27265B] dark:text-indigo-300 transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>เพิ่มสไลด์</span>
            </button>
          </div>
        </div>

        {/* Thumbnail Carousel */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          {deck.slides.map((s, idx) => {
            const isSelected = idx === currentSlideIndex;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlideIndex(idx)}
                className={`flex-shrink-0 w-36 sm:w-44 rounded-xl border-2 transition-all text-left p-1.5 flex flex-col gap-1 cursor-pointer ${
                  isSelected
                    ? 'border-[#27265B] dark:border-indigo-400 ring-2 ring-[#27265B]/30 dark:ring-indigo-400/30 shadow-md bg-[#27265B]/5 dark:bg-[#27265B]/20'
                    : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-slate-50 dark:bg-white/5'
                }`}
              >
                <div className="w-full aspect-video rounded-lg overflow-hidden relative">
                  <SlideRenderer
                    slide={s}
                    deck={deck}
                    slideIndex={idx}
                    totalSlides={deck.slides.length}
                    isThumbnail={true}
                  />
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1 rounded">
                    #{idx + 1}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate px-0.5">
                  {s.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slide Editor Modal */}
      <SlideEditorModal
        isOpen={isEditingSlide}
        slide={currentSlide}
        deck={deck}
        onClose={() => setIsEditingSlide(false)}
        onSave={handleSaveSlide}
        onDelete={handleDeleteSlide}
      />
    </div>
  );
};
