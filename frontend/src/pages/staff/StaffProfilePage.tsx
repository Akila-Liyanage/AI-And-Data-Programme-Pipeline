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
  Briefcase,
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

const STAFF_NAVIGATION: NavSection[] = [
  {
    title: 'Staff Workspace',
    items: [
      {
        id: 'staff-overview',
        label: 'Staff Dashboard',
        path: '/staff/dashboard',
        icon: <LayoutDashboard className="w-4 h-4" />,
      },
      {
        id: 'staff-projects',
        label: 'Assigned Projects',
        path: '/staff/projects',
        icon: <FolderKanban className="w-4 h-4" />,
      },
      {
        id: 'staff-work-items',
        label: 'My Work Items',
        path: '/staff/work-items',
        icon: <CheckSquare className="w-4 h-4" />,
      },
    ],
  },
  {
    title: 'Progress & Records',
    items: [
      {
        id: 'staff-progress',
        label: 'Work Progress',
        path: '/staff/progress',
        icon: <TrendingUp className="w-4 h-4" />,
      },
      {
        id: 'staff-history',
        label: 'Work History',
        path: '/staff/work-history',
        icon: <History className="w-4 h-4" />,
      },
      {
        id: 'staff-profile',
        label: 'My Profile',
        path: '/staff/profile',
        icon: <User className="w-4 h-4" />,
      },
    ],
  },
];

export default function StaffProfilePage() {
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [assignedProjectsCount, setAssignedProjectsCount] = useState<number>(0);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);

  // Edit Profile Modal
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    designation: user?.designation || '',
    department: user?.department || '',
    employmentType: user?.employmentType || '',
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEditFormData({
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        designation: user.designation || 'Staff Engineer',
        department: user.department || 'AI & Data Team',
        employmentType: user.employmentType || 'Permanent',
      });
    }
  }, [user]);

  // Fetch active assignments count from MongoDB
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
        console.error('Failed to load staff assignments:', err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchAssignmentStats();
  }, [user?.userId]);

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || 'Staff Member',
    email: user?.email || 'staff@aidata.com',
    roleLabel: 'Permanent Staff',
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
        employmentType: editFormData.employmentType,
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
      case 'verified':
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

  return (
    <DashboardLayout
      navigation={STAFF_NAVIGATION}
      user={userDisplay}
      notificationsCount={0}
      onNotificationClick={() => {}}
      onProfileClick={() => navigate('/staff/profile')}
      onLogoutClick={handleLogout}
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border-subtle)] mb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="blue" size="sm">Workspace &gt; My Profile</Badge>
            <Badge variant="success" size="sm">Permanent Staff</Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--color-brand-navy)]">
            My Profile
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
            View and manage your programme account, professional information, and active allocations.
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
                    Edit Staff Profile
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
                    placeholder="e.g. Kasun Fernando"
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
                    placeholder="e.g. 0771234567"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Professional Role / Designation</label>
                    <Input
                      value={editFormData.designation}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, designation: e.target.value })
                      }
                      placeholder="e.g. Senior AI Engineer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Employment Type</label>
                    <Input
                      value={editFormData.employmentType}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, employmentType: e.target.value })
                      }
                      placeholder="e.g. Permanent"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Department</label>
                  <Input
                    value={editFormData.department}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, department: e.target.value })
                    }
                    placeholder="e.g. AI & Data Systems"
                  />
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
                <User className="w-7 h-7" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-[var(--color-brand-navy)] truncate">
                  {user?.fullName || 'Staff Member'}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant="blue" size="sm">
                    ID: {user?.userId || 'STF-101'}
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
                  Professional Role
                </span>
                <span className="font-bold text-[var(--color-brand-navy)]">
                  {user?.designation || 'Senior AI Engineer'}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-0.5 text-center min-w-[120px]">
                <span className="text-[10px] text-slate-500 font-medium block uppercase tracking-wider">
                  Employment Type
                </span>
                <span className="font-bold text-[var(--color-brand-navy)]">
                  {user?.employmentType || 'Permanent'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ── 2. PERSONAL INFORMATION ─────────────────────────── */}
          <Card title="Personal Information" subtitle="System-authenticated staff details" className="shadow-2xs">
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
                    Staff User ID
                  </span>
                  <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg font-mono">
                    {user?.userId || '—'}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Registered Email Address
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

          {/* ── 3. PROFESSIONAL INFORMATION ─────────────────────── */}
          <Card title="Professional Information" subtitle="Current role alignment and organizational mapping" className="shadow-2xs">
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    Professional Role
                  </span>
                  <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                    {user?.designation || 'Senior AI Engineer'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    Employment Type
                  </span>
                  <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                    {user?.employmentType || 'Permanent'}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  Department / Team
                </span>
                <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                  {user?.department || 'AI & Data Systems'}
                </p>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-lg text-emerald-800 leading-relaxed text-[11px]">
                <span className="font-bold">Active Staff Member:</span> Fully authorized to lead delivery streams, update assigned work-item weights, and supervise interns.
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
                    <Badge variant="blue">{user?.role || 'PERMANENT_STAFF'}</Badge>
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
                  <span className="font-semibold text-slate-500 block">Account Access</span>
                  <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                    Active / Authenticated
                  </p>
                </div>
              </div>

              {/* Account Security Info Card */}
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2.5 text-blue-800 leading-normal text-[11px]">
                <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-blue-900">Account Security Policy</p>
                  <p className="text-blue-700 font-medium">Your programme access is controlled by your verified Staff account and registered login credentials.</p>
                </div>
              </div>
            </div>
          </Card>

          {/* ── 5. WORKSPACE QUICK LINKS ────────────────────────── */}
          <Card title="Workspace Quick Links" subtitle="Fast access routes back to active panels" className="shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => navigate('/staff/projects')}
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
                onClick={() => navigate('/staff/work-items')}
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
                onClick={() => navigate('/staff/progress')}
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
                onClick={() => navigate('/staff/work-history')}
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
