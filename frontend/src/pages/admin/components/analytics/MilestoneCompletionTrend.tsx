/**
 * MilestoneCompletionTrend
 * Line / area-chart skeleton placeholder.
 * Renders a pure-SVG grid + flat baseline in "pending" state.
 * Drop-in ready: replace the SVG content with a real chart once data is available.
 */
import React from 'react';
import { TrendingUp } from 'lucide-react';

export interface MilestoneTrendPoint {
  label: string;   // x-axis label (e.g. "Week 1")
  count: number;   // completed milestones at that point
}

interface MilestoneCompletionTrendProps {
  points?: MilestoneTrendPoint[];
  height?: number;
}

const GRID_LINES = 4;
const X_LABELS = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'];

export const MilestoneCompletionTrend: React.FC<MilestoneCompletionTrendProps> = ({
  points,
  height = 160,
}) => {
  const isPending = !points || points.length === 0;
  const W = 600;
  const H = height;
  const PADDING = { top: 12, right: 16, bottom: 28, left: 32 };
  const innerW = W - PADDING.left - PADDING.right;
  const innerH = H - PADDING.top - PADDING.bottom;

  // Build path from real points when provided
  const buildPath = (pts: MilestoneTrendPoint[]) => {
    if (pts.length === 0) return '';
    const maxCount = Math.max(...pts.map((p) => p.count), 1);
    const xStep = innerW / (pts.length - 1);
    return pts
      .map((p, i) => {
        const x = PADDING.left + i * xStep;
        const y = PADDING.top + innerH - (p.count / maxCount) * innerH;
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
      })
      .join(' ');
  };

  return (
    <div className="space-y-2">
      <div className="w-full overflow-hidden rounded-xl bg-slate-50/70 border border-[var(--color-border-subtle)]">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full"
          style={{ height }}
          aria-hidden="true"
        >
          {/* Horizontal grid lines */}
          {Array.from({ length: GRID_LINES + 1 }).map((_, i) => {
            const y = PADDING.top + (i / GRID_LINES) * innerH;
            return (
              <line
                key={i}
                x1={PADDING.left}
                x2={PADDING.left + innerW}
                y1={y}
                y2={y}
                stroke="var(--color-border-subtle, #e2e8f0)"
                strokeWidth="1"
                strokeDasharray={i === GRID_LINES ? undefined : '4 4'}
              />
            );
          })}

          {/* X-axis labels */}
          {X_LABELS.map((lbl, i) => {
            const x = PADDING.left + (i / (X_LABELS.length - 1)) * innerW;
            return (
              <text
                key={lbl}
                x={x}
                y={H - 6}
                textAnchor="middle"
                fontSize="9"
                fill="var(--color-text-muted, #94a3b8)"
                fontFamily="inherit"
              >
                {lbl}
              </text>
            );
          })}

          {/* Y-axis label */}
          <text
            x={PADDING.left - 6}
            y={PADDING.top + innerH / 2}
            textAnchor="middle"
            fontSize="9"
            fill="var(--color-text-muted, #94a3b8)"
            fontFamily="inherit"
            transform={`rotate(-90, ${PADDING.left - 16}, ${PADDING.top + innerH / 2})`}
          >
            Milestones
          </text>

          {isPending ? (
            /* Flat dashed baseline = no data */
            <>
              <line
                x1={PADDING.left}
                x2={PADDING.left + innerW}
                y1={PADDING.top + innerH}
                y2={PADDING.top + innerH}
                stroke="var(--color-brand-blue, #0ea5e9)"
                strokeWidth="2"
                strokeDasharray="8 6"
                opacity="0.4"
              />
              {/* Centre "no data" label */}
              <text
                x={W / 2}
                y={PADDING.top + innerH / 2}
                textAnchor="middle"
                fontSize="10"
                fill="var(--color-text-muted, #94a3b8)"
                fontFamily="inherit"
              >
                Milestone trend will appear once historical progress data is connected.
              </text>
            </>
          ) : (
            /* Real line path */
            <path
              d={buildPath(points!)}
              fill="none"
              stroke="var(--color-brand-blue, #0ea5e9)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}
        </svg>
      </div>

      {isPending && (
        <div className="flex items-center gap-1.5 justify-center">
          <TrendingUp className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
          <span className="text-[10px] text-[var(--color-text-muted)]">Awaiting programme data</span>
        </div>
      )}
    </div>
  );
};
