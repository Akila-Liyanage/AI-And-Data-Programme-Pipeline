import { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import {
  DashboardLayout,
  PageHeader,
  type UserDisplayInfo,
} from '../../components/layout/DashboardLayout';
import { Card, Button, Badge, Alert } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ADMIN_NAVIGATION } from '../../config/adminNavigation';


export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || 'Akila Liyanage',
    email: user?.email || 'admin@aidata.com',
    roleLabel: 'Administrator',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
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
      <PageHeader
        title="Admin Control Center"
        description="Comprehensive oversight of users, projects, assignments, and programme progress."
        breadcrumbs={[{ label: 'Administration' }, { label: 'Admin Dashboard' }]}
        badge={<Badge variant="blue">System Administrator</Badge>}
        actions={
          <>
            <Button variant="outline" size="sm">
              Generate Report
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Project / User
            </Button>
          </>
        }
      />

      <div className="space-y-6">
        {showWelcome && (
          <Alert
            variant="success"
            title="Authentication Verified"
            onClose={() => setShowWelcome(false)}
          >
            Welcome back, <strong>{user?.fullName}</strong>! You have securely logged in with <strong>Administrator</strong> privileges.
          </Alert>
        )}

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              title: 'Total Programme Projects',
              value: '12',
              subtext: '4 Ongoing · 6 Completed',
              badge: 'Pipeline',
              badgeVariant: 'blue' as const,
            },
            {
              title: 'Total Active Users',
              value: '3',
              subtext: '1 Admin · 1 Staff · 1 Intern',
              badge: 'Staff & Interns',
              badgeVariant: 'success' as const,
            },
            {
              title: 'Project Assignments',
              value: '8',
              subtext: 'Active workload allocations',
              badge: 'Assigned',
              badgeVariant: 'blue' as const,
            },
            {
              title: 'System Access Status',
              value: 'Secured',
              subtext: 'Role-Based Access Active',
              badge: 'JWT Protected',
              badgeVariant: 'success' as const,
            },
          ].map((card) => (
            <Card key={card.title} padding="md" className="space-y-3">
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

        {/* Main Administrative Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card padding="lg" className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
              <div>
                <h2 className="text-base font-bold text-[var(--color-brand-navy)]">
                  Active Admin Operations
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Week 1 Foundation verified: Authentication, User Role Mapping, RBAC Routing.
                </p>
              </div>
              <Badge variant="success">Week 1 Ready</Badge>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[var(--color-brand-green)] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Authenticated Session</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Logged in as: <strong>{user?.fullName}</strong> ({user?.userId}) — Role: <code>{user?.role}</code>
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
                <Users className="w-5 h-5 text-[var(--color-brand-blue)] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900">Next Planned Milestone: Week 2</p>
                  <p className="text-xs text-blue-800 mt-1">
                    User Management CRUD, Project Creation, and User-to-Project Assignment interfaces.
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
                <span className="text-[var(--color-text-secondary)]">Username</span>
                <span className="font-semibold text-[var(--color-brand-navy)]">{user?.username || 'admin'}</span>
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
    </DashboardLayout>
  );
}
