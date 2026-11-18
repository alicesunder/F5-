export interface FO5AIRequest {
  department: string;
  prompt: string;
  context?: Record<string, unknown>;
}

export interface FO5AIResponse {
  text: string;
  provider: 'gemini' | 'local';
}

function localFallback({ department, prompt }: FO5AIRequest): string {
  const p = prompt.toLowerCase();
  if (p.includes('สรุป') || p.includes('brief')) {
    return `สรุปงาน ${department}: ระบบพบงานที่อยู่ระหว่างดำเนินการและรายการที่ควรติดตามเป็นพิเศษ แนะนำให้ตรวจงานที่ใกล้ครบกำหนดก่อน จากนั้นปิดรายการที่มีข้อมูลพร้อมและจัดเก็บหลักฐานประกอบให้ครบถ้วน`;
  }
  if (p.includes('ร่าง') || p.includes('draft')) {
    return `ร่างเบื้องต้นสำหรับ ${department}: ตามภารกิจและข้อมูลที่ได้รับ เห็นควรดำเนินการตามลำดับงานที่กำหนด พร้อมมอบหมายผู้รับผิดชอบและกำหนดวันครบกำหนดให้ชัดเจน ทั้งนี้ให้เจ้าหน้าที่ตรวจสอบข้อเท็จจริงและแก้ไขข้อความก่อนนำไปใช้จริง`;
  }
  if (p.includes('เร่งด่วน') || p.includes('urgent')) {
    return `ระบบคัดกรองเบื้องต้น: รายการนี้ควรถูกจัดเป็นงานเฝ้าระวัง/เร่งด่วน และควรระบุผู้รับผิดชอบ กำหนดส่ง และหลักฐานผลการปฏิบัติให้ครบ ก่อนส่งต่อผู้บังคับบัญชาพิจารณา`;
  }
  return `FO5 AI พร้อมช่วยงาน ${department}: ผมสามารถช่วยสรุปข้อมูล ร่างข้อความ แยกประเด็น กำหนด Task และเตือนสิ่งที่ควรตรวจสอบได้ คำตอบนี้เป็นโหมดออฟไลน์และควรตรวจสอบข้อมูลต้นฉบับก่อนใช้งานจริง`;
}

export async function askFO5AI(request: FO5AIRequest): Promise<FO5AIResponse> {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (response.ok) {
      const data = (await response.json()) as { text?: string; provider?: 'gemini' | 'local' };
      if (data.text) {
        return { text: data.text, provider: data.provider || 'gemini' };
      }
    }
  } catch {
    // Fall through to local-safe mode.
  }

  return { text: localFallback(request), provider: 'local' };
}
