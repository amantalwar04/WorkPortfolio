/**
 * LinkedIn Data Mapping Service
 * Converts LinkedIn API data to Portfolio Generator format
 */

import { 
  ProfessionalPortfolioData, 
  EnhancedExperience, 
  Education, 
  Skill, 
  EnhancedSkill,
  Certificate,
  Language 
} from '../types';
import { 
  LinkedInImportData, 
  LinkedInProfile, 
  LinkedInPosition, 
  LinkedInEducation, 
  LinkedInSkill,
  LinkedInRecommendation,
  LinkedInPost
} from './linkedinApi';

export interface LinkedInMappingResult {
  portfolioData: Partial<ProfessionalPortfolioData>;
  recommendations: LinkedInRecommendation[];
  posts: LinkedInPost[];
  unmappedData: any;
}

export class LinkedInDataMapper {
  /**
   * Map LinkedIn profile to PersonalInfo
   */
  static mapProfile(linkedinProfile: LinkedInProfile): ProfessionalPortfolioData['personalInfo'] {
    const getLocalizedText = (localizedObj: any): string => {
      if (!localizedObj?.localized) return '';
      const locale = localizedObj.preferredLocale;
      const key = `${locale.language}_${locale.country}`;
      return localizedObj.localized[key] || Object.values(localizedObj.localized)[0] || '';
    };

    return {
      fullName: `${getLocalizedText(linkedinProfile.firstName)} ${getLocalizedText(linkedinProfile.lastName)}`.trim(),
      title: getLocalizedText(linkedinProfile.headline),
      location: linkedinProfile.location?.name || '',
      email: '', // Not available via LinkedIn API for privacy
      avatar: linkedinProfile.profilePicture?.displayImage,
      linkedin: `https://linkedin.com/in/${linkedinProfile.id}`, // Approximate, may need user input
      // Note: Phone and other optional fields will be undefined
    };
  }

  /**
   * Map LinkedIn positions to Experience array
   */
  static mapPositions(linkedinPositions: LinkedInPosition[]): EnhancedExperience[] {
    return linkedinPositions.map((position, index) => {
      const formatDate = (date: { month?: number; year: number }): string => {
        if (date.month) {
          return `${String(date.month).padStart(2, '0')}/${date.year}`;
        }
        return date.year.toString();
      };

      return {
        id: `linkedin-exp-${position.id || index}`,
        title: position.title,
        position: position.title, // Required by Experience interface
        company: position.companyName,
        location: position.location?.name || '',
        startDate: formatDate(position.startDate),
        endDate: position.endDate ? formatDate(position.endDate) : '',
        current: position.isCurrent,
        description: position.description || '',
        achievements: [], // LinkedIn API doesn't separate achievements
        skills: [], // Would need additional mapping or user input
      };
    });
  }

  /**
   * Map LinkedIn education to Education array
   */
  static mapEducation(linkedinEducation: LinkedInEducation[]): Education[] {
    return linkedinEducation.map((edu, index) => ({
      id: `linkedin-edu-${edu.id || index}`,
      institution: edu.schoolName,
      degree: edu.degreeName || '',
      field: edu.fieldOfStudy || '',
      startDate: edu.startDate?.year.toString() || '',
      endDate: edu.endDate?.year.toString() || '',
      description: edu.description || '',
      gpa: '', // Not available via LinkedIn API
      achievements: [], // Not available via LinkedIn API
    }));
  }

  /**
   * Map LinkedIn skills to Skill array
   */
  static mapSkills(linkedinSkills: LinkedInSkill[]): EnhancedSkill[] {
    return linkedinSkills.map((skill, index) => ({
      id: `linkedin-skill-${index}`,
      name: skill.name,
      level: this.estimateSkillLevel(skill.endorsementCount || 0),
      category: 'Professional', // Default category, user can modify
      years: 1, // Default, user can modify
      certified: false, // Default, user can modify
    }));
  }

  /**
   * Estimate skill level based on endorsement count
   */
  private static estimateSkillLevel(endorsementCount: number): number {
    if (endorsementCount >= 50) return 9;
    if (endorsementCount >= 25) return 8;
    if (endorsementCount >= 15) return 7;
    if (endorsementCount >= 10) return 6;
    if (endorsementCount >= 5) return 5;
    if (endorsementCount >= 2) return 4;
    if (endorsementCount >= 1) return 3;
    return 2; // Default for skills without endorsements
  }

