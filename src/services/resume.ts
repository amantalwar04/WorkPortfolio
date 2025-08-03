import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { User, Experience, Education, Skill, Project, Certificate, ResumeData } from '../types';

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'modern' | 'classic' | 'creative' | 'ats-friendly';
}

class ResumeService {
  private templates: ResumeTemplate[] = [
    {
      id: 'modern-tech',
      name: 'Modern Tech',
      description: 'Clean, modern design perfect for tech professionals',
      preview: '/assets/templates/modern-tech.jpg',
      category: 'modern'
    },
    {
      id: 'classic-professional',
      name: 'Classic Professional',
      description: 'Traditional layout suitable for all industries',
      preview: '/assets/templates/classic-professional.jpg',
      category: 'classic'
    },
    {
      id: 'creative-designer',
      name: 'Creative Designer',
      description: 'Eye-catching design for creative professionals',
      preview: '/assets/templates/creative-designer.jpg',
      category: 'creative'
    },
    {
      id: 'ats-optimized',
      name: 'ATS Optimized',
      description: 'Simple format optimized for applicant tracking systems',
      preview: '/assets/templates/ats-optimized.jpg',
      category: 'ats-friendly'
    }
  ];
  
  getTemplates(): ResumeTemplate[] {
    return this.templates;
  }
  
  getTemplateById(id: string): ResumeTemplate | undefined {
    return this.templates.find(template => template.id === id);
  }
  
  // Generate HTML resume from template
  generateHTMLResume(data: ResumeData, templateId: string): string {
    const template = this.getTemplateById(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }
    
    switch (templateId) {
      case 'modern-tech':
        return this.generateModernTechHTML(data);
      case 'classic-professional':
        return this.generateClassicProfessionalHTML(data);
      case 'creative-designer':
        return this.generateCreativeDesignerHTML(data);
      case 'ats-optimized':
        return this.generateATSOptimizedHTML(data);
      default:
        return this.generateModernTechHTML(data);
    }
  }
  
  // Generate PDF from HTML element
  async generatePDFFromElement(element: HTMLElement, filename: string): Promise<Blob> {
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      return pdf.output('blob');
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }
  
  // Generate PDF directly from data
  async generatePDFFromData(data: ResumeData, templateId: string, filename: string): Promise<Blob> {
    try {
      const html = this.generateHTMLResume(data, templateId);
      
      // Create temporary element
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '794px'; // A4 width in pixels at 96 DPI
      document.body.appendChild(tempDiv);
      
      const blob = await this.generatePDFFromElement(tempDiv, filename);
      
      // Cleanup
      document.body.removeChild(tempDiv);
      
      return blob;
    } catch (error) {
      console.error('Error generating PDF from data:', error);
      throw new Error('Failed to generate PDF from data');
    }
  }
  
