import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  GraduationCap,
  Clock,
  Search,
  RotateCcw,
  Plus,
  ShieldCheck,
  UserPlus,
  Smartphone,
  Info,
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
import { AddUserDrawer } from './components/AddUserDrawer';
import { UserDetailsDrawer } from './components/UserDetailsDrawer';
import type { ManagedUser } from '../../types/userManagement.types';

export default function UserManagementPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Drawer and Dialog State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
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
    setCategoryFilter('ALL');
    setStatusFilter('ALL');
    setDepartmentFilter('ALL');
  };

  return (
    <DashboardLayout
      navigation={ADMIN_NAVIGATION}
      user={userDisplay}
      notificationsCount={2}
      onNotificationClick={() => { }}
      onProfileClick={() => { }}
      onLogoutClick={handleLogout}
    >
      {/* ── Page Header ────────────────────────────────────────── */}
      <PageHeader
        title="User Management"
        description="Create, review and manage programme user accounts from one centralized workspace."
        breadcrumbs={[
          { label: 'Administration', path: '/admin/dashboard' },
          { label: 'User Management' },
        ]}
        badge={<Badge variant="blue">Administrator</Badge>}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddUserOpen(true)}
            aria-label="Add new user"
          >
            + Add User
          </Button>
        }
      />

      <div className="space-y-6">
        {/* ── Summary Cards Area ──────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Users */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[var(--color-brand-blue-light)] text-[var(--color-brand-blue)] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  Total Users
                </span>
              </div>
              <Badge size="sm" variant="neutral">
                All Categories
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

          {/* Card 2: Permanent Staff */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[var(--color-brand-blue)] flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  Permanent Staff
                </span>
              </div>
              <Badge size="sm" variant="blue">
                Staff Members
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

          {/* Card 3: Interns */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  Interns
                </span>
              </div>
              <Badge size="sm" variant="info">
                Programme Interns
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

          {/* Card 4: Pending Activation */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  Pending Activation
                </span>
              </div>
              <Badge size="sm" variant="warning">
                Pending Review
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
                placeholder="Search users by name, email, phone or ID"
                className="w-full h-10 pl-10 pr-4 text-xs sm:text-sm rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs"
                aria-label="Search users by name, email, phone or ID"
              />
            </div>

            {/* Filter Controls Group */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Category Filter */}
              <div className="flex-1 sm:flex-initial min-w-[140px]">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs cursor-pointer"
                  aria-label="Filter by user category"
                >
                  <option value="ALL">All Categories</option>
                  <option value="ADMIN">Administrator</option>
                  <option value="PERMANENT_STAFF">Permanent Staff</option>
                  <option value="INTERN">Intern</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex-1 sm:flex-initial min-w-[130px]">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs cursor-pointer"
                  aria-label="Filter by account status"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              {/* Department Filter (Placeholder) */}
              <div className="flex-1 sm:flex-initial min-w-[140px]">
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs cursor-pointer"
                  aria-label="Filter by department"
                >
                  <option value="ALL">All Departments</option>
                  <option value="AI_DATA">AI & Data Systems</option>
                  <option value="ENTERPRISE">Enterprise Network</option>
                  <option value="SOFTWARE">Software Architecture</option>
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

        {/* ── Users Table Section ─────────────────────────────── */}
        <Card padding="none" className="overflow-hidden border border-[var(--color-border-subtle)]">
          {/* Table Header Row */}
          <div className="p-4 sm:px-6 sm:py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between bg-[var(--color-surface-white)]">
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-bold text-[var(--color-brand-navy)]">
                Programme Accounts
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
            <table className="w-full text-left border-collapse" aria-label="Programme Users Table">
              <thead>
                <tr className="bg-[var(--color-surface-subtle)]/70 border-b border-[var(--color-border-subtle)] text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4 sm:px-6">User</th>
                  <th scope="col" className="py-3 px-4">User ID</th>
                  <th scope="col" className="py-3 px-4">Phone Number</th>
                  <th scope="col" className="py-3 px-4">Email</th>
                  <th scope="col" className="py-3 px-4">Category</th>
                  <th scope="col" className="py-3 px-4">Professional Role</th>
                  <th scope="col" className="py-3 px-4">Department</th>
                  <th scope="col" className="py-3 px-4">Account Status</th>
                  <th scope="col" className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-subtle)] bg-[var(--color-surface-white)]">
                {/* Empty State when no backend data is connected */}
                <tr>
                  <td colSpan={9} className="p-8">
                    <EmptyState
                      icon={<Users className="w-6 h-6 text-[var(--color-brand-blue)]" />}
                      title="No user data available"
                      description="Programme users will appear here once the user management service is connected."
                      action={
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Plus className="w-4 h-4" />}
                          onClick={() => setIsAddUserOpen(true)}
                        >
                          Add First User
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
        </Card>

        {/* ── Admin User Workflow Visual ──────────────────────── */}
        <Card padding="lg" className="space-y-4 bg-gradient-to-br from-white via-white to-blue-50/30 border-[var(--color-border-subtle)]">
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[var(--color-brand-blue)]" />
              <h3 className="text-sm font-bold text-[var(--color-brand-navy)]">
                Admin User Lifecycle & Access Workflow
              </h3>
            </div>
            <Badge variant="blue" size="sm">Standard Operational Procedure</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-white border border-[var(--color-border-subtle)] space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[var(--color-brand-blue)] font-mono">
                  STEP 01
                </span>
                <UserPlus className="w-4 h-4 text-[var(--color-brand-blue)]" />
              </div>
              <h4 className="text-xs font-bold text-[var(--color-brand-navy)]">
                Create User
              </h4>
              <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                Administrator records programme user details, assigns category, and enters verified mobile number.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-white border border-[var(--color-border-subtle)] space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[var(--color-brand-blue)] font-mono">
                  STEP 02
                </span>
                <Info className="w-4 h-4 text-[var(--color-brand-blue)]" />
              </div>
              <h4 className="text-xs font-bold text-[var(--color-brand-navy)]">
                Review Account
              </h4>
              <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                Confirm contact information, role permissions, project department, and programme allocation.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-white border border-[var(--color-border-subtle)] space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[var(--color-brand-green)] font-mono">
                  STEP 03
                </span>
                <ShieldCheck className="w-4 h-4 text-[var(--color-brand-green)]" />
              </div>
              <h4 className="text-xs font-bold text-[var(--color-brand-navy)]">
                Activate Account
              </h4>
              <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                Account activation is completed through the real backend service to enable authorized session access.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl bg-white border border-[var(--color-border-subtle)] space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[var(--color-brand-green)] font-mono">
                  STEP 04
                </span>
                <Smartphone className="w-4 h-4 text-[var(--color-brand-green)]" />
              </div>
              <h4 className="text-xs font-bold text-[var(--color-brand-navy)]">
                User Access
              </h4>
              <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                Activated users sign in seamlessly using their registered mobile number and SMS OTP code.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Add User Drawer / Dialog ─────────────────────────── */}
      <AddUserDrawer
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
      />

      {/* ── User Details & Activation Drawer ─────────────────── */}
      <UserDetailsDrawer
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </DashboardLayout>
  );
}
