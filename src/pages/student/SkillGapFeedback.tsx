import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowRight, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { api, SkillGap, Role } from '@/services/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

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
        if (user) {
            // Use real AI analysis
            const currentSkills = user.skills?.map(s => s.name) || [];
            const result = await api.analyzeSkillGap(
                currentSkills, 
                targetRole, 
                user.major || 'Computer Science'
            );
            
            const profileBonus = isProfileComplete ? 20 : 5;
            const matchedCount = currentSkills.length;
            const missingCount = result.missing_skills.length;
            const actionsCount = result.action_plan.length;
            
            // Calculate readiness: 20% profile, 80% skills/actions balance
            const skillMatchScore = matchedCount + missingCount > 0 
                ? (matchedCount / (matchedCount + missingCount)) * 60 + (Math.max(0, 5 - actionsCount) / 5) * 20
                : 10;
            
            setAnalysis({
                missingSkills: result.missing_skills,
                skillsToImprove: [], 
                overallReadiness: Math.min(100, Math.round(profileBonus + skillMatchScore)) || 30,
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
              const result = await api.getPersonalizedLearningPath(studentName.split(' '), targetRole);
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
          <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-sm">
            <h4 className="text-xl font-bold mb-4">AI Recommended Path</h4>
            <div className="prose max-w-none">
                {(() => {
                  try {
                    const steps = typeof learningPath.raw_response === 'string' 
                      ? JSON.parse(learningPath.raw_response) 
                      : learningPath.raw_response;
                    if (!Array.isArray(steps)) throw new Error("Invalid format");
                    
                    return (
                      <div className="space-y-4">
                        {steps.map((step: any, i: number) => (
                           <div key={i} className="flex gap-4 p-4 border rounded-md bg-white hover:border-black transition-colors">
                              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-black text-white font-bold">
                                {i + 1}
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-start">
                                    <h5 className="font-semibold text-lg">{step.title}</h5>
                                    <Badge variant={step.priority === 'High' ? 'destructive' : 'secondary'}>{step.priority}</Badge>
                                </div>
                                <p className="text-sm opacity-80">{step.description}</p>
                                <div className="flex items-center gap-4 text-xs opacity-60 mt-2">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {step.estimated_weeks} weeks</span>
                                    {step.resource_link && (
                                        <a href={step.resource_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                                           <ExternalLink className="w-3 h-3"/> Resource
                                        </a>
                                    )}
                                </div>
                              </div>
                           </div>
                        ))}
                      </div>
                    )
                  } catch (e) {
                    return <pre className="whitespace-pre-wrap font-sans text-sm">{typeof learningPath.raw_response === 'string' ? learningPath.raw_response : JSON.stringify(learningPath, null, 2)}</pre>
                  }
                })()}
            </div>
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
}