  // Download PDF
  downloadPDF(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  
  // Modern Tech Template
  private generateModernTechHTML(data: ResumeData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Arial', sans-serif; line-height: 1.4; color: #333; }
          .resume { max-width: 794px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; }
          .header h1 { font-size: 36px; margin-bottom: 10px; }
          .header p { font-size: 18px; opacity: 0.9; }
          .contact-info { margin-top: 20px; display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
          .contact-item { font-size: 14px; }
          .main-content { display: flex; }
          .sidebar { width: 300px; background: #f8f9fa; padding: 30px; }
          .content { flex: 1; padding: 30px; }
          .section { margin-bottom: 30px; }
          .section h2 { color: #667eea; font-size: 22px; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 5px; }
          .experience-item, .education-item, .project-item { margin-bottom: 20px; }
          .item-header { display: flex; justify-content: between; align-items: center; margin-bottom: 5px; }
          .item-title { font-weight: bold; font-size: 16px; }
          .item-date { color: #666; font-size: 14px; }
          .item-company { color: #667eea; font-size: 14px; }
          .item-description { font-size: 14px; margin-top: 5px; }
          .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; }
          .skill-item { background: #e9ecef; padding: 8px 12px; border-radius: 20px; text-align: center; font-size: 12px; }
          .skill-advanced { background: #667eea; color: white; }
          .skill-intermediate { background: #6c757d; color: white; }
        </style>
      </head>
      <body>
        <div class="resume">
          ${this.generateHeader(data)}
          <div class="main-content">
            <div class="sidebar">
              ${this.generateSkillsSection(data.skills)}
              ${this.generateEducationSection(data.education)}
              ${this.generateCertificatesSection(data.certificates)}
            </div>
            <div class="content">
              ${data.summary ? this.generateSummarySection(data.summary) : ''}
              ${this.generateExperienceSection(data.experience)}
              ${this.generateProjectsSection(data.projects)}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
  
  // Classic Professional Template
  private generateClassicProfessionalHTML(data: ResumeData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Times New Roman', serif; line-height: 1.5; color: #000; }
          .resume { max-width: 794px; margin: 0 auto; background: white; padding: 40px; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { font-size: 28px; margin-bottom: 10px; letter-spacing: 1px; }
          .header .contact { font-size: 14px; }
          .section { margin-bottom: 25px; }
          .section h2 { font-size: 18px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
          .item { margin-bottom: 15px; }
          .item-header { margin-bottom: 5px; }
          .item-title { font-weight: bold; }
          .item-details { font-style: italic; }
          .item-description { margin-top: 5px; }
          .skills-list { columns: 2; column-gap: 30px; }
          .skill-item { break-inside: avoid; margin-bottom: 5px; }
        </style>
      </head>
      <body>
        <div class="resume">
          ${this.generateClassicHeader(data)}
          ${data.summary ? this.generateSummarySection(data.summary) : ''}
          ${this.generateExperienceSection(data.experience)}
          ${this.generateEducationSection(data.education)}
          ${this.generateSkillsSection(data.skills)}
          ${this.generateProjectsSection(data.projects)}
        </div>
      </body>
      </html>
    `;
  }
  
  // ATS Optimized Template
  private generateATSOptimizedHTML(data: ResumeData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; line-height: 1.4; color: #000; font-size: 12px; }
          .resume { max-width: 794px; margin: 0 auto; background: white; padding: 30px; }
          .header { margin-bottom: 20px; }
          .header h1 { font-size: 20px; margin-bottom: 5px; }
          .contact-info { margin-bottom: 15px; }
          .section { margin-bottom: 20px; }
          .section h2 { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
          .item { margin-bottom: 12px; }
          .item-title { font-weight: bold; }
          .item-company { margin-bottom: 2px; }
          .item-dates { margin-bottom: 5px; }
          .skills-list { }
          .skill-category { margin-bottom: 8px; }
          .skill-category strong { margin-right: 10px; }
        </style>
      </head>
      <body>
        <div class="resume">
          ${this.generateATSHeader(data)}
          ${data.summary ? this.generateSummarySection(data.summary) : ''}
          ${this.generateExperienceSection(data.experience)}
          ${this.generateEducationSection(data.education)}
          ${this.generateATSSkillsSection(data.skills)}
          ${this.generateProjectsSection(data.projects)}
        </div>
      </body>
      </html>
    `;
  }
  
  // Creative Designer Template
  private generateCreativeDesignerHTML(data: ResumeData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Helvetica', sans-serif; line-height: 1.4; color: #333; }
          .resume { max-width: 794px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; padding: 40px; position: relative; overflow: hidden; }
          .header::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat; }
          .header-content { position: relative; z-index: 1; }
          .header h1 { font-size: 32px; margin-bottom: 10px; }
          .header p { font-size: 16px; opacity: 0.9; }
          .main-content { padding: 30px; }
          .section { margin-bottom: 30px; }
          .section h2 { color: #ff6b6b; font-size: 24px; margin-bottom: 15px; position: relative; }
          .section h2::after { content: ''; position: absolute; bottom: -5px; left: 0; width: 50px; height: 3px; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); }
          .creative-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
          .creative-item { background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #ff6b6b; }
        </style>
      </head>
      <body>
        <div class="resume">
          ${this.generateCreativeHeader(data)}
          <div class="main-content">
            ${data.summary ? this.generateSummarySection(data.summary) : ''}
            ${this.generateExperienceSection(data.experience)}
            ${this.generateProjectsSection(data.projects)}
            ${this.generateSkillsSection(data.skills)}
            ${this.generateEducationSection(data.education)}
          </div>
        </div>
      </body>
      </html>
    `;
  }
  
  // Helper methods for generating sections
  private generateHeader(data: ResumeData): string {
    return `
      <div class="header">
        <h1>${data.user.name}</h1>
        <p>${data.user.bio || 'Software Developer'}</p>
        <div class="contact-info">
          ${data.user.email ? `<div class="contact-item">📧 ${data.user.email}</div>` : ''}
          ${data.user.whatsapp ? `<div class="contact-item">📱 ${data.user.whatsapp}</div>` : ''}
          ${data.user.location ? `<div class="contact-item">📍 ${data.user.location}</div>` : ''}
          ${data.user.linkedin ? `<div class="contact-item">💼 LinkedIn</div>` : ''}
        </div>
      </div>
    `;
  }
  
  private generateClassicHeader(data: ResumeData): string {
    return `
      <div class="header">
        <h1>${data.user.name}</h1>
        <div class="contact">
          ${data.user.email || ''} ${data.user.whatsapp ? `• ${data.user.whatsapp}` : ''} ${data.user.location ? `• ${data.user.location}` : ''}
        </div>
      </div>
    `;
  }
  
  private generateATSHeader(data: ResumeData): string {
    return `
      <div class="header">
        <h1>${data.user.name}</h1>
        <div class="contact-info">
          Email: ${data.user.email || ''}<br>
          Phone: ${data.user.whatsapp || ''}<br>
          Location: ${data.user.location || ''}<br>
          LinkedIn: ${data.user.linkedin || ''}
        </div>
      </div>
    `;
  }
  
  private generateCreativeHeader(data: ResumeData): string {
    return `
      <div class="header">
        <div class="header-content">
          <h1>${data.user.name}</h1>
          <p>${data.user.bio || 'Creative Professional'}</p>
        </div>
      </div>
    `;
  }
  
  private generateSummarySection(summary: string): string {
    return `
      <div class="section">
        <h2>Summary</h2>
        <p>${summary}</p>
      </div>
    `;
  }
  
  private generateExperienceSection(experience: Experience[]): string {
    if (!experience.length) return '';
    
    const items = experience.map(exp => `
      <div class="experience-item item">
        <div class="item-header">
          <div class="item-title">${exp.position}</div>
          <div class="item-date">${this.formatDateRange(exp.startDate, exp.endDate, exp.current)}</div>
        </div>
        <div class="item-company">${exp.company} ${exp.location ? `• ${exp.location}` : ''}</div>
        ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
        ${exp.achievements.length ? `<ul class="achievements">${exp.achievements.map(a => `<li>${a}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('');
    
    return `
      <div class="section">
        <h2>Experience</h2>
        ${items}
      </div>
    `;
  }
  
  private generateEducationSection(education: Education[]): string {
    if (!education.length) return '';
    
    const items = education.map(edu => `
      <div class="education-item item">
        <div class="item-title">${edu.degree} in ${edu.field}</div>
        <div class="item-company">${edu.institution}</div>
        <div class="item-date">${this.formatDateRange(edu.startDate, edu.endDate)}</div>
        ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
      </div>
    `).join('');
    
    return `
      <div class="section">
        <h2>Education</h2>
        ${items}
      </div>
    `;
  }
  
  private generateSkillsSection(skills: Skill[]): string {
    if (!skills.length) return '';
    
    const skillsByCategory = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);
    
    const categories = Object.keys(skillsByCategory).map(category => {
      const categorySkills = skillsByCategory[category].map(skill => 
        `<div class="skill-item skill-${skill.level}">${skill.name}</div>`
      ).join('');
      
      return `
        <div class="skill-category">
          <h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
          <div class="skills-grid">${categorySkills}</div>
        </div>
      `;
    }).join('');
    
    return `
      <div class="section">
        <h2>Skills</h2>
        ${categories}
      </div>
    `;
  }
  
  private generateATSSkillsSection(skills: Skill[]): string {
    if (!skills.length) return '';
    
    const skillsByCategory = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill.name);
      return acc;
    }, {} as Record<string, string[]>);
    
    const categories = Object.keys(skillsByCategory).map(category => 
      `<div class="skill-category"><strong>${category}:</strong> ${skillsByCategory[category].join(', ')}</div>`
    ).join('');
    
    return `
      <div class="section">
        <h2>Skills</h2>
        <div class="skills-list">${categories}</div>
      </div>
    `;
  }
  
  private generateProjectsSection(projects: Project[]): string {
    if (!projects.length) return '';
    
    const items = projects.slice(0, 5).map(project => `
      <div class="project-item item">
        <div class="item-title">${project.title}</div>
        <div class="item-description">${project.description}</div>
        <div class="technologies">Technologies: ${project.technologies.join(', ')}</div>
        ${project.github_url ? `<div>GitHub: ${project.github_url}</div>` : ''}
        ${project.live_url ? `<div>Live Demo: ${project.live_url}</div>` : ''}
      </div>
    `).join('');
    
    return `
      <div class="section">
        <h2>Projects</h2>
        ${items}
      </div>
    `;
  }
  
  private generateCertificatesSection(certificates: Certificate[]): string {
    if (!certificates.length) return '';
    
    const items = certificates.map(cert => `
      <div class="certificate-item item">
        <div class="item-title">${cert.name}</div>
        <div class="item-company">${cert.issuer}</div>
        <div class="item-date">${this.formatDate(cert.issueDate)}</div>
      </div>
    `).join('');
    
    return `
      <div class="section">
        <h2>Certificates</h2>
        ${items}
      </div>
    `;
  }
  
  private formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  }
  
  private formatDateRange(startDate: string, endDate?: string, current = false): string {
    const start = this.formatDate(startDate);
    if (current) return `${start} - Present`;
    if (endDate) return `${start} - ${this.formatDate(endDate)}`;
    return start;
  }
}

export const resumeService = new ResumeService();
export default ResumeService;