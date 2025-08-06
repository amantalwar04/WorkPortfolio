import React, { useState, useCallback } from 'react';
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
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
} from '@mui/material';
import { 
  GitHub, 
  CheckCircle, 
  Error as ErrorIcon, 
  Info, 
  Launch,
  Refresh,
} from '@mui/icons-material';

interface WorkingGitHubIntegrationProps {
  open: boolean;
  onClose: () => void;
}

const WorkingGitHubIntegration: React.FC<WorkingGitHubIntegrationProps> = ({ open, onClose }) => {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [mode, setMode] = useState<'token' | 'username'>('token');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
  } | null>(null);
  const [connected, setConnected] = useState(false);

  // Test GitHub connection with token
  const testTokenConnection = useCallback(async () => {
    if (!token.trim()) {
      setTestResult({
        success: false,
        message: 'Please enter a GitHub token',
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      // Test the GitHub API with the provided token
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setTestResult({
          success: true,
          message: `Successfully connected as ${userData.login}!`,
          data: userData,
        });
        setConnected(true);
        
        // Save to localStorage for persistence
        localStorage.setItem('github_token', token);
        localStorage.setItem('github_user', JSON.stringify(userData));
        localStorage.setItem('github_connected', 'true');
        localStorage.setItem('github_connection_mode', 'token');
        
        // Dispatch custom event for same-tab updates
        window.dispatchEvent(new Event('localStorageChanged'));
      } else {
        const errorData = await response.json();
        setTestResult({
          success: false,
          message: `Connection failed: ${errorData.message || 'Invalid token'}`,
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Connection error: ${error instanceof Error ? error.message : 'Network error'}`,
      });
    } finally {
      setTesting(false);
    }
  }, [token]);

  // Test GitHub connection with username (public API)
  const testUsernameConnection = useCallback(async () => {
    if (!username.trim()) {
      setTestResult({
        success: false,
        message: 'Please enter a GitHub username',
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      
      if (response.ok) {
        const userData = await response.json();
        setTestResult({
          success: true,
          message: `Found GitHub user: ${userData.login}`,
          data: userData,
        });
        setConnected(true);
        
        // Save to localStorage
        localStorage.setItem('github_username', username);
        localStorage.setItem('github_user', JSON.stringify(userData));
        localStorage.setItem('github_connected', 'true');
        localStorage.setItem('github_connection_mode', 'username');
        
        // Dispatch custom event for same-tab updates
        window.dispatchEvent(new Event('localStorageChanged'));
      } else {
        setTestResult({
          success: false,
          message: `User not found: ${username}`,
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Connection error: ${error instanceof Error ? error.message : 'Network error'}`,
      });
    } finally {
      setTesting(false);
    }
  }, [username]);

  const handleSaveConnection = useCallback(() => {
    if (connected && testResult?.data) {
      // Save successful connection
      localStorage.setItem('github_connected', 'true');
      localStorage.setItem('github_connection_mode', mode);
      
      // Show success and close
      setTestResult({
        success: true,
        message: 'GitHub integration saved successfully!',
      });
      
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  }, [connected, testResult, mode, onClose]);

  const handleClose = useCallback(() => {
    setToken('');
    setUsername('');
    setTestResult(null);
    setConnected(false);
    setTesting(false);
    onClose();
  }, [onClose]);

  // Load saved data on open
  React.useEffect(() => {
    if (open) {
      const savedToken = localStorage.getItem('github_token');
      const savedUsername = localStorage.getItem('github_username');
      const savedMode = localStorage.getItem('github_connection_mode') as 'token' | 'username';
      
      if (savedToken) {
        setToken(savedToken);
        setMode('token');
      } else if (savedUsername) {
        setUsername(savedUsername);
        setMode('username');
      }
      
      if (savedMode) {
        setMode(savedMode);
      }
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <GitHub />
          <Typography variant="h6">GitHub Integration</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {/* Connection Mode Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Choose Connection Method:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant={mode === 'token' ? 'contained' : 'outlined'}
              onClick={() => setMode('token')}
              startIcon={<CheckCircle />}
            >
              Personal Access Token (Recommended)
            </Button>
            <Button
              variant={mode === 'username' ? 'contained' : 'outlined'}
              onClick={() => setMode('username')}
              startIcon={<Info />}
            >
              Public Profile Only
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Token Mode */}
        {mode === 'token' && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Access Token
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Provides full access to your repositories and profile data.
              </Typography>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>How to create a token:</strong><br/>
                  1. Go to GitHub Settings → Developer settings → Personal access tokens<br/>
                  2. Click "Generate new token (classic)"<br/>
                  3. Select scopes: <code>repo</code>, <code>user</code>, <code>read:org</code><br/>
                  4. Copy the generated token
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Link 
                    href="https://github.com/settings/tokens" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    Create Token <Launch fontSize="small" />
                  </Link>
                </Box>
              </Alert>

              <TextField
                label="GitHub Personal Access Token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                fullWidth
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                onClick={testTokenConnection}
                disabled={testing || !token.trim()}
                startIcon={testing ? <CircularProgress size={20} /> : <Refresh />}
                fullWidth
              >
                {testing ? 'Testing Connection...' : 'Test Connection'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Username Mode */}
        {mode === 'username' && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Public Profile Access
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Read-only access to public repositories and profile information.
              </Typography>

              <TextField
                label="GitHub Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                placeholder="octocat"
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                onClick={testUsernameConnection}
                disabled={testing || !username.trim()}
                startIcon={testing ? <CircularProgress size={20} /> : <Refresh />}
                fullWidth
              >
                {testing ? 'Testing Connection...' : 'Test Connection'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Test Results */}
        {testResult && (
          <Alert 
            severity={testResult.success ? 'success' : 'error'} 
            sx={{ mb: 2 }}
            icon={testResult.success ? <CheckCircle /> : <ErrorIcon />}
          >
            <Typography variant="body2">
              {testResult.message}
            </Typography>
            {testResult.success && testResult.data && (
              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={`@${testResult.data.login}`} 
                  size="small" 
                  color="primary" 
                />
                {testResult.data.name && (
                  <Chip 
                    label={testResult.data.name} 
                    size="small" 
                    variant="outlined" 
                  />
                )}
                {testResult.data.public_repos !== undefined && (
                  <Chip 
                    label={`${testResult.data.public_repos} repos`} 
                    size="small" 
                    variant="outlined" 
                  />
                )}
              </Box>
            )}
          </Alert>
        )}

        {/* Connection Status */}
        {connected && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="bold">
              ✅ GitHub connection verified successfully!
            </Typography>
            <Typography variant="body2">
              You can now use GitHub integration features in your portfolio.
            </Typography>
          </Alert>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        {connected && (
          <Button 
            onClick={handleSaveConnection}
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
          >
            Save Connection
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default WorkingGitHubIntegration;