import React, { useRef, useState } from 'react';
import { Camera, Sparkles, CheckCircle, X, Eye, Wand2 } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { processImage, enhancePublication } from '../services/geminiApi';

export default function PublishView({ setCurrentView, showToast }) {
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState('form'); 
  const [draft, setDraft] = useState({ title: '', desc: '', price: '', cat: 'Producto', img: null, mime: null });
  const [optimized, setOptimized] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const { dataUrl, mimeType } = await processImage(file);
      setDraft({ ...draft, img: dataUrl, mime: mimeType });
    }
  };

  const runOptimization = async (e) => {
    e.preventDefault();
    setStep('loading');
    try {
      const aiJson = await enhancePublication(draft);
      setOptimized({ ...draft, title: aiJson.title, desc: aiJson.description });
      setStep('preview');
    } catch (err) {
      console.error(err);
      setOptimized(draft);
      setStep('preview');
      showToast("No pudimos conectar con Gemini, pero puedes previsualizar.", "error");
    }
  };

  const confirmPublish = async (finalData) => {
    if (!db) return showToast("Firebase no conectado.", "error");
    try {
      await addDoc(collection(db, "products"), {
        title: finalData.title, desc: finalData.desc, price: Number(finalData.price), cat: finalData.cat,
        imgUrl: finalData.img, sellerId: currentUser.uid, sellerName: currentUser.name,
        status: 'pending', createdAt: serverTimestamp()
      });
      showToast("¡Publicación enviada a revisión!");
      setCurrentView('home');
    } catch (err) {
      showToast("Error al publicar: " + err.message, "error");
    }
  };

  if (step === 'loading') return (
    <div className="flex flex-col items-center justify-center h-96 animate-pulse">
      <Wand2 size={56} className="text-emerald-500 mb-6 animate-bounce drop-shadow-md" />
      <h3 className="text-xl font-black text-gray-800 mb-2">Magia en progreso</h3>
      <p className="text-gray-500 font-medium">Analizando el contexto...</p>
    </div>
  );

  if (step === 'preview') return (
    <div className="p-4 max-w-lg mx-auto pb-24 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800"><Eye className="text-emerald-600" /> Previsualización</h2>
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100 mb-6">
        <div className="relative h-64 bg-gray-100 group">
          {optimized.img ? <img src={optimized.img} className="w-full h-full object-cover" alt="Preview" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><Camera size={48} /></div>}
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900 leading-tight">{optimized.title}</h3>
            <span className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full font-bold border border-emerald-100">{optimized.cat}</span>
          </div>
          <p className="text-3xl font-black text-emerald-600 mb-4">${parseFloat(optimized.price).toLocaleString()}</p>
          <div className="bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-200 mb-6">
            <p className="text-gray-600 text-sm italic font-medium">"{optimized.desc}"</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <button onClick={() => confirmPublish(optimized)} className="bg-emerald-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-emerald-700 transition"><CheckCircle size={20} /> Publicar Versión Mejorada</button>
            <button onClick={() => confirmPublish(draft)} className="bg-white border-2 border-gray-200 text-gray-500 font-bold py-3 rounded-xl hover:bg-gray-50 transition">Usar mis textos originales</button>
          </div>
          <button onClick={() => setStep('form')} className="w-full mt-4 text-gray-400 hover:text-gray-600 text-sm font-medium flex items-center justify-center gap-1"><X size={16} /> Volver a editar</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 max-w-xl mx-auto pb-24 animate-in slide-in-from-right-8 duration-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear Anuncio</h2>
      <form onSubmit={runOptimization} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-5">
        <div onClick={() => fileInputRef.current.click()} className="group h-48 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 transition overflow-hidden bg-gray-50 relative">
          {draft.img ? <img src={draft.img} className="w-full h-full object-cover" /> : <><Camera size={28} className="text-emerald-500 mb-2"/><p className="text-sm text-gray-500 font-bold text-center px-4">Toca para subir foto</p></>}
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFile} accept="image/*" className="hidden" />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-gray-400 font-bold">$</span>
            <input required type="number" placeholder="Precio" className="w-full pl-8 pr-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-gray-700" value={draft.price} onChange={e => setDraft({...draft, price: e.target.value})} />
          </div>
          <select className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-gray-700 font-medium" value={draft.cat} onChange={e => setDraft({...draft, cat: e.target.value})}>
            <option>Producto</option><option>Servicio</option><option>Uniforme</option><option>Tutorías</option>
          </select>
        </div>

        <input required type="text" placeholder="Título corto (ej: Cuaderno decorado)" className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 font-medium" value={draft.title} onChange={e => setDraft({...draft, title: e.target.value})} />
        <textarea required rows="3" placeholder="Describe los detalles..." className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-gray-600" value={draft.desc} onChange={e => setDraft({...draft, desc: e.target.value})} />

        <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-emerald-700"><Sparkles size={20} className="animate-pulse" /> Optimizar Anuncio con IA</button>
      </form>
    </div>
  );
}
