/**
 * InternDashboardPage.tsx
 *
 * MODERN LIGHT BLUE INTERN WORKSPACE
 * Features:
 * - Crisp Light Blue theme with motion hover effects
 * - Live Intern KPI statistics from MongoDB (Assigned Projects, Track Tasks, Progress %)
 * - Active Project Tasks & Interactive Work-Item Progress Breakdown
 * - Specialization Track, Supervisor Mentor, and Quick Actions
 */
import { useState, useEffect } from 'react';
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
import {
  fetchAssignments,
  fetchProjects,
  type ApiProject,
} from '../../utils/apiDataService';

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

interface DashboardAssignedProject {
  id: string;
  projectId: string;
  title: string;
  role: string;
  dueDate: string;
  status: string;
  progress: number;
  workItemsCompleted: number;
  workItemsTotal: number;
}

interface DashboardWorkItem {
  id: string;
  task: string;
  project: string;
  projectId: string;
  weight: string;
  priority: string;
  status: string;
}

export default function InternDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [assignedProjects, setAssignedProjects] = useState<DashboardAssignedProject[]>([]);
  const [pendingWorkItems, setPendingWorkItems] = useState<DashboardWorkItem[]>([]);
  const [completedTasksCount, setCompletedTasksCount] = useState<number>(0);
  const [averageProgress, setAverageProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || 'Intern Trainee Member',
    email: user?.email || 'intern@aidata.com',
    roleLabel: 'Intern Trainee',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.userId) return;
      setIsLoading(true);
      try {
        const [assignments, projects] = await Promise.all([
          fetchAssignments(user.userId),
          fetchProjects(),
        ]);

        const projectMap = new Map<string, ApiProject>();
        projects.forEach((p) => projectMap.set(p.projectId, p));

        const dashboardProjects: DashboardAssignedProject[] = [];
        const pendingItems: DashboardWorkItem[] = [];
        let totalCompletedWorkItems = 0;
        let totalProgressSum = 0;

        assignments.forEach((asg) => {
          const prj = projectMap.get(asg.projectId);
          if (prj) {
            const workItems = prj.workItems || [];
            const doneCount = workItems.filter((wi) => wi.status === 'DONE').length;
            totalCompletedWorkItems += doneCount;
            totalProgressSum += prj.progress || 0;

            dashboardProjects.push({
              id: prj.projectId,
              projectId: prj.projectId,
              title: prj.name,
              role: asg.assignmentRole || asg.professionalRole || 'Intern Contributor',
              dueDate: prj.targetDate || '—',
              status: prj.status || 'Active',
              progress: prj.progress || 0,
              workItemsCompleted: doneCount,
              workItemsTotal: workItems.length,
            });

            // Gather pending / in-progress work items
            workItems.forEach((wi) => {
              if (wi.status !== 'DONE') {
                pendingItems.push({
                  id: wi.workItemId,
                  task: wi.title,
                  project: prj.name,
                  projectId: prj.projectId,
                  weight: `${wi.percentage}%`,
                  priority: prj.priority || 'Medium',
                  status: wi.status,
                });
              }
            });
          }
        });

        setAssignedProjects(dashboardProjects);
        setPendingWorkItems(pendingItems);
        setCompletedTasksCount(totalCompletedWorkItems);
        setAverageProgress(
          dashboardProjects.length > 0
            ? Math.round(totalProgressSum / dashboardProjects.length)
            : 0
        );
      } catch (err) {
        console.error('Failed to load intern dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.userId]);

  const activeInternRole = user?.internRole || user?.designation || 'AI/ML Intern';

  return (
    <DashboardLayout
      navigation={INTERN_NAVIGATION}
      user={userDisplay}
      notificationsCount={pendingWorkItems.length}
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
            {activeInternRole}
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
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-blue-700 border border-blue-200 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  Intern Active Track
                </span>
                <span className="text-xs text-slate-500">• {activeInternRole} Track</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Welcome back, {userDisplay.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                You have <strong className="text-blue-700 font-bold">{pendingWorkItems.length} active work items</strong> across {assignedProjects.length} assigned programme projects. Completed work-item weights automatically contribute to overall project progress.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/intern/work-items')}
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
              <p className="text-xs font-semibold text-[var(--color-text-secondary)]">Assigned Projects</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {isLoading ? '...' : assignedProjects.length}
                </span>
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
            onClick={() => navigate('/intern/work-items')}
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
                <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {isLoading ? '...' : pendingWorkItems.length}
                </span>
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
            onClick={() => navigate('/intern/work-history')}
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
                <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {isLoading ? '...' : completedTasksCount}
                </span>
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
            onClick={() => navigate('/intern/progress')}
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
                <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {isLoading ? '...' : `${averageProgress}%`}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">clamped 0–100</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100">
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-sky-500 rounded-full transition-all duration-500"
                  style={{ width: `${averageProgress}%` }}
                />
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
                      Projects where you are actively allocated as an Intern Contributor.
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/intern/projects')}
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
                            <span className="font-mono text-[10px] font-bold text-slate-500">{p.projectId}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs font-bold text-slate-900">{p.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            My Role: <span className="font-medium text-blue-700">{p.role}</span> • Due: {p.dueDate}
                          </p>
                        </div>

                        <Badge size="sm" variant="success">{p.status}</Badge>
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
                  title="No Assigned Projects Yet"
                  description="You have not been assigned to any project streams yet. You can explore available projects matching your specialization track and self-enroll directly."
                  action={
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate('/intern/projects?tab=available')}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Browse Available Projects & Enroll
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
                        <Badge size="sm" variant={wi.priority === 'High' ? 'warning' : 'neutral'}>
                          {wi.priority}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/intern/work-items')}
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

          {/* RIGHT: Profile, Track & Quick Navigation */}
          <div className="lg:col-span-1 space-y-6">
            {/* 1. Intern Profile & Track Summary */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[var(--color-brand-blue)]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Intern Profile & Track
                  </h3>
                </div>
                <Badge size="sm" variant="success">Active</Badge>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Intern Member:</span>
                  <span className="font-semibold text-slate-800">{userDisplay.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">User ID:</span>
                  <span className="font-mono font-semibold text-slate-800">{user?.userId || '—'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Specialization Track:</span>
                  <span className="font-semibold text-purple-700">{activeInternRole}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-semibold text-slate-800">{user?.department || 'AI & Data Team'}</span>
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
                    title: 'Assigned Projects',
                    desc: 'View active pipeline tracks & teams',
                    icon: <FolderKanban className="w-4 h-4 text-blue-600" />,
                    path: '/intern/projects',
                  },
                  {
                    title: 'My Work Items',
                    desc: 'Log progress & milestone percentages',
                    icon: <CheckSquare className="w-4 h-4 text-emerald-600" />,
                    path: '/intern/work-items',
                  },
                  {
                    title: 'Work Progress Analytics',
                    desc: 'Inspect percentage contribution charts',
                    icon: <TrendingUp className="w-4 h-4 text-sky-600" />,
                    path: '/intern/progress',
                  },
                  {
                    title: 'Team Work History',
                    desc: 'Historical completion logs & audits',
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
