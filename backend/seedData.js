import sequelize from './config/database.js';
import { Workflow, User } from './models/index.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const seed = async () => {
  await sequelize.sync({ force: true }); // Force sync to recreate tables with new schema

  // Create a default user if not exists (for ownership)
  let user = await User.findOne({ where: { username: 'testuser' } });
  if (!user) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword 
    });
  }

  // Define a sample workflow
  const sampleWorkflow = {
    name: 'Auto-Review Code',
    description: 'Fetches a file and runs AI analysis on it.',
    status: 'active',
    triggerType: 'manual',
    userId: user.id,
    steps: [
      {
        id: 'step_1',
        action: 'FETCH_FILE',
        config: { path: 'backend/server.js' } // Hardcoded for test
      },
      {
        id: 'step_2',
        action: 'ANALYZE_CODE',
        config: { promptType: 'review' }
      },
      {
        id: 'step_3',
        action: 'LOG_RESULT',
        config: {}
      }
    ]
  };

  await Workflow.create(sampleWorkflow);
  console.log('Seed data inserted successfully.');
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
