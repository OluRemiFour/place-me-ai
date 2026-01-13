import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface RequireRoleProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function RequireRole({ children, allowedRoles }: RequireRoleProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-medium opacity-60">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    // Redirect to their appropriate dashboard if they try to access a wrong route
    const redirectPath = user?.role === 'student' ? '/student-dashboard' : '/industry-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
