import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { Mission } from '../../types';
import {
  X,
  Compass,
  Calendar,
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Truck,
  Plus,
  Search,
  ShieldAlert
} from 'lucide-react';
import { formatThaiDate } from '../../utils/formatters';

interface NewMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (mission: Mission) => void;
}

const PROVINCES = [
  'ลพบุรี', 'ปราจีนบุรี', 'นครราชสีมา', 'สระบุรี', 'เชียงใหม่',
  'พิษณุโลก', 'กาญจนบุรี', 'ชลบุรี', 'สงขลา', 'นครศรีธรรมราช',
  'เพชรบุรี', 'ประจวบคีรีขันธ์', 'อุดรธานี', 'ขอนแก่น', 'กรุงเทพมหานคร'
];

export const NewMissionModal: React.FC<NewMissionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { addMission, units, personnel, checkMissionConflicts } = useAdmin();

  const [missionName, setMissionName] = useState('');
  const [unitId, setUnitId] = useState(units[0]?.unit_id || 'U01');
  const [province, setProvince] = useState('ลพบุรี');
  const [location, setLocation] = useState('ค่ายสมเด็จพระนารายณ์มหาราช');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [commanderId, setCommanderId] = useState(personnel[0]?.person_id || 'P01');
  const [selectedPersonnelIds, setSelectedPersonnelIds] = useState<string[]>([
    personnel[0]?.person_id || 'P01',
    personnel[1]?.person_id || 'P02',
  ]);
  const [budget, setBudget] = useState(15000);
  const [transportation, setTransportation] = useState('รถยนต์ส่วนกลาง หมายเลข ทบ-5541');
  const [objective, setObjective] = useState('');
  const [personnelSearch, setPersonnelSearch] = useState('');

  // Live Conflict Check
  const conflicts = useMemo(() => {
    return checkMissionConflicts(selectedPersonnelIds, startDate, endDate);
  }, [checkMissionConflicts, selectedPersonnelIds, startDate, endDate]);

  if (!isOpen) return null;

  const handleTogglePersonnel = (pId: string) => {
    setSelectedPersonnelIds(prev => {
      if (prev.includes(pId)) {
        // don't remove if commander
        if (pId === commanderId) return prev;
        return prev.filter(id => id !== pId);
      } else {
        return [...prev, pId];
      }
    });
  };

  const handleCommanderChange = (pId: string) => {
    setCommanderId(pId);
    if (!selectedPersonnelIds.includes(pId)) {
      setSelectedPersonnelIds(prev => [...prev, pId]);
    }
  };

  const filteredPersonnelList = personnel.filter(
    p =>
      p.name.toLowerCase().includes(personnelSearch.toLowerCase()) ||
      p.unit_name.toLowerCase().includes(personnelSearch.toLowerCase()) ||
      p.position.toLowerCase().includes(personnelSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!missionName.trim()) return;

    const unit = units.find(u => u.unit_id === unitId);

    const newMissionData = {
      missionCode: `MS-2569-${Date.now().toString().slice(-3)}`,
      missionName: missionName.trim(),
      unitId,
      unitName: unit?.name || 'ฝ่ายอำนวยการ',
      commanderId,
      personnelIds: selectedPersonnelIds,
      province,
      location,
      startDate,
      endDate,
      budget: Number(budget),
      transportation,
      objective: objective.trim() || `ปฏิบัติภารกิจราชการ ณ จ.${province}`,
      status: 'รอดำเนินการ' as const,
    };

    addMission(newMissionData as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-800">สร้างคำสั่งและมอบหมายภารกิจใหม่</h3>
              <p className="text-xs text-slate-500">กำหนดกำลังพล ตรวจสอบเวลาทับซ้อน (Conflict Check) และคุมงบประมาณ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conflict Warning Banner */}
        {conflicts.length > 0 && (
          <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <div className="font-bold mb-1">
                ตรวจพบตารางเวลาทับซ้อน! กำลังพล {conflicts.length} นายมีภารกิจอื่นในช่วงเวลานี้:
              </div>
              <ul className="list-disc list-inside space-y-0.5">
                {conflicts.map((c, idx) => (
                  <li key={idx}>
                    <strong>{c.personName}</strong> อยู่ในภารกิจ &quot;{c.conflictingMission.missionName}&quot; ({formatThaiDate(c.conflictingMission.startDate)} - {formatThaiDate(c.conflictingMission.endDate)}) ณ จ.{c.conflictingMission.province}
                  </li>
                ))}
              </ul>
              <div className="mt-1 text-[11px] text-amber-700">
                * กรุณาพิจารณาปรับเปลี่ยนวันที่ หรือเลือกกำลังพลสำรองเพื่อไม่ให้กระทบต่อภารกิจหลัก
              </div>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่อภารกิจราชการ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={missionName}
              onChange={e => setMissionName(e.target.value)}
              placeholder="เช่น การตรวจสอบความพร้อมรบและระบบส่งกำลังบำรุง ฉก.ลพบุรี"
              className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                หน่วยงานรับผิดชอบหลัก
              </label>
              <select
                value={unitId}
                onChange={e => setUnitId(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500"
              >
                {units.map(u => (
                  <option key={u.unit_id} value={u.unit_id}>
                    {u.name} ({u.short_name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ผู้ควบคุมภารกิจ (หัวหน้าชุด)
              </label>
              <select
                value={commanderId}
                onChange={e => handleCommanderChange(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500"
              >
                {personnel.map(p => (
                  <option key={p.person_id} value={p.person_id}>
                    {p.name} ({p.position} - {p.unit_name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                จังหวัดปลายทาง <span className="text-rose-500">*</span>
              </label>
              <select
                value={province}
                onChange={e => setProvince(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500"
              >
                {PROVINCES.map(p => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                สถานที่ / ค่าย / หน่วยงานปลายทาง
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="เช่น ค่ายสมเด็จพระนารายณ์มหาราช"
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันที่เริ่มภารกิจ
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันที่สิ้นสุดภารกิจ
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                งบประมาณจัดสรร (บาท)
              </label>
              <input
                type="number"
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ยานพาหนะ / การเดินทาง
              </label>
              <input
                type="text"
                value={transportation}
                onChange={e => setTransportation(e.target.value)}
                placeholder="เช่น รถยนต์ส่วนกลาง ทบ-1234"
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              วัตถุประสงค์ภารกิจ
            </label>
            <textarea
              rows={2}
              value={objective}
              onChange={e => setObjective(e.target.value)}
              placeholder="ระบุวัตถุประสงค์และการประสานงาน..."
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Personnel Selection Box */}
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="block text-xs font-bold text-slate-800">
                เลือกกำลังพลร่วมปฏิบัติภารกิจ ({selectedPersonnelIds.length} นายที่เลือก)
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ค้นหารายชื่อกำลังพล..."
                  value={personnelSearch}
                  onChange={e => setPersonnelSearch(e.target.value)}
                  className="pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>

            {/* Selected Personnel Badges */}
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
              {selectedPersonnelIds.map(pId => {
                const p = personnel.find(item => item.person_id === pId);
                if (!p) return null;
                const isCmd = pId === commanderId;
                return (
                  <span
                    key={pId}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs ${
                      isCmd
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'bg-white text-slate-700 border border-slate-300'
                    }`}
                  >
                    <span>{p.name}</span>
                    {isCmd ? (
                      <span className="text-[10px] opacity-80">(หน.ชุด)</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleTogglePersonnel(pId)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        ✕
                      </button>
                    )}
                  </span>
                );
              })}
            </div>

            {/* Available Personnel Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto bg-white p-2 rounded-lg border border-slate-200">
              {filteredPersonnelList.map(p => {
                const isSelected = selectedPersonnelIds.includes(p.person_id);
                return (
                  <label
                    key={p.person_id}
                    className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-indigo-50/60 border-indigo-200 text-indigo-900'
                        : 'hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleTogglePersonnel(p.person_id)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <div className="font-semibold text-xs">{p.name}</div>
                        <div className="text-[10px] text-slate-400">{p.position} ({p.unit_name})</div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
            >
              สร้างภารกิจราชการ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
