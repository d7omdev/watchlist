import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import entriesRouter from './routes/entries';
import uploadRouter from './routes/upload';
import { authMiddleware } from './middleware/auth';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/profile', authMiddleware, userRouter);
app.use('/api/entries', authMiddleware, entriesRouter);
app.use('/api/upload', authMiddleware, uploadRouter);

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});