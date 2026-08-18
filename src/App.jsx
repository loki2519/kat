import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';

// Public Components
import Navbar from './components/common/Navbar';
import Hero from './components/public/Hero';
import About from './components/public/About';
import Services from './components/public/Services';
import Process from './components/public/Process';
import WhyKat from './components/public/WhyKat';
import Portfolio from './components/public/Portfolio';
import Pricing from './components/public/Pricing';
import Testimonials from './components/public/Testimonials';
import ReviewsSection from './components/public/ReviewsSection';
import FAQ from './components/public/FAQ';
import Contact from './components/public/Contact';
import QuoteModal from './components/public/QuoteModal';
import Footer from './components/common/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';

// Admin Components
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import QuoteManager from './components/admin/QuoteManager';
import PaymentTracker from './components/admin/PaymentTracker';
import AnalyticsView from './components/admin/AnalyticsView';
import ReviewsManager from './components/admin/ReviewsManager';

// Unified Admin Route Container
function AdminPageContainer() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ backgroundColor: '#081B33', color: '#FFFFFF' }} className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="bg-white text-slate-900 p-8 rounded-3xl shadow-xl max-w-sm w-full space-y-4 border-2 border-blue-200">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Verifying KAT Admin Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <AdminLayout />;
}

// Public Landing Page Component
function PublicLanding() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quoteService, setQuoteService] = useState('');
  const [initialTab, setInitialTab] = useState('request');

  const handleOpenQuote = (arg = '') => {
    if (arg === 'track') {
      setInitialTab('track');
      setQuoteService('');
    } else {
      setInitialTab('request');
      setQuoteService(typeof arg === 'string' && arg !== 'request' ? arg : '');
    }
    setIsQuoteOpen(true);
  };

  return (
    <div className="min-h-screen bg-kat-offwhite flex flex-col relative">
      <Navbar onOpenQuote={(mode) => handleOpenQuote(mode)} />

      <main className="flex-1">
        <Hero onOpenQuote={() => handleOpenQuote()} />
        <About />
        <Services onOpenQuote={(svc) => handleOpenQuote(svc)} />
        <Process />
        <WhyKat />
        <Portfolio />
        <Pricing onOpenQuote={(svc) => handleOpenQuote(svc)} />
        <Testimonials />
        <ReviewsSection />
        <FAQ />
        <Contact />
      </main>

      <Footer onOpenQuote={() => handleOpenQuote()} />

      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        initialService={quoteService}
        initialTab={initialTab}
      />

      {/* Floating WhatsApp Chat Button */}
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          {/* Public Main Corporate Landing Page */}
          <Route path="/" element={<PublicLanding />} />

          {/* Private Admin Portal Main Route */}
          <Route path="/admin" element={<AdminPageContainer />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="quotes" element={<QuoteManager />} />
            <Route path="payments" element={<PaymentTracker />} />
            <Route path="analytics" element={<AnalyticsView />} />
            <Route path="reviews" element={<ReviewsManager />} />
          </Route>

          {/* Wildcard Subroute Handler for /admin/* */}
          <Route path="/admin/*" element={<AdminPageContainer />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="quotes" element={<QuoteManager />} />
            <Route path="payments" element={<PaymentTracker />} />
            <Route path="analytics" element={<AnalyticsView />} />
            <Route path="reviews" element={<ReviewsManager />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}
