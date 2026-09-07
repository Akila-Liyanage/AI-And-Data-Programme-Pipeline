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
  KanbanSquare,
  TableProperties,
  Clock,
  CheckCircle2,
  Eye,
  X,
  Play,
  Calendar,
  Layers,
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
  StaffWorkItemDetailsDrawer,
  type StaffWorkItem,
} from './components/StaffWorkItemDetailsDrawer';

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

interface TransitionTarget {
  item: StaffWorkItem;
  targetStatus: 'In Progress' | 'Completed';
}

export default function StaffWorkItemsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // View Mode: Board (Kanban) or Table
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');

  // Work Items State
  const [workItems, setWorkItems] = useState<StaffWorkItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
  const [selectedWorkItem, setSelectedWorkItem] = useState<StaffWorkItem | null>(null);

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
    setProjectFilter('ALL');
    setStatusFilter('ALL');
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
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

  // Allowed Staff Status Transitions (BRD Aligned)
  const handleInitiateTransition = (
    targetStatus: 'In Progress' | 'Completed',
    item: StaffWorkItem
  ) => {
    setConfirmTransition({ item, targetStatus });
  };

  const handleConfirmTransition = () => {
    if (!confirmTransition) return;
    const { item, targetStatus } = confirmTransition;

    // Apply state transition in UI
    setWorkItems((prev) =>
      prev.map((wi) =>
        wi.id === item.id
          ? {
              ...wi,
              status: targetStatus,
              completionDate:
                targetStatus === 'Completed'
                  ? new Date().toISOString().split('T')[0]
                  : wi.completionDate,
            }
          : wi
      )
    );

    // Keep drawer updated if currently open
    if (selectedWorkItem && selectedWorkItem.id === item.id) {
      setSelectedWorkItem((prev) =>
        prev
          ? {
              ...prev,
              status: targetStatus,
              completionDate:
                targetStatus === 'Completed'
                  ? new Date().toISOString().split('T')[0]
                  : prev.completionDate,
            }
          : null
      );
    }

    setNoticeMessage(
      `Work item ${item.workItemId || item.id} status updated to "${targetStatus}".`
    );
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

  // Group filtered items for Board view
  const notStartedItems = filteredWorkItems.filter((i) => i.status === 'Not Started');
  const inProgressItems = filteredWorkItems.filter((i) => i.status === 'In Progress');
  const completedItems = filteredWorkItems.filter((i) => i.status === 'Completed');

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
        title="My Work Items"
        description="Review and manage work assigned across your projects."
        breadcrumbs={[{ label: 'Workspace' }, { label: 'My Work Items' }]}
        badge={<Badge variant="success">Permanent Staff</Badge>}
        actions={
          <div className="flex items-center gap-3 flex-wrap">
            {/* Refresh action */}
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
              onClick={handleRefresh}
              disabled={isLoading}
              aria-label="Refresh work items list"
            >
              Refresh
            </Button>

            {/* View switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('board')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 focus:outline-hidden cursor-pointer ${
                  viewMode === 'board'
                    ? 'bg-white text-[var(--color-brand-navy)] shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                aria-label="Switch to Board View"
                aria-pressed={viewMode === 'board'}
              >
                <KanbanSquare className="w-3.5 h-3.5" />
                Board View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 focus:outline-hidden cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-[var(--color-brand-navy)] shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                aria-label="Switch to Table View"
                aria-pressed={viewMode === 'table'}
              >
                <TableProperties className="w-3.5 h-3.5" />
                Table View
              </button>
            </div>
          </div>
        }
      />

      <div className="space-y-6">
        {/* ── ERROR STATE ALERT ────────────────────────────────── */}
        {error && (
          <Alert
            variant="error"
            title="Unable to load work items"
            onClose={() => setError(null)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-1">
              <span>
                There was a problem retrieving your assigned work items. Please verify your connection or try refreshing the page.
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

        {/* ── NOTICE MESSAGE ALERT ─────────────────────────────── */}
        {noticeMessage && (
          <Alert
            variant="success"
            title="Work Item Status Updated"
            onClose={() => setNoticeMessage(null)}
          >
            {noticeMessage}
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
              {totalWorkItems > 0 ? 'Assigned across projects' : 'No assigned work items'}
            </p>
          </Card>

          {/* Not Started */}
          <Card padding="md" className="space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Not Started
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-navy)] font-mono">
              {notStartedCount}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {notStartedCount > 0 ? 'Pending initial action' : 'No items waiting to start'}
            </p>
          </Card>

          {/* In Progress */}
          <Card padding="md" className="space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                In Progress
              </span>
              <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-navy)] font-mono">
              {inProgressCount}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {inProgressCount > 0 ? 'Currently active tasks' : 'No active work items'}
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
              {completedCount > 0 ? 'Contributing to project progress' : 'No completed work items'}
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
                    placeholder="Search by ID, title, or project..."
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

              {/* Status Filter (BRD-aligned statuses only) */}
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

            {/* Filter Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
              <span className="text-[11px] text-slate-500">
                {isFiltering ? (
                  <>
                    Filtered:{' '}
                    <strong className="text-slate-700">
                      {filteredWorkItems.length}
                    </strong>{' '}
                    of {workItems.length} {workItems.length === 1 ? 'item' : 'items'}
                  </>
                ) : (
                  <>
                    Total Work Items:{' '}
                    <strong className="text-slate-700">{workItems.length}</strong>{' '}
                    {workItems.length === 1 ? 'item' : 'items'}
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

        {/* ── 3. VIEW MODE RENDERING ──────────────────────────── */}
        {viewMode === 'board' ? (
          /* ── 3A. BOARD VIEW (KANBAN) ── */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* COLUMN 1: NOT STARTED */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <h3 className="text-xs font-bold text-[var(--color-brand-navy)] uppercase tracking-wider">
                    Not Started
                  </h3>
                </div>
                <Badge variant="neutral" size="sm">
                  {notStartedItems.length}
                </Badge>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-28 w-full rounded-xl" />
                  <Skeleton className="h-28 w-full rounded-xl" />
                </div>
              ) : notStartedItems.length > 0 ? (
                <div className="space-y-3">
                  {notStartedItems.map((item) => (
                    <Card
                      key={item.id}
                      padding="sm"
                      className="bg-white border border-slate-200 shadow-2xs hover:shadow-sm transition-shadow space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {item.workItemId || item.id}
                        </span>
                        <Badge size="sm" variant="info">
                          {item.percentageWeight}% Weight
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-[var(--color-brand-navy)] leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">
                          {item.projectName}
                        </p>
                        {item.description && (
                          <p className="text-[11px] text-slate-600 line-clamp-2 pt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {item.dueDate || item.targetDate || '—'}
                        </span>
                        {item.requiredRole && (
                          <span className="truncate max-w-[110px]">{item.requiredRole}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                          onClick={() => setSelectedWorkItem(item)}
                          className="text-xs px-2 h-7"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={<Play className="w-3 h-3" />}
                          onClick={() => handleInitiateTransition('In Progress', item)}
                          className="text-xs px-2.5 h-7"
                        >
                          Start Work
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Clock className="w-6 h-6 text-slate-400" />}
                  title="No work items waiting to start"
                  description="Assigned work items with Not Started status will appear here once allocated."
                  minHeight="min-h-[140px]"
                />
              )}
            </div>

            {/* COLUMN 2: IN PROGRESS */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-brand-blue)]" />
                  <h3 className="text-xs font-bold text-[var(--color-brand-navy)] uppercase tracking-wider">
                    In Progress
                  </h3>
                </div>
                <Badge variant="blue" size="sm">
                  {inProgressItems.length}
                </Badge>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-28 w-full rounded-xl" />
                  <Skeleton className="h-28 w-full rounded-xl" />
                </div>
              ) : inProgressItems.length > 0 ? (
                <div className="space-y-3">
                  {inProgressItems.map((item) => (
                    <Card
                      key={item.id}
                      padding="sm"
                      className="bg-white border border-slate-200 shadow-2xs hover:shadow-sm transition-shadow space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {item.workItemId || item.id}
                        </span>
                        <Badge size="sm" variant="blue">
                          {item.percentageWeight}% Weight
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-[var(--color-brand-navy)] leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">
                          {item.projectName}
                        </p>
                        {item.description && (
                          <p className="text-[11px] text-slate-600 line-clamp-2 pt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {item.dueDate || item.targetDate || '—'}
                        </span>
                        {item.requiredRole && (
                          <span className="truncate max-w-[110px]">{item.requiredRole}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                          onClick={() => setSelectedWorkItem(item)}
                          className="text-xs px-2 h-7"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="green"
                          size="sm"
                          leftIcon={<CheckCircle2 className="w-3 h-3" />}
                          onClick={() => handleInitiateTransition('Completed', item)}
                          className="text-xs px-2.5 h-7"
                        >
                          Mark Complete
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<TrendingUp className="w-6 h-6 text-slate-400" />}
                  title="No work items in progress"
                  description="Work items currently being executed will appear here."
                  minHeight="min-h-[140px]"
                />
              )}
            </div>

            {/* COLUMN 3: COMPLETED */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-brand-green)]" />
                  <h3 className="text-xs font-bold text-[var(--color-brand-navy)] uppercase tracking-wider">
                    Completed
                  </h3>
                </div>
                <Badge variant="success" size="sm">
                  {completedItems.length}
                </Badge>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-28 w-full rounded-xl" />
                  <Skeleton className="h-28 w-full rounded-xl" />
                </div>
              ) : completedItems.length > 0 ? (
                <div className="space-y-3">
                  {completedItems.map((item) => (
                    <Card
                      key={item.id}
                      padding="sm"
                      className="bg-white border border-slate-200 shadow-2xs hover:shadow-sm transition-shadow space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {item.workItemId || item.id}
                        </span>
                        <Badge size="sm" variant="success">
                          {item.percentageWeight}% Contributed
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-[var(--color-brand-navy)] leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">
                          {item.projectName}
                        </p>
                        {item.description && (
                          <p className="text-[11px] text-slate-600 line-clamp-2 pt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                        <span className="flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-3 h-3 text-[var(--color-status-success)]" />
                          {item.completionDate || item.dueDate || item.targetDate || 'Completed'}
                        </span>
                        <span className="font-semibold text-emerald-700">Read-only</span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                          onClick={() => setSelectedWorkItem(item)}
                          className="text-xs px-2 h-7"
                        >
                          View Details
                        </Button>
                        <Badge size="sm" variant="success">
                          Completed
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<CheckCircle2 className="w-6 h-6 text-slate-400" />}
                  title="No completed work items"
                  description="Completed work items will appear here and contribute their assigned percentage weights to project progress."
                  minHeight="min-h-[140px]"
                />
              )}
            </div>
          </div>
        ) : (
          /* ── 3B. TABLE VIEW ── */
          <Card padding="none" className="shadow-2xs border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table
                className="w-full text-left text-xs border-collapse min-w-[950px]"
                aria-label="Assigned Work Items Table"
              >
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th scope="col" className="py-3 px-4">Work Item ID</th>
                    <th scope="col" className="py-3 px-4">Title</th>
                    <th scope="col" className="py-3 px-4">Project</th>
                    <th scope="col" className="py-3 px-4 text-center">Weight</th>
                    <th scope="col" className="py-3 px-4">Assigned Date</th>
                    <th scope="col" className="py-3 px-4">Due Date</th>
                    <th scope="col" className="py-3 px-4">Status</th>
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
                        <td className="py-4 px-4 space-y-1.5">
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
                    filteredWorkItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* 1. Work Item ID */}
                        <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                          {item.workItemId || item.id}
                        </td>

                        {/* 2. Title */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-[var(--color-brand-navy)]">
                            {item.title}
                          </div>
                          {item.requiredRole && (
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Layers className="w-3 h-3 text-slate-400" />
                              <span>{item.requiredRole}</span>
                            </div>
                          )}
                        </td>

                        {/* 3. Project */}
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-800 truncate max-w-[200px]">
                            {item.projectName}
                          </div>
                          <div className="font-mono text-[10px] text-slate-400">
                            {item.projectId}
                          </div>
                        </td>

                        {/* 4. Weight */}
                        <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700">
                          {item.percentageWeight}%
                        </td>

                        {/* 5. Assigned Date */}
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {item.assignedDate || '—'}
                        </td>

                        {/* 6. Due Date */}
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {item.dueDate || item.targetDate || '—'}
                        </td>

                        {/* 7. Status */}
                        <td className="py-3 px-4">
                          {getStatusBadge(item.status)}
                        </td>

                        {/* 8. Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
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
                                leftIcon={<Play className="w-3 h-3" />}
                                onClick={() => handleInitiateTransition('In Progress', item)}
                              >
                                Start Work
                              </Button>
                            )}

                            {item.status === 'In Progress' && (
                              <Button
                                variant="green"
                                size="sm"
                                leftIcon={<CheckCircle2 className="w-3 h-3" />}
                                onClick={() => handleInitiateTransition('Completed', item)}
                              >
                                Mark Complete
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : isFiltering ? (
                    <tr>
                      <td colSpan={8} className="p-12">
                        <EmptyState
                          icon={<Search className="w-8 h-8 text-slate-400" />}
                          title="No matching work items found."
                          description="No work items match your current search query or filter selections. Try adjusting or clearing your filters."
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
                          description="Work items assigned to your Permanent Staff account will appear here once allocated by your project lead."
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

      {/* ── 4. DETAILS DRAWER ─────────────────────────────────── */}
      <StaffWorkItemDetailsDrawer
        isOpen={selectedWorkItem !== null}
        onClose={() => setSelectedWorkItem(null)}
        workItem={selectedWorkItem}
        onStatusTransition={handleInitiateTransition}
      />

      {/* ── 5. STATUS TRANSITION CONFIRMATION MODAL ───────────── */}
      {confirmTransition && (
        <div
          className="fixed inset-0 z-55 overflow-hidden flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
        >
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-[var(--color-brand-navy)]/50 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setConfirmTransition(null)}
          />

          {/* Dialog content box */}
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 relative z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  confirmTransition.targetStatus === 'Completed'
                    ? 'bg-emerald-50 text-[var(--color-status-success)]'
                    : 'bg-blue-50 text-[var(--color-brand-blue)]'
                }`}
              >
                {confirmTransition.targetStatus === 'Completed' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3
                  id="confirm-dialog-title"
                  className="text-base font-bold text-[var(--color-brand-navy)]"
                >
                  {confirmTransition.targetStatus === 'In Progress'
                    ? 'Start this work item?'
                    : 'Mark this work item as completed?'}
                </h3>
                <p className="text-xs text-slate-500">
                  Work Item ID: {confirmTransition.item.workItemId || confirmTransition.item.id}
                </p>
              </div>
            </div>

            {/* Work item summary snapshot */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
              <p className="font-semibold text-slate-800">
                {confirmTransition.item.title}
              </p>
              <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1">
                <span>{confirmTransition.item.projectName}</span>
                <span className="font-mono font-semibold text-[var(--color-brand-blue)]">
                  {confirmTransition.item.percentageWeight}% Weight
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {confirmTransition.targetStatus === 'In Progress' &&
                'Transitioning to "In Progress" marks this item as currently active. You can track your work and eventually complete it.'}
              {confirmTransition.targetStatus === 'Completed' &&
                `Marking this work item as completed will finalize this task. Its predefined weight (${confirmTransition.item.percentageWeight}%) will automatically contribute to overall project progress. Completed items cannot be moved backward.`}
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmTransition(null)}
              >
                Cancel
              </Button>
              <Button
                variant={
                  confirmTransition.targetStatus === 'Completed' ? 'green' : 'primary'
                }
                size="sm"
                onClick={handleConfirmTransition}
              >
                {confirmTransition.targetStatus === 'In Progress'
                  ? 'Start Work'
                  : 'Confirm Completion'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
