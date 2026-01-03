import { Octokit } from 'octokit';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.GITHUB_ACCESS_TOKEN;
console.log(`[DEBUG] GitHub Token loaded: ${token ? (token.substring(0, 4) + '...') : 'NULL'}`);

const octokit = new Octokit({
  auth: token,
});

export const getRepoContent = async (owner, repo, path = '') => {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
    });
    return data;
  } catch (error) {
    console.error('Error fetching repo content:', error);
    throw error;
  }
};

export const getFileContent = async (owner, repo, path) => {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
    });
    
    if (Array.isArray(data)) {
        throw new Error('Path is a directory, not a file');
    }

    // GitHub API returns content in base64
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return content;
  } catch (error) {
    console.error('Error fetching file content:', error);
    throw error;
  }
};

export const listUserRepos = async () => {
    try {
        const { data } = await octokit.rest.repos.listForAuthenticatedUser({
            visibility: 'all',
            sort: 'updated',
            per_page: 10
        });
        return data;
    } catch (error) {
        console.error('Error fetching user repos:', error);
        throw error;
    }
}
