import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      name: 'Event Coordinator',
      role: 'Sports Marathon Organizer',
      service: 'Marathon & Sports Platform',
      comment: 'KAT built our marathon registration website seamlessly. Participant registrations, payment collection via Razorpay, and bib tracking ran smoothly without any downtime.',
    },
    {
      name: 'Engineering Student',
      role: 'Computer Science Final Year',
      service: 'Final Year College Project',
      comment: 'The academic project documentation, clean source code implementation, and 1-on-1 code walkthrough made our final viva presentation stress-free and successful.',
    },
    {
      name: 'Individual Client',
      role: 'Birthday Gift Website Customer',
      service: 'Wishing & Gifting Website',
      comment: 'The custom gifting website KAT created for my anniversary was astonishing. The animations, secret message reveal, and music slideshow were praised by everyone.',
    },
  ];

  return (
    <section className="py-24 bg-white border-b border-kat-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xs sm:text-sm font-bold text-kat-primary tracking-widest uppercase bg-kat-soft inline-block px-4 py-1.5 rounded-full border border-kat-border">
            TESTIMONIALS
          </h2>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-kat-navy tracking-tight">
            Client Feedback &amp; <span className="blue-gradient-text">Deliverable Success</span>
          </h3>
          <p className="text-base sm:text-lg text-kat-muted">
            Feedback from individuals, organizations, and academic clients who trust KAT.
          </p>
        </div>

        {/* 3 Review Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="bg-kat-verylight/80 p-8 rounded-3xl border border-kat-border shadow-kat-soft flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-kat-muted italic leading-relaxed mb-6">
                  "{r.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-kat-border/60 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-kat-navy">{r.name}</h4>
                  <span className="text-xs text-kat-muted block">{r.role}</span>
                </div>
                <span className="text-[10px] font-bold text-kat-primary bg-kat-soft px-2.5 py-1 rounded-lg border border-kat-border">
                  {r.service}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
