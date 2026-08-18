import express from 'express';
import db from '../db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// PUBLIC: Submit Contact Message
router.post('/', (req, res) => {
  const { name, email, phone, service, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: 'Please fill in all required fields (Name, Email, Phone, Message)' });
  }

  try {
    const contact = db.createContactSubmission({ name, email, phone, service, message });
    return res.status(201).json({
      message: 'Thank you for reaching out to KAT! Our team will contact you shortly.',
      id: contact.id,
    });
  } catch (err) {
    console.error('Error submitting contact form:', err);
    return res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

// ADMIN: Get Contact Messages
router.get('/admin/all', authenticateAdmin, (req, res) => {
  const contacts = db.getContactSubmissions();
  return res.json({
    count: contacts.length,
    contacts,
  });
});

export default router;
