import React from 'react';
import {
  X,
  Printer,
  Download,
  Shield,
  FileCheck2,
  Calendar,
  Building,
} from 'lucide-react';
import {
  CHAIROT_POLICE_RECORD,
  POSITION_HISTORY,
  RANK_HISTORY,
  SALARY_STEP_HISTORY,
  THREE_YEARS_STEPS,
} from '../../../data/personalData';

interface PolisDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PolisDocumentModal: React.FC<PolisDocumentModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-[#151A22] border border-slate-200 dark:border-white/10 shadow-2xl my-6 flex flex-col max-h-[90vh]">
        {/* Modal Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1F29] rounded-t-3xl">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                ทะเบียนประวัติข้าราชการตำรวจ (ทบ.1 / POLIS Official Record)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                เอกสารทางการจากฐานข้อมูลกำลังพล สำนักงานตำรวจแห่งชาติ (พิมพ์เมื่อ 20 ส.ค. 2569)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์เอกสาร</span>
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

        {/* Modal Scrollable Document Body (Authentic Police Sheet Replication) */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-slate-900 dark:text-slate-100 font-sans text-xs print:p-0 print:text-black">
          {/* Header Metadata Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-slate-800 dark:border-slate-300 text-[11px] font-mono">
            <div>
              <span className="font-bold">ชื่อเอกสาร:</span> ประวัติข้าราชการตำรวจ หน้าที่ 1
            </div>
            <div className="text-right">
              <span>วันที่พิมพ์: 20 ส.ค. 2569</span> | <span>IP เครื่องที่พิมพ์: 192.168.1.104</span>
            </div>
          </div>

          {/* Officer Identity Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <div className="md:col-span-3 space-y-1.5">
              <div className="text-base font-black text-blue-900 dark:text-blue-300">
                ยศ ชื่อ สกุล: {CHAIROT_POLICE_RECORD.fullName}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">เลขบัตรประชาชน:</span>{' '}
                  <span className="font-mono font-bold">{CHAIROT_POLICE_RECORD.nationalId}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">เลขตำแหน่ง:</span>{' '}
                  <span className="font-mono font-bold">{CHAIROT_POLICE_RECORD.positionNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">ตำแหน่ง:</span>{' '}
                  <span className="font-bold">{CHAIROT_POLICE_RECORD.position}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">สถานภาพ:</span>{' '}
                  <span className="font-bold">{CHAIROT_POLICE_RECORD.status}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">วันเดือนปีเกิด:</span>{' '}
                  <span>{CHAIROT_POLICE_RECORD.birthDate} (อายุ {CHAIROT_POLICE_RECORD.ageYears} ปี {CHAIROT_POLICE_RECORD.ageMonths} เดือน)</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">ปีเกษียณ พ.ศ.:</span>{' '}
                  <span className="font-bold">{CHAIROT_POLICE_RECORD.retirementYear}</span>
                </div>
              </div>
            </div>

            {/* Service Dates Summary */}
            <div className="p-3 rounded-lg bg-white dark:bg-[#1A1F29] border border-slate-200 dark:border-white/5 text-[11px] space-y-1">
              <div className="font-bold text-slate-800 dark:text-slate-200 border-b pb-1">
                อายุราชการรวม
              </div>
              <div>วันบรรจุ: {CHAIROT_POLICE_RECORD.enlistmentDate}</div>
              <div>รวม: {CHAIROT_POLICE_RECORD.totalServiceYears} ปี</div>
              <div>ชั้นพลฯ: {CHAIROT_POLICE_RECORD.privateServiceYears} ปี {CHAIROT_POLICE_RECORD.privateServiceMonths} เดือน</div>
              <div>ชั้นประทวน: {CHAIROT_POLICE_RECORD.ncoServiceMonths} เดือน</div>
            </div>
          </div>

          {/* Position History Table */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 border-b pb-1">
              ประวัติการดำรงตำแหน่ง
            </h4>
            <table className="w-full text-left border-collapse border border-slate-300 dark:border-white/10">
              <thead className="bg-slate-100 dark:bg-white/5 font-bold">
                <tr>
                  <th className="p-2 border border-slate-300 dark:border-white/10">เมื่อวันที่</th>
                  <th className="p-2 border border-slate-300 dark:border-white/10">ตำแหน่ง</th>
                  <th className="p-2 border border-slate-300 dark:border-white/10">เลขตำแหน่ง</th>
                  <th className="p-2 border border-slate-300 dark:border-white/10">สังกัดหน่วยงาน</th>
                </tr>
              </thead>
              <tbody>
                {POSITION_HISTORY.map((p, idx) => (
                  <tr key={idx} className="border-b border-slate-200 dark:border-white/5">
                    <td className="p-2 border border-slate-300 dark:border-white/10">{p.date}</td>
                    <td className="p-2 border border-slate-300 dark:border-white/10 font-bold">{p.position}</td>
                    <td className="p-2 border border-slate-300 dark:border-white/10 font-mono">{p.positionNumber}</td>
                    <td className="p-2 border border-slate-300 dark:border-white/10">{p.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rank History Table */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 border-b pb-1">
              ประวัติยศ
            </h4>
            <table className="w-full text-left border-collapse border border-slate-300 dark:border-white/10">
              <thead className="bg-slate-100 dark:bg-white/5 font-bold">
                <tr>
                  <th className="p-2 border border-slate-300 dark:border-white/10">เมื่อวันที่</th>
                  <th className="p-2 border border-slate-300 dark:border-white/10">ยศ</th>
                </tr>
              </thead>
              <tbody>
                {RANK_HISTORY.map((r, idx) => (
                  <tr key={idx} className="border-b border-slate-200 dark:border-white/5">
                    <td className="p-2 border border-slate-300 dark:border-white/10">{r.date}</td>
                    <td className="p-2 border border-slate-300 dark:border-white/10 font-bold">{r.rank}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Salary Step Adjustments Table */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 border-b pb-1">
              ประวัติการเลื่อนเงินเดือน
            </h4>
            <table className="w-full text-left border-collapse border border-slate-300 dark:border-white/10">
              <thead className="bg-slate-100 dark:bg-white/5 font-bold">
                <tr>
                  <th className="p-2 border border-slate-300 dark:border-white/10">พ.ศ./เดือน</th>
                  <th className="p-2 border border-slate-300 dark:border-white/10">ระดับ</th>
                  <th className="p-2 border border-slate-300 dark:border-white/10">ขั้น</th>
                  <th className="p-2 border border-slate-300 dark:border-white/10">เงินเดือน</th>
                  <th className="p-2 border border-slate-300 dark:border-white/10">ขั้นที่เลื่อน</th>
                  <th className="p-2 border border-slate-300 dark:border-white/10">เงินใช้เลื่อน</th>
                  <th className="p-2 border border-slate-300 dark:border-white/10">บัญชี</th>
                  <th className="p-2 border border-slate-300 dark:border-white/10">หมายเหตุ</th>
                </tr>
              </thead>
              <tbody>
                {SALARY_STEP_HISTORY.map((s, idx) => (
                  <tr key={idx} className="border-b border-slate-200 dark:border-white/5">
                    <td className="p-2 border border-slate-300 dark:border-white/10 font-mono font-bold">{s.fiscalYearMonth}</td>
                    <td className="p-2 border border-slate-300 dark:border-white/10">{s.salaryLevel}</td>
                    <td className="p-2 border border-slate-300 dark:border-white/10">{s.step}</td>
                    <td className="p-2 border border-slate-300 dark:border-white/10 font-mono font-bold">{s.baseSalary.toLocaleString()}</td>
                    <td className="p-2 border border-slate-300 dark:border-white/10 text-emerald-600 font-bold">+{s.stepPromoted}</td>
                    <td className="p-2 border border-slate-300 dark:border-white/10 font-mono">{s.stepPromotionAmount.toLocaleString()}</td>
                    <td className="p-2 border border-slate-300 dark:border-white/10">{s.accountType}</td>
                    <td className="p-2 border border-slate-300 dark:border-white/10 text-[10px] text-slate-500">{s.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Past 3 Years Step Evaluation */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 border-b pb-1">
              ขั้นย้อนหลัง 3 ปี
            </h4>
            <div className="grid grid-cols-4 gap-3 text-center">
              {THREE_YEARS_STEPS.map(s => (
                <div key={s.year} className="p-2 border border-slate-300 dark:border-white/10 rounded-lg">
                  <div className="font-bold text-slate-500">{s.year}</div>
                  <div className="text-xs font-bold mt-1">
                    เม.ย. {s.apr} | ต.ค. {s.oct}
                  </div>
                  <div className="text-[11px] text-blue-600 font-bold mt-0.5">
                    รวม {s.total} ขั้น
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Official Verification Footer */}
          <div className="pt-6 border-t-2 border-slate-800 dark:border-slate-300 flex items-center justify-between text-[11px] text-slate-500">
            <div>
              รับรองสำเนาถูกต้อง (สำเนาเอกสารอิเล็กทรอนิกส์ บช.ตชด.)
            </div>
            <div>
              ระบบฐานข้อมูลทะเบียนพล POLIS สำนักงานตำรวจแห่งชาติ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
