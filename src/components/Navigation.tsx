import { Link, useLocation } from 'react-router-dom';

export function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-black z-50">
      <div className="container mx-auto px-8 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight">
          SkillSync
        </Link>
        
        <div className="flex gap-8 items-center">
          <Link 
            to="/dashboard" 
            className={`text-sm font-medium transition-opacity ${isActive('/dashboard') ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/students" 
            className={`text-sm font-medium transition-opacity ${isActive('/students') ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
          >
            Students
          </Link>
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
        </div>
        
        <div className="flex items-center gap-3">
          <button className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity">
            Settings
          </button>
          <div className="w-8 h-8 bg-black text-white rounded-sm flex items-center justify-center text-xs font-bold">
            AR
          </div>
        </div>
      </div>
    </nav>
  );
}
