import React, { useEffect, useState } from 'react';
import {
  X,
  FolderKanban,
  FileText,
  Activity,
  Layers,
  Calendar,
  UserCheck,
  Building2,
  Cpu,
  Users,
} from 'lucide-react';
import { Button, Badge, EmptyState } from '../../../components/common';

export interface InternProjectWorkItem {
  id: string;
  title: string;
  role?: string;
  weightPercentage?: number;
  status: 'Not Started' | 'In Progress' | 'Completed' | string;
  targetDate?: string;
}

export interface InternProject {
  id: string;
  projectId: string;
  projectName: string;
  description?: string;
  category?: string;
  projectStatus: string;
  priority?: string;
  startDate?: string;
  targetDate?: string;
  supervisorName?: string;
  department?: string;
  technologyStack?: string;
  assignedRole: string;
  assignmentStatus?: string;
  projectProgress?: number;
  workItems?: InternProjectWorkItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface InternProjectDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project?: InternProject | null;
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

export const InternProjectDetailsDrawer: React.FC<InternProjectDetailsDrawerProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState<boolean>(false);

  useEffect(() => {
    const projId = project?.projectId || project?.id;
    if (!isOpen || !projId) return;

    const loadTeam = async () => {
      setIsLoadingTeam(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/assignments?projectId=${projId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.assignments) {
          setTeamMembers(data.assignments);
        }
      } catch (err) {
        console.error('Failed to load project team:', err);
      } finally {
        setIsLoadingTeam(false);
      }
    };

    loadTeam();
  }, [isOpen, project?.projectId, project?.id]);

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

  if (!isOpen || !project) return null;

