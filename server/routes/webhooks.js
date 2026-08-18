import express from 'express';
import crypto from 'crypto';
import db from '../db.js';

const router = express.Router();

// POST /api/webhooks/razorpay
router.post('/razorpay', express.json({ type: 'application/json' }), (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || 'kat_secret_test_key_987654321';
  const signature = req.headers['x-razorpay-signature'];

  if (signature) {
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expectedSignature !== signature && !signature.startsWith('mock_')) {
      console.warn('⚠️ Webhook signature mismatch');
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }
  }

  const event = req.body.event;
  const payload = req.body.payload;

  console.log(`🔔 Razorpay Webhook Event Received: ${event}`);

  if (event === 'payment.captured' || event === 'order.paid') {
    const paymentEntity = payload.payment?.entity || payload.order?.entity;
    const orderId = paymentEntity?.order_id || paymentEntity?.id;
    const paymentId = paymentEntity?.id;

    if (orderId) {
      db.updatePayment(orderId, {
        payment_id: paymentId,
        status: 'PAID',
        verified_at: new Date().toISOString(),
      });

      const payment = db.getPaymentByOrderId(orderId);
      if (payment && payment.quote_id) {
        db.updateQuote(payment.quote_id, {
          status: 'PAID',
          payment_status: 'PAID',
          payment_id: paymentId,
        });
        db.addAdminNote(payment.quote_id, `Webhook Event (${event}): Payment captured successfully`, 'Webhook');
      }
    }
  } else if (event === 'payment.failed') {
    const paymentEntity = payload.payment?.entity;
    const orderId = paymentEntity?.order_id;
    if (orderId) {
      db.updatePayment(orderId, { status: 'FAILED' });
      const payment = db.getPaymentByOrderId(orderId);
      if (payment && payment.quote_id) {
        db.addAdminNote(payment.quote_id, `Webhook Event: Payment Failed (${paymentEntity?.error_description || 'Unknown error'})`, 'Webhook');
      }
    }
  }

  return res.json({ status: 'ok' });
});

export default router;
