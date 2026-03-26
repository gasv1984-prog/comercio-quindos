import React, { useState, useEffect } from 'react';
import { ShieldAlert, UserPlus } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export default function SupremoPanel({ showToast }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!db) return;
    getDocs(collection(db, "users")).then(snapshot => {
      setUsers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const promoteToAdmin = async (userId) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: 'admin' });
      setUsers(users.map(u => u.id === userId ? { ...u, role: 'admin' } : u));
      showToast("Usuario promovido a Administrador");
    } catch (err) {
      showToast("Error al promover: " + err.message, "error");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto pb-24 animate-in fade-in">
      <div className="bg-purple-600 text-white p-6 rounded-[2rem] shadow-lg mb-6 flex items-center gap-4">
        <ShieldAlert size={40} className="opacity-80" />
        <div>
          <h2 className="text-2xl font-black">Panel Supremo</h2>
          <p className="text-purple-200 text-sm font-medium">Gestión de privilegios y seguridad</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {users.map(u => (
          <div key={u.id} className="p-4 border-b border-gray-50 flex items-center justify-between hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${u.role === 'supremo' ? 'bg-purple-500' : u.role === 'admin' ? 'bg-blue-500' : 'bg-gray-400'}`}>
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-800">{u.name}</p>
                <p className="text-xs text-gray-500">{u.email} • Rol: <span className="font-bold uppercase text-[10px] bg-gray-100 px-2 py-0.5 rounded">{u.role}</span></p>
              </div>
            </div>
            {u.role === 'user' && (
              <button onClick={() => promoteToAdmin(u.id)} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition flex items-center gap-1">
                <UserPlus size={14} /> Hacer Admin
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
