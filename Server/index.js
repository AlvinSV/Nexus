import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import voteRoutes from './routes/voteRoutes.js';
import dns from 'dns';
dns.setServers(['8.8.8.8','8.8.4.4']);
dotenv.config();
await connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  const originalSend = res.send;
  res.send = function(body) {
    console.log(`[Response] ${res.statusCode} to ${req.method} ${req.url}`);
    return originalSend.call(this, body);
  };
  next();
});
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(clerkMiddleware());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Nexus API running' });
});
app.use('/api/users', userRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/votes', voteRoutes);
// Routes will be added here in Stage 3

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));