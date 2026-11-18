import React, { useRef, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { Bell, CheckCheck, Clock, AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

interface NotificationPopoverProps {
  isOpen?: boolean;
  onClose: () => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({ isOpen = true, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, navigate, navigateModule } = useAdmin();
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (n: typeof notifications[0]) => {
    markNotificationRead(n.id);
    if (n.module === 'incoming') navigate('incoming');
    else if (n.module === 'outgoing') navigate('outgoing');
    else if (n.module === 'budget') navigate('budget');
    else if (n.module === 'travel') navigate('travel');
    else if (n.module === 'document') navigate('documents');
    onClose();
  };

  return (
    <div
      ref={popoverRef}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl liquid-glass-modal border border-[rgba(40,35,50,0.10)] dark:border-white/10 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 text-[#2D2A32] dark:text-[#F5F7FA] shadow-xl"
    >
      {/* Header */}
      <div className="p-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between bg-white/40 dark:bg-white/5">
        <div>
          <div className="text-[10px] font-mono tracking-wider text-[#5B2A86] dark:text-[#B3A0E8] uppercase font-bold">
            // TELEMETRY & NOTIFICATIONS
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <h4 className="text-xs font-bold text-[#2D2A32] dark:text-[#F5F7FA]">การแจ้งเตือนและการดำเนินงาน</h4>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40">
                {unreadCount} ใหม่
              </span>
            )}
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="text-[11px] text-[#5B2A86] dark:text-[#B3A0E8] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
          >
            <CheckCheck className="w-3.5 h-3.5" /> อ่านทั้งหมด
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-black/5 dark:divide-white/5">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#8A8792] dark:text-[#7D8490] font-mono">
            // ไม่มีการแจ้งเตือนใหม่
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`p-3.5 flex items-start gap-3 cursor-pointer transition hover:bg-black/5 dark:hover:bg-white/5 ${
                !n.isRead ? 'bg-[#EDE4F7]/40 dark:bg-[#8B6CCF]/10' : ''
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {n.type === 'urgent' && <AlertCircle className="w-4 h-4 text-rose-500 stroke-[1.8]" />}
                {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 stroke-[1.8]" />}
                {n.type === 'info' && <Info className="w-4 h-4 text-[#2583D8] dark:text-[#60A5FA] stroke-[1.8]" />}
                {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 stroke-[1.8]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h5 className={`text-xs truncate ${!n.isRead ? 'text-[#2D2A32] dark:text-[#F5F7FA] font-bold' : 'text-[#4A4852] dark:text-[#A9AFBB] font-normal'}`}>
                    {n.title}
                  </h5>
                  <span className="text-[10px] font-mono text-[#8A8792] dark:text-[#7D8490] shrink-0 flex items-center gap-0.5">
                    <Clock className="w-3 h-3" /> {n.time.slice(11)} น.
                  </span>
                </div>
                <p className="text-[11px] text-[#5A5764] dark:text-[#7D8490] mt-0.5 leading-snug font-normal">
                  {n.message}
                </p>
              </div>
              {!n.isRead && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#5B2A86] dark:bg-[#B3A0E8] mt-1.5 shrink-0" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-white/40 dark:bg-white/5 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => {
            navigateModule('settings');
            onClose();
          }}
          className="text-[11px] text-[#8A8792] dark:text-[#7D8490] hover:text-[#5B2A86] dark:hover:text-[#B3A0E8] cursor-pointer"
        >
          ตั้งค่าการแจ้งเตือน
        </button>
        <button
          type="button"
          onClick={() => {
            navigate('dashboard');
            onClose();
          }}
          className="font-semibold text-[#5B2A86] dark:text-[#B3A0E8] hover:underline cursor-pointer"
        >
          แผงควบคุมหลัก →
        </button>
      </div>
    </div>
  );
};

export default NotificationPopover;
