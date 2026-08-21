import { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  TrendingUp,
  History,
  User,
  ShieldCheck,
} from 'lucide-react';
import {
  DashboardLayout,
  PageHeader,
  type NavSection,
  type UserDisplayInfo,
} from '../../components/layout/DashboardLayout';
import { Card, Button, Badge, Alert, EmptyState } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

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
        label: 'Progress Updates',
        path: '/staff/progress',
        icon: <TrendingUp className="w-4 h-4" />,
        disabled: true,
      },
      {
        id: 'staff-history',
        label: 'Work History',
        path: '/staff/work-history',
        icon: <History className="w-4 h-4" />,
        disabled: true,
      },
      {
        id: 'staff-profile',
        label: 'My Profile',
        path: '/staff/profile',
        icon: <User className="w-4 h-4" />,
        disabled: true,
      },
    ],
  },
];

export default function StaffDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);

  const userDisplay: UserDisplayInfo = {
    name: user?.fullName || '—',
    email: user?.email || '—',
    roleLabel: 'Permanent Staff',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
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
        title="Permanent Staff Dashboard"
        description="View your assigned projects, track work-item progress, and review work history. Progress calculations are derived automatically from completed work-item weights."
        breadcrumbs={[{ label: 'Workspace' }, { label: 'Staff Dashboard' }]}
        badge={<Badge variant="success">Permanent Staff</Badge>}
      />

      <div className="space-y-6">
        {showWelcome && (
          <Alert
            variant="success"
            title="Authentication Verified"
            onClose={() => setShowWelcome(false)}
          >
            Welcome, <strong>{user?.fullName || '—'}</strong>! You have securely logged in to your <strong>Permanent Staff</strong> workspace.
          </Alert>
        )}

        {/* Staff Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              title: 'Assigned Projects',
              value: '—',
              subtext: 'Awaiting data integration',
              badge: 'Projects',
              badgeVariant: 'blue' as const,
            },
            {
              title: 'Assigned Work Items',
              value: '—',
              subtext: 'Awaiting data integration',
              badge: 'Work Items',
              badgeVariant: 'blue' as const,
            },
            {
              title: 'Completed Work Items',
              value: '—',
              subtext: 'Awaiting data integration',
              badge: 'Completed',
              badgeVariant: 'success' as const,
            },
            {
              title: 'Overall Contribution',
              value: '—',
              subtext: 'Awaiting data integration',
              badge: 'Contribution',
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

        {/* Assigned Projects Overview */}
        <Card title="Assigned Projects" subtitle="Overview of projects currently assigned to you">
          <EmptyState
            icon={<FolderKanban className="w-6 h-6 text-slate-400" />}
            title="No assigned projects available"
            description="Projects assigned to your Staff account will appear here once project assignment data is connected."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/staff/projects')}
              >
                View Assigned Projects
              </Button>
            }
          />
        </Card>

        {/* My Work Items Overview */}
        <Card padding="none" title="My Work Items" subtitle="Tasks and work items assigned to your profile">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse min-w-[800px]" aria-label="My Work Items Table">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4">Work Item</th>
                  <th scope="col" className="py-3 px-4">Project</th>
                  <th scope="col" className="py-3 px-4">Required Role</th>
                  <th scope="col" className="py-3 px-4 text-center">Weight</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4 text-right">Contribution</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="p-8">
                    <EmptyState
                      icon={<CheckSquare className="w-6 h-6 text-slate-400" />}
                      title="No work items available"
                      description="Your assigned project work items will appear here once work-item data is connected."
                      action={
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/staff/work-items')}
                        >
                          View My Work Items
                        </Button>
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Work Progress Overview */}
        <Card
          title="Work Progress Overview"
          subtitle="Progress metrics derived from completed work item weights"
          headerAction={
            <Button variant="outline" size="sm" disabled title="Awaiting frontend implementation">
              View Progress
            </Button>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-slate-500 font-medium">Assigned Weight</p>
              <p className="text-slate-800 font-bold mt-0.5 text-lg">—</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-slate-500 font-medium">Completed Weight</p>
              <p className="text-slate-800 font-bold mt-0.5 text-lg">—</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-slate-500 font-medium">Remaining Weight</p>
              <p className="text-slate-800 font-bold mt-0.5 text-lg">—</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-slate-500 font-medium">Contribution</p>
              <p className="text-slate-800 font-bold mt-0.5 text-lg">—</p>
            </div>
          </div>
        </Card>

        {/* Recent Work History */}
        <Card padding="none" title="Recent Work History" subtitle="Your completed and historical project work items">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse min-w-[800px]" aria-label="Recent Work History Table">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4">Project</th>
                  <th scope="col" className="py-3 px-4">Work Item</th>
                  <th scope="col" className="py-3 px-4">Required Role</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4 text-center">Weight</th>
                  <th scope="col" className="py-3 px-4 text-right">Completion Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="p-8">
                    <EmptyState
                      icon={<History className="w-6 h-6 text-slate-400" />}
                      title="No work history available"
                      description="Your completed and historical project work will appear here once work records are connected."
                      action={
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          title="Awaiting frontend implementation"
                        >
                          View Work History
                        </Button>
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Staff Profile Summary */}
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
            <div>
              <h2 className="text-base font-bold text-[var(--color-brand-navy)]">
                Staff Profile Information
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Awaiting profile integration
              </p>
            </div>
            <ShieldCheck className="w-5 h-5 text-[var(--color-brand-green)]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-slate-500 font-medium">User ID</p>
              <p className="text-slate-800 font-bold mt-0.5">—</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-slate-500 font-medium">Professional Role</p>
              <p className="text-slate-800 font-bold mt-0.5">—</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-slate-500 font-medium">Employment Type</p>
              <p className="text-slate-800 font-bold mt-0.5">—</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-slate-500 font-medium">Verification Status</p>
              <p className="text-slate-800 font-bold mt-0.5">—</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
