import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Chip,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import {
  Close,
  Add,
  Delete,
  SmartToy,
  Palette,
} from '@mui/icons-material';
import { SketchPicker } from 'react-color';
import { PortfolioSection as PortfolioSectionType, SectionType } from '../../types';
import { useAI } from '../../hooks/useAI';

interface SectionEditorProps {
  open: boolean;
  section: PortfolioSectionType | null;
  onClose: () => void;
  onSave: (section: PortfolioSectionType) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`section-tabpanel-${index}`}
    aria-labelledby={`section-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const SectionEditor: React.FC<SectionEditorProps> = ({
  open,
  section,
  onClose,
  onSave,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [editedSection, setEditedSection] = useState<PortfolioSectionType | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const { improveProjectDescription, generateProfessionalBio } = useAI();

  useEffect(() => {
    if (section) {
      setEditedSection({ ...section });
    }
  }, [section]);

  const handleSave = () => {
    if (editedSection) {
      onSave(editedSection);
      onClose();
    }
  };

  const updateSectionData = (key: string, value: any) => {
    if (!editedSection) return;
    setEditedSection({
      ...editedSection,
      data: {
        ...editedSection.data,
        [key]: value,
      },
    });
  };

  const addArrayItem = (arrayKey: string, newItem: any) => {
    if (!editedSection) return;
    const currentArray = editedSection.data[arrayKey] || [];
    updateSectionData(arrayKey, [...currentArray, newItem]);
  };

  const removeArrayItem = (arrayKey: string, index: number) => {
    if (!editedSection) return;
    const currentArray = editedSection.data[arrayKey] || [];
    updateSectionData(arrayKey, currentArray.filter((_: any, i: number) => i !== index));
  };

  const updateArrayItem = (arrayKey: string, index: number, updatedItem: any) => {
    if (!editedSection) return;
    const currentArray = editedSection.data[arrayKey] || [];
    const newArray = [...currentArray];
    newArray[index] = updatedItem;
    updateSectionData(arrayKey, newArray);
  };

  const handleAIImprovement = async (field: string, content: string) => {
    try {
      if (field === 'bio' || field === 'description') {
        const result = await generateProfessionalBio({ bio: content });
        updateSectionData(field, result.improved);
      } else if (field.includes('project')) {
        const result = await improveProjectDescription(content, 'Project', []);
        updateSectionData(field, result.improved);
      }
    } catch (error) {
      console.error('AI improvement failed:', error);
    }
  };

  if (!editedSection) return null;

  const renderContentEditor = () => {
    switch (editedSection.type) {
      case 'hero':
        return <HeroEditor section={editedSection} updateData={updateSectionData} onAIImprove={handleAIImprovement} />;
      case 'about':
        return <AboutEditor section={editedSection} updateData={updateSectionData} onAIImprove={handleAIImprovement} />;
      case 'experience':
        return <ExperienceEditor 
          section={editedSection} 
          updateData={updateSectionData}
          addItem={addArrayItem}
          removeItem={removeArrayItem}
          updateItem={updateArrayItem}
        />;
      case 'projects':
        return <ProjectsEditor 
          section={editedSection} 
          updateData={updateSectionData}
          addItem={addArrayItem}
          removeItem={removeArrayItem}
          updateItem={updateArrayItem}
        />;
      case 'skills':
        return <SkillsEditor 
          section={editedSection} 
          updateData={updateSectionData}
          addItem={addArrayItem}
          removeItem={removeArrayItem}
        />;
      case 'contact':
        return <ContactEditor section={editedSection} updateData={updateSectionData} />;
      case 'education':
        return <EducationEditor 
          section={editedSection} 
          updateData={updateSectionData}
          addItem={addArrayItem}
          removeItem={removeArrayItem}
          updateItem={updateArrayItem}
        />;
      default:
        return <DefaultEditor section={editedSection} updateData={updateSectionData} />;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Edit {editedSection.title} Section
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Content" />
          <Tab label="Style" />
          <Tab label="Settings" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {renderContentEditor()}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <StyleEditor section={editedSection} updateData={updateSectionData} />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <SettingsEditor 
            section={editedSection} 
            onUpdate={(updates) => setEditedSection({ ...editedSection, ...updates })} 
          />
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Individual Section Editors
const HeroEditor: React.FC<{
  section: PortfolioSectionType;
  updateData: (key: string, value: any) => void;
  onAIImprove: (field: string, content: string) => void;
}> = ({ section, updateData, onAIImprove }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    <TextField
      label="Name"
      value={section.data.name || ''}
      onChange={(e) => updateData('name', e.target.value)}
      fullWidth
    />
    <TextField
      label="Professional Title"
      value={section.data.title || ''}
      onChange={(e) => updateData('title', e.target.value)}
      fullWidth
    />
    <Box sx={{ position: 'relative' }}>
      <TextField
        label="Description"
        value={section.data.description || ''}
        onChange={(e) => updateData('description', e.target.value)}
        multiline
        rows={4}
        fullWidth
      />
      <IconButton
        sx={{ position: 'absolute', top: 8, right: 8 }}
        onClick={() => onAIImprove('description', section.data.description || '')}
        color="primary"
        title="Improve with AI"
      >
        <SmartToy />
      </IconButton>
    </Box>
  </Box>
);

const AboutEditor: React.FC<{
  section: PortfolioSectionType;
  updateData: (key: string, value: any) => void;
  onAIImprove: (field: string, content: string) => void;
}> = ({ section, updateData, onAIImprove }) => (
  <Box sx={{ position: 'relative' }}>
    <TextField
      label="About Me"
      value={section.data.bio || ''}
      onChange={(e) => updateData('bio', e.target.value)}
      multiline
      rows={6}
      fullWidth
      placeholder="Tell your story, share your background, and what makes you unique..."
    />
    <IconButton
      sx={{ position: 'absolute', top: 8, right: 8 }}
      onClick={() => onAIImprove('bio', section.data.bio || '')}
      color="primary"
      title="Improve with AI"
    >
      <SmartToy />
    </IconButton>
  </Box>
);

const ExperienceEditor: React.FC<{
  section: PortfolioSectionType;
  updateData: (key: string, value: any) => void;
  addItem: (arrayKey: string, newItem: any) => void;
  removeItem: (arrayKey: string, index: number) => void;
  updateItem: (arrayKey: string, index: number, updatedItem: any) => void;
}> = ({ section, addItem, removeItem, updateItem }) => {
  const experiences = section.data.experiences || [];

  const addExperience = () => {
    addItem('experiences', {
      position: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      location: '',
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Work Experience</Typography>
        <Button onClick={addExperience} startIcon={<Add />} variant="outlined">
          Add Experience
        </Button>
      </Box>

      {experiences.map((exp: any, index: number) => (
        <Paper key={index} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">Experience {index + 1}</Typography>
            <IconButton onClick={() => removeItem('experiences', index)} color="error">
              <Delete />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}>
            <TextField
              label="Position"
              value={exp.position}
              onChange={(e) => updateItem('experiences', index, { ...exp, position: e.target.value })}
            />
            <TextField
              label="Company"
              value={exp.company}
              onChange={(e) => updateItem('experiences', index, { ...exp, company: e.target.value })}
            />
            <TextField
              label="Start Date"
              value={exp.startDate}
              onChange={(e) => updateItem('experiences', index, { ...exp, startDate: e.target.value })}
              placeholder="YYYY-MM"
            />
            <TextField
              label="End Date"
              value={exp.endDate}
              onChange={(e) => updateItem('experiences', index, { ...exp, endDate: e.target.value })}
              placeholder="YYYY-MM"
              disabled={exp.current}
            />
          </Box>
          
          <FormControlLabel
            control={
              <Switch
                checked={exp.current}
                onChange={(e) => updateItem('experiences', index, { ...exp, current: e.target.checked })}
              />
            }
            label="Currently working here"
            sx={{ mb: 2 }}
          />
          
          <TextField
            label="Description"
            value={exp.description}
            onChange={(e) => updateItem('experiences', index, { ...exp, description: e.target.value })}
            multiline
            rows={3}
            fullWidth
          />
        </Paper>
      ))}
    </Box>
  );
};

const ProjectsEditor: React.FC<{
  section: PortfolioSectionType;
  updateData: (key: string, value: any) => void;
  addItem: (arrayKey: string, newItem: any) => void;
  removeItem: (arrayKey: string, index: number) => void;
  updateItem: (arrayKey: string, index: number, updatedItem: any) => void;
}> = ({ section, addItem, removeItem, updateItem }) => {
  const projects = section.data.projects || [];

  const addProject = () => {
    addItem('projects', {
      title: '',
      description: '',
      technologies: [],
      github_url: '',
      live_url: '',
      featured: false,
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Projects</Typography>
        <Button onClick={addProject} startIcon={<Add />} variant="outlined">
          Add Project
        </Button>
      </Box>

      {projects.map((project: any, index: number) => (
        <Paper key={index} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">Project {index + 1}</Typography>
            <IconButton onClick={() => removeItem('projects', index)} color="error">
              <Delete />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Project Title"
              value={project.title}
              onChange={(e) => updateItem('projects', index, { ...project, title: e.target.value })}
              fullWidth
            />
            
            <TextField
              label="Description"
              value={project.description}
              onChange={(e) => updateItem('projects', index, { ...project, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
            
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <TextField
                label="GitHub URL"
                value={project.github_url}
                onChange={(e) => updateItem('projects', index, { ...project, github_url: e.target.value })}
              />
              <TextField
                label="Live Demo URL"
                value={project.live_url}
                onChange={(e) => updateItem('projects', index, { ...project, live_url: e.target.value })}
              />
            </Box>
            
            <TechnologiesEditor
              technologies={project.technologies || []}
              onChange={(technologies) => updateItem('projects', index, { ...project, technologies })}
            />
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

const SkillsEditor: React.FC<{
  section: PortfolioSectionType;
  updateData: (key: string, value: any) => void;
  addItem: (arrayKey: string, newItem: any) => void;
  removeItem: (arrayKey: string, index: number) => void;
}> = ({ section, addItem, removeItem }) => {
  const skills = section.data.skills || [];
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim()) {
      addItem('skills', {
        name: newSkill.trim(),
        level: 'intermediate',
        category: 'programming',
      });
      setNewSkill('');
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Skills</Typography>
      
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          label="Add new skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          size="small"
        />
        <Button onClick={addSkill} variant="outlined">
          Add
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {skills.map((skill: any, index: number) => (
          <Chip
            key={index}
            label={skill.name || skill}
            onDelete={() => removeItem('skills', index)}
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>
    </Box>
  );
};

const ContactEditor: React.FC<{
  section: PortfolioSectionType;
  updateData: (key: string, value: any) => void;
}> = ({ section, updateData }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    <TextField
      label="Contact Message"
      value={section.data.message || ''}
      onChange={(e) => updateData('message', e.target.value)}
      multiline
      rows={3}
      fullWidth
    />
    <TextField
      label="Email"
      value={section.data.email || ''}
      onChange={(e) => updateData('email', e.target.value)}
      fullWidth
    />
    <TextField
      label="Phone"
      value={section.data.phone || ''}
      onChange={(e) => updateData('phone', e.target.value)}
      fullWidth
    />
  </Box>
);

const EducationEditor: React.FC<{
  section: PortfolioSectionType;
  updateData: (key: string, value: any) => void;
  addItem: (arrayKey: string, newItem: any) => void;
  removeItem: (arrayKey: string, index: number) => void;
  updateItem: (arrayKey: string, index: number, updatedItem: any) => void;
}> = ({ section, addItem, removeItem, updateItem }) => {
  const education = section.data.education || [];

  const addEducation = () => {
    addItem('education', {
      degree: '',
      field: '',
      institution: '',
      startDate: '',
      endDate: '',
      gpa: '',
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Education</Typography>
        <Button onClick={addEducation} startIcon={<Add />} variant="outlined">
          Add Education
        </Button>
      </Box>

      {education.map((edu: any, index: number) => (
        <Paper key={index} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">Education {index + 1}</Typography>
            <IconButton onClick={() => removeItem('education', index)} color="error">
              <Delete />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            <TextField
              label="Degree"
              value={edu.degree}
              onChange={(e) => updateItem('education', index, { ...edu, degree: e.target.value })}
            />
            <TextField
              label="Field of Study"
              value={edu.field}
              onChange={(e) => updateItem('education', index, { ...edu, field: e.target.value })}
            />
            <TextField
              label="Institution"
              value={edu.institution}
              onChange={(e) => updateItem('education', index, { ...edu, institution: e.target.value })}
            />
            <TextField
              label="GPA (optional)"
              value={edu.gpa}
              onChange={(e) => updateItem('education', index, { ...edu, gpa: e.target.value })}
            />
            <TextField
              label="Start Date"
              value={edu.startDate}
              onChange={(e) => updateItem('education', index, { ...edu, startDate: e.target.value })}
              placeholder="YYYY-MM"
            />
            <TextField
              label="End Date"
              value={edu.endDate}
              onChange={(e) => updateItem('education', index, { ...edu, endDate: e.target.value })}
              placeholder="YYYY-MM"
            />
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

const DefaultEditor: React.FC<{
  section: PortfolioSectionType;
  updateData: (key: string, value: any) => void;
}> = ({ section, updateData }) => (
  <TextField
    label="Content"
    value={section.data.content || ''}
    onChange={(e) => updateData('content', e.target.value)}
    multiline
    rows={6}
    fullWidth
  />
);

const StyleEditor: React.FC<{
  section: PortfolioSectionType;
  updateData: (key: string, value: any) => void;
}> = ({ section, updateData }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Section Styling</Typography>
      
      <Box sx={{ position: 'relative' }}>
        <Button
          variant="outlined"
          onClick={() => setShowColorPicker(!showColorPicker)}
          sx={{ bgcolor: section.data.backgroundColor || '#ffffff' }}
        >
          Background Color
        </Button>
        {showColorPicker && (
          <Box sx={{ position: 'absolute', zIndex: 2, top: 40 }}>
            <SketchPicker
              color={section.data.backgroundColor || '#ffffff'}
              onChangeComplete={(color) => updateData('backgroundColor', color.hex)}
            />
          </Box>
        )}
      </Box>

      <FormControl>
        <InputLabel>Text Alignment</InputLabel>
        <Select
          value={section.data.textAlign || 'left'}
          onChange={(e) => updateData('textAlign', e.target.value)}
        >
          <MenuItem value="left">Left</MenuItem>
          <MenuItem value="center">Center</MenuItem>
          <MenuItem value="right">Right</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

const SettingsEditor: React.FC<{
  section: PortfolioSectionType;
  onUpdate: (updates: Partial<PortfolioSectionType>) => void;
}> = ({ section, onUpdate }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    <TextField
      label="Section Title"
      value={section.title}
      onChange={(e) => onUpdate({ title: e.target.value })}
      fullWidth
    />
    
    <FormControlLabel
      control={
        <Switch
          checked={section.visible}
          onChange={(e) => onUpdate({ visible: e.target.checked })}
        />
      }
      label="Visible on portfolio"
    />
    
    <TextField
      label="Display Order"
      type="number"
      value={section.order}
      onChange={(e) => onUpdate({ order: parseInt(e.target.value) })}
      fullWidth
    />
  </Box>
);

const TechnologiesEditor: React.FC<{
  technologies: string[];
  onChange: (technologies: string[]) => void;
}> = ({ technologies, onChange }) => {
  const [newTech, setNewTech] = useState('');

  const addTechnology = () => {
    if (newTech.trim() && !technologies.includes(newTech.trim())) {
      onChange([...technologies, newTech.trim()]);
      setNewTech('');
    }
  };

  const removeTechnology = (index: number) => {
    onChange(technologies.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>Technologies</Typography>
      
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <TextField
          label="Add technology"
          value={newTech}
          onChange={(e) => setNewTech(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
          size="small"
        />
        <Button onClick={addTechnology} variant="outlined" size="small">
          Add
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {technologies.map((tech, index) => (
          <Chip
            key={index}
            label={tech}
            onDelete={() => removeTechnology(index)}
            size="small"
            variant="outlined"
          />
        ))}
      </Box>
    </Box>
  );
};

export default SectionEditor;