import React, { Component, ReactNode } from 'react';
import { Box, Typography, Button, Paper, Alert } from '@mui/material';
import { Refresh, BugReport } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

class SafeWrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error(`SafeWrapper [${this.props.name}] caught error:`, error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Paper sx={{ p: 3, m: 2, border: '1px solid #ffeb3b' }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Component Error: {this.props.name || 'Unknown'}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Typography>
          </Alert>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" onClick={this.handleReset} startIcon={<Refresh />}>
              Retry
            </Button>
            <Button 
              size="small" 
              onClick={() => window.location.reload()} 
              startIcon={<BugReport />}
            >
              Reload Page
            </Button>
          </Box>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="caption" component="pre" sx={{ fontSize: '0.7rem' }}>
                {this.state.error.stack}
              </Typography>
            </Box>
          )}
        </Paper>
      );
    }

    return this.props.children;
  }
}

export default SafeWrapper;