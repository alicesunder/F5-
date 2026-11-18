import React, { useState } from 'react';
import { DisasterIncident, DisasterStats } from '../types';
import {
  exportIncidentsToCSV,
  exportIncidentsToExcel,
  printDisasterReport,
} from '../utils/exportUtils';
import {
  FileText,
  FileSpreadsheet,
  Printer,
  Download,
  Calendar,
  Layers,
  Clock,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Building,
  Users,
  Waves,
} from 'lucide-react';

interface DisasterReportsProps {
  incidents: DisasterIncident[];
  stats: DisasterStats;
}

export const DisasterReports: React.FC<DisasterReportsProps> = ({
  incidents,
  stats,
}) => {
  const primaryColor = '#8191BA';
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const now = new Date();
  const todayFormatted = now.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Report Header & Period Selector */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              ระบบจัดทำรายงานสรุปสถานการณ์สาธารณภัย (Disaster Intelligence Reports)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            รวบรวมข้อมูลสถานการณ์ ผลกระทบ การเผชิญเหตุ และสนับสนุนการตัดสินใจของผู้บริหาร
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => setReportPeriod('daily')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              reportPeriod === 'daily'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            รายงานประจำวัน
          </button>
          <button
            type="button"
            onClick={() => setReportPeriod('weekly')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              reportPeriod === 'weekly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            รายงานรายสัปดาห์
          </button>
          <button
            type="button"
            onClick={() => setReportPeriod('monthly')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              reportPeriod === 'monthly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            รายงานประจำเดือน
          </button>
        </div>
      </div>

      {/* Export Action Buttons Toolbar */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>ข้อมูล ณ วันที่ {todayFormatted} เวลา 12:00 น.</span>
          <span className="text-slate-300">•</span>
          <span className="font-semibold text-slate-800">
            เอกสารพร้อมดาวน์โหลด ({incidents.length} รายการ)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* PDF Print */}
          <button
            type="button"
            onClick={() => printDisasterReport()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 shadow-2xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-rose-600" />
            <span>พิมพ์ / บันทึกเป็น PDF</span>
          </button>

          {/* Excel Export */}
          <button
            type="button"
            onClick={() => exportIncidentsToExcel(incidents)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 shadow-2xs transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>ส่งออก Excel (.xls)</span>
          </button>

          {/* CSV Export */}
          <button
            type="button"
            onClick={() => exportIncidentsToCSV(incidents)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 shadow-2xs transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-sky-600" />
            <span>ส่งออก CSV (UTF-8)</span>
          </button>
        </div>
      </div>

      {/* Formal Situation Report Document Layout (Official Thai Format Preview) */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8 font-sans print:border-none print:shadow-none print:p-0">
        {/* Official Header */}
        <div className="text-center pb-6 border-b-2 border-slate-800 space-y-1.5">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 font-bold border border-slate-300">
            ศปภ.
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            รายงานสถานการณ์สาธารณภัยและการปฏิบัติการฉุกเฉิน{' '}
            {reportPeriod === 'daily'
              ? 'ประจำวัน'
              : reportPeriod === 'weekly'
              ? 'ประจำสัปดาห์'
              : 'ประจำเดือน'}
          </h2>
          <p className="text-xs text-slate-600">
            ศูนย์อำนวยการและประสานงานสาธารณภัย (ศปภ.) กรมป้องกันและบรรเทาสาธารณภัย
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            ฉบับที่ {reportPeriod === 'daily' ? '128/2569' : '18/2569'} ประจำวันที่ {todayFormatted}
          </p>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-1.5">
            1. สรุปภาพรวมสถานการณ์ (Executive Summary)
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed indent-6">
            ตามที่ได้เกิดสถานการณ์ร่องมรสุมพาดผ่านภาคเหนือและภาคตะวันออกเฉียงเหนือตอนบน ส่งผลให้เกิดฝนตกหนักสะสมในพื้นที่จังหวัดเชียงราย น่าน สุโขทัย และอุบลราชธานี ระหว่างวันที่ 8-10 กันยายน 2569 มีพื้นที่ได้รับผลกระทบรวมทั้งสิ้น{' '}
            <strong className="text-slate-900">{stats.totalIncidents} เหตุการณ์</strong> ใน 4 จังหวัด 5 อำเภอ รวมทั้งสิ้น{' '}
            <strong className="text-slate-900">{stats.affectedHouseholdsTotal.toLocaleString()} ครัวเรือน</strong> ราษฎรได้รับความเดือดร้อน{' '}
            <strong className="text-slate-900">{stats.affectedPeopleTotal.toLocaleString()} คน</strong> ผู้บาดเจ็บ 4 ราย ไม่มีผู้สูญหายหรือเสียชีวิต
          </p>
        </div>

        {/* Section 2: Key Metric Tables */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-1.5">
            2. ตารางสรุปพื้นที่ประสบภัยและสถานะการเผชิญเหตุ
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3 border-r border-slate-200">รหัสเหตุ</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">พื้นที่ (อำเภอ/จังหวัด)</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">ประเภทภัย</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 text-right">ครัวเรือน</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 text-right">ระดับน้ำ (ซม.)</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">หน่วยงานเผชิญเหตุ</th>
                  <th className="py-2.5 px-3 text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {incidents.map(i => (
                  <tr key={i.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono font-semibold text-slate-700 border-r border-slate-200">
                      {i.id}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200">
                      {i.district}, จ.{i.province}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-slate-600">
                      {i.type}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-right font-mono">
                      {i.affectedHouseholds.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-right font-mono">
                      {i.waterLevelCm || 0}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-slate-600">
                      {i.assignedUnit}
                    </td>
                    <td className="py-2 px-3 text-center font-semibold text-[11px]">
                      {i.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Mobilization & Resources */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-1.5">
            3. การระดมกำลังพลและยุทโธปกรณ์สนับสนุน
          </h4>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
            <li>จัดตั้งศูนย์พักพิงชั่วคราว ณ เทศบาลตำบลเวียงพางคำ และ โรงเรียนบ้านห้วยขาบ รวม 2 แห่ง รองรับประชาชน 385 คน</li>
            <li>สนับสนุนเรือท้องแบนติดเครื่องยนต์กู้ภัย 16 ลำ และรถยกสูงเคลื่อนย้ายผู้ประสบภัย 8 คัน</li>
            <li>ติดตั้งเครื่องสูบน้ำขนาดใหญ่ระบายน้ำลงสู่ทุ่งรับน้ำบางระกำและแม่น้ำมูล รวม 18 เครื่อง</li>
            <li>แจกจ่ายถุงยังชีพพระราชทานและน้ำดื่มสะอาดแล้ว 1,500 ชุด</li>
          </ul>
        </div>

        {/* Signatures */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
          <div className="space-y-1">
            <div className="h-10" />
            <p className="font-semibold text-slate-900">(...................................)</p>
            <p className="text-slate-500">หัวหน้าฝ่ายปฏิบัติการส่วนหน้า</p>
          </div>
          <div className="space-y-1">
            <div className="h-10" />
            <p className="font-semibold text-slate-900">(นายวิโรจน์ ธนกิจจา)</p>
            <p className="text-slate-500">ผู้อำนวยการศูนย์ป้องกันและบรรเทาสาธารณภัย</p>
          </div>
        </div>
      </div>
    </div>
  );
};
