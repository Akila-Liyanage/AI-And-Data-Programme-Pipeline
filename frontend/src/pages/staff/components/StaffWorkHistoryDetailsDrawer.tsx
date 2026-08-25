import React, { useEffect } from 'react';
import {
  X,
  FolderKanban,
  FileText,
  Activity,
  Layers,
  ArrowRight,
  UserCheck,
  Calendar,
} from 'lucide-react';
import { Button, Badge } from '../../../components/common';

export interface StaffHistoryRecord {
  id: string;
  workItemId: string;
  workItemTitle: string;
  projectId: string;
  projectName: string;
  requiredRole: string;
  percentageWeight: number;
  finalStatus: string;
  completionDate: string;
  progressContribution: number | string;
  assignedUser: string;
  userRole: string;
  assignmentStatus: string;
}

export interface StaffWorkHistoryDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record?: StaffHistoryRecord | null;
}

export const StaffWorkHistoryDetailsDrawer: React.FC<StaffWorkHistoryDetailsDrawerProps> = ({
  isOpen,
  onClose,
  record,
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

  const currentStatus = record?.finalStatus || 'Completed';

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <Badge variant="success" size="sm">
            Completed
          </Badge>
        );
      case 'in progress':
        return (
          <Badge variant="blue" size="sm">
            In Progress
          </Badge>
        );
      case 'not started':
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
      aria-labelledby="staff-history-details-title"
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
                  Work History Record Details
                </Badge>
                {getStatusBadge(currentStatus)}
              </div>
              <h2
                id="staff-history-details-title"
                className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-brand-navy)]"
              >
                Work Item Completion Details
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Review completed work metrics, progress contributions, and timeline updates.
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
                  {record?.workItemTitle || '—'}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  Project: <span className="font-semibold text-slate-800">{record?.projectName || '—'}</span>
                </p>
              </div>
            </div>

            {/* ── A. WORK ITEM INFORMATION ──────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <FileText className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Work Item Information
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Work Item Task
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)] truncate">
                    {record?.workItemTitle || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Project
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)] truncate">
                    {record?.projectName || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Required Role
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {record?.requiredRole || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Predefined Percentage Weight
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {record?.percentageWeight !== undefined ? `${record.percentageWeight}%` : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── B. CONTRIBUTION INFORMATION ───────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Activity className="w-4 h-4 text-[var(--color-brand-green)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Contribution Information
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Progress Contribution
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {record?.progressContribution !== undefined ? `${record.progressContribution}%` : '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Completion Date
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {record?.completionDate || '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── C. ASSIGNMENT INFORMATION ─────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <UserCheck className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Assignment Information
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Assigned User
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)] truncate">
                    {record?.assignedUser || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    User Role
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {record?.userRole || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Assignment Status
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {record?.assignmentStatus || '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── D. HISTORY / STATUS INFORMATION ────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Calendar className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Status History Logs
                </h4>
              </div>

              <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-3 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[var(--color-text-secondary)]">Previous Status:</span>
                  <span className="font-semibold text-slate-700">In Progress</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[var(--color-text-secondary)]">Final Status:</span>
                  <div>{getStatusBadge(currentStatus)}</div>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[var(--color-text-secondary)]">Completed Date:</span>
                  <span className="font-semibold text-slate-700">{record?.completionDate || '—'}</span>
                </div>
                <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-200">
                  No further historical status entries available for this record.
                </p>
              </div>
            </div>

            {/* ── E. PROGRESS EXPLANATION ────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Layers className="w-4 h-4 text-[var(--color-brand-green)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Progress Contribution Explanation
                </h4>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center gap-2 font-mono text-[10px] bg-white p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-800">Completed Work Item Weight</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="text-[var(--color-brand-blue)] font-bold">Project Progress</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  The predefined percentage weight of a completed work item contributes automatically to project progress. Modifications to these historical milestones must be managed under Admin authorization.
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
