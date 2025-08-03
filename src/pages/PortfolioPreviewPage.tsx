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
import { Visibility, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PortfolioPreviewPage: React.FC = () => {
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
          Portfolio Preview
        </Typography>
      </Box>
      
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <Visibility sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Portfolio Preview & Examples
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Preview your portfolio in real-time and see examples of stunning portfolios created with our platform.
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Live Preview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  See your portfolio exactly as visitors will see it
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Mobile Preview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Test how your portfolio looks on mobile devices
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Share & Export
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Share your portfolio link or export for hosting
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default PortfolioPreviewPage;