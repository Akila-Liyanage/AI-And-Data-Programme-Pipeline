import { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  TrendingUp,
  History,
  User,
  Plus,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import {
  DashboardLayout,
  PageHeader,
  type NavSection,
  type UserDisplayInfo,
} from '../../components/layout/DashboardLayout';
import { Card, Button, Badge, Alert } from '../../components/common';
import type { BadgeVariant } from '../../components/common';

/**
 * Sample navigation items for visual shell preview only.
 * Will be supplied per role when specific role dashboards are built.
 */
const SAMPLE_NAVIGATION: NavSection[] = [
  {
    title: 'Overview',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard Overview',
        path: '/dashboard-preview',
        icon: <LayoutDashboard className="w-4 h-4" />,
      },
      {
        id: 'projects',
        label: 'Projects Pipeline',
        path: '/dashboard-preview/projects',
        icon: <FolderKanban className="w-4 h-4" />,
        badge: '12',
        badgeVariant: 'blue',
      },
    ],
  },
  {
    title: 'Programme',
    items: [
      {
        id: 'progress',
        label: 'Milestones & Progress',
        path: '/dashboard-preview/progress',
        icon: <TrendingUp className="w-4 h-4" />,
      },
      {
        id: 'history',
        label: 'Work History',
        path: '/dashboard-preview/history',
        icon: <History className="w-4 h-4" />,
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        id: 'profile',
        label: 'User Profile',
        path: '/dashboard-preview/profile',
        icon: <User className="w-4 h-4" />,
      },
    ],
  },
];

/**
 * Sample neutral display info for visual testing of the header and sidebar.
 * Does NOT represent an authenticated session.
 */
const SAMPLE_USER_DISPLAY: UserDisplayInfo = {
  name: 'Preview Account',
  email: 'preview.user@company.com',
  roleLabel: 'Shell Preview',
};

/**
 * Development-Only Dashboard Shell Preview
 *
 * Used purely to verify:
 * - Desktop sidebar & header layout
 * - Mobile slide-over drawer and hamburger trigger
 * - PageHeader composition with breadcrumbs & actions
 * - Enterprise spacing and responsive breakpoints
 */
export default function DashboardPreviewPage() {
  const [showNotice, setShowNotice] = useState(true);

  return (
    <DashboardLayout
      navigation={SAMPLE_NAVIGATION}
      user={SAMPLE_USER_DISPLAY}
      notificationsCount={3}
      onNotificationClick={() => alert('Notifications clicked (UI Preview)')}
      onProfileClick={() => alert('Profile clicked (UI Preview)')}
      onLogoutClick={() => alert('Sign out clicked (UI Preview)')}
    >
      {/* ── Reusable PageHeader Component ─────────────────────── */}
      <PageHeader
        title="Dashboard Shell Preview"
        description="Shared enterprise layout shell for AI & Data Programme Pipeline dashboards."
        breadcrumbs={[
          { label: 'Programme' },
          { label: 'Workspace' },
          { label: 'Overview' },
        ]}
        badge={<Badge variant="blue">Layout Milestone</Badge>}
        actions={
          <>
            <Button variant="outline" size="sm">
              Export View
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              New Action
            </Button>
          </>
        }
      />

      {/* ── Content Preview Container ─────────────────────────── */}
      <div className="space-y-6">
        {/* Milestone Note */}
        {showNotice && (
          <Alert
            variant="info"
            title="Development Preview Notice"
            onClose={() => setShowNotice(false)}
          >
            This is a pure UI shell preview to verify the responsive dashboard
            layout, sidebar, header, and typography. No backend authentication or
            role-specific data is active.
          </Alert>
        )}

        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              title: 'Layout Structure',
              value: 'Verified',
              subtext: 'Responsive 3-tier grid',
              badge: 'Shell Ready',
              badgeVariant: 'success' as BadgeVariant,
            },
            {
              title: 'Sidebar Navigation',
              value: '260px',
              subtext: 'Desktop sticky / Mobile drawer',
              badge: 'Adaptive',
              badgeVariant: 'blue' as BadgeVariant,
            },
            {
              title: 'Top Header',
              value: '64px',
              subtext: 'Profile menu + Notifications',
              badge: 'Interactive',
              badgeVariant: 'blue' as BadgeVariant,
            },
            {
              title: 'Accessibility',
              value: 'WCAG',
              subtext: 'ARIA roles & focus rings',
              badge: 'Compliant',
              badgeVariant: 'success' as BadgeVariant,
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

        {/* Content Area Demonstration */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card padding="lg" className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
              <div>
                <h2 className="text-base font-bold text-[var(--color-brand-navy)]">
                  Main Content Region
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Designed to host future role-specific dashboard tables, project cards, and analytics
                </p>
              </div>
              <Badge variant="neutral">Responsive Container</Badge>
            </div>

            <div className="p-6 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)] space-y-3 text-xs text-[var(--color-text-secondary)] leading-relaxed">
              <p className="font-semibold text-[var(--color-brand-navy)]">
                Enterprise Dashboard Shell Features:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-1">
                <li>Clean text-based product emblem (zero fake corporate logos)</li>
                <li>Desktop sticky sidebar navigation with badge indicators</li>
                <li>Mobile slide-over navigation drawer with backdrop & keyboard dismiss (Escape)</li>
                <li>Fixed/sticky header with profile dropdown trigger and notification button</li>
                <li>Compositional PageHeader with breadcrumbs, action buttons, and description</li>
                <li>SLT-MOBITEL inspired palette (`#0057A8` Blue, `#00A651` Green, `#0B1F3A` Navy)</li>
              </ul>
            </div>
          </Card>

          <Card padding="lg" className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
              <h2 className="text-base font-bold text-[var(--color-brand-navy)]">
                Layout Details
              </h2>
              <Info className="w-4 h-4 text-[var(--color-brand-blue)]" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[var(--color-border-subtle)]">
                <span className="text-[var(--color-text-secondary)]">Desktop Width</span>
                <span className="font-semibold text-[var(--color-brand-navy)]">Fixed 260px</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[var(--color-border-subtle)]">
                <span className="text-[var(--color-text-secondary)]">Drawer Transition</span>
                <span className="font-semibold text-[var(--color-brand-navy)]">200ms ease-in-out</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[var(--color-border-subtle)]">
                <span className="text-[var(--color-text-secondary)]">Content Padding</span>
                <span className="font-semibold text-[var(--color-brand-navy)]">16px - 32px</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[var(--color-text-secondary)]">Theme Mode</span>
                <span className="font-semibold text-[var(--color-brand-navy)]">Enterprise Light</span>
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
