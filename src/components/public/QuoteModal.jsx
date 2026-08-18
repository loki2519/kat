import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, Copy, CreditCard, Clock, Sparkles, ShieldCheck, Printer, AlertCircle } from 'lucide-react';
import logoSvg from '../../assets/kat-logo.png';

export default function QuoteModal({ isOpen, onClose, initialService = '', initialTab = 'request' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: initialService || 'Wishing & Gifting Websites',
    description: '',
    budget: '₹500 - ₹2,000',
    preferred_date: '',
    additional_reqs: '',
  });

  const [loading, setLoading] = useState(false);
  const [resultQuote, setResultQuote] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // Payment Tracking & Checkout State
  const [trackQuoteId, setTrackQuoteId] = useState('');
  const [trackedQuote, setTrackedQuote] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  
  // Payment Method Selection State (Razorpay | PhonePe | Google Pay)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Razorpay');
  const [upiInitiated, setUpiInitiated] = useState(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Official Payment Receipt Object State
  const [receiptData, setReceiptData] = useState(null);

  const katUpiId = import.meta.env.VITE_KAT_UPI_ID || 'katdigital@ybl';
  const katPayeeName = import.meta.env.VITE_KAT_PAYEE_NAME || 'KAT Digital Solutions';

  useEffect(() => {
    if (initialService) {
      setFormData(prev => ({ ...prev, service: initialService }));
    }
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialService, initialTab]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit quotation request');

      setResultQuote(data.quote);
      setTrackedQuote(data.quote);
    } catch (err) {
      setError(err.message || 'Something went wrong while submitting quote.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyQuoteId = () => {
    if (resultQuote) {
      navigator.clipboard.writeText(resultQuote.quote_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTrackQuote = async (e) => {
    e?.preventDefault();
    if (!trackQuoteId) return;
    setTrackingLoading(true);
    setError('');
    setReceiptData(null);
    setUpiInitiated(null);

    try {
      const res = await fetch(`/api/quotes/track/${trackQuoteId.trim()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Quote ID not found. Please check your Quote ID.');
      setTrackedQuote(data);
    } catch (err) {
      setError(err.message);
      setTrackedQuote(null);
    } finally {
      setTrackingLoading(false);
    }
  };

  // ══════════════════════════════════════════════════════════════════════
  // 1. RAZORPAY PAYMENT OPTION (Real Order -> Real Checkout -> Verification)
  // ══════════════════════════════════════════════════════════════════════
  const handleRazorpayPayment = async (targetQuoteId) => {
    setPaymentProcessing(true);
    setError('');

    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote_id: targetQuoteId }),
      });

      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.error || 'Razorpay order creation failed. If Razorpay is not configured yet, please use PhonePe or Google Pay.');
      }

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK is loading. Please check internet connection or refresh page.');
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount, // in paise
        currency: orderData.currency || 'INR',
        name: 'KAT Digital Solutions',
        description: `Payment for ${orderData.service_name} (${orderData.quote_id})`,
        image: logoSvg,
        order_id: orderData.order_id,
        prefill: {
          name: orderData.customer_name,
          email: orderData.customer_email,
          contact: orderData.customer_phone,
        },
        notes: {
          quote_id: orderData.quote_id,
        },
        theme: {
          color: '#0B3B82',
        },
        handler: async function (response) {
          await finalizePaymentVerification({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            quote_id: targetQuoteId,
            payment_method: 'Razorpay',
            orderData,
          });
        },
        modal: {
          ondismiss: function () {
            setPaymentProcessing(false);
            setError('PAYMENT CANCELLED. You can try again whenever you are ready.');
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        setPaymentProcessing(false);
        const failMsg = response.error?.description || response.error?.reason || 'Transaction could not be completed.';
        setError(`PAYMENT FAILED: ${failMsg}. Please try again.`);
      });

      rzp.open();
    } catch (err) {
      setError(err.message || 'Error initializing payment.');
      setPaymentProcessing(false);
    }
  };

  // ══════════════════════════════════════════════════════════════════════
  // 2 & 3. PHONEPE AND GOOGLE PAY UPI OPTIONS (Direct App Launch + Verification Pending)
  // ══════════════════════════════════════════════════════════════════════
  const handleUpiPayment = async (methodName, targetQuoteId, amount) => {
    setPaymentProcessing(true);
    setError('');

    try {
      const res = await fetch('/api/payments/initiate-upi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quote_id: targetQuoteId,
          payment_method: methodName,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to initiate ${methodName} payment`);

      const targetUpiId = data.upi_id || katUpiId;
      const targetPayee = data.payee_name || katPayeeName;

      setUpiInitiated({
        method: methodName,
        upiId: targetUpiId,
        payeeName: targetPayee,
        amount: amount,
        quoteId: targetQuoteId,
        message: data.message,
      });

      // Construct standard UPI deep link with fixed amount
      const upiUrl = `upi://pay?pa=${targetUpiId}&pn=${encodeURIComponent(targetPayee)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`KAT Quote ${targetQuoteId}`)}`;

      // Launch UPI app deep link on mobile devices
      if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        if (methodName === 'PhonePe') {
          window.location.href = `phonepe://pay?pa=${targetUpiId}&pn=${encodeURIComponent(targetPayee)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`KAT Quote ${targetQuoteId}`)}`;
          setTimeout(() => {
            window.location.href = upiUrl;
          }, 1000);
        } else if (methodName === 'Google Pay') {
          window.location.href = `gpay://upi/pay?pa=${targetUpiId}&pn=${encodeURIComponent(targetPayee)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`KAT Quote ${targetQuoteId}`)}`;
          setTimeout(() => {
            window.location.href = upiUrl;
          }, 1000);
        } else {
          window.location.href = upiUrl;
        }
      }
    } catch (err) {
      setError(err.message || `Failed to launch ${methodName}`);
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Server-Side Verification & Receipt Display (Only when verified)
  const finalizePaymentVerification = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature, quote_id, payment_method = 'Razorpay', orderData }) => {
    setPaymentProcessing(true);
    setError('');

    try {
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          quote_id,
          payment_method,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Server-side payment signature verification failed.');
      }

      // Build official verified payment receipt
      const qDetails = trackedQuote || {};
      const receipt = {
        receiptNo: `REC-${Date.now().toString().slice(-6)}`,
        paymentId: verifyData.payment_id || razorpay_payment_id,
        orderId: verifyData.order_id || razorpay_order_id,
        quoteId: quote_id,
        paymentMethod: payment_method,
        date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        customerName: verifyData.customer_name || qDetails.customer_name || orderData?.customer_name || 'Valued Customer',
        customerEmail: qDetails.customer_email || orderData?.customer_email || 'N/A',
        customerPhone: qDetails.customer_phone || orderData?.customer_phone || 'N/A',
        serviceName: verifyData.service_name || qDetails.service_name || orderData?.service_name || 'Custom Digital Solution',
        description: qDetails.description || 'Project digital execution as per quotation.',
        userBudget: qDetails.budget || 'Custom Budget',
        quotedAmount: verifyData.amount || qDetails.quoted_amount || (orderData?.amount ? orderData.amount / 100 : 0),
        paidAmount: verifyData.amount || qDetails.quoted_amount || (orderData?.amount ? orderData.amount / 100 : 0),
        status: 'VERIFIED',
      };

      setReceiptData(receipt);
      if (trackedQuote) {
        setTrackedQuote(prev => ({ ...prev, status: 'PAID', payment_status: 'PAID', payment_id: razorpay_payment_id, payment_method }));
      }
    } catch (err) {
      setError(err.message || 'Payment verification failed.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-kat-navy/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-kat-border max-h-[92vh] overflow-y-auto relative animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-kat-border pb-4 mb-6 print:hidden">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-kat-primary" />
              <h3 className="text-xl sm:text-2xl font-extrabold text-kat-navy">
                {receiptData ? 'PAYMENT SUCCESSFUL' : 'REQUEST & TRACK QUOTATION'}
              </h3>
            </div>
            <p className="text-xs text-kat-muted mt-0.5">
              {receiptData ? 'Verified transaction record and receipt.' : 'Receive an instant Quote ID and personalized proposal from KAT.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-kat-muted hover:text-kat-navy hover:bg-kat-soft font-bold text-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Error Alert Bar */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 print:hidden">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════ */}
        {/*  OFFICIAL PAYMENT RECEIPT VIEW (ONLY WHEN VERIFIED)      */}
        {/* ════════════════════════════════════════════════════════ */}
        {receiptData ? (
          <div className="space-y-6 animate-in fade-in" id="printable-receipt">
            <div className="border-2 border-kat-navy/20 p-6 sm:p-8 rounded-3xl bg-kat-verylight/50 space-y-6 relative overflow-hidden">
              
              {/* Receipt Stamp Watermark */}
              <div className="absolute top-6 right-6 opacity-15 pointer-events-none">
                <ShieldCheck className="w-32 h-32 text-emerald-700" />
              </div>

              {/* Company Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-kat-border pb-6 gap-4">
                <div className="flex items-center gap-3">
                  <img src={logoSvg} alt="KAT Logo" className="h-12 w-auto object-contain" />
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-black text-emerald-600 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-1">
                    ✓ PAYMENT SUCCESSFUL &amp; VERIFIED
                  </span>
                  <div className="text-[11px] text-kat-muted font-mono">Receipt No: {receiptData.receiptNo}</div>
                  <div className="text-[11px] text-kat-muted">Date: {receiptData.date}</div>
                </div>
              </div>

              {/* Transaction Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-kat-border text-xs">
                <div>
                  <span className="text-[10px] font-bold text-kat-muted uppercase block">CUSTOMER INFORMATION</span>
                  <div className="font-extrabold text-kat-navy text-sm mt-0.5">{receiptData.customerName}</div>
                  <div className="text-kat-muted">{receiptData.customerEmail}</div>
                  <div className="text-kat-muted">{receiptData.customerPhone}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-kat-muted uppercase block">TRANSACTION DETAILS</span>
                  <div className="text-kat-muted">Method: <span className="font-bold text-kat-navy">{receiptData.paymentMethod}</span></div>
                  <div className="text-kat-muted">Payment ID: <span className="font-mono font-bold text-emerald-600">{receiptData.paymentId}</span></div>
                  {receiptData.orderId && <div className="text-kat-muted font-mono">Order ID: {receiptData.orderId}</div>}
                  <div className="text-kat-muted font-mono">Quote ID: {receiptData.quoteId}</div>
                </div>
              </div>

              {/* Project Particulars Table */}
              <div>
                <h4 className="text-xs font-extrabold text-kat-navy uppercase tracking-wider mb-2">Project Particulars</h4>
                <div className="border border-kat-border rounded-2xl overflow-hidden bg-white text-xs">
                  <div className="bg-kat-soft p-3 font-bold text-kat-navy grid grid-cols-12 border-b border-kat-border">
                    <span className="col-span-7">Description / Particulars</span>
                    <span className="col-span-5 text-right">Amount Paid</span>
                  </div>
                  <div className="p-3 grid grid-cols-12 border-b border-kat-border/50 items-center">
                    <div className="col-span-7 space-y-1">
                      <div className="font-extrabold text-kat-navy text-sm">{receiptData.serviceName}</div>
                      <div className="text-[11px] text-kat-muted leading-relaxed">{receiptData.description}</div>
                      <div className="text-[10px] text-kat-primary font-bold">Client Budget: {receiptData.userBudget}</div>
                    </div>
                    <div className="col-span-5 text-right font-black text-sm text-kat-navy">
                      ₹{receiptData.quotedAmount}
                    </div>
                  </div>
                  <div className="bg-emerald-50 p-4 grid grid-cols-12 items-center font-bold text-xs">
                    <span className="col-span-7 text-emerald-900 font-extrabold">TOTAL AMOUNT VERIFIED (INCL. TAXES)</span>
                    <span className="col-span-5 text-right font-black text-lg text-emerald-700">₹{receiptData.paidAmount}</span>
                  </div>
                </div>
              </div>

              {/* Verification Footer Stamp */}
              <div className="flex items-center justify-between pt-2 text-[11px] text-kat-muted border-t border-kat-border">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified via KAT Payment Server</span>
                </div>
                <div className="font-bold text-kat-navy">MVP Colony, Sec-9</div>
              </div>
            </div>

            {/* Receipt Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 print:hidden">
              <button
                onClick={handlePrintReceipt}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-kat-navy hover:bg-kat-deep text-white py-3 px-6 rounded-xl font-bold text-xs shadow-md transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>PRINT / DOWNLOAD RECEIPT</span>
              </button>
              <button
                onClick={() => {
                  setReceiptData(null);
                  onClose();
                }}
                className="px-6 py-3 rounded-xl bg-kat-soft hover:bg-kat-verylight text-kat-navy border border-kat-border font-bold text-xs"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : resultQuote ? (
          /* Successful Submission View */
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-2xl font-extrabold text-kat-navy">Quotation Request Received!</h4>
              <p className="text-sm text-kat-muted mt-1">Your request has been logged into the KAT server system.</p>
            </div>

            {/* Generated Quote ID Card */}
            <div className="bg-kat-soft/80 p-6 rounded-2xl border border-kat-border max-w-md mx-auto space-y-3">
              <span className="text-xs font-extrabold text-kat-primary uppercase tracking-wider block">YOUR UNIQUE QUOTE ID</span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl sm:text-3xl font-black text-kat-navy font-mono tracking-wider">{resultQuote.quote_id}</span>
                <button
                  onClick={handleCopyQuoteId}
                  className="p-2 rounded-xl bg-white border border-kat-border text-kat-primary hover:bg-kat-verylight font-bold text-xs flex items-center gap-1"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copied ? 'COPIED!' : 'COPY'}</span>
                </button>
              </div>
              <p className="text-[11px] text-kat-muted">Save this ID to track status or complete payment via Razorpay, PhonePe, or Google Pay.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  setTrackQuoteId(resultQuote.quote_id);
                  setActiveTab('track');
                  setResultQuote(null);
                }}
                className="px-6 py-3 rounded-xl bg-kat-primary text-white text-xs font-bold shadow-md hover:bg-kat-deep transition-all"
              >
                Track Status &amp; Select Payment
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-kat-verylight text-kat-navy border border-kat-border text-xs font-bold hover:bg-kat-soft"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Main Form & Track View */
          <div>
            {/* Form vs Quick Track Tabs */}
            <div className="mb-6 flex gap-2 border-b border-kat-border pb-3">
              <button
                type="button"
                onClick={() => setActiveTab('request')}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                  activeTab === 'request'
                    ? 'text-white bg-kat-primary shadow-md'
                    : 'text-kat-navy bg-kat-verylight border border-kat-border hover:bg-kat-soft'
                }`}
              >
                1. Submit New Quote
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('track')}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                  activeTab === 'track'
                    ? 'text-white bg-kat-primary shadow-md'
                    : 'text-kat-navy bg-kat-verylight border border-kat-border hover:bg-kat-soft'
                }`}
              >
                2. Track Status &amp; Pay Quote
              </button>
            </div>

            {/* Track Status & Pay Section */}
            {activeTab === 'track' && (
              <div className="mb-6 space-y-4">
                <form onSubmit={handleTrackQuote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter your Quote ID (e.g. KAT-Q-000001)"
                    value={trackQuoteId}
                    onChange={(e) => setTrackQuoteId(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-kat-border text-xs focus:outline-none focus:border-kat-primary bg-white font-mono font-bold"
                  />
                  <button
                    type="submit"
                    disabled={trackingLoading}
                    className="px-5 py-2.5 rounded-xl bg-kat-navy text-white text-xs font-bold hover:bg-kat-deep transition-all"
                  >
                    {trackingLoading ? 'Checking...' : 'Track & View Payment'}
                  </button>
                </form>
              </div>
            )}

            {/* Tracked Quote Display Card */}
            {trackedQuote && (
              <div className="mb-6 bg-kat-verylight p-5 rounded-2xl border border-kat-border space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-kat-navy font-mono">{trackedQuote.quote_id}</span>
                  <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase ${
                    trackedQuote.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-kat-soft text-kat-primary'
                  }`}>
                    STATUS: {trackedQuote.status}
                  </span>
                </div>

                <div className="text-xs text-kat-muted space-y-1">
                  <div><strong>Service:</strong> {trackedQuote.service_name}</div>
                  <div><strong>Client:</strong> {trackedQuote.customer_name} ({trackedQuote.customer_email})</div>
                  {trackedQuote.description && <div><strong>Description:</strong> {trackedQuote.description}</div>}
                  {trackedQuote.budget && <div><strong>Requested Budget:</strong> {trackedQuote.budget}</div>}
                  <div><strong>Quoted Price:</strong> <span className="text-kat-navy font-extrabold text-sm">{trackedQuote.quoted_amount > 0 ? `₹${trackedQuote.quoted_amount}` : 'Pending Admin Quotation'}</span></div>
                </div>

                {/* ════════════════════════════════════════════════════════════ */}
                {/* 3 PAYMENT METHOD SELECTION CARDS (Razorpay / PhonePe / GPay) */}
                {/* ════════════════════════════════════════════════════════════ */}
                {trackedQuote.quoted_amount > 0 && trackedQuote.status !== 'PAID' && (
                  <div className="pt-3 space-y-4">
                    <h4 className="text-xs font-black text-kat-navy uppercase tracking-wider">
                      SELECT PAYMENT METHOD (Fixed Amount: ₹{trackedQuote.quoted_amount})
                    </h4>

                    {/* 3 Payment Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Option 1: Razorpay */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPaymentMethod('Razorpay');
                          setUpiInitiated(null);
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                          selectedPaymentMethod === 'Razorpay'
                            ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20'
                            : 'border-kat-border bg-white hover:border-indigo-300 hover:bg-kat-verylight/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-indigo-900 flex items-center gap-1.5">
                            <CreditCard className="w-4 h-4 text-indigo-600" />
                            <span>RAZORPAY</span>
                          </span>
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                        </div>
                        <div className="text-[10px] text-kat-muted">Cards, NetBanking &amp; Razorpay Gateway</div>
                      </button>

                      {/* Option 2: PhonePe */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPaymentMethod('PhonePe');
                          setUpiInitiated(null);
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                          selectedPaymentMethod === 'PhonePe'
                            ? 'border-purple-600 bg-purple-50/70 shadow-sm ring-2 ring-purple-500/20'
                            : 'border-kat-border bg-white hover:border-purple-300 hover:bg-kat-verylight/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-purple-900 flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-purple-600 text-white font-bold text-[9px] flex items-center justify-center">पे</span>
                            <span>PHONEPE</span>
                          </span>
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                        </div>
                        <div className="text-[10px] text-kat-muted">Pay directly using PhonePe UPI App</div>
                      </button>

                      {/* Option 3: Google Pay */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPaymentMethod('Google Pay');
                          setUpiInitiated(null);
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                          selectedPaymentMethod === 'Google Pay'
                            ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20'
                            : 'border-kat-border bg-white hover:border-blue-300 hover:bg-kat-verylight/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center">G</span>
                            <span>GOOGLE PAY</span>
                          </span>
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                        </div>
                        <div className="text-[10px] text-kat-muted">Pay directly using Google Pay UPI App</div>
                      </button>
                    </div>

                    {/* Selected Option Action Panels */}
                    {selectedPaymentMethod === 'Razorpay' && (
                      <div className="pt-2">
                        <button
                          onClick={() => handleRazorpayPayment(trackedQuote.quote_id)}
                          disabled={paymentProcessing}
                          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-700 to-indigo-600 text-white py-3.5 rounded-xl font-extrabold text-xs shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>{paymentProcessing ? 'Opening Razorpay Checkout...' : `PAY NOW VIA RAZORPAY (₹${trackedQuote.quoted_amount})`}</span>
                        </button>
                      </div>
                    )}

                    {selectedPaymentMethod === 'PhonePe' && (
                      <div className="pt-2 space-y-3">
                        <button
                          onClick={() => handleUpiPayment('PhonePe', trackedQuote.quote_id, trackedQuote.quoted_amount)}
                          disabled={paymentProcessing}
                          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-700 to-purple-600 text-white py-3.5 rounded-xl font-extrabold text-xs shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
                        >
                          <span className="w-4 h-4 rounded-full bg-white text-purple-700 font-extrabold text-[10px] flex items-center justify-center">पे</span>
                          <span>{paymentProcessing ? 'Launching PhonePe...' : `PAY WITH PHONEPE (₹${trackedQuote.quoted_amount})`}</span>
                        </button>

                        {upiInitiated && upiInitiated.method === 'PhonePe' && (
                          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2 text-xs text-purple-900 animate-in fade-in">
                            <div className="font-extrabold flex items-center gap-1.5 text-purple-950">
                              <Clock className="w-4 h-4 text-purple-700" />
                              <span>Payment Initiated — Verification Pending</span>
                            </div>
                            <p className="text-[11px] text-purple-800 leading-relaxed">
                              If PhonePe did not open automatically, pay using our official KAT Merchant UPI ID below:
                            </p>
                            <div className="p-3 bg-white rounded-xl border border-purple-200 flex items-center justify-between font-mono font-bold">
                              <span>{upiInitiated.upiId}</span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(upiInitiated.upiId);
                                  setCopiedUpi(true);
                                  setTimeout(() => setCopiedUpi(false), 2000);
                                }}
                                className="px-3 py-1 bg-purple-100 text-purple-900 rounded-lg text-[10px] hover:bg-purple-200 font-bold"
                              >
                                {copiedUpi ? 'COPIED!' : 'COPY UPI ID'}
                              </button>
                            </div>
                            <div className="text-[10px] text-purple-700 font-semibold pt-1">
                              • Payee: {upiInitiated.payeeName} | Fixed Amount: ₹{upiInitiated.amount}
                            </div>
                            <div className="text-[10px] text-amber-800 font-bold bg-amber-50 p-2 rounded-lg border border-amber-200">
                              ⚠️ Note: Verification Pending with KAT Admin. Receipt will be generated once payment is confirmed in bank records.
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedPaymentMethod === 'Google Pay' && (
                      <div className="pt-2 space-y-3">
                        <button
                          onClick={() => handleUpiPayment('Google Pay', trackedQuote.quote_id, trackedQuote.quoted_amount)}
                          disabled={paymentProcessing}
                          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3.5 rounded-xl font-extrabold text-xs shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
                        >
                          <span className="w-4 h-4 rounded-full bg-white text-blue-600 font-extrabold text-[10px] flex items-center justify-center">G</span>
                          <span>{paymentProcessing ? 'Launching Google Pay...' : `PAY WITH GOOGLE PAY (₹${trackedQuote.quoted_amount})`}</span>
                        </button>

                        {upiInitiated && upiInitiated.method === 'Google Pay' && (
                          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2 text-xs text-blue-900 animate-in fade-in">
                            <div className="font-extrabold flex items-center gap-1.5 text-blue-950">
                              <Clock className="w-4 h-4 text-blue-700" />
                              <span>Payment Initiated — Verification Pending</span>
                            </div>
                            <p className="text-[11px] text-blue-800 leading-relaxed">
                              If Google Pay did not open automatically, pay using our official KAT Merchant UPI ID below:
                            </p>
                            <div className="p-3 bg-white rounded-xl border border-blue-200 flex items-center justify-between font-mono font-bold">
                              <span>{upiInitiated.upiId}</span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(upiInitiated.upiId);
                                  setCopiedUpi(true);
                                  setTimeout(() => setCopiedUpi(false), 2000);
                                }}
                                className="px-3 py-1 bg-blue-100 text-blue-900 rounded-lg text-[10px] hover:bg-blue-200 font-bold"
                              >
                                {copiedUpi ? 'COPIED!' : 'COPY UPI ID'}
                              </button>
                            </div>
                            <div className="text-[10px] text-blue-700 font-semibold pt-1">
                              • Payee: {upiInitiated.payeeName} | Fixed Amount: ₹{upiInitiated.amount}
                            </div>
                            <div className="text-[10px] text-amber-800 font-bold bg-amber-50 p-2 rounded-lg border border-amber-200">
                              ⚠️ Note: Verification Pending with KAT Admin. Receipt will be generated once payment is confirmed in bank records.
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {trackedQuote.status === 'PAID' && (
                  <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Payment Verified ({trackedQuote.payment_method || 'Razorpay'} ID: {trackedQuote.payment_id || 'VERIFIED'})</span>
                    </div>
                    {receiptData ? null : (
                      <button
                        onClick={() => {
                          setReceiptData({
                            receiptNo: `REC-${Date.now().toString().slice(-6)}`,
                            paymentId: trackedQuote.payment_id || `pay_${trackedQuote.quote_id}`,
                            orderId: trackedQuote.order_id || `order_${trackedQuote.quote_id}`,
                            quoteId: trackedQuote.quote_id,
                            paymentMethod: trackedQuote.payment_method || 'Razorpay',
                            date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
                            customerName: trackedQuote.customer_name,
                            customerEmail: trackedQuote.customer_email || 'N/A',
                            customerPhone: trackedQuote.customer_phone || 'N/A',
                            serviceName: trackedQuote.service_name,
                            description: trackedQuote.description || 'Project digital execution.',
                            userBudget: trackedQuote.budget || 'Custom Budget',
                            quotedAmount: trackedQuote.quoted_amount,
                            paidAmount: trackedQuote.quoted_amount,
                            status: 'VERIFIED',
                          });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-[11px] font-bold hover:bg-emerald-800 transition-colors"
                      >
                        View Receipt
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Submission Form */}
            {activeTab === 'request' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-extrabold text-kat-navy uppercase mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-kat-border text-xs focus:outline-none focus:border-kat-primary bg-kat-verylight/40"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-kat-navy uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@email.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-kat-border text-xs focus:outline-none focus:border-kat-primary bg-kat-verylight/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-extrabold text-kat-navy uppercase mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-kat-border text-xs focus:outline-none focus:border-kat-primary bg-kat-verylight/40"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-kat-navy uppercase mb-1">Select Service *</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-kat-border text-xs focus:outline-none focus:border-kat-primary bg-kat-verylight/40 font-semibold text-kat-navy"
                    >
                      <option value="Wishing & Gifting Websites">Wishing &amp; Gifting Websites (Starting ₹599+)</option>
                      <option value="Final Year College Projects">Final Year College Projects (Starting ₹4,999+)</option>
                      <option value="Poster Design">Poster Design (Starting ₹99+)</option>
                      <option value="Marathon / Sports Websites">Marathon / Sports Websites (Starting ₹6,999+)</option>
                      <option value="Promotional Video Making">Promotional Video Making (Starting ₹399+)</option>
                      <option value="Custom Websites">Custom Websites (Custom Pricing)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-kat-navy uppercase mb-1">Project Description *</label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide details about your project goals, features required, or design preferences..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-kat-border text-xs focus:outline-none focus:border-kat-primary bg-kat-verylight/40"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-extrabold text-kat-navy uppercase mb-1">Estimated Budget Range</label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-kat-border text-xs focus:outline-none focus:border-kat-primary bg-kat-verylight/40"
                    >
                      <option value="Under ₹1,000">Under ₹1,000</option>
                      <option value="₹1,000 - ₹5,000">₹1,000 - ₹5,000</option>
                      <option value="₹5,000 - ₹15,000">₹5,000 - ₹15,000</option>
                      <option value="₹15,000 - ₹50,000">₹15,000 - ₹50,000</option>
                      <option value="₹50,000+">₹50,000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-kat-navy uppercase mb-1">Preferred Delivery Date</label>
                    <input
                      type="date"
                      name="preferred_date"
                      value={formData.preferred_date}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-kat-border text-xs focus:outline-none focus:border-kat-primary bg-kat-verylight/40"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-kat-deep via-kat-primary to-kat-bright text-white py-3.5 px-6 rounded-xl font-extrabold text-xs shadow-md hover:shadow-kat-hover disabled:opacity-50 transition-all mt-2"
                >
                  {loading ? (
                    <span>Generating Quote ID...</span>
                  ) : (
                    <>
                      <span>SUBMIT QUOTE REQUEST</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
