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
  CircularProgress,
} from '@mui/material';
import { LinkedIn, Warning, Info } from '@mui/icons-material';

interface LinkedInIntegrationProps {
  open: boolean;
  onClose: () => void;
}

const LinkedInIntegration: React.FC<LinkedInIntegrationProps> = ({ open, onClose }) => {
  const [profileUrl, setProfileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const handleConnect = async () => {
    setLoading(true);
    try {
      // Simulate LinkedIn API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setActiveStep(1);
    } catch (error) {
      console.error('LinkedIn connection failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setProfileUrl('');
    setActiveStep(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LinkedIn sx={{ color: '#0077b5' }} />
          <Typography variant="h6">Connect LinkedIn Profile</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Stepper activeStep={activeStep} orientation="vertical">
          <Step>
            <StepLabel>LinkedIn Profile Information</StepLabel>
            <StepContent>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  LinkedIn integration is coming soon! For now, you can manually add your LinkedIn information in the portfolio builder.
                </Typography>
              </Alert>
              
              <TextField
                fullWidth
                label="LinkedIn Profile URL"
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
                sx={{ mb: 2 }}
                disabled
              />
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                We're working on LinkedIn integration to automatically import:
              </Typography>
              <Typography variant="body2" component="ul" sx={{ pl: 2, mb: 2 }}>
                <li>Professional experience and job titles</li>
                <li>Education history and certifications</li>
                <li>Skills and endorsements</li>
                <li>Professional summary and headline</li>
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  onClick={handleConnect}
                  disabled={true}
                  startIcon={loading ? <CircularProgress size={16} /> : <LinkedIn />}
                >
                  Connect (Coming Soon)
                </Button>
              </Box>
            </StepContent>
          </Step>

          <Step>
            <StepLabel>Integration Complete</StepLabel>
            <StepContent>
              <Alert severity="info">
                LinkedIn integration will be available in a future update.
              </Alert>
            </StepContent>
          </Step>
        </Stepper>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LinkedInIntegration;