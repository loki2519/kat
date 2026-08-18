import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Star, CheckCircle2, XCircle, RefreshCw, MessageSquare, Clock } from 'lucide-react';

function StarDisplay({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-kat-border fill-kat-border'}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsManager() {
  const { token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [message, setMessage] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reviews/admin/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setReviews(data.reviews || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleAction = async (id, status) => {
    setMessage('');
    try {
      const res = await fetch(`/api/reviews/admin/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviews((prev) => prev.map((r) => (r.id === id ? data.review : r)));
        setMessage(`Review ${status.toLowerCase()} successfully.`);
      }
    } catch (e) {
      setMessage('Failed to update review.');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    setMessage('');
    try {
      const res = await fetch(`/api/reviews/admin/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        setMessage('Review deleted successfully.');
      } else {
        setMessage('Failed to delete review.');
      }
    } catch (e) {
      setMessage(`Error: ${e.message}`);
    }
  };

  const displayed = filter === 'ALL' ? reviews : reviews.filter((r) => r.status === filter);

  const statusCounts = {
    ALL: reviews.length,
    PENDING: reviews.filter((r) => r.status === 'PENDING').length,
    APPROVED: reviews.filter((r) => r.status === 'APPROVED').length,
    REJECTED: reviews.filter((r) => r.status === 'REJECTED').length,
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-kat-navy">Reviews & Feedback</h1>
          <p className="text-xs text-kat-muted">Approve, reject or delete customer-submitted reviews</p>
        </div>
        <button
          onClick={fetchReviews}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-kat-border text-kat-navy font-bold text-xs hover:bg-kat-soft"
        >
          <RefreshCw className="w-4 h-4 text-kat-primary" />
          <span>Refresh</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          {message}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              filter === status
                ? 'bg-kat-primary text-white shadow-md'
                : 'bg-white text-kat-navy border border-kat-border hover:bg-kat-soft'
            }`}
          >
            {status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
            {status === 'APPROVED' && <CheckCircle2 className="w-3.5 h-3.5" />}
            {status === 'REJECTED' && <XCircle className="w-3.5 h-3.5" />}
            {status === 'ALL' && <MessageSquare className="w-3.5 h-3.5" />}
            <span>{status}</span>
            <span className="bg-white/30 text-[10px] px-1.5 py-0.5 rounded-full font-extrabold">{count}</span>
          </button>
        ))}
      </div>

      {/* Reviews Table / Cards */}
      <div className="bg-white rounded-3xl border border-kat-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-kat-muted font-bold">Loading reviews...</div>
        ) : displayed.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <MessageSquare className="w-12 h-12 text-kat-border mx-auto" />
            <p className="text-xs text-kat-muted font-bold">No reviews in this category yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-kat-border/60">
            {displayed.map((r) => (
              <div key={r.id} className="p-6 flex flex-col sm:flex-row gap-4 hover:bg-kat-verylight/40 transition-colors">
                {/* Left: Review Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-extrabold text-sm text-kat-navy">{r.name}</span>
                    {r.role && <span className="text-xs text-kat-muted">{r.role}</span>}
                    <span className="text-[10px] font-bold text-kat-primary bg-kat-soft px-2.5 py-0.5 rounded-full border border-kat-border">
                      {r.service}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                      r.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                      r.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                  <StarDisplay rating={r.rating} />
                  <p className="text-sm text-kat-muted leading-relaxed italic">"{r.comment}"</p>
                  <span className="text-[10px] text-kat-muted">
                    Submitted: {new Date(r.created_at).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Right: Action Buttons */}
                <div className="flex sm:flex-col gap-2 items-start sm:items-end justify-start sm:justify-center flex-shrink-0">
                  {r.status !== 'APPROVED' && (
                    <button
                      onClick={() => handleAction(r.id, 'APPROVED')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-500 hover:text-white text-xs font-bold transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}
                  {r.status !== 'REJECTED' && (
                    <button
                      onClick={() => handleAction(r.id, 'REJECTED')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-500 hover:text-white text-xs font-bold transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteReview(r.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white text-xs font-bold transition-all"
                    title="Delete Review"
                  >
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
