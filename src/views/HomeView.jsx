import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from '../components/shared/ProductCard';

export default function HomeView({ setCurrentView }) {
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "products"), where("status", "==", "approved"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  return (
    <div className="p-4 pb-28 max-w-5xl mx-auto animate-in fade-in">
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-800">Hola, {currentUser?.name?.split(' ')[0]} 👋</h2>
          <p className="text-sm text-gray-500 font-medium">Descubre qué hay de nuevo en el colegio</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input type="text" placeholder="Buscar cuadernos, dulces..." className="w-full bg-white border-none py-2 pl-10 pr-4 rounded-full shadow-sm text-sm outline-none focus:ring-2 focus:ring-emerald-100 transition" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map(i => <ProductCard key={i.id} item={i} />)}
      </div>
      
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="bg-white p-6 rounded-full shadow-sm mb-4"><ShoppingBag size={40} className="text-gray-300"/></div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Aún no hay anuncios</h3>
          <p className="text-gray-500 max-w-xs">Sé el primero en vender algo genial a la comunidad estudiantil.</p>
          <button onClick={() => setCurrentView('publish')} className="mt-6 bg-emerald-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-emerald-700 transition">
            Publicar ahora
          </button>
        </div>
      )}
    </div>
  );
}
