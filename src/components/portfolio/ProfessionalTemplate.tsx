import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Chip, Avatar, Divider, IconButton } from '@mui/material';
import { Email, Phone, LinkedIn, GitHub, WhatsApp, Download, Share, Launch } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface ProfessionalPortfolioProps {
  data: {
    personalInfo: {
      fullName: string;
      title: string;
      location: string;
      email: string;
      phone?: string;
      linkedin?: string;
      github?: string;
      whatsapp?: string;
      avatar?: string;
      website?: string;
    };
    summary: string;
    experience: Array<{
      id: string;
      title: string;
      company: string;
      location?: string;
      startDate: string;
      endDate?: string;
      current: boolean;
      description: string;
      achievements: string[];
    }>;
    education: Array<{
      id: string;
      degree: string;
      institution: string;
      startDate: string;
      endDate?: string;
      description?: string;
    }>;
    skills: Array<{
      id: string;
      name: string;
      category: string;
      level: number;
    }>;
    projects: Array<{
      id: string;
      title: string;
      description: string;
      technologies: string[];
      demoUrl?: string;
      githubUrl?: string;
      imageUrl?: string;
    }>;
    certifications: Array<{
      id: string;
      name: string;
      issuer: string;
      issueDate: string;
      credentialUrl?: string;
    }>;
    languages: Array<{
      id: string;
      name: string;
      proficiency: string;
    }>;
    theme: {
      primaryColor: string;
      secondaryColor: string;
      backgroundColor: string;
      textColor: string;
      accentColor: string;
    };
  };
  preview?: boolean;
}

