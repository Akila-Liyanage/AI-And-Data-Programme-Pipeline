import React, { useState } from 'react';
import { Button, Input, Alert, Badge } from '../../components/common';
import { AuthLayout } from '../../components/layout/AuthLayout';
import {
  ArrowRight,
  User,
  Lock,
  FolderKanban,
  Users,
  ShieldCheck,
  Info,
  CheckCircle2,
  Activity,
} from 'lucide-react';

/* ── Types ─────────────────────────────────────────────── */
interface FormErrors {
  identifier?: string;
  password?: string;
}

/* ── Left Brand Panel ──────────────────────────────────── */
function LoginBrandPanel() {
  return (
    <div className="bg-[var(--color-brand-navy)] px-8 py-10 sm:px-10 sm:py-12 text-white flex flex-col justify-between h-full relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute -top-12 -right-12 w-52 h-52 bg-[var(--color-brand-blue)]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-[var(--color-brand-green)]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative space-y-7">
        {/* Product emblem */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center font-bold text-sm shrink-0">
            <span className="text-[var(--color-brand-blue-light)]">AI</span>
            <span className="text-[var(--color-brand-green)] font-extrabold">+</span>
          </div>
          <div>
            <p className="font-bold text-sm tracking-tight text-white leading-tight">
              AI & Data Programme Pipeline
            </p>
            <p className="text-[11px] text-slate-300 leading-tight">
              Staff & Intern Progress Dashboard
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Badge variant="blue" dot size="sm" className="bg-white/10 text-blue-200 border-white/15">
            Single Combined Portal
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug">
            One secure workspace for projects, assignments and programme progress.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Unified dashboard for Administrators, Permanent Staff, and Interns — all through one authorized portal.
          </p>
        </div>

        {/* Supporting points */}
        <div className="space-y-4 pt-1">
          {[
            {
              icon: <FolderKanban className="w-4 h-4" />,
              color: 'text-[var(--color-brand-blue-light)]',
              label: 'Centralized project visibility',
              detail: 'Track all programme activities and milestones in one place.',
            },
            {
              icon: <Users className="w-4 h-4" />,
              color: 'text-[var(--color-brand-green)]',
              label: 'Role-based workspace access',
              detail: 'Contextual views tailored to your programme responsibilities.',
            },
            {
              icon: <ShieldCheck className="w-4 h-4" />,
              color: 'text-[var(--color-brand-blue-light)]',
              label: 'Secure programme collaboration',
              detail: 'Strictly governed internal enterprise system.',
            },
          ].map(({ icon, color, label, detail }) => (
            <div key={label} className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 ${color}`} aria-hidden="true">
                {icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-xs text-slate-400 leading-snug mt-0.5">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Abstract mini data visual */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[var(--color-brand-green)]" />
              Programme Activity
            </span>
            <span className="text-[var(--color-brand-green)] font-semibold">Live</span>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Active Projects', value: '82%', color: 'bg-[var(--color-brand-green)]', width: 'w-[82%]' },
              { label: 'Assignments Complete', value: '64%', color: 'bg-[var(--color-brand-blue)]', width: 'w-[64%]' },
              { label: 'Intern Progress', value: '71%', color: 'bg-blue-300', width: 'w-[71%]' },
            ].map(({ label, value, color, width }) => (
              <div key={label}>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>{label}</span>
                  <span className="text-slate-200 font-medium">{value}</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${color} ${width}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="relative mt-8 pt-5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <span>Internal Enterprise System</span>
        <span className="flex items-center gap-1 text-[var(--color-brand-green)] font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Verified Access
        </span>
      </div>
    </div>
  );
}

/* ── Login Page ────────────────────────────────────────── */
export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusNotice(null);

    const newErrors: FormErrors = {};
    if (!identifier.trim()) newErrors.identifier = 'Email or User ID is required.';
    if (!password) newErrors.password = 'Password is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    // UI-only — no backend call at this milestone
    setTimeout(() => {
      setIsSubmitting(false);
      setStatusNotice(
        'Form interface verified. Backend authentication and role-based redirect will be connected in the upcoming milestone.'
      );
    }, 700);
  };

  return (
    <AuthLayout leftPanel={<LoginBrandPanel />} backTo={{ to: '/', label: 'Back to Home' }}>
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Heading */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-brand-blue)] mb-0.5">
            <Lock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Authorized Sign In</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-brand-navy)]">
            Welcome Back
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Sign in to access the AI & Data Programme Pipeline.
          </p>
        </div>

        {/* Status alert */}
        {statusNotice && (
          <Alert variant="info" title="Interface Status" onClose={() => setStatusNotice(null)}>
            {statusNotice}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-label="Sign in form">
          <Input
            id="login-identifier"
            label="Email or User ID"
            placeholder="name@company.com or User ID"
            type="text"
            required
            autoComplete="username"
            value={identifier}
            onChange={(e) => { setIdentifier(e.target.value); clearFieldError('identifier'); }}
            error={errors.identifier}
            leftIcon={<User className="w-4 h-4" aria-hidden="true" />}
            disabled={isSubmitting}
          />

          <Input
            id="login-password"
            label="Password"
            placeholder="Enter your password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); clearFieldError('password'); }}
            error={errors.password}
            leftIcon={<Lock className="w-4 h-4" aria-hidden="true" />}
            disabled={isSubmitting}
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              rightIcon={!isSubmitting ? <ArrowRight className="w-4 h-4" /> : undefined}
            >
              {isSubmitting ? 'Signing In…' : 'Sign In'}
            </Button>
          </div>
        </form>

        {/* First-time access info */}
        <div className="p-4 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)]">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[var(--color-brand-blue)] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[var(--color-brand-navy)]">
                First time accessing the platform?
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Use the activation link or temporary credentials sent to your registered email by the system administrator.
              </p>
            </div>
          </div>
        </div>

        {/* Security footnote */}
        <p className="text-xs text-[var(--color-text-secondary)] flex items-center justify-center gap-1.5 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-brand-blue)] shrink-0" aria-hidden="true" />
          <span>Authorized users only · Secure enterprise access</span>
        </p>
      </div>
    </AuthLayout>
  );
}
