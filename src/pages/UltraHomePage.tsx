import React, { useCallback, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  Alert,
} from '@mui/material';
import {
  Build,
  Description,
  GitHub,
  LinkedIn,
  SmartToy,
  ArrowForward,
  Star,
  Speed,
  Security,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Safe imports
import SafeWrapper from '../components/common/SafeWrapper';
import { safeNavigate } from '../utils/navigation';
import GettingStarted from '../components/getting-started/GettingStarted';
import { useAuth } from '../contexts/AuthContext';

/**
 * Ultra-Safe Home Page with bulletproof navigation
 */
const UltraHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Safe navigation handler
  const handleNavigation = useCallback((path: string) => {
    safeNavigate(navigate, path);
  }, [navigate]);

  // Handle Get Started with authentication check
  const handleGetStarted = useCallback(() => {
    if (isAuthenticated) {
      // If authenticated, go to getting started page
      handleNavigation('/dashboard');
    } else {
      // If not authenticated, go to dashboard which will show auth dialog
      handleNavigation('/dashboard');
    }
  }, [isAuthenticated, handleNavigation]);

  // Hero Section
  const HeroSection = useMemo(() => (
    <SafeWrapper name="HeroSection">
      <Box sx={{ 
        textAlign: 'center', 
        py: 8,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 2,
        mb: 6,
      }}>
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          Create Your Professional Portfolio
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          Build stunning portfolios and resumes with AI assistance
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Build />}
            onClick={() => handleNavigation('/builder')}
            sx={{ 
              bgcolor: 'white', 
              color: 'primary.main',
              '&:hover': { bgcolor: 'grey.100' },
              minWidth: 250,
            }}
          >
            Create Professional Portfolio
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowForward />}
            onClick={() => handleNavigation('/dashboard')}
            sx={{ 
              borderColor: 'white', 
              color: 'white',
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
              minWidth: 200,
            }}
          >
            Explore Features
          </Button>
        </Box>
      </Box>
    </SafeWrapper>
  ), [handleNavigation]);

  // Features Section
  const FeaturesSection = useMemo(() => (
    <SafeWrapper name="FeaturesSection">
      <Typography variant="h4" textAlign="center" gutterBottom sx={{ mb: 4 }}>
        Everything You Need to Stand Out
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent sx={{ p: 3 }}>
              <Build sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Portfolio Builder
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create professional portfolios with our drag-and-drop builder and modern templates
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent sx={{ p: 3 }}>
              <Description sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Resume Generator
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Generate ATS-friendly resumes with industry-standard templates and AI optimization
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent sx={{ p: 3 }}>
              <SmartToy sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                AI Assistant
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get AI-powered suggestions for content, skills optimization, and professional writing
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </SafeWrapper>
  ), []);

  // Integration Highlights
  const IntegrationsSection = useMemo(() => (
    <SafeWrapper name="IntegrationsSection">
      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
        <Typography variant="h5" gutterBottom>
          Seamless Integrations
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Connect your favorite platforms and tools
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GitHub sx={{ fontSize: 32 }} />
            <Typography variant="body1">GitHub</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinkedIn sx={{ fontSize: 32, color: '#0077b5' }} />
            <Typography variant="body1">LinkedIn</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SmartToy sx={{ fontSize: 32, color: '#667eea' }} />
            <Typography variant="body1">AI Tools</Typography>
          </Box>
        </Box>
      </Paper>
    </SafeWrapper>
  ), []);

  // Quick Stats
  const StatsSection = useMemo(() => (
    <SafeWrapper name="StatsSection">
      <Grid container spacing={3} sx={{ textAlign: 'center' }}>
        <Grid item xs={12} sm={4}>
          <Box>
            <Speed sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              5 min
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quick Setup
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box>
            <Star sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              10+
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Professional Templates
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box>
            <Security sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              100%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Secure & Private
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </SafeWrapper>
  ), []);

  // Call to Action Section
  const CTASection = useMemo(() => (
    <SafeWrapper name="CTASection">
      <Paper sx={{ 
        p: 4, 
        textAlign: 'center',
        background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
        color: 'white',
      }}>
        <Typography variant="h4" gutterBottom>
          Ready to Build Your Future?
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
          Join thousands of professionals who trust our platform
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Build />}
            onClick={handleGetStarted}
            sx={{ 
              bgcolor: 'white', 
              color: 'primary.main',
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            Get Started Now
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => handleNavigation('/resume')}
            sx={{ 
              borderColor: 'white', 
              color: 'white',
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            Try Resume Builder
          </Button>
        </Box>
      </Paper>
    </SafeWrapper>
  ), [handleNavigation]);



  // Main render
  return (
    <SafeWrapper name="UltraHomePage">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Section */}
        {HeroSection}

        {/* Getting Started Section - Only show for authenticated users */}
        {isAuthenticated && (
          <Box sx={{ my: 6 }}>
            <GettingStarted />
          </Box>
        )}



        {/* Features */}
        {FeaturesSection}

        {/* Stats */}
        <Box sx={{ my: 6 }}>
          {StatsSection}
        </Box>

        {/* Integrations */}
        <Box sx={{ my: 6 }}>
          {IntegrationsSection}
        </Box>

        {/* Call to Action */}
        {CTASection}
      </Container>
    </SafeWrapper>
  );
};

export default UltraHomePage;