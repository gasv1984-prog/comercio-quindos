import React, { useState, useEffect } from 'react';
import { ShieldAlert, UserPlus, Zap, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const GEMINI_TEST_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDmEA-pb_wNzwuVnsdQfG7UfrmyJj_tog0";

export default function SupremoPanel({ showToast }) {
  const [users, setUsers] = useState([]);
  const [aiStatus, setAiStatus] = useState(null); // null | 'loading' | 'ok' | 'error'
  const [aiMessage, setAiMessage] = useState('');

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

  const testGemini = async () => {
    setAiStatus('loading');
    setAiMessage('');
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_TEST_KEY}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: "Responde solo con: ¡Conexión exitosa con Mercado Quindos!" }] }] })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || `Error HTTP ${res.status}`);
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Respuesta vacía";
      setAiStatus('ok');
      setAiMessage(reply);
      showToast("✅ IA conectada correctamente");
    } catch (err) {
      setAiStatus('error');
      setAiMessage(err.message);
      showToast("❌ Error de conexión con IA", "error");
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

      {/* Tarjeta de diagnóstico de IA */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-6">
        <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
          <Zap size={18} className="text-yellow-500" /> Diagnóstico de IA
        </h3>
        <p className="text-xs text-gray-400 mb-1">Clave activa: <span className="font-mono text-gray-500">{GEMINI_TEST_KEY ? `${GEMINI_TEST_KEY.substring(0, 10)}...` : '⚠️ Vacía'}</span></p>
        <button
          onClick={testGemini}
          disabled={aiStatus === 'loading'}
          className="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition disabled:opacity-60"
        >
          {aiStatus === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
          {aiStatus === 'loading' ? 'Probando conexión...' : 'Probar conexión con Gemini IA'}
        </button>
        {aiStatus === 'ok' && (
          <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-start gap-2">
            <CheckCircle size={18} className="text-emerald-500 mt-0.5 shrink-0" />
            <p className="text-sm text-emerald-700 font-medium">{aiMessage}</p>
          </div>
        )}
        {aiStatus === 'error' && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-2xl p-3 flex items-start gap-2">
            <XCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700 font-mono text-xs">{aiMessage}</p>
          </div>
        )}
      </div>

      {/* Lista de usuarios */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <h3 className="font-bold text-gray-700">Usuarios registrados</h3>
        </div>
        {users.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">No hay usuarios registrados aún.</p>}
        {users.map(u => (
          <div key={u.id} className="p-4 border-b border-gray-50 flex items-center justify-between hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${u.role === 'supremo' ? 'bg-purple-500' : u.role === 'admin' ? 'bg-blue-500' : 'bg-gray-400'}`}>
                {u.name?.charAt(0).toUpperCase()}
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
