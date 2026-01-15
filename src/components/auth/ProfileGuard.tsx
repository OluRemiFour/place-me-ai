import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function ProfileGuard() {
  const { user, isProfileComplete, checkProfileStatus } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const init = async () => {
        if (user) {
            await checkProfileStatus();
        }
        setIsChecking(false);
    };
    init();
  }, [user]);

  if (isChecking) {
      return <div className="p-8 text-center text-sm opacity-60">Checking profile compatibility...</div>;
  }

  // Allow access to settings page itself to avoid infinite loop
  // Also allow Industry users to access dashboard to see the completion modal
  if (!isProfileComplete && !location.pathname.includes('/settings') && !(user?.role === 'industry' && location.pathname === '/industry-dashboard')) {
    toast.warning("Please complete your profile to access all features.");
    return <Navigate to="/settings" replace />;
  }

  return <Outlet />;
}
