import React from 'react';
import { ShoppingBag, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { logout } = useAuth();
  
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 p-4 sticky top-0 z-30 shadow-sm flex justify-between items-center transition-all">
      <div className="flex items-center gap-2">
        <div className="bg-emerald-600 mt-1 w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
          <ShoppingBag size={18} />
        </div>
        <div>
          <h1 className="font-black tracking-tight text-gray-900 text-lg leading-none">MERCADO</h1>
          <p className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase">Los Quindos</p>
        </div>
      </div>
      <button onClick={logout} className="p-2 bg-gray-50 rounded-full hover:bg-red-50 hover:text-red-500 transition text-gray-400">
        <LogOut size={18} />
      </button>
    </header>
  );
}
