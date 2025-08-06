import { ProfessionalPortfolioData } from '../types';
import { ProjectInfo } from './githubDeployment';

export interface GeneratedPortfolio {
  html: string;
  metadata: {
    generatedAt: string;
    version: string;
    template?: string;
    repository?: string;
    githubPagesUrl?: string;
  };
}

export class PortfolioGeneratorService {
  /**
   * Convert rich text to HTML while preserving formatting
   */
  private static formatRichText(text: string): string {
    if (!text) return '';
    
    return text
      // Convert line breaks to paragraphs
      .split('\n\n')
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0)
      .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
      .join('\n');
  }

  /**
   * Generate complete portfolio HTML with all features
   */
  static generatePortfolioHTML(
    portfolioData: ProfessionalPortfolioData,
    discoveredProjects: ProjectInfo[] = [],
    options: {
      repository?: string;
      githubPagesUrl?: string;
      template?: 'modern' | 'classic' | 'minimal' | 'professional' | 'executive';
    } = {}
  ): GeneratedPortfolio {
    const template = options.template || 'executive'; // Make executive the default
    
    let html: string;
    
    if (template === 'executive') {
      html = this.generateExecutiveTemplate(portfolioData, discoveredProjects, options);
    } else {
      html = this.generateDefaultTemplate(portfolioData, discoveredProjects, options);
    }

    return {
      html,
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '2.0.0',
        template,
        repository: options.repository,
        githubPagesUrl: options.githubPagesUrl,
      },
    };
  }

  /**
   * Generate Executive Template (based on amantalwar04.github.io/portfolio)
   */
  private static generateExecutiveTemplate(
    portfolioData: ProfessionalPortfolioData,
    discoveredProjects: ProjectInfo[],
    options: any
  ): string {
    const { theme, personalInfo } = portfolioData;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName} - Portfolio</title>
    <meta name="description" content="${portfolioData.summary || `Portfolio of ${personalInfo.fullName}`}">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="https://github.com/favicon.ico">
    
    <!-- Font -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        ${this.generateExecutiveCSS(theme)}
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="header-left">
                    ${personalInfo.avatar ? `<img src="${personalInfo.avatar}" alt="${personalInfo.fullName}" class="avatar">` : ''}
                    <div class="header-info">
                        <h1 class="name">${personalInfo.fullName}</h1>
                        <p class="title">${personalInfo.title}</p>
                        ${personalInfo.location ? `<p class="location"><i class="fas fa-map-marker-alt"></i> ${personalInfo.location}</p>` : ''}
                    </div>
                </div>
                <div class="header-right">
                    <div class="contact-icons">
                        ${personalInfo.email ? `<a href="mailto:${personalInfo.email}" class="contact-icon" title="Email"><i class="fas fa-envelope"></i></a>` : ''}
                        ${personalInfo.phone ? `<a href="tel:${personalInfo.phone}" class="contact-icon" title="Phone"><i class="fas fa-phone"></i></a>` : ''}
                        ${personalInfo.linkedin ? `<a href="${personalInfo.linkedin}" target="_blank" class="contact-icon" title="LinkedIn"><i class="fab fa-linkedin"></i></a>` : ''}
                        ${personalInfo.github ? `<a href="https://github.com/${personalInfo.github}" target="_blank" class="contact-icon" title="GitHub"><i class="fab fa-github"></i></a>` : ''}
                        ${personalInfo.whatsapp ? `<a href="https://wa.me/${personalInfo.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(personalInfo.fullName)}%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20connect!" target="_blank" class="contact-icon whatsapp" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>` : ''}
                        ${personalInfo.website ? `<a href="${personalInfo.website}" target="_blank" class="contact-icon" title="Website"><i class="fas fa-globe"></i></a>` : ''}
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main">
        <div class="container">
            <!-- Summary Section -->
            <section class="summary-section">
                <h2>Summary</h2>
                <div class="summary-content">
                    ${this.formatRichText(portfolioData.summary)}
                </div>
            </section>

            <!-- Career Timeline -->
            ${portfolioData.experience.length > 0 ? `
            <section class="timeline-section">
                <h2>Career Timeline</h2>
                <div class="timeline">
                    ${portfolioData.experience.map((exp, index) => `
                    <div class="timeline-item">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <h3>${exp.title}</h3>
                            <h4>${exp.company}</h4>
                            <p class="timeline-date">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</p>
                            ${exp.description ? `<div class="timeline-description">${this.formatRichText(exp.description)}</div>` : ''}
                            ${exp.achievements && exp.achievements.length > 0 ? `
                            <ul class="achievements">
                                ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                            </ul>
                            ` : ''}
                        </div>
                    </div>
                    `).join('')}
                </div>
            </section>
            ` : ''}

            <!-- Skills, Certifications, Awards Grid -->
            <section class="skills-section">
                <div class="skills-grid">
                    ${portfolioData.skills.length > 0 ? `
                    <div class="skills-column">
                        <h3>Top Skills</h3>
                        <div class="skills-list">
                            ${portfolioData.skills.slice(0, 10).map(skill => `
                            <div class="skill-item">
                                <span class="skill-name">${skill.name}</span>
                                <div class="skill-bar">
                                    <div class="skill-progress" style="width: ${(skill.level / 10) * 100}%"></div>
                                </div>
                            </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}

                    ${portfolioData.certifications.length > 0 ? `
                    <div class="skills-column">
                        <h3>Certifications</h3>
                        <div class="certifications-list">
                            ${portfolioData.certifications.map(cert => `
                            <div class="cert-item">
                                <h4>${cert.name}</h4>
                                <p>${cert.issuer} • ${cert.issueDate}</p>
                                ${cert.url ? `<a href="${cert.url}" target="_blank" class="cert-link">View Credential</a>` : ''}
                            </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}

                    ${portfolioData.languages.length > 0 ? `
                    <div class="skills-column">
                        <h3>Languages</h3>
                        <div class="languages-list">
                            ${portfolioData.languages.map(lang => `
                            <div class="language-item">
                                <span class="language-name">${lang.name}</span>
                                <span class="language-level">${lang.proficiency}</span>
                            </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                </div>
            </section>

            <!-- Education Section -->
            ${portfolioData.education.length > 0 ? `
            <section class="education-section">
                <h2>Education</h2>
                <div class="education-grid">
                    ${portfolioData.education.map(edu => `
                    <div class="education-item">
                        <h3>${edu.degree}</h3>
                        <h4>${edu.institution}</h4>
                        <p class="education-date">${edu.startDate} - ${edu.endDate || 'Present'}</p>
                        ${edu.description ? `<p class="education-description">${edu.description}</p>` : ''}
                    </div>
                    `).join('')}
                </div>
            </section>
            ` : ''}

            <!-- Projects Section -->
            ${discoveredProjects.length > 0 ? `
            <section class="projects-section">
                <h2>Featured Projects</h2>
                <div class="projects-grid">
                    ${discoveredProjects.map(project => `
                    <div class="project-item">
                        ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.name}" class="project-image">` : ''}
                        <div class="project-content">
                            <h3>${project.name}</h3>
                            <p>${project.description}</p>
                            ${project.technologies.length > 0 ? `
                            <div class="project-tech">
                                ${project.technologies.slice(0, 5).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                            </div>
                            ` : ''}
                            <div class="project-links">
                                ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="project-link">Live Demo</a>` : ''}
                                ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" class="project-link">Source Code</a>` : ''}
                            </div>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </section>
            ` : ''}

            <!-- Get In Touch Section -->
            <section class="contact-section">
                <h2>Get In Touch</h2>
                <p>I'm always open to discussing new projects, creative ideas, or opportunities to be part of something exciting. Feel free to reach out.</p>
                
                <div class="contact-methods">
                    ${personalInfo.email ? `
                    <a href="mailto:${personalInfo.email}" class="contact-method">
                        <i class="fas fa-envelope"></i>
                        <span>Contact Me</span>
                    </a>` : ''}
                    
                    ${personalInfo.whatsapp ? `
                    <a href="https://wa.me/${personalInfo.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(personalInfo.fullName)}%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20connect!" target="_blank" class="contact-method whatsapp">
                        <i class="fab fa-whatsapp"></i>
                        <span>WhatsApp</span>
                    </a>` : ''}
                    
                    ${personalInfo.linkedin ? `
                    <a href="${personalInfo.linkedin}" target="_blank" class="contact-method linkedin">
                        <i class="fab fa-linkedin"></i>
                        <span>LinkedIn</span>
                    </a>` : ''}
                </div>
            </section>

            <!-- Demos Section -->
            ${discoveredProjects.length > 0 ? `
            <section class="demos-section">
                <h3>Demos</h3>
                <div class="demos-grid">
                    ${discoveredProjects.slice(0, 6).map(project => `
                    <div class="demo-item">
                        <a href="${project.liveUrl || project.demoUrl || '#'}" target="_blank">
                            ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.name}">` : `<div class="demo-placeholder"><i class="fas fa-code"></i></div>`}
                            <h4>${project.name}</h4>
                        </a>
                    </div>
                    `).join('')}
                </div>
            </section>
            ` : ''}
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${personalInfo.fullName}. All Rights Reserved.</p>
            ${options.repository ? `<p>Built with Portfolio Generator • <a href="https://github.com/${options.repository}" target="_blank">${options.repository}</a></p>` : ''}
        </div>
    </footer>

    <script>
        ${this.generateExecutiveJS()}
    </script>
