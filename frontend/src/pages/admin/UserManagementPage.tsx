import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Clock,
  Search,
  RotateCcw,
  Plus,
  ShieldCheck,
  UserPlus,
  Smartphone,
  Info,
  Ban,
  CheckCircle2,
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

const API_BASE_URL = 'http://localhost:5000/api';

export default function UserManagementPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Drawer and Dialog State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED'>('ALL');

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [employmentFilter, setEmploymentFilter] = useState('ALL');

  // API State
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users.');
      }
      const mapped = (data.users || []).map((u: any) => ({
        id: u._id || u.id,
        fullName: u.fullName || '—',
        employeeId: u.userId || '—',
        phoneNumber: u.phoneNumber || '—',
        email: u.email || '—',
        category: u.role || '—',
        professionalRole: u.role === 'PERMANENT_STAFF' ? (u.designation || '—') : (u.internRole || u.designation || '—'),
        department: u.role === 'PERMANENT_STAFF' ? (u.employmentType || 'Permanent') : (u.department || '—'),
        accountStatus: u.accountStatus || '—',
        createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—',
        updatedAt: u.updatedAt ? new Date(u.updatedAt).toLocaleDateString() : '—',
      }));
      setUsers(mapped);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatCategory = (cat?: string) => {
    if (!cat) return '—';
    if (cat === 'ADMIN' || cat === 'ADMINISTRATOR') return 'Administrator';
    if (cat === 'PERMANENT_STAFF') return 'Permanent Staff';
    if (cat === 'INTERN') return 'Intern';
    return cat;
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'VERIFIED':
      case 'ACTIVE':
        return (
          <Badge variant="success" size="sm" className="inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified
          </Badge>
        );
      case 'REJECTED':
      case 'INACTIVE':
        return (
          <Badge variant="neutral" size="sm" className="inline-flex items-center gap-1">
            <Ban className="w-3.5 h-3.5 text-slate-500" />
            Rejected
          </Badge>
        );
      case 'PENDING_VERIFICATION':
      case 'PENDING':
      default:
        return (
          <Badge variant="warning" size="sm" className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Pending Verification
          </Badge>
        );
    }
  };

  const totalCount = users.length;
  const pendingCount = users.filter((u) => u.accountStatus === 'PENDING').length;
  const verifiedCount = users.filter((u) => u.accountStatus === 'ACTIVE').length;
  const rejectedCount = users.filter((u) => u.accountStatus === 'REJECTED').length;

  const filteredUsers = users.filter((u) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phoneNumber.includes(q) ||
        u.employeeId.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    if (activeTab === 'PENDING_VERIFICATION') {
      if (u.accountStatus !== 'PENDING') return false;
    } else if (activeTab === 'VERIFIED') {
      if (u.accountStatus !== 'ACTIVE') return false;
    } else if (activeTab === 'REJECTED') {
      if (u.accountStatus !== 'REJECTED') return false;
    }

    if (categoryFilter !== 'ALL') {
      if (u.category !== categoryFilter) return false;
    }

    if (statusFilter !== 'ALL') {
      if (statusFilter === 'PENDING_VERIFICATION' && u.accountStatus !== 'PENDING') return false;
      if (statusFilter === 'VERIFIED' && u.accountStatus !== 'ACTIVE') return false;
      if (statusFilter === 'ACTIVE' && u.accountStatus !== 'ACTIVE') return false;
      if (statusFilter === 'INACTIVE' && u.accountStatus !== 'INACTIVE') return false;
      if (statusFilter === 'REJECTED' && u.accountStatus !== 'REJECTED') return false;
    }

    if (employmentFilter !== 'ALL') {
      if (u.category !== 'PERMANENT_STAFF' || u.department !== employmentFilter) return false;
    }

    return true;
  });

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
    setEmploymentFilter('ALL');
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
          <div className="flex flex-col items-end gap-1.5">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddUserOpen(true)}
              aria-label="Manual user provisioning"
            >
              Manual User Provisioning
            </Button>
            <span className="text-[10px] text-[var(--color-text-secondary)] font-medium max-w-xs text-right leading-tight block">
              Staff and Intern users can normally register through the public Create Account flow.
            </span>
          </div>
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
                All
              </Badge>
            </div>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)]">
              {isLoading ? '—' : totalCount}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              Real-time user directory
            </p>
          </Card>

          {/* Card 2: Pending Verification */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  Pending Verification
                </span>
              </div>
              <Badge size="sm" variant="warning">
                Review Queue
              </Badge>
            </div>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)]">
              {isLoading ? '—' : pendingCount}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
              Awaiting review
            </p>
          </Card>

          {/* Card 3: Verified Users */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[var(--color-brand-green)] flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  Verified Users
                </span>
              </div>
              <Badge size="sm" variant="success">
                Active Access
              </Badge>
            </div>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)]">
              {isLoading ? '—' : verifiedCount}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              Verified & active
            </p>
          </Card>

          {/* Card 4: Rejected Registrations */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-rose-500" />
                </div>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  Rejected Registrations
                </span>
              </div>
              <Badge size="sm" variant="neutral">
                Declined
              </Badge>
            </div>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)]">
              {isLoading ? '—' : rejectedCount}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" aria-hidden="true" />
              Declined registrations
            </p>
          </Card>
        </div>

        {/* ── Verification Tabs ──────────────────────────────── */}
        <div className="border-b border-[var(--color-border-subtle)] bg-white px-4 py-1.5 rounded-xl shadow-2xs">
          <nav className="flex flex-wrap gap-4" aria-label="Registration status views">
            {[
              { id: 'ALL', label: 'All Users' },
              { id: 'PENDING_VERIFICATION', label: 'Pending Verification' },
              { id: 'VERIFIED', label: 'Verified Users' },
              { id: 'REJECTED', label: 'Rejected Registrations' },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as 'ALL' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED')}
                  aria-current={active ? 'page' : undefined}
                  className={`py-2 px-1 text-xs font-bold border-b-2 transition-all focus:outline-none cursor-pointer ${
                    active
                      ? 'border-[var(--color-brand-blue)] text-[var(--color-brand-blue)]'
                      : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-brand-navy)] hover:border-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
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
                  <option value="PENDING_VERIFICATION">Pending Verification</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              {/* Employment Type Filter */}
              <div className="flex-1 sm:flex-initial min-w-[140px]">
                <select
                  value={employmentFilter}
                  onChange={(e) => setEmploymentFilter(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-white)] text-[var(--color-brand-navy)] focus:outline-hidden focus:border-[var(--color-brand-blue)] focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 transition-all shadow-2xs cursor-pointer"
                  aria-label="Filter by employment type"
                >
                  <option value="ALL">All Employment Types</option>
                  <option value="Permanent">Permanent</option>
                  <option value="Contract Based">Contract Based</option>
                  <option value="Freelance">Freelance</option>
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
              <Badge size="sm" variant="blue">
                {filteredUsers.length} Registered
              </Badge>
            </div>
            <span className="text-xs text-[var(--color-text-secondary)] font-medium">
              Live user database
            </span>
          </div>

          {/* Table Container with Horizontal Scroll */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" aria-label="Programme Users Table">
              <thead>
                <tr className="bg-[var(--color-surface-subtle)]/70 border-b border-[var(--color-border-subtle)] text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4 sm:px-6">User</th>
                  <th scope="col" className="py-3 px-4">User ID</th>
                  <th scope="col" className="py-3 px-4">User Type</th>
                  <th scope="col" className="py-3 px-4">Role / Professional Role</th>
                  <th scope="col" className="py-3 px-4">Employment Type</th>
                  <th scope="col" className="py-3 px-4">Phone Number</th>
                  <th scope="col" className="py-3 px-4">Email</th>
                  <th scope="col" className="py-3 px-4">Verification Status</th>
                  <th scope="col" className="py-3 px-4">Registered Date</th>
                  <th scope="col" className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-subtle)] bg-[var(--color-surface-white)]">
                {isLoading ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-xs text-[var(--color-text-secondary)]">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-[var(--color-brand-blue)] border-t-transparent rounded-full animate-spin" />
                        <span>Loading user directory...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8">
                      <EmptyState
                        icon={<Users className="w-6 h-6 text-slate-400" />}
                        title="No matching records found"
                        description="Try adjusting your search query or status filter parameters."
                        action={
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleResetFilters}
                            leftIcon={<RotateCcw className="w-4 h-4" />}
                          >
                            Clear Filters
                          </Button>
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors text-xs text-[var(--color-text-primary)]">
                      <td className="py-3 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-blue-light)] text-[var(--color-brand-blue)] flex items-center justify-center font-bold">
                            {u.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-[var(--color-brand-navy)]">{u.fullName}</p>
                            <p className="text-[10px] text-[var(--color-text-secondary)]">{u.professionalRole}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium">{u.employeeId}</td>
                      <td className="py-3 px-4">
                        <Badge variant={u.category === 'ADMIN' ? 'blue' : (u.category === 'PERMANENT_STAFF' ? 'success' : 'neutral')}>
                          {formatCategory(u.category)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{u.professionalRole}</td>
                      <td className="py-3 px-4">
                        {u.category === 'PERMANENT_STAFF' ? u.department : '—'}
                      </td>
                      <td className="py-3 px-4 font-mono">{u.phoneNumber}</td>
                      <td className="py-3 px-4 truncate max-w-[150px]" title={u.email}>{u.email}</td>
                      <td className="py-3 px-4">{getStatusBadge(u.accountStatus)}</td>
                      <td className="py-3 px-4 text-[var(--color-text-secondary)]">{u.createdAt}</td>
                      <td className="py-3 px-4 sm:px-6 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(u);
                            setIsDetailsOpen(true);
                          }}
                        >
                          Review Access
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
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
        onStatusUpdated={fetchUsers}
      />
    </DashboardLayout>
  );
}
