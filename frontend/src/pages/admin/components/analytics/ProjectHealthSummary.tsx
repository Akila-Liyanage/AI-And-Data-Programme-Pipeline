/**
 * ProjectHealthSummary
 * Compact icon + text health-status widget.
 * Each status (On Track / At Risk / Delayed) shows a neutral "—"
 * placeholder until real backend data is connected.
 * Uses icon + text, never color alone, for accessibility.
 */
import React from 'react';
import { CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export interface HealthStatus {
  onTrack?: number;
  atRisk?: number;
  delayed?: number;
}

interface ProjectHealthSummaryProps {
  health?: HealthStatus;
}

export const ProjectHealthSummary: React.FC<ProjectHealthSummaryProps> = ({
  health,
}) => {
  const isPending = !health;

  const items = [
    {
      key: 'onTrack',
      label: 'On Track',
      value: health?.onTrack,
      icon: <CheckCircle2 className="w-5 h-5 text-[var(--color-brand-green)]" aria-hidden="true" />,
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      textColor: 'text-emerald-700',
      description: 'Projects progressing as planned.',
    },
    {
      key: 'atRisk',
      label: 'At Risk',
      value: health?.atRisk,
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />,
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      textColor: 'text-amber-700',
      description: 'Projects flagged as potentially delayed.',
    },
    {
      key: 'delayed',
      label: 'Delayed',
      value: health?.delayed,
      icon: <Clock className="w-5 h-5 text-rose-500" aria-hidden="true" />,
      bg: 'bg-rose-50',
      border: 'border-rose-100',
      textColor: 'text-rose-700',
      description: 'Projects behind the target schedule.',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3" role="list" aria-label="Project health summary">
      {items.map(({ key, label, value, icon, bg, border, textColor, description }) => (
        <div
          key={key}
          className={`flex flex-col items-center text-center gap-2 rounded-xl border p-3 ${bg} ${border}`}
          role="listitem"
          aria-label={`${label}: ${value !== undefined ? value : 'Data pending'}`}
        >
          <div className="w-9 h-9 rounded-lg bg-white/70 flex items-center justify-center shadow-2xs">
            {icon}
          </div>
          <div>
            <p className={`text-xl font-extrabold tracking-tight leading-none ${textColor}`}>
              {value !== undefined ? value : '—'}
            </p>
            <p className="text-[11px] font-semibold text-[var(--color-brand-navy)] mt-0.5">
              {label}
            </p>
          </div>
          {isPending && (
            <p className="text-[10px] text-[var(--color-text-secondary)] leading-tight">
              Awaiting data
            </p>
          )}
          <p className="text-[10px] text-[var(--color-text-secondary)] leading-tight hidden sm:block">
            {description}
          </p>
        </div>
      ))}
    </div>
  );
};
