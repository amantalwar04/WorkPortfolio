/**
 * LinkedIn OAuth Callback Handler Page
 * Handles the OAuth callback from LinkedIn and closes the popup
 */

import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LinkedInApiService from '../services/linkedinApi';

const LinkedInCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage(`LinkedIn authorization failed: ${error}`);
          return;
        }

        if (!code || !state) {
          setStatus('error');
          setMessage('Missing authorization code or state parameter');
          return;
        }

        const linkedinService = new LinkedInApiService();
        const success = await linkedinService.handleOAuthCallback(code, state);

        if (success) {
          setStatus('success');
          setMessage('LinkedIn authorization successful! You can now import your data.');
          
          // Notify parent window (if this is in a popup)
          if (window.opener) {
            window.opener.postMessage({
              type: 'LINKEDIN_OAUTH_SUCCESS',
              data: { success: true }
            }, window.location.origin);
            window.close();
          } else {
            // Redirect to portfolio builder if not in popup
            setTimeout(() => {
              navigate('/builder');
            }, 2000);
          }
        } else {
          setStatus('error');
          setMessage('Failed to exchange authorization code for access token');
        }
      } catch (error) {
        console.error('LinkedIn callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={4}
    >
      <Box maxWidth={400} textAlign="center">
        {status === 'loading' && (
          <>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h5" gutterBottom>
              Connecting to LinkedIn...
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please wait while we complete the authorization process.
            </Typography>
          </>
        )}

        {status === 'success' && (
          <>
            <Alert severity="success" sx={{ mb: 3 }}>
              LinkedIn Connected Successfully!
            </Alert>
            <Typography variant="h5" gutterBottom>
              Authorization Complete
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {message}
            </Typography>
            {!window.opener && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                Redirecting to portfolio builder...
              </Typography>
            )}
          </>
        )}

        {status === 'error' && (
          <>
            <Alert severity="error" sx={{ mb: 3 }}>
              Authorization Failed
            </Alert>
            <Typography variant="h5" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {message}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Please close this window and try again.
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
};

export default LinkedInCallbackPage;