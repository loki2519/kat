import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { initDb } from './db.js';
import authRoutes from './routes/auth.js';
import quoteRoutes from './routes/quotes.js';
import paymentRoutes from './routes/payments.js';
import webhookRoutes from './routes/webhooks.js';
import analyticsRoutes from './routes/analytics.js';
import contactRoutes from './routes/contact.js';
import reviewRoutes from './routes/reviews.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Parse JSON body (webhooks route handles raw body verification internally)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Database
initDb();

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    company: 'KAT',
    tagline: 'CREATE. DESIGN. DELIVER. ELEVATE.',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reviews', reviewRoutes);

// Serve Frontend Static Build files in Production
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('KAT API Server Online. Frontend build not generated yet. Run npm run dev for frontend.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 KAT Corporate Backend API Running on Port ${PORT}`);
  console.log(`🌐 Public Website API: http://localhost:${PORT}/api`);
  console.log(`🔐 Private Admin Auth: http://localhost:${PORT}/api/auth/login`);
  console.log(`====================================================`);
});
