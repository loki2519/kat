import React from 'react';
import { ArrowRight, Sparkles, Code2, Cpu, Globe, Rocket, CheckCircle2 } from 'lucide-react';

export default function Hero({ onOpenQuote }) {
  const handleScrollServices = (e) => {
    e.preventDefault();
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden hero-gradient-bg border-b border-kat-border/40">
      {/* Background Animated Tech Nodes & Glowing Grid Lines */}
      <div className="absolute inset-0 pointer-events-none tech-grid-pattern opacity-30" />
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-kat-bright/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-kat-primary/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-kat-soft border border-kat-border text-kat-primary text-xs sm:text-sm font-bold tracking-wider uppercase shadow-sm">
              <Sparkles className="w-4 h-4 text-kat-bright animate-spin-slow" />
              <span>DIGITAL SOLUTIONS • CREATIVE TECHNOLOGY • BUSINESS GROWTH</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-kat-navy tracking-tight leading-[1.1]">
              <span className="block">CREATE. DESIGN.</span>
              <span className="blue-gradient-text block">DELIVER. ELEVATE.</span>
            </h1>

            <p className="text-lg sm:text-xl font-medium text-kat-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              <strong className="text-kat-navy font-semibold">KAT</strong> transforms ideas into meaningful digital experiences through modern technology, strategic design, and flawless execution.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenQuote}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-kat-deep via-kat-primary to-kat-bright text-white px-8 py-4 rounded-xl font-extrabold text-base shadow-lg hover:shadow-kat-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span>GET A QUOTE</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#services"
                onClick={handleScrollServices}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-kat-navy border-2 border-kat-border hover:border-kat-primary hover:bg-kat-verylight px-7 py-4 rounded-xl font-bold text-base shadow-sm transition-all duration-200"
              >
                <span>EXPLORE OUR SERVICES</span>
              </a>
            </div>

            {/* Trust Micro-Metrics */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-kat-border/60 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-kat-primary flex-shrink-0" />
                <span className="text-xs font-semibold text-kat-muted">Enterprise Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-kat-primary flex-shrink-0" />
                <span className="text-xs font-semibold text-kat-muted">Rapid Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-kat-primary flex-shrink-0" />
                <span className="text-xs font-semibold text-kat-muted">Custom Architecture</span>
              </div>
            </div>
          </div>

          {/* Right MNC Abstract Technology Graphic & Floating Glass Cards */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-kat-navy via-kat-deep to-kat-primary p-1 shadow-2xl overflow-hidden group">
              
              {/* Inner Glowing Canvas Area */}
              <div className="relative w-full h-full bg-kat-navy/95 rounded-[22px] p-6 flex flex-col justify-between overflow-hidden">
                
                {/* Tech Node Matrix Grid Animation */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2D8CFF_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Header Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-kat-bright/20 border border-kat-bright/30 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-kat-bright animate-ping" />
                    <span className="text-xs font-bold text-kat-bright uppercase tracking-wider">KAT Core Engine</span>
                  </div>
                  <Cpu className="w-6 h-6 text-kat-bright opacity-80" />
                </div>

                {/* Center Animated Node Hub */}
                <div className="relative z-10 my-auto flex flex-col items-center justify-center space-y-4">
                  <div className="relative flex items-center justify-center">
                    <div className="w-28 h-28 rounded-full border-2 border-dashed border-kat-bright/50 animate-spin-slow" />
                    <div className="absolute w-20 h-20 rounded-full bg-gradient-to-tr from-kat-primary to-kat-bright flex items-center justify-center shadow-kat-glow">
                      <Code2 className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-white font-extrabold text-lg">Next-Gen Architecture</h3>
                    <p className="text-kat-soft text-xs">High-performance digital experiences</p>
                  </div>
                </div>

                {/* Bottom Stats Floating Micro Bar */}
                <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-kat-bright" />
                    <span className="font-semibold">Scalable Stack</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold">Optimized Performance</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Glassmorphic Cards around right side - Positioned without overlapping inner card elements */}
            <div className="absolute -top-7 -left-6 sm:-left-10 z-20 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-kat-hover border border-kat-border hidden sm:flex items-center gap-3 animate-float">
              <div className="w-9 h-9 rounded-xl bg-kat-soft flex items-center justify-center text-kat-primary font-bold text-lg">
                ⚡
              </div>
              <div>
                <div className="text-xs font-bold text-kat-navy">Fast Execution</div>
                <div className="text-[11px] text-kat-muted">On-time delivery</div>
              </div>
            </div>

            <div className="absolute -bottom-7 -right-6 sm:-right-10 z-20 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-kat-hover border border-kat-border hidden sm:flex items-center gap-3 animate-float" style={{ animationDelay: '2s' }}>
              <div className="w-9 h-9 rounded-xl bg-kat-soft flex items-center justify-center text-kat-primary font-bold text-lg">
                🎨
              </div>
              <div>
                <div className="text-xs font-bold text-kat-navy">Premium Design</div>
                <div className="text-[11px] text-kat-muted">MNC visual standard</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
