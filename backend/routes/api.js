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
// Hook for GitHub Webhook
router.post('/github/webhook', async (req, res) => {
  const event = req.headers['x-github-event'];
  const payload = req.body;
  
  if (event === 'pull_request' && payload.action === 'opened') {
      console.log(`[Webhook] PR #${payload.number} opened in ${payload.repository.full_name}`);
      
      const owner = payload.repository.owner.login;
      const repo = payload.repository.name;
      const prNumber = payload.number;

      try {
          // Find the "PR Review Bot" workflow for this user (or system wide)
          // For MVP, finding ANY active PR bot or falling back to a default configuration
          let workflow = await Workflow.findOne({ type: 'system_pr_bot', status: 'active' });
          
          if (!workflow) {
              console.log('[Webhook] No active PR Bot workflow found in DB. Using fallback ephemeral config, but logs wont attach to ID.');
              // Fallback (this won't show in UI history easily if no ID)
               workflow = {
                  _id: null,
                  name: "Ephemeral PR Bot",
                  steps: [
                      { id: 'step_1', action: 'FETCH_PR_CHANGES' },
                      { id: 'step_2', action: 'ANALYZE_CODE', config: { promptType: 'review_json' } },
                      { id: 'step_3', action: 'POST_PR_COMMENT' }
                  ]
              };
          }

          // Create Log Entry
          const logEntry = new WorkflowLog({
              workflowId: workflow._id, // Might be null if fallback
              triggerType: 'WEBHOOK_PR',
              triggerData: {
                  owner,
                  repo,
                  prNumber,
                  title: payload.pull_request.title,
                  url: payload.pull_request.html_url
              },
              status: 'RUNNING'
          });
          
          if (workflow._id) await logEntry.save();

          const engine = new WorkflowEngine(workflow);
          const result = await engine.run({ owner, repo, prNumber });
          
          // Update Log Entry with Success
           if (workflow._id) {
               logEntry.status = 'SUCCESS';
               logEntry.logs = [result]; // Simplified logging of the whole context result
               await logEntry.save();
           }

          console.log('PR Workflow finished');
      } catch (e) {
          console.error('Failed to run PR workflow', e);
          // Try to log failure
           // (Requires keeping scope of logEntry, simplified here for brevity)
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
import Workflow from '../models/Workflow.js'; 
import WorkflowLog from '../models/WorkflowLog.js';
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

router.get('/workflows', auth, async (req, res) => {
    try {
        const workflows = await Workflow.find({ user: req.user.id });
        res.json(workflows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/workflow/:id/logs', auth, async (req, res) => {
    try {
        const logs = await WorkflowLog.find({ workflowId: req.params.id }).sort({ createdAt: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
