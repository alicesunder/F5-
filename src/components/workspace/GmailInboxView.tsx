import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  RefreshCw,
  Search,
  Plus,
  AlertCircle,
  Inbox,
  User,
  Calendar,
} from 'lucide-react';
import {
  fetchGmailMessages,
  fetchGmailMessageDetail,
  sendGmailEmail,
  GmailMessageItem,
} from '../../services/googleWorkspaceService';
import { WorkspaceConfirmModal } from './WorkspaceConfirmModal';
import { useToast } from '../common/Toast';

interface GmailInboxViewProps {
  isConnected: boolean;
  onRequireAuth: () => void;
}

export const GmailInboxView: React.FC<GmailInboxViewProps> = ({ isConnected }) => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<GmailMessageItem[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<GmailMessageItem | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Compose email modal
  const [showCompose, setShowCompose] = useState(false);
  const [toEmail, setToEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  // Confirm sending email modal
  const [showConfirmSend, setShowConfirmSend] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const loadMessages = async () => {
    if (!isConnected) return;
    setIsLoadingList(true);
    try {
      const data = await fetchGmailMessages(15, searchQuery);
      setMessages(data);
      if (data.length > 0 && !selectedMessage) {
        handleSelectMessage(data[0].id);
      }
    } catch (err: any) {
      console.error('Error fetching gmail:', err);
      showToast(err.message || 'ไม่สามารถดึงข้อมูล Gmail ได้', 'error');
    } finally {
      setIsLoadingList(false);
    }
  };

  const handleSelectMessage = async (messageId: string) => {
    setIsLoadingDetail(true);
    try {
      const detail = await fetchGmailMessageDetail(messageId);
      setSelectedMessage(detail);
    } catch (err: any) {
      console.error('Error fetching email detail:', err);
      showToast(err.message || 'ไม่สามารถเปิดอ่านอีเมลได้', 'error');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      loadMessages();
    }
  }, [isConnected]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadMessages();
  };

  const handleSendEmailConfirm = async () => {
    if (!toEmail.trim() || !subject.trim()) return;
    setIsSending(true);
    try {
      await sendGmailEmail({
        to: toEmail.trim(),
        subject: subject.trim(),
        body: body.trim(),
      });
      showToast(`ส่งอีเมลไปยัง ${toEmail} สำเร็จเรียบร้อย`, 'success');
      setShowConfirmSend(false);
      setShowCompose(false);
      setToEmail('');
      setSubject('');
      setBody('');
      loadMessages();
    } catch (err: any) {
      console.error('Send email failed:', err);
      showToast(err.message || 'ส่งอีเมลไม่สำเร็จ', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Gmail Integration</h2>
            <p className="text-xs text-slate-500">
              รับส่งอีเมลทางราชการ ตรวจสอบกล่องจดหมาย และส่งหนังสือแจ้งเตือนผ่าน Gmail API
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowCompose(true)}
            className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 text-sm font-medium flex items-center gap-2 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>เขียนอีเมลใหม่</span>
          </button>
          <button
            type="button"
            onClick={loadMessages}
            disabled={isLoadingList}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
            title="รีเฟรชกล่องจดหมาย"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingList ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาอีเมลใน Gmail (เช่น จากผู้ส่ง, หัวข้อ, คำสำคัญ)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl border border-slate-200 transition-colors"
        >
          ค้นหา
        </button>
      </form>

      {/* Main Mail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden h-[620px]">
        {/* Left Column: Email List */}
        <div className="lg:col-span-5 border-r border-slate-100 flex flex-col h-full bg-slate-50/40">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Inbox className="w-4 h-4" />
              กล่องข้อความ ({messages.length})
            </h3>
          </div>

          <div className="overflow-y-auto flex-1 p-2 space-y-1.5">
            {isLoadingList ? (
              <div className="p-12 text-center text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-red-600" />
                <p className="text-xs">กำลังโหลดข้อความอีเมล...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-medium text-slate-600">ไม่พบอีเมลในกล่องจดหมาย</p>
              </div>
            ) : (
              messages.map((msg) => (
                <button
                  key={msg.id}
                  type="button"
                  onClick={() => handleSelectMessage(msg.id)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all border ${
                    selectedMessage?.id === msg.id
                      ? 'bg-white shadow-xs border-red-200 text-slate-900'
                      : 'border-transparent hover:bg-slate-100/70 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-900 truncate">
                      {msg.from?.replace(/<.*>/, '').trim() || 'นิรนาม'}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {msg.date ? new Date(msg.date).toLocaleDateString('th-TH') : ''}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-800 truncate mb-1">{msg.subject}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {msg.snippet}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Email Content View */}
        <div className="lg:col-span-7 flex flex-col h-full bg-white overflow-hidden">
          {isLoadingDetail ? (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
              <div>
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-red-600" />
                <p className="text-sm">กำลังโหลดเนื้อหาอีเมลฉบับนี้...</p>
              </div>
            </div>
          ) : selectedMessage ? (
            <div className="flex flex-col h-full">
              {/* Email Header */}
              <div className="p-5 border-b border-slate-100">
                <h3 className="text-base font-semibold text-slate-900 mb-3">
                  {selectedMessage.subject}
                </h3>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>จาก: </span>
                    <span className="font-medium text-slate-800">{selectedMessage.from}</span>
                  </div>
                  {selectedMessage.to && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>ถึง: </span>
                      <span className="text-slate-700">{selectedMessage.to}</span>
                    </div>
                  )}
                  {selectedMessage.date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>วันที่: </span>
                      <span className="text-slate-700">{selectedMessage.date}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Email Body */}
              <div className="p-6 overflow-y-auto flex-1 text-xs leading-relaxed text-slate-700 whitespace-pre-wrap font-sans">
                {selectedMessage.bodyText || selectedMessage.snippet || 'ไม่มีเนื้อหาในอีเมลฉบับนี้'}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
              <div>
                <Mail className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">เลือกอีเมลจากกล่องข้อความเพื่อเปิดอ่าน</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose Email Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-slate-900">เขียนอีเมลใหม่ (Gmail)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCompose(false)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1"
              >
                ปิด
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ถึง (Email ผู้รับ) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  หัวข้อเรื่อง <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="เช่น รายงานสถานการณ์ประจำวัน"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ข้อความในอีเมล
                </label>
                <textarea
                  rows={6}
                  placeholder="ระบุข้อความ..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCompose(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => {
                  if (toEmail.trim() && subject.trim()) {
                    setShowConfirmSend(true);
                  } else {
                    showToast('กรุณากรอกอีเมลผู้รับและหัวข้อเรื่อง', 'warning');
                  }
                }}
                disabled={!toEmail.trim() || !subject.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>ส่งอีเมล</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory User Confirmation Dialog before sending Email */}
      <WorkspaceConfirmModal
        isOpen={showConfirmSend}
        title="ยืนยันการส่งอีเมลผ่าน Gmail"
        description={`คุณแน่ใจหรือไม่ว่าต้องการส่งอีเมลนี้ไปยัง "${toEmail}" ในหัวข้อ "${subject}"?`}
        itemName={`ผู้รับ: ${toEmail}\nหัวข้อ: ${subject}\n\n${body.substring(0, 100)}${body.length > 100 ? '...' : ''}`}
        actionType="send"
        confirmLabel="ยืนยันและส่งอีเมล"
        isProcessing={isSending}
        onConfirm={handleSendEmailConfirm}
        onCancel={() => setShowConfirmSend(false)}
      />
    </div>
  );
};
