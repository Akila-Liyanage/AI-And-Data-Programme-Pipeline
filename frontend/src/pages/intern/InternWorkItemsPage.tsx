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
  KanbanSquare,
  TableProperties,
  Clock,
  CheckCircle2,
  Eye,
  X,
  Play,
  Calendar,
  Info,
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
  fetchAssignments,
  fetchProjects,
  updateWorkItemStatus,
  mapWorkItemStatusToDisplay,
  mapDisplayStatusToApi,
  type ApiProject,
} from '../../utils/apiDataService';
import {
  InternWorkItemDetailsDrawer,
  type InternWorkItem,
} from './components/InternWorkItemDetailsDrawer';

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

interface TransitionTarget {
  item: InternWorkItem;
  targetStatus: 'In Progress' | 'Completed';
}

export default function InternWorkItemsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // View Mode: Board (Kanban) or Table
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');

  // Work Items State
  const [workItems, setWorkItems] = useState<InternWorkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Confirmation Modal state for BRD status transitions
  const [confirmTransition, setConfirmTransition] = useState<TransitionTarget | null>(null);

  // Status notification alert
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Selected work item for Details Drawer
  const [selectedWorkItem, setSelectedWorkItem] = useState<InternWorkItem | null>(null);

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
    setStatusFilter('ALL');
  };

  const loadWorkItems = async () => {
    if (!user?.userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [assignments, allProjects] = await Promise.all([
        fetchAssignments(user.userId),
        fetchProjects(),
      ]);

      const projectMap = new Map<string, ApiProject>();
      allProjects.forEach((p) => projectMap.set(p.projectId, p));

      const items: InternWorkItem[] = [];

      assignments.forEach((asg) => {
        const prj = projectMap.get(asg.projectId);
        if (prj && prj.workItems) {
          prj.workItems.forEach((wi) => {
            items.push({
              id: `${prj.projectId}-${wi.workItemId}`,
              workItemId: wi.workItemId,
              title: wi.title,
              projectId: prj.projectId,
              projectName: prj.name,
              description: `Project: ${prj.name} • Assigned Role: ${wi.role}`,
              requiredRole: wi.role,
              responsibility: wi.role,
              percentageWeight: wi.percentage,
              status: mapWorkItemStatusToDisplay(wi.status),
              assignedDate: asg.startDate || prj.startDate,
              dueDate: prj.targetDate,
              targetDate: prj.targetDate,
              assignedUser: `${user.fullName || 'Intern Member'} (${user.userId})`,
              assignmentStatus: asg.status || 'Assigned',
              projectProgress: prj.progress || 0,
            });
          });
        }
      });

      setWorkItems(items);
    } catch (err: unknown) {
      console.error('Failed to load intern work items:', err);
      setError('Could not retrieve work items from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorkItems();
  }, [user?.userId]);

  const handleRefresh = () => {
    loadWorkItems();
  };

  // Distinct projects available from work items for the project filter
  const availableProjects = useMemo(() => {
    const map = new Map<string, string>();
    workItems.forEach((item) => {
      if (item.projectId && item.projectName) {
        map.set(item.projectId, item.projectName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [workItems]);

  // KPI Calculations
  const totalWorkItems = workItems.length;
  const notStartedCount = workItems.filter((i) => i.status === 'Not Started').length;
  const inProgressCount = workItems.filter((i) => i.status === 'In Progress').length;
  const completedCount = workItems.filter((i) => i.status === 'Completed').length;

  // Filtered list of work items
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

      const matchesProject =
        projectFilter === 'ALL' || item.projectId === projectFilter;

      const matchesStatus =
        statusFilter === 'ALL' ||
        item.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesProject && matchesStatus;
    });
  }, [workItems, searchQuery, projectFilter, statusFilter]);

  const isFiltering =
    searchQuery.trim() !== '' ||
    projectFilter !== 'ALL' ||
    statusFilter !== 'ALL';

  // Allowed Intern Status Transitions (BRD Aligned: Forward Only)
  const handleInitiateTransition = (
    targetStatus: 'In Progress' | 'Completed',
    item: InternWorkItem
  ) => {
    setConfirmTransition({ item, targetStatus });
  };

  const handleConfirmTransition = async () => {
    if (!confirmTransition) return;
    const { item, targetStatus } = confirmTransition;

    const apiStatus = mapDisplayStatusToApi(targetStatus);
    const result = await updateWorkItemStatus(
      item.projectId,
      item.workItemId || item.id,
      apiStatus
    );

    if (result.success) {
      // Apply state transition in UI
      setWorkItems((prev) =>
        prev.map((wi) =>
          wi.id === item.id ||
          (wi.projectId === item.projectId && wi.workItemId === item.workItemId)
            ? {
                ...wi,
                status: targetStatus,
                projectProgress:
                  result.progress !== undefined ? result.progress : wi.projectProgress,
                completionDate:
                  targetStatus === 'Completed'
                    ? new Date().toISOString().split('T')[0]
                    : wi.completionDate,
              }
            : wi
        )
      );

      // Keep drawer updated if currently open
      if (
        selectedWorkItem &&
        (selectedWorkItem.id === item.id ||
          (selectedWorkItem.projectId === item.projectId &&
            selectedWorkItem.workItemId === item.workItemId))
      ) {
        setSelectedWorkItem((prev) =>
          prev
            ? {
                ...prev,
                status: targetStatus,
                projectProgress:
                  result.progress !== undefined ? result.progress : prev.projectProgress,
                completionDate:
                  targetStatus === 'Completed'
                    ? new Date().toISOString().split('T')[0]
                    : prev.completionDate,
              }
            : null
        );
      }

      setNoticeMessage(
        `Work item ${item.workItemId || item.id} status updated to "${targetStatus}". Overall project progress updated to ${result.progress ?? ''}%.`
      );
    } else {
      setError(result.message || 'Failed to update work item status on server.');
    }

    setConfirmTransition(null);
  };

  const getStatusBadge = (status: string) => {
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

  // Split filtered work items by Kanban column
  const notStartedItems = filteredWorkItems.filter(
    (i) => i.status === 'Not Started'
  );
  const inProgressItems = filteredWorkItems.filter(
    (i) => i.status === 'In Progress'
  );
  const completedItems = filteredWorkItems.filter(
    (i) => i.status === 'Completed'
  );

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
        title="My Work Items"
        description="View and manage the work items assigned to your internship projects."
        breadcrumbs={[{ label: 'Workspace' }, { label: 'My Work Items' }]}
        badge={<Badge variant="blue">Intern</Badge>}
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* View Switcher: Board vs Table */}
            <div
              className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200"
              role="group"
              aria-label="View switcher"
            >
              <button
                type="button"
                onClick={() => setViewMode('board')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  viewMode === 'board'
                    ? 'bg-white text-[var(--color-brand-navy)] shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-pressed={viewMode === 'board'}
                aria-label="Switch to Board View"
              >
                <KanbanSquare className="w-3.5 h-3.5" />
                Board View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-[var(--color-brand-navy)] shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-pressed={viewMode === 'table'}
                aria-label="Switch to Table View"
              >
                <TableProperties className="w-3.5 h-3.5" />
                Table View
              </button>
            </div>

            {/* Refresh Action */}
            <Button
              variant="outline"
              size="sm"
              leftIcon={
                <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              }
              onClick={handleRefresh}
              disabled={isLoading}
              aria-label="Refresh assigned work items"
            >
              Refresh
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* ── STATUS NOTIFICATION NOTICE ───────────────────────── */}
        {noticeMessage && (
          <Alert
            variant="success"
            title="Status Updated"
            onClose={() => setNoticeMessage(null)}
          >
            {noticeMessage}
          </Alert>
        )}

        {/* ── ERROR STATE ALERT ────────────────────────────────── */}
        {error && (
          <Alert
            variant="error"
            title="Unable to load work items"
            onClose={() => setError(null)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-1">
              <span>
                There was a problem retrieving your assigned internship work items. Please check your connection or try refreshing the page.
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
          {/* Total Work Items */}
          <Card padding="md" className="space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Total Work Items
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[var(--color-brand-blue)] flex items-center justify-center">
                <CheckSquare className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-navy)] font-mono">
              {totalWorkItems}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {totalWorkItems > 0 ? 'Assigned to your internship' : 'No active allocations'}
            </p>
          </Card>

          {/* Not Started */}
          <Card padding="md" className="space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Not Started
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-navy)] font-mono">
              {notStartedCount}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {notStartedCount > 0 ? 'Waiting to commence' : 'No pending tasks'}
            </p>
          </Card>

          {/* In Progress */}
          <Card padding="md" className="space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                In Progress
              </span>
              <div className="w-7 h-7 rounded-lg bg-sky-50 text-[var(--color-brand-blue)] flex items-center justify-center">
                <Play className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-navy)] font-mono">
              {inProgressCount}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {inProgressCount > 0 ? 'Currently in execution' : 'No active tasks'}
            </p>
          </Card>

          {/* Completed */}
          <Card padding="md" className="space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Completed
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[var(--color-status-success)] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-navy)] font-mono">
              {completedCount}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {completedCount > 0 ? 'Successfully delivered' : 'No completed tasks'}
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
                  Search Work Items
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <Input
                    id="searchQuery"
                    type="text"
                    placeholder="Search by title, ID, or project..."
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

              {/* Project Filter */}
              <div className="space-y-1.5">
                <label
                  htmlFor="projectFilter"
                  className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block"
                >
                  Project Filter
                </label>
                <select
                  id="projectFilter"
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)] text-slate-700 bg-white"
                >
                  <option value="ALL">All Projects</option>
                  {availableProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </select>
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
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
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
                      {filteredWorkItems.length}
                    </strong>{' '}
                    of {workItems.length} {workItems.length === 1 ? 'work item' : 'work items'}
                  </>
                ) : (
                  <>
                    Total Assigned:{' '}
                    <strong className="text-slate-700">{workItems.length}</strong>{' '}
                    {workItems.length === 1 ? 'work item' : 'work items'}
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

        {/* ── 3. VIEW MODE: BOARD (KANBAN) ─────────────────────── */}
        {viewMode === 'board' && (
          <div>
            {/* If whole list is empty or filtered empty */}
            {workItems.length === 0 && !isLoading ? (
              <Card padding="lg" className="shadow-2xs border border-slate-100 text-center">
                <EmptyState
                  icon={<CheckSquare className="w-8 h-8 text-slate-400" />}
                  title="No work items available."
                  description="Work assigned to your internship projects will appear here."
                  secondaryAction={
                    <Badge size="sm" variant="neutral">
                      No allocations
                    </Badge>
                  }
                />
              </Card>
            ) : isFiltering && filteredWorkItems.length === 0 && !isLoading ? (
              <Card padding="lg" className="shadow-2xs border border-slate-100 text-center">
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
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* ── COLUMN 1: NOT STARTED ──────────────────── */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-amber-500 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-[var(--color-brand-navy)] uppercase tracking-wider">
                        Not Started
                      </span>
                    </div>
                    <Badge variant="warning" size="sm">
                      {notStartedItems.length}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {isLoading ? (
                      Array.from({ length: 2 }).map((_, idx) => (
                        <Card key={`skel-not-started-${idx}`} padding="sm" className="space-y-3 shadow-2xs">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                          <div className="flex gap-2">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                          </div>
                        </Card>
                      ))
                    ) : notStartedItems.length === 0 ? (
                      <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center space-y-1 bg-slate-50/50">
                        <p className="text-xs font-semibold text-slate-600">
                          No work items waiting to start
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Assigned work items will appear here.
                        </p>
                      </div>
                    ) : (
                      notStartedItems.map((item) => {
                        const effectiveId = item.workItemId || item.id;
                        const effectiveDue = item.dueDate || item.targetDate || '—';
                        return (
                          <Card
                            key={item.id}
                            padding="md"
                            className="space-y-3 shadow-2xs hover:shadow-xs transition-shadow border border-slate-100"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                {effectiveId}
                              </span>
                              {getStatusBadge(item.status)}
                            </div>

                            <div>
                              <h4 className="text-xs font-bold text-[var(--color-brand-navy)] leading-snug">
                                {item.title}
                              </h4>
                              <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                                {item.projectName}
                              </p>
                            </div>

                            {item.description && (
                              <p
                                className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed"
                                title={item.description}
                              >
                                {item.description}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <Badge variant="blue" size="sm">
                                {item.requiredRole || item.responsibility || 'Intern Contributor'}
                              </Badge>
                              <Badge variant="neutral" size="sm">
                                {item.percentageWeight}% Weight
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                              <span className="flex items-center gap-1 font-mono">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                {effectiveDue}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  leftIcon={<Eye className="w-3 h-3" />}
                                  onClick={() => setSelectedWorkItem(item)}
                                  aria-label={`View details for ${item.title}`}
                                >
                                  Details
                                </Button>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  leftIcon={<Play className="w-3 h-3" />}
                                  onClick={() => handleInitiateTransition('In Progress', item)}
                                  aria-label={`Start work on ${item.title}`}
                                >
                                  Start Work
                                </Button>
                              </div>
                            </div>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* ── COLUMN 2: IN PROGRESS ───────────────────── */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-blue-500 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4 text-[var(--color-brand-blue)]" />
                      <span className="text-xs font-bold text-[var(--color-brand-navy)] uppercase tracking-wider">
                        In Progress
                      </span>
                    </div>
                    <Badge variant="blue" size="sm">
                      {inProgressItems.length}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {isLoading ? (
                      Array.from({ length: 2 }).map((_, idx) => (
                        <Card key={`skel-in-progress-${idx}`} padding="sm" className="space-y-3 shadow-2xs">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                          <div className="flex gap-2">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                          </div>
                        </Card>
                      ))
                    ) : inProgressItems.length === 0 ? (
                      <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center space-y-1 bg-slate-50/50">
                        <p className="text-xs font-semibold text-slate-600">
                          No work items in progress
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Start an assigned task to begin tracking progress.
                        </p>
                      </div>
                    ) : (
                      inProgressItems.map((item) => {
                        const effectiveId = item.workItemId || item.id;
                        const effectiveDue = item.dueDate || item.targetDate || '—';
                        return (
                          <Card
                            key={item.id}
                            padding="md"
                            className="space-y-3 shadow-2xs hover:shadow-xs transition-shadow border border-slate-100"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                {effectiveId}
                              </span>
                              {getStatusBadge(item.status)}
                            </div>

                            <div>
                              <h4 className="text-xs font-bold text-[var(--color-brand-navy)] leading-snug">
                                {item.title}
                              </h4>
                              <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                                {item.projectName}
                              </p>
                            </div>

                            {item.description && (
                              <p
                                className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed"
                                title={item.description}
                              >
                                {item.description}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <Badge variant="blue" size="sm">
                                {item.requiredRole || item.responsibility || 'Intern Contributor'}
                              </Badge>
                              <Badge variant="neutral" size="sm">
                                {item.percentageWeight}% Weight
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                              <span className="flex items-center gap-1 font-mono">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                {effectiveDue}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  leftIcon={<Eye className="w-3 h-3" />}
                                  onClick={() => setSelectedWorkItem(item)}
                                  aria-label={`View details for ${item.title}`}
                                >
                                  Details
                                </Button>
                                <Button
                                  variant="green"
                                  size="sm"
                                  leftIcon={<CheckCircle2 className="w-3 h-3" />}
                                  onClick={() => handleInitiateTransition('Completed', item)}
                                  aria-label={`Mark complete for ${item.title}`}
                                >
                                  Mark Complete
                                </Button>
                              </div>
                            </div>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* ── COLUMN 3: COMPLETED ─────────────────────── */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-emerald-500 pb-2.5">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-status-success)]" />
                      <span className="text-xs font-bold text-[var(--color-brand-navy)] uppercase tracking-wider">
                        Completed
                      </span>
                    </div>
                    <Badge variant="success" size="sm">
                      {completedItems.length}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {isLoading ? (
                      Array.from({ length: 2 }).map((_, idx) => (
                        <Card key={`skel-completed-${idx}`} padding="sm" className="space-y-3 shadow-2xs">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                          <div className="flex gap-2">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                          </div>
                        </Card>
                      ))
                    ) : completedItems.length === 0 ? (
                      <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center space-y-1 bg-slate-50/50">
                        <p className="text-xs font-semibold text-slate-600">
                          No completed work items
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Completed tasks will be recorded here.
                        </p>
                      </div>
                    ) : (
                      completedItems.map((item) => {
                        const effectiveId = item.workItemId || item.id;
                        const effectiveDue = item.dueDate || item.targetDate || '—';
                        return (
                          <Card
                            key={item.id}
                            padding="md"
                            className="space-y-3 shadow-2xs hover:shadow-xs transition-shadow border border-slate-100 bg-slate-50/40"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                {effectiveId}
                              </span>
                              {getStatusBadge(item.status)}
                            </div>

                            <div>
                              <h4 className="text-xs font-bold text-[var(--color-brand-navy)] leading-snug">
                                {item.title}
                              </h4>
                              <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                                {item.projectName}
                              </p>
                            </div>

                            {item.description && (
                              <p
                                className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed"
                                title={item.description}
                              >
                                {item.description}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <Badge variant="blue" size="sm">
                                {item.requiredRole || item.responsibility || 'Intern Contributor'}
                              </Badge>
                              <Badge variant="success" size="sm">
                                +{item.percentageWeight}% Progress
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                              <span className="flex items-center gap-1 font-mono">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                {item.completionDate ? `Delivered ${item.completionDate}` : effectiveDue}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                leftIcon={<Eye className="w-3 h-3" />}
                                onClick={() => setSelectedWorkItem(item)}
                                aria-label={`View details for ${item.title}`}
                              >
                                View Details
                              </Button>
                            </div>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── 4. VIEW MODE: TABLE ──────────────────────────────── */}
        {viewMode === 'table' && (
          <Card padding="none" className="shadow-2xs border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table
                className="w-full text-left text-xs border-collapse min-w-[950px]"
                aria-label="Intern Assigned Work Items Table"
              >
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th scope="col" className="py-3 px-4">Work Item ID</th>
                    <th scope="col" className="py-3 px-4">Title</th>
                    <th scope="col" className="py-3 px-4">Project</th>
                    <th scope="col" className="py-3 px-4">Weight</th>
                    <th scope="col" className="py-3 px-4">Assigned Date</th>
                    <th scope="col" className="py-3 px-4">Due Date</th>
                    <th scope="col" className="py-3 px-4">Status</th>
                    <th scope="col" className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {/* Loading Skeleton */}
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                      <tr key={`table-skeleton-${idx}`}>
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
                        <td className="py-4 px-4">
                          <Skeleton className="h-4 w-12" />
                        </td>
                        <td className="py-4 px-4">
                          <Skeleton className="h-4 w-20" />
                        </td>
                        <td className="py-4 px-4">
                          <Skeleton className="h-4 w-20" />
                        </td>
                        <td className="py-4 px-4">
                          <Skeleton className="h-5 w-20 rounded-full" />
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Skeleton className="h-7 w-24 ml-auto rounded-lg" />
                        </td>
                      </tr>
                    ))
                  ) : filteredWorkItems.length > 0 ? (
                    filteredWorkItems.map((item) => {
                      const effectiveId = item.workItemId || item.id;
                      const effectiveDue = item.dueDate || item.targetDate || '—';
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
                            <div className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                              Role: {item.requiredRole || item.responsibility || 'Intern Contributor'}
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
                          <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                            {item.percentageWeight}%
                          </td>

                          {/* 5. Assigned Date */}
                          <td className="py-3 px-4 font-mono text-slate-600">
                            {item.assignedDate || '—'}
                          </td>

                          {/* 6. Due Date */}
                          <td className="py-3 px-4 font-mono text-slate-600">
                            {effectiveDue}
                          </td>

                          {/* 7. Status */}
                          <td className="py-3 px-4">
                            {getStatusBadge(item.status)}
                          </td>

                          {/* 8. Action */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="outline"
                                size="sm"
                                leftIcon={<Eye className="w-3.5 h-3.5" />}
                                onClick={() => setSelectedWorkItem(item)}
                                aria-label={`View details for ${item.title}`}
                              >
                                View Details
                              </Button>

                              {item.status === 'Not Started' && (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  leftIcon={<Play className="w-3.5 h-3.5" />}
                                  onClick={() => handleInitiateTransition('In Progress', item)}
                                  aria-label={`Start work on ${item.title}`}
                                >
                                  Start Work
                                </Button>
                              )}

                              {item.status === 'In Progress' && (
                                <Button
                                  variant="green"
                                  size="sm"
                                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                                  onClick={() => handleInitiateTransition('Completed', item)}
                                  aria-label={`Mark complete for ${item.title}`}
                                >
                                  Mark Complete
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : isFiltering ? (
                    <tr>
                      <td colSpan={8} className="p-12">
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
                      <td colSpan={8} className="p-12">
                        <EmptyState
                          icon={<CheckSquare className="w-8 h-8 text-slate-400" />}
                          title="No work items available."
                          description="Work assigned to your internship projects will appear here."
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
        )}
      </div>

      {/* ── 5. DETAILS DRAWER ─────────────────────────────────── */}
      <InternWorkItemDetailsDrawer
        isOpen={selectedWorkItem !== null}
        onClose={() => setSelectedWorkItem(null)}
        workItem={selectedWorkItem}
        onStatusTransition={handleInitiateTransition}
      />

      {/* ── 6. STATUS TRANSITION CONFIRMATION MODAL ───────────── */}
      {confirmTransition && (
        <div
          className="fixed inset-0 z-60 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="transition-modal-title"
        >
          <div className="min-h-screen px-4 flex items-center justify-center">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-[var(--color-brand-navy)]/50 backdrop-blur-xs transition-opacity"
              onClick={() => setConfirmTransition(null)}
              aria-hidden="true"
            />

            {/* Modal Card */}
            <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 z-10 border border-slate-200">
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    confirmTransition.targetStatus === 'Completed'
                      ? 'bg-emerald-50 text-[var(--color-status-success)]'
                      : 'bg-blue-50 text-[var(--color-brand-blue)]'
                  }`}
                >
                  {confirmTransition.targetStatus === 'Completed' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Info className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-1.5 flex-1">
                  <h3
                    id="transition-modal-title"
                    className="text-base font-bold text-[var(--color-brand-navy)]"
                  >
                    {confirmTransition.targetStatus === 'Completed'
                      ? 'Confirm Work Item Completion'
                      : 'Start this work item?'}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {confirmTransition.targetStatus === 'Completed' ? (
                      <>
                        Are you sure you want to mark{' '}
                        <strong className="text-slate-800 font-semibold">
                          {confirmTransition.item.title}
                        </strong>{' '}
                        as completed? Once completed, its predefined weight (
                        {confirmTransition.item.percentageWeight}%) will automatically contribute to
                        overall project progress. Completed items cannot be moved backward.
                      </>
                    ) : (
                      <>
                        This work item will move to{' '}
                        <strong className="text-slate-800 font-semibold">In Progress</strong>. You
                        can begin tracking development activities on this task.
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Work item summary strip */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-center justify-between">
                <div>
                  <span className="font-mono text-slate-500 text-[10px] block">
                    {confirmTransition.item.workItemId || confirmTransition.item.id}
                  </span>
                  <span className="font-semibold text-slate-800 truncate max-w-[200px] block">
                    {confirmTransition.item.title}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Predefined Weight</span>
                  <span className="font-mono font-bold text-[var(--color-brand-blue)]">
                    {confirmTransition.item.percentageWeight}%
                  </span>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmTransition(null)}
                >
                  Cancel
                </Button>
                {confirmTransition.targetStatus === 'Completed' ? (
                  <Button
                    type="button"
                    variant="green"
                    size="sm"
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    onClick={handleConfirmTransition}
                  >
                    Mark Complete
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    leftIcon={<Play className="w-3.5 h-3.5" />}
                    onClick={handleConfirmTransition}
                  >
                    Start Work
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
