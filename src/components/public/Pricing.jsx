import React from 'react';
import { ArrowRight, Check, ShieldCheck } from 'lucide-react';

export default function Pricing({ onOpenQuote }) {
  const plans = [
    {
      title: 'Poster Design',
      price: '₹99',
      unit: '+ per poster',
      desc: 'High-res digital artwork for events, promotions, and social media campaigns.',
      features: ['4K HD Quality', 'Print & Digital Formats', 'Social Media Sizes', '24-Hour Turnaround'],
    },
    {
      title: 'Promotional Video',
      price: '₹399',
      unit: '+ per video',
      desc: 'Short motion design videos for product promos, events, and Instagram reels.',
      features: ['Full HD / 4K Render', 'Reels & Shorts Ratios', 'Voiceover & SFX Tracks', 'Fast 48-Hour Delivery'],
    },
    {
      title: 'Wishing & Gifting Website',
      price: '₹599',
      unit: '+ per site',
      desc: 'Interactive digital gift experience for birthdays, anniversaries, and wishes.',
      features: ['Custom Animations', 'Music & Slideshow', 'Secret Wish Message', '1-Year Fast Hosting'],
      popular: true,
    },
    {
      title: 'Final Year College Project',
      price: '₹4,999',
      unit: '+ full project',
      desc: 'Complete academic project solution with source code and documentation.',
      features: ['Full Source Code', 'IEEE Project Report', 'PPT & Viva Prep Guide', '1-on-1 Code Demo'],
    },
    {
      title: 'Marathon / Sports Platform',
      price: '₹6,999',
      unit: '+ per event',
      desc: 'Complete registration, bib, payment, and participant management system.',
      features: ['Runner Registration Form', 'Razorpay Payment Gateway', 'Bib & Category System', 'Live Leaderboard'],
    },
    {
      title: 'Custom Website',
      price: "Let's Discuss",
      unit: 'tailored scope',
      desc: 'Bespoke web applications and enterprise products tailored to your needs.',
      features: ['Enterprise Stack', 'Custom API & DB', 'Private Admin Portal', 'Dedicated SLA Support'],
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-kat-verylight/60 border-b border-kat-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xs sm:text-sm font-bold text-kat-primary tracking-widest uppercase bg-kat-soft inline-block px-4 py-1.5 rounded-full border border-kat-border">
            PRICING
          </h2>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-kat-navy tracking-tight">
            Transparent &amp; Competitive <span className="blue-gradient-text">Service Rates</span>
          </h3>
          <p className="text-base sm:text-lg text-kat-muted">
            Clear starting prices with zero hidden fees. Request a custom quotation anytime.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((p) => (
            <div
              key={p.title}
              className={`rounded-3xl p-8 bg-white border flex flex-col justify-between relative transition-all duration-300 ${
                p.popular
                  ? 'border-2 border-kat-primary shadow-kat-hover -translate-y-2'
                  : 'border-kat-border shadow-kat-soft hover:shadow-kat-hover hover:-translate-y-1'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-kat-deep to-kat-bright text-white text-[11px] font-extrabold px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                  MOST POPULAR
                </div>
              )}

              <div>
                <h4 className="text-xl font-extrabold text-kat-navy mb-2">{p.title}</h4>
                <p className="text-xs text-kat-muted leading-relaxed mb-6">{p.desc}</p>
                
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-kat-navy">{p.price}</span>
                  <span className="text-xs text-kat-muted font-medium">{p.unit}</span>
                </div>

                <div className="space-y-3 pt-6 border-t border-kat-border/60 mb-8">
                  {p.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-kat-navy font-medium">
                      <Check className="w-4 h-4 text-kat-primary flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onOpenQuote(p.title)}
                className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-extrabold transition-all ${
                  p.popular
                    ? 'bg-gradient-to-r from-kat-deep via-kat-primary to-kat-bright text-white shadow-md hover:shadow-kat-hover'
                    : 'bg-kat-soft text-kat-primary hover:bg-kat-primary hover:text-white border border-kat-border'
                }`}
              >
                <span>GET A QUOTE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Pricing Guarantee */}
        <div className="mt-12 bg-white p-6 rounded-2xl border border-kat-border max-w-2xl mx-auto flex items-center justify-center gap-3 text-center text-xs text-kat-muted">
          <ShieldCheck className="w-5 h-5 text-kat-primary flex-shrink-0" />
          <span>All quotations are calculated upfront with clear milestone terms. No hidden taxes or unexpected surcharges.</span>
        </div>

      </div>
    </section>
  );
}
