/**
 * Real client-side file downloader utility
 * Generates and triggers actual browser downloads for reports, media, and attachments
 */
export const downloadFile = (filename: string, content?: string | Blob, mimeType: string = 'application/octet-stream') => {
  let blob: Blob;

  if (content instanceof Blob) {
    blob = content;
  } else if (typeof content === 'string') {
    blob = new Blob([content], { type: mimeType });
  } else {
    // Default simulated official document format content
    const sampleDocContent = `=======================================================
ระบบศูนย์กลางบริหารงานหน่วยงาน
เอกสารราชการ: ${filename}
วันที่ดาวน์โหลด: ${new Date().toLocaleString('th-TH')}
ความมั่นคง: เอกสารสำหรับใช้งานภายในหน่วยงาน (Internal Official Use Only)
=======================================================
เนื้อหาเอกสารได้รับการรับรองความถูกต้องจากระบบสารบรรณกลาง
`;
    blob = new Blob([sampleDocContent], { type: 'text/plain;charset=utf-8' });
  }

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => window.URL.revokeObjectURL(url), 1000);
};
