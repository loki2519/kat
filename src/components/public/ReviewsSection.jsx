import React, { useState, useEffect } from 'react';
import { Star, Send, CheckCircle2, AlertCircle, MessageSquare, Users } from 'lucide-react';

function StarRating({ rating, onChange, readOnly = false }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={readOnly ? 'button' : 'button'}
          disabled={readOnly}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          className={`transition-transform ${!readOnly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
          aria-label={`${star} star`}
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              star <= (hovered || rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-kat-border fill-kat-border'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Feedback form state
  const [form, setForm] = useState({
    name: '',
    role: '',
    service: 'Wishing & Gifting Websites',
    rating: 5,
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' | 'feedback'

  useEffect(() => {
    fetch('/api/reviews/approved')
      .then((r) => r.json())
      .then((data) => {
        setReviews(data.reviews || []);
        setLoadingReviews(false);
      })
      .catch(() => setLoadingReviews(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');
      setSuccess(true);
      setForm({ name: '', role: '', service: 'Wishing & Gifting Websites', rating: 5, comment: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-24 bg-kat-verylight/60 border-b border-kat-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <h2 className="text-xs sm:text-sm font-bold text-kat-primary tracking-widest uppercase bg-kat-soft inline-block px-4 py-1.5 rounded-full border border-kat-border">
            REVIEWS &amp; FEEDBACK
          </h2>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-kat-navy tracking-tight">
            What Our <span className="blue-gradient-text">Clients Say</span>
          </h3>
          <p className="text-base sm:text-lg text-kat-muted">
            Genuine feedback from clients who experienced the KAT difference firsthand.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'reviews'
                ? 'bg-kat-primary text-white shadow-md'
                : 'bg-white text-kat-navy border border-kat-border hover:bg-kat-soft'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Client Reviews</span>
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'feedback'
                ? 'bg-kat-primary text-white shadow-md'
                : 'bg-white text-kat-navy border border-kat-border hover:bg-kat-soft'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Give Feedback</span>
          </button>
        </div>

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div>
            {loadingReviews ? (
              <div className="text-center py-12 text-kat-muted text-sm font-semibold">Loading client reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-kat-soft flex items-center justify-center mx-auto">
                  <MessageSquare className="w-8 h-8 text-kat-primary" />
                </div>
                <p className="text-kat-muted text-sm font-semibold">No approved reviews yet.</p>
                <p className="text-xs text-kat-muted">Be the first — switch to the <button onClick={() => setActiveTab('feedback')} className="text-kat-primary font-bold underline">Feedback tab</button> and share your experience!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white p-8 rounded-3xl border border-kat-border shadow-kat-soft kat-card-hover flex flex-col justify-between"
                  >
                    <div>
                      <StarRating rating={r.rating} readOnly />
                      <p className="text-sm text-kat-muted italic leading-relaxed mt-4 mb-6">
                        "{r.comment}"
                      </p>
                    </div>
                    <div className="pt-4 border-t border-kat-border/60 flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-extrabold text-kat-navy">{r.name}</h4>
                        {r.role && <span className="text-xs text-kat-muted block">{r.role}</span>}
                      </div>
                      <span className="text-[10px] font-bold text-kat-primary bg-kat-soft px-2.5 py-1 rounded-lg border border-kat-border">
                        {r.service}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FEEDBACK TAB */}
        {activeTab === 'feedback' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-kat-border shadow-kat-soft">
              <h4 className="text-2xl font-extrabold text-kat-navy mb-1">Share Your Experience</h4>
              <p className="text-xs text-kat-muted mb-6">Your review will appear publicly after approval from our team.</p>

              {success && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Thank you! Your review has been submitted and is pending approval.</span>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 text-sm font-semibold">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {!success && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-kat-navy uppercase mb-1">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Priya Sharma"
                        className="w-full px-4 py-3 rounded-xl border border-kat-border text-sm focus:outline-none focus:border-kat-primary focus:ring-2 focus:ring-kat-primary/20 bg-kat-verylight/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-kat-navy uppercase mb-1">Your Role / Occupation</label>
                      <input
                        type="text"
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        placeholder="e.g. Marathon Organizer"
                        className="w-full px-4 py-3 rounded-xl border border-kat-border text-sm focus:outline-none focus:border-kat-primary focus:ring-2 focus:ring-kat-primary/20 bg-kat-verylight/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-kat-navy uppercase mb-1">Service You Used *</label>
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-kat-border text-sm focus:outline-none focus:border-kat-primary bg-kat-verylight/40"
                    >
                      <option value="Wishing & Gifting Websites">Wishing &amp; Gifting Websites</option>
                      <option value="Final Year College Projects">Final Year College Projects</option>
                      <option value="Poster Design">Poster Design</option>
                      <option value="Marathon / Sports Websites">Marathon / Sports Websites</option>
                      <option value="Promotional Video Making">Promotional Video Making</option>
                      <option value="Custom Websites">Custom Websites</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-kat-navy uppercase mb-2">Your Rating *</label>
                    <div className="flex items-center gap-4">
                      <StarRating
                        rating={form.rating}
                        onChange={(val) => setForm({ ...form, rating: val })}
                      />
                      <span className="text-sm font-bold text-kat-navy">
                        {form.rating === 5 ? 'Excellent' : form.rating === 4 ? 'Very Good' : form.rating === 3 ? 'Good' : form.rating === 2 ? 'Fair' : 'Poor'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-kat-navy uppercase mb-1">Your Review / Feedback *</label>
                    <textarea
                      name="comment"
                      required
                      rows={5}
                      value={form.comment}
                      onChange={handleChange}
                      placeholder="Share your experience with KAT — what was delivered, how was the quality, what did you appreciate most?"
                      className="w-full px-4 py-3 rounded-xl border border-kat-border text-sm focus:outline-none focus:border-kat-primary focus:ring-2 focus:ring-kat-primary/20 bg-kat-verylight/40 leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-kat-deep via-kat-primary to-kat-bright text-white py-3.5 px-6 rounded-xl font-extrabold text-sm shadow-md hover:shadow-kat-hover disabled:opacity-50 transition-all"
                  >
                    {submitting ? (
                      <span>Submitting Review...</span>
                    ) : (
                      <>
                        <span>SUBMIT MY REVIEW</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {success && (
                <button
                  onClick={() => {
                    setSuccess(false);
                    setActiveTab('reviews');
                  }}
                  className="mt-4 w-full py-3 rounded-xl bg-kat-soft text-kat-primary border border-kat-border font-bold text-sm hover:bg-kat-primary hover:text-white transition-all"
                >
                  View All Client Reviews
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
