import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  ExternalLink,
  Edit2,
  Users,
  FolderKanban,
  UserCheck,
  Key,
  Mail,
  Phone,
  Building,
  Calendar,
  CheckCircle2,
  Save,
  X,
} from 'lucide-react';
import {
  DashboardLayout,
  type UserDisplayInfo,
} from '../../components/layout/DashboardLayout';
import { Card, Button, Badge, Input } from '../../components/common';
import { ADMIN_NAVIGATION } from '../../config/adminNavigation';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function AdminProfilePage() {
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalAssignments: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    designation: user?.designation || '',
    department: user?.department || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEditFormData({
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        designation: user.designation || 'System Administrator',
        department: user.department || 'Programme Administration',
      });
    }
  }, [user]);

  // Fetch live system stats from MongoDB
  useEffect(() => {
    const fetchSystemStats = async () => {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      try {
        const [usersRes, projectsRes, assignmentsRes] = await Promise.all([
          fetch('http://localhost:5000/api/users', { headers }),
          fetch('http://localhost:5000/api/projects', { headers }),
          fetch('http://localhost:5000/api/assignments', { headers }),
        ]);

        const usersData = usersRes.ok ? await usersRes.json() : null;
        const projectsData = projectsRes.ok ? await projectsRes.json() : null;
        const assignmentsData = assignmentsRes.ok ? await assignmentsRes.json() : null;

        setStats({
          totalUsers: usersData?.stats?.totalUsers || usersData?.count || 0,
          totalProjects: projectsData?.count || (projectsData?.projects ? projectsData.projects.length : 0),
          totalAssignments: assignmentsData?.count || (assignmentsData?.assignments ? assignmentsData.assignments.length : 0),
        });
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchSystemStats();
  }, []);

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || 'System Administrator',
    email: user?.email || 'admin@aidata.com',
    roleLabel: 'Programme Administrator',
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

  const formattedJoinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'System Inception';

  return (
    <DashboardLayout
      navigation={ADMIN_NAVIGATION}
      user={userDisplay}
      notificationsCount={0}
      onNotificationClick={() => {}}
      onProfileClick={() => navigate('/admin/profile')}
      onLogoutClick={handleLogout}
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border-subtle)] mb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="blue" size="sm">
              Administration &gt; Profile
            </Badge>
            <Badge variant="success" size="sm">
              Super Admin
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--color-brand-navy)]">
            Administrator Profile
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Manage your administrative credentials, system authority, and contact coordinates.
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
                    Edit Administrator Profile
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
                    placeholder="e.g. System Administrator"
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
                    placeholder="e.g. 0774943291"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Designation / Role Title</label>
                    <Input
                      value={editFormData.designation}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, designation: e.target.value })
                      }
                      placeholder="e.g. Lead Administrator"
                    />
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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-navy)] text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                <Shield className="w-8 h-8" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[var(--color-brand-navy)] truncate">
                    {user?.fullName || 'System Administrator'}
                  </h2>
                  <Badge variant="blue" size="sm">
                    {user?.role || 'ADMIN'}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <Badge variant="blue" size="sm">
                    ID: {user?.userId || 'ADM-001'}
                  </Badge>
                  <Badge variant="success" size="sm">
                    Status: {user?.accountStatus || 'ACTIVE'}
                  </Badge>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Joined {formattedJoinDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5 text-center min-w-[120px]">
                <span className="text-[10px] text-slate-500 font-medium block uppercase tracking-wider">
                  Authority Level
                </span>
                <span className="font-bold text-[var(--color-brand-navy)]">
                  Full Control (Root)
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5 text-center min-w-[120px]">
                <span className="text-[10px] text-slate-500 font-medium block uppercase tracking-wider">
                  Department
                </span>
                <span className="font-bold text-[var(--color-brand-navy)]">
                  {user?.department || 'Executive Operations'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* ── 2. LIVE MONGODB SYSTEM SCOPE STATS ───────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card padding="md" className="shadow-2xs bg-gradient-to-br from-blue-50/50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Managed Accounts
                </p>
                <h3 className="text-2xl font-black text-[var(--color-brand-navy)] mt-1">
                  {loadingStats ? '...' : stats.totalUsers}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Staff, Interns & Admins</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-[var(--color-brand-blue)] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card padding="md" className="shadow-2xs bg-gradient-to-br from-emerald-50/50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Programme Projects
                </p>
                <h3 className="text-2xl font-black text-[var(--color-brand-navy)] mt-1">
                  {loadingStats ? '...' : stats.totalProjects}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Active & Planned Deliveries</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <FolderKanban className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card padding="md" className="shadow-2xs bg-gradient-to-br from-indigo-50/50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Live Assignments
                </p>
                <h3 className="text-2xl font-black text-[var(--color-brand-navy)] mt-1">
                  {loadingStats ? '...' : stats.totalAssignments}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Allocated Team Members</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ── 3. PERSONAL & CONTACT DETAILS ───────────────────── */}
          <Card
            title="Administrative Contact Details"
            subtitle="Registered credentials for pipeline communications"
            className="shadow-2xs"
          >
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Full Legal Name
                  </span>
                  <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg">
                    {user?.fullName || 'System Administrator'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-slate-400" />
                    Administrator User ID
                  </span>
                  <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg font-mono">
                    {user?.userId || 'ADM-001'}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Primary Email Address
                </span>
                <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg">
                  {user?.email || 'admin@aidata.com'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Secure OTP Mobile Number
                </span>
                <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg font-mono">
                  {user?.phoneNumber || '0774943291'}
                </p>
              </div>
            </div>
          </Card>

          {/* ── 4. ORGANIZATIONAL & SYSTEM ROLE ─────────────────── */}
          <Card
            title="System Role & Authority"
            subtitle="Governance boundaries and administrative rights"
            className="shadow-2xs"
          >
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    Assigned Designation
                  </span>
                  <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg">
                    {user?.designation || 'System Administrator'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    Department / Unit
                  </span>
                  <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg">
                    {user?.department || 'Executive Operations'}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Account Registration Date
                </span>
                <p className="font-bold text-slate-800 text-[13px] bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg">
                  {formattedJoinDate}
                </p>
              </div>

              <div className="p-3 bg-blue-50/80 border border-blue-100 rounded-lg flex items-start gap-2.5 text-blue-900 leading-normal text-[11px]">
                <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold">Administrative Permissions</p>
                  <p className="text-blue-700 font-medium">
                    This account possesses unrestricted master access to create, verify, update, and terminate projects, work-items, user accounts, and allocations.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ── 5. QUICK SHORTCUTS ──────────────────────────────────── */}
        <Card
          title="Administrative Fast Navigation"
          subtitle="Direct links to primary management consoles"
          className="shadow-2xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-blue-50/30 hover:border-blue-200 text-left space-y-1 cursor-pointer transition-all shadow-2xs"
            >
              <div className="flex items-center justify-between text-slate-800 font-bold">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[var(--color-brand-blue)]" />
                  User Management
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-[11px] text-[var(--color-text-secondary)]">
                Approve, activate or modify team members.
              </p>
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/projects')}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50/30 hover:border-emerald-200 text-left space-y-1 cursor-pointer transition-all shadow-2xs"
            >
              <div className="flex items-center justify-between text-slate-800 font-bold">
                <span className="flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-emerald-600" />
                  Projects Management
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-[11px] text-[var(--color-text-secondary)]">
                Create and structure programme deliveries.
              </p>
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/assignments')}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-indigo-50/30 hover:border-indigo-200 text-left space-y-1 cursor-pointer transition-all shadow-2xs"
            >
              <div className="flex items-center justify-between text-slate-800 font-bold">
                <span className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  Project Assignments
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-[11px] text-[var(--color-text-secondary)]">
                Assign staff and interns to projects.
              </p>
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/progress')}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-purple-50/30 hover:border-purple-200 text-left space-y-1 cursor-pointer transition-all shadow-2xs"
            >
              <div className="flex items-center justify-between text-slate-800 font-bold">
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-purple-600" />
                  Programme Progress
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-[11px] text-[var(--color-text-secondary)]">
                Track completion metrics across projects.
              </p>
            </button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
