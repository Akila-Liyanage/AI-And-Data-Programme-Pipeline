/**
 * WorkHistoryDetailsDrawer.tsx
 *
 * Details drawer for reviewing a specific historical work history contribution.
 * Fully parameterized via props, adhering strictly to frontend UI development guidelines.
 * Features a modern glassmorphic side drawer with complete keyboard (Esc key) and focus state controls.
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
} from 'lucide-react';
import { Button, Badge } from '../../../components/common';

export interface WorkHistoryRecord {
  id: string;
  user: {
    fullName: string;
    userId: string;
    userType: 'Permanent Staff' | 'Intern' | string;
    role: string;
  };
  project: {
    name: string;
    status: string;
  };
  workItem: {
    task: string;
    requiredRole: string;
    percentage: number;
    status: string;
  };
  contribution: {
    progressWeight: number;
    completionDate: string;
  };
}

export interface WorkHistoryDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record: WorkHistoryRecord | null;
}

export const WorkHistoryDetailsDrawer: React.FC<WorkHistoryDetailsDrawerProps> = ({
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

  // Lock scroll when open
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

  const getUserTypeBadge = (userType: string) => {
    if (userType === 'Permanent Staff') {
      return (
        <Badge variant="blue" size="sm">
          Permanent Staff
        </Badge>
      );
    }
    return (
      <Badge variant="info" size="sm">
        Intern
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'active':
        return (
          <Badge variant="success" size="sm" className="inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {status}
          </Badge>
        );
      case 'in progress':
        return (
          <Badge variant="warning" size="sm" className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {status}
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" size="sm">
            {status}
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
          <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-slate-50/50">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="neutral" size="sm">
                  Historical Log
                </Badge>
                {getUserTypeBadge(record.user.userType)}
              </div>
              <h2
                id="drawer-title"
                className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-brand-navy)]"
              >
                Work Contribution Details
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Review verified contribution details, work breakdowns, and weight impact.
              </p>
            </div>
            <button
              type="button"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all focus:outline-hidden focus:ring-2 focus:ring-[var(--color-brand-blue)]"
              onClick={onClose}
              aria-label="Close details drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Contributor Information */}
            <section className="space-y-3" aria-labelledby="section-contributor">
              <h3
                id="section-contributor"
                className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                Contributor Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Full Name</span>
                  <span className="text-xs font-bold text-slate-800">{record.user.fullName}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">User ID</span>
                  <span className="text-xs font-mono font-semibold text-slate-700">{record.user.userId}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">User Type</span>
                  <span className="text-xs font-bold text-slate-800">{record.user.userType}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Assigned Role</span>
                  <span className="text-xs font-bold text-slate-800">{record.user.role}</span>
                </div>
              </div>
            </section>

            {/* Project Information */}
            <section className="space-y-3" aria-labelledby="section-project">
              <h3
                id="section-project"
                className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"
              >
                <FolderKanban className="w-3.5 h-3.5" />
                Project Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                <div className="space-y-1 sm:col-span-2">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Project Name</span>
                  <span className="text-xs font-bold text-slate-800">{record.project.name}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Project Status</span>
                  <div>{getStatusBadge(record.project.status)}</div>
                </div>
              </div>
            </section>

            {/* Work Item Information */}
            <section className="space-y-3" aria-labelledby="section-work-item">
              <h3
                id="section-work-item"
                className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                Work Item Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                <div className="space-y-1 sm:col-span-2">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Work Breakdown Task</span>
                  <span className="text-xs font-semibold text-slate-800 leading-relaxed">
                    {record.workItem.task}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Required Role</span>
                  <span className="text-xs font-bold text-slate-800">{record.workItem.requiredRole}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Allocation Weight</span>
                  <span className="text-xs font-bold text-slate-800">{record.workItem.percentage}%</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Work Status</span>
                  <div>{getStatusBadge(record.workItem.status)}</div>
                </div>
              </div>
            </section>

            {/* Contribution Information */}
            <section className="space-y-3" aria-labelledby="section-contribution">
              <h3
                id="section-contribution"
                className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5" />
                Contribution Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-slate-100 bg-blue-50/20 border-blue-100">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-slate-505 block">Progress Contribution</span>
                  <div className="flex items-center gap-1.5 font-bold text-[var(--color-brand-blue)]">
                    <BarChart className="w-4 h-4" />
                    <span className="text-sm">+{record.contribution.progressWeight}%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-slate-505 block">Completion Date</span>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-xs">{record.contribution.completionDate}</span>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Footer controls */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close Details
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};
