import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Paper,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
} from '@mui/material';
import {
  GitHub,
  LinkedIn,
  Build,
  Description,
  Visibility,
  Settings,
  Star,
  TrendingUp,
  CheckCircle,
  Warning,
  Code,
  Person,
  SmartToy,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser, usePortfolio } from '../store';
import { useGitHub } from '../hooks/useGitHub';
import { useLinkedIn } from '../hooks/useLinkedIn';
import { useAI } from '../hooks/useAI';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const portfolio = usePortfolio();
  
  const [githubTokenDialog, setGithubTokenDialog] = useState(false);
  const [linkedinTokenDialog, setLinkedinTokenDialog] = useState(false);
  const [aiKeyDialog, setAiKeyDialog] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [linkedinToken, setLinkedinToken] = useState('');
  const [aiKey, setAiKey] = useState('');
  
  const { 
    authenticateWithToken: authenticateGithub, 
    repositories, 
    loading: githubLoading,
    error: githubError,
  } = useGitHub();
  
  const { 
    authenticateWithToken: authenticateLinkedin,
    loading: linkedinLoading,
    error: linkedinError,
  } = useLinkedIn();
  
  const { 
    setApiKey: setAIKey,
  } = useAI();

  // Ensure repositories is always an array
  const safeRepositories = repositories || [];
  
  // Quick stats with proper null checks
  const stats = {
    portfolioCompletion: portfolio ? 75 : 0,
    totalProjects: safeRepositories.length,
    githubStars: safeRepositories.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
    lastUpdated: portfolio?.updatedAt ? new Date(portfolio.updatedAt).toLocaleDateString() : null,
  };
  
  const integrationStatus = {
    github: !!user?.username,
    linkedin: !!localStorage.getItem('linkedin_token'),
    ai: !!localStorage.getItem('ai_api_key'),
  };
  
  const completionTasks = [
    { 
      id: 'github', 
      label: 'Connect GitHub', 
      completed: integrationStatus.github, 
      action: () => setGithubTokenDialog(true) 
    },
    { 
      id: 'linkedin', 
      label: 'Connect LinkedIn', 
      completed: integrationStatus.linkedin, 
      action: () => setLinkedinTokenDialog(true) 
    },
    { 
      id: 'ai', 
      label: 'Setup AI Assistant', 
      completed: integrationStatus.ai, 
      action: () => setAiKeyDialog(true) 
    },
    { 
      id: 'portfolio', 
      label: 'Build Portfolio', 
      completed: !!portfolio, 
      action: () => navigate('/builder') 
    },
    { 
      id: 'resume', 
      label: 'Generate Resume', 
      completed: false, 
      action: () => navigate('/resume') 
    },
  ];
  
  const completedTasks = completionTasks.filter(task => task.completed).length;
  const completionPercentage = (completedTasks / completionTasks.length) * 100;
  
  const handleGithubAuth = async () => {
    try {
      await authenticateGithub(githubToken);
      setGithubTokenDialog(false);
      setGithubToken('');
    } catch (error) {
      console.error('GitHub authentication failed:', error);
    }
  };
  
  const handleLinkedinAuth = async () => {
    try {
      await authenticateLinkedin(linkedinToken);
      setLinkedinTokenDialog(false);
      setLinkedinToken('');
    } catch (error) {
      console.error('LinkedIn authentication failed:', error);
    }
  };
  
  const handleAISetup = () => {
    setAIKey(aiKey);
    setAiKeyDialog(false);
    setAiKey('');
  };
  
  const quickActions = [
    {
      title: 'Build Portfolio',
      description: 'Create and customize your portfolio',
      icon: <Build />,
      color: '#667eea',
      action: () => navigate('/builder'),
    },
    {
      title: 'Generate Resume',
      description: 'Create professional resumes',
      icon: <Description />,
      color: '#10b981',
      action: () => navigate('/resume'),
    },
    {
      title: 'Preview Portfolio',
      description: 'See how your portfolio looks',
      icon: <Visibility />,
      color: '#f59e0b',
      action: () => navigate('/preview'),
    },
    {
      title: 'Settings',
      description: 'Manage your preferences',
      icon: <Settings />,
      color: '#8b5cf6',
      action: () => navigate('/settings'),
    },
  ];
  
  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Welcome to Portfolio Generator
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Connect your GitHub account to get started building your professional portfolio.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => setGithubTokenDialog(true)}
            startIcon={<GitHub />}
          >
            Connect GitHub
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Header */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{ mb: 4 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
          <Avatar
            src={user.avatar}
            sx={{ width: 64, height: 64 }}
          >
            {user.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Welcome back, {user.name.split(' ')[0]}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Ready to build something amazing today?
            </Typography>
          </Box>
        </Box>
        
        {(githubError || linkedinError) && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {githubError || linkedinError}
          </Alert>
        )}
      </MotionBox>
      
      {/* Progress Overview */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        sx={{ mb: 4 }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Setup Progress
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={completionPercentage}
              sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
            />
            <Typography variant="body2" fontWeight="bold">
              {Math.round(completionPercentage)}%
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {completedTasks} of {completionTasks.length} tasks completed
          </Typography>
          
          <List sx={{ mt: 2 }}>
            {completionTasks.map((task) => (
              <ListItem
                key={task.id}
                sx={{ px: 0 }}
                secondaryAction={
                  !task.completed && (
                    <Button size="small" onClick={task.action}>
                      Complete
                    </Button>
                  )
                }
              >
                <ListItemIcon>
                  {task.completed ? (
                    <CheckCircle sx={{ color: 'success.main' }} />
                  ) : (
                    <Warning sx={{ color: 'warning.main' }} />
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={task.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      textDecoration: task.completed ? 'line-through' : 'none',
                      opacity: task.completed ? 0.7 : 1,
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </MotionCard>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Quick Stats */}
        <Box sx={{ flex: { md: 2 } }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 3 }}>
            <MotionCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -4 }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUp sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {stats.portfolioCompletion}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Portfolio Complete
                </Typography>
              </CardContent>
            </MotionCard>
            
            <MotionCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -4 }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Code sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalProjects}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Projects
                </Typography>
              </CardContent>
            </MotionCard>
            
            <MotionCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -4 }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Star sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {stats.githubStars}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  GitHub Stars
                </Typography>
              </CardContent>
            </MotionCard>
            
            <MotionCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ y: -4 }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Person sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  {stats.lastUpdated || 'Never'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last Updated
                </Typography>
              </CardContent>
            </MotionCard>
          </Box>
          
          {/* Quick Actions */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
              {quickActions.map((action, index) => (
                <Box key={action.title}>
                  <MotionCard
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    sx={{ cursor: 'pointer' }}
                    onClick={action.action}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: action.color }}>
                          {action.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {action.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {action.description}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </MotionCard>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        
        {/* Integration Status */}
        <Box sx={{ flex: { md: 1 } }}>
          <MotionCard
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Integrations
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GitHub />
                    <Typography variant="body2">GitHub</Typography>
                  </Box>
                  <Chip
                    label={integrationStatus.github ? 'Connected' : 'Not Connected'}
                    color={integrationStatus.github ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinkedIn />
                    <Typography variant="body2">LinkedIn</Typography>
                  </Box>
                  <Chip
                    label={integrationStatus.linkedin ? 'Connected' : 'Not Connected'}
                    color={integrationStatus.linkedin ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SmartToy />
                    <Typography variant="body2">AI Assistant</Typography>
                  </Box>
                  <Chip
                    label={integrationStatus.ai ? 'Active' : 'Inactive'}
                    color={integrationStatus.ai ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Recent Repositories
              </Typography>
              
                                      {safeRepositories.slice(0, 3).map((repo) => (
                <Box key={repo.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {repo.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {repo.language}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Star sx={{ fontSize: 14 }} />
                    <Typography variant="caption">
                      {repo.stargazers_count}
                    </Typography>
                  </Box>
                </Box>
              ))}
              
                                      {safeRepositories.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No repositories found
                </Typography>
              )}
            </CardContent>
          </MotionCard>
        </Box>
      </Box>
      
      {/* GitHub Token Dialog */}
      <Dialog open={githubTokenDialog} onClose={() => setGithubTokenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Connect GitHub Account</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            To access your repositories, please provide a GitHub personal access token.
          </Typography>
          <TextField
            fullWidth
            label="GitHub Personal Access Token"
            type="password"
            value={githubToken}
            onChange={(e) => setGithubToken(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxxxxx"
            helperText="Create a token at GitHub Settings > Developer settings > Personal access tokens"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGithubTokenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleGithubAuth} 
            variant="contained"
            disabled={!githubToken || githubLoading}
            startIcon={githubLoading ? <CircularProgress size={16} /> : <GitHub />}
          >
            Connect
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* LinkedIn Token Dialog */}
      <Dialog open={linkedinTokenDialog} onClose={() => setLinkedinTokenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Connect LinkedIn Account</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Provide your LinkedIn access token to import your professional profile.
          </Typography>
          <TextField
            fullWidth
            label="LinkedIn Access Token"
            type="password"
            value={linkedinToken}
            onChange={(e) => setLinkedinToken(e.target.value)}
            placeholder="Enter your LinkedIn access token"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkedinTokenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleLinkedinAuth} 
            variant="contained"
            disabled={!linkedinToken || linkedinLoading}
            startIcon={linkedinLoading ? <CircularProgress size={16} /> : <LinkedIn />}
          >
            Connect
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* AI Key Dialog */}
      <Dialog open={aiKeyDialog} onClose={() => setAiKeyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Setup AI Assistant</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add your OpenAI API key to enable AI-powered content optimization.
          </Typography>
          <TextField
            fullWidth
            label="OpenAI API Key"
            type="password"
            value={aiKey}
            onChange={(e) => setAiKey(e.target.value)}
            placeholder="sk-xxxxxxxxxxxxxxxxxx"
            helperText="Get your API key from OpenAI Platform"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAiKeyDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAISetup} 
            variant="contained"
            disabled={!aiKey}
            startIcon={<SmartToy />}
          >
            Setup
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DashboardPage;