/**
 * ChartPending — shared "awaiting data" shell used inside every chart card.
 * Renders a centred icon + descriptive label so the Admin understands
 * that the container is ready but awaiting real backend data.
 */
import React from 'react';
import { BarChart3 } from 'lucide-react';

interface ChartPendingProps {
  /** Icon to display – defaults to BarChart3 */
  icon?: React.ReactNode;
  /** Short label under the icon */
  label?: string;
  /** Extra height class, e.g. "h-48" or "h-64" */
  heightClass?: string;
}

export const ChartPending: React.FC<ChartPendingProps> = ({
  icon,
  label = 'Awaiting programme data',
  heightClass = 'h-52',
}) => (
  <div
    className={`${heightClass} w-full flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[var(--color-border-subtle)] bg-slate-50/60`}
    aria-label={label}
  >
    <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-blue-light)] text-[var(--color-brand-blue)] flex items-center justify-center">
      {icon ?? <BarChart3 className="w-5 h-5" />}
    </div>
    <p className="text-xs font-medium text-[var(--color-text-secondary)] text-center px-4 leading-relaxed">
      {label}
    </p>
  </div>
);
