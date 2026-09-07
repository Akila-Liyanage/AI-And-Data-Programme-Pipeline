import { useState, useMemo } from 'react';
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
  RotateCcw,
  Search,
  Eye,
  X,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import {
  DashboardLayout,
  PageHeader,
  type NavSection,
  type UserDisplayInfo,
} from '../../components/layout/DashboardLayout';
import {
  Card,
  Button,
  Badge,
  Input,
  EmptyState,
  Alert,
  Skeleton,
} from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  InternProgressDetailsDrawer,
  type InternProjectContribution,
  type InternWorkItemContribution,
} from './components/InternProgressDetailsDrawer';

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

export interface DetailedWorkItemContribution extends InternWorkItemContribution {
  projectName: string;
  projectId: string;
}

export default function InternProgressPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [projects] = useState<InternProjectContribution[]>([]);
  const [workItems] = useState<DetailedWorkItemContribution[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [progressFilter, setProgressFilter] = useState('ALL');

  // Selected contribution details for Drawer
  const [selectedContribution, setSelectedContribution] =
    useState<InternProjectContribution | null>(null);

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || '—',
    email: user?.email || '—',
    roleLabel: 'Intern',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setProgressFilter('ALL');
  };

  // KPI Calculations
  const assignedProjectsCount = projects.length;
  const completedWorkItemsCount =
    projects.length > 0
      ? projects.reduce((acc, p) => acc + (p.completedCount ?? 0), 0)
      : workItems.filter((w) => w.status === 'Completed').length;

  const totalContribution =
    projects.length > 0
      ? Math.round(
          projects.reduce((acc, p) => acc + (p.internCompletedContribution ?? 0), 0) /
            projects.length
        )
      : 0;

  const averageProjectProgress =
    projects.length > 0
      ? Math.round(
          projects.reduce((acc, p) => acc + (p.overallProgress ?? 0), 0) /
            projects.length
        )
      : 0;

  // Filtered Project Progress Breakdown
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        project.projectName.toLowerCase().includes(query) ||
        project.projectId.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'ALL' ||
        project.projectStatus.toLowerCase() === statusFilter.toLowerCase();

      let matchesProgress = true;
      if (progressFilter === 'NOT_STARTED') {
        matchesProgress = project.overallProgress === 0;
      } else if (progressFilter === 'IN_PROGRESS') {
        matchesProgress = project.overallProgress > 0 && project.overallProgress < 100;
      } else if (progressFilter === 'COMPLETED') {
        matchesProgress = project.overallProgress === 100;
      }

      return matchesSearch && matchesStatus && matchesProgress;
    });
  }, [projects, searchQuery, statusFilter, progressFilter]);

  // Filtered Work Items Contribution Breakdown
  const filteredWorkItems = useMemo(() => {
    return workItems.filter((item) => {
      const query = searchQuery.trim().toLowerCase();
      const effectiveId = (item.workItemId || item.id).toLowerCase();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        effectiveId.includes(query) ||
        item.projectName.toLowerCase().includes(query) ||
        item.projectId.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'ALL' ||
        item.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [workItems, searchQuery, statusFilter]);

  const isFiltering =
    searchQuery.trim() !== '' ||
    statusFilter !== 'ALL' ||
    progressFilter !== 'ALL';

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return (
          <Badge variant="success" size="sm">
            Active
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="blue" size="sm">
            Completed
          </Badge>
        );
      case 'on hold':
        return (
          <Badge variant="warning" size="sm">
            On Hold
          </Badge>
        );
      case 'planned':
      default:
        return (
          <Badge variant="info" size="sm">
            Planned
          </Badge>
        );
    }
  };

  const getWorkItemStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <Badge variant="success" size="sm">
            Completed
          </Badge>
        );
      case 'In Progress':
        return (
          <Badge variant="blue" size="sm">
            In Progress
          </Badge>
        );
      case 'Not Started':
      default:
        return (
          <Badge variant="info" size="sm">
            Not Started
          </Badge>
        );
    }
  };

  return (
    <DashboardLayout
      navigation={INTERN_NAVIGATION}
      user={userDisplay}
      notificationsCount={0}
      onNotificationClick={() => {}}
      onProfileClick={() => {}}
      onLogoutClick={handleLogout}
    >
      <PageHeader
        title="Work Progress"
        description="Track your contribution and progress across internship projects."
        breadcrumbs={[{ label: 'Workspace' }, { label: 'Work Progress' }]}
        badge={<Badge variant="blue">Intern</Badge>}
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FolderKanban className="w-3.5 h-3.5" />}
              onClick={() => navigate('/intern/projects')}
            >
              View Assigned Projects
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<CheckSquare className="w-3.5 h-3.5" />}
              onClick={() => navigate('/intern/work-items')}
            >
              View My Work Items
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={
                <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              }
              onClick={handleRefresh}
              disabled={isLoading}
              aria-label="Refresh work progress"
            >
              Refresh
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* ── ERROR STATE ALERT ────────────────────────────────── */}
        {error && (
          <Alert
            variant="error"
            title="Unable to load work progress"
            onClose={() => setError(null)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-1">
              <span>
                There was a problem retrieving your internship work progress records. Please check your connection or try refreshing the page.
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="shrink-0 self-start sm:self-auto"
              >
                Retry
              </Button>
            </div>
          </Alert>
        )}

        {/* ── 1. KPI SUMMARY CARDS ─────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Assigned Projects */}
          <Card padding="md" className="space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Assigned Projects
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[var(--color-brand-blue)] flex items-center justify-center">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-navy)] font-mono">
              {assignedProjectsCount}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {assignedProjectsCount > 0 ? 'Assigned to your internship' : 'No active allocations'}
            </p>
          </Card>

          {/* Completed Work Items */}
          <Card padding="md" className="space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Completed Work Items
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[var(--color-status-success)] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-navy)] font-mono">
              {completedWorkItemsCount}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {completedWorkItemsCount > 0 ? 'Successfully delivered' : 'No completed tasks'}
            </p>
          </Card>

          {/* Total Contribution */}
          <Card padding="md" className="space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Total Contribution
              </span>
              <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-navy)] font-mono">
              {totalContribution}%
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {totalContribution > 0 ? 'Credited to projects' : 'Based on completed work'}
            </p>
          </Card>

          {/* Average Project Progress */}
          <Card padding="md" className="space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Average Project Progress
              </span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-navy)] font-mono">
                {averageProjectProgress}%
              </p>
              <div
                className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={averageProjectProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Average project progress"
              >
                <div
                  className="h-full bg-[var(--color-brand-blue)] rounded-full transition-all duration-300"
                  style={{ width: `${averageProjectProgress}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {assignedProjectsCount > 0 ? 'Across assigned projects' : 'Calculated from completed weights'}
            </p>
          </Card>
        </div>

        {/* ── 2. BRD AUTOMATED PROGRESS POLICY CARD ───────────── */}
        <Card
          padding="md"
          className="bg-gradient-to-r from-blue-50/50 via-slate-50/60 to-white border border-slate-200/80 shadow-2xs"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[var(--color-brand-blue)] text-white flex items-center justify-center shrink-0">
                  <Info className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-bold text-[var(--color-brand-navy)] uppercase tracking-wider">
                  Automated Progress Policy
                </h3>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
                Overall project progress is calculated automatically from completed work-item weights. Intern contributors cannot manually edit project progress percentages.
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Project Overall Progress = Sum of percentage weights of COMPLETED work items. Tasks in progress contribute 0% until marked complete.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-700 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200/80 shadow-2xs flex-wrap self-start lg:self-auto">
              <span>Work Item</span>
              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="text-[var(--color-brand-blue)]">Completed</span>
              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
              <span>Predefined Weight Added</span>
              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="text-emerald-600 font-bold">Project Progress Updated</span>
            </div>
          </div>
        </Card>

        {/* ── 3. SEARCH AND FILTERS ────────────────────────────── */}
        <Card padding="md" className="shadow-2xs">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Search Query */}
              <div className="space-y-1.5">
                <label
                  htmlFor="searchQuery"
                  className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block"
                >
                  Search Progress Records
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <Input
                    id="searchQuery"
                    type="text"
                    placeholder="Search by project name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs pl-8 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)] placeholder:text-slate-400"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-1.5">
                <label
                  htmlFor="statusFilter"
                  className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block"
                >
                  Project Status Filter
                </label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)] text-slate-700 bg-white"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Planned">Planned</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Progress Range Filter */}
              <div className="space-y-1.5">
                <label
                  htmlFor="progressFilter"
                  className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block"
                >
                  Progress Range
                </label>
                <select
                  id="progressFilter"
                  value={progressFilter}
                  onChange={(e) => setProgressFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)] text-slate-700 bg-white"
                >
                  <option value="ALL">All Progress Ranges</option>
                  <option value="NOT_STARTED">Not Started (0%)</option>
                  <option value="IN_PROGRESS">In Progress (1–99%)</option>
                  <option value="COMPLETED">Completed (100%)</option>
                </select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
              <span className="text-[11px] text-slate-500">
                {isFiltering ? (
                  <>
                    Filtered:{' '}
                    <strong className="text-slate-700">
                      {filteredProjects.length}
                    </strong>{' '}
                    of {projects.length} {projects.length === 1 ? 'project' : 'projects'}
                  </>
                ) : (
                  <>
                    Total Assigned:{' '}
                    <strong className="text-slate-700">{projects.length}</strong>{' '}
                    {projects.length === 1 ? 'project' : 'projects'}
                  </>
                )}
              </span>

              {isFiltering && (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                  onClick={handleResetFilters}
                  aria-label="Clear all applied filters"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* ── 4. PROJECT PROGRESS BREAKDOWN TABLE ──────────────── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-[var(--color-brand-navy)] uppercase tracking-wider flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-[var(--color-brand-blue)]" />
                Project Progress Breakdown
              </h3>
              <p className="text-[11px] text-[var(--color-text-secondary)]">
                Comprehensive progress and credited contribution breakdown by assigned project
              </p>
            </div>
          </div>

          <Card padding="none" className="shadow-2xs border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table
                className="w-full text-left text-xs border-collapse min-w-[950px]"
                aria-label="Project Progress Breakdown Table"
              >
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th scope="col" className="py-3 px-4">Project ID</th>
                    <th scope="col" className="py-3 px-4">Project Name</th>
                    <th scope="col" className="py-3 px-4">Status</th>
                    <th scope="col" className="py-3 px-4 min-w-[150px]">Overall Progress</th>
                    <th scope="col" className="py-3 px-4 text-center">Intern Contribution</th>
                    <th scope="col" className="py-3 px-4 text-center">Remaining</th>
                    <th scope="col" className="py-3 px-4 text-center">Completed Work Items</th>
                    <th scope="col" className="py-3 px-4 text-center">Total Work Items</th>
                    <th scope="col" className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                      <tr key={`project-skeleton-${idx}`}>
                        <td className="py-4 px-4">
                          <Skeleton className="h-4 w-20" />
                        </td>
                        <td className="py-4 px-4 space-y-1">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-24" />
                        </td>
                        <td className="py-4 px-4">
                          <Skeleton className="h-5 w-16 rounded-full" />
                        </td>
                        <td className="py-4 px-4 space-y-1">
                          <Skeleton className="h-3 w-28" />
                          <Skeleton className="h-2 w-full rounded-full" />
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Skeleton className="h-4 w-12 mx-auto" />
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Skeleton className="h-4 w-12 mx-auto" />
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Skeleton className="h-4 w-10 mx-auto" />
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Skeleton className="h-4 w-10 mx-auto" />
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Skeleton className="h-7 w-24 ml-auto rounded-lg" />
                        </td>
                      </tr>
                    ))
                  ) : filteredProjects.length > 0 ? (
                    filteredProjects.map((p) => {
                      const progress = Math.min(100, Math.max(0, p.overallProgress ?? 0));
                      return (
                        <tr
                          key={p.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          {/* 1. Project ID */}
                          <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                            {p.projectId || p.id}
                          </td>

                          {/* 2. Project Name */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-[var(--color-brand-navy)]">
                              {p.projectName}
                            </div>
                            <div className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                              Role: {p.myRole || 'Intern Contributor'}
                            </div>
                          </td>

                          {/* 3. Status */}
                          <td className="py-3 px-4">
                            {getStatusBadge(p.projectStatus)}
                          </td>

                          {/* 4. Overall Progress (Read-only) */}
                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-500 font-medium">Overall</span>
                                <span className="font-bold font-mono text-[var(--color-brand-blue)]">
                                  {progress}%
                                </span>
                              </div>
                              <div
                                className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"
                                role="progressbar"
                                aria-valuenow={progress}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={`${p.projectName} progress`}
                              >
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    progress === 100
                                      ? 'bg-[var(--color-brand-green)]'
                                      : 'bg-[var(--color-brand-blue)]'
                                  }`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* 5. Intern Completed Contribution */}
                          <td className="py-3 px-4 text-center font-bold font-mono text-emerald-600">
                            {p.internCompletedContribution}%
                          </td>

                          {/* 6. Remaining Contribution */}
                          <td className="py-3 px-4 text-center font-mono text-slate-600">
                            {p.remainingContribution}%
                          </td>

                          {/* 7. Completed Work Items */}
                          <td className="py-3 px-4 text-center font-mono font-semibold text-emerald-600">
                            {p.completedCount}
                          </td>

                          {/* 8. Total Work Items */}
                          <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700">
                            {p.assignedWorkItemsCount}
                          </td>

                          {/* 9. Action */}
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<Eye className="w-3.5 h-3.5" />}
                              onClick={() => setSelectedContribution(p)}
                              aria-label={`View progress details for ${p.projectName}`}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : isFiltering ? (
                    <tr>
                      <td colSpan={9} className="p-12">
                        <EmptyState
                          icon={<Search className="w-8 h-8 text-slate-400" />}
                          title="No matching project progress found."
                          description="No project progress records match your current search query or filter selections. Try adjusting or resetting your filters."
                          action={
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                              onClick={handleResetFilters}
                            >
                              Reset Filters
                            </Button>
                          }
                        />
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={9} className="p-12">
                        <EmptyState
                          icon={<FolderKanban className="w-8 h-8 text-slate-400" />}
                          title="No progress data available."
                          description="Progress will appear as you complete assigned work items."
                          secondaryAction={
                            <Badge size="sm" variant="neutral">
                              No allocations
                            </Badge>
                          }
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* ── 5. WORK ITEM CONTRIBUTION BREAKDOWN TABLE ────────── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-[var(--color-brand-navy)] uppercase tracking-wider flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[var(--color-brand-blue)]" />
                Work Item Contribution Breakdown
              </h3>
              <p className="text-[11px] text-[var(--color-text-secondary)]">
                Granular contribution and completion status for individual work items
              </p>
            </div>
          </div>

          <Card padding="none" className="shadow-2xs border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table
                className="w-full text-left text-xs border-collapse min-w-[950px]"
                aria-label="Work Item Contribution Breakdown Table"
              >
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th scope="col" className="py-3 px-4">Work Item ID</th>
                    <th scope="col" className="py-3 px-4">Title</th>
                    <th scope="col" className="py-3 px-4">Project</th>
                    <th scope="col" className="py-3 px-4 text-center">Weight</th>
                    <th scope="col" className="py-3 px-4">Status</th>
                    <th scope="col" className="py-3 px-4 text-center">Contribution to Project</th>
                    <th scope="col" className="py-3 px-4 text-right">Completion Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                      <tr key={`work-skeleton-${idx}`}>
                        <td className="py-4 px-4">
                          <Skeleton className="h-4 w-20" />
                        </td>
                        <td className="py-4 px-4 space-y-1">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-24" />
                        </td>
                        <td className="py-4 px-4">
                          <Skeleton className="h-4 w-32" />
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Skeleton className="h-4 w-12 mx-auto" />
                        </td>
                        <td className="py-4 px-4">
                          <Skeleton className="h-5 w-20 rounded-full" />
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Skeleton className="h-4 w-12 mx-auto" />
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Skeleton className="h-4 w-20 ml-auto" />
                        </td>
                      </tr>
                    ))
                  ) : filteredWorkItems.length > 0 ? (
                    filteredWorkItems.map((item) => {
                      const effectiveId = item.workItemId || item.id;
                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          {/* 1. Work Item ID */}
                          <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                            {effectiveId}
                          </td>

                          {/* 2. Title */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-[var(--color-brand-navy)]">
                              {item.title}
                            </div>
                          </td>

                          {/* 3. Project */}
                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-800">
                              {item.projectName}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                              {item.projectId}
                            </div>
                          </td>

                          {/* 4. Weight */}
                          <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700">
                            {item.percentageWeight}%
                          </td>

                          {/* 5. Status */}
                          <td className="py-3 px-4">
                            {getWorkItemStatusBadge(item.status)}
                          </td>

                          {/* 6. Contribution to Project */}
                          <td className="py-3 px-4 text-center font-mono font-bold">
                            {item.status === 'Completed' ? (
                              <span className="text-emerald-600">
                                +{item.percentageWeight}%
                              </span>
                            ) : (
                              <span className="text-slate-400">0%</span>
                            )}
                          </td>

                          {/* 7. Completion Date */}
                          <td className="py-3 px-4 text-right font-mono text-slate-600">
                            {item.completionDate ? (
                              <span className="flex items-center justify-end gap-1">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                {item.completionDate}
                              </span>
                            ) : (
                              '—'
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : isFiltering ? (
                    <tr>
                      <td colSpan={7} className="p-12">
                        <EmptyState
                          icon={<Search className="w-8 h-8 text-slate-400" />}
                          title="No matching work items found."
                          description="No work items match your current search query or filter selections. Try adjusting or resetting your filters."
                          action={
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                              onClick={handleResetFilters}
                            >
                              Reset Filters
                            </Button>
                          }
                        />
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-12">
                        <EmptyState
                          icon={<CheckSquare className="w-8 h-8 text-slate-400" />}
                          title="No work item contribution data"
                          description="Individual work-item contribution will appear here as tasks are assigned."
                          secondaryAction={
                            <Badge size="sm" variant="neutral">
                              No allocations
                            </Badge>
                          }
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* ── 6. DETAILS DRAWER ─────────────────────────────────── */}
      <InternProgressDetailsDrawer
        isOpen={selectedContribution !== null}
        onClose={() => setSelectedContribution(null)}
        contribution={selectedContribution}
      />
    </DashboardLayout>
  );
}
