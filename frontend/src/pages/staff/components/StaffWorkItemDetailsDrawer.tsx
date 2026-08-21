import React, { useEffect } from 'react';
import {
  X,
  CheckSquare,
  FolderKanban,
  UserCheck,
  Calendar,
  Activity,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Button, Badge } from '../../../components/common';

export interface StaffWorkItem {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  requiredRole: string;
  percentageWeight: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  targetDate: string;
  assignedUser?: string;
  assignmentStatus?: string;
}

export interface StaffWorkItemDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  workItem?: StaffWorkItem | null;
  onStatusTransition?: (targetStatus: 'Not Started' | 'In Progress' | 'Completed') => void;
}

export const StaffWorkItemDetailsDrawer: React.FC<StaffWorkItemDetailsDrawerProps> = ({
  isOpen,
  onClose,
  workItem,
  onStatusTransition,
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

  const currentStatus = workItem?.status || 'Not Started';

  const getStatusBadge = (status: string) => {
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
      aria-labelledby="staff-work-item-details-title"
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
                  Work Item Details
                </Badge>
                {getStatusBadge(currentStatus)}
              </div>
              <h2
                id="staff-work-item-details-title"
                className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-brand-navy)]"
              >
                Work Item Overview
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Review specific task parameters, role requirements, and target completion progress.
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
                <CheckSquare className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-[var(--color-brand-navy)] truncate">
                  {workItem?.title || '—'}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 mt-0.5">
                  <span>Project:</span>
                  <span className="font-semibold text-slate-800">{workItem?.projectName || '—'}</span>
                  <span>({workItem?.projectId || '—'})</span>
                </p>
              </div>
            </div>

            {/* ── A. WORK ITEM INFORMATION ──────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <FolderKanban className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Work Item Information
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Work Item / Task
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {workItem?.title || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Associated Project
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {workItem?.projectName || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[var(--color-text-muted)]" />
                    Required Role
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {workItem?.requiredRole || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Percentage Weight
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {workItem?.percentageWeight !== undefined ? `${workItem.percentageWeight}%` : '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Current Status
                  </span>
                  <div>{getStatusBadge(currentStatus)}</div>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Target Date
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {workItem?.targetDate || '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── B. ASSIGNMENT INFORMATION ─────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <UserCheck className="w-4 h-4 text-[var(--color-brand-green)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Assignment Details
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Assigned User
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {workItem?.assignedUser || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    User Role
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    Permanent Staff
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Assignment Status
                  </span>
                  <Badge variant="success" size="sm">
                    {workItem?.assignmentStatus || 'Assigned'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* ── C. PROGRESS CONTRIBUTION ──────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Activity className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Progress Contribution
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Predefined Weight
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {workItem?.percentageWeight !== undefined ? `${workItem.percentageWeight}%` : '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Current Contribution
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {currentStatus === 'Completed' && workItem?.percentageWeight !== undefined
                      ? `${workItem.percentageWeight}%`
                      : '0%'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Project Progress Impact
                  </span>
                  <p className="font-semibold text-[var(--color-brand-blue)] font-bold">
                    {currentStatus === 'Completed' && workItem?.percentageWeight !== undefined
                      ? `+${workItem.percentageWeight}% Overall`
                      : '0%'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                <p className="font-medium text-[var(--color-brand-navy)]">
                  Completed work-item weights contribute automatically to project progress:
                </p>
                <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] bg-white p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-800">Work Item Completed</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-800">Percentage Weight Counted</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="text-[var(--color-brand-blue)] font-bold">Project Progress Updated</span>
                </div>
              </div>
            </div>

            {/* ── D. STATUS / ACTIVITY ──────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Calendar className="w-4 h-4 text-[var(--color-brand-green)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Status Transition Actions
                </h4>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                {currentStatus === 'Not Started' && (
                  <div className="space-y-2">
                    <p className="text-slate-600">This work item is waiting to start. You can transition it to In Progress to begin work.</p>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => onStatusTransition && onStatusTransition('In Progress')}
                    >
                      Start Work
                    </Button>
                  </div>
                )}

                {currentStatus === 'In Progress' && (
                  <div className="space-y-3">
                    <p className="text-slate-600">This work item is currently active. You can mark it completed or revert it to not started.</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="green"
                        size="sm"
                        onClick={() => onStatusTransition && onStatusTransition('Completed')}
                      >
                        Mark as Completed
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onStatusTransition && onStatusTransition('Not Started')}
                      >
                        Revert to Not Started
                      </Button>
                    </div>
                  </div>
                )}

                {currentStatus === 'Completed' && (
                  <div className="space-y-1">
                    <p className="text-slate-600 font-semibold text-[var(--color-brand-navy)] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[var(--color-brand-green)]" />
                      Completed & Read-Only
                    </p>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      Completed work items are archived. Reopening completed items is currently not permitted by standard governance rules.
                    </p>
                  </div>
                )}
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
