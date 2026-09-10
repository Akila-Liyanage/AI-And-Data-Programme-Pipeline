/**
 * LoginPage.tsx
 *
 * MODERN WIDE LIGHT BLUE PHONE OTP LOGIN SYSTEM
 * Features:
 * - Direct Mobile Phone Number + 6-digit OTP verification authentication
 * - Two-step seamless authentication flow (Phone Input -> 6-Digit OTP Entry)
 * - Auto-focus digit boxes with clipboard paste and backspace navigation
 * - Simulated SMS Notification banner with 1-click Auto-fill OTP
 * - 1-Click Quick Demo Phone Number fill for Admin, Staff, and Intern roles
 * - Automatic redirection to role-specific dashboards (/admin, /staff, /intern)
 * - Smooth micro-animations and responsive wide layout
 */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button, Badge } from '../../components/common';
import { AuthLayout } from '../../components/layout/AuthLayout';
import {
  ArrowRight,
  ArrowLeft,
  Smartphone,
  ShieldCheck,
  FolderKanban,
  Users,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Clock,
  Ban,
  Activity,
  Building,
  GraduationCap,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';

/* ── Left Brand Panel ──────────────────────────────────── */
function LoginBrandPanel() {
  return (
    <div className="bg-gradient-to-br from-[#0B1F3A] via-[#132D52] to-[#1e3a8a] p-8 sm:p-10 lg:p-12 text-white flex flex-col justify-between h-full relative overflow-hidden">
      {/* Ambient soft glow orbs */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative space-y-8 z-10">
        {/* Product emblem */}
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-white/95 backdrop-blur-md inline-flex items-center shadow-md shrink-0">
            <img src="/slt-mobitel-logo.png" alt="SLTMOBITEL" className="h-8 w-auto object-contain" />
          </div>
          <div>
            <p className="font-extrabold text-base tracking-tight text-white leading-tight">
              AI & Data Programme Pipeline
            </p>
            <p className="text-xs text-blue-200/80 leading-tight">
              Enterprise Project Management System
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Badge variant="blue" dot size="sm" className="bg-white/10 text-blue-200 border-white/20 px-3 py-1">
            Instant Phone OTP Access
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug text-white">
            Passwordless, high-security phone authentication.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Enter your authorized mobile phone number to receive a secure one-time verification code (OTP).
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-4 pt-1">
          {[
            {
              icon: <Smartphone className="w-4 h-4" />,
              color: 'text-blue-300',
              label: 'Passwordless OTP Login',
              detail: 'No password to remember — instant secure SMS code directly to your phone.',
            },
            {
              icon: <FolderKanban className="w-4 h-4" />,
              color: 'text-emerald-400',
              label: 'Centralized Project Tracking',
              detail: 'Monitor live project milestones and work breakdown progress.',
            },
            {
              icon: <Users className="w-4 h-4" />,
              color: 'text-sky-300',
              label: 'Role-Based Dashboards',
              detail: 'Dedicated consoles for Administrators, Permanent Staff, and Interns.',
            },
          ].map(({ icon, color, label, detail }) => (
            <div key={label} className="flex items-start gap-3.5 group">
              <div className={`w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 ${color} transition-transform duration-200 group-hover:scale-110`} aria-hidden="true">
                {icon}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white">{label}</p>
                <p className="text-[11px] text-slate-300 leading-snug mt-0.5">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mini stats */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 backdrop-blur-xs">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-semibold">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Authentication Gateway
            </span>
            <span className="text-emerald-400 font-bold text-[11px]">Online & Active</span>
          </div>
          <div className="space-y-1.5 text-[11px] text-slate-300">
            <div className="flex justify-between">
              <span>Security Protocol:</span>
              <span className="font-mono text-blue-200 font-semibold">SMS / One-Time Password</span>
            </div>
            <div className="flex justify-between">
              <span>Token Standard:</span>
              <span className="text-slate-300 font-mono">JWT Bearer Authorization</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="relative mt-8 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <span>SLT-MOBITEL AI & Data Programme</span>
        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          OTP Secured
        </span>
      </div>
    </div>
  );
}

/* ── Main Login Page Component ─────────────────────────── */
export default function LoginPage() {
  const { sendOtp, verifyOtp, login, isAuthenticated, user, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  // Authentication Mode: 'otp' | 'password'
  const [authMode, setAuthMode] = useState<'otp' | 'password'>('otp');

  // Authentication Step: 1 = Enter Phone, 2 = Enter OTP (for OTP mode)
  const [step, setStep] = useState<1 | 2>(1);
  const [phoneNumber, setPhoneNumber] = useState('0774943291'); // Default to Admin phone
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [receivedOtp, setReceivedOtp] = useState<string | null>(null);

  // Email & Password login states
  const [identifier, setIdentifier] = useState('admin@aidata.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<{
    type: 'pending' | 'rejected' | 'info';
    message: string;
  } | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // If already authenticated, redirect to the appropriate dashboard
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
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      const message = err?.message || 'Failed to send verification code.';
      if (message.toLowerCase().includes('pending')) {
        setStatusNotice({
          type: 'pending',
          message,
        });
      } else if (message.toLowerCase().includes('reject') || message.toLowerCase().includes('deactivat')) {
        setStatusNotice({
          type: 'rejected',
          message,
        });
      } else {
        setPhoneError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle OTP input changes with auto-focus across 6 boxes
   */
  const handleOtpDigitChange = (index: number, value: string) => {
    setPhoneError(null);
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
      const nextIndex = Math.min(pastedData.length, 5);
      otpInputsRef.current[nextIndex]?.focus();
    }
  };

  /**
   * Auto fill simulated OTP
   */
  const handleAutoFillOtp = () => {
    if (!receivedOtp) return;
    const digits = receivedOtp.split('').slice(0, 6);
    setOtpDigits(digits);
    otpInputsRef.current[5]?.focus();
  };

  /**
   * Handle Step 2: Verify OTP
   */
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);
    clearError();

    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setPhoneError('Please enter the full 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const authenticatedUser = await verifyOtp(phoneNumber.trim(), fullOtp);
      if (authenticatedUser.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (authenticatedUser.role === 'PERMANENT_STAFF' || authenticatedUser.role === 'STAFF') {
        navigate('/staff/dashboard');
      } else if (authenticatedUser.role === 'INTERN') {
        navigate('/intern/dashboard');
      }
    } catch (err: any) {
      const message = err?.message || 'Invalid or expired verification code.';
      if (message.toLowerCase().includes('pending')) {
        setStatusNotice({
          type: 'pending',
          message,
        });
      } else if (message.toLowerCase().includes('reject') || message.toLowerCase().includes('deactivat')) {
        setStatusNotice({
          type: 'rejected',
          message,
        });
      } else {
        setPhoneError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle Password Login
   */
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);
    setStatusNotice(null);
    clearError();

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier) {
      setPhoneError('Please enter your email, username, or user ID.');
      return;
    }

    if (!password) {
      setPhoneError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const authenticatedUser = await login({
        identifier: cleanIdentifier,
        password,
      });
      if (authenticatedUser.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (authenticatedUser.role === 'PERMANENT_STAFF' || authenticatedUser.role === 'STAFF') {
        navigate('/staff/dashboard');
      } else if (authenticatedUser.role === 'INTERN') {
        navigate('/intern/dashboard');
      }
    } catch (err: any) {
      const message = err?.message || 'Login failed. Please check credentials.';
      if (message.toLowerCase().includes('pending')) {
        setStatusNotice({
          type: 'pending',
          message,
        });
      } else if (message.toLowerCase().includes('reject') || message.toLowerCase().includes('deactivat')) {
        setStatusNotice({
          type: 'rejected',
          message,
        });
      } else {
        setPhoneError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Quick fill account credentials from demo accounts
   */
  const handleQuickFillAccount = (phone: string, emailVal: string, defaultPw: string = 'Admin@123') => {
    setPhoneNumber(phone);
    setIdentifier(emailVal);
    setPassword(defaultPw);
    setPhoneError(null);
    setStatusNotice(null);
    clearError();
    if (step === 2) {
      setStep(1);
    }
  };

  return (
    <AuthLayout leftPanel={<LoginBrandPanel />}>
      <div className="space-y-6 max-w-xl mx-auto w-full">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[var(--color-brand-blue)] border border-blue-200 shadow-2xs">
              {authMode === 'otp' ? (
                <>
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Phone OTP Authentication</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Credential Authentication</span>
                </>
              )}
            </span>
            <span className="text-xs text-slate-500 font-medium">• Enterprise V2</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {authMode === 'password'
              ? 'Sign In with Email & Password'
              : step === 1
              ? 'Sign In with Mobile OTP'
              : 'Enter Verification Code'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {authMode === 'password'
              ? 'Enter your registered email address or user ID and password to access your workspace.'
              : step === 1
              ? 'Enter your registered phone number to receive a secure SMS one-time passcode.'
              : `A 6-digit verification code has been sent to ${phoneNumber}.`}
          </p>
        </div>

        {/* Dual Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-2xs">
          <button
            type="button"
            onClick={() => {
              setAuthMode('otp');
              setPhoneError(null);
              clearError();
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              authMode === 'otp'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-600" />
            <span>Mobile Phone OTP</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('password');
              setPhoneError(null);
              clearError();
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              authMode === 'password'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Email & Password</span>
          </button>
        </div>

        {/* Pending Verification Notice */}
        {statusNotice?.type === 'pending' && (
          <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 space-y-2 shadow-xs animate-in fade-in duration-300">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Account Pending Administrator Approval</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              {statusNotice.message}
            </p>
            <p className="text-[11px] text-amber-700 pt-1.5 border-t border-amber-200/80">
              💡 Tip: You can sign in as <strong className="font-bold">Admin (0774943291)</strong> to review and activate this account.
            </p>
          </div>
        )}

        {/* Rejected Notice */}
        {statusNotice?.type === 'rejected' && (
          <div className="p-4 rounded-2xl bg-rose-50/90 border border-rose-300 space-y-2 shadow-xs animate-in fade-in duration-300">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
              <Ban className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Access Restricted</span>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed">
              {statusNotice.message}
            </p>
          </div>
        )}

        {/* Standard Error Alert */}
        {(phoneError || authError) && !statusNotice && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-start gap-2.5 shadow-2xs animate-in fade-in duration-200">
            <span className="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0" />
            <span>{phoneError || authError}</span>
          </div>
        )}

        {/* ── MODE 1: PHONE OTP AUTHENTICATION ─────────────────── */}
        {authMode === 'otp' && (
          <>
            {/* STEP 1: ENTER PHONE NUMBER */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="phone-input"
                    className="text-xs font-bold text-slate-800 flex items-center justify-between"
                  >
                    <span>Mobile Phone Number</span>
                    <span className="text-[11px] text-slate-400 font-normal">Sri Lankan mobile (e.g. 0774943291)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <input
                      id="phone-input"
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="0774943291"
                      className="w-full h-12 pl-11 pr-4 text-xs sm:text-sm font-mono rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 placeholder:font-sans focus:bg-white focus:outline-hidden focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-2xs"
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
                  Send Verification Code (OTP)
                </Button>

                {/* OTP Alternative Fallback Notice */}
                <div className="pt-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
                  <span className="text-slate-500">Can't receive SMS code on your phone?</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAuthMode('password')}
                      className="font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Use Password
                    </button>
                    <span className="text-slate-300">•</span>
                    <Link
                      to="/forgot-password"
                      className="font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Reset via Email</span>
                    </Link>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 2: ENTER 6-DIGIT OTP */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in duration-300">
                {/* Simulated SMS notification card */}
                {receivedOtp && (
                  <div className="p-4 rounded-2xl bg-blue-50/90 border border-blue-200 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        Simulated SMS Notification
                      </span>
                      <button
                        type="button"
                        onClick={handleAutoFillOtp}
                        className="text-[11px] font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Auto-Fill Code
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-blue-800">
                        Your verification OTP code is:
                      </p>
                      <span className="font-mono text-base font-extrabold text-blue-900 tracking-widest bg-white px-3 py-1 rounded-lg border border-blue-200 shadow-2xs">
                        {receivedOtp}
                      </span>
                    </div>
                  </div>
                )}

                {/* 6 Digit Input Boxes */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      Enter 6-Digit Code
                    </label>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Change number</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpInputsRef.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-12 h-13 sm:w-14 sm:h-14 text-center font-mono text-xl sm:text-2xl font-extrabold text-slate-900 bg-slate-50/80 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 focus:outline-hidden transition-all shadow-2xs"
                      />
                    ))}
                  </div>
                </div>

                {/* Verify Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  rightIcon={<CheckCircle2 className="w-4 h-4" />}
                  className="h-12 shadow-md hover:shadow-lg transition-all duration-200 font-bold text-sm transform hover:-translate-y-0.5"
                >
                  Verify Code & Sign In
                </Button>

                {/* Resend timer */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Didn't receive code?</span>
                  {resendTimer > 0 ? (
                    <span className="font-mono text-slate-400">Resend in {resendTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendOtp()}
                      className="font-bold text-blue-600 hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Resend OTP Code</span>
                    </button>
                  )}
                </div>

                {/* Alternative when OTP fails */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                  <span>Still haven't received SMS OTP?</span>
                  <Link
                    to="/forgot-password"
                    className="font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Forgot / Reset via Email</span>
                  </Link>
                </div>
              </form>
            )}
          </>
        )}

        {/* ── MODE 2: EMAIL & PASSWORD LOGIN ───────────────────── */}
        {authMode === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4 animate-in fade-in duration-300">
            <div className="space-y-1.5">
              <label
                htmlFor="identifier-input"
                className="text-xs font-bold text-slate-800 flex items-center justify-between"
              >
                <span>Email, Username, or User ID</span>
                <span className="text-[11px] text-slate-400 font-normal">e.g. admin@aidata.com</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="identifier-input"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@aidata.com or ADM-001"
                  className="w-full h-12 pl-11 pr-4 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-2xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password-input"
                  className="text-xs font-bold text-slate-800"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>Forgot Password?</span>
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center gap-1.5">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
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
              Sign In with Password
            </Button>

            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => setAuthMode('otp')}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Prefer SMS verification? Switch to Phone OTP Login</span>
              </button>
            </div>
          </form>
        )}

        {/* ── ROLE-BASED QUICK ACCESS ────────────────────────────── */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Role-Based Quick Access ({authMode === 'otp' ? 'Phone OTP' : 'Email & Password'})
            </span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Admin Account */}
            <button
              type="button"
              onClick={() => handleQuickFillAccount('0774943291', 'admin@aidata.com', 'Admin@123')}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 ${
                (authMode === 'otp' && phoneNumber === '0774943291') || (authMode === 'password' && identifier === 'admin@aidata.com')
                  ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50/80 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-bold text-xs text-slate-900">Admin</span>
              </div>
              <p className="font-mono text-[11px] text-blue-700 font-bold mt-1">
                {authMode === 'otp' ? '0774943291' : 'admin@aidata.com'}
              </p>
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Verified</span>
            </button>

            {/* Staff Account */}
            <button
              type="button"
              onClick={() => handleQuickFillAccount('0771234567', 'kasun@aidata.com', 'Staff@123')}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 ${
                (authMode === 'otp' && phoneNumber === '0771234567') || (authMode === 'password' && identifier === 'kasun@aidata.com')
                  ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50/80 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-bold text-xs text-slate-900">Staff</span>
              </div>
              <p className="font-mono text-[11px] text-emerald-700 font-bold mt-1">
                {authMode === 'otp' ? '0771234567' : 'kasun@aidata.com'}
              </p>
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Permanent</span>
            </button>

            {/* Intern Account */}
            <button
              type="button"
              onClick={() => handleQuickFillAccount('0777654321', 'ayuni@aidata.com', 'Intern@123')}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 ${
                (authMode === 'otp' && phoneNumber === '0777654321') || (authMode === 'password' && identifier === 'ayuni@aidata.com')
                  ? 'border-purple-500 bg-purple-50/80 ring-2 ring-purple-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50/80 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                <span className="font-bold text-xs text-slate-900">Intern</span>
              </div>
              <p className="font-mono text-[11px] text-purple-700 font-bold mt-1">
                {authMode === 'otp' ? '0777654321' : 'ayuni@aidata.com'}
              </p>
              <span className="text-[10px] text-purple-600 font-bold block mt-0.5">AI/ML Track</span>
            </button>
          </div>

          {/* Pending Approval Accounts */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
            <span className="text-slate-600 font-medium">Pending Verification:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickFillAccount('0779988776', 'nimal@aidata.com', 'Staff@123')}
                className="font-mono text-amber-700 font-bold hover:underline cursor-pointer bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200"
              >
                0779988776 (Pending Staff)
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={() => handleQuickFillAccount('0773344556', 'pending_intern@aidata.com', 'Intern@123')}
                className="font-mono text-amber-700 font-bold hover:underline cursor-pointer bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200"
              >
                0773344556 (Pending Intern)
              </button>
            </div>
          </div>
        </div>

        {/* Footer: Link to Self-Registration & Forgot Password */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            <span>Can't sign in? </span>
            <Link
              to="/forgot-password"
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Reset Password via Email
            </Link>
          </div>

          <div>
            <span>Don't have an account? </span>
            <Link
              to="/register"
              className="font-bold text-[var(--color-brand-blue)] hover:text-blue-700 hover:underline inline-flex items-center gap-1 transition-colors"
            >
              <span>Register as Staff or Intern</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
