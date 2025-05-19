
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import trainerRoutes from './routes/trainer';
import bookingRoutes from './routes/booking';
import { authenticate } from './middleware/authMiddleware';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors())
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/trainer', authenticate, trainerRoutes);
app.use('/api/booking', authenticate, bookingRoutes);
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
})


const dbUrl = process.env.MONGO_URL!
mongoose.connect(dbUrl).then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT || 3000, () => {
    console.log('Server running');
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
