import mongoose from 'mongoose';

const IntegrationSchema = new mongoose.Schema({
  type: String, // e.g., 'github', 'jira'
  config: Object,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Integration', IntegrationSchema);
