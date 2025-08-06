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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { 
  SmartToy, 
  CheckCircle, 
  Error as ErrorIcon, 
  Info, 
  Launch,
  Refresh,
  Security,
  Speed,
  Psychology,
} from '@mui/icons-material';

interface WorkingAIAssistantIntegrationProps {
  open: boolean;
  onClose: () => void;
}

type AIProvider = 'openai' | 'anthropic' | 'google';

interface AIProviderConfig {
  name: string;
  icon: string;
  testEndpoint: string;
  authHeader: string;
  features: string[];
  setupUrl: string;
  keyPattern: RegExp;
}

const AI_PROVIDERS: Record<AIProvider, AIProviderConfig> = {
  openai: {
    name: 'OpenAI',
    icon: '🤖',
    testEndpoint: 'https://api.openai.com/v1/models',
    authHeader: 'Authorization: Bearer',
    features: ['GPT-4 Text Generation', 'Content Optimization', 'Resume Writing', 'Cover Letters'],
    setupUrl: 'https://platform.openai.com/api-keys',
    keyPattern: /^sk-[a-zA-Z0-9]{48,}$/,
  },
  anthropic: {
    name: 'Anthropic Claude',
    icon: '🧠',
    testEndpoint: 'https://api.anthropic.com/v1/messages',
    authHeader: 'x-api-key',
    features: ['Claude 3 Assistant', 'Professional Writing', 'Content Analysis', 'Career Advice'],
    setupUrl: 'https://console.anthropic.com/settings/keys',
    keyPattern: /^sk-ant-[a-zA-Z0-9-_]{95,}$/,
  },
  google: {
    name: 'Google Gemini',
    icon: '⭐',
    testEndpoint: 'https://generativelanguage.googleapis.com/v1/models',
    authHeader: 'Authorization: Bearer',
    features: ['Gemini Pro', 'Multimodal AI', 'Text Generation', 'Content Creation'],
    setupUrl: 'https://makersuite.google.com/app/apikey',
    keyPattern: /^[a-zA-Z0-9-_]{39}$/,
  },
};

