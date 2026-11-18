import React, { useState, useEffect } from 'react';
import {
  Folder,
  FileText,
  Upload,
  RefreshCw,
  Trash2,
  ExternalLink,
  Search,
  MousePointerClick,
  AlertCircle,
  FileSpreadsheet,
  FileArchive,
  Image as ImageIcon,
} from 'lucide-react';
import {
  fetchDriveFiles,
  uploadDriveFile,
  deleteDriveFile,
  launchGooglePicker,
  DriveFileItem,
  PickedFile,
} from '../../services/googleWorkspaceService';
import { WorkspaceConfirmModal } from './WorkspaceConfirmModal';
import { useToast } from '../common/Toast';

interface DrivePickerViewProps {
  isConnected: boolean;
  onRequireAuth: () => void;
}

export const DrivePickerView: React.FC<DrivePickerViewProps> = ({ isConnected, onRequireAuth }) => {
  const { showToast } = useToast();
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [pickedFiles, setPickedFiles] = useState<PickedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Confirmation Modal state
  const [deleteTarget, setDeleteTarget] = useState<DriveFileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadFiles = async () => {
    if (!isConnected) return;
    setIsLoading(true);
    try {
      const data = await fetchDriveFiles(searchQuery);
      setFiles(data);
    } catch (err: any) {
      console.error('Error fetching drive files:', err);
      showToast(err.message || 'ไม่สามารถดึงข้อมูลจาก Google Drive', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      loadFiles();
    }
  }, [isConnected]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadFiles();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploaded = await uploadDriveFile(file, `อัปโหลดโดยระบบศูนย์กลางบริหารงานหน่วยงาน`);
      showToast(`อัปโหลดไฟล์ "${uploaded.name}" ขึ้น Google Drive สำเร็จ`, 'success');
      loadFiles();
    } catch (err: any) {
      console.error('Upload failed:', err);
      showToast(err.message || 'อัปโหลดไฟล์ไม่สำเร็จ', 'error');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleOpenPicker = async () => {
    if (!isConnected) {
      onRequireAuth();
      return;
    }

    try {
      await launchGooglePicker(
        (picked) => {
          setPickedFiles((prev) => [picked, ...prev.filter((p) => p.id !== picked.id)]);
          showToast(`เลือกไฟล์ "${picked.name}" ผ่าน Google Picker สำเร็จ`, 'success');
        },
        (errorMsg) => {
          showToast(errorMsg, 'error');
        }
      );
    } catch (err: any) {
      showToast(err.message || 'ไม่สามารถเปิด Google Picker ได้', 'error');
    }
  };

  const confirmDeleteFile = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteDriveFile(deleteTarget.id);
      showToast(`ลบไฟล์ "${deleteTarget.name}" ออกจาก Google Drive สำเร็จ`, 'success');
      setFiles((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      console.error('Delete failed:', err);
      showToast(err.message || 'ไม่สามารถลบไฟล์ได้', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('document') || mimeType.includes('text')) {
      return <FileText className="w-5 h-5 text-blue-600 shrink-0" />;
    }
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />;
    }
    if (mimeType.includes('image')) {
      return <ImageIcon className="w-5 h-5 text-purple-600 shrink-0" />;
    }
    if (mimeType.includes('folder')) {
      return <Folder className="w-5 h-5 text-amber-500 shrink-0" />;
    }
    return <FileArchive className="w-5 h-5 text-slate-500 shrink-0" />;
  };

  const formatFileSize = (bytes?: string) => {
    if (!bytes) return '–';
    const num = parseInt(bytes, 10);
    if (isNaN(num)) return '–';
    if (num < 1024) return `${num} B`;
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
    return `${(num / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Action Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Google Drive & Google Picker</h2>
              <p className="text-xs text-slate-500">
                จัดการไฟล์เอกสารราชการ, อัปโหลด, และเลือกไฟล์ผ่าน Google Picker widget อย่างปลอดภัย
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Google Picker Action Button */}
          <button
            type="button"
            onClick={handleOpenPicker}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100/80 text-sm font-medium flex items-center gap-2 transition-all shadow-xs"
          >
            <MousePointerClick className="w-4 h-4" />
            <span>เปิด Google Picker</span>
          </button>

          {/* Upload Button */}
          <label className={`px-3.5 py-2 rounded-xl bg-[#234A78] text-white hover:bg-[#1b3a5f] text-sm font-medium flex items-center gap-2 cursor-pointer transition-all shadow-xs ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'กำลังอัปโหลด...' : 'อัปโหลดไฟล์ขึ้น Drive'}</span>
            <input type="file" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
          </label>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={loadFiles}
            disabled={isLoading}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
            title="รีเฟรชรายการไฟล์"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Picked Files History (from Google Picker) */}
      {pickedFiles.length > 0 && (
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <MousePointerClick className="w-3.5 h-3.5" />
              ไฟล์ที่เลือกผ่าน Google Picker ({pickedFiles.length})
            </h3>
            <button
              type="button"
              onClick={() => setPickedFiles([])}
              className="text-[11px] text-emerald-700 hover:underline"
            >
              ล้างรายการ
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {pickedFiles.map((p) => (
              <div
                key={p.id}
                className="bg-white p-3 rounded-xl border border-emerald-200 flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-medium text-slate-900 truncate">{p.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{p.mimeType}</p>
                  </div>
                </div>
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:text-emerald-900 shrink-0 p-1"
                    title="เปิดไฟล์"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อไฟล์ใน Google Drive..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#234A78]/20 focus:border-[#234A78]"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl border border-slate-200 transition-colors"
        >
          ค้นหา
        </button>
      </form>

      {/* Files List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">
            ไฟล์ใน Google Drive ({files.length} รายการ)
          </h3>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#234A78]" />
            <p className="text-sm">กำลังเชื่อมต่อและโหลดข้อมูลไฟล์จาก Google Drive...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">ไม่พบไฟล์ใน Google Drive</p>
            <p className="text-xs text-slate-400 mt-1">
              กด &quot;อัปโหลดไฟล์ขึ้น Drive&quot; หรือ &quot;เปิด Google Picker&quot; เพื่อเริ่มต้นใช้งาน
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3">ชื่อเอกสาร / ไฟล์</th>
                  <th className="px-4 py-3">ประเภท</th>
                  <th className="px-4 py-3">ขนาด</th>
                  <th className="px-4 py-3">แก้ไขล่าสุด</th>
                  <th className="px-4 py-3 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.mimeType)}
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 truncate max-w-xs md:max-w-md">
                            {file.name}
                          </p>
                          {file.owners && file.owners.length > 0 && (
                            <p className="text-[10px] text-slate-400">
                              เจ้าของ: {file.owners[0].displayName || file.owners[0].emailAddress}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 truncate max-w-[120px]">
                      {file.mimeType.replace('application/', '').replace('vnd.google-apps.', '')}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">{formatFileSize(file.size)}</td>
                    <td className="px-4 py-3.5 text-slate-500">
                      {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString('th-TH') : '–'}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="เปิดดูใน Google Drive"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(file)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          title="ลบไฟล์ออกจาก Drive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mandatory User Confirmation Dialog for Deletion */}
      <WorkspaceConfirmModal
        isOpen={!!deleteTarget}
        title="ยืนยันการลบไฟล์จาก Google Drive"
        description={`คุณแน่ใจหรือไม่ว่าต้องการลบไฟล์นี้ออกจาก Google Drive ของคุณอย่างถาวร? การกระทำนี้ไม่สามารถยกเลิกได้`}
        itemName={deleteTarget?.name}
        actionType="delete"
        confirmLabel="ยืนยันการลบไฟล์"
        isProcessing={isDeleting}
        onConfirm={confirmDeleteFile}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
