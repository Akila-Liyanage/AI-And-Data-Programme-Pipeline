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
  StaffProgressDetailsDrawer,
  type ProjectContribution,
  type ProjectWorkItemContribution,
} from './components/StaffProgressDetailsDrawer';

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

export interface DetailedWorkItemContribution extends ProjectWorkItemContribution {
  projectName: string;
  projectId: string;
}

export default function StaffProgressPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [projects] = useState<ProjectContribution[]>([]);
  const [workItems] = useState<DetailedWorkItemContribution[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [progressFilter, setProgressFilter] = useState('ALL');

  // Selected contribution details for Drawer
  const [selectedContribution, setSelectedContribution] =
    useState<ProjectContribution | null>(null);

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || '—',
    email: user?.email || '—',
    roleLabel: 'Permanent Staff',
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
          projects.reduce((acc, p) => acc + (p.staffCompletedContribution ?? 0), 0) /
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
      navigation={STAFF_NAVIGATION}
      user={userDisplay}
      notificationsCount={0}
      onNotificationClick={() => {}}
      onProfileClick={() => {}}
      onLogoutClick={handleLogout}
    >
      <PageHeader
        title="Work Progress"
        description="Track your contribution and project progress across assigned work."
        breadcrumbs={[{ label: 'Workspace' }, { label: 'Work Progress' }]}
        badge={<Badge variant="success">Permanent Staff</Badge>}
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
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
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FolderKanban className="w-3.5 h-3.5" />}
              onClick={() => navigate('/staff/projects')}
            >
              Assigned Projects
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<CheckSquare className="w-3.5 h-3.5" />}
              onClick={() => navigate('/staff/work-items')}
            >
              My Work Items
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* ── ERROR STATE ALERT ────────────────────────────────── */}
        {error && (
          <Alert
            variant="error"
            title="Unable to load progress data"
            onClose={() => setError(null)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-1">
              <span>
                There was a problem retrieving your progress metrics. Please check your connection or try refreshing the page.
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
              {assignedProjectsCount > 0 ? 'Active project allocations' : 'No assigned projects'}
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
              {completedWorkItemsCount > 0 ? 'Weights actively credited' : 'No completed tasks'}
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
              {assignedProjectsCount > 0 ? 'Average completed weight' : '0%'}
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
                aria-label="Average progress across assigned projects"
              >
                <div
                  className="h-full bg-[var(--color-brand-blue)] rounded-full transition-all duration-300"
                  style={{ width: `${averageProjectProgress}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {assignedProjectsCount > 0 ? 'Across assigned projects' : '0%'}
            </p>
          </Card>
        </div>

        {/* ── 2. BRD PROGRESS CALCULATION POLICY CARD ──────────── */}
        <Card padding="md" className="bg-slate-50/70 border border-slate-200 shadow-2xs">
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
                  Overall project progress is calculated automatically from completed work-item percentage weights. Permanent Staff does not manually slide or edit progress percentages.
                </p>
              </div>

              {/* Formula & Rule Flow */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] bg-white p-2.5 rounded-lg border border-slate-100 max-w-xl">
                <span className="text-slate-800">Completed Work Items</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="text-slate-800">Predefined Percentage Weights</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="text-[var(--color-brand-blue)] font-bold">Overall Project Progress</span>
              </div>

              {/* Status Breakdown Guidelines */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    Not Started (0%)
                  </p>
                  <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                    No completed contribution. Predefined percentage weight is not counted.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-brand-blue)]" />
                    In Progress (Pending)
                  </p>
                  <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                    Work is active, but weight does not contribute until task is marked complete.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-brand-green)]" />
                    Completed (Credited)
                  </p>
                  <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                    Predefined percentage weight contributes directly to overall project progress.
                  </p>
                </div>
              </div>
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
                  Search Projects & Work Items
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
                  Status Filter
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
                  <option value="IN_PROGRESS">In Progress (1-99%)</option>
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
                    Total Tracked:{' '}
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

        {/* ── 4. PROJECT PROGRESS BREAKDOWN ────────────────────── */}
        <Card
          padding="none"
          title="Project Progress Breakdown"
          subtitle="Overall project progress and completed contribution metrics across assigned projects"
          className="shadow-2xs border border-slate-100 overflow-hidden"
        >
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
                  <th scope="col" className="py-3 px-4 min-w-[160px]">Overall Progress</th>
                  <th scope="col" className="py-3 px-4 text-center">Completed Contribution</th>
                  <th scope="col" className="py-3 px-4 text-center">Remaining Contribution</th>
                  <th scope="col" className="py-3 px-4 text-center">Work Items</th>
                  <th scope="col" className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <tr key={`skeleton-${idx}`}>
                      <td className="py-4 px-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="py-4 px-4">
                        <Skeleton className="h-4 w-40" />
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
                        <Skeleton className="h-4 w-16 mx-auto" />
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Skeleton className="h-7 w-24 ml-auto rounded-lg" />
                      </td>
                    </tr>
                  ))
                ) : filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => {
                    const progress = Math.min(100, Math.max(0, project.overallProgress ?? 0));
                    return (
                      <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* 1. Project ID */}
                        <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                          {project.projectId}
                        </td>

                        {/* 2. Project Name */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-[var(--color-brand-navy)]">
                            {project.projectName}
                          </div>
                          {project.myRole && (
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Role: {project.myRole}
                            </div>
                          )}
                        </td>

                        {/* 3. Status */}
                        <td className="py-3 px-4">
                          {getStatusBadge(project.projectStatus)}
                        </td>

                        {/* 4. Overall Progress (Read-Only) */}
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
                              aria-label={`${project.projectName} overall progress`}
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

                        {/* 5. Completed Contribution */}
                        <td className="py-3 px-4 text-center font-mono font-semibold text-[var(--color-status-success)]">
                          {project.staffCompletedContribution}%
                        </td>

                        {/* 6. Remaining Contribution */}
                        <td className="py-3 px-4 text-center font-mono text-slate-600">
                          {project.remainingContribution}%
                        </td>

                        {/* 7. Work Items Count */}
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1 text-xs font-mono">
                            <span className="text-emerald-700 font-bold">{project.completedCount}</span>
                            <span className="text-slate-400">/</span>
                            <span className="text-slate-700">{project.assignedWorkItemsCount}</span>
                          </span>
                        </td>

                        {/* 8. Action */}
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                            onClick={() => setSelectedContribution(project)}
                            aria-label={`View progress details for ${project.projectName}`}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : isFiltering ? (
                  <tr>
                    <td colSpan={8} className="p-12">
                      <EmptyState
                        icon={<Search className="w-8 h-8 text-slate-400" />}
                        title="No matching project progress found."
                        description="No projects match your current search query or filter criteria. Try adjusting or resetting your filters."
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
                    <td colSpan={8} className="p-12">
                      <EmptyState
                        icon={<Activity className="w-8 h-8 text-slate-400" />}
                        title="No progress data available."
                        description="Your progress and contribution breakdown will appear here once assigned work begins."
                        secondaryAction={
                          <Badge size="sm" variant="neutral">
                            No active data
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

        {/* ── 5. WORK ITEM CONTRIBUTION BREAKDOWN ──────────────── */}
        <Card
          padding="none"
          title="Work Item Contribution Breakdown"
          subtitle="Specific work items and their calculated contributions to overall project progress"
          className="shadow-2xs border border-slate-100 overflow-hidden"
        >
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
                  <th scope="col" className="py-3 px-4 text-center">Status</th>
                  <th scope="col" className="py-3 px-4 text-right">Contribution to Project</th>
                  <th scope="col" className="py-3 px-4 text-right">Completion Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <tr key={`skeleton-wi-${idx}`}>
                      <td className="py-4 px-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="py-4 px-4">
                        <Skeleton className="h-4 w-40" />
                      </td>
                      <td className="py-4 px-4">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Skeleton className="h-4 w-12 mx-auto" />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Skeleton className="h-5 w-16 mx-auto rounded-full" />
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Skeleton className="h-4 w-24 ml-auto" />
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Skeleton className="h-4 w-20 ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : filteredWorkItems.length > 0 ? (
                  filteredWorkItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* 1. Work Item ID */}
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                        {item.workItemId || item.id}
                      </td>

                      {/* 2. Title */}
                      <td className="py-3 px-4 font-bold text-[var(--color-brand-navy)]">
                        {item.title}
                      </td>

                      {/* 3. Project */}
                      <td className="py-3 px-4 text-slate-700">
                        <div>{item.projectName}</div>
                        <div className="font-mono text-[10px] text-slate-400">{item.projectId}</div>
                      </td>

                      {/* 4. Weight (Read-Only) */}
                      <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700">
                        {item.percentageWeight}%
                      </td>

                      {/* 5. Status */}
                      <td className="py-3 px-4 text-center">
                        {getWorkItemStatusBadge(item.status)}
                      </td>

                      {/* 6. Contribution to Project */}
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        {item.status === 'Completed' ? (
                          <span className="text-[var(--color-status-success)]">
                            +{item.percentageWeight}% (Counted)
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">
                            0% (Pending)
                          </span>
                        )}
                      </td>

                      {/* 7. Completion Date */}
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        {item.completionDate || '—'}
                      </td>
                    </tr>
                  ))
                ) : isFiltering ? (
                  <tr>
                    <td colSpan={7} className="p-12">
                      <EmptyState
                        icon={<Search className="w-8 h-8 text-slate-400" />}
                        title="No matching work items found."
                        description="No work items match your current filter selections."
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
                        title="No progress data available."
                        description="Your progress and contribution breakdown will appear here once assigned work begins."
                        secondaryAction={
                          <Badge size="sm" variant="neutral">
                            No contributions
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

      {/* ── 6. DETAILS DRAWER ─────────────────────────────────── */}
      <StaffProgressDetailsDrawer
        isOpen={selectedContribution !== null}
        onClose={() => setSelectedContribution(null)}
        contribution={selectedContribution}
      />
    </DashboardLayout>
  );
}
