/**
 * ProjectHealthSummary
 * Objective delivery status and project metrics widget.
 * Avoids arbitrary subjective classifications ("At Risk" / "Critical")
 * and presents objective, real delivery status counts:
 * - Active Execution
 * - Delivered Projects
 * - Scheduled Pipeline
 * - On Hold / Paused
 */
import React from 'react';
import { Activity, CheckCircle2, Clock, PauseCircle } from 'lucide-react';

export interface DeliveryMetrics {
  activeCount?: number;
  completedCount?: number;
  plannedCount?: number;
  onHoldCount?: number;
  completedWorkItems?: number;
  totalWorkItems?: number;
}

export interface HealthStatus {
  onTrack?: number;
  atRisk?: number;
  delayed?: number;
}

interface ProjectHealthSummaryProps {
  metrics?: DeliveryMetrics;
  health?: HealthStatus;
}

export const ProjectHealthSummary: React.FC<ProjectHealthSummaryProps> = ({
  metrics,
  health,
}) => {
  // If objective metrics are provided (recommended by BRD)
  if (metrics) {
    const items = [
      {
        key: 'active',
        label: 'Active Execution',
        value: metrics.activeCount ?? 0,
        icon: <Activity className="w-5 h-5 text-emerald-600" aria-hidden="true" />,
        bg: 'bg-emerald-50',
        border: 'border-emerald-100',
        textColor: 'text-emerald-700',
        description: 'Projects currently executing work items.',
      },
      {
        key: 'completed',
        label: 'Delivered',
        value: metrics.completedCount ?? 0,
        icon: <CheckCircle2 className="w-5 h-5 text-blue-600" aria-hidden="true" />,
        bg: 'bg-blue-50',
        border: 'border-blue-100',
        textColor: 'text-blue-700',
        description: 'Projects completed and verified.',
      },
      {
        key: 'planned',
        label: 'In Pipeline',
        value: metrics.plannedCount ?? 0,
        icon: <Clock className="w-5 h-5 text-indigo-600" aria-hidden="true" />,
        bg: 'bg-indigo-50',
        border: 'border-indigo-100',
        textColor: 'text-indigo-700',
        description: 'Projects scheduled in delivery pipeline.',
      },
      {
        key: 'onHold',
        label: 'On Hold',
        value: metrics.onHoldCount ?? 0,
        icon: <PauseCircle className="w-5 h-5 text-amber-600" aria-hidden="true" />,
        bg: 'bg-amber-50',
        border: 'border-amber-100',
        textColor: 'text-amber-700',
        description: 'Projects paused or awaiting adjustment.',
      },
    ];

    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" role="list" aria-label="Objective project delivery status">
        {items.map(({ key, label, value, icon, bg, border, textColor, description }) => (
          <div
            key={key}
            className={`flex flex-col items-center text-center gap-2 rounded-xl border p-3 ${bg} ${border}`}
            role="listitem"
            aria-label={`${label}: ${value}`}
          >
            <div className="w-9 h-9 rounded-lg bg-white/80 flex items-center justify-center shadow-2xs">
              {icon}
            </div>
            <div>
              <p className={`text-xl font-extrabold tracking-tight leading-none ${textColor}`}>
                {value}
              </p>
              <p className="text-[11px] font-semibold text-[var(--color-brand-navy)] mt-1">
                {label}
              </p>
            </div>
            <p className="text-[10px] text-[var(--color-text-secondary)] leading-tight hidden sm:block">
              {description}
            </p>
          </div>
        ))}
      </div>
    );
  }

  // Fallback for health if provided
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
      icon: <Clock className="w-5 h-5 text-amber-500" aria-hidden="true" />,
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      textColor: 'text-amber-700',
      description: 'Projects flagged for delivery review.',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3" role="list" aria-label="Project delivery overview">
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
