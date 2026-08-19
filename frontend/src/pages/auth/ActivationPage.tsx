import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Badge, PasswordRequirements, DEFAULT_PASSWORD_RULES, BrandLogo } from '../../components/common';
import { AuthLayout } from '../../components/layout/AuthLayout';
import {
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  LogIn,
  UserCheck,
  Lock,
} from 'lucide-react';

/* ── Types ─────────────────────────────────────────────── */
interface FormErrors {
  newPassword?: string;
  confirmPassword?: string;
}

/* ── Left Brand / Context Panel ────────────────────────── */
function ActivationBrandPanel() {
  const steps = [
    { label: 'Account created by Administrator', done: true },
    { label: 'Activation link or credentials sent', done: true },
    { label: 'Set your password', active: true },
    { label: 'Sign in to your workspace', done: false },
  ];

  return (
    <div className="bg-[var(--color-brand-navy)] px-8 py-10 sm:px-10 sm:py-12 text-white flex flex-col justify-between h-full relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute -top-12 -right-12 w-52 h-52 bg-[var(--color-brand-blue)]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-[var(--color-brand-green)]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative space-y-7">
        {/* Product emblem */}
        <BrandLogo theme="dark" size="md" />

        {/* Context */}
        <div className="space-y-3">
          <Badge variant="blue" dot size="sm" className="bg-white/10 text-blue-200 border-white/15">
            First-Time Access
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug">
            One final step before accessing your workspace.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Your account has been configured by the system administrator. Set a secure password to complete the activation process.
          </p>
        </div>

        {/* Activation progress steps */}
        <div className="space-y-1 pt-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Activation Progress
          </p>
          <ol className="space-y-3" aria-label="Activation steps">
            {steps.map((step, idx) => {
              const isDone = step.done;
              const isActive = step.active;
              return (
                <li key={step.label} className="flex items-start gap-3">
                  <div
                    className={[
                      'w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold',
                      isDone
                        ? 'bg-[var(--color-brand-green)] text-white'
                        : isActive
                          ? 'bg-[var(--color-brand-blue)] text-white ring-2 ring-white/20'
                          : 'bg-white/10 text-slate-400',
                    ].join(' ')}
                    aria-hidden="true"
                  >
                    {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <span
                    className={[
                      'text-xs leading-snug pt-0.5',
                      isDone
                        ? 'text-[var(--color-brand-green)] font-medium line-through decoration-[var(--color-brand-green)]/50'
                        : isActive
                          ? 'text-white font-semibold'
                          : 'text-slate-400',
                    ].join(' ')}
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Security note */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <ShieldCheck className="w-4 h-4 text-[var(--color-brand-green)]" aria-hidden="true" />
            Secure Account Setup
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Once activated, use the Sign In portal with your email and new password. Your role and workspace will be assigned automatically.
          </p>
        </div>
      </div>

      {/* Bottom row */}
      <div className="relative mt-8 pt-5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <span>Internal Enterprise System</span>
        <span className="flex items-center gap-1 text-[var(--color-brand-green)] font-semibold">
          <UserCheck className="w-3.5 h-3.5" />
          Admin Provisioned
        </span>
      </div>
    </div>
  );
}

/* ── Activation Page ────────────────────────────────────── */
export default function ActivationPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'demo-success'>('idle');

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const allRulesMet = DEFAULT_PASSWORD_RULES.every((r) => r.test(newPassword));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus('idle');

    const newErrors: FormErrors = {};
    if (!newPassword) {
      newErrors.newPassword = 'New password is required.';
    } else if (!allRulesMet) {
      newErrors.newPassword = 'Password does not meet all requirements listed below.';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password.';
    } else if (newPassword && confirmPassword !== newPassword) {
      newErrors.confirmPassword = 'Passwords do not match. Please re-enter.';
    }

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setErrors({});
    setIsSubmitting(true);
    // UI-only — no backend call at this milestone
    setTimeout(() => { setIsSubmitting(false); setSubmitStatus('demo-success'); }, 800);
  };

  if (submitStatus === 'demo-success') {
    return (
      <AuthLayout leftPanel={<ActivationBrandPanel />} backTo={{ to: '/login', label: 'Back to Sign In' }}>
        <div className="max-w-md w-full mx-auto flex flex-col items-center justify-center text-center space-y-5 py-8">
          <div className="w-14 h-14 rounded-full bg-[var(--color-brand-green-light)] border border-[#BBF7D0] flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-[var(--color-status-success)]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[var(--color-brand-navy)]">Password Setup Verified</h2>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-xs">
              Password setup form is ready for backend integration. Activation will complete after the authentication API is connected.
            </p>
          </div>
          <div className="pt-2 w-full">
            <Link to="/login">
              <Button variant="primary" fullWidth rightIcon={<LogIn className="w-4 h-4" />}>
                Continue to Sign In
              </Button>
            </Link>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-brand-blue)]" aria-hidden="true" />
            UI milestone only · No backend session created
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout leftPanel={<ActivationBrandPanel />} backTo={{ to: '/login', label: 'Back to Sign In' }}>
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Heading */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-brand-blue)] mb-0.5">
            <KeyRound className="w-3.5 h-3.5" aria-hidden="true" />
            <span>First-Time Access</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-brand-navy)]">
            Activate Your Account
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Your programme account has been created by the system administrator. Set your password to complete account activation.
          </p>
        </div>

        {/* Account context banner */}
        <div className="p-4 rounded-xl bg-[var(--color-brand-blue-light)] border border-[#BFDBFE] flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--color-brand-blue)]/15 border border-[#BFDBFE] flex items-center justify-center shrink-0 text-[var(--color-brand-blue)]">
            <UserCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-0.5 text-xs">
            <p className="font-semibold text-[var(--color-brand-blue)]">Account ready for activation</p>
            <p className="text-[var(--color-brand-blue)]/75 leading-relaxed">
              Your account details (name, email, and role) have been configured by your administrator. You only need to set your password.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-label="Account activation form">
          <Input
            id="activate-new-password"
            label="New Password"
            placeholder="Create a secure password"
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

          <Input
            id="activate-confirm-password"
            label="Confirm New Password"
            placeholder="Re-enter your password"
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

          <div className="pt-1">
            <Button
              type="submit"
              variant="green"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              rightIcon={!isSubmitting ? <ArrowRight className="w-4 h-4" /> : undefined}
            >
              {isSubmitting ? 'Activating Account…' : 'Activate Account'}
            </Button>
          </div>
        </form>

        {/* Back link */}
        <div className="text-center pt-1">
          <p className="text-xs text-[var(--color-text-secondary)]">
            Already have your credentials?{' '}
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
          <span>Authorized programme accounts only · Secure enterprise access</span>
        </p>
      </div>
    </AuthLayout>
  );
}
