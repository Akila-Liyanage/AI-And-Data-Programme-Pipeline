import { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  TrendingUp,
  History,
  User,
  Info,
  ArrowRight,
  Search,
  RotateCcw,
  Eye,
  X,
  CheckCircle2,
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
  fetchAssignments,
  fetchProjects,
  mapWorkItemStatusToDisplay,
  type ApiProject,
} from '../../utils/apiDataService';
import {
  StaffWorkHistoryDetailsDrawer,
  type StaffHistoryRecord,
} from './components/StaffWorkHistoryDetailsDrawer';

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

export default function StaffWorkHistoryPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // History Records State
  const [historyRecords, setHistoryRecords] = useState<StaffHistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected history record for Details Drawer
  const [selectedRecord, setSelectedRecord] = useState<StaffHistoryRecord | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

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
    setFromDate('');
    setToDate('');
  };

  const loadWorkHistory = async () => {
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

      const records: StaffHistoryRecord[] = [];

      assignments.forEach((asg) => {
        const prj = projectMap.get(asg.projectId);
        if (prj && prj.workItems) {
          prj.workItems.forEach((wi) => {
            records.push({
              id: `${prj.projectId}-${wi.workItemId}`,
              workItemId: wi.workItemId,
              workItemTitle: wi.title,
              projectId: prj.projectId,
              projectName: prj.name,
              description: `Project: ${prj.name} • Responsibility: ${wi.role}`,
              requiredRole: wi.role,
              responsibility: wi.role,
              percentageWeight: wi.percentage,
              finalStatus: mapWorkItemStatusToDisplay(wi.status),
              assignedDate: asg.startDate || prj.startDate,
              startedDate: asg.startDate || prj.startDate,
              completionDate: wi.status === 'DONE' ? prj.targetDate : undefined,
              progressContribution: wi.status === 'DONE' ? wi.percentage : 0,
              assignedUser: `${user.fullName || 'Staff Member'} (${user.userId})`,
              userRole: asg.assignmentRole || asg.professionalRole || 'Senior Contributor',
              assignmentStatus: asg.status || 'Assigned',
              projectProgress: prj.progress || 0,
            });
          });
        }
      });

      setHistoryRecords(records);
    } catch (err: unknown) {
      console.error('Error loading work history:', err);
      setError('Could not retrieve work history from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorkHistory();
  }, [user?.userId]);

  const handleRefresh = () => {
    loadWorkHistory();
  };


  // Distinct projects list for the project filter
  const availableProjects = useMemo(() => {
    const map = new Map<string, string>();
    historyRecords.forEach((item) => {
      if (item.projectId && item.projectName) {
        map.set(item.projectId, item.projectName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [historyRecords]);

  // KPI Calculations
  const totalHistoryRecords = historyRecords.length;
  const completedWorkItems = historyRecords.filter(
    (r) => r.finalStatus.toLowerCase() === 'completed'
  ).length;

  const projectsContributed = new Set(
    historyRecords.map((r) => r.projectId).filter(Boolean)
  ).size;

  const rawCompletedContribution =
    historyRecords.length > 0
      ? historyRecords
          .filter((r) => r.finalStatus.toLowerCase() === 'completed')
          .reduce((acc, r) => acc + (r.percentageWeight ?? 0), 0)
      : 0;

  // Normalized to a maximum of 100% based on the number of projects and completed work
  const totalCompletedContribution =
    projectsContributed > 0
      ? Math.min(100, Math.round(rawCompletedContribution / projectsContributed))
      : 0;

  // Filtered History Records
  const filteredRecords = useMemo(() => {
    return historyRecords.filter((record) => {
      const query = searchQuery.trim().toLowerCase();
      const effectiveId = (record.workItemId || record.id).toLowerCase();
      const matchesSearch =
        !query ||
        record.workItemTitle.toLowerCase().includes(query) ||
        effectiveId.includes(query) ||
        record.projectName.toLowerCase().includes(query) ||
        record.projectId.toLowerCase().includes(query);

      const matchesProject =
        projectFilter === 'ALL' || record.projectId === projectFilter;

      const matchesStatus =
        statusFilter === 'ALL' ||
        record.finalStatus.toLowerCase() === statusFilter.toLowerCase();

      // Date range filtering (by completionDate)
      let matchesDate = true;
      if (fromDate && record.completionDate) {
        matchesDate = matchesDate && record.completionDate >= fromDate;
      }
      if (toDate && record.completionDate) {
        matchesDate = matchesDate && record.completionDate <= toDate;
      }

      return matchesSearch && matchesProject && matchesStatus && matchesDate;
    });
  }, [historyRecords, searchQuery, projectFilter, statusFilter, fromDate, toDate]);

  const isFiltering =
    searchQuery.trim() !== '' ||
    projectFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    fromDate !== '' ||
    toDate !== '';

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <Badge variant="success" size="sm">
            Completed
          </Badge>
        );
      case 'in progress':
        return (
          <Badge variant="blue" size="sm">
            In Progress
          </Badge>
        );
      case 'not started':
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
      onProfileClick={() => navigate('/staff/profile')}
      onLogoutClick={handleLogout}
    >
      <PageHeader
        title="Work History"
        description="Review your completed work and contribution history across assigned projects."
        breadcrumbs={[{ label: 'Workspace' }, { label: 'Work History' }]}
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
              aria-label="Refresh work history"
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<TrendingUp className="w-3.5 h-3.5" />}
              onClick={() => navigate('/staff/progress')}
            >
              Work Progress
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
            title="Unable to load work history"
            onClose={() => setError(null)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-1">
              <span>
                There was a problem retrieving your work history records. Please verify your connection or try refreshing the page.
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
          {/* Total History Records */}
          <Card padding="md" className="space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Total History Records
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[var(--color-brand-blue)] flex items-center justify-center">
                <History className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-navy)] font-mono">
              {totalHistoryRecords}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {totalHistoryRecords > 0 ? 'Archived work records' : 'No history recorded'}
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
              {completedWorkItems}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {completedWorkItems > 0 ? 'Fully delivered deliverables' : 'No completed tasks'}
            </p>
          </Card>

          {/* Projects Contributed */}
          <Card padding="md" className="space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Projects Contributed
              </span>
              <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-navy)] font-mono">
              {projectsContributed}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {projectsContributed > 0 ? 'Distinct project contributions' : 'No projects recorded'}
            </p>
          </Card>

          {/* Total Completed Contribution */}
          <Card padding="md" className="space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Total Completed Contribution
              </span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-navy)] font-mono">
              {totalCompletedContribution}%
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {projectsContributed > 0
                ? `Avg. across ${projectsContributed} project${projectsContributed > 1 ? 's' : ''}`
                : '0% completed'}
            </p>
          </Card>
        </div>

        {/* ── 2. CONTRIBUTION GOVERNANCE CARD ─────────────────── */}
        <Card padding="md" className="bg-slate-50/70 border border-slate-200 shadow-2xs">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[var(--color-brand-blue)] shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-2.5 min-w-0 flex-1">
              <div>
                <h3 className="text-sm font-bold text-[var(--color-brand-navy)]">
                  Completed Contribution Governance
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mt-0.5">
                  Completed work-item percentage weights contribute automatically to project progress. Historical records and credited weights are locked and read-only.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] bg-white p-2.5 rounded-lg border border-slate-100 max-w-xl">
                <span className="text-slate-800">Completed Work Item</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="text-slate-800">Predefined Percentage Weight</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="text-slate-800">Contribution Credited</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="text-[var(--color-brand-blue)] font-bold">Project Progress Updated</span>
              </div>
            </div>
          </div>
        </Card>

        {/* ── 3. SEARCH AND FILTERS ────────────────────────────── */}
        <Card padding="md" className="shadow-2xs">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Search Query */}
              <div className="space-y-1.5 col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-2">
                <label
                  htmlFor="searchQuery"
                  className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block"
                >
                  Search Work History
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
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Not Started">Not Started</option>
                </select>
              </div>

              {/* Date From */}
              <div className="space-y-1.5">
                <label
                  htmlFor="fromDate"
                  className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block"
                >
                  From Date
                </label>
                <input
                  id="fromDate"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)] text-slate-700 bg-white"
                />
              </div>

              {/* Date To */}
              <div className="space-y-1.5">
                <label
                  htmlFor="toDate"
                  className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block"
                >
                  To Date
                </label>
                <input
                  id="toDate"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)] text-slate-700 bg-white"
                />
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
              <span className="text-[11px] text-slate-500">
                {isFiltering ? (
                  <>
                    Filtered:{' '}
                    <strong className="text-slate-700">
                      {filteredRecords.length}
                    </strong>{' '}
                    of {historyRecords.length} {historyRecords.length === 1 ? 'record' : 'records'}
                  </>
                ) : (
                  <>
                    Total Records:{' '}
                    <strong className="text-slate-700">{historyRecords.length}</strong>{' '}
                    {historyRecords.length === 1 ? 'record' : 'records'}
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

        {/* ── 4. WORK HISTORY TABLE ───────────────────────────── */}
        <Card
          padding="none"
          title="All Work History Records"
          subtitle="Historical breakdown of completed assignments and credited contributions"
          className="shadow-2xs border border-slate-100 overflow-hidden"
        >
          <div className="overflow-x-auto w-full">
            <table
              className="w-full text-left text-xs border-collapse min-w-[950px]"
              aria-label="Work History Table"
            >
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4">Work Item ID</th>
                  <th scope="col" className="py-3 px-4">Work Item Title</th>
                  <th scope="col" className="py-3 px-4">Project</th>
                  <th scope="col" className="py-3 px-4 text-center">Contribution / Weight</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4">Started Date</th>
                  <th scope="col" className="py-3 px-4">Completion Date</th>
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
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </td>
                      <td className="py-4 px-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="py-4 px-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Skeleton className="h-7 w-24 ml-auto rounded-lg" />
                      </td>
                    </tr>
                  ))
                ) : filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => {
                    const isCompleted = record.finalStatus.toLowerCase() === 'completed';
                    return (
                      <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* 1. Work Item ID */}
                        <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                          {record.workItemId || record.id}
                        </td>

                        {/* 2. Work Item Title */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-[var(--color-brand-navy)]">
                            {record.workItemTitle}
                          </div>
                          {record.requiredRole && (
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Layers className="w-3 h-3 text-slate-400" />
                              <span>{record.requiredRole}</span>
                            </div>
                          )}
                        </td>

                        {/* 3. Project */}
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-800 truncate max-w-[200px]">
                            {record.projectName}
                          </div>
                          <div className="font-mono text-[10px] text-slate-400">
                            {record.projectId}
                          </div>
                        </td>

                        {/* 4. Contribution / Weight */}
                        <td className="py-3 px-4 text-center font-mono font-semibold">
                          {record.percentageWeight !== undefined ? (
                            <span className={isCompleted ? 'text-[var(--color-status-success)]' : 'text-slate-700'}>
                              {record.percentageWeight}%
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        {/* 5. Status */}
                        <td className="py-3 px-4">
                          {getStatusBadge(record.finalStatus)}
                        </td>

                        {/* 6. Started Date */}
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {record.startedDate || '—'}
                        </td>

                        {/* 7. Completion Date */}
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {record.completionDate || '—'}
                        </td>

                        {/* 8. Action */}
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                            onClick={() => setSelectedRecord(record)}
                            aria-label={`View details for ${record.workItemTitle}`}
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
                        title="No matching work history found."
                        description="No work history records match your current filter selections. Try adjusting or resetting your filters."
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
                        icon={<History className="w-8 h-8 text-slate-400" />}
                        title="No work history available."
                        description="Completed work items will appear here as your project activity progresses."
                        secondaryAction={
                          <Badge size="sm" variant="neutral">
                            No history recorded
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

      {/* ── 5. DETAILS DRAWER ─────────────────────────────────── */}
      <StaffWorkHistoryDetailsDrawer
        isOpen={selectedRecord !== null}
        onClose={() => setSelectedRecord(null)}
        record={selectedRecord}
      />
    </DashboardLayout>
  );
}
