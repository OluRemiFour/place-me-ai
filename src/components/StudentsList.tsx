import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Student {
  id: string;
  name: string;
  email: string;
  matchScore: number;
  verifiedSkills: number;
  totalSkills: number;
  topSkills: string[];
  location: string;
  experience: string;
}

export function StudentsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('score');

  const students: Student[] = [
    {
      id: '1',
      name: 'Alexandra Rivera',
      email: 'alexandra.rivera@university.edu',
      matchScore: 92,
      verifiedSkills: 12,
      totalSkills: 24,
      topSkills: ['React', 'TypeScript', 'Node.js'],
      location: 'Remote',
      experience: '5 years'
    },
    {
      id: '2',
      name: 'Marcus Chen',
      email: 'marcus.chen@tech.edu',
      matchScore: 88,
      verifiedSkills: 10,
      totalSkills: 20,
      topSkills: ['Python', 'Django', 'PostgreSQL'],
      location: 'Hybrid',
      experience: '4 years'
    },
    {
      id: '3',
      name: 'Samantha Park',
      email: 'samantha.park@university.edu',
      matchScore: 91,
      verifiedSkills: 15,
      totalSkills: 28,
      topSkills: ['AWS', 'Kubernetes', 'Docker'],
      location: 'Remote',
      experience: '6 years'
    },
    {
      id: '4',
      name: 'David Okonkwo',
      email: 'david.o@institute.edu',
      matchScore: 85,
      verifiedSkills: 11,
      totalSkills: 22,
      topSkills: ['React', 'Next.js', 'GraphQL'],
      location: 'Remote',
      experience: '4 years'
    },
    {
      id: '5',
      name: 'Emily Thompson',
      email: 'emily.thompson@college.edu',
      matchScore: 78,
      verifiedSkills: 8,
      totalSkills: 18,
      topSkills: ['JavaScript', 'Vue.js', 'CSS'],
      location: 'On-site',
      experience: '3 years'
    },
    {
      id: '6',
      name: 'James Rodriguez',
      email: 'james.r@university.edu',
      matchScore: 89,
      verifiedSkills: 13,
      totalSkills: 25,
      topSkills: ['Java', 'Spring', 'Microservices'],
      location: 'Hybrid',
      experience: '5 years'
    },
    {
      id: '7',
      name: 'Priya Sharma',
      email: 'priya.sharma@tech.edu',
      matchScore: 86,
      verifiedSkills: 9,
      totalSkills: 19,
      topSkills: ['React Native', 'iOS', 'Android'],
      location: 'Remote',
      experience: '3 years'
    },
    {
      id: '8',
      name: 'Michael Foster',
      email: 'michael.f@institute.edu',
      matchScore: 83,
      verifiedSkills: 10,
      totalSkills: 21,
      topSkills: ['Python', 'TensorFlow', 'ML'],
      location: 'Remote',
      experience: '4 years'
    }
  ];

  const filteredStudents = students
    .filter(student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.topSkills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'score') return b.matchScore - a.matchScore;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'verified') return b.verifiedSkills - a.verifiedSkills;
      return 0;
    });

  return (
    <div className="container mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Student Profiles</h1>
        <p className="text-sm opacity-60">
          {students.length} students · Sorted by {sortBy === 'score' ? 'match score' : sortBy === 'name' ? 'name' : 'verified skills'}
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
            <SelectItem value="verified">Verified Skills</SelectItem>
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
                <div className="text-2xl font-bold mb-1">{student.verifiedSkills}</div>
                <p className="text-xs opacity-60">Verified Skills</p>
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
              <Link to={`/students/${student.id}`} className="flex-1">
                <Button className="w-full h-10">View Profile</Button>
              </Link>
              <Button variant="outline" className="border-black">
                Match
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
