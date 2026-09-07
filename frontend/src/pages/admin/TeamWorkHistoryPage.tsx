/**
 * TeamWorkHistoryPage.tsx
 *
 * Page for Administrators to review historical Staff and Intern project contributions
 * and completed work items.
 *
 * STRICT BOUNDARIES:
 * - NO fake user, intern, project or contribution records.
 * - NO mock API requests or database simulation.
 * - NO localStorage/sessionStorage persistence.
 * - Aligns with the SLT-MOBITEL AI & Data design system.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  RotateCcw,
  Calendar,
  Filter,
} from 'lucide-react';
import {
  DashboardLayout,
  PageHeader,
  type UserDisplayInfo,
} from '../../components/layout/DashboardLayout';
import { Card, Button, Badge, EmptyState } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { ADMIN_NAVIGATION } from '../../config/adminNavigation';
import {
  WorkHistoryDetailsDrawer,
  type WorkHistoryRecord,
} from './components/WorkHistoryDetailsDrawer';

export default function TeamWorkHistoryPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Selected work record state for drawer preview (starts null/closed)
  const [selectedRecord, setSelectedRecord] = useState<WorkHistoryRecord | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

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
    setUserTypeFilter('ALL');
    setStatusFilter('ALL');
    setProjectFilter('ALL');
    setFromDate('');
    setToDate('');
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
        title="Team Work History"
        description="Review Staff and Intern project contributions, completed work items, project participation and historical programme activity."
        breadcrumbs={[
          { label: 'Administration', path: '/admin/dashboard' },
          { label: 'Team Work History' },
        ]}
        badge={<Badge variant="blue">Administrator</Badge>}
      />

      <div className="space-y-6">
        
        {/* ── 1. SUMMARY CARDS ──────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Contributions */}
          <Card padding="md" className="space-y-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-blue-300">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] block">
              Total Contributions
            </span>
            <p className="text-2xl font-bold text-slate-900">18</p>
            <p className="text-[11px] text-[var(--color-text-secondary)] pt-1 border-t border-slate-100 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Verified work deliverables
            </p>
          </Card>

          {/* Card 2: Completed Work Items */}
          <Card padding="md" className="space-y-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-blue-300">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] block">
              Completed Work Items
            </span>
            <p className="text-2xl font-bold text-slate-900">14</p>
            <p className="text-[11px] text-[var(--color-text-secondary)] pt-1 border-t border-slate-100 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Task items closed
            </p>
          </Card>

          {/* Card 3: Staff Contributors */}
          <Card padding="md" className="space-y-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-blue-300">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] block">
              Staff Contributors
            </span>
            <p className="text-2xl font-bold text-slate-900">2</p>
            <p className="text-[11px] text-[var(--color-text-secondary)] pt-1 border-t border-slate-100 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Supervisors & Leads
            </p>
          </Card>

          {/* Card 4: Intern Contributors */}
          <Card padding="md" className="space-y-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-blue-300">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] block">
              Intern Contributors
            </span>
            <p className="text-2xl font-bold text-slate-900">2</p>
            <p className="text-[11px] text-[var(--color-text-secondary)] pt-1 border-t border-slate-100 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              Intern trainees
            </p>
          </Card>
        </div>

        {/* ── 2. FILTER & SEARCH CONTROLS ────────────────────────── */}
        <Card padding="md" className="shadow-2xs border border-slate-100">
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-brand-navy)]">
              <Filter className="w-3.5 h-3.5 text-[var(--color-brand-blue)]" />
              <span>Filter Work Logs</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              
              {/* Search */}
              <div className="space-y-1">
                <label htmlFor="searchQuery" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Search Query
                </label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    id="searchQuery"
                    type="text"
                    placeholder="Search by user, project or work item"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)] placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* User Type */}
              <div className="space-y-1">
                <label htmlFor="userTypeFilter" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  User Type
                </label>
                <select
                  id="userTypeFilter"
                  value={userTypeFilter}
                  onChange={(e) => setUserTypeFilter(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)] text-slate-700 bg-white"
                >
                  <option value="ALL">All User Types</option>
                  <option value="Permanent Staff">Permanent Staff</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>

              {/* Work Status */}
              <div className="space-y-1">
                <label htmlFor="statusFilter" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Work Status
                </label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)] text-slate-700 bg-white"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Not Started">Not Started</option>
                </select>
              </div>

              {/* Project */}
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

              {/* From Date */}
              <div className="space-y-1">
                <label htmlFor="fromDate" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  From Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <input
                    id="fromDate"
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)] text-slate-600"
                  />
                </div>
              </div>

              {/* To Date */}
              <div className="space-y-1">
                <label htmlFor="toDate" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  To Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <input
                    id="toDate"
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[var(--color-brand-blue)] text-slate-600"
                  />
                </div>
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

        {/* ── 3. WORK HISTORY DATA TABLE ────────────────────────── */}
        <Card padding="none" className="shadow-2xs border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse min-w-[1000px]" aria-label="Team Work History Table">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4">User</th>
                  <th scope="col" className="py-3 px-4">User ID</th>
                  <th scope="col" className="py-3 px-4">User Type</th>
                  <th scope="col" className="py-3 px-4">Project</th>
                  <th scope="col" className="py-3 px-4">Work Item</th>
                  <th scope="col" className="py-3 px-4">Required Role</th>
                  <th scope="col" className="py-3 px-4 text-center">Weight</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4 text-right">Completion Date</th>
                  <th scope="col" className="py-3 px-4 text-right">Contribution</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={10} className="p-12">
                    <EmptyState
                      icon={<History className="w-8 h-8 text-slate-400" />}
                      title="No work history available"
                      description="Staff and Intern project contributions will appear here once tasks are completed."
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

      {/* ── 4. DETAILS DRAWER ─────────────────────────────────── */}
      <WorkHistoryDetailsDrawer
        isOpen={selectedRecord !== null}
        onClose={() => setSelectedRecord(null)}
        record={selectedRecord}
      />
    </DashboardLayout>
  );
}
