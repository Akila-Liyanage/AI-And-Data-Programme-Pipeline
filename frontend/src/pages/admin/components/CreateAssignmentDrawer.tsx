import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  FolderKanban,
  Briefcase,
  Calendar,
  FileText,
  ArrowRight,
  Info,
  Sparkles,
} from 'lucide-react';
import { Button, Badge, Alert } from '../../../components/common';

export interface CreateAssignmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AssignmentFormState {
  projectId: string;
  userCategory: string;
  userId: string;
  assignmentRole: string;
  startDate: string;
  expectedEndDate: string;
  allocationNotes: string;
}

interface AssignmentFormErrors {
  projectId?: string;
  userCategory?: string;
  userId?: string;
  assignmentRole?: string;
  startDate?: string;
  expectedEndDate?: string;
  allocationNotes?: string;
}

const INITIAL_ASSIGNMENT_FORM: AssignmentFormState = {
  projectId: '',
  userCategory: '',
  userId: '',
  assignmentRole: '',
  startDate: '',
  expectedEndDate: '',
  allocationNotes: '',
};

const ASSIGNMENT_ROLES_STAFF = [
  'Project Lead',
  'Supervisor',
  'Contributor',
  'Reviewer',
];

const ASSIGNMENT_ROLES_INTERN = [
  'Intern Contributor',
  'Project Participant',
];

const ALL_ASSIGNMENT_ROLES = [
  'Project Lead',
  'Supervisor',
  'Contributor',
  'Intern Contributor',
  'Reviewer',
];

