import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Activity,
  CheckCircle2,
  Clock,
  Search,
  RotateCcw,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  DashboardLayout,
  PageHeader,
  type UserDisplayInfo,
} from '../../components/layout/DashboardLayout';
import {
  Card,
  Button,
  Badge,
  EmptyState,
} from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { ADMIN_NAVIGATION } from '../../config/adminNavigation';
import { AddProjectDrawer } from './components/AddProjectDrawer';
import { ProjectDetailsDrawer } from './components/ProjectDetailsDrawer';
import type { ManagedProject } from '../../types/projectManagement.types';

export default function ProjectsManagementPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Drawer and Dialog States
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ManagedProject | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Search and Filter States (UI-level only)
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || 'Akila Liyanage',
    email: user?.email || 'admin@aidata.com',
    roleLabel: 'Administrator',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setDepartmentFilter('ALL');
  };

  return (
    <DashboardLayout
      navigation={ADMIN_NAVIGATION}
      user={userDisplay}
      notificationsCount={2}
      onNotificationClick={() => {}}
      onProfileClick={() => {}}
      onLogoutClick={handleLogout}
    >
      {/* ── Page Header ────────────────────────────────────────── */}
      <PageHeader
        title="Projects Management"
        description="Create, review and manage AI & Data programme projects from one centralized workspace."
        breadcrumbs={[
          { label: 'Administration', path: '/admin/dashboard' },
          { label: 'Projects Management' },
        ]}
        badge={<Badge variant="blue">Administrator</Badge>}
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Development-Only Preview Trigger */}
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Eye className="w-4 h-4 text-[var(--color-brand-blue)]" />}
              onClick={() => {
                setSelectedProject(null);
                setIsDetailsOpen(true);
              }}
              className="border-dashed border-blue-200 bg-blue-50/50 text-[var(--color-brand-blue)] hover:bg-blue-50 font-medium"
              title="Development-only inspection of Project Details Drawer"
              aria-label="Preview Project Details UI"
            >
              Preview Project Details UI
            </Button>

            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddProjectOpen(true)}
              aria-label="Add new project"
            >
              + Add Project
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* ── Summary Cards Area ──────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Projects */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[var(--color-brand-blue-light)] text-[var(--color-brand-blue)] flex items-center justify-center shrink-0">
                  <FolderKanban className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  Total Projects
                </span>
              </div>
              <Badge size="sm" variant="neutral">
                All Projects
              </Badge>
            </div>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)] tracking-tight">
              —
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" aria-hidden="true" />
              Awaiting data integration
            </p>
          </Card>

          {/* Card 2: Active Projects */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-green-50 text-[var(--color-brand-green)] flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  Active Projects
                </span>
              </div>
              <Badge size="sm" variant="success">
                In Execution
              </Badge>
            </div>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)] tracking-tight">
              —
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" aria-hidden="true" />
              Awaiting data integration
            </p>
          </Card>

          {/* Card 3: Completed Projects */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[var(--color-brand-blue)] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  Completed Projects
                </span>
              </div>
              <Badge size="sm" variant="blue">
                Delivered
              </Badge>
            </div>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)] tracking-tight">
              —
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" aria-hidden="true" />
              Awaiting data integration
            </p>
          </Card>

          {/* Card 4: Planned Projects */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  Planned Projects
                </span>
              </div>
              <Badge size="sm" variant="info">
                Pipeline
              </Badge>
            </div>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)] tracking-tight">
              —
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" aria-hidden="true" />
              Awaiting data integration
            </p>
          </Card>
        </div>

        {/* ── Search & Filter Toolbar ─────────────────────────── */}
        <Card padding="md" className="space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[260px]">
              <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects by name, project ID or technology"
                className="w-full h-10 pl-10 pr-4 text-xs sm:text-sm rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs"
                aria-label="Search projects by name, project ID or technology"
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
                  <option value="Planned">Planned</option>
                  <option value="Active">Active</option>
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

              {/* Department Filter */}
              <div className="flex-1 sm:flex-initial min-w-[140px]">
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs cursor-pointer"
                  aria-label="Filter by department"
                >
                  <option value="ALL">All Departments</option>
                  <option value="AI & Data Systems">AI & Data Systems</option>
                  <option value="Enterprise Network">Enterprise Network</option>
                  <option value="Software Architecture">Software Architecture</option>
                  <option value="Digital Innovation">Digital Innovation</option>
                  <option value="Programme Operations">Programme Operations</option>
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
                title="Reset all filters"
                aria-label="Reset all search filters"
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* ── Projects Table Section ──────────────────────────── */}
        <Card padding="none" className="overflow-hidden border border-[var(--color-border-subtle)]">
          {/* Table Header Row */}
          <div className="p-4 sm:px-6 sm:py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between bg-[var(--color-surface-white)]">
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-bold text-[var(--color-brand-navy)]">
                Programme Projects
              </h2>
              <Badge size="sm" variant="neutral">
                0 Registered
              </Badge>
            </div>
            <span className="text-xs text-[var(--color-text-secondary)] font-medium">
              Awaiting backend integration
            </span>
          </div>

          {/* Table Container with Horizontal Scroll */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" aria-label="Programme Projects Table">
              <thead>
                <tr className="bg-[var(--color-surface-subtle)]/70 border-b border-[var(--color-border-subtle)] text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4 sm:px-6">Project</th>
                  <th scope="col" className="py-3 px-4">Project ID</th>
                  <th scope="col" className="py-3 px-4">Category</th>
                  <th scope="col" className="py-3 px-4">Technology / Stack</th>
                  <th scope="col" className="py-3 px-4">Project Lead</th>
                  <th scope="col" className="py-3 px-4">Assigned Members</th>
                  <th scope="col" className="py-3 px-4">Start Date</th>
                  <th scope="col" className="py-3 px-4">Target Date</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4">Progress</th>
                  <th scope="col" className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-subtle)] bg-[var(--color-surface-white)]">
                {/* Empty State when no backend data is connected */}
                <tr>
                  <td colSpan={11} className="p-8">
                    <EmptyState
                      icon={<FolderKanban className="w-6 h-6 text-[var(--color-brand-blue)]" />}
                      title="No project data available"
                      description="Programme projects will appear here once the project management service is connected."
                      action={
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Plus className="w-4 h-4" />}
                          onClick={() => setIsAddProjectOpen(true)}
                        >
                          + Add First Project
                        </Button>
                      }
                      secondaryAction={
                        <Badge size="sm" variant="neutral">
                          Awaiting backend integration
                        </Badge>
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── Large Dataset Pagination UI (Neutral/Disabled State) ── */}
          <div className="p-4 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--color-surface-subtle)]/40 text-xs">
            <span className="text-[var(--color-text-secondary)] font-medium">
              Showing <strong className="text-[var(--color-brand-navy)]">—</strong> of{' '}
              <strong className="text-[var(--color-brand-navy)]">—</strong> projects
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled
                leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
                className="h-8 px-2.5 text-xs opacity-50 cursor-not-allowed"
                aria-label="Previous page"
              >
                Previous
              </Button>
              <button
                type="button"
                disabled
                className="w-8 h-8 rounded-lg bg-[var(--color-surface-white)] border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] font-semibold text-xs flex items-center justify-center cursor-not-allowed"
                aria-label="Page 1"
              >
                1
              </button>
              <button
                type="button"
                disabled
                className="w-8 h-8 rounded-lg bg-transparent text-[var(--color-text-muted)] font-medium text-xs flex items-center justify-center cursor-not-allowed"
                aria-label="Page 2"
              >
                2
              </button>
              <button
                type="button"
                disabled
                className="w-8 h-8 rounded-lg bg-transparent text-[var(--color-text-muted)] font-medium text-xs flex items-center justify-center cursor-not-allowed"
                aria-label="Page 3"
              >
                3
              </button>
              <span className="px-1 text-[var(--color-text-muted)]">…</span>
              <Button
                variant="outline"
                size="sm"
                disabled
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                className="h-8 px-2.5 text-xs opacity-50 cursor-not-allowed"
                aria-label="Next page"
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Add Project Drawer ───────────────────────────────── */}
      <AddProjectDrawer
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
      />

      {/* ── Project Details Drawer ───────────────────────────── */}
      <ProjectDetailsDrawer
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
      />
    </DashboardLayout>
  );
}
