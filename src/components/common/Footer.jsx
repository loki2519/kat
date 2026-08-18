import React from 'react';
import logoSvg from '../../assets/kat-logo.png';

export default function Footer({ onOpenQuote }) {
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-kat-navy text-white pt-16 pb-12 border-t border-kat-bright/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <div className="h-10 flex items-center">
              <img src={logoSvg} alt="KAT Logo" className="h-10 w-auto object-contain brightness-0 invert" />
            </div>
            <p className="text-sm font-bold text-kat-bright uppercase tracking-widest pt-1">
              CREATE. DESIGN. DELIVER. ELEVATE.
            </p>
            <p className="text-xs text-kat-soft/80 leading-relaxed max-w-sm">
              KAT is a digital solutions company focused on creating meaningful technology experiences for individuals, businesses, and organizations.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-kat-bright">Navigation</h4>
            <ul className="space-y-2 text-xs text-kat-soft/80 font-medium">
              <li><button onClick={() => handleScroll('home')} className="hover:text-white transition-colors">Home</button></li>
              <li><button onClick={() => handleScroll('about')} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => handleScroll('services')} className="hover:text-white transition-colors">Services</button></li>
              <li><button onClick={() => handleScroll('process')} className="hover:text-white transition-colors">Process</button></li>
              <li><button onClick={() => handleScroll('portfolio')} className="hover:text-white transition-colors">Portfolio</button></li>
              <li><button onClick={() => handleScroll('pricing')} className="hover:text-white transition-colors">Pricing</button></li>
            </ul>
          </div>

          {/* Core Services */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-kat-bright">Our Services</h4>
            <ul className="space-y-2 text-xs text-kat-soft/80 font-medium">
              <li>Wishing &amp; Gifting Websites</li>
              <li>Final Year College Projects</li>
              <li>Poster Design</li>
              <li>Marathon / Sports Websites</li>
              <li>Promotional Video Making</li>
              <li>Custom Websites</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-kat-bright">Contact KAT</h4>
            <div className="space-y-2 text-xs text-kat-soft/80 font-medium">
              <div>Email: <a href="mailto:katdigital.solutions@gmail.com" className="text-white hover:text-kat-bright transition-colors">katdigital.solutions@gmail.com</a></div>
              <div>Phone: <a href="https://wa.me/919542166098" target="_blank" rel="noopener noreferrer" className="text-white hover:text-kat-bright transition-colors">+91 9542166098</a></div>
              <div>Location: <span className="text-white">MVP Colony, Sec-9</span></div>
              <div className="pt-2">
                <button
                  onClick={onOpenQuote}
                  className="px-4 py-2 rounded-xl bg-kat-primary text-white font-bold text-xs hover:bg-kat-bright transition-all"
                >
                  GET A QUOTE
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-kat-soft/60">
          <p>© 2026 KAT. All rights reserved.</p>
          <p className="text-[11px]">Digital Technology &amp; Creative Solutions</p>
        </div>

      </div>
    </footer>
  );
}
