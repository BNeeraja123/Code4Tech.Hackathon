export interface JobDescription {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  mustHaveSkills: string[];
  goodToHaveSkills: string[];
  qualifications: string[];
  experience: string;
  uploadedBy: string;
  createdAt: string;
  status: 'active' | 'paused' | 'closed';
}

export interface Resume {
  id: string;
  fileName: string;
  studentName: string;
  email: string;
  phone: string;
  location: string;
  uploadedAt: string;
  fileSize: number;
  skills: string[];
  experience: string;
  education: string;
  projects: string[];
  certifications: string[];
}

export interface RelevanceResult {
  id: string;
  resumeId: string;
  jobId: string;
  relevanceScore: number;
  verdict: 'High' | 'Medium' | 'Low';
  hardMatchScore: number;
  semanticMatchScore: number;
  missingSkills: string[];
  matchedSkills: string[];
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  analyzedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'placement_team' | 'student' | 'admin';
  location: string;
}