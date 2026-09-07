import React, { useState, useEffect } from 'react';
import {
  X,
  AlertTriangle,
  Trash2,
  FolderKanban,
  User,
  Briefcase,
} from 'lucide-react';
import { Button, Badge, Alert } from '../../../components/common';
import type { ManagedAssignment } from '../../../types/assignmentManagement.types';

const API_BASE_URL = 'http://localhost:5000/api';

export interface RemoveAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: ManagedAssignment | null;
  onAssignmentRemoved?: (removedId: string) => void;
}

export const RemoveAssignmentModal: React.FC<RemoveAssignmentModalProps> = ({
  isOpen,
  onClose,
  assignment,
  onAssignmentRemoved,
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset state on open/close
  useEffect(() => {
    if (isOpen) {
      setIsConfirmed(false);
      setIsRemoving(false);
      setErrorMessage(null);
    }
  }, [isOpen, assignment]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isRemoving) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isRemoving, onClose]);

  // Lock body scroll when open
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

  const handleRemove = async () => {
    if (!assignment || !isConfirmed) return;

    setIsRemoving(true);
    setErrorMessage(null);

    try {
      const token = localStorage.getItem('token');
      const identifier = assignment.id;

      const response = await fetch(`${API_BASE_URL}/assignments/${identifier}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove assignment from database.');
      }

      if (onAssignmentRemoved) {
        onAssignmentRemoved(identifier);
      }

      onClose();
    } catch (err: unknown) {
      console.error('Remove assignment failed:', err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Failed to remove assignment. Please check project dependencies and try again.'
      );
    } finally {
      setIsRemoving(false);
    }
  };

  if (!isOpen || !assignment) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="remove-assignment-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={() => {
          if (!isRemoving) onClose();
        }}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-[var(--color-surface-white)] rounded-2xl shadow-2xl border border-rose-100 overflow-hidden z-10 transition-all">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-b from-rose-50/70 to-white border-b border-rose-100 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  id="remove-assignment-title"
                  className="text-base sm:text-lg font-bold text-slate-900"
                >
                  Remove Assignment
                </h3>
                <Badge variant="error" size="sm">
                  Deallocation
                </Badge>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Revoke member project allocation and responsibility tracking.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isRemoving}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          {/* Error Alert */}
          {errorMessage && (
            <Alert
              variant="error"
              title="Removal Failed"
              onClose={() => setErrorMessage(null)}
            >
              {errorMessage}
            </Alert>
          )}

          {/* Allocation Details Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Target Allocation
              </span>
              <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800">
                {assignment.id}
              </span>
            </div>

            {/* Member and Project Details */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[var(--color-brand-blue)] shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{assignment.userName}</h4>
                  <p className="text-xs text-slate-500 font-mono">
                    {assignment.userId} • {assignment.userCategory}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                <FolderKanban className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-800">{assignment.projectName}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{assignment.projectId}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                <Briefcase className="w-4 h-4 text-emerald-600 shrink-0" />
                <p className="text-xs font-medium text-slate-700">
                  Assigned Role: <span className="font-semibold text-blue-700">{assignment.assignmentRole}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Destructive Warning Box */}
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 space-y-1.5 text-xs text-rose-900">
            <p className="font-bold flex items-center gap-1.5 text-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              Administrative Warning: Allocation Revocation
            </p>
            <p className="text-[11px] text-rose-700 leading-relaxed pl-5">
              Removing this assignment removes the team member from this project's active staffing roster and decrements the project's assigned member count. Previously completed historical work items remain recorded.
            </p>
          </div>

          {/* Explicit Safety Confirmation Checkbox */}
          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors select-none">
            <input
              type="checkbox"
              id="confirm-remove-assignment-checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              disabled={isRemoving}
              className="mt-0.5 w-4 h-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-900 block">
                I understand this will revoke this user's project allocation
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Confirm deallocation of <strong className="text-slate-800">{assignment.userName}</strong> from <strong className="text-slate-800">{assignment.projectName}</strong>.
              </p>
            </div>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isRemoving}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={handleRemove}
            disabled={!isConfirmed || isRemoving}
            isLoading={isRemoving}
            leftIcon={!isRemoving ? <Trash2 className="w-4 h-4" /> : undefined}
          >
            {isRemoving ? 'Removing Assignment…' : 'Remove Assignment'}
          </Button>
        </div>
      </div>
    </div>
  );
};
