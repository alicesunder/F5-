import { DlaTemplate, DLA_TEMPLATES } from '../data/dlaTemplatesData';
import { DocumentInspection } from '../types';
import { initialInspections } from '../data/inspectionsData';

export interface OfficialDraftResult {
  id: string;
  documentType: 'หนังสือภายนอก' | 'หนังสือภายใน' | 'คำสั่ง' | 'ประกาศ' | 'หนังสือประทับตรา' | 'รายงานการประชุม' | 'แบบฟอร์มสัญญา';
  garudaPosition: 'center' | 'left' | 'none';
  bookNumber: string;
  issuedAt: string;
  date: string;
  subject: string;
  recipient: string;
  reference: string;
  attachments: string;
  paragraphs: {
    intro: string;
    body: string;
    conclusion: string;
  };
  closing: string;
  signerName: string;
  signerPosition: string;
  departmentContact: {
    office: string;
    tel: string;
    email: string;
  };
  matchedDlaTemplate?: DlaTemplate;
  matchedVettedDoc?: DocumentInspection;
  complianceScoreEstimate: number;
  provider: 'gemini' | 'local';
}

function getThaiNumber(numStr: string): string {
  const thaiDigits = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
  return numStr.replace(/[0-9]/g, (w) => thaiDigits[+w]);
}

function getCurrentThaiDateString(): string {
  const d = new Date();
  const day = d.getDate();
  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  const month = months[d.getMonth()];
  const year = d.getFullYear() + 543;
  return `${getThaiNumber(String(day))} ${month} ๒๕๖๙`;
}

export function findBestDlaTemplate(query: string): DlaTemplate {
  const q = query.toLowerCase();
  
  if (q.includes('คำสั่ง') || q.includes('แต่งตั้ง') || q.includes('เวร') || q.includes('สิบเวร')) {
    if (q.includes('สิบเวร') || q.includes('เวรยาม') || q.includes('ผนวก ข')) {
      return DLA_TEMPLATES.find(t => t.id === 'DLA-08') || DLA_TEMPLATES[3];
    }
    return DLA_TEMPLATES.find(t => t.id === 'DLA-04') || DLA_TEMPLATES[3];
  }

  if (q.includes('ประกาศ')) {
    return DLA_TEMPLATES.find(t => t.id === 'DLA-05') || DLA_TEMPLATES[4];
  }

  if (q.includes('ไปราชการ') || q.includes('เบิกค่าใช้จ่าย') || q.includes('8708') || q.includes('๘๗๐๘')) {
    return DLA_TEMPLATES.find(t => t.id === 'DLA-07') || DLA_TEMPLATES[1];
  }

  if (q.includes('ซื้อ') || q.includes('จ้าง') || q.includes('พัสดุ') || q.includes('จัดซื้อ')) {
    return DLA_TEMPLATES.find(t => t.id === 'DLA-06') || DLA_TEMPLATES[1];
  }

  if (q.includes('วิทยากร') || q.includes('บรรยาย') || q.includes('อบรม')) {
    return DLA_TEMPLATES.find(t => t.id === 'DLA-09') || DLA_TEMPLATES[0];
  }

  if (q.includes('ประชุม') || q.includes('วาระ') || q.includes('มติ')) {
    return DLA_TEMPLATES.find(t => t.id === 'DLA-10') || DLA_TEMPLATES[0];
  }

  if (q.includes('ขออนุมัติ') || q.includes('บันทึกข้อความ') || q.includes('ภายใน') || q.includes('งบประมาณ')) {
    return DLA_TEMPLATES.find(t => t.id === 'DLA-02') || DLA_TEMPLATES[1];
  }

  if (q.includes('ประทับตรา') || q.includes('แจ้งเวียน')) {
    return DLA_TEMPLATES.find(t => t.id === 'DLA-03') || DLA_TEMPLATES[2];
  }

  // Default to external letter (ขอความอนุเคราะห์)
  return DLA_TEMPLATES[0];
}

export function findBestVettedDocument(query: string, inspections: DocumentInspection[] = initialInspections): DocumentInspection | undefined {
  const q = query.toLowerCase();
  
  // Find highest score inspection matching keywords
  const matched = inspections.filter(item => {
    const textToSearch = `${item.fileName} ${item.documentType} ${item.subject || ''} ${item.sender || ''}`.toLowerCase();
    const keywords = q.split(/\s+/).filter(k => k.length > 2);
    return keywords.some(k => textToSearch.includes(k));
  });

  if (matched.length > 0) {
    // Return the one with highest score
    return matched.sort((a, b) => b.score - a.score)[0];
  }

  // Fallback to highest score general inspection
  return inspections.slice().sort((a, b) => b.score - a.score)[0];
}

