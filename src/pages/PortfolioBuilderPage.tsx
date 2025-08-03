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
import { Build, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PortfolioBuilderPage: React.FC = () => {
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
          Portfolio Builder
        </Typography>
      </Box>
      
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <Build sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Portfolio Builder Coming Soon
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Our drag-and-drop portfolio builder with real-time preview is currently under development.
          This will allow you to create stunning portfolios with ease.
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Drag & Drop Interface
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Easily arrange sections and components with an intuitive interface
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Real-time Preview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  See your changes instantly as you build your portfolio
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Responsive Design
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your portfolio will look great on all devices
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default PortfolioBuilderPage;