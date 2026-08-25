import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCheck,
  Users,
  GraduationCap,
  FolderKanban,
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
import { CreateAssignmentDrawer } from './components/CreateAssignmentDrawer';
import { AssignmentDetailsDrawer } from './components/AssignmentDetailsDrawer';
import type { ManagedAssignment } from '../../types/assignmentManagement.types';

export default function ProjectAssignmentsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Drawer and Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<ManagedAssignment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Search and Filter States (UI-level only)
  const [searchQuery, setSearchQuery] = useState('');
  const [projectStatusFilter, setProjectStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [assignmentStatusFilter, setAssignmentStatusFilter] = useState('ALL');
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
    setProjectStatusFilter('ALL');
    setCategoryFilter('ALL');
    setAssignmentStatusFilter('ALL');
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
        title="Project Assignments"
        description="Assign Permanent Staff and Intern users to programme projects and review current allocation structure."
        breadcrumbs={[
          { label: 'Administration', path: '/admin/dashboard' },
          { label: 'Project Assignments' },
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
                setSelectedAssignment(null);
                setIsDetailsOpen(true);
              }}
              className="border-dashed border-blue-200 bg-blue-50/50 text-[var(--color-brand-blue)] hover:bg-blue-50 font-medium"
              title="Development-only inspection of Assignment Details Drawer"
              aria-label="Preview Assignment Details UI"
            >
              Preview Assignment Details UI
            </Button>

            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsCreateOpen(true)}
              aria-label="Create project assignment"
            >
              + Create Assignment
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* ── Summary Cards Area ──────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Assignments */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[var(--color-brand-blue-light)] text-[var(--color-brand-blue)] flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  Total Assignments
                </span>
              </div>
              <Badge size="sm" variant="neutral">
                All Allocations
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

          {/* Card 2: Assigned Staff */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[var(--color-brand-blue)] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  Assigned Staff
                </span>
              </div>
              <Badge size="sm" variant="blue">
                Permanent Staff
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

          {/* Card 3: Assigned Interns */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-green-50 text-[var(--color-brand-green)] flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  Assigned Interns
                </span>
              </div>
              <Badge size="sm" variant="success">
                Intern Pool
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

          {/* Card 4: Unassigned Projects */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <FolderKanban className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  Unassigned Projects
                </span>
              </div>
              <Badge size="sm" variant="warning">
                Needs Allocation
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
                placeholder="Search by project, user, ID or role"
                className="w-full h-10 pl-10 pr-4 text-xs sm:text-sm rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs"
                aria-label="Search by project, user, ID or role"
              />
            </div>

            {/* Filter Controls Group */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Project Status Filter */}
              <div className="flex-1 sm:flex-initial min-w-[130px]">
                <select
                  value={projectStatusFilter}
                  onChange={(e) => setProjectStatusFilter(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs cursor-pointer"
                  aria-label="Filter by project status"
                >
                  <option value="ALL">All Projects</option>
                  <option value="Planned">Planned</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* User Category Filter */}
              <div className="flex-1 sm:flex-initial min-w-[140px]">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs cursor-pointer"
                  aria-label="Filter by user category"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Permanent Staff">Permanent Staff</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>

              {/* Assignment Status Filter */}
              <div className="flex-1 sm:flex-initial min-w-[140px]">
                <select
                  value={assignmentStatusFilter}
                  onChange={(e) => setAssignmentStatusFilter(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs cursor-pointer"
                  aria-label="Filter by assignment status"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
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

        {/* ── Assignments Table Section ───────────────────────── */}
        <Card padding="none" className="overflow-hidden border border-[var(--color-border-subtle)]">
          {/* Table Header Row */}
          <div className="p-4 sm:px-6 sm:py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between bg-[var(--color-surface-white)]">
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-bold text-[var(--color-brand-navy)]">
                Project Assignments
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
            <table className="w-full text-left border-collapse" aria-label="Project Assignments Table">
              <thead>
                <tr className="bg-[var(--color-surface-subtle)]/70 border-b border-[var(--color-border-subtle)] text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4 sm:px-6">Project</th>
                  <th scope="col" className="py-3 px-4">Project ID</th>
                  <th scope="col" className="py-3 px-4">Assigned User</th>
                  <th scope="col" className="py-3 px-4">User ID</th>
                  <th scope="col" className="py-3 px-4">Category</th>
                  <th scope="col" className="py-3 px-4">Professional Role</th>
                  <th scope="col" className="py-3 px-4">Assignment Role</th>
                  <th scope="col" className="py-3 px-4">Assignment Date</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-subtle)] bg-[var(--color-surface-white)]">
                {/* Empty State when no backend data is connected */}
                <tr>
                  <td colSpan={10} className="p-8">
                    <EmptyState
                      icon={<UserCheck className="w-6 h-6 text-[var(--color-brand-blue)]" />}
                      title="No assignment data available"
                      description="Project assignments will appear here once project and user data services are connected."
                      action={
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Plus className="w-4 h-4" />}
                          onClick={() => setIsCreateOpen(true)}
                        >
                          + Create First Assignment
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
              <strong className="text-[var(--color-brand-navy)]">—</strong> assignments
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

      {/* ── Create Assignment Drawer ─────────────────────────── */}
      <CreateAssignmentDrawer
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* ── Assignment Details Drawer ─────────────────────────── */}
      <AssignmentDetailsDrawer
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedAssignment(null);
        }}
        assignment={selectedAssignment}
      />
    </DashboardLayout>
  );
}
