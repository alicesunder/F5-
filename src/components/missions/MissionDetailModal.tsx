import React from 'react';
import { Mission } from '../../types';
import { useAdmin } from '../../contexts/AdminContext';
import {
  X,
  Compass,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  ShieldCheck,
  Building2,
  FileText
} from 'lucide-react';
import { formatThaiDate, formatCurrency } from '../../utils/formatters';

interface MissionDetailModalProps {
  mission: Mission | null;
  onClose: () => void;
}

export const MissionDetailModal: React.FC<MissionDetailModalProps> = ({
  mission,
  onClose,
}) => {
  const { updateMission, personnel, checkMissionConflicts } = useAdmin();

  if (!mission) return null;

  const commander = personnel.find(p => p.person_id === mission.commanderId);
  const assignedPersonnel = personnel.filter(p => mission.personnelIds?.includes(p.person_id));

  // Check conflicts for this mission
  const conflicts = checkMissionConflicts(
    mission.personnelIds || [],
    mission.startDate,
    mission.endDate,
    mission.id
  );

  const handleStatusChange = (newStatus: Mission['status']) => {
    updateMission({
      ...mission,
      status: newStatus,
    });
  };

  const getDurationDays = (start: string, end: string) => {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    return Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1);
  };

  const durationDays = getDurationDays(mission.startDate, mission.endDate);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-800 line-clamp-1">{mission.missionName}</h3>
                <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-mono font-bold">
                  {mission.missionCode}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                หน่วยรับผิดชอบ: <span className="font-medium text-slate-700">{mission.unitName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              title="พิมพ์คำสั่งภารกิจ"
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conflict Warning Banner if any */}
        {conflicts.length > 0 && (
          <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800">
              <div className="font-bold mb-1">
                ตรวจพบตารางเวลาทับซ้อน (Schedule Conflict) สำหรับกำลังพลในภารกิจนี้:
              </div>
              <ul className="list-disc list-inside space-y-0.5">
                {conflicts.map((c, idx) => (
                  <li key={idx}>
                    <strong>{c.personName}</strong> ทับซ้อนกับภารกิจ &quot;{c.conflictingMission.missionName}&quot; (
                    {formatThaiDate(c.conflictingMission.startDate)} - {formatThaiDate(c.conflictingMission.endDate)}) ณ จ.{c.conflictingMission.province}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Status and Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">สถานะภารกิจปัจจุบัน:</span>
              <span
                className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                  mission.status === 'กำลังดำเนินการ'
                    ? 'bg-blue-100 text-blue-800'
                    : mission.status === 'เสร็จสิ้น'
                    ? 'bg-emerald-100 text-emerald-800'
                    : mission.status === 'ยกเลิก'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {mission.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500">ปรับเปลี่ยนสถานะ:</span>
              <select
                value={mission.status}
                onChange={e => handleStatusChange(e.target.value as any)}
                className="text-xs rounded-lg border border-slate-300 px-3 py-1.5 bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="รอดำเนินการ">รอดำเนินการ</option>
                <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                <option value="ยกเลิก">ยกเลิก</option>
              </select>
            </div>
          </div>

          {/* Key Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 block mb-1">ระยะเวลาปฏิบัติภารกิจ</span>
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>{durationDays} วัน</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {formatThaiDate(mission.startDate)} - {formatThaiDate(mission.endDate)}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 block mb-1">พื้นที่ / จังหวัด</span>
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>จ.{mission.province}</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">{mission.location}</div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 block mb-1">งบประมาณจัดสรร</span>
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>{formatCurrency(mission.budget)}</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">เบิกจ่ายตามระเบียบ</div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 block mb-1">พาหนะ / การเดินทาง</span>
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                <span className="line-clamp-1">{mission.transportation || 'รถยนต์ส่วนกลาง'}</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">พร้อมพลขับ</div>
            </div>
          </div>

          {/* Mission Objective */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>วัตถุประสงค์และรายละเอียดภารกิจ</span>
            </h4>
            <p className="text-slate-600 leading-relaxed text-xs">
              {mission.objective || 'ปฏิบัติภารกิจราชการตามคำสั่งผู้บังคับบัญชา เพื่อสนับสนุนงานฝ่ายอำนวยการ'}
            </p>
          </div>

          {/* Personnel Deployment List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>กำลังพลผู้ปฏิบัติภารกิจ ({assignedPersonnel.length} นาย)</span>
              </h4>
              <div className="text-[11px] text-slate-400">
                ผู้ควบคุมภารกิจ: <strong className="text-indigo-700">{commander?.name || 'ยังไม่ได้ระบุ'}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {assignedPersonnel.map(p => {
                const isCommander = p.person_id === mission.commanderId;
                return (
                  <div
                    key={p.person_id}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      isCommander
                        ? 'bg-indigo-50/50 border-indigo-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          isCommander ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {p.rank.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                          <span>{p.name}</span>
                          {isCommander && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 font-semibold">
                              หัวหน้าชุด
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {p.position} • {p.unit_name}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">{p.phone}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            ระบบบริหารภารกิจฝ่ายอำนวยการ SAC
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
