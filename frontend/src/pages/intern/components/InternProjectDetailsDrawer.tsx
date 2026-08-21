import React, { useEffect } from 'react';
import {
  X,
  FolderKanban,
  FileText,
  Activity,
  Layers,
} from 'lucide-react';
import { Button, Badge, EmptyState } from '../../../components/common';

export interface InternProject {
  id: string;
  projectName: string;
  description?: string;
  projectStatus: string;
  startDate?: string;
  targetDate?: string;
  supervisorName?: string;
  assignedRole: string;
  assignmentStatus: string;
  projectProgress?: number | string;
}

export interface InternProjectDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project?: InternProject | null;
}

export const InternProjectDetailsDrawer: React.FC<InternProjectDetailsDrawerProps> = ({
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

  const currentStatus = project?.projectStatus || 'Planned';

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'in progress':
        return (
          <Badge variant="success" size="sm">
            In Progress
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
      aria-labelledby="intern-project-details-title"
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
                  Project Details
                </Badge>
                {getStatusBadge(currentStatus)}
              </div>
              <h2
                id="intern-project-details-title"
                className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-brand-navy)]"
              >
                Project Milestone Breakdown
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Review active project details, role allocations, assigned tasks, and overall progress statistics.
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
                  {project?.projectName || '—'}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  Supervisor: <span className="font-semibold text-slate-800">{project?.supervisorName || '—'}</span>
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

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Description
                  </span>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {project?.description || 'No description available.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      Target Date
                    </span>
                    <p className="font-semibold text-[var(--color-brand-navy)]">
                      {project?.targetDate || '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── B. MY ASSIGNMENT ──────────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Layers className="w-4 h-4 text-[var(--color-brand-green)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  My Assignment Details
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Assigned Role
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {project?.assignedRole || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Assignment Status
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {project?.assignmentStatus || '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── C. WORK ITEMS ─────────────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Layers className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Work Items
                </h4>
              </div>

              <div className="border border-[var(--color-border-subtle)] rounded-xl overflow-hidden bg-white">
                <table className="w-full text-left text-xs border-collapse min-w-[500px]" aria-label="Work Items Table">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th scope="col" className="py-2.5 px-3">Work Item</th>
                      <th scope="col" className="py-2.5 px-3">Required Role</th>
                      <th scope="col" className="py-2.5 px-3 text-center">Weight</th>
                      <th scope="col" className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4} className="p-8">
                        <EmptyState
                          icon={<Layers className="w-6 h-6 text-slate-400" />}
                          title="No work items available"
                          description="Work items assigned to this project will appear here."
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
                <Activity className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Project Progress Summary
                </h4>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Project Progress</span>
                  <span className="font-bold text-[var(--color-brand-blue)]">
                    {project?.projectProgress !== undefined ? `${project.projectProgress}%` : '—'}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-300 rounded-full animate-pulse" style={{ width: '0%' }} />
                </div>
                <div className="flex items-start gap-2.5 text-slate-500 leading-normal text-[11px] bg-white p-3 rounded-lg border border-slate-100">
                  <Activity className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <p className="font-medium">
                    Project progress is updated automatically as work items are completed.
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
