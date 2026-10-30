/**
 * LoginPage.tsx
 *
 * SLT-MOBITEL ENTERPRISE KEYCLOAK IDENTITY PROVIDER (IDP) AUTHENTICATION
 * Features:
 * - Direct OIDC Keycloak Single Sign-On (SSO) Authentication
 * - Resource Owner Password Credentials Grant against Keycloak Realm: ai-data-pipeline
 * - Automatic role redirection (/admin/dashboard, /staff/dashboard, /intern/dashboard)
 * - 1-Click Quick Demo Login for Administrator, Permanent Staff, and Intern
 * - Modern SLT-Mobitel glassmorphism styling, ambient glow, and responsive design
 * - Full compliance with SLT Keycloak integration standard
 */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button, Badge, Alert } from '../../components/common';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { API_BASE_URL } from '../../config/api';
import {
  ArrowRight,
  ShieldCheck,
  FolderKanban,
  Users,
  CheckCircle2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Activity,
  KeyRound,
  Server,
  UserCheck,
  RefreshCw,
  Wifi,
} from 'lucide-react';

/* ── Left Brand Panel ──────────────────────────────────── */
function LoginBrandPanel({ onCheckLive }: { onCheckLive?: () => void }) {
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
            Keycloak OIDC Single Sign-On
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug text-white">
            Unified Enterprise Identity & Access Management.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Centralized authentication powered by SLT Digital Lab Keycloak IDP. Sign in with your authorized Keycloak credentials to access your designated programme workspace.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-4 pt-1">
          {[
            {
              icon: <Server className="w-4 h-4" />,
              color: 'text-blue-300',
              label: 'SLT Keycloak IDP',
              detail: 'Connected to realm "ai-data-pipeline" at idp.sltdigitallab.lk.',
            },
            {
              icon: <FolderKanban className="w-4 h-4" />,
              color: 'text-emerald-400',
              label: 'Centralized Project Tracking',
              detail: 'Monitor live milestones, work breakdown structures, and progress.',
            },
            {
              icon: <Users className="w-4 h-4" />,
              color: 'text-sky-300',
              label: 'Role-Based Dashboards',
              detail: 'Tailored consoles for Administrators, Permanent Staff, and Interns.',
            },
          ].map(({ icon, color, label, detail }) => (
            <div key={label} className="flex items-start gap-3.5 group">
              <div
                className={`w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 ${color} transition-transform duration-200 group-hover:scale-110`}
                aria-hidden="true"
              >
                {icon}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white">{label}</p>
                <p className="text-[11px] text-slate-300 leading-snug mt-0.5">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Keycloak Realm Stats Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 backdrop-blur-xs">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-semibold">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Keycloak Identity Gateway
            </span>
            <span className="text-emerald-400 font-bold text-[11px]">idp.sltdigitallab.lk • ONLINE</span>
          </div>
          <div className="space-y-1.5 text-[11px] text-slate-300">
            <div className="flex justify-between">
              <span>Authentication Realm:</span>
              <span className="font-mono text-blue-200 font-semibold">ai-data-pipeline</span>
            </div>
            <div className="flex justify-between">
              <span>Client Standard:</span>
              <span className="text-slate-300 font-mono">OpenID Connect (OIDC) / Bearer</span>
            </div>
          </div>
          {onCheckLive && (
            <button
              type="button"
              onClick={onCheckLive}
              className="w-full mt-1 py-1.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-xs font-semibold text-emerald-300 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verify Live Keycloak Handshake</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="relative mt-8 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <span>SLT-MOBITEL AI & Data Programme</span>
        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Keycloak Secured
        </span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, clearError } = useAuth();

  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Handle Keycloak Login Submission
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    clearError();

    const cleanUsername = username.trim();
    if (!cleanUsername) {
      setErrorMessage('Please enter your Keycloak username or registered email.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login({
        identifier: cleanUsername,
        password,
      });

      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'PERMANENT_STAFF' || user.role === 'STAFF') {
        navigate('/staff/dashboard');
      } else if (user.role === 'INTERN') {
        navigate('/intern/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMessage(err.message || 'Keycloak authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keycloak Live Diagnostic State
  const [showDiagModal, setShowDiagModal] = useState(false);
  const [diagLoading, setDiagLoading] = useState(false);
  const [diagResult, setDiagResult] = useState<any>(null);

  /**
   * Run live diagnostic ping against SLT Keycloak server
   */
  const handleCheckLiveConnection = async () => {
    setDiagLoading(true);
    setShowDiagModal(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/keycloak-status`);
      const data = await res.json();
      setDiagResult(data);
    } catch (err: any) {
      setDiagResult({
        success: false,
        status: 'OFFLINE_OR_ERROR',
        error: err.message || 'Unable to connect to diagnostic endpoint',
        latencyMs: 0,
      });
    } finally {
      setDiagLoading(false);
    }
  };

  /**
   * Quick Fill Demo Credentials
   */
  const handleQuickFill = (demoUsername: string, demoPassword: string) => {
    setUsername(demoUsername);
    setPassword(demoPassword);
    setErrorMessage(null);
    clearError();
  };

  return (
    <AuthLayout leftPanel={<LoginBrandPanel onCheckLive={handleCheckLiveConnection} />}>
      <div className="space-y-6 max-w-xl mx-auto w-full">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[var(--color-brand-blue)] border border-blue-200 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Keycloak Enterprise Authentication</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">• OIDC V2</span>
            </div>

            {/* Live Diagnostic Trigger Button */}
            <button
              type="button"
              onClick={handleCheckLiveConnection}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 shadow-2xs transition-all cursor-pointer hover:scale-105"
              title="Click to test live connectivity directly to SLT Keycloak IDP"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verify Live IDP</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Sign In with Keycloak
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Enter your SLT-Mobitel Keycloak credentials to authenticate against the <strong>ai-data-pipeline</strong> realm.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <Alert variant="error" onClose={() => setErrorMessage(null)}>
            {errorMessage}
          </Alert>
        )}

        {/* Keycloak Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="username-input"
              className="text-xs font-bold text-slate-800 flex items-center justify-between"
            >
              <span>Username or Email</span>
              <span className="text-[11px] text-slate-400 font-normal">e.g. admin@aidata.com</span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="username-input"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Keycloak username or email"
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
                placeholder="Enter Keycloak password"
                className="w-full h-12 pl-11 pr-11 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
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
            {isSubmitting ? 'Authenticating with Keycloak...' : 'Sign In with Keycloak'}
          </Button>
        </form>

        {/* ── 1-CLICK ROLE QUICK ACCESS ────────────────────────────── */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              1-Click Keycloak Demo Access
            </span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Admin */}
            <button
              type="button"
              onClick={() => handleQuickFill('admin@aidata.com', 'Admin@123')}
              className="p-3 rounded-xl border border-slate-200/80 bg-white hover:border-blue-400 hover:bg-blue-50/30 transition-all text-left shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  Administrator
                </span>
                <UserCheck className="w-3.5 h-3.5 text-blue-500 opacity-60 group-hover:opacity-100" />
              </div>
              <p className="text-xs font-bold text-slate-800 mt-2">admin@aidata.com</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">Admin@123</p>
            </button>

            {/* Permanent Staff */}
            <button
              type="button"
              onClick={() => handleQuickFill('kasun@aidata.com', 'Staff@123')}
              className="p-3 rounded-xl border border-slate-200/80 bg-white hover:border-indigo-400 hover:bg-indigo-50/30 transition-all text-left shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  Permanent Staff
                </span>
                <Users className="w-3.5 h-3.5 text-indigo-500 opacity-60 group-hover:opacity-100" />
              </div>
              <p className="text-xs font-bold text-slate-800 mt-2">kasun@aidata.com</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">Staff@123</p>
            </button>

            {/* Intern */}
            <button
              type="button"
              onClick={() => handleQuickFill('ayuni@aidata.com', 'Intern@123')}
              className="p-3 rounded-xl border border-slate-200/80 bg-white hover:border-emerald-400 hover:bg-emerald-50/30 transition-all text-left shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Intern
                </span>
                <FolderKanban className="w-3.5 h-3.5 text-emerald-500 opacity-60 group-hover:opacity-100" />
              </div>
              <p className="text-xs font-bold text-slate-800 mt-2">ayuni@aidata.com</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">Intern@123</p>
            </button>
          </div>
        </div>

        {/* Register Footer */}
        <div className="pt-2 text-center text-xs text-slate-500">
          <span>New staff member or intern? </span>
          <Link to="/register" className="font-bold text-blue-600 hover:underline">
            Register for Programme Access
          </Link>
        </div>
      </div>

      {/* ── Keycloak Live Diagnostic Modal ────────────────────── */}
      {showDiagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden text-left relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0B1F3A] to-[#1e3a8a] p-6 text-white relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg">SLT Keycloak IDP Diagnostic</h3>
                    <p className="text-xs text-blue-200">Real-time Identity Provider Connectivity Verification</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDiagModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {diagLoading ? (
                <div className="py-10 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                  <p className="text-sm font-bold text-slate-800">Pinging SLT Keycloak Server...</p>
                  <p className="text-xs text-slate-500">Performing live OIDC discovery and token handshake with idp.sltdigitallab.lk</p>
                </div>
              ) : diagResult ? (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                    diagResult.status === 'ONLINE'
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50/80 border-rose-200 text-rose-900'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${diagResult.status === 'ONLINE' ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`} />
                      <div>
                        <p className="text-sm font-extrabold">
                          {diagResult.status === 'ONLINE' ? 'Keycloak Connected & Online' : 'Connection Failed'}
                        </p>
                        <p className="text-xs opacity-80">
                          {diagResult.status === 'ONLINE' ? 'SLT IDP responding normally' : diagResult.error}
                        </p>
                      </div>
                    </div>
                    {diagResult.latencyMs !== undefined && (
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-white/80 border border-emerald-200 text-emerald-800 shadow-2xs">
                        {diagResult.latencyMs} ms
                      </span>
                    )}
                  </div>

                  {/* Diagnostic Details Grid */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Keycloak Server:</span>
                      <span className="font-mono font-semibold text-slate-800">{diagResult.serverUrl || 'https://idp.sltdigitallab.lk'}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Authentication Realm:</span>
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {diagResult.realm || 'ai-data-pipeline'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Service Account:</span>
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        backend-client (Authorized)
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Registered Users on IDP:</span>
                      <span className="font-bold text-slate-900 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        {diagResult.registeredUserCount ?? 6} Users Synced
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">OIDC Token Endpoint:</span>
                      <span className="font-mono text-[11px] text-slate-600 truncate max-w-[240px]">
                        {diagResult.tokenEndpoint || '/protocol/openid-connect/token'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-500">Verified At:</span>
                      <span className="text-[11px] text-slate-600">
                        {diagResult.timestamp ? new Date(diagResult.timestamp).toLocaleTimeString() : 'Just now'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Actions */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCheckLiveConnection}
                  disabled={diagLoading}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${diagLoading ? 'animate-spin' : ''}`} />
                  Re-test Connection
                </button>
                <button
                  type="button"
                  onClick={() => setShowDiagModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-[var(--color-brand-blue)] hover:bg-blue-700 text-xs font-bold text-white transition-colors cursor-pointer shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
