import { Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { StudentsList } from "./components/StudentsList";
import { StudentProfile } from "./components/StudentProfile";
import { StudentDetailPage } from "./components/StudentDetailPage";
import { IndustryRequirements } from "./components/IndustryRequirements";
import { AIMatchResults } from "./components/AIMatchResults";
import { SkillGapFeedback } from "./components/SkillGapFeedback";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { StudentDashboard } from "./components/StudentDashboard";
import { IndustryDashboard } from "./components/IndustryDashboard";
import { ProfileBuilder } from "./components/ProfileBuilder";
import { useAuth } from "./contexts/AuthContext";

// Protected Route component
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: ('student' | 'industry')[] }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-medium opacity-60">Loading...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'student' ? '/student-dashboard' : '/industry-dashboard'} replace />;
  }
  
  return <>{children}</>;
}

function App() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const isAuthPage = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register";

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="min-h-screen bg-white">
        {!isAuthPage && isAuthenticated && <Navigation />}
        <div className={!isAuthPage && isAuthenticated ? "pt-16" : ""}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Student Routes */}
            <Route path="/student-dashboard" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile-builder" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ProfileBuilder />
              </ProtectedRoute>
            } />
            
            {/* Industry Routes */}
            <Route path="/industry-dashboard" element={
              <ProtectedRoute allowedRoles={['industry']}>
                <IndustryDashboard />
              </ProtectedRoute>
            } />
            
            {/* Shared Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                {user?.role === 'student' ? <StudentDashboard /> : <IndustryDashboard />}
              </ProtectedRoute>
            } />
            <Route path="/students" element={
              <ProtectedRoute>
                <StudentsList />
              </ProtectedRoute>
            } />
            <Route path="/students/:id" element={
              <ProtectedRoute>
                <StudentDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <StudentProfile />
              </ProtectedRoute>
            } />
            <Route path="/roles" element={
              <ProtectedRoute>
                <IndustryRequirements />
              </ProtectedRoute>
            } />
            <Route path="/matches" element={
              <ProtectedRoute>
                <AIMatchResults />
              </ProtectedRoute>
            } />
            <Route path="/skill-gap" element={
              <ProtectedRoute>
                <SkillGapFeedback />
              </ProtectedRoute>
            } />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Suspense>
  );
}

export default App;
