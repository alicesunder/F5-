import React from 'react';
import {
  X,
  Printer,
  Download,
  Building2,
  FileCheck2,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { CHAIROT_POLICE_RECORD } from '../../../data/personalData';

interface PayslipPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthId: string;
}

export const PayslipPrintModal: React.FC<PayslipPrintModalProps> = ({
  isOpen,
  onClose,
  monthId,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const baseSalary = CHAIROT_POLICE_RECORD.currentSalaryAmount; // 13,310
  const costOfLiving = CHAIROT_POLICE_RECORD.costOfLivingAllowance; // 2,500
  const grossIncome = baseSalary + costOfLiving; // 15,810

  const gpfDeduction = CHAIROT_POLICE_RECORD.gpfDeduction; // 399.30
  const policeAidDeduction = CHAIROT_POLICE_RECORD.policeMutualAidDeduction; // 300.00
  const totalDeductions = gpfDeduction + policeAidDeduction; // 699.30
  const netSalary = grossIncome - totalDeductions; // 15,110.70

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-[#151A22] border border-slate-200 dark:border-white/10 shadow-2xl my-6 flex flex-col max-h-[90vh]">
        {/* Header Control */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1F29] rounded-t-3xl">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                ใบรับรองการจ่ายเงินเดือนและเงินอื่น (e-Payslip)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                กองบัญชาการตำรวจตระเวนชายแดน • กรมบัญชีกลาง กระทรวงการคลัง
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์สลิป (Print)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Payslip Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-slate-900 dark:text-slate-100 text-xs print:p-0 print:text-black">
          {/* Official Royal Thai Police Header */}
          <div className="text-center space-y-1 pb-4 border-b-2 border-slate-800 dark:border-slate-300">
            <div className="text-sm font-black tracking-wide">
              กองบัญชาการตำรวจตระเวนชายแดน (บช.ตชด.)
            </div>
            <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
              ใบแจ้งยอดเงินเดือน ค่าจ้าง และเงินอื่น ๆ ประจำรอบเดือน สิงหาคม ๒๕๖๙
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              เลขที่เอกสาร: BPP-PAY-256908-1249 | วันที่จ่ายเงิน: ๒๘ สิงหาคม ๒๕๖๙
            </div>
          </div>

          {/* Personnel Details Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400">ชื่อ-สกุล:</span>{' '}
              <span className="font-bold">{CHAIROT_POLICE_RECORD.fullName}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">เลขประจำตัว ปชช.:</span>{' '}
              <span className="font-mono">{CHAIROT_POLICE_RECORD.nationalId}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">เลขที่ตำแหน่ง:</span>{' '}
              <span className="font-mono">{CHAIROT_POLICE_RECORD.positionNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">ตำแหน่ง/สังกัด:</span>{' '}
              <span>{CHAIROT_POLICE_RECORD.position} (ฝอ.๕ บช.ตชด.)</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">ระดับ/ขั้น:</span>{' '}
              <span className="font-bold">{CHAIROT_POLICE_RECORD.salaryGrade} ขั้น {CHAIROT_POLICE_RECORD.salaryStep}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">บัญชีธนาคาร:</span>{' '}
              <span>{CHAIROT_POLICE_RECORD.accountNumber}</span>
            </div>
          </div>

          {/* 2-Column Income vs Deduction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-300 dark:border-white/10 rounded-xl overflow-hidden">
            {/* Income */}
            <div className="p-4 space-y-2 border-b md:border-b-0 md:border-r border-slate-300 dark:border-white/10">
              <div className="font-bold text-xs pb-1 border-b border-slate-200 dark:border-white/10 flex justify-between">
                <span>รายการรับ (Income)</span>
                <span>จำนวนเงิน (บาท)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-100 dark:border-white/5">
                <span>เงินเดือนข้าราชการ</span>
                <span className="font-mono font-semibold">{baseSalary.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-100 dark:border-white/5">
                <span>เงินเพิ่มการครองชีพชั่วคราว</span>
                <span className="font-mono font-semibold">{costOfLiving.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-400">
                <span>เงินประจำตำแหน่ง</span>
                <span className="font-mono">0.00</span>
              </div>
              <div className="flex justify-between pt-3 font-black text-emerald-600 dark:text-emerald-400 border-t border-slate-300 dark:border-white/10">
                <span>รวมเงินได้ทั้งสิ้น</span>
                <span className="font-mono">{grossIncome.toFixed(2)}</span>
              </div>
            </div>

            {/* Deductions */}
            <div className="p-4 space-y-2">
              <div className="font-bold text-xs pb-1 border-b border-slate-200 dark:border-white/10 flex justify-between">
                <span>รายการหัก (Deduction)</span>
                <span>จำนวนเงิน (บาท)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-100 dark:border-white/5">
                <span>เงินสะสม กบข. (3%)</span>
                <span className="font-mono font-semibold">{gpfDeduction.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-100 dark:border-white/5">
                <span>ฌาปนกิจสงเคราะห์ ตร.</span>
                <span className="font-mono font-semibold">{policeAidDeduction.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-400">
                <span>ภาษีเงินได้หัก ณ ที่จ่าย</span>
                <span className="font-mono">0.00</span>
              </div>
              <div className="flex justify-between pt-3 font-black text-rose-600 dark:text-rose-400 border-t border-slate-300 dark:border-white/10">
                <span>รวมเงินหักทั้งสิ้น</span>
                <span className="font-mono">{totalDeductions.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Grand Net Total Box */}
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-500/30 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                ยอดเงินรับสุทธิ (Net Amount Transferred)
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
                (หนึ่งหมื่นห้าพันหนึ่งร้อยสิบบาทเจ็ดสิบสตางค์ถ้วน)
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-300 font-mono">
              ฿{netSalary.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
            </div>
          </div>

          {/* Security & Verification Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-slate-400">
            <div>
              เอกสารนี้ออกโดยระบบจ่ายตรงเงินเดือนอิเล็กทรอนิกส์ กองการเงิน บช.ตชด.
            </div>
            <div>
              รหัสตรวจสอบเอกสาร e-Signature: POLIS-SHA256-085-786-90B
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
