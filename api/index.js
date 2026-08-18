import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from '../server/db.js';
import authRoutes from '../server/routes/auth.js';
import quoteRoutes from '../server/routes/quotes.js';
import paymentRoutes from '../server/routes/payments.js';
import webhookRoutes from '../server/routes/webhooks.js';
import analyticsRoutes from '../server/routes/analytics.js';
import contactRoutes from '../server/routes/contact.js';
import reviewRoutes from '../server/routes/reviews.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database in serverless execution context
initDb();

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    company: 'KAT',
    tagline: 'CREATE. DESIGN. DELIVER. ELEVATE.',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reviews', reviewRoutes);

export default app;
