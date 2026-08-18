import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFilePath = process.env.DATABASE_FILE || path.join(__dirname, '..', 'kat_database.json');

let memoryDb = {
  users: [],
  services: [],
  customers: [],
  quotes: [],
  payments: [],
  admin_notes: [],
  contact_submissions: [],
  reviews: [],
};

// Load persistent data from JSON file
function loadDb() {
  if (fs.existsSync(dbFilePath)) {
    try {
      const content = fs.readFileSync(dbFilePath, 'utf-8');
      memoryDb = { ...memoryDb, ...JSON.parse(content) };
    } catch (e) {
      console.error('Error loading KAT DB, initializing new:', e);
    }
  } else {
    saveDb();
  }
}

// Persist data back to JSON file synchronously
function saveDb() {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(memoryDb, null, 2), 'utf-8');
  } catch (e) {
    try {
      const tmpPath = path.join('/tmp', 'kat_database.json');
      fs.writeFileSync(tmpPath, JSON.stringify(memoryDb, null, 2), 'utf-8');
    } catch (tmpErr) {
      console.warn('DB in-memory fallback active (read-only filesystem environment):', tmpErr.message);
    }
  }
}

export function initDb() {
  console.log('⚡ Initializing KAT Database Store at:', dbFilePath);
  loadDb();

  // Seed default admin if none exists
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'adminkat123';

  if (!memoryDb.users.some(u => u.username === adminUsername)) {
    const hash = bcrypt.hashSync(adminPassword, 10);
    memoryDb.users.push({
      id: memoryDb.users.length + 1,
      username: adminUsername,
      email: 'admin@katdigital.com',
      password_hash: hash,
      role: 'admin',
      created_at: new Date().toISOString()
    });
    saveDb();
    console.log(`✅ Seeded default admin user: ${adminUsername}`);
  }

  // Seed default 6 KAT services if none exist
  if (memoryDb.services.length === 0) {
    const defaultServices = [
      {
        id: 1,
        slug: 'wishing-gifting',
        title: 'Wishing & Gifting Websites',
        starting_price: 599,
        price_display: 'Starting at ₹599+',
        short_description: 'Interactive digital experiences designed to turn birthdays, anniversaries and special moments into memorable online gifts.',
        deliverables: ['Custom Interactive Animations', 'Music & Photo Slideshows', 'Personalized Wishes & QR Code', 'Mobile & Desktop Responsive', '1-Year Fast Cloud Hosting'],
      },
      {
        id: 2,
        slug: 'college-projects',
        title: 'Final Year College Projects',
        starting_price: 4999,
        price_display: 'Starting at ₹4,999+',
        short_description: 'Complete academic project solutions with modern interfaces, documentation support and practical technology implementation.',
        deliverables: ['Full Source Code & Architecture', 'Comprehensive Project Report/Doc', 'Database & Backend API Implementation', 'PPT & Viva Guidance Support', '1-on-1 Code Walkthrough'],
      },
      {
        id: 3,
        slug: 'poster-design',
        title: 'Poster Design',
        starting_price: 99,
        price_display: 'Starting at ₹99+',
        short_description: 'Professional digital posters for events, businesses, celebrations, promotions and social media campaigns.',
        deliverables: ['High-Resolution 4K Graphics', 'Print-Ready PDF & PNG Formats', 'Social Media Sized Variants', 'Modern MNC Typography', 'Fast 24-Hour Delivery'],
      },
      {
        id: 4,
        slug: 'marathon-sports',
        title: 'Marathon / Sports Websites',
        starting_price: 6999,
        price_display: 'Starting at ₹6,999+',
        short_description: 'Complete event platforms with registration, payments, participant management and digital event experiences.',
        deliverables: ['Runner Registration System', 'Payment Gateway Integration', 'Bib & Category Management', 'Live Leaderboards & Results', 'Sponsor Showcase Banner'],
      },
      {
        id: 5,
        slug: 'promo-videos',
        title: 'Promotional Video Making',
        starting_price: 399,
        price_display: 'Starting at ₹399+',
        short_description: 'Short-form promotional videos designed to capture attention and communicate your event, product or brand.',
        deliverables: ['Full HD / 4K Motion Video', 'Engaging Voiceover & SFX', 'Brand Colors & Animated Text', 'Reels / Shorts 9:16 & 16:9 Ratios', 'Licensed Background Audio'],
      },
      {
        id: 6,
        slug: 'custom-websites',
        title: 'Custom Websites',
        starting_price: 0,
        price_display: 'Custom Pricing',
        short_description: 'Tailored websites and digital products designed around your specific business requirements.',
        deliverables: ['Enterprise Architecture & UI/UX', 'Custom Backend API & Database', 'Admin Management Portal', 'Payment & Analytics Integration', 'Ongoing Maintenance & SLA'],
      },
    ];
    memoryDb.services = defaultServices;
    saveDb();
    console.log('✅ Seeded default 6 KAT services');
  }
}

