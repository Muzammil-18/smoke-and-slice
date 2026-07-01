import React, { useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingCart, User, LogOut, Flame, Phone, MapPin, Clock } from 'lucide-react'

function Layout({ user, cart, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const isActive = (path) => {
    return location.pathname === path ? 'text-primary' : 'text-neutral-300 hover:text-white';
  };

  const handleLogout = () => {
    onLogout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      <header className="sticky top-0 z-50 glass border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Flame className="w-8 h-8 text-primary animate-pulse" />
                <span className="font-extrabold text-2xl tracking-wider text-white">
                  SMOKE <span className="text-primary">&</span> SLICE
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex space-x-8 text-sm font-medium">
              <Link to="/" className={`${isActive('/')} transition-colors duration-200`}>Home</Link>
              <Link to="/menu" className={`${isActive('/menu')} transition-colors duration-200`}>Menu</Link>
              <Link to="/about" className={`${isActive('/about')} transition-colors duration-200`}>About Us</Link>
              <Link to="/contact" className={`${isActive('/contact')} transition-colors duration-200`}>Contact</Link>
              {user && (
                <>
                  <Link to="/my-orders" className={`${isActive('/my-orders')} transition-colors duration-200`}>My Orders</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin/dashboard" className="text-amber-500 hover:text-amber-400 transition-colors duration-200 font-semibold">Admin Panel</Link>
                  )}
                </>
              )}
            </nav>

            <div className="hidden md:flex items-center space-x-6">
              <Link to="/cart" className="relative p-2 text-neutral-300 hover:text-white transition-colors duration-200">
                <ShoppingCart className="w-6 h-6" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {totalCartItems}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="flex items-center space-x-2 text-neutral-300 hover:text-white transition-colors duration-200">
                    <User className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                  </Link>
                  <button onClick={handleLogout} className="flex items-center space-x-1 text-sm font-medium text-neutral-400 hover:text-primary transition-colors duration-200">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors duration-200">
                    Login
                  </Link>
                  <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            <div className="flex md:hidden items-center space-x-4">
              <Link to="/cart" className="relative p-2 text-neutral-300 hover:text-white">
                <ShoppingCart className="w-6 h-6" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {totalCartItems}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-neutral-300 hover:text-white outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-neutral-900 border-b border-neutral-800 animate-fadeIn">
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-md text-base font-medium text-neutral-300 hover:text-white hover:bg-neutral-800"
              >
                Home
              </Link>
              <Link
                to="/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-md text-base font-medium text-neutral-300 hover:text-white hover:bg-neutral-800"
              >
                Menu
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-md text-base font-medium text-neutral-300 hover:text-white hover:bg-neutral-800"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-md text-base font-medium text-neutral-300 hover:text-white hover:bg-neutral-800"
              >
                Contact
              </Link>
              {user && (
                <>
                  <Link
                    to="/my-orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-3 rounded-md text-base font-medium text-neutral-300 hover:text-white hover:bg-neutral-800"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-3 rounded-md text-base font-medium text-neutral-300 hover:text-white hover:bg-neutral-800"
                  >
                    My Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-3 rounded-md text-base font-medium text-amber-500 hover:text-amber-400 hover:bg-neutral-800"
                    >
                      Admin Panel
                    </Link>
                  )}
                </>
              )}
              <div className="pt-4 pb-2 border-t border-neutral-800 mt-2">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center space-x-2 bg-neutral-800 hover:bg-primary text-white py-3 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <div className="flex flex-col space-y-2 px-3">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center text-center text-sm font-medium text-neutral-300 hover:text-white py-2.5"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center text-center bg-primary hover:bg-primary-dark text-white py-3 rounded-md text-sm font-semibold transition-all duration-200"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-neutral-950 border-t border-neutral-900 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Flame className="w-7 h-7 text-primary" />
                <span className="font-extrabold text-xl tracking-wider text-white">
                  SMOKE <span className="text-primary">&</span> SLICE
                </span>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Taste the tradition of slow wood-fired BBQ, gourmet hand-crafted pizzas, and dry-aged burgers crafted by our culinary experts.
              </p>
              <div className="flex space-x-4 pt-2">
                <a href="#" className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:bg-primary hover:text-white transition-colors duration-200">
                  <span className="sr-only">Facebook</span>
                  🔥
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:bg-primary hover:text-white transition-colors duration-200">
                  <span className="sr-only">Instagram</span>
                  🍕
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:bg-primary hover:text-white transition-colors duration-200">
                  <span className="sr-only">Twitter</span>
                  🍔
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold text-base mb-6">Opening Hours</h3>
              <ul className="space-y-3 text-neutral-400 text-sm">
                <li className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Mon - Thu: 11:00 AM - 10:00 PM</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Fri - Sat: 11:00 AM - 11:00 PM</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Sunday: 12:00 PM - 9:00 PM</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-base mb-6">Contact Info</h3>
              <ul className="space-y-3 text-neutral-400 text-sm">
                <li className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <span>100 Smokehouse Way, Austin, TX 78701</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>+1 (555) 0199</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-primary flex-shrink-0">✉</span>
                  <span>info@smokeslice.com</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-base mb-6">Quick Links</h3>
              <ul className="space-y-3 text-neutral-400 text-sm">
                <li><Link to="/menu" className="hover:text-primary transition-colors duration-200">Browse Menu</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors duration-200">Our Story</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors duration-200">Get in Touch</Link></li>
                <li><Link to="/privacy" className="hover:text-primary transition-colors duration-200">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-900 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-neutral-500 text-xs">
            <p>&copy; {new Date().getFullYear()} Smoke & Slice. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-neutral-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-neutral-400 transition-colors">Privacy Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
