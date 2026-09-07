import React, { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { X, User as UserIcon } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Badge } from '../../common/Badge';
import { isNavSection, type SidebarProps, type NavItem } from './types';

/**
 * Reusable single navigation item renderer.
 */
function NavItemLink({
  item,
  onItemClick,
}: {
  item: NavItem;
  onItemClick?: () => void;
}) {
  return (
    <NavLink
      to={item.path}
      onClick={onItemClick}
      className={({ isActive }) =>
        cn(
          'group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150',
          'focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-brand-blue)]/40',
          isActive
            ? 'bg-[var(--color-brand-blue-light)] text-[var(--color-brand-blue)] font-semibold shadow-xs'
            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-brand-navy)]',
          item.disabled && 'pointer-events-none opacity-50'
        )
      }
      aria-disabled={item.disabled}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={cn(
            'shrink-0 text-current transition-colors',
            'w-4 h-4 flex items-center justify-center'
          )}
          aria-hidden="true"
        >
          {item.icon}
        </span>
        <span className="truncate">{item.label}</span>
      </div>

      {item.badge !== undefined && (
        <Badge
          size="sm"
          variant={item.badgeVariant || 'blue'}
          className="shrink-0 ml-2"
        >
          {item.badge}
        </Badge>
      )}
    </NavLink>
  );
}

/**
 * Sidebar Component
 *
 * Provides responsive sidebar navigation for the enterprise dashboard.
 * - Desktop: Sticky 260px wide panel with clean SLT-inspired hierarchy.
 * - Mobile / Tablet: Slide-over drawer with backdrop overlay & accessible dismiss.
 */
export const Sidebar: React.FC<SidebarProps> = ({
  navigation,
  isOpen,
  onClose,
  user,
  className,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[var(--color-surface-white)] border-r border-[var(--color-border-subtle)]">
      {/* ── Brand Header ────────────────────────────────────── */}
      <div className="h-16 px-4 sm:px-5 flex items-center justify-between border-b border-[var(--color-border-subtle)] shrink-0">
        <Link to="/" className="flex items-center min-w-0 py-1" aria-label="SLT-MOBITEL Home">
          <img
            src="/slt-mobitel-logo.png"
            alt="SLTMOBITEL - The Connection"
            className="h-9 sm:h-10 w-auto max-w-[195px] object-contain object-left transition-transform hover:scale-[1.02] duration-200"
          />
        </Link>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-brand-navy)] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-brand-blue)]/40"
          aria-label="Close navigation sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── Navigation Items ────────────────────────────────── */}
      <nav
        className="flex-1 px-3 py-4 space-y-5 overflow-y-auto"
        aria-label="Sidebar Navigation"
      >
        {navigation.map((entry, idx) => {
          if (isNavSection(entry)) {
            return (
              <div key={entry.id || entry.title || `section-${idx}`} className="space-y-1">
                {entry.title && (
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
                    {entry.title}
                  </p>
                )}
                <ul className="space-y-0.5" role="list">
                  {entry.items.map((item) => (
                    <li key={item.id}>
                      <NavItemLink item={item} onItemClick={onClose} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          }

          return (
            <div key={entry.id}>
              <NavItemLink item={entry} onItemClick={onClose} />
            </div>
          );
        })}
      </nav>

      {/* ── Bottom User Summary Area ────────────────────────── */}
      <div className="p-3 border-t border-[var(--color-border-subtle)] shrink-0 bg-[var(--color-surface-subtle)]/50">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[var(--color-surface-white)] border border-[var(--color-border-subtle)] shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-blue-light)] text-[var(--color-brand-blue)] flex items-center justify-center font-semibold text-xs shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[var(--color-brand-navy)] truncate leading-tight">
              {user?.name || 'Programme Workspace'}
            </p>
            <p className="text-[10px] text-[var(--color-text-secondary)] truncate leading-tight">
              {user?.roleLabel || user?.email || 'Authorized User'}
            </p>
          </div>
          <span
            className="w-2 h-2 rounded-full bg-[var(--color-brand-green)] shrink-0"
            title="System online"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed / Sticky) */}
      <aside
        className={cn(
          'hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30',
          className
        )}
        aria-label="Desktop Sidebar"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-[var(--color-brand-navy)]/40 backdrop-blur-xs z-40 transition-opacity duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer (Slide-over) */}
      <div
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 w-72 max-w-[85vw] z-50 shadow-2xl transition-transform duration-200 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        {sidebarContent}
      </div>
    </>
  );
};
