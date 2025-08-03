import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ArrowBack,
  Settings,
  GitHub,
  LinkedIn,
  SmartToy,
  Security,
  Palette,
  Notifications,
  Download,
  Upload,
  Delete,
  Edit,
  Save,
  Refresh,
  ExpandMore,
  Warning,
  CheckCircle,
  Info,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Hooks & Store
import { useUser, usePortfolio, useAppActions } from '../store';
import { useGitHub } from '../hooks/useGitHub';
import { useLinkedIn } from '../hooks/useLinkedIn';
import { useAI } from '../hooks/useAI';

// Components
import WhatsAppButton from '../components/common/WhatsAppButton';

const MotionCard = motion(Card);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const portfolio = usePortfolio();
  const { updateUserProfile, setPortfolio, clearAll } = useAppActions();
  
  const [tabValue, setTabValue] = useState(0);
  const [userSettings, setUserSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    whatsapp: user?.whatsapp || '',
    linkedin: user?.linkedin || '',
    twitter: user?.twitter || '',
  });
  
  const [githubToken, setGithubToken] = useState('');
  const [linkedinToken, setLinkedinToken] = useState('');
  const [aiApiKey, setAiApiKey] = useState('');
  const [showTokens, setShowTokens] = useState(false);
  
  const [notifications, setNotifications] = useState({
    email: true,
    desktop: false,
    marketing: false,
  });
  
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showEmail: false,
    showPhone: false,
    indexBySearchEngines: true,
  });
  
  const [exportSettings, setExportSettings] = useState({
    includePrivateRepos: false,
    includeContributions: true,
    dataFormat: 'json',
  });
  
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);
  const [exportDialog, setExportDialog] = useState(false);
  
  const { authenticateWithToken: authenticateGitHub } = useGitHub();
  const { authenticateWithToken: authenticateLinkedIn } = useLinkedIn();
  const { setApiKey: setAIApiKey } = useAI();

  // Load saved tokens (masked for security)
  useEffect(() => {
    const savedGithubToken = localStorage.getItem('github_token');
    const savedLinkedinToken = localStorage.getItem('linkedin_token');
    const savedAiKey = localStorage.getItem('ai_api_key');
    
    if (savedGithubToken) setGithubToken('•••••••••••••••••••••••••••••••••••••••');
    if (savedLinkedinToken) setLinkedinToken('•••••••••••••••••••••••••••••••••••••••');
    if (savedAiKey) setAiApiKey('•••••••••••••••••••••••••••••••••••••••');
  }, []);

  const handleUpdateProfile = () => {
    updateUserProfile(userSettings);
    // Show success message
  };

  const handleConnectGitHub = async () => {
    if (githubToken && !githubToken.includes('•')) {
      try {
        await authenticateGitHub(githubToken);
        setGithubToken('•••••••••••••••••••••••••••••••••••••••');
      } catch (error) {
        console.error('GitHub connection failed:', error);
      }
    }
  };

  const handleConnectLinkedIn = async () => {
    if (linkedinToken && !linkedinToken.includes('•')) {
      try {
        await authenticateLinkedIn(linkedinToken);
        setLinkedinToken('•••••••••••••••••••••••••••••••••••••••');
      } catch (error) {
        console.error('LinkedIn connection failed:', error);
      }
    }
  };

  const handleSetAIKey = () => {
    if (aiApiKey && !aiApiKey.includes('•')) {
      setAIApiKey(aiApiKey);
      setAiApiKey('•••••••••••••••••••••••••••••••••••••••');
    }
  };

  const handleDisconnectService = (service: 'github' | 'linkedin' | 'ai') => {
    switch (service) {
      case 'github':
        localStorage.removeItem('github_token');
        setGithubToken('');
        break;
      case 'linkedin':
        localStorage.removeItem('linkedin_token');
        setLinkedinToken('');
        break;
      case 'ai':
        localStorage.removeItem('ai_api_key');
        setAiApiKey('');
        break;
    }
  };

  const handleExportData = () => {
    const exportData = {
      user,
      portfolio,
      settings: {
        notifications,
        privacy,
        exportSettings,
      },
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setExportDialog(false);
  };

  const handleDeleteAccount = () => {
    // Clear all data
    clearAll();
    localStorage.clear();
    setDeleteAccountDialog(false);
    navigate('/');
  };

  const getConnectionStatus = (service: 'github' | 'linkedin' | 'ai') => {
    switch (service) {
      case 'github':
        return !!localStorage.getItem('github_token');
      case 'linkedin':
        return !!localStorage.getItem('linkedin_token');
      case 'ai':
        return !!localStorage.getItem('ai_api_key');
      default:
        return false;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
          variant="outlined"
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" fontWeight="bold">
          Settings & Preferences
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Profile" icon={<Edit />} />
          <Tab label="Integrations" icon={<Settings />} />
          <Tab label="Privacy" icon={<Security />} />
          <Tab label="Notifications" icon={<Notifications />} />
          <Tab label="Data & Export" icon={<Download />} />
        </Tabs>

        {/* Profile Settings */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    value={userSettings.name}
                    onChange={(e) => setUserSettings({ ...userSettings, name: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    value={userSettings.email}
                    onChange={(e) => setUserSettings({ ...userSettings, email: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Location"
                    value={userSettings.location}
                    onChange={(e) => setUserSettings({ ...userSettings, location: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Website"
                    value={userSettings.website}
                    onChange={(e) => setUserSettings({ ...userSettings, website: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Bio"
                    value={userSettings.bio}
                    onChange={(e) => setUserSettings({ ...userSettings, bio: e.target.value })}
                    multiline
                    rows={3}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Social Links
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="WhatsApp"
                    value={userSettings.whatsapp}
                    onChange={(e) => setUserSettings({ ...userSettings, whatsapp: e.target.value })}
                    placeholder="+1234567890"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="LinkedIn"
                    value={userSettings.linkedin}
                    onChange={(e) => setUserSettings({ ...userSettings, linkedin: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Twitter"
                    value={userSettings.twitter}
                    onChange={(e) => setUserSettings({ ...userSettings, twitter: e.target.value })}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleUpdateProfile}
                >
                  Save Profile Changes
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Profile Preview
                  </Typography>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        fontSize: '2rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {userSettings.name.charAt(0) || 'U'}
                    </Box>
                    <Typography variant="h6">{userSettings.name || 'Your Name'}</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {userSettings.location || 'Your Location'}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {userSettings.bio || 'Your bio will appear here...'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Integrations */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Connected Services
          </Typography>

          <Grid container spacing={3}>
            {/* GitHub Integration */}
            <Grid item xs={12} md={4}>
              <MotionCard whileHover={{ y: -4 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <GitHub sx={{ fontSize: 40, color: '#24292e' }} />
                    <Box>
                      <Typography variant="h6">GitHub</Typography>
                      <Chip
                        label={getConnectionStatus('github') ? 'Connected' : 'Not Connected'}
                        color={getConnectionStatus('github') ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Connect your GitHub account to automatically import repositories and contributions.
                  </Typography>

                  <TextField
                    label="Personal Access Token"
                    type={showTokens ? 'text' : 'password'}
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    fullWidth
                    size="small"
                    sx={{ mt: 2 }}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          size="small"
                          onClick={() => setShowTokens(!showTokens)}
                        >
                          {showTokens ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />
                </CardContent>
                <CardActions>
                  {getConnectionStatus('github') ? (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDisconnectService('github')}
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={handleConnectGitHub}
                      disabled={!githubToken || githubToken.includes('•')}
                    >
                      Connect
                    </Button>
                  )}
                </CardActions>
              </MotionCard>
            </Grid>

            {/* LinkedIn Integration */}
            <Grid item xs={12} md={4}>
              <MotionCard whileHover={{ y: -4 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <LinkedIn sx={{ fontSize: 40, color: '#0077b5' }} />
                    <Box>
                      <Typography variant="h6">LinkedIn</Typography>
                      <Chip
                        label={getConnectionStatus('linkedin') ? 'Connected' : 'Not Connected'}
                        color={getConnectionStatus('linkedin') ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Import your professional experience and education from LinkedIn.
                  </Typography>

                  <TextField
                    label="Access Token"
                    type={showTokens ? 'text' : 'password'}
                    value={linkedinToken}
                    onChange={(e) => setLinkedinToken(e.target.value)}
                    fullWidth
                    size="small"
                    sx={{ mt: 2 }}
                  />
                </CardContent>
                <CardActions>
                  {getConnectionStatus('linkedin') ? (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDisconnectService('linkedin')}
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={handleConnectLinkedIn}
                      disabled={!linkedinToken || linkedinToken.includes('•')}
                    >
                      Connect
                    </Button>
                  )}
                </CardActions>
              </MotionCard>
            </Grid>

            {/* AI Integration */}
            <Grid item xs={12} md={4}>
              <MotionCard whileHover={{ y: -4 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <SmartToy sx={{ fontSize: 40, color: '#667eea' }} />
                    <Box>
                      <Typography variant="h6">AI Assistant</Typography>
                      <Chip
                        label={getConnectionStatus('ai') ? 'Active' : 'Inactive'}
                        color={getConnectionStatus('ai') ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Enable AI-powered content optimization and suggestions.
                  </Typography>

                  <TextField
                    label="OpenAI API Key"
                    type={showTokens ? 'text' : 'password'}
                    value={aiApiKey}
                    onChange={(e) => setAiApiKey(e.target.value)}
                    fullWidth
                    size="small"
                    sx={{ mt: 2 }}
                  />
                </CardContent>
                <CardActions>
                  {getConnectionStatus('ai') ? (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDisconnectService('ai')}
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={handleSetAIKey}
                      disabled={!aiApiKey || aiApiKey.includes('•')}
                    >
                      Connect
                    </Button>
                  )}
                </CardActions>
              </MotionCard>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Privacy Settings */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Privacy & Visibility
          </Typography>

          <List>
            <ListItem>
              <ListItemIcon>
                <Visibility />
              </ListItemIcon>
              <ListItemText
                primary="Public Portfolio"
                secondary="Make your portfolio visible to everyone on the internet"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={privacy.profilePublic}
                  onChange={(e) => setPrivacy({ ...privacy, profilePublic: e.target.checked })}
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Info />
              </ListItemIcon>
              <ListItemText
                primary="Show Email Address"
                secondary="Display your email address on your public portfolio"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={privacy.showEmail}
                  onChange={(e) => setPrivacy({ ...privacy, showEmail: e.target.checked })}
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Info />
              </ListItemIcon>
              <ListItemText
                primary="Show Phone Number"
                secondary="Display your phone number on your public portfolio"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={privacy.showPhone}
                  onChange={(e) => setPrivacy({ ...privacy, showPhone: e.target.checked })}
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Security />
              </ListItemIcon>
              <ListItemText
                primary="Search Engine Indexing"
                secondary="Allow search engines to index your portfolio"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={privacy.indexBySearchEngines}
                  onChange={(e) => setPrivacy({ ...privacy, indexBySearchEngines: e.target.checked })}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </TabPanel>

        {/* Notifications */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Notification Preferences
          </Typography>

          <List>
            <ListItem>
              <ListItemIcon>
                <Notifications />
              </ListItemIcon>
              <ListItemText
                primary="Email Notifications"
                secondary="Receive important updates and announcements via email"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={notifications.email}
                  onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Notifications />
              </ListItemIcon>
              <ListItemText
                primary="Desktop Notifications"
                secondary="Show desktop notifications for important events"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={notifications.desktop}
                  onChange={(e) => setNotifications({ ...notifications, desktop: e.target.checked })}
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Notifications />
              </ListItemIcon>
              <ListItemText
                primary="Marketing Communications"
                secondary="Receive tips, best practices, and product updates"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={notifications.marketing}
                  onChange={(e) => setNotifications({ ...notifications, marketing: e.target.checked })}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </TabPanel>

        {/* Data & Export */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>
            Data Management
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Export Your Data
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Download all your portfolio data including settings, projects, and personal information.
                  </Typography>
                  
                  <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                    <InputLabel>Export Format</InputLabel>
                    <Select
                      value={exportSettings.dataFormat}
                      onChange={(e) => setExportSettings({ ...exportSettings, dataFormat: e.target.value })}
                    >
                      <MenuItem value="json">JSON</MenuItem>
                      <MenuItem value="csv">CSV</MenuItem>
                      <MenuItem value="pdf">PDF</MenuItem>
                    </Select>
                  </FormControl>
                </CardContent>
                <CardActions>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={() => setExportDialog(true)}
                  >
                    Export Data
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ border: '1px solid', borderColor: 'error.main' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="error">
                    Danger Zone
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </Typography>
                  
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    This will delete all your portfolios, settings, and connections permanently.
                  </Alert>
                </CardContent>
                <CardActions>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => setDeleteAccountDialog(true)}
                  >
                    Delete Account
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Export Data Dialog */}
      <Dialog open={exportDialog} onClose={() => setExportDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Export Your Data</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            Your export will include:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText primary="Profile information" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText primary="Portfolio sections and content" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText primary="Settings and preferences" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Warning color="warning" /></ListItemIcon>
              <ListItemText primary="API tokens are excluded for security" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialog(false)}>Cancel</Button>
          <Button onClick={handleExportData} variant="contained" startIcon={<Download />}>
            Export Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteAccountDialog} onClose={() => setDeleteAccountDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle color="error">Delete Account</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              This action is irreversible!
            </Typography>
            <Typography variant="body2">
              Deleting your account will permanently remove:
            </Typography>
          </Alert>
          
          <List dense>
            <ListItem>
              <ListItemIcon><Delete color="error" /></ListItemIcon>
              <ListItemText primary="All your portfolios and content" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Delete color="error" /></ListItemIcon>
              <ListItemText primary="Connected integrations and tokens" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Delete color="error" /></ListItemIcon>
              <ListItemText primary="Settings and preferences" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Delete color="error" /></ListItemIcon>
              <ListItemText primary="Account access and data" />
            </ListItem>
          </List>
          
          <Typography variant="body2" sx={{ mt: 2 }}>
            Type "DELETE" to confirm:
          </Typography>
          <TextField
            fullWidth
            placeholder="DELETE"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAccountDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* WhatsApp Button */}
      {userSettings.whatsapp && (
        <WhatsAppButton
          phoneNumber={userSettings.whatsapp}
          message="Hi! I have a question about the Portfolio Generator."
          position="fixed"
        />
      )}
    </Container>
  );
};

export default SettingsPage;