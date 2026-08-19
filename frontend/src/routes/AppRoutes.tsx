import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import ActivationPage from '../pages/auth/ActivationPage';
import ChangePasswordPage from '../pages/auth/ChangePasswordPage';
import DashboardPreviewPage from '../pages/preview/DashboardPreviewPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing */}
      <Route path="/" element={<LandingPage />} />

      {/* Authentication */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/activate" element={<ActivationPage />} />
      {/* Future: /activate/:token will validate the token against the backend API */}
      <Route path="/activate/:token" element={<ActivationPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />

      {/* Development-only Visual Preview for Shared Dashboard Shell */}
      <Route path="/dashboard-preview/*" element={<DashboardPreviewPage />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
