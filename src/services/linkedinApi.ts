/**
 * LinkedIn API Integration Service
 * Handles OAuth authentication and data fetching from LinkedIn API v2
 */

export interface LinkedInProfile {
  id: string;
  firstName: {
    localized: { [key: string]: string };
    preferredLocale: { country: string; language: string };
  };
  lastName: {
    localized: { [key: string]: string };
    preferredLocale: { country: string; language: string };
  };
  headline: {
    localized: { [key: string]: string };
    preferredLocale: { country: string; language: string };
  };
  summary: {
    localized: { [key: string]: string };
    preferredLocale: { country: string; language: string };
  };
  profilePicture?: {
    displayImage: string;
  };
  location?: {
    name: string;
  };
  industryName?: string;
}

export interface LinkedInPosition {
  id: number;
  title: string;
  companyName: string;
  description?: string;
  startDate: {
    month?: number;
    year: number;
  };
  endDate?: {
    month?: number;
    year: number;
  };
  isCurrent: boolean;
  location?: {
    name: string;
  };
}

export interface LinkedInEducation {
  id: number;
  schoolName: string;
  degreeName?: string;
  fieldOfStudy?: string;
  startDate?: {
    year: number;
  };
  endDate?: {
    year: number;
  };
  description?: string;
}

export interface LinkedInSkill {
  name: string;
  endorsementCount?: number;
}

export interface LinkedInRecommendation {
  id: string;
  text: string;
  recommender: {
    firstName: string;
    lastName: string;
    headline?: string;
    profilePicture?: string;
  };
  relationshipToRecommendee: string;
  createdAt: string;
}

export interface LinkedInPost {
  id: string;
  text: string;
  publishedAt: string;
  author: {
    name: string;
  };
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
  url?: string;
}

export interface LinkedInImportData {
  profile: LinkedInProfile;
  positions: LinkedInPosition[];
  education: LinkedInEducation[];
  skills: LinkedInSkill[];
  recommendations: LinkedInRecommendation[];
  posts: LinkedInPost[];
}

export class LinkedInApiService {
  private static readonly CLIENT_ID = process.env.REACT_APP_LINKEDIN_CLIENT_ID || '';
  private static readonly CLIENT_SECRET = process.env.REACT_APP_LINKEDIN_CLIENT_SECRET || '';
  private static readonly REDIRECT_URI = process.env.REACT_APP_LINKEDIN_REDIRECT_URI || 
    `${window.location.origin}/linkedin-callback`;
  private static readonly SCOPE = 'r_liteprofile r_emailaddress r_member_social';
  private static readonly API_BASE = 'https://api.linkedin.com/v2';

  /**
   * Check if LinkedIn API is properly configured
   */
  static isConfigured(): boolean {
    return !!(this.CLIENT_ID && this.CLIENT_ID.trim() !== '');
  }

  /**
   * Get configuration status and error message
   */
  static getConfigurationStatus(): { isConfigured: boolean; error?: string; instructions?: string } {
    if (!this.CLIENT_ID || this.CLIENT_ID.trim() === '') {
      return {
        isConfigured: false,
        error: 'LinkedIn Client ID is not configured',
        instructions: 'LinkedIn integration requires a LinkedIn Developer App. Please follow the setup instructions in the documentation.'
      };
    }
    return { isConfigured: true };
  }

  private accessToken: string | null = null;

  /**
   * Initialize OAuth flow for LinkedIn authentication
   */
  static initiateOAuth(): void {
    const configStatus = this.getConfigurationStatus();
    if (!configStatus.isConfigured) {
      throw new Error(configStatus.error || 'LinkedIn integration is not properly configured');
    }

    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('linkedin_oauth_state', state);

    const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', this.CLIENT_ID);
    authUrl.searchParams.append('redirect_uri', this.REDIRECT_URI);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('scope', this.SCOPE);

    window.open(authUrl.toString(), 'linkedin-auth', 'width=600,height=600');
  }

  /**
   * Handle OAuth callback and exchange code for access token
   */
  async handleOAuthCallback(code: string, state: string): Promise<boolean> {
    try {
      const savedState = localStorage.getItem('linkedin_oauth_state');
      if (state !== savedState) {
        throw new Error('Invalid OAuth state parameter');
      }

      const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: LinkedInApiService.REDIRECT_URI,
          client_id: LinkedInApiService.CLIENT_ID,
          client_secret: LinkedInApiService.CLIENT_SECRET,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange OAuth code for access token');
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      
      // Store access token securely (consider encryption in production)
      localStorage.setItem('linkedin_access_token', this.accessToken);
      localStorage.removeItem('linkedin_oauth_state');

      return true;
    } catch (error) {
      console.error('LinkedIn OAuth error:', error);
      return false;
    }
  }

