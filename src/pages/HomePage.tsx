import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Build,
  Description,
  GitHub,
  LinkedIn,
  SmartToy,
  Speed,
  Security,
  Devices,
  Star,
  TrendingUp,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { safeNavigate } from '../utils/navigation';
import { useAuth } from '../contexts/AuthContext';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const HomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/dashboard'); // Dashboard will handle showing auth dialog
    }
  };
  
  const features = [
    {
      icon: <GitHub />,
      title: 'GitHub Integration',
      description: 'Automatically sync your repositories and showcase your best projects with real-time data.',
      color: '#24292e',
    },
    {
      icon: <LinkedIn />,
      title: 'LinkedIn Sync',
      description: 'Import your professional experience and education directly from your LinkedIn profile.',
      color: '#0077b5',
    },
    {
      icon: <SmartToy />,
      title: 'AI-Powered Content',
      description: 'Enhance your descriptions and optimize content with intelligent AI assistance.',
      color: '#667eea',
    },
    {
      icon: <Description />,
      title: 'Resume Generator',
      description: 'Create ATS-friendly resumes with modern templates and professional formatting.',
      color: '#10b981',
    },
    {
      icon: <Build />,
      title: 'Portfolio Builder',
      description: 'Design stunning portfolios with drag-and-drop interface and real-time preview.',
      color: '#f59e0b',
    },
    {
      icon: <Devices />,
      title: 'Responsive Design',
      description: 'Your portfolio looks perfect on all devices - mobile, tablet, and desktop.',
      color: '#8b5cf6',
    },
  ];
  
  const benefits = [
    {
      icon: <Speed />,
      title: 'Lightning Fast',
      description: 'Build your professional portfolio in minutes, not hours.',
    },
    {
      icon: <Security />,
      title: 'Secure & Private',
      description: 'Your data is encrypted and never shared with third parties.',
    },
    {
      icon: <TrendingUp />,
      title: 'SEO Optimized',
      description: 'Get discovered by recruiters with search engine optimization.',
    },
  ];
  
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer at Google',
      avatar: '/api/placeholder/64/64',
      content: 'This platform helped me create a stunning portfolio that landed me my dream job at Google!',
      rating: 5,
    },
    {
      name: 'Marcus Johnson',
      role: 'Full Stack Developer',
      avatar: '/api/placeholder/64/64',
      content: 'The AI assistance made writing professional descriptions so much easier. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Priya Patel',
      role: 'Product Manager at Microsoft',
      avatar: '/api/placeholder/64/64',
      content: 'The GitHub integration saved me hours of work. My portfolio updates automatically!',
      rating: 5,
    },
  ];
  
  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h2"
                  fontWeight="bold"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    mb: 3,
                    lineHeight: 1.2,
                  }}
                >
                  Create Your Dream Portfolio in Minutes
                </Typography>
                
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    fontWeight: 300,
                    lineHeight: 1.5,
                  }}
                >
                  Professional portfolios and resumes powered by AI, GitHub, and LinkedIn integration. 
                  Stand out from the crowd and land your next opportunity.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => safeNavigate(navigate, '/builder')}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': {
                        bgcolor: alpha('#ffffff', 0.9),
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Create Professional Portfolio
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => safeNavigate(navigate, '/dashboard')}
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Explore Features
                  </Button>
                </Box>
              </MotionBox>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Paper
                  elevation={20}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    ✨ Key Features
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {['GitHub Integration', 'AI Content Optimization', 'LinkedIn Sync', 'Resume Generator'].map((feature) => (
                      <Box key={feature} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle sx={{ fontSize: 16, color: '#4ade80' }} />
                        <Typography variant="body2">{feature}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <MotionBox
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          sx={{ textAlign: 'center', mb: 6 }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Everything You Need to Succeed
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Our comprehensive platform provides all the tools and integrations needed to create 
            a professional portfolio that gets results.
          </Typography>
        </MotionBox>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={feature.title}>
              <MotionCard
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: feature.color,
                      width: 64,
                      height: 64,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* Benefits Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  Why Choose Our Platform?
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  We've built the most comprehensive portfolio and resume platform that combines 
                  cutting-edge technology with ease of use.
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {benefits.map((benefit) => (
                    <Box key={benefit.title} sx={{ display: 'flex', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: 'primary.main',
                          width: 48,
                          height: 48,
                        }}
                      >
                        {benefit.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="semibold" gutterBottom>
                          {benefit.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {benefit.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </MotionBox>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                sx={{ textAlign: 'center' }}
              >
                <Paper
                  elevation={8}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                  }}
                >
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    10,000+
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Portfolios Created
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Join thousands of professionals who have already created 
                    stunning portfolios and landed their dream jobs.
                  </Typography>
                </Paper>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <MotionBox
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          sx={{ textAlign: 'center', mb: 6 }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            What Our Users Say
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Don't just take our word for it - hear from professionals who've succeeded with our platform.
          </Typography>
        </MotionBox>
        
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={testimonial.name}>
              <MotionCard
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} sx={{ color: '#fbbf24', fontSize: 20 }} />
                    ))}
                  </Box>
                  
                  <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                    "{testimonial.content}"
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={testimonial.avatar}>
                      {testimonial.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Ready to Build Your Portfolio?
            </Typography>
            
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of professionals who have already created stunning portfolios. 
              Get started for free today!
            </Typography>
            
            <Button
              variant="contained"
              size="large"
              onClick={handleGetStarted}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                '&:hover': {
                  bgcolor: alpha('#ffffff', 0.9),
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Start Building Now
            </Button>
          </MotionBox>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;