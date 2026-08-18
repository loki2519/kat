import React, { useState } from 'react';
import { ExternalLink, Layers, Eye } from 'lucide-react';

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = [
    'ALL',
    'WEBSITES',
    'EVENT PLATFORMS',
    'DIGITAL GIFTS',
    'POSTERS',
    'VIDEO',
    'CUSTOM PROJECTS',
  ];

  const projects = [
    {
      id: 1,
      title: 'City Marathon & Sports Festival Platform',
      category: 'EVENT PLATFORMS',
      shortDesc: 'Complete runner registration, bib management, payment gateway, and live leaderboards.',
      fullDesc: 'A comprehensive web platform engineered for sports event management. Features online runner registration with automated bib generation, Razorpay payment processing, and category filters.',
      tag: 'Full Stack App',
      specs: ['Razorpay Payment Gateway', 'Bib Generator', 'Participant CSV Export', 'Responsive Layout'],
    },
    {
      id: 2,
      title: 'Interactive Birthday & Milestone Gifting Portal',
      category: 'DIGITAL GIFTS',
      shortDesc: 'Personalized interactive online wish website with music, secret messages & animations.',
      fullDesc: 'Designed to deliver an emotional and memorable online gift experience. Features smooth CSS keyframe particle effects, secret passcode wish reveal, and custom audio player.',
      tag: 'Interactive Web',
      specs: ['Audio Player Integration', 'Secret Code Reveal', 'Mobile Responsive UI', '1-Click Shareable Link'],
    },
    {
      id: 3,
      title: 'Academic Smart AI & IoT College Project System',
      category: 'CUSTOM PROJECTS',
      shortDesc: 'Final year engineering project with full documentation, REST API backend, and presentation deck.',
      fullDesc: 'End-to-end computer science final year project solution. Includes complete Node.js/Express backend APIs, database schema, project report document, and viva preparation guide.',
      tag: 'Academic Solution',
      specs: ['Node.js & SQLite Backend', 'IEEE Project Report (.docx)', 'PPT Presentation', 'Viva Q&A Guide'],
    },
    {
      id: 4,
      title: 'Corporate Tech Summit Promotional Poster Series',
      category: 'POSTERS',
      shortDesc: 'Print-ready high-resolution digital poster design for tech conferences and social media.',
      fullDesc: 'Ultra-modern MNC graphic posters created for event promotion. Delivered in 4K resolution across print-ready PDF and social media story/post aspect ratios.',
      tag: 'Graphic Design',
      specs: ['4K Ultra HD Graphics', 'Print CMYK PDF', 'Instagram 9:16 & 1:1', 'Custom MNC Typography'],
    },
    {
      id: 5,
      title: 'High-Impact Brand Teaser & Motion Graphic Video',
      category: 'VIDEO',
      shortDesc: '30-second promotional motion graphic video for product release and Instagram reels.',
      fullDesc: 'Fast-paced promotional video featuring motion graphic text reveals, licensed sound effects, sound design, and custom voiceover matching brand colors.',
      tag: 'Motion Video',
      specs: ['1080p / 4K Render', 'Reels 9:16 & 16:9 Cuts', 'Voiceover & SFX Track', 'Fast 24-Hour Turnaround'],
    },
    {
      id: 6,
      title: 'Enterprise Business Consulting Website',
      category: 'WEBSITES',
      shortDesc: 'Modern MNC consulting website with interactive service calculator and quote management.',
      fullDesc: 'Sleek corporate web portal built for modern consulting practices. Features glassmorphism UI components, responsive hero animations, and backend lead capture.',
      tag: 'Corporate Web',
      specs: ['React & Tailwind CSS', 'Express backend API', 'Quote Request Engine', 'SEO & Speed Optimized'],
    },
  ];

  const filteredProjects = activeCategory === 'ALL'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-24 bg-white border-b border-kat-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xs sm:text-sm font-bold text-kat-primary tracking-widest uppercase bg-kat-soft inline-block px-4 py-1.5 rounded-full border border-kat-border">
            OUR PORTFOLIO
          </h2>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-kat-navy tracking-tight">
            Featured Works &amp; <span className="blue-gradient-text">Digital Products</span>
          </h3>
          <p className="text-base sm:text-lg text-kat-muted">
            Explore showcase deliverables spanning custom web applications, event platforms, and creative design.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-kat-primary text-white shadow-md'
                  : 'bg-kat-verylight text-kat-navy hover:bg-kat-soft border border-kat-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="bg-kat-verylight/60 rounded-3xl overflow-hidden border border-kat-border shadow-kat-soft kat-card-hover flex flex-col justify-between group"
            >
              {/* Graphic Banner Placeholder */}
              <div className="h-48 bg-gradient-to-br from-kat-navy via-kat-deep to-kat-primary p-6 relative flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 tech-grid-pattern opacity-20" />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full border border-white/20">
                    {p.category}
                  </span>
                  <Layers className="w-5 h-5 text-kat-bright opacity-80" />
                </div>
                <div className="relative z-10">
                  <span className="text-xs text-kat-soft font-semibold block">{p.tag}</span>
                  <h4 className="text-lg font-extrabold text-white line-clamp-1">{p.title}</h4>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-sm text-kat-muted leading-relaxed mb-6">
                  {p.shortDesc}
                </p>

                <button
                  onClick={() => setSelectedProject(p)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white text-kat-navy border border-kat-border hover:bg-kat-soft hover:text-kat-primary py-3 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>VIEW PROJECT DETAILS</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-kat-navy/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-kat-border relative animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-kat-border pb-4 mb-6">
              <div>
                <span className="text-xs font-bold text-kat-primary uppercase tracking-wider">{selectedProject.category}</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-kat-navy mt-1">{selectedProject.title}</h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-kat-muted hover:text-kat-navy p-1 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-kat-muted leading-relaxed">{selectedProject.fullDesc}</p>
              
              <div>
                <h4 className="text-xs font-bold text-kat-navy uppercase tracking-wider mb-2">Technical Specifications</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProject.specs.map((spec, i) => (
                    <div key={i} className="text-xs font-semibold text-kat-navy bg-kat-soft p-2.5 rounded-xl border border-kat-border">
                      • {spec}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-kat-border flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-6 py-2.5 bg-kat-primary text-white font-bold text-xs rounded-xl hover:bg-kat-deep transition-all"
              >
                Close Showcase
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
