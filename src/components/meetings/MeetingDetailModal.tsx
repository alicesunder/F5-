import React, { useState } from 'react';
import { Meeting, MeetingResolution } from '../../types';
import { useAdmin } from '../../contexts/AdminContext';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Plus,
  Trash2,
  Printer,
  ChevronRight,
  FileText,
  Building,
  UserCheck,
  Send
} from 'lucide-react';
import { formatThaiDate } from '../../utils/formatters';

interface MeetingDetailModalProps {
  meeting: Meeting | null;
  onClose: () => void;
}

export const MeetingDetailModal: React.FC<MeetingDetailModalProps> = ({
  meeting,
  onClose,
}) => {
  const { updateMeetingResolution, addMeetingResolution, deleteMeetingResolution, units, personnel } = useAdmin();

  const [activeTab, setActiveTab] = useState<'agendas' | 'resolutions' | 'attendees' | 'aiSummary'>('agendas');
  const [showAddResolution, setShowAddResolution] = useState(false);

  // New resolution form state
  const [resDesc, setResDesc] = useState('');
  const [resUnit, setResUnit] = useState(units[0]?.name || 'แผนกธุรการและกำลังพล');
  const [resAssignee, setResAssignee] = useState(personnel[0]?.name || 'พ.ท. ประสิทธิ์');
  const [resDeadline, setResDeadline] = useState(new Date().toISOString().slice(0, 10));

  if (!meeting) return null;

  const totalResolutions = meeting.resolutions?.length || 0;
  const completedResolutions = meeting.resolutions?.filter(r => r.status === 'เสร็จสิ้น').length || 0;
  const completionPercentage = totalResolutions > 0 ? Math.round((completedResolutions / totalResolutions) * 100) : 0;

  const handleStatusChange = (resolution: MeetingResolution, newStatus: MeetingResolution['status']) => {
    updateMeetingResolution({
      ...resolution,
      status: newStatus,
      progress: newStatus === 'เสร็จสิ้น' ? 100 : newStatus === 'ยังไม่ดำเนินการ' ? 0 : resolution.progress || 50,
    });
  };

  const handleProgressChange = (resolution: MeetingResolution, newProgress: number) => {
    updateMeetingResolution({
      ...resolution,
      progress: newProgress,
      status: newProgress === 100 ? 'เสร็จสิ้น' : newProgress === 0 ? 'ยังไม่ดำเนินการ' : 'กำลังดำเนินการ',
    });
  };

  const handleCreateResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resDesc.trim()) return;

    addMeetingResolution(meeting.id, {
      meeting_id: meeting.id,
      agenda_order: 4,
      title: resDesc.slice(0, 40),
      description: resDesc,
      responsible_unit: resUnit,
      responsible_person: resAssignee,
      deadline: resDeadline,
      status: 'กำลังดำเนินการ',
      progress: 0,
      notes: 'เพิ่มจากระบบบริหารการประชุม',
    });

    setResDesc('');
    setShowAddResolution(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-800 line-clamp-1">{meeting.title}</h3>
                <span className="text-xs px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-mono font-medium">
                  ครั้งที่ {meeting.meeting_number}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                รหัส: <span className="font-mono text-slate-700">{meeting.id}</span> • ประจำเดือน {meeting.month_label}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              title="พิมพ์รายงานการประชุม"
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

        {/* Meeting Highlights Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 via-white to-slate-50">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 block mb-1">วันและเวลาประชุม</span>
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>{formatThaiDate(meeting.meeting_date)} ({meeting.meeting_time} น.)</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 block mb-1">สถานที่ / ห้องประชุม</span>
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span className="line-clamp-1">{meeting.location}</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 block mb-1">ประธานในที่ประชุม</span>
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="line-clamp-1">{meeting.chairperson}</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 block mb-1">ความคืบหน้ามติที่ประชุม</span>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">{completedResolutions}/{totalResolutions} มติ</span>
                <span className="text-[11px] font-semibold text-blue-600">{completionPercentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-slate-200 bg-white gap-2 text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('agendas')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'agendas'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>ระเบียบวาระการประชุม ({meeting.agendas?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('resolutions')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'resolutions'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>มติที่ประชุมและข้อสั่งการ ({totalResolutions})</span>
          </button>
          <button
            onClick={() => setActiveTab('attendees')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'attendees'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>ผู้เข้าร่วมประชุม ({meeting.total_attendees} นาย)</span>
          </button>
          <button
            onClick={() => setActiveTab('aiSummary')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'aiSummary'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>สรุปสาระสำคัญด้วย AI</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* 1. AGENDAS */}
          {activeTab === 'agendas' && (
            <div className="space-y-4">
              {meeting.agendas?.map((agenda, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-blue-200 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {agenda.order}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800">{agenda.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{agenda.description}</p>

                        {agenda.presenter && (
                          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                            <span className="font-medium text-slate-700">ผู้นำเสนอ:</span>
                            <span>{agenda.presenter}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. RESOLUTIONS */}
          {activeTab === 'resolutions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  ติดตามการปฏิบัติตามมติที่ประชุมและข้อสั่งการของฝ่ายอำนวยการ
                </div>
                <button
                  onClick={() => setShowAddResolution(!showAddResolution)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>เพิ่มมติใหม่</span>
                </button>
              </div>

              {/* Add Resolution Inline Form */}
              {showAddResolution && (
                <form
                  onSubmit={handleCreateResolution}
                  className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-3 animate-fade-in"
                >
                  <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-blue-600" />
                    <span>บันทึกมติที่ประชุมใหม่</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ข้อความมติ / การมอบหมายงาน <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={resDesc}
                      onChange={e => setResDesc(e.target.value)}
                      placeholder="ระบุข้อสั่งการหรือมติที่ประชุม..."
                      className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">หน่วยงานรับผิดชอบ</label>
                      <select
                        value={resUnit}
                        onChange={e => setResUnit(e.target.value)}
                        className="w-full text-xs rounded-xl border border-slate-300 px-2.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {units.map(u => (
                          <option key={u.unit_id} value={u.name}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">ผู้รับผิดชอบหลัก</label>
                      <input
                        type="text"
                        value={resAssignee}
                        onChange={e => setResAssignee(e.target.value)}
                        placeholder="ชื่อผู้รับผิดชอบ"
                        className="w-full text-xs rounded-xl border border-slate-300 px-2.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">กำหนดแล้วเสร็จ</label>
                      <input
                        type="date"
                        value={resDeadline}
                        onChange={e => setResDeadline(e.target.value)}
                        className="w-full text-xs rounded-xl border border-slate-300 px-2.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddResolution(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-300 rounded-lg"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      บันทึกมติ
                    </button>
                  </div>
                </form>
              )}

              {/* Resolutions List */}
              <div className="space-y-3">
                {meeting.resolutions?.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">ยังไม่มีมติที่ประชุมในครั้งนี้</div>
                ) : (
                  meeting.resolutions?.map((res, idx) => (
                    <div
                      key={res.resolution_id || idx}
                      className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 flex-1">
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                              {res.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 mt-1.5">
                              <span className="font-mono text-slate-400">{res.resolution_id}</span>
                              <span>•</span>
                              <span>หน่วยรับผิดชอบ: <strong className="text-slate-700">{res.responsible_unit}</strong></span>
                              <span>•</span>
                              <span>ผู้รับผิดชอบ: <strong className="text-slate-700">{res.responsible_person}</strong></span>
                              <span>•</span>
                              <span>กำหนด: <span className="text-slate-700">{formatThaiDate(res.deadline)}</span></span>
                            </div>
                          </div>
                        </div>

                        {/* Status Select */}
                        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                          <select
                            value={res.status}
                            onChange={e => handleStatusChange(res, e.target.value as any)}
                            className={`text-xs px-2.5 py-1 rounded-lg font-medium border ${
                              res.status === 'เสร็จสิ้น'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : res.status === 'กำลังดำเนินการ'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : res.status === 'ล่าช้า'
                                ? 'bg-rose-50 text-rose-800 border-rose-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <option value="ยังไม่ดำเนินการ">ยังไม่ดำเนินการ</option>
                            <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                            <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                            <option value="ล่าช้า">ล่าช้า</option>
                          </select>

                          <button
                            onClick={() => deleteMeetingResolution(meeting.id, res.resolution_id)}
                            title="ลบมตินี้"
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Slider */}
                      <div className="pt-1 flex items-center gap-3">
                        <span className="text-[11px] text-slate-400 shrink-0">ความคืบหน้า:</span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={10}
                          value={res.progress || 0}
                          onChange={e => handleProgressChange(res, Number(e.target.value))}
                          className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <span className="text-xs font-semibold text-slate-700 w-10 text-right">
                          {res.progress || 0}%
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 3. ATTENDEES */}
          {activeTab === 'attendees' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 mb-2">
                รายชื่อผู้เข้าร่วมประชุมฝ่ายอำนวยการและหัวหน้าหน่วยขึ้นตรง (รวม {meeting.total_attendees} นาย)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {meeting.attendees?.map((att, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                        {att.name.slice(0, 1)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800">{att.name}</div>
                        <div className="text-[11px] text-slate-400">{att.position} • {att.unit}</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      เข้าร่วม
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. AI SUMMARY */}
          {activeTab === 'aiSummary' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/50 border border-indigo-200/80 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>บทสรุปสำหรับผู้บริหาร (AI Executive Summary)</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {meeting.aiSummary || 'การประชุมในครั้งนี้เน้นย้ำการเร่งรัดการเบิกจ่ายงบประมาณไตรมาสที่ ๒ ให้เป็นไปตามเป้าหมายของกองทัพ พร้อมทั้งกำชับเรื่องความปลอดภัยในการลงพื้นที่ปฏิบัติภารกิจและการรักษาวินัยงานสารบรรณอย่างเคร่งครัด'}
                </p>

                <div className="border-t border-indigo-100 pt-3 text-xs text-indigo-950 space-y-2">
                  <div className="font-semibold text-slate-800">ประเด็นสำคัญที่ต้องเร่งดำเนินการ (Key Takeaways):</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                    <li>เร่งรัดรายงานผลการใช้จ่ายงบประมาณทุกวันศุกร์สุดท้ายของเดือน</li>
                    <li>ตรวจสอบความพร้อมของระบบป้องกันอัคคีภัยและเอกสารลับในทุกหน่วยงาน</li>
                    <li>ติดตามความคืบหน้าของมติที่ประชุมผ่านระบบ SAC เป็นประจำทุกสัปดาห์</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            เลขานุการการประชุม: {meeting.secretary}
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
