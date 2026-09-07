import React, { useState, useEffect } from 'react';
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
  Mail,
  Phone,
  Building,
  GraduationCap,
  Key,
  CheckCircle2,
  Save,
  X,
} from 'lucide-react';
import {
  DashboardLayout,
  type NavSection,
  type UserDisplayInfo,
} from '../../components/layout/DashboardLayout';
import { Card, Button, Badge, Input } from '../../components/common';
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
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [assignedProjectsCount, setAssignedProjectsCount] = useState<number>(0);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);

  // Edit Profile Modal
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    designation: user?.designation || user?.internRole || '',
    department: user?.department || '',
    internRole: user?.internRole || user?.designation || '',
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEditFormData({
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        designation: user.designation || user.internRole || 'AI/ML Intern',
        department: user.department || 'AI & Data Team',
        internRole: user.internRole || user.designation || 'AI/ML',
      });
    }
  }, [user]);

  // Fetch live assignments count from MongoDB
  useEffect(() => {
    const fetchAssignmentStats = async () => {
      if (!user?.userId) return;
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`http://localhost:5000/api/assignments?userId=${user.userId}`, { headers });
        if (res.ok) {
          const data = await res.json();
          setAssignedProjectsCount(data?.assignments ? data.assignments.length : data?.count || 0);
        }
      } catch (err) {
        console.error('Failed to load intern assignments:', err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchAssignmentStats();
  }, [user?.userId]);

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || 'Intern Trainee',
    email: user?.email || 'intern@aidata.com',
    roleLabel: 'Intern Trainee',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      await updateUserProfile({
        fullName: editFormData.fullName,
        phoneNumber: editFormData.phoneNumber,
        designation: editFormData.designation,
        department: editFormData.department,
        internRole: editFormData.internRole,
      });
      setSaveSuccess('Profile updated successfully!');
      setTimeout(() => {
        setIsEditing(false);
        setSaveSuccess(null);
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
      setSaveError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Status mapping
  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="neutral">Active</Badge>;
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="success">Verified Active</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending Verification</Badge>;
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>;
      default:
        return <Badge variant="info">{status}</Badge>;
    }
  };

  const activeInternRole = user?.internRole || user?.designation || 'AI/ML Intern';

  return (
    <DashboardLayout
      navigation={INTERN_NAVIGATION}
      user={userDisplay}
      notificationsCount={0}
      onNotificationClick={() => {}}
      onProfileClick={() => navigate('/intern/profile')}
      onLogoutClick={handleLogout}
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border-subtle)] mb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="blue" size="sm">Workspace &gt; My Profile</Badge>
            <Badge variant="neutral" size="sm">Intern Trainee</Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--color-brand-navy)]">
            My Profile
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
            View your programme account, specialized Intern track, and active project allocations.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Edit2 className="w-4 h-4" />}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* ── Edit Profile Modal ────────────────────────────────────── */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
              onClick={() => !isSaving && setIsEditing(false)}
            />
            <Card className="relative w-full max-w-lg shadow-2xl border border-slate-200 bg-white p-6 space-y-5 z-10">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[var(--color-brand-blue)] flex items-center justify-center font-bold">
                    <Edit2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-[var(--color-brand-navy)]">
                    Edit Intern Profile
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {saveError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-medium">
                  {saveError}
                </div>
              )}

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {saveSuccess}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Full Name</label>
                  <Input
                    value={editFormData.fullName}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, fullName: e.target.value })
                    }
                    required
                    placeholder="e.g. Ayuni Senarath"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Mobile Phone Number (OTP Login)</label>
                  <Input
                    value={editFormData.phoneNumber}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, phoneNumber: e.target.value })
                    }
                    required
                    placeholder="e.g. 0777654321"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Intern Track / Role</label>
                    <Input
                      value={editFormData.internRole}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, internRole: e.target.value, designation: e.target.value })
                      }
                      placeholder="e.g. AI/ML, Data Science, Python"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Department</label>
                    <Input
                      value={editFormData.department}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, department: e.target.value })
                      }
                      placeholder="e.g. AI & Data Team"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isSaving}
                    leftIcon={<Save className="w-4 h-4" />}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* ── 1. PROFILE SUMMARY HEADER CARD ─────────────────────── */}
        <Card padding="md" className="shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-navy)] flex items-center justify-center font-bold text-lg border border-[var(--color-brand-blue)]/20 shadow-sm shrink-0">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-[var(--color-brand-navy)] truncate">
                  {user?.fullName || 'Intern Trainee'}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant="blue" size="sm">
                    ID: {user?.userId || 'INT-201'}
                  </Badge>
                  {getStatusBadge(user?.accountStatus)}
                  <Badge variant="neutral" size="sm">
                    {loadingStats ? '...' : `${assignedProjectsCount} Active Projects`}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-0.5 text-center min-w-[120px]">
                <span className="text-[10px] text-slate-500 font-medium block uppercase tracking-wider">
                  Intern Role
                </span>
                <span className="font-bold text-[var(--color-brand-navy)]">
                  {activeInternRole}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-0.5 text-center min-w-[120px]">
                <span className="text-[10px] text-slate-500 font-medium block uppercase tracking-wider">
                  Department / Team
                </span>
                <span className="font-bold text-[var(--color-brand-navy)]">
                  {user?.department || 'AI & Data Team'}
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
                  <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Full Name
                  </span>
                  <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                    {user?.fullName || '—'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-slate-400" />
                    Intern User ID
                  </span>
                  <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg font-mono">
                    {user?.userId || '—'}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Email Address
                </span>
                <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                  {user?.email || '—'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Registered Mobile Number (OTP Sign-In)
                </span>
                <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg font-mono">
                  {user?.phoneNumber || '—'}
                </p>
              </div>
            </div>
          </Card>

          {/* ── 3. INTERN INFORMATION ──────────────────────────── */}
          <Card title="Internship & Track Information" subtitle="Current program track and department alignment" className="shadow-2xs">
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    Specialized Role / Track
                  </span>
                  <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                    {activeInternRole}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    Department / Team
                  </span>
                  <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                    {user?.department || 'AI & Data Team'}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg text-blue-900 leading-relaxed text-[11px]">
                <span className="font-bold">Internship Workspace:</span> You are actively allocated to live pipeline projects. You can execute assigned tasks and record work-item status transitions under supervisor mentorship.
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
                  <span className="font-semibold text-slate-500 block">User Role</span>
                  <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                    <Badge variant="blue">{user?.role || 'INTERN'}</Badge>
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
