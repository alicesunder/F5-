import React from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Shirt,
  ShieldCheck,
  Printer,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import { BppMissionItem, BppMissionStatus } from '../types';

interface BppMissionDetailModalProps {
  mission: BppMissionItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: BppMissionStatus) => void;
}

export const BppMissionDetailModal: React.FC<BppMissionDetailModalProps> = ({
  mission,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  if (!isOpen || !mission) return null;

  const statuses: BppMissionStatus[] = [
    'ดำเนินการแล้ว',
    'อยู่ระหว่างดำเนินการ',
    'รอดำเนินการ',
    'ยังไม่กำหนด',
  ];

  // Lifecycle Timeline Steps conforming to Section 18
  const timelineSteps = [
    { title: 'สร้างรายการ', desc: 'ลงทะเบียนในระบบ', completed: true },
    {
      title: 'มอบหมาย',
      desc: mission.responsible || 'มอบหมายแล้ว',
      completed: !!mission.responsible && mission.responsible !== '-',
    },
    {
      title: 'เตรียมการ',
      desc: mission.location !== '-' ? 'กำหนดสถานที่แล้ว' : 'รอข้อมูล',
      completed: mission.status !== 'ยังไม่กำหนด',
    },
    {
      title: 'ดำเนินการ',
      desc: mission.status === 'อยู่ระหว่างดำเนินการ' || mission.status === 'ดำเนินการแล้ว' ? 'กำลังปฏิบัติ' : 'รอเริ่มภารกิจ',
      completed: mission.status === 'อยู่ระหว่างดำเนินการ' || mission.status === 'ดำเนินการแล้ว',
      current: mission.status === 'อยู่ระหว่างดำเนินการ',
    },
    {
      title: 'เสร็จสิ้น',
      desc: mission.status === 'ดำเนินการแล้ว' ? 'สำเร็จเรียบร้อย' : 'รอสรุปผล',
      completed: mission.status === 'ดำเนินการแล้ว',
    },
  ];

  const handlePrintSlip = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>ใบสั่งการ / รายละเอียดภารกิจ ฝอ.5 - ${mission.title}</title>
          <style>
            body { font-family: sans-serif; padding: 32px; color: #2D2A32; }
            .header { border-bottom: 2px solid #5B2A86; padding-bottom: 12px; margin-bottom: 20px; }
            .title { font-size: 18px; font-weight: bold; color: #5B2A86; }
            .subtitle { font-size: 13px; color: #5A5764; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { border: 1px solid #E5E7EB; padding: 10px 14px; text-align: left; font-size: 13px; }
            th { background-color: #F7F7F9; color: #2D2A32; font-weight: bold; width: 28%; }
            .footer { margin-top: 40px; display: flex; justify-content: space-between; font-size: 13px; }
            .signature { margin-top: 50px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">ฝ่ายอำนวยการ 5 กองบังคับการอำนวยการ กองบัญชาการตำรวจตระเวนชายแดน</div>
            <div class="subtitle">ใบสั่งการและรายละเอียดภารกิจประจำเดือน (รหัส: ${mission.id})</div>
          </div>
          <table>
            <tr><th>รายละเอียดภารกิจ</th><td><strong>${mission.title}</strong></td></tr>
            <tr><th>ประเภทกลุ่มงาน</th><td>${mission.category || 'ภารกิจทั่วไป'}</td></tr>
            <tr><th>วันที่ปฏิบัติหน้าที่</th><td>${mission.date}</td></tr>
            <tr><th>เวลา</th><td>${mission.time}</td></tr>
            <tr><th>สถานที่ปฏิบัติการ</th><td>${mission.location}</td></tr>
            <tr><th>กำลังพล / ผู้เข้าร่วม</th><td>${mission.attendees}</td></tr>
            <tr><th>การแต่งกาย</th><td>${mission.uniform}</td></tr>
            <tr><th>ผู้รับผิดชอบ</th><td>${mission.responsible}</td></tr>
            <tr><th>สถานะปัจจุบัน</th><td>${mission.status}</td></tr>
            <tr><th>หมายเหตุ</th><td>${mission.remarks || '-'}</td></tr>
          </table>
          <div class="footer">
            <div>พิมพ์เมื่อ: ${new Date().toLocaleString('th-TH')}</div>
            <div class="signature">
              <div>................................................................</div>
              <div style="margin-top: 4px;">เจ้าหน้าที่ผู้บันทึก / ผู้สั่งการ</div>
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/25 backdrop-blur-[6px] animate-in fade-in duration-200">
      {/* Background Click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Right-Side Mission Detail Panel (Item 10: 350ms slide-in, physical glass feel) */}
      <div className="relative z-10 w-full max-w-xl h-full liquid-glass-modal iridescent-edge border-l border-white/60 shadow-2xl overflow-hidden flex flex-col bpp-panel-slide">
        {/* Modal Header */}
        <div className="p-5 bg-white/50 border-b border-[rgba(40,35,50,0.07)] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#EDE4F7] text-[#5B2A86] border border-[#5B2A86]/20 flex items-center justify-center shadow-2xs">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#EDE4F7] text-[#5B2A86] border border-[#5B2A86]/15">
                  {mission.category || 'ภารกิจ ฝอ.5'}
                </span>
                <span className="text-xs text-[#8A8792] font-mono">
                  รหัส: {mission.id}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[#2D2A32] leading-tight mt-0.5">
                รายละเอียดและสถานะภารกิจ
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8A8792] hover:text-[#2D2A32] hover:bg-white/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Mission Title */}
          <div>
            <div className="text-xs font-semibold text-[#8A8792] uppercase tracking-wider mb-1">
              หัวข้อ / รายละเอียดภารกิจ
            </div>
            <h4 className="text-base sm:text-lg font-bold text-[#2D2A32] leading-snug">
              {mission.title}
            </h4>
          </div>

          {/* Lifecycle Timeline */}
          <div className="p-4 rounded-xl bg-[#F7F7F9] border border-[rgba(40,35,50,0.07)]">
            <div className="text-xs font-bold text-[#2D2A32] mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#5B2A86]" />
              ลำดับขั้นตอนการปฏิบัติ (Lifecycle Timeline)
            </div>
            <div className="grid grid-cols-5 gap-1 text-center relative">
              {timelineSteps.map((step, idx) => (
                <div key={step.title} className="flex flex-col items-center relative">
                  {/* Step node */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step.completed
                        ? 'bg-[#5B2A86] text-white'
                        : step.current
                        ? 'bg-[#D97706] text-white ring-2 ring-amber-200'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {step.completed ? '✓' : idx + 1}
                  </div>
                  <div className="text-[11px] font-bold text-[#2D2A32] mt-1.5 leading-tight">
                    {step.title}
                  </div>
                  <div className="text-[10px] text-[#8A8792] mt-0.5 leading-tight line-clamp-1">
                    {step.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-white border border-[rgba(40,35,50,0.07)]">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#EDE4F7] text-[#5B2A86] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[11px] text-[#8A8792] block font-medium">วันที่ปฏิบัติภารกิจ</span>
                <span className="text-xs font-bold text-[#2D2A32]">{mission.date}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#EDE4F7] text-[#5B2A86] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[11px] text-[#8A8792] block font-medium">เวลา</span>
                <span className="text-xs font-bold text-[#2D2A32]">{mission.time}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#059669] flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[11px] text-[#8A8792] block font-medium">สถานที่</span>
                <span className="text-xs font-bold text-[#2D2A32]">{mission.location}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#EDE4F7] text-[#5B2A86] flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[11px] text-[#8A8792] block font-medium">ผู้รับผิดชอบ</span>
                <span className="text-xs font-bold text-[#2D2A32]">{mission.responsible}</span>
              </div>
            </div>
          </div>

          {/* Attendees & Uniform Details */}
          <div className="space-y-2.5">
            <div className="p-3.5 rounded-xl bg-[#F7F7F9] border border-[rgba(40,35,50,0.06)]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2D2A32] mb-1">
                <Users className="w-3.5 h-3.5 text-[#5B2A86]" />
                <span>ผู้เข้าร่วมภารกิจ / กำลังพล:</span>
              </div>
              <p className="text-xs text-[#4A4852] pl-5.5 leading-relaxed">
                {mission.attendees}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F7F9] border border-[rgba(40,35,50,0.06)]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2D2A32] mb-1">
                <Shirt className="w-3.5 h-3.5 text-[#5B2A86]" />
                <span>การแต่งกาย:</span>
              </div>
              <p className="text-xs text-[#4A4852] pl-5.5 leading-relaxed">
                {mission.uniform}
              </p>
            </div>

            {mission.remarks && mission.remarks !== '-' && (
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-0.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>หมายเหตุ:</span>
                </div>
                <p className="text-xs text-amber-800 pl-5.5">
                  {mission.remarks}
                </p>
              </div>
            )}
          </div>

          {/* Interactive Status Switcher */}
          <div className="p-3.5 rounded-xl bg-[#F7F7F9] border border-[rgba(40,35,50,0.06)]">
            <span className="text-xs font-bold text-[#2D2A32] block mb-2">
              ปรับเปลี่ยนสถานะการปฏิบัติ:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {statuses.map((st) => (
                <button
                  key={st}
                  onClick={() => onUpdateStatus(mission.id, st)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition cursor-pointer text-center ${
                    mission.status === st
                      ? 'bg-[#5B2A86] text-white shadow-xs font-bold'
                      : 'bg-white text-[#4A4852] border border-[rgba(40,35,50,0.08)] hover:bg-[#EDE4F7]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white/40 border-t border-[rgba(40,35,50,0.07)] flex items-center justify-between">
          <button
            onClick={handlePrintSlip}
            className="px-3.5 py-2 rounded-xl border border-[rgba(40,35,50,0.1)] bg-white/90 hover:bg-white text-xs font-semibold text-[#2D2A32] flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#8A8792]" />
            <span>พิมพ์ใบสั่งการภารกิจ</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#5B2A86] text-white hover:bg-[#471f69] transition text-xs font-bold cursor-pointer shadow-xs"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};

export default BppMissionDetailModal;
