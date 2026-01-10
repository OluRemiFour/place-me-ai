import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  estimatedTime: string;
}

interface RecommendedAction {
  title: string;
  description: string;
  duration: string;
  priority: 'high' | 'medium' | 'low';
}

export function SkillGapFeedback() {
  const studentName = 'Alexandra Rivera';
  const targetRole = 'Senior Frontend Engineer';

  const missingSkills = [
    'Next.js',
    'GraphQL',
    'Testing (Jest/RTL)',
    'Performance Optimization'
  ];

  const skillsToImprove: SkillGap[] = [
    {
      skill: 'System Design',
      currentLevel: 65,
      requiredLevel: 85,
      estimatedTime: '8-10 weeks'
    },
    {
      skill: 'Advanced TypeScript',
      currentLevel: 70,
      requiredLevel: 90,
      estimatedTime: '6-8 weeks'
    },
    {
      skill: 'State Management',
      currentLevel: 75,
      requiredLevel: 90,
      estimatedTime: '4-6 weeks'
    }
  ];

  const recommendedActions: RecommendedAction[] = [
    {
      title: 'Complete Advanced React Patterns Course',
      description: 'Master compound components, render props, and custom hooks to elevate component architecture skills.',
      duration: '6 weeks',
      priority: 'high'
    },
    {
      title: 'Build Production-Grade Project with Next.js',
      description: 'Create a full-stack application using Next.js 14, implementing SSR, ISR, and API routes.',
      duration: '8 weeks',
      priority: 'high'
    },
    {
      title: 'GraphQL Fundamentals & Implementation',
      description: 'Learn GraphQL queries, mutations, and implement Apollo Client in a React application.',
      duration: '4 weeks',
      priority: 'medium'
    },
    {
      title: 'Testing Best Practices Workshop',
      description: 'Master unit, integration, and E2E testing using Jest, React Testing Library, and Cypress.',
      duration: '3 weeks',
      priority: 'high'
    },
    {
      title: 'Web Performance Optimization',
      description: 'Learn Core Web Vitals, lazy loading, code splitting, and performance monitoring techniques.',
      duration: '4 weeks',
      priority: 'medium'
    },
    {
      title: 'System Design Study Group',
      description: 'Join weekly sessions covering scalability, architecture patterns, and trade-off analysis.',
      duration: '10 weeks',
      priority: 'low'
    }
  ];

  const totalEstimatedTime = '24-30 weeks';
  const overallReadiness = 78;

  return (
    <div className="container mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Skill Gap Analysis</h1>
        <p className="text-sm opacity-60">
          {studentName} → {targetRole}
        </p>
      </div>

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
        
        <Button className="w-full h-12 text-base font-semibold group">
          Generate Personalized Learning Path
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}
