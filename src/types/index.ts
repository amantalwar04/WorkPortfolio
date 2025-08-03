// Core Types for Portfolio Generator Application

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  blog?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  whatsapp?: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description?: string;
  html_url: string;
  homepage?: string;
  language?: string;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  topics: string[];
  size: number;
  default_branch: string;
  archived: boolean;
  fork: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  github_url?: string;
  live_url?: string;
  image?: string;
  featured: boolean;
  category: ProjectCategory;
  start_date?: string;
  end_date?: string;
  status: ProjectStatus;
  collaborators?: string[];
}

export type ProjectCategory = 'web' | 'mobile' | 'desktop' | 'ml' | 'data' | 'other';
export type ProjectStatus = 'completed' | 'in-progress' | 'planned' | 'archived';

export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  location?: string;
  skills: string[];
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  description?: string;
  achievements: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  years?: number;
  certified?: boolean;
}

export type SkillCategory = 'programming' | 'framework' | 'tool' | 'soft' | 'language' | 'other';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Portfolio {
  id: string;
  user: User;
  theme: PortfolioTheme;
  sections: PortfolioSection[];
  seo: SEOSettings;
  contact: ContactSettings;
  social: SocialLinks;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  customDomain?: string;
}

export interface PortfolioTheme {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  layout: 'modern' | 'classic' | 'minimal' | 'creative';
  darkMode: boolean;
}

export interface PortfolioSection {
  id: string;
  type: SectionType;
  title: string;
  order: number;
  visible: boolean;
  data: any;
}

export type SectionType = 
  | 'hero' 
  | 'about' 
  | 'experience' 
  | 'education' 
  | 'projects' 
  | 'skills' 
  | 'certificates' 
  | 'contact' 
  | 'testimonials' 
  | 'blog';

export interface SEOSettings {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
}

export interface ContactSettings {
  email: string;
  phone?: string;
  whatsapp?: string;
  showForm: boolean;
  formEndpoint?: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  behance?: string;
  dribbble?: string;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  preview: string;
  category: 'modern' | 'classic' | 'creative' | 'ats-friendly';
  fields: ResumeField[];
}

export interface ResumeField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'array' | 'object';
  required: boolean;
  placeholder?: string;
}

export interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  headline?: string;
  summary?: string;
  location?: string;
  industry?: string;
  positions?: LinkedInPosition[];
  educations?: LinkedInEducation[];
  skills?: string[];
}

export interface LinkedInPosition {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  location?: string;
}

export interface LinkedInEducation {
  id: string;
  school: string;
  degree?: string;
  field?: string;
  startDate: string;
  endDate?: string;
}

export interface AIAssistantRequest {
  type: 'improve-description' | 'generate-summary' | 'optimize-keywords' | 'write-bio' | 'suggest-skills';
  content: string;
  context?: any;
}

export interface AIAssistantResponse {
  original: string;
  improved: string;
  suggestions: string[];
  confidence: number;
}

export interface AppState {
  user: User | null;
  portfolio: Portfolio | null;
  repositories: GitHubRepository[];
  linkedinProfile: LinkedInProfile | null;
  loading: boolean;
  error: string | null;
}