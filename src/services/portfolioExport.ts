import { ProfessionalPortfolioData, PortfolioExportOptions, ExportedPortfolio, EnhancedSkill } from '../types';

export class PortfolioExportService {
  
  /**
   * Generate standalone HTML/CSS portfolio similar to user's existing portfolio
   */
  static async exportProfessionalPortfolio(
    data: ProfessionalPortfolioData,
    options: PortfolioExportOptions = {
      format: 'html',
      template: 'professional',
      includeAssets: true,
      filename: 'portfolio',
    }
  ): Promise<ExportedPortfolio> {
    
    const html = this.generateHTML(data, options);
    const css = this.generateCSS(data, options);
    const assets = options.includeAssets ? this.generateAssets(data) : {};
    
    return {
      html,
      css,
      assets,
      metadata: {
        generatedAt: new Date().toISOString(),
        template: options.template,
        version: '1.0.0',
      },
    };
  }

  /**
   * Generate HTML structure matching the user's portfolio layout
   */
  private static generateHTML(data: ProfessionalPortfolioData, options: PortfolioExportOptions): string {
    const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = data;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName} - Professional Portfolio</title>
    <meta name="description" content="${summary.substring(0, 160)}...">
    <meta name="keywords" content="portfolio, ${personalInfo.title}, ${skills.map(s => s.name).join(', ')}">
    <meta name="author" content="${personalInfo.fullName}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${personalInfo.fullName} - Professional Portfolio">
    <meta property="og:description" content="${summary.substring(0, 160)}...">
    <meta property="og:url" content="https://${personalInfo.github?.split('/').pop()}.github.io/portfolio/">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="${personalInfo.fullName} - Professional Portfolio">
    <meta property="twitter:description" content="${summary.substring(0, 160)}...">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Material Icons -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Header Section -->
    <header class="hero-section">
        <div class="container">
            <div class="hero-content">
                <div class="hero-text">
                    <h1 class="hero-title">${personalInfo.fullName}</h1>
                    <h2 class="hero-subtitle">${personalInfo.title}</h2>
                    <p class="hero-location">📍 ${personalInfo.location}</p>
                </div>
                ${personalInfo.avatar ? `
                <div class="hero-avatar">
                    <img src="${personalInfo.avatar}" alt="${personalInfo.fullName}" class="avatar-img">
                </div>
                ` : ''}
            </div>
        </div>
    </header>

    <!-- Summary Section -->
    <section class="summary-section">
        <div class="container">
            <h2 class="section-title">Summary</h2>
            <p class="summary-text">${summary}</p>
        </div>
    </section>

