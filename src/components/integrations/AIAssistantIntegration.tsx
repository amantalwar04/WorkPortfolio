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
  Step,
  Stepper,
  StepLabel,
  StepContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
} from '@mui/material';
import { SmartToy, Key, CheckCircle } from '@mui/icons-material';

interface AIAssistantIntegrationProps {
  open: boolean;
  onClose: () => void;
}

const AIAssistantIntegration: React.FC<AIAssistantIntegrationProps> = ({ open, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState('openai');
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [connected, setConnected] = useState(false);

  const handleConnect = async () => {
    if (!apiKey.trim()) return;
    
    setLoading(true);
    try {
      // Simulate API validation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save API key to localStorage (in production, use secure storage)
      localStorage.setItem(`${provider}_api_key`, apiKey);
      
      setConnected(true);
      setActiveStep(2);
    } catch (error) {
      console.error('AI Assistant connection failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setApiKey('');
    setProvider('openai');
    setActiveStep(0);
    setConnected(false);
    onClose();
  };

  const providers = [
    { value: 'openai', label: 'OpenAI (GPT-4, GPT-3.5)', website: 'https://platform.openai.com/api-keys' },
    { value: 'anthropic', label: 'Anthropic (Claude)', website: 'https://console.anthropic.com/' },
    { value: 'google', label: 'Google (Gemini)', website: 'https://makersuite.google.com/app/apikey' },
  ];

  const selectedProvider = providers.find(p => p.value === provider);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SmartToy sx={{ color: '#667eea' }} />
          <Typography variant="h6">Configure AI Assistant</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Stepper activeStep={activeStep} orientation="vertical">
          <Step>
            <StepLabel>Choose AI Provider</StepLabel>
            <StepContent>
              <Alert severity="info" sx={{ mb: 2 }}>
                AI Assistant helps with content optimization, writing professional summaries, and improving your portfolio descriptions.
              </Alert>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>AI Provider</InputLabel>
                <Select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  label="AI Provider"
                >
                  {providers.map((p) => (
                    <MenuItem key={p.value} value={p.value}>
                      {p.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                You'll need an API key from {selectedProvider?.label}. Features include:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip label="Content Enhancement" size="small" />
                <Chip label="Professional Writing" size="small" />
                <Chip label="Skill Suggestions" size="small" />
                <Chip label="Resume Optimization" size="small" />
              </Box>
              
              <Button variant="contained" onClick={() => setActiveStep(1)}>
                Continue
              </Button>
            </StepContent>
          </Step>

          <Step>
            <StepLabel>API Key Configuration</StepLabel>
            <StepContent>
              <TextField
                fullWidth
                label={`${selectedProvider?.label} API Key`}
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <Key sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
              
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Your API key is stored locally and never sent to our servers. Only you have access to it.
                </Typography>
              </Alert>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                To get your API key:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                1. Visit <Button 
                  variant="text" 
                  size="small" 
                  href={selectedProvider?.website} 
                  target="_blank"
                  sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                >
                  {selectedProvider?.website}
                </Button><br/>
                2. Sign up or log into your account<br/>
                3. Generate a new API key<br/>
                4. Copy and paste it above
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="contained" 
                  onClick={handleConnect}
                  disabled={loading || !apiKey.trim()}
                  startIcon={loading ? <CircularProgress size={16} /> : <SmartToy />}
                >
                  {loading ? 'Validating...' : 'Connect'}
                </Button>
                <Button onClick={() => setActiveStep(0)}>
                  Back
                </Button>
              </Box>
            </StepContent>
          </Step>

          <Step>
            <StepLabel>AI Assistant Ready</StepLabel>
            <StepContent>
              <Alert severity="success" sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle />
                  AI Assistant is now configured and ready to help!
                </Box>
              </Alert>
              
              <Typography variant="body2" sx={{ mb: 2 }}>
                You can now use AI assistance features throughout the portfolio builder:
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                <Typography variant="body2">• Professional summary optimization</Typography>
                <Typography variant="body2">• Job description enhancement</Typography>
                <Typography variant="body2">• Skill recommendations</Typography>
                <Typography variant="body2">• Project description improvements</Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                Look for the "AI Enhance" buttons in the portfolio builder!
              </Typography>
            </StepContent>
          </Step>
        </Stepper>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          {connected ? 'Done' : 'Cancel'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AIAssistantIntegration;