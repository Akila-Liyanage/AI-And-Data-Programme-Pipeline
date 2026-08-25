import React, { useEffect } from 'react';
import {
  X,
  FolderKanban,
  FileText,
  Building2,
  Layers,
  CheckSquare,
  Activity,
} from 'lucide-react';
import { Button, Badge, EmptyState } from '../../../components/common';

export interface StaffProjectDetails {
  id: string;
  name: string;
  projectId: string;
  status: string;
  projectLead: string;
  startDate: string;
  targetDate: string;
  myRole: string;
  assignmentStatus: string;
  assignedWorkItemsCount: number | string;
}

export interface StaffProjectDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project?: StaffProjectDetails | null;
}

export const StaffProjectDetailsDrawer: React.FC<StaffProjectDetailsDrawerProps> = ({
  isOpen,
  onClose,
  project,
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

  const currentStatus = project?.status || 'Planned';

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

  const getAssignmentStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <Badge variant="blue" size="sm">
            Completed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="warning" size="sm">
            Pending
          </Badge>
        );
      case 'assigned':
      default:
        return (
          <Badge variant="success" size="sm">
            Assigned
          </Badge>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="staff-project-details-title"
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
                  Assigned Project
                </Badge>
                {getStatusBadge(currentStatus)}
              </div>
              <h2
                id="staff-project-details-title"
                className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-brand-navy)]"
              >
                Project Responsibility & Progress
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Review project metadata, your assignment details, and individual work-item requirements.
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
            {/* Project Header Summary Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/60 via-slate-50 to-white border border-[var(--color-border-subtle)] flex items-center gap-4 shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-brand-blue)] text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                <FolderKanban className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-[var(--color-brand-navy)] truncate">
                  {project?.name || '—'}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono font-medium text-slate-700">
                    {project?.projectId || '—'}
                  </span>
                  <span>•</span>
                  <span>{project?.projectLead || '—'}</span>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Project Name
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {project?.name || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Project ID
                  </span>
                  <p className="font-mono font-semibold text-[var(--color-brand-navy)]">
                    {project?.projectId || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Project Lead / Supervisor
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {project?.projectLead || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Project Status
                  </span>
                  <div>{getStatusBadge(currentStatus)}</div>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Start Date
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {project?.startDate || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Target Completion Date
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {project?.targetDate || '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── B. MY ASSIGNMENT ──────────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Building2 className="w-4 h-4 text-[var(--color-brand-green)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  My Assignment Details
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    My Assigned Role
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {project?.myRole || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Assignment Status
                  </span>
                  <div>{getAssignmentStatusBadge(project?.assignmentStatus || 'Assigned')}</div>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Assigned Work Items
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {project?.assignedWorkItemsCount !== undefined && project?.assignedWorkItemsCount !== null
                      ? project.assignedWorkItemsCount
                      : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── C. MY WORK ITEMS ──────────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Layers className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  My Assigned Work Items
                </h4>
              </div>

              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs" aria-label="Assigned Work Items Table">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th scope="col" className="py-2 px-3">Work Item</th>
                      <th scope="col" className="py-2 px-3">Required Role</th>
                      <th scope="col" className="py-2 px-3 text-center">Weight</th>
                      <th scope="col" className="py-2 px-3">Status</th>
                      <th scope="col" className="py-2 px-3 text-right">Progress Contribution</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={5} className="p-6">
                        <EmptyState
                          icon={<CheckSquare className="w-6 h-6 text-slate-400" />}
                          title="No assigned work items available"
                          description="Your project work items will appear here once assignment data is connected."
                          secondaryAction={
                            <Badge size="sm" variant="neutral">
                              Awaiting backend integration
                            </Badge>
                          }
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── D. PROJECT PROGRESS ────────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Activity className="w-4 h-4 text-[var(--color-brand-green)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Project Progress
                </h4>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--color-brand-navy)]">
                    Overall Project Progress
                  </span>
                  <span className="font-bold text-[var(--color-brand-blue)]">
                    —%
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-300 rounded-full"
                    style={{ width: '0%' }}
                  />
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-100 space-y-1.5 text-[11px] text-slate-600">
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    Project progress is calculated automatically from completed work-item percentage weights.
                  </p>
                  <p className="flex items-center gap-2 text-slate-500 font-medium">
                    <span>Completed Work Item Weights</span>
                    <span>→</span>
                    <span className="text-[var(--color-brand-blue)] font-bold">Project Progress</span>
                  </p>
                  <p className="text-[10px] text-slate-400 italic">
                    Awaiting work-breakdown data integration.
                  </p>
                </div>
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