export async function draftOfficialDocument(
  prompt: string,
  options?: {
    customTemplateId?: string;
    vettedDocId?: string;
    inspectionsList?: DocumentInspection[];
  }
): Promise<OfficialDraftResult> {
  const allInspections = options?.inspectionsList || initialInspections;
  
  // 1. Identify best DLA template
  const matchedTemplate = options?.customTemplateId
    ? DLA_TEMPLATES.find(t => t.id === options.customTemplateId) || findBestDlaTemplate(prompt)
    : findBestDlaTemplate(prompt);

  // 2. Identify best vetted doc
  const matchedVetted = options?.vettedDocId
    ? allInspections.find(i => i.id === options.vettedDocId) || findBestVettedDocument(prompt, allInspections)
    : findBestVettedDocument(prompt, allInspections);

  const currentDateThai = getCurrentThaiDateString();

  // Try calling the AI backend endpoint
  try {
    const requestPayload = {
      department: 'ฝ่ายอำนวยการ ๕ บก.อก.บช.ตชด.',
      prompt: `กรุณาร่างหนังสือราชการภาษาไทยตามระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ โดยอ้างอิงแบบฟอร์มกรมส่งเสริมการปกครองท้องถิ่น (${matchedTemplate.name}) และตัวอย่างหนังสือที่ผ่านการตรวจรับรอง:\n\nคำขอของผู้ใช้: "${prompt}"\nแบบฟอร์มแนะนำ: ${matchedTemplate.docType} (${matchedTemplate.name})\nแนวทางการเขียน: มี 3 ย่อหน้า (ภาคเหตุ, ภาคความประสงค์, ภาคสรุป) ใช้คำขึ้นต้นและคำลงท้ายถูกต้องตามระเบียบ`,
      context: {
        task: 'draft_official_document',
        templateCode: matchedTemplate.code,
        templateName: matchedTemplate.name,
        docType: matchedTemplate.docType,
        vettedDocSubject: matchedVetted?.subject,
        vettedDocNumber: matchedVetted?.documentNumber,
      }
    };

    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestPayload),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.text && data.text.length > 50 && data.provider === 'gemini') {
        // Parse or construct result from Gemini response
        return parseAiGeneratedDraft(data.text, prompt, matchedTemplate, matchedVetted, currentDateThai);
      }
    }
  } catch {
    // Seamless fallback to high-fidelity rule-based Saraban generator
  }

  // 3. Fallback to high-fidelity rule-based Saraban generator
  return generateIntelligentLocalDraft(prompt, matchedTemplate, matchedVetted, currentDateThai);
}

function parseAiGeneratedDraft(
  aiText: string,
  prompt: string,
  template: DlaTemplate,
  vettedDoc?: DocumentInspection,
  dateStr: string = getCurrentThaiDateString()
): OfficialDraftResult {
  // Extract lines and clean up
  const lines = aiText.split('\n').map(l => l.trim()).filter(Boolean);
  
  let subject = '';
  let recipient = '';
  const paragraphs: string[] = [];

  for (const line of lines) {
    if (line.startsWith('เรื่อง') || line.startsWith('เรื่อง:')) {
      subject = line.replace(/^เรื่อง:?\s*/, '').trim();
    } else if (line.startsWith('เรียน') || line.startsWith('เรียน:')) {
      recipient = line.replace(/^เรียน:?\s*/, '').trim();
    } else if (line.length > 30 && !line.startsWith('ที่') && !line.startsWith('สำนัก') && !line.startsWith('วันที่')) {
      paragraphs.push(line);
    }
  }

  const cleanSubject = subject || cleanUserPromptToSubject(prompt, template);
  const cleanRecipient = recipient || template.sampleRecipient;
  
  const pIntro = paragraphs[0] || template.sampleBody.intro;
  const pBody = paragraphs[1] || template.sampleBody.detail;
  const pConclusion = paragraphs[paragraphs.length - 1] || template.sampleBody.conclusion;

  return {
    id: `DRAFT-${Date.now().toString().slice(-5)}`,
    documentType: template.docType,
    garudaPosition: template.garudaType,
    bookNumber: template.docType === 'คำสั่ง' 
      ? 'คำสั่ง บก.อก.บช.ตชด. ที่ ๔๕/๒๕๖๙' 
      : template.docType === 'หนังสือภายใน'
      ? 'ตชด ๐๐๒๑.๕/ '
      : 'ที่ ตชด ๐๐๒๑.๕/ ',
    issuedAt: template.docType === 'หนังสือภายใน'
      ? 'สำนักงานฝ่ายอำนวยการ ๕ กองบังคับการอำนวยการ โทร. ๐ ๒๒๗๙ ๙๕๒๐ ต่อ ๕๑๓'
      : 'กองบัญชาการตำรวจตระเวนชายแดน\nถนนพหลโยธิน เขตพญาไท กรุงเทพฯ ๑๐๔๐๐',
    date: dateStr,
    subject: cleanSubject,
    recipient: cleanRecipient,
    reference: vettedDoc?.reference && vettedDoc.reference !== '-' ? vettedDoc.reference : '',
    attachments: template.sampleBody.detail.includes('แนบ') ? 'เอกสารและรายละเอียดประกอบ จำนวน ๑ ชุด' : '',
    paragraphs: {
      intro: pIntro,
      body: pBody,
      conclusion: pConclusion,
    },
    closing: template.defaultClosing,
    signerName: '(พลตำรวจตรี สมชาย เกียรติเกรียงไกร)',
    signerPosition: template.defaultSignerPosition,
    departmentContact: {
      office: 'ฝ่ายอำนวยการ ๕ บก.อก.บช.ตชด. (งานธุรการและสารบรรณ)',
      tel: 'โทร. ๐ ๒๒๗๙ ๙๕๒๐ ต่อ ๕๑๓ หรือ ๐ ๒๒๗๙ ๙๕๒๑',
      email: 'bpp_division5@police.go.th',
    },
    matchedDlaTemplate: template,
    matchedVettedDoc: vettedDoc,
    complianceScoreEstimate: 96,
    provider: 'gemini',
  };
}

