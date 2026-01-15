import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api, Role } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function IndustryRequirements() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State for New Role
  const [newRoleForm, setNewRoleForm] = useState<Partial<Role>>({
      title: '',
      company: user?.company_name || 'My Company', 
      seniority: 'Mid-Level',
      industry: 'Technology',
      requiredSkills: [],
      preferredSkills: [],
      experience: '0-2 years',
      location: 'Remote',
      description: ''
  });
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [userApplications, setUserApplications] = useState<any[]>([]);

  useEffect(() => {
    loadRoles();
    if (user?.role === 'student' && user?.id) {
        loadUserApplications();
    }
  }, []);

  const loadUserApplications = async () => {
    try {
        const apps = await api.getStudentApplications(user.id);
        setUserApplications(apps);
    } catch (error) {
        console.error("Failed to load user applications", error);
    }
  };

  const loadRoles = async () => {
    try {
      const data = await api.getRoles();
      setRoles(data);
    } catch (error) {
      console.error('Failed to load roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const industries = ['all', ...new Set(roles.map(r => r.industry))];

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = industryFilter === 'all' || role.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  const handleAddSkill = (type: 'required' | 'preferred') => {
      if (!newSkillInput.trim()) return;
      
      if (type === 'required') {
          setNewRoleForm(prev => ({
              ...prev,
              requiredSkills: [...(prev.requiredSkills || []), newSkillInput.trim()]
          }));
      } else {
          setNewRoleForm(prev => ({
              ...prev,
              preferredSkills: [...(prev.preferredSkills || []), newSkillInput.trim()]
          }));
      }
      setNewSkillInput('');
  };

  const removeSkill = (skillToRemove: string, type: 'required' | 'preferred') => {
      if (type === 'required') {
          setNewRoleForm(prev => ({
              ...prev,
              requiredSkills: prev.requiredSkills?.filter(s => s !== skillToRemove)
          }));
      } else {
          setNewRoleForm(prev => ({
              ...prev,
              preferredSkills: prev.preferredSkills?.filter(s => s !== skillToRemove)
          }));
      }
  };

  const handleApply = async () => {
      if (!selectedRole) return;
      setIsApplying(true);
      try {
          await api.applyForRole(selectedRole.id, user.id, applicationMessage);
          toast.success("Application submitted successfully!");
          setSelectedRole(null);
          setApplicationMessage('');
          loadUserApplications(); // Refresh applications list
      } catch (error) {
          console.error("Failed to apply", error);
          toast.error("Failed to submit application.");
      } finally {
          setIsApplying(false);
      }
  };

  const handlePublish = async () => {
      setIsPublishing(true);
      try {
          // Map to backend schema expectation
          const rolePayload = {
              title: newRoleForm.title,
              company_name: newRoleForm.company,
              recruiter_id: 'current_user_id', 
              description: newRoleForm.description,
              requirements: [], 
              role_type: 'full_time', 
              location: newRoleForm.location,
              is_active: true,
              required_skills: newRoleForm.requiredSkills,
              preferred_skills: newRoleForm.preferredSkills,
              min_experience_years: parseInt(newRoleForm.experience?.split('-')[0] || '0'), 
              seniority: newRoleForm.seniority,
              industry: newRoleForm.industry,
              experience: newRoleForm.experience
          };

          await api.createRole(rolePayload);
          await loadRoles();
          setSelectedRole(null);
          // Reset form
          setNewRoleForm({
            title: '',
            company: 'My Company',
            seniority: 'Mid-Level',
            industry: 'Technology',
            requiredSkills: [],
            preferredSkills: [],
            experience: '0-2 years',
            location: 'Remote',
            description: ''
          });
      } catch (error) {
          console.error("Failed to publish role", error);
          toast.error("Failed to publish role. Please try again.");
      } finally {
          setIsPublishing(false);
      }
  };


  if (isLoading) {
    return (
      <div className="container mx-auto px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg font-medium opacity-60">Loading roles...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Industry Requirements</h1>
        <p className="text-sm opacity-60">
          {roles.length} active role requirements · Updated daily
        </p>
        <div className="mt-4">
          {user?.role?.toLowerCase().trim() === 'industry' && (
          <Button onClick={() => setSelectedRole({ 
              id: 'new', 
              title: 'New Role', 
              company: 'Company', 
              seniority: 'Junior', 
              industry: 'Tech', 
              requiredSkills: [], 
              preferredSkills: [], 
              experience: '0', 
              location: 'Remote', 
              description: '' 
           } as Role)} className="group">
             Post New Requirement
             <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
          <Input
            placeholder="Search roles or companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        <Select value={industryFilter} onValueChange={setIndustryFilter}>
          <SelectTrigger className="w-[200px] h-12">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            {industries.map(industry => (
              <SelectItem key={industry} value={industry}>
                {industry === 'all' ? 'All Industries' : industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <div
            key={role.id}
            onClick={() => setSelectedRole(role)}
            className="border border-black rounded-sm p-6 bg-white hover:shadow-[4px_4px_0_0_#000] transition-all cursor-pointer"
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-1">{role.title}</h3>
              <p className="text-sm opacity-60">{role.company}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="font-mono text-xs">
                {role.seniority}
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                {role.industry}
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                {role.location}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-60">Required Skills</span>
                <span className="font-mono font-bold">{role.requiredSkills.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-60">Experience</span>
                <span className="font-medium">{role.experience}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Role Details Sheet */}
      <Sheet open={!!selectedRole} onOpenChange={() => setSelectedRole(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedRole && (
            <>
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold pr-8">
                  {selectedRole.id === 'new' ? 'Post New Requirement' : selectedRole.title}
                </SheetTitle>
                <p className="text-base opacity-60">{selectedRole.id === 'new' ? 'Create a new job or internship posting' : selectedRole.company}</p>
              </SheetHeader>

              {selectedRole.id === 'new' ? (
                 <div className="mt-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Role Title</label>
                        <Input 
                            placeholder="e.g. Senior Frontend Developer" 
                            value={newRoleForm.title}
                            onChange={(e) => setNewRoleForm({...newRoleForm, title: e.target.value})}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Industry</label>
                             <Select value={newRoleForm.industry} onValueChange={(v) => setNewRoleForm({...newRoleForm, industry: v})}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="Technology">Technology</SelectItem>
                                  <SelectItem value="Finance">Finance</SelectItem>
                                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                  <SelectItem value="Education">Education</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Seniority</label>
                             <Select value={newRoleForm.seniority} onValueChange={(v) => setNewRoleForm({...newRoleForm, seniority: v})}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="Intern">Intern</SelectItem>
                                  <SelectItem value="Junior">Junior</SelectItem>
                                  <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                                  <SelectItem value="Senior">Senior</SelectItem>
                                  <SelectItem value="Lead">Lead</SelectItem>
                              </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                             <label className="text-sm font-medium">Experience</label>
                             <Select value={newRoleForm.experience} onValueChange={(v) => setNewRoleForm({...newRoleForm, experience: v})}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="0-1 years">0-1 years</SelectItem>
                                  <SelectItem value="1-3 years">1-3 years</SelectItem>
                                  <SelectItem value="3-5 years">3-5 years</SelectItem>
                                  <SelectItem value="5+ years">5+ years</SelectItem>
                              </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                             <label className="text-sm font-medium">Location</label>
                             <Input 
                                value={newRoleForm.location}
                                onChange={(e) => setNewRoleForm({...newRoleForm, location: e.target.value})}
                                placeholder="e.g. Remote, New York, NY"
                             />
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className="space-y-4 border-t border-b py-4">
                        <label className="text-sm font-medium">Required Skills</label>
                        <div className="flex gap-2">
                             <Select onValueChange={(v) => {
                                 if (v && !newRoleForm.requiredSkills?.includes(v)) {
                                     setNewRoleForm(prev => ({
                                         ...prev,
                                         requiredSkills: [...(prev.requiredSkills || []), v]
                                     }));
                                 }
                             }}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a skill" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[200px]">
                                <SelectItem value="React">React</SelectItem>
                                <SelectItem value="TypeScript">TypeScript</SelectItem>
                                <SelectItem value="Python">Python</SelectItem>
                                <SelectItem value="Node.js">Node.js</SelectItem>
                                <SelectItem value="Java">Java</SelectItem>
                                <SelectItem value="AWS">AWS</SelectItem>
                                <SelectItem value="SQL">SQL</SelectItem>
                                <SelectItem value="Docker">Docker</SelectItem>
                                <SelectItem value="Figma">Figma</SelectItem>
                                <SelectItem value="Product Management">Product Management</SelectItem>
                                {/* Add more common skills */}
                              </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {newRoleForm.requiredSkills?.map(s => (
                                <Badge key={s} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                                    {s}
                                    <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => removeSkill(s, 'required')}/>
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea 
                            className="min-h-[120px]" 
                            placeholder="Detailed role description..." 
                            value={newRoleForm.description}
                            onChange={(e) => setNewRoleForm({...newRoleForm, description: e.target.value})}
                        />
                    </div>

                    <Button className="w-full h-12" onClick={handlePublish} disabled={isPublishing}>
                        {isPublishing ? 'Publishing...' : 'Publish Requirement'}
                    </Button>
                 </div>
              ) : (
                <div className="mt-8 space-y-8">
                  <div>
                    <h4 className="text-sm font-semibold mb-3 opacity-60">OVERVIEW</h4>
                    {/* ... existing details ... */}
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="opacity-60">Seniority Level</span>
                        <span className="font-medium">{selectedRole.seniority}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="opacity-60">Industry</span>
                        <span className="font-medium">{selectedRole.industry}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="opacity-60">Experience</span>
                        <span className="font-medium">{selectedRole.experience}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="opacity-60">Location</span>
                        <span className="font-medium">{selectedRole.location}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2 opacity-60">REQUIRED SKILLS</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRole.requiredSkills.map((skill) => (
                        <Badge key={skill} variant="default" className="text-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2 opacity-60">PREFERRED SKILLS</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRole.preferredSkills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-2">
                     <h4 className="text-sm font-semibold mb-3 opacity-60">DESCRIPTION</h4>
                     <p className="text-sm leading-relaxed whitespace-pre-line">{selectedRole.description}</p>
                  </div>

                 <div className="pt-2 space-y-3">
                   {user?.role?.toLowerCase().trim() === 'industry' ? (
                     <>
                       <Button 
                         className="w-full h-12 text-base font-semibold group"
                         onClick={() => {
                           setSelectedRole(null);
                           navigate('/matches');
                         }}
                       >
                         Find Matching Candidates
                         <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                       </Button>
                       <Button 
                         variant="outline" 
                         className="w-full h-12 text-base font-semibold border-black"
                         onClick={() => {
                            // Logic to close/delete placement
                             toast.success("Placement closed for " + selectedRole.title);
                             setRoles(roles.filter(r => r.id !== selectedRole.id));
                             setSelectedRole(null);
                         }}
                       >
                         Close / Delete Placement
                       </Button>
                     </>
                   ) : (
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-sm font-medium opacity-60">ADD A MESSAGE (OPTIONAL)</label>
                           <Textarea 
                              placeholder="Tell the recruiter why you're a great fit..." 
                              value={applicationMessage}
                              onChange={(e) => setApplicationMessage(e.target.value)}
                              className="min-h-[100px]"
                           />
                        </div>
                         <Button 
                           className="w-full h-12 text-base font-semibold"
                           onClick={handleApply}
                           disabled={isApplying || userApplications.some(app => app.role_id === selectedRole.id)}
                         >
                           {isApplying 
                            ? 'Submitting...' 
                            : userApplications.some(app => app.role_id === selectedRole.id) 
                                ? 'Applied' 
                                : 'Apply for this Role'}
                         </Button>
                     </div>
                   )}
                 </div>
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
