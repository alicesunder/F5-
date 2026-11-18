import React, { useState } from 'react';
import {
  Coins,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  MapPin,
  Calendar,
  Send,
  Eye,
  EyeOff,
  Search,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { INITIAL_PERSONAL_ALLOWANCES } from '../../../data/personalData';
import { PersonalAllowanceItem } from '../../../types';
import { useMyCollection } from '../../../lib/collections';

interface AllowanceSectionProps {
  hideFinancials: boolean;
}

const STAGES = [
  { id: 'รอเบิก', label: 'รอเบิก' },
  { id: 'ส่งเรื่องแล้ว', label: 'ส่งเรื่องแล้ว' },
  { id: 'กำลังตรวจสอบ', label: 'กำลังตรวจสอบ' },
  { id: 'อนุมัติ', label: 'อนุมัติ' },
  { id: 'จ่ายแล้ว', label: 'จ่ายแล้ว' },
];

export const AllowanceSection: React.FC<AllowanceSectionProps> = ({ hideFinancials }) => {
  const [allowances, setAllowances] = useMyCollection<PersonalAllowanceItem>('allowances');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const formatMoney = (amount: number) => {
    if (hideFinancials) return '••••••••';
    return `฿${amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;
  };

  const filtered = allowances.filter(item => {
    if (selectedStatus === 'all') return true;
    return item.status === selectedStatus;
  });

  const totalPaid = allowances
    .filter(i => i.status === 'จ่ายแล้ว')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const totalPending = allowances
    .filter(i => i.status !== 'จ่ายแล้ว')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const getStageIndex = (status: string) => {
    const idx = STAGES.findIndex(s => s.id === status);
    return idx !== -1 ? idx : 0;
  };

  // Section 15: Exact status color specs
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'รอเบิก':
      case 'ส่งเรื่องแล้ว':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border-amber-300 dark:border-amber-500/30';
      case 'กำลังตรวจสอบ':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 border-blue-300 dark:border-blue-500/30';
      case 'อนุมัติ':
        return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300 border-green-300 dark:border-green-500/30';
      case 'จ่ายแล้ว':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30';
      case 'ตีกลับ':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300 border-rose-300 dark:border-rose-500/30';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-500/20 dark:text-slate-300 border-slate-300 dark:border-slate-500/30';
    }
  };

  return (
    <div className="rounded-3xl p-5 sm:p-7 bg-white/90 dark:bg-[#151A22]/90 border border-slate-200/80 dark:border-white/10 shadow-[0_10px_30px_rgba(30,25,50,0.06)] backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              สิทธิประโยชน์การปฏิบัติหน้าที่สนาม
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            เบี้ยเลี้ยงของฉัน (Allowance Tracker)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ติดตามสถานะฎีกาเบี้ยเลี้ยงปฏิบัติการสนาม ค่าเดินทาง และค่าตอบแทนพิเศษ ฝอ.๕ บช.ตชด.
          </p>
        </div>

        {/* Summary Metric Pills */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs">
            <span className="text-emerald-700 dark:text-emerald-300 font-semibold">รับเงินแล้ว: </span>
            <span className="font-black text-emerald-800 dark:text-emerald-200 font-mono">{formatMoney(totalPaid)}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs">
            <span className="text-amber-700 dark:text-amber-300 font-semibold">อยู่ระหว่างเบิก: </span>
            <span className="font-black text-amber-800 dark:text-amber-200 font-mono">{formatMoney(totalPending)}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        <button
          type="button"
          onClick={() => setSelectedStatus('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            selectedStatus === 'all'
              ? 'bg-[#2583D8] text-white shadow-xs'
              : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
          }`}
        >
          ทั้งหมด ({allowances.length})
        </button>
        {STAGES.map(s => {
          const count = allowances.filter(a => a.status === s.id).length;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedStatus(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedStatus === s.id
                  ? 'bg-[#2583D8] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              {s.label} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* Allowance Cards */}
      <div className="space-y-4">
        {filtered.map(item => {
          const stageIdx = getStageIndex(item.status);
          const isPaid = item.status === 'จ่ายแล้ว';

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#1A1F29]/60 border border-slate-200/80 dark:border-white/10 hover:border-blue-400/40 transition-all space-y-4"
            >
              {/* Mission Details Top */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300">
                      {item.type}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      เลขฎีกา: {item.docReference || item.id}
                    </span>
                    {/* Status Badge with Section 15 Color Spec */}
                    <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.missionName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {item.dates} ({item.days} วัน)
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {item.location}
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0 self-start md:self-center">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    อัตรา ฿{item.ratePerDay}/วัน × {item.days} วัน
                  </div>
                  <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
                    {formatMoney(item.totalAmount)}
                  </div>
                </div>
              </div>

              {/* Progress Stepper: "เงินของฉันอยู่ขั้นตอนไหน" */}
              <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-500" />
                    สถานะการเบิกจ่าย: <strong className="text-slate-800 dark:text-slate-200">{item.status}</strong>
                  </span>
                  {item.paidDate && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      โอนเงินเมื่อ: {item.paidDate}
                    </span>
                  )}
                </div>

                {/* Visual Horizontal Stepper */}
                <div className="grid grid-cols-5 gap-1.5 relative pt-1">
                  {STAGES.map((s, idx) => {
                    const isPassed = idx <= stageIdx;
                    const isCurrent = idx === stageIdx;

                    return (
                      <div key={s.id} className="flex flex-col items-center gap-1 text-center">
                        <div
                          className={`w-full h-1.5 rounded-full transition-all ${
                            isPassed
                              ? isPaid
                                ? 'bg-emerald-500'
                                : 'bg-[#2583D8]'
                              : 'bg-slate-200 dark:bg-white/10'
                          }`}
                        />
                        <span
                          className={`text-[10px] truncate max-w-full ${
                            isCurrent
                              ? 'font-bold text-[#2583D8] dark:text-blue-400'
                              : isPassed
                              ? 'font-medium text-slate-700 dark:text-slate-300'
                              : 'text-slate-400 dark:text-slate-600'
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
