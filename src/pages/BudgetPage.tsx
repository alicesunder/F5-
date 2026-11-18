import React, { useState, useMemo } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { BudgetItem, BudgetCategory, BudgetStatus } from '../types';
import { formatCurrency, formatThaiDate } from '../utils/formatters';
import { exportToCSV } from '../utils/exportUtils';
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  Eye,
  X,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  ArrowUpRight,
} from 'lucide-react';
import { Pagination } from '../components/common/Pagination';
import { ConfirmModal } from '../components/common/ConfirmModal';

const BUDGET_CATEGORIES: BudgetCategory[] = [
  'งบบุคลากร',
  'งบดำเนินงาน',
  'งบลงทุน',
  'งบอุดหนุน',
  'งบรายจ่ายอื่น',
];

const BUDGET_STATUSES: BudgetStatus[] = [
  'อนุมัติแล้ว',
  'อยู่ระหว่างเบิกจ่าย',
  'เบิกจ่ายครบแล้ว',
  'ชะลอการใช้จ่าย',
];

export const BudgetPage: React.FC = () => {
  const {
    budgets,
    units,
    kpis,
    addBudget,
    updateBudget,
    deleteBudget,
    currentRole,
  } = useAdmin();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [viewingItem, setViewingItem] = useState<BudgetItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formFiscalYear, setFormFiscalYear] = useState<number>(2569);
  const [formCategory, setFormCategory] = useState<BudgetCategory>('งบดำเนินงาน');
  const [formProjectName, setFormProjectName] = useState('');
  const [formAllocated, setFormAllocated] = useState<number>(0);
  const [formSpent, setFormSpent] = useState<number>(0);
  const [formCommitted, setFormCommitted] = useState<number>(0);
  const [formResponsibleUnit, setFormResponsibleUnit] = useState(units[0]?.unit_name || '');
  const [formStatus, setFormStatus] = useState<BudgetStatus>('อนุมัติแล้ว');
  const [formNotes, setFormNotes] = useState('');

  // Filtering Logic
  const filteredBudgets = useMemo(() => {
    return budgets.filter(b => {
      const matchSearch =
        !searchQuery ||
        b.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.budget_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.responsible_unit.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat = selectedCategory === 'all' || b.budget_category === selectedCategory;
      const matchUnit = selectedUnit === 'all' || b.responsible_unit === selectedUnit;
      const matchStatus = selectedStatus === 'all' || b.status === selectedStatus;

      return matchSearch && matchCat && matchUnit && matchStatus;
    });
  }, [budgets, searchQuery, selectedCategory, selectedUnit, selectedStatus]);

  // Pagination Slice
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBudgets.slice(start, start + pageSize);
  }, [filteredBudgets, currentPage, pageSize]);

  // Open Edit
  const handleOpenEdit = (item: BudgetItem) => {
    setEditingItem(item);
    setFormFiscalYear(item.fiscal_year);
    setFormCategory(item.budget_category);
    setFormProjectName(item.project_name);
    setFormAllocated(item.allocated_amount);
    setFormSpent(item.spent_amount);
    setFormCommitted(item.committed_amount);
    setFormResponsibleUnit(item.responsible_unit);
    setFormStatus(item.status);
    setFormNotes(item.notes || '');
  };

  // Open Add
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormFiscalYear(2569);
    setFormCategory('งบดำเนินงาน');
    setFormProjectName('');
    setFormAllocated(0);
    setFormSpent(0);
    setFormCommitted(0);
    setFormResponsibleUnit(units[0]?.unit_name || '');
    setFormStatus('อนุมัติแล้ว');
    setFormNotes('');
    setIsAddModalOpen(true);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProjectName.trim()) return;

    if (editingItem) {
      updateBudget({
        ...editingItem,
        fiscal_year: formFiscalYear,
        budget_category: formCategory,
        project_name: formProjectName.trim(),
        allocated_amount: Number(formAllocated),
        spent_amount: Number(formSpent),
        committed_amount: Number(formCommitted),
        remaining_amount: Number(formAllocated) - Number(formSpent),
        responsible_unit: formResponsibleUnit,
        status: formStatus,
        notes: formNotes.trim(),
      });
      setEditingItem(null);
    } else {
      addBudget({
        fiscal_year: formFiscalYear,
        budget_category: formCategory,
        project_name: formProjectName.trim(),
        allocated_amount: Number(formAllocated),
        spent_amount: Number(formSpent),
        committed_amount: Number(formCommitted),
        responsible_unit: formResponsibleUnit,
        status: formStatus,
        notes: formNotes.trim(),
      });
      setIsAddModalOpen(false);
    }
  };

  // Export CSV
  const handleExport = () => {
    const exportData = filteredBudgets.map(b => ({
      รหัสงบประมาณ: b.budget_id,
      ปีงบประมาณ: b.fiscal_year,
      หมวดรายจ่าย: b.budget_category,
      ชื่อโครงการ: b.project_name,
      กลุ่มงานรับผิดชอบ: b.responsible_unit,
      วงเงินจัดสรร: b.allocated_amount,
      เบิกจ่ายแล้ว: b.spent_amount,
      ผูกพันงบประมาณ: b.committed_amount,
      คงเหลือ: b.remaining_amount,
      ร้อยละการเบิกจ่าย: ((b.spent_amount / b.allocated_amount) * 100).toFixed(2),
      สถานะ: b.status,
      หมายเหตุ: b.notes || '',
    }));
    exportToCSV(exportData, `รายงานงบประมาณฝ่ายอำนวยการ_${new Date().toISOString().slice(0, 10)}`);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 01 — ASYMMETRIC FINANCIAL INTELLIGENCE TILES */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* Total Allocation Tile (Span 4 cols) */}
        <div className="lg:col-span-4 glass rounded-[24px] p-6 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.45)] uppercase mb-1">
              01 // TOTAL FISCAL ALLOCATION
            </div>
            <div className="text-[13px] text-[rgba(17,19,21,0.6)]">
              งบประมาณจัดสรรรวม (ปี 2569)
            </div>
            <div className="text-3xl sm:text-4xl font-light tracking-tight text-[#111315] font-mono mt-1">
              {formatCurrency(kpis.totalBudget)}
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-[rgba(17,19,21,0.06)] flex items-center justify-between text-xs font-mono text-[rgba(17,19,21,0.55)]">
            <span>5 หมวดรายจ่าย</span>
            <span className="text-[#234A78] font-medium">{budgets.length} โครงการอนุมัติ</span>
          </div>
        </div>

        {/* Spent Actual (Span 3 cols) */}
        <div className="lg:col-span-3 glass rounded-[24px] p-6 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.45)] uppercase mb-1">
              02 // EXPENDED REALIZATION
            </div>
            <div className="text-[13px] text-[rgba(17,19,21,0.6)]">
              เบิกจ่ายจริงแล้ว
            </div>
            <div className="text-3xl sm:text-4xl font-light tracking-tight text-[#42695B] font-mono mt-1">
              {formatCurrency(kpis.spentBudget)}
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-[rgba(17,19,21,0.06)] flex items-center justify-between text-xs font-mono">
            <span className="text-[rgba(17,19,21,0.55)]">ความก้าวหน้า</span>
            <span className="text-[#42695B] font-semibold">{kpis.spentPercentage.toFixed(1)}%</span>
          </div>
        </div>

        {/* Committed PO (Span 2 cols) */}
        <div className="lg:col-span-2 glass rounded-[24px] p-6 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.45)] uppercase mb-1">
              03 // COMMITTED PO
            </div>
            <div className="text-[13px] text-[rgba(17,19,21,0.6)]">
              ผูกพันงบประมาณ
            </div>
            <div className="text-2xl sm:text-3xl font-light tracking-tight text-[#A77A35] font-mono mt-1">
              {formatCurrency(kpis.committedBudget)}
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-[rgba(17,19,21,0.06)] text-[11px] font-mono text-[rgba(17,19,21,0.5)]">
            รอตรวจรับงวด
          </div>
        </div>

        {/* Net Remaining (Span 3 cols) */}
        <div className="lg:col-span-3 glass rounded-[24px] p-6 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.45)] uppercase mb-1">
              04 // NET BALANCE REMAINING
            </div>
            <div className="text-[13px] text-[rgba(17,19,21,0.6)]">
              งบประมาณคงเหลือสุทธิ
            </div>
            <div className="text-3xl sm:text-4xl font-light tracking-tight text-[#111315] font-mono mt-1">
              {formatCurrency(kpis.remainingBudget)}
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-[rgba(17,19,21,0.06)]">
            <div className="w-full bg-[rgba(17,19,21,0.06)] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#234A78] h-full rounded-full transition-all"
                style={{ width: `${Math.min(kpis.spentPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 02 — EDITORIAL SEARCH, FILTER & ACTION BAR */}
      <section className="glass rounded-[22px] p-4 sm:p-5 space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Unified Search Field */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgba(17,19,21,0.4)] stroke-[1.5]" />
            <input
              type="text"
              placeholder="ค้นหาชื่อโครงการ, รหัสงบประมาณ (BG-69-xxx), หรือกลุ่มงาน..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/70 border border-[rgba(17,19,21,0.09)] text-xs sm:text-sm text-[#111315] placeholder:text-[rgba(17,19,21,0.4)] focus:outline-hidden focus:border-[#234A78]/50 focus:bg-white transition"
            />
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white border border-[rgba(17,19,21,0.1)] text-xs font-medium text-[#111315] flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
              title="ส่งออกตารางเป็นไฟล์ CSV"
            >
              <Download className="w-3.5 h-3.5 text-[rgba(17,19,21,0.5)] stroke-[1.5]" />
              <span>ส่งออก CSV</span>
            </button>

            {currentRole !== 'viewer' && (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-4 py-2 rounded-xl bg-[#17324F] hover:bg-[#234A78] text-white text-xs font-medium flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>เพิ่มรายการงบประมาณ</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-[rgba(17,19,21,0.06)] text-xs">
          <div className="flex items-center gap-1.5 text-[rgba(17,19,21,0.5)] text-[11px] font-mono uppercase">
            <Filter className="w-3 h-3 stroke-[1.5]" />
            <span>ตัวกรอง:</span>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 rounded-xl bg-white/80 border border-[rgba(17,19,21,0.09)] text-xs text-[#111315] focus:outline-hidden cursor-pointer"
          >
            <option value="all">ทุกหมวดรายจ่าย</option>
            {BUDGET_CATEGORIES.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Unit Filter */}
          <select
            value={selectedUnit}
            onChange={e => {
              setSelectedUnit(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 rounded-xl bg-white/80 border border-[rgba(17,19,21,0.09)] text-xs text-[#111315] focus:outline-hidden cursor-pointer"
          >
            <option value="all">ทุกกลุ่มงาน</option>
            {units.map(u => (
              <option key={u.unit_id} value={u.unit_name}>
                {u.unit_name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 rounded-xl bg-white/80 border border-[rgba(17,19,21,0.09)] text-xs text-[#111315] focus:outline-hidden cursor-pointer"
          >
            <option value="all">ทุกสถานะ</option>
            {BUDGET_STATUSES.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {(selectedCategory !== 'all' || selectedUnit !== 'all' || selectedStatus !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedUnit('all');
                setSelectedStatus('all');
                setCurrentPage(1);
              }}
              className="text-xs text-[#A84E4E] hover:underline ml-auto flex items-center gap-1 font-mono cursor-pointer"
            >
              <X className="w-3 h-3" /> ล้างตัวกรอง
            </button>
          )}
        </div>
      </section>

      {/* 03 — EDITORIAL DATA TABLE */}
      <section className="glass rounded-[24px] overflow-hidden border border-[rgba(17,19,21,0.08)] shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[rgba(17,19,21,0.03)] border-b border-[rgba(17,19,21,0.08)] text-[rgba(17,19,21,0.5)] font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">รหัส / โครงการ</th>
                <th className="py-3.5 px-3">หมวดรายจ่าย</th>
                <th className="py-3.5 px-3">กลุ่มงานรับผิดชอบ</th>
                <th className="py-3.5 px-4 text-right">วงเงินจัดสรร</th>
                <th className="py-3.5 px-4 text-right">เบิกจ่ายแล้ว</th>
                <th className="py-3.5 px-4 text-right">คงเหลือ</th>
                <th className="py-3.5 px-3 text-center">ร้อยละ</th>
                <th className="py-3.5 px-3 text-center">สถานะ</th>
                <th className="py-3.5 px-5 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(17,19,21,0.06)]">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-14 text-center text-[rgba(17,19,21,0.4)]">
                    <DollarSign className="w-8 h-8 mx-auto text-[rgba(17,19,21,0.25)] mb-2 stroke-[1.5]" />
                    <p className="font-medium text-xs">ไม่พบข้อมูลรายการงบประมาณที่ตรงกับเงื่อนไข</p>
                    <span className="text-[10px] font-mono text-[rgba(17,19,21,0.3)]">// ZERO MATCHED RECORDS</span>
                  </td>
                </tr>
              ) : (
                paginatedItems.map(item => {
                  const percent = item.allocated_amount > 0 ? (item.spent_amount / item.allocated_amount) * 100 : 0;
                  return (
                    <tr key={item.budget_id} className="hover:bg-white/60 transition group">
                      <td className="py-3.5 px-5">
                        <div className="font-mono text-xs font-semibold text-[#17324F]">{item.budget_id}</div>
                        <div className="font-medium text-[#111315] text-xs mt-0.5 max-w-xs sm:max-w-sm line-clamp-1">
                          {item.project_name}
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-white/80 border border-[rgba(17,19,21,0.06)] text-[rgba(17,19,21,0.7)]">
                          {item.budget_category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-[rgba(17,19,21,0.7)] truncate max-w-[140px]">
                        {item.responsible_unit}
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-[#111315] font-mono">
                        {formatCurrency(item.allocated_amount)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-[#42695B] font-mono">
                        {formatCurrency(item.spent_amount)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-[#111315] font-mono">
                        {formatCurrency(item.remaining_amount)}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-mono text-xs font-semibold text-[#111315]">{percent.toFixed(1)}%</span>
                          <div className="w-12 bg-[rgba(17,19,21,0.08)] rounded-full h-1 mt-1 overflow-hidden">
                            <div
                              className="bg-[#42695B] h-full rounded-full transition-all"
                              style={{ width: `${Math.min(percent, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                            item.status === 'เบิกจ่ายครบแล้ว'
                              ? 'bg-[#42695B]/10 text-[#42695B]'
                              : item.status === 'อยู่ระหว่างเบิกจ่าย'
                              ? 'bg-[#234A78]/10 text-[#234A78]'
                              : item.status === 'ชะลอการใช้จ่าย'
                              ? 'bg-[#A84E4E]/10 text-[#A84E4E]'
                              : 'bg-[#A77A35]/10 text-[#A77A35]'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setViewingItem(item)}
                            className="p-1.5 rounded-lg hover:bg-white text-[rgba(17,19,21,0.5)] hover:text-[#234A78] transition cursor-pointer"
                            title="ดูรายละเอียด"
                          >
                            <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
                          </button>

                          {currentRole !== 'viewer' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(item)}
                                className="p-1.5 rounded-lg hover:bg-white text-[rgba(17,19,21,0.5)] hover:text-[#A77A35] transition cursor-pointer"
                                title="แก้ไข"
                              >
                                <Edit2 className="w-3.5 h-3.5 stroke-[1.5]" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingId(item.budget_id)}
                                className="p-1.5 rounded-lg hover:bg-white text-[rgba(17,19,21,0.5)] hover:text-[#A84E4E] transition cursor-pointer"
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

        {/* Pagination Bar */}
        <div className="p-3 bg-white/40 border-t border-[rgba(17,19,21,0.06)]">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredBudgets.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>

      {/* 04 — ADD / EDIT BUDGET MODAL */}
      {(isAddModalOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111315]/40 backdrop-blur-[12px]">
          <div className="bg-white/95 backdrop-blur-[24px] rounded-[28px] shadow-[0_30px_80px_rgba(18,23,27,0.15)] max-w-2xl w-full p-6 sm:p-7 border border-[rgba(17,19,21,0.1)] animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto text-[#111315]">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(17,19,21,0.08)]">
              <div>
                <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase">
                  // FISCAL RECORD ENTRY
                </div>
                <h3 className="text-base font-medium text-[#111315] mt-0.5">
                  {editingItem ? `แก้ไขรายการงบประมาณ (${editingItem.budget_id})` : 'เพิ่มรายการงบประมาณใหม่'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingItem(null);
                }}
                className="p-1 rounded-lg text-[rgba(17,19,21,0.4)] hover:text-[#111315] hover:bg-black/5 transition"
              >
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#111315] mb-1 font-mono">ปีงบประมาณ</label>
                  <input
                    type="number"
                    value={formFiscalYear}
                    onChange={e => setFormFiscalYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[rgba(17,19,21,0.1)] focus:outline-hidden focus:border-[#234A78] font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111315] mb-1">หมวดรายจ่าย</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as BudgetCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[rgba(17,19,21,0.1)] focus:outline-hidden focus:border-[#234A78]"
                  >
                    {BUDGET_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#111315] mb-1">
                  ชื่อโครงการ / รายการค่าใช้จ่าย <span className="text-[#A84E4E]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="เช่น โครงการจัดซื้อครุภัณฑ์คอมพิวเตอร์และระบบเครือข่าย..."
                  value={formProjectName}
                  onChange={e => setFormProjectName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[rgba(17,19,21,0.1)] focus:outline-hidden focus:border-[#234A78]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-[#111315] mb-1">
                    วงเงินจัดสรร (บาท) <span className="text-[#A84E4E]">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={formAllocated}
                    onChange={e => setFormAllocated(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[rgba(17,19,21,0.1)] focus:outline-hidden focus:border-[#234A78] font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111315] mb-1">เบิกจ่ายแล้ว (บาท)</label>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={formSpent}
                    onChange={e => setFormSpent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[rgba(17,19,21,0.1)] focus:outline-hidden focus:border-[#234A78] font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111315] mb-1">ผูกพันงบประมาณ (บาท)</label>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={formCommitted}
                    onChange={e => setFormCommitted(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[rgba(17,19,21,0.1)] focus:outline-hidden focus:border-[#234A78] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#111315] mb-1">กลุ่มงานรับผิดชอบ</label>
                  <select
                    value={formResponsibleUnit}
                    onChange={e => setFormResponsibleUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[rgba(17,19,21,0.1)] focus:outline-hidden focus:border-[#234A78]"
                  >
                    {units.map(u => (
                      <option key={u.unit_id} value={u.unit_name}>
                        {u.unit_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#111315] mb-1">สถานะโครงการ</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as BudgetStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[rgba(17,19,21,0.1)] focus:outline-hidden focus:border-[#234A78]"
                  >
                    {BUDGET_STATUSES.map(st => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#111315] mb-1">หมายเหตุ / ความก้าวหน้า</label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="รายละเอียดเพิ่มเติม เช่น อยู่ระหว่างจัดทำ TOR, ส่งตรวจรับงวดที่ 1..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[rgba(17,19,21,0.1)] focus:outline-hidden focus:border-[#234A78]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[rgba(17,19,21,0.08)]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 rounded-xl text-[rgba(17,19,21,0.6)] hover:bg-black/5 transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#17324F] hover:bg-[#234A78] text-white font-medium shadow-2xs transition cursor-pointer"
                >
                  {editingItem ? 'บันทึกการแก้ไข' : 'บันทึกรายการงบประมาณ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 05 — VIEW BUDGET DETAILS MODAL */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111315]/40 backdrop-blur-[12px]">
          <div className="bg-white/95 backdrop-blur-[24px] rounded-[28px] shadow-[0_30px_80px_rgba(18,23,27,0.15)] max-w-xl w-full p-6 sm:p-7 border border-[rgba(17,19,21,0.1)] animate-in fade-in zoom-in-95 duration-150 text-[#111315]">
            <div className="flex items-start justify-between pb-4 border-b border-[rgba(17,19,21,0.08)]">
              <div>
                <span className="text-xs font-mono font-bold text-[#234A78]">{viewingItem.budget_id}</span>
                <h3 className="text-base font-medium text-[#111315] mt-0.5">{viewingItem.project_name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="p-1 rounded-lg text-[rgba(17,19,21,0.4)] hover:text-[#111315] hover:bg-black/5 transition"
              >
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[rgba(17,19,21,0.03)] border border-[rgba(17,19,21,0.06)]">
                <div>
                  <span className="text-[rgba(17,19,21,0.4)] font-mono text-[10px] uppercase">ปีงบประมาณ</span>
                  <div className="font-semibold text-[#111315] font-mono mt-0.5">{viewingItem.fiscal_year}</div>
                </div>
                <div>
                  <span className="text-[rgba(17,19,21,0.4)] font-mono text-[10px] uppercase">หมวดรายจ่าย</span>
                  <div className="font-semibold text-[#111315] mt-0.5">{viewingItem.budget_category}</div>
                </div>
                <div>
                  <span className="text-[rgba(17,19,21,0.4)] font-mono text-[10px] uppercase">กลุ่มงานรับผิดชอบ</span>
                  <div className="font-semibold text-[#111315] mt-0.5">{viewingItem.responsible_unit}</div>
                </div>
                <div>
                  <span className="text-[rgba(17,19,21,0.4)] font-mono text-[10px] uppercase">สถานะ</span>
                  <div className="mt-0.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#234A78]/10 text-[#234A78]">
                      {viewingItem.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 p-3.5 rounded-2xl border border-[rgba(17,19,21,0.08)] bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-[rgba(17,19,21,0.6)]">วงเงินจัดสรร:</span>
                  <span className="font-semibold text-[#111315] font-mono text-sm">
                    {formatCurrency(viewingItem.allocated_amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#42695B]">เบิกจ่ายจริงแล้ว:</span>
                  <span className="font-bold text-[#42695B] font-mono text-sm">
                    {formatCurrency(viewingItem.spent_amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A77A35]">ผูกพันงบประมาณ:</span>
                  <span className="font-semibold text-[#A77A35] font-mono">
                    {formatCurrency(viewingItem.committed_amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[rgba(17,19,21,0.06)]">
                  <span className="font-semibold text-[#111315]">งบประมาณคงเหลือ:</span>
                  <span className="font-bold text-[#111315] font-mono text-sm">
                    {formatCurrency(viewingItem.remaining_amount)}
                  </span>
                </div>
              </div>

              {viewingItem.notes && (
                <div className="p-3.5 rounded-2xl bg-[#234A78]/[0.03] border border-[#234A78]/10">
                  <span className="text-[#234A78] font-mono text-[10px] uppercase block mb-1">หมายเหตุ / รายละเอียด:</span>
                  <p className="text-[rgba(17,19,21,0.7)] leading-relaxed">{viewingItem.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-[rgba(17,19,21,0.08)] flex items-center justify-end">
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-[rgba(17,19,21,0.06)] hover:bg-[rgba(17,19,21,0.1)] text-[#111315] transition cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 06 — DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={Boolean(deletingId)}
        title="ยืนยันการลบรายการงบประมาณ"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบรายการงบประมาณนี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
        onConfirm={() => {
          if (deletingId) deleteBudget(deletingId);
          setDeletingId(null);
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
