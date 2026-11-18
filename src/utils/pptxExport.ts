import pptxgen from 'pptxgenjs';
import { SlideDeck } from '../types/slides';
import { SLIDE_THEMES } from '../data/slideThemesData';

/**
 * Generates and triggers download of a high-quality Microsoft PowerPoint (.pptx) file.
 * Supports embedded images (base64 dataUrl), theme colors, custom layout templates,
 * bullet hierarchy, stats cards, and speaker notes.
 */
export async function exportDeckToPptx(deck: SlideDeck): Promise<void> {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9'; // 10" x 5.625" (or 13.33" x 7.5")
  pptx.author = deck.presenter || 'ฝ่ายอำนวยการ ๕ บช.ตชด.';
  pptx.company = deck.department || 'กองบัญชาการตำรวจตระเวนชายแดน';
  pptx.title = deck.deckTitle || 'สไลด์นำเสนอ AI';
  pptx.subject = deck.deckSubtitle || 'เอกสารการนำเสนอระบบ FO5 Smart Ops';

  const theme = SLIDE_THEMES[deck.theme] || SLIDE_THEMES.navy;
  const colors = theme.pptxColors;

  // Iterate over each slide
  for (let i = 0; i < deck.slides.length; i++) {
    const item = deck.slides[i];
    const slide = pptx.addSlide();

    // Speaker notes
    if (item.speakerNotes) {
      slide.addNotes(item.speakerNotes);
    }

    // Resolve image if assigned
    let imageObj = null;
    if (item.customImageUrl) {
      imageObj = item.customImageUrl;
    } else if (item.imageIndex !== null && item.imageIndex !== undefined && deck.images[item.imageIndex]) {
      imageObj = deck.images[item.imageIndex].dataUrl;
    }

    if (item.layout === 'title') {
      // ===== COVER / TITLE SLIDE =====
      slide.background = { color: colors.primary };

      // Top decorative accent bar
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 13.33,
        h: 0.2,
        fill: { color: colors.accent },
      });

      // Left or Top badge
      slide.addText((item.badge || 'ฝ่ายอำนวยการ ๕ บช.ตชด.').toUpperCase(), {
        x: 1.0,
        y: 1.2,
        w: 11.33,
        h: 0.5,
        fontSize: 13,
        fontFace: 'Arial',
        color: colors.accent,
        bold: true,
      });

      // Main Deck Title
      slide.addText(item.title || deck.deckTitle, {
        x: 1.0,
        y: 1.8,
        w: imageObj ? 7.5 : 11.33,
        h: 2.2,
        fontSize: 34,
        fontFace: 'Arial',
        color: colors.textLight,
        bold: true,
        valign: 'top',
      });

      // Subtitle
      if (item.subtitle || deck.deckSubtitle) {
        slide.addText(item.subtitle || deck.deckSubtitle, {
          x: 1.0,
          y: 4.1,
          w: imageObj ? 7.5 : 11.33,
          h: 1.2,
          fontSize: 16,
          fontFace: 'Arial',
          color: 'E2E8F0',
          valign: 'top',
        });
      }

      // Metadata footer
      const metaText = `ผู้นำเสนอ: ${deck.presenter || 'เจ้าหน้าที่ฝ่ายอำนวยการ'}  |  หน่วยงาน: ${deck.department || 'ฝอ.๕ บก.อก.บช.ตชด.'}  |  วันที่: ${deck.date || 'พุทธศักราช ๒๕๖๙'}`;
      slide.addText(metaText, {
        x: 1.0,
        y: 6.5,
        w: 11.33,
        h: 0.5,
        fontSize: 11,
        fontFace: 'Arial',
        color: '94A3B8',
      });

      // Embedded Image on Cover
      if (imageObj) {
        slide.addImage({
          data: imageObj,
          x: 8.8,
          y: 1.8,
          w: 3.6,
          h: 3.6,
          rounding: true,
        });
      }
    } else {
      // ===== CONTENT SLIDES =====
      slide.background = { color: colors.slideBg };

      // Top Header Banner
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 13.33,
        h: 1.1,
        fill: { color: colors.primary },
      });

      // Category badge & Slide Title
      slide.addText(item.badge || 'สรุปประเด็นสำคัญ', {
        x: 0.8,
        y: 0.15,
        w: 8.0,
        h: 0.3,
        fontSize: 10,
        fontFace: 'Arial',
        color: colors.accent,
        bold: true,
      });

      slide.addText(item.title, {
        x: 0.8,
        y: 0.45,
        w: 11.5,
        h: 0.55,
        fontSize: 20,
        fontFace: 'Arial',
        color: colors.textLight,
        bold: true,
        valign: 'middle',
      });

      // Slide Footer (Department & Page number)
      slide.addText(deck.department || 'ฝ่ายอำนวยการ ๕ บช.ตชด.', {
        x: 0.8,
        y: 7.0,
        w: 8.0,
        h: 0.35,
        fontSize: 10,
        fontFace: 'Arial',
        color: '94A3B8',
      });

      slide.addText(`${i + 1} / ${deck.slides.length}`, {
        x: 11.5,
        y: 7.0,
        w: 1.0,
        h: 0.35,
        fontSize: 10,
        fontFace: 'Arial',
        color: '94A3B8',
        align: 'right',
      });

      // Layout Specific Elements
      if (item.layout === 'split-image') {
        // Left Column (Text & Bullets)
        const leftW = imageObj ? 6.8 : 11.5;

        if (item.subtitle) {
          slide.addText(item.subtitle, {
            x: 0.8,
            y: 1.35,
            w: leftW,
            h: 0.6,
            fontSize: 14,
            fontFace: 'Arial',
            color: colors.textDark,
            bold: true,
          });
        }

        if (item.bullets && item.bullets.length > 0) {
          const bulletStartY = item.subtitle ? 2.0 : 1.5;
          const bulletTexts = item.bullets.map(b => [
            { text: `${b.title}: `, options: { bold: true, color: colors.primary, fontSize: 13 } },
            { text: `${b.description}\n`, options: { bold: false, color: '334155', fontSize: 12 } },
          ]);

          slide.addText(bulletTexts.flat(), {
            x: 0.8,
            y: bulletStartY,
            w: leftW,
            h: 4.6,
            bullet: { type: 'bullet', code: '25AA' },
            valign: 'top',
          });
        }

        // Right Column (Image)
        if (imageObj) {
          slide.addImage({
            data: imageObj,
            x: 8.0,
            y: 1.5,
            w: 4.5,
            h: 4.8,
            rounding: true,
          });
        }
      } else if (item.layout === 'cards') {
        // 3-Card Grid Layout
        if (item.subtitle) {
          slide.addText(item.subtitle, {
            x: 0.8,
            y: 1.3,
            w: 11.7,
            h: 0.5,
            fontSize: 13,
            fontFace: 'Arial',
            color: '64748B',
          });
        }

        const cards = item.bullets || [];
        const cardCount = Math.min(cards.length, 3) || 1;
        const cardW = (11.7 - (cardCount - 1) * 0.4) / cardCount;

        cards.slice(0, 3).forEach((card, cIdx) => {
          const cX = 0.8 + cIdx * (cardW + 0.4);
          const cY = item.subtitle ? 1.9 : 1.6;

          // Card Background
          slide.addShape(pptx.ShapeType.roundRect, {
            x: cX,
            y: cY,
            w: cardW,
            h: 4.8,
            fill: { color: colors.cardBg },
            line: { color: 'E2E8F0', width: 1 },
            rectRadius: 0.15,
          });

          // Card Header accent line
          slide.addShape(pptx.ShapeType.rect, {
            x: cX + 0.2,
            y: cY + 0.2,
            w: 0.8,
            h: 0.08,
            fill: { color: colors.accent },
          });

          // Card Title
          slide.addText(card.title, {
            x: cX + 0.3,
            y: cY + 0.5,
            w: cardW - 0.6,
            h: 0.8,
            fontSize: 15,
            fontFace: 'Arial',
            color: colors.primary,
            bold: true,
            valign: 'top',
          });

          // Card Description
          slide.addText(card.description, {
            x: cX + 0.3,
            y: cY + 1.4,
            w: cardW - 0.6,
            h: 3.1,
            fontSize: 12,
            fontFace: 'Arial',
            color: '475569',
            valign: 'top',
          });
        });
      } else if (item.layout === 'stats') {
        // High-impact Metric / Stats Layout
        if (item.subtitle) {
          slide.addText(item.subtitle, {
            x: 0.8,
            y: 1.3,
            w: 11.7,
            h: 0.5,
            fontSize: 13,
            fontFace: 'Arial',
            color: '64748B',
          });
        }

        const stats = item.stats || [];
        const statsCount = Math.min(stats.length, 3) || 1;
        const statW = (11.7 - (statsCount - 1) * 0.4) / statsCount;

        stats.slice(0, 3).forEach((st, sIdx) => {
          const sX = 0.8 + sIdx * (statW + 0.4);
          const sY = 2.0;

          // Stat Card
          slide.addShape(pptx.ShapeType.roundRect, {
            x: sX,
            y: sY,
            w: statW,
            h: 3.5,
            fill: { color: colors.cardBg },
            line: { color: 'E2E8F0', width: 1 },
            rectRadius: 0.2,
          });

          // Large Stat Number
          slide.addText(st.value, {
            x: sX + 0.2,
            y: sY + 0.5,
            w: statW - 0.4,
            h: 1.2,
            fontSize: 38,
            fontFace: 'Arial',
            color: colors.primary,
            bold: true,
            align: 'center',
            valign: 'middle',
          });

          // Stat Label
          slide.addText(st.label, {
            x: sX + 0.3,
            y: sY + 1.8,
            w: statW - 0.6,
            h: 0.9,
            fontSize: 13,
            fontFace: 'Arial',
            color: '475569',
            align: 'center',
            bold: true,
          });

          // Change badge if present
          if (st.change) {
            slide.addText(st.change, {
              x: sX + 0.5,
              y: sY + 2.7,
              w: statW - 1.0,
              h: 0.4,
              fontSize: 11,
              fontFace: 'Arial',
              color: '16A34A',
              align: 'center',
              bold: true,
            });
          }
        });

        // Bottom Highlight Text Box
        if (item.highlightText) {
          slide.addShape(pptx.ShapeType.rect, {
            x: 0.8,
            y: 5.8,
            w: 11.7,
            h: 0.9,
            fill: { color: 'F1F5F9' },
            line: { color: colors.accent, width: 2 },
          });

          slide.addText(`ข้อสังเกตสำคัญ: ${item.highlightText}`, {
            x: 1.1,
            y: 5.9,
            w: 11.1,
            h: 0.7,
            fontSize: 12,
            fontFace: 'Arial',
            color: colors.textDark,
            valign: 'middle',
          });
        }
      } else {
        // Standard Bullets / Timeline / Conclusion Layout
        if (item.subtitle) {
          slide.addText(item.subtitle, {
            x: 0.8,
            y: 1.35,
            w: 11.7,
            h: 0.6,
            fontSize: 14,
            fontFace: 'Arial',
            color: colors.textDark,
            bold: true,
          });
        }

        if (item.bullets && item.bullets.length > 0) {
          const bulletTexts = item.bullets.map(b => [
            { text: `${b.title}\n`, options: { bold: true, color: colors.primary, fontSize: 13 } },
            { text: `${b.description}\n\n`, options: { bold: false, color: '334155', fontSize: 12 } },
          ]);

          slide.addText(bulletTexts.flat(), {
            x: 0.8,
            y: 2.1,
            w: imageObj ? 7.2 : 11.7,
            h: 4.6,
            bullet: { type: 'bullet' },
            valign: 'top',
          });
        }

        if (imageObj) {
          slide.addImage({
            data: imageObj,
            x: 8.4,
            y: 2.0,
            w: 4.1,
            h: 4.6,
            rounding: true,
          });
        }
      }
    }
  }

  // Trigger browser download
  const cleanFileName = (deck.deckTitle || 'สไลด์นำเสนอ_AI')
    .replace(/[\\/:*?"<>|]/g, '_')
    .trim();
  await pptx.writeFile({ fileName: `${cleanFileName}_BPP_FO5.pptx` });
}
