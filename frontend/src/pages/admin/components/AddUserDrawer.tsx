import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  Building2,
  IdCard,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Button, Badge, Alert } from '../../../components/common';

export interface AddUserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  fullName: string;
  employeeId: string;
  phoneNumber: string;
  email: string;
  category: string;
  professionalRole: string;
  department: string;
}

interface FormErrors {
  fullName?: string;
  employeeId?: string;
  phoneNumber?: string;
  email?: string;
  category?: string;
  professionalRole?: string;
  department?: string;
}

const INITIAL_FORM_STATE: FormState = {
  fullName: '',
  employeeId: '',
  phoneNumber: '',
  email: '',
  category: '',
  professionalRole: '',
  department: 'AI & Data Systems',
};

const PROFESSIONAL_ROLES = [
  'AI Engineer',
  'Data Scientist',
  'Data Analyst',
  'Software Engineer',
  'Business Analyst',
  'Project Manager',
];

const DEPARTMENTS = [
  'AI & Data Systems',
  'Enterprise Network',
  'Software Architecture',
  'Digital Innovation',
  'Programme Operations',
];

export const AddUserDrawer: React.FC<AddUserDrawerProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
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

  const handleChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  /**
   * Helper: Format phone number input (digits only, remove leading 0, max 9 digits)
   */
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    const normalized = rawVal.startsWith('0') ? rawVal.slice(1) : rawVal;
    handleChange('phoneNumber', normalized.slice(0, 9));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Full Name must be at least 3 characters.';
    }

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee or Intern ID is required.';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Registered Mobile Number is required.';
    } else if (formData.phoneNumber.length < 9) {
      newErrors.phoneNumber = 'Please enter a valid 9-digit Sri Lankan mobile number.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.category) {
      newErrors.category = 'User Category is required.';
    }

    if (!formData.professionalRole) {
      newErrors.professionalRole = 'Professional Role is required.';
    }

    if (!formData.department) {
      newErrors.department = 'Department / Team is required.';
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

    // Frontend validation passed.
    // Explicitly designate as awaiting backend integration without faking user creation.
    setTimeout(() => {
      setIsSubmitting(false);
      setStatusNotice({
        type: 'info',
        title: 'Awaiting backend integration',
        message:
          'User creation form is validated and ready for backend integration. Account creation will dispatch to the backend API once connected.',
      });
    }, 400);
  };

  const handleResetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setStatusNotice(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="add-user-title">
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
                  Admin Provisioned
                </Badge>
                <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                  Internal Programme System
                </span>
              </div>
              <h2 id="add-user-title" className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-brand-navy)]">
                Add Programme User
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Create a new programme account and prepare it for administrator review and activation.
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
          <form id="add-user-form" onSubmit={handleSubmit} noValidate className="flex-1 overflow-y-auto p-6 space-y-6">
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

            {/* Section 1: User Identity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <User className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Personal & Account Identification
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="user-fullname" className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1">
                    <span>Full Name</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="user-fullname"
                      type="text"
                      required
                      placeholder="e.g. Kasun Jayawardena"
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={errors.fullName ? 'fullname-error' : undefined}
                      className={`w-full h-10 px-3.5 text-xs sm:text-sm rounded-lg border bg-[var(--color-surface-white)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-hidden transition-all shadow-2xs ${
                        errors.fullName
                          ? 'border-[var(--color-status-error)] ring-2 ring-[var(--color-status-error)]/20'
                          : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20'
                      }`}
                    />
                  </div>
                  {errors.fullName && (
                    <p id="fullname-error" className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Employee / Intern ID */}
                <div className="space-y-1.5">
                  <label htmlFor="user-empid" className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1">
                    <span>Employee / Intern ID</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none">
                      <IdCard className="w-4 h-4" />
                    </div>
                    <input
                      id="user-empid"
                      type="text"
                      required
                      placeholder="e.g. STF-102 / INT-205"
                      value={formData.employeeId}
                      onChange={(e) => handleChange('employeeId', e.target.value.toUpperCase())}
                      aria-invalid={Boolean(errors.employeeId)}
                      aria-describedby={errors.employeeId ? 'empid-error' : undefined}
                      className={`w-full h-10 pl-9 pr-3.5 text-xs sm:text-sm font-mono rounded-lg border bg-[var(--color-surface-white)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-hidden transition-all shadow-2xs ${
                        errors.employeeId
                          ? 'border-[var(--color-status-error)] ring-2 ring-[var(--color-status-error)]/20'
                          : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20'
                      }`}
                    />
                  </div>
                  {errors.employeeId && (
                    <p id="empid-error" className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.employeeId}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label htmlFor="user-email" className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1">
                    <span>Email Address</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="user-email"
                      type="email"
                      required
                      placeholder="e.g. user@slt.lk"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      className={`w-full h-10 pl-9 pr-3.5 text-xs sm:text-sm rounded-lg border bg-[var(--color-surface-white)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-hidden transition-all shadow-2xs ${
                        errors.email
                          ? 'border-[var(--color-status-error)] ring-2 ring-[var(--color-status-error)]/20'
                          : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p id="email-error" className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Registered Mobile Number */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="user-phone" className="text-xs font-medium text-[var(--color-text-primary)] flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span>Registered Mobile Number</span>
                      <span className="text-[var(--color-status-error)]" aria-hidden="true">*</span>
                    </span>
                    <span className="text-[11px] text-[var(--color-brand-blue)] font-normal flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Used for OTP Login
                    </span>
                  </label>

                  <div
                    className={`flex items-center h-10 w-full rounded-lg border bg-[var(--color-surface-white)] transition-all shadow-2xs overflow-hidden ${
                      errors.phoneNumber
                        ? 'border-[var(--color-status-error)] ring-2 ring-[var(--color-status-error)]/20'
                        : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] focus-within:border-[var(--color-brand-blue)] focus-within:ring-2 focus-within:ring-[var(--color-brand-blue)]/20'
                    }`}
                  >
                    <div className="h-full px-3 bg-[var(--color-surface-subtle)] border-r border-[var(--color-border-subtle)] flex items-center gap-1.5 text-xs font-bold text-[var(--color-brand-navy)] select-none shrink-0">
                      <span className="text-sm" aria-hidden="true">🇱🇰</span>
                      <span>+94</span>
                    </div>

                    <input
                      id="user-phone"
                      type="tel"
                      inputMode="numeric"
                      required
                      placeholder="77 123 4567"
                      value={formData.phoneNumber}
                      onChange={handlePhoneChange}
                      aria-invalid={Boolean(errors.phoneNumber)}
                      aria-describedby={errors.phoneNumber ? 'phone-error' : 'phone-helper'}
                      className="h-full flex-1 px-3.5 text-xs sm:text-sm bg-transparent text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-hidden font-medium tracking-wide"
                    />
                  </div>

                  {errors.phoneNumber ? (
                    <p id="phone-error" className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.phoneNumber}
                    </p>
                  ) : (
                    <p id="phone-helper" className="text-[11px] text-[var(--color-text-secondary)]">
                      Enter the 9-digit mobile number without leading 0.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Programme Role & Allocation */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
                <Briefcase className="w-4 h-4 text-[var(--color-brand-green)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                  Programme Role & Workspace Allocation
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* User Category */}
                <div className="space-y-1.5">
                  <label htmlFor="user-category" className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1">
                    <span>User Category</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="user-category"
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
                    <option value="ADMIN">Administrator</option>
                    <option value="PERMANENT_STAFF">Permanent Staff</option>
                    <option value="INTERN">Intern</option>
                  </select>
                  {errors.category && (
                    <p id="category-error" className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Professional Role */}
                <div className="space-y-1.5">
                  <label htmlFor="user-pro-role" className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1">
                    <span>Professional Role</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="user-pro-role"
                    required
                    value={formData.professionalRole}
                    onChange={(e) => handleChange('professionalRole', e.target.value)}
                    aria-invalid={Boolean(errors.professionalRole)}
                    aria-describedby={errors.professionalRole ? 'role-error' : undefined}
                    className={`w-full h-10 px-3 text-xs sm:text-sm rounded-lg border bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden transition-all shadow-2xs cursor-pointer ${
                      errors.professionalRole
                        ? 'border-[var(--color-status-error)] ring-2 ring-[var(--color-status-error)]/20'
                        : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20'
                    }`}
                  >
                    <option value="">Select Professional Role…</option>
                    {PROFESSIONAL_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  {errors.professionalRole && (
                    <p id="role-error" className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.professionalRole}
                    </p>
                  )}
                </div>

                {/* Department / Team */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="user-dept" className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1">
                    <span>Department / Team</span>
                    <span className="text-[var(--color-status-error)]" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <select
                      id="user-dept"
                      required
                      value={formData.department}
                      onChange={(e) => handleChange('department', e.target.value)}
                      aria-invalid={Boolean(errors.department)}
                      aria-describedby={errors.department ? 'dept-error' : undefined}
                      className={`w-full h-10 pl-9 pr-3 text-xs sm:text-sm rounded-lg border bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden transition-all shadow-2xs cursor-pointer ${
                        errors.department
                          ? 'border-[var(--color-status-error)] ring-2 ring-[var(--color-status-error)]/20'
                          : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20'
                      }`}
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.department && (
                    <p id="dept-error" className="text-xs text-[var(--color-status-error)] font-medium">
                      {errors.department}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: User Category Explanation & Account Status */}
            <div className="space-y-4">
              {/* Category Explanation Helper */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-brand-navy)]">
                  <Info className="w-4 h-4 text-[var(--color-brand-blue)] shrink-0" />
                  <span>Category Permissions Guide</span>
                </div>
                <div className="text-[11px] text-[var(--color-text-secondary)] space-y-1 pl-5">
                  <p>
                    • <strong className="text-slate-800">Administrator:</strong> Full administrative oversight & programme user management.
                  </p>
                  <p>
                    • <strong className="text-slate-800">Permanent Staff:</strong> Project supervision, assignment review & team progress tracking.
                  </p>
                  <p>
                    • <strong className="text-slate-800">Intern:</strong> Assigned project execution, task milestones & progress logging.
                  </p>
                </div>
              </div>

              {/* Initial Status Card */}
              <div className="p-3.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)] flex items-center justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-bold text-[var(--color-brand-navy)] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Initial Account Status: Pending
                  </p>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">
                    Accounts are provisioned in Pending status and activated by Administrator review.
                  </p>
                </div>
                <Badge variant="warning" size="sm" className="shrink-0">
                  Pending Activation
                </Badge>
              </div>

              {/* Live Form Summary Preview */}
              {formData.fullName && (
                <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--color-brand-blue)]" />
                      Provisioning Summary Preview
                    </span>
                    <span className="text-[10px] text-blue-600 font-normal">Draft Review</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div>
                      <span className="text-slate-400">Name:</span> <span className="font-semibold text-slate-800">{formData.fullName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">ID:</span> <span className="font-mono font-semibold text-slate-800">{formData.employeeId || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Mobile:</span> <span className="font-semibold text-slate-800">{formData.phoneNumber ? `+94 ${formData.phoneNumber}` : '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Role:</span> <span className="font-semibold text-slate-800">{formData.professionalRole || '—'}</span>
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

            <div className="flex items-center gap-2">
              <Button
                form="add-user-form"
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                rightIcon={!isSubmitting ? <ArrowRight className="w-4 h-4" /> : undefined}
              >
                {isSubmitting ? 'Validating…' : 'Create User'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
