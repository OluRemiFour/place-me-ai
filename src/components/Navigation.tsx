import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');
  
  const isStudent = user?.role === 'student';
  const isIndustry = user?.role === 'industry';
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardPath = isStudent ? '/student-dashboard' : '/industry-dashboard';

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <Link 
        to={dashboardPath}
        onClick={() => mobile && setIsOpen(false)}
        className={`text-sm font-medium transition-opacity ${isActive('/dashboard') || isActive('/student-dashboard') || isActive('/industry-dashboard') ? 'opacity-100' : 'opacity-60 hover:opacity-100'} ${mobile ? 'text-lg py-2' : ''}`}
      >
        Dashboard
      </Link>
      
      {isIndustry && (
        <Link 
          to="/students" 
          onClick={() => mobile && setIsOpen(false)}
          className={`text-sm font-medium transition-opacity ${isActive('/students') ? 'opacity-100' : 'opacity-60 hover:opacity-100'} ${mobile ? 'text-lg py-2' : ''}`}
        >
          Candidates
        </Link>
      )}
      
      {isStudent && (
        <Link 
          to="/settings" 
          onClick={() => mobile && setIsOpen(false)}
          className={`text-sm font-medium transition-opacity ${isActive('/settings') ? 'opacity-100' : 'opacity-60 hover:opacity-100'} ${mobile ? 'text-lg py-2' : ''}`}
        >
          Profile
        </Link>
      )}
      
      {(isIndustry || isStudent) && (
        <Link 
          to="/roles" 
          onClick={() => mobile && setIsOpen(false)}
          className={`text-sm font-medium transition-opacity ${isActive('/roles') ? 'opacity-100' : 'opacity-60 hover:opacity-100'} ${mobile ? 'text-lg py-2' : ''}`}
        >
          {isIndustry ? 'Roles' : 'Find Roles'}
        </Link>
      )}
      
      {isIndustry && (
        <Link 
          to="/matches" 
          onClick={() => mobile && setIsOpen(false)}
          className={`text-sm font-medium transition-opacity ${isActive('/matches') ? 'opacity-100' : 'opacity-60 hover:opacity-100'} ${mobile ? 'text-lg py-2' : ''}`}
        >
          Matches
        </Link>
      )}
      
      {isStudent && (
        <Link 
          to="/skill-gap" 
          onClick={() => mobile && setIsOpen(false)}
          className={`text-sm font-medium transition-opacity ${isActive('/skill-gap') ? 'opacity-100' : 'opacity-60 hover:opacity-100'} ${mobile ? 'text-lg py-2' : ''}`}
        >
          Skill Gap
        </Link>
      )}
      
      {isStudent && (
        <Link 
          to="/scholarships" 
          onClick={() => mobile && setIsOpen(false)}
          className={`text-sm font-medium transition-opacity ${isActive('/scholarships') ? 'opacity-100' : 'opacity-60 hover:opacity-100'} ${mobile ? 'text-lg py-2' : ''}`}
        >
          Scholarships
        </Link>
      )}

      {isStudent && (
        <Link 
          to="/internships" 
          onClick={() => mobile && setIsOpen(false)}
          className={`text-sm font-medium transition-opacity ${isActive('/internships') ? 'opacity-100' : 'opacity-60 hover:opacity-100'} ${mobile ? 'text-lg py-2' : ''}`}
        >
          Internships
        </Link>
      )}
    </>
  );
  
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-black z-50">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="-ml-2">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left font-bold text-xl">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                <NavLinks mobile />
              </div>
            </SheetContent>
          </Sheet>

          <Link to={dashboardPath} className="text-xl font-bold tracking-tight">
            SkillSync
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center">
          <NavLinks />
        </div>
        
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:opacity-80 transition-opacity btn-interaction">
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
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <User className="mr-2 h-4 w-4" />
                Edit Profile
              </DropdownMenuItem>
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
