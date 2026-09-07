import React, { useState, useEffect } from 'react';
import {
  X,
  AlertTriangle,
  Trash2,
  Building2,
  Layers,
} from 'lucide-react';
import { Button, Badge, Alert } from '../../../components/common';
import type { ManagedProject } from '../../../types/projectManagement.types';

export interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ManagedProject | null;
  onProjectDeleted?: (deletedProjectId: string) => void;
}

export const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  onProjectDeleted,
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset state on open/close
  useEffect(() => {
    if (isOpen) {
      setIsConfirmed(false);
      setIsDeleting(false);
      setErrorMessage(null);
    }
  }, [isOpen, project]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

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

  const handleDelete = async () => {
    if (!project || !isConfirmed) return;

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const token = localStorage.getItem('token');
      const identifier = project.id || project.projectId;

      const response = await fetch(`http://localhost:5000/api/projects/${identifier}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete project from database.');
      }

      if (onProjectDeleted) {
        onProjectDeleted(identifier);
      }

      onClose();
    } catch (err: unknown) {
      console.error('Delete failed:', err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Failed to delete project. Please check programme dependencies and try again.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-project-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={() => {
          if (!isDeleting) onClose();
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
                  id="delete-project-title"
                  className="text-base sm:text-lg font-bold text-slate-900"
                >
                  Delete Project
                </h3>
                <Badge variant="error" size="sm">
                  Destructive Action
                </Badge>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Confirm removal of programme project and associated governance data.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
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
              title="Deletion Failed"
              onClose={() => setErrorMessage(null)}
            >
              {errorMessage}
            </Alert>
          )}

          {/* Project Details Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Target Project
              </span>
              <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800">
                {project.projectId}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900">{project.name}</h4>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                {project.description || 'No description provided.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/60">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{project.category}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{project.department}</span>
              </div>
            </div>
          </div>

          {/* Destructive Warning Callout */}
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 space-y-1.5 text-xs text-rose-900">
            <p className="font-bold flex items-center gap-1.5 text-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              Warning: Irreversible Management Action
            </p>
            <p className="text-[11px] text-rose-700 leading-relaxed pl-5">
              Deleting this project permanently removes its technical specifications, work-item breakdowns, and historical milestone tracking. Active staff and intern assignments linked to this project may be affected.
            </p>
          </div>

          {/* Explicit Safety Confirmation Checkbox */}
          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors select-none">
            <input
              type="checkbox"
              id="confirm-delete-checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              disabled={isDeleting}
              className="mt-0.5 w-4 h-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-900 block">
                I understand this action cannot be undone
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Confirm that you wish to remove project <strong className="text-slate-800">{project.projectId}</strong> from programme tracking.
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
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={handleDelete}
            disabled={!isConfirmed || isDeleting}
            isLoading={isDeleting}
            leftIcon={!isDeleting ? <Trash2 className="w-4 h-4" /> : undefined}
          >
            {isDeleting ? 'Deleting Project…' : 'Delete Project'}
          </Button>
        </div>
      </div>
    </div>
  );
};
