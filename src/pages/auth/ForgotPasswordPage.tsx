import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/services/api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold">Check your email</h1>
          <p className="text-gray-500">
            We have sent password reset instructions to <strong>{email}</strong>
          </p>
          <div className="pt-4">
             <Link to="/login">
                <Button variant="outline" className="w-full h-12">
                   Back to Sign In
                </Button>
             </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Forgot password?</h1>
          <p className="mt-2 text-gray-500">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-base font-bold"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending link...
              </>
            ) : (
              <>
                Send Reset Link
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

          <div className="text-center">
             <Link to="/login" className="text-sm font-semibold hover:underline">
               Back to Sign In
             </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
