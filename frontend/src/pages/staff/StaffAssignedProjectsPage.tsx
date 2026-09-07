import { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  TrendingUp,
  History,
  User,
  Search,
  RotateCcw,
  Activity,
  CheckCircle2,
  Eye,
  X,
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
  StaffProjectDetailsDrawer,
  type StaffProjectDetails,
} from './components/StaffProjectDetailsDrawer';

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

export default function StaffAssignedProjectsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [projects] = useState<StaffProjectDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [progressFilter, setProgressFilter] = useState('ALL');

  // Selected project for Details Drawer
  const [selectedProject, setSelectedProject] = useState<StaffProjectDetails | null>(null);

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || '—',
    email: user?.email || '—',
    roleLabel: 'Permanent Staff',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setProgressFilter('ALL');
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    // Refresh indicator simulation
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  // KPI Calculations
  const totalAssigned = projects.length;
  const activeCount = projects.filter(
    (p) => p.status.toLowerCase() === 'active'
  ).length;
  const completedCount = projects.filter(
    (p) => p.status.toLowerCase() === 'completed'
  ).length;
  const averageProgress =
    totalAssigned > 0
      ? Math.round(
          projects.reduce((acc, p) => acc + (p.overallProgress ?? 0), 0) / totalAssigned
        )
      : 0;

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search matching by Name or Project ID
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        project.name.toLowerCase().includes(query) ||
        project.projectId.toLowerCase().includes(query) ||
        (project.department && project.department.toLowerCase().includes(query));

      // Status filter
      const matchesStatus =
        statusFilter === 'ALL' ||
        project.status.toLowerCase() === statusFilter.toLowerCase();

      // Progress filter
      const progress = project.overallProgress ?? 0;
      let matchesProgress = true;
      if (progressFilter === 'NOT_STARTED') {
        matchesProgress = progress === 0;
      } else if (progressFilter === 'IN_PROGRESS') {
        matchesProgress = progress > 0 && progress < 100;
      } else if (progressFilter === 'COMPLETED') {
        matchesProgress = progress === 100;
      }

      return matchesSearch && matchesStatus && matchesProgress;
    });
  }, [projects, searchQuery, statusFilter, progressFilter]);

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
        title="Assigned Projects"
        description="View projects assigned to you, monitor project specifications, and track your responsibilities and progress."
        breadcrumbs={[{ label: 'Workspace' }, { label: 'Assigned Projects' }]}
        badge={<Badge variant="success">Permanent Staff</Badge>}
        actions={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
            onClick={handleRefresh}
            disabled={isLoading}
            aria-label="Refresh assigned projects list"
          >
            Refresh
          </Button>
        }
      />

      <div className="space-y-6">
        {/* ── ERROR STATE ALERT ────────────────────────────────── */}
        {error && (
          <Alert
            variant="error"
            title="Unable to load assigned projects"
            onClose={() => setError(null)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-1">
              <span>
                There was a problem retrieving your assigned projects. Please verify your connection or try refreshing the page.
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
          {/* Total Assigned Projects */}
          <Card padding="md" className="space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Total Assigned Projects
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[var(--color-brand-blue)] flex items-center justify-center">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-navy)] font-mono">
              {totalAssigned > 0 ? totalAssigned : '0'}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {totalAssigned > 0 ? 'Assigned to your account' : 'No active allocations'}
            </p>
          </Card>

          {/* Active Projects */}
          <Card padding="md" className="space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Active Projects
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[var(--color-status-success)] flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-navy)] font-mono">
              {totalAssigned > 0 ? activeCount : '0'}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {activeCount > 0 ? 'Currently in execution' : 'No active allocations'}
            </p>
          </Card>

          {/* Completed Projects */}
          <Card padding="md" className="space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Completed Projects
              </span>
              <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-navy)] font-mono">
              {totalAssigned > 0 ? completedCount : '0'}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {completedCount > 0 ? 'Successfully delivered' : 'No completed projects'}
            </p>
          </Card>

          {/* Average Progress */}
          <Card padding="md" className="space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Average Progress
              </span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-navy)] font-mono">
                {totalAssigned > 0 ? `${averageProgress}%` : '0%'}
              </p>
              {/* Mini progress indicator */}
              <div
                className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={totalAssigned > 0 ? averageProgress : 0}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Average progress across assigned projects"
              >
                <div
                  className="h-full bg-[var(--color-brand-blue)] rounded-full transition-all duration-300"
                  style={{ width: `${totalAssigned > 0 ? averageProgress : 0}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {totalAssigned > 0 ? 'Across assigned projects' : 'No active allocations'}
            </p>
          </Card>
        </div>

        {/* ── 2. SEARCH AND FILTERS ────────────────────────────── */}
        <Card padding="md" className="shadow-2xs">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Search Query */}
              <div className="space-y-1.5">
                <label
                  htmlFor="searchQuery"
                  className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block"
                >
                  Search Projects
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
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
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
                  <option value="Planned">Planned</option>
                  <option value="Active">Active</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Progress Filter */}
              <div className="space-y-1.5">
                <label
                  htmlFor="progressFilter"
                  className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block"
                >
                  Progress Filter
                </label>
                <select
                  id="progressFilter"
                  value={progressFilter}
                  onChange={(e) => setProgressFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)] text-slate-700 bg-white"
                >
                  <option value="ALL">All Progress States</option>
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

        {/* ── 3. PROJECTS TABLE ────────────────────────────────── */}
        <Card padding="none" className="shadow-2xs border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table
              className="w-full text-left text-xs border-collapse min-w-[950px]"
              aria-label="Assigned Projects Table"
            >
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4">Project ID</th>
                  <th scope="col" className="py-3 px-4">Project Name</th>
                  <th scope="col" className="py-3 px-4">Role / Responsibility</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4">Start Date</th>
                  <th scope="col" className="py-3 px-4">Target Date</th>
                  <th scope="col" className="py-3 px-4 min-w-[140px]">Progress</th>
                  <th scope="col" className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {/* ── Loading Skeleton State ── */}
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <tr key={`skeleton-${idx}`}>
                      <td className="py-4 px-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="py-4 px-4 space-y-1.5">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-24" />
                      </td>
                      <td className="py-4 px-4">
                        <Skeleton className="h-5 w-24 rounded-full" />
                      </td>
                      <td className="py-4 px-4">
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </td>
                      <td className="py-4 px-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="py-4 px-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="py-4 px-4 space-y-1">
                        <Skeleton className="h-3 w-28" />
                        <Skeleton className="h-2 w-full rounded-full" />
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Skeleton className="h-7 w-24 ml-auto rounded-lg" />
                      </td>
                    </tr>
                  ))
                ) : filteredProjects.length > 0 ? (
                  /* ── Projects List ── */
                  filteredProjects.map((project) => {
                    const progress = Math.min(
                      100,
                      Math.max(0, project.overallProgress ?? 0)
                    );
                    return (
                      <tr
                        key={project.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        {/* 1. Project ID */}
                        <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                          {project.projectId}
                        </td>

                        {/* 2. Project Name */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-[var(--color-brand-navy)]">
                            {project.name}
                          </div>
                          {(project.category || project.department) && (
                            <div className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                              {[project.category, project.department]
                                .filter(Boolean)
                                .join(' • ')}
                            </div>
                          )}
                        </td>

                        {/* 3. Role / Responsibility */}
                        <td className="py-3 px-4">
                          <Badge size="sm" variant="neutral">
                            {project.myRole || 'Staff Member'}
                          </Badge>
                        </td>

                        {/* 4. Status */}
                        <td className="py-3 px-4">
                          {getStatusBadge(project.status)}
                        </td>

                        {/* 5. Start Date */}
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {project.startDate || '—'}
                        </td>

                        {/* 6. Target Date */}
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {project.targetDate || '—'}
                        </td>

                        {/* 7. Progress (Read-only) */}
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-500 font-medium">
                                Overall
                              </span>
                              <span className="font-bold font-mono text-[var(--color-brand-blue)]">
                                {project.overallProgress !== undefined
                                  ? `${progress}%`
                                  : '—%'}
                              </span>
                            </div>
                            <div
                              className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"
                              role="progressbar"
                              aria-valuenow={progress}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-label={`${project.name} progress`}
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

                        {/* 8. Action */}
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                            onClick={() => setSelectedProject(project)}
                            aria-label={`View details for ${project.name}`}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : isFiltering ? (
                  /* ── Filtered Empty State ── */
                  <tr>
                    <td colSpan={8} className="p-12">
                      <EmptyState
                        icon={<Search className="w-8 h-8 text-slate-400" />}
                        title="No matching projects found"
                        description="No assigned projects match your current search query or filter selections. Try adjusting or clearing your filters."
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
                  /* ── Default Empty State ── */
                  <tr>
                    <td colSpan={8} className="p-12">
                      <EmptyState
                        icon={<FolderKanban className="w-8 h-8 text-slate-400" />}
                        title="No assigned projects available."
                        description="Projects assigned to your Permanent Staff account will appear here once allocated by an administrator or project lead."
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

      {/* ── 4. DETAILS DRAWER ─────────────────────────────────── */}
      <StaffProjectDetailsDrawer
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </DashboardLayout>
  );
}
