import express from 'express';
const router = express.Router();

import { getRepoContent, getFileContent, listUserRepos } from '../services/githubService.js';
import { analyzeCode } from '../services/aiService.js';
import auth from '../middleware/auth.js';

// GitHub Routes

// List repositories
router.get('/github/repos', auth, async (req, res) => {
    try {
        const repos = await listUserRepos();
        res.json(repos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get file content
router.post('/github/file', auth, async (req, res) => {
    const { owner, repo, path } = req.body;
    try {
        const content = await getFileContent(owner, repo, path);
        res.json({ content });
    } catch (error) {
         res.status(500).json({ error: error.message });
    }
});

// Hook for GitHub Webhook (keep generic for now)
// Hook for GitHub Webhook
router.post('/github/webhook', async (req, res) => {
  const event = req.headers['x-github-event'];
  const payload = req.body;
  
  if (event === 'pull_request' && payload.action === 'opened') {
      console.log(`[Webhook] PR #${payload.number} opened in ${payload.repository.full_name}`);
      
      const owner = payload.repository.owner.login;
      const repo = payload.repository.name;
      const prNumber = payload.number;

      // Ideally find specific workflow matching this event. 
      // For MVP, we'll create an ephemeral workflow definition here or fetch "Auto-Review PR"
      const prReviewWorkflow = {
          name: "PR Review Bot",
          steps: [
              { id: 'step_1', action: 'FETCH_PR_CHANGES' },
              { id: 'step_2', action: 'ANALYZE_CODE', config: { promptType: 'review_json' } },
              { id: 'step_3', action: 'POST_PR_COMMENT' }
          ]
      };

      try {
          const engine = new WorkflowEngine(prReviewWorkflow);
          // Run in background (don't wait for it to finish to respond to webhook)
          engine.run({ owner, repo, prNumber }).then(() => console.log('PR Workflow finished'));
      } catch (e) {
          console.error('Failed to run PR workflow', e);
      }
  }

  res.status(200).send('Webhook received');
});

// AI Routes

// Analyze Code
router.post('/analyze', auth, async (req, res) => {
  const { code, type } = req.body;
  
  if (!code) {
      return res.status(400).json({ msg: 'No code provided' });
  }

  try {
      const analysis = await analyzeCode(code, type);
      res.json({ analysis });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Workflow Routes
import Workflow from '../models/Workflow.js'; // Default import
import { WorkflowEngine } from '../services/workflowEngine.js';

router.post('/workflow/:id/run', auth, async (req, res) => {
    const { id } = req.params;
    const triggerData = req.body; // Pass repo info here

    try {
        const workflow = await Workflow.findById(id); // Mongoose findById
        if (!workflow) {
            return res.status(404).json({ error: 'Workflow not found' });
        }

        const engine = new WorkflowEngine(workflow);
        const result = await engine.run(triggerData);
        
        res.json({ success: true, result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
