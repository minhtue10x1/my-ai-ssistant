import mongoose from 'mongoose';
import User from './models/User.js';
import Workflow from './models/Workflow.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Clear existing data (optional, but good for idempotent seed)
    await User.deleteMany({});
    await Workflow.deleteMany({});

    // Create User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword 
    });
    console.log(`User created: ${user.email}`);

    // Create Workflow
    const workflow = await Workflow.create({
        name: 'Auto-Review Code',
        user: user._id,
        steps: [
            { id: 'step_1', action: 'FETCH_FILE', config: { path: 'backend/server.js' } },
            { id: 'step_2', action: 'ANALYZE_CODE', config: { promptType: 'review' } },
            { id: 'step_3', action: 'LOG_RESULT' }
        ]
    });
    console.log(`Workflow created: ${workflow.name}`);
    console.log(`WORKFLOW_ID=${workflow._id}`); // Output ID for frontend config

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
