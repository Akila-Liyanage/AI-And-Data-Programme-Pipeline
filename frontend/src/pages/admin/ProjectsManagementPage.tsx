/**
 * ProjectsManagementPage.tsx
 *
 * MODERN LIGHT BLUE PROJECTS MANAGEMENT CONSOLE
 * Features:
 * - Live MongoDB synchronization (GET /api/projects, POST /api/projects)
 * - Dynamic KPI summary statistics derived from real database records
 * - Search, category, status, and department filtering
 * - Work item count & overall progress bar for each project
 * - Slide-over Project Details Drawer & Add Project Drawer
 */
import { useState, useEffect } from 'react';
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
  Edit3,
  Trash2,
  RefreshCw,
  User,
  Users,
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
  Alert,
  EmptyState,
} from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { ADMIN_NAVIGATION } from '../../config/adminNavigation';
import { AddProjectDrawer } from './components/AddProjectDrawer';
import { ProjectDetailsDrawer } from './components/ProjectDetailsDrawer';
import { EditProjectDrawer } from './components/EditProjectDrawer';
import { DeleteProjectModal } from './components/DeleteProjectModal';
import type { ManagedProject } from '../../types/projectManagement.types';

import { API_BASE_URL } from '../../config/api';

export default function ProjectsManagementPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Data & Loading States
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Drawer & Modal States
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ManagedProject | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Edit Drawer State
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState<ManagedProject | null>(null);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);

  // Delete Modal State
  const [selectedProjectForDelete, setSelectedProjectForDelete] = useState<ManagedProject | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Status Notification Banner
  const [alertNotice, setAlertNotice] = useState<{
    type: 'info' | 'error' | 'success';
    title: string;
    message: string;
  } | null>(null);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  // Fetch real projects from backend
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects in memory
  const filteredProjects = projects.filter((p) => {
    const name = p?.name || '';
    const projectId = p?.projectId || '';
    const techStack = p?.technologyStack || '';
    const projectLead = p?.projectLead || '';
    const status = p?.status || '';
    const category = p?.category || '';
    const department = p?.department || '';

    const matchSearch =
      !searchQuery.trim() ||
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      projectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      techStack.toLowerCase().includes(searchQuery.toLowerCase()) ||
      projectLead.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || status.toLowerCase() === statusFilter.toLowerCase();
    const matchCategory = categoryFilter === 'ALL' || category.toLowerCase() === categoryFilter.toLowerCase();
    const matchDept = departmentFilter === 'ALL' || department.toLowerCase() === departmentFilter.toLowerCase();

    return matchSearch && matchStatus && matchCategory && matchDept;
  });

  // Calculate live statistics
  const totalCount = projects.length;
  const ongoingCount = projects.filter((p) => {
    const s = (p?.status || '').toLowerCase();
    return s === 'ongoing' || s === 'active';
  }).length;
  const completedCount = projects.filter(
    (p) => (p?.status || '').toLowerCase() === 'completed'
  ).length;
  const onHoldCount = projects.filter(
    (p) => (p?.status || '').toLowerCase() === 'on hold'
  ).length;
  const notStartedCount = projects.filter((p) => {
    const s = (p?.status || '').toLowerCase();
    return s === 'not started' || s === 'planned';
  }).length;

  const mapProjectToManaged = (p: any): ManagedProject => ({
    id: p._id || p.id,
    projectId: p.projectId,
    name: p.name,
    category: p.category,
    description: p.description || '',
    technologyStack: p.technologyStack || '',
    department: p.department,
    projectLead: p.projectLead || 'Unassigned',
    assignedMembersCount: p.assignedMembersCount || 0,
    startDate: p.startDate,
    targetDate: p.targetDate,
    status: p.status,
    priority: p.priority || 'Medium',
    progress: p.progress || 0,
    workItems: p.workItems || [],
    milestoneInfo: p.workItems
      ? `${p.workItems.filter((w: any) => w.status === 'DONE' || w.status === 'Completed').length} of ${p.workItems.length} work-items completed`
      : undefined,
    createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : undefined,
    updatedAt: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : undefined,
  });

  const handleOpenDetails = (p: any) => {
    setSelectedProject(mapProjectToManaged(p));
    setIsDetailsOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setSelectedProjectForEdit(mapProjectToManaged(p));
    setIsEditProjectOpen(true);
  };

  const handleOpenDelete = (p: any) => {
    setSelectedProjectForDelete(mapProjectToManaged(p));
    setIsDeleteModalOpen(true);
  };

  const handleProjectUpdated = (updatedProject: ManagedProject) => {
    setProjects((prev) =>
      prev.map((item) =>
        item.projectId === updatedProject.projectId ? { ...item, ...updatedProject } : item
      )
    );
    setAlertNotice({
      type: 'success',
      title: 'Project Updated',
      message: `Project ${updatedProject.name} updated successfully.`,
    });
  };

  const handleProjectDeleted = (deletedProjectId: string) => {
    setProjects((prev) => prev.filter((p) => p.projectId !== deletedProjectId));
    setAlertNotice({
      type: 'success',
      title: 'Project Deleted',
      message: `Project record has been permanently removed.`,
    });
  };

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

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'ongoing':
      case 'active':
        return <Badge variant="success" size="sm">Ongoing</Badge>;
      case 'completed':
        return <Badge variant="blue" size="sm">Completed</Badge>;
      case 'on hold':
        return <Badge variant="warning" size="sm">On Hold</Badge>;
      case 'cancelled':
        return <Badge variant="neutral" size="sm">Cancelled</Badge>;
      case 'not started':
      case 'planned':
      default:
        return <Badge variant="neutral" size="sm">Not Started</Badge>;
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
        title="Projects Management"
        description="Create, monitor, and manage AI & Data programme projects, track work-item progress, and inspect technical specifications."
        breadcrumbs={[
          { label: 'Administration', path: '/admin/dashboard' },
          { label: 'Projects Management' },
        ]}
        badge={<Badge variant="blue">Programme Projects</Badge>}
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
              onClick={fetchProjects}
              disabled={isLoading}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddProjectOpen(true)}
            >
              Add Project
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Status Notification Alert */}
        {alertNotice && (
          <Alert
            variant={alertNotice.type}
            title={alertNotice.title}
            onClose={() => setAlertNotice(null)}
          >
            {alertNotice.message}
          </Alert>
        )}

        {/* ── Summary KPI Cards Area ────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Projects */}
          <Card padding="md" className="space-y-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-blue-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-[var(--color-brand-blue)] flex items-center justify-center shrink-0 shadow-2xs">
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
            <p className="text-2xl font-bold text-slate-900 tracking-tight">
              {isLoading ? '—' : totalCount}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 pt-1 border-t border-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" aria-hidden="true" />
              Active programme tracks
            </p>
          </Card>

          {/* Card 2: Ongoing / Active Projects */}
          <Card padding="md" className="space-y-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-blue-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-[var(--color-status-success)] flex items-center justify-center shrink-0 shadow-2xs">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  Ongoing Projects
                </span>
              </div>
              <Badge size="sm" variant="success">
                In Execution
              </Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">
              {isLoading ? '—' : ongoingCount}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 pt-1 border-t border-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              Ongoing milestones
            </p>
          </Card>

          {/* Card 3: Completed Projects */}
          <Card padding="md" className="space-y-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-blue-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-[var(--color-brand-blue)] flex items-center justify-center shrink-0 shadow-2xs">
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
            <p className="text-2xl font-bold text-slate-900 tracking-tight">
              {isLoading ? '—' : completedCount}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 pt-1 border-t border-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" aria-hidden="true" />
              Verified deliveries
            </p>
          </Card>

          {/* Card 4: Not Started / Pipeline */}
          <Card padding="md" className="space-y-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-blue-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  Not Started / Hold
                </span>
              </div>
              <Badge size="sm" variant="info">
                Pipeline ({notStartedCount + onHoldCount})
              </Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">
              {isLoading ? '—' : notStartedCount}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 pt-1 border-t border-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" aria-hidden="true" />
              Not started ({notStartedCount}) • On Hold ({onHoldCount})
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
                placeholder="Search projects by name, project ID, lead, or stack..."
                className="w-full h-10 pl-10 pr-4 text-xs sm:text-sm rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs"
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
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Not Started">Not Started</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="flex-1 sm:flex-initial min-w-[140px]">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs cursor-pointer"
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
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* ── Projects Table Section ──────────────────────────── */}
        <Card padding="none" className="overflow-hidden border border-[var(--color-border-subtle)] shadow-xs">
          {/* Table Header Row */}
          <div className="p-4 sm:px-6 sm:py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between bg-[var(--color-surface-white)]">
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-bold text-slate-900">
                Programme Projects
              </h2>
              <Badge size="sm" variant="blue">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'}
              </Badge>
            </div>
            <span className="text-xs text-[var(--color-text-secondary)] font-medium">
              Live MongoDB synchronization
            </span>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="py-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-[var(--color-brand-blue)] border-t-transparent rounded-full animate-spin" />
                <span>Loading programme projects from database...</span>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  icon={<FolderKanban className="w-8 h-8 text-blue-500" />}
                  title="No matching projects found"
                  description={
                    searchQuery || statusFilter !== 'ALL' || categoryFilter !== 'ALL' || departmentFilter !== 'ALL'
                      ? 'No projects match your current filters. Try resetting the search filters.'
                      : 'No projects have been created yet. Click below to add your first programme project.'
                  }
                  action={
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Plus className="w-4 h-4" />}
                      onClick={() => setIsAddProjectOpen(true)}
                    >
                      Add New Project
                    </Button>
                  }
                />
              </div>
            ) : (
              <table className="w-full text-left border-collapse" aria-label="Programme Projects Table">
                <thead>
                  <tr className="bg-slate-50 border-b border-[var(--color-border-subtle)] text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                    <th scope="col" className="py-3.5 px-4 sm:px-6">Project Name</th>
                    <th scope="col" className="py-3.5 px-4">Project ID</th>
                    <th scope="col" className="py-3.5 px-4">Category</th>
                    <th scope="col" className="py-3.5 px-4">Project Lead</th>
                    <th scope="col" className="py-3.5 px-4">Allocated Team</th>
                    <th scope="col" className="py-3.5 px-4">Status</th>
                    <th scope="col" className="py-3.5 px-4">Work Items</th>
                    <th scope="col" className="py-3.5 px-4">Progress</th>
                    <th scope="col" className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-xs">
                  {filteredProjects.map((p) => {
                    const completedWorkItems = p.workItems ? p.workItems.filter((w: any) => w.status === 'DONE').length : 0;
                    const totalWorkItems = p.workItems ? p.workItems.length : 0;
                    const progressPercent = p.progress || 0;

                    return (
                      <tr
                        key={p._id || p.projectId}
                        className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                        onClick={() => handleOpenDetails(p)}
                      >
                        {/* Name & Tech Stack */}
                        <td className="py-3.5 px-4 sm:px-6 max-w-xs">
                          <div className="font-bold text-slate-900 group-hover:text-[var(--color-brand-blue)] transition-colors">
                            {p.name}
                          </div>
                          {p.technologyStack && (
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {p.technologyStack}
                            </p>
                          )}
                        </td>

                        {/* Project ID */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                            {p.projectId}
                          </span>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span className="text-slate-700 font-medium">{p.category}</span>
                        </td>

                        {/* Lead */}
                        <td className="py-3.5 px-4 text-slate-800 font-medium">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{p.projectLead || 'Unassigned'}</span>
                          </div>
                        </td>

                        {/* Members Count */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1 text-slate-700">
                            <Users className="w-3.5 h-3.5 text-blue-600" />
                            <span className="font-semibold">{p.assignedMembersCount || 0}</span>
                            <span className="text-slate-400 text-[11px]">assigned</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          {getStatusBadge(p.status)}
                        </td>

                        {/* Work Items */}
                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          {totalWorkItems > 0 ? (
                            <span className="text-[11px]">
                              <strong className="text-blue-700 font-bold">{completedWorkItems}</strong> / {totalWorkItems} Done
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">—</span>
                          )}
                        </td>

                        {/* Progress */}
                        <td className="py-3.5 px-4 min-w-[120px]">
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

                        {/* Actions */}
                        <td className="py-3.5 px-4 sm:px-6 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5 flex-nowrap">
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<Eye className="w-3.5 h-3.5 text-blue-600" />}
                              onClick={() => handleOpenDetails(p)}
                              title="View Project Details"
                            >
                              <span className="hidden xl:inline">Details</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<Edit3 className="w-3.5 h-3.5 text-slate-600" />}
                              onClick={() => handleOpenEdit(p)}
                              title="Edit Project Specifications"
                            >
                              <span className="hidden xl:inline">Edit</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 text-rose-600 border-rose-200"
                              leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
                              onClick={() => handleOpenDelete(p)}
                              title="Delete Project"
                            >
                              <span className="hidden xl:inline">Delete</span>
                            </Button>
                          </div>
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

      {/* ── Slide-Over Drawers & Confirmation Modals ─────────── */}
      <ProjectDetailsDrawer
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        project={selectedProject}
        onEdit={(proj) => {
          setIsDetailsOpen(false);
          setSelectedProjectForEdit(proj);
          setIsEditProjectOpen(true);
        }}
        onDelete={(proj) => {
          setIsDetailsOpen(false);
          setSelectedProjectForDelete(proj);
          setIsDeleteModalOpen(true);
        }}
      />

      <AddProjectDrawer
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
        onProjectCreated={fetchProjects}
      />

      <EditProjectDrawer
        isOpen={isEditProjectOpen}
        onClose={() => setIsEditProjectOpen(false)}
        project={selectedProjectForEdit}
        onProjectUpdated={handleProjectUpdated}
      />

      <DeleteProjectModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        project={selectedProjectForDelete}
        onProjectDeleted={handleProjectDeleted}
      />
    </DashboardLayout>
  );
}
