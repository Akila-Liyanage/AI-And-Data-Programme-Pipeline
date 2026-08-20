import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import ActivationPage from '../pages/auth/ActivationPage';
import ChangePasswordPage from '../pages/auth/ChangePasswordPage';
import DashboardPreviewPage from '../pages/preview/DashboardPreviewPage';
import AdminDashboardPage from '../pages/dashboard/AdminDashboardPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import ProjectsManagementPage from '../pages/admin/ProjectsManagementPage';
import ProjectAssignmentsPage from '../pages/admin/ProjectAssignmentsPage';
import ProgrammeProgressPage from '../pages/admin/ProgrammeProgressPage';
import StaffDashboardPage from '../pages/dashboard/StaffDashboardPage';
import InternDashboardPage from '../pages/dashboard/InternDashboardPage';
import { ProtectedRoute } from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing */}
      <Route path="/" element={<LandingPage />} />

      {/* Authentication */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/activate" element={<ActivationPage />} />
      <Route path="/activate/:token" element={<ActivationPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />

      {/* Role-Based Protected Dashboards */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <UserManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/projects"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ProjectsManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/assignments"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ProjectAssignmentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/progress"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ProgrammeProgressPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/dashboard"
        element={
          <ProtectedRoute allowedRoles={['PERMANENT_STAFF']}>
            <StaffDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/*"
        element={
          <ProtectedRoute allowedRoles={['PERMANENT_STAFF']}>
            <StaffDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/intern/dashboard"
        element={
          <ProtectedRoute allowedRoles={['INTERN']}>
            <InternDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/intern/*"
        element={
          <ProtectedRoute allowedRoles={['INTERN']}>
            <InternDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Development-only Visual Preview for Shared Dashboard Shell */}
      <Route path="/dashboard-preview/*" element={<DashboardPreviewPage />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
