import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CreditCard, ShieldCheck, RefreshCw, CheckCircle2, Trash2 } from 'lucide-react';

export default function PaymentTracker() {
  const { token } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payments/admin/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setPayments(data.payments || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleDeletePayment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment record?')) return;

    try {
      const res = await fetch(`/api/payments/admin/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPayments(prev => prev.filter(p => p.id !== id && p.order_id !== id));
      } else {
        alert('Failed to delete payment record');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const handleApprovePayment = async (quoteId) => {
    const txnRef = window.prompt('Enter transaction reference ID or UTR number received in bank account:');
    if (!txnRef) return;

    try {
      const res = await fetch('/api/payments/admin/verify-manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quote_id: quoteId,
          transaction_ref: txnRef,
        }),
      });

      if (res.ok) {
        alert('Payment approved and marked as VERIFIED / PAID.');
        fetchPayments();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to approve payment');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-kat-navy">Payment Management</h1>
          <p className="text-xs text-kat-muted">Server-verified Razorpay, PhonePe &amp; Google Pay transaction records</p>
        </div>

        <button
          onClick={fetchPayments}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-kat-border text-kat-navy font-bold text-xs hover:bg-kat-soft"
        >
          <RefreshCw className="w-4 h-4 text-kat-primary" />
          <span>Refresh Payments</span>
        </button>
      </div>

      {/* Payment Security Badge */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-xs text-emerald-800 font-semibold">
        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <span>Payment status is updated only after HMAC-SHA256 signature verification or KAT Admin approval.</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-kat-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-kat-muted font-bold">
            Loading payment records...
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center text-xs text-kat-muted font-bold">
            No payment records recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-kat-border text-kat-muted uppercase tracking-wider text-[10px] font-bold bg-kat-verylight/60">
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Payment ID / Ref</th>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Quote ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Verified Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-kat-border/60 font-medium">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-kat-verylight/60">
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${
                        p.payment_method === 'PhonePe'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : p.payment_method === 'Google Pay'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      }`}>
                        {p.payment_method || 'Razorpay'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-kat-navy">{p.payment_id || p.signature || 'Verification Pending'}</td>
                    <td className="py-3.5 px-4 font-mono text-kat-muted">{p.order_id}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-kat-primary">{p.quote_id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-kat-navy">{p.customer_name || 'N/A'}</div>
                      <div className="text-[10px] text-kat-muted">{p.customer_phone || p.customer_email || ''}</div>
                    </td>
                    <td className="py-3.5 px-4 font-black text-kat-navy">₹{p.amount}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        p.status === 'VERIFIED' || p.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-kat-muted">
                      {p.verified_at ? new Date(p.verified_at).toLocaleString('en-IN') : 'Verification Pending'}
                    </td>
                    <td className="py-3.5 px-4 text-right flex items-center justify-end gap-2">
                      {(p.status === 'PENDING' || p.status === 'CREATED') && (
                        <button
                          onClick={() => handleApprovePayment(p.quote_id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-colors"
                          title="Approve / Verify Payment"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePayment(p.id)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title="Delete Payment Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
