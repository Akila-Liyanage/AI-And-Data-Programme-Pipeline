import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  Search,
  Phone,
  Mail,
  UserPlus,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Sparkles,
  Smartphone,
  Lock,
  Building,
  Briefcase,
} from 'lucide-react';
import {
  DashboardLayout,
  PageHeader,
  type UserDisplayInfo,
} from '../../components/layout/DashboardLayout';
import { Card, Button, Badge, Alert, Input } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ADMIN_NAVIGATION } from '../../config/adminNavigation';

interface ManagedUser {
  _id?: string;
  id?: string;
  userId: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  role: 'ADMIN' | 'PERMANENT_STAFF' | 'INTERN';
  designation?: string;
  department: string;
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  createdAt?: string;
}

interface UserStats {
  totalUsers: number;
  adminCount: number;
  staffCount: number;
  internCount: number;
}


export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isUsersView = location.pathname.includes('/admin/users');

  const [showWelcome, setShowWelcome] = useState(true);
  const [usersList, setUsersList] = useState<ManagedUser[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 3,
    adminCount: 1,
    staffCount: 1,
    internCount: 1,
  });
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmittingNewUser, setIsSubmittingNewUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    role: 'PERMANENT_STAFF' as 'ADMIN' | 'PERMANENT_STAFF' | 'INTERN',
    designation: '',
    department: 'AI & Data Team',
    password: '',
  });

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || 'Akila Liyanage',
    email: user?.email || 'admin@aidata.com',
    roleLabel: 'Administrator',
  };

  /**
   * Fetch Users List from Backend API
   */
  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setIsLoadingUsers(true);
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsersList(data.users || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  /**
   * Handle Create New User
   */
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionFeedback(null);

    if (!newUserForm.fullName.trim() || !newUserForm.phoneNumber.trim() || !newUserForm.email.trim()) {
      setActionFeedback({ type: 'error', message: 'Full Name, Phone Number, and Email are required.' });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    setIsSubmittingNewUser(true);
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUserForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create user');
      }

      setActionFeedback({
        type: 'success',
        message: `User ${newUserForm.fullName} successfully added! They can now sign in with Phone: ${newUserForm.phoneNumber}.`,
      });

      // Reset form & close modal
      setNewUserForm({
        fullName: '',
        phoneNumber: '',
        email: '',
        role: 'PERMANENT_STAFF',
        designation: '',
        department: 'AI & Data Team',
        password: '',
      });
      setIsAddModalOpen(false);
      fetchUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating user.';
      setActionFeedback({ type: 'error', message: msg });
    } finally {
      setIsSubmittingNewUser(false);
    }
  };

  /**
   * Handle Toggle User Active/Inactive
   */
  const handleToggleStatus = async (userIdToToggle: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userIdToToggle}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to toggle status');
      }

      setActionFeedback({ type: 'success', message: data.message });
      fetchUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating user status.';
      setActionFeedback({ type: 'error', message: msg });
    }
  };

  /**
   * Handle Delete User
   */
  const handleDeleteUser = async (userIdToDelete: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to remove user "${userName}" from the system?`)) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userIdToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete user');
      }

      setActionFeedback({ type: 'success', message: data.message });
      fetchUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error deleting user.';
      setActionFeedback({ type: 'error', message: msg });
    }
  };

  // Filtered Users List
  const filteredUsers = usersList.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const cleanSearch = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !cleanSearch ||
      u.fullName.toLowerCase().includes(cleanSearch) ||
      u.phoneNumber.includes(cleanSearch) ||
      u.email.toLowerCase().includes(cleanSearch) ||
      u.userId.toLowerCase().includes(cleanSearch) ||
      (u.designation && u.designation.toLowerCase().includes(cleanSearch));
    return matchesRole && matchesSearch;
  });

  return (
    <DashboardLayout
      navigation={ADMIN_NAVIGATION}
      user={userDisplay}
      notificationsCount={2}
      onNotificationClick={() => {}}
      onProfileClick={() => {}}
      onLogoutClick={handleLogout}
    >
      <PageHeader
        title={isUsersView ? "User & Team Management" : "Admin Control Center"}
        description={
          isUsersView
            ? "Add and manage staff, interns, and admin accounts with phone number access."
            : "Comprehensive oversight of users, projects, assignments, and programme progress."
        }
        breadcrumbs={[
          { label: 'Administration' },
          { label: isUsersView ? 'User Management' : 'Admin Dashboard' },
        ]}
        badge={<Badge variant="blue">System Administrator</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (isUsersView) navigate('/admin/dashboard');
                else navigate('/admin/users');
              }}
            >
              {isUsersView ? 'View Overview' : 'Manage Users'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setIsAddModalOpen(true);
                setActionFeedback(null);
              }}
            >
              Add New User
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Welcome alert */}
        {showWelcome && !isUsersView && (
          <Alert
            variant="success"
            title="Administrator Access Verified"
            onClose={() => setShowWelcome(false)}
          >
            Welcome back, <strong>{user?.fullName}</strong>! You have securely authenticated via Phone OTP (<code>{user?.phoneNumber || '0774943291'}</code>).
          </Alert>
        )}

        {/* Action feedback alert */}
        {actionFeedback && (
          <Alert
            variant={actionFeedback.type}
            title={actionFeedback.type === 'success' ? 'Operation Completed' : 'Operation Error'}
            onClose={() => setActionFeedback(null)}
          >
            {actionFeedback.message}
          </Alert>
        )}

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Total Team Members
              </span>
              <Badge size="sm" variant="blue">All Users</Badge>
            </div>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)]">
              {stats.totalUsers || usersList.length}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Authorized programme accounts
            </p>
          </Card>

          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Permanent Staff
              </span>
              <Badge size="sm" variant="success">Staff</Badge>
            </div>
            <p className="text-2xl font-bold text-emerald-600">
              {stats.staffCount}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Supervisors & Engineers
            </p>
          </Card>

          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Intern Trainees
              </span>
              <Badge size="sm" variant="neutral">Interns</Badge>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {stats.internCount}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Active Project Trainees
            </p>
          </Card>

          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Phone OTP Security
              </span>
              <Badge size="sm" variant="success">Secured</Badge>
            </div>
            <p className="text-2xl font-bold text-[var(--color-brand-blue)]">
              Active
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Passwordless SMS OTP Guard
            </p>
          </Card>
        </div>

        {/* ── USER MANAGEMENT SECTION ── */}
        <Card padding="lg" className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border-subtle)] pb-4">
            <div>
              <h2 className="text-base font-bold text-[var(--color-brand-navy)] flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--color-brand-blue)]" />
                Team Directory & Role Assignment
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                Admin controls to create and manage Staff, Interns, and Administrators.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              leftIcon={<UserPlus className="w-4 h-4" />}
              onClick={() => {
                setIsAddModalOpen(true);
                setActionFeedback(null);
              }}
            >
              Add New User
            </Button>
          </div>

          {/* Search & Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, phone, email, or user ID…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]/20 focus:border-[var(--color-brand-blue)] bg-slate-50/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Filter Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:border-[var(--color-brand-blue)]"
              >
                <option value="ALL">All Roles ({usersList.length})</option>
                <option value="ADMIN">Administrators ({stats.adminCount})</option>
                <option value="PERMANENT_STAFF">Permanent Staff ({stats.staffCount})</option>
                <option value="INTERN">Interns ({stats.internCount})</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">User Member</th>
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Phone Number (Login OTP)</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {isLoadingUsers ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      Loading user records…
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No team members found matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isSelf = u.userId === user?.userId || u.phoneNumber === user?.phoneNumber;
                    const uId = u._id || u.id || '';

                    return (
                      <tr key={u.userId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-900">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              u.role === 'ADMIN'
                                ? 'bg-blue-100 text-blue-700'
                                : u.role === 'PERMANENT_STAFF'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {u.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{u.fullName}</p>
                              <p className="text-[10px] text-slate-400">@{u.username}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                          {u.userId}
                        </td>

                        <td className="py-3 px-4 font-mono font-medium text-blue-700">
                          <span className="inline-flex items-center gap-1.5 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            <Phone className="w-3 h-3 text-blue-500" />
                            {u.phoneNumber}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-600">
                          <span className="inline-flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {u.email}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <Badge
                            size="sm"
                            variant={
                              u.role === 'ADMIN'
                                ? 'blue'
                                : u.role === 'PERMANENT_STAFF'
                                ? 'success'
                                : 'neutral'
                            }
                          >
                            {u.role === 'ADMIN'
                              ? 'Admin'
                              : u.role === 'PERMANENT_STAFF'
                              ? 'Permanent Staff'
                              : 'Intern'}
                          </Badge>
                        </td>

                        <td className="py-3 px-4 text-slate-600">
                          {u.designation || 'Team Member'}
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              u.accountStatus === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {u.accountStatus === 'ACTIVE' ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <XCircle className="w-3 h-3 text-rose-500" />
                            )}
                            {u.accountStatus}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {!isSelf && (
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(uId)}
                                title={u.accountStatus === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
                                className="px-2 py-1 rounded text-[11px] font-medium border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                              >
                                {u.accountStatus === 'ACTIVE' ? 'Disable' : 'Enable'}
                              </button>
                            )}

                            {!isSelf ? (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(uId, u.fullName)}
                                title="Delete user"
                                className="p-1 rounded text-rose-600 hover:bg-rose-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-medium italic">
                                Active Session
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Main Administrative Context / Next Milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card padding="lg" className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
              <div>
                <h2 className="text-base font-bold text-[var(--color-brand-navy)]">
                  Active Admin Operations
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Phone OTP Login Authentication & Administrator User Provisioning active.
                </p>
              </div>
              <Badge variant="success">Live & Verified</Badge>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[var(--color-brand-green)] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Authenticated Session Details</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Logged in as: <strong>{user?.fullName}</strong> ({user?.userId}) — Phone: <strong>{user?.phoneNumber || '0774943291'}</strong> — Role: <code>{user?.role}</code>
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
                <Users className="w-5 h-5 text-[var(--color-brand-blue)] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900">User Provisioning Enabled</p>
                  <p className="text-xs text-blue-800 mt-1">
                    Administrators can add Staff and Intern accounts with phone numbers. Added members can immediately sign in using Phone OTP.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
              <h2 className="text-base font-bold text-[var(--color-brand-navy)]">
                Admin Details
              </h2>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[var(--color-border-subtle)]">
                <span className="text-[var(--color-text-secondary)]">User ID</span>
                <span className="font-semibold text-[var(--color-brand-navy)]">{user?.userId || 'ADM-001'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[var(--color-border-subtle)]">
                <span className="text-[var(--color-text-secondary)]">Phone</span>
                <span className="font-semibold text-[var(--color-brand-navy)]">{user?.phoneNumber || '0774943291'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[var(--color-border-subtle)]">
                <span className="text-[var(--color-text-secondary)]">Department</span>
                <span className="font-semibold text-[var(--color-brand-navy)]">{user?.department || 'AI & Data'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[var(--color-text-secondary)]">Account Status</span>
                <Badge size="sm" variant="success">ACTIVE</Badge>
              </div>
            </div>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                rightIcon={<ArrowUpRight className="w-4 h-4" />}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Back to Top
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* ── ADD NEW USER MODAL ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70 rounded-t-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-blue-light)] text-[var(--color-brand-blue)] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Add New Team Member</h3>
                  <p className="text-[11px] text-slate-500">Provision a new user account with phone OTP access</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateUser} className="p-5 space-y-4">
              <Input
                id="modal-fullName"
                label="Full Name"
                placeholder="e.g. Nimal Fernando"
                type="text"
                required
                value={newUserForm.fullName}
                onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  id="modal-phone"
                  label="Mobile Phone Number (For OTP Login)"
                  placeholder="e.g. 0778899001"
                  type="tel"
                  required
                  value={newUserForm.phoneNumber}
                  onChange={(e) => setNewUserForm({ ...newUserForm, phoneNumber: e.target.value })}
                  leftIcon={<Smartphone className="w-4 h-4 text-slate-400" />}
                />

                <Input
                  id="modal-email"
                  label="Email Address"
                  placeholder="e.g. nimal@aidata.com"
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  User Role <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'PERMANENT_STAFF', label: 'Permanent Staff', badge: 'Staff' },
                    { id: 'INTERN', label: 'Intern Trainee', badge: 'Intern' },
                    { id: 'ADMIN', label: 'Administrator', badge: 'Admin' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() =>
                        setNewUserForm({
                          ...newUserForm,
                          role: r.id as 'ADMIN' | 'PERMANENT_STAFF' | 'INTERN',
                        })
                      }
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        newUserForm.role === r.id
                          ? 'border-[var(--color-brand-blue)] bg-blue-50/70 text-[var(--color-brand-blue)] font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <p className="text-xs">{r.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  id="modal-designation"
                  label="Designation / Title"
                  placeholder="e.g. Senior AI Engineer"
                  type="text"
                  value={newUserForm.designation}
                  onChange={(e) => setNewUserForm({ ...newUserForm, designation: e.target.value })}
                  leftIcon={<Briefcase className="w-4 h-4 text-slate-400" />}
                />

                <Input
                  id="modal-department"
                  label="Department"
                  placeholder="AI & Data Team"
                  type="text"
                  value={newUserForm.department}
                  onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
                  leftIcon={<Building className="w-4 h-4 text-slate-400" />}
                />
              </div>

              <Input
                id="modal-password"
                label="Initial Password (Optional)"
                placeholder="User@123 (Default)"
                type="text"
                value={newUserForm.password}
                onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              />

              {/* Informational tip */}
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[var(--color-brand-blue)] shrink-0 mt-0.5" />
                <span>
                  The new user will be able to log in immediately using their phone number (<code>{newUserForm.phoneNumber || '077xxxxxxx'}</code>) via SMS OTP.
                </span>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSubmittingNewUser}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmittingNewUser}
                  leftIcon={<UserPlus className="w-4 h-4" />}
                >
                  {isSubmittingNewUser ? 'Creating User…' : 'Add User & Enable Access'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
