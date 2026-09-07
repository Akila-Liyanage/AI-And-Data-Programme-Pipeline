/**
 * RegistrationPlaceholderPage.tsx
 *
 * STEP 1 PLACEHOLDER.
 * Renders a safe, non-functional placeholder screen for the public
 * Staff & Intern registration route (/register).
 *
 * STRICT BOUNDARIES:
 * - NO real registration form.
 * - NO fake form submission or input fields.
 * - NO fake/mock API requests.
 * - NO local state / localStorage persistence.
 */
import { useNavigate } from 'react-router-dom';
import {
  Smartphone,
  Users,
  ShieldAlert,
  ArrowLeft,
  Settings,
} from 'lucide-react';
import { Badge, Button } from '../../components/common';
import { AuthLayout } from '../../components/layout/AuthLayout';

/* ── Brand Panel for Registration AuthLayout ───────────────── */
function RegBrandPanel() {
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
            Self-Registration Flow
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug">
            Create an account to join the progress dashboard.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Registered accounts undergo administrative review. Once verified by your supervisor, you will receive full workspace credentials.
          </p>
        </div>

        {/* Supporting info */}
        <div className="space-y-4 pt-1">
          {[
            {
              icon: <Users className="w-4 h-4" />,
              color: 'text-[var(--color-brand-green)]',
              label: 'Staff & Intern Access Only',
              detail: 'Administrator profiles cannot be self-registered and require manual backend provisioning.',
            },
            {
              icon: <ShieldAlert className="w-4 h-4" />,
              color: 'text-[var(--color-brand-blue-light)]',
              label: 'Pending Verification State',
              detail: 'Newly registered users cannot sign in until an administrator verifies the account.',
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
      </div>

      <p className="text-[11px] text-slate-400 mt-6 relative z-10">
        © SLT-MOBITEL AI & Data Team. All rights reserved.
      </p>
    </div>
  );
}

/* ── Main Placeholder Component ───────────────────────────── */
export default function RegistrationPlaceholderPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout leftPanel={<RegBrandPanel />} backTo={{ to: '/login', label: 'Back to Sign In' }}>
      <div className="max-w-md w-full mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-[var(--color-brand-blue)] tracking-wider uppercase block">
            Staff & Intern Registration
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-brand-navy)]">
            Create Your Programme Account
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Staff and Intern registration will be available here.
          </p>
        </div>

        {/* BRD Info Card */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2 text-[var(--color-brand-navy)]">
            <Settings className="w-4 h-4 text-[var(--color-brand-blue)] animate-spin-slow" />
            <h2 className="text-xs font-bold uppercase tracking-widest">
              Updated BRD Flow
            </h2>
          </div>
          
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            Registration will support Staff and Intern users only. Accounts will require administrator verification before system access.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
              Registration Gateway Active
            </span>
          </div>
        </div>

        {/* Visual action button back to sign in */}
        <div className="space-y-3">
          <Button
            onClick={() => navigate('/login')}
            variant="outline"
            size="lg"
            fullWidth
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Sign In
          </Button>
        </div>

        {/* Security footnote */}
        <p className="text-xs text-[var(--color-text-secondary)] flex items-center justify-center gap-1.5 pt-1">
          <Smartphone className="w-3.5 h-3.5 text-[var(--color-brand-blue)] shrink-0" aria-hidden="true" />
          <span>Self-Registration Gateway · Verified Access</span>
        </p>

      </div>
    </AuthLayout>
  );
}
