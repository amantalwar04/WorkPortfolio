import { Octokit } from '@octokit/rest';

// Browser-compatible base64 utilities
const browserBase64 = {
  encode: (str: string): string => {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (error) {
      console.error('Base64 encoding error:', error);
      throw new Error('Failed to encode content for GitHub API');
    }
  },
  
  decode: (str: string): string => {
    try {
      return decodeURIComponent(escape(atob(str)));
    } catch (error) {
      console.error('Base64 decoding error:', error);
      return str; // Return original string if decoding fails
    }
  }
};

export interface DeploymentConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

export interface ProjectInfo {
  name: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  readme: string;
  path: string;
}

export class GitHubDeploymentService {
  private octokit: Octokit;

  constructor(token: string) {
    this.octokit = new Octokit({
      auth: token,
    });
  }

  /**
   * Deploy portfolio to GitHub Pages
   */
  async deployToGitHubPages(config: DeploymentConfig, portfolioContent: string): Promise<string> {
    try {
      const { owner, repo, branch } = config;

      // Validate configuration
      if (!owner || !repo || !branch || !config.token) {
        throw new Error('Missing required deployment configuration. Please check your repository details and access token.');
      }

      // Validate portfolio content
      if (!portfolioContent || portfolioContent.trim().length === 0) {
        throw new Error('Portfolio content is empty. Please ensure your portfolio data is complete.');
      }

      console.log(`Starting deployment to ${owner}/${repo} on branch ${branch}`);

      // Check if repository exists and we have access
      await this.verifyRepository(owner, repo);
      console.log('Repository verified successfully');

      // Create or update the index.html file
      const commitMessage = `Deploy portfolio - ${new Date().toISOString()}`;
      
      console.log('Uploading portfolio content...');
      await this.createOrUpdateFile({
        owner,
        repo,
        path: 'index.html',
        content: portfolioContent,
        message: commitMessage,
        branch,
      });
      console.log('Portfolio content uploaded successfully');

      // Enable GitHub Pages if not already enabled
      console.log('Configuring GitHub Pages...');
      await this.enableGitHubPages(owner, repo, branch);
      console.log('GitHub Pages configured successfully');

      // Return the GitHub Pages URL
      const portfolioUrl = `https://${owner}.github.io/${repo}/`;
      console.log(`Portfolio deployed successfully to: ${portfolioUrl}`);
      
      return portfolioUrl;
      
    } catch (error) {
      console.error('Deployment error:', error);
      
      // Provide specific error messages for common issues
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('not found') || errorMessage.includes('404')) {
          throw new Error(`Repository ${config.owner}/${config.repo} not found. Please check the repository name and ensure you have access to it.`);
        }
        
        if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
          throw new Error('Unauthorized access. Please check your GitHub Personal Access Token and ensure it has the required permissions (repo, write:pages).');
        }
        
        if (errorMessage.includes('forbidden') || errorMessage.includes('403')) {
          throw new Error('Access forbidden. Please ensure your GitHub token has write access to the repository and the required permissions.');
        }
        
        if (errorMessage.includes('base64') || errorMessage.includes('encoding')) {
          throw new Error('Content encoding error. This might be due to special characters in your portfolio. Please try again or contact support.');
        }
        
