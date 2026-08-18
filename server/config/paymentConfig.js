// Central Backend Payment Configuration for KAT Digital Solutions
export const PAYMENT_CONFIG = {
  UPI_ID: process.env.KAT_UPI_ID || process.env.VITE_KAT_UPI_ID || '6301399193-3@ybl',
  PAYEE_NAME: process.env.KAT_PAYEE_NAME || process.env.VITE_KAT_PAYEE_NAME || 'KAT Digital Solutions',
  CURRENCY: 'INR',
};

export const getBackendUpiId = () => {
  return process.env.KAT_UPI_ID || process.env.VITE_KAT_UPI_ID || PAYMENT_CONFIG.UPI_ID;
};

export const getBackendPayeeName = () => {
  return process.env.KAT_PAYEE_NAME || process.env.VITE_KAT_PAYEE_NAME || PAYMENT_CONFIG.PAYEE_NAME;
};
