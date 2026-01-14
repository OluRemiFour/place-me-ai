import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'student' | 'industry' | null;

import { api } from '@/services/api';

export interface SkillDetail {
  name: string;
  level: number;
  verified: boolean;
  category: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  token?: string;
  bio?: string;
  location?: string;
  
  // Student fields
  university?: string;
  major?: string;
  gpa?: number;
  graduationYear?: number;
  skills?: SkillDetail[];
  
  // Industry fields
  company_name?: string;
  company_url?: string;
  industry_type?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isVerified: boolean;
  isProfileComplete: boolean;
  missingFields: string[];
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole, confirmPassword?: string) => Promise<void>;
  logout: () => void;
  verifyOTP: (otp: string) => Promise<void>;
  resendOTP: () => Promise<void>;
  checkProfileStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('skillsync_user');
    const token = localStorage.getItem('skillsync_token');
    const storedVerified = localStorage.getItem('skillsync_verified') === 'true';
    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsVerified(storedVerified);
      
      // Verification check on reload
      checkStatus(parsedUser.id);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const response = await api.login(email, password);
      const newUser: User = {
        id: response.user_id,
        email,
        name: response.name,
        role: response.role as UserRole,
        avatar: response.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
        token: response.access_token
      };
      
      setUser(newUser);
      setIsVerified(response.is_verified);
      localStorage.setItem('skillsync_user', JSON.stringify(newUser));
      localStorage.setItem('skillsync_token', response.access_token);
      localStorage.setItem('skillsync_verified', response.is_verified.toString());
      
      // Auto-check profile status after login
      await checkStatus(newUser.id);
    } catch (error) {
       console.error(error);
       throw error;
    } finally {
       setIsLoading(false);
    }
  };

  const checkStatus = async (userId: string) => {
    try {
      const status = await api.getProfileStatus(userId);
      setIsVerified(status.is_verified);
      setIsProfileComplete(status.is_profile_complete);
      setMissingFields(status.missing_fields);
      localStorage.setItem('skillsync_verified', status.is_verified.toString());
    } catch (e) {
      console.error("Profile status check failed", e);
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole, confirmPassword?: string) => {
    setIsLoading(true);
    try {
        const response = await api.register({
            email,
            password,
            confirm_password: confirmPassword || password, 
            name,
            role
        });
        
        const newUser: User = {
            id: response.user_id,
            email,
            name: response.name,
            role: response.role as UserRole,
            avatar: response.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
            token: response.access_token
        };
        
        setUser(newUser);
        setIsVerified(response.is_verified);
        localStorage.setItem('skillsync_user', JSON.stringify(newUser));
        localStorage.setItem('skillsync_token', response.access_token);
        localStorage.setItem('skillsync_verified', response.is_verified.toString());
        
        await checkStatus(newUser.id);
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        setIsLoading(false);
    }
  };

  const verifyOTP = async (otp: string) => {
    if (!user) throw new Error("No user logged in");
    await api.verifyOTP(user.email, otp);
    setIsVerified(true);
    localStorage.setItem('skillsync_verified', 'true');
  };

  const resendOTP = async () => {
    if (!user) throw new Error("No user logged in");
    await api.sendOTP(user.email);
  };

  const checkProfileStatus = async () => {
    if (user) await checkStatus(user.id);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('skillsync_user');
    localStorage.removeItem('skillsync_token');
    localStorage.removeItem('skillsync_verified');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      isVerified,
      isProfileComplete,
      missingFields,
      login,
      register,
      logout,
      verifyOTP,
      resendOTP,
      checkProfileStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
