import React, { useState } from 'react';
import { useDemoMode, setDemoMode } from '../../lib/demoMode';
import { useShowAllMenus, setShowAllMenus } from '../../lib/menuVisibility';
import { useAdmin } from '../../contexts/AdminContext';
import { useTheme, ThemeMode, DisplayDensity, FontSizeScale } from '../../contexts/ThemeContext';
import { Role, AppModule } from '../../types';
import {
  Settings,
  Sun,
  Moon,
  Laptop,
  Bell,
  User,
  Shield,
  Key,
  Database,
  Share2,
  FileText,
  Info,
  Check,
  RotateCcw,
  Sparkles,
  Lock,
  Layers,
  Globe,
  Sliders,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Save,
  Clock,
  Eye,
  EyeOff,
  UserCheck,
  CloudUpload,
  HardDrive,
  Download,
  Trash2,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { ChangePasswordCard, StaffManager, DataExportCard, IntegrationStatusCard } from '../../components/admin/AccountAdmin';

export type SettingsSectionId =
  | 'general'
  | 'appearance'
  | 'notifications'
  | 'account'
  | 'roles'
  | 'security'
  | 'data'
  | 'integrations'
  | 'audit'
  | 'about';

interface SectionNav {
  id: SettingsSectionId;
  label: string;
  enLabel: string;
  icon: typeof Settings;
  badge?: string;
  badgeColor?: string;
}

export const SettingsModule: React.FC = () => {
  const showAllMenus = useShowAllMenus();
  const demoOn = useDemoMode();
  const { currentRole, setRole, currentUser, showToast } = useAdmin();
  const {
    theme,
    resolvedTheme,
    setTheme,
    settings,
    updateSettings,
    updateNotificationCategory,
    updateIntegrationStatus,
    resetSettingsToDefault,
    auditLogs,
    addAuditLog,
    saveStatus,
  } = useTheme();

  const [activeSection, setActiveSection] = useState<SettingsSectionId>('general');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);

  // Form states for account
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    rank: currentUser.rank,
    position: currentUser.position,
    department: currentUser.department,
    email: currentUser.email,
    phone: currentUser.phone,
  });

  const sections: SectionNav[] = [
    { id: 'general', label: 'การตั้งค่าทั่วไป', enLabel: 'General', icon: Sliders },
    { id: 'appearance', label: 'การแสดงผล & ธีม', enLabel: 'Appearance & Theme', icon: Sun, badge: theme.toUpperCase() },
    { id: 'notifications', label: 'การแจ้งเตือน', enLabel: 'Notifications', icon: Bell },
    { id: 'account', label: 'ข้อมูลบัญชีผู้ใช้', enLabel: 'Account Profile', icon: User },
    { id: 'roles', label: 'บทบาท & สิทธิ์เข้าถึง', enLabel: 'Role & Permissions', icon: Shield, badge: 'RBAC' },
    { id: 'security', label: 'ความปลอดภัย', enLabel: 'Security & Access', icon: Key },
    { id: 'data', label: 'การจัดการข้อมูล & สำรอง', enLabel: 'Data & Backup', icon: Database },
    { id: 'integrations', label: 'การเชื่อมต่อระบบภายนอก', enLabel: 'Integrations', icon: Share2, badge: 'Google Cloud' },
    { id: 'audit', label: 'บันทึกประวัติการตั้งค่า', enLabel: 'Settings Audit Log', icon: FileText, badge: `${auditLogs.length}` },
    { id: 'about', label: 'เกี่ยวกับระบบ & เวอร์ชั่น', enLabel: 'About & Info', icon: Info },
  ];

  // Save profile info
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({});
    addAuditLog('อัปเดตข้อมูลโปรไฟล์ผู้ใช้งาน', 'Account', `แก้ไขข้อมูลการติดต่อ: ${profileForm.email}`);
    showToast('บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว', 'success');
  };

  // Switch role with audit
  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    addAuditLog(`สลับบทบาทการทดสอบเป็น ${newRole}`, 'Role & Permission', `จำลองบทบาทสิทธิ์: ${newRole}`);
    showToast(`สลับบทบาทเป็น: ${newRole}`, 'info');
  };

  // Backup data action
  const handleTriggerBackup = () => {
    setBackupLoading(true);
    setTimeout(() => {
      setBackupLoading(false);
      addAuditLog('สำรองฐานข้อมูลระบบ (Snapshot)', 'Data Management', 'สร้างไฟล์สำรองข้อมูล JSON/Postgres snapshot สำเร็จ');
      showToast('สำรองข้อมูลฐานระบบ ฝอ.5 สำเร็จเรียบร้อยแล้ว', 'success');
    }, 1200);
  };

  // Sync Integrations
  const handleSyncIntegrations = () => {
    setSyncLoading(true);
    setTimeout(() => {
      setSyncLoading(false);
      addAuditLog('ทดสอบการเชื่อมต่อ API บริการภายนอก', 'Integrations', 'เชื่อมต่อ Google Workspace และ Firebase Firestore สมบูรณ์');
      showToast('ตรวจสอบและซิงก์ API บริการภายนอกเรียบร้อยแล้ว', 'success');
    }, 1000);
  };

  return (
    <div className="min-h-screen iridescent-ambient max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 pb-16">
      {/* 01. Top Header Banner */}
      <div className="liquid-glass-card iridescent-edge rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-white/70 dark:border-white/10 shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8B46C8] via-[#2583D8] via-[#E89B22] to-[#42A77A]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-[#5B2A86] dark:text-[#B3A0E8] uppercase">
              <span className="font-bold">SYSTEM SETTINGS STUDIO</span>
              <span>•</span>
              <span>ฝอ.5 DIGITAL COMMAND CENTER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2D2A32] dark:text-[#F5F7FA]">
              ศูนย์ตั้งค่าและควบคุมระบบ (System Settings)
            </h1>
            <p className="text-xs sm:text-sm text-[#5A5764] dark:text-[#A9AFBB] leading-relaxed">
              จัดการสภาพแวดล้อม การแสดงผล ธีม โหมดกลางคืน (Dark Mode) สิทธิ์การเข้าถึง และการเชื่อมต่อบริการคลาวด์สำหรับเจ้าหน้าที่
            </p>
          </div>

          {/* Quick status pill & auto-save state */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {saveStatus === 'saving' && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium animate-pulse border border-amber-500/20">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>กำลังบันทึกการเปลี่ยนแปลง...</span>
              </div>
            )}
            {saveStatus === 'saved' && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20 animate-in fade-in duration-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>บันทึกการตั้งค่าแล้ว</span>
              </div>
            )}
            <div className="px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 font-mono">
              Role: <span className="font-bold text-[#5B2A86] dark:text-[#B3A0E8]">{currentRole}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 02. Two-Column Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Settings Navigation List */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-3">
          <div className="liquid-glass-card rounded-2xl p-2 sm:p-2.5 border border-white/70 dark:border-white/10 shadow-sm space-y-1">
            <div className="px-3 py-2 text-[10px] font-mono tracking-wider text-slate-400 dark:text-slate-500 uppercase font-bold">
              หมวดหมู่การตั้งค่า (Navigation)
            </div>

            {sections.map(sec => {
              const isActive = activeSection === sec.id;
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-[#5B2A86] text-white shadow-sm font-semibold'
                      : 'text-[#2D2A32] dark:text-[#A9AFBB] hover:bg-white/80 dark:hover:bg-white/5 hover:text-[#5B2A86] dark:hover:text-[#F5F7FA]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-black/5 dark:bg-white/5 text-[#5A5764] dark:text-[#A9AFBB] group-hover:text-[#5B2A86] dark:group-hover:text-[#B3A0E8]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs sm:text-[13px] tracking-tight truncate">{sec.label}</div>
                      <div
                        className={`text-[10px] font-mono leading-none truncate ${
                          isActive ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {sec.enLabel}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {sec.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-black/5 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {sec.badge}
                      </span>
                    )}
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isActive ? 'text-white translate-x-0.5' : 'text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick System Summary Card */}
          <div className="liquid-glass-card rounded-2xl p-4 border border-white/70 dark:border-white/10 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>สถานะระบบ: ปกติ (Operational)</span>
            </div>
            <div className="space-y-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
              <div className="flex justify-between">
                <span>เวอร์ชั่น:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">v2.6.4 (Gov Release)</span>
              </div>
              <div className="flex justify-between">
                <span>เซิร์ฟเวอร์:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">Google Cloud (Asia-SE1)</span>
              </div>
              <div className="flex justify-between">
                <span>อัปเดตล่าสุด:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">13 ก.ย. 2569</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings Content Panels */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* SECTION: GENERAL */}
          {activeSection === 'general' && (
            <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-white/70 dark:border-white/10 shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-black/5 dark:border-white/10 pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#2D2A32] dark:text-[#F5F7FA] flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#5B2A86] dark:text-[#B3A0E8]" />
                  <span>การตั้งค่าทั่วไป (General Settings)</span>
                </h2>
                <p className="text-xs text-[#5A5764] dark:text-[#A9AFBB] mt-1">
                  กำหนดค่าภาษา ระบบเวลา วันที่ และพฤติกรรมการแสดงผลเริ่มต้นของระบบ
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Language */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    ภาษาของระบบ (System Language)
                  </label>
                  <select
                    value={settings.language}
                    onChange={e => {
                      updateSettings({ language: e.target.value as 'th' | 'en' });
                      addAuditLog('เปลี่ยนภาษาของระบบ', 'General', `ภาษา: ${e.target.value}`);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#151821] text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#5B2A86]"
                  >
                    <option value="th">ภาษาไทย (Thai - ค่ามาตรฐานราชการ)</option>
                    <option value="en">English (US)</option>
                  </select>
                  <p className="text-[11px] text-slate-400">ใช้ภาษาไทยเป็นมาตรฐานสำหรับเอกสารราชการและตารางภารกิจ</p>
                </div>

                {/* Timezone */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    เขตเวลา (Timezone)
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={e => updateSettings({ timezone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#151821] text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#5B2A86]"
                  >
                    <option value="(UTC+07:00) Bangkok, Hanoi, Jakarta">(UTC+07:00) เวลามาตรฐานประเทศไทย (Bangkok)</option>
                    <option value="(UTC+00:00) UTC">(UTC+00:00) เวลาสากลเชิงพิกัด (UTC)</option>
                  </select>
                </div>

                {/* Date Format */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    รูปแบบวันที่ (Date Format)
                  </label>
                  <select
                    value={settings.dateFormat}
                    onChange={e => updateSettings({ dateFormat: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#151821] text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#5B2A86]"
                  >
                    <option value="13 กันยายน 2569 (พ.ศ.)">วัน เดือน ปี พุทธศักราช (เช่น 13 กันยายน 2569)</option>
                    <option value="13/09/2569">DD/MM/YYYY (พ.ศ.)</option>
                    <option value="2026-09-13">ISO 8601 (2026-09-13 ค.ศ.)</option>
                  </select>
                </div>

                {/* Time Format */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    รูปแบบเวลา (Time Format)
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => updateSettings({ timeFormat: '24h' })}
                      className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-medium cursor-pointer transition ${
                        settings.timeFormat === '24h'
                          ? 'border-[#5B2A86] bg-[#EDE4F7] dark:bg-[#8B6CCF]/20 text-[#5B2A86] dark:text-[#B3A0E8] font-bold'
                          : 'border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      24 ชั่วโมง (เช่น 14:30 น.)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSettings({ timeFormat: '12h' })}
                      className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-medium cursor-pointer transition ${
                        settings.timeFormat === '12h'
                          ? 'border-[#5B2A86] bg-[#EDE4F7] dark:bg-[#8B6CCF]/20 text-[#5B2A86] dark:text-[#B3A0E8] font-bold'
                          : 'border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      12 ชั่วโมง (AM / PM)
                    </button>
                  </div>
                </div>

                {/* Default Landing Module */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    หน้าแรกหลังเข้าสู่ระบบ (Default Landing View)
                  </label>
                  <select
                    value={settings.defaultHomePage}
                    onChange={e => updateSettings({ defaultHomePage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#151821] text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#5B2A86]"
                  >
                    <option value="dashboard">ศูนย์บริหารงานกลาง (Central Dashboard)</option>
                    <option value="task-center">ศูนย์งานกลาง & เรดาร์กำหนดส่ง (Task Center)</option>
                    <option value="bpp-tracker">ระบบตรวจเช็ครายงาน กก.ตชด. (BPP Tracker)</option>
                    <option value="documents">ศูนย์เอกสารราชการ & ร่าง AI</option>
                  </select>
                </div>

                {/* Items Per Page */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    จำนวนรายการต่อหน้า (Table Pagination)
                  </label>
                  <select
                    value={settings.itemsPerPage}
                    onChange={e => updateSettings({ itemsPerPage: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#151821] text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#5B2A86]"
                  >
                    <option value={10}>10 รายการ / หน้า</option>
                    <option value={15}>15 รายการ / หน้า (แนะนำ)</option>
                    <option value={25}>25 รายการ / หน้า</option>
                    <option value={50}>50 รายการ / หน้า</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: APPEARANCE & THEME (Dark mode highlights) */}
          {activeSection === 'appearance' && (
            <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-white/70 dark:border-white/10 shadow-sm space-y-8 animate-in fade-in duration-200">
              <div className="border-b border-black/5 dark:border-white/10 pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#2D2A32] dark:text-[#F5F7FA] flex items-center gap-2">
                  <Sun className="w-5 h-5 text-[#5B2A86] dark:text-[#B3A0E8]" />
                  <span>การแสดงผลและธีม (Appearance & Theme Settings)</span>
                </h2>
                <p className="text-xs text-[#5A5764] dark:text-[#A9AFBB] mt-1">
                  ปรับแต่งสภาพแวดล้อมสี โหมดมืด โหมดสว่าง ขนาดฟอนต์ และความหนาแน่นเพื่อความสบายตาระหว่างปฏิบัติภารกิจ
                </p>
              </div>

              {/* Theme Selector (3 Cards: Light, Dark, System) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase font-mono">
                    โหมดธีมหลัก (Color Theme Mode)
                  </label>
                  <span className="text-xs font-mono text-slate-400">
                    ปัจจุบัน: <span className="font-bold text-[#5B2A86] dark:text-[#B3A0E8]">{theme.toUpperCase()}</span> (ใช้งาน {resolvedTheme})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Light Mode Card */}
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`relative p-4 rounded-2xl border text-left transition-all cursor-pointer overflow-hidden ${
                      theme === 'light'
                        ? 'border-[#5B2A86] ring-2 ring-[#5B2A86]/30 bg-white shadow-md'
                        : 'border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:border-slate-400'
                    }`}
                  >
                    <div className="h-20 rounded-xl bg-[#F7F7F9] border border-slate-200 p-2 space-y-1.5 mb-3 overflow-hidden shadow-2xs">
                      <div className="h-2 w-16 bg-[#5B2A86] rounded-sm" />
                      <div className="h-3 w-full bg-white rounded border border-slate-200 flex items-center px-1">
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="h-5 rounded bg-white border border-slate-200" />
                        <div className="h-5 rounded bg-white border border-slate-200" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Light Mode</span>
                      </div>
                      {theme === 'light' && <Check className="w-4 h-4 text-[#5B2A86]" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      ธีมสว่าง คมชัด พื้นหลังขาวนวล เหมาะสำหรับเวลากลางวัน
                    </p>
                  </button>

                  {/* Dark Mode Card */}
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`relative p-4 rounded-2xl border text-left transition-all cursor-pointer overflow-hidden ${
                      theme === 'dark'
                        ? 'border-[#B3A0E8] ring-2 ring-[#B3A0E8]/30 bg-[#1A1F29] shadow-md'
                        : 'border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:border-slate-400'
                    }`}
                  >
                    <div className="h-20 rounded-xl bg-[#0E1014] border border-slate-800 p-2 space-y-1.5 mb-3 overflow-hidden shadow-2xs">
                      <div className="h-2 w-16 bg-[#A98BEB] rounded-sm" />
                      <div className="h-3 w-full bg-[#1A1F29] rounded border border-slate-700/60 flex items-center px-1">
                        <div className="w-2 h-2 rounded-full bg-slate-600" />
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="h-5 rounded bg-[#1A1F29] border border-slate-700/60" />
                        <div className="h-5 rounded bg-[#1A1F29] border border-slate-700/60" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-[#B3A0E8]" />
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Dark Mode</span>
                      </div>
                      {theme === 'dark' && <Check className="w-4 h-4 text-[#B3A0E8]" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      ธีมมืด สบายตา ไม่แยงตา ป้องกันอาการล้าสายตาในห้องเวร
                    </p>
                  </button>

                  {/* System Mode Card */}
                  <button
                    type="button"
                    onClick={() => setTheme('system')}
                    className={`relative p-4 rounded-2xl border text-left transition-all cursor-pointer overflow-hidden ${
                      theme === 'system'
                        ? 'border-[#5B2A86] dark:border-[#B3A0E8] ring-2 ring-[#5B2A86]/30 dark:ring-[#B3A0E8]/30 bg-white/90 dark:bg-[#1A1F29] shadow-md'
                        : 'border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:border-slate-400'
                    }`}
                  >
                    <div className="h-20 rounded-xl bg-gradient-to-r from-[#F7F7F9] to-[#0E1014] border border-slate-300 dark:border-slate-700 p-2 space-y-1.5 mb-3 overflow-hidden shadow-2xs">
                      <div className="h-2 w-16 bg-[#5B2A86] dark:bg-[#A98BEB] rounded-sm" />
                      <div className="h-3 w-full bg-white/80 dark:bg-[#1A1F29]/80 rounded border border-slate-300 dark:border-slate-700" />
                      <div className="grid grid-cols-2 gap-1">
                        <div className="h-5 rounded bg-white/80 border border-slate-200" />
                        <div className="h-5 rounded bg-[#1A1F29] border border-slate-700" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Laptop className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">System Mode</span>
                      </div>
                      {theme === 'system' && <Check className="w-4 h-4 text-[#5B2A86] dark:text-[#B3A0E8]" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      สลับอัตโนมัติตามการตั้งค่าของระบบปฏิบัติการ (Windows/macOS/iOS)
                    </p>
                  </button>
                </div>
              </div>

              {/* โหมดข้อมูลจำลอง (แอดมินเท่านั้น) */}
              {['SUPER_ADMIN', 'ADMIN'].includes(String(currentRole)) && (
                <div className={`p-4 rounded-2xl border ${demoOn ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/40' : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10'}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={demoOn} onChange={e => setDemoMode(e.target.checked)} className="mt-1 w-5 h-5" />
                    <span>
                      <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">โหมดข้อมูลจำลอง (สำหรับสาธิต/ทดลองใช้)</span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        เปิดแล้วหน้าหลัก 4 ฝ่าย ทะเบียนหนังสือรับ ตารางเวร รายงาน LINE และรายงานโฆษก จะแสดงข้อมูลตัวอย่างให้ดูหน้าตาของระบบ ทุกชื่อและเลขที่เป็นของสมมติ
                        <b> ไม่บันทึกลงฐานข้อมูลจริง</b> ไม่ว่าจะกรอก แก้ หรือลบอะไรก็ตาม เห็นเฉพาะแท็บนี้ของเครื่องนี้ ปิดโหมด ออกจากระบบ หรือปิดแท็บ แล้วข้อมูลจำลองหายทั้งหมด กลับเป็นข้อมูลจริง
                      </span>
                    </span>
                  </label>
                </div>
              )}

              {/* เมนูที่ซ่อนไว้ */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={showAllMenus} onChange={e => setShowAllMenus(e.target.checked)} className="mt-1 w-5 h-5" />
                  <span>
                    <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">แสดงเมนูทั้งหมด</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      ปกติระบบซ่อนเมนูที่ไม่ค่อยได้ใช้เพื่อให้หาง่าย (อำนวยการ: ไปราชการ, หน่วยงาน/กำลังพล, ผู้ช่วย AI, บันทึกระบบ · ประชาสัมพันธ์: หน้าข่าวประชาชน, Keyword, เปรียบเทียบเพจ, AI วิเคราะห์ข่าว, ตรวจเอกสาร OCR · พัฒนาฯ: สถานีน้ำ, ผู้ช่วย AI) ติ๊กเพื่อแสดงคืน ตั้งค่านี้จำเฉพาะเครื่องนี้
                    </span>
                  </span>
                </label>
              </div>

              {/* Department Color Preview in Active Theme */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    การเรนเดอร์สีประจำ ๔ ฝ่าย (Department Color Matrix)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {resolvedTheme === 'dark' ? 'Dark Calibrated Tokens' : 'Light Standard Tokens'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#151821] border border-black/5 dark:border-white/10 shadow-2xs space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[var(--dept-admin-purple)]" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">ฝ่ายอำนวยการ</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">Purple Identity</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-[#151821] border border-black/5 dark:border-white/10 shadow-2xs space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[var(--dept-relations-blue)]" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">ฝ่ายมวลชนฯ</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">Blue Identity</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-[#151821] border border-black/5 dark:border-white/10 shadow-2xs space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[var(--dept-disaster-amber)]" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">ฝ่ายสาธารณภัย</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">Amber Identity</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-[#151821] border border-black/5 dark:border-white/10 shadow-2xs space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[var(--dept-volunteer-green)]" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">ฝ่ายจิตอาสา</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">Green Identity</p>
                  </div>
                </div>
              </div>

              {/* Display Density & Font Scaling */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Density */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    ความหนาแน่นของการจัดวาง (Display Density)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['comfortable', 'standard', 'compact'] as DisplayDensity[]).map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          updateSettings({ density: d });
                          addAuditLog(`ปรับ Density เป็น ${d}`, 'Appearance', `ความหนาแน่น: ${d}`);
                        }}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-medium cursor-pointer transition text-center ${
                          settings.density === d
                            ? 'border-[#5B2A86] bg-[#EDE4F7] dark:bg-[#8B6CCF]/20 text-[#5B2A86] dark:text-[#B3A0E8] font-bold'
                            : 'border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {d === 'comfortable' ? 'โปร่งสบาย' : d === 'standard' ? 'มาตรฐาน' : 'กะทัดรัด'}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400">โหมดกะทัดรัดช่วยให้ดูข้อมูลในตารางสิบเวรและภารกิจได้เยอะขึ้น</p>
                </div>

                {/* Font Scaling */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    ขนาดตัวอักษรของระบบ (Font Scale)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['small', 'normal', 'large'] as FontSizeScale[]).map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          updateSettings({ fontSize: s });
                          addAuditLog(`ปรับขนาดอักษรเป็น ${s}`, 'Appearance', `ขนาดตัวอักษร: ${s}`);
                        }}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-medium cursor-pointer transition text-center ${
                          settings.fontSize === s
                            ? 'border-[#5B2A86] bg-[#EDE4F7] dark:bg-[#8B6CCF]/20 text-[#5B2A86] dark:text-[#B3A0E8] font-bold'
                            : 'border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {s === 'small' ? 'เล็ก (90%)' : s === 'normal' ? 'ปกติ (100%)' : 'ใหญ่ (115%)'}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400">รองรับการเข้าถึง (Accessibility) สำหรับผู้ที่ต้องการตัวอักษรขนาดใหญ่</p>
                </div>
              </div>

              {/* Reduced Motion Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    ลดการเคลื่อนไหว (Reduced Motion)
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    ปิดหรือลดความเร็วของแอนิเมชันสำหรับผู้ที่ไวต่อแสงและการเคลื่อนไหว
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.reducedMotion}
                    onChange={e => {
                      updateSettings({ reducedMotion: e.target.checked });
                      addAuditLog(`Reduced Motion: ${e.target.checked ? 'เปิด' : 'ปิด'}`, 'Appearance', 'Accessibility');
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5B2A86] dark:peer-checked:bg-[#8B6CCF]"></div>
                </label>
              </div>
            </div>
          )}

          {/* SECTION: NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-white/70 dark:border-white/10 shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-black/5 dark:border-white/10 pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#2D2A32] dark:text-[#F5F7FA] flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#5B2A86] dark:text-[#B3A0E8]" />
                  <span>การแจ้งเตือนของระบบ (Notification Preferences)</span>
                </h2>
                <p className="text-xs text-[#5A5764] dark:text-[#A9AFBB] mt-1">
                  เลือกรับการแจ้งเตือนแยกตามหมวดหมู่และช่องทางที่ท่านต้องการรับทราบ
                </p>
              </div>

              {/* Notification Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-black/5 dark:border-white/10 text-slate-400 font-mono uppercase text-[10px]">
                      <th className="py-3 px-4 font-bold">หมวดหมู่ภารกิจ</th>
                      <th className="py-3 px-3 text-center font-bold">Push (บราวเซอร์)</th>
                      <th className="py-3 px-3 text-center font-bold">In-App (กระดิ่ง)</th>
                      <th className="py-3 px-3 text-center font-bold">อีเมลราชการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    {[
                      { key: 'missions', label: 'ภารกิจและการมอบหมายงาน', sub: 'คำสั่งภารกิจใหม่, การแก้ไขวันเวลา' },
                      { key: 'reports', label: 'การส่งรายงานประจำวัน กก.ตชด.', sub: 'ตรวจพบหน่วยส่งรายงานล่าช้า หรือยังไม่ส่ง' },
                      { key: 'deadline', label: 'แจ้งเตือนงานใกล้ครบกำหนด (Deadline Radar)', sub: 'ล่วงหน้า 24 ชม. และเมื่อเกินกำหนด' },
                      { key: 'documents', label: 'งานสารบรรณ & หนังสือเวียน', sub: 'เอกสารเข้าใหม่, ผลตรวจร่างหนังสือ AI' },
                      { key: 'kpi', label: 'ความคืบหน้า KPI & แผนยุทธศาสตร์', sub: 'สรุปรายสัปดาห์และรายไตรมาส' },
                      { key: 'news', label: 'ข่าวประชาสัมพันธ์ & กิจกรรมจิตอาสา', sub: 'การอนุมัติสื่อและประกาศเผยแพร่' },
                      { key: 'system', label: 'ความปลอดภัยและระบบเซิร์ฟเวอร์', sub: 'การพยายามเข้าสู่ระบบผิดพลาด, อัปเดตแพตช์' },
                    ].map(row => {
                      const cat = settings.notifications[row.key as keyof typeof settings.notifications];
                      return (
                        <tr key={row.key} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-800 dark:text-slate-200">{row.label}</div>
                            <div className="text-[11px] text-slate-400">{row.sub}</div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={cat.push}
                              onChange={e =>
                                updateNotificationCategory(
                                  row.key as keyof typeof settings.notifications,
                                  'push',
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 rounded text-[#5B2A86] focus:ring-[#5B2A86] border-slate-300 dark:border-slate-600 dark:bg-slate-800 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={cat.inApp}
                              onChange={e =>
                                updateNotificationCategory(
                                  row.key as keyof typeof settings.notifications,
                                  'inApp',
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 rounded text-[#5B2A86] focus:ring-[#5B2A86] border-slate-300 dark:border-slate-600 dark:bg-slate-800 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={cat.email}
                              onChange={e =>
                                updateNotificationCategory(
                                  row.key as keyof typeof settings.notifications,
                                  'email',
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 rounded text-[#5B2A86] focus:ring-[#5B2A86] border-slate-300 dark:border-slate-600 dark:bg-slate-800 cursor-pointer"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION: ACCOUNT PROFILE */}
          {activeSection === 'account' && (
            <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-white/70 dark:border-white/10 shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-black/5 dark:border-white/10 pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#2D2A32] dark:text-[#F5F7FA]">ข้อมูลบัญชีผู้ใช้งาน</h2>
                <p className="text-xs text-[#5A5764] dark:text-[#A9AFBB] mt-1">ข้อมูลประจำตัวราชการและการเปลี่ยนรหัสผ่าน</p>
              </div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div><dt className="text-xs text-slate-500">ยศ - ชื่อ</dt><dd className="font-semibold">{[currentUser.rank, currentUser.name].filter(Boolean).join(' ') || '—'}</dd></div>
                <div><dt className="text-xs text-slate-500">อีเมล</dt><dd className="font-semibold break-all">{currentUser.email || '—'}</dd></div>
                <div><dt className="text-xs text-slate-500">ตำแหน่ง</dt><dd>{currentUser.position || '—'}</dd></div>
                <div><dt className="text-xs text-slate-500">สังกัด</dt><dd>{currentUser.department || '—'}</dd></div>
                <div><dt className="text-xs text-slate-500">โทรศัพท์</dt><dd>{currentUser.phone || '—'}</dd></div>
              </dl>
              <p className="text-[11px] text-slate-500">ข้อมูลประจำตัวแก้ไขโดยผู้ดูแลระบบ (เมนู บทบาท & สิทธิ์เข้าถึง)</p>
              <ChangePasswordCard />
            </div>
          )}

          {/* SECTION: ROLES & PERMISSIONS */}
          {activeSection === 'roles' && (
            <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-white/70 dark:border-white/10 shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-black/5 dark:border-white/10 pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#2D2A32] dark:text-[#F5F7FA]">บทบาทและสิทธิ์การเข้าถึง</h2>
                <p className="text-xs text-[#5A5764] dark:text-[#A9AFBB] mt-1">เพิ่ม/ปิดบัญชีผู้ใช้ และกำหนดสิทธิ์ (เฉพาะผู้ดูแลระบบ)</p>
              </div>
              <StaffManager />
            </div>
          )}

          {/* SECTION: SECURITY */}
          {activeSection === 'security' && (
            <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-white/70 dark:border-white/10 shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-black/5 dark:border-white/10 pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#2D2A32] dark:text-[#F5F7FA]">ความปลอดภัยและการเข้าถึง</h2>
                <p className="text-xs text-[#5A5764] dark:text-[#A9AFBB] mt-1">การยืนยันตัวตนทำโดย Supabase Auth ข้อมูลทุกตารางจำกัดสิทธิ์ระดับแถว (RLS) เฉพาะบุคลากรที่ได้รับอนุญาต</p>
              </div>
              <ChangePasswordCard />
            </div>
          )}

          {/* SECTION: DATA & BACKUP */}
          {activeSection === 'data' && (
            <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-white/70 dark:border-white/10 shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-black/5 dark:border-white/10 pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#2D2A32] dark:text-[#F5F7FA]">การจัดการข้อมูลและการสำรอง</h2>
                <p className="text-xs text-[#5A5764] dark:text-[#A9AFBB] mt-1">สำรองข้อมูลทั้งระบบเป็นไฟล์</p>
              </div>
              <DataExportCard />
            </div>
          )}

          {/* SECTION: INTEGRATIONS */}
          {activeSection === 'integrations' && (
            <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-white/70 dark:border-white/10 shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-black/5 dark:border-white/10 pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#2D2A32] dark:text-[#F5F7FA]">การเชื่อมต่อระบบภายนอก</h2>
                <p className="text-xs text-[#5A5764] dark:text-[#A9AFBB] mt-1">สถานะจริงของบริการที่เว็บใช้งาน</p>
              </div>
              <IntegrationStatusCard />
            </div>
          )}

          {/* SECTION: AUDIT LOG */}
          {activeSection === 'audit' && (
            <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-white/70 dark:border-white/10 shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-black/5 dark:border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#2D2A32] dark:text-[#F5F7FA] flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#5B2A86] dark:text-[#B3A0E8]" />
                    <span>บันทึกประวัติการตั้งค่าระบบ (Settings Audit Log)</span>
                  </h2>
                  <p className="text-xs text-[#5A5764] dark:text-[#A9AFBB] mt-1">
                    บันทึกทุกกิจกรรมการเปลี่ยนแปลงค่าคอนฟิก ธีม สิทธิ์ และการกระทำสำคัญตามมาตรฐานความปลอดภัย
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  รวม {auditLogs.length} รายการ
                </span>
              </div>

              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {auditLogs.map(log => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-white/70 dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#5B2A86]/30 transition"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-[#5B2A86]/10 text-[#5B2A86] dark:text-[#B3A0E8] font-mono text-[10px] font-bold">
                          {log.category}
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{log.action}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{log.detail}</div>
                      <div className="text-[10px] text-slate-400">
                        ผู้ดำเนินการ: <span className="font-semibold text-slate-600 dark:text-slate-300">{log.actor}</span> ({log.actorRole})
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 shrink-0 text-right">
                      {log.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: ABOUT */}
          {activeSection === 'about' && (
            <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-white/70 dark:border-white/10 shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-black/5 dark:border-white/10 pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#2D2A32] dark:text-[#F5F7FA] flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#5B2A86] dark:text-[#B3A0E8]" />
                  <span>เกี่ยวกับระบบ ฝอ.5 (About System & Version)</span>
                </h2>
                <p className="text-xs text-[#5A5764] dark:text-[#A9AFBB] mt-1">
                  ข้อมูลลิขสิทธิ์ หน่วยงานรับผิดชอบ และข้อกำหนดการรักษาความมั่นคงปลอดภัยสารสนเทศ
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-2">
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    ระบบศูนย์กลางบริหารงาน ฝอ.5 บช.ตชด. (Digital Command Center)
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">
                    กองกำกับการอำนวยการ กองบัญชาการตำรวจตระเวนชายแดน (ฝอ.๕ บช.ตชด.)
                    พัฒนาขึ้นเพื่อบูรณาการ ๔ สายงานหลัก: ฝ่ายอำนวยการ, ฝ่ายมวลชนสัมพันธ์, ฝ่ายสาธารณภัย และฝ่ายจิตอาสา
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-1">
                    <div className="text-slate-400">สถาปัตยกรรม (Architecture):</div>
                    <div className="font-mono font-bold text-slate-800 dark:text-slate-200">Modern Government Grade (SPA + Cloud Backend)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-1">
                    <div className="text-slate-400">มาตรฐานความปลอดภัย (Compliance):</div>
                    <div className="font-mono font-bold text-slate-800 dark:text-slate-200">NIST Cybersecurity / PDPA Compliant</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
