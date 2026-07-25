import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, PlusCircle, List, Calendar, User,
  Heart, ChevronLeft, Menu, X, LogOut, Bell, Home,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const ownerLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/dashboard/add-property', label: 'Add Property', icon: PlusCircle },
    { to: '/dashboard/listings', label: 'My Listings', icon: List },
    { to: '/dashboard/bookings', label: 'Bookings', icon: Calendar },
    { to: '/dashboard/profile', label: 'Profile', icon: User },
  ];

  const seekerLinks = [
    { to: '/my/favorites', label: 'Saved Properties', icon: Heart },
    { to: '/my/bookings', label: 'My Visits', icon: Calendar },
    { to: '/my/profile', label: 'Profile', icon: User },
  ];

  const links = user?.role === 'seeker' ? seekerLinks : ownerLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Home className="w-5 h-5 text-white" />
        </div>
        {sidebarOpen && (
          <span className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">
            HouseHunt
          </span>
        )}
      </div>

      {/* User info */}
      {sidebarOpen && (
        <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name}&background=3b82f6&color=fff`}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-primary-100"
            />
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
              ${isActive
                ? 'bg-primary-600 text-white shadow-primary'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium text-sm">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="px-3 pb-4 space-y-1 border-t border-gray-100 dark:border-gray-800 pt-4">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all"
        >
          <Home className="w-5 h-5" />
          {sidebarOpen && <span className="font-medium text-sm">Browse Properties</span>}
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
        >
          <LogOut className="w-5 h-5" />
          {sidebarOpen && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 256 : 72 }}
        transition={{ duration: 0.3 }}
        className="hidden lg:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex-shrink-0 relative"
      >
        <SidebarContent />
        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-8 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className={`w-3.5 h-3.5 text-gray-500 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
        </button>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 flex-shrink-0">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          <div className="hidden lg:block">
            <h1 className="text-gray-900 dark:text-white font-semibold">
              {user?.role === 'owner' ? 'Owner Dashboard' : 'My Account'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <img
              src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name}&background=3b82f6&color=fff`}
              alt={user?.name}
              className="w-9 h-9 rounded-xl object-cover border-2 border-primary-100"
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
