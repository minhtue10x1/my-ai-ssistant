import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import passport from './config/passport.js';

dotenv.config();

// Connect Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
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
