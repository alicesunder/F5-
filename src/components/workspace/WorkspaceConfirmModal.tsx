import React from 'react';
import { AlertTriangle, ShieldCheck, X } from 'lucide-react';

interface WorkspaceConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  actionType: 'delete' | 'send' | 'create' | 'modify';
  itemName?: string;
  confirmLabel?: string;
  isProcessing?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const WorkspaceConfirmModal: React.FC<WorkspaceConfirmModalProps> = ({
  isOpen,
  title,
  description,
  actionType,
  itemName,
  confirmLabel,
  isProcessing = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const isDanger = actionType === 'delete';
  const label = confirmLabel || (isDanger ? 'ยืนยันการลบข้อมูล' : 'ยืนยันการดำเนินการ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                isDanger
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-blue-100 text-[#234A78]'
              }`}
            >
              {isDanger ? <AlertTriangle className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{description}</p>

              {itemName && (
                <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs font-mono text-slate-700 break-all">
                  {itemName}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors disabled:opacity-50"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-all shadow-sm flex items-center gap-2 ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-[#234A78] hover:bg-[#1b3a5f]'
            } disabled:opacity-50`}
          >
            {isProcessing && (
              <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {label}
          </button>
        </div>
      </div>
    </div>
  );
};
