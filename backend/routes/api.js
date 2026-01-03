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
router.post('/github/webhook', (req, res) => {
  console.log('GitHub Webhook received:', req.body);
  // Future: Trigger Workflow Engine here
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
import { Workflow } from '../models/index.js';
import { WorkflowEngine } from '../services/workflowEngine.js';

router.post('/workflow/:id/run', auth, async (req, res) => {
    const { id } = req.params;
    const triggerData = req.body; // Pass repo info here

    try {
        const workflow = await Workflow.findByPk(id);
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
