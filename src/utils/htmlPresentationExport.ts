import { SlideDeck } from '../types/slides';
import { SLIDE_THEMES } from '../data/slideThemesData';

/**
 * Creates a standalone offline-compatible single HTML file for the presentation.
 * Features built-in keyboard navigation (Left/Right/Space/F), progress bar, slide counter,
 * responsive 16:9 canvas, and print styling.
 */
export function exportDeckToHtml(deck: SlideDeck): void {
  const theme = SLIDE_THEMES[deck.theme] || SLIDE_THEMES.navy;

  const slidesJson = JSON.stringify(deck.slides);
  const imagesJson = JSON.stringify(deck.images.map(img => ({ id: img.id, dataUrl: img.dataUrl, name: img.name })));

  const htmlContent = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${deck.deckTitle || 'สไลด์นำเสนอ AI'} - ฝอ.๕ บช.ตชด.</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Sarabun', -apple-system, BlinkMacSystemFont, sans-serif; }
    body { background: #0b0f17; color: #f8fafc; overflow: hidden; height: 100vh; display: flex; flex-direction: column; }
    
    .top-bar {
      display: flex; justify-content: space-between; align-items: center;
      padding: 10px 24px; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255,255,255,0.1); z-index: 10; font-size: 14px;
    }
    .deck-info { display: flex; align-items: center; gap: 12px; }
    .badge { background: ${theme.primary}; color: #fff; padding: 3px 10px; border-radius: 9999px; font-size: 11px; font-weight: 600; }
    .controls { display: flex; align-items: center; gap: 8px; }
    .btn {
      background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2);
      padding: 6px 14px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500;
      transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px;
    }
    .btn:hover { background: rgba(255,255,255,0.25); }
    .btn-primary { background: ${theme.accent}; color: #000; font-weight: 700; border: none; }
    .btn-primary:hover { filter: brightness(1.1); }

    .stage-wrapper {
      flex: 1; display: flex; align-items: center; justify-content: center; padding: 20px;
      position: relative;
    }
    .slide-canvas {
      width: 100%; max-width: 1200px; aspect-ratio: 16 / 9; max-height: calc(100vh - 120px);
      background: ${theme.contentBg}; border-radius: 16px; overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); display: flex; flex-direction: column;
      position: relative; transition: opacity 0.25s ease;
    }

    /* Cover Slide Style */
    .cover-slide {
      background: linear-gradient(135deg, ${theme.primary} 0%, #0c1827 100%);
      color: #fff; height: 100%; display: flex; flex-direction: column; justify-content: space-between;
      padding: 48px 56px; position: relative;
    }
    .cover-accent-bar { position: absolute; top: 0; left: 0; right: 0; height: 6px; background: ${theme.accent}; }
    .cover-badge {
      display: inline-block; background: rgba(212, 175, 55, 0.15); border: 1px solid ${theme.accent};
      color: ${theme.accent}; padding: 4px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700;
      letter-spacing: 0.5px; margin-bottom: 20px;
    }
    .cover-title { font-size: clamp(24px, 3.2vw, 42px); font-weight: 700; line-height: 1.25; margin-bottom: 16px; color: #fff; }
    .cover-subtitle { font-size: clamp(14px, 1.4vw, 18px); color: #cbd5e1; line-height: 1.6; max-width: 780px; }
    .cover-footer {
      border-top: 1px solid rgba(255,255,255,0.15); padding-top: 20px;
      display: flex; justify-content: space-between; align-items: flex-end; font-size: 13px; color: #94a3b8;
    }

    /* Content Slide Style */
    .content-slide {
      height: 100%; display: flex; flex-direction: column; background: #f8fafc; color: #0f172a;
    }
    .slide-header {
      background: ${theme.primary}; color: #fff; padding: 18px 36px;
      display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid ${theme.accent};
    }
    .slide-header-title { font-size: clamp(18px, 1.8vw, 24px); font-weight: 700; }
    .slide-header-badge { font-size: 11px; background: rgba(255,255,255,0.15); padding: 3px 10px; border-radius: 9999px; }
    
    .slide-body { flex: 1; padding: 32px 40px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
    .slide-subtitle { font-size: clamp(14px, 1.2vw, 16px); color: #475569; font-weight: 600; }
    
    /* Layouts */
    .split-layout { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 28px; height: 100%; align-items: center; }
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; height: 100%; align-items: stretch; }
    .card-item {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 8px;
    }
    .card-item-title { font-size: 16px; font-weight: 700; color: ${theme.primary}; border-left: 3px solid ${theme.accent}; padding-left: 8px; }
    .card-item-desc { font-size: 13px; color: #475569; line-height: 1.6; }

    .bullet-list { display: flex; flex-direction: column; gap: 14px; }
    .bullet-item { display: flex; gap: 12px; align-items: flex-start; }
    .bullet-dot { width: 8px; height: 8px; border-radius: 50%; background: ${theme.accent}; margin-top: 7px; flex-shrink: 0; }
    .bullet-title { font-weight: 700; font-size: 15px; color: ${theme.primary}; }
    .bullet-desc { font-size: 13.5px; color: #475569; line-height: 1.55; }

    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 10px; }
    .stat-card {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px; text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .stat-val { font-size: clamp(28px, 3.5vw, 44px); font-weight: 800; color: ${theme.primary}; margin-bottom: 6px; }
    .stat-lbl { font-size: 13px; font-weight: 600; color: #64748b; }

    .slide-image-box {
      width: 100%; height: 100%; min-height: 220px; max-height: 340px; border-radius: 12px;
      overflow: hidden; box-shadow: 0 8px 16px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;
    }
    .slide-image-box img { width: 100%; height: 100%; object-fit: cover; }

    .slide-footer {
      padding: 12px 36px; background: #f1f5f9; border-top: 1px solid #e2e8f0;
      display: flex; justify-content: space-between; font-size: 12px; color: #64748b;
    }

    .progress-bar-container { width: 100%; height: 4px; background: rgba(255,255,255,0.1); }
    .progress-bar { height: 100%; background: ${theme.accent}; transition: width 0.3s ease; }

    /* Floating navigation buttons */
    .nav-arrow {
      position: absolute; top: 50%; transform: translateY(-50%);
      background: rgba(15, 23, 42, 0.7); color: #fff; border: 1px solid rgba(255,255,255,0.2);
      width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center;
      justify-content: center; font-size: 20px; cursor: pointer; backdrop-filter: blur(8px);
      transition: all 0.2s; z-index: 20;
    }
    .nav-arrow:hover { background: rgba(255,255,255,0.3); transform: translateY(-50%) scale(1.08); }
    .nav-prev { left: 24px; }
    .nav-next { right: 24px; }

    /* Speaker Notes Bar */
    .notes-drawer {
      background: rgba(15, 23, 42, 0.95); border-top: 1px solid rgba(255,255,255,0.15);
      padding: 12px 24px; font-size: 13px; color: #cbd5e1; display: none;
    }
    .notes-drawer.open { display: block; }

    @media print {
      body { overflow: visible; height: auto; background: #fff; color: #000; }
      .top-bar, .nav-arrow, .progress-bar-container, .notes-drawer { display: none !important; }
      .stage-wrapper { padding: 0; display: block; }
      .slide-canvas {
        max-width: 100%; aspect-ratio: 16 / 9; max-height: none; page-break-after: always;
        box-shadow: none; border-radius: 0; margin-bottom: 20px;
      }
    }
  </style>
</head>
<body>

  <div class="top-bar">
    <div class="deck-info">
      <span class="badge">${deck.department || 'ฝอ.๕ บช.ตชด.'}</span>
      <strong>${deck.deckTitle || 'สไลด์นำเสนอ AI'}</strong>
    </div>
    <div class="controls">
      <span id="slideCounter" style="color: #94a3b8; margin-right: 8px;">1 / 1</span>
      <button class="btn" onclick="toggleNotes()">📝 โน้ตผู้บรรยาย</button>
      <button class="btn" onclick="toggleFullscreen()">⛶ เต็มจอ</button>
      <button class="btn btn-primary" onclick="window.print()">🖨 พิมพ์ / บันทึก PDF</button>
    </div>
  </div>

  <div class="progress-bar-container">
    <div id="progressBar" class="progress-bar" style="width: 10%;"></div>
  </div>

  <div class="stage-wrapper">
    <button class="nav-arrow nav-prev" onclick="prevSlide()" aria-label="Previous">❮</button>
    <div id="slideContainer" class="slide-canvas">
      <!-- Dynamically rendered -->
    </div>
    <button class="nav-arrow nav-next" onclick="nextSlide()" aria-label="Next">❯</button>
  </div>

  <div id="notesDrawer" class="notes-drawer">
    <div style="font-weight: 700; color: ${theme.accent}; margin-bottom: 4px;">บทพูดสำหรับผู้นำเสนอ (Speaker Notes):</div>
    <div id="notesText">-</div>
  </div>

  <script>
    const slides = ${slidesJson};
    const images = ${imagesJson};
    let currentIndex = 0;

    function renderSlide(index) {
      const slide = slides[index];
      const container = document.getElementById('slideContainer');
      document.getElementById('slideCounter').innerText = (index + 1) + ' / ' + slides.length;
      document.getElementById('progressBar').style.width = (((index + 1) / slides.length) * 100) + '%';
      
      const notes = slide.speakerNotes || 'ไม่มีบันทึกสำหรับสไลด์นี้';
      document.getElementById('notesText').innerText = notes;

      // Find image if mapped
      let imgData = null;
      if (slide.customImageUrl) {
        imgData = slide.customImageUrl;
      } else if (slide.imageIndex !== undefined && slide.imageIndex !== null && images[slide.imageIndex]) {
        imgData = images[slide.imageIndex].dataUrl;
      }

      if (slide.layout === 'title') {
        container.innerHTML = \`
          <div class="cover-slide">
            <div class="cover-accent-bar"></div>
            <div>
              <span class="cover-badge">\${slide.badge || 'ฝ่ายอำนวยการ ๕ บก.อก.บช.ตชด.'}</span>
              <h1 class="cover-title">\${slide.title}</h1>
              <p class="cover-subtitle">\${slide.subtitle || ''}</p>
            </div>
            \${imgData ? \`<div style="max-height: 220px; max-width: 320px; margin: 15px 0; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);"><img src="\${imgData}" style="width:100%;height:100%;object-fit:cover;"></div>\` : ''}
            <div class="cover-footer">
              <div>
                <strong>ผู้นำเสนอ:</strong> ${deck.presenter || 'เจ้าหน้าที่ฝ่ายอำนวยการ'}<br>
                <strong>หน่วยงาน:</strong> ${deck.department || 'ฝ่ายอำนวยการ ๕ กองบัญชาการตำรวจตระเวนชายแดน'}
              </div>
              <div style="text-align: right;">
                วันที่: ${deck.date || 'พุทธศักราช ๒๕๖๙'}
              </div>
            </div>
          </div>
        \`;
      } else {
        let bodyHtml = '';
        if (slide.layout === 'split-image' || (imgData && slide.layout !== 'cards' && slide.layout !== 'stats')) {
          bodyHtml = \`
            <div class="split-layout">
              <div class="bullet-list">
                \${slide.subtitle ? \`<div class="slide-subtitle">\${slide.subtitle}</div>\` : ''}
                \${(slide.bullets || []).map(b => \`
                  <div class="bullet-item">
                    <div class="bullet-dot"></div>
                    <div>
                      <div class="bullet-title">\${b.title}</div>
                      <div class="bullet-desc">\${b.description}</div>
                    </div>
                  </div>
                \`).join('')}
              </div>
              \${imgData ? \`
                <div class="slide-image-box">
                  <img src="\${imgData}" alt="Slide Visual">
                </div>
              \` : ''}
            </div>
          \`;
        } else if (slide.layout === 'cards') {
          bodyHtml = \`
            \${slide.subtitle ? \`<div class="slide-subtitle">\${slide.subtitle}</div>\` : ''}
            <div class="cards-grid">
              \${(slide.bullets || []).map(c => \`
                <div class="card-item">
                  <div class="card-item-title">\${c.title}</div>
                  <div class="card-item-desc">\${c.description}</div>
                </div>
              \`).join('')}
            </div>
          \`;
        } else if (slide.layout === 'stats') {
          bodyHtml = \`
            \${slide.subtitle ? \`<div class="slide-subtitle">\${slide.subtitle}</div>\` : ''}
            <div class="stats-grid">
              \${(slide.stats || []).map(s => \`
                <div class="stat-card">
                  <div class="stat-val">\${s.value}</div>
                  <div class="stat-lbl">\${s.label}</div>
                  \${s.change ? \`<div style="font-size:11px;color:#16a34a;margin-top:4px;font-weight:700;">\${s.change}</div>\` : ''}
                </div>
              \`).join('')}
            </div>
            \${slide.highlightText ? \`
              <div style="background:#e2e8f0;border-left:4px solid ${theme.accent};padding:12px 18px;border-radius:6px;font-size:13px;color:#1e293b;margin-top:16px;">
                <strong>จุดเน้นสำคัญ:</strong> \${slide.highlightText}
              </div>
            \` : ''}
          \`;
        } else {
          bodyHtml = \`
            \${slide.subtitle ? \`<div class="slide-subtitle">\${slide.subtitle}</div>\` : ''}
            <div class="bullet-list">
              \${(slide.bullets || []).map(b => \`
                <div class="bullet-item">
                  <div class="bullet-dot"></div>
                  <div>
                    <div class="bullet-title">\${b.title}</div>
                    <div class="bullet-desc">\${b.description}</div>
                  </div>
                </div>
              \`).join('')}
            </div>
          \`;
        }

        container.innerHTML = \`
          <div class="content-slide">
            <div class="slide-header">
              <div class="slide-header-title">\${slide.title}</div>
              <span class="slide-header-badge">\${slide.badge || 'ฝอ.๕ บช.ตชด.'}</span>
            </div>
            <div class="slide-body">
              \${bodyHtml}
            </div>
            <div class="slide-footer">
              <span>${deck.department || 'ฝ่ายอำนวยการ ๕ บช.ตชด.'}</span>
              <span>สไลด์ \${index + 1} จาก \${slides.length}</span>
            </div>
          </div>
        \`;
      }
    }

    function nextSlide() {
      if (currentIndex < slides.length - 1) {
        currentIndex++;
        renderSlide(currentIndex);
      }
    }

    function prevSlide() {
      if (currentIndex > 0) {
        currentIndex--;
        renderSlide(currentIndex);
      }
    }

    function toggleNotes() {
      const drawer = document.getElementById('notesDrawer');
      drawer.classList.toggle('open');
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        prevSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    });

    renderSlide(0);
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const cleanFileName = (deck.deckTitle || 'สไลด์นำเสนอ_AI')
    .replace(/[\\/:*?"<>|]/g, '_')
    .trim();
  a.download = `${cleanFileName}_BPP_FO5_Presentation.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
