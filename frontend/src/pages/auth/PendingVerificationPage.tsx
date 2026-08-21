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
import { useNavigate } from 'react-router-dom';
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
    <div className="bg-[var(--color-brand-navy)] px-8 py-10 sm:px-10 sm:py-12 text-white flex flex-col justify-between h-full relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute -top-12 -right-12 w-52 h-52 bg-[var(--color-brand-blue)]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-[var(--color-brand-green)]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative space-y-7">
        {/* Emblem */}
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
            Verification Queue
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug">
            Your registration is safely queued for review.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The administrator validates system access to ensure proper role security and division mapping.
          </p>
        </div>

        {/* Informative tips */}
        <div className="space-y-4 pt-1">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-[var(--color-brand-blue-light)]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Pending Approval</p>
              <p className="text-xs text-slate-400 leading-snug mt-0.5">
                Verification status is tracked in real-time. Contact your coordinator if review takes longer than 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 mt-6 relative z-10">
        © SLT-MOBITEL AI & Data Team. All rights reserved.
      </p>
    </div>
  );
}

/* ── Main Page Component ────────────────────────────────── */
export default function PendingVerificationPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout leftPanel={<PendingBrandPanel />} backTo={{ to: '/login', label: 'Back to Sign In' }}>
      <div className="max-w-md w-full mx-auto space-y-6">
        
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

        {/* 3. Account Summary Placeholder */}
        <div className="space-y-3 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <FileText className="w-4 h-4 text-[var(--color-brand-blue)]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
              Account Registration Summary
            </h2>
          </div>
          
          <div className="space-y-2 text-xs">
            {[
              { label: 'User Type', value: '—' },
              { label: 'User ID', value: '—' },
              { label: 'Selected Role', value: '—' },
              { label: 'Email', value: '—' },
              { label: 'Mobile Number', value: '—' },
              { label: 'Current Status', value: 'Pending' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-1 border-b border-slate-100 last:border-0">
                <span className="text-[var(--color-text-secondary)]">{label}</span>
                <span className="font-semibold text-[var(--color-brand-navy)] font-mono">{value}</span>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-slate-500 text-center italic pt-1 leading-relaxed">
            "Registration details will be displayed after backend integration."
          </p>
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
