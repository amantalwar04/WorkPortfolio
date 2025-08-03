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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Download,
  Preview,
  Save,
  Description,
  Person,
  Work,
  School,
  Star,
  Code,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Safe imports
import SafeWrapper from '../components/common/SafeWrapper';
import { safeNavigate } from '../utils/navigation';

/**
 * Ultra-Safe Resume Generator Page
 */
const UltraResumeGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Safe state management
  const [activeStep, setActiveStep] = useState<number>(0);
  const [resumeTemplate, setResumeTemplate] = useState<string>('modern');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  // Resume data state
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedIn: '',
      github: '',
      website: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  });

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

  // Safe download handler
  const handleDownload = useCallback(async () => {
    try {
      // Simulate PDF generation
      const link = document.createElement('a');
      link.href = 'data:text/plain;charset=utf-8,Resume content would be generated here';
      link.download = `${resumeData.personalInfo.name || 'Resume'}.pdf`;
      link.click();
    } catch (error) {
      console.error('Download error:', error);
    }
  }, [resumeData.personalInfo.name]);

  // Resume builder steps
  const steps = useMemo(() => [
    {
      label: 'Personal Information',
      description: 'Add your contact details and basic information',
      icon: <Person />,
    },
    {
      label: 'Professional Summary',
      description: 'Write a compelling summary of your experience',
      icon: <Description />,
    },
    {
      label: 'Work Experience',
      description: 'Add your work history and achievements',
      icon: <Work />,
    },
    {
      label: 'Education',
      description: 'Include your educational background',
      icon: <School />,
    },
    {
      label: 'Skills & Expertise',
      description: 'Highlight your technical and soft skills',
      icon: <Star />,
    },
    {
      label: 'Projects & Portfolio',
      description: 'Showcase your best work and projects',
      icon: <Code />,
    },
  ], []);

  // Template Selection Section
  const TemplateSelectionSection = useMemo(() => (
    <SafeWrapper name="TemplateSelection">
      <Typography variant="h6" gutterBottom>
        Choose Resume Template
      </Typography>
      <Grid container spacing={3}>
        {['modern', 'classic', 'minimal', 'creative'].map((template) => (
          <Grid item xs={12} sm={6} md={3} key={template}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                border: resumeTemplate === template ? 2 : 1,
                borderColor: resumeTemplate === template ? 'primary.main' : 'divider',
              }}
              onClick={() => setResumeTemplate(template)}
            >
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Description sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                  {template}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {template === 'modern' ? 'Clean and contemporary design' :
                   template === 'classic' ? 'Traditional and professional' :
                   template === 'minimal' ? 'Simple and elegant' :
                   'Bold and artistic design'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </SafeWrapper>
  ), [resumeTemplate]);

  // Personal Info Form
  const PersonalInfoForm = useMemo(() => (
    <SafeWrapper name="PersonalInfoForm">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Full Name"
            value={resumeData.personalInfo.name}
            onChange={(e) => setResumeData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, name: e.target.value }
            }))}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Email"
            type="email"
            value={resumeData.personalInfo.email}
            onChange={(e) => setResumeData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, email: e.target.value }
            }))}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Phone"
            value={resumeData.personalInfo.phone}
            onChange={(e) => setResumeData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, phone: e.target.value }
            }))}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Location"
            value={resumeData.personalInfo.location}
            onChange={(e) => setResumeData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, location: e.target.value }
            }))}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="LinkedIn Profile"
            value={resumeData.personalInfo.linkedIn}
            onChange={(e) => setResumeData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, linkedIn: e.target.value }
            }))}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="GitHub Profile"
            value={resumeData.personalInfo.github}
            onChange={(e) => setResumeData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, github: e.target.value }
            }))}
            fullWidth
          />
        </Grid>
      </Grid>
    </SafeWrapper>
  ), [resumeData.personalInfo]);

  // Summary Form
  const SummaryForm = useMemo(() => (
    <SafeWrapper name="SummaryForm">
      <TextField
        label="Professional Summary"
        multiline
        rows={6}
        value={resumeData.summary}
        onChange={(e) => setResumeData(prev => ({
          ...prev,
          summary: e.target.value
        }))}
        fullWidth
        placeholder="Write a compelling 2-3 sentence summary highlighting your experience, skills, and career goals..."
      />
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Tip:</strong> Keep it concise and focus on your most relevant achievements and what you can bring to potential employers.
        </Typography>
      </Alert>
    </SafeWrapper>
  ), [resumeData.summary]);

  // Step Content Renderer
  const renderStepContent = useCallback((step: number) => {
    switch (step) {
      case 0:
        return PersonalInfoForm;
      case 1:
        return SummaryForm;
      case 2:
        return (
          <SafeWrapper name="ExperienceForm">
            <Alert severity="info">
              <Typography variant="body2">
                Work experience form will be implemented here. Add your professional experience with companies, roles, and achievements.
              </Typography>
            </Alert>
          </SafeWrapper>
        );
      case 3:
        return (
          <SafeWrapper name="EducationForm">
            <Alert severity="info">
              <Typography variant="body2">
                Education form will be implemented here. Add your degrees, certifications, and educational background.
              </Typography>
            </Alert>
          </SafeWrapper>
        );
      case 4:
        return (
          <SafeWrapper name="SkillsForm">
            <Alert severity="info">
              <Typography variant="body2">
                Skills form will be implemented here. Add your technical skills, programming languages, and expertise areas.
              </Typography>
            </Alert>
          </SafeWrapper>
        );
      case 5:
        return (
          <SafeWrapper name="ProjectsForm">
            <Alert severity="info">
              <Typography variant="body2">
                Projects form will be implemented here. Showcase your best projects and portfolio pieces.
              </Typography>
            </Alert>
          </SafeWrapper>
        );
      default:
        return null;
    }
  }, [PersonalInfoForm, SummaryForm]);

  // Progress Stats
  const ProgressStats = useMemo(() => {
    const completedFields = [
      resumeData.personalInfo.name,
      resumeData.personalInfo.email,
      resumeData.summary,
    ].filter(Boolean).length;
    
    const totalFields = 3; // Basic required fields
    const progress = Math.round((completedFields / totalFields) * 100);

    return (
      <SafeWrapper name="ProgressStats">
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Resume Completion: {progress}%
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Chip 
                  label={`${activeStep + 1}/${steps.length} Steps`}
                  color="primary"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Chip 
                  label={`${completedFields}/${totalFields} Required`}
                  color={completedFields === totalFields ? 'success' : 'warning'}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Chip 
                  label={resumeTemplate}
                  color="secondary"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Chip 
                  label={saveStatus === 'saved' ? 'Saved' : 'Draft'}
                  color={saveStatus === 'saved' ? 'success' : 'default'}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </SafeWrapper>
    );
  }, [activeStep, steps.length, resumeData, resumeTemplate, saveStatus]);

  // Action Buttons
  const ActionButtons = useMemo(() => (
    <SafeWrapper name="ActionButtons">
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<Save />}
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
        >
          {saveStatus === 'saving' ? 'Saving...' : 'Save Draft'}
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<Preview />}
          onClick={() => handleNavigation('/preview')}
        >
          Preview Resume
        </Button>
        
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleDownload}
        >
          Download PDF
        </Button>
      </Box>
    </SafeWrapper>
  ), [saveStatus, handleSave, handleNavigation, handleDownload]);

  // Main render
  return (
    <SafeWrapper name="UltraResumeGeneratorPage">
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
            Resume Generator
          </Typography>
        </Box>

        {/* Save Status Alert */}
        {saveStatus === 'saved' && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Resume saved successfully!
          </Alert>
        )}
        
        {saveStatus === 'error' && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Failed to save resume. Please try again.
          </Alert>
        )}

        {/* Progress Stats */}
        {ProgressStats}

        {/* Template Selection */}
        <Paper sx={{ p: 3, mb: 4 }}>
          {TemplateSelectionSection}
        </Paper>

        {/* Resume Builder Stepper */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Build Your Resume
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel icon={step.icon}>
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Current Step Content */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {steps[activeStep]?.label}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {steps[activeStep]?.description}
            </Typography>
            
            {renderStepContent(activeStep)}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
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
              disabled={activeStep === steps.length - 1}
            >
              Continue
              <ArrowForward sx={{ ml: 1 }} />
            </Button>
          </Box>
        </Paper>

        {/* Action Buttons */}
        <Paper sx={{ p: 3 }}>
          {ActionButtons}
        </Paper>

        {/* Help Section */}
        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            Resume Tips
          </Typography>
          <Typography variant="body2">
            • Keep it to 1-2 pages maximum<br/>
            • Use action verbs and quantify achievements<br/>
            • Tailor your resume for each job application<br/>
            • Use our AI assistant for content suggestions
          </Typography>
        </Alert>
      </Container>
    </SafeWrapper>
  );
};

export default UltraResumeGeneratorPage;