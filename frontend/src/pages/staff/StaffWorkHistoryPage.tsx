import { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  TrendingUp,
  History,
  User,
  Info,
  ArrowRight,
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
import { StaffWorkHistoryDetailsDrawer, type StaffHistoryRecord } from './components/StaffWorkHistoryDetailsDrawer';

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

  // Selected history record for Details Drawer
  const [selectedRecord, setSelectedRecord] = useState<StaffHistoryRecord | null>(null);

  // Filters State
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
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
    setSearch('');
    setProjectFilter('');
    setRoleFilter('');
    setStatusFilter('');
    setFromDate('');
    setToDate('');
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
        title="Work History"
        description="Review your completed work items, project contributions and historical work activity across assigned projects."
        breadcrumbs={[{ label: 'Workspace' }, { label: 'Work History' }]}
        badge={<Badge variant="success">Permanent Staff</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<TrendingUp className="w-4 h-4" />}
              onClick={() => navigate('/staff/progress')}
            >
              View Work Progress
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<CheckSquare className="w-4 h-4" />}
              onClick={() => navigate('/staff/work-items')}
            >
              View My Work Items
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* ── 1. SUMMARY CARDS ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              title: 'Completed Work Items',
              value: '—',
              subtext: 'No data available yet',
              badge: 'Historical',
              badgeVariant: 'success' as const,
            },
            {
              title: 'Projects Contributed',
              value: '—',
              subtext: 'No data available yet',
              badge: 'Projects',
              badgeVariant: 'blue' as const,
            },
            {
              title: 'Total Contribution',
              value: '—',
              subtext: 'No data available yet',
              badge: 'Contribution',
              badgeVariant: 'success' as const,
            },
            {
              title: 'Recent Completions',
              value: '—',
              subtext: 'No data available yet',
              badge: 'Completions',
              badgeVariant: 'blue' as const,
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

        {/* ── 2. CONTRIBUTION RULE EXPLANATION CARD ────────────── */}
        <Card padding="md" className="bg-slate-50/50 border border-slate-200 shadow-2xs">
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
                  Completed work-item percentage weights contribute automatically to project progress. Historical metrics are locked and read-only.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] bg-white p-2.5 rounded-lg border border-slate-100 max-w-xl">
                <span className="text-slate-800">Completed Work Item</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="text-slate-800">Predefined Percentage Weight</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="text-slate-800">Progress Contribution</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="text-[var(--color-brand-blue)] font-bold">Project Progress Updated</span>
              </div>
            </div>
          </div>
        </Card>

        {/* ── 3. FILTERS SECTION ──────────────────────────────── */}
        <Card title="Search & Filter History" subtitle="Filter your completed and historical project work" className="shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
            {/* Search */}
            <div className="space-y-1.5">
              <label htmlFor="history-search" className="font-semibold text-slate-700 block">
                Search Work Item
              </label>
              <input
                id="history-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search work items or projects"
                className="w-full px-3 py-2 border border-[var(--color-border-subtle)] rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)]/50 focus:border-[var(--color-brand-blue)]"
              />
            </div>

            {/* Project */}
            <div className="space-y-1.5">
              <label htmlFor="history-project" className="font-semibold text-slate-700 block">
                Project
              </label>
              <select
                id="history-project"
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--color-border-subtle)] rounded-lg text-slate-800 bg-white focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)]/50 focus:border-[var(--color-brand-blue)]"
              >
                <option value="">All Projects</option>
              </select>
            </div>

            {/* Required Role */}
            <div className="space-y-1.5">
              <label htmlFor="history-role" className="font-semibold text-slate-700 block">
                Required Role
              </label>
              <select
                id="history-role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--color-border-subtle)] rounded-lg text-slate-800 bg-white focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)]/50 focus:border-[var(--color-brand-blue)]"
              >
                <option value="">All Roles</option>
                <option value="Business Analyst">Business Analyst</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="QA">QA</option>
                <option value="AI/ML">AI/ML</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label htmlFor="history-status" className="font-semibold text-slate-700 block">
                Status
              </label>
              <select
                id="history-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--color-border-subtle)] rounded-lg text-slate-800 bg-white focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)]/50 focus:border-[var(--color-brand-blue)]"
              >
                <option value="">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Not Started">Not Started</option>
              </select>
            </div>

            {/* Date From */}
            <div className="space-y-1.5">
              <label htmlFor="history-from" className="font-semibold text-slate-700 block">
                From Date
              </label>
              <input
                id="history-from"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--color-border-subtle)] rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)]/50 focus:border-[var(--color-brand-blue)]"
              />
            </div>

            {/* Date To */}
            <div className="space-y-1.5">
              <label htmlFor="history-to" className="font-semibold text-slate-700 block">
                To Date
              </label>
              <input
                id="history-to"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--color-border-subtle)] rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)]/50 focus:border-[var(--color-brand-blue)]"
              />
            </div>

            {/* Reset Filters button */}
            <div className="flex items-end sm:col-span-2 md:col-span-1 lg:col-span-2">
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

        {/* ── 4. WORK HISTORY TABLE ───────────────────────────── */}
        <Card padding="none" title="All Work History Records" subtitle="Historical breakdown of completed assignments" className="shadow-2xs border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse min-w-[1000px]" aria-label="Work History Table">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4">Work Item</th>
                  <th scope="col" className="py-3 px-4">Project</th>
                  <th scope="col" className="py-3 px-4">Required Role</th>
                  <th scope="col" className="py-3 px-4 text-center">Percentage Weight</th>
                  <th scope="col" className="py-3 px-4">Final Status</th>
                  <th scope="col" className="py-3 px-4 text-right">Completion Date</th>
                  <th scope="col" className="py-3 px-4 text-center">Progress Contribution</th>
                  <th scope="col" className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={8} className="p-12">
                    <EmptyState
                      icon={<History className="w-8 h-8 text-slate-400" />}
                      title="No work history available"
                      description="Your completed work items and project contribution history will appear here once work items are completed."
                      secondaryAction={
                        <Badge size="sm" variant="neutral">
                          No history recorded
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

      {/* ── 5. DETAILS DRAWER ─────────────────────────────────── */}
      <StaffWorkHistoryDetailsDrawer
        isOpen={selectedRecord !== null}
        onClose={() => setSelectedRecord(null)}
        record={selectedRecord}
      />
    </DashboardLayout>
  );
}
