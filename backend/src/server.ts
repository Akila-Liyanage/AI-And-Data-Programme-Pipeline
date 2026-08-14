import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectDB } from './config/db';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health-check endpoint
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'AI & Data Programme Project Management System API is running',
    timestamp: new Date().toISOString(),
  });
});

// Start Server and connect to MongoDB
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});

export default app;
