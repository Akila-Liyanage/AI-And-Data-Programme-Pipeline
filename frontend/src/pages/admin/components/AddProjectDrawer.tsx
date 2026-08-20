import React, { useState, useEffect } from 'react';
import {
  X,
  FolderKanban,
  FileText,
  Code2,
  Building2,
  Calendar,
  ArrowRight,
  Info,
  Sparkles,
} from 'lucide-react';
import { Button, Badge, Alert } from '../../../components/common';

export interface AddProjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProjectFormState {
  name: string;
  projectId: string;
  category: string;
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
  projectId?: string;
  category?: string;
  description?: string;
  technologyStack?: string;
  department?: string;
  projectLead?: string;
  startDate?: string;
  targetDate?: string;
  priority?: string;
}

const INITIAL_PROJECT_FORM: ProjectFormState = {
  name: '',
  projectId: '',
  category: '',
  description: '',
  technologyStack: '',
  department: 'AI & Data Systems',
  projectLead: '',
  startDate: '',
  targetDate: '',
  priority: 'Medium',
};

const PROJECT_CATEGORIES = [
  'AI',
  'Data Science',
  'Data Analytics',
  'Software Development',
  'Research',
];

const DEPARTMENTS = [
  'AI & Data Systems',
  'Enterprise Network',
  'Software Architecture',
  'Digital Innovation',
  'Programme Operations',
];

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export const AddProjectDrawer: React.FC<AddProjectDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<ProjectFormState>(INITIAL_PROJECT_FORM);
  const [errors, setErrors] = useState<ProjectFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    if (!formData.projectId.trim()) {
      newErrors.projectId = 'Project ID is required.';
    }

    if (!formData.category) {
      newErrors.category = 'Project Category is required.';
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusNotice(null);

    const isValid = validateForm();
    if (!isValid) return;

    setIsSubmitting(true);

    // Explicitly designate as awaiting backend integration without faking data creation
    setTimeout(() => {
      setIsSubmitting(false);
      setStatusNotice({
        type: 'info',
        title: 'Awaiting backend integration',
        message:
          'Project creation UI is validated and ready for the Project Management API. Project records will be created once the backend service is connected.',
      });
    }, 400);
  };

  const handleResetForm = () => {
    setFormData(INITIAL_PROJECT_FORM);
    setErrors({});
    setStatusNotice(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-project-title"
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
                <Badge variant="info" size="sm">
                  Initial Status: Planned
                </Badge>
              </div>
              <h2
                id="add-project-title"
                className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-brand-navy)]"
              >
                Add Programme Project
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Create a new AI & Data programme project and initialize its governance timeline.
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

          {/* ── Scrollable Form Body ────────────────────────────── */}
          <form
            id="add-project-form"
            onSubmit={handleSubmit}
            noValidate
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            {/* Status notice / backend integration banner */}
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
                    htmlFor="project-name"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <span>Project Name</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    id="project-name"
                    type="text"
                    required
                    placeholder="e.g. SLT Customer Churn AI Engine"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className={`w-full h-10 px-3.5 text-xs sm:text-sm rounded-lg border bg-[var(--color-surface-white)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-hidden transition-all shadow-2xs ${
                      errors.name
                        ? 'border-[var(--color-status-error)] ring-2 ring-[var(--color-status-error)]/20'
                        : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20'
                    }`}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Project ID */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="project-id"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <span>Project ID</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    id="project-id"
                    type="text"
                    required
                    placeholder="e.g. PRJ-AI-001"
                    value={formData.projectId}
                    onChange={(e) => handleChange('projectId', e.target.value.toUpperCase())}
                    aria-invalid={Boolean(errors.projectId)}
                    aria-describedby={errors.projectId ? 'projectid-error' : undefined}
                    className={`w-full h-10 px-3.5 text-xs sm:text-sm font-mono rounded-lg border bg-[var(--color-surface-white)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-hidden transition-all shadow-2xs ${
                      errors.projectId
                        ? 'border-[var(--color-status-error)] ring-2 ring-[var(--color-status-error)]/20'
                        : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20'
                    }`}
                  />
                  {errors.projectId && (
                    <p id="projectid-error" className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.projectId}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="project-category"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <span>Project Category</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <select
                    id="project-category"
                    required
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    aria-invalid={Boolean(errors.category)}
                    aria-describedby={errors.category ? 'category-error' : undefined}
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
                    <p id="category-error" className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="project-desc"
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
                    id="project-desc"
                    rows={3}
                    maxLength={500}
                    required
                    placeholder="Outline project objectives, key milestones, and business scope..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    aria-invalid={Boolean(errors.description)}
                    aria-describedby={errors.description ? 'desc-error' : 'desc-helper'}
                    className={`w-full p-3 text-xs sm:text-sm rounded-lg border bg-[var(--color-surface-white)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-hidden transition-all shadow-2xs resize-none ${
                      errors.description
                        ? 'border-[var(--color-status-error)] ring-2 ring-[var(--color-status-error)]/20'
                        : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20'
                    }`}
                  />
                  {errors.description ? (
                    <p id="desc-error" className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.description}
                    </p>
                  ) : (
                    <p id="desc-helper" className="text-[11px] text-[var(--color-text-secondary)]">
                      Provide a clear summary for assigned staff and interns.
                    </p>
                  )}
                </div>

                {/* Technology Stack */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label
                    htmlFor="project-tech"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <Code2 className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                    <span>Technology / Stack</span>
                  </label>
                  <input
                    id="project-tech"
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
                    htmlFor="project-dept"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <span>Department / Team</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <select
                    id="project-dept"
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
                    htmlFor="project-lead"
                    className="text-xs font-medium text-[var(--color-text-primary)]"
                  >
                    Project Lead (Optional)
                  </label>
                  <input
                    id="project-lead"
                    type="text"
                    placeholder="Project leads available after user integration"
                    value={formData.projectLead}
                    onChange={(e) => handleChange('projectLead', e.target.value)}
                    className="w-full h-10 px-3.5 text-xs sm:text-sm rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 focus:outline-hidden transition-all shadow-2xs"
                  />
                </div>

                {/* Informational Callout */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-[var(--color-brand-blue)] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Project members and interns can be assigned after the project is created through Project Assignments.
                  </p>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Start Date */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="project-start-date"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <span>Start Date</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    id="project-start-date"
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    aria-invalid={Boolean(errors.startDate)}
                    aria-describedby={errors.startDate ? 'startdate-error' : undefined}
                    className={`w-full h-10 px-3 text-xs sm:text-sm rounded-lg border bg-[var(--color-surface-white)] text-[var(--color-text-primary)] focus:outline-hidden transition-all shadow-2xs ${
                      errors.startDate
                        ? 'border-[var(--color-status-error)] ring-2 ring-[var(--color-status-error)]/20'
                        : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20'
                    }`}
                  />
                  {errors.startDate && (
                    <p id="startdate-error" className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.startDate}
                    </p>
                  )}
                </div>

                {/* Target Date */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="project-target-date"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <span>Target Date</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    id="project-target-date"
                    type="date"
                    required
                    value={formData.targetDate}
                    onChange={(e) => handleChange('targetDate', e.target.value)}
                    aria-invalid={Boolean(errors.targetDate)}
                    aria-describedby={errors.targetDate ? 'targetdate-error' : undefined}
                    className={`w-full h-10 px-3 text-xs sm:text-sm rounded-lg border bg-[var(--color-surface-white)] text-[var(--color-text-primary)] focus:outline-hidden transition-all shadow-2xs ${
                      errors.targetDate
                        ? 'border-[var(--color-status-error)] ring-2 ring-[var(--color-status-error)]/20'
                        : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20'
                    }`}
                  />
                  {errors.targetDate && (
                    <p id="targetdate-error" className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.targetDate}
                    </p>
                  )}
                </div>

                {/* Priority */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="project-priority"
                    className="text-xs font-medium text-[var(--color-text-primary)]"
                  >
                    Priority
                  </label>
                  <select
                    id="project-priority"
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
              </div>

              {/* Live Draft Preview */}
              {formData.name && (
                <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--color-brand-blue)]" />
                      Project Summary Preview
                    </span>
                    <Badge variant="blue" size="sm">
                      {formData.category || 'Category Unset'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div>
                      <span className="text-slate-400">Name:</span>{' '}
                      <span className="font-semibold text-slate-800">{formData.name}</span>
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
                      <span className="text-slate-400">Priority:</span>{' '}
                      <span className="font-semibold text-slate-800">{formData.priority}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* ── Sticky Drawer Footer ────────────────────────────── */}
          <div className="px-6 py-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)]/60 flex items-center justify-between gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleResetForm}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              form="add-project-form"
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              rightIcon={!isSubmitting ? <ArrowRight className="w-4 h-4" /> : undefined}
            >
              {isSubmitting ? 'Validating…' : 'Create Project'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
