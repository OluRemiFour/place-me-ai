import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Award, Target, BookOpen, TrendingUp, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth, SkillDetail } from '@/contexts/AuthContext';
import { api, Match } from '@/services/api';

export function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Technical Skills']);
  const [isLoading, setIsLoading] = useState(true);

  const studentProfile = {
    name: user?.name || 'Student',
    email: user?.email || '',
    matchScore: 0,
    verified: user?.skills?.filter(s => s.verified).length || 0,
    totalSkills: user?.skills?.length || 0,
    university: user?.university || 'Not set',
    major: user?.major || 'Not set',
    gpa: user?.gpa || 0,
    graduationYear: user?.graduationYear || 0
  };

  // Group skills by category if they exist
  const skillCategories: { category: string; skills: SkillDetail[] }[] = user?.skills ? 
    Array.from(new Set(user.skills.map(s => s.category || 'General'))).map((cat: string) => ({
      category: cat,
      skills: user.skills?.filter(s => (s.category || 'General') === cat) || []
    })) : [];

  useEffect(() => {
    const loadMatches = async () => {
      try {
        if (user?.id) {
          const data = await api.getMatchesForStudent(user.id);
          setMatches(data.slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to load matches:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMatches();
  }, []);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="container mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {studentProfile.name.split(' ')[0]}</h1>
        <p className="text-sm opacity-60">
          Your career dashboard · Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Profile Overview */}
      <div className="border border-black rounded-sm p-8 mb-8 bg-white">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-1">{studentProfile.name}</h2>
            <p className="text-base opacity-60 mb-4">{studentProfile.email}</p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="font-mono">{studentProfile.university}</Badge>
              <Badge variant="outline" className="font-mono">{studentProfile.major}</Badge>
              <Badge variant="outline" className="font-mono">GPA: {studentProfile.gpa}</Badge>
              <Badge variant="outline" className="font-mono">Class of {studentProfile.graduationYear}</Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-6xl font-bold leading-none">
              {studentProfile.matchScore}%
            </div>
            <p className="text-sm opacity-60 mt-2">Overall Match Readiness</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="border-l-2 border-black pl-6">
            <div className="text-3xl font-bold mb-1">{studentProfile.verified}</div>
            <p className="text-sm opacity-60">Verified Skills</p>
          </div>
          <div className="border-l-2 border-black pl-6">
            <div className="text-3xl font-bold mb-1">{studentProfile.totalSkills}</div>
            <p className="text-sm opacity-60">Total Skills</p>
          </div>
          <div className="border-l-2 border-black pl-6">
            <div className="text-3xl font-bold mb-1">{matches.length}</div>
            <p className="text-sm opacity-60">Role Matches</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/roles" className="flex-1">
            <Button className="w-full h-12 text-base font-semibold group">
              <Target className="mr-2 h-5 w-5" />
              Find Matching Roles
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link to="/skill-gap" className="flex-1">
            <Button variant="outline" className="w-full h-12 text-base font-semibold border-black">
              <BookOpen className="mr-2 h-5 w-5" />
              Skill Gap Analysis
            </Button>
          </Link>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Skills Breakdown */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-4">Skills Profile</h3>
          {skillCategories.map((category) => {
            const isExpanded = expandedCategories.includes(category.category);

            return (
              <div key={category.category} className="border border-black rounded-sm bg-white">
                <button
                  onClick={() => toggleCategory(category.category)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold">{category.category}</h4>
                    <Badge variant="outline" className="font-mono text-xs">
                      {category.skills.length}
                    </Badge>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {isExpanded && (
                  <div className="border-t border-black p-4 space-y-3">
                    {category.skills.map((skill) => (
                      <div key={skill.name} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{skill.name}</span>
                            {skill.verified && (
                              <span className="w-4 h-4 bg-black text-white rounded-full flex items-center justify-center">
                                <Check className="h-2.5 w-2.5" />
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-sm font-bold">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Matching Roles */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Top Role Matches</h3>
            <Link to="/roles">
              <Button variant="outline" size="sm" className="border-black">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-8 opacity-60">Loading matches...</div>
            ) : (
              matches.map((match) => (
                <div
                  key={match.id}
                  onClick={() => navigate(`/roles`)}
                  className="border border-black rounded-sm p-4 bg-white hover:shadow-[4px_4px_0_0_#000] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{match.studentName}</h4>
                      <p className="text-sm opacity-60">{match.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-2xl font-bold">{match.matchPercentage}%</div>
                      <div className="text-xs opacity-60">MATCH</div>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-3">
                    {match.topSkills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => navigate('/profile-builder')}
          className="border border-black rounded-sm p-6 bg-white hover:shadow-[4px_4px_0_0_#000] transition-all cursor-pointer"
        >
          <Award className="h-6 w-6 mb-3" />
          <h4 className="text-lg font-bold mb-2">Complete Profile</h4>
          <p className="text-sm opacity-60 mb-4">
            Add more skills and credentials to improve your match score
          </p>
          <div className="flex items-center gap-2 font-medium">
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        <div
          onClick={() => navigate('/skill-gap')}
          className="border border-black rounded-sm p-6 bg-white hover:shadow-[4px_4px_0_0_#000] transition-all cursor-pointer"
        >
          <TrendingUp className="h-6 w-6 mb-3" />
          <h4 className="text-lg font-bold mb-2">Improve Skills</h4>
          <p className="text-sm opacity-60 mb-4">
            Get AI recommendations on skills to develop
          </p>
          <div className="flex items-center gap-2 font-medium">
            <span>Analyze</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        <div
          onClick={() => navigate('/internships')}
          className="border border-black rounded-sm p-6 bg-white hover:shadow-[4px_4px_0_0_#000] transition-all cursor-pointer"
        >
          <Target className="h-6 w-6 mb-3" />
          <h4 className="text-lg font-bold mb-2">Browse Opportunities</h4>
          <p className="text-sm opacity-60 mb-4">
            Explore internships and scholarships
          </p>
          <div className="flex items-center gap-2 font-medium">
            <span>Explore</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
