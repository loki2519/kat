import React from 'react';
import { Search, Compass, Layout, Code2, Rocket } from 'lucide-react';

export default function Process() {
  const steps = [
    {
      step: '01',
      title: 'DISCOVER',
      subtitle: 'Requirement Analysis',
      description: 'Understand the requirement, business objectives, target audience, and project goals thoroughly.',
      icon: Search,
    },
    {
      step: '02',
      title: 'PLAN',
      subtitle: 'Architecture & Scope',
      description: 'Define scope, features, technical stack, timeline milestones, and strategic direction.',
      icon: Compass,
    },
    {
      step: '03',
      title: 'DESIGN',
      subtitle: 'Visual Experience',
      description: 'Create the visual experience with modern MNC-grade UI/UX designs, wireframes, and prototypes.',
      icon: Layout,
    },
    {
      step: '04',
      title: 'DEVELOP',
      subtitle: 'Engineering & Testing',
      description: 'Build and test the product with clean code, secure backend integration, and performance checks.',
      icon: Code2,
    },
    {
      step: '05',
      title: 'DELIVER',
      subtitle: 'Deployment & Handover',
      description: 'Deploy and hand over the completed solution with full documentation and post-launch support.',
      icon: Rocket,
    },
  ];

  return (
    <section id="process" className="py-24 bg-white border-b border-kat-border/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xs sm:text-sm font-bold text-kat-primary tracking-widest uppercase bg-kat-soft inline-block px-4 py-1.5 rounded-full border border-kat-border">
            HOW WE WORK
          </h2>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-kat-navy tracking-tight">
            Our Proven 5-Step <span className="blue-gradient-text">Execution Process</span>
          </h3>
          <p className="text-base sm:text-lg text-kat-muted">
            A structured, transparent workflow ensuring precision, quality, and on-time project delivery.
          </p>
        </div>

        {/* Desktop Horizontal Timeline / Mobile Vertical Timeline */}
        <div className="mt-20">
          
          {/* Desktop Timeline */}
          <div className="hidden lg:grid grid-cols-5 gap-4 relative">
            
            {/* Connecting Line behind steps */}
            <div className="absolute top-1/4 left-10 right-10 h-0.5 bg-gradient-to-r from-kat-deep via-kat-primary to-kat-bright -z-0" />

            {steps.map((s) => {
              const IconComponent = s.icon;
              return (
                <div key={s.step} className="relative z-10 flex flex-col items-center text-center group">
                  {/* Step Circle */}
                  <div className="w-16 h-16 rounded-2xl bg-white border-2 border-kat-primary text-kat-navy flex items-center justify-center font-extrabold text-lg shadow-kat-soft group-hover:bg-kat-primary group-hover:text-white group-hover:scale-110 transition-all duration-300 mb-6">
                    <IconComponent className="w-7 h-7" />
                  </div>

                  {/* Step Number */}
                  <span className="text-xs font-black text-kat-primary bg-kat-soft px-3 py-1 rounded-full border border-kat-border mb-2">
                    STEP {s.step}
                  </span>

                  {/* Title & Desc */}
                  <h4 className="text-lg font-bold text-kat-navy group-hover:text-kat-primary transition-colors">
                    {s.title}
                  </h4>
                  <span className="text-xs font-semibold text-kat-primary block mb-2">{s.subtitle}</span>
                  <p className="text-xs text-kat-muted leading-relaxed px-2">
                    {s.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mobile & Tablet Vertical Timeline */}
          <div className="lg:hidden space-y-8 relative pl-6 border-l-2 border-kat-primary/40 ml-4">
            {steps.map((s) => {
              const IconComponent = s.icon;
              return (
                <div key={s.step} className="relative pl-6">
                  {/* Circle Pin on Line */}
                  <div className="absolute -left-[35px] top-0 w-10 h-10 rounded-xl bg-kat-primary text-white flex items-center justify-center font-bold text-sm shadow-md">
                    {s.step}
                  </div>

                  <div className="bg-kat-verylight p-6 rounded-2xl border border-kat-border shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className="w-5 h-5 text-kat-primary" />
                      <h4 className="text-lg font-bold text-kat-navy">{s.title}</h4>
                    </div>
                    <span className="text-xs font-semibold text-kat-primary block mb-2">{s.subtitle}</span>
                    <p className="text-xs text-kat-muted leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
