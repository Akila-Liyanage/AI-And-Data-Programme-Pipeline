import { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  TrendingUp,
  History,
  User,
  Info,
  ArrowRight,
  Activity,
  Layers,
} from 'lucide-react';
import {
  DashboardLayout,
  PageHeader,
  type NavSection,
  type UserDisplayInfo,
} from '../../components/layout/DashboardLayout';
import { Card, Button, Badge, EmptyState } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { InternProgressDetailsDrawer, type InternProjectContribution } from './components/InternProgressDetailsDrawer';

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

export default function InternProgressPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Selected contribution details for Drawer
  const [selectedContribution, setSelectedContribution] = useState<InternProjectContribution | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Empty arrays to ensure zero fake / mocked rows in the tables
  const [contributions] = useState<InternProjectContribution[]>([]);
  const [completedContributions] = useState<any[]>([]);
  const [activities] = useState<any[]>([]);

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || '—',
    email: user?.email || '—',
    roleLabel: 'Intern',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <DashboardLayout
      navigation={INTERN_NAVIGATION}
      user={userDisplay}
      notificationsCount={0}
      onLogoutClick={handleLogout}
    >
      {/* Page Header */}
      <PageHeader
        title="Work Progress"
        description="Track your work-item progress, completed contributions and their impact on assigned project progress."
        breadcrumbs={[
          { label: 'Workspace' },
          { label: 'Work Progress' },
        ]}
        badge={<Badge variant="neutral">Intern</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FolderKanban className="w-4 h-4" />}
              onClick={() => navigate('/intern/projects')}
            >
              View Assigned Projects
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<CheckSquare className="w-4 h-4" />}
              onClick={() => navigate('/intern/work-items')}
            >
              View My Work Items
            </Button>
          </div>
        }
      />

      <div className="space-y-6">

        {/* ── 1. SUMMARY CARDS ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card padding="md" className="space-y-2 border border-slate-100 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)]">
              Assigned Work Items
            </span>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)]">—</p>
            <p className="text-[11px] text-[var(--color-text-secondary)]">No data available yet</p>
          </Card>

          <Card padding="md" className="space-y-2 border border-slate-100 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)]">
              In Progress
            </span>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)]">—</p>
            <p className="text-[11px] text-[var(--color-text-secondary)]">No data available yet</p>
          </Card>

          <Card padding="md" className="space-y-2 border border-slate-100 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)]">
              Completed Work Items
            </span>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)]">—</p>
            <p className="text-[11px] text-[var(--color-text-secondary)]">No data available yet</p>
          </Card>

          <Card padding="md" className="space-y-2 border border-slate-100 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)]">
              Total Contribution
            </span>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)]">—</p>
            <p className="text-[11px] text-[var(--color-text-secondary)]">No data available yet</p>
          </Card>
        </div>

        {/* ── 2. PROGRESS EXPLANATION CARD ────────────────────── */}
        <Card padding="md" className="bg-gradient-to-r from-blue-50/50 to-white border border-slate-100 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-[var(--color-brand-navy)] flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[var(--color-brand-blue)] shrink-0" />
                How Your Work Contributes
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
                Completed work items contribute to project progress based on their assigned percentage weight.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-100 flex-wrap">
              <span>Work Item</span>
              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="text-[var(--color-brand-blue)]">Completed</span>
              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
              <span>Contribution Added</span>
              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="text-emerald-600 font-bold">Project Progress Updated</span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ── 3. MY PROJECT CONTRIBUTION SECTION ───────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-[var(--color-brand-navy)] flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-[var(--color-brand-blue)]" />
                  My Project Contribution
                </h3>
                <p className="text-[10px] text-[var(--color-text-secondary)]">
                  Progress tracking and completed weight breakdown across assigned projects
                </p>
              </div>
            </div>

            <Card padding="none" className="border border-slate-100 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse" aria-label="Project Contribution Table">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th scope="col" className="py-3 px-4">Project</th>
                      <th scope="col" className="py-3 px-4">Assigned Role</th>
                      <th scope="col" className="py-3 px-4 text-center">Assigned Items</th>
                      <th scope="col" className="py-3 px-4 text-center">Completed Items</th>
                      <th scope="col" className="py-3 px-4 text-center">My Contribution</th>
                      <th scope="col" className="py-3 px-4 text-center">Project Progress</th>
                      <th scope="col" className="py-3 px-4">Project Status</th>
                      <th scope="col" className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {contributions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8">
                          <EmptyState
                            icon={<FolderKanban className="w-8 h-8 text-slate-400" />}
                            title="No project contribution data yet"
                            description="Your project contribution summary will appear here as your work items are completed."
                          />
                        </td>
                      </tr>
                    ) : (
                      contributions.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-[var(--color-brand-navy)]">{c.projectName}</td>
                          <td className="py-3 px-4">{c.myRole}</td>
                          <td className="py-3 px-4 text-center font-semibold">{c.assignedWorkItemsCount}</td>
                          <td className="py-3 px-4 text-center font-semibold text-emerald-600">{c.completedCount}</td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-600">
                            {c.completedWeight !== '—' ? `${c.completedWeight}%` : '—'}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-[var(--color-brand-blue)]">
                            {c.projectProgress !== '—' ? `${c.projectProgress}%` : '—%'}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={c.projectStatus.toLowerCase() === 'active' ? 'success' : 'info'}>
                              {c.projectStatus}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedContribution(c);
                                setIsDetailsOpen(true);
                              }}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* ── 4. WORK ITEM PROGRESS OVERVIEW ───────────────────── */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-[var(--color-brand-navy)] flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[var(--color-brand-blue)]" />
                Work Item Progress
              </h3>
              <p className="text-[10px] text-[var(--color-text-secondary)]">
                Workflow stage overview monitoring
              </p>
            </div>

            <Card padding="md" className="border border-slate-100 shadow-2xs space-y-4">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="font-semibold text-slate-700">Not Started</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[var(--color-brand-navy)] block">—</span>
                    <span className="text-[10px] text-slate-400">No data available yet</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                    <span className="font-semibold text-slate-700">In Progress</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[var(--color-brand-navy)] block">—</span>
                    <span className="text-[10px] text-slate-400">No data available yet</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-semibold text-slate-700">Completed</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[var(--color-brand-navy)] block">—</span>
                    <span className="text-[10px] text-slate-400">No data available yet</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* ── 5. COMPLETED CONTRIBUTIONS ──────────────────────── */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-[var(--color-brand-navy)] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[var(--color-brand-blue)]" />
                Completed Contributions
              </h3>
              <p className="text-[10px] text-[var(--color-text-secondary)]">
                Work items counting towards overall project progress
              </p>
            </div>

            <Card padding="none" className="border border-slate-100 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse" aria-label="Completed Contributions Table">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th scope="col" className="py-3 px-4">Work Item</th>
                      <th scope="col" className="py-3 px-4">Project</th>
                      <th scope="col" className="py-3 px-4">Required Role</th>
                      <th scope="col" className="py-3 px-4 text-center">Weight</th>
                      <th scope="col" className="py-3 px-4">Completion Date</th>
                      <th scope="col" className="py-3 px-4 text-center">Progress Contribution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {completedContributions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8">
                          <EmptyState
                            icon={<Layers className="w-8 h-8 text-slate-400" />}
                            title="No completed contributions yet"
                            description="Completed work items and their project contributions will appear here."
                          />
                        </td>
                      </tr>
                    ) : (
                      completedContributions.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-[var(--color-brand-navy)]">{item.title}</td>
                          <td className="py-3 px-4">{item.projectName}</td>
                          <td className="py-3 px-4">{item.role}</td>
                          <td className="py-3 px-4 text-center">{item.weight}%</td>
                          <td className="py-3 px-4 font-mono">{item.date}</td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-600">+{item.weight}%</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* ── 6. RECENT WORK ACTIVITY ─────────────────────────── */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-[var(--color-brand-navy)] flex items-center gap-2">
                <History className="w-4 h-4 text-[var(--color-brand-blue)]" />
                Recent Work Activity
              </h3>
              <p className="text-[10px] text-[var(--color-text-secondary)]">
                Audit trail of recent work status updates
              </p>
            </div>

            <Card padding="none" className="border border-slate-100 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse" aria-label="Recent Work Activity Table">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th scope="col" className="py-3 px-4">Work Item</th>
                      <th scope="col" className="py-3 px-4">Project</th>
                      <th scope="col" className="py-3 px-4">Previous Status</th>
                      <th scope="col" className="py-3 px-4">New Status</th>
                      <th scope="col" className="py-3 px-4">Activity Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {activities.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8">
                          <EmptyState
                            icon={<History className="w-8 h-8 text-slate-400" />}
                            title="No recent work activity"
                            description="Your work-item activity will appear here."
                          />
                        </td>
                      </tr>
                    ) : (
                      activities.map((act, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-[var(--color-brand-navy)]">{act.title}</td>
                          <td className="py-3 px-4">{act.projectName}</td>
                          <td className="py-3 px-4">
                            <Badge variant="neutral">{act.prevStatus}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={act.newStatus === 'Completed' ? 'success' : 'blue'}>
                              {act.newStatus}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 font-mono">{act.date}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

        </div>

      </div>

      {/* Details Drawer */}
      <InternProgressDetailsDrawer
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedContribution(null);
        }}
        contribution={selectedContribution}
      />
    </DashboardLayout>
  );
}
