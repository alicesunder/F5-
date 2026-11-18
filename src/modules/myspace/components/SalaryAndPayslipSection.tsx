import React, { useState } from 'react';
import {
  Wallet,
  Eye,
  EyeOff,
  Printer,
  Download,
  Calendar,
  FileCheck2,
  TrendingUp,
  ShieldCheck,
  Building,
  CreditCard,
  History,
  FileText,
  AlertCircle,
  Receipt,
  ExternalLink,
} from 'lucide-react';
import {
  CHAIROT_POLICE_RECORD,
  SALARY_STEP_HISTORY,
  THREE_YEARS_STEPS,
} from '../../../data/personalData';

interface SalaryAndPayslipSectionProps {
  hideFinancials: boolean;
  onToggleHideFinancials: () => void;
  onOpenPayslipModal?: (month: string) => void;
}

const AVAILABLE_PAYSLIP_MONTHS = [
  { id: '2569-08', label: 'สิงหาคม 2569', totalNet: 15110.70, date: '28 ส.ค. 2569', status: 'จ่ายแล้ว' },
  { id: '2569-07', label: 'กรกฎาคม 2569', totalNet: 15110.70, date: '29 ก.ค. 2569', status: 'จ่ายแล้ว' },
  { id: '2569-06', label: 'มิถุนายน 2569', totalNet: 15110.70, date: '27 มิ.ย. 2569', status: 'จ่ายแล้ว' },
  { id: '2569-05', label: 'พฤษภาคม 2569', totalNet: 15110.70, date: '29 พ.ค. 2569', status: 'จ่ายแล้ว' },
  { id: '2569-04', label: 'เมษายน 2569', totalNet: 15110.70, date: '28 เม.ย. 2569', status: 'จ่ายแล้ว' },
  { id: '2569-03', label: 'มีนาคม 2569', totalNet: 14870.70, date: '27 มี.ค. 2569', status: 'จ่ายแล้ว' },
];