  /**
   * Map LinkedIn data to certificates (from recommendations or manual)
   */
  static mapCertificates(linkedinData: LinkedInImportData): Certificate[] {
    // LinkedIn API doesn't directly provide certifications in basic access
    // This could be enhanced with LinkedIn Learning certificates if available
    const certificates: Certificate[] = [];

    // If the user has LinkedIn Learning courses, we could map them here
    // For now, return empty array and let user add manually
    return certificates;
  }

  /**
   * Map languages (LinkedIn API has limited language support)
   */
  static mapLanguages(linkedinData: LinkedInImportData): Language[] {
    // LinkedIn API doesn't provide language proficiency in basic access
    // Return empty array for manual input
    return [];
  }

  /**
   * Create a comprehensive portfolio summary from LinkedIn data
   */
  static createEnhancedSummary(
    originalSummary: string,
    recommendations: LinkedInRecommendation[],
    posts: LinkedInPost[]
  ): string {
    let enhancedSummary = originalSummary;

    // Add key achievements from recommendations
    if (recommendations.length > 0) {
      enhancedSummary += '\n\n**Key Strengths (from LinkedIn recommendations):**\n';
      const keyPhrases = this.extractKeyPhrasesFromRecommendations(recommendations);
      enhancedSummary += keyPhrases.slice(0, 3).map(phrase => `• ${phrase}`).join('\n');
    }

    // Add thought leadership indicators from posts
    if (posts.length > 0) {
      const postTopics = this.extractTopicsFromPosts(posts);
      if (postTopics.length > 0) {
        enhancedSummary += '\n\n**Areas of Expertise & Thought Leadership:**\n';
        enhancedSummary += postTopics.slice(0, 3).map(topic => `• ${topic}`).join('\n');
      }
    }

    return enhancedSummary;
  }

  /**
   * Extract key phrases from recommendations
   */
  private static extractKeyPhrasesFromRecommendations(recommendations: LinkedInRecommendation[]): string[] {
    const keyPhrases: string[] = [];
    const commonPhrases = [
      'exceptional', 'outstanding', 'innovative', 'strategic', 'leadership',
      'results-driven', 'analytical', 'collaborative', 'creative', 'dedicated',
      'experienced', 'knowledgeable', 'professional', 'reliable', 'skilled'
    ];

    recommendations.forEach(rec => {
      const text = rec.text.toLowerCase();
      commonPhrases.forEach(phrase => {
        if (text.includes(phrase) && !keyPhrases.some(kp => kp.includes(phrase))) {
          // Extract sentence containing the phrase
          const sentences = rec.text.split(/[.!?]/);
          const matchingSentence = sentences.find(s => s.toLowerCase().includes(phrase));
          if (matchingSentence && matchingSentence.length < 150) {
            keyPhrases.push(matchingSentence.trim());
          }
        }
      });
    });

    return keyPhrases.slice(0, 5); // Return top 5
  }

  /**
   * Extract topics from LinkedIn posts
   */
  private static extractTopicsFromPosts(posts: LinkedInPost[]): string[] {
    const topics: string[] = [];
    const techKeywords = [
      'AI', 'artificial intelligence', 'machine learning', 'data science', 'blockchain',
      'cloud computing', 'digital transformation', 'automation', 'cybersecurity',
      'software development', 'agile', 'devops', 'innovation', 'strategy',
      'leadership', 'management', 'growth', 'startup', 'entrepreneurship'
    ];

    posts.forEach(post => {
      const text = post.text.toLowerCase();
      techKeywords.forEach(keyword => {
        if (text.includes(keyword.toLowerCase()) && !topics.includes(keyword)) {
          topics.push(keyword);
        }
      });
    });

    return topics;
  }

