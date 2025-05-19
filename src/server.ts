import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth';
import trainerRoutes from './routes/trainer';
import bookingRoutes from './routes/booking';
import { authenticate } from './middleware/authMiddleware';
import { config } from './config';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/trainer', authenticate, trainerRoutes);
app.use('/api/booking', authenticate, bookingRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

mongoose.connect(config.mongoUrl)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