  /**
   * Set access token from stored value
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('linkedin_access_token');
    }
    return this.accessToken;
  }

  /**
   * Make authenticated API request to LinkedIn
   */
  private async makeApiRequest(endpoint: string): Promise<any> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('No LinkedIn access token available');
    }

    const response = await fetch(`${LinkedInApiService.API_BASE}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, clear it
        localStorage.removeItem('linkedin_access_token');
        this.accessToken = null;
        throw new Error('LinkedIn access token expired. Please re-authenticate.');
      }
      throw new Error(`LinkedIn API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch basic profile information
   */
  async fetchProfile(): Promise<LinkedInProfile> {
    try {
      const profile = await this.makeApiRequest('/people/~:(id,firstName,lastName,headline,summary,profilePicture(displayImage~:playableStreams))');
      return profile;
    } catch (error) {
      console.error('Error fetching LinkedIn profile:', error);
      throw error;
    }
  }

  /**
   * Fetch work experience positions
   */
  async fetchPositions(): Promise<LinkedInPosition[]> {
    try {
      // Note: LinkedIn API v2 has limited access to positions
      // This might require LinkedIn Partner Program access
      const positions = await this.makeApiRequest('/people/~/positions');
      return positions.values || [];
    } catch (error) {
      console.error('Error fetching LinkedIn positions:', error);
      // Return empty array if not accessible
      return [];
    }
  }

  /**
   * Fetch education information
   */
  async fetchEducation(): Promise<LinkedInEducation[]> {
    try {
      const education = await this.makeApiRequest('/people/~/educations');
      return education.values || [];
    } catch (error) {
      console.error('Error fetching LinkedIn education:', error);
      return [];
    }
  }

  /**
   * Fetch skills information
   */
  async fetchSkills(): Promise<LinkedInSkill[]> {
    try {
      const skills = await this.makeApiRequest('/people/~/skills');
      return skills.values || [];
    } catch (error) {
      console.error('Error fetching LinkedIn skills:', error);
      return [];
    }
  }

  /**
   * Fetch recommendations (requires special permissions)
   */
  async fetchRecommendations(): Promise<LinkedInRecommendation[]> {
    try {
      // Note: This requires special LinkedIn API access
      const recommendations = await this.makeApiRequest('/people/~/recommendations-received');
      return recommendations.values || [];
    } catch (error) {
      console.error('Error fetching LinkedIn recommendations:', error);
      return [];
    }
  }

  /**
   * Fetch recent posts/shares
   */
  async fetchPosts(): Promise<LinkedInPost[]> {
    try {
      // Note: This requires r_member_social permission and may have limitations
      const posts = await this.makeApiRequest('/people/~/shares?count=10');
      return posts.values || [];
    } catch (error) {
      console.error('Error fetching LinkedIn posts:', error);
      return [];
    }
  }

  /**
   * Import all available LinkedIn data
   */
  async importAllData(): Promise<LinkedInImportData> {
    try {
      const [profile, positions, education, skills, recommendations, posts] = await Promise.allSettled([
        this.fetchProfile(),
        this.fetchPositions(),
        this.fetchEducation(),
        this.fetchSkills(),
        this.fetchRecommendations(),
        this.fetchPosts(),
      ]);

      return {
        profile: profile.status === 'fulfilled' ? profile.value : {} as LinkedInProfile,
        positions: positions.status === 'fulfilled' ? positions.value : [],
        education: education.status === 'fulfilled' ? education.value : [],
        skills: skills.status === 'fulfilled' ? skills.value : [],
        recommendations: recommendations.status === 'fulfilled' ? recommendations.value : [],
        posts: posts.status === 'fulfilled' ? posts.value : [],
      };
    } catch (error) {
      console.error('Error importing LinkedIn data:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated with LinkedIn
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Clear LinkedIn authentication
   */
  logout(): void {
    this.accessToken = null;
    localStorage.removeItem('linkedin_access_token');
  }
}

export default LinkedInApiService;