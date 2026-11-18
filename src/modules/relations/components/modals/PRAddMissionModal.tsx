import React, { useState, useEffect } from 'react';
import {
  X,
  Camera,
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  Layers,
  Sparkles,
} from 'lucide-react';
import { usePRIntel } from '../../context/PRIntelContext';
import {
  MissionCategory,
  MissionPriority,
  MissionStatus,
  PhotoMission,
} from '../../types/bppTypes';

export const PRAddMissionModal: React.FC = () => {
  const {
    isAddMissionOpen,
    setIsAddMissionOpen,
    prefilledMissionData,
    setPrefilledMissionData,
    personnel,
    locations,
    addMission,
  } = usePRIntel();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MissionCategory>('จิตอาสาพระราชทาน');
  const [priority, setPriority] = useState<MissionPriority>('high');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('12:00');
  const [locationName, setLocationName] = useState('');
  const [province, setProvince] = useState('');
  const [personnelId, setPersonnelId] = useState(personnel[0]?.id || 'pers-1');
  const [teamCount, setTeamCount] = useState(2);
  const [deliverablesRequired, setDeliverablesRequired] = useState(50);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (prefilledMissionData) {
      if (prefilledMissionData.title) setTitle(prefilledMissionData.title);
      if (prefilledMissionData.description) setDescription(prefilledMissionData.description);
      if (prefilledMissionData.category) setCategory(prefilledMissionData.category);
      if (prefilledMissionData.priority) setPriority(prefilledMissionData.priority);
      if (prefilledMissionData.location) setLocationName(prefilledMissionData.location);
      if (prefilledMissionData.province) setProvince(prefilledMissionData.province);
    }
  }, [prefilledMissionData]);

  if (!isAddMissionOpen) return null;

  const handleClose = () => {
    setIsAddMissionOpen(false);
    setPrefilledMissionData(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedPerson = personnel.find((p) => p.id === personnelId) || personnel[0];

    const newMission: Omit<PhotoMission, 'id'> = {
      title,
      description: description || `ภารกิจบันทึกภาพ ${title} เพื่อใช้เป็นคลังภาพประชาสัมพันธ์ ฝอ.5 บช.ตชด.`,
      date,
      displayDate: `${parseInt(date.split('-')[2])} ก.ย. 69`,
      startTime,
      endTime,
      location: locationName,
      province,
      gpsCoordinates: '13.7854, 100.5482',
      personnelId: assignedPerson.id,
      personnelName: assignedPerson.name,
      personnelRank: assignedPerson.rank,
      teamCount: Number(teamCount),
      category,
      priority,
      status: 'pending',
      notes,
      deliverablesRequired: Number(deliverablesRequired),
      deliverablesDelivered: 0,
      deliverablesPhotos: [],
      timeline: [
        { time: startTime, activity: 'จัดเตรียมอุปกรณ์และตรวจเช็คสัญญาณกล้อง', completed: false },
        { time: `${parseInt(startTime.split(':')[0]) + 1}:00`, activity: 'เริ่มบันทึกภาพปฏิบัติการ', completed: false },
        { time: endTime, activity: 'สรุปและอัปโหลดไฟล์ภาพชุดแรก', completed: false },
      ],
      relatedPostId: prefilledMissionData?.relatedPostId,
      relatedPostTitle: prefilledMissionData?.relatedPostTitle,
    };

    addMission(newMission);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-pink-50 text-pink-700 border border-pink-200">
              <Camera className="w-5 h-5 text-[#27265B]" />
            </span>
            <div>
              <h2 className="text-base font-black text-[#1E1B4B]">
                ลงทะเบียนมอบหมายภารกิจภาพถ่าย (New Mission)
              </h2>
              <p className="text-xs text-slate-500">
                สั่งการชุดปฏิบัติการบันทึกภาพ กำหนดเป้าหมายส่งมอบ และติดตามสถานะ
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Mission Title */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              ชื่อภารกิจภาพถ่าย <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น บันทึกภาพพิธีเปิดศูนย์การเรียนตำรวจตระเวนชายแดน..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500 text-xs text-slate-800"
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">หมวดหมู่ภารกิจ</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MissionCategory)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500 text-xs text-slate-800 bg-white"
              >
                <option value="พิธีการและต้อนรับ">พิธีการและต้อนรับ</option>
                <option value="ตรวจเยี่ยมหน่วย">ตรวจเยี่ยมหน่วย</option>
                <option value="จิตอาสาพระราชทาน">จิตอาสาพระราชทาน</option>
                <option value="ช่วยเหลือผู้ประสบภัย">ช่วยเหลือผู้ประสบภัย</option>
                <option value="กิจกรรมโรงเรียน ตชด.">กิจกรรมโรงเรียน ตชด.</option>
                <option value="ลาดตระเวนชายแดน">ลาดตระเวนชายแดน</option>
                <option value="แถลงข่าวและประชาสัมพันธ์">แถลงข่าวและประชาสัมพันธ์</option>
                <option value="ฝึกอบรมและสัมมนา">ฝึกอบรมและสัมมนา</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">ระดับความสำคัญ</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as MissionPriority)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500 text-xs text-slate-800 bg-white"
              >
                <option value="urgent">เร่งด่วนที่สุด (Urgent)</option>
                <option value="high">สูง (High)</option>
                <option value="medium">ปานกลาง (Medium)</option>
                <option value="low">ปกติ (Low)</option>
              </select>
            </div>
          </div>

          {/* Date & Times */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">วันที่ปฏิบัติงาน</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">เวลาเริ่ม</label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="09:00"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">เวลาสิ้นสุด</label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="12:00"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500 text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Location & Province */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">สถานที่ปฏิบัติงาน</label>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="เช่น โรงเรียน ตชด. บ้านทุ่งสบาย"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">จังหวัด</label>
              <input
                type="text"
                required
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="เช่น จันทบุรี, กาญจนบุรี, กรุงเทพฯ"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500 text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Personnel Assignment & Team Count */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">
                ผู้ควบคุมชุดปฏิบัติการบันทึกภาพ
              </label>
              <select
                value={personnelId}
                onChange={(e) => setPersonnelId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500 text-xs text-slate-800 bg-white"
              >
                {personnel.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.rank} {p.name} ({p.position} - {p.unit})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">กำลังพล (นาย)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={teamCount}
                onChange={(e) => setTeamCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500 text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Deliverables Required */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              เป้าหมายจำนวนภาพส่งมอบ (Deliverables Required)
            </label>
            <input
              type="number"
              min="10"
              max="500"
              value={deliverablesRequired}
              onChange={(e) => setDeliverablesRequired(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500 text-xs text-slate-800"
            />
          </div>

          {/* Notes / Special Instructions */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              คำสั่งการพิเศษ / รายละเอียดการจัดส่งภาพด่วน
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="เช่น บินโดรนถ่ายภาพมุมสูง และส่งภาพชุดด่วน 10 ภาพแรกภายใน 11:30 น."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500 text-xs text-slate-800"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#27265B] hover:bg-[#1E1B4B] text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>บันทึกมอบหมายภารกิจ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
