import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const useToast = () => {
  const { showToast } = useAdmin();
  return { showToast };
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAdmin();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-lg shadow-lg border text-sm font-medium transition-all duration-200 transform translate-y-0 ${
            toast.type === 'success'
              ? 'bg-emerald-900/95 text-emerald-100 border-emerald-700/80 shadow-emerald-950/20'
              : toast.type === 'error'
              ? 'bg-rose-900/95 text-rose-100 border-rose-700/80 shadow-rose-950/20'
              : 'bg-slate-900/95 text-slate-100 border-slate-700/80 shadow-slate-950/20'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded hover:bg-white/10 text-white/70 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
