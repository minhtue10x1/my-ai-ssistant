import { Octokit } from 'octokit';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.GITHUB_ACCESS_TOKEN ? process.env.GITHUB_ACCESS_TOKEN.trim() : null;
console.log(`[DEBUG] GitHub Token loaded: ${token ? (token.substring(0, 4) + '...') : 'NULL'}`);

const createOctokit = (authToken) => new Octokit({ auth: authToken });

let octokit = createOctokit(token);

// Helper to handle retry with no auth if 401
const safeRequest = async (requestFn) => {
    try {
        return await requestFn(octokit);
    } catch (error) {
        if (error.status === 401 && token) {
            console.warn('[WARN] GitHub Token invalid. Retrying without authentication (Public Repos only)...');
            const noAuthOctokit = createOctokit(null);
            return await requestFn(noAuthOctokit);
        }
        throw error;
    }
};

export const getRepoContent = async (owner, repo, path = '') => {
  try {
    const { data } = await safeRequest((client) => client.rest.repos.getContent({
      owner,
      repo,
      path,
    }));
    return data;
  } catch (error) {
    console.error('Error fetching repo content:', error);
    throw error;
  }
};

export const getFileContent = async (owner, repo, path) => {
  try {
    const { data } = await safeRequest((client) => client.rest.repos.getContent({
      owner,
      repo,
      path,
    }));
    
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
};

export const getPullRequestFiles = async (owner, repo, prNumber) => {
    try {
        const { data } = await safeRequest((client) => client.rest.pulls.listFiles({
            owner,
            repo,
            pull_number: prNumber,
        }));
        return data.map(file => ({
            filename: file.filename,
            status: file.status,
            patch: file.patch, // The diff
            blob_url: file.blob_url
        }));
    } catch (error) {
        console.error('Error fetching PR files:', error);
        throw error;
    }
};

export const createReviewComment = async (owner, repo, prNumber, body, path, line) => {
    try {
        // Find latest commit info 
         const { data: pr } = await safeRequest((client) => client.rest.pulls.get({
            owner,
            repo,
            pull_number: prNumber,
        }));
        const commitId = pr.head.sha;

        await octokit.rest.pulls.createReviewComment({
            owner,
            repo,
            pull_number: prNumber,
            body,
            commit_id: commitId,
            path,
            line, // Note: must be line in the diff
            side: 'RIGHT'
        });
        return true;
    } catch (error) {
        console.error('Error creating review comment:', error);
        // Don't throw, just log. PR might have changed or line is invalid.
        return false;
    }
};
