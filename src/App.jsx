import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import Toast from './components/layout/Toast';
import Loader from './components/shared/Loader';

import AuthView from './views/AuthView';
import HomeView from './views/HomeView';
import PublishView from './views/PublishView';
import AdminPanel from './views/AdminPanel';
import SupremoPanel from './views/SupremoPanel';

export default function App() {
  const { currentUser, loading } = useAuth();
  const [currentView, setCurrentView] = useState('home'); 
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });

  const showToast = (msg, type = 'success') => setToast({ show: true, msg, type });

  if (loading) return <Loader />;
  if (!currentUser) return <AuthView showToast={showToast} />;

  return (
    <div className="min-h-screen bg-[#f4f7f6] font-sans text-slate-900 selection:bg-emerald-200">
      <Toast toast={toast} setToast={setToast} />
      <Header />

      <main>
        {currentView === 'home' && <HomeView setCurrentView={setCurrentView} />}
        {currentView === 'publish' && <PublishView setCurrentView={setCurrentView} showToast={showToast} />}
        {currentView === 'admin' && <AdminPanel showToast={showToast} />}
        {currentView === 'supremo' && <SupremoPanel showToast={showToast} />}
      </main>

      <BottomNav currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
}
