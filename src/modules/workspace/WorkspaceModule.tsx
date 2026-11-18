import React, { useState } from 'react';
import {
  Folder,
  FileText,
  MessageSquare,
  Mail,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useGoogleWorkspace } from '../../contexts/GoogleWorkspaceContext';
import { GoogleSignInButton } from '../../components/workspace/GoogleSignInButton';
import { DrivePickerView } from '../../components/workspace/DrivePickerView';
import { DocsManagerView } from '../../components/workspace/DocsManagerView';
import { ChatSpacesView } from '../../components/workspace/ChatSpacesView';
import { GmailInboxView } from '../../components/workspace/GmailInboxView';

export type WorkspaceTab = 'drive' | 'docs' | 'chat' | 'gmail';

export const WorkspaceModule: React.FC = () => {
  const { isConnected, googleUser, isLoading, connectGoogle, disconnectGoogle } = useGoogleWorkspace();
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('drive');

  const tabs: Array<{ id: WorkspaceTab; label: string; icon: React.ReactNode; count?: string }> = [
    {
      id: 'drive',
      label: 'Google Drive & Picker',
      icon: <Folder className="w-4 h-4 text-blue-600" />,
    },
    {
      id: 'docs',
      label: 'Google Docs',
      icon: <FileText className="w-4 h-4 text-indigo-600" />,
    },
    {
      id: 'chat',
      label: 'Google Chat',
      icon: <MessageSquare className="w-4 h-4 text-teal-600" />,
    },
    {
      id: 'gmail',
      label: 'Gmail Inbox',
      icon: <Mail className="w-4 h-4 text-red-600" />,
    },
  ];

  return (
    <div className="min-h-screen iridescent-ambient p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Studio Hero Banner / Google Workspace Status */}
      <div
        className="rounded-3xl p-6 sm:p-8 text-white border border-white/15 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 45%, #2563EB 80%, #0EA5E9 100%)',
        }}
      >
        {/* 4-Color Spectrum Top Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-13 h-13 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shrink-0 shadow-lg">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Google Workspace Integrated Cloud Studio
              </h1>
              {isConnected ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  เชื่อมต่อสำเร็จ
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-amber-400/20 text-amber-200 border border-amber-300/30">
                  ยังไม่ได้เชื่อมต่อ
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-sky-100/85 mt-1">
              เชื่อมโยงการทำงานระหว่างระบบศูนย์กลาง ฝอ.5 กับ Google Drive, Docs, Chat, Gmail และ Google Picker
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          {isConnected && googleUser ? (
            <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl px-3.5 py-2">
              {googleUser.photoURL ? (
                <img
                  src={googleUser.photoURL}
                  alt={googleUser.displayName || 'Google User'}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full border border-white/40 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white text-[#1E3A8A] flex items-center justify-center text-xs font-black">
                  {googleUser.email?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <div className="text-left min-w-0 pr-1">
                <p className="text-xs font-bold text-white truncate max-w-[160px]">
                  {googleUser.displayName || 'Google Account'}
                </p>
                <p className="text-[10px] text-sky-200 truncate max-w-[160px]">
                  {googleUser.email}
                </p>
              </div>
              <button
                type="button"
                onClick={disconnectGoogle}
                className="text-sky-200 hover:text-rose-300 p-1 rounded-lg transition-colors cursor-pointer"
                title="ออกจากระบบ Google"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <GoogleSignInButton
              onClick={connectGoogle}
              isLoading={isLoading}
              text="เชื่อมต่อ Google Workspace"
            />
          )}
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex gap-2 liquid-glass-card iridescent-edge rounded-2xl p-1.5 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold transition-all rounded-xl cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="transition-all">
        {!isConnected ? (
          <div className="liquid-glass-card iridescent-edge rounded-3xl p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/15 border border-blue-300/40 text-[#2563EB] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  เข้าสู่ระบบเพื่อใช้งาน Google Workspace
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  กรุณาลงชื่อเข้าใช้ด้วยบัญชี Google Workspace ของคุณเพื่อเปิดใช้งานฟีเจอร์การเชื่อมต่อ Google Drive, Google Docs, Google Chat, Gmail และ Google Picker อย่างสมบูรณ์
                </p>
              </div>

              <div className="pt-2 flex justify-center">
                <GoogleSignInButton
                  onClick={connectGoogle}
                  isLoading={isLoading}
                  text="เข้าสู่ระบบด้วย Google Workspace"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-left text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Google Drive & Picker</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>Google Docs เอกสาร</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  <span>Google Chat ประสานงาน</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>Gmail รับส่งหนังสือราชการ</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-transparent">
            {activeTab === 'drive' && (
              <DrivePickerView isConnected={isConnected} onRequireAuth={connectGoogle} />
            )}
            {activeTab === 'docs' && (
              <DocsManagerView isConnected={isConnected} onRequireAuth={connectGoogle} />
            )}
            {activeTab === 'chat' && (
              <ChatSpacesView isConnected={isConnected} onRequireAuth={connectGoogle} />
            )}
            {activeTab === 'gmail' && (
              <GmailInboxView isConnected={isConnected} onRequireAuth={connectGoogle} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
