// Central Payment Configuration for KAT Digital Solutions
export const PAYMENT_CONFIG = {
  UPI_ID: '630139193-3@ybl',
  PAYEE_NAME: 'KAT Digital Solutions',
  CURRENCY: 'INR',
};

export const getUpiId = () => {
  return import.meta.env.VITE_KAT_UPI_ID || PAYMENT_CONFIG.UPI_ID;
};

export const getPayeeName = () => {
  return import.meta.env.VITE_KAT_PAYEE_NAME || PAYMENT_CONFIG.PAYEE_NAME;
};
