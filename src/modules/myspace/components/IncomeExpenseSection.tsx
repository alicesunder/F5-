import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Plus,
  Trash2,
  PieChart as PieChartIcon,
  Tag,
  Calendar,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Utensils,
  Car,
  Home,
  Fuel,
  Zap,
  CreditCard,
  HelpCircle,
} from 'lucide-react';
import {
  getStoredExpenses,
  saveStoredExpenses,
  CHAIROT_POLICE_RECORD,
} from '../../../data/personalData';
import { PersonalExpenseItem } from '../../../types';

interface IncomeExpenseSectionProps {
  hideFinancials: boolean;
}

const CATEGORY_ICONS: Record<string, any> = {
  อาหาร: Utensils,
  เดินทาง: Car,
  ที่พัก: Home,
  ค่าน้ำมัน: Fuel,
  สาธารณูปโภค: Zap,
  ภาระผ่อนชำระ: CreditCard,
  'อื่น ๆ': HelpCircle,
};

const CATEGORY_COLORS: Record<string, string> = {
  อาหาร: '#10B981',
  เดินทาง: '#3B82F6',
  ที่พัก: '#8B5CF6',
  ค่าน้ำมัน: '#F59E0B',
  สาธารณูปโภค: '#06B6D4',
  ภาระผ่อนชำระ: '#EC4899',
  'อื่น ๆ': '#6B7280',
};

export const IncomeExpenseSection: React.FC<IncomeExpenseSectionProps> = ({ hideFinancials }) => {
  const [expenses, setExpenses] = useState<PersonalExpenseItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<PersonalExpenseItem['category']>('อาหาร');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setExpenses(getStoredExpenses());
  }, []);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    const newExpense: PersonalExpenseItem = {
      id: `EXP-${Date.now()}`,
      title: title.trim(),
      amount: numAmount,
      category,
      date,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    saveStoredExpenses(updated);

    // Reset Form
    setTitle('');
    setAmount('');
    setNotes('');
    setShowAddModal(false);
  };

  const handleDeleteExpense = (id: string) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    saveStoredExpenses(updated);
  };

  // Financial calculations
  const totalIncome =
    CHAIROT_POLICE_RECORD.currentSalaryAmount +
    CHAIROT_POLICE_RECORD.costOfLivingAllowance -
    (CHAIROT_POLICE_RECORD.gpfDeduction + CHAIROT_POLICE_RECORD.policeMutualAidDeduction); // Net: 15,110.70

  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const formatMoney = (val: number) => {
    if (hideFinancials) return '••••••••';
    return `฿${val.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;
  };

  // Category breakdown for chart/bars
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  return (
    <div className="rounded-3xl p-5 sm:p-7 bg-white/90 dark:bg-[#151A22]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              การบริหารการเงินส่วนบุคคล
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            รายรับ - รายจ่ายของฉัน (Personal Income & Expense)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            สรุปภาพรวมรายได้ข้าราชการสุทธิ และบันทึกค่าใช้จ่ายส่วนตัวประจำเดือน
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>บันทึกรายจ่ายใหม่</span>
        </button>
      </div>

      {/* Summary Scorecard (3 KPI Blocks) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Income */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-500/20 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <span>รายรับสุทธิ (เงินเดือน+เงินเพิ่ม)</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-900 dark:text-emerald-200 font-mono">
            {formatMoney(totalIncome)}
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
            หัก กบข./ฌาปนกิจ ตร. เรียบร้อยแล้ว
          </div>
        </div>

        {/* Total Expenses */}
        <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-500/20 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-rose-800 dark:text-rose-300">
            <span>รายจ่ายที่บันทึกแล้ว</span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-900 dark:text-rose-200 font-mono">
            {formatMoney(totalExpense)}
          </div>
          <div className="text-[11px] text-rose-700 dark:text-rose-400">
            บันทึกทั้งหมด {expenses.length} รายการ
          </div>
        </div>

        {/* Net Balance (เงินคงเหลือ) */}
        <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-500/20 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-blue-800 dark:text-blue-300">
            <span>เงินคงเหลือสุทธิ (Net Balance)</span>
            <Scale className="w-4 h-4 text-blue-500" />
          </div>
          <div
            className={`text-2xl font-black font-mono ${
              netBalance >= 0 ? 'text-blue-900 dark:text-blue-200' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {formatMoney(netBalance)}
          </div>
          <div className="text-[11px] text-blue-700 dark:text-blue-400">
            {netBalance >= 0 ? 'งบประมาณเพียงพอ (ดุลบวก)' : 'ใช้จ่ายเกินรายรับ'}
          </div>
        </div>
      </div>

      {/* Category Breakdown Progress Bars */}
      <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-3">
        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
          <span>สัดส่วนค่าใช้จ่ายตามหมวดหมู่</span>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            รวม {formatMoney(totalExpense)}
          </span>
        </div>

        <div className="space-y-2">
          {Object.entries(categoryTotals).map(([cat, amount]) => {
            const pct = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
            const Icon = CATEGORY_ICONS[cat] || HelpCircle;
            const color = CATEGORY_COLORS[cat] || '#6B7280';

            return (
              <div key={cat} className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                    {cat}
                  </span>
                  <span>{formatMoney(amount)} ({pct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Expense List */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
          รายการค่าใช้จ่ายล่าสุด
        </div>

        {expenses.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
            ยังไม่มีรายการค่าใช้จ่ายที่บันทึก กดปุ่ม "บันทึกรายจ่ายใหม่" เพื่อเริ่มต้น
          </div>
        ) : (
          <div className="space-y-2">
            {expenses.map(item => {
              const Icon = CATEGORY_ICONS[item.category] || HelpCircle;
              const color = CATEGORY_COLORS[item.category] || '#6B7280';

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-[#1A1F29]/60 border border-slate-200/80 dark:border-white/5 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-white/10 transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${color}15`, color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>{item.date}</span>
                        <span>•</span>
                        <span style={{ color }}>{item.category}</span>
                        {item.notes && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-xs">{item.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-rose-600 dark:text-rose-400 font-mono">
                      -{formatMoney(item.amount)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteExpense(item.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      title="ลบรายการ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#1A1F29] border border-slate-200 dark:border-white/10 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              บันทึกรายจ่ายส่วนบุคคล
            </h3>

            <form onSubmit={handleAddExpense} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  รายการค่าใช้จ่าย *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ค่าอาหารกลางวัน, ค่าน้ำมัน"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    จำนวนเงิน (บาท) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs font-mono border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    หมวดหมู่ *
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="อาหาร">อาหาร</option>
                    <option value="เดินทาง">เดินทาง</option>
                    <option value="ค่าน้ำมัน">ค่าน้ำมัน</option>
                    <option value="ที่พัก">ที่พัก</option>
                    <option value="สาธารณูปโภค">สาธารณูปโภค</option>
                    <option value="ภาระผ่อนชำระ">ภาระผ่อนชำระ</option>
                    <option value="อื่น ๆ">อื่น ๆ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  วันที่บันทึก
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  บันทึกเพิ่มเติม (ไม่บังคับ)
                </label>
                <input
                  type="text"
                  placeholder="เช่น สถานที่ หรือ รายละเอียดเพิ่มเติม"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  บันทึกรายการ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
