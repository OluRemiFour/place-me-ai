import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, X, Check, GraduationCap, Briefcase, Award, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';

interface Skill {
  name: string;
  level: number;
  category: string;
  verification_url?: string;
  certification_name?: string;
}

interface Education {
  institution: string;
  degree: string;
  major: string;
  gpa: string;
  graduationYear: string;
}

interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface Certification {
  title: string;
  issuer: string;
  year: string;
}

export function ProfileBuilder() {
  const navigate = useNavigate();
  const { user, checkProfileStatus, refreshUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State
  const [personalInfo, setPersonalInfo] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || ''
  });

  const [education, setEducation] = useState<Education[]>([
    { 
      institution: user?.university || '', 
      degree: 'bachelor', // default or infer?
      major: user?.major || '', 
      gpa: user?.gpa?.toString() || '', 
      graduationYear: user?.graduationYear?.toString() || '' 
    }
  ]);

  const [experience, setExperience] = useState<Experience[]>([
    { title: '', company: '', duration: '', description: '' }
  ]);

  // Transform user skills to builder format
  const initialSkills = user?.skills?.map(s => ({
      name: s.name,
      level: s.level || 50,
      category: s.category || 'Technical'
  })) || [];

  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [newSkill, setNewSkill] = useState<Skill>({ 
    name: '', 
    level: 50, 
    category: 'Technical',
    verification_url: '',
    certification_name: ''
  });

  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [newCert, setNewCert] = useState({ title: '', issuer: '', year: '' });

  const totalSteps = 5;
  const profileCompletion = Math.round(
    ((personalInfo.firstName ? 10 : 0) +
    (personalInfo.lastName ? 10 : 0) +
    (personalInfo.email ? 10 : 0) +
    (personalInfo.bio ? 10 : 0) +
    (education[0]?.institution ? 15 : 0) +
    (experience[0]?.title ? 15 : 0) +
    (skills.length > 0 ? 20 : 0) +
    (certifications.length > 0 ? 10 : 0))
  );

  const addEducation = () => {
    setEducation([...education, { institution: '', degree: '', major: '', gpa: '', graduationYear: '' }]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  const addExperience = () => {
    setExperience([...experience, { title: '', company: '', duration: '', description: '' }]);
  };

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };

  const addSkill = () => {
    if (newSkill.name) {
      setSkills([...skills, newSkill]);
      setNewSkill({ 
        name: '', 
        level: 50, 
        category: 'Technical',
        verification_url: '',
        certification_name: ''
      });
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addCertification = () => {
    if (newCert.title && newCert.issuer) {
      setCertifications([...certifications, newCert]);
      setNewCert({ title: '', issuer: '', year: '' });
    }
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      // Map frontend state to backend ProfileUpdate schema
      const profileData = {
        bio: personalInfo.bio,
        location: personalInfo.location,
        university: education[0]?.institution || '',
        major: education[0]?.major || '',
        gpa: parseFloat(education[0]?.gpa) || 0,
        graduation_year: parseInt(education[0]?.graduationYear) || 0,
        skills: skills.map(s => ({
            name: s.name,
            level: s.level,
            category: s.category,
            verification_url: s.verification_url,
            certification_name: s.certification_name
        }))
      };

      await api.updateProfile(user.id, profileData);
      
      // Update local state to close the modal
      await checkProfileStatus();
      await refreshUser();
      navigate('/dashboard');
    } catch (error) {
      console.error("Failed to save profile", error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-black text-white rounded-sm flex items-center justify-center">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Personal Information</h2>
                <p className="text-sm opacity-60">Tell us about yourself</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={personalInfo.firstName}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                  className="h-12"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={personalInfo.lastName}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                  className="h-12"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={personalInfo.email}
                onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                className="h-12"
                placeholder="john.doe@university.edu"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                  className="h-12"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={personalInfo.location}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                  className="h-12"
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Summary</Label>
              <Textarea
                id="bio"
                value={personalInfo.bio}
                onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                className="min-h-[120px]"
                placeholder="Write a brief summary about your professional background and career goals..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-black text-white rounded-sm flex items-center justify-center">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Education</h2>
                <p className="text-sm opacity-60">Add your academic background</p>
              </div>
            </div>

            {education.map((edu, index) => (
              <div key={index} className="border border-black rounded-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm opacity-60">Education #{index + 1}</span>
                  {education.length > 1 && (
                    <button onClick={() => removeEducation(index)} className="opacity-60 hover:opacity-100">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Institution</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    className="h-12"
                    placeholder="Stanford University"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Degree</Label>
                    <Select value={edu.degree} onValueChange={(value) => updateEducation(index, 'degree', value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select degree" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bachelor">Bachelor's</SelectItem>
                        <SelectItem value="master">Master's</SelectItem>
                        <SelectItem value="phd">Ph.D.</SelectItem>
                        <SelectItem value="associate">Associate's</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Major/Field of Study</Label>
                    <Input
                      value={edu.major}
                      onChange={(e) => updateEducation(index, 'major', e.target.value)}
                      className="h-12"
                      placeholder="Computer Science"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>GPA</Label>
                    <Input value={edu.gpa} onChange={(e) => updateEducation(index, 'gpa', e.target.value)} className="h-12" placeholder="3.8" />
                  </div>
                  <div className="space-y-2">
                    <Label>Graduation Year</Label>
                    <Input value={edu.graduationYear} onChange={(e) => updateEducation(index, 'graduationYear', e.target.value)} className="h-12" placeholder="2024" />
                  </div>
                </div>
              </div>
            ))}

            <Button variant="outline" className="w-full h-12 border-black border-dashed" onClick={addEducation}>
              <Plus className="h-4 w-4 mr-2" />
              Add Another Education
            </Button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-black text-white rounded-sm flex items-center justify-center">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Experience</h2>
                <p className="text-sm opacity-60">Add your work experience</p>
              </div>
            </div>

            {experience.map((exp, index) => (
              <div key={index} className="border border-black rounded-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm opacity-60">Experience #{index + 1}</span>
                  {experience.length > 1 && (
                    <button onClick={() => removeExperience(index)} className="opacity-60 hover:opacity-100">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Job Title</Label>
                    <Input value={exp.title} onChange={(e) => updateExperience(index, 'title', e.target.value)} className="h-12" placeholder="Software Engineer" />
                  </div>
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input value={exp.company} onChange={(e) => updateExperience(index, 'company', e.target.value)} className="h-12" placeholder="TechCorp Inc." />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input value={exp.duration} onChange={(e) => updateExperience(index, 'duration', e.target.value)} className="h-12" placeholder="Jan 2022 - Present" />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={exp.description} onChange={(e) => updateExperience(index, 'description', e.target.value)} className="min-h-[100px]" placeholder="Describe your responsibilities and achievements..." />
                </div>
              </div>
            ))}

            <Button variant="outline" className="w-full h-12 border-black border-dashed" onClick={addExperience}>
              <Plus className="h-4 w-4 mr-2" />
              Add Another Experience
            </Button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-black text-white rounded-sm flex items-center justify-center">
                <Code className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Skills</h2>
                <p className="text-sm opacity-60">Add your technical and soft skills</p>
              </div>
            </div>

            <div className="border border-black rounded-sm p-6 space-y-4">
              <h3 className="font-semibold">Add a Skill</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Skill Name</Label>
                  <Input value={newSkill.name} onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })} className="h-12" placeholder="React, Python, Leadership..." />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newSkill.category} onValueChange={(value) => setNewSkill({ ...newSkill, category: value })}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                      <SelectItem value="Languages">Languages</SelectItem>
                      <SelectItem value="Tools">Tools</SelectItem>
                      <SelectItem value="Academic">Academic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Proficiency Level</Label>
                  <span className="font-mono text-sm font-bold">{newSkill.level}%</span>
                </div>
                <input type="range" min="10" max="100" value={newSkill.level} onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Certification Name (Optional)</Label>
                  <Input 
                    value={newSkill.certification_name} 
                    onChange={(e) => setNewSkill({ ...newSkill, certification_name: e.target.value })} 
                    className="h-10" 
                    placeholder="e.g. AWS Certified Developer" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Certification Link (Optional)</Label>
                  <Input 
                    value={newSkill.verification_url} 
                    onChange={(e) => setNewSkill({ ...newSkill, verification_url: e.target.value })} 
                    className="h-10" 
                    placeholder="e.g. https://credly.com/..." 
                  />
                </div>
              </div>

              <Button onClick={addSkill} className="w-full h-10">
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>

            {skills.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Added Skills ({skills.length})</h3>
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-sm">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{skill.name}</span>
                        <Badge variant="outline" className="text-xs">{skill.category}</Badge>
                        {skill.verification_url && (
                          <Badge variant="secondary" className="text-[10px] bg-green-50 text-green-700 border-green-200">Certified</Badge>
                        )}
                      </div>
                      <Progress value={skill.level} className="h-1.5" />
                      {skill.certification_name && (
                        <p className="text-[10px] opacity-60 mt-1 italic">{skill.certification_name}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <span className="font-mono text-sm font-bold">{skill.level}%</span>
                      <button onClick={() => removeSkill(index)} className="opacity-60 hover:opacity-100">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-black text-white rounded-sm flex items-center justify-center">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Certifications</h2>
                <p className="text-sm opacity-60">Add your certifications and credentials</p>
              </div>
            </div>

            <div className="border border-black rounded-sm p-6 space-y-4">
              <h3 className="font-semibold">Add a Certification</h3>
              <div className="space-y-2">
                <Label>Certification Title</Label>
                <Input value={newCert.title} onChange={(e) => setNewCert({ ...newCert, title: e.target.value })} className="h-12" placeholder="AWS Solutions Architect" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Issuing Organization</Label>
                  <Input value={newCert.issuer} onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })} className="h-12" placeholder="Amazon Web Services" />
                </div>
                <div className="space-y-2">
                  <Label>Year Obtained</Label>
                  <Input value={newCert.year} onChange={(e) => setNewCert({ ...newCert, year: e.target.value })} className="h-12" placeholder="2024" />
                </div>
              </div>
              <Button onClick={addCertification} className="w-full h-10">
                <Plus className="h-4 w-4 mr-2" />
                Add Certification
              </Button>
            </div>

            {certifications.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Added Certifications ({certifications.length})</h3>
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-sm">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{cert.title}</span>
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-sm opacity-60">{cert.issuer} · {cert.year}</p>
                    </div>
                    <button onClick={() => removeCertification(index)} className="opacity-60 hover:opacity-100">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Build Your Profile</h1>
        <p className="text-sm opacity-60">Complete your profile to improve your match score</p>
      </div>

      <div className="border border-black rounded-sm p-6 bg-white mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm opacity-60">Profile Completion</span>
            <div className="font-mono text-2xl font-bold">{profileCompletion}%</div>
          </div>
          <div className="text-right">
            <span className="text-sm opacity-60">Step</span>
            <div className="font-mono text-2xl font-bold">{currentStep}/{totalSteps}</div>
          </div>
        </div>
        <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        
        <div className="flex justify-between mt-4">
          {['Personal', 'Education', 'Experience', 'Skills', 'Certifications'].map((step, idx) => (
            <button key={step} onClick={() => setCurrentStep(idx + 1)} className={`text-xs font-medium ${currentStep === idx + 1 ? 'opacity-100' : 'opacity-40'}`}>
              {step}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-black rounded-sm p-8 bg-white mb-8">
        {renderStep()}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" className="h-12 px-8 border-black" onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1}>
          Previous
        </Button>

        {currentStep < totalSteps ? (
          <Button className="h-12 px-8" onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}>
            Next Step
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        ) : (
          <Button className="h-12 px-8" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Complete Profile'}
            <Check className="ml-2 h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
