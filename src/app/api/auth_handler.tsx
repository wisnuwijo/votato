import { AUTH_CHECK_URL } from './config';

// Type definitions for the API response
export interface User {
  ID: number;
  email: string;
  username: string;
  name: string;
  password: string;
  is_root_user: number;
  is_deactivated: number;
  deactivated_reason: string | null;
  logged_in: number;
  user_token: string;
  CreatedAt: string;
  ModifiedAt: string;
  DeletedAt: string | null;
}

export interface AuthCheckData {
  is_token_valid: boolean;
  user: User;
}

export interface AuthCheckResponse {
  code: number;
  data: AuthCheckData;
  success: boolean;
}

/**
 * Check if the provided authentication token is valid
 * @param token - The Bearer token to validate
 * @returns Promise with the auth check response
 */
export async function checkAuth(token: string): Promise<AuthCheckResponse> {
  try {
    const response = await fetch(AUTH_CHECK_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AuthCheckResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking authentication:', error);
    throw error;
  }
}

/**
 * Validate if a token is valid and returns the user data
 * @param token - The Bearer token to validate
 * @returns User object if token is valid, null otherwise
 */
export async function validateToken(token: string): Promise<User | null> {
  try {
    const response = await checkAuth(token);

    if (response.success && response.data.is_token_valid) {
      return response.data.user;
    }

    return null;
  } catch (error) {
    console.error('Token validation failed:', error);
    return null;
  }
}
