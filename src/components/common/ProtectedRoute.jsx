import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';
import { DropletIcon } from './Icons';

const WINDOW_TITLES = {
  '/dashboard': 'Trang chủ',
  '/steps': 'Bước chân',
  '/water': 'Nước uống',
  '/weight': 'Cân nặng',
  '/news': 'Tin tức',
  '/profile': 'Hồ sơ',
};

export default function ProtectedRoute({ children }) {
  const { state } = useApp();
  const location = useLocation();

  if (!state.user) {
    return <Navigate to="/login" replace />;
  }

  const title = WINDOW_TITLES[location.pathname] || 'Healthy App';

  return (
    <div className="app-layout">
      <div className="app-window">
        <div className="window-titlebar">
          <div className="window-app-label">
            <DropletIcon className="window-app-mark" size={15} />
            <span>{title}</span>
          </div>

          <div className="window-controls" aria-hidden="true">
            <span className="window-control window-control--minimize" />
            <span className="window-control window-control--maximize" />
            <span className="window-control window-control--close" />
          </div>
        </div>

        <div className="window-body">
          <Sidebar />
          <main className="main-content">{children}</main>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
