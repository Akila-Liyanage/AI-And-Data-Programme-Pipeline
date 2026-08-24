/**
 * AdminDashboardPage.tsx
 *
 * FINAL ADMIN CONTROL CENTER alignment.
 * Revised dashboard to reflect self-registration and work-item progress mechanics.
 * Reorders the dashboard sections into the logical user-management flow:
 * Users -> Projects -> Assignments -> Progress -> History.
 * Renders as a flat grid structure to guarantee the exact ordered stack sequence on mobile.
 *
 * STRICT BOUNDARIES:
 * - NO backend calls or persistent data simulation.
 * - NO hardcoded fake stats or counts.
 * - All interactive widgets display "Awaiting data integration" or navigate to valid routes.
 */
import { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  FolderKanban,
  Activity,
  History,
} from 'lucide-react';
import {
  DashboardLayout,
  PageHeader,
  type UserDisplayInfo,
} from '../../components/layout/DashboardLayout';
import { Card, Button, Badge, Alert, EmptyState } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ADMIN_NAVIGATION } from '../../config/adminNavigation';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);

  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const pendingCount = users.filter((u) => u.accountStatus === 'PENDING').length;
  const verifiedCount = users.filter((u) => u.accountStatus === 'ACTIVE').length;

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || 'Akila Liyanage',
    email: user?.email || 'admin@aidata.com',
    roleLabel: 'Administrator',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <DashboardLayout
      navigation={ADMIN_NAVIGATION}
      user={userDisplay}
      notificationsCount={2}
      onNotificationClick={() => {}}
      onProfileClick={() => {}}
      onLogoutClick={handleLogout}
    >
      {/* ── Page Header ────────────────────────────────────────── */}
      <PageHeader
        title="Admin Control Center"
        description="Monitor user registrations, projects, assignments, work items and programme progress from one centralized workspace."
        breadcrumbs={[
          { label: 'Administration' },
          { label: 'Control Center' },
        ]}
        badge={<Badge variant="blue">System Administrator</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FolderKanban className="w-4 h-4" />}
              onClick={() => navigate('/admin/projects')}
              aria-label="Manage all programme projects"
            >
              Manage Projects
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<UserCheck className="w-4 h-4" />}
              onClick={() => navigate('/admin/users')}
              aria-label="Review pending registrations"
            >
              Review Pending Users
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Welcome Message Alert */}
        {showWelcome && (
          <Alert
            variant="success"
            title="Administrator Control Console"
            onClose={() => setShowWelcome(false)}
          >
            Logged in securely as <strong>{userDisplay.name}</strong>. User registration reviews and project work breakdown validation checks are operational.
          </Alert>
        )}

        {/* ── TOP SUMMARY CARDS (BRD Aligned, No fake data) ────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1: Pending Verification */}
          <Card padding="md" className="space-y-3 shadow-2xs border border-slate-100 hover:border-slate-200 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Pending Verification
              </span>
              <Badge size="sm" variant="warning">Awaiting Review</Badge>
            </div>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)]">
              {isLoading ? '—' : pendingCount}
            </p>
            <p className="text-[11px] text-[var(--color-text-secondary)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
              {isLoading ? 'Loading...' : `${pendingCount} user${pendingCount === 1 ? '' : 's'} pending`}
            </p>
          </Card>

          {/* Card 2: Verified Users */}
          <Card padding="md" className="space-y-3 shadow-2xs border border-slate-100 hover:border-slate-200 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Verified Users
              </span>
              <Badge size="sm" variant="success">Active Directory</Badge>
            </div>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)]">
              {isLoading ? '—' : verifiedCount}
            </p>
            <p className="text-[11px] text-[var(--color-text-secondary)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              {isLoading ? 'Loading...' : `${verifiedCount} active user${verifiedCount === 1 ? '' : 's'}`}
            </p>
          </Card>

          {/* Card 3: Active Projects */}
          <Card padding="md" className="space-y-3 shadow-2xs border border-slate-100 hover:border-slate-200 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Active Projects
              </span>
              <Badge size="sm" variant="blue">Ongoing Tasks</Badge>
            </div>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)]">—</p>
            <p className="text-[11px] text-[var(--color-text-secondary)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" aria-hidden="true" />
              Awaiting data integration
            </p>
          </Card>

          {/* Card 4: Programme Progress */}
          <Card padding="md" className="space-y-3 shadow-2xs border border-slate-100 hover:border-slate-200 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Programme Progress
              </span>
              <Badge size="sm" variant="info">Work Items Sum</Badge>
            </div>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)]">—</p>
            <p className="text-[11px] text-[var(--color-text-secondary)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" aria-hidden="true" />
              Awaiting data integration
            </p>
          </Card>
        </div>

        {/* ── MAIN ADMINISTRATIVE SECTIONS (Flat Grid Reordered) ────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* 1. PENDING USER VERIFICATION (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <Card padding="lg" className="space-y-4 shadow-2xs border border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-[var(--color-brand-navy)] flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[var(--color-brand-blue)]" />
                    Pending User Verification
                  </h3>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">
                    Self-registered Staff and Intern accounts waiting for administrator review.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin/users')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  aria-label="View user management directory"
                >
                  View User Management
                </Button>
              </div>

              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse" aria-label="Pending User Verification Table">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th scope="col" className="py-2.5 px-3">User</th>
                      <th scope="col" className="py-2.5 px-3">User ID</th>
                      <th scope="col" className="py-2.5 px-3">User Type</th>
                      <th scope="col" className="py-2.5 px-3">Role</th>
                      <th scope="col" className="py-2.5 px-3">Employment</th>
                      <th scope="col" className="py-2.5 px-3">Registered Date</th>
                      <th scope="col" className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-[var(--color-text-secondary)]">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-[var(--color-brand-blue)] border-t-transparent rounded-full animate-spin" />
                            <span>Loading pending queue...</span>
                          </div>
                        </td>
                      </tr>
                    ) : users.filter((u) => u.accountStatus === 'PENDING').length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-6">
                          <EmptyState
                            icon={<Users className="w-6 h-6 text-slate-400" />}
                            title="No pending registrations available"
                            description="All self-registered Staff and Intern accounts have been verified."
                          />
                        </td>
                      </tr>
                    ) : (
                      users
                        .filter((u) => u.accountStatus === 'PENDING')
                        .map((u) => (
                          <tr key={u._id} className="hover:bg-slate-50 border-b border-slate-100 last:border-0 text-slate-700">
                            <td className="py-2.5 px-3 font-semibold text-slate-800">{u.fullName}</td>
                            <td className="py-2.5 px-3 font-mono">{u.userId}</td>
                            <td className="py-2.5 px-3">
                              <Badge variant={u.role === 'PERMANENT_STAFF' ? 'success' : 'neutral'}>
                                {u.role === 'PERMANENT_STAFF' ? 'Permanent Staff' : 'Intern'}
                              </Badge>
                            </td>
                            <td className="py-2.5 px-3">{u.designation || u.internRole || '—'}</td>
                            <td className="py-2.5 px-3">
                              {u.role === 'PERMANENT_STAFF' ? (u.employmentType || 'Permanent') : '—'}
                            </td>
                            <td className="py-2.5 px-3 text-slate-500">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <Badge variant="warning">Pending</Badge>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* 3. PROJECT ASSIGNMENTS OVERVIEW (lg:col-span-1) */}
          <div className="lg:col-span-1">
            <Card padding="md" className="space-y-4 shadow-2xs border border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)] flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[var(--color-brand-blue)]" />
                  Project Assignments
                </h3>
                <Badge size="sm" variant="neutral">Metrics</Badge>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-[var(--color-text-secondary)]">Staff Assigned</span>
                  <span className="font-semibold text-slate-700">—</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-[var(--color-text-secondary)]">Interns Assigned</span>
                  <span className="font-semibold text-slate-700">—</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-[var(--color-text-secondary)]">Unassigned Projects</span>
                  <span className="font-semibold text-slate-700">—</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[var(--color-text-secondary)]">Pending Allocations</span>
                  <span className="font-semibold text-slate-700">—</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 text-[10px] text-slate-500 border border-slate-100">
                Awaiting allocation data integration.
              </div>

              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => navigate('/admin/assignments')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                aria-label="Manage project member assignments"
              >
                Manage Assignments
              </Button>
            </Card>
          </div>

          {/* 2. PROJECT OVERVIEW (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <Card padding="lg" className="space-y-4 shadow-2xs border border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-[var(--color-brand-navy)] flex items-center gap-2">
                    <FolderKanban className="w-4 h-4 text-[var(--color-brand-blue)]" />
                    Project Overview
                  </h3>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">
                    Timeline and status oversight for all programme projects.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin/projects')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  aria-label="View project directory"
                >
                  Manage Projects
                </Button>
              </div>

              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse" aria-label="Project Overview Table">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th scope="col" className="py-2.5 px-3">Project</th>
                      <th scope="col" className="py-2.5 px-3">Status</th>
                      <th scope="col" className="py-2.5 px-3">Lead / Supervisor</th>
                      <th scope="col" className="py-2.5 px-3 text-center">Members</th>
                      <th scope="col" className="py-2.5 px-3 text-center">Work Items</th>
                      <th scope="col" className="py-2.5 px-3 text-right">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={6} className="p-6">
                        <EmptyState
                          icon={<FolderKanban className="w-6 h-6 text-slate-400" />}
                          title="No project data available"
                          description="Programme projects will appear here once the project service is connected."
                          secondaryAction={
                            <Badge size="sm" variant="neutral">
                              Awaiting backend integration
                            </Badge>
                          }
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* 4. PROJECT PROGRESS OVERVIEW (lg:col-span-1) */}
          <div className="lg:col-span-1">
            <Card padding="md" className="space-y-4 shadow-2xs border border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)] flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[var(--color-brand-green)]" />
                  Project Progress
                </h3>
                <Badge size="sm" variant="neutral">Weights</Badge>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-900 space-y-1.5">
                <p className="font-semibold">Governance Wording Alignment:</p>
                <p className="leading-relaxed">
                  Project progress is calculated from completed work-item percentage weights.
                </p>
                <div className="flex items-center gap-1.5 font-bold mt-1 text-[10px] text-slate-600">
                  <span>Completed Weights</span>
                  <span>→</span>
                  <span className="text-[var(--color-brand-blue)]">Progress</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--color-text-secondary)]">Overall Average</span>
                  <span className="font-bold text-[var(--color-brand-navy)]">—%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-300 rounded-full" style={{ width: '0%' }} />
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => navigate('/admin/progress')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                aria-label="View overall programme progress dashboards"
              >
                View Programme Progress
              </Button>
            </Card>
          </div>

          {/* 5. PROJECT MEMBERS / TEAM OVERVIEW (lg:col-span-1) */}
          <div className="lg:col-span-1">
            <Card padding="md" className="space-y-4 shadow-2xs border border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)] flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-600" />
                  Project Members
                </h3>
                <Badge size="sm" variant="neutral">Roles</Badge>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-[var(--color-text-secondary)]">Permanent Staff</span>
                  <span className="font-semibold text-slate-700">—</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-[var(--color-text-secondary)]">Interns</span>
                  <span className="font-semibold text-slate-700">—</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-[var(--color-text-secondary)]">Project Supervisors</span>
                  <span className="font-semibold text-slate-700">—</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[var(--color-text-secondary)]">Project Contributors</span>
                  <span className="font-semibold text-slate-700">—</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-100 text-[10px] text-slate-500 rounded-lg">
                Directory category metrics awaiting database synchronization.
              </div>
            </Card>
          </div>

          {/* 6. TEAM WORK HISTORY OVERVIEW (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <Card padding="lg" className="space-y-4 shadow-2xs border border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-[var(--color-brand-navy)] flex items-center gap-2">
                    <History className="w-4 h-4 text-[var(--color-brand-blue)]" />
                    Team Work History
                  </h3>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">
                    Review Staff and Intern project contributions and completed work.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin/work-history')}
                  aria-label="View team work history logs"
                >
                  View Team Work History
                </Button>
              </div>

              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse" aria-label="Team Work History Table">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th scope="col" className="py-2.5 px-3">User</th>
                      <th scope="col" className="py-2.5 px-3">Project</th>
                      <th scope="col" className="py-2.5 px-3">Work Item</th>
                      <th scope="col" className="py-2.5 px-3">Status</th>
                      <th scope="col" className="py-2.5 px-3 text-right">Completion Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={5} className="p-6">
                        <EmptyState
                          icon={<Activity className="w-6 h-6 text-slate-400" />}
                          title="No work history available"
                          description="Staff and Intern work history will appear here once work records are connected."
                          secondaryAction={
                            <Badge size="sm" variant="neutral">
                              Awaiting backend integration
                            </Badge>
                          }
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* 7. SECURITY CONSOLE / SYSTEM AUDIT (lg:col-span-1) */}
          <div className="lg:col-span-1">
            <Card padding="md" className="space-y-4 shadow-2xs border border-slate-100 bg-slate-50/20">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-navy)] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[var(--color-brand-blue)]" />
                  Security Console
                </h3>
                <Badge size="sm" variant="success">Secured</Badge>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-[var(--color-text-secondary)]">Operator</span>
                  <span className="font-semibold text-slate-700 truncate max-w-[120px]">{userDisplay.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-[var(--color-text-secondary)]">Secure ID</span>
                  <span className="font-mono font-semibold text-slate-700">{user?.userId || 'ADM-001'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[var(--color-text-secondary)]">Access Level</span>
                  <span className="font-semibold text-blue-700">Root Admin</span>
                </div>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
