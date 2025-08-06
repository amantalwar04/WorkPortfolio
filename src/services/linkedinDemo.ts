/**
 * LinkedIn Demo Service
 * Provides sample LinkedIn data for demonstration purposes
 * when LinkedIn API is not configured
 */

import { LinkedInImportData, LinkedInProfile, LinkedInPosition, LinkedInEducation, LinkedInSkill, LinkedInRecommendation, LinkedInPost } from './linkedinApi';

export class LinkedInDemoService {
  /**
   * Generate sample LinkedIn profile data
   */
  static generateSampleProfile(): LinkedInProfile {
    return {
      id: 'demo-user-12345',
      firstName: {
        localized: { 'en_US': 'John' },
        preferredLocale: { country: 'US', language: 'en' }
      },
      lastName: {
        localized: { 'en_US': 'Doe' },
        preferredLocale: { country: 'US', language: 'en' }
      },
      headline: {
        localized: { 'en_US': 'Senior Software Engineer | Full-Stack Developer | Tech Lead' },
        preferredLocale: { country: 'US', language: 'en' }
      },
      summary: {
        localized: { 
          'en_US': 'Passionate software engineer with 8+ years of experience building scalable web applications and leading development teams.\n\nSpecializing in React, Node.js, and cloud technologies. Proven track record of delivering high-quality solutions that drive business growth and improve user experiences.\n\nExperienced in agile methodologies, technical mentoring, and cross-functional collaboration.' 
        },
        preferredLocale: { country: 'US', language: 'en' }
      },
      profilePicture: {
        displayImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
      },
      location: {
        name: 'San Francisco, California, United States'
      },
      industryName: 'Software Development'
    };
  }

  /**
   * Generate sample work experience
   */
  static generateSamplePositions(): LinkedInPosition[] {
    return [
      {
        id: 1,
        title: 'Senior Software Engineer',
        companyName: 'TechCorp Inc.',
        description: 'Lead development of microservices architecture serving 10M+ users. Mentored junior developers and established best practices for code quality and deployment.',
        startDate: { month: 3, year: 2021 },
        isCurrent: true,
        location: { name: 'San Francisco, CA' }
      },
      {
        id: 2,
        title: 'Software Engineer',
        companyName: 'StartupXYZ',
        description: 'Developed full-stack web applications using React, Node.js, and PostgreSQL. Implemented CI/CD pipelines and reduced deployment time by 75%.',
        startDate: { month: 6, year: 2019 },
        endDate: { month: 2, year: 2021 },
        isCurrent: false,
        location: { name: 'San Francisco, CA' }
      },
      {
        id: 3,
        title: 'Junior Developer',
        companyName: 'DevSolutions LLC',
        description: 'Built responsive web interfaces and RESTful APIs. Collaborated with UX designers to implement pixel-perfect designs.',
        startDate: { month: 8, year: 2017 },
        endDate: { month: 5, year: 2019 },
        isCurrent: false,
        location: { name: 'Austin, TX' }
      }
    ];
  }

  /**
   * Generate sample education
   */
  static generateSampleEducation(): LinkedInEducation[] {
    return [
      {
        id: 1,
        schoolName: 'University of California, Berkeley',
        degreeName: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        startDate: { year: 2013 },
        endDate: { year: 2017 },
        description: 'Graduated Magna Cum Laude. Relevant coursework: Data Structures, Algorithms, Database Systems, Software Engineering.'
      },
      {
        id: 2,
        schoolName: 'Stanford University',
        degreeName: 'Certificate',
        fieldOfStudy: 'Machine Learning',
        startDate: { year: 2020 },
        endDate: { year: 2020 },
        description: 'Online specialization in Machine Learning and AI applications.'
      }
    ];
  }

  /**
   * Generate sample skills
   */
  static generateSampleSkills(): LinkedInSkill[] {
    return [
      { name: 'JavaScript', endorsementCount: 45 },
      { name: 'React', endorsementCount: 38 },
      { name: 'Node.js', endorsementCount: 32 },
      { name: 'TypeScript', endorsementCount: 28 },
      { name: 'Python', endorsementCount: 25 },
      { name: 'AWS', endorsementCount: 22 },
      { name: 'PostgreSQL', endorsementCount: 18 },
      { name: 'Docker', endorsementCount: 15 },
      { name: 'GraphQL', endorsementCount: 12 },
      { name: 'MongoDB', endorsementCount: 10 },
      { name: 'Redis', endorsementCount: 8 },
      { name: 'Kubernetes', endorsementCount: 5 }
    ];
  }