export const SalaryAndPayslipSection: React.FC<SalaryAndPayslipSectionProps> = ({
  hideFinancials,
  onToggleHideFinancials,
  onOpenPayslipModal,
}) => {
  const [selectedMonth, setSelectedMonth] = useState('2569-08');

  // Exact calculations from official police pay scale (ป.1 ขั้น 12)
  const baseSalary = CHAIROT_POLICE_RECORD.currentSalaryAmount; // 13,310
  const costOfLiving = CHAIROT_POLICE_RECORD.costOfLivingAllowance; // 2,500
  const grossIncome = baseSalary + costOfLiving; // 15,810

  const gpfDeduction = CHAIROT_POLICE_RECORD.gpfDeduction; // 399.30 (3%)
  const policeAidDeduction = CHAIROT_POLICE_RECORD.policeMutualAidDeduction; // 300.00
  const totalDeductions = gpfDeduction + policeAidDeduction; // 699.30
  const netSalary = grossIncome - totalDeductions; // 15,110.70

  const formatMoney = (amount: number) => {
    if (hideFinancials) return '••••••••';
    return `฿${amount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const currentPayslip =
    AVAILABLE_PAYSLIP_MONTHS.find(m => m.id === selectedMonth) || AVAILABLE_PAYSLIP_MONTHS[0];

  return (
    <div className="rounded-3xl p-5 sm:p-7 bg-white/90 dark:bg-[#151A22]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-md space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              ข้อมูลสิทธิกำลังพลและการเงิน
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            เงินเดือนและสลิปเงินเดือนของฉัน (Salary & Payslip)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ข้อมูลเงินเดือนและสิทธิประโยชน์ทางการเงินจากระบบจ่ายตรง บช.ตชด. (POLIS Database)
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Privacy Toggle Button */}
          <button
            type="button"
            onClick={onToggleHideFinancials}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 transition cursor-pointer"
          >
            {hideFinancials ? (
              <>
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                <span>แสดงยอดเงิน</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                <span>ซ่อนยอดเงิน</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Net Salary */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200/80 dark:border-emerald-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <span>ยอดรับสุทธิประจำเดือน</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-900 dark:text-emerald-200 tracking-tight">
            {formatMoney(netSalary)}
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
            โอนเข้า: กรุงไทย {CHAIROT_POLICE_RECORD.accountNumber}
          </div>
        </div>

        {/* Card 2: Base Salary Level */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>เงินเดือนขั้นต้น (ป.1 ขั้น 12)</span>
            <CreditCard className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatMoney(baseSalary)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            บัญชี: {CHAIROT_POLICE_RECORD.accountType} (เลื่อน 0.5 ขั้น เม.ย. 69)
          </div>
        </div>

        {/* Card 3: Additional Subsidies */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>เงินเพิ่มค่าครองชีพชั่วคราว</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatMoney(costOfLiving)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            รวมรายรับทั้งสิ้น: {formatMoney(grossIncome)}
          </div>
        </div>

        {/* Card 4: Monthly Deductions */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>รายการหักประจำเดือน</span>
            <Receipt className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
            {formatMoney(totalDeductions)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            กบข. (3%) {formatMoney(gpfDeduction)} • ฌาปนกิจ {formatMoney(policeAidDeduction)}
          </div>
        </div>
      </div>

      {/* Interactive Payslip Viewer & Generator */}
      <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              สลิปเงินเดือนรายเดือน (Official e-Payslip)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Month Selector */}
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-[#1A1F29] text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              {AVAILABLE_PAYSLIP_MONTHS.map(m => (
                <option key={m.id} value={m.id}>
                  รอบเดือน {m.label} ({m.status})
                </option>
              ))}
            </select>

            {/* Print / Preview Button */}
            <button
              type="button"
              onClick={() => onOpenPayslipModal && onOpenPayslipModal(selectedMonth)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์สลิป / PDF</span>
            </button>
          </div>
        </div>

        {/* Payslip Breakdown Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Income Column */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#1A1F29]/60 border border-slate-200/80 dark:border-white/5 space-y-2">
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 pb-1.5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <span>รายการรับ (Income)</span>
              <span>จำนวนเงิน</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <span>เงินเดือน (ป.1 ขั้น 12)</span>
                <span className="font-mono font-semibold">{formatMoney(baseSalary)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>เงินประจำตำแหน่ง</span>
                <span className="font-mono font-semibold">{formatMoney(0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>เงินเพิ่มการครองชีพชั่วคราว</span>
                <span className="font-mono font-semibold">{formatMoney(costOfLiving)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-dashed border-slate-200 dark:border-white/5 font-bold text-slate-900 dark:text-white">
                <span>รวมรายรับทั้งสิ้น</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">{formatMoney(grossIncome)}</span>
              </div>
            </div>
          </div>

          {/* Deductions Column */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#1A1F29]/60 border border-slate-200/80 dark:border-white/5 space-y-2">
            <div className="text-xs font-bold text-rose-700 dark:text-rose-400 pb-1.5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <span>รายการหัก (Deductions)</span>
              <span>จำนวนเงิน</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <span>เงินสะสม กบข. (3%)</span>
                <span className="font-mono font-semibold">{formatMoney(gpfDeduction)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>ฌาปนกิจสงเคราะห์ ตร.</span>
                <span className="font-mono font-semibold">{formatMoney(policeAidDeduction)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>ภาษีหัก ณ ที่จ่าย</span>
                <span className="font-mono font-semibold">{formatMoney(0)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-dashed border-slate-200 dark:border-white/5 font-bold text-slate-900 dark:text-white">
                <span>รวมรายการหักทั้งสิ้น</span>
                <span className="font-mono text-rose-600 dark:text-rose-400">{formatMoney(totalDeductions)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Police Salary Step History Table (จากเอกสาร POLIS) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              ประวัติการเลื่อนเงินเดือนอย่างเป็นทางการ (POLIS Official History)
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            ฐานข้อมูลสารนิเทศ ตร.
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="p-3">รอบ พ.ศ./เดือน</th>
                <th className="p-3">ระดับ</th>
                <th className="p-3">ขั้น</th>
                <th className="p-3">เงินเดือน</th>
                <th className="p-3">ขั้นที่เลื่อน</th>
                <th className="p-3">เงินใช้เลื่อน</th>
                <th className="p-3">บัญชี</th>
                <th className="p-3">หมายเหตุ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {SALARY_STEP_HISTORY.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition"
                >
                  <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {item.fiscalYearMonth}
                  </td>
                  <td className="p-3 font-semibold">{item.salaryLevel}</td>
                  <td className="p-3 font-semibold">{item.step}</td>
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                    {formatMoney(item.baseSalary)}
                  </td>
                  <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">
                    +{item.stepPromoted}
                  </td>
                  <td className="p-3 font-mono">{formatMoney(item.stepPromotionAmount)}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 font-semibold text-[10px]">
                      {item.accountType}
                    </span>
                  </td>
                  <td className="p-3 text-[11px] text-slate-500 dark:text-slate-400">
                    {item.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Past 3-Years Step Evaluation Summary */}
      <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-500/20 space-y-2">
        <div className="text-xs font-bold text-purple-900 dark:text-purple-300">
          สถิติขั้นเงินเดือนย้อนหลัง 3 ปี (ก.ตร. / ทบ.1)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {THREE_YEARS_STEPS.map(s => (
            <div
              key={s.year}
              className="p-3 rounded-xl bg-white dark:bg-[#1A1F29] border border-purple-100 dark:border-white/5"
            >
              <div className="text-slate-400 text-[10px]">พ.ศ. {s.year}</div>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                เม.ย. {s.apr} | ต.ค. {s.oct}
              </div>
              <div className="text-[11px] font-extrabold text-purple-600 dark:text-purple-400 mt-0.5">
                รวม {s.total} ขั้น {s.currentEvaluating && '(รอรอบ ต.ค.)'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
