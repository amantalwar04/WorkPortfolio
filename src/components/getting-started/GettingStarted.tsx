/**
 * Getting Started Component
 * Main entry point for users to import data or start fresh
 */

import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Alert,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Upload,
  Description,
  Person,
  Work,
  School,
  Code,
  Preview,
  Close,
  CheckCircle,
  Error,
  Refresh,
  GetApp,
  CloudUpload,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProfessionalData } from '../../contexts/ProfessionalDataContext';
import DocumentParserService, { DocumentParseResult } from '../../services/documentParser';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

interface GettingStartedProps {
  onDataReady?: () => void;
}

const GettingStarted: React.FC<GettingStartedProps> = ({ onDataReady }) => {
  const navigate = useNavigate();
  const { 
    data, 
    importDocument, 
    importData, 
    resetData, 
    hasData, 
    getCompletionPercentage 
  } = useProfessionalData();

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<DocumentParseResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      label: 'Choose Your Starting Point',
      description: 'Import existing resume or start fresh',
    },
    {
      label: 'Review & Edit Data',
      description: 'Verify and enhance your information',
    },
    {
      label: 'Generate Your Assets',
      description: 'Create portfolio and resume',
    },
  ];

  const startingOptions = [
    {
      id: 'upload',
      title: 'Import Resume Document',
      description: 'Upload your existing PDF or Word resume to auto-populate your data',
      icon: <Upload />,
      color: '#2196f3',
      action: () => setUploadDialogOpen(true),
      recommended: true,
    },
    {
      id: 'sample',
      title: 'Try with Sample Data',
      description: 'Explore features with realistic sample professional data',
      icon: <Preview />,
      color: '#ff9800',
      action: handleUseSampleData,
    },
    {
      id: 'scratch',
      title: 'Start from Scratch',
      description: 'Begin with a blank slate and enter your information manually',
      icon: <Person />,
      color: '#4caf50',
      action: handleStartFromScratch,
    },
  ];

  function handleUseSampleData() {
    const sampleData = {
      personalInfo: {
        fullName: 'John Smith',
        title: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        linkedin: 'https://linkedin.com/in/johnsmith',
        github: 'johnsmith',
        website: 'https://johnsmith.dev',
      },
      summary: 'Experienced software engineer with 8+ years of expertise in full-stack web development, cloud technologies, and team leadership.\n\nProven track record of delivering scalable solutions that serve millions of users and drive business growth. Passionate about mentoring teams and implementing best practices.',
      experience: [
        {
          id: 'exp-1',
          title: 'Senior Software Engineer',
          position: 'Senior Software Engineer',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA',
          startDate: 'Jan 2021',
          endDate: '',
          current: true,
          description: 'Lead development of microservices architecture serving 10M+ active users. Mentor junior developers and establish engineering best practices.',
          achievements: [
            'Reduced API response time by 60% through optimization',
            'Led team of 5 engineers on critical product features',
            'Implemented CI/CD pipeline reducing deployment time by 75%'
          ],
          skills: ['React', 'Node.js', 'AWS', 'PostgreSQL']
        },
        {
          id: 'exp-2',
          title: 'Software Engineer',
          position: 'Software Engineer',
          company: 'StartupXYZ',
          location: 'San Francisco, CA',
          startDate: 'Jun 2019',
          endDate: 'Dec 2020',
          current: false,
          description: 'Developed customer-facing web applications using modern JavaScript frameworks.',
          achievements: [
            'Built responsive web application serving 100K+ users',
            'Optimized database queries improving performance by 40%'
          ],
          skills: ['Vue.js', 'Python', 'MongoDB']
        }
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startDate: '2013',
          endDate: '2017',
          description: 'Graduated Magna Cum Laude',
          gpa: '3.8',
          achievements: ['Dean\'s List', 'Outstanding CS Student Award']
        }
      ],
      skills: [
        { id: 'skill-1', name: 'JavaScript', level: 9, category: 'Programming', years: 8, certified: false },
        { id: 'skill-2', name: 'React', level: 9, category: 'Frontend', years: 6, certified: false },
        { id: 'skill-3', name: 'Node.js', level: 8, category: 'Backend', years: 5, certified: false },
        { id: 'skill-4', name: 'AWS', level: 8, category: 'Cloud', years: 4, certified: true },
        { id: 'skill-5', name: 'PostgreSQL', level: 6, category: 'Database', years: 3, certified: false },
      ]
    };

    importData(sampleData);
    setActiveStep(1);
    if (onDataReady) onDataReady();
  }

  function handleStartFromScratch() {
    resetData();
    setActiveStep(1);
    navigate('/professional-builder');
  }

  const handleFileSelect = useCallback(async (file: File) => {
    setUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 80));
      }, 200);

      const result = await importDocument(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadResult(result);

      if (result.success) {
        setTimeout(() => {
          setUploadDialogOpen(false);
          setActiveStep(1);
          if (onDataReady) onDataReady();
        }, 1000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadResult({
        success: false,
        rawText: '',
        extractedData: {},
        errors: [error instanceof Error ? error.message : 'Upload failed']
      });
    } finally {
      setUploading(false);
    }
  }, [importDocument, onDataReady]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const DataSummary = () => {
    if (!hasData()) return null;

    const completion = getCompletionPercentage();
    
    return (
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ mb: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <CheckCircle />
              <Typography variant="h6">
                Data Ready! ({completion}% Complete)
              </Typography>
            </Box>
            
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              {data.personalInfo.fullName && `✓ ${data.personalInfo.fullName}`}
              {data.experience.length > 0 && ` • ${data.experience.length} experience entries`}
              {data.skills.length > 0 && ` • ${data.skills.length} skills`}
              {data.education.length > 0 && ` • ${data.education.length} education entries`}
            </Typography>

            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="contained"
                startIcon={<Work />}
                onClick={() => navigate('/professional-builder')}
                sx={{ bgcolor: 'success.dark' }}
              >
                Build Portfolio
              </Button>
              <Button
                variant="contained"
                startIcon={<Description />}
                onClick={() => navigate('/resume-generator')}
                sx={{ bgcolor: 'success.dark' }}
              >
                Generate Resume
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={resetData}
                sx={{ borderColor: 'success.dark', color: 'success.dark' }}
              >
                Start Over
              </Button>
            </Box>
          </CardContent>
        </Card>
      </MotionBox>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <MotionBox
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{ textAlign: 'center', mb: 6 }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Getting Started
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Import your existing resume or start fresh to create a professional portfolio and resume
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel>
                <Typography variant="body1" fontWeight="medium">
                  {step.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </MotionBox>

      <DataSummary />

      <Grid container spacing={3}>
        {startingOptions.map((option, index) => (
          <Grid item xs={12} md={4} key={option.id}>
            <MotionCard
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              }}
              sx={{
                height: '100%',
                cursor: 'pointer',
                position: 'relative',
                border: option.recommended ? 2 : 0,
                borderColor: 'primary.main',
              }}
              onClick={option.action}
            >
              {option.recommended && (
                <Chip
                  label="Recommended"
                  color="primary"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 1,
                  }}
                />
              )}
              
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: option.color,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: '1.5rem',
                  }}
                >
                  {option.icon}
                </Box>
                
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {option.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  {option.description}
                </Typography>
              </CardContent>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => !uploading && setUploadDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Import Resume Document</Typography>
            {!uploading && (
              <IconButton onClick={() => setUploadDialogOpen(false)}>
                <Close />
              </IconButton>
            )}
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {!uploading && !uploadResult && (
            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: dragOver ? 'primary.main' : 'grey.300',
                bgcolor: dragOver ? 'primary.light' : 'grey.50',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Drop your resume here or click to browse
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Supports PDF, Word documents (.docx), and text files
              </Typography>
              <Button variant="outlined" component="span">
                Choose File
              </Button>
              <input
                id="file-input"
                type="file"
                hidden
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileInputChange}
              />
            </Paper>
          )}

          {uploading && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>
                Processing your resume...
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress} 
                sx={{ mb: 2, height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" color="text.secondary">
                {uploadProgress < 80 ? 'Extracting text...' : 'Analyzing content...'}
              </Typography>
            </Box>
          )}

          {uploadResult && (
            <Box sx={{ py: 2 }}>
              {uploadResult.success ? (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    ✅ Resume imported successfully!
                  </Typography>
                  <Typography variant="body2">
                    Extracted your professional information and auto-populated the fields.
                  </Typography>
                </Alert>
              ) : (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    ❌ Upload failed
                  </Typography>
                  {uploadResult.errors?.map((error, index) => (
                    <Typography key={index} variant="body2">
                      • {error}
                    </Typography>
                  ))}
                </Alert>
              )}

              {uploadResult.rawText && (
                <Paper sx={{ p: 2, bgcolor: 'grey.50', maxHeight: 200, overflow: 'auto' }}>
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>
                    {uploadResult.rawText.substring(0, 500)}
                    {uploadResult.rawText.length > 500 && '...'}
                  </Typography>
                </Paper>
              )}
            </Box>
          )}
        </DialogContent>

        {!uploading && (
          <DialogActions>
            <Button onClick={() => setUploadDialogOpen(false)}>
              {uploadResult?.success ? 'Continue' : 'Cancel'}
            </Button>
            {uploadResult && !uploadResult.success && (
              <Button
                variant="outlined"
                startIcon={<GetApp />}
                onClick={() => {
                  const sampleText = DocumentParserService.generateSampleResumeText();
                  const blob = new Blob([sampleText], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'sample-resume.txt';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Download Sample Format
              </Button>
            )}
          </DialogActions>
        )}
      </Dialog>
    </Container>
  );
};

export default GettingStarted;