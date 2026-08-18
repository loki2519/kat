import express from 'express';
import db from '../db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// PUBLIC: Submit a new review/feedback
router.post('/', (req, res) => {
  const { name, role, service, rating, comment } = req.body;
  if (!name || !comment) {
    return res.status(400).json({ error: 'Name and comment are required.' });
  }
  try {
    const review = db.createReview({ name, role, service, rating, comment });
    return res.status(201).json({
      message: 'Thank you! Your review has been submitted and will appear after approval.',
      review,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to submit review.' });
  }
});

// PUBLIC: Get all approved reviews
router.get('/approved', (req, res) => {
  const reviews = db.getApprovedReviews();
  return res.json({ count: reviews.length, reviews });
});

// ADMIN: Get all reviews (pending + approved + rejected)
router.get('/admin/all', authenticateAdmin, (req, res) => {
  const reviews = db.getAllReviews();
  return res.json({ count: reviews.length, reviews });
});

// ADMIN: Approve or Reject a review
router.put('/admin/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Use APPROVED, REJECTED, or PENDING.' });
  }
  const updated = db.updateReview(id, { status });
  if (!updated) {
    return res.status(404).json({ error: 'Review not found.' });
  }
  return res.json({ message: `Review ${status.toLowerCase()} successfully.`, review: updated });
});

// ADMIN: Delete a review
router.delete('/admin/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const deleted = db.deleteReview(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Review not found or already deleted.' });
  }
  return res.json({ message: 'Review deleted successfully.', id });
});

export default router;
