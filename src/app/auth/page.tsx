'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Get the token from query parameters
        const token = searchParams.get('token');

        if (!token) {
          setStatus('error');
          setMessage('No authentication token provided');
          return;
        }

        // Validate the token before storing it
        setMessage('Validating token...');

        const validateResponse = await fetch('/api/auth/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const validateData = await validateResponse.json();

        if (!validateResponse.ok || !validateData.success || !validateData.valid) {
          setStatus('error');
          setMessage('Invalid or expired token. Please try again.');
          return;
        }

        // Set the token in a cookie only if validation succeeds
        // Using document.cookie for client-side cookie setting
        // Cookie will expire in 30 days
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        document.cookie = `auth_token=${token}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax; Secure`;

        setStatus('success');
        setMessage(`Welcome, ${validateData.user?.name || validateData.user?.username}! Redirecting...`);

        // Redirect to home page after 2 seconds
        setTimeout(() => {
          router.push('/');
        }, 2000);

      } catch (error) {
        console.error('Authentication error:', error);
        setStatus('error');
        setMessage('Failed to authenticate. Please try again.');
      }
    };

    handleAuth();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          {status === 'loading' && (
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <h2 className="text-2xl font-bold text-gray-900">{message}</h2>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-green-100 p-3">
                <svg
                  className="h-12 w-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{message}</h2>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-red-100 p-3">
                <svg
                  className="h-12 w-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{message}</h2>
              <button
                onClick={() => router.push('/')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Go to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
