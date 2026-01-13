import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Briefcase, Target, TrendingUp, BarChart3, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { api, Student, Role } from '@/services/api';

export function IndustryDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    activeRoles: 0,
    matchesThisWeek: 0,
    avgMatchScore: 0,
    topSkills: [] as { skill: string; demand: number }[],
    matchTrend: [] as { date: string; matches: number }[],
    skillDistribution: [] as { category: string; count: number }[]
  });

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
    student.topSkills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleStudentClick = (studentId: string) => {
    navigate(`/students/${studentId}`);
  };

  // Simple Bar Chart Component
  const SimpleBarChart = ({ data }: { data: { label: string; value: number }[] }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    return (
      <div className="space-y-3">
        {data.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{item.label}</span>
              <span className="font-mono font-bold">{item.value}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-sm overflow-hidden">
              <div 
                className="h-full bg-black transition-all duration-500"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg font-medium opacity-60">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Industry Dashboard</h1>
        <p className="text-sm opacity-60">
          Welcome back, {user?.name || 'Recruiter'} · Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Weekly Match Trend */}
        <div className="border border-black rounded-sm p-8 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Weekly Match Trend</h2>
            <BarChart3 className="h-5 w-5 opacity-40" />
          </div>
          <SimpleBarChart 
            data={metrics.matchTrend.map(d => ({ label: d.date, value: d.matches }))}
          />
        </div>

        {/* Skills Distribution */}
        <div className="border border-black rounded-sm p-8 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Skill Category Distribution</h2>
            <BarChart3 className="h-5 w-5 opacity-40" />
          </div>
          <SimpleBarChart 
            data={metrics.skillDistribution.map(d => ({ label: d.category, value: d.count }))}
          />
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Top Skills in Demand */}
        <div className="border border-black rounded-sm p-8 bg-white">
          <h2 className="text-xl font-bold mb-6">In-Demand Skills</h2>
          <div className="space-y-4">
            {metrics.topSkills.map((item, idx) => (
              <div key={item.skill} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm opacity-40">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="font-semibold">{item.skill}</span>
                  </div>
                  <span className="font-mono text-sm font-bold">{item.demand}%</span>
                </div>
                <Progress value={item.demand} className="h-1.5" />
              </div>
            ))}
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
            View complete profiles with verified skills and experience
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
