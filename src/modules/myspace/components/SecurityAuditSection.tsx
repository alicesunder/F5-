import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Smartphone,
  Laptop,
  LogOut,
  AlertTriangle,
  History,
  CheckCircle2,
  KeyRound,
  Eye,
} from 'lucide-react';

export const SecurityAuditSection: React.FC = () => {
  const [loggedOutDevices, setLoggedOutDevices] = useState(false);

  const sessions = [
    {
      id: 'SES-01',
      device: 'Google Chrome บน macOS (เครื่องนี้)',
      ip: '192.168.1.104 (เครือข่าย บช.ตชด. พหลโยธิน)',
      time: 'กำลังใช้งานในปัจจุบัน',
      current: true,
      icon: Laptop,
    },
    {
      id: 'SES-02',
      device: 'Safari บน iPhone 15 Pro',
      ip: '182.232.xxx.xx (AIS 5G)',
      time: 'เมื่อวานนี้ 19:45 น.',
      current: false,
      icon: Smartphone,
    },
  ];

  const auditLogs = [
    {
      id: 'AUD-01',
      action: 'เข้าดูสลิปเงินเดือนประจำเดือนสิงหาคม 2569',
      actor: 'ส.ต.อ.ชัยโรจน์ สหัสภูริพัฒน์ (เจ้าของบัญชี)',
      ip: '192.168.1.104',
      time: 'วันนี้ 10:15 น.',
      status: 'สำเร็จ',
    },
    {
      id: 'AUD-02',
      action: 'ตรวจสอบสถานะเบี้ยเลี้ยงปฏิบัติการสนาม',
      actor: 'ส.ต.อ.ชัยโรจน์ สหัสภูริพัฒน์ (เจ้าของบัญชี)',
      ip: '192.168.1.104',
      time: 'วันนี้ 09:20 น.',
      status: 'สำเร็จ',
    },
    {
      id: 'AUD-03',
      action: 'เข้าสู่ระบบผ่านการยืนยันตัวตนสองชั้น (2FA)',
      actor: 'ส.ต.อ.ชัยโรจน์ สหัสภูริพัฒน์',
      ip: '192.168.1.104',
      time: 'วันนี้ 08:28 น.',
      status: 'สำเร็จ',
    },
    {
      id: 'AUD-04',
      action: 'เจ้าหน้าที่การเงิน ฝอ.๕ ตรวจสอบฎีกาเบี้ยเลี้ยงประจำรอบ',
      actor: 'ร.ต.ท. ประสิทธิ์ การเงิน (เจ้าหน้าที่ธุรการ)',
      ip: '192.168.1.15',
      time: '12 ก.ย. 2569 14:10 น.',
      status: 'สิทธิ์อนุญาต',
    },
  ];

  const handleLogoutAll = () => {
    setLoggedOutDevices(true);
    setTimeout(() => setLoggedOutDevices(false), 4000);
  };

  return (
    <div className="rounded-3xl p-5 sm:p-7 bg-white/90 dark:bg-[#151A22]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              ความปลอดภัยและการกำกับดูแลข้อมูล
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            ความปลอดภัยและบันทึกการเข้าถึง (Security & Audit Log)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            จัดการอุปกรณ์ที่เข้าสู่ระบบ และตรวจสอบประวัติการเข้าถึงข้อมูลส่วนบุคคลที่มีความอ่อนไหว
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogoutAll}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/20 text-xs font-bold transition cursor-pointer self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>ออกจากระบบทุกอุปกรณ์</span>
        </button>
      </div>

      {loggedOutDevices && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>ส่งคำสั่งออกจากระบบไปยังอุปกรณ์อื่น ๆ ทั้งหมดเรียบร้อยแล้ว คงเหลือเฉพาะเซสชันปัจจุบันนี้</span>
        </div>
      )}

      {/* Active Sessions Grid */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
          อุปกรณ์ที่กำลังเข้าสู่ระบบอยู่ในขณะนี้ (Active Sessions)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sessions.map(ses => {
            const Icon = ses.icon;
            return (
              <div
                key={ses.id}
                className={`p-4 rounded-2xl border transition flex items-start gap-3 ${
                  ses.current
                    ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-300/80 dark:border-blue-500/30'
                    : 'bg-white dark:bg-[#1A1F29]/60 border-slate-200/80 dark:border-white/10'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center flex-shrink-0 text-slate-700 dark:text-slate-300">
                  <Icon className="w-4 h-4" />
                </div>

                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {ses.device}
                    </span>
                    {ses.current && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-bold">
                        เซสชันปัจจุบัน
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {ses.ip}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    เวลาใช้งานล่าสุด: {ses.time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              บันทึกการเข้าถึงข้อมูลสำคัญ (Privacy & Financial Audit Trail)
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            เก็บประวัติย้อนหลัง 90 วัน
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="p-3">กิจกรรม</th>
                <th className="p-3">ผู้ดำเนินการ</th>
                <th className="p-3">ที่อยู่ IP</th>
                <th className="p-3">วัน-เวลา</th>
                <th className="p-3">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition">
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">
                    {log.action}
                  </td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">
                    {log.actor}
                  </td>
                  <td className="p-3 font-mono text-slate-400">
                    {log.ip}
                  </td>
                  <td className="p-3 text-slate-500 dark:text-slate-400">
                    {log.time}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                      {log.status}
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
