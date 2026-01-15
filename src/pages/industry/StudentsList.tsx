import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api, Student } from '@/services/api';

export function StudentsList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await api.getStudents();
        setStudents(data);
      } catch (error) {
        console.error('Failed to load students:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStudents();
  }, []);

  const filteredStudents = students
    .filter(student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.topSkills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'score') return b.matchScore - a.matchScore;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'certified') return b.certifiedSkills - a.certifiedSkills;
      return 0;
    });

  const handleStudentClick = (studentId: string) => {
    navigate(`/students/${studentId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg font-medium opacity-60">Loading candidates...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Student Profiles</h1>
        <p className="text-sm opacity-60">
          {students.length} students · Sorted by {sortBy === 'score' ? 'match score' : sortBy === 'name' ? 'name' : 'certified skills'}
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
          <Input
            placeholder="Search by name, email, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[200px] h-12">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="score">Match Score</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="certified">Certified Skills</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="border border-black rounded-sm p-8 bg-white hover:shadow-[4px_4px_0_0_#000] transition-all"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-1">{student.name}</h3>
                <p className="text-sm opacity-60">{student.email}</p>
              </div>
              <div className="text-right">
                <div className="font-mono text-4xl font-bold leading-none">
                  {student.matchScore}%
                </div>
                <p className="text-xs opacity-60 mt-1">READINESS</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
              <div>
                <div className="text-2xl font-bold mb-1">{student.certifiedSkills}</div>
                <p className="text-xs opacity-60">Certified Skills</p>
              </div>
              <div>
                <div className="text-2xl font-bold mb-1">{student.totalSkills}</div>
                <p className="text-xs opacity-60">Total Skills</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs opacity-60 mb-2">TOP SKILLS</p>
                <div className="flex flex-wrap gap-2">
                  {student.topSkills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs opacity-60 mb-1">LOCATION</p>
                  <p className="text-sm font-medium">{student.location}</p>
                </div>
                <div>
                  <p className="text-xs opacity-60 mb-1">EXPERIENCE</p>
                  <p className="text-sm font-medium">{student.experience}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 h-10" onClick={() => handleStudentClick(student.id)}>
                View Profile
              </Button>
              <Button variant="outline" className="border-black" onClick={() => navigate('/matches')}>
                Match
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
