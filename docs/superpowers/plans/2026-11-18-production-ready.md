# ทำให้ทุกระบบใช้งานจริง (ข้อมูลว่าง + บันทึกถาวร) — แผน

**เป้าหมาย:** เว็บเริ่มต้นแบบไม่มีข้อมูลตัวอย่าง ทุกอย่างที่ผู้ใช้เพิ่ม/แก้/ลบ บันทึกลง Supabase ถาวร
ใช้ร่วมกันได้หลายคน และงานค้างจากระยะที่ 2 ปิดให้หมด

## สภาพปัจจุบัน (จากการสำรวจโค้ด)
- เกือบทุกโมดูลใช้ `useState(INITIAL_...)` หรือคลาส service ที่เก็บ array ตัวอย่างในหน่วยความจำ รีโหลดแล้วหาย
  - AdminContext: งบประมาณ, เดินทาง, หนังสือรับ/ส่ง/จัดเก็บ, หน่วย, กำลังพล, log, แจ้งเตือน, ตรวจเอกสาร, ประชุม, ภารกิจ
  - Dashboard, Volunteer, PR Intel, Relations (ข่าว/สื่อ), Disaster (เหตุการณ์/สถานีจำลอง), ตารางเวร, ภารกิจ ตชด., MySpace (เงินเดือน/งาน/ตารางวันนี้), BppReportTracker
- `/api/ai` ไม่มีอยู่จริง ทุกฟีเจอร์ AI ตกไปโหมดออฟไลน์
- บอท v5 ต้องใช้ service_role key ที่ผู้ใช้ต้องหาเอง
- มีบัญชีเดียว ไม่มีหน้าจัดการผู้ใช้ ไม่มีเปลี่ยนรหัสผ่าน ไม่มีหน้าผูกกลุ่ม LINE กับแผนก
- ฐานข้อมูลมีแถวทดสอบ e2e ค้างอยู่

## การออกแบบ
1. **ตารางกลาง `public.app_records`** `(collection text, id text, data jsonb, updated_at, updated_by)` PK `(collection,id)`
   RLS: staff เท่านั้น (select/insert/update/delete) + Realtime
   เหตุผล: มีชนิดข้อมูล ~35 แบบ ทำตารางแยกทุกแบบใช้เวลาหลายสัปดาห์ แบบ jsonb ใช้ type เดิมของหน้าเว็บได้เลย
2. **`src/lib/collections.ts`**: store ต่อ collection (โหลดเมื่อ login, realtime, ล้างเมื่อ logout)
   - `useCollection<T extends {id:string}>(name)` คืน `[items, setItems, status]` ใช้แทน `useState` ได้ทันที
   - `setItems` รับค่าหรือ updater → diff ตาม id → upsert แถวที่เปลี่ยน / delete แถวที่หาย, optimistic + rollback
   - `getCollectionStore(name)` สำหรับคลาส service ที่ไม่ใช่ React
3. **ข้อมูลที่ "เป็นโครงสร้าง" เก็บไว้** (ไม่ใช่ข้อมูลตัวอย่าง): รายชื่อแผนก/สิทธิ์, แม่แบบหนังสือ อปท., ธีมสไลด์, รายชื่อหน่วย ตชด.
   ข้อมูลเซนเซอร์จำลอง (สถานีน้ำ/ฝน/เรดาร์) และโพสต์ Facebook จำลอง: เอาออก แสดง "ยังไม่เชื่อมต่อแหล่งข้อมูล"
4. **Edge Function `line-ingest`** (Supabase มี service_role ในตัว): บอทส่งข้อมูลมาพร้อม `x-ingest-secret`
   → บันทึกรายงาน + อัปโหลดรูป ผู้ใช้ไม่ต้องยุ่งกับ service_role key อีก
5. **Edge Function `staff-admin`** (เฉพาะ SUPER_ADMIN): สร้างผู้ใช้ + เพิ่มเป็น staff + โปรไฟล์ (ยศ ชื่อ ตำแหน่ง แผนก สิทธิ์)
   ตาราง `staff` เพิ่มคอลัมน์โปรไฟล์ เว็บอ่านโปรไฟล์จากตารางนี้แทนค่าที่ฝังในโค้ด
6. **UI ใหม่**: เปลี่ยนรหัสผ่าน (โปรไฟล์ผู้ใช้), จัดการผู้ใช้ (ตั้งค่าระบบ), ผูกกลุ่ม LINE → แผนก (หน้ารายงาน LINE)
7. **`api/ai.ts` บน Vercel**: ตรวจ token Supabase + staff ก่อนเรียก Gemini ด้วย `GEMINI_API_KEY`
   ไม่มีคีย์ → ตอบ 503 แล้วเว็บใช้โหมดออฟไลน์เหมือนเดิม (ไม่พัง)

## ขั้นตอน
1. Migration 0003 (app_records, staff profile, line_groups update grant, ingest secret) + ตรวจ advisors
2. `collections.ts` + ทดสอบกับฐานจริง (เพิ่ม/แก้/ลบ/รีโหลด/realtime/คนนอกอ่านไม่ได้)
3. เปลี่ยนทุกโมดูลไปใช้ collection ว่าง ทีละกลุ่ม: Admin → Dashboard → Volunteer → Relations/PR → Disaster → Schedule → MySpace → BPP tracker
   ทุกหน้าต้องมีสถานะว่างที่อ่านเข้าใจ และตัวเลขสรุปคิดจากข้อมูลจริง (ไม่ใช่ตัวเลขฝัง)
4. Edge functions `line-ingest`, `staff-admin` + บอท v5 ใช้ line-ingest + test เดิมผ่าน
5. UI เปลี่ยนรหัสผ่าน / จัดการผู้ใช้ / ผูกกลุ่ม LINE
6. `api/ai.ts`
7. ล้างแถวทดสอบในฐานข้อมูล, ลบ `.claude/launch.json` ชั่วคราว
8. `npm run build` ผ่าน (tsc), เปิดทุกเมนูในเบราว์เซอร์: ว่าง, เพิ่มข้อมูลได้, รีโหลดแล้วอยู่, console ไม่มี error
9. Push → Vercel Ready → ตรวจเว็บจริงซ้ำ

## สิ่งที่ผู้ใช้ต้องทำเอง (ระบบ/นโยบายไม่ให้ผมทำแทน)
- วางโค้ดบอท v5 ใน Cloudflare + ตั้งตัวแปร 2 ตัว (ถ้าผมเข้า Cloudflare ไม่ได้)
- เปลี่ยนรหัสผ่านแอดมิน, ปิด "Allow new users to sign up" ใน Supabase (ไม่บังคับ มี allowlist กันแล้ว)
- ใส่ `GEMINI_API_KEY` ใน Vercel ถ้าต้องการ AI จริง
