import React, { useEffect } from 'react';
import { CheckCircle, ShieldAlert } from 'lucide-react';

export default function Toast({ toast, setToast }) {
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  if (!toast.show) return null;

  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-2xl text-white font-bold animate-in fade-in slide-in-from-top-4 flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-600'}`}>
      {toast.type === 'error' ? <ShieldAlert size={18} /> : <CheckCircle size={18} />}
      {toast.msg}
    </div>
  );
}
