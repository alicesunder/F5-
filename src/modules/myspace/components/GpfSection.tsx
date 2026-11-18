import React from 'react';
import {
  Shield,
  TrendingUp,
  Coins,
  History,
  Info,
  CheckCircle2,
  ExternalLink,
  Building,
  PiggyBank,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import {
  GPF_TOTAL_ACCUMULATED,
  GPF_MONTHLY_HISTORY,
  CHAIROT_POLICE_RECORD,
} from '../../../data/personalData';

interface GpfSectionProps {
  hideFinancials: boolean;
}

export const GpfSection: React.FC<GpfSectionProps> = ({ hideFinancials }) => {
  const formatMoney = (val: number) => {
    if (hideFinancials) return '••••••••';
    return `฿${val.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="rounded-3xl p-5 sm:p-7 bg-white/90 dark:bg-[#151A22]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              กองทุนบำเหน็จบำนาญข้าราชการ
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            กบข. ของฉัน (Government Pension Fund - GPF)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            สรุปยอดเงินสะสม เงินสมทบจากรัฐ และประวัติการหักนำส่งรายเดือนตามฐานข้อมูลจ่ายตรง
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
            <BadgeCheck className="w-4 h-4 text-purple-500" />
            <span>สมาชิกเลขที่ {GPF_TOTAL_ACCUMULATED.memberNumber}</span>
          </span>
        </div>
      </div>

      {/* Official System Connection Notice */}
      <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-500/20 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 dark:text-blue-200 space-y-0.5">
          <div className="font-bold">สถานะการเชื่อมโยงข้อมูลทางการ (Transparent Integration Status):</div>
          <div className="text-blue-700 dark:text-blue-300 leading-relaxed">
            ข้อมูลการหักสะสมเงิน กบข. อัตรา 3% (399.30 บาท/เดือน) นำส่งผ่านระบบจ่ายตรงเงินเดือน บช.ตชด. ไปยังกองทุนบำเหน็จบำนาญข้าราชการเรียบร้อยแล้ว แผนการลงทุนปัจจุบัน: <strong>{GPF_TOTAL_ACCUMULATED.planType}</strong>
          </div>
        </div>
      </div>

      {/* Primary Accumulated GPF Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Grand */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50/60 dark:from-purple-950/30 dark:to-indigo-950/20 border border-purple-200/80 dark:border-purple-500/30 space-y-1 sm:col-span-2 lg:col-span-1">
          <div className="text-xs font-bold text-purple-800 dark:text-purple-300">
            ยอดรวมในบัญชี กบข. ทั้งหมด
          </div>
          <div className="text-2xl font-black text-purple-900 dark:text-purple-200 font-mono">
            {formatMoney(GPF_TOTAL_ACCUMULATED.grandTotal)}
          </div>
          <div className="text-[10px] text-purple-700 dark:text-purple-400">
            เงินสะสม + สมทบ + ชดเชย + ผลประโยชน์
          </div>
        </div>

        {/* Member Accumulated */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-1">
          <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
            เงินสะสมของสมาชิก (3%)
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
            {formatMoney(GPF_TOTAL_ACCUMULATED.memberAccumulated)}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            หักจากเงินเดือนประจำทุกเดือน
          </div>
        </div>

        {/* Government Contribution */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-1">
          <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
            เงินสมทบจากรัฐบาล (3%)
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
            {formatMoney(GPF_TOTAL_ACCUMULATED.govContribution)}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            รัฐบาลสมทบให้เท่ากับสมาชิก
          </div>
        </div>

        {/* Government Compensation */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-1">
          <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
            เงินชดเชยจากรัฐ (2%)
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
            {formatMoney(GPF_TOTAL_ACCUMULATED.govCompensation)}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            ชดเชยตามสูตรบำนาญใหม่
          </div>
        </div>

        {/* Investment Returns */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-1">
          <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
            ผลประโยชน์ตอบแทน
          </div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            +{formatMoney(GPF_TOTAL_ACCUMULATED.investmentReturn)}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            ผลตอบแทนจากการลงทุนสะสม
          </div>
        </div>
      </div>

      {/* Monthly Submission History Table */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              ประวัติการหักนำส่งเงิน กบข. รายเดือน (รอบปีงบประมาณ 2569)
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            ระบบจ่ายตรง บช.ตชด.
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="p-3">รอบเดือน</th>
                <th className="p-3">เงินสะสมสมาชิก (3%)</th>
                <th className="p-3">เงินสมทบรัฐ (3%)</th>
                <th className="p-3">ยอดรวมนำส่ง</th>
                <th className="p-3">วันที่ตัดยอดส่งมอบ</th>
                <th className="p-3">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {GPF_MONTHLY_HISTORY.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition">
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                    {row.monthYear}
                  </td>
                  <td className="p-3 font-mono font-semibold text-slate-900 dark:text-white">
                    {formatMoney(row.memberAmount)}
                  </td>
                  <td className="p-3 font-mono font-semibold text-slate-900 dark:text-white">
                    {formatMoney(row.govAmount)}
                  </td>
                  <td className="p-3 font-mono font-bold text-purple-600 dark:text-purple-400">
                    {formatMoney(row.totalMonthly)}
                  </td>
                  <td className="p-3 text-slate-500 dark:text-slate-400">
                    {row.submissionDate}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      นำส่งแล้ว
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