// Database helper object
export const db = {
  // Users
  findUserByUsername: (username) => memoryDb.users.find(u => u.username === username),

  // Customers
  createCustomer: (data) => {
    const customer = {
      id: memoryDb.customers.length + 1,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company || '',
      created_at: new Date().toISOString()
    };
    memoryDb.customers.push(customer);
    saveDb();
    return customer;
  },

  // Quotes
  createQuote: (quoteData) => {
    const count = memoryDb.quotes.length + 1;
    const quoteId = `KAT-Q-${String(count).padStart(6, '0')}`;
    const newQuote = {
      id: count,
      quote_id: quoteId,
      customer_id: quoteData.customer_id,
      customer_name: quoteData.customer_name,
      customer_email: quoteData.customer_email,
      customer_phone: quoteData.customer_phone,
      service_name: quoteData.service_name,
      description: quoteData.description,
      budget: quoteData.budget,
      preferred_date: quoteData.preferred_date || '',
      additional_reqs: quoteData.additional_reqs || '',
      quoted_amount: quoteData.quoted_amount || 0,
      status: 'NEW', // NEW, CONTACTED, QUOTED, APPROVED, PAYMENT PENDING, PAID, IN PROGRESS, COMPLETED, CANCELLED
      payment_status: 'UNPAID',
      payment_id: null,
      order_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    memoryDb.quotes.unshift(newQuote);
    saveDb();
    return newQuote;
  },

  getQuotes: () => memoryDb.quotes,

  getQuoteById: (quoteId) => memoryDb.quotes.find(q => q.quote_id === quoteId || String(q.id) === String(quoteId)),

  updateQuote: (quoteId, updates) => {
    const quoteIndex = memoryDb.quotes.findIndex(q => q.quote_id === quoteId || String(q.id) === String(quoteId));
    if (quoteIndex !== -1) {
      memoryDb.quotes[quoteIndex] = {
        ...memoryDb.quotes[quoteIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };
      saveDb();
      return memoryDb.quotes[quoteIndex];
    }
    return null;
  },

  // Payments
  createPayment: (paymentData) => {
    const payment = {
      id: memoryDb.payments.length + 1,
      quote_id: paymentData.quote_id,
      order_id: paymentData.order_id,
      payment_id: paymentData.payment_id || null,
      customer_id: paymentData.customer_id || null,
      customer_name: paymentData.customer_name || '',
      customer_email: paymentData.customer_email || '',
      customer_phone: paymentData.customer_phone || '',
      service_name: paymentData.service_name || '',
      amount: paymentData.amount,
      currency: paymentData.currency || 'INR',
      status: paymentData.status || 'CREATED',
      signature: paymentData.signature || null,
      verified_at: paymentData.verified_at || null,
      created_at: new Date().toISOString(),
    };
    memoryDb.payments.unshift(payment);
    saveDb();
    return payment;
  },

  getPayments: () => memoryDb.payments,

  getPaymentByOrderId: (orderId) => memoryDb.payments.find(p => p.order_id === orderId),

  updatePayment: (orderId, updates) => {
    const pIndex = memoryDb.payments.findIndex(p => p.order_id === orderId);
    if (pIndex !== -1) {
      memoryDb.payments[pIndex] = {
        ...memoryDb.payments[pIndex],
        ...updates
      };
      saveDb();
      return memoryDb.payments[pIndex];
    }
    return null;
  },

  // Admin Notes
  addAdminNote: (quoteId, noteText, author = 'Admin') => {
    const note = {
      id: memoryDb.admin_notes.length + 1,
      quote_id: quoteId,
      note: noteText,
      author,
      created_at: new Date().toISOString()
    };
    memoryDb.admin_notes.unshift(note);
    saveDb();
    return note;
  },

  getAdminNotes: (quoteId) => memoryDb.admin_notes.filter(n => n.quote_id === quoteId),

  // Contact Submissions
  createContactSubmission: (data) => {
    const contact = {
      id: memoryDb.contact_submissions.length + 1,
      name: data.name,
      email: data.email,
      phone: data.phone,
      service: data.service || 'General Inquiry',
      message: data.message,
      status: 'UNREAD',
      created_at: new Date().toISOString()
    };
    memoryDb.contact_submissions.unshift(contact);
    saveDb();
    return contact;
  },

  getContactSubmissions: () => memoryDb.contact_submissions,

  // Services
  getServices: () => memoryDb.services,

  // Reviews
  createReview: (data) => {
    const review = {
      id: memoryDb.reviews.length + 1,
      name: data.name,
      role: data.role || '',
      service: data.service || 'General',
      rating: Math.min(5, Math.max(1, Number(data.rating) || 5)),
      comment: data.comment,
      status: 'PENDING', // PENDING, APPROVED, REJECTED
      created_at: new Date().toISOString()
    };
    memoryDb.reviews.unshift(review);
    saveDb();
    return review;
  },

  // Public: only approved reviews
  getApprovedReviews: () => memoryDb.reviews.filter(r => r.status === 'APPROVED'),

  // Admin: all reviews
  getAllReviews: () => memoryDb.reviews,

  updateReview: (id, updates) => {
    const idx = memoryDb.reviews.findIndex(r => r.id === Number(id));
    if (idx !== -1) {
      memoryDb.reviews[idx] = { ...memoryDb.reviews[idx], ...updates };
      saveDb();
      return memoryDb.reviews[idx];
    }
    return null;
  },

  deleteReview: (id) => {
    const idx = memoryDb.reviews.findIndex(r => r.id === Number(id));
    if (idx !== -1) {
      const deleted = memoryDb.reviews.splice(idx, 1)[0];
      saveDb();
      return deleted;
    }
    return null;
  },

  deleteQuote: (quoteId) => {
    const idx = memoryDb.quotes.findIndex(q => q.quote_id === quoteId || String(q.id) === String(quoteId));
    if (idx !== -1) {
      const deleted = memoryDb.quotes.splice(idx, 1)[0];
      // also clear notes
      memoryDb.admin_notes = memoryDb.admin_notes.filter(n => n.quote_id !== quoteId);
      saveDb();
      return deleted;
    }
    return null;
  },

  deletePayment: (id) => {
    const idx = memoryDb.payments.findIndex(p => String(p.id) === String(id) || p.order_id === id);
    if (idx !== -1) {
      const deleted = memoryDb.payments.splice(idx, 1)[0];
      saveDb();
      return deleted;
    }
    return null;
  },
};

export default db;
