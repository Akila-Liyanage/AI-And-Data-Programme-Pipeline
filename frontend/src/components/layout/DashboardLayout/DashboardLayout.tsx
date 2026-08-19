import React, { useState, useCallback } from 'react';
import { cn } from '../../../utils/cn';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { DashboardLayoutProps } from './types';

/**
 * Shared Enterprise Dashboard Layout Shell
 *
 * Provides a responsive shell for all programme dashboards:
 * - Desktop sticky sidebar navigation
 * - Mobile slide-over navigation drawer
 * - Fixed/sticky top header with user profile & notifications
 * - Responsive, spacious main content container
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  navigation,
  user,
  notificationsCount,
  onNotificationClick,
  onProfileClick,
  onLogoutClick,
  headerExtra,
  className,
}) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleMobileNavOpen = useCallback(() => {
    setIsMobileNavOpen(true);
  }, []);

  const handleMobileNavClose = useCallback(() => {
    setIsMobileNavOpen(false);
  }, []);

  return (
    <div className={cn('min-h-screen flex bg-[var(--color-app-bg)]', className)}>
      {/* ── Sidebar (Desktop Sticky + Mobile Slide-over) ─────── */}
      <Sidebar
        navigation={navigation}
        isOpen={isMobileNavOpen}
        onClose={handleMobileNavClose}
        user={user}
      />

      {/* ── Main Layout Column ───────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          onMobileMenuToggle={handleMobileNavOpen}
          user={user}
          notificationsCount={notificationsCount}
          onNotificationClick={onNotificationClick}
          onProfileClick={onProfileClick}
          onLogoutClick={onLogoutClick}
          headerExtra={headerExtra}
        />

        {/* Main Content Region */}
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>

        {/* Footnote */}
        <footer className="py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-[var(--color-text-secondary)] border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-white)]/60">
          AI & Data Programme Pipeline — Staff & Intern Progress Dashboard · Internal Enterprise System
        </footer>
      </div>
    </div>
  );
};
