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
import { Description, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ResumeGeneratorPage: React.FC = () => {
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
          Resume Generator
        </Typography>
      </Box>
      
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <Description sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          AI-Powered Resume Generator
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Generate professional, ATS-friendly resumes with multiple templates and AI optimization.
          Import data from your GitHub and LinkedIn profiles automatically.
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Modern Tech
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Clean, modern design perfect for tech professionals
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Classic Professional
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Traditional layout suitable for all industries
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Creative Designer
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Eye-catching design for creative professionals
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ATS Optimized
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Simple format optimized for applicant tracking systems
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ResumeGeneratorPage;