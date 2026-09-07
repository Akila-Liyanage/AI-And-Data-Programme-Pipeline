import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  FolderKanban,
  FileText,
  Code2,
  Calendar,
  Layers,
  Users,
  Activity,
  Edit3,
  UserCheck,
  Trash2,
  Plus,
  UserMinus,
} from 'lucide-react';
import { Button, Badge, Alert, EmptyState } from '../../../components/common';
import type { ManagedProject } from '../../../types/projectManagement.types';
import { CreateAssignmentDrawer } from './CreateAssignmentDrawer';

export interface ProjectDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project?: ManagedProject | null;
  onEdit?: (project: ManagedProject) => void;
  onDelete?: (project: ManagedProject) => void;
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

export const ProjectDetailsDrawer: React.FC<ProjectDetailsDrawerProps> = ({
  isOpen,
  onClose,
  project,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [statusNotice, setStatusNotice] = useState<{
    type: 'info' | 'error' | 'success';
    title: string;
    message: string;
  } | null>(null);

  // Live assigned team members state
  const [assignedMembers, setAssignedMembers] = useState<any[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isAssignDrawerOpen, setIsAssignDrawerOpen] = useState(false);

  // Fetch real-time assigned members for this project
  const loadProjectAssignments = async () => {
    if (!project?.projectId) return;
    setIsLoadingMembers(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/assignments?projectId=${project.projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.assignments) {
        setAssignedMembers(data.assignments);
      }
    } catch (err) {
      console.error('Failed to load project assignments:', err);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  useEffect(() => {
    if (isOpen && project?.projectId) {
      loadProjectAssignments();
    }
  }, [isOpen, project?.projectId]);

  // Remove / Unassign member
  const handleUnassignMember = async (assignmentId: string, memberName: string) => {
    if (!window.confirm(`Are you sure you want to unassign ${memberName} from this project?`)) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/assignments/${assignmentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setStatusNotice({
          type: 'success',
          title: 'Member Unassigned',
          message: `Successfully unassigned ${memberName} from project ${project?.name}.`,
        });
        loadProjectAssignments();
      }
    } catch (err: any) {
      setStatusNotice({
        type: 'error',
        title: 'Action Failed',
        message: err.message || 'Could not unassign team member.',
      });
    }
  };

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
  const currentProgress = project?.progress !== undefined ? project.progress : 0;
  const workItemsList = project?.workItems && Array.isArray(project.workItems) ? project.workItems : [];

  const completedCount = workItemsList.filter(
    (w: any) => w.status === 'DONE' || w.status === 'Completed'
  ).length;

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ongoing':
      case 'active':
        return (
          <Badge variant="success" size="sm">
            Ongoing
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
      case 'cancelled':
        return (
          <Badge variant="error" size="sm">
            Cancelled
          </Badge>
        );
      case 'not started':
      case 'planned':
      default:
        return (
          <Badge variant="info" size="sm">
            Not Started
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

  const handleNavigateAssignments = () => {
    onClose();
    navigate('/admin/assignments');
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
                Review AI & Data programme project specifications, timeline, and work items.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-brand-navy)] hover:bg-[var(--color-surface-subtle)] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-brand-blue)]/40 cursor-pointer"
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

            {/* ── 2. PROJECT OWNERSHIP & ASSIGNED TEAM ─────────── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[var(--color-brand-green)]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                    Assigned Project Team ({assignedMembers.length} {assignedMembers.length === 1 ? 'Member' : 'Members'})
                  </h4>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setIsAssignDrawerOpen(true)}
                >
                  Assign Member
                </Button>
              </div>

              {/* Ownership Metadata Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
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
                    Department / Programme Unit
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {project?.department || '—'}
                  </p>
                </div>
              </div>

              {/* Live Assigned Team Members List */}
              <div className="space-y-2 pt-1">
                {isLoadingMembers ? (
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-center text-xs text-slate-500 animate-pulse">
                    Loading assigned team members...
                  </div>
                ) : assignedMembers.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center space-y-2">
                    <Users className="w-6 h-6 text-slate-400 mx-auto" />
                    <p className="text-xs font-semibold text-slate-700">No Team Members Assigned Yet</p>
                    <p className="text-[11px] text-slate-500">
                      Allocate Staff engineers or Intern trainees to work on this project stream.
                    </p>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      onClick={() => setIsAssignDrawerOpen(true)}
                    >
                      Assign First Member
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {assignedMembers.map((m: any) => {
                      const isIntern = m.userCategory?.toLowerCase().includes('intern');
                      const initials = (m.userName || 'Member')
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);

                      return (
                        <div
                          key={m._id || m.assignmentId}
                          className="p-3 rounded-xl border border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-2xs transition-all flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                isIntern
                                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                  : 'bg-blue-100 text-blue-700 border border-blue-200'
                              }`}
                            >
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-slate-900 truncate">
                                  {m.userName}
                                </span>
                                <Badge size="sm" variant={isIntern ? 'neutral' : 'blue'}>
                                  {m.userCategory || (isIntern ? 'Intern' : 'Staff')}
                                </Badge>
                              </div>
                              <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5 truncate">
                                <span className="font-medium text-slate-700 font-mono">
                                  {m.userId}
                                </span>
                                <span>•</span>
                                <span className="font-semibold text-blue-700">
                                  {m.assignmentRole || m.professionalRole || 'Contributor'}
                                </span>
                                {m.startDate && (
                                  <>
                                    <span>•</span>
                                    <span>Since {formatDisplayDate(m.startDate)}</span>
                                  </>
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <Badge size="sm" variant="success">
                              {m.status || 'Assigned'}
                            </Badge>
                            <button
                              type="button"
                              onClick={() => handleUnassignMember(m._id || m.assignmentId, m.userName)}
                              title="Unassign member"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <UserMinus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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
                    {formatDisplayDate(project?.startDate)}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Target Completion Date
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {formatDisplayDate(project?.targetDate)}
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
                  <span className="font-bold text-[var(--color-brand-blue)] font-mono text-sm">
                    {currentProgress}%
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-500 transition-all duration-300"
                    style={{ width: `${Math.min(Math.max(currentProgress, 0), 100)}%` }}
                  />
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-100 space-y-1.5 text-[11px] text-slate-600">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-[var(--color-brand-navy)]">
                      Work Item Completion:
                    </p>
                    <span className="font-medium text-slate-700">
                      {completedCount} of {workItemsList.length} items completed
                    </span>
                  </div>
                  <p className="flex items-center gap-2 text-slate-500 font-medium">
                    <span>Completed Work Item Weights</span>
                    <span>→</span>
                    <span className="text-[var(--color-brand-blue)] font-bold">Project Progress ({currentProgress}%)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* ── 5. PROJECT WORK BREAKDOWN ──────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[var(--color-brand-blue)]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                    Work Breakdown ({workItemsList.length} {workItemsList.length === 1 ? 'Item' : 'Items'})
                  </h4>
                </div>
                {workItemsList.length > 0 && (
                  <Badge variant="blue" size="sm">
                    Total Weight: {workItemsList.reduce((sum: number, item: any) => sum + (Number(item.percentage) || 0), 0)}%
                  </Badge>
                )}
              </div>

              {/* Table/List for Work Items Preview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left border-collapse text-xs" aria-label="Project Work Items Table">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th scope="col" className="py-2.5 px-3">Work Item</th>
                      <th scope="col" className="py-2.5 px-3">Required Role</th>
                      <th scope="col" className="py-2.5 px-3">Weight</th>
                      <th scope="col" className="py-2.5 px-3">Status</th>
                      <th scope="col" className="py-2.5 px-3 text-right">Contribution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {workItemsList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6">
                          <EmptyState
                            icon={<Code2 className="w-6 h-6 text-[var(--color-brand-blue)]" />}
                            title="No work items available"
                            description="Project work items can be added by editing this project."
                            secondaryAction={
                              <Badge size="sm" variant="neutral">
                                No work items registered yet
                              </Badge>
                            }
                          />
                        </td>
                      </tr>
                    ) : (
                      workItemsList.map((item: any, idx: number) => {
                        const isCompleted = item.status === 'DONE' || item.status === 'Completed';
                        const isInProgress = item.status === 'IN_PROGRESS' || item.status === 'In Progress';
                        const weight = Number(item.percentage) || 0;

                        return (
                          <tr key={item.workItemId || item.id || idx} className="hover:bg-blue-50/20 transition-colors">
                            <td className="py-2.5 px-3">
                              <p className="font-semibold text-slate-900">{item.title || item.task}</p>
                              <span className="font-mono text-[10px] text-slate-400">
                                {item.workItemId || `WI-${idx + 1}`}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">
                              <Badge variant="neutral" size="sm">
                                {item.role || item.requiredRole || 'Unassigned'}
                              </Badge>
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">
                              {weight}%
                            </td>
                            <td className="py-2.5 px-3">
                              {isCompleted ? (
                                <Badge variant="success" size="sm">Completed</Badge>
                              ) : isInProgress ? (
                                <Badge variant="warning" size="sm">In Progress</Badge>
                              ) : (
                                <Badge variant="neutral" size="sm">Not Started</Badge>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold">
                              {isCompleted ? (
                                <span className="text-emerald-600">+{weight}%</span>
                              ) : (
                                <span className="text-slate-400">0%</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
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

            <div className="flex items-center gap-2.5 flex-wrap justify-end">
              {onDelete && project && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 text-rose-600 border-rose-200"
                  leftIcon={<Trash2 className="w-4 h-4 text-rose-500" />}
                  onClick={() => {
                    onDelete(project);
                  }}
                >
                  Delete
                </Button>
              )}

              {onEdit && project && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  leftIcon={<Edit3 className="w-4 h-4 text-slate-600" />}
                  onClick={() => {
                    onEdit(project);
                  }}
                >
                  Edit Project
                </Button>
              )}

              <Button
                type="button"
                variant="primary"
                size="md"
                leftIcon={<UserCheck className="w-4 h-4" />}
                onClick={handleNavigateAssignments}
              >
                Manage Assignments
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Assign Member Drawer ───────────────────────────────── */}
      <CreateAssignmentDrawer
        isOpen={isAssignDrawerOpen}
        onClose={() => setIsAssignDrawerOpen(false)}
        defaultProjectId={project?.projectId}
        onAssignmentCreated={() => {
          loadProjectAssignments();
          setStatusNotice({
            type: 'success',
            title: 'Member Assigned',
            message: `Successfully allocated team member to ${project?.name}.`,
          });
        }}
      />
    </div>
  );
};
