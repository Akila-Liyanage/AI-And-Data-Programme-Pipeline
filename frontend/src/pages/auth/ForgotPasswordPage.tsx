import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, BrandLogo } from '../../components/common';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { useAuth } from '../../hooks/useAuth';
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
  Building,
  GraduationCap,
  ShieldCheck,
  Check,
  X,
  Clock,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────── */
/* Left Supporting Panel                                      */
/* ─────────────────────────────────────────────────────────── */
function ForgotPasswordBrandPanel() {
  return (
    <div className="bg-[var(--color-brand-navy)] px-8 py-10 sm:px-10 sm:py-12 text-white flex flex-col justify-between h-full relative overflow-hidden">
      {/* Ambient decorative glows */}
      <div className="absolute -top-12 -right-12 w-52 h-52 bg-[var(--color-brand-blue)]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-[var(--color-brand-green)]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative space-y-7">
        {/* Product Emblem */}
        <BrandLogo theme="dark" size="md" />

        {/* Heading */}
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-blue-200 border border-white/15">
            <KeyRound className="w-3.5 h-3.5 text-blue-300" />
            <span>Account Recovery</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug text-white">
            Can't sign in with Mobile OTP? Recover access using your verified email.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            If your mobile device is unavailable or SMS delivery is delayed, reset your credentials instantly through your registered enterprise email address.
          </p>
        </div>

        {/* Value props */}
        <div className="space-y-4 pt-1">
          {[
            {
              icon: <Mail className="w-4 h-4" />,
              color: 'text-[var(--color-brand-blue-light)]',
              label: 'Direct Email Verification',
              detail: 'A secure 6-digit one-time passcode is dispatched directly to your registered inbox.',
            },
            {
              icon: <Lock className="w-4 h-4" />,
              color: 'text-[var(--color-brand-green)]',
              label: 'Encrypted Credential Reset',
              detail: 'Passwords are encrypted using industry-standard bcrypt hashing.',
            },
            {
              icon: <CheckCircle2 className="w-4 h-4" />,
              color: 'text-[var(--color-brand-blue-light)]',
              label: 'Immediate Workspace Access',
              detail: 'Once your password is reset, you are automatically signed in to your dashboard.',
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

        {/* Security Note Box */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <ShieldCheck className="w-4 h-4 text-[var(--color-brand-green)]" aria-hidden="true" />
            <span>Enterprise Security Guarantee</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Reset codes remain valid for 15 minutes. If you did not request this reset, your account remains secure and no action is required.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="relative mt-8 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <span>SLT-MOBITEL AI & Data Programme</span>
        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Email Verified
        </span>
      </div>
    </div>
  );
}

/* ── Main Forgot Password Page Component ───────────────── */
export default function ForgotPasswordPage() {
  const { forgotPassword, resetPassword, isAuthenticated, user, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  // Step 1 = Enter Email, Step 2 = Enter Code & New Password, Step 3 = Success
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [resetCodeDigits, setResetCodeDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [receivedCode, setReceivedCode] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState<string | null>(null);

  // New Password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  const codeInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // If already authenticated, redirect to appropriate dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'PERMANENT_STAFF' || user.role === 'STAFF') {
        navigate('/staff/dashboard', { replace: true });
      } else if (user.role === 'INTERN') {
        navigate('/intern/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Resend Countdown
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
   * Password requirements check
   */
  const passwordChecks = {
    length: newPassword.length >= 6,
    hasLetters: /[a-zA-Z]/.test(newPassword),
    hasNumbers: /\d/.test(newPassword),
    match: newPassword.length > 0 && newPassword === confirmPassword,
  };

  /**
   * Step 1: Send Reset Code to Email
   */
  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormError(null);
    clearError();

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setFormError('Please enter your registered email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setFormError('Please enter a valid email address (e.g. user@aidata.com).');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await forgotPassword(cleanEmail);
      setReceivedCode(response.debugCode || null);
      setRecipientName(response.fullName || null);
      setStep(2);
      setResendTimer(30);
      setResetCodeDigits(['', '', '', '', '', '']);
      setTimeout(() => {
        codeInputsRef.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to send password reset code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle Code Box Inputs
   */
  const handleCodeDigitChange = (index: number, value: string) => {
    setFormError(null);
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...resetCodeDigits];
    newDigits[index] = digit;
    setResetCodeDigits(newDigits);

    if (digit && index < 5) {
      codeInputsRef.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !resetCodeDigits[index] && index > 0) {
      codeInputsRef.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length > 0) {
      const newDigits = [...resetCodeDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pastedData[i] || '';
      }
      setResetCodeDigits(newDigits);
      const nextIndex = Math.min(pastedData.length, 5);
      codeInputsRef.current[nextIndex]?.focus();
    }
  };

  const handleAutoFillCode = () => {
    if (!receivedCode) return;
    const digits = receivedCode.split('').slice(0, 6);
    setResetCodeDigits(digits);
    codeInputsRef.current[5]?.focus();
  };

  /**
   * Step 2: Reset Password
   */
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    const fullCode = resetCodeDigits.join('');
    if (fullCode.length !== 6) {
      setFormError('Please enter the full 6-digit verification code.');
      return;
    }

    if (newPassword.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError('New password and confirmation do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const authenticatedUser = await resetPassword({
        email: email.trim().toLowerCase(),
        resetCode: fullCode,
        newPassword: newPassword.trim(),
      });

      setStep(3);

      // Redirect after 1.5s
      setTimeout(() => {
        if (authenticatedUser.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (authenticatedUser.role === 'PERMANENT_STAFF' || authenticatedUser.role === 'STAFF') {
          navigate('/staff/dashboard');
        } else if (authenticatedUser.role === 'INTERN') {
          navigate('/intern/dashboard');
        } else {
          navigate('/login');
        }
      }, 1500);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to reset password. Please check the code and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Quick fill demo email
   */
  const handleQuickFillEmail = (demoEmail: string) => {
    setEmail(demoEmail);
    setFormError(null);
    clearError();
    if (step === 2) {
      setStep(1);
    }
  };

  return (
    <AuthLayout leftPanel={<ForgotPasswordBrandPanel />}>
      <div className="space-y-6 max-w-xl mx-auto w-full">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[var(--color-brand-blue)] border border-blue-200 shadow-2xs">
              <Mail className="w-3.5 h-3.5" />
              Email Password Recovery
            </span>
            <span className="text-xs text-slate-500 font-medium">• Step {step} of 2</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {step === 1 && 'Reset Your Password'}
            {step === 2 && 'Enter Code & New Password'}
            {step === 3 && 'Password Reset Successful!'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {step === 1 &&
              'Enter your registered email address to receive a 6-digit password reset code.'}
            {step === 2 &&
              `We have sent a 6-digit verification code to ${email}${recipientName ? ` (${recipientName})` : ''}.`}
            {step === 3 &&
              'Your password has been securely updated. Redirecting to your workspace...'}
          </p>
        </div>

        {/* Error Alert */}
        {(formError || authError) && step !== 3 && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-start gap-2.5 shadow-2xs animate-in fade-in duration-200">
            <span className="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0" />
            <span>{formError || authError}</span>
          </div>
        )}

        {/* ── STEP 1: ENTER EMAIL ───────────────────────────────── */}
        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-4 animate-in fade-in duration-300">
            <div className="space-y-1.5">
              <label
                htmlFor="recovery-email-input"
                className="text-xs font-bold text-slate-800 flex items-center justify-between"
              >
                <span>Registered Email Address</span>
                <span className="text-[11px] text-slate-400 font-normal">e.g. admin@aidata.com</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="recovery-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@aidata.com"
                  className="w-full h-12 pl-11 pr-4 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-2xs"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              disabled={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="h-12 shadow-md hover:shadow-lg transition-all duration-200 font-bold text-sm transform hover:-translate-y-0.5"
            >
              Send Password Reset Code
            </Button>
          </form>
        )}

        {/* ── STEP 2: ENTER CODE & NEW PASSWORD ────────────────── */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-5 animate-in fade-in duration-300">
            {/* Simulated Email notification card */}
            {receivedCode && (
              <div className="p-4 rounded-2xl bg-blue-50/90 border border-blue-200 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Simulated Email Dispatch
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoFillCode}
                    className="text-[11px] font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    Auto-Fill Code
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-blue-800">
                    Your 6-digit email reset code is:
                  </p>
                  <span className="font-mono text-base font-extrabold text-blue-900 tracking-widest bg-white px-3 py-1 rounded-lg border border-blue-200 shadow-2xs">
                    {receivedCode}
                  </span>
                </div>
              </div>
            )}

            {/* 6 Digit Input Boxes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Enter 6-Digit Verification Code
                </label>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Change email</span>
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 sm:gap-3" onPaste={handleCodePaste}>
                {resetCodeDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      codeInputsRef.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(idx, e)}
                    className="w-12 h-13 sm:w-14 sm:h-14 text-center font-mono text-xl sm:text-2xl font-extrabold text-slate-900 bg-slate-50/80 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 focus:outline-hidden transition-all shadow-2xs"
                  />
                ))}
              </div>
            </div>

            {/* Resend timer */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
              <span>Didn't receive code?</span>
              {resendTimer > 0 ? (
                <span className="font-mono text-slate-400">Resend in {resendTimer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendCode()}
                  className="font-bold text-blue-600 hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Resend Reset Code</span>
                </button>
              )}
            </div>

            <div className="h-px bg-slate-100 my-2" />

            {/* New Password Inputs */}
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center gap-1.5">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 6 characters)"
                    className="w-full h-12 pl-11 pr-11 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center gap-1.5">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full h-12 pl-11 pr-11 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password checks checklist */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  {passwordChecks.length ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-slate-300" />
                  )}
                  <span className={passwordChecks.length ? 'text-emerald-700 font-medium' : ''}>
                    At least 6 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordChecks.hasLetters && passwordChecks.hasNumbers ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-slate-300" />
                  )}
                  <span
                    className={
                      passwordChecks.hasLetters && passwordChecks.hasNumbers
                        ? 'text-emerald-700 font-medium'
                        : ''
                    }
                  >
                    Contains letters and numbers
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordChecks.match ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-slate-300" />
                  )}
                  <span className={passwordChecks.match ? 'text-emerald-700 font-medium' : ''}>
                    Passwords match
                  </span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              disabled={isSubmitting || !passwordChecks.length || !passwordChecks.match}
              rightIcon={<CheckCircle2 className="w-4 h-4" />}
              className="h-12 shadow-md hover:shadow-lg transition-all duration-200 font-bold text-sm transform hover:-translate-y-0.5"
            >
              Reset Password & Sign In
            </Button>
          </form>
        )}

        {/* ── STEP 3: SUCCESS ──────────────────────────────────── */}
        {step === 3 && (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in duration-300">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-emerald-950">Password Successfully Reset</h2>
              <p className="text-xs text-emerald-700">
                You have been authenticated. Redirecting to your dashboard in a moment...
              </p>
            </div>
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Redirecting...</span>
              </span>
            </div>
          </div>
        )}

        {/* ── ROLE-BASED QUICK DEMO ACCOUNTS ───────────────────── */}
        {step === 1 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Quick Recovery Demo Accounts
              </span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Admin */}
              <button
                type="button"
                onClick={() => handleQuickFillEmail('admin@aidata.com')}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 ${
                  email === 'admin@aidata.com'
                    ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50/80 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-bold text-xs text-slate-900">Admin</span>
                </div>
                <p className="text-[11px] text-blue-700 font-bold mt-1 truncate">admin@aidata.com</p>
                <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Verified</span>
              </button>

              {/* Staff */}
              <button
                type="button"
                onClick={() => handleQuickFillEmail('kasun@aidata.com')}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 ${
                  email === 'kasun@aidata.com'
                    ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50/80 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-bold text-xs text-slate-900">Staff</span>
                </div>
                <p className="text-[11px] text-emerald-700 font-bold mt-1 truncate">kasun@aidata.com</p>
                <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Senior AI Eng</span>
              </button>

              {/* Intern */}
              <button
                type="button"
                onClick={() => handleQuickFillEmail('ayuni@aidata.com')}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 ${
                  email === 'ayuni@aidata.com'
                    ? 'border-purple-500 bg-purple-50/80 ring-2 ring-purple-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50/80 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                  <span className="font-bold text-xs text-slate-900">Intern</span>
                </div>
                <p className="text-[11px] text-purple-700 font-bold mt-1 truncate">ayuni@aidata.com</p>
                <span className="text-[10px] text-purple-600 font-bold block mt-0.5">AI/ML Track</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <Link
            to="/login"
            className="font-bold text-slate-700 hover:text-blue-700 hover:underline inline-flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>

          <Link
            to="/login"
            className="font-bold text-[var(--color-brand-blue)] hover:text-blue-700 hover:underline inline-flex items-center gap-1 transition-colors"
          >
            <span>Sign In with Keycloak</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
