import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api, Match, Role } from '@/services/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function AIMatchResults() {
  const navigate = useNavigate();
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('1');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRoles = async () => {
      const rolesData = await api.getRoles();
      setRoles(rolesData);
    };
    loadRoles();
  }, []);

  useEffect(() => {
    const loadMatches = async () => {
      setIsLoading(true);
      try {
        const data = await api.getMatchesForRole(selectedRoleId);
        setMatches(data);
      } catch (error) {
        console.error('Failed to load matches:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMatches();
  }, [selectedRoleId]);

  const selectedRole = roles.find(r => r.id === selectedRoleId);
  const roleName = selectedRole?.title || 'Senior Frontend Engineer';
  const company = selectedRole?.company || 'TechFlow Systems';

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

      {/* Role Selection & Actions */}
      <div className="flex items-center justify-between mb-8 p-4 border border-black rounded-sm bg-white">
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="opacity-60">Select Role:</span>
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
        <Button onClick={exportToCSV} variant="outline" className="border-black">
          <Download className="h-4 w-4 mr-2" />
          Export Results
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-lg font-medium opacity-60">Analyzing matches...</div>
        </div>
      ) : (
      /* Match Results List */
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
                    <Button className="flex-1 h-10" onClick={() => navigate(`/students/${match.studentId}`)}>
                      View Full Profile
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="flex-1 h-10 border-black" onClick={() => navigate('/skill-gap')}>
                      View Skill Gap
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
