/**
 * Document Parser Service
 * Extracts text and structured data from PDF and Word documents
 */

import { ProfessionalPortfolioData } from '../types';

export interface DocumentParseResult {
  success: boolean;
  rawText: string;
  extractedData: Partial<ProfessionalPortfolioData>;
  errors?: string[];
}

export interface ParsedSection {
  type: 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'unknown';
  content: string;
  confidence: number;
}

export class DocumentParserService {
  private static readonly SECTION_KEYWORDS = {
    personal: ['contact', 'personal', 'profile', 'name', 'email', 'phone', 'address'],
    summary: ['summary', 'objective', 'profile', 'about', 'overview'],
    experience: ['experience', 'work', 'employment', 'career', 'professional', 'history'],
    education: ['education', 'academic', 'university', 'college', 'degree', 'school'],
    skills: ['skills', 'technical', 'expertise', 'competencies', 'technologies', 'tools'],
    projects: ['projects', 'portfolio', 'achievements', 'accomplishments'],
    certifications: ['certifications', 'certificates', 'credentials', 'licenses']
  };

  private static readonly EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  private static readonly PHONE_REGEX = /(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/g;
  private static readonly DATE_REGEX = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b|\b\d{1,2}\/\d{1,2}\/\d{2,4}\b|\b\d{4}\s*-\s*\d{4}\b|\b\d{4}\s*to\s*\d{4}\b/gi;

  /**
   * Parse document file (PDF or Word)
   */
  static async parseDocument(file: File): Promise<DocumentParseResult> {
    try {
      const fileType = file.type;
      const fileName = file.name.toLowerCase();
      
      let rawText = '';

      if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        rawText = await this.parsePDF(file);
      } else if (
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileType === 'application/msword' ||
        fileName.endsWith('.docx') ||
        fileName.endsWith('.doc')
      ) {
        rawText = await this.parseWord(file);
      } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
        rawText = await this.parseText(file);
      } else {
        throw new Error(`Unsupported file type: ${fileType}. Please upload a PDF, Word document, or text file.`);
      }

      if (!rawText || rawText.trim().length === 0) {
        throw new Error('No text content could be extracted from the document.');
      }

      // Extract structured data from raw text
      const extractedData = this.extractStructuredData(rawText);

      return {
        success: true,
        rawText,
        extractedData,
      };

    } catch (error) {
      console.error('Document parsing error:', error);
      return {
        success: false,
        rawText: '',
        extractedData: {},
        errors: [error instanceof Error ? error.message : 'Unknown parsing error'],
      };
    }
  }

  /**
   * Parse PDF file (browser-compatible approach)
   */
  private static async parsePDF(file: File): Promise<string> {
    try {
      // For browser compatibility, we'll use a basic approach
      // In a production app, you'd want to use pdf-parse or similar
      
      // Try to read as text first (for simple PDFs)
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const textDecoder = new TextDecoder('utf-8');
      let text = textDecoder.decode(uint8Array);
      
      // Basic PDF text extraction (very limited)
      // This is a fallback - in production, use a proper PDF library
      if (text.includes('%PDF')) {
        // Extract text between stream objects (very basic)
        const streamMatches = text.match(/stream\s*(.*?)\s*endstream/gs);
        if (streamMatches) {
          text = streamMatches
            .map(match => match.replace(/stream\s*|\s*endstream/g, ''))
            .join(' ')
            .replace(/[^\x20-\x7E\n\r]/g, ' ') // Remove non-printable characters
            .replace(/\s+/g, ' ')
            .trim();
        }
      }

      if (text.length < 50) {
        // If we couldn't extract much text, provide instructions
        throw new Error('Could not extract text from PDF. Please try converting your PDF to a Word document or text file, or copy and paste the content directly.');
      }

      return text;
    } catch (error) {
      throw new Error(`PDF parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse Word document (browser-compatible approach)
   */
  private static async parseWord(file: File): Promise<string> {
    try {
      // For browser compatibility without mammoth library
      // We'll provide a helpful error message for now
      throw new Error('Word document parsing is not yet supported in this version. Please convert your resume to PDF or text format, or copy and paste the content directly.');
    } catch (error) {
      throw new Error(`Word document parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse text file
   */
  private static async parseText(file: File): Promise<string> {
    try {
      const text = await file.text();
      return text;
    } catch (error) {
      throw new Error(`Text file parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract structured data from raw text
   */
  private static extractStructuredData(text: string): Partial<ProfessionalPortfolioData> {
    const sections = this.identifySections(text);
    const extractedData: Partial<ProfessionalPortfolioData> = {};

    // Extract personal information
    const personalInfo = this.extractPersonalInfo(text, sections);
    if (personalInfo) {
      extractedData.personalInfo = personalInfo;
    }

    // Extract summary
    const summary = this.extractSummary(text, sections);
    if (summary) {
      extractedData.summary = summary;
    }

    // Extract experience
    const experience = this.extractExperience(text, sections);
    if (experience && experience.length > 0) {
      extractedData.experience = experience;
    }

    // Extract education
    const education = this.extractEducation(text, sections);
    if (education && education.length > 0) {
      extractedData.education = education;
    }

    // Extract skills
    const skills = this.extractSkills(text, sections);
    if (skills && skills.length > 0) {
      extractedData.skills = skills;
    }

    return extractedData;
  }

  /**
   * Identify sections in the document
   */
  private static identifySections(text: string): ParsedSection[] {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const sections: ParsedSection[] = [];
    let currentSection: ParsedSection | null = null;
    let currentContent: string[] = [];

    for (const line of lines) {
      const sectionType = this.identifyLineType(line);
      
      if (sectionType !== 'unknown' && sectionType !== currentSection?.type) {
        // Save previous section
        if (currentSection && currentContent.length > 0) {
          currentSection.content = currentContent.join('\n');
          sections.push(currentSection);
        }
        
        // Start new section
        currentSection = {
          type: sectionType,
          content: line,
          confidence: this.calculateConfidence(line, sectionType)
        };
        currentContent = [line];
      } else if (currentSection) {
        currentContent.push(line);
      } else {
        // No section identified yet, treat as unknown
        sections.push({
          type: 'unknown',
          content: line,
          confidence: 0.1
        });
      }
    }

    // Add final section
    if (currentSection && currentContent.length > 0) {
      currentSection.content = currentContent.join('\n');
      sections.push(currentSection);
    }

    return sections;
  }

  /**
   * Identify the type of a line
   */
  private static identifyLineType(line: string): ParsedSection['type'] {
    const lowercaseLine = line.toLowerCase();
    
    for (const [sectionType, keywords] of Object.entries(this.SECTION_KEYWORDS)) {
      for (const keyword of keywords) {
        if (lowercaseLine.includes(keyword)) {
          return sectionType as ParsedSection['type'];
        }
      }
    }
    
    return 'unknown';
  }

  /**
   * Calculate confidence for section identification
   */
  private static calculateConfidence(line: string, sectionType: string): number {
    const keywords = this.SECTION_KEYWORDS[sectionType as keyof typeof this.SECTION_KEYWORDS] || [];
    const lowercaseLine = line.toLowerCase();
    const matchCount = keywords.filter(keyword => lowercaseLine.includes(keyword)).length;
    
    // Base confidence on keyword matches and line characteristics
    let confidence = Math.min(matchCount / keywords.length, 1.0);
    
    // Boost confidence for section headers (short lines, title case, etc.)
    if (line.length < 50 && line === line.toUpperCase()) {
      confidence += 0.3;
    }
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Extract personal information
   */
  private static extractPersonalInfo(text: string, sections: ParsedSection[]): Partial<ProfessionalPortfolioData['personalInfo']> {
    const personalInfo: Partial<ProfessionalPortfolioData['personalInfo']> = {};
    
    // Extract email
    const emailMatches = text.match(this.EMAIL_REGEX);
    if (emailMatches && emailMatches.length > 0) {
      personalInfo.email = emailMatches[0];
    }
    
    // Extract phone
    const phoneMatches = text.match(this.PHONE_REGEX);
    if (phoneMatches && phoneMatches.length > 0) {
      personalInfo.phone = phoneMatches[0];
    }
    
    // Extract name (first few lines that don't contain keywords)
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i];
      if (
        line.length > 2 && 
        line.length < 50 &&
        !this.EMAIL_REGEX.test(line) &&
        !this.PHONE_REGEX.test(line) &&
        !line.toLowerCase().includes('resume') &&
        !line.toLowerCase().includes('cv')
      ) {
        personalInfo.fullName = line;
        break;
      }
    }
    
    return personalInfo;
  }

  /**
   * Extract summary/objective
   */
  private static extractSummary(text: string, sections: ParsedSection[]): string {
    const summarySection = sections.find(section => section.type === 'summary');
    if (summarySection) {
      return summarySection.content;
    }
    
    // Look for summary-like content in the first few paragraphs
    const paragraphs = text.split('\n\n').map(p => p.trim()).filter(p => p.length > 50);
    if (paragraphs.length > 0) {
      const firstParagraph = paragraphs[0];
      if (firstParagraph.length > 100) {
        return firstParagraph;
      }
    }
    
    return '';
  }

  /**
   * Extract work experience
   */
  private static extractExperience(text: string, sections: ParsedSection[]): any[] {
    const experienceSection = sections.find(section => section.type === 'experience');
    if (!experienceSection) return [];

    const content = experienceSection.content;
    const dateMatches = [...content.matchAll(this.DATE_REGEX)];
    
    // Simple extraction - in production, this would be more sophisticated
    const experiences: any[] = [];
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    
    let currentExp: any = null;
    for (const line of lines) {
      if (this.DATE_REGEX.test(line) && line.length < 100) {
        // Likely a job entry
        if (currentExp) {
          experiences.push(currentExp);
        }
        currentExp = {
          id: `exp-${experiences.length + 1}`,
          title: '',
          position: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
          achievements: [],
          skills: []
        };
        
        // Try to parse the line
        const parts = line.split('|').map(p => p.trim());
        if (parts.length >= 2) {
          currentExp.title = parts[0];
          currentExp.position = parts[0];
          currentExp.company = parts[1];
        }
      } else if (currentExp && line.length > 20) {
        // Add to description
        currentExp.description += (currentExp.description ? '\n' : '') + line;
      }
    }
    
    if (currentExp) {
      experiences.push(currentExp);
    }
    
    return experiences;
  }

  /**
   * Extract education
   */
  private static extractEducation(text: string, sections: ParsedSection[]): any[] {
    const educationSection = sections.find(section => section.type === 'education');
    if (!educationSection) return [];

    // Simple extraction
    const education: any[] = [{
      id: 'edu-1',
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: educationSection.content,
      gpa: '',
      achievements: []
    }];
    
    return education;
  }

  /**
   * Extract skills
   */
  private static extractSkills(text: string, sections: ParsedSection[]): any[] {
    const skillsSection = sections.find(section => section.type === 'skills');
    if (!skillsSection) return [];

    const skillsText = skillsSection.content;
    const skillLines = skillsText.split('\n').filter(line => line.trim().length > 0);
    const skills: any[] = [];
    
    for (let i = 0; i < skillLines.length; i++) {
      const line = skillLines[i].trim();
      if (line.length > 2 && line.length < 100) {
        // Split by common delimiters
        const skillNames = line.split(/[,;•·\-]/g).map(s => s.trim()).filter(s => s.length > 1);
        
        for (const skillName of skillNames) {
          if (skillName.length > 1 && skillName.length < 30) {
            skills.push({
              id: `skill-${skills.length + 1}`,
              name: skillName,
              level: 'Intermediate',
              category: 'Professional',
              years: 2,
              certified: false
            });
          }
        }
      }
    }
    
    return skills;
  }

  /**
   * Generate sample resume text for testing
   */
  static generateSampleResumeText(): string {
    return `John Smith
Senior Software Engineer

Email: john.smith@email.com
Phone: (555) 123-4567
Location: San Francisco, CA

SUMMARY
Experienced software engineer with 8+ years of expertise in full-stack web development, cloud technologies, and team leadership. Proven track record of delivering scalable solutions that serve millions of users and drive business growth.

EXPERIENCE

Senior Software Engineer | TechCorp Inc. | Jan 2021 - Present
• Lead development of microservices architecture serving 10M+ active users
• Mentor junior developers and establish engineering best practices
• Implement CI/CD pipelines that reduced deployment time by 75%
• Technologies: React, Node.js, AWS, PostgreSQL, Docker

Software Engineer | StartupXYZ | Jun 2019 - Dec 2020
• Developed customer-facing web applications using modern JavaScript frameworks
• Collaborated with product team to deliver features ahead of schedule
• Optimized database queries improving application performance by 40%
• Technologies: Vue.js, Python, MongoDB, Redis

Junior Developer | DevSolutions | Aug 2017 - May 2019
• Built responsive user interfaces and RESTful APIs
• Participated in agile development process and code reviews
• Contributed to open-source projects and internal tools
• Technologies: JavaScript, PHP, MySQL

EDUCATION

Bachelor of Science in Computer Science | University of California, Berkeley | 2013 - 2017
• Graduated Magna Cum Laude
• Relevant coursework: Data Structures, Algorithms, Database Systems

SKILLS

Programming Languages: JavaScript, TypeScript, Python, Java, PHP
Frontend: React, Vue.js, HTML5, CSS3, Sass
Backend: Node.js, Express, Django, Spring Boot
Databases: PostgreSQL, MongoDB, MySQL, Redis
Cloud & DevOps: AWS, Docker, Kubernetes, Jenkins
Tools: Git, Webpack, Jest, Postman`;
  }
}

export default DocumentParserService;