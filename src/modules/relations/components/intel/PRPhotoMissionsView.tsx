import React, { useState, useMemo } from 'react';
import {
  Camera,
  Search,
  Plus,
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Filter,
  Layers,
  Sparkles,
  ArrowRight,
  Upload,
} from 'lucide-react';
import { usePRIntel } from '../../context/PRIntelContext';
import { PhotoMission, MissionStatus, MissionCategory } from '../../types/bppTypes';
import { formatNumber } from '../../utils/formatters';

interface PRPhotoMissionsViewProps {
  statusFilterDefault?: MissionStatus | 'all';
}

export const PRPhotoMissionsView: React.FC<PRPhotoMissionsViewProps> = ({
  statusFilterDefault = 'all',
}) => {
  const {
    missions,
    setSelectedMission,
    setIsAddMissionOpen,
    updateMissionStatus,
  } = usePRIntel();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(statusFilterDefault);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const categories: MissionCategory[] = [
    'พิธีการและต้อนรับ',
    'ตรวจเยี่ยมหน่วย',
    'จิตอาสาพระราชทาน',
    'ช่วยเหลือผู้ประสบภัย',
    'กิจกรรมโรงเรียน ตชด.',
    'ลาดตระเวนชายแดน',
    'แถลงข่าวและประชาสัมพันธ์',
    'ฝึกอบรมและสัมมนา',
  ];

  const filteredMissions = useMemo(() => {
    return missions.filter((m) => {
      if (statusFilter !== 'all' && m.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && m.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          m.id.toLowerCase().includes(q) ||
          m.title.toLowerCase().includes(q) ||
          m.location.toLowerCase().includes(q) ||
          m.province.toLowerCase().includes(q) ||
          m.personnelName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [missions, statusFilter, categoryFilter, searchQuery]);

  // Statistics
  const totalCount = missions.length;
  const inProgCount = missions.filter((m) => m.status === 'in_progress').length;
  const pendingCount = missions.filter((m) => m.status === 'pending').length;
  const completedCount = missions.filter((m) => m.status === 'completed').length;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-pink-50 text-pink-700 border border-pink-200">
                <Camera className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-black text-[#1E1B4B] tracking-tight">
                  ตารางและระบบบริหารภารกิจภาพถ่าย (Photo Missions)
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  วางแผน มอบหมาย ติดตามการปฏิบัติงานช่างภาพ และคลังภาพส่งมอบ ({missions.length} ภารกิจ)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddMissionOpen(true)}
              className="px-3.5 py-2 bg-[#27265B] hover:bg-[#1E1B4B] text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>มอบหมายงานใหม่</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium">ภารกิจทั้งหมด</span>
            <div className="text-xl font-black text-[#1E1B4B]">{totalCount} งาน</div>
          </div>
          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-100">
            <span className="text-[11px] text-amber-700 font-medium">กำลังดำเนินการ</span>
            <div className="text-xl font-black text-amber-800 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span>{inProgCount} งาน</span>
            </div>
          </div>
          <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100">
            <span className="text-[11px] text-blue-700 font-medium">รอดำเนินการ</span>
            <div className="text-xl font-black text-blue-800">{pendingCount} งาน</div>
          </div>
          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
            <span className="text-[11px] text-emerald-700 font-medium">ส่งมอบเสร็จสิ้น</span>
            <div className="text-xl font-black text-emerald-700">{completedCount} งาน</div>
          </div>
        </div>
      </div>

      {/* Filter and View Selector */}
      <div className="bg-white border border-slate-200/80 p-3 rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาภารกิจ, รหัส PH-..., สถานที่, หรือชื่อช่างภาพ..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-pink-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2"
          >
            <option value="all">ทุกสถานะ ({missions.length})</option>
            <option value="pending">รอดำเนินการ ({pendingCount})</option>
            <option value="in_progress">กำลังดำเนินการ ({inProgCount})</option>
            <option value="completed">เสร็จสิ้น ({completedCount})</option>
            <option value="postponed">เลื่อนภารกิจ</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2"
          >
            <option value="all">ทุกหมวดหมู่ภารกิจ</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition ${
                viewMode === 'cards' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500'
              }`}
            >
              การ์ด
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition ${
                viewMode === 'table' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500'
              }`}
            >
              ตาราง
            </button>
          </div>
        </div>
      </div>

      {/* Main Content View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMissions.map((m) => {
            const isComp = m.status === 'completed';
            const isProg = m.status === 'in_progress';
            const progress =
              m.deliverablesRequired > 0
                ? Math.round((m.deliverablesDelivered / m.deliverablesRequired) * 100)
                : 0;

            return (
              <div
                key={m.id}
                onClick={() => setSelectedMission(m)}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-pink-400 hover:shadow-xs transition cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-[#27265B] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {m.id}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          m.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-700'
                            : m.priority === 'high'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {m.priority === 'urgent' ? 'ด่วนที่สุด' : m.priority === 'high' ? 'ด่วน' : 'ปกติ'}
                      </span>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        isComp
                          ? 'bg-emerald-100 text-emerald-800'
                          : isProg
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {isComp ? 'เสร็จสิ้น' : isProg ? 'กำลังทำ' : 'รอดำเนินการ'}
                    </span>
                  </div>

                  {/* Title & Category */}
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-pink-700 transition line-clamp-2 mt-2">
                    {m.title}
                  </h3>
                  <div className="mt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {m.category}
                    </span>
                  </div>

                  {/* Location & Time details */}
                  <div className="mt-3 space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{m.displayDate} • {m.startTime} - {m.endTime} น.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{m.location} ({m.province})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {m.personnelRank} {m.personnelName} (ทีม {m.teamCount} นาย)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deliverables Progress */}
                <div className="pt-3 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500">คลังภาพส่งมอบ</span>
                    <span className="font-mono text-xs font-bold text-slate-700">
                      {m.deliverablesDelivered}/{m.deliverablesRequired} รูป ({progress}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isComp ? 'bg-emerald-500' : 'bg-pink-600'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table Mode */
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th className="p-3.5">รหัส</th>
                <th className="p-3.5">ชื่อภารกิจ</th>
                <th className="p-3.5">วันที่/เวลา</th>
                <th className="p-3.5">สถานที่</th>
                <th className="p-3.5">ผู้รับผิดชอบ</th>
                <th className="p-3.5 text-center">ความคืบหน้า</th>
                <th className="p-3.5 text-right">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMissions.map((m) => {
                const isComp = m.status === 'completed';
                const isProg = m.status === 'in_progress';
                return (
                  <tr
                    key={m.id}
                    onClick={() => setSelectedMission(m)}
                    className="hover:bg-slate-50/80 cursor-pointer transition"
                  >
                    <td className="p-3.5 font-mono font-bold text-[#27265B]">{m.id}</td>
                    <td className="p-3.5 font-semibold text-slate-800 max-w-xs truncate">
                      {m.title}
                    </td>
                    <td className="p-3.5 text-slate-600 whitespace-nowrap">
                      {m.displayDate} {m.startTime} น.
                    </td>
                    <td className="p-3.5 text-slate-600 truncate max-w-[150px]">
                      {m.province}
                    </td>
                    <td className="p-3.5 text-slate-700 whitespace-nowrap">
                      {m.personnelRank} {m.personnelName}
                    </td>
                    <td className="p-3.5 text-center font-mono">
                      {m.deliverablesDelivered}/{m.deliverablesRequired}
                    </td>
                    <td className="p-3.5 text-right">
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                          isComp
                            ? 'bg-emerald-100 text-emerald-800'
                            : isProg
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {isComp ? 'เสร็จสิ้น' : isProg ? 'กำลังทำ' : 'รอดำเนินการ'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
