import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  AlertTitle,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  GitHub,
  CloudUpload,
  Info,
  CheckCircle,
  Warning,
  ArrowForward,
  ArrowBack,
  Refresh,
  Launch,
  Help,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

import GitHubDeploymentService, { DeploymentConfig, ProjectInfo } from '../../services/githubDeployment';
import { showSuccess, showError, showLoading, dismissToast } from '../../utils';

interface RepositoryConfigurationProps {
  open: boolean;
  onClose: () => void;
  onDeploy: (config: DeploymentConfig, projects: ProjectInfo[]) => void;
  portfolioData: any;
}

const RepositoryConfiguration: React.FC<RepositoryConfigurationProps> = ({
  open,
  onClose,
  onDeploy,
  portfolioData,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<DeploymentConfig>({
    owner: '',
    repo: '',
    branch: 'gh-pages',
    token: '',
  });
  const [repositoryInfo, setRepositoryInfo] = useState<any>(null);
  const [discoveredProjects, setDiscoveredProjects] = useState<ProjectInfo[]>([]);
  const [error, setError] = useState<string>('');

  const steps = [
    {
      label: 'Repository Details',
      description: 'Configure your GitHub repository for deployment',
    },
    {
      label: 'Verify & Discover',
      description: 'Verify repository access and discover projects',
    },
    {
      label: 'Deploy Portfolio',
      description: 'Deploy your portfolio to GitHub Pages',
    },
  ];

  // Load saved configuration
  useEffect(() => {
    if (open) {
      const savedConfig = localStorage.getItem('github_deployment_config');
      if (savedConfig) {
        try {
          setConfig(JSON.parse(savedConfig));
        } catch (error) {
          console.error('Error loading saved config:', error);
        }
      }
    }
  }, [open]);

  const handleInputChange = useCallback((field: keyof DeploymentConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setError('');
  }, []);

  const handleNext = useCallback(() => {
    setActiveStep(prev => prev + 1);
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep(prev => prev - 1);
  }, []);

  const validateStep = useCallback((step: number): boolean => {
    switch (step) {
      case 0:
        if (!config.owner || !config.repo || !config.token) {
          setError('Please fill in all required fields');
          return false;
        }
        if (!config.token.startsWith('ghp_') && !config.token.startsWith('github_pat_')) {
          setError('Please enter a valid GitHub Personal Access Token');
          return false;
        }
        return true;
      case 1:
        return repositoryInfo !== null;
      default:
        return true;
    }
  }, [config, repositoryInfo]);

  const handleVerifyRepository = useCallback(async () => {
    if (!validateStep(0)) return;

    setLoading(true);
    setError('');

    try {
      const deploymentService = new GitHubDeploymentService(config.token);
      
      // Get repository information
      const repoInfo = await deploymentService.getRepositoryInfo(config.owner, config.repo);
      setRepositoryInfo(repoInfo);

      // Discover projects
      const projects = await deploymentService.discoverProjects(config.owner, config.repo, config.token);
      setDiscoveredProjects(projects);

      // Save configuration
      localStorage.setItem('github_deployment_config', JSON.stringify(config));

      showSuccess(`Repository verified! Found ${projects.length} projects.`);
      handleNext();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify repository';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [config, validateStep, handleNext]);

  const handleDeploy = useCallback(async () => {
    setLoading(true);
    const loadingToast = showLoading('Deploying portfolio to GitHub Pages...');

    try {
      await onDeploy(config, discoveredProjects);
      dismissToast(loadingToast);
      showSuccess('Portfolio deployed successfully!');
      onClose();
    } catch (error) {
      dismissToast(loadingToast);
      const errorMessage = error instanceof Error ? error.message : 'Deployment failed';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [config, discoveredProjects, onDeploy, onClose]);

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>Setup Instructions</AlertTitle>
              <Typography variant="body2">
                1. Create a <strong>Personal Access Token</strong> in GitHub with <code>repo</code> permissions<br/>
                2. Ensure your repository has a <code>projects</code> folder with project subfolders<br/>
                3. Each project subfolder should contain a <code>README.md</code> file
              </Typography>
            </Alert>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="GitHub Username/Organization"
                  value={config.owner}
                  onChange={(e) => handleInputChange('owner', e.target.value)}
                  fullWidth
                  margin="normal"
                  placeholder="e.g., amantalwar04"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Repository Name"
                  value={config.repo}
                  onChange={(e) => handleInputChange('repo', e.target.value)}
                  fullWidth
                  margin="normal"
                  placeholder="e.g., portfolio"
                  required
                />
              </Grid>
            </Grid>

            <TextField
              label="Branch for GitHub Pages"
              value={config.branch}
              onChange={(e) => handleInputChange('branch', e.target.value)}
              fullWidth
              margin="normal"
              placeholder="gh-pages"
              helperText="Branch where your portfolio will be deployed"
            />

            <TextField
              label="GitHub Personal Access Token"
              type="password"
              value={config.token}
              onChange={(e) => handleInputChange('token', e.target.value)}
              fullWidth
              margin="normal"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              required
              helperText={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>Need a token?</span>
                  <Button 
                    size="small" 
                    href="https://github.com/settings/tokens" 
                    target="_blank"
                    startIcon={<Launch />}
                  >
                    Create Token
                  </Button>
                </Box>
              }
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            {repositoryInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <CheckCircle color="success" />
                      <Typography variant="h6">Repository Verified</Typography>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">Repository:</Typography>
                        <Typography variant="body1">{repositoryInfo.fullName}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">Default Branch:</Typography>
                        <Typography variant="body1">{repositoryInfo.defaultBranch}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Description:</Typography>
                        <Typography variant="body1">{repositoryInfo.description || 'No description'}</Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Chip 
                        label={repositoryInfo.hasPages ? "Pages Enabled" : "Pages Not Enabled"} 
                        color={repositoryInfo.hasPages ? "success" : "warning"}
                        size="small"
                      />
                      <Chip 
                        label={`${discoveredProjects.length} Projects Found`} 
                        color="info"
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {discoveredProjects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Typography variant="h6" gutterBottom>
                  Discovered Projects
                </Typography>
                <Grid container spacing={2}>
                  {discoveredProjects.map((project, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {project.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {project.description}
                          </Typography>
                          {project.technologies.length > 0 && (
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {project.technologies.slice(0, 3).map((tech, techIndex) => (
                                <Chip key={techIndex} label={tech} size="small" variant="outlined" />
                              ))}
                              {project.technologies.length > 3 && (
                                <Chip label={`+${project.technologies.length - 3}`} size="small" variant="outlined" />
                              )}
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            )}

            {discoveredProjects.length === 0 && repositoryInfo && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <AlertTitle>No Projects Found</AlertTitle>
                <Typography variant="body2">
                  No projects folder found in your repository. Your portfolio will be created without auto-discovered projects.<br/>
                  <strong>To add projects:</strong> Create a <code>projects</code> folder with subfolders for each project.
                </Typography>
              </Alert>
            )}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              <AlertTitle>Ready to Deploy!</AlertTitle>
              <Typography variant="body2">
                Your portfolio will be deployed to: <strong>{repositoryInfo?.pagesUrl}</strong>
              </Typography>
            </Alert>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Deployment Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Target Repository:</Typography>
                    <Typography variant="body1">{config.owner}/{config.repo}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Deploy Branch:</Typography>
                    <Typography variant="body1">{config.branch}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Portfolio Sections:</Typography>
                    <Typography variant="body1">
                      {portfolioData.personalInfo.fullName ? 'Personal Info, ' : ''}
                      {portfolioData.summary ? 'Summary, ' : ''}
                      {portfolioData.experience.length > 0 ? 'Experience, ' : ''}
                      {portfolioData.skills.length > 0 ? 'Skills, ' : ''}
                      Projects
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Auto-discovered Projects:</Typography>
                    <Typography variant="body1">{discoveredProjects.length} projects</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CloudUpload />
          <Typography variant="h6">Deploy to GitHub Pages</Typography>
          <Tooltip title="Get help with GitHub Pages deployment">
            <IconButton 
              size="small" 
              href="https://docs.github.com/en/pages/getting-started-with-github-pages"
              target="_blank"
            >
              <Help />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography variant="h6">{step.label}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </StepLabel>
              <StepContent>
                {renderStepContent(index)}
                
                <Box sx={{ mb: 2, mt: 3 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      variant="outlined"
                    >
                      <ArrowBack sx={{ mr: 1 }} />
                      Back
                    </Button>
                    
                    {index === 0 && (
                      <Button
                        variant="contained"
                        onClick={handleVerifyRepository}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <Refresh />}
                      >
                        {loading ? 'Verifying...' : 'Verify Repository'}
                      </Button>
                    )}
                    
                    {index === 1 && repositoryInfo && (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        endIcon={<ArrowForward />}
                      >
                        Continue to Deploy
                      </Button>
                    )}
                    
                    {index === 2 && (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={handleDeploy}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <CloudUpload />}
                      >
                        {loading ? 'Deploying...' : 'Deploy Portfolio'}
                      </Button>
                    )}
                  </Box>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RepositoryConfiguration;