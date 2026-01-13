import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export function ProfileCompletionGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, isVerified, isProfileComplete } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // First check verification
  if (!isVerified && location.pathname !== '/verify-otp') {
    return <Navigate to="/verify-otp" replace />;
  }

  // Then check profile completion
  // We allow access to settings page to complete the profile
  if (!isProfileComplete && !['/settings', '/verify-otp'].includes(location.pathname)) {
    return <Navigate to="/settings" state={{ incomplete: true }} replace />;
  }

  return <>{children}</>;
}
