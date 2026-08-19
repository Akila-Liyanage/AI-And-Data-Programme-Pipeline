import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Badge,
  BrandLogo,
} from '../../components/common';
import {
  ArrowRight,
  FolderKanban,
  Users,
  TrendingUp,
  ShieldCheck,
  Layers,
  Activity,
  CheckCircle2,
  Menu,
  X,
  Lock,
  Compass,
  Briefcase,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-app-bg)] text-[var(--color-text-primary)] flex flex-col selection:bg-[var(--color-brand-blue-light)] selection:text-[var(--color-brand-blue)]">
      {/* ========================================================================= */}
      {/* 1. Header / Navigation                                                    */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[var(--color-surface-white)]/95 backdrop-blur-xs border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand */}
          <div className="flex items-center">
            <BrandLogo size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-brand-blue)] transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('overview')}
              className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-brand-blue)] transition-colors cursor-pointer"
            >
              Platform Overview
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('roles')}
              className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-brand-blue)] transition-colors cursor-pointer"
            >
              Programme Roles
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('workflow')}
              className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-brand-blue)] transition-colors cursor-pointer"
            >
              Workflow
            </button>
          </nav>

          {/* Right: Primary Navigation CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Lock className="w-4 h-4" />}
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-subtle)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-brand-blue)]/20"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[var(--color-surface-white)] border-b border-[var(--color-border-subtle)] px-4 pt-3 pb-5 space-y-3 animate-fadeIn">
            <nav className="flex flex-col space-y-2">
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-surface-subtle)] rounded-lg transition-colors"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('overview')}
                className="text-left px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] rounded-lg transition-colors"
              >
                Platform Overview
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('roles')}
                className="text-left px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] rounded-lg transition-colors"
              >
                Programme Roles
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('workflow')}
                className="text-left px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] rounded-lg transition-colors"
              >
                Workflow
              </button>
            </nav>
            <div className="pt-2 border-t border-[var(--color-border-subtle)]">
              <Button
                variant="primary"
                fullWidth
                leftIcon={<Lock className="w-4 h-4" />}
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
              >
                Sign In to Workspace
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. Hero Section                                                           */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-white)]">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#E4E7EC_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center">
                <Badge variant="blue" dot size="md">
                  AI & Data Programme
                </Badge>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--color-brand-navy)] leading-[1.18]">
                One Platform. <br />
                <span className="text-[var(--color-brand-blue)]">Clear Progress.</span> <br />
                Better Collaboration.
              </h1>

              {/* Supporting Description */}
              <p className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
                A centralized workspace for managing AI & Data projects, team assignments, intern activities and programme progress.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => navigate('/login')}
                >
                  Sign In to Workspace
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={<Compass className="w-4 h-4" />}
                  onClick={() => scrollToSection('overview')}
                >
                  Explore Platform
                </Button>
              </div>

              {/* Trust & Structure Note */}
              <div className="pt-4 flex items-center gap-6 text-xs text-[var(--color-text-secondary)] border-t border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-brand-green)] shrink-0" />
                  <span>Role-Guided Workflows</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-brand-green)] shrink-0" />
                  <span>Centralized Dashboard</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-brand-green)] shrink-0" />
                  <span>Secure Enterprise Access</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual (Enterprise Platform Preview Mockup) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative border card representing abstract UI */}
                <div className="bg-[var(--color-surface-white)] rounded-2xl border border-[var(--color-border-subtle)] shadow-[0_12px_32px_rgba(11,31,58,0.08)] p-5 sm:p-6 space-y-5">
                  {/* Mock Window Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-subtle)]">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#EF4444]/80" />
                      <div className="w-3 h-3 rounded-full bg-[#F59E0B]/80" />
                      <div className="w-3 h-3 rounded-full bg-[#10B981]/80" />
                      <span className="ml-2 text-xs font-semibold text-[var(--color-brand-navy)]">
                        Pipeline Dashboard Overview
                      </span>
                    </div>
                    <Badge variant="success" dot size="sm">
                      Live
                    </Badge>
                  </div>

                  {/* Mock KPI Mini Stats */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-[var(--color-app-bg)] p-2.5 rounded-lg border border-[var(--color-border-subtle)]">
                      <p className="text-[11px] text-[var(--color-text-secondary)] font-medium">Projects</p>
                      <p className="text-base font-bold text-[var(--color-brand-navy)]">18</p>
                    </div>
                    <div className="bg-[var(--color-app-bg)] p-2.5 rounded-lg border border-[var(--color-border-subtle)]">
                      <p className="text-[11px] text-[var(--color-text-secondary)] font-medium">Active Staff</p>
                      <p className="text-base font-bold text-[var(--color-brand-blue)]">24</p>
                    </div>
                    <div className="bg-[var(--color-app-bg)] p-2.5 rounded-lg border border-[var(--color-border-subtle)]">
                      <p className="text-[11px] text-[var(--color-text-secondary)] font-medium">Intern Cohort</p>
                      <p className="text-base font-bold text-[var(--color-brand-green)]">32</p>
                    </div>
                  </div>

                  {/* Mock Project Progress Card 1 */}
                  <div className="p-3.5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                        AI Analytics & Prediction Engine
                      </span>
                      <span className="text-[11px] font-bold text-[var(--color-brand-green)]">
                        82% Completed
                      </span>
                    </div>
                    <div className="w-full bg-[var(--color-border-subtle)] h-2 rounded-full overflow-hidden">
                      <div className="bg-[var(--color-brand-green)] h-full rounded-full w-[82%]" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[var(--color-text-secondary)] pt-0.5">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-[var(--color-brand-blue)]" /> 4 Assigned
                      </span>
                      <span className="font-medium text-[var(--color-text-primary)]">Sprint 04</span>
                    </div>
                  </div>

                  {/* Mock Project Progress Card 2 */}
                  <div className="p-3.5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                        Data Ingestion & Governance Pipeline
                      </span>
                      <span className="text-[11px] font-bold text-[var(--color-brand-blue)]">
                        64% Completed
                      </span>
                    </div>
                    <div className="w-full bg-[var(--color-border-subtle)] h-2 rounded-full overflow-hidden">
                      <div className="bg-[var(--color-brand-blue)] h-full rounded-full w-[64%]" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[var(--color-text-secondary)] pt-0.5">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-[var(--color-brand-blue)]" /> 6 Assigned
                      </span>
                      <span className="font-medium text-[var(--color-text-primary)]">In Progress</span>
                    </div>
                  </div>

                  {/* Mock Role Activity Tagline */}
                  <div className="flex items-center justify-between px-3 py-2 bg-[var(--color-brand-blue-light)] rounded-lg text-xs text-[var(--color-brand-blue)] font-medium">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> Single Secure Portal
                    </span>
                    <span>Role-Based Access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. Platform Overview Section (id="overview")                             */}
      {/* ========================================================================= */}
      <section id="overview" className="py-16 sm:py-20 lg:py-24 bg-[var(--color-app-bg)] scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="blue" size="md">
              Platform Overview
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-brand-navy)]">
              Everything in One Workspace
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Managing AI & Data initiatives across disconnected channels leads to fragmented progress and lost insights.
              This platform brings project definitions, team assignments, and programme oversight into a unified internal system.
            </p>
          </div>

          {/* 3 Capability Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1: Project Visibility */}
            <Card padding="lg" className="h-full flex flex-col justify-between border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-brand-blue-light)] text-[var(--color-brand-blue)] flex items-center justify-center">
                  <FolderKanban className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-brand-navy)]">
                  Project Visibility
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  View project information, assignments, status and programme activity from a centralized workspace.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[var(--color-border-subtle)] text-xs font-medium text-[var(--color-brand-blue)] flex items-center gap-1">
                <span>Centralized Data</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Card>

            {/* Card 2: Team Collaboration */}
            <Card padding="lg" className="h-full flex flex-col justify-between border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-brand-green-light)] text-[var(--color-brand-green)] flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-brand-navy)]">
                  Team Collaboration
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Keep administrators, permanent staff and interns connected to their relevant project responsibilities.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[var(--color-border-subtle)] text-xs font-medium text-[var(--color-brand-green)] flex items-center gap-1">
                <span>Unified Roles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Card>

            {/* Card 3: Progress Tracking */}
            <Card padding="lg" className="h-full flex flex-col justify-between border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-brand-blue-light)] text-[var(--color-brand-blue)] flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-brand-navy)]">
                  Progress Tracking
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Provide clear visibility into ongoing work, project progress and programme activity.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[var(--color-border-subtle)] text-xs font-medium text-[var(--color-brand-blue)] flex items-center gap-1">
                <span>Clear Milestones</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. User Role Overview Section (id="roles")                                */}
      {/* ========================================================================= */}
      <section id="roles" className="py-16 sm:py-20 lg:py-24 bg-[var(--color-surface-white)] border-y border-[var(--color-border-subtle)] scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="blue" size="md">
              Role-Based Architecture
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-brand-navy)]">
              Built for Every Programme Role
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Every stakeholder interacts with tailored views designed around their specific responsibilities,
              all accessed through a single authorized sign-in portal.
            </p>
          </div>

          {/* 3 Informational Role Cards (strictly non-interactive) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Role 1: Administrator */}
            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] p-6 sm:p-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-navy)] text-white flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <Badge variant="neutral">System Admin</Badge>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-[var(--color-brand-navy)]">
                    Administrator
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Manage users, projects, assignments and overall programme progress.
                  </p>
                </div>

                <div className="pt-2 space-y-2">
                  <p className="text-xs font-semibold text-[var(--color-brand-navy)] uppercase tracking-wider">
                    Key Responsibilities:
                  </p>
                  <ul className="space-y-1.5 text-xs text-[var(--color-text-secondary)]">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)]" />
                      <span>User Management & Onboarding</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)]" />
                      <span>Project Oversight & Governance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)]" />
                      <span>Assignment Management & Resource Allocation</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-border-subtle)] text-[11px] text-[var(--color-text-secondary)]">
                Admin credentials configured by system seeding and invitation.
              </div>
            </div>

            {/* Role 2: Permanent Staff */}
            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] p-6 sm:p-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-blue)] text-white flex items-center justify-center">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <Badge variant="blue">Staff Lead</Badge>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-[var(--color-brand-navy)]">
                    Permanent Staff
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Access assigned projects, current work and progress information.
                  </p>
                </div>

                <div className="pt-2 space-y-2">
                  <p className="text-xs font-semibold text-[var(--color-brand-navy)] uppercase tracking-wider">
                    Key Responsibilities:
                  </p>
                  <ul className="space-y-1.5 text-xs text-[var(--color-text-secondary)]">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)]" />
                      <span>Assigned Projects & Workstreams</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)]" />
                      <span>Current Work & Activity Updates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)]" />
                      <span>Progress Visibility & Milestone Tracking</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-border-subtle)] text-[11px] text-[var(--color-text-secondary)]">
                Accounts provisioned by programme administration.
              </div>
            </div>

            {/* Role 3: Intern */}
            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] p-6 sm:p-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-green)] text-white flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <Badge variant="success">Internship</Badge>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-[var(--color-brand-navy)]">
                    Intern
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Access assigned project work, internship progress and eligible project opportunities.
                  </p>
                </div>

                <div className="pt-2 space-y-2">
                  <p className="text-xs font-semibold text-[var(--color-brand-navy)] uppercase tracking-wider">
                    Key Responsibilities:
                  </p>
                  <ul className="space-y-1.5 text-xs text-[var(--color-text-secondary)]">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-green)]" />
                      <span>Project Work & Task Completion</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-green)]" />
                      <span>Progress Tracking & Work History</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-green)]" />
                      <span>Eligible Project Discovery & Enrollment</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-border-subtle)] text-[11px] text-[var(--color-text-secondary)]">
                Intern onboarding activated through admin invitation.
              </div>
            </div>
          </div>

          {/* Unified Access Note */}
          <div className="max-w-2xl mx-auto p-4 rounded-xl bg-[var(--color-brand-blue-light)] border border-[#BFDBFE] flex items-center justify-center gap-2.5 text-xs sm:text-sm text-[var(--color-brand-blue)] text-center font-medium">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>
              All roles sign in through the single combined Login Portal. Verified roles are authenticated automatically.
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. Simple Process Section (id="workflow")                                 */}
      {/* ========================================================================= */}
      <section id="workflow" className="py-16 sm:py-20 lg:py-24 bg-[var(--color-app-bg)] scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="blue" size="md">
              Operating Process
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-brand-navy)]">
              A Simple, Controlled Workflow
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Structured operational lifecycle ensuring governance, clear task ownership, and continuous progress monitoring.
            </p>
          </div>

          {/* 3 Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1: Access */}
            <div className="bg-[var(--color-surface-white)] border border-[var(--color-border-subtle)] rounded-xl p-6 sm:p-7 space-y-4 relative shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[var(--color-brand-blue-light)] text-[var(--color-brand-blue)]">
                  Step 01
                </span>
                <ShieldCheck className="w-5 h-5 text-[var(--color-brand-blue)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-brand-navy)]">
                Access
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Authorized users securely sign in to the platform through the combined enterprise portal.
              </p>
            </div>

            {/* Step 2: Work */}
            <div className="bg-[var(--color-surface-white)] border border-[var(--color-border-subtle)] rounded-xl p-6 sm:p-7 space-y-4 relative shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[var(--color-brand-green-light)] text-[var(--color-brand-green)]">
                  Step 02
                </span>
                <Layers className="w-5 h-5 text-[var(--color-brand-green)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-brand-navy)]">
                Work
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Users access projects and activities relevant to their responsibilities and assigned roles.
              </p>
            </div>

            {/* Step 3: Track */}
            <div className="bg-[var(--color-surface-white)] border border-[var(--color-border-subtle)] rounded-xl p-6 sm:p-7 space-y-4 relative shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[var(--color-brand-blue-light)] text-[var(--color-brand-blue)]">
                  Step 03
                </span>
                <Activity className="w-5 h-5 text-[var(--color-brand-blue)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-brand-navy)]">
                Track
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Project and programme progress can be monitored from one centralized system in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. Final Call to Action Section                                           */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-[var(--color-surface-white)] border-t border-[var(--color-border-subtle)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-[var(--color-app-bg)] border border-[var(--color-border-subtle)] rounded-2xl p-8 sm:p-12 space-y-6 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[var(--color-brand-blue-light)] text-[var(--color-brand-blue)] flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-brand-navy)]">
                Ready to Access Your Workspace?
              </h2>
              <p className="text-sm sm:text-base text-[var(--color-text-secondary)]">
                Sign in using your authorized programme account to access your assigned projects and dashboard.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </div>

            <p className="text-xs text-[var(--color-text-secondary)] pt-2">
              Note: Account creation and activation are managed by system administrators.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. Footer                                                                 */}
      {/* ========================================================================= */}
      <footer className="bg-[var(--color-surface-white)] border-t border-[var(--color-border-subtle)] py-8 text-sm text-[var(--color-text-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <BrandLogo size="sm" showSubtitle={false} />
            <span className="hidden sm:inline text-[var(--color-border-hover)]">|</span>
            <span className="text-xs">Staff & Intern Progress Dashboard</span>
          </div>

          <div className="text-xs text-[var(--color-text-secondary)] text-center sm:text-right">
            © {new Date().getFullYear()} AI & Data Programme Pipeline. Internal Enterprise System.
          </div>
        </div>
      </footer>
    </div>
  );
}
