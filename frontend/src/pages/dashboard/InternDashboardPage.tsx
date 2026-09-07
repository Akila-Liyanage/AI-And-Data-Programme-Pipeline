/**
 * InternDashboardPage.tsx
 *
 * MODERN LIGHT BLUE INTERN WORKSPACE
 * Features:
 * - Crisp Light Blue theme with motion hover effects
 * - Live Intern KPI statistics (Assigned Projects, Track Tasks, Progress %)
 * - Active Project Tasks & Interactive Work-Item Progress Breakdown
 * - Specialization Track, Supervisor Mentor, and Quick Actions
 */
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  TrendingUp,
  History,
  User,
  Sparkles,
  GraduationCap,
  ArrowRight,
  Award,
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

export default function InternDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || 'Intern Trainee Member',
    email: user?.email || 'intern@aidata.com',
    roleLabel: 'Intern Trainee',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Intern assigned projects & work items (safe production state — no fake records)
  const assignedProjects: any[] = [];
  const pendingWorkItems: any[] = [];

  return (
    <DashboardLayout
      navigation={INTERN_NAVIGATION}
      user={userDisplay}
      notificationsCount={0}
      onNotificationClick={() => navigate('/intern/work-items')}
      onProfileClick={() => navigate('/intern/profile')}
      onLogoutClick={handleLogout}
    >
      {/* ── Page Header ────────────────────────────────────────── */}
      <PageHeader
        title="Intern Workspace"
        description="Track your assigned programme tasks, collaborate with project supervisors, and complete learning milestones."
        breadcrumbs={[
          { label: 'Workspace' },
          { label: 'Intern Dashboard' },
        ]}
        badge={
          <Badge variant="neutral" className="bg-purple-50 text-purple-700 border-purple-200">
            {user?.designation || user?.internRole || 'AI/ML Intern'}
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FolderKanban className="w-4 h-4" />}
              onClick={() => navigate('/intern/projects')}
            >
              My Projects
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<CheckSquare className="w-4 h-4" />}
              onClick={() => navigate('/intern/work-items')}
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
          <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-purple-300/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-purple-700 border border-purple-200 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                  Verified Intern Trainee
                </span>
                <span className="text-xs text-slate-500">• Track: {user?.internRole || 'AI/ML'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Welcome back, {userDisplay.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                You currently have <strong className="text-blue-700 font-bold">{pendingWorkItems.length} active work items</strong> across {assignedProjects.length} assigned programme projects. Completed work-item weights automatically contribute to overall project progress once assigned.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/intern/work-items')}
                className="px-4 py-2.5 rounded-xl bg-[var(--color-brand-blue)] text-white font-bold text-xs hover:bg-[var(--color-brand-blue-hover)] transition-all shadow-xs flex items-center gap-2 cursor-pointer hover:shadow-md active:scale-95 transform"
              >
                <CheckSquare className="w-4 h-4 text-blue-200" />
                <span>Submit Work Items</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── KPI METRICS CARDS ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* KPI 1: Assigned Projects */}
          <div
            onClick={() => navigate('/intern/projects')}
            className="p-5 rounded-2xl bg-white border border-slate-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-blue-300"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-2xs">
                <FolderKanban className="w-5 h-5" />
              </div>
              <Badge variant="blue" size="sm">Active</Badge>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-[var(--color-text-secondary)]">Assigned Project</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900">{assignedProjects.length}</span>
                <span className="text-[11px] text-slate-500 font-medium">stream</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>View project specs</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
            </p>
          </div>

          {/* KPI 2: Active Tasks */}
          <div
            onClick={() => navigate('/intern/work-items')}
            className="p-5 rounded-2xl bg-white border border-slate-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-blue-300"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shadow-2xs">
                <CheckSquare className="w-5 h-5" />
              </div>
              <Badge variant="neutral" size="sm">In Progress</Badge>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-[var(--color-text-secondary)]">My Work Items</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900">{pendingWorkItems.length}</span>
                <span className="text-[11px] text-slate-500 font-medium">tasks</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Work breakdown list</span>
              <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
            </p>
          </div>

          {/* KPI 3: Completed Work */}
          <div
            onClick={() => navigate('/intern/history')}
            className="p-5 rounded-2xl bg-white border border-slate-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-blue-300"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-2xs">
                <Award className="w-5 h-5" />
              </div>
              <Badge variant="success" size="sm">Verified</Badge>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-[var(--color-text-secondary)]">Completed Milestones</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900">0</span>
                <span className="text-[11px] text-slate-500 font-medium">items</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>View work history</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
            </p>
          </div>

          {/* KPI 4: Intern Track Progress */}
          <div
            onClick={() => navigate('/intern/progress')}
            className="p-5 rounded-2xl bg-white border border-slate-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-blue-300"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center shadow-2xs">
                <TrendingUp className="w-5 h-5" />
              </div>
              <Badge variant="neutral" size="sm">Evaluation</Badge>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-[var(--color-text-secondary)]">Overall Progress</p>
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
                      My Project Assignment
                    </h3>
                    <p className="text-[11px] text-[var(--color-text-secondary)]">
                      Current active project track assigned by programme leadership.
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/intern/projects')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Project Details
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
                            Supervisor: <span className="font-medium text-blue-700">{p.supervisor}</span> • Due: {p.dueDate}
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
                  title="No Active Project Assigned"
                  description="You have not been assigned to a project stream yet. Project assignments configured by leadership will appear here."
                  action={
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/intern/projects')}
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
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      My Assigned Work Items
                    </h3>
                    <p className="text-[11px] text-[var(--color-text-secondary)]">
                      Deliver task items to update the project completion metrics.
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/intern/work-items')}
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
                      className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-purple-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            {wi.id}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{wi.task}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Project: <span className="font-medium text-slate-700">{wi.project}</span> • Weight Contribution: <span className="font-bold text-blue-700">{wi.weight}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <Badge size="sm" variant={wi.priority === 'HIGH' ? 'warning' : 'neutral'}>
                          {wi.priority}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/intern/work-items')}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<CheckSquare className="w-6 h-6 text-purple-600" />}
                  title="No Active Work Items"
                  description="No pending work items assigned to your queue. When tasks are delegated by supervisors, they will appear here."
                  action={
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/intern/work-items')}
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

          {/* RIGHT: Intern Profile & Track Summary */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* 1. Intern Profile Summary */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Intern Placement
                  </h3>
                </div>
                <Badge size="sm" variant="success">Verified</Badge>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Intern:</span>
                  <span className="font-semibold text-slate-800">{userDisplay.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Intern ID:</span>
                  <span className="font-mono font-semibold text-slate-800">{user?.userId || '—'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Track:</span>
                  <span className="font-semibold text-purple-700">{user?.internRole || user?.designation || 'Intern Trainee'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Supervisor:</span>
                  <span className="font-semibold text-slate-800">{(user as any)?.supervisor || 'Assigned on project onboarding'}</span>
                </div>
              </div>
            </div>

            {/* 2. Quick Navigation Hub */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Sparkles className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Intern Quick Actions
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    title: 'My Projects',
                    desc: 'View active stream assignment',
                    icon: <FolderKanban className="w-4 h-4 text-blue-600" />,
                    path: '/intern/projects',
                  },
                  {
                    title: 'Work Items Checklist',
                    desc: 'Log task completion & progress',
                    icon: <CheckSquare className="w-4 h-4 text-purple-600" />,
                    path: '/intern/work-items',
                  },
                  {
                    title: 'Learning Progress',
                    desc: 'Skill progress & evaluation scores',
                    icon: <TrendingUp className="w-4 h-4 text-sky-600" />,
                    path: '/intern/progress',
                  },
                  {
                    title: 'My Work History',
                    desc: 'View submitted code & deliverables',
                    icon: <History className="w-4 h-4 text-indigo-600" />,
                    path: '/intern/work-history',
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
