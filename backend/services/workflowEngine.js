import { getRepoContent, getFileContent } from './githubService.js';
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
    const code = context.result.FETCH_FILE?.fileContent || context.data.code;
    const type = stepConfig.promptType || 'general';
    console.log(`[Workflow] Analyzing code with type: ${type}`);
    
    const analysis = await analyzeCode(code, type);
    return { analysisResult: analysis };
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
