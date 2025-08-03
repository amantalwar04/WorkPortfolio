import { useState, useCallback } from 'react';
import { aiService } from '../services/ai';
import { AIAssistantResponse } from '../types';
import { showError, showSuccess, showLoading, dismissToast } from '../utils';

export interface UseAIReturn {
  loading: boolean;
  error: string | null;
  
  // Actions
  setApiKey: (apiKey: string) => void;
  improveProjectDescription: (
    description: string,
    projectName: string,
    technologies: string[]
  ) => Promise<AIAssistantResponse>;
  generateProfessionalBio: (userInfo: any) => Promise<AIAssistantResponse>;
  optimizeKeywords: (content: string, field: string) => Promise<AIAssistantResponse>;
  suggestSkills: (projects: any[], experience: any[]) => Promise<string[]>;
  optimizeResumeContent: (content: string, jobTitle: string) => Promise<AIAssistantResponse>;
  clearError: () => void;
}

export const useAI = (): UseAIReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Set AI API key
  const setApiKey = useCallback((apiKey: string) => {
    aiService.setApiKey(apiKey);
    localStorage.setItem('ai_api_key', apiKey);
    showSuccess('AI API key configured successfully!');
  }, []);
  
  // Improve project description
  const improveProjectDescription = useCallback(async (
    description: string,
    projectName: string,
    technologies: string[]
  ): Promise<AIAssistantResponse> => {
    const toastId = showLoading('AI is improving your project description...');
    setLoading(true);
    setError(null);
    
    try {
      const result = await aiService.improveProjectDescription(description, projectName, technologies);
      dismissToast(toastId);
      showSuccess('Project description improved!');
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to improve project description';
      setError(errorMessage);
      dismissToast(toastId);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Generate professional bio
  const generateProfessionalBio = useCallback(async (userInfo: any): Promise<AIAssistantResponse> => {
    const toastId = showLoading('AI is generating your professional bio...');
    setLoading(true);
    setError(null);
    
    try {
      const result = await aiService.generateProfessionalBio(userInfo);
      dismissToast(toastId);
      showSuccess('Professional bio generated!');
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate professional bio';
      setError(errorMessage);
      dismissToast(toastId);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Optimize keywords
  const optimizeKeywords = useCallback(async (
    content: string,
    field: string
  ): Promise<AIAssistantResponse> => {
    const toastId = showLoading('AI is optimizing keywords...');
    setLoading(true);
    setError(null);
    
    try {
      const result = await aiService.optimizeKeywords(content, field);
      dismissToast(toastId);
      showSuccess('Keywords optimized!');
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to optimize keywords';
      setError(errorMessage);
      dismissToast(toastId);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Suggest skills
  const suggestSkills = useCallback(async (
    projects: any[],
    experience: any[]
  ): Promise<string[]> => {
    const toastId = showLoading('AI is analyzing your experience for skill suggestions...');
    setLoading(true);
    setError(null);
    
    try {
      const skills = await aiService.suggestSkills(projects, experience);
      dismissToast(toastId);
      showSuccess(`Found ${skills.length} skill suggestions!`);
      return skills;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to suggest skills';
      setError(errorMessage);
      dismissToast(toastId);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Optimize resume content
  const optimizeResumeContent = useCallback(async (
    content: string,
    jobTitle: string
  ): Promise<AIAssistantResponse> => {
    const toastId = showLoading('AI is optimizing your resume content...');
    setLoading(true);
    setError(null);
    
    try {
      const result = await aiService.optimizeResumeContent(content, jobTitle);
      dismissToast(toastId);
      showSuccess('Resume content optimized for ATS!');
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to optimize resume content';
      setError(errorMessage);
      dismissToast(toastId);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  // Auto-load API key on mount
  useState(() => {
    const savedApiKey = localStorage.getItem('ai_api_key');
    if (savedApiKey) {
      aiService.setApiKey(savedApiKey);
    }
  });
  
  return {
    loading,
    error,
    setApiKey,
    improveProjectDescription,
    generateProfessionalBio,
    optimizeKeywords,
    suggestSkills,
    optimizeResumeContent,
    clearError,
  };
};