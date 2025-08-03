import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Box,
  Paper,
  IconButton,
  Typography,
  Switch,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  DragIndicator,
  Visibility,
  VisibilityOff,
  Edit,
  Delete,
  MoreVert,
} from '@mui/icons-material';
import { PortfolioSection as PortfolioSectionType } from '../../types';

interface PortfolioSectionProps {
  section: PortfolioSectionType;
  onEdit: (section: PortfolioSectionType) => void;
  onDelete: (sectionId: string) => void;
  onToggleVisibility: (sectionId: string) => void;
  preview?: boolean;
}

const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  section,
  onEdit,
  onDelete,
  onToggleVisibility,
  preview = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderSectionContent = () => {
    switch (section.type) {
      case 'hero':
        return <HeroSection data={section.data} />;
      case 'about':
        return <AboutSection data={section.data} />;
      case 'experience':
        return <ExperienceSection data={section.data} />;
      case 'projects':
        return <ProjectsSection data={section.data} />;
      case 'skills':
        return <SkillsSection data={section.data} />;
      case 'contact':
        return <ContactSection data={section.data} />;
      case 'education':
        return <EducationSection data={section.data} />;
      case 'certificates':
        return <CertificatesSection data={section.data} />;
      default:
        return <DefaultSection data={section.data} title={section.title} />;
    }
  };

  if (preview) {
    return (
      <Box sx={{ mb: 4, opacity: section.visible ? 1 : 0.3 }}>
        {renderSectionContent()}
      </Box>
    );
  }

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      sx={{
        p: 2,
        mb: 2,
        opacity: section.visible ? 1 : 0.5,
        border: isDragging ? '2px dashed #667eea' : '1px solid #e0e0e0',
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            {...attributes}
            {...listeners}
            size="small"
            sx={{ cursor: 'grab', '&:active': { cursor: 'grabbing' } }}
          >
            <DragIndicator />
          </IconButton>
          
          <Typography variant="h6" fontWeight="bold">
            {section.title}
          </Typography>
          
          <Typography variant="caption" color="text.secondary">
            ({section.type})
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={section.visible ? 'Hide section' : 'Show section'}>
            <IconButton
              size="small"
              onClick={() => onToggleVisibility(section.id)}
              color={section.visible ? 'primary' : 'default'}
            >
              {section.visible ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit section">
            <IconButton size="small" onClick={() => onEdit(section)}>
              <Edit />
            </IconButton>
          </Tooltip>

          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { onEdit(section); handleMenuClose(); }}>
              <Edit sx={{ mr: 1 }} /> Edit
            </MenuItem>
            <MenuItem 
              onClick={() => { onDelete(section.id); handleMenuClose(); }}
              sx={{ color: 'error.main' }}
            >
              <Delete sx={{ mr: 1 }} /> Delete
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <Box sx={{ border: '1px dashed #ccc', p: 2, borderRadius: 1 }}>
        {renderSectionContent()}
      </Box>
    </Paper>
  );
};

// Individual Section Components
const HeroSection: React.FC<{ data: any }> = ({ data }) => (
  <Box sx={{ textAlign: 'center', py: 4 }}>
    <Typography variant="h3" fontWeight="bold" gutterBottom>
      {data?.name || 'Your Name'}
    </Typography>
    <Typography variant="h5" color="text.secondary" gutterBottom>
      {data?.title || 'Your Professional Title'}
    </Typography>
    <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto' }}>
      {data?.description || 'Your professional summary and what makes you unique...'}
    </Typography>
  </Box>
);

const AboutSection: React.FC<{ data: any }> = ({ data }) => (
  <Box>
    <Typography variant="h4" gutterBottom>
      About Me
    </Typography>
    <Typography variant="body1" paragraph>
      {data?.bio || 'Tell your story, share your background, and what drives you...'}
    </Typography>
  </Box>
);

const ExperienceSection: React.FC<{ data: any }> = ({ data }) => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Experience
    </Typography>
    {data?.experiences?.length > 0 ? (
      data.experiences.map((exp: any, index: number) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            {exp.position} at {exp.company}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
          </Typography>
          <Typography variant="body2">
            {exp.description}
          </Typography>
        </Box>
      ))
    ) : (
      <Typography variant="body2" color="text.secondary">
        Add your work experience to showcase your professional journey...
      </Typography>
    )}
  </Box>
);

const ProjectsSection: React.FC<{ data: any }> = ({ data }) => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Projects
    </Typography>
    {data?.projects?.length > 0 ? (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
        {data.projects.slice(0, 6).map((project: any, index: number) => (
          <Paper key={index} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {project.title || project.name}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {project.description}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
              {project.technologies?.map((tech: string, techIndex: number) => (
                <Typography 
                  key={techIndex} 
                  variant="caption" 
                  sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    px: 1, 
                    py: 0.5, 
                    borderRadius: 1 
                  }}
                >
                  {tech}
                </Typography>
              ))}
            </Box>
          </Paper>
        ))}
      </Box>
    ) : (
      <Typography variant="body2" color="text.secondary">
        Your GitHub projects will appear here automatically...
      </Typography>
    )}
  </Box>
);

const SkillsSection: React.FC<{ data: any }> = ({ data }) => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Skills
    </Typography>
    {data?.skills?.length > 0 ? (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {data.skills.map((skill: any, index: number) => (
          <Box
            key={index}
            sx={{
              bgcolor: skill.level === 'expert' ? 'success.main' : 
                      skill.level === 'advanced' ? 'primary.main' : 
                      skill.level === 'intermediate' ? 'info.main' : 'grey.500',
              color: 'white',
              px: 2,
              py: 1,
              borderRadius: 2,
            }}
          >
            <Typography variant="body2">
              {skill.name || skill}
            </Typography>
          </Box>
        ))}
      </Box>
    ) : (
      <Typography variant="body2" color="text.secondary">
        Add your technical skills, tools, and expertise...
      </Typography>
    )}
  </Box>
);

const ContactSection: React.FC<{ data: any }> = ({ data }) => (
  <Box sx={{ textAlign: 'center' }}>
    <Typography variant="h4" gutterBottom>
      Get In Touch
    </Typography>
    <Typography variant="body1" gutterBottom>
      {data?.message || "Let's connect and discuss opportunities!"}
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
      {data?.email && (
        <Typography variant="body2">
          📧 {data.email}
        </Typography>
      )}
      {data?.phone && (
        <Typography variant="body2">
          📱 {data.phone}
        </Typography>
      )}
    </Box>
  </Box>
);

const EducationSection: React.FC<{ data: any }> = ({ data }) => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Education
    </Typography>
    {data?.education?.length > 0 ? (
      data.education.map((edu: any, index: number) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            {edu.degree} in {edu.field}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {edu.institution} • {edu.startDate} - {edu.endDate}
          </Typography>
        </Box>
      ))
    ) : (
      <Typography variant="body2" color="text.secondary">
        Add your educational background...
      </Typography>
    )}
  </Box>
);

const CertificatesSection: React.FC<{ data: any }> = ({ data }) => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Certificates
    </Typography>
    {data?.certificates?.length > 0 ? (
      data.certificates.map((cert: any, index: number) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            {cert.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {cert.issuer} • {cert.issueDate}
          </Typography>
        </Box>
      ))
    ) : (
      <Typography variant="body2" color="text.secondary">
        Add your professional certificates...
      </Typography>
    )}
  </Box>
);

const DefaultSection: React.FC<{ data: any; title: string }> = ({ data, title }) => (
  <Box>
    <Typography variant="h4" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Custom section content will appear here...
    </Typography>
  </Box>
);

export default PortfolioSection;