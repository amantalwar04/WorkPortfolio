import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  Paper,
  Grid,
} from '@mui/material';
import { Home, BugReport, Refresh } from '@mui/icons-material';

/**
 * Debug Dashboard for troubleshooting React errors
 * This is the most minimal possible dashboard with maximum error information
 */
const DebugDashboard: React.FC = () => {
  const handleGoHome = () => {
    try {
      window.location.hash = '/';
    } catch (error) {
      window.location.href = '/';
    }
  };

  const handleReload = () => {
    try {
      window.location.reload();
    } catch (error) {
      window.location.reload();
    }
  };

  const handleClearCache = () => {
    try {
      // Clear localStorage
      localStorage.clear();
      // Clear sessionStorage
      sessionStorage.clear();
      // Reload page
      window.location.reload();
    } catch (error) {
      console.error('Cache clear failed:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card sx={{ border: '2px solid #ff9800' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <BugReport sx={{ fontSize: 40, color: 'warning.main' }} />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Debug Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Error-free fallback dashboard
              </Typography>
            </Box>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              You've reached the debug dashboard. This means there was an issue with the main dashboard component. 
              This page uses minimal React features to prevent any errors.
            </Typography>
          </Alert>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  0%
                </Typography>
                <Typography variant="caption">
                  Portfolio Complete
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="success.main">
                  0
                </Typography>
                <Typography variant="caption">
                  Projects
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="warning.main">
                  Ready
                </Typography>
                <Typography variant="caption">
                  Status
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<Home />}
              onClick={handleGoHome}
            >
              Go Home
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleReload}
            >
              Reload Page
            </Button>
            <Button
              variant="outlined"
              onClick={handleClearCache}
              color="warning"
            >
              Clear Cache
            </Button>
          </Box>

          <Typography variant="h6" gutterBottom>
            Quick Actions (Debug Mode)
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            <Button
              variant="contained"
              onClick={() => { window.location.hash = '/professional-builder'; }}
            >
              Professional Portfolio
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => { window.location.hash = '/resume'; }}
            >
              Resume Generator
            </Button>
            <Button
              variant="outlined"
              onClick={() => { window.location.hash = '/settings'; }}
            >
              Settings
            </Button>
          </Box>

          <Alert severity="warning">
            <Typography variant="body2" fontWeight="bold">
              Debug Information:
            </Typography>
            <Typography variant="body2">
              • Current URL: {window.location.href}<br/>
              • Hash: {window.location.hash}<br/>
              • User Agent: {navigator.userAgent.substring(0, 100)}...<br/>
              • Timestamp: {new Date().toISOString()}
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DebugDashboard;