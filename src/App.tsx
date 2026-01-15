import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { LandingPage } from "@/pages/LandingPage";
import { Dashboard } from "@/pages/Dashboard";
import { StudentsList } from "@/pages/industry/StudentsList";
import { StudentProfile } from "@/pages/student/StudentProfile";
import { StudentDetailPage } from "@/pages/industry/StudentDetailPage";
import { IndustryRequirements } from "@/pages/industry/IndustryRequirements";
import { AIMatchResults } from "@/pages/industry/AIMatchResults";
import { SkillGapFeedback } from "@/pages/student/SkillGapFeedback";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { VerifyEmailPage } from "@/pages/auth/VerifyEmailPage";
import { StudentDashboard } from "@/pages/student/StudentDashboard";
import { ScholarshipsPage } from "@/pages/student/ScholarshipsPage";
import { InternshipsPage } from "@/pages/student/InternshipsPage";
import { IndustryDashboard } from "@/pages/industry/IndustryDashboard";
import { ProfileBuilder } from "@/pages/student/ProfileBuilder";
import { SettingsPage } from "@/pages/SettingsPage";
import { OTPVerificationPage } from "@/pages/auth/OTPVerificationPage";
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";

import { RequireRole } from "@/components/RequireRole";
import { ProfileGuard } from "@/components/auth/ProfileGuard";

function App() {
  const { user, isProfileComplete, isVerified } = useAuth(); // Destructure isVerified from context

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          {/* <Route path="/verify-email" element={
            isVerified ? <Navigate to="/dashboard" replace /> : <VerifyEmailPage />
          } />
          <Route path="/verify-otp" element={<OTPVerificationPage />} /> */}
        </Route>
        
        {/* Protected Dashboard Routes (General) */}
        <Route element={<ProfileGuard />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={
              user?.role === 'student' ? <StudentDashboard /> : <IndustryDashboard />
            } />
            
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/complete-profile" element={
              isProfileComplete ? <Navigate to="/dashboard" replace /> : <SettingsPage />
            } />
            
            {/* Student Specific Routes */}
            <Route path="/student-dashboard" element={
              <RequireRole allowedRoles={['student']}>
                <StudentDashboard />
              </RequireRole>
            } />
            <Route path="/profile-builder" element={
              <RequireRole allowedRoles={['student']}>
                <ProfileBuilder />
              </RequireRole>
            } />
            <Route path="/profile" element={
              <RequireRole allowedRoles={['student']}>
                <StudentProfile />
              </RequireRole>
            } />
            <Route path="/skill-gap" element={
              <RequireRole allowedRoles={['student']}>
                <SkillGapFeedback />
              </RequireRole>
            } />
            <Route path="/scholarships" element={
              <RequireRole allowedRoles={['student']}>
                <ScholarshipsPage />
              </RequireRole>
            } />
            <Route path="/internships" element={
              <RequireRole allowedRoles={['student']}>
                <InternshipsPage />
              </RequireRole>
            } />

            
            {/* Industry Specific Routes */}
            <Route path="/industry-dashboard" element={
              <RequireRole allowedRoles={['industry']}>
                <IndustryDashboard />
              </RequireRole>
            } />
            <Route path="/students" element={
              <RequireRole allowedRoles={['industry']}>
                <StudentsList />
              </RequireRole>
            } />
            <Route path="/students/:id" element={
              <RequireRole allowedRoles={['industry']}>
                <StudentDetailPage />
              </RequireRole>
            } />
            <Route path="/roles" element={
              <RequireRole allowedRoles={['student', 'industry']}>
                <IndustryRequirements />
              </RequireRole>
            } />
            <Route path="/matches" element={
              <RequireRole allowedRoles={['industry']}>
                <AIMatchResults />
              </RequireRole>
            } />
            <Route path="/students/:id/skill-gap" element={
              <RequireRole allowedRoles={['industry']}>
                <SkillGapFeedback />
              </RequireRole>
            } />
          </Route>
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </Suspense>
  );
}

export default App;
