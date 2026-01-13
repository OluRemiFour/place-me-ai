import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }
    const verify = async () => {
        try {
            await api.verifyEmail(token);
            setStatus('success');
        } catch (e) {
            setStatus('error');
        }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg text-center space-y-6">
        {status === 'verifying' && (
          <>
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto" />
            <h1 className="text-2xl font-bold">Verifying your email...</h1>
            <p className="text-gray-500">Please wait while we verify your email address.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold">Email Verified!</h1>
            <p className="text-gray-500">Your email has been successfully verified. You can now access your dashboard.</p>
            <div className="pt-4">
                <Link to="/login">
                <Button className="w-full h-12 text-base">Continue to Sign In</Button>
                </Link>
            </div>
          </>
        )}

        {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto" />
              <h1 className="text-2xl font-bold">Verification Failed</h1>
              <p className="text-gray-500">The verification link is invalid or expired.</p>
              <div className="pt-4">
                  <Link to="/login">
                  <Button variant="outline" className="w-full h-12 text-base">Back to Sign In</Button>
                  </Link>
              </div>
            </>
        )}
      </div>
    </div>
  );
}
