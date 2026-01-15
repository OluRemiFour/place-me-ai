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
    if (user?.role === 'industry') {
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Manage your account and profile information.
        </p>

        <Card className="border-2 border-black shadow-[8px_8px_0_0_#000]">
          <CardHeader>
            <CardTitle className="text-2xl">Company Profile</CardTitle>
            <CardDescription>
              This information will be visible to students and other partners.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleIndustrySave}>
            <CardContent className="space-y-6">
            {user.role === 'industry' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input 
                      id="company_name"
                      value={industryData.company_name}
                      onChange={(e) => setIndustryData({...industryData, company_name: e.target.value})}
                      className="pl-10 h-12"
                      placeholder="SkillSync Inc."
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_url">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input 
                      id="company_url"
                      value={industryData.company_url || ''}
                      onChange={(e) => setIndustryData({...industryData, company_url: e.target.value})} // Note: check type definition if company_url exists
                      className="pl-10 h-12"
                      placeholder="https://www.skillsync.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry_type">Industry</Label>
                      <Select 
                        value={industryData.industry_type || ''} 
                        onValueChange={(v) => setIndustryData({...industryData, industry_type: v})}
                      >
                        <SelectTrigger className="h-12">
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
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input 
                          id="location"
                          value={industryData.location || ''}
                          onChange={(e) => setIndustryData({...industryData, location: e.target.value})}
                          className="pl-10 h-12"
                          placeholder="Remote, Lagos, New York..."
                        />
                      </div>
                    </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">About Company</Label>
                  <Textarea 
                    id="bio"
                    value={industryData.bio || ''}
                    onChange={(e) => setIndustryData({...industryData, bio: e.target.value})}
                    placeholder="Tell us about your company's mission, values, and what you do..."
                    className="min-h-[120px]"
                  />
                </div>
              </>
            ) : null}    {error && (
                <div className="p-4 rounded-md bg-red-50 border border-red-200 text-sm text-red-600">
                  {error}
                </div>
              )}

            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full h-12 font-bold transition-all text-lg"
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
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