        throw new Error(`Deployment failed: ${error.message}`);
      }
      
      throw new Error('Deployment failed due to an unknown error. Please try again or check your network connection.');
    }
  }

  /**
   * Discover projects from repository
   */
  async discoverProjects(owner: string, repo: string, token: string): Promise<ProjectInfo[]> {
    try {
      const octokit = new Octokit({ auth: token });
      const projects: ProjectInfo[] = [];

      // Get contents of projects directory
      try {
        const { data: projectsDir } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: 'projects',
        });

        if (Array.isArray(projectsDir)) {
          // Process each project folder
          for (const item of projectsDir) {
            if (item.type === 'dir' && item.name) {
              const projectInfo = await this.parseProjectFolder(octokit, owner, repo, item.name);
              if (projectInfo) {
                projects.push(projectInfo);
              }
            }
          }
        }
      } catch (error) {
        // Projects folder doesn't exist - return empty array
        console.log('No projects folder found in repository');
      }

      return projects;
    } catch (error) {
      console.error('Error discovering projects:', error);
      return [];
    }
  }

  /**
   * Parse individual project folder
   */
  private async parseProjectFolder(octokit: Octokit, owner: string, repo: string, projectName: string): Promise<ProjectInfo | null> {
    try {
      // Get README.md from project folder
      let readme = '';
      let description = '';
      let technologies: string[] = [];
      let liveUrl = '';
      let demoUrl = '';
      let imageUrl = '';

      try {
        const { data: readmeFile } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: `projects/${projectName}/README.md`,
        });

        if ('content' in readmeFile) {
          // Browser-compatible base64 decoding
          readme = browserBase64.decode(readmeFile.content);
          
          // Parse README for project details
          const projectDetails = this.parseReadmeForProjectDetails(readme);
          description = projectDetails.description;
          technologies = projectDetails.technologies;
          liveUrl = projectDetails.liveUrl;
          demoUrl = projectDetails.demoUrl;
        }
      } catch (error) {
        console.log(`No README.md found for project ${projectName}`);
      }

      // Look for image files in project folder
      try {
        const { data: projectFiles } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: `projects/${projectName}`,
        });

        if (Array.isArray(projectFiles)) {
          const imageFile = projectFiles.find(file => 
            file.name && /\.(jpg|jpeg|png|gif|svg)$/i.test(file.name)
          );
          if (imageFile) {
            imageUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/projects/${projectName}/${imageFile.name}`;
          }
        }
      } catch (error) {
        console.log(`Error accessing project files for ${projectName}`);
      }

      return {
        name: this.formatProjectName(projectName),
        description: description || `${projectName} project`,
        technologies,
        liveUrl: liveUrl || `https://${owner}.github.io/${projectName}/`,
        demoUrl,
        imageUrl,
        readme,
        path: `projects/${projectName}`,
      };
    } catch (error) {
      console.error(`Error parsing project ${projectName}:`, error);
      return null;
    }
  }

  /**
   * Parse README.md content for project details
   */
  private parseReadmeForProjectDetails(readme: string) {
    const details = {
      description: '',
      technologies: [] as string[],
      liveUrl: '',
      demoUrl: '',
    };

    // Extract description (first paragraph after title)
    const lines = readme.split('\n');
    let foundDescription = false;
    for (const line of lines) {
      if (line.trim() && !line.startsWith('#') && !foundDescription) {
        details.description = line.trim();
        foundDescription = true;
        break;
      }
    }

    // Extract technologies from badges or tech stack section
    const techRegex = /(?:tech stack|technologies|built with)[:\s]*([^\n]+)/i;
    const techMatch = readme.match(techRegex);
    if (techMatch) {
      details.technologies = techMatch[1]
        .split(/[,|\-|\s]+/)
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0);
    }

    // Extract URLs
    const urlRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = urlRegex.exec(readme)) !== null) {
      const linkText = match[1].toLowerCase();
      const url = match[2];
      
      if (linkText.includes('live') || linkText.includes('demo') || linkText.includes('site')) {
        details.liveUrl = url;
      } else if (linkText.includes('demo')) {
        details.demoUrl = url;
      }
    }

    return details;
  }

  /**
   * Format project name for display
   */
  private formatProjectName(projectName: string): string {
    return projectName
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Verify repository exists and user has access
   */
  private async verifyRepository(owner: string, repo: string): Promise<void> {
    try {
      await this.octokit.rest.repos.get({ owner, repo });
    } catch (error) {
      throw new Error(`Repository ${owner}/${repo} not found or not accessible`);
    }
  }

  /**
   * Create or update file in repository
   */
  private async createOrUpdateFile({
    owner,
    repo,
    path,
    content,
    message,
    branch,
  }: {
    owner: string;
    repo: string;
    path: string;
    content: string;
    message: string;
    branch: string;
  }): Promise<void> {
    try {
      // Check if file exists
      let sha: string | undefined;
      try {
        const { data: existingFile } = await this.octokit.rest.repos.getContent({
          owner,
          repo,
          path,
          ref: branch,
        });
        if ('sha' in existingFile) {
          sha = existingFile.sha;
        }
      } catch (error) {
        // File doesn't exist, we'll create it
      }

      // Create or update the file
      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: browserBase64.encode(content),
        sha,
        branch,
      });
    } catch (error) {
      throw new Error(`Failed to update file ${path}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Enable GitHub Pages for the repository
   */
  private async enableGitHubPages(owner: string, repo: string, branch: string): Promise<void> {
    try {
      await this.octokit.rest.repos.createPagesSite({
        owner,
        repo,
        source: {
          branch,
          path: '/',
        },
      });
    } catch (error) {
      // Pages might already be enabled
      console.log('GitHub Pages might already be enabled');
    }
  }

  /**
   * Get repository information
   */
  async getRepositoryInfo(owner: string, repo: string): Promise<any> {
    try {
      const { data } = await this.octokit.rest.repos.get({ owner, repo });
      return {
        name: data.name,
        fullName: data.full_name,
        description: data.description,
        htmlUrl: data.html_url,
        defaultBranch: data.default_branch,
        hasPages: data.has_pages,
        pagesUrl: `https://${owner}.github.io/${repo}/`,
      };
    } catch (error) {
      throw new Error(`Failed to get repository info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default GitHubDeploymentService;