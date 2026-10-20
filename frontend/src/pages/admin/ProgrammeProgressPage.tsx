/**
 * ProgrammeProgressPage.tsx
 *
 * PRODUCTION-READY ADMIN PROGRAMME PROGRESS CONSOLE
 * Features:
 * - Live MongoDB synchronization (GET /api/projects, GET /api/users)
 * - Derived overall progress calculated automatically from completed work-item percentage weights
 * - 4 Primary Responsive KPI Cards (Total Projects, Active Projects, Completed Projects, Average Programme Progress)
 * - Secondary Contributor & Work-Item Delivery Summary (Permanent Staff, Interns, Total Assigned, Completed Work Items)
 * - Read-only Portfolio Progress Velocity Overview
 * - Professional Progress Calculation Policy Information Card
 * - Objective Delivery Analytics (Status Distribution, Comparison Bars, Team Distribution, Objective Delivery Status)
 * - Milestone Trend with production-grade informational state (no fake trend data or invented graphs)
 * - Responsive Project Progress Table with Search, Status, Category, and Progress Range filtering
 * - Slide-over Project Details Drawer for granular read-only work-item & progress inspection
 */
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Activity,
  CheckCircle2,
  Users,
  TrendingUp,
  RefreshCw,
  BarChart3,
  PieChart,
  BarChart2,
  LineChart,
  Search,
  RotateCcw,
  Eye,
  ShieldCheck,
  CheckSquare,
} from 'lucide-react';
import {
  DashboardLayout,
  PageHeader,
  type UserDisplayInfo,
} from '../../components/layout/DashboardLayout';
import {
  Card,
  Badge,
  Button,
  Alert,
  EmptyState,
} from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { ADMIN_NAVIGATION } from '../../config/adminNavigation';
import { ProjectDetailsDrawer } from './components/ProjectDetailsDrawer';
import type { ManagedProject } from '../../types/projectManagement.types';

// Analytics components — pure CSS / SVG
import { OverallProgrammeProgress } from './components/analytics/OverallProgrammeProgress';
import { ProjectStatusDistribution } from './components/analytics/ProjectStatusDistribution';
import { ProjectProgressComparison } from './components/analytics/ProjectProgressComparison';
import { MilestoneCompletionTrend } from './components/analytics/MilestoneCompletionTrend';
import { TeamParticipationDistribution } from './components/analytics/TeamParticipationDistribution';
import { ProjectHealthSummary } from './components/analytics/ProjectHealthSummary';

import { API_BASE_URL } from '../../config/api';

