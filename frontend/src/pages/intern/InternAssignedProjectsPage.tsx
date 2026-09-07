import { useState, useMemo, useEffect } from 'react';
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
  Sparkles,
  UserCheck,
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
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  fetchAssignments,
  fetchProjects,
  selfEnrollProject,
  mapWorkItemStatusToDisplay,
  type ApiProject,
} from '../../utils/apiDataService';
import {
  InternProjectDetailsDrawer,
  type InternProject,
} from './components/InternProjectDetailsDrawer';

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

export default function InternAssignedProjectsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State Management
  const [projects, setProjects] = useState<InternProject[]>([]);
  const [allRawProjects, setAllRawProjects] = useState<ApiProject[]>([]);
  const [assignedProjectIds, setAssignedProjectIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'assigned' | 'available'>(() => {
    return searchParams.get('tab') === 'available' ? 'available' : 'assigned';
  });
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [enrollSuccess, setEnrollSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected project for Details Drawer
  const [selectedProject, setSelectedProject] = useState<InternProject | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [progressFilter, setProgressFilter] = useState('ALL');

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
    setStatusFilter('ALL');
    setProgressFilter('ALL');
  };

  const loadAssignedProjects = async () => {
    if (!user?.userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [assignments, allProjects] = await Promise.all([
        fetchAssignments(user.userId),
        fetchProjects(),
      ]);

      setAllRawProjects(allProjects);

      const assignedIds = new Set<string>();
      assignments.forEach((a) => assignedIds.add(a.projectId));
      setAssignedProjectIds(assignedIds);

      const projectMap = new Map<string, ApiProject>();
      allProjects.forEach((p) => projectMap.set(p.projectId, p));

      const mappedProjects: InternProject[] = [];

      assignments.forEach((asg) => {
        const prj = projectMap.get(asg.projectId);
        if (prj) {
          const workItems = prj.workItems || [];
          mappedProjects.push({
            id: prj._id || prj.projectId,
            projectId: prj.projectId,
            projectName: prj.name,
            description: prj.description,
            category: prj.category,
            projectStatus: prj.status || 'Ongoing',
            priority: prj.priority || 'Medium',
            startDate: prj.startDate,
            targetDate: prj.targetDate,
            supervisorName: prj.projectLead || 'Senior AI Lead',
            department: prj.department || 'AI & Data Team',
            technologyStack: prj.technologyStack,
            assignedRole: asg.assignmentRole || asg.professionalRole || user?.internRole || 'Intern Contributor',
            assignmentStatus: asg.status || 'Assigned',
            projectProgress: prj.progress || 0,
            workItems: workItems.map((wi) => ({
              id: wi.workItemId,
              title: wi.title,
              role: wi.role,
              weightPercentage: wi.percentage,
              status: mapWorkItemStatusToDisplay(wi.status),
              targetDate: prj.targetDate,
            })),
            createdAt: prj.createdAt,
            updatedAt: prj.updatedAt,
          });
        }
      });

      setProjects(mappedProjects);
    } catch (err: unknown) {
      console.error('Error loading intern assigned projects:', err);
      setError('Could not retrieve assigned projects from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssignedProjects();
  }, [user?.userId]);

  const handleRefresh = () => {
    loadAssignedProjects();
  };

  // BRD Role Matching Checker (FR-14)
  const checkRoleMatch = (proj: ApiProject, userRole?: string) => {
    if (!userRole) return true;
    const uRole = userRole.toLowerCase();
    return (proj.workItems || []).some((wi) => {
      const wiRole = (wi.role || '').toLowerCase();
      return (
        wiRole.includes(uRole) ||
        uRole.includes(wiRole) ||
        (uRole.includes('ai') && wiRole.includes('ai')) ||
        (uRole.includes('data') && wiRole.includes('data')) ||
        (uRole.includes('frontend') && (wiRole.includes('frontend') || wiRole.includes('ui'))) ||
        (uRole.includes('backend') && (wiRole.includes('backend') || wiRole.includes('api'))) ||
        (uRole.includes('qa') && (wiRole.includes('qa') || wiRole.includes('test'))) ||
        (uRole.includes('analyst') &&
          (wiRole.includes('analyst') || wiRole.includes('brd') || wiRole.includes('requirement')))
      );
    });
  };

  // Available projects not yet enrolled (BRD FR-15)
  const availableProjectsToEnroll = useMemo(() => {
    return allRawProjects.filter((p) => !assignedProjectIds.has(p.projectId));
  }, [allRawProjects, assignedProjectIds]);

  // Handle Self Enrollment Action (BRD FR-15)
  const handleSelfEnroll = async (proj: ApiProject) => {
    setEnrollingId(proj.projectId);
    setError(null);
    setEnrollSuccess(null);
    try {
      const res = await selfEnrollProject(proj.projectId);
      if (res.success) {
        setEnrollSuccess(`Successfully enrolled in "${proj.name}"!`);
        await loadAssignedProjects();
      } else {
        setError(res.message || 'Failed to self-enroll in project.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during project self-enrollment.');
    } finally {
      setEnrollingId(null);
    }
  };


  // KPI Calculations
  const totalAssigned = projects.length;
  const activeCount = projects.filter((p) => {
    const status = p.projectStatus.toLowerCase();
    return status === 'active' || status === 'in progress';
  }).length;
  const completedCount = projects.filter(
    (p) => p.projectStatus.toLowerCase() === 'completed'
  ).length;
  const averageProgress =
    totalAssigned > 0
      ? Math.round(
          projects.reduce((acc, p) => acc + (Number(p.projectProgress) || 0), 0) /
            totalAssigned
        )
      : 0;

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const query = searchQuery.trim().toLowerCase();
      const effectiveId = (project.projectId || project.id).toLowerCase();
      const matchesSearch =
        !query ||
        project.projectName.toLowerCase().includes(query) ||
        effectiveId.includes(query) ||
        (project.category && project.category.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === 'ALL' ||
        project.projectStatus.toLowerCase() === statusFilter.toLowerCase();

      const progress = Number(project.projectProgress) || 0;
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
      case 'in progress':
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
      navigation={INTERN_NAVIGATION}
      user={userDisplay}
      notificationsCount={0}
      onNotificationClick={() => {}}
      onProfileClick={() => navigate('/intern/profile')}
      onLogoutClick={handleLogout}
    >
      <PageHeader
        title="Assigned Projects"
        description="View the projects currently assigned to your internship programme."
        breadcrumbs={[{ label: 'Workspace' }, { label: 'Assigned Projects' }]}
        badge={<Badge variant="blue">Intern</Badge>}
        actions={
          <Button
            variant="outline"
            size="sm"
            leftIcon={
              <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            }
            onClick={handleRefresh}
            disabled={isLoading}
            aria-label="Refresh assigned projects list"
          >
            Refresh
          </Button>
        }
      />

      <div className="space-y-6">
        {/* ── SUCCESS NOTICE ──────────────────────────────────── */}
        {enrollSuccess && (
          <Alert
            variant="success"
            title="Project Self-Enrollment Successful"
            onClose={() => setEnrollSuccess(null)}
          >
            <div className="flex items-center justify-between gap-3 mt-1">
              <span>{enrollSuccess}</span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setEnrollSuccess(null);
                  setActiveTab('assigned');
                }}
              >
                View in Assigned Projects
              </Button>
            </div>
          </Alert>
        )}

        {/* ── ERROR STATE ALERT ────────────────────────────────── */}
        {error && (
          <Alert
            variant="error"
            title="Notice"
            onClose={() => setError(null)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-1">
              <span>{error}</span>
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

        {/* ── TAB NAVIGATION (BRD FR-11, FR-15) ────────────────── */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('assigned')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'assigned'
                ? 'bg-[var(--color-brand-blue)] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-2xs'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>My Assigned Projects</span>
            <Badge size="sm" variant={activeTab === 'assigned' ? 'neutral' : 'blue'}>
              {projects.length}
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'available'
                ? 'bg-[var(--color-brand-blue)] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-2xs'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Available Projects & Self-Enrollment</span>
            <Badge size="sm" variant={activeTab === 'available' ? 'neutral' : 'success'}>
              {availableProjectsToEnroll.length} Available
            </Badge>
          </button>
        </div>

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
              {totalAssigned}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {totalAssigned > 0 ? 'Assigned to your internship' : 'No active allocations'}
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
              {activeCount}
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
              {completedCount}
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
                {averageProgress}%
              </p>
              <div
                className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={averageProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Average progress across internship projects"
              >
                <div
                  className="h-full bg-[var(--color-brand-blue)] rounded-full transition-all duration-300"
                  style={{ width: `${averageProgress}%` }}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* ── 2. TAB CONTENT ───────────────────────────────────── */}
        {activeTab === 'assigned' ? (
          <>
            {/* Search and Filters */}
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
                      <option value="Ongoing">Ongoing / Active</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Not Started">Not Started / Planned</option>
                    </select>
                  </div>

                  {/* Progress Filter */}
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

            {/* Assigned Projects Table */}
            <Card padding="none" className="shadow-2xs border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto w-full">
                <table
                  className="w-full text-left text-xs border-collapse min-w-[950px]"
                  aria-label="Intern Assigned Projects Table"
                >
                  <thead>
                    <tr className="bg-slate-50/90 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th scope="col" className="py-3 px-4">Project ID</th>
                      <th scope="col" className="py-3 px-4">Project Name</th>
                      <th scope="col" className="py-3 px-4">Category</th>
                      <th scope="col" className="py-3 px-4">Intern Role / Responsibility</th>
                      <th scope="col" className="py-3 px-4">Status</th>
                      <th scope="col" className="py-3 px-4">Start Date</th>
                      <th scope="col" className="py-3 px-4">Target Date</th>
                      <th scope="col" className="py-3 px-4 min-w-[140px]">Progress</th>
                      <th scope="col" className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {isLoading ? (
                      Array.from({ length: 3 }).map((_, idx) => (
                        <tr key={`skeleton-${idx}`}>
                          <td className="py-4 px-4"><Skeleton className="h-4 w-20" /></td>
                          <td className="py-4 px-4 space-y-1.5"><Skeleton className="h-4 w-40" /><Skeleton className="h-3 w-24" /></td>
                          <td className="py-4 px-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
                          <td className="py-4 px-4"><Skeleton className="h-5 w-24 rounded-full" /></td>
                          <td className="py-4 px-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
                          <td className="py-4 px-4"><Skeleton className="h-4 w-20" /></td>
                          <td className="py-4 px-4"><Skeleton className="h-4 w-20" /></td>
                          <td className="py-4 px-4 space-y-1"><Skeleton className="h-3 w-28" /><Skeleton className="h-2 w-full rounded-full" /></td>
                          <td className="py-4 px-4 text-right"><Skeleton className="h-7 w-24 ml-auto rounded-lg" /></td>
                        </tr>
                      ))
                    ) : filteredProjects.length > 0 ? (
                      filteredProjects.map((project) => {
                        const progress = Math.min(
                          100,
                          Math.max(0, Number(project.projectProgress) || 0)
                        );
                        return (
                          <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                              {project.projectId || project.id}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-[var(--color-brand-navy)]">
                                {project.projectName}
                              </div>
                              {project.supervisorName && (
                                <div className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                                  Supervisor: {project.supervisorName}
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <Badge size="sm" variant="neutral">
                                {project.category || 'AI & Data'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge size="sm" variant="blue">
                                {project.assignedRole || 'Intern Contributor'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              {getStatusBadge(project.projectStatus)}
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-600">
                              {project.startDate || '—'}
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-600">
                              {project.targetDate || '—'}
                            </td>
                            <td className="py-3 px-4">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-slate-500 font-medium">Overall</span>
                                  <span className="font-bold font-mono text-[var(--color-brand-blue)]">
                                    {project.projectProgress !== undefined ? `${progress}%` : '—%'}
                                  </span>
                                </div>
                                <div
                                  className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"
                                  role="progressbar"
                                  aria-valuenow={progress}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                >
                                  <div
                                    className={`h-full rounded-full transition-all duration-300 ${
                                      progress === 100 ? 'bg-[var(--color-brand-green)]' : 'bg-[var(--color-brand-blue)]'
                                    }`}
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                leftIcon={<Eye className="w-3.5 h-3.5" />}
                                onClick={() => setSelectedProject(project)}
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
                            title="No matching projects found."
                            description="No assigned projects match your current search query. Try resetting filters."
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
                            icon={<FolderKanban className="w-8 h-8 text-blue-500" />}
                            title="No projects assigned yet."
                            description="You are currently not allocated to any project. You can explore available projects and self-enroll in project tracks matching your role."
                            action={
                              <Button
                                variant="primary"
                                size="sm"
                                leftIcon={<Sparkles className="w-4 h-4 text-amber-300" />}
                                onClick={() => setActiveTab('available')}
                              >
                                Explore Available Projects & Self-Enroll
                              </Button>
                            }
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        ) : (
          /* ── AVAILABLE PROJECTS & SELF-ENROLLMENT TAB (BRD FR-11, FR-14, FR-15) ── */
          <div className="space-y-4">
            {/* Header Governance Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Self-Enrollment & Role Matching Engine (BRD FR-15)
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Your Registered Focus Track: <strong className="text-blue-700 font-bold">{user?.internRole || 'Intern Trainee'}</strong>.
                    Projects with matching work item requirements are highlighted for 1-click enrollment.
                  </p>
                </div>
              </div>
              <Badge variant="blue" size="sm" className="self-start sm:self-auto shrink-0">
                {availableProjectsToEnroll.length} Open Tracks
              </Badge>
            </div>

            {/* Grid of Available Projects */}
            {availableProjectsToEnroll.length === 0 ? (
              <Card padding="lg">
                <EmptyState
                  icon={<CheckCircle2 className="w-10 h-10 text-emerald-500" />}
                  title="You're enrolled in all available projects!"
                  description="You are actively participating in all active pipeline projects. View your assigned projects to monitor work items and record progress."
                  action={
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveTab('assigned')}
                    >
                      View Assigned Projects
                    </Button>
                  }
                />
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {availableProjectsToEnroll.map((proj) => {
                  const isRoleMatched = checkRoleMatch(proj, user?.internRole);
                  const isEnrolling = enrollingId === proj.projectId;

                  return (
                    <Card
                      key={proj.projectId}
                      padding="md"
                      className={`space-y-4 transition-all duration-300 hover:shadow-md border ${
                        isRoleMatched
                          ? 'border-emerald-300 bg-emerald-50/20 hover:border-emerald-400'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {proj.projectId}
                          </span>
                          <Badge size="sm" variant="neutral">
                            {proj.category}
                          </Badge>
                        </div>
                        {isRoleMatched ? (
                          <Badge variant="success" size="sm" className="inline-flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            Role Match: {user?.internRole}
                          </Badge>
                        ) : (
                          <Badge variant="neutral" size="sm">
                            Open Track
                          </Badge>
                        )}
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                          {proj.name}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {proj.description || 'No description provided.'}
                        </p>
                      </div>

                      {/* Tech Stack & Supervisor */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-xl bg-white border border-slate-100">
                        <div>
                          <span className="text-slate-400 block font-semibold uppercase text-[9px]">Supervisor</span>
                          <span className="font-semibold text-slate-800 truncate block">{proj.projectLead || 'Senior AI Lead'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-semibold uppercase text-[9px]">Tech Stack</span>
                          <span className="font-semibold text-slate-800 truncate block">{proj.technologyStack || 'AI/ML, Python'}</span>
                        </div>
                      </div>

                      {/* Work Items Breakdown Preview */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Work Items & Required Roles ({(proj.workItems || []).length})
                        </span>
                        <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                          {(proj.workItems || []).map((wi) => (
                            <div
                              key={wi.workItemId}
                              className="flex items-center justify-between text-[11px] px-2 py-1 rounded bg-slate-50 border border-slate-100"
                            >
                              <span className="text-slate-700 truncate max-w-[200px]">{wi.title}</span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="font-semibold text-blue-700">{wi.role}</span>
                                <span className="font-mono text-slate-400">({wi.percentage}%)</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Enroll */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">
                          Target: <strong className="text-slate-700 font-mono">{proj.targetDate}</strong>
                        </span>
                        <Button
                          variant={isRoleMatched ? 'primary' : 'outline'}
                          size="sm"
                          isLoading={isEnrolling}
                          disabled={isEnrolling}
                          leftIcon={<UserCheck className="w-3.5 h-3.5" />}
                          onClick={() => handleSelfEnroll(proj)}
                        >
                          {isRoleMatched ? 'Self-Enroll in Track' : 'Enroll in Project'}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 4. DETAILS DRAWER ─────────────────────────────────── */}
      <InternProjectDetailsDrawer
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </DashboardLayout>
  );
}