    <!-- Career Timeline -->
    <section class="timeline-section">
        <div class="container">
            <h2 class="section-title">Career Timeline</h2>
            <div class="timeline">
                ${experience.map((exp, index) => `
                <div class="timeline-item" data-aos="fade-left" data-aos-delay="${index * 100}">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <h3 class="timeline-title">${exp.title}</h3>
                        <h4 class="timeline-company">${exp.company}${exp.location ? ` • ${exp.location}` : ''}</h4>
                        <p class="timeline-date">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</p>
                        <p class="timeline-description">${exp.description}</p>
                        ${exp.achievements.length > 0 ? `
                        <div class="timeline-achievements">
                            <h5>Key Achievements:</h5>
                            <ul>
                                ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                            </ul>
                        </div>
                        ` : ''}
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Skills Section -->
    <section class="skills-section">
        <div class="container">
            <h2 class="section-title">Top Skills</h2>
            <div class="skills-grid">
                ${this.getSkillCategories(skills).map(category => {
                  const categorySkills = skills.filter(skill => skill.category === category);
                  return `
                <div class="skill-category">
                    <h3 class="skill-category-title">${category} Skills</h3>
                    <div class="skill-tags">
                        ${categorySkills.map(skill => `<span class="skill-tag">${skill.name}</span>`).join('')}
                    </div>
                </div>
                  `;
                }).join('')}
            </div>
        </div>
    </section>

    <!-- Education Section -->
    <section class="education-section">
        <div class="container">
            <h2 class="section-title">Education</h2>
            <div class="education-grid">
                ${education.map(edu => `
                <div class="education-item">
                    <h3 class="education-degree">${edu.degree}</h3>
                    <h4 class="education-institution">${edu.institution}</h4>
                    <p class="education-date">${edu.startDate} - ${edu.endDate}</p>
                    ${edu.description ? `<p class="education-description">${edu.description}</p>` : ''}
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    ${projects.length > 0 ? `
    <section class="projects-section">
        <div class="container">
            <h2 class="section-title">Featured Projects</h2>
            <div class="projects-grid">
                ${projects.filter(p => p.featured).map(project => `
                <div class="project-card">
                    ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.title}" class="project-image">` : ''}
                    <div class="project-content">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        <div class="project-technologies">
                            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                        <div class="project-links">
                            ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="project-link">🚀 Demo</a>` : ''}
                            ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link">🔗 GitHub</a>` : ''}
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Contact Section -->
    <section class="contact-section">
        <div class="container">
            <h2 class="section-title">Get In Touch</h2>
            <p class="contact-description">
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of something exciting. Feel free to reach out.
            </p>
            <div class="contact-grid">
                ${personalInfo.email ? `
                <div class="contact-item">
                    <span class="material-icons">email</span>
                    <div>
                        <span class="contact-label">Email</span>
                        <span class="contact-value">${personalInfo.email}</span>
                    </div>
                </div>
                ` : ''}
                ${personalInfo.phone ? `
                <div class="contact-item">
                    <span class="material-icons">phone</span>
                    <div>
                        <span class="contact-label">Phone</span>
                        <span class="contact-value">${personalInfo.phone}</span>
                    </div>
                </div>
                ` : ''}
                ${personalInfo.linkedin ? `
                <div class="contact-item">
                    <span class="material-icons">business</span>
                    <div>
                        <span class="contact-label">LinkedIn</span>
                        <span class="contact-value">LinkedIn Profile</span>
                    </div>
                </div>
                ` : ''}
                ${personalInfo.github ? `
                <div class="contact-item">
                    <span class="material-icons">code</span>
                    <div>
                        <span class="contact-label">GitHub</span>
                        <span class="contact-value">GitHub Profile</span>
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 ${personalInfo.fullName}. All Rights Reserved.</p>
            <p class="footer-sub">Portfolio built with Professional Portfolio Generator</p>
        </div>
    </footer>

    <!-- Scripts -->
    <script>
        // Simple animation on scroll
        function animateOnScroll() {
            const elements = document.querySelectorAll('.timeline-item, .project-card, .skill-category');
            const windowHeight = window.innerHeight;
            
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < windowHeight - elementVisible) {
                    element.classList.add('animate');
                }
            });
        }
        
        window.addEventListener('scroll', animateOnScroll);
        animateOnScroll(); // Run on load
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    </script>
</body>
</html>`;
  }

  /**
   * Generate CSS styles matching the professional portfolio design
   */
  private static generateCSS(data: ProfessionalPortfolioData, options: PortfolioExportOptions): string {
    const { theme } = data;
    
    return `/* Professional Portfolio Styles */
:root {
    --primary-color: ${theme.primaryColor};
    --secondary-color: ${theme.secondaryColor};
    --background-color: ${theme.backgroundColor};
    --text-color: ${theme.textColor};
    --accent-color: ${theme.accentColor};
    --font-family: ${theme.fontFamily || "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"};
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--font-family);
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--background-color);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

/* Header Section */
.hero-section {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    color: white;
    padding: 6rem 0;
    position: relative;
    overflow: hidden;
}

.hero-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 4rem;
    align-items: center;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    animation: fadeInUp 0.8s ease-out;
}

.hero-subtitle {
    font-size: 1.5rem;
    font-weight: 300;
    margin-bottom: 1rem;
    opacity: 0.9;
    animation: fadeInUp 0.8s ease-out 0.2s both;
}

.hero-location {
    font-size: 1.1rem;
    opacity: 0.8;
    animation: fadeInUp 0.8s ease-out 0.4s both;
}

.hero-avatar {
    text-align: center;
}

.avatar-img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 4px solid white;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    animation: fadeInScale 0.8s ease-out 0.6s both;
}

/* Sections */
section {
    padding: 6rem 0;
    border-bottom: 1px solid rgba(0,0,0,0.1);
}

.section-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 3rem;
    position: relative;
}

.section-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 4px;
    background: var(--primary-color);
    border-radius: 2px;
}

/* Summary Section */
.summary-text {
    font-size: 1.2rem;
    line-height: 1.8;
    max-width: 800px;
    text-align: justify;
}

/* Timeline Section */
.timeline {
    position: relative;
    padding-left: 3rem;
}

.timeline::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--primary-color);
}

.timeline-item {
    position: relative;
    margin-bottom: 3rem;
    opacity: 0;
    transform: translateX(-20px);
    transition: all 0.6s ease-out;
}

.timeline-item.animate {
    opacity: 1;
    transform: translateX(0);
}

.timeline-dot {
    position: absolute;
    left: -8px;
    top: 8px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--primary-color);
    border: 3px solid var(--background-color);
    z-index: 1;
}

.timeline-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    margin-left: 1.5rem;
}

.timeline-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.timeline-company {
    color: var(--primary-color);
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
}

.timeline-date {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

.timeline-description {
    margin-bottom: 1rem;
}

.timeline-achievements h5 {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--primary-color);
}

.timeline-achievements ul {
    list-style: none;
    padding-left: 1rem;
}

.timeline-achievements li {
    position: relative;
    margin-bottom: 0.5rem;
}

.timeline-achievements li::before {
    content: '▸';
    position: absolute;
    left: -1rem;
    color: var(--primary-color);
}

/* Skills Section */
.skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.skill-category {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease-out;
}

.skill-category.animate {
    opacity: 1;
    transform: translateY(0);
}

.skill-category-title {
    color: var(--primary-color);
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 1rem;
}

.skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.skill-tag {
    background: rgba(37, 99, 235, 0.1);
    color: var(--primary-color);
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
}

/* Education Section */
.education-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
}

.education-item {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.education-degree {
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.education-institution {
    color: var(--primary-color);
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
}

.education-date {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

/* Projects Section */
.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
}

.project-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: transform 0.3s ease-out;
    opacity: 0;
    transform: translateY(20px);
}

.project-card.animate {
    opacity: 1;
    transform: translateY(0);
}

.project-card:hover {
    transform: translateY(-8px);
}

.project-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.project-content {
    padding: 1.5rem;
}

.project-title {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 1rem;
}

.project-description {
    margin-bottom: 1rem;
}

.project-technologies {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.tech-tag {
    background: #f3f4f6;
    color: #374151;
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
    font-size: 0.8rem;
    border: 1px solid #e5e7eb;
}

.project-links {
    display: flex;
    gap: 1rem;
}

.project-link {
    color: var(--primary-color);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
}

.project-link:hover {
    text-decoration: underline;
}

/* Contact Section */
.contact-description {
    font-size: 1.1rem;
    margin-bottom: 3rem;
    max-width: 600px;
}

.contact-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 600px;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.contact-item .material-icons {
    color: var(--primary-color);
    font-size: 2rem;
}

.contact-label {
    display: block;
    font-size: 0.8rem;
    color: #666;
    text-transform: uppercase;
    font-weight: 500;
}

.contact-value {
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
}

/* Footer */
.footer {
    background: var(--primary-color);
    color: white;
    text-align: center;
    padding: 3rem 0;
    border-bottom: none;
}

.footer-sub {
    font-size: 0.8rem;
    opacity: 0.8;
    margin-top: 0.5rem;
}

/* Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInScale {
    from {
        opacity: 0;
        transform: scale(0.8);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* Responsive Design */
@media (max-width: 768px) {
    .container {
        padding: 0 1rem;
    }
    
    .hero-content {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 2rem;
    }
    
    .hero-title {
        font-size: 2.5rem;
    }
    
    .hero-subtitle {
        font-size: 1.2rem;
    }
    
    .avatar-img {
        width: 150px;
        height: 150px;
    }
    
    .timeline {
        padding-left: 2rem;
    }
    
    .timeline-content {
        margin-left: 1rem;
    }
    
    .section-title {
        font-size: 2rem;
    }
    
    .skills-grid,
    .education-grid,
    .projects-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .hero-title {
        font-size: 2rem;
    }
    
    .hero-subtitle {
        font-size: 1rem;
    }
    
    section {
        padding: 4rem 0;
    }
    
    .section-title {
        font-size: 1.8rem;
    }
}`;
  }

  /**
   * Generate additional assets (images, icons, etc.)
   */
  private static generateAssets(data: ProfessionalPortfolioData): { [key: string]: string } {
    return {
      'favicon.ico': 'data:image/x-icon;base64,', // Placeholder
      'robots.txt': `User-agent: *
Allow: /

Sitemap: https://${data.personalInfo.github?.split('/').pop()}.github.io/portfolio/sitemap.xml`,
      'sitemap.xml': `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://${data.personalInfo.github?.split('/').pop()}.github.io/portfolio/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>`,
    };
  }

  /**
   * Get unique skill categories
   */
  private static getSkillCategories(skills: any[]): string[] {
    const categories = Array.from(new Set(skills.map(skill => skill.category)));
    return categories.length > 0 ? categories : ['Technical', 'Leadership', 'Domain'];
  }

  /**
   * Download the exported portfolio as a ZIP file
   */
  static async downloadPortfolio(exportedPortfolio: ExportedPortfolio, filename: string = 'portfolio'): Promise<void> {
    try {
      // Create a ZIP-like structure for download
      const files = [
        { name: 'index.html', content: exportedPortfolio.html },
        { name: 'styles.css', content: exportedPortfolio.css },
        ...Object.entries(exportedPortfolio.assets).map(([name, content]) => ({ name, content })),
      ];

      // For now, download individual files
      // In a real implementation, you'd use JSZip to create a proper ZIP file
      for (const file of files) {
        const blob = new Blob([file.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Small delay between downloads to avoid browser blocking
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Error downloading portfolio:', error);
      throw new Error('Failed to download portfolio files');
    }
  }

  /**
   * Generate GitHub Pages deployment files
   */
  static generateGitHubPagesFiles(exportedPortfolio: ExportedPortfolio): { [key: string]: string } {
    return {
      '.github/workflows/deploy.yml': `name: Deploy Portfolio

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: \${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./`,
      'README.md': `# Professional Portfolio

This portfolio was generated using the Professional Portfolio Generator.

## 🚀 Live Demo
Visit: [Your Portfolio](https://yourusername.github.io/portfolio/)

## ✨ Features
- Professional design
- Responsive layout
- SEO optimized
- Fast loading

## 🛠️ Built With
- HTML5 & CSS3
- Material Design Icons
- Modern animations

Generated on: ${new Date().toLocaleDateString()}`,
    };
  }
}

export default PortfolioExportService;