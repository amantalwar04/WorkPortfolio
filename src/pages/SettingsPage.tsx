import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { Settings, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  
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
          Settings
        </Typography>
      </Box>
      
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <Settings sx={{ fontSize: 80, color: 'info.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Settings & Preferences
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage your account settings, integrations, and portfolio preferences.
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Profile Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Update your personal information and contact details
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Integrations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage GitHub, LinkedIn, and AI API connections
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Privacy & Security
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Control your privacy settings and data sharing preferences
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SettingsPage;