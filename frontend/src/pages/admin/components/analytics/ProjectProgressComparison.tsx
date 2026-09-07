/**
 * ProjectProgressComparison
 * Horizontal bar-chart placeholder.
 * Renders a set of bar rows for each project.
 * In pending state, rows are shown as greyed skeleton bars.
 *
 * Drop-in ready: pass `items` array with real project names + progress values.
 */
import React from 'react';
import { BarChart2 } from 'lucide-react';

export interface ProjectProgressItem {
  name: string;
  projectId: string;
  percent: number;  // 0-100
  status?: string;
}

interface ProjectProgressComparisonProps {
  items?: ProjectProgressItem[];
}

const SKELETON_ROWS = 4; // number of ghost rows to show in pending state

export const ProjectProgressComparison: React.FC<ProjectProgressComparisonProps> = ({
  items,
}) => {
  const isPending = !items || items.length === 0;

  return (
    <div className="space-y-3" role="list" aria-label="Project progress comparison">
      {/* Axis labels */}
      <div className="flex items-center justify-between text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider px-0.5">
        <span>Project</span>
        <span>Progress %</span>
      </div>

      {isPending ? (
        <>
          {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
            <div key={i} className="flex items-center gap-3" role="listitem" aria-hidden="true">
              {/* Label skeleton */}
              <div className="w-32 shrink-0 space-y-1">
                <div
                  className="h-2.5 rounded-full bg-slate-200"
                  style={{ width: `${60 + (i % 3) * 15}%` }}
                />
                <div className="h-2 rounded-full bg-slate-100 w-16" />
              </div>
              {/* Bar skeleton */}
              <div className="flex-1 h-4 rounded-full bg-slate-100 border border-dashed border-slate-200" />
              {/* Value skeleton */}
              <span className="text-[11px] font-bold text-[var(--color-text-muted)] w-8 text-right">—</span>
            </div>
          ))}
          <p className="text-[11px] text-[var(--color-text-secondary)] text-center pt-1">
            Project progress bars will appear when project records are available.
          </p>
        </>
      ) : (
        items!.map((item) => {
          const pct = Math.max(0, Math.min(100, item.percent));
          return (
            <div key={item.projectId} className="flex items-center gap-3" role="listitem">
              <div className="w-32 shrink-0">
                <p className="text-xs font-semibold text-[var(--color-brand-navy)] truncate leading-tight">
                  {item.name}
                </p>
                <p className="text-[10px] font-mono text-[var(--color-text-muted)]">{item.projectId}</p>
              </div>
              <div className="flex-1 h-4 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--color-brand-blue)] transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-[var(--color-brand-blue)] w-10 text-right">
                {pct}%
              </span>
            </div>
          );
        })
      )}

      {/* Bottom axis line */}
      <div className="flex items-center gap-3 pt-1 text-[10px] text-[var(--color-text-muted)]">
        <div className="w-32 shrink-0" />
        <div className="flex-1 flex justify-between">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
        {/* spacer to match value column width */}
        <div className="w-10" />
      </div>
      {isPending && (
        <div className="flex items-center gap-2 pt-1 justify-center">
          <BarChart2 className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
          <span className="text-[10px] text-[var(--color-text-muted)]">Awaiting programme data</span>
        </div>
      )}
    </div>
  );
};
