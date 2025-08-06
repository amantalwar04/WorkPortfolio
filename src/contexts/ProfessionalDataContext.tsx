/**
 * Professional Data Context
 * Shared data store for portfolio and resume generation
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ProfessionalPortfolioData, Experience, Education, Skill, Project, Certificate, Language, EnhancedExperience, EnhancedSkill, EnhancedProject } from '../types';
import DocumentParserService, { DocumentParseResult } from '../services/documentParser';

// Initial state
const initialData: ProfessionalPortfolioData = {
  personalInfo: {
    fullName: '',
    title: '',
    location: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    whatsapp: '',
    avatar: '',
    website: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  theme: {
    primaryColor: '#2563eb',
    secondaryColor: '#7c3aed',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#f59e0b',
    fontFamily: 'Inter, sans-serif',
    template: 'executive',
  },
};

// Action types
type DataAction =
  | { type: 'SET_PERSONAL_INFO'; payload: Partial<ProfessionalPortfolioData['personalInfo']> }
  | { type: 'SET_SUMMARY'; payload: string }
  | { type: 'SET_EXPERIENCE'; payload: EnhancedExperience[] }
  | { type: 'ADD_EXPERIENCE'; payload: EnhancedExperience }
  | { type: 'UPDATE_EXPERIENCE'; payload: { id: string; data: Partial<EnhancedExperience> } }
  | { type: 'DELETE_EXPERIENCE'; payload: string }
  | { type: 'SET_EDUCATION'; payload: Education[] }
  | { type: 'ADD_EDUCATION'; payload: Education }
  | { type: 'UPDATE_EDUCATION'; payload: { id: string; data: Partial<Education> } }
  | { type: 'DELETE_EDUCATION'; payload: string }
  | { type: 'SET_SKILLS'; payload: EnhancedSkill[] }
  | { type: 'ADD_SKILL'; payload: EnhancedSkill }
  | { type: 'UPDATE_SKILL'; payload: { id: string; data: Partial<EnhancedSkill> } }
  | { type: 'DELETE_SKILL'; payload: string }
  | { type: 'SET_PROJECTS'; payload: EnhancedProject[] }
  | { type: 'ADD_PROJECT'; payload: EnhancedProject }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; data: Partial<EnhancedProject> } }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'SET_CERTIFICATIONS'; payload: Certificate[] }
  | { type: 'ADD_CERTIFICATION'; payload: Certificate }
  | { type: 'UPDATE_CERTIFICATION'; payload: { id: string; data: Partial<Certificate> } }
  | { type: 'DELETE_CERTIFICATION'; payload: string }
  | { type: 'SET_LANGUAGES'; payload: Language[] }
  | { type: 'ADD_LANGUAGE'; payload: Language }
  | { type: 'UPDATE_LANGUAGE'; payload: { id: string; data: Partial<Language> } }
  | { type: 'DELETE_LANGUAGE'; payload: string }
  | { type: 'SET_THEME'; payload: Partial<ProfessionalPortfolioData['theme']> }
  | { type: 'IMPORT_DATA'; payload: Partial<ProfessionalPortfolioData> }
  | { type: 'RESET_DATA' }
  | { type: 'LOAD_SAVED_DATA'; payload: ProfessionalPortfolioData };

// Reducer
function dataReducer(state: ProfessionalPortfolioData, action: DataAction): ProfessionalPortfolioData {
  switch (action.type) {
    case 'SET_PERSONAL_INFO':
      return {
        ...state,
        personalInfo: { ...state.personalInfo, ...action.payload },
      };

    case 'SET_SUMMARY':
      return { ...state, summary: action.payload };

    case 'SET_EXPERIENCE':
      return { ...state, experience: action.payload };

    case 'ADD_EXPERIENCE':
      return { ...state, experience: [...state.experience, action.payload] };

    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        experience: state.experience.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        ),
      };

    case 'DELETE_EXPERIENCE':
      return {
        ...state,
        experience: state.experience.filter(item => item.id !== action.payload),
      };

    case 'SET_EDUCATION':
      return { ...state, education: action.payload };

    case 'ADD_EDUCATION':
      return { ...state, education: [...state.education, action.payload] };

    case 'UPDATE_EDUCATION':
      return {
        ...state,
        education: state.education.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        ),
      };

    case 'DELETE_EDUCATION':
      return {
        ...state,
        education: state.education.filter(item => item.id !== action.payload),
      };

    case 'SET_SKILLS':
      return { ...state, skills: action.payload };

    case 'ADD_SKILL':
      return { ...state, skills: [...state.skills, action.payload] };

    case 'UPDATE_SKILL':
      return {
        ...state,
        skills: state.skills.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        ),
      };

    case 'DELETE_SKILL':
      return {
        ...state,
        skills: state.skills.filter(item => item.id !== action.payload),
      };

    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };

    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };

    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        ),
      };

    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(item => item.id !== action.payload),
      };

    case 'SET_CERTIFICATIONS':
      return { ...state, certifications: action.payload };

    case 'ADD_CERTIFICATION':
      return { ...state, certifications: [...state.certifications, action.payload] };

    case 'UPDATE_CERTIFICATION':
      return {
        ...state,
        certifications: state.certifications.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        ),
      };

    case 'DELETE_CERTIFICATION':
      return {
        ...state,
        certifications: state.certifications.filter(item => item.id !== action.payload),
      };

    case 'SET_LANGUAGES':
      return { ...state, languages: action.payload };

    case 'ADD_LANGUAGE':
      return { ...state, languages: [...state.languages, action.payload] };

    case 'UPDATE_LANGUAGE':
      return {
        ...state,
        languages: state.languages.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        ),
      };

    case 'DELETE_LANGUAGE':
      return {
        ...state,
        languages: state.languages.filter(item => item.id !== action.payload),
      };

    case 'SET_THEME':
      return { ...state, theme: { ...state.theme, ...action.payload } };

    case 'IMPORT_DATA':
      return {
        ...state,
        ...action.payload,
        personalInfo: { ...state.personalInfo, ...action.payload.personalInfo },
        theme: { ...state.theme, ...action.payload.theme },
      };

    case 'RESET_DATA':
      return { ...initialData };

    case 'LOAD_SAVED_DATA':
      return action.payload;

    default:
      return state;
  }
}

// Context interface
interface ProfessionalDataContextType {
  data: ProfessionalPortfolioData;
  
  // Personal Info actions
  updatePersonalInfo: (info: Partial<ProfessionalPortfolioData['personalInfo']>) => void;
  setSummary: (summary: string) => void;
  
  // Experience actions
  addExperience: (experience: EnhancedExperience) => void;
  updateExperience: (id: string, updates: Partial<EnhancedExperience>) => void;
  deleteExperience: (id: string) => void;
  setExperience: (experience: EnhancedExperience[]) => void;
  
  // Education actions
  addEducation: (education: Education) => void;
  updateEducation: (id: string, updates: Partial<Education>) => void;
  deleteEducation: (id: string) => void;
  setEducation: (education: Education[]) => void;
  
  // Skills actions
  addSkill: (skill: EnhancedSkill) => void;
  updateSkill: (id: string, updates: Partial<EnhancedSkill>) => void;
  deleteSkill: (id: string) => void;
  setSkills: (skills: EnhancedSkill[]) => void;
  
  // Projects actions
  addProject: (project: EnhancedProject) => void;
  updateProject: (id: string, updates: Partial<EnhancedProject>) => void;
  deleteProject: (id: string) => void;
  setProjects: (projects: EnhancedProject[]) => void;
  
  // Certifications actions
  addCertification: (certification: Certificate) => void;
  updateCertification: (id: string, updates: Partial<Certificate>) => void;
  deleteCertification: (id: string) => void;
  setCertifications: (certifications: Certificate[]) => void;
  
  // Languages actions
  addLanguage: (language: Language) => void;
  updateLanguage: (id: string, updates: Partial<Language>) => void;
  deleteLanguage: (id: string) => void;
  setLanguages: (languages: Language[]) => void;
  
  // Theme actions
  updateTheme: (theme: Partial<ProfessionalPortfolioData['theme']>) => void;
  
  // Document import
  importDocument: (file: File) => Promise<DocumentParseResult>;
  importData: (data: Partial<ProfessionalPortfolioData>) => void;
  
  // Data management
  resetData: () => void;
  saveData: () => void;
  loadData: () => void;
  exportData: () => ProfessionalPortfolioData;
  
  // Helper methods
  hasData: () => boolean;
  getCompletionPercentage: () => number;
}

// Create context
const ProfessionalDataContext = createContext<ProfessionalDataContextType | undefined>(undefined);

// Provider component
interface ProfessionalDataProviderProps {
  children: ReactNode;
}

export const ProfessionalDataProvider: React.FC<ProfessionalDataProviderProps> = ({ children }) => {
  const [data, dispatch] = useReducer(dataReducer, initialData);

  // Load saved data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Auto-save when data changes
  useEffect(() => {
    if (hasData()) {
      const timeoutId = setTimeout(() => {
        saveData();
      }, 1000); // Debounce saves

      return () => clearTimeout(timeoutId);
    }
  }, [data]);

  // Personal Info actions
  const updatePersonalInfo = (info: Partial<ProfessionalPortfolioData['personalInfo']>) => {
    dispatch({ type: 'SET_PERSONAL_INFO', payload: info });
  };

  const setSummary = (summary: string) => {
    dispatch({ type: 'SET_SUMMARY', payload: summary });
  };

  // Experience actions
  const addExperience = (experience: EnhancedExperience) => {
    dispatch({ type: 'ADD_EXPERIENCE', payload: experience });
  };

  const updateExperience = (id: string, updates: Partial<EnhancedExperience>) => {
    dispatch({ type: 'UPDATE_EXPERIENCE', payload: { id, data: updates } });
  };

  const deleteExperience = (id: string) => {
    dispatch({ type: 'DELETE_EXPERIENCE', payload: id });
  };

  const setExperience = (experience: EnhancedExperience[]) => {
    dispatch({ type: 'SET_EXPERIENCE', payload: experience });
  };

  // Education actions
  const addEducation = (education: Education) => {
    dispatch({ type: 'ADD_EDUCATION', payload: education });
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    dispatch({ type: 'UPDATE_EDUCATION', payload: { id, data: updates } });
  };

  const deleteEducation = (id: string) => {
    dispatch({ type: 'DELETE_EDUCATION', payload: id });
  };

  const setEducation = (education: Education[]) => {
    dispatch({ type: 'SET_EDUCATION', payload: education });
  };

  // Skills actions
  const addSkill = (skill: EnhancedSkill) => {
    dispatch({ type: 'ADD_SKILL', payload: skill });
  };

  const updateSkill = (id: string, updates: Partial<EnhancedSkill>) => {
    dispatch({ type: 'UPDATE_SKILL', payload: { id, data: updates } });
  };

  const deleteSkill = (id: string) => {
    dispatch({ type: 'DELETE_SKILL', payload: id });
  };

  const setSkills = (skills: EnhancedSkill[]) => {
    dispatch({ type: 'SET_SKILLS', payload: skills });
  };

  // Projects actions
  const addProject = (project: EnhancedProject) => {
    dispatch({ type: 'ADD_PROJECT', payload: project });
  };

  const updateProject = (id: string, updates: Partial<EnhancedProject>) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: { id, data: updates } });
  };

  const deleteProject = (id: string) => {
    dispatch({ type: 'DELETE_PROJECT', payload: id });
  };

  const setProjects = (projects: EnhancedProject[]) => {
    dispatch({ type: 'SET_PROJECTS', payload: projects });
  };

  // Certifications actions
  const addCertification = (certification: Certificate) => {
    dispatch({ type: 'ADD_CERTIFICATION', payload: certification });
  };

  const updateCertification = (id: string, updates: Partial<Certificate>) => {
    dispatch({ type: 'UPDATE_CERTIFICATION', payload: { id, data: updates } });
  };

  const deleteCertification = (id: string) => {
    dispatch({ type: 'DELETE_CERTIFICATION', payload: id });
  };

  const setCertifications = (certifications: Certificate[]) => {
    dispatch({ type: 'SET_CERTIFICATIONS', payload: certifications });
  };

  // Languages actions
  const addLanguage = (language: Language) => {
    dispatch({ type: 'ADD_LANGUAGE', payload: language });
  };

  const updateLanguage = (id: string, updates: Partial<Language>) => {
    dispatch({ type: 'UPDATE_LANGUAGE', payload: { id, data: updates } });
  };

  const deleteLanguage = (id: string) => {
    dispatch({ type: 'DELETE_LANGUAGE', payload: id });
  };

  const setLanguages = (languages: Language[]) => {
    dispatch({ type: 'SET_LANGUAGES', payload: languages });
  };

  // Theme actions
  const updateTheme = (theme: Partial<ProfessionalPortfolioData['theme']>) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  // Document import
  const importDocument = async (file: File): Promise<DocumentParseResult> => {
    const result = await DocumentParserService.parseDocument(file);
    
    if (result.success && result.extractedData) {
      dispatch({ type: 'IMPORT_DATA', payload: result.extractedData });
    }
    
    return result;
  };

  const importData = (importedData: Partial<ProfessionalPortfolioData>) => {
    dispatch({ type: 'IMPORT_DATA', payload: importedData });
  };

  // Data management
  const resetData = () => {
    dispatch({ type: 'RESET_DATA' });
    localStorage.removeItem('professionalData');
  };

  const saveData = () => {
    try {
      localStorage.setItem('professionalData', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save data to localStorage:', error);
    }
  };

  const loadData = () => {
    try {
      const savedData = localStorage.getItem('professionalData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_SAVED_DATA', payload: parsedData });
      }
    } catch (error) {
      console.warn('Failed to load data from localStorage:', error);
    }
  };

  const exportData = (): ProfessionalPortfolioData => {
    return data;
  };

  // Helper methods
  const hasData = (): boolean => {
    return !!(
      data.personalInfo.fullName ||
      data.personalInfo.email ||
      data.summary ||
      data.experience.length > 0 ||
      data.education.length > 0 ||
      data.skills.length > 0
    );
  };

  const getCompletionPercentage = (): number => {
    let completed = 0;
    const totalSections = 6;

    // Personal info (required: name, email)
    if (data.personalInfo.fullName && data.personalInfo.email) completed++;
    
    // Summary
    if (data.summary && data.summary.length > 50) completed++;
    
    // Experience
    if (data.experience.length > 0) completed++;
    
    // Education
    if (data.education.length > 0) completed++;
    
    // Skills
    if (data.skills.length > 0) completed++;
    
    // Projects or certifications
    if (data.projects.length > 0 || data.certifications.length > 0) completed++;

    return Math.round((completed / totalSections) * 100);
  };

  const contextValue: ProfessionalDataContextType = {
    data,
    updatePersonalInfo,
    setSummary,
    addExperience,
    updateExperience,
    deleteExperience,
    setExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    setEducation,
    addSkill,
    updateSkill,
    deleteSkill,
    setSkills,
    addProject,
    updateProject,
    deleteProject,
    setProjects,
    addCertification,
    updateCertification,
    deleteCertification,
    setCertifications,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    setLanguages,
    updateTheme,
    importDocument,
    importData,
    resetData,
    saveData,
    loadData,
    exportData,
    hasData,
    getCompletionPercentage,
  };

  return (
    <ProfessionalDataContext.Provider value={contextValue}>
      {children}
    </ProfessionalDataContext.Provider>
  );
};

// Hook to use the context
export const useProfessionalData = (): ProfessionalDataContextType => {
  const context = useContext(ProfessionalDataContext);
  if (context === undefined) {
    throw new Error('useProfessionalData must be used within a ProfessionalDataProvider');
  }
  return context;
};

export default ProfessionalDataContext;