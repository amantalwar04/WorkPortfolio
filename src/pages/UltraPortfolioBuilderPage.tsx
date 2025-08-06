import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Build,
  Preview,
  Save,
  Settings,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Safe imports
import SafeWrapper from '../components/common/SafeWrapper';
import { safeNavigate } from '../utils/navigation';

/**
 * Ultra-Safe Portfolio Builder Page
 */
const UltraPortfolioBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Safe state management
  const [activeStep, setActiveStep] = useState<number>(0);
  const [builderMode, setBuilderMode] = useState<'quick' | 'professional' | 'custom'>('quick');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Safe navigation handler
  const handleNavigation = useCallback((path: string) => {
    safeNavigate(navigate, path);
  }, [navigate]);

  // Safe step navigation
  const handleNext = useCallback(() => {
    try {
      setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
    } catch (error) {
      console.error('Step navigation error:', error);
    }
  }, []);

  const handleBack = useCallback(() => {
    try {
      setActiveStep(prev => Math.max(prev - 1, 0));
    } catch (error) {
      console.error('Step navigation error:', error);
    }
  }, []);

  // Safe save handler
  const handleSave = useCallback(async () => {
    try {
      setSaveStatus('saving');
      
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
      
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('error');
    }
  }, []);

  // Builder steps
  const steps = useMemo(() => [
    {
      label: 'Choose Template',
      description: 'Select a portfolio template that matches your style',
    },
    {
      label: 'Personal Information',
      description: 'Add your basic details and contact information',
    },
    {
      label: 'Experience & Skills',
      description: 'Showcase your work experience and skills',
    },
    {
      label: 'Projects & Portfolio',
      description: 'Add your best projects and work samples',
    },
    {
      label: 'Customization',
      description: 'Customize colors, fonts, and layout',
    },
    {
      label: 'Review & Publish',
      description: 'Review your portfolio and make it live',
    },
  ], []);

  // Quick Start Section
  const QuickStartSection = useMemo(() => (
    <SafeWrapper name="QuickStart">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Choose Your Builder Mode
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Select the best approach for creating your portfolio
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              border: builderMode === 'quick' ? 2 : 0,
              borderColor: 'primary.main',
            }}
            onClick={() => setBuilderMode('quick')}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Build sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Quick Builder
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create a portfolio in minutes with guided steps and smart templates
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              border: builderMode === 'professional' ? 2 : 0,
              borderColor: 'primary.main',
            }}
            onClick={() => setBuilderMode('professional')}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Preview sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Professional Builder
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Advanced builder with more customization options and professional templates
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              border: builderMode === 'custom' ? 2 : 0,
              borderColor: 'primary.main',
            }}
            onClick={() => setBuilderMode('custom')}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Settings sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Custom Builder
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Full control over every aspect of your portfolio design and content
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </SafeWrapper>
  ), [builderMode]);

  // Guided Builder Section
  const GuidedBuilderSection = useMemo(() => (
    <SafeWrapper name="GuidedBuilder">
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography variant="h6">{step.label}</Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {step.description}
                </Typography>
                
                {/* Step Content Placeholder */}
                <Card sx={{ mb: 2, p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Step {index + 1} content will be implemented here.
                    This includes forms, templates, and interactive elements.
                  </Typography>
                </Card>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outlined"
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                  >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Continue'}
                    <ArrowForward sx={{ ml: 1 }} />
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Box>
    </SafeWrapper>
  ), [activeStep, steps, handleBack, handleNext]);

  // Action Buttons Section
  const ActionButtonsSection = useMemo(() => (
    <SafeWrapper name="ActionButtons">
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<Save />}
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
        >
          {saveStatus === 'saving' ? 'Saving...' : 'Save Progress'}
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<Preview />}
          onClick={() => handleNavigation('/preview')}
        >
          Preview Portfolio
        </Button>
        
        <Button
          variant="contained"
                            onClick={() => handleNavigation('/builder')}
        >
          Professional Builder
        </Button>
      </Box>
    </SafeWrapper>
  ), [saveStatus, handleSave, handleNavigation]);

  // Main render
  return (
    <SafeWrapper name="UltraPortfolioBuilderPage">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => handleNavigation('/dashboard')}
            variant="outlined"
          >
            Back to Dashboard
          </Button>
          <Typography variant="h4" fontWeight="bold">
            Portfolio Builder
          </Typography>
        </Box>

        {/* Save Status Alert */}
        {saveStatus === 'saved' && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Portfolio progress saved successfully!
          </Alert>
        )}
        
        {saveStatus === 'error' && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Failed to save progress. Please try again.
          </Alert>
        )}

        {/* Quick Start Section */}
        <Paper sx={{ p: 3, mb: 4 }}>
          {QuickStartSection}
        </Paper>

        {/* Guided Builder (if mode selected) */}
        {builderMode && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              {builderMode === 'quick' ? 'Quick' : 
               builderMode === 'professional' ? 'Professional' : 'Custom'} 
              Portfolio Builder
            </Typography>
            {GuidedBuilderSection}
          </Paper>
        )}

        {/* Action Buttons */}
        <Paper sx={{ p: 3 }}>
          {ActionButtonsSection}
        </Paper>

        {/* Help Section */}
        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            Need Help?
          </Typography>
          <Typography variant="body2">
            Visit our{' '}
            <Button 
              size="small" 
              onClick={() => handleNavigation('/settings')}
            >
              Settings
            </Button>
            {' '}page to configure integrations or check our documentation for detailed guidance.
          </Typography>
        </Alert>
      </Container>
    </SafeWrapper>
  );
};

export default UltraPortfolioBuilderPage;