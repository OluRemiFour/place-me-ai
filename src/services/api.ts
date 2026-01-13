// Mock API Service - simulates backend API calls
// In production, replace with actual API endpoints

export interface Student {
  id: string;
  name: string;
  email: string;
  matchScore: number;
  verifiedSkills: number;
  totalSkills: number;
  topSkills: string[];
  location: string;
  experience: string;
  university: string;
  major: string;
  gpa: number;
  graduationYear: number;
  skills: SkillDetail[];
  certifications: Certification[];
  projects: Project[];
}

export interface SkillDetail {
  name: string;
  level: number;
  verified: boolean;
  category: string;
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  verified: boolean;
}

export interface Project {
  title: string;
  description: string;
  skills: string[];
  url?: string;
}

export interface Role {
  id: string;
  title: string;
  company: string;
  seniority: string;
  industry: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experience: string;
  location: string;
  salary?: string;
  description?: string;
}

export interface Match {
  id: string;
  studentId: string;
  roleId: string;
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

export interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  estimatedTime: string;
}

export interface SkillStatistics {
  skillName: string;
  averageLevel: number;
  demandScore: number;
  studentsWithSkill: number;
  growthTrend: number;
}

// Simulated database
const studentsDB: Student[] = [
  {
    id: '1',
    name: 'Alexandra Rivera',
    email: 'alexandra.rivera@university.edu',
    matchScore: 92,
    verifiedSkills: 12,
    totalSkills: 24,
    topSkills: ['React', 'TypeScript', 'Node.js'],
    location: 'Remote',
    experience: '5 years',
    university: 'Stanford University',
    major: 'Computer Science',
    gpa: 3.8,
    graduationYear: 2019,
    skills: [
      { name: 'React', level: 92, verified: true, category: 'Technical' },
      { name: 'TypeScript', level: 88, verified: true, category: 'Technical' },
      { name: 'Node.js', level: 85, verified: true, category: 'Technical' },
      { name: 'Python', level: 78, verified: false, category: 'Technical' },
      { name: 'SQL', level: 82, verified: true, category: 'Technical' },
      { name: 'Communication', level: 90, verified: true, category: 'Soft Skills' },
      { name: 'Team Leadership', level: 85, verified: true, category: 'Soft Skills' },
      { name: 'Problem Solving', level: 88, verified: false, category: 'Soft Skills' },
    ],
    certifications: [
      { title: 'Full Stack Development Certification', issuer: 'Tech Academy', date: '2024', verified: true },
      { title: 'Advanced JavaScript', issuer: 'CodeMasters', date: '2023', verified: true },
      { title: 'Cloud Architecture', issuer: 'Cloud Institute', date: '2024', verified: true },
    ],
    projects: [
      { title: 'E-commerce Platform', description: 'Built a full-stack e-commerce solution with React and Node.js', skills: ['React', 'Node.js', 'PostgreSQL'] },
      { title: 'Real-time Chat App', description: 'Developed a WebSocket-based chat application', skills: ['TypeScript', 'Socket.io', 'Redis'] },
    ]
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
    experience: '4 years',
    university: 'MIT',
    major: 'Software Engineering',
    gpa: 3.9,
    graduationYear: 2020,
    skills: [
      { name: 'Python', level: 94, verified: true, category: 'Technical' },
      { name: 'Django', level: 90, verified: true, category: 'Technical' },
      { name: 'PostgreSQL', level: 85, verified: true, category: 'Technical' },
      { name: 'React', level: 70, verified: false, category: 'Technical' },
      { name: 'AWS', level: 75, verified: true, category: 'Technical' },
    ],
    certifications: [
      { title: 'AWS Solutions Architect', issuer: 'Amazon', date: '2023', verified: true },
      { title: 'Python Professional', issuer: 'Python Institute', date: '2022', verified: true },
    ],
    projects: [
      { title: 'Data Pipeline Framework', description: 'Built scalable data processing pipelines', skills: ['Python', 'Apache Kafka', 'AWS'] },
    ]
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
    experience: '6 years',
    university: 'UC Berkeley',
    major: 'DevOps Engineering',
    gpa: 3.7,
    graduationYear: 2018,
    skills: [
      { name: 'AWS', level: 95, verified: true, category: 'Technical' },
      { name: 'Kubernetes', level: 90, verified: true, category: 'Technical' },
      { name: 'Docker', level: 92, verified: true, category: 'Technical' },
      { name: 'Terraform', level: 88, verified: true, category: 'Technical' },
      { name: 'CI/CD', level: 90, verified: true, category: 'Technical' },
    ],
    certifications: [
      { title: 'Certified Kubernetes Administrator', issuer: 'CNCF', date: '2023', verified: true },
      { title: 'AWS DevOps Professional', issuer: 'Amazon', date: '2024', verified: true },
    ],
    projects: []
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
    experience: '4 years',
    university: 'Georgia Tech',
    major: 'Web Development',
    gpa: 3.6,
    graduationYear: 2020,
    skills: [
      { name: 'React', level: 88, verified: true, category: 'Technical' },
      { name: 'Next.js', level: 85, verified: true, category: 'Technical' },
      { name: 'GraphQL', level: 82, verified: true, category: 'Technical' },
      { name: 'TypeScript', level: 80, verified: false, category: 'Technical' },
    ],
    certifications: [
      { title: 'React Developer Certification', issuer: 'Meta', date: '2023', verified: true },
    ],
    projects: []
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
    experience: '3 years',
    university: 'UCLA',
    major: 'Information Systems',
    gpa: 3.5,
    graduationYear: 2021,
    skills: [
      { name: 'JavaScript', level: 82, verified: true, category: 'Technical' },
      { name: 'Vue.js', level: 78, verified: true, category: 'Technical' },
      { name: 'CSS', level: 85, verified: true, category: 'Technical' },
      { name: 'HTML', level: 90, verified: true, category: 'Technical' },
    ],
    certifications: [],
    projects: []
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
    experience: '5 years',
    university: 'Carnegie Mellon',
    major: 'Enterprise Systems',
    gpa: 3.8,
    graduationYear: 2019,
    skills: [
      { name: 'Java', level: 92, verified: true, category: 'Technical' },
      { name: 'Spring', level: 88, verified: true, category: 'Technical' },
      { name: 'Microservices', level: 85, verified: true, category: 'Technical' },
      { name: 'Kafka', level: 80, verified: true, category: 'Technical' },
    ],
    certifications: [
      { title: 'Oracle Java SE Certified', issuer: 'Oracle', date: '2023', verified: true },
    ],
    projects: []
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
    experience: '3 years',
    university: 'Cornell University',
    major: 'Mobile Development',
    gpa: 3.7,
    graduationYear: 2021,
    skills: [
      { name: 'React Native', level: 88, verified: true, category: 'Technical' },
      { name: 'iOS', level: 82, verified: true, category: 'Technical' },
      { name: 'Android', level: 80, verified: true, category: 'Technical' },
      { name: 'Swift', level: 75, verified: false, category: 'Technical' },
    ],
    certifications: [],
    projects: []
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
    experience: '4 years',
    university: 'Princeton',
    major: 'Machine Learning',
    gpa: 3.9,
    graduationYear: 2020,
    skills: [
      { name: 'Python', level: 90, verified: true, category: 'Technical' },
      { name: 'TensorFlow', level: 85, verified: true, category: 'Technical' },
      { name: 'Machine Learning', level: 88, verified: true, category: 'Technical' },
      { name: 'PyTorch', level: 82, verified: true, category: 'Technical' },
    ],
    certifications: [
      { title: 'TensorFlow Developer Certificate', issuer: 'Google', date: '2023', verified: true },
    ],
    projects: []
  }
];

