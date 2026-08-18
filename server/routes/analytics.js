import express from 'express';
import db from '../db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// ADMIN: Get Dashboard Analytics & Overview Metrics
router.get('/overview', authenticateAdmin, (req, res) => {
  const quotes = db.getQuotes();
  const payments = db.getPayments();
  const contactSubmissions = db.getContactSubmissions();

  const totalQuotes = quotes.length;
  const newQuotes = quotes.filter(q => q.status === 'NEW').length;
  const approvedQuotes = quotes.filter(q => q.status === 'APPROVED' || q.status === 'QUOTED').length;
  const paidQuotes = quotes.filter(q => q.status === 'PAID' || q.payment_status === 'PAID').length;
  const activeProjects = quotes.filter(q => q.status === 'IN PROGRESS' || q.status === 'PAID').length;
  const completedProjects = quotes.filter(q => q.status === 'COMPLETED').length;

  // Calculate Total Revenue from verified payments & paid quotes
  const totalRevenue = quotes
    .filter(q => q.status === 'PAID' || q.payment_status === 'PAID' || q.status === 'COMPLETED')
    .reduce((sum, q) => sum + (q.quoted_amount || 0), 0);

  // Conversion rate (Paid Quotes / Total Quotes * 100)
  const conversionRate = totalQuotes > 0 ? ((paidQuotes / totalQuotes) * 100).toFixed(1) : '0.0';

  // Popular services breakdown
  const serviceCounts = {};
  for (const q of quotes) {
    serviceCounts[q.service_name] = (serviceCounts[q.service_name] || 0) + 1;
  }
  const popularServices = Object.entries(serviceCounts)
    .map(([service, count]) => ({ service, count }))
    .sort((a, b) => b.count - a.count);

  // Status breakdown
  const statusCounts = {
    NEW: quotes.filter(q => q.status === 'NEW').length,
    CONTACTED: quotes.filter(q => q.status === 'CONTACTED').length,
    QUOTED: quotes.filter(q => q.status === 'QUOTED').length,
    APPROVED: quotes.filter(q => q.status === 'APPROVED').length,
    PAID: paidQuotes,
    IN_PROGRESS: activeProjects,
    COMPLETED: completedProjects,
    CANCELLED: quotes.filter(q => q.status === 'CANCELLED').length,
  };

  return res.json({
    metrics: {
      totalQuotes,
      newQuotes,
      approvedQuotes,
      paidQuotes,
      totalRevenue,
      activeProjects,
      completedProjects,
      conversionRate: `${conversionRate}%`,
      unreadMessages: contactSubmissions.filter(c => c.status === 'UNREAD').length,
    },
    popularServices,
    statusCounts,
    recentQuotes: quotes.slice(0, 5),
    recentPayments: payments.slice(0, 5),
  });
});

export default router;
