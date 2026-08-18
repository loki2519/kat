import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BarChart3, PieChart, TrendingUp, Award, Layers } from 'lucide-react';

export default function AnalyticsView() {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics/overview', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(d => {
        setAnalytics(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  if (loading || !analytics) {
    return (
      <div className="p-8 text-center text-xs text-kat-muted font-bold">
        Loading analytics charts and conversion metrics...
      </div>
    );
  }

  const { metrics, popularServices, statusCounts } = analytics;

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-kat-navy">Analytics &amp; Intelligence</h1>
        <p className="text-xs text-kat-muted mt-1">Real-time performance metrics, popular services, and conversion breakdown</p>
      </div>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Popular Services Chart / List */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-kat-border shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-kat-primary" />
            <h3 className="text-lg font-extrabold text-kat-navy">Most Requested Services</h3>
          </div>

          {popularServices.length === 0 ? (
            <p className="text-xs text-kat-muted">No service data recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {popularServices.map((item, i) => {
                const percentage = Math.round((item.count / metrics.totalQuotes) * 100) || 0;
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-kat-navy">
                      <span>{item.service}</span>
                      <span className="text-kat-primary">{item.count} Quotes ({percentage}%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-kat-soft rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-kat-deep to-kat-bright rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Status Breakdown Grid */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-kat-border shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <PieChart className="w-5 h-5 text-kat-primary" />
            <h3 className="text-lg font-extrabold text-kat-navy">Quotation Lifecycle Statuses</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="p-4 rounded-2xl bg-kat-verylight border border-kat-border">
                <span className="text-[10px] font-bold text-kat-muted uppercase block mb-1">{status}</span>
                <span className="text-xl font-black text-kat-navy">{count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
