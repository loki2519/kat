import express from 'express';
import db from '../db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// PUBLIC: Get active news items for ticker
router.get('/public', (req, res) => {
  const activeNews = db.getActiveNews();
  return res.json({ success: true, news: activeNews });
});

// ADMIN: Get all news items
router.get('/', authenticateAdmin, (req, res) => {
  const news = db.getNews();
  return res.json({ success: true, news });
});

// ADMIN: Add news item
router.post('/', authenticateAdmin, (req, res) => {
  const { text, status } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'News text is required.' });
  }

  const newsItem = db.createNews({
    text: text.trim(),
    status: status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
  });

  return res.json({ success: true, news: newsItem });
});

// ADMIN: Edit news item
router.put('/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { text, status } = req.body;

  const updates = {};
  if (text !== undefined) updates.text = text.trim();
  if (status !== undefined) updates.status = status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

  const updated = db.updateNews(id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'News item not found.' });
  }

  return res.json({ success: true, news: updated });
});

// ADMIN: Delete ALL news items — MUST come before /:id to avoid param capture
router.delete('/all/clear', authenticateAdmin, (req, res) => {
  db.deleteAllNews();
  return res.json({ success: true, message: 'All news items deleted.' });
});

// ADMIN: Delete single news item
router.delete('/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const deleted = db.deleteNews(id);
  if (!deleted) {
    return res.status(404).json({ error: 'News item not found.' });
  }

  return res.json({ success: true, message: 'News item deleted.' });
});

export default router;
