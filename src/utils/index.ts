// Utility functions for the portfolio generator

import { toast } from 'react-hot-toast';
import { Project, Experience, Skill } from '../types';

// Date formatting utilities
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  } catch (error) {
    return dateString;
  }
};

export const formatDateRange = (startDate: string, endDate?: string, current = false): string => {
  const start = formatDate(startDate);
  if (current || !endDate) return `${start} - Present`;
  return `${start} - ${formatDate(endDate)}`;
};

// String utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export const capitalizeWords = (text: string): string => {
  return text.replace(/\b\w/g, char => char.toUpperCase());
};

// URL utilities
export const isValidURL = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const addProtocolToURL = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};

export const getGitHubRepoURL = (username: string, repoName: string): string => {
  return `https://github.com/${username}/${repoName}`;
};

export const getLinkedInProfileURL = (username: string): string => {
  return `https://linkedin.com/in/${username}`;
};

// WhatsApp utilities
export const createWhatsAppURL = (phoneNumber: string, message?: string): string => {
  const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
  const encodedMessage = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${cleanNumber}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
};

// File utilities
export const downloadFile = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

// Image utilities
export const compressImage = (file: File, maxWidth = 800, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Data transformation utilities
export const extractTechnologiesFromProjects = (projects: Project[]): string[] => {
  const techSet = new Set<string>();
  projects.forEach(project => {
    project.technologies.forEach(tech => techSet.add(tech));
  });
  return Array.from(techSet).sort();
};

export const calculateExperienceYears = (experiences: Experience[]): number => {
  let totalMonths = 0;
  
  experiences.forEach(exp => {
    const start = new Date(exp.startDate);
    const end = exp.current ? new Date() : new Date(exp.endDate || new Date());
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                   (end.getMonth() - start.getMonth());
    totalMonths += Math.max(0, months);
  });
  
  return Math.round(totalMonths / 12 * 10) / 10; // Round to 1 decimal place
};

export const groupSkillsByCategory = (skills: Skill[]): Record<string, Skill[]> => {
  return skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);
};

// Color utilities
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const generateColorPalette = (baseColor: string): string[] => {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [baseColor];
  
  return [
    baseColor,
    `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`,
    `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`,
    `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`,
    `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`,
  ];
};

// Local storage utilities
export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[^\d+]/g, ''));
};

export const validateGitHubUsername = (username: string): boolean => {
  const githubRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
  return githubRegex.test(username);
};

// Toast utilities
export const showSuccess = (message: string): void => {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
  });
};

export const showError = (message: string): void => {
  toast.error(message, {
    duration: 5000,
    position: 'top-right',
  });
};

export const showLoading = (message: string): string => {
  return toast.loading(message, {
    position: 'top-right',
  });
};

export const dismissToast = (toastId: string): void => {
  toast.dismiss(toastId);
};

// Performance utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Array utilities
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// SEO utilities
export const generateSEOTitle = (name: string, role?: string): string => {
  const parts = [name];
  if (role) parts.push(role);
  parts.push('Portfolio');
  return parts.join(' - ');
};

export const generateSEODescription = (name: string, skills: string[], experience?: string): string => {
  const skillsText = skills.slice(0, 5).join(', ');
  const experienceText = experience ? ` with ${experience}` : '';
  return `${name}'s professional portfolio showcasing expertise in ${skillsText}${experienceText}. View projects, experience, and get in touch.`;
};

// Portfolio URL utilities
export const generatePortfolioURL = (username: string, customDomain?: string): string => {
  if (customDomain) {
    return addProtocolToURL(customDomain);
  }
  return `https://${username}.github.io`;
};

export const generatePortfolioFilename = (name: string, type: 'resume' | 'portfolio'): string => {
  const safeName = name.replace(/[^a-zA-Z0-9]/g, '_');
  const timestamp = new Date().toISOString().split('T')[0];
  return `${safeName}_${type}_${timestamp}`;
};