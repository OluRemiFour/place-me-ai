// This code is a placeholder to satisfy the tool call.
// The actual content for the new file OTPVerificationPage.tsx is provided below.
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function OTPVerificationPage() {
  const { user, verifyOTP, resendOTP, isVerified } = useAuth();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isVerified) {
      navigate('/dashboard');
    }
  }, [isVerified, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      await verifyOTP(otp);
      toast.success("Email verified successfully!");
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await resendOTP();
      toast.success("OTP has been resent to your email");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-black flex items-center justify-center rounded-sm">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 mb-2">
          Verify your email
        </h2>
        <p className="text-center text-sm text-gray-600 mb-8">
          We've sent a 6-digit verification code to <span className="font-semibold">{user?.email}</span>
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-black rounded-sm shadow-[4px_4px_0_0_#000] sm:px-10">
          <form className="space-y-6" onSubmit={handleVerify}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-2xl tracking-[0.5em] font-mono h-14 border-black"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-black text-white hover:bg-gray-800 transition-all font-bold"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Verify Account
            </Button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-4">
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-sm font-medium text-black hover:underline flex items-center gap-2"
            >
              {isResending ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
              Resend verification code
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-gray-500 hover:text-black flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
