import React from 'react';
import type { BadgeVariant } from '../../common/Badge';

/**
 * Single navigation item in the sidebar.
 */
export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeVariant?: BadgeVariant;
  disabled?: boolean;
}

/**
 * Grouped navigation section in the sidebar.
 */
export interface NavSection {
  id?: string;
  title?: string;
  items: NavItem[];
}

/**
 * Helper type guard to check if an entry is a NavSection.
 */
export function isNavSection(item: NavItem | NavSection): item is NavSection {
  return 'items' in item && Array.isArray((item as NavSection).items);
}

/**
 * Optional user presentation data passed via props.
 * Used purely for UI rendering; does not represent an authoritative session.
 */
export interface UserDisplayInfo {
  name?: string;
  email?: string;
  roleLabel?: string;
  avatarUrl?: string;
}

/**
 * Breadcrumb item for page headers.
 */
export interface BreadcrumbItem {
  label: string;
  path?: string;
}

/**
 * Props for the PageHeader component.
 */
export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

/**
 * Props for the Sidebar component.
 */
export interface SidebarProps {
  navigation: (NavItem | NavSection)[];
  isOpen: boolean;
  onClose: () => void;
  user?: UserDisplayInfo;
  className?: string;
}

/**
 * Props for the Header/TopBar component.
 */
export interface HeaderProps {
  onMobileMenuToggle: () => void;
  user?: UserDisplayInfo;
  notificationsCount?: number;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
  headerExtra?: React.ReactNode;
  className?: string;
}

/**
 * Props for the main DashboardLayout container.
 */
export interface DashboardLayoutProps {
  children: React.ReactNode;
  /** Navigation structure (items or sections) */
  navigation: (NavItem | NavSection)[];
  /** Optional user display info for header and profile area */
  user?: UserDisplayInfo;
  /** Optional notification badge count */
  notificationsCount?: number;
  /** Notification button click handler */
  onNotificationClick?: () => void;
  /** Profile click handler */
  onProfileClick?: () => void;
  /** Logout click handler */
  onLogoutClick?: () => void;
  /** Optional content on the right side of the header */
  headerExtra?: React.ReactNode;
  /** Extra class name for the outer container */
  className?: string;
}
