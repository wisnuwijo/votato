/**
 * Get the authentication token from browser cookies
 * @returns The auth token or null if not found
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));

  if (!authCookie) {
    return null;
  }

  return authCookie.split('=')[1];
}

/**
 * Remove the authentication token from browser cookies
 */
export function clearAuthToken(): void {
  if (typeof window === 'undefined') {
    return;
  }

  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure';
}

/**
 * Check if user is authenticated
 * @returns boolean indicating if auth token exists
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

/**
 * Get authorization headers for API requests
 * @returns Headers object with Bearer token
 */
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();

  if (!token) {
    return {
      'Content-Type': 'application/json',
    };
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}
