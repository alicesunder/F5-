import React, { useState } from 'react';
import {
  DisasterIncident,
  IncidentStatus,
} from '../types';
import {
  X,
  MapPin,
  Calendar,
  Users,
  Shield,
  Phone,
  Paperclip,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  ExternalLink,
  Edit,
  Trash2,
  AlertTriangle,
  ChevronRight,
  Send,
  Droplet,
  CloudRain,
  Share2,
} from 'lucide-react';

interface IncidentDetailModalProps {
  incident: DisasterIncident | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (incident: DisasterIncident) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: IncidentStatus, note?: string) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const primaryColor = '#8191BA';
  const [newStatusNote, setNewStatusNote] = useState('');
  const [showStatusPrompt, setShowStatusPrompt] = useState(false);
  const [targetStatus, setTargetStatus] = useState<IncidentStatus>('ควบคุมสถานการณ์');

  if (!isOpen || !incident) return null;

  const statuses: IncidentStatus[] = [
    'รอตรวจสอบ',
    'กำลังดำเนินการ',
    'ควบคุมสถานการณ์',
    'เสร็จสิ้น',
  ];

  const handleApplyStatus = () => {
    onStatusChange(incident.id, targetStatus, newStatusNote);
    setShowStatusPrompt(false);
    setNewStatusNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full my-8 overflow-hidden text-[#1F2937] flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div className="flex items-start gap-3">
            <span
              className="mt-1 w-3 h-3 rounded-full flex-shrink-0"
              style={{
                backgroundColor:
                  incident.severity === 'วิกฤต'
                    ? '#E11D48'
                    : incident.severity === 'เฝ้าระวังสูง'
                    ? '#EA580C'
                    : '#3B82F6',
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-400 font-bold">{incident.id}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-700">
                  {incident.type}
                </span>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-semibold"
                  style={{
                    backgroundColor:
                      incident.severity === 'วิกฤต'
                        ? '#FFE4E6'
                        : incident.severity === 'เฝ้าระวังสูง'
                        ? '#FEF3C7'
                        : '#E0F2FE',
                    color:
                      incident.severity === 'วิกฤต'
                        ? '#BE123C'
                        : incident.severity === 'เฝ้าระวังสูง'
                        ? '#B45309'
                        : '#0369A1',
                  }}
                >
                  ระดับ: {incident.severity}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 leading-snug">
                {incident.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Pipeline Tracker */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">ขั้นตอนการบริหารเหตุ:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {statuses.map((s, idx) => {
                  const isCurrent = incident.status === s;
                  const isPassed = statuses.indexOf(incident.status) >= idx;

                  return (
                    <React.Fragment key={s}>
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                          isCurrent
                            ? 'bg-slate-900 text-white shadow-xs'
                            : isPassed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-white text-slate-400 border border-slate-200'
                        }`}
                      >
                        {isPassed && !isCurrent && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {s}
                      </span>
                      {idx < statuses.length - 1 && (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Quick Status Advance Trigger */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setTargetStatus(
                    incident.status === 'รอตรวจสอบ'
                      ? 'กำลังดำเนินการ'
                      : incident.status === 'กำลังดำเนินการ'
                      ? 'ควบคุมสถานการณ์'
                      : 'เสร็จสิ้น'
                  );
                  setShowStatusPrompt(!showStatusPrompt);
                }}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                เปลี่ยนสถานะ
              </button>
            </div>
          </div>

          {/* Quick status change input prompt */}
          {showStatusPrompt && (
            <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 whitespace-nowrap">ปรับสถานะเป็น:</span>
                <select
                  value={targetStatus}
                  onChange={e => setTargetStatus(e.target.value as IncidentStatus)}
                  className="py-1 px-2.5 rounded-lg border border-slate-200 bg-slate-50 font-semibold"
                >
                  {statuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                value={newStatusNote}
                onChange={e => setNewStatusNote(e.target.value)}
                placeholder="บันทึกช่วยจำการเปลี่ยนสถานะ (ทางเลือก)..."
                className="flex-1 py-1 px-2.5 rounded-lg border border-slate-200 focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleApplyStatus}
                  className="px-3 py-1 rounded-lg text-white font-semibold transition"
                  style={{ backgroundColor: primaryColor }}
                >
                  บันทึก
                </button>
                <button
                  type="button"
                  onClick={() => setShowStatusPrompt(false)}
                  className="px-2 py-1 text-slate-500 hover:text-slate-700"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Location and Telemetry Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-400">พื้นที่เกิดเหตุ</div>
              <div className="text-xs font-bold text-slate-800 mt-1">
                {incident.district}, จ.{incident.province}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                ต.{incident.subdistrict} {incident.village}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-400">พิกัดทางภูมิศาสตร์</div>
              <div className="text-xs font-mono font-bold text-slate-800 mt-1">
                {incident.coordinates.lat.toFixed(4)}, {incident.coordinates.lng.toFixed(4)}
              </div>
              <a
                href={`https://www.google.com/maps?q=${incident.coordinates.lat},${incident.coordinates.lng}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-sky-600 hover:underline flex items-center gap-0.5 mt-0.5"
              >
                ดูบน Google Maps <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-400">ผลกระทบต่อราษฎร</div>
              <div className="text-xs font-bold text-slate-800 mt-1">
                {incident.affectedHouseholds.toLocaleString()} ครัวเรือน
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                รวม {incident.affectedPeople.toLocaleString()} ราย (บาดเจ็บ {incident.casualties.injured})
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-400">ระดับน้ำ / ฝนสะสม</div>
              <div className="text-xs font-bold text-slate-800 mt-1">
                น้ำ {incident.waterLevelCm || 0} ซม.
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                ฝนสะสม {incident.rainfallMm || 0} มม.
              </div>
            </div>
          </div>

          {/* Incident Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              รายละเอียดและสถานการณ์ในพื้นที่
            </h4>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed">
              {incident.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
            </div>
          </div>

          {/* Assigned Responders and Equipment Deployed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2.5">
                <Shield className="w-4 h-4 text-slate-600" />
                <span>หน่วยงานและผู้รับผิดชอบการเผชิญเหตุ</span>
              </h4>
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-slate-500">หน่วยปฏิบัติการ:</span>{' '}
                  <span className="font-semibold text-slate-800">{incident.assignedUnit}</span>
                </div>
                <div>
                  <span className="text-slate-500">หัวหน้าชุด:</span>{' '}
                  <span className="font-semibold text-slate-800">{incident.officerInCharge}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{incident.officerPhone}</span>
                </div>
                {incident.shelterLocation && (
                  <div className="pt-2 border-t border-slate-200/60 mt-2">
                    <span className="text-slate-500">ศูนย์พักพิงชั่วคราว:</span>{' '}
                    <span className="font-semibold text-emerald-700">{incident.shelterLocation}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 mb-2.5">
                ยุทโธปกรณ์และเครื่องจักรกลที่ประจำการ
              </h4>
              {incident.equipmentDeployed && incident.equipmentDeployed.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {incident.equipmentDeployed.map((eq, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 font-medium"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">ไม่มีการบันทึกเครื่องจักรกลเฉพาะ</p>
              )}
            </div>
          </div>

          {/* Attached Images Gallery & Documents */}
          {incident.attachments && incident.attachments.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                ภาพถ่ายและเอกสารแนบ ({incident.attachments.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {incident.attachments.map(att => (
                  <div
                    key={att.id}
                    className="p-3 rounded-2xl bg-white border border-slate-200 text-xs space-y-2 hover:border-slate-300 transition"
                  >
                    {att.type === 'image' && (
                      <div className="h-28 rounded-xl overflow-hidden bg-slate-100 mb-2">
                        <img
                          src={att.url}
                          alt={att.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {att.type === 'image' ? (
                        <ImageIcon className="w-4 h-4 text-sky-600 flex-shrink-0" />
                      ) : (
                        <Paperclip className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      )}
                      <div className="truncate">
                        <div className="font-semibold text-slate-800 truncate">{att.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{att.size}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Operational Timeline */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              บันทึกไทม์ไลน์การปฏิบัติการ (Operational Timeline)
            </h4>
            <div className="relative pl-6 border-l-2 border-slate-200 space-y-4 text-xs">
              {incident.timeline?.map(tl => (
                <div key={tl.id} className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-400" />
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800">{tl.time}</span>
                    <span className="font-semibold text-slate-900">{tl.title}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">{tl.description}</p>
                  <div className="text-[10px] text-slate-400 mt-1">ผู้บันทึก: {tl.actor}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (confirm('คุณต้องการลบรายงานเหตุการณ์นี้ใช่หรือไม่?')) {
                onDelete(incident.id);
                onClose();
              }
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>ลบเหตุการณ์</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(incident)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 shadow-2xs transition cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              <span>แก้ไขข้อมูล</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-200 transition cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
