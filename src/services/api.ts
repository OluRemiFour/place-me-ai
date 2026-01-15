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

const studentsDB: Student[] = [];

export interface Scholarship {
  id: number;
  title: string;
  provider: string;
  amount: string;
  deadline: string;
  url: string;
  description: string;
  match_score: number;
  tags: string;
}

const API_Base_URL = import.meta.env.VITE_API_BASE_URL;

const rolesDB: Role[] = [];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Functions
export const api = {
  // Auth
  async login(email: string, password: string): Promise<any> {
    const response = await fetch(`${API_Base_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
    }
    return await response.json();
  },

  async register(data: any): Promise<any> {
    const response = await fetch(`${API_Base_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
    }
    return await response.json();
  },

  async forgotPassword(email: string): Promise<any> {
      const response = await fetch(`${API_Base_URL}/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
      });
      if (!response.ok) throw new Error('Request failed');
      return await response.json();
  },

  async resetPassword(data: any): Promise<any> {
    const response = await fetch(`${API_Base_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Reset failed');
    return await response.json();
  },

  async sendOTP(email: string): Promise<any> {
    const response = await fetch(`${API_Base_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    if (!response.ok) throw new Error('Failed to send OTP');
    return await response.json();
  },

  async verifyOTP(email: string, otp: string): Promise<any> {
    const response = await fetch(`${API_Base_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Verification failed');
    }
    return await response.json();
  },

  async getProfileStatus(userId: string): Promise<any> {
    const response = await fetch(`${API_Base_URL}/auth/profile-status?user_id=${userId}`);
    if (!response.ok) throw new Error('Status check failed');
    return await response.json();
  },

  async getProfile(userId: string): Promise<any> {
    const response = await fetch(`${API_Base_URL}/auth/profile?user_id=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return await response.json();
  },

  async googleAuth(id_token: string, role?: string): Promise<any> {
    const response = await fetch(`${API_Base_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token, role })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Google Auth failed');
    }
    return await response.json();
  },

  async updateProfile(userId: string, data: any): Promise<any> {
    const response = await fetch(`${API_Base_URL}/auth/update-profile?user_id=${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Profile update failed');
    }
    return await response.json();
  },

  async verifyEmail(token: string): Promise<any> {
    const response = await fetch(`${API_Base_URL}/auth/verify-email?token=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Verification failed');
    }
    return await response.json();
  },

  // Python Backend Integration
  async getScholarships(): Promise<Scholarship[]> {
    const response = await fetch(`${API_Base_URL}/scholarships/`);
    if (!response.ok) return [];
    return await response.json();
  },

  async scanScholarships(profile: any): Promise<Scholarship[]> {
    try {
        const response = await fetch(`${API_Base_URL}/scholarships/scan`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(profile)
        });
        if (!response.ok) throw new Error('Scan failed');
        return await response.json();
    } catch(e) {
        console.error(e);
        return [];
    }
  },

  async getInternships(): Promise<Scholarship[]> {
    const response = await fetch(`${API_Base_URL}/internships/`); 
    if (!response.ok) return [];
    return await response.json();
  },

  async scanInternships(profile: any): Promise<Scholarship[]> {
      try {
          const response = await fetch(`${API_Base_URL}/internships/scan`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(profile)
          });
          if (!response.ok) throw new Error('Scan failed');
          return await response.json();
      } catch(e) {
          console.error(e);
          return [];
      }
  },

  async getPersonalizedLearningPath(skills: string[], goal: string): Promise<any> {
    const response = await fetch(`${API_Base_URL}/recommendation/learning-path`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills, goal })
    });
    if (!response.ok) throw new Error('Failed to generate path');
    return await response.json();
  },
  // Students
  async getStudents(): Promise<Student[]> {
    const response = await fetch(`${API_Base_URL}/students/`);
    if (!response.ok) return [];
    const users = await response.json();
    return users.map((u: any) => ({
      id: u.id,
      name: u.full_name,
      email: u.email,
      university: u.university,
      skills: u.skills,
      // Map other fields as needed or provide defaults
      matchScore: 0, verifiedSkills: 0, totalSkills: 0, topSkills: [], location: '', experience: '', major: '', gpa: 0, graduationYear: 0, certifications: [], projects: []
    }));
  },

  async getStudent(id: string): Promise<Student | null> {
    const response = await fetch(`${API_Base_URL}/students/${id}`);
    if (!response.ok) return null;
    const u = await response.json();
    return {
      id: u.id,
      name: u.full_name,
      email: u.email,
      university: u.university,
      skills: u.skills,
      // Defaults
      matchScore: 0, verifiedSkills: 0, totalSkills: 0, topSkills: [], location: '', experience: '', major: '', gpa: 0, graduationYear: 0, certifications: [], projects: []
    };
  },

  async searchStudents(query: string): Promise<Student[]> {
    const response = await fetch(`${API_Base_URL}/students/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) return [];
    const users = await response.json();
    return users.map((u: any) => ({
        id: u.id,
        name: u.full_name,
        email: u.email,
        university: u.university,
        skills: u.skills,
        matchScore: 0, verifiedSkills: 0, totalSkills: 0, topSkills: [], location: '', experience: '', major: '', gpa: 0, graduationYear: 0, certifications: [], projects: []
    }));
  },

  // Roles
  async getRoles(): Promise<Role[]> {
    const response = await fetch(`${API_Base_URL}/industry/roles`);
    if (!response.ok) return [];
    const roles = await response.json();
    return roles.map((r: any) => ({
        id: r.id,
        title: r.title,
        company: r.company_name,
        seniority: r.seniority || 'Mid-Level',
        industry: r.industry || 'Technology',
        requiredSkills: r.required_skills || [],
        preferredSkills: r.preferred_skills || [],
        experience: r.experience || `${r.min_experience_years} years`,
        location: r.location,
        salary: r.salary_range,
        description: r.description
    }));
  },

  async getRole(id: string): Promise<Role | null> {
    // We can fetch from list or implement specific endpoint if needed. 
    // industry.py doesn't have get_role single yet, but we can assume we can filter from list or add it.
    // For now, let's just fetch all and find.
    const roles = await this.getRoles();
    return roles.find(r => r.id === id) || null;
  },

  async createRole(role: any): Promise<any> {
    const response = await fetch(`${API_Base_URL}/industry/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(role)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create role');
    }
    return await response.json();
  },

  async getRoleApplications(roleId: string): Promise<any[]> {
    const response = await fetch(`${API_Base_URL}/industry/roles/${roleId}/applications`);
    if (!response.ok) return [];
    return await response.json();
  },

  async updateApplicationStatus(appId: string, status: string): Promise<any> {
    const response = await fetch(`${API_Base_URL}/industry/applications/${appId}/status?status=${status}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update status');
    }
    return await response.json();
  },

  // Matching
  async getMatchesForRole(roleId: string): Promise<Match[]> {
    const response = await fetch(`${API_Base_URL}/matches/roles/${roleId}`);
    if (!response.ok) return [];
    return await response.json();
  },

  async getMatchesForStudent(studentId: string): Promise<Match[]> {
      const response = await fetch(`${API_Base_URL}/matches/students/${studentId}`);
      if (!response.ok) return [];
      return await response.json();
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
    // In actual app, fetch from backend. For now, since mock DBs are empty, return empty stats.
    return {
      missingSkills: [],
      skillsToImprove: [],
      overallReadiness: 0,
      recommendedActions: []
    };
  },

  // Statistics
  async getSkillStatistics(): Promise<SkillStatistics[]> {
    // Return empty until backend implemented
    return [];
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
    // Return zeros until backend implemented
    return {
      totalStudents: 0,
      activeRoles: 0,
      matchesThisWeek: 0,
      avgMatchScore: 0,
      topSkills: [],
      recentMatches: [],
      matchTrend: [],
      skillDistribution: []
    };
  },

  async sendMessage(data: any): Promise<any> {
    try {
      const response = await fetch(`${API_Base_URL}/communication/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (e) {
      console.warn("Backend offline/error", e);
      return { status: "error", message: "Message service temporarily unavailable" };
    }
  },

  async scheduleInterview(data: any): Promise<any> {
    try {
      const response = await fetch(`${API_Base_URL}/communication/interview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (e) {
      console.warn("Backend offline/error", e);
      return { status: "error", message: "Interview scheduling temporarily unavailable" };
    }
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
