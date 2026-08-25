import { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  TrendingUp,
  History,
  User,
  Shield,
  ExternalLink,
  Edit2,
  AlertCircle,
} from 'lucide-react';
import {
  DashboardLayout,
  type NavSection,
  type UserDisplayInfo,
} from '../../components/layout/DashboardLayout';
import { Card, Button, Badge } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const INTERN_NAVIGATION: NavSection[] = [
  {
    title: 'Intern Workspace',
    items: [
      {
        id: 'intern-overview',
        label: 'Intern Dashboard',
        path: '/intern/dashboard',
        icon: <LayoutDashboard className="w-4 h-4" />,
      },
      {
        id: 'intern-projects',
        label: 'Assigned Projects',
        path: '/intern/projects',
        icon: <FolderKanban className="w-4 h-4" />,
      },
      {
        id: 'intern-work-items',
        label: 'My Work Items',
        path: '/intern/work-items',
        icon: <CheckSquare className="w-4 h-4" />,
      },
    ],
  },
  {
    title: 'Progress & Records',
    items: [
      {
        id: 'intern-progress',
        label: 'Work Progress',
        path: '/intern/progress',
        icon: <TrendingUp className="w-4 h-4" />,
      },
      {
        id: 'intern-history',
        label: 'Work History',
        path: '/intern/work-history',
        icon: <History className="w-4 h-4" />,
      },
      {
        id: 'intern-profile',
        label: 'My Profile',
        path: '/intern/profile',
        icon: <User className="w-4 h-4" />,
      },
    ],
  },
];

export default function InternProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showEditNotice, setShowEditNotice] = useState(false);

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || '—',
    email: user?.email || '—',
    roleLabel: 'Intern',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Status mapping
  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="neutral">—</Badge>;
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="success">Verified</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending Verification</Badge>;
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>;
      case 'inactive':
      default:
        return <Badge variant="info">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout
      navigation={INTERN_NAVIGATION}
      user={userDisplay}
      notificationsCount={0}
      onLogoutClick={handleLogout}
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border-subtle)] mb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="neutral" size="sm">Workspace &gt; My Profile</Badge>
            <Badge variant="neutral" size="sm">Intern</Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--color-brand-navy)]">
            My Profile
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
            View your programme account, Intern role and access information.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit2 className="w-4 h-4" />}
            onClick={() => setShowEditNotice(true)}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Development Notice Modal overlay */}
        {showEditNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-[var(--color-brand-navy)]/40 backdrop-blur-xs transition-opacity"
              onClick={() => setShowEditNotice(false)}
            />
            <Card className="relative w-full max-w-md shadow-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[var(--color-brand-blue)] shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[var(--color-brand-navy)]">
                    Profile Editing Inactive
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    Profile editing is not available yet.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <Button variant="primary" size="sm" onClick={() => setShowEditNotice(false)}>
                  Close
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* ── 1. PROFILE SUMMARY HEADER CARD ─────────────────────── */}
        <Card padding="md" className="shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-navy)] flex items-center justify-center font-bold text-lg border border-[var(--color-brand-blue)]/20 shadow-sm shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-[var(--color-brand-navy)] truncate">
                  {user?.fullName || '—'}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant="blue" size="sm">
                    ID: {user?.userId || '—'}
                  </Badge>
                  {getStatusBadge(user?.accountStatus)}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-0.5 text-center min-w-[120px]">
                <span className="text-[10px] text-slate-500 font-medium block uppercase tracking-wider">
                  Intern Role
                </span>
                <span className="font-bold text-[var(--color-brand-navy)]">
                  {user?.designation || '—'}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-0.5 text-center min-w-[120px]">
                <span className="text-[10px] text-slate-500 font-medium block uppercase tracking-wider">
                  Department / Team
                </span>
                <span className="font-bold text-[var(--color-brand-navy)]">
                  {user?.department || '—'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ── 2. PERSONAL INFORMATION ─────────────────────────── */}
          <Card title="Personal Information" subtitle="System-authenticated user details" className="shadow-2xs">
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="font-semibold text-slate-500 block">Full Name</span>
                  <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                    {user?.fullName || '—'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-slate-500 block">User ID</span>
                  <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                    {user?.userId || '—'}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-slate-500 block">Email Address</span>
                <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                  {user?.email || '—'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-slate-500 block">Registered Mobile Number</span>
                <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                  {user?.phoneNumber || '—'}
                </p>
                <p className="text-[10px] text-slate-400">
                  This mobile number is used for secure OTP sign-in.
                </p>
              </div>
            </div>
          </Card>

          {/* ── 3. INTERN INFORMATION ──────────────────────────── */}
          <Card title="Intern Information" subtitle="Current program role and alignment" className="shadow-2xs">
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="font-semibold text-slate-500 block">Intern Role</span>
                  <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                    {user?.designation || '—'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-slate-500 block">Department / Team</span>
                  <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                    {user?.department || '—'}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 leading-relaxed text-[11px] italic">
                Your Intern role mapping and department allocations are managed under project supervisor oversight.
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ── 4. ACCOUNT ACCESS & SECURITY ───────────────────── */}
          <Card title="Account Access" subtitle="System roles, parameters, and verification tokens" className="shadow-2xs">
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="font-semibold text-slate-500 block">User Type</span>
                  <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                    <Badge variant="blue">{user?.role || '—'}</Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-slate-500 block">Verification Status</span>
                  <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                    {getStatusBadge(user?.accountStatus)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="font-semibold text-slate-500 block">Login Method</span>
                  <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                    Phone Number + OTP
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-slate-500 block">Account Access Status</span>
                  <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                    Active / Authenticated
                  </p>
                </div>
              </div>

              {/* Secure Account Access card details */}
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2.5 text-blue-800 leading-normal text-[11px]">
                <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-blue-900">Secure Account Access</p>
                  <p className="text-blue-700 font-medium">
                    Your programme account uses your registered mobile number and OTP verification for sign-in.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* ── 5. WORKSPACE QUICK LINKS ────────────────────────── */}
          <Card title="Workspace Quick Links" subtitle="Fast access routes back to active panels" className="shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => navigate('/intern/projects')}
                className="p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-left space-y-1 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-slate-800 font-bold">
                  <span>Assigned Projects</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)]">
                  Check status on active assignments.
                </p>
              </button>

              <button
                type="button"
                onClick={() => navigate('/intern/work-items')}
                className="p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-left space-y-1 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-slate-800 font-bold">
                  <span>My Work Items</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)]">
                  Transition statuses on assigned tasks.
                </p>
              </button>

              <button
                type="button"
                onClick={() => navigate('/intern/progress')}
                className="p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-left space-y-1 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-slate-800 font-bold">
                  <span>Work Progress</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)]">
                  Monitor completed contribution weights.
                </p>
              </button>

              <button
                type="button"
                onClick={() => navigate('/intern/work-history')}
                className="p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-left space-y-1 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-slate-800 font-bold">
                  <span>Work History</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)]">
                  Review historical task logs.
                </p>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
