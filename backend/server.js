import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import sequelize from './config/database.js';
import { User, Workflow, Integration } from './models/index.js'; // Ensure models are loaded

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database Sync
sequelize.sync({ force: false }) // Set force: true to drop tables on restart
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });

// Middleware
app.use(cors());
app.use(express.json());
import passport from './config/passport.js';
app.use(passport.initialize());

// Routes
import apiRoutes from './routes/api.js';
import authRoutes from './routes/auth.js';

app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'AI Development Workflow API is running...' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
