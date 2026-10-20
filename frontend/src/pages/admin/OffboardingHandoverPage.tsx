import { useState, useEffect, useMemo } from 'react';
import {
  Users,
  UserCheck,
  UserMinus,
  CheckCircle2,
  ArrowRightLeft,
  AlertTriangle,
  Search,
  RotateCcw,
  FolderKanban,
  Calendar,
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
  Alert,
} from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { ADMIN_NAVIGATION } from '../../config/adminNavigation';
import { HandoverDrawer } from './components/HandoverDrawer';
import { OffboardUserModal } from './components/OffboardUserModal';
import type {
  OffboardedUser,
  ActiveCandidate,
  HandoverStats,
} from '../../types/handoverManagement.types';

const API_BASE_URL = 'http://localhost:5000/api';

export default function OffboardingHandoverPage() {
  const { user, logout } = useAuth();

  // Data States
  const [stats, setStats] = useState<HandoverStats>({
    totalDepartedUsers: 0,
    totalCompletedTasks: 0,
    totalPendingTasks: 0,
    totalReassignedTasks: 0,
    overallCompletionRate: 0,
    internsOffboarded: 0,
    staffConcluded: 0,
    pendingHandoverUsersCount: 0,
  });
  const [departedUsers, setDepartedUsers] = useState<OffboardedUser[]>([]);
  const [activeCandidates, setActiveCandidates] = useState<ActiveCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals & Drawers
  const [isHandoverDrawerOpen, setIsHandoverDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<OffboardedUser | null>(null);
  const [isOffboardModalOpen, setIsOffboardModalOpen] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [handoverStatusFilter, setHandoverStatusFilter] = useState('ALL');

  // Fetch Handover & Offboarding summary from API
  const fetchHandoverData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/handover/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch offboarding data.');
      }

      setStats(data.stats || {});
      setDepartedUsers(data.departedUsers || []);
      setActiveCandidates(data.activeCandidates || []);

      // If a user was currently selected in the drawer, update their state
      if (selectedUser) {
        const updated = (data.departedUsers || []).find(
          (u: OffboardedUser) => u.userId === selectedUser.userId
        );
        if (updated) {
          setSelectedUser(updated);
        }
      }
    } catch (err: any) {
      console.error('Handover API error:', err);
      setErrorMsg(err.message || 'Failed to load handover details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHandoverData();
  }, []);

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return departedUsers.filter((u) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = u.fullName.toLowerCase().includes(query);
        const matchesId = u.userId.toLowerCase().includes(query);
        const matchesRole = (u.designation || u.internRole || '').toLowerCase().includes(query);
        const matchesEmail = u.email.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesRole && !matchesEmail) {
          return false;
        }
      }

      // Department filter
      if (departmentFilter !== 'ALL' && u.department !== departmentFilter) {
        return false;
      }

      // Role filter
      if (roleFilter !== 'ALL') {
        if (roleFilter === 'INTERN' && u.role !== 'INTERN') return false;
        if (roleFilter === 'PERMANENT_STAFF' && u.role !== 'PERMANENT_STAFF') return false;
      }

      // Handover status filter
      if (handoverStatusFilter !== 'ALL') {
        if (handoverStatusFilter === 'NEEDS_HANDOVER' && u.handoverStatus !== 'NEEDS_HANDOVER') {
          return false;
        }
        if (handoverStatusFilter === 'FULLY_HANDED_OVER' && u.handoverStatus !== 'FULLY_HANDED_OVER') {
          return false;
        }
      }

      return true;
    });
  }, [departedUsers, searchQuery, departmentFilter, roleFilter, handoverStatusFilter]);

  const handleOpenDrawer = (user: OffboardedUser) => {
    setSelectedUser(user);
    setIsHandoverDrawerOpen(true);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setDepartmentFilter('ALL');
    setRoleFilter('ALL');
    setHandoverStatusFilter('ALL');
  };

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || 'Administrator',
    email: user?.email || 'admin@aidata.com',
    roleLabel: 'Administrator',
  };

  const formatOffboardReason = (reason?: string) => {
    switch (reason) {
      case 'INTERNSHIP_COMPLETED':
        return 'Internship Period Completed';
      case 'CONTRACT_ENDED':
        return 'Contract Tenure Concluded';
      case 'RESIGNED':
        return 'Voluntary Resignation';
      case 'ADMIN_OFFBOARDED':
        return 'Administrative Rotation';
      default:
        return reason || 'Tenure Concluded';
    }
  };

  return (
    <DashboardLayout
      navigation={ADMIN_NAVIGATION}
      user={userDisplay}
      onLogoutClick={logout}
      notificationsCount={stats.pendingHandoverUsersCount}
    >
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* ── Page Header ────────────────────────────────────── */}
        <PageHeader
          title="Offboarding & Work Handover Console"
          description="Inspect departed staff & intern completed deliverables, analyze outstanding work items, and securely reassign active projects to available team members."
          badge="Tenure Governance"
          actions={
            <div className="flex items-center gap-2.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={fetchHandoverData}
                disabled={isLoading}
              >
                <RotateCcw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsOffboardModalOpen(true)}
              >
                <UserMinus className="w-3.5 h-3.5 mr-1.5" />
                Offboard Member
              </Button>
            </div>
          }
        />

        {/* Error Alert */}
        {errorMsg && (
          <Alert variant="error" onClose={() => setErrorMsg(null)}>
            {errorMsg}
          </Alert>
        )}

        {/* ── 4 Executive KPI Cards ────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Offboarded Members */}
          <Card className="p-4 rounded-2xl border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Departed Members
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[var(--color-brand-navy)]">
                {stats.totalDepartedUsers}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">alumni records</span>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-1 truncate">
              {stats.internsOffboarded} Interns completed • {stats.staffConcluded} Staff concluded
            </p>
          </Card>

          {/* Card 2: Deliverables Completed */}
          <Card className="p-4 rounded-2xl border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Completed Deliverables
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-700">
                {stats.overallCompletionRate}%
              </span>
              <span className="text-xs text-emerald-600 font-medium">overall rate</span>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-1 truncate">
              {stats.totalCompletedTasks} completed before tenure exit
            </p>
          </Card>

          {/* Card 3: Pending Tasks Needing Handover */}
          <Card className="p-4 rounded-2xl border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Pending Reassignment
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-700">
                {stats.totalPendingTasks}
              </span>
              <span className="text-xs text-amber-600 font-medium">open tasks</span>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-1 truncate">
              {stats.pendingHandoverUsersCount} member(s) have pending items
            </p>
          </Card>

          {/* Card 4: Reassigned Tasks */}
          <Card className="p-4 rounded-2xl border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Active Reassignees
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[var(--color-brand-blue)] flex items-center justify-center">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[var(--color-brand-blue)]">
                {activeCandidates.length}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">team members</span>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-1 truncate">
              Available to inherit open project work
            </p>
          </Card>
        </div>

        {/* ── Search & Filter Controls ─────────────────────────── */}
        <Card className="p-4 rounded-2xl border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, ID, role, or email..."
                className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)] text-[var(--color-brand-navy)] placeholder-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/30 focus:border-[var(--color-brand-blue)] outline-hidden"
              />
            </div>

            {/* Department Filter */}
            <div className="md:col-span-3">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)] text-[var(--color-brand-navy)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/30 focus:border-[var(--color-brand-blue)] outline-hidden"
              >
                <option value="ALL">All Departments</option>
                <option value="AI & Data Team">AI & Data Team</option>
                <option value="Enterprise Network">Enterprise Network</option>
                <option value="Software Architecture">Software Architecture</option>
              </select>
            </div>

            {/* Role Filter */}
            <div className="md:col-span-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)] text-[var(--color-brand-navy)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/30 focus:border-[var(--color-brand-blue)] outline-hidden"
              >
                <option value="ALL">All Roles</option>
                <option value="INTERN">Interns Only</option>
                <option value="PERMANENT_STAFF">Staff Only</option>
              </select>
            </div>

            {/* Handover Status */}
            <div className="md:col-span-2">
              <select
                value={handoverStatusFilter}
                onChange={(e) => setHandoverStatusFilter(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)] text-[var(--color-brand-navy)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/30 focus:border-[var(--color-brand-blue)] outline-hidden"
              >
                <option value="ALL">All Handover Statuses</option>
                <option value="NEEDS_HANDOVER">⚠️ Needs Handover</option>
                <option value="FULLY_HANDED_OVER">✓ Fully Cleared</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="md:col-span-1 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand-navy)]"
                title="Reset filters"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* ── Main Departed Personnel Workload Grid ─────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[var(--color-brand-navy)]">
              Departed Personnel Workload Records ({filteredUsers.length})
            </h3>
            <span className="text-xs text-[var(--color-text-muted)]">
              Click &quot;Inspect Workload & Handover&quot; to review deliverables and reassign
            </span>
          </div>

          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-[var(--color-brand-blue)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Loading departed personnel workloads...
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <EmptyState
              icon={<UserCheck className="w-8 h-8 text-[var(--color-brand-blue)]" />}
              title="No departed personnel records found"
              description={
                searchQuery || departmentFilter !== 'ALL' || roleFilter !== 'ALL' || handoverStatusFilter !== 'ALL'
                  ? 'No records match your active search filters. Try clearing or resetting the filters.'
                  : 'All staff and interns are currently active. When an intern period concludes or a member is offboarded, their workload and handover actions will appear here.'
              }
              action={
                searchQuery || departmentFilter !== 'ALL' || roleFilter !== 'ALL' || handoverStatusFilter !== 'ALL' ? (
                  <Button variant="secondary" size="sm" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredUsers.map((member) => {
                const hasPending = member.pendingTasksCount > 0;

                return (
                  <Card
                    key={member.userId}
                    className="p-5 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Row: User Identity & Status Badge */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300/60 text-[var(--color-brand-navy)] flex items-center justify-center font-bold text-sm shrink-0">
                            {member.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="text-xs font-bold text-[var(--color-brand-navy)] leading-tight">
                                {member.fullName}
                              </h4>
                              <span className="font-mono text-[10px] text-[var(--color-text-muted)]">
                                ({member.userId})
                              </span>
                            </div>
                            <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                              {member.designation || member.internRole || 'Contributor'} • {member.department}
                            </p>
                          </div>
                        </div>

                        {/* Handover status pill */}
                        <Badge
                          variant={hasPending ? 'warning' : 'success'}
                          size="sm"
                          className="shrink-0"
                        >
                          {hasPending ? 'Needs Handover' : 'Cleared'}
                        </Badge>
                      </div>

                      {/* Exit Reason & Date Tag */}
                      <div className="mb-4 flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                          {formatOffboardReason(member.offboardReason)}
                        </span>
                        {member.offboardedAt && (
                          <span className="text-[10px] text-[var(--color-text-muted)] flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(member.offboardedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Workload Progress Bar */}
                      <div className="p-3 rounded-xl bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border-subtle)] mb-4">
                        <div className="flex items-center justify-between text-[11px] mb-1.5">
                          <span className="font-semibold text-[var(--color-brand-navy)]">
                            Workload Completed:
                          </span>
                          <span className="font-bold text-emerald-700">
                            {member.completionRate}% ({member.completedTasksCount}/{member.totalTasks})
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
                          <div
                            style={{ width: `${member.completionRate}%` }}
                            className="bg-emerald-500 h-full transition-all"
                          />
                          <div
                            style={{ width: `${100 - member.completionRate}%` }}
                            className="bg-amber-400 h-full transition-all"
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-[var(--color-text-secondary)] mt-2">
                          <span className="text-emerald-700 font-medium">
                            ✓ {member.completedTasksCount} Completed
                          </span>
                          <span className={hasPending ? 'text-amber-700 font-bold' : 'text-[var(--color-text-muted)]'}>
                            {hasPending ? `⚠️ ${member.pendingTasksCount} Pending Handover` : '0 Pending'}
                          </span>
                        </div>
                      </div>

                      {/* Project involvement badges */}
                      <div className="mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">
                          Projects Involved ({member.projectsInvolved.length}):
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {member.projectsInvolved.map((p) => (
                            <span
                              key={p.projectId}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[var(--color-border-subtle)] text-[var(--color-brand-navy)] flex items-center gap-1"
                            >
                              <FolderKanban className="w-3 h-3 text-[var(--color-brand-blue)]" />
                              {p.projectName}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-3 border-t border-[var(--color-border-subtle)]">
                      <Button
                        variant={hasPending ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => handleOpenDrawer(member)}
                        className="w-full justify-center"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5 mr-1.5" />
                        Inspect Workload & Handover
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Handover Details & Reassignment Drawer ─────────────── */}
      <HandoverDrawer
        isOpen={isHandoverDrawerOpen}
        onClose={() => setIsHandoverDrawerOpen(false)}
        user={selectedUser}
        activeCandidates={activeCandidates}
        onHandoverSuccess={fetchHandoverData}
      />

      {/* ── Offboard User Modal ───────────────────────────────── */}
      <OffboardUserModal
        isOpen={isOffboardModalOpen}
        onClose={() => setIsOffboardModalOpen(false)}
        activeCandidates={activeCandidates}
        onOffboardSuccess={fetchHandoverData}
      />
    </DashboardLayout>
  );
}
