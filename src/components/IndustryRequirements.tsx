import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Role {
  id: string;
  title: string;
  company: string;
  seniority: string;
  industry: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experience: string;
  location: string;
}

export function IndustryRequirements() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');

  const roles: Role[] = [
    {
      id: '1',
      title: 'Senior Frontend Engineer',
      company: 'TechFlow Systems',
      seniority: 'Senior',
      industry: 'Technology',
      requiredSkills: ['React', 'TypeScript', 'CSS', 'REST APIs', 'Git'],
      preferredSkills: ['Next.js', 'GraphQL', 'Testing'],
      experience: '5+ years',
      location: 'Remote'
    },
    {
      id: '2',
      title: 'Full Stack Developer',
      company: 'DataShift Inc',
      seniority: 'Mid-Level',
      industry: 'FinTech',
      requiredSkills: ['Node.js', 'React', 'SQL', 'Python', 'AWS'],
      preferredSkills: ['Docker', 'Kubernetes', 'MongoDB'],
      experience: '3-5 years',
      location: 'Hybrid'
    },
    {
      id: '3',
      title: 'Lead Software Architect',
      company: 'Quantum Labs',
      seniority: 'Lead',
      industry: 'Technology',
      requiredSkills: ['System Design', 'Microservices', 'Cloud Architecture', 'Java', 'Kubernetes'],
      preferredSkills: ['AI/ML', 'Security', 'DevOps'],
      experience: '8+ years',
      location: 'On-site'
    },
    {
      id: '4',
      title: 'Junior Backend Developer',
      company: 'Nexus Digital',
      seniority: 'Junior',
      industry: 'E-commerce',
      requiredSkills: ['Python', 'Django', 'SQL', 'REST APIs'],
      preferredSkills: ['Redis', 'Celery', 'Docker'],
      experience: '1-2 years',
      location: 'Remote'
    },
    {
      id: '5',
      title: 'DevOps Engineer',
      company: 'Pinnacle Cloud',
      seniority: 'Mid-Level',
      industry: 'Cloud Services',
      requiredSkills: ['AWS', 'Terraform', 'CI/CD', 'Docker', 'Linux'],
      preferredSkills: ['Ansible', 'Monitoring', 'Security'],
      experience: '3-4 years',
      location: 'Remote'
    },
    {
      id: '6',
      title: 'Mobile Developer',
      company: 'Vertex Apps',
      seniority: 'Mid-Level',
      industry: 'Mobile',
      requiredSkills: ['React Native', 'JavaScript', 'iOS', 'Android', 'REST APIs'],
      preferredSkills: ['Native modules', 'Redux', 'Firebase'],
      experience: '3-5 years',
      location: 'Hybrid'
    }
  ];

  const industries = ['all', 'Technology', 'FinTech', 'E-commerce', 'Cloud Services', 'Mobile'];

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = industryFilter === 'all' || role.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="container mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Industry Requirements</h1>
        <p className="text-sm opacity-60">
          {roles.length} active role requirements · Updated daily
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
          <Input
            placeholder="Search roles or companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        <Select value={industryFilter} onValueChange={setIndustryFilter}>
          <SelectTrigger className="w-[200px] h-12">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            {industries.map(industry => (
              <SelectItem key={industry} value={industry}>
                {industry === 'all' ? 'All Industries' : industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <div
            key={role.id}
            onClick={() => setSelectedRole(role)}
            className="border border-black rounded-sm p-6 bg-white hover:shadow-[4px_4px_0_0_#000] transition-all cursor-pointer"
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-1">{role.title}</h3>
              <p className="text-sm opacity-60">{role.company}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="font-mono text-xs">
                {role.seniority}
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                {role.industry}
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                {role.location}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-60">Required Skills</span>
                <span className="font-mono font-bold">{role.requiredSkills.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-60">Experience</span>
                <span className="font-medium">{role.experience}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Role Details Sheet */}
      <Sheet open={!!selectedRole} onOpenChange={() => setSelectedRole(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedRole && (
            <>
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold pr-8">
                  {selectedRole.title}
                </SheetTitle>
                <p className="text-base opacity-60">{selectedRole.company}</p>
              </SheetHeader>

              <div className="mt-8 space-y-8">
                <div>
                  <h4 className="text-sm font-semibold mb-3 opacity-60">OVERVIEW</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="opacity-60">Seniority Level</span>
                      <span className="font-medium">{selectedRole.seniority}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="opacity-60">Industry</span>
                      <span className="font-medium">{selectedRole.industry}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="opacity-60">Experience</span>
                      <span className="font-medium">{selectedRole.experience}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="opacity-60">Location</span>
                      <span className="font-medium">{selectedRole.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-3 opacity-60">REQUIRED SKILLS</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRole.requiredSkills.map((skill) => (
                      <Badge key={skill} variant="default" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-3 opacity-60">PREFERRED SKILLS</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRole.preferredSkills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full h-12 text-base font-semibold">
                    Find Matching Candidates
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
