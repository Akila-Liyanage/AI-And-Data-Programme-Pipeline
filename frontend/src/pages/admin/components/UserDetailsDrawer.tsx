/**
 * UserDetailsDrawer.tsx
 *
 * STEP 4 ADMIN USER VERIFICATION drawer.
 * Displays self-registered user details, verification status, and provides
 * Verify / Reject actions for PENDING_VERIFICATION accounts.
 *
 * STRICT BOUNDARIES:
 * - NO real verification or rejection database persistence.
 * - NO local state mutation of the selected user status.
 * - NO fake session manipulation.
 */
import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  IdCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Ban,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { Button, Badge, Alert } from '../../../components/common';
import type { ManagedUser } from '../../../types/userManagement.types';

export interface UserDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user?: ManagedUser | null;
  onStatusUpdated?: () => void;
}

export const UserDetailsDrawer: React.FC<UserDetailsDrawerProps> = ({
  isOpen,
  onClose,
  user,
  onStatusUpdated,
}) => {
  const [isConfirmingVerification, setIsConfirmingVerification] = useState(false);
  const [isConfirmingRejection, setIsConfirmingRejection] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [statusNotice, setStatusNotice] = useState<{
    type: 'info' | 'error' | 'success';
    title: string;
    message: string;
  } | null>(null);
  const [isActionPending, setIsActionPending] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (isConfirmingVerification) {
          setIsConfirmingVerification(false);
        } else if (isConfirmingRejection) {
          setIsConfirmingRejection(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isConfirmingVerification, isConfirmingRejection, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const currentStatus = user?.accountStatus || 'PENDING_VERIFICATION';

  const formatCategory = (cat?: string) => {
    if (!cat) return '—';
    if (cat === 'ADMIN' || cat === 'ADMINISTRATOR') return 'Administrator';
    if (cat === 'PERMANENT_STAFF') return 'Permanent Staff';
    if (cat === 'INTERN') return 'Intern';
    return cat;
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'VERIFIED':
      case 'ACTIVE':
        return (
          <Badge variant="success" size="sm" className="inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Verified
          </Badge>
        );
      case 'REJECTED':
      case 'INACTIVE':
        return (
          <Badge variant="neutral" size="sm" className="inline-flex items-center gap-1">
            <Ban className="w-3 h-3 text-slate-500" />
            Rejected
          </Badge>
        );
      case 'PENDING_VERIFICATION':
      case 'PENDING':
      default:
        return (
          <Badge variant="warning" size="sm" className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending Verification
          </Badge>
        );
    }
  };

  const handleDeactivate = async () => {
    if (!user) return;
    setIsActionPending(true);
    setStatusNotice(null);
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/users/${user.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'INACTIVE' }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to deactivate user.');

      setStatusNotice({
        type: 'success',
        title: 'User Deactivated',
        message: `Account status for ${user.fullName} has been set to INACTIVE.`,
      });
      if (onStatusUpdated) onStatusUpdated();
    } catch (err: unknown) {
      console.error(err);
      setStatusNotice({
        type: 'error',
        title: 'Deactivation Failed',
        message: err instanceof Error ? err.message : 'An error occurred during deactivation.',
      });
    } finally {
      setIsActionPending(false);
    }
  };

  const handleReactivate = async () => {
    if (!user) return;
    setIsActionPending(true);
    setStatusNotice(null);
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/users/${user.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'ACTIVE' }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to reactivate user.');

      setStatusNotice({
        type: 'success',
        title: 'User Reactivated',
        message: `Account status for ${user.fullName} has been set to ACTIVE.`,
      });
      if (onStatusUpdated) onStatusUpdated();
    } catch (err: unknown) {
      console.error(err);
      setStatusNotice({
        type: 'error',
        title: 'Reactivation Failed',
        message: err instanceof Error ? err.message : 'An error occurred during reactivation.',
      });
    } finally {
      setIsActionPending(false);
    }
  };

  const handleActionClick = (actionName: string) => {
    if (actionName === 'verify') {
      setIsConfirmingVerification(true);
      return;
    }
    if (actionName === 'reject') {
      setIsConfirmingRejection(true);
      return;
    }
    if (actionName === 'deactivate') {
      handleDeactivate();
      return;
    }
    if (actionName === 'reactivate') {
      handleReactivate();
      return;
    }
  };

  const handleConfirmVerification = async () => {
    if (!user) return;
    setIsConfirmingVerification(false);
    setIsActionPending(true);
    setStatusNotice(null);

    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/users/${user.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'ACTIVE' }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify user.');
      }

      setStatusNotice({
        type: 'success',
        title: 'Account Verified Successfully',
        message: `Account status for ${user.fullName} is now ACTIVE. They can now log in using OTP.`,
      });

      if (onStatusUpdated) {
        onStatusUpdated();
      }
    } catch (err: unknown) {
      console.error(err);
      setStatusNotice({
        type: 'error',
        title: 'Verification Failed',
        message: err instanceof Error ? err.message : 'An error occurred during verification.',
      });
    } finally {
      setIsActionPending(false);
    }
  };

  const handleConfirmRejection = async () => {
    if (!user) return;
    setIsConfirmingRejection(false);
    setIsActionPending(true);
    setStatusNotice(null);

    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/users/${user.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'REJECTED' }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reject registration.');
      }

      setStatusNotice({
        type: 'success',
        title: 'Registration Rejected',
        message: `Registration for ${user.fullName} has been declined.`,
      });

      if (onStatusUpdated) {
        onStatusUpdated();
      }
    } catch (err: unknown) {
      console.error(err);
      setStatusNotice({
        type: 'error',
        title: 'Rejection Failed',
        message: err instanceof Error ? err.message : 'An error occurred during registration rejection.',
      });
    } finally {
      setIsActionPending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-details-title"
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-[var(--color-brand-navy)]/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-xl md:max-w-2xl bg-[var(--color-surface-white)] shadow-2xl flex flex-col h-full border-l border-[var(--color-border-subtle)]">
          
          {/* ── Sticky Header ───────────────────────────────────── */}
          <div className="px-6 py-5 border-b border-[var(--color-border-subtle)] flex items-start justify-between gap-4 bg-[var(--color-surface-white)] shrink-0">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant="blue" size="sm">
                  Registration Review
                </Badge>
                {getStatusBadge(currentStatus)}
              </div>
              <h2
                id="user-details-title"
                className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-brand-navy)]"
              >
                Registration Details
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Review self-registered account parameters and verify or reject system access.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-brand-navy)] hover:bg-[var(--color-surface-subtle)] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-brand-blue)]/40 cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Scrollable Body ─────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Status notice alert */}
            {statusNotice && (
              <Alert
                variant={statusNotice.type}
                title={statusNotice.title}
                onClose={() => setStatusNotice(null)}
              >
                {statusNotice.message}
              </Alert>
            )}

            {/* User Info Header Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/60 via-slate-50 to-white border border-[var(--color-border-subtle)] flex items-center gap-4 shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-brand-blue)] text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-[var(--color-brand-navy)] truncate">
                  {user?.fullName || '—'}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono font-medium text-slate-700">
                    {user?.employeeId || '—'}
                  </span>
                  <span>•</span>
                  <span>{formatCategory(user?.category)}</span>
                </p>
              </div>
            </div>

            {/* ── Section 1. PERSONAL INFORMATION ────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <User className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Personal Information
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Full Name
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {user?.fullName || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1">
                    <IdCard className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                    Employee / Intern ID
                  </span>
                  <p className="font-mono font-semibold text-[var(--color-brand-navy)]">
                    {user?.employeeId || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                    Email Address
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)] truncate">
                    {user?.email || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                    Registered Mobile Number
                  </span>
                  <p className="font-mono font-semibold text-[var(--color-brand-navy)]">
                    {user?.phoneNumber ? `+94 ${user.phoneNumber}` : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Section 2. ACCOUNT TYPE ────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <ShieldCheck className="w-4 h-4 text-[var(--color-brand-green)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Account Type & Status
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    User Type
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {formatCategory(user?.category)}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Verification Status
                  </span>
                  <div>{getStatusBadge(currentStatus)}</div>
                </div>
              </div>
            </div>

            {/* ── Section 3. ROLE INFORMATION ────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Briefcase className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Role Information
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {user?.category === 'INTERN' ? (
                  <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1 sm:col-span-2">
                    <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                      Intern Role
                    </span>
                    <p className="font-semibold text-[var(--color-brand-navy)]">
                      {user?.professionalRole || '—'}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                      <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                        Professional Role
                      </span>
                      <p className="font-semibold text-[var(--color-brand-navy)]">
                        {user?.professionalRole || '—'}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                      <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                        Employment Type
                      </span>
                      <p className="font-semibold text-[var(--color-brand-navy)]">
                        {/* We use department field as a fallback placeholder if employmentType is not on old model, or default to Permanent */}
                        {user?.department === 'Contract Based' || user?.department === 'Freelance' || user?.department === 'Permanent'
                          ? user.department
                          : 'Permanent'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ── Section 4. SYSTEM INFORMATION ──────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Calendar className="w-4 h-4 text-slate-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  System Audit
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Registered Date
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {user?.createdAt || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Last Updated
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {user?.updatedAt || '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Notice for Pending accounts */}
            {(currentStatus.toUpperCase() === 'PENDING_VERIFICATION' || currentStatus.toUpperCase() === 'PENDING') && (
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Awaiting administrative verification.</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed pl-6">
                  Verify the registration details. Once confirmed, this user can access the main dashboards. Rejection prevents dashboard sign-in.
                </p>
              </div>
            )}

          </div>

          {/* ── Sticky Drawer Footer / Action Buttons ────────────── */}
          <div className="px-6 py-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)]/60 flex items-center justify-between gap-3 shrink-0">
            <Button type="button" variant="outline" size="md" onClick={onClose} disabled={isActionPending}>
              Close
            </Button>

            <div className="flex items-center gap-2.5">
              {/* Actions based on Pending status */}
              {(currentStatus.toUpperCase() === 'PENDING_VERIFICATION' || currentStatus.toUpperCase() === 'PENDING') && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                    leftIcon={<Ban className="w-4 h-4 text-red-600" />}
                    onClick={() => handleActionClick('reject')}
                    disabled={isActionPending}
                  >
                    {isActionPending ? 'Rejecting...' : 'Reject Registration'}
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    onClick={() => handleActionClick('verify')}
                    disabled={isActionPending}
                    isLoading={isActionPending}
                  >
                    {isActionPending ? 'Verifying...' : 'Verify User'}
                  </Button>
                </>
              )}

              {(currentStatus.toUpperCase() === 'VERIFIED' || currentStatus.toUpperCase() === 'ACTIVE') && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                  leftIcon={<Ban className="w-4 h-4 text-red-600" />}
                  onClick={() => handleActionClick('deactivate')}
                  disabled={isActionPending}
                  isLoading={isActionPending}
                >
                  Deactivate User
                </Button>
              )}

              {(currentStatus.toUpperCase() === 'REJECTED' || currentStatus.toUpperCase() === 'INACTIVE') && (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  onClick={() => handleActionClick('reactivate')}
                  disabled={isActionPending}
                  isLoading={isActionPending}
                >
                  Review Registration
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Verify Confirmation Modal ───────────────────────── */}
      {isConfirmingVerification && (
        <div
          className="fixed inset-0 z-60 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-verification-title"
        >
          <div className="min-h-screen px-4 flex items-center justify-center">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
              onClick={() => setIsConfirmingVerification(false)}
              aria-hidden="true"
            />

            <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[var(--color-border-subtle)] space-y-5 z-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[var(--color-brand-blue)] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3
                    id="confirm-verification-title"
                    className="text-base font-bold text-[var(--color-brand-navy)]"
                  >
                    Verify this user?
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    This will activate the account and allow the user to sign in using their registered mobile number and OTP.
                  </p>
                </div>
              </div>

              {/* Summary details */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/80">
                  <span className="text-[var(--color-text-secondary)]">User:</span>
                  <span className="font-semibold text-slate-800">{user?.fullName || '—'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/80">
                  <span className="text-[var(--color-text-secondary)]">User ID:</span>
                  <span className="font-mono font-semibold text-slate-800">{user?.employeeId || '—'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/80">
                  <span className="text-[var(--color-text-secondary)]">User Type:</span>
                  <span className="font-semibold text-slate-800">{formatCategory(user?.category)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/80">
                  <span className="text-[var(--color-text-secondary)]">Role:</span>
                  <span className="font-semibold text-slate-800">{user?.professionalRole || '—'}</span>
                </div>
                {user?.category === 'PERMANENT_STAFF' && (
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="text-[var(--color-text-secondary)]">Employment Type:</span>
                    <span className="font-semibold text-slate-800">
                      {user?.department === 'Contract Based' || user?.department === 'Freelance' ? user.department : 'Permanent'}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-slate-200/80">
                  <span className="text-[var(--color-text-secondary)]">Mobile Number:</span>
                  <span className="font-mono font-semibold text-slate-800">{user?.phoneNumber ? `+94 ${user.phoneNumber}` : '—'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[var(--color-text-secondary)]">Email:</span>
                  <span className="font-semibold text-slate-800 truncate">{user?.email || '—'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsConfirmingVerification(false)}
                  disabled={isActionPending}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  onClick={handleConfirmVerification}
                  isLoading={isActionPending}
                  disabled={isActionPending}
                >
                  {isActionPending ? 'Verifying...' : 'Verify User'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Reject Confirmation Modal ───────────────────────── */}
      {isConfirmingRejection && (
        <div
          className="fixed inset-0 z-60 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-rejection-title"
        >
          <div className="min-h-screen px-4 flex items-center justify-center">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
              onClick={() => setIsConfirmingRejection(false)}
              aria-hidden="true"
            />

            <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[var(--color-border-subtle)] space-y-5 z-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                </div>
                <div className="space-y-1">
                  <h3
                    id="confirm-rejection-title"
                    className="text-base font-bold text-[var(--color-brand-navy)]"
                  >
                    Reject this registration?
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    This user will not be allowed to access the programme workspace.
                  </p>
                </div>
              </div>

              {/* Reason Textarea UI */}
              <div className="space-y-1.5">
                <label
                  htmlFor="rejection-reason"
                  className="block text-xs font-bold text-[var(--color-brand-navy)] uppercase tracking-wider"
                >
                  Reason for Rejection
                </label>
                <textarea
                  id="rejection-reason"
                  placeholder="Provide a brief explanation for rejection (e.g. invalid employee ID)"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full min-h-[80px] p-3 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsConfirmingRejection(false)}
                  disabled={isActionPending}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                  leftIcon={<Ban className="w-4 h-4 text-red-600" />}
                  onClick={handleConfirmRejection}
                  isLoading={isActionPending}
                  disabled={isActionPending}
                >
                  {isActionPending ? 'Rejecting...' : 'Reject Registration'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
