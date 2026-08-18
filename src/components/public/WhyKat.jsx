import React from 'react';
import { Lightbulb, Cpu, SlidersHorizontal, Eye, Zap, HeartHandshake } from 'lucide-react';

export default function WhyKat() {
  const cards = [
    {
      title: 'CREATIVE THINKING',
      desc: 'We craft distinctive visual identities and interactive concepts that separate your brand from generic templates.',
      icon: Lightbulb,
    },
    {
      title: 'MODERN TECHNOLOGY',
      desc: 'Engineered using modern, high-performance web stacks (React, Vite, Node, Express, SQLite) for speed and reliability.',
      icon: Cpu,
    },
    {
      title: 'CUSTOM SOLUTIONS',
      desc: 'Tailored specifically to your business or individual specifications without enforcing one-size-fits-all rigid templates.',
      icon: SlidersHorizontal,
    },
    {
      title: 'ATTENTION TO DETAIL',
      desc: 'Meticulous focus on typography hierarchy, mobile touch targets, responsive layouts, and clean code standards.',
      icon: Eye,
    },
    {
      title: 'FAST EXECUTION',
      desc: 'Disciplined workflow and clear milestone timelines ensuring rapid delivery without compromising output quality.',
      icon: Zap,
    },
    {
      title: 'CLIENT-FOCUSED DELIVERY',
      desc: 'Transparent pricing, dedicated technical support, and iterative communication from project kickoff to launch.',
      icon: HeartHandshake,
    },
  ];

  return (
    <section className="py-24 bg-kat-verylight/80 border-b border-kat-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xs sm:text-sm font-bold text-kat-primary tracking-widest uppercase bg-kat-soft inline-block px-4 py-1.5 rounded-full border border-kat-border">
            WHY CHOOSE KAT
          </h2>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-kat-navy tracking-tight">
            Built for Precision, Speed &amp; <span className="blue-gradient-text">Exceptional Quality</span>
          </h3>
          <p className="text-base sm:text-lg text-kat-muted">
            Why organizations, individuals, and academic clients partner with KAT for their digital products.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((c) => {
            const IconComp = c.icon;
            return (
              <div
                key={c.title}
                className="bg-white p-8 rounded-3xl border border-kat-border shadow-kat-soft kat-card-hover flex flex-col justify-between group"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-kat-soft text-kat-primary flex items-center justify-center mb-6 group-hover:bg-kat-primary group-hover:text-white transition-all duration-300 shadow-sm">
                    <IconComp className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-bold text-kat-navy mb-3 group-hover:text-kat-primary transition-colors">
                    {c.title}
                  </h4>
                  <p className="text-sm text-kat-muted leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
