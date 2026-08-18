import { useState } from 'react';
import {
  Button,
  Input,
  Card,
  Badge,
  Alert,
  Spinner,
  Skeleton,
  LoadingState,
  EmptyState,
  BrandLogo,
} from './components/common';
import {
  Send,
  Plus,
  Trash2,
  CheckCircle,
  Search,
  Mail,
  Lock,
  Layers,
  FolderKanban,
  Users,
} from 'lucide-react';

export default function App() {
  const [btnLoading, setBtnLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [passwordValue, setPasswordValue] = useState('SecretPassword123');
  const [errorInput, setErrorInput] = useState('');

  return (
    <div className="min-h-screen bg-[var(--color-app-bg)] text-[var(--color-text-primary)]">
      {/* Top Corporate Showcase Header */}
      <header className="bg-[var(--color-surface-white)] border-b border-[var(--color-border-subtle)] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <BrandLogo size="md" />
          <div className="flex items-center gap-3">
            <Badge variant="blue" dot>
              Foundation Ready
            </Badge>
            <Badge variant="neutral">Design System v1.0</Badge>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Intro Banner */}
        <div className="bg-[var(--color-surface-white)] border border-[var(--color-border-subtle)] rounded-xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-[var(--color-brand-navy)] tracking-tight">
                Enterprise Design System Showcase
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)]">
                SLT-MOBITEL corporate color language, typography hierarchy, and foundational UI primitives.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                isLoading={btnLoading}
                onClick={() => {
                  setBtnLoading(true);
                  setTimeout(() => setBtnLoading(false), 1500);
                }}
              >
                Simulate Loading
              </Button>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        {showAlert && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
              Enterprise Alerts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Alert
                variant="info"
                title="Corporate Information"
                onClose={() => setShowAlert(false)}
              >
                Unified authentication portal for Administrator, Permanent Staff, and Intern roles.
              </Alert>
              <Alert
                variant="success"
                title="System Operational"
              >
                Tokens and theme variables configured with Tailwind CSS v4 CSS-first architecture.
              </Alert>
              <Alert
                variant="warning"
                title="Access Restriction"
              >
                Account activation required upon first-time login before dashboard access is granted.
              </Alert>
              <Alert
                variant="error"
                title="Validation Required"
              >
                Ensure password criteria are met before continuing with credentials setup.
              </Alert>
            </div>
          </section>
        )}

        {/* Buttons & Badges Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Buttons Card */}
          <Card
            title="Buttons & Actions"
            subtitle="Variants, sizes, loading states, and icon placements"
            padding="md"
          >
            <div className="space-y-5">
              <div>
                <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2.5">
                  Color Variants
                </p>
                <div className="flex flex-wrap gap-2.5 items-center">
                  <Button variant="primary">Primary Blue</Button>
                  <Button variant="green">Green Accent</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger" leftIcon={<Trash2 className="w-4 h-4" />}>
                    Danger
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2.5">
                  Sizes & Icon Support
                </p>
                <div className="flex flex-wrap gap-2.5 items-center">
                  <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                    Small Action
                  </Button>
                  <Button size="md" rightIcon={<Send className="w-4 h-4" />}>
                    Medium Submit
                  </Button>
                  <Button size="lg" leftIcon={<CheckCircle className="w-4 h-4" />}>
                    Large CTA
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2.5">
                  Interactive States
                </p>
                <div className="flex flex-wrap gap-2.5 items-center">
                  <Button isLoading>Processing...</Button>
                  <Button disabled>Disabled Button</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Badges & Typography Card */}
          <Card
            title="Status Badges & Tokens"
            subtitle="Context-agnostic indicator pills and status colors"
            padding="md"
          >
            <div className="space-y-5">
              <div>
                <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2.5">
                  Standard Status Badges
                </p>
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge variant="neutral">Neutral Draft</Badge>
                  <Badge variant="info">Info / General</Badge>
                  <Badge variant="success">Active / Completed</Badge>
                  <Badge variant="warning">Pending Review</Badge>
                  <Badge variant="error">Critical / Blocked</Badge>
                  <Badge variant="blue">SLT Corporate</Badge>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2.5">
                  Status Badges with Indicator Dots
                </p>
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge variant="success" dot>
                    Active Session
                  </Badge>
                  <Badge variant="warning" dot>
                    Password Change Required
                  </Badge>
                  <Badge variant="error" dot>
                    Suspended
                  </Badge>
                  <Badge variant="blue" dot>
                    Verified Identity
                  </Badge>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--color-border-subtle)]">
                <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">
                  Brand Color Swatches
                </p>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-medium">
                  <div className="p-2 rounded-lg bg-[var(--color-brand-blue)] text-white">
                    #0057A8 Blue
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--color-brand-green)] text-white">
                    #00A651 Green
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--color-brand-navy)] text-white">
                    #0B1F3A Navy
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Inputs & Form Elements Section */}
        <section>
          <Card
            title="Form Inputs & Accessible Fields"
            subtitle="Floating validation states, password toggles, and icon integrations"
            padding="md"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Corporate Email Address"
                placeholder="user@slt.lk"
                required
                leftIcon={<Mail className="w-4 h-4" />}
                helperText="Use your assigned organization email."
              />

              <Input
                label="Account Password"
                type="password"
                required
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                helperText="Click eye icon to toggle visibility."
              />

              <Input
                label="Search Term with Validation"
                placeholder="Type to test error state..."
                value={errorInput}
                onChange={(e) => setErrorInput(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
                error={errorInput.length > 0 && errorInput.length < 3 ? 'Minimum 3 characters required' : undefined}
                helperText={!errorInput ? 'Type fewer than 3 letters to see error state.' : undefined}
              />
            </div>
          </Card>
        </section>

        {/* Feedback, Loading & Empty States Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Loading & Skeleton Card */}
          <Card
            title="Loading Indicators & Skeletons"
            subtitle="Clean feedback indicators during asynchronous operations"
            padding="md"
          >
            <div className="space-y-5">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  <span className="text-xs text-[var(--color-text-secondary)]">Small</span>
                </div>
                <div className="flex items-center gap-2">
                  <Spinner size="md" variant="green" />
                  <span className="text-xs text-[var(--color-text-secondary)]">Green</span>
                </div>
                <div className="flex items-center gap-2">
                  <Spinner size="lg" />
                  <span className="text-xs text-[var(--color-text-secondary)]">Large</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[var(--color-border-subtle)]">
                <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                  Skeleton Placeholder Sample
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Skeleton variant="circular" className="w-10 h-10 shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full rounded-lg" />
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--color-border-subtle)]">
                <LoadingState message="Fetching project pipeline metrics..." minHeight="min-h-[100px]" />
              </div>
            </div>
          </Card>

          {/* Empty State Card */}
          <Card
            title="Enterprise Empty State"
            subtitle="Polished empty states for data tables, lists, and project views"
            padding="md"
          >
            <EmptyState
              icon={<FolderKanban className="w-6 h-6 text-[var(--color-brand-blue)]" />}
              title="No Projects Assigned Yet"
              description="Your account currently has no active project assignments. Check available programmes or contact your administrator."
              action={
                <Button variant="primary" size="sm" leftIcon={<Layers className="w-3.5 h-3.5" />}>
                  Explore Pipeline
                </Button>
              }
              secondaryAction={
                <Button variant="outline" size="sm" leftIcon={<Users className="w-3.5 h-3.5" />}>
                  Contact Admin
                </Button>
              }
            />
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-[var(--color-text-secondary)] border-t border-[var(--color-border-subtle)] mt-12">
        AI & Data Programme Pipeline — Staff & Intern Progress Dashboard · Enterprise Frontend Foundation
      </footer>
    </div>
  );
}
