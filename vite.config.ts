import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';

function fo5AiApi(): Plugin {
  return {
    name: 'fo5-ai-api',
    configureServer(server) {
      server.middlewares.use('/api/ai', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        const chunks: Buffer[] = [];
        req.on('data', chunk => chunks.push(Buffer.from(chunk)));
        req.on('end', async () => {
          try {
            const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}') as {
              department?: string;
              prompt?: string;
              context?: Record<string, unknown>;
            };

            const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
            if (!apiKey) {
              res.statusCode = 503;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'GEMINI_API_KEY is not configured' }));
              return;
            }

            const ai = new GoogleGenAI({
              apiKey,
              httpOptions: {
                headers: {
                  'User-Agent': 'aistudio-build',
                },
              },
            });
            const safeContext = JSON.stringify(body.context ?? {}).slice(0, 12000);
            const isGeneratingSlides = body.context?.task === 'generate_slides';
            const isDrafting = body.context?.task === 'draft_official_document';
            const system = isGeneratingSlides
              ? `คุณคือ AI ผู้เชี่ยวชาญด้านการจัดทำสไลด์นำเสนอระดับผู้บริหารและหน่วยงานราชการไทย (BPP FO.5 AI Slide Architect)
หน้าที่ของคุณคือแปลงข้อมูล เนื้อหา และวัตถุประสงค์ที่ผู้ใช้ระบุ ให้กลายเป็นโครงสร้างสไลด์นำเสนอ (Slide Deck) ที่กระชับ ทรงพลัง สวยงาม และตรงประเด็น
ตอบกลับเป็น JSON ที่ถูกต้องตามโครงสร้างเท่านั้น ห้ามใส่คำทักทายอื่น`
              : isDrafting
              ? `คุณคือผู้เชี่ยวชาญด้านงานสารบรรณภาครัฐไทยและระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ
หน้าที่ของคุณคือร่างหนังสือราชการที่เป็นทางการ สมบูรณ์ และถูกต้องตามแบบฟอร์ม 100%
องค์ประกอบที่ต้องมี:
- ตราครุฑ
- เลขที่หนังสือและวันที่ (พุทธศักราชไทย)
- เรื่อง (กระชับ ชัดเจน)
- เรียน (ผู้รับตำแหน่งถูกต้อง)
- อ้างถึง หรือ สิ่งที่ส่งมาด้วย (ถ้ามี)
- เนื้อหา 3 ภาค: ภาคเหตุ (ที่มา), ภาคความประสงค์ (รายละเอียดการขอความอนุเคราะห์/ดำเนินการ), ภาคสรุป (ข้อพิจารณา)
- คำลงท้ายถูกต้องตามฐานันดรศักดิ์/ระเบียบสารบรรณ
- ชื่อและตำแหน่งผู้ลงนาม
- ส่วนราชการเจ้าของเรื่องและเบอร์โทรศัพท์`
              : `คุณคือ FO5 AI Assistant สำหรับ ${body.department || 'ฝอ.5'} ในระบบบริหารงานภายในองค์กร\n\nหลักปฏิบัติ:\n- ช่วยสรุป วิเคราะห์ ร่างข้อความ และจัดลำดับงานเท่านั้น\n- ห้ามยืนยันข้อเท็จจริงที่ไม่มีในข้อมูล\n- ห้ามตัดสินใจแทนเจ้าหน้าที่หรือผู้บังคับบัญชา\n- ระบุสิ่งที่ควรตรวจสอบเมื่อข้อมูลไม่ครบ\n- หลีกเลี่ยงการเปิดเผยข้อมูลส่วนบุคคลเกินจำเป็น\n- ตอบเป็นภาษาไทย อ่านง่าย ใช้งานได้จริง\n`;
            
            const prompt = `${system}\nคำขอ: ${body.prompt || ''}\nข้อมูลประกอบ: ${safeContext}`;

            // High-resilience model candidate chain:
            // 1. gemini-3.1-flash-lite (High-throughput, dedicated pool, highly resistant to 503 spikes)
            // 2. gemini-3.8-flash (Standard model)
            // 3. gemini-flash-latest (Alias fallback)
            const candidateModels = [
              'gemini-3.1-flash-lite',
              'gemini-3.8-flash',
              'gemini-flash-latest',
            ];

            let generatedText: string | null = null;

            for (const modelName of candidateModels) {
              try {
                const result = await ai.models.generateContent({
                  model: modelName,
                  contents: prompt,
                  config: isGeneratingSlides ? { responseMimeType: 'application/json' } : undefined,
                });

                if (result.text && result.text.trim().length > 0) {
                  generatedText = result.text;
                  break;
                }
              } catch (err: any) {
                // If quota is exhausted or rate-limited, immediately break to local fallback
                const msg = String(err?.message || '');
                if (err?.status === 429 || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('exceeded your current quota')) {
                  break;
                }
                // Seamlessly switch to next candidate model with brief pacing
                await new Promise(resolve => setTimeout(resolve, 200));
              }
            }

            if (generatedText) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ text: generatedText, provider: 'gemini' }));
            } else {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                text: null,
                provider: 'local',
                notice: 'Switched to offline fallback engine.'
              }));
            }
          } catch {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ text: null, provider: 'local' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), fo5AiApi()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
