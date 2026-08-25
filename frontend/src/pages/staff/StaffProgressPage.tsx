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
import { StaffProgressDetailsDrawer, type ProjectContribution } from './components/StaffProgressDetailsDrawer';

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

export default function StaffProgressPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Selected contribution details for Drawer
  const [selectedContribution, setSelectedContribution] = useState<ProjectContribution | null>(null);

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || '—',
    email: user?.email || '—',
    roleLabel: 'Permanent Staff',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <DashboardLayout
      navigation={STAFF_NAVIGATION}
      user={userDisplay}
      notificationsCount={0}
      onNotificationClick={() => {}}
      onProfileClick={() => {}}
      onLogoutClick={handleLogout}
    >
      <PageHeader
        title="Work Progress"
        description="Track your assigned work-item progress, completed contributions and their impact on overall project progress."
        breadcrumbs={[{ label: 'Workspace' }, { label: 'Work Progress' }]}
        badge={<Badge variant="success">Permanent Staff</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FolderKanban className="w-4 h-4" />}
              onClick={() => navigate('/staff/projects')}
            >
              View Assigned Projects
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<CheckSquare className="w-4 h-4" />}
              onClick={() => navigate('/staff/work-items')}
            >
              View My Work Items
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* ── 1. SUMMARY CARDS ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              title: 'Assigned Work Items',
              value: '—',
              subtext: 'Awaiting data integration',
              badge: 'Work Items',
              badgeVariant: 'blue' as const,
            },
            {
              title: 'In Progress',
              value: '—',
              subtext: 'Awaiting data integration',
              badge: 'Active',
              badgeVariant: 'blue' as const,
            },
            {
              title: 'Completed Work Items',
              value: '—',
              subtext: 'Awaiting data integration',
              badge: 'Completed',
              badgeVariant: 'success' as const,
            },
            {
              title: 'Total Contribution',
              value: '—',
              subtext: 'Awaiting data integration',
              badge: 'Contribution',
              badgeVariant: 'success' as const,
            },
          ].map((card) => (
            <Card key={card.title} padding="md" className="space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  {card.title}
                </span>
                <Badge size="sm" variant={card.badgeVariant}>
                  {card.badge}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-[var(--color-brand-navy)]">
                {card.value}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {card.subtext}
              </p>
            </Card>
          ))}
        </div>

        {/* ── 2. PROGRESS EXPLANATION INFORMATION CARD ─────────── */}
        <Card padding="md" className="bg-slate-50/50 border border-slate-200 shadow-2xs">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[var(--color-brand-blue)] shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-3 min-w-0 flex-1">
              <div>
                <h3 className="text-sm font-bold text-[var(--color-brand-navy)]">
                  Progress Calculation Policy
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mt-0.5">
                  Project progress is calculated automatically from completed work-item percentage weights. Staff does not manually slide progress percentages.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] bg-white p-2.5 rounded-lg border border-slate-100 max-w-lg">
                <span className="text-slate-800">Work Item</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="text-slate-800">Status Completed</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="text-slate-800">Percentage Weight Counted</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="text-[var(--color-brand-blue)] font-bold">Project Progress Updated</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    Not Started
                  </p>
                  <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                    No completed contribution. Predefined percentage weight is not counted yet.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-brand-blue)]" />
                    In Progress
                  </p>
                  <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                    Work is active, but its weight is not yet counted as completed.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-brand-green)]" />
                    Completed
                  </p>
                  <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                    Its predefined percentage weight contributes to project progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* ── 3. MY PROJECT CONTRIBUTION SECTION ───────────────── */}
        <Card padding="none" title="My Project Contribution" subtitle="Summary of progress contribution metrics grouped by assigned project" className="shadow-2xs border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse min-w-[1000px]" aria-label="My Project Contribution Table">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4">Project</th>
                  <th scope="col" className="py-3 px-4">My Role</th>
                  <th scope="col" className="py-3 px-4 text-center">Assigned Work Items</th>
                  <th scope="col" className="py-3 px-4 text-center">Completed Work Items</th>
                  <th scope="col" className="py-3 px-4 text-right">My Completed Weight</th>
                  <th scope="col" className="py-3 px-4 text-center">Project Progress</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={8} className="p-12">
                    <EmptyState
                      icon={<Activity className="w-8 h-8 text-slate-400" />}
                      title="No project contribution data available"
                      description="Your project contribution summary will appear here once work-item activity data is connected."
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

        {/* ── 4. WORK ITEM PROGRESS SECTION ───────────────────── */}
        <Card title="Work Item Progress" subtitle="Distribution breakdown of your assigned tasks" className="shadow-2xs">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-700 text-center">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-[11px] text-slate-500 font-medium block">Not Started</span>
                <span className="text-lg font-bold text-slate-600 block mt-0.5">—</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-[11px] text-slate-500 font-medium block">In Progress</span>
                <span className="text-lg font-bold text-[var(--color-brand-blue)] block mt-0.5">—</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-[11px] text-slate-500 font-medium block">Completed</span>
                <span className="text-lg font-bold text-[var(--color-brand-green)] block mt-0.5">—</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-500">Progress Summary</span>
                <span className="font-bold text-[var(--color-brand-blue)]">—%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-slate-300 rounded-full" style={{ width: '0%' }} />
              </div>
              <p className="text-[10px] text-slate-400 italic">
                Awaiting data integration.
              </p>
            </div>
          </div>
        </Card>

        {/* ── 5. COMPLETED CONTRIBUTIONS SECTION ──────────────── */}
        <Card padding="none" title="Completed Contributions" subtitle="Work items currently contributing their predefined percentage weights to overall project progress" className="shadow-2xs border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse min-w-[900px]" aria-label="Completed Contributions Table">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4">Work Item</th>
                  <th scope="col" className="py-3 px-4">Project</th>
                  <th scope="col" className="py-3 px-4">Required Role</th>
                  <th scope="col" className="py-3 px-4 text-center">Percentage Weight</th>
                  <th scope="col" className="py-3 px-4 text-right">Completed Date</th>
                  <th scope="col" className="py-3 px-4 text-right">Progress Contribution</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="p-12">
                    <EmptyState
                      icon={<CheckSquare className="w-8 h-8 text-slate-400" />}
                      title="No completed contributions available"
                      description="Completed work items and their project progress contributions will appear here once work-item activity is connected."
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

        {/* ── 6. RECENT STATUS ACTIVITY SECTION ────────────────── */}
        <Card padding="none" title="Recent Work Activity" subtitle="Timeline log of status transitions and completion alerts" className="shadow-2xs border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse min-w-[900px]" aria-label="Recent Work Activity Table">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4">Work Item</th>
                  <th scope="col" className="py-3 px-4">Project</th>
                  <th scope="col" className="py-3 px-4">Previous Status</th>
                  <th scope="col" className="py-3 px-4">New Status</th>
                  <th scope="col" className="py-3 px-4 text-right">Activity Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="p-12">
                    <EmptyState
                      icon={<Layers className="w-8 h-8 text-slate-400" />}
                      title="No recent work activity"
                      description="Your work-item status activity will appear here once activity data is connected."
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

      {/* ── 7. DETAILS DRAWER ─────────────────────────────────── */}
      <StaffProgressDetailsDrawer
        isOpen={selectedContribution !== null}
        onClose={() => setSelectedContribution(null)}
        contribution={selectedContribution}
      />
    </DashboardLayout>
  );
}
