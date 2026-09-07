import React, { useEffect, useState } from 'react';
import {
  X,
  UserCheck,
  FolderKanban,
  User,
  Briefcase,
  Building2,
  Calendar,
  FileText,
  Edit3,
  Trash2,
  IdCard,
} from 'lucide-react';
import { Button, Badge, Alert } from '../../../components/common';
import type { ManagedAssignment } from '../../../types/assignmentManagement.types';

export interface AssignmentDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  assignment?: ManagedAssignment | null;
  onEdit?: (assignment: ManagedAssignment) => void;
  onRemove?: (assignment: ManagedAssignment) => void;
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

export const AssignmentDetailsDrawer: React.FC<AssignmentDetailsDrawerProps> = ({
  isOpen,
  onClose,
  assignment,
  onEdit,
  onRemove,
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

  const currentStatus = assignment?.status || 'Pending';

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'assigned':
        return (
          <Badge variant="success" size="sm">
            Assigned
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="blue" size="sm">
            Completed
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge variant="warning" size="sm">
            Pending
          </Badge>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assignment-details-title"
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
                  Assignment Record
                </Badge>
                {getStatusBadge(currentStatus)}
              </div>
              <h2
                id="assignment-details-title"
                className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-brand-navy)]"
              >
                Project Assignment Details
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Review member responsibility, allocation timeline, and project context.
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

            {/* Assignment Header Summary Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/60 via-slate-50 to-white border border-[var(--color-border-subtle)] flex items-center gap-4 shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-brand-navy)] text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                <UserCheck className="w-6 h-6 text-[var(--color-brand-blue)]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-[var(--color-brand-navy)] truncate">
                  {assignment?.userName || '—'}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono font-medium text-slate-700">
                    {assignment?.userId || '—'}
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-[var(--color-brand-blue)]">
                    {assignment?.assignmentRole || '—'}
                  </span>
                  <span>•</span>
                  <span>{assignment?.projectName || '—'}</span>
                </p>
              </div>
            </div>

            {/* ── 1. ASSIGNMENT OVERVIEW ──────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <FolderKanban className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Assignment Overview
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Project
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {assignment?.projectName || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Project ID
                  </span>
                  <p className="font-mono font-semibold text-[var(--color-brand-navy)]">
                    {assignment?.projectId || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1">
                    <User className="w-3 h-3 text-[var(--color-text-muted)]" />
                    Assigned User
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {assignment?.userName || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1">
                    <IdCard className="w-3 h-3 text-[var(--color-text-muted)]" />
                    User ID & Category
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {assignment?.userId ? `${assignment.userId} (${assignment.userCategory})` : '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1 sm:col-span-2">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-[var(--color-text-muted)]" />
                    Professional Role
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {assignment?.professionalRole || '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── 2. RESPONSIBILITY & ALLOCATION ──────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Briefcase className="w-4 h-4 text-[var(--color-brand-green)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Responsibility & Allocation
                </h4>
              </div>

              <div className="grid grid-cols-1 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Assignment Role
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {assignment?.assignmentRole || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1">
                    <FileText className="w-3 h-3 text-[var(--color-text-muted)]" />
                    Allocation / Responsibility Notes
                  </span>
                  <p className="text-[var(--color-text-primary)] leading-relaxed">
                    {assignment?.allocationNotes || 'No specific notes recorded for this allocation.'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── 3. TIMELINE & STATUS ────────────────────────────── */}
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
                    Assignment Date
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {formatDisplayDate(assignment?.assignmentDate || assignment?.createdAt)}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Start Date
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {formatDisplayDate(assignment?.startDate)}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Expected End Date
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {formatDisplayDate(assignment?.expectedEndDate)}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Allocation Status
                  </span>
                  <div>{getStatusBadge(currentStatus)}</div>
                </div>
              </div>
            </div>

            {/* ── 4. PROJECT CONTEXT ──────────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Building2 className="w-4 h-4 text-[var(--color-brand-navy)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Project Context
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Project Lead
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {assignment?.projectLead || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Department / Team
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {assignment?.department || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                    Project Status
                  </span>
                  <p className="font-semibold text-[var(--color-brand-navy)]">
                    {assignment?.projectStatus || '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Sticky Drawer Footer / Action Buttons ────────────── */}
          <div className="px-6 py-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)]/60 flex items-center justify-between gap-3 shrink-0">
            <Button type="button" variant="outline" size="md" onClick={onClose}>
              Close
            </Button>

            <div className="flex items-center gap-2.5">
              {onRemove && assignment && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  leftIcon={<Trash2 className="w-4 h-4 text-rose-500" />}
                  onClick={() => {
                    onRemove(assignment);
                  }}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300"
                >
                  Remove Assignment
                </Button>
              )}

              {onEdit && assignment && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  leftIcon={<Edit3 className="w-4 h-4 text-slate-600" />}
                  onClick={() => {
                    onEdit(assignment);
                  }}
                >
                  Edit Assignment
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