export const CreateAssignmentDrawer: React.FC<CreateAssignmentDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<AssignmentFormState>(INITIAL_ASSIGNMENT_FORM);
  const [errors, setErrors] = useState<AssignmentFormErrors>({});
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

  const handleChange = (field: keyof AssignmentFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: AssignmentFormErrors = {};

    if (!formData.projectId.trim()) {
      newErrors.projectId = 'Project selection is required.';
    }

    if (!formData.userCategory) {
      newErrors.userCategory = 'User Category is required.';
    }

    if (!formData.userId.trim()) {
      newErrors.userId = 'User selection is required.';
    }

    if (!formData.assignmentRole) {
      newErrors.assignmentRole = 'Assignment Role is required.';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start Date is required.';
    }

    if (formData.startDate && formData.expectedEndDate && formData.expectedEndDate < formData.startDate) {
      newErrors.expectedEndDate = 'Expected End Date cannot be earlier than Start Date.';
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
          'Assignment form is validated and ready for the Project Assignment API. Real allocation will be persisted once the backend services are connected.',
      });
    }, 400);
  };

  const handleResetForm = () => {
    setFormData(INITIAL_ASSIGNMENT_FORM);
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
      aria-labelledby="create-assignment-title"
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
                  Project Allocation
                </Badge>
                <Badge variant="warning" size="sm">
                  Initial Status: Pending
                </Badge>
              </div>
              <h2
                id="create-assignment-title"
                className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-brand-navy)]"
              >
                Create Project Assignment
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Assign a programme user to a project and define their responsibility.
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
            id="create-assignment-form"
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

            {/* Section 1: Project & User Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <FolderKanban className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Project & Member Selection
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Select Project */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label
                    htmlFor="assign-project"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <span>Select Project</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      id="assign-project"
                      required
                      value={formData.projectId}
                      onChange={(e) => handleChange('projectId', e.target.value)}
                      aria-invalid={Boolean(errors.projectId)}
                      aria-describedby={errors.projectId ? 'project-error' : 'project-helper'}
                      className={`w-full h-10 px-3 text-xs sm:text-sm rounded-lg border bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden transition-all shadow-2xs cursor-pointer ${
                        errors.projectId
                          ? 'border-[var(--color-status-error)] ring-2 ring-[var(--color-status-error)]/20'
                          : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20'
                      }`}
                    >
                      <option value="">Projects available after project data integration</option>
                      <option value="PRJ-AI-001">PRJ-AI-001 — SLT Customer Churn AI Engine</option>
                      <option value="PRJ-DS-002">PRJ-DS-002 — Network Traffic Prediction Model</option>
                    </select>
                  </div>
                  {errors.projectId ? (
                    <p id="project-error" className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.projectId}
                    </p>
                  ) : (
                    <p id="project-helper" className="text-[11px] text-[var(--color-text-secondary)]">
                      Select an active or planned project from the programme pipeline.
                    </p>
                  )}
                </div>

                {/* User Category */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="assign-category"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <span>User Category</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <select
                    id="assign-category"
                    required
                    value={formData.userCategory}
                    onChange={(e) => {
                      handleChange('userCategory', e.target.value);
                      handleChange('userId', '');
                      handleChange('assignmentRole', '');
                    }}
                    aria-invalid={Boolean(errors.userCategory)}
                    aria-describedby={errors.userCategory ? 'category-error' : undefined}
                    className={`w-full h-10 px-3 text-xs sm:text-sm rounded-lg border bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden transition-all shadow-2xs cursor-pointer ${
                      errors.userCategory
                        ? 'border-[var(--color-status-error)] ring-2 ring-[var(--color-status-error)]/20'
                        : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20'
                    }`}
                  >
                    <option value="">Select Category…</option>
                    <option value="Permanent Staff">Permanent Staff</option>
                    <option value="Intern">Intern</option>
                  </select>
                  {errors.userCategory && (
                    <p id="category-error" className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.userCategory}
                    </p>
                  )}
                </div>

                {/* Select User */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="assign-user"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <span>Select User</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <select
                    id="assign-user"
                    required
                    value={formData.userId}
                    onChange={(e) => handleChange('userId', e.target.value)}
                    aria-invalid={Boolean(errors.userId)}
                    aria-describedby={errors.userId ? 'user-error' : undefined}
                    className={`w-full h-10 px-3 text-xs sm:text-sm rounded-lg border bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden transition-all shadow-2xs cursor-pointer ${
                      errors.userId
                        ? 'border-[var(--color-status-error)] ring-2 ring-[var(--color-status-error)]/20'
                        : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20'
                    }`}
                  >
                    <option value="">Eligible users available after user data integration</option>
                    {formData.userCategory === 'Permanent Staff' && (
                      <>
                        <option value="STF-101">STF-101 — Kasun Jayawardena (AI Engineer)</option>
                        <option value="STF-102">STF-102 — Dilani Perera (Data Scientist)</option>
                      </>
                    )}
                    {formData.userCategory === 'Intern' && (
                      <>
                        <option value="INT-201">INT-201 — Nimna Fernando (Data Analytics Intern)</option>
                        <option value="INT-202">INT-202 — Thilini Bandara (Software Intern)</option>
                      </>
                    )}
                  </select>
                  {errors.userId && (
                    <p id="user-error" className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.userId}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Responsibility & Assignment Role */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Briefcase className="w-4 h-4 text-[var(--color-brand-green)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Assignment Role & Responsibility
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Assignment Role */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label
                    htmlFor="assign-role"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <span>Assignment Role</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <select
                    id="assign-role"
                    required
                    value={formData.assignmentRole}
                    onChange={(e) => handleChange('assignmentRole', e.target.value)}
                    aria-invalid={Boolean(errors.assignmentRole)}
                    aria-describedby={errors.assignmentRole ? 'role-error' : undefined}
                    className={`w-full h-10 px-3 text-xs sm:text-sm rounded-lg border bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden transition-all shadow-2xs cursor-pointer ${
                      errors.assignmentRole
                        ? 'border-[var(--color-status-error)] ring-2 ring-[var(--color-status-error)]/20'
                        : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20'
                    }`}
                  >
                    <option value="">Select Assignment Role…</option>
                    {formData.userCategory === 'Permanent Staff'
                      ? ASSIGNMENT_ROLES_STAFF.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))
                      : formData.userCategory === 'Intern'
                      ? ASSIGNMENT_ROLES_INTERN.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))
                      : ALL_ASSIGNMENT_ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                  </select>
                  {errors.assignmentRole && (
                    <p id="role-error" className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.assignmentRole}
                    </p>
                  )}
                </div>

                {/* Role-Aware Informational Card */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-brand-navy)]">
                    <Info className="w-4 h-4 text-[var(--color-brand-blue)] shrink-0" />
                    <span>Role-Aware Responsibility Guide</span>
                  </div>
                  <div className="text-[11px] text-[var(--color-text-secondary)] space-y-1 pl-5">
                    <p>
                      • <strong className="text-slate-800">Permanent Staff:</strong> Project Lead, Supervisor, Contributor, Reviewer.
                    </p>
                    <p>
                      • <strong className="text-slate-800">Interns:</strong> Intern Contributor, Project Participant.
                    </p>
                  </div>
                </div>

                {/* Allocation / Responsibility Notes */}
                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="assign-notes"
                      className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                      <span>Allocation / Responsibility Notes</span>
                    </label>
                    <span className="text-[11px] text-[var(--color-text-muted)]">
                      {formData.allocationNotes.length}/500 chars
                    </span>
                  </div>
                  <textarea
                    id="assign-notes"
                    rows={3}
                    maxLength={500}
                    placeholder="Specify project scope, deliverables, and supervision expectations..."
                    value={formData.allocationNotes}
                    onChange={(e) => handleChange('allocationNotes', e.target.value)}
                    className="w-full p-3 text-xs sm:text-sm rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 focus:outline-hidden transition-all shadow-2xs resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Timeline & Status */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Calendar className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Timeline & Status
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="assign-start-date"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <span>Start Date</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    id="assign-start-date"
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

                {/* Expected End Date */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="assign-end-date"
                    className="text-xs font-medium text-[var(--color-text-primary)]"
                  >
                    Expected End Date (Optional)
                  </label>
                  <input
                    id="assign-end-date"
                    type="date"
                    value={formData.expectedEndDate}
                    onChange={(e) => handleChange('expectedEndDate', e.target.value)}
                    aria-invalid={Boolean(errors.expectedEndDate)}
                    aria-describedby={errors.expectedEndDate ? 'enddate-error' : undefined}
                    className={`w-full h-10 px-3 text-xs sm:text-sm rounded-lg border bg-[var(--color-surface-white)] text-[var(--color-text-primary)] focus:outline-hidden transition-all shadow-2xs ${
                      errors.expectedEndDate
                        ? 'border-[var(--color-status-error)] ring-2 ring-[var(--color-status-error)]/20'
                        : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20'
                    }`}
                  />
                  {errors.expectedEndDate && (
                    <p id="enddate-error" className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.expectedEndDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Initial Status Card */}
              <div className="p-3.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)] flex items-center justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-bold text-[var(--color-brand-navy)] flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                    Initial Allocation Status: Pending
                  </p>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">
                    Assignments are recorded in Pending status and activated through project milestone onboarding.
                  </p>
                </div>
                <Badge variant="warning" size="sm" className="shrink-0">
                  Pending
                </Badge>
              </div>

              {/* Live Draft Summary Preview */}
              {formData.projectId && (
                <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--color-brand-blue)]" />
                      Assignment Summary Preview
                    </span>
                    <Badge variant="blue" size="sm">
                      {formData.assignmentRole || 'Role Unset'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div>
                      <span className="text-slate-400">Project:</span>{' '}
                      <span className="font-semibold text-slate-800">{formData.projectId}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">User:</span>{' '}
                      <span className="font-semibold text-slate-800">{formData.userId || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Category:</span>{' '}
                      <span className="font-semibold text-slate-800">{formData.userCategory || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Start Date:</span>{' '}
                      <span className="font-semibold text-slate-800">{formData.startDate || '—'}</span>
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
              form="create-assignment-form"
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              rightIcon={!isSubmitting ? <ArrowRight className="w-4 h-4" /> : undefined}
            >
              {isSubmitting ? 'Validating…' : 'Create Assignment'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