  /**
   * Generate sample recommendations
   */
  static generateSampleRecommendations(): LinkedInRecommendation[] {
    return [
      {
        id: 'rec-1',
        text: 'John is an exceptional software engineer who consistently delivers high-quality solutions. His technical expertise in React and Node.js is outstanding, and his ability to mentor junior developers has been invaluable to our team. He approaches complex problems with creativity and determination, always finding efficient solutions.',
        recommender: {
          firstName: 'Sarah',
          lastName: 'Johnson',
          headline: 'Engineering Manager at TechCorp Inc.',
          profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
        },
        relationshipToRecommendee: 'Sarah managed John directly',
        createdAt: '2023-06-15T10:30:00Z'
      },
      {
        id: 'rec-2',
        text: 'Working with John was a fantastic experience. His deep understanding of full-stack development and his collaborative approach made our project a huge success. He has excellent communication skills and always goes above and beyond to help teammates. Highly recommended!',
        recommender: {
          firstName: 'Michael',
          lastName: 'Chen',
          headline: 'Product Manager at StartupXYZ',
          profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        },
        relationshipToRecommendee: 'Michael worked with John on the same team',
        createdAt: '2023-03-22T14:15:00Z'
      },
      {
        id: 'rec-3',
        text: 'John is a dedicated professional with strong technical skills and leadership qualities. His contributions to our architecture decisions and code reviews significantly improved our development process. He\'s someone you can always count on to deliver excellent work.',
        recommender: {
          firstName: 'Emily',
          lastName: 'Rodriguez',
          headline: 'Senior Developer at TechCorp Inc.',
          profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
        },
        relationshipToRecommendee: 'Emily worked with John on the same team',
        createdAt: '2023-08-10T09:45:00Z'
      }
    ];
  }

  /**
   * Generate sample posts
   */
  static generateSamplePosts(): LinkedInPost[] {
    return [
      {
        id: 'post-1',
        text: 'Excited to share that our team just deployed a new microservices architecture that improved our API response times by 60%! The key was implementing proper caching strategies and optimizing our database queries. #TechLeadership #SoftwareEngineering #Performance',
        publishedAt: '2023-11-15T16:30:00Z',
        author: { name: 'John Doe' },
        engagement: { likes: 127, comments: 23, shares: 15 },
        url: 'https://linkedin.com/posts/demo-post-1'
      },
      {
        id: 'post-2',
        text: 'Just finished mentoring a group of junior developers on React best practices. It\'s amazing to see how quickly they adapt and start building incredible user interfaces. Investing in people is the best investment we can make. #Mentorship #React #WebDevelopment',
        publishedAt: '2023-10-28T11:20:00Z',
        author: { name: 'John Doe' },
        engagement: { likes: 89, comments: 12, shares: 8 },
        url: 'https://linkedin.com/posts/demo-post-2'
      },
      {
        id: 'post-3',
        text: 'Thoughts on the future of AI in software development: While AI tools are becoming incredibly powerful, the human element of understanding business requirements, creative problem-solving, and team collaboration remains irreplaceable. The future is about AI-human collaboration, not replacement. #AI #SoftwareDevelopment #FutureTech',
        publishedAt: '2023-10-10T14:45:00Z',
        author: { name: 'John Doe' },
        engagement: { likes: 156, comments: 34, shares: 22 },
        url: 'https://linkedin.com/posts/demo-post-3'
      }
    ];
  }

  /**
   * Generate complete sample LinkedIn data
   */
  static generateSampleData(): LinkedInImportData {
    return {
      profile: this.generateSampleProfile(),
      positions: this.generateSamplePositions(),
      education: this.generateSampleEducation(),
      skills: this.generateSampleSkills(),
      recommendations: this.generateSampleRecommendations(),
      posts: this.generateSamplePosts()
    };
  }

  /**
   * Simulate data import with delay for realistic experience
   */
  static async importSampleData(): Promise<LinkedInImportData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    return this.generateSampleData();
  }
}

export default LinkedInDemoService;