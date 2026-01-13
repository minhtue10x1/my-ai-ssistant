import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false // OAuth users might not provide this immediately
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false // OAuth users don't have passwords
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allow null/undefined to not conflict
  },
  role: {
    type: String,
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', UserSchema);
