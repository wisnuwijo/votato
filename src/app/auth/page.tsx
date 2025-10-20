import { Suspense } from 'react';
import AuthContent from './AuthContent';

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
            </div>
          </div>
        </div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
