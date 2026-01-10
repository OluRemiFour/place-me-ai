import { useState } from 'react';
import { Download, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Match {
  id: string;
  studentName: string;
  email: string;
  matchPercentage: number;
  topSkills: string[];
  experienceYears: number;
  location: string;
  skillsMatched: string[];
  skillsMissing: string[];
  experienceAlignment: string;
}

export function AIMatchResults() {
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  const roleName = 'Senior Frontend Engineer';
  const company = 'TechFlow Systems';

  const matches: Match[] = [
    {
      id: '1',
      studentName: 'Alexandra Rivera',
      email: 'alexandra.rivera@university.edu',
      matchPercentage: 92,
      topSkills: ['React', 'TypeScript', 'CSS'],
      experienceYears: 5,
      location: 'Remote',
      skillsMatched: ['React', 'TypeScript', 'CSS', 'REST APIs', 'Git'],
      skillsMissing: [],
      experienceAlignment: 'Exceeds requirement by 0 years'
    },
    {
      id: '2',
      studentName: 'Marcus Chen',
      email: 'marcus.chen@tech.edu',
      matchPercentage: 88,
      topSkills: ['React', 'JavaScript', 'Node.js'],
      experienceYears: 4,
      location: 'Hybrid',
      skillsMatched: ['React', 'CSS', 'REST APIs', 'Git'],
      skillsMissing: ['TypeScript'],
      experienceAlignment: 'Meets minimum requirement'
    },
    {
      id: '3',
      studentName: 'Samantha Park',
      email: 'samantha.park@university.edu',
      matchPercentage: 85,
      topSkills: ['TypeScript', 'React', 'GraphQL'],
      experienceYears: 6,
      location: 'Remote',
      skillsMatched: ['React', 'TypeScript', 'REST APIs', 'Git'],
      skillsMissing: ['CSS'],
      experienceAlignment: 'Exceeds requirement by 1 year'
    },
    {
      id: '4',
      studentName: 'David Okonkwo',
      email: 'david.o@institute.edu',
      matchPercentage: 81,
      topSkills: ['React', 'Next.js', 'TypeScript'],
      experienceYears: 4,
      location: 'Remote',
      skillsMatched: ['React', 'TypeScript', 'Git'],
      skillsMissing: ['CSS', 'REST APIs'],
      experienceAlignment: 'Meets minimum requirement'
    },
    {
      id: '5',
      studentName: 'Emily Thompson',
      email: 'emily.thompson@college.edu',
      matchPercentage: 78,
      topSkills: ['React', 'JavaScript', 'HTML/CSS'],
      experienceYears: 3,
      location: 'On-site',
      skillsMatched: ['React', 'CSS', 'Git'],
      skillsMissing: ['TypeScript', 'REST APIs'],
      experienceAlignment: '2 years below requirement'
    },
    {
      id: '6',
      studentName: 'James Rodriguez',
      email: 'james.r@university.edu',
      matchPercentage: 74,
      topSkills: ['Vue.js', 'TypeScript', 'CSS'],
      experienceYears: 5,
      location: 'Hybrid',
      skillsMatched: ['TypeScript', 'CSS', 'REST APIs', 'Git'],
      skillsMissing: ['React'],
      experienceAlignment: 'Exceeds requirement by 0 years'
    }
  ];

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Match %', 'Top Skills', 'Experience', 'Location'];
    const rows = matches.map(m => [
      m.studentName,
      m.email,
      m.matchPercentage,
      m.topSkills.join('; '),
      `${m.experienceYears} years`,
      m.location
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skillsync-matches.csv';
    a.click();
  };

  return (
    <div className="container mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">AI Match Results</h1>
        <p className="text-sm opacity-60">
          {roleName} at {company} · {matches.length} candidates ranked by fit
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between mb-8 p-4 border border-black rounded-sm bg-white">
        <div className="flex items-center gap-4">
          <div className="font-mono text-sm">
            <span className="opacity-60">ANALYSIS COMPLETED:</span>
            <span className="ml-2 font-bold">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
        <Button onClick={exportToCSV} variant="outline" className="border-black">
          <Download className="h-4 w-4 mr-2" />
          Export Results
        </Button>
      </div>

      {/* Match Results List */}
      <div className="space-y-4">
        {matches.map((match, idx) => {
          const isExpanded = expandedMatch === match.id;
          
          return (
            <div key={match.id} className="border border-black rounded-sm bg-white overflow-hidden">
              <button
                onClick={() => setExpandedMatch(isExpanded ? null : match.id)}
                className="w-full p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors"
              >
                <div className="font-mono text-lg font-bold opacity-40 w-8">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold mb-1">{match.studentName}</h3>
                  <p className="text-sm opacity-60">{match.email}</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm opacity-60 mb-1">Top Skills</div>
                    <div className="flex gap-1">
                      {match.topSkills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="text-right min-w-[120px]">
                    <div className="font-mono text-5xl font-bold leading-none mb-1">
                      {match.matchPercentage}%
                    </div>
                    <div className="text-xs opacity-60">MATCH SCORE</div>
                  </div>

                  <ChevronDown 
                    className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-black p-8 bg-gray-50">
                  <div className="grid grid-cols-3 gap-8">
                    {/* Skills Matched */}
                    <div>
                      <h4 className="text-sm font-semibold mb-4 opacity-60">SKILLS MATCHED</h4>
                      <div className="space-y-2">
                        {match.skillsMatched.map((skill) => (
                          <div key={skill} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-black rounded-full"></div>
                            <span className="text-sm font-medium">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skills Missing */}
                    <div>
                      <h4 className="text-sm font-semibold mb-4 opacity-60">SKILLS MISSING</h4>
                      {match.skillsMissing.length > 0 ? (
                        <div className="space-y-2">
                          {match.skillsMissing.map((skill) => (
                            <div key={skill} className="flex items-center gap-2">
                              <div className="w-2 h-2 border border-black rounded-full"></div>
                              <span className="text-sm opacity-60">{skill}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm opacity-60">All required skills present</p>
                      )}
                    </div>

                    {/* Experience Alignment */}
                    <div>
                      <h4 className="text-sm font-semibold mb-4 opacity-60">EXPERIENCE ALIGNMENT</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="text-2xl font-bold mb-1">{match.experienceYears} yrs</div>
                          <p className="text-sm opacity-60">{match.experienceAlignment}</p>
                        </div>
                        <div className="pt-2">
                          <div className="text-xs opacity-60 mb-1">Location</div>
                          <Badge variant="outline">{match.location}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-300 flex gap-3">
                    <Button className="flex-1 h-10">View Full Profile</Button>
                    <Button variant="outline" className="flex-1 h-10 border-black">
                      Schedule Interview
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
