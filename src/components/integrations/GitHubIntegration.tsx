import React, { useState } from 'react';
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
  Link,
  Step,
  Stepper,
  StepLabel,
  StepContent,
  Chip,
  CircularProgress,
} from '@mui/material';
import { GitHub, CheckCircle, Warning, Info } from '@mui/icons-material';
import { useGitHub } from '../../hooks/useGitHub';

interface GitHubIntegrationProps {
  open: boolean;
  onClose: () => void;
}

const GitHubIntegration: React.FC<GitHubIntegrationProps> = ({ open, onClose }) => {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [mode, setMode] = useState<'token' | 'username'>('username');
  const [activeStep, setActiveStep] = useState(0);

  const { 
    user, 
    repositories, 
    loading, 
    error, 
    authenticateWithToken, 
    fetchUserByUsername,
    clearError 
  } = useGitHub();

  const handleTokenAuth = async () => {
    if (!token.trim()) return;
    
    try {
      await authenticateWithToken(token);
      setActiveStep(2);
    } catch (err) {
      // Error is already handled by the hook
    }
  };

  const handleUsernameAuth = async () => {
    if (!username.trim()) return;
    
    try {
      await fetchUserByUsername(username);
      setActiveStep(2);
    } catch (err) {
      // Error is already handled by the hook
    }
  };

  const handleClose = () => {
    setToken('');
    setUsername('');
    setActiveStep(0);
    clearError();
    onClose();
  };

  const steps = [
    'Choose Connection Method',
    'Enter Credentials',
    'Verify Connection',
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <GitHub />
          <Typography variant="h6">Connect GitHub Account</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Stepper activeStep={activeStep} orientation="vertical">
          <Step>
            <StepLabel>Choose Connection Method</StepLabel>
            <StepContent>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                  variant={mode === 'username' ? 'contained' : 'outlined'}
                  onClick={() => setMode('username')}
                  startIcon={<Info />}
                >
                  Public Profile
                </Button>
                <Button
                  variant={mode === 'token' ? 'contained' : 'outlined'}
                  onClick={() => setMode('token')}
                  startIcon={<GitHub />}
                >
                  Personal Access Token
                </Button>
              </Box>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                {mode === 'username' 
                  ? 'Enter your GitHub username to load public repositories and profile information.'
                  : 'Use a Personal Access Token for full access to private repositories and advanced features.'
                }
              </Alert>
              
              <Button variant="contained" onClick={() => setActiveStep(1)}>
                Continue
              </Button>
            </StepContent>
          </Step>

          <Step>
            <StepLabel>Enter Credentials</StepLabel>
            <StepContent>
              {mode === 'username' ? (
                <Box>
                  <TextField
                    fullWidth
                    label="GitHub Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g., octocat"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    This will load your public GitHub profile and repositories.
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <TextField
                    fullWidth
                    label="Personal Access Token"
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    To create a Personal Access Token:
                  </Typography>
                  <Typography variant="body2" component="ol" sx={{ pl: 2, mb: 2 }}>
                    <li>Go to <Link href="https://github.com/settings/tokens" target="_blank">GitHub Settings → Developer settings → Personal access tokens</Link></li>
                    <li>Click "Generate new token (classic)"</li>
                    <li>Select scopes: <Chip label="repo" size="small" /> <Chip label="user" size="small" /></li>
                    <li>Copy the generated token</li>
                  </Typography>
                </Box>
              )}
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="contained" 
                  onClick={mode === 'username' ? handleUsernameAuth : handleTokenAuth}
                  disabled={loading || (mode === 'username' ? !username.trim() : !token.trim())}
                  startIcon={loading ? <CircularProgress size={16} /> : <GitHub />}
                >
                  {loading ? 'Connecting...' : 'Connect'}
                </Button>
                <Button onClick={() => setActiveStep(0)}>
                  Back
                </Button>
              </Box>
            </StepContent>
          </Step>

          <Step>
            <StepLabel>Connection Verified</StepLabel>
            <StepContent>
              {user && (
                <Box>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle />
                      Successfully connected to GitHub!
                    </Box>
                  </Alert>
                  
                  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {user.name || user.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      @{user.username}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {user.bio}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {repositories.length} repositories loaded
                    </Typography>
                  </Box>
                </Box>
              )}
            </StepContent>
          </Step>
        </Stepper>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          {user ? 'Done' : 'Cancel'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GitHubIntegration;