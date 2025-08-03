import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Build,
  Description,
  Visibility,
  Settings,
  GitHub,
  LinkedIn,
  Logout,
  Home,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../store';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const user = useUser();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  
  const menuItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { label: 'Portfolio Builder', path: '/builder', icon: <Build /> },
    { label: 'Resume Generator', path: '/resume', icon: <Description /> },
    { label: 'Preview', path: '/preview', icon: <Visibility /> },
    { label: 'Settings', path: '/settings', icon: <Settings /> },
  ];
  
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileDrawerOpen(false);
    handleUserMenuClose();
  };
  
  const handleLogout = () => {
    // Clear user data and redirect to home
    localStorage.removeItem('github_token');
    localStorage.removeItem('linkedin_token');
    localStorage.removeItem('ai_api_key');
    window.location.href = '/';
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const renderDesktopMenu = () => (
    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
      {menuItems.map((item) => (
        <Button
          key={item.path}
          color="inherit"
          onClick={() => handleNavigate(item.path)}
          sx={{
            mx: 0.5,
            bgcolor: isActive(item.path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
          startIcon={item.icon}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  );
  
  const renderMobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
    >
      <Box sx={{ width: 250 }}>
        <Box sx={{ p: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Typography variant="h6" color="white" fontWeight="bold">
            Portfolio Generator
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Avatar src={user.avatar} sx={{ mr: 1, width: 32, height: 32 }}>
                {user.name.charAt(0)}
              </Avatar>
              <Typography variant="body2" color="white">
                {user.name}
              </Typography>
            </Box>
          )}
        </Box>
        
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              sx={{
                cursor: 'pointer',
                bgcolor: isActive(item.path) ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(102, 126, 234, 0.05)',
                },
              }}
            >
              <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}
              />
            </ListItem>
          ))}
          
          {user && (
            <>
              <Divider sx={{ my: 1 }} />
              <ListItem onClick={handleLogout} sx={{ cursor: 'pointer' }}>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
  
  const renderUserMenu = () => (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleUserMenuClose}
      PaperProps={{
        sx: {
          mt: 1.5,
          minWidth: 200,
        },
      }}
    >
      <MenuItem onClick={() => handleNavigate('/dashboard')}>
        <Dashboard sx={{ mr: 1 }} />
        Dashboard
      </MenuItem>
      <MenuItem onClick={() => handleNavigate('/settings')}>
        <Settings sx={{ mr: 1 }} />
        Settings
      </MenuItem>
      <Divider />
      {user?.username && (
        <MenuItem
          component="a"
          href={`https://github.com/${user.username}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHub sx={{ mr: 1 }} />
          GitHub Profile
        </MenuItem>
      )}
      {user?.linkedin && (
        <MenuItem
          component="a"
          href={user.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedIn sx={{ mr: 1 }} />
          LinkedIn Profile
        </MenuItem>
      )}
      <Divider />
      <MenuItem onClick={handleLogout}>
        <Logout sx={{ mr: 1 }} />
        Logout
      </MenuItem>
    </Menu>
  );
  
  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar>
          {/* Mobile menu button */}
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setMobileDrawerOpen(true)}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Logo */}
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              fontWeight: 'bold',
              cursor: 'pointer',
              background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            onClick={() => handleNavigate('/')}
          >
            Portfolio Generator
          </Typography>
          
          {/* Desktop navigation */}
          <Box sx={{ flexGrow: 1, ml: 4 }}>
            {renderDesktopMenu()}
          </Box>
          
          {/* User section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {user ? (
              <>
                <Tooltip title="Account settings">
                  <IconButton onClick={handleUserMenuOpen} sx={{ p: 0 }}>
                    <Avatar 
                      src={user.avatar} 
                      sx={{ 
                        width: 40, 
                        height: 40,
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                      }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Box sx={{ display: { xs: 'none', sm: 'block' }, ml: 1 }}>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Welcome, {user.name.split(' ')[0]}
                  </Typography>
                </Box>
              </>
            ) : (
              <Button
                color="inherit"
                variant="outlined"
                onClick={() => handleNavigate('/dashboard')}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Get Started
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Mobile drawer */}
      {renderMobileDrawer()}
      
      {/* User menu */}
      {user && renderUserMenu()}
    </>
  );
};

export default Navbar;