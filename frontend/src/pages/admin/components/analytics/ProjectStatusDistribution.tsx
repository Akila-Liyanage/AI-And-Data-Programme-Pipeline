/**
 * ProjectStatusDistribution
 * CSS-only donut chart placeholder.
 * Renders the four project status segments as labelled swatches
 * in a pending state until real data is connected.
 *
 * Drop-in ready: pass `data` array with real counts to drive the donut.
 */
import React from 'react';
import { PieChart } from 'lucide-react';

export interface StatusSegment {
  label: string;
  count?: number;
  color: string;       // Tailwind bg class
  textColor: string;   // Tailwind text class
}

const DEFAULT_SEGMENTS: StatusSegment[] = [
  { label: 'Planned',   color: 'bg-indigo-200', textColor: 'text-indigo-700' },
  { label: 'Active',    color: 'bg-[var(--color-brand-green)]', textColor: 'text-emerald-700' },
  { label: 'On Hold',   color: 'bg-amber-200',  textColor: 'text-amber-700' },
  { label: 'Completed', color: 'bg-[var(--color-brand-blue)]', textColor: 'text-blue-700' },
];

interface ProjectStatusDistributionProps {
  data?: StatusSegment[];
}

export const ProjectStatusDistribution: React.FC<ProjectStatusDistributionProps> = ({
  data,
}) => {
  const isPending = !data || data.every((s) => s.count === undefined);
  const segments = data ?? DEFAULT_SEGMENTS;

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      {/* Visual donut placeholder */}
      <div className="relative w-36 h-36" aria-hidden="true">
        {isPending ? (
          /* Dashed circle — no-data state */
          <svg viewBox="0 0 144 144" className="w-full h-full">
            <circle
              cx="72" cy="72" r="56"
              fill="none"
              strokeWidth="18"
              stroke="var(--color-border-subtle, #e2e8f0)"
              strokeDasharray="8 5"
            />
          </svg>
        ) : (
          /* Future: replace with a real donut drawn from `data` */
          <svg viewBox="0 0 144 144" className="w-full h-full">
            <circle
              cx="72" cy="72" r="56"
              fill="none"
              strokeWidth="18"
              stroke="var(--color-brand-blue, #0ea5e9)"
            />
          </svg>
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <PieChart className="w-7 h-7 text-[var(--color-text-muted)]" />
          <span className="text-[10px] font-medium text-[var(--color-text-muted)] mt-0.5 text-center px-2 leading-tight">
            {isPending ? 'No data' : 'Status mix'}
          </span>
        </div>
      </div>

      {/* Legend */}
      <ul className="w-full space-y-1.5 px-2" role="list">
        {segments.map(({ label, count, color, textColor }) => (
          <li key={label} className="flex items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-sm shrink-0 ${color}`} aria-hidden="true" />
              <span className="text-[var(--color-text-primary)] font-medium">{label}</span>
            </span>
            <span className={`font-bold ${textColor}`}>
              {count !== undefined ? count : '—'}
            </span>
          </li>
        ))}
      </ul>

      {isPending && (
        <p className="text-[10px] text-[var(--color-text-secondary)] text-center">
          Distribution will appear when project records are available.
        </p>
      )}
    </div>
  );
};
