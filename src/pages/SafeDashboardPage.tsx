import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Skeleton,
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
import { motion } from 'framer-motion';

// Safe imports
import SafeWrapper from '../components/common/SafeWrapper';
import WhatsAppButton from '../components/common/WhatsAppButton';
import DebugInfo from '../components/common/DebugInfo';
import GitHubIntegration from '../components/integrations/GitHubIntegration';
import LinkedInIntegration from '../components/integrations/LinkedInIntegration';
import AIAssistantIntegration from '../components/integrations/AIAssistantIntegration';

// Store with fallbacks
import { useUser, usePortfolio, useRepositories, useError } from '../store';
import { safeNavigate } from '../utils/navigation';

const MotionCard = motion(Card);

const SafeDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const [gitHubDialogOpen, setGitHubDialogOpen] = useState(false);
  const [linkedInDialogOpen, setLinkedInDialogOpen] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);

  // Safe state access with fallbacks
  const user = useUser() || null;
  const portfolio = usePortfolio() || null;
  const repositories = useRepositories() || [];
  const storeError = useError() || null;

  // Loading simulation
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Safe navigation wrapper
  const handleNavigation = (path: string) => {
    safeNavigate(navigate, path);
  };

  // Safe stats calculation
  const getStats = () => {
    try {
      return {
        portfolioCompletion: portfolio ? 75 : 0,
        totalProjects: Array.isArray(repositories) ? repositories.length : 0,
        githubStars: Array.isArray(repositories) 
          ? repositories.reduce((sum, repo) => sum + (repo?.stargazers_count || 0), 0) 
          : 0,
        lastUpdated: portfolio?.updatedAt 
          ? new Date(portfolio.updatedAt).toLocaleDateString() 
          : 'Never',
      };
    } catch (error) {
      console.error('Stats calculation error:', error);
      setLocalError('Failed to calculate stats');
      return {
        portfolioCompletion: 0,
        totalProjects: 0,
        githubStars: 0,
        lastUpdated: 'Error',
      };
    }
  };

  const stats = getStats();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="rectangular" width={200} height={40} />
        </Box>
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <SafeWrapper name="DashboardPage">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <SafeWrapper name="DashboardHeader">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => handleNavigation('/')}
              variant="outlined"
            >
              Home
            </Button>
            <Typography variant="h4" fontWeight="bold">
              Dashboard
            </Typography>
          </Box>
        </SafeWrapper>

        {/* Error Display */}
        {(storeError || localError) && (
          <SafeWrapper name="ErrorAlert">
            <Alert severity="error" sx={{ mb: 3 }}>
              {storeError || localError}
            </Alert>
          </SafeWrapper>
        )}

        {/* Welcome Section */}
        <SafeWrapper name="WelcomeSection">
          <Paper sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <Typography variant="h5" gutterBottom>
              Welcome back{user?.name ? `, ${user.name}` : ''}! 👋
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Ready to build your professional portfolio and create stunning resumes?
            </Typography>
          </Paper>
        </SafeWrapper>

        {/* Quick Stats */}
        <SafeWrapper name="QuickStats">
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <MotionCard whileHover={{ y: -4 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {stats.portfolioCompletion}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Portfolio Complete
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <MotionCard whileHover={{ y: -4 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                    {stats.totalProjects}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Projects
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <MotionCard whileHover={{ y: -4 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main" fontWeight="bold">
                    {stats.githubStars}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    GitHub Stars
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <MotionCard whileHover={{ y: -4 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" fontWeight="bold">
                    {stats.lastUpdated}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last Updated
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          </Grid>
        </SafeWrapper>

        {/* Quick Actions */}
        <SafeWrapper name="QuickActions">
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
            Quick Actions
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <MotionCard whileHover={{ scale: 1.02 }} sx={{ height: '100%' }}>
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
                      onClick={() => handleNavigation('/professional-builder')}
                      sx={{ flex: 1 }}
                    >
                      Professional
                    </Button>
                    <Button 
                      variant="outlined" 
                      onClick={() => handleNavigation('/builder')}
                      sx={{ flex: 1 }}
                    >
                      Custom
                    </Button>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <MotionCard whileHover={{ scale: 1.02 }} sx={{ height: '100%' }}>
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
                    onClick={() => handleNavigation('/resume')}
                    color="success"
                  >
                    Create Resume
                  </Button>
                </CardContent>
              </MotionCard>
            </Grid>
          </Grid>
        </SafeWrapper>

        {/* Integration Status */}
        <SafeWrapper name="IntegrationStatus">
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
            Integrations
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <GitHub sx={{ fontSize: 32 }} />
                    <Box>
                      <Typography variant="h6">GitHub</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {user?.username ? (
                          <>
                            <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />
                            <Typography variant="body2" color="success.main">
                              Connected
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
                    onClick={() => setGitHubDialogOpen(true)}
                  >
                    {user?.username ? 'Reconnect' : 'Connect'}
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
                        <Warning sx={{ color: 'warning.main', fontSize: 16 }} />
                        <Typography variant="body2" color="warning.main">
                          Not Connected
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => setLinkedInDialogOpen(true)}
                  >
                    Connect
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
                        <Warning sx={{ color: 'warning.main', fontSize: 16 }} />
                        <Typography variant="body2" color="warning.main">
                          Not Configured
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => setAiDialogOpen(true)}
                  >
                    Setup
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </SafeWrapper>

        {/* Settings Link */}
        <SafeWrapper name="SettingsSection">
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              startIcon={<Settings />}
              onClick={() => handleNavigation('/settings')}
              variant="outlined"
              size="large"
            >
              Open Settings
            </Button>
          </Box>
        </SafeWrapper>

        {/* WhatsApp Button */}
        {user?.whatsapp && (
          <SafeWrapper name="WhatsAppButton">
            <WhatsAppButton
              phoneNumber={user.whatsapp}
              message="Hi! I have a question about the Portfolio Generator."
              position="fixed"
            />
          </SafeWrapper>
        )}

        {/* Debug Info */}
        <DebugInfo 
          title="Dashboard Debug"
          data={{
            user: user ? { name: user.name, username: user.username } : null,
            portfolio: portfolio ? { id: portfolio.id, sections: portfolio.sections?.length } : null,
            repositoriesCount: repositories.length,
            stats,
            href: window.location.href,
            timestamp: new Date().toISOString(),
          }}
          error={storeError || localError}
          show={true} // Always show for debugging
        />

        {/* Integration Dialogs */}
        <GitHubIntegration 
          open={gitHubDialogOpen} 
          onClose={() => setGitHubDialogOpen(false)} 
        />
        <LinkedInIntegration 
          open={linkedInDialogOpen} 
          onClose={() => setLinkedInDialogOpen(false)} 
        />
        <AIAssistantIntegration 
          open={aiDialogOpen} 
          onClose={() => setAiDialogOpen(false)} 
        />
      </Container>
    </SafeWrapper>
  );
};

export default SafeDashboardPage;