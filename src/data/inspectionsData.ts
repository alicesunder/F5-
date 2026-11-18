import { DocumentInspection, InspectionChecklistItem } from '../types';

export const standard16ChecklistTemplate: { key: string; label: string }[] = [
  { key: 'org_name', label: '1. ชื่อหน่วยงาน' },
  { key: 'doc_number', label: '2. เลขที่หนังสือ' },
  { key: 'doc_date', label: '3. วันที่' },
  { key: 'subject', label: '4. เรื่อง' },
  { key: 'recipient', label: '5. เรียน' },
  { key: 'enclosures', label: '6. สิ่งที่ส่งมาด้วย' },
  { key: 'content', label: '7. เนื้อหา' },
  { key: 'reference', label: '8. ข้อความอ้างถึง' },
  { key: 'signer', label: '9. ผู้ลงนาม' },
  { key: 'signer_position', label: '10. ตำแหน่งผู้ลงนาม' },
  { key: 'department', label: '11. ส่วนราชการเจ้าของเรื่อง' },
  { key: 'contact_phone', label: '12. เบอร์ติดต่อ' },
  { key: 'page_count', label: '13. จำนวนหน้า' },
  { key: 'attachments', label: '14. เอกสารแนบ' },
  { key: 'doc_format', label: '15. รูปแบบเอกสาร' },
  { key: 'data_completeness', label: '16. ความครบถ้วนของข้อมูล' },
];

export const initialInspections: DocumentInspection[] = [];
