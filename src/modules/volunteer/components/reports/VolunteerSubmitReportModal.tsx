import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, Upload, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { useVolunteer } from '../../context/VolunteerContext';

export const VolunteerSubmitReportModal: React.FC = () => {
  const {
    isSubmitReportModalOpen,
    setIsSubmitReportModalOpen,
    selectedMission,
    missions,
    submitReport,
  } = useVolunteer();

  const [missionId, setMissionId] = useState(selectedMission?.id || '');
  const [outcomeSummary, setOutcomeSummary] = useState('');
  const [actualPersonnel, setActualPersonnel] = useState(selectedMission?.assignedPersonnelCount || 25);
  const [beneficiaries, setBeneficiaries] = useState(150);
  const [executionTime, setExecutionTime] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterRank, setReporterRank] = useState('');
  const [reporterPosition, setReporterPosition] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [achievementInput, setAchievementInput] = useState('');
  const [achievements, setAchievements] = useState<string[]>(['']);
  const [problemsInput, setProblemsInput] = useState('');
  const [problems, setProblems] = useState<string[]>(['']);

  useEffect(() => {
    if (selectedMission) {
      setMissionId(selectedMission.id);
      setActualPersonnel(selectedMission.assignedPersonnelCount);
    } else if (missions.length > 0 && !missionId) {
      setMissionId(missions[0].id);
    }
  }, [selectedMission, missions]);

  if (!isSubmitReportModalOpen) return null;

  const targetMission = missions.find(m => m.id === missionId) || missions[0];

  const handleAddAchievement = () => {
    if (achievementInput.trim()) {
      setAchievements(prev => [...prev, achievementInput.trim()]);
      setAchievementInput('');
    }
  };

  const handleAddProblem = () => {
    if (problemsInput.trim()) {
      setProblems(prev => [...prev, problemsInput.trim()]);
      setProblemsInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetMission) return;

    submitReport({
      missionId: targetMission.id,
      missionCode: targetMission.code,
      missionTitle: targetMission.title,
      unitId: targetMission.unitId,
      unitName: targetMission.unitName,
      reporterName,
      reporterRank,
      reporterPosition,
      reporterPhone,
      outcomeSummary: outcomeSummary || 'การปฏิบัติงานด้านจิตอาสาเสร็จสิ้นสมบูรณ์ตามเป้าหมายของหน่วย',
      actualPersonnelCount: Number(actualPersonnel) || 20,
      participantBeneficiariesCount: Number(beneficiaries) || 100,
      location: targetMission.location,
      executionTime,
      keyAchievements: achievements,
      problemsAndObstacles: problems,
      photos: [
        {
          id: `p-${Date.now()}`,
          url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
          caption: 'กำลังพลจิตอาสาบันทึกภาพร่วมกันหลังเสร็จสิ้นภารกิจ',
          timestamp: '16:00 น.',
        },
      ],
      documents: [
        {
          id: `d-${Date.now()}`,
          name: `รายงานสรุปผลการปฏิบัติ_${targetMission.code}.pdf`,
          size: '1.6 MB',
          type: 'application/pdf',
          url: '#',
        },
      ],
    });

    setIsSubmitReportModalOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSubmitReportModalOpen(false)}
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
              <div className="w-8 h-8 rounded-xl bg-[#2583D8] text-white flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#25202B]">
                  ส่งรายงานผลการปฏิบัติการจิตอาสา (แบบ จอ.๐๑)
                </h3>
                <p className="text-[11px] text-[#6B6973]">
                  รายงานผลการปฏิบัติ กำลังพล ประชาชนที่ได้รับประโยชน์ และภาพเชิงประจักษ์
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsSubmitReportModalOpen(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-[#6B6973] hover:text-[#25202B]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
            {/* Target Mission Selector */}
            <div>
              <label className="block font-semibold text-[#25202B] mb-1">เลือกภารกิจที่ต้องการรายงาน</label>
              <select
                value={missionId}
                onChange={e => setMissionId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[rgba(66,167,122,0.3)] bg-white text-[#25202B] focus:outline-none focus:ring-2 focus:ring-[#42A77A]/30 font-medium"
              >
                {missions.map(m => (
                  <option key={m.id} value={m.id}>
                    [{m.code}] {m.title} ({m.unitName})
                  </option>
                ))}
              </select>
            </div>

            {/* Outcome Summary */}
            <div>
              <label className="block font-semibold text-[#25202B] mb-1">
                สรุปผลการปฏิบัติงานเชิงประจักษ์ <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="ระบุสิ่งที่ได้ดำเนินการ ปริมาณงานที่สำเร็จ ประชาชนที่ได้รับประโยชน์ และผลตอบรับ..."
                value={outcomeSummary}
                onChange={e => setOutcomeSummary(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[rgba(66,167,122,0.3)] focus:outline-none focus:ring-2 focus:ring-[#42A77A]/30"
              />
            </div>

            {/* Numerical Counts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-[#25202B] mb-1">กำลังพลที่ร่วมปฏิบัติจริง (นาย)</label>
                <input
                  type="number"
                  min="1"
                  value={actualPersonnel}
                  onChange={e => setActualPersonnel(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(66,167,122,0.3)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#25202B] mb-1">ประชาชนที่ได้รับบริการ (คน)</label>
                <input
                  type="number"
                  min="0"
                  value={beneficiaries}
                  onChange={e => setBeneficiaries(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(66,167,122,0.3)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#25202B] mb-1">ระยะเวลาปฏิบัติงาน</label>
                <input
                  type="text"
                  value={executionTime}
                  onChange={e => setExecutionTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(66,167,122,0.3)]"
                />
              </div>
            </div>

            {/* Achievements List */}
            <div>
              <label className="block font-semibold text-[#25202B] mb-1">ผลสัมฤทธิ์สำคัญที่ได้รับ</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="เพิ่มข้อผลสัมฤทธิ์..."
                  value={achievementInput}
                  onChange={e => setAchievementInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-[rgba(66,167,122,0.3)]"
                />
                <button
                  type="button"
                  onClick={handleAddAchievement}
                  className="px-3 py-1.5 rounded-xl bg-[#EAF7F0] text-[#2F8A63] font-semibold hover:bg-[#42A77A] hover:text-white"
                >
                  เพิ่ม
                </button>
              </div>
              <div className="space-y-1">
                {achievements.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 px-2.5 rounded-lg bg-[#F9FBF9] border border-gray-200">
                    <span>• {item}</span>
                    <button
                      type="button"
                      onClick={() => setAchievements(prev => prev.filter((_, i) => i !== idx))}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Problems List */}
            <div>
              <label className="block font-semibold text-[#25202B] mb-1">ปัญหา อุปสรรค และข้อเสนอแนะ</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="เพิ่มข้อปัญหาหรือข้อเสนอแนะ..."
                  value={problemsInput}
                  onChange={e => setProblemsInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-[rgba(66,167,122,0.3)]"
                />
                <button
                  type="button"
                  onClick={handleAddProblem}
                  className="px-3 py-1.5 rounded-xl bg-[#EAF7F0] text-[#2F8A63] font-semibold hover:bg-[#42A77A] hover:text-white"
                >
                  เพิ่ม
                </button>
              </div>
              <div className="space-y-1">
                {problems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 px-2.5 rounded-lg bg-[#F9FBF9] border border-gray-200">
                    <span>• {item}</span>
                    <button
                      type="button"
                      onClick={() => setProblems(prev => prev.filter((_, i) => i !== idx))}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Reporter Profile */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-[#25202B] mb-1">ยศผู้รายงาน</label>
                <input
                  type="text"
                  value={reporterRank}
                  onChange={e => setReporterRank(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(66,167,122,0.3)]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#25202B] mb-1">ชื่อ-สกุล</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={e => setReporterName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(66,167,122,0.3)]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#25202B] mb-1">ตำแหน่ง</label>
                <input
                  type="text"
                  value={reporterPosition}
                  onChange={e => setReporterPosition(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(66,167,122,0.3)]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#25202B] mb-1">เบอร์โทรศัพท์</label>
                <input
                  type="text"
                  value={reporterPhone}
                  onChange={e => setReporterPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(66,167,122,0.3)]"
                />
              </div>
            </div>

            {/* Simulated Photo Upload Preview */}
            <div className="p-3 rounded-xl border-2 border-dashed border-[rgba(66,167,122,0.35)] bg-[#F5FBF7] text-center">
              <Upload className="w-5 h-5 text-[#42A77A] mx-auto mb-1" />
              <p className="font-semibold text-[#25202B]">แนบภาพถ่ายการปฏิบัติงานและเอกสารรายงาน</p>
              <p className="text-[11px] text-[#6B6973] mt-0.5">ระบบจะแนบภาพถ่ายความละเอียดสูงและไฟล์ PDF สรุปให้อัตโนมัติ</p>
            </div>

            {/* Submit */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSubmitReportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-[#6B6973] hover:bg-gray-100 font-medium"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#2583D8] text-white font-semibold hover:bg-blue-600 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
              >
                ส่งรายงานเข้าสู่ระบบ (จอ.๐๑)
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
