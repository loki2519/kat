import React, { useState } from 'react';
import { Gift, GraduationCap, Palette, Activity, Video, Code, ArrowRight, Eye, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export default function Services({ onSelectService, onOpenQuote }) {
  const [selectedModalService, setSelectedModalService] = useState(null);

  const services = [
    {
      id: 1,
      slug: 'wishing-gifting',
      title: 'Wishing & Gifting Websites',
      price: '₹599+',
      priceNum: 599,
      icon: Gift,
      description: 'Interactive digital experiences designed to turn birthdays, anniversaries and special moments into memorable online gifts.',
      overview: 'Transform personal milestones into unforgettable digital experiences with custom animations, photo slideshows, interactive music, and personalized secret messages.',
      deliverables: [
        'Custom Interactive Animation Effects',
        'High-Quality Background Music & Audio',
        'Personalized Photo Slideshow Gallery',
        'Private Secret Message & Wish Box',
        'Custom Domain / Shareable QR Link',
        '1-Year Free Fast Hosting',
      ],
      deliveryTime: '24 – 48 Hours',
    },
    {
      id: 2,
      slug: 'college-projects',
      title: 'Final Year College Projects',
      price: '₹4,999+',
      priceNum: 4999,
      icon: GraduationCap,
      description: 'Complete academic project solutions with modern interfaces, documentation support and practical technology implementation.',
      overview: 'Comprehensive, plagiarism-free engineering & computer science projects. Comes complete with robust source code, database architecture, project report documentation, and viva prep.',
      deliverables: [
        'Full Clean Source Code & Architecture',
        'Complete Project IEEE/Standard Report (.docx/.pdf)',
        'Database Schema & Express/SQL APIs',
        'Professional Presentation Deck (.pptx)',
        '1-on-1 Code Explanation & Demo Video',
        'Setup & Installation Support',
      ],
      deliveryTime: '3 – 5 Days',
    },
    {
      id: 3,
      slug: 'poster-design',
      title: 'Poster Design',
      price: '₹99+',
      priceNum: 99,
      icon: Palette,
      description: 'Professional digital posters for events, businesses, celebrations, promotions and social media campaigns.',
      overview: 'Eye-catching graphic artwork crafted by senior designers. Suitable for commercial promotions, Instagram/WhatsApp campaigns, academic events, and corporate announcements.',
      deliverables: [
        'Ultra High-Resolution 4K Graphics',
        'Print-Ready PDF & CMYK Formats',
        'Optimized Social Media Ratios (1:1 & 9:16)',
        'MNC Typography & Clean Layouts',
        'Unlimited Minor Revisions',
      ],
      deliveryTime: '12 – 24 Hours',
    },
    {
      id: 4,
      slug: 'marathon-sports',
      title: 'Marathon / Sports Websites',
      price: '₹6,999+',
      priceNum: 6999,
      icon: Activity,
      description: 'Complete event platforms with registration, payments, participant management and digital event experiences.',
      overview: 'End-to-end sports management portal for marathons, tournaments, and athletic meets. Handles runner registrations, distance categories, payment collection, bib assignments, and live result leaderboards.',
      deliverables: [
        'Participant Registration & Ticketing Form',
        'Integrated Razorpay/UPI Payment Gateway',
        'Admin Dashboard for Participant Export',
        'Category & Bib Number Generator',
        'Sponsor & Brand Banner Showcases',
        'E-Certificates Download Portal',
      ],
      deliveryTime: '5 – 7 Days',
    },
    {
      id: 5,
      slug: 'promo-videos',
      title: 'Promotional Video Making',
      price: '₹399+',
      priceNum: 399,
      icon: Video,
      description: 'Short-form promotional videos designed to capture attention and communicate your event, product or brand.',
      overview: 'Engaging, fast-paced motion design promotional videos for product launches, event teasers, brand stories, and social media reels that drive high engagement.',
      deliverables: [
        'Full HD / 4K Crisp Render',
        'Dynamic Motion Graphics & Text FX',
        'Professional AI/Human Voiceover Options',
        'Licensed Royalty-Free Background Music',
        'Vertical (9:16 Reels) & Horizontal (16:9) Cuts',
      ],
      deliveryTime: '24 – 48 Hours',
    },
    {
      id: 6,
      slug: 'custom-websites',
      title: 'Custom Websites',
      price: 'Custom Pricing',
      priceNum: 0,
      icon: Code,
      description: 'Tailored websites and digital products designed around your specific business requirements.',
      overview: 'Bespoke web applications, corporate consulting sites, SaaS dashboards, and e-commerce platforms engineered from scratch using modern technology standards.',
      deliverables: [
        'Tailored Responsive Frontend Architecture',
        'Secure Express / SQLite / Node Backend',
        'Private Admin Management Portal',
        'Payment Gateway & Webhook Integration',
        'SEO Optimization & Fast SSL Hosting',
        'Dedicated SLA Maintenance Support',
      ],
      deliveryTime: 'Scoped per Project',
    },
  ];

  return (
    <section id="services" className="py-24 bg-kat-verylight/60 border-b border-kat-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xs sm:text-sm font-bold text-kat-primary tracking-widest uppercase bg-kat-soft inline-block px-4 py-1.5 rounded-full border border-kat-border">
            WHAT WE DO
          </h2>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-kat-navy tracking-tight">
            Our Core <span className="blue-gradient-text">Digital Services</span>
          </h3>
          <p className="text-base sm:text-lg text-kat-muted">
            High-quality, modern, and affordable solutions crafted with technical precision and creative design.
          </p>
        </div>

        {/* Services Grid (6 Cards) */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s) => {
            const IconComponent = s.icon;
            return (
              <div
                key={s.id}
                className="bg-white rounded-3xl p-8 border border-kat-border shadow-kat-soft kat-card-hover flex flex-col justify-between group"
              >
                <div>
                  {/* Service Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-kat-soft text-kat-primary flex items-center justify-center mb-6 group-hover:bg-kat-primary group-hover:text-white transition-all duration-300 shadow-sm">
                    <IconComponent className="w-7 h-7" />
                  </div>

                  {/* Title */}
                  <h4 className="text-2xl font-bold text-kat-navy group-hover:text-kat-primary transition-colors mb-3">
                    {s.title}
                  </h4>

                  {/* Short Description */}
                  <p className="text-sm text-kat-muted leading-relaxed mb-6">
                    {s.description}
                  </p>
                </div>

                <div>
                  {/* Price Tag */}
                  <div className="pt-4 border-t border-kat-border/60 flex items-center justify-between mb-6">
                    <span className="text-xs font-semibold text-kat-muted">Starting Price</span>
                    <span className="text-lg font-extrabold text-kat-navy bg-kat-soft px-3 py-1 rounded-xl text-kat-primary border border-kat-border">
                      {s.price}
                    </span>
                  </div>

                  {/* Card Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedModalService(s)}
                      className="inline-flex items-center justify-center gap-1.5 bg-kat-verylight text-kat-navy border border-kat-border hover:bg-kat-soft hover:text-kat-primary py-2.5 px-3 rounded-xl text-xs font-bold transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>VIEW DETAILS</span>
                    </button>

                    <button
                      onClick={() => onOpenQuote(s.title)}
                      className="inline-flex items-center justify-center gap-1 bg-kat-primary text-white hover:bg-kat-deep py-2.5 px-3 rounded-xl text-xs font-bold shadow-sm transition-all"
                    >
                      <span>GET A QUOTE</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Detailed Service Interaction Modal */}
      {selectedModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-kat-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-kat-border max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-kat-border pb-5 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-kat-soft text-kat-primary flex items-center justify-center">
                  <selectedModalService.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-kat-navy">{selectedModalService.title}</h3>
                  <span className="text-sm font-bold text-kat-primary">{selectedModalService.price}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedModalService(null)}
                className="text-kat-muted hover:text-kat-navy p-1 rounded-lg hover:bg-kat-soft text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-kat-muted uppercase tracking-wider mb-2">Service Overview</h4>
                <p className="text-sm text-kat-text leading-relaxed">{selectedModalService.overview}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-kat-muted uppercase tracking-wider mb-3">What Is Included</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedModalService.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-medium text-kat-navy bg-kat-verylight p-2.5 rounded-xl border border-kat-border/60">
                      <CheckCircle2 className="w-4 h-4 text-kat-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between bg-kat-soft/80 p-4 rounded-2xl border border-kat-border">
                <div className="flex items-center gap-2 text-xs font-semibold text-kat-navy">
                  <Clock className="w-4 h-4 text-kat-primary" />
                  <span>Typical Delivery: <strong>{selectedModalService.deliveryTime}</strong></span>
                </div>
                <div className="text-xs font-bold text-kat-primary">Customization Available</div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="mt-8 pt-5 border-t border-kat-border flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedModalService(null)}
                className="px-5 py-2.5 rounded-xl border border-kat-border text-sm font-bold text-kat-muted hover:bg-kat-soft"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const title = selectedModalService.title;
                  setSelectedModalService(null);
                  onOpenQuote(title);
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-kat-deep to-kat-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-kat-hover"
              >
                <span>GET A QUOTE FOR THIS SERVICE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
