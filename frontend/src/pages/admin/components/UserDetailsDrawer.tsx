import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  Building2,
  IdCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  KeyRound,
  Edit3,
  Ban,
  Check,
  Smartphone,
} from 'lucide-react';
import { Button, Badge, Alert } from '../../../components/common';
import type { ManagedUser } from '../../../types/userManagement.types';

export interface UserDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user?: ManagedUser | null;
  onEdit?: (user: ManagedUser) => void;
}

export const UserDetailsDrawer: React.FC<UserDetailsDrawerProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [isConfirmingActivation, setIsConfirmingActivation] = useState(false);
  const [statusNotice, setStatusNotice] = useState<{
    type: 'info' | 'error' | 'success';
    title: string;
    message: string;
  } | null>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (isConfirmingActivation) {
          setIsConfirmingActivation(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isConfirmingActivation, onClose]);

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

  const currentStatus = user?.accountStatus || 'PENDING';

  const formatCategory = (cat?: string) => {
    if (!cat) return '—';
    if (cat === 'ADMIN' || cat === 'ADMINISTRATOR') return 'Administrator';
    if (cat === 'PERMANENT_STAFF') return 'Permanent Staff';
    if (cat === 'INTERN') return 'Intern';
    return cat;
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return (
          <Badge variant="success" size="sm">
            Active
          </Badge>
        );
      case 'INACTIVE':
        return (
          <Badge variant="neutral" size="sm">
            Inactive
          </Badge>
        );
      case 'PENDING':
      default:
        return (
          <Badge variant="warning" size="sm">
            Pending Activation
          </Badge>
        );
    }
  };

  const handleActionClick = (actionName: string) => {
    if (actionName === 'activate') {
      setIsConfirmingActivation(true);
      return;
    }

    if (actionName === 'edit') {
      setStatusNotice({
        type: 'info',
        title: 'Edit User Interface',
        message: 'Edit user interface will be connected in the next frontend task.',
      });
      return;
    }

    // Deactivate / Reactivate
    setStatusNotice({
      type: 'info',
      title: 'Awaiting backend integration',
      message:
        'Account status changes will be processed by the user management API once connected.',
    });
  };

  const handleConfirmActivation = () => {
    setIsConfirmingActivation(false);
    setStatusNotice({
      type: 'info',
      title: 'Awaiting backend integration',
      message:
        'Activation interface ready — awaiting backend integration. Real account activation and SMS notification dispatch will be executed by the backend service.',
    });
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
                  Programme User
                </Badge>
                {getStatusBadge(currentStatus)}
              </div>
              <h2
                id="user-details-title"
                className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-brand-navy)]"
              >
                User Account Details
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Review programme identity, access information and account status.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-brand-navy)] hover:bg-[var(--color-surface-subtle)] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-brand-blue)]/40"
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

            {/* User Avatar Summary Header Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/60 via-slate-50 to-white border border-[var(--color-border-subtle)] flex items-center gap-4 shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-brand-blue)] text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-[var(--color-brand-navy)] truncate">
                    {user?.fullName || '—'}
                  </h3>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono font-medium text-slate-700">
                    {user?.employeeId || '—'}
                  </span>
                  <span>•</span>
                  <span>{user?.professionalRole || '—'}</span>
                </p>
              </div>
            </div>

            {/* ── 1. PERSONAL INFORMATION ─────────────────────────── */}
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
                    <IdCard className="w-3 h-3 text-[var(--color-text-muted)]" />
                    Employee / Intern ID
                  </span>
                  <p className="font-mono font-semibold text-[var(--color-brand-navy)]">
                    {user?.employeeId || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[var(--color-text-muted)]" />
                    Email Address
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)] truncate">
                    {user?.email || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[var(--color-text-muted)]" />
                    Registered Mobile Number
                  </span>
                  <p className="font-mono font-semibold text-[var(--color-brand-navy)]">
                    {user?.phoneNumber ? `+94 ${user.phoneNumber}` : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── 2. PROGRAMME INFORMATION ────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Briefcase className="w-4 h-4 text-[var(--color-brand-green)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Programme Information
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    User Category
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {formatCategory(user?.category)}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Professional Role
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {user?.professionalRole || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-[var(--color-text-muted)]" />
                    Department / Team
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {user?.department || '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── 3. ACCOUNT ACCESS & STATUS ──────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <KeyRound className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Account Access & Security
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Account Status
                  </span>
                  <div>{getStatusBadge(currentStatus)}</div>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-[var(--color-brand-blue)]" />
                    Mobile Verification Method
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    SMS OTP Verification
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Access Method
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    Phone Number + OTP
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[var(--color-text-muted)]" />
                    Created Date
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {user?.createdAt || '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Pending Activation Informational Card ──────────── */}
            {currentStatus === 'PENDING' && (
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Account awaiting administrator activation.</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed pl-6">
                  Once activated through the backend service, the user will become eligible to access the portal using their registered mobile number and OTP verification.
                </p>
              </div>
            )}

            {/* ── Backend-Managed Access Flow Procedure Card ──────── */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 via-white to-blue-50/40 border border-[var(--color-border-subtle)] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[var(--color-brand-blue)]" />
                  <span className="text-xs font-bold text-[var(--color-brand-navy)]">
                    Backend-managed access flow
                  </span>
                </div>
                <Badge variant="blue" size="sm">
                  System Architecture
                </Badge>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-600">
                {[
                  '1. Administrator activates the programme account.',
                  '2. Backend updates the account status.',
                  '3. Backend notification service informs the user that portal access is active.',
                  '4. User opens the portal login link.',
                  '5. User enters the registered mobile number.',
                  '6. Backend/SMS service sends the OTP.',
                  '7. Backend verifies the OTP.',
                  '8. Frontend receives the verified identity and role.',
                  '9. User is redirected to the correct dashboard.',
                ].map((stepText, idx) => (
                  <div key={idx} className="flex items-start gap-2 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)] shrink-0 mt-1.5" />
                    <span>{stepText}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sticky Drawer Footer / Action Buttons ────────────── */}
          <div className="px-6 py-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)]/60 flex items-center justify-between gap-3 shrink-0">
            <Button type="button" variant="outline" size="md" onClick={onClose}>
              Close
            </Button>

            <div className="flex items-center gap-2.5">
              {/* Conditional Actions based on Status */}
              {currentStatus === 'PENDING' && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    leftIcon={<Edit3 className="w-4 h-4" />}
                    onClick={() => handleActionClick('edit')}
                  >
                    Edit User
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    onClick={() => handleActionClick('activate')}
                  >
                    Activate User
                  </Button>
                </>
              )}

              {currentStatus === 'ACTIVE' && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    leftIcon={<Edit3 className="w-4 h-4" />}
                    onClick={() => handleActionClick('edit')}
                  >
                    Edit User
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                    leftIcon={<Ban className="w-4 h-4 text-red-600" />}
                    onClick={() => handleActionClick('deactivate')}
                  >
                    Deactivate User
                  </Button>
                </>
              )}

              {currentStatus === 'INACTIVE' && (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  leftIcon={<Check className="w-4 h-4" />}
                  onClick={() => handleActionClick('reactivate')}
                >
                  Reactivate User
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Activation Confirmation Dialog Modal ─────────────── */}
      {isConfirmingActivation && (
        <div
          className="fixed inset-0 z-60 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-activation-title"
        >
          <div className="min-h-screen px-4 flex items-center justify-center">
            {/* Modal backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
              onClick={() => setIsConfirmingActivation(false)}
              aria-hidden="true"
            />

            {/* Modal Card */}
            <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[var(--color-border-subtle)] space-y-5 z-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[var(--color-brand-blue)] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3
                    id="confirm-activation-title"
                    className="text-base font-bold text-[var(--color-brand-navy)]"
                  >
                    Activate Programme User?
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    Confirm that the user's programme information and registered mobile number have been reviewed before enabling portal access.
                  </p>
                </div>
              </div>

              {/* Review Summary */}
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
                  <span className="text-[var(--color-text-secondary)]">Registered Mobile:</span>
                  <span className="font-mono font-semibold text-slate-800">{user?.phoneNumber ? `+94 ${user.phoneNumber}` : '—'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/80">
                  <span className="text-[var(--color-text-secondary)]">Category:</span>
                  <span className="font-semibold text-slate-800">{formatCategory(user?.category)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/80">
                  <span className="text-[var(--color-text-secondary)]">Professional Role:</span>
                  <span className="font-semibold text-slate-800">{user?.professionalRole || '—'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[var(--color-text-secondary)]">Department:</span>
                  <span className="font-semibold text-slate-800">{user?.department || '—'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsConfirmingActivation(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  onClick={handleConfirmActivation}
                >
                  Confirm Activation
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
