/**
 * TeamParticipationDistribution
 * CSS segmented-bar + legend donut-style placeholder.
 * Shows 4 participation categories in pending state.
 * Drop-in ready: pass `data` with real counts.
 */
import React from 'react';
import { Users } from 'lucide-react';

export interface TeamSegment {
  label: string;
  count?: number;
  color: string;   // Tailwind bg class
  textColor: string;
}

const DEFAULT_SEGMENTS: TeamSegment[] = [
  { label: 'Permanent Staff',    color: 'bg-[var(--color-brand-blue)]',  textColor: 'text-blue-700' },
  { label: 'Interns',            color: 'bg-emerald-400',               textColor: 'text-emerald-700' },
  { label: 'Active Contributors', color: 'bg-indigo-400',               textColor: 'text-indigo-700' },
  { label: 'Pending Allocations', color: 'bg-amber-300',                textColor: 'text-amber-700' },
];

interface TeamParticipationDistributionProps {
  data?: TeamSegment[];
}

export const TeamParticipationDistribution: React.FC<TeamParticipationDistributionProps> = ({
  data,
}) => {
  const isPending = !data || data.every((s) => s.count === undefined);
  const segments = data ?? DEFAULT_SEGMENTS;
  const total = segments.reduce((s, seg) => s + (seg.count ?? 0), 0);

  return (
    <div className="flex flex-col gap-4 py-2">
      {/* Segmented bar */}
      <div
        className="w-full h-5 rounded-full overflow-hidden flex gap-0.5 bg-slate-100"
        role="img"
        aria-label="Team participation distribution"
      >
        {isPending ? (
          <div className="flex-1 h-full border-2 border-dashed border-slate-300 rounded-full bg-slate-50" />
        ) : (
          segments.map(({ label, count, color }) => {
            const pct = total > 0 ? ((count ?? 0) / total) * 100 : 0;
            return pct > 0 ? (
              <div
                key={label}
                className={`h-full ${color} transition-all duration-500`}
                style={{ width: `${pct}%` }}
                title={`${label}: ${count}`}
              />
            ) : null;
          })
        )}
      </div>

      {/* Legend */}
      <ul className="w-full space-y-2" role="list">
        {segments.map(({ label, count, color, textColor }) => (
          <li key={label} className="flex items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-2 min-w-0">
              <span className={`w-3 h-3 rounded-sm shrink-0 ${color}`} aria-hidden="true" />
              <span className="text-[var(--color-text-primary)] font-medium truncate">{label}</span>
            </span>
            <span className={`font-bold shrink-0 ${textColor}`}>
              {count !== undefined ? count : '—'}
            </span>
          </li>
        ))}
      </ul>

      {isPending && (
        <div className="flex items-center gap-1.5 justify-center">
          <Users className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
          <span className="text-[10px] text-[var(--color-text-muted)]">
            Team distribution will appear once allocation data is connected.
          </span>
        </div>
      )}
    </div>
  );
};
