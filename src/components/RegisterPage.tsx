import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Briefcase, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, UserRole } from '@/contexts/AuthContext';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
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

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await register(email, password, name, selectedRole);
      navigate(selectedRole === 'student' ? '/student-dashboard' : '/industry-dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <Link to="/" className="text-2xl font-bold tracking-tight">
              SkillSync
            </Link>
          </div>

          <h1 className="text-4xl font-bold mb-2">Create Account</h1>
          <p className="text-base opacity-60 mb-12">
            Start matching talent with opportunities
          </p>

          {/* Role Selection */}
          <div className="mb-8">
            <Label className="text-sm font-semibold mb-4 block">I am a...</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`p-6 border rounded-sm transition-all ${
                  selectedRole === 'student'
                    ? 'border-black bg-black text-white'
                    : 'border-black hover:bg-gray-50'
                }`}
              >
                <GraduationCap className="h-8 w-8 mb-3" />
                <div className="text-lg font-semibold">Student</div>
                <p className={`text-sm mt-1 ${selectedRole === 'student' ? 'opacity-80' : 'opacity-60'}`}>
                  Find opportunities
                </p>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('industry')}
                className={`p-6 border rounded-sm transition-all ${
                  selectedRole === 'industry'
                    ? 'border-black bg-black text-white'
                    : 'border-black hover:bg-gray-50'
                }`}
              >
                <Briefcase className="h-8 w-8 mb-3" />
                <div className="text-lg font-semibold">Recruiter</div>
                <p className={`text-sm mt-1 ${selectedRole === 'industry' ? 'opacity-80' : 'opacity-60'}`}>
                  Find talent
                </p>
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
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
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
                className="h-12"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold group"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>

          <p className="mt-8 text-sm text-center opacity-60">
            Already have an account?{' '}
            <Link to="/login" className="opacity-100 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex flex-1 bg-black text-white items-center justify-center p-12">
        <div className="max-w-lg">
          <div className="font-mono text-8xl font-bold mb-8">1,247</div>
          <h2 className="text-3xl font-bold mb-4">
            Candidates matched this week
          </h2>
          <p className="text-lg opacity-80">
            Join hundreds of organizations using SkillSync to find perfect talent matches faster than ever before.
          </p>
        </div>
      </div>
    </div>
  );
}
