import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ArrowRight, 
  Clock, 
  ExternalLink, 
  Code, 
  Brain, 
  Layers, 
  Rocket, 
  Award, 
  ChevronRight,
  BookOpen,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { api, SkillGap, Role, calculateRoleReadiness } from '@/services/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

// Icon mapping helper
const IconMap: Record<string, any> = {
  Code,
  Brain,
  Layers,
  Rocket,
  Award,
  BookOpen,
  CheckCircle2,
};

const MilestoneIcon = ({ name }: { name: string }) => {
  const Icon = IconMap[name] || HelpCircle;
  return <Icon className="w-5 h-5" />;
};

const renderTextWithBold = (text: string) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-black">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

interface RecommendedAction {
  title: string;
  description: string;
  duration: string;
  priority: 'high' | 'medium' | 'low';
}

export function SkillGapFeedback() {
  const { user, isProfileComplete } = useAuth();
  const { id } = useParams<{ id: string }>(); 
  const studentId = id || '1'; 
  
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('1');
  const [analysis, setAnalysis] = useState<{
    missingSkills: string[];
    skillsToImprove: SkillGap[];
    overallReadiness: number;
    recommendedActions: RecommendedAction[];
  } | null>(null);
  const [learningPath, setLearningPath] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const studentName = user?.role === 'student' ? user.name : 'Candidate'; 

  useEffect(() => {
    const loadRoles = async () => {
      const rolesData = await api.getRoles();
      setRoles(rolesData);
    };
    loadRoles();
  }, []);

  useEffect(() => {
    const loadAnalysis = async () => {
      setIsLoading(true);
      try {
        if (user && selectedRole) {
            // Use real AI analysis
            const currentSkills = user.skills || [];
            const currentSkillNames = currentSkills.map(s => s.name);
            const result = await api.analyzeSkillGap(
                currentSkillNames, 
                targetRole, 
                user.major || 'Computer Science'
            );
            
            // Use the new role-specific readiness calculation
            const roleReadiness = calculateRoleReadiness(
                currentSkills,
                selectedRole.requiredSkills,
                selectedRole.preferredSkills,
                isProfileComplete
            );
            
            setAnalysis({
                missingSkills: result.missing_skills,
                skillsToImprove: [], 
                overallReadiness: roleReadiness,
                recommendedActions: result.action_plan.map((plan, idx) => ({
                    title: `Action ${idx+1}`,
                    description: plan,
                    duration: '2 weeks',
                    priority: 'high'
                }))
            });
        }
      } catch (error) {
        console.error('Failed to load analysis:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (selectedRoleId) {
        loadAnalysis();
    }
  }, [selectedRoleId, user]);

  const selectedRole = roles.find(r => r.id === selectedRoleId);
  const targetRole = selectedRole?.title || 'Senior Frontend Engineer';

  const missingSkills = analysis?.missingSkills || [];
  const skillsToImprove = analysis?.skillsToImprove || [];
  const overallReadiness = analysis?.overallReadiness || 0;
  const recommendedActions = analysis?.recommendedActions || [];

  const totalEstimatedTime = `${Math.ceil(skillsToImprove.length * 6)}-${Math.ceil(skillsToImprove.length * 8)} weeks`;

  return (
    <div className="container mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Skill Gap Analysis</h1>
        <p className="text-sm opacity-60">
          {studentName} → {targetRole}
        </p>
      </div>

      {/* Role Selection */}
      <div className="flex items-center gap-4 mb-8 p-4 border border-black rounded-sm bg-white">
        <div className="text-sm">
          <span className="opacity-60">Analyze for Role:</span>
        </div>
        <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
          <SelectTrigger className="w-[300px] h-10">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map(role => (
              <SelectItem key={role.id} value={role.id}>
                {role.title} - {role.company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-lg font-medium opacity-60">Analyzing skill gaps...</div>
        </div>
      ) : (
      <>
      {/* Overall Status */}
      <div className="border border-black rounded-sm p-8 bg-white mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Current Readiness Level</h2>
            <p className="text-base opacity-60">Based on role requirements analysis</p>
          </div>
          <div className="text-right">
            <div className="font-mono text-6xl font-bold leading-none mb-2">
              {overallReadiness}%
            </div>
          </div>
        </div>
        <Progress value={overallReadiness} className="h-3 mb-4" />
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 opacity-60" />
          <span className="opacity-60">Estimated time to full readiness:</span>
          <span className="font-mono font-bold">{totalEstimatedTime}</span>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Missing Skills */}
        <div className="border border-black rounded-sm p-8 bg-white">
          <h3 className="text-xl font-bold mb-6">Missing Skills</h3>
          <div className="space-y-3">
            {missingSkills.map((skill) => (
              <div key={skill} className="flex items-start gap-3 py-2">
                <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                <span className="text-base font-medium">{skill}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm opacity-60">
              {missingSkills.length} critical skills need to be acquired
            </p>
          </div>
        </div>

        {/* Skills to Improve */}
        <div className="border border-black rounded-sm p-8 bg-white">
          <h3 className="text-xl font-bold mb-6">Skills to Improve</h3>
          <div className="space-y-6">
            {skillsToImprove.map((item) => (
              <div key={item.skill} className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-medium">{item.skill}</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {item.estimatedTime}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs opacity-60">
                    <span>Current: {item.currentLevel}%</span>
                    <span>Target: {item.requiredLevel}%</span>
                  </div>
                  <Progress value={item.currentLevel} className="h-2" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm opacity-60">
              {skillsToImprove.length} skills require advancement
            </p>
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="border border-black rounded-sm p-8 bg-white">
          <h3 className="text-xl font-bold mb-6">Recommended Actions</h3>
          <div className="space-y-4">
            {recommendedActions.slice(0, 4).map((action) => (
              <div key={action.title} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-semibold">{action.title}</h4>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      action.priority === 'high' ? 'border-black' : 'opacity-60'
                    }`}
                  >
                    {action.priority}
                  </Badge>
                </div>
                <p className="text-xs opacity-60 mb-2">{action.description}</p>
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="h-3 w-3 opacity-60" />
                  <span className="font-mono">{action.duration}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm opacity-60 mb-2">
              +{recommendedActions.length - 4} more actions available
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Action Plan */}
      <div className="mt-8 border border-black rounded-sm p-8 bg-white">
        <h3 className="text-2xl font-bold mb-6">Complete Learning Path</h3>
        <div className="space-y-4 mb-6">
          {recommendedActions.map((action, idx) => (
            <div 
              key={action.title}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-sm hover:border-black transition-colors"
            >
              <div className="font-mono text-lg font-bold opacity-40 w-8">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-semibold">{action.title}</h4>
                  <Badge 
                    variant={action.priority === 'high' ? 'default' : 'outline'}
                    className="text-xs"
                  >
                    {action.priority}
                  </Badge>
                </div>
                <p className="text-sm opacity-60">{action.description}</p>
              </div>
              <div className="flex items-center gap-2 text-sm font-mono">
                <Clock className="h-4 w-4 opacity-60" />
                {action.duration}
              </div>
            </div>
          ))}
        </div>
        
        <Button 
          className="w-full h-12 text-base font-semibold group"
          onClick={async () => {
            setIsGenerating(true);
            try {
              const currentSkills = user?.skills?.map(s => s.name) || [];
              const result = await api.getPersonalizedLearningPath(currentSkills, targetRole);
              setLearningPath(result);
            } catch (e) {
              console.error(e);
            } finally {
              setIsGenerating(false);
            }
          }}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating with AI...' : 'Generate Personalized Learning Path'}
          {!isGenerating && <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />}
        </Button>
        
        {learningPath && (
          <div className="mt-8 p-8 bg-white border border-black rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-8 border-b border-gray-100 pb-6">
              <h4 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <Rocket className="w-8 h-8" />
                AI Recommended Path
              </h4>
              <p className="text-lg leading-relaxed text-gray-700 italic">
                {renderTextWithBold(learningPath.roadmap)}
              </p>
            </div>

            <div className="space-y-8">
              {learningPath.milestones?.map((milestone: any, i: number) => (
                <div key={i} className="relative pl-12">
                  {/* Timeline line */}
                  {i < learningPath.milestones.length - 1 && (
                    <div className="absolute left-[19px] top-10 bottom-[-32px] w-0.5 bg-gray-200"></div>
                  )}
                  
                  {/* Milestone Icon */}
                  <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center z-10 shadow-lg">
                    <MilestoneIcon name={milestone.icon} />
                  </div>

                  <div className="border border-gray-200 rounded-sm p-6 bg-white hover:border-black transition-all group">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold opacity-40 uppercase tracking-widest">Phase {i+1}</span>
                          <ChevronRight className="w-3 h-3 opacity-20" />
                          <Badge variant="outline" className="text-[10px] font-mono border-gray-200">
                            {milestone.estimated_time}
                          </Badge>
                        </div>
                        <h5 className="text-xl font-bold group-hover:translate-x-1 transition-transform">{milestone.title}</h5>
                      </div>
                    </div>

                    <p className="text-base text-gray-600 mb-6 leading-relaxed">
                      {renderTextWithBold(milestone.description)}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h6 className="text-xs font-bold uppercase tracking-wider opacity-40 flex items-center gap-2">
                          <BookOpen className="w-3 h-3" />
                          Recommended Resources
                        </h6>
                        <ul className="space-y-2">
                          {milestone.resources?.map((resource: string, j: number) => (
                            <li key={j} className="flex items-center gap-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                              {resource}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-black text-white rounded-sm flex items-center justify-between">
              <div>
                <h6 className="font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  Ready to start your journey?
                </h6>
                <p className="text-sm opacity-70">Follow this roadmap to achieve your career goals.</p>
              </div>
              <Button 
                variant="outline" 
                className="bg-white text-black hover:bg-gray-100 border-none"
                onClick={() => {
                  if (!learningPath) return;
                  
                  const content = `SKILLSYNC PERSONALIZED LEARNING PATH\n` +
                    `====================================\n\n` +
                    `Goal: ${targetRole}\n` +
                    `Date: ${new Date().toLocaleDateString()}\n\n` +
                    `ROADMAP OVERVIEW\n` +
                    `----------------\n` +
                    `${learningPath.roadmap}\n\n` +
                    `STRATEGIC MILESTONES\n` +
                    `--------------------\n` +
                    (learningPath.milestones || []).map((m: any, i: number) => (
                      `PHASE ${i + 1}: ${m.title}\n` +
                      `Estimated Time: ${m.estimated_time}\n` +
                      `Focus: ${m.description.replace(/\*\*/g, '')}\n` +
                      `Resources:\n` +
                      (m.resources || []).map((r: string) => `  - ${r}`).join('\n') +
                      `\n`
                    )).join('\n');

                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `SkillSync_Roadmap_${targetRole.replace(/\s+/g, '_')}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
              >
                Download Roadmap
              </Button>
            </div>
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
}
