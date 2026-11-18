import React from 'react';
import { X, Megaphone, Calendar, ArrowRight } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';

interface PublicRelationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublicRelationsModal: React.FC<PublicRelationsModalProps> = ({ isOpen, onClose }) => {
  const { navigate } = useAdmin();

  if (!isOpen) return null;

  const announcements = [
    {
      id: 'pr-01',
      date: '2569-09-08',
      category: 'ข่าวประชาสัมพันธ์',
      title: 'กำหนดการตรวจความพร้อมการปฏิบัติงานฝ่ายอำนวยการ ประจำปีงบประมาณ 2569',
      summary: 'ขอให้ทุกหน่วยงานในสังกัดเตรียมความพร้อมเอกสารและแผนปฏิบัติการเพื่อรับการตรวจประเมินผลสัมฤทธิ์ตามเกณฑ์มาตรฐาน',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      id: 'pr-02',
      date: '2569-09-05',
      category: 'ประกาศฝ่ายอำนวยการ',
      title: 'การใช้งานระบบปัญญาประดิษฐ์ (AI) ในการตรวจสอบความถูกต้องของเอกสารสารบรรณ',
      summary: 'ประกาศเริ่มใช้ระบบ AI Document Inspector ในการตรวจสอบฟอร์แมต คำผิด และระดับชั้นความลับก่อนการเสนอลงนามทุกฉบับ',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'pr-03',
      date: '2569-09-01',
      category: 'งานสวัสดิการและกำลังพล',
      title: 'แผนการฝึกอบรมพัฒนาทักษะดิจิทัลสำหรับข้าราชการและเจ้าหน้าที่ฝ่ายอำนวยการ',
      summary: 'เปิดรับสมัครผู้เข้าร่วมการอบรมเชิงปฏิบัติการด้านความมั่นคงปลอดภัยไซเบอร์และการบริหารจัดการข้อมูลสารสนเทศ',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Window */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white/95 backdrop-blur-2xl border border-white/90 shadow-2xl p-6 sm:p-8 text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between border-b border-slate-200/80 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                งานประชาสัมพันธ์ ฝอ.5
              </h3>
              <p className="text-xs text-slate-500">
                ข่าวสาร สารสนเทศ และประกาศทางการของฝ่ายอำนวยการ
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Announcement List */}
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
          {announcements.map(item => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200/70 hover:border-sky-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-medium ${item.badgeColor}`}>
                  {item.category}
                </span>
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {item.date}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-slate-900 tracking-tight">
                {item.title}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {item.summary}
              </p>
            </div>
          ))}
        </div>

        {/* Action Footer */}
        <div className="mt-5 pt-4 border-t border-slate-200/80 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">
            ศูนย์ข้อมูลข่าวสารงานอำนวยการ ฝอ.5
          </span>
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('documents');
            }}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-xs font-medium text-white flex items-center gap-1.5 transition shadow-xs"
          >
            <span>ดูคลังเอกสารและคำสั่งทั้งหมด</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
