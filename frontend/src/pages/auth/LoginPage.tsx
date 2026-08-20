import React, { useState, useEffect } from 'react';
import { Button, Alert, Badge, BrandLogo, OtpInput } from '../../components/common';
import { AuthLayout } from '../../components/layout/AuthLayout';
import {
  ArrowRight,
  Phone,
  ShieldCheck,
  CheckCircle2,
  FolderKanban,
  Users,
  KeyRound,
  RotateCcw,
  Clock,
  ArrowLeft,
} from 'lucide-react';

/* ── Types ─────────────────────────────────────────────── */
type LoginStep = 'phone' | 'otp';

interface FormErrors {
  phoneNumber?: string;
  otp?: string;
}

/* ── Left Brand Panel ──────────────────────────────────── */
function LoginBrandPanel() {
  return (
    <div className="bg-[var(--color-brand-navy)] px-8 py-10 sm:px-10 sm:py-12 text-white flex flex-col justify-between h-full relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute -top-12 -right-12 w-52 h-52 bg-[var(--color-brand-blue)]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-[var(--color-brand-green)]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative space-y-7">
        {/* SLT-MOBITEL Emblem & Title */}
        <BrandLogo theme="dark" size="md" />

        <div className="space-y-3">
          <Badge variant="blue" dot size="sm" className="bg-white/10 text-blue-200 border-white/15">
            Verified Mobile Access
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug">
            One secure workspace for projects, assignments and programme progress.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Unified portal for Administrators, Permanent Staff, and Interns — authenticated securely via registered mobile verification.
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
              icon: <KeyRound className="w-4 h-4" />,
              color: 'text-[var(--color-brand-green)]',
              label: 'Registered mobile verification',
              detail: 'Fast, secure passwordless sign-in via verified SMS code.',
            },
            {
              icon: <Users className="w-4 h-4" />,
              color: 'text-[var(--color-brand-blue-light)]',
              label: 'Role-based workspace access',
              detail: 'Contextual dashboard views tailored to your programme responsibilities.',
            },
            {
              icon: <ShieldCheck className="w-4 h-4" />,
              color: 'text-[var(--color-brand-green)]',
              label: 'Admin-provisioned accounts',
              detail: 'Strictly governed internal enterprise system.',
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

        {/* Information box */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <ShieldCheck className="w-4 h-4 text-[var(--color-brand-green)]" aria-hidden="true" />
            Enterprise Mobile Authentication
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Accounts are provisioned by Programme Administrators. Enter your registered phone number to receive your sign-in verification code.
          </p>
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
  const [step, setStep] = useState<LoginStep>('phone');
  const [rawPhone, setRawPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusNotice, setStatusNotice] = useState<{
    type: 'info' | 'error' | 'success';
    title: string;
    message: string;
  } | null>(null);

  // Resend Countdown Timer (Visual presentation)
  const [countdown, setCountdown] = useState<number>(45);
  const [canResend, setCanResend] = useState<boolean>(false);

  useEffect(() => {
    let timer: number | undefined;
    if (step === 'otp' && countdown > 0) {
      timer = window.setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, countdown]);

  /**
   * Helper: Format phone number into clean display string
   */
  const formatPhoneNumberInput = (input: string) => {
    // Keep only digits
    const digitsOnly = input.replace(/\D/g, '');
    // If starts with '0', remove the leading '0' for +94 format
    const normalized = digitsOnly.startsWith('0') ? digitsOnly.slice(1) : digitsOnly;
    return normalized.slice(0, 9);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumberInput(e.target.value);
    setRawPhone(formatted);
    if (errors.phoneNumber) {
      setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
    }
  };

  /**
   * Helper: Mask the phone number for Step 2 display (e.g. +94 77 ••• ••89)
   */
  const getMaskedPhoneNumber = () => {
    if (rawPhone.length >= 9) {
      const prefix = rawPhone.slice(0, 2);
      const suffix = rawPhone.slice(-2);
      return `+94 ${prefix} ••• ••${suffix}`;
    }
    return `+94 ${rawPhone}`;
  };

  /**
   * Step 1: Handle Send Verification Code Action
   */
  const handleRequestOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusNotice(null);

    // Client-side format validation only (must be 9 digits for Sri Lankan mobile excluding country code)
    if (!rawPhone || rawPhone.length < 9) {
      setErrors({
        phoneNumber: 'Please enter a valid 9-digit mobile number (e.g. 77 123 4567).',
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Transition to OTP step with explicit "Awaiting backend integration" notice
    // Note: No fake API or mock OTP is generated.
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp');
      setCountdown(45);
      setCanResend(false);
      setStatusNotice({
        type: 'info',
        title: 'Awaiting backend integration',
        message: 'The frontend OTP interface is ready. Real SMS dispatch will be triggered once the backend SMS gateway endpoint is connected.',
      });
    }, 400);
  };

  /**
   * Step 2: Handle OTP Verification Action
   */
  const handleVerifyOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusNotice(null);

    // Client-side format validation for 6-digit code
    if (!otp || otp.length < 6) {
      setErrors({
        otp: 'Please enter the complete 6-digit verification code.',
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Present action as frontend-ready awaiting real backend verification
    // Note: No fake JWT token or mock user role is created.
    setTimeout(() => {
      setIsSubmitting(false);
      setStatusNotice({
        type: 'info',
        title: 'Awaiting backend integration',
        message: 'OTP verification interface is verified. Real session generation and role-based redirect will activate once backend authentication API is integrated.',
      });
    }, 400);
  };

  /**
   * Switch back to phone entry step
   */
  const handleChangePhoneNumber = () => {
    setStep('phone');
    setOtp('');
    setErrors({});
    setStatusNotice(null);
  };

  /**
   * Visual Resend Action (Does not trigger fake API)
   */
  const handleResendOtp = () => {
    if (!canResend) return;
    setCountdown(45);
    setCanResend(false);
    setStatusNotice({
      type: 'info',
      title: 'Awaiting backend integration',
      message: 'Resend request triggered in UI. Real SMS re-dispatch will be handled by the backend API.',
    });
  };

  return (
    <AuthLayout leftPanel={<LoginBrandPanel />} backTo={{ to: '/', label: 'Back to Home' }}>
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Status / Error / Integration alert */}
        {statusNotice && (
          <Alert
            variant={statusNotice.type}
            title={statusNotice.title}
            onClose={() => setStatusNotice(null)}
          >
            {statusNotice.message}
          </Alert>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* STEP 1: PHONE NUMBER ENTRY                                 */}
        {/* ────────────────────────────────────────────────────────── */}
        {step === 'phone' && (
          <div className="space-y-6">
            {/* Heading */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-brand-blue)] mb-0.5">
                <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Authorized Mobile Sign In</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-brand-navy)]">
                Welcome Back
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Sign in using the mobile number registered with your programme account.
              </p>
            </div>

            {/* Phone Form */}
            <form onSubmit={handleRequestOtp} noValidate className="space-y-5" aria-label="Phone number sign in form">
              <div className="space-y-1.5">
                <label
                  htmlFor="login-phone"
                  className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1 select-none"
                >
                  <span>Registered Mobile Number</span>
                  <span className="text-[var(--color-status-error)]" aria-hidden="true">
                    *
                  </span>
                </label>

                {/* Country Code + Phone Input Group */}
                <div
                  className={`flex items-center h-10 w-full rounded-lg border bg-[var(--color-surface-white)] transition-all duration-150 ease-in-out shadow-2xs overflow-hidden ${
                    errors.phoneNumber
                      ? 'border-[var(--color-status-error)] ring-2 ring-[var(--color-status-error)]/20'
                      : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] focus-within:border-[var(--color-brand-blue)] focus-within:ring-2 focus-within:ring-[var(--color-brand-blue)]/20'
                  }`}
                >
                  {/* Fixed Country Code Badge */}
                  <div
                    className="h-full px-3 bg-[var(--color-surface-subtle)] border-r border-[var(--color-border-subtle)] flex items-center gap-1.5 text-xs font-bold text-[var(--color-brand-navy)] select-none shrink-0"
                    aria-label="Country code: Sri Lanka (+94)"
                  >
                    <span className="text-sm" aria-hidden="true">🇱🇰</span>
                    <span>+94</span>
                  </div>

                  {/* Number Input */}
                  <input
                    id="login-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    required
                    placeholder="77 123 4567"
                    disabled={isSubmitting}
                    value={rawPhone}
                    onChange={handlePhoneChange}
                    aria-invalid={Boolean(errors.phoneNumber)}
                    aria-describedby={errors.phoneNumber ? 'login-phone-error' : 'login-phone-helper'}
                    className="h-full flex-1 px-3.5 text-sm bg-transparent text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-hidden font-medium tracking-wide"
                  />
                </div>

                {errors.phoneNumber ? (
                  <p id="login-phone-error" className="text-xs text-[var(--color-status-error)] font-medium mt-1">
                    {errors.phoneNumber}
                  </p>
                ) : (
                  <p id="login-phone-helper" className="text-xs text-[var(--color-text-secondary)] mt-1">
                    Use the mobile number registered by your system administrator.
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isSubmitting}
                  rightIcon={!isSubmitting ? <ArrowRight className="w-4 h-4" /> : undefined}
                >
                  {isSubmitting ? 'Requesting Code…' : 'Send Verification Code'}
                </Button>
              </div>
            </form>

            {/* Security Footnote */}
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-brand-blue)] shrink-0" aria-hidden="true" />
              <span>Authorized programme accounts only · Secure mobile verification</span>
            </p>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* STEP 2: OTP VERIFICATION ENTRY                             */}
        {/* ────────────────────────────────────────────────────────── */}
        {step === 'otp' && (
          <div className="space-y-6">
            {/* Heading */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-brand-blue)] mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Secure Verification</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-brand-navy)]">
                Verify Your Number
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Enter the 6-digit verification code sent to your registered mobile number.
              </p>
            </div>

            {/* Masked Phone Display & Change Action */}
            <div className="p-3.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-blue-light)] text-[var(--color-brand-blue)] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-[var(--color-text-secondary)] font-medium">Verification sent to</p>
                  <p className="text-xs font-bold text-[var(--color-brand-navy)] tracking-wide font-mono truncate">
                    {getMaskedPhoneNumber()}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleChangePhoneNumber}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue-hover)] hover:underline focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-brand-blue)]/30 rounded px-1.5 py-1 cursor-pointer transition-colors"
                aria-label="Change mobile phone number"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Change</span>
              </button>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleVerifyOtp} noValidate className="space-y-5" aria-label="OTP verification form">
              <div className="space-y-2">
                <label
                  htmlFor="otp-verification-input"
                  className="text-xs font-medium text-[var(--color-text-primary)] flex items-center justify-between select-none"
                >
                  <span className="flex items-center gap-1">
                    <span>Verification Code</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">
                      *
                    </span>
                  </span>
                  <span className="text-[11px] text-[var(--color-text-muted)]">6 Digits</span>
                </label>

                {/* Segmented 6-Box OTP Input */}
                <OtpInput
                  id="otp-verification-input"
                  value={otp}
                  onChange={(val: string) => {
                    setOtp(val);
                    if (errors.otp) setErrors((prev) => ({ ...prev, otp: undefined }));
                  }}
                  length={6}
                  disabled={isSubmitting}
                  hasError={Boolean(errors.otp)}
                  aria-describedby={errors.otp ? 'otp-input-error' : undefined}
                />

                {errors.otp && (
                  <p id="otp-input-error" className="text-xs text-[var(--color-status-error)] font-medium mt-1">
                    {errors.otp}
                  </p>
                )}
              </div>

              {/* Resend Code Section */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs pt-1">
                <span className="text-[var(--color-text-secondary)]">Didn't receive the code?</span>

                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="inline-flex items-center gap-1.5 font-semibold text-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue-hover)] hover:underline focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-brand-blue)]/30 rounded cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resend Verification Code</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[var(--color-text-muted)] font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Resend code in {String(countdown).padStart(2, '0')}s</span>
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isSubmitting}
                  rightIcon={!isSubmitting ? <ArrowRight className="w-4 h-4" /> : undefined}
                >
                  {isSubmitting ? 'Verifying Code…' : 'Verify & Sign In'}
                </Button>
              </div>
            </form>

            {/* Back to Phone Entry */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleChangePhoneNumber}
                className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-brand-navy)] inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Return to phone number entry</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
