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
  InternWorkHistoryDetailsDrawer,
  type InternHistoryRecord,
  formatDisplayDate,
} from './components/InternWorkHistoryDetailsDrawer';

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

  // History Records State
  const [historyRecords, setHistoryRecords] = useState<InternHistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected history record for Details Drawer
  const [selectedRecord, setSelectedRecord] = useState<InternHistoryRecord | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || '—',
    email: user?.email || '—',
    roleLabel: 'Intern',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
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

      const records: InternHistoryRecord[] = [];

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
              description: `Project: ${prj.name} • Assigned Role: ${wi.role}`,
              requiredRole: wi.role,
              responsibility: wi.role,
              percentageWeight: wi.percentage,
              finalStatus: mapWorkItemStatusToDisplay(wi.status),
              assignedDate: asg.startDate || prj.startDate,
              startedDate: asg.startDate || prj.startDate,
              completionDate: wi.status === 'DONE' ? prj.targetDate : undefined,
              progressContribution: wi.status === 'DONE' ? wi.percentage : 0,
              assignedRole: asg.assignmentRole || asg.professionalRole || 'Intern Contributor',
              assignmentStatus: asg.status || 'Assigned',
              projectProgress: prj.progress || 0,
            });
          });
        }
      });

      setHistoryRecords(records);
    } catch (err: unknown) {
      console.error('Error loading intern work history:', err);
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

  const handleResetFilters = () => {
    setSearchQuery('');
    setProjectFilter('ALL');
    setStatusFilter('ALL');
    setFromDate('');
    setToDate('');
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

  const totalCompletedContribution =
    historyRecords.length > 0
      ? historyRecords
          .filter((r) => r.finalStatus.toLowerCase() === 'completed')
          .reduce((acc, r) => acc + (r.percentageWeight ?? 0), 0)
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
      navigation={INTERN_NAVIGATION}
      user={userDisplay}
      notificationsCount={0}
      onNotificationClick={() => {}}
      onProfileClick={() => {}}
      onLogoutClick={handleLogout}
    >
      <PageHeader
        title="Work History"
        description="Review your completed work and contribution history across internship projects."
        breadcrumbs={[{ label: 'Workspace' }, { label: 'Work History' }]}
        badge={<Badge variant="blue">Intern</Badge>}
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<TrendingUp className="w-3.5 h-3.5" />}
              onClick={() => navigate('/intern/progress')}
            >
              View Work Progress
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
              aria-label="Refresh work history"
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
            title="Unable to load work history"
            onClose={() => setError(null)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-1">
              <span>
                There was a problem retrieving your internship work history records. Please check your connection or try refreshing the page.
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
              {totalHistoryRecords > 0 ? 'Recorded internship milestones' : 'No active allocations'}
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
              {completedWorkItems > 0 ? 'Successfully delivered' : 'No completed tasks'}
            </p>
          </Card>

          {/* Projects Contributed */}
          <Card padding="md" className="space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Projects Contributed
              </span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-navy)] font-mono">
              {projectsContributed}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {projectsContributed > 0 ? 'Active or delivered projects' : 'No project allocations'}
            </p>
          </Card>

          {/* Total Completed Contribution */}
          <Card padding="md" className="space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Total Completed Contribution
              </span>
              <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-navy)] font-mono">
              {totalCompletedContribution}%
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {totalCompletedContribution > 0 ? 'Credited to projects' : 'Based on delivered work'}
            </p>
          </Card>
        </div>

        {/* ── 2. HISTORY GOVERNANCE / POLICY CARD ──────────────── */}
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
                  Historical Record Policy
                </h3>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
                Completed work-item weights contribute automatically to project progress. Historical contribution records are read-only and preserved for performance reviews.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-700 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200/80 shadow-2xs flex-wrap self-start lg:self-auto">
              <span>Completed Work Item</span>
              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="text-[var(--color-brand-blue)] font-bold">Predefined Weight Added</span>
              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="text-emerald-600 font-bold">Project Progress Updated</span>
            </div>
          </div>
        </Card>

        {/* ── 3. SEARCH AND FILTERS ────────────────────────────── */}
        <Card padding="md" className="shadow-2xs">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* Search Query */}
              <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                <label
                  htmlFor="searchQuery"
                  className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block"
                >
                  Search History
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <Input
                    id="searchQuery"
                    type="text"
                    placeholder="Search title, ID, or project..."
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

              {/* From Date */}
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
                  aria-label="Filter from completion date"
                />
              </div>

              {/* To Date */}
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
                  aria-label="Filter to completion date"
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
                    Total History Records:{' '}
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

        {/* ── 4. WORK HISTORY TABLE ────────────────────────────── */}
        <Card padding="none" className="shadow-2xs border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table
              className="w-full text-left text-xs border-collapse min-w-[950px]"
              aria-label="Intern Work History Table"
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
                    <tr key={`history-skeleton-${idx}`}>
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
                  filteredRecords.map((r) => {
                    const effectiveId = r.workItemId || r.id;
                    const isCompleted = r.finalStatus.toLowerCase() === 'completed';
                    return (
                      <tr
                        key={r.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        {/* 1. Work Item ID */}
                        <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                          {effectiveId}
                        </td>

                        {/* 2. Work Item Title */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-[var(--color-brand-navy)]">
                            {r.workItemTitle}
                          </div>
                          <div className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                            Role: {r.requiredRole || r.responsibility || r.assignedRole || 'Intern Contributor'}
                          </div>
                        </td>

                        {/* 3. Project */}
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-800">
                            {r.projectName}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                            {r.projectId}
                          </div>
                        </td>

                        {/* 4. Contribution / Weight */}
                        <td className="py-3 px-4 text-center font-mono font-semibold">
                          {isCompleted && r.percentageWeight !== undefined ? (
                            <span className="text-emerald-600 font-bold">
                              +{r.percentageWeight}%
                            </span>
                          ) : r.percentageWeight !== undefined ? (
                            <span className="text-slate-600">
                              {r.percentageWeight}%
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>

                        {/* 5. Status */}
                        <td className="py-3 px-4">
                          {getStatusBadge(r.finalStatus)}
                        </td>

                        {/* 6. Started Date */}
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {formatDisplayDate(r.startedDate)}
                        </td>

                        {/* 7. Completion Date */}
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {formatDisplayDate(r.completionDate)}
                        </td>

                        {/* 8. Action */}
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                            onClick={() => setSelectedRecord(r)}
                            aria-label={`View history details for ${r.workItemTitle}`}
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
                        description="No work history records match your current search query or filter selections. Try adjusting or resetting your filters."
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
                        description="Completed work items will appear here as your internship project activity progresses."
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

      {/* ── 5. DETAILS DRAWER ─────────────────────────────────── */}
      <InternWorkHistoryDetailsDrawer
        isOpen={selectedRecord !== null}
        onClose={() => setSelectedRecord(null)}
        record={selectedRecord}
      />
    </DashboardLayout>
  );
}
