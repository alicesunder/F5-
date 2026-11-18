import React, { useMemo, useState } from 'react';
import { DisasterIncident, DisasterStats, HydrologicalStation } from '../types';
import { Sparkles, Copy, Check, FileDown } from 'lucide-react';

interface DailyBulletinProps {
  incidents: DisasterIncident[];
  stations: HydrologicalStation[];
  stats: DisasterStats;
}

/** Builds a plain-text daily situation bulletin from live data, in the spirit of the source platform's Daily Bulletin report. */
const buildBulletinText = (incidents: DisasterIncident[], stations: HydrologicalStation[], stats: DisasterStats) => {
  const today = new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
  const critical = stations.filter(s => s.status === 'critical');
  const warning = stations.filter(s => s.status === 'warning');
  const activeIncidents = incidents.filter(i => i.status !== 'เสร็จสิ้น');

  const lines: string[] = [];
  lines.push(`สรุปสถานการณ์สาธารณภัยประจำวันที่ ${today}`);
  lines.push('');
  lines.push(`เหตุการณ์ที่กำลังดำเนินการ: ${activeIncidents.length} เหตุการณ์ (วิกฤต ${stats.criticalCount} · ควบคุมสถานการณ์แล้ว ${stats.controlledCount})`);
  lines.push(`ผลกระทบสะสม: ${stats.affectedHouseholdsTotal.toLocaleString()} ครัวเรือน / ${stats.affectedPeopleTotal.toLocaleString()} คน`);
  lines.push('');

  if (critical.length > 0) {
    lines.push('สถานีระดับน้ำวิกฤตล้นตลิ่ง:');
    critical.forEach(s => lines.push(`  • ${s.name} (${s.code}, ${s.basin}) — ${s.currentWaterLevel.toFixed(2)} ม. (${s.capacityPercent}% ของตลิ่ง)`));
    lines.push('');
  }
  if (warning.length > 0) {
    lines.push('สถานีเฝ้าระวังใกล้ล้นตลิ่ง:');
    warning.forEach(s => lines.push(`  • ${s.name} (${s.code}, ${s.basin}) — ${s.currentWaterLevel.toFixed(2)} ม. (${s.capacityPercent}% ของตลิ่ง)`));
    lines.push('');
  }
  if (critical.length === 0 && warning.length === 0) {
    lines.push('สถานีโทรมาตรทุกลุ่มน้ำอยู่ในเกณฑ์ปกติ ไม่มีจุดเฝ้าระวังพิเศษ');
    lines.push('');
  }

  if (activeIncidents.length > 0) {
    lines.push('เหตุการณ์ที่ต้องติดตามต่อเนื่อง:');
    activeIncidents.slice(0, 5).forEach(i => lines.push(`  • [${i.severity}] ${i.title} — อ.${i.district} จ.${i.province} (${i.status})`));
  }

  return lines.join('\n');
};

export const DailyBulletin: React.FC<DailyBulletinProps> = ({ incidents, stations, stats }) => {
  const bulletin = useMemo(() => buildBulletinText(incidents, stations, stats), [incidents, stations, stats]);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bulletin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — silently ignore, the text is still selectable.
    }
  };

  const handleDownload = () => {
    const blob = new Blob([bulletin], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulletin-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#8191BA]" />
          <h4 className="text-sm font-bold text-slate-900">สรุปสถานการณ์ประจำวัน (Daily Bulletin)</h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'คัดลอกแล้ว' : 'คัดลอกข้อความ'}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition"
            style={{ backgroundColor: '#8191BA' }}
          >
            <FileDown className="w-3.5 h-3.5" />
            ดาวน์โหลด .txt
          </button>
        </div>
      </div>
      <pre className="mt-4 whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-700 bg-slate-50 border border-slate-100 rounded-2xl p-4 max-h-96 overflow-y-auto">
        {bulletin}
      </pre>
      <p className="text-[11px] text-slate-400 mt-2">สร้างขึ้นอัตโนมัติจากข้อมูลสถานีโทรมาตรและเหตุการณ์ล่าสุดในระบบ ณ ขณะนี้</p>
    </div>
  );
};
