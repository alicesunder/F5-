import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  RefreshCw,
  ExternalLink,
  BookOpen,
  Calendar,
  Eye,
} from 'lucide-react';
import {
  fetchGoogleDocs,
  createGoogleDocument,
  getGoogleDocumentDetails,
  DriveFileItem,
} from '../../services/googleWorkspaceService';
import { WorkspaceConfirmModal } from './WorkspaceConfirmModal';
import { useToast } from '../common/Toast';

interface DocsManagerViewProps {
  isConnected: boolean;
  onRequireAuth: () => void;
}

export const DocsManagerView: React.FC<DocsManagerViewProps> = ({ isConnected }) => {
  const { showToast } = useToast();
  const [docs, setDocs] = useState<DriveFileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // New Doc Form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // View Doc Detail Modal
  const [viewingDocId, setViewingDocId] = useState<string | null>(null);
  const [viewingDocData, setViewingDocData] = useState<any | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const loadDocs = async () => {
    if (!isConnected) return;
    setIsLoading(true);
    try {
      const data = await fetchGoogleDocs();
      setDocs(data);
    } catch (err: any) {
      console.error('Error fetching docs:', err);
      showToast(err.message || 'ไม่สามารถดึงข้อมูล Google Docs', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      loadDocs();
    }
  }, [isConnected]);

  const handleCreateDocConfirm = async () => {
    if (!newTitle.trim()) {
      showToast('กรุณาระบุชื่อเอกสาร', 'warning');
      return;
    }
    setIsCreating(true);
    try {
      const res = await createGoogleDocument(newTitle.trim(), newContent.trim());
      showToast(`สร้างเอกสาร "${res.title}" บน Google Docs สำเร็จ`, 'success');
      setShowCreateModal(false);
      setNewTitle('');
      setNewContent('');
      loadDocs();
    } catch (err: any) {
      console.error('Create doc failed:', err);
      showToast(err.message || 'ไม่สามารถสร้างเอกสารได้', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleInspectDoc = async (docId: string) => {
    setViewingDocId(docId);
    setIsLoadingDetail(true);
    try {
      const data = await getGoogleDocumentDetails(docId);
      setViewingDocData(data);
    } catch (err: any) {
      showToast(err.message || 'ไม่สามารถเปิดอ่านเนื้อหาเอกสารได้', 'error');
      setViewingDocId(null);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Google Docs Workspace</h2>
            <p className="text-xs text-slate-500">
              สร้างและตรวจดูเอกสารราชการ, รายงานสรุปสถานการณ์, และบันทึกข้อความผ่าน Google Docs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-[#234A78] text-white hover:bg-[#1b3a5f] text-sm font-medium flex items-center gap-2 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>สร้าง Google Doc ใหม่</span>
          </button>
          <button
            type="button"
            onClick={loadDocs}
            disabled={isLoading}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
            title="รีเฟรชรายการ"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Docs Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-800">
            เอกสาร Google Docs ในบัญชีของคุณ ({docs.length} ฉบับ)
          </h3>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#234A78]" />
            <p className="text-sm">กำลังโหลดรายการ Google Docs...</p>
          </div>
        ) : docs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">ยังไม่มีเอกสาร Google Docs</p>
            <p className="text-xs text-slate-400 mt-1">
              คลิกปุ่ม &quot;สร้าง Google Doc ใหม่&quot; ด้านบนเพื่อเริ่มต้นสร้างรายงาน
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs bg-slate-50/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    {doc.webViewLink && (
                      <a
                        href={doc.webViewLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-blue-600 p-1"
                        title="เปิดใน Google Docs"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 line-clamp-2">{doc.name}</h4>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {doc.modifiedTime
                        ? new Date(doc.modifiedTime).toLocaleDateString('th-TH')
                        : '–'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleInspectDoc(doc.id)}
                    className="text-xs text-[#234A78] hover:underline flex items-center gap-1 font-medium"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>อ่านเนื้อหาในแอป</span>
                  </button>
                  {doc.webViewLink && (
                    <a
                      href={doc.webViewLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <span>แก้ไขบน Docs</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Document Modal */}
      {viewingDocId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-slate-900 truncate">
                  {viewingDocData?.title || 'กำลังโหลดเอกสาร...'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setViewingDocId(null);
                  setViewingDocData(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-sm p-1"
              >
                ปิด
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 text-sm leading-relaxed text-slate-700 font-serif">
              {isLoadingDetail ? (
                <div className="py-12 text-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#234A78]" />
                  <p>กำลังอ่านข้อมูลจาก Google Docs API...</p>
                </div>
              ) : Array.isArray(viewingDocData?.body?.content) ? (
                <div className="space-y-3">
                  {viewingDocData.body.content.map((elem: any, idx: number) => {
                    const textRuns = elem?.paragraph?.elements;
                    if (!Array.isArray(textRuns)) return null;
                    const combined = textRuns.map((r: any) => r?.textRun?.content || '').join('');
                    if (!combined.trim()) return <br key={idx} />;
                    return (
                      <p key={idx} className="whitespace-pre-wrap">
                        {combined}
                      </p>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-400 italic">ไม่พบข้อความในเอกสาร</p>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setViewingDocId(null);
                  setViewingDocData(null);
                }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium rounded-xl"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Document Modal with Confirmation */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">สร้างเอกสาร Google Doc ใหม่</h3>
                  <p className="text-xs text-slate-500">
                    ระบบจะสร้างไฟล์เอกสารใหม่บนบัญชี Google Workspace ของคุณโดยตรง
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    ชื่อเอกสาร <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น รายงานผลการปฏิบัติการประจำสัปดาห์"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#234A78]/20 focus:border-[#234A78]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    เนื้อหาเริ่มต้น (ข้อความบทนำหรือหัวข้อ)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="ระบุข้อความเริ่มต้นในเอกสาร..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#234A78]/20 focus:border-[#234A78]"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleCreateDocConfirm}
                disabled={isCreating || !newTitle.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-[#234A78] hover:bg-[#1b3a5f] rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {isCreating && (
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                <span>ยืนยันสร้างเอกสาร</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
