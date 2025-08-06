import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  Skeleton,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  GitHub,
  LinkedIn,
  SmartToy,
  Build,
  Description,
  Settings,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Ultra-safe imports with fallbacks
import SafeWrapper from '../components/common/SafeWrapper';
import WorkingGitHubIntegration from '../components/integrations/WorkingGitHubIntegration';
import WorkingLinkedInIntegration from '../components/integrations/WorkingLinkedInIntegration';
import WorkingAIAssistantIntegration from '../components/integrations/WorkingAIAssistantIntegration';
import useConnectionStatus from '../hooks/useConnectionStatus';
import { useAuth } from '../contexts/AuthContext';
import AuthDialog from '../components/auth/AuthDialog';

/**
 * Ultra-Safe Dashboard with maximum error protection
 * This component uses defensive programming to prevent any possible React errors
 */
const UltraSafeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuth();
  
  // Safe state with proper initialization
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [integrationDialogs, setIntegrationDialogs] = useState({
    github: false,
    linkedin: false,
    ai: false,
  });
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  // Connection status from localStorage
  const { connectionStatus, loading: connectionsLoading, refreshConnections } = useConnectionStatus();

  // Safe user data with fallbacks
  const [userData, setUserData] = useState({
    name: null as string | null,
    username: null as string | null,
    avatar: null as string | null,
    email: null as string | null,
  });

  // Safe stats with proper defaults
  const [stats, setStats] = useState({
    portfolioCompletion: 0,
    totalProjects: 0,
    githubStars: 0,
    lastUpdated: null as string | null,
  });

  // Ultra-safe navigation function
  const safeNavigate = useCallback((path: string) => {
    try {
      if (typeof navigate === 'function') {
        navigate(path);
      } else {
        throw new Error('Navigate function not available');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      try {
        window.location.hash = path;
      } catch (hashError) {
        console.error('Hash navigation fallback failed:', hashError);
        window.location.href = `/#${path}`;
      }
    }
  }, [navigate]);

  // Safe integration dialog handlers
  const openIntegrationDialog = useCallback((type: 'github' | 'linkedin' | 'ai') => {
    try {
      setIntegrationDialogs(prev => ({
        ...prev,
        [type]: true,
      }));
    } catch (error) {
      console.error('Error opening integration dialog:', error);
      setError(`Failed to open ${type} integration`);
    }
  }, []);

  const closeIntegrationDialog = useCallback((type: 'github' | 'linkedin' | 'ai') => {
    try {
      setIntegrationDialogs(prev => ({
        ...prev,
        [type]: false,
      }));
    } catch (error) {
      console.error('Error closing integration dialog:', error);
    }
  }, []);

  // Safe data loading simulation
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if user is authenticated
        if (!isAuthenticated) {
          setAuthDialogOpen(true);
          setLoading(false);
          return;
        }
        
        // Simulate data loading with safe operations
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (isMounted) {
          // Safe state updates with real user data
          setUserData({
            name: authUser?.displayName || authUser?.email?.split('@')[0] || 'Portfolio User',
            username: authUser?.email?.split('@')[0] || 'user',
            avatar: authUser?.photoURL || null,
            email: authUser?.email || 'user@example.com',
          });
          
          setStats({
            portfolioCompletion: 25,
            totalProjects: 0,
            githubStars: 0,
            lastUpdated: new Date().toLocaleDateString(),
          });
          
          setLoading(false);
        }
      } catch (loadError) {
        console.error('Data loading error:', loadError);
        if (isMounted) {
          setError('Failed to load dashboard data');
          setLoading(false);
        }
      }
    };

    loadData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Memoized components for performance and stability
  const HeaderSection = useMemo(() => (
    <SafeWrapper name="UltraSafeHeader">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => safeNavigate('/')}
          variant="outlined"
          size="small"
        >
          Home
        </Button>
        <Typography variant="h4" fontWeight="bold">
          Dashboard
        </Typography>
      </Box>
    </SafeWrapper>
  ), [safeNavigate]);

  const WelcomeSection = useMemo(() => (
    <SafeWrapper name="UltraSafeWelcome">
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Welcome back{userData.name ? `, ${userData.name}` : ''}!
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Your professional portfolio generator is ready to help you create stunning portfolios.
          </Typography>
        </CardContent>
      </Card>
    </SafeWrapper>
  ), [userData.name]);

  const StatsSection = useMemo(() => (
    <SafeWrapper name="UltraSafeStats">
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {stats.portfolioCompletion}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Portfolio Complete
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {stats.totalProjects}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Projects
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {stats.githubStars}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                GitHub Stars
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="body1" fontWeight="bold">
                {stats.lastUpdated || 'Never'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last Updated
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </SafeWrapper>
  ), [stats]);

  const QuickActionsSection = useMemo(() => (
    <SafeWrapper name="UltraSafeActions">
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
        Quick Actions
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Build sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Professional Portfolio
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create a professional portfolio like industry leaders
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="contained" 
                  onClick={() => safeNavigate('/builder')}
                  sx={{ flex: 1 }}
                >
                  Professional
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => safeNavigate('/builder')}
                  sx={{ flex: 1 }}
                >
                  Custom
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Description sx={{ fontSize: 40, color: 'success.main' }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Resume Generator
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Generate professional resumes with AI-powered optimization
                  </Typography>
                </Box>
              </Box>
              <Button 
                variant="contained" 
                fullWidth
                onClick={() => safeNavigate('/resume')}
                color="success"
              >
                Create Resume
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </SafeWrapper>
  ), [safeNavigate]);

  const IntegrationsSection = useMemo(() => (
    <SafeWrapper name="UltraSafeIntegrations">
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
        Integrations
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <GitHub sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="h6">GitHub</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {connectionStatus.github.connected ? (
                      <>
                        <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />
                        <Typography variant="body2" color="success.main">
                          Connected as @{connectionStatus.github.username}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Warning sx={{ color: 'warning.main', fontSize: 16 }} />
                        <Typography variant="body2" color="warning.main">
                          Not Connected
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => openIntegrationDialog('github')}
              >
                {connectionStatus.github.connected ? 'Reconnect' : 'Connect'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <LinkedIn sx={{ fontSize: 32, color: '#0077b5' }} />
                <Box>
                  <Typography variant="h6">LinkedIn</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {connectionStatus.linkedin.connected ? (
                      <>
                        <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />
                        <Typography variant="body2" color="success.main">
                          Connected ({connectionStatus.linkedin.username})
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Warning sx={{ color: 'warning.main', fontSize: 16 }} />
                        <Typography variant="body2" color="warning.main">
                          Not Connected
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => openIntegrationDialog('linkedin')}
              >
                {connectionStatus.linkedin.connected ? 'Reconnect' : 'Connect'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <SmartToy sx={{ fontSize: 32, color: '#667eea' }} />
                <Box>
                  <Typography variant="h6">AI Assistant</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {connectionStatus.ai.connected ? (
                      <>
                        <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />
                        <Typography variant="body2" color="success.main">
                          Connected ({connectionStatus.ai.provider})
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Warning sx={{ color: 'warning.main', fontSize: 16 }} />
                        <Typography variant="body2" color="warning.main">
                          Not Configured
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => openIntegrationDialog('ai')}
              >
                {connectionStatus.ai.connected ? 'Reconfigure' : 'Setup'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </SafeWrapper>
  ), [openIntegrationDialog, connectionStatus]);

  const SettingsSection = useMemo(() => (
    <SafeWrapper name="UltraSafeSettings">
      <Divider sx={{ my: 4 }} />
      <Box sx={{ textAlign: 'center' }}>
        <Button
          startIcon={<Settings />}
          onClick={() => safeNavigate('/settings')}
          variant="outlined"
          size="large"
        >
          Open Settings
        </Button>
      </Box>
    </SafeWrapper>
  ), [safeNavigate]);

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" width={200} height={40} sx={{ mb: 4 }} />
        <Skeleton variant="rectangular" height={150} sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} md={3} key={index}>
              <Skeleton variant="rectangular" height={120} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Dashboard Error
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
        >
          Reload Page
        </Button>
      </Container>
    );
  }

  // Main render
  return (
    <SafeWrapper name="UltraSafeDashboard">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {HeaderSection}
        {WelcomeSection}
        {StatsSection}
        {QuickActionsSection}
        {IntegrationsSection}
        {SettingsSection}
      </Container>
      
      {/* Authentication Dialog */}
      <AuthDialog
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        onSuccess={() => {
          setAuthDialogOpen(false);
          // Reload data after successful authentication
          window.location.reload();
        }}
      />
      
      {/* Working Integration Dialogs */}
      <WorkingGitHubIntegration
        open={integrationDialogs.github}
        onClose={() => setIntegrationDialogs(prev => ({ ...prev, github: false }))}
      />
      <WorkingLinkedInIntegration
        open={integrationDialogs.linkedin}
        onClose={() => setIntegrationDialogs(prev => ({ ...prev, linkedin: false }))}
      />
      <WorkingAIAssistantIntegration
        open={integrationDialogs.ai}
        onClose={() => setIntegrationDialogs(prev => ({ ...prev, ai: false }))}
      />
    </SafeWrapper>
  );
};

export default UltraSafeDashboard;