export default function ProgrammeProgressPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Data & Loading States
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [progressRangeFilter, setProgressRangeFilter] = useState('ALL');

  // Details Drawer State
  const [selectedProject, setSelectedProject] = useState<ManagedProject | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Fetch real data from backend
  const fetchProgressData = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const token = localStorage.getItem('token');
      const [projRes, userRes] = await Promise.all([
        fetch(`${API_BASE_URL}/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!projRes.ok) {
        throw new Error('Failed to fetch projects');
      }

      const projData = await projRes.json();
      setProjects(projData.projects || []);

      if (userRes.ok) {
        const userData = await userRes.json();
        setUsers(userData.users || []);
      }
    } catch (err: any) {
      console.error('Failed to load progress data:', err);
      setFetchError('Could not retrieve programme records. Please check your connection and retry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, []);

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || 'Administrator',
    email: user?.email || 'admin@aidata.com',
    roleLabel: 'Administrator',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Safe Metric Calculations (Safe defaults: 0, 0%)
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => (p.status || '').toLowerCase() === 'active').length;
  const completedProjects = projects.filter((p) => (p.status || '').toLowerCase() === 'completed').length;
  const plannedProjects = projects.filter((p) => (p.status || '').toLowerCase() === 'planned').length;
  const onHoldProjects = projects.filter((p) => (p.status || '').toLowerCase() === 'on hold').length;

  const staffCount = users.filter((u) => u.role === 'PERMANENT_STAFF' || u.role === 'STAFF').length;
  const internCount = users.filter((u) => u.role === 'INTERN').length;
  const totalAssignedMembers = projects.reduce((sum, p) => sum + (Number(p.assignedMembersCount) || 0), 0);

  const totalWorkItemsAcrossAll = projects.reduce(
    (sum, p) => sum + (Array.isArray(p.workItems) ? p.workItems.length : 0),
    0
  );
  const completedWorkItemsAcrossAll = projects.reduce(
    (sum, p) =>
      sum +
      (Array.isArray(p.workItems)
        ? p.workItems.filter((w: any) => w.status === 'DONE' || w.status === 'Completed').length
        : 0),
    0
  );

  // Derive average overall programme progress percentage (strictly read-only)
  const overallPercent =
    totalProjects > 0
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round(
              projects.reduce((sum, p) => sum + (Number(p.progress) || 0), 0) / totalProjects
            )
          )
        )
      : 0;

  // Chart Data Shapes
  const projectStatusData = [
    { label: 'Active', count: activeProjects, color: 'bg-emerald-500', textColor: 'text-emerald-700' },
    { label: 'Planned', count: plannedProjects, color: 'bg-blue-500', textColor: 'text-blue-700' },
    { label: 'Completed', count: completedProjects, color: 'bg-indigo-500', textColor: 'text-indigo-700' },
    { label: 'On Hold', count: onHoldProjects, color: 'bg-amber-400', textColor: 'text-amber-700' },
  ];

  const progressItems = projects.map((p) => ({
    name: p.name || 'Untitled Project',
    projectId: p.projectId || '—',
    percent: Math.min(100, Math.max(0, Number(p.progress) || 0)),
  }));

  const teamData = [
    { label: 'Permanent Staff', count: staffCount, color: 'bg-blue-600', textColor: 'text-blue-700' },
    { label: 'Intern Trainees', count: internCount, color: 'bg-purple-600', textColor: 'text-purple-700' },
  ];

  // Objective delivery metrics avoiding arbitrary subjective classifications
  const objectiveDeliveryMetrics = {
    activeCount: activeProjects,
    completedCount: completedProjects,
    plannedCount: plannedProjects,
    onHoldCount: onHoldProjects,
    totalWorkItems: totalWorkItemsAcrossAll,
    completedWorkItems: completedWorkItemsAcrossAll,
  };

  // Filter projects for table presentation
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const name = (p?.name || '').toLowerCase();
      const projectId = (p?.projectId || '').toLowerCase();
      const techStack = (p?.technologyStack || '').toLowerCase();
      const query = searchQuery.trim().toLowerCase();

      const matchSearch =
        !query ||
        name.includes(query) ||
        projectId.includes(query) ||
        techStack.includes(query);

      const status = (p?.status || '').toLowerCase();
      const matchStatus =
        statusFilter === 'ALL' || status === statusFilter.toLowerCase();

      const category = (p?.category || '').toLowerCase();
      const matchCategory =
        categoryFilter === 'ALL' || category === categoryFilter.toLowerCase();

      const progress = Math.min(100, Math.max(0, Number(p?.progress) || 0));
      let matchProgress = true;
      if (progressRangeFilter === '<25') {
        matchProgress = progress < 25;
      } else if (progressRangeFilter === '25-50') {
        matchProgress = progress >= 25 && progress <= 50;
      } else if (progressRangeFilter === '51-75') {
        matchProgress = progress > 50 && progress <= 75;
      } else if (progressRangeFilter === '76-99') {
        matchProgress = progress > 75 && progress < 100;
      } else if (progressRangeFilter === '100') {
        matchProgress = progress >= 100;
      }

      return matchSearch && matchStatus && matchCategory && matchProgress;
    });
  }, [projects, searchQuery, statusFilter, categoryFilter, progressRangeFilter]);

  // Reset Filters Handler
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setProgressRangeFilter('ALL');
  };

  // Map backend object to ManagedProject shape
  const mapProjectToManaged = (p: any): ManagedProject => ({
    id: p._id || p.id || p.projectId,
    projectId: p.projectId || '—',
    name: p.name || 'Untitled Project',
    category: p.category || 'General',
    description: p.description || '',
    technologyStack: p.technologyStack || '',
    department: p.department || 'AI & Data Systems',
    projectLead: p.projectLead || 'Unassigned',
    assignedMembersCount: p.assignedMembersCount || 0,
    startDate: p.startDate || '',
    targetDate: p.targetDate || '',
    status: p.status || 'Planned',
    priority: p.priority || 'Medium',
    progress: Math.min(100, Math.max(0, Number(p.progress) || 0)),
    workItems: p.workItems || [],
    milestoneInfo: p.workItems
      ? `${p.workItems.filter((w: any) => w.status === 'DONE' || w.status === 'Completed').length} of ${p.workItems.length} work-items completed`
      : undefined,
    createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : undefined,
    updatedAt: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : undefined,
  });

  const handleOpenDetails = (proj: any) => {
    setSelectedProject(mapProjectToManaged(proj));
    setIsDetailsOpen(true);
  };

  // Helper for rendering status badges
  const getStatusBadge = (status?: string) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'active':
        return <Badge variant="success" size="sm">Active</Badge>;
      case 'completed':
        return <Badge variant="blue" size="sm">Completed</Badge>;
      case 'on hold':
        return <Badge variant="warning" size="sm">On Hold</Badge>;
      case 'planned':
        return <Badge variant="neutral" size="sm">Planned</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status || '—'}</Badge>;
    }
  };

  return (
    <DashboardLayout
      navigation={ADMIN_NAVIGATION}
      user={userDisplay}
      notificationsCount={1}
      onNotificationClick={() => {}}
      onProfileClick={() => navigate('/admin/profile')}
      onLogoutClick={handleLogout}
    >
      {/* ── Page Header ────────────────────────────────────────── */}
      <PageHeader
        title="Programme Progress"
        description="Monitor programme delivery, project completion, and contributor progress across the AI & Data portfolio."
        breadcrumbs={[
          { label: 'Administration', path: '/admin/dashboard' },
          { label: 'Programme Progress' },
        ]}
        badge={<Badge variant="blue">Admin</Badge>}
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
              onClick={fetchProgressData}
              disabled={isLoading}
            >
              Refresh Data
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* ── Error Banner ────────────────────────────────────────── */}
        {fetchError && (
          <Alert variant="error" title="Unable to load programme progress">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1.5">
              <span>{fetchError}</span>
              <Button variant="outline" size="sm" onClick={fetchProgressData}>
                Retry
              </Button>
            </div>
          </Alert>
        )}

        {/* ── Section 1: 4 Primary KPI Summary Cards ─────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Total Projects */}
          <Card padding="md" className="space-y-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md hover:border-blue-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-[var(--color-brand-blue)] flex items-center justify-center shrink-0 shadow-2xs">
                  <FolderKanban className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Total Projects</span>
              </div>
              <Badge size="sm" variant="neutral">Portfolio</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">{isLoading ? '—' : totalProjects}</p>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 pt-1 border-t border-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" aria-hidden="true" />
              AI & Data tracks in portfolio
            </p>
          </Card>

          {/* Active Projects */}
          <Card padding="md" className="space-y-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md hover:border-emerald-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-[var(--color-brand-green)] flex items-center justify-center shrink-0 shadow-2xs">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Active Projects</span>
              </div>
              <Badge size="sm" variant="success">Executing</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">{isLoading ? '—' : activeProjects}</p>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 pt-1 border-t border-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              In active execution
            </p>
          </Card>

          {/* Completed Projects */}
          <Card padding="md" className="space-y-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md hover:border-indigo-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-[var(--color-brand-blue)] flex items-center justify-center shrink-0 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Completed Projects</span>
              </div>
              <Badge size="sm" variant="blue">Delivered</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">{isLoading ? '—' : completedProjects}</p>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 pt-1 border-t border-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" aria-hidden="true" />
              Delivered deliverables
            </p>
          </Card>

          {/* Average Programme Progress */}
          <Card padding="md" className="space-y-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md hover:border-sky-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center shrink-0 shadow-2xs">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Average Progress</span>
              </div>
              <Badge size="sm" variant="blue">Read-Only</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
              {isLoading ? '—' : `${overallPercent}%`}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 pt-1 border-t border-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" aria-hidden="true" />
              Calculated from work-item weights
            </p>
          </Card>
        </div>

        {/* ── Section 2: Contributor & Delivery Summary (Secondary) ─ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/40 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Permanent Staff</p>
              <p className="text-lg font-bold text-slate-900">{isLoading ? '—' : staffCount}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-purple-100 bg-purple-50/40 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Intern Contributors</p>
              <p className="text-lg font-bold text-slate-900">{isLoading ? '—' : internCount}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Work Items Completed</p>
              <p className="text-lg font-bold text-slate-900">
                {isLoading ? '—' : `${completedWorkItemsAcrossAll} / ${totalWorkItemsAcrossAll}`}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
              <FolderKanban className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Member Allocations</p>
              <p className="text-lg font-bold text-slate-900">{isLoading ? '—' : totalAssignedMembers}</p>
            </div>
          </div>
        </div>

        {/* ── Section 3: Programme Progress Overview (Portfolio Banner) ─ */}
        <Card padding="md" className="bg-gradient-to-r from-blue-50/90 via-sky-50 to-indigo-50/70 border border-blue-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--color-brand-blue)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Overall Programme Progress Overview
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                Derived automatically across all {totalProjects} projects in the portfolio: {activeProjects} active, {completedProjects} completed, {plannedProjects} planned, {onHoldProjects} on hold.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-3xl font-extrabold text-blue-700 font-mono">
                {isLoading ? '—' : `${overallPercent}%`}
              </span>
              <Badge variant="blue" size="sm">Automated Weighting</Badge>
            </div>
          </div>
          <div className="w-full h-3 bg-white rounded-full overflow-hidden mt-3.5 border border-blue-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-sky-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${overallPercent}%` }}
              role="progressbar"
              aria-valuenow={overallPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 mt-2.5 pt-2 border-t border-blue-100">
            <span>Portfolio Status: Read-Only System Metric</span>
            <div className="flex items-center gap-4 flex-wrap">
              <span><strong>{activeProjects}</strong> Active</span>
              <span><strong>{completedProjects}</strong> Completed</span>
              <span><strong>{plannedProjects}</strong> Planned</span>
              <span><strong>{onHoldProjects}</strong> On Hold</span>
              <span><strong>{totalProjects}</strong> Total</span>
            </div>
          </div>
        </Card>

        {/* ── Section 4: Progress Policy Information Card ───────── */}
        <Card padding="md" className="border-l-4 border-l-blue-600 bg-blue-50/40 border border-blue-100 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Progress Calculation Policy
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Project progress is calculated automatically from completed work-item percentage weights.</strong> Individual completed work items contribute their predefined percentage weights to the overall project progress. Contributors do not manually edit overall progress.
              </p>
            </div>
          </div>
        </Card>

        {/* ── Section 5: Analytics Charts Grid ──────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Overall Programme Progress Gauge */}
          <Card padding="lg" className="space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <BarChart3 className="w-4 h-4 text-[var(--color-brand-blue)]" />
              <h2 className="text-sm font-bold text-slate-900">
                Programme Progress Weighting
              </h2>
            </div>
            <OverallProgrammeProgress percent={overallPercent} />
          </Card>

          {/* Card 2: Project Status Distribution */}
          <Card padding="lg" className="space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <PieChart className="w-4 h-4 text-[var(--color-brand-blue)]" />
              <h2 className="text-sm font-bold text-slate-900">
                Project Pipeline Distribution
              </h2>
            </div>
            <ProjectStatusDistribution data={projectStatusData} />
          </Card>

          {/* Card 3: Project Progress Comparison (Work Item Driven) */}
          <Card padding="lg" className="space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <BarChart2 className="w-4 h-4 text-[var(--color-brand-blue)]" />
              <h2 className="text-sm font-bold text-slate-900">
                Work-Item Progress by Project
              </h2>
            </div>
            <ProjectProgressComparison items={progressItems} />
          </Card>

          {/* Card 4: Team Allocation Distribution */}
          <Card padding="lg" className="space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Users className="w-4 h-4 text-[var(--color-brand-blue)]" />
              <h2 className="text-sm font-bold text-slate-900">
                Team Role Distribution
              </h2>
            </div>
            <TeamParticipationDistribution data={teamData} />
          </Card>

          {/* Card 5: Milestone Completion Trend (Historical Empty State) */}
          <Card padding="lg" className="space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <LineChart className="w-4 h-4 text-[var(--color-brand-blue)]" />
              <h2 className="text-sm font-bold text-slate-900">
                Milestone Velocity Trend
              </h2>
            </div>
            <MilestoneCompletionTrend />
          </Card>

          {/* Card 6: Objective Delivery Status Overview */}
          <Card padding="lg" className="space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Activity className="w-4 h-4 text-[var(--color-brand-blue)]" />
              <h2 className="text-sm font-bold text-slate-900">
                Objective Delivery Status
              </h2>
            </div>
            <ProjectHealthSummary metrics={objectiveDeliveryMetrics} />
          </Card>
        </div>

        {/* ── Section 6: Search & Filters for Project Progress Table ─ */}
        <Card padding="md" className="space-y-3 border border-[var(--color-border-subtle)] shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects by Project ID, name, or technology stack..."
                className="w-full h-10 pl-10 pr-4 text-xs sm:text-sm rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs"
                aria-label="Search projects by Project ID or name"
              />
            </div>

            {/* Filter Controls Group */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Status Filter */}
              <div className="flex-1 sm:flex-initial min-w-[130px]">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs cursor-pointer"
                  aria-label="Filter by project status"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Planned">Planned</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="flex-1 sm:flex-initial min-w-[140px]">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs cursor-pointer"
                  aria-label="Filter by project category"
                >
                  <option value="ALL">All Categories</option>
                  <option value="AI">AI</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Data Analytics">Data Analytics</option>
                  <option value="Software Development">Software Development</option>
                  <option value="Research">Research</option>
                </select>
              </div>

              {/* Progress Range Filter */}
              <div className="flex-1 sm:flex-initial min-w-[140px]">
                <select
                  value={progressRangeFilter}
                  onChange={(e) => setProgressRangeFilter(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs cursor-pointer"
                  aria-label="Filter by progress range"
                >
                  <option value="ALL">All Progress</option>
                  <option value="<25">&lt; 25%</option>
                  <option value="25-50">25% - 50%</option>
                  <option value="51-75">51% - 75%</option>
                  <option value="76-99">76% - 99%</option>
                  <option value="100">100% (Completed)</option>
                </select>
              </div>

              {/* Reset Filters */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                className="h-10 px-3 text-xs"
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* ── Section 7: Project Progress Table ──────────────────── */}
        <Card padding="none" className="overflow-hidden border border-[var(--color-border-subtle)] shadow-xs">
          {/* Table Header Row */}
          <div className="p-4 sm:px-6 sm:py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between bg-[var(--color-surface-white)]">
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-bold text-slate-900">
                Project Progress Records
              </h2>
              <Badge size="sm" variant="blue">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'}
              </Badge>
            </div>
            <span className="text-xs text-[var(--color-text-secondary)] font-medium">
              Read-Only Calculated Progress
            </span>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="py-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-[var(--color-brand-blue)] border-t-transparent rounded-full animate-spin" />
                <span>Loading programme progress records...</span>
              </div>
            ) : projects.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  icon={<FolderKanban className="w-8 h-8 text-blue-500" />}
                  title="No programme progress data available."
                  description="No programme projects are currently tracked in the portfolio."
                />
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  icon={<Search className="w-8 h-8 text-blue-500" />}
                  title="No matching projects found."
                  description="No projects match your selected filter criteria. Try resetting the filters."
                  action={
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                      onClick={handleResetFilters}
                    >
                      Reset Filters
                    </Button>
                  }
                />
              </div>
            ) : (
              <table className="w-full text-left border-collapse" aria-label="Project Progress Table">
                <thead>
                  <tr className="bg-slate-50 border-b border-[var(--color-border-subtle)] text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                    <th scope="col" className="py-3.5 px-4 sm:px-6">Project ID</th>
                    <th scope="col" className="py-3.5 px-4">Project Name</th>
                    <th scope="col" className="py-3.5 px-4">Category</th>
                    <th scope="col" className="py-3.5 px-4">Status</th>
                    <th scope="col" className="py-3.5 px-4">Overall Progress</th>
                    <th scope="col" className="py-3.5 px-4">Completed Items</th>
                    <th scope="col" className="py-3.5 px-4">Total Items</th>
                    <th scope="col" className="py-3.5 px-4">Assigned Members</th>
                    <th scope="col" className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-xs">
                  {filteredProjects.map((p) => {
                    const completedWorkItems = Array.isArray(p.workItems)
                      ? p.workItems.filter((w: any) => w.status === 'DONE' || w.status === 'Completed').length
                      : 0;
                    const totalWorkItems = Array.isArray(p.workItems) ? p.workItems.length : 0;
                    const progressPercent = Math.min(100, Math.max(0, Number(p.progress) || 0));

                    return (
                      <tr
                        key={p._id || p.projectId}
                        className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                        onClick={() => handleOpenDetails(p)}
                      >
                        {/* Project ID */}
                        <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-slate-700 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-xs">
                            {p.projectId || '—'}
                          </span>
                        </td>

                        {/* Project Name & Tech Stack */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-bold text-slate-900 group-hover:text-[var(--color-brand-blue)] transition-colors">
                            {p.name || '—'}
                          </div>
                          {p.technologyStack && (
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {p.technologyStack}
                            </p>
                          )}
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="text-slate-700 font-medium">{p.category || '—'}</span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {getStatusBadge(p.status)}
                        </td>

                        {/* Overall Progress (Bar + %) */}
                        <td className="py-3.5 px-4 min-w-[140px]">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-blue-700 font-mono">{progressPercent}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-500"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Completed Work Items */}
                        <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                          {totalWorkItems > 0 ? (
                            <span className="text-[11px]">
                              <strong className="text-blue-700 font-bold">{completedWorkItems}</strong> / {totalWorkItems} Done
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">—</span>
                          )}
                        </td>

                        {/* Total Work Items */}
                        <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                          {totalWorkItems > 0 ? (
                            <span className="text-[11px]">{totalWorkItems} items</span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">—</span>
                          )}
                        </td>

                        {/* Assigned Members */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="font-semibold">{p.assignedMembersCount || 0}</span>
                            <span className="text-slate-400 text-[11px]">assigned</span>
                          </div>
                        </td>

                        {/* Action: View Details */}
                        <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Eye className="w-3.5 h-3.5 text-blue-600" />}
                            onClick={() => handleOpenDetails(p)}
                            className="h-8 px-2.5 text-xs text-blue-700 hover:bg-blue-50 border-blue-200"
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>

      {/* ── Section 8: Slide-over Project Details Drawer (Read-Only) ─ */}
      <ProjectDetailsDrawer
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        project={selectedProject}
      />
    </DashboardLayout>
  );
}
