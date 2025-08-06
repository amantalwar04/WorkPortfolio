/**
 * LinkedIn Import Component
 * Handles LinkedIn OAuth authentication and data import
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  LinearProgress,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  LinkedIn,
  CheckCircle,
  Warning,
  Info,
  Person,
  Work,
  School,
  Star,
  Article,
  ThumbUp,
  Refresh,
  Preview,
  Close,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

import LinkedInApiService, { LinkedInImportData, LinkedInRecommendation, LinkedInPost } from '../../services/linkedinApi';
import LinkedInDataMapper, { LinkedInMappingResult } from '../../services/linkedinDataMapper';
import LinkedInDemoService from '../../services/linkedinDemo';
import { ProfessionalPortfolioData } from '../../types';

interface LinkedInImportProps {
  onDataImported: (data: Partial<ProfessionalPortfolioData>, recommendations: LinkedInRecommendation[], posts: LinkedInPost[]) => void;
  existingData?: ProfessionalPortfolioData;
  disabled?: boolean;
}

interface ImportStep {
  key: string;
  label: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  data?: any;
  error?: string;
}

export const LinkedInImport: React.FC<LinkedInImportProps> = ({
  onDataImported,
  existingData,
  disabled = false
}) => {
  const [linkedinService] = useState(() => new LinkedInApiService());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importSteps, setImportSteps] = useState<ImportStep[]>([]);
  const [importedData, setImportedData] = useState<LinkedInImportData | null>(null);
  const [mappedData, setMappedData] = useState<LinkedInMappingResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [configurationStatus] = useState(() => LinkedInApiService.getConfigurationStatus());
  const [mergeOptions, setMergeOptions] = useState({
    overwritePersonalInfo: true,
    mergeExperience: true,
    mergeEducation: true,
    mergeSkills: true,
    enhanceSummary: true,
  });

  // Check authentication status on mount
  useEffect(() => {
    setIsAuthenticated(linkedinService.isAuthenticated());
  }, [linkedinService]);

  // Listen for OAuth callback
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'LINKEDIN_OAUTH_SUCCESS') {
        setIsAuthenticated(true);
        window.location.reload(); // Refresh to clear OAuth popup
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleAuthenticate = useCallback(() => {
    try {
      LinkedInApiService.initiateOAuth();
    } catch (error) {
      console.error('LinkedIn authentication error:', error);
      alert(error instanceof Error ? error.message : 'LinkedIn authentication failed');
    }
  }, []);

  const handleLogout = useCallback(() => {
    linkedinService.logout();
    setIsAuthenticated(false);
    setImportedData(null);
    setMappedData(null);
  }, [linkedinService]);

  const handleImportData = useCallback(async (useDemo = false) => {
    if (!useDemo && !isAuthenticated) return;

    setIsImporting(true);
    setImportSteps([
      { key: 'profile', label: useDemo ? 'Loading demo profile information' : 'Importing profile information', status: 'loading' },
      { key: 'experience', label: useDemo ? 'Loading demo work experience' : 'Importing work experience', status: 'pending' },
      { key: 'education', label: useDemo ? 'Loading demo education' : 'Importing education', status: 'pending' },
      { key: 'skills', label: useDemo ? 'Loading demo skills' : 'Importing skills', status: 'pending' },
      { key: 'recommendations', label: useDemo ? 'Loading demo recommendations' : 'Importing recommendations', status: 'pending' },
      { key: 'posts', label: useDemo ? 'Loading demo posts' : 'Importing recent posts', status: 'pending' },
    ]);

    try {
      const data = useDemo 
        ? await LinkedInDemoService.importSampleData()
        : await linkedinService.importAllData();
      
      // Update steps as they complete
      const steps = [
        { key: 'profile', data: data.profile },
        { key: 'experience', data: data.positions },
        { key: 'education', data: data.education },
        { key: 'skills', data: data.skills },
        { key: 'recommendations', data: data.recommendations },
        { key: 'posts', data: data.posts },
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, useDemo ? 300 : 500)); // Faster for demo
        
        setImportSteps(prev => prev.map((step, index) => {
          if (index === i) {
            return {
              ...step,
              status: steps[i].data ? 'success' : 'error',
              data: steps[i].data,
              error: !steps[i].data ? 'No data available' : undefined,
            };
          } else if (index === i + 1) {
            return { ...step, status: 'loading' };
          }
          return step;
        }));
      }

      setImportedData(data);
      
      // Map the data to portfolio format
      const mapped = LinkedInDataMapper.mapLinkedInToPortfolio(data);
      setMappedData(mapped);
      setShowPreview(true);

    } catch (error) {
      console.error('LinkedIn import error:', error);
      setImportSteps(prev => prev.map(step => ({
        ...step,
        status: step.status === 'loading' ? 'error' : step.status,
        error: error instanceof Error ? error.message : 'Import failed',
      })));
    } finally {
      setIsImporting(false);
    }
  }, [isAuthenticated, linkedinService]);

  const handleConfirmImport = useCallback(() => {
    if (!mappedData) return;

    let finalData: Partial<ProfessionalPortfolioData>;

    if (existingData) {
      // Merge with existing data
      finalData = LinkedInDataMapper.mergeWithExistingPortfolio(
        existingData,
        importedData!,
        mergeOptions
      );
    } else {
      // Use mapped data as-is
      finalData = mappedData.portfolioData;
    }

    onDataImported(finalData, mappedData.recommendations, mappedData.posts);
    setShowPreview(false);
  }, [mappedData, importedData, existingData, mergeOptions, onDataImported]);

  const renderAuthenticationCard = () => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <LinkedIn color="primary" sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h6">LinkedIn Integration</Typography>
            <Typography variant="body2" color="text.secondary">
              Import your profile, experience, skills, and recommendations
            </Typography>
          </Box>
        </Box>

        {!configurationStatus.isConfigured ? (
          <>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                <strong>LinkedIn API Configuration Required</strong>
              </Typography>
              <Typography variant="body2" paragraph>
                {configurationStatus.error}
              </Typography>
              <Typography variant="body2">
                {configurationStatus.instructions}
              </Typography>
            </Alert>
            
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Quick Setup Instructions:</strong>
              </Typography>
              <Box component="ol" sx={{ mt: 1, pl: 2 }}>
                <li>Visit <a href="https://www.linkedin.com/developers/apps" target="_blank" rel="noopener noreferrer">LinkedIn Developers</a></li>
                <li>Create a new app with your company details</li>
                <li>Add redirect URL: <code>{window.location.origin}/linkedin-callback</code></li>
                <li>Copy your Client ID and configure environment variables</li>
                <li>Request "Sign In with LinkedIn" product access</li>
              </Box>
            </Alert>

            <Button
              variant="outlined"
              startIcon={<LinkedIn />}
              href="https://www.linkedin.com/developers/apps"
              target="_blank"
              rel="noopener noreferrer"
              fullWidth
              sx={{ mb: 2 }}
            >
              Set Up LinkedIn Developer App
            </Button>

            <Button
              variant="contained"
              startIcon={<LinkedIn />}
              onClick={handleAuthenticate}
              disabled={true}
              fullWidth
              sx={{ mb: 2 }}
            >
              Connect LinkedIn Account (Setup Required)
            </Button>

            <Button
              variant="outlined"
              startIcon={<Preview />}
              onClick={() => handleImportData(true)}
              disabled={disabled || isImporting}
              fullWidth
            >
              {isImporting ? 'Loading Demo Data...' : 'Try Demo with Sample Data'}
            </Button>
          </>
        ) : !isAuthenticated ? (
          <>
            <Alert severity="info" sx={{ mb: 2 }}>
              Connect your LinkedIn account to automatically import your professional information.
            </Alert>
            <Button
              variant="contained"
              startIcon={<LinkedIn />}
              onClick={handleAuthenticate}
              disabled={disabled}
              fullWidth
              sx={{ mb: 1 }}
            >
              Connect LinkedIn Account
            </Button>

            <Button
              variant="outlined"
              startIcon={<Preview />}
              onClick={() => handleImportData(true)}
              disabled={disabled || isImporting}
              fullWidth
              size="small"
            >
              {isImporting ? 'Loading Demo Data...' : 'Try Demo with Sample Data'}
            </Button>
          </>
        ) : (
          <>
            <Alert severity="success" sx={{ mb: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <span>LinkedIn account connected successfully!</span>
                <Button size="small" onClick={handleLogout}>
                  Disconnect
                </Button>
              </Box>
            </Alert>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={() => handleImportData(false)}
              disabled={disabled || isImporting}
              fullWidth
              sx={{ mb: 1 }}
            >
              {isImporting ? 'Importing Data...' : 'Import LinkedIn Data'}
            </Button>

            <Button
              variant="outlined"
              startIcon={<Preview />}
              onClick={() => handleImportData(true)}
              disabled={disabled || isImporting}
              fullWidth
              size="small"
            >
              Try Demo Data
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );

  const renderImportProgress = () => {
    if (importSteps.length === 0) return null;

    return (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Import Progress
          </Typography>
          <List>
            {importSteps.map((step, index) => (
              <ListItem key={step.key}>
                <ListItemIcon>
                  {step.status === 'loading' && <LinearProgress sx={{ width: 24 }} />}
                  {step.status === 'success' && <CheckCircle color="success" />}
                  {step.status === 'error' && <Warning color="error" />}
                  {step.status === 'pending' && <Info color="disabled" />}
                </ListItemIcon>
                <ListItemText
                  primary={step.label}
                  secondary={step.error || (step.status === 'success' ? 'Completed' : '')}
                />
                {step.data && Array.isArray(step.data) && (
                  <Chip label={`${step.data.length} items`} size="small" />
                )}
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  };

  const renderPreviewDialog = () => {
    if (!showPreview || !mappedData) return null;

    const { portfolioData, recommendations, posts } = mappedData;

    return (
      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <Preview />
              <span>LinkedIn Import Preview</span>
            </Box>
            <IconButton onClick={() => setShowPreview(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={2}>
            {/* Personal Info Preview */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Person color="primary" />
                    <Typography variant="h6">Personal Information</Typography>
                  </Box>
                  {portfolioData.personalInfo?.avatar && (
                    <Avatar
                      src={portfolioData.personalInfo.avatar}
                      sx={{ width: 60, height: 60, mb: 2 }}
                    />
                  )}
                  <Typography variant="body1">
                    <strong>{portfolioData.personalInfo?.fullName}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {portfolioData.personalInfo?.title}
                  </Typography>
                  <Typography variant="body2">
                    {portfolioData.personalInfo?.location}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Experience Preview */}
            {portfolioData.experience && portfolioData.experience.length > 0 && (
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Work color="primary" />
                      <Typography variant="h6">
                        Experience ({portfolioData.experience.length})
                      </Typography>
                    </Box>
                    {portfolioData.experience.slice(0, 3).map((exp, index) => (
                      <Box key={index} mb={1}>
                        <Typography variant="body2" fontWeight="bold">
                          {exp.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {exp.company} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </Typography>
                      </Box>
                    ))}
                    {portfolioData.experience.length > 3 && (
                      <Typography variant="caption">
                        ...and {portfolioData.experience.length - 3} more
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Skills Preview */}
            {portfolioData.skills && portfolioData.skills.length > 0 && (
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Star color="primary" />
                      <Typography variant="h6">
                        Skills ({portfolioData.skills.length})
                      </Typography>
                    </Box>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {portfolioData.skills.slice(0, 6).map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill.name}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                      {portfolioData.skills.length > 6 && (
                        <Chip
                          label={`+${portfolioData.skills.length - 6} more`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Recommendations Preview */}
            {recommendations.length > 0 && (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <ThumbUp color="primary" />
                      <Typography variant="h6">
                        Recommendations ({recommendations.length})
                      </Typography>
                    </Box>
                    {recommendations.slice(0, 2).map((rec, index) => (
                      <Box key={index} mb={2}>
                        <Typography variant="body2" paragraph>
                          "{rec.text.substring(0, 150)}..."
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          — {rec.recommender.firstName} {rec.recommender.lastName}
                          {rec.recommender.headline && `, ${rec.recommender.headline}`}
                        </Typography>
                        {index < recommendations.slice(0, 2).length - 1 && <Divider sx={{ mt: 1 }} />}
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Posts Preview */}
            {posts.length > 0 && (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Article color="primary" />
                      <Typography variant="h6">
                        Recent Posts ({posts.length})
                      </Typography>
                    </Box>
                    {posts.slice(0, 3).map((post, index) => (
                      <Box key={index} mb={2}>
                        <Typography variant="body2" paragraph>
                          {post.text.substring(0, 100)}...
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(post.publishedAt).toLocaleDateString()}
                          {post.engagement && (
                            <>
                              • {post.engagement.likes} likes
                              • {post.engagement.comments} comments
                            </>
                          )}
                        </Typography>
                        {index < posts.slice(0, 3).length - 1 && <Divider sx={{ mt: 1 }} />}
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>

          {/* Merge Options */}
          {existingData && (
            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                Import Options
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={mergeOptions.overwritePersonalInfo}
                        onChange={(e) => setMergeOptions(prev => ({
                          ...prev,
                          overwritePersonalInfo: e.target.checked
                        }))}
                      />
                    }
                    label="Update personal information"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={mergeOptions.mergeExperience}
                        onChange={(e) => setMergeOptions(prev => ({
                          ...prev,
                          mergeExperience: e.target.checked
                        }))}
                      />
                    }
                    label="Add to existing experience"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={mergeOptions.mergeSkills}
                        onChange={(e) => setMergeOptions(prev => ({
                          ...prev,
                          mergeSkills: e.target.checked
                        }))}
                      />
                    }
                    label="Merge with existing skills"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={mergeOptions.enhanceSummary}
                        onChange={(e) => setMergeOptions(prev => ({
                          ...prev,
                          enhanceSummary: e.target.checked
                        }))}
                      />
                    }
                    label="Enhance summary with recommendations"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleConfirmImport}>
            Import Data
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {renderAuthenticationCard()}
      {renderImportProgress()}
      {renderPreviewDialog()}
    </motion.div>
  );
};

export default LinkedInImport;