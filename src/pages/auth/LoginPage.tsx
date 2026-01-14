import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Briefcase, GraduationCap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, googleLogin, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedRole) {
      setError('Please select your role');
      return;
    }

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password, selectedRole);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full flex relative">
      {/* Mobile Background with Overlay */}
      <div className="absolute inset-0 z-0 lg:hidden">
        <div className="absolute inset-0 bg-black/5" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
      </div>

      {/* Left Panel - Form */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white/80 backdrop-blur-sm lg:bg-white">
        <div className="w-full max-w-md space-y-10">
          <div className="">
            <Link to="/" className="text-2xl font-bold tracking-tight inline-block hover:opacity-80 transition-opacity">
              SkillSync
            </Link>
            <h1 className="mt-8 text-4xl font-bold tracking-tight text-gray-900">Sign In</h1>
            <p className="mt-2 text-base text-gray-500">
              Welcome back! Access your talent matching dashboard.
            </p>
          </div>

          {/* Role Selection */}
          <div>
            <Label className="text-sm font-semibold mb-4 block text-gray-900">I am a...</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`group relative p-4 flex flex-col items-center justify-center border-2 rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                  selectedRole === 'student'
                    ? 'border-black bg-black text-white shadow-lg scale-[1.02]'
                    : 'border-gray-200 bg-white hover:border-black/30 hover:bg-gray-50'
                }`}
              >
                <GraduationCap className={`h-8 w-8 mb-3 transition-colors ${
                  selectedRole === 'student' ? 'text-white' : 'text-gray-900'
                }`} />
                <div className="text-base font-bold">Student</div>
                <p className={`text-xs mt-1 text-center font-medium ${
                  selectedRole === 'student' ? 'text-white/80' : 'text-gray-500'
                }`}>
                  Find opportunities
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('industry')}
                className={`group relative p-4 flex flex-col items-center justify-center border-2 rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                  selectedRole === 'industry'
                    ? 'border-black bg-black text-white shadow-lg scale-[1.02]'
                    : 'border-gray-200 bg-white hover:border-black/30 hover:bg-gray-50'
                }`}
              >
                <Briefcase className={`h-8 w-8 mb-3 transition-colors ${
                  selectedRole === 'industry' ? 'text-white' : 'text-gray-900'
                }`} />
                <div className="text-base font-bold">Recruiter</div>
                <p className={`text-xs mt-1 text-center font-medium ${
                  selectedRole === 'industry' ? 'text-white/80' : 'text-gray-500'
                }`}>
                  Find talent
                </p>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm font-medium text-gray-600 hover:text-black hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
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
                if (selectedRole && credentialResponse.credential) {
                  googleLogin(credentialResponse.credential, selectedRole);
                  navigate('/dashboard');
                } else if (!selectedRole) {
                  setError('Please select a role first');
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
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-black hover:underline">
              Create free account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex flex-1 relative bg-black text-white items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/40" />
        
        <div className="relative max-w-lg p-12 select-none">
          <div className="font-mono text-8xl font-bold mb-8 tracking-tighter opacity-90">
            87%
          </div>
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Precision Matching at Enterprise Scale
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Our AI-powered matching engine connects the right talent with the right opportunities instantly, saving you hours of manual screening each week.
          </p>
          
          <div className="mt-12 flex gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-black bg-gray-800" />
              ))}
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-sm font-semibold">Trusted by 500+ companies</span>
              <span className="text-xs text-gray-400">Join the network today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
