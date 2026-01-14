import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { ProfileCompletionModal } from './ProfileCompletionModal';
import { useState } from 'react';

export function ProfileCompletionGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, isVerified, isProfileComplete, missingFields } = useAuth();
  const location = useLocation();
  const [showModal, setShowModal] = useState(true);

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
  const isSettingsPage = location.pathname === '/settings';
  const isProfileBuilder = location.pathname === '/profile-builder'; // For student fallback
  const isCompleteProfilePage = location.pathname === '/complete-profile';
  
  if (!isProfileComplete && !isSettingsPage && !isProfileBuilder && !isCompleteProfilePage && location.pathname !== '/verify-otp') {
    return (
      <>
        <ProfileCompletionModal 
          isOpen={showModal} 
          missingFields={missingFields} 
          onClose={() => setShowModal(false)}
        />
        <div className={showModal ? "blur-sm pointer-events-none" : ""}>
          {children}
        </div>
      </>
    );
  }

  return <>{children}</>;
}
