import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  User as UserIcon,
  ChevronDown,
  KeyRound,
  LogOut,
  Shield,
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Badge } from '../../common/Badge';
import type { HeaderProps } from './types';

/**
 * TopBar / Header Component
 *
 * Enterprise header bar providing:
 * - Mobile hamburger drawer trigger
 * - Notification trigger placeholder
 * - Optional role badge display
 * - User profile dropdown with UI presentation actions
 */
export const Header: React.FC<HeaderProps> = ({
  onMobileMenuToggle,
  user,
  notificationsCount,
  onNotificationClick,
  onProfileClick,
  onLogoutClick,
  headerExtra,
  className,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isProfileMenuOpen) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isProfileMenuOpen]);

  return (
    <header
      className={cn(
        'h-16 px-4 sm:px-6 lg:px-8 bg-[var(--color-surface-white)]/90 backdrop-blur-md',
        'border-b border-[var(--color-border-subtle)] sticky top-0 z-20',
        'flex items-center justify-between gap-4',
        className
      )}
    >
      {/* ── Left Side: Mobile Trigger & Context ───────────────── */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-brand-navy)] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-brand-blue)]/40"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Enterprise workspace indicator */}
        <div className="hidden sm:flex items-center text-xs font-semibold text-slate-700">
          <span>AI & Data Programme Pipeline</span>
        </div>
      </div>

      {/* ── Right Side: Actions & Profile ────────────────────── */}
      <div className="flex items-center gap-2 sm:gap-3">
        {headerExtra}

        {/* Notification button placeholder */}
        <button
          type="button"
          onClick={onNotificationClick}
          className="relative p-2 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-brand-navy)] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-brand-blue)]/40"
          aria-label={
            notificationsCount
              ? `${notificationsCount} notifications`
              : 'Notifications'
          }
        >
          <Bell className="w-4 h-4" />
          {Boolean(notificationsCount && notificationsCount > 0) && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-brand-blue)] ring-2 ring-[var(--color-surface-white)]" />
          )}
        </button>

        {/* Optional Role Badge */}
        {user?.roleLabel && (
          <div className="hidden md:block">
            <Badge variant="blue" size="sm">
              {user.roleLabel}
            </Badge>
          </div>
        )}

        {/* ── Profile Dropdown Trigger ────────────────────────── */}
        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className={cn(
              'flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl transition-all duration-150',
              'hover:bg-[var(--color-surface-subtle)] border border-transparent hover:border-[var(--color-border-subtle)]',
              'focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-brand-blue)]/40',
              isProfileMenuOpen && 'bg-[var(--color-surface-subtle)] border-[var(--color-border-subtle)]'
            )}
            aria-expanded={isProfileMenuOpen}
            aria-haspopup="menu"
            aria-label="User account menu"
          >
            {/* Avatar placeholder */}
            <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-navy)] text-white flex items-center justify-center font-semibold text-xs shrink-0 shadow-2xs">
              {user?.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                <UserIcon className="w-4 h-4" />
              )}
            </div>

            {/* User name & role preview (desktop) */}
            <div className="hidden sm:block text-left min-w-0 max-w-[140px]">
              <p className="text-xs font-semibold text-[var(--color-brand-navy)] truncate leading-tight">
                {user?.name || 'Account'}
              </p>
              <p className="text-[10px] text-[var(--color-text-secondary)] truncate leading-tight">
                {user?.roleLabel || 'Authorized User'}
              </p>
            </div>

            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-[var(--color-text-muted)] transition-transform duration-150',
                isProfileMenuOpen && 'rotate-180'
              )}
              aria-hidden="true"
            />
          </button>

          {/* ── Dropdown Menu ─────────────────────────────────── */}
          {isProfileMenuOpen && (
            <div
              className={cn(
                'absolute right-0 mt-2 w-56 bg-[var(--color-surface-white)]',
                'rounded-xl border border-[var(--color-border-subtle)]',
                'shadow-lg py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100'
              )}
              role="menu"
              aria-label="User account options"
            >
              {/* Account summary header */}
              <div className="px-3.5 py-2.5 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)]/50">
                <p className="font-semibold text-[var(--color-brand-navy)] truncate">
                  {user?.name || 'Authorized Account'}
                </p>
                <p className="text-[10px] text-[var(--color-text-secondary)] truncate mt-0.5">
                  {user?.email || 'Enterprise User'}
                </p>
                {user?.roleLabel && (
                  <div className="mt-1.5">
                    <Badge variant="blue" size="sm">
                      {user.roleLabel}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Menu Actions */}
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onProfileClick?.();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-[var(--color-brand-navy)] hover:bg-[var(--color-surface-subtle)] transition-colors"
                  role="menuitem"
                >
                  <Shield className="w-4 h-4 text-[var(--color-brand-blue)] shrink-0" />
                  <span>Account Profile</span>
                </button>

                <Link
                  to="/change-password"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-[var(--color-brand-navy)] hover:bg-[var(--color-surface-subtle)] transition-colors"
                  role="menuitem"
                >
                  <KeyRound className="w-4 h-4 text-[var(--color-brand-blue)] shrink-0" />
                  <span>Change Password</span>
                </Link>
              </div>

              <div className="border-t border-[var(--color-border-subtle)] pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onLogoutClick?.();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-[var(--color-status-error)] hover:bg-red-50/75 transition-colors"
                  role="menuitem"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
