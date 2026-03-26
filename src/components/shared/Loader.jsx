import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader({ text = 'Cargando Mercado Quindos...' }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center">
      <Loader2 size={40} className="text-emerald-600 animate-spin mb-4" />
      <p className="font-bold text-gray-500 animate-pulse">{text}</p>
    </div>
  );
}
