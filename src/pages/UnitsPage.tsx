import React, { useState, useMemo } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { Personnel, PersonnelStatus, Unit } from '../types';
import { exportToCSV } from '../utils/exportUtils';
import {
  Users,
  Plus,
  Search,
  Download,
  Edit2,
  Trash2,
  Eye,
  X,
  Building2,
  Phone,
  Mail,
  Shield,
  Briefcase,
  GraduationCap,
  Layers,
} from 'lucide-react';
import { ConfirmModal } from '../components/common/ConfirmModal';

const STATUS_LIST: PersonnelStatus[] = ['ปฏิบัติหน้าที่ปกติ', 'ไปราชการ', 'ลาพักผ่อน', 'อบรม'];

export const UnitsPage: React.FC = () => {
  const {
    units = [],
    personnel = [],
    addPersonnel,
    updatePersonnel,
    deletePersonnel,
    currentRole,
    showToast,
  } = useAdmin();

  const safeUnits = useMemo(() => (Array.isArray(units) ? units : []), [units]);
  const safePersonnel = useMemo(() => (Array.isArray(personnel) ? personnel : []), [personnel]);

  // Active view: 'units' or 'personnel'
  const [activeTab, setActiveTab] = useState<'units' | 'personnel'>('units');

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Personnel | null>(null);
  const [viewingItem, setViewingItem] = useState<Personnel | null>(null);
  const [viewingUnit, setViewingUnit] = useState<Unit | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State for Personnel
  const [formRank, setFormRank] = useState('พ.ท.');
  const [formName, setFormName] = useState('');
  const [formPosition, setFormPosition] = useState('');
  const [formDepartment, setFormDepartment] = useState(safeUnits[0]?.unit_name || '');
  const [formPhone, setFormPhone] = useState('02-280-8000');
  const [formEmail, setFormEmail] = useState('');
  const [formStatus, setFormStatus] = useState<PersonnelStatus>('ปฏิบัติหน้าที่ปกติ');
  const [formEducation, setFormEducation] = useState('');

  // Filtered Personnel
  const filteredPersonnel = useMemo(() => {
    return safePersonnel.filter(p => {
      if (!p) return false;
      const matchSearch =
        !searchQuery ||
        (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.position && p.position.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.rank && p.rank.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.department && p.department.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchUnit = selectedUnitFilter === 'all' || p.department === selectedUnitFilter;
      const matchStatus = selectedStatusFilter === 'all' || p.status === selectedStatusFilter;

      return matchSearch && matchUnit && matchStatus;
    });
  }, [safePersonnel, searchQuery, selectedUnitFilter, selectedStatusFilter]);

  // Open Edit Personnel
  const handleOpenEdit = (item: Personnel) => {
    setEditingItem(item);
    setFormRank(item.rank || 'พ.ต.');
    setFormName(item.name || '');
    setFormPosition(item.position || '');
    setFormDepartment(item.department || safeUnits[0]?.unit_name || '');
    setFormPhone(item.phone || '');
    setFormEmail(item.email || '');
    setFormStatus(item.status || 'ปฏิบัติหน้าที่ปกติ');
    setFormEducation(item.education || '');
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormRank('พ.ต.');
    setFormName('');
    setFormPosition('นายทหารปฏิบัติการ');
    setFormDepartment(safeUnits[0]?.unit_name || '');
    setFormPhone('02-280-8000 ต่อ 120');
    setFormEmail('');
    setFormStatus('ปฏิบัติหน้าที่ปกติ');
    setFormEducation('ปริญญาตรี รัฐประศาสนศาสตร์');
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPosition.trim() || !formDepartment.trim()) {
      showToast('กรุณากรอกข้อมูลสำคัญให้ครบถ้วน', 'error');
      return;
    }

    if (editingItem) {
      updatePersonnel({
        ...editingItem,
        rank: formRank.trim(),
        name: formName.trim(),
        position: formPosition.trim(),
        department: formDepartment,
        phone: formPhone.trim(),
        email: formEmail.trim() || `${formName.toLowerCase().replace(/\s+/g, '.')}@sac.mil.th`,
        status: formStatus,
        education: formEducation.trim(),
      });
      setEditingItem(null);
    } else {
      addPersonnel({
        person_id: `PERS-2569-${String(safePersonnel.length + 1).padStart(3, '0')}`,
        rank: formRank.trim(),
        name: formName.trim(),
        position: formPosition.trim(),
        department: formDepartment,
        phone: formPhone.trim(),
        email: formEmail.trim() || `${formName.toLowerCase().replace(/\s+/g, '.')}@sac.mil.th`,
        status: formStatus,
        education: formEducation.trim(),
      });
      setIsAddModalOpen(false);
    }
  };

  const handleExport = () => {
    const exportData = filteredPersonnel.map(p => ({
      รหัสกำลังพล: p.person_id,
      ยศ: p.rank,
      ชื่อนามสกุล: p.name,
      ตำแหน่ง: p.position,
      กลุ่มงานสังกัด: p.department,
      เบอร์โทรศัพท์: p.phone,
      อีเมล: p.email,
      สถานะ: p.status,
      คุณวุฒิการศึกษา: p.education || '-',
    }));
    exportToCSV(exportData, `ทำเนียบบุคลากรฝ่ายอำนวยการ_${new Date().toISOString().slice(0, 10)}`);
  };

  const getStatusBadge = (status: PersonnelStatus) => {
    switch (status) {
      case 'ปฏิบัติหน้าที่ปกติ':
        return 'bg-[#42695B]/10 text-[#42695B] border-[#42695B]/20';
      case 'ไปราชการ':
        return 'bg-[#234A78]/10 text-[#234A78] border-[#234A78]/20';
      case 'ลาพักผ่อน':
        return 'bg-[#A77A35]/15 text-[#A77A35] border-[#A77A35]/25';
      case 'อบรม':
        return 'bg-[#8F4A8F]/10 text-[#8F4A8F] border-[#8F4A8F]/20';
      default:
        return 'bg-[rgba(17,19,21,0.05)] text-[rgba(17,19,21,0.7)] border-[rgba(17,19,21,0.1)]';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 01 — HERO / OPENING (Editorial Intelligence Command) */}
      <section className="glass rounded-[28px] p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-mono tracking-widest text-[rgba(17,19,21,0.5)] mb-2 uppercase">
              <span className="text-[#234A78] font-bold">STRUCTURE / 04</span>
              <span>—</span>
              <span>ORGANIZATIONAL DIRECTORY</span>
              <span>—</span>
              <span>5 CORE DIVISIONS</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#111315] leading-tight">
              โครงสร้าง 5 กลุ่มงานหลักและทำเนียบบุคลากรฝ่ายอำนวยการ
            </h2>
            <p className="text-xs sm:text-sm text-[rgba(17,19,21,0.62)] mt-2 font-normal leading-relaxed max-w-2xl">
              ผังบังคับบัญชา อัตรากำลังพล ความรับผิดชอบ และการติดต่อสื่อสารประสานงานภายในสำนักงานฝ่ายอำนวยการกลาง
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleExport}
              className="px-4 py-2.5 rounded-xl bg-white/80 hover:bg-white border border-[rgba(17,19,21,0.12)] text-[#111315] text-xs font-medium transition shadow-2xs flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#234A78] stroke-[1.5]" />
              <span>ส่งออกทำเนียบ CSV</span>
            </button>

            {currentRole !== 'viewer' && (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-4 py-2.5 rounded-xl bg-[#17324F] hover:bg-[#234A78] text-white text-xs font-medium transition shadow-2xs flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[1.5]" />
                <span>เพิ่มบุคลากรใหม่</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 02 — ASYMMETRIC METRICS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              TOTAL CADRE
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">อัตรากำลังพลทั้งหมด</div>
            <div className="text-3xl font-light font-mono text-[#111315] mt-1">{safePersonnel.length}</div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">นายทหารและเจ้าหน้าที่ฝ่าย</div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              5 CORE DIVISIONS
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">กลุ่มงานสายอำนวยการ</div>
            <div className="text-3xl font-light font-mono text-[#234A78] mt-1">{safeUnits.length}</div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">โครงสร้างบังคับบัญชา</div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              ACTIVE ON DUTY
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">ปฏิบัติหน้าที่ปกติ</div>
            <div className="text-3xl font-light font-mono text-[#42695B] mt-1">
              {safePersonnel.filter(p => p.status === 'ปฏิบัติหน้าที่ปกติ').length}
            </div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">พร้อมปฏิบัติการ 100%</div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              EXTERNAL MISSIONS
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">ไปราชการ / ฝึกอบรม</div>
            <div className="text-3xl font-light font-mono text-[#A77A35] mt-1">
              {safePersonnel.filter(p => p.status === 'ไปราชการ' || p.status === 'อบรม').length}
            </div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">ภารกิจนอกพื้นที่</div>
        </div>
      </section>

      {/* 03 — EDITORIAL TAB SWITCHER */}
      <div className="flex items-center gap-2 border-b border-[rgba(17,19,21,0.08)] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('units')}
          className={`px-4 py-2.5 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'units'
              ? 'bg-[#17324F] text-white shadow-2xs'
              : 'bg-white/60 hover:bg-white text-[rgba(17,19,21,0.6)] border border-[rgba(17,19,21,0.08)]'
          }`}
        >
          <Building2 className="w-4 h-4 stroke-[1.5]" />
          <span>โครงสร้าง 5 กลุ่มงานหลัก ({safeUnits.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('personnel')}
          className={`px-4 py-2.5 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'personnel'
              ? 'bg-[#17324F] text-white shadow-2xs'
              : 'bg-white/60 hover:bg-white text-[rgba(17,19,21,0.6)] border border-[rgba(17,19,21,0.08)]'
          }`}
        >
          <Users className="w-4 h-4 stroke-[1.5]" />
          <span>ทำเนียบบุคลากรฝ่าย ({safePersonnel.length} นาย)</span>
        </button>
      </div>

      {/* TAB 1: UNITS VIEW */}
      {activeTab === 'units' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeUnits.map((unit, index) => {
            const unitPersonnel = safePersonnel.filter(p => p.department === unit.unit_name);
            return (
              <div
                key={unit.unit_id || index}
                className="glass rounded-[24px] p-6 flex flex-col justify-between hover:shadow-[0_16px_40px_rgba(18,23,27,0.06)] transition group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-[rgba(17,19,21,0.08)] shadow-2xs text-[#234A78] flex items-center justify-center font-mono font-bold text-sm">
                      0{index + 1}
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-[rgba(17,19,21,0.05)] text-[#111315]">
                      {unitPersonnel.length} อัตรากำลัง
                    </span>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[rgba(17,19,21,0.4)]">
                      {unit.unit_code || `UNIT-0${index + 1}`}
                    </div>
                    <h3 className="text-base font-semibold text-[#111315] mt-0.5">{unit.unit_name}</h3>
                    <p className="text-xs text-[rgba(17,19,21,0.62)] mt-1.5 leading-relaxed line-clamp-2">
                      {unit.description}
                    </p>
                  </div>

                  <div className="p-3.5 bg-white/70 rounded-2xl border border-[rgba(17,19,21,0.08)] space-y-1 text-xs">
                    <div className="text-[rgba(17,19,21,0.4)] text-[10px] font-mono uppercase">หัวหน้ากลุ่มงาน:</div>
                    <div className="font-semibold text-[#111315] flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#234A78] stroke-[1.5]" />
                      <span>{unit.head_of_unit}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-[rgba(17,19,21,0.65)] font-mono text-[11px]">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[rgba(17,19,21,0.4)] stroke-[1.5]" />
                      <span>{unit.contact_phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[rgba(17,19,21,0.4)] stroke-[1.5]" />
                      <span className="truncate">{unit.contact_email}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[rgba(17,19,21,0.08)] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setViewingUnit(unit)}
                    className="text-xs font-medium text-[#234A78] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>ดูโครงสร้างและอัตรากำลัง</span>
                    <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUnitFilter(unit.unit_name);
                      setActiveTab('personnel');
                    }}
                    className="text-[11px] font-mono text-[rgba(17,19,21,0.5)] hover:text-[#111315]"
                  >
                    ดูรายชื่อ ({unitPersonnel.length}) →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: PERSONNEL VIEW */}
      {activeTab === 'personnel' && (
        <div className="space-y-4">
          {/* Filters */}
          <section className="glass rounded-[22px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[rgba(17,19,21,0.4)] absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.5]" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ, สกุล, ยศ, ตำแหน่ง, หรือกลุ่มงาน..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/70 border border-[rgba(17,19,21,0.08)] text-xs text-[#111315] placeholder:text-[rgba(17,19,21,0.4)] focus:outline-hidden focus:border-[#234A78]/50 transition"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedUnitFilter}
                onChange={e => setSelectedUnitFilter(e.target.value)}
                className="text-xs rounded-xl border border-[rgba(17,19,21,0.08)] px-3 py-2 bg-white/80 text-[#111315] focus:outline-hidden cursor-pointer"
              >
                <option value="all">ทุกกลุ่มงานฝ่ายอำนวยการ</option>
                {safeUnits.map(u => (
                  <option key={u.unit_id} value={u.unit_name}>
                    {u.unit_name}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatusFilter}
                onChange={e => setSelectedStatusFilter(e.target.value)}
                className="text-xs rounded-xl border border-[rgba(17,19,21,0.08)] px-3 py-2 bg-white/80 text-[#111315] focus:outline-hidden cursor-pointer"
              >
                <option value="all">ทุกสถานะการปฏิบัติงาน</option>
                {STATUS_LIST.map(st => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>

              {(selectedUnitFilter !== 'all' || selectedStatusFilter !== 'all' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedUnitFilter('all');
                    setSelectedStatusFilter('all');
                  }}
                  className="text-xs text-[#A84E4E] hover:underline px-2 py-1 flex items-center gap-1 font-mono cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> ล้างตัวกรอง
                </button>
              )}
            </div>
          </section>

          {/* Personnel Table */}
          <section className="glass rounded-[24px] overflow-hidden border border-[rgba(17,19,21,0.08)] shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[rgba(17,19,21,0.03)] border-b border-[rgba(17,19,21,0.08)] text-[rgba(17,19,21,0.5)] font-mono text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">ยศ - นามสกุล</th>
                    <th className="py-3.5 px-3">ตำแหน่งหน้าที่</th>
                    <th className="py-3.5 px-3">กลุ่มงานสังกัด</th>
                    <th className="py-3.5 px-3 text-center">สถานะการปฏิบัติงาน</th>
                    <th className="py-3.5 px-3">การติดต่อ (โทร/อีเมล)</th>
                    <th className="py-3.5 px-4 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(17,19,21,0.06)]">
                  {filteredPersonnel.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-[rgba(17,19,21,0.4)]">
                        <Users className="w-8 h-8 mx-auto text-[rgba(17,19,21,0.3)] mb-2 stroke-[1.5]" />
                        ไม่พบบุคลากรตามเงื่อนไขที่ระบุ
                      </td>
                    </tr>
                  ) : (
                    filteredPersonnel.map((p, index) => {
                      const rowKey = p.person_id ? `${p.person_id}-${index}` : `pers-row-${index}`;
                      return (
                        <tr key={rowKey} className="hover:bg-white/60 transition">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#17324F]/5 text-[#17324F] font-mono text-xs font-bold flex items-center justify-center border border-[rgba(17,19,21,0.08)]">
                                {p.rank}
                              </div>
                              <div>
                                <div className="font-semibold text-[#111315]">
                                  {p.rank} {p.name}
                                </div>
                                <div className="text-[10px] text-[rgba(17,19,21,0.4)] font-mono">
                                  {p.person_id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-[#111315] font-medium">{p.position}</td>
                          <td className="py-3.5 px-3">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[rgba(17,19,21,0.05)] text-[rgba(17,19,21,0.7)]">
                              {p.department}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-medium ${getStatusBadge(
                                p.status
                              )}`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-mono text-[11px] text-[rgba(17,19,21,0.65)]">
                            <div>{p.phone}</div>
                            <div className="text-[10px] text-[rgba(17,19,21,0.4)]">{p.email}</div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => setViewingItem(p)}
                                className="p-1.5 rounded-lg hover:bg-white text-[rgba(17,19,21,0.4)] hover:text-[#234A78] transition"
                                title="ดูประวัติ"
                              >
                                <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
                              </button>

                              {currentRole !== 'viewer' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEdit(p)}
                                    className="p-1.5 rounded-lg hover:bg-white text-[rgba(17,19,21,0.4)] hover:text-[#234A78] transition"
                                    title="แก้ไขข้อมูล"
                                  >
                                    <Edit2 className="w-3.5 h-3.5 stroke-[1.5]" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeletingId(p.person_id)}
                                    className="p-1.5 rounded-lg hover:bg-white text-[rgba(17,19,21,0.4)] hover:text-[#A84E4E] transition"
                                    title="ลบ"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* VIEW UNIT MODAL */}
      {viewingUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111315]/40 backdrop-blur-[12px]">
          <div className="bg-white/95 backdrop-blur-[24px] rounded-[28px] shadow-[0_30px_80px_rgba(18,23,27,0.15)] max-w-xl w-full p-6 border border-[rgba(17,19,21,0.1)] text-[#111315]">
            <div className="flex items-start justify-between pb-3 border-b border-[rgba(17,19,21,0.08)]">
              <div>
                <span className="text-[10px] font-mono text-[#234A78] font-bold uppercase tracking-wider">
                  {viewingUnit.unit_code}
                </span>
                <h3 className="text-base font-semibold text-[#111315] mt-0.5">{viewingUnit.unit_name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingUnit(null)}
                className="p-1.5 rounded-lg text-[rgba(17,19,21,0.4)] hover:text-[#111315]"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <p className="text-[rgba(17,19,21,0.7)] leading-relaxed">{viewingUnit.description}</p>

              <div className="p-3.5 bg-white/70 rounded-2xl border border-[rgba(17,19,21,0.08)] space-y-2">
                <div className="text-[10px] font-mono uppercase text-[rgba(17,19,21,0.4)]">
                  หัวหน้ากลุ่มงาน (HEAD OF UNIT)
                </div>
                <div className="font-semibold text-sm text-[#111315] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#234A78] stroke-[1.5]" />
                  <span>{viewingUnit.head_of_unit}</span>
                </div>
                <div className="text-xs text-[rgba(17,19,21,0.6)] font-mono pt-1">
                  โทร: {viewingUnit.contact_phone} • อีเมล: {viewingUnit.contact_email}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#111315] mb-2">
                  บุคลากรในสังกัด ({safePersonnel.filter(p => p.department === viewingUnit.unit_name).length} นาย):
                </div>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {safePersonnel
                    .filter(p => p.department === viewingUnit.unit_name)
                    .map(p => (
                      <div
                        key={p.person_id}
                        className="p-2.5 rounded-xl bg-[rgba(17,19,21,0.03)] flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium text-[#111315]">
                            {p.rank} {p.name}
                          </div>
                          <div className="text-[10px] text-[rgba(17,19,21,0.45)]">{p.position}</div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${getStatusBadge(
                            p.status
                          )}`}
                        >
                          {p.status}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[rgba(17,19,21,0.08)] text-right">
              <button
                type="button"
                onClick={() => setViewingUnit(null)}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-[rgba(17,19,21,0.05)] text-[#111315] hover:bg-[rgba(17,19,21,0.1)] transition cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW PERSONNEL MODAL */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111315]/40 backdrop-blur-[12px]">
          <div className="bg-white/95 backdrop-blur-[24px] rounded-[28px] shadow-[0_30px_80px_rgba(18,23,27,0.15)] max-w-lg w-full p-6 border border-[rgba(17,19,21,0.1)] text-[#111315]">
            <div className="flex items-start justify-between pb-3 border-b border-[rgba(17,19,21,0.08)]">
              <div>
                <span className="text-[10px] font-mono text-[#234A78] font-bold">
                  {viewingItem.person_id}
                </span>
                <h3 className="text-base font-semibold text-[#111315] mt-0.5">
                  {viewingItem.rank} {viewingItem.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="p-1.5 rounded-lg text-[rgba(17,19,21,0.4)] hover:text-[#111315]"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3.5 bg-[rgba(17,19,21,0.03)] rounded-2xl grid grid-cols-2 gap-2 border border-[rgba(17,19,21,0.06)]">
                <div>
                  <span className="text-[rgba(17,19,21,0.4)] block text-[10px] font-mono">ตำแหน่ง:</span>
                  <span className="font-semibold text-[#111315]">{viewingItem.position}</span>
                </div>
                <div>
                  <span className="text-[rgba(17,19,21,0.4)] block text-[10px] font-mono">กลุ่มงานสังกัด:</span>
                  <span className="font-semibold text-[#234A78]">{viewingItem.department}</span>
                </div>
                <div>
                  <span className="text-[rgba(17,19,21,0.4)] block text-[10px] font-mono">สถานะปัจจุบัน:</span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${getStatusBadge(
                      viewingItem.status
                    )}`}
                  >
                    {viewingItem.status}
                  </span>
                </div>
                <div>
                  <span className="text-[rgba(17,19,21,0.4)] block text-[10px] font-mono">คุณวุฒิการศึกษา:</span>
                  <span className="font-medium text-[#111315]">{viewingItem.education || '-'}</span>
                </div>
              </div>

              <div className="p-3.5 bg-white/70 rounded-2xl border border-[rgba(17,19,21,0.08)] space-y-1 font-mono text-[11px]">
                <div className="text-[rgba(17,19,21,0.4)] text-[10px] uppercase font-sans font-semibold">
                  ช่องทางการติดต่อ:
                </div>
                <div>โทรศัพท์: {viewingItem.phone}</div>
                <div>อีเมลราชการ: {viewingItem.email}</div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[rgba(17,19,21,0.08)] text-right">
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-[rgba(17,19,21,0.05)] text-[#111315] hover:bg-[rgba(17,19,21,0.1)] transition cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PERSONNEL MODAL */}
      {(isAddModalOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111315]/40 backdrop-blur-[12px]">
          <div className="bg-white/95 backdrop-blur-[24px] rounded-[28px] shadow-[0_30px_80px_rgba(18,23,27,0.15)] max-w-xl w-full p-6 border border-[rgba(17,19,21,0.1)] text-[#111315]">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(17,19,21,0.08)]">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#234A78] stroke-[1.5]" />
                <h3 className="text-base font-semibold text-[#111315]">
                  {editingItem ? 'แก้ไขข้อมูลบุคลากร' : 'เพิ่มบุคลากรใหม่'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingItem(null);
                }}
                className="p-1.5 rounded-lg text-[rgba(17,19,21,0.4)] hover:text-[#111315]"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-[#111315] mb-1">ยศ / คำนำหน้า</label>
                  <input
                    type="text"
                    value={formRank}
                    onChange={e => setFormRank(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-medium text-[#111315] mb-1">ชื่อ - นามสกุล</label>
                  <input
                    type="text"
                    placeholder="ชื่อ-นามสกุล"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#111315] mb-1">ตำแหน่งหน้าที่</label>
                  <input
                    type="text"
                    placeholder="เช่น นายทหารงบประมาณ"
                    value={formPosition}
                    onChange={e => setFormPosition(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111315] mb-1">กลุ่มงานสังกัด</label>
                  <select
                    value={formDepartment}
                    onChange={e => setFormDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden"
                  >
                    {safeUnits.map(u => (
                      <option key={u.unit_id} value={u.unit_name}>
                        {u.unit_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#111315] mb-1">สถานะการปฏิบัติงาน</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as PersonnelStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden"
                  >
                    {STATUS_LIST.map(st => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#111315] mb-1">คุณวุฒิการศึกษา</label>
                  <input
                    type="text"
                    placeholder="เช่น รป.ม. (การจัดการภาครัฐ)"
                    value={formEducation}
                    onChange={e => setFormEducation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#111315] mb-1">เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white font-mono focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111315] mb-1">อีเมลราชการ</label>
                  <input
                    type="email"
                    placeholder="เช่น name@sac.mil.th"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white font-mono focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[rgba(17,19,21,0.08)]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 rounded-xl text-[rgba(17,19,21,0.6)] hover:bg-[rgba(17,19,21,0.04)] transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#17324F] hover:bg-[#234A78] text-white font-medium shadow-2xs transition cursor-pointer"
                >
                  {editingItem ? 'บันทึกการแก้ไข' : 'บันทึกบุคลากร'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={Boolean(deletingId)}
        title="ยืนยันการลบข้อมูลบุคลากร"
        message="คุณต้องการลบข้อมูลกำลังพลนี้ออกจากระบบหรือไม่?"
        onConfirm={() => {
          if (deletingId) deletePersonnel(deletingId);
          setDeletingId(null);
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
