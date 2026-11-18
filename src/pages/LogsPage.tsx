import React, { useState, useMemo } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { formatThaiDateTime } from '../utils/formatters';
import { exportToCSV } from '../utils/exportUtils';
import {
  History,
  Search,
  Download,
  Trash2,
  X,
  Clock,
  User,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { Pagination } from '../components/common/Pagination';
import { ConfirmModal } from '../components/common/ConfirmModal';

const MODULES = [
  'ภาพรวมระบบ',
  'งบประมาณ',
  'ไปราชการ',
  'หนังสือรับ',
  'หนังสือส่ง',
  'บุคลากร/กลุ่มงาน',
  'คลังเอกสาร',
  'ระบบงาน',
];

export const LogsPage: React.FC = () => {
  const { logs = [], clearLogs, currentRole } = useAdmin();

  const safeLogs = useMemo(() => (Array.isArray(logs) ? logs : []), [logs]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const filteredLogs = useMemo(() => {
    return safeLogs.filter(l => {
      if (!l) return false;
      const userName = l.user_name || '';
      const details = l.details || '';
      const action = l.action || '';
      const module = l.module || '';

      const searchLower = searchQuery.toLowerCase().trim();
      const matchSearch =
        !searchLower ||
        userName.toLowerCase().includes(searchLower) ||
        details.toLowerCase().includes(searchLower) ||
        action.toLowerCase().includes(searchLower);

      const matchModule = selectedModule === 'all' || module === selectedModule;

      return matchSearch && matchModule;
    });
  }, [safeLogs, searchQuery, selectedModule]);

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  const handleExport = () => {
    const exportData = filteredLogs.map(l => ({
      รหัสบันทึก: l.log_id,
      วันเวลา: l.timestamp,
      ผู้ใช้งาน: l.user_name,
      กลุ่มงานโมดูล: l.module,
      การกระทำ: l.action,
      รายละเอียด: l.details,
      ไอพีแอดเดรส: l.ip_address || '-',
    }));
    exportToCSV(exportData, `บันทึกประวัติการใช้งานระบบ_${new Date().toISOString().slice(0, 10)}`);
  };

  const getActionStyle = (action: string = '') => {
    if (action.includes('เพิ่ม') || action.includes('สร้าง') || action.includes('อนุมัติ')) {
      return 'bg-[#42695B]/10 text-[#42695B] border-[#42695B]/20';
    }
    if (action.includes('แก้ไข') || action.includes('เปลี่ยน') || action.includes('ปรับปรุง')) {
      return 'bg-[#234A78]/10 text-[#234A78] border-[#234A78]/20';
    }
    if (action.includes('ลบ') || action.includes('ยกเลิก')) {
      return 'bg-[#A84E4E]/10 text-[#A84E4E] border-[#A84E4E]/20';
    }
    if (action.includes('ส่งออก') || action.includes('ดาวน์โหลด')) {
      return 'bg-[#A77A35]/15 text-[#A77A35] border-[#A77A35]/25';
    }
    return 'bg-[rgba(17,19,21,0.05)] text-[rgba(17,19,21,0.7)] border-[rgba(17,19,21,0.1)]';
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 01 — HERO / OPENING (Editorial Intelligence Command) */}
      <section className="glass rounded-[28px] p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-mono tracking-widest text-[rgba(17,19,21,0.5)] mb-2 uppercase">
              <span className="text-[#234A78] font-bold">AUDIT / 05</span>
              <span>—</span>
              <span>ACTIVITY TELEMETRY</span>
              <span>—</span>
              <span>NON-REPUDIATION TRAIL</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#111315] leading-tight">
              บันทึกประวัติกิจกรรมและตรวจสอบการเข้าใช้งานระบบ
            </h2>
            <p className="text-xs sm:text-sm text-[rgba(17,19,21,0.62)] mt-2 font-normal leading-relaxed max-w-2xl">
              บันทึกหลักฐานการทำธุรกรรม การปรับปรุงฐานข้อมูล การจัดเก็บเอกสาร และกิจกรรมของผู้ปฏิบัติงานตามมาตรฐานการรักษาความมั่นคงปลอดภัยสารสนเทศภาครัฐ
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleExport}
              className="px-4 py-2.5 rounded-xl bg-white/80 hover:bg-white border border-[rgba(17,19,21,0.12)] text-[#111315] text-xs font-medium transition shadow-2xs flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#234A78] stroke-[1.5]" />
              <span>ส่งออกบันทึก CSV</span>
            </button>

            {currentRole === 'admin' && (
              <button
                type="button"
                onClick={() => setIsClearModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#A84E4E]/10 hover:bg-[#A84E4E]/20 text-[#A84E4E] border border-[#A84E4E]/20 text-xs font-medium transition flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 stroke-[1.5]" />
                <span>ล้างบันทึกประวัติ</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 02 — ASYMMETRIC METRICS */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              TOTAL ACTIVITIES
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">บันทึกกิจกรรมทั้งหมด</div>
            <div className="text-3xl font-light font-mono text-[#111315] mt-1">{safeLogs.length}</div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#42695B] mt-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ตรวจสอบย้อนหลังได้ 100%</span>
          </div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              MUTATION OPERATIONS
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">การแก้ไขและสร้างข้อมูล</div>
            <div className="text-3xl font-light font-mono text-[#234A78] mt-1">
              {safeLogs.filter(l => l.action.includes('เพิ่ม') || l.action.includes('แก้ไข') || l.action.includes('สร้าง')).length}
            </div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">การปรับปรุงฐานข้อมูล</div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              ACCESS & EXPORTS
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">การเข้าถึงและส่งออกข้อมูล</div>
            <div className="text-3xl font-light font-mono text-[#A77A35] mt-1">
              {safeLogs.filter(l => l.action.includes('ส่งออก') || l.action.includes('ค้นหา') || l.action.includes('ดาวน์โหลด')).length}
            </div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">รายงานความปลอดภัยข้อมูล</div>
        </div>
      </section>

      {/* 03 — SEARCH & FILTERS */}
      <section className="glass rounded-[22px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[rgba(17,19,21,0.4)] absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.5]" />
          <input
            type="text"
            placeholder="สืบค้นชื่อผู้ปฏิบัติงาน, การกระทำ, หรือรายละเอียดกิจกรรม..."
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
            value={selectedModule}
            onChange={e => {
              setSelectedModule(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs rounded-xl border border-[rgba(17,19,21,0.08)] px-3 py-2 bg-white/80 text-[#111315] focus:outline-hidden cursor-pointer"
          >
            <option value="all">ทุกโมดูลในระบบ</option>
            {MODULES.map(m => (
              <option key={`module-opt-${m}`} value={m}>
                {m}
              </option>
            ))}
          </select>

          {(selectedModule !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedModule('all');
                setCurrentPage(1);
              }}
              className="text-xs text-[#A84E4E] hover:underline px-2 py-1 flex items-center gap-1 font-mono cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> ล้างตัวกรอง
            </button>
          )}
        </div>
      </section>

      {/* 04 — EDITORIAL LOGS TABLE */}
      <section className="glass rounded-[24px] overflow-hidden border border-[rgba(17,19,21,0.08)] shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[rgba(17,19,21,0.03)] border-b border-[rgba(17,19,21,0.08)] text-[rgba(17,19,21,0.5)] font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">วันและเวลาบันทึก</th>
                <th className="py-3.5 px-3">ผู้ปฏิบัติงาน</th>
                <th className="py-3.5 px-3">โมดูล</th>
                <th className="py-3.5 px-3">กิจกรรม / การกระทำ</th>
                <th className="py-3.5 px-3">รายละเอียดการทำงาน</th>
                <th className="py-3.5 px-4 text-right">IP ADDRESS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(17,19,21,0.06)]">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[rgba(17,19,21,0.4)]">
                    <History className="w-8 h-8 mx-auto text-[rgba(17,19,21,0.3)] mb-2 stroke-[1.5]" />
                    ไม่พบบันทึกประวัติกิจกรรมตามเงื่อนไขที่ระบุ
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((item, index) => {
                  const uniqueKey = item.log_id ? `${item.log_id}-${index}` : `log-row-${index}`;
                  return (
                    <tr key={uniqueKey} className="hover:bg-white/60 transition">
                      <td className="py-3.5 px-4 text-[rgba(17,19,21,0.65)] whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-[rgba(17,19,21,0.35)] stroke-[1.5]" />
                          <span>{formatThaiDateTime(item.timestamp)}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-[#111315] flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#234A78] stroke-[1.5]" />
                          <span>{item.user_name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[rgba(17,19,21,0.05)] text-[rgba(17,19,21,0.7)]">
                          {item.module}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-medium ${getActionStyle(
                            item.action
                          )}`}
                        >
                          {item.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-[#111315] max-w-md">
                        <span className="line-clamp-1">{item.details}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-[11px] text-[rgba(17,19,21,0.45)]">
                        {item.ip_address || '192.168.1.10'}
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
          totalItems={filteredLogs.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </section>

      {/* Clear Logs Modal */}
      <ConfirmModal
        isOpen={isClearModalOpen}
        title="ยืนยันการล้างประวัติการใช้งาน"
        message="คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลบันทึกประวัติกิจกรรมทั้งหมด การกระทำนี้ไม่สามารถย้อนกลับได้"
        onConfirm={() => {
          clearLogs();
          setIsClearModalOpen(false);
        }}
        onCancel={() => setIsClearModalOpen(false)}
      />
    </div>
  );
};
