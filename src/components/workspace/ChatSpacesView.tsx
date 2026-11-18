import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  RefreshCw,
  Plus,
  Users,
  AlertCircle,
  Hash,
} from 'lucide-react';
import {
  fetchChatSpaces,
  fetchChatMessages,
  sendChatMessage,
  createChatSpace,
  ChatSpaceItem,
  ChatMessageItem,
} from '../../services/googleWorkspaceService';
import { WorkspaceConfirmModal } from './WorkspaceConfirmModal';
import { useToast } from '../common/Toast';

interface ChatSpacesViewProps {
  isConnected: boolean;
  onRequireAuth: () => void;
}

export const ChatSpacesView: React.FC<ChatSpacesViewProps> = ({ isConnected }) => {
  const { showToast } = useToast();
  const [spaces, setSpaces] = useState<ChatSpaceItem[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<ChatSpaceItem | null>(null);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Send message
  const [inputMessage, setInputMessage] = useState('');
  const [showConfirmSend, setShowConfirmSend] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // New Space
  const [showCreateSpace, setShowCreateSpace] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [isCreatingSpace, setIsCreatingSpace] = useState(false);

  const loadSpaces = async () => {
    if (!isConnected) return;
    setIsLoadingSpaces(true);
    try {
      const data = await fetchChatSpaces();
      setSpaces(data);
      if (data.length > 0 && !selectedSpace) {
        setSelectedSpace(data[0]);
      }
    } catch (err: any) {
      console.error('Error fetching chat spaces:', err);
      showToast(err.message || 'ไม่สามารถโหลดห้องสนทนา Google Chat', 'error');
    } finally {
      setIsLoadingSpaces(false);
    }
  };

  const loadMessages = async (space: ChatSpaceItem) => {
    setIsLoadingMessages(true);
    try {
      const data = await fetchChatMessages(space.name);
      // Reverse to chronological order if needed
      setMessages(data.reverse());
    } catch (err: any) {
      console.error('Error fetching chat messages:', err);
      showToast(err.message || 'ไม่สามารถดึงข้อความสนทนาได้', 'error');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      loadSpaces();
    }
  }, [isConnected]);

  useEffect(() => {
    if (selectedSpace) {
      loadMessages(selectedSpace);
    }
  }, [selectedSpace]);

  const handleSendMessageConfirm = async () => {
    if (!selectedSpace || !inputMessage.trim()) return;
    setIsSending(true);
    try {
      await sendChatMessage(selectedSpace.name, inputMessage.trim());
      showToast('ส่งข้อความสนทนาสำเร็จ', 'success');
      setInputMessage('');
      setShowConfirmSend(false);
      loadMessages(selectedSpace);
    } catch (err: any) {
      console.error('Send message failed:', err);
      showToast(err.message || 'ไม่สามารถส่งข้อความได้', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateSpaceConfirm = async () => {
    if (!newSpaceName.trim()) return;
    setIsCreatingSpace(true);
    try {
      const created = await createChatSpace(newSpaceName.trim());
      showToast(`สร้างห้องสนทนา "${created.displayName || newSpaceName}" สำเร็จ`, 'success');
      setShowCreateSpace(false);
      setNewSpaceName('');
      loadSpaces();
    } catch (err: any) {
      console.error('Create space failed:', err);
      showToast(err.message || 'ไม่สามารถสร้างห้องสนทนาได้', 'error');
    } finally {
      setIsCreatingSpace(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Google Chat Integration</h2>
            <p className="text-xs text-slate-500">
              ติดต่อสื่อสาร ประสานงานทีมปฏิบัติการ และส่งข้อความเข้าห้องสนทนา Google Chat
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowCreateSpace(true)}
            className="px-3.5 py-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700 text-sm font-medium flex items-center gap-2 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>สร้าง Space ใหม่</span>
          </button>
          <button
            type="button"
            onClick={loadSpaces}
            disabled={isLoadingSpaces}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
            title="รีเฟรชรายการห้อง"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingSpaces ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden h-[600px]">
        {/* Left: Spaces List */}
        <div className="lg:col-span-4 border-r border-slate-100 flex flex-col h-full bg-slate-50/40">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              ห้องสนทนา / Spaces ({spaces.length})
            </h3>
          </div>

          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {isLoadingSpaces ? (
              <div className="p-8 text-center text-slate-400">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-teal-600" />
                <p className="text-xs">กำลังโหลดห้องสนทนา...</p>
              </div>
            ) : spaces.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                <p className="text-xs">ไม่พบห้องสนทนาในบัญชีนี้</p>
              </div>
            ) : (
              spaces.map((sp) => (
                <button
                  key={sp.name}
                  type="button"
                  onClick={() => setSelectedSpace(sp)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${
                    selectedSpace?.name === sp.name
                      ? 'bg-white shadow-xs border border-teal-200/80 text-teal-900'
                      : 'hover:bg-slate-100/80 text-slate-700'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      selectedSpace?.name === sp.name
                        ? 'bg-teal-100 text-teal-700'
                        : 'bg-slate-200/70 text-slate-500'
                    }`}
                  >
                    <Hash className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate">
                      {sp.displayName || sp.name.replace('spaces/', 'Space ')}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{sp.type || 'SPACE'}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Message Thread & Composer */}
        <div className="lg:col-span-8 flex flex-col h-full bg-white">
          {selectedSpace ? (
            <>
              {/* Space Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedSpace.displayName || selectedSpace.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">{selectedSpace.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => loadMessages(selectedSpace)}
                  disabled={isLoadingMessages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                  title="รีเฟรชข้อความ"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/20">
                {isLoadingMessages ? (
                  <div className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-teal-600" />
                    <p className="text-xs">กำลังโหลดข้อความในห้องนี้...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-xs font-medium text-slate-600">ยังไม่มีข้อความในห้องนี้</p>
                    <p className="text-[11px] text-slate-400 mt-1">พิมพ์ข้อความด้านล่างเพื่อเริ่มการประสานงาน</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div key={msg.name || idx} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-semibold shrink-0">
                        {msg.sender?.displayName ? msg.sender.displayName[0] : 'U'}
                      </div>
                      <div className="flex-1 bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-slate-800">
                            {msg.sender?.displayName || 'ผู้ใช้งาน Google Chat'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {msg.createTime ? new Date(msg.createTime).toLocaleTimeString('th-TH') : ''}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-slate-100">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (inputMessage.trim()) setShowConfirmSend(true);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    placeholder={`ส่งข้อความเข้าห้อง ${selectedSpace.displayName || 'Google Chat'}...`}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>ส่ง</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
              <div>
                <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">เลือกห้องสนทนาทางด้านซ้ายเพื่อดูข้อความ</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Sending Chat Message */}
      <WorkspaceConfirmModal
        isOpen={showConfirmSend}
        title="ยืนยันการส่งข้อความ Google Chat"
        description={`คุณกำลังจะส่งข้อความไปยังห้อง "${selectedSpace?.displayName || selectedSpace?.name}" บน Google Chat:`}
        itemName={inputMessage}
        actionType="send"
        confirmLabel="ยืนยันและส่งข้อความ"
        isProcessing={isSending}
        onConfirm={handleSendMessageConfirm}
        onCancel={() => setShowConfirmSend(false)}
      />

      {/* Modal for Creating New Space */}
      {showCreateSpace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in">
            <div className="p-6">
              <h3 className="text-base font-semibold text-slate-900">สร้างห้อง Google Chat ใหม่</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                สร้างห้องสนทนาส่วนกลางสำหรับปฏิบัติการหรือทีมเฉพาะกิจ
              </p>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  ชื่อห้องสนทนา (Space Display Name)
                </label>
                <input
                  type="text"
                  placeholder="เช่น ทีมประสานงานภัยพิบัติภาคกลาง"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateSpace(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleCreateSpaceConfirm}
                disabled={isCreatingSpace || !newSpaceName.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {isCreatingSpace && (
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                <span>สร้างห้อง</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
