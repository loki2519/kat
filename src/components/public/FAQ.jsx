import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'How does the KAT quotation process work?',
      a: 'Simply click "GET A QUOTE" and submit your project requirements. You will immediately receive a unique Quote ID (e.g. KAT-Q-000001). Our team reviews your request and sends you a customized scope and quotation.',
    },
    {
      q: 'What payment options are supported?',
      a: 'We accept all major payment methods securely via Razorpay, including UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Wallet payments.',
    },
    {
      q: 'What is included in the Final Year College Projects package?',
      a: 'Our academic package includes complete clean source code, standard IEEE project report documentation (.docx), database scripts, presentation slides (.pptx), and a 1-on-1 walkthrough video/call to prepare you for your viva.',
    },
    {
      q: 'How fast can a Wishing & Gifting Website or Poster be delivered?',
      a: 'Poster designs are typically delivered within 12 to 24 hours. Wishing & Gifting websites are delivered within 24 to 48 hours with full live preview links.',
    },
    {
      q: 'Can I request custom features or modifications?',
      a: 'Yes! We specialize in custom web solutions tailored around your exact specifications. Mention your extra requirements in the Quote form, and we will incorporate them into your quotation.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-kat-verylight/60 border-b border-kat-border/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-xs sm:text-sm font-bold text-kat-primary tracking-widest uppercase bg-kat-soft inline-block px-4 py-1.5 rounded-full border border-kat-border">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-kat-navy tracking-tight">
            Got Questions? <span className="blue-gradient-text">We Have Answers</span>
          </h3>
          <p className="text-sm sm:text-base text-kat-muted">
            Find clarity on our services, quote turnaround times, and payment processing.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-kat-border shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-base text-kat-navy hover:text-kat-primary transition-colors focus:outline-none"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-kat-primary flex-shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`w-5 h-5 text-kat-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-kat-primary' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-kat-muted leading-relaxed border-t border-kat-border/40 bg-kat-verylight/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
