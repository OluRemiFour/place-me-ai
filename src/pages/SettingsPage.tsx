import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Check, Building2, Globe, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { ProfileBuilder } from './student/ProfileBuilder';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export function SettingsPage() {
  const { user, isProfileComplete, checkProfileStatus, refreshUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Industry Profile State
  const [industryData, setIndustryData] = useState({
    company_name: '',
    industry_type: '',
    location: '',
    bio: '',
    company_url: ''
  });

  useEffect(() => {
    const refreshProfile = async () => {
        // Force refresh from backend to ensure inputs aren't stale
        await refreshUser();
    };
    refreshProfile();
  }, []);

  useEffect(() => {
    const normalizeRole = (r: string | null | undefined) => r?.toLowerCase().trim();
    if (normalizeRole(user?.role) === 'industry') {
      setIndustryData({
        company_name: user.company_name || '',
        industry_type: user.industry_type || '',
        location: user.location || '',
        bio: user.bio || '',
        company_url: user.company_url || ''
      });
    }
  }, [user]);

  if (!user) return null;

  // Students use the existing ProfileBuilder
  if (user.role === 'student') {
    return <ProfileBuilder />;
  }

  // Industry users get a specialized settings form
  const handleIndustrySave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess(false);

    try {
      await api.updateProfile(user.id, {
        company_name: industryData.company_name,
        industry_type: industryData.industry_type,
        location: industryData.location,
        bio: industryData.bio,
        company_url: industryData.company_url
      });
      
      await checkProfileStatus(); // Re-validate profile status
      
      // Update local user context immediately
      updateUser({
        company_name: industryData.company_name,
        industry_type: industryData.industry_type,
        location: industryData.location,
        bio: industryData.bio,
        company_url: industryData.company_url
      });

      setSuccess(true);
      toast.success("Profile updated successfully!");
      
      // If they were completing profile, maybe redirect to dashboard after a delay
      setTimeout(() => {
        navigate('/industry-dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <div className="bg-white rounded-lg p-0 md:p-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-1">Company Profile</h2>
            <p className="text-muted-foreground">
              This information will be visible to students and other partners.
            </p>
          </div>

          <form onSubmit={handleIndustrySave}>
             {/* Completion Status for everyone */}
             <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-base">Profile Completion</span>
                    <span className="font-mono font-bold bg-black text-white px-2 py-0.5 rounded text-sm">{isProfileComplete ? '100%' : '85%'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-black h-3 rounded-full transition-all duration-500" style={{ width: isProfileComplete ? '100%' : '85%' }}></div>
                </div>
                {!isProfileComplete && (
                   <p className="text-sm text-red-600 mt-3 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-600"></span>
                      Please complete all fields to unlock full access.
                   </p>
                )}
            </div>

            <div className="space-y-8">
            {user.role === 'industry' ? (
              <>
                <div className="space-y-3">
                  <Label htmlFor="company_name" className="text-base">Company Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <Input 
                      id="company_name"
                      value={industryData.company_name}
                      onChange={(e) => setIndustryData({...industryData, company_name: e.target.value})}
                      className="pl-12 h-14 text-base bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                      placeholder="SkillSync Inc."
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="company_url" className="text-base">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <Input 
                      id="company_url"
                      value={industryData.company_url || ''}
                      onChange={(e) => setIndustryData({...industryData, company_url: e.target.value})}
                      className="pl-12 h-14 text-base bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                      placeholder="https://www.skillsync.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="industry_type" className="text-base">Industry</Label>
                      <Select 
                        value={industryData.industry_type || ''} 
                        onValueChange={(v) => setIndustryData({...industryData, industry_type: v})}
                      >
                        <SelectTrigger className="h-14 text-base bg-gray-50/50 border-gray-200 focus:bg-white transition-all">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="location" className="text-base">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <Input 
                          id="location"
                          value={industryData.location || ''}
                          onChange={(e) => setIndustryData({...industryData, location: e.target.value})}
                          className="pl-12 h-14 text-base bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                          placeholder="Remote, Lagos, New York..."
                        />
                      </div>
                    </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="bio" className="text-base">About Company</Label>
                  <Textarea 
                    id="bio"
                    value={industryData.bio || ''}
                    onChange={(e) => setIndustryData({...industryData, bio: e.target.value})}
                    placeholder="Tell us about your company's mission, values, and what you do..."
                    className="min-h-[150px] text-base p-4 bg-gray-50/50 border-gray-200 focus:bg-white transition-all resize-y"
                  />
                </div>
              </>
            ) : null}    
            
            {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0"></span>
                  {error}
                </div>
            )}
            </div>

            <div className="mt-10">
              <Button 
                type="submit" 
                className="w-full md:w-auto md:min-w-[200px] h-12 font-bold transition-all text-base shadow-lg hover:shadow-xl active:scale-[0.98]"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  'Save Profile'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
