import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Activity,
  CheckCircle2,
  Users,
  TrendingUp,
  AlertCircle,
  BarChart3,
  PieChart,
  BarChart2,
  LineChart,
} from 'lucide-react';
import {
  DashboardLayout,
  PageHeader,
  type UserDisplayInfo,
} from '../../components/layout/DashboardLayout';
import { Card, Badge } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { ADMIN_NAVIGATION } from '../../config/adminNavigation';

// Analytics components — pure CSS / SVG, no extra npm library
import { OverallProgrammeProgress }      from './components/analytics/OverallProgrammeProgress';
import { ProjectStatusDistribution }     from './components/analytics/ProjectStatusDistribution';
import { ProjectProgressComparison }     from './components/analytics/ProjectProgressComparison';
import { MilestoneCompletionTrend }      from './components/analytics/MilestoneCompletionTrend';
import { TeamParticipationDistribution } from './components/analytics/TeamParticipationDistribution';
import { ProjectHealthSummary }          from './components/analytics/ProjectHealthSummary';

export default function ProgrammeProgressPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || 'Akila Liyanage',
    email: user?.email || 'admin@aidata.com',
    roleLabel: 'Administrator',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // ── All data undefined → every chart renders in pending state ────────────
  // Wire these to real API responses once the backend is connected.
  const overallPercent    = undefined; // e.g. 42
  const projectStatusData = undefined; // e.g. [{ label:'Active', count:3, … }]
  const progressItems     = undefined; // e.g. [{ name:'…', projectId:'PRJ-001', percent:60 }]
  const milestonePoints   = undefined; // e.g. [{ label:'Week 1', count:2 }]
  const teamData          = undefined; // e.g. [{ label:'Permanent Staff', count:5, … }]
  const healthData        = undefined; // e.g. { onTrack:3, atRisk:1, delayed:0 }

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
        title="Programme Progress"
        description="Programme and project progress is calculated from completed work-item percentage weights."
        breadcrumbs={[
          { label: 'Administration', path: '/admin/dashboard' },
          { label: 'Programme Progress' },
        ]}
        badge={<Badge variant="blue">Administrator</Badge>}
      />

      <div className="space-y-6">

        {/* ── Row 1: 4 Summary Metric Cards ─────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

          {/* Total Projects */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[var(--color-brand-blue-light)] text-[var(--color-brand-blue)] flex items-center justify-center shrink-0">
                  <FolderKanban className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Total Projects</span>
              </div>
              <Badge size="sm" variant="neutral">All</Badge>
            </div>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)] tracking-tight">—</p>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" aria-hidden="true" />
              Awaiting data integration
            </p>
          </Card>

          {/* Active Projects */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-green-50 text-[var(--color-brand-green)] flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Active Projects</span>
              </div>
              <Badge size="sm" variant="success">Running</Badge>
            </div>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)] tracking-tight">—</p>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" aria-hidden="true" />
              Awaiting data integration
            </p>
          </Card>

          {/* Completed Projects */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[var(--color-brand-blue)] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Completed</span>
              </div>
              <Badge size="sm" variant="blue">Delivered</Badge>
            </div>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)] tracking-tight">—</p>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" aria-hidden="true" />
              Awaiting data integration
            </p>
          </Card>

          {/* Total Members Allocated */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Members Allocated</span>
              </div>
              <Badge size="sm" variant="info">All Roles</Badge>
            </div>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)] tracking-tight">—</p>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" aria-hidden="true" />
              Awaiting data integration
            </p>
          </Card>
        </div>

        {/* ── Row 2: Overall Progress (left) + Status Distribution (right) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

          {/* Overall Programme Progress — Radial Ring */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[var(--color-border-subtle)]">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h2 className="text-sm font-bold text-[var(--color-brand-navy)]">
                  Overall Programme Progress
                </h2>
              </div>
              <Badge size="sm" variant="neutral">
                <BarChart3 className="w-3 h-3 mr-1 inline" />
                Radial Ring
              </Badge>
            </div>
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              Aggregate completion across all programme projects.
            </p>
            <OverallProgrammeProgress percent={overallPercent} />
          </Card>

          {/* Project Status Distribution — Donut */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[var(--color-border-subtle)]">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h2 className="text-sm font-bold text-[var(--color-brand-navy)]">
                  Project Status Distribution
                </h2>
              </div>
              <Badge size="sm" variant="neutral">
                Donut Chart
              </Badge>
            </div>
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              Breakdown of programme projects by current status.
            </p>
            <ProjectStatusDistribution data={projectStatusData} />
          </Card>
        </div>

        {/* ── Row 3: Project Progress Comparison — Full Width ────── */}
        <Card padding="md" className="space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[var(--color-brand-blue)]" />
              <h2 className="text-sm font-bold text-[var(--color-brand-navy)]">
                Project Progress Comparison
              </h2>
            </div>
            <Badge size="sm" variant="neutral">Horizontal Bar Chart</Badge>
          </div>
          <p className="text-[11px] text-[var(--color-text-secondary)]">
            Side-by-side progress comparison across all active and planned projects.
          </p>
          <ProjectProgressComparison items={progressItems} />
        </Card>

        {/* ── Row 4: Milestone Trend (left) + Team Participation (right) ─ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

          {/* Milestone Completion Trend — Line/Area */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[var(--color-border-subtle)]">
              <div className="flex items-center gap-2">
                <LineChart className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h2 className="text-sm font-bold text-[var(--color-brand-navy)]">
                  Milestone Completion Trend
                </h2>
              </div>
              <Badge size="sm" variant="neutral">Line Chart</Badge>
            </div>
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              Milestones completed over time across the programme timeline.
            </p>
            <MilestoneCompletionTrend points={milestonePoints} height={160} />
          </Card>

          {/* Team Participation Distribution — Segmented */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[var(--color-border-subtle)]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h2 className="text-sm font-bold text-[var(--color-brand-navy)]">
                  Team Participation Distribution
                </h2>
              </div>
              <Badge size="sm" variant="neutral">Segmented Chart</Badge>
            </div>
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              Breakdown of programme members by category and allocation status.
            </p>
            <TeamParticipationDistribution data={teamData} />
          </Card>
        </div>

        {/* ── Row 5: Project Health Summary ─────────────────────── */}
        <Card padding="md" className="space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[var(--color-brand-blue)]" />
              <h2 className="text-sm font-bold text-[var(--color-brand-navy)]">
                Project Health Summary
              </h2>
            </div>
            <Badge size="sm" variant="neutral">Health Status</Badge>
          </div>
          <p className="text-[11px] text-[var(--color-text-secondary)]">
            Quick overview of project health across the programme pipeline.
          </p>
          <ProjectHealthSummary health={healthData} />
        </Card>

        {/* ── Row 6: Project Progress Table ─────────────────────── */}
        <Card padding="none" className="overflow-hidden border border-[var(--color-border-subtle)]">
          <div className="p-4 sm:px-6 sm:py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between bg-[var(--color-surface-white)]">
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-bold text-[var(--color-brand-navy)]">Project Progress Details</h2>
              <Badge size="sm" variant="neutral">0 Projects</Badge>
            </div>
            <span className="text-xs text-[var(--color-text-secondary)] font-medium">
              Awaiting backend integration
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" aria-label="Project Progress Details Table">
              <thead>
                <tr className="bg-[var(--color-surface-subtle)]/70 border-b border-[var(--color-border-subtle)] text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4 sm:px-6">Project</th>
                  <th scope="col" className="py-3 px-4">Project ID</th>
                  <th scope="col" className="py-3 px-4">Category</th>
                  <th scope="col" className="py-3 px-4">Project Lead</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4">Progress</th>
                  <th scope="col" className="py-3 px-4">Health</th>
                  <th scope="col" className="py-3 px-4">Target Date</th>
                </tr>
              </thead>
              <tbody className="bg-[var(--color-surface-white)]">
                <tr>
                  <td colSpan={8} className="py-10 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-blue-light)] text-[var(--color-brand-blue)] flex items-center justify-center">
                        <FolderKanban className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-semibold text-[var(--color-brand-navy)]">
                        No progress data available
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)] max-w-xs text-center">
                        Project progress records will appear here once the programme data service is connected.
                      </p>
                      <Badge size="sm" variant="neutral">Awaiting backend integration</Badge>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* ── Row 7: Items Requiring Attention ──────────────────── */}
        <Card padding="md" className="space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-bold text-[var(--color-brand-navy)]">
                Items Requiring Attention
              </h2>
            </div>
            <Badge size="sm" variant="warning">Action Required</Badge>
          </div>
          <p className="text-[11px] text-[var(--color-text-secondary)]">
            Overdue milestones, unassigned projects, or at-risk deliverables will surface here.
          </p>
          <div className="py-6 flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-[var(--color-brand-navy)]">
              No attention items at this time
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] text-center max-w-sm">
              At-risk projects and overdue milestones will appear here once programme data is connected.
            </p>
            <Badge size="sm" variant="neutral">Awaiting backend integration</Badge>
          </div>
        </Card>

      </div>
    </DashboardLayout>
  );
}
