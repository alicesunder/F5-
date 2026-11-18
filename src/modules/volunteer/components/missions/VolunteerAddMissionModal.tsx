import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, Shield, Users, Shirt, Phone, Check, Plus } from 'lucide-react';
import { useVolunteer } from '../../context/VolunteerContext';
import { VolunteerCategory } from '../../types/volunteerTypes';

export const VolunteerAddMissionModal: React.FC = () => {
  const {
    isAddMissionModalOpen,
    setIsAddMissionModalOpen,
    categories,
    units,
    addMission,
  } = useVolunteer();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('28 ก.ค. 2569');
  const [startTime, setStartTime] = useState('08:30');
  const [endTime, setEndTime] = useState('16:30');
  const [category, setCategory] = useState(categories[0]?.name || 'จิตอาสาพระราชทาน');
  const [unitId, setUnitId] = useState('unit-bok-ok');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('พญาไท');
  const [province, setProvince] = useState('กรุงเทพมหานคร');
  const [assignedCount, setAssignedCount] = useState(30);
  const [uniform, setUniform] = useState('เครื่องแบบจิตอาสาพระราชทาน (เสื้อเหลือง หมวก ผ้าพันคอพระราชทาน)');
  const [coordinatorName, setCoordinatorName] = useState('ธนาวุฒิ สร้อยสนธิ์');
  const [coordinatorRank, setCoordinatorRank] = useState('พ.ต.ต.');
  const [coordinatorPhone, setCoordinatorPhone] = useState('081-445-8921');
  const [description, setDescription] = useState('');
  const [objectiveInput, setObjectiveInput] = useState('');
  const [objectives, setObjectives] = useState<string[]>([
    'เพื่อประโยชน์สุขของประชาชนและความมั่นคงของสังคม',
  ]);

  if (!isAddMissionModalOpen) return null;

  const handleAddObjective = () => {
    if (objectiveInput.trim()) {
      setObjectives(prev => [...prev, objectiveInput.trim()]);
      setObjectiveInput('');
    }
  };

  const handleRemoveObjective = (idx: number) => {
    setObjectives(prev => prev.filter((_, i) => i !== idx));
  };

  const selectedUnitNode =
    units[0]?.children?.find(u => u.id === unitId) ||
    units[0]?.children?.flatMap(c => c.children || []).find(u => u.id === unitId) ||
    units[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addMission({
      title: title.trim(),
      date,
      startTime,
      endTime,
      category,
      unitId,
      unitName: selectedUnitNode ? selectedUnitNode.name : 'บก.อก.บช.ตชด.',
      location: location || 'พื้นที่รับผิดชอบ บช.ตชด.',
      district,
      province,
      assignedPersonnelCount: Number(assignedCount) || 20,
      uniform,
      coordinatorName,
      coordinatorRank,
      coordinatorPhone,
      description: description || 'ดำเนินภารกิจจิตอาสาตามนโยบายกองบัญชาการตำรวจตระเวนชายแดน',
      objectives,
      status: 'PLANNING',
    });

    setIsAddMissionModalOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAddMissionModalOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[rgba(66,167,122,0.3)] overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#EAF7F0] via-white to-[#EAF7F0] border-b border-[rgba(66,167,122,0.2)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#42A77A] text-white flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#25202B]">
                  สร้างภารกิจจิตอาสาใหม่ (New Mission Assignment)
                </h3>
                <p className="text-[11px] text-[#6B6973]">
                  กำหนดแผน มอบหมายหน่วย และระบุกำลังพลตามมาตรฐาน ฝอ.๕
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAddMissionModalOpen(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-[#6B6973] hover:text-[#25202B]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[78vh] overflow-y-auto text-xs">
            {/* Mission Title */}
            <div>
              <label className="block font-semibold text-[#25202B] mb-1">
                ชื่อภารกิจ / กิจกรรมจิตอาสา <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="เช่น กิจกรรมจิตอาสาบำเพ็ญสาธารณประโยชน์เนื่องในโอกาสวันสำคัญ"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[rgba(66,167,122,0.3)] focus:outline-none focus:ring-2 focus:ring-[#42A77A]/30 focus:border-[#42A77A]"
              />
            </div>

            {/* Category & Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#25202B] mb-1">ประเภทกิจกรรมจิตอาสา</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(66,167,122,0.3)] focus:outline-none focus:ring-2 focus:ring-[#42A77A]/30"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#25202B] mb-1">หน่วยปฏิบัติที่รับมอบหมาย</label>
                <select
                  value={unitId}
                  onChange={e => setUnitId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(66,167,122,0.3)] focus:outline-none focus:ring-2 focus:ring-[#42A77A]/30"
                >
                  <option value="unit-bok-ok">บก.อก.บช.ตชด.</option>
                  <option value="unit-bok-1">บก.ตชด.ภาค 1</option>
                  <option value="unit-kok-11">กก.ตชด.11 (จันทบุรี)</option>
                  <option value="unit-kok-13">กก.ตชด.13 (กาญจนบุรี)</option>
                  <option value="unit-bok-2">บก.ตชด.ภาค 2 (ขอนแก่น)</option>
                  <option value="unit-bok-3">บก.ตชด.ภาค 3 (เชียงใหม่)</option>
                  <option value="unit-bok-4">บก.ตชด.ภาค 4 (สงขลา)</option>
                </select>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-[#25202B] mb-1">วันที่ปฏิบัติภารกิจ</label>
                <input
                  type="text"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  placeholder="เช่น 28 ก.ค. 2569"
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(66,167,122,0.3)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#25202B] mb-1">เวลาเริ่ม</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(66,167,122,0.3)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#25202B] mb-1">เวลาสิ้นสุด</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(66,167,122,0.3)]"
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block font-semibold text-[#25202B] mb-1">สถานที่เจาะจง</label>
                <input
                  type="text"
                  placeholder="เช่น ลานพระบรมราชานุสาวรีย์"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(66,167,122,0.3)]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#25202B] mb-1">อำเภอ/เขต</label>
                <input
                  type="text"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(66,167,122,0.3)]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#25202B] mb-1">จังหวัด</label>
                <input
                  type="text"
                  value={province}
                  onChange={e => setProvince(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(66,167,122,0.3)]"
                />
              </div>
            </div>

            {/* Personnel & Uniform */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#25202B] mb-1">จำนวนกำลังพลที่จัดส่ง (นาย)</label>
                <input
                  type="number"
                  min="1"
                  value={assignedCount}
                  onChange={e => setAssignedCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(66,167,122,0.3)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#25202B] mb-1">การแต่งกาย / เครื่องแบบ</label>
                <input
                  type="text"
                  value={uniform}
                  onChange={e => setUniform(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(66,167,122,0.3)]"
                />
              </div>
            </div>

            {/* Coordinator */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-[#25202B] mb-1">ยศผู้ประสานงาน</label>
                <input
                  type="text"
                  value={coordinatorRank}
                  onChange={e => setCoordinatorRank(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(66,167,122,0.3)]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#25202B] mb-1">ชื่อ-สกุล ผู้ประสานงาน</label>
                <input
                  type="text"
                  value={coordinatorName}
                  onChange={e => setCoordinatorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(66,167,122,0.3)]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#25202B] mb-1">เบอร์โทรศัพท์ติดต่อ</label>
                <input
                  type="text"
                  value={coordinatorPhone}
                  onChange={e => setCoordinatorPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(66,167,122,0.3)]"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold text-[#25202B] mb-1">รายละเอียดภารกิจโดยย่อ</label>
              <textarea
                rows={2}
                placeholder="ระบุขอบเขตการปฏิบัติงาน เป้าหมาย และการประสานงานในพื้นที่..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[rgba(66,167,122,0.3)]"
              />
            </div>

            {/* Objectives list */}
            <div>
              <label className="block font-semibold text-[#25202B] mb-1">เป้าหมายและผลสัมฤทธิ์ที่คาดหวัง</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="เพิ่มเป้าหมาย เช่น แจกจ่ายอาหาร 500 กล่อง..."
                  value={objectiveInput}
                  onChange={e => setObjectiveInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddObjective();
                    }
                  }}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-[rgba(66,167,122,0.3)]"
                />
                <button
                  type="button"
                  onClick={handleAddObjective}
                  className="px-3 py-1.5 rounded-xl bg-[#EAF7F0] text-[#2F8A63] font-semibold hover:bg-[#42A77A] hover:text-white transition-colors"
                >
                  เพิ่ม
                </button>
              </div>

              <div className="space-y-1">
                {objectives.map((obj, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-1.5 px-2.5 rounded-lg bg-[#F9FBF9] border border-gray-200 text-xs"
                  >
                    <span>• {obj}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveObjective(i)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddMissionModalOpen(false)}
                className="px-4 py-2 rounded-xl text-[#6B6973] hover:bg-gray-100 transition-colors font-medium"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#42A77A] text-white font-semibold hover:bg-[#389169] transition-all shadow-md shadow-[#42A77A]/20 cursor-pointer"
              >
                บันทึกและส่งมอบหมาย
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
