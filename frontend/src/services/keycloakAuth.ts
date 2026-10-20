/**
 * keycloakAuth.ts
 *
 * SLT-MOBITEL Keycloak Authentication Client
 * Conforms strictly to the official SLT-Mobitel OIDC Keycloak standard:
 * - 1. LOGIN: Authenticates username & password directly against Keycloak OIDC Token endpoint
 * - 2. SIGN UP: Sends user registration data to the backend /signup endpoint for secure provisioning
 */

import {
  KEYCLOAK_URL,
  KEYCLOAK_REALM as REALM,
  KEYCLOAK_CLIENT_ID as CLIENT_ID,
  BACKEND_URL,
} from '../config/api';

export interface KeycloakTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token?: string;
  session_state?: string;
  scope?: string;
}

/**
 * 1. LOGIN: Send username/password directly to Keycloak to get the token
 */
export const loginWithKeycloak = async (
  username: string,
  password: string
): Promise<KeycloakTokenResponse> => {
  const url = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`;

  const body = new URLSearchParams();
  body.append('client_id', CLIENT_ID);
  body.append('grant_type', 'password');
  body.append('username', username.trim());
  body.append('password', password);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errorMsg =
        errData.error_description ||
        errData.error ||
        'Invalid Keycloak credentials. Please verify your username and password.';
      throw new Error(errorMsg);
    }

    const data: KeycloakTokenResponse = await response.json();
    return data;
  } catch (err: any) {
    // If direct browser-to-keycloak fetch failed due to CORS or network, fallback to backend proxy
    console.warn('Direct Keycloak login encountered error, attempting backend bridge:', err.message);

    const fallbackResponse = await fetch(`${BACKEND_URL}/api/auth/keycloak-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.trim(), password }),
    });

    const fallbackData = await fallbackResponse.json();
    if (!fallbackResponse.ok || !fallbackData.token) {
      throw new Error(fallbackData.message || err.message || 'Keycloak authentication failed');
    }

    return {
      access_token: fallbackData.token,
      expires_in: 300,
      refresh_expires_in: 1800,
      refresh_token: fallbackData.keycloakTokens?.refresh_token || '',
      token_type: 'Bearer',
    };
  }
};

/**
 * 2. SIGN UP: Send data to YOUR OWN backend (Do NOT talk to Keycloak directly here!)
 */
export const registerUser = async (
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  additionalData: Record<string, any> = {}
): Promise<boolean> => {
  const url = `${BACKEND_URL}/signup`;

  const payload = {
    email: email.trim().toLowerCase(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    password,
    ...additionalData,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || data.message || 'Failed to create account in Keycloak');
  }

  return true;
};
