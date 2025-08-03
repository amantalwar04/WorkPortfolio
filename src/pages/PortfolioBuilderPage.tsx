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
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  ArrowBack,
  Add,
  Visibility,
  Save,
  Publish,
  Download,
  Share,
  Palette,
  Settings,
  Preview,
  Code,
  SmartToy,
  GitHub,
  LinkedIn,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Components
import PortfolioSection from '../components/portfolio/PortfolioSection';
import SectionEditor from '../components/portfolio/SectionEditor';
import WhatsAppButton from '../components/common/WhatsAppButton';

// Hooks & Store
import { useUser, usePortfolio, useRepositories, useAppActions } from '../store';
import { useGitHub } from '../hooks/useGitHub';
import { useLinkedIn } from '../hooks/useLinkedIn';

// Types
import { PortfolioSection as PortfolioSectionType, SectionType, PortfolioTheme } from '../types';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const sectionTemplates = [
  { type: 'hero' as SectionType, title: 'Hero Section', description: 'Introduction with name and title' },
  { type: 'about' as SectionType, title: 'About Me', description: 'Personal story and background' },
  { type: 'experience' as SectionType, title: 'Work Experience', description: 'Professional work history' },
  { type: 'projects' as SectionType, title: 'Projects', description: 'Showcase your best work' },
  { type: 'skills' as SectionType, title: 'Skills', description: 'Technical skills and expertise' },
  { type: 'education' as SectionType, title: 'Education', description: 'Academic background' },
  { type: 'certificates' as SectionType, title: 'Certificates', description: 'Professional certifications' },
  { type: 'contact' as SectionType, title: 'Contact', description: 'Get in touch section' },
];

const themePresets = [
  { name: 'Modern Tech', primaryColor: '#667eea', secondaryColor: '#764ba2', backgroundColor: '#f8f9fa' },
  { name: 'Professional Blue', primaryColor: '#2563eb', secondaryColor: '#1e40af', backgroundColor: '#ffffff' },
  { name: 'Creative Purple', primaryColor: '#8b5cf6', secondaryColor: '#7c3aed', backgroundColor: '#f3f4f6' },
  { name: 'Elegant Green', primaryColor: '#10b981', secondaryColor: '#059669', backgroundColor: '#f9fafb' },
  { name: 'Bold Orange', primaryColor: '#f59e0b', secondaryColor: '#d97706', backgroundColor: '#fffbeb' },
];

const PortfolioBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const portfolio = usePortfolio();
  const repositories = useRepositories();
  const { setPortfolio, updatePortfolioSection, addPortfolioSection, removePortfolioSection, reorderPortfolioSections } = useAppActions();
  
  const [sections, setSections] = useState<PortfolioSectionType[]>([]);
  const [selectedSection, setSelectedSection] = useState<PortfolioSectionType | null>(null);
  const [showSectionEditor, setShowSectionEditor] = useState(false);
  const [showAddSectionDialog, setShowAddSectionDialog] = useState(false);
  const [showThemeEditor, setShowThemeEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [currentTheme, setCurrentTheme] = useState<PortfolioTheme>({
    name: 'Modern Tech',
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    backgroundColor: '#f8f9fa',
    textColor: '#333333',
    fontFamily: 'Inter',
    layout: 'modern',
    darkMode: false,
  });
  const [saveMessage, setSaveMessage] = useState('');
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const { fetchRepositories } = useGitHub();
  const { fetchProfile } = useLinkedIn();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize portfolio data
  useEffect(() => {
    if (portfolio?.sections) {
      setSections(portfolio.sections);
    } else {
      // Create default sections if none exist
      const defaultSections: PortfolioSectionType[] = [
        {
          id: 'hero-1',
          type: 'hero',
          title: 'Hero Section',
          order: 1,
          visible: true,
          data: {
            name: user?.name || 'Your Name',
            title: 'Software Developer',
            description: 'Passionate about creating innovative solutions and building amazing user experiences.',
          },
        },
        {
          id: 'about-1',
          type: 'about',
          title: 'About Me',
          order: 2,
          visible: true,
          data: {
            bio: user?.bio || 'Tell your story and what makes you unique as a professional.',
          },
        },
      ];
      setSections(defaultSections);
    }

    if (portfolio?.theme) {
      setCurrentTheme(portfolio.theme);
    }
  }, [portfolio, user]);

  // Auto-save functionality
  useEffect(() => {
    if (sections.length > 0) {
      setIsAutoSaving(true);
      const timer = setTimeout(() => {
        handleSave(false);
        setIsAutoSaving(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [sections, currentTheme]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex(section => section.id === active.id);
      const newIndex = sections.findIndex(section => section.id === over.id);
      
      const reorderedSections = arrayMove(sections, oldIndex, newIndex).map((section, index) => ({
        ...section,
        order: index + 1,
      }));
      
      setSections(reorderedSections);
      reorderPortfolioSections(reorderedSections);
    }
  };

  const handleAddSection = (sectionType: SectionType) => {
    const newSection: PortfolioSectionType = {
      id: `${sectionType}-${Date.now()}`,
      type: sectionType,
      title: sectionTemplates.find(t => t.type === sectionType)?.title || 'New Section',
      order: sections.length + 1,
      visible: true,
      data: getDefaultSectionData(sectionType),
    };
    
    setSections([...sections, newSection]);
    addPortfolioSection(newSection);
    setShowAddSectionDialog(false);
  };

  const getDefaultSectionData = (type: SectionType) => {
    switch (type) {
      case 'hero':
        return {
          name: user?.name || 'Your Name',
          title: 'Your Professional Title',
          description: 'Brief description of who you are and what you do.',
        };
      case 'about':
        return { bio: 'Tell your professional story...' };
      case 'experience':
        return { experiences: [] };
      case 'projects':
        return { projects: repositories.slice(0, 6).map(repo => ({
          title: repo.name,
          description: repo.description || 'Project description',
          technologies: repo.language ? [repo.language] : [],
          github_url: repo.html_url,
          live_url: repo.homepage,
        })) };
      case 'skills':
        return { skills: [] };
      case 'education':
        return { education: [] };
      case 'certificates':
        return { certificates: [] };
      case 'contact':
        return {
          message: "Let's connect and discuss opportunities!",
          email: user?.email || '',
          phone: user?.whatsapp || '',
        };
      default:
        return {};
    }
  };

  const handleEditSection = (section: PortfolioSectionType) => {
    setSelectedSection(section);
    setShowSectionEditor(true);
  };

  const handleSaveSection = (updatedSection: PortfolioSectionType) => {
    const updatedSections = sections.map(section => 
      section.id === updatedSection.id ? updatedSection : section
    );
    setSections(updatedSections);
    updatePortfolioSection(updatedSection.id, updatedSection.data);
    setShowSectionEditor(false);
  };

  const handleDeleteSection = (sectionId: string) => {
    const updatedSections = sections.filter(section => section.id !== sectionId);
    setSections(updatedSections);
    removePortfolioSection(sectionId);
  };

  const handleToggleVisibility = (sectionId: string) => {
    const updatedSections = sections.map(section => 
      section.id === sectionId ? { ...section, visible: !section.visible } : section
    );
    setSections(updatedSections);
  };

  const handleSave = (showNotification = true) => {
    const portfolioData = {
      id: portfolio?.id || 'portfolio-1',
      user: user!,
      theme: currentTheme,
      sections,
      seo: {
        title: `${user?.name} - Portfolio`,
        description: `Professional portfolio of ${user?.name}`,
        keywords: ['portfolio', 'developer', user?.name || ''].filter(Boolean),
      },
      contact: {
        email: user?.email || '',
        phone: user?.whatsapp || '',
        showForm: true,
      },
      social: {
        github: user?.username ? `https://github.com/${user.username}` : '',
        linkedin: user?.linkedin || '',
      },
      createdAt: portfolio?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: false,
    };

    setPortfolio(portfolioData);
    
    if (showNotification) {
      setSaveMessage('Portfolio saved successfully!');
    }
  };

  const handlePublish = () => {
    handleSave();
    setSaveMessage('Portfolio published! 🎉');
    // Here you would typically deploy to GitHub Pages or another hosting service
  };

  const handleImportGitHubData = async () => {
    if (user?.username) {
      try {
        await fetchRepositories(user.username);
        
        // Update projects section with GitHub data
        const projectsSection = sections.find(s => s.type === 'projects');
        if (projectsSection) {
          const updatedData = {
            ...projectsSection.data,
            projects: repositories.slice(0, 6).map(repo => ({
              title: repo.name,
              description: repo.description || 'GitHub repository',
              technologies: repo.language ? [repo.language] : [],
              github_url: repo.html_url,
              live_url: repo.homepage,
              featured: repo.stargazers_count > 0,
            })),
          };
          handleSaveSection({ ...projectsSection, data: updatedData });
        }
        
        setSaveMessage('GitHub data imported successfully!');
      } catch (error) {
        setSaveMessage('Failed to import GitHub data');
      }
    }
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Welcome to Portfolio Builder
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Please connect your GitHub account to start building your portfolio.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/dashboard')}
          >
            Connect GitHub
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 3, position: 'sticky', top: 0, zIndex: 100 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/dashboard')}
                variant="outlined"
              >
                Dashboard
              </Button>
              <Typography variant="h5" fontWeight="bold">
                Portfolio Builder
              </Typography>
              {isAutoSaving && (
                <Typography variant="caption" color="text.secondary">
                  Auto-saving...
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Import GitHub projects">
                <IconButton onClick={handleImportGitHubData} color="primary">
                  <GitHub />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Theme settings">
                <IconButton onClick={() => setShowThemeEditor(true)} color="primary">
                  <Palette />
                </IconButton>
              </Tooltip>
              
              <Button
                variant="outlined"
                startIcon={<Visibility />}
                onClick={() => setShowPreview(true)}
              >
                Preview
              </Button>
              
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => handleSave()}
              >
                Save
              </Button>
              
              <Button
                variant="contained"
                startIcon={<Publish />}
                onClick={handlePublish}
                color="success"
              >
                Publish
              </Button>
            </Box>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* Sections Panel */}
          <Grid item xs={12} md={4}>
            <MotionPaper
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              sx={{ p: 3, height: 'fit-content' }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Portfolio Sections
                </Typography>
                <Button
                  startIcon={<Add />}
                  onClick={() => setShowAddSectionDialog(true)}
                  variant="outlined"
                  size="small"
                >
                  Add Section
                </Button>
              </Box>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                  {sections.map((section) => (
                    <PortfolioSection
                      key={section.id}
                      section={section}
                      onEdit={handleEditSection}
                      onDelete={handleDeleteSection}
                      onToggleVisibility={handleToggleVisibility}
                    />
                  ))}
                </SortableContext>
              </DndContext>

              {sections.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    No sections yet
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setShowAddSectionDialog(true)}
                  >
                    Add Your First Section
                  </Button>
                </Box>
              )}
            </MotionPaper>
          </Grid>

          {/* Live Preview */}
          <Grid item xs={12} md={8}>
            <MotionPaper
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              sx={{ p: 3, minHeight: '80vh' }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Live Preview
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {['desktop', 'tablet', 'mobile'].map((mode) => (
                    <Button
                      key={mode}
                      size="small"
                      variant={previewMode === mode ? 'contained' : 'outlined'}
                      onClick={() => setPreviewMode(mode as any)}
                    >
                      {mode}
                    </Button>
                  ))}
                </Box>
              </Box>

              <Box
                sx={{
                  width: getPreviewWidth(),
                  mx: 'auto',
                  border: '1px solid',
                  borderColor: 'grey.300',
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: currentTheme.backgroundColor,
                  color: currentTheme.textColor,
                  fontFamily: currentTheme.fontFamily,
                }}
              >
                {sections.filter(s => s.visible).map((section) => (
                  <PortfolioSection
                    key={section.id}
                    section={section}
                    onEdit={handleEditSection}
                    onDelete={handleDeleteSection}
                    onToggleVisibility={handleToggleVisibility}
                    preview={true}
                  />
                ))}

                {sections.filter(s => s.visible).length === 0 && (
                  <Box sx={{ p: 8, textAlign: 'center' }}>
                    <Typography variant="h5" color="text.secondary">
                      Your portfolio preview will appear here
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Add sections to see your portfolio come to life!
                    </Typography>
                  </Box>
                )}

                {/* WhatsApp button for contact section */}
                {user?.whatsapp && (
                  <WhatsAppButton
                    phoneNumber={user.whatsapp}
                    message="Hi! I saw your portfolio and would like to connect."
                    position="fixed"
                  />
                )}
              </Box>
            </MotionPaper>
          </Grid>
        </Grid>
      </Container>

      {/* Add Section Dialog */}
      <Dialog open={showAddSectionDialog} onClose={() => setShowAddSectionDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Section</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {sectionTemplates.map((template) => (
              <Grid item xs={12} sm={6} md={4} key={template.type}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 4 },
                    transition: 'box-shadow 0.2s',
                  }}
                  onClick={() => handleAddSection(template.type)}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {template.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {template.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddSectionDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Section Editor */}
      <SectionEditor
        open={showSectionEditor}
        section={selectedSection}
        onClose={() => setShowSectionEditor(false)}
        onSave={handleSaveSection}
      />

      {/* Theme Editor Dialog */}
      <Dialog open={showThemeEditor} onClose={() => setShowThemeEditor(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Theme Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">Theme Presets</Typography>
            {themePresets.map((preset) => (
              <Button
                key={preset.name}
                variant={currentTheme.name === preset.name ? 'contained' : 'outlined'}
                onClick={() => setCurrentTheme({ ...currentTheme, ...preset })}
                sx={{
                  justifyContent: 'flex-start',
                  background: `linear-gradient(90deg, ${preset.primaryColor}, ${preset.secondaryColor})`,
                  color: 'white',
                  '&:hover': {
                    background: `linear-gradient(90deg, ${preset.primaryColor}, ${preset.secondaryColor})`,
                    opacity: 0.8,
                  },
                }}
              >
                {preset.name}
              </Button>
            ))}

            <Divider sx={{ my: 2 }} />

            <FormControlLabel
              control={
                <Switch
                  checked={currentTheme.darkMode}
                  onChange={(e) => setCurrentTheme({ ...currentTheme, darkMode: e.target.checked })}
                />
              }
              label="Dark Mode"
            />

            <FormControl>
              <InputLabel>Layout Style</InputLabel>
              <Select
                value={currentTheme.layout}
                onChange={(e) => setCurrentTheme({ ...currentTheme, layout: e.target.value as any })}
              >
                <MenuItem value="modern">Modern</MenuItem>
                <MenuItem value="classic">Classic</MenuItem>
                <MenuItem value="minimal">Minimal</MenuItem>
                <MenuItem value="creative">Creative</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowThemeEditor(false)}>Cancel</Button>
          <Button onClick={() => setShowThemeEditor(false)} variant="contained">
            Apply Theme
          </Button>
        </DialogActions>
      </Dialog>

      {/* Full Preview Dialog */}
      <Dialog open={showPreview} onClose={() => setShowPreview(false)} maxWidth="xl" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Portfolio Preview</Typography>
          <Box>
            {['desktop', 'tablet', 'mobile'].map((mode) => (
              <Button
                key={mode}
                size="small"
                variant={previewMode === mode ? 'contained' : 'outlined'}
                onClick={() => setPreviewMode(mode as any)}
                sx={{ mr: 1 }}
              >
                {mode}
              </Button>
            ))}
            <IconButton onClick={() => setShowPreview(false)}>
              <ArrowBack />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box
            sx={{
              width: getPreviewWidth(),
              mx: 'auto',
              minHeight: '80vh',
              bgcolor: currentTheme.backgroundColor,
              color: currentTheme.textColor,
              fontFamily: currentTheme.fontFamily,
            }}
          >
            {sections.filter(s => s.visible).map((section) => (
              <PortfolioSection
                key={section.id}
                section={section}
                onEdit={() => {}}
                onDelete={() => {}}
                onToggleVisibility={() => {}}
                preview={true}
              />
            ))}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Save Message Snackbar */}
      <Snackbar
        open={!!saveMessage}
        autoHideDuration={3000}
        onClose={() => setSaveMessage('')}
        message={saveMessage}
      />
    </Box>
  );
};

export default PortfolioBuilderPage;