import { useState, useEffect, useCallback } from 'react';
import { githubService } from '../services/github';
import { useAppStore, useAppActions } from '../store';
import { User, GitHubRepository } from '../types';
import { showError, showSuccess, showLoading, dismissToast } from '../utils';

export interface UseGitHubReturn {
  user: User | null;
  repositories: GitHubRepository[];
  stats: any;
  loading: boolean;
  error: string | null;
  
  // Actions
  authenticateWithToken: (token: string) => Promise<void>;
  fetchRepositories: (username?: string) => Promise<void>;
  fetchUserByUsername: (username: string) => Promise<void>;
  fetchRepoDetails: (owner: string, repo: string) => Promise<any>;
  fetchUserStats: (username: string) => Promise<any>;
  clearError: () => void;
}

export const useGitHub = (): UseGitHubReturn => {
  const user = useAppStore(state => state.user);
  const repositories = useAppStore(state => state.repositories);
  const loading = useAppStore(state => state.loading);
  const error = useAppStore(state => state.error);
  
  const {
    setUser,
    setRepositories,
    setLoading,
    setError,
  } = useAppActions();
  
  const [stats, setStats] = useState<any>(null);
  
  // Authenticate with GitHub token
  const authenticateWithToken = useCallback(async (token: string) => {
    const toastId = showLoading('Connecting to GitHub...');
    setLoading(true);
    setError(null);
    
    try {
      githubService.setToken(token);
      const userData = await githubService.getAuthenticatedUser();
      const userRepos = await githubService.getUserRepositories();
      
      setUser(userData);
      setRepositories(userRepos);
      
      // Save token to localStorage for persistence
      localStorage.setItem('github_token', token);
      
      dismissToast(toastId);
      showSuccess('Successfully connected to GitHub!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to authenticate with GitHub';
      setError(errorMessage);
      dismissToast(toastId);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUser, setRepositories, setLoading, setError]);
  
  // Fetch repositories for a user
  const fetchRepositories = useCallback(async (username?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const repos = await githubService.getUserRepositories(username);
      setRepositories(repos);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch repositories';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setRepositories, setLoading, setError]);
  
  // Fetch user by username (public profile)
  const fetchUserByUsername = useCallback(async (username: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = await githubService.getUserByUsername(username);
      const userRepos = await githubService.getUserRepositories(username);
      
      setUser(userData);
      setRepositories(userRepos);
      
      showSuccess(`Loaded profile for ${username}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to fetch user ${username}`;
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUser, setRepositories, setLoading, setError]);
  
  // Fetch repository details
  const fetchRepoDetails = useCallback(async (owner: string, repo: string) => {
    try {
      const details = await githubService.getRepositoryDetails(owner, repo);
      return details;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to fetch details for ${owner}/${repo}`;
      showError(errorMessage);
      throw err;
    }
  }, []);
  
  // Fetch user statistics
  const fetchUserStats = useCallback(async (username: string) => {
    try {
      const userStats = await githubService.getUserStats(username);
      setStats(userStats);
      return userStats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to fetch stats for ${username}`;
      showError(errorMessage);
      throw err;
    }
  }, []);
  
  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);
  
  // Auto-authenticate on mount if token exists
  useEffect(() => {
    const savedToken = localStorage.getItem('github_token');
    if (savedToken && !user) {
      authenticateWithToken(savedToken).catch(() => {
        // Remove invalid token
        localStorage.removeItem('github_token');
      });
    }
  }, [user, authenticateWithToken]);
  
  return {
    user,
    repositories,
    stats,
    loading,
    error,
    authenticateWithToken,
    fetchRepositories,
    fetchUserByUsername,
    fetchRepoDetails,
    fetchUserStats,
    clearError,
  };
};