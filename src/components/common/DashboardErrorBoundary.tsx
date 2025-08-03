import React, { Component, ReactNode } from 'react';
import DebugDashboard from '../../pages/DebugDashboard';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class DashboardErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('Dashboard Error Boundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Dashboard Error Boundary - Component did catch:', error, errorInfo);
    
    // Report error to analytics or error tracking service
    try {
      const errorReport = {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      };
      
      console.error('Error Report:', errorReport);
      
      // Store error in localStorage for debugging
      localStorage.setItem('last_dashboard_error', JSON.stringify(errorReport));
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
    }
  }

  render() {
    if (this.state.hasError) {
      // Render the debug dashboard as fallback
      return <DebugDashboard />;
    }

    return this.props.children;
  }
}

export default DashboardErrorBoundary;