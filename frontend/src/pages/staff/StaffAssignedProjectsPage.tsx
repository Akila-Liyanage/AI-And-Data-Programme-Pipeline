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
} from 'lucide-react';
import {
  DashboardLayout,
  PageHeader,
  type NavSection,
  type UserDisplayInfo,
} from '../../components/layout/DashboardLayout';
import { Card, Button, Badge, Input, EmptyState } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { StaffProjectDetailsDrawer, type StaffProjectDetails } from './components/StaffProjectDetailsDrawer';

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

export default function StaffAssignedProjectsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [workStatusFilter, setWorkStatusFilter] = useState('ALL');

  // Selected project for Details Drawer
  const [selectedProject, setSelectedProject] = useState<StaffProjectDetails | null>(null);

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
    setStatusFilter('ALL');
    setWorkStatusFilter('ALL');
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
        title="Assigned Projects"
        description="View projects assigned to you and review your project responsibilities, work items and progress."
        breadcrumbs={[{ label: 'Workspace' }, { label: 'Assigned Projects' }]}
        badge={<Badge variant="success">Permanent Staff</Badge>}
      />

      <div className="space-y-6">
        {/* ── 1. SUMMARY CARDS ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              title: 'Assigned Projects',
              value: '—',
              subtext: 'No active allocations',
              badge: 'Projects',
              badgeVariant: 'blue' as const,
            },
            {
              title: 'Active Projects',
              value: '—',
              subtext: 'No active allocations',
              badge: 'Active',
              badgeVariant: 'success' as const,
            },
            {
              title: 'Assigned Work Items',
              value: '—',
              subtext: 'No active allocations',
              badge: 'Work Items',
              badgeVariant: 'blue' as const,
            },
            {
              title: 'Overall Contribution',
              value: '—',
              subtext: 'No active allocations',
              badge: 'Contribution',
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Search Query */}
              <div className="space-y-1">
                <label htmlFor="searchQuery" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Search Projects
                </label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <Input
                    id="searchQuery"
                    type="text"
                    placeholder="Search assigned projects"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)] placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Project Status */}
              <div className="space-y-1">
                <label htmlFor="statusFilter" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Project Status
                </label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)] text-slate-700 bg-white"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Planned">Planned</option>
                  <option value="Active">Active</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Work Status */}
              <div className="space-y-1">
                <label htmlFor="workStatusFilter" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Work Status
                </label>
                <select
                  id="workStatusFilter"
                  value={workStatusFilter}
                  onChange={(e) => setWorkStatusFilter(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)] text-slate-700 bg-white"
                >
                  <option value="ALL">All Work Statuses</option>
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

        {/* ── 3. PROJECTS TABLE ────────────────────────────────── */}
        <Card padding="none" className="shadow-2xs border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse min-w-[1100px]" aria-label="Assigned Projects Table">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4">Project</th>
                  <th scope="col" className="py-3 px-4">Project ID</th>
                  <th scope="col" className="py-3 px-4">Project Status</th>
                  <th scope="col" className="py-3 px-4">Project Lead / Supervisor</th>
                  <th scope="col" className="py-3 px-4">My Role</th>
                  <th scope="col" className="py-3 px-4 text-center">Assigned Work Items</th>
                  <th scope="col" className="py-3 px-4 text-right">My Contribution</th>
                  <th scope="col" className="py-3 px-4 text-center">Project Progress</th>
                  <th scope="col" className="py-3 px-4 text-right">Target Date</th>
                  <th scope="col" className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={10} className="p-12">
                    <EmptyState
                      icon={<FolderKanban className="w-8 h-8 text-slate-400" />}
                      title="No assigned projects available"
                      description="Projects assigned to your Permanent Staff account will appear here once assigned by the administrator."
                      secondaryAction={
                        <Badge size="sm" variant="neutral">
                          No projects assigned
                        </Badge>
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ── 4. DETAILS DRAWER ─────────────────────────────────── */}
      <StaffProjectDetailsDrawer
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </DashboardLayout>
  );
}
