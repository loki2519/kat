import express from 'express';
import db from '../db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// PUBLIC: Submit Quote Request
router.post('/', (req, res) => {
  const { name, email, phone, service, description, budget, preferred_date, additional_reqs } = req.body;

  if (!name || !email || !phone || !service || !description) {
    return res.status(400).json({ error: 'Please provide all required fields (Name, Email, Phone, Service, Description).' });
  }

  try {
    // 1. Create or reference Customer
    const customer = db.createCustomer({ name, email, phone });

    const servicePrices = {
      'Wishing & Gifting Websites': 599,
      'Final Year College Projects': 4999,
      'Poster Design': 99,
      'Marathon / Sports Websites': 6999,
      'Promotional Video Making': 399,
      'Custom Websites': 1500,
    };
    const defaultQuotedAmount = servicePrices[service] || 599;

    // 2. Create Quote
    const quote = db.createQuote({
      customer_id: customer.id,
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      service_name: service,
      description,
      budget: budget || 'Not specified',
      preferred_date,
      additional_reqs,
      quoted_amount: defaultQuotedAmount,
      status: 'QUOTED',
    });

    return res.status(201).json({
      message: 'Your quotation request has been received successfully.',
      quote_id: quote.quote_id,
      quote,
    });
  } catch (err) {
    console.error('Error creating quote:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// PUBLIC: Check specific Quote status by ID (KAT-Q-XXXXXX)
router.get('/track/:quoteId', (req, res) => {
  const { quoteId } = req.params;
  const quote = db.getQuoteById(quoteId);

  if (!quote) {
    return res.status(404).json({ error: 'Quotation not found. Please check your Quote ID.' });
  }

  // Sanitize object for public client view
  return res.json({
    quote_id: quote.quote_id,
    service_name: quote.service_name,
    customer_name: quote.customer_name,
    customer_email: quote.customer_email,
    customer_phone: quote.customer_phone,
    description: quote.description,
    budget: quote.budget,
    status: quote.status,
    quoted_amount: quote.quoted_amount,
    payment_status: quote.payment_status,
    payment_id: quote.payment_id,
    created_at: quote.created_at,
  });
});

// ADMIN: Get All Quotes (Search, Filter, Sort)
router.get('/admin/all', authenticateAdmin, (req, res) => {
  const { status, search, sort } = req.query;
  let quotes = db.getQuotes();

  // Filter by status
  if (status && status !== 'ALL') {
    quotes = quotes.filter(q => q.status.toUpperCase() === status.toUpperCase());
  }

  // Search by Quote ID, Name, Email, Phone, Service
  if (search) {
    const query = search.toLowerCase();
    quotes = quotes.filter(q =>
      q.quote_id.toLowerCase().includes(query) ||
      q.customer_name.toLowerCase().includes(query) ||
      q.customer_email.toLowerCase().includes(query) ||
      q.customer_phone.includes(query) ||
      q.service_name.toLowerCase().includes(query)
    );
  }

  // Sort
  if (sort === 'oldest') {
    quotes.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  } else {
    // default newest
    quotes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  return res.json({
    count: quotes.length,
    quotes,
  });
});

// ADMIN: Update Quote Status / Price / Details
router.put('/admin/:quoteId', authenticateAdmin, (req, res) => {
  const { quoteId } = req.params;
  const { status, quoted_amount, admin_note } = req.body;

  const existingQuote = db.getQuoteById(quoteId);
  if (!existingQuote) {
    return res.status(404).json({ error: 'Quote not found' });
  }

  const updates = {};
  if (status) updates.status = status;
  if (quoted_amount !== undefined) updates.quoted_amount = Number(quoted_amount);

  const updatedQuote = db.updateQuote(quoteId, updates);

  if (admin_note) {
    db.addAdminNote(quoteId, admin_note, req.user.username);
  }

  const notes = db.getAdminNotes(quoteId);

  return res.json({
    message: 'Quote updated successfully',
    quote: updatedQuote,
    notes,
  });
});

// ADMIN: Get Quote Details & Admin Notes
router.get('/admin/details/:quoteId', authenticateAdmin, (req, res) => {
  const { quoteId } = req.params;
  const quote = db.getQuoteById(quoteId);

  if (!quote) {
    return res.status(404).json({ error: 'Quote not found' });
  }

  const notes = db.getAdminNotes(quoteId);

  return res.json({
    quote,
    notes,
  });
});

// ADMIN: Delete Quote Request
router.delete('/admin/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const deleted = db.deleteQuote(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Quote not found or already deleted.' });
  }
  return res.json({ message: 'Quotation deleted successfully.', quote_id: id });
});

export default router;
