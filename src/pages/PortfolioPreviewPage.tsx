import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  Skeleton,
  Chip,
} from '@mui/material';
import {
  ArrowBack,
  Share,
  Download,
  QrCode,
  Link as LinkIcon,
  Edit,
  Visibility,
  VisibilityOff,
  Fullscreen,
  FullscreenExit,
  Smartphone,
  Tablet,
  Computer,
  Print,
  GetApp,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as htmlToImage from 'html-to-image';

// Components
import PortfolioSection from '../components/portfolio/PortfolioSection';
import WhatsAppButton from '../components/common/WhatsAppButton';

// Hooks & Store
import { useUser, usePortfolio } from '../store';

// Types
import { PortfolioSection as PortfolioSectionType } from '../types';

const MotionBox = motion(Box);

interface ViewMode {
  name: string;
  width: string;
  height: string;
  icon: React.ReactNode;
}

const viewModes: ViewMode[] = [
  { name: 'Desktop', width: '100%', height: 'auto', icon: <Computer /> },
  { name: 'Tablet', width: '768px', height: '1024px', icon: <Tablet /> },
  { name: 'Mobile', width: '375px', height: '667px', icon: <Smartphone /> },
];

const PortfolioPreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const user = useUser();
  const portfolio = usePortfolio();
  
  const [currentViewMode, setCurrentViewMode] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState(portfolio);

  const isOwner = !username || username === user?.username;
  const portfolioUrl = username 
    ? `https://${username}.github.io/portfolio`
    : `${window.location.origin}/portfolio/${user?.username}`;

  useEffect(() => {
    if (username && username !== user?.username) {
      // Load public portfolio data for the specified username
      // This would typically fetch from an API or GitHub Pages
      setLoading(true);
      // Simulate loading public portfolio
      setTimeout(() => {
        setPortfolioData(portfolio); // For now, use current portfolio
        setLoading(false);
      }, 1000);
    } else {
      setPortfolioData(portfolio);
    }
  }, [username, user, portfolio]);

  const visibleSections = portfolioData?.sections?.filter(section => section.visible) || [];
  const theme = portfolioData?.theme || {
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    backgroundColor: '#f8f9fa',
    textColor: '#333333',
    fontFamily: 'Inter',
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleDownloadImage = async () => {
    const element = document.getElementById('portfolio-preview');
    if (element) {
      try {
        const dataUrl = await htmlToImage.toPng(element, {
          quality: 0.95,
          backgroundColor: theme.backgroundColor,
        });
        
        const link = document.createElement('a');
        link.download = `${user?.name || 'portfolio'}-preview.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Failed to download image:', error);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const currentMode = viewModes[currentViewMode];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="rectangular" width={200} height={40} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={200} />
          ))}
        </Box>
      </Container>
    );
  }

  if (!portfolioData || visibleSections.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Portfolio Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {username 
              ? `No portfolio found for ${username}` 
              : 'No portfolio sections to preview. Please build your portfolio first.'
            }
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate(isOwner ? '/builder' : '/dashboard')}
          >
            {isOwner ? 'Build Portfolio' : 'Go to Dashboard'}
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
      {/* Header Controls */}
      {isOwner && (
        <Paper sx={{ p: 2, mb: 2, position: 'sticky', top: 0, zIndex: 100 }}>
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
                <Typography variant="h6" fontWeight="bold">
                  Portfolio Preview
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* View Mode Selector */}
                <Box sx={{ display: 'flex', bgcolor: 'grey.100', borderRadius: 1, p: 0.5 }}>
                  {viewModes.map((mode, index) => (
                    <Tooltip key={mode.name} title={mode.name}>
                      <IconButton
                        size="small"
                        onClick={() => setCurrentViewMode(index)}
                        sx={{
                          bgcolor: currentViewMode === index ? 'white' : 'transparent',
                          '&:hover': { bgcolor: currentViewMode === index ? 'white' : 'grey.200' },
                        }}
                      >
                        {mode.icon}
                      </IconButton>
                    </Tooltip>
                  ))}
                </Box>

                <Tooltip title="Edit Portfolio">
                  <IconButton onClick={() => navigate('/builder')} color="primary">
                    <Edit />
                  </IconButton>
                </Tooltip>

                <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
                  <IconButton onClick={toggleFullscreen}>
                    {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                  </IconButton>
                </Tooltip>

                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  onClick={handleShare}
                >
                  Share
                </Button>

                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <GetApp />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem onClick={handleDownloadImage}>
                    <Download sx={{ mr: 1 }} />
                    Download as Image
                  </MenuItem>
                  <MenuItem onClick={handlePrint}>
                    <Print sx={{ mr: 1 }} />
                    Print Portfolio
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Container>
        </Paper>
      )}

      {/* Portfolio Display */}
      <Container maxWidth="xl" sx={{ py: isOwner ? 2 : 4 }}>
        <Box
          sx={{
            width: currentMode.width,
            maxWidth: '100%',
            mx: 'auto',
            boxShadow: currentViewMode > 0 ? 4 : 0,
            borderRadius: currentViewMode > 0 ? 2 : 0,
            overflow: 'hidden',
            bgcolor: theme.backgroundColor,
            color: theme.textColor,
            fontFamily: theme.fontFamily,
            transition: 'all 0.3s ease',
          }}
          id="portfolio-preview"
        >
          <AnimatePresence mode="wait">
            <MotionBox
              key={currentViewMode}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {visibleSections.map((section, index) => (
                <MotionBox
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <LivePortfolioSection section={section} theme={theme} />
                </MotionBox>
              ))}
            </MotionBox>
          </AnimatePresence>

          {/* Floating WhatsApp Button */}
          {user?.whatsapp && (
            <WhatsAppButton
              phoneNumber={user.whatsapp}
              message={`Hi ${user.name}! I visited your portfolio and would like to connect.`}
              position="fixed"
              showMessageDialog={true}
            />
          )}
        </Box>
      </Container>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onClose={() => setShowShareDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Share Your Portfolio</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Portfolio URL
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Paper sx={{ p: 2, flexGrow: 1, bgcolor: 'grey.50' }}>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                    {portfolioUrl}
                  </Typography>
                </Paper>
                <Button variant="outlined" onClick={handleCopyLink}>
                  <LinkIcon />
                </Button>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Share on Social Media
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    const text = `Check out my professional portfolio: ${portfolioUrl}`;
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
                  }}
                >
                  Twitter
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    const text = `Check out my professional portfolio: ${portfolioUrl}`;
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioUrl)}`);
                  }}
                >
                  LinkedIn
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    const text = `Check out my professional portfolio: ${portfolioUrl}`;
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(portfolioUrl)}`);
                  }}
                >
                  Facebook
                </Button>
              </Box>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                QR Code
              </Typography>
              <Paper sx={{ p: 2, display: 'inline-block' }}>
                <Box
                  sx={{
                    width: 150,
                    height: 150,
                    bgcolor: 'grey.200',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                  }}
                >
                  <QrCode sx={{ fontSize: 100, color: 'grey.400' }} />
                </Box>
              </Paper>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Scan to view portfolio
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowShareDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Copy Success Snackbar */}
      <Snackbar
        open={copied}
        autoHideDuration={3000}
        onClose={() => setCopied(false)}
      >
        <Alert severity="success" onClose={() => setCopied(false)}>
          Portfolio link copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Live Portfolio Section Component (renders the actual portfolio without editing controls)
const LivePortfolioSection: React.FC<{
  section: PortfolioSectionType;
  theme: any;
}> = ({ section, theme }) => {
  const getSectionStyles = () => ({
    py: section.type === 'hero' ? 8 : 4,
    px: 3,
    bgcolor: section.data?.backgroundColor || 'transparent',
    textAlign: section.data?.textAlign || 'left',
    color: theme.textColor,
  });

  const renderSectionContent = () => {
    switch (section.type) {
      case 'hero':
        return (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h2"
                fontWeight="bold"
                gutterBottom
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {section.data?.name || 'Your Name'}
              </Typography>
              
              <Typography
                variant="h4"
                color="text.secondary"
                gutterBottom
                sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
              >
                {section.data?.title || 'Your Professional Title'}
              </Typography>
              
              <Typography
                variant="h6"
                sx={{ maxWidth: 600, mx: 'auto', mt: 3, opacity: 0.8 }}
              >
                {section.data?.description || 'Your professional summary...'}
              </Typography>
              
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: theme.primaryColor,
                    '&:hover': { bgcolor: theme.secondaryColor },
                  }}
                >
                  View My Work
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: theme.primaryColor,
                    color: theme.primaryColor,
                    '&:hover': {
                      borderColor: theme.secondaryColor,
                      color: theme.secondaryColor,
                    },
                  }}
                >
                  Get In Touch
                </Button>
              </Box>
            </MotionBox>
          </Box>
        );

      case 'about':
        return (
          <Container maxWidth="md">
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Typography variant="h3" fontWeight="bold" gutterBottom textAlign="center">
                About Me
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  lineHeight: 1.8,
                  color: 'text.secondary',
                  textAlign: 'center',
                  maxWidth: 800,
                  mx: 'auto',
                }}
              >
                {section.data?.bio || 'Tell your professional story...'}
              </Typography>
            </MotionBox>
          </Container>
        );

      case 'experience':
        return (
          <Container maxWidth="lg">
            <Typography variant="h3" fontWeight="bold" gutterBottom textAlign="center">
              Experience
            </Typography>
            <Box sx={{ mt: 4 }}>
              {section.data?.experiences?.map((exp: any, index: number) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  sx={{ mb: 4 }}
                >
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {exp.position}
                    </Typography>
                    <Typography variant="h6" color="primary" gutterBottom>
                      {exp.company}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      {exp.location && ` • ${exp.location}`}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      {exp.description}
                    </Typography>
                  </Paper>
                </MotionBox>
              ))}
            </Box>
          </Container>
        );

      case 'projects':
        return (
          <Container maxWidth="lg">
            <Typography variant="h3" fontWeight="bold" gutterBottom textAlign="center">
              Featured Projects
            </Typography>
            <Box sx={{ mt: 4, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 3 }}>
              {section.data?.projects?.slice(0, 6).map((project: any, index: number) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {project.title || project.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                      {project.description}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {project.technologies?.map((tech: string, techIndex: number) => (
                        <Chip
                          key={techIndex}
                          label={tech}
                          size="small"
                          sx={{
                            bgcolor: theme.primaryColor,
                            color: 'white',
                            '&:hover': { bgcolor: theme.secondaryColor },
                          }}
                        />
                      ))}
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      {project.github_url && (
                        <Button size="small" href={project.github_url} target="_blank">
                          GitHub
                        </Button>
                      )}
                      {project.live_url && (
                        <Button size="small" href={project.live_url} target="_blank" variant="contained">
                          Live Demo
                        </Button>
                      )}
                    </Box>
                  </Paper>
                </MotionBox>
              ))}
            </Box>
          </Container>
        );

      case 'skills':
        return (
          <Container maxWidth="lg">
            <Typography variant="h3" fontWeight="bold" gutterBottom textAlign="center">
              Skills & Expertise
            </Typography>
            <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
              {section.data?.skills?.map((skill: any, index: number) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Chip
                    label={skill.name || skill}
                    sx={{
                      bgcolor: skill.level === 'expert' ? theme.primaryColor :
                               skill.level === 'advanced' ? theme.secondaryColor :
                               'grey.300',
                      color: skill.level === 'beginner' ? 'text.primary' : 'white',
                      fontWeight: 'bold',
                      px: 2,
                      py: 1,
                      fontSize: '1rem',
                    }}
                  />
                </MotionBox>
              ))}
            </Box>
          </Container>
        );

      case 'contact':
        return (
          <Container maxWidth="md">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Get In Touch
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {section.data?.message || "Let's connect and discuss opportunities!"}
              </Typography>
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
                {section.data?.email && (
                  <Button
                    variant="contained"
                    href={`mailto:${section.data.email}`}
                    sx={{ bgcolor: theme.primaryColor }}
                  >
                    📧 Email Me
                  </Button>
                )}
                {section.data?.phone && (
                  <Button
                    variant="outlined"
                    href={`tel:${section.data.phone}`}
                    sx={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
                  >
                    📱 Call Me
                  </Button>
                )}
              </Box>
            </Box>
          </Container>
        );

      default:
        return (
          <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
              {section.title}
            </Typography>
            <Typography variant="body1">
              {section.data?.content || 'Custom section content...'}
            </Typography>
          </Container>
        );
    }
  };

  return (
    <Box sx={getSectionStyles()}>
      {renderSectionContent()}
    </Box>
  );
};

export default PortfolioPreviewPage;