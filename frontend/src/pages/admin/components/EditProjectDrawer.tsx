import React, { useState, useEffect } from 'react';
import {
  X,
  FolderKanban,
  FileText,
  Code2,
  Building2,
  Calendar,
  Lock,
  Sparkles,
  Save,
} from 'lucide-react';
import { Button, Badge, Alert } from '../../../components/common';
import WorkItemBuilder, { type WorkItem } from './WorkItemBuilder';
import type { ManagedProject } from '../../../types/projectManagement.types';

export interface EditProjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: ManagedProject | null;
  onProjectUpdated?: (updatedProject: ManagedProject) => void;
}

interface ProjectFormState {
  name: string;
  projectId: string;
  category: string;
  status: string;
  description: string;
  technologyStack: string;
  department: string;
  projectLead: string;
  startDate: string;
  targetDate: string;
  priority: string;
}

interface ProjectFormErrors {
  name?: string;
  category?: string;
  status?: string;
  description?: string;
  technologyStack?: string;
  department?: string;
  projectLead?: string;
  startDate?: string;
  targetDate?: string;
  priority?: string;
  workItems?: string;
  [key: string]: string | undefined;
}

const PROJECT_CATEGORIES = [
  'AI',
  'Data Science',
  'Data Analytics',
  'Software Development',
  'Research',
];

const PROJECT_STATUSES = [
  'Planned',
  'Active',
  'On Hold',
  'Completed',
];

