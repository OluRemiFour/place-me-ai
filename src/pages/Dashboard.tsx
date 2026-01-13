import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Users, Briefcase, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export function Dashboard() {
  const metrics = [
    {
      label: 'Total Students',
      value: '1,247',
      change: '+12%',
      trend: 'up' as const
    },
    {
      label: 'Active Roles',
      value: '89',
      change: '+5%',
      trend: 'up' as const
    },
    {
      label: 'Matches This Week',
      value: '342',
      change: '+18%',
      trend: 'up' as const
    },
    {
      label: 'Avg. Match Score',
      value: '84%',
      change: '+3%',
      trend: 'up' as const
    }
  ];

  const recentMatches = [
    { student: 'Alexandra Rivera', role: 'Senior Frontend Engineer', score: 92, company: 'TechFlow' },
    { student: 'Marcus Chen', role: 'Full Stack Developer', score: 88, company: 'DataShift' },
    { student: 'Samantha Park', role: 'DevOps Engineer', score: 91, company: 'CloudTech' },
    { student: 'David Okonkwo', role: 'Backend Engineer', score: 85, company: 'Nexus' },
    { student: 'Emily Thompson', role: 'Mobile Developer', score: 82, company: 'Vertex' }
  ];

  const topSkills = [
    { skill: 'React', demand: 95 },
    { skill: 'TypeScript', demand: 88 },
    { skill: 'Python', demand: 85 },
    { skill: 'Node.js', demand: 82 },
    { skill: 'AWS', demand: 78 }
  ];

  return (
    <div className="container mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-sm opacity-60">
          Last updated: {new Date().toLocaleString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => (
          <div key={metric.label} className="border border-black rounded-sm p-8 bg-white">
            <div className="text-sm opacity-60 mb-3">{metric.label}</div>
            <div className="flex items-end justify-between">
              <div className="font-mono text-4xl font-bold leading-none">
                {metric.value}
              </div>
              <div className="flex items-center gap-1 text-sm font-mono">
                <TrendingUp className="h-4 w-4" />
                {metric.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Recent Matches */}
        <div className="lg:col-span-2 border border-black rounded-sm p-8 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Matches</h2>
            <Link to="/matches">
              <Button variant="outline" size="sm" className="border-black group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-1">
            {recentMatches.map((match, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-semibold mb-1">{match.student}</div>
                  <div className="text-sm opacity-60">
                    {match.role} · {match.company}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-2xl font-bold">{match.score}%</div>
                  <div className="text-xs opacity-60">MATCH</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Skills in Demand */}
        <div className="border border-black rounded-sm p-8 bg-white">
          <h2 className="text-2xl font-bold mb-6">In-Demand Skills</h2>
          <div className="space-y-5">
            {topSkills.map((item) => (
              <div key={item.skill} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{item.skill}</span>
                  <span className="font-mono text-sm font-bold">{item.demand}%</span>
                </div>
                <Progress value={item.demand} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/students" className="group">
          <div className="border border-black rounded-sm p-8 bg-white hover:shadow-[4px_4px_0_0_#000] transition-all">
            <Users className="h-8 w-8 mb-4" />
            <h3 className="text-xl font-bold mb-2">Browse Students</h3>
            <p className="text-sm opacity-60 mb-4">
              View and analyze student profiles with verified skills
            </p>
            <div className="flex items-center gap-2 font-medium group-hover:gap-3 transition-all">
              <span>Explore</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>

        <Link to="/roles" className="group">
          <div className="border border-black rounded-sm p-8 bg-white hover:shadow-[4px_4px_0_0_#000] transition-all">
            <Briefcase className="h-8 w-8 mb-4" />
            <h3 className="text-xl font-bold mb-2">Manage Roles</h3>
            <p className="text-sm opacity-60 mb-4">
              Add and configure industry role requirements
            </p>
            <div className="flex items-center gap-2 font-medium group-hover:gap-3 transition-all">
              <span>Configure</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>

        <Link to="/matches" className="group">
          <div className="border border-black rounded-sm p-8 bg-white hover:shadow-[4px_4px_0_0_#000] transition-all">
            <Target className="h-8 w-8 mb-4" />
            <h3 className="text-xl font-bold mb-2">Run AI Match</h3>
            <p className="text-sm opacity-60 mb-4">
              Generate talent matches for any role requirement
            </p>
            <div className="flex items-center gap-2 font-medium group-hover:gap-3 transition-all">
              <span>Analyze</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
