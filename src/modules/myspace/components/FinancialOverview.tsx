import type { PersonalExpenseItem, PersonalAllowanceItem } from '../../../types';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wallet,
  Coins,
  TrendingUp,
  TrendingDown,
  Scale,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  FileText,
  Plus,
} from 'lucide-react';
import {
  CHAIROT_POLICE_RECORD,
  INITIAL_PERSONAL_ALLOWANCES,
  GPF_TOTAL_ACCUMULATED,
} from '../../../data/personalData';
import { useMyCollection } from '../../../lib/collections';

interface FinancialOverviewProps {
  hideFinancials: boolean;
  onToggleHideFinancials: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenPayslipModal: (month: string) => void;
}

export const FinancialOverview: React.FC<FinancialOverviewProps> = ({
  hideFinancials,
  onToggleHideFinancials,
  onNavigateSection,
  onOpenPayslipModal,
}) => {
  const [expenseItems] = useMyCollection<PersonalExpenseItem>('expenses');
  const [allowanceItems] = useMyCollection<PersonalAllowanceItem>('allowances');
  const totalExpenses = expenseItems.reduce((acc, curr) => acc + curr.amount, 0);

  // Exact figures from authentic POLIS police payroll
  const baseSalary = CHAIROT_POLICE_RECORD.currentSalaryAmount; // 13,310
  const costOfLiving = CHAIROT_POLICE_RECORD.costOfLivingAllowance; // 2,500
  const grossMonthlyIncome = baseSalary + costOfLiving; // 15,810

  const totalDeductions =
    CHAIROT_POLICE_RECORD.gpfDeduction + CHAIROT_POLICE_RECORD.policeMutualAidDeduction; // 699.30
  const netSalary = grossMonthlyIncome - totalDeductions; // 15,110.70

  // Allowances from authentic data
  const totalPaidAllowance = allowanceItems
    .filter(a => a.status === 'จ่ายแล้ว')
    .reduce((sum, a) => sum + a.totalAmount, 0); // 720

  const totalPendingAllowance = allowanceItems
    .filter(a => a.status !== 'จ่ายแล้ว')
    .reduce((sum, a) => sum + a.totalAmount, 0); // 2,040

  // Net Balance = Net salary received - expenses logged
  const netBalance = netSalary - totalExpenses;

  const formatAmount = (val: number) => {
    if (hideFinancials) return '฿••••••';
    return `฿${val.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const cards = [
    {
      id: 'salary',
      label: 'เงินเดือนสุทธิ',
      subtitle: `ป.1 ขั้น 12 (ฐาน ฿${baseSalary.toLocaleString()})`,
      amount: netSalary,
      icon: Wallet,
      color: 'emerald',
      actionText: 'ดูสลิปเดือน ส.ค.',
      onAction: () => onOpenPayslipModal('2569-08'),
      accentBorder: 'hover:border-emerald-400/40',
      badgeBg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    },
    {
      id: 'allowance',
      label: 'เบี้ยเลี้ยงสนาม',
      subtitle: `รับแล้ว ฿${totalPaidAllowance.toLocaleString()} • รอเบิก ฿${totalPendingAllowance.toLocaleString()}`,
      amount: totalPaidAllowance,
      secondaryLabel: `รอเบิก ${hideFinancials ? '฿••••' : `฿${totalPendingAllowance.toLocaleString()}`}`,
      icon: Coins,
      color: 'amber',
      actionText: 'ติดตาม 4 รายการ',
      onAction: () => onNavigateSection('allowance'),
      accentBorder: 'hover:border-amber-400/40',
      badgeBg: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    },
    {
      id: 'income',
      label: 'รวมรายรับประจำเดือน',
      subtitle: `เงินเดือน + ค่าครองชีพชั่วคราว`,
      amount: grossMonthlyIncome,
      icon: TrendingUp,
      color: 'blue',
      actionText: 'รายละเอียดรายได้',
      onAction: () => onNavigateSection('salary'),
      accentBorder: 'hover:border-blue-400/40',
      badgeBg: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
    },
    {
      id: 'expense',
      label: 'รายจ่ายที่บันทึก',
      subtitle: 'ค่าน้ำมัน อาหาร ที่พัก ฯลฯ',
      amount: totalExpenses,
      icon: TrendingDown,
      color: 'rose',
      actionText: 'บันทึกรายจ่าย',
      onAction: () => onNavigateSection('finance'),
      accentBorder: 'hover:border-rose-400/40',
      badgeBg: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
    },
    {
      id: 'balance',
      label: 'คงเหลือประมาณการ',
      subtitle: 'เงินเดือนสุทธิหักรายจ่ายบันทึก',
      amount: netBalance,
      icon: Scale,
      color: 'purple',
      actionText: 'กบข. สะสม ฿' + (hideFinancials ? '••••' : GPF_TOTAL_ACCUMULATED.grandTotal.toLocaleString()),
      onAction: () => onNavigateSection('gpf'),
      accentBorder: 'hover:border-purple-400/40',
      badgeBg: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
    },
  ];

  return (
    <div className="rounded-3xl p-5 sm:p-7 bg-white/90 dark:bg-[#151A22]/90 border border-slate-200/80 dark:border-white/10 shadow-[0_10px_30px_rgba(30,25,50,0.06)] backdrop-blur-md space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              สถานะการเงินส่วนบุคคล
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            การเงินของฉัน (My Financial Overview)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            สรุปเงินเดือน เบี้ยเลี้ยงปฏิบัติการสนาม รายรับ-รายจ่าย และยอดคงเหลือตามฐานข้อมูลจ่ายตรง
          </p>
        </div>

        {/* Privacy Toggle Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onToggleHideFinancials}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 transition shadow-2xs cursor-pointer"
            title="สลับโหมดความเป็นส่วนตัวสำหรับตัวเลขทางการเงิน"
          >
            {hideFinancials ? (
              <>
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                <span>แสดงยอดเงิน (Reveal)</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                <span>ซ่อนยอดเงิน (Privacy)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 5 Financial Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={`p-4 rounded-2xl bg-white dark:bg-[#1A1F29]/70 border border-slate-200/70 dark:border-white/5 transition-all duration-200 flex flex-col justify-between ${card.accentBorder} shadow-2xs hover:shadow-md group`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate">
                    {card.label}
                  </span>
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${card.badgeBg}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Large Amount with smooth reveal animation */}
                <div className="py-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={hideFinancials ? 'masked' : 'revealed'}
                      initial={{ opacity: 0, y: -2 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 2 }}
                      transition={{ duration: 0.15 }}
                      className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight"
                    >
                      {formatAmount(card.amount)}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {card.subtitle}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-white/5">
                <button
                  type="button"
                  onClick={card.onAction}
                  className="w-full inline-flex items-center justify-between text-xs font-bold text-[#2583D8] hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition cursor-pointer"
                >
                  <span>{card.actionText}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
