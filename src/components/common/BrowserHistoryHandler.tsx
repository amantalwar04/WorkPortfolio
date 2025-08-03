import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Component to handle browser history and back button functionality
 */
const BrowserHistoryHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle browser back/forward buttons
    const handlePopState = (event: PopStateEvent) => {
      // Let React Router handle the navigation
      // This ensures proper state management
      console.log('Browser navigation detected:', event.state);
    };

    // Add event listener for browser navigation
    window.addEventListener('popstate', handlePopState);

    // Store current path in session storage for recovery
    sessionStorage.setItem('current_path', location.pathname);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname]);

  // Handle hash changes for GitHub Pages compatibility
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash !== location.pathname) {
        navigate(hash, { replace: true });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [navigate, location.pathname]);

  // Handle page refresh recovery
  useEffect(() => {
    const storedPath = sessionStorage.getItem('current_path');
    if (storedPath && storedPath !== location.pathname && location.pathname === '/') {
      navigate(storedPath, { replace: true });
    }
  }, [navigate, location.pathname]);

  return null; // This component doesn't render anything
};

export default BrowserHistoryHandler;