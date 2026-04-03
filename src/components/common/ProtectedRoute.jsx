import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function ProtectedRoute({ children }) {
  const { state } = useApp();

  if (!state.user) return <Navigate to="/login" replace />;

  return (
    <div className="app-layout noise-overlay">
      {/* Background effects */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse at 10% 20%, rgba(0,212,255,0.04) 0%, transparent 50%), radial-gradient(ellipse at 90% 80%, rgba(168,85,247,0.03) 0%, transparent 50%)',
      }} />
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
