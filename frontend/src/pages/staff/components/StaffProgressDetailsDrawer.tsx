import React, { useEffect } from 'react';
import {
  X,
  FolderKanban,
  FileText,
  Activity,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Button, Badge } from '../../../components/common';

export interface ProjectContribution {
  id: string;
  projectName: string;
  myRole: string;
  projectStatus: string;
  assignedWorkItemsCount: number | string;
  notStartedCount: number | string;
  inProgressCount: number | string;
  completedCount: number | string;
  completedWeight: number | string;
  projectProgress: number | string;
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

  if (!isOpen) return null;

  const currentStatus = contribution?.projectStatus || 'Planned';

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
              <div className="flex items-center gap-2">
                <Badge variant="blue" size="sm">
                  Progress Contribution Details
                </Badge>
                {getStatusBadge(currentStatus)}
              </div>
              <h2
                id="staff-progress-details-title"
                className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-brand-navy)]"
              >
                Contribution & Progress Breakdown
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Review your completed weights, progress metrics, and overall contribution to project milestones.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-brand-navy)] hover:bg-[var(--color-surface-subtle)] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-brand-blue)]/40"
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
                  {contribution?.projectName || '—'}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 mt-0.5">
                  <span>My Role:</span>
                  <span className="font-semibold text-slate-800">{contribution?.myRole || '—'}</span>
                </p>
              </div>
            </div>

            {/* ── A. PROJECT INFORMATION ────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <FileText className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Project Information
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Project Name
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)] truncate">
                    {contribution?.projectName || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    My Role
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {contribution?.myRole || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Project Status
                  </span>
                  <div>{getStatusBadge(currentStatus)}</div>
                </div>
              </div>
            </div>

            {/* ── B. WORK ITEM SUMMARY ──────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Layers className="w-4 h-4 text-[var(--color-brand-green)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Work Item Summary
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1 text-center">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium block">
                    Assigned
                  </span>
                  <p className="text-lg font-bold text-[var(--color-brand-navy)]">
                    {contribution?.assignedWorkItemsCount !== undefined ? contribution.assignedWorkItemsCount : '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1 text-center">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium block">
                    Not Started
                  </span>
                  <p className="text-lg font-bold text-slate-500">
                    {contribution?.notStartedCount !== undefined ? contribution.notStartedCount : '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1 text-center">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium block">
                    In Progress
                  </span>
                  <p className="text-lg font-bold text-[var(--color-brand-blue)]">
                    {contribution?.inProgressCount !== undefined ? contribution.inProgressCount : '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1 text-center">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium block">
                    Completed
                  </span>
                  <p className="text-lg font-bold text-[var(--color-brand-green)]">
                    {contribution?.completedCount !== undefined ? contribution.completedCount : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── C. CONTRIBUTION & PROGRESS ────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Activity className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Contribution & Progress Impact
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    My Completed Weight Contribution
                  </span>
                  <p className="text-lg font-bold text-[var(--color-brand-navy)]">
                    {contribution?.completedWeight !== undefined ? `${contribution.completedWeight}%` : '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Overall Project Progress
                  </span>
                  <p className="text-lg font-bold text-[var(--color-brand-blue)]">
                    {contribution?.projectProgress !== undefined ? `${contribution.projectProgress}%` : '—%'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── D. CALCULATION EXPLANATION ────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Activity className="w-4 h-4 text-[var(--color-brand-green)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  How Progress is Calculated
                </h4>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center gap-2 font-mono text-[10px] bg-white p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-800">Completed Work Item Weights</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="text-[var(--color-brand-blue)] font-bold">Project Progress</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Only completed work-item percentage weights are counted toward project progress. Work items with Status other than "Completed" do not contribute any weight to the project progress metric.
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
