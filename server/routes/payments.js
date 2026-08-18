import express from 'express';
import db from '../db.js';
import { createRazorpayOrder, verifyPaymentSignature, verifyWebhookSignature } from '../utils/razorpay.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// PUBLIC: Create Razorpay Order for a Quote
router.post('/create-order', async (req, res) => {
  const { quote_id } = req.body;

  if (!quote_id) {
    return res.status(400).json({ error: 'Quote ID is required to create a payment order' });
  }

  const quote = db.getQuoteById(quote_id);
  if (!quote) {
    return res.status(404).json({ error: 'Quotation not found' });
  }

  if (quote.quoted_amount <= 0) {
    return res.status(400).json({ error: 'This quotation has not been priced by KAT admin yet. Please wait for custom quotation.' });
  }

  if (quote.payment_status === 'PAID') {
    return res.status(400).json({ error: 'This quotation has already been paid and verified.' });
  }

  try {
    const order = await createRazorpayOrder({
      amount: quote.quoted_amount,
      currency: 'INR',
      receipt: `rcpt_${quote.quote_id}`,
      notes: {
        quote_id: quote.quote_id,
        customer_name: quote.customer_name,
        service_name: quote.service_name,
      },
    });

    // Save payment record in DB with CREATED status
    db.createPayment({
      quote_id: quote.quote_id,
      order_id: order.id,
      customer_id: quote.customer_id,
      customer_name: quote.customer_name,
      customer_email: quote.customer_email,
      customer_phone: quote.customer_phone,
      service_name: quote.service_name,
      amount: quote.quoted_amount,
      currency: 'INR',
      status: 'CREATED',
    });

    // Link order_id to quote
    db.updateQuote(quote.quote_id, {
      order_id: order.id,
      status: 'PAYMENT PENDING',
    });

    return res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      quote_id: quote.quote_id,
      service_name: quote.service_name,
      customer_name: quote.customer_name,
      customer_email: quote.customer_email,
      customer_phone: quote.customer_phone,
    });
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    return res.status(500).json({
      error: `Razorpay Order Creation Failed: ${err.message || 'Check server Razorpay API keys.'}`
    });
  }
});

// PUBLIC: Verify Razorpay Payment Signature
router.post('/verify', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, quote_id } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !quote_id) {
    return res.status(400).json({ error: 'Missing required payment verification parameters (razorpay_order_id, razorpay_payment_id, razorpay_signature)' });
  }

  const isValid = verifyPaymentSignature({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });

  if (!isValid) {
    db.updatePayment(razorpay_order_id, {
      status: 'VERIFICATION_FAILED',
    });
    return res.status(400).json({ error: 'Server-side payment signature verification failed. HMAC SHA256 mismatch.' });
  }

  // Signature is valid -> Mark payment as VERIFIED / PAID in database
  db.updatePayment(razorpay_order_id, {
    payment_id: razorpay_payment_id,
    status: 'VERIFIED',
    signature: razorpay_signature,
    verified_at: new Date().toISOString(),
  });

  // Update Quote status to PAID
  const updatedQuote = db.updateQuote(quote_id, {
    status: 'PAID',
    payment_status: 'PAID',
    payment_id: razorpay_payment_id,
  });

  db.addAdminNote(quote_id, `Payment verified via Razorpay ID: ${razorpay_payment_id}`, 'System');

  return res.json({
    success: true,
    message: 'Payment verified successfully',
    quote_id: updatedQuote.quote_id,
    payment_id: razorpay_payment_id,
    order_id: razorpay_order_id,
    amount: updatedQuote.quoted_amount,
    service_name: updatedQuote.service_name,
    customer_name: updatedQuote.customer_name,
    status: 'VERIFIED',
  });
});