const DEPARTMENTS = [
  'AI & Data Systems',
  'Enterprise Network',
  'Software Architecture',
  'Digital Innovation',
  'Programme Operations',
];

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const sanitizeDateForInput = (dateStr?: string | null): string => {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

export const EditProjectDrawer: React.FC<EditProjectDrawerProps> = ({
  isOpen,
  onClose,
  project,
  onProjectUpdated,
}) => {
  const [formData, setFormData] = useState<ProjectFormState>({
    name: '',
    projectId: '',
    category: 'AI',
    status: 'Planned',
    description: '',
    technologyStack: '',
    department: 'AI & Data Systems',
    projectLead: '',
    startDate: '',
    targetDate: '',
    priority: 'Medium',
  });

  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [errors, setErrors] = useState<ProjectFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusNotice, setStatusNotice] = useState<{
    type: 'info' | 'error' | 'success';
    title: string;
    message: string;
  } | null>(null);

  // Initialize and populate form when project changes or drawer opens
  useEffect(() => {
    if (project && isOpen) {
      setFormData({
        name: project.name || '',
        projectId: project.projectId || '',
        category: project.category || 'AI',
        status: project.status || 'Planned',
        description: project.description || '',
        technologyStack: project.technologyStack || '',
        department: project.department || 'AI & Data Systems',
        projectLead: project.projectLead || '',
        startDate: sanitizeDateForInput(project.startDate),
        targetDate: sanitizeDateForInput(project.targetDate),
        priority: project.priority || 'Medium',
      });

      if (project.workItems && Array.isArray(project.workItems) && project.workItems.length > 0) {
        const mappedItems: WorkItem[] = project.workItems.map((item: any) => {
          let status: 'Not Started' | 'In Progress' | 'Completed' = 'Not Started';
          if (item.status === 'DONE' || item.status === 'Completed') {
            status = 'Completed';
          } else if (item.status === 'IN_PROGRESS' || item.status === 'In Progress') {
            status = 'In Progress';
          }

          return {
            id: item.workItemId || item.id || (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9)),
            task: item.title || item.task || '',
            requiredRole: item.role || item.requiredRole || '',
            percentage: Number(item.percentage) || 0,
            status,
          };
        });
        setWorkItems(mappedItems);
      } else {
        setWorkItems([]);
      }

      setErrors({});
      setStatusNotice(null);
    }
  }, [project, isOpen]);

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

  const handleChange = (field: keyof ProjectFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ProjectFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project Name is required.';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Project Name must be at least 3 characters.';
    }

    if (!formData.category) {
      newErrors.category = 'Project Category is required.';
    }

    if (!formData.status) {
      newErrors.status = 'Project Status is required.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project Description is required.';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description should be at least 10 characters.';
    }

    if (!formData.department) {
      newErrors.department = 'Department / Team is required.';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start Date is required.';
    }

    if (!formData.targetDate) {
      newErrors.targetDate = 'Target Completion Date is required.';
    } else if (formData.startDate && formData.targetDate < formData.startDate) {
      newErrors.targetDate = 'Target Date cannot be earlier than Start Date.';
    }

    /* Work Items Validation */
    const totalAllocated = workItems.reduce((sum, item) => sum + (Number(item.percentage) || 0), 0);
    if (workItems.length === 0) {
      newErrors.workItems = 'At least one Work Item is required.';
    } else if (totalAllocated !== 100) {
      newErrors.workItems = `Total Work Item allocation must equal exactly 100% (currently ${totalAllocated}%).`;
    }

    workItems.forEach((item, index) => {
      if (!item.task.trim()) {
        newErrors[`task-${index}`] = 'Task name is required';
      }
      if (!item.requiredRole) {
        newErrors[`role-${index}`] = 'Role is required';
      }
      if (item.percentage <= 0) {
        newErrors[`weight-${index}`] = 'Weight must be > 0%';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!project) return;
    setStatusNotice(null);

    const isValid = validateForm();
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const formattedWorkItems = workItems.map((item) => ({
        workItemId: item.id,
        title: item.task,
        role: item.requiredRole,
        percentage: Number(item.percentage) || 0,
        status: item.status === 'Completed' ? 'DONE' : item.status === 'In Progress' ? 'IN_PROGRESS' : 'TODO',
      }));

      // Calculate progress based on completed items
      const calculatedProgress = formattedWorkItems
        .filter((w) => w.status === 'DONE')
        .reduce((sum, w) => sum + w.percentage, 0);

      const payload = {
        name: formData.name,
        category: formData.category,
        status: formData.status,
        description: formData.description,
        technologyStack: formData.technologyStack,
        department: formData.department,
        projectLead: formData.projectLead || 'Unassigned',
        startDate: formData.startDate,
        targetDate: formData.targetDate,
        priority: formData.priority,
        workItems: formattedWorkItems,
        progress: calculatedProgress,
      };

      const identifier = project.id || project.projectId;
      const response = await fetch(`http://localhost:5000/api/projects/${identifier}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update project.');
      }

      const updatedProject: ManagedProject = {
        ...project,
        ...formData,
        category: formData.category as any,
        status: formData.status as any,
        priority: formData.priority as any,
        progress: calculatedProgress,
        workItems: formattedWorkItems,
      };

      setStatusNotice({
        type: 'success',
        title: 'Project Updated Successfully',
        message: `Project ${formData.name} (${project.projectId}) has been updated.`,
      });

      if (onProjectUpdated) {
        onProjectUpdated(updatedProject);
      }

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: unknown) {
      console.error('Update failed:', err);
      setStatusNotice({
        type: 'error',
        title: 'Update Failed',
        message: err instanceof Error ? err.message : 'Could not save project modifications. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-project-title"
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
                  Project Governance
                </Badge>
                <Badge variant="neutral" size="sm">
                  Editing: {project.projectId}
                </Badge>
              </div>
              <h2
                id="edit-project-title"
                className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-brand-navy)]"
              >
                Edit Programme Project
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Update project specifications, timeline milestones, and work breakdown weights.
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

          {/* ── Scrollable Form Body ────────────────────────────── */}
          <form
            id="edit-project-form"
            onSubmit={handleSubmit}
            noValidate
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            {/* Status notice banner */}
            {statusNotice && (
              <Alert
                variant={statusNotice.type}
                title={statusNotice.title}
                onClose={() => setStatusNotice(null)}
              >
                {statusNotice.message}
              </Alert>
            )}

            {/* Section 1: Core Project Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <FolderKanban className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Project Overview & Classification
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Project Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label
                    htmlFor="edit-project-name"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <span>Project Name</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    id="edit-project-name"
                    type="text"
                    required
                    placeholder="e.g. SLT Customer Churn AI Engine"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'edit-name-error' : undefined}
                    className={`w-full h-10 px-3.5 text-xs sm:text-sm rounded-lg border bg-[var(--color-surface-white)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-hidden transition-all shadow-2xs ${
                      errors.name
                        ? 'border-[var(--color-status-error)] ring-2 ring-[var(--color-status-error)]/20'
                        : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20'
                    }`}
                  />
                  {errors.name && (
                    <p id="edit-name-error" className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Project ID (Read Only) */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="edit-project-id"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Project ID (Immutable)</span>
                  </label>
                  <input
                    id="edit-project-id"
                    type="text"
                    disabled
                    readOnly
                    value={formData.projectId}
                    className="w-full h-10 px-3.5 text-xs sm:text-sm font-mono rounded-lg border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed select-none shadow-2xs"
                  />
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    Project ID is the permanent system identifier.
                  </p>
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="edit-project-category"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <span>Project Category</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <select
                    id="edit-project-category"
                    required
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    aria-invalid={Boolean(errors.category)}
                    aria-describedby={errors.category ? 'edit-category-error' : undefined}
                    className={`w-full h-10 px-3 text-xs sm:text-sm rounded-lg border bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden transition-all shadow-2xs cursor-pointer ${
                      errors.category
                        ? 'border-[var(--color-status-error)] ring-2 ring-[var(--color-status-error)]/20'
                        : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20'
                    }`}
                  >
                    <option value="">Select Category…</option>
                    {PROJECT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p id="edit-category-error" className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="edit-project-status"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <span>Project Status</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <select
                    id="edit-project-status"
                    required
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    aria-invalid={Boolean(errors.status)}
                    className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 focus:outline-hidden transition-all shadow-2xs cursor-pointer"
                  >
                    {PROJECT_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="edit-project-priority"
                    className="text-xs font-medium text-[var(--color-text-primary)]"
                  >
                    Priority Level
                  </label>
                  <select
                    id="edit-project-priority"
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 focus:outline-hidden transition-all shadow-2xs cursor-pointer"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="edit-project-desc"
                      className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                      <span>Project Description</span>
                      <span className="text-[var(--color-status-error)]" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <span className="text-[11px] text-[var(--color-text-muted)]">
                      {formData.description.length}/500 chars
                    </span>
                  </div>
                  <textarea
                    id="edit-project-desc"
                    rows={3}
                    maxLength={500}
                    required
                    placeholder="Outline project objectives, key milestones, and business scope..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    aria-invalid={Boolean(errors.description)}
                    aria-describedby={errors.description ? 'edit-desc-error' : undefined}
                    className={`w-full p-3 text-xs sm:text-sm rounded-lg border bg-[var(--color-surface-white)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-hidden transition-all shadow-2xs resize-none ${
                      errors.description
                        ? 'border-[var(--color-status-error)] ring-2 ring-[var(--color-status-error)]/20'
                        : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20'
                    }`}
                  />
                  {errors.description && (
                    <p id="edit-desc-error" className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Technology Stack */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label
                    htmlFor="edit-project-tech"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <Code2 className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                    <span>Technology / Stack</span>
                  </label>
                  <input
                    id="edit-project-tech"
                    type="text"
                    placeholder="e.g. Python, PyTorch, React, FastAPI, PostgreSQL"
                    value={formData.technologyStack}
                    onChange={(e) => handleChange('technologyStack', e.target.value)}
                    className="w-full h-10 px-3.5 text-xs sm:text-sm rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 focus:outline-hidden transition-all shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Ownership & Team */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Building2 className="w-4 h-4 text-[var(--color-brand-green)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Project Ownership & Team
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Department / Team */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="edit-project-dept"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <span>Department / Team</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <select
                    id="edit-project-dept"
                    required
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 focus:outline-hidden transition-all shadow-2xs cursor-pointer"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Project Lead */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="edit-project-lead"
                    className="text-xs font-medium text-[var(--color-text-primary)]"
                  >
                    Project Lead (Optional)
                  </label>
                  <input
                    id="edit-project-lead"
                    type="text"
                    placeholder="Enter assigned project lead"
                    value={formData.projectLead}
                    onChange={(e) => handleChange('projectLead', e.target.value)}
                    className="w-full h-10 px-3.5 text-xs sm:text-sm rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 focus:outline-hidden transition-all shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Timeline & Governance */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Calendar className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Timeline & Governance
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="edit-project-start-date"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <span>Start Date</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    id="edit-project-start-date"
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    aria-invalid={Boolean(errors.startDate)}
                    aria-describedby={errors.startDate ? 'edit-startdate-error' : undefined}
                    className={`w-full h-10 px-3 text-xs sm:text-sm rounded-lg border bg-[var(--color-surface-white)] text-[var(--color-text-primary)] focus:outline-hidden transition-all shadow-2xs ${
                      errors.startDate
                        ? 'border-[var(--color-status-error)] ring-2 ring-[var(--color-status-error)]/20'
                        : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20'
                    }`}
                  />
                  {errors.startDate && (
                    <p id="edit-startdate-error" className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.startDate}
                    </p>
                  )}
                </div>

                {/* Target Date */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="edit-project-target-date"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <span>Target Date</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    id="edit-project-target-date"
                    type="date"
                    required
                    value={formData.targetDate}
                    onChange={(e) => handleChange('targetDate', e.target.value)}
                    aria-invalid={Boolean(errors.targetDate)}
                    aria-describedby={errors.targetDate ? 'edit-targetdate-error' : undefined}
                    className={`w-full h-10 px-3 text-xs sm:text-sm rounded-lg border bg-[var(--color-surface-white)] text-[var(--color-text-primary)] focus:outline-hidden transition-all shadow-2xs ${
                      errors.targetDate
                        ? 'border-[var(--color-status-error)] ring-2 ring-[var(--color-status-error)]/20'
                        : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20'
                    }`}
                  />
                  {errors.targetDate && (
                    <p id="edit-targetdate-error" className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.targetDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 4: Project Work Breakdown */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Code2 className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Project Work Breakdown
                </h3>
              </div>
              <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                Update work-item definitions and percentage weights. Total percentage weight must equal exactly 100%. Overall project progress recalculates automatically from completed items.
              </p>

              {errors.workItems && (
                <Alert
                  variant="error"
                  title="Allocation Error"
                  onClose={() => setErrors((prev) => ({ ...prev, workItems: undefined }))}
                >
                  {errors.workItems}
                </Alert>
              )}

              <WorkItemBuilder
                workItems={workItems}
                onChange={(items) => {
                  setWorkItems(items);
                  if (errors.workItems) {
                    setErrors((prev) => ({ ...prev, workItems: undefined }));
                  }
                }}
                errors={errors}
              />
            </div>

            {/* Live Summary Preview */}
            <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--color-brand-blue)]" />
                  Updated Project Preview
                </span>
                <div className="flex items-center gap-1.5">
                  <Badge variant="blue" size="sm">
                    {formData.category}
                  </Badge>
                  <Badge variant="neutral" size="sm">
                    {formData.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div>
                  <span className="text-slate-400">Name:</span>{' '}
                  <span className="font-semibold text-slate-800">{formData.name || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400">ID:</span>{' '}
                  <span className="font-mono font-semibold text-slate-800">
                    {formData.projectId || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Department:</span>{' '}
                  <span className="font-semibold text-slate-800">{formData.department}</span>
                </div>
                <div>
                  <span className="text-slate-400">Work Items:</span>{' '}
                  <span className="font-semibold text-slate-800">
                    {workItems.length} items (
                    {workItems.reduce((sum, item) => sum + (Number(item.percentage) || 0), 0)}%)
                  </span>
                </div>
              </div>
            </div>
          </form>

          {/* ── Sticky Drawer Footer ────────────────────────────── */}
          <div className="px-6 py-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)]/60 flex items-center justify-between gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              form="edit-project-form"
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              leftIcon={!isSubmitting ? <Save className="w-4 h-4" /> : undefined}
            >
              {isSubmitting ? 'Saving Changes…' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
