import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Briefcase, Target, TrendingUp, BarChart3, Search, ExternalLink, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { api, Student, Role } from '@/services/api';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

import { Textarea } from '@/components/ui/textarea';

export function IndustryDashboard() {
  const { user, checkProfileStatus, refreshUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Local state for company details (derived from user)
  const [companyDetails, setCompanyDetails] = useState({
    website: user?.company_url || '',
    location: user?.location || '',
    bio: user?.bio || ''
  });
  
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { isProfileComplete } = useAuth();

  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    activeRoles: 0,
    matchesThisWeek: 0,
    avgMatchScore: 0,
    topSkills: [] as { skill: string; demand: number }[],
    matchTrend: [] as { date: string; matches: number }[],
    skillDistribution: [] as { category: string; count: number }[],
    recentMatches: [] as any[],
    hiringPipeline: { applied: 0, message: 0, interviewing: 0, offers: 0 },
    recentActivity: [] as any[]
  });

  useEffect(() => {
    // Force refresh context on load to ensure header/modal data is fresh
    refreshUser();
  }, []);

  useEffect(() => {
    const normalizeRole = (r: string | null | undefined) => r?.toLowerCase().trim();
    if (!isProfileComplete && normalizeRole(user?.role) === 'industry') {
        const timer = setTimeout(() => setShowProfileModal(true), 1000);
        return () => clearTimeout(timer);
    }
  }, [isProfileComplete, user]);

  useEffect(() => {
    // Sync state with user context when it changes (e.g. after update)
    if (user) {
        setCompanyDetails({
            website: user.company_url || '',
            location: user.location || '',
            bio: user.bio || ''
        });
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [studentsData, rolesData, metricsData] = await Promise.all([
          api.getStudents(),
          api.getRoles(),
          api.getDashboardMetrics()
        ]);
        setStudents(studentsData);
        setRoles(rolesData);
        setMetrics(metricsData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.skills?.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleStudentClick = (studentId: string) => {
    navigate(`/student/${studentId}`); 
  };

  return (
    <div className="container mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-12 flex justify-between items-start">
        <div>
           <h1 className="text-4xl font-bold mb-2">Industry Dashboard</h1>
           <div className="text-sm opacity-60 mb-2">
             Welcome back, {user?.company_name || user?.name || 'Recruiter'} · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
           </div>
           <div className="flex gap-4 text-sm opacity-80 flex-wrap">
              {companyDetails.website && <a href={companyDetails.website} target="_blank" className="hover:underline flex items-center gap-1"><ExternalLink className="w-3 h-3"/> {companyDetails.website}</a>}
              {companyDetails.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {companyDetails.location}</span>}
              {companyDetails.bio && <span className="block w-full text-xs mt-1 opacity-60 max-w-2xl">{companyDetails.bio}</span>}
           </div>
        </div>
        
        <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-black">Edit Company Profile</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Company Details</DialogTitle>
                    <DialogDescription>Update your company's public information.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input 
                            id="companyName" 
                            defaultValue={user?.company_name || user?.name} 
                            disabled
                            className="bg-gray-100"
                        />
                         <p className="text-xs opacity-60">Contact support to change company name</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input 
                            id="website" 
                            value={companyDetails.website} 
                            onChange={(e) => setCompanyDetails({...companyDetails, website: e.target.value})}
                            placeholder="https://example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input 
                            id="location" 
                            value={companyDetails.location} 
                            onChange={(e) => setCompanyDetails({...companyDetails, location: e.target.value})}
                           placeholder="e.g. San Francisco, CA"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="about">About Company</Label>
                         <Textarea 
                            id="about" 
                            value={companyDetails.bio} 
                            onChange={(e) => setCompanyDetails({...companyDetails, bio: e.target.value})}
                            placeholder="Brief description of your company..."
                            className="min-h-[100px]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={async () => {
                        if (!user) return;
                        try {
                            await api.updateProfile(user.id, {
                                ...companyDetails,
                                company_url: companyDetails.website,
                                bio: companyDetails.bio
                            });
                             // Refresh context
                            await checkProfileStatus();
                            // Update local user context immediately
                            updateUser({
                                company_url: companyDetails.website,
                                bio: companyDetails.bio,
                                location: companyDetails.location
                            });
                            // Optional: Could reload page or use a toast here
                            // For now, simpler alert to confirm action
                            toast.success("Company profile updated successfully!");
                            setShowProfileModal(false);
                        } catch (e) {
                            console.error(e);
                            toast.error("Failed to update profile.");
                        }
                    }}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="border border-black rounded-sm p-8 bg-white">
          <div className="text-sm opacity-60 mb-3">Total Candidates</div>
          <div className="flex items-end justify-between">
            <div className="font-mono text-4xl font-bold leading-none">
              {metrics.totalStudents}
            </div>
            <Users className="h-6 w-6 opacity-40" />
          </div>
        </div>
        <div className="border border-black rounded-sm p-8 bg-white">
          <div className="text-sm opacity-60 mb-3">Active Roles</div>
          <div className="flex items-end justify-between">
            <div className="font-mono text-4xl font-bold leading-none">
              {metrics.activeRoles}
            </div>
            <Briefcase className="h-6 w-6 opacity-40" />
          </div>
        </div>
        <div className="border border-black rounded-sm p-8 bg-white">
          <div className="text-sm opacity-60 mb-3">Matches This Week</div>
          <div className="flex items-end justify-between">
            <div className="font-mono text-4xl font-bold leading-none">
              {metrics.matchesThisWeek}
            </div>
            <Target className="h-6 w-6 opacity-40" />
          </div>
        </div>
        <div className="border border-black rounded-sm p-8 bg-white">
          <div className="text-sm opacity-60 mb-3">Avg. Match Score</div>
          <div className="flex items-end justify-between">
            <div className="font-mono text-4xl font-bold leading-none">
              {metrics.avgMatchScore}%
            </div>
            <TrendingUp className="h-6 w-6 opacity-40" />
          </div>
        </div>
      </div>

      {/* Pipeline and Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Hiring Pipeline Funnel */}
        <div className="border border-black rounded-sm p-8 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Hiring Pipeline</h2>
            <BarChart3 className="h-5 w-5 opacity-40" />
          </div>
          <div className="space-y-4">
              <div className="relative">
                  <div className="flex justify-between text-sm font-semibold mb-1">
                      <span>Applied</span>
                      <span>{metrics.hiringPipeline.applied}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div className="bg-black h-full rounded-full" style={{ width: '100%' }}></div>
                  </div>
              </div>
              <div className="relative pl-4">
                   <div className="flex justify-between text-sm font-semibold mb-1">
                      <span>Message</span>
                      <span>{metrics.hiringPipeline.message}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div className="bg-black h-full rounded-full" style={{ width: `${(metrics.hiringPipeline.message / metrics.hiringPipeline.applied) * 100 || 0}%` }}></div>
                  </div>
              </div>
               <div className="relative pl-8">
                   <div className="flex justify-between text-sm font-semibold mb-1">
                      <span>Interviewing</span>
                      <span>{metrics.hiringPipeline.interviewing}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div className="bg-black h-full rounded-full" style={{ width: `${(metrics.hiringPipeline.interviewing / metrics.hiringPipeline.applied) * 100 || 0}%` }}></div>
                  </div>
              </div>
               <div className="relative pl-12">
                   <div className="flex justify-between text-sm font-semibold mb-1">
                      <span>Offers</span>
                      <span>{metrics.hiringPipeline.offers}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div className="bg-black h-full rounded-full" style={{ width: `${(metrics.hiringPipeline.offers / metrics.hiringPipeline.applied) * 100 || 0}%` }}></div>
                  </div>
              </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="border border-black rounded-sm p-8 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <div className="flex gap-2">
                 <Badge variant="outline" className="text-xs">All</Badge>
                 <Badge variant="secondary" className="text-xs bg-gray-100">Applications</Badge>
            </div>
          </div>
          <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2">
            {metrics.recentActivity.map((activity: any) => (
              <div key={activity.id} className="flex gap-3 items-start border-b border-gray-100 pb-3">
                <div className={`h-8 w-8 rounded-full bg-${activity.color}-100 flex items-center justify-center text-${activity.color}-700 font-bold text-xs`}>
                  {activity.initials}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {activity.user} {activity.action} <span className="font-bold">{activity.target}</span>
                  </p>
                  <p className="text-xs opacity-50">{activity.time}</p>
                </div>
              </div>
            ))}
            {metrics.recentActivity.length === 0 && (
              <div className="text-center py-8 opacity-50 text-sm italic">No recent activity</div>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Skills Analytics Column */}
        <div className="space-y-6">
            {/* Top Skills in Demand */}
            <div className="border border-black rounded-sm p-6 bg-white">
              <h2 className="text-xl font-bold mb-4">In-Demand Skills</h2>
              <div className="space-y-4">
                {metrics.topSkills.map((item, idx) => (
                  <div key={item.skill} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                         <Badge variant={idx < 3 ? "default" : "outline"} className={idx < 3 ? "bg-black hover:bg-black/90" : "text-gray-500"}>
                            #{idx + 1}
                         </Badge>
                         <span className="font-semibold">{item.skill}</span>
                      </div>
                      <span className="font-mono font-bold text-xs">{item.demand}%</span>
                    </div>
                    <Progress value={item.demand} className="h-1.5" />
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Category Distribution */}
            <div className="border border-black rounded-sm p-6 bg-white">
                <h2 className="text-xl font-bold mb-4">Category Distribution</h2>
                 <div className="space-y-3">
                    {metrics.skillDistribution.length > 0 ? metrics.skillDistribution.map((dist, i) => (
                        <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-default group">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500'][i % 4]}`}></div>
                                <span className="text-sm font-medium">{dist.category}</span>
                            </div>
                            <span className="font-mono text-xs opacity-60 group-hover:opacity-100">{dist.count} skills</span>
                        </div>
                    )) : (
                        <div className="text-center py-4 opacity-50 text-sm">No distribution data available</div>
                    )}
                </div>
            </div>
        </div>

        {/* Candidate Search & List */}
        <div className="lg:col-span-2 border border-black rounded-sm p-8 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Top Candidates</h2>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-black"
              onClick={() => navigate('/students')}
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
            <Input
              placeholder="Search by name, email, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>

          {/* Student List */}
          <div className="space-y-2">
            {filteredStudents.slice(0, 5).map((student) => (
              <div
                key={student.id}
                onClick={() => handleStudentClick(student.id)}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-sm hover:border-black hover:shadow-[2px_2px_0_0_#000] transition-all cursor-pointer"
              >
                <div className="flex-1">
                  <div className="font-semibold mb-1">{student.name}</div>
                  <div className="flex gap-1">
                    {student.topSkills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-2xl font-bold">{student.matchScore}%</div>
                  <div className="text-xs opacity-60">READINESS</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Roles */}
      <div className="border border-black rounded-sm p-8 bg-white mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Active Role Requirements</h2>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-black"
            onClick={() => navigate('/roles')}
          >
            Manage Roles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.slice(0, 6).map((role) => (
            <div
              key={role.id}
              onClick={() => navigate('/roles')}
              className="p-4 border border-gray-200 rounded-sm hover:border-black transition-all cursor-pointer"
            >
              <h3 className="font-semibold mb-1">{role.title}</h3>
              <p className="text-sm opacity-60 mb-3">{role.company}</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{role.seniority}</Badge>
                <span className="text-xs opacity-60">{role.requiredSkills.length} skills</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => navigate('/students')}
          className="border border-black rounded-sm p-6 bg-white hover:shadow-[4px_4px_0_0_#000] transition-all cursor-pointer"
        >
          <Users className="h-6 w-6 mb-3" />
          <h4 className="text-lg font-bold mb-2">Browse All Candidates</h4>
          <p className="text-sm opacity-60 mb-4">
            View complete profiles with certified skills and experience
          </p>
          <div className="flex items-center gap-2 font-medium">
            <span>Explore</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        <div
          onClick={() => navigate('/roles')}
          className="border border-black rounded-sm p-6 bg-white hover:shadow-[4px_4px_0_0_#000] transition-all cursor-pointer"
        >
          <Briefcase className="h-6 w-6 mb-3" />
          <h4 className="text-lg font-bold mb-2">Manage Role Requirements</h4>
          <p className="text-sm opacity-60 mb-4">
            Configure and add new industry role requirements
          </p>
          <div className="flex items-center gap-2 font-medium">
            <span>Configure</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        <div
          onClick={() => navigate('/matches')}
          className="border border-black rounded-sm p-6 bg-white hover:shadow-[4px_4px_0_0_#000] transition-all cursor-pointer"
        >
          <Target className="h-6 w-6 mb-3" />
          <h4 className="text-lg font-bold mb-2">Run AI Match Analysis</h4>
          <p className="text-sm opacity-60 mb-4">
            Generate talent matches for any role requirement
          </p>
          <div className="flex items-center gap-2 font-medium">
            <span>Analyze</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
