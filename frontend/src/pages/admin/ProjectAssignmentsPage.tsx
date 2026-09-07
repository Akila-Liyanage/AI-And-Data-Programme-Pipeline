/**
 * ProjectAssignmentsPage.tsx
 *
 * MODERN LIGHT BLUE PROJECT ASSIGNMENTS CONSOLE
 * Features:
 * - Live MongoDB synchronization (GET /api/assignments, POST /api/assignments)
 * - Dynamic KPI summary statistics derived from real assignments
 * - Search, project, user category, and status filtering
 * - Interactive slide-over Assignment Details & Create Assignment Drawers
 */
import { useState, useEffect } from 'react';
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
  Edit3,
  Trash2,
  RefreshCw,
  Calendar,
  Building,
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
import { CreateAssignmentDrawer } from './components/CreateAssignmentDrawer';
import { AssignmentDetailsDrawer } from './components/AssignmentDetailsDrawer';
import { EditAssignmentDrawer } from './components/EditAssignmentDrawer';
import { RemoveAssignmentModal } from './components/RemoveAssignmentModal';
import type { ManagedAssignment } from '../../types/assignmentManagement.types';

const API_BASE_URL = 'http://localhost:5000/api';

export default function ProjectAssignmentsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Data & Loading States
  const [assignments, setAssignments] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Drawer & Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<ManagedAssignment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Edit Drawer State
  const [selectedAssignmentForEdit, setSelectedAssignmentForEdit] = useState<ManagedAssignment | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Remove Modal State
  const [selectedAssignmentForRemove, setSelectedAssignmentForRemove] = useState<ManagedAssignment | null>(null);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  // Status Notification Banner
  const [alertNotice, setAlertNotice] = useState<{
    type: 'info' | 'error' | 'success';
    title: string;
    message: string;
  } | null>(null);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Fetch real assignments and projects from backend
  const fetchAssignmentsData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [asgRes, projRes] = await Promise.all([
        fetch(`${API_BASE_URL}/assignments`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const asgData = await asgRes.json();
      const projData = await projRes.json();

      if (asgRes.ok) {
        setAssignments(asgData.assignments || []);
      }
      if (projRes.ok) {
        setProjects(projData.projects || []);
      }
    } catch (err) {
      console.error('Failed to load assignments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignmentsData();
  }, []);

  // Filter assignments in memory
  const filteredAssignments = assignments.filter((a) => {
    const projectName = a?.projectName || '';
    const projectId = a?.projectId || '';
    const userName = a?.userName || '';
    const userId = a?.userId || '';
    const assignmentRole = a?.assignmentRole || '';
    const userCategory = a?.userCategory || '';
    const status = a?.status || '';

    const matchSearch =
      !searchQuery.trim() ||
      projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      projectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignmentRole.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory =
      categoryFilter === 'ALL' ||
      userCategory.toLowerCase().includes(categoryFilter.toLowerCase());

    const matchStatus =
      statusFilter === 'ALL' || status.toLowerCase() === statusFilter.toLowerCase();

    return matchSearch && matchCategory && matchStatus;
  });

  // Calculate live statistics
  const totalAssignments = assignments.length;
  const staffAssignments = assignments.filter((a) => (a?.userCategory || '').includes('Staff')).length;
  const internAssignments = assignments.filter((a) => (a?.userCategory || '').includes('Intern')).length;
  const unassignedProjectsCount = projects.filter((p) => (p.assignedMembersCount || 0) === 0).length;

  const mapAssignmentToManaged = (a: any): ManagedAssignment => ({
    id: a.assignmentId || a._id || a.id,
    projectName: a.projectName,
    projectId: a.projectId,
    userName: a.userName,
    userId: a.userId,
    userCategory: a.userCategory,
    professionalRole: a.professionalRole,
    assignmentRole: a.assignmentRole,
    startDate: a.startDate,
    expectedEndDate: a.expectedEndDate,
    allocationNotes: a.allocationNotes,
    status: a.status,
    projectLead: a.projectLead,
    department: a.department,
    projectStatus: a.projectStatus,
    createdAt: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : undefined,
    updatedAt: a.updatedAt ? new Date(a.updatedAt).toLocaleDateString() : undefined,
  });

  const handleOpenDetails = (a: any) => {
    setSelectedAssignment(mapAssignmentToManaged(a));
    setIsDetailsOpen(true);
  };

  const handleOpenEdit = (a: any) => {
    setSelectedAssignmentForEdit(mapAssignmentToManaged(a));
    setIsEditOpen(true);
  };

  const handleOpenRemove = (a: any) => {
    setSelectedAssignmentForRemove(mapAssignmentToManaged(a));
    setIsRemoveOpen(true);
  };

  const handleAssignmentUpdated = (updated: ManagedAssignment) => {
    setAssignments((prev) =>
      prev.map((item) =>
        item._id === updated.id || item.assignmentId === updated.id
          ? { ...item, ...updated }
          : item
      )
    );
    fetchAssignmentsData();
    setAlertNotice({
      type: 'success',
      title: 'Assignment Updated',
      message: `Project allocation for ${updated.userName} on ${updated.projectName} has been updated.`,
    });
  };

  const handleAssignmentRemoved = (removedIdentifier: string) => {
    setAssignments((prev) =>
      prev.filter((item) => item._id !== removedIdentifier && item.assignmentId !== removedIdentifier)
    );
    fetchAssignmentsData();
    setAlertNotice({
      type: 'success',
      title: 'Assignment Removed',
      message: `Project allocation has been removed successfully.`,
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
    setCategoryFilter('ALL');
    setStatusFilter('ALL');
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
        title="Project Assignments"
        description="Allocate Permanent Staff and Intern members to programme projects and oversee team responsibility distribution."
        breadcrumbs={[
          { label: 'Administration', path: '/admin/dashboard' },
          { label: 'Project Assignments' },
        ]}
        badge={<Badge variant="blue">Resource Allocation</Badge>}
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
              onClick={fetchAssignmentsData}
              disabled={isLoading}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsCreateOpen(true)}
            >
              Create Assignment
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
          {/* Card 1: Total Assignments */}
          <Card padding="md" className="space-y-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-blue-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-[var(--color-brand-blue)] flex items-center justify-center shrink-0 shadow-2xs">
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
            <p className="text-2xl font-bold text-slate-900 tracking-tight">
              {isLoading ? '—' : totalAssignments}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 pt-1 border-t border-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" aria-hidden="true" />
              Active team allocations
            </p>
          </Card>

          {/* Card 2: Assigned Staff */}
          <Card padding="md" className="space-y-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-blue-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-[var(--color-brand-blue)] flex items-center justify-center shrink-0 shadow-2xs">
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
            <p className="text-2xl font-bold text-slate-900 tracking-tight">
              {isLoading ? '—' : staffAssignments}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 pt-1 border-t border-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" aria-hidden="true" />
              Supervisors & Leads
            </p>
          </Card>

          {/* Card 3: Assigned Interns */}
          <Card padding="md" className="space-y-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-blue-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center shrink-0 shadow-2xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  Assigned Interns
                </span>
              </div>
              <Badge size="sm" variant="neutral">
                Intern Pool
              </Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">
              {isLoading ? '—' : internAssignments}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 pt-1 border-t border-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" aria-hidden="true" />
              Track contributors
            </p>
          </Card>

          {/* Card 4: Unassigned Projects */}
          <Card padding="md" className="space-y-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-amber-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <FolderKanban className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  Unassigned Projects
                </span>
              </div>
              <Badge size="sm" variant={unassignedProjectsCount > 0 ? 'warning' : 'neutral'}>
                {unassignedProjectsCount > 0 ? 'Needs Staffing' : 'All Staffed'}
              </Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">
              {isLoading ? '—' : unassignedProjectsCount}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 pt-1 border-t border-slate-100">
              <span className={`w-1.5 h-1.5 rounded-full ${unassignedProjectsCount > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`} aria-hidden="true" />
              {unassignedProjectsCount > 0 ? 'Awaiting assignment' : 'All streams staffed'}
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
                placeholder="Search by team member, project, or role..."
                className="w-full h-10 pl-10 pr-4 text-xs sm:text-sm rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs"
              />
            </div>

            {/* Filter Controls Group */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Category Filter */}
              <div className="flex-1 sm:flex-initial min-w-[150px]">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs cursor-pointer"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Staff">Permanent Staff</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex-1 sm:flex-initial min-w-[140px]">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
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

        {/* ── Assignments Table Section ───────────────────────── */}
        <Card padding="none" className="overflow-hidden border border-[var(--color-border-subtle)] shadow-xs">
          {/* Table Header Row */}
          <div className="p-4 sm:px-6 sm:py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between bg-[var(--color-surface-white)]">
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-bold text-slate-900">
                Active Project Assignments
              </h2>
              <Badge size="sm" variant="blue">
                {filteredAssignments.length} {filteredAssignments.length === 1 ? 'Assignment' : 'Assignments'}
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
                <span>Loading project assignments from database...</span>
              </div>
            ) : filteredAssignments.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  icon={<UserCheck className="w-8 h-8 text-blue-500" />}
                  title="No assignments found"
                  description={
                    searchQuery || categoryFilter !== 'ALL' || statusFilter !== 'ALL'
                      ? 'No assignments match your filter criteria. Try resetting the filters.'
                      : 'No team assignments have been made yet. Click below to create your first allocation.'
                  }
                  action={
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Plus className="w-4 h-4" />}
                      onClick={() => setIsCreateOpen(true)}
                    >
                      Create Assignment
                    </Button>
                  }
                />
              </div>
            ) : (
              <table className="w-full text-left border-collapse" aria-label="Project Assignments Table">
                <thead>
                  <tr className="bg-slate-50 border-b border-[var(--color-border-subtle)] text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                    <th scope="col" className="py-3.5 px-4 sm:px-6">Team Member</th>
                    <th scope="col" className="py-3.5 px-4">Category</th>
                    <th scope="col" className="py-3.5 px-4">Assigned Project</th>
                    <th scope="col" className="py-3.5 px-4">Assignment Role</th>
                    <th scope="col" className="py-3.5 px-4">Timeline</th>
                    <th scope="col" className="py-3.5 px-4">Status</th>
                    <th scope="col" className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-xs">
                  {filteredAssignments.map((a) => {
                    const isStaff = a.userCategory.includes('Staff');

                    return (
                      <tr
                        key={a._id || a.assignmentId}
                        className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                        onClick={() => handleOpenDetails(a)}
                      >
                        {/* Member Name & ID */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isStaff ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700'}`}>
                              {isStaff ? <Building className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 group-hover:text-[var(--color-brand-blue)] transition-colors">
                                {a.userName}
                              </span>
                              <p className="text-[11px] text-slate-500 font-mono">
                                {a.userId} • {a.professionalRole}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <Badge size="sm" variant={isStaff ? 'success' : 'neutral'}>
                            {a.userCategory}
                          </Badge>
                        </td>

                        {/* Project */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-semibold text-slate-900">
                            {a.projectName}
                          </div>
                          <span className="font-mono text-[10px] text-slate-500">
                            {a.projectId}
                          </span>
                        </td>

                        {/* Assignment Role */}
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                            {a.assignmentRole}
                          </span>
                        </td>

                        {/* Timeline */}
                        <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{a.startDate} {a.expectedEndDate ? `→ ${a.expectedEndDate}` : ''}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <Badge size="sm" variant={a.status === 'Assigned' ? 'success' : a.status === 'Completed' ? 'blue' : 'warning'}>
                            {a.status}
                          </Badge>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 sm:px-6 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5 flex-nowrap">
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<Eye className="w-3.5 h-3.5 text-blue-600" />}
                              onClick={() => handleOpenDetails(a)}
                              title="View Assignment Details"
                            >
                              <span className="hidden xl:inline">Details</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<Edit3 className="w-3.5 h-3.5 text-slate-600" />}
                              onClick={() => handleOpenEdit(a)}
                              title="Edit Assignment"
                            >
                              <span className="hidden xl:inline">Edit</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 text-rose-600 border-rose-200"
                              leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
                              onClick={() => handleOpenRemove(a)}
                              title="Remove Assignment"
                            >
                              <span className="hidden xl:inline">Remove</span>
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
      <AssignmentDetailsDrawer
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        assignment={selectedAssignment}
        onEdit={(asg) => {
          setIsDetailsOpen(false);
          setSelectedAssignmentForEdit(asg);
          setIsEditOpen(true);
        }}
        onRemove={(asg) => {
          setIsDetailsOpen(false);
          setSelectedAssignmentForRemove(asg);
          setIsRemoveOpen(true);
        }}
      />

      <CreateAssignmentDrawer
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAssignmentCreated={fetchAssignmentsData}
      />

      <EditAssignmentDrawer
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        assignment={selectedAssignmentForEdit}
        existingAssignments={assignments}
        onAssignmentUpdated={handleAssignmentUpdated}
      />

      <RemoveAssignmentModal
        isOpen={isRemoveOpen}
        onClose={() => setIsRemoveOpen(false)}
        assignment={selectedAssignmentForRemove}
        onAssignmentRemoved={handleAssignmentRemoved}
      />
    </DashboardLayout>
  );
}
