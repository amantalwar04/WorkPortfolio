import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface AnalyticsProps {
  trackingId?: string;
  enableInDev?: boolean;
}

// Google Analytics 4 Component
const Analytics: React.FC<AnalyticsProps> = ({ 
  trackingId = process.env.REACT_APP_GA_TRACKING_ID,
  enableInDev = false 
}) => {
  const location = useLocation();
  const isProduction = process.env.NODE_ENV === 'production';
  const shouldTrack = isProduction || enableInDev;
  
  useEffect(() => {
    if (!trackingId || !shouldTrack) return;
    
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script);
    
    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', trackingId, {
      page_title: document.title,
      page_location: window.location.href,
    });
    
    return () => {
      // Cleanup script on unmount
      document.head.removeChild(script);
    };
  }, [trackingId, shouldTrack]);
  
  // Track page views on route changes
  useEffect(() => {
    if (!trackingId || !shouldTrack || !(window as any).gtag) return;
    
    (window as any).gtag('config', trackingId, {
      page_title: document.title,
      page_location: window.location.href,
      page_path: location.pathname + location.search,
    });
  }, [location, trackingId, shouldTrack]);
  
  return null;
};

// Hook for tracking custom events
export const useAnalytics = () => {
  const trackEvent = (
    eventName: string, 
    parameters?: Record<string, any>
  ) => {
    if (!(window as any).gtag) return;
    
    (window as any).gtag('event', eventName, {
      event_category: 'portfolio_interaction',
      event_label: parameters?.label || '',
      value: parameters?.value || 1,
      ...parameters,
    });
  };
  
  const trackPageView = (pagePath: string, pageTitle?: string) => {
    if (!(window as any).gtag) return;
    
    (window as any).gtag('config', process.env.REACT_APP_GA_TRACKING_ID, {
      page_path: pagePath,
      page_title: pageTitle || document.title,
    });
  };
  
  const trackUserAction = (action: string, category: string, label?: string) => {
    trackEvent(action, {
      event_category: category,
      event_label: label,
    });
  };
  
  const trackPortfolioInteraction = (interaction: string, details?: any) => {
    trackEvent('portfolio_interaction', {
      interaction_type: interaction,
      ...details,
    });
  };
  
  const trackResumeGeneration = (templateId: string, success: boolean) => {
    trackEvent('resume_generated', {
      template_id: templateId,
      success: success,
      event_category: 'resume',
    });
  };
  
  const trackGitHubConnection = (success: boolean, repoCount?: number) => {
    trackEvent('github_connected', {
      success: success,
      repo_count: repoCount || 0,
      event_category: 'integration',
    });
  };
  
  const trackLinkedInConnection = (success: boolean) => {
    trackEvent('linkedin_connected', {
      success: success,
      event_category: 'integration',
    });
  };
  
  const trackAIUsage = (feature: string, success: boolean) => {
    trackEvent('ai_feature_used', {
      ai_feature: feature,
      success: success,
      event_category: 'ai',
    });
  };
  
  return {
    trackEvent,
    trackPageView,
    trackUserAction,
    trackPortfolioInteraction,
    trackResumeGeneration,
    trackGitHubConnection,
    trackLinkedInConnection,
    trackAIUsage,
  };
};

// SEO Component for meta tags
export const SEOHead: React.FC<{
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
}> = ({ 
  title = 'Portfolio Generator - Create Professional Portfolios & Resumes',
  description = 'Create stunning portfolios and professional resumes with AI assistance, GitHub integration, and LinkedIn sync. Build your professional brand today.',
  keywords = ['portfolio', 'resume', 'cv', 'professional', 'github', 'linkedin', 'ai', 'career'],
  image = '/og-image.png',
  url = window.location.href,
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let tag = document.querySelector(selector) as HTMLMetaElement;
      
      if (!tag) {
        tag = document.createElement('meta');
        if (property) {
          tag.setAttribute('property', name);
        } else {
          tag.setAttribute('name', name);
        }
        document.head.appendChild(tag);
      }
      
      tag.setAttribute('content', content);
    };
    
    // Standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords.join(', '));
    
    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', 'website', true);
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    
    // Additional SEO tags
    updateMetaTag('author', 'Portfolio Generator');
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
  }, [title, description, keywords, image, url]);
  
  return null;
};

export default Analytics;