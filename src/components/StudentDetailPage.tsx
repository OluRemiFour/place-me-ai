import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, ChevronDown, ExternalLink, ArrowLeft, Mail, MapPin, Calendar, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { api, Student, Match } from '@/services/api';

export function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Technical']);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStudent = async () => {
      if (!id) return;
      try {
        const [studentData, matchesData] = await Promise.all([
          api.getStudent(id),
          api.getMatchesForStudent(id)
        ]);
        setStudent(studentData);
        setMatches(matchesData.slice(0, 5));
      } catch (error) {
        console.error('Failed to load student:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStudent();
  }, [id]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const groupedSkills = student?.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof student.skills>) || {};

  if (isLoading) {
    return (
      <div className="container mx-auto px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg font-medium opacity-60">Loading student profile...</div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container mx-auto px-8 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Student Not Found</h2>
          <p className="opacity-60 mb-8">The student profile you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/students')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Students
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 opacity-60 hover:opacity-100 transition-opacity">
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Student Profile</h1>
        <p className="text-sm opacity-60">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="border border-black rounded-sm p-12 mb-8 bg-white">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">{student.name}</h2>
            <p className="text-base opacity-60 mb-4">{student.email}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 opacity-60">
                <MapPin className="h-4 w-4" />
                <span>{student.location}</span>
              </div>
              <div className="flex items-center gap-2 opacity-60">
                <Briefcase className="h-4 w-4" />
                <span>{student.experience}</span>
              </div>
              <div className="flex items-center gap-2 opacity-60">
                <Calendar className="h-4 w-4" />
                <span>Class of {student.graduationYear}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-7xl font-bold leading-none">{student.matchScore}%</div>
            <p className="text-sm opacity-60 mt-2">Overall Match Readiness</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 pb-8 border-b border-gray-200">
          <div className="border-l-2 border-black pl-4">
            <div className="text-2xl font-bold mb-1">{student.university}</div>
            <p className="text-sm opacity-60">University</p>
          </div>
          <div className="border-l-2 border-black pl-4">
            <div className="text-2xl font-bold mb-1">{student.major}</div>
            <p className="text-sm opacity-60">Major</p>
          </div>
          <div className="border-l-2 border-black pl-4">
            <div className="text-2xl font-bold mb-1">{student.gpa}</div>
            <p className="text-sm opacity-60">GPA</p>
          </div>
          <div className="border-l-2 border-black pl-4">
            <div className="text-2xl font-bold mb-1">{student.verifiedSkills}/{student.totalSkills}</div>
            <p className="text-sm opacity-60">Verified Skills</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Top Skills</h3>
          <div className="flex flex-wrap gap-2">
            {student.topSkills.map((skill) => (
              <Badge key={skill} variant="outline" className="text-sm py-1 px-3">{skill}</Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button className="flex-1 h-12 text-base font-semibold" onClick={() => navigate('/matches')}>
            Find Matching Roles
          </Button>
          <Button variant="outline" className="flex-1 h-12 text-base font-semibold border-black" onClick={() => navigate('/skill-gap')}>
            Skill Gap Analysis
          </Button>
          <Button variant="outline" className="h-12 px-4 border-black">
            <Mail className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-4">Skills Breakdown</h3>
          {Object.entries(groupedSkills).map(([category, categorySkills]) => {
            const isExpanded = expandedCategories.includes(category);

            return (
              <div key={category} className="border border-black rounded-sm bg-white">
                <button onClick={() => toggleCategory(category)} className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <h4 className="text-xl font-semibold">{category}</h4>
                    <Badge variant="outline" className="font-mono">{categorySkills.length}</Badge>
                  </div>
                  <ChevronDown className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="border-t border-black p-6 space-y-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{skill.name}</span>
                            {skill.verified && (
                              <span className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center">
                                <Check className="h-3 w-3" />
                              </span>
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

        <div className="space-y-8">
          <div className="border border-black rounded-sm p-8 bg-white">
            <h3 className="text-xl font-semibold mb-6">Verified Credentials</h3>
            <div className="space-y-3">
              {student.certifications.map((credential, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{credential.title}</p>
                      {credential.verified && <Check className="h-4 w-4 text-green-600" />}
                    </div>
                    <p className="text-sm opacity-60">{credential.issuer} · {credential.date}</p>
                  </div>
                  <button className="opacity-60 hover:opacity-100 transition-opacity">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {student.certifications.length === 0 && (
                <p className="text-sm opacity-60">No certifications added yet.</p>
              )}
            </div>
          </div>

          <div className="border border-black rounded-sm p-8 bg-white">
            <h3 className="text-xl font-semibold mb-6">Top Role Matches</h3>
            <div className="space-y-3">
              {matches.map((match) => (
                <div key={match.id} onClick={() => navigate('/roles')} className="flex items-center justify-between p-4 border border-gray-200 rounded-sm hover:border-black transition-all cursor-pointer">
                  <div>
                    <p className="font-medium">{match.studentName}</p>
                    <p className="text-sm opacity-60">{match.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xl font-bold">{match.matchPercentage}%</div>
                    <div className="text-xs opacity-60">MATCH</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {student.projects && student.projects.length > 0 && (
            <div className="border border-black rounded-sm p-8 bg-white">
              <h3 className="text-xl font-semibold mb-6">Projects</h3>
              <div className="space-y-4">
                {student.projects.map((project, idx) => (
                  <div key={idx} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                    <h4 className="font-semibold mb-1">{project.title}</h4>
                    <p className="text-sm opacity-60 mb-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
