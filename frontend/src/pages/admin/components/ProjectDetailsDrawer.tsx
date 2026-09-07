import React, { useEffect, useState } from 'react';
import {
  X,
  FolderKanban,
  FileText,
  Code2,
  Building2,
  Calendar,
  Layers,
  Users,
  Activity,
  Edit3,
  UserCheck,
} from 'lucide-react';
import { Button, Badge, Alert, EmptyState } from '../../../components/common';
import type { ManagedProject } from '../../../types/projectManagement.types';

export interface ProjectDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project?: ManagedProject | null;
}

export const ProjectDetailsDrawer: React.FC<ProjectDetailsDrawerProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [statusNotice, setStatusNotice] = useState<{
    type: 'info' | 'error' | 'success';
    title: string;
    message: string;
  } | null>(null);

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

  const currentStatus = project?.status || 'Planned';
  const currentPriority = project?.priority || 'Medium';

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

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return (
          <Badge variant="error" size="sm">
            Critical
          </Badge>
        );
      case 'high':
        return (
          <Badge variant="warning" size="sm">
            High
          </Badge>
        );
      case 'low':
        return (
          <Badge variant="neutral" size="sm">
            Low
          </Badge>
        );
      case 'medium':
      default:
        return (
          <Badge variant="blue" size="sm">
            Medium
          </Badge>
        );
    }
  };

  const handleActionClick = (actionName: string) => {
    if (actionName === 'edit') {
      setStatusNotice({
        type: 'info',
        title: 'Edit Project Interface',
        message: 'Edit project interface will be connected in the next frontend task.',
      });
      return;
    }

    if (actionName === 'assignments') {
      setStatusNotice({
        type: 'info',
        title: 'Project Assignments',
        message: 'Project assignment allocation will be available in the Project Assignments module.',
      });
      return;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-details-title"
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
                {getPriorityBadge(currentPriority)}
              </div>
              <h2
                id="project-details-title"
                className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-brand-navy)]"
              >
                Project Overview & Governance
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Review AI & Data programme project milestones, timeline, and team assignments.
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
            {/* Status notice alert */}
            {statusNotice && (
              <Alert
                variant={statusNotice.type}
                title={statusNotice.title}
                onClose={() => setStatusNotice(null)}
              >
                {statusNotice.message}
              </Alert>
            )}

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
                  <span>{project?.category || '—'}</span>
                  <span>•</span>
                  <span>{project?.department || '—'}</span>
                </p>
              </div>
            </div>

            {/* ── 1. PROJECT OVERVIEW ─────────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <FileText className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Project Overview
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
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[var(--color-text-muted)]" />
                    Category
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {project?.category || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1">
                    <Code2 className="w-3 h-3 text-[var(--color-text-muted)]" />
                    Technology / Stack
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)] truncate">
                    {project?.technologyStack || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1 sm:col-span-2">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Description
                  </span>
                  <p className="text-[var(--color-text-primary)] leading-relaxed">
                    {project?.description || '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── 2. PROJECT OWNERSHIP ────────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Building2 className="w-4 h-4 text-[var(--color-brand-green)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Project Ownership & Team
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Project Lead
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {project?.projectLead || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Department / Team
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {project?.department || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1">
                    <Users className="w-3 h-3 text-[var(--color-text-muted)]" />
                    Assigned Members
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {project?.assignedMembersCount !== undefined
                      ? `${project.assignedMembersCount} Members`
                      : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── 3. PROJECT TIMELINE & STATUS ────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Calendar className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Timeline & Status
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
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

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Current Status
                  </span>
                  <div>{getStatusBadge(currentStatus)}</div>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Priority Level
                  </span>
                  <div>{getPriorityBadge(currentPriority)}</div>
                </div>
              </div>
            </div>

            {/* ── 4. PROJECT PROGRESS & MILESTONES ────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Activity className="w-4 h-4 text-[var(--color-brand-green)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Progress & Milestones
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
                    Calculated automatically from completed work items:
                  </p>
                  <p className="flex items-center gap-2 text-slate-500 font-medium">
                    <span>Completed Work Item Weights</span>
                    <span>→</span>
                    <span className="text-[var(--color-brand-blue)] font-bold">Project Progress</span>
                  </p>
                  <p className="text-[10px] text-slate-400 italic">
                    Work breakdown tasks will be calculated when assigned.
                  </p>
                </div>
              </div>
            </div>

            {/* ── 5. PROJECT WORK BREAKDOWN ──────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Code2 className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Work Breakdown
                </h4>
              </div>

              {/* Table/List for Work Items Preview */}
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs" aria-label="Project Work Items Table">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th scope="col" className="py-2 px-3">Work Item</th>
                      <th scope="col" className="py-2 px-3">Required Role</th>
                      <th scope="col" className="py-2 px-3">Weight</th>
                      <th scope="col" className="py-2 px-3">Status</th>
                      <th scope="col" className="py-2 px-3 text-right">Contribution</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={5} className="p-6">
                        <EmptyState
                          icon={<Code2 className="w-6 h-6 text-[var(--color-brand-blue)]" />}
                          title="No work items available"
                          description="Project work items will appear here once allocated."
                          secondaryAction={
                            <Badge size="sm" variant="neutral">
                              No work items registered yet
                            </Badge>
                          }
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── Sticky Drawer Footer / Action Buttons ────────────── */}
          <div className="px-6 py-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)]/60 flex items-center justify-between gap-3 shrink-0">
            <Button type="button" variant="outline" size="md" onClick={onClose}>
              Close
            </Button>

            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="md"
                leftIcon={<Edit3 className="w-4 h-4" />}
                onClick={() => handleActionClick('edit')}
              >
                Edit Project
              </Button>

              <Button
                type="button"
                variant="primary"
                size="md"
                leftIcon={<UserCheck className="w-4 h-4" />}
                onClick={() => handleActionClick('assignments')}
              >
                Manage Assignments
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
