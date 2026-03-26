import React from 'react';
import { ShoppingBag, PlusCircle, MessageCircle, User, Shield, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function BottomNav({ currentView, setCurrentView }) {
  const { currentUser } = useAuth();
  
  return (
    <nav className="fixed bottom-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-100 p-2 z-40 pb-safe">
      <div className="max-w-md mx-auto flex justify-between items-center px-4">
        <button onClick={() => setCurrentView('home')} className={`flex flex-col items-center gap-1 p-2 transition-all ${currentView === 'home' ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}>
          <ShoppingBag size={24} className={currentView === 'home' ? 'fill-emerald-50' : ''} />
          <span className="text-[10px] font-bold">Explorar</span>
        </button>
        
        {(currentUser?.role === 'admin' || currentUser?.role === 'supremo') && (
          <button onClick={() => setCurrentView('admin')} className={`flex flex-col items-center gap-1 p-2 transition-all ${currentView === 'admin' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
            <Shield size={24} className={currentView === 'admin' ? 'fill-blue-50' : ''} />
            <span className="text-[10px] font-bold">Aprobar</span>
          </button>
        )}

        <button onClick={() => setCurrentView('publish')} className="-mt-8 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg shadow-emerald-200 transition active:scale-95 border-4 border-[#f4f7f6]">
          <PlusCircle size={24} />
        </button>

        <button className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-gray-600">
          <div className="relative">
            <MessageCircle size={24} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">2</span>
          </div>
          <span className="text-[10px] font-bold">Chats</span>
        </button>

        {currentUser?.role === 'supremo' ? (
          <button onClick={() => setCurrentView('supremo')} className={`flex flex-col items-center gap-1 p-2 transition-all ${currentView === 'supremo' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}>
            <ShieldAlert size={24} className={currentView === 'supremo' ? 'fill-purple-50' : ''} />
            <span className="text-[10px] font-bold">Supremo</span>
          </button>
        ) : (
          <button className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-gray-600">
            <User size={24} />
            <span className="text-[10px] font-bold">Perfil</span>
          </button>
        )}
      </div>
    </nav>
  );
}
