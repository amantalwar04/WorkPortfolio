import React, { useState, useCallback, useMemo } from 'react';
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
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  Delete,
  Edit,
  Save,
  Refresh,
  Warning,
  CheckCircle,
  Info,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Safe imports
import SafeWrapper from '../components/common/SafeWrapper';
import { safeNavigate } from '../utils/navigation';
import WorkingGitHubIntegration from '../components/integrations/WorkingGitHubIntegration';
import WorkingLinkedInIntegration from '../components/integrations/WorkingLinkedInIntegration';
import WorkingAIAssistantIntegration from '../components/integrations/WorkingAIAssistantIntegration';

/**
 * Ultra-Safe Settings Page with comprehensive error protection
 */
const UltraSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Safe state management
  const [activeTab, setActiveTab] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [showTokens, setShowTokens] = useState<boolean>(false);
  
  // User profile settings
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    whatsapp: '',
  });
  
  // Integration settings
  const [integrationData, setIntegrationData] = useState({
    githubToken: '',
    linkedinToken: '',
    aiApiKey: '',
    aiProvider: 'openai',
  });
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profilePublic: true,
    showEmail: false,
    showPhone: false,
    allowIndexing: true,
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    browserNotifications: false,
    marketingEmails: false,
  });
  
  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [exportDialog, setExportDialog] = useState<boolean>(false);
  const [integrationDialogs, setIntegrationDialogs] = useState({
    github: false,
    linkedin: false,
    ai: false,
  });

  // Safe navigation handler
  const handleNavigation = useCallback((path: string) => {
    safeNavigate(navigate, path);
  }, [navigate]);

  // Safe profile update handler
  const handleProfileUpdate = useCallback((field: string, value: string) => {
    try {
      setProfileData(prev => ({
        ...prev,
        [field]: value,
      }));
    } catch (error) {
      console.error('Profile update error:', error);
    }
  }, []);

  // Safe integration dialog handlers
  const openIntegrationDialog = useCallback((type: 'github' | 'linkedin' | 'ai') => {
    try {
      setIntegrationDialogs(prev => ({
        ...prev,
        [type]: true,
      }));
    } catch (error) {
      console.error('Error opening integration dialog:', error);
    }
  }, []);

  const closeIntegrationDialog = useCallback((type: 'github' | 'linkedin' | 'ai') => {
    try {
      setIntegrationDialogs(prev => ({
        ...prev,
        [type]: false,
      }));
    } catch (error) {
      console.error('Error closing integration dialog:', error);
    }
  }, []);

  // Safe settings save handler
  const handleSaveSettings = useCallback(async () => {
    try {
      setLoading(true);
      
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      console.log('Settings saved:', {
        profile: profileData,
        integrations: integrationData,
        privacy: privacySettings,
        notifications: notificationSettings,
      });
      
    } catch (error) {
      console.error('Save settings error:', error);
    } finally {
      setLoading(false);
    }
  }, [profileData, integrationData, privacySettings, notificationSettings]);

  // Safe tab change handler
  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    try {
      setActiveTab(newValue);
    } catch (error) {
      console.error('Tab change error:', error);
    }
  }, []);

  // Safe token visibility toggle
  const handleToggleTokenVisibility = useCallback(() => {
    try {
      setShowTokens(prev => !prev);
    } catch (error) {
      console.error('Token visibility toggle error:', error);
    }
  }, []);

  // Tab Panel Component
  const TabPanel = useMemo(() => 
    ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => (
      <div role="tabpanel" hidden={value !== index}>
        {value === index && (
          <Box sx={{ py: 3 }}>
            {children}
          </Box>
        )}
      </div>
    ), []
  );

  // Profile Settings Tab
  const ProfileTab = useMemo(() => (
    <SafeWrapper name="ProfileSettings">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Full Name"
                  value={profileData.name}
                  onChange={(e) => handleProfileUpdate('name', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleProfileUpdate('email', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Bio"
                  multiline
                  rows={3}
                  value={profileData.bio}
                  onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Location"
                  value={profileData.location}
                  onChange={(e) => handleProfileUpdate('location', e.target.value)}
                  fullWidth
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Social Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Website"
                  value={profileData.website}
                  onChange={(e) => handleProfileUpdate('website', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="LinkedIn Profile"
                  value={profileData.linkedin}
                  onChange={(e) => handleProfileUpdate('linkedin', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="GitHub Username"
                  value={profileData.github}
                  onChange={(e) => handleProfileUpdate('github', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="WhatsApp Number"
                  value={profileData.whatsapp}
                  onChange={(e) => handleProfileUpdate('whatsapp', e.target.value)}
                  fullWidth
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </SafeWrapper>
  ), [profileData, handleProfileUpdate]);

  // Integrations Tab
  const IntegrationsTab = useMemo(() => (
    <SafeWrapper name="IntegrationsSettings">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Configure your API keys and tokens to enable advanced features like GitHub integration and AI assistance.
            </Typography>
          </Alert>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <GitHub sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="h6">GitHub</Typography>
                  <Chip 
                    label="Not Connected" 
                    color="warning" 
                    size="small"
                  />
                </Box>
              </Box>
              <TextField
                label="GitHub Token"
                type={showTokens ? 'text' : 'password'}
                value={integrationData.githubToken}
                onChange={(e) => setIntegrationData(prev => ({ 
                  ...prev, 
                  githubToken: e.target.value 
                }))}
                fullWidth
                margin="normal"
              />
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                variant="outlined"
                onClick={() => openIntegrationDialog('github')}
              >
                Configure GitHub
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <LinkedIn sx={{ fontSize: 32, color: '#0077b5' }} />
                <Box>
                  <Typography variant="h6">LinkedIn</Typography>
                  <Chip 
                    label="Coming Soon" 
                    color="default" 
                    size="small"
                  />
                </Box>
              </Box>
              <TextField
                label="LinkedIn Token"
                type={showTokens ? 'text' : 'password'}
                value={integrationData.linkedinToken}
                onChange={(e) => setIntegrationData(prev => ({ 
                  ...prev, 
                  linkedinToken: e.target.value 
                }))}
                fullWidth
                margin="normal"
                disabled
              />
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                variant="outlined"
                onClick={() => openIntegrationDialog('linkedin')}
              >
                Configure LinkedIn
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <SmartToy sx={{ fontSize: 32, color: '#667eea' }} />
                <Box>
                  <Typography variant="h6">AI Assistant</Typography>
                  <Chip 
                    label="Not Configured" 
                    color="warning" 
                    size="small"
                  />
                </Box>
              </Box>
              <FormControl fullWidth margin="normal">
                <InputLabel>AI Provider</InputLabel>
                <Select
                  value={integrationData.aiProvider}
                  onChange={(e) => setIntegrationData(prev => ({ 
                    ...prev, 
                    aiProvider: e.target.value 
                  }))}
                >
                  <MenuItem value="openai">OpenAI</MenuItem>
                  <MenuItem value="anthropic">Anthropic</MenuItem>
                  <MenuItem value="google">Google AI</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="API Key"
                type={showTokens ? 'text' : 'password'}
                value={integrationData.aiApiKey}
                onChange={(e) => setIntegrationData(prev => ({ 
                  ...prev, 
                  aiApiKey: e.target.value 
                }))}
                fullWidth
                margin="normal"
              />
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                variant="outlined"
                onClick={() => openIntegrationDialog('ai')}
              >
                Configure AI Assistant
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={handleToggleTokenVisibility}>
              {showTokens ? <VisibilityOff /> : <Visibility />}
            </IconButton>
            <Typography variant="body2">
              {showTokens ? 'Hide' : 'Show'} API Keys and Tokens
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </SafeWrapper>
  ), [integrationData, showTokens, handleToggleTokenVisibility]);

  // Privacy Tab
  const PrivacyTab = useMemo(() => (
    <SafeWrapper name="PrivacySettings">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Privacy & Visibility
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Security />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Public Profile" 
                    secondary="Make your portfolio visible to everyone"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={privacySettings.profilePublic}
                      onChange={(e) => setPrivacySettings(prev => ({
                        ...prev,
                        profilePublic: e.target.checked
                      }))}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Info />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Show Email" 
                    secondary="Display email address on your portfolio"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={privacySettings.showEmail}
                      onChange={(e) => setPrivacySettings(prev => ({
                        ...prev,
                        showEmail: e.target.checked
                      }))}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Info />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Show Phone" 
                    secondary="Display phone number on your portfolio"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={privacySettings.showPhone}
                      onChange={(e) => setPrivacySettings(prev => ({
                        ...prev,
                        showPhone: e.target.checked
                      }))}
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
                      checked={privacySettings.allowIndexing}
                      onChange={(e) => setPrivacySettings(prev => ({
                        ...prev,
                        allowIndexing: e.target.checked
                      }))}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </SafeWrapper>
  ), [privacySettings]);

  // Notifications Tab
  const NotificationsTab = useMemo(() => (
    <SafeWrapper name="NotificationsSettings">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
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
                    secondary="Receive important updates via email"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        emailNotifications: e.target.checked
                      }))}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Browser Notifications" 
                    secondary="Get notified in your browser"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notificationSettings.browserNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        browserNotifications: e.target.checked
                      }))}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Marketing Emails" 
                    secondary="Receive tips and updates about new features"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notificationSettings.marketingEmails}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        marketingEmails: e.target.checked
                      }))}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </SafeWrapper>
  ), [notificationSettings]);

  // Data & Export Tab
  const DataExportTab = useMemo(() => (
    <SafeWrapper name="DataExportSettings">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Export Data
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Download your portfolio data in various formats
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<Download />}
                  onClick={() => setExportDialog(true)}
                >
                  Export Portfolio Data
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<Download />}
                >
                  Download Resume PDF
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<Download />}
                >
                  Export as HTML
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="error">
                Danger Zone
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                These actions cannot be undone
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  color="warning"
                  startIcon={<Refresh />}
                >
                  Reset Settings
                </Button>
                <Button 
                  variant="outlined" 
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => setDeleteDialog(true)}
                >
                  Delete Account
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </SafeWrapper>
  ), []);

  // Main render
  return (
    <SafeWrapper name="UltraSettingsPage">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => handleNavigation('/dashboard')}
            variant="outlined"
          >
            Back to Dashboard
          </Button>
          <Typography variant="h4" fontWeight="bold">
            Settings & Preferences
          </Typography>
        </Box>

        {/* Success Message */}
        {saveSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Settings saved successfully!
            </Typography>
          </Alert>
        )}

        {/* Main Content */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Profile" icon={<Edit />} />
            <Tab label="Integrations" icon={<Settings />} />
            <Tab label="Privacy" icon={<Security />} />
            <Tab label="Notifications" icon={<Notifications />} />
            <Tab label="Data & Export" icon={<Download />} />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            {ProfileTab}
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            {IntegrationsTab}
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            {PrivacyTab}
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            {NotificationsTab}
          </TabPanel>

          <TabPanel value={activeTab} index={4}>
            {DataExportTab}
          </TabPanel>
        </Paper>

        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Save />}
            onClick={handleSaveSettings}
            disabled={loading}
            sx={{ minWidth: 200 }}
          >
            {loading ? 'Saving...' : 'Save All Settings'}
          </Button>
        </Box>

        {/* Delete Account Dialog */}
        <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
          <DialogTitle>
            <Typography variant="h6" color="error">
              Delete Account
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Alert severity="error" sx={{ mb: 2 }}>
              This action cannot be undone!
            </Alert>
            <Typography variant="body2">
              Are you sure you want to delete your account? All your data, portfolios, and settings will be permanently removed.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>
              Cancel
            </Button>
            <Button color="error" variant="contained">
              Delete Account
            </Button>
          </DialogActions>
        </Dialog>

        {/* Export Dialog */}
        <Dialog open={exportDialog} onClose={() => setExportDialog(false)}>
          <DialogTitle>Export Portfolio Data</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Choose the format for your exported data:
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Export Format</InputLabel>
              <Select defaultValue="json">
                <MenuItem value="json">JSON</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
                <MenuItem value="pdf">PDF</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExportDialog(false)}>
              Cancel
            </Button>
            <Button variant="contained" startIcon={<Download />}>
              Export
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      
      {/* Working Integration Dialogs */}
      <WorkingGitHubIntegration
        open={integrationDialogs.github}
        onClose={() => closeIntegrationDialog('github')}
      />
      <WorkingLinkedInIntegration
        open={integrationDialogs.linkedin}
        onClose={() => closeIntegrationDialog('linkedin')}
      />
      <WorkingAIAssistantIntegration
        open={integrationDialogs.ai}
        onClose={() => closeIntegrationDialog('ai')}
      />
    </SafeWrapper>
  );
};

export default UltraSettingsPage;