const rolesDB: Role[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'TechFlow Systems',
    seniority: 'Senior',
    industry: 'Technology',
    requiredSkills: ['React', 'TypeScript', 'CSS', 'REST APIs', 'Git'],
    preferredSkills: ['Next.js', 'GraphQL', 'Testing'],
    experience: '5+ years',
    location: 'Remote',
    salary: '$150,000 - $180,000',
    description: 'Lead frontend development for our enterprise SaaS platform, working with modern React patterns and TypeScript.'
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
    location: 'Hybrid',
    salary: '$120,000 - $140,000'
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
    location: 'On-site',
    salary: '$200,000 - $250,000'
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
    location: 'Remote',
    salary: '$70,000 - $90,000'
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
    location: 'Remote',
    salary: '$130,000 - $150,000'
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
    location: 'Hybrid',
    salary: '$110,000 - $130,000'
  }
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Functions
export const api = {
  // Students
  async getStudents(): Promise<Student[]> {
    await delay(300);
    return studentsDB;
  },

  async getStudent(id: string): Promise<Student | null> {
    await delay(200);
    return studentsDB.find(s => s.id === id) || null;
  },

  async searchStudents(query: string): Promise<Student[]> {
    await delay(200);
    const lowercaseQuery = query.toLowerCase();
    return studentsDB.filter(s =>
      s.name.toLowerCase().includes(lowercaseQuery) ||
      s.email.toLowerCase().includes(lowercaseQuery) ||
      s.topSkills.some(skill => skill.toLowerCase().includes(lowercaseQuery))
    );
  },

  // Roles
  async getRoles(): Promise<Role[]> {
    await delay(300);
    return rolesDB;
  },

  async getRole(id: string): Promise<Role | null> {
    await delay(200);
    return rolesDB.find(r => r.id === id) || null;
  },

  // Matching
  async getMatchesForRole(roleId: string): Promise<Match[]> {
    await delay(500);
    const role = rolesDB.find(r => r.id === roleId);
    if (!role) return [];

    return studentsDB.map(student => {
      const matchedSkills = role.requiredSkills.filter(skill =>
        student.skills.some(s => s.name.toLowerCase() === skill.toLowerCase())
      );
      const missingSkills = role.requiredSkills.filter(skill =>
        !student.skills.some(s => s.name.toLowerCase() === skill.toLowerCase())
      );
      const matchPercentage = Math.round((matchedSkills.length / role.requiredSkills.length) * 100);

      return {
        id: `${student.id}-${roleId}`,
        studentId: student.id,
        roleId,
        studentName: student.name,
        email: student.email,
        matchPercentage,
        topSkills: student.topSkills,
        experienceYears: parseInt(student.experience),
        location: student.location,
        skillsMatched: matchedSkills,
        skillsMissing: missingSkills,
        experienceAlignment: getExperienceAlignment(parseInt(student.experience), role.experience)
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);
  },

  async getMatchesForStudent(studentId: string): Promise<Match[]> {
    await delay(500);
    const student = studentsDB.find(s => s.id === studentId);
    if (!student) return [];

    return rolesDB.map(role => {
      const matchedSkills = role.requiredSkills.filter(skill =>
        student.skills.some(s => s.name.toLowerCase() === skill.toLowerCase())
      );
      const missingSkills = role.requiredSkills.filter(skill =>
        !student.skills.some(s => s.name.toLowerCase() === skill.toLowerCase())
      );
      const matchPercentage = Math.round((matchedSkills.length / role.requiredSkills.length) * 100);

      return {
        id: `${studentId}-${role.id}`,
        studentId,
        roleId: role.id,
        studentName: student.name,
        email: student.email,
        matchPercentage,
        topSkills: student.topSkills,
        experienceYears: parseInt(student.experience),
        location: student.location,
        skillsMatched: matchedSkills,
        skillsMissing: missingSkills,
        experienceAlignment: getExperienceAlignment(parseInt(student.experience), role.experience)
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);
  },

  // Skill Gap Analysis
  async getSkillGapAnalysis(studentId: string, roleId: string): Promise<{
    missingSkills: string[];
    skillsToImprove: SkillGap[];
    overallReadiness: number;
    recommendedActions: Array<{
      title: string;
      description: string;
      duration: string;
      priority: 'high' | 'medium' | 'low';
    }>;
  }> {
    await delay(400);
    const student = studentsDB.find(s => s.id === studentId);
    const role = rolesDB.find(r => r.id === roleId);

    if (!student || !role) {
      return {
        missingSkills: [],
        skillsToImprove: [],
        overallReadiness: 0,
        recommendedActions: []
      };
    }

    const missingSkills = role.requiredSkills.filter(skill =>
      !student.skills.some(s => s.name.toLowerCase() === skill.toLowerCase())
    );

    const skillsToImprove: SkillGap[] = student.skills
      .filter(s => role.requiredSkills.some(rs => rs.toLowerCase() === s.name.toLowerCase()) && s.level < 85)
      .map(s => ({
        skill: s.name,
        currentLevel: s.level,
        requiredLevel: 85,
        estimatedTime: `${Math.ceil((85 - s.level) / 5)} weeks`
      }));

    const matchedSkills = role.requiredSkills.filter(skill =>
      student.skills.some(s => s.name.toLowerCase() === skill.toLowerCase())
    );
    const overallReadiness = Math.round((matchedSkills.length / role.requiredSkills.length) * 100);

    return {
      missingSkills,
      skillsToImprove,
      overallReadiness,
      recommendedActions: [
        {
          title: `Master ${missingSkills[0] || 'Advanced Patterns'}`,
          description: `Complete comprehensive training on ${missingSkills[0] || 'advanced programming patterns'}`,
          duration: '6 weeks',
          priority: 'high'
        },
        {
          title: 'Build Production Project',
          description: 'Create a full-stack application showcasing required skills',
          duration: '8 weeks',
          priority: 'high'
        },
        {
          title: 'Practice System Design',
          description: 'Weekly system design exercises and mock interviews',
          duration: '10 weeks',
          priority: 'medium'
        }
      ]
    };
  },

  // Statistics
  async getSkillStatistics(): Promise<SkillStatistics[]> {
    await delay(300);
    const skillCounts: Record<string, { total: number; levels: number[] }> = {};

    studentsDB.forEach(student => {
      student.skills.forEach(skill => {
        if (!skillCounts[skill.name]) {
          skillCounts[skill.name] = { total: 0, levels: [] };
        }
        skillCounts[skill.name].total++;
        skillCounts[skill.name].levels.push(skill.level);
      });
    });

    return Object.entries(skillCounts).map(([name, data]) => ({
      skillName: name,
      averageLevel: Math.round(data.levels.reduce((a, b) => a + b, 0) / data.levels.length),
      demandScore: Math.round(Math.random() * 30 + 70),
      studentsWithSkill: data.total,
      growthTrend: Math.round(Math.random() * 20 - 5)
    })).sort((a, b) => b.studentsWithSkill - a.studentsWithSkill);
  },

  async getDashboardMetrics(): Promise<{
    totalStudents: number;
    activeRoles: number;
    matchesThisWeek: number;
    avgMatchScore: number;
    topSkills: { skill: string; demand: number }[];
    recentMatches: { student: string; role: string; score: number; company: string }[];
    matchTrend: { date: string; matches: number }[];
    skillDistribution: { category: string; count: number }[];
  }> {
    await delay(400);
    return {
      totalStudents: studentsDB.length,
      activeRoles: rolesDB.length,
      matchesThisWeek: 342,
      avgMatchScore: 84,
      topSkills: [
        { skill: 'React', demand: 95 },
        { skill: 'TypeScript', demand: 88 },
        { skill: 'Python', demand: 85 },
        { skill: 'Node.js', demand: 82 },
        { skill: 'AWS', demand: 78 }
      ],
      recentMatches: [
        { student: 'Alexandra Rivera', role: 'Senior Frontend Engineer', score: 92, company: 'TechFlow' },
        { student: 'Marcus Chen', role: 'Full Stack Developer', score: 88, company: 'DataShift' },
        { student: 'Samantha Park', role: 'DevOps Engineer', score: 91, company: 'CloudTech' },
        { student: 'David Okonkwo', role: 'Backend Engineer', score: 85, company: 'Nexus' },
        { student: 'Emily Thompson', role: 'Mobile Developer', score: 82, company: 'Vertex' }
      ],
      matchTrend: [
        { date: 'Mon', matches: 45 },
        { date: 'Tue', matches: 52 },
        { date: 'Wed', matches: 48 },
        { date: 'Thu', matches: 70 },
        { date: 'Fri', matches: 65 },
        { date: 'Sat', matches: 30 },
        { date: 'Sun', matches: 32 }
      ],
      skillDistribution: [
        { category: 'Frontend', count: 45 },
        { category: 'Backend', count: 38 },
        { category: 'DevOps', count: 25 },
        { category: 'Mobile', count: 18 },
        { category: 'Data/ML', count: 22 }
      ]
    };
  }
};

// Helper functions
function getExperienceAlignment(studentYears: number, roleRequirement: string): string {
  const match = roleRequirement.match(/(\d+)/);
  if (!match) return 'N/A';
  const required = parseInt(match[1]);
  const diff = studentYears - required;
  if (diff >= 0) return `Exceeds requirement by ${diff} year${diff === 1 ? '' : 's'}`;
  return `${Math.abs(diff)} year${Math.abs(diff) === 1 ? '' : 's'} below requirement`;
}
