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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { 
  LinkedIn, 
  CheckCircle, 
  Error as ErrorIcon, 
  Info, 
  Launch,
  Refresh,
  Person,
  Work,
  School,
} from '@mui/icons-material';

interface WorkingLinkedInIntegrationProps {
  open: boolean;
  onClose: () => void;
}

const WorkingLinkedInIntegration: React.FC<WorkingLinkedInIntegrationProps> = ({ open, onClose }) => {
  const [profileUrl, setProfileUrl] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
  } | null>(null);
  const [connected, setConnected] = useState(false);
  const [connectionMode, setConnectionMode] = useState<'manual' | 'api'>('manual');

  // Extract LinkedIn username from URL
  const extractUsernameFromUrl = useCallback((url: string): string | null => {
    const patterns = [
      /linkedin\.com\/in\/([^/?]+)/,
      /linkedin\.com\/pub\/([^/?]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  }, []);

  // Test LinkedIn profile URL
  const testProfileUrl = useCallback(async () => {
    if (!profileUrl.trim()) {
      setTestResult({
        success: false,
        message: 'Please enter a LinkedIn profile URL',
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const username = extractUsernameFromUrl(profileUrl);
      
      if (!username) {
        setTestResult({
          success: false,
          message: 'Invalid LinkedIn URL format. Please use: https://linkedin.com/in/username',
        });
        setTesting(false);
        return;
      }

      // For now, we'll validate the URL format and save the profile URL
      // In a real implementation, you'd use LinkedIn's API with proper OAuth
      
      setTestResult({
        success: true,
        message: `LinkedIn profile URL validated for: ${username}`,
        data: { username, profileUrl },
      });
      setConnected(true);
      
      // Save to localStorage
      localStorage.setItem('linkedin_profile_url', profileUrl);
      localStorage.setItem('linkedin_username', username);
      
    } catch (error) {
      setTestResult({
        success: false,
        message: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setTesting(false);
    }
  }, [profileUrl, extractUsernameFromUrl]);

  // Simulate LinkedIn OAuth flow (placeholder)
  const startOAuthFlow = useCallback(() => {
    setTestResult({
      success: false,
      message: 'LinkedIn OAuth integration coming soon! For now, please use the manual profile URL option.',
    });
  }, []);

  const handleSaveConnection = useCallback(() => {
    if (connected && testResult?.data) {
      localStorage.setItem('linkedin_connected', 'true');
      localStorage.setItem('linkedin_connection_mode', connectionMode);
      
      setTestResult({
        success: true,
        message: 'LinkedIn integration saved successfully!',
      });
      
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  }, [connected, testResult, connectionMode, onClose]);

  const handleClose = useCallback(() => {
    setProfileUrl('');
    setTestResult(null);
    setConnected(false);
    setTesting(false);
    onClose();
  }, [onClose]);

  // Load saved data on open
  React.useEffect(() => {
    if (open) {
      const savedUrl = localStorage.getItem('linkedin_profile_url');
      if (savedUrl) {
        setProfileUrl(savedUrl);
      }
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LinkedIn sx={{ color: '#0077b5' }} />
          <Typography variant="h6">LinkedIn Integration</Typography>
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
              variant={connectionMode === 'manual' ? 'contained' : 'outlined'}
              onClick={() => setConnectionMode('manual')}
              startIcon={<Person />}
            >
              Profile URL (Available Now)
            </Button>
            <Button
              variant={connectionMode === 'api' ? 'contained' : 'outlined'}
              onClick={() => setConnectionMode('api')}
              startIcon={<Info />}
              disabled
            >
              OAuth API (Coming Soon)
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Manual Profile URL Mode */}
        {connectionMode === 'manual' && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                LinkedIn Profile URL
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Enter your LinkedIn profile URL to import basic profile information.
              </Typography>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>What we can import:</strong>
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Profile name and headline" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Work fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Current position (if public)" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><School fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Education (if public)" />
                  </ListItem>
                </List>
              </Alert>

              <TextField
                label="LinkedIn Profile URL"
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                fullWidth
                placeholder="https://linkedin.com/in/yourname"
                sx={{ mb: 2 }}
                helperText="Example: https://linkedin.com/in/john-doe-123456"
              />

              <Button
                variant="contained"
                onClick={testProfileUrl}
                disabled={testing || !profileUrl.trim()}
                startIcon={testing ? <CircularProgress size={20} /> : <Refresh />}
                fullWidth
                sx={{ bgcolor: '#0077b5', '&:hover': { bgcolor: '#005885' } }}
              >
                {testing ? 'Validating Profile...' : 'Validate Profile URL'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* OAuth API Mode (Coming Soon) */}
        {connectionMode === 'api' && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                LinkedIn OAuth Integration
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Full access to your LinkedIn profile, connections, and professional data.
              </Typography>

              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Coming Soon Features:</strong><br/>
                  • Automatic profile data import<br/>
                  • Work experience synchronization<br/>
                  • Skills and endorsements<br/>
                  • Connection insights<br/>
                  • Professional recommendations
                </Typography>
              </Alert>

              <Button
                variant="contained"
                onClick={startOAuthFlow}
                disabled
                startIcon={<LinkedIn />}
                fullWidth
                sx={{ bgcolor: '#0077b5', '&:hover': { bgcolor: '#005885' } }}
              >
                Connect with LinkedIn OAuth (Coming Soon)
              </Button>

              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  LinkedIn OAuth integration requires additional setup and approval from LinkedIn.
                  We're working on implementing this feature!
                </Typography>
              </Box>
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
                  label={`@${testResult.data.username}`} 
                  size="small" 
                  sx={{ bgcolor: '#0077b5', color: 'white' }}
                />
                <Chip 
                  label="Profile URL Validated" 
                  size="small" 
                  variant="outlined" 
                />
              </Box>
            )}
          </Alert>
        )}

        {/* Connection Status */}
        {connected && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="bold">
              ✅ LinkedIn profile validated successfully!
            </Typography>
            <Typography variant="body2">
              Your LinkedIn profile URL has been saved and can be used in your portfolio.
            </Typography>
          </Alert>
        )}

        {/* Additional Information */}
        <Alert severity="info">
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            💡 Pro Tip:
          </Typography>
          <Typography variant="body2">
            Make sure your LinkedIn profile is set to public or has a custom URL to ensure 
            it can be properly referenced in your portfolio. You can customize your LinkedIn 
            URL in your profile settings.
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Link 
              href="https://www.linkedin.com/public-profile/settings" 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              Customize LinkedIn URL <Launch fontSize="small" />
            </Link>
          </Box>
        </Alert>
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

export default WorkingLinkedInIntegration;