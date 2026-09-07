import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import ActivationPage from '../pages/auth/ActivationPage';
import ChangePasswordPage from '../pages/auth/ChangePasswordPage';
import RegistrationPage from '../pages/auth/RegistrationPage';
import PendingVerificationPage from '../pages/auth/PendingVerificationPage';
import DashboardPreviewPage from '../pages/preview/DashboardPreviewPage';
import AdminDashboardPage from '../pages/dashboard/AdminDashboardPage';
import AdminProfilePage from '../pages/admin/AdminProfilePage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import ProjectsManagementPage from '../pages/admin/ProjectsManagementPage';
import ProjectAssignmentsPage from '../pages/admin/ProjectAssignmentsPage';
import ProgrammeProgressPage from '../pages/admin/ProgrammeProgressPage';
import TeamWorkHistoryPage from '../pages/admin/TeamWorkHistoryPage';
import StaffDashboardPage from '../pages/dashboard/StaffDashboardPage';
import StaffAssignedProjectsPage from '../pages/staff/StaffAssignedProjectsPage';
import StaffWorkItemsPage from '../pages/staff/StaffWorkItemsPage';
import StaffProgressPage from '../pages/staff/StaffProgressPage';
import StaffWorkHistoryPage from '../pages/staff/StaffWorkHistoryPage';
import StaffProfilePage from '../pages/staff/StaffProfilePage';
import InternDashboardPage from '../pages/dashboard/InternDashboardPage';
import InternAssignedProjectsPage from '../pages/intern/InternAssignedProjectsPage';
import InternWorkItemsPage from '../pages/intern/InternWorkItemsPage';
import InternProgressPage from '../pages/intern/InternProgressPage';
import InternWorkHistoryPage from '../pages/intern/InternWorkHistoryPage';
import InternProfilePage from '../pages/intern/InternProfilePage';
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
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/register/pending" element={<PendingVerificationPage />} />

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
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminProfilePage />
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
        path="/admin/work-history"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <TeamWorkHistoryPage />
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
        path="/staff/projects"
        element={
          <ProtectedRoute allowedRoles={['PERMANENT_STAFF']}>
            <StaffAssignedProjectsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/work-items"
        element={
          <ProtectedRoute allowedRoles={['PERMANENT_STAFF']}>
            <StaffWorkItemsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/progress"
        element={
          <ProtectedRoute allowedRoles={['PERMANENT_STAFF']}>
            <StaffProgressPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/work-history"
        element={
          <ProtectedRoute allowedRoles={['PERMANENT_STAFF']}>
            <StaffWorkHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/profile"
        element={
          <ProtectedRoute allowedRoles={['PERMANENT_STAFF']}>
            <StaffProfilePage />
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
        path="/intern/projects"
        element={
          <ProtectedRoute allowedRoles={['INTERN']}>
            <InternAssignedProjectsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/intern/work-items"
        element={
          <ProtectedRoute allowedRoles={['INTERN']}>
            <InternWorkItemsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/intern/progress"
        element={
          <ProtectedRoute allowedRoles={['INTERN']}>
            <InternProgressPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/intern/work-history"
        element={
          <ProtectedRoute allowedRoles={['INTERN']}>
            <InternWorkHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/intern/profile"
        element={
          <ProtectedRoute allowedRoles={['INTERN']}>
            <InternProfilePage />
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
