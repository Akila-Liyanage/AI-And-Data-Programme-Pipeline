/**
 * LoginPage.tsx
 *
 * MODERN LIGHT BLUE CREDENTIALS LOGIN PORTAL (User ID + Password)
 * Features:
 * - Direct User ID / Email + Password login authentication
 * - High-security RBAC session handling with JWT storage
 * - Instant 1-Click Quick Demo Account switcher across all roles & states
 * - Contextual alerts for Pending Verification and Rejected registrations
 * - Direct navigation link to Staff/Intern Self-Registration
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button, Badge } from '../../components/common';
import { AuthLayout } from '../../components/layout/AuthLayout';
import {
  ArrowRight,
  ShieldCheck,
  FolderKanban,
  Users,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
  User,
  GraduationCap,
  Building,
  CheckCircle2,
  Clock,
  Ban,
  Activity,
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
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-base shrink-0 shadow-sm backdrop-blur-sm">
            <span className="text-blue-300">AI</span>
            <span className="text-emerald-400 font-extrabold">+</span>
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
            Role-Based Access Control (RBAC)
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug text-white">
            Centralized intelligence & project delivery workspace.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Sign in using your authorized User ID and password to access your role-specific console.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-4 pt-1">
          {[
            {
              icon: <ShieldCheck className="w-4 h-4" />,
              color: 'text-blue-300',
              label: 'Verified User ID Authentication',
              detail: 'Tailored access for Administrators (ADM), Permanent Staff (STF), and Interns (INT).',
            },
            {
              icon: <FolderKanban className="w-4 h-4" />,
              color: 'text-emerald-400',
              label: 'Automated Project Calculations',
              detail: 'Work item status toggles dynamically update project completion percentages.',
            },
            {
              icon: <Users className="w-4 h-4" />,
              color: 'text-sky-300',
              label: 'Administrative Governance',
              detail: 'Pending registrations are securely verified and activated by Programme Leadership.',
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
              Security Architecture
            </span>
            <span className="text-emerald-400 font-bold text-[11px]">Active & Verified</span>
          </div>
          <div className="space-y-1.5 text-[11px] text-slate-300">
            <div className="flex justify-between">
              <span>Authentication Gate:</span>
              <span className="font-mono text-blue-200 font-semibold">User ID + Password</span>
            </div>
            <div className="flex justify-between">
              <span>Token Standard:</span>
              <span className="text-slate-300 font-mono">JWT + Bcrypt Hashing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="relative mt-8 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <span>SLT-MOBITEL AI & Data Programme</span>
        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          SSL / RBAC Secured
        </span>
      </div>
    </div>
  );
}

/* ── Main Login Page Component ─────────────────────────── */
export default function LoginPage() {
  const { login, isAuthenticated, user, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [identifier, setIdentifier] = useState('ADM-001');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<{
    type: 'pending' | 'rejected' | 'info';
    userId?: string;
    message: string;
  } | null>(null);

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

  /**
   * Handle Credentials Login Submission
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusNotice(null);
    clearError();

    const cleanIdentifier = identifier.trim();
    const cleanPassword = password.trim();

    if (!cleanIdentifier) {
      setErrorMessage('Please enter your User ID, Email, or Phone Number.');
      return;
    }

    if (!cleanPassword) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const loggedUser = await login({
        identifier: cleanIdentifier,
        password: cleanPassword,
      });

      // Successful redirect based on user role
      if (loggedUser.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (loggedUser.role === 'PERMANENT_STAFF' || loggedUser.role === 'STAFF') {
        navigate('/staff/dashboard');
      } else if (loggedUser.role === 'INTERN') {
        navigate('/intern/dashboard');
      }
    } catch (err: any) {
      const msg = err.message || 'Login failed. Please check your credentials.';

      if (msg.toLowerCase().includes('pending')) {
        setStatusNotice({
          type: 'pending',
          userId: cleanIdentifier,
          message: msg,
        });
      } else if (msg.toLowerCase().includes('reject') || msg.toLowerCase().includes('not approved')) {
        setStatusNotice({
          type: 'rejected',
          userId: cleanIdentifier,
          message: msg,
        });
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 1-Click Quick Demo Account Switcher
   */
  const handleQuickFill = (id: string, pass: string) => {
    setIdentifier(id);
    setPassword(pass);
    setErrorMessage(null);
    setStatusNotice(null);
    clearError();
  };

  return (
    <AuthLayout leftPanel={<LoginBrandPanel />}>
      <div className="space-y-6 max-w-xl mx-auto w-full">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[var(--color-brand-blue)] border border-blue-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              Credentials Authentication
            </span>
            <span className="text-xs text-slate-500 font-medium">• Enterprise V2</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Sign In to Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Enter your User ID and password to access your role workspace.
          </p>
        </div>

        {/* Pending Verification Notice */}
        {statusNotice?.type === 'pending' && (
          <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 space-y-2 shadow-xs animate-in fade-in duration-300">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Registration Pending Administrator Approval</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              {statusNotice.message}
            </p>
            <p className="text-[11px] text-amber-700 pt-1.5 border-t border-amber-200/80">
              💡 Tip: You can switch to <strong className="font-bold">ADM-001</strong> to review and activate this account.
            </p>
          </div>
        )}

        {/* Rejected Registration Notice */}
        {statusNotice?.type === 'rejected' && (
          <div className="p-4 rounded-2xl bg-rose-50/90 border border-rose-300 space-y-2 shadow-xs animate-in fade-in duration-300">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
              <Ban className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Registration Declined</span>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed">
              {statusNotice.message}
            </p>
          </div>
        )}

        {/* Standard Error Alert */}
        {(errorMessage || authError) && !statusNotice && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-start gap-2.5 shadow-2xs animate-in fade-in duration-200">
            <span className="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0" />
            <span>{errorMessage || authError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* User ID / Identifier Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-identifier"
              className="text-xs font-bold text-slate-800 flex items-center justify-between"
            >
              <span>User ID / Email / Phone</span>
              <span className="text-[11px] text-slate-400 font-normal">e.g. ADM-001, STF-101</span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <User className="w-4 h-4" />
              </div>
              <input
                id="login-identifier"
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter User ID (e.g. ADM-001, STF-101, INT-201)"
                className="w-full h-12 pl-11 pr-4 text-xs sm:text-sm font-mono rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 placeholder:font-sans focus:bg-white focus:outline-hidden focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-password"
              className="text-xs font-bold text-slate-800"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password"
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
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 focus:outline-hidden cursor-pointer transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
            className="h-12 shadow-md hover:shadow-lg transition-all duration-200 font-bold text-sm transform hover:-translate-y-0.5"
          >
            Sign In to Dashboard
          </Button>
        </form>

        {/* ── 1-CLICK QUICK DEMO ACCOUNTS ────────────────────────── */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Quick 1-Click Demo Accounts
            </span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Admin Demo */}
            <button
              type="button"
              onClick={() => handleQuickFill('ADM-001', 'Admin@123')}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 ${
                identifier === 'ADM-001'
                  ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50/80 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-bold text-xs text-slate-900">Admin</span>
              </div>
              <p className="font-mono text-[11px] text-blue-700 font-bold mt-1">ADM-001</p>
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Verified</span>
            </button>

            {/* Staff Demo */}
            <button
              type="button"
              onClick={() => handleQuickFill('STF-101', 'Staff@123')}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 ${
                identifier === 'STF-101'
                  ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50/80 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-bold text-xs text-slate-900">Staff</span>
              </div>
              <p className="font-mono text-[11px] text-emerald-700 font-bold mt-1">STF-101</p>
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Permanent</span>
            </button>

            {/* Intern Demo */}
            <button
              type="button"
              onClick={() => handleQuickFill('INT-201', 'Intern@123')}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 ${
                identifier === 'INT-201'
                  ? 'border-purple-500 bg-purple-50/80 ring-2 ring-purple-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50/80 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                <span className="font-bold text-xs text-slate-900">Intern</span>
              </div>
              <p className="font-mono text-[11px] text-purple-700 font-bold mt-1">INT-201</p>
              <span className="text-[10px] text-purple-600 font-bold block mt-0.5">AI/ML Track</span>
            </button>
          </div>

          {/* Pending Demo Accounts */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
            <span className="text-slate-600 font-medium">Test Approval Flow:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('STF-102', 'Staff@123')}
                className="font-mono text-amber-700 font-bold hover:underline cursor-pointer bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200"
              >
                STF-102 (Pending)
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={() => handleQuickFill('INT-202', 'Intern@123')}
                className="font-mono text-amber-700 font-bold hover:underline cursor-pointer bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200"
              >
                INT-202 (Pending)
              </button>
            </div>
          </div>
        </div>

        {/* Footer: Link to Self-Registration */}
        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
          <span>Don't have an authorized account yet? </span>
          <Link
            to="/register"
            className="font-bold text-[var(--color-brand-blue)] hover:text-blue-700 hover:underline inline-flex items-center gap-1 transition-colors"
          >
            <span>Register as Staff or Intern</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
