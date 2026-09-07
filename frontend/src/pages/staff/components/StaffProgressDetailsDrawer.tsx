import React, { useEffect } from 'react';
import {
  X,
  FolderKanban,
  FileText,
  Activity,
  Layers,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { Button, Badge, EmptyState } from '../../../components/common';

export interface ProjectWorkItemContribution {
  id: string;
  workItemId?: string;
  title: string;
  percentageWeight: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  targetDate?: string;
  completionDate?: string;
}

export interface ProjectContribution {
  id: string;
  projectId: string;
  projectName: string;
  projectStatus: 'Planned' | 'Active' | 'On Hold' | 'Completed' | string;
  myRole?: string;
  startDate?: string;
  targetDate?: string;
  overallProgress: number;
  staffCompletedContribution: number;
  remainingContribution: number;
  assignedWorkItemsCount: number;
  notStartedCount: number;
  inProgressCount: number;
  completedCount: number;
  workItems?: ProjectWorkItemContribution[];
}

export interface StaffProgressDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contribution?: ProjectContribution | null;
}

export const StaffProgressDetailsDrawer: React.FC<StaffProgressDetailsDrawerProps> = ({
  isOpen,
  onClose,
  contribution,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !contribution) return null;

  const currentStatus = contribution.projectStatus || 'Planned';
  const overallProgressValue = Math.min(100, Math.max(0, contribution.overallProgress ?? 0));

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return (
          <Badge variant="success" size="sm">
            Active
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="blue" size="sm">
            Completed
          </Badge>
        );
      case 'on hold':
        return (
          <Badge variant="warning" size="sm">
            On Hold
          </Badge>
        );
      case 'planned':
      default:
        return (
          <Badge variant="info" size="sm">
            Planned
          </Badge>
        );
    }
  };

  const getWorkItemStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <Badge variant="success" size="sm">
            Completed
          </Badge>
        );
      case 'In Progress':
        return (
          <Badge variant="blue" size="sm">
            In Progress
          </Badge>
        );
      case 'Not Started':
      default:
        return (
          <Badge variant="info" size="sm">
            Not Started
          </Badge>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="staff-progress-details-title"
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-[var(--color-brand-navy)]/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-xl md:max-w-2xl bg-[var(--color-surface-white)] shadow-2xl flex flex-col h-full border-l border-[var(--color-border-subtle)]">
          {/* ── Sticky Header ───────────────────────────────────── */}
          <div className="px-6 py-5 border-b border-[var(--color-border-subtle)] flex items-start justify-between gap-4 bg-[var(--color-surface-white)] shrink-0">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="blue" size="sm">
                  Progress Contribution Details
                </Badge>
                <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {contribution.projectId}
                </span>
                {getStatusBadge(currentStatus)}
              </div>
              <h2
                id="staff-progress-details-title"
                className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-brand-navy)] truncate"
              >
                {contribution.projectName}
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Review your completed weights, progress metrics, and overall contribution to project milestones.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-brand-navy)] hover:bg-[var(--color-surface-subtle)] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-brand-blue)]/40 shrink-0"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Scrollable Body ─────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Header Summary Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/60 via-slate-50 to-white border border-[var(--color-border-subtle)] flex items-center gap-4 shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-brand-blue)] text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                <FolderKanban className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-[var(--color-brand-navy)] truncate">
                  {contribution.projectName}
                </h3>
                <div className="text-xs text-[var(--color-text-secondary)] flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="font-mono text-slate-600 font-semibold">
                    {contribution.projectId}
                  </span>
                  {contribution.myRole && (
                    <>
                      <span>•</span>
                      <span className="font-medium text-slate-700">Role: {contribution.myRole}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ── 1. READ-ONLY PROGRESS & CONTRIBUTION METRICS ──── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[var(--color-brand-blue)]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                    Progress & Contribution Metrics
                  </h4>
                </div>
                <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">
                  Read-only
                </span>
              </div>

              {/* Progress Bar Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--color-brand-navy)]">
                    Overall Project Progress
                  </span>
                  <span className="text-base font-bold text-[var(--color-brand-blue)] font-mono">
                    {overallProgressValue}%
                  </span>
                </div>

                <div
                  className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5"
                  role="progressbar"
                  aria-valuenow={overallProgressValue}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${contribution.projectName} overall progress`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      overallProgressValue === 100
                        ? 'bg-[var(--color-brand-green)]'
                        : 'bg-gradient-to-r from-blue-500 to-[var(--color-brand-blue)]'
                    }`}
                    style={{ width: `${overallProgressValue}%` }}
                  />
                </div>

                {/* Progress Breakdown Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <span className="text-[11px] text-slate-500 font-medium block">
                      Staff Completed Contribution
                    </span>
                    <p className="text-base font-bold text-[var(--color-brand-navy)] font-mono">
                      {contribution.staffCompletedContribution}%
                    </p>
                    <span className="text-[10px] text-emerald-700 font-medium">
                      Actively credited to project
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <span className="text-[11px] text-slate-500 font-medium block">
                      Remaining Contribution
                    </span>
                    <p className="text-base font-bold text-slate-600 font-mono">
                      {contribution.remainingContribution}%
                    </p>
                    <span className="text-[10px] text-slate-400">
                      Pending task completion
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 2. WORK ITEM COUNTS BREAKDOWN ─────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Layers className="w-4 h-4 text-[var(--color-brand-green)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Work Item Status Distribution
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium block">
                    Total Assigned
                  </span>
                  <p className="text-lg font-bold text-[var(--color-brand-navy)] font-mono">
                    {contribution.assignedWorkItemsCount}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-medium block">
                    Not Started
                  </span>
                  <p className="text-lg font-bold text-slate-600 font-mono">
                    {contribution.notStartedCount}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-sky-50/60 border border-sky-100 space-y-1">
                  <span className="text-[11px] text-sky-700 font-medium block">
                    In Progress
                  </span>
                  <p className="text-lg font-bold text-[var(--color-brand-blue)] font-mono">
                    {contribution.inProgressCount}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 space-y-1">
                  <span className="text-[11px] text-emerald-700 font-medium block">
                    Completed
                  </span>
                  <p className="text-lg font-bold text-[var(--color-status-success)] font-mono">
                    {contribution.completedCount}
                  </p>
                </div>
              </div>
            </div>

            {/* ── 3. PROJECT SPECIFICATIONS ─────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <FileText className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Project Information
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium block">
                    Project ID
                  </span>
                  <p className="font-mono font-semibold text-[var(--color-brand-navy)]">
                    {contribution.projectId}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium block">
                    Project Status
                  </span>
                  <div>{getStatusBadge(currentStatus)}</div>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Start Date
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)] font-mono">
                    {contribution.startDate || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Target Date
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)] font-mono">
                    {contribution.targetDate || '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── 4. WORK ITEM CONTRIBUTION BREAKDOWN ───────────── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[var(--color-brand-blue)]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                    Work-Item Contribution Breakdown
                  </h4>
                </div>
                {contribution.workItems && contribution.workItems.length > 0 && (
                  <Badge size="sm" variant="blue">
                    {contribution.workItems.length} {contribution.workItems.length === 1 ? 'Item' : 'Items'}
                  </Badge>
                )}
              </div>

              {contribution.workItems && contribution.workItems.length > 0 ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs" aria-label="Work Item Contribution Breakdown Table">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          <th scope="col" className="py-2.5 px-3">Work Item</th>
                          <th scope="col" className="py-2.5 px-3 text-center">Weight</th>
                          <th scope="col" className="py-2.5 px-3 text-center">Status</th>
                          <th scope="col" className="py-2.5 px-3 text-right">Contribution</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {contribution.workItems.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2.5 px-3">
                              <div className="font-semibold text-[var(--color-brand-navy)]">
                                {item.title}
                              </div>
                              <div className="font-mono text-[10px] text-slate-400">
                                {item.workItemId || item.id}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-700">
                              {item.percentageWeight}%
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              {getWorkItemStatusBadge(item.status)}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold">
                              {item.status === 'Completed' ? (
                                <span className="text-[var(--color-status-success)]">
                                  +{item.percentageWeight}% (Counted)
                                </span>
                              ) : (
                                <span className="text-slate-400">0% (Pending)</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <EmptyState
                    icon={<Layers className="w-6 h-6 text-slate-400" />}
                    title="No individual work items logged"
                    description="Individual tasks associated with this project will be listed here once assigned."
                    minHeight="min-h-[140px]"
                  />
                </div>
              )}
            </div>

            {/* ── 5. CALCULATION EXPLANATION CARD ───────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Activity className="w-4 h-4 text-[var(--color-brand-green)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Progress Calculation Policy
                </h4>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200 space-y-3 text-xs">
                <p className="font-semibold text-[var(--color-brand-navy)]">
                  Project progress is calculated automatically from completed work-item weights.
                </p>

                <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] bg-white p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-800">Completed Work Items</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-800">Predefined Percentage Weights</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="text-[var(--color-brand-blue)] font-bold">Project Progress</span>
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Only completed work-item percentage weights are counted toward overall project progress. Work items with status &quot;Not Started&quot; or &quot;In Progress&quot; do not contribute any weight until verified and completed.
                </p>
              </div>
            </div>
          </div>

          {/* ── Sticky Drawer Footer / Action Buttons ────────────── */}
          <div className="px-6 py-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)]/60 flex items-center justify-end shrink-0">
            <Button type="button" variant="outline" size="md" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