// PUBLIC: Razorpay Webhook Handler
router.post('/webhook', (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const body = req.body;

  const isValid = verifyWebhookSignature({
    body,
    signature,
    secret: process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET,
  });

  if (!isValid) {
    console.warn('⚠️ Razorpay webhook signature verification failed.');
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  const event = body.event;
  const payload = body.payload;

  if (event === 'payment.captured' || event === 'order.paid') {
    const paymentEntity = payload.payment?.entity || payload.order?.entity;
    const orderId = paymentEntity.order_id || paymentEntity.id;
    const paymentId = paymentEntity.id;
    const quoteId = paymentEntity.notes?.quote_id;

    if (orderId) {
      db.updatePayment(orderId, {
        payment_id: paymentId,
        status: 'VERIFIED',
        verified_at: new Date().toISOString(),
      });
    }

    if (quoteId) {
      db.updateQuote(quoteId, {
        status: 'PAID',
        payment_status: 'PAID',
        payment_id: paymentId,
      });
    }
  } else if (event === 'payment.failed') {
    const paymentEntity = payload.payment?.entity;
    const orderId = paymentEntity?.order_id;
    if (orderId) {
      db.updatePayment(orderId, {
        status: 'FAILED',
      });
    }
  }

  return res.json({ status: 'ok' });
});

// PUBLIC: Initiate PhonePe / Google Pay UPI Payment (Status: PENDING)
router.post('/initiate-upi', (req, res) => {
  const { quote_id, payment_method = 'PhonePe', transaction_ref = '' } = req.body;

  if (!quote_id) {
    return res.status(400).json({ error: 'Quote ID is required to initiate payment' });
  }

  const quote = db.getQuoteById(quote_id);
  if (!quote) {
    return res.status(404).json({ error: 'Quotation not found' });
  }

  if (quote.quoted_amount <= 0) {
    return res.status(400).json({ error: 'This quotation has not been priced by KAT admin yet.' });
  }

  if (quote.payment_status === 'PAID') {
    return res.status(400).json({ error: 'This quotation has already been paid and verified.' });
  }

  const upiId = process.env.VITE_KAT_UPI_ID || process.env.KAT_UPI_ID || 'katdigital@ybl';
  const payeeName = process.env.VITE_KAT_PAYEE_NAME || process.env.KAT_PAYEE_NAME || 'KAT Digital Solutions';
  const validMethod = ['PhonePe', 'Google Pay', 'UPI'].includes(payment_method) ? payment_method : 'PhonePe';

  // Save payment record in DB with PENDING status (Not PAID until verified!)
  const payment = db.createPayment({
    quote_id: quote.quote_id,
    order_id: `upi_${validMethod.toLowerCase().replace(/\s+/g, '')}_${Date.now()}`,
    payment_id: transaction_ref ? `ref_${transaction_ref}` : null,
    payment_method: validMethod,
    customer_id: quote.customer_id,
    customer_name: quote.customer_name,
    customer_email: quote.customer_email,
    customer_phone: quote.customer_phone,
    service_name: quote.service_name,
    amount: quote.quoted_amount,
    currency: 'INR',
    status: 'PENDING', // Verification Pending
    signature: transaction_ref || null,
  });

  db.updateQuote(quote.quote_id, {
    status: 'PAYMENT PENDING',
    payment_status: 'PENDING',
  });

  db.addAdminNote(quote.quote_id, `UPI payment initiated via ${validMethod}. Verification pending.`, 'System');

  return res.json({
    success: true,
    message: `Payment initiated via ${validMethod}. Verification pending.`,
    quote_id: quote.quote_id,
    payment_method: validMethod,
    status: 'PENDING',
    upi_id: upiId,
    payee_name: payeeName,
    amount: quote.quoted_amount,
    service_name: quote.service_name,
    customer_name: quote.customer_name,
  });
});

// ADMIN: Get All Payment Records
router.get('/admin/all', authenticateAdmin, (req, res) => {
  const payments = db.getPayments();
  return res.json({
    count: payments.length,
    payments,
  });
});

// ADMIN: Verify / Approve Pending UPI Payment
router.post('/admin/verify-manual', authenticateAdmin, (req, res) => {
  const { quote_id, payment_id, transaction_ref } = req.body;

  if (!quote_id) {
    return res.status(400).json({ error: 'Quote ID is required' });
  }

  const quote = db.getQuoteById(quote_id);
  if (!quote) {
    return res.status(404).json({ error: 'Quotation not found' });
  }

  const realPaymentId = payment_id || transaction_ref || `upi_pay_${Date.now()}`;

  // Update payment status in database
  const payment = db.getPayments().find(p => p.quote_id === quote_id);
  if (payment) {
    db.updatePayment(payment.order_id, {
      payment_id: realPaymentId,
      status: 'VERIFIED',
      signature: transaction_ref || payment.signature || 'admin_manual_verification',
      verified_at: new Date().toISOString(),
    });
  }

  // Update quote status to PAID
  const updatedQuote = db.updateQuote(quote_id, {
    status: 'PAID',
    payment_status: 'PAID',
    payment_id: realPaymentId,
  });

  db.addAdminNote(quote_id, `Payment manually verified & approved by KAT Admin (ID: ${realPaymentId})`, 'Admin');

  return res.json({
    success: true,
    message: 'Payment verified and approved successfully',
    quote_id: updatedQuote.quote_id,
    payment_id: realPaymentId,
    status: 'VERIFIED',
  });
});

// ADMIN: Delete Payment Record
router.delete('/admin/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const deleted = db.deletePayment(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Payment record not found or already deleted.' });
  }
  return res.json({ message: 'Payment record deleted successfully.', id });
});

export default router;
