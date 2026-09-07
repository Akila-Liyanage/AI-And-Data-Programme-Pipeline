/**
 * PendingVerificationPage.tsx
 *
 * STEP 3 PENDING VERIFICATION UI.
 * Renders the registration status page showing account verification is pending.
 *
 * STRICT BOUNDARIES:
 * - NO real user details are fetched or displayed yet.
 * - NO mock database entries or fake localStorage records.
 * - NO dashboard redirection or auto-login behaviour.
 */
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowLeft,
  Home,
  Clock,
  CheckCircle2,
  Lock,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { Badge, Button } from '../../components/common';
import { AuthLayout } from '../../components/layout/AuthLayout';

/* ── Left Brand Panel ──────────────────────────────────── */
function PendingBrandPanel() {
  return (
    <div className="bg-gradient-to-br from-[#0B1F3A] via-[#132D52] to-[#1e3a8a] p-8 sm:p-10 lg:p-12 text-white flex flex-col justify-between h-full relative overflow-hidden">
      {/* Ambient soft glow orbs */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative space-y-8 z-10">
        {/* Emblem */}
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
              Staff & Intern Registration Queue
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Badge variant="blue" dot size="sm" className="bg-white/10 text-blue-200 border-white/20 px-3 py-1">
            Verification Queue
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug text-white">
            Your registration is safely queued for review.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The administrator validates system access to ensure proper role security and track allocation.
          </p>
        </div>

        {/* Informative tips */}
        <div className="space-y-4 pt-1">
          <div className="flex items-start gap-3.5 group">
            <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">Pending Administrative Approval</p>
              <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                Verification status is tracked securely. Once approved, you can sign in with your registered phone number via OTP.
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-8 relative z-10 pt-4 border-t border-white/10">
        © SLT-MOBITEL AI & Data Team. All rights reserved.
      </p>
    </div>
  );
}

/* ── Main Page Component ────────────────────────────────── */
export default function PendingVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const registration = location.state?.registration;

  const userTypeLabel = registration?.role === 'PERMANENT_STAFF' ? 'Permanent Staff' : (registration?.role === 'INTERN' ? 'Intern' : '—');
  const userRoleLabel = registration?.role === 'PERMANENT_STAFF' ? (registration?.designation || '—') : (registration?.internRole || registration?.designation || '—');
  
  const statusLabel = registration?.accountStatus === 'PENDING' ? 'Pending Verification' 
    : (registration?.accountStatus === 'ACTIVE' ? 'Verified' : (registration?.accountStatus === 'REJECTED' ? 'Rejected' : (registration?.accountStatus || 'Pending')));

  return (
    <AuthLayout leftPanel={<PendingBrandPanel />} backTo={{ to: '/login', label: 'Back to Sign In' }}>
      <div className="max-w-xl w-full mx-auto space-y-6">
        
        {/* Header Block */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-[var(--color-brand-blue)] tracking-wider uppercase block">
            Registration Status
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-brand-navy)]">
            Account Submitted for Verification
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Your registration must be reviewed by an Administrator before you can access the programme workspace.
          </p>
        </div>

        {/* 1. Status Card */}
        <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Current Status
            </span>
            <Badge variant="warning" className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Pending Verification
            </Badge>
          </div>
          <p className="text-sm font-bold text-[var(--color-brand-navy)] mt-1">
            Administrator review required
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            Only verified Staff and Intern accounts can access the main system. Your login details will remain locked until review completes.
          </p>
        </div>

        {/* 2. Verification Journey Timeline */}
        <div className="space-y-3 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
            Verification Steps
          </h2>
          
          <div className="space-y-4 pt-1" role="list">
            
            {/* Step 1: Complete */}
            <div className="flex gap-3" role="listitem">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-[var(--color-brand-green)] flex items-center justify-center shrink-0 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" aria-label="Complete" />
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold text-slate-800">01 — Registration Submitted</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Details safely received in queue.</p>
              </div>
            </div>

            {/* Step 2: Pending */}
            <div className="flex gap-3" role="listitem">
              <div className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                <Clock className="w-3.5 h-3.5" aria-label="Pending" />
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold text-slate-800">02 — Administrator Review</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Verification details under inspection.</p>
              </div>
            </div>

            {/* Step 3: Locked */}
            <div className="flex gap-3" role="listitem">
              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 border border-slate-200">
                <Lock className="w-3.5 h-3.5" aria-label="Locked" />
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold text-slate-400">03 — System Access</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Locked until verification.</p>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Account Summary */}
        <div className="space-y-3 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <FileText className="w-4 h-4 text-[var(--color-brand-blue)]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
              Account Registration Summary
            </h2>
          </div>
          
          <div className="space-y-2 text-xs">
            {[
              { label: 'User Type', value: userTypeLabel },
              { label: 'User ID', value: registration?.userId || '—' },
              { label: 'Selected Role', value: userRoleLabel },
              { label: 'Email', value: registration?.email || '—' },
              { label: 'Mobile Number', value: registration?.phoneNumber || '—' },
              { label: 'Current Status', value: statusLabel },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-1 border-b border-slate-100 last:border-0">
                <span className="text-[var(--color-text-secondary)]">{label}</span>
                <span className="font-semibold text-[var(--color-brand-navy)] font-mono">{value}</span>
              </div>
            ))}
          </div>

          {!registration && (
            <p className="text-[11px] text-slate-500 text-center pt-1 leading-relaxed">
              No recent registration session detected. Please sign in or register a new account.
            </p>
          )}
        </div>

        {/* 4. What Happens Next Card */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[var(--color-brand-blue)]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
              What happens next?
            </h2>
          </div>
          <ol className="list-decimal pl-4 text-xs text-[var(--color-text-secondary)] space-y-2 leading-relaxed">
            <li>Administrator reviews your registration details.</li>
            <li>The registration request is approved (verified) or declined (rejected).</li>
            <li>Once verified, you will be able to sign in through the normal Login Portal.</li>
            <li>System access is granted immediately according to your verified account type and role.</li>
          </ol>
        </div>

        {/* 5. Navigation Actions */}
        <div className="space-y-3 pt-2">
          <Button
            onClick={() => navigate('/login')}
            variant="outline"
            size="lg"
            fullWidth
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Sign In
          </Button>

          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="lg"
            fullWidth
            leftIcon={<Home className="w-4 h-4" />}
          >
            Return to Home
          </Button>
        </div>

        {/* Security footnote */}
        <p className="text-xs text-[var(--color-text-secondary)] flex items-center justify-center gap-1.5 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-brand-blue)] shrink-0" aria-hidden="true" />
          <span>Security Gate · AI & Data Programme Pipeline</span>
        </p>

      </div>
    </AuthLayout>
  );
}
