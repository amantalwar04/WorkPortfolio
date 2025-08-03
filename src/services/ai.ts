import { AIAssistantResponse } from '../types';

class AIService {
  private apiKey: string | null = null;
  private baseURL = 'https://api.openai.com/v1';
  
  constructor(apiKey?: string) {
    this.apiKey = apiKey || null;
  }
  
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }
  
  private async makeRequest(endpoint: string, data: any): Promise<any> {
    if (!this.apiKey) {
      throw new Error('AI API key is not configured');
    }
    
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('AI API request error:', error);
      throw error;
    }
  }
  
  // Improve project descriptions using AI
  async improveProjectDescription(description: string, projectName: string, technologies: string[]): Promise<AIAssistantResponse> {
    const prompt = `
    Improve this project description to be more professional and engaging for a portfolio:
    
    Project: ${projectName}
    Technologies: ${technologies.join(', ')}
    Current Description: ${description}
    
    Make it:
    - Professional and concise
    - Highlight key features and achievements
    - Mention the impact or problem it solves
    - Include technical skills demonstrated
    - Keep it under 150 words
    `;
    
    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional portfolio writer. Create compelling, professional descriptions that highlight technical skills and achievements.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });
      
      const improved = response.choices[0]?.message?.content?.trim() || description;
      
      return {
        original: description,
        improved,
        suggestions: this.extractSuggestions(improved),
        confidence: 0.8,
      };
    } catch (error) {
      return this.getFallbackResponse(description, 'improve-description');
    }
  }
  
  // Generate professional bio using AI
  async generateProfessionalBio(userInfo: any): Promise<AIAssistantResponse> {
    const prompt = `
    Create a professional bio for a portfolio website using this information:
    
    Name: ${userInfo.name}
    Role/Title: ${userInfo.title || 'Developer'}
    Skills: ${userInfo.skills?.join(', ') || 'Software Development'}
    Experience: ${userInfo.experience || 'Experienced'}
    Location: ${userInfo.location || ''}
    Interests: ${userInfo.interests?.join(', ') || ''}
    
    Make it:
    - Professional yet personable
    - 2-3 sentences
    - Highlight key strengths
    - Include a call to action or collaboration interest
    `;
    
    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional copywriter specializing in personal branding and portfolio content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.8,
      });
      
      const improved = response.choices[0]?.message?.content?.trim() || '';
      
      return {
        original: userInfo.bio || '',
        improved,
        suggestions: [],
        confidence: 0.8,
      };
    } catch (error) {
      return this.getFallbackResponse(userInfo.bio || '', 'write-bio');
    }
  }
  
  // Optimize keywords for SEO
  async optimizeKeywords(content: string, field: string): Promise<AIAssistantResponse> {
    const prompt = `
    Analyze this ${field} content and suggest SEO-optimized keywords:
    
    Content: ${content}
    
    Provide:
    - Primary keywords (3-5)
    - Secondary keywords (5-8)
    - Long-tail keywords (3-5)
    - Industry-specific terms
    
    Focus on professional development, tech skills, and career growth keywords.
    `;
    
    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO specialist focused on professional portfolios and career development.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.5,
      });
      
      const suggestions = this.parseKeywordSuggestions(response.choices[0]?.message?.content || '');
      
      return {
        original: content,
        improved: content,
        suggestions,
        confidence: 0.7,
      };
    } catch (error) {
      return this.getFallbackResponse(content, 'optimize-keywords');
    }
  }
  
  // Generate skill suggestions based on projects and experience
  async suggestSkills(projects: any[], experience: any[]): Promise<string[]> {
    const prompt = `
    Based on these projects and experience, suggest relevant technical skills:
    
    Projects: ${JSON.stringify(projects.map(p => ({ name: p.title, tech: p.technologies })))}
    Experience: ${JSON.stringify(experience.map(e => ({ role: e.position, company: e.company })))}
    
    Suggest skills in categories:
    - Programming Languages
    - Frameworks/Libraries
    - Tools & Technologies
    - Soft Skills
    
    Return as a comma-separated list.
    `;
    
    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a career advisor specializing in technology roles and skill development.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.6,
      });
      
      const content = response.choices[0]?.message?.content || '';
      return this.parseSkillSuggestions(content);
    } catch (error) {
      return this.getFallbackSkills();
    }
  }
  
  // Improve resume content for ATS optimization
  async optimizeResumeContent(content: string, jobTitle: string): Promise<AIAssistantResponse> {
    const prompt = `
    Optimize this resume content for ATS (Applicant Tracking System) and ${jobTitle} role:
    
    Content: ${content}
    
    Make it:
    - ATS-friendly with relevant keywords
    - Action-oriented with strong verbs
    - Quantified with metrics where possible
    - Tailored for ${jobTitle} position
    - Professional and concise
    `;
    
    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume writer with expertise in ATS optimization and modern hiring practices.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.7,
      });
      
      const improved = response.choices[0]?.message?.content?.trim() || content;
      
      return {
        original: content,
        improved,
        suggestions: this.extractATSSuggestions(improved),
        confidence: 0.8,
      };
    } catch (error) {
      return this.getFallbackResponse(content, 'optimize-resume');
    }
  }
  
  // Helper methods
  private extractSuggestions(content: string): string[] {
    // Extract actionable suggestions from AI response
    const suggestions = [];
    if (content.includes('highlight')) suggestions.push('Consider highlighting key achievements');
    if (content.includes('metric')) suggestions.push('Add quantifiable metrics');
    if (content.includes('impact')) suggestions.push('Emphasize project impact');
    return suggestions;
  }
  
  private parseKeywordSuggestions(content: string): string[] {
    // Parse keyword suggestions from AI response
    const keywords = content.match(/[\w\s-]+(?=,|\n|$)/g) || [];
    return keywords.map(k => k.trim()).filter(k => k.length > 2);
  }
  
  private parseSkillSuggestions(content: string): string[] {
    // Parse skill suggestions from AI response
    const skills = content.split(',').map(s => s.trim()).filter(s => s.length > 0);
    return skills.slice(0, 20); // Limit to 20 suggestions
  }
  
  private extractATSSuggestions(content: string): string[] {
    return [
      'Use industry-standard keywords',
      'Include quantifiable achievements',
      'Use action verbs to start bullet points',
      'Keep formatting simple for ATS parsing'
    ];
  }
  
  private getFallbackResponse(original: string, type: string): AIAssistantResponse {
    const fallbackSuggestions = {
      'improve-description': ['Add more technical details', 'Include project impact', 'Mention key technologies'],
      'write-bio': ['Highlight key skills', 'Include years of experience', 'Add personal interests'],
      'optimize-keywords': ['Research industry keywords', 'Include skill variations', 'Add location-based terms'],
      'optimize-resume': ['Use action verbs', 'Add quantifiable metrics', 'Include relevant keywords'],
    };
    
    return {
      original,
      improved: original,
      suggestions: fallbackSuggestions[type as keyof typeof fallbackSuggestions] || [],
      confidence: 0.3,
    };
  }
  
  private getFallbackSkills(): string[] {
    return [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
      'Git', 'AWS', 'Docker', 'MongoDB', 'PostgreSQL',
      'Problem Solving', 'Team Collaboration', 'Communication'
    ];
  }
}

export const aiService = new AIService();
export default AIService;