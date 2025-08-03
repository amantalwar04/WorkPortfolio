import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Save,
  Preview,
  CloudUpload,
  ColorLens,
  ExpandMore,
  SmartToy,
  GitHub,
  LinkedIn,
  Launch,
  Business,
  School,
  Star,
  Language as LanguageIcon,
  Verified as CertificateIcon,
  Work,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { ChromePicker } from 'react-color';

import { ProfessionalPortfolioData, EnhancedExperience, EnhancedSkill, EnhancedProject, Language, Certificate, ProfessionalTheme } from '../../types';
import ProfessionalTemplate from './ProfessionalTemplate';
import SafeWrapper from '../common/SafeWrapper';

const MotionCard = motion(Card);

const ProfessionalPortfolioBuilder: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [portfolioData, setPortfolioData] = useState<ProfessionalPortfolioData>({
    personalInfo: {
      fullName: '',
      title: '',
      location: '',
      email: '',
      phone: '',
      linkedin: '',
      github: '',
      whatsapp: '',
      avatar: '',
      website: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    theme: {
      primaryColor: '#2563eb',
      secondaryColor: '#7c3aed',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      accentColor: '#f59e0b',
      fontFamily: 'Inter, sans-serif',
      template: 'professional',
    },
  });

  const [showPreview, setShowPreview] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<string>('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerFor, setColorPickerFor] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);

  const steps = [
    { label: 'Personal Information', icon: <Business /> },
    { label: 'Professional Summary', icon: <Edit /> },
    { label: 'Experience Timeline', icon: <Work /> },
    { label: 'Education', icon: <School /> },
    { label: 'Skills & Expertise', icon: <Star /> },
    { label: 'Projects & Portfolio', icon: <Launch /> },
    { label: 'Certifications', icon: <CertificateIcon /> },
    { label: 'Languages', icon: <LanguageIcon /> },
    { label: 'Theme & Styling', icon: <ColorLens /> },
  ];

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      handleAutoSave();
    }, 2000);
    return () => clearTimeout(timer);
  }, [portfolioData]);

  const handleAutoSave = async () => {
    setSaveProgress(20);
    // Simulate saving
    setTimeout(() => setSaveProgress(100), 500);
    setTimeout(() => setSaveProgress(0), 1000);
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const updateSummary = (summary: string) => {
    setPortfolioData(prev => ({
      ...prev,
      summary,
    }));
  };

  const addExperience = () => {
    const newExperience: EnhancedExperience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
      skills: [],
    };
    setPortfolioData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience],
    }));
    setEditingItem(newExperience);
    setEditingType('experience');
  };

  const updateExperience = (id: string, updatedExperience: EnhancedExperience) => {
    setPortfolioData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? updatedExperience : exp
      ),
    }));
  };

  const deleteExperience = (id: string) => {
    setPortfolioData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id),
    }));
  };

  const addSkill = () => {
    const newSkill: EnhancedSkill = {
      id: Date.now().toString(),
      name: '',
      category: 'Technical',
      level: 5,
      years: 1,
      certified: false,
    };
    setPortfolioData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
    setEditingItem(newSkill);
    setEditingType('skill');
  };

  const updateSkill = (id: string, updatedSkill: EnhancedSkill) => {
    setPortfolioData(prev => ({
      ...prev,
      skills: prev.skills.map(skill => 
        skill.id === id ? updatedSkill : skill
      ),
    }));
  };

  const addProject = () => {
    const newProject: EnhancedProject = {
      id: Date.now().toString(),
      title: '',
      description: '',
      technologies: [],
      github_url: '',
      live_url: '',
      demoUrl: '',
      githubUrl: '',
      imageUrl: '',
      featured: false,
      category: 'web',
      status: 'completed',
      start_date: '',
      end_date: '',
      image: '',
      collaborators: [],
    };
    setPortfolioData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
    setEditingItem(newProject);
    setEditingType('project');
  };

  const addCertification = () => {
    const newCert: Certificate = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      url: '',
    };
    setPortfolioData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert],
    }));
    setEditingItem(newCert);
    setEditingType('certification');
  };

  const addLanguage = () => {
    const newLang: Language = {
      id: Date.now().toString(),
      name: '',
      proficiency: 'Intermediate',
      level: 5,
    };
    setPortfolioData(prev => ({
      ...prev,
      languages: [...prev.languages, newLang],
    }));
    setEditingItem(newLang);
    setEditingType('language');
  };

  const updateTheme = (themeField: string, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [themeField]: value,
      },
    }));
  };

  const handleNext = () => {
    setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <SafeWrapper name="PersonalInfoStep">
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={portfolioData.personalInfo.fullName}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Professional Title"
                      value={portfolioData.personalInfo.title}
                      onChange={(e) => updatePersonalInfo('title', e.target.value)}
                      placeholder="e.g., Strategic Leader | Technical Communication"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={portfolioData.personalInfo.location}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                      placeholder="e.g., Hyderabad, Telangana, India"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={portfolioData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Phone (Optional)"
                      value={portfolioData.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="LinkedIn Profile"
                      value={portfolioData.personalInfo.linkedin}
                      onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="GitHub Profile"
                      value={portfolioData.personalInfo.github}
                      onChange={(e) => updatePersonalInfo('github', e.target.value)}
                      placeholder="https://github.com/yourusername"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="WhatsApp (Optional)"
                      value={portfolioData.personalInfo.whatsapp}
                      onChange={(e) => updatePersonalInfo('whatsapp', e.target.value)}
                      placeholder="+1234567890"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </SafeWrapper>
        );

      case 1:
        return (
          <SafeWrapper name="SummaryStep">
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Typography variant="h6">
                    Professional Summary
                  </Typography>
                  <Button
                    startIcon={<SmartToy />}
                    variant="outlined"
                    size="small"
                    onClick={() => {/* AI enhance */}}
                  >
                    AI Enhance
                  </Button>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Professional Summary"
                  value={portfolioData.summary}
                  onChange={(e) => updateSummary(e.target.value)}
                  placeholder="Write a compelling professional summary highlighting your experience, expertise, and career achievements..."
                  variant="outlined"
                />
                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                  Tip: Include your years of experience, key skills, and what makes you unique.
                </Typography>
              </CardContent>
            </Card>
          </SafeWrapper>
        );

      case 2:
        return (
          <SafeWrapper name="ExperienceStep">
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Experience Timeline
                </Typography>
                <Button
                  startIcon={<Add />}
                  variant="contained"
                  onClick={addExperience}
                >
                  Add Experience
                </Button>
              </Box>

              {portfolioData.experience.map((exp, index) => (
                <MotionCard
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  sx={{ mb: 2 }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6">
                          {exp.title || 'New Position'}
                        </Typography>
                        <Typography variant="body1" color="primary">
                          {exp.company}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton onClick={() => { setEditingItem(exp); setEditingType('experience'); }}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => deleteExperience(exp.id)} color="error">
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </MotionCard>
              ))}

              {portfolioData.experience.length === 0 && (
                <Alert severity="info">
                  Add your work experience to build your career timeline. Include your achievements and key responsibilities.
                </Alert>
              )}
            </Box>
          </SafeWrapper>
        );

      case 8:
        return (
          <SafeWrapper name="ThemeStep">
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Theme & Styling
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Primary Color
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: portfolioData.theme.primaryColor,
                            border: '2px solid #ccc',
                            borderRadius: 1,
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            setColorPickerFor('primaryColor');
                            setShowColorPicker(true);
                          }}
                        />
                        <TextField
                          value={portfolioData.theme.primaryColor}
                          onChange={(e) => updateTheme('primaryColor', e.target.value)}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Secondary Color
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: portfolioData.theme.secondaryColor,
                            border: '2px solid #ccc',
                            borderRadius: 1,
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            setColorPickerFor('secondaryColor');
                            setShowColorPicker(true);
                          }}
                        />
                        <TextField
                          value={portfolioData.theme.secondaryColor}
                          onChange={(e) => updateTheme('secondaryColor', e.target.value)}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<Preview />}
                    onClick={() => setShowPreview(true)}
                    size="large"
                  >
                    Preview Portfolio
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </SafeWrapper>
        );

      default:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6">
                Step {step + 1} - {steps[step]?.label}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                This section is under development. You can continue to the next step.
              </Typography>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <SafeWrapper name="ProfessionalPortfolioBuilder">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Professional Portfolio Builder
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create a stunning professional portfolio similar to industry leaders
          </Typography>
          
          {saveProgress > 0 && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="determinate" value={saveProgress} sx={{ height: 8, borderRadius: 4 }} />
              <Typography variant="caption" color="text.secondary">
                Auto-saving...
              </Typography>
            </Box>
          )}
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                icon={step.icon}
                sx={{
                  '& .MuiStepLabel-iconContainer': {
                    color: index === activeStep ? 'primary.main' : 'text.secondary',
                  },
                }}
              >
                {step.label}
              </StepLabel>
              <StepContent>
                <Box sx={{ mb: 2 }}>
                  {renderStepContent(index)}
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                    disabled={index === steps.length - 1}
                  >
                    {index === steps.length - 1 ? 'Complete' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {/* Floating Preview Button */}
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={() => setShowPreview(true)}
        >
          <Preview />
        </Fab>

        {/* Color Picker Dialog */}
        <Dialog open={showColorPicker} onClose={() => setShowColorPicker(false)}>
          <DialogTitle>Choose Color</DialogTitle>
          <DialogContent>
            <ChromePicker
              color={portfolioData.theme[colorPickerFor as keyof ProfessionalTheme] as string}
              onChange={(color) => updateTheme(colorPickerFor, color.hex)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowColorPicker(false)}>Done</Button>
          </DialogActions>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog
          open={showPreview}
          onClose={() => setShowPreview(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: { height: '90vh' },
          }}
        >
          <DialogTitle>
            Portfolio Preview
            <IconButton
              onClick={() => setShowPreview(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              ✕
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <ProfessionalTemplate data={portfolioData} preview={true} />
          </DialogContent>
        </Dialog>
      </Container>
    </SafeWrapper>
  );
};

export default ProfessionalPortfolioBuilder;