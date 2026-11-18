import React, { useState, useMemo } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { Meeting } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  CalendarCheck,
  TrendingUp,
  LayoutGrid,
  List,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';
import { formatThaiDate } from '../utils/formatters';
import { MeetingDetailModal } from '../components/meetings/MeetingDetailModal';
import { NewMeetingModal } from '../components/meetings/NewMeetingModal';

export const MonthlyMeetingsPage: React.FC = () => {
  const { meetings, deleteMeeting } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = meetings.length;
    let allResolutionsCount = 0;
    let completedResolutionsCount = 0;
    let totalAttendeesSum = 0;

    meetings.forEach(m => {
      totalAttendeesSum += m.total_attendees || 0;
      if (m.resolutions) {
        allResolutionsCount += m.resolutions.length;
        completedResolutionsCount += m.resolutions.filter(r => r.status === 'เสร็จสิ้น').length;
      }
    });

    const resolutionCompletionRate =
      allResolutionsCount > 0 ? Math.round((completedResolutionsCount / allResolutionsCount) * 100) : 0;
    const avgAttendees = total > 0 ? Math.round(totalAttendeesSum / total) : 0;

    return {
      total,
      allResolutionsCount,
      completedResolutionsCount,
      resolutionCompletionRate,
      avgAttendees,
    };
  }, [meetings]);

  // Filtered Meetings
  const filteredMeetings = useMemo(() => {
    return meetings.filter(m => {
      const matchesSearch =
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.month_label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.chairperson.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [meetings, searchTerm, statusFilter]);

  const handleDelete = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    if (window.confirm(`ยืนยันการลบการประชุม "${title}" หรือไม่?`)) {
      deleteMeeting(id);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 01 — HERO / OPENING (Editorial Intelligence Command) */}
      <section className="glass rounded-[28px] p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-mono tracking-widest text-[rgba(17,19,21,0.5)] mb-2 uppercase">
              <span className="text-[#234A78] font-bold">MEETINGS / 03</span>
              <span>—</span>
              <span>DIRECTORATE MONTHLY SESSIONS</span>
              <span>—</span>
              <span>๕ AGENDAS</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#111315] leading-tight">
              ระบบบริหารการประชุมรายเดือน
            </h2>
            <p className="text-xs sm:text-sm text-[rgba(17,19,21,0.62)] mt-2 font-normal leading-relaxed max-w-2xl">
              จัดการระเบียบวาระการประชุมตามมาตรฐาน ๕ วาระราชการ ติดตามมติที่ประชุม และประมวลผลข้อสั่งการสำคัญสำหรับผู้บังคับบัญชา
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsNewMeetingModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#17324F] hover:bg-[#234A78] text-white text-xs font-medium transition shadow-2xs flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[1.5]" />
              <span>บันทึกการประชุมใหม่</span>
            </button>
          </div>
        </div>
      </section>

      {/* 02 — ASYMMETRIC METRICS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              TOTAL SESSIONS
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">การประชุมทั้งหมด</div>
            <div className="text-3xl font-light font-mono text-[#111315] mt-1">{stats.total}</div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">ประจำปีงบประมาณ ๒๕๖๙</div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              RESOLUTIONS TRACKED
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">มติที่ประชุมทั้งหมด</div>
            <div className="text-3xl font-light font-mono text-[#234A78] mt-1">{stats.allResolutionsCount}</div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">ข้อสั่งการที่ต้องติดตาม</div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              FULFILLMENT RATE
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">ความสำเร็จของมติ</div>
            <div className="text-3xl font-light font-mono text-[#42695B] mt-1">{stats.resolutionCompletionRate}%</div>
          </div>
          <div className="text-[10px] font-mono text-[#42695B] mt-3 font-medium">
            เสร็จสิ้น {stats.completedResolutionsCount} มติ
          </div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              AVG PARTICIPATION
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">เฉลี่ยผู้เข้าร่วม</div>
            <div className="text-3xl font-light font-mono text-[#111315] mt-1">{stats.avgAttendees}</div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">นาย / ครั้งการประชุม</div>
        </div>
      </section>

      {/* 03 — FILTER & VIEW BAR */}
      <section className="glass rounded-[22px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[rgba(17,19,21,0.4)] absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.5]" />
          <input
            type="text"
            placeholder="ค้นหาชื่อการประชุม, ประจำเดือน, สถานที่, หรือประธานในที่ประชุม..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/70 border border-[rgba(17,19,21,0.08)] text-xs text-[#111315] placeholder:text-[rgba(17,19,21,0.4)] focus:outline-hidden focus:border-[#234A78]/50 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs rounded-xl border border-[rgba(17,19,21,0.08)] px-3 py-2 bg-white/80 text-[#111315] focus:outline-hidden cursor-pointer"
          >
            <option value="all">ทุกสถานะการประชุม</option>
            <option value="เสร็จสิ้น">เสร็จสิ้นแล้ว</option>
            <option value="นัดหมายแล้ว">นัดหมายแล้ว</option>
            <option value="กำลังประชุม">กำลังประชุม</option>
          </select>

          <div className="flex items-center bg-white/60 p-1 rounded-xl border border-[rgba(17,19,21,0.08)] text-xs">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-[#17324F] text-white' : 'text-[rgba(17,19,21,0.5)] hover:text-[#111315]'
              }`}
              title="มุมมองการ์ด"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table' ? 'bg-[#17324F] text-white' : 'text-[rgba(17,19,21,0.5)] hover:text-[#111315]'
              }`}
              title="มุมมองตาราง"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 04 — CONTENT VIEW (Grid or Table) */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMeetings.map(meeting => {
            const resolutionsCount = meeting.resolutions?.length || 0;
            const completedCount = meeting.resolutions?.filter(r => r.status === 'เสร็จสิ้น').length || 0;
            const progress = resolutionsCount > 0 ? Math.round((completedCount / resolutionsCount) * 100) : 0;

            return (
              <div
                key={meeting.id}
                onClick={() => setSelectedMeeting(meeting)}
                className="glass rounded-[24px] p-5 hover:border-[#234A78]/30 transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-lg bg-white/80 border border-[rgba(17,19,21,0.08)] font-mono font-semibold text-[#234A78]">
                      ครั้งที่ {meeting.meeting_number}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        meeting.status === 'เสร็จสิ้น'
                          ? 'bg-[#42695B]/10 text-[#42695B]'
                          : meeting.status === 'กำลังประชุม'
                          ? 'bg-[#A77A35]/10 text-[#A77A35]'
                          : 'bg-[#234A78]/10 text-[#234A78]'
                      }`}
                    >
                      ● {meeting.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-medium text-[#111315] line-clamp-2 group-hover:text-[#234A78] transition-colors mb-2">
                    {meeting.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-[rgba(17,19,21,0.6)] pt-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[rgba(17,19,21,0.4)] stroke-[1.5]" />
                      <span>{formatThaiDate(meeting.meeting_date)} ({meeting.meeting_time} น.)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[rgba(17,19,21,0.4)] stroke-[1.5]" />
                      <span className="truncate">{meeting.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[rgba(17,19,21,0.4)] stroke-[1.5]" />
                      <span className="truncate">ประธาน: {meeting.chairperson}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[rgba(17,19,21,0.06)]">
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-[rgba(17,19,21,0.5)]">การขับเคลื่อนมติ</span>
                    <span className="text-[#42695B] font-medium">{completedCount}/{resolutionsCount} ({progress}%)</span>
                  </div>
                  <div className="w-full bg-[rgba(17,19,21,0.06)] h-1 rounded-full overflow-hidden mb-3">
                    <div
                      className="bg-[#42695B] h-full rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-mono text-[rgba(17,19,21,0.4)]">
                      ผู้เข้าร่วม {meeting.total_attendees} นาย
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedMeeting(meeting);
                        }}
                        className="p-1.5 rounded-lg hover:bg-white text-[rgba(17,19,21,0.4)] hover:text-[#234A78] transition"
                        title="ดูรายละเอียด"
                      >
                        <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
                      </button>
                      <button
                        type="button"
                        onClick={e => handleDelete(e, meeting.id, meeting.title)}
                        className="p-1.5 rounded-lg hover:bg-white text-[rgba(17,19,21,0.4)] hover:text-[#A84E4E] transition"
                        title="ลบ"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="glass rounded-[24px] overflow-hidden border border-[rgba(17,19,21,0.08)] shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[rgba(17,19,21,0.03)] border-b border-[rgba(17,19,21,0.08)] text-[rgba(17,19,21,0.5)] font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">ครั้งที่ / หัวข้อการประชุม</th>
                  <th className="py-3.5 px-3">วัน-เวลา</th>
                  <th className="py-3.5 px-3">สถานที่</th>
                  <th className="py-3.5 px-3">ประธานการประชุม</th>
                  <th className="py-3.5 px-3 text-center">ผู้เข้าร่วม</th>
                  <th className="py-3.5 px-3 text-center">มติที่เสร็จสิ้น</th>
                  <th className="py-3.5 px-3 text-center">สถานะ</th>
                  <th className="py-3.5 px-5 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(17,19,21,0.06)]">
                {filteredMeetings.map(meeting => {
                  const resolutionsCount = meeting.resolutions?.length || 0;
                  const completedCount = meeting.resolutions?.filter(r => r.status === 'เสร็จสิ้น').length || 0;
                  return (
                    <tr
                      key={meeting.id}
                      onClick={() => setSelectedMeeting(meeting)}
                      className="hover:bg-white/60 transition cursor-pointer"
                    >
                      <td className="py-3.5 px-5">
                        <div className="font-mono text-xs font-semibold text-[#234A78]">ครั้งที่ {meeting.meeting_number}</div>
                        <div className="font-medium text-[#111315] text-xs mt-0.5 line-clamp-1 max-w-sm">
                          {meeting.title}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-[rgba(17,19,21,0.7)] font-mono">
                        {formatThaiDate(meeting.meeting_date)}
                      </td>
                      <td className="py-3.5 px-3 text-[rgba(17,19,21,0.7)] truncate max-w-[130px]">
                        {meeting.location}
                      </td>
                      <td className="py-3.5 px-3 text-[rgba(17,19,21,0.7)] truncate max-w-[140px]">
                        {meeting.chairperson}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono">
                        {meeting.total_attendees} นาย
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-medium text-[#42695B]">
                        {completedCount}/{resolutionsCount}
                      </td>
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#234A78]/10 text-[#234A78]">
                          {meeting.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <div className="flex items-center justify-center gap-1" onClick={e => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setSelectedMeeting(meeting)}
                            className="p-1.5 rounded-lg hover:bg-white text-[rgba(17,19,21,0.4)] hover:text-[#234A78]"
                            title="ดูรายละเอียด"
                          >
                            <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
                          </button>
                          <button
                            type="button"
                            onClick={e => handleDelete(e, meeting.id, meeting.title)}
                            className="p-1.5 rounded-lg hover:bg-white text-[rgba(17,19,21,0.4)] hover:text-[#A84E4E]"
                            title="ลบ"
                          >
                            <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 05 — DETAIL MODAL */}
      {selectedMeeting && (
        <MeetingDetailModal
          meeting={selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
        />
      )}

      {/* 06 — NEW MEETING MODAL */}
      <NewMeetingModal
        isOpen={isNewMeetingModalOpen}
        onClose={() => setIsNewMeetingModalOpen(false)}
      />
    </div>
  );
};
