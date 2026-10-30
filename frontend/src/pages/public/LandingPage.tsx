/**
 * LandingPage.tsx
 *
 * ULTRA-MODERN SLT-MOBITEL ENTERPRISE LANDING PAGE
 * Features:
 * - 3D Rotating Interactive World Globe with live telemetry beams & orbit rings
 * - Clean high-contrast typography using Plus Jakarta Sans & Inter
 * - Curated SLT Blue & Mobitel Green light-mode color palette
 * - Interactive Role-based Workspace Portals (Admin / Staff / Intern)
 * - 4-stage Pipeline Architecture & WBS weight calculation showcase
 * - Direct Keycloak SSO Login & Self-Registration gateways
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  FolderKanban,
  Users,
  TrendingUp,
  Sparkles,
  Cpu,
  LogIn,
  Bot,
  Zap,
  Building,
  GraduationCap,
  Menu,
  X,
  FileCheck,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '../../components/common';
import { AnimatedGlobe } from '../../components/common/AnimatedGlobe';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeRoleTab, setActiveRoleTab] = useState<'admin' | 'staff' | 'intern'>('admin');

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col font-sans">
      {/* ── TOP LIVE ANNOUNCEMENT BAR ──────────────────────────── */}
      <div className="bg-gradient-to-r from-[#0057A8] via-[#0284C7] to-[#00A651] text-white text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2 shadow-xs">
        <span className="flex h-2 w-2 rounded-full bg-emerald-300 animate-ping" />
        <span className="font-medium">SLT-MOBITEL AI & Data Programme Pipeline • Next-Gen Telecommunication Intelligence</span>
        <Link to="/login" className="underline font-bold hover:text-emerald-200 ml-1 inline-flex items-center gap-0.5">
          <span>Login</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* ── MAIN HEADER NAVIGATION ─────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Official Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/slt-mobitel-logo.png"
              alt="SLTMOBITEL - The Connection"
              className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-102"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
            {[
              { label: 'Overview', id: 'overview' },
              { label: 'Interactive Roles', id: 'roles' },
              { label: 'Pipeline Architecture', id: 'architecture' },
              { label: 'AI Tracks', id: 'tracks' },
            ].map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
                className="px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold text-slate-700 hover:text-[#0057A8] hover:bg-blue-50/80 transition-all duration-150 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/register"
              className="px-4 py-2 text-xs lg:text-sm font-bold text-slate-700 hover:text-[#0057A8] hover:bg-slate-100 rounded-xl transition-colors"
            >
              Self-Register
            </Link>
            <Button
              variant="primary"
              size="md"
              leftIcon={<LogIn className="w-4 h-4" />}
              onClick={() => navigate('/login')}
              className="shadow-md hover:shadow-lg shadow-blue-600/20 font-bold bg-[#0057A8] hover:bg-[#00488B] text-white transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Login
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <button
              type="button"
              onClick={() => scrollToSection('overview')}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-blue-50"
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('roles')}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-blue-50"
            >
              Interactive Roles
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('architecture')}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-blue-50"
            >
              Pipeline Architecture
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('tracks')}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-blue-50"
            >
              AI Tracks
            </button>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Button
                variant="primary"
                fullWidth
                size="md"
                onClick={() => navigate('/login')}
                leftIcon={<LogIn className="w-4 h-4" />}
              >
                Login
              </Button>
              <Button
                variant="outline"
                fullWidth
                size="md"
                onClick={() => navigate('/register')}
              >
                Register as Staff / Intern
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO SECTION (WITH 3D ROTATING WORLD GLOBE) ────────── */}
      <section id="overview" className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 bg-white overflow-hidden border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-200 text-[#0057A8] text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#0057A8]" />
                <span className="tracking-wide">AI & DATA PROGRAMME PIPELINE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A651] animate-ping" />
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Architecting Intelligent{' '}
                <span className="text-[#0057A8]">Telecom AI</span> &{' '}
                <span className="text-[#00A651]">Data Science</span> Systems.
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                Enterprise project management built for SLT-MOBITEL. Track AI work-item completion weights in real-time, orchestrate Permanent Staff engineers and Intern trainees, and monitor high-impact telecommunication deliverables.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<LogIn className="w-4 h-4" />}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto h-11 px-6 text-xs sm:text-sm font-bold bg-[#0057A8] hover:bg-[#00488B] text-white shadow-md hover:shadow-lg shadow-blue-700/15 transform hover:-translate-y-0.5 transition-all duration-150 rounded-xl"
                >
                  Login
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => navigate('/register')}
                  className="w-full sm:w-auto h-11 px-5 text-xs sm:text-sm font-semibold border-slate-300 hover:border-blue-500 hover:bg-slate-50 text-slate-800 bg-white shadow-2xs rounded-xl"
                >
                  Staff / Intern Registration
                </Button>
              </div>

              {/* Live Metric Badges */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200/80 max-w-xl mx-auto lg:mx-0">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-center lg:text-left">
                  <p className="text-xl sm:text-2xl font-extrabold text-[#0057A8] font-mono">100%</p>
                  <p className="text-[11px] font-bold text-slate-600">Dynamic Weights</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-center lg:text-left">
                  <p className="text-xl sm:text-2xl font-extrabold text-[#00A651] font-mono">3 Portals</p>
                  <p className="text-[11px] font-bold text-slate-600">Admin, Staff & Intern</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-center lg:text-left">
                  <p className="text-xl sm:text-2xl font-extrabold text-sky-600 font-mono">Keycloak</p>
                  <p className="text-[11px] font-bold text-slate-600">Enterprise SSO</p>
                </div>
              </div>
            </div>

            {/* Right Column: 3D ROTATING WORLD GLOBE */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <AnimatedGlobe />
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: LIVE DEMO SHOWCASE ────────────────────────── */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold text-[#0057A8] uppercase tracking-wider">
                Interactive Project Simulator
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Automated Work-Item Weight Calculation
              </h2>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0057A8] hover:underline"
            >
              <span>Explore full Admin Dashboard</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Card 1 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xs space-y-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0057A8] text-[11px] font-extrabold font-mono">
                  PRJ-101 • AI Engine
                </span>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  75% Complete
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900">Customer Churn AI Prediction Model</h4>
              <p className="text-xs text-slate-600">Predict churn with XGBoost & neural embeddings.</p>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Work Items (3/4 Done)</span>
                  <span className="font-mono text-[#0057A8]">75%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#0057A8] to-[#00A651] rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
            </div>

            {/* Project Card 2 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xs space-y-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#00A651] text-[11px] font-extrabold font-mono">
                  PRJ-102 • Data Science
                </span>
                <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                  45% Complete
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900">Telecom Network Anomaly Detection</h4>
              <p className="text-xs text-slate-600">Real-time telemetry stream processing with Kafka.</p>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Work Items (2/4 Done)</span>
                  <span className="font-mono text-amber-600">45%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-[#00A651] rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
            </div>

            {/* Project Card 3 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xs space-y-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[11px] font-extrabold font-mono">
                  PRJ-103 • Analytics
                </span>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  90% Complete
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900">Programme Progress Analytics Hub</h4>
              <p className="text-xs text-slate-600">Dynamic executive reporting and audit logs.</p>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Work Items (3/4 Done)</span>
                  <span className="font-mono text-[#0057A8]">90%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#0057A8] to-[#00A651] rounded-full" style={{ width: '90%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: ROLE PORTALS (INTERACTIVE TABS) ───────────── */}
      <section id="roles" className="py-16 bg-white border-b border-slate-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-[#0057A8] text-xs font-extrabold uppercase tracking-wider">
              Specialized Portals
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Tailored Workspaces For Every Role
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Select a programme role to explore specific dashboard features, governance permissions, and workflows.
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex justify-center">
            <div className="p-1.5 rounded-2xl bg-white border border-slate-200 inline-flex gap-1.5 shadow-xs">
              {[
                { key: 'admin', label: 'System Administrator', icon: <ShieldCheck className="w-4 h-4" /> },
                { key: 'staff', label: 'Permanent Staff', icon: <Building className="w-4 h-4" /> },
                { key: 'intern', label: 'Intern Trainee', icon: <GraduationCap className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveRoleTab(tab.key as any)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                    activeRoleTab === tab.key
                      ? 'bg-[#0057A8] text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Role Tab Content Cards */}
          <div className="max-w-4xl mx-auto">
            {activeRoleTab === 'admin' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-200 shadow-xl space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-[#0057A8]">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900">System Administrator Console</h3>
                      <p className="text-xs text-slate-500">Full Governance, Project Lifecycle & Account Verification</p>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/login')}
                    className="bg-[#0057A8] hover:bg-[#00488B] text-white font-bold"
                  >
                    Admin Access
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <p className="text-xs font-bold text-[#0057A8]">User Approvals</p>
                    <p className="text-xs text-slate-600">Review, verify, or reject self-registered staff and intern trainees with 1-click status switches.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <p className="text-xs font-bold text-[#00A651]">Project Weights</p>
                    <p className="text-xs text-slate-600">Create AI projects, assign project leads, and define work-item completion percentage weights.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <p className="text-xs font-bold text-sky-600">Resource Allocations</p>
                    <p className="text-xs text-slate-600">Assign members to AI tracks and monitor aggregate delivery metrics across the entire programme.</p>
                  </div>
                </div>
              </div>
            )}

            {activeRoleTab === 'staff' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-200 shadow-xl space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#00A651]">
                      <Building className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900">Permanent Staff Workspace</h3>
                      <p className="text-xs text-slate-500">Engineering Lead, Sprint Management & Deliverables</p>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/login')}
                    className="bg-[#00A651] hover:bg-[#008D44] text-white font-bold"
                  >
                    Staff Access
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <p className="text-xs font-bold text-[#00A651]">Project Leadership</p>
                    <p className="text-xs text-slate-600">Guide technical implementations, manage repositories, and supervise intern deliverables.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <p className="text-xs font-bold text-teal-600">Work Item Updates</p>
                    <p className="text-xs text-slate-600">Transition work-item statuses from TODO to IN_PROGRESS and DONE to compute progress.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <p className="text-xs font-bold text-sky-600">Work History Logs</p>
                    <p className="text-xs text-slate-600">Maintain permanent audit trails and technical contribution records across sprints.</p>
                  </div>
                </div>
              </div>
            )}

            {activeRoleTab === 'intern' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-200 shadow-xl space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900">Intern Trainee Portal</h3>
                      <p className="text-xs text-slate-500">Hands-on AI/ML Contribution & Progress Tracking</p>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/login')}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
                  >
                    Intern Access
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <p className="text-xs font-bold text-purple-700">Assigned Tasks</p>
                    <p className="text-xs text-slate-600">Execute ML model tuning, data engineering scripts, and frontend user interfaces.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <p className="text-xs font-bold text-pink-700">Skill Progression</p>
                    <p className="text-xs text-slate-600">Demonstrate contribution rates and work-item deliveries for internship evaluations.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <p className="text-xs font-bold text-indigo-700">Mentor Guidance</p>
                    <p className="text-xs text-slate-600">Collaborate directly under Senior Engineers and Programme Leads in real time.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── SECTION: PIPELINE ARCHITECTURE (4 STAGES) ──────────── */}
      <section id="architecture" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#00A651] text-xs font-extrabold uppercase tracking-wider">
              End-To-End Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              The AI & Data Programme Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              A 4-step structured workflow for delivering high-impact telecom intelligence solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'User Registration & Verification',
                desc: 'Staff and Interns register with specialization tracks. Administrator verifies credentials before dashboard access.',
                icon: <FileCheck className="w-5 h-5 text-[#0057A8]" />,
                badge: 'Security Gate',
              },
              {
                step: '02',
                title: 'Project Setup & Work Breakdown',
                desc: 'Projects are configured with tech stacks, milestone target dates, and percentage-weighted work items.',
                icon: <FolderKanban className="w-5 h-5 text-[#00A651]" />,
                badge: 'WBS Engine',
              },
              {
                step: '03',
                title: 'Team Allocation & Role Mapping',
                desc: 'Permanent Staff leads and Intern trainees are assigned to active projects with clear role responsibilities.',
                icon: <Users className="w-5 h-5 text-purple-600" />,
                badge: 'Resource Mgmt',
              },
              {
                step: '04',
                title: 'Progress Weight Calculation',
                desc: 'Completed work items automatically calculate project completion and aggregate programme health rates.',
                icon: <TrendingUp className="w-5 h-5 text-sky-600" />,
                badge: 'Live Analytics',
              },
            ].map((st) => (
              <div
                key={st.step}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-lg transition-all duration-300 space-y-4 group transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {st.icon}
                  </div>
                  <span className="text-2xl font-extrabold text-slate-300 font-mono">{st.step}</span>
                </div>

                <div className="space-y-2">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-200 text-slate-700">
                    {st.badge}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 leading-snug">{st.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION: TECHNICAL TRACKS ──────────────────────────── */}
      <section id="tracks" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-extrabold uppercase tracking-wider">
              Programme Tracks
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              AI & Data Science Disciplines
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Supporting next-generation telecommunication models and stream analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'AI & Deep Learning',
                desc: 'Predictive churn models, network anomaly detection, neural embeddings, and PyTorch / TensorFlow pipelines.',
                icon: <Bot className="w-5 h-5 text-[#0057A8]" />,
                tech: ['PyTorch', 'FastAPI', 'XGBoost'],
              },
              {
                title: 'Data Science & Stream Analytics',
                desc: 'Real-time telemetry ingestion, Kafka producers, TimescaleDB temporal indexing, and Apache Spark clusters.',
                icon: <Zap className="w-5 h-5 text-[#00A651]" />,
                tech: ['Kafka', 'Spark', 'TimescaleDB'],
              },
              {
                title: 'Software & Cloud Engineering',
                desc: 'Containerized microservices, full-stack operational dashboards, RESTful orchestration, and React frontends.',
                icon: <Cpu className="w-5 h-5 text-purple-600" />,
                tech: ['React', 'TypeScript', 'Node.js', 'Docker'],
              },
            ].map((track) => (
              <div
                key={track.title}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  {track.icon}
                </div>
                <h4 className="text-base font-bold text-slate-900">{track.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{track.desc}</p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {track.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0057A8] font-mono text-[10px] font-bold border border-blue-100"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION FOOTER BANNER ───────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-[#0057A8] via-[#00488C] to-[#003366] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Access the AI & Data Workspace?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mx-auto leading-relaxed font-normal">
            Sign in with your authorized Keycloak credentials to access your designated workspace or register for a new account.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/login')}
              leftIcon={<LogIn className="w-4 h-4" />}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="w-full sm:w-auto h-11 px-6 text-xs sm:text-sm font-bold bg-[#00A651] hover:bg-[#008D44] text-white shadow-lg transform hover:-translate-y-0.5 transition-all rounded-xl"
            >
              Login
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto h-11 px-5 text-xs sm:text-sm font-semibold border-white/40 hover:bg-white/10 text-white rounded-xl"
            >
              Create Account
            </Button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white inline-flex items-center shadow-xs">
              <img
                src="/slt-mobitel-logo.png"
                alt="SLTMOBITEL"
                className="h-7 w-auto object-contain"
              />
            </div>
            <span className="text-xs text-slate-400 font-medium">
              AI & Data Programme Pipeline • Enterprise Management System
            </span>
          </div>

          <p className="text-xs text-slate-500 text-center md:text-right">
            © {new Date().getFullYear()} SLT-MOBITEL (The Connection). All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
