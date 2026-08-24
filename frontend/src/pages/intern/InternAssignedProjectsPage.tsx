import { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  TrendingUp,
  History,
  User,
} from 'lucide-react';
import {
  DashboardLayout,
  PageHeader,
  type NavSection,
  type UserDisplayInfo,
} from '../../components/layout/DashboardLayout';
import { Card, Button, Badge, EmptyState } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { InternProjectDetailsDrawer, type InternProject } from './components/InternProjectDetailsDrawer';

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

export default function InternAssignedProjectsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Selected project contribution details for Drawer
  const [selectedProject, setSelectedProject] = useState<InternProject | null>(null);

  // Filters State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || '—',
    email: user?.email || '—',
    roleLabel: 'Intern',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
  };

  return (
    <DashboardLayout
      navigation={INTERN_NAVIGATION}
      user={userDisplay}
      notificationsCount={0}
      onNotificationClick={() => { }}
      onProfileClick={() => { }}
      onLogoutClick={handleLogout}
    >
      <PageHeader
        title="Assigned Projects"
        description="View the projects assigned to you, your assigned role, work items and current project progress."
        breadcrumbs={[{ label: 'Workspace' }, { label: 'Assigned Projects' }]}
        badge={<Badge variant="blue">Intern</Badge>}
      />

      <div className="space-y-6">
        {/* ── 1. SUMMARY CARDS ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              title: 'Assigned Projects',
              value: '—',
              subtext: 'No data available yet',
              badge: 'Allocations',
              badgeVariant: 'blue' as const,
            },
            {
              title: 'Active Projects',
              value: '—',
              subtext: 'No data available yet',
              badge: 'Active',
              badgeVariant: 'blue' as const,
            },
            {
              title: 'Assigned Work Items',
              value: '—',
              subtext: 'No data available yet',
              badge: 'Tasks',
              badgeVariant: 'blue' as const,
            },
            {
              title: 'Completed Work Items',
              value: '—',
              subtext: 'No data available yet',
              badge: 'Completed',
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

        {/* ── 2. FILTERS SECTION ──────────────────────────────── */}
        <Card title="Filter Projects" subtitle="Filter your active assignments" className="shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            {/* Search */}
            <div className="space-y-1.5">
              <label htmlFor="project-search" className="font-semibold text-slate-700 block">
                Search Project
              </label>
              <input
                id="project-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search assigned projects"
                className="w-full px-3 py-2 border border-[var(--color-border-subtle)] rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)]/50 focus:border-[var(--color-brand-blue)]"
              />
            </div>

            {/* Project Status */}
            <div className="space-y-1.5">
              <label htmlFor="project-status" className="font-semibold text-slate-700 block">
                Project Status
              </label>
              <select
                id="project-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--color-border-subtle)] rounded-lg text-slate-800 bg-white focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)]/50 focus:border-[var(--color-brand-blue)]"
              >
                <option value="">All Statuses</option>
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Reset Filters button */}
            <div className="flex items-end">
              <Button
                variant="outline"
                size="md"
                className="w-full sm:w-auto"
                onClick={handleResetFilters}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* ── 3. ASSIGNED PROJECTS TABLE ───────────────────────── */}
        <Card padding="none" title="All Assigned Projects" subtitle="Detailed breakdown of active allocations" className="shadow-2xs border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse min-w-[1000px]" aria-label="Assigned Projects Table">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4">Project</th>
                  <th scope="col" className="py-3 px-4">Assigned Role</th>
                  <th scope="col" className="py-3 px-4">Supervisor / Project Lead</th>
                  <th scope="col" className="py-3 px-4 text-center">Work Items</th>
                  <th scope="col" className="py-3 px-4">Project Status</th>
                  <th scope="col" className="py-3 px-4 text-center">Project Progress</th>
                  <th scope="col" className="py-3 px-4 text-right">Target Date</th>
                  <th scope="col" className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={8} className="p-12">
                    <EmptyState
                      icon={<FolderKanban className="w-8 h-8 text-slate-400" />}
                      title="No assigned projects yet"
                      description="Projects assigned to you will appear here."
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ── 4. DETAILS DRAWER ─────────────────────────────────── */}
      <InternProjectDetailsDrawer
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </DashboardLayout>
  );
}
