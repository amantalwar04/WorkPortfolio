import React, { useState, useEffect, useRef } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  Download,
  Preview,
  SmartToy,
  Refresh,
  Add,
  Delete,
  Edit,
  Save,
  Share,
  LinkedIn,
  GitHub,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Hooks & Services
import { useUser, usePortfolio, useRepositories, useLinkedInProfile } from '../store';
import { useResume } from '../hooks/useResume';
import { useAI } from '../hooks/useAI';

// Types
import { Experience, Education, Skill, Project, Certificate, ResumeData } from '../types';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`resume-tabpanel-${index}`}
    aria-labelledby={`resume-tab-${index}`}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const ResumeGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const portfolio = usePortfolio();
  const repositories = useRepositories();
  const linkedinProfile = useLinkedInProfile();
  
  const { templates, generatePDFFromData, downloadPDF } = useResume();
  const { optimizeResumeContent, suggestSkills } = useAI();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('modern-tech');
  const [tabValue, setTabValue] = useState(0);
  const [resumeData, setResumeData] = useState<ResumeData>({
    user: user || {} as any,
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certificates: [],
    summary: '',
  });
  const [showPreview, setShowPreview] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiOptimizing, setAiOptimizing] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  
  const previewRef = useRef<HTMLDivElement>(null);

  // Initialize resume data from existing portfolio/profile data
  useEffect(() => {
    if (user) {
      const portfolioSections = portfolio?.sections || [];
      
      // Extract data from portfolio sections
      const experienceSection = portfolioSections.find(s => s.type === 'experience');
      const educationSection = portfolioSections.find(s => s.type === 'education');
      const skillsSection = portfolioSections.find(s => s.type === 'skills');
      const projectsSection = portfolioSections.find(s => s.type === 'projects');
      const aboutSection = portfolioSections.find(s => s.type === 'about');

      setResumeData({
        user,
        experience: experienceSection?.data?.experiences || linkedinProfile?.positions?.map(pos => ({
          id: pos.id,
          company: pos.company,
          position: pos.title,
          description: pos.description || '',
          startDate: pos.startDate,
          endDate: pos.endDate,
          current: pos.current,
          location: pos.location || '',
          skills: [],
          achievements: [],
        })) || [],
        education: educationSection?.data?.education || linkedinProfile?.educations?.map(edu => ({
          id: edu.id,
          institution: edu.school,
          degree: edu.degree || '',
          field: edu.field || '',
          startDate: edu.startDate,
          endDate: edu.endDate,
          achievements: [],
        })) || [],
        skills: skillsSection?.data?.skills || linkedinProfile?.skills?.map((skill, index) => ({
          id: `skill-${index}`,
          name: skill,
          category: 'programming' as const,
          level: 'intermediate' as const,
        })) || [],
        projects: projectsSection?.data?.projects || repositories.slice(0, 6).map(repo => ({
          id: repo.id.toString(),
          title: repo.name,
          description: repo.description || '',
          technologies: repo.language ? [repo.language] : [],
          github_url: repo.html_url,
          live_url: repo.homepage || '',
          featured: repo.stargazers_count > 0,
          category: 'web' as const,
          status: 'completed' as const,
        })),
        certificates: [],
        summary: aboutSection?.data?.bio || user.bio || '',
      });
    }
  }, [user, portfolio, repositories, linkedinProfile]);

  const steps = [
    'Choose Template',
    'Personal Info',
    'Professional Summary', 
    'Work Experience',
    'Education',
    'Skills',
    'Projects',
    'Review & Generate'
  ];

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    handleNext();
  };

  const updateResumeData = (section: keyof ResumeData, data: any) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data,
    }));
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      company: '',
      position: '',
      description: '',
      startDate: '',
      endDate: '',
      current: false,
      location: '',
      skills: [],
      achievements: [],
    };
    updateResumeData('experience', [...resumeData.experience, newExp]);
  };

  const updateExperience = (index: number, updatedExp: Experience) => {
    const updated = [...resumeData.experience];
    updated[index] = updatedExp;
    updateResumeData('experience', updated);
  };

  const removeExperience = (index: number) => {
    updateResumeData('experience', resumeData.experience.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      achievements: [],
    };
    updateResumeData('education', [...resumeData.education, newEdu]);
  };

  const updateEducation = (index: number, updatedEdu: Education) => {
    const updated = [...resumeData.education];
    updated[index] = updatedEdu;
    updateResumeData('education', updated);
  };

  const removeEducation = (index: number) => {
    updateResumeData('education', resumeData.education.filter((_, i) => i !== index));
  };

  const addSkill = (skillName: string) => {
    if (skillName.trim() && !resumeData.skills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) {
      const newSkill: Skill = {
        id: `skill-${Date.now()}`,
        name: skillName.trim(),
        category: 'programming',
        level: 'intermediate',
      };
      updateResumeData('skills', [...resumeData.skills, newSkill]);
    }
  };

  const removeSkill = (index: number) => {
    updateResumeData('skills', resumeData.skills.filter((_, i) => i !== index));
  };

  const handleAIOptimize = async (content: string, field: string) => {
    setAiOptimizing(true);
    try {
      const result = await optimizeResumeContent(content, 'Software Developer');
      if (field === 'summary') {
        updateResumeData('summary', result.improved);
      }
      // Handle other fields as needed
    } catch (error) {
      console.error('AI optimization failed:', error);
    } finally {
      setAiOptimizing(false);
    }
  };

  const handleSuggestSkills = async () => {
    try {
      const suggestions = await suggestSkills(resumeData.projects, resumeData.experience);
      // Add suggested skills that don't already exist
      const newSkills = suggestions
        .filter(skill => !resumeData.skills.some(s => s.name.toLowerCase() === skill.toLowerCase()))
        .slice(0, 10)
        .map(skill => ({
          id: `skill-${Date.now()}-${skill}`,
          name: skill,
          category: 'programming' as const,
          level: 'intermediate' as const,
        }));
      
      updateResumeData('skills', [...resumeData.skills, ...newSkills]);
    } catch (error) {
      console.error('Skill suggestion failed:', error);
    }
  };

  const handleGenerateResume = async () => {
    setGenerating(true);
    try {
      const filename = `${resumeData.user.name?.replace(/\s+/g, '_')}_Resume_${selectedTemplate}.pdf`;
      const blob = await generatePDFFromData(resumeData, selectedTemplate, filename);
      downloadPDF(blob, filename);
    } catch (error) {
      console.error('Resume generation failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  const calculateCompleteness = () => {
    let score = 0;
    const maxScore = 7;
    
    if (resumeData.user.name) score++;
    if (resumeData.summary) score++;
    if (resumeData.experience.length > 0) score++;
    if (resumeData.education.length > 0) score++;
    if (resumeData.skills.length > 0) score++;
    if (resumeData.projects.length > 0) score++;
    if (resumeData.user.email) score++;
    
    return Math.round((score / maxScore) * 100);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            {templates.map((template) => (
              <Grid item xs={12} sm={6} md={3} key={template.id}>
                <MotionCard
                  whileHover={{ y: -4, scale: 1.02 }}
                  sx={{
                    cursor: 'pointer',
                    border: selectedTemplate === template.id ? '2px solid' : '1px solid',
                    borderColor: selectedTemplate === template.id ? 'primary.main' : 'grey.300',
                  }}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {template.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {template.description}
                    </Typography>
                    <Chip 
                      label={template.category} 
                      size="small" 
                      color={selectedTemplate === template.id ? 'primary' : 'default'}
                    />
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      variant={selectedTemplate === template.id ? 'contained' : 'outlined'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTemplateSelect(template.id);
                      }}
                    >
                      {selectedTemplate === template.id ? 'Selected' : 'Select'}
                    </Button>
                  </CardActions>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                value={resumeData.user.name || ''}
                onChange={(e) => updateResumeData('user', { ...resumeData.user, name: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                value={resumeData.user.email || ''}
                onChange={(e) => updateResumeData('user', { ...resumeData.user, email: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                value={resumeData.user.whatsapp || ''}
                onChange={(e) => updateResumeData('user', { ...resumeData.user, whatsapp: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Location"
                value={resumeData.user.location || ''}
                onChange={(e) => updateResumeData('user', { ...resumeData.user, location: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="LinkedIn"
                value={resumeData.user.linkedin || ''}
                onChange={(e) => updateResumeData('user', { ...resumeData.user, linkedin: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="GitHub"
                value={resumeData.user.username ? `https://github.com/${resumeData.user.username}` : ''}
                onChange={(e) => {
                  const username = e.target.value.replace('https://github.com/', '');
                  updateResumeData('user', { ...resumeData.user, username });
                }}
                fullWidth
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Box sx={{ position: 'relative', mb: 2 }}>
              <TextField
                label="Professional Summary"
                value={resumeData.summary}
                onChange={(e) => updateResumeData('summary', e.target.value)}
                multiline
                rows={6}
                fullWidth
                placeholder="Write a compelling summary that highlights your key skills, experience, and career objectives..."
              />
              <Tooltip title="Optimize with AI">
                <IconButton
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  onClick={() => handleAIOptimize(resumeData.summary, 'summary')}
                  disabled={aiOptimizing}
                  color="primary"
                >
                  <SmartToy />
                </IconButton>
              </Tooltip>
            </Box>
            {aiOptimizing && <LinearProgress sx={{ mb: 2 }} />}
          </Box>
        );

      case 3:
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Work Experience</Typography>
              <Button startIcon={<Add />} onClick={addExperience} variant="outlined">
                Add Experience
              </Button>
            </Box>

            {resumeData.experience.map((exp, index) => (
              <Paper key={exp.id} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Experience {index + 1}
                  </Typography>
                  <IconButton onClick={() => removeExperience(index)} color="error">
                    <Delete />
                  </IconButton>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Job Title"
                      value={exp.position}
                      onChange={(e) => updateExperience(index, { ...exp, position: e.target.value })}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Company"
                      value={exp.company}
                      onChange={(e) => updateExperience(index, { ...exp, company: e.target.value })}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Start Date"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(index, { ...exp, startDate: e.target.value })}
                      placeholder="MM/YYYY"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="End Date"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(index, { ...exp, endDate: e.target.value })}
                      placeholder="MM/YYYY or Present"
                      fullWidth
                      disabled={exp.current}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={exp.current}
                          onChange={(e) => updateExperience(index, { ...exp, current: e.target.checked })}
                        />
                      }
                      label="Currently working here"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Job Description"
                      value={exp.description}
                      onChange={(e) => updateExperience(index, { ...exp, description: e.target.value })}
                      multiline
                      rows={4}
                      fullWidth
                      placeholder="Describe your responsibilities, achievements, and impact..."
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))}

            {resumeData.experience.length === 0 && (
              <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  No work experience added yet
                </Typography>
                <Button startIcon={<Add />} onClick={addExperience} variant="contained">
                  Add Your First Experience
                </Button>
              </Paper>
            )}
          </Box>
        );

      case 4:
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Education</Typography>
              <Button startIcon={<Add />} onClick={addEducation} variant="outlined">
                Add Education
              </Button>
            </Box>

            {resumeData.education.map((edu, index) => (
              <Paper key={edu.id} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Education {index + 1}
                  </Typography>
                  <IconButton onClick={() => removeEducation(index)} color="error">
                    <Delete />
                  </IconButton>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Degree"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, { ...edu, degree: e.target.value })}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Field of Study"
                      value={edu.field}
                      onChange={(e) => updateEducation(index, { ...edu, field: e.target.value })}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Institution"
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, { ...edu, institution: e.target.value })}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Start Date"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(index, { ...edu, startDate: e.target.value })}
                      placeholder="MM/YYYY"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="End Date"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(index, { ...edu, endDate: e.target.value })}
                      placeholder="MM/YYYY"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="GPA (Optional)"
                      value={edu.gpa}
                      onChange={(e) => updateEducation(index, { ...edu, gpa: e.target.value })}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        );

      case 5:
        return (
          <SkillsEditor
            skills={resumeData.skills}
            onSkillsChange={(skills) => updateResumeData('skills', skills)}
            onSuggestSkills={handleSuggestSkills}
          />
        );

      case 6:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Projects (Auto-populated from GitHub)
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Your GitHub projects have been automatically imported. You can edit or add additional projects.
            </Typography>
            
            {resumeData.projects.length > 0 ? (
              <Grid container spacing={2}>
                {resumeData.projects.map((project, index) => (
                  <Grid item xs={12} md={6} key={project.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {project.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {project.description}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                          {project.technologies.map((tech, techIndex) => (
                            <Chip key={techIndex} label={tech} size="small" />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">
                No projects found. Connect your GitHub account to import projects automatically.
              </Alert>
            )}
          </Box>
        );

      case 7:
        return (
          <ReviewAndGenerate
            resumeData={resumeData}
            selectedTemplate={selectedTemplate}
            onGenerate={handleGenerateResume}
            generating={generating}
            completeness={calculateCompleteness()}
          />
        );

      default:
        return null;
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
          AI-Powered Resume Generator
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Stepper */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Stepper activeStep={currentStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                {steps[currentStep]}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(currentStep / (steps.length - 1)) * 100} 
                sx={{ mb: 2 }}
              />
            </Box>

            {renderStepContent(currentStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={currentStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                {currentStep === steps.length - 1 ? (
                  <Button
                    onClick={handleGenerateResume}
                    variant="contained"
                    startIcon={<Download />}
                    disabled={generating}
                  >
                    {generating ? 'Generating...' : 'Download Resume'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    variant="contained"
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

// Skills Editor Component
const SkillsEditor: React.FC<{
  skills: Skill[];
  onSkillsChange: (skills: Skill[]) => void;
  onSuggestSkills: () => void;
}> = ({ skills, onSkillsChange, onSuggestSkills }) => {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !skills.some(s => s.name.toLowerCase() === newSkill.toLowerCase())) {
      const skill: Skill = {
        id: `skill-${Date.now()}`,
        name: newSkill.trim(),
        category: 'programming',
        level: 'intermediate',
      };
      onSkillsChange([...skills, skill]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    onSkillsChange(skills.filter((_, i) => i !== index));
  };

  const skillCategories = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Skills</Typography>
        <Button
          startIcon={<SmartToy />}
          onClick={onSuggestSkills}
          variant="outlined"
          color="primary"
        >
          AI Skill Suggestions
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <TextField
          label="Add new skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          size="small"
          sx={{ flexGrow: 1 }}
        />
        <Button onClick={addSkill} variant="outlined">
          Add
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {skills.map((skill, index) => (
          <Chip
            key={skill.id}
            label={skill.name}
            onDelete={() => removeSkill(index)}
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>

      {skills.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Add your technical skills to showcase your expertise. Click "AI Skill Suggestions" to get recommendations based on your projects and experience.
        </Alert>
      )}
    </Box>
  );
};

// Review and Generate Component
const ReviewAndGenerate: React.FC<{
  resumeData: ResumeData;
  selectedTemplate: string;
  onGenerate: () => void;
  generating: boolean;
  completeness: number;
}> = ({ resumeData, selectedTemplate, onGenerate, generating, completeness }) => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Resume Completeness
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={completeness} 
          sx={{ height: 8, borderRadius: 4, mb: 1 }}
          color={completeness >= 80 ? 'success' : completeness >= 60 ? 'warning' : 'error'}
        />
        <Typography variant="body2" color="text.secondary">
          {completeness}% complete
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Resume Summary
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Template:</Typography>
                <Typography variant="body2" fontWeight="bold">{selectedTemplate}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Experience entries:</Typography>
                <Typography variant="body2" fontWeight="bold">{resumeData.experience.length}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Education entries:</Typography>
                <Typography variant="body2" fontWeight="bold">{resumeData.education.length}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Skills:</Typography>
                <Typography variant="body2" fontWeight="bold">{resumeData.skills.length}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Projects:</Typography>
                <Typography variant="body2" fontWeight="bold">{resumeData.projects.length}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              ATS Optimization Tips
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />
                <Typography variant="body2">Use standard section headers</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />
                <Typography variant="body2">Include relevant keywords</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />
                <Typography variant="body2">Quantify achievements</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {completeness >= 80 ? (
                  <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />
                ) : (
                  <Warning sx={{ color: 'warning.main', fontSize: 16 }} />
                )}
                <Typography variant="body2">Complete all sections</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<Download />}
          onClick={onGenerate}
          disabled={generating || completeness < 50}
          sx={{ px: 4, py: 1.5 }}
        >
          {generating ? 'Generating Resume...' : 'Generate & Download Resume'}
        </Button>
        
        {completeness < 50 && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Please complete at least 50% of your resume to generate
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ResumeGeneratorPage;