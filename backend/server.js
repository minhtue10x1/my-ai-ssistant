import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
import apiRoutes from './routes/api.js';
app.use('/api', apiRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'AI Development Workflow API is running...' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
