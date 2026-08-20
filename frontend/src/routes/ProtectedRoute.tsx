import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types/auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-base)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[var(--color-brand-blue)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            Authenticating session…
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to user's authorized dashboard if role mismatch
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'PERMANENT_STAFF') return <Navigate to="/staff/dashboard" replace />;
    if (user.role === 'INTERN') return <Navigate to="/intern/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
