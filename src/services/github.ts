import { Octokit } from '@octokit/rest';
import { GitHubRepository, User } from '../types';

class GitHubService {
  private octokit: Octokit;
  
  constructor(token?: string) {
    this.octokit = new Octokit({
      auth: token,
    });
  }
  
  // Set or update the GitHub token
  setToken(token: string): void {
    this.octokit = new Octokit({
      auth: token,
    });
  }
  
  // Get authenticated user information
  async getAuthenticatedUser(): Promise<User> {
    try {
      const { data } = await this.octokit.rest.users.getAuthenticated();
      
      return {
        id: data.id.toString(),
        name: data.name || data.login,
        email: data.email || '',
        username: data.login,
        avatar: data.avatar_url,
        bio: data.bio || '',
        location: data.location || '',
        website: data.blog || '',
        company: data.company || '',
        blog: data.blog || '',
      };
    } catch (error) {
      console.error('Error fetching authenticated user:', error);
      throw new Error('Failed to fetch user information from GitHub');
    }
  }
  
  // Get user information by username
  async getUserByUsername(username: string): Promise<User> {
    try {
      const { data } = await this.octokit.rest.users.getByUsername({
        username,
      });
      
      return {
        id: data.id.toString(),
        name: data.name || data.login,
        email: data.email || '',
        username: data.login,
        avatar: data.avatar_url,
        bio: data.bio || '',
        location: data.location || '',
        website: data.blog || '',
        company: data.company || '',
        blog: data.blog || '',
      };
    } catch (error) {
      console.error('Error fetching user by username:', error);
      throw new Error(`Failed to fetch user information for ${username}`);
    }
  }
  
  // Get user repositories
  async getUserRepositories(username?: string): Promise<GitHubRepository[]> {
    try {
      const { data } = username
        ? await this.octokit.rest.repos.listForUser({
            username,
            sort: 'updated',
            per_page: 100,
          })
        : await this.octokit.rest.repos.listForAuthenticatedUser({
            sort: 'updated',
            per_page: 100,
          });
      
      return data.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description || '',
        html_url: repo.html_url,
        homepage: repo.homepage || '',
        language: repo.language || '',
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        topics: repo.topics || [],
        size: repo.size,
        default_branch: repo.default_branch,
        archived: repo.archived,
        fork: repo.fork,
      }));
    } catch (error) {
      console.error('Error fetching repositories:', error);
      throw new Error('Failed to fetch repositories from GitHub');
    }
  }
  
  // Get repository details including README
  async getRepositoryDetails(owner: string, repo: string) {
    try {
      const [repoData, readmeData, languagesData] = await Promise.allSettled([
        this.octokit.rest.repos.get({ owner, repo }),
        this.octokit.rest.repos.getReadme({ owner, repo }),
        this.octokit.rest.repos.listLanguages({ owner, repo }),
      ]);
      
      const repository = repoData.status === 'fulfilled' ? repoData.value.data : null;
      const readme = readmeData.status === 'fulfilled' 
        ? Buffer.from(readmeData.value.data.content, 'base64').toString('utf-8')
        : '';
      const languages = languagesData.status === 'fulfilled' ? languagesData.value.data : {};
      
      return {
        repository,
        readme,
        languages,
      };
    } catch (error) {
      console.error('Error fetching repository details:', error);
      throw new Error(`Failed to fetch details for ${owner}/${repo}`);
    }
  }
  
  // Get repository commits
  async getRepositoryCommits(owner: string, repo: string, limit = 10) {
    try {
      const { data } = await this.octokit.rest.repos.listCommits({
        owner,
        repo,
        per_page: limit,
      });
      
      return data.map(commit => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: commit.commit.author?.name || 'Unknown',
        date: commit.commit.author?.date || '',
        url: commit.html_url,
      }));
    } catch (error) {
      console.error('Error fetching repository commits:', error);
      return [];
    }
  }
  
  // Get user's contribution statistics
  async getUserStats(username: string) {
    try {
      const repos = await this.getUserRepositories(username);
      
      const stats = {
        totalRepos: repos.length,
        totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
        totalForks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
        languages: {} as Record<string, number>,
        mostStarredRepo: repos.sort((a, b) => b.stargazers_count - a.stargazers_count)[0],
        latestRepo: repos.sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )[0],
      };
      
      // Count languages
      repos.forEach(repo => {
        if (repo.language) {
          stats.languages[repo.language] = (stats.languages[repo.language] || 0) + 1;
        }
      });
      
      return stats;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw new Error(`Failed to fetch statistics for ${username}`);
    }
  }
  
  // Check if repository exists and is accessible
  async checkRepositoryAccess(owner: string, repo: string): Promise<boolean> {
    try {
      await this.octokit.rest.repos.get({ owner, repo });
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // Get trending repositories (public API, no auth required)
  async getTrendingRepositories(language?: string, since?: 'daily' | 'weekly' | 'monthly') {
    try {
      const query = language 
        ? `language:${language} created:>${this.getDateBefore(since || 'weekly')}`
        : `created:>${this.getDateBefore(since || 'weekly')}`;
      
      const { data } = await this.octokit.rest.search.repos({
        q: query,
        sort: 'stars',
        order: 'desc',
        per_page: 10,
      });
      
      return data.items.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description || '',
        html_url: repo.html_url,
        language: repo.language || '',
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        topics: repo.topics || [],
      }));
    } catch (error) {
      console.error('Error fetching trending repositories:', error);
      return [];
    }
  }
  
  private getDateBefore(period: 'daily' | 'weekly' | 'monthly'): string {
    const date = new Date();
    const days = period === 'daily' ? 1 : period === 'weekly' ? 7 : 30;
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }
}

export const githubService = new GitHubService();
export default GitHubService;