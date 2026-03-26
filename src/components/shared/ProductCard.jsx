import React from 'react';
import { User, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function ProductCard({ item }) {
  const { currentUser } = useAuth();
  
  return (
    <div className="bg-white rounded-[1.5rem] shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 overflow-hidden group flex flex-row sm:flex-col cursor-pointer">
      <div className="w-32 sm:w-full h-32 sm:h-48 bg-gray-100 shrink-0 relative overflow-hidden">
        <img src={item.imgUrl} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={item.title} />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] px-2 py-1 rounded-full font-bold shadow-sm">
          {item.cat}
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-gray-800 leading-tight mb-2 line-clamp-2">{item.title}</h3>
          <p className="text-xl font-black text-emerald-600 mb-1">${parseFloat(item.price).toLocaleString()}</p>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg">
            <User size={12} className="text-gray-400" />
            <span className="text-[10px] text-gray-600 font-semibold truncate max-w-[80px]">{item.sellerName}</span>
          </div>
          {currentUser?.uid !== item.sellerId && (
            <button className="bg-emerald-50 text-emerald-600 p-2 rounded-xl hover:bg-emerald-600 hover:text-white transition shadow-sm">
              <MessageCircle size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
