import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Camera,
  ExternalLink,
  Shield,
  Clock,
  Radio,
  FileText,
  Filter,
} from 'lucide-react';
import { usePRIntel } from '../../context/PRIntelContext';
import { formatRelativeTime } from '../../utils/formatters';
import { AlertSeverity } from '../../types/bppTypes';

export const PRAlertsView: React.FC = () => {
  const {
    alerts,
    markAlertAsRead,
    markAllAlertsAsRead,
    setSelectedPost,
    posts,
    setActivePRView,
    setIsAddMissionOpen,
    setPrefilledMissionData,
  } = usePRIntel();

  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [unreadOnly, setUnreadOnly] = useState<boolean>(false);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alt) => {
      if (unreadOnly && alt.read) return false;
      if (filterSeverity !== 'all' && alt.severity !== filterSeverity) return false;
      return true;
    });
  }, [alerts, filterSeverity, unreadOnly]);

  const unreadCount = alerts.filter((a) => !a.read).length;
  const criticalCount = alerts.filter((a) => a.severity === 'critical' || a.severity === 'high').length;

  const handleAction = (alertItem: any) => {
    markAlertAsRead(alertItem.id);
    if (alertItem.actionLink) {
      if (alertItem.actionLink.startsWith('post-')) {
        const found = posts.find((p) => p.id === alertItem.actionLink);
        if (found) {
          setSelectedPost(found);
          setActivePRView('latest');
        }
      } else if (alertItem.actionLink === 'create-mission') {
        setPrefilledMissionData({
          title: `ภารกิจบันทึกภาพตอบโต้/ชี้แจง: ${alertItem.title}`,
          description: `สร้างชุดภาพและข่าวชี้แจงประเด็น: ${alertItem.message}`,
          priority: 'urgent',
          category: 'แถลงข่าวและประชาสัมพันธ์',
        });
        setIsAddMissionOpen(true);
      }
    }
  };

  const getSeverityStyle = (sev: AlertSeverity) => {
    switch (sev) {
      case 'critical':
        return {
          badge: 'bg-rose-100 text-rose-800 border-rose-200',
          card: 'border-rose-200/90 bg-rose-50/30',
          dot: 'bg-rose-500',
          label: 'วิกฤต (Critical)',
        };
      case 'high':
        return {
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          card: 'border-amber-200/90 bg-amber-50/20',
          dot: 'bg-amber-500',
          label: 'ความเสี่ยงสูง (High)',
        };
      case 'medium':
        return {
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
          card: 'border-blue-200/90 bg-blue-50/20',
          dot: 'bg-blue-500',
          label: 'ปานกลาง (Medium)',
        };
      default:
        return {
          badge: 'bg-slate-100 text-slate-700 border-slate-200',
          card: 'border-slate-200 bg-white',
          dot: 'bg-slate-400',
          label: 'ข้อมูลทั่วไป (Low)',
        };
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-black text-[#1E1B4B] tracking-tight">
                  ศูนย์เตือนภัยข่าวสาร & ประเด็นเสี่ยง (Crisis & Alerts)
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  ระบบตรวจจับข่าวลือ (Fake News) กระแสเชิงลบผิดปกติ และการแจ้งเตือนจากเครือข่ายความมั่นคง
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {unreadCount > 0 && (
              <button
                onClick={markAllAlertsAsRead}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-500" />
                <span>ทำเครื่องหมายว่าอ่านแล้วทั้งหมด</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium">การแจ้งเตือนทั้งหมด</span>
            <div className="text-xl font-black text-[#1E1B4B]">{alerts.length} รายการ</div>
          </div>
          <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-100">
            <span className="text-[11px] text-rose-700 font-medium">ยังไม่ได้เปิดอ่าน</span>
            <div className="text-xl font-black text-rose-700">{unreadCount} รายการ</div>
          </div>
          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-100">
            <span className="text-[11px] text-amber-700 font-medium">ระดับวิกฤตและสูง</span>
            <div className="text-xl font-black text-amber-800">{criticalCount} รายการ</div>
          </div>
          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
            <span className="text-[11px] text-emerald-700 font-medium">ระบบ AI Sentinel</span>
            <div className="text-xl font-black text-emerald-700 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>เฝ้าระวัง 24 ชม.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white border border-slate-200/80 p-3 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2"
          >
            <option value="all">ทุกระดับความรุนแรง</option>
            <option value="critical">วิกฤต (Critical)</option>
            <option value="high">ความเสี่ยงสูง (High)</option>
            <option value="medium">ปานกลาง (Medium)</option>
            <option value="low">ปกติ (Low)</option>
          </select>

          <button
            onClick={() => setUnreadOnly(!unreadOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
              unreadOnly
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            เฉพาะที่ยังไม่อ่าน ({unreadCount})
          </button>
        </div>

        <span className="text-xs text-slate-400">
          แสดง {filteredAlerts.length} จาก {alerts.length} รายการ
        </span>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alt) => {
          const style = getSeverityStyle(alt.severity);
          return (
            <div
              key={alt.id}
              className={`border rounded-2xl p-4 sm:p-5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                style.card
              } ${!alt.read ? 'shadow-xs ring-1 ring-rose-200/80' : 'opacity-85'}`}
            >
              <div className="flex items-start gap-3.5">
                <span className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${style.dot}`} />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badge}`}
                    >
                      {style.label}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      หมวด: {alt.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatRelativeTime(alt.minutesAgo)}
                    </span>
                    {!alt.read && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-600 text-white font-bold animate-pulse">
                        NEW
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{alt.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    {alt.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {!alt.read && (
                  <button
                    onClick={() => markAlertAsRead(alt.id)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                  >
                    ทำเครื่องหมายอ่านแล้ว
                  </button>
                )}
                {alt.actionLink && (
                  <button
                    onClick={() => handleAction(alt)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#27265B] hover:bg-[#1E1B4B] text-white transition flex items-center gap-1.5"
                  >
                    <span>ดำเนินการ</span>
                    <ExternalLink className="w-3 h-3 text-pink-300" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
