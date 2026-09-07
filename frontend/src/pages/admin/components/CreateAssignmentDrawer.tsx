import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  FolderKanban,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { Button, Alert } from '../../../components/common';

const API_BASE_URL = 'http://localhost:5000/api';

export interface CreateAssignmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignmentCreated?: () => void;
  defaultProjectId?: string;
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
  userCategory: 'Permanent Staff',
  userId: '',
  assignmentRole: 'Contributor',
  startDate: '',
  expectedEndDate: '',
  allocationNotes: '',
};

const ASSIGNMENT_ROLES_STAFF = [
  'Project Lead',
  'Supervisor',
  'Business Analyst',
  'Data Analyst',
  'Data Scientist',
  'Software Engineer',
  'QA',
  'AI Engineer',
  'Contributor',
  'Reviewer',
];

const ASSIGNMENT_ROLES_INTERN = [
  'Business Analyst Intern',
  'Frontend Developer Intern',
  'Backend Developer Intern',
  'QA Intern',
  'AI/ML Intern',
  'Intern Contributor',
  'Project Participant',
];

export const CreateAssignmentDrawer: React.FC<CreateAssignmentDrawerProps> = ({
  isOpen,
  onClose,
  onAssignmentCreated,
  defaultProjectId,
}) => {
  const [formData, setFormData] = useState<AssignmentFormState>(INITIAL_ASSIGNMENT_FORM);
  const [errors, setErrors] = useState<AssignmentFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusNotice, setStatusNotice] = useState<{
    type: 'info' | 'error' | 'success';
    title: string;
    message: string;
  } | null>(null);

  // Dynamic lists from backend
  const [availableProjects, setAvailableProjects] = useState<any[]>([]);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);

  // Fetch real projects and users when drawer opens
  useEffect(() => {
    if (!isOpen) return;

    const loadDropdownData = async () => {
      setIsLoadingDropdowns(true);
      try {
        const token = localStorage.getItem('token');
        const [projRes, userRes] = await Promise.all([
          fetch(`${API_BASE_URL}/projects`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const projData = await projRes.json();
        const userData = await userRes.json();

        if (projRes.ok) {
          setAvailableProjects(projData.projects || []);
        }
        if (userRes.ok) {
          setAvailableUsers(userData.users || []);
        }
      } catch (err) {
        console.error('Failed to load assignment dropdowns:', err);
      } finally {
        setIsLoadingDropdowns(false);
      }
    };

    loadDropdownData();
  }, [isOpen]);

  // Sync defaultProjectId if provided
  useEffect(() => {
    if (isOpen && defaultProjectId) {
      setFormData((prev) => ({ ...prev, projectId: defaultProjectId }));
    }
  }, [isOpen, defaultProjectId]);

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
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      // When user is picked, auto-populate role if matching
      if (field === 'userId') {
        const pickedUser = availableUsers.find((u) => u.userId === value);
        if (pickedUser) {
          if (pickedUser.role === 'INTERN') {
            next.userCategory = 'Intern';
            if (pickedUser.internRole) {
              const matchingInternRole = ASSIGNMENT_ROLES_INTERN.find((r) =>
                r.toLowerCase().includes(pickedUser.internRole.toLowerCase())
              );
              if (matchingInternRole) next.assignmentRole = matchingInternRole;
            }
          } else {
            if (pickedUser.employmentType) {
              next.userCategory = `${pickedUser.employmentType} Staff`;
            } else {
              next.userCategory = 'Permanent Staff';
            }
            if (pickedUser.designation && ASSIGNMENT_ROLES_STAFF.includes(pickedUser.designation)) {
              next.assignmentRole = pickedUser.designation;
            }
          }
        }
      }
      return next;
    });

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusNotice(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create assignment');
      }

      setStatusNotice({
        type: 'success',
        title: 'Assignment Created Successfully',
        message: `Successfully allocated member to ${data.assignment?.projectName}.`,
      });

      if (onAssignmentCreated) {
        onAssignmentCreated();
      }

      setTimeout(() => {
        handleResetForm();
      }, 1200);
    } catch (err: any) {
      setStatusNotice({
        type: 'error',
        title: 'Assignment Failed',
        message: err.message || 'Could not connect to assignment service.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData(INITIAL_ASSIGNMENT_FORM);
    setErrors({});
    setStatusNotice(null);
    onClose();
  };

  if (!isOpen) return null;

  // Filter users by selected category
  const filteredUsers = availableUsers.filter((u) => {
    const isStaff = u.role === 'PERMANENT_STAFF' || u.role === 'STAFF';
    const isIntern = u.role === 'INTERN';
    const isActive = u.accountStatus === 'ACTIVE';

    if (formData.userCategory === 'Permanent Staff') {
      return isStaff && (!u.employmentType || u.employmentType === 'Permanent') && isActive;
    }
    if (formData.userCategory === 'Contract Based Staff') {
      return isStaff && u.employmentType === 'Contract Based' && isActive;
    }
    if (formData.userCategory === 'Freelance Staff') {
      return isStaff && u.employmentType === 'Freelance' && isActive;
    }
    if (formData.userCategory === 'Intern') {
      return isIntern && isActive;
    }
    return isActive;
  });

  const availableRoles = formData.userCategory === 'Intern' ? ASSIGNMENT_ROLES_INTERN : ASSIGNMENT_ROLES_STAFF;

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
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-[var(--color-surface-white)] shadow-2xl flex flex-col border-l border-[var(--color-border-subtle)]">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-[var(--color-brand-blue)] flex items-center justify-center shadow-2xs">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 id="create-assignment-title" className="text-base font-bold text-[var(--color-brand-navy)]">
                  Create Project Assignment
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Allocate verified Staff or Intern members to active programme projects.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-white)] transition-colors focus:outline-hidden cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Form Body */}
          <form id="create-assignment-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Status notice */}
            {statusNotice && (
              <Alert
                variant={statusNotice.type}
                title={statusNotice.title}
                onClose={() => setStatusNotice(null)}
              >
                {statusNotice.message}
              </Alert>
            )}

            {/* Section 1: Project & Member Selection */}
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
                  <select
                    id="assign-project"
                    required
                    value={formData.projectId}
                    onChange={(e) => handleChange('projectId', e.target.value)}
                    aria-invalid={Boolean(errors.projectId)}
                    className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs cursor-pointer"
                  >
                    <option value="">{isLoadingDropdowns ? 'Loading projects...' : 'Select a Project…'}</option>
                    {availableProjects.map((p) => (
                      <option key={p.projectId} value={p.projectId}>
                        {p.projectId} — {p.name} ({p.category})
                      </option>
                    ))}
                  </select>
                  {errors.projectId && (
                    <p className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.projectId}
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
                      handleChange('assignmentRole', e.target.value === 'Intern' ? 'Intern Contributor' : 'Contributor');
                    }}
                    className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs cursor-pointer"
                  >
                    <option value="Permanent Staff">Permanent Staff</option>
                    <option value="Contract Based Staff">Contract Based Staff</option>
                    <option value="Freelance Staff">Freelance Staff</option>
                    <option value="Intern">Intern Trainee</option>
                    <option value="ALL">All Verified Members</option>
                  </select>
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
                    className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs cursor-pointer"
                  >
                    <option value="">
                      {isLoadingDropdowns ? 'Loading users...' : filteredUsers.length === 0 ? 'No active members in this pool' : 'Select Team Member…'}
                    </option>
                    {filteredUsers.map((u) => (
                      <option key={u.userId} value={u.userId}>
                        {u.userId} — {u.fullName} ({u.designation || u.internRole || u.role})
                      </option>
                    ))}
                  </select>
                  {errors.userId && (
                    <p className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.userId}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Responsibility & Assignment Role */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Briefcase className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Responsibility & Schedule
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
                    className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs cursor-pointer"
                  >
                    {availableRoles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Start Date */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="assign-startdate"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <span>Start Date</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    id="assign-startdate"
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs"
                  />
                  {errors.startDate && (
                    <p className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.startDate}
                    </p>
                  )}
                </div>

                {/* Expected End Date */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="assign-enddate"
                    className="text-xs font-medium text-[var(--color-text-primary)]"
                  >
                    Expected End Date
                  </label>
                  <input
                    id="assign-enddate"
                    type="date"
                    value={formData.expectedEndDate}
                    onChange={(e) => handleChange('expectedEndDate', e.target.value)}
                    className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs"
                  />
                </div>

                {/* Allocation Notes */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label
                    htmlFor="assign-notes"
                    className="text-xs font-medium text-[var(--color-text-primary)]"
                  >
                    Allocation & Scope Notes
                  </label>
                  <textarea
                    id="assign-notes"
                    rows={3}
                    placeholder="Enter specific responsibilities or deliverables expected from this member..."
                    value={formData.allocationNotes}
                    onChange={(e) => handleChange('allocationNotes', e.target.value)}
                    className="w-full p-3 text-xs sm:text-sm rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs resize-none"
                  />
                </div>
              </div>
            </div>
          </form>

          {/* Drawer Footer */}
          <div className="px-6 py-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="create-assignment-form"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Assign Member
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
