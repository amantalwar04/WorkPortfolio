import { useState, useCallback } from 'react';
import { resumeService, ResumeTemplate } from '../services/resume';
import { ResumeData } from '../types';
import { showError, showSuccess, showLoading, dismissToast } from '../utils';

export interface UseResumeReturn {
  templates: ResumeTemplate[];
  loading: boolean;
  error: string | null;
  
  // Actions
  generateHTMLResume: (data: ResumeData, templateId: string) => string;
  generatePDFFromData: (data: ResumeData, templateId: string, filename: string) => Promise<Blob>;
  generatePDFFromElement: (element: HTMLElement, filename: string) => Promise<Blob>;
  downloadPDF: (blob: Blob, filename: string) => void;
  previewResume: (data: ResumeData, templateId: string) => string;
  clearError: () => void;
}

export const useResume = (): UseResumeReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const templates = resumeService.getTemplates();
  
  // Generate HTML resume
  const generateHTMLResume = useCallback((data: ResumeData, templateId: string): string => {
    try {
      return resumeService.generateHTMLResume(data, templateId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate HTML resume';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    }
  }, []);
  
  // Generate PDF from data
  const generatePDFFromData = useCallback(async (
    data: ResumeData,
    templateId: string,
    filename: string
  ): Promise<Blob> => {
    const toastId = showLoading('Generating PDF resume...');
    setLoading(true);
    setError(null);
    
    try {
      const blob = await resumeService.generatePDFFromData(data, templateId, filename);
      dismissToast(toastId);
      showSuccess('PDF resume generated successfully!');
      return blob;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate PDF resume';
      setError(errorMessage);
      dismissToast(toastId);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Generate PDF from element
  const generatePDFFromElement = useCallback(async (
    element: HTMLElement,
    filename: string
  ): Promise<Blob> => {
    const toastId = showLoading('Converting to PDF...');
    setLoading(true);
    setError(null);
    
    try {
      const blob = await resumeService.generatePDFFromElement(element, filename);
      dismissToast(toastId);
      showSuccess('PDF generated successfully!');
      return blob;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate PDF';
      setError(errorMessage);
      dismissToast(toastId);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Download PDF
  const downloadPDF = useCallback((blob: Blob, filename: string): void => {
    try {
      resumeService.downloadPDF(blob, filename);
      showSuccess('Resume downloaded successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download PDF';
      setError(errorMessage);
      showError(errorMessage);
    }
  }, []);
  
  // Preview resume (for real-time editing)
  const previewResume = useCallback((data: ResumeData, templateId: string): string => {
    try {
      return resumeService.generateHTMLResume(data, templateId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate resume preview';
      showError(errorMessage);
      return '<div>Error generating preview</div>';
    }
  }, []);
  
  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return {
    templates,
    loading,
    error,
    generateHTMLResume,
    generatePDFFromData,
    generatePDFFromElement,
    downloadPDF,
    previewResume,
    clearError,
  };
};