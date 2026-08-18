import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, FileText, CreditCard, BarChart3, MessageSquare, LogOut, Menu, X, Shield, Globe, Megaphone } from 'lucide-react';
import logoSvg from '../../assets/kat-logo.png';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Quotation Management', path: '/admin/quotes', icon: FileText },
    { name: 'Payment Records', path: '/admin/payments', icon: CreditCard },
    { name: 'Analytics & Reports', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Reviews & Moderation', path: '/admin/reviews', icon: MessageSquare },
    { name: 'News Management', path: '/admin/news', icon: Megaphone },
  ];

  return (
    <div style={{ backgroundColor: '#F4F8FF', minHeight: '100vh' }} className="flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* Top Header Bar for Mobile & Tablet */}
      <div style={{ backgroundColor: '#081B33', color: '#FFFFFF' }} className="md:hidden p-4 flex items-center justify-between border-b border-blue-500/20 shadow-md">
        <div className="flex items-center gap-2">
          <img src={logoSvg} alt="KAT Admin" className="h-8 w-auto object-contain brightness-0 invert" />
          <span className="text-xs font-black text-blue-400 uppercase tracking-wider">Admin Portal</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl text-white hover:bg-white/10 focus:outline-none"
          aria-label="Toggle Admin Navigation"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        style={{ backgroundColor: '#081B33', color: '#FFFFFF' }}
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 flex flex-col justify-between p-6 shadow-2xl transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-8">
          {/* Logo Header */}
          <div className="flex flex-col space-y-2">
            <div className="h-12 flex items-center">
              <img src={logoSvg} alt="KAT Logo" className="h-10 w-auto object-contain brightness-0 invert" />
            </div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-blue-400 uppercase tracking-wider bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>PRIVATE MANAGEMENT</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg border border-blue-400/40'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Info & Logout */}
        <div className="pt-6 border-t border-white/10 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div>
              <div className="font-extrabold text-white">{user?.username || 'admin'}</div>
              <span className="text-[10px] text-blue-400 font-bold">System Administrator</span>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-white/10 text-blue-400 hover:bg-white/20"
              title="View Public Website"
            >
              <Globe className="w-4 h-4" />
            </a>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs font-bold transition-colors cursor-pointer border border-red-500/30"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl overflow-y-auto min-h-screen">
        <Outlet />
      </main>

    </div>
  );
}