  const currentStatus = project.projectStatus || 'Planned';
  const progressValue = Math.min(100, Math.max(0, project.projectProgress ?? 0));

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'in progress':
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
          <Badge variant="neutral" size="sm">
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
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="blue" size="sm">
                  Intern Assigned Project
                </Badge>
                {project.category && (
                  <Badge variant="neutral" size="sm">
                    {project.category}
                  </Badge>
                )}
                {getStatusBadge(currentStatus)}
              </div>
              <h2
                id="intern-project-details-title"
                className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-brand-navy)] truncate"
              >
                {project.projectName}
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Review assigned internship project specifications, your role responsibility, and overall progress.
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
                  {project.projectName}
                </h3>
                <div className="text-xs text-[var(--color-text-secondary)] flex items-center gap-2 mt-1 flex-wrap">
                  <span className="font-mono font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {project.projectId || project.id}
                  </span>
                  {project.supervisorName && (
                    <>
                      <span>•</span>
                      <span>Supervisor: {project.supervisorName}</span>
                    </>
                  )}
                  {project.department && (
                    <>
                      <span>•</span>
                      <span>{project.department}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ── 1. OVERALL PROGRESS (READ-ONLY) ────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[var(--color-brand-blue)]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                    Overall Project Progress
                  </h4>
                </div>
                <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">
                  Read-only
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--color-brand-navy)]">
                    Completion Status
                  </span>
                  <span className="text-base font-bold text-[var(--color-brand-blue)] font-mono">
                    {project.projectProgress !== undefined ? `${progressValue}%` : '—%'}
                  </span>
                </div>

                <div
                  className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5"
                  role="progressbar"
                  aria-valuenow={progressValue}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${project.projectName} overall progress`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      progressValue === 100
                        ? 'bg-[var(--color-brand-green)]'
                        : 'bg-gradient-to-r from-blue-500 to-[var(--color-brand-blue)]'
                    }`}
                    style={{ width: `${progressValue}%` }}
                  />
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <p className="font-medium text-[var(--color-brand-navy)]">
                    Project progress is calculated automatically from completed work-item weights.
                  </p>
                  <p className="text-slate-500 text-[10px]">
                    Intern contributors do not manually slide or adjust project progress.
                  </p>
                </div>
              </div>
            </div>

            {/* ── 2. PROJECT DESCRIPTION & OBJECTIVES ─────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <FileText className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Description & Objectives
                </h4>
              </div>

              <div className="p-4 rounded-xl bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {project.description ? (
                  project.description
                ) : (
                  <p className="text-slate-400 italic">
                    No detailed description provided for this project.
                  </p>
                )}
              </div>
            </div>

            {/* ── 3. PROJECT SPECIFICATIONS & METADATA ────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Building2 className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Project Specifications
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium block">
                    Project ID
                  </span>
                  <p className="font-mono font-semibold text-[var(--color-brand-navy)]">
                    {project.projectId || project.id}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium block">
                    Category
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {project.category || 'General'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium block">
                    Supervisor / Project Lead
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {project.supervisorName || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium block">
                    Project Status
                  </span>
                  <div>{getStatusBadge(currentStatus)}</div>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Start Date
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {formatDisplayDate(project.startDate)}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Target Completion Date
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {formatDisplayDate(project.targetDate)}
                  </p>
                </div>
              </div>

              {/* Technology Stack if available */}
              {project.technologyStack && (
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1.5 text-xs">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-slate-400" />
                    Technology Stack
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.technologyStack.split(',').map((tech) => (
                      <span
                        key={tech.trim()}
                        className="px-2 py-0.5 rounded bg-white text-[11px] font-medium text-slate-700 border border-slate-200"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── 4. MY INTERN ASSIGNMENT ───────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <UserCheck className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  My Internship Assignment
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium block">
                    Assigned Role
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {project.assignedRole || 'Intern Contributor'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium block">
                    Assignment Status
                  </span>
                  <Badge variant="blue" size="sm">
                    {project.assignmentStatus || 'Assigned'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* ── 5. PROJECT TEAM MEMBERS ────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[var(--color-brand-blue)]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                    Project Team ({teamMembers.length} {teamMembers.length === 1 ? 'Member' : 'Members'})
                  </h4>
                </div>
              </div>

              {isLoadingTeam ? (
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-center text-xs text-slate-500 animate-pulse">
                  Loading project team...
                </div>
              ) : teamMembers.length === 0 ? (
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-500">
                  No other team members assigned yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {teamMembers.map((m: any) => {
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
                        className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 ${
                              isIntern
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 truncate block">
                              {m.userName}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {m.assignmentRole || m.professionalRole || 'Contributor'}
                            </span>
                          </div>
                        </div>

                        <Badge size="sm" variant={isIntern ? 'neutral' : 'blue'}>
                          {m.userCategory || (isIntern ? 'Intern' : 'Staff')}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── 6. WORK ITEM SUMMARY ───────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[var(--color-brand-blue)]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                    Work Item Summary
                  </h4>
                </div>
                {project.workItems && project.workItems.length > 0 && (
                  <Badge size="sm" variant="blue">
                    {project.workItems.length} {project.workItems.length === 1 ? 'Item' : 'Items'}
                  </Badge>
                )}
              </div>

              {project.workItems && project.workItems.length > 0 ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs" aria-label="Work Items Table">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          <th scope="col" className="py-2.5 px-3.5">Work Item</th>
                          <th scope="col" className="py-2.5 px-3">Role</th>
                          <th scope="col" className="py-2.5 px-3 text-center">Weight</th>
                          <th scope="col" className="py-2.5 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {project.workItems.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2.5 px-3.5 font-medium text-[var(--color-brand-navy)]">
                              {item.title}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">
                              {item.role || '—'}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono text-slate-700">
                              {item.weightPercentage !== undefined ? `${item.weightPercentage}%` : '—'}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              {getWorkItemStatusBadge(item.status)}
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
                    title="No work items available"
                    description="Work items assigned to this project will appear here."
                    minHeight="min-h-[140px]"
                  />
                </div>
              )}
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
