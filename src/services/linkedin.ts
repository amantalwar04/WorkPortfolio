import { LinkedInProfile, LinkedInPosition, LinkedInEducation } from '../types';

class LinkedInService {
  private accessToken: string | null = null;
  private baseURL = 'https://api.linkedin.com/v2';
  
  constructor(accessToken?: string) {
    this.accessToken = accessToken || null;
  }
  
  setAccessToken(token: string): void {
    this.accessToken = token;
  }
  
  private async makeRequest(endpoint: string, method = 'GET'): Promise<any> {
    if (!this.accessToken) {
      throw new Error('LinkedIn access token is not configured');
    }
    
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });
      
      if (!response.ok) {
        throw new Error(`LinkedIn API request failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('LinkedIn API request error:', error);
      throw error;
    }
  }
  
  // Get user's basic profile information
  async getProfile(): Promise<LinkedInProfile> {
    try {
      const profileData = await this.makeRequest('/people/~:(id,firstName,lastName,headline,summary,location,industry)');
      
      return {
        id: profileData.id,
        firstName: profileData.firstName?.localized?.en_US || '',
        lastName: profileData.lastName?.localized?.en_US || '',
        headline: profileData.headline?.localized?.en_US || '',
        summary: profileData.summary?.localized?.en_US || '',
        location: profileData.location?.country?.localized?.en_US || '',
        industry: profileData.industry?.localized?.en_US || '',
      };
    } catch (error) {
      console.error('Error fetching LinkedIn profile:', error);
      throw new Error('Failed to fetch LinkedIn profile information');
    }
  }
  
  // Get user's positions (work experience)
  async getPositions(): Promise<LinkedInPosition[]> {
    try {
      const data = await this.makeRequest('/people/~/positions');
      
      return data.elements?.map((position: any) => ({
        id: position.id?.toString() || '',
        title: position.title?.localized?.en_US || '',
        company: position.companyName?.localized?.en_US || '',
        startDate: this.formatLinkedInDate(position.dateRange?.start),
        endDate: position.dateRange?.end ? this.formatLinkedInDate(position.dateRange.end) : undefined,
        current: !position.dateRange?.end,
        description: position.description?.localized?.en_US || '',
        location: position.location?.country?.localized?.en_US || '',
      })) || [];
    } catch (error) {
      console.error('Error fetching LinkedIn positions:', error);
      return [];
    }
  }
  
  // Get user's education
  async getEducation(): Promise<LinkedInEducation[]> {
    try {
      const data = await this.makeRequest('/people/~/educations');
      
      return data.elements?.map((education: any) => ({
        id: education.id?.toString() || '',
        school: education.schoolName?.localized?.en_US || '',
        degree: education.degreeName?.localized?.en_US || '',
        field: education.fieldOfStudy?.localized?.en_US || '',
        startDate: this.formatLinkedInDate(education.dateRange?.start),
        endDate: education.dateRange?.end ? this.formatLinkedInDate(education.dateRange.end) : undefined,
      })) || [];
    } catch (error) {
      console.error('Error fetching LinkedIn education:', error);
      return [];
    }
  }
  
  // Get user's skills (Note: LinkedIn API v2 has limited skill access)
  async getSkills(): Promise<string[]> {
    try {
      // This endpoint might require special permissions
      const data = await this.makeRequest('/people/~/skills');
      
      return data.elements?.map((skill: any) => 
        skill.skill?.localized?.en_US || skill.name?.localized?.en_US || ''
      ).filter(Boolean) || [];
    } catch (error) {
      console.error('Error fetching LinkedIn skills:', error);
      // Return empty array if skills can't be fetched
      return [];
    }
  }
  
  // Get complete LinkedIn profile with all data
  async getCompleteProfile(): Promise<LinkedInProfile> {
    try {
      const [profile, positions, educations, skills] = await Promise.allSettled([
        this.getProfile(),
        this.getPositions(),
        this.getEducation(),
        this.getSkills(),
      ]);
      
      const baseProfile = profile.status === 'fulfilled' ? profile.value : {
        id: '',
        firstName: '',
        lastName: '',
      };
      
      return {
        ...baseProfile,
        positions: positions.status === 'fulfilled' ? positions.value : [],
        educations: educations.status === 'fulfilled' ? educations.value : [],
        skills: skills.status === 'fulfilled' ? skills.value : [],
      };
    } catch (error) {
      console.error('Error fetching complete LinkedIn profile:', error);
      throw new Error('Failed to fetch complete LinkedIn profile');
    }
  }
  
  // Helper method to format LinkedIn date objects
  private formatLinkedInDate(dateObj: any): string {
    if (!dateObj) return '';
    
    const { year, month } = dateObj;
    if (year && month) {
      return `${year}-${month.toString().padStart(2, '0')}-01`;
    } else if (year) {
      return `${year}-01-01`;
    }
    
    return '';
  }
  
  // Validate LinkedIn OAuth token
  async validateToken(): Promise<boolean> {
    try {
      await this.makeRequest('/people/~:(id)');
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // LinkedIn OAuth URL generator (for frontend integration)
  static generateOAuthURL(clientId: string, redirectUri: string, state?: string): string {
    const scope = encodeURIComponent('r_liteprofile r_emailaddress w_member_social');
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      state: state || Math.random().toString(36).substring(7),
      scope,
    });
    
    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  }
  
  // Exchange authorization code for access token
  static async exchangeCodeForToken(
    code: string,
    clientId: string,
    clientSecret: string,
    redirectUri: string
  ): Promise<{ accessToken: string; expiresIn: number }> {
    try {
      const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to exchange code for token');
      }
      
      const data = await response.json();
      
      return {
        accessToken: data.access_token,
        expiresIn: data.expires_in,
      };
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw new Error('Failed to authenticate with LinkedIn');
    }
  }
  
  // Extract data for portfolio conversion
  static convertToPortfolioData(linkedinProfile: LinkedInProfile) {
    const experience = linkedinProfile.positions?.map(pos => ({
      id: pos.id,
      company: pos.company,
      position: pos.title,
      description: pos.description || '',
      startDate: pos.startDate,
      endDate: pos.endDate,
      current: pos.current,
      location: pos.location,
      skills: [], // LinkedIn doesn't provide position-specific skills
      achievements: [],
    })) || [];
    
    const education = linkedinProfile.educations?.map(edu => ({
      id: edu.id,
      institution: edu.school,
      degree: edu.degree || '',
      field: edu.field || '',
      startDate: edu.startDate,
      endDate: edu.endDate,
      achievements: [],
    })) || [];
    
    const skills = linkedinProfile.skills?.map((skill, index) => ({
      id: `linkedin-skill-${index}`,
      name: skill,
      category: 'other' as const,
      level: 'intermediate' as const,
    })) || [];
    
    return {
      experience,
      education,
      skills,
      bio: linkedinProfile.summary || '',
      headline: linkedinProfile.headline || '',
    };
  }
}

export const linkedinService = new LinkedInService();
export default LinkedInService;