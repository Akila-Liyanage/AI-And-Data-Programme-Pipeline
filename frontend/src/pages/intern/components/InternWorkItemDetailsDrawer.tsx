import React, { useEffect } from 'react';
import {
  X,
  FileText,
  Briefcase,
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Badge, Button } from '../../../components/common';

export interface InternWorkItem {
  id: string;
  title: string;
  projectName: string;
  requiredRole: string;
  percentageWeight: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  targetDate: string;
  assignedRole: string;
  assignmentStatus: string;
}

export interface InternWorkItemDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  workItem: InternWorkItem | null;
}

export const InternWorkItemDetailsDrawer: React.FC<InternWorkItemDetailsDrawerProps> = ({
  isOpen,
  onClose,
  workItem,
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

  if (!isOpen || !workItem) return null;

  const currentContribution = workItem.status === 'COMPLETED' ? `${workItem.percentageWeight}%` : '0%';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <Badge variant="success" size="sm" className="inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </Badge>
        );
      case 'IN_PROGRESS':
        return (
          <Badge variant="blue" size="sm" className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            In Progress
          </Badge>
        );
      case 'NOT_STARTED':
      default:
        return (
          <Badge variant="warning" size="sm" className="inline-flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
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
      aria-labelledby="work-item-details-title"
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-[var(--color-brand-navy)]/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[var(--color-border-subtle)] shadow-2xl flex flex-col h-full relative z-10 animate-slide-in">
          {/* Sticky Drawer Header */}
          <div className="px-6 py-5 border-b border-[var(--color-border-subtle)] flex items-center justify-between shrink-0 bg-[var(--color-surface-subtle)]/30">
            <div className="space-y-1">
              <h2
                id="work-item-details-title"
                className="text-sm font-bold text-[var(--color-brand-navy)] tracking-tight"
              >
                Work Item Details
              </h2>
              <p className="text-[10px] text-[var(--color-text-secondary)]">
                Detailed assignment profile and contribution parameters
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]/50"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* 1. WORK ITEM INFORMATION */}
            <div className="space-y-3.5">
              <h3 className="text-[10px] font-bold text-[var(--color-brand-navy)] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                <FileText className="w-3.5 h-3.5 text-[var(--color-brand-blue)]" />
                Work Item Information
              </h3>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="col-span-2 space-y-1">
                  <span className="text-[var(--color-text-secondary)] block text-[10px] uppercase font-semibold">Work Item</span>
                  <p className="font-bold text-[var(--color-brand-navy)]">{workItem.title}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[var(--color-text-secondary)] block text-[10px] uppercase font-semibold">Project</span>
                  <p className="font-semibold text-slate-800">{workItem.projectName}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[var(--color-text-secondary)] block text-[10px] uppercase font-semibold">Required Role</span>
                  <p className="font-semibold text-slate-800">{workItem.requiredRole}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[var(--color-text-secondary)] block text-[10px] uppercase font-semibold">Percentage Weight</span>
                  <p className="font-semibold text-slate-800">{workItem.percentageWeight}%</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[var(--color-text-secondary)] block text-[10px] uppercase font-semibold">Target Date</span>
                  <p className="font-mono font-semibold text-slate-800">{workItem.targetDate}</p>
                </div>

                <div className="col-span-2 space-y-1">
                  <span className="text-[var(--color-text-secondary)] block text-[10px] uppercase font-semibold">Current Status</span>
                  <div>{getStatusBadge(workItem.status)}</div>
                </div>
              </div>
            </div>

            {/* 2. MY ASSIGNMENT */}
            <div className="space-y-3.5">
              <h3 className="text-[10px] font-bold text-[var(--color-brand-navy)] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[var(--color-brand-blue)]" />
                My Assignment
              </h3>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[var(--color-text-secondary)] block text-[10px] uppercase font-semibold">Assigned Role</span>
                  <p className="font-semibold text-slate-800">{workItem.assignedRole}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[var(--color-text-secondary)] block text-[10px] uppercase font-semibold">Assignment Status</span>
                  <Badge variant="success" size="sm">
                    {workItem.assignmentStatus}
                  </Badge>
                </div>
              </div>
            </div>

            {/* 3. PROGRESS CONTRIBUTION */}
            <div className="space-y-3.5">
              <h3 className="text-[10px] font-bold text-[var(--color-brand-navy)] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                <Layers className="w-3.5 h-3.5 text-[var(--color-brand-blue)]" />
                Progress Contribution
              </h3>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[var(--color-text-secondary)] block text-[10px] uppercase font-semibold">Percentage Weight</span>
                  <p className="font-bold text-[var(--color-brand-navy)]">{workItem.percentageWeight}%</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[var(--color-text-secondary)] block text-[10px] uppercase font-semibold">Current Contribution</span>
                  <p className="font-bold text-emerald-600">{currentContribution}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-[var(--color-text-secondary)] flex items-start gap-2 leading-relaxed">
                <HelpCircle className="w-4 h-4 text-[var(--color-brand-blue)] shrink-0 mt-0.5" />
                <span>Completed work items contribute to project progress based on their assigned percentage weight.</span>
              </div>
            </div>

            {/* 4. STATUS STEPS */}
            <div className="space-y-3.5">
              <h3 className="text-[10px] font-bold text-[var(--color-brand-navy)] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--color-brand-blue)]" />
                Workflow Timeline
              </h3>

              <div className="space-y-3.5 pl-2 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                <div className="flex items-start gap-3 text-xs">
                  <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 mt-1 flex items-center justify-center ${
                    workItem.status === 'NOT_STARTED' ? 'bg-amber-500 border-amber-500 text-white' : 'bg-slate-200 border-slate-200'
                  }`} />
                  <div>
                    <p className={`font-semibold ${workItem.status === 'NOT_STARTED' ? 'text-[var(--color-brand-navy)]' : 'text-slate-500'}`}>Not Started</p>
                    <p className="text-[10px] text-slate-400">Work item is waiting to start</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 mt-1 flex items-center justify-center ${
                    workItem.status === 'IN_PROGRESS' ? 'bg-blue-500 border-blue-500 text-white' : 'bg-slate-200 border-slate-200'
                  }`} />
                  <div>
                    <p className={`font-semibold ${workItem.status === 'IN_PROGRESS' ? 'text-[var(--color-brand-navy)]' : 'text-slate-500'}`}>In Progress</p>
                    <p className="text-[10px] text-slate-400">Task is actively being developed</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 mt-1 flex items-center justify-center ${
                    workItem.status === 'COMPLETED' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-200 border-slate-200'
                  }`} />
                  <div>
                    <p className={`font-semibold ${workItem.status === 'COMPLETED' ? 'text-[var(--color-brand-navy)]' : 'text-slate-500'}`}>Completed</p>
                    <p className="text-[10px] text-slate-400">Task weights verified and closed</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Sticky Drawer Footer */}
          <div className="px-6 py-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)]/60 flex items-center justify-between gap-3 shrink-0">
            <Button type="button" variant="outline" size="md" onClick={onClose} fullWidth>
              Close Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
