import React, { useState, useMemo } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { Mission } from '../types';
import {
  Compass,
  Calendar,
  MapPin,
  Users,
  Plus,
  Search,
  Eye,
  Trash2,
  Clock,
  LayoutGrid,
  List,
  ChevronRight,
  BarChart2,
} from 'lucide-react';
import { formatThaiDate, formatCurrency } from '../utils/formatters';
import { MissionDetailModal } from '../components/missions/MissionDetailModal';
import { NewMissionModal } from '../components/missions/NewMissionModal';

export const PersonnelMissionsPage: React.FC = () => {
  const { missions, personnel, units, deleteMission } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [unitFilter, setUnitFilter] = useState<string>('all');
  const [provinceFilter, setProvinceFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isNewMissionModalOpen, setIsNewMissionModalOpen] = useState(false);
  const [showWorkloadDrawer, setShowWorkloadDrawer] = useState(false);

  // Statistics
  const stats = useMemo(() => {
    const total = missions.length;
    const active = missions.filter(m => m.status === 'กำลังดำเนินการ').length;
    const pending = missions.filter(m => m.status === 'รอดำเนินการ').length;
    const completed = missions.filter(m => m.status === 'เสร็จสิ้น').length;
    const totalBudget = missions.reduce((acc, m) => acc + (m.budget || 0), 0);

    // Unique personnel deployed
    const deployedIds = new Set<string>();
    missions.forEach(m => {
      if (m.commanderId) deployedIds.add(m.commanderId);
      m.personnelIds?.forEach(pId => deployedIds.add(pId));
    });

    return {
      total,
      active,
      pending,
      completed,
      totalBudget,
      uniquePersonnelDeployed: deployedIds.size,
    };
  }, [missions]);

  // Province Counts
  const provinceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    missions.forEach(m => {
      counts[m.province] = (counts[m.province] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [missions]);

  // Personnel Workload Ranking
  const personnelWorkload = useMemo(() => {
    const counts: Record<string, { name: string; rank: string; unit: string; count: number; days: number }> = {};

    personnel.forEach(p => {
      counts[p.person_id] = {
        name: p.name,
        rank: p.rank,
        unit: p.unit_name,
        count: 0,
        days: 0,
      };
    });

    missions.forEach(m => {
      if (m.status === 'ยกเลิก') return;
      const s = new Date(m.startDate).getTime();
      const e = new Date(m.endDate).getTime();
      const days = Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1);

      const allMembers = new Set([m.commanderId, ...(m.personnelIds || [])]);
      allMembers.forEach(pId => {
        if (counts[pId]) {
          counts[pId].count += 1;
          counts[pId].days += days;
        }
      });
    });

    return Object.entries(counts)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [missions, personnel]);

  // Filtered Missions
  const filteredMissions = useMemo(() => {
    return missions.filter(m => {
      const matchesSearch =
        m.missionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.missionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
      const matchesUnit = unitFilter === 'all' || m.unitId === unitFilter;
      const matchesProvince = provinceFilter === 'all' || m.province === provinceFilter;

      return matchesSearch && matchesStatus && matchesUnit && matchesProvince;
    });
  }, [missions, searchTerm, statusFilter, unitFilter, provinceFilter]);

  const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (window.confirm(`ยืนยันการลบภารกิจ "${name}" หรือไม่?`)) {
      deleteMission(id);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 01 — HERO / OPENING (Editorial Intelligence Command) */}
      <section className="glass rounded-[28px] p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-mono tracking-widest text-[rgba(17,19,21,0.5)] mb-2 uppercase">
              <span className="text-[#234A78] font-bold">MISSIONS / 04</span>
              <span>—</span>
              <span>DEPLOYMENT & WORKLOAD ORCHESTRATION</span>
              <span>—</span>
              <span>CONFLICT CHECK</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#111315] leading-tight">
              ระบบบริหารภารกิจและกำลังพล
            </h2>
            <p className="text-xs sm:text-sm text-[rgba(17,19,21,0.62)] mt-2 font-normal leading-relaxed max-w-2xl">
              จัดสรรกำลังพลลงพื้นที่ราชการ ป้องกันความซ้ำซ้อนของตารางเวลาปฏิบัติงาน (Conflict Detection) พร้อมควบคุมงบประมาณและบันทึกประวัติการหมุนเวียนกำลังพล
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowWorkloadDrawer(true)}
              className="px-4 py-2.5 rounded-xl bg-white/80 hover:bg-white border border-[rgba(17,19,21,0.12)] text-[#111315] text-xs font-medium transition shadow-2xs flex items-center gap-2 cursor-pointer"
            >
              <BarChart2 className="w-4 h-4 text-[#234A78] stroke-[1.5]" />
              <span>สถิติภาระงานกำลังพล</span>
            </button>
            <button
              type="button"
              onClick={() => setIsNewMissionModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#17324F] hover:bg-[#234A78] text-white text-xs font-medium transition shadow-2xs flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[1.5]" />
              <span>มอบหมายภารกิจใหม่</span>
            </button>
          </div>
        </div>
      </section>

      {/* 02 — ASYMMETRIC METRICS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              TOTAL MISSIONS
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">ภารกิจทั้งหมด</div>
            <div className="text-3xl font-light font-mono text-[#111315] mt-1">{stats.total}</div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">
            เสร็จสิ้นแล้ว {stats.completed} ภารกิจ
          </div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              ACTIVE OPERATIONS
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">กำลังดำเนินการ</div>
            <div className="text-3xl font-light font-mono text-[#234A78] mt-1">{stats.active}</div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">
            รอดำเนินการ {stats.pending} ภารกิจ
          </div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              DEPLOYED READINESS
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">กำลังพลที่ปฏิบัติภารกิจ</div>
            <div className="text-3xl font-light font-mono text-[#42695B] mt-1">{stats.uniquePersonnelDeployed}</div>
          </div>
          <div className="text-[10px] font-mono text-[#42695B] mt-3 font-medium">
            จากทั้งหมด {personnel.length} นาย
          </div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              OPERATIONS BUDGET
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">งบประมาณภารกิจรวม</div>
            <div className="text-2xl sm:text-3xl font-light font-mono text-[#111315] mt-1 truncate">
              {formatCurrency(stats.totalBudget)}
            </div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">ค่าเบี้ยเลี้ยง ค่าที่พัก ค่ายานพาหนะ</div>
        </div>
      </section>

      {/* 03 — PROVINCE SUMMARY PILLS */}
      <section className="glass rounded-[22px] p-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="font-mono text-[11px] text-[rgba(17,19,21,0.6)] flex items-center gap-1.5 uppercase">
            <MapPin className="w-3.5 h-3.5 text-[#234A78] stroke-[1.5]" />
            <span>TOP DEPLOYMENT PROVINCES / พื้นที่ปฏิบัติภารกิจสูงสุด</span>
          </div>
          <span className="text-[rgba(17,19,21,0.4)] text-[11px] font-mono">FILTER BY PROVINCE</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {provinceCounts.map(([prov, count]) => (
            <button
              type="button"
              key={prov}
              onClick={() => setProvinceFilter(provinceFilter === prov ? 'all' : prov)}
              className={`text-xs px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                provinceFilter === prov
                  ? 'bg-[#17324F] text-white border-[#17324F] font-mono'
                  : 'bg-white/70 text-[#111315] border-[rgba(17,19,21,0.08)] hover:border-[#234A78]/30 font-mono'
              }`}
            >
              <span>{prov}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  provinceFilter === prov ? 'bg-white/20 text-white' : 'bg-[rgba(17,19,21,0.06)] text-[rgba(17,19,21,0.6)]'
                }`}
              >
                {count}
              </span>
            </button>
          ))}
          {provinceFilter !== 'all' && (
            <button
              type="button"
              onClick={() => setProvinceFilter('all')}
              className="text-xs px-2.5 py-1 rounded-xl text-[rgba(17,19,21,0.4)] hover:text-[#111315] font-mono cursor-pointer"
            >
              [RESET FILTER]
            </button>
          )}
        </div>
      </section>

      {/* 04 — SEARCH & FILTER BAR */}
      <section className="glass rounded-[22px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[rgba(17,19,21,0.4)] absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.5]" />
          <input
            type="text"
            placeholder="ค้นหาชื่อภารกิจ, รหัสภารกิจ, จังหวัด, หรือสถานที่ปลายทาง..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/70 border border-[rgba(17,19,21,0.08)] text-xs text-[#111315] placeholder:text-[rgba(17,19,21,0.4)] focus:outline-hidden focus:border-[#234A78]/50 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs rounded-xl border border-[rgba(17,19,21,0.08)] px-3 py-2 bg-white/80 text-[#111315] focus:outline-hidden cursor-pointer"
          >
            <option value="all">ทุกสถานะภารกิจ</option>
            <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
            <option value="รอดำเนินการ">รอดำเนินการ</option>
            <option value="เสร็จสิ้น">เสร็จสิ้น</option>
            <option value="ยกเลิก">ยกเลิก</option>
          </select>

          <select
            value={unitFilter}
            onChange={e => setUnitFilter(e.target.value)}
            className="text-xs rounded-xl border border-[rgba(17,19,21,0.08)] px-3 py-2 bg-white/80 text-[#111315] focus:outline-hidden cursor-pointer"
          >
            <option value="all">ทุกหน่วยงาน</option>
            {units.map(u => (
              <option key={u.unit_id} value={u.unit_id}>
                {u.short_name}
              </option>
            ))}
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

      {/* 05 — MISSION DISPLAY (Grid / Table) */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMissions.map(mission => {
            const commander = personnel.find(p => p.person_id === mission.commanderId);
            const memberCount = mission.personnelIds?.length || 0;

            return (
              <div
                key={mission.id}
                onClick={() => setSelectedMission(mission)}
                className="glass rounded-[24px] p-5 hover:border-[#234A78]/30 transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-lg bg-white/80 border border-[rgba(17,19,21,0.08)] font-mono font-semibold text-[#234A78]">
                      {mission.missionCode}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        mission.status === 'กำลังดำเนินการ'
                          ? 'bg-[#234A78]/10 text-[#234A78]'
                          : mission.status === 'เสร็จสิ้น'
                          ? 'bg-[#42695B]/10 text-[#42695B]'
                          : mission.status === 'ยกเลิก'
                          ? 'bg-[#A84E4E]/10 text-[#A84E4E]'
                          : 'bg-[#A77A35]/10 text-[#A77A35]'
                      }`}
                    >
                      ● {mission.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-medium text-[#111315] line-clamp-2 group-hover:text-[#234A78] transition-colors mb-2">
                    {mission.missionName}
                  </h3>

                  <div className="space-y-1.5 text-xs text-[rgba(17,19,21,0.6)] mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[rgba(17,19,21,0.4)] shrink-0 stroke-[1.5]" />
                      <span className="font-mono text-[11px]">
                        {formatThaiDate(mission.startDate)} - {formatThaiDate(mission.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[rgba(17,19,21,0.4)] shrink-0 stroke-[1.5]" />
                      <span className="line-clamp-1">
                        จ.{mission.province} ({mission.location})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[rgba(17,19,21,0.4)] shrink-0 stroke-[1.5]" />
                      <span className="truncate">
                        หน.ชุด: {commander?.name || 'ยังไม่ได้ระบุ'} (+{memberCount} นาย)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[rgba(17,19,21,0.06)] pt-3 mt-1 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-[rgba(17,19,21,0.4)] uppercase">งบประมาณ:</span>{' '}
                    <span className="font-mono text-xs font-semibold text-[#111315]">{formatCurrency(mission.budget)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedMission(mission);
                      }}
                      className="p-1.5 rounded-lg hover:bg-white text-[rgba(17,19,21,0.4)] hover:text-[#234A78]"
                      title="ดูรายละเอียด"
                    >
                      <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
                    </button>
                    <button
                      type="button"
                      onClick={e => handleDelete(e, mission.id, mission.missionName)}
                      className="p-1.5 rounded-lg hover:bg-white text-[rgba(17,19,21,0.4)] hover:text-[#A84E4E]"
                      title="ลบภารกิจ"
                    >
                      <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                    </button>
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
                  <th className="py-3.5 px-4">รหัส</th>
                  <th className="py-3.5 px-4">ชื่อภารกิจ</th>
                  <th className="py-3.5 px-3">หน่วยงาน</th>
                  <th className="py-3.5 px-3">พื้นที่</th>
                  <th className="py-3.5 px-3">ระยะเวลา</th>
                  <th className="py-3.5 px-3 text-center">กำลังพล</th>
                  <th className="py-3.5 px-4 text-right">งบประมาณ</th>
                  <th className="py-3.5 px-3 text-center">สถานะ</th>
                  <th className="py-3.5 px-4 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(17,19,21,0.06)]">
                {filteredMissions.map(m => (
                  <tr
                    key={m.id}
                    onClick={() => setSelectedMission(m)}
                    className="hover:bg-white/60 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#234A78]">{m.missionCode}</td>
                    <td className="py-3.5 px-4 font-medium text-[#111315] max-w-xs truncate">{m.missionName}</td>
                    <td className="py-3.5 px-3 text-[rgba(17,19,21,0.7)]">{m.unitName}</td>
                    <td className="py-3.5 px-3 text-[rgba(17,19,21,0.7)]">จ.{m.province}</td>
                    <td className="py-3.5 px-3 text-[rgba(17,19,21,0.7)] font-mono text-[11px]">
                      {formatThaiDate(m.startDate)}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono">
                      {m.personnelIds?.length || 1} นาย
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-[#111315]">
                      {formatCurrency(m.budget)}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono ${
                          m.status === 'กำลังดำเนินการ'
                            ? 'bg-[#234A78]/10 text-[#234A78]'
                            : m.status === 'เสร็จสิ้น'
                            ? 'bg-[#42695B]/10 text-[#42695B]'
                            : 'bg-[#A77A35]/10 text-[#A77A35]'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1" onClick={e => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setSelectedMission(m)}
                          className="p-1.5 rounded-lg hover:bg-white text-[rgba(17,19,21,0.4)] hover:text-[#234A78]"
                        >
                          <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
                        </button>
                        <button
                          type="button"
                          onClick={e => handleDelete(e, m.id, m.missionName)}
                          className="p-1.5 rounded-lg hover:bg-white text-[rgba(17,19,21,0.4)] hover:text-[#A84E4E]"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 06 — MISSION DETAIL MODAL */}
      {selectedMission && (
        <MissionDetailModal
          mission={selectedMission}
          onClose={() => setSelectedMission(null)}
        />
      )}

      {/* 07 — NEW MISSION MODAL */}
      <NewMissionModal
        isOpen={isNewMissionModalOpen}
        onClose={() => setIsNewMissionModalOpen(false)}
        onSuccess={newMission => {
          setSelectedMission(newMission);
        }}
      />

      {/* 08 — WORKLOAD DRAWER / MODAL */}
      {showWorkloadDrawer && (
        <div className="fixed inset-0 z-50 bg-[#111315]/40 backdrop-blur-[12px] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white/95 backdrop-blur-[24px] rounded-[28px] shadow-[0_30px_80px_rgba(18,23,27,0.15)] border border-[rgba(17,19,21,0.1)] w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden text-[#111315]">
            <div className="px-6 py-4 border-b border-[rgba(17,19,21,0.08)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[#234A78] stroke-[1.5]" />
                <h3 className="text-sm font-medium text-[#111315]">
                  สถิติการหมุนเวียนและภาระงานกำลังพล (Workload & Rotation Analysis)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWorkloadDrawer(false)}
                className="text-[rgba(17,19,21,0.4)] hover:text-[#111315] p-1.5 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-3 text-xs">
              <p className="text-[rgba(17,19,21,0.6)] mb-2 font-mono text-[11px]">
                // จำนวนครั้งและวันสะสมที่กำลังพลได้รับมอบหมายภารกิจนอกที่ตั้ง เพื่อประเมินการหมุนเวียนกำลังพลอย่างเป็นธรรม:
              </p>
              <div className="divide-y divide-[rgba(17,19,21,0.06)] border border-[rgba(17,19,21,0.08)] rounded-2xl overflow-hidden bg-white/60">
                {personnelWorkload.slice(0, 15).map((p, idx) => (
                  <div key={p.id} className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 text-[rgba(17,19,21,0.4)] font-mono text-[11px]">{idx + 1}.</span>
                      <div>
                        <div className="font-semibold text-[#111315]">{p.name}</div>
                        <div className="text-[11px] text-[rgba(17,19,21,0.5)] font-mono">{p.unit}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-xl bg-white/80 border border-[rgba(17,19,21,0.08)] text-[#234A78] font-semibold font-mono text-xs">
                        {p.count} ภารกิจ ({p.days} วัน)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
