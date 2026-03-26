import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';

export default function AdminPanel({ showToast }) {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "products"), where("status", "==", "pending"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPending(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsubscribe;
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "products", id), { status });
      showToast(status === 'approved' ? "Anuncio aprobado." : "Anuncio rechazado.");
    } catch (err) {
      showToast("Error: " + err.message, "error");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto pb-24 animate-in fade-in">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2"><Shield className="text-blue-500"/> Revisión de Anuncios</h2>
      {pending.length === 0 && <p className="text-center py-10 text-gray-400 font-medium">No hay anuncios pendientes, ¡todo bajo control!</p>}
      <div className="space-y-4">
        {pending.map(p => (
          <div key={p.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
            <img src={p.imgUrl} className="w-full sm:w-32 h-32 rounded-2xl object-cover bg-gray-50" />
            <div className="flex-grow">
              <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{p.title}</h3>
              <p className="text-emerald-600 font-black mb-2">${p.price}</p>
              <p className="text-xs text-gray-500 line-clamp-2 italic mb-3">"{p.desc}"</p>
              <p className="text-[10px] text-gray-400 font-bold mb-4 uppercase">Por: {p.sellerName}</p>
              
              <div className="flex gap-2">
                <button onClick={() => updateStatus(p.id, 'approved')} className="flex-1 bg-emerald-50 text-emerald-700 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1 hover:bg-emerald-100 transition"><CheckCircle size={16}/> Aprobar</button>
                <button onClick={() => updateStatus(p.id, 'rejected')} className="flex-1 bg-red-50 text-red-700 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1 hover:bg-red-100 transition"><XCircle size={16}/> Rechazar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
