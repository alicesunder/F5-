import React, { useRef, useState } from 'react';
import { UploadedImage } from '../../types/slides';
import { Image, Upload, X, CheckCircle2, Sparkles, Trash2 } from 'lucide-react';

interface ImageUploaderProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onImagesChange,
  maxImages = 8,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Convert File to base64 DataURL
  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validImageFiles = fileArray.filter(f => f.type.startsWith('image/'));

    validImageFiles.forEach(file => {
      if (images.length >= maxImages) return;

      const reader = new FileReader();
      reader.onload = e => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          const newImg: UploadedImage = {
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            file,
            dataUrl,
            name: file.name,
            size: file.size,
          };
          onImagesChange([...images, newImg]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = (id: string) => {
    onImagesChange(images.filter(img => img.id !== id));
  };

  // Pre-bundled sample high-resolution official badges & illustrations for instant testing
  const addSampleImage = (type: 'badge' | 'ops' | 'volunteer') => {
    let sampleUrl = '';
    let name = '';

    if (type === 'badge') {
      name = 'ตราสัญลักษณ์_ตชด_ประจำหน่วย.svg';
      // Official Garuda / Emblem SVG as data URL
      sampleUrl = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="%2317324F" stroke="%23D4AF37" stroke-width="4"/><text x="50" y="44" font-size="12" font-family="Arial" fill="%23FFFFFF" text-anchor="middle" font-weight="bold">BPP FO.5</text><text x="50" y="60" font-size="8" font-family="Arial" fill="%23D4AF37" text-anchor="middle">ตชด. เพื่อประชาชน</text></svg>';
    } else if (type === 'ops') {
      name = 'ภาพปฏิบัติการกู้ภัย_ช่วยเหลืออุทกภัย.svg';
      sampleUrl = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 300 200"><rect width="300" height="200" fill="%231B3B2B"/><circle cx="150" cy="80" r="40" fill="%2310B981" opacity="0.3"/><text x="150" y="85" font-size="16" font-family="Arial" fill="%23FFFFFF" text-anchor="middle" font-weight="bold">ภารกิจช่วยเหลือผู้ประสบภัย</text><text x="150" y="115" font-size="11" font-family="Arial" fill="%23E2E8F0" text-anchor="middle">ชุดปฏิบัติการเคลื่อนที่เร็ว ตชด.</text></svg>';
    } else {
      name = 'ภาพกิจกรรมจิตอาสาพระราชทาน.svg';
      sampleUrl = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23881337"/><rect x="20" y="20" width="260" height="160" rx="10" fill="%23BE123C" opacity="0.4"/><text x="150" y="95" font-size="16" font-family="Arial" fill="%23FFFFFF" text-anchor="middle" font-weight="bold">จิตอาสาพัฒนาชุมชนชายแดน</text><text x="150" y="125" font-size="11" font-family="Arial" fill="%23FEE2E2" text-anchor="middle">เราทำความ ดี ด้วยหัวใจ</text></svg>';
    }

    const sampleImg: UploadedImage = {
      id: `sample-${Date.now()}-${type}`,
      dataUrl: sampleUrl,
      name,
      size: 45000,
    };
    onImagesChange([...images, sampleImg]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <Image className="w-4 h-4 text-[#27265B]" />
          <span>รูปภาพประกอบสไลด์ ({images.length}/{maxImages})</span>
        </label>
        <span className="text-xs text-slate-500">
          ระบบจะจัดสรรรูปภาพลงสไลด์ที่เหมาะสมโดยอัตโนมัติ
        </span>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={e => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-[#27265B] bg-[#27265B]/5 scale-[1.01]'
            : 'border-slate-300 hover:border-slate-400 bg-slate-50/70 hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-[#27265B]">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <span className="font-semibold text-sm text-slate-800">
              คลิกเพื่อเลือกรูปภาพ
            </span>{' '}
            <span className="text-sm text-slate-500">
              หรือลากไฟล์ภาพมาวางที่นี่
            </span>
          </div>
          <p className="text-xs text-slate-400">
            รองรับ PNG, JPG, WebP, SVG (สามารถอัพโหลดได้หลายรูปพร้อมกัน)
          </p>
        </div>
      </div>

      {/* Quick Sample Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" /> ตัวอย่างภาพทดสอบเร็ว:
        </span>
        <button
          type="button"
          onClick={() => addSampleImage('badge')}
          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
        >
          + ตราประจำหน่วย
        </button>
        <button
          type="button"
          onClick={() => addSampleImage('ops')}
          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition"
        >
          + ภารกิจกู้ภัยภาคสนาม
        </button>
        <button
          type="button"
          onClick={() => addSampleImage('volunteer')}
          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition"
        >
          + ภาพกิจกรรมจิตอาสา
        </button>
      </div>

      {/* Uploaded Images List */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="relative group bg-white rounded-xl border border-slate-200 p-2 shadow-xs overflow-hidden flex flex-col"
            >
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-slate-100 relative mb-2">
                <img
                  src={img.dataUrl}
                  alt={img.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  รูป #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    handleRemove(img.id);
                  }}
                  className="absolute top-1 right-1 w-6 h-6 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition shadow-xs"
                  title="ลบรูปนี้"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="text-[11px] font-medium text-slate-700 truncate" title={img.name}>
                {img.name}
              </div>
              <div className="text-[10px] text-slate-400">
                {Math.round(img.size / 1024)} KB
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
