import { getRepoContent, getFileContent, getPullRequestFiles, createReviewComment } from './githubService.js';
import { analyzeCode } from './aiService.js';

// Registry of available actions
const ACTION_REGISTRY = {
  'FETCH_FILE': async (context, stepConfig) => {
    // Expects context to have repo info, stepConfig to have path
    const { owner, repo } = context.triggerData; 
    const path = stepConfig.path || context.data.path; // Can come from config or previous data
    console.log(`[Workflow] Fetching file: ${path} from ${owner}/${repo}`);
    
    const content = await getFileContent(owner, repo, path);
    return { fileContent: content };
  },
  
  'ANALYZE_CODE': async (context, stepConfig) => {
    // Try to find code from previous fetch step 
    // This handles both FETCH_FILE (single file) and FETCH_PR_CHANGES (array of files) - though logic would differ
    const singleFileContent = context.result.step_1?.fileContent || context.result.FETCH_FILE?.fileContent || context.data.code;
    
    // Check if we are analyzing PR changes
    const prChanges = context.result.FETCH_PR_CHANGES?.changes || context.result.step_1?.changes;

    if (prChanges) {
         console.log(`[Workflow] Analyzing ${prChanges.length} changed files from PR.`);
         const reviewComments = [];
         
         for (const file of prChanges) {
             if (file.status === 'removed' || !file.patch) continue;
             
             // Analyze the diff (patch)
             const prompt = `Review this code diff for ${file.filename}. \n\n${file.patch}\n\nReturn ONLY a JSON array of issues in this format: [{"line": <line_number_in_diff>, "comment": "<feedback>"}]`;
             try {
                const analysisJson = await analyzeCode(prompt, 'review_json'); // Need 'review_json' prompt type support
                const comments = JSON.parse(analysisJson);
                if (Array.isArray(comments)) {
                    comments.forEach(c => {
                        reviewComments.push({ ...c, path: file.filename });
                    });
                }
             } catch (e) {
                 console.error(`Failed to analyze ${file.filename}`, e);
             }
         }
         return { reviewComments };
    }

    // Single file fallback
    const type = stepConfig.promptType || 'general';
    console.log(`[Workflow] Analyzing code with type: ${type}`);
    const analysis = await analyzeCode(singleFileContent || 'No Code', type);
    return { analysisResult: analysis };
  },

  'FETCH_PR_CHANGES': async (context, stepConfig) => {
      const { owner, repo, prNumber } = context.triggerData;
      console.log(`[Workflow] Fetching PR #${prNumber} changes from ${owner}/${repo}`);
      const changes = await getPullRequestFiles(owner, repo, prNumber);
      return { changes };
  },

  'POST_PR_COMMENT': async (context, stepConfig) => {
      const { owner, repo, prNumber } = context.triggerData;
      const reviewComments = context.result.ANALYZE_CODE?.reviewComments || context.result.step_2?.reviewComments;
      
      if (!reviewComments || reviewComments.length === 0) {
          console.log('[Workflow] No comments to post.');
          return { posted: 0 };
      }

      console.log(`[Workflow] Posting ${reviewComments.length} comments to PR #${prNumber}`);
      let postedCount = 0;
      for (const comment of reviewComments) {
          const success = await createReviewComment(owner, repo, prNumber, comment.comment, comment.path, comment.line);
          if (success) postedCount++;
      }
      return { posted: postedCount };
  },
  
  'LOG_RESULT': async (context, stepConfig) => {
    console.log('[Workflow] Result Log:', JSON.stringify(context.result, null, 2));
    return { logged: true };
  }
};

export class WorkflowEngine {
  constructor(workflow) {
    this.workflow = workflow;
    this.context = {
      data: {},       // Initial data from trigger
      result: {},     // Results from each step keyed by Action Name or Step ID
      triggerData: {} // specific trigger info (e.g. repo details)
    };
  }

  async run(triggerData) {
    console.log(`[Workflow] Starting Workflow: ${this.workflow.name}`);
    this.context.triggerData = triggerData;

    try {
      const steps = this.workflow.steps || [];
      
      for (const step of steps) {
        const actionName = step.action;
        const actionFn = ACTION_REGISTRY[actionName];
        
        if (!actionFn) {
          console.error(`[Workflow] Unknown action: ${actionName}`);
          continue;
        }

        console.log(`[Workflow] Executing Step: ${step.id || actionName}`);
        
        // Execute Action
        try {
            const output = await actionFn(this.context, step.config || {});
            // Store result for future steps
            this.context.result[step.id || actionName] = output;
        } catch (stepError) {
             console.error(`[Workflow] Step ${step.id || actionName} failed:`, stepError);
             throw stepError; // Re-throw to Stop workflow or handle gracefully
        }
      }
      
      console.log(`[Workflow] Workflow Completed.`);
      return this.context.result;
    } catch (error) {
      console.error(`[Workflow] Execution Failed:`, error);
      throw error;
    }
  }
}
