import React from 'react';
import { Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore, BugReport } from '@mui/icons-material';

interface DebugInfoProps {
  title?: string;
  data?: any;
  error?: any;
  show?: boolean;
}

const DebugInfo: React.FC<DebugInfoProps> = ({ 
  title = "Debug Info", 
  data, 
  error, 
  show = process.env.NODE_ENV === 'development' 
}) => {
  if (!show) return null;

  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999, maxWidth: 400 }}>
      <Accordion sx={{ border: '2px solid #ff9800' }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BugReport sx={{ color: 'warning.main' }} />
            <Typography variant="caption" fontWeight="bold">
              {title}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Paper sx={{ p: 2, bgcolor: 'grey.50', maxHeight: 300, overflow: 'auto' }}>
            {error && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="error" fontWeight="bold">
                  ERROR:
                </Typography>
                <Typography variant="caption" component="pre" sx={{ fontSize: '0.7rem', color: 'error.main' }}>
                  {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
                </Typography>
              </Box>
            )}
            
            {data && (
              <Box>
                <Typography variant="caption" fontWeight="bold">
                  DATA:
                </Typography>
                <Typography variant="caption" component="pre" sx={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>
                  {JSON.stringify(data, null, 2)}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" fontWeight="bold">
                LOCATION:
              </Typography>
              <Typography variant="caption" component="pre" sx={{ fontSize: '0.7rem' }}>
                {window.location.href}
              </Typography>
            </Box>
          </Paper>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default DebugInfo;