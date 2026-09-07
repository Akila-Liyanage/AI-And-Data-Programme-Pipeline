/**
 * RegistrationPage.tsx
 *
 * MODERN WIDE LIGHT BLUE SELF-REGISTRATION CONSOLE
 * Features:
 * - Dynamic Role Selection: Staff Member vs. Intern Trainee with animated selector cards
 * - Wide 2-column responsive layout for personal & professional details
 * - Staff Employment Types: Permanent, Contract Based, Freelance
 * - Intern Tracks: AI/ML, Frontend Developer, Backend Developer, QA, Business Analyst
 * - User Password + Confirm Password with live validation and Show/Hide toggle
 * - Direct submission to POST /api/auth/register with auto User ID generation
 * - Smooth redirect to Pending Verification queue screen
 */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Building,
  GraduationCap,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { Badge, Button } from '../../components/common';
import { AuthLayout } from '../../components/layout/AuthLayout';

/* ── Left Brand Panel ──────────────────────────────────── */
function RegBrandPanel() {
  return (
    <div className="bg-gradient-to-br from-[#0B1F3A] via-[#132D52] to-[#1e3a8a] p-8 sm:p-10 lg:p-12 text-white flex flex-col justify-between h-full relative overflow-hidden">
      {/* Ambient soft glow orbs */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative space-y-8 z-10">
        {/* Emblem */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-base shrink-0 shadow-sm backdrop-blur-sm">
            <span className="text-blue-300">AI</span>
            <span className="text-emerald-400 font-extrabold">+</span>
          </div>
          <div>
            <p className="font-extrabold text-base tracking-tight text-white leading-tight">
              AI & Data Programme Pipeline
            </p>
            <p className="text-xs text-blue-200/80 leading-tight">
              Staff & Intern Registration Portal
            </p>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <Badge variant="blue" dot size="sm" className="bg-white/10 text-blue-200 border-white/20 px-3 py-1">
            Self-Registration Gateway
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug text-white">
            Join the enterprise digital programme workspace.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Create your account credentials. Once registered, your application will be verified by Programme Leadership.
          </p>
        </div>

        {/* Flow visual list */}
        <div className="space-y-5 pt-2">
          {[
            {
              num: '01',
              title: 'Submit Registration Details',
              detail: 'Enter personal info, assign role track, and set your secure password.',
            },
            {
              num: '02',
              title: 'Administrator Verification',
              detail: 'Leadership validates credentials and approves your unique User ID.',
            },
            {
              num: '03',
              title: 'Sign In to Workspace',
              detail: 'Log in with User ID + password to access your role-specific dashboard.',
            },
          ].map(({ num, title, detail }) => (
            <div key={num} className="flex items-start gap-4 group">
              <span className="font-mono text-xs font-bold text-emerald-400 bg-white/10 border border-white/15 px-2.5 py-1 rounded-lg shrink-0 mt-0.5 group-hover:border-emerald-400 transition-colors">
                {num}
              </span>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white leading-tight">{title}</p>
                <p className="text-[11px] text-slate-300 leading-snug mt-1">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-8 relative z-10 pt-4 border-t border-white/10">
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
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* Conditional Fields */
  const [internRole, setInternRole] = useState('AI/ML');
  const [professionalRole, setProfessionalRole] = useState('Senior AI Engineer');
  const [employmentType, setEmploymentType] = useState('Permanent');

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
      newErrors.mobile = 'Enter a valid Sri Lankan mobile number (e.g. 0771234567)';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    /* Conditional validation */
    if (userType === 'INTERN') {
      if (!internRole) newErrors.internRole = 'Please select your Intern Track';
    } else {
      if (!professionalRole) newErrors.professionalRole = 'Please specify your Job Title';
      if (!employmentType) newErrors.employmentType = 'Please select your Employment Type';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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

    const payload = {
      fullName: fullName.trim(),
      phoneNumber: formattedPhone,
      email: email.trim(),
      password: password.trim(),
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
      const message = err instanceof Error ? err.message : 'Registration request failed.';
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout leftPanel={<RegBrandPanel />}>
      <div className="space-y-6 max-w-xl mx-auto w-full">
        {/* Header Block */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[var(--color-brand-blue)] border border-blue-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              Account Registration
            </span>
            <span className="text-xs text-slate-500 font-medium">• Step 1 of 2</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Create Programme Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Register as a Staff Member or Intern Trainee to request workspace access.
          </p>
        </div>

        {/* Global API Error Alert */}
        {apiError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-start gap-2.5 shadow-2xs animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {/* ── ROLE SELECTION INTERACTIVE CARDS ───────────────────── */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800">Select Your Account Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Staff Card */}
            <button
              type="button"
              onClick={() => {
                setUserType('STAFF');
                clearError('employmentType');
                clearError('professionalRole');
              }}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 flex items-start gap-3.5 ${
                userType === 'STAFF'
                  ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50/80 shadow-2xs'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  userType === 'STAFF'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Building className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-sm text-slate-900 block">Permanent Staff</span>
                <span className="text-[11px] text-slate-500 block leading-tight">
                  For engineers, leads, and technical consultants
                </span>
              </div>
            </button>

            {/* Intern Card */}
            <button
              type="button"
              onClick={() => {
                setUserType('INTERN');
                clearError('internRole');
              }}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 flex items-start gap-3.5 ${
                userType === 'INTERN'
                  ? 'border-purple-500 bg-purple-50/80 ring-2 ring-purple-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50/80 shadow-2xs'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  userType === 'INTERN'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-sm text-slate-900 block">Intern Trainee</span>
                <span className="text-[11px] text-slate-500 block leading-tight">
                  For university interns and track trainees
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* ── REGISTRATION FORM ─────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Row 1: Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  clearError('fullName');
                }}
                placeholder="e.g. Kasun Wickramasinghe"
                className="w-full h-11 pl-11 pr-4 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-2xs"
              />
            </div>
            {errors.fullName && <p className="text-[11px] text-rose-600 font-semibold">{errors.fullName}</p>}
          </div>

          {/* Row 2: Email & Phone (2-Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError('email');
                  }}
                  placeholder="kasun@aidata.com"
                  className="w-full h-11 pl-11 pr-4 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-2xs"
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-600 font-semibold">{errors.email}</p>}
            </div>

            {/* Mobile */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value);
                    clearError('mobile');
                  }}
                  placeholder="0771234567"
                  className="w-full h-11 pl-11 pr-4 text-xs sm:text-sm font-mono rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 placeholder:font-sans focus:bg-white focus:outline-hidden focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-2xs"
                />
              </div>
              {errors.mobile && <p className="text-[11px] text-rose-600 font-semibold">{errors.mobile}</p>}
            </div>
          </div>

          {/* Row 3: Role Specific Tracks (2-Columns or Selectors) */}
          {userType === 'STAFF' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200">
              {/* Staff Employment Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-blue-900">
                  Employment Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={employmentType}
                  onChange={(e) => {
                    setEmploymentType(e.target.value);
                    clearError('employmentType');
                  }}
                  className="w-full h-11 px-3.5 text-xs sm:text-sm rounded-xl border border-blue-200 bg-white text-slate-900 focus:outline-hidden focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-2xs cursor-pointer"
                >
                  <option value="Permanent">Permanent</option>
                  <option value="Contract Based">Contract Based</option>
                  <option value="Freelance">Freelance</option>
                </select>
                {errors.employmentType && <p className="text-[11px] text-rose-600 font-semibold">{errors.employmentType}</p>}
              </div>

              {/* Designation */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-blue-900">
                  Professional Designation <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={professionalRole}
                  onChange={(e) => {
                    setProfessionalRole(e.target.value);
                    clearError('professionalRole');
                  }}
                  placeholder="e.g. Senior AI Engineer"
                  className="w-full h-11 px-3.5 text-xs sm:text-sm rounded-xl border border-blue-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-2xs"
                />
                {errors.professionalRole && <p className="text-[11px] text-rose-600 font-semibold">{errors.professionalRole}</p>}
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-1.5">
              <label className="text-xs font-bold text-purple-900">
                Intern Focus Track <span className="text-rose-500">*</span>
              </label>
              <select
                value={internRole}
                onChange={(e) => {
                  setInternRole(e.target.value);
                  clearError('internRole');
                }}
                className="w-full h-11 px-3.5 text-xs sm:text-sm rounded-xl border border-purple-200 bg-white text-slate-900 focus:outline-hidden focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all shadow-2xs cursor-pointer"
              >
                <option value="AI/ML">AI / Machine Learning Track</option>
                <option value="Frontend Developer">Frontend Developer Track</option>
                <option value="Backend Developer">Backend Developer Track</option>
                <option value="QA">Quality Assurance & Testing (QA)</option>
                <option value="Business Analyst">Business & Product Analyst</option>
              </select>
              {errors.internRole && <p className="text-[11px] text-rose-600 font-semibold">{errors.internRole}</p>}
            </div>
          )}

          {/* Row 4: Password & Confirm Password (2-Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError('password');
                  }}
                  placeholder="Min. 6 characters"
                  className="w-full h-11 pl-11 pr-10 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 focus:outline-hidden cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-rose-600 font-semibold">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearError('confirmPassword');
                  }}
                  placeholder="Re-enter password"
                  className="w-full h-11 pl-11 pr-10 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 focus:outline-hidden cursor-pointer p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-rose-600 font-semibold">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              disabled={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="h-12 shadow-md hover:shadow-lg transition-all duration-200 font-bold text-sm transform hover:-translate-y-0.5"
            >
              Submit Registration for Verification
            </Button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
          <span>Already have an authorized User ID? </span>
          <Link
            to="/login"
            className="font-bold text-[var(--color-brand-blue)] hover:text-blue-700 hover:underline inline-flex items-center gap-1 transition-colors"
          >
            <span>Sign In here</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
