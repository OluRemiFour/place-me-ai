import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function OTPVerificationPage() {
  const navigate = useNavigate();

  useEffect(() => {
      navigate('/login');
  }, [navigate]);

  return null;
}
// Original content commented out to fix build errors as OTP is disabled
/*
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function OTPVerificationPage() {
  const { user, verifyOTP, resendOTP, isVerified } = useAuth(); // These no longer exist
  // ... rest of the component
}
*/
