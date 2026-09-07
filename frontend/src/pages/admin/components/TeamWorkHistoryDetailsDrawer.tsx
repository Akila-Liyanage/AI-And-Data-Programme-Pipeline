/**
 * TeamWorkHistoryDetailsDrawer.tsx
 *
 * Slide-over details drawer for Administrators to review specific historical
 * team contribution records (Permanent Staff and Interns).
 *
 * Strictly READ-ONLY per BRD specifications:
 * - Displays granular work-item breakdown, predefined weight, credited contribution (+%),
 *   contributor profile, timeline dates, and project progress context.
 * - Locked audit record: no edit, delete, or manual progress adjustment controls.
 * - Keyboard accessible (Esc key closes drawer), body scroll-lock on open.
 */
import React, { useEffect } from 'react';
import {
  X,
  User,
  FolderKanban,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  BarChart,
  ClipboardList,
  ShieldCheck,
} from 'lucide-react';
import { Button, Badge } from '../../../components/common';

export type ContributorType = 'Permanent Staff' | 'Intern' | (string & {});

export interface TeamHistoryRecord {
  id: string;
  workItemId?: string;
  workItemTitle: string;
  description?: string;
  projectId: string;
  projectName: string;
  teamMemberName: string;
  teamMemberId?: string;
  contributorType: ContributorType;
  roleOrResponsibility?: string;
  predefinedWeight: number; // e.g. 20 (meaning 20%)
  finalStatus: 'Completed' | 'In Progress' | 'Not Started' | string;
  assignedDate?: string;
  startedDate?: string;
  completionDate?: string;
  creditedContribution?: number; // e.g. 20 (meaning +20%)
  projectProgress?: number;
}

export interface TeamWorkHistoryDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record?: TeamHistoryRecord | null;
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

export const TeamWorkHistoryDetailsDrawer: React.FC<TeamWorkHistoryDetailsDrawerProps> = ({
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

  const effectiveItemId = record.workItemId || record.id || '—';
  const isCompleted = (record.finalStatus || '').toLowerCase() === 'completed';
  const creditedPercent = isCompleted
    ? (record.creditedContribution ?? record.predefinedWeight ?? 0)
    : 0;

  const getContributorBadge = (type?: ContributorType) => {
    if (type === 'Permanent Staff') {
      return (
        <Badge variant="blue" size="sm">
          Permanent Staff
        </Badge>
      );
    }
    if (type === 'Intern') {
      return (
        <Badge variant="info" size="sm">
          Intern
        </Badge>
      );
    }
    return (
      <Badge variant="neutral" size="sm">
        {type || 'Contributor'}
      </Badge>
    );
  };

  const getStatusBadge = (status?: string) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'completed':
        return (
          <Badge variant="success" size="sm" className="inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </Badge>
        );
      case 'in progress':
        return (
          <Badge variant="warning" size="sm" className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            In Progress
          </Badge>
        );
      case 'not started':
        return (
          <Badge variant="neutral" size="sm">
            Not Started
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" size="sm">
            {status || '—'}
          </Badge>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-xl md:max-w-2xl bg-white shadow-2xl flex flex-col h-full border-l border-slate-100">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-slate-50/60">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="neutral" size="sm">
                  Historical Record
                </Badge>
                {getContributorBadge(record.contributorType)}
                <span className="font-mono text-xs text-slate-500 font-semibold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                  {effectiveItemId}
                </span>
              </div>
              <h2
                id="drawer-title"
                className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-brand-navy)]"
              >
                Team Contribution Details
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Audit record of verified task completion, predefined weight contribution, and contributor attribution.
              </p>
            </div>
            <button
              type="button"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all focus:outline-hidden focus:ring-2 focus:ring-[var(--color-brand-blue)] cursor-pointer shrink-0"
              onClick={onClose}
              aria-label="Close details drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* 1. Contribution Governance Notice */}
            <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/40 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-900 font-semibold">Locked Audit Record:</strong> Completed work items permanently contribute their predefined percentage weight toward overall project progress. This record is strictly read-only.
              </div>
            </div>

            {/* 2. Contributor Attribution */}
            <section className="space-y-3" aria-labelledby="section-contributor">
              <h3
                id="section-contributor"
                className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-blue-600" />
                Contributor Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/40">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Team Member</span>
                  <span className="text-xs font-bold text-slate-800">{record.teamMemberName || '—'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Member ID</span>
                  <span className="text-xs font-mono font-semibold text-slate-700">{record.teamMemberId || '—'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Contributor Type</span>
                  <div>{getContributorBadge(record.contributorType)}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Role / Responsibility</span>
                  <span className="text-xs font-semibold text-slate-800">{record.roleOrResponsibility || '—'}</span>
                </div>
              </div>
            </section>

            {/* 3. Project Context */}
            <section className="space-y-3" aria-labelledby="section-project">
              <h3
                id="section-project"
                className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"
              >
                <FolderKanban className="w-3.5 h-3.5 text-blue-600" />
                Project Context
              </h3>
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Project Name</span>
                    <span className="text-xs font-bold text-slate-800">{record.projectName || '—'}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Project ID</span>
                    <span className="text-xs font-mono font-semibold text-slate-700">{record.projectId || '—'}</span>
                  </div>
                </div>

                {/* Progress Context if available */}
                {record.projectProgress !== undefined && (
                  <div className="pt-3 border-t border-slate-200/60 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-semibold text-slate-600">Project Overall Progress</span>
                      <span className="font-mono font-bold text-blue-700">{record.projectProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-500"
                        style={{ width: `${Math.min(100, Math.max(0, record.projectProgress))}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* 4. Work Item Breakdown */}
            <section className="space-y-3" aria-labelledby="section-work-item">
              <h3
                id="section-work-item"
                className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"
              >
                <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
                Work Item Details
              </h3>
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Work Item Title</span>
                  <span className="text-xs font-bold text-slate-900 leading-relaxed block">
                    {record.workItemTitle || '—'}
                  </span>
                </div>

                {record.description && (
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Description</span>
                    <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                      {record.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/60">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Predefined Weight</span>
                    <span className="text-xs font-bold text-slate-800 font-mono">
                      {record.predefinedWeight !== undefined ? `${record.predefinedWeight}%` : '—'}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Work Status</span>
                    <div>{getStatusBadge(record.finalStatus)}</div>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Contribution & Timeline */}
            <section className="space-y-3" aria-labelledby="section-contribution">
              <h3
                id="section-contribution"
                className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-blue-600" />
                Contribution & Completion Timeline
              </h3>
              <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/30 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 block">Predefined Weight</span>
                    <span className="text-sm font-bold text-slate-800 font-mono">
                      {record.predefinedWeight !== undefined ? `${record.predefinedWeight}%` : '—'}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 block">Credited Contribution</span>
                    <div className="flex items-center gap-1.5 font-bold text-blue-700 font-mono text-sm">
                      <BarChart className="w-4 h-4" />
                      <span>{isCompleted ? `+${creditedPercent}%` : '—'}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-blue-100/70 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Assigned Date</span>
                    <div className="flex items-center gap-1 text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDisplayDate(record.assignedDate)}</span>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Started Date</span>
                    <div className="flex items-center gap-1 text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDisplayDate(record.startedDate)}</span>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Completion Date</span>
                    <div className="flex items-center gap-1 text-slate-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{formatDisplayDate(record.completionDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Footer controls — Strictly Close only per BRD */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex justify-end gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close Details
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};
