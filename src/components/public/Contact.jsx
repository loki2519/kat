import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import logoImg from '../../assets/kat-logo.png';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'General Inquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit contact message');

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', service: 'General Inquiry', message: '' });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white border-b border-kat-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Contact Info */}
          <div className="lg:col-span-5 space-y-6">
          {/* KAT Logo */}
            <div className="mb-2">
              <img src={logoImg} alt="KAT Digital Solutions" className="h-12 w-auto object-contain" />
            </div>

            <h2 className="text-xs font-bold text-kat-primary tracking-widest uppercase bg-kat-soft inline-block px-4 py-1.5 rounded-full border border-kat-border">
              CONTACT KAT
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-kat-navy tracking-tight leading-snug">
              Let's Discuss Your <span className="blue-gradient-text">Next Project</span>
            </h3>
            <p className="text-base text-kat-muted leading-relaxed">
              Have questions or need technical guidance? Fill out the form or reach out to our team directly.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-kat-verylight border border-kat-border">
                <div className="w-12 h-12 rounded-xl bg-kat-soft text-kat-primary flex items-center justify-center font-bold">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-kat-muted uppercase">Email Us</span>
                  <a href="mailto:katdigital.solutions@gmail.com" className="text-sm font-extrabold text-kat-navy hover:text-kat-primary block">katdigital.solutions@gmail.com</a>
                </div>
              </div>

              <a
                href="https://wa.me/919542166098"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-kat-verylight border border-kat-border hover:border-kat-primary hover:bg-kat-soft/50 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-kat-soft text-kat-primary group-hover:bg-kat-primary group-hover:text-white flex items-center justify-center font-bold transition-colors">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-kat-muted uppercase">Call / WhatsApp Chat</span>
                  <span className="text-sm font-extrabold text-kat-navy group-hover:text-kat-primary block">+91 9542166098</span>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-kat-verylight border border-kat-border">
                <div className="w-12 h-12 rounded-xl bg-kat-soft text-kat-primary flex items-center justify-center font-bold">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-kat-muted uppercase">Corporate Location</span>
                  <div className="text-sm font-extrabold text-kat-navy">MVP Colony, Sec-9</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="lg:col-span-7 bg-kat-verylight p-8 sm:p-10 rounded-3xl border border-kat-border shadow-kat-soft">
            <h4 className="text-2xl font-extrabold text-kat-navy mb-2">Send Us a Message</h4>
            <p className="text-xs text-kat-muted mb-6">Our average response time is within 2 to 4 business hours.</p>

            {success && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Thank you for reaching out! Your message has been sent successfully.</span>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 text-sm font-semibold">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-kat-navy uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-xl border border-kat-border text-sm focus:outline-none focus:border-kat-primary focus:ring-2 focus:ring-kat-primary/20 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-kat-navy uppercase mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-xl border border-kat-border text-sm focus:outline-none focus:border-kat-primary focus:ring-2 focus:ring-kat-primary/20 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-kat-navy uppercase mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl border border-kat-border text-sm focus:outline-none focus:border-kat-primary focus:ring-2 focus:ring-kat-primary/20 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-kat-navy uppercase mb-1">Service Interest</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-kat-border text-sm focus:outline-none focus:border-kat-primary focus:ring-2 focus:ring-kat-primary/20 bg-white"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Wishing & Gifting Websites">Wishing &amp; Gifting Websites</option>
                    <option value="Final Year College Projects">Final Year College Projects</option>
                    <option value="Poster Design">Poster Design</option>
                    <option value="Marathon / Sports Websites">Marathon / Sports Websites</option>
                    <option value="Promotional Video Making">Promotional Video Making</option>
                    <option value="Custom Websites">Custom Websites</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-kat-navy uppercase mb-1">Message / Requirements *</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your inquiry or requirements..."
                  className="w-full px-4 py-3 rounded-xl border border-kat-border text-sm focus:outline-none focus:border-kat-primary focus:ring-2 focus:ring-kat-primary/20 bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-kat-deep via-kat-primary to-kat-bright text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-md hover:shadow-kat-hover disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <span>SUBMIT MESSAGE</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
