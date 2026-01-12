import mongoose from 'mongoose';

const WorkflowLogSchema = new mongoose.Schema({
  workflowId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workflow',
    required: true
  },
  triggerType: {
    type: String, // e.g., 'WEBHOOK_PR', 'MANUAL'
    required: true
  },
  triggerData: {
    type: Object, // Stores PR info (repo, number, title)
    required: true
  },
  status: {
    type: String, // 'SUCCESS', 'FAILED', 'RUNNING'
    default: 'RUNNING'
  },
  logs: {
    type: Array, // Array of step results/logs
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('WorkflowLog', WorkflowLogSchema);