</body>
</html>`;
  }

  /**
   * Generate Executive Template CSS
   */
  private static generateExecutiveCSS(theme: any): string {
    return `
        /* Executive Template CSS - Based on amantalwar04.github.io/portfolio */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary-color: ${theme.primaryColor};
            --secondary-color: ${theme.secondaryColor};
            --accent-color: ${theme.accentColor || theme.primaryColor};
            --text-color: ${theme.textColor};
            --bg-color: ${theme.backgroundColor};
            --font-family: ${theme.fontFamily || 'Inter, sans-serif'};
            --border-color: #e5e7eb;
            --gray-50: #f9fafb;
            --gray-100: #f3f4f6;
            --gray-600: #4b5563;
            --gray-700: #374151;
            --gray-900: #111827;
        }

        body {
            font-family: var(--font-family);
            line-height: 1.6;
            color: var(--text-color);
            background-color: var(--bg-color);
            font-size: 16px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
        }

        /* Header with Contact Icons */
        .header {
            background: var(--bg-color);
            border-bottom: 1px solid var(--border-color);
            padding: 32px 0;
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 32px;
        }

        .header-left {
            display: flex;
            align-items: flex-start;
            gap: 24px;
        }

        .avatar {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid var(--border-color);
        }

        .header-info h1.name {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--text-color);
            margin-bottom: 8px;
            line-height: 1.2;
        }

        .header-info .title {
            font-size: 1.25rem;
            color: var(--primary-color);
            font-weight: 600;
            margin-bottom: 8px;
        }

        .header-info .location {
            font-size: 1rem;
            color: var(--gray-600);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .contact-icons {
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
        }

        .contact-icon {
            width: 48px;
            height: 48px;
            background: var(--gray-100);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--gray-600);
            text-decoration: none;
            transition: all 0.2s ease;
            font-size: 20px;
        }

        .contact-icon:hover {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
            transform: translateY(-2px);
        }

        .contact-icon.whatsapp:hover {
            background: #25D366;
            border-color: #25D366;
        }

        /* Main Content Sections */
        .main {
            padding: 48px 0;
        }

        .main section {
            margin-bottom: 56px;
        }

        .main h2 {
            font-size: 2rem;
            font-weight: 700;
            color: var(--text-color);
            margin-bottom: 24px;
            position: relative;
            padding-bottom: 12px;
        }

        .main h2::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 60px;
            height: 3px;
            background: var(--primary-color);
            border-radius: 2px;
        }

        /* Rich Text Summary */
        .summary-content {
            font-size: 1.125rem;
            line-height: 1.8;
            color: var(--gray-700);
        }

        .summary-content p {
            margin-bottom: 16px;
        }

        /* Career Timeline */
        .timeline {
            position: relative;
            padding-left: 32px;
        }

        .timeline::before {
            content: '';
            position: absolute;
            left: 16px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: var(--border-color);
        }

        .timeline-item {
            position: relative;
            margin-bottom: 40px;
            padding-left: 32px;
        }

        .timeline-marker {
            position: absolute;
            left: -40px;
            top: 8px;
            width: 12px;
            height: 12px;
            background: var(--primary-color);
            border-radius: 50%;
            border: 3px solid var(--bg-color);
            box-shadow: 0 0 0 2px var(--border-color);
        }

        .timeline-content h3 {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 4px;
        }

        .timeline-content h4 {
            font-size: 1.25rem;
            font-weight: 500;
            color: var(--primary-color);
            margin-bottom: 8px;
        }

        /* Skills Grid Layout */
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 40px;
        }

        .skills-column h3 {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 24px;
            position: relative;
            padding-bottom: 8px;
        }

        .skills-column h3::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 40px;
            height: 2px;
            background: var(--primary-color);
        }

        .skill-item {
            margin-bottom: 20px;
        }

        .skill-name {
            display: block;
            font-weight: 500;
            color: var(--text-color);
            margin-bottom: 8px;
        }

        .skill-bar {
            width: 100%;
            height: 8px;
            background: var(--gray-100);
            border-radius: 4px;
            overflow: hidden;
        }

        .skill-progress {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            border-radius: 4px;
            transition: width 0.6s ease;
        }

        /* Contact Section */
        .contact-section {
            text-align: center;
            background: var(--gray-50);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 48px 32px;
        }

        .contact-methods {
            display: flex;
            justify-content: center;
            gap: 24px;
            flex-wrap: wrap;
        }

        .contact-method {
            background: var(--bg-color);
            border: 2px solid var(--border-color);
            border-radius: 12px;
            padding: 16px 24px;
            text-decoration: none;
            color: var(--text-color);
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 500;
            transition: all 0.3s ease;
            min-width: 160px;
            justify-content: center;
        }

        .contact-method:hover {
            border-color: var(--primary-color);
            background: var(--primary-color);
            color: white;
            transform: translateY(-2px);
        }

        .contact-method.whatsapp:hover {
            background: #25D366;
            border-color: #25D366;
        }

        .contact-method.linkedin:hover {
            background: #0077b5;
            border-color: #0077b5;
        }

        /* Footer */
        .footer {
            background: var(--gray-900);
            color: white;
            text-align: center;
            padding: 32px 0;
            margin-top: 64px;
        }

        .footer a {
            color: var(--primary-color);
            text-decoration: none;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .header-content {
                flex-direction: column;
                align-items: center;
                text-align: center;
            }

            .header-left {
                flex-direction: column;
                align-items: center;
            }

            .header-info h1.name {
                font-size: 2rem;
            }

            .skills-grid {
                grid-template-columns: 1fr;
            }

            .contact-methods {
                flex-direction: column;
                align-items: center;
            }
        }
    `;
  }

  /**
   * Generate Executive Template JavaScript
   */
  private static generateExecutiveJS(): string {
    return `
        // Smooth scroll for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Contact icon hover animations
        document.querySelectorAll('.contact-icon').forEach(icon => {
            icon.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.05)';
            });
            
            icon.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // WhatsApp click tracking
        document.querySelectorAll('.whatsapp').forEach(link => {
            link.addEventListener('click', () => {
                console.log('WhatsApp contact initiated');
            });
        });

        console.log('Executive Portfolio Template loaded successfully');
    `;
  }

  /**
   * Generate Default Template (fallback)
   */
  private static generateDefaultTemplate(
    portfolioData: ProfessionalPortfolioData,
    discoveredProjects: ProjectInfo[],
    options: any
  ): string {
    const { personalInfo } = portfolioData;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName} - Portfolio</title>
    <style>
        body { font-family: Inter, sans-serif; margin: 0; padding: 20px; }
        h1 { color: #2563eb; }
        .summary { line-height: 1.6; margin: 20px 0; }
    </style>
</head>
<body>
    <h1>${personalInfo.fullName}</h1>
    <p><strong>${personalInfo.title}</strong></p>
    <div class="summary">${this.formatRichText(portfolioData.summary)}</div>
    
    ${discoveredProjects.length > 0 ? `
    <h2>Projects</h2>
    ${discoveredProjects.map(project => `
    <div style="margin-bottom: 20px; border: 1px solid #ccc; padding: 15px; border-radius: 8px;">
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank">View Project</a>` : ''}
    </div>
    `).join('')}
    ` : ''}
</body>
</html>`;
  }
}

export default PortfolioGeneratorService;