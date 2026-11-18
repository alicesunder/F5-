/**
 * Google Drive Integration Service (driveService)
 * Meets requirement BF: Ready for Google Drive connection
 * Supports: listFiles, getFile, uploadFile, deleteFile, searchFiles
 * Security: NO hardcoded credentials or secrets in frontend
 */

export interface DriveDocument {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  extension: 'pdf' | 'docx' | 'xlsx' | 'jpg' | 'png' | 'other';
  webViewLink?: string;
  downloadUrl?: string;
  department: 'admin' | 'relations' | 'disaster' | 'volunteer';
  updatedAt: string;
  owner: string;
}

class DriveService {
  private initialDocs: DriveDocument[] = [
    {
      id: 'GDRV-001',
      name: 'แผนการดำเนินงาน ฝอ.5 ปี 2569.pdf',
      mimeType: 'application/pdf',
      size: '2.4 MB',
      extension: 'pdf',
      department: 'admin',
      updatedAt: '2026-09-10',
      owner: 'พ.อ. วรพงษ์ ทรัพย์อนันต์',
    },
    {
      id: 'GDRV-002',
      name: 'สรุปรายงานการประชุมประจำเดือน ก.ย. 2569.docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size: '1.2 MB',
      extension: 'docx',
      department: 'admin',
      updatedAt: '2026-09-09',
      owner: 'ฝ่ายอำนวยการ ฝอ.5',
    },
    {
      id: 'GDRV-003',
      name: 'คู่มือการปฏิบัติงานเฝ้าระวังอุทกภัยและสาธารณภัย.pdf',
      mimeType: 'application/pdf',
      size: '4.8 MB',
      extension: 'pdf',
      department: 'disaster',
      updatedAt: '2026-09-08',
      owner: 'พ.ท. ธนากร ภักดีชน',
    },
    {
      id: 'GDRV-004',
      name: 'ชุดภาพข่าวและสื่อประชาสัมพันธ์กิจกรรมวันตำรวจ.zip',
      mimeType: 'application/zip',
      size: '18.5 MB',
      extension: 'other',
      department: 'relations',
      updatedAt: '2026-09-07',
      owner: 'ทีมงานประชาสัมพันธ์',
    },
    {
      id: 'GDRV-005',
      name: 'คู่มือจิตอาสาพระราชทานและการลงพื้นที่ชุมชน.pdf',
      mimeType: 'application/pdf',
      size: '3.1 MB',
      extension: 'pdf',
      department: 'volunteer',
      updatedAt: '2026-09-05',
      owner: 'พ.ต. รัฐพงษ์ กิตติสาร',
    },
  ];

  private docs: DriveDocument[] = [...this.initialDocs];

  public async listFiles(department?: string): Promise<DriveDocument[]> {
    if (department && department !== 'all') {
      return this.docs.filter(d => d.department === department);
    }
    return [...this.docs];
  }

  public async getFile(id: string): Promise<DriveDocument | null> {
    return this.docs.find(d => d.id === id) || null;
  }

  public async uploadFile(
    file: File,
    department: 'admin' | 'relations' | 'disaster' | 'volunteer',
    ownerName: string = 'เจ้าหน้าที่ ฝอ.5'
  ): Promise<DriveDocument> {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const cleanExt: DriveDocument['extension'] = 
      ext === 'pdf' ? 'pdf' : ext === 'docx' || ext === 'doc' ? 'docx' : ext === 'xlsx' || ext === 'xls' ? 'xlsx' : ext === 'jpg' || ext === 'jpeg' ? 'jpg' : ext === 'png' ? 'png' : 'other';

    const newDoc: DriveDocument = {
      id: `GDRV-${Date.now().toString(36).toUpperCase()}`,
      name: file.name,
      mimeType: file.type || 'application/octet-stream',
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      extension: cleanExt,
      department,
      updatedAt: new Date().toISOString().slice(0, 10),
      owner: ownerName,
    };

    this.docs.unshift(newDoc);
    return newDoc;
  }

  public async deleteFile(id: string): Promise<boolean> {
    const prevLen = this.docs.length;
    this.docs = this.docs.filter(d => d.id !== id);
    return this.docs.length < prevLen;
  }

  public async searchFiles(query: string): Promise<DriveDocument[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [...this.docs];
    return this.docs.filter(
      d => d.name.toLowerCase().includes(q) || d.owner.toLowerCase().includes(q)
    );
  }
}

export const driveService = new DriveService();
