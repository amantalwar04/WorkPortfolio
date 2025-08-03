import { useState, useCallback } from 'react';
import { linkedinService, LinkedInService } from '../services/linkedin';
import { useAppActions } from '../store';
import { LinkedInProfile } from '../types';
import { showError, showSuccess, showLoading, dismissToast } from '../utils';

export interface UseLinkedInReturn {
  profile: LinkedInProfile | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  authenticateWithToken: (token: string) => Promise<void>;
  fetchProfile: () => Promise<void>;
  generateOAuthURL: (clientId: string, redirectUri: string, state?: string) => string;
  exchangeCodeForToken: (
    code: string,
    clientId: string,
    clientSecret: string,
    redirectUri: string
  ) => Promise<{ accessToken: string; expiresIn: number }>;
  clearProfile: () => void;
  clearError: () => void;
}

export const useLinkedIn = (): UseLinkedInReturn => {
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { setLinkedInProfile } = useAppActions();
  
  // Authenticate with LinkedIn token
  const authenticateWithToken = useCallback(async (token: string) => {
    const toastId = showLoading('Connecting to LinkedIn...');
    setLoading(true);
    setError(null);
    
    try {
      linkedinService.setAccessToken(token);
      
      // Validate token
      const isValid = await linkedinService.validateToken();
      if (!isValid) {
        throw new Error('Invalid LinkedIn access token');
      }
      
      // Save token to localStorage for persistence
      localStorage.setItem('linkedin_token', token);
      
      dismissToast(toastId);
      showSuccess('Successfully connected to LinkedIn!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to authenticate with LinkedIn';
      setError(errorMessage);
      dismissToast(toastId);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch complete LinkedIn profile
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const linkedinProfile = await linkedinService.getCompleteProfile();
      setProfile(linkedinProfile);
      setLinkedInProfile(linkedinProfile);
      
      showSuccess('LinkedIn profile loaded successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch LinkedIn profile';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLinkedInProfile]);
  
  // Generate OAuth URL
  const generateOAuthURL = useCallback((
    clientId: string,
    redirectUri: string,
    state?: string
  ) => {
    return LinkedInService.generateOAuthURL(clientId, redirectUri, state);
  }, []);
  
  // Exchange code for token
  const exchangeCodeForToken = useCallback(async (
    code: string,
    clientId: string,
    clientSecret: string,
    redirectUri: string
  ) => {
    const toastId = showLoading('Exchanging code for access token...');
    
    try {
      const tokenData = await LinkedInService.exchangeCodeForToken(
        code,
        clientId,
        clientSecret,
        redirectUri
      );
      
      dismissToast(toastId);
      showSuccess('Successfully obtained LinkedIn access token!');
      
      return tokenData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to exchange code for token';
      dismissToast(toastId);
      showError(errorMessage);
      throw err;
    }
  }, []);
  
  // Clear profile
  const clearProfile = useCallback(() => {
    setProfile(null);
    setLinkedInProfile(null);
    localStorage.removeItem('linkedin_token');
  }, [setLinkedInProfile]);
  
  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return {
    profile,
    loading,
    error,
    authenticateWithToken,
    fetchProfile,
    generateOAuthURL,
    exchangeCodeForToken,
    clearProfile,
    clearError,
  };
};