import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import {
  GitHub,
  LinkedIn,
  Twitter,
  Email,
  Favorite,
  Code,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const theme = useTheme();
  
  const footerLinks = {
    product: [
      { label: 'Portfolio Builder', href: '/builder' },
      { label: 'Resume Generator', href: '/resume' },
      { label: 'Templates', href: '/templates' },
      { label: 'Examples', href: '/examples' },
    ],
    resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Tutorials', href: '/tutorials' },
      { label: 'Blog', href: '/blog' },
      { label: 'Support', href: '/support' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Contact', href: '/contact' },
    ],
  };
  
  const socialLinks = [
    { icon: <GitHub />, href: 'https://github.com', label: 'GitHub' },
    { icon: <LinkedIn />, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <Twitter />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <Email />, href: 'mailto:hello@portfoliogen.com', label: 'Email' },
  ];
  
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                }}
              >
                Portfolio Generator
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
                Create stunning portfolios and professional resumes with AI assistance. 
                Showcase your projects, connect with GitHub and LinkedIn, and land your dream job.
              </Typography>
              
              {/* Social links */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                {socialLinks.map((social) => (
                  <IconButton
                    key={social.label}
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'grey.400',
                      '&:hover': {
                        color: 'primary.main',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>
          
          {/* Links sections */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              <Grid item xs={6} sm={4}>
                <Typography variant="h6" fontWeight="semibold" sx={{ mb: 2 }}>
                  Product
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {footerLinks.product.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      color="inherit"
                      underline="none"
                      sx={{
                        opacity: 0.8,
                        '&:hover': {
                          opacity: 1,
                          color: 'primary.main',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Box>
              </Grid>
              
              <Grid item xs={6} sm={4}>
                <Typography variant="h6" fontWeight="semibold" sx={{ mb: 2 }}>
                  Resources
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {footerLinks.resources.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      color="inherit"
                      underline="none"
                      sx={{
                        opacity: 0.8,
                        '&:hover': {
                          opacity: 1,
                          color: 'primary.main',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Box>
              </Grid>
              
              <Grid item xs={6} sm={4}>
                <Typography variant="h6" fontWeight="semibold" sx={{ mb: 2 }}>
                  Company
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {footerLinks.company.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      color="inherit"
                      underline="none"
                      sx={{
                        opacity: 0.8,
                        '&:hover': {
                          opacity: 1,
                          color: 'primary.main',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4, bgcolor: 'grey.700' }} />
        
        {/* Bottom section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} Portfolio Generator. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Made with
            </Typography>
            <Favorite sx={{ color: 'red', fontSize: 16 }} />
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              and
            </Typography>
            <Code sx={{ color: 'primary.main', fontSize: 16 }} />
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              for developers
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;