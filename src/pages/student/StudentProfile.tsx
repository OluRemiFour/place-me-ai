import { Check, ChevronDown, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { api } from '@/services/api';

interface Skill {
  name: string;
  level: number;
  verified: boolean;
}

interface SkillCategory {
  category: string;
  skills: Skill[];
}

export function StudentProfile() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Technical Skills']);

  const student = {
    name: 'Alexandra Rivera',
    email: 'alexandra.rivera@university.edu',
    matchScore: 87,
    verified: 12,
    totalSkills: 24
  };

  const skillCategories: SkillCategory[] = [
    {
      category: 'Technical Skills',
      skills: [
        { name: 'React', level: 92, verified: true },
        { name: 'TypeScript', level: 88, verified: true },
        { name: 'Node.js', level: 85, verified: true },
        { name: 'Python', level: 78, verified: false },
        { name: 'SQL', level: 82, verified: true }
      ]
    },
    {
      category: 'Soft Skills',
      skills: [
        { name: 'Communication', level: 90, verified: true },
        { name: 'Team Leadership', level: 85, verified: true },
        { name: 'Problem Solving', level: 88, verified: false },
        { name: 'Time Management', level: 83, verified: true }
      ]
    },
    {
      category: 'Domain Knowledge',
      skills: [
        { name: 'E-commerce', level: 80, verified: false },
        { name: 'FinTech', level: 75, verified: false },
        { name: 'Healthcare Systems', level: 70, verified: false },
        { name: 'Data Analytics', level: 85, verified: true }
      ]
    }
  ];

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // State for verification dialog
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [proofLink, setProofLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerifyClick = (skillName: string) => {
    setSelectedSkill(skillName);
    setVerifyDialogOpen(true);
  };

  const handleVerifySubmit = async () => {
    if (!selectedSkill) return;
    setIsSubmitting(true);
    try {
        await api.verifySkill(selectedSkill, proofLink);
        setVerifyDialogOpen(false);
        setProofLink('');
        // In real app, trigger a toast success
    } catch (error) {
        console.error("Verification failed", error);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Student Profile</h1>
        <p className="text-sm opacity-60">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Profile Overview */}
      <div className="border border-black rounded-sm p-12 mb-8 bg-white">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">{student.name}</h2>
            <p className="text-base opacity-60">{student.email}</p>
          </div>
          <div className="text-right">
            <div className="font-mono text-7xl font-bold leading-none">
              {student.matchScore}%
            </div>
            <p className="text-sm opacity-60 mt-2">Overall Match Readiness</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 mb-8">
          <div className="border-l-2 border-black pl-6">
            <div className="text-4xl font-bold mb-1">{student.verified}</div>
            <p className="text-sm opacity-60">Verified Skills</p>
          </div>
          <div className="border-l-2 border-black pl-6">
            <div className="text-4xl font-bold mb-1">{student.totalSkills}</div>
            <p className="text-sm opacity-60">Total Skills</p>
          </div>
          <div className="border-l-2 border-black pl-6">
            <div className="text-4xl font-bold mb-1">4.8</div>
            <p className="text-sm opacity-60">Performance Rating</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/roles" className="flex-1">
            <Button className="w-full h-12 text-base font-semibold">
              Find Matching Roles
            </Button>
          </Link>
          <Link to="/skill-gap" className="flex-1">
            <Button variant="outline" className="w-full h-12 text-base font-semibold border-black">
              Skill Gap Analysis
            </Button>
          </Link>
        </div>
      </div>

      {/* Skills Breakdown */}
      <div className="space-y-4">
        {skillCategories.map((category) => {
          const isExpanded = expandedCategories.includes(category.category);
          
          return (
            <div key={category.category} className="border border-black rounded-sm bg-white">
              <button
                onClick={() => toggleCategory(category.category)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-semibold">{category.category}</h3>
                  <Badge variant="outline" className="font-mono">
                    {category.skills.length}
                  </Badge>
                </div>
                <ChevronDown 
                  className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {isExpanded && (
                <div className="border-t border-black p-6 space-y-4">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{skill.name}</span>
                          {skill.verified ? (
                            <span className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3" />
                            </span>
                          ) : (
                             <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 text-xs text-blue-600 hover:text-blue-800 px-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleVerifyClick(skill.name);
                                }}
                             >
                                Verify
                             </Button>
                          )}
                        </div>
                        <span className="font-mono font-bold">{skill.level}%</span>
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

      {/* Credentials Section */}
      <div className="mt-8 border border-black rounded-sm p-8 bg-white">
        <h3 className="text-xl font-semibold mb-6">Verified Credentials</h3>
        <div className="space-y-3">
          {[
            { title: 'Full Stack Development Certification', issuer: 'Tech Academy', date: '2024' },
            { title: 'Advanced JavaScript', issuer: 'CodeMasters', date: '2023' },
            { title: 'Cloud Architecture', issuer: 'Cloud Institute', date: '2024' }
          ].map((credential, idx) => (
            <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
              <div>
                <p className="font-medium">{credential.title}</p>
                <p className="text-sm opacity-60">{credential.issuer} · {credential.date}</p>
              </div>
              <button className="opacity-60 hover:opacity-100 transition-opacity">
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Verification Dialog */}
      {verifyDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-xl font-bold mb-4">Verify Skill: {selectedSkill}</h3>
                <p className="text-sm text-gray-500 mb-4">
                    Please provide a link to a certification, test result, or portfolio item that demonstrates your proficiency in this skill.
                </p>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Proof URL</label>
                        <input 
                            type="url" 
                            className="w-full border p-2 rounded-md"
                            placeholder="https://coursera.org/verify/..."
                            value={proofLink}
                            onChange={(e) => setProofLink(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setVerifyDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleVerifySubmit} disabled={!proofLink || isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
