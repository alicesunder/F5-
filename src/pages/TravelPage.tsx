import React, { useState, useMemo } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { TravelRecord, TravelStatus, VehicleType } from '../types';
import { formatCurrency, formatThaiDate } from '../utils/formatters';
import { exportToCSV } from '../utils/exportUtils';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  Eye,
  X,
  MapPin,
  Car,
  Calendar,
  DollarSign,
  User,
  FileText,
} from 'lucide-react';
import { Pagination } from '../components/common/Pagination';
import { ConfirmModal } from '../components/common/ConfirmModal';

const VEHICLE_TYPES: VehicleType[] = [
  'รถตู้ส่วนกลาง',
  'รถยนต์ส่วนกลาง',
  'เครื่องบิน',
  'รถไฟ',
  'ยานพาหนะส่วนตัว',
];

const TRAVEL_STATUSES: TravelStatus[] = [
  'รออนุมัติ',
  'อนุมัติแล้ว',
  'อยู่ระหว่างปฏิบัติงาน',
  'เสร็จสิ้น',
  'ยกเลิก',
];

export const TravelPage: React.FC = () => {
  const {
    travelRecords,
    personnel,
    units,
    addTravel,
    updateTravel,
    deleteTravel,
    currentRole,
    showToast,
  } = useAdmin();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TravelRecord | null>(null);
  const [viewingItem, setViewingItem] = useState<TravelRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formOrderNumber, setFormOrderNumber] = useState('');
  const [formTravelerName, setFormTravelerName] = useState(personnel[0]?.name || '');
  const [formPosition, setFormPosition] = useState(personnel[0]?.position || '');
  const [formUnit, setFormUnit] = useState(personnel[0]?.department || units[0]?.unit_name || '');
  const [formPurpose, setFormPurpose] = useState('');
  const [formDestination, setFormDestination] = useState('');
  const [formProvince, setFormProvince] = useState('');
  const [formDepartureDate, setFormDepartureDate] = useState('2026-09-08');
  const [formReturnDate, setFormReturnDate] = useState('2026-09-10');
  const [formVehicleType, setFormVehicleType] = useState<VehicleType>('รถตู้ส่วนกลาง');
  const [formVehiclePlate, setFormVehiclePlate] = useState('');
  const [formDriverName, setFormDriverName] = useState('');
  const [formAllowance, setFormAllowance] = useState<number>(1200);
  const [formTransport, setFormTransport] = useState<number>(3500);
  const [formAccommodation, setFormAccommodation] = useState<number>(3000);
  const [formStatus, setFormStatus] = useState<TravelStatus>('รออนุมัติ');
  const [formNotes, setFormNotes] = useState('');

  // Auto-fill position and unit when traveler name changes
  const handleTravelerSelect = (name: string) => {
    setFormTravelerName(name);
    const matched = personnel.find(p => p.name === name);
    if (matched) {
      setFormPosition(matched.position);
      setFormUnit(matched.department);
    }
  };

  // Calculate days count
  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 1;
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diffTime = d2.getTime() - d1.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return days > 0 ? days : 1;
  };

  // Filtered List
  const filteredRecords = useMemo(() => {
    return travelRecords.filter(t => {
      const matchSearch =
        !searchQuery ||
        t.traveler_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.order_number.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = selectedStatus === 'all' || t.status === selectedStatus;
      const matchVehicle = selectedVehicle === 'all' || t.vehicle_type === selectedVehicle;
      const matchUnit = selectedUnit === 'all' || t.unit === selectedUnit;

      return matchSearch && matchStatus && matchVehicle && matchUnit;
    });
  }, [travelRecords, searchQuery, selectedStatus, selectedVehicle, selectedUnit]);

  // Paginated
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  // Total cost summary
  const totalTravelCost = useMemo(() => {
    return filteredRecords.reduce(
      (sum, t) => sum + (t.allowance_amount + t.transport_cost + t.accommodation_cost),
      0
    );
  }, [filteredRecords]);

  // Open Edit
  const handleOpenEdit = (item: TravelRecord) => {
    setEditingItem(item);
    setFormOrderNumber(item.order_number);
    setFormTravelerName(item.traveler_name);
    setFormPosition(item.position);
    setFormUnit(item.unit);
    setFormPurpose(item.purpose);
    setFormDestination(item.destination);
    setFormProvince(item.province);
    setFormDepartureDate(item.departure_date);
    setFormReturnDate(item.return_date);
    setFormVehicleType(item.vehicle_type);
    setFormVehiclePlate(item.vehicle_plate || '');
    setFormDriverName(item.driver_name || '');
    setFormAllowance(item.allowance_amount);
    setFormTransport(item.transport_cost);
    setFormAccommodation(item.accommodation_cost);
    setFormStatus(item.status);
    setFormNotes(item.notes || '');
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormOrderNumber(`ศอ.คำสั่ง ${String(travelRecords.length + 105)}/2569`);
    setFormTravelerName(personnel[1]?.name || '');
    setFormPosition(personnel[1]?.position || '');
    setFormUnit(personnel[1]?.department || '');
    setFormPurpose('');
    setFormDestination('');
    setFormProvince('');
    setFormDepartureDate('2026-09-10');
    setFormReturnDate('2026-09-12');
    setFormVehicleType('รถตู้ส่วนกลาง');
    setFormVehiclePlate('1 นข 4521 กทม.');
    setFormDriverName('จ.ส.อ. วิเชียร เกิดผล');
    setFormAllowance(1440);
    setFormTransport(3800);
    setFormAccommodation(3200);
    setFormStatus('รออนุมัติ');
    setFormNotes('');
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTravelerName || !formDestination || !formProvince || !formPurpose) {
      showToast('กรุณากรอกข้อมูลสำคัญให้ครบถ้วน', 'error');
      return;
    }

    if (editingItem) {
      updateTravel({
        ...editingItem,
        order_number: formOrderNumber,
        traveler_name: formTravelerName,
        position: formPosition,
        unit: formUnit,
        purpose: formPurpose.trim(),
        destination: formDestination.trim(),
        province: formProvince.trim(),
        departure_date: formDepartureDate,
        return_date: formReturnDate,
        vehicle_type: formVehicleType,
        vehicle_plate: formVehiclePlate.trim() || undefined,
        driver_name: formDriverName.trim() || undefined,
        allowance_amount: Number(formAllowance),
        transport_cost: Number(formTransport),
        accommodation_cost: Number(formAccommodation),
        status: formStatus,
        notes: formNotes.trim() || undefined,
      });
      setEditingItem(null);
    } else {
      addTravel({
        order_number: formOrderNumber,
        traveler_name: formTravelerName,
        position: formPosition,
        unit: formUnit,
        purpose: formPurpose.trim(),
        destination: formDestination.trim(),
        province: formProvince.trim(),
        departure_date: formDepartureDate,
        return_date: formReturnDate,
        vehicle_type: formVehicleType,
        vehicle_plate: formVehiclePlate.trim() || undefined,
        driver_name: formDriverName.trim() || undefined,
        allowance_amount: Number(formAllowance),
        transport_cost: Number(formTransport),
        accommodation_cost: Number(formAccommodation),
        status: formStatus,
        notes: formNotes.trim() || undefined,
      });
      setIsAddModalOpen(false);
    }
  };

  // Export CSV
  const handleExport = () => {
    const exportData = filteredRecords.map(t => {
      const days = calculateDays(t.departure_date, t.return_date);
      const totalCost = t.allowance_amount + t.transport_cost + t.accommodation_cost;
      return {
        รหัสการเดินทาง: t.travel_id,
        เลขที่คำสั่ง: t.order_number,
        ผู้เดินทาง: t.traveler_name,
        ตำแหน่ง: t.position,
        หน่วยงาน: t.unit,
        วัตถุประสงค์: t.purpose,
        สถานที่ปลายทาง: t.destination,
        จังหวัด: t.province,
        วันที่ไป: t.departure_date,
        วันที่กลับ: t.return_date,
        จำนวนวัน: days,
        ยานพาหนะ: t.vehicle_type,
        ทะเบียนรถ: t.vehicle_plate || '-',
        พลขับ: t.driver_name || '-',
        ค่าเบี้ยเลี้ยง: t.allowance_amount,
        ค่าพาหนะ: t.transport_cost,
        ค่าที่พัก: t.accommodation_cost,
        ค่าใช้จ่ายรวม: totalCost,
        สถานะ: t.status,
      };
    });
    exportToCSV(exportData, `รายงานการไปราชการฝ่ายอำนวยการ_${new Date().toISOString().slice(0, 10)}`);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 01 — HERO / OPENING (Editorial Intelligence Command) */}
      <section className="glass rounded-[28px] p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-mono tracking-widest text-[rgba(17,19,21,0.5)] mb-2 uppercase">
              <span className="text-[#234A78] font-bold">TRAVEL / 05</span>
              <span>—</span>
              <span>OFFICIAL MISSION ITINERARIES & VEHICLES</span>
              <span>—</span>
              <span>PER DIEM CALC</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#111315] leading-tight">
              ระบบบริหารการเดินทางไปราชการ
            </h2>
            <p className="text-xs sm:text-sm text-[rgba(17,19,21,0.62)] mt-2 font-normal leading-relaxed max-w-2xl">
              บันทึกคำสั่งไปราชการ มอบหมายยานพาหนะส่วนกลาง พลขับ และคำนวณงบประมาณค่าเบี้ยเลี้ยง ค่าที่พัก และพาหนะเดินทางตามระเบียบกระทรวงการคลัง
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleExport}
              className="px-4 py-2.5 rounded-xl bg-white/80 hover:bg-white border border-[rgba(17,19,21,0.12)] text-[#111315] text-xs font-medium transition shadow-2xs flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#234A78] stroke-[1.5]" />
              <span>ส่งออก CSV</span>
            </button>
            {currentRole !== 'viewer' && (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-4 py-2.5 rounded-xl bg-[#17324F] hover:bg-[#234A78] text-white text-xs font-medium transition shadow-2xs flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[1.5]" />
                <span>ขออนุมัติไปราชการ</span>
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
              TOTAL ITINERARIES
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">ภารกิจไปราชการทั้งหมด</div>
            <div className="text-3xl font-light font-mono text-[#111315] mt-1">{travelRecords.length}</div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">ปีงบประมาณ ๒๕๖๙</div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              ON-FIELD MISSIONS
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">อยู่ระหว่างปฏิบัติงาน</div>
            <div className="text-3xl font-light font-mono text-[#234A78] mt-1">
              {travelRecords.filter(t => t.status === 'อยู่ระหว่างปฏิบัติงาน').length}
            </div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">กำลังปฏิบัติภารกิจในพื้นที่</div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              PENDING APPROVAL
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">รออนุมัติเดินทาง</div>
            <div className="text-3xl font-light font-mono text-[#A77A35] mt-1">
              {travelRecords.filter(t => t.status === 'รออนุมัติ').length}
            </div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">เสนอแฟ้มรอลงนาม</div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              DISBURSED EXPENDITURE
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">งบประมาณค่าใช้จ่ายรวม</div>
            <div className="text-2xl sm:text-3xl font-light font-mono text-[#42695B] mt-1 truncate">
              {formatCurrency(totalTravelCost)}
            </div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">เบี้ยเลี้ยง พาหนะ ที่พัก</div>
        </div>
      </section>

      {/* 03 — SEARCH & FILTERS */}
      <section className="glass rounded-[22px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[rgba(17,19,21,0.4)] absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.5]" />
          <input
            type="text"
            placeholder="ค้นหาผู้เดินทาง, จังหวัด, วัตถุประสงค์, หรือเลขคำสั่ง..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/70 border border-[rgba(17,19,21,0.08)] text-xs text-[#111315] placeholder:text-[rgba(17,19,21,0.4)] focus:outline-hidden focus:border-[#234A78]/50 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedStatus}
            onChange={e => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs rounded-xl border border-[rgba(17,19,21,0.08)] px-3 py-2 bg-white/80 text-[#111315] focus:outline-hidden cursor-pointer"
          >
            <option value="all">ทุกสถานะ</option>
            {TRAVEL_STATUSES.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={selectedVehicle}
            onChange={e => {
              setSelectedVehicle(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs rounded-xl border border-[rgba(17,19,21,0.08)] px-3 py-2 bg-white/80 text-[#111315] focus:outline-hidden cursor-pointer"
          >
            <option value="all">ทุกประเภทยานพาหนะ</option>
            {VEHICLE_TYPES.map(v => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          <select
            value={selectedUnit}
            onChange={e => {
              setSelectedUnit(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs rounded-xl border border-[rgba(17,19,21,0.08)] px-3 py-2 bg-white/80 text-[#111315] focus:outline-hidden cursor-pointer"
          >
            <option value="all">ทุกกลุ่มงาน</option>
            {units.map(u => (
              <option key={u.unit_id} value={u.unit_name}>
                {u.unit_name}
              </option>
            ))}
          </select>

          {(selectedStatus !== 'all' || selectedVehicle !== 'all' || selectedUnit !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('all');
                setSelectedVehicle('all');
                setSelectedUnit('all');
                setCurrentPage(1);
              }}
              className="text-xs text-[#A84E4E] hover:underline px-2 py-1 flex items-center gap-1 font-mono cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> ล้างตัวกรอง
            </button>
          )}
        </div>
      </section>

      {/* 04 — EDITORIAL DATA TABLE */}
      <section className="glass rounded-[24px] overflow-hidden border border-[rgba(17,19,21,0.08)] shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[rgba(17,19,21,0.03)] border-b border-[rgba(17,19,21,0.08)] text-[rgba(17,19,21,0.5)] font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">ผู้เดินทาง / สังกัด</th>
                <th className="py-3.5 px-3">คำสั่ง / วัตถุประสงค์</th>
                <th className="py-3.5 px-3">ปลายทาง / จังหวัด</th>
                <th className="py-3.5 px-3">ช่วงเวลาเดินทาง</th>
                <th className="py-3.5 px-3">ยานพาหนะ</th>
                <th className="py-3.5 px-3 text-right">ค่าใช้จ่ายรวม</th>
                <th className="py-3.5 px-3 text-center">สถานะ</th>
                <th className="py-3.5 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(17,19,21,0.06)]">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[rgba(17,19,21,0.4)]">
                    <Briefcase className="w-8 h-8 mx-auto text-[rgba(17,19,21,0.3)] mb-2 stroke-[1.5]" />
                    ไม่พบข้อมูลการไปราชการตามเงื่อนไขที่ระบุ
                  </td>
                </tr>
              ) : (
                paginatedItems.map(item => {
                  const days = calculateDays(item.departure_date, item.return_date);
                  const totalCost = item.allowance_amount + item.transport_cost + item.accommodation_cost;

                  return (
                    <tr key={item.travel_id} className="hover:bg-white/60 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#111315]">{item.traveler_name}</div>
                        <div className="text-[11px] text-[rgba(17,19,21,0.5)]">{item.position}</div>
                        <div className="text-[10px] text-[#234A78] font-mono mt-0.5">{item.unit}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-mono text-[11px] text-[#234A78] font-semibold">
                          {item.order_number}
                        </span>
                        <div className="font-medium text-[#111315] text-xs mt-0.5 max-w-xs line-clamp-1">
                          {item.purpose}
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1 font-semibold text-[#111315]">
                          <MapPin className="w-3 h-3 text-[#234A78] shrink-0 stroke-[1.5]" />
                          <span>จ.{item.province}</span>
                        </div>
                        <div className="text-[11px] text-[rgba(17,19,21,0.5)] truncate max-w-[130px]">
                          {item.destination}
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-mono text-[11px] text-[#111315]">
                          {formatThaiDate(item.departure_date, true)} - {formatThaiDate(item.return_date, true)}
                        </div>
                        <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded-md text-[10px] font-mono bg-[rgba(17,19,21,0.05)] text-[rgba(17,19,21,0.6)]">
                          ({days} วัน)
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="text-[#111315] font-medium">{item.vehicle_type}</div>
                        {item.vehicle_plate && (
                          <div className="text-[10px] text-[rgba(17,19,21,0.45)] font-mono">{item.vehicle_plate}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-semibold text-[#42695B]">
                        {formatCurrency(totalCost)}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono whitespace-nowrap ${
                            item.status === 'เสร็จสิ้น'
                              ? 'bg-[#42695B]/10 text-[#42695B]'
                              : item.status === 'อยู่ระหว่างปฏิบัติงาน'
                              ? 'bg-[#234A78]/10 text-[#234A78]'
                              : item.status === 'อนุมัติแล้ว'
                              ? 'bg-[#42695B]/10 text-[#42695B]'
                              : item.status === 'ยกเลิก'
                              ? 'bg-[#A84E4E]/10 text-[#A84E4E]'
                              : 'bg-[#A77A35]/10 text-[#A77A35]'
                          }`}
                        >
                          ● {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setViewingItem(item)}
                            className="p-1.5 rounded-lg hover:bg-white text-[rgba(17,19,21,0.4)] hover:text-[#234A78] transition"
                            title="ดูรายละเอียด"
                          >
                            <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
                          </button>

                          {currentRole !== 'viewer' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(item)}
                                className="p-1.5 rounded-lg hover:bg-white text-[rgba(17,19,21,0.4)] hover:text-[#234A78] transition"
                                title="แก้ไข"
                              >
                                <Edit2 className="w-3.5 h-3.5 stroke-[1.5]" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingId(item.travel_id)}
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

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredRecords.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </section>

      {/* 05 — ADD / EDIT TRAVEL MODAL */}
      {(isAddModalOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111315]/40 backdrop-blur-[12px]">
          <div className="bg-white/95 backdrop-blur-[24px] rounded-[28px] shadow-[0_30px_80px_rgba(18,23,27,0.15)] max-w-2xl w-full p-6 border border-[rgba(17,19,21,0.1)] max-h-[90vh] overflow-y-auto text-[#111315]">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(17,19,21,0.08)]">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#234A78] stroke-[1.5]" />
                <h3 className="text-base font-medium text-[#111315]">
                  {editingItem ? `แก้ไขรายการไปราชการ (${editingItem.travel_id})` : 'บันทึกการขออนุมัติไปราชการ'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#111315] mb-1">เลขที่คำสั่ง / หนังสือขออนุมัติ</label>
                  <input
                    type="text"
                    placeholder="เช่น ศอ.คำสั่ง 102/2569"
                    value={formOrderNumber}
                    onChange={e => setFormOrderNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden focus:border-[#234A78]/50"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111315] mb-1">ผู้เดินทาง (เลือกจากบุคลากร)</label>
                  <select
                    value={formTravelerName}
                    onChange={e => handleTravelerSelect(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden focus:border-[#234A78]/50"
                  >
                    {personnel.map(p => (
                      <option key={p.person_id} value={p.name}>
                        {p.rank} {p.name} ({p.department})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#111315] mb-1">ตำแหน่ง</label>
                  <input
                    type="text"
                    value={formPosition}
                    onChange={e => setFormPosition(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-[rgba(17,19,21,0.03)] focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111315] mb-1">กลุ่มงาน / สังกัด</label>
                  <input
                    type="text"
                    value={formUnit}
                    onChange={e => setFormUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-[rgba(17,19,21,0.03)] focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#111315] mb-1">
                  วัตถุประสงค์การไปราชการ <span className="text-[#A84E4E]">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="เช่น ตรวจราชการและติดตามการปฏิบัติงานสายอำนวยการ..."
                  value={formPurpose}
                  onChange={e => setFormPurpose(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden focus:border-[#234A78]/50"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#111315] mb-1">
                    สถานที่ปลายทาง / หน่วยงาน <span className="text-[#A84E4E]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น มณฑลทหารบกที่ 33 ค่ายกาวิละ"
                    value={formDestination}
                    onChange={e => setFormDestination(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden focus:border-[#234A78]/50"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111315] mb-1">
                    จังหวัดปลายทาง <span className="text-[#A84E4E]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น เชียงใหม่"
                    value={formProvince}
                    onChange={e => setFormProvince(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden focus:border-[#234A78]/50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-[rgba(17,19,21,0.03)] rounded-2xl border border-[rgba(17,19,21,0.06)]">
                <div>
                  <label className="block font-medium text-[#111315] mb-1">วันที่ออกเดินทาง</label>
                  <input
                    type="date"
                    value={formDepartureDate}
                    onChange={e => setFormDepartureDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111315] mb-1">วันที่เดินทางกลับ</label>
                  <input
                    type="date"
                    value={formReturnDate}
                    onChange={e => setFormReturnDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-[#111315] mb-1">ยานพาหนะ</label>
                  <select
                    value={formVehicleType}
                    onChange={e => setFormVehicleType(e.target.value as VehicleType)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden"
                  >
                    {VEHICLE_TYPES.map(v => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#111315] mb-1">หมายเลขทะเบียนรถ</label>
                  <input
                    type="text"
                    placeholder="เช่น 1 นข 4521 กทม."
                    value={formVehiclePlate}
                    onChange={e => setFormVehiclePlate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111315] mb-1">พลขับประจำรถ</label>
                  <input
                    type="text"
                    placeholder="เช่น จ.ส.อ. วิเชียร เกิดผล"
                    value={formDriverName}
                    onChange={e => setFormDriverName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Cost Estimator */}
              <div className="p-3.5 border border-[rgba(17,19,21,0.08)] rounded-2xl space-y-2 bg-[rgba(17,19,21,0.02)]">
                <span className="font-semibold text-[#111315] block text-xs">
                  ประมาณการค่าใช้จ่ายในการเดินทาง (บาท)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[rgba(17,19,21,0.6)] mb-1 text-[11px]">ค่าเบี้ยเลี้ยง</label>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      value={formAllowance}
                      onChange={e => setFormAllowance(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[rgba(17,19,21,0.6)] mb-1 text-[11px]">ค่าพาหนะ / น้ำมัน</label>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      value={formTransport}
                      onChange={e => setFormTransport(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[rgba(17,19,21,0.6)] mb-1 text-[11px]">ค่าที่พัก</label>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      value={formAccommodation}
                      onChange={e => setFormAccommodation(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white font-mono"
                    />
                  </div>
                </div>
                <div className="pt-2 text-right text-xs font-mono font-bold text-[#42695B]">
                  รวมทั้งสิ้น: {formatCurrency(formAllowance + formTransport + formAccommodation)}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#111315] mb-1">สถานะ</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as TravelStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden"
                  >
                    {TRAVEL_STATUSES.map(st => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#111315] mb-1">หมายเหตุเพิ่มเติม</label>
                  <input
                    type="text"
                    value={formNotes}
                    onChange={e => setFormNotes(e.target.value)}
                    placeholder="เช่น เบิกจ่ายจากงบโครงการตรวจราชการ..."
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden"
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
                  {editingItem ? 'บันทึกการแก้ไข' : 'บันทึกการไปราชการ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 06 — VIEW TRAVEL DETAILS MODAL */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111315]/40 backdrop-blur-[12px]">
          <div className="bg-white/95 backdrop-blur-[24px] rounded-[28px] shadow-[0_30px_80px_rgba(18,23,27,0.15)] max-w-xl w-full p-6 border border-[rgba(17,19,21,0.1)] text-[#111315]">
            <div className="flex items-start justify-between pb-3 border-b border-[rgba(17,19,21,0.08)]">
              <div>
                <span className="text-xs font-mono font-bold text-[#234A78]">{viewingItem.travel_id}</span>
                <h3 className="text-base font-medium text-[#111315] mt-1">{viewingItem.traveler_name}</h3>
                <p className="text-xs text-[rgba(17,19,21,0.5)] font-mono">{viewingItem.position} • {viewingItem.unit}</p>
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
              <div className="p-3.5 bg-[rgba(17,19,21,0.03)] rounded-2xl space-y-1.5 border border-[rgba(17,19,21,0.06)]">
                <div className="flex items-center justify-between">
                  <span className="text-[rgba(17,19,21,0.5)]">เลขที่คำสั่ง:</span>
                  <span className="font-semibold font-mono text-[#234A78]">{viewingItem.order_number}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[rgba(17,19,21,0.5)]">วัตถุประสงค์:</span>
                  <span className="font-medium text-[#111315]">{viewingItem.purpose}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[rgba(17,19,21,0.5)]">ปลายทาง:</span>
                  <span className="font-semibold text-[#111315]">{viewingItem.destination} (จ.{viewingItem.province})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[rgba(17,19,21,0.5)]">ระยะเวลา:</span>
                  <span className="font-semibold font-mono text-[#111315]">
                    {formatThaiDate(viewingItem.departure_date)} - {formatThaiDate(viewingItem.return_date)} ({calculateDays(viewingItem.departure_date, viewingItem.return_date)} วัน)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-white/70 rounded-2xl border border-[rgba(17,19,21,0.08)]">
                <div>
                  <span className="text-[rgba(17,19,21,0.5)] block">ยานพาหนะ:</span>
                  <span className="font-semibold text-[#111315]">{viewingItem.vehicle_type}</span>
                  {viewingItem.vehicle_plate && (
                    <div className="text-[rgba(17,19,21,0.45)] text-[11px] font-mono">{viewingItem.vehicle_plate}</div>
                  )}
                </div>
                <div>
                  <span className="text-[rgba(17,19,21,0.5)] block">พลขับ:</span>
                  <span className="font-semibold text-[#111315]">{viewingItem.driver_name || '-'}</span>
                </div>
              </div>

              <div className="border border-[rgba(17,19,21,0.08)] rounded-2xl p-3.5 space-y-1.5 bg-white/60">
                <span className="font-semibold text-[#111315] block">รายละเอียดค่าใช้จ่าย:</span>
                <div className="flex items-center justify-between text-[rgba(17,19,21,0.7)] font-mono">
                  <span>ค่าเบี้ยเลี้ยง:</span>
                  <span>{formatCurrency(viewingItem.allowance_amount)}</span>
                </div>
                <div className="flex items-center justify-between text-[rgba(17,19,21,0.7)] font-mono">
                  <span>ค่าพาหนะ / น้ำมัน:</span>
                  <span>{formatCurrency(viewingItem.transport_cost)}</span>
                </div>
                <div className="flex items-center justify-between text-[rgba(17,19,21,0.7)] font-mono">
                  <span>ค่าที่พัก:</span>
                  <span>{formatCurrency(viewingItem.accommodation_cost)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[rgba(17,19,21,0.06)] font-bold text-sm font-mono">
                  <span>รวมค่าใช้จ่ายทั้งสิ้น:</span>
                  <span className="text-[#42695B]">
                    {formatCurrency(viewingItem.allowance_amount + viewingItem.transport_cost + viewingItem.accommodation_cost)}
                  </span>
                </div>
              </div>

              {viewingItem.notes && (
                <div className="p-3 bg-[rgba(17,19,21,0.03)] rounded-2xl text-[rgba(17,19,21,0.7)]">
                  <span className="font-semibold">หมายเหตุ: </span>
                  {viewingItem.notes}
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-[rgba(17,19,21,0.08)] flex items-center justify-end">
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-[#17324F] text-white hover:bg-[#234A78] transition cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 07 — DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={Boolean(deletingId)}
        title="ยืนยันการลบรายการไปราชการ"
        message="คุณต้องการลบรายการไปราชการนี้ออกจากระบบหรือไม่?"
        onConfirm={() => {
          if (deletingId) deleteTravel(deletingId);
          setDeletingId(null);
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
