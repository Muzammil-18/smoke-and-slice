import React, { useState, useEffect } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, LogOut, Flame, Layers, Utensils, ShoppingBag, Users, Menu, X, ArrowLeft, Bell } from 'lucide-react'

function AdminLayout({ user, onLogout, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchPendingCount = async () => {
      try {
        const res = await fetch('/api/admin/orders/pending-count', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPendingCount(data.pendingCount || 0);
        }
      } catch (err) {}
    };

    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      if (data.role !== 'admin') throw new Error('Access denied. Admin privileges required.');
      onLogin(data);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
        <Link to="/" className="flex items-center space-x-2 text-neutral-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Main Website</span>
        </Link>
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <Flame className="w-12 h-12 text-primary animate-pulse mb-3" />
            <h1 className="text-2xl font-extrabold text-white tracking-wide">SMOKE & SLICE</h1>
            <p className="text-xs text-neutral-400 mt-1">ADMIN PORTAL LOGIN</p>
          </div>
          {error && (
            <div className="bg-primary/10 border border-primary/30 text-primary text-sm p-4 rounded-lg mb-6">{error}</div>
          )}
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Admin Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm" placeholder="admin@smokeslice.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-primary/20 flex justify-center items-center">
              {loading ? 'Authenticating...' : 'Access Admin Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Menu Items', path: '/admin/menu', icon: Utensils },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Customers', path: '/admin/customers', icon: Users },
  ];

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans flex flex-col">
      <header className="h-16 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-40">
        <div className="flex items-center space-x-3">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-neutral-400 hover:text-white focus:outline-none">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <Flame className="w-6 h-6 text-primary" />
            <span className="font-extrabold text-lg tracking-wider text-white hidden sm:inline">
              SMOKE & SLICE <span className="text-xs text-primary font-medium tracking-normal block sm:inline sm:ml-2">ADMIN</span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link to="/" className="text-xs font-semibold text-neutral-400 hover:text-white px-3 py-1.5 border border-neutral-800 rounded-lg transition-colors hidden sm:block">
            Main Site
          </Link>

          <Link
            to="/admin/orders"
            className="relative p-2 text-neutral-400 hover:text-white transition-colors"
            title="Pending Orders Notifications"
          >
            <Bell className="w-5 h-5" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-primary/40">
                {pendingCount > 99 ? '99+' : pendingCount}
              </span>
            )}
          </Link>

          <div className="flex items-center space-x-2 text-sm text-neutral-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse hidden sm:inline-block"></span>
            <span className="font-medium hidden sm:inline">{user.name}</span>
          </div>

          <button onClick={handleLogout} className="p-2 text-neutral-400 hover:text-primary transition-colors focus:outline-none" title="Log Out">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
        )}

        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col transition-transform duration-300 transform md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-800 md:hidden">
            <span className="font-extrabold text-white">Navigation</span>
            <button onClick={() => setSidebarOpen(false)} className="text-neutral-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {item.label === 'Orders' && pendingCount > 0 && (
                    <span className="ml-auto bg-primary text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto bg-neutral-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
