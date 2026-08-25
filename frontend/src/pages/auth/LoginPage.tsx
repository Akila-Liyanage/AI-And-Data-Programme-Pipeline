import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button, Input, Alert, Badge } from '../../components/common';
import { AuthLayout } from '../../components/layout/AuthLayout';
import {
  ArrowRight,
  ArrowLeft,
  Smartphone,
  KeyRound,
  FolderKanban,
  Users,
  ShieldCheck,
  CheckCircle2,
  Activity,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

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
            Instant Phone OTP Access
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug">
            Passwordless, high-security phone authentication for programme leaders.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Enter your authorized mobile phone number to receive a secure one-time verification code.
          </p>
        </div>

        {/* Supporting points */}
        <div className="space-y-4 pt-1">
          {[
            {
              icon: <Smartphone className="w-4 h-4" />,
              color: 'text-[var(--color-brand-blue-light)]',
              label: 'Passwordless One-Time Password (OTP)',
              detail: 'No password to remember — instant SMS/OTP login directly linked to your phone.',
            },
            {
              icon: <FolderKanban className="w-4 h-4" />,
              color: 'text-[var(--color-brand-green)]',
              label: 'Centralized project visibility',
              detail: 'Track all programme activities and milestones in one secure place.',
            },
            {
              icon: <Users className="w-4 h-4" />,
              color: 'text-[var(--color-brand-blue-light)]',
              label: 'Role-based authorization',
              detail: 'Tailored workspace for Administrators, Permanent Staff, and Interns.',
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

        {/* Mini stats */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[var(--color-brand-green)]" />
              Programme Activity
            </span>
            <span className="text-[var(--color-brand-green)] font-semibold">Live & Secured</span>
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
          OTP Secured
        </span>
      </div>
    </div>
  );
}

/* ── Main Login Page Component ─────────────────────────── */
export default function LoginPage() {
  const { sendOtp, verifyOtp, isAuthenticated, user, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  // Authentication Step: 1 = Enter Phone, 2 = Enter OTP
  const [step, setStep] = useState<1 | 2>(1);
  const [phoneNumber, setPhoneNumber] = useState('0774943291'); // Default to Admin phone
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [receivedOtp, setReceivedOtp] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // If already authenticated, redirect to the appropriate dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'PERMANENT_STAFF') {
        navigate('/staff/dashboard', { replace: true });
      } else if (user.role === 'INTERN') {
        navigate('/intern/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Resend OTP countdown timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  /**
   * Handle Step 1: Send OTP
   */
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPhoneError(null);
    setStatusNotice(null);
    clearError();

    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone) {
      setPhoneError('Please enter your mobile phone number.');
      return;
    }

    if (cleanPhone.length < 9) {
      setPhoneError('Please enter a valid phone number (e.g. 0774943291).');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await sendOtp(cleanPhone);
      setReceivedOtp(response.debugOtp || null);
      setStep(2);
      setResendTimer(30); // 30s cooldown
      // Reset OTP inputs
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send OTP.';
      setPhoneError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle OTP input changes with auto-focus across 6 boxes
   */
  const handleOtpDigitChange = (index: number, value: string) => {
    setStatusNotice(null);
    // Allow single digit
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    // Auto move to next input
    if (digit && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  /**
   * Handle OTP backspace navigation
   */
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  /**
   * Handle Paste of full 6-digit OTP
   */
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length > 0) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pastedData[i] || '';
      }
      setOtpDigits(newDigits);
      const nextFocus = Math.min(pastedData.length, 5);
      otpInputsRef.current[nextFocus]?.focus();
    }
  };

  /**
   * Auto-fill OTP when user clicks the demo helper banner
   */
  const handleAutofillOtp = (otp: string) => {
    const digits = otp.split('').slice(0, 6);
    setOtpDigits(digits);
    setStatusNotice(null);
    otpInputsRef.current[5]?.focus();
  };

  /**
   * Handle Step 2: Verify OTP
   */
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusNotice(null);
    clearError();

    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setStatusNotice('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const loggedUser = await verifyOtp(phoneNumber.trim(), fullOtp);
      // Role-Based Navigation
      if (loggedUser.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (loggedUser.role === 'PERMANENT_STAFF') {
        navigate('/staff/dashboard');
      } else if (loggedUser.role === 'INTERN') {
        navigate('/intern/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid or expired OTP code.';
      setStatusNotice(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout leftPanel={<LoginBrandPanel />} backTo={{ to: '/', label: 'Back to Home' }}>
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Header Badge & Title */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-brand-blue)] mb-0.5">
            {step === 1 ? (
              <>
                <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Phone OTP Verification</span>
              </>
            ) : (
              <>
                <KeyRound className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Enter Security Code</span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-brand-navy)]">
            {step === 1 ? 'Sign In with Phone' : 'Verify Code'}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {step === 1
              ? 'Enter your registered phone number to receive a secure OTP.'
              : `We sent a 6-digit verification code to ${phoneNumber}.`}
          </p>
        </div>

        {/* Status / Error alert */}
        {(statusNotice || authError || phoneError) && (
          <Alert
            variant="error"
            title="Authentication Error"
            onClose={() => {
              setStatusNotice(null);
              setPhoneError(null);
              clearError();
            }}
          >
            {statusNotice || authError || phoneError}
          </Alert>
        )}

        {/* STEP 1: PHONE NUMBER INPUT FORM */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} noValidate className="space-y-5" aria-label="Phone number login form">
            <Input
              id="login-phone"
              label="Mobile Phone Number"
              placeholder="e.g. 0774943291"
              type="tel"
              required
              autoFocus
              autoComplete="tel"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setPhoneError(null);
              }}
              error={phoneError || undefined}
              leftIcon={<Smartphone className="w-4 h-4 text-slate-500" aria-hidden="true" />}
              disabled={isSubmitting}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              rightIcon={!isSubmitting ? <ArrowRight className="w-4 h-4" /> : undefined}
            >
              {isSubmitting ? 'Sending OTP Code…' : 'Send Verification OTP'}
            </Button>

            {/* Quick Demo Selector Chips */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-brand-navy)]">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--color-brand-blue)]" />
                  Select Quick Demo Account:
                </span>
                <Badge size="sm" variant="blue">Instant Test</Badge>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPhoneNumber('0774943291');
                    setPhoneError(null);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs border text-left transition-all ${phoneNumber === '0774943291'
                      ? 'bg-blue-50 border-[var(--color-brand-blue)] text-[var(--color-brand-blue)] font-semibold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span><strong>0774943291</strong> — Admin (Akila Liyanage)</span>
                  </div>
                  <Badge size="sm" variant="blue">Admin</Badge>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPhoneNumber('0771234567');
                    setPhoneError(null);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs border text-left transition-all ${phoneNumber === '0771234567'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span><strong>0771234567</strong> — Staff (Dr. Kasun)</span>
                  </div>
                  <Badge size="sm" variant="success">Staff</Badge>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPhoneNumber('0777654321');
                    setPhoneError(null);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs border text-left transition-all ${phoneNumber === '0777654321'
                      ? 'bg-purple-50 border-purple-500 text-purple-700 font-semibold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                    <span><strong>0777654321</strong> — Intern (Ayuni Sliit)</span>
                  </div>
                  <Badge size="sm" variant="neutral">Intern</Badge>
                </button>
              </div>
            </div>

            {/* Create Account section */}
            <div className="pt-5 border-t border-[var(--color-border-subtle)] text-center space-y-2">
              <p className="text-xs text-[var(--color-text-secondary)] font-medium">
                New to the programme?
              </p>
              <Link
                to="/register"
                className="inline-block text-sm font-bold text-[var(--color-brand-blue)] hover:underline transition-all"
              >
                Create Account
              </Link>
              <p className="text-[10px] text-[var(--color-text-secondary)] max-w-xs mx-auto leading-relaxed">
                Registration is available for Staff and Intern users. New accounts require administrator verification before system access.
              </p>
            </div>
          </form>
        )}

        {/* STEP 2: 6-DIGIT OTP VERIFICATION FORM */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} noValidate className="space-y-5" aria-label="OTP verification form">
            {/* Phone Info & Change button */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Smartphone className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <span>Code sent to: <strong>{phoneNumber}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setReceivedOtp(null);
                }}
                className="text-[var(--color-brand-blue)] font-semibold hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" /> Change
              </button>
            </div>

            {/* Received OTP Simulation Helper Box */}
            {receivedOtp && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Simulated SMS Delivery:
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-200 text-amber-800">
                    Live Demo
                  </span>
                </div>
                <p className="text-xs text-amber-800">
                  Your verification code is: <strong className="font-mono text-sm tracking-wider bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-950">{receivedOtp}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => handleAutofillOtp(receivedOtp)}
                  className="text-xs text-amber-900 font-bold underline hover:text-amber-950 pt-0.5 inline-block cursor-pointer"
                >
                  Click here to auto-fill code →
                </button>
              </div>
            )}

            {/* 6-Digit Boxes */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[var(--color-brand-navy)] text-center">
                Enter 6-Digit Verification Code
              </label>
              <div className="flex justify-between gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { otpInputsRef.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono rounded-xl border border-slate-300 focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 outline-none transition-all bg-white shadow-xs"
                    disabled={isSubmitting}
                  />
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3 pt-2">
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

              {/* Resend button */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="hover:text-slate-800 transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Phone Input
                </button>

                <button
                  type="button"
                  onClick={() => handleSendOtp()}
                  disabled={resendTimer > 0 || isSubmitting}
                  className={`font-semibold flex items-center gap-1 ${resendTimer > 0
                      ? 'text-slate-400 cursor-not-allowed'
                      : 'text-[var(--color-brand-blue)] hover:underline cursor-pointer'
                    }`}
                >
                  <RefreshCw className={`w-3 h-3 ${resendTimer > 0 ? '' : 'hover:rotate-180 transition-transform'}`} />
                  {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Code'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Security footnote */}
        <p className="text-xs text-[var(--color-text-secondary)] flex items-center justify-center gap-1.5 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-brand-blue)] shrink-0" aria-hidden="true" />
          <span>Strictly authorized internal system access · AI & Data Pipeline</span>
        </p>
      </div>
    </AuthLayout>
  );
}
