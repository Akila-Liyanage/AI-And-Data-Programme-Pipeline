import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  FolderKanban,
  Briefcase,
  Sparkles,
  Save,
} from 'lucide-react';
import { Button, Badge, Alert } from '../../../components/common';
import type { ManagedAssignment } from '../../../types/assignmentManagement.types';

const API_BASE_URL = 'http://localhost:5000/api';

export interface EditAssignmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: ManagedAssignment | null;
  existingAssignments?: any[];
  onAssignmentUpdated?: (updatedAssignment: ManagedAssignment) => void;
}

interface AssignmentFormState {
  projectId: string;
  userCategory: string;
  userId: string;
  assignmentRole: string;
  status: string;
  startDate: string;
  expectedEndDate: string;
  allocationNotes: string;
}

interface AssignmentFormErrors {
  projectId?: string;
  userCategory?: string;
  userId?: string;
  assignmentRole?: string;
  status?: string;
  startDate?: string;
  expectedEndDate?: string;
  allocationNotes?: string;
  general?: string;
}

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

const ASSIGNMENT_STATUSES = [
  'Assigned',
  'Pending',
  'Completed',
];

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

export const EditAssignmentDrawer: React.FC<EditAssignmentDrawerProps> = ({
  isOpen,
  onClose,
  assignment,
  existingAssignments = [],
  onAssignmentUpdated,
}) => {
  const [formData, setFormData] = useState<AssignmentFormState>({
    projectId: '',
    userCategory: 'Permanent Staff',
    userId: '',
    assignmentRole: 'Contributor',
    status: 'Assigned',
    startDate: '',
    expectedEndDate: '',
    allocationNotes: '',
  });

  const [errors, setErrors] = useState<AssignmentFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusNotice, setStatusNotice] = useState<{
    type: 'info' | 'error' | 'success';
    title: string;
    message: string;
  } | null>(null);

  // Dynamic dropdown data from backend
  const [availableProjects, setAvailableProjects] = useState<any[]>([]);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);

  // Fetch dropdown data on open
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

  // Pre-populate form when assignment changes or drawer opens
  useEffect(() => {
    if (assignment && isOpen) {
      setFormData({
        projectId: assignment.projectId || '',
        userCategory: assignment.userCategory?.includes('Intern') ? 'Intern' : 'Permanent Staff',
        userId: assignment.userId || '',
        assignmentRole: assignment.assignmentRole || 'Contributor',
        status: assignment.status || 'Assigned',
        startDate: sanitizeDateForInput(assignment.startDate),
        expectedEndDate: sanitizeDateForInput(assignment.expectedEndDate),
        allocationNotes: assignment.allocationNotes || '',
      });
      setErrors({});
      setStatusNotice(null);
    }
  }, [assignment, isOpen]);

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
    if (errors[field] || errors.general) {
      setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
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

    if (!formData.status) {
      newErrors.status = 'Allocation Status is required.';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start Date is required.';
    }

    if (formData.startDate && formData.expectedEndDate && formData.expectedEndDate < formData.startDate) {
      newErrors.expectedEndDate = 'Expected End Date cannot be earlier than Start Date.';
    }

    // Duplicate Assignment Prevention (excluding current record itself)
    if (formData.projectId && formData.userId && assignment) {
      const isDuplicate = existingAssignments.some((item) => {
        const itemIdentifier = item._id || item.assignmentId || item.id;
        const currentIdentifier = assignment.id;
        if (itemIdentifier === currentIdentifier) {
          return false;
        }
        return item.projectId === formData.projectId && item.userId === formData.userId;
      });

      if (isDuplicate) {
        newErrors.general = 'This team member is already assigned to the selected project.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!assignment) return;
    setStatusNotice(null);

    const isValid = validateForm();
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const selectedProject = availableProjects.find((p) => p.projectId === formData.projectId);
      const selectedUser = availableUsers.find((u) => u.userId === formData.userId);

      const isStaff = formData.userCategory === 'Permanent Staff';
      const professionalRole =
        selectedUser?.designation ||
        selectedUser?.internRole ||
        (isStaff ? 'Staff Engineer' : 'Intern Trainee');

      const payload = {
        projectId: formData.projectId,
        projectName: selectedProject?.name || assignment.projectName,
        userId: formData.userId,
        userName: selectedUser?.fullName || assignment.userName,
        userCategory: formData.userCategory,
        professionalRole: professionalRole || assignment.professionalRole,
        assignmentRole: formData.assignmentRole,
        status: formData.status,
        startDate: formData.startDate,
        expectedEndDate: formData.expectedEndDate || (selectedProject ? selectedProject.targetDate : ''),
        allocationNotes: formData.allocationNotes,
      };

      const identifier = assignment.id;
      const response = await fetch(`${API_BASE_URL}/assignments/${identifier}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update assignment');
      }

      const updatedAssignment: ManagedAssignment = {
        ...assignment,
        projectId: payload.projectId,
        projectName: payload.projectName,
        userId: payload.userId,
        userName: payload.userName,
        userCategory: payload.userCategory,
        professionalRole: payload.professionalRole,
        assignmentRole: payload.assignmentRole as any,
        status: payload.status as any,
        startDate: payload.startDate,
        expectedEndDate: payload.expectedEndDate,
        allocationNotes: payload.allocationNotes,
      };

      setStatusNotice({
        type: 'success',
        title: 'Assignment Updated Successfully',
        message: `Allocation for ${updatedAssignment.userName} on ${updatedAssignment.projectName} has been updated.`,
      });

      if (onAssignmentUpdated) {
        onAssignmentUpdated(updatedAssignment);
      }

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: unknown) {
      console.error('Update assignment failed:', err);
      setStatusNotice({
        type: 'error',
        title: 'Update Failed',
        message: err instanceof Error ? err.message : 'Could not save assignment changes. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !assignment) return null;

  // Filter available users by category while always keeping current user visible
  const filteredUsers = availableUsers.filter((u) => {
    if (u.userId === assignment.userId) return true;
    if (formData.userCategory === 'Permanent Staff') {
      return (u.role === 'PERMANENT_STAFF' || u.role === 'STAFF') && u.accountStatus === 'ACTIVE';
    }
    if (formData.userCategory === 'Intern') {
      return u.role === 'INTERN' && u.accountStatus === 'ACTIVE';
    }
    return u.accountStatus === 'ACTIVE';
  });

  const availableRoles = formData.userCategory === 'Intern' ? ASSIGNMENT_ROLES_INTERN : ASSIGNMENT_ROLES_STAFF;

  const currentProjectObj = availableProjects.find((p) => p.projectId === formData.projectId);
  const currentUserObj = availableUsers.find((u) => u.userId === formData.userId);

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-assignment-title"
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
                <div className="flex items-center gap-2">
                  <h2 id="edit-assignment-title" className="text-base font-bold text-[var(--color-brand-navy)]">
                    Edit Project Assignment
                  </h2>
                  <Badge variant="neutral" size="sm">
                    {assignment.id}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Modify project allocation, assigned role, and timeline schedule.
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
          <form id="edit-assignment-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
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

            {/* Duplicate Conflict Warning */}
            {errors.general && (
              <Alert
                variant="error"
                title="Duplicate Assignment Conflict"
                onClose={() => setErrors((prev) => ({ ...prev, general: undefined }))}
              >
                {errors.general}
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
                    htmlFor="edit-assign-project"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <span>Target Project</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <select
                    id="edit-assign-project"
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
                    htmlFor="edit-assign-category"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <span>User Category</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <select
                    id="edit-assign-category"
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
                    <option value="Intern">Intern</option>
                  </select>
                </div>

                {/* Select User */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="edit-assign-user"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <span>Assigned Member</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <select
                    id="edit-assign-user"
                    required
                    value={formData.userId}
                    onChange={(e) => handleChange('userId', e.target.value)}
                    className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs cursor-pointer"
                  >
                    <option value="">
                      {isLoadingDropdowns
                        ? 'Loading users...'
                        : filteredUsers.length === 0
                        ? 'No active members in this category'
                        : 'Select Team Member…'}
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

            {/* Section 2: Responsibility, Status & Timeline */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Briefcase className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Role, Status & Schedule
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Assignment Role */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="edit-assign-role"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <span>Assignment Role</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <select
                    id="edit-assign-role"
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

                {/* Status */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="edit-assign-status"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <span>Allocation Status</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <select
                    id="edit-assign-status"
                    required
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs cursor-pointer"
                  >
                    {ASSIGNMENT_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Start Date */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="edit-assign-startdate"
                    className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1"
                  >
                    <span>Start Date</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    id="edit-assign-startdate"
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
                    htmlFor="edit-assign-enddate"
                    className="text-xs font-medium text-[var(--color-text-primary)]"
                  >
                    Expected End Date
                  </label>
                  <input
                    id="edit-assign-enddate"
                    type="date"
                    value={formData.expectedEndDate}
                    onChange={(e) => handleChange('expectedEndDate', e.target.value)}
                    className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs"
                  />
                  {errors.expectedEndDate && (
                    <p className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.expectedEndDate}
                    </p>
                  )}
                </div>

                {/* Allocation Notes */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label
                    htmlFor="edit-assign-notes"
                    className="text-xs font-medium text-[var(--color-text-primary)]"
                  >
                    Allocation & Scope Notes
                  </label>
                  <textarea
                    id="edit-assign-notes"
                    rows={3}
                    placeholder="Enter specific responsibilities or deliverables expected from this member..."
                    value={formData.allocationNotes}
                    onChange={(e) => handleChange('allocationNotes', e.target.value)}
                    className="w-full p-3 text-xs sm:text-sm rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Live Assignment Summary Preview */}
            <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--color-brand-blue)]" />
                  Updated Allocation Preview
                </span>
                <div className="flex items-center gap-1.5">
                  <Badge variant="blue" size="sm">
                    {formData.assignmentRole}
                  </Badge>
                  <Badge variant={formData.status === 'Assigned' ? 'success' : formData.status === 'Completed' ? 'blue' : 'warning'} size="sm">
                    {formData.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div>
                  <span className="text-slate-400">Member:</span>{' '}
                  <span className="font-semibold text-slate-800">
                    {currentUserObj?.fullName || assignment.userName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Project:</span>{' '}
                  <span className="font-semibold text-slate-800 truncate">
                    {currentProjectObj?.name || assignment.projectName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Category:</span>{' '}
                  <span className="font-medium text-slate-700">{formData.userCategory}</span>
                </div>
                <div>
                  <span className="text-slate-400">Timeline:</span>{' '}
                  <span className="font-medium text-slate-700">
                    {formData.startDate || '—'} {formData.expectedEndDate ? `→ ${formData.expectedEndDate}` : ''}
                  </span>
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
              form="edit-assignment-form"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {isSubmitting ? 'Saving Changes…' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
