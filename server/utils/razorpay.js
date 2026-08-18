import crypto from 'crypto';
import Razorpay from 'razorpay';

export function getRazorpayInstance() {
  const key_id = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error('Razorpay API credentials (RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET) are missing in environment variables.');
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
}

export async function createRazorpayOrder({ amount, currency = 'INR', receipt, notes = {} }) {
  // Amount in Razorpay is in paise (smallest currency unit: ₹100 = 10000 paise)
  const amountInPaise = Math.round(Number(amount) * 100);

  if (isNaN(amountInPaise) || amountInPaise <= 0) {
    throw new Error(`Invalid payment amount: ₹${amount}`);
  }

  const razorpay = getRazorpayInstance();

  // Create real order on Razorpay servers
  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency,
    receipt,
    notes,
  });

  return {
    id: order.id,
    entity: order.entity,
    amount: order.amount,
    currency: order.currency,
    receipt: order.receipt,
    status: order.status,
    created_at: order.created_at,
  };
}

export function verifyPaymentSignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_secret) {
    throw new Error('RAZORPAY_KEY_SECRET is missing in environment variables.');
  }

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return false;
  }

  // HMAC SHA256 Signature verification: generated_signature = hmac_sha256(order_id + "|" + payment_id, secret)
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', key_secret)
    .update(body.toString())
    .digest('hex');

  return expectedSignature === razorpay_signature;
}

export function verifyWebhookSignature({ body, signature, secret }) {
  const webhookSecret = secret || process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
  if (!webhookSecret || !signature || !body) return false;

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(typeof body === 'string' ? body : JSON.stringify(body))
    .digest('hex');

  return expectedSignature === signature;
}
