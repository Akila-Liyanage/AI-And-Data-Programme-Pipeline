import { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  TrendingUp,
  History,
  User,
  Search,
  RotateCcw,
  Clock,
  CheckCircle2,
  Info,
  ArrowRight,
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
import { InternWorkHistoryDetailsDrawer, type InternHistoryRecord } from './components/InternWorkHistoryDetailsDrawer';

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

export default function InternWorkHistoryPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Selected history record for details drawer
  const [selectedRecord, setSelectedRecord] = useState<InternHistoryRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Empty arrays to ensure zero mock data is present
  const [historyRecords] = useState<InternHistoryRecord[]>([]);
  const [recentCompletions] = useState<any[]>([]);

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || '—',
    email: user?.email || '—',
    roleLabel: 'Intern',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setProjectFilter('ALL');
    setRoleFilter('ALL');
    setStatusFilter('ALL');
    setFromDate('');
    setToDate('');
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
        title="Work History"
        description="Review your completed work items, project contributions and previous work across assigned projects."
        breadcrumbs={[
          { label: 'Workspace' },
          { label: 'Work History' },
        ]}
        badge={<Badge variant="neutral">Intern</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<TrendingUp className="w-4 h-4" />}
              onClick={() => navigate('/intern/progress')}
            >
              View Work Progress
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
              Completed Work Items
            </span>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)]">—</p>
            <p className="text-[11px] text-[var(--color-text-secondary)]">No data available yet</p>
          </Card>

          <Card padding="md" className="space-y-2 border border-slate-100 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)]">
              Projects Contributed
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

          <Card padding="md" className="space-y-2 border border-slate-100 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)]">
              Recent Completions
            </span>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)]">—</p>
            <p className="text-[11px] text-[var(--color-text-secondary)]">No data available yet</p>
          </Card>
        </div>

        {/* ── 2. FILTERS AREA ──────────────────────────────────── */}
        <Card padding="md" className="border border-slate-100 shadow-2xs">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search input */}
              <div className="relative col-span-1 sm:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search work items or projects"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/10"
                />
              </div>

              {/* Project filter */}
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/10"
              >
                <option value="ALL">All Projects</option>
              </select>

              {/* Required Role filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/10"
              >
                <option value="ALL">All Roles</option>
                <option value="Business Analyst">Business Analyst</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="QA">QA</option>
                <option value="AI/ML">AI/ML</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Final Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/10"
              >
                <option value="ALL">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Not Started">Not Started</option>
              </select>

              {/* From Date */}
              <div className="relative">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/10"
                  aria-label="From Date"
                />
              </div>

              {/* To Date */}
              <div className="relative">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/10"
                  aria-label="To Date"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={handleResetFilters}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* ── 3. CONTRIBUTION RULE BANNER ────────────────────── */}
        <Card padding="md" className="bg-gradient-to-r from-blue-50/50 to-white border border-slate-100 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-[var(--color-brand-navy)] flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[var(--color-brand-blue)] shrink-0" />
                Contribution Rule Details
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
                Completed work items contribute to project progress based on their assigned percentage weight.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-100 flex-wrap">
              <span>Completed Work Item</span>
              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="text-[var(--color-brand-blue)] font-bold">Contribution Added</span>
              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="text-emerald-600 font-bold">Project Progress Updated</span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ── 4. WORK HISTORY TABLE ──────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-[var(--color-brand-navy)] flex items-center gap-2">
                <History className="w-4 h-4 text-[var(--color-brand-blue)]" />
                Work History Summary
              </h3>
              <p className="text-[10px] text-[var(--color-text-secondary)]">
                List of completed tasks, roles and historical project progress contributions
              </p>
            </div>

            <Card padding="none" className="border border-slate-100 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse" aria-label="Work History Table">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th scope="col" className="py-3 px-4">Work Item</th>
                      <th scope="col" className="py-3 px-4">Project</th>
                      <th scope="col" className="py-3 px-4">Required Role</th>
                      <th scope="col" className="py-3 px-4 text-center">Percentage Weight</th>
                      <th scope="col" className="py-3 px-4">Final Status</th>
                      <th scope="col" className="py-3 px-4">Completion Date</th>
                      <th scope="col" className="py-3 px-4 text-center">Progress Contribution</th>
                      <th scope="col" className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {historyRecords.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8">
                          <EmptyState
                            icon={<History className="w-8 h-8 text-slate-400" />}
                            title="No work history available"
                            description="Your completed work and project contributions will appear here."
                          />
                        </td>
                      </tr>
                    ) : (
                      historyRecords.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-[var(--color-brand-navy)]">{r.workItemTitle}</td>
                          <td className="py-3 px-4">{r.projectName}</td>
                          <td className="py-3 px-4">{r.requiredRole}</td>
                          <td className="py-3 px-4 text-center">{r.percentageWeight}%</td>
                          <td className="py-3 px-4">
                            <Badge variant="success">
                              {r.finalStatus}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 font-mono">{r.completionDate}</td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-600">+{r.progressContribution}%</td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRecord(r);
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

          {/* ── 5. RECENT COMPLETION OVERVIEW ──────────────────── */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-[var(--color-brand-navy)] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--color-brand-blue)]" />
                Recent Completions
              </h3>
              <p className="text-[10px] text-[var(--color-text-secondary)]">
                Recent deliverables contributing to project progress
              </p>
            </div>

            <Card padding="none" className="border border-slate-100 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse" aria-label="Recent Completions Table">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th scope="col" className="py-3 px-4">Work Item</th>
                      <th scope="col" className="py-3 px-4">Project</th>
                      <th scope="col" className="py-3 px-4">Completed Date</th>
                      <th scope="col" className="py-3 px-4 text-center">Contribution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {recentCompletions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8">
                          <EmptyState
                            icon={<CheckCircle2 className="w-8 h-8 text-slate-400" />}
                            title="No recent completions"
                            description="Your recently completed work items will appear here."
                          />
                        </td>
                      </tr>
                    ) : (
                      recentCompletions.map((rc, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-[var(--color-brand-navy)]">{rc.title}</td>
                          <td className="py-3 px-4">{rc.projectName}</td>
                          <td className="py-3 px-4 font-mono">{rc.date}</td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-600">+{rc.weight}%</td>
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
      <InternWorkHistoryDetailsDrawer
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedRecord(null);
        }}
        record={selectedRecord}
      />
    </DashboardLayout>
  );
}
