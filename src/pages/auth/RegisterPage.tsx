import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Briefcase, GraduationCap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { RoleSelectionModal } from '@/components/auth/RoleSelectionModal';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, googleLogin, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [error, setError] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [pendingGoogleToken, setPendingGoogleToken] = useState<string | null>(null);

  const handleGoogleSuccess = async (idToken: string, role: UserRole = selectedRole) => {
    try {
      await googleLogin(idToken, role);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.message === 'ROLE_REQUIRED') {
        setPendingGoogleToken(idToken);
        setShowRoleModal(true);
      } else {
        setError(err.message || 'Google Login failed');
      }
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setShowRoleModal(false);
    if (pendingGoogleToken) {
      handleGoogleSuccess(pendingGoogleToken, role);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedRole) {
      setError('Please select your role');
      return;
    }

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
    }

    try {
      await register(email, password, name, selectedRole, confirmPassword); 
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full flex relative">
      {/* Mobile Background with Overlay */}
      <div className="absolute inset-0 z-0 lg:hidden">
        <div className="absolute inset-0 bg-black/5" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
      </div>

      {/* Left Panel - Form */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start min-h-screen py-10 px-6 sm:px-10 lg:px-12 xl:px-24 bg-white/80 backdrop-blur-sm lg:bg-white overflow-y-auto">
        <div className="w-full max-w-[400px] sm:max-w-md space-y-6 sm:space-y-8 my-auto">
          <div>
            <Link to="/" className="text-2xl font-bold tracking-tight inline-block hover:opacity-80 transition-opacity">
              SkillSync
            </Link>
            <h1 className="mt-8 text-4xl font-bold tracking-tight text-gray-900">Create Account</h1>
            <p className="mt-2 text-base text-gray-500">
              Start matching talent with opportunities today.
            </p>
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold block text-gray-900">I am a...</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`group relative p-3 sm:p-4 flex sm:flex-col items-center sm:justify-center border-2 rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                  selectedRole === 'student'
                    ? 'border-black bg-black text-white shadow-lg scale-[1.02]'
                    : 'border-gray-200 bg-white hover:border-black/30 hover:bg-gray-50'
                }`}
              >
                <GraduationCap className={`h-6 w-6 sm:h-8 sm:w-8 mr-3 sm:mr-0 sm:mb-3 transition-colors ${
                  selectedRole === 'student' ? 'text-white' : 'text-gray-900'
                }`} />
                <div className="flex flex-col sm:items-center">
                  <div className="text-sm sm:text-base font-bold">Student</div>
                  <p className={`text-[10px] sm:text-xs mt-0.5 text-left sm:text-center font-medium ${
                    selectedRole === 'student' ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    Find opportunities
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('industry')}
                className={`group relative p-3 sm:p-4 flex sm:flex-col items-center sm:justify-center border-2 rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                  selectedRole === 'industry'
                    ? 'border-black bg-black text-white shadow-lg scale-[1.02]'
                    : 'border-gray-200 bg-white hover:border-black/30 hover:bg-gray-50'
                }`}
              >
                <Briefcase className={`h-6 w-6 sm:h-8 sm:w-8 mr-3 sm:mr-0 sm:mb-3 transition-colors ${
                  selectedRole === 'industry' ? 'text-white' : 'text-gray-900'
                }`} />
                <div className="flex flex-col sm:items-center">
                  <div className="text-sm sm:text-base font-bold">Recruiter</div>
                  <p className={`text-[10px] sm:text-xs mt-0.5 text-left sm:text-center font-medium ${
                    selectedRole === 'industry' ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    Find talent
                  </p>
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 bg-white/50 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-white/50 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-white/50 focus:bg-white"
                required
              />
              <p className="text-xs text-gray-500">Must be at least 6 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 bg-white/50 focus:bg-white"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={credentialResponse => {
                if (credentialResponse.credential) {
                  handleGoogleSuccess(credentialResponse.credential);
                }
              }}
              onError={() => {
                setError('Google Login failed');
              }}
              useOneTap
              theme="outline"
              size="large"
              width="100%"
            />
          </div>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-black hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <RoleSelectionModal 
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onSelect={handleRoleSelect}
      />

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex flex-1 relative bg-black text-white items-center justify-center overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-bl from-black/80 to-black/40" />
        
        <div className="relative max-w-lg p-12 select-none">
          <div className="font-mono text-8xl font-bold mb-8 tracking-tighter opacity-90">
            1.2k+
          </div>
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Matches made this week
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Join the fastest growing network of top-tier universities and industry leaders transforming the future of work.
          </p>
          
           <div className="mt-12 flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-3xl font-bold">500+</span>
              <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Companies</span>
            </div>
            <div className="h-10 w-[1px] bg-gray-700" />
            <div className="flex flex-col">
              <span className="text-3xl font-bold">15k+</span>
              <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Students</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
