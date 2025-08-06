import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  LinearProgress,
  Fab,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Save,
  Preview,
  Person,
  Work,
  School,
  Star,
  Code,
  Verified as Certificate,
  Language,
  Palette,
  Add,
  Edit,
  Delete,
  Help,
  CloudUpload,
  LinkedIn,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Safe imports
import SafeWrapper from '../common/SafeWrapper';
import { safeNavigate } from '../../utils/navigation';
import useConnectionStatus from '../../hooks/useConnectionStatus';
import { useAuth } from '../../contexts/AuthContext';
import { dbService } from '../../services/firebase';
import AuthDialog from '../auth/AuthDialog';
import ProfessionalTemplate from './ProfessionalTemplate';
import RepositoryConfiguration from '../deployment/RepositoryConfiguration';
import PortfolioHelp from '../help/PortfolioHelp';
import LinkedInImport from '../integrations/LinkedInImport';
import GitHubDeploymentService, { DeploymentConfig, ProjectInfo } from '../../services/githubDeployment';
import PortfolioGeneratorService from '../../services/portfolioGenerator';
import { LinkedInRecommendation, LinkedInPost } from '../../services/linkedinApi';

// Types
import { 
  ProfessionalPortfolioData, 
  EnhancedExperience, 
  EnhancedSkill, 
  EnhancedProject, 
  Education, 
  Certificate as CertificateType, 
  Language as LanguageType 
} from '../../types';

const MotionCard = motion(Card);

interface Step {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  required: boolean;
}

const CompleteProfessionalBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { connectionStatus } = useConnectionStatus();
  const { user, isAuthenticated } = useAuth();
  
  // Safe state management
  const [activeStep, setActiveStep] = useState<number>(0);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveProgress, setSaveProgress] = useState<number>(0);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [authDialogOpen, setAuthDialogOpen] = useState<boolean>(false);
  const [deploymentDialogOpen, setDeploymentDialogOpen] = useState<boolean>(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState<boolean>(false);
  const [deployedPortfolioUrl, setDeployedPortfolioUrl] = useState<string>('');
  const [linkedinRecommendations, setLinkedinRecommendations] = useState<LinkedInRecommendation[]>([]);
  const [linkedinPosts, setLinkedinPosts] = useState<LinkedInPost[]>([]);
  
  // Portfolio data state
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
      template: 'executive',
    },
  });

  // Steps configuration
  const steps: Step[] = useMemo(() => [
    {
      id: 'personal',
      label: 'Personal Information',
      description: 'Basic contact details and professional info',
      icon: <Person />,
      required: true,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn Import',
      description: 'Import profile data, recommendations, and posts from LinkedIn',
      icon: <LinkedIn />,
      required: false,
    },
    {
      id: 'summary',
      label: 'Professional Summary',
      description: 'Brief overview of your expertise and goals',
      icon: <Edit />,
      required: true,
    },
    {
      id: 'experience',
      label: 'Work Experience',
      description: 'Your professional work history and achievements',
      icon: <Work />,
      required: false,
    },
    {
      id: 'education',
      label: 'Education',
      description: 'Academic background and qualifications',
      icon: <School />,
      required: false,
    },
    {
      id: 'skills',
      label: 'Skills & Expertise',
      description: 'Technical and soft skills with proficiency levels',
      icon: <Star />,
      required: false,
    },
    {
      id: 'projects',
      label: 'Projects & Portfolio',
      description: 'Showcase your best work and projects',
      icon: <Code />,
      required: false,
    },
    {
      id: 'certifications',
      label: 'Certifications',
      description: 'Professional certifications and achievements',
      icon: <Certificate />,
      required: false,
    },
    {
      id: 'languages',
      label: 'Languages',
      description: 'Languages you speak and proficiency levels',
      icon: <Language />,
      required: false,
    },
    {
      id: 'theme',
      label: 'Theme & Styling',
      description: 'Customize the look and feel of your portfolio',
      icon: <Palette />,
      required: true,
    },
  ], []);

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      handleAutoSave();
    }, 3000);
    return () => clearTimeout(timer);
  }, [portfolioData]);

  // Load saved data on mount
  useEffect(() => {
    loadSavedData();
  }, []);

  // Import GitHub data if connected
  useEffect(() => {
    if (connectionStatus.github.connected && !portfolioData.personalInfo.github) {
      importGitHubData();
    }
  }, [connectionStatus.github.connected]);

  // Import LinkedIn data if connected
  useEffect(() => {
    if (connectionStatus.linkedin.connected && !portfolioData.personalInfo.linkedin) {
      importLinkedInData();
    }
  }, [connectionStatus.linkedin.connected]);

  // Safe navigation handler
  const handleNavigation = useCallback((path: string) => {
    safeNavigate(navigate, path);
  }, [navigate]);

  // Auto-save handler
  const handleAutoSave = useCallback(async () => {
    try {
      setSaving(true);
      setSaveProgress(25);
      
      // Always save to localStorage for backup
      localStorage.setItem('portfolio_builder_data', JSON.stringify(portfolioData));
      localStorage.setItem('portfolio_builder_step', activeStep.toString());
      
      setSaveProgress(50);
      
      // If authenticated, also save to database
      if (isAuthenticated && user) {
        try {
          await dbService.savePortfolio({
            ...portfolioData,
            activeStep,
            type: 'professional_portfolio',
          });
        } catch (dbError) {
          console.warn('Database save failed, continuing with localStorage:', dbError);
        }
      }
      
      setSaveProgress(75);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSaveProgress(100);
      setTimeout(() => {
        setSaving(false);
        setSaveProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error('Auto-save error:', error);
      setSaving(false);
      setSaveProgress(0);
    }
  }, [portfolioData, activeStep, isAuthenticated, user]);

  // Load saved data
  const loadSavedData = useCallback(async () => {
    try {
      // Try loading from database first if authenticated
      if (isAuthenticated && user) {
        try {
          const dbData = await dbService.loadPortfolio();
          if (dbData && dbData.type === 'professional_portfolio') {
            setPortfolioData(dbData);
            if (dbData.activeStep !== undefined) {
              setActiveStep(dbData.activeStep);
            }
            return; // Use database data
          }
        } catch (dbError) {
          console.warn('Database load failed, falling back to localStorage:', dbError);
        }
      }
      
      // Fallback to localStorage
      const savedData = localStorage.getItem('portfolio_builder_data');
      const savedStep = localStorage.getItem('portfolio_builder_step');
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setPortfolioData(parsedData);
      }
      
      if (savedStep) {
        setActiveStep(parseInt(savedStep, 10));
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, [isAuthenticated, user]);

  // Import GitHub data
  const importGitHubData = useCallback(() => {
    try {
      const githubUser = localStorage.getItem('github_user');
      if (githubUser) {
        const userData = JSON.parse(githubUser);
        setPortfolioData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            fullName: prev.personalInfo.fullName || userData.name || userData.login,
            github: userData.login,
            website: prev.personalInfo.website || userData.blog,
            location: prev.personalInfo.location || userData.location,
          },
          summary: prev.summary || userData.bio || '',
        }));
      }
    } catch (error) {
      console.error('Error importing GitHub data:', error);
    }
  }, []);

  // Import LinkedIn data
  const importLinkedInData = useCallback(() => {
    try {
      const linkedinUrl = localStorage.getItem('linkedin_profile_url');
      const linkedinUsername = localStorage.getItem('linkedin_username');
      
      if (linkedinUrl) {
        setPortfolioData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            linkedin: linkedinUrl,
          },
        }));
      }
    } catch (error) {
      console.error('Error importing LinkedIn data:', error);
    }
  }, []);

  // Step navigation
  const handleNext = useCallback(() => {
    setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const handleBack = useCallback(() => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  }, []);

  const handleStepClick = useCallback((stepIndex: number) => {
    setActiveStep(stepIndex);
  }, []);

  // Complete portfolio handler
  const handleCompletePortfolio = useCallback(async () => {
    try {
      // Save final portfolio data
      await handleAutoSave();
      
      // Check if we have essential data
      if (!portfolioData.personalInfo.fullName || !portfolioData.personalInfo.email) {
        alert('Please fill in at least your name and email before completing the portfolio.');
        return;
      }
      
      // Open deployment dialog
      setDeploymentDialogOpen(true);
    } catch (error) {
      console.error('Error completing portfolio:', error);
      alert('Error completing portfolio. Please try again.');
    }
  }, [handleAutoSave, portfolioData]);

  // Handle deployment to GitHub Pages
  const handleDeploy = useCallback(async (config: DeploymentConfig, discoveredProjects: ProjectInfo[]) => {
    try {
      // Generate complete portfolio HTML
      const { html } = PortfolioGeneratorService.generatePortfolioHTML(
        portfolioData,
        discoveredProjects,
        {
          repository: `${config.owner}/${config.repo}`,
          githubPagesUrl: `https://${config.owner}.github.io/${config.repo}/`,
        }
      );

      // Deploy to GitHub Pages
      const deploymentService = new GitHubDeploymentService(config.token);
      const portfolioUrl = await deploymentService.deployToGitHubPages(config, html);
      
      setDeployedPortfolioUrl(portfolioUrl);
      
      // Show success and offer to view portfolio
      setTimeout(() => {
        if (window.confirm(`🎉 Portfolio Deployed Successfully!\n\nYour portfolio is now live at:\n${portfolioUrl}\n\nClick OK to view your live portfolio!`)) {
          window.open(portfolioUrl, '_blank');
        }
      }, 1000);
      
    } catch (error) {
      console.error('Deployment error:', error);
      throw error;
    }
  }, [portfolioData]);

  // Handle LinkedIn data import
  const handleLinkedInDataImported = useCallback((
    importedData: Partial<ProfessionalPortfolioData>,
    recommendations: LinkedInRecommendation[],
    posts: LinkedInPost[]
  ) => {
    // Merge imported data with existing portfolio data
    setPortfolioData(prevData => ({
      ...prevData,
      ...importedData,
      personalInfo: {
        ...prevData.personalInfo,
        ...importedData.personalInfo,
      },
      experience: importedData.experience || prevData.experience,
      education: importedData.education || prevData.education,
      skills: importedData.skills || prevData.skills,
      certifications: importedData.certifications || prevData.certifications,
      languages: importedData.languages || prevData.languages,
      summary: importedData.summary || prevData.summary,
    }));

    // Store LinkedIn-specific data
    setLinkedinRecommendations(recommendations);
    setLinkedinPosts(posts);

    // Auto-advance to next step
    setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  // Data update handlers
  const updatePersonalInfo = useCallback((field: string, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  }, []);

  const updateSummary = useCallback((summary: string) => {
    setPortfolioData(prev => ({
      ...prev,
      summary,
    }));
  }, []);

  const updateTheme = useCallback((field: string, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [field]: value,
      },
    }));
  }, []);

  // Add item handlers
  const addExperience = useCallback(() => {
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
  }, []);

  const addSkill = useCallback(() => {
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
  }, []);

  const addProject = useCallback(() => {
    const newProject: EnhancedProject = {
      id: Date.now().toString(),
      title: '',
      description: '',
      technologies: [],
      github_url: '',
      live_url: '',
      image: '',
      featured: false,
      category: 'web',
      status: 'completed',
      start_date: '',
      end_date: '',
      collaborators: [],
      demoUrl: '',
      githubUrl: '',
      imageUrl: '',
    };
    setPortfolioData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  }, []);

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    let completed = 0;
    const total = steps.length;
    
    steps.forEach((step, index) => {
      switch (step.id) {
        case 'personal':
          if (portfolioData.personalInfo.fullName && portfolioData.personalInfo.email) {
            completed++;
          }
          break;
        case 'summary':
          if (portfolioData.summary.trim()) {
            completed++;
          }
          break;
        case 'experience':
          if (portfolioData.experience.length > 0) {
            completed++;
          }
          break;
        case 'skills':
          if (portfolioData.skills.length > 0) {
            completed++;
          }
          break;
        case 'projects':
          if (portfolioData.projects.length > 0) {
            completed++;
          }
          break;
        case 'theme':
          completed++; // Theme always has default values
          break;
        default:
          if (index <= activeStep) {
            completed++;
          }
      }
    });
    
    return Math.round((completed / total) * 100);
  }, [portfolioData, activeStep, steps]);

  // Render step content
  const renderStepContent = useCallback((stepId: string) => {
    switch (stepId) {
      case 'personal':
        return (
          <SafeWrapper name="PersonalInfoStep">
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Full Name *"
                  value={portfolioData.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Professional Title *"
                  value={portfolioData.personalInfo.title}
                  onChange={(e) => updatePersonalInfo('title', e.target.value)}
                  fullWidth
                  margin="normal"
                  placeholder="e.g., Senior Software Engineer"
                />
                <TextField
                  label="Email *"
                  type="email"
                  value={portfolioData.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Phone"
                  value={portfolioData.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="WhatsApp Number"
                  value={portfolioData.personalInfo.whatsapp}
                  onChange={(e) => updatePersonalInfo('whatsapp', e.target.value)}
                  fullWidth
                  margin="normal"
                  placeholder="+1234567890"
                  helperText="Include country code for international contacts"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Location"
                  value={portfolioData.personalInfo.location}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  fullWidth
                  margin="normal"
                  placeholder="City, Country"
                />
                <TextField
                  label="Website"
                  value={portfolioData.personalInfo.website}
                  onChange={(e) => updatePersonalInfo('website', e.target.value)}
                  fullWidth
                  margin="normal"
                  placeholder="https://yourwebsite.com"
                />
                <TextField
                  label="LinkedIn Profile"
                  value={portfolioData.personalInfo.linkedin}
                  onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                  fullWidth
                  margin="normal"
                  placeholder="https://linkedin.com/in/yourname"
                />
                <TextField
                  label="GitHub Username"
                  value={portfolioData.personalInfo.github}
                  onChange={(e) => updatePersonalInfo('github', e.target.value)}
                  fullWidth
                  margin="normal"
                  placeholder="yourusername"
                />
              </Grid>
            </Grid>
            
            {connectionStatus.github.connected && (
              <Alert severity="info" sx={{ mt: 2 }}>
                GitHub data imported automatically! You can edit the fields above.
              </Alert>
            )}
          </SafeWrapper>
        );

      case 'linkedin':
        return (
          <SafeWrapper name="LinkedInImportStep">
            <LinkedInImport
              onDataImported={handleLinkedInDataImported}
              existingData={portfolioData}
            />
            
            {(linkedinRecommendations.length > 0 || linkedinPosts.length > 0) && (
              <Alert severity="success" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  ✅ LinkedIn data imported successfully! 
                  {linkedinRecommendations.length > 0 && ` ${linkedinRecommendations.length} recommendations`}
                  {linkedinPosts.length > 0 && ` ${linkedinPosts.length} posts`} imported.
                </Typography>
              </Alert>
            )}

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>LinkedIn Integration:</strong> Connect your LinkedIn account to automatically import 
                your profile information, work experience, education, skills, recommendations, and recent posts. 
                This will pre-populate your portfolio with professional data and enhance your summary with 
                insights from your LinkedIn activity.
              </Typography>
            </Alert>
          </SafeWrapper>
        );

      case 'summary':
        return (
          <SafeWrapper name="SummaryStep">
            <TextField
              label="Professional Summary *"
              multiline
              rows={6}
              value={portfolioData.summary}
              onChange={(e) => updateSummary(e.target.value)}
              fullWidth
              placeholder="Write a compelling summary of your professional experience, skills, and career goals..."
            />
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Tip:</strong> Keep it concise (2-3 sentences) and focus on your most relevant achievements and what you can bring to potential employers.
              </Typography>
            </Alert>
          </SafeWrapper>
        );

      case 'experience':
        return (
          <SafeWrapper name="ExperienceStep">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Work Experience</Typography>
              <Button
                startIcon={<Add />}
                onClick={addExperience}
                variant="outlined"
              >
                Add Experience
              </Button>
            </Box>
            
            {portfolioData.experience.length === 0 ? (
              <Alert severity="info">
                Add your work experience to showcase your professional background.
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {portfolioData.experience.map((exp, index) => (
                  <Grid item xs={12} key={exp.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Experience #{index + 1}
                        </Typography>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Job Title"
                              value={exp.title}
                              onChange={(e) => {
                                const updated = portfolioData.experience.map(item =>
                                  item.id === exp.id ? { ...item, title: e.target.value } : item
                                );
                                setPortfolioData(prev => ({ ...prev, experience: updated }));
                              }}
                              fullWidth
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Company"
                              value={exp.company}
                              onChange={(e) => {
                                const updated = portfolioData.experience.map(item =>
                                  item.id === exp.id ? { ...item, company: e.target.value } : item
                                );
                                setPortfolioData(prev => ({ ...prev, experience: updated }));
                              }}
                              fullWidth
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              label="Description"
                              multiline
                              rows={3}
                              value={exp.description}
                              onChange={(e) => {
                                const updated = portfolioData.experience.map(item =>
                                  item.id === exp.id ? { ...item, description: e.target.value } : item
                                );
                                setPortfolioData(prev => ({ ...prev, experience: updated }));
                              }}
                              fullWidth
                              size="small"
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </SafeWrapper>
        );

      case 'skills':
        return (
          <SafeWrapper name="SkillsStep">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Skills & Expertise</Typography>
              <Button
                startIcon={<Add />}
                onClick={addSkill}
                variant="outlined"
              >
                Add Skill
              </Button>
            </Box>
            
            {portfolioData.skills.length === 0 ? (
              <Alert severity="info">
                Add your technical and soft skills with proficiency levels.
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {portfolioData.skills.map((skill, index) => (
                  <Grid item xs={12} sm={6} md={4} key={skill.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <TextField
                          label="Skill Name"
                          value={skill.name}
                          onChange={(e) => {
                            const updated = portfolioData.skills.map(item =>
                              item.id === skill.id ? { ...item, name: e.target.value } : item
                            );
                            setPortfolioData(prev => ({ ...prev, skills: updated }));
                          }}
                          fullWidth
                          size="small"
                          margin="dense"
                        />
                        <TextField
                          label="Category"
                          value={skill.category}
                          onChange={(e) => {
                            const updated = portfolioData.skills.map(item =>
                              item.id === skill.id ? { ...item, category: e.target.value } : item
                            );
                            setPortfolioData(prev => ({ ...prev, skills: updated }));
                          }}
                          fullWidth
                          size="small"
                          margin="dense"
                        />
                        <Typography variant="caption" color="text.secondary">
                          Proficiency: {skill.level}/10
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </SafeWrapper>
        );

      case 'projects':
        return (
          <SafeWrapper name="ProjectsStep">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Projects & Portfolio</Typography>
              <Button
                startIcon={<Add />}
                onClick={addProject}
                variant="outlined"
              >
                Add Project
              </Button>
            </Box>
            
            {portfolioData.projects.length === 0 ? (
              <Alert severity="info">
                Showcase your best projects and work samples.
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {portfolioData.projects.map((project, index) => (
                  <Grid item xs={12} md={6} key={project.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Project #{index + 1}
                        </Typography>
                        <TextField
                          label="Project Title"
                          value={project.title}
                          onChange={(e) => {
                            const updated = portfolioData.projects.map(item =>
                              item.id === project.id ? { ...item, title: e.target.value } : item
                            );
                            setPortfolioData(prev => ({ ...prev, projects: updated }));
                          }}
                          fullWidth
                          size="small"
                          margin="dense"
                        />
                        <TextField
                          label="Description"
                          multiline
                          rows={2}
                          value={project.description}
                          onChange={(e) => {
                            const updated = portfolioData.projects.map(item =>
                              item.id === project.id ? { ...item, description: e.target.value } : item
                            );
                            setPortfolioData(prev => ({ ...prev, projects: updated }));
                          }}
                          fullWidth
                          size="small"
                          margin="dense"
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </SafeWrapper>
        );

      case 'theme':
        return (
          <SafeWrapper name="ThemeStep">
            <Typography variant="h6" gutterBottom>
              Customize Your Portfolio Theme
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
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
                  />
                  <TextField
                    value={portfolioData.theme.primaryColor}
                    onChange={(e) => updateTheme('primaryColor', e.target.value)}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Template Style
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {['executive', 'professional', 'modern', 'classic', 'minimal'].map((template) => (
                    <Chip
                      key={template}
                      label={template.charAt(0).toUpperCase() + template.slice(1)}
                      onClick={() => updateTheme('template', template)}
                      color={portfolioData.theme.template === template ? 'primary' : 'default'}
                      clickable
                      variant={template === 'executive' ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
            
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                💡 <strong>Template Info:</strong> 
                <br/>
                • <strong>Executive</strong> - Premium design with contact icons in header (recommended)
                <br/>
                • <strong>Professional</strong> - Clean gradient design with modern sections
                <br/>
                • <strong>Modern</strong> - Bold with angled header and animations
                <br/>
                • <strong>Classic</strong> - Traditional formal layout
                <br/>
                • <strong>Minimal</strong> - Clean lines with subtle accents
              </Typography>
            </Alert>
            
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2">
                🎉 Great! Your portfolio is ready. Click "Complete" to deploy or "Preview" to see how it looks.
              </Typography>
            </Alert>
          </SafeWrapper>
        );

      default:
        return (
          <SafeWrapper name={`${stepId}Step`}>
            <Alert severity="info">
              <Typography variant="body2">
                This section is ready for your content. You can continue to the next step or add information here.
              </Typography>
            </Alert>
          </SafeWrapper>
        );
    }
  }, [
    portfolioData, 
    connectionStatus, 
    updatePersonalInfo, 
    updateSummary, 
    updateTheme, 
    addExperience, 
    addSkill, 
    addProject
  ]);

  // Main render
  return (
    <SafeWrapper name="CompleteProfessionalBuilder">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => handleNavigation('/dashboard')}
              variant="outlined"
            >
              Back to Dashboard
            </Button>
            <Typography variant="h4" fontWeight="bold">
              Professional Portfolio Builder
            </Typography>
            <Tooltip title="Get help with GitHub Pages deployment">
              <IconButton 
                onClick={() => setHelpDialogOpen(true)}
                color="primary"
              >
                <Help />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Create a stunning professional portfolio that showcases your expertise
          </Typography>
          
          {/* Progress Indicator */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={completionPercentage} 
              sx={{ flex: 1, height: 8, borderRadius: 4 }}
            />
            <Typography variant="body2" color="text.secondary">
              {completionPercentage}% Complete
            </Typography>
          </Box>
          
          {/* Auth Prompt */}
          {!isAuthenticated && (
            <Alert severity="info" sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  💾 <strong>Sign in to save your portfolio to the cloud</strong> and access it from any device. Currently saving locally only.
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setAuthDialogOpen(true)}
                >
                  Sign In
                </Button>
              </Box>
            </Alert>
          )}
          
          {/* Cloud Save Success */}
          {isAuthenticated && user && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2">
                ☁️ <strong>Signed in as {user.displayName || user.email}</strong> - Your portfolio is being saved to the cloud automatically.
              </Typography>
            </Alert>
          )}
          
          {/* Auto-save indicator */}
          {saving && (
            <Box sx={{ mt: 1 }}>
              <LinearProgress variant="determinate" value={saveProgress} sx={{ height: 4, borderRadius: 2 }} />
              <Typography variant="caption" color="text.secondary">
                Auto-saving...
              </Typography>
            </Box>
          )}
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.id}>
              <StepLabel 
                icon={step.icon}
                onClick={() => handleStepClick(index)}
                sx={{ cursor: 'pointer' }}
              >
                <Box>
                  <Typography variant="h6">{step.label}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
              </StepLabel>
              <StepContent>
                <Box sx={{ mb: 3 }}>
                  {renderStepContent(step.id)}
                </Box>
                
                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    variant="outlined"
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={index === steps.length - 1 ? handleCompletePortfolio : handleNext}
                    endIcon={index === steps.length - 1 ? <CloudUpload /> : <ArrowForward />}
                    color={index === steps.length - 1 ? 'success' : 'primary'}
                  >
                    {index === steps.length - 1 ? 'Complete Portfolio' : 'Save & Continue'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Preview />}
                    onClick={() => setShowPreview(true)}
                  >
                    Preview
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {/* Completion Message */}
        {activeStep === steps.length - 1 && (
          <Alert severity="success" sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              🎉 Portfolio Complete!
            </Typography>
            <Typography variant="body2">
              Your professional portfolio is ready! You can preview it, make final adjustments, or deploy it to showcase your work.
            </Typography>
          </Alert>
        )}

        {/* Floating Save Button */}
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={handleAutoSave}
          disabled={saving}
        >
          <Save />
        </Fab>

        {/* Preview Dialog */}
        <Dialog
          open={showPreview}
          onClose={() => setShowPreview(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{ sx: { height: '90vh' } }}
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
          <DialogContent sx={{ p: 0, overflow: 'auto' }}>
            <ProfessionalTemplate data={portfolioData} preview={true} />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setShowPreview(false)} variant="outlined">
              Close Preview
            </Button>
            <Button 
              variant="contained" 
              onClick={() => setShowPreview(false)}
              startIcon={<Edit />}
            >
              Continue Editing
            </Button>
            <Button 
              variant="contained" 
              color="success"
              onClick={() => {
                setShowPreview(false);
                handleCompletePortfolio();
              }}
              startIcon={<CloudUpload />}
            >
              Complete Portfolio
            </Button>
          </DialogActions>
        </Dialog>

        {/* Auth Dialog */}
        <AuthDialog
          open={authDialogOpen}
          onClose={() => setAuthDialogOpen(false)}
          onSuccess={() => {
            setAuthDialogOpen(false);
            // Reload data after authentication
            loadSavedData();
          }}
        />

        {/* Repository Configuration Dialog */}
        <RepositoryConfiguration
          open={deploymentDialogOpen}
          onClose={() => setDeploymentDialogOpen(false)}
          onDeploy={handleDeploy}
          portfolioData={portfolioData}
        />

        {/* Help Dialog */}
        <PortfolioHelp
          open={helpDialogOpen}
          onClose={() => setHelpDialogOpen(false)}
        />
      </Container>
    </SafeWrapper>
  );
};

export default CompleteProfessionalBuilder;