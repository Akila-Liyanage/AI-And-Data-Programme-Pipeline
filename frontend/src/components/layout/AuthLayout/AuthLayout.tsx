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
 * Shared two-column authentication page shell.
 * Provides: sticky header bar, two-column card container, footer.
 * Left/right panel content is injected by each auth page.
 * Contains NO authentication business logic.
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
        'min-h-screen bg-[var(--color-app-bg)] flex flex-col',
        'selection:bg-[var(--color-brand-blue-light)] selection:text-[var(--color-brand-blue)]',
        className
      )}
    >
      {/* ── Top Navigation Bar ─────────────────────────────── */}
      <header className="w-full bg-[var(--color-surface-white)] border-b border-[var(--color-border-subtle)] shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link
            to={backTo.to}
            className={cn(
              'inline-flex items-center gap-2 text-xs font-semibold',
              'text-[var(--color-text-secondary)] hover:text-[var(--color-brand-blue)]',
              'transition-colors group',
              'focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-brand-blue)]/30 rounded-md px-1'
            )}
            aria-label={backTo.label}
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>{backTo.label}</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-brand-green)]" aria-hidden="true" />
            <span className="hidden sm:inline font-medium">Enterprise Portal</span>
          </div>
        </div>
      </header>

      {/* ── Main Auth Card ──────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div
          className={cn(
            'w-full max-w-5xl bg-[var(--color-surface-white)]',
            'rounded-2xl border border-[var(--color-border-subtle)]',
            'shadow-[0_4px_32px_rgba(11,31,58,0.08)]',
            'overflow-hidden grid grid-cols-1 lg:grid-cols-12'
          )}
        >
          {/* Left panel – 5 columns on lg+ */}
          <div className="lg:col-span-5">{leftPanel}</div>

          {/* Right panel – 7 columns on lg+ */}
          <div className="lg:col-span-7 px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14 flex flex-col justify-center bg-[var(--color-surface-white)]">
            {children}
          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="py-5 text-center text-xs text-[var(--color-text-secondary)] border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] shrink-0">
        {footerText}
      </footer>
    </div>
  );
};
