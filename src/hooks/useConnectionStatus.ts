import { useState, useEffect } from 'react';

export interface ConnectionStatus {
  github: {
    connected: boolean;
    username?: string;
    mode?: 'token' | 'username';
    lastConnected?: string;
  };
  linkedin: {
    connected: boolean;
    profileUrl?: string;
    username?: string;
    lastConnected?: string;
  };
  ai: {
    connected: boolean;
    provider?: 'openai' | 'anthropic' | 'google';
    lastConnected?: string;
  };
}

export const useConnectionStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    github: { connected: false },
    linkedin: { connected: false },
    ai: { connected: false },
  });

  const [loading, setLoading] = useState(true);

  // Check connection status from localStorage
  const checkConnections = () => {
    try {
      setLoading(true);
      
      // Check GitHub connection
      const githubConnected = localStorage.getItem('github_connected') === 'true';
      const githubUser = localStorage.getItem('github_user');
      const githubMode = localStorage.getItem('github_connection_mode') as 'token' | 'username';
      
      let githubUsername = '';
      if (githubUser) {
        try {
          const userData = JSON.parse(githubUser);
          githubUsername = userData.login || userData.username || '';
        } catch (e) {
          console.error('Error parsing GitHub user data:', e);
        }
      }

      // Check LinkedIn connection
      const linkedinConnected = localStorage.getItem('linkedin_connected') === 'true';
      const linkedinProfileUrl = localStorage.getItem('linkedin_profile_url');
      const linkedinUsername = localStorage.getItem('linkedin_username');

      // Check AI connection
      const aiConnected = localStorage.getItem('ai_connected') === 'true';
      const aiProvider = localStorage.getItem('ai_provider') as 'openai' | 'anthropic' | 'google';

      setConnectionStatus({
        github: {
          connected: githubConnected,
          username: githubUsername,
          mode: githubMode,
          lastConnected: githubConnected ? new Date().toISOString() : undefined,
        },
        linkedin: {
          connected: linkedinConnected,
          profileUrl: linkedinProfileUrl || undefined,
          username: linkedinUsername || undefined,
          lastConnected: linkedinConnected ? new Date().toISOString() : undefined,
        },
        ai: {
          connected: aiConnected,
          provider: aiProvider,
          lastConnected: aiConnected ? new Date().toISOString() : undefined,
        },
      });
    } catch (error) {
      console.error('Error checking connection status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Listen for localStorage changes
  useEffect(() => {
    checkConnections();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && (
        e.key.includes('github_') || 
        e.key.includes('linkedin_') || 
        e.key.includes('ai_')
      )) {
        checkConnections();
      }
    };

    // Listen for changes in other tabs
    window.addEventListener('storage', handleStorageChange);

    // Listen for custom events in the same tab
    const handleCustomStorageChange = () => {
      checkConnections();
    };

    window.addEventListener('localStorageChanged', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChanged', handleCustomStorageChange);
    };
  }, []);

  // Helper function to refresh connections manually
  const refreshConnections = () => {
    checkConnections();
  };

  // Helper function to disconnect a service
  const disconnect = (service: 'github' | 'linkedin' | 'ai') => {
    try {
      switch (service) {
        case 'github':
          localStorage.removeItem('github_connected');
          localStorage.removeItem('github_token');
          localStorage.removeItem('github_username');
          localStorage.removeItem('github_user');
          localStorage.removeItem('github_connection_mode');
          break;
        case 'linkedin':
          localStorage.removeItem('linkedin_connected');
          localStorage.removeItem('linkedin_profile_url');
          localStorage.removeItem('linkedin_username');
          break;
        case 'ai':
          localStorage.removeItem('ai_connected');
          localStorage.removeItem('ai_provider');
          localStorage.removeItem('ai_integration_saved');
          // Remove API keys for all providers
          localStorage.removeItem('ai_api_key_openai');
          localStorage.removeItem('ai_api_key_anthropic');
          localStorage.removeItem('ai_api_key_google');
          break;
      }
      
      // Trigger refresh
      refreshConnections();
      
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new Event('localStorageChanged'));
      
    } catch (error) {
      console.error(`Error disconnecting ${service}:`, error);
    }
  };

  return {
    connectionStatus,
    loading,
    refreshConnections,
    disconnect,
  };
};

export default useConnectionStatus;