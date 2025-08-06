import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Link,
  Grid,
} from '@mui/material';
import {
  Help,
  GitHub,
  Folder,
  Description,
  Code,
  Launch,
  WhatsApp,
  LinkedIn,
  ExpandMore,
  CheckCircle,
  Info,
  Warning,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface PortfolioHelpProps {
  open: boolean;
  onClose: () => void;
}

const PortfolioHelp: React.FC<PortfolioHelpProps> = ({ open, onClose }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const TabPanel = ({ children, value, index }: any) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Help color="primary" />
          <Typography variant="h5" fontWeight="bold">
            Portfolio Generator Guide
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Getting Started" />
          <Tab label="Repository Setup" />
          <Tab label="Project Structure" />
          <Tab label="Features" />
          <Tab label="Deployment" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h6" gutterBottom>
              Welcome to Portfolio Generator! 🎉
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>What You'll Create</AlertTitle>
              A professional GitHub Pages portfolio that automatically showcases your projects, 
              includes WhatsApp and LinkedIn connectivity, and updates dynamically from your repository.
            </Alert>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Quick Start Steps
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="1. Complete Portfolio Builder"
                  secondary="Fill in your personal information, experience, and skills using our 9-step wizard"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="2. Setup GitHub Repository"
                  secondary="Prepare your repository with the correct structure for automatic project discovery"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="3. Deploy to GitHub Pages"
                  secondary="Use our deployment wizard to publish your portfolio to GitHub Pages"
                />
              </ListItem>
            </List>

            <Card sx={{ mt: 3, bgcolor: 'success.50' }}>
              <CardContent>
                <Typography variant="h6" color="success.main" gutterBottom>
                  Example Portfolio
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  See a live example of what your portfolio will look like:
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Launch />}
                  href="https://amantalwar04.github.io/portfolio/"
                  target="_blank"
                >
                  View Example Portfolio
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Repository Setup Requirements
          </Typography>

          <Alert severity="warning" sx={{ mb: 3 }}>
            <AlertTitle>Prerequisites</AlertTitle>
            You need a GitHub repository where your portfolio will be deployed. 
            This can be an existing repo or a new one created specifically for your portfolio.
          </Alert>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Step 1: Create GitHub Personal Access Token</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemIcon>1.</ListItemIcon>
                  <ListItemText
                    primary="Go to GitHub Settings"
                    secondary={
                      <Link href="https://github.com/settings/tokens" target="_blank">
                        https://github.com/settings/tokens
                      </Link>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>2.</ListItemIcon>
                  <ListItemText
                    primary="Click 'Generate new token (classic)'"
                    secondary="Choose the classic token for broader compatibility"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>3.</ListItemIcon>
                  <ListItemText
                    primary="Select required permissions:"
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Chip label="repo (Full control)" color="primary" size="small" sx={{ mr: 1 }} />
                        <Chip label="write:pages" color="primary" size="small" sx={{ mr: 1 }} />
                        <Chip label="read:org" color="secondary" size="small" />
                      </Box>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>4.</ListItemIcon>
                  <ListItemText
                    primary="Generate and copy the token"
                    secondary="⚠️ Save this token securely - you won't be able to see it again!"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Step 2: Repository Configuration</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Your repository needs the following configuration:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <GitHub />
                  </ListItemIcon>
                  <ListItemText
                    primary="Repository Name"
                    secondary="Can be any name (e.g., 'portfolio', 'my-website', etc.)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Folder />
                  </ListItemIcon>
                  <ListItemText
                    primary="Branch for GitHub Pages"
                    secondary="Usually 'gh-pages' or 'main' - we recommend 'gh-pages'"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle />
                  </ListItemIcon>
                  <ListItemText
                    primary="Repository Permissions"
                    secondary="You need push access to the repository"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Project Structure for Auto-Discovery
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            <AlertTitle>Automatic Project Detection</AlertTitle>
            Our system automatically discovers and showcases your projects by scanning 
            your repository's <code>projects</code> folder structure.
          </Alert>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Required Folder Structure
              </Typography>
              <Box sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                <Typography variant="body2">
                  your-repository/<br/>
                  ├── projects/<br/>
                  │   ├── project-1/<br/>
                  │   │   ├── README.md<br/>
                  │   │   ├── index.html (optional)<br/>
                  │   │   └── screenshot.png (optional)<br/>
                  │   ├── project-2/<br/>
                  │   │   ├── README.md<br/>
                  │   │   └── demo.gif (optional)<br/>
                  │   └── awesome-app/<br/>
                  │       ├── README.md<br/>
                  │       └── preview.jpg (optional)<br/>
                  └── other files...
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">README.md Format</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Each project's README.md should include:
              </Typography>
              <Card sx={{ bgcolor: 'grey.50' }}>
                <CardContent>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    # Project Name<br/><br/>
                    Brief description of your project here.<br/><br/>
                    ## Tech Stack<br/>
                    React, TypeScript, Node.js, MongoDB<br/><br/>
                    ## Links<br/>
                    - [Live Demo](https://your-demo-url.com)<br/>
                    - [Source Code](https://github.com/username/repo)<br/>
                  </Typography>
                </CardContent>
              </Card>
              
              <Alert severity="success" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Auto-Extracted Information:</strong><br/>
                  • Project name (from folder name)<br/>
                  • Description (first paragraph)<br/>
                  • Technologies (from "Tech Stack" section)<br/>
                  • Live demo URL (from links)<br/>
                  • Project image (first image file found)
                </Typography>
              </Alert>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Image Guidelines</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Info />
                  </ListItemIcon>
                  <ListItemText
                    primary="Supported formats: JPG, PNG, GIF, SVG"
                    secondary="First image found in the project folder will be used"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Info />
                  </ListItemIcon>
                  <ListItemText
                    primary="Recommended names: screenshot.png, preview.jpg, demo.gif"
                    secondary="Use descriptive names for better organization"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Info />
                  </ListItemIcon>
                  <ListItemText
                    primary="Recommended size: 800x600px or 16:9 aspect ratio"
                    secondary="Images will be automatically resized for display"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Portfolio Features
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <WhatsApp sx={{ color: '#25D366', fontSize: 32 }} />
                    <Typography variant="h6">WhatsApp Integration</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Direct WhatsApp messaging with pre-filled message for easy contact.
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="One-click messaging" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Pre-filled introduction message" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Mobile-optimized" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <LinkedIn sx={{ color: '#0077b5', fontSize: 32 }} />
                    <Typography variant="h6">LinkedIn Integration</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Direct links to your LinkedIn profile for professional networking.
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Profile integration" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Professional networking" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Easy connection requests" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Code sx={{ color: '#1976d2', fontSize: 32 }} />
                    <Typography variant="h6">Auto Project Discovery</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Automatically showcases projects from your repository structure.
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="README.md parsing" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Tech stack extraction" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Automatic image detection" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Launch sx={{ color: '#4caf50', fontSize: 32 }} />
                    <Typography variant="h6">GitHub Pages Deployment</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    One-click deployment to GitHub Pages with automatic updates.
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Automated deployment" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Custom domain support" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="SSL certificate included" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>
            Deployment Process
          </Typography>

          <Alert severity="success" sx={{ mb: 3 }}>
            <AlertTitle>Automated Deployment</AlertTitle>
            Our deployment wizard handles everything automatically - no manual configuration needed!
          </Alert>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">What Happens During Deployment</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemIcon>1.</ListItemIcon>
                  <ListItemText
                    primary="Repository Verification"
                    secondary="Verifies access to your repository and checks permissions"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>2.</ListItemIcon>
                  <ListItemText
                    primary="Project Discovery"
                    secondary="Scans your projects folder and extracts project information"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>3.</ListItemIcon>
                  <ListItemText
                    primary="Portfolio Generation"
                    secondary="Creates a complete HTML portfolio with your data and discovered projects"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>4.</ListItemIcon>
                  <ListItemText
                    primary="GitHub Pages Setup"
                    secondary="Uploads the portfolio and enables GitHub Pages if not already active"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>5.</ListItemIcon>
                  <ListItemText
                    primary="Live Portfolio"
                    secondary="Your portfolio is now live at https://username.github.io/repository/"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">After Deployment</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Once deployed, your portfolio will:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Be accessible via GitHub Pages URL"
                    secondary="Usually https://username.github.io/repository-name/"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Include all your portfolio information"
                    secondary="Personal info, experience, skills, and auto-discovered projects"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Have working contact features"
                    secondary="WhatsApp messaging, LinkedIn links, and email contact"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Be mobile-responsive"
                    secondary="Looks great on all devices and screen sizes"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Card sx={{ mt: 3, bgcolor: 'info.50' }}>
            <CardContent>
              <Typography variant="h6" color="info.main" gutterBottom>
                Need Help?
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                If you encounter any issues during deployment:
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<GitHub />}
                  href="https://docs.github.com/en/pages"
                  target="_blank"
                >
                  GitHub Pages Docs
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Help />}
                  href="https://github.com/settings/tokens"
                  target="_blank"
                >
                  Token Setup
                </Button>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Got It!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PortfolioHelp;