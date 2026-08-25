import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '../../../utils/cn';

export interface AuthLayoutProps {
  /** Content rendered in the left (brand/info) panel */
  leftPanel: React.ReactNode;
  /** Content rendered in the right (form) panel */
  children: React.ReactNode;
  /** Back-navigation link config */
  backTo?: { to: string; label: string };
  /** Footer text override */
  footerText?: string;
  /** Extra class for the outer page wrapper */
  className?: string;
}

/**
 * Modern High-Impact Auth Layout Shell.
 * Provides: Wider responsive container (max-w-6xl), soft ambient glows, glassmorphism, and smooth entrance motion.
 */
export const AuthLayout: React.FC<AuthLayoutProps> = ({
  leftPanel,
  children,
  backTo = { to: '/', label: 'Back to Home' },
  footerText = 'AI & Data Programme Pipeline — Staff & Intern Progress Dashboard · Internal Enterprise System',
  className,
}) => {
  return (
    <div
      className={cn(
        'min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/40 flex flex-col',
        'selection:bg-blue-100 selection:text-blue-900 relative overflow-x-hidden',
        className
      )}
    >
      {/* Decorative ambient background glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ── Top Navigation Bar ─────────────────────────────── */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shrink-0 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link
            to={backTo.to}
            className={cn(
              'inline-flex items-center gap-2 text-xs font-semibold',
              'text-slate-600 hover:text-blue-600',
              'transition-all duration-200 group',
              'focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500/30 rounded-lg px-2 py-1 hover:bg-slate-100/60'
            )}
            aria-label={backTo.label}
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 duration-200" />
            <span>{backTo.label}</span>
          </Link>

          <div className="flex items-center gap-2.5 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
              Secure Enterprise Portal
            </span>
          </div>
        </div>
      </header>

      {/* ── Main Auth Card Container ─────────────────────────── */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div
          className={cn(
            'w-full max-w-6xl bg-white',
            'rounded-3xl border border-slate-200/90',
            'shadow-[0_12px_48px_rgba(15,23,42,0.08)]',
            'overflow-hidden grid grid-cols-1 lg:grid-cols-12',
            'transition-all duration-300 transform',
            'animate-in fade-in zoom-in-[0.99] duration-300'
          )}
        >
          {/* Left panel – 5 columns on lg+ */}
          <div className="lg:col-span-5 flex flex-col justify-between">{leftPanel}</div>

          {/* Right panel – 7 columns on lg+ with wide padding */}
          <div className="lg:col-span-7 px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12 flex flex-col justify-center bg-white">
            {children}
          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200/80 bg-white/60 backdrop-blur-xs shrink-0">
        {footerText}
      </footer>
    </div>
  );
};
