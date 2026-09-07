import { useState } from 'react';
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
} from 'lucide-react';
import {
  DashboardLayout,
  PageHeader,
  type NavSection,
  type UserDisplayInfo,
} from '../../components/layout/DashboardLayout';
import { Card, Button, Badge, Input, EmptyState, Alert } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { StaffWorkItemDetailsDrawer, type StaffWorkItem } from './components/StaffWorkItemDetailsDrawer';

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

export default function StaffWorkItemsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Page View Mode (board or table)
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal Dialog confirmation state
  const [confirmTransition, setConfirmTransition] = useState<{
    targetStatus: 'Not Started' | 'In Progress' | 'Completed';
  } | null>(null);

  // Notice Alert State
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
    setRoleFilter('ALL');
    setStatusFilter('ALL');
  };

  const handleStatusTransitionClick = (targetStatus: 'Not Started' | 'In Progress' | 'Completed') => {
    setConfirmTransition({ targetStatus });
  };

  const handleConfirmTransition = () => {
    setNoticeMessage('Work item status updated successfully.');
    setConfirmTransition(null);
  };

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
        description="View and manage work items assigned to you. Work-item completion automatically contributes its percentage weight to overall project progress."
        breadcrumbs={[{ label: 'Workspace' }, { label: 'My Work Items' }]}
        badge={<Badge variant="success">Permanent Staff</Badge>}
        actions={
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 focus:outline-hidden ${
                viewMode === 'board'
                  ? 'bg-white text-[var(--color-brand-navy)] shadow-xs'
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 focus:outline-hidden ${
                viewMode === 'table'
                  ? 'bg-white text-[var(--color-brand-navy)] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              aria-label="Switch to Table View"
              aria-pressed={viewMode === 'table'}
            >
              <TableProperties className="w-3.5 h-3.5" />
              Table View
            </button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Notice Alert Box */}
        {noticeMessage && (
          <Alert
            variant="success"
            title="Status Update"
            onClose={() => setNoticeMessage(null)}
          >
            {noticeMessage}
          </Alert>
        )}

        {/* ── 1. SUMMARY CARDS ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              title: 'Assigned Work Items',
              value: '—',
              subtext: 'No data available yet',
              badge: 'Work Items',
              badgeVariant: 'blue' as const,
            },
            {
              title: 'Not Started',
              value: '—',
              subtext: 'No data available yet',
              badge: 'Pending',
              badgeVariant: 'info' as const,
            },
            {
              title: 'In Progress',
              value: '—',
              subtext: 'No data available yet',
              badge: 'Active',
              badgeVariant: 'blue' as const,
            },
            {
              title: 'Completed',
              value: '—',
              subtext: 'No data available yet',
              badge: 'Archived',
              badgeVariant: 'success' as const,
            },
          ].map((card) => (
            <Card key={card.title} padding="md" className="space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  {card.title}
                </span>
                <Badge size="sm" variant={card.badgeVariant}>
                  {card.badge}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-[var(--color-brand-navy)]">
                {card.value}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {card.subtext}
              </p>
            </Card>
          ))}
        </div>

        {/* ── 2. FILTERS SECTION ───────────────────────────────── */}
        <Card padding="md" className="shadow-2xs">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Search input */}
              <div className="space-y-1 col-span-1 sm:col-span-2 md:col-span-1">
                <label htmlFor="searchQuery" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Search Work Items
                </label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <Input
                    id="searchQuery"
                    type="text"
                    placeholder="Search work items or projects"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)] placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Project Filter */}
              <div className="space-y-1">
                <label htmlFor="projectFilter" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Project
                </label>
                <select
                  id="projectFilter"
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)] text-slate-700 bg-white"
                >
                  <option value="ALL">All Projects</option>
                </select>
              </div>

              {/* Required Role Filter */}
              <div className="space-y-1">
                <label htmlFor="roleFilter" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Required Role
                </label>
                <select
                  id="roleFilter"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)] text-slate-700 bg-white"
                >
                  <option value="ALL">All Roles</option>
                  <option value="Business Analyst">Business Analyst</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="QA">QA</option>
                  <option value="AI/ML">AI/ML</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="space-y-1">
                <label htmlFor="statusFilter" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Status filter
                </label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)] text-slate-700 bg-white"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={handleResetFilters}
                aria-label="Reset filters"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* ── 3. VIEW MODE RENDERING ──────────────────────────── */}
        {viewMode === 'board' ? (
          /* ── BOARD VIEW (KANBAN) ── */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* NOT STARTED COLUMN */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <h3 className="text-xs font-bold text-[var(--color-brand-navy)] uppercase tracking-wider">
                    Not Started
                  </h3>
                </div>
                <Badge variant="neutral" size="sm">0</Badge>
              </div>
              <EmptyState
                icon={<CheckSquare className="w-6 h-6 text-slate-400" />}
                title="No work items waiting to start"
                description="Assigned work items with Not Started status will appear here once allocated."
                secondaryAction={
                  <Badge size="sm" variant="neutral">
                    No items available
                  </Badge>
                }
              />
            </div>

            {/* IN PROGRESS COLUMN */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-brand-blue)]" />
                  <h3 className="text-xs font-bold text-[var(--color-brand-navy)] uppercase tracking-wider">
                    In Progress
                  </h3>
                </div>
                <Badge variant="blue" size="sm">0</Badge>
              </div>
              <EmptyState
                icon={<TrendingUp className="w-6 h-6 text-slate-400" />}
                title="No work items in progress"
                description="Work items currently being worked on will appear here."
                secondaryAction={
                  <Badge size="sm" variant="neutral">
                    No items available
                  </Badge>
                }
              />
            </div>

            {/* COMPLETED COLUMN */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-brand-green)]" />
                  <h3 className="text-xs font-bold text-[var(--color-brand-navy)] uppercase tracking-wider">
                    Completed
                  </h3>
                </div>
                <Badge variant="success" size="sm">0</Badge>
              </div>
              <EmptyState
                icon={<History className="w-6 h-6 text-slate-400" />}
                title="No completed work items"
                description="Completed work items will appear here and contribute their assigned percentage weights to project progress."
                secondaryAction={
                  <Badge size="sm" variant="neutral">
                    No items available
                  </Badge>
                }
              />
            </div>
          </div>
        ) : (
          /* ── TABLE VIEW ── */
          <Card padding="none" className="shadow-2xs border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs border-collapse min-w-[900px]" aria-label="Assigned Work Items Table">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th scope="col" className="py-3 px-4">Work Item</th>
                    <th scope="col" className="py-3 px-4">Project</th>
                    <th scope="col" className="py-3 px-4">Required Role</th>
                    <th scope="col" className="py-3 px-4 text-center">Weight</th>
                    <th scope="col" className="py-3 px-4">Status</th>
                    <th scope="col" className="py-3 px-4 text-right">Progress Contribution</th>
                    <th scope="col" className="py-3 px-4 text-right">Target Date</th>
                    <th scope="col" className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={8} className="p-12">
                      <EmptyState
                        icon={<CheckSquare className="w-8 h-8 text-slate-400" />}
                        title="No assigned work items available"
                        description="Work items assigned to your Permanent Staff account will appear here once allocated."
                        secondaryAction={
                          <Badge size="sm" variant="neutral">
                            No items assigned
                          </Badge>
                        }
                      />
                    </td>
                  </tr>
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
        onStatusTransition={handleStatusTransitionClick}
      />

      {/* ── 5. CONFIRMATION DIALOG ────────────────────────────── */}
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
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 space-y-4 relative z-10 animate-in fade-in zoom-in-95 duration-150">
            <h3 id="confirm-dialog-title" className="text-base font-bold text-[var(--color-brand-navy)]">
              {confirmTransition.targetStatus === 'In Progress' && 'Start this work item?'}
              {confirmTransition.targetStatus === 'Completed' && 'Mark this work item as completed?'}
              {confirmTransition.targetStatus === 'Not Started' && 'Revert this work item?'}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              {confirmTransition.targetStatus === 'In Progress' &&
                'This work item will move from Not Started to In Progress.'}
              {confirmTransition.targetStatus === 'Completed' &&
                "Once completed, this work item's percentage weight will contribute to the project's overall progress."}
              {confirmTransition.targetStatus === 'Not Started' &&
                'This work item will move back to Not Started status.'}
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
                variant={confirmTransition.targetStatus === 'Completed' ? 'green' : 'primary'}
                size="sm"
                onClick={handleConfirmTransition}
              >
                {confirmTransition.targetStatus === 'In Progress' && 'Start Work'}
                {confirmTransition.targetStatus === 'Completed' && 'Confirm Completion'}
                {confirmTransition.targetStatus === 'Not Started' && 'Revert'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
