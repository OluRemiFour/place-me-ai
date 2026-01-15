// Mock API Service - simulates backend API calls
// In production, replace with actual API endpoints

export interface Student {
  id: string;
  name: string;
  email: string;
  matchScore: number;
  certifiedSkills: number;
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
export function calculateReadinessScore(skills: SkillDetail[] = [], isProfileComplete: boolean = false): number {
  const certifiedCount = skills.filter(s => s.verified).length;
  const profileBonus = isProfileComplete ? 20 : 5;
  const skillScore = Math.min(60, (skills.length || 0) * 5);
  const certificationBonus = certifiedCount * 10;
  return Math.min(100, profileBonus + skillScore + certificationBonus);
}

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
    const data = await response.json();
    
    // Map backend fields to frontend interface if they differ
    if (data.graduation_year !== undefined) {
        data.graduationYear = data.graduation_year;
    }
    
    return data;
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

  async analyzeSkillGap(currentSkills: string[], targetRole: string, major: string): Promise<any> {
    try {
        const response = await fetch(`${API_Base_URL}/skills/gap-analysis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ current_skills: currentSkills, target_role: targetRole, major })
        });
        if (!response.ok) throw new Error('Analysis failed');
        return await response.json();
    } catch (e) {
        console.error(e);
        return { missing_skills: [], action_plan: [], recommendations: [] };
    }
  },

  async verifySkill(skillName: string, evidenceUrl?: string): Promise<any> {
    try {
        const response = await fetch(`${API_Base_URL}/skills/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skill_name: skillName, evidence_url: evidenceUrl })
        });
        return await response.json();
    } catch (e) {
        console.error(e);
        return { status: 'error' };
    }
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
    return users.map((u: any) => {
      const skills = u.skills || [];
      const certifiedCount = skills.filter((s: any) => s.verified).length;
      return {
        id: u.id,
        name: u.full_name || u.name,
        email: u.email,
        university: u.university || '',
        major: u.major || '',
        location: u.location || '',
        experience: u.experience || 'Entry Level',
        matchScore: calculateReadinessScore(skills, !!(u.university && u.major)),
        certifiedSkills: certifiedCount,
        totalSkills: skills.length,
        topSkills: skills.slice(0, 3).map((s: any) => s.name),
        skills: skills,
        gpa: u.gpa || 0,
        graduationYear: u.graduation_year || 0,
        certifications: u.certifications || [],
        projects: u.projects || []
      };
    });
  },

  async getStudent(id: string): Promise<Student | null> {
    try {
        const response = await fetch(`${API_Base_URL}/students/${id}`);
        if (!response.ok) return null;
        const u = await response.json();
        
        // Calculate derived stats
        const skills = u.skills || [];
        const certifiedCount = skills.filter((s: any) => s.verified).length;
        const totalSkills = skills.length;
        // Unify readiness score
        const matchScore = calculateReadinessScore(skills, !!(u.university && u.major && u.bio)); 

        return {
          id: u.id,
          name: u.full_name || u.name,
          email: u.email,
          university: u.university || 'University not set',
          major: u.major || 'Major not set',
          gpa: u.gpa || 0,
          graduationYear: u.graduation_year || 2025,
          location: u.location || 'Location not set',
          experience: u.experience || 'No experience listed',
          skills: skills,
          matchScore: matchScore, 
          certifiedSkills: certifiedCount, 
          totalSkills: totalSkills, 
          topSkills: skills.slice(0, 5).map((s: any) => s.name),
          certifications: u.certifications || [],
          projects: u.projects || []
        };
    } catch (e) {
        console.error(e);
        return null; // Handle error gracefully
    }
  },

  async searchStudents(query: string): Promise<Student[]> {
    const response = await fetch(`${API_Base_URL}/students/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) return [];
    const users = await response.json();
    return users.map((u: any) => {
      const skills = u.skills || [];
      const certifiedCount = skills.filter((s: any) => s.verified).length;
      return {
        id: u.id,
        name: u.full_name || u.name,
        email: u.email,
        university: u.university || '',
        major: u.major || '',
        location: u.location || '',
        experience: u.experience || 'Entry Level',
        matchScore: calculateReadinessScore(skills, !!(u.university && u.major)),
        certifiedSkills: certifiedCount,
        totalSkills: skills.length,
        topSkills: skills.slice(0, 3).map((s: any) => s.name),
        skills: skills,
        gpa: u.gpa || 0,
        graduationYear: u.graduation_year || 0,
        certifications: u.certifications || [],
        projects: u.projects || []
      };
    });
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



  // Statistics
  async getSkillStatistics(): Promise<SkillStatistics[]> {
    // Return empty until backend implemented
    return [];
  },

  async getDashboardMetrics(): Promise<any> {
    const response = await fetch(`${API_Base_URL}/industry/dashboard-metrics`);
    if (!response.ok) {
        return {
          totalStudents: 0,
          activeRoles: 0,
          matchesThisWeek: 0,
          avgMatchScore: 0,
          topSkills: [],
          recentMatches: [],
          matchTrend: [],
          skillDistribution: [],
          hiringPipeline: { applied: 0, message: 0, interviewing: 0, offers: 0 },
          recentActivity: []
        };
    }
    return await response.json();
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
  },

  async applyForRole(roleId: string, studentId: string, message?: string): Promise<any> {
    try {
      const response = await fetch(`${API_Base_URL}/communication/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role_id: roleId, student_id: studentId, message })
      });
      return await response.json();
    } catch (e) {
      console.warn("Backend offline/error", e);
      return { status: "error", message: "Application service temporarily unavailable" };
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
