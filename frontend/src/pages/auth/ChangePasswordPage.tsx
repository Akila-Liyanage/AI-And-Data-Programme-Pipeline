import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Alert, Badge, PasswordRequirements, DEFAULT_PASSWORD_RULES, BrandLogo } from '../../components/common';
import { AuthLayout } from '../../components/layout/AuthLayout';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  LogIn,
  ShieldAlert,
  RefreshCw,
  Vault,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────── */
/* Types                                                      */
/* ─────────────────────────────────────────────────────────── */
interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

/* ─────────────────────────────────────────────────────────── */
/* Left Supporting Panel                                      */
/* ─────────────────────────────────────────────────────────── */
function ChangePasswordBrandPanel() {
  return (
    <div className="bg-[var(--color-brand-navy)] px-8 py-10 sm:px-10 sm:py-12 text-white flex flex-col justify-between h-full relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute -top-12 -right-12 w-52 h-52 bg-[var(--color-brand-blue)]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-[var(--color-brand-green)]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative space-y-7">
        {/* Product emblem */}
        <BrandLogo theme="dark" size="md" />

        {/* Heading block */}
        <div className="space-y-3">
          <Badge variant="blue" dot size="sm" className="bg-white/10 text-blue-200 border-white/15">
            Security Update
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug">
            Protect your programme account before accessing your workspace.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Replace your temporary credentials with a secure, personal password to continue to your AI & Data Programme workspace.
          </p>
        </div>

        {/* Supporting items */}
        <div className="space-y-4 pt-1">
          {[
            {
              icon: <ShieldAlert className="w-4 h-4" />,
              color: 'text-[var(--color-brand-blue-light)]',
              label: 'Account Protection',
              detail: 'Temporary passwords must be replaced before workspace access is granted.',
            },
            {
              icon: <RefreshCw className="w-4 h-4" />,
              color: 'text-[var(--color-brand-green)]',
              label: 'Secure Credential Update',
              detail: 'Your new password is private and will not be shared with programme staff.',
            },
            {
              icon: <Vault className="w-4 h-4" />,
              color: 'text-[var(--color-brand-blue-light)]',
              label: 'Controlled Workspace Access',
              detail: 'After updating, sign in normally to reach your role-based dashboard.',
            },
          ].map(({ icon, color, label, detail }) => (
            <div key={label} className="flex items-start gap-3">
              <div
                className={`w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 ${color}`}
                aria-hidden="true"
              >
                {icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-xs text-slate-400 leading-snug mt-0.5">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Security advisory box */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <ShieldCheck className="w-4 h-4 text-[var(--color-brand-green)]" aria-hidden="true" />
            Secure Account Access
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            This step is required for all accounts provisioned with temporary credentials. Choose a strong, unique password for your programme account.
          </p>
        </div>
      </div>

      {/* Bottom row */}
      <div className="relative mt-8 pt-5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <span>Internal Enterprise System</span>
        <span className="flex items-center gap-1 text-[var(--color-brand-green)] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          Mandatory Step
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* Change Password Page                                       */
/* ─────────────────────────────────────────────────────────── */
export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'demo-success'>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const allRulesMet = DEFAULT_PASSWORD_RULES.every((r) => r.test(newPassword));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setSubmitStatus('idle');

    const newErrors: FormErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'Current or temporary password is required.';
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required.';
    } else if (!allRulesMet) {
      newErrors.newPassword = 'New password does not meet all requirements listed below.';
    } else if (newPassword === currentPassword && currentPassword) {
      newErrors.newPassword = 'New password must be different from your current password.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password.';
    } else if (newPassword && confirmPassword !== newPassword) {
      newErrors.confirmPassword = 'Passwords do not match. Please re-enter.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    // UI-only — no backend call at this milestone
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('demo-success');
    }, 850);
  };

  /* ── Demo Success State ─────────────────────────────────── */
  if (submitStatus === 'demo-success') {
    return (
      <AuthLayout
        leftPanel={<ChangePasswordBrandPanel />}
        backTo={{ to: '/login', label: 'Back to Sign In' }}
      >
        <div className="max-w-md w-full mx-auto flex flex-col items-center justify-center text-center space-y-5 py-8">
          <div className="w-14 h-14 rounded-full bg-[var(--color-brand-green-light)] border border-[#BBF7D0] flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-[var(--color-status-success)]" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-status-success)]">
              Security Verified
            </p>
            <h2 className="text-xl font-bold text-[var(--color-brand-navy)]">
              Password Updated Successfully
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-xs">
              Your password has been updated. You can now sign in using your verified credentials.
            </p>
          </div>
          <div className="pt-2 w-full space-y-3">
            <Link to="/login">
              <Button variant="primary" fullWidth rightIcon={<LogIn className="w-4 h-4" />}>
                Return to Sign In
              </Button>
            </Link>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-brand-blue)]" aria-hidden="true" />
            Security Verified · Continue to Sign In
          </p>
        </div>
      </AuthLayout>
    );
  }

  /* ── Form State ─────────────────────────────────────────── */
  return (
    <AuthLayout
      leftPanel={<ChangePasswordBrandPanel />}
      backTo={{ to: '/login', label: 'Back to Sign In' }}
    >
      <div className="max-w-md w-full mx-auto space-y-6">

        {/* Heading */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-brand-blue)] mb-0.5">
            <KeyRound className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Security Update</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-brand-navy)]">
            Change Your Password
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            For security, please replace your temporary password before continuing to your workspace.
          </p>
        </div>

        {/* General form error alert */}
        {formError && (
          <Alert variant="error" title="Password Update Error" onClose={() => setFormError(null)}>
            {formError}
          </Alert>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5"
          aria-label="Change password form"
        >
          {/* Current / Temporary Password */}
          <Input
            id="change-current-password"
            label="Current or Temporary Password"
            placeholder="Enter your current or temporary password"
            type="password"
            required
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => { setCurrentPassword(e.target.value); clearFieldError('currentPassword'); }}
            error={errors.currentPassword}
            leftIcon={<Lock className="w-4 h-4" aria-hidden="true" />}
            disabled={isSubmitting}
          />

          {/* Divider with visual separation hint */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[var(--color-border-subtle)]" />
            <span className="text-[11px] font-medium text-[var(--color-text-muted)] whitespace-nowrap">
              Create new password
            </span>
            <div className="flex-1 h-px bg-[var(--color-border-subtle)]" />
          </div>

          {/* New Password */}
          <Input
            id="change-new-password"
            label="New Password"
            placeholder="Create a strong new password"
            type="password"
            required
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => { setNewPassword(e.target.value); clearFieldError('newPassword'); }}
            error={errors.newPassword}
            leftIcon={<Lock className="w-4 h-4" aria-hidden="true" />}
            disabled={isSubmitting}
          />

          {/* Shared PasswordRequirements panel */}
          <PasswordRequirements password={newPassword} />

          {/* Confirm New Password */}
          <Input
            id="change-confirm-password"
            label="Confirm New Password"
            placeholder="Re-enter your new password"
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError('confirmPassword'); }}
            error={errors.confirmPassword}
            helperText={
              !errors.confirmPassword && confirmPassword && confirmPassword === newPassword
                ? '✓ Passwords match'
                : undefined
            }
            leftIcon={<Lock className="w-4 h-4" aria-hidden="true" />}
            disabled={isSubmitting}
          />

          {/* Submit */}
          <div className="pt-1">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              rightIcon={!isSubmitting ? <ArrowRight className="w-4 h-4" /> : undefined}
            >
              {isSubmitting ? 'Updating Password…' : 'Update Password & Continue'}
            </Button>
          </div>
        </form>

        {/* Back to Sign In */}
        <div className="text-center pt-1">
          <p className="text-xs text-[var(--color-text-secondary)]">
            Remember your credentials?{' '}
            <Link
              to="/login"
              className="font-semibold text-[var(--color-brand-blue)] hover:underline focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-brand-blue)]/30 rounded"
            >
              Back to Sign In
            </Link>
          </p>
        </div>

        {/* Security footnote */}
        <p className="text-xs text-[var(--color-text-secondary)] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-brand-blue)] shrink-0" aria-hidden="true" />
          <span>Authorized accounts only · No credentials stored in browser</span>
        </p>
      </div>
    </AuthLayout>
  );
}
