import dns from 'dns';
try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch {
  // Ignore in environments where DNS modification is restricted
}

const KEYCLOAK_URL = process.env.BACKEND_KEYCLOAK_URL || 'https://idp.sltdigitallab.lk';
const REALM = process.env.BACKEND_KEYCLOAK_REALM || 'ai-data-pipeline';
const SERVICE_ACCOUNT_CLIENT = process.env.KEYCLOAK_SERVICE_ACCOUNT_CLIENT || 'backend-client';
const SERVICE_ACCOUNT_SECRET = process.env.KEYCLOAK_SERVICE_ACCOUNT_SECRET || 'tmcqtZzgu8Yca0LwEQH0A6qxOjdIc6Ij';
const FRONTEND_CLIENT_ID = process.env.FRONTEND_KEYCLOAK_CLIENT_ID || 'frontend-client';

let cachedServiceToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Helper to get the secure Service Account API Token from Keycloak
 */
export const getSecureApiToken = async (): Promise<string> => {
  const now = Date.now();
  if (cachedServiceToken && tokenExpiresAt > now + 30000) {
    return cachedServiceToken;
  }

  const url = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`;
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: SERVICE_ACCOUNT_CLIENT,
    client_secret: SERVICE_ACCOUNT_SECRET,
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Failed to obtain Keycloak service account token:', errorText);
    throw new Error('Could not connect to Keycloak Service Account');
  }

  const data = (await res.json()) as any;
  cachedServiceToken = data.access_token;
  tokenExpiresAt = now + (data.expires_in || 300) * 1000;
  return data.access_token;
};

/**
 * Create a new user securely in Keycloak
 */
export const createKeycloakUser = async ({
  email,
  firstName,
  lastName,
  password,
}: {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
}): Promise<{ success: boolean; message: string; keycloakId?: string }> => {
  try {
    const secureToken = await getSecureApiToken();
    const searchUrl = `${KEYCLOAK_URL}/admin/realms/${REALM}/users?username=${encodeURIComponent(email)}&exact=true`;

    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${secureToken}` },
    });

    if (searchRes.ok) {
      const existing = (await searchRes.json()) as any[];
      if (existing && existing.length > 0) {
        // User already exists in Keycloak
        return {
          success: true,
          message: 'User already exists in Keycloak',
          keycloakId: existing[0].id,
        };
      }
    }

    const url = `${KEYCLOAK_URL}/admin/realms/${REALM}/users`;
    const payload: any = {
      username: email,
      email: email,
      firstName: firstName || 'User',
      lastName: lastName || 'Member',
      enabled: true,
      emailVerified: true,
    };

    if (password) {
      payload.credentials = [
        {
          type: 'password',
          value: password,
          temporary: false,
        },
      ];
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secureToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 201) {
      return { success: true, message: 'User created securely in Keycloak!' };
    } else if (response.status === 409) {
      return { success: true, message: 'User already exists in Keycloak' };
    } else {
      const errText = await response.text();
      console.error('Keycloak user creation response:', response.status, errText);
      return { success: false, message: `Keycloak returned ${response.status}: ${errText}` };
    }
  } catch (error: any) {
    console.error('Error creating user in Keycloak:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Direct Access Grant authentication against Keycloak using username and password
 */
export const loginWithKeycloak = async (
  username: string,
  password: string
): Promise<{
  success: boolean;
  tokens?: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
  };
  error?: string;
}> => {
  try {
    const url = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`;
    const body = new URLSearchParams();
    body.append('client_id', FRONTEND_CLIENT_ID);
    body.append('grant_type', 'password');
    body.append('username', username);
    body.append('password', password);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as any;
      return {
        success: false,
        error: data.error_description || 'Invalid credentials in Keycloak',
      };
    }

    const data = (await response.json()) as any;
    return {
      success: true,
      tokens: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        token_type: data.token_type,
      },
    };
  } catch (error: any) {
    console.error('Keycloak login error:', error);
    return { success: false, error: error.message || 'Keycloak authentication connection failed' };
  }
};
