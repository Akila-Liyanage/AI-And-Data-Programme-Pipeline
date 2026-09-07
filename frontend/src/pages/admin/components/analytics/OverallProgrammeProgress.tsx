/**
 * OverallProgrammeProgress
 * SVG radial-progress ring that renders in a "pending" state
 * until real backend data is connected.
 *
 * - Shows "—%" centre text
 * - Dashed ring in slate colour signals no-data
 * - Drop-in ready: pass `percent` (0-100) to illuminate the ring
 */
import React from 'react';

interface OverallProgrammeProgressProps {
  /** 0-100. When undefined the component renders pending state. */
  percent?: number;
  size?: number;
  strokeWidth?: number;
}

export const OverallProgrammeProgress: React.FC<OverallProgrammeProgressProps> = ({
  percent,
  size = 160,
  strokeWidth = 14,
}) => {
  const isPending = percent === undefined || percent === null;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = isPending ? circumference : circumference - (percent! / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Track */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            stroke="var(--color-border-subtle, #e2e8f0)"
            strokeDasharray={isPending ? '6 4' : undefined}
          />
          {/* Progress arc — hidden in pending state */}
          {!isPending && (
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              strokeWidth={strokeWidth}
              stroke="var(--color-brand-blue, #0ea5e9)"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
          )}
        </svg>

        {/* Centre text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
          <span
            className={`font-extrabold tracking-tight leading-none ${
              isPending
                ? 'text-3xl text-[var(--color-text-muted)]'
                : 'text-3xl text-[var(--color-brand-blue)]'
            }`}
          >
            {isPending ? '—' : `${percent}%`}
          </span>
          <span className="text-[10px] font-medium text-[var(--color-text-secondary)] mt-1 text-center px-2">
            {isPending ? 'No progress records' : 'Programme Progress'}
          </span>
        </div>
      </div>

      {/* Legend row */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-[var(--color-text-secondary)]">
        {[
          { label: 'Completed', color: 'bg-[var(--color-brand-blue)]' },
          { label: 'Remaining', color: 'bg-slate-200' },
        ].map(({ label, color }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};
