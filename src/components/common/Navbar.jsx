import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import logoSvg from '../../assets/kat-logo.png';

export default function Navbar({ onOpenQuote }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Section scrollSpy
      const sections = ['home', 'about', 'services', 'process', 'portfolio', 'pricing', 'reviews', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    const sectionId = href.replace('#', '');
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Process', href: '#process' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-kat-soft border-b border-kat-border/60 py-2'
          : 'bg-white/80 backdrop-blur-sm py-3 border-b border-kat-border/40'
      }`}
    >
      <div className="w-full pl-1 pr-4 sm:pr-6 lg:pr-8">
        <div className="flex items-center justify-between">
          {/* KAT Logo — extreme left, 1px gap, larger display */}
          <a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }} className="flex items-center group flex-shrink-0" style={{ marginLeft: '1px' }}>
            <img
              src={logoSvg}
              alt="KAT — Create. Design. Deliver. Elevate."
              className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              style={{ height: '80px', width: 'auto', maxWidth: '320px', minWidth: '190px', filter: 'invert(1)' }}
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 relative ${
                    isActive
                      ? 'text-kat-primary bg-kat-soft/80'
                      : 'text-kat-text hover:text-kat-primary hover:bg-kat-verylight'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-kat-primary rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2.5">
            <button
              onClick={() => onOpenQuote('track')}
              className="inline-flex items-center gap-1.5 bg-kat-verylight border border-kat-border text-kat-navy hover:bg-kat-soft hover:border-kat-primary px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all"
            >
              <span>TRACK &amp; PAY QUOTE</span>
            </button>

            <button
              onClick={() => onOpenQuote('request')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-kat-deep via-kat-primary to-kat-bright text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-kat-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <span>GET A QUOTE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-kat-navy hover:bg-kat-soft focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Ticker Banner — Continuous Scrolling Text Below Header */}
      <div className="w-full bg-gradient-to-r from-kat-navy via-indigo-950 to-kat-navy text-white text-[11px] font-extrabold py-1.5 overflow-hidden border-t border-kat-bright/20 shadow-inner flex items-center">
        <div className="animate-marquee font-mono uppercase tracking-wider flex items-center gap-6">
          <span className="text-amber-300 flex items-center gap-1.5">
            <span>⚡</span> CURRENTLY THE RAZOR PAY IS UNDER WAY DEVELOPMENT PROCESS. PLEASE PROCEED THE PAYMENTS WITH THE PHONEPAY AND GOOGLE PAY
          </span>
          <span className="text-kat-bright font-black">✦</span>
          <span className="text-amber-300 flex items-center gap-1.5">
            <span>⚡</span> CURRENTLY THE RAZOR PAY IS UNDER WAY DEVELOPMENT PROCESS. PLEASE PROCEED THE PAYMENTS WITH THE PHONEPAY AND GOOGLE PAY
          </span>
          <span className="text-kat-bright font-black">✦</span>
          <span className="text-amber-300 flex items-center gap-1.5">
            <span>⚡</span> CURRENTLY THE RAZOR PAY IS UNDER WAY DEVELOPMENT PROCESS. PLEASE PROCEED THE PAYMENTS WITH THE PHONEPAY AND GOOGLE PAY
          </span>
        </div>
      </div>

      {/* Mobile Menu Dropdown Modal */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full bg-white border-b border-kat-border shadow-2xl p-5 max-h-[calc(100vh-85px)] overflow-y-auto transition-all duration-300 animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-1.5 pb-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-kat-navy hover:bg-kat-soft hover:text-kat-primary transition-colors flex items-center justify-between"
              >
                <span>{link.name}</span>
                <ArrowRight className="w-4 h-4 text-kat-muted" />
              </a>
            ))}
            <div className="pt-3 border-t border-kat-border space-y-2 mt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuote('track');
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-kat-verylight text-kat-navy border border-kat-border py-2.5 px-5 rounded-xl font-bold text-xs shadow-sm"
              >
                <span>TRACK &amp; PAY QUOTE</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuote('request');
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-kat-deep to-kat-primary text-white py-3 px-5 rounded-xl font-bold text-sm shadow-lg active:scale-[0.98] transition-all"
              >
                <span>GET A QUOTE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
