import { NavigateFunction } from 'react-router-dom';

/**
 * Safe navigation utility for GitHub Pages with hash routing
 */
export const safeNavigate = (navigate: NavigateFunction, path: string) => {
  try {
    navigate(path);
  } catch (error) {
    console.error('Navigation error:', error);
    // Fallback to direct hash manipulation for GitHub Pages
    window.location.hash = path;
  }
};

/**
 * Enhanced browser back functionality
 */
export const safeBrowserBack = (navigate: NavigateFunction, fallbackPath: string = '/') => {
  try {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  } catch (error) {
    console.error('Browser back error:', error);
    // Fallback to home page
    window.location.hash = fallbackPath;
  }
};

/**
 * Get current route path for hash routing
 */
export const getCurrentPath = (): string => {
  return window.location.hash.replace('#', '') || '/';
};

/**
 * Navigate with state preservation
 */
export const navigateWithState = (
  navigate: NavigateFunction, 
  path: string, 
  state?: any
) => {
  try {
    navigate(path, { state });
  } catch (error) {
    console.error('Navigation with state error:', error);
    // Store state in sessionStorage as fallback
    if (state) {
      sessionStorage.setItem('navigation_state', JSON.stringify(state));
    }
    window.location.hash = path;
  }
};

/**
 * Get navigation state from fallback storage
 */
export const getNavigationState = (): any => {
  try {
    const state = sessionStorage.getItem('navigation_state');
    if (state) {
      sessionStorage.removeItem('navigation_state');
      return JSON.parse(state);
    }
  } catch (error) {
    console.error('Error getting navigation state:', error);
  }
  return null;
};

/**
 * Replace current URL without navigation
 */
export const replaceCurrentUrl = (path: string) => {
  try {
    window.history.replaceState(null, '', `#${path}`);
  } catch (error) {
    console.error('URL replace error:', error);
  }
};

/**
 * Check if user can go back in browser history
 */
export const canGoBack = (): boolean => {
  return window.history.length > 1;
};

/**
 * Enhanced navigation for external links
 */
export const navigateExternal = (url: string, newTab: boolean = true) => {
  try {
    if (newTab) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
  } catch (error) {
    console.error('External navigation error:', error);
  }
};

export default {
  safeNavigate,
  safeBrowserBack,
  getCurrentPath,
  navigateWithState,
  getNavigationState,
  replaceCurrentUrl,
  canGoBack,
  navigateExternal,
};