/**
 * Centralized API & Backend Configuration
 * Supports local development and production environment overrides.
 */

export const BACKEND_URL: string =
  (import.meta.env.VITE_BACKEND_URL as string) ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? `${window.location.protocol}//${window.location.hostname}:5000`
    : 'http://localhost:5000');

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string) || `${BACKEND_URL}/api`;

export const KEYCLOAK_URL: string =
  (import.meta.env.VITE_FRONTEND_KEYCLOAK_URL as string) ||
  'https://idp.sltdigitallab.lk';

export const KEYCLOAK_REALM: string =
  (import.meta.env.VITE_FRONTEND_KEYCLOAK_REALM as string) ||
  'ai-data-pipeline';

export const KEYCLOAK_CLIENT_ID: string =
  (import.meta.env.VITE_FRONTEND_KEYCLOAK_CLIENT_ID as string) ||
  'frontend-client';