  /**
   * Main mapping function - converts all LinkedIn data to portfolio format
   */
  static mapLinkedInToPortfolio(linkedinData: LinkedInImportData): LinkedInMappingResult {
    const personalInfo = this.mapProfile(linkedinData.profile);
    const experience = this.mapPositions(linkedinData.positions);
    const education = this.mapEducation(linkedinData.education);
    const skills = this.mapSkills(linkedinData.skills);
    const certifications = this.mapCertificates(linkedinData);
    const languages = this.mapLanguages(linkedinData);

    // Extract summary from LinkedIn profile
    const getLocalizedText = (localizedObj: any): string => {
      if (!localizedObj?.localized) return '';
      const locale = localizedObj.preferredLocale;
      const key = `${locale.language}_${locale.country}`;
      return localizedObj.localized[key] || Object.values(localizedObj.localized)[0] || '';
    };
    const linkedinSummary = getLocalizedText(linkedinData.profile.summary);

    // Create enhanced summary with recommendations and posts
    const enhancedSummary = this.createEnhancedSummary(
      linkedinSummary || '',
      linkedinData.recommendations,
      linkedinData.posts
    );

    const portfolioData: Partial<ProfessionalPortfolioData> = {
      personalInfo,
      summary: enhancedSummary,
      experience,
      education,
      skills,
      certifications,
      languages,
      // Keep existing theme and projects
    };

    return {
      portfolioData,
      recommendations: linkedinData.recommendations,
      posts: linkedinData.posts,
      unmappedData: {
        // Store any LinkedIn data that couldn't be automatically mapped
        originalProfile: linkedinData.profile,
        unmappedFields: {
          industryName: linkedinData.profile.industryName,
          positionLocations: linkedinData.positions.map(p => p.location?.name).filter(Boolean),
        }
      }
    };
  }

  /**
   * Merge LinkedIn data with existing portfolio data
   */
  static mergeWithExistingPortfolio(
    existingData: ProfessionalPortfolioData,
    linkedinData: LinkedInImportData,
    options: {
      overwritePersonalInfo?: boolean;
      mergeExperience?: boolean;
      mergeEducation?: boolean;
      mergeSkills?: boolean;
      enhanceSummary?: boolean;
    } = {}
  ): ProfessionalPortfolioData {
    const mappedData = this.mapLinkedInToPortfolio(linkedinData);
    
    return {
      ...existingData,
      
      // Personal Info - merge or overwrite based on options
      personalInfo: options.overwritePersonalInfo 
        ? { ...existingData.personalInfo, ...mappedData.portfolioData.personalInfo }
        : {
            ...mappedData.portfolioData.personalInfo,
            ...existingData.personalInfo, // Existing data takes precedence
          },

      // Summary - enhance or keep existing
      summary: options.enhanceSummary
        ? mappedData.portfolioData.summary || existingData.summary
        : existingData.summary,

      // Experience - merge or replace
      experience: options.mergeExperience
        ? [...existingData.experience, ...(mappedData.portfolioData.experience || [])]
        : mappedData.portfolioData.experience || existingData.experience,

      // Education - merge or replace
      education: options.mergeEducation
        ? [...existingData.education, ...(mappedData.portfolioData.education || [])]
        : mappedData.portfolioData.education || existingData.education,

      // Skills - merge unique skills
      skills: options.mergeSkills
        ? this.mergeUniqueSkills(existingData.skills, mappedData.portfolioData.skills || [])
        : mappedData.portfolioData.skills || existingData.skills,

      // Keep existing certifications and languages unless LinkedIn provides them
      certifications: mappedData.portfolioData.certifications?.length 
        ? mappedData.portfolioData.certifications 
        : existingData.certifications,
      
      languages: mappedData.portfolioData.languages?.length
        ? mappedData.portfolioData.languages
        : existingData.languages,

      // Keep existing projects and theme
      projects: existingData.projects,
      theme: existingData.theme,
    };
  }

  /**
   * Merge skills while avoiding duplicates
   */
  private static mergeUniqueSkills(existing: EnhancedSkill[], linkedin: EnhancedSkill[]): EnhancedSkill[] {
    const merged = [...existing];
    
    linkedin.forEach(linkedinSkill => {
      const existingSkill = merged.find(s => 
        s.name.toLowerCase() === linkedinSkill.name.toLowerCase()
      );
      
      if (existingSkill) {
        // Update existing skill if LinkedIn has higher level
        if (linkedinSkill.level > existingSkill.level) {
          existingSkill.level = linkedinSkill.level;
        }
      } else {
        // Add new skill
        merged.push(linkedinSkill);
      }
    });

    return merged;
  }
}

export default LinkedInDataMapper;