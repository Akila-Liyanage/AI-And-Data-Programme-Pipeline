/**
 * StaffDashboardPage.tsx
 *
 * MODERN LIGHT BLUE STAFF WORKSPACE
 * Features:
 * - Crisp Light Blue theme with motion hover effects
 * - Live Staff KPI statistics (Assigned Projects, Work Items, Progress %)
 * - Active Project Tracks & Interactive Work-Item Progress Breakdown
 * - Personal Capacity, Role Assignment, and Quick Navigation
 */
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  TrendingUp,
  History,
  User,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  DashboardLayout,
  PageHeader,
  type NavSection,
  type UserDisplayInfo,
} from '../../components/layout/DashboardLayout';
import { Button, Badge, EmptyState } from '../../components/common';
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

export default function StaffDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || 'Permanent Staff Member',
    email: user?.email || 'staff@aidata.com',
    roleLabel: 'Permanent Staff',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Staff assigned projects & work items (safe production state — no fake records)
  const assignedProjects: any[] = [];
  const pendingWorkItems: any[] = [];

  return (
    <DashboardLayout
      navigation={STAFF_NAVIGATION}
      user={userDisplay}
      notificationsCount={1}
      onNotificationClick={() => navigate('/staff/work-items')}
      onProfileClick={() => navigate('/staff/profile')}
      onLogoutClick={handleLogout}
    >
      {/* ── Page Header ────────────────────────────────────────── */}
      <PageHeader
        title="Staff Workspace"
        description="Oversee your assigned project streams, supervise team contributions, and log work item completion."
        breadcrumbs={[
          { label: 'Workspace' },
          { label: 'Staff Dashboard' },
        ]}
        badge={
          <Badge variant="blue" className="bg-blue-100 text-blue-800 border-blue-200">
            {user?.designation || 'Senior AI Engineer'}
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FolderKanban className="w-4 h-4" />}
              onClick={() => navigate('/staff/projects')}
            >
              My Projects
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<CheckSquare className="w-4 h-4" />}
              onClick={() => navigate('/staff/work-items')}
            >
              My Work Items
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* ── HERO BANNER: Light Blue Gradient & Motion ────────── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50/90 via-sky-50 to-indigo-50/70 border border-blue-200/80 p-6 sm:p-7 shadow-xs">
          <div className="absolute -top-16 -right-16 w-52 h-52 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-emerald-300/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-blue-700 border border-blue-200 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  Staff Active Workspace
                </span>
                <span className="text-xs text-slate-500">• {user?.employmentType || 'Permanent'} Staff</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Welcome back, {userDisplay.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                You have <strong className="text-blue-700 font-bold">{pendingWorkItems.length} active work items</strong> across {assignedProjects.length} assigned programme projects. Completed work-item weights automatically contribute to overall project progress once assigned.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/staff/work-items')}
                className="px-4 py-2.5 rounded-xl bg-[var(--color-brand-blue)] text-white font-bold text-xs hover:bg-[var(--color-brand-blue-hover)] transition-all shadow-xs flex items-center gap-2 cursor-pointer hover:shadow-md active:scale-95 transform"
              >
                <CheckSquare className="w-4 h-4 text-blue-200" />
                <span>Manage Work Items</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── KPI METRICS CARDS ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* KPI 1: Assigned Projects */}
          <div
            onClick={() => navigate('/staff/projects')}
            className="p-5 rounded-2xl bg-white border border-slate-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-blue-300"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-2xs">
                <FolderKanban className="w-5 h-5" />
              </div>
              <Badge variant="blue" size="sm">Active</Badge>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-[var(--color-text-secondary)]">Assigned Projects</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900">{assignedProjects.length}</span>
                <span className="text-[11px] text-slate-500 font-medium">project tracks</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>View project specs</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
            </p>
          </div>

          {/* KPI 2: Active Work Items */}
          <div
            onClick={() => navigate('/staff/work-items')}
            className="p-5 rounded-2xl bg-white border border-slate-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-blue-300"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-2xs">
                <CheckSquare className="w-5 h-5" />
              </div>
              <Badge variant="success" size="sm">Actionable</Badge>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-[var(--color-text-secondary)]">Pending Work Items</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900">{pendingWorkItems.length}</span>
                <span className="text-[11px] text-slate-500 font-medium">in queue</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Work breakdown list</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
            </p>
          </div>

          {/* KPI 3: Completed Milestones */}
          <div
            onClick={() => navigate('/staff/history')}
            className="p-5 rounded-2xl bg-white border border-slate-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-blue-300"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shadow-2xs">
                <History className="w-5 h-5" />
              </div>
              <Badge variant="neutral" size="sm">Completed</Badge>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-[var(--color-text-secondary)]">Completed Tasks</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900">0</span>
                <span className="text-[11px] text-slate-500 font-medium">milestones</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Verified work logs</span>
              <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
            </p>
          </div>

          {/* KPI 4: Average Delivery Rate */}
          <div
            onClick={() => navigate('/staff/progress')}
            className="p-5 rounded-2xl bg-white border border-slate-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-blue-300"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center shadow-2xs">
                <TrendingUp className="w-5 h-5" />
              </div>
              <Badge variant="neutral" size="sm">Weighted</Badge>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-[var(--color-text-secondary)]">Average Progress</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900">0%</span>
                <span className="text-[11px] text-slate-500 font-medium">clamped 0–100</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100">
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-200 rounded-full" style={{ width: '0%' }} />
              </div>
            </div>
          </div>

        </div>

        {/* ── 2-COLUMN MAIN WORKSPACE ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT: Assigned Projects & Action Items */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Assigned Project Streams */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                    <FolderKanban className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      My Assigned Projects
                    </h3>
                    <p className="text-[11px] text-[var(--color-text-secondary)]">
                      Projects where you are assigned as Supervisor or Senior Contributor.
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/staff/projects')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  View All
                </Button>
              </div>

              {assignedProjects.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {assignedProjects.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-2xs transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-slate-500">{p.id}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs font-bold text-slate-900">{p.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            My Role: <span className="font-medium text-blue-700">{p.role}</span> • Due: {p.dueDate}
                          </p>
                        </div>

                        <Badge size="sm" variant="success">Active</Badge>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-medium">Work Items: {p.workItemsCompleted} of {p.workItemsTotal} Completed</span>
                          <span className="font-bold text-blue-700 font-mono">{p.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-500 transition-all duration-500"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<FolderKanban className="w-6 h-6 text-blue-600" />}
                  title="No Assigned Projects"
                  description="You have not been assigned to any active project streams yet. Projects assigned by administration will appear here."
                  action={
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/staff/projects')}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Explore Projects
                    </Button>
                  }
                  minHeight="min-h-[160px]"
                />
              )}
            </div>

            {/* 2. Pending Work Items Queue */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Actionable Work Items
                    </h3>
                    <p className="text-[11px] text-[var(--color-text-secondary)]">
                      Deliver work items to automatically update overall project percentage weights.
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/staff/work-items')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Work Breakdown
                </Button>
              </div>

              {pendingWorkItems.length > 0 ? (
                <div className="space-y-3">
                  {pendingWorkItems.map((wi) => (
                    <div
                      key={wi.id}
                      className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            {wi.id}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{wi.task}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Project: <span className="font-medium text-slate-700">{wi.project}</span> • Weight: <span className="font-bold text-blue-700">{wi.weight}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <Badge size="sm" variant={wi.priority === 'HIGH' ? 'warning' : 'neutral'}>
                          {wi.priority}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/staff/work-items')}
                        >
                          Update
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<CheckSquare className="w-6 h-6 text-emerald-600" />}
                  title="No Pending Work Items"
                  description="There are currently no active work items in your queue. When tasks are assigned to you, they will appear here."
                  action={
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/staff/work-items')}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Go to My Work Items
                    </Button>
                  }
                  minHeight="min-h-[160px]"
                />
              )}
            </div>

          </div>

          {/* RIGHT: Profile, Allocation & Quick Navigation */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* 1. Staff Profile & Allocation Summary */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[var(--color-brand-blue)]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Profile & Allocation
                  </h3>
                </div>
                <Badge size="sm" variant="success">Active</Badge>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Staff Member:</span>
                  <span className="font-semibold text-slate-800">{userDisplay.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">User ID:</span>
                  <span className="font-mono font-semibold text-slate-800">{user?.userId || '—'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Employment Type:</span>
                  <span className="font-semibold text-blue-700">{user?.employmentType || 'Permanent Staff'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Specialization:</span>
                  <span className="font-semibold text-slate-800">{user?.designation || 'Staff Contributor'}</span>
                </div>
              </div>
            </div>

            {/* 2. Quick Navigation Hub */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Sparkles className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Staff Quick Actions
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    title: 'Assigned Projects',
                    desc: 'View active pipeline tracks & teams',
                    icon: <FolderKanban className="w-4 h-4 text-blue-600" />,
                    path: '/staff/projects',
                  },
                  {
                    title: 'My Work Items',
                    desc: 'Log progress & milestone percentages',
                    icon: <CheckSquare className="w-4 h-4 text-emerald-600" />,
                    path: '/staff/work-items',
                  },
                  {
                    title: 'Work Progress Analytics',
                    desc: 'Inspect percentage contribution charts',
                    icon: <TrendingUp className="w-4 h-4 text-sky-600" />,
                    path: '/staff/progress',
                  },
                  {
                    title: 'Team Work History',
                    desc: 'Historical completion logs & audits',
                    icon: <History className="w-4 h-4 text-indigo-600" />,
                    path: '/staff/work-history',
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

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
