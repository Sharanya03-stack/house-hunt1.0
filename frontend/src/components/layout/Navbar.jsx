import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Menu, X, Sun, Moon, Bell, User, ChevronDown,
  Heart, Calendar, LayoutDashboard, LogOut, PlusCircle,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'owner') return '/dashboard';
    return '/my/favorites';
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled
          ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl shadow-sm border-b border-gray-100/80 dark:border-gray-800/80'
          : 'bg-transparent'
        }`}
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center shadow-primary/30 shadow-md group-hover:shadow-primary/50 transition-shadow">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className={`font-bold text-xl tracking-tight transition-colors
              ${scrolled ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}`}>
              House<span className="text-primary-600">Hunt</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { to: '/', label: 'Home', end: true },
              { to: '/properties', label: 'Properties' },
              { to: '/properties?listing_type=rent', label: 'Rent' },
              { to: '/properties?listing_type=buy', label: 'Buy' },
            ].map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400'
                    : `text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white`
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark'
                ? <Sun className="w-5 h-5 text-amber-400" />
                : <Moon className="w-5 h-5 text-gray-600" />
              }
            </button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden md:flex">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* Post Property (owner) */}
                {user?.role === 'owner' && (
                  <Link to="/dashboard/add-property" className="hidden md:flex btn-primary text-sm py-2 px-4">
                    <PlusCircle className="w-4 h-4" />
                    List Property
                  </Link>
                )}

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <img
                      src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=3b82f6&color=fff`}
                      alt={user?.name}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 max-w-24 truncate">
                      {user?.name}
                    </span>
                    <ChevronDown className={`hidden md:block w-4 h-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 z-20 overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                          </div>
                          <div className="py-2">
                            <Link
                              to={getDashboardLink()}
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4 text-gray-400" />
                              Dashboard
                            </Link>
                            {user?.role === 'seeker' && (
                              <Link
                                to="/my/favorites"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                              >
                                <Heart className="w-4 h-4 text-gray-400" />
                                Saved Properties
                              </Link>
                            )}
                            <Link
                              to={user?.role === 'seeker' ? '/my/bookings' : '/dashboard/bookings'}
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <Calendar className="w-4 h-4 text-gray-400" />
                              Bookings
                            </Link>
                          </div>
                          <div className="border-t border-gray-100 dark:border-gray-800 py-2">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm hidden md:flex">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">Get Started</Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800"
          >
            <div className="page-container py-4 space-y-1">
              {[
                { to: '/', label: 'Home' },
                { to: '/properties', label: 'All Properties' },
                { to: '/properties?listing_type=rent', label: 'For Rent' },
                { to: '/properties?listing_type=buy', label: 'For Sale' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 btn-secondary text-sm text-center">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 btn-primary text-sm text-center">Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
