/**
 * Tipos para resume.json (JSON Resume schema)
 * Basado en: https://jsonresume.org/schema/
 */

export interface ResumeProject {
  name: string;
  description?: string;
  highlights?: string[];
  startDate?: string;
  endDate?: string;
  url?: string;
  published?: boolean;
  keywords?: string[];
  // Custom extensions for portfolio
  type?: string;
  technologies?: string[];
  githubUrl?: string;
  image?: string;
  features?: string[];
  role?: string;
  complexity?: string;
}

export interface ResumeStudy {
  name?: string;
  studyType?: string;
  startDate?: string;
  endDate?: string;
  completed?: boolean;
}

export interface ResumeWork {
  name?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
  keywords?: string[];
}

export interface ResumeSkill {
  name?: string;
  level?: string;
  keywords?: string[];
}

export interface ResumeProfile {
  network: string;
  username?: string;
  url: string;
}

export interface ResumeBasics {
  name: string;
  label?: string;
  image?: string;
  email?: string;
  phone?: string;
  url?: string;
  summary?: string;
  location?: {
    address?: string;
    city?: string;
    countryCode?: string;
    region?: string;
  };
  profiles: ResumeProfile[];
}

export interface ResumeCertificate {
  name?: string;
  issuer?: string;
  startDate?: string;
  url?: string;
}

export interface ResumeEducation {
  institution?: string;
  area?: string;
  studyType?: string;
  startDate?: string;
  endDate?: string;
  score?: string;
  courses?: string[];
}

export interface Resume {
  basics: ResumeBasics;
  work?: ResumeWork[];
  projects: ResumeProject[];
  skills?: ResumeSkill[];
  education?: ResumeEducation[];
  studies: ResumeStudy[];
  certificates?: ResumeCertificate[];
}
