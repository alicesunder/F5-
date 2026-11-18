import React, { useState } from 'react';
import { X, Plus, Clock, MapPin, Users, Shirt, ShieldCheck } from 'lucide-react';
import { BppMissionItem, BppMissionStatus, BppMissionCategory } from '../types';

interface BppAddMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMission: (mission: BppMissionItem) => void;
}

export const BppAddMissionModal: React.FC<BppAddMissionModalProps> = ({
  isOpen,
  onClose,
  onAddMission,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('25 ก.ค. 69');
  const [dayNumber, setDayNumber] = useState(25);
  const [time, setTime] = useState('09.00 น.');
  const [location, setLocation] = useState('ห้องประชุม ศปก.ตชด.');
  const [attendees, setAttendees] = useState('กำลังพล ฝอ.5 ทุกนาย');
  const [uniform, setUniform] = useState('เครื่องแบบกากีแขนยาว');
  const [responsible, setResponsible] = useState('จอส.');
  const [category, setCategory] = useState<BppMissionCategory>('จิตอาสา');
  const [status, setStatus] = useState<BppMissionStatus>('อยู่ระหว่างดำเนินการ');
  const [remarks, setRemarks] = useState('-');
  const [hasTitleError, setHasTitleError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setHasTitleError(true);
      return;
    }

    const newMission: BppMissionItem = {
      id: `m-${Date.now()}`,
      title: title.trim(),
      date: date.trim(),
      rawDate: '2026-07-25',
      dayNumber: Number(dayNumber) || 25,
      monthYear: 'กรกฎาคม 2569',
      time: time.trim() || 'ยังไม่ทราบ',
      location: location.trim() || '-',
      attendees: attendees.trim() || '-',
      uniform: uniform.trim() || 'เครื่องแบบกากีแขนยาว',
      responsible: responsible.trim() || 'จอส.',
      category,
      status,
      remarks: remarks.trim() || '-',
      createdAt: new Date().toISOString(),
    };

    onAddMission(newMission);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/25 backdrop-blur-[6px] animate-in fade-in duration-200">
      <div className="w-full max-w-lg liquid-glass-modal iridescent-edge rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] bpp-modal-box">
        {/* Header */}
        <div className="p-5 bg-white/40 border-b border-[rgba(40,35,50,0.07)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDE4F7] text-[#5B2A86] border border-[#5B2A86]/20 flex items-center justify-center shadow-2xs">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#2D2A32]">
                เพิ่มภารกิจใหม่ ฝอ.5
              </h3>
              <p className="text-xs text-[#5A5764]">
                บันทึกกำหนดการและรายละเอียดลงในตารางภารกิจ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8A8792] hover:text-[#2D2A32] hover:bg-white/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5">
          {/* Mission Details */}
          <div>
            <label className="block text-xs font-semibold text-[#2D2A32] mb-1">
              รายละเอียดภารกิจ *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (hasTitleError && e.target.value.trim()) setHasTitleError(false);
              }}
              placeholder="เช่น ประชุมเตรียมการจัดกิจกรรมจิตอาสาฯ"
              className={`w-full h-9.5 px-3 rounded-xl border bg-[#F7F7F9] text-xs text-[#2D2A32] placeholder:text-[#8A8792] focus:bg-white focus:outline-none transition ${
                hasTitleError
                  ? 'bpp-input-error border-rose-300 ring-1 ring-rose-300/50 bg-rose-50/20'
                  : 'border-[rgba(40,35,50,0.08)] focus:ring-1 focus:ring-[#5B2A86]'
              }`}
            />
            {hasTitleError && (
              <p className="text-[11px] text-rose-600 mt-1 animate-in fade-in duration-150">
                * กรุณาระบุรายละเอียดภารกิจ
              </p>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#2D2A32] mb-1">
                วันที่แสดง (เช่น 25 ก.ค. 69)
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  const num = parseInt(e.target.value, 10);
                  if (!isNaN(num)) setDayNumber(num);
                }}
                className="w-full h-9.5 px-3 rounded-xl border border-[rgba(40,35,50,0.08)] bg-[#F7F7F9] text-xs text-[#2D2A32] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5B2A86] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D2A32] mb-1">
                เวลา (เช่น 09.00 น.)
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-9.5 px-3 rounded-xl border border-[rgba(40,35,50,0.08)] bg-[#F7F7F9] text-xs text-[#2D2A32] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5B2A86] transition"
              />
            </div>
          </div>

          {/* Category & Responsible */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#2D2A32] mb-1">
                กลุ่มงาน / ฝ่าย
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BppMissionCategory)}
                className="w-full h-9.5 px-3 rounded-xl border border-[rgba(40,35,50,0.08)] bg-white text-xs text-[#2D2A32] focus:outline-none focus:ring-1 focus:ring-[#5B2A86]"
              >
                <option value="จิตอาสา">จิตอาสา (พระราชทาน)</option>
                <option value="สาธารณภัย">สาธารณภัย (กภ.)</option>
                <option value="มวลชนสัมพันธ์">มวลชนสัมพันธ์ (กมส.)</option>
                <option value="ประชาสัมพันธ์">ประชาสัมพันธ์ (กปส.)</option>
                <option value="อำนวยการ">อำนวยการ / ธุรการ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D2A32] mb-1">
                ผู้รับผิดชอบหลัก
              </label>
              <input
                type="text"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                className="w-full h-9.5 px-3 rounded-xl border border-[rgba(40,35,50,0.08)] bg-[#F7F7F9] text-xs text-[#2D2A32] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5B2A86] transition"
              />
            </div>
          </div>

          {/* Location & Uniform */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#2D2A32] mb-1">
                สถานที่ปฏิบัติการ
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-9.5 px-3 rounded-xl border border-[rgba(40,35,50,0.08)] bg-[#F7F7F9] text-xs text-[#2D2A32] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5B2A86] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D2A32] mb-1">
                การแต่งกาย
              </label>
              <input
                type="text"
                value={uniform}
                onChange={(e) => setUniform(e.target.value)}
                className="w-full h-9.5 px-3 rounded-xl border border-[rgba(40,35,50,0.08)] bg-[#F7F7F9] text-xs text-[#2D2A32] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5B2A86] transition"
              />
            </div>
          </div>

          {/* Attendees */}
          <div>
            <label className="block text-xs font-semibold text-[#2D2A32] mb-1">
              กำลังพล / ผู้เข้าร่วม
            </label>
            <input
              type="text"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              className="w-full h-9.5 px-3 rounded-xl border border-[rgba(40,35,50,0.08)] bg-[#F7F7F9] text-xs text-[#2D2A32] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5B2A86] transition"
            />
          </div>

          {/* Status & Remarks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#2D2A32] mb-1">
                สถานะแรกเริ่ม
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BppMissionStatus)}
                className="w-full h-9.5 px-3 rounded-xl border border-[rgba(40,35,50,0.08)] bg-white text-xs text-[#2D2A32] focus:outline-none focus:ring-1 focus:ring-[#5B2A86]"
              >
                <option value="อยู่ระหว่างดำเนินการ">อยู่ระหว่างดำเนินการ</option>
                <option value="รอดำเนินการ">รอดำเนินการ</option>
                <option value="ดำเนินการแล้ว">ดำเนินการแล้ว</option>
                <option value="ยังไม่กำหนด">ยังไม่กำหนด</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D2A32] mb-1">
                หมายเหตุ
              </label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="-"
                className="w-full h-9.5 px-3 rounded-xl border border-[rgba(40,35,50,0.08)] bg-[#F7F7F9] text-xs text-[#2D2A32] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5B2A86] transition"
              />
            </div>
          </div>

          {/* Modal Buttons */}
          <div className="pt-4 flex items-center justify-end gap-2 border-t border-[rgba(40,35,50,0.07)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#4A4852] hover:bg-[#F7F7F9] transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#5B2A86] hover:bg-[#4a226d] text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              บันทึกภารกิจ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BppAddMissionModal;
