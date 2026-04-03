import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import PlaceholderPage from './components/common/PlaceholderPage';
import WaterTracker from './components/water/WaterTracker';
import { AppProvider } from './context/AppContext';
import './styles/global.css';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Trang chủ"
                  description="Mình giữ route này để điều hướng không bị gãy. Phần tập trung hoàn thiện trong lần chỉnh này là màn Nước uống theo đúng ảnh bạn đưa."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/steps"
            element={
              <ProtectedRoute>
                <PlaceholderPage title="Bước chân" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/water"
            element={
              <ProtectedRoute>
                <WaterTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/weight"
            element={
              <ProtectedRoute>
                <PlaceholderPage title="Cân nặng" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/news"
            element={
              <ProtectedRoute>
                <PlaceholderPage title="Tin tức" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <PlaceholderPage title="Hồ sơ" />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/water" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