const ProfessionalTemplate: React.FC<ProfessionalPortfolioProps> = ({ data, preview = false }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, theme } = data;

  const containerStyle = {
    backgroundColor: theme.backgroundColor,
    color: theme.textColor,
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const headerStyle = {
    background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
    color: 'white',
    py: 6,
    position: 'relative',
    overflow: 'hidden',
  };

  const sectionStyle = {
    py: 6,
    borderBottom: `1px solid ${theme.primaryColor}20`,
  };

  return (
    <Box sx={containerStyle}>
      {/* Header Section */}
      <Box sx={headerStyle}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography 
                  variant="h2" 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}
                >
                  {personalInfo.fullName}
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ opacity: 0.9, mb: 2, fontWeight: 300 }}
                >
                  {personalInfo.title}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  📍 {personalInfo.location}
                </Typography>
              </Grid>
              
              {personalInfo.avatar && (
                <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                  <Avatar
                    src={personalInfo.avatar}
                    alt={personalInfo.fullName}
                    sx={{ 
                      width: 200, 
                      height: 200, 
                      mx: 'auto',
                      border: '4px solid white',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Summary Section */}
      <Box sx={sectionStyle}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: theme.primaryColor }}>
              Summary
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: '1.1rem', 
                lineHeight: 1.7,
                maxWidth: '800px',
                textAlign: 'justify'
              }}
            >
              {summary}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Experience Timeline */}
      <Box sx={sectionStyle}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: theme.primaryColor }}>
              Career Timeline
            </Typography>
            
            <Box sx={{ position: 'relative', pl: 3 }}>
              {/* Timeline Line */}
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 2,
                  backgroundColor: theme.primaryColor,
                }}
              />
              
              {experience.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Box sx={{ position: 'relative', mb: 4 }}>
                    {/* Timeline Dot */}
                    <Box
                      sx={{
                        position: 'absolute',
                        left: -8,
                        top: 8,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: theme.primaryColor,
                        border: `3px solid ${theme.backgroundColor}`,
                        zIndex: 1,
                      }}
                    />
                    
                    <Card sx={{ ml: 3, boxShadow: 3 }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {exp.title}
                        </Typography>
                        <Typography variant="body1" color="primary" gutterBottom>
                          {exp.company} {exp.location && `• ${exp.location}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {exp.description}
                        </Typography>
                        
                        {exp.achievements.length > 0 && (
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                              Key Achievements:
                            </Typography>
                            <Box component="ul" sx={{ pl: 2, m: 0 }}>
                              {exp.achievements.map((achievement, i) => (
                                <Typography key={i} component="li" variant="body2" sx={{ mb: 0.5 }}>
                                  {achievement}
                                </Typography>
                              ))}
                            </Box>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Skills Section */}
      <Box sx={sectionStyle}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: theme.primaryColor }}>
              Top Skills
            </Typography>
            
            <Grid container spacing={3}>
              {['Technical', 'Leadership', 'Domain'].map((category) => {
                const categorySkills = skills.filter(skill => skill.category === category);
                if (categorySkills.length === 0) return null;
                
                return (
                  <Grid item xs={12} md={4} key={category}>
                    <Card sx={{ height: '100%', boxShadow: 2 }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: theme.primaryColor }}>
                          {category} Skills
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {categorySkills.map((skill) => (
                            <Chip
                              key={skill.id}
                              label={skill.name}
                              size="small"
                              sx={{
                                backgroundColor: `${theme.primaryColor}15`,
                                color: theme.primaryColor,
                                fontWeight: 'medium',
                              }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Education Section */}
      <Box sx={sectionStyle}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: theme.primaryColor }}>
              Education
            </Typography>
            
            <Grid container spacing={3}>
              {education.map((edu) => (
                <Grid item xs={12} md={6} key={edu.id}>
                  <Card sx={{ height: '100%', boxShadow: 2 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {edu.degree}
                      </Typography>
                      <Typography variant="body1" color="primary" gutterBottom>
                        {edu.institution}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {edu.startDate} - {edu.endDate}
                      </Typography>
                      {edu.description && (
                        <Typography variant="body2">
                          {edu.description}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Projects/Demos Section */}
      {projects.length > 0 && (
        <Box sx={sectionStyle}>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: theme.primaryColor }}>
                Featured Projects
              </Typography>
              
              <Grid container spacing={3}>
                {projects.map((project) => (
                  <Grid item xs={12} md={6} lg={4} key={project.id}>
                    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                      <Card sx={{ height: '100%', boxShadow: 3 }}>
                        {project.imageUrl && (
                          <Box
                            component="img"
                            sx={{
                              height: 200,
                              width: '100%',
                              objectFit: 'cover',
                            }}
                            src={project.imageUrl}
                            alt={project.title}
                          />
                        )}
                        <CardContent>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {project.title}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            {project.description}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                            {project.technologies.map((tech) => (
                              <Chip
                                key={tech}
                                label={tech}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            ))}
                          </Box>
                          
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {project.demoUrl && (
                              <IconButton
                                size="small"
                                component="a"
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: theme.primaryColor }}
                              >
                                <Launch />
                              </IconButton>
                            )}
                            {project.githubUrl && (
                              <IconButton
                                size="small"
                                component="a"
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: theme.primaryColor }}
                              >
                                <GitHub />
                              </IconButton>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Container>
        </Box>
      )}

      {/* Contact Section */}
      <Box sx={{ ...sectionStyle, borderBottom: 'none' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: theme.primaryColor }}>
              Get In Touch
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 4, maxWidth: '600px' }}>
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of something exciting. Feel free to reach out.
            </Typography>
            
            <Card sx={{ maxWidth: 600, boxShadow: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  {personalInfo.email && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Email sx={{ color: theme.primaryColor }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Email
                          </Typography>
                          <Typography variant="body2">
                            {personalInfo.email}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                  
                  {personalInfo.phone && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Phone sx={{ color: theme.primaryColor }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Phone
                          </Typography>
                          <Typography variant="body2">
                            {personalInfo.phone}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                  
                  {personalInfo.linkedin && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LinkedIn sx={{ color: theme.primaryColor }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            LinkedIn
                          </Typography>
                          <Typography variant="body2">
                            LinkedIn Profile
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                  
                  {personalInfo.github && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <GitHub sx={{ color: theme.primaryColor }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            GitHub
                          </Typography>
                          <Typography variant="body2">
                            GitHub Profile
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: theme.primaryColor,
          color: 'white',
          py: 3,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2">
            © 2025 {personalInfo.fullName}. All Rights Reserved.
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Portfolio built with Professional Portfolio Generator
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default ProfessionalTemplate;