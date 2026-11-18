import React, { useState } from 'react';
import { DisasterIncident } from '../types';
import {
  exportIncidentsToCSV,
  exportIncidentsToExcel,
  printDisasterReport,
} from '../utils/exportUtils';
import {
  X,
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  CheckSquare,
  FileText,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: DisasterIncident[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  incidents,
}) => {
  const primaryColor = '#8191BA';

  const [exportFormat, setExportFormat] = useState<'excel' | 'csv' | 'pdf'>('excel');
  const [includeTimeline, setIncludeTimeline] = useState(true);
  const [includeAttachments, setIncludeAttachments] = useState(true);
  const [dateRange, setDateRange] = useState('all');

  if (!isOpen) return null;

  const handleExport = () => {
    if (exportFormat === 'excel') {
      exportIncidentsToExcel(incidents);
    } else if (exportFormat === 'csv') {
      exportIncidentsToCSV(incidents);
    } else {
      printDisasterReport();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden text-[#1F2937]">
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">ส่งออกรายงานข้อมูลสาธารณภัย</h3>
              <p className="text-[11px] text-slate-500 font-mono">EXPORT SITUATION DATA REGISTRY</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-2">เลือกรูปแบบเอกสารที่ต้องการ</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setExportFormat('excel')}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                  exportFormat === 'excel'
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <span>Excel (.xls)</span>
              </button>

              <button
                type="button"
                onClick={() => setExportFormat('csv')}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                  exportFormat === 'csv'
                    ? 'border-sky-500 bg-sky-50/50 text-sky-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Download className="w-5 h-5 text-sky-600" />
                <span>CSV (UTF-8)</span>
              </button>

              <button
                type="button"
                onClick={() => setExportFormat('pdf')}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                  exportFormat === 'pdf'
                    ? 'border-rose-500 bg-rose-50/50 text-rose-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Printer className="w-5 h-5 text-rose-600" />
                <span>PDF (ทางการ)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">ช่วงเวลาของข้อมูล</label>
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
            >
              <option value="all">ข้อมูลทั้งหมด ({incidents.length} รายการ)</option>
              <option value="today">เฉพาะรายงานประจำวัน (24 ชม.)</option>
              <option value="week">รายงานสัปดาห์ปัจจุบัน</option>
              <option value="month">รายงานประจำเดือนกันยายน 2569</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-semibold text-slate-700 block">ตัวเลือกข้อมูลประกอบ:</span>
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                checked={includeTimeline}
                onChange={e => setIncludeTimeline(e.target.checked)}
                className="rounded text-blue-600 focus:ring-0"
              />
              <span>แนบประวัติไทม์ไลน์การปฏิบัติการ</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                checked={includeAttachments}
                onChange={e => setIncludeAttachments(e.target.checked)}
                className="rounded text-blue-600 focus:ring-0"
              />
              <span>ระบุรายการภาพถ่ายและเอกสารอ้างอิง</span>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="px-5 py-2 rounded-xl text-white font-semibold flex items-center gap-1.5 shadow-xs transition hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              <Download className="w-4 h-4" />
              <span>ดาวน์โหลดไฟล์</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
