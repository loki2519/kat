import React from 'react';
import { Target, Compass, Award, Lightbulb, Shield, Cpu, Zap, Check } from 'lucide-react';

export default function About() {
  const values = [
    { title: 'CREATIVITY', desc: 'Crafting unique visual identities and compelling digital experiences.', icon: Lightbulb },
    { title: 'QUALITY', desc: 'Delivering robust, flaw-free software and enterprise-grade designs.', icon: Award },
    { title: 'INNOVATION', desc: 'Leveraging modern web frameworks and cutting-edge tech stacks.', icon: Cpu },
    { title: 'RELIABILITY', desc: 'Honoring commitments with transparent communication and execution.', icon: Shield },
    { title: 'EXECUTION', desc: 'Turning concepts into live, practical, high-impact products rapidly.', icon: Zap },
  ];

  return (
    <section id="about" className="py-24 bg-white border-b border-kat-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xs sm:text-sm font-bold text-kat-primary tracking-widest uppercase bg-kat-soft inline-block px-4 py-1.5 rounded-full border border-kat-border">
            WHO WE ARE
          </h2>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-kat-navy tracking-tight">
            Building Practical &amp; Impactful <span className="blue-gradient-text">Digital Products</span>
          </h3>
          <p className="text-base sm:text-lg text-kat-muted leading-relaxed">
            KAT is a digital solutions company focused on creating meaningful technology experiences for individuals, businesses, and organizations.
          </p>
          <p className="text-base sm:text-lg text-kat-muted leading-relaxed font-normal">
            We combine technology, design and execution to transform ideas into digital products that are practical, engaging and built for impact.
          </p>
        </div>

        {/* Mission & Vision Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mission Card */}
          <div className="bg-kat-verylight p-8 rounded-3xl border border-kat-border/80 shadow-kat-soft hover:shadow-kat-hover transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-kat-primary/10 flex items-center justify-center text-kat-primary mb-6">
              <Target className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-bold text-kat-navy mb-3">Our Mission</h4>
            <p className="text-kat-muted text-base leading-relaxed">
              To empower clients by transforming ambitious concepts into high-performing digital platforms through disciplined engineering, strategic UI/UX design, and rapid delivery cycles.
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-kat-verylight p-8 rounded-3xl border border-kat-border/80 shadow-kat-soft hover:shadow-kat-hover transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-kat-bright/10 flex items-center justify-center text-kat-bright mb-6">
              <Compass className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-bold text-kat-navy mb-3">Our Vision</h4>
            <p className="text-kat-muted text-base leading-relaxed">
              To be recognized as a premier digital solutions catalyst known for creative clarity, technology precision, and elevated customer outcomes across every project standard.
            </p>
          </div>

        </div>

        {/* Core Values Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h4 className="text-2xl font-bold text-kat-navy">Our Core Values</h4>
            <p className="text-kat-muted text-sm mt-1">The foundational pillars guiding every project at KAT</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {values.map((v) => {
              const IconComp = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-white p-6 rounded-2xl border border-kat-border/80 shadow-sm hover:border-kat-primary hover:shadow-kat-soft transition-all duration-200 text-center flex flex-col items-center group"
                >
                  <div className="w-12 h-12 rounded-xl bg-kat-soft text-kat-primary flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-kat-primary group-hover:text-white transition-all duration-300">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h5 className="text-base font-extrabold text-kat-navy mb-2 tracking-wider">{v.title}</h5>
                  <p className="text-xs text-kat-muted leading-normal">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
