import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import Dashboard from './components/dashboard/Dashboard';
import StepsTracker from './components/steps/StepsTracker';
import WaterTracker from './components/water/WaterTracker';
import WeightTracker from './components/weight/WeightTracker';
import ProfilePage from './components/profile/ProfilePage';
import './styles/global.css';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/steps" element={<ProtectedRoute><StepsTracker /></ProtectedRoute>} />
          <Route path="/water" element={<ProtectedRoute><WaterTracker /></ProtectedRoute>} />
          <Route path="/weight" element={<ProtectedRoute><WeightTracker /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
