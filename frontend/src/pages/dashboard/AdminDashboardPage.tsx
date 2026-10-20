/**
 * AdminDashboardPage.tsx
 *
 * MODERN LIGHT BLUE ADMIN CONTROL CENTER
 * Features:
 * - Crisp Light Blue / Sky Blue luminous theme with fluid motion
 * - Instant KPI statistics with live database counts
 * - Actionable Pending Verification Queue with 1-click verification
 * - Programme Projects & Work-Item percentage progress tracking
 * - Team Role Distribution & Quick Command shortcuts
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  FolderKanban,
  Sparkles,
  Clock,
  CheckCircle2,
  Building,
  GraduationCap,
  Plus,
  RefreshCw,
  TrendingUp,
  Briefcase,
  History,
  Check,
} from 'lucide-react';
import {
  DashboardLayout,
  PageHeader,
  type UserDisplayInfo,
} from '../../components/layout/DashboardLayout';
import { Button, Badge, Alert, EmptyState } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { ADMIN_NAVIGATION } from '../../config/adminNavigation';
import { UserDetailsDrawer } from '../admin/components/UserDetailsDrawer';
import { AddUserDrawer } from '../admin/components/AddUserDrawer';
import type { ManagedUser } from '../../types/userManagement.types';

import { API_BASE_URL } from '../../config/api';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [quickVerifyLoadingId, setQuickVerifyLoadingId] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Fetch real users and projects from backend
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [userRes, projRes] = await Promise.all([
        fetch(`${API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (userRes.ok) {
        const userData = await userRes.json();
        setUsers(userData.users || []);
      }
      if (projRes.ok) {
        const projData = await projRes.json();
        setProjects(projData.projects || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute Metrics
  const pendingUsers = users.filter((u) => u.accountStatus === 'PENDING');
  const activeUsers = users.filter((u) => u.accountStatus === 'ACTIVE');
  const staffCount = users.filter((u) => u.role === 'PERMANENT_STAFF' || u.role === 'STAFF').length;
  const internCount = users.filter((u) => u.role === 'INTERN').length;
  const pendingCount = pendingUsers.length;
  const activeCount = activeUsers.length;
  const totalProjects = projects.length;
  const avgProgress =
    projects.length > 0
      ? Math.round(
          projects.reduce((acc, p) => acc + (p.progress || 0), 0) / projects.length
        )
      : 0;

  // Direct Quick Verify from Dashboard
  const handleQuickVerify = async (userId: string, userName: string) => {
    setQuickVerifyLoadingId(userId);
    setSuccessNotice(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'ACTIVE' }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify user');
      }

      setSuccessNotice(`Successfully verified and activated ${userName}'s account.`);
      await fetchDashboardData();
    } catch (err) {
      console.error(err);
    } finally {
      setQuickVerifyLoadingId(null);
    }
  };

  const handleOpenDetails = (u: any) => {
    const mapped: ManagedUser = {
      id: u._id || u.id,
      fullName: u.fullName || '—',
      employeeId: u.userId || '—',
      phoneNumber: u.phoneNumber || '—',
      email: u.email || '—',
      category: u.role || '—',
      professionalRole: u.designation || u.internRole || '—',
      department: u.employmentType || u.department || '—',
      accountStatus: u.accountStatus || '—',
      createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—',
      updatedAt: u.updatedAt ? new Date(u.updatedAt).toLocaleDateString() : '—',
    };
    setSelectedUser(mapped);
    setIsDetailsOpen(true);
  };

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || 'Akila Liyanage',
    email: user?.email || 'admin@aidata.com',
    roleLabel: 'System Administrator',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <DashboardLayout
      navigation={ADMIN_NAVIGATION}
      user={userDisplay}
      notificationsCount={pendingCount}
      onNotificationClick={() => navigate('/admin/users')}
      onProfileClick={() => navigate('/admin/profile')}
      onLogoutClick={handleLogout}
    >
      {/* ── Page Header ────────────────────────────────────────── */}
      <PageHeader
        title="Admin Control Center"
        description="Programme operational hub: oversee pending registrations, project work breakdown, and team delivery metrics."
        breadcrumbs={[
          { label: 'Administration' },
          { label: 'Control Center' },
        ]}
        badge={
          <Badge variant="blue" className="shadow-2xs bg-blue-100 text-blue-800 border-blue-200">
            Lead Administrator
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
              onClick={fetchDashboardData}
              disabled={isLoading}
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddUserOpen(true)}
            >
              Provision User
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<UserCheck className="w-4 h-4" />}
              onClick={() => navigate('/admin/users')}
            >
              User Management
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Success Notice */}
        {successNotice && (
          <Alert
            variant="success"
            title="Verification Success"
            onClose={() => setSuccessNotice(null)}
          >
            {successNotice}
          </Alert>
        )}

        {/* ── HERO BANNER: Clean Light Blue & Soft Sky Accent ───── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50/90 via-sky-50 to-indigo-50/70 border border-blue-200/80 p-6 sm:p-7 shadow-xs">
          {/* Ambient soft glow orbs */}
          <div className="absolute -top-16 -right-16 w-52 h-52 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-emerald-300/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-emerald-700 border border-emerald-200 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  System Live & Secured
                </span>
                <span className="text-xs text-slate-500">• AI & Data Pipeline</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Welcome back, {userDisplay.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                {pendingCount > 0 ? (
                  <>
                    You have <strong className="text-blue-700 font-bold">{pendingCount} pending registration request{pendingCount === 1 ? '' : 's'}</strong> awaiting your review and approval.
                  </>
                ) : (
                  'All self-registered Staff and Intern accounts are currently verified and active.'
                )}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/admin/users')}
                className="px-4 py-2.5 rounded-xl bg-[var(--color-brand-blue)] text-white font-bold text-xs hover:bg-[var(--color-brand-blue-hover)] transition-all shadow-xs flex items-center gap-2 cursor-pointer hover:shadow-md active:scale-95 transform"
              >
                <UserCheck className="w-4 h-4 text-blue-200" />
                <span>Review Verification Queue</span>
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black">
                    {pendingCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/projects')}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <FolderKanban className="w-4 h-4 text-[var(--color-brand-green)]" />
                <span>All Projects</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── KPI METRICS CARDS: Light Blue Hover Motion Design ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* KPI 1: Pending Verifications */}
          <div
            onClick={() => navigate('/admin/users')}
            className={`p-5 rounded-2xl bg-white border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer ${
              pendingCount > 0 ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-2xs">
                <Clock className="w-5 h-5" />
              </div>
              <Badge variant={pendingCount > 0 ? 'warning' : 'neutral'} size="sm">
                {pendingCount > 0 ? 'Action Required' : 'Queue Clear'}
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-[var(--color-text-secondary)]">Pending Approvals</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {isLoading ? '—' : pendingCount}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">accounts</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Self-registered queue</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
            </p>
          </div>

          {/* KPI 2: Active Team Members */}
          <div
            onClick={() => navigate('/admin/users')}
            className="p-5 rounded-2xl bg-white border border-slate-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-blue-300"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-2xs">
                <Users className="w-5 h-5" />
              </div>
              <Badge variant="success" size="sm">Verified Directory</Badge>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-[var(--color-text-secondary)]">Active Programme Team</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {isLoading ? '—' : activeCount}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">members</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100 flex items-center gap-2">
              <span className="font-semibold text-slate-700">{staffCount} Staff</span>
              <span>•</span>
              <span className="font-semibold text-slate-700">{internCount} Interns</span>
            </div>
          </div>

          {/* KPI 3: Programme Projects */}
          <div
            onClick={() => navigate('/admin/projects')}
            className="p-5 rounded-2xl bg-white border border-slate-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-blue-300"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-2xs">
                <FolderKanban className="w-5 h-5" />
              </div>
              <Badge variant="blue" size="sm">Projects Portal</Badge>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-[var(--color-text-secondary)]">Monitored Projects</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {isLoading ? '—' : totalProjects}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">pipeline tracks</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>View projects directory</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
            </p>
          </div>

          {/* KPI 4: Work Item Delivery Rate */}
          <div
            onClick={() => navigate('/admin/progress')}
            className="p-5 rounded-2xl bg-white border border-slate-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-blue-300"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center shadow-2xs">
                <TrendingUp className="w-5 h-5" />
              </div>
              <Badge variant="neutral" size="sm">Programme Velocity</Badge>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-[var(--color-text-secondary)]">Completed Progress</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {isLoading ? '—%' : `${avgProgress}%`}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">weighted milestone avg</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100">
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${avgProgress}%` }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* ── 2-COLUMN MAIN DASHBOARD WORKSPACE ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* ── LEFT COLUMN (Primary Operational Cards - 2/3 Width) ── */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Actionable Pending Verification Queue */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Pending Account Verifications
                    </h3>
                    <p className="text-[11px] text-[var(--color-text-secondary)]">
                      Review self-registered Staff & Intern requests and activate system credentials.
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin/users')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  View All Directory
                </Button>
              </div>

              {/* List of Pending Users */}
              {isLoading ? (
                <div className="py-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[var(--color-brand-blue)] border-t-transparent rounded-full animate-spin" />
                  <span>Loading pending queue...</span>
                </div>
              ) : pendingUsers.length === 0 ? (
                <div className="py-8 px-4 text-center rounded-xl bg-slate-50/70 border border-slate-100 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Verification Queue is Clear</p>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    All self-registered Staff and Intern accounts have been verified. New registrations will automatically appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingUsers.map((u) => {
                    const isStaff = u.role === 'PERMANENT_STAFF' || u.role === 'STAFF';
                    const isVerifying = quickVerifyLoadingId === (u._id || u.id);

                    return (
                      <div
                        key={u._id || u.id}
                        className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                              isStaff ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-purple-50 text-purple-700 border border-purple-100'
                            }`}
                          >
                            {isStaff ? <Building className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-xs text-slate-900">{u.fullName}</span>
                              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                                {u.userId}
                              </span>
                              <Badge size="sm" variant={isStaff ? 'success' : 'neutral'}>
                                {isStaff ? 'Permanent Staff' : 'Intern'}
                              </Badge>
                            </div>

                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {u.email} • <span className="font-medium text-slate-700">{u.designation || u.internRole || '—'}</span>
                              {isStaff && u.employmentType && (
                                <span className="text-slate-400"> ({u.employmentType})</span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDetails(u)}
                          >
                            Review
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            isLoading={isVerifying}
                            disabled={isVerifying}
                            leftIcon={<Check className="w-3.5 h-3.5" />}
                            onClick={() => handleQuickVerify(u._id || u.id, u.fullName)}
                          >
                            Verify & Activate
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Active Programme Projects (Work Item Progress Alignment) */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                    <FolderKanban className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Active Projects & Work Item Completion
                    </h3>
                    <p className="text-[11px] text-[var(--color-text-secondary)]">
                      Completed work-item percentages automatically calculate overall project progress.
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin/projects')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Manage Projects
                </Button>
              </div>

              {/* Project Directory Safe State */}
              <EmptyState
                icon={<FolderKanban className="w-6 h-6 text-blue-600" />}
                title="Projects Monitored in Dedicated Management Portal"
                description="Active programme projects, assignments, and work-item breakdown weights are managed in the dedicated Projects Management portal."
                action={
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/admin/projects')}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Open Projects Management
                  </Button>
                }
                minHeight="min-h-[180px]"
              />
            </div>

          </div>

          {/* ── RIGHT COLUMN (Intelligence, Quick Navigation & Governance) ── */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* 1. Team Composition & Role Distribution */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[var(--color-brand-blue)]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Team Composition
                  </h3>
                </div>
                <Badge size="sm" variant="neutral">Directory</Badge>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600 font-medium flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-emerald-600" />
                      Permanent Staff
                    </span>
                    <span className="font-bold text-slate-800">{staffCount} Members</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(staffCount / (staffCount + internCount || 1)) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600 font-medium flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                      Intern Trainees
                    </span>
                    <span className="font-bold text-slate-800">{internCount} Interns</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(internCount / (staffCount + internCount || 1)) * 100}%` }} />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/40 border border-blue-100 space-y-1 text-[11px] text-slate-600">
                <div className="flex justify-between py-0.5">
                  <span>Verified Staff:</span>
                  <span className="font-bold text-slate-800">{users.filter((u) => (u.role === 'PERMANENT_STAFF' || u.role === 'STAFF') && u.accountStatus === 'ACTIVE').length}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span>Verified Interns:</span>
                  <span className="font-bold text-slate-800">{users.filter((u) => u.role === 'INTERN' && u.accountStatus === 'ACTIVE').length}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span>Pending Review:</span>
                  <span className="font-bold text-amber-600">{pendingCount}</span>
                </div>
              </div>
            </div>

            {/* 2. Quick Command Shortcuts Hub */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Sparkles className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Quick Navigation Hub
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    title: 'User Management',
                    desc: 'Review, verify & provision staff / interns',
                    icon: <UserCheck className="w-4 h-4 text-blue-600" />,
                    path: '/admin/users',
                  },
                  {
                    title: 'Project Assignments',
                    desc: 'Allocate team members to project tracks',
                    icon: <Briefcase className="w-4 h-4 text-emerald-600" />,
                    path: '/admin/assignments',
                  },
                  {
                    title: 'Programme Progress',
                    desc: 'Overall milestone & percentage dashboards',
                    icon: <TrendingUp className="w-4 h-4 text-sky-600" />,
                    path: '/admin/progress',
                  },
                  {
                    title: 'Team Work History',
                    desc: 'Inspect completed work items & records',
                    icon: <History className="w-4 h-4 text-indigo-600" />,
                    path: '/admin/work-history',
                  },
                ].map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => navigate(item.path)}
                    className="w-full p-2.5 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/40 transition-all flex items-center justify-between text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800">{item.title}</p>
                        <p className="text-[10px] text-slate-500 truncate">{item.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[var(--color-brand-blue)] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Security & Governance Console */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/60 to-sky-50/50 border border-blue-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[var(--color-brand-blue)]" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Governance Gate
                  </span>
                </div>
                <Badge size="sm" variant="success">Secured</Badge>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-blue-200/50">
                  <span className="text-slate-500">Active Operator:</span>
                  <span className="font-semibold text-slate-800">{userDisplay.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-blue-200/50">
                  <span className="text-slate-500">Security Identity:</span>
                  <span className="font-mono font-semibold text-slate-800">{user?.userId || 'ADM-001'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">RBAC Enforcement:</span>
                  <span className="font-bold text-emerald-700">JWT + Bcrypt Active</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ── Slide-Over Drawers ─────────────────────────────────── */}
      <UserDetailsDrawer
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        user={selectedUser}
        onStatusUpdated={fetchDashboardData}
      />

      <AddUserDrawer
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onUserCreated={fetchDashboardData}
      />
    </DashboardLayout>
  );
}
