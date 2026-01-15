import { useState, useEffect } from 'react';
import { Check, ChevronDown, ExternalLink, ShieldCheck, Link as LinkIcon, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api, SkillDetail } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function StudentProfile() {
  const { user, refreshUser, isVerified } = useAuth();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Technical']);
  
  // State for verification dialog
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [proofType, setProofType] = useState<'link' | 'serial'>('link');
  const [proofValue, setProofValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    refreshUser();
  }, []);

  if (!user) return null;

  // Group skills by category
  const groupedSkills = (user.skills || []).reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, SkillDetail[]>);

  // If no skills yet, show defaults or empty state
  const hasSkills = user.skills && user.skills.length > 0;

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleVerifyClick = (skillName: string) => {
    setSelectedSkill(skillName);
    setVerifyDialogOpen(true);
    setProofValue('');
    setProofType('link');
  };

  const handleVerifySubmit = async () => {
    if (!selectedSkill || !proofValue) return;
    setIsSubmitting(true);
    try {
        await api.verifySkill(selectedSkill, proofValue); // Note: Backend should handle type differentiation or we update API signature
        toast.success("Verification request submitted!");
        setVerifyDialogOpen(false);
        setProofValue('');
        refreshUser();
    } catch (error) {
        console.error("Verification failed", error);
        toast.error("Failed to submit verification.");
    } finally {
        setIsSubmitting(false);
    }
  };

  // Calculate derived stats
  const certifiedCount = user.skills?.filter(s => s.verified).length || 0;
  const totalSkills = user.skills?.length || 0;

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-sm opacity-60">
          Manage your skills, experience, and certifications.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="border border-black rounded-lg p-8 mb-8 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold">{user.name}</h2>
                {user.role?.toLowerCase().trim() === 'student' && <Badge variant="secondary">Student</Badge>}
            </div>
            <p className="text-base opacity-60 mb-1">{user.email}</p>
            <p className="text-sm opacity-60">{user.university} · {user.major}</p>
          </div>
          <div className="text-left md:text-right">
             {/* We could show profile strength or match readiness if available */}
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                <ShieldCheck className="w-4 h-4" />
                Profile Status: {isVerified ? 'Verified' : 'Active'}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pt-6 border-t border-gray-100">
          <div>
            <div className="text-3xl font-bold mb-1">{certifiedCount}</div>
            <p className="text-sm opacity-60">Certified Skills</p>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">{totalSkills}</div>
            <p className="text-sm opacity-60">Total Skills</p>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">{user.gpa || 'N/A'}</div>
            <p className="text-sm opacity-60">GPA</p>
          </div>
           <div>
            <div className="text-3xl font-bold mb-1">{user.graduationYear || 'N/A'}</div>
            <p className="text-sm opacity-60">Class Year</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/roles" className="flex-1">
            <Button className="w-full h-11 text-base font-semibold shadow-md active:scale-[0.99] transition-all">
              Find Matching Roles
            </Button>
          </Link>
          <Link to="/skill-gap" className="flex-1">
            <Button variant="outline" className="w-full h-11 text-base font-semibold border-black hover:bg-gray-50">
              Skill Gap Analysis
            </Button>
          </Link>
        </div>
      </div>

      {/* Skills Breakdown */}
      <div className="space-y-4 mb-8">
        <h3 className="text-xl font-bold mb-4">Skills & Certification</h3>
        
        {!hasSkills && (
            <div className="p-8 border border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
                <p className="text-gray-500 mb-4">No skills added yet.</p>
                <Link to="/profile-builder">
                    <Button variant="outline">Update Skills in Profile Builder</Button>
                </Link>
            </div>
        )}

        {Object.entries(groupedSkills).map(([category, skills]) => {
          const isExpanded = expandedCategories.includes(category);
          
          return (
            <div key={category} className="border border-gray-200 rounded-lg bg-white overflow-hidden transition-all hover:border-black/50">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{category}</h3>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {skills.length}
                  </Badge>
                </div>
                <ChevronDown 
                  className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100 p-5 space-y-4 bg-gray-50/30">
                  {skills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900">{skill.name}</span>
                          {skill.verified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black text-white text-xs font-medium">
                              <Check className="h-3 w-3" />
                              Certified
                            </span>
                          ) : (
                             <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 font-medium"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleVerifyClick(skill.name);
                                }}
                             >
                                Get Certified
                             </Button>
                          )}
                        </div>
                        <span className="font-mono font-bold text-sm">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Verification Dialog */}
      <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Verify Skill: {selectedSkill}</DialogTitle>
                <DialogDescription>
                    Provide proof of your proficiency to get verified.
                </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="link" value={proofType} onValueChange={(v) => setProofType(v as 'link' | 'serial')}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="link">
                        <LinkIcon className="h-4 w-4 mr-2"/>
                        Link
                    </TabsTrigger>
                    <TabsTrigger value="serial">
                        <Hash className="h-4 w-4 mr-2"/>
                        Serial Number
                    </TabsTrigger>
                </TabsList>
                
                <div className="py-4">
                    <Label htmlFor="proof" className="mb-2 block">
                        {proofType === 'link' ? 'Certification / Portfolio URL' : 'Certificate Serial Number'}
                    </Label>
                    <Input
                        id="proof"
                        placeholder={proofType === 'link' ? 'https://...' : 'e.g. A1B2-C3D4'}
                        value={proofValue}
                        onChange={(e) => setProofValue(e.target.value)}
                    />
                </div>
            </Tabs>

            <DialogFooter>
                <Button variant="outline" onClick={() => setVerifyDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleVerifySubmit} disabled={!proofValue || isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Verification'}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
