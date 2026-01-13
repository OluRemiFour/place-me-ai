import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'student' | 'industry' | null;

import { api } from '@/services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole, confirmPassword?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('skillsync_user');
    const token = localStorage.getItem('skillsync_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const response = await api.login(email, password);
      // Backend returns: access_token, user_id, role, name
      const newUser: User = {
        id: response.user_id,
        email,
        name: response.name,
        role: response.role as UserRole,
        avatar: response.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
        token: response.access_token
      };
      
      setUser(newUser);
      localStorage.setItem('skillsync_user', JSON.stringify(newUser));
      localStorage.setItem('skillsync_token', response.access_token);
    } catch (error) {
       console.error(error);
       throw error;
    } finally {
       setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole, confirmPassword?: string) => {
    setIsLoading(true);
    try {
        const response = await api.register({
            email,
            password,
            confirm_password: confirmPassword || password, // Fallback if not provided, but UI should provide it
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
        localStorage.setItem('skillsync_user', JSON.stringify(newUser));
        localStorage.setItem('skillsync_token', response.access_token);
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('skillsync_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout
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
