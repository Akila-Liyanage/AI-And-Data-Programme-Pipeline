import React, { useEffect } from 'react';
import {
  X,
  FolderKanban,
  FileText,
  Activity,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Shield,
} from 'lucide-react';
import { Button, Badge } from '../../../components/common';

export interface InternHistoryRecord {
  id: string;
  workItemId?: string;
  workItemTitle: string;
  projectId: string;
  projectName: string;
  description?: string;
  requiredRole?: string;
  responsibility?: string;
  percentageWeight?: number;
  finalStatus: string;
  assignedDate?: string;
  startedDate?: string;
  completionDate?: string;
  progressContribution?: number | string;
  assignedRole?: string;
  assignmentStatus?: string;
  projectProgress?: number;
}

export interface InternWorkHistoryDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record?: InternHistoryRecord | null;
}

export const formatDisplayDate = (dateStr?: string | null): string => {
  if (!dateStr || dateStr.trim() === '') return '—';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toISOString().split('T')[0];
  } catch {
    return '—';
  }
};

export const InternWorkHistoryDetailsDrawer: React.FC<InternWorkHistoryDetailsDrawerProps> = ({
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

  if (!isOpen || !record) return null;

  const currentStatus = record.finalStatus || 'Completed';
  const effectiveItemId = record.workItemId || record.id;
  const isCompleted = currentStatus.toLowerCase() === 'completed';

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
      aria-labelledby="intern-history-details-title"
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
                  Intern Work History
                </Badge>
                <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-semibold">
                  {effectiveItemId}
                </span>
                {getStatusBadge(currentStatus)}
              </div>
              <h2
                id="intern-history-details-title"
                className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-brand-navy)] truncate"
              >
                {record.workItemTitle}
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Review completed work metrics, progress contributions, and timeline updates.
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
                  {record.workItemTitle}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <span className="font-medium text-slate-500">Project:</span>
                  <span className="font-semibold text-slate-800">{record.projectName}</span>
                  <span className="font-mono text-slate-500">({record.projectId})</span>
                </p>
              </div>
            </div>

            {/* ── A. WORK ITEM INFORMATION ────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <FileText className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Work Item Information
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium block">
                    Work Item ID
                  </span>
                  <p className="font-mono font-semibold text-[var(--color-brand-navy)]">
                    {effectiveItemId}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium block">
                    Associated Project
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {record.projectName}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium block">
                    Intern Role / Responsibility
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {record.requiredRole || record.responsibility || record.assignedRole || 'Intern Contributor'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium block">
                    Final Status
                  </span>
                  <div>{getStatusBadge(currentStatus)}</div>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Assigned Date
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)] font-mono">
                    {formatDisplayDate(record.assignedDate)}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Started Date
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)] font-mono">
                    {formatDisplayDate(record.startedDate)}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1 sm:col-span-2">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[var(--color-status-success)]" />
                    Completion Date
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)] font-mono">
                    {formatDisplayDate(record.completionDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* ── B. TASK DESCRIPTION & SCOPE ───────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <FileText className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Description & Scope
                </h4>
              </div>

              <div className="p-4 rounded-xl bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {record.description ? (
                  record.description
                ) : (
                  <p className="text-slate-400 italic">
                    No detailed description recorded for this work item.
                  </p>
                )}
              </div>
            </div>

            {/* ── C. CONTRIBUTION & PROGRESS IMPACT ───────────────── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[var(--color-brand-blue)]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                    Contribution & Progress Impact
                  </h4>
                </div>
                <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">
                  Read-Only Record
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium block">
                    Predefined Weight
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)] font-mono text-sm">
                    {record.percentageWeight !== undefined ? `${record.percentageWeight}%` : '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium block">
                    Final Status
                  </span>
                  <div>{getStatusBadge(currentStatus)}</div>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium block">
                    Contribution Credited
                  </span>
                  <p className="font-bold text-emerald-600 font-mono text-sm">
                    {isCompleted && record.percentageWeight !== undefined
                      ? `+${record.percentageWeight}%`
                      : '0%'}
                  </p>
                </div>
              </div>

              {/* Related Project Progress Context if available */}
              {record.projectProgress !== undefined && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">Project Overall Progress</span>
                    <span className="font-bold font-mono text-[var(--color-brand-blue)]">
                      {record.projectProgress}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-brand-blue)] rounded-full transition-all duration-300"
                      style={{ width: `${record.projectProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ── D. GOVERNANCE & AUDIT INTEGRITY POLICY ──────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Shield className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Historical Record Governance
                </h4>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs text-slate-600">
                <p className="font-semibold text-[var(--color-brand-navy)]">
                  Audit Record Integrity:
                </p>
                <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] bg-white p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-800">Work Item Completed</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="text-slate-800">Weight Credited</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="text-emerald-600 font-bold">Historical Record Locked</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Completed work-item weights contribute automatically to project progress. Historical contribution records are read-only and preserved for internship assessment.
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