function cleanUserPromptToSubject(prompt: string, template: DlaTemplate): string {
  let cleaned = prompt
    .replace(/^(อยากร่างหนังสือ|ร่างหนังสือ|ช่วยร่างหนังสือ|ขอหนังสือ|ช่วยเขียน|ร่างบันทึกข้อความ|ร่างคำสั่ง|ขอร่าง|ทำหนังสือ)/i, '')
    .trim();
  if (!cleaned) return template.sampleSubject;
  if (!cleaned.startsWith('ขอ') && !cleaned.startsWith('แต่งตั้ง') && !cleaned.startsWith('รายงาน') && !cleaned.startsWith('เรื่อง')) {
    cleaned = `${cleaned}`;
  }
  return cleaned;
}

function generateIntelligentLocalDraft(
  prompt: string,
  template: DlaTemplate,
  vettedDoc?: DocumentInspection,
  dateStr: string = getCurrentThaiDateString()
): OfficialDraftResult {
  const subject = cleanUserPromptToSubject(prompt, template);
  
  // Custom tailored paragraphs based on prompt context
  let intro = template.sampleBody.intro;
  let detail = template.sampleBody.detail;
  let conclusion = template.sampleBody.conclusion;

  if (prompt.includes('น้ำท่วม') || prompt.includes('สาธารณภัย') || prompt.includes('ช่วยเหลือ')) {
    intro = 'ด้วย กองบัญชาการตำรวจตระเวนชายแดน โดย ฝ่ายอำนวยการ ๕ กองบังคับการอำนวยการ ได้รับแจ้งเหตุสถานการณ์อุทกภัยและสาธารณภัยในพื้นที่ ซึ่งส่งผลกระทบต่อความเป็นอยู่และความปลอดภัยของประชาชนเป็นวงกว้าง จึงมีความจำเป็นเร่งด่วนในการระดมกำลังพลและทรัพยากรเข้าให้ความช่วยเหลือ';
    detail = `ในการนี้ เพื่อให้การบรรเทาทุกข์และการช่วยเหลือผู้ประสบภัยเป็นไปด้วยความรวดเร็วและมีประสิทธิภาพสูงสุด กองบัญชาการตำรวจตระเวนชายแดน จึงใคร่ขอความอนุเคราะห์จากหน่วยงานของท่าน ในการสนับสนุนกำลังพลเจ้าหน้าที่ ยานพาหนะยกสูง และอุปกรณ์ช่วยเหลือผู้ประสบอุทกภัย เพื่อบูรณาการปฏิบัติงานร่วมกับชุดช่วยเหลือประชาชน ฝอ.๕ บก.อก.บช.ตชด. ในพื้นที่ประสบภัย`;
    conclusion = 'จึงเรียนมาเพื่อโปรดพิจารณาให้ความอนุเคราะห์ และมอบหมายเจ้าหน้าที่ประสานงานร่วมกันต่อไป จะขอบคุณยิ่ง';
  } else if (prompt.includes('งบ') || prompt.includes('เงิน') || prompt.includes('จัดซื้อ')) {
    intro = 'ตามที่ ฝ่ายอำนวยการ ๕ บก.อก.บช.ตชด. ได้รับมอบหมายให้กำกับดูแลและดำเนินโครงการตามแผนปฏิบัติราชการ ประจำปีงบประมาณ พ.ศ. ๒๕๖๙ นั้น';
    detail = `เพื่อให้การขับเคลื่อนภารกิจตามนโยบายของผู้บังคับบัญชาเป็นไปด้วยความเรียบร้อยและต่อเนื่อง จึงมีความจำเป็นต้องจัดซื้อจัดหาวัสดุอุปกรณ์สนับสนุนการปฏิบัติงาน วงเงินงบประมาณทั้งสิ้น ๑๒๕,๐๐๐ บาท (หนึ่งแสนสองหมื่นห้าพันบาทถ้วน) โดยขอเบิกจ่ายจากงบดำเนินงานตามแผนที่ได้รับจัดสรร รายละเอียดตามเอกสารโครงการแนบท้าย`;
    conclusion = 'จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติให้ดำเนินการจัดซื้อจัดจ้างตามระเบียบของทางราชการต่อไป';
  } else if (prompt.includes('เวร') || prompt.includes('สิบเวร')) {
    intro = 'เพื่อให้การรักษาความปลอดภัยสถานที่ราชการ การกำกับดูแลความสงบเรียบร้อย และการติดต่อประสานงานราชการนอกเวลาราชการของ สำนักงานฝ่ายอำนวยการ ๕ บก.อก.บช.ตชด. ดำเนินไปด้วยความเรียบร้อยและมีประสิทธิภาพสูงสุด';
    detail = 'จึงมีคำสั่งแต่งตั้งข้าราชการตำรวจในสังกัด ปฏิบัติหน้าที่สิบเวรประจำสำนักงาน ฝอ.๕ ตั้งแต่เวลา ๐๘.๓๐ น. ถึงเวลา ๐๘.๓๐ น. ของวันถัดไป ตามบัญชีตารางการปฏิบัติหน้าที่แนบท้ายคำสั่งนี้ (ผนวก ข) โดยให้ผู้ปฏิบัติหน้าที่ปฏิบัติตามระเบียบและข้อบังคับโดยเคร่งครัด';
    conclusion = 'ให้ผู้บังคับบัญชาตามลำดับชั้นกำกับดูแลและตรวจสอบการปฏิบัติหน้าที่อย่างสม่ำเสมอ\n\nทั้งนี้ ตั้งแต่วันที่ ๑ ตุลาคม ๒๕๖๙ เป็นต้นไป';
  }

  return {
    id: `DRAFT-${Date.now().toString().slice(-5)}`,
    documentType: template.docType,
    garudaPosition: template.garudaType,
    bookNumber: template.docType === 'คำสั่ง' 
      ? 'คำสั่ง บก.อก.บช.ตชด. ที่ ๕๘/๒๕๖๙' 
      : template.docType === 'หนังสือภายใน'
      ? 'ตชด ๐๐๒๑.๕/ '
      : 'ที่ ตชด ๐๐๒๑.๕/ ',
    issuedAt: template.docType === 'หนังสือภายใน'
      ? 'สำนักงานฝ่ายอำนวยการ ๕ กองบังคับการอำนวยการ โทร. ๐ ๒๒๗๙ ๙๕๒๐ ต่อ ๕๑๓'
      : 'กองบัญชาการตำรวจตระเวนชายแดน\nถนนพหลโยธิน เขตพญาไท กรุงเทพฯ ๑๐๔๐๐',
    date: dateStr,
    subject: subject,
    recipient: template.sampleRecipient,
    reference: vettedDoc?.reference && vettedDoc.reference !== '-' ? vettedDoc.reference : '',
    attachments: 'เอกสารและรายละเอียดประกอบ จำนวน ๑ ชุด',
    paragraphs: {
      intro,
      body: detail,
      conclusion,
    },
    closing: template.defaultClosing,
    signerName: '(พลตำรวจตรี สมชาย เกียรติเกรียงไกร)',
    signerPosition: template.defaultSignerPosition,
    departmentContact: {
      office: 'ฝ่ายอำนวยการ ๕ บก.อก.บช.ตชด. (กลุ่มงานสารบรรณ)',
      tel: 'โทร. ๐ ๒๒๗๙ ๙๕๒๐ ต่อ ๕๑๓',
      email: 'bpp_division5@police.go.th',
    },
    matchedDlaTemplate: template,
    matchedVettedDoc: vettedDoc,
    complianceScoreEstimate: 95,
    provider: 'local',
  };
}
