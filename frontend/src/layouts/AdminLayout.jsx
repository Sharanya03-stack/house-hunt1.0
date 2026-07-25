import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, LogOut, Home } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/properties', label: 'Properties', icon: Building2 },
];

export default function AdminLayout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="px-6 py-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-600 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">HouseHunt</span>
              <span className="text-gray-400 text-xs">Admin Panel</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium
                ${isActive ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-4 space-y-1 border-t border-gray-800 pt-4">
          <NavLink to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all text-sm font-medium">
            <Home className="w-5 h-5" />
            View Site
          </NavLink>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-900/20 transition-all text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center px-6">
          <h1 className="font-semibold text-gray-900 dark:text-white">Admin Panel</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
