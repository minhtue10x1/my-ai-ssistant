import mongoose from 'mongoose';

const StepSchema = new mongoose.Schema({
  id: String,
  action: String,
  config: Object // Generic object for config
}, { _id: false });

const WorkflowSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  steps: [StepSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Workflow', WorkflowSchema);
