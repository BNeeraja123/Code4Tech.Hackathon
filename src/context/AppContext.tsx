import React, { createContext, useContext, useState, useEffect } from 'react';
import { JobDescription, Resume, RelevanceResult, User } from '../types';

interface AppContextType {
  user: User | null;
  jobDescriptions: JobDescription[];
  resumes: Resume[];
  results: RelevanceResult[];
  addJobDescription: (job: Omit<JobDescription, 'id' | 'createdAt'>) => void;
  addResume: (resume: Omit<Resume, 'id' | 'uploadedAt'>) => void;
  analyzeResume: (resumeId: string, jobId: string) => void;
  setUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [results, setResults] = useState<RelevanceResult[]>([]);

  useEffect(() => {
    // Load mock data
    const mockJobs: JobDescription[] = [
      {
        id: '1',
        title: 'Data Scientist',
        company: 'TechCorp India',
        location: 'Hyderabad',
        description: 'Looking for a Data Scientist with expertise in machine learning, Python, and statistical analysis.',
        mustHaveSkills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Pandas'],
        goodToHaveSkills: ['TensorFlow', 'PyTorch', 'AWS', 'Docker', 'Kubernetes'],
        qualifications: ['B.Tech/M.Tech in CS/IT', 'Statistics/Mathematics background'],
        experience: '2-4 years',
        uploadedBy: 'Placement Team Hyderabad',
        createdAt: '2024-01-15T10:00:00Z',
        status: 'active'
      },
      {
        id: '2',
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        location: 'Bangalore',
        description: 'Full stack developer role with React, Node.js, and cloud technologies.',
        mustHaveSkills: ['React', 'Node.js', 'JavaScript', 'MongoDB', 'Express'],
        goodToHaveSkills: ['TypeScript', 'Next.js', 'AWS', 'Redis', 'GraphQL'],
        qualifications: ['B.Tech/B.E in Computer Science'],
        experience: '1-3 years',
        uploadedBy: 'Placement Team Bangalore',
        createdAt: '2024-01-16T09:30:00Z',
        status: 'active'
      }
    ];

    setJobDescriptions(mockJobs);
    
    // Set default user
    setUser({
      id: '1',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@innomatics.in',
      role: 'placement_team',
      location: 'Hyderabad'
    });
  }, []);

  const addJobDescription = (job: Omit<JobDescription, 'id' | 'createdAt'>) => {
    const newJob: JobDescription = {
      ...job,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setJobDescriptions(prev => [...prev, newJob]);
  };

  const addResume = (resume: Omit<Resume, 'id' | 'uploadedAt'>) => {
    const newResume: Resume = {
      ...resume,
      id: Date.now().toString(),
      uploadedAt: new Date().toISOString()
    };
    setResumes(prev => [...prev, newResume]);
  };

  const analyzeResume = (resumeId: string, jobId: string) => {
    // Simulate AI analysis
    const resume = resumes.find(r => r.id === resumeId);
    const job = jobDescriptions.find(j => j.id === jobId);
    
    if (!resume || !job) return;

    // Mock analysis logic
    const matchedSkills = resume.skills.filter(skill => 
      job.mustHaveSkills.includes(skill) || job.goodToHaveSkills.includes(skill)
    );
    
    const missingSkills = job.mustHaveSkills.filter(skill => 
      !resume.skills.includes(skill)
    );

    const hardMatchScore = Math.min(90, (matchedSkills.length / job.mustHaveSkills.length) * 70 + 20);
    const semanticMatchScore = Math.random() * 30 + 60; // Mock semantic score
    const relevanceScore = Math.round((hardMatchScore * 0.6 + semanticMatchScore * 0.4));

    const verdict: 'High' | 'Medium' | 'Low' = 
      relevanceScore >= 80 ? 'High' : 
      relevanceScore >= 60 ? 'Medium' : 'Low';

    const result: RelevanceResult = {
      id: Date.now().toString(),
      resumeId,
      jobId,
      relevanceScore,
      verdict,
      hardMatchScore: Math.round(hardMatchScore),
      semanticMatchScore: Math.round(semanticMatchScore),
      matchedSkills,
      missingSkills,
      strengths: matchedSkills.slice(0, 3),
      weaknesses: missingSkills.slice(0, 2),
      suggestions: [
        `Consider adding ${missingSkills[0]} to your skillset`,
        'Add more relevant project experience',
        'Get certified in cloud technologies'
      ].filter(Boolean),
      analyzedAt: new Date().toISOString()
    };

    setResults(prev => [...prev, result]);
  };

  return (
    <AppContext.Provider value={{
      user,
      jobDescriptions,
      resumes,
      results,
      addJobDescription,
      addResume,
      analyzeResume,
      setUser
    }}>
      {children}
    </AppContext.Provider>
  );
};