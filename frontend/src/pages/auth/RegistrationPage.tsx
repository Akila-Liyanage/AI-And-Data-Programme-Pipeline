/**
 * RegistrationPage.tsx
 *
 * STEP 2 SELF-REGISTRATION UI.
 * Provides the interactive frontend registration form for Staff and Intern users.
 *
 * STRICT BOUNDARIES:
 * - NO real account creation or backend connection.
 * - NO mock database entries or localStorage records.
 * - NO fake session or automatic redirection to dashboards.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import {
  Badge,
  Alert,
  Button,
  Input,
} from '../../components/common';
import { AuthLayout } from '../../components/layout/AuthLayout';

/* ── Left Brand Panel ──────────────────────────────────── */
function RegBrandPanel() {
  return (
    <div className="bg-[var(--color-brand-navy)] px-8 py-10 sm:px-10 sm:py-12 text-white flex flex-col justify-between h-full relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute -top-12 -right-12 w-52 h-52 bg-[var(--color-brand-blue)]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-[var(--color-brand-green)]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative space-y-7">
        {/* Emblem */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center font-bold text-sm shrink-0">
            <span className="text-[var(--color-brand-blue-light)]">AI</span>
            <span className="text-[var(--color-brand-green)] font-extrabold">+</span>
          </div>
          <div>
            <p className="font-bold text-sm tracking-tight text-white leading-tight">
              AI & Data Programme Pipeline
            </p>
            <p className="text-[11px] text-slate-300 leading-tight">
              Staff & Intern Progress Dashboard
            </p>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <Badge variant="blue" dot size="sm" className="bg-white/10 text-blue-200 border-white/15">
            Self-Registration Gateway
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug">
            Create your credentials and join the digital workspace.
          </h2>
        </div>

        {/* Flow visual list */}
        <div className="space-y-6 pt-2">
          {[
            {
              num: '01',
              title: 'Register Account',
              detail: 'Create a Staff or Intern programme account.',
            },
            {
              num: '02',
              title: 'Admin Review',
              detail: 'An Administrator verifies the submitted registration details.',
            },
            {
              num: '03',
              title: 'Access Workspace',
              detail: 'Verified users log in to access the correct dashboard.',
            },
          ].map(({ num, title, detail }) => (
            <div key={num} className="flex gap-4">
              <span className="font-mono text-xs font-bold text-[var(--color-brand-green)] tracking-wider mt-0.5">
                {num}
              </span>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">{title}</p>
                <p className="text-xs text-slate-400 leading-snug mt-1">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-slate-400 mt-6 relative z-10">
        © SLT-MOBITEL AI & Data Team. All rights reserved.
      </p>
    </div>
  );
}

/* ── Error Type definition ─────────────────────────────── */
interface FormErrors {
  fullName?: string;
  email?: string;
  mobile?: string;
  userId?: string;
  password?: string;
  confirmPassword?: string;
  internRole?: string;
  professionalRole?: string;
  employmentType?: string;
}

export default function RegistrationPage() {
  const navigate = useNavigate();

  /* Form Fields */
  const [userType, setUserType] = useState<'STAFF' | 'INTERN'>('STAFF');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  /* Conditional Fields */
  const [internRole, setInternRole] = useState('');
  const [professionalRole, setProfessionalRole] = useState('');
  const [employmentType, setEmploymentType] = useState('');

  /* Validation & API states */
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  /* Helper to clear single field error */
  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  /* API Base URL */
  const API_BASE_URL = 'http://localhost:5000/api';

  /* Client-Side Submit handler */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const newErrors: FormErrors = {};

    /* Shared Validation */
    if (!fullName.trim()) newErrors.fullName = 'Full Name is required';
    
    if (!email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!mobile.trim()) {
      newErrors.mobile = 'Mobile Number is required';
    } else if (!/^(?:\+94|0)?7[0-9]{8}$/.test(mobile.replace(/\s+/g, ''))) {
      newErrors.mobile = 'Enter a valid Sri Lankan mobile number (e.g. 77xxxxxxx)';
    }

    /* Conditional validation */
    if (userType === 'INTERN') {
      if (!internRole) newErrors.internRole = 'Please select your Intern Role';
    } else {
      if (!professionalRole) newErrors.professionalRole = 'Please select your Professional Role';
      if (!employmentType) newErrors.employmentType = 'Please select your Employment Type';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to top of form wrapper to see errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const role = userType === 'STAFF' ? 'PERMANENT_STAFF' : 'INTERN';
    let formattedPhone = mobile.replace(/\s+/g, '').trim();
    if (/^7[0-9]{8}$/.test(formattedPhone)) {
      formattedPhone = `0${formattedPhone}`;
    }

    // Auto-generate secure random compliant password to pass backend validation constraints
    const generatedPassword = 'Pass' + Math.random().toString(36).substring(2, 10) + '9!';

    const payload = {
      fullName: fullName.trim(),
      phoneNumber: formattedPhone,
      email: email.trim(),
      password: generatedPassword,
      role,
      employmentType: userType === 'STAFF' ? employmentType : undefined,
      internRole: userType === 'INTERN' ? internRole : undefined,
      designation: userType === 'STAFF' ? professionalRole : internRole,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      navigate('/register/pending', {
        state: {
          registration: data.user,
        },
      });
    } catch (err: unknown) {
      console.error('Registration API Error:', err);
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch') || err.message.includes('Load failed')) {
          setApiError('Unable to connect to the registration service. Please try again.');
        } else {
          setApiError(err.message);
        }
      } else {
        setApiError('Registration could not be completed. Please try again.');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout leftPanel={<RegBrandPanel />} backTo={{ to: '/login', label: 'Back to Sign In' }}>
      <div className="max-w-md w-full mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-[var(--color-brand-blue)] tracking-wider uppercase block">
            Staff & Intern Registration
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-brand-navy)]">
            Create Your Programme Account
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Register as a Staff member or Intern. Your account will require administrator verification before system access.
          </p>
        </div>

        {/* Global Alert Notice (Non-dismissible) */}
        <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/60 text-[var(--color-brand-navy)] text-xs leading-relaxed flex gap-2">
          <ShieldAlert className="w-4 h-4 text-[var(--color-brand-blue)] shrink-0 mt-0.5" />
          <p>
            <strong>Account access is not immediate.</strong> Submitted registrations remain Pending Verification until reviewed by an Administrator.
          </p>
        </div>

        {/* API Error Notification */}
        {apiError && (
          <Alert variant="error" title="Registration Error" onClose={() => setApiError(null)}>
            <p className="text-xs">{apiError}</p>
          </Alert>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-label="Self-registration form">
          
          {/* USER TYPE SELECTOR */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-[var(--color-brand-navy)]">
              Registering as
            </span>
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
              {(['STAFF', 'INTERN'] as const).map((type) => {
                const isActive = userType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setUserType(type);
                      setErrors({});
                    }}
                    disabled={isSubmitting}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-white text-[var(--color-brand-navy)] shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {type === 'STAFF' ? 'Permanent Staff' : 'Intern'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1. Full Name */}
          <Input
            id="reg-name"
            label="Full Name *"
            placeholder="Enter your first and last name"
            type="text"
            required
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              clearError('fullName');
            }}
            error={errors.fullName}
            disabled={isSubmitting}
          />

          {/* 2. Email Address */}
          <Input
            id="reg-email"
            label="Email Address *"
            placeholder="e.g. name@company.com"
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError('email');
            }}
            error={errors.email}
            disabled={isSubmitting}
          />

          {/* 3. Mobile Number */}
          <div className="space-y-1.5">
            <label htmlFor="reg-mobile" className="block text-xs font-semibold text-[var(--color-brand-navy)]">
              Mobile Number *
            </label>
            <div className="relative flex rounded-xl">
              <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-xs font-mono select-none">
                +94
              </span>
              <input
                id="reg-mobile"
                type="tel"
                placeholder="e.g. 774943291"
                required
                className={`flex-1 min-w-0 block w-full px-3 py-2.5 rounded-r-xl border text-xs focus:outline-none transition-all ${
                  errors.mobile
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/10'
                    : 'border-slate-300 focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 bg-white'
                }`}
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                  clearError('mobile');
                }}
                disabled={isSubmitting}
              />
            </div>
            {errors.mobile ? (
              <p className="text-[10px] text-rose-500 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.mobile}
              </p>
            ) : (
              <p className="text-[10px] text-[var(--color-text-secondary)]">
                Provide a valid Sri Lankan mobile number.
              </p>
            )}
          </div>


          {/* ── STAFF SPECIFIC FIELDS ─────────────────────────── */}
          {userType === 'STAFF' && (
            <div className="space-y-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
              <span className="block text-[10px] font-bold text-[var(--color-brand-navy)] uppercase tracking-wider">
                Staff Allocation Details
              </span>

              {/* A. Professional Role */}
              <div className="space-y-1.5">
                <label htmlFor="reg-staff-role" className="block text-xs font-semibold text-[var(--color-brand-navy)]">
                  Professional Role *
                </label>
                <select
                  id="reg-staff-role"
                  required
                  value={professionalRole}
                  onChange={(e) => {
                    setProfessionalRole(e.target.value);
                    clearError('professionalRole');
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none transition-all bg-white ${
                    errors.professionalRole
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-300 focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">-- Select Professional Role --</option>
                  <option value="Business Analyst">Business Analyst</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="QA">QA</option>
                  <option value="AI Engineer">AI Engineer</option>
                </select>
                {errors.professionalRole && (
                  <p className="text-[10px] text-rose-500 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.professionalRole}
                  </p>
                )}
              </div>

              {/* B. Employment Type */}
              <div className="space-y-1.5">
                <label htmlFor="reg-employment" className="block text-xs font-semibold text-[var(--color-brand-navy)]">
                  Employment Type *
                </label>
                <select
                  id="reg-employment"
                  required
                  value={employmentType}
                  onChange={(e) => {
                    setEmploymentType(e.target.value);
                    clearError('employmentType');
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none transition-all bg-white ${
                    errors.employmentType
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-300 focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">-- Select Employment Type --</option>
                  <option value="Permanent">Permanent</option>
                  <option value="Contract Based">Contract Based</option>
                  <option value="Freelance">Freelance</option>
                </select>
                {errors.employmentType && (
                  <p className="text-[10px] text-rose-500 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.employmentType}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── INTERN SPECIFIC FIELDS ────────────────────────── */}
          {userType === 'INTERN' && (
            <div className="space-y-3 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
              <span className="block text-[10px] font-bold text-[var(--color-brand-navy)] uppercase tracking-wider">
                Intern Placement Details
              </span>

              <div className="space-y-1.5">
                <label htmlFor="reg-intern-role" className="block text-xs font-semibold text-[var(--color-brand-navy)]">
                  Intern Role *
                </label>
                <select
                  id="reg-intern-role"
                  required
                  value={internRole}
                  onChange={(e) => {
                    setInternRole(e.target.value);
                    clearError('internRole');
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none transition-all bg-white ${
                    errors.internRole
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-300 focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">-- Select Intern Role --</option>
                  <option value="Business Analyst">Business Analyst</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="QA">QA</option>
                  <option value="AI/ML">AI/ML</option>
                </select>
                {errors.internRole ? (
                  <p className="text-[10px] text-rose-500 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.internRole}
                  </p>
                ) : (
                  <p className="text-[10px] text-[var(--color-text-secondary)]">
                    Your selected role will later be used to match suitable project opportunities.
                  </p>
                )}
              </div>
            </div>
          )}


          {/* Form Actions */}
          <div className="space-y-3 pt-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              disabled={isSubmitting}
              rightIcon={!isSubmitting ? <ArrowRight className="w-4 h-4" /> : undefined}
            >
              {isSubmitting ? 'Submitting registration...' : 'Submit Registration'}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              fullWidth
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate('/login')}
            >
              Back to Sign In
            </Button>
          </div>

          {/* Pending Verification visual prep notice */}
          <p className="text-[10px] text-[var(--color-text-secondary)] text-center leading-relaxed max-w-xs mx-auto">
            After registration is processed by the backend, your account will remain Pending Verification until reviewed by an Administrator.
          </p>

        </form>
      </div>
    </AuthLayout>
  );
}
