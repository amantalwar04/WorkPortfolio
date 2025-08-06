import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  Divider,
  Tab,
  Tabs,
  CircularProgress,
} from '@mui/material';
import { Google, Person, Email, Lock } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ open, onClose, onSuccess }) => {
  const { signIn, signUp, signInWithGoogle, loading } = useAuth();
  
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (!formData.displayName.trim()) {
        setError('Display name is required');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    setError('');

    try {
      if (mode === 'signin') {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData.email, formData.password, formData.displayName);
      }
      
      // Success - close dialog
      onSuccess?.();
      onClose();
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    setError('');

    try {
      await signInWithGoogle();
      onSuccess?.();
      onClose();
    } catch (error: any) {
      setError(error.message || 'Google sign-in failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        displayName: '',
      });
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" fontWeight="bold">
            Welcome to Portfolio Generator
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Sign in to save your portfolio and access all features
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {/* Mode Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={mode} 
            onChange={(_, newMode) => setMode(newMode)}
            variant="fullWidth"
          >
            <Tab label="Sign In" value="signin" />
            <Tab label="Sign Up" value="signup" />
          </Tabs>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Google Sign In */}
        <Button
          variant="outlined"
          fullWidth
          size="large"
          startIcon={<Google />}
          onClick={handleGoogleSignIn}
          disabled={submitting || loading}
          sx={{ mb: 3 }}
        >
          {submitting ? 'Signing in...' : 'Continue with Google'}
        </Button>

        <Divider sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            or
          </Typography>
        </Divider>

        {/* Email/Password Form */}
        <Box component="form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <TextField
              label="Display Name"
              value={formData.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              fullWidth
              margin="normal"
              disabled={submitting}
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          )}
          
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            fullWidth
            margin="normal"
            disabled={submitting}
            InputProps={{
              startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
          
          <TextField
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            fullWidth
            margin="normal"
            disabled={submitting}
            InputProps={{
              startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
          
          {mode === 'signup' && (
            <TextField
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              fullWidth
              margin="normal"
              disabled={submitting}
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          )}
        </Box>

        {/* Benefits Box */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            With an account, you can:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Save your portfolio across devices<br/>
            • Access premium templates<br/>
            • Export to multiple formats<br/>
            • Sync with GitHub and LinkedIn<br/>
            • Use AI-powered content suggestions
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={handleClose} 
          disabled={submitting}
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || loading}
          startIcon={submitting ? <CircularProgress size={20} /> : null}
          sx={{ minWidth: 120 }}
        >
          {submitting 
            ? (mode === 'signin' ? 'Signing In...' : 'Signing Up...')
            : (mode === 'signin' ? 'Sign In' : 'Sign Up')
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthDialog;