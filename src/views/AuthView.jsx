import React, { useState } from 'react';
import { ShoppingBag, User, Lock, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthView({ showToast }) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', terms: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        showToast("¡Bienvenido de nuevo!");
      } else {
        if (!formData.terms) throw new Error("Debes aceptar los términos y políticas.");
        await register(formData.name, formData.email, formData.password);
        showToast("Cuenta creada exitosamente");
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col justify-center items-center px-4">
      <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md border border-emerald-100 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
            <ShoppingBag size={48} />
          </div>
        </div>
        <h2 className="text-3xl font-black text-center text-gray-800 mb-2">Mercado Quindos</h2>
        <p className="text-center text-gray-500 mb-8 font-medium">
          {isLogin ? "Accede a la plataforma escolar" : "Únete a nuestra comunidad educativa"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User size={20} className="absolute left-4 top-3.5 text-gray-400" />
              <input required type="text" placeholder="Tu Nombre Completo" className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
          )}
          <div className="relative">
            <Mail size={20} className="absolute left-4 top-3.5 text-gray-400" />
            <input required type="email" placeholder="Correo electrónico" className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="relative">
            <Lock size={20} className="absolute left-4 top-3.5 text-gray-400" />
            <input required type="password" placeholder="Contraseña" className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition"
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>

          {!isLogin && (
            <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <input required type="checkbox" id="terms" className="mt-1 w-4 h-4 text-emerald-600" 
                checked={formData.terms} onChange={e => setFormData({...formData, terms: e.target.checked})} />
              <label htmlFor="terms" className="text-xs text-gray-600 font-medium">
                Acepto las <span className="text-emerald-600 font-bold underline">Políticas de Privacidad</span> y confirmo que los productos publicados cumplen con el manual de convivencia de la IE Los Quindos.
              </label>
            </div>
          )}

          <button disabled={loading} type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition active:scale-95 flex justify-center mt-6">
            {loading ? <Loader2 className="animate-spin" /> : (isLogin ? "Ingresar" : "Crear Cuenta")}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500 font-medium">
          {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-emerald-600 font-bold hover:underline">
            {isLogin ? "Regístrate aquí" : "Inicia sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}
