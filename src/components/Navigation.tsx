import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');
  
  const isStudent = user?.role === 'student';
  const isIndustry = user?.role === 'industry';
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardPath = isStudent ? '/student-dashboard' : '/industry-dashboard';
  
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-black z-50">
      <div className="container mx-auto px-8 py-4 flex items-center justify-between">
        <Link to={dashboardPath} className="text-xl font-bold tracking-tight">
          SkillSync
        </Link>
        
        <div className="flex gap-8 items-center">
          <Link 
            to={dashboardPath}
            className={`text-sm font-medium transition-opacity ${isActive('/dashboard') || isActive('/student-dashboard') || isActive('/industry-dashboard') ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
          >
            Dashboard
          </Link>
          
          {isIndustry && (
            <Link 
              to="/students" 
              className={`text-sm font-medium transition-opacity ${isActive('/students') ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
            >
              Candidates
            </Link>
          )}
          
          {isStudent && (
            <Link 
              to="/profile-builder" 
              className={`text-sm font-medium transition-opacity ${isActive('/profile-builder') ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
            >
              Profile
            </Link>
          )}
          
          <Link 
            to="/roles" 
            className={`text-sm font-medium transition-opacity ${isActive('/roles') ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
          >
            Roles
          </Link>
          
          <Link 
            to="/matches" 
            className={`text-sm font-medium transition-opacity ${isActive('/matches') ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
          >
            Matches
          </Link>
          
          {isStudent && (
            <Link 
              to="/skill-gap" 
              className={`text-sm font-medium transition-opacity ${isActive('/skill-gap') ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
            >
              Skill Gap
            </Link>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-black text-white rounded-sm flex items-center justify-center text-xs font-bold">
                  {user?.avatar || user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium hidden md:inline">{user?.name}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs opacity-60">{user?.email}</p>
                <p className="text-xs opacity-60 capitalize mt-1">{user?.role} Account</p>
              </div>
              <DropdownMenuSeparator />
              {isStudent && (
                <DropdownMenuItem onClick={() => navigate('/profile-builder')}>
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