const WorkingAIAssistantIntegration: React.FC<WorkingAIAssistantIntegrationProps> = ({ open, onClose }) => {
  const [provider, setProvider] = useState<AIProvider>('openai');
  const [apiKey, setApiKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
  } | null>(null);
  const [connected, setConnected] = useState(false);

  // Validate API key format
  const validateApiKey = useCallback((key: string, providerType: AIProvider): boolean => {
    const config = AI_PROVIDERS[providerType];
    return config.keyPattern.test(key);
  }, []);

  // Test API connection
  const testApiConnection = useCallback(async () => {
    if (!apiKey.trim()) {
      setTestResult({
        success: false,
        message: 'Please enter an API key',
      });
      return;
    }

    if (!validateApiKey(apiKey, provider)) {
      setTestResult({
        success: false,
        message: `Invalid ${AI_PROVIDERS[provider].name} API key format`,
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const config = AI_PROVIDERS[provider];
      
      // Test different API endpoints based on provider
      let response: Response;
      let testData: any;

      switch (provider) {
        case 'openai':
          response = await fetch(config.testEndpoint, {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          });
          testData = await response.json();
          break;

        case 'anthropic':
          // For Anthropic, we'll test with a simple message
          response = await fetch(config.testEndpoint, {
            method: 'POST',
            headers: {
              'x-api-key': apiKey,
              'Content-Type': 'application/json',
              'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
              model: 'claude-3-haiku-20240307',
              max_tokens: 10,
              messages: [{ role: 'user', content: 'Test' }],
            }),
          });
          testData = await response.json();
          break;

        case 'google':
          // For Google, test the models endpoint with API key
          const googleUrl = `${config.testEndpoint}?key=${apiKey}`;
          response = await fetch(googleUrl);
          testData = await response.json();
          break;

        default:
          throw new Error('Unknown provider');
      }

      if (response.ok) {
        setTestResult({
          success: true,
          message: `✅ ${config.name} API connection successful!`,
          data: testData,
        });
        setConnected(true);
        
        // Save to localStorage (encrypted in real app)
        localStorage.setItem('ai_provider', provider);
        localStorage.setItem(`ai_api_key_${provider}`, btoa(apiKey)); // Basic encoding, use proper encryption in production
        localStorage.setItem('ai_connected', 'true');
        
        // Dispatch custom event for same-tab updates
        window.dispatchEvent(new Event('localStorageChanged'));
        
      } else {
        const errorMessage = testData?.error?.message || testData?.message || 'API connection failed';
        setTestResult({
          success: false,
          message: `❌ Connection failed: ${errorMessage}`,
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `❌ Connection error: ${error instanceof Error ? error.message : 'Network error'}`,
      });
    } finally {
      setTesting(false);
    }
  }, [apiKey, provider, validateApiKey]);

  const handleSaveConnection = useCallback(() => {
    if (connected && testResult?.success) {
      localStorage.setItem('ai_integration_saved', 'true');
      
      setTestResult({
        success: true,
        message: '🎉 AI Assistant integration saved successfully!',
      });
      
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  }, [connected, testResult, onClose]);

  const handleProviderChange = useCallback((newProvider: AIProvider) => {
    setProvider(newProvider);
    setApiKey('');
    setTestResult(null);
    setConnected(false);
    
    // Load saved key for this provider
    const savedKey = localStorage.getItem(`ai_api_key_${newProvider}`);
    if (savedKey) {
      try {
        setApiKey(atob(savedKey));
      } catch (e) {
        // Invalid saved key, ignore
      }
    }
  }, []);

  const handleClose = useCallback(() => {
    setApiKey('');
    setTestResult(null);
    setConnected(false);
    setTesting(false);
    onClose();
  }, [onClose]);

  // Load saved data on open
  React.useEffect(() => {
    if (open) {
      const savedProvider = localStorage.getItem('ai_provider') as AIProvider;
      if (savedProvider && AI_PROVIDERS[savedProvider]) {
        setProvider(savedProvider);
        
        const savedKey = localStorage.getItem(`ai_api_key_${savedProvider}`);
        if (savedKey) {
          try {
            setApiKey(atob(savedKey));
          } catch (e) {
            // Invalid saved key, ignore
          }
        }
      }
    }
  }, [open]);

  const currentProvider = AI_PROVIDERS[provider];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SmartToy sx={{ color: '#667eea' }} />
          <Typography variant="h6">AI Assistant Integration</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {/* Provider Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Choose AI Provider:
          </Typography>
          <FormControl fullWidth>
            <InputLabel>AI Provider</InputLabel>
            <Select
              value={provider}
              label="AI Provider"
              onChange={(e) => handleProviderChange(e.target.value as AIProvider)}
            >
              {Object.entries(AI_PROVIDERS).map(([key, config]) => (
                <MenuItem key={key} value={key}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{config.icon}</span>
                    {config.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Provider Configuration */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <span style={{ fontSize: '2rem' }}>{currentProvider.icon}</span>
              <Box>
                <Typography variant="h6">{currentProvider.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure your {currentProvider.name} API integration
                </Typography>
              </Box>
            </Box>
            
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>How to get your API key:</strong><br/>
                1. Visit the {currentProvider.name} developer portal<br/>
                2. Create an account or sign in<br/>
                3. Generate a new API key<br/>
                4. Copy and paste it below
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Link 
                  href={currentProvider.setupUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  Get {currentProvider.name} API Key <Launch fontSize="small" />
                </Link>
              </Box>
            </Alert>

            <TextField
              label={`${currentProvider.name} API Key`}
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              fullWidth
              placeholder={provider === 'openai' ? 'sk-...' : provider === 'anthropic' ? 'sk-ant-...' : 'AIzaSy...'}
              sx={{ mb: 2 }}
              helperText={`Format: ${currentProvider.keyPattern.source}`}
            />

            <Button
              variant="contained"
              onClick={testApiConnection}
              disabled={testing || !apiKey.trim()}
              startIcon={testing ? <CircularProgress size={20} /> : <Refresh />}
              fullWidth
              sx={{ bgcolor: '#667eea', '&:hover': { bgcolor: '#5a67d8' } }}
            >
              {testing ? 'Testing API Connection...' : 'Test API Connection'}
            </Button>
          </CardContent>
        </Card>

        {/* Features List */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {currentProvider.name} Features
            </Typography>
            <List dense>
              {currentProvider.features.map((feature, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {index === 0 ? <Psychology fontSize="small" /> :
                     index === 1 ? <Speed fontSize="small" /> :
                     index === 2 ? <Security fontSize="small" /> :
                     <CheckCircle fontSize="small" />}
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

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
            {testResult.success && (
              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={currentProvider.name} 
                  size="small" 
                  sx={{ bgcolor: '#667eea', color: 'white' }}
                />
                <Chip 
                  label="API Connected" 
                  size="small" 
                  color="success"
                  variant="outlined" 
                />
                <Chip 
                  label="Ready to Use" 
                  size="small" 
                  color="primary"
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
              ✅ AI Assistant connection verified!
            </Typography>
            <Typography variant="body2">
              You can now use AI-powered features throughout the portfolio builder, 
              including content optimization, resume writing assistance, and professional suggestions.
            </Typography>
          </Alert>
        )}

        {/* Security Notice */}
        <Alert severity="warning">
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            🔒 Security Notice:
          </Typography>
          <Typography variant="body2">
            Your API keys are stored locally in your browser and are not sent to our servers. 
            However, we recommend using API keys with limited permissions and rotating them regularly. 
            Never share your API keys with others.
          </Typography>
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
            Save Integration
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default WorkingAIAssistantIntegration;