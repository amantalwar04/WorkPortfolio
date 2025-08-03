import React from 'react';
import {
  Fab,
  Tooltip,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import { WhatsApp, Close } from '@mui/icons-material';
import { createWhatsAppURL } from '../../utils';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  position?: 'fixed' | 'inline';
  size?: 'small' | 'medium' | 'large';
  variant?: 'fab' | 'button' | 'icon';
  showMessageDialog?: boolean;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  message = '',
  position = 'fixed',
  size = 'medium',
  variant = 'fab',
  showMessageDialog = false,
}) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [customMessage, setCustomMessage] = React.useState(message);
  
  const handleWhatsAppClick = () => {
    if (showMessageDialog) {
      setDialogOpen(true);
    } else {
      openWhatsApp(customMessage);
    }
  };
  
  const openWhatsApp = (msg: string) => {
    const url = createWhatsAppURL(phoneNumber, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  const handleSendMessage = () => {
    openWhatsApp(customMessage);
    setDialogOpen(false);
  };
  
  const getFabStyles = () => ({
    position: position,
    bottom: position === 'fixed' ? 24 : 'auto',
    right: position === 'fixed' ? 24 : 'auto',
    backgroundColor: '#25D366',
    color: 'white',
    '&:hover': {
      backgroundColor: '#22C15E',
      transform: 'scale(1.1)',
    },
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
  });
  
  const renderButton = () => {
    switch (variant) {
      case 'fab':
        return (
          <Tooltip title="Contact via WhatsApp" placement="left">
            <Fab
              size={size}
              onClick={handleWhatsAppClick}
              sx={getFabStyles()}
              aria-label="WhatsApp contact"
            >
              <WhatsApp />
            </Fab>
          </Tooltip>
        );
        
      case 'button':
        return (
          <Button
            variant="contained"
            startIcon={<WhatsApp />}
            onClick={handleWhatsAppClick}
            size={size}
            sx={{
              backgroundColor: '#25D366',
              color: 'white',
              '&:hover': {
                backgroundColor: '#22C15E',
              },
            }}
          >
            WhatsApp
          </Button>
        );
        
      case 'icon':
        return (
          <Tooltip title="Contact via WhatsApp">
            <IconButton
              onClick={handleWhatsAppClick}
              size={size}
              sx={{
                color: '#25D366',
                '&:hover': {
                  backgroundColor: 'rgba(37, 211, 102, 0.1)',
                },
              }}
            >
              <WhatsApp />
            </IconButton>
          </Tooltip>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Box>
      {renderButton()}
      
      {/* Message Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WhatsApp sx={{ color: '#25D366' }} />
            <Typography variant="h6">Send WhatsApp Message</Typography>
          </Box>
          <IconButton onClick={() => setDialogOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Compose your message and we'll open WhatsApp for you to send it.
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Message"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Hi! I'd like to discuss a potential opportunity..."
            variant="outlined"
          />
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Sending to: {phoneNumber}
          </Typography>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendMessage}
            variant="contained"
            startIcon={<WhatsApp />}
            sx={{
              backgroundColor: '#25D366',
              '&:hover': {
                backgroundColor: '#22C15E',
              },
            }}
          >
            Send via WhatsApp
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WhatsAppButton;