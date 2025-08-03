import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';

// Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import SafeDashboardPage from './pages/SafeDashboardPage';
import PortfolioBuilderPage from './pages/PortfolioBuilderPage';
import ResumeGeneratorPage from './pages/ResumeGeneratorPage';
import PortfolioPreviewPage from './pages/PortfolioPreviewPage';
import SettingsPage from './pages/SettingsPage';
import ProfessionalPortfolioBuilder from './components/portfolio/ProfessionalPortfolioBuilder';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';

// Theme configuration
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
      light: '#8fa7f3',
      dark: '#4c63d2',
    },
    secondary: {
      main: '#764ba2',
      light: '#9575cd',
      dark: '#512da8',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <ErrorBoundary>
              <Navbar />
            </ErrorBoundary>
            <main>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/dashboard" element={<SafeDashboardPage />} />
                  <Route path="/dashboard-old" element={<DashboardPage />} />
                  <Route path="/builder" element={<PortfolioBuilderPage />} />
                  <Route path="/professional-builder" element={<ProfessionalPortfolioBuilder />} />
                  <Route path="/resume" element={<ResumeGeneratorPage />} />
                  <Route path="/preview" element={<PortfolioPreviewPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  {/* Portfolio public routes */}
                  <Route path="/portfolio/:username" element={<PortfolioPreviewPage />} />
                  <Route path="/portfolio/:username/:section" element={<PortfolioPreviewPage />} />
                </Routes>
              </ErrorBoundary>
            </main>
            <ErrorBoundary>
              <Footer />
            </ErrorBoundary>
            
            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  style: {
                    background: '#10b981',
                  },
                },
                error: {
                  style: {
                    background: '#ef4444',
                  },
                },
              }}
            />
          </div>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;