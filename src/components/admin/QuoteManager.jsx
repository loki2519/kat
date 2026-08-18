import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter, RefreshCw, Eye, Edit3, Send, CheckCircle2, FileText, ArrowUpDown } from 'lucide-react';

export default function QuoteManager() {
  const { token } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('newest');

  // Selected Quote Detail State
  const [activeQuote, setActiveQuote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [quotedAmount, setQuotedAmount] = useState(0);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        status: statusFilter,
        search,
        sort: sortOrder,
      });

      const res = await fetch(`/api/quotes/admin/all?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setQuotes(data.quotes);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [statusFilter, search, sortOrder]);

  const handleOpenDetails = async (quote) => {
    setActiveQuote(quote);
    setQuotedAmount(quote.quoted_amount || 0);
    setNewStatus(quote.status);
    setMessage('');

    try {
      const res = await fetch(`/api/quotes/admin/details/${quote.quote_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setNotes(data.notes || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateQuote = async (e) => {
    e.preventDefault();
    if (!activeQuote) return;
    setUpdating(true);
    setMessage('');

    try {
      const res = await fetch(`/api/quotes/admin/${activeQuote.quote_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          quoted_amount: Number(quotedAmount),
          admin_note: newNote.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update quote');

      setActiveQuote(data.quote);
      setNotes(data.notes || []);
      setNewNote('');
      setMessage('Quotation updated successfully!');
      fetchQuotes();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteQuote = async (quoteId) => {
    if (!window.confirm(`Are you sure you want to delete quotation request ${quoteId}?`)) return;

    try {
      const res = await fetch(`/api/quotes/admin/${quoteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setQuotes(prev => prev.filter(q => q.quote_id !== quoteId && String(q.id) !== String(quoteId)));
        if (activeQuote && (activeQuote.quote_id === quoteId || String(activeQuote.id) === String(quoteId))) {
          setActiveQuote(null);
        }
      } else {
        alert('Failed to delete quotation request');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const statuses = [
    'ALL', 'NEW', 'CONTACTED', 'QUOTED', 'APPROVED', 'PAYMENT PENDING', 'PAID', 'IN PROGRESS', 'COMPLETED', 'CANCELLED'
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-kat-navy">Quotation Management</h1>
          <p className="text-xs text-kat-muted">Review incoming requests, set prices, and update project status</p>
        </div>

        <button
          onClick={fetchQuotes}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-kat-border text-kat-navy font-bold text-xs hover:bg-kat-soft"
        >
          <RefreshCw className="w-4 h-4 text-kat-primary" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-kat-border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search Quote ID, Client, Service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-kat-border text-xs focus:outline-none focus:border-kat-primary bg-kat-verylight/50 font-medium"
          />
          <Search className="w-4 h-4 text-kat-muted absolute left-3 top-3" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-kat-muted">
            <Filter className="w-4 h-4 text-kat-primary" />
            <span>Status:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-kat-border text-xs font-bold text-kat-navy bg-white focus:outline-none"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            className="px-3 py-2 rounded-xl border border-kat-border text-xs font-bold text-kat-navy bg-white flex items-center gap-1.5"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-kat-muted" />
            <span className="capitalize">{sortOrder}</span>
          </button>
        </div>

      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-3xl border border-kat-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-kat-muted font-bold">
            Fetching quotation data...
          </div>
        ) : quotes.length === 0 ? (
          <div className="p-12 text-center text-xs text-kat-muted font-bold">
            No quotation requests found matching filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-kat-border text-kat-muted uppercase tracking-wider text-[10px] font-bold bg-kat-verylight/60">
                  <th className="py-3.5 px-4">Quote ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Submitted Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Quoted Amount</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-kat-border/60 font-medium">
                {quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-kat-verylight/60">
                    <td className="py-3.5 px-4 font-mono font-extrabold text-kat-primary">{q.quote_id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-kat-navy">{q.customer_name}</div>
                      <div className="text-[11px] text-kat-muted">{q.customer_email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-kat-navy">{q.service_name}</td>
                    <td className="py-3.5 px-4 text-kat-muted">{new Date(q.created_at).toLocaleDateString('en-IN')}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        q.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                        q.status === 'QUOTED' ? 'bg-indigo-100 text-indigo-800' :
                        q.status === 'NEW' ? 'bg-amber-100 text-amber-800' : 'bg-kat-soft text-kat-primary'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-kat-navy">
                      {q.quoted_amount > 0 ? `₹${q.quoted_amount}` : 'Not Priced'}
                    </td>
                    <td className="py-3.5 px-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenDetails(q)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-kat-primary text-white text-[11px] font-bold hover:bg-kat-deep transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                      <button
                        onClick={() => handleDeleteQuote(q.quote_id)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title="Delete Quote"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quote Detail & Pricing Drawer Modal */}
      {activeQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-kat-navy/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white h-full w-full max-w-xl p-6 sm:p-8 shadow-2xl overflow-y-auto relative flex flex-col justify-between animate-in slide-in-from-right duration-300">
            
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-kat-border pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-kat-primary bg-kat-soft px-3 py-1 rounded-full">{activeQuote.quote_id}</span>
                  <h3 className="text-xl font-extrabold text-kat-navy mt-2">{activeQuote.service_name}</h3>
                </div>
                <button
                  onClick={() => setActiveQuote(null)}
                  className="text-kat-muted hover:text-kat-navy p-1 text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              {message && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  {message}
                </div>
              )}

              {/* Customer Details */}
              <div className="bg-kat-verylight p-4 rounded-2xl border border-kat-border space-y-2 text-xs">
                <h4 className="font-extrabold text-kat-navy text-xs uppercase">Customer Contact Info</h4>
                <div className="grid grid-cols-2 gap-2 text-kat-muted">
                  <div><strong>Name:</strong> {activeQuote.customer_name}</div>
                  <div><strong>Phone:</strong> {activeQuote.customer_phone}</div>
                  <div className="col-span-2"><strong>Email:</strong> {activeQuote.customer_email}</div>
                </div>
              </div>

              {/* Description & Requirements */}
              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-extrabold text-kat-navy uppercase mb-1">Project Description</h4>
                  <p className="p-3 rounded-xl bg-kat-verylight border border-kat-border text-kat-muted leading-relaxed">{activeQuote.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h4 className="font-extrabold text-kat-navy uppercase mb-1">Budget Range</h4>
                    <div className="p-2.5 rounded-xl bg-kat-soft text-kat-primary font-bold">{activeQuote.budget}</div>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-kat-navy uppercase mb-1">Preferred Date</h4>
                    <div className="p-2.5 rounded-xl bg-kat-verylight text-kat-navy font-bold">{activeQuote.preferred_date || 'Flexible'}</div>
                  </div>
                </div>
              </div>

              {/* Status & Pricing Update Form */}
              <form onSubmit={handleUpdateQuote} className="space-y-4 pt-4 border-t border-kat-border">
                <h4 className="font-extrabold text-kat-navy text-xs uppercase">Update Quote &amp; Price</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-extrabold text-kat-navy uppercase mb-1">Quote Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-kat-border text-xs font-bold text-kat-navy bg-white"
                    >
                      {statuses.filter(s => s !== 'ALL').map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-kat-navy uppercase mb-1">Quoted Price (₹)</label>
                    <input
                      type="number"
                      value={quotedAmount}
                      onChange={(e) => setQuotedAmount(e.target.value)}
                      placeholder="e.g. 5000"
                      className="w-full px-3 py-2 rounded-xl border border-kat-border text-xs font-bold text-kat-navy bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-kat-navy uppercase mb-1">Add Admin Note</label>
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="e.g. Discussed via call, client approved quotation..."
                    className="w-full px-3 py-2 rounded-xl border border-kat-border text-xs focus:outline-none focus:border-kat-primary bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full inline-flex items-center justify-center gap-2 bg-kat-primary text-white py-3 rounded-xl font-bold text-xs hover:bg-kat-deep transition-all"
                >
                  {updating ? 'Saving Changes...' : 'Save & Update Quotation'}
                </button>
              </form>

              {/* Admin Notes Log */}
              {notes.length > 0 && (
                <div className="pt-4 border-t border-kat-border space-y-2">
                  <h4 className="font-extrabold text-kat-navy text-xs uppercase">Activity History</h4>
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {notes.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-kat-verylight text-[11px] text-kat-muted border border-kat-border/60">
                        <div className="flex items-center justify-between font-bold text-kat-navy mb-1">
                          <span>{n.author}</span>
                          <span className="text-[10px] text-kat-muted">{new Date(n.created_at).toLocaleString()}</span>
                        </div>
                        <div>{n.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            <div className="pt-6 border-t border-kat-border mt-6 flex gap-3">
              <button
                onClick={() => handleDeleteQuote(activeQuote.quote_id)}
                className="px-4 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-bold hover:bg-red-100 transition-colors"
              >
                Delete Quote
              </button>
              <button
                onClick={() => setActiveQuote(null)}
                className="flex-1 py-2.5 rounded-xl bg-kat-verylight text-kat-navy border border-kat-border text-xs font-bold hover:bg-kat-soft"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
